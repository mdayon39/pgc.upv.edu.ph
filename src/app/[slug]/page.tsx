import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
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

  if (slug === 'about-2') {
    return <AboutPage />;
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10">
      <article className="rounded-2xl border bg-white shadow-lg overflow-hidden transition-all">
        {page.featuredImage && (
          <div className="relative h-[300px] md:h-[480px] w-full">
            <img
              src={page.featuredImage}
              alt={page.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 md:p-12 text-center">
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

const aboutSections = [
  {
    title: 'History',
    href: '/history',
    description: 'Learn about the origins and milestones of the Philippine Genome Center Visayas.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    title: 'Mission & Vision',
    href: '/mision-vision',
    description: 'Our guiding principles and aspirations for genomics research in the Visayas.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
  {
    title: 'Team',
    href: '/team',
    description: 'Meet the researchers, scientists, and staff behind PGC Visayas.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
  },
];

const supportLinks = [
  { title: 'Contact Us', href: '/contact' },
  { title: 'FAQs — Consortium Membership', href: '/faqs-consortium-membership' },
  { title: 'FAQs — Services & Lab Use', href: '/faq-services-lab' },
  { title: 'FAQs — COVID-19', href: '/frequently-asked-questions' },
];

const socialLinks = [
  { title: 'Facebook', href: 'https://www.facebook.com/PGCVisayas' },
  { title: 'LinkedIn', href: 'https://linkedin.com/in/philippine-genome-center-visayas-519652243' },
  { title: 'YouTube', href: 'https://www.youtube.com/channel/UCHcDESh1LBalmekPI2KPbrQ/featured' },
  { title: 'Twitter / X', href: 'https://twitter.com/pgcvisayas' },
];

function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10">
      <article className="rounded-2xl border bg-white shadow-lg overflow-hidden">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#0f4f7c] to-[#123b5d] px-6 py-16 text-center md:px-12 md:py-24">
          <h1 className="font-[var(--font-roboto-slab)] text-4xl font-extrabold text-white md:text-5xl lg:text-6xl">
            About PGC Visayas
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            The Philippine Genome Center Visayas is a satellite facility dedicated to advancing genomics and bioinformatics research and services in the Visayas region and beyond.
          </p>
        </div>

        <div className="p-6 md:p-12 lg:p-16">
          {/* Main navigation cards */}
          <div className="grid gap-6 sm:grid-cols-3">
            {aboutSections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="group flex flex-col items-center rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-[#0f4f7c]/30 hover:shadow-md"
              >
                <div className="mb-4 rounded-full bg-[#edf4fb] p-4 text-[#0f4f7c] transition-colors group-hover:bg-[#0f4f7c] group-hover:text-white">
                  {section.icon}
                </div>
                <h2 className="text-lg font-bold text-[#123b5d]">{section.title}</h2>
                <p className="mt-2 text-sm text-slate-500">{section.description}</p>
              </Link>
            ))}
          </div>

          {/* Support & Social */}
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {/* Support */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="mb-4 font-[var(--font-roboto-slab)] text-xl font-bold text-[#123b5d]">Support</h3>
              <ul className="space-y-2">
                {supportLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="inline-flex items-center gap-2 text-sm font-medium text-[#0f4f7c] hover:underline">
                      <span aria-hidden="true">→</span> {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Media */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="mb-4 font-[var(--font-roboto-slab)] text-xl font-bold text-[#123b5d]">Connect With Us</h3>
              <ul className="space-y-2">
                {socialLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-[#0f4f7c] hover:underline">
                      <span aria-hidden="true">→</span> {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Opportunities */}
          <div className="mt-8 rounded-xl border border-slate-200 bg-[#f0f7ff] p-6 text-center">
            <h3 className="font-[var(--font-roboto-slab)] text-xl font-bold text-[#123b5d]">Opportunities</h3>
            <p className="mt-2 text-sm text-slate-600">Career openings, internships, trainings, and facility visits</p>
            <Link
              href="/opportunities"
              className="mt-4 inline-block rounded-full bg-[#0f4f7c] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#123b5d]"
            >
              View Opportunities
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
