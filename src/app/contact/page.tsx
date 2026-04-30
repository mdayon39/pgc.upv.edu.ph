import { getPageBySlug } from '@/services/wordpress';

const CONTACT_CHANNELS = [
  {
    id: 'office',
    title: 'Office-related Concerns',
    email: 'pgc.upvisayas@up.edu.ph',
    description: 'General office inquiries and administrative concerns.',
    suggestedSubject: 'Administrative Inquiry',
  },
  {
    id: 'omics',
    title: 'Sequencing and Laboratory Services-related',
    email: 'sequencing.pgc.upvisayas@up.edu.ph',
    description: 'Sequencing requests, sample requirements, and laboratory services coordination.',
    suggestedSubject: 'Omics Service Request',
  },
  {
    id: 'bioinformatics',
    title: 'Bioinformatics Analysis-related',
    email: 'bioinfo.pgc.upvisayas@up.edu.ph',
    description: 'Bioinformatics analysis, interpretation, and data-processing support.',
    suggestedSubject: 'Bioinformatics Inquiry',
  },
];

const PGC_VISAYAS_LOCATION = 'PGC Visayas Laboratories, Room 205, 2nd Floor, Regional Research Center Building, Road 8, New Academic Complex, University of the Philippines Visayas, 5023 Miagao, Iloilo';
const CONTACT_MOBILE = '+63915-3370-408';
const CONTACT_MOBILE_LINK = '+639153370408';
const CONTACT_LANDLINE = '315-9631, 315-9632, 315-9802 loc. 2723';
const MAPS_PLACE_URL = 'https://www.google.com/maps/place/University+of+the+Philippines+Visayas/@10.64204,122.230829,865m/data=!3m1!1e3!4m6!3m5!1s0x33ae5b8761c629f5:0x8b0a8c7844cc30cd!8m2!3d10.64204!4d122.230829!16s%2Fm%2F02qny6r?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDQyNy4wIKXMDSoASAFQAw%3D%3D';
const MAP_EMBED_URL = 'https://www.google.com/maps?q=10.64204,122.230829&z=16&output=embed';

const PGC_NETWORK = [
  {
    id: 'pgc-main',
    name: 'Philippine Genome Center',
    address: 'A. Ma. Regidor Street, National Science Complex, U.P. Campus, University of the Philippines, 1101, Quezon City, Metro Manila',
    website: 'https://pgc.up.edu.ph/',
  },
  {
    id: 'pgc-mindanao',
    name: 'Philippine Genome Center Mindanao',
    address: 'College of Science and Mathematics, University of the Philippines Mindanao, Mintal, Tugbok District, Davao City, 8000',
    website: 'https://pgc.upmin.edu.ph/',
  },
];

type ContactDetailsProps = {
  title: string;
};

function ContactDetails({ title }: ContactDetailsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <h1 className="font-[var(--font-roboto-slab)] text-3xl font-bold text-[#002560] md:text-4xl">{title}</h1>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-slate-700">Location</h2>
        <p className="mt-2 text-slate-700">{PGC_VISAYAS_LOCATION}</p>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-slate-700">Call or Text us at</h2>
          <a
            href={`tel:${CONTACT_MOBILE_LINK}`}
            className="mt-2 inline-block text-base font-semibold text-[#0f4f7c] underline decoration-slate-300 underline-offset-4 transition-colors hover:text-[#0b3d61]"
          >
            {CONTACT_MOBILE}
          </a>
        </article>

        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-slate-700">Local/Landline</h2>
          <p className="mt-2 text-slate-700">{CONTACT_LANDLINE}</p>
        </article>
      </div>

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
        <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-slate-700">Find Us On Map</h2>
        <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
          <iframe
            title="PGC Visayas map location"
            src={MAP_EMBED_URL}
            className="h-80 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <a
          href={MAPS_PLACE_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-sm font-semibold text-[#0f4f7c] underline decoration-slate-300 underline-offset-4 hover:text-[#0b3d61]"
        >
          Open Google Maps
        </a>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-slate-700">Philippine Genome Center Network</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {PGC_NETWORK.map((center) => (
            <article key={center.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-base font-bold text-slate-800">{center.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{center.address}</p>
              <p className="mt-2 text-sm text-slate-700">
                Website:{' '}
                <a
                  href={center.website}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#0f4f7c] underline decoration-slate-300 underline-offset-4 hover:text-[#0b3d61]"
                >
                  {center.website}
                </a>
              </p>
            </article>
          ))}
        </div>
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
        <ContactDetails title="Contact Us" />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
      <ContactDetails title={pageTitle} />
    </main>
  );
}
