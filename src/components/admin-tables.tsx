'use client';

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, Check, ChevronLeft, ChevronRight, Flag, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import type { AppData, Lead, Member, Report, Resource } from '@/lib/types';

export type OpsTab = 'users' | 'leads' | 'spaces' | 'reports' | 'audit';

type Props = {
  tab: OpsTab; data: AppData; busy: boolean; adminId: string; city: string;
  onMutate: (body: Record<string, unknown>, success?: string) => Promise<void>;
  notify: (text: string, error?: boolean) => void;
};

type SortDir = 'asc' | 'desc';
const perPage = 12;

function usePager(count: number) {
  const [page, setPage] = useState(0);
  const [prevCount, setPrevCount] = useState(count);
  if (prevCount !== count) { setPrevCount(count); setPage(0); }
  const pages = Math.max(1, Math.ceil(count / perPage));
  return { page: Math.min(page, pages - 1), setPage, pages };
}

function Pager({ page, pages, setPage }: { page: number; pages: number; setPage: (n: number) => void }) {
  if (pages <= 1) return null;
  return (
    <div className="adm-pager">
      <button aria-label="Previous page" disabled={page === 0} onClick={() => setPage(page - 1)}><ChevronLeft size={16} /></button>
      <span>Page {page + 1} of {pages}</span>
      <button aria-label="Next page" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}><ChevronRight size={16} /></button>
    </div>
  );
}

function Confirm({ label, busy, onConfirm }: { label: ReactNode; busy: boolean; onConfirm: () => void }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => { if (!armed) return; const t = setTimeout(() => setArmed(false), 4000); return () => clearTimeout(t); }, [armed]);
  if (!armed) return <button className="adm-btn danger-ghost" disabled={busy} onClick={() => setArmed(true)}>{label}</button>;
  return <button className="adm-btn danger" disabled={busy} onClick={() => { setArmed(false); onConfirm(); }}>Confirm?</button>;
}

function SortHead({ label, active, dir, onClick }: { label: string; active: boolean; dir: SortDir; onClick: () => void }) {
  return (
    <button className={`adm-sort${active ? ' on' : ''}`} onClick={onClick}>
      {label}{active && (dir === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />)}
    </button>
  );
}

function useCityFilter(globalCity: string) {
  const [cityF, setCityF] = useState(globalCity);
  const [prevGlobal, setPrevGlobal] = useState(globalCity);
  if (prevGlobal !== globalCity) { setPrevGlobal(globalCity); setCityF(globalCity); }
  return [cityF, setCityF] as const;
}

/* ---------------- Users ---------------- */

