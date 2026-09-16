import { NextResponse } from 'next/server';
import { get } from '@vercel/blob';
import { PDFDocument } from 'pdf-lib';
import { getStaffSession } from '@/lib/staff/auth';
import { getResourcesByIds } from '@/lib/staff/resource-repo';
import type { Resource } from '@/lib/staff/types';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const session = await getStaffSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { ids } = await req.json() as { ids: string[] };
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'No resource IDs provided' }, { status: 400 });
  }

  const rows = await getResourcesByIds(ids);

  // Preserve the user's ordering
  const resourceMap = new Map(rows.map((r) => [r.id, r]));
  const resources = ids.map((id) => resourceMap.get(id)).filter(Boolean) as Resource[];

  const merged = await PDFDocument.create();

  // Append each PDF
  for (const resource of resources) {
    let pdfBytes: ArrayBuffer | null = null;

    if (resource.storageProvider === 'vercel_blob' && resource.storageKey) {
      const blobResult = await get(resource.storageKey, { access: 'private' });
      if (blobResult?.statusCode === 200 && blobResult.stream) {
        pdfBytes = await new Response(blobResult.stream).arrayBuffer();
      }
    } else if (resource.fileUrl) {
      const res = await fetch(resource.fileUrl);
      if (res.ok) pdfBytes = await res.arrayBuffer();
    }

    if (pdfBytes) {
      try {
        const doc = await PDFDocument.load(pdfBytes);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      } catch {
        // Skip unreadable PDFs silently
      }
    }
  }

  const pdfOut = Buffer.from(await merged.save());
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const slug = `KHM-Packet-${today.replace(/,?\s+/g, '-')}.pdf`;

  return new Response(pdfOut, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${slug}"`,
      'Cache-Control': 'no-store',
    },
  });
}
