'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal, ExternalLink } from 'lucide-react';

interface MarkdownViewProps {
  content: string;
}

// Check if string contains Arabic characters
export function containsArabic(text: string): boolean {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicRegex.test(text);
}

// Sanitize raw AI output to remove corrupt syntax like ****, stray symbols, etc.
function sanitizeMarkdown(raw: string): string {
  if (!raw) return '';
  return raw
    // Replace 4 or more asterisks with clean divider or 2 asterisks
    .replace(/\*{4,}/g, '---')
    // Remove empty bold tags ****
    .replace(/\*\*\s*\*\*/g, '')
    // Normalize excessive consecutive ellipsis
    .replace(/\.{4,}/g, '...')
    // Fix broken bullets like *** or * *
    .replace(/^(\s*)\*\s+\*\s+/gm, '$1- ');
}

export function MarkdownView({ content }: MarkdownViewProps) {
  const cleanContent = sanitizeMarkdown(content);
  const lines = cleanContent.split('\n');

  const blocks: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = '';

  let inTable = false;
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];

  let blockKey = 0;

  const flushTable = () => {
    if (inTable && (tableHeader.length > 0 || tableRows.length > 0)) {
      blocks.push(
        <MarkdownTable
          key={`table-${blockKey++}`}
          header={tableHeader}
          rows={tableRows}
        />
      );
      tableHeader = [];
      tableRows = [];
      inTable = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // 1. Code Fence Start / End
    if (trimmed.startsWith('```')) {
      flushTable();
      if (inCodeBlock) {
        // Close code block
        blocks.push(
          <CodeBlock
            key={`code-${blockKey++}`}
            code={codeBuffer.join('\n')}
            lang={codeLang}
          />
        );
        codeBuffer = [];
        codeLang = '';
        inCodeBlock = false;
      } else {
        // Start code block
        inCodeBlock = true;
        codeLang = trimmed.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(rawLine);
      continue;
    }

    // 2. Table parsing (lines starting and ending with | or containing multiple |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length > 2) {
      const cells = trimmed
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());

      // Check if it's the divider row |---|---|
      const isDivider = cells.every((c) => /^:?-+:?$/.test(c));

      if (isDivider) {
        // It's the table separator row, mark table mode
        inTable = true;
      } else if (!inTable && cells.length > 0) {
        // Potential table header
        tableHeader = cells;
        inTable = true;
      } else if (inTable) {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable();
    }

    // 3. Horizontal Rules (---, ***, ___)
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(trimmed)) {
      blocks.push(
        <hr
          key={`hr-${blockKey++}`}
          style={{
            borderColor: 'rgba(255, 255, 255, 0.1)',
            margin: '1rem 0',
            borderStyle: 'solid',
            borderWidth: '1px 0 0 0',
          }}
        />
      );
      continue;
    }

    // 4. Standard Block / Line
    blocks.push(<MarkdownLine key={`line-${blockKey++}`} line={rawLine} />);
  }

  // Flush any open blocks
  if (inCodeBlock && codeBuffer.length > 0) {
    blocks.push(
      <CodeBlock
        key={`code-${blockKey++}`}
        code={codeBuffer.join('\n')}
        lang={codeLang}
      />
    );
  }
  flushTable();

  return <div className="prose markdown-container">{blocks}</div>;
}

