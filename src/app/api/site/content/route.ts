import { NextResponse } from 'next/server';
import { getManagedContentBlocks } from '@/lib/site-config';

export async function GET() {
  try {
    const blocks = await getManagedContentBlocks();
    return NextResponse.json({ blocks });
  } catch {
    return NextResponse.json({ blocks: [] }, { status: 200 });
  }
}
