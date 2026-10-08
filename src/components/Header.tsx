'use client';

import React from 'react';
import {
  ShieldAlert,
  Cpu,
  Settings,
  Calculator,
  Trash2,
  Download,
  Key,
  Code2,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  serverKeyConfigured: boolean;
  hasCustomKey: boolean;
  onOpenCvss: () => void;
  onOpenSettings: () => void;
  onOpenApiHub: () => void;
  onClearChat: () => void;
  onExportReport: () => void;
  canExport: boolean;
  currentModel: string;
  activeView: 'chat' | 'patcher';
  onSelectView: (view: 'chat' | 'patcher') => void;
}

export function Header({
  serverKeyConfigured,
  hasCustomKey,
  onOpenCvss,
  onOpenSettings,
  onOpenApiHub,
  onClearChat,
  onExportReport,
  canExport,
  currentModel,
  activeView,
  onSelectView,
}: HeaderProps) {
  const isReady = serverKeyConfigured || hasCustomKey;

  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-icon-wrapper" style={{ boxShadow: '0 0 15px rgba(0, 242, 254, 0.4)' }}>
          <ShieldAlert size={20} color="#00f2fe" />
        </div>
        <div>
          <h1 className="brand-title">
            CYBERAI MYTHOS
            <span className="brand-badge" style={{ background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.2), rgba(168, 85, 247, 0.2))', border: '1px solid rgba(0, 242, 254, 0.4)' }}>
              GLASSWING ENGINE
            </span>
          </h1>
        </div>
      </div>

      {/* Center View Selector Tabs */}
      <div className="header-view-tabs" style={{ display: 'flex', gap: '6px', background: 'rgba(7, 9, 14, 0.6)', padding: '4px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <button
          className={`btn ${activeView === 'chat' ? 'btn-accent' : ''}`}
          onClick={() => onSelectView('chat')}
          style={{ padding: '5px 12px', fontSize: '0.8rem' }}
        >
          <MessageSquare size={13} />
          <span>Mythos Chat</span>
        </button>
        <button
          className={`btn ${activeView === 'patcher' ? 'btn-accent' : ''}`}
          onClick={() => onSelectView('patcher')}
          style={{ padding: '5px 12px', fontSize: '0.8rem' }}
        >
          <Code2 size={13} />
          <span>Auto-Patch Studio</span>
        </button>
      </div>

      <div className="header-status">
        <div className={`status-pill ${isReady ? '' : 'warning'}`}>
          <span className="pulse-dot" />
          <span>
            {isReady ? `MYTHOS: ${currentModel.split('/').pop()?.toUpperCase() || currentModel}` : 'API KEY NEEDED'}
          </span>
        </div>
      </div>

      <div className="header-actions">
        {/* Project API Keys button */}
        <button
          className="btn"
          onClick={onOpenApiHub}
          title="Generate API keys & link external projects"
          style={{ border: '1px solid rgba(0, 242, 254, 0.35)', color: '#00f2fe' }}
        >
          <Key size={14} />
          <span>API &amp; Project Keys</span>
        </button>

        <button
          className="btn btn-accent"
          onClick={onOpenCvss}
          title="Open interactive CVSS v3.1 calculator"
        >
          <Calculator size={14} />
          <span>CVSS 3.1</span>
        </button>

        {canExport && activeView === 'chat' && (
          <button
            className="btn"
            onClick={onExportReport}
            title="Download assessment report (.md)"
          >
            <Download size={14} />
            <span>Export Report</span>
          </button>
        )}

        {activeView === 'chat' && (
          <button
            className="btn"
            onClick={onClearChat}
            title="Reset conversation"
          >
            <Trash2 size={14} />
            <span>Clear</span>
          </button>
        )}

        <button
          className="btn"
          onClick={onOpenSettings}
          title="Configure API key & model"
        >
          <Settings size={14} />
          <span>Settings</span>
        </button>
      </div>
    </header>
  );
}
