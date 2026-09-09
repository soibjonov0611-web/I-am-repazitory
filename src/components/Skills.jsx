import { useState } from 'react';
import { motion } from 'framer-motion';
import { skills, skillCategories } from '../data/portfolio';
import { useLanguage } from '../i18n/useLanguage';
import { getIcon } from '../lib/icons';
import { staggerContainer, scaleIn, EASE } from '../lib/motion';
import SectionHeading from './SectionHeading';

export default function Skills() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredSkills = skills.filter((s) => {
    if (activeCategory === 'all') return true;
    return s.category === activeCategory;
  });

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

        {/* Category Tabs */}
        <div className="skills-tabs">
          {skillCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`skills-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {t(cat.key)}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <motion.div
          key={activeCategory}
          className="skills-grid"
          variants={staggerContainer(0.05)}
          initial="hidden"
          animate="visible"
        >
          {filteredSkills.map((skill) => {
            const Icon = getIcon(skill.icon);
            return (
              <motion.div
                className={`skill-card ${skill.highlight ? 'skill-highlight' : ''}`}
                key={skill.name}
                variants={scaleIn()}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className="skill-top">
                  <span className="skill-icon">
                    <Icon size={22} />
                  </span>
                  <span className="skill-level">{skill.level}%</span>
                </div>

                <div className="skill-info">
                  <h3 className="skill-name">{skill.name}</h3>
                  <span className="skill-cat-tag">
                    {skill.category === 'frontend' ? 'Frontend' : 'Tools & Workflow'}
                  </span>
                </div>

                <div className="skill-bar" role="presentation">
                  <motion.div
                    className="skill-bar-fill"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
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
