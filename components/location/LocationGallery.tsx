'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type LocationPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type LocationGalleryProps = {
  photos: LocationPhoto[];
};

/**
 * Featured photo with prev/next controls, plus a thumbnail strip of the
 * other photos. Selecting a thumbnail promotes it to the featured slot.
 */
export function LocationGallery({ photos }: LocationGalleryProps) {
  const [active, setActive] = useState(0);
  const count = photos.length;

  const go = useCallback(
    (delta: number) => setActive((i) => (i + delta + count) % count),
    [count],
  );

  if (count === 0) return null;

  const current = photos[active];
  const thumbnails = photos
    .map((photo, index) => ({ photo, index }))
    .filter(({ index }) => index !== active);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Photos of the Kakaʻako location"
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') go(-1);
        if (e.key === 'ArrowRight') go(1);
      }}
    >
      <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-secondary/30 shadow-[0_18px_55px_rgba(15,23,42,0.12)]">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          priority={active === 0}
          sizes="(max-width: 1024px) 100vw, 48vw"
          className="object-cover"
        />

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <p className="sr-only" aria-live="polite">
              Photo {active + 1} of {count}: {current.alt}
            </p>
          </>
        )}
      </div>

      {thumbnails.length > 0 && (
        <ul className="mt-3 grid grid-cols-3 gap-3">
          {thumbnails.slice(0, 3).map(({ photo, index }) => (
            <li key={photo.src}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show photo: ${photo.alt}`}
                className={cn(
                  'group relative block aspect-square w-full overflow-hidden rounded-xl bg-secondary/30',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                )}
              >
                <Image
                  src={photo.src}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 33vw, 16vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
