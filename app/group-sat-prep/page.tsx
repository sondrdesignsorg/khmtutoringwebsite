import type { Metadata } from 'next';
import { SatGroupContent } from '@/components/pages/SatGroupContent';

export const metadata: Metadata = {
  title: 'Small-Cohort SAT Prep | KHM Tutoring Hawaii',
  description:
    'KHM Tutoring small-cohort SAT prep starting September 6. 20 hours of live instruction focused on SAT strategy, timing, test-day confidence, and cohort-fit placement.',
  keywords: [
    'SAT group tutoring Hawaii',
    'SAT prep Honolulu',
    'small cohort SAT prep',
    'SAT test strategies',
    'SAT prep online Hawaii',
    'KHM SAT group',
    'SAT test prep Oahu',
    'SAT timing strategy',
  ],
  alternates: {
    canonical: 'https://www.khmtutoring.com/group-sat-prep',
  },
  openGraph: {
    title: 'Small-Cohort SAT Prep | KHM Tutoring Hawaii',
    description:
      '6-8 student cohorts, 20 total hours, targeted September 6 start. Built around SAT strategy, timing, and calmer test-day execution.',
    url: 'https://www.khmtutoring.com/group-sat-prep',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KHM Tutoring Small-Cohort SAT Prep',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Small-Cohort SAT Prep | KHM Tutoring Hawaii',
    description:
      '20 hours of live SAT instruction in 6-8 student cohorts, focused on strategy, timing, and test-day confidence.',
    images: ['/og-image.png'],
  },
};

export default function GroupSatPrepPage() {
  return <SatGroupContent />;
}
