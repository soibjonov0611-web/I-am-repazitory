import { motion } from 'framer-motion';
import { Sparkles, Zap, Code2 } from 'lucide-react';
import { profile } from '../data/portfolio';
import { useLanguage } from '../i18n/useLanguage';
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion';

export default function About() {
  const { t } = useLanguage();

  const highlights = [
    {
      title: t('about.highlight1Title'),
      text: t('about.highlight1Text'),
      icon: Sparkles,
    },
    {
      title: t('about.highlight2Title'),
      text: t('about.highlight2Text'),
      icon: Zap,
    },
    {
      title: t('about.highlight3Title'),
      text: t('about.highlight3Text'),
      icon: Code2,
    },
  ];

  return (
    <section className="about" id="about">
      <div className="container about-grid">
        {/* Left Sticky Column */}
        <motion.div
          className="about-sticky"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp()}
        >
          <span className="eyebrow">{t('about.eyebrow')}</span>
          <h2 className="section-title">
            {t('about.titleStart')}{' '}
            <span className="gradient-text">{t('about.titleEnd')}</span>
          </h2>

          <div className="about-card">
            <div className="about-author-header">
              <div className="about-author-avatar">
                <span>SA</span>
              </div>
              <div>
                <h3 className="about-author-name">{profile.name}</h3>
                <p className="about-author-role">{profile.role}</p>
              </div>
            </div>

            <p className="about-quote">{t('about.quote')}</p>

            <div className="about-tags">
              <span className="tag">{t('about.tagUi')}</span>
              <span className="tag">{t('about.tagA11y')}</span>
              <span className="tag">{t('about.tagPerf')}</span>
              <span className="tag">{t('about.tagAnim')}</span>
            </div>

            <div className="about-terminal-box">
              <div className="term-dots">
                <span />
                <span />
                <span />
              </div>
              <code>{t('about.codeSupport')}</code>
            </div>
          </div>
        </motion.div>

        {/* Right Story Column */}
        <motion.div
          className="about-copy"
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div className="about-intro-block" variants={fadeUp()}>
            <p className="about-lead">
              <strong>{t('about.intro')}</strong>
            </p>
            <p>{t('about.approach')}</p>
            <p>{t('about.why')}</p>
          </motion.div>

          <motion.div className="about-highlights" variants={fadeUp()}>
            {highlights.map((h) => {
              const Icon = h.icon;
              return (
                <div className="highlight-item" key={h.title}>
                  <div className="highlight-icon">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4>{h.title}</h4>
                    <p>{h.text}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
