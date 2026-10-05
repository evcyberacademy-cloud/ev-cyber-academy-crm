import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../contexts/LeadsContext';
import { LeadForm } from '../components/leads/LeadForm';
import { LeadFormData } from '../types/database';
import { ArrowLeft, UserPlus, Zap } from 'lucide-react';

export const AddLeadPage: React.FC = () => {
  const navigate = useNavigate();
  const { createLead } = useLeads();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: LeadFormData) => {
    setLoading(true);
    try {
      const res = await createLead(formData);
      if (res.error) {
        alert('Error saving lead: ' + res.error);
        return;
      }
      // Redirect to leads list directly for fast workflow
      navigate('/leads');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Back button and page title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              Quick Add Lead
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Enter basic details and save directly to cloud database
            </p>
          </div>
        </div>
      </div>

      {/* Lightweight Form */}
      <LeadForm
        onSubmit={handleSubmit}
        isLoading={loading}
        onCancel={() => navigate('/leads')}
        buttonText="Save & Create Lead"
      />
    </div>
  );
};
