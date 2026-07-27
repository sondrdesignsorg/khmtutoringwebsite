import type { Metadata } from 'next';
import { DiagnosticTest } from '@/components/diagnostic/DiagnosticTest';
import { StructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Free Academic Diagnostic Test for Hawaii K-12 Students',
  description:
    'A free, level-appropriate diagnostic test that shows exactly where your child stands — with strengths and gaps by topic and a free tutoring consultation.',
  keywords: [
    'free diagnostic test',
    'tutoring assessment hawaii',
    'math assessment honolulu',
    'reading assessment hawaii',
    'SAT prep test hawaii',
    'academic diagnostic',
    'KHM Tutoring',
    'Hawaii tutoring assessment',
    'free academic test oahu',
  ],
  alternates: {
    canonical: 'https://www.khmtutoring.com/diagnostic-test',
  },
  openGraph: {
    title: 'Free Academic Diagnostic Test | KHM Tutoring Hawaii',
    description:
      'See exactly where your child stands. Take a quick diagnostic and get a personalized topic breakdown — plus a free consultation with a KHM tutor.',
    url: 'https://www.khmtutoring.com/diagnostic-test',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Free Diagnostic Test - KHM Tutoring Hawaii' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Academic Diagnostic Test | KHM Tutoring Hawaii',
    description:
      'See exactly where your child stands. Take a quick diagnostic and get a personalized topic breakdown.',
    images: ['/og-image.png'],
  },
};

export default function DiagnosticTestPage() {
  return (
    <>
      <StructuredData type="diagnostic" />
      <div className="pt-16 md:pt-20">
        <DiagnosticTest />
      </div>
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-heading font-bold">
            Why Take a Free Academic Diagnostic in Hawaii?
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Every student learns differently. Our free diagnostic test identifies exactly which math and English topics your
            child has mastered — and where the gaps are — so that KHM Tutoring can build a personalized plan from day one.
            Serving K-12 students across Honolulu, Oahu, and all of Hawaii, our expert tutors use your child&apos;s
            diagnostic results to skip the guesswork and start making real progress immediately.
          </p>
          <p className="text-muted-foreground text-base leading-relaxed">
            The test takes 5–15 minutes and covers grade-appropriate topics in Math or English. After submission, you
            receive a detailed topic-by-topic breakdown by email, plus an invitation for a <strong>free consultation</strong>{' '}
            with one of our tutors.
          </p>
        </div>
      </section>
    </>
  );
}
