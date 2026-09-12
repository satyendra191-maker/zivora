'use client';

import { 
  forwardRef, 
  type HTMLAttributes, 
  type ReactNode, 
  useState, 
  useRef, 
  useEffect, 
  createContext, 
  useContext 
} from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  variant?: 'line' | 'enclosed' | 'soft' | 'pills';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  children: ReactNode;
}

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  'aria-label'?: string;
}

export interface TabTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
  icon?: ReactNode;
  badge?: string | number;
}

export interface TabContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
}

type TabsVariant = 'line' | 'enclosed' | 'soft' | 'pills';

const TabsContext = createContext<{
  value: string;
  onChange: (value: string) => void;
  variant: TabsVariant;
  orientation: string;
} | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab components must be used within Tabs');
  }
  return context;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ defaultValue, value, onChange, variant = 'line', orientation = 'horizontal', className, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState(defaultValue || '');
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    const handleChange = (newValue: string) => {
      if (!isControlled) setInternalValue(newValue);
      onChange?.(newValue);
    };

    return (
      <TabsContext.Provider value={{ value: currentValue, onChange: handleChange, variant, orientation }}>
        <div ref={ref} className={cn('flex flex-col', orientation === 'vertical' && 'flex-row', className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = 'Tabs';

export const TabList = forwardRef<HTMLDivElement, TabListProps>(
  ({ children, className, 'aria-label': ariaLabel, ...props }, ref) => {
    const { orientation } = useTabsContext();

    return (
      <div
        ref={ref}
        role="tablist"
        aria-label={ariaLabel}
        className={cn(
          'flex gap-1',
          orientation === 'vertical' && 'flex-col',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabList.displayName = 'TabList';

export const TabTrigger = forwardRef<HTMLButtonElement, TabTriggerProps>(
  ({ value, disabled, icon, badge, children, className, ...props }, ref) => {
    const { value: currentValue, onChange, variant, orientation } = useTabsContext();
    const isActive = currentValue === value;
    const triggerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      if (isActive && triggerRef.current) {
        triggerRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }, [isActive]);

    const variants = {
      line: isActive
        ? 'text-brand-purple border-b-2 border-brand-purple bg-transparent'
        : 'text-fg-tertiary hover:text-fg-primary border-b-2 border-transparent',
      enclosed: isActive
        ? 'bg-white text-brand-purple shadow-sm'
        : 'text-fg-tertiary hover:text-fg-primary hover:bg-surface-100',
      soft: isActive
        ? 'bg-brand-purple/10 text-brand-purple'
        : 'text-fg-tertiary hover:text-fg-primary hover:bg-surface-100',
      pills: isActive
        ? 'bg-brand-purple text-white shadow-sm'
        : 'text-fg-tertiary hover:text-fg-primary hover:bg-surface-100',
    };

    const baseStyles = `
      relative inline-flex items-center justify-center gap-2
      font-ui font-semibold text-sm
      rounded-lg px-3 py-2
      transition-all duration-fast
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/20
      disabled:opacity-50 disabled:cursor-not-allowed
      whitespace-nowrap
      ${orientation === 'vertical' ? 'w-full justify-start' : ''}
    `;

    return (
      <button
        ref={triggerRef}
        role="tab"
        aria-selected={isActive}
        aria-controls={`tabpanel-${value}`}
        id={`tab-${value}`}
        tabIndex={isActive ? 0 : -1}
        disabled={disabled}
        onClick={() => !disabled && onChange(value)}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {icon && <span className="flex-shrink-0" aria-hidden="true">{icon}</span>}
        {children}
        {badge && (
          <span className={cn(
            'ml-1.5 px-1.5 py-0.5 text-xs font-semibold rounded-full',
            isActive
              ? variant === 'pills' ? 'bg-white/20 text-white' : 'bg-brand-purple/10 text-brand-purple'
              : 'bg-surface-200 text-fg-secondary'
          )}>
            {badge}
          </span>
        )}
      </button>
    );
  }
);

TabTrigger.displayName = 'TabTrigger';

export const TabContent = forwardRef<HTMLDivElement, TabContentProps>(
  ({ value, children, className, ...props }, ref) => {
    const { value: currentValue } = useTabsContext();
    const isActive = currentValue === value;

    if (!isActive) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`tabpanel-${value}`}
        aria-labelledby={`tab-${value}`}
        tabIndex={0}
        className={cn('animate-in fade-in duration-fast', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabContent.displayName = 'TabContent';

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: Array<{ label: string; href?: string; current?: boolean }>;
  separator?: ReactNode;
  className?: string;
}

export function Breadcrumb({ items, separator, className, ...props }: BreadcrumbProps) {
  const Separator = separator || (
    <svg className="w-4 h-4 text-fg-tertiary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-2 flex-wrap', className)} {...props}>
      <ol className="flex items-center gap-2 flex-wrap">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden="true">{Separator}</span>}
            {item.href && !item.current ? (
              <a
                href={item.href}
                className="text-sm text-fg-secondary hover:text-brand-purple transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span
                className={cn(
                  'text-sm font-medium',
                  item.current ? 'text-fg-primary' : 'text-fg-secondary'
                )}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export interface PaginationProps extends HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  className,
  ...props
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = [];
  const half = Math.floor(maxVisiblePages / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + maxVisiblePages - 1);

  if (end - start + 1 < maxVisiblePages) {
    start = Math.max(1, end - maxVisiblePages + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <nav aria-label="Pagination" className={cn('flex items-center gap-1', className)} {...props}>
      {showFirstLast && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="First page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </Button>
      )}
      {showPrevNext && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
      )}
      {start > 1 && (
        <>
          <Button variant="ghost" size="sm" onClick={() => onPageChange(1)} aria-label="Page 1">1</Button>
          {start > 2 && <span className="px-2 text-fg-tertiary">...</span>}
        </>
      )}
      {pages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onPageChange(page)}
          aria-label={`Page ${page}`}
          aria-current={currentPage === page ? 'page' : undefined}
        >
          {page}
        </Button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-2 text-fg-tertiary">...</span>}
          <Button variant="ghost" size="sm" onClick={() => onPageChange(totalPages)} aria-label={`Page ${totalPages}`}>
            {totalPages}
          </Button>
        </>
      )}
      {showPrevNext && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      )}
      {showFirstLast && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Last page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7m-8 14l7 7 7-7" />
          </svg>
        </Button>
      )}
    </nav>
  );
}