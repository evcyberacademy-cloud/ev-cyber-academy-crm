import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useLeads } from '../contexts/LeadsContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { LeadForm } from '../components/leads/LeadForm';
import { QuickStatusModal } from '../components/leads/QuickStatusModal';
import { QuickPaymentModal } from '../components/leads/QuickPaymentModal';
import { DeleteConfirmModal } from '../components/leads/DeleteConfirmModal';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  calculatePending,
  cleanPhoneForWhatsApp,
  getFollowupTiming,
} from '../lib/utils';
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  Mail,
  Edit2,
  Trash2,
  Calendar,
  IndianRupee,
  Clock,
  BookOpen,
  Globe,
  FileText,
  CheckCircle2,
  AlertCircle,
  Archive,
  RefreshCw,
  User,
} from 'lucide-react';
import { LeadFormData } from '../types/database';
import { useSettings } from '../contexts/SettingsContext';

export const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    getLeadById,
    updateLead,
    updateStatus,
    updatePayment,
    archiveLead,
    restoreLead,
    deleteLeadPermanently,
    loading: leadsLoading,
  } = useLeads();
  const { formatCurrency, settings } = useSettings();

  const isEditMode = searchParams.get('edit') === 'true';

  const lead = id ? getLeadById(id) : undefined;

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  if (leadsLoading) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-600 mx-auto mb-2" />
        <p className="text-xs text-slate-400">Loading candidate profile...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-500 mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Lead Not Found
        </h2>
        <p className="text-xs text-slate-500">
          The requested lead ID does not exist or has been permanently removed.
        </p>
        <Button variant="primary" size="sm" onClick={() => navigate('/leads')}>
          Return to Leads
        </Button>
      </div>
    );
  }

  const pending = calculatePending(lead.total_amount, lead.paid_amount);
  const waNumber = cleanPhoneForWhatsApp(lead.phone);
  const programName =
    lead.interested_program === 'Custom'
      ? lead.custom_program || 'Custom Program'
      : lead.interested_program;
  const followupTiming = getFollowupTiming(lead.next_followup_date);

  const handleFormSubmit = async (formData: LeadFormData) => {
    if (!lead) return;
    setSaving(true);
    try {
      const res = await updateLead(lead.id, {
        full_name: formData.full_name,
        phone: formData.phone,
        email: formData.email || null,
        interested_program: formData.interested_program,
        custom_program: formData.custom_program || null,
        status: formData.status,
        source: formData.source,
        custom_source: formData.custom_source || null,
        notes: formData.notes || null,
        next_followup_date: formData.next_followup_date || null,
        followup_note: formData.followup_note || null,
        total_amount: Number(formData.total_amount) || 0,
        paid_amount: Number(formData.paid_amount) || 0,
        payment_note: formData.payment_note || null,
      });

      if (res.error) throw new Error(res.error);
      setSearchParams({}); // exit edit mode
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Navigation & Status bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/leads')}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Back to leads list"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {lead.full_name}
              </h1>
              <button
                onClick={() => setStatusModalOpen(true)}
                className="cursor-pointer"
                title="Change status"
              >
                <Badge status={lead.status} />
              </button>
              {lead.is_archived && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 font-semibold border border-purple-300 dark:border-purple-800">
                  Archived
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Enquired {formatRelativeTime(lead.created_at)} • ID: {lead.id}
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          {/* Quick Communication Actions */}
          <a
            href={`tel:${lead.phone}`}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 shadow-xs transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Call</span>
          </a>

          <a
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 shadow-xs transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>WhatsApp</span>
          </a>

          {lead.email && (
            <a
              href={`mailto:${lead.email}`}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 shadow-xs transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>
          )}

          {/* Edit toggle */}
          <Button
            variant={isEditMode ? 'outline' : 'primary'}
            size="sm"
            onClick={() => setSearchParams(isEditMode ? {} : { edit: 'true' })}
            leftIcon={<Edit2 className="w-3.5 h-3.5" />}
          >
            {isEditMode ? 'Cancel Edit' : 'Edit Lead'}
          </Button>

          {/* Archive / Delete */}
          {lead.is_archived ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => restoreLead(lead.id)}
              leftIcon={<Archive className="w-3.5 h-3.5" />}
              className="text-purple-600 border-purple-300 dark:text-purple-400 dark:border-purple-800"
            >
              Restore Lead
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalOpen(true)}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              className="text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 border-slate-200 dark:border-slate-800"
            >
              Delete / Archive
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {isEditMode ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-subtle">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-brand-600" />
              Editing Candidate Information
            </h3>
            <button
              onClick={() => setSearchParams({})}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Close Editor
            </button>
          </div>

          <LeadForm
            initialData={lead}
            onSubmit={handleFormSubmit}
            isLoading={saving}
            onCancel={() => setSearchParams({})}
            buttonText="Save All Changes"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 spans): Contact, Program & Notes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Primary Details Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Lead Profile & Academic Interest
                  </h3>
                </div>
                <button
                  onClick={() => setSearchParams({ edit: 'true' })}
                  className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Phone Number</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-sm">
                    {lead.phone}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Email Address</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-sm">
                    {lead.email || 'Not provided'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Interested Program</span>
                  <span className="font-bold text-brand-600 dark:text-brand-400 text-sm">
                    {programName}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Lead Source</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-sm">
                    {lead.source === 'Other' && lead.custom_source
                      ? `${lead.source} (${lead.custom_source})`
                      : lead.source}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-3">
              <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Discussion Log & Notes
                </h3>
              </div>

              {lead.notes ? (
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  {lead.notes}
                </p>
              ) : (
                <p className="text-xs text-slate-400 italic py-2">
                  No background notes added yet. Click "Edit Lead" to add remarks.
                </p>
              )}
            </div>

            {/* Timestamps & Activity Card (Requirement #21) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-subtle">
              <div className="flex items-center space-x-2 mb-3">
                <Clock className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Record Audit Timestamps
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/40">
                  <span className="text-slate-400 block font-medium">Created On</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatDateTime(lead.created_at)}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/40">
                  <span className="text-slate-400 block font-medium">Last Modified</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatDateTime(lead.updated_at || lead.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (1 span): Follow-up & Payment Ledger */}
          <div className="space-y-6">
            {/* Follow-up Section Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Follow-up Schedule
                  </h3>
                </div>
                <button
                  onClick={() => setSearchParams({ edit: 'true' })}
                  className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                >
                  Schedule
                </button>
              </div>

              {lead.next_followup_date ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Status:</span>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full border ${followupTiming.badgeClass}`}
                    >
                      {formatDate(lead.next_followup_date)}
                    </span>
                  </div>

                  {lead.followup_note && (
                    <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200">
                      <span className="font-bold block mb-0.5">Action Plan:</span>
                      {lead.followup_note}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 text-center rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                  No next follow-up date scheduled.
                </div>
              )}
            </div>

            {/* Payment Ledger Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <IndianRupee className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Fee & Payment Ledger
                  </h3>
                </div>
                <button
                  onClick={() => setPaymentModalOpen(true)}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Record Fee
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Total Course Fee:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatCurrency(lead.total_amount)}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Paid Amount:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(lead.paid_amount)}
                  </span>
                </div>

                <div className="flex justify-between py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Pending Balance:</span>
                  <span
                    className={
                      pending > 0
                        ? 'text-amber-600 dark:text-amber-400 text-sm'
                        : 'text-emerald-600 dark:text-emerald-400 text-sm'
                    }
                  >
                    {formatCurrency(pending)}
                  </span>
                </div>

                {lead.payment_note && (
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/40 text-[11px] text-slate-600 dark:text-slate-300">
                    <span className="font-semibold block text-slate-400 mb-0.5">Payment Remarks:</span>
                    {lead.payment_note}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
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
        onClose={() => {
          setDeleteModalOpen(false);
        }}
        lead={lead}
        onArchive={async (id) => {
          await archiveLead(id);
          navigate('/leads');
        }}
        onPermanentDelete={async (id) => {
          await deleteLeadPermanently(id);
          navigate('/leads');
        }}
      />
    </div>
  );
};
