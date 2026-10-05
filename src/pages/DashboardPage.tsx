import React from 'react';
import { useLeads } from '../contexts/LeadsContext';
import { StatCard } from '../components/dashboard/StatCard';
import { ConversionRateCard } from '../components/dashboard/ConversionRateCard';
import { UrgentFollowups } from '../components/dashboard/UrgentFollowups';
import { RecentLeads } from '../components/dashboard/RecentLeads';
import { ProgramDistribution } from '../components/dashboard/ProgramDistribution';
import {
  Users,
  Sparkles,
  PhoneCall,
  CalendarClock,
  Flame,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Calendar,
  IndianRupee,
} from 'lucide-react';
import { formatCurrency } from '../lib/utils';

export const DashboardPage: React.FC = () => {
  const { stats, leads, loading } = useLeads();

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            EV Cyber Academy Lead Central
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time Admissions Pipeline, Follow-ups, and Payment Collection
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 font-medium block text-[10px]">Total Revenue</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              {formatCurrency(stats.totalRevenue)}
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80">
            <span className="text-emerald-700 dark:text-emerald-400 font-medium block text-[10px]">Collected</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
              {formatCurrency(stats.totalCollected)}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid (10 Summary Cards required by specification) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* 1. Total Leads */}
        <StatCard
          title="Total Leads"
          value={stats.totalLeads}
          subtitle="All active enquiries"
          icon={Users}
          iconBgColor="bg-slate-100 dark:bg-slate-800"
          iconColor="text-slate-700 dark:text-slate-200"
          filterStatus="ALL"
        />

        {/* 2. New Leads */}
        <StatCard
          title="New Leads"
          value={stats.newLeads}
          subtitle="Awaiting initial call"
          icon={Sparkles}
          iconBgColor="bg-blue-50 dark:bg-blue-950/60"
          iconColor="text-blue-600 dark:text-blue-400"
          filterStatus="New"
        />

        {/* 3. Contacted */}
        <StatCard
          title="Contacted"
          value={stats.contacted}
          subtitle="Initial reach made"
          icon={PhoneCall}
          iconBgColor="bg-indigo-50 dark:bg-indigo-950/60"
          iconColor="text-indigo-600 dark:text-indigo-400"
          filterStatus="Contacted"
        />

        {/* 4. Follow-up */}
        <StatCard
          title="Follow-up"
          value={stats.followUp}
          subtitle="Active discussion"
          icon={CalendarClock}
          iconBgColor="bg-amber-50 dark:bg-amber-950/60"
          iconColor="text-amber-600 dark:text-amber-400"
          filterStatus="Follow-up"
        />

        {/* 5. Interested */}
        <StatCard
          title="Interested"
          value={stats.interested}
          subtitle="High buying intent"
          icon={Flame}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/60"
          iconColor="text-emerald-600 dark:text-emerald-400"
          filterStatus="Interested"
        />

        {/* 6. Converted */}
        <StatCard
          title="Converted"
          value={stats.converted}
          subtitle="Enrolled & paid"
          icon={CheckCircle2}
          iconBgColor="bg-green-100 dark:bg-green-950/80"
          iconColor="text-green-700 dark:text-green-400"
          borderAccent="border-green-300 dark:border-green-800/60 ring-1 ring-green-500/20"
          filterStatus="Converted"
        />

        {/* 7. Not Converted */}
        <StatCard
          title="Not Converted"
          value={stats.notConverted}
          subtitle="Declined / Stored"
          icon={XCircle}
          iconBgColor="bg-slate-100 dark:bg-slate-800"
          iconColor="text-slate-500"
          filterStatus="Not Converted"
        />

        {/* 8. Not Responding */}
        <StatCard
          title="Not Responding"
          value={stats.notResponding}
          subtitle="Unreachable"
          icon={Clock}
          iconBgColor="bg-rose-50 dark:bg-rose-950/60"
          iconColor="text-rose-600 dark:text-rose-400"
          filterStatus="Not Responding"
        />

        {/* 9. Follow-ups Today */}
        <StatCard
          title="Follow-ups Today"
          value={stats.followUpsToday}
          subtitle="Scheduled for today"
          icon={Calendar}
          iconBgColor="bg-amber-100 dark:bg-amber-950/80"
          iconColor="text-amber-700 dark:text-amber-400"
          borderAccent={stats.followUpsToday > 0 ? 'border-amber-300 dark:border-amber-700 ring-1 ring-amber-400/30' : undefined}
          filterFollowup="today"
        />

        {/* 10. Overdue Follow-ups */}
        <StatCard
          title="Overdue Follow-ups"
          value={stats.overdueFollowUps}
          subtitle="Missed reminders"
          icon={AlertTriangle}
          iconBgColor="bg-rose-100 dark:bg-rose-950/80"
          iconColor="text-rose-700 dark:text-rose-400"
          isUrgent={stats.overdueFollowUps > 0}
          filterFollowup="overdue"
        />
      </div>

      {/* Middle Section: Conversion Rate Meter + Urgent Follow-ups List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ConversionRateCard />
        </div>
        <div className="lg:col-span-2">
          <UrgentFollowups />
        </div>
      </div>

      {/* Bottom Section: Recent Leads Feed + Program Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentLeads />
        </div>
        <div className="lg:col-span-1">
          <ProgramDistribution />
        </div>
      </div>
    </div>
  );
};
