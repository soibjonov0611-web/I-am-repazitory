import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'framer-motion';
import { stats } from '../data/portfolio';
import { useLanguage } from '../i18n/useLanguage';
import { getIcon } from '../lib/icons';
import { staggerContainer, scaleIn, viewportOnce, EASE } from '../lib/motion';
import SectionHeading from './SectionHeading';

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="stat-number">
      {display}
      <span className="suffix">{suffix}</span>
    </span>
  );
}

export default function Experience() {
  const { t } = useLanguage();

  return (
    <section className="experience" id="experience">
      <div className="container">
        <SectionHeading
          eyebrow={t('experience.eyebrow')}
          title={
            <>
              {t('experience.titleStart')}{' '}
              <span className="gradient-text">{t('experience.titleEnd')}</span>
            </>
          }
          subtitle={t('experience.subtitle')}
        />

        <motion.div
          className="stats-grid"
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {stats.map((stat) => {
            const Icon = getIcon(stat.icon);
            const labelText = t(stat.keyLabel);

            return (
              <motion.div className="stat-card" key={stat.id} variants={scaleIn()}>
                <div className="stat-icon">
                  <Icon size={22} />
                </div>
                <Counter value={stat.value} suffix={stat.suffix} />
                <p className="stat-label">{labelText}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}