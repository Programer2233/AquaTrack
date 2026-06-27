'use client';
import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface Plumber { id: string; name: string; email: string; phone: string; license: string; services: string; areas: string; experience: number; bio: string; status: string; createdAt: string; }

export default function PlumberApprovalsPage() {
  const [plumbers, setPlumbers] = useState<Plumber[]>([]);
  const load = () => fetch('/api/plumbers').then(r => r.json()).then(setPlumbers);
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/plumbers/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    load();
  };

  const pending = plumbers.filter(p => p.status === 'pending');
  const approved = plumbers.filter(p => p.status === 'approved');

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Plumber Approvals</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Review and approve plumber applications</p>

      {pending.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} color="#f59e0b" /> Pending Applications ({pending.length})
          </h3>
          {pending.map(p => (
            <div key={p.id} className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{p.name}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p.email} • {p.phone} • License: {p.license}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Services: {p.services}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Areas: {p.areas} • {p.experience} years exp.</p>
                  {p.bio && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontStyle: 'italic' }}>&quot;{p.bio}&quot;</p>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <button className="btn btn-accent btn-sm" onClick={() => updateStatus(p.id, 'approved')}><CheckCircle2 size={16} /> Approve</button>
                  <button className="btn btn-danger btn-sm" onClick={() => updateStatus(p.id, 'rejected')}><XCircle size={16} /> Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Approved Plumbers ({approved.length})</h3>
      <div className="card" style={{ padding: '1.5rem' }}>
        <table className="data-table">
          <thead><tr><th>Name</th><th>License</th><th>Areas</th><th>Experience</th></tr></thead>
          <tbody>
            {approved.map(p => (
              <tr key={p.id}><td>{p.name}</td><td>{p.license}</td><td>{p.areas}</td><td>{p.experience} yrs</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
