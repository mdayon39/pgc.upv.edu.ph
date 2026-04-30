import { getPageBySlug } from '@/services/wordpress';
import ContactForm from '@/components/contact-form';

const CONTACT_CHANNELS = [
  {
    id: 'bioinformatics',
    title: 'Bioinformatics Laboratory Services',
    email: 'bioinfo.pgc.upvisayas@up.edu.ph',
    description: 'For sequence analysis, pipeline support, interpretation, and bioinformatics consultations.',
    suggestedSubject: 'Bioinformatics Inquiry',
  },
  {
    id: 'omics',
    title: 'Omics Laboratory Services',
    email: 'sequencing.pgc.upvisayas@up.edu.ph',
    description: 'For sequencing requests, sample requirements, turnaround timelines, and laboratory service coordination.',
    suggestedSubject: 'Omics Service Request',
  },
  {
    id: 'office',
    title: 'Administrative and Office Concerns',
    email: 'pgc.upvisayas@up.edu.ph',
    description: 'For official communications, partnerships, and general office-related requests.',
    suggestedSubject: 'Administrative Inquiry',
  },
];

type ContactDetailsProps = {
  title: string;
};

function ContactDetails({ title }: ContactDetailsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <h1 className="font-[var(--font-roboto-slab)] text-3xl font-bold text-[#002560] md:text-4xl">{title}</h1>
      <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
        Connect with the correct team directly for faster assistance.
      </p>

      <div className="mt-8 space-y-4">
        {CONTACT_CHANNELS.map((channel) => (
          <article key={channel.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-slate-700">{channel.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{channel.description}</p>
            <a
              href={`mailto:${channel.email}?subject=${encodeURIComponent(channel.suggestedSubject)}`}
              className="mt-3 inline-block text-base font-semibold text-[#0f4f7c] underline decoration-slate-300 underline-offset-4 transition-colors hover:text-[#0b3d61]"
            >
              {channel.email}
            </a>
          </article>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-slate-700">Office Address</h2>
        <p className="mt-2 text-slate-700">
          Regional Research Center, University of the Philippines Visayas, Miag-ao, Iloilo 5023
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
        <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-slate-700">Before Sending Your Message</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Include your institution, requested service, and preferred timeline so our team can respond with the most relevant details.
        </p>
      </div>
    </section>
  );
}

function ContactFormPanel() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <h2 className="font-[var(--font-roboto-slab)] text-2xl font-bold text-[#002560] md:text-3xl">Send A Message</h2>
      <p className="mt-3 text-slate-600">Complete the form and our team will get back to you.</p>
      <div className="mt-6">
        <ContactForm />
      </div>
    </section>
  );
}

export default async function ContactPage() {
  const page = await getPageBySlug('contact');
  const pageTitle = page?.title.replace(/<[^>]+>/g, '').trim() || 'Contact';
  
  if (!page) {
    // If migration didn't capture the contact page content, we still show the full contact module.
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          <ContactDetails title="Contact Us" />
          <ContactFormPanel />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <ContactDetails title={pageTitle} />
        <ContactFormPanel />
      </div>
    </main>
  );
}
