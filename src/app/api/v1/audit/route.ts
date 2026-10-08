import { NextRequest, NextResponse } from 'next/server';
import { callGroqChat, ChatMessage } from '@/lib/groq';

export const runtime = 'nodejs';

// POST /api/v1/audit - External API endpoint for linked apps to audit and auto-correct code
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    const body = await req.json().catch(() => ({}));
    const {
      code,
      language = 'unknown',
      context = '',
      mode = 'autofix',
      apiKeyOverride,
    } = body;

    // Use Groq API key from request, or server environment
    const groqKey = apiKeyOverride || bearerToken?.startsWith('gsk_') ? (bearerToken || apiKeyOverride) : (apiKeyOverride || process.env.GROQ_API_KEY);

    if (!groqKey) {
      return NextResponse.json(
        {
          error: 'GROQ_API_KEY is not configured on the server. Please provide an apiKeyOverride or set GROQ_API_KEY in environment variables.',
          docs: '/api/v1/audit supports { code, language, mode, apiKeyOverride }',
        },
        { status: 401 }
      );
    }

    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return NextResponse.json(
        {
          error: 'Missing required field: "code" must be a non-empty string.',
          example: {
            code: 'app.post("/login", (req, res) => { ... })',
            language: 'javascript',
            mode: 'autofix',
          },
        },
        { status: 400 }
      );
    }

    // Build specialized prompt for project code security audit and patch synthesis
    const auditPrompt = `PROJECT CODE VULNERABILITY AUDIT & AUTO-CORRECTION REQUEST

Target Language: ${language}
Context/Description: ${context || 'Production Application Service'}

Source Code to Audit:
\`\`\`${language}
${code}
\`\`\`

Instructions:
1. Conduct a deep Mythos-grade security audit on this code.
2. Identify all vulnerabilities (SQL injection, broken auth, SSRF, memory safety, RCE, IDOR, race conditions, deserialization, etc.).
3. Formulate the exact root-cause explanation for each flaw and assess CVSS v3.1 severity.
4. Provide the COMPLETE, PRODUCTION-READY, HARDENED DROP-IN REPLACEMENT CODE with all vulnerabilities resolved. Ensure no code placeholders.
5. Format your response cleanly with clear markdown sections:
   - ## EXECUTIVE AUDIT SUMMARY
   - ## VULNERABILITY BREAKDOWN (Title, Severity, CWE, Mechanics)
   - ## HARDENED DROP-IN CODE (Provide complete patched code inside a code block)
   - ## VERIFICATION & DEFENSIVE CONTROLS`;

    const messages: ChatMessage[] = [
      {
        role: 'user',
        content: auditPrompt,
      },
    ];

    const groqResponse = await callGroqChat({
      apiKey: groqKey,
      model: 'openai/gpt-oss-120b',
      messages,
      mode: mode || 'autofix',
    });

    if (!groqResponse.body) {
      return NextResponse.json(
        { error: 'Failed to receive response from inference engine.' },
        { status: 502 }
      );
    }

    // Read full response text from Groq SSE stream
    const reader = groqResponse.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const dataStr = trimmed.slice(6).trim();
          if (dataStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(dataStr);
            const delta = parsed.choices?.[0]?.delta?.content || '';
            fullText += delta;
          } catch {
            // Ignore parse errors on chunks
          }
        }
      }
    }

    // Extract patched code block if available
    let patchedCode: string | null = null;
    const codeBlockMatch = fullText.match(/```(?:[a-zA-Z0-9_-]+)?\n([\s\S]*?)```/);
    if (codeBlockMatch && codeBlockMatch[1]) {
      patchedCode = codeBlockMatch[1].trim();
    }

    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      language,
      auditReport: fullText,
      patchedCode,
      modelUsed: 'openai/gpt-oss-120b',
      meta: {
        codeBytesReceived: code.length,
        patchProvided: Boolean(patchedCode),
      },
    });
  } catch (error: any) {
    console.error('Audit API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal audit processing error' },
      { status: 500 }
    );
  }
}

// OPTIONS for CORS support so external apps can call it from anywhere
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
