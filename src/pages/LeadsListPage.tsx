import React from 'react';
import { useLeads } from '../contexts/LeadsContext';
import { LeadFilters } from '../components/leads/LeadFilters';
import { LeadTable } from '../components/leads/LeadTable';
import { LeadCard } from '../components/leads/LeadCard';
import { Button } from '../components/common/Button';
import { Plus, Users, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LeadsListPage: React.FC = () => {
  const { filteredLeads, loading, filterState, exportLeadsToJson, stats } = useLeads();
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {filterState.showArchived ? 'Archived Leads' : 'All Leads'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              {filteredLeads.length} {filteredLeads.length === 1 ? 'Lead' : 'Leads'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Filter, manage admissions, record fees, and track student outreach
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportLeadsToJson}
            leftIcon={<Download className="w-3.5 h-3.5" />}
            className="hidden sm:inline-flex"
          >
            Export JSON
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/leads/new')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add New Lead
          </Button>
        </div>
      </div>

      {/* Filter Component */}
      <LeadFilters />

      {/* Desktop Table View (Hidden on mobile) */}
      <div className="hidden md:block">
        <LeadTable leads={filteredLeads} isLoading={loading} />
      </div>

      {/* Mobile Cards View (Visible on small screens) */}
      <div className="block md:hidden space-y-3">
        {loading ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            Loading leads...
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            No leads match current filter criteria.
          </div>
        ) : (
          filteredLeads.map((lead) => <LeadCard key={lead.id} lead={lead} />)
        )}
      </div>
    </div>
  );
};
