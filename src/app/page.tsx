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

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 md:grid-cols-3">
        {enabledBlocks.map((block) => (
          <article key={block.id} className="rounded-lg border border-slate-200 bg-white p-6">
            {block.imageUrl ? (
              <img
                src={block.imageUrl}
                alt={block.title}
                className="mb-4 h-36 w-full rounded-md object-cover"
              />
            ) : null}
            <h2 className="text-lg font-bold text-[#002560]">{block.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{block.description}</p>
            <Link
              href={block.href || '#'}
              className="mt-4 inline-block text-sm font-semibold text-[#1e4b75] hover:underline"
            >
              Learn more
            </Link>
          </article>
        ))}
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16">
        <header className="mb-6 flex items-end justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="font-[var(--font-roboto-slab)] text-3xl font-bold text-[#2b2b2b]">Latest News</h2>
            <p className="mt-1 text-sm text-slate-600">Updates from the old WordPress archive, now hosted on your new platform.</p>
          </div>
          <Link href="/news" className="text-sm font-semibold text-[#1e4b75] hover:underline">
            View all
          </Link>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {posts.length > 0 ? (
            posts.map((post) => (
              <article key={post.id} className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition-shadow hover:shadow-md">
                {post.featuredImage?.node?.sourceUrl && (
                  <img
                    src={post.featuredImage.node.sourceUrl}
                    alt={post.title}
                    className="h-52 w-full object-cover"
                  />
                )}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-[#1e4b75]">
                    <Link href={`/news/${post.slug}`} className="hover:underline">
                      <span dangerouslySetInnerHTML={{ __html: post.title }} />
                    </Link>
                  </h3>
                  <div className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-700" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <Link className="font-semibold text-[#1e4b75]" href={`/news/${post.slug}`}>
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
