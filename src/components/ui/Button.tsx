'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      disabled,
      className,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-ui font-semibold transition-all duration-base
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-[0.98]
      select-none
    `;

    const variants = {
      primary: `
        bg-brand-purple text-white border border-brand-purple
        hover:bg-brand-purple-dark hover:border-brand-purple-dark
        focus-visible:ring-brand-purple/20
        shadow-sm
      `,
      secondary: `
        bg-surface-100 text-brand-purple border border-border-default
        hover:bg-surface-200 hover:border-border-strong
        focus-visible:ring-brand-purple/20
      `,
      ghost: `
        bg-transparent text-brand-purple border border-transparent
        hover:bg-brand-purple/10
        focus-visible:ring-brand-purple/20
      `,
      danger: `
        bg-error-default text-white border border-error-default
        hover:bg-error-dark hover:border-error-dark
        focus-visible:ring-error-default/20
      `,
      outline: `
        bg-transparent text-fg-primary border border-border-default
        hover:bg-surface-100 hover:border-border-strong
        focus-visible:ring-brand-purple/20
      `,
    };

    const sizes = {
      xs: 'px-2.5 py-1.5 text-xs gap-1 min-h-[28px]',
      sm: 'px-3 py-2 text-sm gap-1.5 min-h-[32px]',
      md: 'px-4 py-2.5 text-base gap-2 min-h-[36px]',
      lg: 'px-5 py-3 text-lg gap-2 min-h-[40px]',
      xl: 'px-6 py-3.5 text-xl gap-2.5 min-h-[44px]',
    };

    const width = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(baseStyles, variants[variant], sizes[size], width, className)}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : icon && iconPosition === 'left' ? (
          <span className="flex-shrink-0" aria-hidden="true">{icon}</span>
        ) : null}
        <span>{children}</span>
        {icon && iconPosition === 'right' && (
          <span className="flex-shrink-0" aria-hidden="true">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'subtle' | 'ghost';
  'aria-label': string;
  children: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, size = 'md', variant = 'default', className, 'aria-label': ariaLabel, ...props }, ref) => {
    const sizes = {
      xs: 'w-8 h-8',
      sm: 'w-9 h-9',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
    };

    const variants = {
      default: 'bg-surface-100 text-fg-secondary hover:bg-surface-200',
      subtle: 'bg-transparent text-fg-tertiary hover:bg-surface-100',
      ghost: 'bg-transparent text-fg-tertiary hover:text-fg-primary',
    };

    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        className={cn(
          'inline-flex items-center justify-center rounded-full transition-all duration-base',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/20',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          sizes[size],
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';