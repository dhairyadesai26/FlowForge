import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  KanbanSquare, ArrowRight, Zap, BarChart2,
  Shield, Layers, Activity, CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../App';
import './LandingPage.css';

const AuthModal = ({ isOpen, onClose, initialMode }) => {
  const [isSignIn, setIsSignIn] = useState(initialMode === 'signin');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const { signIn } = useAuth();
  const navigate   = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isSignIn ? '/api/auth/signin' : '/api/auth/signup';
      const baseUrl  = import.meta.env.VITE_API_URL || '';
      const body     = isSignIn ? { email, password } : { name, email, password };
      const res      = await fetch(`${baseUrl}${endpoint}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      const contentType = res.headers.get('content-type') ?? '';
      if (!contentType.includes('application/json')) {
        throw new Error('Server unavailable — make sure the backend is running.');
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      signIn(data.token, data.user);
      navigate('/app');
    } catch (err) {
      if (err.name === 'TypeError') {
        setError('Cannot reach the server — make sure the backend is running.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <motion.div
        className="auth-modal"
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.95 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="auth-logo-icon"><KanbanSquare size={22} /></div>
        <div className="auth-header">
          <h2 className="auth-title">{isSignIn ? 'Welcome back' : 'Create account'}</h2>
          <p className="auth-subtitle">
            {isSignIn ? 'Sign in to your Kanban workspace' : 'Get started with Kanban Pro for free'}
          </p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isSignIn && (
            <div className="auth-input-group">
              <label>Full Name</label>
              <input
                type="text"
                className="auth-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div className="auth-input-group">
            <label>Email</label>
            <input
              type="email"
              className="auth-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-input-group">
            <label>Password</label>
            <input
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Processing…' : isSignIn ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="auth-switch">
          {isSignIn ? "Don't have an account?" : 'Already have an account?'}
          <button onClick={() => { setIsSignIn(!isSignIn); setError(''); }}>
            {isSignIn ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ── Mock Kanban board preview ──────────────────────────────── */
const PRIORITY_STYLES = {
  high:   { bg: 'rgba(239,68,68,0.15)',   color: '#f87171', border: 'rgba(239,68,68,0.25)' },
  medium: { bg: 'rgba(245,158,11,0.15)',  color: '#fbbf24', border: 'rgba(245,158,11,0.25)' },
  low:    { bg: 'rgba(34,197,94,0.15)',   color: '#4ade80', border: 'rgba(34,197,94,0.25)'  },
};

const MockCard = ({ title, priority, tag, delay = 0 }) => {
  const p = PRIORITY_STYLES[priority];
  return (
    <motion.div
      className="mock-card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + 0.9, duration: 0.35 }}
    >
      <div className="mock-card-title">{title}</div>
      <div className="mock-card-badges">
        <span className="mock-badge" style={{ background: p.bg, color: p.color, border: `1px solid ${p.border}` }}>
          {priority}
        </span>
        <span className="mock-badge mock-badge-tag">{tag}</span>
      </div>
    </motion.div>
  );
};

const COLUMNS = [
  {
    id: 'todo',
    label: 'TO DO',
    dotClass: 'todo',
    cards: [
      { title: 'Design system audit',  priority: 'high',   tag: 'Design'   },
      { title: 'API rate limiting',    priority: 'medium', tag: 'Backend'  },
    ],
  },
  {
    id: 'inprogress',
    label: 'IN PROGRESS',
    dotClass: 'inprogress',
    cards: [
      { title: 'WebSocket real-time sync', priority: 'high',   tag: 'Backend'  },
      { title: 'Analytics dashboard',      priority: 'medium', tag: 'Frontend' },
    ],
  },
  {
    id: 'done',
    label: 'DONE',
    dotClass: 'done',
    cards: [
      { title: 'JWT authentication', priority: 'low',    tag: 'Auth'    },
      { title: 'Drag & drop system', priority: 'medium', tag: 'UX'      },
    ],
  },
];

const MockKanban = () => (
  <motion.div
    className="mock-kanban"
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.65, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
  >
    <div className="mock-kanban-inner">
      {COLUMNS.map((col, ci) => (
        <div key={col.id} className="mock-col">
          <div className="mock-col-header">
            <div className={`mock-col-dot ${col.dotClass}`} />
            <span className="mock-col-name">{col.label}</span>
            <span className="mock-col-count">{col.cards.length}</span>
          </div>
          {col.cards.map((card, i) => (
            <MockCard
              key={card.title}
              title={card.title}
              priority={card.priority}
              tag={card.tag}
              delay={ci * 0.15 + i * 0.1}
            />
          ))}
          <div className="mock-add-btn">+ Add task</div>
        </div>
      ))}
    </div>
  </motion.div>
);

/* ── Features ───────────────────────────────────────────────── */
const FEATURES = [
  {
    icon:    <Zap size={20} />,
    title:   'Real-Time Collaboration',
    desc:    'WebSocket-powered live sync. Every change propagates instantly to every connected teammate.',
    color:   '#6366f1',
  },
  {
    icon:    <Layers size={20} />,
    title:   'Drag & Drop Boards',
    desc:    'Move tasks between columns with smooth, intuitive drag-and-drop — zero friction.',
    color:   '#f59e0b',
  },
  {
    icon:    <BarChart2 size={20} />,
    title:   'Built-In Analytics',
    desc:    'Priority breakdowns and progress charts baked right into your workspace dashboard.',
    color:   '#22c55e',
  },
  {
    icon:    <Shield size={20} />,
    title:   'Secure by Default',
    desc:    'JWT authentication with protected routes so your data stays private and safe.',
    color:   '#a855f7',
  },
];

/* ── Landing Page ───────────────────────────────────────────── */
export default function LandingPage() {
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'signin' });
  const navigate = useNavigate();
  const { user }  = useAuth();

  const openAuth = (mode) => {
    if (user) navigate('/app');
    else setAuthModal({ isOpen: true, mode });
  };

  return (
    <div className="landing-container">
      {/* ── Background ── */}
      <div className="landing-bg" aria-hidden>
        <div className="landing-orb orb-1" />
        <div className="landing-orb orb-2" />
        <div className="landing-orb orb-3" />
        <div className="landing-grid" />
      </div>

      {/* ── Nav ── */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <KanbanSquare size={24} strokeWidth={2.5} />
          Kanban Pro
        </div>
        <div className="landing-nav-actions">
          {user ? (
            <button className="btn-landing-primary" onClick={() => navigate('/app')}>
              Go to Board
            </button>
          ) : (
            <>
              <button className="btn-landing-ghost" onClick={() => openAuth('signin')}>Sign In</button>
              <button className="btn-landing-primary" onClick={() => openAuth('signup')}>Get Started</button>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="landing-hero">
        <div className="hero-content">
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <Activity size={13} />
            Live WebSocket · Real-time sync
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            The Kanban board<br />
            your team <span className="hero-highlight">deserves.</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
          >
            Real-time collaboration, drag-and-drop simplicity, and beautiful analytics —
            all in one premium workspace.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
          >
            <button className="btn-hero-primary" onClick={() => openAuth('signup')}>
              Start for free <ArrowRight size={17} />
            </button>
            <button className="btn-hero-secondary" onClick={() => openAuth('signin')}>
              Sign In
            </button>
          </motion.div>

          <motion.div
            className="hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.5 }}
          >
            <div className="hero-stat">
              <span className="hero-stat-num">3</span>
              <span className="hero-stat-label">Kanban columns</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">∞</span>
              <span className="hero-stat-label">Tasks &amp; files</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">⚡</span>
              <span className="hero-stat-label">Real-time sync</span>
            </div>
          </motion.div>
        </div>

        <div className="hero-visual">
          <MockKanban />
          <motion.div
            className="float-badge float-badge-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3, duration: 0.35 }}
          >
            <CheckCircle2 size={13} color="#4ade80" />
            Task completed
          </motion.div>
          <motion.div
            className="float-badge float-badge-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6, duration: 0.35 }}
          >
            <Activity size={13} color="#818cf8" />
            Live sync active
          </motion.div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="section-divider" />

      {/* ── Features ── */}
      <section className="features-section">
        <motion.div
          className="features-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-badge">Features</div>
          <h2 className="section-title">Everything your team needs</h2>
          <p className="section-subtitle">
            Built for modern teams who demand speed, clarity, and real-time collaboration.
          </p>
        </motion.div>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <div
                className="feature-icon"
                style={{
                  background: `${f.color}18`,
                  color:      f.color,
                  border:     `1px solid ${f.color}30`,
                }}
              >
                {f.icon}
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <motion.div
          className="cta-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="cta-orb" aria-hidden />
          <div className="cta-logo-icon">
            <KanbanSquare size={28} strokeWidth={1.5} />
          </div>
          <h2 className="cta-title">Ready to level up your workflow?</h2>
          <p className="cta-subtitle">
            Join teams already using Kanban Pro to ship faster and stay organized.
          </p>
          <button className="btn-hero-primary" onClick={() => openAuth('signup')}>
            Get started — it&apos;s free <ArrowRight size={17} />
          </button>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="footer-logo">
          <KanbanSquare size={16} />
          Kanban Pro
        </div>
        <p className="footer-text">Real-time task management for modern teams.</p>
        <div className="footer-links">
          <button className="footer-link" onClick={() => openAuth('signin')}>Sign In</button>
          <button className="footer-link" onClick={() => openAuth('signup')}>Sign Up</button>
        </div>
      </footer>

      <AnimatePresence>
        {authModal.isOpen && (
          <AuthModal
            isOpen={authModal.isOpen}
            mode={authModal.mode}
            initialMode={authModal.mode}
            onClose={() => setAuthModal({ isOpen: false, mode: 'signin' })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
