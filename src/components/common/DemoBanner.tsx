import React, { useState } from 'react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { useLeads } from '../../contexts/LeadsContext';
import { Link } from 'react-router-dom';
import { ShieldCheck, Info, X, Zap, WifiOff, RefreshCw } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const isConfigured = isSupabaseConfigured();
  const { realtimeStatus, refreshLeads } = useLeads();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed && !isConfigured) return null;

  if (!isConfigured) {
    return (
      <div className="bg-gradient-to-r from-indigo-900 via-brand-900 to-purple-900 text-white px-4 py-2 text-xs border-b border-indigo-700/50 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-semibold text-amber-300">Local Preview Active:</span>
          <span className="text-slate-200 truncate">
            Operating with sample data & local storage. All lead entry, payments & backups work now!
          </span>
          <Link
            to="/settings"
            className="ml-2 underline font-semibold text-white hover:text-amber-200 transition-colors"
          >
            Connect Supabase Free Tier →
          </Link>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-300 hover:text-white ml-2 p-0.5 rounded"
          title="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return null;
};

export const RealtimeIndicator: React.FC<{ className?: string }> = ({ className }) => {
  const { realtimeStatus, refreshLeads } = useLeads();

  if (realtimeStatus === 'connected') {
    return (
      <div
        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 ${className}`}
        title="Supabase Realtime is actively listening for changes across Laptop & Mobile"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="hidden sm:inline">Realtime</span>
        <span>Live</span>
      </div>
    );
  }

  if (realtimeStatus === 'connecting') {
    return (
      <div
        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 ${className}`}
      >
        <RefreshCw className="w-3 h-3 animate-spin" />
        <span className="hidden sm:inline">Connecting Realtime...</span>
      </div>
    );
  }

  if (realtimeStatus === 'disconnected') {
    return (
      <button
        onClick={() => refreshLeads()}
        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800 ${className}`}
        title="Realtime disconnected. Click to reconnect."
      >
        <WifiOff className="w-3 h-3" />
        <span className="hidden sm:inline">Disconnected (Click to retry)</span>
      </button>
    );
  }

  return (
    <div
      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 ${className}`}
      title="Preview Mode with Local Storage Realtime Sync"
    >
      <Zap className="w-3 h-3 text-amber-500" />
      <span className="hidden sm:inline">Local</span>
      <span>Sync</span>
    </div>
  );
};
