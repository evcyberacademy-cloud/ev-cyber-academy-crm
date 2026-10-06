import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Lead } from '../../types/database';
import { calculatePending } from '../../lib/utils';
import { useSettings } from '../../contexts/SettingsContext';
import { IndianRupee, CheckCircle2 } from 'lucide-react';

interface QuickPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onUpdatePayment: (id: string, total: number, paid: number, note?: string) => Promise<void>;
}

export const QuickPaymentModal: React.FC<QuickPaymentModalProps> = ({
  isOpen,
  onClose,
  lead,
  onUpdatePayment,
}) => {
  const { formatCurrency, settings } = useSettings();
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [paymentNote, setPaymentNote] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lead) {
      setTotalAmount(lead.total_amount || 0);
      setPaidAmount(lead.paid_amount || 0);
      setPaymentNote(lead.payment_note || '');
      setError(null);
    }
  }, [lead]);

  if (!lead) return null;

  const pendingAmount = calculatePending(totalAmount, paidAmount);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (totalAmount < 0 || paidAmount < 0) {
      setError('Amount values cannot be negative');
      return;
    }

    if (paidAmount > totalAmount && totalAmount > 0) {
      setError('Paid amount cannot exceed total course fee');
      return;
    }

    setLoading(true);
    try {
      await onUpdatePayment(lead.id, totalAmount, paidAmount, paymentNote);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update payment details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Fee & Payment"
      description={`Manage payment for ${lead.full_name} (${lead.interested_program})`}
      maxWidth="md"
    >
      <form onSubmit={handleSave} className="space-y-4">
        {error && (
          <p className="text-xs text-rose-500 font-medium p-2 bg-rose-50 dark:bg-rose-950/40 rounded border border-rose-200 dark:border-rose-900">
            {error}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Total Course Fee (₹)"
            type="number"
            min="0"
            step="1"
            value={totalAmount || ''}
            onChange={(e) => setTotalAmount(Math.max(0, parseFloat(e.target.value) || 0))}
            leftIcon={<IndianRupee className="w-4 h-4" />}
          />

          <Input
            label="Paid Amount (₹)"
            type="number"
            min="0"
            step="1"
            value={paidAmount || ''}
            onChange={(e) => setPaidAmount(Math.max(0, parseFloat(e.target.value) || 0))}
            leftIcon={<IndianRupee className="w-4 h-4" />}
          />
        </div>

        {/* Quick Pending Display */}
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Calculated Pending:
          </span>
          <span
            className={`text-sm font-bold ${
              pendingAmount > 0
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {formatCurrency(pendingAmount)}
          </span>
        </div>

        <Input
          label="Payment Note / Receipt No."
          placeholder="e.g. ₹2,000 paid via GPay on 5th Oct. Balance due before class."
          value={paymentNote}
          onChange={(e) => setPaymentNote(e.target.value)}
        />

        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" size="sm" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={loading}>
            Save Payment
          </Button>
        </div>
      </form>
    </Modal>
  );
};
