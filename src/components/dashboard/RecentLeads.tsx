import React from 'react';
import { useLeads } from '../../contexts/LeadsContext';
import { Link } from 'react-router-dom';
import { Users, ArrowRight, Clock, ChevronRight } from 'lucide-react';
import { formatCurrency, formatRelativeTime } from '../../lib/utils';
import { Badge } from '../common/Badge';

export const RecentLeads: React.FC = () => {
  const { leads } = useLeads();

  const recent = leads
    .filter((l) => !l.is_archived)
    .slice(0, 6);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-subtle overflow-hidden flex flex-col">
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-brand-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Recent Enquiries
          </h3>
        </div>
        <Link
          to="/leads"
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 flex items-center gap-1"
        >
          View Full List <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/60 flex-1">
        {recent.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No leads recorded yet. Click "Add Lead" to get started!
          </div>
        ) : (
          recent.map((lead) => {
            const programName =
              lead.interested_program === 'Custom'
                ? lead.custom_program || 'Custom Program'
                : lead.interested_program;

            return (
              <Link
                key={lead.id}
                to={`/leads/${lead.id}`}
                className="p-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-3 group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                      {lead.full_name}
                    </span>
                    <Badge status={lead.status} size="sm" />
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                      {programName}
                    </span>
                    <span>•</span>
                    <span>{lead.source}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {formatRelativeTime(lead.created_at)}
                    </span>
                  </div>
                </div>

                <div className="text-right flex items-center space-x-3 flex-shrink-0">
                  <div className="hidden sm:block">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {formatCurrency(lead.total_amount)}
                    </span>
                    {lead.paid_amount > 0 ? (
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        Paid {formatCurrency(lead.paid_amount)}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Unpaid</span>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};
