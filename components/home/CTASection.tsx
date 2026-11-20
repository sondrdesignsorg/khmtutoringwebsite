import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-secondary" />

      <div className="hidden md:block absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full opacity-50" />
      <div className="hidden md:block absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full opacity-50" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8 flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight">
            Ready to Help Your Child <span className="text-white/90">Thrive Academically</span>?
          </h2>
          <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto">
            Get personalized tutoring for your student, with in-person sessions in Honolulu and online options across Hawaiʻi.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 px-6 py-5 md:px-8 md:py-6 rounded-full shadow-xl w-full sm:w-auto"
            >
              <Link href="/contact">
                Contact Us
                <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary px-6 py-5 md:px-8 md:py-6 rounded-full w-full sm:w-auto"
            >
              <Link href="/diagnostic-test">
                <Brain className="mr-2" />
                Free Diagnostic Test
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-5 pt-2 text-sm font-semibold text-white underline underline-offset-4">
            <Link href="/math-tutoring-honolulu">Math tutoring in Honolulu</Link>
            <Link href="/sat-prep-honolulu">SAT prep in Honolulu</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
