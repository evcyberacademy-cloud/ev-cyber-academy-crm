import React from 'react';
import { useLeads } from '../../contexts/LeadsContext';
import { Link } from 'react-router-dom';
import { CalendarClock, AlertCircle, Phone, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getTodayDateString, formatDate, cleanPhoneForWhatsApp } from '../../lib/utils';
import { Badge } from '../common/Badge';

export const UrgentFollowups: React.FC = () => {
  const { leads, updateStatus } = useLeads();
  const todayStr = getTodayDateString();

  // Find overdue and today's followups
  const urgentList = leads
    .filter((l) => !l.is_archived && l.next_followup_date)
    .filter((l) => {
      const dateOnly = l.next_followup_date!.split('T')[0];
      return dateOnly <= todayStr && l.status !== 'Converted' && l.status !== 'Not Converted';
    })
    .sort((a, b) => (a.next_followup_date! > b.next_followup_date! ? 1 : -1))
    .slice(0, 5);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-subtle overflow-hidden flex flex-col">
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <CalendarClock className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Action Required: Follow-ups
          </h3>
        </div>
        <Link
          to="/follow-ups"
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 flex items-center gap-1"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/60 flex-1">
        {urgentList.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              All Follow-ups Cleared!
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              No overdue or pending follow-ups scheduled for today.
            </p>
          </div>
        ) : (
          urgentList.map((lead) => {
            const isOverdue = lead.next_followup_date!.split('T')[0] < todayStr;
            const waNumber = cleanPhoneForWhatsApp(lead.phone);

            return (
              <div
                key={lead.id}
                className="p-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <Link
                      to={`/leads/${lead.id}`}
                      className="font-semibold text-sm text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                    >
                      {lead.full_name}
                    </Link>
                    <Badge status={lead.status} size="sm" />
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                        isOverdue
                          ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800 animate-pulse'
                          : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                      }`}
                    >
                      {isOverdue ? 'Overdue: ' : 'Today: '}
                      {formatDate(lead.next_followup_date)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-1">
                    <span className="font-medium text-slate-500 dark:text-slate-400">
                      {lead.interested_program === 'Custom'
                        ? lead.custom_program || 'Custom'
                        : lead.interested_program}
                      :
                    </span>{' '}
                    {lead.followup_note || lead.notes || 'Scheduled follow-up call'}
                  </p>
                </div>

                {/* Direct Action buttons */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <a
                    href={`tel:${lead.phone}`}
                    className="p-2 rounded-lg text-slate-600 hover:text-brand-600 hover:bg-brand-50 dark:text-slate-400 dark:hover:text-brand-300 dark:hover:bg-brand-950/50 border border-slate-200 dark:border-slate-700 transition-colors"
                    title={`Call ${lead.full_name}`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`https://wa.me/${waNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/50 border border-slate-200 dark:border-slate-700 transition-colors"
                    title={`WhatsApp ${lead.full_name}`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>
                  <Link
                    to={`/leads/${lead.id}`}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    Details
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
