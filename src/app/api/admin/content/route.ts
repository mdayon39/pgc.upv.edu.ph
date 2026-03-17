import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import {
  getManagedContentBlocks,
  saveManagedContentBlocks,
  type ManagedContentBlock,
} from '@/lib/site-config';

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const blocks = await getManagedContentBlocks();
  return NextResponse.json({ blocks });
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { blocks?: ManagedContentBlock[] };
    const blocks = Array.isArray(body.blocks) ? body.blocks : [];
    const saved = await saveManagedContentBlocks(blocks);
    return NextResponse.json({ ok: true, blocks: saved });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save content blocks.' },
      { status: 500 },
    );
  }
}
