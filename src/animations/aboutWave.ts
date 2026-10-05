import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Called inside the portfolio's matchMedia context, which reverts all layers. */
export function initAboutWave(scope: HTMLElement, desktop: boolean) {
  const about = scope.querySelector<HTMLElement>('#about');
  if (!about) return;

  gsap.utils.toArray<HTMLElement>('[data-skills-wave]', about).forEach((group, index) => {
    gsap.fromTo(group.querySelectorAll('.skills-wave-char'), { yPercent: 115 }, {
      yPercent: 0,
      duration: .9,
      ease: 'power2.out',
      stagger: letter => letter * .007 + Math.sin(letter * .65) * .009,
      delay: desktop ? index * .045 : 0,
      scrollTrigger: {
        id: `about-skills-wave-${index}`,
        trigger: group,
        start: 'clamp(top 92%)',
        end: 'clamp(top 60%)',
        scrub: .65,
        invalidateOnRefresh: true
      }
    });
  });

  const frame = about.querySelector<HTMLElement>('[data-portrait-reveal]');
  const mask = frame?.querySelector<HTMLElement>('.portrait-wave-mask');
  const image = frame?.querySelector('img');
  if (!frame || !mask || !image) return;

  gsap.set(mask, { display: 'grid' });
  const reveal = gsap.timeline({
    scrollTrigger: {
      id: 'about-portrait-wave',
      trigger: frame,
      start: 'clamp(top 92%)',
      end: 'clamp(top 28%)',
      scrub: desktop ? .8 : .65,
      invalidateOnRefresh: true
    }
  });
  reveal.fromTo(mask.children, { yPercent: 0 }, {
    yPercent: -101,
    duration: 1.15,
    ease: 'power2.out',
    stagger: index => index * .035 + Math.sin(index * .8) * .012
  }, 0);
  reveal.fromTo(image, { yPercent: desktop ? 5 : 3, scale: 1.035 }, {
    yPercent: 0, scale: 1, duration: 1.45, ease: 'none'
  }, 0);
}
