'use client';

import React, { useState } from 'react';
import {
  Code2,
  Play,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  FileCode,
  Terminal,
} from 'lucide-react';
import { MarkdownView } from './MarkdownView';

interface CodePatchStudioProps {
  customApiKey: string;
  serverKeyConfigured: boolean;
  onSendToChat: (code: string) => void;
}

export function CodePatchStudio({
  customApiKey,
  serverKeyConfigured,
  onSendToChat,
}: CodePatchStudioProps) {
  const [inputCode, setInputCode] = useState(`// Paste any project code here to audit and auto-correct vulnerabilities
app.post('/api/v1/auth/reset-password', async (req, res) => {
  const { email, newPassword, resetToken } = req.body;
  
  // Vulnerability: Tainted query & unhashed password
  const query = \`UPDATE users SET password = '\${newPassword}' WHERE email = '\${email}' AND token = '\${resetToken}'\`;
  await db.raw(query);

  res.json({ status: "success", message: "Password updated successfully" });
});`);

  const [language, setLanguage] = useState('typescript');
  const [context, setContext] = useState('Authentication & Password Reset Endpoint');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<{
    auditReport: string;
    patchedCode: string | null;
  } | null>(null);
  const [copiedPatch, setCopiedPatch] = useState(false);
  const [activeView, setActiveView] = useState<'both' | 'patch' | 'report'>('both');

  const handleRunAudit = async () => {
    if (!inputCode.trim() || isAuditing) return;

    setIsAuditing(true);
    setAuditResult(null);

    try {
      const response = await fetch('/api/v1/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: inputCode,
          language,
          context,
          mode: 'autofix',
          apiKeyOverride: customApiKey || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete security audit');
      }

      setAuditResult({
        auditReport: data.auditReport,
        patchedCode: data.patchedCode,
      });
    } catch (err: any) {
      alert(`Audit error: ${err.message || 'Please check your API Key configuration.'}`);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleCopyPatch = () => {
    if (!auditResult?.patchedCode) return;
    navigator.clipboard.writeText(auditResult.patchedCode);
    setCopiedPatch(true);
    setTimeout(() => setCopiedPatch(false), 2000);
  };

  return (
    <div className="code-patch-studio" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '14px', padding: '16px 20px', overflowY: 'auto' }}>
      {/* Studio Header HUD */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(13, 18, 31, 0.75)',
          border: '1px solid rgba(0, 242, 254, 0.2)',
          borderRadius: '10px',
          padding: '14px 18px',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              padding: '8px',
              borderRadius: '8px',
              background: 'rgba(0, 242, 254, 0.1)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              color: '#00f2fe',
            }}
          >
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '0.5px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              PROJECT CODE VULNERABILITY SCANNER &amp; AUTO-PATCH
              <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                MYTHOS ENGINE ACTIVE
              </span>
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Paste vulnerable source code from your apps &bull; CyberAI detects root-cause primitives and synthesizes drop-in production-grade hardened code.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="settings-input"
            style={{ width: '130px', fontSize: '0.8rem', padding: '6px 10px' }}
          >
            <option value="typescript">TypeScript</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="go">Golang</option>
            <option value="rust">Rust</option>
            <option value="c">C / C++</option>
            <option value="php">PHP</option>
            <option value="java">Java</option>
          </select>

          <button
            className="btn btn-accent"
            onClick={handleRunAudit}
            disabled={isAuditing}
            style={{ padding: '8px 18px', fontWeight: 600, fontSize: '0.85rem' }}
          >
            {isAuditing ? (
              <>
                <RotateCcw size={14} className="spin-animation" />
                <span>Auditing AST &amp; Patching...</span>
              </>
            ) : (
              <>
                <Play size={14} fill="#07090e" />
                <span>Audit &amp; Auto-Correct</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Split Grid: Input Code vs Hardened Patch */}
      <div style={{ display: 'grid', gridTemplateColumns: auditResult ? '1fr 1fr' : '1fr', gap: '16px', flex: 1, minHeight: '450px' }}>
        {/* Left: Target Source Code */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(16, 23, 38, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(13, 18, 31, 0.8)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0' }}>
              <FileCode size={15} color="#38bdf8" />
              <span>SOURCE CODE TO AUDIT</span>
            </div>
            <button
              className="btn"
              onClick={() => setInputCode('')}
              style={{ fontSize: '0.72rem', padding: '3px 8px' }}
            >
              Clear
            </button>
          </div>
          <textarea
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="// Paste your source code here..."
            style={{
              flex: 1,
              width: '100%',
              minHeight: '380px',
              background: '#07090e',
              border: 'none',
              padding: '14px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.84rem',
              color: '#f8fafc',
              resize: 'none',
              outline: 'none',
              lineHeight: '1.6',
            }}
          />
        </div>

        {/* Right: Output Patch & Findings */}
        {auditResult && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(16, 23, 38, 0.7)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(13, 18, 31, 0.9)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 600, color: '#10b981' }}>
                <ShieldCheck size={16} />
                <span>HARDENED DROP-IN REPLACEMENT</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {auditResult.patchedCode && (
                  <button
                    className="btn btn-accent"
                    onClick={handleCopyPatch}
                    style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                  >
                    {copiedPatch ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedPatch ? 'Copied Secure Code!' : 'Copy Drop-in Code'}</span>
                  </button>
                )}
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '14px', background: '#07090e' }}>
              {auditResult.patchedCode ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#10b981', fontSize: '0.75rem', fontWeight: 600 }}>
                    <Check size={14} />
                    <span>ZERO-VULNERABILITY REPLACEMENT CODE:</span>
                  </div>
                  <pre
                    style={{
                      background: 'rgba(13, 18, 31, 0.9)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      borderRadius: '8px',
                      padding: '12px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.82rem',
                      color: '#f8fafc',
                      overflowX: 'auto',
                      marginBottom: '16px',
                      lineHeight: '1.5',
                    }}
                  >
                    <code>{auditResult.patchedCode}</code>
                  </pre>
                </div>
              ) : null}

              <div style={{ marginTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00f2fe', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Full Mythos Dissection:
                </span>
                <MarkdownView content={auditResult.auditReport} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
