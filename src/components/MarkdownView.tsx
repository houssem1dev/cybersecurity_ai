'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface MarkdownViewProps {
  content: string;
}

export function MarkdownView({ content }: MarkdownViewProps) {
  // Parse blocks: code fences vs standard text blocks
  const parts: React.ReactNode[] = [];
  const lines = content.split('\n');
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = '';
  let blockIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        const codeText = codeBuffer.join('\n');
        parts.push(
          <CodeBlock key={`code-${blockIndex++}`} code={codeText} lang={codeLang} />
        );
        codeBuffer = [];
        codeLang = '';
        inCodeBlock = false;
      } else {
        // Start code block
        inCodeBlock = true;
        codeLang = line.trim().slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Standard markdown line formatting
    parts.push(<MarkdownLine key={`line-${i}`} line={line} />);
  }

  // If ended while still in code block
  if (inCodeBlock && codeBuffer.length > 0) {
    parts.push(
      <CodeBlock key={`code-${blockIndex++}`} code={codeBuffer.join('\n')} lang={codeLang} />
    );
  }

  return <div className="prose">{parts}</div>;
}

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: 'relative', margin: '0.85rem 0' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#0a0e17',
          borderTopLeftRadius: '6px',
          borderTopRightRadius: '6px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderBottom: 'none',
          padding: '4px 10px',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <span>{lang ? lang.toUpperCase() : 'CODE'}</span>
        <button
          className="tool-btn"
          onClick={handleCopy}
          style={{ padding: '2px 6px', fontSize: '0.7rem' }}
        >
          {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

function MarkdownLine({ line }: { line: string }) {
  const trimmed = line.trim();

  if (!trimmed) {
    return <div style={{ height: '0.45rem' }} />;
  }

  if (trimmed.startsWith('### ')) {
    return <h3>{renderInline(trimmed.slice(4))}</h3>;
  }
  if (trimmed.startsWith('## ')) {
    return <h2>{renderInline(trimmed.slice(3))}</h2>;
  }
  if (trimmed.startsWith('# ')) {
    return <h1>{renderInline(trimmed.slice(2))}</h1>;
  }

  if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
    return (
      <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
        <span style={{ color: 'var(--accent-cyan)' }}>•</span>
        <div>{renderInline(trimmed.slice(2))}</div>
      </div>
    );
  }

  if (/^\d+\.\s/.test(trimmed)) {
    const numMatch = trimmed.match(/^(\d+\.)\s(.*)$/);
    if (numMatch) {
      return (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
          <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            {numMatch[1]}
          </span>
          <div>{renderInline(numMatch[2])}</div>
        </div>
      );
    }
  }

  if (trimmed.startsWith('> ')) {
    return (
      <div
        style={{
          borderLeft: '3px solid var(--accent-cyan)',
          paddingLeft: '10px',
          color: '#cbd5e1',
          margin: '0.5rem 0',
          background: 'rgba(0, 242, 254, 0.04)',
          padding: '6px 12px',
          borderRadius: '0 6px 6px 0',
        }}
      >
        {renderInline(trimmed.slice(2))}
      </div>
    );
  }

  return <p>{renderInline(line)}</p>;
}

function renderInline(text: string): React.ReactNode {
  // Split on bold (**...**) and inline code (`...`)
  const tokens = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return tokens.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const boldText = part.slice(2, -2);
      // Highlight severity words
      if (boldText.toLowerCase().includes('critical')) {
        return <strong key={idx} style={{ color: '#f87171' }}>{boldText}</strong>;
      }
      if (boldText.toLowerCase().includes('high')) {
        return <strong key={idx} style={{ color: '#fb923c' }}>{boldText}</strong>;
      }
      if (boldText.toLowerCase().includes('medium')) {
        return <strong key={idx} style={{ color: '#facc15' }}>{boldText}</strong>;
      }
      if (boldText.toLowerCase().includes('low')) {
        return <strong key={idx} style={{ color: '#60a5fa' }}>{boldText}</strong>;
      }
      return <strong key={idx} style={{ color: '#fff' }}>{boldText}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return <code key={idx}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
}
