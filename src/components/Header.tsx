'use client';

import React from 'react';
import { ShieldAlert, Cpu, Settings, Calculator, Trash2, Download } from 'lucide-react';

interface HeaderProps {
  serverKeyConfigured: boolean;
  hasCustomKey: boolean;
  onOpenCvss: () => void;
  onOpenSettings: () => void;
  onClearChat: () => void;
  onExportReport: () => void;
  canExport: boolean;
  currentModel: string;
}

export function Header({
  serverKeyConfigured,
  hasCustomKey,
  onOpenCvss,
  onOpenSettings,
  onClearChat,
  onExportReport,
  canExport,
  currentModel,
}: HeaderProps) {
  const isReady = serverKeyConfigured || hasCustomKey;

  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-icon-wrapper">
          <ShieldAlert size={20} />
        </div>
        <div>
          <h1 className="brand-title">
            CYBERAI ARCHITECT
            <span className="brand-badge">DEFENSIVE // V1.0</span>
          </h1>
        </div>
      </div>

      <div className="header-status">
        <div className={`status-pill ${isReady ? '' : 'warning'}`}>
          <span className="pulse-dot" />
          <span>
            {isReady ? `GROQ: ${currentModel.split('/').pop()?.toUpperCase() || currentModel}` : 'KEY REQUIRED'}
          </span>
        </div>
      </div>

      <div className="header-actions">
        <button
          className="btn btn-accent"
          onClick={onOpenCvss}
          title="Open interactive CVSS v3.1 calculator"
        >
          <Calculator size={15} />
          <span>CVSS 3.1</span>
        </button>

        {canExport && (
          <button
            className="btn"
            onClick={onExportReport}
            title="Download assessment report (.md)"
          >
            <Download size={14} />
            <span>Export Report</span>
          </button>
        )}

        <button
          className="btn"
          onClick={onClearChat}
          title="Reset conversation"
        >
          <Trash2 size={14} />
          <span>Clear</span>
        </button>

        <button
          className="btn"
          onClick={onOpenSettings}
          title="Configure API key & model"
        >
          <Settings size={15} />
          <span>Settings</span>
        </button>
      </div>
    </header>
  );
}
