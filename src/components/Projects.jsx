import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, ExternalLink, Info, Search, X } from 'lucide-react';
import { projects, projectCategories } from '../data/portfolio';
import { useLanguage } from '../i18n/useLanguage';
import { GithubIcon } from '../lib/brandIcons';
import { staggerContainer, scaleIn, EASE } from '../lib/motion';
import SectionHeading from './SectionHeading';
import TiltCard from './TiltCard';
import Magnetic from './Magnetic';

function BrowserHeader({ path }) {
  return (
    <div className="preview-browser-header">
      <div className="preview-dots">
        <span className="dot dot-red" />
        <span className="dot dot-yellow" />
        <span className="dot dot-green" />
      </div>
      <div className="preview-url-bar">
        <span className="preview-url-proto">https://</span>
        <span className="preview-url-path">{path}</span>
      </div>
      <div className="preview-status-pill">
        <span className="preview-pulse-dot" />
        <span>LIVE</span>
      </div>
    </div>
  );
}

function MiniChart() {
  const bars = [38, 62, 48, 80, 58, 92, 70];
  return (
    <div className="preview-mockup preview-mockup-chart">
      <div className="chart-bars-wrap">
        {bars.map((h, i) => (
          <div
            key={i}
            className="chart-bar"
            style={{
              height: h + '%',
              background: 'linear-gradient(180deg, var(--c2), color-mix(in srgb, var(--c1) 70%, transparent))',
            }}
          />
        ))}
      </div>
      <div className="chart-hud-overlay">
        <div className="hud-metric">
          <span className="hud-label">TPS RATE</span>
          <span className="hud-val">99.8%</span>
        </div>
        <div className="hud-metric">
          <span className="hud-label">LATENCY</span>
          <span className="hud-val">12ms</span>
        </div>
      </div>
    </div>
  );
}

function MiniStore() {
  return (
    <div className="preview-mockup preview-mockup-store">
      <div className="store-header-bar" />
      <div className="store-grid">
        <div className="store-card store-card-feature" />
        <div className="store-col">
          <div className="store-line store-line-lg" />
          <div className="store-line store-line-md" />
          <div className="store-line store-line-sm" />
        </div>
      </div>
      <div className="store-footer-bar">
        <span className="store-badge">ZUSTAND STORE</span>
        <span className="store-price">$129.00</span>
      </div>
    </div>
  );
}

function MiniUI() {
  return (
    <div className="preview-mockup preview-mockup-ui">
      <div className="ui-header-line" />
      <div className="ui-component-preview">
        <div className="ui-badge-pill">Framer Motion</div>
        <div className="ui-interactive-btn">Interactive Component →</div>
      </div>
      <div className="ui-sliders-wrap">
        <div className="ui-slider-track"><span className="ui-slider-thumb" /></div>
        <div className="ui-slider-track track-2"><span className="ui-slider-thumb" /></div>
      </div>
    </div>
  );
}

function MiniMap() {
  const points = [
    { top: '20%', left: '20%' },
    { top: '56%', left: '32%' },
    { top: '34%', left: '60%' },
    { top: '66%', left: '72%' },
  ];
  return (
    <div className="preview-mockup preview-mockup-map">
      {points.map((p, i) => (
        <div
          key={i}
          className="map-node"
          style={{ position: 'absolute', ...p }}
        />
      ))}
      <svg
        viewBox="0 0 100 100"
        className="map-svg-line"
        preserveAspectRatio="none"
      >
        <polyline
          points="20,26 34,58 62,40 72,70"
          fill="none"
          stroke="url(#route)"
          strokeWidth="1.6"
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
      <div className="map-hud-badge">GEO ROUTING // ACTIVE</div>
    </div>
  );
}

function ProjectPreview({ pattern, id }) {
  const paths = {
    p1: 'saipov.dev/analytics',
    p2: 'saipov.dev/ecommerce',
    p3: 'saipov.dev/ui-system',
    p4: 'saipov.dev/geo-routes',
  };

  return (
    <div className="project-preview" aria-hidden="true">
      <BrowserHeader path={paths[id] || 'saipov.dev/project'} />
      <div className="preview-grid" />
      <div className="preview-stage">
        {pattern === 'chart' && <MiniChart />}
        {pattern === 'cart' && <MiniStore />}
        {pattern === 'ui' && <MiniUI />}
        {pattern === 'map' && <MiniMap />}
      </div>
      <div className="preview-glow-edge" />
    </div>
  );
}

