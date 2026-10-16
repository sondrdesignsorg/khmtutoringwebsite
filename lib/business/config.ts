/**
 * Single source of truth for verified KHM Tutoring business identity.
 *
 * Everything that renders the business name, contact details, address,
 * service areas, hours, or proof points should import from here so the
 * footer, pages, JSON-LD, and sitemap cannot drift apart.
 *
 * Only verified facts belong in this file. Do not add a claim, address,
 * service area, or hours entry that has not been confirmed.
 */

export const SERVICE_AREAS = {
  /** Where KHM can physically deliver in-person tutoring. */
  inPerson: {
    label: 'Honolulu — Pearl City to Hawaiʻi Kai',
    /** Primary, ideal coverage corridor. */
    idealCorridor: {
      from: 'Pearl City',
      to: 'Hawaiʻi Kai',
      label: 'Pearl City to Hawaiʻi Kai',
    },
    /** We can travel here, but it sits outside the ideal service area. */
    extendedReach: {
      label: 'ʻEwa and West Oʻahu',
      note: 'We can reach as far as ʻEwa, though it is outside our ideal service corridor.',
    },
    /** Cities used for structured data / copy. */
    cities: ['Honolulu', 'Pearl City', 'Hawaiʻi Kai'],
  },
  /** Online tutoring has no geographic limit within the state. */
  online: {
    label: 'All of Hawaiʻi',
    area: 'Hawaii',
  },
} as const;

export const DELIVERY_MODES = [
  {
    id: 'partner-cafe',
    label: 'In-store at our partner cafe',
    detail: 'Sessions at our physical tutoring space in Kakaʻako, in collaboration with Surfers Coffee Hawaiʻi.',
  },
  {
    id: 'in-home',
    label: 'In-home & meet-up tutoring',
    detail: 'We come to your home or meet at a convenient spot across the Honolulu corridor, from Pearl City to Hawaiʻi Kai.',
  },
  {
    id: 'online',
    label: 'Online tutoring statewide',
    detail: 'Live one-on-one sessions via Zoom for families anywhere in Hawaiʻi.',
  },
] as const;

export const CLAIMS = {
  studentsHelped: '300+',
  avgScoreBoost: '+15%',
  parentRating: '5.0',
  tutors: '10+',
} as const;

export const BUSINESS = {
  name: 'KHM Tutoring',
  url: 'https://www.khmtutoring.com',
  email: 'khmtutoring1@gmail.com',
  phone: {
    display: '(808) 381-7856',
    href: 'tel:+18083817856',
    e164: '+18083817856',
  },
  address: {
    street: '1019 Waimanu St., Unit 101',
    streetShort: '1019 Waimanu St.',
    unit: 'Unit 101',
    city: 'Honolulu',
    region: 'HI',
    regionLong: 'Hawaii',
    postalCode: '96814',
    country: 'US',
    full: '1019 Waimanu St., Unit 101, Honolulu, HI 96814',
  },
  location: {
    /** Confirmed operational at the time of writing. */
    status: 'open' as const,
    partnerVenue: 'Surfers Coffee, inside WorkNow Hawaiʻi',
    partnerVenueShort: 'Surfers Coffee',
    neighborhood: 'Kakaʻako',
    parking: 'Use of the on-site parking lot, with easy drop-off and pick-up.',
  },
  hours: {
    byAppointment: true,
    label: 'By appointment',
    schedule: 'Daily, after 3 PM',
    note: 'Individual and group tutoring sessions are scheduled by appointment.',
  },
  foundingYear: '2016',
  founder: 'Kody Kim',
  /** Service areas, re-exported here for a single import path. */
  serviceAreas: SERVICE_AREAS,
  deliveryModes: DELIVERY_MODES,
  claims: CLAIMS,
  sameAs: [
    'https://www.yelp.com/biz/khm-tutoring-urban-honolulu',
    'https://www.linkedin.com/company/khm-tutoring/',
  ],
} as const;

export type Business = typeof BUSINESS;
