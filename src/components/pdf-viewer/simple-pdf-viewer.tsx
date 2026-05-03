'use client';

import React from 'react';

interface Props {
  pdfUrl: string;
}

export default function SimplePDFViewer({ pdfUrl }: { pdfUrl: string }) {
  return (
    <div className="flex flex-col items-center w-full bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
      {/* Container with responsive aspect ratio for the PDF iframe */}
      <div className="relative w-full h-[800px]">
        <iframe
          src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
          className="absolute inset-0 w-full h-full border-0"
          title="PDF Viewer"
        />
      </div>
      
      <div className="w-full p-4 bg-white border-t border-slate-200 text-center">
        <p className="text-sm text-slate-500 italic">
          Viewing PDF: {pdfUrl.split('/').pop()}
        </p>
      </div>
    </div>
  );
}
