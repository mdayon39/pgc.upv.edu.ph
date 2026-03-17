import { getPosts } from '@/services/wordpress';
import Link from 'next/link';

export default async function Home() {
  const data = await getPosts();
  const posts = (data.posts.nodes || []).slice(0, 8);

  return (
    <main>
      <section className="relative overflow-hidden border-b border-slate-200 bg-[#0f2745]">
        <img
          src="/uploads/2025/11/pgcv-1.jpg"
          alt="Philippine Genome Center Visayas"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-20 md:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">Philippine Genome Center Visayas</p>
          <h1 className="mt-3 max-w-3xl font-[var(--font-roboto-slab)] text-4xl font-bold leading-tight text-white md:text-5xl">
            Advancing Genomics Research, Services, and Capacity Building in Western Visayas
          </h1>
          <p className="mt-5 max-w-2xl text-blue-50 md:text-lg">
            Explore our laboratory services, research initiatives, training opportunities, and latest institutional updates.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/pgc-visayas-services" className="rounded bg-[#235787] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1e4b75]">
              View Services
            </Link>
            <Link href="/about-2" className="rounded border border-blue-100/70 px-5 py-3 text-sm font-semibold text-blue-50 hover:bg-white/10">
              About PGC UPV
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 md:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-[#002560]">Services</h2>
          <p className="mt-2 text-sm text-slate-600">Access sequencing, laboratory equipment, storage, and bioinformatics support.</p>
          <Link href="/pgc-visayas-services" className="mt-4 inline-block text-sm font-semibold text-[#1e4b75] hover:underline">Learn more</Link>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-[#002560]">Opportunities</h2>
          <p className="mt-2 text-sm text-slate-600">Find internship, training, and capacity-building opportunities for students and researchers.</p>
          <Link href="/opportunities" className="mt-4 inline-block text-sm font-semibold text-[#1e4b75] hover:underline">Explore opportunities</Link>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-[#002560]">Contact</h2>
          <p className="mt-2 text-sm text-slate-600">Coordinate with PGC Visayas for project inquiries, collaborations, and service requests.</p>
          <Link href="/contact" className="mt-4 inline-block text-sm font-semibold text-[#1e4b75] hover:underline">Get in touch</Link>
        </article>
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
            posts.map((post: any) => (
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
