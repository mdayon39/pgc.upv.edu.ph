import type { Metadata, Viewport } from 'next';
import { Roboto, Roboto_Slab } from 'next/font/google';
import './globals.css';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { Analytics } from '@vercel/analytics/next';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
});

const robotoSlab = Roboto_Slab({
  variable: '--font-roboto-slab',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

const siteUrl = 'https://pgc-upv-edu-ph.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Philippine Genome Center Visayas',
    template: '%s | Philippine Genome Center Visayas',
  },
  description:
    'Philippine Genome Center Visayas provides genomics, bioinformatics, laboratory, and sequencing services for research and public health initiatives.',
  applicationName: 'PGC UPV',
  keywords: [
    'Philippine Genome Center',
    'PGC Visayas',
    'genomics',
    'bioinformatics',
    'sequencing services',
    'UP Visayas',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Philippine Genome Center Visayas',
    title: 'Philippine Genome Center Visayas',
    description:
      'Research-grade genomics and bioinformatics services for national and regional scientific initiatives.',
    locale: 'en_PH',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Philippine Genome Center Visayas',
    description:
      'Research-grade genomics and bioinformatics services for national and regional scientific initiatives.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f4f7c',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ResearchOrganization',
    name: 'Philippine Genome Center Visayas',
    url: siteUrl,
    email: 'info@pgc.upv.edu.ph',
    parentOrganization: {
      '@type': 'Organization',
      name: 'University of the Philippines Visayas',
    },
  };

  return (
    <html lang="en">
      <body className={`${roboto.variable} ${robotoSlab.variable} antialiased`}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <SiteHeader />
        <div id="main-content">{children}</div>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
