// ─────────────────────────────────────────────────────────────────────────────
//  Centralized Portfolio Data for Saipov_00
// ─────────────────────────────────────────────────────────────────────────────

export const profile = {
  name: 'Saipov_00',
  firstName: 'Saipov_00',
  role: 'Frontend Developer',
  availability: 'Open for opportunities',
  email: 'soibjonov.0611@gmail.com',
  github: 'https://github.com/soibjonov0611-web',
  telegram: 'https://t.me/Saipov_00',
  telegramHandle: '@Saipov_00',
  location: 'Uzbekistan · Remote',
};

export const socials = [
  {
    name: 'GitHub',
    icon: 'github',
    url: 'https://github.com/soibjonov0611-web',
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
  { key: 'experience', href: '#experience' },
  { key: 'contact', href: '#contact' },
];

export const skills = [
  { name: 'HTML', icon: 'html', level: 95, group: 'core' },
  { name: 'CSS', icon: 'css', level: 93, group: 'core' },
  { name: 'JavaScript', icon: 'js', level: 90, group: 'core' },
  { name: 'React', icon: 'react', level: 90, group: 'core' },
  { name: 'Vite', icon: 'vite', level: 88, group: 'tooling' },
  { name: 'React Router', icon: 'router', level: 86, group: 'tooling' },
  { name: 'Redux Toolkit', icon: 'redux', level: 85, group: 'tooling' },
  { name: 'Zustand', icon: 'zustand', level: 82, group: 'tooling' },
  { name: 'REST API', icon: 'api', level: 88, group: 'tooling' },
  { name: 'Git', icon: 'git', level: 88, group: 'workflow' },
  { name: 'GitHub', icon: 'github', level: 88, group: 'workflow' },
  { name: 'Material UI', icon: 'mui', level: 84, group: 'workflow' },
];

export const projects = [
  {
    id: 'p1',
    keyPrefix: 'projects.',
    technologies: ['React', 'Redux Toolkit', 'Recharts', 'Material UI'],
    github: 'https://github.com/soibjonov0611-web',
    demo: 'https://github.com/soibjonov0611-web',
    accent: ['#6366f1', '#a855f7'],
    pattern: 'chart',
  },
  {
    id: 'p2',
    keyPrefix: 'projects.',
    technologies: ['React', 'Zustand', 'Vite', 'REST API'],
    github: 'https://github.com/soibjonov0611-web',
    demo: 'https://github.com/soibjonov0611-web',
    accent: ['#22d3ee', '#6366f1'],
    pattern: 'cart',
  },
  {
    id: 'p3',
    keyPrefix: 'projects.',
    technologies: ['React', 'CSS', 'Framer Motion'],
    github: 'https://github.com/soibjonov0611-web',
    demo: 'https://github.com/soibjonov0611-web',
    accent: ['#f97316', '#facc15'],
    pattern: 'ui',
  },
  {
    id: 'p4',
    keyPrefix: 'projects.',
    technologies: ['React', 'React Router', 'REST API', 'CSS'],
    github: 'https://github.com/soibjonov0611-web',
    demo: 'https://github.com/soibjonov0611-web',
    accent: ['#34d399', '#22d3ee'],
    pattern: 'map',
  },
];

export const stats = [
  { id: 's1', value: 10, suffix: '+', icon: 'folder', keyLabel: 'experience.stat1Label' },
  { id: 's2', value: 2, suffix: '+', icon: 'clock', keyLabel: 'experience.stat2Label' },
  { id: 's3', value: 10, suffix: '+', icon: 'layers', keyLabel: 'experience.stat3Label' },
  { id: 's4', value: 100, suffix: '%', icon: 'heart', keyLabel: 'experience.stat4Label' },
];

export const contactChannels = [
  {
    name: 'GitHub',
    handle: 'soibjonov0611-web',
    icon: 'github',
    url: 'https://github.com/soibjonov0611-web',
  },
  {
    name: 'Telegram',
    handle: '@Saipov_00',
    icon: 'telegram',
    url: 'https://t.me/Saipov_00',
  },
  {
    name: 'Gmail',
    handle: 'soibjonov.0611@gmail.com',
    icon: 'mail',
    url: 'mailto:soibjonov.0611@gmail.com',
  },
];

export default {
  profile,
  socials,
  navLinks,
  skills,
  projects,
  stats,
  contactChannels,
};