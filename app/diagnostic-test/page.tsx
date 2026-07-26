import type { Metadata } from 'next';
import { DiagnosticTest } from '@/components/diagnostic/DiagnosticTest';

export const metadata: Metadata = {
  title: 'Free Diagnostic Test | KHM Tutoring',
  description:
    'A free, level-appropriate diagnostic test that shows exactly where your child stands — with strengths and gaps by topic and a free tutoring consultation.',
  keywords: [
    'free diagnostic test',
    'tutoring assessment',
    'math assessment',
    'reading assessment',
    'SAT prep test',
    'KHM Tutoring',
    'Hawaii tutoring',
  ],
  alternates: {
    canonical: 'https://www.khmtutoring.com/diagnostic-test',
  },
  openGraph: {
    title: 'Free Diagnostic Test | KHM Tutoring',
    description:
      'See exactly where your child stands. Take a quick diagnostic and get a personalized topic breakdown.',
    url: 'https://www.khmtutoring.com/diagnostic-test',
  },
};

export default function DiagnosticTestPage() {
  return <DiagnosticTest />;
}
