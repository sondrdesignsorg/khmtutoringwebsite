interface StructuredDataProps {
  type: 'organization' | 'home' | 'about' | 'educators' | 'contact' | 'diagnostic';
}

const baseUrl = 'https://www.khmtutoring.com';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  '@id': `${baseUrl}/#organization`,
  name: 'KHM Tutoring',
  description: 'Expert K-12 tutoring services in Hawaii. Math, English, SAT, SSAT, and AP prep. Serving Honolulu, Oahu, and all of Hawaii.',
  url: baseUrl,
  logo: `${baseUrl}/images/khm-tutoring-logo.png`,
  image: `${baseUrl}/images/khm-tutoring-hero.jpeg`,
  telephone: '(808) 381-7856',
  email: 'khmtutoring1@gmail.com',
  foundingDate: '2016',
  founder: {
    '@type': 'Person',
    name: 'Kody Kim',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Honolulu',
    addressRegion: 'HI',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '21.3069',
    longitude: '-157.8583',
  },
  areaServed: [
    {
      '@type': 'City',
      name: 'Honolulu',
      '@id': 'https://www.wikidata.org/wiki/Q18094',
    },
    {
      '@type': 'AdministrativeArea',
      name: 'Oahu',
    },
    {
      '@type': 'AdministrativeArea',
      name: 'Hawaii',
    },
  ],
  sameAs: [
    'https://www.yelp.com/biz/khm-tutoring-urban-honolulu',
    'https://www.linkedin.com/company/khm-tutoring/',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    bestRating: '5',
    worstRating: '1',
    ratingCount: '300',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${baseUrl}/#website`,
  name: 'KHM Tutoring',
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
    { '@type': 'AdministrativeArea', name: 'Oahu' },
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
        text: 'Yes! KHM Tutoring offers both in-home tutoring throughout Honolulu and Oahu, as well as online tutoring via Zoom for students across all of Hawaii. Sessions are available 7 days a week from 8 AM to 10 PM.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I get started with KHM Tutoring?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Getting started is easy — schedule a free consultation through our contact page or call us at (808) 381-7856. We will discuss your child\'s needs, match them with the ideal tutor, and create a personalized learning plan.',
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

const reviewSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: { '@id': `${baseUrl}/#organization` },
    author: { '@type': 'Person', name: 'Sarah Johnson' },
    reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    reviewBody: "KHM Tutoring transformed my daughter's confidence in math. She went from struggling with algebra to acing her tests. The personalized attention made all the difference!",
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: { '@id': `${baseUrl}/#organization` },
    author: { '@type': 'Person', name: 'Michael Chen' },
    reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    reviewBody: 'Outstanding SAT prep! My son improved his score by 150 points. The tutors are patient, knowledgeable, and really know how to connect with students.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: { '@id': `${baseUrl}/#organization` },
    author: { '@type': 'Person', name: 'Emily Rodriguez' },
    reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    reviewBody: "Thanks to KHM, I got into my dream college! The AP prep was thorough and the essay help was invaluable. I can't recommend them enough.",
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: { '@id': `${baseUrl}/#organization` },
    author: { '@type': 'Person', name: 'David Park' },
    reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    reviewBody: 'The flexible scheduling and online options made tutoring so convenient for our busy family. My son actually looks forward to his sessions now!',
  },
];

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
    name: 'Jacob Bergeron',
    jobTitle: 'Math, Physics & Engineering Tutor',
    worksFor: { '@id': `${baseUrl}/#organization` },
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'Texas A&M University' },
      { '@type': 'CollegeOrUniversity', name: 'University of Hawaii at Manoa' },
    ],
    knowsAbout: ['Mathematics', 'Physics', 'Aerospace Engineering', 'Mechanical Engineering'],
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
    award: ['Cum Laude', 'UH Mānoa Student Marshall (Fall 2025)', '1st Place CTAHR Showcase & Research Symposium'],
  },
];

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
  description: 'A free diagnostic test for K-12 students in Hawaii that identifies academic strengths and gaps by topic across Math and English.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    eligibleCustomerType: 'https://schema.org/Individual',
    description: 'Free academic diagnostic test with personalized topic breakdown and free consultation.',
  },
  areaServed: [
    { '@type': 'City', name: 'Honolulu' },
    { '@type': 'AdministrativeArea', name: 'Oahu' },
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

export function StructuredData({ type }: StructuredDataProps) {
  const getSchemas = () => {
    switch (type) {
      case 'home':
        return [organizationSchema, websiteSchema, serviceSchema, faqSchema, ...reviewSchemas];
      case 'about':
        return [organizationSchema, getBreadcrumbSchema('About', `${baseUrl}/about`)];
      case 'educators':
        return [organizationSchema, ...educatorPersonSchemas, getBreadcrumbSchema('Educators', `${baseUrl}/educators`)];
      case 'contact':
        return [organizationSchema, contactPageSchema, faqSchema, getBreadcrumbSchema('Contact', `${baseUrl}/contact`)];
      case 'diagnostic':
        return [organizationSchema, diagnosticPageSchema, diagnosticServiceSchema, getBreadcrumbSchema('Free Diagnostic Test', `${baseUrl}/diagnostic-test`)];
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
