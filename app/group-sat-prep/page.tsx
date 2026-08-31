import type { Metadata } from 'next';
import { SatGroupContent } from '@/components/pages/SatGroupContent';
import { StructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Group SAT Prep Classes in Honolulu, Hawaii',
  description:
    'Small-cohort SAT prep classes in Honolulu, Hawaii. 6–8 students matched by level, 20 hours of in-person instruction focused on SAT strategy, timing, and test-day confidence. Starting September 21, 2026 at 1025 Waimanu St.',
  keywords: [
    'group SAT tutoring Honolulu',
    'SAT prep class Honolulu',
    'SAT prep course Hawaii',
    'group SAT class Hawaii',
    'small cohort SAT prep',
    'SAT test prep Honolulu',
    'SAT prep Oahu',
    'in-person SAT class Honolulu',
    'SAT course Hawaii',
    'KHM SAT group',
  ],
  alternates: {
    canonical: 'https://www.khmtutoring.com/group-sat-prep',
  },
  openGraph: {
    title: 'Group SAT Prep Classes in Honolulu | KHM Tutoring',
    description:
      'In-person SAT prep classes in Honolulu, Hawaii. 6–8 students per cohort, 20 hours of live instruction starting September 21, 2026 at 1025 Waimanu St.',
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
    title: 'Group SAT Prep Classes in Honolulu | KHM Tutoring',
    description:
      'In-person SAT prep classes in Honolulu, Hawaii. Small cohorts of 6–8 students, 20 hours of live instruction focused on strategy, timing, and test-day confidence.',
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
