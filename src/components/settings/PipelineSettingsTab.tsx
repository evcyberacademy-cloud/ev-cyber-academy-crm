import React, { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { StatusConfigItem } from '../../types/settings';
import { LeadStatus } from '../../types/database';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { ShieldCheck, Edit2, Check, ArrowRight } from 'lucide-react';

export const PipelineSettingsTab: React.FC = () => {
  const { settings, updateStatusConfig } = useSettings();
  const [editingItem, setEditingItem] = useState<StatusConfigItem | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const openEdit = (item: StatusConfigItem) => {
    setEditingItem(item);
    setEditLabel(item.label);
    setEditDesc(item.description);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    updateStatusConfig(editingItem.key, {
      label: editLabel.trim() || editingItem.key,
      description: editDesc.trim(),
    });
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-5">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Admissions Pipeline Stages ({settings.statuses.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Standardized progression stages guiding candidates from initial outreach to confirmed enrollment and payment.
          </p>
        </div>

        {/* Pipeline Progression Visual Bar */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
            Standard Progression Lifecycle
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
            {['New', 'Contacted', 'Follow-up', 'Interested', 'Converted'].map((st, i, arr) => (
              <React.Fragment key={st}>
                <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 flex-shrink-0 shadow-xs">
                  {st}
                </div>
                {i < arr.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Statuses List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {settings.statuses.map((st) => (
            <div
              key={st.key}
              className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-lg transition-colors"
            >
              <div className="flex items-start space-x-3 min-w-0">
                <span className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${st.dotColor}`} />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {st.label}
                    </span>
                    {st.isDefault && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {st.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openEdit(st)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
                title="Edit stage description"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Stage Modal */}
      <Modal
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        title={`Edit Stage: ${editingItem?.key}`}
        description="Customize the display label and description for this pipeline stage."
        maxWidth="sm"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Display Label *"
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            required
            autoFocus
          />

          <Input
            label="Stage Description"
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
          />

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" size="sm" onClick={() => setEditingItem(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" leftIcon={<Check className="w-3.5 h-3.5" />}>
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
