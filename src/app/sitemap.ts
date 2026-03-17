import type { MetadataRoute } from 'next';
import { getAllPages, getAllPosts } from '@/services/wordpress';

const baseUrl = 'https://pgc-upv-edu-ph.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, posts] = await Promise.all([getAllPages(), getAllPosts()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/news`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  const pageRoutes: MetadataRoute.Sitemap = pages
    .filter((page) => page.slug !== 'news')
    .map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: page.date ? new Date(page.date) : undefined,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/news/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : undefined,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...pageRoutes, ...postRoutes];
}
