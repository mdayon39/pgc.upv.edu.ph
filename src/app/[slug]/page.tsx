import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPages, getPageBySlug, getTeamMembers } from '@/services/wordpress';

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
  const isConsortiumMembers = slug === 'consortium-members';
  const isTeam = slug === 'team';

  if (RESERVED.has(slug)) {
    notFound();
  }

  const page = await getPageBySlug(slug);
  const resolvedPage = page ?? (isConsortiumMembers
    ? {
        title: 'Consortium Members',
        excerpt: '',
        content: '',
        featuredImage: null,
      }
    : null);

  if (!resolvedPage) {
    notFound();
  }

  const rawBodyHtml = resolvedPage.content || resolvedPage.excerpt;
  const hasBodyContent = rawBodyHtml.replace(/<[^>]+>/g, '').trim().length > 0;
  const teamMembers = isTeam ? await getTeamMembers() : [];

  const consortiumInstitutions = [
    'Western Philippines University',
    'Carlos Hilado Memorial State University',
    'Mariano Marcos State University',
    'Marinduque State College',
    'Central Philippine University',
    'President Ramon Magsaysay State University',
    'Silliman University',
    'Southern Leyte State University',
    'University of St. La Salle',
  ];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10">
      <article className={`rounded-2xl border shadow-lg overflow-hidden transition-all ${isConsortiumMembers ? 'bg-[#ececec]' : 'bg-white'}`}>
        {resolvedPage.featuredImage && !isConsortiumMembers && !isTeam && (
          <div className={`relative w-full ${isCapacityBuilding ? 'aspect-[2400/2175] bg-white' : 'h-[300px] md:h-[480px]'}`}>
            <img
              src={resolvedPage.featuredImage}
              alt={resolvedPage.title}
              className={`w-full h-full ${isCapacityBuilding ? 'object-contain object-center' : 'object-cover'}`}
            />
            {!isCapacityBuilding && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 md:p-12 text-center">
                <h1
                  className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg leading-tight"
                  dangerouslySetInnerHTML={{ __html: resolvedPage.title }}
                />
              </div>
            )}
          </div>
        )}
        <div className={isCapacityBuilding && !hasBodyContent ? 'p-0' : 'p-6 md:p-16'}>
          {!resolvedPage.featuredImage && !isConsortiumMembers && !isTeam && (
            <header className="mb-12 text-center border-b border-gray-200 pb-10">
              <h1 
                className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-[#002B5B] leading-tight" 
                dangerouslySetInnerHTML={{ __html: resolvedPage.title }} 
              />
            </header>
          )}

          {isTeam ? (
            <section>
              <header className="mb-12 text-center">
                <h1 className="text-3xl font-extrabold text-[#002B5B] md:text-5xl">Team</h1>
              </header>
              {(() => {
                const grouped = teamMembers.reduce((acc, member) => {
                  const dept = member.department || 'Other';
                  if (!acc[dept]) acc[dept] = [];
                  acc[dept].push(member);
                  return acc;
                }, {} as Record<string, typeof teamMembers>);

                const deptOrder = [
                  'Administrative Staff',
                  'Linkages, Extension & Quality Assurance',
                  'PGC Visayas Core Facility - Omics Laboratory',
                  'PGC Visayas Core Facility - Bioinformatics Laboratory',
                ];

                return deptOrder
                  .filter((dept) => grouped[dept])
                  .map((dept) => (
                    <div key={dept} className="mb-12">
                      <h2 className="mb-8 text-2xl font-bold text-[#002B5B] border-l-4 border-[#002B5B] pl-4">
                        {dept}
                      </h2>
                      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {grouped[dept]!.map((member) => (
                          <li key={member.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="overflow-hidden rounded-xl bg-slate-100">
                              <img
                                src={member.image}
                                alt={member.name}
                                className="aspect-square h-auto w-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-slate-900">{member.name}</h3>
                            {member.role ? <p className="mt-1 text-sm text-slate-600">{member.role}</p> : null}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ));
              })()}
            </section>
          ) : isConsortiumMembers ? (
            <section className="grid items-start gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
              <div>
                <h2 className="text-2xl font-bold leading-tight text-black md:text-[44px]">
                  Institutions with existing consortium agreements
                </h2>
                <p className="mt-2 text-xl italic text-black md:text-[32px]">as of February 2026</p>

                <ul className="mt-10 space-y-2 text-xl leading-tight text-black md:text-[22px]">
                  {consortiumInstitutions.map((institution) => (
                    <li key={institution}>{institution}</li>
                  ))}
                </ul>
              </div>

              <div className="mx-auto w-full max-w-xl lg:mx-0">
                <img
                  src="/assets/ConsortiumMembers/consortium-members.JPG"
                  alt="Consortium member institutions logos"
                  className="h-auto w-full object-contain"
                />
              </div>
            </section>
          ) : isCapacityBuilding && !hasBodyContent ? null : (
            <div className="content-html max-w-4xl mx-auto" dangerouslySetInnerHTML={{ __html: rawBodyHtml }} />
          )}
        </div>
      </article>
    </main>
  );
}
