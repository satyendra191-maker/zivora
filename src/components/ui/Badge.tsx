'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'brand' | 'outline' | 'subtle';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  dot?: boolean;
  icon?: ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  'aria-label'?: string;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      variant = 'default',
      size = 'md',
      dot = false,
      icon,
      removable = false,
      onRemove,
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: 'bg-surface-200 text-fg-secondary border-border-subtle',
      success: 'bg-success-surface text-success-dark border-success-default/20',
      warning: 'bg-warning-surface text-warning-dark border-warning-default/20',
      error: 'bg-error-surface text-error-dark border-error-default/20',
      info: 'bg-info-surface text-info-dark border-info-default/20',
      brand: 'bg-brand-purple-light text-brand-purple border-brand-purple/20',
      outline: 'bg-transparent text-fg-secondary border-border-default',
      subtle: 'bg-surface-100 text-fg-tertiary border-transparent',
    };

    const sizes = {
      xs: 'px-2 py-0.5 text-xs gap-1',
      sm: 'px-2.5 py-1 text-xs gap-1',
      md: 'px-3 py-1 text-sm gap-1.5',
      lg: 'px-3.5 py-1.5 text-base gap-2',
    };

    const dotColors = {
      default: 'bg-fg-tertiary',
      success: 'bg-success-default',
      warning: 'bg-warning-default',
      error: 'bg-error-default',
      info: 'bg-info-default',
      brand: 'bg-brand-purple',
      outline: 'bg-fg-tertiary',
      subtle: 'bg-fg-quaternary',
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && onRemove) {
        e.preventDefault();
        onRemove();
      }
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-semibold rounded-full border transition-colors duration-fast',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColors[variant])} aria-hidden="true" />}
        {icon && <span className="flex-shrink-0" aria-hidden="true">{icon}</span>}
        <span>{children}</span>
        {removable && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            onKeyDown={handleKeyDown}
            className={cn(
              'ml-1 flex items-center justify-center rounded-full transition-colors',
              'hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-brand-purple/20',
              size === 'xs' && 'w-4 h-4',
              size === 'sm' && 'w-5 h-5',
              size === 'md' && 'w-5 h-5',
              size === 'lg' && 'w-6 h-6'
            )}
            aria-label={ariaLabel || `Remove ${children}`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'brand' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  icon?: ReactNode;
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ variant = 'default', size = 'md', icon, className, children, ...props }, ref) => {
    const variants = {
      default: 'bg-surface-200 text-fg-secondary',
      brand: 'bg-brand-purple/10 text-brand-purple',
      success: 'bg-success-surface text-success-dark',
      warning: 'bg-warning-surface text-warning-dark',
      error: 'bg-error-surface text-error-dark',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 font-medium rounded-lg',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {icon && <span aria-hidden="true">{icon}</span>}
        {children}
      </span>
    );
  }
);

Tag.displayName = 'Tag';

export interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'brand' | 'success' | 'warning' | 'error' | 'outline';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Pill = forwardRef<HTMLSpanElement, PillProps>(
  ({ variant = 'default', icon, iconPosition = 'left', className, children, ...props }, ref) => {
    const variants = {
      default: 'bg-surface-200 text-fg-secondary',
      brand: 'bg-brand-purple text-white',
      success: 'bg-success-surface text-success-dark',
      warning: 'bg-warning-surface text-warning-dark',
      error: 'bg-error-surface text-error-dark',
      outline: 'bg-transparent text-fg-secondary border border-border-default',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full',
          variants[variant],
          className
        )}
        {...props}
      >
        {icon && iconPosition === 'left' && <span aria-hidden="true">{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && <span aria-hidden="true">{icon}</span>}
      </span>
    );
  }
);

Pill.displayName = 'Pill';