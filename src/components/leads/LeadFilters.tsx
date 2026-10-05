import React from 'react';
import { useLeads } from '../../contexts/LeadsContext';
import { PROGRAM_OPTIONS, STATUS_OPTIONS, SOURCE_OPTIONS } from '../../lib/constants';
import { Search, X, Filter, RotateCcw, Calendar, Archive } from 'lucide-react';
import { FollowupFilterType } from '../../types/database';

export const LeadFilters: React.FC = () => {
  const { filterState, setFilterState, stats, leads } = useLeads();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterState((prev) => ({ ...prev, search: e.target.value }));
  };

  const clearSearch = () => {
    setFilterState((prev) => ({ ...prev, search: '' }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterState((prev) => ({ ...prev, status: e.target.value }));
  };

  const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterState((prev) => ({ ...prev, program: e.target.value }));
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterState((prev) => ({ ...prev, source: e.target.value }));
  };

  const handleFollowupChange = (type: FollowupFilterType) => {
    setFilterState((prev) => ({ ...prev, followup: type }));
  };

  const resetFilters = () => {
    setFilterState({
      search: '',
      status: 'ALL',
      program: 'ALL',
      source: 'ALL',
      followup: 'all',
      showArchived: false,
    });
  };

  const isFiltered =
    filterState.search.trim() !== '' ||
    filterState.status !== 'ALL' ||
    filterState.program !== 'ALL' ||
    filterState.source !== 'ALL' ||
    filterState.followup !== 'all' ||
    filterState.showArchived;

  const archivedCount = leads.filter((l) => l.is_archived).length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-3">
      {/* Top row: Search input + Quick Reset */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search leads by name, phone, email, or notes..."
            value={filterState.search}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-8 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-colors"
          />
          {filterState.search && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action reset */}
        {isFiltered && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center justify-center space-x-1 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-900/50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Second row: Dropdown selectors (Status, Program, Source) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-1">
        {/* Status */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Status
          </label>
          <select
            value={filterState.status}
            onChange={handleStatusChange}
            className="w-full py-1.5 px-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="ALL">All Statuses ({stats.totalLeads})</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Program */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Program
          </label>
          <select
            value={filterState.program}
            onChange={handleProgramChange}
            className="w-full py-1.5 px-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="ALL">All Programs</option>
            {PROGRAM_OPTIONS.map((prog) => (
              <option key={prog} value={prog}>
                {prog}
              </option>
            ))}
          </select>
        </div>

        {/* Source */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Source
          </label>
          <select
            value={filterState.source}
            onChange={handleSourceChange}
            className="w-full py-1.5 px-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="ALL">All Sources</option>
            {SOURCE_OPTIONS.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>

        {/* Archived Toggle */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Archive View
          </label>
          <button
            type="button"
            onClick={() =>
              setFilterState((prev) => ({ ...prev, showArchived: !prev.showArchived }))
            }
            className={`w-full py-1.5 px-2.5 text-xs rounded-lg border flex items-center justify-between font-medium transition-colors ${
              filterState.showArchived
                ? 'bg-purple-50 dark:bg-purple-950/50 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300'
                : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Archive className="w-3.5 h-3.5" />
              {filterState.showArchived ? 'Viewing Archived' : 'Active Only'}
            </span>
            {archivedCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800">
                {archivedCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Third row: Follow-up timeframe quick pills */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center space-x-2 overflow-x-auto text-xs pb-1">
        <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1 flex-shrink-0">
          <Calendar className="w-3 h-3" /> Follow-up:
        </span>

        <button
          type="button"
          onClick={() => handleFollowupChange('all')}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors flex-shrink-0 ${
            filterState.followup === 'all'
              ? 'bg-brand-600 text-white dark:bg-brand-500'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          All
        </button>

        <button
          type="button"
          onClick={() => handleFollowupChange('today')}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors flex-shrink-0 ${
            filterState.followup === 'today'
              ? 'bg-amber-500 text-white font-bold shadow-sm'
              : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
          }`}
        >
          Today ({stats.followUpsToday})
        </button>

        <button
          type="button"
          onClick={() => handleFollowupChange('overdue')}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors flex-shrink-0 ${
            filterState.followup === 'overdue'
              ? 'bg-rose-600 text-white font-bold shadow-sm'
              : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
          }`}
        >
          Overdue ({stats.overdueFollowUps})
        </button>

        <button
          type="button"
          onClick={() => handleFollowupChange('upcoming')}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors flex-shrink-0 ${
            filterState.followup === 'upcoming'
              ? 'bg-blue-600 text-white font-bold'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          Upcoming
        </button>

        <button
          type="button"
          onClick={() => handleFollowupChange('none')}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors flex-shrink-0 ${
            filterState.followup === 'none'
              ? 'bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900 font-bold'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          No Follow-up
        </button>
      </div>
    </div>
  );
};
