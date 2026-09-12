'use client';

import { 
  forwardRef, 
  type HTMLAttributes, 
  type ReactNode, 
  useId, 
  createContext, 
  useContext, 
  useState 
} from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<HTMLAttributes<HTMLInputElement>, 'checked'> {
  label?: string;
  description?: string;
  error?: string;
  indeterminate?: boolean;
  checked?: boolean;
  className?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, indeterminate, className, id, checked, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;
    const describedBy = [description, error].filter(Boolean).join(' ') || undefined;

    return (
      <div className={cn('flex items-start gap-3', className)}>
        <div className="relative flex items-center justify-center mt-0.5 flex-shrink-0">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            aria-describedby={describedBy}
            aria-invalid={error ? 'true' : 'false'}
            aria-checked={indeterminate ? 'mixed' : undefined}
            className={cn(
              'appearance-none w-5 h-5 rounded-lg border-2 transition-all duration-fast',
              'cursor-pointer',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/20',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              indeterminate
                ? 'bg-brand-purple border-brand-purple'
                : checked
                ? 'bg-brand-purple border-brand-purple'
                : 'border-border-default hover:border-border-strong',
              error && 'border-error-default focus-visible:ring-error-default/20',
              className
            )}
            {...props}
          />
          {(checked || indeterminate) && (
            <svg
              className={cn('absolute w-3.5 h-3.5 text-white pointer-events-none', indeterminate && 'rotate-90')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={indeterminate ? 'M5 12h14' : 'M4.5 12.75l6 6 9-13.5'} />
            </svg>
          )}
        </div>
        {label && (
          <div className="flex-1 min-w-0">
            <label htmlFor={checkboxId} className="block text-sm font-medium text-fg-primary cursor-pointer">
              {label}
            </label>
            {description && !error && (
              <p className="mt-0.5 text-sm text-fg-tertiary">{description}</p>
            )}
            {error && (
              <p className="mt-0.5 text-sm text-error-default flex items-center gap-1" role="alert">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export interface SwitchProps extends HTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, description, error, size = 'md', className, id, ...props }, ref) => {
    const generatedId = useId();
    const switchId = id || generatedId;
    const describedBy = [description, error].filter(Boolean).join(' ') || undefined;

    const sizes = {
      sm: { track: 'w-8 h-4.5', thumb: 'w-3.5 h-3.5', translate: 'translate-x-3.5' },
      md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
      lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' },
    };

    const { track, thumb, translate } = sizes[size];

    return (
      <div className={cn('flex items-center gap-3', className)}>
        <label htmlFor={switchId} className="relative inline-flex items-center cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            role="switch"
            aria-describedby={describedBy}
            aria-invalid={error ? 'true' : 'false'}
            className="sr-only peer"
            {...props}
          />
          <span
            className={cn(
              'inline-block rounded-full border-2 transition-all duration-fast',
              'bg-surface-200 border-border-default',
              'peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-brand-purple/20',
              'peer-checked:bg-brand-purple peer-checked:border-brand-purple',
              'peer-checked:after:translate-x-full',
              'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
              error && 'peer-checked:bg-error-default peer-checked:border-error-default',
              track
            )}
            aria-hidden="true"
          >
            <span
              className={cn(
                'block rounded-full bg-white shadow-sm transition-transform duration-fast',
                'peer-checked:after:translate-x-full',
                thumb
              )}
              aria-hidden="true"
            />
          </span>
        </label>
        {label && (
          <div className="flex-1 min-w-0">
            <span className="block text-sm font-medium text-fg-primary">{label}</span>
            {description && !error && <p className="mt-0.5 text-sm text-fg-tertiary">{description}</p>}
            {error && <p className="mt-0.5 text-sm text-error-default">{error}</p>}
          </div>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';

export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  children: ReactNode;
}

export interface RadioProps extends HTMLAttributes<HTMLInputElement> {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

const RadioGroupContext = createContext<{
  name: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
} | null>(null);

export function RadioGroup({ name, value, onChange, defaultValue, orientation = 'vertical', className, children, ...props }: RadioGroupProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (newValue: string) => {
    if (!isControlled) setInternalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <RadioGroupContext.Provider value={{ name, value: currentValue, onChange: handleChange, disabled: false }}>
      <div role="radiogroup" aria-label={name} className={cn(orientation === 'horizontal' ? 'flex gap-4' : 'space-y-3', className)} {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

function useRadioGroup() {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error('Radio components must be used within RadioGroup');
  }
  return context;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ value, label, description, disabled: disabledProp, className, id, ...props }, ref) => {
    const { name, value: groupValue, onChange, disabled: groupDisabled } = useRadioGroup();
    const disabled = disabledProp || groupDisabled;
    const isChecked = groupValue === value;
    const generatedId = useId();
    const radioId = id || generatedId;
    const describedBy = description ? `${radioId}-desc` : undefined;

    return (
      <label htmlFor={radioId} className={cn('flex items-start gap-3 cursor-pointer', disabled && 'opacity-50 cursor-not-allowed', className)}>
        <div className="relative flex items-center justify-center mt-0.5 flex-shrink-0">
          <input
            ref={ref}
            type="radio"
            id={radioId}
            name={name}
            value={value}
            checked={isChecked}
            disabled={disabled}
            aria-describedby={describedBy}
            className="sr-only peer"
            onChange={() => !disabled && onChange(value)}
            {...props}
          />
          <span
            className={cn(
              'inline-block w-5 h-5 rounded-full border-2 transition-all duration-fast',
              'border-border-default',
              'peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-brand-purple/20',
              'peer-checked:border-brand-purple',
              'peer-checked:after:opacity-100 peer-checked:after:scale-100',
              'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
              'after:content-[""] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-2.5 after:h-2.5 after:rounded-full after:bg-brand-purple after:opacity-0 after:scale-50 after:transition-all after:duration-fast'
            )}
            aria-hidden="true"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className="block text-sm font-medium text-fg-primary">{label}</span>
          {description && (
            <p id={`${radioId}-desc`} className="mt-0.5 text-sm text-fg-tertiary">{description}</p>
          )}
        </div>
      </label>
    );
  }
);

Radio.displayName = 'Radio';

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, description, error, required, children, className, ...props }: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)} {...props}>
      {label && (
        <label className="block text-sm font-semibold text-fg-primary flex items-center gap-1">
          {label}
          {required && <span className="text-error-default" aria-hidden="true">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-sm text-error-default flex items-center gap-1" role="alert">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      ) : description ? (
        <p className="text-sm text-fg-tertiary">{description}</p>
      ) : null}
    </div>
  );
}