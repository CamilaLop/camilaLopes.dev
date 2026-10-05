import { useEffect, useRef, useState } from 'react';
import { useLocale } from '../context/LocaleContext';
import { heroVideo, videoLabels } from '../data/heroVideo';
import '../styles/hero-video.css';
import '../styles/hero-project-transition.css';

export function HeroVideo({ loading, reduced, paused, onPauseChange }: { loading: boolean; reduced: boolean; paused: boolean; onPauseChange: (paused: boolean) => void }) {
  const { locale } = useLocale();
  const frame = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const element = frame.current;
    const player = video.current;
    if (!element || !player) return;
    let request = 0;
    let playPending = false;
    const projectStage = document.querySelector<HTMLElement>('.projects-stage');
    const projects = document.querySelector<HTMLElement>('#projects');
    const projectCanvas = projects?.querySelector<HTMLCanvasElement>('.project-live-video');
    const update = () => {
      request = 0;
      const bounds = (surface.current ?? element).getBoundingClientRect();
      const style = getComputedStyle(element);
      const covered = projectStage && Number(getComputedStyle(projectStage).opacity) >= .999
        && projectStage.getBoundingClientRect().top <= (document.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 86) + 1;
      const canvasBounds = projectCanvas?.getBoundingClientRect();
      const projectVisible = projectCanvas && canvasBounds && projectStage && projects?.dataset.currentProject === '0'
        && Number(getComputedStyle(projectStage).opacity) > .001
        && canvasBounds.bottom > 0 && canvasBounds.top < innerHeight;
      const heroVisible = !covered && style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > .2
        && bounds.bottom > 0 && bounds.top < innerHeight;
      const visible = !loading && !reduced && !paused && !document.hidden && (heroVisible || projectVisible);
      if (visible && player.paused && !playPending) {
        playPending = true;
        void player.play().catch(() => setPlaying(false)).finally(() => { playPending = false; });
      }
      else if (!visible && !player.paused) player.pause();
    };
    const schedule = () => { if (!request) request = requestAnimationFrame(update); };
    // Follow the reveal and the overlap with the first project's player.
    const styles = new MutationObserver(schedule);
    styles.observe(element, { attributes: true, attributeFilter: ['style', 'class'] });
    if (projectStage) styles.observe(projectStage, { attributes: true, attributeFilter: ['style'] });
    if (projects) styles.observe(projects, { attributes: true, attributeFilter: ['data-current-project'] });
    const visibility = new IntersectionObserver(schedule);
    visibility.observe(element);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    document.addEventListener('visibilitychange', schedule);
    schedule();
    return () => {
      styles.disconnect();
      visibility.disconnect();
      cancelAnimationFrame(request);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('visibilitychange', schedule);
      player.pause();
    };
  }, [loading, reduced, paused]);

  const toggle = () => {
    const player = video.current;
    if (!player) return;
    if (!player.paused) { onPauseChange(true); player.pause(); }
    else { onPauseChange(false); void player.play().catch(() => setPlaying(false)); }
  };

  return <figure className="hero-ending hero-video" ref={frame}>
    <div className="hero-video-surface" ref={surface}>
    <video ref={video} src={heroVideo.src} poster={heroVideo.poster}
      width={heroVideo.width} height={heroVideo.height} muted loop playsInline preload="metadata" aria-hidden="true"
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
    <span className="hero-video-shade" aria-hidden="true" />
    {!reduced && <button className="hero-video-toggle" type="button" onClick={toggle}
      aria-label={playing ? videoLabels[locale].pause : videoLabels[locale].play}>
      <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>
    </button>}
    </div>
  </figure>;
}
