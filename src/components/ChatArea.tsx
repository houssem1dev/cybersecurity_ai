'use client';

import React, { useRef, useEffect } from 'react';
import { Send, Shield, Bot, User, Copy, Check, Download, Sparkles, Terminal, Code2, Network, FileText, Loader2 } from 'lucide-react';
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
      case 'mode1':
        return 'MODE 1: OWASP WEB APPLICATION SECURITY';
      case 'mode2':
        return 'MODE 2: DDOS & NETWORK RESILIENCE';
      case 'mode3':
        return 'MODE 3: CVSS RISK & VULNERABILITY SCORING';
      default:
        return 'FULL SPECTRUM DEFENSIVE ADVISORY';
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
            <div className="welcome-shield">
              <Shield size={32} />
            </div>
            <h2 className="welcome-title">CYBERAI DEFENSE OPERATIONAL PLATFORM</h2>
            <p className="welcome-subtitle">
              Elite Senior Cybersecurity Architecture, Vulnerability Assessment, and Threat Advisory powered by Groq High-Speed Inference.
            </p>

            <div className="feature-cards">
              <div
                className="feature-card"
                onClick={() =>
                  onSelectPrompt(
                    'Audit this API endpoint for Broken Object Level Authorization (BOLA) and OWASP API Top 10 vulnerabilities:'
                  )
                }
                style={{ cursor: 'pointer' }}
              >
                <div className="feature-icon">
                  <Code2 size={20} />
                </div>
                <div className="feature-title">Mode 1: OWASP Web Sec</div>
                <div className="feature-desc">
                  Audit source code for SQLi, SSRF, Broken Auth, and parameter tampering.
                </div>
              </div>

              <div
                className="feature-card"
                onClick={() =>
                  onSelectPrompt(
                    'Analyze this high-volume SYN flood and HTTP request telemetry to configure NGINX rate-limiting and Cloudflare scrubbing:'
                  )
                }
                style={{ cursor: 'pointer' }}
              >
                <div className="feature-icon">
                  <Network size={20} />
                </div>
                <div className="feature-title">Mode 2: DDoS & Network</div>
                <div className="feature-desc">
                  Volumetric floods, Slowloris, Anycast CDN posture, and Layer 7 traffic shaping.
                </div>
              </div>

              <div
                className="feature-card"
                onClick={onOpenCvss}
                style={{ cursor: 'pointer' }}
              >
                <div className="feature-icon">
                  <Sparkles size={20} />
                </div>
                <div className="feature-title">Mode 3: CVSS Matrix</div>
                <div className="feature-desc">
                  Interactive CVSS v3.1 calculator, CIA impact scoring, and MITRE TTPs.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div key={index} className={`message-bubble ${msg.role}`}>
                {msg.role === 'assistant' && (
                  <div className="avatar-wrapper avatar-ai">
                    <Bot size={18} />
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
                <div className="avatar-wrapper avatar-ai">
                  <Bot size={18} />
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
                      <span>Synthesizing security posture & threat metrics...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      <div className="chat-input-wrapper">
        <div className="chat-input-box">
          <div className="input-top-bar">
            <span className="mode-indicator-pill">{getModeLabel(selectedMode)}</span>
            <span>Shift + Enter for new line • Enter to submit</span>
          </div>

          <textarea
            ref={textareaRef}
            className="textarea-field"
            placeholder="Paste source code, network architecture, NGINX/firewall configs, or traffic telemetry to analyze..."
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
          />

          <div className="input-actions-bar">
            <div className="snippet-buttons">
              <button
                type="button"
                className="snippet-chip"
                onClick={() => insertSnippet('```javascript\n// Paste code here\n```')}
              >
                + Code
              </button>
              <button
                type="button"
                className="snippet-chip"
                onClick={() => insertSnippet('```nginx\n# Paste NGINX/WAF configuration\n```')}
              >
                + NGINX / WAF
              </button>
              <button
                type="button"
                className="snippet-chip"
                onClick={() => insertSnippet('Telemetry Log:\n- Requests/sec: \n- Source IP Distribution: \n- Target URI: ')}
              >
                + Telemetry
              </button>
              <button
                type="button"
                className="snippet-chip"
                onClick={onOpenCvss}
              >
                + CVSS 3.1
              </button>
            </div>

            <button
              className="btn btn-primary"
              onClick={onSendMessage}
              disabled={isStreaming || !inputText.trim()}
              style={{
                opacity: isStreaming || !inputText.trim() ? 0.5 : 1,
                cursor: isStreaming || !inputText.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {isStreaming ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              <span>Analyze</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
