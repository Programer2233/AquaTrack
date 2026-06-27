'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Droplets, BarChart3, Wrench, Leaf, AlertTriangle,
  ArrowRight, Shield, ChevronDown
} from 'lucide-react';
import WaterMap from '@/components/WaterMap';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export default function HomePage() {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const bottlesY = useTransform(scrollYProgress, [0, 0.5], [0, 150]);
  const bottlesScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.7]);
  const bottlesRotate = useTransform(scrollYProgress, [0, 0.5], [0, 15]);
  const bottlesX = useTransform(scrollYProgress, [0, 0.5], [0, 200]);

  const addRipple = (e: React.MouseEvent) => {
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 1000);
  };

  const features = [
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      description: 'Government officials track and visualize water usage data across districts with interactive charts and dashboards.',
      details: 'Our platform uses real-time sensors and historical data to predict water demand, identify anomalies, and optimize distribution networks. Decision-makers can access granular reports to ensure equitable water access.'
    },
    {
      icon: Leaf,
      title: 'Conservation Hub',
      description: 'Interactive educational content that empowers citizens to adopt water-saving habits through engaging animations.',
      details: 'Access a library of curated resources, from DIY leak repair guides to seasonal gardening tips. Participate in community challenges and earn recognition for your conservation efforts.'
    },
    {
      icon: Wrench,
      title: 'Plumber Network',
      description: 'Find certified, government-approved plumbers in your area or apply to join our trusted professional network.',
      details: 'Connect with verified professionals who are trained in water-efficient technologies. Our rating system ensures quality service while supporting local livelihoods.'
    },
    {
      icon: AlertTriangle,
      title: 'Leak Reporting',
      description: 'Citizens can instantly report water leaks directly to authorities, enabling rapid response to water waste.',
      details: 'Upload photos and GPS coordinates of leaks. Track the status of your report in real-time as maintenance teams are dispatched. Every report helps save thousands of liters.'
    }
  ];

  const infoSections = [
    {
      title: "Why AquaTrack?",
      content: "AquaTrack is more than just a monitoring tool; it's a movement towards a sustainable future. By bridging the gap between data and action, we empower every stakeholder to be a guardian of our most precious resource."
    },
    {
      title: "How It Works",
      content: "Using state-of-the-art IoT sensors and community-driven reporting, AquaTrack provides a comprehensive map of water usage and health. Our AI-driven insights help reduce waste by up to 30% through predictive maintenance and personalized saving tips."
    },
    {
      title: "Our Impact",
      content: "Since our launch, we have helped cities track over 2 billion liters of water, identified 500+ major leaks, and connected 1,000+ certified plumbers with residents. Together, we've reduced urban water waste by 18%."
    }
  ];

  return (
    <div ref={containerRef} className="page-content ripple-container" onClick={addRipple}>
      {/* Ripple Effect Layer */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '100px',
            height: '100px',
            marginTop: '-50px',
            marginLeft: '-50px',
          }}
        />
      ))}

      {/* Hero Section */}
      <section className="hero">
        <div className="clouds" />
        
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4rem', textAlign: 'left', position: 'relative', height: '100%' }}>
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            style={{ flex: 1 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-light)', fontWeight: 700, letterSpacing: '2px', fontSize: '0.8rem', textTransform: 'uppercase' }}
            >
              <Droplets size={16} />
              The Future of Hydration
            </motion.div>

            <h1>
              AquaTrack <br />
              <span className="gradient-text">Pure & Perfect</span>
            </h1>
            <p>
              Experience the next generation of water management. Smart, sustainable, and designed for a better tomorrow.
            </p>

            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <Link href="/conservation" className="btn btn-primary">
                Get Started
                <ArrowRight size={20} />
              </Link>
              <Link href="/admin/login" className="btn btn-secondary" style={{ color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
                Government Portal
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="hero-image"
            style={{ 
              position: 'fixed', 
              right: '10%', 
              top: '25%', 
              zIndex: 6, 
              width: 500,
              height: 500,
              y: bottlesY,
              scale: bottlesScale,
              rotate: bottlesRotate,
              x: bottlesX,
              pointerEvents: 'none',
              mixBlendMode: 'screen'
            }}
          >
            <Image 
              src="/bottles-screen.png" 
              alt="AquaTrack Smart Bottles" 
              width={500} 
              height={500} 
              priority
              style={{ filter: 'drop-shadow(0 0 30px rgba(0,114,206,0.3))' }}
            />
          </motion.div>
        </div>
      </section>

      {/* Interactive Informational Section */}
      <section style={{ padding: '8rem 2rem', background: 'var(--bg-secondary)', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <motion.div
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontSize: '3rem', fontWeight: 900 }}>Sustainability <span className="gradient-text">Unfolded</span></h2>
            <p>Click below to discover how we're transforming water conservation through technology.</p>
          </motion.div>

          <div className="accordion">
            {infoSections.map((section, i) => (
              <div 
                key={i} 
                className={`accordion-item ${activeIndex === i ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(activeIndex === i ? null : i);
                }}
              >
                <div className="accordion-header">
                  <h3>{section.title}</h3>
                  <ChevronDown className="accordion-icon" size={24} />
                </div>
                <AnimatePresence>
                  {activeIndex === i && (
                    <motion.div
                      className="accordion-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8 }}>
                        {section.content}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Water Map Section */}
      <section style={{ padding: '8rem 2rem', background: 'var(--bg-primary)', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <motion.div
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontSize: '3rem', fontWeight: 900 }}>Community <span className="gradient-text">Water Map</span></h2>
            <p>Real-time insights into water consumption across Addis Ababa. Helping communities stay informed and sustainable.</p>
          </motion.div>

          <WaterMap />
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '6rem 2rem', background: 'var(--bg-secondary)', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <motion.div
            className="grid-2"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, i) => (
              <motion.div key={i} className="card card-gradient" variants={fadeInUp} style={{ padding: '3rem' }}>
                <div style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'var(--primary-glow)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  color: 'var(--primary-light)'
                }}>
                  <feature.icon size={30} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  {feature.description}
                </p>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                  {feature.details}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border)', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <p style={{ letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700 }}>
            &copy; 2026 AquaTrack. Engineered for Sustainability.
          </p>
        </div>
      </footer>
    </div>
  );
}
