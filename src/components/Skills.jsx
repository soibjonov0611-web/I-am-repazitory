import { motion } from 'framer-motion';
import { skills } from '../data/portfolio';
import { useLanguage } from '../i18n/useLanguage';
import { getIcon } from '../lib/icons';
import { staggerContainer, scaleIn, viewportOnce, EASE } from '../lib/motion';
import SectionHeading from './SectionHeading';

export default function Skills() {
  const { t } = useLanguage();

  return (
    <section className="skills" id="skills">
      <div className="container">
        <SectionHeading
          eyebrow={t('skills.eyebrow')}
          title={
            <>
              {t('skills.titleStart')}{' '}
              <span className="gradient-text">{t('skills.titleEnd')}</span>
            </>
          }
          subtitle={t('skills.subtitle')}
        />

        <motion.div
          className="skills-grid"
          variants={staggerContainer(0.06)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {skills.map((skill) => {
            const Icon = getIcon(skill.icon);
            return (
              <motion.div className="skill-card" key={skill.name} variants={scaleIn()}>
                <div className="skill-top">
                  <span className="skill-icon">
                    <Icon size={21} />
                  </span>
                  <span className="skill-level">{skill.level}%</span>
                </div>
                <h3 className="skill-name">{skill.name}</h3>
                <div className="skill-bar" role="presentation">
                  <motion.div
                    className="skill-bar-fill"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2, ease: EASE }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}