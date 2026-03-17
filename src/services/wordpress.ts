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

  // 1. First, point all known remote WP media URLs to local Vercel /uploads/
  const withLocalPaths = html
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

  // 2. Fallback: If the image isn't found locally on Vercel yet, 
  // we proxy back to the original server as a temporary measure 
  // so the site doesn't have broken images.
  // Note: This relies on the original server being reachable.
  return withLocalPaths;
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

type MenuItem = {
  label: string;
  href: string;
  children?: MenuItem[];
};

export const getMenuItems = async () => {
  const pages = await getAllPages();
  const bySlug = new Map(
    pages.map((page) => [
      page.slug,
      {
        slug: page.slug,
        label: page.title.replace(/&#8217;/g, "'").replace(/&#038;/g, '&'),
      },
    ]),
  );

  const linkFor = (slug: string, fallbackLabel: string): MenuItem => {
    const matched = bySlug.get(slug);
    return {
      label: matched?.label ?? fallbackLabel,
      href: `/${slug}`,
    };
  };

  const menu: MenuItem[] = [
    { label: 'HOME', href: '/' },
    {
      label: 'ABOUT',
      href: '/about-2',
      children: [
        linkFor('history', 'History'),
        linkFor('mision-vision', 'Mission & Vision'),
        linkFor('team', 'Team'),
      ],
    },
    {
      label: 'SERVICES',
      href: '/pgc-visayas-services',
      children: [
        linkFor('services-sequencing-services', 'Sequencing'),
        linkFor('services-laboratory-equipment', 'Laboratory Equipment'),
        linkFor('sample-storage', 'Sample Storage'),
        linkFor('services-retail-services', 'Retail Services'),
        linkFor('services-sample-processing-service', 'Sample Processing'),
        linkFor('services-bioinformatics-laboratory-services', 'Bioinformatics Services'),
      ],
    },
    {
      label: 'CONSORTIUM',
      href: '/consortium',
      children: [
        linkFor('capacity-building-scheme', 'CAPACITY BUILDING SCHEME'),
      ],
    },
    linkFor('faqs', 'FAQs'),
    linkFor('contact', 'CONTACT'),
    linkFor('opportunities', 'OPPORTUNITIES'),
  ];

  return menu;
};
