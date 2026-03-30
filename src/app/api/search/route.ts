import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, getAllPages } from '@/services/wordpress';

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim().toLowerCase();

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const [posts, pages] = await Promise.all([getAllPosts(), getAllPages()]);

  const matchedPosts = posts
    .filter((post) => {
      const title = post.title.toLowerCase();
      const excerpt = stripHtml(post.excerpt).toLowerCase();
      return title.includes(q) || excerpt.includes(q);
    })
    .slice(0, 5)
    .map((post) => ({
      type: 'post' as const,
      title: post.title,
      slug: post.slug,
      excerpt: stripHtml(post.excerpt).slice(0, 120),
      href: `/news/${post.slug}`,
    }));

  const matchedPages = pages
    .filter((page) => {
      const title = page.title.toLowerCase();
      const excerpt = stripHtml(page.excerpt).toLowerCase();
      const content = stripHtml(page.content).toLowerCase();
      return title.includes(q) || excerpt.includes(q) || content.includes(q);
    })
    .slice(0, 5)
    .map((page) => ({
      type: 'page' as const,
      title: page.title,
      slug: page.slug,
      excerpt: stripHtml(page.excerpt || page.content).slice(0, 120),
      href: `/${page.slug}`,
    }));

  return NextResponse.json({ results: [...matchedPages, ...matchedPosts].slice(0, 8) });
}
