import type { Metadata } from 'next';

const PDF_PATH = '/assets/About/CitizensCharter/2026CitizensCharterPGCVisayas.pdf';

export const metadata: Metadata = {
  title: "Citizen's Charter",
  description: 'PGC Visayas 2026 Citizen\'s Charter',
};

export default function CitizensCharterPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10">
      <article className="rounded-2xl border bg-white p-6 shadow-lg md:p-10">
        <header className="mb-8 border-b border-slate-200 pb-6 text-center">
          <h1 className="text-3xl font-extrabold text-[#002B5B] md:text-4xl">Citizen's Charter</h1>
          <p className="mx-auto mt-3 max-w-3xl text-slate-600">
            Access the official 2026 PGC Visayas Citizen's Charter. You can view it directly below,
            open it in a new tab, or download a copy.
          </p>
        </header>

        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href={PDF_PATH}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#0f4f7c] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0b3d61]"
          >
            Open PDF
          </a>
          <a
            href={PDF_PATH}
            download
            className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Download PDF
          </a>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <iframe
            title="PGC Visayas 2026 Citizen's Charter PDF"
            src={PDF_PATH}
            className="h-[78vh] w-full"
          />
        </div>
      </article>
    </main>
  );
}
