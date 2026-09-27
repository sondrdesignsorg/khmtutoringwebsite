'use client';

import { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Award, BookOpen, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Tutor } from '@/lib/staff/types';
import { DEFAULT_EDUCATORS } from '@/lib/educators/seed';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const subjects = ['All', 'SAT/SSAT', 'Math', 'English', 'AP Subjects', 'Chemistry', 'Biology'];

export function EducatorsContent({ educators = DEFAULT_EDUCATORS }: { educators?: Tutor[] }) {
  const [selectedEducator, setSelectedEducator] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const handleFilterChange = useCallback((filter: string) => {
    setActiveFilter(filter);
  }, []);

  const handleEducatorClick = useCallback((index: number) => {
    setSelectedEducator(index);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedEducator(null);
  }, []);

  const filteredEducators = useMemo(() => {
    if (activeFilter === 'All') {
      return educators;
    }

    const filterMap: Record<string, string[]> = {
      'Math': ['Math', 'Mathematics', 'Calculus', 'Physics', 'Pre-Calculus'],
      'English': ['English', 'Essay Writing', 'Reading Comprehension', 'College Essay Writing', 'Writing'],
      'SAT/SSAT': ['SAT', 'ACT', 'SSAT', 'MCAT', 'Test Prep'],
      'AP Subjects': ['AP', 'Advanced Placement'],
      'Chemistry': ['Chemistry'],
      'Biology': ['Biology', 'Cell & Molecular Biology', 'Genetics']
    };

    const keywords = filterMap[activeFilter] || [];

    return educators.filter(edu =>
      edu.subjects.some(subject =>
        keywords.some(keyword =>
          subject.toLowerCase().includes(keyword.toLowerCase())
        )
      )
    );
  }, [activeFilter, educators]);

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="py-8 md:py-10 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-3 md:mb-4 text-4xl md:text-5xl lg:text-6xl font-heading font-bold">
              Meet Our{' '}
              <span className="text-gradient font-bold">Expert Educators</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base font-normal">
              Experienced, passionate tutors in Hawaii and Honolulu dedicated to your child&apos;s success.
            </p>
            <p className="text-muted-foreground max-w-3xl mx-auto text-xs md:text-sm mt-3 leading-relaxed">
              KHM Tutoring employs 10+ tutors with credentials from Harvard University (Magna Cum Laude),
              Princeton University, Phillips Exeter Academy, Penn State, and University of Hawaii. Our team
              includes a Fulbright Scholar, a medical student with a top-0.5% MCAT score (525/528), a 35-year
              Iolani School teaching veteran, and current teachers at Damien Memorial School. All tutors are
              vetted for subject expertise and teaching ability.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-4 md:py-6 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => handleFilterChange(subject)}
                className={cn(
                  'px-6 py-2 rounded-full',
                  activeFilter === subject
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-card md:hover:bg-primary/10 border border-border'
                )}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Educators Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEducators.map((educator, index) => {
              const originalIndex = educators.findIndex(e => e.id === educator.id);
              return (
                <div
                  key={educator.id}
                  className="relative min-h-[280px] flex flex-col group rounded-3xl overflow-hidden border-2 border-border shadow-lg bg-card md:hover:shadow-xl md:hover:border-primary md:transition-all md:duration-300 md:hover:-translate-y-1 cursor-pointer text-left"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => handleEducatorClick(originalIndex)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleEducatorClick(originalIndex); } }}
                    className="flex-1 flex flex-col"
                  >
                    <div className="relative aspect-square min-h-28 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex-shrink-0 flex items-center justify-center">
                      <Image
                        src={educator.imageUrl || '/images/tutors/kody-kim.jpg'}
                        alt={`${educator.name} - Expert tutor in Hawaii`}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index < 2}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <div className="p-3 flex flex-col flex-1 min-h-0 gap-2">
                      <div className="flex-1">
                        <h3 className="mb-1 text-base font-semibold font-heading">
                          {educator.name}
                        </h3>
                        <p className="text-primary mb-2 text-xs font-medium">
                          {educator.subjects.join(' • ')}
                        </p>
                        <p className="text-muted-foreground italic text-xs leading-relaxed line-clamp-2">
                          &quot;{educator.tagline}&quot;
                        </p>
                      </div>
                      <div className="pt-2 border-t border-border/50 text-muted-foreground md:group-hover:text-primary text-xs font-medium text-right">
                        Click for full bio →
                      </div>
                    </div>
                  </div>
                  {/* Crawlable bio content for SEO - visually collapsed */}
                  <details className="text-xs text-muted-foreground px-3 pb-3" onClick={(e) => e.stopPropagation()}>
                    <summary className="pt-2 border-t border-border/50 font-medium cursor-pointer">
                      Read bio
                    </summary>
                    <p className="mt-2 leading-relaxed">{educator.bio}</p>
                    {educator.achievements && (
                      <ul className="mt-1 list-disc list-inside space-y-0.5">
                        {educator.achievements.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    )}
                    <p className="mt-1"><strong>Education:</strong> {educator.certifications}</p>
                    <p><strong>Grades:</strong> {educator.grades}</p>
                  </details>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Educator Detail Modal */}
      {selectedEducator !== null && (() => {
        const educator = educators[selectedEducator];
        if (!educator) return null;
        return (
          <Dialog open={selectedEducator !== null} onOpenChange={handleCloseModal}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
              <DialogHeader className="sr-only">
                <DialogTitle>{educator.name}</DialogTitle>
                <DialogDescription>Full bio and details for {educator.name}</DialogDescription>
              </DialogHeader>

              <div className="space-y-0">
                <div className="relative w-full rounded-t-xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                  <div className="flex items-center justify-center w-full aspect-[3/4] min-h-[400px] max-h-[500px] relative">
                    <Image
                      src={educator.imageUrl || '/images/tutors/kody-kim.jpg'}
                      alt={`${educator.name} - Expert tutor in Hawaii`}
                      fill
                      className="object-cover object-top"
                      sizes="600px"
                      priority
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-white text-2xl md:text-3xl font-heading font-bold mb-1 drop-shadow-lg">
                      {educator.name}
                    </h2>
                    <p className="text-white text-lg mb-1 drop-shadow-lg">
                      {educator.subjects.join(' • ')}
                    </p>
                    <p className="text-white/90 italic drop-shadow-lg">
                      &quot;{educator.tagline}&quot;
                    </p>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold mb-2">About</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {educator.bio}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-card rounded-lg p-4 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-primary" />
                        <span className="font-semibold">Experience</span>
                      </div>
                      <p className="text-muted-foreground">{educator.experience}</p>
                    </div>

                    <div className="bg-card rounded-lg p-4 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <span className="font-semibold">Grades</span>
                      </div>
                      <p className="text-muted-foreground">{educator.grades}</p>
                    </div>
                  </div>

                  {educator.achievements && (
                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                      <div className="flex items-start gap-2">
                        <Award className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <span className="font-semibold block mb-2">Achievements</span>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            {educator.achievements.map((achievement, idx) => (
                              <li key={idx}>{achievement}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                    <div className="flex items-start gap-2">
                      <GraduationCap className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-semibold block mb-1">Education & Background</span>
                        <p className="text-muted-foreground">{educator.certifications}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                    <p className="text-center">
                      <span className="font-semibold">Fun Fact:</span>{' '}
                      <span className="text-muted-foreground italic">{educator.funFact}</span>
                    </p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        );
      })()}
    </main>
  );
}
