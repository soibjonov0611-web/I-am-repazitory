import { ArrowUp } from 'lucide-react';
import { profile } from '../data/portfolio';
import { useLanguage } from '../i18n/useLanguage';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>
          © 2026 <strong>{profile.name}</strong>. {t('footer.rights')}
        </p>
        <button
          type="button"
          className="back-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={t('footer.backToTop')}
        >
          {t('footer.backToTop')} <ArrowUp size={15} />
        </button>
      </div>
    </footer>
  );
}