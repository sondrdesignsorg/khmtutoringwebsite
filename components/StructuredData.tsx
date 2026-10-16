import { groupSatFaqs, GROUP_SAT_START_ISO } from '@/lib/sat-group/content';
import { BUSINESS } from '@/lib/business/config';
import type { Tutor } from '@/lib/staff/types';

interface ServiceSchemaInput {
  name: string;
  description: string;
  path: string;
  serviceType?: string;
  faqs?: readonly { question: string; answer: string }[];
}

interface StructuredDataProps {
  type:
    | 'organization'
    | 'home'
    | 'about'
    | 'educators'
    | 'contact'
    | 'diagnostic'
    | 'group-sat-prep'
    | 'service';
  /** Live tutor profiles for the educators page; falls back to the static roster. */
  tutors?: Tutor[];
  /** Details for a service landing page. Required when type is 'service'. */
  service?: ServiceSchemaInput;
}

const baseUrl = BUSINESS.url;

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  BUSINESS.address.full,
)}`;

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'EducationalOrganization'],
  '@id': `${baseUrl}/#organization`,
  name: BUSINESS.name,
  description:
    'Expert K-12 tutoring services in Honolulu, Hawaii. Math, English, SAT, SSAT, and AP prep. In-person in Honolulu, online across all of Hawaii.',
  url: baseUrl,
  logo: `${baseUrl}/images/khm-tutoring-logo.png`,
  image: `${baseUrl}/images/khm-tutoring-hero.jpeg`,
  telephone: BUSINESS.phone.e164,
  email: BUSINESS.email,
  foundingDate: BUSINESS.foundingYear,
  founder: {
    '@type': 'Person',
    name: BUSINESS.founder,
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: BUSINESS.address.street,
    addressLocality: BUSINESS.address.city,
    addressRegion: BUSINESS.address.region,
    postalCode: BUSINESS.address.postalCode,
    addressCountry: BUSINESS.address.country,
  },
  hasMap: mapsUrl,
  areaServed: [
    {
      '@type': 'City',
      name: 'Honolulu',
      '@id': 'https://www.wikidata.org/wiki/Q18094',
    },
    {
      '@type': 'AdministrativeArea',
      name: 'Hawaii',
    },
  ],
  sameAs: BUSINESS.sameAs,
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${baseUrl}/#website`,
  name: BUSINESS.name,
  url: baseUrl,
  publisher: {
    '@id': `${baseUrl}/#organization`,
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${baseUrl}/#service`,
  name: 'Tutoring Services',
  provider: {
    '@id': `${baseUrl}/#organization`,
  },
  serviceType: 'Educational Tutoring',
  areaServed: [
    { '@type': 'City', name: 'Honolulu' },
    { '@type': 'AdministrativeArea', name: 'Hawaii' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Tutoring Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Math Tutoring', description: 'Expert math tutoring from arithmetic through advanced calculus for K-12 students in Hawaii.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'English Tutoring', description: 'Reading comprehension, essay writing, grammar, and vocabulary tutoring in Honolulu.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'SAT Prep', description: 'Comprehensive SAT preparation with proven score improvement strategies.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'SSAT Prep', description: 'SSAT test preparation for private school admissions in Hawaii.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AP Subject Tutoring', description: 'Advanced Placement exam preparation across multiple subjects.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'College Counseling', description: 'College application guidance, essay writing, and admissions consulting.' } },
    ],
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What subjects does KHM Tutoring offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'KHM Tutoring offers Math (arithmetic through AP Calculus), English (reading comprehension, essay writing, grammar, vocabulary), SAT prep, SSAT prep, AP subject tutoring, and college counseling & essay writing for K-12 students in Hawaii.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer online tutoring in Hawaii?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. KHM Tutoring offers in-person tutoring in Honolulu, from Pearl City to Hawaiʻi Kai, as well as online tutoring via Zoom for students across all of Hawaii. Sessions are scheduled by appointment.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I get started with KHM Tutoring?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Getting started is easy — schedule a free consultation through our contact page or call us at ${BUSINESS.phone.display}. We will discuss your child's needs, match them with the ideal tutor, and create a personalized learning plan.`,
      },
    },
    {
      '@type': 'Question',
      name: 'What makes KHM Tutoring different from other tutoring services?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'KHM Tutoring is locally owned in Honolulu (not a franchise) with 10+ expert tutors from institutions like Harvard, Princeton, and Phillips Exeter Academy. We use a proprietary tutor-matching process, provide personalized one-on-one instruction, and have helped 300+ students with a 5.0 parent rating.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are KHM Tutoring\'s qualifications?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our team includes graduates from Harvard University (Magna Cum Laude), Princeton University, Phillips Exeter Academy, and Penn State. Our tutors include a Fulbright Scholar, a medical student with a top 0.5% MCAT score (525/528), and a 35-year Iolani School teaching veteran.',
      },
    },
  ],
};

function buildFaqSchema(faqs: readonly { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
}

function buildServiceSchema(service: ServiceSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${baseUrl}${service.path}#service`,
    name: service.name,
    description: service.description,
    serviceType: service.serviceType ?? 'Tutoring',
    provider: { '@id': `${baseUrl}/#organization` },
    areaServed: [
      { '@type': 'City', name: 'Honolulu' },
      { '@type': 'AdministrativeArea', name: 'Hawaii' },
    ],
    offers: {
      '@type': 'Offer',
      category: 'Educational service',
      areaServed: [
        { '@type': 'City', name: 'Honolulu' },
        { '@type': 'AdministrativeArea', name: 'Hawaii' },
      ],
    },
  };
}

const educatorPersonSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Kody Kim',
    jobTitle: 'Founder & Tutor',
    worksFor: { '@id': `${baseUrl}/#organization` },
    alumniOf: [
      { '@type': 'EducationalOrganization', name: 'Punahou School' },
      { '@type': 'CollegeOrUniversity', name: 'University of California, Irvine' },
    ],
    knowsAbout: ['Essay Writing', 'Reading Comprehension', 'Mathematics', 'SAT Prep', 'ACT Prep'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Andrew Holzman',
    jobTitle: 'Tutor & College Admissions Consultant',
    worksFor: { '@id': `${baseUrl}/#organization` },
    alumniOf: [
      { '@type': 'EducationalOrganization', name: 'Phillips Exeter Academy' },
      { '@type': 'CollegeOrUniversity', name: 'University of Chicago' },
    ],
    knowsAbout: ['College Applications', 'English', 'SAT Prep', 'MCAT Prep'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Peter Greenhill',
    jobTitle: 'English & Philosophy Tutor',
    worksFor: { '@id': `${baseUrl}/#organization` },
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'Princeton University' },
    ],
    knowsAbout: ['English', 'Philosophy', 'College Essay Writing', 'SAT Prep'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Shwe Win',
    jobTitle: 'Science Tutor & College Counselor',
    worksFor: { '@id': `${baseUrl}/#organization` },
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'Harvard University' },
    ],
    knowsAbout: ['Neuroscience', 'Chemistry', 'Biology', 'College Counseling', 'Essay Writing'],
    award: ['Fulbright Scholar', 'Harvard Magna Cum Laude'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Noah Agena',
    jobTitle: 'Math & Physics Tutor',
    worksFor: { '@id': `${baseUrl}/#organization` },
    alumniOf: [
      { '@type': 'EducationalOrganization', name: 'Iolani School' },
    ],
    knowsAbout: ['Mathematics', 'Physics', 'Calculus', 'Mechanical Engineering'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Blythe Yangson',
    jobTitle: 'Math & Science Tutor',
    worksFor: { '@id': `${baseUrl}/#organization` },
    alumniOf: [
      { '@type': 'EducationalOrganization', name: 'Damien Memorial School' },
    ],
    knowsAbout: ['Mathematics', 'Calculus', 'Pre-Calculus', 'SAT Prep', 'ACT Prep'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Keenan Kim',
    jobTitle: 'Math Tutor',
    worksFor: { '@id': `${baseUrl}/#organization` },
    alumniOf: [
      { '@type': 'EducationalOrganization', name: 'HBA High School' },
      { '@type': 'CollegeOrUniversity', name: 'Penn State University' },
    ],
    knowsAbout: ['Mathematics', 'Calculus', 'Architectural Engineering'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Colton Inamine',
    jobTitle: 'Math Tutor',
    worksFor: { '@id': `${baseUrl}/#organization` },
    alumniOf: [
      { '@type': 'EducationalOrganization', name: 'Iolani School' },
      { '@type': 'CollegeOrUniversity', name: 'University of Hawaii at Manoa' },
    ],
    knowsAbout: ['Mathematics', 'Electrical Computer Engineering'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Alec Wong',
    jobTitle: 'Math & English Tutor',
    worksFor: { '@id': `${baseUrl}/#organization` },
    alumniOf: [
      { '@type': 'EducationalOrganization', name: 'Punahou School' },
    ],
    knowsAbout: ['Mathematics', 'English'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Aizen Chung',
    jobTitle: 'Math & Physics Tutor',
    worksFor: { '@id': `${baseUrl}/#organization` },
    alumniOf: [
      { '@type': 'EducationalOrganization', name: 'Iolani School' },
      { '@type': 'CollegeOrUniversity', name: 'University of Hawaii at Manoa' },
    ],
    knowsAbout: ['Mathematics', 'Physics', 'Electrical Computer Engineering'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Omar Saidy',
    jobTitle: 'Math, Test Prep, Social Studies & PE Tutor',
    worksFor: { '@id': `${baseUrl}/#organization` },
    knowsAbout: ['Mathematics', 'Test Preparation', 'Social Studies', 'Physical Education'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Sheany Chung',
    jobTitle: 'Biology & Chemistry Tutor',
    worksFor: { '@id': `${baseUrl}/#organization` },
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'University of Hawaii at Manoa' },
    ],
    knowsAbout: ['Biology', 'Chemistry', 'Cell & Molecular Biology', 'Genetics'],
    award: ['Cum Laude', 'UH Mānoa Student Marshal (Fall 2025)', '1st Place CTAHR Showcase & Research Symposium'],
  },
];

function buildEducatorSchemas(tutors: Tutor[]) {
  return tutors.map((tutor) => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: tutor.name,
    jobTitle: tutor.tagline || tutor.category,
    worksFor: { '@id': `${baseUrl}/#organization` },
    ...(tutor.subjects.length ? { knowsAbout: tutor.subjects } : {}),
    ...(tutor.achievements.length ? { award: tutor.achievements.slice(0, 4) } : {}),
  }));
}

const diagnosticPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${baseUrl}/diagnostic-test`,
  name: 'Free Academic Diagnostic Test',
  description: 'A free, level-appropriate diagnostic test that shows strengths and gaps by topic for K-12 students in Hawaii.',
  url: `${baseUrl}/diagnostic-test`,
  isPartOf: { '@id': `${baseUrl}/#website` },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Free Diagnostic Test', item: `${baseUrl}/diagnostic-test` },
    ],
  },
};

const diagnosticServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Free Academic Diagnostic Test',
  provider: { '@id': `${baseUrl}/#organization` },
  serviceType: 'Educational Assessment',
  description: 'A free diagnostic test for K-12 students in Hawaii that identifies academic strengths and gaps by topic across Math and English. Takes 15 to 70 minutes depending on grade level.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    eligibleCustomerType: 'https://schema.org/Individual',
    description: 'Free academic diagnostic test with personalized topic breakdown and free consultation.',
  },
  areaServed: [
    { '@type': 'City', name: 'Honolulu' },
    { '@type': 'AdministrativeArea', name: 'Hawaii' },
  ],
};

const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact KHM Tutoring',
  url: `${baseUrl}/contact`,
  mainEntity: {
    '@id': `${baseUrl}/#organization`,
  },
};

const groupSatLocation = {
  '@type': 'Place',
  name: BUSINESS.location.partnerVenue,
  address: {
    '@type': 'PostalAddress',
    streetAddress: BUSINESS.address.street,
    addressLocality: BUSINESS.address.city,
    addressRegion: BUSINESS.address.region,
    postalCode: BUSINESS.address.postalCode,
    addressCountry: BUSINESS.address.country,
  },
};

const groupSatSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  '@id': `${baseUrl}/group-sat-prep#course`,
  name: 'Small-Cohort SAT Prep',
  description:
    'Small-cohort SAT preparation for high school students in Honolulu, Hawaii. Groups of 6–8 students matched by level and readiness. 20 hours of live instruction focused on SAT strategy, timing, and test-day confidence.',
  provider: {
    '@id': `${baseUrl}/#organization`,
  },
  url: `${baseUrl}/group-sat-prep`,
  courseWorkload: 'PT20H',
  hasCourseInstance: [
    {
      '@type': 'CourseInstance',
      name: 'Sunday Strategy Cohort',
      courseMode: 'in-person',
      startDate: GROUP_SAT_START_ISO,
      courseWorkload: 'PT20H',
      location: groupSatLocation,
    },
    {
      '@type': 'CourseInstance',
      name: 'Weekday After-School Cohort',
      courseMode: 'in-person',
      startDate: GROUP_SAT_START_ISO,
      courseWorkload: 'PT20H',
      location: groupSatLocation,
    },
    {
      '@type': 'CourseInstance',
      name: 'Evening Practice Cohort',
      courseMode: 'in-person',
      startDate: GROUP_SAT_START_ISO,
      courseWorkload: 'PT20H',
      location: groupSatLocation,
    },
  ],
  audience: {
    '@type': 'EducationalAudience',
    educationalRole: 'student',
    audienceType: 'High school students preparing for the SAT in Hawaii',
  },
};

const groupSatFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: groupSatFaqs.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: answer,
    },
  })),
};

function getBreadcrumbSchema(pageName: string, pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: pageName,
        item: pageUrl,
      },
    ],
  };
}

export function StructuredData({ type, tutors, service }: StructuredDataProps) {
  const getSchemas = () => {
    switch (type) {
      case 'home':
        return [organizationSchema, websiteSchema, serviceSchema];
      case 'about':
        return [organizationSchema, getBreadcrumbSchema('About', `${baseUrl}/about`)];
      case 'educators': {
        const educatorSchemas = tutors ? buildEducatorSchemas(tutors) : educatorPersonSchemas;
        return [organizationSchema, ...educatorSchemas, getBreadcrumbSchema('Educators', `${baseUrl}/educators`)];
      }
      case 'contact':
        return [organizationSchema, contactPageSchema, faqSchema, getBreadcrumbSchema('Contact', `${baseUrl}/contact`)];
      case 'diagnostic':
        return [organizationSchema, diagnosticPageSchema, diagnosticServiceSchema, getBreadcrumbSchema('Free Diagnostic Test', `${baseUrl}/diagnostic-test`)];
      case 'group-sat-prep':
        return [organizationSchema, groupSatSchema, groupSatFaqSchema, getBreadcrumbSchema('Group SAT Prep', `${baseUrl}/group-sat-prep`)];
      case 'service': {
        if (!service) return [organizationSchema];
        return [
          organizationSchema,
          buildServiceSchema(service),
          ...(service.faqs?.length ? [buildFaqSchema(service.faqs)] : []),
          getBreadcrumbSchema(service.name, `${baseUrl}${service.path}`),
        ];
      }
      case 'organization':
      default:
        return [organizationSchema];
    }
  };

  const schemas = getSchemas();

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
