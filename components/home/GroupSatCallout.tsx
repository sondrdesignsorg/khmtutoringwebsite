import Link from 'next/link';
import { ArrowRight, MapPin, Users, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { icon: Users, label: '6–8 students per cohort' },
  { icon: Clock, label: '20 hours of live instruction' },
  { icon: MapPin, label: '1025 Waimanu St, Honolulu' },
];

export function GroupSatCallout() {
  return (
    <section className="bg-amber-50 border-y border-amber-200 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 mb-4">
              <Zap className="h-3 w-3" />
              Now Enrolling · Starts September 21, 2026
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Group SAT Prep — Small Cohorts, Real Results
            </h2>
            <p className="text-muted-foreground mb-5 max-w-lg">
              KHM&apos;s in-person SAT program matches students by level and readiness into cohorts of 6–8. Twenty hours of live strategy, timing, and pattern instruction — held at our Honolulu location.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mb-6">
              {stats.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-foreground font-medium">
                  <Icon className="h-4 w-4 text-amber-600 flex-shrink-0" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <Button asChild>
              <Link href="/group-sat-prep">
                See the Program
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="md:w-64 flex-shrink-0 rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3">Available Windows</p>
            <ul className="space-y-3 text-sm text-foreground">
              <li className="flex flex-col">
                <span className="font-semibold">Sunday Strategy</span>
                <span className="text-muted-foreground">Sundays 10:00 AM – 12:00 PM</span>
              </li>
              <li className="flex flex-col">
                <span className="font-semibold">Weekday After-School</span>
                <span className="text-muted-foreground">Tue & Thu 4:30 – 5:30 PM</span>
              </li>
              <li className="flex flex-col">
                <span className="font-semibold">Evening Practice</span>
                <span className="text-muted-foreground">Mon & Wed 6:30 – 7:30 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
