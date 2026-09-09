import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Code2 } from 'lucide-react';
import { profile, socials } from '../data/portfolio';
import { useLanguage } from '../i18n/useLanguage';
import { getIcon } from '../lib/icons';
import { fadeUp, staggerContainer, EASE } from '../lib/motion';

function scrollTo(id) {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function CodeWindow() {
  const { t } = useLanguage();

  return (
    <motion.div
      className="code-window"
      initial={{ opacity: 0, y: 40, rotateX: 6 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
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

function FloatingTech({ name, icon, className, delay }) {
  const Icon = getIcon(icon);

  return (
    <motion.div
      className={`tech-float ${className}`}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
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

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-grid" />
        <motion.div
          className="hero-glow glow-1"
          animate={{ opacity: [0.35, 0.55, 0.35], x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 14, ease: 'easeInOut' }}
        />
        <motion.div
          className="hero-glow glow-2"
          animate={{ opacity: [0.3, 0.45, 0.3], x: [0, -24, 0] }}
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
            <span className="hero-role-pill">{profile.role}</span>
          </motion.div>

          {/* Main Hero Heading */}
          <motion.div variants={fadeUp()} className="hero-title-wrap">
            <p className="hero-greeting">
              <Sparkles size={16} className="sparkle-icon" />
              {t('hero.greeting')}
            </p>
            <h1 className="hero-name">
              {profile.name}
            </h1>
            <h2 className="hero-subhead">
              {t('hero.titleStart')}{' '}
              <span className="gradient-text">{t('hero.titleEnd')}</span>
            </h2>
          </motion.div>

          <motion.p className="lead hero-desc" variants={fadeUp()}>
            {t('hero.description')}
          </motion.p>

          {/* Action CTAs */}
          <motion.div className="hero-cta" variants={fadeUp()}>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => scrollTo('#projects')}
            >
              <span>{t('hero.viewWork')}</span>
              <ArrowRight size={17} />
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-lg"
              onClick={() => scrollTo('#contact')}
            >
              {t('hero.contactMe')}
            </button>
          </motion.div>

          {/* Social Links & Quick Stats */}
          <motion.div className="hero-bottom-row" variants={fadeUp()}>
            <div className="hero-socials">
              {socials.map((s) => {
                const Icon = getIcon(s.icon);
                const isMail = s.url.startsWith('mailto:');
                return (
                  <a
                    key={s.name}
                    className="social-btn"
                    href={s.url}
                    target={isMail ? undefined : '_blank'}
                    rel={isMail ? undefined : 'noopener noreferrer'}
                    aria-label={t(`hero.social${s.name}`) || s.name}
                    title={s.name}
                  >
                    <Icon size={18} />
                  </a>
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

        {/* Hero Visual: Interactive Code Window + Floating Tech Badges */}
        <div className="hero-visual" aria-hidden="true">
          <CodeWindow />
          <FloatingTech name="React" icon="react" className="tech-1" delay={0.6} />
          <FloatingTech name="JavaScript" icon="js" className="tech-2" delay={0.75} />
          <FloatingTech name="Vite" icon="vite" className="tech-3" delay={0.9} />
          <FloatingTech name="Redux" icon="redux" className="tech-4" delay={1.05} />
          <FloatingTech name="Git" icon="git" className="tech-5" delay={1.2} />
        </div>
      </div>
    </section>
  );
}
