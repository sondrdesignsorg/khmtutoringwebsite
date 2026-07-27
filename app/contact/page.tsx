import type { Metadata } from 'next';
import { ContactContent } from '@/components/pages/ContactContent';
import { StructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Contact Us | Free Tutoring Consultation in Honolulu',
  description: 'Book a free tutoring consultation in Hawaii. In-home or online options with flexible scheduling. Expert tutors in Honolulu & Oahu.',
  keywords: ['SAT tutoring Hawaii', 'SSAT Tutor hawaii', 'math tutor hawaii', 'best tutor near me', 'contact KHM Tutoring', 'tutoring consultation', 'book tutor', 'tutoring inquiry', 'free consultation', 'schedule tutoring', 'Hawaii tutoring'],
  alternates: {
    canonical: 'https://www.khmtutoring.com/contact',
  },
  openGraph: {
    title: 'Contact KHM Tutoring | Free Tutoring Consultation in Honolulu',
    description: 'Book a free tutoring consultation in Hawaii. In-home or online, flexible scheduling.',
    url: 'https://www.khmtutoring.com/contact',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Contact KHM Tutoring - Expert Tutors in Hawaii' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact KHM Tutoring | Free Tutoring Consultation in Honolulu',
    description: 'Book a free tutoring consultation in Hawaii. In-home or online, flexible scheduling.',
    images: ['/og-image.png'],
  },
};

export default function ContactPage() {
  return (
    <>
      <StructuredData type="contact" />
      <ContactContent />
    </>
  );
}
