import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';
import { profile, navLinks } from '../data/portfolio';
import { useLanguage } from '../i18n/useLanguage';
import { EASE } from '../lib/motion';

const languages = [
  { code: 'uz', flag: '🇺🇿', label: 'UZ — O‘zbekcha' },
  { code: 'ru', flag: '🇷🇺', label: 'RU — Русский' },
  { code: 'en', flag: '🇬🇧', label: 'EN — English' },
];

function scrollToSection(id) {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);

      let current = '';
      const ids = navLinks.map((l) => l.href.slice(1));
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLangDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (href) => {
    setOpen(false);
    requestAnimationFrame(() => scrollToSection(href));
  };

  const activeLangObj = languages.find((l) => l.code === language) || languages[0];

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-inner">
        <a
          href="#top"
          className="logo"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <span className="logo-mark">S</span>
          {profile.name}
        </a>

        <div className="nav-right-actions">
          <nav aria-label="Main navigation">
            <ul className="nav-links">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={active === link.href.slice(1) ? 'active' : ''}
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
          </nav>

          {/* Desktop Language Selector */}
          <div className="lang-selector" ref={dropdownRef}>
            <button
              type="button"
              className="lang-btn"
              onClick={() => setLangDropdown((v) => !v)}
              aria-label={t('nav.selectLang')}
              aria-expanded={langDropdown}
            >
              <span className="lang-flag">{activeLangObj.flag}</span>
              <span>{activeLangObj.code.toUpperCase()}</span>
              <ChevronDown size={14} style={{ transform: langDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            <AnimatePresence>
              {langDropdown && (
                <motion.div
                  className="lang-dropdown"
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      className={`lang-option ${language === lang.code ? 'active' : ''}`}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangDropdown(false);
                      }}
                    >
                      <span className="lang-flag">{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Hamburger button */}
          <button
            type="button"
            className="nav-hamburger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              className="mobile-menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.35, delay: 0.05 * i, ease: EASE }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(link.href);
                  }}
                >
                  {t(`nav.${link.key}`)}
                </motion.a>
              ))}

              <motion.button
                type="button"
                className="btn btn-primary"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, delay: 0.05 * navLinks.length, ease: EASE }}
                onClick={() => handleNav('#contact')}
              >
                {t('nav.contactBtn')}
              </motion.button>

              {/* Mobile Language Selector */}
              <motion.div
                className="mobile-lang-group"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, delay: 0.05 * (navLinks.length + 1), ease: EASE }}
              >
                {languages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    className={`mobile-lang-btn ${language === l.code ? 'active' : ''}`}
                    onClick={() => {
                      setLanguage(l.code);
                      setOpen(false);
                    }}
                  >
                    {l.flag} {l.code.toUpperCase()}
                  </button>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}