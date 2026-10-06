import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AppSettings,
  CompanySettings,
  DashboardWidgetSettings,
  ProgramItem,
  SourceItem,
  StatusConfigItem,
  FollowupSettings,
  AppearanceSettings,
  DEFAULT_APP_SETTINGS,
} from '../types/settings';
import { LeadStatus } from '../types/database';

const SETTINGS_STORAGE_KEY = 'ev_crm_app_settings_v2';

interface SettingsContextType {
  settings: AppSettings;
  updateCompany: (updates: Partial<CompanySettings>) => void;
  updateDashboard: (updates: Partial<DashboardWidgetSettings>) => void;
  addProgram: (prog: Omit<ProgramItem, 'id'>) => void;
  updateProgram: (id: string, updates: Partial<ProgramItem>) => void;
  deleteProgram: (id: string) => void;
  addSource: (name: string) => void;
  updateSource: (id: string, updates: Partial<SourceItem>) => void;
  deleteSource: (id: string) => void;
  updateStatusConfig: (key: LeadStatus, updates: Partial<StatusConfigItem>) => void;
  updateFollowup: (updates: Partial<FollowupSettings>) => void;
  updateAppearance: (updates: Partial<AppearanceSettings>) => void;
  resetToDefaults: () => void;
  formatCurrency: (amount: number | string | null | undefined) => string;
  importSettings: (newSettings: Partial<AppSettings>) => boolean;
  exportSettings: () => void;
  activePrograms: string[];
  activeSources: string[];
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_APP_SETTINGS,
          ...parsed,
          company: { ...DEFAULT_APP_SETTINGS.company, ...(parsed.company || {}) },
          dashboard: { ...DEFAULT_APP_SETTINGS.dashboard, ...(parsed.dashboard || {}) },
          followup: { ...DEFAULT_APP_SETTINGS.followup, ...(parsed.followup || {}) },
          appearance: { ...DEFAULT_APP_SETTINGS.appearance, ...(parsed.appearance || {}) },
          programs: Array.isArray(parsed.programs) && parsed.programs.length > 0 ? parsed.programs : DEFAULT_APP_SETTINGS.programs,
          sources: Array.isArray(parsed.sources) && parsed.sources.length > 0 ? parsed.sources : DEFAULT_APP_SETTINGS.sources,
          statuses: Array.isArray(parsed.statuses) && parsed.statuses.length > 0 ? parsed.statuses : DEFAULT_APP_SETTINGS.statuses,
        };
      }
    } catch (err) {
      console.error('Failed to load settings from storage:', err);
    }
    return DEFAULT_APP_SETTINGS;
  });

  // Save to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  }, [settings]);

  // Dynamic Document Title based on Company Name
  useEffect(() => {
    if (settings.company?.name) {
      document.title = `${settings.company.name} | Lead Command Center`;
    }
  }, [settings.company?.name]);

  const updateCompany = useCallback((updates: Partial<CompanySettings>) => {
    setSettings((prev) => ({
      ...prev,
      company: { ...prev.company, ...updates },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateDashboard = useCallback((updates: Partial<DashboardWidgetSettings>) => {
    setSettings((prev) => ({
      ...prev,
      dashboard: { ...prev.dashboard, ...updates },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const addProgram = useCallback((prog: Omit<ProgramItem, 'id'>) => {
    const newItem: ProgramItem = {
      ...prog,
      id: `prog-${Date.now()}`,
      isActive: prog.isActive ?? true,
    };
    setSettings((prev) => ({
      ...prev,
      programs: [...prev.programs, newItem],
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateProgram = useCallback((id: string, updates: Partial<ProgramItem>) => {
    setSettings((prev) => ({
      ...prev,
      programs: prev.programs.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const deleteProgram = useCallback((id: string) => {
    setSettings((prev) => ({
      ...prev,
      programs: prev.programs.filter((p) => p.id !== id),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const addSource = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const newItem: SourceItem = {
      id: `src-${Date.now()}`,
      name: trimmed,
      isActive: true,
    };
    setSettings((prev) => ({
      ...prev,
      sources: [...prev.sources, newItem],
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateSource = useCallback((id: string, updates: Partial<SourceItem>) => {
    setSettings((prev) => ({
      ...prev,
      sources: prev.sources.map((s) => (s.id === id ? { ...s, ...updates } : s)),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const deleteSource = useCallback((id: string) => {
    setSettings((prev) => ({
      ...prev,
      sources: prev.sources.filter((s) => s.id !== id),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateStatusConfig = useCallback((key: LeadStatus, updates: Partial<StatusConfigItem>) => {
    setSettings((prev) => ({
      ...prev,
      statuses: prev.statuses.map((st) => (st.key === key ? { ...st, ...updates } : st)),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateFollowup = useCallback((updates: Partial<FollowupSettings>) => {
    setSettings((prev) => ({
      ...prev,
      followup: { ...prev.followup, ...updates },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateAppearance = useCallback((updates: Partial<AppearanceSettings>) => {
    setSettings((prev) => ({
      ...prev,
      appearance: { ...prev.appearance, ...updates },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setSettings({
      ...DEFAULT_APP_SETTINGS,
      updatedAt: new Date().toISOString(),
    });
    try {
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const formatCurrencyValue = useCallback(
    (amount: number | string | null | undefined): string => {
      const num = typeof amount === 'number' ? amount : parseFloat(String(amount || 0));
      if (isNaN(num)) return `${settings.company.currencySymbol}0`;

      try {
        const formatted = new Intl.NumberFormat(
          settings.company.currencyCode === 'INR' ? 'en-IN' : 'en-US',
          {
            maximumFractionDigits: 0,
          }
        ).format(num);

        if (settings.company.currencyPosition === 'suffix') {
          return `${formatted} ${settings.company.currencySymbol}`;
        }
        return `${settings.company.currencySymbol}${formatted}`;
      } catch {
        return `${settings.company.currencySymbol}${num}`;
      }
    },
    [settings.company.currencyCode, settings.company.currencySymbol, settings.company.currencyPosition]
  );

  const importSettings = useCallback((newSettings: Partial<AppSettings>): boolean => {
    try {
      setSettings((prev) => ({
        ...prev,
        ...newSettings,
        company: { ...prev.company, ...(newSettings.company || {}) },
        dashboard: { ...prev.dashboard, ...(newSettings.dashboard || {}) },
        programs: Array.isArray(newSettings.programs) ? newSettings.programs : prev.programs,
        sources: Array.isArray(newSettings.sources) ? newSettings.sources : prev.sources,
        statuses: Array.isArray(newSettings.statuses) ? newSettings.statuses : prev.statuses,
        followup: { ...prev.followup, ...(newSettings.followup || {}) },
        appearance: { ...prev.appearance, ...(newSettings.appearance || {}) },
        updatedAt: new Date().toISOString(),
      }));
      return true;
    } catch (err) {
      console.error('Failed to import settings:', err);
      return false;
    }
  }, []);

  const exportSettings = useCallback(() => {
    const dataStr = JSON.stringify(settings, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `crm_settings_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [settings]);

  const activePrograms = settings.programs.filter((p) => p.isActive).map((p) => p.name);
  const activeSources = settings.sources.filter((s) => s.isActive).map((s) => s.name);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateCompany,
        updateDashboard,
        addProgram,
        updateProgram,
        deleteProgram,
        addSource,
        updateSource,
        deleteSource,
        updateStatusConfig,
        updateFollowup,
        updateAppearance,
        resetToDefaults,
        formatCurrency: formatCurrencyValue,
        importSettings,
        exportSettings,
        activePrograms,
        activeSources,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
