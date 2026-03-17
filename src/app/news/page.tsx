import Link from 'next/link';
import { getAllPosts } from '@/services/wordpress';

export default async function NewsIndexPage() {
  const posts = await getAllPosts();

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-8">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-blue-900">All News</h1>
        <p className="mt-2 text-slate-600">Browse all migrated posts from the old WordPress website.</p>
      </header>

      <section className="grid gap-6">
        {posts.map((post) => (
          <article key={post.id} className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold text-slate-900">
              <Link href={`/news/${post.slug}`} className="hover:text-blue-700 hover:underline">
                <span dangerouslySetInnerHTML={{ __html: post.title }} />
              </Link>
            </h2>
            <div className="mt-3 line-clamp-3 text-slate-700" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
            <div className="mt-4 text-sm text-slate-500">{new Date(post.date).toLocaleDateString()}</div>
          </article>
        ))}
      </section>
    </main>
  );
}