function UsersTable({ data, busy, city, onMutate }: Pick<Props, 'data' | 'busy' | 'city' | 'onMutate'>) {
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('All roles');
  const [status, setStatus] = useState('All statuses');
  const [cityF, setCityF] = useCityFilter(city);
  const [sortKey, setSortKey] = useState<'name' | 'age' | 'city' | 'role'>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const members = data.members || [];

  const rows = useMemo(() => {
    const q = query.toLowerCase();
    const filtered = members.filter(m =>
      (cityF === 'All cities' || m.city === cityF) &&
      (role === 'All roles' || m.role === role) &&
      (status === 'All statuses' || (status === 'Suspended' ? m.suspended : status === 'Demo' ? m.demo : !m.suspended)) &&
      `${m.name} ${m.email || ''}`.toLowerCase().includes(q));
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey]; const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [members, query, role, status, cityF, sortKey, sortDir]);

  const { page, setPage, pages } = usePager(rows.length);
  const toggle = (key: typeof sortKey) => {
    if (key === sortKey) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };
  const cities = ['All cities', ...new Set(members.map(m => m.city))];

  return (
    <section className="adm-card">
      <div className="adm-card-head"><div><h3>Members</h3><p>{rows.length} of {members.length} accounts · suspend instead of delete to preserve history</p></div></div>
      <div className="adm-tools">
        <span className="adm-search"><Search size={15} /><input placeholder="Search name or email" value={query} onChange={e => setQuery(e.target.value)} aria-label="Search members" /></span>
        <select value={role} onChange={e => setRole(e.target.value)} aria-label="Filter by role">{['All roles', 'admin', 'member'].map(r => <option key={r}>{r}</option>)}</select>
        <select value={status} onChange={e => setStatus(e.target.value)} aria-label="Filter by status">{['All statuses', 'Active', 'Suspended', 'Demo'].map(s => <option key={s}>{s}</option>)}</select>
        <select value={cityF} onChange={e => setCityF(e.target.value)} aria-label="Filter by city">{cities.map(c => <option key={c}>{c}</option>)}</select>
      </div>
      <div className="adm-table-wrap"><table className="adm-table">
        <thead><tr>
          <th><SortHead label="Member" active={sortKey === 'name'} dir={sortDir} onClick={() => toggle('name')} /></th>
          <th><SortHead label="City" active={sortKey === 'city'} dir={sortDir} onClick={() => toggle('city')} /></th>
          <th><SortHead label="Age" active={sortKey === 'age'} dir={sortDir} onClick={() => toggle('age')} /></th>
          <th><SortHead label="Role" active={sortKey === 'role'} dir={sortDir} onClick={() => toggle('role')} /></th>
          <th>Status</th><th>Actions</th>
        </tr></thead>
        <tbody>
          {rows.slice(page * perPage, page * perPage + perPage).map((m: Member) => (
            <tr key={m.id} className={m.suspended ? 'adm-dim' : ''}>
              <td><strong>{m.name}</strong><span className="adm-sub">{m.email || (m.demo ? 'Demo account' : 'No email')}</span></td>
              <td>{m.city}</td><td>{m.age}</td>
              <td><span className="adm-pill">{m.role}</span></td>
              <td>
                <span className="adm-pill">{m.suspended ? 'Suspended' : 'Active'}</span>
                {m.demo && <span className="adm-pill">Demo</span>}
                {!m.adult && <span className="adm-pill warn">Unverified 18+</span>}
              </td>
              <td><Confirm label={m.suspended ? 'Restore' : 'Suspend'} busy={busy} onConfirm={() => void onMutate({ action: 'moderate', kind: 'user', id: m.id, suspended: !m.suspended }, m.suspended ? 'Account restored.' : 'Account suspended.')} /></td>
            </tr>
          ))}
          {!rows.length && <tr><td colSpan={6}><p className="muted">No members match these filters.</p></td></tr>}
        </tbody>
      </table></div>
      <Pager page={page} pages={pages} setPage={setPage} />
    </section>
  );
}

/* ---------------- Spaces (communities & events) ---------------- */

function SpaceForm({ initial, busy, onClose, onMutate }: { initial?: Resource; busy: boolean; onClose: () => void; onMutate: Props['onMutate'] }) {
  const [kind, setKind] = useState(initial?.kind || 'community');
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const ok = await (async () => {
      await onMutate({
        action: initial ? 'update' : 'create', id: initial?.id, kind,
        title: f.get('title'), description: f.get('description'), category: f.get('category'),
        city: f.get('city'), location: f.get('location'), date: f.get('date') || '', capacity: f.get('capacity') || 2,
      }, initial ? 'Changes saved.' : 'Space created.');
      return true;
    })();
    if (ok) onClose();
  };
  return (
    <div className="adm-modal-back" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="adm-modal" role="dialog" aria-modal="true" aria-label={initial ? 'Edit space' : 'Create space'}>
        <div className="adm-modal-head"><h3>{initial ? 'Edit space' : 'Create a space'}</h3><button className="adm-x" onClick={onClose} aria-label="Close">✕</button></div>
        <form className="adm-form" onSubmit={submit}>
          {!initial && <label>Kind<select name="kind" value={kind} onChange={e => setKind(e.target.value)}>{['community', 'event'].map(k => <option key={k}>{k}</option>)}</select></label>}
          <label>Name<input name="title" required maxLength={100} defaultValue={initial?.title} /></label>
          <label>Description<textarea name="description" rows={3} required maxLength={3000} defaultValue={initial?.description} /></label>
          <div className="adm-row">
            <label>Category<select name="category" defaultValue={initial?.category || 'Social mixer'}>{['Social mixer', 'Food & drink', 'Outdoors', 'Art & culture', 'Books', 'Music', 'Fitness', 'Technology'].map(c => <option key={c}>{c}</option>)}</select></label>
            <label>City<select name="city" defaultValue={initial?.city || 'Bengaluru'}>{['Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'].map(c => <option key={c}>{c}</option>)}</select></label>
          </div>
          <label>Location<input name="location" maxLength={180} defaultValue={initial?.location} placeholder="Public venue" /></label>
          <div className="adm-row">
            <label>Date & time<input name="date" type="datetime-local" defaultValue={initial?.date ? initial.date.slice(0, 16) : ''} /></label>
            <label>Capacity<input name="capacity" type="number" min={2} max={10000} defaultValue={initial?.capacity || 50} /></label>
          </div>
          <div className="adm-form-actions"><button type="button" className="adm-btn ghost" onClick={onClose}>Cancel</button><button className="adm-btn primary" disabled={busy}>{initial ? 'Save changes' : 'Create space'}</button></div>
        </form>
      </div>
    </div>
  );
}

