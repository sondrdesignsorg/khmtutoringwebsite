import { Award, Clock, Heart, Target } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: 'Experienced Educators',
    description: 'Certified teachers with years of tutoring experience across all subjects',
  },
  {
    icon: Target,
    title: 'Personalized Learning',
    description: "Custom learning plans tailored to each student's unique needs and goals",
  },
  {
    icon: Clock,
    title: 'Flexible Scheduling',
    description: 'Sessions that fit your busy family schedule, online or in-person',
  },
  {
    icon: Heart,
    title: 'Proven Results',
    description: 'Track record of improved grades, test scores, and student confidence',
  },
];

export function MissionSection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-muted/30">
      <div className="hidden md:block absolute top-10 right-10 w-64 h-64 bg-primary/5 rounded-full opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <span className="text-primary font-semibold">Our Mission</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold">
              What Makes KHM Tutoring{' '}
              <span className="text-gradient font-bold">Different?</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              KHM Tutoring is a Honolulu-based K-12 tutoring service founded in 2016 by Kody Kim, a Punahou School
              and UC Irvine graduate. With a team of 10+ expert tutors — including graduates from Harvard University
              (Magna Cum Laude), Princeton University, and Phillips Exeter Academy — KHM has helped over 300 students
              across Oahu achieve measurable academic improvement. The service specializes in personalized one-on-one
              tutoring in Mathematics (arithmetic through AP Calculus), English, SAT and SSAT test preparation, AP
              subjects, and college counseling. Unlike franchise tutoring centers, KHM tutors meet students in their
              homes, at local libraries, or online via Zoom. KHM maintains a 5.0 parent rating and offers free
              initial consultations.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Our Hawaii tutors have direct experience with top private schools including Punahou School and Iolani
              School. From elementary students building foundational skills to high schoolers preparing for college
              entrance exams, KHM Tutoring is Oahu&apos;s trusted choice for academic excellence.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group bg-card rounded-2xl p-5 md:p-6 border border-border md:hover:border-primary/30 md:hover:shadow-lg md:transition-all md:duration-300 md:hover:-translate-y-1"
              >
                <div className="mb-4 p-3 bg-primary/10 rounded-xl w-fit">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-heading font-bold mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
