import gsap from 'gsap';
import { addTitleLetterReveal } from './titleLetterReveal';

/** A quiet editorial handoff: the divider opens, then the next chapter rises. */
export function initServicesAboutHandoff(scope: HTMLElement, desktop: boolean) {
  const about = scope.querySelector<HTMLElement>('#about');
  const rule = about?.querySelector<HTMLElement>('.about-entry-rule');
  const label = about?.querySelector<HTMLElement>('[data-about-entry-label]');
  const title = about?.querySelector<HTMLElement>('[data-about-entry-title]');
  const serviceCopy = scope.querySelector<HTMLElement>('.services-copy');
  if (!about || !rule || !label || !title) return;
  const letters = Array.from(title.querySelectorAll<HTMLElement>('[data-title-char]'));
  const elements = [rule, label, ...letters, ...(serviceCopy ? [serviceCopy] : [])];
  const original = elements.map(element => ({ element, style: element.getAttribute('style') }));
  const context = gsap.context(() => {
    const handoff = gsap.timeline({
      scrollTrigger: {
        id: 'services-about-handoff', trigger: about,
        start: 'clamp(top 94%)', end: 'clamp(top 32%)',
        scrub: desktop ? .65 : .45, invalidateOnRefresh: true
      }
    });
    handoff.fromTo(rule, { scaleX: .04, transformOrigin: 'left center' }, {
      scaleX: 1, duration: .64, ease: 'power2.inOut'
    }, 0);
    handoff.fromTo(label, { y: desktop ? 22 : 14, opacity: 0 }, {
      y: 0, opacity: 1, duration: .4, ease: 'power2.out'
    }, .12);
    addTitleLetterReveal(handoff, letters, .24, .52, .2);
    if (serviceCopy) handoff.fromTo(serviceCopy, { y: 0 }, {
      y: desktop ? -24 : -14, duration: .64, ease: 'none'
    }, 0);
  }, about);
  return () => {
    if (!context.isReverted) context.revert();
    original.forEach(({ element, style }) => {
      if (style === null) element.removeAttribute('style');
      else element.setAttribute('style', style);
    });
  };
}
