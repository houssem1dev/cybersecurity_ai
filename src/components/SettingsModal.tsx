'use client';

import React, { useState, useEffect } from 'react';
import { X, Key, Cpu, Check, AlertCircle, ExternalLink } from 'lucide-react';
import { SUPPORTED_MODELS } from '@/lib/groq';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverKeyConfigured: boolean;
  currentModel: string;
  onSelectModel: (model: string) => void;
  customApiKey: string;
  onSaveCustomKey: (key: string) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  serverKeyConfigured,
  currentModel,
  onSelectModel,
  customApiKey,
  onSaveCustomKey,
}: SettingsModalProps) {
  const [apiKeyInput, setApiKeyInput] = useState(customApiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setApiKeyInput(customApiKey);
  }, [customApiKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveCustomKey(apiKeyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Key size={18} color="#00f2fe" />
            <span>CyberAI Engine & Groq Settings</span>
          </div>
          <button className="tool-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Groq Model Selection */}
          <div>
            <label className="cvss-label" style={{ marginBottom: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cpu size={14} color="#00f2fe" />
                Inference Model (Groq Cloud)
              </span>
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {SUPPORTED_MODELS.map((m) => (
                <div
                  key={m.id}
                  onClick={() => onSelectModel(m.id)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${currentModel === m.id ? '#00f2fe' : 'var(--border-subtle)'}`,
                    background: currentModel === m.id ? 'rgba(0, 242, 254, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{m.name}</span>
                    {currentModel === m.id && <span style={{ fontSize: '0.7rem', color: '#00f2fe', fontFamily: 'var(--font-mono)' }}>ACTIVE</span>}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{m.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* API Key Configuration */}
          <div>
            <label className="cvss-label" style={{ marginBottom: '6px' }}>
              <span>Groq API Key (Environment or Override)</span>
              {serverKeyConfigured && (
                <span style={{ color: '#34d399', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={12} /> Vercel Server Key Detected
                </span>
              )}
            </label>

            <input
              type="password"
              placeholder="gsk_..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                background: '#04060a',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-mono)',
                outline: 'none',
              }}
            />

            <div style={{ marginTop: '8px', fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              {serverKeyConfigured ? (
                <span>
                  A server-level <code style={{ color: '#38bdf8' }}>GROQ_API_KEY</code> is active. You can leave this blank, or enter a custom key above to override.
                </span>
              ) : (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', color: '#fbbf24' }}>
                  <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>
                    No environment key detected. You can paste your Groq API key here (persisted in your browser), or add <strong>GROQ_API_KEY</strong> in your Vercel Project Settings &gt; Environment Variables.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Vercel Deployment Guide Box */}
          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
            }}
          >
            <div style={{ fontWeight: 600, color: '#fff', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Vercel Production Deployment Tip</span>
            </div>
            <p>
              When deploying this repository to Vercel, go to <strong>Project Settings &rarr; Environment Variables</strong> and add:
            </p>
            <pre style={{ margin: '6px 0', padding: '6px', background: '#000', borderRadius: '4px', color: '#38bdf8' }}>
              GROQ_API_KEY = gsk_your_key_here
            </pre>
            <p>
              Get your free instant Groq key at{' '}
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#00f2fe', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
              >
                console.groq.com/keys <ExternalLink size={10} />
              </a>
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            {savedSuccess ? (
              <>
                <Check size={14} /> Saved!
              </>
            ) : (
              'Save Configuration'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
