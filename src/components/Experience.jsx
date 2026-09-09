import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { stats, journeyTimeline } from '../data/portfolio';
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
    <section className="experience" id="journey">
      <div className="container">
        {/* Section 1: Stats Counters */}
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
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {stats.map((stat) => {
            const Icon = getIcon(stat.icon);
            const labelText = t(stat.keyLabel);

            return (
              <motion.div
                className="stat-card"
                key={stat.id}
                variants={scaleIn()}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className="stat-icon">
                  <Icon size={22} />
                </div>
                <Counter value={stat.value} suffix={stat.suffix} />
                <p className="stat-label">{labelText}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Section 2: Programming Journey Timeline */}
        <div className="journey-wrap">
          <div className="journey-heading-wrap">
            <span className="eyebrow">{t('journey.eyebrow')}</span>
            <h3 className="journey-title">
              {t('journey.titleStart')}{' '}
              <span className="gradient-text">{t('journey.titleEnd')}</span>
            </h3>
            <p className="journey-subtitle">{t('journey.subtitle')}</p>
          </div>

          <div className="timeline-container">
            <div className="timeline-track" aria-hidden="true" />

            {journeyTimeline.map((item, index) => {
              const Icon = getIcon(item.icon);
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={item.id}
                  className={`timeline-item ${isEven ? 'left' : 'right'}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: EASE }}
                >
                  <div className="timeline-node">
                    <Icon size={16} />
                  </div>

                  <div className="timeline-card">
                    <div className="timeline-year-badge">
                      <Calendar size={13} />
                      <span>{item.year}</span>
                    </div>

                    <h4 className="timeline-step-title">{t(item.titleKey)}</h4>
                    <p className="timeline-step-desc">{t(item.descKey)}</p>

                    <div className="timeline-tech-tags">
                      {item.tech.map((tItem) => (
                        <span key={tItem} className="tag tag-sm">
                          {tItem}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
