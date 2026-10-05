import React from 'react';
import { LeadStatus } from '../../types/database';
import { STATUS_CONFIG } from '../../lib/constants';
import { cn } from '../../lib/utils';

export interface BadgeProps {
  status?: LeadStatus;
  children?: React.ReactNode;
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
  showDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  children,
  variant,
  size = 'md',
  className,
  showDot = true,
}) => {
  if (status && STATUS_CONFIG[status]) {
    const config = STATUS_CONFIG[status];
    return (
      <span
        className={cn(
          'inline-flex items-center font-medium rounded-full border transition-colors',
          size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
          config.bgLight,
          config.textLight,
          config.borderLight,
          config.bgDark,
          config.textDark,
          config.borderDark,
          className
        )}
      >
        {showDot && (
          <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', config.dotColor)} />
        )}
        {children || config.label}
      </span>
    );
  }

  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    outline: 'border border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-300',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    danger: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    info: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        variant ? variantStyles[variant] : variantStyles.default,
        className
      )}
    >
      {children}
    </span>
  );
};
