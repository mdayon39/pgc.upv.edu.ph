import Link from 'next/link';
import HomeSlider from '@/components/home-slider';
import { getManagedContentBlocks } from '@/lib/site-config';

export default async function Home() {
  const blocks = await getManagedContentBlocks();
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

    </main>
  );
}
