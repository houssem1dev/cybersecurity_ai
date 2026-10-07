import { NextResponse } from 'next/server';

export async function GET() {
  const hasEnvKey = Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim().length > 0);
  return NextResponse.json({
    status: 'online',
    serverKeyConfigured: hasEnvKey,
    timestamp: new Date().toISOString(),
    engine: 'Groq Cloud High-Speed Inference',
  });
}
