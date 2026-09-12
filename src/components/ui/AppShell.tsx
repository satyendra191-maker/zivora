'use client';

import { type ReactNode, useState, createContext, useContext, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button, IconButton } from './Button';
import { Avatar } from './Avatar';
import { Badge } from './Badge';

interface SidebarContextValue {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
}

export interface SidebarProviderProps {
  children: ReactNode;
  defaultOpen?: boolean;
}

export function SidebarProvider({ children, defaultOpen = true }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  );
}

export interface AppShellProps {
  children: ReactNode;
  sidebar: ReactNode;
  topbar?: ReactNode;
  className?: string;
}

export function AppShell({ children, sidebar, topbar, className }: AppShellProps) {
  const { isOpen, close } = useSidebar();

  return (
    <div className={cn('min-h-screen bg-bg-primary flex', className)}>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-[var(--z-fixed)] w-64 bg-white border-r border-border-subtle',
          'transform transition-transform duration-base lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Main navigation"
      >
        {sidebar}
      </aside>

      {isOpen && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 z-[var(--z-modal-backdrop)] bg-overlay-backdrop backdrop-blur-sm lg:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {topbar && (
          <header className="sticky top-0 z-[var(--z-sticky)] bg-white/80 backdrop-blur-md border-b border-border-subtle">
            {topbar}
          </header>
        )}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export interface SidebarProps {
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}

export function Sidebar({ children, className, footer }: SidebarProps) {
  return (
    <div className={cn('flex flex-col h-full overflow-y-auto', className)}>
      <div className="p-5 space-y-6">{children}</div>
      {footer && <div className="mt-auto p-5 border-t border-border-subtle">{footer}</div>}
    </div>
  );
}

export interface SidebarSectionProps {
  label?: string;
  children: ReactNode;
  className?: string;
}

export function SidebarSection({ label, children, className }: SidebarSectionProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <h3 className="px-3 text-xs font-bold text-fg-tertiary uppercase tracking-widest mb-2">
          {label}
        </h3>
      )}
      <nav className="space-y-1" aria-label={label}>{children}</nav>
    </div>
  );
}

export interface SidebarItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: ReactNode;
  badge?: string | number;
  badgeVariant?: 'default' | 'success' | 'warning' | 'error';
  active?: boolean;
  disabled?: boolean;
  className?: string;
}

export function SidebarItem({
  icon,
  badge,
  badgeVariant = 'default',
  active = false,
  disabled = false,
  className,
  children,
  onClick,
  ...props
}: SidebarItemProps) {
  const { close } = useSidebar();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    close();
    onClick?.(e);
  };

  return (
    <a
      {...props}
      onClick={handleClick}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-fast',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/20',
        active
          ? 'bg-brand-purple/10 text-brand-purple'
          : 'text-fg-secondary hover:text-fg-primary hover:bg-surface-100',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      aria-current={active ? 'page' : undefined}
      aria-disabled={disabled}
    >
      {icon && <span className="flex-shrink-0 w-5 h-5" aria-hidden="true">{icon}</span>}
      <span className="truncate flex-1">{children}</span>
      {badge && (
        <Badge variant={badgeVariant} size="xs">
          {badge}
        </Badge>
      )}
    </a>
  );
}

export interface SidebarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  badge?: string | number;
  badgeVariant?: 'default' | 'success' | 'warning' | 'error';
  active?: boolean;
  className?: string;
}

export function SidebarButton({
  icon,
  badge,
  badgeVariant = 'default',
  active = false,
  className,
  children,
  onClick,
  ...props
}: SidebarButtonProps) {
  const { close } = useSidebar();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    close();
    onClick?.(e);
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all duration-fast',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/20',
        active
          ? 'bg-brand-purple/10 text-brand-purple'
          : 'text-fg-secondary hover:text-fg-primary hover:bg-surface-100',
        className
      )}
      aria-current={active ? 'page' : undefined}
    >
      {icon && <span className="flex-shrink-0 w-5 h-5" aria-hidden="true">{icon}</span>}
      <span className="truncate flex-1">{children}</span>
      {badge && (
        <Badge variant={badgeVariant} size="xs">
          {badge}
        </Badge>
      )}
    </button>
  );
}

export interface TopbarProps {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  className?: string;
}

export function Topbar({ left, center, right, className }: TopbarProps) {
  return (
    <div className={cn('flex items-center justify-between h-16 px-5 gap-4', className)}>
      <div className="flex items-center gap-3 min-w-0">{left}</div>
      <div className="flex items-center justify-center gap-4 flex-1">{center}</div>
      <div className="flex items-center gap-2 min-w-0 justify-end">{right}</div>
    </div>
  );
}

export interface TopbarSearchProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  className?: string;
}

export function TopbarSearch({ placeholder = 'Search...', value, onChange, onSubmit, className }: TopbarSearchProps) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit?.(value); }} className={cn('relative w-full max-w-md', className)}>
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-fg-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="8" strokeWidth={1.5} />
        <path d="M21 21l-4.35-4.35" strokeWidth={1.5} strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 bg-surface-100 border border-transparent rounded-lg text-sm text-fg-primary placeholder:text-fg-tertiary focus:bg-white focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/20 transition-all"
        aria-label={placeholder}
      />
    </form>
  );
}

export interface UserMenuProps {
  name: string;
  email?: string;
  avatar?: string;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onSignOut?: () => void;
  className?: string;
}

export function UserMenu({ name, email, avatar, onProfileClick, onSettingsClick, onSignOut, className }: UserMenuProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!e.composedPath().includes(document.activeElement as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1 rounded-lg hover:bg-surface-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/20"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <Avatar src={avatar} name={name} size="md" />
        <span className="hidden sm:block text-sm font-medium text-fg-primary truncate max-w-[120px]">{name}</span>
        <svg className="w-4 h-4 text-fg-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-[var(--z-popover)]" onClick={() => setOpen(false)} aria-hidden="true" />
        , document.body)
      }

      {open && createPortal(
        <div className="fixed right-5 top-full mt-2 z-[var(--z-popover)] w-56 bg-white rounded-xl border border-border-subtle shadow-card-hover animate-in fade-in zoom-in-95 duration-fast">
          <div className="p-3 border-b border-border-subtle">
            <p className="text-sm font-semibold text-fg-primary truncate">{name}</p>
            {email && <p className="text-xs text-fg-tertiary truncate">{email}</p>}
          </div>
          <nav className="py-1" role="menu">
            <button
              onClick={() => { onProfileClick?.(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-fg-secondary hover:text-fg-primary hover:bg-surface-100 rounded-lg transition-colors"
              role="menuitem"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 007-7z" />
              </svg>
              Profile
            </button>
            <button
              onClick={() => { onSettingsClick?.(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-fg-secondary hover:text-fg-primary hover:bg-surface-100 rounded-lg transition-colors"
              role="menuitem"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
            <hr className="my-1 border-border-subtle" />
            <button
              onClick={() => { onSignOut?.(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-error-default hover:bg-error-surface rounded-lg transition-colors"
              role="menuitem"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </nav>
        </div>
        , document.body)
      }
    </div>
  );
}

import { createPortal } from 'react-dom';