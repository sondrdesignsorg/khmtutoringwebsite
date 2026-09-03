import type { Metadata } from 'next';
import { SatGroupContent } from '@/components/pages/SatGroupContent';
import { StructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: {
    absolute: 'SAT Prep Classes in Honolulu | KHM Tutoring',
  },
  description:
    'Join small-group SAT prep classes in Honolulu: 6–8 students, 20 hours of in-person strategy and timed practice. Cohorts start September 21, 2026.',
  alternates: {
    canonical: 'https://www.khmtutoring.com/group-sat-prep',
  },
  openGraph: {
    title: 'SAT Prep Classes in Honolulu | KHM Tutoring',
    description:
      'Join small-group SAT prep classes in Honolulu: 6–8 students, 20 hours of in-person strategy and timed practice. Cohorts start September 21, 2026.',
    url: 'https://www.khmtutoring.com/group-sat-prep',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KHM Tutoring Small-Cohort SAT Prep in Honolulu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SAT Prep Classes in Honolulu | KHM Tutoring',
    description:
      'Join small-group SAT prep classes in Honolulu: 6–8 students, 20 hours of in-person strategy and timed practice. Cohorts start September 21, 2026.',
    images: ['/og-image.png'],
  },
};

export default function GroupSatPrepPage() {
  return (
    <>
      <StructuredData type="group-sat-prep" />
      <SatGroupContent />
    </>
  );
}
