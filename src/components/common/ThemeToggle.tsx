import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={cn(
        'relative p-2 rounded-lg transition-colors border text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200',
        'dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-800 dark:border-slate-700',
        'focus:outline-none focus:ring-2 focus:ring-brand-500/20',
        className
      )}
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 scale-100" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700 transition-transform rotate-0 scale-100" />
      )}
    </button>
  );
};
