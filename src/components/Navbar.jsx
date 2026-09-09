import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, Moon, Sun, X } from 'lucide-react';
import { profile, navLinks } from '../data/portfolio';
import { useLanguage } from '../i18n/useLanguage';
import { useTheme } from '../context/useTheme';
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
  const { theme, toggleTheme, isDark } = useTheme();
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
        if (el && el.getBoundingClientRect().top <= 160) current = id;
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
          <span className="logo-mark">&lt;/&gt;</span>
          <span className="logo-text">
            {profile.firstName}
            <span className="logo-dot">.dev</span>
          </span>
        </a>

        <div className="nav-right-actions">
          <nav aria-label="Main navigation" className="desktop-nav">
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

          {/* Theme Toggle Button */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={t('nav.toggleTheme')}
            title={t('nav.toggleTheme')}
          >
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {isDark ? <Sun size={18} className="theme-icon sun" /> : <Moon size={18} className="theme-icon moon" />}
            </motion.div>
          </button>

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
              <ChevronDown
                size={14}
                style={{
                  transform: langDropdown ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }}
              />
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

          {/* Hamburger button for Mobile */}
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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className={active === link.href.slice(1) ? 'active' : ''}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.3, delay: 0.04 * i, ease: EASE }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(link.href);
                  }}
                >
                  {t(`nav.${link.key}`)}
                </motion.a>
              ))}

              <div className="mobile-controls-row">
                {/* Mobile Theme Toggle */}
                <button
                  type="button"
                  className="mobile-theme-btn"
                  onClick={toggleTheme}
                  aria-label={t('nav.toggleTheme')}
                >
                  {isDark ? <Sun size={17} /> : <Moon size={17} />}
                  <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
                </button>

                {/* Mobile Language Selector */}
                <div className="mobile-lang-group">
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
                </div>
              </div>

              <motion.button
                type="button"
                className="btn btn-primary mobile-cta-btn"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.04 * (navLinks.length + 1), ease: EASE }}
                onClick={() => handleNav('#contact')}
              >
                {t('nav.contactBtn')}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
