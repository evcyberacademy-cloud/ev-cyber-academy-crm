import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Lead, LeadFormData, LeadFilterState, DashboardStats, BackupData, LeadStatus } from '../types/database';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { calculatePending, getTodayDateString } from '../lib/utils';
import { useAuth } from './AuthContext';

interface LeadsContextType {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  realtimeStatus: 'connected' | 'connecting' | 'disconnected' | 'mock';
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

const LOCAL_STORAGE_LEADS_KEY = 'ev_crm_mock_leads_data';

// Initial sample data for instant local testing when keys are pending
const INITIAL_DEMO_LEADS: Lead[] = [
  {
    id: 'lead-001',
    full_name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@example.com',
    interested_program: 'LFHP',
    custom_program: null,
    status: 'New',
    source: 'Instagram',
    custom_source: null,
    notes: 'Enquired about Live Forensics & Threat Hunting weekend batch.',
    next_followup_date: getTodayDateString(),
    followup_note: 'Call morning 11 AM regarding weekend batch syllabus',
    total_amount: 15000,
    paid_amount: 0,
    payment_note: 'Fee quotation sent via WhatsApp',
    is_archived: false,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'lead-002',
    full_name: 'Pooja Patel',
    phone: '+91 98123 45678',
    email: 'pooja.p@example.com',
    interested_program: 'LWAP',
    custom_program: null,
    status: 'Follow-up',
    source: 'WhatsApp',
    custom_source: null,
    notes: 'Looking for Web Application Penetration Testing lab syllabus.',
    next_followup_date: getTodayDateString(),
    followup_note: 'Send recorded demo session and batch discount code',
    total_amount: 12000,
    paid_amount: 2000,
    payment_note: 'Token amount ₹2,000 paid via UPI. Remaining ₹10,000 due on batch start.',
    is_archived: false,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'lead-003',
    full_name: 'Amit Verma',
    phone: '+91 97234 56789',
    email: 'amit.verma@gmail.com',
    interested_program: 'LFHP Mini',
    custom_program: null,
    status: 'Interested',
    source: 'Webinar',
    custom_source: null,
    notes: 'Attended Sunday Cyber Threat Intelligence Masterclass.',
    next_followup_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    followup_note: 'Follow up after salary credit date (10th)',
    total_amount: 7500,
    paid_amount: 0,
    payment_note: 'Awaiting confirmation',
    is_archived: false,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'lead-004',
    full_name: 'Vikram Singh',
    phone: '+91 98345 67890',
    email: 'vikram.s@outlook.com',
    interested_program: 'AI Cyber Tool Building Workshop',
    custom_program: null,
    status: 'Converted',
    source: 'Website',
    custom_source: null,
    notes: 'Completed full enrollment for AI Cyber Tools Workshop.',
    next_followup_date: null,
    followup_note: 'Student onboarded to Discord and LMS.',
    total_amount: 4999,
    paid_amount: 4999,
    payment_note: 'Full payment received ₹4,999. Invoice #EV-2026-104 sent.',
    is_archived: false,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'lead-005',
    full_name: 'Sneha Joshi',
    phone: '+91 98456 78901',
    email: 'sneha.j@techmail.com',
    interested_program: 'Internship',
    custom_program: null,
    status: 'Contacted',
    source: 'Referral',
    custom_source: null,
    notes: 'Referred by Alumni Kunal for 3-Month Cyber Security Internship.',
    next_followup_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    followup_note: 'Interview scheduled. Confirm timing.',
    total_amount: 10000,
    paid_amount: 0,
    payment_note: 'Pending interview evaluation',
    is_archived: false,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'lead-006',
    full_name: 'Arjun Nair',
    phone: '+91 98901 23456',
    email: 'arjun.nair@corp.in',
    interested_program: 'Custom',
    custom_program: 'Corporate Incident Response Training',
    status: 'Not Converted',
    source: 'Direct',
    custom_source: null,
    notes: 'Requested offline classroom training. We offer live interactive online.',
    next_followup_date: null,
    followup_note: 'Not converted due to offline requirement. Retained for future.',
    total_amount: 0,
    paid_amount: 0,
    payment_note: 'No payment',
    is_archived: false,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'lead-007',
    full_name: 'Meera Reddy',
    phone: '+91 98712 34567',
    email: 'meera.reddy@yahoo.com',
    interested_program: 'LFHP',
    custom_program: null,
    status: 'Converted',
    source: 'YouTube',
    custom_source: null,
    notes: 'Enrolled after watching EV Cyber Academy Malware Analysis series.',
    next_followup_date: null,
    followup_note: 'LMS credentials dispatched',
    total_amount: 15000,
    paid_amount: 7500,
    payment_note: '1st installment ₹7,500 paid. 2nd installment due in 30 days.',
    is_archived: false,
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'lead-008',
    full_name: 'Karan Malhotra',
    phone: '+91 99123 78901',
    email: 'karan.m@rediffmail.com',
    interested_program: 'LWAP',
    custom_program: null,
    status: 'Not Responding',
    source: 'Advertisement',
    custom_source: null,
    notes: 'Filled Google Lead Ad form. Called 3 times, phone switched off.',
    next_followup_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    followup_note: 'Try WhatsApp reminder message before closing lead.',
    total_amount: 12000,
    paid_amount: 0,
    payment_note: 'No payment',
    is_archived: false,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 6).toISOString(),
  }
];

