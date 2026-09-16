import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/staff/auth';
import { classifyResourceMetadata } from '@/lib/staff/classification';

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({})) as {
    filename?: string;
    sourcePath?: string;
    firstPageText?: string;
    existingMetadata?: Record<string, unknown>;
    forceAI?: boolean;
  };

  if (!body.filename) return NextResponse.json({ error: 'filename is required' }, { status: 400 });

  const classification = await classifyResourceMetadata({
    filename: body.filename,
    sourcePath: body.sourcePath,
    firstPageText: body.firstPageText,
    existingMetadata: body.existingMetadata,
    forceAI: body.forceAI,
  });

  return NextResponse.json({
    classification,
    source: classification.confidence === 'high' || !process.env.AI_GATEWAY_API_KEY ? 'heuristic' : 'ai-gateway',
  });
}
