import { getPosts } from '@/services/wordpress';
import Link from 'next/link';
import HomeSlider from '@/components/home-slider';
import { getManagedContentBlocks } from '@/lib/site-config';

type PostNode = {
  id: number | string;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
    };
  } | null;
};

export default async function Home() {
  const [data, blocks] = await Promise.all([getPosts(), getManagedContentBlocks()]);
  const posts: PostNode[] = (data.posts.nodes || []).slice(0, 8);
  const enabledBlocks = blocks.filter((block) => block.enabled).slice(0, 3);

  return (
    <main>
      <HomeSlider />

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-12 md:grid-cols-3">
        {enabledBlocks.map((block) => (
          <article key={block.id} className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
            {block.imageUrl ? (
              <img
                src={block.imageUrl}
                alt={block.title}
                loading="lazy"
                decoding="async"
                className="h-48 w-full object-cover"
              />
            ) : <div className="h-48 w-full bg-[linear-gradient(120deg,#dbeafe,#e2e8f0)]" />}
            <div className="p-6">
              <h2 className="font-[var(--font-roboto-slab)] text-xl font-bold text-[#123b5d]">{block.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{block.description}</p>
              <Link
                href={block.href || '#'}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#0f4f7c] hover:text-[#0a3c60]"
              >
                Learn more
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20">
        <header className="mb-7 flex items-end justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="font-[var(--font-roboto-slab)] text-3xl font-bold text-[#153d5f]">Latest News</h2>
            <p className="mt-2 text-sm text-slate-600">Updates from the old WordPress archive, now hosted on your new platform.</p>
          </div>
          <Link href="/news" className="text-sm font-semibold uppercase tracking-wide text-[#0f4f7c] hover:underline">
            View all
          </Link>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {posts.length > 0 ? (
            posts.map((post) => (
              <article key={post.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:shadow-xl">
                {post.featuredImage?.node?.sourceUrl && (
                  <img
                    src={post.featuredImage.node.sourceUrl}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    className="h-56 w-full object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="font-[var(--font-roboto-slab)] text-2xl font-bold text-slate-900 transition-colors group-hover:text-[#0f4f7c]">
                    <Link href={`/news/${post.slug}`} className="hover:underline">
                      <span dangerouslySetInnerHTML={{ __html: post.title }} />
                    </Link>
                  </h3>
                  <div className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-700" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
                  <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <Link className="font-semibold uppercase tracking-wide text-[#0f4f7c]" href={`/news/${post.slug}`}>
                      Read more
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-lg border border-slate-200 bg-white py-16 text-center md:col-span-2">
              <p className="text-slate-500">No posts found from the migrated content.</p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
