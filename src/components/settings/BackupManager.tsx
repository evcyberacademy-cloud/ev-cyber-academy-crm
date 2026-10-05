import React, { useState, useRef } from 'react';
import { useLeads } from '../../contexts/LeadsContext';
import { Download, Upload, ShieldAlert, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

export const BackupManager: React.FC = () => {
  const { leads, exportLeadsToJson, importLeadsFromJson } = useLeads();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [importFile, setImportFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[] | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResultMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const leadsArray = Array.isArray(parsed) ? parsed : parsed.leads;

        if (!Array.isArray(leadsArray) || leadsArray.length === 0) {
          setResultMessage({
            type: 'error',
            text: 'Invalid backup file. Could not find a list of leads.',
          });
          return;
        }

        setImportFile(file);
        setParsedData(leadsArray);
        setImportModalOpen(true);
      } catch (err: any) {
        setResultMessage({
          type: 'error',
          text: 'Failed to read or parse JSON file: ' + err.message,
        });
      }
    };
    reader.readAsText(file);

    // Reset input so re-selecting same file triggers onChange
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const executeImport = async () => {
    if (!parsedData) return;
    setLoading(true);
    setResultMessage(null);

    try {
      const res = await importLeadsFromJson(parsedData, importMode);
      if (res.error) {
        setResultMessage({ type: 'error', text: res.error });
      } else {
        setResultMessage({
          type: 'success',
          text: `Successfully imported ${res.count} lead records (${importMode === 'replace' ? 'Replaced database' : 'Added to existing data'})!`,
        });
        setImportModalOpen(false);
        setParsedData(null);
        setImportFile(null);
      }
    } catch (e: any) {
      setResultMessage({ type: 'error', text: e.message || 'Import failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Database Backup & Restore (JSON)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Export your entire EV Cyber Academy lead repository for safekeeping, or restore from a previous JSON backup.
        </p>
      </div>

      {resultMessage && (
        <div
          className={`p-4 rounded-lg text-xs flex items-center space-x-2 ${
            resultMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
          }`}
        >
          {resultMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{resultMessage.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Export Card */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-semibold text-sm mb-1">
              <Download className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Export Lead Data</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Download all {leads.length} leads with full contact notes, payment history, and follow-up records.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={exportLeadsToJson}
            leftIcon={<Download className="w-4 h-4" />}
            className="w-full bg-white dark:bg-slate-900"
          >
            Export Backup ({leads.length} records)
          </Button>
        </div>

        {/* Import Card */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-semibold text-sm mb-1">
              <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Import Lead Backup</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Select an <code className="text-slate-700 dark:text-slate-300">.json</code> backup file to merge or replace lead records.
            </p>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".json,application/json"
            className="hidden"
          />

          <Button
            variant="primary"
            onClick={() => fileInputRef.current?.click()}
            leftIcon={<Upload className="w-4 h-4" />}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            Choose JSON File to Import
          </Button>
        </div>
      </div>

      {/* Import Modal */}
      <Modal
        isOpen={importModalOpen}
        onClose={() => !loading && setImportModalOpen(false)}
        title="Confirm Backup Import"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-xs">
            <p className="font-semibold text-indigo-900 dark:text-indigo-200">
              Found {parsedData?.length || 0} leads in selected backup file:
            </p>
            <p className="text-indigo-700 dark:text-indigo-300 truncate mt-0.5">
              {importFile?.name}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Select how to apply this backup:
            </p>

            {/* Option 1: Add to Existing Data */}
            <label
              className={`flex items-start space-x-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                importMode === 'append'
                  ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/40 ring-1 ring-brand-500'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <input
                type="radio"
                name="importMode"
                value="append"
                checked={importMode === 'append'}
                onChange={() => setImportMode('append')}
                className="mt-1 text-brand-600 focus:ring-brand-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Option 1: Add to Existing Data (Recommended)
                </span>
                <span className="text-slate-500 dark:text-slate-400 mt-0.5 block">
                  Merges imported leads into your current database. Existing records are preserved without data loss.
                </span>
              </div>
            </label>

            {/* Option 2: Replace All Data */}
            <label
              className={`flex items-start space-x-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                importMode === 'replace'
                  ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/40 ring-1 ring-rose-500'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <input
                type="radio"
                name="importMode"
                value="replace"
                checked={importMode === 'replace'}
                onChange={() => setImportMode('replace')}
                className="mt-1 text-rose-600 focus:ring-rose-500"
              />
              <div className="text-xs">
                <span className="font-bold text-rose-700 dark:text-rose-300 block">
                  Option 2: Replace All Data (Danger)
                </span>
                <span className="text-rose-600/80 dark:text-rose-400/80 mt-0.5 block">
                  Erases all currently stored leads and completely replaces them with the contents of this backup file.
                </span>
              </div>
            </label>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setImportModalOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant={importMode === 'replace' ? 'danger' : 'primary'}
              size="sm"
              onClick={executeImport}
              isLoading={loading}
            >
              {importMode === 'replace' ? 'Replace All & Import' : 'Import & Merge'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
