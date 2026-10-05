import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../contexts/LeadsContext';
import { LeadForm } from '../components/leads/LeadForm';
import { LeadFormData } from '../types/database';
import { ArrowLeft, UserPlus, Sparkles } from 'lucide-react';
import { Button } from '../components/common/Button';

export const AddLeadPage: React.FC = () => {
  const navigate = useNavigate();
  const { createLead } = useLeads();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: LeadFormData) => {
    setLoading(true);
    try {
      const res = await createLead(formData);
      if (res.error) {
        throw new Error(res.error);
      }
      if (res.lead?.id) {
        navigate(`/leads/${res.lead.id}`);
      } else {
        navigate('/leads');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button and page title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              Add New Enquiry / Candidate
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Enter applicant details, select program, plan follow-ups, and log initial payments
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <LeadForm
        onSubmit={handleSubmit}
        isLoading={loading}
        onCancel={() => navigate('/leads')}
        buttonText="Create & Save Lead"
      />
    </div>
  );
};
