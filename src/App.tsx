import { useCallback, useEffect, useRef, useState } from 'react';
import { Preloader } from './components/Preloader';
import { GlobalNav } from './components/GlobalNav';
import { HeroProjects } from './components/HeroProjects';
import { Projects } from './components/Projects';
import { Services } from './components/Services';
import { Gallery } from './components/Gallery';
import { AboutMe } from './components/AboutMe';
import { LetsWork } from './components/LetsWork';
import { usePortfolioAnimations } from './hooks/usePortfolioAnimations';
import { useHeroEntrance } from './hooks/useHeroEntrance';
import { useMotionPreference } from './hooks/useMotionPreference';
import { LocaleProvider, useLocale } from './context/LocaleContext';
import { ProjectDialog } from './components/ProjectDialog';
import type { PortfolioProject } from './data/projects';

function Portfolio() {
  const scope = useRef<HTMLDivElement>(null);
  const { t, locale } = useLocale();
  const { reduced, choose } = useMotionPreference();
  const [selected, setSelected] = useState<PortfolioProject | null>(null);
  const [videoPaused, setVideoPaused] = useState(false);
  const [loading, setLoading] = useState(() => !reduced);
  const busy = loading && !reduced;
  const initialAnchorHandled = useRef(false);
  const replaying = useRef(false);
  const finishLoading = useCallback(() => setLoading(false), []);
  usePortfolioAnimations(scope, locale, !busy, reduced);
  useHeroEntrance(scope, !busy, reduced, locale);

  useEffect(() => { if (reduced) setLoading(false); }, [reduced]);

  const enableOpening = () => {
    replaying.current = true;
    choose('full');
    window.scrollTo({ top: 0, behavior: 'instant' });
    setLoading(true);
  };
  const toggleMotion = () => choose(reduced ? 'full' : 'reduce');

  // Browsers skip fragment destinations while their content is inert during loading.
  useEffect(() => {
    if (busy) return;
    const frame = window.requestAnimationFrame(() => {
      if (replaying.current) {
        scope.current?.querySelector<HTMLElement>('main')?.focus({ preventScroll: true });
        replaying.current = false;
      }
      if (initialAnchorHandled.current) return;
      initialAnchorHandled.current = true;
      let id: string;
      try { id = decodeURIComponent(window.location.hash.slice(1)); }
      catch { return; }
      const destination = id ? document.getElementById(id) : null;
      if (destination && scope.current?.contains(destination)) {
        destination.scrollIntoView({ block: 'start', behavior: 'instant' });
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [busy]);

  return (
    <div className="site" ref={scope}>
      {busy && <Preloader onComplete={finishLoading} />}
      <div className="site-content" inert={busy} aria-busy={busy}>
      <a className="skip-link" href="#main-content">{t.skip}</a>
      <GlobalNav />
      <main id="main-content" className="hero-project-sequence" tabIndex={-1}>
          <HeroProjects reduced={reduced} loading={busy} onEnableMotion={enableOpening} videoPaused={videoPaused} onVideoPauseChange={setVideoPaused} />
          <Projects onInspect={setSelected} reduced={reduced} videoPaused={videoPaused} onVideoPauseChange={setVideoPaused} />
        <Gallery onInspect={setSelected} />
        <Services />
        <AboutMe />
        <LetsWork reduced={reduced} onToggleMotion={toggleMotion} />
      </main>
      <ProjectDialog project={selected} onClose={() => setSelected(null)} />
      </div>
    </div>
  );
}

export default function App() {
  return <LocaleProvider><Portfolio /></LocaleProvider>;
}
