/** Project data for the portfolio */
export const FEATURED_PROJECTS = [
  {
    title: 'DekNek Hub',
    description:
      '3D asset management platform with usage analytics, built end to end and deployed on Vercel. Postgres schema with Row Level Security and view tracking.',
    chips: ['Next.js', 'PostgreSQL', 'Supabase', 'Vercel'],
    url: 'https://deknek-hub-3d.vercel.app',
    hue: 150,
  },
  {
    title: 'NutriVision',
    description:
      'Clinical safety system that cross-references diet with medication data to flag food-drug interactions in real time. Graded A for architecture and scalability.',
    chips: ['FastAPI', 'Python', 'REST', 'MySQL'],
    url: '',
    hue: 265,
  },
  {
    title: 'AI Dietician',
    description:
      'Computer vision pipeline that reads meal images with YOLO, estimates calories and macros, and charts dietary trends on a dashboard.',
    chips: ['YOLO', 'MySQL', 'MongoDB', 'Python'],
    url: '',
    hue: 190,
  },
  {
    title: 'QuestBoard',
    description:
      'GenAI-powered learning RPG that tracks progression and turns studying into quests. Currently in development.',
    chips: ['GenAI', 'Full-stack', 'In progress'],
    url: '',
    hue: 320,
  },
];

export const OTHER_PROJECTS = [
  {
    title: 'Badminton Store',
    chips: ['Flask', 'Vue.js', 'Data modeling'],
  },
  {
    title: 'ML Time Estimator',
    chips: ['Python', 'Regression', 'Feature eng.'],
  },
];

export const STACK = [
  {
    title: 'Frontend',
    chips: ['Next.js', 'Vue.js', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Figma'],
    wide: true,
  },
  {
    title: 'Backend',
    chips: ['FastAPI', 'Flask', 'Node.js', 'REST APIs', 'Python', 'Java'],
    wide: true,
  },
  {
    title: 'Databases',
    chips: ['PostgreSQL', 'MySQL', 'MongoDB', 'Supabase RLS'],
    wide: false,
  },
  {
    title: 'AI & Data',
    chips: ['YOLO', 'GenAI', 'Regression'],
    wide: false,
  },
  {
    title: 'DevOps',
    chips: ['Git', 'Docker', 'GitHub CI/CD', 'Vercel', 'n8n'],
    wide: false,
  },
];

export const EXPERIENCE = [
  { date: 'APR 2026', company: 'Electronic Arts', role: 'Software Engineering' },
  { date: 'DEC 2025', company: 'Accenture', role: 'Developer & Technology' },
  { date: 'OCT 2025', company: 'J.P. Morgan Chase & Co.', role: 'Software Engineering' },
  { date: 'OCT 2025', company: 'Deloitte', role: 'Technology Consulting' },
];

export const MARQUEE_ITEMS = [
  'Next.js', 'FastAPI', 'PostgreSQL', 'TypeScript', 'Python', 'Vue.js',
];
