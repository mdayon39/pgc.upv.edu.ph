import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { getManagedMenu, saveManagedMenu, type ManagedMenuItem } from '@/lib/site-config';

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const items = await getManagedMenu();
  return NextResponse.json({ items });
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { items?: ManagedMenuItem[] };
    const items = Array.isArray(body.items) ? body.items : [];
    const saved = await saveManagedMenu(items);
    return NextResponse.json({ ok: true, items: saved });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save menu.' },
      { status: 500 },
    );
  }
}
