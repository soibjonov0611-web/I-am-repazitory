import {
  Atom,
  Boxes,
  Braces,
  Clock,
  Code2,
  Component,
  FileCode2,
  FileJson,
  FolderGit2,
  GitBranch,
  Heart,
  Layers,
  Mail,
  Palette,
  PlugZap,
  Route,
  Sparkles,
  Zap,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, TelegramIcon } from './brandIcons';

const map = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  telegram: TelegramIcon,
  mail: Mail,
  html: FileCode2,
  css: Palette,
  js: FileJson,
  react: Atom,
  vite: Zap,
  router: Route,
  redux: Layers,
  zustand: Boxes,
  api: PlugZap,
  git: GitBranch,
  mui: Component,
  sparkles: Sparkles,
  zap: Zap,
  code: Code2,
  folder: FolderGit2,
  clock: Clock,
  heart: Heart,
};

export function getIcon(name) {
  return map[name] || Braces;
}

export const icons = map;