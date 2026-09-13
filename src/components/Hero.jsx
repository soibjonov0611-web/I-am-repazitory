import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Code2 } from 'lucide-react';
import { profile, socials } from '../data/portfolio';
import { useLanguage } from '../i18n/useLanguage';
import { getIcon } from '../lib/icons';
import { fadeUp, blurFadeUp, staggerContainer, EASE, AWWWARDS_EASE } from '../lib/motion';
import Magnetic from './Magnetic';

function scrollTo(id) {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function CodeWindow({ tiltX, tiltY }) {
  const { t } = useLanguage();

  return (
    <motion.div
      className="code-window"
      initial={{ opacity: 0, y: 40, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      style={{
        rotateX: tiltX,
        rotateY: tiltY,
        transformPerspective: 1000,
      }}
      transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
    >
      <div className="code-topbar">
        <div className="code-mac-dots">
          <span className="circle circle-red" />
          <span className="circle circle-yellow" />
          <span className="circle circle-green" />
        </div>
        <div className="code-title-tab">
          <Code2 size={13} />
          <span>developer.config.ts</span>
        </div>
        <div className="code-status-tag">READY</div>
      </div>
      <div className="code-body">
        <pre>
          <span className="tkn-com">{t('hero.codeComment')}</span>{'\n'}
          <span className="tkn-key">export const</span> <span className="tkn-var">engineer</span> <span className="tkn-punc">=</span> {'{\n'}
          {'  '}<span className="tkn-prop">name</span><span className="tkn-punc">:</span> <span className="tkn-str">'{profile.name}'</span>,<span className="tkn-com"></span>{'\n'}
          {'  '}<span className="tkn-prop">role</span><span className="tkn-punc">:</span> <span className="tkn-str">'{profile.role}'</span>,{'\n'}
          {'  '}<span className="tkn-prop">coreStack</span><span className="tkn-punc">:</span> [<span className="tkn-str">'React'</span>, <span className="tkn-str">'Vite'</span>, <span className="tkn-str">'Redux'</span>, <span className="tkn-str">'Zustand'</span>],{'\n'}
          {'  '}<span className="tkn-prop">mindset</span><span className="tkn-punc">:</span> <span className="tkn-str">'{t('hero.codeFocus')}'</span>,{'\n'}
          {'  '}<span className="tkn-prop">build</span><span className="tkn-punc">()</span> {'{\n'}
          {'    '}<span className="tkn-key">return</span> <span className="tkn-str">'Modern, Responsive, Scalable Web'</span>;{'\n'}
          {'  '}{'}'}{'\n'}
          <span className="tkn-punc">{'}'}</span>;
          <span className="cursor" aria-hidden="true" />
        </pre>
      </div>
    </motion.div>
  );
}

function FloatingTech({ name, icon, className, delay, offsetX, offsetY }) {
  const Icon = getIcon(icon);

  return (
    <motion.div
      className={'tech-float ' + className}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ x: offsetX, y: offsetY }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{
          repeat: Infinity,
          duration: 5,
          delay: delay * 1.5,
          ease: 'easeInOut',
        }}
        className="tech-float-inner"
      >
        <Icon size={16} />
        <span>{name}</span>
      </motion.div>
    </motion.div>
  );
}

const dynamicRoles = [
  'Frontend Developer',
  'UI/UX & Motion Engineer',
  'React Architecture Specialist',
];

export default function Hero() {
  const { t } = useLanguage();
  const heroRef = useRef(null);
  const [roleIdx, setRoleIdx] = useState(0);

  // Dynamic role rotator
  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIdx((prev) => (prev + 1) % dynamicRoles.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  // Parallax Motion Values
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  const springX = useSpring(rawMouseX, { stiffness: 90, damping: 22 });
  const springY = useSpring(rawMouseY, { stiffness: 90, damping: 22 });

  const handleMouseMove = (e) => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!heroRef.current) return;

    const { left, top, width, height } = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - (left + width / 2)) / (width / 2);
    const y = (e.clientY - (top + height / 2)) / (height / 2);

    rawMouseX.set(x);
    rawMouseY.set(y);
  };

  const handleMouseLeave = () => {
    rawMouseX.set(0);
    rawMouseY.set(0);
  };

  // Parallax Layer Transforms
  const gridX = useTransform(springX, [-1, 1], [-14, 14]);
  const gridY = useTransform(springY, [-1, 1], [-14, 14]);

  const glow1X = useTransform(springX, [-1, 1], [-30, 30]);
  const glow1Y = useTransform(springY, [-1, 1], [-30, 30]);

  const glow2X = useTransform(springX, [-1, 1], [25, -25]);
  const glow2Y = useTransform(springY, [-1, 1], [25, -25]);

  const visualX = useTransform(springX, [-1, 1], [16, -16]);
  const visualY = useTransform(springY, [-1, 1], [16, -16]);

  const codeTiltX = useTransform(springY, [-1, 1], [6, -6]);
  const codeTiltY = useTransform(springX, [-1, 1], [-8, 8]);

  const badgeX = useTransform(springX, [-1, 1], [-22, 22]);
  const badgeY = useTransform(springY, [-1, 1], [-22, 22]);

  return (
    <section
      className="hero"
      id="top"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="hero-bg" aria-hidden="true">
        <motion.div className="hero-grid" style={{ x: gridX, y: gridY }} />
        <motion.div
          className="hero-glow glow-1"
          style={{ x: glow1X, y: glow1Y }}
          animate={{ opacity: [0.35, 0.55, 0.35] }}
          transition={{ repeat: Infinity, duration: 14, ease: 'easeInOut' }}
        />
        <motion.div
          className="hero-glow glow-2"
          style={{ x: glow2X, y: glow2Y }}
          animate={{ opacity: [0.3, 0.45, 0.3] }}
          transition={{ repeat: Infinity, duration: 16, ease: 'easeInOut' }}
        />
        <div className="hero-glow glow-3" />
      </div>

      <div className="container hero-inner">
        <motion.div
          className="hero-content"
          variants={staggerContainer(0.08, 0.1)}
          initial="hidden"
          animate="visible"
        >
          {/* Live Availability Badge */}
          <motion.div variants={fadeUp()} className="hero-badge-row">
            <div className="hero-live-badge">
              <span className="pulse-dot" />
              <span>{t('hero.statusLive')}</span>
            </div>
            <div className="hero-role-pill-animated">
              <AnimatePresence mode="wait">
                <motion.span
                  key={dynamicRoles[roleIdx]}
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.32, ease: AWWWARDS_EASE }}
                >
                  {dynamicRoles[roleIdx]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Main Hero Heading with Text Reveal */}
          <motion.div variants={staggerContainer(0.06)} className="hero-title-wrap">
            <motion.p className="hero-greeting" variants={blurFadeUp(0)}>
              <Sparkles size={16} className="sparkle-icon" />
              {t('hero.greeting')}
            </motion.p>
            <motion.h1 className="hero-name" variants={blurFadeUp(1)}>
              {profile.name}
            </motion.h1>
            <motion.h2 className="hero-subhead" variants={blurFadeUp(2)}>
              {t('hero.titleStart')}{' '}
              <span className="gradient-text">{t('hero.titleEnd')}</span>
            </motion.h2>
          </motion.div>

          <motion.p className="lead hero-desc" variants={fadeUp(3)}>
            {t('hero.description')}
          </motion.p>

          {/* Action CTAs with Magnetic Effect */}
          <motion.div className="hero-cta" variants={fadeUp(4)}>
            <Magnetic strength={0.28}>
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => scrollTo('#projects')}
              >
                <span>{t('hero.viewWork')}</span>
                <ArrowRight size={17} />
              </button>
            </Magnetic>

            <Magnetic strength={0.28}>
              <button
                type="button"
                className="btn btn-ghost btn-lg"
                onClick={() => scrollTo('#contact')}
              >
                {t('hero.contactMe')}
              </button>
            </Magnetic>
          </motion.div>

          {/* Social Links & Quick Stats */}
          <motion.div className="hero-bottom-row" variants={fadeUp(5)}>
            <div className="hero-socials">
              {socials.map((s) => {
                const Icon = getIcon(s.icon);
                const isMail = s.url.startsWith('mailto:');
                return (
                  <Magnetic key={s.name} strength={0.35}>
                    <a
                      className="social-btn"
                      href={s.url}
                      target={isMail ? undefined : '_blank'}
                      rel={isMail ? undefined : 'noopener noreferrer'}
                      aria-label={t('hero.social' + s.name) || s.name}
                      title={s.name}
                    >
                      <Icon size={18} />
                    </a>
                  </Magnetic>
                );
              })}
            </div>

            <div className="hero-quick-meta">
              <span className="meta-item">
                <strong>{profile.experienceYears}</strong> {t('hero.quickExp')}
              </span>
              <span className="meta-sep">/</span>
              <span className="meta-item">
                <strong>{profile.projectsCompleted}</strong> {t('hero.quickProjects')}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Hero Visual: Interactive Code Window + Floating Tech Badges with 3D Parallax */}
        <motion.div className="hero-visual" style={{ x: visualX, y: visualY }} aria-hidden="true">
          <CodeWindow tiltX={codeTiltX} tiltY={codeTiltY} />
          <FloatingTech name="React" icon="react" className="tech-1" delay={0.6} offsetX={badgeX} offsetY={badgeY} />
          <FloatingTech name="JavaScript" icon="js" className="tech-2" delay={0.75} offsetX={badgeX} offsetY={badgeY} />
          <FloatingTech name="Vite" icon="vite" className="tech-3" delay={0.9} offsetX={badgeX} offsetY={badgeY} />
          <FloatingTech name="Redux" icon="redux" className="tech-4" delay={1.05} offsetX={badgeX} offsetY={badgeY} />
          <FloatingTech name="Git" icon="git" className="tech-5" delay={1.2} offsetX={badgeX} offsetY={badgeY} />
        </motion.div>
      </div>
    </section>
  );
}
