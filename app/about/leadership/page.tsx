import type { Metadata } from 'next';
import { LeadershipContent } from '@/components/pages/LeadershipContent';

export const metadata: Metadata = {
  title: 'Leadership | KHM Tutoring',
  description:
    "Meet the KHM Tutoring leadership team, including founder Kody Kim, guiding Hawaii's premier personalized tutoring service.",
  keywords: ['KHM Tutoring leadership', 'Kody Kim', 'tutoring team', 'about KHM Tutoring', 'Hawaii tutoring'],
  alternates: {
    canonical: 'https://www.khmtutoring.com/about/leadership',
  },
  openGraph: {
    title: 'Leadership | KHM Tutoring',
    description:
      "Meet the KHM Tutoring leadership team, including founder Kody Kim.",
    url: 'https://www.khmtutoring.com/about/leadership',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'KHM Tutoring Leadership' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leadership | KHM Tutoring',
    description: "Meet the KHM Tutoring leadership team, including founder Kody Kim.",
    images: ['/og-image.png'],
  },
};

export default function LeadershipPage() {
  return <LeadershipContent />;
}
