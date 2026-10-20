import type { Metadata } from 'next';
import { LocationContent } from '@/components/pages/LocationContent';
import { BUSINESS } from '@/lib/business/config';

const title = 'Our Location in Kakaʻako, Honolulu';
const description =
  'KHM Tutoring’s in-person hub at Surfers Coffee inside WorkNow Hawaiʻi, 1019 Waimanu St., Unit 101, Honolulu. After 2 PM the café is not open to the public — the space is reserved exclusively for KHM students and families. Tutoring daily after 3 PM, with on-site parking.';
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
        url: '/images/location/kakaako-study-floor.jpg',
        width: 1400,
        height: 1050,
        alt: 'Students studying at tables across KHM Tutoring’s Kakaʻako learning space',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${title} | KHM Tutoring`,
    description,
    images: ['/images/location/kakaako-study-floor.jpg'],
  },
};

export default function OurLocationPage() {
  return <LocationContent />;
}
