import { BUSINESS, SERVICE_AREAS } from '@/lib/business/config';

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceHighlight {
  title: string;
  body: string;
}

export interface ServiceContent {
  /** Route segment, e.g. "sat-prep-honolulu". */
  slug: string;
  /** Leading-slash path, e.g. "/sat-prep-honolulu". */
  path: string;
  /** Schema.org Service name. */
  name: string;
  /** Short label used in navigation. */
  navLabel: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  /** Lead paragraphs shown under the H1. */
  intro: string[];
  /** Who the service is for (grades / audiences). */
  audiences: string[];
  /** Topics or formats covered. */
  topics: string[];
  highlights: ServiceHighlight[];
  faqs: ServiceFaq[];
  /** Slugs of related service pages for internal linking. */
  related: string[];
  priority: number;
  changeFrequency: 'weekly' | 'monthly' | 'yearly';
  lastModified: string;
}

const DELIVERY =
  `Available in person in ${SERVICE_AREAS.inPerson.label}, at our Kakaʻako space in collaboration with ${BUSINESS.location.partnerVenue}, and online for families across ${SERVICE_AREAS.online.label}.`;

export const SERVICES: ServiceContent[] = [
  {
    slug: 'sat-prep-honolulu',
    path: '/sat-prep-honolulu',
    name: 'SAT Prep in Honolulu',
    navLabel: 'SAT Prep',
    metaTitle: 'SAT Prep in Honolulu | 1-on-1 SAT Tutoring | KHM Tutoring',
    metaDescription:
      'One-on-one SAT prep in Honolulu with 10+ expert tutors. Personalized math and reading & writing coaching, full-length practice, and proven score strategies. Free diagnostic.',
    h1: 'SAT Prep in Honolulu',
    intro: [
      'The SAT rewards students who know the test, not just the material. KHM Tutoring pairs Honolulu students with tutors who have scored in the top percentiles and know exactly where the Digital SAT sets its traps — from the adaptive module structure to the pacing decisions that protect a score under time pressure.',
      'Every SAT plan starts with a free diagnostic so we can see the student’s current level by topic. From there, a tutor builds a session plan around the sections and question types that actually move the score, whether the goal is a first strong attempt or a competitive retake.',
    ],
    audiences: ['High school students (grades 9–12)', 'Rising juniors planning early', 'Seniors targeting fall deadlines'],
    topics: [
      'Digital SAT Math: Algebra, Advanced Math, Problem Solving & Data Analysis, Geometry & Trigonometry',
      'Reading & Writing: information and ideas, craft and structure, expression of ideas',
      'Adaptive module strategy and section management',
      'Full-length timed practice with review',
      'Score-target planning and test-date scheduling',
    ],
    highlights: [
      {
        title: 'Built around the Digital SAT',
        body: 'Tutors coach the adaptive format specifically — how to bank early accuracy, manage the two modules, and use the built-in tools to protect time.',
      },
      {
        title: 'Full-length practice with review',
        body: 'Students sit realistic timed sections, then spend session time on the misses that repeat. We fix patterns, not just individual questions.',
      },
      {
        title: 'Proof from real results',
        body: 'KHM’s team has helped 300+ students, with families reporting measurable score and grade improvement. Several tutors scored in the top 1% of the SAT.',
      },
    ],
    faqs: [
      {
        question: 'How many sessions does SAT prep usually take?',
        answer:
          'It depends on the starting score and the target. Most students meet once or twice a week for 8–14 weeks. We map a timeline after the free diagnostic so you know what to expect before you commit.',
      },
      {
        question: 'Do you offer both one-on-one and small-group SAT prep?',
        answer:
          'Yes. This page covers one-on-one SAT tutoring. For small-group classes of 6–8 students, see our Group SAT Prep program, which follows the same strategy-first approach in a cohort setting.',
      },
      {
        question: 'Can SAT prep be done online?',
        answer:
          'Yes. One-on-one SAT tutoring is available online statewide via Zoom with the same tutors and the same materials. Many students combine in-person and online sessions.',
      },
    ],
    related: ['math-tutoring-honolulu', 'online-tutoring-hawaii', 'college-essay-help-honolulu'],
    priority: 0.95,
    changeFrequency: 'weekly',
    lastModified: '2026-10-15',
  },
  {
    slug: 'math-tutoring-honolulu',
    path: '/math-tutoring-honolulu',
    name: 'Math Tutoring in Honolulu',
    navLabel: 'Math Tutoring',
    metaTitle: 'Math Tutoring in Honolulu | K-12 Math Tutors | KHM Tutoring',
    metaDescription:
      'Expert math tutoring in Honolulu for K-12 students, from arithmetic to AP Calculus. Patient, personalized one-on-one instruction in person or online. Free diagnostic.',
    h1: 'Math Tutoring in Honolulu',
    intro: [
      'Math is cumulative, and gaps hide easily. A student who is struggling in Algebra II is often missing a skill from earlier that never fully landed. KHM’s Honolulu math tutors find the specific break in the foundation and rebuild it, rather than repeating the same chapter the classroom already moved past.',
      'Tutors work from where the student actually is — not where the syllabus says they should be — and explain each step in a way the student can reproduce on their own. Sessions are available in person across Honolulu and online statewide.',
    ],
    audiences: ['Elementary through high school students (K-12)', 'Students catching up on missed foundations', 'Students accelerating ahead of grade level'],
    topics: [
      'Arithmetic and number sense',
      'Pre-Algebra, Algebra I & II',
      'Geometry and Trigonometry',
      'Pre-Calculus and AP Calculus AB/BC',
      'Statistics and problem-solving',
    ],
    highlights: [
      {
        title: 'Diagnose the gap, then teach',
        body: 'Our free diagnostic pinpoints exactly which topics are shaky. Tutors use those results to target the root skill instead of re-teaching what is already solid.',
      },
      {
        title: 'Step-by-step, reproducible methods',
        body: 'Students learn a consistent process they can repeat on homework and tests — the goal is independence, not a tutor who does the problem for them.',
      },
      {
        title: 'All levels, one subject',
        body: 'From elementary arithmetic to AP Calculus, we match students with a tutor who is strong at their specific level and course.',
      },
    ],
    faqs: [
      {
        question: 'What math levels do you tutor?',
        answer:
          'KHM tutors cover K-12 math, from basic arithmetic and pre-algebra through Geometry, Algebra II, Pre-Calculus, and AP Calculus. We also support statistics and general problem-solving.',
      },
      {
        question: 'My student is behind. Where do we start?',
        answer:
          'We start with a free diagnostic to see which topics need attention. That gives us a concrete starting point so sessions focus on the gaps that matter most instead of guessing.',
      },
      {
        question: 'Is math tutoring available in person?',
        answer:
          `Yes. ${DELIVERY}`,
      },
    ],
    related: ['sat-prep-honolulu', 'ap-tutoring-honolulu', 'online-tutoring-hawaii'],
    priority: 0.94,
    changeFrequency: 'weekly',
    lastModified: '2026-10-15',
  },
  {
    slug: 'ssat-prep-hawaii',
    path: '/ssat-prep-hawaii',
    name: 'SSAT Prep in Hawaii',
    navLabel: 'SSAT Prep',
    metaTitle: 'SSAT Prep in Hawaii | Private School Test Prep | KHM Tutoring',
    metaDescription:
      'SSAT prep for Hawaii families applying to private schools like Punahou and Iolani. One-on-one verbal, quantitative, and reading coaching, in person or online. Free diagnostic.',
    h1: 'SSAT Prep in Hawaii',
    intro: [
      'For Hawaii families, the SSAT is often the first high-stakes test a student faces — and the first time a strong student meets a test designed to run them out of time. KHM’s SSAT tutors teach the content and, just as importantly, the test-taking habits that keep a student calm and accurate under pressure.',
      'We know the Hawaii private-school landscape, including what schools like Punahou and Iolani look for. Prep is tailored to whether the student is aiming for a middle-level or upper-level SSAT.',
    ],
    audiences: ['Students applying to grades 6–12 at private schools', 'Families targeting Hawaii independent schools', 'Students new to standardized testing'],
    topics: [
      'Verbal reasoning and vocabulary',
      'Quantitative reasoning',
      'Reading comprehension',
      'Writing sample preparation',
      'Pacing, guessing strategy, and test-day confidence',
    ],
    highlights: [
      {
        title: 'Fluent in the Hawaii private-school path',
        body: 'Our team includes graduates of Punahou, Iolani, and Phillips Exeter, so we understand the bar these schools set and how to prepare for it.',
      },
      {
        title: 'Middle and upper level',
        body: 'Prep is matched to the specific SSAT level and target grade, with practice pitched at the right difficulty.',
      },
      {
        title: 'Confidence under time pressure',
        body: 'We rehearse the decisions that trip students up — when to skip, when to guess, and how to recover after a hard section.',
      },
    ],
    faqs: [
      {
        question: 'What is the difference between the SSAT and the ISEE?',
        answer:
          'Both are private-school admission tests, but they test different things in different ways. We prepare students for the SSAT; if your schools prefer the ISEE, ask us and we will tell you honestly whether we are the right fit.',
      },
      {
        question: 'When should we start SSAT prep?',
        answer:
          'Four to eight weeks of consistent prep works for most students, but younger students often benefit from a longer, lower-intensity runway. A diagnostic helps us recommend a realistic timeline.',
      },
      {
        question: 'Do you help with the writing sample?',
        answer:
          'Yes. The SSAT writing sample is not scored, but schools read it. We work on organization, clarity, and voice so the sample supports the rest of the application.',
      },
    ],
    related: ['private-school-entrance-prep-hawaii', 'online-tutoring-hawaii', 'college-essay-help-honolulu'],
    priority: 0.9,
    changeFrequency: 'monthly',
    lastModified: '2026-10-15',
  },
  {
    slug: 'ap-tutoring-honolulu',
    path: '/ap-tutoring-honolulu',
    name: 'AP Tutoring in Honolulu',
    navLabel: 'AP Tutoring',
    metaTitle: 'AP Tutoring in Honolulu | AP Calculus, Sciences & More | KHM Tutoring',
    metaDescription:
      'AP tutoring in Honolulu for Calculus, Statistics, Physics, Biology, Chemistry, and more. Exam-focused one-on-one coaching with confident subject experts. Free diagnostic.',
    h1: 'AP Tutoring in Honolulu',
    intro: [
      'Advanced Placement courses move fast, and a rough unit early can shadow the whole year. KHM’s AP tutors help Honolulu students keep pace with the course while steadily building toward the May exam — so students walk into the test already comfortable with its format and difficulty.',
      'Tutors match the student’s specific AP course and teacher’s pacing, covering both the classroom material and the exam skills the class may not have time to drill.',
    ],
    audiences: ['High school students in AP courses', 'Students balancing multiple AP classes', 'Students targeting AP exam credit or course grades'],
    topics: [
      'AP Calculus AB/BC',
      'AP Statistics',
      'AP Physics 1, 2, and C',
      'AP Biology and AP Chemistry',
      'AP English Language and Literature',
      'AP Computer Science and other subjects on request',
    ],
    highlights: [
      {
        title: 'Exam-realistic practice',
        body: 'We work free-response and multiple-choice questions in the AP style, including the timing and point-allocation habits that earn partial credit.',
      },
      {
        title: 'Course-aligned support',
        body: 'Tutors follow your student’s actual AP course, so sessions reinforce what is being taught now and shore up what was taught too quickly.',
      },
      {
        title: 'Strong subject matches',
        body: 'We route each student to a tutor who has genuinely mastered that AP subject — including engineering and pre-med students for the STEM exams.',
      },
    ],
    faqs: [
      {
        question: 'Which AP subjects do you cover?',
        answer:
          'We regularly tutor AP Calculus, Statistics, Physics, Biology, Chemistry, and English, along with Computer Science. If you do not see your subject, ask — we will tell you whether we have the right tutor.',
      },
      {
        question: 'Should we start AP tutoring at the beginning of the year or before the exam?',
        answer:
          'Starting early usually means less cramming in April. That said, we also run focused exam-season prep for students who need to tighten up specific units in a shorter window.',
      },
      {
        question: 'Do you tutor AP courses online?',
        answer:
          'Yes. AP tutoring is available online statewide in addition to in-person sessions in Honolulu.',
      },
    ],
    related: ['math-tutoring-honolulu', 'sat-prep-honolulu', 'online-tutoring-hawaii'],
    priority: 0.9,
    changeFrequency: 'monthly',
    lastModified: '2026-10-15',
  },
  {
    slug: 'college-essay-help-honolulu',
    path: '/college-essay-help-honolulu',
    name: 'College Essay Help in Honolulu',
    navLabel: 'College Essay Help',
    metaTitle: 'College Essay Help in Honolulu | Admissions Essays | KHM Tutoring',
    metaDescription:
      'College essay and application help in Honolulu. One-on-one coaching on personal statements and supplementals with admissions-experienced mentors. Free consultation.',
    h1: 'College Essay Help in Honolulu',
    intro: [
      'A strong college essay sounds like the student, not like an adult who rewrote it. KHM’s writing mentors help Honolulu students find the story only they can tell, then shape it into clear, specific prose that holds an admissions reader’s attention.',
      'We coach from the first brainstorm to the final polish, and we work on supplementals and the activities list too. The student does the writing — we ask the questions that unlock it.',
    ],
    audiences: ['Juniors and seniors applying to college', 'Students staring at a blank personal statement', 'Families managing many supplementals at once'],
    topics: [
      'Personal statement and Common App essay',
      'Supplemental essays and “why us” prompts',
      'UC PIQ and other application essays',
      'Activities list and application narrative',
      'Brainstorming, structure, revision, and polish',
    ],
    highlights: [
      {
        title: 'Admissions-experienced mentors',
        body: 'Our team includes a former corporate lawyer and medical student who guides applications, and a Harvard graduate and Fulbright Scholar who founded a college-access nonprofit.',
      },
      {
        title: 'The student’s voice, sharpened',
        body: 'We coach rather than ghostwrite. Students leave with essays that are unmistakably their own and with writing skills that last.',
      },
      {
        title: 'Deadlines handled calmly',
        body: 'We help students plan a submission calendar so early-action and regular deadlines never turn into a panic week.',
      },
    ],
    faqs: [
      {
        question: 'Do you write the essay for the student?',
        answer:
          'No. We coach the student through brainstorming, drafting, and revision. The writing stays theirs — which is both the ethical choice and the one that produces a better essay.',
      },
      {
        question: 'When should a student start their college essays?',
        answer:
          'Ideally the summer before senior year, which gives room for several honest revisions. Starting in the fall is workable but tighter, especially with a full course load.',
      },
      {
        question: 'Do you help with supplemental essays?',
        answer:
          'Yes. Many students need more help on supplementals than on the main essay because of the volume and the school-specific prompts. We help prioritize and plan them.',
      },
    ],
    related: ['ssat-prep-hawaii', 'private-school-entrance-prep-hawaii', 'sat-prep-honolulu'],
    priority: 0.88,
    changeFrequency: 'monthly',
    lastModified: '2026-10-15',
  },
  {
    slug: 'online-tutoring-hawaii',
    path: '/online-tutoring-hawaii',
    name: 'Online Tutoring in Hawaii',
    navLabel: 'Online Tutoring',
    metaTitle: 'Online Tutoring in Hawaii | Live 1-on-1 Zoom Tutoring | KHM Tutoring',
    metaDescription:
      'Live online tutoring for students across all of Hawaii. One-on-one math, English, SAT, SSAT, and AP coaching via Zoom with the same expert tutors. Free diagnostic.',
    h1: 'Online Tutoring in Hawaii',
    intro: [
      'Distance should never decide whether a student gets a great tutor. KHM’s online tutoring brings the same one-on-one instruction to families anywhere in Hawaii, from neighbor islands to the far side of Oahu, over live interactive Zoom sessions.',
      'Online sessions use the same tutors, the same diagnostic process, and the same personalized plan as in-person prep. Students share work on screen in real time, and parents get the same progress updates.',
    ],
    audiences: ['Neighbor-island families (Big Island, Maui, Kauai, Molokai, Lanai)', 'Oahu families who prefer to learn from home', 'Students with busy schedules needing flexible times'],
    topics: [
      'K-12 math and English',
      'SAT and ACT prep',
      'SSAT and private-school test prep',
      'AP subject tutoring',
      'Homework help and study skills',
    ],
    highlights: [
      {
        title: 'Same tutors, no geography limit',
        body: 'Online students are matched with the same Maui-to-Hawaii selection of tutors and get the identical quality of instruction as in-person clients.',
      },
      {
        title: 'Truly interactive sessions',
        body: 'Live screen sharing, digital whiteboards, and immediate feedback keep online sessions active rather than a passive video call.',
      },
      {
        title: 'Flexible across time zones',
        body: 'Scheduled by appointment and available seven days a week by arrangement, online sessions fit around school, sports, and family life.',
      },
    ],
    faqs: [
      {
        question: 'What technology do I need for online tutoring?',
        answer:
          'A reliable internet connection and a device with a camera and microphone are enough. We run sessions over Zoom and use on-screen collaboration, so no special software is required.',
      },
      {
        question: 'Is online tutoring as effective as in person?',
        answer:
          'For many students, yes. Online sessions remove travel time and let us match a student with a subject expert regardless of location. The one-on-one attention is the same.',
      },
      {
        question: 'Do you serve neighbor islands?',
        answer:
          `Yes. Online tutoring is available across ${SERVICE_AREAS.online.label}, including the neighbor islands, subject to tutor availability.`,
      },
    ],
    related: ['math-tutoring-honolulu', 'sat-prep-honolulu', 'ap-tutoring-honolulu'],
    priority: 0.9,
    changeFrequency: 'monthly',
    lastModified: '2026-10-15',
  },
  {
    slug: 'private-school-entrance-prep-hawaii',
    path: '/private-school-entrance-prep-hawaii',
    name: 'Private School Entrance Prep in Hawaii',
    navLabel: 'Private School Prep',
    metaTitle: 'Private School Entrance Prep in Hawaii | KHM Tutoring',
    metaDescription:
      'Private school entrance prep for Hawaii families: SSAT/ISEE test prep, interviews, essays, and application strategy for schools like Punahou and Iolani.',
    h1: 'Private School Entrance Prep in Hawaii',
    intro: [
      'Hawaii’s independent schools are competitive, and admission is about more than a test score. KHM supports families through the whole private-school application: entrance-test preparation, the student essay, the parent statement, and the interview.',
      'Our tutors include graduates of Punahou, Iolani, DAMIEN, and Phillips Exeter, so we understand what these schools value and how to help a student present their strongest, most authentic self.',
    ],
    audiences: ['Families applying to grades K–12 at private schools', 'Students preparing for SSAT or ISEE', 'Families navigating interviews and essays'],
    topics: [
      'SSAT and ISEE entrance-test prep',
      'Student essay and short-answer coaching',
      'Interview practice and feedback',
      'Application timeline and school-fit planning',
      'Parent statement guidance',
    ],
    highlights: [
      {
        title: 'Local alumni insight',
        body: 'Tutors who attended Hawaii’s private schools bring firsthand perspective on the culture, expectations, and admissions process.',
      },
      {
        title: 'The full application, not just the test',
        body: 'We help with essays, interviews, and timelines — the parts families most often underestimate.',
      },
      {
        title: 'Age-appropriate coaching',
        body: 'A fifth-grader and a ninth-grader need different support. Sessions are pitched to the student’s developmental stage.',
      },
    ],
    faqs: [
      {
        question: 'Which entrance tests do you prepare students for?',
        answer:
          'We prepare students for the SSAT and can advise on school preferences between the SSAT and ISEE. Test readiness is paired with essay and interview prep for the full application.',
      },
      {
        question: 'How early should we start the private-school application process?',
        answer:
          'For most Hawaii schools, starting in the spring or summer before the application year gives families comfortable time for testing, essays, and interviews without a last-minute rush.',
      },
      {
        question: 'Do you help with interviews?',
        answer:
          'Yes. We run mock interviews and give honest, kind feedback so students can speak naturally about themselves instead of reciting rehearsed answers.',
      },
    ],
    related: ['ssat-prep-hawaii', 'college-essay-help-honolulu', 'online-tutoring-hawaii'],
    priority: 0.88,
    changeFrequency: 'monthly',
    lastModified: '2026-10-15',
  },
];

export const SERVICE_SLUGS = SERVICES.map((service) => service.slug);

export function getService(slug: string): ServiceContent | undefined {
  return SERVICES.find((service) => service.slug === slug);
}
