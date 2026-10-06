import React, { useState } from 'react';
import { Lead } from '../../types/database';
import { Badge } from '../common/Badge';
import {
  formatCurrency,
  formatDate,
  formatRelativeTime,
  calculatePending,
  cleanPhoneForWhatsApp,
  getFollowupTiming,
} from '../../lib/utils';
import {
  Phone,
  MessageSquare,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  IndianRupee,
  Archive,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { QuickStatusModal } from './QuickStatusModal';
import { QuickPaymentModal } from './QuickPaymentModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { useLeads } from '../../contexts/LeadsContext';
import { useSettings } from '../../contexts/SettingsContext';

interface LeadCardProps {
  lead: Lead;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
  const {
    updateStatus,
    updatePayment,
    archiveLead,
    restoreLead,
    deleteLeadPermanently,
  } = useLeads();
  const { formatCurrency } = useSettings();

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const pending = calculatePending(lead.total_amount, lead.paid_amount);
  const waNumber = cleanPhoneForWhatsApp(lead.phone);
  const programName =
    lead.interested_program === 'Custom'
      ? lead.custom_program || 'Custom'
      : lead.interested_program;
  const followupTiming = getFollowupTiming(lead.next_followup_date);

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col justify-between space-y-3">
        {/* Top: Name, Status & Program */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              to={`/leads/${lead.id}`}
              className="font-bold text-sm text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors line-clamp-1"
            >
              {lead.full_name}
            </Link>

            <button
              onClick={() => setStatusModalOpen(true)}
              className="flex-shrink-0 cursor-pointer"
              title="Change Status"
            >
              <Badge status={lead.status} size="sm" />
            </button>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span className="font-semibold text-brand-600 dark:text-brand-400 truncate max-w-[160px]">
              {programName}
            </span>
            <span>•</span>
            <span className="truncate">{lead.source}</span>
          </div>
        </div>

        {/* Contact actions */}
        <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 text-xs">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {lead.phone}
          </span>
          <div className="flex items-center space-x-2">
            <a
              href={`tel:${lead.phone}`}
              className="p-1.5 rounded-md bg-white dark:bg-slate-800 text-slate-600 hover:text-brand-600 shadow-xs border border-slate-200 dark:border-slate-700"
              title="Call"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
            <a
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md bg-white dark:bg-slate-800 text-emerald-600 hover:text-emerald-500 shadow-xs border border-slate-200 dark:border-slate-700"
              title="WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Payment & Follow-up Row */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          {/* Payment */}
          <div
            onClick={() => setPaymentModalOpen(true)}
            className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-slate-300"
          >
            <span className="text-[10px] text-slate-400 block font-medium">Fee / Paid</span>
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>{formatCurrency(lead.total_amount)}</span>
              <span className="text-emerald-600 dark:text-emerald-400 text-[11px]">
                {formatCurrency(lead.paid_amount)}
              </span>
            </div>
            {pending > 0 && (
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block mt-0.5">
                Pending: {formatCurrency(pending)}
              </span>
            )}
          </div>

          {/* Follow-up */}
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Follow-up</span>
            {lead.next_followup_date ? (
              <div>
                <span className={`text-[10px] font-bold block truncate ${followupTiming.badgeClass}`}>
                  {formatDate(lead.next_followup_date)}
                </span>
                {lead.followup_note && (
                  <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                    {lead.followup_note}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-slate-400 text-[11px] block mt-0.5">None scheduled</span>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatRelativeTime(lead.updated_at || lead.created_at)}
          </span>

          <div className="flex items-center space-x-1">
            <Link
              to={`/leads/${lead.id}`}
              className="p-1.5 rounded text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </Link>

            <Link
              to={`/leads/${lead.id}?edit=true`}
              className="p-1.5 rounded text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </Link>

            {lead.is_archived ? (
              <button
                onClick={() => restoreLead(lead.id)}
                className="p-1.5 rounded text-purple-600 hover:bg-purple-50"
                title="Restore"
              >
                <Archive className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                title="Archive / Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <QuickStatusModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        lead={lead}
        onUpdateStatus={async (id, status) => {
          await updateStatus(id, status);
        }}
      />

      <QuickPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        lead={lead}
        onUpdatePayment={async (id, total, paid, note) => {
          await updatePayment(id, total, paid, note);
        }}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        lead={lead}
        onArchive={async (id) => {
          await archiveLead(id);
        }}
        onPermanentDelete={async (id) => {
          await deleteLeadPermanently(id);
        }}
      />
    </>
  );
};
