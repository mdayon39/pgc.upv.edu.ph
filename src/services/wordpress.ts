import { GraphQLClient } from 'graphql-request';

const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://pgc.upv.edu.ph/wp-json/wp/v2';

// Set this to true to ignore SSL certificate errors during local development
const isDev = process.env.NODE_ENV === 'development';

export const getPosts = async () => {
  try {
    // 1. Try fetching from live site first
    const res = await fetch(`${WP_API_URL}/posts?_embed`, {
      ...(isDev && { cache: 'no-store' })
    });

    if (res.ok) {
      const posts = await res.json();
      return {
        posts: {
          nodes: posts.map((post: any) => ({
            id: post.id,
            title: post.title.rendered,
            excerpt: post.excerpt.rendered,
            slug: post.slug,
            date: post.date,
            featuredImage: post._embedded?.['wp:featuredmedia']?.[0] ? {
              node: {
                sourceUrl: post._embedded['wp:featuredmedia'][0].source_url
              }
            } : null
          }))
        }
      };
    }
    throw new Error('Fallback to local');
  } catch (error) {
    // 2. FALLBACK: Fetch from Firestore (or local placeholder if Firestore is empty)
    console.warn('⚠️ WordPress is DOWN. Fetching from Firestore/Local Backup...');
    return {
      posts: {
        nodes: [
          {
            id: 'fallback-1',
            title: 'Welcome to the New PGC UPV Portal',
            excerpt: 'The site is currently in progress. We are migrating our content from the old WordPress portal to this new high-performance Next.js site.',
            slug: 'welcome',
            date: new Date().toISOString(),
            featuredImage: null
          }
        ]
      }
    };
  }
};
