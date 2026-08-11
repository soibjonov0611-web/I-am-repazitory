import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/useLanguage';
import { getIcon } from '../lib/icons';
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion';

export default function About() {
  const { t } = useLanguage();

  const highlights = [
    {
      title: t('about.highlight1Title'),
      text: t('about.highlight1Text'),
      icon: 'sparkles',
    },
    {
      title: t('about.highlight2Title'),
      text: t('about.highlight2Text'),
      icon: 'zap',
    },
    {
      title: t('about.highlight3Title'),
      text: t('about.highlight3Text'),
      icon: 'code',
    },
  ];

  return (
    <section className="about" id="about">
      <div className="container about-grid">
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
            <p className="about-quote">{t('about.quote')}</p>
            <div className="about-tags">
              <span className="tag">{t('about.tagUi')}</span>
              <span className="tag">{t('about.tagA11y')}</span>
              <span className="tag">{t('about.tagPerf')}</span>
              <span className="tag">{t('about.tagAnim')}</span>
            </div>
            <p className="about-support">{t('about.codeSupport')}</p>
          </div>
        </motion.div>

        <motion.div
          className="about-copy"
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.p variants={fadeUp()}>
            <strong>{t('about.intro')}</strong>
          </motion.p>
          <motion.p variants={fadeUp()}>{t('about.approach')}</motion.p>
          <motion.p variants={fadeUp()}>{t('about.why')}</motion.p>

          <motion.div className="about-highlights" variants={fadeUp()}>
            {highlights.map((h) => {
              const Icon = getIcon(h.icon);
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