import { useEffect, useState } from 'react';
import { LanguageContext } from './LanguageContext';
import { translations } from './translations';

const STORAGE_KEY = 'portfolio_language';
const DEFAULT_LANG = 'uz';

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && translations[saved]) {
        return saved;
      }
    } catch (e) {
      console.warn('Unable to access localStorage for language:', e);
    }
    return DEFAULT_LANG;
  });

  const setLanguage = (lang) => {
    if (!translations[lang]) return;
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Unable to save language to localStorage:', e);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (path) => {
    const keys = path.split('.');
    let current = translations[language] || translations[DEFAULT_LANG];
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        let fallback = translations.en;
        for (const k of keys) {
          if (fallback && fallback[k] !== undefined) {
            fallback = fallback[k];
          } else {
            return path;
          }
        }
        return fallback;
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
