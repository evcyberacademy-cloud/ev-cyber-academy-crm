import React, { useState, useEffect } from 'react';
import { LeadFormData, Lead } from '../../types/database';
import { PROGRAM_OPTIONS, STATUS_OPTIONS, SOURCE_OPTIONS } from '../../lib/constants';
import { calculatePending, formatCurrency, getTodayDateString } from '../../lib/utils';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Textarea } from '../common/Textarea';
import { Button } from '../common/Button';
import {
  User,
  Phone,
  Mail,
  BookOpen,
  Calendar,
  DollarSign,
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  IndianRupee,
} from 'lucide-react';

interface LeadFormProps {
  initialData?: Lead | null;
  onSubmit: (data: LeadFormData) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
  title?: string;
  buttonText?: string;
}

export const LeadForm: React.FC<LeadFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  onCancel,
  title,
  buttonText = 'Save Lead',
}) => {
  const [formData, setFormData] = useState<LeadFormData>({
    full_name: '',
    phone: '',
    email: '',
    interested_program: 'LFHP',
    custom_program: '',
    status: 'New',
    source: 'Website',
    custom_source: '',
    notes: '',
    next_followup_date: '',
    followup_note: '',
    total_amount: 0,
    paid_amount: 0,
    payment_note: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        full_name: initialData.full_name || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        interested_program: initialData.interested_program || 'LFHP',
        custom_program: initialData.custom_program || '',
        status: initialData.status || 'New',
        source: initialData.source || 'Website',
        custom_source: initialData.custom_source || '',
        notes: initialData.notes || '',
        next_followup_date: initialData.next_followup_date ? initialData.next_followup_date.split('T')[0] : '',
        followup_note: initialData.followup_note || '',
        total_amount: initialData.total_amount || 0,
        paid_amount: initialData.paid_amount || 0,
        payment_note: initialData.payment_note || '',
      });
    }
  }, [initialData]);

  // Live calculation of pending amount
  const pendingAmount = calculatePending(formData.total_amount, formData.paid_amount);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const digitsOnly = formData.phone.replace(/[^0-9]/g, '');
      if (digitsOnly.length < 7) {
        newErrors.phone = 'Please enter a valid phone number with country/area code';
      }
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (formData.interested_program === 'Custom' && !formData.custom_program.trim()) {
      newErrors.custom_program = 'Please specify the custom program name';
    }

    if (formData.source === 'Other' && !formData.custom_source.trim()) {
      newErrors.custom_source = 'Please specify the custom source';
    }

    if (Number(formData.total_amount) < 0) {
      newErrors.total_amount = 'Total amount cannot be negative';
    }

    if (Number(formData.paid_amount) < 0) {
      newErrors.paid_amount = 'Paid amount cannot be negative';
    }

    if (Number(formData.paid_amount) > Number(formData.total_amount) && Number(formData.total_amount) > 0) {
      newErrors.paid_amount = 'Paid amount cannot exceed total amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validate()) {
      setFormError('Please resolve the highlighted validation errors above.');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setFormError(err.message || 'An unexpected error occurred while saving the lead.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* SECTION 1: CANDIDATE INFORMATION */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <User className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            1. Candidate Contact Details
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Full Name"
            placeholder="e.g. Rahul Sharma"
            required
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            error={errors.full_name}
            leftIcon={<User className="w-4 h-4" />}
          />

          <Input
            label="Phone Number"
            placeholder="e.g. +91 98765 43210"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={errors.phone}
            helperText="Include country code (e.g. +91)"
            leftIcon={<Phone className="w-4 h-4" />}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. rahul@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            leftIcon={<Mail className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* SECTION 2: PROGRAM, STATUS & LEAD SOURCE */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            2. Program & Lead Pipeline
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Select
              label="Interested Program"
              required
              value={formData.interested_program}
              onChange={(e) => setFormData({ ...formData, interested_program: e.target.value })}
              options={PROGRAM_OPTIONS}
            />
            {formData.interested_program === 'Custom' && (
              <div className="mt-2">
                <Input
                  label="Custom Program Name"
                  placeholder="Enter program or workshop name"
                  required
                  value={formData.custom_program}
                  onChange={(e) => setFormData({ ...formData, custom_program: e.target.value })}
                  error={errors.custom_program}
                />
              </div>
            )}
          </div>

          <Select
            label="Lead Status"
            required
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            options={STATUS_OPTIONS}
          />

          <div>
            <Select
              label="Lead Source"
              required
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              options={SOURCE_OPTIONS}
            />
            {formData.source === 'Other' && (
              <div className="mt-2">
                <Input
                  label="Custom Source Name"
                  placeholder="e.g. College Campus Drive"
                  required
                  value={formData.custom_source}
                  onChange={(e) => setFormData({ ...formData, custom_source: e.target.value })}
                  error={errors.custom_source}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: FOLLOW-UP PLANNING */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              3. Follow-up Scheduling
            </h3>
          </div>
          {formData.next_followup_date && (
            <button
              type="button"
              onClick={() => setFormData({ ...formData, next_followup_date: '', followup_note: '' })}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline"
            >
              Clear Follow-up
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Next Follow-up Date"
              type="date"
              value={formData.next_followup_date}
              onChange={(e) => setFormData({ ...formData, next_followup_date: e.target.value })}
              helperText="Set reminder date for callback or admission check"
              leftIcon={<Calendar className="w-4 h-4" />}
            />
            {/* Quick date chips */}
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-[11px] text-slate-400 font-medium">Quick set:</span>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, next_followup_date: getTodayDateString() })}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => {
                  const d = new Date();
                  d.setDate(d.getDate() + 1);
                  setFormData({ ...formData, next_followup_date: d.toISOString().split('T')[0] });
                }}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => {
                  const d = new Date();
                  d.setDate(d.getDate() + 3);
                  setFormData({ ...formData, next_followup_date: d.toISOString().split('T')[0] });
                }}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
              >
                In 3 Days
              </button>
            </div>
          </div>

          <Input
            label="Follow-up Action Note"
            placeholder="e.g. Call regarding LFHP syllabus and installment plan"
            value={formData.followup_note}
            onChange={(e) => setFormData({ ...formData, followup_note: e.target.value })}
            helperText="What specifically needs to be communicated?"
          />
        </div>
      </div>

      {/* SECTION 4: PAYMENT TRACKING & AUTOMATIC PENDING CALCULATION */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <IndianRupee className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            4. Fee & Payment Ledger
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Total Course Fee (₹)"
            type="number"
            min="0"
            step="1"
            placeholder="0"
            value={formData.total_amount || ''}
            onChange={(e) =>
              setFormData({ ...formData, total_amount: Math.max(0, parseFloat(e.target.value) || 0) })
            }
            error={errors.total_amount}
            leftIcon={<IndianRupee className="w-4 h-4" />}
          />

          <Input
            label="Paid Amount (₹)"
            type="number"
            min="0"
            step="1"
            placeholder="0"
            value={formData.paid_amount || ''}
            onChange={(e) =>
              setFormData({ ...formData, paid_amount: Math.max(0, parseFloat(e.target.value) || 0) })
            }
            error={errors.paid_amount}
            leftIcon={<IndianRupee className="w-4 h-4" />}
          />

          {/* Automatic Pending Calculation Display Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Pending Balance (₹) <span className="text-[10px] text-brand-600 dark:text-brand-400 font-normal">Auto-calculated</span>
            </label>
            <div
              className={`flex items-center justify-between px-3.5 py-2 rounded-lg border text-sm font-bold ${
                pendingAmount > 0
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              }`}
            >
              <span>{formatCurrency(pendingAmount)}</span>
              <span className="text-xs font-medium">
                {pendingAmount === 0 && Number(formData.total_amount) > 0
                  ? 'Fully Cleared ✓'
                  : pendingAmount > 0
                  ? 'Due'
                  : 'No fee set'}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Total ({formatCurrency(formData.total_amount)}) - Paid ({formatCurrency(formData.paid_amount)})</p>
          </div>
        </div>

        <Input
          label="Payment Remarks / Transaction Reference"
          placeholder="e.g. ₹2,000 paid via UPI. Remaining ₹5,500 due on batch inauguration."
          value={formData.payment_note}
          onChange={(e) => setFormData({ ...formData, payment_note: e.target.value })}
        />
      </div>

      {/* SECTION 5: GENERAL NOTES */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-3">
        <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <FileText className="w-4 h-4 text-slate-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            5. Internal Notes & Discussion Log
          </h3>
        </div>

        <Textarea
          placeholder="Enter any additional background notes, student qualifications, career goals, or interaction summary..."
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      {/* ACTIONS FOOTER */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
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
          isLoading={isLoading}
          leftIcon={<Save className="w-4 h-4" />}
          className="px-6"
        >
          {buttonText}
        </Button>
      </div>
    </form>
  );
};
