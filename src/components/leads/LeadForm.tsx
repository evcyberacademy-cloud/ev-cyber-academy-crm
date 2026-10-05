import React, { useState, useEffect } from 'react';
import { LeadFormData, Lead, LeadStatus } from '../../types/database';
import { STATUS_OPTIONS, SOURCE_OPTIONS } from '../../lib/constants';
import { getAllProgramOptions, saveCustomProgram } from '../../lib/programs';
import { useLeads } from '../../contexts/LeadsContext';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Textarea } from '../common/Textarea';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import {
  User,
  Phone,
  BookOpen,
  Calendar,
  Save,
  Plus,
  CheckCircle2,
  Sparkles,
  Layers,
  Activity,
  FileText,
} from 'lucide-react';

interface LeadFormProps {
  initialData?: Lead | null;
  onSubmit: (data: LeadFormData) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
  buttonText?: string;
}

export const LeadForm: React.FC<LeadFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  onCancel,
  buttonText = 'Save Lead',
}) => {
  const { leads } = useLeads();

  // Extract all existing program names from leads in DB
  const existingLeadPrograms = leads.map((l) => l.interested_program);

  const [programsList, setProgramsList] = useState<string[]>(() =>
    getAllProgramOptions(existingLeadPrograms)
  );

  const [formData, setFormData] = useState<LeadFormData>({
    full_name: '',
    phone: '',
    interested_program: 'LFHP',
    status: 'New',
    source: 'Website',
    next_followup_date: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [addProgramModalOpen, setAddProgramModalOpen] = useState(false);
  const [newProgramName, setNewProgramName] = useState('');
  const [programError, setProgramError] = useState('');

  // Update programs list if leads change
  useEffect(() => {
    setProgramsList(getAllProgramOptions(existingLeadPrograms));
  }, [leads.length]);

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      const prog = initialData.interested_program || 'LFHP';
      // Ensure custom program is in list
      if (!programsList.includes(prog)) {
        setProgramsList((prev) => [...prev, prog]);
      }

      setFormData({
        full_name: initialData.full_name || '',
        phone: initialData.phone || '',
        interested_program: prog,
        status: initialData.status || 'New',
        source: initialData.source || 'Website',
        next_followup_date: initialData.next_followup_date
          ? initialData.next_followup_date.split('T')[0]
          : '',
        notes: initialData.notes || '',
        // preserve existing extra fields if editing
        email: initialData.email || '',
        total_amount: initialData.total_amount || 0,
        paid_amount: initialData.paid_amount || 0,
        payment_note: initialData.payment_note || '',
        followup_note: initialData.followup_note || '',
      });
    }
  }, [initialData]);

  const handleAddNewProgram = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newProgramName.trim();
    if (!trimmed) {
      setProgramError('Please enter a program name');
      return;
    }

    // Save program permanently
    const updated = saveCustomProgram(trimmed);
    const combined = Array.from(new Set([...programsList, ...updated, trimmed]));
    setProgramsList(combined);

    // Auto-select the newly added program
    setFormData((prev) => ({ ...prev, interested_program: trimmed }));
    setNewProgramName('');
    setProgramError('');
    setAddProgramModalOpen(false);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Candidate name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const digitsOnly = formData.phone.replace(/[^0-9]/g, '');
      if (digitsOnly.length < 7) {
        newErrors.phone = 'Please enter a valid phone number (minimum 7 digits)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  const programOptions = programsList.map((p) => ({
    value: p,
    label: p,
  }));

  const statusOptions = STATUS_OPTIONS.map((st) => ({
    value: st,
    label: st,
  }));

  const sourceOptions = SOURCE_OPTIONS.map((src) => ({
    value: src,
    label: src,
  }));

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-card space-y-5">
          {/* Row 1: Candidate Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name *"
              placeholder="e.g. Rahul Sharma"
              value={formData.full_name}
              onChange={(e) => {
                setFormData({ ...formData, full_name: e.target.value });
                if (errors.full_name) setErrors({ ...errors, full_name: '' });
              }}
              error={errors.full_name}
              leftIcon={<User className="w-4 h-4" />}
              autoFocus={!initialData}
              required
            />

            <Input
              label="Phone Number *"
              type="tel"
              placeholder="e.g. +91 98765 43210"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                if (errors.phone) setErrors({ ...errors, phone: '' });
              }}
              error={errors.phone}
              leftIcon={<Phone className="w-4 h-4" />}
              required
            />
          </div>

          {/* Row 2: Program Dropdown with Dynamic '+ Add Program' button */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                Interested Program *
              </label>
              <button
                type="button"
                onClick={() => setAddProgramModalOpen(true)}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add New Program</span>
              </button>
            </div>

            <Select
              options={programOptions}
              value={formData.interested_program}
              onChange={(e) =>
                setFormData({ ...formData, interested_program: e.target.value })
              }
              className="font-medium"
            />
          </div>

          {/* Row 3: Status & Source Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Pipeline Status *"
              options={statusOptions}
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as LeadStatus })
              }
            />

            <Select
              label="Lead Source *"
              options={sourceOptions}
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            />
          </div>

          {/* Row 4: Next Follow-up Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Next Follow-up Date (Optional)"
              type="date"
              value={formData.next_followup_date || ''}
              onChange={(e) =>
                setFormData({ ...formData, next_followup_date: e.target.value })
              }
              leftIcon={<Calendar className="w-4 h-4" />}
            />

            <div className="hidden sm:flex items-center text-xs text-slate-400 dark:text-slate-500 pt-6">
              <span>Follow-up reminders will appear automatically in the Command Center.</span>
            </div>
          </div>

          {/* Row 5: Short Note */}
          <Textarea
            label="Short Note / Remarks (Optional)"
            placeholder="e.g. Inquired about weekend batch syllabus, interested in malware analysis module..."
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={2}
          />

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="font-bold px-8 shadow-md shadow-brand-500/20"
              isLoading={isLoading}
              leftIcon={<Save className="w-4 h-4" />}
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </form>

      {/* Modal: + Add New Program to Dropdown */}
      <Modal
        isOpen={addProgramModalOpen}
        onClose={() => {
          setAddProgramModalOpen(false);
          setNewProgramName('');
          setProgramError('');
        }}
        title="Add New Course / Workshop Program"
        description="Newly created programs will immediately be available in the dropdown for all leads."
        maxWidth="sm"
      >
        <form onSubmit={handleAddNewProgram} className="space-y-4">
          <Input
            label="Program Name *"
            placeholder="e.g. Android Hacking Workshop"
            value={newProgramName}
            onChange={(e) => {
              setNewProgramName(e.target.value);
              if (programError) setProgramError('');
            }}
            error={programError}
            autoFocus
            required
            leftIcon={<Sparkles className="w-4 h-4 text-brand-500" />}
          />

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setAddProgramModalOpen(false);
                setNewProgramName('');
                setProgramError('');
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Program to Dropdown
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
