import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Lead, LeadFormData, LeadFilterState, DashboardStats, BackupData, LeadStatus } from '../types/database';
import { supabase } from '../lib/supabase';
import { calculatePending, getTodayDateString } from '../lib/utils';
import { useAuth } from './AuthContext';

interface LeadsContextType {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  realtimeStatus: 'connected' | 'connecting' | 'disconnected';
  filterState: LeadFilterState;
  setFilterState: React.Dispatch<React.SetStateAction<LeadFilterState>>;
  filteredLeads: Lead[];
  stats: DashboardStats;
  getLeadById: (id: string) => Lead | undefined;
  createLead: (data: LeadFormData) => Promise<{ lead?: Lead; error?: string }>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<{ success: boolean; error?: string }>;
  updateStatus: (id: string, status: LeadStatus) => Promise<{ success: boolean; error?: string }>;
  updatePayment: (id: string, total: number, paid: number, note?: string) => Promise<{ success: boolean; error?: string }>;
  updateFollowup: (id: string, date: string | null, note?: string) => Promise<{ success: boolean; error?: string }>;
  archiveLead: (id: string) => Promise<{ success: boolean; error?: string }>;
  restoreLead: (id: string) => Promise<{ success: boolean; error?: string }>;
  deleteLeadPermanently: (id: string) => Promise<{ success: boolean; error?: string }>;
  exportLeadsToJson: () => void;
  importLeadsFromJson: (importedLeads: Lead[], mode: 'append' | 'replace') => Promise<{ count: number; error?: string }>;
  refreshLeads: () => Promise<void>;
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

// Helper to normalize and compute pending_amount
const processLeadRecord = (raw: any): Lead => {
  const total = Number(raw.total_amount) || 0;
  const paid = Number(raw.paid_amount) || 0;
  return {
    ...raw,
    total_amount: total,
    paid_amount: paid,
    pending_amount: calculatePending(total, paid),
    is_archived: Boolean(raw.is_archived),
  };
};

export const LeadsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');

  const [filterState, setFilterState] = useState<LeadFilterState>({
    search: '',
    status: 'ALL',
    program: 'ALL',
    source: 'ALL',
    followup: 'all',
    showArchived: false,
  });

