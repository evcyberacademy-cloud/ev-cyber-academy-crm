import React, { useState } from 'react';
import { isSupabaseConfigured, supabaseUrl } from '../../lib/supabase';
import { ShieldCheck, Copy, Check, ExternalLink, Terminal, Sparkles, Key, AlertTriangle } from 'lucide-react';
import { Button } from '../common/Button';

export const ConnectionGuide: React.FC = () => {
  const isConfigured = isSupabaseConfigured();
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const envSample = `VITE_SUPABASE_URL=https://your-project-id.supabase.co\nVITE_SUPABASE_ANON_KEY=eyJhbGciOi...your_anon_key`;

  const copyToClipboard = (text: string, type: 'sql' | 'env') => {
    navigator.clipboard.writeText(text);
    if (type === 'sql') {
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    } else {
      setCopiedEnv(true);
      setTimeout(() => setCopiedEnv(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Connection Status Box */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-subtle">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isConfigured
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                  : 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
              }`}
            >
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Supabase Free Tier Connection
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isConfigured ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Connected to {supabaseUrl}
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Offline Preview Mode (Sample Data & Local Storage)
                  </span>
                )}
              </p>
            </div>
          </div>

          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            <span>Supabase Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* ₹0 Zero-Cost Architecture Card */}
      <div className="bg-gradient-to-br from-brand-950 via-slate-900 to-indigo-950 text-white rounded-xl p-6 border border-brand-800/40 shadow-card">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              100% Free Tier Compliant — ₹0 Database Cost Architecture
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              This application is engineered specifically to operate forever within the <strong>Supabase Free Tier</strong> (500 MB PostgreSQL, 50,000 monthly active users, 200 concurrent Realtime connections, 2 GB file storage) and <strong>Vercel Free Tier</strong> at <strong>₹0/month</strong>.
            </p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                <span className="text-slate-400 block font-medium">Database</span>
                <span className="font-bold text-emerald-400">Supabase Free Plan</span>
              </div>
              <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                <span className="text-slate-400 block font-medium">Hosting</span>
                <span className="font-bold text-emerald-400">Vercel Hobby Plan (₹0)</span>
              </div>
              <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                <span className="text-slate-400 block font-medium">Realtime Live Sync</span>
                <span className="font-bold text-emerald-400">Included Free</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Setup Instructions */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-5">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Supabase Setup Checklist (5 Minutes)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Follow these simple steps in your free Supabase account:
          </p>
        </div>

        <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
          {/* Step 1 */}
          <div className="flex items-start space-x-3">
            <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 font-bold flex items-center justify-center flex-shrink-0 text-xs">
              1
            </span>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                Create Free Supabase Project
              </p>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-brand-600 dark:text-brand-400 underline">supabase.com</a>, sign in with GitHub, and click <strong>New Project</strong>. Choose the <strong>Free Plan</strong> and a region close to your team (e.g. <em>Mumbai / ap-south-1</em>).
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start space-x-3">
            <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 font-bold flex items-center justify-center flex-shrink-0 text-xs">
              2
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-900 dark:text-white">
                  Execute SQL Schema in SQL Editor
                </p>
                <a
                  href="/schema.sql"
                  target="_blank"
                  className="text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                >
                  View schema.sql
                </a>
              </div>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Open Supabase Dashboard → <strong>SQL Editor</strong> → click <strong>New Query</strong>, paste the content of <code className="text-slate-800 dark:text-slate-200">schema.sql</code>, and click <strong>Run</strong>.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start space-x-3">
            <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 font-bold flex items-center justify-center flex-shrink-0 text-xs">
              3
            </span>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                Create Staff User in Authentication
              </p>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                In Supabase Dashboard → <strong>Authentication</strong> → <strong>Users</strong> → click <strong>Add User</strong>. Enter your staff email & password to enable CRM login.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start space-x-3">
            <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 font-bold flex items-center justify-center flex-shrink-0 text-xs">
              4
            </span>
            <div className="flex-1">
              <p className="font-semibold text-slate-900 dark:text-white">
                Configure Environment Variables
              </p>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Copy your <strong>Project URL</strong> and <strong>anon public key</strong> from <strong>Project Settings → API</strong> into your local <code className="text-slate-800 dark:text-slate-200">.env</code> or Vercel Environment Variables.
              </p>

              <div className="mt-2 relative rounded-lg bg-slate-900 p-3 text-slate-200 font-mono text-[11px] overflow-x-auto">
                <button
                  onClick={() => copyToClipboard(envSample, 'env')}
                  className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                >
                  {copiedEnv ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedEnv ? 'Copied' : 'Copy'}</span>
                </button>
                <pre>{envSample}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
