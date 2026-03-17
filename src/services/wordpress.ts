import { GraphQLClient } from 'graphql-request';

const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://pgc.upv.edu.ph/wp-json/wp/v2';

export const getPosts = async () => {
  const res = await fetch(`${WP_API_URL}/posts?_embed`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  
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
};
