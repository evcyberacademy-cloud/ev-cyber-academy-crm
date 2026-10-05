import { LeadStatus, PredefinedProgram, PredefinedSource } from '../types/database';

export const PROGRAM_OPTIONS: PredefinedProgram[] = [
  'LFHP',
  'LFHP Mini',
  'LWAP',
  'AI Cyber Tool Building Workshop',
  'Internship',
  'Custom',
];

export const STATUS_OPTIONS: LeadStatus[] = [
  'New',
  'Contacted',
  'Follow-up',
  'Interested',
  'Converted',
  'Not Converted',
  'Not Responding',
];

export const SOURCE_OPTIONS: PredefinedSource[] = [
  'Instagram',
  'WhatsApp',
  'Website',
  'Referral',
  'Webinar',
  'Advertisement',
  'YouTube',
  'Direct',
  'Other',
];

export const STATUS_CONFIG: Record<
  LeadStatus,
  {
    label: string;
    bgLight: string;
    textLight: string;
    borderLight: string;
    bgDark: string;
    textDark: string;
    borderDark: string;
    dotColor: string;
    description: string;
  }
> = {
  New: {
    label: 'New',
    bgLight: 'bg-blue-50',
    textLight: 'text-blue-700',
    borderLight: 'border-blue-200',
    bgDark: 'dark:bg-blue-950/50',
    textDark: 'dark:text-blue-300',
    borderDark: 'dark:border-blue-800',
    dotColor: 'bg-blue-500',
    description: 'Newly received lead, awaiting initial outreach',
  },
  Contacted: {
    label: 'Contacted',
    bgLight: 'bg-indigo-50',
    textLight: 'text-indigo-700',
    borderLight: 'border-indigo-200',
    bgDark: 'dark:bg-indigo-950/50',
    textDark: 'dark:text-indigo-300',
    borderDark: 'dark:border-indigo-800',
    dotColor: 'bg-indigo-500',
    description: 'Initial contact made via call/WhatsApp/email',
  },
  'Follow-up': {
    label: 'Follow-up',
    bgLight: 'bg-amber-50',
    textLight: 'text-amber-700',
    borderLight: 'border-amber-200',
    bgDark: 'dark:bg-amber-950/50',
    textDark: 'dark:text-amber-300',
    borderDark: 'dark:border-amber-800',
    dotColor: 'bg-amber-500',
    description: 'Active discussion, scheduled next conversation',
  },
  Interested: {
    label: 'Interested',
    bgLight: 'bg-emerald-50',
    textLight: 'text-emerald-700',
    borderLight: 'border-emerald-200',
    bgDark: 'dark:bg-emerald-950/50',
    textDark: 'dark:text-emerald-300',
    borderDark: 'dark:border-emerald-800',
    dotColor: 'bg-emerald-500',
    description: 'Highly interested in syllabus, waiting for payment/batch',
  },
  Converted: {
    label: 'Converted',
    bgLight: 'bg-green-50',
    textLight: 'text-green-800',
    borderLight: 'border-green-300',
    bgDark: 'dark:bg-green-950/60',
    textDark: 'dark:text-green-300',
    borderDark: 'dark:border-green-800',
    dotColor: 'bg-green-500',
    description: 'Paid & enrolled in EV Cyber Academy program',
  },
  'Not Converted': {
    label: 'Not Converted',
    bgLight: 'bg-slate-100',
    textLight: 'text-slate-700',
    borderLight: 'border-slate-200',
    bgDark: 'dark:bg-slate-800',
    textDark: 'dark:text-slate-300',
    borderDark: 'dark:border-slate-700',
    dotColor: 'bg-slate-400',
    description: 'Declined or unsuitable (kept in archive for future outreach)',
  },
  'Not Responding': {
    label: 'Not Responding',
    bgLight: 'bg-rose-50',
    textLight: 'text-rose-700',
    borderLight: 'border-rose-200',
    bgDark: 'dark:bg-rose-950/50',
    textDark: 'dark:text-rose-300',
    borderDark: 'dark:border-rose-800',
    dotColor: 'bg-rose-500',
    description: 'Multiple attempts made without response',
  },
};
