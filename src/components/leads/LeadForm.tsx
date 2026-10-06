import React, { useState, useEffect } from 'react';
import { LeadFormData, Lead, LeadStatus } from '../../types/database';
import { useLeads } from '../../contexts/LeadsContext';
import { useSettings } from '../../contexts/SettingsContext';
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
  Sparkles,
  IndianRupee,
  DollarSign,
  Layers,
  ShieldCheck,
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
  const { settings, activePrograms, activeSources, addProgram, formatCurrency } = useSettings();

  // Combine active programs from settings + any existing lead programs
  const combinedPrograms = Array.from(
    new Set([...activePrograms, ...leads.map((l) => l.interested_program).filter(Boolean)])
  );

  const combinedSources = Array.from(
    new Set([...activeSources, ...leads.map((l) => l.source).filter(Boolean)])
  );

  const [formData, setFormData] = useState<LeadFormData>(() => {
    const defaultProg = combinedPrograms[0] || 'LFHP';
    const matchedProg = settings.programs.find((p) => p.name === defaultProg);
    const defaultFee = matchedProg ? matchedProg.defaultFee : 0;

    return {
      full_name: '',
      phone: '',
      interested_program: defaultProg,
      status: 'New',
      source: combinedSources[0] || 'Website',
      next_followup_date: '',
      notes: '',
      total_amount: defaultFee,
      paid_amount: 0,
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [addProgramModalOpen, setAddProgramModalOpen] = useState(false);
  const [newProgramName, setNewProgramName] = useState('');
  const [newProgramFee, setNewProgramFee] = useState<number | string>(0);
  const [programError, setProgramError] = useState('');

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      const prog = initialData.interested_program || combinedPrograms[0] || 'LFHP';
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
        email: initialData.email || '',
        total_amount: initialData.total_amount || 0,
        paid_amount: initialData.paid_amount || 0,
        payment_note: initialData.payment_note || '',
        followup_note: initialData.followup_note || '',
      });
    }
  }, [initialData]);

  const handleProgramChange = (selectedProg: string) => {
    const matched = settings.programs.find((p) => p.name === selectedProg);
    setFormData((prev) => ({
      ...prev,
      interested_program: selectedProg,
      // Auto-set fee if creating new lead and current total is 0 or matches previous default
      total_amount:
        !initialData && (prev.total_amount === 0 || prev.total_amount === undefined) && matched
          ? matched.defaultFee
          : prev.total_amount,
    }));
  };

  const handleAddNewProgram = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newProgramName.trim();
    if (!trimmed) {
      setProgramError('Please enter a program name');
      return;
    }

    const feeNum = Number(newProgramFee) || 0;
    addProgram({
      name: trimmed,
      defaultFee: feeNum,
      isActive: true,
    });

    setFormData((prev) => ({
      ...prev,
      interested_program: trimmed,
      total_amount: !initialData ? feeNum : prev.total_amount,
    }));

    setNewProgramName('');
    setNewProgramFee(0);
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

  const programOptions = combinedPrograms.map((p) => ({
    value: p,
    label: p,
  }));

  const statusOptions = settings.statuses.map((st) => ({
    value: st.key,
    label: st.label,
  }));

  const sourceOptions = combinedSources.map((src) => ({
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
                Interested Program / Course *
              </label>
              <button
                type="button"
                onClick={() => setAddProgramModalOpen(true)}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add New Course</span>
              </button>
            </div>

            <Select
              options={programOptions}
              value={formData.interested_program}
              onChange={(e) => handleProgramChange(e.target.value)}
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
              label="Lead Acquisition Source *"
              options={sourceOptions}
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            />
          </div>

          {/* Row 4: Fee & Follow-up Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={`Agreed Tuition Fee (${settings.company.currencySymbol})`}
              type="number"
              min="0"
              placeholder="15000"
              value={formData.total_amount || 0}
              onChange={(e) =>
                setFormData({ ...formData, total_amount: Number(e.target.value) || 0 })
              }
              leftIcon={<span className="text-xs font-bold text-slate-400">{settings.company.currencySymbol}</span>}
            />

            <Input
              label="Next Follow-up Date (Optional)"
              type="date"
              value={formData.next_followup_date || ''}
              onChange={(e) =>
                setFormData({ ...formData, next_followup_date: e.target.value })
              }
              leftIcon={<Calendar className="w-4 h-4" />}
            />
          </div>

          {/* Row 5: Remarks / Notes */}
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
        title="Add New Academic Program / Course"
        description="Newly created programs will immediately be saved to Settings and available across the entire CRM."
        maxWidth="sm"
      >
        <form onSubmit={handleAddNewProgram} className="space-y-4">
          <Input
            label="Program Title *"
            placeholder="e.g. Cloud Security & DevSecOps Bootcamp"
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

          <Input
            label={`Default Fee / Tuition (${settings.company.currencySymbol})`}
            type="number"
            min="0"
            placeholder="15000"
            value={newProgramFee}
            onChange={(e) => setNewProgramFee(e.target.value)}
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
              Add Program
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
