import { GraphQLClient } from 'graphql-request';

const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://your-wordpress-site.local/graphql';

export const wpClient = new GraphQLClient(WP_API_URL);

export const getPosts = async () => {
  const query = `
    query GetPosts {
      posts {
        nodes {
          id
          title
          excerpt
          slug
          date
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }
    }
  `;
  return await wpClient.request(query);
};
