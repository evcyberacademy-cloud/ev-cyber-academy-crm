import React from 'react';
import { useLeads } from '../../contexts/LeadsContext';
import { RefreshCw } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  // Cloud database mode is active across all instances
  return null;
};

export const RealtimeIndicator: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { realtimeStatus, refreshLeads } = useLeads();

  if (realtimeStatus === 'connected') {
    return (
      <div
        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 shadow-sm ${className}`}
        title="Supabase Realtime WebSocket is live: Instant live sync across Laptop & Mobile devices"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
          ● Live
        </span>
      </div>
    );
  }

  if (realtimeStatus === 'connecting') {
    return (
      <div
        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 ${className}`}
        title="Establishing WebSocket connection to Supabase..."
      >
        <RefreshCw className="w-3 h-3 animate-spin text-amber-500" />
        <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
          ● Connecting...
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={() => refreshLeads()}
      type="button"
      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800 transition-colors ${className}`}
      title="WebSocket disconnected. Click to reconnect."
    >
      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
      <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
        ● Reconnecting...
      </span>
    </button>
  );
};
