import { CheckCircle, MapPin, Clock, Users, Award, BookOpen } from 'lucide-react';

const reasons = [
  {
    icon: MapPin,
    title: 'Local Hawaii Tutors',
    description: 'Our tutors live and work in Honolulu and across Oahu. We understand the Hawaii education system, local school curricula, and what it takes to succeed at top schools like Punahou, Iolani, and Hawaii public schools.',
  },
  {
    icon: Users,
    title: 'One-on-One Attention',
    description: 'Every tutoring session is personalized to your child\'s learning style. Our Honolulu tutors adapt their teaching methods to match how your student learns best, ensuring maximum comprehension and retention.',
  },
  {
    icon: Award,
    title: 'Proven Track Record',
    description: 'With over 300 students helped and a 15% average score improvement, our Hawaii tutoring services deliver measurable results. Parents across Oahu trust us for math tutoring, SAT prep, and academic excellence.',
  },
  {
    icon: Clock,
    title: 'Flexible Scheduling',
    description: 'We offer in-home tutoring throughout Honolulu, online sessions, and flexible scheduling to fit your family\'s busy lifestyle. Quality tutoring is always accessible.',
  },
  {
    icon: BookOpen,
    title: 'Comprehensive Subjects',
    description: 'From elementary math to AP Calculus, reading comprehension to SAT/SSAT prep, our tutors in Hawaii cover all subjects and grade levels. We\'re your one-stop solution for academic support in Oahu.',
  },
  {
    icon: CheckCircle,
    title: 'Free Consultation',
    description: 'Start with a free consultation to discuss your child\'s needs and goals. Our Hawaii tutoring team will create a customized learning plan and match your student with the perfect tutor.',
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="hidden md:block absolute top-20 left-10 w-80 h-80 bg-primary/5 rounded-full opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4">
            Why Do Honolulu Parents Choose{' '}
            <span className="text-gradient font-bold">KHM Tutoring?</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            KHM Tutoring has helped hundreds of students across Hawaii achieve their academic goals. 
            From Honolulu math tutors to SAT prep specialists, discover why we&apos;re Oahu&apos;s 
            trusted choice for personalized education.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="bg-card rounded-2xl p-6 border border-border md:hover:border-primary/30 md:hover:shadow-lg md:transition-all md:duration-300 md:hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl flex-shrink-0">
                  <reason.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold mb-2">{reason.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{reason.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-16 bg-primary/5 rounded-2xl p-6 md:p-8 border border-primary/10">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-xl md:text-2xl font-heading font-bold mb-4">
              Serving Honolulu &amp; Online
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              KHM Tutoring brings expert tutors to your home in Honolulu. We also offer
              convenient online tutoring sessions for families who prefer remote learning.
              Join the 300+ students who have improved their grades and test scores with
              Hawaii&apos;s premier tutoring service.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
