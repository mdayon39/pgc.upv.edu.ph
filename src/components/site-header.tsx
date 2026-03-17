import Link from 'next/link';
import { getManagedMenu } from '@/lib/site-config';

export default async function SiteHeader() {
  const menuItems = await getManagedMenu();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="https://i0.wp.com/pgc.upv.edu.ph/wp-content/uploads/2021/07/PGC-VSF_Logo-C-1.png?fit=2551%2C863&ssl=1" 
              alt="PGC UPV Logo" 
              className="h-14 w-auto object-contain" 
            />
          </Link>
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
