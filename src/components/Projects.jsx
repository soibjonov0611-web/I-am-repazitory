import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '../data/portfolio';
import { useLanguage } from '../i18n/useLanguage';
import { GithubIcon } from '../lib/brandIcons';
import { staggerContainer, scaleIn, viewportOnce } from '../lib/motion';
import SectionHeading from './SectionHeading';

function MiniChart() {
  const bars = [38, 62, 48, 80, 58, 92, 70];
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 8,
        height: 130,
        width: '76%',
      }}
    >
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${h}%`,
            minWidth: 8,
            borderRadius: 6,
            background: `linear-gradient(180deg, var(--c2), color-mix(in srgb, var(--c1) 70%, transparent))`,
            opacity: 0.85 + (i % 3) * 0.05,
          }}
        />
      ))}
    </div>
  );
}

function MiniStore() {
  return (
    <div className="preview-phone">
      <div className="preview-dots">
        <span />
        <span />
        <span />
      </div>
      <div className="preview-bar" style={{ height: 18, opacity: 0.7 }} />
      <div style={{ display: 'flex', gap: 8 }}>
        <div className="preview-block" style={{ flex: 1, height: 46, borderRadius: 8, background: `linear-gradient(135deg, var(--c1), var(--c2))`, opacity: 0.8 }} />
        <div style={{ flex: 1.4, display: 'grid', gap: 6, alignContent: 'center' }}>
          <div className="preview-block wide" />
          <div className="preview-block mid" />
          <div className="preview-block" style={{ width: '40%', background: `linear-gradient(90deg, var(--c1), var(--c2))`, opacity: 0.8 }} />
        </div>
      </div>
      <div className="preview-line">
        <div className="preview-block" />
        <div className="preview-block" style={{ width: 30, background: `linear-gradient(90deg, var(--c1), var(--c2))`, opacity: 0.85 }} />
      </div>
      <div className="preview-line">
        <div className="preview-block" />
        <div className="preview-block" style={{ width: 30, background: `linear-gradient(90deg, var(--c1), var(--c2))`, opacity: 0.85 }} />
      </div>
    </div>
  );
}

function MiniUI() {
  return (
    <div className="preview-phone" style={{ width: '62%', maxWidth: 260 }}>
      <div className="preview-bar" style={{ height: 20 }} />
      <div className="preview-block mid" />
      <div
        style={{
          height: 34,
          borderRadius: 8,
          background: 'transparent',
          border: '1.5px solid color-mix(in srgb, var(--c1) 60%, transparent)',
        }}
      />
      <div
        style={{
          height: 34,
          borderRadius: 8,
          display: 'grid',
          placeItems: 'center',
          background: `linear-gradient(90deg, var(--c1), var(--c2))`,
          fontSize: 10,
          fontWeight: 700,
          color: '#fff',
          fontFamily: 'var(--font-mono)',
        }}
      >
        Notify →
      </div>
      <div className="preview-line">
        <div className="preview-block" />
        <div className="preview-block" style={{ width: 44 }} />
        <div className="preview-block" style={{ width: 26 }} />
      </div>
    </div>
  );
}

function MiniMap() {
  const points = [
    { top: '18%', left: '18%' },
    { top: '58%', left: '30%' },
    { top: '34%', left: '62%' },
    { top: '68%', left: '70%' },
  ];
  return (
    <div
      style={{
        width: '72%',
        aspectRatio: '1.4',
        borderRadius: 12,
        border: '1px solid var(--border-strong)',
        background:
          'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0 10px, transparent 10px 20px)',
        position: 'relative',
      }}
    >
      {points.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            ...p,
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: `linear-gradient(135deg, var(--c1), var(--c2))`,
            boxShadow: '0 0 14px rgba(99,102,241,0.6)',
          }}
        />
      ))}
      <svg
        viewBox="0 0 100 100"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        preserveAspectRatio="none"
      >
        <polyline
          points="20,26 34,58 62,40 72,70"
          fill="none"
          stroke="url(#route)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          vectorEffect="non-scaling-stroke"
        />
        <defs>
          <linearGradient id="route" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--c1)" />
            <stop offset="100%" stopColor="var(--c2)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function ProjectPreview({ pattern }) {
  return (
    <div className="project-preview" aria-hidden="true">
      <div className="preview-grid" />
      <div className="preview-stage">
        {pattern === 'chart' && <MiniChart />}
        {pattern === 'cart' && <MiniStore />}
        {pattern === 'ui' && <MiniUI />}
        {pattern === 'map' && <MiniMap />}
      </div>
    </div>
  );
}

export default function Projects() {
  const { t } = useLanguage();

  return (
    <section className="projects" id="projects">
      <div className="container">
        <SectionHeading
          eyebrow={t('projects.eyebrow')}
          title={
            <>
              {t('projects.titleStart')}{' '}
              <span className="gradient-text">{t('projects.titleEnd')}</span>
            </>
          }
          subtitle={t('projects.subtitle')}
        />

        <motion.div
          className="projects-grid"
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {projects.map((project) => {
            const name = t(`projects.${project.id}Name`);
            const desc = t(`projects.${project.id}Desc`);

            return (
              <motion.article
                className="project-card"
                key={project.id}
                variants={scaleIn()}
                style={{ '--c1': project.accent[0], '--c2': project.accent[1] }}
              >
                <ProjectPreview pattern={project.pattern} />

                <div className="project-body">
                  <h3>{name}</h3>
                  <p>{desc}</p>

                  <div className="project-tech">
                    {project.technologies.map((tech) => (
                      <span className="tag" key={tech}>
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="project-actions">
                    <a
                      className="btn btn-ghost"
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${name} source code on GitHub`}
                    >
                      <GithubIcon size={16} /> {t('projects.github')}
                    </a>
                    <a
                      className="btn btn-primary"
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${name} live demo`}
                    >
                      <ArrowUpRight size={16} /> {t('projects.demo')}
                    </a>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}