import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Location',
  description: 'KHM Tutoring’s new physical location is coming soon.',
  alternates: {
    canonical: 'https://www.khmtutoring.com/about/location',
  },
};

export default function OurLocationPage() {
  return (
    <main className="min-h-[70vh] bg-gradient-to-b from-white via-primary/[0.03] to-white px-4 pb-20 pt-28 md:pt-36">
      <div className="container mx-auto">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-primary/15 bg-white px-6 py-16 text-center shadow-[0_18px_55px_rgba(15,23,42,0.08)] sm:px-10 md:py-24">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Our Location
          </p>
          <h1 className="mb-6 text-4xl font-heading font-bold text-gray-900 md:text-6xl">
            Coming Soon
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-gray-600 md:text-xl">
            KHM Tutoring&apos;s new physical location, in collaboration with Surfers Coffee Hawaiʻi –
            Kakaʻako, is coming soon. Stay tuned for more details.
          </p>
        </div>
      </div>
    </main>
  );
}
