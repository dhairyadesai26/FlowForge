import React, { useState, useEffect } from "react";
import "./SplashScreen.css";

const STAGES = [
  { id: "init",      label: "Initializing",     icon: "⚡" },
  { id: "auth",      label: "Authenticating",   icon: "🔐" },
  { id: "preparing", label: "Preparing boards", icon: "🗂️" },
  { id: "syncing",   label: "Syncing workspace", icon: "🔄" },
  { id: "ready",     label: "Almost ready",     icon: "✅" },
];

export default function SplashScreen() {
  const [stageIdx,  setStageIdx]  = useState(0);
  const [particles, setParticles] = useState([]);

  /* ── Generate floating particles once ── */
  useEffect(() => {
    setParticles(
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 4,
        dur:  4 + Math.random() * 8,
        delay: Math.random() * 6,
      }))
    );
  }, []);

  /* ── Cycle through stages every 550ms — loops until parent unmounts ── */
  useEffect(() => {
    const t = setInterval(() => {
      setStageIdx((s) => (s + 1) % STAGES.length);
    }, 550);
    return () => clearInterval(t);
  }, []);

  const stage = STAGES[stageIdx];

  return (
    <div className="splash-root">
      {/* Ambient orbs */}
      <div className="splash-orb splash-orb--1" />
      <div className="splash-orb splash-orb--2" />
      <div className="splash-orb splash-orb--3" />

      {/* Grid overlay */}
      <div className="splash-grid" />

      {/* Floating particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="splash-particle"
          style={{
            left:              `${p.x}%`,
            top:               `${p.y}%`,
            width:             `${p.size}px`,
            height:            `${p.size}px`,
            animationDuration: `${p.dur}s`,
            animationDelay:    `${p.delay}s`,
          }}
        />
      ))}

      {/* Main card */}
      <div className="splash-card">
        {/* Logo spinner */}
        <div className="splash-logo-wrap">
          <div className="splash-logo-ring splash-logo-ring--outer" />
          <div className="splash-logo-ring splash-logo-ring--inner" />
          <div className="splash-logo-core">
            <span className="splash-logo-icon">⚡</span>
          </div>
        </div>

        {/* Brand */}
        <div className="splash-brand">
          <span className="splash-brand-flow">Flow</span>
          <span className="splash-brand-forge">Forge</span>
        </div>
        <p className="splash-tagline">Collaborative task management, reimagined</p>

        {/* Current stage indicator */}
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
                  (idx >  stageIdx ? " pending"  : "")
                }
              >
                <span className="splash-stage-icon">{s.icon}</span>
                <span className="splash-stage-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Indeterminate progress bar */}
          <div className="splash-bar-track">
            <div className="splash-bar-indeterminate" />
          </div>

          {/* Status text */}
          <div className="splash-status">
            <span className="splash-status-dot" />
            <span className="splash-status-text" key={stage.id}>
              {stage.label}…
            </span>
          </div>
        </div>

        {/* Dot indicators */}
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

      <div className="splash-version">v2.0 · Real-time Kanban</div>
    </div>
  );
}
