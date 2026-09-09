import { ArrowUp } from 'lucide-react';
import { profile, socials, navLinks } from '../data/portfolio';
import { useLanguage } from '../i18n/useLanguage';
import { getIcon } from '../lib/icons';

function scrollToSection(id) {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container footer-content-wrap">
        <div className="footer-top-row">
          <div className="footer-brand">
            <a
              href="#top"
              className="logo"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <span className="logo-mark">&lt;/&gt;</span>
              <span className="logo-text">
                {profile.name}
              </span>
            </a>
            <p className="footer-tagline">{t('footer.roleText')}</p>
          </div>

          <div className="footer-links-group">
            <span className="footer-group-title">{t('footer.quickLinks')}</span>
            <ul className="footer-nav-list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                  >
                    {t(`nav.${link.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-links-group">
            <span className="footer-group-title">{t('footer.socials')}</span>
            <div className="footer-social-row">
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
                    aria-label={s.name}
                    title={s.name}
                  >
                    <Icon size={17} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="footer-bottom-row">
          <p className="footer-copyright">
            © {new Date().getFullYear()} <strong>{profile.name}</strong>. {t('footer.rights')}
          </p>

          <button
            type="button"
            className="back-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label={t('footer.backToTop')}
          >
            <span>{t('footer.backToTop')}</span>
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
}
