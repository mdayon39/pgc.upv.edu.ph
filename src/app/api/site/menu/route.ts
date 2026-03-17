import { NextResponse } from 'next/server';
import { getManagedMenu } from '@/lib/site-config';

export async function GET() {
  try {
    const items = await getManagedMenu();
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}
