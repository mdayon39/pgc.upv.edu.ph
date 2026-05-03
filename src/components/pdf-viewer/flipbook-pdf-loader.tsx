'use client';

import dynamic from 'next/dynamic';

const FlipbookPDF = dynamic(() => import('./flipbook-pdf'), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full animate-pulse rounded-xl bg-slate-100" />,
});

export default function FlipbookPDFLoader({ pdfUrl }: { pdfUrl: string }) {
  return <FlipbookPDF pdfUrl={pdfUrl} />;
}
