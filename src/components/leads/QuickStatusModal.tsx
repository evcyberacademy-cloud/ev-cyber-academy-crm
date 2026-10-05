import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Lead, LeadStatus } from '../../types/database';
import { STATUS_OPTIONS } from '../../lib/constants';
import { Badge } from '../common/Badge';
import { CheckCircle2 } from 'lucide-react';

interface QuickStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onUpdateStatus: (id: string, newStatus: LeadStatus) => Promise<void>;
}

export const QuickStatusModal: React.FC<QuickStatusModalProps> = ({
  isOpen,
  onClose,
  lead,
  onUpdateStatus,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | null>(null);
  const [loading, setLoading] = useState(false);

  if (!lead) return null;

  const currentStatus = selectedStatus || lead.status;

  const handleSave = async () => {
    if (!selectedStatus || selectedStatus === lead.status) {
      onClose();
      return;
    }
    setLoading(true);
    try {
      await onUpdateStatus(lead.id, selectedStatus);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Lead Pipeline Status"
      description={`Update status for ${lead.full_name}`}
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          {STATUS_OPTIONS.map((st) => {
            const isSelected = currentStatus === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 ring-1 ring-brand-500 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Badge status={st} size="sm" />
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            isLoading={loading}
            disabled={!selectedStatus || selectedStatus === lead.status}
          >
            Update Status
          </Button>
        </div>
      </div>
    </Modal>
  );
};
