import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSettings } from '../../contexts/SettingsContext';
import { Moon, Sun, Sparkles, Sliders, Check } from 'lucide-react';

export const AppearanceSettingsTab: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { settings, updateAppearance } = useSettings();

  const handleDensityChange = (density: 'comfortable' | 'compact') => {
    updateAppearance({ density });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            Visual Interface & Experience
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Personalize your workspace aesthetics, color scheme, and data presentation density.
          </p>
        </div>

        {/* Theme Modes */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
            Color Theme
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setTheme('dark');
                updateAppearance({ theme: 'dark' });
              }}
              className={`p-4 rounded-xl border flex items-center space-x-3 text-left transition-all ${
                theme === 'dark'
                  ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/40 ring-1 ring-brand-500'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="p-2 rounded-lg bg-slate-800 text-amber-400">
                <Sun className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  Dark Mode (Recommended)
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Sleek cybersecurity operations theme with high contrast
                </span>
              </div>
              {theme === 'dark' && <Check className="w-4 h-4 text-brand-500" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setTheme('light');
                updateAppearance({ theme: 'light' });
              }}
              className={`p-4 rounded-xl border flex items-center space-x-3 text-left transition-all ${
                theme === 'light'
                  ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/40 ring-1 ring-brand-500'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                <Moon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  Light Mode
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Clean daylight palette with crisp borders
                </span>
              </div>
              {theme === 'light' && <Check className="w-4 h-4 text-brand-500" />}
            </button>
          </div>
        </div>

        {/* Table & List Density */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
            Table & List Row Density
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleDensityChange('comfortable')}
              className={`p-4 rounded-xl border flex items-center justify-between text-left transition-all ${
                settings.appearance.density === 'comfortable'
                  ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/40 ring-1 ring-brand-500'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  Comfortable Spacing
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Standard row height with generous padding and readability
                </span>
              </div>
              {settings.appearance.density === 'comfortable' && (
                <Check className="w-4 h-4 text-brand-500" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleDensityChange('compact')}
              className={`p-4 rounded-xl border flex items-center justify-between text-left transition-all ${
                settings.appearance.density === 'compact'
                  ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/40 ring-1 ring-brand-500'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  Compact View
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  High density rows to view more leads without scrolling
                </span>
              </div>
              {settings.appearance.density === 'compact' && (
                <Check className="w-4 h-4 text-brand-500" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
