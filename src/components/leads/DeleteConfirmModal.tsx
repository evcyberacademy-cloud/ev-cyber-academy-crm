import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Lead } from '../../types/database';
import { AlertTriangle, Archive, Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onArchive: (id: string) => Promise<void>;
  onPermanentDelete: (id: string) => Promise<void>;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  lead,
  onArchive,
  onPermanentDelete,
}) => {
  const [loading, setLoading] = useState(false);
  const [showPermanentDanger, setShowPermanentDanger] = useState(false);

  if (!lead) return null;

  const handleArchive = async () => {
    setLoading(true);
    try {
      await onArchive(lead.id);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handlePermanent = async () => {
    setLoading(true);
    try {
      await onPermanentDelete(lead.id);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete / Archive Lead"
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-amber-900 dark:text-amber-200">
              Are you sure you want to remove <span className="underline">{lead.full_name}</span>?
            </p>
            <p className="text-amber-700 dark:text-amber-300 mt-0.5">
              Program: {lead.interested_program} • Phone: {lead.phone}
            </p>
          </div>
        </div>

        {!showPermanentDanger ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              We recommend <strong>Archiving</strong>. Archiving hides this lead from active views while preserving all follow-up and payment history for future re-engagement.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                variant="primary"
                className="flex-1 bg-brand-600 hover:bg-brand-700"
                onClick={handleArchive}
                isLoading={loading}
                leftIcon={<Archive className="w-4 h-4" />}
              >
                Archive Lead (Safe)
              </Button>

              <button
                type="button"
                onClick={() => setShowPermanentDanger(true)}
                className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 underline py-2 px-3"
              >
                Permanently delete instead...
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 p-3 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/30">
            <p className="text-xs font-semibold text-rose-700 dark:text-rose-300">
              ⚠️ Permanent Deletion Warning: This will completely erase this lead and cannot be undone.
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPermanentDanger(false)}
                disabled={loading}
              >
                Go Back
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handlePermanent}
                isLoading={loading}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Yes, Delete Permanently
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
