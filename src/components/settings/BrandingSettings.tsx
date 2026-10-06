import React, { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { Building2, Globe, Mail, Phone, IndianRupee, DollarSign, Check, Save } from 'lucide-react';

const CURRENCY_PRESETS = [
  { label: '₹ INR (Indian Rupee)', symbol: '₹', code: 'INR' },
  { label: '$ USD (US Dollar)', symbol: '$', code: 'USD' },
  { label: '€ EUR (Euro)', symbol: '€', code: 'EUR' },
  { label: '£ GBP (British Pound)', symbol: '£', code: 'GBP' },
  { label: 'AED (UAE Dirham)', symbol: 'AED ', code: 'AED' },
  { label: '$ AUD (Australian Dollar)', symbol: 'A$', code: 'AUD' },
  { label: '$ CAD (Canadian Dollar)', symbol: 'C$', code: 'CAD' },
  { label: '$ SGD (Singapore Dollar)', symbol: 'S$', code: 'SGD' },
];

export const BrandingSettings: React.FC = () => {
  const { settings, updateCompany, formatCurrency } = useSettings();
  const [formData, setFormData] = useState({ ...settings.company });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompany(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCurrencyPresetChange = (selectedCode: string) => {
    const found = CURRENCY_PRESETS.find((p) => p.code === selectedCode);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        currencyCode: found.code,
        currencySymbol: found.symbol,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-5">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            Academy & Organization Identity
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            This name, currency, and branding are displayed throughout the header, sidebar, reports, and exported files.
          </p>
        </div>

        {/* Row 1: Academy Name & Tagline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Organization / Academy Name *"
            placeholder="e.g. EV Cyber Academy"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            leftIcon={<Building2 className="w-4 h-4" />}
          />

          <Input
            label="Tagline / Header Subtitle"
            placeholder="e.g. Lead Command & Admissions Hub"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            leftIcon={<Globe className="w-4 h-4" />}
          />
        </div>

        {/* Row 2: Currency Settings */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Currency & Financial Display
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              Live Preview: {formatCurrency(15000)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Standard Preset"
              options={CURRENCY_PRESETS.map((p) => ({ value: p.code, label: p.label }))}
              value={formData.currencyCode}
              onChange={(e) => handleCurrencyPresetChange(e.target.value)}
            />

            <Input
              label="Custom Currency Symbol"
              placeholder="e.g. ₹ or $"
              value={formData.currencySymbol}
              onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
            />

            <Select
              label="Symbol Position"
              options={[
                { value: 'prefix', label: 'Before Amount (e.g. ₹15,000)' },
                { value: 'suffix', label: 'After Amount (e.g. 15,000 INR)' },
              ]}
              value={formData.currencyPosition}
              onChange={(e) =>
                setFormData({ ...formData, currencyPosition: e.target.value as 'prefix' | 'suffix' })
              }
            />
          </div>
        </div>

        {/* Row 3: Support Contact Information */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Support Email"
            type="email"
            placeholder="admissions@academy.com"
            value={formData.supportEmail}
            onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Contact Helpline Phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={formData.supportPhone}
            onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
            leftIcon={<Phone className="w-4 h-4" />}
          />

          <Input
            label="Website URL"
            type="url"
            placeholder="https://evcyberacademy.com"
            value={formData.websiteUrl}
            onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
            leftIcon={<Globe className="w-4 h-4" />}
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-500">
            {savedSuccess ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Branding saved and updated across entire app!
              </span>
            ) : (
              'Changes take effect instantly on all pages and devices.'
            )}
          </span>

          <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />}>
            Save Branding Settings
          </Button>
        </div>
      </div>
    </form>
  );
};
