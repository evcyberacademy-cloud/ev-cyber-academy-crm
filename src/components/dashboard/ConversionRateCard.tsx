import React from 'react';
import { useLeads } from '../../contexts/LeadsContext';
import { formatCurrency } from '../../lib/utils';
import { TrendingUp, CheckCircle2, DollarSign, Clock } from 'lucide-react';

export const ConversionRateCard: React.FC = () => {
  const { stats } = useLeads();
  const rate = stats.conversionRate;

  // Calculate circular progress dashoffset
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (rate / 100) * circumference;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-subtle flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Conversion Efficiency
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            <TrendingUp className="w-3.5 h-3.5" />
            Live Rate
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {rate}%
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {stats.converted}
              </span>{' '}
              converted out of{' '}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {stats.totalLeads}
              </span>{' '}
              active leads
            </p>
          </div>

          {/* Radial meter */}
          <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="text-emerald-500 transition-all duration-700 ease-out"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300">
              {rate}%
            </div>
          </div>
        </div>
      </div>

      {/* Financial Breakdown Mini Strip */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg">
          <span className="text-slate-400 text-[11px] block font-medium">Collected</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
            {formatCurrency(stats.totalCollected)}
          </span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg">
          <span className="text-slate-400 text-[11px] block font-medium">Pending Balance</span>
          <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
            {formatCurrency(stats.totalPending)}
          </span>
        </div>
      </div>
    </div>
  );
};
