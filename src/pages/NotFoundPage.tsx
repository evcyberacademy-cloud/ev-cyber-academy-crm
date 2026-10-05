import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-card space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">404</h1>
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">
          Page Not Found
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          The requested route does not exist in EV Cyber Academy Lead Management System.
        </p>
        <div className="pt-2 flex justify-center">
          <Link to="/dashboard">
            <Button variant="primary" size="sm" leftIcon={<Home className="w-4 h-4" />}>
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
