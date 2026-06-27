'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Calculator, Droplets, ShowerHead, Home, Utensils, Flower2,
  Car, RotateCcw, TrendingDown, ArrowRight
} from 'lucide-react';

const categories = [
  {
    icon: ShowerHead, label: 'Shower', key: 'shower',
    question: 'How many minutes do you shower per day?',
    unit: 'minutes', factor: 10, // 10 liters per minute
  },
  {
    icon: Droplets, label: 'Toilet', key: 'toilet',
    question: 'How many times do you flush per day?',
    unit: 'flushes', factor: 9, // 9 liters per flush
  },
  {
    icon: Utensils, label: 'Dishes', key: 'dishes',
    question: 'How many minutes do you run water for dishes per day?',
    unit: 'minutes', factor: 8,
  },
  {
    icon: Home, label: 'Laundry', key: 'laundry',
    question: 'How many laundry loads per week?',
    unit: 'loads/week', factor: 70 / 7, // 70 liters per load, divided to daily
  },
  {
    icon: Flower2, label: 'Garden', key: 'garden',
    question: 'How many minutes do you water your garden per day?',
    unit: 'minutes', factor: 12,
  },
  {
    icon: Car, label: 'Car Wash', key: 'car',
    question: 'How many car washes per month?',
    unit: 'washes/month', factor: 150 / 30, // 150 liters per wash, daily
  },
];

export default function CalculatorPage() {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(categories.map(c => [c.key, 0]))
  );
  const [calculated, setCalculated] = useState(false);

  const updateValue = (key: string, val: number) => {
    setValues(prev => ({ ...prev, [key]: Math.max(0, val) }));
  };

  const dailyTotal = categories.reduce((sum, cat) => sum + values[cat.key] * cat.factor, 0);
  const monthlyTotal = dailyTotal * 30;
  const yearlyTotal = dailyTotal * 365;
  const avgDaily = 150; // average daily per person
  const comparison = dailyTotal - avgDaily;

  return (
    <div className="page-content">
      <section className="hero" style={{ padding: '6rem 2rem 4rem' }}>
        <motion.div className="hero-content" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
          <Calculator size={48} color="#8b5cf6" style={{ marginBottom: '1rem', filter: 'drop-shadow(0 0 15px rgba(139,92,246,0.4))' }} />
          <h1>Water Footprint <span className="gradient-text">Calculator</span></h1>
          <p>Estimate your daily water usage and discover how you compare to the average household.</p>
        </motion.div>
      </section>

      <section style={{ padding: '3rem 2rem 5rem' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="grid-2" style={{ gap: '2rem' }}>
            {/* Input Section */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.key}
                  className="card"
                  style={{ marginBottom: '1rem', padding: '1.25rem' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                      background: 'rgba(139,92,246,0.1)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <cat.icon size={18} color="#8b5cf6" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cat.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cat.question}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="range"
                      min="0"
                      max={cat.key === 'car' ? 10 : cat.key === 'laundry' ? 14 : 30}
                      value={values[cat.key]}
                      onChange={e => updateValue(cat.key, parseInt(e.target.value))}
                      style={{ flex: 1, accentColor: '#8b5cf6' }}
                    />
                    <span style={{
                      minWidth: 70, textAlign: 'right', fontWeight: 700,
                      color: 'var(--primary-light)', fontSize: '0.9rem',
                    }}>
                      {values[cat.key]} {cat.unit}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    ≈ {Math.round(values[cat.key] * cat.factor)} liters/day
                  </div>
                </motion.div>
              ))}

              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setCalculated(true)}
              >
                Calculate My Footprint <ArrowRight size={18} />
              </button>
            </motion.div>

            {/* Results Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              style={{ position: 'sticky', top: 90, alignSelf: 'flex-start' }}
            >
              <div className="card" style={{ padding: '2rem', textAlign: 'center', marginBottom: '1rem' }}>
                <Droplets size={32} color="#0ea5e9" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Your Daily Usage</div>
                <motion.div
                  style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary-light)' }}
                  key={dailyTotal}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                >
                  {Math.round(dailyTotal)}L
                </motion.div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>liters per day</div>
              </div>

              {calculated && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="grid-2" style={{ marginBottom: '1rem' }}>
                    <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>
                        {Math.round(monthlyTotal).toLocaleString()}L
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Monthly</div>
                    </div>
                    <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>
                        {Math.round(yearlyTotal).toLocaleString()}L
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Yearly</div>
                    </div>
                  </div>

                  <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <TrendingDown size={18} color={comparison > 0 ? '#ef4444' : '#06d6a0'} />
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>vs. Average ({avgDaily}L/day)</span>
                    </div>
                    <div style={{
                      fontSize: '1.25rem', fontWeight: 800,
                      color: comparison > 0 ? '#ef4444' : '#06d6a0',
                      marginBottom: '0.5rem',
                    }}>
                      {comparison > 0 ? `+${Math.round(comparison)}L above` : `${Math.round(Math.abs(comparison))}L below`} average
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {comparison > 0
                        ? 'Consider adopting some water-saving habits from our Conservation Hub to reduce your footprint.'
                        : 'Great job! You\'re using less water than the average person. Keep up the good work!'}
                    </p>
                  </div>

                  <button
                    className="btn btn-secondary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                    onClick={() => { setCalculated(false); setValues(Object.fromEntries(categories.map(c => [c.key, 0]))); }}
                  >
                    <RotateCcw size={16} /> Reset Calculator
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2026 AquaTrack. Built for a sustainable future. 💧</p>
      </footer>
    </div>
  );
}
