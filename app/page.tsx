import { HeroSection } from '@/components/home/HeroSection';
import { CoursesSection } from '@/components/home/CoursesSection';
import { GroupSatCallout } from '@/components/home/GroupSatCallout';
import { MissionSection } from '@/components/home/MissionSection';
import { WhyChooseUsSection } from '@/components/home/WhyChooseUsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { CTASection } from '@/components/home/CTASection';

export default function Home() {
  return (
    <div className="bg-background">
      <HeroSection />
      <CoursesSection />
      <GroupSatCallout />
      <MissionSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
