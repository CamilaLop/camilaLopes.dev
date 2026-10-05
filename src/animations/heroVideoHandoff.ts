import gsap from 'gsap';
import { addTitleLetterReveal } from './titleLetterReveal';

/** The first project paints the hero's live frames, retaining one playback clock. */
export function initHeroVideoHandoff(scope: HTMLElement, desktop: boolean) {
  const hero = scope.querySelector<HTMLElement>('.hero');
  const heroStage = hero?.querySelector<HTMLElement>('.hero-stage');
  const anchor = hero?.querySelector<HTMLElement>('.hero-video');
  const surface = anchor?.querySelector<HTMLElement>('.hero-video-surface');
  const heroPlayer = surface?.querySelector<HTMLVideoElement>('video');
  const shade = surface?.querySelector<HTMLElement>('.hero-video-shade');
  const projects = scope.querySelector<HTMLElement>('.projects--motion');
  const projectStage = projects?.querySelector<HTMLElement>('.projects-stage');
  const firstHeading = projects?.querySelector<HTMLElement>('.project-panel--igor-guia .project-heading-wrap');
  const projectCanvas = projects?.querySelector<HTMLCanvasElement>('.project-live-video');
  const zoomMarker = hero?.querySelector<HTMLElement>('.hero-video-zoom-start');
  if (!hero || !heroStage || !anchor || !surface || !heroPlayer || !shade || !projects || !projectStage || !projectCanvas || !zoomMarker || !firstHeading) return;

  const top = (element: HTMLElement) => element.getBoundingClientRect().top + window.scrollY;
  const headerHeight = () => scope.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 86;
  const zoomStart = () => top(hero) + zoomMarker.offsetTop;
  const zoomEnd = () => top(projects) - headerHeight();
  const revealEnd = () => top(hero) + hero.offsetHeight - heroStage.offsetHeight;
  const paint = projectCanvas.getContext('2d', { alpha: false });
  let drawFrame: number | undefined;
  const useVideoFrames = typeof heroPlayer.requestVideoFrameCallback === 'function';
  const draw = () => {
    if (!paint || heroPlayer.readyState < 2 || document.hidden) return;
    if (projectCanvas.width !== heroPlayer.videoWidth || projectCanvas.height !== heroPlayer.videoHeight) {
      projectCanvas.width = heroPlayer.videoWidth;
      projectCanvas.height = heroPlayer.videoHeight;
    }
    paint.drawImage(heroPlayer, 0, 0, projectCanvas.width, projectCanvas.height);
    projectCanvas.style.opacity = '1';
  };
  const tick = () => { drawFrame = undefined; startDrawing(); };
  const startDrawing = () => {
    draw();
    if (drawFrame === undefined && !heroPlayer.paused && !document.hidden) {
      drawFrame = useVideoFrames ? heroPlayer.requestVideoFrameCallback(tick) : window.requestAnimationFrame(tick);
    }
  };
  const stopDrawing = () => {
    if (drawFrame === undefined) return;
    if (useVideoFrames) heroPlayer.cancelVideoFrameCallback(drawFrame);
    else window.cancelAnimationFrame(drawFrame);
    drawFrame = undefined;
  };
  const visibility = () => { if (document.hidden) stopDrawing(); else startDrawing(); };
  const pauseDrawing = () => { stopDrawing(); draw(); };
  const interaction = () => {
    const opacity = Number(gsap.getProperty(projectStage, 'opacity'));
    if (opacity < .2 && projectStage.contains(document.activeElement)) {
      anchor.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
    } else if (opacity >= .99 && anchor.contains(document.activeElement)) {
      projects.querySelector<HTMLButtonElement>('.project-video-toggle')?.focus({ preventScroll: true });
    }
    projectStage.inert = opacity < .2;
    anchor.inert = opacity >= .99;
  };

  const zoom = gsap.timeline({
    scrollTrigger: {
      id: 'hero-video-zoom', trigger: hero,
      start: zoomStart, end: zoomEnd,
      scrub: desktop ? .65 : .45, invalidateOnRefresh: true
    }
  });
  zoom.fromTo(surface, {
    x: 0, y: 0, width: () => anchor.offsetWidth, height: () => anchor.offsetHeight
  }, {
    x: () => -(anchor.getBoundingClientRect().left - heroStage.getBoundingClientRect().left),
    y: () => headerHeight() - anchor.offsetTop,
    width: () => heroStage.offsetWidth,
    height: () => window.innerHeight - headerHeight(),
    duration: 1, ease: 'power2.inOut'
  }, 0);
  zoom.fromTo(heroPlayer, { scale: 1 }, { scale: 1.08, duration: 1, ease: 'none' }, 0);
  zoom.fromTo(shade, { opacity: 0 }, { opacity: 1, duration: .25, ease: 'none' }, .75);
  zoom.to(hero.querySelectorAll('.hero-topline, .hero-image figcaption'), { autoAlpha: 0, duration: .25, ease: 'none' }, .2);

  const reveal = gsap.timeline({
    onUpdate: () => {
      draw();
      interaction();
    },
    scrollTrigger: {
      id: 'hero-video-project-reveal', trigger: projects,
      start: zoomEnd, end: revealEnd,
      scrub: desktop ? .4 : .3, invalidateOnRefresh: true,
      onRefresh: interaction
    }
  });
  reveal.fromTo(projectStage, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, ease: 'none' }, 0);
  reveal.fromTo(firstHeading, { y: desktop ? 24 : 14 }, { y: 0, duration: 1, ease: 'power2.out' }, 0);
  addTitleLetterReveal(reveal, Array.from(firstHeading.querySelectorAll<HTMLElement>('.project-heading-char')), .08, .64, .25);
  reveal.fromTo(anchor.querySelector('button'), { autoAlpha: 1 }, { autoAlpha: 0, duration: .5, ease: 'none' }, 0);

  heroPlayer.addEventListener('loadeddata', startDrawing);
  heroPlayer.addEventListener('seeked', startDrawing);
  heroPlayer.addEventListener('play', startDrawing);
  heroPlayer.addEventListener('pause', pauseDrawing);
  document.addEventListener('visibilitychange', visibility);
  interaction();
  startDrawing();
  return () => {
    stopDrawing();
    document.removeEventListener('visibilitychange', visibility);
    heroPlayer.removeEventListener('loadeddata', startDrawing);
    heroPlayer.removeEventListener('seeked', startDrawing);
    heroPlayer.removeEventListener('play', startDrawing);
    heroPlayer.removeEventListener('pause', pauseDrawing);
    zoom.scrollTrigger?.kill();
    reveal.scrollTrigger?.kill();
    zoom.kill();
    reveal.kill();
    projectStage.inert = false;
    anchor.inert = false;
    projectCanvas.style.removeProperty('opacity');
  };
}
