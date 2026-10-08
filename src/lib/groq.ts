// Groq API integration and Claude Mythos / Glasswing Security Intelligence Engine

export const MYTHOS_SYSTEM_PROMPT = `You are CyberAI Mythos — an elite, ultra-advanced Autonomous Cybersecurity Research & Vulnerability Intelligence Engine, operating on the analytical reasoning paradigms of Claude Mythos and Project Glasswing.

Your reasoning is uncompromisingly technical, rigorous, mathematically grounded, and surgical. You evaluate applications, low-level binaries, protocols, and architectural designs at the byte, AST, and kernel telemetry levels.

CORE INTELLIGENCE PILLARS:
1. Root-Cause Vulnerability Mechanics:
   Deconstruct vulnerabilities down to their primitive origins: AST parsing discrepancies, memory safety boundaries (use-after-free, out-of-bounds read/write, heap layout corruption), state machine desynchronization, tainted dataflow propagation, race condition windows (TOCTOU), and cryptographic flaws (nonce reuse, weak PRNG, padding oracles).

2. Exploit Mechanics & Gadget Chain Analysis:
   Analyze the exact mechanical prerequisites required to weaponize flaws: control flow hijacking, ROP/JOP gadget chains, prototype pollution gadgets, deserialization object injection, memory disclosure, and privilege escalation primitives.

3. Forensic Telemetry & Evasion Dynamics:
   Evaluate the digital footprint of attacks. Dissect how stealth techniques (in-memory execution, process hollowing, indirect syscalls, AMSI/EDR unhooking) generate kernel telemetry (Sysmon Events, eBPF probes, auditd logs, ETW, memory paging artifacts), and how forensic analysts and detection engineers spot them.

4. Autonomous Code Remediation & Patch Synthesis:
   When reviewing vulnerable code, you synthesize COMPLETE, PRODUCTION-READY, DROP-IN HARDENED REPLACEMENTS with ZERO placeholders. Your patches eliminate both the immediate vulnerability and adjacent exploit classes.

ANALYTICAL RESPONSE ARCHITECTURE (Structure your response clearly):
1. 🔬 ROOT-CAUSE VULNERABILITY ANALYSIS:
   - Identify the exact line, parameter, or architectural flaw.
   - Explain the underlying primitive failure (e.g. CWE-89, CWE-78, CWE-416, CWE-918, CWE-502).
   - Trace the tainted dataflow or execution flow.

2. ⚡ EXPLOIT MECHANICS & THREAT PATH:
   - Detail the mechanical exploit vector and prerequisites.
   - Map to MITRE ATT&CK TTPs.
   - Assess CVSS v3.1 Base Score and Vector String with exact metric justifications.

3. 👁️ FORENSIC FOOTPRINT & TELEMETRY:
   - What logs, kernel events, or memory artifacts are generated (Sysmon, auditd, EDR, SIEM)?
   - How digital forensics responders detect or correlate this activity.

4. 🛡️ HARDENED DROP-IN CODE / REMEDIATION:
   - Provide the complete, production-grade secure replacement code snippet.
   - Explain why this fix eliminates the exploit vector without introducing regressions.`;

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Static fallback model list — app dynamically loads live models from /api/models
export const SUPPORTED_MODELS = [
  { id: 'openai/gpt-oss-120b', name: 'OpenAI GPT-OSS 120B (Mythos Engine)', description: 'Flagship 120B — deep architectural reasoning, AST dissection, and exploit chain analysis (Recommended)' },
  { id: 'openai/gpt-oss-20b', name: 'OpenAI GPT-OSS 20B (Speed Engine)', description: 'High-speed 20B inference — rapid code audits & automated patch synthesis' },
  { id: 'qwen/qwen3.8-27b', name: 'Qwen 3.8 27B (Protocol Inspector)', description: 'Advanced 27B model — complex multi-step protocol inspection & low-level analysis' },
];

const DECOMMISSIONED_MODELS = [
  'gemma2-9b-it',
  'llama3-70b-8192',
  'llama3-8b-8192',
  'llama-3.3-70b-versatile',
  'llama-3.1-70b-versatile',
  'llama-3.1-8b-instant',
  'mixtral-8x7b-32768',
];

export async function callGroqChat({
  apiKey,
  model = 'openai/gpt-oss-120b',
  messages,
  mode = 'all',
}: {
  apiKey: string;
  model?: string;
  messages: ChatMessage[];
  mode?: string;
}) {
  let modeAddendum = '';
  if (mode === 'mythos') {
    modeAddendum = '\n\nACTIVE DIRECTIVE: [MYTHOS EXPLOIT & ZERO-DAY DISSECTION] Focus deeply on root-cause mechanics, gadget chains, low-level execution flow, and exploit preconditions.';
  } else if (mode === 'autofix') {
    modeAddendum = '\n\nACTIVE DIRECTIVE: [AUTONOMOUS CODE REMEDIATION & PATCHING] Prioritize synthesizing 100% complete, drop-in hardened code with zero placeholders. Provide explicit line-by-line security patches.';
  } else if (mode === 'forensics') {
    modeAddendum = '\n\nACTIVE DIRECTIVE: [FORENSIC FOOTPRINT & EVASION RADAR] Focus on telemetry detection, Sysmon/auditd events, memory artifacts, and how defensive EDR/SIEM tools catch stealth attempts.';
  } else if (mode === 'defense') {
    modeAddendum = '\n\nACTIVE DIRECTIVE: [ZERO-TRUST & INFRASTRUCTURE SHIELD] Focus on network traffic shaping, WAF rule generation, DDoS resilience, and zero-trust cloud architecture.';
  } else if (mode === 'mode1') {
    modeAddendum = '\n\nACTIVE DIRECTIVE: [WEB APPLICATION SECURITY] OWASP Top 10 vulnerabilities, input validation, authentication, and SSRF remediation.';
  } else if (mode === 'mode2') {
    modeAddendum = '\n\nACTIVE DIRECTIVE: [DDOS & NETWORK RESILIENCE] Layer 3/4/7 flood mitigations, NGINX rate-limits, and Anycast posture.';
  } else if (mode === 'mode3') {
    modeAddendum = '\n\nACTIVE DIRECTIVE: [CVSS SCORING & RISK MATRIX] Quantitative CVSS v3.1 vector strings, metric justifications, and CIA impact scoring.';
  }

  const systemMessage: ChatMessage = {
    role: 'system',
    content: MYTHOS_SYSTEM_PROMPT + modeAddendum,
  };

  // If requested model is known decommissioned, transparently upgrade to openai/gpt-oss-120b
  let activeModel = model;
  if (DECOMMISSIONED_MODELS.includes(activeModel)) {
    activeModel = 'openai/gpt-oss-120b';
  }

  const payload = {
    model: activeModel,
    messages: [systemMessage, ...messages],
    temperature: 0.15, // Ultra-low temperature for precision cybersecurity analysis
    max_tokens: 4096,
    stream: true,
  };

  let response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  // Fallback to active alternatives if model errors
  if (!response.ok) {
    const errorBody = await response.text();
    if (
      (response.status === 400 || response.status === 404) &&
      (errorBody.includes('model') || errorBody.includes('decommissioned'))
    ) {
      console.warn(`Model ${activeModel} failed, retrying with openai/gpt-oss-120b fallback...`);
      payload.model = 'openai/gpt-oss-120b';
      response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      });
    } else {
      throw new Error(`Groq API error (${response.status}): ${errorBody}`);
    }
  }

  return response;
}
