import React, { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import {
  LayoutDashboard,
  Check,
  Save,
  IndianRupee,
  Users,
  CalendarClock,
  TrendingUp,
  Activity,
  ListOrdered,
  PieChart,
  Eye,
  EyeOff,
} from 'lucide-react';

export const DashboardSettingsTab: React.FC = () => {
  const { settings, updateDashboard } = useSettings();
  const [formData, setFormData] = useState({ ...settings.dashboard });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDashboard(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const toggleWidget = (key: keyof typeof formData) => {
    setFormData((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const widgetCards = [
    {
      key: 'showRevenueCard' as const,
      title: 'Total Revenue Command Card',
      desc: 'Displays total calculated revenue with Collected & Pending breakdowns',
      icon: IndianRupee,
      iconColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60',
    },
    {
      key: 'showTotalLeadsCard' as const,
      title: 'Total Leads Command Card',
      desc: 'Displays total active candidate count with New Enquiries highlights',
      icon: Users,
      iconColor: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60',
    },
    {
      key: 'showPendingFollowupsCard' as const,
      title: 'Follow-ups Pending Command Card',
      desc: 'Displays action count for today and overdue calls',
      icon: CalendarClock,
      iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60',
    },
    {
      key: 'showConversionRate' as const,
      title: 'Conversion Rate Circular Meter',
      desc: 'Radial progress meter showing lead-to-enrollment efficiency percentage',
      icon: TrendingUp,
      iconColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60',
    },
    {
      key: 'showUrgentFollowups' as const,
      title: 'Urgent Follow-ups Direct Action List',
      desc: 'High-priority queue with instant Call & WhatsApp launch buttons',
      icon: Activity,
      iconColor: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60',
    },
    {
      key: 'showRecentLeads' as const,
      title: 'Recent Enquiries Activity Feed',
      desc: 'Live feed of latest received admissions leads with timestamps',
      icon: ListOrdered,
      iconColor: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60',
    },
    {
      key: 'showProgramDistribution' as const,
      title: 'Course & Source Distribution Charts',
      desc: 'Analytics bar graphs aggregating candidate interest by program and channel',
      icon: PieChart,
      iconColor: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60',
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-5">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            Dashboard Widgets & Display Customizer
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Turn specific dashboard cards on or off to tailor your main command screen to your team's exact workflow.
          </p>
        </div>

        {/* Banner Headlines */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
            Dashboard Welcome Banner Text
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Banner Main Headline"
              placeholder="e.g. EV Cyber Academy Lead Central"
              value={formData.bannerTitle}
              onChange={(e) => setFormData({ ...formData, bannerTitle: e.target.value })}
            />

            <Input
              label="Banner Sub-headline"
              placeholder="e.g. Real-time Admissions Pipeline, Follow-ups, and Payment Collection"
              value={formData.bannerSubtitle}
              onChange={(e) => setFormData({ ...formData, bannerSubtitle: e.target.value })}
            />
          </div>
        </div>

        {/* Widget Visibility Toggles */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Active Dashboard Sections
            </span>
            <span className="text-xs text-slate-500">
              Click any widget to toggle visibility
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {widgetCards.map((widget) => {
              const Icon = widget.icon;
              const isEnabled = Boolean(formData[widget.key]);

              return (
                <div
                  key={widget.key}
                  onClick={() => toggleWidget(widget.key)}
                  className={`p-4 rounded-xl border flex items-start justify-between cursor-pointer transition-all ${
                    isEnabled
                      ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 shadow-sm'
                      : 'bg-slate-100/30 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-start space-x-3 min-w-0 pr-3">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${widget.iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {widget.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        {widget.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex-shrink-0 pt-0.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold ${
                        isEnabled
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {isEnabled ? (
                        <>
                          <Eye className="w-3 h-3" /> Visible
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" /> Hidden
                        </>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-500">
            {savedSuccess ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Dashboard settings updated!
              </span>
            ) : (
              'Dashboard immediately updates upon saving.'
            )}
          </span>

          <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />}>
            Save Dashboard Layout
          </Button>
        </div>
      </div>
    </form>
  );
};
