'use client';

import { useCallback, useEffect, useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    name: 'Yelp Reviewer',
    role: 'Parent — via Yelp',
    content: "Our son got accepted early action to Massachusetts Institute of Technology! Again, thank you Kody and Peter for making his dream come true!",
    rating: 5,
  },
  {
    name: 'Sarah Johnson',
    role: 'Parent of 10th grader',
    content: "KHM Tutoring transformed my daughter's confidence in math. She went from struggling with algebra to acing her tests. The personalized attention made all the difference!",
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Parent of 8th grader',
    content: 'Outstanding SAT prep! My son improved his score by 150 points. The tutors are patient, knowledgeable, and really know how to connect with students.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'High School Senior',
    content: "Thanks to KHM, I got into my dream college! The AP prep was thorough and the essay help was invaluable. I can't recommend them enough.",
    rating: 5,
  },
  {
    name: 'David Park',
    role: 'Parent of 6th grader',
    content: 'The flexible scheduling and online options made tutoring so convenient for our busy family. My son actually looks forward to his sessions now!',
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const goNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(goNext, 8000);
    return () => clearInterval(interval);
  }, [goNext]);

  const t = testimonials[activeIndex];

  return (
    <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
      <div className="hidden md:block absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-heading font-bold">
            What Do <span className="text-gradient font-bold">Parents &amp; Students</span> Say About KHM Tutoring?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Real results from real families in Honolulu and across Hawaii
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Left Arrow */}
          <button
            onClick={goPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 z-20 p-2 rounded-full bg-card border border-border shadow-md hover:bg-primary/10 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={goNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 z-20 p-2 rounded-full bg-card border border-border shadow-md hover:bg-primary/10 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 text-primary" />
          </button>

          <div className="px-8 md:px-12">
            <div className="bg-card rounded-3xl shadow-xl border border-border p-6 md:p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute top-4 right-4 md:top-8 md:right-8 opacity-10">
                <Quote className="w-24 h-24 md:w-32 md:h-32 text-primary" />
              </div>

              <div className="flex gap-1 mb-6 relative z-10">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 md:w-6 md:h-6"
                    fill="#fbbf24"
                    stroke="#fbbf24"
                  />
                ))}
              </div>

              <p className="text-base md:text-lg text-foreground/90 mb-8 leading-relaxed relative z-10 italic">
                &quot;{t.content}&quot;
              </p>

              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg md:text-xl">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-base md:text-lg">{t.name}</p>
                  <p className="text-sm md:text-base text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6 md:mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
                className={cn(
                  'h-2 rounded-full transition-all',
                  index === activeIndex
                    ? 'bg-primary w-8'
                    : 'bg-border w-2 hover:bg-primary/50'
                )}
              />
            ))}
          </div>
        </div>

        {/* All testimonials rendered in HTML for AI crawlers (visually hidden when JS active) */}
        <div className="sr-only">
          {testimonials.map((testimonial, index) => (
            <blockquote key={index}>
              <p>{testimonial.content}</p>
              <cite>{testimonial.name}, {testimonial.role}</cite>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
