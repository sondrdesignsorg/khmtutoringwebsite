import type { Metadata } from 'next';
import { LocationContent } from '@/components/pages/LocationContent';
import { BUSINESS } from '@/lib/business/config';

const title = 'Our Location in Kakaʻako, Honolulu';
const description =
  'KHM Tutoring’s new in-person hub at Surfers Coffee inside WorkNow Hawaiʻi, 1019 Waimanu St., Unit 101, Honolulu. Individual and group tutoring daily after 3 PM, with on-site parking.';
const url = `${BUSINESS.url}/about/location`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'tutoring Kakaako',
    'Kakaʻako tutoring',
    'Honolulu tutoring center',
    'in-person tutoring Honolulu',
    'group tutoring Honolulu',
    'KHM Tutoring location',
    'Waimanu St tutoring',
  ],
  alternates: {
    canonical: url,
  },
  openGraph: {
    title: `${title} | KHM Tutoring`,
    description,
    url,
    images: [
      {
        url: '/images/location/kakaako-cafe-interior.jpg',
        width: 1152,
        height: 840,
        alt: 'Inside Surfers Coffee in Kakaʻako, home of KHM Tutoring’s in-person sessions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${title} | KHM Tutoring`,
    description,
    images: ['/images/location/kakaako-cafe-interior.jpg'],
  },
};

export default function OurLocationPage() {
  return <LocationContent />;
}
