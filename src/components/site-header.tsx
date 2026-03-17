import Link from 'next/link';
import { getMenuItems } from '@/services/wordpress';

export default async function SiteHeader() {
  const menuItems = await getMenuItems();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="bg-[#f8fafc] border-b border-slate-200">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-2 text-xs text-slate-600">
          <p>Philippine Genome Center Visayas</p>
          <Link href="/contact" className="font-medium text-[#1e4b75] hover:underline">
            Contact Us
          </Link>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-3">
          <img src="/uploads/2025/11/cropped-pgcv-150x150.jpg" alt="PGC UPV Logo" className="h-12 w-12 rounded-full object-cover" />
          <div>
            <Link href="/" className="block text-2xl font-bold tracking-tight text-[#002560]">
              PGC UPV
            </Link>
            <p className="text-sm text-slate-600">University of the Philippines Visayas</p>
          </div>
        </div>

        <nav className="hidden lg:block">
          <ul className="flex items-center gap-1 text-[13px] font-bold tracking-wide text-[#1f2937]">
            {menuItems.map((item) => (
              <li key={item.href} className="group relative">
                <Link href={item.href} className="inline-flex items-center rounded px-3 py-2 hover:bg-[#f1f5f9] hover:text-[#1e4b75]">
                  {item.label}
                </Link>
                {item.children && item.children.length > 0 && (
                  <ul className="invisible absolute left-0 top-full z-50 w-64 rounded-md border border-slate-200 bg-white p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link href={child.href} className="block rounded px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#1e4b75]">
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

        <div className="lg:hidden">
          <Link href="/news" className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700">
            NEWS
          </Link>
        </div>
      </div>
    </header>
  );
}
