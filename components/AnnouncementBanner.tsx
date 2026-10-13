import Link from 'next/link';

const locationHref = '/about/location';

export function AnnouncementBanner() {
  return (
    <div
      className="mt-[69px] bg-[#f51616] text-white shadow-sm"
      role="region"
      aria-label="Location announcement"
    >
      <Link
        href={locationHref}
        className="block px-4 py-2 text-center text-[11px] font-bold leading-snug tracking-[0.01em] transition-colors hover:bg-[#d80f0f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white sm:px-6 sm:text-xs"
      >
        <span>ANNOUNCEMENT: KHM Tutoring is excited to announce our new physical location – a collaboration with </span>
        <em>Surfers Coffee Hawai&apos;i - Kaka&apos;ako at </em>
        <span className="underline underline-offset-2">
          1019 Waimanu St., Unit 101, Honolulu, HI, 96814
        </span>
        <span> – </span>
        <em>WITH PARKING! </em>
        <span>– For Additional Info, Click Here.</span>
      </Link>
    </div>
  );
}
