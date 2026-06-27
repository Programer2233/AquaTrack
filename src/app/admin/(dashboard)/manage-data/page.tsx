'use client';

import { useState, useEffect } from 'react';
import { Edit2, Trash2, CheckCircle2, XCircle, Search, Filter } from 'lucide-react';

interface Area { id: string; name: string; region: string; }
interface Record { 
  id: string; 
  areaId: string; 
  areaName: string; 
  households: number; 
  volumeUsed: number; 
  month: string; 
  year: number; 
}

export default function ManageDataPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Record>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/records').then(r => r.json()),
      fetch('/api/areas').then(r => r.json())
    ]).then(([recs, ars]) => {
      setRecords(recs);
      setAreas(ars);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    const res = await fetch(`/api/records/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setRecords(records.filter(r => r.id !== id));
      setMessage({ type: 'success', text: 'Record deleted successfully.' });
    } else {
      setMessage({ type: 'error', text: 'Failed to delete record.' });
    }
  };

  const startEdit = (record: Record) => {
    setEditingId(record.id);
    setEditForm(record);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    const res = await fetch(`/api/records/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...editForm,
        households: parseInt(editForm.households as any),
        volumeUsed: parseFloat(editForm.volumeUsed as any),
        year: parseInt(editForm.year as any)
      }),
    });

    if (res.ok) {
      const updated = await res.json();
      setRecords(records.map(r => r.id === editingId ? updated : r));
      setEditingId(null);
      setMessage({ type: 'success', text: 'Record updated successfully.' });
    } else {
      setMessage({ type: 'error', text: 'Failed to update record.' });
    }
  };

  const filteredRecords = records.filter(r => 
    r.areaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.month.toLowerCase().includes(searchTerm.toLowerCase())
  ).reverse();

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading records...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Manage Water Data</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Review, edit, or remove water usage logs</p>
        </div>
        <div style={{ position: 'relative', width: 300 }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            className="form-input" 
            style={{ paddingLeft: '2.5rem' }} 
            placeholder="Search by area or month..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          {message.text}
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Area</th>
              <th>Month</th>
              <th>Year</th>
              <th>Households</th>
              <th>Volume (L)</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map(r => (
              <tr key={r.id}>
                {editingId === r.id ? (
                  <>
                    <td>
                      <select 
                        className="form-select" 
                        style={{ padding: '0.4rem', fontSize: '0.85rem' }}
                        value={editForm.areaId} 
                        onChange={e => {
                          const area = areas.find(a => a.id === e.target.value);
                          setEditForm({ ...editForm, areaId: e.target.value, areaName: area?.name });
                        }}
                      >
                        {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
                    </td>
                    <td>
                      <select 
                        className="form-select" 
                        style={{ padding: '0.4rem', fontSize: '0.85rem' }}
                        value={editForm.month} 
                        onChange={e => setEditForm({ ...editForm, month: e.target.value })}
                      >
                        {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </td>
                    <td>
                      <input 
                        className="form-input" 
                        style={{ padding: '0.4rem', fontSize: '0.85rem', width: 80 }}
                        type="number" 
                        value={editForm.year} 
                        onChange={e => setEditForm({ ...editForm, year: parseInt(e.target.value) })} 
                      />
                    </td>
                    <td>
                      <input 
                        className="form-input" 
                        style={{ padding: '0.4rem', fontSize: '0.85rem', width: 100 }}
                        type="number" 
                        value={editForm.households} 
                        onChange={e => setEditForm({ ...editForm, households: parseInt(e.target.value) })} 
                      />
                    </td>
                    <td>
                      <input 
                        className="form-input" 
                        style={{ padding: '0.4rem', fontSize: '0.85rem', width: 120 }}
                        type="number" 
                        value={editForm.volumeUsed} 
                        onChange={e => setEditForm({ ...editForm, volumeUsed: parseFloat(e.target.value) })} 
                      />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button className="btn btn-sm btn-primary" onClick={handleUpdate}>Save</button>
                        <button className="btn btn-sm btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ fontWeight: 600 }}>{r.areaName}</td>
                    <td>{r.month}</td>
                    <td>{r.year}</td>
                    <td>{r.households.toLocaleString()}</td>
                    <td style={{ color: r.volumeUsed > 60000 ? 'var(--danger)' : 'inherit' }}>
                      {r.volumeUsed.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => startEdit(r)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(r.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
