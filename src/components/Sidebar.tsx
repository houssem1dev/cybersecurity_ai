'use client';

import React from 'react';
import { Globe, Radio, AlertOctagon, Terminal, Play, Lock, CheckCircle2 } from 'lucide-react';
import { SECURITY_SCENARIOS, SecurityScenario } from '@/lib/templates';

interface SidebarProps {
  selectedMode: string;
  onSelectMode: (mode: string) => void;
  onSelectScenario: (scenario: SecurityScenario) => void;
}

export function Sidebar({ selectedMode, onSelectMode, onSelectScenario }: SidebarProps) {
  const modes = [
    {
      id: 'all',
      title: 'Full Spectrum Defense',
      desc: 'Automatic adaptive triage across OWASP, DDoS, and CVSS frameworks.',
      icon: <Lock size={15} />,
    },
    {
      id: 'mode1',
      title: 'Mode 1: OWASP Web Sec',
      desc: 'Deep audit for SQLi, XSS, SSRF, Broken Auth, and parameter manipulation.',
      icon: <Globe size={15} />,
    },
    {
      id: 'mode2',
      title: 'Mode 2: DDoS & Network',
      desc: 'L3/4 floods, L7 Slowloris, scrubbing center & Anycast CDN posture.',
      icon: <Radio size={15} />,
    },
    {
      id: 'mode3',
      title: 'Mode 3: CVSS Scoring',
      desc: 'CVSS v3.1/v4.0 base vectors, CIA triad impact, and MITRE TTPs.',
      icon: <AlertOctagon size={15} />,
    },
  ];

  return (
    <aside className="app-sidebar">
      <div>
        <div className="sidebar-section-title">
          <span>Operational Directive</span>
        </div>
        <div className="mode-grid">
          {modes.map((m) => (
            <div
              key={m.id}
              className={`mode-card ${selectedMode === m.id ? 'active' : ''}`}
              onClick={() => onSelectMode(m.id)}
            >
              <div className="mode-card-header">
                <span className="mode-card-title">
                  {m.icon}
                  {m.title}
                </span>
                {selectedMode === m.id && (
                  <CheckCircle2 size={14} color="#00f2fe" />
                )}
              </div>
              <p className="mode-card-desc">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="sidebar-section-title">
          <span>Audit Scenarios (1-Click)</span>
        </div>
        <div>
          {SECURITY_SCENARIOS.map((scenario) => (
            <div
              key={scenario.id}
              className="scenario-item"
              onClick={() => onSelectScenario(scenario)}
            >
              <div className="scenario-header">
                <span className="scenario-title">{scenario.title}</span>
                <Play size={12} color="#00f2fe" />
              </div>
              <span className="scenario-badge">{scenario.badge}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          <strong style={{ color: '#fff' }}>Vercel Host Ready</strong>
          <p style={{ marginTop: '4px' }}>
            Set <code style={{ color: '#38bdf8' }}>GROQ_API_KEY</code> in project Environment Variables.
          </p>
        </div>
      </div>
    </aside>
  );
}
