import React, { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { Button } from '../common/Button';
import { CalendarClock, Check, Save, Clock, Bell, Sparkles } from 'lucide-react';

export const FollowupSettingsTab: React.FC = () => {
  const { settings, updateFollowup } = useSettings();
  const [formData, setFormData] = useState({ ...settings.followup });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFollowup(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-5">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Follow-up Rules & Quick-Schedule Shortcuts
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure default interval presets, overdue thresholds, and standard follow-up note templates.
          </p>
        </div>

        {/* Row 1: Default intervals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Default Initial Follow-up Delay (Days)"
            type="number"
            min="0"
            max="30"
            value={formData.defaultIntervalDays}
            onChange={(e) =>
              setFormData({ ...formData, defaultIntervalDays: Number(e.target.value) || 1 })
            }
            leftIcon={<Clock className="w-4 h-4 text-amber-500" />}
          />

          <Input
            label="Overdue Alert Threshold (Days past scheduled date)"
            type="number"
            min="0"
            max="7"
            value={formData.overdueAlertThresholdDays}
            onChange={(e) =>
              setFormData({
                ...formData,
                overdueAlertThresholdDays: Number(e.target.value) || 0,
              })
            }
            leftIcon={<Bell className="w-4 h-4 text-rose-500" />}
          />
        </div>

        {/* Row 2: Default Note Template */}
        <div className="space-y-1.5">
          <Textarea
            label="Default Follow-up Reminder Note Template"
            placeholder="e.g. Call regarding weekend batch syllabus and scholarship fee discounts..."
            value={formData.defaultTemplateNote}
            onChange={(e) => setFormData({ ...formData, defaultTemplateNote: e.target.value })}
            rows={3}
          />
          <p className="text-[11px] text-slate-400">
            This note will be pre-filled when team members create follow-up reminders.
          </p>
        </div>

        {/* Save */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-500">
            {savedSuccess ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Follow-up rules updated!
              </span>
            ) : (
              'Quick interval buttons on lead pages will reflect these defaults.'
            )}
          </span>

          <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />}>
            Save Follow-up Rules
          </Button>
        </div>
      </div>
    </form>
  );
};
