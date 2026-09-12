'use client';

import { useEffect, useState, type ReactNode, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'default';
  title: string;
  message?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
  persistent?: boolean;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed bottom-5 right-5 z-[var(--z-toast)] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>,
    document.body
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (toast.persistent || !toast.duration) return;

    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p - (100 / (toast.duration! / 50));
        if (next <= 0) {
          clearInterval(interval);
          setVisible(false);
          setTimeout(() => onRemove(toast.id), 200);
          return 0;
        }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [toast, onRemove]);

  if (!visible) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-success-default" aria-hidden="true" />,
    error: <AlertCircle className="w-5 h-5 text-error-default" aria-hidden="true" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning-default" aria-hidden="true" />,
    info: <Info className="w-5 h-5 text-info-default" aria-hidden="true" />,
    default: <Info className="w-5 h-5 text-brand-purple" aria-hidden="true" />,
  };

  const backgrounds = {
    success: 'bg-success-surface border-success-default/20',
    error: 'bg-error-surface border-error-default/20',
    warning: 'bg-warning-surface border-warning-default/20',
    info: 'bg-info-surface border-info-default/20',
    default: 'bg-white border-border-subtle shadow-card',
  };

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border animate-in slide-in-from-right duration-base',
        backgrounds[toast.type]
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-fg-primary">{toast.title}</p>
        {toast.message && <p className="mt-0.5 text-sm text-fg-secondary">{toast.message}</p>}
        {toast.action && (
          <button
            onClick={() => { toast.action!.onClick(); onRemove(toast.id); }}
            className="mt-2 text-sm font-semibold text-brand-purple hover:underline focus:outline-none focus:ring-2 focus:ring-brand-purple/20 rounded"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      {!toast.persistent && (
        <button
          onClick={() => { setVisible(false); setTimeout(() => onRemove(toast.id), 200); }}
          className="flex-shrink-0 text-fg-tertiary hover:text-fg-primary transition-colors"
          aria-label="Dismiss notification"
        >
          <X size={18} />
        </button>
      )}
      {!toast.persistent && toast.duration && (
        <div
          className="absolute bottom-0 left-0 h-1 bg-brand-purple/20 rounded-bl-xl rounded-br-xl overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="h-full bg-brand-purple transition-all duration-50 ease-linear origin-left"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

export function toast(type: Toast['type'], title: string, options?: Partial<Toast>) {
  // This is a helper for non-React contexts
  console.warn('toast() helper requires ToastProvider. Use useToast() in components.');
}

toast.success = (title: string, options?: Partial<Toast>) => toast('success', title, options);
toast.error = (title: string, options?: Partial<Toast>) => toast('error', title, options);
toast.warning = (title: string, options?: Partial<Toast>) => toast('warning', title, options);
toast.info = (title: string, options?: Partial<Toast>) => toast('info', title, options);