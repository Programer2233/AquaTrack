'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  Droplets, ShowerHead, Leaf, Timer, Home, Flower2,
  ChevronDown, CheckCircle2, XCircle, Lightbulb, TrendingDown,
  Waves, CloudRain, ArrowRight, Calculator
} from 'lucide-react';
import Link from 'next/link';

const tips = [
  {
    icon: ShowerHead,
    title: 'Shorter Showers',
    description: 'Reducing your shower by just 2 minutes saves up to 40 liters of water per shower.',
    savedLiters: 40,
    color: '#0ea5e9',
    fact: 'A 10-minute shower uses about 200 liters of water.',
  },
  {
    icon: Droplets,
    title: 'Fix Leaky Faucets',
    description: 'A single dripping tap can waste over 20,000 liters per year. Fix leaks immediately!',
    savedLiters: 55,
    color: '#ef4444',
    fact: 'One drip per second wastes 20,000+ liters annually.',
  },
  {
    icon: Flower2,
    title: 'Water-Wise Gardening',
    description: 'Water plants early morning or late evening to reduce evaporation by up to 60%.',
    savedLiters: 150,
    color: '#06d6a0',
    fact: 'Up to 50% of outdoor water use is wasted due to evaporation.',
  },
  {
    icon: Home,
    title: 'Full Loads Only',
    description: 'Run washing machines and dishwashers only when full. Each half-load wastes 25+ liters.',
    savedLiters: 25,
    color: '#f59e0b',
    fact: 'A washing machine uses 50-100 liters per cycle.',
  },
  {
    icon: Timer,
    title: 'Turn Off the Tap',
    description: 'Don\'t let water run while brushing teeth or washing dishes. Save 12 liters per minute.',
    savedLiters: 12,
    color: '#8b5cf6',
    fact: 'An open tap flows at 6-12 liters per minute.',
  },
  {
    icon: CloudRain,
    title: 'Harvest Rainwater',
    description: 'Collect rainwater for gardening and cleaning. A single storm can fill hundreds of liters.',
    savedLiters: 200,
    color: '#ec4899',
    fact: 'A 100m² roof can collect 1,000 liters in 10mm of rain.',
  },
];

const quizQuestions = [
  {
    question: 'How long is your average shower?',
    options: ['Under 5 minutes', '5-10 minutes', '10-15 minutes', 'Over 15 minutes'],
    scores: [1, 2, 3, 4],
  },
  {
    question: 'How often do you leave the tap running while brushing teeth?',
    options: ['Never', 'Sometimes', 'Usually', 'Always'],
    scores: [1, 2, 3, 4],
  },
  {
    question: 'Do you run full loads in the washing machine?',
    options: ['Always', 'Most of the time', 'Sometimes', 'Rarely'],
    scores: [1, 2, 3, 4],
  },
  {
    question: 'How do you water your garden?',
    options: ['Drip irrigation / Morning only', 'Sprinkler system', 'Hose in the evening', 'Hose anytime'],
    scores: [1, 2, 3, 4],
  },
];

function WaterDropAnimation() {
  return (
    <div style={{ position: 'relative', width: 200, height: 280, margin: '0 auto' }}>
      {/* Faucet */}
      <div style={{
        width: 40, height: 60, background: 'linear-gradient(180deg, #64748b, #475569)',
        borderRadius: '4px 4px 0 0', position: 'absolute', top: 0, left: '50%',
        transform: 'translateX(-50%)', zIndex: 2,
      }} />
      <div style={{
        width: 20, height: 30, background: 'linear-gradient(180deg, #475569, #334155)',
        borderRadius: '0 0 4px 4px', position: 'absolute', top: 60, left: '50%',
        transform: 'translateX(-50%)', zIndex: 2,
      }} />
      {/* Drops */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            top: 90,
            left: '50%',
            width: 12,
            height: 16,
            background: 'linear-gradient(180deg, #38bdf8, #0ea5e9)',
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            transformOrigin: 'center',
          }}
          animate={{
            y: [0, 160],
            opacity: [1, 0.3],
            scale: [1, 0.6],
            x: '-50%',
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.5,
            repeat: Infinity,
            ease: 'easeIn',
          }}
        />
      ))}
      {/* Pool */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 160,
          height: 20,
          background: 'radial-gradient(ellipse, rgba(14,165,233,0.4) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}

function WaterWaveProgress({ percent }: { percent: number }) {
  return (
    <div style={{
      width: 200, height: 200, borderRadius: '50%',
      border: '3px solid var(--border)', position: 'relative',
      overflow: 'hidden', margin: '0 auto',
    }}>
      <motion.div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(180deg, rgba(14,165,233,0.6), rgba(6,214,160,0.8))',
        }}
        initial={{ height: '0%' }}
        whileInView={{ height: `${percent}%` }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: 'easeOut' }}
      />
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', zIndex: 2,
      }}>
        <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{percent}%</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Community Goal</span>
      </div>
    </div>
  );
}