export const LeadsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<'connected' | 'connecting' | 'disconnected' | 'mock'>('connecting');

  const [filterState, setFilterState] = useState<LeadFilterState>({
    search: '',
    status: 'ALL',
    program: 'ALL',
    source: 'ALL',
    followup: 'all',
    showArchived: false,
  });

  // Save to local storage in mock mode
  const persistMockLeads = (newLeads: Lead[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(newLeads));
    } catch (e) {
      console.error('Failed to persist mock leads:', e);
    }
  };

  // 1. Initial Load of Leads
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setRealtimeStatus('mock');
      const saved = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setLeads(parsed);
        } catch {
          setLeads(INITIAL_DEMO_LEADS);
          persistMockLeads(INITIAL_DEMO_LEADS);
        }
      } else {
        setLeads(INITIAL_DEMO_LEADS);
        persistMockLeads(INITIAL_DEMO_LEADS);
      }
      setLoading(false);
      return;
    }

    try {
      setRealtimeStatus('connecting');
      const { data, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setLeads((data as Lead[]) || []);
      setRealtimeStatus('connected');
    } catch (err: any) {
      console.error('Failed to fetch leads from Supabase:', err);
      setError(err.message || 'Failed to load leads from database');
      setRealtimeStatus('disconnected');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads, user]);

  // 2. Real-time Subscription (Laptop <-> Mobile live sync)
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      // Setup window storage event listener for cross-tab mock sync
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === LOCAL_STORAGE_LEADS_KEY && e.newValue) {
          try {
            setLeads(JSON.parse(e.newValue));
          } catch {}
        }
      };
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }

    // Subscribe to Postgres changes on 'leads' table
    const channel = supabase
      .channel('public:leads-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'leads' },
        (payload) => {
          const newLead = payload.new as Lead;
          setLeads((prev) => {
            if (prev.some((l) => l.id === newLead.id)) return prev;
            return [newLead, ...prev];
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'leads' },
        (payload) => {
          const updatedLead = payload.new as Lead;
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
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setRealtimeStatus('disconnected');
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

      // Search filter (name, phone, email)
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

  // 4. Computed Dashboard Statistics
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

  // 5. CRUD Helpers
  const getLeadById = useCallback(
    (id: string) => leads.find((l) => l.id === id),
    [leads]
  );

  const createLead = async (data: LeadFormData): Promise<{ lead?: Lead; error?: string }> => {
    try {
      const now = new Date().toISOString();
      const newLeadData: Lead = {
        id: isSupabaseConfigured() ? undefined as any : `lead-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
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
        created_at: now,
        updated_at: now,
        user_id: user?.id || null,
      };

      if (!isSupabaseConfigured()) {
        const updated = [newLeadData, ...leads];
        setLeads(updated);
        persistMockLeads(updated);
        return { lead: newLeadData };
      }

      const { data: inserted, error: insertError } = await supabase
        .from('leads')
        .insert([newLeadData])
        .select()
        .single();

      if (insertError) throw insertError;
      // Realtime listener will also receive it, but we can optimistically update
      setLeads((prev) => {
        if (prev.some((l) => l.id === inserted.id)) return prev;
        return [inserted as Lead, ...prev];
      });

      return { lead: inserted as Lead };
    } catch (err: any) {
      console.error('Error creating lead:', err);
      return { error: err.message || 'Failed to create lead' };
    }
  };

  const updateLead = async (id: string, updates: Partial<Lead>): Promise<{ success: boolean; error?: string }> => {
    try {
      const now = new Date().toISOString();
      const payload = {
        ...updates,
        updated_at: now,
      };

      if (!isSupabaseConfigured()) {
        const updated = leads.map((l) => (l.id === id ? { ...l, ...payload } : l));
        setLeads(updated);
        persistMockLeads(updated);
        return { success: true };
      }

      const { error: updateError } = await supabase
        .from('leads')
        .update(payload)
        .eq('id', id);

      if (updateError) throw updateError;
      
      // Optimistic update
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? { ...lead, ...payload } : lead))
      );

      return { success: true };
    } catch (err: any) {
      console.error('Error updating lead:', err);
      return { success: false, error: err.message || 'Failed to update lead' };
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
      if (!isSupabaseConfigured()) {
        const updated = leads.filter((l) => l.id !== id);
        setLeads(updated);
        persistMockLeads(updated);
        return { success: true };
      }

      const { error: deleteError } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setLeads((prev) => prev.filter((lead) => lead.id !== id));
      return { success: true };
    } catch (err: any) {
      console.error('Error permanently deleting lead:', err);
      return { success: false, error: err.message || 'Failed to delete lead' };
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
      downloadAnchor.setAttribute('download', `ev-leads-backup-${today}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error('Export failed:', e);
    }
  };

  // 7. JSON Import (Append or Replace)
  const importLeadsFromJson = async (
    importedLeads: Lead[],
    mode: 'append' | 'replace'
  ): Promise<{ count: number; error?: string }> => {
    try {
      if (!Array.isArray(importedLeads) || importedLeads.length === 0) {
        return { count: 0, error: 'The provided JSON file contains no valid leads data.' };
      }

      // Sanitize and validate imported leads
      const now = new Date().toISOString();
      const sanitized: Lead[] = importedLeads.map((item, index) => ({
        id: item.id || `lead-imported-${Date.now()}-${index}`,
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
        total_amount: Number(item.total_amount) || 0,
        paid_amount: Number(item.paid_amount) || 0,
        payment_note: item.payment_note ? String(item.payment_note).trim() : null,
        is_archived: Boolean(item.is_archived),
        created_at: item.created_at || now,
        updated_at: now,
        user_id: user?.id || null,
      }));

      if (!isSupabaseConfigured()) {
        let finalLeads: Lead[];
        if (mode === 'replace') {
          finalLeads = sanitized;
        } else {
          // Append (avoid duplicate IDs)
          const existingIds = new Set(leads.map((l) => l.id));
          const newUnique = sanitized.filter((l) => !existingIds.has(l.id));
          finalLeads = [...newUnique, ...leads];
        }
        setLeads(finalLeads);
        persistMockLeads(finalLeads);
        return { count: sanitized.length };
      }

      if (mode === 'replace') {
        // Delete existing leads
        await supabase.from('leads').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        // Insert new leads
        const { error: insertErr } = await supabase.from('leads').insert(sanitized);
        if (insertErr) throw insertErr;
      } else {
        // Upsert / Insert
        const { error: insertErr } = await supabase.from('leads').upsert(sanitized, { onConflict: 'id' });
        if (insertErr) throw insertErr;
      }

      await fetchLeads();
      return { count: sanitized.length };
    } catch (err: any) {
      console.error('Import error:', err);
      return { count: 0, error: err.message || 'Failed to import backup data' };
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
