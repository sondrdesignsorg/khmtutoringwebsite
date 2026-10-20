import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { AlarmClock, ArrowUpRight, Car, MapPin, Users } from 'lucide-react';
import { LocationGallery, type LocationPhoto } from '@/components/location/LocationGallery';
import { BUSINESS } from '@/lib/business/config';

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  BUSINESS.address.full,
)}`;

type InfoCard = {
  icon: LucideIcon;
  title: string;
  highlight: string;
  detail: ReactNode;
};

const infoCards: InfoCard[] = [
  {
    icon: MapPin,
    title: 'Location',
    highlight: BUSINESS.location.partnerVenue,
    detail: (
      <>
        <address className="not-italic">
          <span className="whitespace-nowrap">{BUSINESS.address.street},</span>{' '}
          <span className="whitespace-nowrap">
            {BUSINESS.address.city}, {BUSINESS.address.region} {BUSINESS.address.postalCode}
          </span>
        </address>
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          Get directions
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">(opens Google Maps in a new tab)</span>
        </a>
      </>
    ),
  },
  {
    icon: AlarmClock,
    title: 'Hours',
    highlight: BUSINESS.location.spaceHours,
    detail: (
      <>
        Individual and group tutoring sessions begin after 3 PM.
        <span className="mt-1 block font-semibold text-foreground">
          {BUSINESS.location.spacePolicyShort}
        </span>
      </>
    ),
  },
  {
    icon: Users,
    title: 'Parents Welcome',
    highlight: 'Wait or work in KHM’s private space',
    detail: 'After 2 PM the café is reserved for KHM families, with Wi-Fi and plenty of seating.',
  },
  {
    icon: Car,
    title: 'Parking',
    highlight: 'Use of the on-site parking lot',
    detail: 'Easy drop-off and pick-up',
  },
];

const photos: LocationPhoto[] = [
  {
    src: '/images/location/kakaako-tutoring-window-table.jpg',
    width: 1200,
    height: 1600,
    alt: 'Two KHM students working together at a window table inside the Kakaʻako space',
  },
  {
    src: '/images/location/kakaako-study-lounge.jpg',
    width: 1200,
    height: 1600,
    alt: 'KHM’s Kakaʻako study lounge with armchairs, a surfboard and café seating',
  },
  {
    src: '/images/location/kakaako-study-floor.jpg',
    width: 1400,
    height: 1050,
    alt: 'Students studying at tables across the Kakaʻako learning space',
  },
  {
    src: '/images/location/kakaako-lounge-seating.jpg',
    width: 1400,
    height: 1050,
    alt: 'Leather armchairs and a round table in the Kakaʻako lounge',
  },
];

export function LocationContent() {
  return (
    <main className="bg-background">
      <section className="pb-12 pt-8 md:pb-16 md:pt-10">
        <div className="container mx-auto px-4">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)] lg:gap-10 xl:gap-12">
            {/* Left column: intro + info cards */}
            <div>
              <span className="mb-5 inline-flex items-center rounded-full bg-red-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm md:text-base">
                New Location · Kakaʻako
              </span>

              <h1 className="mb-5 text-4xl font-heading font-bold leading-[1.1] text-foreground sm:text-5xl xl:text-6xl">
                Our New Home <span className="whitespace-nowrap text-[hsl(214_33%_58%)]">in Kakaʻako</span>
              </h1>

              <p className="mb-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
                KHM builds environments where youth make academic progress, hit{' '}
                <strong className="font-semibold text-foreground">personal milestones</strong> and
                can learn <strong className="font-semibold text-foreground">together, in person</strong>,
                away from screens. Our new hub is a place where learning becomes second nature in a
                world that changes every day.
              </p>

              <div
                role="note"
                className="mb-8 max-w-2xl rounded-2xl border-2 border-red-600 bg-red-50 p-5 md:p-6"
              >
                <p className="mb-1 text-sm font-bold uppercase tracking-wide text-red-700">
                  After 2 PM, this is KHM’s space
                </p>
                <p className="text-base font-medium leading-7 text-foreground">
                  Surfers Coffee is a public café only until 2 PM. From 2 PM onward, the space is
                  reserved exclusively for KHM Tutoring students and families — it is{' '}
                  <strong className="font-semibold">not open to the public</strong>.
                </p>
              </div>

              <ul className="grid gap-4 sm:grid-cols-2">
                {infoCards.map(({ icon: Icon, title, highlight, detail }) => (
                  <li
                    key={title}
                    className="flex gap-3.5 rounded-2xl border border-border bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] xl:gap-4 xl:p-6"
                  >
                    <Icon
                      className="mt-0.5 h-7 w-7 shrink-0 text-foreground xl:h-8 xl:w-8"
                      strokeWidth={1.4}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <h2 className="mb-1 text-xl font-semibold text-foreground xl:text-2xl">
                        {title}
                      </h2>
                      <p className="mb-1 font-semibold leading-snug text-[hsl(211_70%_38%)]">
                        {highlight}
                      </p>
                      <div className="leading-snug text-muted-foreground">{detail}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right column: photo gallery + quote */}
            <div className="space-y-4">
              <LocationGallery photos={photos} />

              <figure className="rounded-2xl bg-primary px-6 py-5 text-center text-white shadow-lg md:px-8">
                <blockquote className="text-base leading-relaxed md:text-lg">
                  <p>
                    &ldquo;Watching screens connects us to information.{' '}
                    <strong className="font-semibold italic">Engaging with people</strong> connects
                    us to <strong className="font-semibold italic underline underline-offset-4">understanding</strong>.&rdquo;
                  </p>
                </blockquote>
              </figure>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
