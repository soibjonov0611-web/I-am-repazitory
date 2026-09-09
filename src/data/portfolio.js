// ─────────────────────────────────────────────────────────────────────────────
//  Centralized Portfolio Data for Soibjonov Abduraxmon (Frontend Developer)
// ─────────────────────────────────────────────────────────────────────────────

export const profile = {
  name: 'Soibjonov Abduraxmon',
  firstName: 'Abduraxmon',
  role: 'Frontend Developer',
  badge: 'Frontend Developer',
  status: 'Open for opportunities',
  experienceYears: '2+',
  projectsCompleted: '10+',
  email: 'soibjonov.0611@gmail.com',
  github: 'https://github.com/soibjonov0611-web',
  githubUsername: 'soibjonov0611-web',
  telegram: 'https://t.me/Saipov_00',
  telegramHandle: '@Saipov_00',
  location: 'Uzbekistan · Remote / Hybrid',
  bio: 'Specializing in building high-performance, responsive, and aesthetically pleasing web applications with React, modern JavaScript, and clean component architectures.',
};

export const socials = [
  {
    name: 'GitHub',
    url: 'https://github.com/soibjonov0611-web',
    icon: 'github',
    handle: 'soibjonov0611-web',
  },
  {
    name: 'Telegram',
    icon: 'telegram',
    url: 'https://t.me/Saipov_00',
    handle: '@Saipov_00',
  },
  {
    name: 'Gmail',
    icon: 'mail',
    url: 'mailto:soibjonov.0611@gmail.com',
    handle: 'soibjonov.0611@gmail.com',
  },
];

export const navLinks = [
  { key: 'about', href: '#about' },
  { key: 'skills', href: '#skills' },
  { key: 'projects', href: '#projects' },
  { key: 'journey', href: '#journey' },
  { key: 'github', href: '#github' },
  { key: 'contact', href: '#contact' },
];

export const skillCategories = [
  { id: 'all', key: 'skills.tabAll' },
  { id: 'frontend', key: 'skills.tabFrontend' },
  { id: 'tools', key: 'skills.tabTools' },
];

export const skills = [
  // Frontend
  { name: 'HTML5', icon: 'html', level: 95, category: 'frontend', highlight: true },
  { name: 'CSS3 / SASS', icon: 'css', level: 92, category: 'frontend', highlight: true },
  { name: 'JavaScript (ES6+)', icon: 'js', level: 90, category: 'frontend', highlight: true },
  { name: 'React', icon: 'react', level: 90, category: 'frontend', highlight: true },
  { name: 'Vite', icon: 'vite', level: 88, category: 'frontend', highlight: false },
  { name: 'React Router', icon: 'router', level: 86, category: 'frontend', highlight: false },
  { name: 'Redux Toolkit', icon: 'redux', level: 85, category: 'frontend', highlight: true },
  { name: 'Zustand', icon: 'zustand', level: 84, category: 'frontend', highlight: false },
  { name: 'Material UI', icon: 'mui', level: 85, category: 'frontend', highlight: false },
  { name: 'Tailwind CSS', icon: 'css', level: 88, category: 'frontend', highlight: false },

  // Tools & Workflow
  { name: 'Git', icon: 'git', level: 88, category: 'tools', highlight: true },
  { name: 'GitHub', icon: 'github', level: 88, category: 'tools', highlight: true },
  { name: 'VS Code', icon: 'code', level: 92, category: 'tools', highlight: false },
  { name: 'REST API & Fetch', icon: 'api', level: 90, category: 'tools', highlight: true },
  { name: 'Vercel Deployment', icon: 'zap', level: 86, category: 'tools', highlight: false },
  { name: 'NPM & Packages', icon: 'boxes', level: 85, category: 'tools', highlight: false },
];

export const projectCategories = [
  { id: 'all', key: 'projects.catAll' },
  { id: 'web', key: 'projects.catWeb' },
  { id: 'ui', key: 'projects.catUi' },
];

export const projects = [
  {
    id: 'p1',
    keyPrefix: 'projects.',
    category: 'web',
    technologies: ['React', 'Redux Toolkit', 'Recharts', 'Material UI'],
    github: 'https://github.com/soibjonov0611-web',
    demo: 'https://github.com/soibjonov0611-web',
    accent: ['#6366f1', '#a855f7'],
    pattern: 'chart',
    featured: true,
  },
  {
    id: 'p2',
    keyPrefix: 'projects.',
    category: 'web',
    technologies: ['React', 'Zustand', 'Vite', 'REST API'],
    github: 'https://github.com/soibjonov0611-web',
    demo: 'https://github.com/soibjonov0611-web',
    accent: ['#22d3ee', '#6366f1'],
    pattern: 'cart',
    featured: true,
  },
  {
    id: 'p3',
    keyPrefix: 'projects.',
    category: 'ui',
    technologies: ['React', 'CSS Modules', 'Framer Motion'],
    github: 'https://github.com/soibjonov0611-web',
    demo: 'https://github.com/soibjonov0611-web',
    accent: ['#f97316', '#facc15'],
    pattern: 'ui',
    featured: false,
  },
  {
    id: 'p4',
    keyPrefix: 'projects.',
    category: 'web',
    technologies: ['React', 'React Router', 'REST API', 'Responsive CSS'],
    github: 'https://github.com/soibjonov0611-web',
    demo: 'https://github.com/soibjonov0611-web',
    accent: ['#34d399', '#22d3ee'],
    pattern: 'map',
    featured: false,
  },
];

