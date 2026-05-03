'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import * as pdfjsLib from 'pdfjs-dist';

// Use the locally-hosted worker (copied to /public during setup)
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface Props {
  pdfUrl: string;
}

const Page = React.forwardRef<HTMLDivElement, { pageNumber: number; image: string }>((props, ref) => {
  return (
    <div className="bg-white shadow-md border" ref={ref}>
      <img src={props.image} alt={`Page ${props.pageNumber}`} className="w-full h-full object-contain" />
    </div>
  );
});

Page.displayName = 'Page';

export default function FlipbookPDF({ pdfUrl }: Props) {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const flipBookRef = useRef<any>(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        setLoading(true);
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        const pageImages: string[] = [];

        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          if (context) {
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: context, viewport }).promise;
            pageImages.push(canvas.toDataURL());
          }
        }
        setPages(pageImages);
        setLoading(false);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError('Failed to load PDF. Please try downloading it instead.');
        setLoading(false);
      }
    };

    loadPdf();
  }, [pdfUrl]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0f4f7c] border-t-transparent"></div>
          <span className="text-slate-600 font-medium">Preparing Flipbook...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-6 bg-slate-50 rounded-lg overflow-hidden">
      <div className="w-full max-w-5xl flex justify-center mb-4">
         {/* @ts-ignore - react-pageflip types missing */}
        <HTMLFlipBook
          width={500}
          height={700}
          size="stretch"
          minWidth={315}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1533}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          className="shadow-2xl"
          ref={flipBookRef}
        >
          {pages.map((image, index) => (
            <Page key={index} pageNumber={index + 1} image={image} />
          ))}
        </HTMLFlipBook>
      </div>
      
      <div className="mt-6 flex items-center gap-6">
        <button 
          onClick={() => flipBookRef.current?.pageFlip()?.prevPage()}
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow border hover:bg-slate-50 transition-colors"
        >
          Previous
        </button>
        <span className="text-sm font-bold text-[#002B5B]">
          Flip the corners of the pages!
        </span>
        <button 
          onClick={() => flipBookRef.current?.pageFlip()?.nextPage()}
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow border hover:bg-slate-50 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
