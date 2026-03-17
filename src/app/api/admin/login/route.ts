import { NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  verifyAdminIdTokenAndAuthorize,
} from '@/lib/admin-auth';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { idToken?: string } | null;
  const idToken = body?.idToken ?? '';

  if (!idToken) {
    return NextResponse.json({ error: 'Missing Firebase ID token.' }, { status: 400 });
  }

  let user: { uid: string; email: string };
  try {
    user = await verifyAdminIdTokenAndAuthorize(idToken);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unauthorized.' },
      { status: 401 },
    );
  }

  const token = createAdminSessionToken(user);
  if (!token) {
    return NextResponse.json(
      { error: 'Admin session secret is not configured.' },
      { status: 500 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
  });

  return response;
}
