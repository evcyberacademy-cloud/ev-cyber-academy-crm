import React from 'react';
import { Menu, Plus, Search, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../common/ThemeToggle';
import { RealtimeIndicator } from '../common/DemoBanner';
import { Button } from '../common/Button';
import { useLeads } from '../../contexts/LeadsContext';

interface HeaderProps {
  onOpenSidebar: () => void;
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSidebar,
  title,
  subtitle,
}) => {
  const navigate = useNavigate();
  const { filterState, setFilterState, refreshLeads, loading } = useLeads();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Left side: Mobile burger + Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenSidebar}
          type="button"
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Open sidebar navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          {title ? (
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 dark:text-white text-base">
                EV Cyber Academy
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">| Lead System</span>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Realtime badge, Search shortcut, Quick Add button, Theme toggle */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Realtime Live Sync status */}
        <RealtimeIndicator />

        {/* Quick Refresh Button */}
        <button
          onClick={() => refreshLeads()}
          type="button"
          disabled={loading}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors hidden sm:inline-flex"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-500' : ''}`} />
        </button>

        {/* Theme switch */}
        <ThemeToggle />

        {/* New Lead Quick Action */}
        <Button
          size="sm"
          onClick={() => navigate('/leads/new')}
          leftIcon={<Plus className="w-4 h-4" />}
          className="font-semibold shadow-sm"
        >
          <span className="hidden sm:inline">Add Lead</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>
    </header>
  );
};
