import { readFile } from 'node:fs/promises';
import path from 'node:path';

const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://pgc.upv.edu.ph/wp-json/wp/v2';

type WpPost = {
  id: number | string;
  title?: { rendered?: string } | string;
  excerpt?: { rendered?: string } | string;
  slug?: string;
  date?: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url?: string }>;
  };
};

const normalizePosts = (posts: WpPost[]) => {
  return {
    posts: {
      nodes: posts.map((post) => ({
        id: post.id,
        title: typeof post.title === 'string' ? post.title : (post.title?.rendered ?? ''),
        excerpt: typeof post.excerpt === 'string' ? post.excerpt : (post.excerpt?.rendered ?? ''),
        slug: post.slug ?? '',
        date: post.date ?? new Date().toISOString(),
        featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url
          ? {
              node: {
                sourceUrl: post._embedded['wp:featuredmedia'][0].source_url,
              },
            }
          : null,
      })),
    },
  };
};

const readLocalPosts = async () => {
  const filePath = path.join(process.cwd(), 'public', 'data', 'posts.json');
  const raw = await readFile(filePath, 'utf8');
  return JSON.parse(raw) as WpPost[];
};

export const getPosts = async () => {
  try {
    // Primary source: local exported content for reliability on Vercel
    const localPosts = await readLocalPosts();
    if (localPosts.length > 0) {
      return normalizePosts(localPosts);
    }
  } catch {
    // Fall through to remote API
  }

  try {
    const res = await fetch(`${WP_API_URL}/posts?per_page=100&_embed`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch posts from WordPress API');
    }
    const posts = (await res.json()) as WpPost[];
    return normalizePosts(posts);
  } catch {
    return normalizePosts([
      {
        id: 'fallback-1',
        title: 'Welcome to the New PGC UPV Portal',
        excerpt:
          'The site is currently in progress. We are migrating our content from the old WordPress portal to this new high-performance Next.js site.',
        slug: 'welcome',
        date: new Date().toISOString(),
      },
    ]);
  }
};
