export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Follow-up'
  | 'Interested'
  | 'Converted'
  | 'Not Converted'
  | 'Not Responding';

export type PredefinedProgram =
  | 'LFHP'
  | 'LFHP Mini'
  | 'LWAP'
  | 'AI Cyber Tool Building Workshop'
  | 'Internship'
  | 'Custom';

export type PredefinedSource =
  | 'Instagram'
  | 'WhatsApp'
  | 'Website'
  | 'Referral'
  | 'Webinar'
  | 'Advertisement'
  | 'YouTube'
  | 'Direct'
  | 'Other';

export interface Lead {
  id: string;
  full_name: string;
  phone: string;
  email?: string | null;
  interested_program: string;
  custom_program?: string | null;
  status: LeadStatus;
  source: string;
  custom_source?: string | null;
  notes?: string | null;
  next_followup_date?: string | null; // ISO YYYY-MM-DD
  followup_note?: string | null;
  total_amount: number;
  paid_amount: number;
  pending_amount?: number; // Calculated on client or DB (total_amount - paid_amount)
  payment_note?: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  user_id?: string | null;
}

export type LeadInsert = Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'pending_amount'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type LeadUpdate = Partial<LeadInsert>;

export interface LeadFormData {
  full_name: string;
  phone: string;
  interested_program: string;
  status: LeadStatus;
  source: string;
  next_followup_date?: string;
  notes?: string;
  email?: string;
  custom_program?: string;
  custom_source?: string;
  followup_note?: string;
  total_amount?: number;
  paid_amount?: number;
  payment_note?: string;
}

export type FollowupFilterType = 'all' | 'today' | 'upcoming' | 'overdue' | 'none';

export interface LeadFilterState {
  search: string;
  status: string; // 'ALL' or LeadStatus
  program: string; // 'ALL' or specific program
  source: string; // 'ALL' or specific source
  followup: FollowupFilterType;
  showArchived: boolean;
}

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  contacted: number;
  followUp: number;
  interested: number;
  converted: number;
  notConverted: number;
  notResponding: number;
  followUpsToday: number;
  overdueFollowUps: number;
  conversionRate: number; // percentage 0-100
  totalRevenue: number;
  totalCollected: number;
  totalPending: number;
}

export interface BackupData {
  version: string;
  exported_at: string;
  academy: string;
  total_count: number;
  leads: Lead[];
}
