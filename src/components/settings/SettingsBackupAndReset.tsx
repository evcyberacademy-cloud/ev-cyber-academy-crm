import React, { useState, useRef } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Download, Upload, RotateCcw, AlertTriangle, Check, ShieldAlert } from 'lucide-react';

export const SettingsBackupAndReset: React.FC = () => {
  const { settings, exportSettings, importSettings, resetToDefaults } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSuccessMsg(null);
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const ok = importSettings(parsed);
        if (ok) {
          setSuccessMsg('Settings successfully restored from backup file!');
        } else {
          setErrorMsg('Could not restore settings: invalid JSON structure.');
        }
      } catch (err: any) {
        setErrorMsg('Failed to parse settings JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmReset = () => {
    resetToDefaults();
    setResetModalOpen(false);
    setSuccessMsg('All custom settings reset to factory defaults.');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-5">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Settings Configuration Backup & Reset
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Save your exact branding, dashboard toggles, course catalogs, and source rules or restore them anytime.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Export Settings */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              Export Configuration
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Download current app preferences, programs list, and sources to JSON.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={exportSettings}
            leftIcon={<Download className="w-3.5 h-3.5" />}
            className="w-full bg-white dark:bg-slate-900"
          >
            Export Settings JSON
          </Button>
        </div>

        {/* Import Settings */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              Import Configuration
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Upload a previously exported settings JSON file to restore preferences.
            </p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json,application/json"
            className="hidden"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            leftIcon={<Upload className="w-3.5 h-3.5" />}
            className="w-full bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400"
          >
            Restore Settings JSON
          </Button>
        </div>

        {/* Factory Reset */}
        <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/20 dark:bg-rose-950/10 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-xs font-bold text-rose-700 dark:text-rose-400 block">
              Factory Reset Settings
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Revert all branding, dashboard cards, programs, and sources to original defaults.
            </p>
          </div>
          <Button
            size="sm"
            variant="danger"
            onClick={() => setResetModalOpen(true)}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="w-full"
          >
            Reset to Defaults
          </Button>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset All CRM Settings to Defaults?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
            <div>
              <p className="font-bold">This will reset all custom configuration.</p>
              <p className="mt-0.5 text-rose-700 dark:text-rose-300">
                Academy branding, custom programs, source channels, and dashboard widget toggles will be restored to default. Your candidate leads in the database are not affected.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setResetModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmReset}>
              Yes, Reset Everything
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
