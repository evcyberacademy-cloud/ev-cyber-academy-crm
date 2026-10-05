import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { BackupManager } from '../components/settings/BackupManager';
import { ConnectionGuide } from '../components/settings/ConnectionGuide';
import { PROGRAM_OPTIONS, SOURCE_OPTIONS, STATUS_OPTIONS } from '../lib/constants';
import { Settings, Moon, Sun, BookOpen, Layers, ShieldCheck, Database } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          System Settings & Cloud Infrastructure
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure application preferences, export/import backups, and manage Supabase Free Tier configuration.
        </p>
      </div>

      {/* 1. Theme Preferences */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Visual Interface Theme
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border flex items-center space-x-3 text-left transition-all ${
              theme === 'dark'
                ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/40 ring-1 ring-brand-500'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
            }`}
          >
            <div className="p-2 rounded-lg bg-slate-800 text-amber-400">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white block">
                Dark Mode (Recommended)
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Sleek cybersecurity operations theme with high contrast
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border flex items-center space-x-3 text-left transition-all ${
              theme === 'light'
                ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/40 ring-1 ring-brand-500'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
            }`}
          >
            <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white block">
                Light Mode
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Clean daylight palette with crisp borders
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Database Backup & Restore Component */}
      <BackupManager />

      {/* 3. Supabase Cloud Connection & Zero Cost Guide */}
      <ConnectionGuide />

      {/* 4. Academy Program & Source Reference */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Standardized Taxonomy Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Programs */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white">
              <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Standard Programs ({PROGRAM_OPTIONS.length})</span>
            </div>
            <ul className="space-y-1 text-slate-600 dark:text-slate-400 pl-1">
              {PROGRAM_OPTIONS.map((p) => (
                <li key={p} className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sources */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Acquisition Sources ({SOURCE_OPTIONS.length})</span>
            </div>
            <ul className="space-y-1 text-slate-600 dark:text-slate-400 pl-1">
              {SOURCE_OPTIONS.map((s) => (
                <li key={s} className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Statuses */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Pipeline Stages ({STATUS_OPTIONS.length})</span>
            </div>
            <ul className="space-y-1 text-slate-600 dark:text-slate-400 pl-1">
              {STATUS_OPTIONS.map((st) => (
                <li key={st} className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{st}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