// Code Block with Syntax Bar and 1-Click Copy
function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'relative',
        margin: '0.85rem 0',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid rgba(0, 242, 254, 0.2)',
        direction: 'ltr',
        textAlign: 'left',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#0a0e17',
          padding: '6px 12px',
          fontSize: '0.74rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Terminal size={13} color="#00f2fe" />
          <span style={{ color: '#38bdf8', fontWeight: 600 }}>
            {lang ? lang.toUpperCase() : 'SNIPPET'}
          </span>
        </div>
        <button
          className="tool-btn"
          onClick={handleCopy}
          style={{ padding: '2px 8px', fontSize: '0.72rem' }}
          title="Copy code"
        >
          {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
          <span>{copied ? 'Copied' : 'Copy Code'}</span>
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          background: '#04060a',
          padding: '1rem',
          overflowX: 'auto',
          fontSize: '0.82rem',
          fontFamily: 'var(--font-mono)',
          color: '#f8fafc',
          lineHeight: '1.55',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Markdown Table Renderer
function MarkdownTable({
  header,
  rows,
}: {
  header: string[];
  rows: string[][];
}) {
  return (
    <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.82rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(13, 18, 31, 0.7)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        {header.length > 0 && (
          <thead>
            <tr style={{ background: 'rgba(0, 242, 254, 0.08)', borderBottom: '1px solid rgba(0, 242, 254, 0.2)' }}>
              {header.map((col, idx) => (
                <th
                  key={idx}
                  style={{
                    padding: '8px 12px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#f8fafc',
                    borderRight: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  {renderInline(col)}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, rIdx) => (
            <tr
              key={rIdx}
              style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                background: rIdx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
              }}
            >
              {row.map((cell, cIdx) => (
                <td
                  key={cIdx}
                  style={{
                    padding: '8px 12px',
                    borderRight: '1px solid rgba(255, 255, 255, 0.06)',
                    color: '#cbd5e1',
                  }}
                >
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Single Markdown Line Component with Arabic / RTL Awareness
function MarkdownLine({ line }: { line: string }) {
  const trimmed = line.trim();

  if (!trimmed) {
    return <div style={{ height: '0.4rem' }} />;
  }

  const isRtl = containsArabic(trimmed);
  const bidiStyle: React.CSSProperties = {
    direction: isRtl ? 'rtl' : 'ltr',
    textAlign: isRtl ? 'right' : 'left',
    unicodeBidi: 'plaintext',
    lineHeight: isRtl ? '1.8' : '1.6',
    fontFamily: isRtl
      ? "'Cairo', 'Segoe UI', -apple-system, sans-serif"
      : 'var(--font-sans)',
  };

  // Headers
  if (trimmed.startsWith('#### ')) {
    return <h4 style={bidiStyle}>{renderInline(trimmed.slice(5), isRtl)}</h4>;
  }
  if (trimmed.startsWith('### ')) {
    return <h3 style={bidiStyle}>{renderInline(trimmed.slice(4), isRtl)}</h3>;
  }
  if (trimmed.startsWith('## ')) {
    return <h2 style={bidiStyle}>{renderInline(trimmed.slice(3), isRtl)}</h2>;
  }
  if (trimmed.startsWith('# ')) {
    return <h1 style={bidiStyle}>{renderInline(trimmed.slice(2), isRtl)}</h1>;
  }

  // Bullet Lists
  if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
    return (
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '5px',
          flexDirection: isRtl ? 'row-reverse' : 'row',
          ...bidiStyle,
        }}
      >
        <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>•</span>
        <div style={{ flex: 1 }}>{renderInline(trimmed.slice(2), isRtl)}</div>
      </div>
    );
  }

  // Numbered Lists
  if (/^\d+\.\s/.test(trimmed)) {
    const numMatch = trimmed.match(/^(\d+\.)\s(.*)$/);
    if (numMatch) {
      return (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '5px',
            flexDirection: isRtl ? 'row-reverse' : 'row',
            ...bidiStyle,
          }}
        >
          <span
            style={{
              color: 'var(--accent-cyan)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            {numMatch[1]}
          </span>
          <div style={{ flex: 1 }}>{renderInline(numMatch[2], isRtl)}</div>
        </div>
      );
    }
  }

  // Blockquotes
  if (trimmed.startsWith('> ')) {
    return (
      <div
        style={{
          borderLeft: isRtl ? 'none' : '3px solid var(--accent-cyan)',
          borderRight: isRtl ? '3px solid var(--accent-cyan)' : 'none',
          padding: '6px 12px',
          color: '#cbd5e1',
          margin: '0.5rem 0',
          background: 'rgba(0, 242, 254, 0.04)',
          borderRadius: isRtl ? '6px 0 0 6px' : '0 6px 6px 0',
          ...bidiStyle,
        }}
      >
        {renderInline(trimmed.slice(2), isRtl)}
      </div>
    );
  }

  // Regular paragraph
  return <p style={bidiStyle}>{renderInline(line, isRtl)}</p>;
}

// Tokenize text into bold, inline code, and links with bidirectional isolation
function renderInline(text: string, isParentRtl: boolean = false): React.ReactNode {
  if (!text) return null;

  // Clean empty asterisks or corrupt symbols
  let cleaned = text
    .replace(/\*{4,}/g, '')
    .replace(/\*\*\s*\*\*/g, '');

  // Regex matching inline code `...`, bold ***...*** or **...**, and links [text](url)
  const regex = /(`[^`]+`|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = cleaned.split(regex);

  return parts.map((part, idx) => {
    if (!part) return null;

    // Inline code `...`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      const codeVal = part.slice(1, -1);
      return (
        <code
          key={idx}
          style={{
            direction: 'ltr',
            unicodeBidi: 'isolate',
            display: 'inline-block',
            margin: '0 2px',
          }}
        >
          {codeVal}
        </code>
      );
    }

    // Bold Italic ***...***
    if (part.startsWith('***') && part.endsWith('***') && part.length >= 6) {
      const val = part.slice(3, -3);
      return (
        <strong key={idx} style={{ color: '#00f2fe' }}>
          <em>{val}</em>
        </strong>
      );
    }

    // Bold **...**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const boldText = part.slice(2, -2).trim();
      if (!boldText) return null;

      const lower = boldText.toLowerCase();
      let color = '#ffffff';
      if (lower.includes('critical') || lower.includes('حرجة') || lower.includes('خطير')) {
        color = '#f87171';
      } else if (lower.includes('high') || lower.includes('عالية')) {
        color = '#fb923c';
      } else if (lower.includes('medium') || lower.includes('متوسطة')) {
        color = '#facc15';
      } else if (lower.includes('low') || lower.includes('منخفضة')) {
        color = '#60a5fa';
      }

      const isPartRtl = containsArabic(boldText);
      return (
        <strong
          key={idx}
          style={{
            color,
            unicodeBidi: isParentRtl && !isPartRtl ? 'isolate' : undefined,
            direction: isParentRtl && !isPartRtl ? 'ltr' : undefined,
          }}
        >
          {boldText}
        </strong>
      );
    }

    // Links [text](url)
    if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        return (
          <a
            key={idx}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#00f2fe', textDecoration: 'underline' }}
          >
            {linkMatch[1]}
          </a>
        );
      }
    }

    // Plain text: if in RTL mode and has purely English/Latin technical words, isolate them to prevent punctuation flipping
    if (isParentRtl) {
      return (
        <span key={idx} style={{ unicodeBidi: 'plaintext' }}>
          {part}
        </span>
      );
    }

    return part;
  });
}
