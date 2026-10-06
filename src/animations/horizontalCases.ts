import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(ScrollTrigger, Observer);
const resumePoints = new WeakMap<HTMLElement, number>();

/** Native page scroll centers each project while its neighbors turn and recede in depth. */
export function initHorizontalCases(scope: HTMLElement, desktop: boolean) {
  const root = scope.querySelector<HTMLElement>('.gallery--horizontal');
  const lane = root?.querySelector<HTMLElement>('.cases-lane');
  const stage = root?.querySelector<HTMLElement>('.cases-stage');
  const viewport = root?.querySelector<HTMLElement>('.cases-viewport');
  const track = root?.querySelector<HTMLElement>('.cases-track');
  const fill = root?.querySelector<HTMLElement>('.cases-progress-fill');
  if (!root || !lane || !stage || !viewport || !track || !fill) return;

  const cards = Array.from(track.querySelectorAll<HTMLElement>('.gallery-case'));
  const originalHeight = lane.style.height;
  const resume = resumePoints.get(root);
  resumePoints.delete(root);
  const context = gsap.context(() => {}, root);
  let distance = 0;
  let travel = 0;
  let stops: number[] = [];
  let current = -1;
  let disposed = false;
  let suppressClickUntil = 0;
  let touchDistance = 0;
  let swiping = false;
  let observer: Observer | undefined;
  let movement!: gsap.core.Tween;
  let remembered: number | undefined;
  let restoreFrame = 0;
  root.dataset.casesMode = 'scroll';
  viewport.scrollLeft = 0;

  const measure = () => {
    const origin = cards[0]?.offsetLeft ?? 0;
    stops = cards.map(card => card.offsetLeft - origin);
    distance = Math.max(1, stops[stops.length - 1] ?? 0);
    travel = distance * (desktop ? 1.02 : 1.1);
    const exit = window.innerHeight * 1.1;
    lane.style.height = `${Math.ceil(stage.offsetHeight + travel + exit)}px`;
    lane.style.setProperty('--cases-scroll-travel', `${travel}px`);
    lane.style.setProperty('--cases-exit-travel', `${exit}px`);
  };
  const update = () => {
    if (disposed) return;
    const position = Math.max(0, Math.min(distance, -Number(gsap.getProperty(track, 'x'))));
    const width = viewport.clientWidth;
    cards.forEach((card, index) => {
      // Use layout centers, not transformed bounds, to avoid a feedback loop in the 3D pose.
      const relative = stops[index] - position;
      gsap.set(card, {
        rotationY: gsap.utils.clamp(-45, 45, relative / (width * .5) * 45),
        scale: Math.max(.7, 1 - Math.abs(relative) / (width * 1.8)),
        z: -Math.min(Math.abs(relative), width) * .4
      });
    });
    fill.style.transform = `scaleX(${position / distance})`;
    const next = stops.reduce((best, stop, index) => Math.abs(stop - position) < Math.abs(stops[best] - position) ? index : best, 0);
    if (next !== current) {
      current = next;
      root.dispatchEvent(new CustomEvent('cases:progress', { detail: { index: current } }));
    }
  };
  const setGestureActive = (active: boolean) => {
    if (active) observer?.enable();
    else observer?.disable();
  };

  measure();
  context.add(() => {
    movement = gsap.fromTo(track, { x: 0 }, {
      x: () => -distance,
      duration: 1,
      ease: 'none',
      onUpdate: update,
      scrollTrigger: {
        id: 'cases-diagonal', // The Services semicircle shares this scroll boundary.
        trigger: lane,
        start: () => `top ${scope.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 86}px`,
        end: () => `+=${travel}`,
        scrub: desktop ? .85 : .65,
        invalidateOnRefresh: true,
        onRefreshInit: measure,
        onRefresh: self => { update(); setGestureActive(self.isActive); },
        onToggle: self => setGestureActive(self.isActive)
      }
    });

    cards.forEach((card, index) => {
      const mask = card.querySelector<HTMLElement>('.gallery-wave-mask');
      const image = card.querySelector('img');
      const caption = card.querySelector<HTMLElement>('.gallery-caption');
      if (!mask || !image || !caption) return;
      gsap.set(mask, { display: 'grid' });
      const reveal = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: `cases-image-${index}`, trigger: lane,
          // The first card enters vertically; later cards reveal as they
          // approach the center along the existing horizontal scroll interval.
          start: index === 0 ? 'clamp(top 92%)' : () =>
            movement.scrollTrigger!.start + Math.max(0, stops[index] - viewport.clientWidth * .6) / distance * travel,
          end: index === 0 ? 'clamp(top 34%)' : () =>
            movement.scrollTrigger!.start + stops[index] / distance * travel,
          scrub: .65, invalidateOnRefresh: true
        }
      });
      reveal.fromTo(mask.children, { yPercent: 0 }, {
        yPercent: -101, duration: 1.15, ease: 'power2.out',
        stagger: column => column * .035 + Math.sin(column * .8) * .012
      }, 0);
      reveal.fromTo(image, { yPercent: desktop ? 5 : 3, scale: 1.035 }, {
        yPercent: 0, scale: 1, duration: 1.45
      }, 0);
      reveal.fromTo(caption, { y: 16, opacity: .5 }, { y: 0, opacity: 1, duration: .8 }, .2);
    });
  });

  const navigate = (index: number) => {
    const scroll = movement.scrollTrigger;
    if (!scroll || disposed || document.querySelector('dialog[open]')) return;
    const target = Math.max(0, Math.min(cards.length - 1, index));
    window.scrollTo({ top: scroll.start + travel * stops[target] / distance, behavior: 'smooth' });
  };
  const navigateEvent = (event: Event) => navigate((event as CustomEvent<{ index: number }>).detail.index);
  const focus = (event: FocusEvent) => {
    const card = (event.target as HTMLElement).closest<HTMLElement>('.gallery-case');
    const index = card ? cards.indexOf(card) : -1;
    if (!card || index < 0 || !(event.target as HTMLElement).matches(':focus-visible')) return;
    if (Math.abs(-Number(gsap.getProperty(track, 'x')) - stops[index]) > 1) navigate(index);
  };
  root.addEventListener('cases:navigate', navigateEvent);
  viewport.addEventListener('focusin', focus);
  const swipeClick = (event: MouseEvent) => {
    if (performance.now() >= suppressClickUntil || event.detail === 0) return;
    suppressClickUntil = 0;
    event.preventDefault();
    event.stopPropagation();
  };
  viewport.addEventListener('click', swipeClick, true);

  // A sideways touch or trackpad gesture advances the same native scroll interval.
  // Vertical gestures retain the browser's normal page scrolling.
  observer = Observer.create({
    id: 'cases-sideways-gesture', target: viewport, type: 'wheel,touch',
    preventDefault: false, lockAxis: true, tolerance: 4,
    ignore: 'dialog, input, textarea, select',
    onPress: () => { suppressClickUntil = 0; touchDistance = 0; swiping = false; },
    onChangeX: self => {
      if (!movement.scrollTrigger?.isActive || document.querySelector('dialog[open]')) return;
      const wheel = self.event.type === 'wheel';
      let delta = self.deltaX;
      if (!wheel) {
        touchDistance += delta;
        if (!swiping) {
          if (Math.abs(touchDistance) < 12) return;
          swiping = true;
          delta = touchDistance;
        }
        suppressClickUntil = performance.now() + 400;
      }
      window.scrollBy({ top: delta * (wheel ? 1 : -1) * travel / distance, behavior: 'instant' });
    }
  });
  setGestureActive(Boolean(movement.scrollTrigger?.isActive));
  update();

  const remember = () => {
    const scroll = movement.scrollTrigger;
    if (!scroll) return;
    const position = window.scrollY;
    remembered = position >= scroll.start && position <= scroll.end
      ? gsap.utils.clamp(0, 1, (position - scroll.start) / (scroll.end - scroll.start)) : undefined;
  };
  remember();
  window.addEventListener('scroll', remember, { passive: true });
  // A locale rebuild briefly removes the lane. Resume its scroll position after layout settles.
  if (resume !== undefined) restoreFrame = window.requestAnimationFrame(() => {
    restoreFrame = 0;
    if (disposed || !movement.scrollTrigger) return;
    ScrollTrigger.refresh();
    const restore = () => {
      if (disposed || !movement.scrollTrigger) return;
      const scroll = movement.scrollTrigger;
      window.scrollTo({ top: scroll.start + (scroll.end - scroll.start) * resume, behavior: 'instant' });
      ScrollTrigger.update();
      movement.totalProgress(resume);
      update();
    };
    restore();
    restoreFrame = window.requestAnimationFrame(() => { restoreFrame = 0; restore(); });
  });

  return () => {
    const point = restoreFrame && resume !== undefined ? resume : remembered;
    if (point !== undefined) {
      resumePoints.set(root, point);
      window.requestAnimationFrame(() => { if (resumePoints.get(root) === point) resumePoints.delete(root); });
    }
    disposed = true;
    window.removeEventListener('scroll', remember);
    window.cancelAnimationFrame(restoreFrame);
    root.removeEventListener('cases:navigate', navigateEvent);
    viewport.removeEventListener('focusin', focus);
    viewport.removeEventListener('click', swipeClick, true);
    observer?.kill();
    context.revert();
    lane.style.height = originalHeight;
    delete root.dataset.casesMode;
    track.style.removeProperty('transform');
    lane.style.removeProperty('--cases-scroll-travel');
    lane.style.removeProperty('--cases-exit-travel');
    fill.style.removeProperty('transform');
    cards.forEach(card => { card.style.removeProperty('transform'); card.querySelectorAll<HTMLElement>('.case-reveal-mask, .case-reveal-surface, .case-scroll-pose, img, .gallery-caption').forEach(element => {
      element.style.removeProperty('transform');
      element.style.removeProperty('opacity');
    }); });
    viewport.scrollLeft = (cards[Math.max(0, current)]?.offsetLeft ?? 0) - (cards[0]?.offsetLeft ?? 0);
  };
}
