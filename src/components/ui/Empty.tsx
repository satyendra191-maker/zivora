'use client';

import { type ReactNode, forwardRef, type HTMLAttributes, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  variant?: 'default' | 'illustrated' | 'minimal';
  className?: string;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, variant = 'default', className, children, ...props }, ref) => {
    const variants = {
      default: 'py-12 px-6 text-center',
      illustrated: 'py-16 px-6 text-center',
      minimal: 'py-8 px-4 text-center',
    };

    const iconWrapper = icon ? (
      <div className={cn('mb-4 inline-flex items-center justify-center', variant === 'illustrated' && 'w-20 h-20 rounded-2xl bg-surface-100')}>
        {icon}
      </div>
    ) : null;

    return (
      <div
        ref={ref}
        className={cn('w-full', variants[variant], className)}
        {...props}
      >
        {iconWrapper}
        <h3 className="text-lg font-bold text-fg-primary">{title}</h3>
        {description && <p className="mt-1.5 text-sm text-fg-secondary max-w-sm mx-auto">{description}</p>}
        {action && <div className="mt-5">{action}</div>}
        {children && <div className="mt-4">{children}</div>}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

interface SpinnerProps {
  size: 'sm' | 'md' | 'lg';
}

function Spinner({ size }: SpinnerProps) {
  const sizeClasses = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <svg
      className={cn('animate-spin text-brand-purple', sizeClasses[size])}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

interface DotsProps {
  size: 'sm' | 'md' | 'lg';
}

function Dots({ size }: DotsProps) {
  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };
  return (
    <div className="flex items-center gap-1" aria-hidden="true">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn('rounded-full bg-brand-purple animate-bounce', sizeClasses[size])}
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

interface PulseProps {
  size: 'sm' | 'md' | 'lg';
}

function Pulse({ size }: PulseProps) {
  const sizeClasses = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div
      className={cn('animate-pulse rounded-full bg-brand-purple/20', sizeClasses[size])}
      aria-hidden="true"
    />
  );
}

export interface LoadingStateProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'spinner' | 'skeleton' | 'dots' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingState = forwardRef<HTMLDivElement, LoadingStateProps>(
  ({ variant = 'spinner', size = 'md', text, className, ...props }, ref) => {
    const textClasses = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };

    const content = useMemo(() => {
      switch (variant) {
        case 'spinner': return <Spinner size={size} />;
        case 'dots': return <Dots size={size} />;
        case 'pulse': return <Pulse size={size} />;
        default: return <Spinner size={size} />;
      }
    }, [variant, size]);

    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center justify-center gap-3', className)}
        {...props}
      >
        {content}
        {text && <p className={cn('text-fg-secondary', textClasses[size])}>{text}</p>}
      </div>
    );
  }
);

LoadingState.displayName = 'LoadingState';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'avatar' | 'card';
  width?: string | number;
  height?: string | number;
  lines?: number;
  className?: string;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = 'text', width, height, lines = 1, className, ...props }, ref) => {
    const baseStyle = 'animate-pulse bg-surface-200 rounded';

    const variants = {
      text: 'h-4 w-full',
      circular: 'rounded-full',
      rectangular: 'rounded-lg',
      avatar: 'rounded-full',
      card: 'rounded-xl',
    };

    if (variant === 'text' && lines > 1) {
      return (
        <div ref={ref} className={cn('space-y-2', className)} {...props}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(baseStyle, variants.text, i === lines - 1 && 'w-3/4')}
              style={{ width: typeof width === 'number' ? `${width}px` : width }}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(baseStyle, variants[variant], className)}
        style={{
          width: typeof width === 'number' ? `${width}px` : width || (variant === 'circular' || variant === 'avatar' ? height : undefined),
          height: typeof height === 'number' ? `${height}px` : height,
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export function SkeletonCard({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-3 p-5 bg-white rounded-2xl border border-border-subtle', className)}>
      <div className="flex items-center gap-3">
        <Skeleton variant="avatar" width={40} height={40} />
        <div className="flex-1 space-y-1">
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="30%" />
        </div>
      </div>
      <Skeleton variant="rectangular" height={160} />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} variant="text" width={i === lines - 1 ? '60%' : '100%'} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}