export default function ConservationPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const bgOpacity = useTransform(scrollYProgress, [0, 0.3], [0.3, 0]);

  const [quizStep, setQuizStep] = useState(-1);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [pledgeCount, setPledgeCount] = useState(1247);
  const [hasPledged, setHasPledged] = useState(false);

  const handleQuizAnswer = (score: number) => {
    const newScore = quizScore + score;
    setQuizScore(newScore);
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      setQuizStep(quizQuestions.length);
    }
  };

  const getQuizResult = () => {
    const avg = quizScore / quizQuestions.length;
    if (avg <= 1.5) return { label: 'Water Champion! 🏆', color: '#06d6a0', message: 'You are already an excellent water conservationist. Keep inspiring others!' };
    if (avg <= 2.5) return { label: 'Good Saver 💧', color: '#0ea5e9', message: 'You\'re doing well, but there\'s room for improvement. Check our tips below!' };
    if (avg <= 3.5) return { label: 'Needs Attention ⚠️', color: '#f59e0b', message: 'You\'re using more water than needed. Start with small changes today!' };
    return { label: 'High Usage 🚨', color: '#ef4444', message: 'Your water usage is significantly above average. Every small change helps!' };
  };

  return (
    <div className="page-content" ref={containerRef}>
      {/* Hero */}
      <section className="hero" style={{ padding: '7rem 2rem 5rem', position: 'relative' }}>
        <motion.div style={{ opacity: bgOpacity, position: 'absolute', inset: 0 }}>
          <div className="water-bg">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="drop" style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${2 + Math.random() * 3}s`,
                animationDelay: `${Math.random() * 3}s`,
              }} />
            ))}
          </div>
        </motion.div>

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <WaterDropAnimation />
          <h1 style={{ marginTop: '2rem' }}>
            Every Drop <span className="gradient-text">Matters</span>
          </h1>
          <p>
            Water is our most precious resource. Learn how small daily changes can create
            a massive impact on our planet&apos;s future.
          </p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown size={32} color="var(--text-muted)" />
          </motion.div>
        </motion.div>
      </section>

      {/* Impact Counter */}
      <section style={{ padding: '4rem 2rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <motion.div
            className="section-title"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2>Our Community <span className="gradient-text">Impact</span></h2>
            <p>Together, we are making a difference. Track our collective progress.</p>
          </motion.div>

          <div className="grid-3" style={{ alignItems: 'center' }}>
            <motion.div
              className="card"
              style={{ textAlign: 'center', padding: '2rem' }}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Waves size={40} color="#0ea5e9" style={{ marginBottom: '1rem' }} />
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-light)' }}>
                482K
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Liters Saved This Month
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <WaterWaveProgress percent={72} />
              <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                72% towards our monthly conservation target
              </p>
            </motion.div>

            <motion.div
              className="card"
              style={{ textAlign: 'center', padding: '2rem' }}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <TrendingDown size={40} color="#06d6a0" style={{ marginBottom: '1rem' }} />
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent)' }}>
                18%
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Reduction vs Last Quarter
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Tips */}
      <section style={{ padding: '5rem 2rem' }}>
        <div className="container">
          <motion.div
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Water-Saving <span className="gradient-text">Tips</span></h2>
            <p>Click on each tip to learn more and see how much water you can save.</p>
          </motion.div>

          <div className="grid-3">
            {tips.map((tip, i) => (
              <motion.div
                key={i}
                className="card"
                style={{
                  cursor: 'pointer',
                  border: selectedTip === i ? `1px solid ${tip.color}` : undefined,
                  boxShadow: selectedTip === i ? `0 0 30px ${tip.color}30` : undefined,
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTip(selectedTip === i ? null : i)}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-md)',
                  background: `${tip.color}15`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', marginBottom: '1rem',
                }}>
                  <tip.icon size={24} color={tip.color} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {tip.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                  {tip.description}
                </p>

                <motion.div
                  initial={false}
                  animate={{ height: selectedTip === i ? 'auto' : 0, opacity: selectedTip === i ? 1 : 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{
                    padding: '1rem',
                    background: `${tip.color}08`,
                    borderRadius: 'var(--radius-sm)',
                    borderLeft: `3px solid ${tip.color}`,
                    marginBottom: '0.75rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <Lightbulb size={14} color={tip.color} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: tip.color }}>Did you know?</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{tip.fact}</p>
                  </div>
                </motion.div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Droplets size={16} color={tip.color} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: tip.color }}>
                    Save up to {tip.savedLiters}L/day
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section style={{
        padding: '5rem 2rem',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <motion.div
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>How Water-Wise <span className="gradient-text">Are You?</span></h2>
            <p>Take this quick quiz to find out your water conservation score.</p>
          </motion.div>

          <motion.div
            className="card"
            style={{ padding: '2rem' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {quizStep === -1 && (
              <div style={{ textAlign: 'center' }}>
                <Droplets size={48} color="#0ea5e9" style={{ marginBottom: '1rem' }} />
                <h3 style={{ marginBottom: '0.5rem' }}>Water Habits Quiz</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  4 quick questions to assess your water usage habits
                </p>
                <button className="btn btn-primary" onClick={() => setQuizStep(0)}>
                  Start Quiz <ArrowRight size={16} />
                </button>
              </div>
            )}

            {quizStep >= 0 && quizStep < quizQuestions.length && (
              <motion.div key={quizStep} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', marginBottom: '1rem',
                  fontSize: '0.8rem', color: 'var(--text-muted)'
                }}>
                  <span>Question {quizStep + 1} of {quizQuestions.length}</span>
                  <span>{Math.round(((quizStep) / quizQuestions.length) * 100)}%</span>
                </div>
                <div style={{
                  height: 4, background: 'var(--bg-input)', borderRadius: 2, marginBottom: '1.5rem'
                }}>
                  <motion.div
                    style={{
                      height: '100%', background: 'var(--gradient-accent)', borderRadius: 2,
                    }}
                    initial={{ width: `${(quizStep / quizQuestions.length) * 100}%` }}
                    animate={{ width: `${((quizStep + 1) / quizQuestions.length) * 100}%` }}
                  />
                </div>

                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                  {quizQuestions[quizStep].question}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {quizQuestions[quizStep].options.map((option, i) => (
                    <motion.button
                      key={i}
                      className="btn btn-secondary"
                      style={{ justifyContent: 'flex-start', width: '100%' }}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuizAnswer(quizQuestions[quizStep].scores[i])}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {quizStep === quizQuestions.length && (() => {
              const result = getQuizResult();
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: 'center' }}
                >
                  <div style={{
                    fontSize: '3rem', marginBottom: '0.5rem',
                  }}>
                    {quizScore <= 6 ? <CheckCircle2 size={64} color={result.color} /> : <XCircle size={64} color={result.color} />}
                  </div>
                  <h3 style={{ color: result.color, marginBottom: '0.5rem', fontSize: '1.5rem' }}>
                    {result.label}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    {result.message}
                  </p>
                  <button className="btn btn-secondary" onClick={() => { setQuizStep(-1); setQuizScore(0); }}>
                    Retake Quiz
                  </button>
                </motion.div>
              );
            })()}
          </motion.div>
        </div>
      </section>

      {/* Pledge Section */}
      <section style={{ padding: '5rem 2rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Leaf size={48} color="#06d6a0" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>
              Take the <span className="gradient-text">Water Pledge</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Join <strong style={{ color: 'var(--accent)' }}>{pledgeCount.toLocaleString()}</strong> community members
              who have pledged to conserve water every day.
            </p>

            {!hasPledged ? (
              <motion.button
                className="btn btn-accent btn-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setHasPledged(true); setPledgeCount(prev => prev + 1); }}
              >
                I Pledge to Conserve Water 💧
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring' }}
              >
                <CheckCircle2 size={48} color="#06d6a0" style={{ marginBottom: '0.75rem' }} />
                <p style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '1.1rem' }}>
                  Thank you for your pledge! 🎉
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  You are now part of a movement to protect our water resources.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '4rem 2rem',
        background: 'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(6,214,160,0.05))',
        borderTop: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <div className="container">
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
            Want to know your exact water footprint?
          </h3>
          <Link href="/calculator" className="btn btn-primary btn-lg">
            <Calculator size={20} /> Try Our Water Calculator <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2026 AquaTrack. Built for a sustainable future. 💧</p>
      </footer>
    </div>
  );
}
