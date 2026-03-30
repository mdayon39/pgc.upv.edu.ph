'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

type SearchResult = {
  type: 'post' | 'page';
  title: string;
  slug: string;
  excerpt: string;
  href: string;
};

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const closeSearch = useCallback(() => {
    setOpen(false);
    setQuery('');
    setResults([]);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeSearch();
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeSearch();
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [closeSearch]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Open search"
        className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#0f4f7c]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
        </svg>
      </button>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="absolute right-0 top-1/2 z-50 flex -translate-y-1/2 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 shadow-sm focus-within:border-[#0f4f7c] focus-within:ring-2 focus-within:ring-[#0f4f7c]/20">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-slate-400">
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search pages & news..."
          className="w-48 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:w-56 md:w-72"
          aria-label="Search"
        />
        <button
          onClick={closeSearch}
          aria-label="Close search"
          className="rounded p-0.5 text-slate-400 hover:text-slate-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      </div>

      {(results.length > 0 || (loading && query.length >= 2) || (query.length >= 2 && !loading && results.length === 0)) && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[90vw] rounded-xl border border-slate-200 bg-white p-2 shadow-xl md:w-96">
          {loading && (
            <p className="px-3 py-4 text-center text-sm text-slate-400">Searching...</p>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <p className="px-3 py-4 text-center text-sm text-slate-400">No results found</p>
          )}

          {!loading && results.length > 0 && (
            <ul className="space-y-0.5">
              {results.map((result) => (
                <li key={result.href}>
                  <Link
                    href={result.href}
                    onClick={closeSearch}
                    className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-50"
                  >
                    <span className="mb-0.5 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      {result.type}
                    </span>
                    <p className="text-sm font-semibold text-slate-800" dangerouslySetInnerHTML={{ __html: result.title }} />
                    {result.excerpt && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{result.excerpt}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
