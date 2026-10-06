import React, { useState } from 'react';
import { Lead, LeadStatus } from '../../types/database';
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
  Eye,
  Edit2,
  Trash2,
  Phone,
  MessageSquare,
  IndianRupee,
  MoreHorizontal,
  Archive,
  RefreshCw,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { QuickStatusModal } from './QuickStatusModal';
import { QuickPaymentModal } from './QuickPaymentModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { useLeads } from '../../contexts/LeadsContext';
import { useSettings } from '../../contexts/SettingsContext';

interface LeadTableProps {
  leads: Lead[];
  isLoading?: boolean;
}

export const LeadTable: React.FC<LeadTableProps> = ({ leads, isLoading = false }) => {
  const navigate = useNavigate();
  const {
    updateStatus,
    updatePayment,
    archiveLead,
    restoreLead,
    deleteLeadPermanently,
  } = useLeads();
  const { formatCurrency, settings } = useSettings();
  const isCompact = settings.appearance.density === 'compact';

  const [selectedLeadForStatus, setSelectedLeadForStatus] = useState<Lead | null>(null);
  const [selectedLeadForPayment, setSelectedLeadForPayment] = useState<Lead | null>(null);
  const [selectedLeadForDelete, setSelectedLeadForDelete] = useState<Lead | null>(null);

  if (isLoading) {
    return (
      <div className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center">
        <RefreshCw className="w-6 h-6 animate-spin text-brand-600 dark:text-brand-400 mx-auto mb-2" />
        <p className="text-xs text-slate-500">Loading leads...</p>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Eye className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          No matching leads found
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          Try adjusting your search criteria or filters, or add a new candidate enquiry.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-subtle">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-950/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="py-3 px-4">Name & Contact</th>
              <th className="py-3 px-3">Program</th>
              <th className="py-3 px-3">Source</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Fee (₹)</th>
              <th className="py-3 px-3 text-right">Paid</th>
              <th className="py-3 px-3 text-right">Pending</th>
              <th className="py-3 px-3">Follow-up</th>
              <th className="py-3 px-3">Updated</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {leads.map((lead) => {
              const pending = calculatePending(lead.total_amount, lead.paid_amount);
              const waNumber = cleanPhoneForWhatsApp(lead.phone);
              const programName =
                lead.interested_program === 'Custom'
                  ? lead.custom_program || 'Custom'
                  : lead.interested_program;
              const followupTiming = getFollowupTiming(lead.next_followup_date);

              return (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Name & Contact */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <Link
                        to={`/leads/${lead.id}`}
                        className="font-semibold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                      >
                        {lead.full_name}
                      </Link>
                      <div className="flex items-center space-x-2 mt-0.5 text-slate-500 dark:text-slate-400">
                        <span>{lead.phone}</span>
                        <div className="flex items-center space-x-1">
                          <a
                            href={`tel:${lead.phone}`}
                            className="p-1 text-slate-400 hover:text-brand-600 transition-colors"
                            title="Call"
                          >
                            <Phone className="w-3 h-3" />
                          </a>
                          <a
                            href={`https://wa.me/${waNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"
                            title="WhatsApp"
                          >
                            <MessageSquare className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                      {lead.email && (
                        <span className="text-[11px] text-slate-400 truncate max-w-[180px]">
                          {lead.email}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Program */}
                  <td className="py-3 px-3">
                    <span className="font-medium text-slate-800 dark:text-slate-200 block truncate max-w-[140px]">
                      {programName}
                    </span>
                  </td>

                  {/* Source */}
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                    <span className="inline-block truncate max-w-[100px]">
                      {lead.source === 'Other' && lead.custom_source
                        ? lead.custom_source
                        : lead.source}
                    </span>
                  </td>

                  {/* Status (Clickable for fast change) */}
                  <td className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => setSelectedLeadForStatus(lead)}
                      className="cursor-pointer hover:opacity-85 transition-opacity"
                      title="Click to update status"
                    >
                      <Badge status={lead.status} size="sm" />
                    </button>
                  </td>

                  {/* Total Amount */}
                  <td className="py-3 px-3 text-right font-medium text-slate-800 dark:text-slate-200">
                    {formatCurrency(lead.total_amount)}
                  </td>

                  {/* Paid Amount */}
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedLeadForPayment(lead)}
                      className="cursor-pointer font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                      title="Click to edit payment"
                    >
                      {formatCurrency(lead.paid_amount)}
                    </button>
                  </td>

                  {/* Pending Amount */}
                  <td className="py-3 px-3 text-right font-semibold">
                    <span
                      className={
                        pending > 0
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-slate-400'
                      }
                    >
                      {formatCurrency(pending)}
                    </span>
                  </td>

                  {/* Follow-up */}
                  <td className="py-3 px-3">
                    {lead.next_followup_date ? (
                      <div className="flex flex-col">
                        <span
                          className={`inline-block text-[11px] px-2 py-0.5 rounded-full border w-fit ${followupTiming.badgeClass}`}
                        >
                          {formatDate(lead.next_followup_date)}
                        </span>
                        {lead.followup_note && (
                          <span className="text-[10px] text-slate-400 truncate max-w-[130px] mt-0.5">
                            {lead.followup_note}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">—</span>
                    )}
                  </td>

                  {/* Updated */}
                  <td className="py-3 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                    {formatRelativeTime(lead.updated_at || lead.created_at)}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center space-x-1">
                      <Link
                        to={`/leads/${lead.id}`}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-brand-400 transition-colors"
                        title="View Full Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <Link
                        to={`/leads/${lead.id}?edit=true`}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
                        title="Edit Lead"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>

                      {lead.is_archived ? (
                        <button
                          onClick={() => restoreLead(lead.id)}
                          className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950/50 transition-colors"
                          title="Restore from Archive"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedLeadForDelete(lead)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                          title="Archive / Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Quick Status Modal */}
      <QuickStatusModal
        isOpen={!!selectedLeadForStatus}
        onClose={() => setSelectedLeadForStatus(null)}
        lead={selectedLeadForStatus}
        onUpdateStatus={async (id, status) => {
          await updateStatus(id, status);
        }}
      />

      {/* Quick Payment Modal */}
      <QuickPaymentModal
        isOpen={!!selectedLeadForPayment}
        onClose={() => setSelectedLeadForPayment(null)}
        lead={selectedLeadForPayment}
        onUpdatePayment={async (id, total, paid, note) => {
          await updatePayment(id, total, paid, note);
        }}
      />

      {/* Delete/Archive Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!selectedLeadForDelete}
        onClose={() => setSelectedLeadForDelete(null)}
        lead={selectedLeadForDelete}
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
