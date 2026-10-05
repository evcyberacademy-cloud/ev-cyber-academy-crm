import React from 'react';
import { useLeads } from '../../contexts/LeadsContext';
import { BookOpen, Globe } from 'lucide-react';

export const ProgramDistribution: React.FC = () => {
  const { leads } = useLeads();
  const activeLeads = leads.filter((l) => !l.is_archived);
  const total = activeLeads.length;

  // Aggregate by Program
  const programCounts: Record<string, number> = {};
  activeLeads.forEach((l) => {
    const prog = l.interested_program === 'Custom' ? 'Custom Program' : l.interested_program;
    programCounts[prog] = (programCounts[prog] || 0) + 1;
  });

  const sortedPrograms = Object.entries(programCounts).sort((a, b) => b[1] - a[1]);

  // Aggregate by Source
  const sourceCounts: Record<string, number> = {};
  activeLeads.forEach((l) => {
    sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1;
  });

  const sortedSources = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Program Breakdown */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-subtle">
        <div className="flex items-center space-x-2 mb-4">
          <BookOpen className="w-4 h-4 text-brand-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Leads By Program
          </h3>
        </div>

        {total === 0 ? (
          <p className="text-xs text-slate-400 py-4">No program data yet.</p>
        ) : (
          <div className="space-y-3">
            {sortedPrograms.map(([prog, count]) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={prog}>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-700 dark:text-slate-300 truncate pr-2">
                      {prog}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 flex-shrink-0">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-500 dark:bg-brand-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Source Breakdown */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-subtle">
        <div className="flex items-center space-x-2 mb-4">
          <Globe className="w-4 h-4 text-indigo-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Top Acquisition Channels
          </h3>
        </div>

        {total === 0 ? (
          <p className="text-xs text-slate-400 py-4">No source data yet.</p>
        ) : (
          <div className="space-y-3">
            {sortedSources.slice(0, 5).map(([src, count]) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={src}>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-700 dark:text-slate-300 truncate pr-2">
                      {src}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 flex-shrink-0">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 dark:bg-indigo-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
