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

  if (slug === 'pgc-visayas-services') {
    return <ServicesPage />;
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

const serviceCards = [
  {
    title: 'Sequencing',
    href: '/services-sequencing-services',
    description: 'High-quality raw sequence data via Capillary Sequencing and Next-Generation Sequencing platforms.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    title: 'Laboratory Equipment',
    href: '/services-laboratory-equipment',
    description: 'Access various instrumentation for molecular biology, genomics, and related research.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" />
      </svg>
    ),
  },
  {
    title: 'Sample Storage',
    href: '/sample-storage',
    description: 'Refrigerated and freezer storage solutions for biological specimens and reagents.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="m20.893 13.393-1.135-1.135a2.252 2.252 0 0 1-.421-.585l-1.08-2.16a.414.414 0 0 0-.663-.107.827.827 0 0 1-.812.21l-1.273-.363a.89.89 0 0 0-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 0 1-1.81 1.025 1.055 1.055 0 0 1-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 0 1-1.383-2.46l.007-.042a2.25 2.25 0 0 1 .29-.787l.09-.15a2.25 2.25 0 0 1 2.37-1.048l1.178.236a1.125 1.125 0 0 0 1.302-.795l.208-.73a1.125 1.125 0 0 0-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 0 1-1.591.659h-.18a.94.94 0 0 0-.662.274.931.931 0 0 1-1.458-1.137l1.411-2.353a2.25 2.25 0 0 0 .286-.76m11.928 9.869A9 9 0 0 0 8.965 3.525m11.928 9.868A9 9 0 1 1 8.965 3.525" />
      </svg>
    ),
  },
  {
    title: 'Retail Services',
    href: '/services-retail-services',
    description: 'Flake ice, ultrapure water, and other consumable supplies available for purchase.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
      </svg>
    ),
  },
  {
    title: 'Sample Processing',
    href: '/services-sample-processing-service',
    description: 'Nucleic acid extraction and library preparation using prescribed protocols.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />
      </svg>
    ),
  },
  {
    title: 'Bioinformatics',
    href: '/services-bioinformatics-laboratory-services',
    description: 'In-depth computational analysis of next-generation sequencing data.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
      </svg>
    ),
  },
];

const additionalServices = [
  { title: 'PCR / Real-time PCR', href: '/services-pcr-real-time-pcr-2' },
  { title: 'DNA / PCR Purification', href: '/services-dna-pcr-purification' },
  { title: 'Nucleic Acid Quantification', href: '/services-nucleic-acid-quantification' },
  { title: 'Storage Freezers', href: '/services-storage-freezers' },
];

function ServicesPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10">
      <article className="rounded-2xl border bg-white shadow-lg overflow-hidden">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#0f4f7c] to-[#123b5d] px-6 py-16 text-center md:px-12 md:py-24">
          <h1 className="font-[var(--font-roboto-slab)] text-4xl font-extrabold text-white md:text-5xl lg:text-6xl">
            Our Services
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            PGC Visayas offers a comprehensive suite of genomics and laboratory services to support research, public health, and academic institutions.
          </p>
        </div>

        <div className="p-6 md:p-12 lg:p-16">
          {/* Service cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCards.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="group flex flex-col items-center rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-[#0f4f7c]/30 hover:shadow-md"
              >
                <div className="mb-4 rounded-full bg-[#edf4fb] p-4 text-[#0f4f7c] transition-colors group-hover:bg-[#0f4f7c] group-hover:text-white">
                  {service.icon}
                </div>
                <h2 className="text-lg font-bold text-[#123b5d]">{service.title}</h2>
                <p className="mt-2 text-sm text-slate-500">{service.description}</p>
              </Link>
            ))}
          </div>

          {/* Additional services */}
          <div className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="mb-4 font-[var(--font-roboto-slab)] text-xl font-bold text-[#123b5d]">
              Additional Services
            </h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {additionalServices.map((svc) => (
                <li key={svc.href}>
                  <Link
                    href={svc.href}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#0f4f7c] hover:underline"
                  >
                    <span aria-hidden="true">→</span> {svc.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="mt-8 rounded-xl border border-slate-200 bg-[#f0f7ff] p-6 text-center">
            <h3 className="font-[var(--font-roboto-slab)] text-xl font-bold text-[#123b5d]">Have questions?</h3>
            <p className="mt-2 text-sm text-slate-600">Check our FAQs or reach out to discuss your project needs.</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/faq-services-lab"
                className="rounded-full border border-[#0f4f7c] px-6 py-2.5 text-sm font-semibold text-[#0f4f7c] transition-colors hover:bg-[#0f4f7c] hover:text-white"
              >
                FAQs — Services &amp; Lab Use
              </Link>
              <Link
                href="/contact"
                className="rounded-full bg-[#0f4f7c] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#123b5d]"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
