'use client';
import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

interface LeakReport { id: string; location: string; description: string; severity: string; reporterName: string; reporterPhone: string; status: string; createdAt: string; }

const severityColors: Record<string, string> = { low: '#06d6a0', medium: '#f59e0b', high: '#f97316', critical: '#ef4444' };
const statusColors: Record<string, string> = { open: 'badge-danger', 'in-progress': 'badge-warning', resolved: 'badge-success' };

export default function LeakReportsPage() {
  const [reports, setReports] = useState<LeakReport[]>([]);
  const load = () => fetch('/api/leak-reports').then(r => r.json()).then(setReports);
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/leak-reports/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    load();
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Leak Reports</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Citizen-reported water leaks</p>

      {reports.map(r => (
        <div key={r.id} className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <span className={`badge ${statusColors[r.status] || 'badge-info'}`}>{r.status}</span>
                <span className="badge" style={{ background: `${severityColors[r.severity]}20`, color: severityColors[r.severity] }}>{r.severity}</span>
              </div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={16} color={severityColors[r.severity]} /> {r.location}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{r.description}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Reported by {r.reporterName} ({r.reporterPhone}) on {r.createdAt}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              {r.status === 'open' && <button className="btn btn-primary btn-sm" onClick={() => updateStatus(r.id, 'in-progress')}>In Progress</button>}
              {r.status === 'in-progress' && <button className="btn btn-accent btn-sm" onClick={() => updateStatus(r.id, 'resolved')}>Resolve</button>}
              {r.status === 'resolved' && <span style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>✓ Resolved</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
