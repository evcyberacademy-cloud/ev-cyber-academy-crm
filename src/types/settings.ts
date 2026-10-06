import { LeadStatus } from './database';

export interface CompanySettings {
  name: string;
  tagline: string;
  logoIcon: string; // e.g. 'Shield', 'Zap', 'Lock', 'Terminal', 'Cpu'
  currencySymbol: string; // '₹', '$', '€', '£', 'AED', etc.
  currencyCode: string; // 'INR', 'USD', 'EUR', 'GBP', etc.
  currencyPosition: 'prefix' | 'suffix';
  supportEmail: string;
  supportPhone: string;
  websiteUrl: string;
}

export interface DashboardWidgetSettings {
  showRevenueCard: boolean;
  showTotalLeadsCard: boolean;
  showPendingFollowupsCard: boolean;
  showConversionRate: boolean;
  showUrgentFollowups: boolean;
  showRecentLeads: boolean;
  showProgramDistribution: boolean;
  bannerTitle: string;
  bannerSubtitle: string;
}

export interface ProgramItem {
  id: string;
  name: string;
  defaultFee: number;
  duration?: string;
  description?: string;
  isActive: boolean;
}

export interface SourceItem {
  id: string;
  name: string;
  isActive: boolean;
}

export interface StatusConfigItem {
  key: LeadStatus;
  label: string;
  description: string;
  colorClass: string;
  dotColor: string;
  isDefault?: boolean;
}

export interface FollowupSettings {
  defaultIntervalDays: number;
  quickIntervals: number[]; // e.g. [1, 2, 3, 7, 14]
  overdueAlertThresholdDays: number;
  defaultTemplateNote: string;
}

export interface AppearanceSettings {
  theme: 'dark' | 'light' | 'system';
  density: 'comfortable' | 'compact';
  accentColor: string; // 'emerald' | 'blue' | 'indigo' | 'violet' | 'amber'
}

export interface AppSettings {
  version: string;
  company: CompanySettings;
  dashboard: DashboardWidgetSettings;
  programs: ProgramItem[];
  sources: SourceItem[];
  statuses: StatusConfigItem[];
  followup: FollowupSettings;
  appearance: AppearanceSettings;
  updatedAt: string;
}

export const DEFAULT_PROGRAMS_LIST: ProgramItem[] = [
  { id: 'prog-1', name: 'LFHP', defaultFee: 15000, duration: '3 Months', isActive: true },
  { id: 'prog-2', name: 'LFHP Mini', defaultFee: 7500, duration: '1 Month', isActive: true },
  { id: 'prog-3', name: 'LWAP', defaultFee: 12000, duration: '2 Months', isActive: true },
  { id: 'prog-4', name: 'AI Cyber Tool Building Workshop', defaultFee: 4999, duration: '2 Weeks', isActive: true },
  { id: 'prog-5', name: 'Internship', defaultFee: 10000, duration: '3 Months', isActive: true },
  { id: 'prog-6', name: 'Custom', defaultFee: 0, duration: 'Flexible', isActive: true },
];

export const DEFAULT_SOURCES_LIST: SourceItem[] = [
  { id: 'src-1', name: 'Instagram', isActive: true },
  { id: 'src-2', name: 'WhatsApp', isActive: true },
  { id: 'src-3', name: 'Website', isActive: true },
  { id: 'src-4', name: 'Referral', isActive: true },
  { id: 'src-5', name: 'Webinar', isActive: true },
  { id: 'src-6', name: 'Advertisement', isActive: true },
  { id: 'src-7', name: 'YouTube', isActive: true },
  { id: 'src-8', name: 'Direct', isActive: true },
  { id: 'src-9', name: 'Other', isActive: true },
];

export const DEFAULT_STATUSES_LIST: StatusConfigItem[] = [
  { key: 'New', label: 'New', description: 'Newly received lead, awaiting initial outreach', colorClass: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-300', dotColor: 'bg-blue-500', isDefault: true },
  { key: 'Contacted', label: 'Contacted', description: 'Initial contact made via call or message', colorClass: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-300', dotColor: 'bg-indigo-500' },
  { key: 'Follow-up', label: 'Follow-up', description: 'Active discussion scheduled', colorClass: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300', dotColor: 'bg-amber-500' },
  { key: 'Interested', label: 'Interested', description: 'High buying intent, syllabus shared', colorClass: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300', dotColor: 'bg-emerald-500' },
  { key: 'Converted', label: 'Converted', description: 'Enrolled & payment collected', colorClass: 'text-green-700 bg-green-50 dark:bg-green-950/60 dark:text-green-300', dotColor: 'bg-green-500' },
  { key: 'Not Converted', label: 'Not Converted', description: 'Declined or deferred', colorClass: 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300', dotColor: 'bg-slate-400' },
  { key: 'Not Responding', label: 'Not Responding', description: 'Unreachable after multiple attempts', colorClass: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300', dotColor: 'bg-rose-500' },
];

export const DEFAULT_APP_SETTINGS: AppSettings = {
  version: '2.0.0',
  company: {
    name: 'EV Cyber Academy',
    tagline: 'Admissions Pipeline & Operations Hub',
    logoIcon: 'Shield',
    currencySymbol: '₹',
    currencyCode: 'INR',
    currencyPosition: 'prefix',
    supportEmail: 'admissions@evcyberacademy.com',
    supportPhone: '+91 98765 43210',
    websiteUrl: 'https://evcyberacademy.com',
  },
  dashboard: {
    showRevenueCard: true,
    showTotalLeadsCard: true,
    showPendingFollowupsCard: true,
    showConversionRate: true,
    showUrgentFollowups: true,
    showRecentLeads: true,
    showProgramDistribution: true,
    bannerTitle: 'EV Cyber Academy Lead Central',
    bannerSubtitle: 'Real-time Admissions Pipeline, Follow-ups, and Payment Collection',
  },
  programs: DEFAULT_PROGRAMS_LIST,
  sources: DEFAULT_SOURCES_LIST,
  statuses: DEFAULT_STATUSES_LIST,
  followup: {
    defaultIntervalDays: 1,
    quickIntervals: [1, 2, 3, 7, 14],
    overdueAlertThresholdDays: 0,
    defaultTemplateNote: 'Follow up regarding course syllabus and batch schedule',
  },
  appearance: {
    theme: 'dark',
    density: 'comfortable',
    accentColor: 'emerald',
  },
  updatedAt: new Date().toISOString(),
};
