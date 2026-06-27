'use client';
import { useState, useEffect } from 'react';
import { PlusCircle, CheckCircle2 } from 'lucide-react';

interface Area { id: string; name: string; region: string; }

export default function DataEntryPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [form, setForm] = useState({ areaId: '', areaName: '', households: '', volumeUsed: '', month: '', year: '2026' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetch('/api/areas').then(r => r.json()).then(setAreas); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(false);
    const area = areas.find(a => a.id === form.areaId);
    const res = await fetch('/api/records', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, areaName: area?.name || '', households: parseInt(form.households), volumeUsed: parseFloat(form.volumeUsed), year: parseInt(form.year), createdBy: 'admin' }),
    });
    if (res.ok) { setSuccess(true); setForm({ areaId: '', areaName: '', households: '', volumeUsed: '', month: '', year: '2026' }); }
    else setError('Failed to save record.');
  };

  const update = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }));

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Log Water Data</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Enter water usage data for an area</p>

      <div className="card" style={{ maxWidth: 600, padding: '2rem' }}>
        {success && <div className="alert alert-success"><CheckCircle2 size={18} /> Record saved successfully!</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Area *</label>
            <select className="form-select" required value={form.areaId} onChange={e => update('areaId', e.target.value)}>
              <option value="">Select area...</option>
              {areas.map(a => <option key={a.id} value={a.id}>{a.name} ({a.region})</option>)}
            </select>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Month *</label>
              <select className="form-select" required value={form.month} onChange={e => update('month', e.target.value)}>
                <option value="">Select...</option>
                {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Year *</label>
              <input className="form-input" type="number" required value={form.year} onChange={e => update('year', e.target.value)} />
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Number of Households *</label>
              <input className="form-input" type="number" required value={form.households} onChange={e => update('households', e.target.value)} placeholder="e.g. 1250" />
            </div>
            <div className="form-group">
              <label>Volume Used (Liters) *</label>
              <input className="form-input" type="number" required value={form.volumeUsed} onChange={e => update('volumeUsed', e.target.value)} placeholder="e.g. 45000" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
            <PlusCircle size={18} /> Save Record
          </button>
        </form>
      </div>
    </div>
  );
}
