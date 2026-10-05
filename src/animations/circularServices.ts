import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { addTitleLetterReveal } from './titleLetterReveal';

type ResumePoint = { progress: number; after: number };
const resumePoints = new WeakMap<HTMLElement, ResumePoint>();

/** A paper semicircle opens from the bottom before Services reveals its content. */
export function initCircularServices(scope: HTMLElement, desktop: boolean) {
  const gallery = scope.querySelector<HTMLElement>('.gallery[data-cases-mode="scroll"]');
  const lane = gallery?.querySelector<HTMLElement>('.cases-lane');
  const casesStage = gallery?.querySelector<HTMLElement>('.cases-stage');
  const root = scope.querySelector<HTMLElement>('#services');
  const stage = root?.querySelector<HTMLElement>('.services-circular-stage');
  const content = root?.querySelector<HTMLElement>('.services-content');
  const rule = content?.querySelector<HTMLElement>('[data-rule]');
  if (!gallery || !lane || !casesStage || !root || !stage || !content || !rule) return;
  const elements = Array.from(content.querySelectorAll<HTMLElement>('[data-service-reveal]:not([data-title-reveal-line])'));
  const titleLetters = Array.from(content.querySelectorAll<HTMLElement>('#services-title [data-title-char]'));
  const revealStyles = [rule, ...elements, ...titleLetters].map(element => ({ element, style: element.getAttribute('style') }));
  const original = { height: root.style.height, margin: root.style.marginTop, clip: stage.style.clipPath };
  const resume = resumePoints.get(root);
  resumePoints.delete(root);
  const context = gsap.context(() => {}, root);
  const camera = { progress: 0 };
  let animation: gsap.core.Timeline | undefined;
  let restoreFrame = 0;
  let disposed = false;
  let sceneStart = 0, sceneEnd = 0;
  let remembered: ResumePoint | undefined;
  let travel = 0, cx = 0, cy = 0, radius = 0;
  root.dataset.circularReveal = 'true';
  const measure = () => {
    travel = Number.parseFloat(lane.style.getPropertyValue('--cases-exit-travel')) || window.innerHeight * 1.1;
    const padding = Number.parseFloat(getComputedStyle(gallery).paddingBottom);
    root.style.marginTop = `${-casesStage.offsetHeight - travel - padding}px`;
    root.style.setProperty('--services-circle-travel', `${travel}px`);
    root.style.height = `${Math.ceil(stage.offsetHeight + travel)}px`;
    cx = stage.clientWidth / 2;
    cy = window.innerHeight - (scope.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 86);
    radius = Math.hypot(cx, cy) + 3;
  };
  const remember = () => {
    const trigger = animation?.scrollTrigger;
    if (trigger) { sceneStart = trigger.start; sceneEnd = trigger.end; }
    if (sceneEnd <= sceneStart) return;
    const viewport = window.innerHeight - (scope.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 86);
    const readingEnd = sceneEnd + Math.max(0, stage.offsetHeight - viewport);
    const scroll = window.scrollY;
    remembered = scroll >= sceneStart && scroll <= readingEnd ? {
      progress: gsap.utils.clamp(0, 1, (scroll - sceneStart) / (sceneEnd - sceneStart)),
      after: Math.max(0, scroll - sceneEnd)
    } : undefined;
  };
  const render = () => {
    const size = 14 + (radius - 14) * camera.progress;
    stage.style.clipPath = camera.progress >= .9999 ? 'none' : `circle(${size}px at ${cx}px ${cy}px)`;
    const revealed = (animation?.totalProgress() ?? 0) >= .95;
    const focused = document.activeElement;
    // The clipped stage guards clicks; controls join the tab order after their reveal.
    content.inert = !revealed;
    casesStage.inert = revealed;
    if (!revealed && content.contains(focused)) {
      gallery.querySelector<HTMLAnchorElement>('.cases-continue')?.focus({ preventScroll: true });
    } else if (revealed && casesStage.contains(focused)) {
      root.querySelector<HTMLElement>('summary')?.focus({ preventScroll: true });
    }
  };
  measure();
  context.add(() => {
    gsap.set(elements, { y: desktop ? 34 : 22, opacity: 0 });
    animation = gsap.timeline({
      onUpdate: render,
      scrollTrigger: {
        id: 'cases-services-circle', trigger: root,
        start: () => ScrollTrigger.getById('cases-diagonal')?.end ?? root.getBoundingClientRect().top + window.scrollY,
        end: () => `+=${travel}`, scrub: desktop ? .65 : .45,
        invalidateOnRefresh: true, onRefreshInit: measure, onRefresh: render
      }
    });
    animation.fromTo(camera, { progress: 0 }, {
      progress: 1, duration: .72, ease: 'power2.inOut'
    }, 0);
    // Text stays hidden during the opening; it enters in sequence as the paper fills the screen.
    animation.fromTo(rule, { scaleX: .85, opacity: 0 }, {
      scaleX: 1, opacity: 1, transformOrigin: 'left center', duration: .16, ease: 'power2.out'
    }, .62);
    animation.fromTo(elements, { y: desktop ? 34 : 22, opacity: 0 }, {
      y: 0, opacity: 1, duration: .18, stagger: { amount: .2 }, ease: 'power2.out'
    }, .62);
    addTitleLetterReveal(animation, titleLetters, .65, .25, .1);
  });
  render();
  remember();
  window.addEventListener('scroll', remember, { passive: true });
  // Rebuilding translated content changes the temporary layout. Resume the same scroll scene.
  if (resume) restoreFrame = window.requestAnimationFrame(() => {
    restoreFrame = 0;
    if (disposed || !animation?.scrollTrigger) return;
    ScrollTrigger.refresh();
    const restore = () => {
      if (disposed || !animation?.scrollTrigger) return;
      const trigger = animation.scrollTrigger;
      window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * resume.progress + resume.after, behavior: 'instant' });
      ScrollTrigger.update();
      animation.totalProgress(resume.progress);
      render();
    };
    restore();
    // Reapply after native scroll anchoring has settled the translated layout.
    restoreFrame = window.requestAnimationFrame(() => { restoreFrame = 0; restore(); });
  });
  return () => {
    const point = restoreFrame && resume ? resume : remembered;
    if (point) {
      resumePoints.set(root, point);
      window.requestAnimationFrame(() => { if (resumePoints.get(root) === point) resumePoints.delete(root); });
    }
    disposed = true;
    window.removeEventListener('scroll', remember);
    window.cancelAnimationFrame(restoreFrame);
    if (!context.isReverted) context.revert();
    // Nested GSAP contexts also revert the initial hidden pose; restore the original markup.
    revealStyles.forEach(({ element, style }) => {
      if (style === null) element.removeAttribute('style');
      else element.setAttribute('style', style);
    });
    delete root.dataset.circularReveal;
    root.style.height = original.height;
    root.style.marginTop = original.margin;
    root.style.removeProperty('--services-circle-travel');
    stage.style.clipPath = original.clip;
    content.inert = false;
    casesStage.inert = false;
  };
}
