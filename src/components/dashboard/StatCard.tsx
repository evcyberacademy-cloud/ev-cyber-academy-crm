import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../../contexts/LeadsContext';

export interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  borderAccent?: string;
  filterStatus?: string;
  filterFollowup?: 'all' | 'today' | 'upcoming' | 'overdue';
  isUrgent?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = 'bg-brand-50 dark:bg-brand-950/60',
  iconColor = 'text-brand-600 dark:text-brand-400',
  borderAccent,
  filterStatus,
  filterFollowup,
  isUrgent = false,
}) => {
  const navigate = useNavigate();
  const { setFilterState } = useLeads();

  const handleClick = () => {
    if (filterStatus) {
      setFilterState((prev) => ({
        ...prev,
        status: filterStatus,
        followup: 'all',
        showArchived: false,
      }));
      navigate('/leads');
    } else if (filterFollowup) {
      setFilterState((prev) => ({
        ...prev,
        status: 'ALL',
        followup: filterFollowup,
        showArchived: false,
      }));
      navigate(filterFollowup === 'today' || filterFollowup === 'overdue' ? '/follow-ups' : '/leads');
    }
  };

  const isClickable = !!filterStatus || !!filterFollowup;

  return (
    <div
      onClick={isClickable ? handleClick : undefined}
      className={cn(
        'relative overflow-hidden rounded-xl p-5 border transition-all duration-200',
        'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800',
        isClickable && 'cursor-pointer hover:shadow-card-hover hover:border-slate-300 dark:hover:border-slate-700 active:scale-[0.99]',
        isUrgent && 'ring-1 ring-rose-500/50 dark:ring-rose-500/40 bg-rose-50/20 dark:bg-rose-950/10',
        borderAccent
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
            {title}
          </p>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {value}
            </span>
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">
              {subtitle}
            </p>
          )}
        </div>

        <div className={cn('p-2.5 rounded-xl flex-shrink-0 ml-3', iconBgColor)}>
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
      </div>
    </div>
  );
};
