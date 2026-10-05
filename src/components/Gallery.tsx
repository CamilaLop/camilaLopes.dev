import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useLocale } from '../context/LocaleContext';
import { portfolioProjects, type PortfolioProject } from '../data/projects';
import { projectCopy } from '../data/projectCopy';
import { SectionLabel } from './SectionLabel';
import '../styles/cases-horizontal.css';
import '../styles/gallery-coverflow.css';

const remaining = portfolioProjects.slice(3);

export function Gallery({ onInspect }: { onInspect: (project: PortfolioProject) => void }) {
  const { t, locale } = useLocale();
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(0);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const update = (event: Event) => setCurrent((event as CustomEvent<{ index: number }>).detail.index);
    element.addEventListener('cases:progress', update);
    return () => element.removeEventListener('cases:progress', update);
  }, []);

  const updateNative = () => {
    const frame = viewport.current;
    if (!frame || root.current?.dataset.casesMode === 'scroll') return;
    const cards = Array.from(frame.querySelectorAll<HTMLElement>('.gallery-case'));
    const origin = cards[0]?.offsetLeft ?? 0;
    const distance = Math.max(1, frame.scrollWidth - frame.clientWidth);
    const stops = cards.map(card => Math.min(distance, card.offsetLeft - origin));
    const closest = stops.reduce((best, stop, index) => Math.abs(stop - frame.scrollLeft) < Math.abs(stops[best] - frame.scrollLeft) ? index : best, 0);
    setCurrent(closest);
    if (progress.current) progress.current.style.transform = `scaleX(${Math.min(1, frame.scrollLeft / distance)})`;
  };

  const goTo = (index: number) => {
    const target = Math.max(0, Math.min(remaining.length - 1, index));
    if (root.current?.dataset.casesMode === 'scroll') {
      root.current.dispatchEvent(new CustomEvent('cases:navigate', { detail: { index: target } }));
      return;
    }
    const frame = viewport.current;
    const cards = frame?.querySelectorAll<HTMLElement>('.gallery-case');
    if (frame && cards?.[target]) frame.scrollTo({
      left: cards[target].offsetLeft - cards[0].offsetLeft,
      behavior: document.documentElement.dataset.motion === 'reduce' ? 'instant' : 'smooth'
    });
  };

  const keydown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.metaKey || event.ctrlKey) return;
    const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!direction) return;
    event.preventDefault();
    const index = Math.max(0, Math.min(remaining.length - 1, current + direction));
    goTo(index);
    if ((event.target as HTMLElement).closest('.gallery-case')) {
      viewport.current?.querySelectorAll<HTMLElement>('.gallery-case')[index]?.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
    }
  };

  return <section ref={root} className="gallery gallery--horizontal gallery--coverflow section-ink" id="gallery" aria-labelledby="gallery-title" data-current-case={current}>
    <div className="section-rule" data-rule />
    <div className="gallery-entry-outer"><div className="gallery-entry-inner"><div className="gallery-entry-gesture"><header className="gallery-head">
      <div><SectionLabel number="02">{t.gallery.label}</SectionLabel><h2 id="gallery-title" className="display gallery-title" aria-label={`${t.gallery.title} (05)`}><span className="gallery-title-mask" aria-hidden="true">{Array.from(t.gallery.title).map((letter, index) => <span className="gallery-title-char" key={index}>{letter}</span>)}</span><span className="title-count" aria-hidden="true">(05)</span></h2></div>
      <div className="gallery-intro"><p className="editorial-note">{t.gallery.lead}</p><p>{t.gallery.small}</p></div>
    </header></div></div></div>
    <div className="cases-lane"><div className="cases-stage">
      <div className="cases-toolbar">
        <span className="cases-counter micro" aria-hidden="true">{String(current + 1).padStart(2, '0')}<span> / 05</span></span>
        <div className="cases-progress" aria-hidden="true"><span ref={progress} className="cases-progress-fill" /></div>
        <div className="cases-controls" role="group" aria-label={t.gallery.sequence}>
          <button className="cases-prev" type="button" aria-label={t.gallery.previous} aria-controls="cases-track" disabled={current === 0} onClick={() => goTo(current - 1)}><span aria-hidden="true">←</span></button>
          <button className="cases-next" type="button" aria-label={t.gallery.next} aria-controls="cases-track" disabled={current === remaining.length - 1} onClick={() => goTo(current + 1)}><span aria-hidden="true">→</span></button>
        </div>
      </div>
      <p id="cases-keyboard" className="sr-only">{t.gallery.keyboard}</p>
      <div ref={viewport} className="cases-viewport" tabIndex={0} role="group" aria-label={t.gallery.sequence} aria-describedby="cases-keyboard" onKeyDown={keydown} onScroll={updateNative}>
      <div id="cases-track" className="gallery-grid cases-track">{remaining.map((project, i) => {
      const copy = projectCopy[locale][project.id];
      return <article className={`gallery-case gallery-case--${i + 1}`} key={project.id} data-gallery-active={current === i ? 'true' : undefined}>
        <div className="case-perspective"><div className="case-scroll-pose"><div className="case-pointer-pose"><button className="gallery-image project-media" data-case-reveal data-horizontal-case-reveal type="button" onClick={() => onInspect(project)} aria-label={`${t.gallery.inspect}: ${project.title}`}>
          <span className="case-reveal-mask"><span className="case-reveal-surface"><span className="case-image-parallax"><img src={project.image} alt={`${project.title} — ${copy.category}`} width={project.imageWidth} height={project.imageHeight} loading="lazy" decoding="async" /></span></span></span>
          <span className="image-link-indicator" aria-hidden="true">↗</span>
        </button></div></div></div>
        <div className="gallery-caption"><div><span className="micro">0{i + 4} / {t.projects.status[project.status]}</span><h3><button type="button" onClick={() => onInspect(project)}>{project.title}</button></h3><p>{copy.category}</p></div><span className="gallery-caption-arrow" aria-hidden="true">↗</span></div>
      </article>;
      })}</div></div>
      <div className="cases-stage-bottom"><span className="cases-hint micro"><span className="cases-hint-scroll">{t.gallery.scroll}</span><span className="cases-hint-swipe">{t.gallery.swipe}</span><span aria-hidden="true"> ↔</span></span><a className="cases-continue micro" href="#services">{t.gallery.continue}<span aria-hidden="true">↓</span></a></div>
    </div></div>
  </section>;
}
