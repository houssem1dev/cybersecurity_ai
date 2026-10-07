import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CyberAI Architect | Defensive Threat & Vulnerability Advisory',
  description: 'Enterprise-grade defensive cybersecurity architecture, OWASP assessment, DDoS resilience, and CVSS v3.1 scoring powered by Groq high-speed AI inference.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="cyber-bg" />
        {children}
      </body>
    </html>
  );
}
