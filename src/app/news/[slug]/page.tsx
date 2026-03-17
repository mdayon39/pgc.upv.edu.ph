import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPosts, getPostBySlug } from '@/services/wordpress';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: 'Post not found' };
  }

  return {
    title: post.title,
    description: post.excerpt.replace(/<[^>]+>/g, '').slice(0, 160),
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <article className="rounded-lg border bg-white shadow-sm overflow-hidden">
        {post.featuredImage && (
          <div className="relative h-64 md:h-96 w-full">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-6 md:p-10">
          <header className="mb-8">
            <h1 
              className="mb-4 text-3xl md:text-4xl font-extrabold text-[#002B5B] leading-tight" 
              dangerouslySetInnerHTML={{ __html: post.title }} 
            />
            <div className="flex items-center text-gray-500 text-sm">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span className="mx-2">•</span>
              <span>PGC Visayas News</span>
            </div>
          </header>
          
          <div className="content-html" dangerouslySetInnerHTML={{ __html: post.content }} />
          
          <footer className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
             <a href="/news" className="text-blue-700 hover:text-blue-900 font-medium flex items-center transition-colors">
               ← Back to News
             </a>
             <div className="flex gap-4">
                {/* Placeholder for social share if needed */}
             </div>
          </footer>
        </div>
      </article>
    </main>
  );
}
