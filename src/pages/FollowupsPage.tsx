import React, { useState } from 'react';
import { useLeads } from '../contexts/LeadsContext';
import { Lead, LeadStatus } from '../types/database';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Textarea } from '../components/common/Textarea';
import {
  formatDate,
  formatRelativeTime,
  getTodayDateString,
  cleanPhoneForWhatsApp,
  getFollowupTiming,
} from '../lib/utils';
import {
  CalendarClock,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Phone,
  MessageSquare,
  Clock,
  ArrowRight,
  User,
  Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FollowupsPage: React.FC = () => {
  const { leads, updateFollowup, updateStatus, stats } = useLeads();
  const todayStr = getTodayDateString();

  const [activeTab, setActiveTab] = useState<'overdue' | 'today' | 'upcoming' | 'all'>('today');
  const [rescheduleLead, setRescheduleLead] = useState<Lead | null>(null);
  const [newDate, setNewDate] = useState<string>('');
  const [newNote, setNewNote] = useState<string>('');
  const [saving, setSaving] = useState(false);

  // Filter leads with followups
  const activeLeadsWithFollowups = leads.filter(
    (l) => !l.is_archived && l.next_followup_date
  );

  const overdueLeads = activeLeadsWithFollowups.filter((l) => {
    const d = l.next_followup_date!.split('T')[0];
    return d < todayStr;
  });

  const todayLeads = activeLeadsWithFollowups.filter((l) => {
    const d = l.next_followup_date!.split('T')[0];
    return d === todayStr;
  });

  const upcomingLeads = activeLeadsWithFollowups.filter((l) => {
    const d = l.next_followup_date!.split('T')[0];
    return d > todayStr;
  });

  const displayList = {
    overdue: overdueLeads,
    today: todayLeads,
    upcoming: upcomingLeads,
    all: activeLeadsWithFollowups,
  }[activeTab];

  const handleOpenReschedule = (lead: Lead) => {
    setRescheduleLead(lead);
    setNewDate(lead.next_followup_date ? lead.next_followup_date.split('T')[0] : getTodayDateString());
    setNewNote(lead.followup_note || '');
  };

  const handleSaveReschedule = async () => {
    if (!rescheduleLead) return;
    setSaving(true);
    try {
      await updateFollowup(rescheduleLead.id, newDate || null, newNote);
      setRescheduleLead(null);
    } finally {
      setSaving(false);
    }
  };

  const handleMarkDone = async (lead: Lead) => {
    await updateFollowup(lead.id, null, 'Follow-up completed');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-amber-500" />
            Admissions Follow-up Command Center
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Never lose track of a candidate enquiry. Prioritize overdue and today's scheduled calls.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/leads/new"
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Lead</span>
          </Link>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('today')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-semibold transition-all ${
            activeTab === 'today'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Today's Follow-ups</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[11px] ${
              activeTab === 'today'
                ? 'bg-white/20 text-white'
                : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
            }`}
          >
            {todayLeads.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('overdue')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-semibold transition-all ${
            activeTab === 'overdue'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Overdue</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[11px] ${
              activeTab === 'overdue'
                ? 'bg-white/20 text-white'
                : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
            }`}
          >
            {overdueLeads.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('upcoming')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-semibold transition-all ${
            activeTab === 'upcoming'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Upcoming</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[11px] ${
              activeTab === 'upcoming'
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {upcomingLeads.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <span>All Scheduled ({activeLeadsWithFollowups.length})</span>
        </button>
      </div>

      {/* Leads List */}
      <div className="space-y-3">
        {displayList.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Follow-ups in this Category
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Great job! All scheduled calls in this section have been attended to or none are pending.
            </p>
          </div>
        ) : (
          displayList.map((lead) => {
            const waNumber = cleanPhoneForWhatsApp(lead.phone);
            const followupTiming = getFollowupTiming(lead.next_followup_date);
            const programName =
              lead.interested_program === 'Custom'
                ? lead.custom_program || 'Custom'
                : lead.interested_program;

            return (
              <div
                key={lead.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-subtle hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                    <Link
                      to={`/leads/${lead.id}`}
                      className="text-base font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                    >
                      {lead.full_name}
                    </Link>
                    <Badge status={lead.status} size="sm" />
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full border ${followupTiming.badgeClass}`}
                    >
                      {formatDate(lead.next_followup_date)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-brand-600 dark:text-brand-400">
                      {programName}
                    </span>
                    <span>•</span>
                    <span>{lead.phone}</span>
                    <span>•</span>
                    <span>Source: {lead.source}</span>
                  </div>

                  {lead.followup_note && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-semibold text-slate-500 dark:text-slate-400 mr-1">
                        Action Plan:
                      </span>
                      {lead.followup_note}
                    </div>
                  )}
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center space-x-2 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  <a
                    href={`tel:${lead.phone}`}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                    title={`Call ${lead.full_name}`}
                  >
                    <Phone className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  </a>

                  <a
                    href={`https://wa.me/${waNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 transition-colors border border-emerald-200 dark:border-emerald-800"
                    title={`WhatsApp ${lead.full_name}`}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenReschedule(lead)}
                  >
                    Reschedule
                  </Button>

                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleMarkDone(lead)}
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Mark Done
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reschedule Modal */}
      <Modal
        isOpen={!!rescheduleLead}
        onClose={() => setRescheduleLead(null)}
        title="Reschedule Next Follow-up"
        description={`Set a new callback reminder for ${rescheduleLead?.full_name}`}
        maxWidth="md"
      >
        <div className="space-y-4">
          <Input
            label="Next Follow-up Date"
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            leftIcon={<Calendar className="w-4 h-4" />}
          />

          <Textarea
            label="Follow-up Action Note"
            placeholder="e.g. Call after 4 PM regarding batch timings and fees."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRescheduleLead(null)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveReschedule}
              isLoading={saving}
            >
              Save Follow-up
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
