import { getPosts } from '@/services/wordpress';
import Link from 'next/link';

export default async function Home() {
  const data = await getPosts();
  const posts = (data.posts.nodes || []).slice(0, 8);

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="mb-12 border-b pb-6">
        <h1 className="text-4xl font-bold text-blue-900 font-sans">PGC UPV News</h1>
        <p className="mt-2 text-slate-600">Latest updates from the Philippine Genome Center Visayas</p>
      </header>

      <section className="grid gap-8">
        {posts.length > 0 ? (
          posts.map((post: any) => (
            <article key={post.id} className="group rounded-lg border border-slate-200 bg-white p-6 text-slate-900 transition-shadow hover:shadow-lg">
              <h2 className="text-2xl font-semibold text-slate-900 transition-colors group-hover:text-blue-700">
                <Link href={`/news/${post.slug}`} className="hover:underline">
                  <span dangerouslySetInnerHTML={{ __html: post.title }} />
                </Link>
              </h2>
              <div 
                className="mt-4 line-clamp-3 leading-relaxed text-slate-700"
                dangerouslySetInnerHTML={{ __html: post.excerpt }} 
              />
              <div className="mt-6 flex items-center justify-between text-sm font-medium text-slate-500">
                <span>{new Date(post.date).toLocaleDateString()}</span>
                <Link className="text-blue-600" href={`/news/${post.slug}`}>
                  Read more →
                </Link>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-lg bg-gray-50 py-20 text-center">
            <p className="text-gray-500">No posts found from the migrated content.</p>
          </div>
        )}
      </section>

      <div className="mt-8 flex justify-end">
        <Link href="/news" className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700">
          View all news
        </Link>
      </div>
    </main>
  );
}
