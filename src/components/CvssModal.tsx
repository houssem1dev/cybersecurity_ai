'use client';

import React, { useState } from 'react';
import { X, Copy, ArrowRight, ShieldCheck } from 'lucide-react';
import { CvssMetrics, DEFAULT_CVSS, calculateCvssScore } from '@/lib/cvss';

interface CvssModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertVector: (vector: string, score: number, severity: string) => void;
}

export function CvssModal({ isOpen, onClose, onInsertVector }: CvssModalProps) {
  const [metrics, setMetrics] = useState<CvssMetrics>(DEFAULT_CVSS);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const { score, severity, vectorString } = calculateCvssScore(metrics);

  const updateMetric = <K extends keyof CvssMetrics>(key: K, val: CvssMetrics[K]) => {
    setMetrics((prev) => ({ ...prev, [key]: val }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(vectorString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    onInsertVector(vectorString, score, severity);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <ShieldCheck size={20} color="#00f2fe" />
            <span>CVSS v3.1 Interactive Metric Calculator</span>
          </div>
          <button className="tool-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Result Banner */}
          <div className="cvss-score-banner">
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                BASE METRIC SCORE
              </div>
              <div className="cvss-score-large">{score}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className={`cvss-severity-badge severity-${severity}`}>
                {severity}
              </span>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--text-code)',
                  marginTop: '6px',
                }}
              >
                {vectorString}
              </div>
            </div>
          </div>

          {/* Metric Selector Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Attack Vector */}
            <div className="cvss-metric-group">
              <label className="cvss-label">Attack Vector (AV)</label>
              <div className="cvss-options">
                {[
                  { label: 'Network (N)', val: 'N' },
                  { label: 'Adjacent (A)', val: 'A' },
                  { label: 'Local (L)', val: 'L' },
                  { label: 'Physical (P)', val: 'P' },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    className={`cvss-option-btn ${metrics.av === opt.val ? 'selected' : ''}`}
                    onClick={() => updateMetric('av', opt.val as CvssMetrics['av'])}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Attack Complexity */}
            <div className="cvss-metric-group">
              <label className="cvss-label">Attack Complexity (AC)</label>
              <div className="cvss-options">
                {[
                  { label: 'Low (L)', val: 'L' },
                  { label: 'High (H)', val: 'H' },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    className={`cvss-option-btn ${metrics.ac === opt.val ? 'selected' : ''}`}
                    onClick={() => updateMetric('ac', opt.val as CvssMetrics['ac'])}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Privileges Required */}
            <div className="cvss-metric-group">
              <label className="cvss-label">Privileges Required (PR)</label>
              <div className="cvss-options">
                {[
                  { label: 'None (N)', val: 'N' },
                  { label: 'Low (L)', val: 'L' },
                  { label: 'High (H)', val: 'H' },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    className={`cvss-option-btn ${metrics.pr === opt.val ? 'selected' : ''}`}
                    onClick={() => updateMetric('pr', opt.val as CvssMetrics['pr'])}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* User Interaction */}
            <div className="cvss-metric-group">
              <label className="cvss-label">User Interaction (UI)</label>
              <div className="cvss-options">
                {[
                  { label: 'None (N)', val: 'N' },
                  { label: 'Required (R)', val: 'R' },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    className={`cvss-option-btn ${metrics.ui === opt.val ? 'selected' : ''}`}
                    onClick={() => updateMetric('ui', opt.val as CvssMetrics['ui'])}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scope */}
            <div className="cvss-metric-group">
              <label className="cvss-label">Scope (S)</label>
              <div className="cvss-options">
                {[
                  { label: 'Unchanged (U)', val: 'U' },
                  { label: 'Changed (C)', val: 'C' },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    className={`cvss-option-btn ${metrics.s === opt.val ? 'selected' : ''}`}
                    onClick={() => updateMetric('s', opt.val as CvssMetrics['s'])}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Confidentiality */}
            <div className="cvss-metric-group">
              <label className="cvss-label">Confidentiality (C)</label>
              <div className="cvss-options">
                {[
                  { label: 'None (N)', val: 'N' },
                  { label: 'Low (L)', val: 'L' },
                  { label: 'High (H)', val: 'H' },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    className={`cvss-option-btn ${metrics.c === opt.val ? 'selected' : ''}`}
                    onClick={() => updateMetric('c', opt.val as CvssMetrics['c'])}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Integrity */}
            <div className="cvss-metric-group">
              <label className="cvss-label">Integrity (I)</label>
              <div className="cvss-options">
                {[
                  { label: 'None (N)', val: 'N' },
                  { label: 'Low (L)', val: 'L' },
                  { label: 'High (H)', val: 'H' },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    className={`cvss-option-btn ${metrics.i === opt.val ? 'selected' : ''}`}
                    onClick={() => updateMetric('i', opt.val as CvssMetrics['i'])}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="cvss-metric-group">
              <label className="cvss-label">Availability (A)</label>
              <div className="cvss-options">
                {[
                  { label: 'None (N)', val: 'N' },
                  { label: 'Low (L)', val: 'L' },
                  { label: 'High (H)', val: 'H' },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    className={`cvss-option-btn ${metrics.a === opt.val ? 'selected' : ''}`}
                    onClick={() => updateMetric('a', opt.val as CvssMetrics['a'])}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn" onClick={handleCopy}>
            <Copy size={14} />
            <span>{copied ? 'Copied!' : 'Copy Vector'}</span>
          </button>
          <button className="btn btn-primary" onClick={handleInsert}>
            <ArrowRight size={14} />
            <span>Insert Into Chat Analysis</span>
          </button>
        </div>
      </div>
    </div>
  );
}
