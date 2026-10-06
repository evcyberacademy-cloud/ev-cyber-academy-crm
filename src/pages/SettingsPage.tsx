import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { BrandingSettings } from '../components/settings/BrandingSettings';
import { DashboardSettingsTab } from '../components/settings/DashboardSettingsTab';
import { ProgramsSettingsTab } from '../components/settings/ProgramsSettingsTab';
import { SourcesSettingsTab } from '../components/settings/SourcesSettingsTab';
import { PipelineSettingsTab } from '../components/settings/PipelineSettingsTab';
import { FollowupSettingsTab } from '../components/settings/FollowupSettingsTab';
import { AppearanceSettingsTab } from '../components/settings/AppearanceSettingsTab';
import { BackupManager } from '../components/settings/BackupManager';
import { SettingsBackupAndReset } from '../components/settings/SettingsBackupAndReset';
import { ConnectionGuide } from '../components/settings/ConnectionGuide';
import {
  Settings,
  Building2,
  LayoutDashboard,
  BookOpen,
  Layers,
  ShieldCheck,
  CalendarClock,
  Sparkles,
  Database,
  Sliders,
} from 'lucide-react';

type SettingsTab =
  | 'branding'
  | 'dashboard'
  | 'programs'
  | 'sources'
  | 'pipeline'
  | 'followup'
  | 'appearance'
  | 'database';

export const SettingsPage: React.FC = () => {
  const { settings } = useSettings();
  const [activeTab, setActiveTab] = useState<SettingsTab>('branding');

  const tabs: { id: SettingsTab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'branding', label: 'Organization & Brand', icon: Building2 },
    { id: 'dashboard', label: 'Dashboard Widgets', icon: LayoutDashboard },
    { id: 'programs', label: 'Programs & Courses', icon: BookOpen, count: settings.programs.length },
    { id: 'sources', label: 'Lead Sources', icon: Layers, count: settings.sources.length },
    { id: 'pipeline', label: 'Pipeline Stages', icon: ShieldCheck, count: settings.statuses.length },
    { id: 'followup', label: 'Follow-up Rules', icon: CalendarClock },
    { id: 'appearance', label: 'Theme & Display', icon: Sparkles },
    { id: 'database', label: 'Database & Cloud', icon: Database },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
            <Settings className="w-5 h-5" />
          </div>
          <span>System Settings & A-Z Customizer</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Full control center to configure branding, dashboard display, academic offerings, pipeline rules, and cloud backups.
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-subtle no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/25 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="transition-all duration-200">
        {activeTab === 'branding' && <BrandingSettings />}
        {activeTab === 'dashboard' && <DashboardSettingsTab />}
        {activeTab === 'programs' && <ProgramsSettingsTab />}
        {activeTab === 'sources' && <SourcesSettingsTab />}
        {activeTab === 'pipeline' && <PipelineSettingsTab />}
        {activeTab === 'followup' && <FollowupSettingsTab />}
        {activeTab === 'appearance' && <AppearanceSettingsTab />}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <BackupManager />
            <SettingsBackupAndReset />
            <ConnectionGuide />
          </div>
        )}
      </div>
    </div>
  );
};
