import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initProjectSlider } from './projectSlider';
import { initProjectsCasesHandoff } from './projectsCasesHandoff';
import { initAboutWave } from './aboutWave';
import { initHorizontalCases } from './horizontalCases';
import { initHeroVideoHandoff } from './heroVideoHandoff';
import { initCasesPerspective } from './casesPerspective';
import { initCircularServices } from './circularServices';
import { initServiceAccordion } from './serviceAccordion';
import { initServicesAboutHandoff } from './servicesAboutHandoff';
import { initScrollTitleReveals } from './titleLetterReveal';

gsap.registerPlugin(ScrollTrigger);

/** Native scrolling and CSS sticky do the navigation. GSAP only accompanies it. */
export function initPortfolioAnimations(scope: HTMLElement, reduced: boolean) {
  const disposeAccordion = initServiceAccordion(scope, reduced);
  if (reduced) return disposeAccordion;
  const media = gsap.matchMedia();
  let disposed = false;
  let refreshFrame = 0;
  const refresh = () => {
    window.cancelAnimationFrame(refreshFrame);
    refreshFrame = window.requestAnimationFrame(() => {
      if (!disposed) ScrollTrigger.refresh();
    });
  };

  media.add({
    desktop: '(min-width: 960px)',
    mobile: '(max-width: 959px)',
    casesMotion: '(min-height: 600px)'
  }, context => {
    const { desktop, casesMotion } = context.conditions!;

    const hero = scope.querySelector<HTMLElement>('.hero');
    if (hero) {
      const name = hero.querySelector<HTMLElement>('.hero-name')!;
      const openingSize = () => Number.parseFloat(window.getComputedStyle(name).fontSize);
      // The original narrow reveal between CAMILA and LOPES uses the same photo throughout.
      const scene = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: hero, start: 'top top',
          end: () => `+=${Math.max(1, hero.querySelector<HTMLElement>('.hero-video-zoom-start')?.offsetTop ?? hero.offsetHeight - (hero.querySelector<HTMLElement>('.hero-stage')?.offsetHeight ?? window.innerHeight))}`,
          scrub: 0.85, invalidateOnRefresh: true
        }
      });
      gsap.set('.hero-ending', { autoAlpha: 0, y: 18 });
      scene.fromTo('.hero-name-gap', { width: 0 }, { width: () => openingSize() * 0.72, duration: 0.32, ease: 'expo.inOut' }, 0);
      scene.fromTo('.hero-image', {
        width: 0, height: () => openingSize() * 0.55,
        left: () => `${50 + openingSize() * 0.45 / name.offsetWidth * 100}%`, top: '47%'
      }, { width: () => openingSize() * 0.72, duration: 0.32, ease: 'expo.inOut' }, 0);
      scene.to('.hero-name-start', { x: () => -openingSize() * 0.08, duration: 0.32, ease: 'expo.inOut' }, 0);
      scene.to('.hero-name-end', { x: () => openingSize() * 0.08, duration: 0.32, ease: 'expo.inOut' }, 0);
      scene.to('.hero-image', { left: '50%', top: '50%', width: '100%', height: '100%', duration: 0.62, ease: 'expo.inOut' }, 0.42);
      scene.to('.hero-name-gap', { width: () => name.offsetWidth * 1.1, duration: 0.62, ease: 'expo.inOut' }, 0.42);
      scene.to('.hero-image img', { scale: 1, duration: 0.62, ease: 'expo.inOut' }, 0.42);
      scene.to('.hero-name', { autoAlpha: 0, duration: 0.28 }, 0.78);
      scene.to('.hero-summary', { y: -12, autoAlpha: 0, duration: 0.4 }, 0.3);
      scene.to('.hero-ending', { autoAlpha: 1, y: 0, duration: 0.24 }, 0.86);
      scene.to('.hero-image figcaption', { opacity: 1, duration: 0.18 }, 1.04);
      scene.to('.hero-bottom', { autoAlpha: 0, duration: 0.3 }, 0.8);

    }

    const projects = scope.querySelector<HTMLElement>('.projects--motion');
    const disposeProjects = projects ? initProjectSlider(projects, true) : undefined;
    const disposeVideo = initHeroVideoHandoff(scope, Boolean(desktop));
    const disposeHandoff = initProjectsCasesHandoff(scope, Boolean(desktop));
    const disposeCases = casesMotion ? initHorizontalCases(scope, Boolean(desktop)) : undefined;
    const disposePerspective = initCasesPerspective(scope);
    const disposeCircle = casesMotion ? initCircularServices(scope, Boolean(desktop)) : undefined;
    const disposeAboutEntry = initServicesAboutHandoff(scope, Boolean(desktop));
    initScrollTitleReveals(scope, Boolean(desktop), Boolean(disposeCircle));
    initAboutWave(scope, Boolean(desktop));

    // The remaining editorial phrases move only a few pixels.
    gsap.utils.toArray<HTMLElement>('[data-reveal]', scope).forEach(element => {
      if (disposeCircle && element.closest('#services')) return;
      gsap.fromTo(element, { y: desktop ? 22 : 12, opacity: 0.45 }, {
        y: 0, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: element, start: 'clamp(top 96%)', end: 'clamp(top 73%)', scrub: 0.55, invalidateOnRefresh: true }
      });
    });
    gsap.utils.toArray<HTMLElement>('[data-reveal-title]', scope).forEach(element => {
      if (disposeCircle && element.closest('#services')) return;
      gsap.fromTo(element, { y: desktop ? 30 : 16, opacity: 0.65 }, {
        y: 0, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: element, start: 'clamp(top 95%)', end: 'clamp(top 67%)', scrub: 0.7, invalidateOnRefresh: true }
      });
    });
    // A stationary button reserves the image's space; two opposing layers open a quiet swipe.
    // The native scroll controls every stage, including the reverse reveal when scrolling up.
    gsap.utils.toArray<HTMLElement>('[data-case-reveal]:not([data-horizontal-case-reveal])', scope).forEach(frame => {
      const mask = frame.querySelector<HTMLElement>('.case-reveal-mask');
      const surface = frame.querySelector<HTMLElement>('.case-reveal-surface');
      const image = frame.querySelector('img');
      if (!mask || !surface || !image) return;
      const reveal = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: frame, start: 'clamp(top 93%)', end: 'clamp(top 38%)',
          scrub: desktop ? 0.8 : 0.6, invalidateOnRefresh: true
        }
      });
      reveal.fromTo(mask, { yPercent: 100 }, { yPercent: 0, duration: 1 }, 0);
      reveal.fromTo(surface, { yPercent: -100 }, { yPercent: 0, duration: 1 }, 0);
      reveal.fromTo(image, { yPercent: desktop ? 7 : 4, scale: desktop ? 1.055 : 1.035 }, {
        yPercent: 0, scale: 1, duration: 1
      }, 0);
    });
    gsap.utils.toArray<HTMLElement>('.project-media:not([data-case-reveal]), .portrait-image:not([data-portrait-reveal])', scope).forEach(frame => {
      const image = frame.querySelector('img');
      if (!image) return;
      gsap.fromTo(image, { scale: desktop ? 1.035 : 1.02, yPercent: desktop ? 1 : 0 }, {
        scale: 1, yPercent: desktop ? -1 : 0, ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: 0.9, invalidateOnRefresh: true }
      });
    });
    gsap.utils.toArray<HTMLElement>('[data-rule]', scope).forEach(element => {
      if (disposeCircle && element.closest('#services')) return;
      gsap.fromTo(element, { scaleX: 0.55, transformOrigin: 'left center' }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: element, start: 'clamp(top 96%)', end: 'clamp(top 72%)', scrub: 0.65 }
      });
    });
    return () => { disposeAboutEntry?.(); disposeCircle?.(); disposePerspective?.(); disposeCases?.(); disposeHandoff?.(); disposeVideo?.(); disposeProjects?.(); };
  }, scope);

  // Images reserve their real dimensions, so loading them cannot interrupt native anchor scroll.
  // Refresh once after the accordion settles, rather than on its native open toggle.
  document.fonts.ready.then(() => { if (!disposed) refresh(); });
  scope.addEventListener('services:layout', refresh);
  refresh();

  return () => {
    disposed = true;
    window.cancelAnimationFrame(refreshFrame);
    scope.removeEventListener('services:layout', refresh);
    disposeAccordion();
    media.revert();
  };
}
