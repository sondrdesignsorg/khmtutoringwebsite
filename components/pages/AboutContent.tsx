import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, Target, Users, Check, ArrowRight } from 'lucide-react';

const benefits = [
  'Personalized tutoring for all grade levels',
  'Proven improvement in grades, scores, confidence, and motivation',
  'Flexible scheduling and convenient meeting options',
  'Experienced and passionate educators',
];

export function AboutContent() {
  return (
    <main className="pt-24 md:pt-28 bg-white">
      {/* Hero Section */}
      <section className="py-8 md:py-10 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-6 py-2 bg-primary/10 rounded-full mb-6 border border-primary/20">
              <span className="text-primary font-semibold">Our Story</span>
            </div>
            <h1 className="mb-3 md:mb-4 text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900">
              About{' '}
              <span className="text-primary font-bold">
                KHM Tutoring
              </span>
              {' '}— Honolulu&apos;s Expert K-12 Tutors
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg font-medium">
              Empowering Students to Reach Their Full Potential
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-10 md:py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-8">
              <div className="inline-block px-6 py-3 bg-primary/10 rounded-full mb-4 border border-primary/20 shadow-sm">
                <span className="text-primary font-semibold text-lg">Our Mission</span>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-primary/20 shadow-sm">
              <p className="text-xl text-gray-800 leading-relaxed text-center mb-6">
                At <span className="text-primary font-semibold">KHM Tutoring</span>, we believe that every student has the ability to succeed with the right tutor match. Our mission is to empower students across Honolulu and all of Hawaii to achieve academic excellence through personalized, one-on-one tutoring with quality educators who truly understand their needs.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed text-center">
                Founded by Kody Kim, KHM Tutoring has built a team of exceptional tutors through a rigorous vetting process. Our founder brings extensive tutoring expertise and a deep understanding of what makes an effective student-tutor relationship. We don&apos;t just match students with any tutor—we use our own proven methods to find the perfect fit between each child and their tutor, ensuring a personal connection that leads to real results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story, Team, and Approach - Three Columns */}
      <section className="py-12 md:py-16 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block px-6 py-3 bg-primary/10 rounded-full mb-4 border border-primary/20 shadow-sm">
              <span className="text-primary font-semibold text-lg">What Makes Us Different</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Our Story */}
            <div 
              className="group bg-white rounded-3xl p-8 border border-primary/20 md:hover:border-primary md:hover:shadow-lg"
            >
              <div className="mb-6 p-4 bg-primary/10 rounded-2xl w-fit">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-primary">
                Our Story
              </h3>
              <p className="text-gray-700 leading-relaxed text-base">
                KHM Tutoring was founded by Kody Kim, driven by a vision to create a more personal, quality-focused tutoring experience in Hawaii. Drawing on extensive tutoring expertise, Kody and his carefully selected team of tutors have developed our own unique methods for matching students with the right tutor.
              </p>
            </div>

            {/* Our Team */}
            <div 
              className="group bg-white rounded-3xl p-8 border border-primary/20 md:hover:border-primary md:hover:shadow-lg"
            >
              <div className="mb-6 p-4 bg-primary/10 rounded-2xl w-fit">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-primary">
                Our Team
              </h3>
              <p className="text-gray-700 leading-relaxed text-base">
                Quality tutors are at the heart of everything we do. Our team consists of experienced educators with deep expertise in their subjects, each carefully selected through our rigorous vetting process. <Link href="/educators" className="text-primary hover:underline font-medium">Meet our expert tutors</Link>.
              </p>
            </div>

            {/* Our Approach */}
            <div 
              className="group bg-white rounded-3xl p-8 border border-primary/20 md:hover:border-primary md:hover:shadow-lg"
            >
              <div className="mb-6 p-4 bg-primary/10 rounded-2xl w-fit">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-primary">
                Our Approach
              </h3>
              <p className="text-gray-700 leading-relaxed text-base">
                We&apos;ve developed our own methods to best fit each child with their ideal tutor. This personal matching process considers academic needs, learning style, personality, and communication preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Location Flexibility */}
      <section className="py-10 md:py-12 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-6 py-3 bg-primary/10 rounded-full mb-6 border border-primary/20 shadow-sm">
              <span className="text-primary font-semibold text-lg">Flexible Learning</span>
            </div>
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-primary/20 shadow-sm">
              <p className="text-xl text-gray-800 leading-relaxed">
                Whether lessons are held in-home throughout <span className="text-primary font-semibold">Honolulu and Oahu</span>, at a nearby library, or online, our Hawaii tutors make learning accessible, engaging, and tailored to each student&apos;s goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Families Choose Us */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-block px-6 py-3 bg-primary/10 rounded-full mb-6 border border-primary/20">
                <span className="text-primary">The KHM Advantage</span>
              </div>
              <h2 className="mb-3 md:mb-4 text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900">
                Why Families{' '}
                <span className="text-primary font-bold">Choose Us</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join hundreds of families who trust us to help their students excel
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="group flex items-start gap-4 p-8 bg-white rounded-2xl border border-primary/20 md:hover:border-primary md:hover:shadow-lg"
                >
                  <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-gray-800 leading-relaxed pt-2 text-lg">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-12 md:py-16 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-3xl p-12 md:p-16 border border-primary/20 shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-block px-6 py-3 bg-primary/10 rounded-full mb-6 border border-primary/20 shadow-sm">
                  <span className="text-primary font-semibold text-lg">Ready to Get Started?</span>
                </div>
                <h2 className="mb-4 md:mb-6 text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900">
                  Join{' '}
                  <span className="text-primary font-bold">Us</span>
                </h2>
                <p className="text-xl text-gray-800 leading-relaxed mb-6 max-w-2xl mx-auto">
                  Whether your child needs support catching up, wants to get ahead, or is preparing for an important exam, <span className="text-primary font-semibold">KHM Tutoring</span> is here to guide the way.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed mb-10 max-w-2xl mx-auto">
                  Contact us today to schedule a consultation and discover how we can help your student achieve their academic goals.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold px-12 py-7 rounded-xl shadow-xl"
                >
                  <Link href="/contact">
                    Schedule a Consultation
                    <ArrowRight className="ml-3 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