export default function Projects() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setSelectedProject(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedProject]);

  const filteredProjects = projects.filter((project) => {
    const matchesCat = activeCategory === 'all' || project.category === activeCategory;
    const name = t('projects.' + project.id + 'Name').toLowerCase();
    const desc = t('projects.' + project.id + 'Desc').toLowerCase();
    const tech = project.technologies.join(' ').toLowerCase();
    const q = searchQuery.toLowerCase().trim();

    const matchesSearch = !q || name.includes(q) || desc.includes(q) || tech.includes(q);
    return matchesCat && matchesSearch;
  });

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

        {/* Filter & Search Bar Controls */}
        <div className="projects-controls">
          <div className="projects-tabs">
            {projectCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={'projects-tab-btn ' + (activeCategory === cat.id ? 'active' : '')}
                onClick={() => setActiveCategory(cat.id)}
              >
                {t(cat.key)}
              </button>
            ))}
          </div>

          <div className="projects-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder={t('projects.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="projects-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="search-clear-btn"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        <motion.div
          key={activeCategory + searchQuery}
          className="projects-grid"
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate="visible"
        >
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => {
              const name = t('projects.' + project.id + 'Name');
              const desc = t('projects.' + project.id + 'Desc');

              return (
                <TiltCard key={project.id} maxTilt={6} style={{ height: '100%' }}>
                  <motion.article
                    className="project-card"
                    variants={scaleIn()}
                    style={{ '--c1': project.accent[0], '--c2': project.accent[1], height: '100%' }}
                  >
                    <ProjectPreview pattern={project.pattern} id={project.id} />

                    <div className="project-body">
                      <div className="project-title-row">
                        <h3>{name}</h3>
                        {project.featured && <span className="featured-badge">Featured</span>}
                      </div>

                      <p>{desc}</p>

                      <div className="project-tech">
                        {project.technologies.map((tech) => (
                          <span className="tag" key={tech}>
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Project Actions: BOTH GitHub & Live Demo & Details */}
                      <div className="project-actions">
                        <Magnetic strength={0.2}>
                          <a
                            className="btn btn-primary"
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={'Open ' + name + ' live demo'}
                          >
                            <ArrowUpRight size={16} /> {t('projects.demo')}
                          </a>
                        </Magnetic>

                        <Magnetic strength={0.2}>
                          <a
                            className="btn btn-ghost"
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={'View ' + name + ' source code on GitHub'}
                          >
                            <GithubIcon size={16} /> {t('projects.github')}
                          </a>
                        </Magnetic>

                        <Magnetic strength={0.15}>
                          <button
                            type="button"
                            className="btn btn-details-icon"
                            onClick={() => setSelectedProject(project)}
                            aria-label={t('projects.viewDetails')}
                            title={t('projects.viewDetails')}
                          >
                            <Info size={16} />
                          </button>
                        </Magnetic>
                      </div>
                    </div>
                  </motion.article>
                </TiltCard>
              );
            })
          ) : (
            <div className="projects-empty-state">
              <p>{t('projects.noResults')}</p>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Interactive Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div
            className="modal-backdrop"
            onClick={() => setSelectedProject(null)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              className="project-modal"
              style={{
                '--c1': selectedProject.accent[0],
                '--c2': selectedProject.accent[1],
              }}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedProject(null)}
                aria-label={t('projects.modalClose')}
              >
                <X size={18} />
              </button>

              <div className="modal-header-preview">
                <ProjectPreview pattern={selectedProject.pattern} id={selectedProject.id} />
              </div>

              <div className="modal-content">
                <div className="modal-title-row">
                  <h3 className="modal-title">
                    {t('projects.' + selectedProject.id + 'Name')}
                  </h3>
                  <span className="modal-status-badge">
                    <CheckCircle2 size={13} />
                    {t('projects.statusCompleted')}
                  </span>
                </div>

                <p className="modal-description">
                  {t('projects.' + selectedProject.id + 'Desc')}
                </p>

                <div className="modal-tech-section">
                  <span className="modal-tech-label">{t('projects.techStack')}</span>
                  <div className="modal-tech-tags">
                    {selectedProject.technologies.map((tech) => (
                      <span className="tag" key={tech}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="modal-actions">
                  <a
                    href={selectedProject.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    <ArrowUpRight size={17} />
                    {t('projects.demo')}
                  </a>
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost"
                  >
                    <GithubIcon size={17} />
                    {t('projects.github')}
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}