'use client';

import { useState, useEffect } from 'react';

interface Slide {
  image: string;
  title: string;
  description: string;
  link: string;
}

const slides: Slide[] = [
  {
    image: 'https://i0.wp.com/pgc.upv.edu.ph/wp-content/uploads/2024/07/5-1-scaled.jpg?fit=2560%2C1229&ssl=1',
    title: 'Advancing Genomics Research in Western Visayas',
    description: 'Providing world-class genomics and bioinformatics services to the scientific community.',
    link: '/pgc-visayas-services',
  },
  {
    image: 'https://i0.wp.com/pgc.upv.edu.ph/wp-content/uploads/2022/10/IMG_5535-1-scaled.jpg?fit=2560%2C1229&ssl=1',
    title: 'Supporting National Health Initiatives',
    description: 'Collaborating with national and international partners for public health genomics.',
    link: '/about-2',
  },
  {
    image: 'https://i0.wp.com/pgc.upv.edu.ph/wp-content/uploads/2024/07/3-1-scaled.jpg?fit=2560%2C1229&ssl=1',
    title: 'Fisheries and Aquatic Research',
    description: 'Spearheading the utilization of omics in fisheries and aquatic research in the Philippines.',
    link: '/pgc-visayas-services',
  }
];

export default function HomeSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section
      className="relative h-[500px] w-full overflow-hidden bg-[#0f2745] md:h-[640px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      aria-label="Homepage image carousel"
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 will-change-[opacity] transition-opacity duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'auto'}
            decoding="async"
            onError={(event) => {
              event.currentTarget.src = '/assets/ConsortiumMembers/consortium-members.JPG';
            }}
            className={`h-full w-full object-cover will-change-transform transition-transform duration-[7000ms] ease-linear motion-reduce:transition-none ${
              index === current
                ? index % 2 === 0
                  ? 'scale-105 translate-x-1 md:translate-x-2'
                  : 'scale-105 -translate-x-1 md:-translate-x-2'
                : 'scale-100 translate-x-0'
            }`}
          />
        </div>
      ))}

      <div className="absolute inset-x-0 top-1/2 mx-auto flex w-full max-w-7xl -translate-y-1/2 justify-between px-4">
        <button
          type="button"
          onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
          className="rounded-full border border-white/35 bg-black/45 px-3 py-2 text-white hover:bg-black/60"
          aria-label="Previous slide"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
          className="rounded-full border border-white/35 bg-black/45 px-3 py-2 text-white hover:bg-black/60"
          aria-label="Next slide"
        >
          →
        </button>
      </div>

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
    </section>
  );
}
