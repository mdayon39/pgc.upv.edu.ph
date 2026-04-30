import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPages, getPageBySlug } from '@/services/wordpress';

type Props = { params: Promise<{ slug: string }> };

const RESERVED = new Set(['news']);

export async function generateStaticParams() {
  const pages = await getAllPages();
  return pages
    .filter((page) => !RESERVED.has(page.slug))
    .map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return { title: 'Page not found' };
  }

  return {
    title: page.title,
    description: page.excerpt.replace(/<[^>]+>/g, '').slice(0, 160),
  };
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;
  const isCapacityBuilding = slug === 'capacity-building-scheme';

  if (RESERVED.has(slug)) {
    notFound();
  }

  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10">
      <article className="rounded-2xl border bg-white shadow-lg overflow-hidden transition-all">
        {page.featuredImage && (
          <div className={`relative w-full ${isCapacityBuilding ? 'h-[360px] md:h-[640px] bg-white' : 'h-[300px] md:h-[480px]'}`}>
            <img
              src={page.featuredImage}
              alt={page.title}
              className={`w-full h-full ${isCapacityBuilding ? 'object-contain p-4 md:p-8' : 'object-cover'}`}
            />
            <div
              className={`absolute inset-x-0 p-6 md:p-12 text-center ${
                isCapacityBuilding
                  ? 'top-0 bg-gradient-to-b from-black/60 to-transparent'
                  : 'bottom-0 bg-gradient-to-t from-black/60 to-transparent'
              }`}
            >
              <h1 
                className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg leading-tight" 
                dangerouslySetInnerHTML={{ __html: page.title }} 
              />
            </div>
          </div>
        )}
        <div className="p-6 md:p-16">
          {!page.featuredImage && (
            <header className="mb-12 text-center border-b border-gray-200 pb-10">
              <h1 
                className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-[#002B5B] leading-tight" 
                dangerouslySetInnerHTML={{ __html: page.title }} 
              />
            </header>
          )}
          
          <div className="content-html max-w-4xl mx-auto" dangerouslySetInnerHTML={{ __html: page.content || page.excerpt }} />
        </div>
      </article>
    </main>
  );
}
