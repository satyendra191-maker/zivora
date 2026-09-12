'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Flag, LayoutGrid, MapPin, Moon, ScrollText, Sun, UserPlus, Users } from 'lucide-react';
import type { AppData } from '@/lib/types';
import { AdminOverview } from './admin-overview';
import { AdminOps } from './admin-tables';

export type DayPoint = { day: string; city: string; n: number };
export type AdminStats = {
  days: number;
  signups: DayPoint[]; messages: DayPoint[]; joins: DayPoint[];
  totals: { users: number; messages: number };
  resourceKinds: { kind: string; n: number }[];
  userCities: { city: string; n: number }[];
  reportStates: { status: string; n: number }[];
};

export type AdminTab = 'overview' | 'users' | 'leads' | 'spaces' | 'reports' | 'audit';

const tabs: { id: AdminTab; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'leads', label: 'Leads', icon: UserPlus },
  { id: 'spaces', label: 'Spaces', icon: MapPin },
  { id: 'reports', label: 'Reports', icon: Flag },
  { id: 'audit', label: 'Audit log', icon: ScrollText },
];

export default function AdminDashboard({ adminName, adminId }: { adminName: string; adminId: string }) {
  const [tab, setTab] = useState<AdminTab>('overview');
  const [data, setData] = useState<AppData | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsError, setStatsError] = useState('');
  const [days, setDays] = useState(30);
  const [city, setCity] = useState('All cities');
  const [dark, setDark] = useState(() => { try { return typeof window !== 'undefined' && window.localStorage.getItem('zivora-admin-theme') === 'dark'; } catch { return false; } });
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');
  const [loadError, setLoadError] = useState('');
  const [navOpen, setNavOpen] = useState(false);
  const booted = useRef(false); const lastDays = useRef(days);

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(''), 4000); return () => clearTimeout(t); }
  }, [toast]);

  const loadSnapshot = useCallback(async () => {
    const res = await fetch('/api/app');
    if (!res.ok) throw new Error('Session expired. Please sign in again.');
    setData(await res.json());
  }, []);

  const loadStats = useCallback(async (range: number) => {
    setStatsError('');
    try {
      const res = await fetch('/api/app', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'adminStats', days: range }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Unable to load analytics.');
      setStats(json);
    } catch (e) { setStatsError(e instanceof Error ? e.message : 'Unable to load analytics.'); }
  }, []);

  const refresh = useCallback(async () => {
    setLoadError('');
    try { await loadSnapshot(); } catch (e) { setLoadError(e instanceof Error ? e.message : 'Unable to load.'); }
  }, [loadSnapshot]);

  useEffect(() => {
    if (!booted.current) { booted.current = true; lastDays.current = days; void refresh(); void loadStats(days); return; }
    if (lastDays.current !== days) { lastDays.current = days; void loadStats(days); }
  }, [days, refresh, loadStats]);

  const notify = useCallback((text: string) => setToast(text), []);

  const mutate = useCallback(async (body: Record<string, unknown>, success?: string): Promise<boolean> => {
    setBusy(true);
    try {
      const res = await fetch('/api/app', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Please try again.');
      setData(json);
      return true;
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Please try again.');
      return false;
    } finally { setBusy(false); }
  }, [notify]);

  const mutateAndRefreshStats = useCallback(async (body: Record<string, unknown>, success?: string) => {
    const ok = await mutate(body, success);
    if (ok) {
      if (success) notify(success);
      void loadStats(days);
    }
  }, [mutate, notify, loadStats, days]);

  const toggleDark = () => {
    setDark(previous => {
      const next = !previous;
      try { window.localStorage.setItem('zivora-admin-theme', next ? 'dark' : 'light'); } catch {}
      return next;
    });
  };

  const cities = ['All cities', ...(stats?.userCities.map(c => c.city) || [])];
  const openReports = data?.reports.filter(r => r.status === 'open').length || 0;
  const newLeads = data?.leads?.filter(l => l.status === 'new').length || 0;

  return (
    <div className={`adm-shell${dark ? ' adm-dark' : ''}`}>
      {navOpen && <div className="adm-backdrop" onClick={() => setNavOpen(false)} />}
      <aside className={`adm-side${navOpen ? ' open' : ''}`}>
        <div className="adm-brand"><span className="adm-brand-mark">Z</span><div><strong>Zivora Ops</strong><span>Admin dashboard</span></div></div>
        <nav>
          {tabs.map(t => (
            <button key={t.id} className={`adm-nav${tab === t.id ? ' active' : ''}`} onClick={() => { setTab(t.id); setNavOpen(false); }}>
              <t.icon size={18} /><span>{t.label}</span>
              {t.id === 'reports' && openReports > 0 && <b className="adm-count">{openReports}</b>}
              {t.id === 'leads' && newLeads > 0 && <b className="adm-count">{newLeads}</b>}
            </button>
          ))}
        </nav>
        <div className="adm-side-foot">
          <button className="adm-theme" onClick={toggleDark} aria-label="Toggle dark mode">{dark ? <Sun size={17} /> : <Moon size={17} />}<span>{dark ? 'Light mode' : 'Dark mode'}</span></button>
          <Link className="adm-back" href="/"><ArrowLeft size={16} /><span>Back to app</span></Link>
          <div className="adm-me"><span>{adminName}</span><em>Administrator</em></div>
        </div>
      </aside>
      <div className="adm-main">
        <header className="adm-top">
          <button className="adm-menu" aria-label="Open navigation" onClick={() => setNavOpen(true)}><LayoutGrid size={20} /></button>
          <div><span className="adm-eyebrow">OPERATIONS · LIVE DATA</span><h1>{tabs.find(t => t.id === tab)?.label}</h1></div>
          <div className="adm-filters">
            <label>Range<select value={days} onChange={e => setDays(Number(e.target.value))} aria-label="Date range">{[7, 30, 90, 365].map(d => <option key={d} value={d}>Last {d} days</option>)}</select></label>
            <label>City<select value={city} onChange={e => setCity(e.target.value)} aria-label="City segment">{cities.map(c => <option key={c}>{c}</option>)}</select></label>
          </div>
        </header>
        {!data ? (
          <main className="adm-content"><div className="adm-card">{loadError ? <p>{loadError}</p> : <p>Loading operations data…</p>}</div></main>
        ) : (
          <main className="adm-content">
            {tab === 'overview'
              ? <AdminOverview data={data} stats={stats} statsError={statsError} days={days} city={city} dark={dark} />
              : <AdminOps tab={tab} data={data} busy={busy} adminId={adminId} city={city} onMutate={mutateAndRefreshStats} notify={notify} />}
          </main>
        )}
        {toast && <div className="adm-toast" role="status"><Check size={16} /><span>{toast}</span></div>}
      </div>
    </div>
  );
}
