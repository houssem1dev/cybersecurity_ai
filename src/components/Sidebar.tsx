'use client';

import React from 'react';
import {
  Sparkles,
  Cpu,
  ShieldCheck,
  Radar,
  Lock,
  CheckCircle2,
  Play,
  Key,
  Layers,
  Flame,
} from 'lucide-react';
import { SECURITY_SCENARIOS, SecurityScenario } from '@/lib/templates';

interface SidebarProps {
  selectedMode: string;
  onSelectMode: (mode: string) => void;
  onSelectScenario: (scenario: SecurityScenario) => void;
  onOpenApiHub?: () => void;
}

export function Sidebar({
  selectedMode,
  onSelectMode,
  onSelectScenario,
  onOpenApiHub,
}: SidebarProps) {
  const modes = [
    {
      id: 'mythos',
      title: 'Mythos Exploit Mechanics',
      desc: 'Zero-day dissection, AST flaw propagation, gadget chains, and execution flow hijacking.',
      icon: <Flame size={15} color="#00f2fe" />,
      badge: 'GLASSWING',
    },
    {
      id: 'autofix',
      title: 'Autonomous Code Remediation',
      desc: 'Zero-placeholder production patches, parameterized queries, and cryptographically verified fixes.',
      icon: <ShieldCheck size={15} color="#10b981" />,
      badge: 'AUTO-FIX',
    },
    {
      id: 'forensics',
      title: 'Forensic Footprint & Evasion',
      desc: 'Sysmon Event IDs, Linux auditd, memory page artifacts, and EDR detection engineering.',
      icon: <Radar size={15} color="#a855f7" />,
      badge: 'TELEMETRY',
    },
    {
      id: 'defense',
      title: 'Zero-Trust Shield & Infra',
      desc: 'API gateways, WAF rule generation, Layer 3/4/7 DDoS resilience, and cloud IAM posture.',
      icon: <Lock size={15} color="#38bdf8" />,
      badge: 'DEFENSE',
    },
    {
      id: 'all',
      title: 'Adaptive Full Spectrum',
      desc: 'Autonomous multi-angle triage across exploit mechanics, telemetry, and remediation.',
      icon: <Layers size={15} color="#94a3b8" />,
      badge: 'FULL-SPECTRUM',
    },
  ];

  return (
    <aside className="app-sidebar">
      <div>
        <div className="sidebar-section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Mythos Intelligence Directive</span>
          <span style={{ fontSize: '0.62rem', color: '#00f2fe', fontFamily: 'var(--font-mono)' }}>V2.4</span>
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

      <div style={{ marginTop: '1.25rem' }}>
        <div className="sidebar-section-title">
          <span>Mythos Scenarios (1-Click Test)</span>
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

      {/* Project API Link Banner in Sidebar */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <div
          onClick={onOpenApiHub}
          style={{
            background: 'rgba(0, 242, 254, 0.06)',
            border: '1px solid rgba(0, 242, 254, 0.25)',
            borderRadius: '8px',
            padding: '10px 12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          className="api-hub-banner-hover"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={12} color="#00f2fe" />
              <span>LINK YOUR APPS</span>
            </span>
            <span style={{ fontSize: '0.65rem', color: '#00f2fe', fontFamily: 'var(--font-mono)' }}>
              REST API
            </span>
          </div>
          <p style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: '1.3' }}>
            Generate keys to automatically correct vulnerabilities in your projects via <code style={{ color: '#38bdf8' }}>/api/v1/audit</code>.
          </p>
        </div>
      </div>
    </aside>
  );
}
