import { useState, useCallback, useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}

export function useSessionStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error('Error setting sessionStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}

export function useMediaQuery(query: string) {
  const getSnapshot = useCallback(() => typeof window !== 'undefined' && window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === 'undefined') return () => {};
      const media = window.matchMedia(query);
      media.addEventListener('change', onStoreChange);
      return () => media.removeEventListener('change', onStoreChange);
    },
    getSnapshot,
    () => false
  );
}

export function useBreakpoint() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isLarge = useMediaQuery('(min-width: 1280px)');

  return { isMobile, isTablet, isDesktop, isLarge };
}

export function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function useThrottle<T>(value: T, limit: number) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(0);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit);

    return () => clearTimeout(handler);
  }, [value, limit]);

  return throttledValue;
}

export function useClickOutside(ref: React.RefObject<HTMLElement>, handler: (event: MouseEvent | TouchEvent) => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export function useKeyPress(targetKey: string, handler: (event: KeyboardEvent) => void) {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === targetKey) handler(event);
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [targetKey, handler]);
}

export function useShortcut(keys: string[], handler: (event: KeyboardEvent) => void) {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const match = keys.every((key) => {
        if (key === 'ctrl') return event.ctrlKey || event.metaKey;
        if (key === 'shift') return event.shiftKey;
        if (key === 'alt') return event.altKey;
        return event.key.toLowerCase() === key.toLowerCase();
      });
      if (match) handler(event);
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [keys, handler]);
}

export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
}

export function useOnScreen(ref: React.RefObject<Element>, rootMargin = '0px') {
  return useIntersectionObserver(ref, { rootMargin });
}

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      setCopied(false);
      return false;
    }
  }, []);

  return { copy, copied };
}

export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle, setValue] as const;
}

export function useCounter(initialValue = 0, { min, max }: { min?: number; max?: number } = {}) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback((delta = 1) => {
    setCount((c) => {
      const next = c + delta;
      if (max !== undefined && next > max) return max;
      return next;
    });
  }, [max]);

  const decrement = useCallback((delta = 1) => {
    setCount((c) => {
      const next = c - delta;
      if (min !== undefined && next < min) return min;
      return next;
    });
  }, [min]);

  const reset = useCallback(() => setCount(initialValue), [initialValue]);

  return { count, increment, decrement, reset, setCount };
}

export function usePrevious<T>(value: T) {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  // eslint-disable-next-line react-hooks/refs -- returning the previous render's value is this hook's purpose
  return ref.current;
}

export function useMounted() {
  return useSyncExternalStore(() => () => {}, () => true, () => false);
}

export function useEventCallback<Args extends unknown[], Return>(
  callback: (...args: Args) => Return
) {
  const ref = useRef(callback);
  useEffect(() => {
    ref.current = callback;
  }, [callback]);
  return useCallback((...args: Args) => ref.current(...args), []);
}

export function useTimeout() {
  const timeouts = useRef<Set<NodeJS.Timeout>>(new Set());

  const set = useCallback((callback: () => void, delay: number) => {
    const id = setTimeout(callback, delay);
    timeouts.current.add(id);
    return id;
  }, []);

  const clear = useCallback((id: NodeJS.Timeout) => {
    clearTimeout(id);
    timeouts.current.delete(id);
  }, []);

  const clearAll = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current.clear();
  }, []);

  useEffect(() => () => clearAll(), [clearAll]);

  return { set, clear, clearAll };
}

export function useInterval() {
  const intervals = useRef<Set<NodeJS.Timeout>>(new Set());

  const set = useCallback((callback: () => void, delay: number) => {
    const id = setInterval(callback, delay);
    intervals.current.add(id);
    return id;
  }, []);

  const clear = useCallback((id: NodeJS.Timeout) => {
    clearInterval(id);
    intervals.current.delete(id);
  }, []);

  const clearAll = useCallback(() => {
    intervals.current.forEach(clearInterval);
    intervals.current.clear();
  }, []);

  useEffect(() => () => clearAll(), [clearAll]);

  return { set, clear, clearAll };
}

type SetStateAction<T> = T | ((prev: T) => T);

export function useStateWithHistory<T>(initialValue: T) {
  const [{ value, history, index }, setState] = useState({
    value: initialValue,
    history: [initialValue],
    index: 0,
  });

  const set = useCallback((action: SetStateAction<T>) => {
    setState(({ value: current, history: hist, index: idx }) => {
      const nextValue = action instanceof Function ? action(current) : action;
      if (nextValue === current) return { value: current, history: hist, index: idx };
      const nextHistory = hist.slice(0, idx + 1);
      nextHistory.push(nextValue);
      return { value: nextValue, history: nextHistory, index: nextHistory.length - 1 };
    });
  }, []);

  const undo = useCallback(() => {
    setState(({ value: current, history: hist, index: idx }) =>
      idx > 0 ? { value: hist[idx - 1], history: hist, index: idx - 1 } : { value: current, history: hist, index: idx }
    );
  }, []);

  const redo = useCallback(() => {
    setState(({ value: current, history: hist, index: idx }) =>
      idx < hist.length - 1 ? { value: hist[idx + 1], history: hist, index: idx + 1 } : { value: current, history: hist, index: idx }
    );
  }, []);

  const canUndo = index > 0;
  const canRedo = index < history.length - 1;

  return [value, set, { undo, redo, canUndo, canRedo, history }] as const;
}

export function cn(...classes: (string | boolean | undefined | null | Record<string, boolean>)[]) {
  return classes
    .flatMap((c) => {
      if (!c) return [];
      if (typeof c === 'string') return c;
      return Object.entries(c).filter(([, v]) => v).map(([k]) => k);
    })
    .join(' ');
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  });
}

export function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatRelativeTime(date: string | Date) {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function truncate(str: string, length: number) {
  if (str.length <= length) return str;
  return str.slice(0, length - 1) + '…';
}

export function classNames(...classes: (string | boolean | undefined | null | Record<string, boolean>)[]) {
  return cn(...classes);
}