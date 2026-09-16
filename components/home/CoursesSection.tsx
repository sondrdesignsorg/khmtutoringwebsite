'use client';

import { useState, useMemo } from 'react';
import { BookOpen, Calculator, FileText, GraduationCap, Target, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const courses = [
  {
    id: 'k12',
    name: 'K-12',
    icon: GraduationCap,
    description: 'Comprehensive support across all grade levels',
    points: [
      'Grade-appropriate curriculum alignment',
      'Homework assistance and study skills',
      'Foundation building for future success',
    ],
  },
  {
    id: 'math',
    name: 'Mathematics',
    icon: Calculator,
    description: 'From basic arithmetic to advanced calculus',
    points: [
      'Concept mastery and problem-solving',
      'Step-by-step explanations',
      'Practice problems and real-world applications',
    ],
  },
  {
    id: 'english',
    name: 'English',
    icon: BookOpen,
    description: 'Reading, writing, and language arts excellence',
    points: [
      'Reading comprehension strategies',
      'Essay writing and composition',
      'Grammar and vocabulary development',
    ],
  },
  {
    id: 'ap',
    name: 'AP Subjects',
    icon: Target,
    description: 'Advanced Placement exam prep',
    points: [
      'In-depth subject knowledge',
      'Practice with AP-style questions',
      'Test-taking strategies and time management',
    ],
  },
  {
    id: 'sat',
    name: 'SAT',
    icon: TrendingUp,
    description: 'Comprehensive SAT prep',
    points: [
      'Math and Evidence-Based Reading & Writing',
      'Full-length practice tests',
      'Score improvement strategies',
    ],
  },
  {
    id: 'ssat',
    name: 'SSAT',
    icon: FileText,
    description: 'Secondary School Admission Test prep',
    points: [
      'Verbal, quantitative, and reading sections',
      'Private school admission strategies',
      'Confidence building for test day',
    ],
  },
];

export function CoursesSection() {
  const [activeTab, setActiveTab] = useState('k12');
  const activeCourse = useMemo(() => courses.find((c) => c.id === activeTab)!, [activeTab]);

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="hidden md:block absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full opacity-30" />
      <div className="hidden md:block absolute top-10 left-10 w-96 h-96 bg-primary/5 rounded-full opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-3 md:mb-4">
            <span className="text-gradient font-bold">Services</span> Offered
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Expert math tutoring, SAT prep, and academic support for K-12 students across Hawaii
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-12 px-2">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => setActiveTab(course.id)}
              className={cn(
                'px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold flex items-center gap-2 text-sm md:text-base',
                activeTab === course.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-card md:hover:bg-primary/10 border border-border md:hover:border-primary/40'
              )}
            >
              <course.icon className="w-4 h-4 md:w-5 md:h-5" />
              <span>{course.name}</span>
            </button>
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-2">
          <div className="bg-card rounded-2xl md:rounded-3xl shadow-xl border border-border p-6 md:p-8 lg:p-12">
            <div className="flex items-start gap-4 md:gap-6 mb-6">
              <div className="p-3 md:p-4 bg-primary/10 rounded-xl md:rounded-2xl flex-shrink-0">
                <activeCourse.icon className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-heading font-bold mb-2">
                  {activeCourse.name}
                </h3>
                <p className="text-base md:text-lg text-muted-foreground">
                  {activeCourse.description}
                </p>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              {activeCourse.points.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm md:text-base text-foreground/80">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
