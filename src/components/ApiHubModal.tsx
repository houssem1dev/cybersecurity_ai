'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Key,
  Copy,
  Check,
  Plus,
  Trash2,
  Code2,
  Terminal,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export interface ProjectKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  mode: string;
}

interface ApiHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverKeyConfigured: boolean;
  customApiKey: string;
}

export function ApiHubModal({
  isOpen,
  onClose,
  serverKeyConfigured,
  customApiKey,
}: ApiHubModalProps) {
  const [keys, setKeys] = useState<ProjectKey[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [selectedSnippetTab, setSelectedSnippetTab] = useState<'curl' | 'nodejs' | 'python' | 'github'>('curl');
  const [activeTab, setActiveTab] = useState<'keys' | 'docs'>('keys');

  // Load project keys from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cyberai_project_keys');
      if (saved) {
        try {
          setKeys(JSON.parse(saved));
        } catch {
          setKeys([]);
        }
      } else {
        // Default initial key for user
        const initialKey: ProjectKey = {
          id: 'pk_default',
          name: 'Primary Application Service',
          key: 'cai_live_' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10),
          createdAt: new Date().toLocaleDateString(),
          mode: 'autofix',
        };
        setKeys([initialKey]);
        localStorage.setItem('cyberai_project_keys', JSON.stringify([initialKey]));
      }
    }
  }, [isOpen]);

  const saveKeys = (updated: ProjectKey[]) => {
    setKeys(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cyberai_project_keys', JSON.stringify(updated));
    }
  };

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newProjectName.trim() || `Project-${keys.length + 1}`;
    const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    const newKey: ProjectKey = {
      id: 'pk_' + Date.now(),
      name,
      key: `cai_live_${randomHex}`,
      createdAt: new Date().toLocaleDateString(),
      mode: 'autofix',
    };

    const updated = [newKey, ...keys];
    saveKeys(updated);
    setNewProjectName('');
  };

  const handleDeleteKey = (id: string) => {
    const updated = keys.filter((k) => k.id !== id);
    saveKeys(updated);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  if (!isOpen) return null;

  const currentKey = keys[0]?.key || 'cai_live_your_project_key_here';
  const effectiveGroqKey = customApiKey || 'YOUR_GROQ_KEY_IF_NEEDED';

  const snippets = {
    curl: `curl -X POST "http://localhost:3000/api/v1/audit" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${currentKey}" \\
  -d '{
    "code": "app.post(\\"/login\\", async (req, res) => { const q = \\"SELECT * FROM users WHERE user=\\" + req.body.u; db.query(q); });",
    "language": "javascript",
    "context": "User Authentication API",
    "mode": "autofix"
  }'`,
    nodejs: `// CyberAI Node.js / Express Security Guard
async function auditAndPatchCode(sourceCode, language = 'typescript') {
  const response = await fetch('http://localhost:3000/api/v1/audit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${currentKey}'
    },
    body: JSON.stringify({
      code: sourceCode,
      language: language,
      mode: 'autofix'
    })
  });

  const data = await response.json();
  if (data.status === 'success') {
    console.log('✅ Audit Report:\\n', data.auditReport);
    console.log('🛡️ Hardened Drop-in Code:\\n', data.patchedCode);
    return data.patchedCode;
  }
  throw new Error(data.error);
}`,
    python: `# CyberAI Python Vulnerability Scanner SDK
import requests

def audit_file_with_mythos(code_snippet: str, language: str = "python"):
    endpoint = "http://localhost:3000/api/v1/audit"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer ${currentKey}"
    }
    payload = {
        "code": code_snippet,
        "language": language,
        "mode": "autofix"
    }

    res = requests.post(endpoint, json=payload, headers=headers)
    result = res.json()
    
    if result.get("status") == "success":
        print("Findings:", result.get("auditReport"))
        return result.get("patchedCode")
    else:
        print("Audit failed:", result.get("error"))`,
    github: `# .github/workflows/cyberai-security-audit.yml
name: CyberAI Mythos Automated Code Audit

on:
  pull_request:
    branches: [main, master]

jobs:
  mythos-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Send Changed Files to CyberAI
        run: |
          # Send modified endpoints for automated Mythos audit & patch verification
          curl -s -X POST "https://your-cyberai-deployment.vercel.app/api/v1/audit" \\
            -H "Content-Type: application/json" \\
            -H "Authorization: Bearer \${{ secrets.CYBERAI_PROJECT_KEY }}" \\
            -d "{\\"code\\": \\"$(cat src/api/auth.js | jq -sRr @json)\\", \\"language\\": \\"javascript\\", \\"mode\\": \\"autofix\\"}" \\
            > audit-result.json
          cat audit-result.json`,
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content api-hub-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '820px', width: '95%' }}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge" style={{ background: 'rgba(0, 242, 254, 0.15)', borderColor: '#00f2fe' }}>
              <Sparkles size={18} color="#00f2fe" />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.15rem' }}>
                CYBERAI PROJECT LINK &amp; API KEY HUB
              </h2>
              <p className="modal-subtitle">
                Generate project keys &amp; connect external applications to automatically detect and correct code vulnerabilities via Mythos logic.
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close API hub">
            <X size={18} />
          </button>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px', marginTop: '12px' }}>
          <button
            className={`btn ${activeTab === 'keys' ? 'btn-accent' : ''}`}
            onClick={() => setActiveTab('keys')}
            style={{ fontSize: '0.82rem', padding: '6px 14px' }}
          >
            <Key size={14} />
            <span>Project API Keys ({keys.length})</span>
          </button>
          <button
            className={`btn ${activeTab === 'docs' ? 'btn-accent' : ''}`}
            onClick={() => setActiveTab('docs')}
            style={{ fontSize: '0.82rem', padding: '6px 14px' }}
          >
            <Code2 size={14} />
            <span>Integration Snippets (cURL / Node / Python / CI-CD)</span>
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto', paddingRight: '4px' }}>
          {activeTab === 'keys' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Key creation box */}
              <div
                style={{
                  background: 'rgba(13, 18, 31, 0.85)',
                  border: '1px solid rgba(0, 242, 254, 0.2)',
                  borderRadius: '10px',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <ShieldCheck size={16} color="#00f2fe" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Generate New Project API Key
                  </span>
                </div>
                <form onSubmit={handleGenerateKey} style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="e.g. Next.js Auth Backend, Stripe Webhook Service..."
                    className="settings-input"
                    style={{ flex: 1, fontSize: '0.85rem' }}
                  />
                  <button type="submit" className="btn btn-accent" style={{ whiteSpace: 'nowrap' }}>
                    <Plus size={14} />
                    <span>Create Key</span>
                  </button>
                </form>
              </div>

              {/* Keys list */}
              <div>
                <span className="sidebar-section-title" style={{ display: 'block', marginBottom: '8px' }}>
                  Active Project Credentials
                </span>
                {keys.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                    No project keys generated yet. Click above to create one.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {keys.map((k) => (
                      <div
                        key={k.id}
                        style={{
                          background: 'rgba(16, 23, 38, 0.6)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '8px',
                          padding: '12px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#f8fafc' }}>{k.name}</span>
                            <span
                              style={{
                                fontSize: '0.68rem',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                background: 'rgba(16, 185, 129, 0.15)',
                                color: '#10b981',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                              }}
                            >
                              READY
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Created {k.createdAt}</span>
                          </div>
                          <div
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.78rem',
                              color: '#38bdf8',
                              background: 'rgba(0, 0, 0, 0.35)',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              display: 'inline-block',
                              maxWidth: '100%',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {k.key}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            className="btn"
                            onClick={() => handleCopy(k.key, k.id)}
                            style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                            title="Copy API Key"
                          >
                            {copiedKeyId === k.id ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                            <span>{copiedKeyId === k.id ? 'Copied' : 'Copy'}</span>
                          </button>
                          <button
                            className="btn-icon"
                            onClick={() => handleDeleteKey(k.id)}
                            style={{ color: '#ef4444' }}
                            title="Revoke Key"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Endpoint Telemetry card */}
              <div
                style={{
                  background: 'rgba(0, 242, 254, 0.05)',
                  border: '1px dashed rgba(0, 242, 254, 0.3)',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  fontSize: '0.8rem',
                  color: '#94a3b8',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00f2fe', fontWeight: 600, marginBottom: '4px' }}>
                  <Terminal size={14} />
                  <span>REST ENDPOINT: /api/v1/audit</span>
                </div>
                Your external services can submit code via POST with <code style={{ color: '#f8fafc' }}>Authorization: Bearer &lt;KEY&gt;</code>. CyberAI evaluates vulnerabilities, extracts CVSS metrics, and responds with drop-in hardened code.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['curl', 'nodejs', 'python', 'github'] as const).map((tab) => (
                  <button
                    key={tab}
                    className={`btn ${selectedSnippetTab === tab ? 'btn-accent' : ''}`}
                    onClick={() => setSelectedSnippetTab(tab)}
                    style={{ fontSize: '0.75rem', padding: '4px 10px', textTransform: 'uppercase' }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative' }}>
                <pre
                  style={{
                    background: '#07090e',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    color: '#e2e8f0',
                    overflowX: 'auto',
                    lineHeight: '1.5',
                  }}
                >
                  {snippets[selectedSnippetTab]}
                </pre>
                <button
                  className="btn"
                  onClick={() => handleCopy(snippets[selectedSnippetTab], `snippet_${selectedSnippetTab}`)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    padding: '4px 10px',
                    fontSize: '0.72rem',
                    background: 'rgba(16, 23, 38, 0.85)',
                  }}
                >
                  {copiedKeyId === `snippet_${selectedSnippetTab}` ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  <span>{copiedKeyId === `snippet_${selectedSnippetTab}` ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.5' }}>
                <strong style={{ color: '#00f2fe' }}>How It Works:</strong> Send your raw code string to CyberAI. The Mythos logic engine analyzes the AST for flaws, computes CVSS scores, and returns <code style={{ color: '#38bdf8' }}>patchedCode</code> with zero placeholders, ready to replace the vulnerable file in your project.
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            STATUS: {serverKeyConfigured ? 'SERVER KEY ACTIVE' : customApiKey ? 'CLIENT OVERRIDE ACTIVE' : 'KEY NEEDED'}
          </div>
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
