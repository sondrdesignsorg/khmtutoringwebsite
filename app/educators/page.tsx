import type { Metadata } from 'next';
import { EducatorsContent } from '@/components/pages/EducatorsContent';
import { StructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Meet Our Expert Tutors',
  description: 'Meet 10+ expert tutors from Harvard, Princeton & Phillips Exeter. Math, English, SAT, SSAT, AP prep in Hawaii.',
  keywords: ['SAT tutoring Hawaii', 'SSAT Tutor hawaii', 'math tutor hawaii', 'best tutor near me', 'tutors', 'educators', 'math tutors', 'English tutors', 'SAT tutors', 'AP tutors', 'certified tutors', 'experienced teachers', 'test prep specialists', 'Hawaii tutors', 'best tutors Hawaii'],
  alternates: {
    canonical: 'https://www.khmtutoring.com/educators',
  },
  openGraph: {
    title: 'Meet Our Expert Tutors | KHM Tutoring Hawaii',
    description: 'Meet 10+ expert tutors from Harvard, Princeton & Phillips Exeter. Math, English, SAT, SSAT, AP prep in Hawaii.',
    url: 'https://www.khmtutoring.com/educators',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'KHM Tutoring Expert Tutors in Hawaii' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meet Our Expert Tutors | KHM Tutoring Hawaii',
    description: 'Meet 10+ expert tutors from Harvard, Princeton & Phillips Exeter. Math, English, SAT, SSAT, AP prep in Hawaii.',
    images: ['/og-image.png'],
  },
};

export default function EducatorsPage() {
  return (
    <>
      <StructuredData type="educators" />
      <EducatorsContent />
    </>
  );
}
