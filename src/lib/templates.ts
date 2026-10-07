// Pre-configured Defensive Security Audit Templates

export interface SecurityScenario {
  id: string;
  title: string;
  category: 'web' | 'ddos' | 'scoring' | 'arch';
  mode: 'mode1' | 'mode2' | 'mode3' | 'all';
  badge: string;
  prompt: string;
}

export const SECURITY_SCENARIOS: SecurityScenario[] = [
  {
    id: 'owasp-sqli-auth',
    title: 'OWASP: SQLi & Broken Auth in Node.js',
    category: 'web',
    mode: 'mode1',
    badge: 'Mode 1: Web Security',
    prompt: `Please perform a Mode 1 (OWASP Web App Security) vulnerability assessment on this Node.js/Express authentication snippet:

\`\`\`javascript
app.post('/api/v1/auth/login', async (req, res) => {
  const { username, password } = req.body;
  // Raw concatenation query
  const query = \`SELECT id, role, secret_token, password_hash FROM users WHERE username = '\${username}'\`;
  const result = await db.raw(query);

  if (!result || result.length === 0) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const user = result[0];
  // Plaintext compare fallback
  if (user.password_hash === password) {
    req.session.userId = user.id;
    req.session.role = user.role;
    return res.json({ token: user.secret_token, role: user.role });
  }
  return res.status(401).json({ error: "Invalid credentials" });
});
\`\`\`

Provide the complete 4-stage response: Executive Summary, Technical Breakdown, Risk Scoring (CVSS v3.1), and Remediation & Hardening Roadmap.`,
  },
  {
    id: 'ddos-slowloris-nginx',
    title: 'DDoS: Slowloris & HTTP Flood Telemetry',
    category: 'ddos',
    mode: 'mode2',
    badge: 'Mode 2: DDoS Resilience',
    prompt: `Please evaluate this NGINX ingress reverse-proxy configuration and Layer 7 telemetry under high connection saturation:

**Incident Telemetry:**
- Inbound concurrent TCP connections spiked to 65,000 across 400 source IPs.
- Worker connections in NGINX exhausted (\`768 worker_connections are not enough\`).
- TTFB (Time to First Byte) increased from 42ms to 28,000ms.
- Clients sending partial HTTP headers at 1 byte every 12 seconds with no CRLF termination.

**Current NGINX Config:**
\`\`\`nginx
server {
    listen 80;
    server_name api.defense.internal;

    location / {
        proxy_pass http://backend_pool;
        proxy_read_timeout 300;
        proxy_send_timeout 300;
        client_body_timeout 120s;
        client_header_timeout 120s;
        keepalive_timeout 75s;
    }
}
\`\`\`

Evaluate this under Mode 2 (DDoS & Network Attack Analysis). Provide rate-limiting architecture, connection timeouts, iptables/eBPF mitigations, and Anycast CDN posture.`,
  },
  {
    id: 'cloud-ssrf-imds',
    title: 'Cloud SSRF & AWS IMDSv1 Audit',
    category: 'web',
    mode: 'mode1',
    badge: 'Mode 1: SSRF Audit',
    prompt: `Perform a defensive security assessment on this Python FastAPI webhook validator endpoint:

\`\`\`python
import requests
from fastapi import FastAPI, HTTPException, Query

app = FastAPI()

@app.get("/api/proxy/fetch-preview")
def fetch_preview(target_url: str = Query(...)):
    try:
        # Fetch target url provided by user
        resp = requests.get(target_url, timeout=5, allow_redirects=True)
        return {"status": resp.status_code, "content": resp.text[:1000]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
\`\`\`

Environment:
- Container runs in AWS ECS Fargate with an IAM task role attached.
- Target metadata service at 169.254.169.254 is reachable within the VPC subnet.

Provide Executive Summary, Technical Breakdown, CVSS v3.1 score, and robust code & AWS IMDSv2 hardening recommendations.`,
  },
  {
    id: 'zero-trust-k8s',
    title: 'Zero-Trust Network & Egress Topology',
    category: 'arch',
    mode: 'mode3',
    badge: 'Mode 3: Risk Scoring',
    prompt: `Analyze the following Kubernetes microservice network topology and calculate the CVSS v3.1 risk exposure under Mode 3:

**Architecture Overview:**
- Single Kubernetes namespace \`production\` hosting frontend web pods, payment gateway microservice, and customer database.
- Flat pod-to-pod networking (Flannel CNI) with no NetworkPolicies deployed.
- Payment pod holds PCI-DSS tokenization keys in memory.
- Default egress allows unrestricted outbound 0.0.0.0/0 on any TCP/UDP port.

Evaluate the lateral movement exposure, exfiltration risk, calculate the CVSS score, and provide the Zero-Trust Network Access (ZTNA) NetworkPolicy remediation matrix.`,
  },
];
