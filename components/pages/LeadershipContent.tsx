import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

type Leader = {
  name: string;
  role: string;
  imageUrl: string;
  imageClassName: string;
  bio: string[];
};

const leaders: Leader[] = [
  {
    name: 'Kody Kim',
    role: 'CEO, Founder & Majority Shareholder',
    imageUrl: '/images/leadership/kody-kim.png',
    imageClassName: 'object-contain object-bottom',
    bio: [
      'Kody is the CEO, Founder & Majority Shareholder of KHM Tutoring. He has over 10 years of tutoring experience and is an educator focused on improving student scores, test-taking strategies, and understanding of material.',
      'Born in Hawaiʻi, Kody attended Punahou High School. He then attended the University of California, Irvine (UCI), where he obtained a degree in Public Health.',
      'After returning to Hawaiʻi, Kody began his career at HMSA as a Financial Systems Analyst and recently began a new role as an Ambulatory Operational Performance Analyst for ambulatory services.',
    ],
  },
  {
    name: 'Matt Lew',
    role: 'CFO & Minority Shareholder',
    imageUrl: '/images/leadership/matt-lew.jpg',
    imageClassName: 'object-cover object-center',
    bio: [
      'Matt is the Chief Financial Officer & Minority Shareholder of KHM Tutoring. He has over 20 years of experience as a restructuring consultant for Deloitte, where he was a Managing Director focused on the Healthcare and Consumer Business sectors. Matt attended UCLA, where he graduated with a BA in Business Economics. He has been a CPA licensed in California since 2007.',
      'Originally from Scottsdale, Arizona, Matt relocated to Hawaiʻi in March 2025 and spent the next 18 months as the CFO of a youth mental health clinic. During his tenure, the clinic’s net revenue grew more than 50% year over year, enabling key strategic growth initiatives that supported its mission.',
      'He has been with KHM since September 2026 and is focused on diversifying revenue, rolling out new products, and enhancing KHM’s organizational infrastructure to support its current and future growth.',
    ],
  },
  {
    name: 'Connor Takemoto',
    role: 'Business Operations & Finance Analyst',
    imageUrl: '/images/leadership/connor-takemoto.png',
    imageClassName: 'origin-bottom object-contain object-bottom scale-[1.7] translate-y-24',
    bio: [
      'Connor has been with KHM for over a year and has benefited greatly from Kody’s mentorship. Connor is focused on business operations and financial analysis at KHM Tutoring. He is currently a junior at the University of Hawaiʻi. Through his experience helping build KHM, he has gained valuable insight into scaling a business through financial discipline, marketing strategy, and product ideation. He has also learned the importance of supporting sustainable growth through internal process development.',
      'More importantly, Connor’s time at KHM has strengthened his passion for helping students succeed by designing and delivering programs that build academic confidence and support personal growth. He is grateful to be part of a team dedicated to making a positive impact on the next generation of students in Hawaiʻi.',
    ],
  },
];

export function LeadershipContent() {
  return (
    <main className="bg-white pt-24 md:pt-28">
      <section className="relative overflow-hidden bg-white py-10 md:py-14">
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Our Team
            </p>
            <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
              Meet Our <span className="text-primary">Leadership</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base font-medium text-gray-600 md:text-lg">
              The people guiding KHM Tutoring&apos;s mission to empower students across Hawaiʻi.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-white via-primary/[0.025] to-white py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl space-y-10 md:space-y-14">
            {leaders.map((leader, index) => (
              <article
                key={leader.name}
                className={`grid overflow-hidden rounded-[2rem] border border-primary/15 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)] ${
                  index % 2 === 1
                    ? 'lg:grid-cols-[minmax(0,1.6fr)_minmax(260px,0.72fr)]'
                    : 'lg:grid-cols-[minmax(260px,0.72fr)_minmax(0,1.6fr)]'
                }`}
              >
                <div
                  className={`flex items-center justify-center bg-gradient-to-br from-primary/[0.07] via-secondary/[0.07] to-primary/[0.12] p-6 sm:p-8 lg:py-12 ${
                    index % 2 === 1 ? 'lg:order-2' : ''
                  }`}
                >
                  <div className="relative aspect-[4/5] w-full max-w-[260px] overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/70 shadow-[0_14px_35px_rgba(15,23,42,0.12)] sm:max-w-[290px]">
                    <Image
                      src={leader.imageUrl}
                      alt={`${leader.name}, ${leader.role} at KHM Tutoring`}
                      fill
                      className={leader.imageClassName}
                      sizes="(max-width: 640px) 260px, 290px"
                      priority={index === 0}
                    />
                  </div>
                </div>

                <div
                  className={`flex flex-col justify-center p-7 sm:p-10 lg:p-12 ${
                    index % 2 === 1 ? 'lg:order-1' : ''
                  }`}
                >
                  <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-primary">
                    {leader.role}
                  </p>
                  <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
                    {leader.name}
                  </h2>
                  <div className="space-y-4 text-base leading-7 text-gray-700 sm:text-lg sm:leading-8">
                    {leader.bio.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="rounded-3xl border border-primary/20 bg-white p-10 shadow-sm md:p-16">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                Want to <span className="text-primary">join our team?</span>
              </h2>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600">
                We&apos;re always looking for passionate educators to help Hawaiʻi students succeed.
              </p>
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-primary px-12 py-7 text-lg font-semibold text-primary-foreground shadow-xl hover:bg-primary/90"
              >
                <Link href="/contact">
                  Get in Touch
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
