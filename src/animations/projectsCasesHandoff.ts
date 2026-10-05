import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import { addTitleLetterReveal } from './titleLetterReveal';

gsap.registerPlugin(ScrollTrigger, Observer);

/** A reversible paper swipe, with a small gesture response only at this boundary. */
export function initProjectsCasesHandoff(scope: HTMLElement, desktop: boolean) {
  const projects = scope.querySelector<HTMLElement>('.projects--motion');
  const gallery = scope.querySelector<HTMLElement>('#gallery');
  const outer = gallery?.querySelector<HTMLElement>('.gallery-entry-outer');
  const inner = gallery?.querySelector<HTMLElement>('.gallery-entry-inner');
  const incoming = gallery?.querySelector<HTMLElement>('.gallery-entry-gesture');
  const lastVisual = projects?.querySelector<HTMLElement>('.project-panel:last-child .project-visual');
  const camera = lastVisual?.querySelector<HTMLElement>('.project-gesture-layer');
  if (!projects || !gallery || !outer || !inner || !incoming || !lastVisual || !camera) return;

  const cameraY = gsap.quickTo(camera, 'y', { duration: .95, ease: 'power2.out' });
  const incomingY = gsap.quickTo(incoming, 'y', { duration: 1.05, ease: 'power2.out' });
  let active = false;
  const settleGesture = () => { cameraY(0); incomingY(0); };
  const observer = Observer.create({
    id: 'projects-cases-handoff', target: window, type: 'wheel,touch',
    preventDefault: false, lockAxis: true, tolerance: 3, onStopDelay: .3,
    ignore: '.site-header, dialog, input, textarea, select',
    onChangeY: self => {
      if (!active || document.querySelector('dialog[open]')) return;
      // Wheel and finger coordinates point in opposite directions during page scroll.
      const direction = gsap.utils.clamp(-1, 1, self.deltaY / 70) * (self.event.type === 'wheel' ? 1 : -1);
      cameraY(-direction * (desktop ? 12 : 8));
      incomingY(direction * (desktop ? 5 : 3));
    },
    onStop: settleGesture,
    onRelease: settleGesture
  });
  observer.disable();
  const timeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      id: 'projects-gallery-handoff',
      trigger: gallery, start: 'top 95%',
      end: () => `top ${scope.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 86}px`,
      scrub: desktop ? 1 : .75, invalidateOnRefresh: true,
      onToggle: self => {
        active = self.isActive;
        if (active) observer.enable();
        else { observer.disable(); settleGesture(); }
      },
      onRefresh: self => {
        active = self.isActive;
        if (active) observer.enable();
        else { observer.disable(); settleGesture(); }
      }
    }
  });
  timeline.fromTo(lastVisual, { yPercent: 0, scale: 1 }, {
    yPercent: desktop ? -5 : -3, scale: desktop ? 1.035 : 1.02, duration: 1.2
  }, 0);
  timeline.fromTo(outer, { yPercent: 18 }, { yPercent: 0, duration: 1.2 }, 0);
  timeline.fromTo(inner, { yPercent: -18 }, { yPercent: 0, duration: 1.2 }, 0);
  addTitleLetterReveal(timeline, Array.from(gallery.querySelectorAll<HTMLElement>('.gallery-title-char')), .08, .8, .36);
  timeline.fromTo(gallery.querySelector('.gallery-title .title-count'), { y: 12, opacity: 0 }, {
    y: 0, opacity: 1, duration: .44, ease: 'power2.out'
  }, .45);
  timeline.fromTo(gallery.querySelectorAll('.gallery-head .section-label, .gallery-intro'), { y: desktop ? 18 : 12, opacity: .5 }, {
    y: 0, opacity: 1, duration: .9, stagger: .1
  }, .12);
  return () => {
    active = false;
    observer.kill();
    cameraY.tween.kill();
    incomingY.tween.kill();
    timeline.scrollTrigger?.kill();
    timeline.kill();
    camera.style.removeProperty('transform');
    incoming.style.removeProperty('transform');
  };
}
