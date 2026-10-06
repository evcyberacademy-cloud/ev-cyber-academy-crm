import React from 'react';
import { useLeads } from '../contexts/LeadsContext';
import { useSettings } from '../contexts/SettingsContext';
import { ConversionRateCard } from '../components/dashboard/ConversionRateCard';
import { UrgentFollowups } from '../components/dashboard/UrgentFollowups';
import { RecentLeads } from '../components/dashboard/RecentLeads';
import { ProgramDistribution } from '../components/dashboard/ProgramDistribution';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Sparkles,
  CalendarClock,
  AlertTriangle,
  Calendar,
  IndianRupee,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { stats, leads, loading, setFilterState } = useLeads();
  const { settings, formatCurrency } = useSettings();
  const navigate = useNavigate();

  const totalPendingFollowups = stats.followUpsToday + stats.overdueFollowUps;

  const handleNavigateToLeads = (filterStatus?: string) => {
    setFilterState((prev) => ({
      ...prev,
      status: filterStatus || 'ALL',
      followup: 'all',
      showArchived: false,
    }));
    navigate('/leads');
  };

  const handleNavigateToFollowups = (type: 'today' | 'overdue' | 'all') => {
    setFilterState((prev) => ({
      ...prev,
      status: 'ALL',
      followup: type,
      showArchived: false,
    }));
    navigate('/follow-ups');
  };

  return (
    <div className="space-y-6">
      {/* 1. Dynamic Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-brand-950 p-5 sm:p-6 rounded-2xl border border-slate-800 text-white shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Operations Active
            </span>
            <span className="text-slate-400 text-xs">• Live Sync</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight text-white">
            {settings.dashboard.bannerTitle || `${settings.company.name} Command Center`}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            {settings.dashboard.bannerSubtitle || 'Real-time Admissions Pipeline, Follow-ups, and Payment Collection'}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-sm">
            <span className="text-slate-400 font-medium block text-[10px] uppercase tracking-wider">Total Revenue</span>
            <span className="font-extrabold text-white text-base sm:text-lg">
              {formatCurrency(stats.totalRevenue)}
            </span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-950/70 border border-emerald-700/60 backdrop-blur-sm">
            <span className="text-emerald-300 font-medium block text-[10px] uppercase tracking-wider">Collected</span>
            <span className="font-extrabold text-emerald-300 text-base sm:text-lg">
              {formatCurrency(stats.totalCollected)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Focused 3-Card Command Metrics (Revenue, Total Leads, Follow-ups Pending) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: Total Revenue */}
        {settings.dashboard.showRevenueCard && (
          <div
            onClick={() => handleNavigateToLeads('Converted')}
            className="group relative overflow-hidden rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card hover:shadow-card-hover hover:border-brand-500/50 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Total Revenue
                </span>
                <div className="mt-2 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {formatCurrency(stats.totalRevenue)}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Collected: {formatCurrency(stats.totalCollected)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                <span>Pending: {formatCurrency(stats.totalPending)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Card 2: Total Leads */}
        {settings.dashboard.showTotalLeadsCard && (
          <div
            onClick={() => handleNavigateToLeads('ALL')}
            className="group relative overflow-hidden rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card hover:shadow-card-hover hover:border-brand-500/50 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Total Leads
                </span>
                <div className="mt-2 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {stats.totalLeads}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{stats.newLeads} New Enquiries</span>
              </div>
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
                <span>{stats.converted} Converted</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        )}

        {/* Card 3: Pending Follow-ups */}
        {settings.dashboard.showPendingFollowupsCard && (
          <div
            onClick={() => handleNavigateToFollowups('all')}
            className="group relative overflow-hidden rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card hover:shadow-card-hover hover:border-amber-500/50 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Follow-ups Pending
                </span>
                <div className="mt-2 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-baseline gap-2">
                  <span>{totalPendingFollowups}</span>
                  <span className="text-xs font-medium text-slate-400">active calls</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <CalendarClock className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                <Calendar className="w-3.5 h-3.5" />
                <span>Today: {stats.followUpsToday}</span>
              </div>
              {stats.overdueFollowUps > 0 ? (
                <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-extrabold animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Overdue: {stats.overdueFollowUps}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>No Overdue</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Middle Section: Conversion Rate Meter + Urgent Follow-ups List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {settings.dashboard.showConversionRate && (
          <div className="lg:col-span-1">
            <ConversionRateCard />
          </div>
        )}
        {settings.dashboard.showUrgentFollowups && (
          <div className={settings.dashboard.showConversionRate ? 'lg:col-span-2' : 'lg:col-span-3'}>
            <UrgentFollowups />
          </div>
        )}
      </div>

      {/* 4. Bottom Section: Recent Leads Feed + Program Distribution */}
      {(settings.dashboard.showRecentLeads || settings.dashboard.showProgramDistribution) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {settings.dashboard.showRecentLeads && (
            <div className={settings.dashboard.showProgramDistribution ? 'lg:col-span-2' : 'lg:col-span-3'}>
              <RecentLeads />
            </div>
          )}
          {settings.dashboard.showProgramDistribution && (
            <div className={settings.dashboard.showRecentLeads ? 'lg:col-span-1' : 'lg:col-span-3'}>
              <ProgramDistribution />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
