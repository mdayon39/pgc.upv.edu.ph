'use client';

import { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker from unpkg CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

interface PDFFlipbookProps {
  pdfUrl: string;
  title?: string;
}

export default function PDFFlipbook({ pdfUrl, title }: PDFFlipbookProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        setLoading(true);
        
        // Construct full URL for PDF.js
        const fullUrl = pdfUrl.startsWith('http') 
          ? pdfUrl 
          : `${typeof window !== 'undefined' ? window.location.origin : ''}${pdfUrl}`;
        
        console.log('Loading PDF from:', fullUrl);
        
        const pdf = await pdfjsLib.getDocument({
          url: fullUrl,
          cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
          cMapPacked: true,
        }).promise;
        setNumPages(pdf.numPages);

        const pageImages: string[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          if (!context) continue;

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({
            canvasContext: context,
            viewport,
            canvas,
          }).promise;

          pageImages.push(canvas.toDataURL('image/png'));
        }

        setPages(pageImages);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error('Error loading PDF:', error);
        setError(`Failed to load PDF: ${errorMsg}`);
      } finally {
        setLoading(false);
      }
    };

    loadPdf();
  }, [pdfUrl]);

  const goToNextPage = () => {
    if (currentPage < numPages && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage((prev) => Math.min(prev + 1, numPages));
        setIsFlipping(false);
      }, 300);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
        setIsFlipping(false);
      }, 300);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const swipeThreshold = 50;
    const difference = touchStartX.current - touchEndX.current;

    if (Math.abs(difference) > swipeThreshold) {
      if (difference > 0) {
        goToNextPage();
      } else {
        goToPreviousPage();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <div className="text-center">
          <div className="mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-[#0f4f7c] mx-auto" />
          <p className="text-slate-600">Loading PDF...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center rounded-xl border border-red-200 bg-red-50">
        <p className="text-red-600 text-center px-4">{error}</p>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-slate-600">Failed to load PDF</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className="overflow-hidden rounded-xl border-4 border-slate-200 bg-black"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative h-[600px] w-full md:h-[700px]">
          <img
            src={pages[currentPage - 1]}
            alt={`Page ${currentPage}`}
            className={`h-full w-full object-contain transition-opacity duration-300 ${
              isFlipping ? 'opacity-90' : 'opacity-100'
            }`}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1 || isFlipping}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-slate-100 active:bg-slate-200"
            aria-label="Previous page"
          >
            ← Previous
          </button>
          <button
            onClick={goToNextPage}
            disabled={currentPage === numPages || isFlipping}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-slate-100 active:bg-slate-200"
            aria-label="Next page"
          >
            Next →
          </button>
        </div>

        <div className="text-center text-sm font-semibold text-slate-700">
          Page <span className="text-[#0f4f7c]">{currentPage}</span> of{' '}
          <span className="text-[#0f4f7c]">{numPages}</span>
        </div>

        <a
          href={pdfUrl}
          download
          className="rounded-lg bg-[#0f4f7c] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#0b3d61]"
        >
          Download
        </a>
      </div>

      <div className="text-center text-xs text-slate-500">
        Swipe or use buttons to navigate • Touch and hold to zoom
      </div>
    </div>
  );
}
