import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ScrollStack, type ScrollStackItem } from '@/components/home/ScrollStack';

const reasons: ScrollStackItem[] = [
  {
    icon: 'pin',
    title: 'Local Hawaii Tutors',
    description: 'Our tutors live and work in Honolulu and across Oahu. We understand the Hawaii education system, local school curricula, and what it takes to succeed at top schools like Punahou, Iolani, and Hawaii public schools.',
    points: [
      'Tutors who know Punahou, Iolani & local curricula',
      'In person across the Honolulu corridor',
      'Online statewide via Zoom',
    ],
    cta: 'Meet our tutors →',
    href: '/educators',
  },
  {
    icon: 'users',
    title: 'One-on-One Attention',
    description: 'Every tutoring session is personalized to your child\'s learning style. Our Honolulu tutors adapt their teaching methods to match how your student learns best, ensuring maximum comprehension and retention.',
    points: [
      'A learning plan built around your student',
      'Teaching matched to how they learn best',
      'Progress you can actually see',
    ],
    cta: 'See our approach →',
    href: '/about',
  },
  {
    icon: 'award',
    title: 'Proven Track Record',
    description: 'With over 300 students helped and a 15% average score improvement, our Hawaii tutoring services deliver measurable results. Parents across Oahu trust us for math tutoring, SAT prep, and academic excellence.',
    points: ['300+ students helped', '+15% average score improvement', '5.0 parent rating'],
    cta: 'Explore tutoring services →',
    href: '/#services',
  },
  {
    icon: 'clock',
    title: 'Flexible Scheduling',
    description: 'We offer in-home tutoring throughout Honolulu, online sessions, and flexible scheduling to fit your family\'s busy lifestyle. Quality tutoring is always accessible.',
    points: [
      'In-home, at our Kakaʻako space, or online',
      'After-school and evening sessions',
      'By appointment, seven days a week',
    ],
    cta: 'See our location →',
    href: '/about/location',
  },
  {
    icon: 'book',
    title: 'Comprehensive Subjects',
    description: 'From elementary math to AP Calculus, reading comprehension to SAT/SSAT prep, our tutors in Hawaii cover all subjects and grade levels. We\'re your one-stop solution for academic support in Oahu.',
    points: [
      'Math: arithmetic through AP Calculus',
      'English, SAT, SSAT & AP prep',
      'College essays and admissions guidance',
    ],
    cta: 'Explore tutoring services →',
    href: '/#services',
  },
  {
    icon: 'check',
    title: 'Free Consultation',
    description: 'Start with a free consultation to discuss your child\'s needs and goals. Our Hawaii tutoring team will create a customized learning plan and match your student with the perfect tutor.',
    points: [
      'Talk through goals and needs',
      'Get matched with the right tutor',
      'No obligation to continue',
    ],
    cta: 'Book a free consultation →',
    href: '/contact',
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4">
            Why Do Honolulu Parents Choose{' '}
            <span className="text-gradient font-bold">KHM Tutoring?</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            KHM Tutoring has helped hundreds of students across Hawaii achieve their academic goals.
            From Honolulu math tutors to SAT prep specialists, discover why we&apos;re Oahu&apos;s
            trusted choice for personalized education.
          </p>
        </div>
      </div>

      <ScrollStack items={reasons} />

      <div className="container mx-auto px-4 mt-16 md:mt-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1d4ed8] via-[#1e40af] to-[#0b1f4b] px-6 py-12 text-white shadow-[0_30px_80px_rgba(29,78,216,0.35)] md:px-16 md:py-16">
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-sky-300/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />

          <div className="relative mx-auto max-w-3xl text-center">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white/90">
              Serving Honolulu &amp; Online
            </span>
            <h3 className="mb-4 text-2xl font-heading font-bold leading-tight text-white md:text-4xl">
              Expert tutoring, wherever your family learns
            </h3>
            <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
              We come to your home across the Honolulu corridor, meet at our Kakaʻako space, or teach live
              online anywhere in Hawaiʻi. Join the 300+ students who have improved their grades and test
              scores with Hawaiʻi&apos;s premier tutoring service.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-[#1e40af] transition-colors hover:bg-white/90"
            >
              Book a free consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
