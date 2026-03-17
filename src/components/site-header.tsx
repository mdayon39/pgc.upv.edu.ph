import Link from 'next/link';
import { getMenuItems } from '@/services/wordpress';

export default async function SiteHeader() {
  const menuItems = await getMenuItems();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/" className="text-xl font-bold text-blue-900">
            PGC UPV
          </Link>
          <p className="text-sm text-gray-600">Philippine Genome Center Visayas</p>
        </div>
        <nav className="flex flex-wrap gap-3 text-sm md:justify-end">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-gray-700 hover:border-blue-200 hover:text-blue-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
