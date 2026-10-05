import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format numbers as Indian Rupee currency (₹)
 */
export function formatCurrency(amount: number | string | null | undefined): string {
  const numeric = typeof amount === 'number' ? amount : parseFloat(String(amount || 0));
  if (isNaN(numeric)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(numeric);
}

/**
 * Calculate pending balance safely
 */
export function calculatePending(total: number | string, paid: number | string): number {
  const t = typeof total === 'number' ? total : parseFloat(String(total || 0)) || 0;
  const p = typeof paid === 'number' ? paid : parseFloat(String(paid || 0)) || 0;
  return Math.max(0, t - p);
}

/**
 * Get standard date string in YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format date for clean display
 */
export function formatDate(dateString?: string | null): string {
  if (!dateString) return '—';
  try {
    // Handle both YYYY-MM-DD and ISO string
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Format timestamp with time
 */
export function formatDateTime(dateString?: string | null): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Check if a follow-up date is today, overdue, or upcoming
 */
export function getFollowupTiming(dateString?: string | null): {
  type: 'today' | 'overdue' | 'upcoming' | 'none';
  label: string;
  badgeClass: string;
} {
  if (!dateString) {
    return { type: 'none', label: 'No follow-up', badgeClass: 'text-slate-400 bg-slate-100 dark:bg-slate-800' };
  }

  const todayStr = getTodayDateString();
  const targetDateOnly = dateString.split('T')[0];

  if (targetDateOnly === todayStr) {
    return {
      type: 'today',
      label: "Today's Follow-up",
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-700 font-semibold',
    };
  } else if (targetDateOnly < todayStr) {
    return {
      type: 'overdue',
      label: 'Overdue Follow-up',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-700 font-semibold animate-pulse',
    };
  } else {
    return {
      type: 'upcoming',
      label: 'Upcoming',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
    };
  }
}

/**
 * Format relative time (e.g., '2m ago', '3h ago')
 */
export function formatRelativeTime(dateString?: string | null): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(dateString);
  } catch {
    return '—';
  }
}

/**
 * Sanitize phone number for tel: and WhatsApp direct chat
 */
export function cleanPhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.length === 10) {
    return `91${digits}`; // Add India country code by default if 10 digits
  }
  return digits;
}
