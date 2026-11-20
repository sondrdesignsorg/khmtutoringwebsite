import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Brain } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-12 md:pt-20 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent" />

      <div className="hidden md:block absolute top-20 right-10 w-72 h-72 bg-secondary/10 rounded-full opacity-50" />
      <div className="hidden md:block absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full opacity-50" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6 md:space-y-8 text-center lg:text-left mb-8 lg:mb-0">
            <div className="inline-block">
              <span className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-secondary/30 to-primary/30 text-secondary-foreground rounded-full text-xs md:text-sm font-semibold border border-secondary/30 inline-flex items-center gap-2">
                <Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                Hawaii&apos;s Trusted Tutoring Service
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold leading-tight">
              <span className="text-gradient font-bold">Math &amp; SAT Tutoring</span>{' '}
              in Honolulu
            </h1>

            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Looking for a math tutor in Honolulu or SAT prep in Honolulu? KHM Tutoring provides personalized math and Digital SAT tutoring in person across Honolulu and online throughout Hawaiʻi. Meet our <Link href="/educators" className="text-primary hover:underline">experienced tutors</Link> and get a one-on-one plan built around your student&apos;s needs.
            </p>

            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-semibold lg:justify-start">
              <Link href="/math-tutoring-honolulu" className="text-primary underline-offset-4 hover:underline">
                Explore math tutoring in Honolulu
              </Link>
              <Link href="/sat-prep-honolulu" className="text-primary underline-offset-4 hover:underline">
                Explore SAT prep in Honolulu
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                asChild
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-base md:text-lg px-6 py-5 md:px-8 md:py-6 rounded-full shadow-lg w-full sm:w-auto"
              >
                <Link href="/contact">
                  Book Free Consultation
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-base md:text-lg px-6 py-5 md:px-8 md:py-6 rounded-full w-full sm:w-auto"
              >
                <Link href="/diagnostic-test">
                  <Brain className="mr-2 w-5 h-5" />
                  Free Diagnostic Test
                </Link>
              </Button>
            </div>

          </div>

          <div className="relative mt-8 lg:mt-0 hidden lg:block">
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/khm-tutoring-hero.jpeg"
                alt="KHM Tutoring students learning together in Hawaii - Expert K-12 tutoring services in Honolulu and Oahu"
                width={800}
                height={600}
                className="w-full h-auto"
                sizes="(max-width: 1024px) 0vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
