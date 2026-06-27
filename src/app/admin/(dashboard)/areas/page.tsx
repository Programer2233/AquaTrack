'use client';
import { useState, useEffect } from 'react';
import { MapPin, PlusCircle, CheckCircle2 } from 'lucide-react';

interface Area { id: string; name: string; region: string; }

export default function AreasPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [success, setSuccess] = useState(false);

  const load = () => fetch('/api/areas').then(r => r.json()).then(setAreas);
  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/areas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, region }) });
    if (res.ok) { setName(''); setRegion(''); setSuccess(true); load(); setTimeout(() => setSuccess(false), 3000); }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Manage Areas</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Add and view monitoring areas</p>

      <div className="grid-2" style={{ alignItems: 'flex-start' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Add New Area</h3>
          {success && <div className="alert alert-success"><CheckCircle2 size={18} /> Area added!</div>}
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label>Area Name *</label>
              <input className="form-input" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Westlands" />
            </div>
            <div className="form-group">
              <label>Region *</label>
              <input className="form-input" required value={region} onChange={e => setRegion(e.target.value)} placeholder="e.g. West" />
            </div>
            <button type="submit" className="btn btn-primary"><PlusCircle size={16} /> Add Area</button>
          </form>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Current Areas ({areas.length})</h3>
          <table className="data-table">
            <thead><tr><th>Name</th><th>Region</th></tr></thead>
            <tbody>
              {areas.map(a => (
                <tr key={a.id}><td><MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />{a.name}</td><td>{a.region}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
