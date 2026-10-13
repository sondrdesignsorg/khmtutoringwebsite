import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Location',
  description: 'KHM Tutoring’s new physical location in collaboration with Surfers Coffee Hawaiʻi - Kakaʻako.',
  alternates: {
    canonical: 'https://www.khmtutoring.com/about/location',
  },
};

export default function OurLocationPage() {
  return (
    <main className="min-h-[60vh] bg-white px-4 pb-16 pt-24 md:pt-28">
      <div className="container mx-auto">
        <h1 className="text-center text-4xl font-heading font-bold text-gray-900 md:text-5xl">
          Our Location
        </h1>
      </div>
    </main>
  );
}
