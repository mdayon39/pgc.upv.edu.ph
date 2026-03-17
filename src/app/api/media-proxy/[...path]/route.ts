import { NextResponse } from 'next/server';
import { Agent } from 'undici';

const WP_UPLOADS_BASE = 'https://pgc.upv.edu.ph/wp-content/uploads';

// Upstream TLS is currently misconfigured (expired cert), so this keeps media working
// until the origin certificate is fixed.
const insecureAgent = new Agent({
  connect: {
    rejectUnauthorized: false,
  },
});

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;

  if (!path || path.length === 0) {
    return NextResponse.json({ error: 'Missing media path' }, { status: 400 });
  }

  const safePath = path.map((segment) => encodeURIComponent(segment)).join('/');
  const upstreamUrl = `${WP_UPLOADS_BASE}/${safePath}`;

  try {
    const response = await fetch(upstreamUrl, {
      // 'dispatcher' is supported by undici in Node runtime.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dispatcher: insecureAgent as any,
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; PGC-UPV-MediaProxy/1.0)',
      },
      cache: 'no-store',
    } as RequestInit);

    if (!response.ok || !response.body) {
      return new NextResponse(null, { status: response.status || 404 });
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const cacheControl = response.headers.get('cache-control') || 'public, max-age=86400, s-maxage=86400';

    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        'content-type': contentType,
        'cache-control': cacheControl,
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
