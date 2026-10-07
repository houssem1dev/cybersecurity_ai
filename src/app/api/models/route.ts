import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const apiKeyOverride = searchParams.get('apiKey');
  const apiKey = apiKeyOverride || process.env.GROQ_API_KEY;

  // Return static fallback list if no API key configured
  if (!apiKey) {
    return NextResponse.json({ models: FALLBACK_MODELS, source: 'fallback' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ models: FALLBACK_MODELS, source: 'fallback' });
    }

    const data = await response.json();

    // Filter to only text/chat models (exclude whisper, tts, guard, etc.)
    const chatModels = (data.data || [])
      .filter((m: { id: string }) => {
        const id = m.id.toLowerCase();
        return (
          !id.includes('whisper') &&
          !id.includes('tts') &&
          !id.includes('guard') &&
          !id.includes('moderation') &&
          !id.includes('vision') &&
          !id.includes('tool-use') &&
          !id.includes('playai') &&
          !id.includes('distil-whisper') &&
          !id.includes('allam')
        );
      })
      .map((m: { id: string }) => ({
        id: m.id,
        name: formatModelName(m.id),
        description: describeModel(m.id),
      }))
      .sort((a: {id: string}, b: {id: string}) => a.id.localeCompare(b.id));

    if (chatModels.length === 0) {
      return NextResponse.json({ models: FALLBACK_MODELS, source: 'fallback' });
    }

    return NextResponse.json({ models: chatModels, source: 'live' });
  } catch {
    return NextResponse.json({ models: FALLBACK_MODELS, source: 'fallback' });
  }
}

function formatModelName(id: string): string {
  return id
    .replace(/^(meta-llama|mistralai|google|qwen|deepseek-ai)\//i, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace('Versatile', '(Versatile)')
    .replace('Instant', '(Instant)')
    .trim();
}

function describeModel(id: string): string {
  const lower = id.toLowerCase();
  if (lower.includes('70b') || lower.includes('72b') || lower.includes('27b')) return 'High-capability model — deep vulnerability analysis & threat assessment';
  if (lower.includes('8b') || lower.includes('7b') || lower.includes('9b')) return 'Fast inference — rapid code triage & real-time log inspection';
  if (lower.includes('mixtral') || lower.includes('32768')) return 'Extended 32k context — large codebases & full log dump analysis';
  if (lower.includes('qwen')) return 'Alibaba Qwen model — strong multilingual & code reasoning';
  if (lower.includes('gemma')) return 'Google Gemma — efficient open-weight model for structured analysis';
  if (lower.includes('deepseek')) return 'DeepSeek reasoning model — complex multi-step security inference';
  if (lower.includes('compound')) return 'Groq compound model — built-in tool use and search';
  return 'General purpose chat model';
}

// Curated safe fallback list if Groq API is unavailable
export const FALLBACK_MODELS = [
  { id: 'openai/gpt-oss-120b', name: 'OpenAI GPT-OSS 120B', description: 'Flagship open-weights 120B — deep architectural reasoning, built-in code analysis (Recommended)' },
  { id: 'openai/gpt-oss-20b', name: 'OpenAI GPT-OSS 20B', description: 'Ultra-fast 20B inference — rapid code audits & real-time log triage' },
  { id: 'qwen/qwen3.8-27b', name: 'Qwen 3.8 27B (Alibaba)', description: 'High-capability 27B model — complex multi-step security analysis & protocol inspection' },
];
