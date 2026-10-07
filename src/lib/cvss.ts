// CVSS v3.1 Complete Calculator & Vector Generator

export interface CvssMetrics {
  av: 'N' | 'A' | 'L' | 'P'; // Attack Vector
  ac: 'L' | 'H';             // Attack Complexity
  pr: 'N' | 'L' | 'H';       // Privileges Required
  ui: 'N' | 'R';             // User Interaction
  s: 'U' | 'C';              // Scope
  c: 'N' | 'L' | 'H';        // Confidentiality
  i: 'N' | 'L' | 'H';        // Integrity
  a: 'N' | 'L' | 'H';        // Availability
}

export const DEFAULT_CVSS: CvssMetrics = {
  av: 'N',
  ac: 'L',
  pr: 'N',
  ui: 'N',
  s: 'U',
  c: 'H',
  i: 'H',
  a: 'H',
};

const AV_WEIGHTS = { N: 0.85, A: 0.62, L: 0.55, P: 0.2 };
const AC_WEIGHTS = { L: 0.77, H: 0.44 };
const PR_WEIGHTS = {
  U: { N: 0.85, L: 0.62, H: 0.27 },
  C: { N: 0.85, L: 0.68, H: 0.50 },
};
const UI_WEIGHTS = { N: 0.85, R: 0.62 };
const CIA_WEIGHTS = { N: 0.0, L: 0.22, H: 0.56 };

function roundup(val: number): number {
  const precision = 10;
  return Math.ceil(val * precision) / precision;
}

export function calculateCvssScore(m: CvssMetrics): {
  score: number;
  severity: 'None' | 'Low' | 'Medium' | 'High' | 'Critical';
  vectorString: string;
} {
  const av = AV_WEIGHTS[m.av];
  const ac = AC_WEIGHTS[m.ac];
  const pr = PR_WEIGHTS[m.s][m.pr];
  const ui = UI_WEIGHTS[m.ui];

  const c = CIA_WEIGHTS[m.c];
  const i = CIA_WEIGHTS[m.i];
  const a = CIA_WEIGHTS[m.a];

  const iss = 1 - (1 - c) * (1 - i) * (1 - a);

  let impact: number;
  if (m.s === 'U') {
    impact = 6.42 * iss;
  } else {
    impact = 7.52 * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15);
  }

  const exploitability = 8.22 * av * ac * pr * ui;

  let baseScore = 0;
  if (impact > 0) {
    if (m.s === 'U') {
      baseScore = roundup(Math.min(impact + exploitability, 10));
    } else {
      baseScore = roundup(Math.min(1.08 * (impact + exploitability), 10));
    }
  }

  // Bound to 0.0 - 10.0
  baseScore = Math.max(0, Math.min(10, Number(baseScore.toFixed(1))));

  let severity: 'None' | 'Low' | 'Medium' | 'High' | 'Critical' = 'None';
  if (baseScore >= 9.0) severity = 'Critical';
  else if (baseScore >= 7.0) severity = 'High';
  else if (baseScore >= 4.0) severity = 'Medium';
  else if (baseScore > 0.0) severity = 'Low';

  const vectorString = `CVSS:3.1/AV:${m.av}/AC:${m.ac}/PR:${m.pr}/UI:${m.ui}/S:${m.s}/C:${m.c}/I:${m.i}/A:${m.a}`;

  return { score: baseScore, severity, vectorString };
}
