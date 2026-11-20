import type { Metadata } from 'next';
import { AboutContent } from '@/components/pages/AboutContent';
import { StructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'About KHM Tutoring | Honolulu, Hawaii',
  description: "Learn about KHM Tutoring, a Honolulu tutoring service founded in 2016 and offering personalized academic support for students across Hawaii.",
  keywords: ['about KHM Tutoring', 'tutoring company', 'educational services', 'tutoring history', 'tutoring mission', 'experienced educators', 'personalized learning', 'Hawaii tutoring'],
  alternates: {
    canonical: 'https://www.khmtutoring.com/about',
  },
  openGraph: {
    title: 'About KHM Tutoring | Honolulu, Hawaii',
    description: "Learn about KHM Tutoring, a Honolulu tutoring service founded in 2016 and offering personalized academic support for students across Hawaii.",
    url: 'https://www.khmtutoring.com/about',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'About KHM Tutoring - Expert Tutors in Hawaii' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "About KHM Tutoring | Hawaii's Premier Tutoring Service",
    description: "KHM Tutoring's mission: empowering Hawaii students through personalized education since 2016.",
    images: ['/og-image.png'],
  },
};

export default function AboutPage() {
  return (
    <>
      <StructuredData type="about" />
      <AboutContent />
    </>
  );
}
