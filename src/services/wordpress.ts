import { readFile } from 'node:fs/promises';
import path from 'node:path';

type RenderedField = { rendered?: string };

type WpEntity = {
  id: number;
  slug: string;
  title?: RenderedField;
  excerpt?: RenderedField;
  content?: RenderedField;
  date?: string;
  parent?: number;
  link?: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url?: string }>;
  };
};

type NormalizedItem = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  featuredImage: string | null;
  parent: number;
};

const DATA_DIR = path.join(process.cwd(), 'public', 'data');

const rewriteMediaUrls = (html: string) => {
  if (!html) return '';

  // Convert remote WP media URLs to local public uploads path.
  // This handles various forms including Jetpack (i0.wp.com) and direct links
  return html
    .replace(
      /https?:\/\/i\d\.wp\.com\/pgc\.upv\.edu\.ph\/wp-content\/uploads\/([^"'\s?]+)(?:\?[^"'\s]*)?/gi,
      '/uploads/$1',
    )
    .replace(
      /https?:\/\/(?:pgc\.upv\.edu\.ph|127\.0\.0\.1\/wordpress)\/wp-content\/uploads\/([^"'\s?]+)(?:\?[^"'\s]*)?/gi,
      '/uploads/$1',
    )
    .replace(
      /https?:\/\/pgc\.upv\.edu\.ph\/wp-content\/uploads\/([^"'\s?]+)(?:\?[^"'\s]*)?/gi,
      '/uploads/$1',
    );
};

const normalizeEntity = (item: WpEntity): NormalizedItem => ({
  id: item.id,
  slug: item.slug,
  title: item.title?.rendered ?? '',
  excerpt: rewriteMediaUrls(item.excerpt?.rendered ?? ''),
  content: rewriteMediaUrls(item.content?.rendered ?? ''),
  date: item.date ?? new Date(0).toISOString(),
  featuredImage: item._embedded?.['wp:featuredmedia']?.[0]?.source_url
    ? rewriteMediaUrls(item._embedded['wp:featuredmedia'][0].source_url ?? '')
    : null,
  parent: item.parent ?? 0,
});

const readJson = async <T>(fileName: string): Promise<T> => {
  const raw = await readFile(path.join(DATA_DIR, fileName), 'utf8');
  return JSON.parse(raw) as T;
};

export const getAllPosts = async (): Promise<NormalizedItem[]> => {
  const posts = await readJson<WpEntity[]>('posts.json');
  return posts.map(normalizeEntity).sort((a, b) => +new Date(b.date) - +new Date(a.date));
};

export const getAllPages = async (): Promise<NormalizedItem[]> => {
  const pages = await readJson<WpEntity[]>('pages.json');
  return pages.map(normalizeEntity);
};

export const getPosts = async () => {
  const posts = await getAllPosts();
  return {
    posts: {
      nodes: posts.map((post) => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        slug: post.slug,
        date: post.date,
        featuredImage: post.featuredImage
          ? {
              node: {
                sourceUrl: post.featuredImage,
              },
            }
          : null,
      })),
    },
  };
};

export const getPostBySlug = async (slug: string) => {
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug) ?? null;
};

export const getPageBySlug = async (slug: string) => {
  const pages = await getAllPages();
  return pages.find((page) => page.slug === slug) ?? null;
};

export const getMenuItems = async () => {
  const pages = await getAllPages();
  const blocked = new Set(['privacy-policy', 'sample-page']);

  const topPages = pages
    .filter((page) => page.parent === 0)
    .filter((page) => !blocked.has(page.slug))
    .sort((a, b) => a.title.localeCompare(b.title))
    .slice(0, 8)
    .map((page) => ({
      label: page.title.replace(/&#8217;/g, "'").replace(/&#038;/g, '&'),
      href: `/${page.slug}`,
    }));

  return [{ label: 'Home', href: '/' }, { label: 'News', href: '/news' }, ...topPages];
};
