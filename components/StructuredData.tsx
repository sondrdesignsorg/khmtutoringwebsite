interface StructuredDataProps {
  type: 'organization' | 'home' | 'about' | 'educators' | 'contact' | 'diagnostic' | 'group-sat-prep';
}

const baseUrl = 'https://www.khmtutoring.com';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'EducationalOrganization'],
  '@id': `${baseUrl}/#organization`,
  name: 'KHM Tutoring',
  description: 'Expert K-12 tutoring services in Hawaii. Math, English, SAT, SSAT, and AP prep. Serving Honolulu, Oahu, and all of Hawaii.',
  url: baseUrl,
  logo: `${baseUrl}/images/khm-tutoring-logo.png`,
  image: `${baseUrl}/images/khm-tutoring-hero.jpeg`,
  telephone: '+18083817856',
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
    postalCode: '96813',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '21.30694',
    longitude: '-157.85830',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '08:00',
      closes: '22:00',
    },
  ],
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
    ratingCount: '11',
    reviewCount: '11',
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
    author: { '@type': 'Person', name: 'Jennifer N.' },
    publisher: { '@type': 'Organization', name: 'Yelp' },
    datePublished: '2026-02-16',
    reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    reviewBody: 'Our son got accepted early action to Massachusetts Institute of Technology! Again, thank you Kody and Peter for making his dream come true!',
  },
  {
    '@type': 'Review',
    itemReviewed: { '@id': `${baseUrl}/#organization` },
    author: { '@type': 'Person', name: 'Nanette K.' },
    publisher: { '@type': 'Organization', name: 'Yelp' },
    datePublished: '2025-12-09',
    reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    reviewBody: 'My daughter is highly motivated with getting good grades, but was struggling with her pre-calculus class. KHM tutoring came to the rescue! Her tutor, Blythe, is very patient, warm, helpful and great at explaining the work.',
  },
  {
    '@type': 'Review',
    itemReviewed: { '@id': `${baseUrl}/#organization` },
    author: { '@type': 'Person', name: 'Stacie S.' },
    publisher: { '@type': 'Organization', name: 'Yelp' },
    datePublished: '2025-12-05',
    reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    reviewBody: 'Kody and Keenan got a response very quickly, were very professional and patient with my son, and got results after the first session. We would recommend and will keep using this awesome service.',
  },
  {
    '@type': 'Review',
    itemReviewed: { '@id': `${baseUrl}/#organization` },
    author: { '@type': 'Person', name: 'Junko K.' },
    publisher: { '@type': 'Organization', name: 'Yelp' },
    datePublished: '2025-12-03',
    reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    reviewBody: 'Kody and David are both awesome! The sessions are engaging and tailored to exactly what my son need help with. He is gaining more confidence in Algebra. Highly recommended for anyone who wants quality tutoring.',
  },
  {
    '@type': 'Review',
    itemReviewed: { '@id': `${baseUrl}/#organization` },
    author: { '@type': 'Person', name: 'Dhianie G.' },
    publisher: { '@type': 'Organization', name: 'Yelp' },
    datePublished: '2025-12-03',
    reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    reviewBody: 'Grateful for KHM\'s tutoring support! My daughter had a hard time adjusting to math in her first year at a new school and fell behind on key skills. She is now earning better grades and showing more confidence in math.',
  },
  {
    '@type': 'Review',
    itemReviewed: { '@id': `${baseUrl}/#organization` },
    author: { '@type': 'Person', name: 'Georgia G.' },
    publisher: { '@type': 'Organization', name: 'Yelp' },
    datePublished: '2025-02-22',
    reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    reviewBody: 'My son needed help with Precalculus and Kody and Noah have been a lifesaver. He\'s feeling more confident in his class. Noah comes twice a week, and comes to our house which is really helpful.',
  },
  {
    '@type': 'Review',
    itemReviewed: { '@id': `${baseUrl}/#organization` },
    author: { '@type': 'Person', name: 'Tyler D.' },
    publisher: { '@type': 'Organization', name: 'Yelp' },
    datePublished: '2024-09-29',
    reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    reviewBody: 'Kody is an excellent resource to help my son with his college preparations. Very prompt responses.',
  },
  {
    '@type': 'Review',
    itemReviewed: { '@id': `${baseUrl}/#organization` },
    author: { '@type': 'Person', name: 'Antonio R.' },
    publisher: { '@type': 'Organization', name: 'Yelp' },
    datePublished: '2023-07-07',
    reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    reviewBody: 'I recently enrolled my child in KHM Tutoring, and I must say that our experience has been nothing short of exceptional. Kody went above and beyond to ensure their success in their high school coursework.',
  },
  {
    '@type': 'Review',
    itemReviewed: { '@id': `${baseUrl}/#organization` },
    author: { '@type': 'Person', name: 'Seung Mee ..' },
    publisher: { '@type': 'Organization', name: 'Yelp' },
    datePublished: '2023-06-21',
    reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    reviewBody: 'This is an amazing business who truly cares about their customers. They have awesome tutors and are very responsive and accommodating. Kody got it and set up services right away via Zoom.',
  },
  {
    '@type': 'Review',
    itemReviewed: { '@id': `${baseUrl}/#organization` },
    author: { '@type': 'Person', name: 'Jeffrey V.' },
    publisher: { '@type': 'Organization', name: 'Yelp' },
    datePublished: '2023-06-20',
    reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    reviewBody: 'Tutored my brother in SAT, and did a great job on his math and reading section. Increased his score by several hundred points. Responsive, has the know-how, and is overall a great tutor!',
  },
  {
    '@type': 'Review',
    itemReviewed: { '@id': `${baseUrl}/#organization` },
    author: { '@type': 'Person', name: 'Makoa H.' },
    publisher: { '@type': 'Organization', name: 'Yelp' },
    datePublished: '2023-06-13',
    reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    reviewBody: 'Keeps my brother on track for school work and studying for his SAT. Kody has been a great help!',
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

const groupSatLocation = {
  '@type': 'Place',
  name: 'KHM Tutoring',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '1025 Waimanu St',
    addressLocality: 'Honolulu',
    addressRegion: 'HI',
    postalCode: '96814',
    addressCountry: 'US',
  },
};

const groupSatSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  '@id': `${baseUrl}/group-sat-prep#course`,
  name: 'Small-Cohort SAT Prep',
  description: 'Small-cohort SAT preparation for high school students in Honolulu, Hawaii. Groups of 6–8 students matched by level and readiness. 20 hours of live instruction focused on SAT strategy, timing, and test-day confidence.',
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
      startDate: '2026-09-21',
      courseWorkload: 'PT20H',
      location: groupSatLocation,
    },
    {
      '@type': 'CourseInstance',
      name: 'Weekday After-School Cohort',
      courseMode: 'in-person',
      startDate: '2026-09-21',
      courseWorkload: 'PT20H',
      location: groupSatLocation,
    },
    {
      '@type': 'CourseInstance',
      name: 'Evening Practice Cohort',
      courseMode: 'in-person',
      startDate: '2026-09-21',
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
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How many students are in a SAT prep cohort?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Each cohort is planned for 6-8 students. That size gives students enough peer energy to simulate a testing environment while staying small enough for the instructor to adjust pacing and examples.',
      },
    },
    {
      '@type': 'Question',
      name: 'How are students placed into SAT prep cohorts?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'KHM looks at schedule, current score or diagnostic level, grade, goals, and group fit. The goal is not just to fill seats — it is to create a cohort where students can move at a productive pace together.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does the full SAT prep session include?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The session is 20 total hours of live SAT instruction. It includes content review, timed practice, test-taking strategy, question pattern recognition, and discussion of the SAT topics students often do not know to study.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the KHM SAT program mostly content review or strategy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Both. Students still need math, grammar, reading, and data-analysis skills, but the program also emphasizes the decisions that affect scores under time pressure: pacing, elimination, guessing, section management, and recovery after difficult questions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where are the SAT prep sessions held?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sessions are held in person at 1025 Waimanu St, Honolulu, HI 96814. Three schedule windows are available: Sunday mornings, weekday after-school (Tuesday and Thursday), and weekday evenings (Monday and Wednesday).',
      },
    },
    {
      '@type': 'Question',
      name: 'When does the SAT prep program start?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The target start date is September 21, 2026. Final cohort details are coordinated by email after KHM reviews each student\'s fit form.',
      },
    },
  ],
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
      case 'group-sat-prep':
        return [organizationSchema, groupSatSchema, groupSatFaqSchema, getBreadcrumbSchema('Group SAT Prep', `${baseUrl}/group-sat-prep`)];
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
