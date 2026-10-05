import { useEffect, useRef, useState } from 'react';
import { useLocale } from '../context/LocaleContext';
import type { Locale } from '../data/translations';
import { RollingText } from './RollingText';
import '../styles/brand.css';

const sections = ['projects', 'gallery', 'services', 'about', 'contact'];

export function GlobalNav() {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 32);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => {
    if (!open) return;
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
    };
    const outside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    const desktop = window.matchMedia('(min-width: 960px)');
    const resize = () => { if (desktop.matches) setOpen(false); };
    document.addEventListener('keydown', keydown);
    document.addEventListener('pointerdown', outside);
    desktop.addEventListener('change', resize);
    return () => {
      document.removeEventListener('keydown', keydown);
      document.removeEventListener('pointerdown', outside);
      desktop.removeEventListener('change', resize);
    };
  }, [open]);
  return <header ref={header} className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
    <a className="brand" href="#top" aria-label="Camila Lopes"><img src="/logo-camila.svg" alt="Camila Lopes" width="350" height="136" /></a>
    <nav className="desktop-nav" aria-label={t.menu}>{sections.map((section, i) => <a key={section} href={`#${section}`} className="nav-link" aria-label={t.nav[i]}><RollingText text={t.nav[i]} /></a>)}</nav>
    <div className="header-actions">
      <div className="languages" aria-label="Language">{(['pt', 'en', 'es'] as Locale[]).map(lang => <button key={lang} type="button" lang={lang} aria-label={{ pt: 'Português', en: 'English', es: 'Español' }[lang]} aria-pressed={locale === lang} onClick={() => setLocale(lang)}>{lang}</button>)}</div>
      <button ref={toggle} className={`menu-toggle${open ? ' is-open' : ''}`} type="button" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}><span>{open ? t.close : t.menu}</span><span className="menu-icon" aria-hidden="true"><i /><i /></span></button>
    </div>
    <nav id="mobile-navigation" className="mobile-nav" aria-label={t.menu} hidden={!open}>
      {sections.map((section, i) => <a key={section} href={`#${section}`} aria-label={t.nav[i]} onClick={() => setOpen(false)}><span className="micro" aria-hidden="true">0{i + 1}</span><RollingText text={t.nav[i]} /><span aria-hidden="true">↗</span></a>)}
      <p className="micro">{t.based}</p>
    </nav>
  </header>;
}