function SpacesTable({ data, busy, adminId, city, onMutate }: Pick<Props, 'data' | 'busy' | 'adminId' | 'city' | 'onMutate'>) {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('All kinds');
  const [status, setStatus] = useState('All statuses');
  const [cityF, setCityF] = useCityFilter(city);
  const [sortKey, setSortKey] = useState<'title' | 'members'>('members');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [editing, setEditing] = useState<Resource | null>(null);
  const [creating, setCreating] = useState(false);
  const items = data.resources.filter(r => r.kind === 'community' || r.kind === 'event');

  const rows = useMemo(() => {
    const q = query.toLowerCase();
    const filtered = items.filter(r =>
      (cityF === 'All cities' || r.city === cityF) &&
      (kind === 'All kinds' || r.kind === kind) &&
      (status === 'All statuses' || r.status === status) &&
      `${r.title} ${r.category}`.toLowerCase().includes(q));
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => (sortKey === 'members' ? (a.members - b.members) * dir : a.title.localeCompare(b.title) * dir));
  }, [items, query, kind, status, cityF, sortKey, sortDir]);

  const { page, setPage, pages } = usePager(rows.length);
  const toggle = (key: typeof sortKey) => {
    if (key === sortKey) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir(key === 'members' ? 'desc' : 'asc'); }
  };
  const cities = ['All cities', ...new Set(items.map(r => r.city))];

  return (
    <section className="adm-card">
      <div className="adm-card-head"><div><h3>Communities & events</h3><p>{rows.length} spaces · removal hides instantly, deletion is permanent for owned spaces</p></div><button className="adm-btn primary" onClick={() => setCreating(true)}><Plus size={15} />New space</button></div>
      <div className="adm-tools">
        <span className="adm-search"><Search size={15} /><input placeholder="Search title or category" value={query} onChange={e => setQuery(e.target.value)} aria-label="Search spaces" /></span>
        <select value={kind} onChange={e => setKind(e.target.value)} aria-label="Filter by kind">{['All kinds', 'community', 'event'].map(k => <option key={k}>{k}</option>)}</select>
        <select value={status} onChange={e => setStatus(e.target.value)} aria-label="Filter by status">{['All statuses', 'active', 'removed'].map(s => <option key={s}>{s}</option>)}</select>
        <select value={cityF} onChange={e => setCityF(e.target.value)} aria-label="Filter by city">{cities.map(c => <option key={c}>{c}</option>)}</select>
      </div>
      <div className="adm-table-wrap"><table className="adm-table">
        <thead><tr>
          <th><SortHead label="Space" active={sortKey === 'title'} dir={sortDir} onClick={() => toggle('title')} /></th>
          <th>Kind</th><th>City</th>
          <th><SortHead label="Members" active={sortKey === 'members'} dir={sortDir} onClick={() => toggle('members')} /></th>
          <th>Status</th><th>Actions</th>
        </tr></thead>
        <tbody>
          {rows.slice(page * perPage, page * perPage + perPage).map(r => (
            <tr key={r.id} className={r.status !== 'active' ? 'adm-dim' : ''}>
              <td><strong>{r.title}</strong><span className="adm-sub">{r.category}{r.ownerId === adminId ? ' · yours' : ''}</span></td>
              <td><span className="adm-pill">{r.kind}</span></td><td>{r.city}</td><td>{r.members.toLocaleString('en-IN')}</td>
              <td><span className="adm-pill">{r.status}</span></td>
              <td><div className="adm-actions">
                <button className="adm-btn ghost" disabled={busy || r.ownerId !== adminId} title={r.ownerId === adminId ? 'Edit' : 'Only the organizer can edit'} onClick={() => setEditing(r)}><Pencil size={14} /></button>
                <button className="adm-btn ghost" disabled={busy} onClick={() => void onMutate({ action: 'moderate', kind: 'resource', id: r.id, status: r.status === 'removed' ? 'active' : 'removed' }, r.status === 'removed' ? 'Space restored.' : 'Space removed from discovery.')}>{r.status === 'removed' ? 'Restore' : 'Remove'}</button>
                {r.ownerId === adminId && <Confirm label={<span className="adm-del"><Trash2 size={14} />Delete</span>} busy={busy} onConfirm={() => void onMutate({ action: 'delete', id: r.id }, 'Space deleted.')} />}
              </div></td>
            </tr>
          ))}
          {!rows.length && <tr><td colSpan={6}><p className="muted">No spaces match these filters.</p></td></tr>}
        </tbody>
      </table></div>
      <Pager page={page} pages={pages} setPage={setPage} />
      {editing && <SpaceForm initial={editing} busy={busy} onClose={() => setEditing(null)} onMutate={onMutate} />}
      {creating && <SpaceForm busy={busy} onClose={() => setCreating(false)} onMutate={onMutate} />}
    </section>
  );
}

