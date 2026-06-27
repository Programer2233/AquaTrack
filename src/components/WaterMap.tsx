'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Info, Droplets, AlertCircle } from 'lucide-react';

interface AreaUsage {
  id: string;
  name: string;
  region: string;
  usage: number;
  households: number;
  level: 'low' | 'medium' | 'high';
  x: number; // SVG coordinates
  y: number;
}

export default function WaterMap() {
  const [areas, setAreas] = useState<AreaUsage[]>([]);
  const [hoveredArea, setHoveredArea] = useState<AreaUsage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [areasRes, recordsRes] = await Promise.all([
          fetch('/api/areas'),
          fetch('/api/records')
        ]);
        
        const areasData = await areasRes.json();
        const recordsData = await recordsRes.json();

        // Coordinates for Addis Ababa districts (relative to 500x500 SVG)
        const coords: Record<string, {x: number, y: number}> = {
          'Bole': { x: 380, y: 300 },
          'Kirkos': { x: 280, y: 280 },
          'Arada': { x: 250, y: 200 },
          'Yeka': { x: 380, y: 150 },
          'Lideta': { x: 180, y: 300 },
          'Gullele': { x: 150, y: 120 },
        };

        const processed = areasData.map((area: any) => {
          const records = recordsData.filter((r: any) => r.areaId === area.id);
          const latestRecord = records.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
          
          const usage = latestRecord?.volumeUsed || 0;
          let level: 'low' | 'medium' | 'high' = 'low';
          if (usage > 60000) level = 'high';
          else if (usage > 35000) level = 'medium';

          return {
            ...area,
            usage,
            households: latestRecord?.households || 0,
            level,
            x: coords[area.region]?.x || Math.random() * 400 + 50,
            y: coords[area.region]?.y || Math.random() * 400 + 50,
          };
        });

        setAreas(processed);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch map data", err);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div style={{ height: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Water Map...</div>;

  return (
    <div className="water-map-container" style={{ position: 'relative', width: '100%', maxWidth: 1000, margin: '0 auto' }}>
      <div className="grid-2" style={{ alignItems: 'center' }}>
        {/* SVG Map Section */}
        <div style={{ position: 'relative' }}>
          <svg viewBox="0 0 500 500" style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 0 20px rgba(0,114,206,0.1))' }}>
            {/* Addis Ababa Base Shape (Stylized) */}
            <path
              d="M250,50 C350,50 450,150 450,250 C450,350 350,450 250,450 C150,450 50,350 50,250 C50,150 150,50 250,50 Z"
              fill="rgba(15, 23, 42, 0.4)"
              stroke="var(--primary-light)"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.3"
            />
            
            {/* Grid lines for tech look */}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 50} x2="500" y2={i * 50} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            ))}

            {/* Area Hotspots */}
            {areas.map((area) => (
              <g 
                key={area.id} 
                onMouseEnter={() => setHoveredArea(area)}
                onMouseLeave={() => setHoveredArea(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Glowing Aura */}
                <motion.circle
                  cx={area.x}
                  cy={area.y}
                  r={hoveredArea?.id === area.id ? 40 : 25}
                  fill={area.level === 'high' ? 'var(--danger)' : area.level === 'medium' ? 'var(--warning)' : 'var(--success)'}
                  opacity="0.2"
                  animate={{
                    r: hoveredArea?.id === area.id ? [40, 50, 40] : [25, 30, 25],
                    opacity: hoveredArea?.id === area.id ? 0.4 : 0.2
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
                
                {/* Center Point */}
                <circle
                  cx={area.x}
                  cy={area.y}
                  r={8}
                  fill={area.level === 'high' ? 'var(--danger)' : area.level === 'medium' ? 'var(--warning)' : 'var(--success)'}
                  stroke="white"
                  strokeWidth="2"
                />

                {/* Pulse Effect for High Usage */}
                {area.level === 'high' && (
                  <motion.circle
                    cx={area.x}
                    cy={area.y}
                    r={8}
                    stroke="var(--danger)"
                    strokeWidth="2"
                    fill="none"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 4, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                )}

                {/* Area Label */}
                <text
                  x={area.x}
                  y={area.y - 15}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="700"
                  style={{ pointerEvents: 'none', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                >
                  {area.name}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Info Panel Section */}
        <div style={{ padding: '2rem' }}>
          <AnimatePresence mode="wait">
            {hoveredArea ? (
              <motion.div
                key={hoveredArea.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="card card-gradient"
                style={{ border: `1px solid ${hoveredArea.level === 'high' ? 'var(--danger)' : 'var(--primary-light)'}` }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%', 
                    background: hoveredArea.level === 'high' ? 'rgba(239,68,68,0.2)' : 'rgba(0,114,206,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: hoveredArea.level === 'high' ? 'var(--danger)' : 'var(--primary-light)'
                  }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{hoveredArea.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{hoveredArea.region} District, Addis Ababa</p>
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Monthly Usage</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: hoveredArea.level === 'high' ? 'var(--danger)' : 'white' }}>
                      {hoveredArea.usage.toLocaleString()} L
                    </p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Households</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{hoveredArea.households}</p>
                  </div>
                </div>

                <div style={{ 
                  padding: '1rem', 
                  borderRadius: 'var(--radius-md)', 
                  background: hoveredArea.level === 'high' ? 'rgba(239,68,68,0.1)' : 'rgba(0,230,118,0.1)',
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'flex-start'
                }}>
                  {hoveredArea.level === 'high' ? <AlertCircle size={20} color="var(--danger)" /> : <Info size={20} color="var(--success)" />}
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
                    {hoveredArea.level === 'high' 
                      ? "Critical: Water usage in this area exceeds municipal sustainability limits. Immediate conservation measures recommended."
                      : "Optimized: Water usage in this area is within the sustainable range. Keep up the great conservation efforts!"}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: 'center', color: 'var(--text-muted)' }}
              >
                <Droplets size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                <h3>Hover over the map</h3>
                <p>Explore real-time water usage across Addis Ababa's communities.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
