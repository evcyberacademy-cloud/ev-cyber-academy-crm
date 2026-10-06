import React, { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Layers, Plus, Trash2, Power, Globe, Check } from 'lucide-react';

export const SourcesSettingsTab: React.FC = () => {
  const { settings, addSource, updateSource, deleteSource } = useSettings();
  const [newSourceName, setNewSourceName] = useState('');
  const [error, setError] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSourceName.trim();
    if (!trimmed) {
      setError('Please enter a source name');
      return;
    }

    if (settings.sources.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('Source with this name already exists');
      return;
    }

    addSource(trimmed);
    setNewSourceName('');
    setError('');
  };

  const toggleActive = (id: string, current: boolean) => {
    updateSource(id, { isActive: !current });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-5">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Lead Acquisition Channels & Sources ({settings.sources.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track where candidate enquiries originate (Social media, Ads, Webinars, Referrals, Organic website, etc.).
          </p>
        </div>

        {/* Quick Add Form */}
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 max-w-xl">
          <div className="flex-1">
            <Input
              placeholder="e.g. LinkedIn Ads, Google Search, Campus Drive"
              value={newSourceName}
              onChange={(e) => {
                setNewSourceName(e.target.value);
                if (error) setError('');
              }}
              error={error}
              leftIcon={<Globe className="w-4 h-4 text-indigo-500" />}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            className="flex-shrink-0"
          >
            Add Channel
          </Button>
        </form>

        {/* Sources Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {settings.sources.map((src) => (
            <div
              key={src.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                src.isActive
                  ? 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800'
                  : 'bg-slate-100/40 dark:bg-slate-950/20 border-slate-200/60 dark:border-slate-800/40 opacity-50'
              }`}
            >
              <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    src.isActive ? 'bg-indigo-500' : 'bg-slate-400'
                  }`}
                />
                <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {src.name}
                </span>
              </div>

              <div className="flex items-center space-x-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => toggleActive(src.id, src.isActive)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    src.isActive
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                  title="Toggle active status"
                >
                  {src.isActive ? 'Active' : 'Off'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Remove source "${src.name}"?`)) {
                      deleteSource(src.id);
                    }
                  }}
                  className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Delete source"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
