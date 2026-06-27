'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Wrench, Search, Phone, Mail, MapPin, Star, Clock,
  ArrowRight, Filter, CheckCircle2, Droplets
} from 'lucide-react';
import Link from 'next/link';

interface Plumber {
  id: string;
  name: string;
  email: string;
  phone: string;
  license: string;
  services: string;
  areas: string;
  experience: number;
  bio: string;
  status: string;
}

export default function PlumbersPage() {
  const [plumbers, setPlumbers] = useState<Plumber[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/plumbers?status=approved')
      .then(res => res.json())
      .then(data => { setPlumbers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = plumbers.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.services.toLowerCase().includes(search.toLowerCase()) ||
    p.areas.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content">
      <section className="hero" style={{ padding: '6rem 2rem 4rem' }}>
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Wrench size={48} color="#f59e0b" style={{ marginBottom: '1rem', filter: 'drop-shadow(0 0 15px rgba(245,158,11,0.4))' }} />
          <h1>Find a Certified <span className="gradient-text">Plumber</span></h1>
          <p>Connect with government-approved plumbing professionals in your area.</p>
        </motion.div>
      </section>

      <section style={{ padding: '3rem 2rem 5rem' }}>
        <div className="container">
          {/* Search */}
          <motion.div
            style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div style={{ flex: 1, minWidth: 280, position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="form-input"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="Search by name, service, or area..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Link href="/plumbers/apply" className="btn btn-accent">
              <Wrench size={16} /> Apply as Plumber
            </Link>
          </motion.div>

          {/* Results */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <Droplets size={40} color="var(--primary)" />
              </motion.div>
              <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Loading plumbers...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <Filter size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-muted)' }}>No plumbers found matching your search.</p>
            </div>
          ) : (
            <div className="grid-2">
              {filtered.map((plumber, i) => (
                <motion.div
                  key={plumber.id}
                  className="card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                        {plumber.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle2 size={14} color="#06d6a0" />
                        <span style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>Verified Professional</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={14} color="var(--text-muted)" />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{plumber.experience} yrs</span>
                    </div>
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7 }}>
                    {plumber.bio}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    {plumber.services.split(', ').map((s, j) => (
                      <span key={j} className="badge badge-info">{s}</span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                      <MapPin size={14} /> {plumber.areas}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                      <Mail size={14} /> {plumber.email}
                    </div>
                  </div>

                  <a
                    href={`tel:${plumber.phone}`}
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <Phone size={16} /> Call {plumber.phone}
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2026 AquaTrack. Built for a sustainable future. 💧</p>
      </footer>
    </div>
  );
}