/* ---------------- Reports ---------------- */

function ReportsTable({ data, busy, onMutate }: Pick<Props, 'data' | 'busy' | 'onMutate'>) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All statuses');
  const rows = useMemo(() => {
    const q = query.toLowerCase();
    return data.reports.filter((r: Report) =>
      (status === 'All statuses' || r.status === status) &&
      `${r.reason} ${r.details} ${r.targetId}`.toLowerCase().includes(q));
  }, [data.reports, query, status]);
  const { page, setPage, pages } = usePager(rows.length);
  return (
    <section className="adm-card">
      <div className="adm-card-head"><div><h3>Safety reports</h3><p>{rows.length} reports · private to reporters and moderators</p></div></div>
      <div className="adm-tools">
        <span className="adm-search"><Search size={15} /><input placeholder="Search reason, details, target" value={query} onChange={e => setQuery(e.target.value)} aria-label="Search reports" /></span>
        <select value={status} onChange={e => setStatus(e.target.value)} aria-label="Filter by status">{['All statuses', 'open', 'reviewing', 'resolved'].map(s => <option key={s}>{s}</option>)}</select>
      </div>
      <div className="adm-table-wrap"><table className="adm-table">
        <thead><tr><th>Report</th><th>Target</th><th>Status</th><th>Filed</th><th>Actions</th></tr></thead>
        <tbody>
          {rows.slice(page * perPage, page * perPage + perPage).map(r => (
            <tr key={r.id}>
              <td><strong>{r.reason}</strong><span className="adm-sub">{r.details.slice(0, 120)}{r.details.length > 120 ? '…' : ''}</span></td>
              <td><span className="adm-mono">{r.targetId}</span></td>
              <td><span className="adm-pill">{r.status}</span></td>
              <td>{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
              <td><div className="adm-actions">
                {r.status !== 'reviewing' && r.status !== 'resolved' && <button className="adm-btn ghost" disabled={busy} onClick={() => void onMutate({ action: 'moderate', kind: 'report', id: r.id, status: 'reviewing' }, 'Marked as reviewing.')}>Review</button>}
                {r.status !== 'resolved' && <button className="adm-btn ghost" disabled={busy} onClick={() => void onMutate({ action: 'moderate', kind: 'report', id: r.id, status: 'resolved' }, 'Report resolved.')}><Check size={14} />Resolve</button>}
              </div></td>
            </tr>
          ))}
          {!rows.length && <tr><td colSpan={5}><p className="muted">Queue is clear.</p></td></tr>}
        </tbody>
      </table></div>
      <Pager page={page} pages={pages} setPage={setPage} />
    </section>
  );
}

/* ---------------- Audit ---------------- */

