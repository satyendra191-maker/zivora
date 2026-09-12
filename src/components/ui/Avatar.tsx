'use client';

import { forwardRef, type HTMLAttributes, type ReactNode, useMemo } from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  shape?: 'circle' | 'square' | 'rounded';
  status?: 'online' | 'offline' | 'busy' | 'away';
  statusPosition?: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left';
  fallback?: ReactNode;
}

const sizeMap = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-9 h-9 text-base',
  lg: 'w-10 h-10 text-base',
  xl: 'w-11 h-11 text-lg',
  '2xl': 'w-14 h-14 text-xl',
  '3xl': 'w-18 h-18 text-2xl',
  '4xl': 'w-24 h-24 text-3xl',
};

const statusSizeMap = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
  xl: 'w-2.5 h-2.5',
  '2xl': 'w-3 h-3',
  '3xl': 'w-4 h-4',
  '4xl': 'w-5 h-5',
};

const statusColors = {
  online: 'bg-success-default',
  offline: 'bg-fg-quaternary',
  busy: 'bg-error-default',
  away: 'bg-warning-default',
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      name,
      size = 'md',
      shape = 'circle',
      status,
      statusPosition = 'bottom-right',
      fallback,
      className,
      ...props
    },
    ref
  ) => {
    const initials = useMemo(() => {
      if (!name) return '?';
      return name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    }, [name]);

    const shapeClasses = {
      circle: 'rounded-full',
      square: 'rounded-lg',
      rounded: 'rounded-xl',
    };

    const positionClasses = {
      'bottom-right': 'bottom-0 right-0',
      'top-right': 'top-0 right-0',
      'bottom-left': 'bottom-0 left-0',
      'top-left': 'top-0 left-0',
    };

    const statusIndicator = status ? (
      <span
        className={cn(
          'absolute rounded-full border-2 border-white',
          statusSizeMap[size],
          statusColors[status],
          positionClasses[statusPosition]
        )}
        aria-label={`${status} status`}
      />
    ) : null;

    const content = src ? (
      <img
        src={src}
        alt={alt || name || 'Avatar'}
        className={cn('w-full h-full object-cover', shapeClasses[shape])}
        loading="lazy"
        decoding="async"
      />
    ) : fallback ? (
      <div className={cn('w-full h-full flex items-center justify-center bg-surface-200', shapeClasses[shape])}>
        {fallback}
      </div>
    ) : name ? (
      <div
        className={cn(
          'w-full h-full flex items-center justify-center bg-brand-purple/10 text-brand-purple font-semibold',
          shapeClasses[shape],
          sizeMap[size]
        )}
        aria-label={name}
      >
        {initials}
      </div>
    ) : (
      <div
        className={cn('w-full h-full flex items-center justify-center bg-surface-200', shapeClasses[shape])}
        aria-hidden="true"
      >
        <svg className="w-1/2 h-1/2 text-fg-quaternary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
    );

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex shrink-0 overflow-hidden', sizeMap[size], className)}
        {...props}
      >
        {content}
        {statusIndicator}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export interface AvatarStackProps extends HTMLAttributes<HTMLDivElement> {
  avatars: Array<{ src?: string; name: string; alt?: string }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  spacing?: number;
}

export const AvatarStack = forwardRef<HTMLDivElement, AvatarStackProps>(
  ({ avatars, max = 4, size = 'sm', spacing = -8, className, ...props }, ref) => {
    const visibleAvatars = avatars.slice(0, max);
    const remainingCount = avatars.length - max;

    return (
      <div ref={ref} className={cn('flex items-center', className)} {...props}>
        {visibleAvatars.map((avatar, index) => (
          <Avatar
            key={avatar.name}
            src={avatar.src}
            name={avatar.name}
            alt={avatar.alt}
            size={size}
            className={cn(index > 0 && `-ml-${Math.abs(spacing) / 4}`)}
          />
        ))}
        {remainingCount > 0 && (
          <Avatar
            name={`+${remainingCount}`}
            size={size}
            className={cn('-ml-${Math.abs(spacing) / 4}', 'bg-surface-200 text-fg-secondary')}
          />
        )}
      </div>
    );
  }
);

AvatarStack.displayName = 'AvatarStack';