# 🛡️ CyberAI Architect | Defensive Threat & Vulnerability Advisory

Enterprise-grade defensive cybersecurity architecture, OWASP assessment, DDoS resilience, and CVSS v3.1 scoring platform powered by **Groq High-Speed Inference** (`llama-3.3-70b-versatile`, `llama-3.1-8b-instant`, `mixtral-8x7b-32768`).

Built with **Next.js 16 (App Router)** and **Vanilla CSS Design System**, optimized for 1-click deployment on **Vercel**.

---

## ⚡ Core Operational Modes

| Mode | Domain | Primary Focus |
| :--- | :--- | :--- |
| **Mode 1** | **OWASP Web Application Security** | Broken Access Control, SQLi, Command Injection, SSRF, XSS, Cryptographic Failures, and precise code/configuration patch synthesis. |
| **Mode 2** | **DDoS & Network Attack Resilience** | L3/L4 volumetric floods (UDP/ICMP), protocol attacks (SYN floods), Layer 7 HTTP floods/Slowloris, Anycast CDN posture, scrubbing centers, and NGINX/iptables rate-limiting. |
| **Mode 3** | **Vulnerability Scoring & Risk Matrix** | Quantitative scoring (CVSS v3.1/v4.0 vector strings), CIA triad impact analysis (Confidentiality, Integrity, Availability), and MITRE ATT&CK TTP mapping. |

---

## 🏗️ 4-Stage Defensive Response Framework

Every security audit adheres strictly to the four-part analytical response framework:
1. **Executive Summary:** High-level posture, asset exposure, and critical business risk.
2. **Technical Breakdown:** Step-by-step analysis of the vulnerability mechanics, protocol flaw, or attack vector.
3. **Risk Scoring & Impact:** Explicit CVSS v3.1 base score, vector string, and CIA impact evaluation.
4. **Remediation & Hardening Roadmap:** Actionable mitigation steps, defensive configurations (WAF, NGINX, iptables), and code-level patches.

---

## 🚀 Key Features

- **⚡ Real-time Groq Streaming:** Ultra-low latency responses using Groq's LPUs.
- **🎛️ Interactive CVSS v3.1 Calculator:** Real-time visual score dial, vector string generator, and 1-click injection into your audit session.
- **📁 One-Click Audit Scenarios:** Pre-loaded real-world scenarios (Node.js SQLi/Auth, NGINX Slowloris DDoS, Cloud SSRF IMDSv1, Kubernetes Zero-Trust).
- **📋 Export Security Reports:** Download audit findings as clean Markdown reports (.md) with timestamps and CVSS scores.
- **🔒 Enterprise Security Aesthetic:** High-contrast tactical dark theme with glowing cyan/emerald status telemetry and responsive layout.
- **🔑 Dual API Key Management:** Seamlessly reads `GROQ_API_KEY` from server-side Vercel environment variables or allows client-side override in Settings.

---

## 📦 Local Development

1. **Clone the repository and install dependencies:**
   \`\`\`bash
   git clone <your-repo-url>
   cd cyberai
   npm install
   \`\`\`

2. **Configure your Groq API key:**
   Create a `.env.local` file:
   \`\`\`bash
   GROQ_API_KEY=gsk_your_groq_api_key_here
   \`\`\`
   *(Get your free API key at [console.groq.com/keys](https://console.groq.com/keys))*

3. **Start the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploy to Vercel in 3 Steps

### Step 1: Push to GitHub
If you haven't pushed your code to GitHub yet:
\`\`\`bash
git init
git add .
git commit -m "feat: initial commit of CyberAI platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cyberai.git
git push -u origin main
\`\`\`

### Step 2: Import into Vercel
1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **"Add New..."** &rarr; **"Project"**.
3. Select your **`cyberai`** GitHub repository.

### Step 3: Add Environment Variable
In the Vercel project configuration screen:
1. Open the **Environment Variables** section.
2. Add:
   - **Key:** `GROQ_API_KEY`
   - **Value:** `gsk_...` (Your Groq API key)
3. Click **Deploy**.

Your CyberAI platform is now live and globally distributed on Vercel's edge network!

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Runtime:** React 19, TypeScript
- **Styling:** Custom Vanilla CSS Design System (Zero Tailwind bloat)
- **AI Engine:** Groq Cloud API (`llama-3.3-70b-versatile`, `llama-3.1-8b-instant`, `mixtral-8x7b-32768`)
- **Icons:** Lucide React

---

## 📜 License
MIT License. Built for defensive security teams, penetration testers, and security architects.
