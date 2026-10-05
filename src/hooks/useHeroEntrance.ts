import { useLayoutEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import type { Locale } from '../data/translations';
import { addTitleLetterReveal } from '../animations/titleLetterReveal';

/** One entrance per loading cycle; independent layers leave scroll and hover free. */
export function useHeroEntrance(scope: RefObject<HTMLDivElement | null>, ready: boolean, reduced: boolean, locale: Locale) {
  const finish = useRef<(() => void) | null>(null);
  useLayoutEffect(() => {
    const hero = scope.current?.querySelector<HTMLElement>('.hero');
    if (!hero || !ready || reduced) return;
    // A direct section link or restored scroll position goes straight to its destination.
    if (window.scrollY > 32 || (window.location.hash && !['#top', '#main-content'].includes(window.location.hash))) return;
    const letters = Array.from(hero.querySelectorAll<HTMLElement>('.hero-intro-char'));
    const copies = Array.from(hero.querySelectorAll<HTMLElement>('[data-hero-intro-copy]'));
    const words = copies.flatMap(copy => Array.from(copy.querySelectorAll<HTMLElement>('.hero-intro-text')));
    let timeline: gsap.core.Timeline;
    const context = gsap.context(() => {
      hero.dataset.heroEntrance = 'running';
      timeline = gsap.timeline({
        onComplete: () => {
          [...letters, ...words].forEach(element => element.style.removeProperty('transform'));
          hero.dataset.heroEntrance = 'complete';
        }
      });
      // The loading exits first; each letter rolls down into its existing mask.
      addTitleLetterReveal(timeline, letters, .04, 1, .5);
      copies.forEach((copy, group) => {
        const tokens = copy.querySelectorAll<HTMLElement>('.hero-intro-text');
        timeline.fromTo(tokens, { yPercent: 115 }, {
          yPercent: 0, duration: .82, ease: 'power2.out',
          stagger: index => index * .026 + Math.sin(index * .65) * .012
        }, .18 + group * .065);
      });
    }, hero);
    const complete = () => { timeline!.progress(1).kill(); };
    const scroll = () => { if (window.scrollY > 32) complete(); };
    finish.current = complete;
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', complete);
    return () => {
      finish.current = null;
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', complete);
      context.revert();
      delete hero.dataset.heroEntrance;
    };
  }, [scope, ready, reduced]);
  // Translated words can change their wrapping; settle the current entrance instead of replaying it.
  useLayoutEffect(() => { finish.current?.(); }, [locale]);
}
