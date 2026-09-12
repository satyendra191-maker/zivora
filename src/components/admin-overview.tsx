'use client';

import { useMemo } from 'react';
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { ArrowDownRight, ArrowUpRight, CalendarDays, Flag, MessageCircle, UserPlus, Users } from 'lucide-react';
import type { AppData } from '@/lib/types';
import type { AdminStats, DayPoint } from './admin-dashboard';

type Props = {
  data: AppData; stats: AdminStats | null; statsError: string;
  days: number; city: string; dark: boolean;
};

type DailyRow = { label: string; members: number; messages: number; joins: number };

function inCity(points: DayPoint[], city: string) {
  return city === 'All cities' ? points : points.filter(p => p.city === city);
}

function buildDaily(stats: AdminStats, days: number, city: string): DailyRow[] {
  const rows: DailyRow[] = [];
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const sumFor = (points: DayPoint[], key: string) =>
    inCity(points, city).filter(p => p.day === key).reduce((acc, p) => acc + p.n, 0);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    // DB day buckets are UTC dates; compare against a UTC key to avoid timezone drift.
    const utcKey = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().slice(0, 10);
    rows.push({
      label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      members: sumFor(stats.signups, utcKey),
      messages: sumFor(stats.messages, utcKey),
      joins: sumFor(stats.joins, utcKey),
    });
  }
  return rows;
}

function trend(values: number[]): number | null {
  if (values.length < 2) return null;
  const half = Math.max(1, Math.floor(values.length / 2));
  const prev = values.slice(0, half).reduce((a, b) => a + b, 0);
  const curr = values.slice(half).reduce((a, b) => a + b, 0);
  if (prev === 0) return curr > 0 ? 100 : null;
  return Math.round(((curr - prev) / prev) * 100);
}

function Kpi({ icon: Icon, label, value, delta, suffix }: { icon: typeof Users; label: string; value: string; delta: number | null; suffix?: string }) {
  const up = (delta ?? 0) >= 0;
  return (
    <div className="adm-card adm-kpi">
      <span className="adm-kpi-icon"><Icon size={20} /></span>
      <div><span className="adm-kpi-label">{label}</span><strong>{value}</strong></div>
      {delta === null
        ? <span className="adm-pill">{suffix || 'new in range'}</span>
        : <span className={`adm-trend ${up ? 'up' : 'down'}`}>{up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{Math.abs(delta)}%</span>}
    </div>
  );
}

const donutColors = ['#e8a13d', '#7950c9', '#488d72', '#918c9b'];

export function AdminOverview({ data, stats, statsError, days, city, dark }: Props) {
  const rows = useMemo(() => (stats ? buildDaily(stats, days, city) : []), [stats, days, city]);
  const members = rows.map(r => r.members);
  const messages = rows.map(r => r.messages);
  const joins = rows.map(r => r.joins);

  const openReports = data.reports.filter(r => r.status === 'open');
  const donut = useMemo(() => {
    const counts = new Map<string, number>();
    data.reports.forEach(r => counts.set(r.status, (counts.get(r.status) || 0) + 1));
    const out = [...counts.entries()].map(([name, value]) => ({ name, value }));
    return out.length ? out : [{ name: 'No reports', value: 1 }];
  }, [data.reports]);

  const tip = {
    contentStyle: {
      background: dark ? '#221c33' : '#fff',
      border: `1px solid ${dark ? '#3d3354' : '#eae7ef'}`,
      borderRadius: 8,
      color: dark ? '#f0ebf7' : '#282432',
      fontSize: 12,
    },
  };
  const axis = { fontSize: 11, stroke: dark ? '#9a8ea5' : '#918c9b' };
  const grid = dark ? '#332a47' : '#eae7ef';

  if (statsError) return <div className="adm-card"><p>{statsError}</p></div>;
  if (!stats) return <div className="adm-card"><p>Loading analytics…</p></div>;

  const scoped = city === 'All cities' ? 'all cities' : city;
  const empty = rows.every(r => r.members + r.messages + r.joins === 0);

  return (
    <div className="adm-overview">
      <div className="adm-kpis">
        <Kpi icon={UserPlus} label={`New members · ${scoped}`} value={members.reduce((a, b) => a + b, 0).toLocaleString('en-IN')} delta={trend(members)} />
        <Kpi icon={MessageCircle} label={`Messages sent · ${scoped}`} value={messages.reduce((a, b) => a + b, 0).toLocaleString('en-IN')} delta={trend(messages)} />
        <Kpi icon={CalendarDays} label={`Community joins · ${scoped}`} value={joins.reduce((a, b) => a + b, 0).toLocaleString('en-IN')} delta={trend(joins)} />
        <Kpi icon={Flag} label="Open reports" value={openReports.length.toLocaleString('en-IN')} delta={null} suffix={`of ${data.reports.length} total`} />
      </div>
      {empty && <div className="adm-card"><p className="muted">No activity in this range yet. Charts below reflect live database contents — invite members or widen the range.</p></div>}
      <div className="adm-grid">
        <section className="adm-card adm-span2">
          <div className="adm-card-head"><div><h3>Growth & conversation</h3><p>Daily signups vs messages · {scoped}</p></div></div>
          <div className="adm-chart">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
                <CartesianGrid stroke={grid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={axis} tickLine={false} axisLine={{ stroke: grid }} interval="preserveStartEnd" minTickGap={40} />
                <YAxis tick={axis} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip {...tip} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="members" name="New members" stroke="#7950c9" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="messages" name="Messages" stroke="#488d72" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="adm-card">
          <div className="adm-card-head"><div><h3>Reports by status</h3><p>Live moderation queue</p></div></div>
          <div className="adm-chart">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={donut} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={3} strokeWidth={0}>
                  {donut.map((entry, i) => <Cell key={entry.name} fill={donutColors[i % donutColors.length]} />)}
                </Pie>
                <Tooltip {...tip} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="adm-card adm-span2">
          <div className="adm-card-head"><div><h3>Community joins</h3><p>Daily joins · {scoped}</p></div></div>
          <div className="adm-chart">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
                <CartesianGrid stroke={grid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={axis} tickLine={false} axisLine={{ stroke: grid }} interval="preserveStartEnd" minTickGap={40} />
                <YAxis tick={axis} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip {...tip} cursor={{ fill: dark ? '#ffffff10' : '#7950c910' }} />
                <Bar dataKey="joins" name="Joins" fill="#7950c9" radius={[5, 5, 0, 0]} maxBarSize={26} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="adm-card">
          <div className="adm-card-head"><div><h3>Members by city</h3><p>All-time distribution</p></div></div>
          <ul className="adm-bars">
            {(stats.userCities.slice(0, 6)).map(c => {
              const max = stats.userCities[0]?.n || 1;
              return (
                <li key={c.city}>
                  <div><strong>{c.city}</strong><span>{c.n.toLocaleString('en-IN')}</span></div>
                  <div className="adm-track"><span style={{ width: `${Math.max(4, Math.round((c.n / max) * 100))}%` }} /></div>
                </li>
              );
            })}
            {!stats.userCities.length && <li><p className="muted">No members yet.</p></li>}
          </ul>
        </section>
      </div>
    </div>
  );
}
