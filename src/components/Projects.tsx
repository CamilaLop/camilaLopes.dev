import { titleFont } from '../utils/titleFont';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useLocale } from '../context/LocaleContext';
import { portfolioProjects, type PortfolioProject } from '../data/projects';
import { projectMedia } from '../data/projectMedia';
import { projectCopy } from '../data/projectCopy';
import { heroVideo, videoLabels } from '../data/heroVideo';
import '../styles/projects-cases.css';

const featured = portfolioProjects.slice(0, 3);

export function Projects({ onInspect, reduced, videoPaused, onVideoPauseChange }: { onInspect: (project: PortfolioProject) => void; reduced: boolean; videoPaused: boolean; onVideoPauseChange: (paused: boolean) => void }) {
  const { t, locale } = useLocale();
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [firstPlaying, setFirstPlaying] = useState(false);
  const pausedPreviews = useRef<Record<string, boolean>>({});
  const [playingPreviews, setPlayingPreviews] = useState<Record<string, boolean>>({});
  const previewPlaying = (id: string, playing: boolean) => setPlayingPreviews(previous =>
    previous[id] === playing ? previous : { ...previous, [id]: playing }
  );
  const togglePreview = (id: string) => {
    const player = root.current?.querySelector<HTMLVideoElement>(`.project-panel--${id} video`);
    if (!player) return;
    pausedPreviews.current[id] = !player.paused;
    if (pausedPreviews.current[id]) player.pause();
    else void player.play().catch(() => {});
  };
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const change = (event: Event) => setActive((event as CustomEvent<number>).detail);
    element.addEventListener('project:change', change);
    return () => element.removeEventListener('project:change', change);
  }, []);
  useEffect(() => {
    const player = document.querySelector<HTMLVideoElement>('.hero-video video');
    if (!player) return;
    const update = () => setFirstPlaying(!player.paused);
    player.addEventListener('play', update);
    player.addEventListener('pause', update);
    update();
    return () => { player.removeEventListener('play', update); player.removeEventListener('pause', update); };
  }, []);
  useEffect(() => {
    const stage = root.current?.querySelector<HTMLElement>('.projects-stage');
    if (!stage) return;
    const videos = Array.from(stage.querySelectorAll<HTMLVideoElement>('video'));
    if (!videos.length) return;
    let visible = false;
    const update = () => videos.forEach(video => {
      const index = Number(video.closest<HTMLElement>('[data-project-index]')?.dataset.projectIndex);
      const paused = index === 0 ? videoPaused : pausedPreviews.current[featured[index]?.id];
      if (visible && !document.hidden && !reduced && index === active && !paused) {
        // A poster remains available if the browser blocks muted inline playback.
        void video.play().catch(() => {});
      } else video.pause();
    });
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; update(); });
    observer.observe(stage);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); videos.forEach(video => video.pause()); };
  }, [active, reduced, videoPaused]);

  return <section ref={root} className={`projects projects--${reduced ? 'static' : 'motion'}`} id="projects" aria-labelledby="projects-title" style={{ '--project-count': featured.length } as CSSProperties}>
    <h2 id="projects-title" className="sr-only">{t.projects.title}</h2>
    {!reduced && featured.map((project, index) => <span className="project-scroll-stop" id={`project-${project.id}`} key={project.id} style={{ '--project-stop': index === 0 ? .4 : index + .2 } as CSSProperties} aria-hidden="true" />)}
    <div className="projects-stage">
      <div className="projects-stage-top micro"><span>01 / {t.projects.label}</span><span>{t.projects.title}</span></div>
      <div className="projects-panels">{featured.map((project, index) => {
        const copy = projectCopy[locale][project.id];
        const media = projectMedia[project.id] ?? { type: 'image' as const, src: project.image };
        const staticPreview = reduced && (media.type === 'video' || /\.gif(?:\?|$)/i.test(media.src));
        return <article className={`project-panel project-panel--${project.id}`} id={reduced ? `project-${project.id}` : undefined} key={project.id} data-project-index={index} aria-labelledby={`title-${project.id}`}>
          <div className="project-outer"><div className="project-inner"><div className="project-scene">
            <div className="project-visual" aria-hidden="true">
              <div className="project-gesture-layer">{index === 0 && media.type === 'video' && !staticPreview
                ? <><img className="project-live-video-poster" src={media.poster ?? project.image} alt="" width={heroVideo.width} height={heroVideo.height} style={{ objectFit: 'cover' }} /><canvas className="project-live-video" width={heroVideo.width} height={heroVideo.height} aria-hidden="true" /></>
                : media.type === 'video' && !staticPreview
                ? <video src={media.src} poster={media.poster ?? project.image} muted loop playsInline preload="metadata" aria-hidden="true" onPlay={() => index === 0 ? setFirstPlaying(true) : previewPlaying(project.id, true)} onPause={() => index === 0 ? setFirstPlaying(false) : previewPlaying(project.id, false)} style={{ objectFit: media.fit ?? 'cover' }} />
                : <img src={staticPreview ? media.poster ?? project.image : media.src} alt="" width={project.imageWidth} height={project.imageHeight} decoding="async" style={{ objectFit: media.fit ?? 'cover' }} />}</div>
            </div>
            {index === 0 && media.type === 'video' && !reduced && <button className="project-video-toggle" type="button" aria-label={firstPlaying ? videoLabels[locale].pause : videoLabels[locale].play} onClick={() => onVideoPauseChange(firstPlaying)}><span aria-hidden="true">{firstPlaying ? 'Ⅱ' : '▶'}</span></button>}
            {index > 0 && media.type === 'video' && !reduced && <button className="project-video-toggle" type="button" aria-label={`${playingPreviews[project.id] ? videoLabels[locale].pause : videoLabels[locale].play} — ${project.title}`} onClick={() => togglePreview(project.id)}><span aria-hidden="true">{playingPreviews[project.id] ? 'Ⅱ' : '▶'}</span></button>}
            <div className="project-heading-wrap">
              <p className="project-category micro">{copy.category}</p>
              <h3 className={`project-heading display${titleFont(project.title)}`} id={`title-${project.id}`} aria-label={project.title}>{project.title.split(' ').map((word, wordIndex) => <span className="project-word-mask" key={wordIndex} aria-hidden="true">{Array.from(word).map((letter, letterIndex) => <span className="project-heading-char" key={letterIndex}>{letter}</span>)}</span>)}</h3>
            </div>
            <div className="project-panel-bottom">
              <div className="project-technology"><span className="micro">{t.projects.stack}</span><p>{project.stack.join(' / ')}</p></div>
              <div className="project-panel-actions">
                {project.url && <a className="text-link" href={project.url} target="_blank" rel="noopener noreferrer">{t.projects.view}<span aria-hidden="true">↗</span></a>}
                <button className="quiet-link" type="button" onClick={() => onInspect(project)}>{t.projects.details}<span aria-hidden="true">+</span></button>
              </div>
            </div>
          </div></div></div>
        </article>;
      })}</div>
      <div className="projects-stage-bottom">
        <nav className="projects-pagination" aria-label={t.projects.label}>{featured.map((project, index) => <a key={project.id} href={`#project-${project.id}`} data-project-go={index} aria-label={`${String(index + 1).padStart(2, '0')} — ${project.title}`} aria-current={!reduced && active === index ? 'true' : undefined}><span>{String(index + 1).padStart(2, '0')}</span><span className="project-page-rule" aria-hidden="true" /></a>)}</nav>
        <span className="projects-scroll-hint micro">{t.projects.scroll} <span aria-hidden="true">↓</span></span>
        <a className="projects-continue micro" href="#gallery">{t.projects.continue} <span aria-hidden="true">↘</span></a>
      </div>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{!reduced && `${String(active + 1).padStart(2, '0')} / ${featured.length} — ${featured[active].title}`}</p>
    </div>
  </section>;
}
