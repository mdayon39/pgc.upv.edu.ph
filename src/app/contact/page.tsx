import { getPageBySlug } from '@/services/wordpress';
import ContactForm from '@/components/contact-form';
import { notFound } from 'next/navigation';

export default async function ContactPage() {
  const page = await getPageBySlug('contact');
  
  if (!page) {
    // If migration didn't capture the contact page content, we still show the form
    return (
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 md:flex-row">
          <div className="flex-1">
            <h1 className="font-[var(--font-roboto-slab)] text-4xl font-bold text-[#002560]">Contact Us</h1>
            <p className="mt-4 text-lg text-slate-600">
              Have questions or need assistance? Reach out to the Philippine Genome Center Visayas team.
            </p>
            <div className="mt-10 space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Office Address</h3>
                <p className="mt-1 text-slate-700">Regional Research Center, University of the Philippines Visayas, Miag-ao, Iloilo 5023</p>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Email Address</h3>
                <p className="mt-1 text-[#1e4b75] font-medium">pgc_visayas.upvisayas@up.edu.ph</p>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <ContactForm />
          </div>
        </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 md:flex-row">
      <div className="flex-1 content-html">
        <h1 className="font-[var(--font-roboto-slab)] text-4xl font-bold text-[#002560] mb-8" dangerouslySetInnerHTML={{ __html: page.title }} />
        <div dangerouslySetInnerHTML={{ __html: page.content || page.excerpt }} />
      </div>
      <div className="flex-1">
        <ContactForm />
      </div>
    </main>
  );
}
