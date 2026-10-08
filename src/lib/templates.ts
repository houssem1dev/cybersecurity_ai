// Pre-configured CyberAI Mythos Intelligence & Security Audit Templates

export interface SecurityScenario {
  id: string;
  title: string;
  category: 'mythos' | 'autofix' | 'forensics' | 'defense';
  mode: 'mythos' | 'autofix' | 'forensics' | 'defense' | 'all';
  badge: string;
  prompt: string;
}

export const SECURITY_SCENARIOS: SecurityScenario[] = [
  {
    id: 'mythos-rce-gadget',
    title: 'Mythos: Object Injection & RCE Gadget Chain',
    category: 'mythos',
    mode: 'mythos',
    badge: 'Mythos Exploit Mechanics',
    prompt: `Analyze this Node.js deserialization controller using Claude Mythos exploit mechanics:

\`\`\`javascript
const serialize = require('node-serialize');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

app.get('/dashboard', (req, res) => {
  if (req.cookies.session_state) {
    try {
      const decoded = Buffer.from(req.cookies.session_state, 'base64').toString();
      // Deserializing untrusted cookie data
      const session = serialize.unserialize(decoded);
      return res.render('dashboard', { user: session.username });
    } catch (err) {
      return res.status(500).send("Session error");
    }
  }
  res.redirect('/login');
});
\`\`\`

Conduct an in-depth Mythos analysis:
1. Dissect the AST / Object Injection root-cause mechanics (IIFE execution during deserialization).
2. Trace the gadget chain and exploit prerequisites.
3. Detail what memory and EDR telemetry flags this attack.
4. Provide the 100% hardened, production-ready drop-in code fix using cryptographic signing and schema validation.`,
  },
  {
    id: 'autofix-auth-sqli',
    title: 'Auto-Fix: Broken Auth & SQL Injection in Express',
    category: 'autofix',
    mode: 'autofix',
    badge: 'Autonomous Code Patch',
    prompt: `Analyze this vulnerable user login & password reset service and generate a drop-in secure replacement:

\`\`\`typescript
import { Request, Response } from 'express';
import db from '../database';

export async function loginHandler(req: Request, res: Response) {
  const { username, password } = req.body;
  // Raw string interpolation query
  const query = \`SELECT id, username, password_hash, role, secret_key FROM accounts WHERE username = '\${username}'\`;
  const [user] = await db.raw(query);

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Plaintext comparison fallback
  if (user.password_hash === password) {
    return res.json({ token: user.secret_key, role: user.role });
  }

  return res.status(401).json({ error: 'Incorrect credentials' });
}
\`\`\`

Execute autonomous remediation:
1. Identify all flaws (SQLi, plaintext auth, timing attack, information leakage).
2. Calculate CVSS v3.1 base score.
3. Synthesize the complete, hardened drop-in production TypeScript code using parameterized queries, argon2/bcrypt hashing, constant-time compare, and signed JWTs.`,
  },
  {
    id: 'forensics-memory-hollowing',
    title: 'Forensics: Process Hollowing & Sysmon Telemetry',
    category: 'forensics',
    mode: 'forensics',
    badge: 'Forensic Footprint',
    prompt: `Analyze the forensic footprint and detection telemetry for a process hollowing / in-memory execution sequence:

**Incident Artifacts:**
- Target process: \`C:\\Windows\\System32\\svchost.exe\`
- Telemetry observed:
  * Sysmon Event ID 1 (Process Create) launched svchost.exe with \`CREATE_SUSPENDED\` flag.
  * Sysmon Event ID 10 (ProcessAccess) with \`GrantedAccess = 0x1F0FFF\` (PROCESS_ALL_ACCESS).
  * VirtualAllocEx executed with \`PAGE_EXECUTE_READWRITE\` (0x40).
  * WriteProcessMemory targeting the main executable image base.
  * SetThreadContext pointing EIP/RIP to unbacked memory region.
  * ResumeThread invoked.

Please provide:
1. Step-by-step mechanical breakdown of how this evasion technique circumvents traditional on-disk AV.
2. Kernel and memory forensic artifacts left in Volatility / EDR dumps (Vad root, hollowed PE headers).
3. Exact Sysmon and YARA/Sigma rules to detect and alert on this in SIEM pipelines.`,
  },
  {
    id: 'defense-cloud-ssrf',
    title: 'Cloud Defense: SSRF & AWS IMDSv2 Shield',
    category: 'defense',
    mode: 'defense',
    badge: 'Zero-Trust Shield',
    prompt: `Audit and harden this Python FastAPI external webhook proxy against Server-Side Request Forgery (SSRF) and AWS Cloud IMDSv1 metadata exfiltration:

\`\`\`python
import requests
from fastapi import FastAPI, HTTPException, Query

app = FastAPI()

@app.get("/api/proxy/fetch")
def fetch_external_url(url: str = Query(...)):
    try:
        # Blindly fetching client-supplied URL
        resp = requests.get(url, timeout=5, allow_redirects=True)
        return {"status": resp.status_code, "body": resp.text[:2000]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
\`\`\`

Provide:
1. Root-cause SSRF analysis (AWS 169.254.169.254, DNS rebinding, internal RFC1918 pivoting).
2. Complete hardened Python code implementing IP validation, private CIDR blocking, DNS rebinding protection, and disabling HTTP redirects.
3. AWS IAM & IMDSv2 defensive configuration requirements.`,
  },
];
