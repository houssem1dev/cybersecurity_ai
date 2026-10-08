'use client';

import React, { useRef, useEffect } from 'react';
import {
  Send,
  Shield,
  Bot,
  User,
  Copy,
  Check,
  Sparkles,
  Terminal,
  Code2,
  Network,
  Loader2,
  Flame,
  ShieldCheck,
  Radar,
  Lock,
} from 'lucide-react';
import { ChatMessage } from '@/lib/groq';
import { MarkdownView } from './MarkdownView';

interface ChatAreaProps {
  messages: ChatMessage[];
  streamingText: string;
  isStreaming: boolean;
  inputText: string;
  onInputChange: (text: string) => void;
  onSendMessage: () => void;
  selectedMode: string;
  onOpenCvss: () => void;
  onSelectPrompt: (prompt: string) => void;
  onOpenApiHub?: () => void;
}

export function ChatArea({
  messages,
  streamingText,
  isStreaming,
  inputText,
  onInputChange,
  onSendMessage,
  selectedMode,
  onOpenCvss,
  onSelectPrompt,
  onOpenApiHub,
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const copyMessage = (index: number, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'mythos':
        return 'MYTHOS EXPLOIT & ZERO-DAY DISSECTION';
      case 'autofix':
        return 'AUTONOMOUS CODE REMEDIATION & AUTO-PATCH';
      case 'forensics':
        return 'FORENSIC FOOTPRINT & EVASION RADAR';
      case 'defense':
        return 'ZERO-TRUST & INFRASTRUCTURE SHIELD';
      case 'mode1':
        return 'OWASP WEB APPLICATION AUDIT';
      case 'mode2':
        return 'DDOS & NETWORK ATTACK RESILIENCE';
      case 'mode3':
        return 'CVSS VULNERABILITY SCORING';
      default:
        return 'MYTHOS FULL-SPECTRUM INTELLIGENCE';
    }
  };

  const insertSnippet = (snippet: string) => {
    onInputChange(inputText ? `${inputText}\n\n${snippet}` : snippet);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-scroll">
        {messages.length === 0 && !streamingText ? (
          <div className="welcome-screen">
            <div className="welcome-shield" style={{ boxShadow: '0 0 25px rgba(0, 242, 254, 0.3)', borderColor: 'rgba(0, 242, 254, 0.4)' }}>
              <Flame size={32} color="#00f2fe" />
            </div>
            <h2 className="welcome-title" style={{ letterSpacing: '1px' }}>
              CYBERAI MYTHOS INTELLIGENCE
            </h2>
            <p className="welcome-subtitle">
              Autonomous zero-day vulnerability analysis, exploit mechanics dissection, forensic telemetry correlation, and production-grade code remediation inspired by Project Glasswing.
            </p>

            <div className="feature-cards">
              <div
                className="feature-card"
                onClick={() =>
                  onSelectPrompt(
                    'Analyze this code for zero-day memory corruption, AST parsing discrepancies, and ROP/JOP exploit gadget chains:'
                  )
                }
                style={{ cursor: 'pointer' }}
              >
                <div className="feature-icon" style={{ color: '#00f2fe' }}>
                  <Flame size={20} />
                </div>
                <div className="feature-title">Mythos Exploit Mechanics</div>
                <div className="feature-desc">
                  Dissect AST flaws, gadget chains, pointer boundaries, and execution hijacking.
                </div>
              </div>

              <div
                className="feature-card"
                onClick={() =>
                  onSelectPrompt(
                    'Audit this authentication and database controller. Pinpoint all vulnerabilities and provide a 100% complete, hardened, drop-in replacement code without placeholders:'
                  )
                }
                style={{ cursor: 'pointer' }}
              >
                <div className="feature-icon" style={{ color: '#10b981' }}>
                  <ShieldCheck size={20} />
                </div>
                <div className="feature-title">Auto-Patch &amp; Remediation</div>
                <div className="feature-desc">
                  Synthesize production-grade hardened code that completely eliminates vulnerabilities.
                </div>
              </div>

              <div
                className="feature-card"
                onClick={() =>
                  onSelectPrompt(
                    'Detail the forensic telemetry footprint (Sysmon Event IDs, Linux auditd, memory page allocations) for this attack and explain how detection engines catch it:'
                  )
                }
                style={{ cursor: 'pointer' }}
              >
                <div className="feature-icon" style={{ color: '#a855f7' }}>
                  <Radar size={20} />
                </div>
                <div className="feature-title">Forensic Footprint &amp; Radar</div>
                <div className="feature-desc">
                  Evaluate kernel events, ETW telemetry, memory dumps, and EDR unhooking detection.
                </div>
              </div>

              <div
                className="feature-card"
                onClick={() =>
                  onSelectPrompt(
                    'Evaluate our API Gateway and reverse-proxy architecture against Layer 7 DDoS, Slowloris connection exhaustion, and SSRF pivoting:'
                  )
                }
                style={{ cursor: 'pointer' }}
              >
                <div className="feature-icon" style={{ color: '#38bdf8' }}>
                  <Lock size={20} />
                </div>
                <div className="feature-title">Zero-Trust &amp; DDoS Shield</div>
                <div className="feature-desc">
                  Rate-limiting thresholds, scrubbing posture, and infrastructure defense-in-depth.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div key={index} className={`message-bubble ${msg.role}`}>
                {msg.role === 'assistant' && (
                  <div className="avatar-wrapper avatar-ai" style={{ border: '1px solid rgba(0, 242, 254, 0.4)' }}>
                    <Bot size={18} color="#00f2fe" />
                  </div>
                )}

                <div className="message-content">
                  <MarkdownView content={msg.content} />

                  {msg.role === 'assistant' && (
                    <div className="message-toolbar">
                      <button
                        className="tool-btn"
                        onClick={() => copyMessage(index, msg.content)}
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check size={12} color="#10b981" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy Report</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="avatar-wrapper avatar-user">
                    <User size={18} />
                  </div>
                )}
              </div>
            ))}

            {isStreaming && (
              <div className="message-bubble assistant">
                <div className="avatar-wrapper avatar-ai" style={{ border: '1px solid rgba(0, 242, 254, 0.4)' }}>
                  <Bot size={18} color="#00f2fe" />
                </div>
                <div className="message-content">
                  {streamingText ? (
                    <>
                      <MarkdownView content={streamingText} />
                      <span className="cursor-blink" />
                    </>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Deconstructing AST, tracing exploit mechanics &amp; synthesizing patch...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Tray HUD */}
      <div className="chat-input-area">
        <div className="input-hud-bar">
          <div className="active-directive-label">
            <span className="hud-indicator" />
            <span>DIRECTIVE: {getModeLabel(selectedMode)}</span>
          </div>
          <div className="quick-snippets">
            <button
              className="snippet-pill"
              onClick={() => insertSnippet('Analyze AST root cause & gadget chains in this snippet:\n```\n\n```')}
            >
              + Exploit Chain
            </button>
            <button
              className="snippet-pill"
              onClick={() => insertSnippet('Synthesize 100% production-ready drop-in code patch for:\n```\n\n```')}
            >
              + Auto-Patch
            </button>
            <button
              className="snippet-pill"
              onClick={() => insertSnippet('What Sysmon Event IDs and memory artifacts detect this attack?')}
            >
              + Forensics
            </button>
          </div>
        </div>

        <div className="input-box-wrapper">
          <textarea
            ref={textareaRef}
            className="chat-textarea"
            placeholder="Paste code snippet, network trace, or exploit query (Shift + Enter for new line)..."
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            disabled={isStreaming}
          />

          <button
            className={`send-button ${inputText.trim() && !isStreaming ? 'active' : ''}`}
            onClick={onSendMessage}
            disabled={!inputText.trim() || isStreaming}
            title="Execute Mythos Security Analysis"
          >
            {isStreaming ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