export const journeyTimeline = [
  {
    id: 'j1',
    year: '2024',
    titleKey: 'journey.step1Title',
    descKey: 'journey.step1Desc',
    tech: ['HTML5', 'CSS3', 'JavaScript ES6+', 'Git'],
    icon: 'sparkles',
  },
  {
    id: 'j2',
    year: '2024 — 2025',
    titleKey: 'journey.step2Title',
    descKey: 'journey.step2Desc',
    tech: ['React', 'Vite', 'React Router', 'Component Architecture'],
    icon: 'react',
  },
  {
    id: 'j3',
    year: '2025',
    titleKey: 'journey.step3Title',
    descKey: 'journey.step3Desc',
    tech: ['Redux Toolkit', 'Zustand', 'REST APIs', 'UI Kits'],
    icon: 'layers',
  },
  {
    id: 'j4',
    year: '2025 — 2026',
    titleKey: 'journey.step4Title',
    descKey: 'journey.step4Desc',
    tech: ['Modern Production Apps', 'Performance', 'Clean Architecture', 'Open Source'],
    icon: 'zap',
  },
];

export const fallbackGithubRepos = [
  {
    id: 1,
    name: 'I-am-repazitory',
    description: 'Personal portfolio website built with modern React 19, Framer Motion, high performance CSS and multilingual architecture.',
    html_url: 'https://github.com/soibjonov0611-web/I-am-repazitory',
    stargazers_count: 3,
    forks_count: 0,
    language: 'JavaScript',
    updated_at: '2026-03-01T12:00:00Z',
  },
  {
    id: 2,
    name: 'react-ecommerce-pulse',
    description: 'Fast and responsive e-commerce web application with cart management, live filtering and smooth page transitions.',
    html_url: 'https://github.com/soibjonov0611-web',
    stargazers_count: 4,
    forks_count: 1,
    language: 'React',
    updated_at: '2026-02-15T10:00:00Z',
  },
  {
    id: 3,
    name: 'nebula-analytics-dashboard',
    description: 'Modern real-time analytics dashboard with interactive charts, dark theme support, and modular components.',
    html_url: 'https://github.com/soibjonov0611-web',
    stargazers_count: 5,
    forks_count: 1,
    language: 'JavaScript',
    updated_at: '2026-01-20T16:00:00Z',
  },
  {
    id: 4,
    name: 'lumen-ui-library',
    description: 'Accessible and lightweight reusable React UI components with fluid animations and responsive behaviors.',
    html_url: 'https://github.com/soibjonov0611-web',
    stargazers_count: 2,
    forks_count: 0,
    language: 'CSS / JS',
    updated_at: '2025-12-10T14:00:00Z',
  },
];

export const stats = [
  { id: 's1', value: 10, suffix: '+', icon: 'folder', keyLabel: 'experience.stat1Label' },
  { id: 's2', value: 2, suffix: '+', icon: 'clock', keyLabel: 'experience.stat2Label' },
  { id: 's3', value: 12, suffix: '+', icon: 'layers', keyLabel: 'experience.stat3Label' },
  { id: 's4', value: 100, suffix: '%', icon: 'heart', keyLabel: 'experience.stat4Label' },
];

export const contactChannels = [
  {
    name: 'Telegram',
    handle: '@Saipov_00',
    icon: 'telegram',
    url: 'https://t.me/Saipov_00',
    primary: true,
  },
  {
    name: 'Gmail',
    handle: 'soibjonov.0611@gmail.com',
    icon: 'mail',
    url: 'mailto:soibjonov.0611@gmail.com',
    primary: true,
  },
  {
    name: 'GitHub',
    handle: 'soibjonov0611-web',
    icon: 'github',
    url: 'https://github.com/soibjonov0611-web',
    primary: false,
  },
];

export default {
  profile,
  socials,
  navLinks,
  skills,
  skillCategories,
  projects,
  projectCategories,
  journeyTimeline,
  fallbackGithubRepos,
  stats,
  contactChannels,
};

