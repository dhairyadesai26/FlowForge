import React, { useState, useEffect, useRef } from "react";
import "./SplashScreen.css";

const STAGES = [
  { id: "init",       label: "Initializing",    icon: "⚡",  duration: 600  },
  { id: "auth",       label: "Authenticating",  icon: "🔐",  duration: 700  },
  { id: "preparing",  label: "Preparing boards",icon: "🗂️",  duration: 650  },
  { id: "syncing",    label: "Syncing workspace",icon: "🔄", duration: 600  },
  { id: "ready",      label: "Ready!",          icon: "✅",  duration: 400  },
];

export default function SplashScreen() {
  const [stageIdx, setStageIdx]   = useState(0);
  const [progress, setProgress]   = useState(0);
  const [exiting,  setExiting]    = useState(false);
  const [particles, setParticles] = useState([]);
  const timerRef = useRef(null);

  /* ── Generate floating particles once ── */
  useEffect(() => {
    const pts = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      dur: 4 + Math.random() * 8,
      delay: Math.random() * 6,
    }));
    setParticles(pts);
  }, []);

  /* ── Stage sequencer ── */
  useEffect(() => {
    if (stageIdx >= STAGES.length) return;

    const stage = STAGES[stageIdx];
    const targetProgress = ((stageIdx + 1) / STAGES.length) * 100;

    /* Smoothly animate progress bar */
    const startProgress = progress;
    const diff = targetProgress - startProgress;
    const steps = 40;
    let step = 0;
    const animProgress = setInterval(() => {
      step++;
      setProgress(startProgress + (diff * step) / steps);
      if (step >= steps) clearInterval(animProgress);
    }, stage.duration / steps);

    timerRef.current = setTimeout(() => {
      if (stageIdx === STAGES.length - 1) {
        setExiting(true);
      } else {
        setStageIdx((s) => s + 1);
      }
    }, stage.duration);

    return () => {
      clearTimeout(timerRef.current);
      clearInterval(animProgress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageIdx]);

  const stage = STAGES[Math.min(stageIdx, STAGES.length - 1)];

  return (
    <div className={`splash-root${exiting ? " splash-exit" : ""}`}>
      {/* ── Ambient orbs ── */}
      <div className="splash-orb splash-orb--1" />
      <div className="splash-orb splash-orb--2" />
      <div className="splash-orb splash-orb--3" />

      {/* ── Grid overlay ── */}
      <div className="splash-grid" />

      {/* ── Floating particles ── */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="splash-particle"
          style={{
            left: `${p.x}%`,
            top:  `${p.y}%`,
            width:  `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.dur}s`,
            animationDelay:    `${p.delay}s`,
          }}
        />
      ))}

      {/* ── Main card ── */}
      <div className="splash-card">
        {/* Logo mark */}
        <div className="splash-logo-wrap">
          <div className="splash-logo-ring splash-logo-ring--outer" />
          <div className="splash-logo-ring splash-logo-ring--inner" />
          <div className="splash-logo-core">
            <span className="splash-logo-icon">⚡</span>
          </div>
        </div>

        {/* Brand name */}
        <div className="splash-brand">
          <span className="splash-brand-flow">Flow</span>
          <span className="splash-brand-forge">Forge</span>
        </div>
        <p className="splash-tagline">Collaborative task management, reimagined</p>

        {/* Progress section */}
        <div className="splash-progress-wrap">
          {/* Stage pills */}
          <div className="splash-stages">
            {STAGES.map((s, idx) => (
              <div
                key={s.id}
                className={
                  "splash-stage-pill" +
                  (idx <  stageIdx ? " done"    : "") +
                  (idx === stageIdx ? " active"  : "") +
                  (idx >  stageIdx ? " pending" : "")
                }
              >
                <span className="splash-stage-icon">{s.icon}</span>
                <span className="splash-stage-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Bar */}
          <div className="splash-bar-track">
            <div
              className="splash-bar-fill"
              style={{ width: `${progress}%` }}
            />
            <div
              className="splash-bar-glow"
              style={{ left: `${progress}%` }}
            />
          </div>

          {/* Status text */}
          <div className="splash-status">
            <span className="splash-status-dot" />
            <span className="splash-status-text" key={stage.id}>
              {stage.label}…
            </span>
            <span className="splash-status-pct">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Bottom decorative dots */}
        <div className="splash-dots">
          {STAGES.map((_, i) => (
            <span
              key={i}
              className={
                "splash-dot" +
                (i <  stageIdx ? " done"   : "") +
                (i === stageIdx ? " active" : "")
              }
            />
          ))}
        </div>
      </div>

      {/* ── Version chip ── */}
      <div className="splash-version">v2.0 · Real-time Kanban</div>
    </div>
  );
}
