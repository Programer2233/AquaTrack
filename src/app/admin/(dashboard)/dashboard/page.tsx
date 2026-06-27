'use client';

import { useEffect, useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Droplets, TrendingDown, Users, MapPin, AlertTriangle } from 'lucide-react';

interface Record { id: string; areaId: string; areaName: string; households: number; volumeUsed: number; month: string; year: number; }
interface LeakReport { id: string; status: string; severity: string; }

const COLORS = ['#0ea5e9', '#06d6a0', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function DashboardPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [leaks, setLeaks] = useState<LeakReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/records').then(r => r.json()),
      fetch('/api/leak-reports').then(r => r.json()),
    ]).then(([recs, lks]) => {
      setRecords(recs); setLeaks(lks); setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const totalVol = records.reduce((s, r) => s + r.volumeUsed, 0);
    const totalHH = new Set(records.map(r => r.areaId)).size;
    const latestMonth = records.filter(r => r.month === 'March');
    const prevMonth = records.filter(r => r.month === 'February');
    const latestTotal = latestMonth.reduce((s, r) => s + r.volumeUsed, 0);
    const prevTotal = prevMonth.reduce((s, r) => s + r.volumeUsed, 0);
    const change = prevTotal > 0 ? ((latestTotal - prevTotal) / prevTotal * 100).toFixed(1) : '0';
    const openLeaks = leaks.filter(l => l.status !== 'resolved').length;
    return { totalVol, totalHH, change: parseFloat(change as string), openLeaks };
  }, [records, leaks]);

  const monthlyTrend = useMemo(() => {
    const months = ['January', 'February', 'March'];
    return months.map(m => {
      const monthRecs = records.filter(r => r.month === m);
      return { month: m.slice(0, 3), volume: monthRecs.reduce((s, r) => s + r.volumeUsed, 0) / 1000 };
    });
  }, [records]);

  const areaComparison = useMemo(() => {
    const areas = [...new Set(records.map(r => r.areaName))];
    return areas.map(a => {
      const areaRecs = records.filter(r => r.areaName === a && r.month === 'March');
      const vol = areaRecs.reduce((s, r) => s + r.volumeUsed, 0);
      return { name: a.length > 12 ? a.slice(0, 12) + '...' : a, volume: vol / 1000 };
    });
  }, [records]);

  const pieData = useMemo(() => {
    const areas = [...new Set(records.map(r => r.areaName))];
    return areas.map(a => {
      const total = records.filter(r => r.areaName === a).reduce((s, r) => s + r.volumeUsed, 0);
      return { name: a, value: total };
    });
  }, [records]);

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading dashboard...</div>;

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Dashboard</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Water usage analytics overview</p>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {[
          { label: 'Total Volume (kL)', value: `${(stats.totalVol / 1000).toFixed(0)}`, icon: Droplets, color: '#0ea5e9' },
          { label: 'Areas Monitored', value: stats.totalHH, icon: MapPin, color: '#06d6a0' },
          { label: 'Monthly Change', value: `${stats.change}%`, icon: TrendingDown, color: stats.change < 0 ? '#06d6a0' : '#ef4444' },
          { label: 'Open Leak Reports', value: stats.openLeaks, icon: AlertTriangle, color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.label}</span>
              <s.icon size={18} color={s.color} />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Monthly Usage Trend (kL)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 8, color: '#f1f5f9' }} />
              <Line type="monotone" dataKey="volume" stroke="#0ea5e9" strokeWidth={3} dot={{ fill: '#0ea5e9', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Area Comparison - March (kL)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={areaComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 8, color: '#f1f5f9' }} />
              <Bar dataKey="volume" radius={[6, 6, 0, 0]}>
                {areaComparison.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-2">
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Usage Distribution by Area</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name }) => name.length > 10 ? name.slice(0, 10) + '..' : name} fontSize={10}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 8, color: '#f1f5f9' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Recent Records</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead><tr><th>Area</th><th>Month</th><th>Volume (L)</th></tr></thead>
              <tbody>
                {records.slice(-6).reverse().map(r => (
                  <tr key={r.id}><td>{r.areaName}</td><td>{r.month}</td><td>{r.volumeUsed.toLocaleString()}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
