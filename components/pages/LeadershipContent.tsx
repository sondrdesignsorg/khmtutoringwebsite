import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

type Leader = {
  name: string;
  role: string;
  imageUrl?: string;
  bio: string;
};

const leaders: Leader[] = [
  {
    name: 'Kody Kim',
    role: 'Founder',
    imageUrl: '/images/tutors/kody-kim.jpg',
    bio: 'Kody founded KHM Tutoring in 2016 with a vision to create a more personal, quality-focused tutoring experience in Hawaii. He leads the company\u2019s mission to match every student with the right tutor.',
  },
  {
    name: 'Matt',
    role: 'Leadership Team',
    bio: 'Matt is a member of the KHM Tutoring leadership team, helping guide the company\u2019s growth and commitment to Hawaii families.',
  },
  {
    name: 'Connor',
    role: 'Leadership Team',
    bio: 'Connor is a member of the KHM Tutoring leadership team, helping guide the company\u2019s growth and commitment to Hawaii families.',
  },
];

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function LeadershipContent() {
  return (
    <main className="pt-24 md:pt-28 bg-white">
      {/* Hero Section */}
      <section className="py-8 md:py-10 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-6 py-2 bg-primary/10 rounded-full mb-6 border border-primary/20">
              <span className="text-primary font-semibold">Our Team</span>
            </div>
            <h1 className="mb-3 md:mb-4 text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900">
              Our{' '}
              <span className="text-primary font-bold">Leadership</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg font-medium">
              The people guiding KHM Tutoring&apos;s mission to empower Hawaii students.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Grid */}
      <section className="py-10 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 max-w-5xl mx-auto sm:grid-cols-2 lg:grid-cols-3">
            {leaders.map((leader) => (
              <div
                key={leader.name}
                className="group flex flex-col overflow-hidden rounded-3xl border border-primary/20 bg-white shadow-sm md:hover:border-primary md:hover:shadow-lg"
              >
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                  {leader.imageUrl ? (
                    <Image
                      src={leader.imageUrl}
                      alt={`${leader.name} - KHM Tutoring leadership`}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-5xl font-bold text-primary/70">
                        {initials(leader.name)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-2xl font-heading font-bold text-gray-900">
                    {leader.name}
                  </h2>
                  <p className="mb-4 text-sm font-semibold text-primary">{leader.role}</p>
                  <p className="text-gray-700 leading-relaxed">{leader.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="rounded-3xl border border-primary/20 bg-white p-12 md:p-16 shadow-sm">
              <h2 className="mb-4 text-3xl md:text-4xl font-heading font-bold text-gray-900">
                Want to{' '}
                <span className="text-primary font-bold">join our team?</span>
              </h2>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600">
                We&apos;re always looking for passionate educators to help Hawaii students succeed.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold px-12 py-7 rounded-xl shadow-xl"
              >
                <Link href="/contact">
                  Get in Touch
                  <ArrowRight className="ml-3 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
