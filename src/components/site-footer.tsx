import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="mt-16">
      <div className="bg-[#002560] text-white">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
          <section>
            <h2 className="text-lg font-bold">Philippine Genome Center Visayas</h2>
            <p className="mt-3 text-sm text-blue-100">
              Building national capacity in genomics and bioinformatics through research, services, and training.
            </p>
          </section>
          <section>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="hover:underline" href="/about-2">About</Link></li>
              <li><Link className="hover:underline" href="/pgc-visayas-services">Services</Link></li>
              <li><Link className="hover:underline" href="/opportunities">Opportunities</Link></li>
              <li><Link className="hover:underline" href="/news">News</Link></li>
            </ul>
          </section>
          <section>
            <p className="mt-3 text-sm text-blue-100">University of the Philippines Visayas</p>
            <p className="text-sm text-blue-100">Miag-ao, Iloilo, Philippines</p>
            <p className="mt-2 text-sm text-blue-100">Email: pgc.upvisayas@up.edu.ph</p>
          </section>
        </div>
      </div>
      <div className="bg-[#001b47] py-3 text-center text-xs text-blue-100">
        Copyright © {new Date().getFullYear()} Philippine Genome Center Visayas. All rights reserved.
      </div>
    </footer>
  );
}
