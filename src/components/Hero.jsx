import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
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
      initial={{ opacity: 0, y: 40, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
    >
      <div className="code-topbar">
        <span className="circle circle-red" />
        <span className="circle circle-yellow" />
        <span className="circle circle-green" />
        <span className="code-title">developer.js</span>
      </div>
      <div className="code-body">
        <pre>
          <span className="tkn-com">{t('hero.codeComment')}</span>{'\n'}
          <span className="tkn-key">const</span> <span className="tkn-var">developer</span> <span className="tkn-punc">=</span> <span className="tkn-key">new</span> <span className="tkn-var">Frontend</span>({'\n'}
          {'  '}<span className="tkn-prop">name</span><span className="tkn-punc">:</span> <span className="tkn-str">'{profile.name}'</span>,<span className="tkn-com"></span>{'\n'}
          {'  '}<span className="tkn-prop">stack</span><span className="tkn-punc">:</span> [<span className="tkn-str">'React'</span>, <span className="tkn-str">'Vite'</span>, <span className="tkn-str">'Redux'</span>],{'\n'}
          {'  '}<span className="tkn-prop">focus</span><span className="tkn-punc">:</span> <span className="tkn-str">'{t('hero.codeFocus')}'</span>,{'\n'}
          {'  '}<span className="tkn-prop">ship</span><span className="tkn-punc">()</span> <span className="tkn-fn">=&gt;</span> <span className="tkn-str">'production-ready.com'</span>{'\n'}
          <span className="tkn-punc">{'}'}</span>
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
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 5, delay: delay * 2, ease: 'easeInOut' }}
        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
      >
        <Icon size={15} />
        {name}
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
          animate={{ opacity: [0.4, 0.6, 0.4], x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 14, ease: 'easeInOut' }}
        />
        <motion.div
          className="hero-glow glow-2"
          animate={{ opacity: [0.35, 0.5, 0.35], x: [0, -24, 0] }}
          transition={{ repeat: Infinity, duration: 16, ease: 'easeInOut' }}
        />
        <div className="hero-glow glow-3" />
      </div>

      <div className="container hero-inner">
        <motion.div
          className="hero-content"
          variants={staggerContainer(0.09, 0.15)}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp()}>
            <span className="hero-badge">
              <span className="dot" />
              {t('hero.badge')}
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp()}>
            {t('hero.titleStart')}{' '}
            <span className="gradient-text">{t('hero.titleEnd')}</span>
          </motion.h1>

          <motion.p className="lead" variants={fadeUp()}>
            {t('hero.description')}
          </motion.p>

          <motion.div className="hero-cta" variants={fadeUp()}>
            <button type="button" className="btn btn-primary" onClick={() => scrollTo('#projects')}>
              {t('hero.viewWork')} <ArrowRight size={17} />
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => scrollTo('#contact')}>
              {t('hero.contactMe')}
            </button>
          </motion.div>

          <motion.div className="hero-socials" variants={fadeUp()}>
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
                >
                  <Icon size={19} />
                </a>
              );
            })}
          </motion.div>
        </motion.div>

        <div className="hero-visual" aria-hidden="true">
          <CodeWindow />
          <FloatingTech name="React" icon="react" className="tech-1" delay={1.0} />
          <FloatingTech name="Vite" icon="vite" className="tech-2" delay={1.15} />
          <FloatingTech name="JS" icon="js" className="tech-3" delay={1.3} />
          <FloatingTech name="Redux" icon="redux" className="tech-4" delay={1.45} />
        </div>
      </div>
    </section>
  );
}