  // 1. Initial Data Fetch from Cloud Database (Supabase PostgreSQL)
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const processed = (data || []).map(processLeadRecord);
      setLeads(processed);
      setRealtimeStatus('connected');
    } catch (err: any) {
      console.error('Failed to fetch leads from Supabase cloud database:', err);
      setError(err.message || 'Failed to connect to cloud database');
      setRealtimeStatus('disconnected');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads, user]);

  // 2. Realtime WebSocket Subscription (Live sync across Laptop, Mobile & all devices)
  useEffect(() => {
    setRealtimeStatus('connecting');

    const channel = supabase
      .channel('leads-realtime-global')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'leads' },
        (payload) => {
          if (!payload.new) return;
          const newLead = processLeadRecord(payload.new);
          setLeads((prev) => {
            if (prev.some((l) => l.id === newLead.id)) {
              return prev.map((l) => (l.id === newLead.id ? newLead : l));
            }
            return [newLead, ...prev];
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'leads' },
        (payload) => {
          if (!payload.new) return;
          const updatedLead = processLeadRecord(payload.new);
          setLeads((prev) =>
            prev.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead))
          );
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'leads' },
        (payload) => {
          const deletedId = (payload.old as { id: string })?.id;
          if (deletedId) {
            setLeads((prev) => prev.filter((lead) => lead.id !== deletedId));
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setRealtimeStatus('connected');
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setRealtimeStatus('disconnected');
        } else {
          setRealtimeStatus('connecting');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 3. Computed Filtered Leads
  const filteredLeads = useMemo(() => {
    const todayStr = getTodayDateString();

    return leads.filter((lead) => {
      // Archive toggle
      if (filterState.showArchived) {
        if (!lead.is_archived) return false;
      } else {
        if (lead.is_archived) return false;
      }

      // Search filter (name, phone, email, notes)
      if (filterState.search.trim()) {
        const query = filterState.search.toLowerCase().trim();
        const nameMatch = lead.full_name.toLowerCase().includes(query);
        const phoneMatch = lead.phone.toLowerCase().includes(query);
        const emailMatch = lead.email ? lead.email.toLowerCase().includes(query) : false;
        const notesMatch = lead.notes ? lead.notes.toLowerCase().includes(query) : false;
        if (!nameMatch && !phoneMatch && !emailMatch && !notesMatch) {
          return false;
        }
      }

      // Status filter
      if (filterState.status !== 'ALL' && lead.status !== filterState.status) {
        return false;
      }

      // Program filter
      if (filterState.program !== 'ALL') {
        if (filterState.program === 'Custom') {
          if (lead.interested_program !== 'Custom') return false;
        } else if (lead.interested_program !== filterState.program) {
          return false;
        }
      }

      // Source filter
      if (filterState.source !== 'ALL') {
        if (lead.source !== filterState.source) return false;
      }

      // Follow-up filter
      if (filterState.followup !== 'all') {
        const followDate = lead.next_followup_date?.split('T')[0];
        if (filterState.followup === 'none') {
          if (followDate) return false;
        } else if (filterState.followup === 'today') {
          if (followDate !== todayStr) return false;
        } else if (filterState.followup === 'overdue') {
          if (!followDate || followDate >= todayStr) return false;
        } else if (filterState.followup === 'upcoming') {
          if (!followDate || followDate <= todayStr) return false;
        }
      }

      return true;
    });
  }, [leads, filterState]);

  // 4. Computed Dashboard Statistics (Updates live via Realtime events)
  const stats = useMemo<DashboardStats>(() => {
    const activeLeads = leads.filter((l) => !l.is_archived);
    const todayStr = getTodayDateString();

    let newLeads = 0;
    let contacted = 0;
    let followUp = 0;
    let interested = 0;
    let converted = 0;
    let notConverted = 0;
    let notResponding = 0;
    let followUpsToday = 0;
    let overdueFollowUps = 0;
    let totalRevenue = 0;
    let totalCollected = 0;

    activeLeads.forEach((lead) => {
      // Status counts
      switch (lead.status) {
        case 'New':
          newLeads++;
          break;
        case 'Contacted':
          contacted++;
          break;
        case 'Follow-up':
          followUp++;
          break;
        case 'Interested':
          interested++;
          break;
        case 'Converted':
          converted++;
          break;
        case 'Not Converted':
          notConverted++;
          break;
        case 'Not Responding':
          notResponding++;
          break;
      }

      // Follow-up calculations
      if (lead.next_followup_date) {
        const dateOnly = lead.next_followup_date.split('T')[0];
        if (dateOnly === todayStr) {
          followUpsToday++;
        } else if (dateOnly < todayStr) {
          overdueFollowUps++;
        }
      }

      // Financials
      totalRevenue += Number(lead.total_amount) || 0;
      totalCollected += Number(lead.paid_amount) || 0;
    });

    const totalLeads = activeLeads.length;
    const conversionRate = totalLeads > 0 ? Math.round((converted / totalLeads) * 1000) / 10 : 0;
    const totalPending = Math.max(0, totalRevenue - totalCollected);

    return {
      totalLeads,
      newLeads,
      contacted,
      followUp,
      interested,
      converted,
      notConverted,
      notResponding,
      followUpsToday,
      overdueFollowUps,
      conversionRate,
      totalRevenue,
      totalCollected,
      totalPending,
    };
  }, [leads]);

  // 5. Cloud CRUD Operations (Direct Supabase API Calls)
  const getLeadById = useCallback(
    (id: string) => leads.find((l) => l.id === id),
    [leads]
  );

  const createLead = async (data: LeadFormData): Promise<{ lead?: Lead; error?: string }> => {
    try {
      const payload = {
        full_name: data.full_name.trim(),
        phone: data.phone.trim(),
        email: data.email.trim() || null,
        interested_program: data.interested_program,
        custom_program: data.interested_program === 'Custom' ? data.custom_program.trim() || null : null,
        status: data.status,
        source: data.source,
        custom_source: data.source === 'Other' ? data.custom_source.trim() || null : null,
        notes: data.notes.trim() || null,
        next_followup_date: data.next_followup_date || null,
        followup_note: data.followup_note.trim() || null,
        total_amount: Number(data.total_amount) || 0,
        paid_amount: Number(data.paid_amount) || 0,
        payment_note: data.payment_note.trim() || null,
        is_archived: false,
        user_id: user?.id || null,
      };

      const { data: inserted, error: insertError } = await supabase
        .from('leads')
        .insert([payload])
        .select()
        .single();

      if (insertError) throw insertError;

      const created = processLeadRecord(inserted);

      // Local optimistic update (will also be synced via Realtime)
      setLeads((prev) => {
        if (prev.some((l) => l.id === created.id)) return prev;
        return [created, ...prev];
      });

      return { lead: created };
    } catch (err: any) {
      console.error('Error creating lead in Supabase:', err);
      return { error: err.message || 'Failed to create lead in database' };
    }
  };

  const updateLead = async (id: string, updates: Partial<Lead>): Promise<{ success: boolean; error?: string }> => {
    try {
      const payload: any = {
        ...updates,
        updated_at: new Date().toISOString(),
      };
      delete payload.pending_amount;

      const { error: updateError } = await supabase
        .from('leads')
        .update(payload)
        .eq('id', id);

      if (updateError) throw updateError;

      // Optimistic update
      setLeads((prev) =>
        prev.map((lead) => {
          if (lead.id === id) {
            return processLeadRecord({ ...lead, ...payload });
          }
          return lead;
        })
      );

      return { success: true };
    } catch (err: any) {
      console.error('Error updating lead in Supabase:', err);
      return { success: false, error: err.message || 'Failed to update lead in database' };
    }
  };

  const updateStatus = async (id: string, status: LeadStatus) => {
    return updateLead(id, { status });
  };

  const updatePayment = async (id: string, total: number, paid: number, note?: string) => {
    const totalAmount = Number(total) || 0;
    const paidAmount = Number(paid) || 0;
    return updateLead(id, {
      total_amount: totalAmount,
      paid_amount: paidAmount,
      payment_note: note !== undefined ? note : undefined,
    });
  };

  const updateFollowup = async (id: string, date: string | null, note?: string) => {
    return updateLead(id, {
      next_followup_date: date,
      followup_note: note !== undefined ? note : undefined,
    });
  };

  const archiveLead = async (id: string) => {
    return updateLead(id, { is_archived: true });
  };

  const restoreLead = async (id: string) => {
    return updateLead(id, { is_archived: false });
  };

  const deleteLeadPermanently = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error: deleteError } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setLeads((prev) => prev.filter((lead) => lead.id !== id));
      return { success: true };
    } catch (err: any) {
      console.error('Error permanently deleting lead from Supabase:', err);
      return { success: false, error: err.message || 'Failed to delete lead from database' };
    }
  };

  // 6. JSON Export
  const exportLeadsToJson = () => {
    try {
      const today = getTodayDateString();
      const backup: BackupData = {
        version: '1.0',
        exported_at: new Date().toISOString(),
        academy: 'EV Cyber Academy',
        total_count: leads.length,
        leads: leads,
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `ev-cyber-academy-leads-backup-${today}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error('Export failed:', e);
    }
  };

  // 7. JSON Import to Supabase Database
  const importLeadsFromJson = async (
    importedLeads: Lead[],
    mode: 'append' | 'replace'
  ): Promise<{ count: number; error?: string }> => {
    try {
      if (!Array.isArray(importedLeads) || importedLeads.length === 0) {
        return { count: 0, error: 'The provided JSON file contains no valid leads data.' };
      }

      const now = new Date().toISOString();
      const sanitized = importedLeads.map((item) => {
        const total = Number(item.total_amount) || 0;
        const paid = Number(item.paid_amount) || 0;
        return {
          id: item.id && item.id.length === 36 ? item.id : undefined, // Keep valid UUIDs or let PostgreSQL generate
          full_name: String(item.full_name || 'Unnamed Lead').trim(),
          phone: String(item.phone || '').trim(),
          email: item.email ? String(item.email).trim() : null,
          interested_program: item.interested_program || 'LFHP',
          custom_program: item.custom_program ? String(item.custom_program).trim() : null,
          status: (item.status as LeadStatus) || 'New',
          source: item.source || 'Website',
          custom_source: item.custom_source ? String(item.custom_source).trim() : null,
          notes: item.notes ? String(item.notes).trim() : null,
          next_followup_date: item.next_followup_date || null,
          followup_note: item.followup_note ? String(item.followup_note).trim() : null,
          total_amount: total,
          paid_amount: paid,
          payment_note: item.payment_note ? String(item.payment_note).trim() : null,
          is_archived: Boolean(item.is_archived),
          created_at: item.created_at || now,
          updated_at: now,
          user_id: user?.id || null,
        };
      });

      if (mode === 'replace') {
        // Delete all non-null records from Supabase
        await supabase.from('leads').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        const { error: insertErr } = await supabase.from('leads').insert(sanitized);
        if (insertErr) throw insertErr;
      } else {
        const { error: insertErr } = await supabase.from('leads').upsert(sanitized, { onConflict: 'id' });
        if (insertErr) throw insertErr;
      }

      await fetchLeads();
      return { count: sanitized.length };
    } catch (err: any) {
      console.error('Import error to Supabase:', err);
      return { count: 0, error: err.message || 'Failed to import backup data to cloud database' };
    }
  };

  return (
    <LeadsContext.Provider
      value={{
        leads,
        loading,
        error,
        realtimeStatus,
        filterState,
        setFilterState,
        filteredLeads,
        stats,
        getLeadById,
        createLead,
        updateLead,
        updateStatus,
        updatePayment,
        updateFollowup,
        archiveLead,
        restoreLead,
        deleteLeadPermanently,
        exportLeadsToJson,
        importLeadsFromJson,
        refreshLeads: fetchLeads,
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeads = (): LeadsContextType => {
  const context = useContext(LeadsContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
};
