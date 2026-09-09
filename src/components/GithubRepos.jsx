import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, ExternalLink, Code2, FolderGit2 } from 'lucide-react';
import { profile, fallbackGithubRepos } from '../data/portfolio';
import { useLanguage } from '../i18n/useLanguage';
import { GithubIcon } from '../lib/brandIcons';
import { staggerContainer, scaleIn, viewportOnce } from '../lib/motion';
import SectionHeading from './SectionHeading';

const GITHUB_API_URL = `https://api.github.com/users/${profile.githubUsername}/repos?sort=updated&per_page=6`;

export default function GithubRepos() {
  const { t } = useLanguage();
  const [repos, setRepos] = useState(fallbackGithubRepos);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchRepos() {
      try {
        const res = await fetch(GITHUB_API_URL);
        if (!res.ok) {
          // Rate-limited or error, gracefully stick to fallback
          if (isMounted) {
            setIsLive(false);
            
          }
          return;
        }
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0 && isMounted) {
          // Filter out forks if desired, or take top 4-6
          const filtered = data
            .filter((repo) => !repo.fork)
            .slice(0, 6)
            .map((repo) => ({
              id: repo.id,
              name: repo.name,
              description: repo.description || 'Public repository by ' + profile.name,
              html_url: repo.html_url,
              stargazers_count: repo.stargazers_count,
              forks_count: repo.forks_count,
              language: repo.language || 'JavaScript',
              updated_at: repo.updated_at,
            }));

          if (filtered.length > 0) {
            setRepos(filtered);
            setIsLive(true);
          }
        }
      } catch {
        // Network offline or blocked, fallback is safe
        if (isMounted) setIsLive(false);
      } 
    }

    fetchRepos();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="github-section" id="github">
      <div className="container">
        <div className="github-header-wrap">
          <SectionHeading
            eyebrow={t('github.eyebrow')}
            title={
              <>
                {t('github.titleStart')}{' '}
                <span className="gradient-text">{t('github.titleEnd')}</span>
              </>
            }
            subtitle={t('github.subtitle')}
          />
          <div className="github-status-pill">
            <span className={`live-indicator ${isLive ? 'online' : 'offline'}`} />
            <span>{isLive ? t('github.liveStatus') : t('github.offlineStatus')}</span>
          </div>
        </div>

        <motion.div
          className="github-grid"
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {repos.map((repo) => (
            <motion.a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="github-card"
              variants={scaleIn()}
            >
              <div className="github-card-top">
                <div className="github-card-title-group">
                  <FolderGit2 size={18} className="github-folder-icon" />
                  <h3 className="github-repo-name">{repo.name}</h3>
                </div>
                <ExternalLink size={16} className="github-external-icon" />
              </div>

              <p className="github-repo-desc">{repo.description}</p>

              <div className="github-card-footer">
                <div className="github-card-meta">
                  {repo.language && (
                    <span className="github-lang">
                      <span className="github-lang-dot" />
                      {repo.language}
                    </span>
                  )}
                  <span className="github-stat">
                    <Star size={14} />
                    {repo.stargazers_count}
                  </span>
                  <span className="github-stat">
                    <GitFork size={14} />
                    {repo.forks_count}
                  </span>
                </div>
                <span className="github-view-tag">
                  <Code2 size={13} />
                  Code
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>

        <div className="github-footer-cta">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost github-profile-btn"
          >
            <GithubIcon size={18} />
            {t('github.visitProfile')} ({profile.githubUsername})
            <ExternalLink size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}
