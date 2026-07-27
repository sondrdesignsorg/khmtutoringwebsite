'use client';

import { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Award, BookOpen, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const subjects = ['All', 'SAT/SSAT', 'Math', 'English', 'AP Subjects', 'Chemistry', 'Biology'];

const educators = [
  {
    name: 'Kody Kim',
    subjects: ['Essay Writing', 'Reading Comprehension', 'Math', 'SAT/ACT'],
    tagline: 'Founder with years of tutoring experience',
    image: '/images/tutors/kody-kim.jpg',
    bio: 'Founder of KHM Tutoring with years of tutoring experience since 2016. Skilled educator focused on improving student scores, test-taking strategies, and understanding of material.',
    achievements: [
      'Financial Systems Analyst at HMSA',
      'Attended Punahou School and University of California, Irvine',
      'Strong track record of increasing student performance and comprehension',
      'Specializes in essay writing, reading comprehension, mathematics, and SAT/ACT prep'
    ],
    experience: 'Since 2016',
    certifications: 'Punahou School, University of California, Irvine',
    funFact: 'Founder of KHM Tutoring',
    grades: 'K-12',
    category: 'SAT/SSAT',
  },
  {
    name: 'Andrew Holzman',
    subjects: ['College Applications', 'English', 'SAT', 'MCAT'],
    tagline: 'Medical student and former corporate lawyer',
    image: '/images/tutors/andrew-holzman.jpg',
    bio: 'Medical student and former corporate lawyer with expertise in standardized testing and college admissions consulting.',
    achievements: [
      'Attended Phillips Exeter Academy and University of Chicago',
      'Practiced law internationally (London, Dubai, Sydney, Australia)',
      'Developed an SAT curriculum used by hundreds of students',
      'MCAT score: 525/528 (top 0.5% nationwide)',
      'Students have been accepted to Stanford, Yale, UC Berkeley, UC Irvine, and more'
    ],
    experience: 'Years of experience',
    certifications: 'Phillips Exeter Academy, University of Chicago',
    funFact: 'MCAT score in top 0.5% nationwide',
    grades: '9-12, College',
    category: 'SAT/SSAT',
  },
  {
    name: 'Noah Agena',
    subjects: ['Math', 'Physics'],
    tagline: 'Aspiring mechanical engineer',
    image: '/images/tutors/noah-agena.jpg',
    bio: 'Aspiring mechanical engineer and experienced calculus and physics tutor with strong STEM background from Iolani School.',
    achievements: [
      'Pursuing a mechanical engineering degree',
      'Integrates academic expertise with passion and encouragement',
      'Strong emphasis on teamwork, discipline, perseverance, and mindset'
    ],
    experience: 'Experienced tutor',
    certifications: 'Iolani School',
    funFact: 'Aspiring mechanical engineer',
    grades: '9-12',
    category: 'Math',
  },
  {
    name: 'Peter Greenhill',
    subjects: ['English', 'College Essay Writing', 'SAT'],
    tagline: 'Princeton University graduate',
    image: '/images/tutors/peter-greenhill.jpg',
    bio: 'Princeton University graduate in Philosophy with decades of teaching experience at Iolani School and international academic programs.',
    achievements: [
      'Taught English, Philosophy, and SAT at Iolani from 1986–2021',
      'Director of the Iolani Peace Institute for 17 years',
      'Program Dean and Dean of Faculty at Cambridge University summer program'
    ],
    experience: '1986-2021 at Iolani',
    certifications: 'Princeton University, Philosophy',
    funFact: 'Director of Iolani Peace Institute for 17 years',
    grades: '9-12, College',
    category: 'English',
  },
  {
    name: 'Blythe Yangson',
    subjects: ['Math', 'SAT/ACT'],
    tagline: 'Experienced science and math tutor',
    image: '/images/tutors/blythe-yangson.jpg',
    bio: 'Experienced science and math tutor dedicated to helping students succeed through engaging and approachable teaching.',
    achievements: [
      'Graduate of Damien Memorial School and current teacher at Damien',
      'Teaches Calculus and Pre-Calculus',
      'Focus on problem-solving, real-world connection, and curiosity-driven learning'
    ],
    experience: 'Current teacher',
    certifications: 'Damien Memorial School',
    funFact: 'Current teacher at Damien Memorial School',
    grades: '9-12',
    category: 'Math',
  },
  {
    name: 'Keenan Kim',
    subjects: ['Math', 'Calculus'],
    tagline: 'Math tutor specializing in learning differences',
    image: '/images/tutors/keenan-kim.jpg',
    bio: 'Graduate of HBA Highschool currently studying Architectural Engineering at Penn State. Specialized math tutor teaching up to calculus via Zoom.',
    achievements: [
      'Graduated from HBA Highschool',
      'Currently studying Architectural Engineering at Penn State',
      'Specializes in math tutoring up to calculus level',
      'Experience working with students with dyscalculia and dysgraphia'
    ],
    experience: 'Math tutor',
    certifications: 'HBA Highschool, Penn State (Architectural Engineering)',
    funFact: 'Currently studying Architectural Engineering at Penn State',
    grades: '9-12',
    category: 'Math',
  },
  {
    name: 'Colton Inamine',
    subjects: ['Math'],
    tagline: 'Hard worker dedicated to quality teaching',
    image: '/images/tutors/colton-inamine.jpg',
    bio: 'Graduate of Iolani School currently studying Electrical Computer Engineering at UH Manoa. Very hard worker, dedicated to quality teaching.',
    achievements: [
      'Graduated from Iolani School',
      'Currently studying Electrical Computer Engineering at UH Manoa',
      'Dedicated to quality teaching and understanding of mathematical topics'
    ],
    experience: 'Math tutor',
    certifications: 'Iolani School, UH Manoa (Electrical Computer Engineering)',
    funFact: 'Enjoys volleyball and traveling',
    grades: '9-12',
    category: 'Math',
  },
  {
    name: 'Alec Wong',
    subjects: ['Math', 'English'],
    tagline: 'Punahou Junior with future med school goals',
    image: '/images/tutors/alec-wong.jpg',
    bio: 'Punahou Junior, artist, with future med school goals. Good with kids and patient, specializing in Math and English tutoring.',
    achievements: [
      'Punahou Junior',
      'Artist',
      'Future med school goals',
      'Good with kids and patient'
    ],
    experience: 'Tutor',
    certifications: 'Punahou School',
    funFact: 'Artist with future med school goals',
    grades: '9-12',
    category: 'Math',
  },
  {
    name: 'Aizen Chung',
    subjects: ['Math', 'Physics'],
    tagline: 'Iolani Graduate and Provost Achievement Scholar',
    image: '/images/tutors/aizen-chung.jpg',
    bio: 'Iolani Graduate, currently a UHM Electrical Computer Engineering student. Founder of Web Design Agency Sondr Designs.',
    achievements: [
      'Iolani Graduate',
      'Current UHM Electrical Computer Engineering student',
      'Founder of Web Design Agency Sondr Designs',
      'Co-founder of startup - Blend Cafe app',
      'Current Provost Achievement Scholar at UHM'
    ],
    experience: 'Tutor',
    certifications: 'Iolani School, UHM (Electrical Computer Engineering)',
    funFact: 'Loves coffee, the gym, and learning',
    grades: '9-12',
    category: 'Math',
  },
  {
    name: 'Shwe Win',
    subjects: ['Science', 'Chemistry', 'Biology', 'College Counseling', 'Essay Writing'],
    tagline: 'Harvard Magna Cum Laude | Fulbright Scholar | Neuroscience & Global Health',
    image: '/images/tutors/shwe-win.jpg',
    bio: 'Harvard graduate with a 3.97 GPA and Highest Honors in Neuroscience. Founder of Kūlia College Pathways.',
    achievements: [
      'Harvard University — B.A. Neuroscience, Magna Cum Laude with Highest Honors (GPA: 3.957)',
      'Fulbright Scholar, U.S. Department of State (2025)',
      'Founded Kūlia College Pathways, serving 140+ students and 100+ volunteer mentors'
    ],
    experience: 'Since 2023',
    certifications: 'Harvard University, Fulbright Scholar',
    funFact: 'Founder of a college access nonprofit recognized by Hawaii Governor Josh Green',
    grades: 'K-12, College Prep',
    category: 'College Counseling',
  },
  {
    name: 'Omar Saidy',
    subjects: ['Math', 'Test Prep', 'Social Studies', 'PE'],
    tagline: 'Veteran teacher of 20 years',
    image: '/images/tutors/omar-saidy.jpeg',
    bio: 'Veteran K-12 educator with 20 years of experience, well-versed in Mathematics, Test Preparation, Social Studies, and Physical Education. Currently teaching Middle School Mathematics.',
    achievements: [
      '20+ years of K-12 teaching experience',
      'Experienced with blended learning (Zoom, Canvas), face-to-face instruction, individual tutoring, and group tutoring',
      'Has taught and tutored across many age levels, difficulty tiers, and diverse learners',
      'Patient, adaptable teaching style with step-by-step instruction and proven methodology'
    ],
    experience: '20+ years',
    certifications: 'Veteran K-12 educator',
    funFact: 'Coaches his daughters in Judo, Wrestling, Jiu Jitsu, and Surfing',
    grades: 'K-12',
    category: 'SAT/SSAT',
  },
  {
    name: 'Jacob Bergeron',
    subjects: ['Math', 'Physics', 'Engineering'],
    tagline: 'UH Mānoa mechanical engineering grad student',
    image: '/images/tutors/jacob-bergeron.jpg',
    bio: 'Master’s student in Mechanical Engineering at the University of Hawai‘i at Mānoa, with a B.S. in Aerospace Engineering and a Math minor from Texas A&M. Teaching Assistant in machine dynamics and published research author.',
    achievements: [
      'B.S. Aerospace Engineering, Texas A&M University (Math minor)',
      'Master’s Program in Mechanical Engineering, UH Mānoa (expected May 2027)',
      'Perfect GRE Quantitative score (170/170)',
      'Teaching Assistant for undergraduate dynamics of machine systems lab',
      'Published author on lithium-ion battery electrolyte modeling'
    ],
    experience: 'Teaching Assistant since 2025',
    certifications: 'Texas A&M University, University of Hawai‘i at Mānoa',
    funFact: 'Working on a hybrid rocket experiment at the Hawaii Rocket Propulsion Lab',
    grades: '9-12, College',
    category: 'Math',
  },
  {
    name: 'Sheany Chung',
    subjects: ['Biology', 'Chemistry', 'Cell & Molecular Biology', 'Genetics'],
    tagline: 'Biology BS cum laude | UH Mānoa Student Marshall',
    image: '/images/tutors/sheany-chung.jpg?v=20260617',
    bio: 'Biology BS cum laude graduate and Student Marshall for UH Mānoa\'s Fall 2025 convocation. Teaching intern for college-level Cell & Molecular Biology and Genetics, with hands-on tutoring experience at Kapiolani Medical Center for Women & Children.',
    achievements: [
      'Biology BS, cum laude — University of Hawai‘i at Mānoa',
      'Student Marshall, UH Mānoa Fall 2025 Convocation',
      'Teaching Intern — College-level Cell & Molecular Biology and Genetics',
      '1st Place, College of Tropical Agriculture and Human Resources (CTAHR) Showcase & Research Symposium',
      'College of Natural Sciences Student Ambassador & Social Media Chair',
      'DOE Tutor at Kapiolani Medical Center for Women & Children',
    ],
    experience: 'Teaching Intern & DOE Tutor',
    certifications: 'University of Hawai‘i at Mānoa — B.S. Biology (cum laude)',
    funFact: 'Student Marshall for UH Mānoa\'s Fall 2025 convocation',
    grades: '9-12, College',
    category: 'Biology',
  },
];

export function EducatorsContent() {
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
  }, [activeFilter]);

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
              const originalIndex = educators.findIndex(e => e.name === educator.name);
              return (
                <div
                  key={educator.name}
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
                        src={educator.image}
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
                      src={educator.image}
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
