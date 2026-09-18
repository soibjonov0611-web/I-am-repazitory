import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Code2, Cpu, Terminal } from 'lucide-react';
import { profile, socials } from '../data/portfolio';
import { useLanguage } from '../i18n/useLanguage';
import { getIcon } from '../lib/icons';
import { fadeUp, blurFadeUp, staggerContainer, EASE, AWWWARDS_EASE } from '../lib/motion';
import Magnetic from './Magnetic';
import devMouseImg from '../assets/dev-mouse.jpg';

function scrollTo(id) {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function CodeWindow({ tiltX, tiltY }) {
  const { t } = useLanguage();

  return (
    <motion.div
      className="code-window"
      initial={{ opacity: 0, y: 30, rotateX: 8 }}
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
        <div className="code-status-tag">DEV // READY</div>
      </div>
      <div className="code-body">
        <pre>
          <span className="tkn-com">{t('hero.codeComment')}</span>{'\n'}
          <span className="tkn-key">export const</span> <span className="tkn-var">engineer</span> <span className="tkn-punc">=</span> {'{\n'}
          {'  '}<span className="tkn-prop">name</span><span className="tkn-punc">:</span> <span className="tkn-str">'{profile.name}'</span>,<span className="tkn-com"></span>{'\n'}
          {'  '}<span className="tkn-prop">role</span><span className="tkn-punc">:</span> <span className="tkn-str">'{profile.role}'</span>,{'\n'}
          {'  '}<span className="tkn-prop">coreStack</span><span className="tkn-punc">:</span> [<span className="tkn-str">'React 19'</span>, <span className="tkn-str">'Vite'</span>, <span className="tkn-str">'Redux'</span>, <span className="tkn-str">'Zustand'</span>],{'\n'}
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

function DevMouseShowcase({ tiltX, tiltY }) {
  return (
    <motion.div
      className="dev-mouse-deck"
      initial={{ opacity: 0, scale: 0.92, y: 25 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      style={{
        rotateX: tiltX,
        rotateY: tiltY,
        transformPerspective: 1000,
      }}
      transition={{ duration: 0.85, delay: 0.25, ease: AWWWARDS_EASE }}
    >
      <div className="dev-mouse-dock">
        {/* Device Status Bar */}
        <div className="dev-mouse-header">
          <div className="dev-mouse-chip">
            <Cpu size={12} className="dev-chip-icon" />
            <span>DEV_PERIPHERAL // V1.0</span>
          </div>
          <div className="dev-mouse-status">
            <span className="dev-status-pulse" />
            <span>CONNECTED</span>
          </div>
        </div>

        {/* Mouse Visual Frame */}
        <div className="dev-mouse-frame">
          <div className="dev-mouse-underglow" />
          <img
            src={devMouseImg}
            alt="Futuristic Programmer Computer Mouse"
            className="dev-mouse-img"
            loading="eager"
            width={380}
            height={380}
          />
          <div className="dev-mouse-overlay-vignette" />

          {/* Micro programming floating elements */}
          <span className="mouse-badge badge-code">&lt;/&gt;</span>
          <span className="mouse-badge badge-brackets">&#123; &#125;</span>
          <span className="mouse-badge badge-bin">01</span>
          <span className="mouse-badge badge-lang">JS</span>
        </div>

        {/* Hardware Meta Footer */}
        <div className="dev-mouse-footer">
          <span className="mouse-meta-label">PRECISION OPTICAL</span>
          <span className="mouse-meta-div">|</span>
          <span className="mouse-meta-val">CYAN LED // 3200 DPI</span>
        </div>
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
  const [activeDeckTab, setActiveDeckTab] = useState('mouse'); // 'mouse' | 'code'

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIdx((prev) => (prev + 1) % dynamicRoles.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  const springX = useSpring(rawMouseX, { stiffness: 85, damping: 22 });
  const springY = useSpring(rawMouseY, { stiffness: 85, damping: 22 });

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

  const gridX = useTransform(springX, [-1, 1], [-12, 12]);
  const gridY = useTransform(springY, [-1, 1], [-12, 12]);

  const glow1X = useTransform(springX, [-1, 1], [-26, 26]);
  const glow1Y = useTransform(springY, [-1, 1], [-26, 26]);

  const glow2X = useTransform(springX, [-1, 1], [22, -22]);
  const glow2Y = useTransform(springY, [-1, 1], [22, -22]);

  const visualX = useTransform(springX, [-1, 1], [14, -14]);
  const visualY = useTransform(springY, [-1, 1], [14, -14]);

  const tiltX = useTransform(springY, [-1, 1], [6, -6]);
  const tiltY = useTransform(springX, [-1, 1], [-8, 8]);

  const badgeX = useTransform(springX, [-1, 1], [-18, 18]);
  const badgeY = useTransform(springY, [-1, 1], [-18, 18]);

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

          {/* Main Hero Heading */}
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

        {/* Hero Visual: Developer Hardware & Code Studio with 3D Parallax */}
        <motion.div className="hero-visual" style={{ x: visualX, y: visualY }} aria-hidden="true">
          <div className="hero-visual-switcher">
            <button
              type="button"
              className={'hero-switcher-tab ' + (activeDeckTab === 'mouse' ? 'active' : '')}
              onClick={() => setActiveDeckTab('mouse')}
            >
              <Cpu size={14} />
              <span>Dev Mouse</span>
            </button>
            <button
              type="button"
              className={'hero-switcher-tab ' + (activeDeckTab === 'code' ? 'active' : '')}
              onClick={() => setActiveDeckTab('code')}
            >
              <Terminal size={14} />
              <span>Config.ts</span>
            </button>
          </div>

          <div className="hero-visual-deck">
            {activeDeckTab === 'mouse' ? (
              <DevMouseShowcase tiltX={tiltX} tiltY={tiltY} />
            ) : (
              <CodeWindow tiltX={tiltX} tiltY={tiltY} />
            )}
          </div>

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