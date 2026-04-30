import Link from 'next/link';
import { getManagedMenu } from '@/lib/site-config';

export default async function SiteHeader() {
  const menuItems = (await getManagedMenu()).map((item) => {
    const isServices = item.label.trim().toLowerCase() === 'services' || item.href.trim().toLowerCase() === '/pgc-visayas-services';
    if (isServices) {
      return {
        ...item,
        children: [
          {
            id: 'services-omics-lab',
            label: 'Omics Laboratory Services',
            href: '/services-sequencing-services',
            order: 1,
          },
          {
            id: 'services-bioinformatics-lab',
            label: 'Bioinformatics Laboratory Services',
            href: '/services-bioinformatics-laboratory-services',
            order: 2,
          },
          {
            id: 'services-equipment-catalog',
            label: 'Equipment Catalog',
            href: '/services-laboratory-equipment',
            order: 3,
          },
        ],
      };
    }

    const isConsortium = item.label.trim().toLowerCase() === 'consortium' || item.href.trim().toLowerCase() === '/consortium';
    if (!isConsortium) return item;

    const children = (item.children ?? []).map((child) => {
      const childHref = child.href.trim().toLowerCase();
      const childLabel = child.label.trim().toLowerCase();

      if (childHref === '/capacity-building-scheme' || childLabel === 'capacity building scheme') {
        return {
          ...child,
          label: 'Capacity Building Scheme',
        };
      }

      if (childHref === '/consortium-members' || childLabel === 'consortium members') {
        return {
          ...child,
          label: 'Consortium Members',
        };
      }

      return child;
    });
    const hasConsortiumMembers = children.some((child) => child.href.trim().toLowerCase() === '/consortium-members');

    if (hasConsortiumMembers) {
      return {
        ...item,
        children,
      };
    }

    return {
      ...item,
      children: [
        ...children,
        {
          id: 'consortium-members',
          label: 'Consortium Members',
          href: '/consortium-members',
          order: 999,
        },
      ],
    };
  }).filter((item) => {
    const normalizedLabel = item.label.trim().toLowerCase();
    const normalizedHref = item.href.trim().toLowerCase();
    return normalizedLabel !== 'faqs' && normalizedHref !== '/faqs';
  });

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:py-5">
        <Link href="/" className="flex items-center gap-3 md:gap-4">
          <img
            src="https://i0.wp.com/pgc.upv.edu.ph/wp-content/uploads/2021/07/PGC-VSF_Logo-C-1.png?fit=2551%2C863&ssl=1"
            alt="PGC UPV Logo"
            className="h-12 w-auto object-contain md:h-14 lg:h-16"
          />
          <div className="hidden min-[420px]:block">
            <p className="font-[var(--font-roboto-slab)] text-base font-bold leading-tight text-[#123b5d] md:text-lg">
              Philippine Genome Center
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4e6a80] md:text-xs">
              Visayas Facility
            </p>
          </div>
        </Link>

        <nav className="hidden lg:block" aria-label="Main navigation">
          <ul className="flex items-center gap-1 text-[13px] font-bold uppercase tracking-[0.08em] text-[#22364a]">
            {menuItems.map((item) => (
              <li key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 rounded-full px-4 py-2.5 transition-colors hover:bg-[#edf4fb] hover:text-[#0f4f7c]"
                >
                  {item.label}
                  {item.children && item.children.length > 0 ? (
                    <span aria-hidden="true" className="text-[10px] text-slate-500 transition-transform group-hover:translate-y-[1px]">
                      ▼
                    </span>
                  ) : null}
                </Link>

                {item.children && item.children.length > 0 && (
                  <ul className="invisible absolute left-0 top-full z-50 mt-2 w-72 translate-y-2 rounded-xl border border-slate-200 bg-white p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block rounded-lg px-3 py-2.5 text-[13px] font-semibold normal-case tracking-normal text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#0f4f7c]"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <details className="relative lg:hidden">
          <summary className="list-none rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold uppercase tracking-wide text-slate-700 shadow-sm marker:content-none">
            Menu
          </summary>
          <nav
            aria-label="Mobile navigation"
            className="absolute right-0 z-50 mt-3 w-80 max-w-[90vw] rounded-xl border border-slate-200 bg-white p-3 shadow-xl"
          >
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={`mobile-${item.href}`} className="rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50">
                  <Link href={item.href} className="block px-3 py-2.5 text-sm font-semibold text-slate-800">
                    {item.label}
                  </Link>
                  {item.children && item.children.length > 0 ? (
                    <ul className="pb-2 pl-3">
                      {item.children.map((child) => (
                        <li key={`mobile-child-${child.href}`}>
                          <Link href={child.href} className="block px-3 py-1.5 text-sm text-slate-600 hover:text-[#0f4f7c]">
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
