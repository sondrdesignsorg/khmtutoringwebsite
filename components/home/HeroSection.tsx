import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, TrendingUp, GraduationCap, Star, Brain } from 'lucide-react';

const stats = [
  { icon: Users, value: '300+', label: 'Students Helped', color: 'text-primary', fill: '' },
  { icon: TrendingUp, value: '+15%', label: 'Avg. Score Boost', color: 'text-emerald-500', fill: '' },
  { icon: GraduationCap, value: '10+', label: 'Expert Tutors', color: 'text-secondary', fill: '' },
  { icon: Star, value: '5.0', label: 'Parent Rating', color: 'text-yellow-500', fill: 'fill-yellow-500' },
];

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
              <span className="text-gradient font-bold">Hawaii Tutoring</span>{' '}
              That Gets Results
            </h1>

            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Looking for a math tutor in Honolulu? KHM Tutoring provides expert <Link href="/educators" className="text-primary hover:underline">tutoring services</Link> across Oahu,
              specializing in Math, English, SAT, and SSAT prep. Our experienced Hawaii tutors deliver personalized
              one-on-one instruction that builds confidence and achieves academic excellence for K-12 students.
            </p>

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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 md:pt-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                    <stat.icon className={`w-4 h-4 md:w-5 md:h-5 ${stat.color} ${stat.fill}`} />
                    <span className={`text-xl md:text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
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
                priority
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
