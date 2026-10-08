# 🛡️ CyberAI Mythos | Glasswing Cybersecurity & Autonomous Patching Engine

Ultra-advanced cybersecurity vulnerability intelligence, exploit mechanics dissection, and automated code remediation platform inspired by **Claude Mythos (Project Glasswing)** and powered by **Groq High-Speed Inference** (`openai/gpt-oss-120b`, `openai/gpt-oss-20b`, `qwen/qwen3.8-27b`).

Built with **Next.js 16 (App Router)** and **Tactical Cyber HUD Vanilla CSS Design System**, optimized for 1-click deployment on **Vercel**.

---

## ⚡ Mythos Intelligence Directives

| Directive | Focus Domain | Primary Capabilities |
| :--- | :--- | :--- |
| **Mythos Exploit Mechanics** | **Zero-Day & Exploit Paths** | AST parsing discrepancies, memory safety boundaries (UAF, OOB, heap corruption), ROP/JOP gadget chains, and execution flow hijacking. |
| **Autonomous Code Remediation** | **Auto-Fix & Patch Synthesis** | Scans vulnerable files and synthesizes 100% production-ready, zero-placeholder drop-in code patches with cryptographic verification. |
| **Forensic Footprint & Radar** | **Telemetry & Detection Eng.** | Sysmon Event IDs (1, 8, 10), Linux eBPF/auditd, memory page artifacts, ETW events, and detection engineering against stealth evasion. |
| **Zero-Trust & Infra Shield** | **Cloud & Network Defense** | L3/L4/L7 DDoS resilience, API Gateway rate-limiting, WAF rule generation, and cloud IAM boundary enforcement. |

---

## 🚀 Key Features

- **⚡ Claude Mythos Reasoning Engine:** Deep, multi-stage vulnerability analysis modeling Project Glasswing's zero-day and exploit path logic.
- **🛠️ Auto-Patch Studio:** Dedicated studio view to paste code from your projects and receive instantaneous drop-in hardened code with zero placeholders.
- **🔑 Project API Key & Integration Hub:** Generate project keys (`cai_live_...`) to connect external apps, CI/CD pipelines, or microservices directly to CyberAI.
- **🌐 REST Endpoint `/api/v1/audit`:** External REST API for programmatic code scanning and patch retrieval via cURL, Node.js, Python, or GitHub Actions.
- **🎛️ Interactive CVSS v3.1 Matrix:** Visual dial calculator, vector string generator, and 1-click prompt injection.
- **📋 Export Tactical Reports:** 1-click export of structured security audits to Markdown (`.md`).
- **🪟 Tactical Glass HUD:** Cyberpunk dark mode with glowing cyan/emerald telemetry beacons and responsive controls.

---

## 🔌 Link Your Projects via REST API

You can connect external applications to automatically scan and correct vulnerabilities:

### 1. Terminal / cURL
```bash
curl -X POST "http://localhost:3000/api/v1/audit" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer cai_live_YOUR_PROJECT_KEY" \
  -d '{
    "code": "const q = \"SELECT * FROM users WHERE id=\" + req.query.id; db.query(q);",
    "language": "javascript",
    "mode": "autofix"
  }'
```

### 2. Node.js / Express
```javascript
const res = await fetch('http://localhost:3000/api/v1/audit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer cai_live_YOUR_PROJECT_KEY'
  },
  body: JSON.stringify({
    code: sourceCode,
    language: 'typescript',
    mode: 'autofix'
  })
});

const { auditReport, patchedCode } = await res.json();
console.log('Patched Code:\n', patchedCode);
```

### 3. Python
```python
import requests

res = requests.post(
    "http://localhost:3000/api/v1/audit",
    headers={"Authorization": "Bearer cai_live_YOUR_PROJECT_KEY"},
    json={
        "code": open("app/auth.py").read(),
        "language": "python",
        "mode": "autofix"
    }
)
data = res.json()
print("Secure Patch:\n", data.get("patchedCode"))
```

---

## 📦 Local Development

1. **Clone repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure your Groq API key:**
   Create a `.env.local` file:
   ```bash
   GROQ_API_KEY=gsk_your_groq_api_key_here
   ```
   *(Obtain a free key at [console.groq.com/keys](https://console.groq.com/keys))*

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🌐 Deploy to Vercel

1. Push your repository to GitHub.
2. Import repository into [Vercel](https://vercel.com).
3. Set Environment Variable: `GROQ_API_KEY` = your Groq API key.
4. Click **Deploy**.
