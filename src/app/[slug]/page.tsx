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

  if (RESERVED.has(slug)) {
    notFound();
  }

  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <article className="rounded-lg border bg-white shadow-sm overflow-hidden">
        {page.featuredImage && (
          <div className="relative h-48 md:h-64 w-full">
            <img
              src={page.featuredImage}
              alt={page.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-6 md:p-12">
          <header className="mb-10 text-center border-b border-gray-100 pb-8">
            <h1 
              className="text-3xl md:text-5xl font-extrabold text-[#002B5B] leading-tight" 
              dangerouslySetInnerHTML={{ __html: page.title }} 
            />
          </header>
          
          <div className="content-html" dangerouslySetInnerHTML={{ __html: page.content || page.excerpt }} />
        </div>
      </article>
    </main>
  );
}
