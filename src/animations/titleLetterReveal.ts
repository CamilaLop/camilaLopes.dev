import gsap from 'gsap';

/** One pass from above; its host timeline owns the loading or scroll timing. */
export function addTitleLetterReveal(
  timeline: gsap.core.Timeline, letters: HTMLElement[], position = 0,
  duration = 1, staggerAmount = .45
) {
  if (!letters.length) return timeline;
  // A delayed stagger otherwise applies its first pose only as each tween starts.
  gsap.set(letters, { yPercent: -120 });
  return timeline.fromTo(letters, { yPercent: -120 }, {
    yPercent: 0, duration, ease: 'expo.inOut',
    stagger: { amount: staggerAmount, from: 'start' }
  }, position);
}

/** Services uses this only when the circular handoff is unavailable. */
export function initScrollTitleReveals(scope: HTMLElement, desktop: boolean, circularServices: boolean) {
  scope.querySelectorAll<HTMLElement>('[data-title-reveal]').forEach(title => {
    if (circularServices && title.closest('#services')) return;
    const letters = Array.from(title.querySelectorAll<HTMLElement>('[data-title-char]'));
    const timeline = gsap.timeline({
      scrollTrigger: {
        id: `title-${title.id}`, trigger: title,
        start: 'clamp(top 92%)', end: 'clamp(top 48%)',
        scrub: desktop ? .65 : .45, invalidateOnRefresh: true
      }
    });
    addTitleLetterReveal(timeline, letters);
  });
}
