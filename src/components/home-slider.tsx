'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Slide {
  image: string;
  title: string;
  description: string;
  link: string;
}

const slides: Slide[] = [
  {
    image: '/uploads/2025/11/pgcv-1.jpg',
    title: 'Advancing Genomics Research in Western Visayas',
    description: 'Providing world-class genomics and bioinformatics services to the scientific community.',
    link: '/pgc-visayas-services',
  },
  {
    image: '/uploads/2025/11/pgcv.jpg',
    title: 'Supporting National Health Initiatives',
    description: 'Collaborating with national and international partners for public health genomics.',
    link: '/about-2',
  }
];

export default function HomeSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[450px] md:h-[600px] w-full overflow-hidden bg-[#0f2745]">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-6xl px-4 text-white">
              <div className="max-w-3xl animate-in fade-in slide-in-from-left-4 duration-700">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">Featured</p>
                <h2 className="mt-4 font-[var(--font-roboto-slab)] text-4xl font-bold leading-tight md:text-6xl">
                  {slide.title}
                </h2>
                <p className="mt-6 text-lg text-blue-50 md:text-xl">
                  {slide.description}
                </p>
                <div className="mt-10 flex gap-4">
                  <Link
                    href={slide.link}
                    className="rounded bg-[#235787] px-8 py-3.5 text-sm font-bold transition-transform hover:scale-105 active:scale-95"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2.5 w-2.5 rounded-full border border-white/50 transition-all ${
              index === current ? 'w-8 bg-white' : 'bg-white/20'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