function AuditTable({ data }: Pick<Props, 'data'>) {
  const rows = data.audit || [];
  const { page, setPage, pages } = usePager(rows.length);
  return (
    <section className="adm-card">
      <div className="adm-card-head"><div><h3>Moderation audit trail</h3><p>{rows.length} recorded operations · newest first</p></div></div>
      <div className="adm-table-wrap"><table className="adm-table">
        <thead><tr><th>Operation</th><th>Target</th><th>Time</th></tr></thead>
        <tbody>
          {rows.slice(page * perPage, page * perPage + perPage).map(a => (
            <tr key={a.id}>
              <td><span className="adm-pill"><Flag size={12} />{a.action}</span></td>
              <td><span className="adm-mono">{a.targetId}</span></td>
              <td>{new Date(a.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</td>
            </tr>
          ))}
          {!rows.length && <tr><td colSpan={3}><p className="muted">No moderation actions recorded yet.</p></td></tr>}
        </tbody>
      </table></div>
      <Pager page={page} pages={pages} setPage={setPage} />
    </section>
  );
}

/* ---------------- Leads ---------------- */

const leadSources = ['referral', 'feedback', 'creator'];
const leadStatuses = ['new', 'contacted', 'converted', 'closed'];

function LeadsTable({ data, busy, onMutate }: Pick<Props, 'data' | 'busy' | 'onMutate'>) {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState('All sources');
  const [statusF, setStatusF] = useState('All statuses');
  const [sortKey, setSortKey] = useState<'created' | 'name'>('created');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const items = data.leads || [];

  const rows = useMemo(() => {
    const q = query.toLowerCase();
    const filtered = items.filter((l: Lead) =>
      (source === 'All sources' || l.source === source) &&
      (statusF === 'All statuses' || l.status === statusF) &&
      `${l.name} ${l.email} ${l.details}`.toLowerCase().includes(q));
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => (sortKey === 'name'
      ? a.name.localeCompare(b.name) * dir
      : (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir));
  }, [items, query, source, statusF, sortKey, sortDir]);

  const { page, setPage, pages } = usePager(rows.length);
  const toggle = (key: typeof sortKey) => {
    if (key === sortKey) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir(key === 'name' ? 'asc' : 'desc'); }
  };

  return (
    <section className="adm-card">
      <div className="adm-card-head"><div><h3>Growth leads</h3><p>{rows.length} leads · referrals, feedback and creator interest with a contact pipeline</p></div></div>
      <div className="adm-tools">
        <span className="adm-search"><Search size={15} /><input placeholder="Search name, email, details" value={query} onChange={e => setQuery(e.target.value)} aria-label="Search leads" /></span>
        <select value={source} onChange={e => setSource(e.target.value)} aria-label="Filter by source">{['All sources', ...leadSources].map(s => <option key={s}>{s}</option>)}</select>
        <select value={statusF} onChange={e => setStatusF(e.target.value)} aria-label="Filter by status">{['All statuses', ...leadStatuses].map(s => <option key={s}>{s}</option>)}</select>
      </div>
      <div className="adm-table-wrap"><table className="adm-table">
        <thead><tr>
          <th><SortHead label="Lead" active={sortKey === 'name'} dir={sortDir} onClick={() => toggle('name')} /></th>
          <th>Source</th><th>Status</th>
          <th><SortHead label="Captured" active={sortKey === 'created'} dir={sortDir} onClick={() => toggle('created')} /></th>
          <th>Actions</th>
        </tr></thead>
        <tbody>
          {rows.slice(page * perPage, page * perPage + perPage).map(l => (
            <tr key={l.id}>
              <td><strong>{l.name || 'Unnamed'}</strong><span className="adm-sub">{l.email || 'No email'}</span><span className="adm-sub">{l.details.slice(0, 120)}{l.details.length > 120 ? '…' : ''}</span></td>
              <td><span className="adm-pill">{l.source}</span></td>
              <td>
                <select value={l.status} disabled={busy} onChange={e => void onMutate({ action: 'updateLead', id: l.id, status: e.target.value }, 'Lead status updated.')} aria-label={`Status for ${l.name || l.id}`}>
                  {leadStatuses.map(s => <option key={s}>{s}</option>)}
                </select>
              </td>
              <td>{new Date(l.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
              <td><Confirm label={<span className="adm-del"><Trash2 size={14} />Delete</span>} busy={busy} onConfirm={() => void onMutate({ action: 'deleteLead', id: l.id }, 'Lead deleted.')} /></td>
            </tr>
          ))}
          {!rows.length && <tr><td colSpan={5}><p className="muted">No leads yet. Share an invite link or submit feedback to create one.</p></td></tr>}
        </tbody>
      </table></div>
      <Pager page={page} pages={pages} setPage={setPage} />
    </section>
  );
}

export function AdminOps(props: Props) {
  if (props.tab === 'users') return <UsersTable data={props.data} busy={props.busy} city={props.city} onMutate={props.onMutate} />;
  if (props.tab === 'leads') return <LeadsTable data={props.data} busy={props.busy} onMutate={props.onMutate} />;
  if (props.tab === 'spaces') return <SpacesTable data={props.data} busy={props.busy} adminId={props.adminId} city={props.city} onMutate={props.onMutate} />;
  if (props.tab === 'reports') return <ReportsTable data={props.data} busy={props.busy} onMutate={props.onMutate} />;
  return <AuditTable data={props.data} />;
}
