import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { translations, type Locale } from '../data/translations';

const LocaleContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void; t: typeof translations[Locale] } | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    try {
      const saved = localStorage.getItem('camilaPortfolioLang');
      return saved === 'en' || saved === 'es' ? saved : 'pt';
    } catch { return 'pt'; }
  });
  const t = translations[locale];
  useEffect(() => {
    document.documentElement.lang = t.lang;
    document.title = t.pageTitle;
    try { localStorage.setItem('camilaPortfolioLang', locale); } catch { /* Private browsing still works. */ }
  }, [locale, t]);
  return <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('LocaleProvider is required.');
  return context;
}
