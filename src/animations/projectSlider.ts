import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { addTitleLetterReveal } from './titleLetterReveal';

/** The demo's opposing wrappers and character entrance, driven by native page scroll. */
export function initProjectSlider(root: HTMLElement, hasVideoIntro = false) {
  const panels = Array.from(root.querySelectorAll<HTMLElement>('.project-panel'));
  const outer = panels.map(panel => panel.querySelector<HTMLElement>('.project-outer')!);
  const inner = panels.map(panel => panel.querySelector<HTMLElement>('.project-inner')!);
  const scenes = panels.map(panel => panel.querySelector<HTMLElement>('.project-scene')!);
  const chars = panels.map(panel => Array.from(panel.querySelectorAll<HTMLElement>('.project-heading-char')));
  const details = panels.map(panel => Array.from(panel.querySelectorAll<HTMLElement>('.project-category, .project-panel-bottom')));
  const controls = Array.from(root.querySelectorAll<HTMLAnchorElement>('[data-project-go]'));
  let current = 0;
  let desired = 0;
  let animating = false;
  let entered = false;
  let disposed = false;
  let timeline: gsap.core.Timeline | undefined;
  const context = gsap.context(() => {}, root);

  const announce = (index: number) => {
    panels.forEach((panel, i) => {
      if (i !== index && panel.contains(document.activeElement)) controls[index]?.focus({ preventScroll: true });
      panel.inert = i !== index;
      panel.setAttribute('aria-hidden', String(i !== index));
    });
    root.dataset.currentProject = String(index);
    root.dispatchEvent(new CustomEvent('project:change', { detail: index }));
  };
  context.add('settle', (index: number) => {
    timeline?.kill();
    animating = false;
    current = desired = index;
    gsap.set(panels, { autoAlpha: i => i === index ? 1 : 0, zIndex: i => i === index ? 1 : 0 });
    gsap.set([...outer, ...inner, ...scenes], { yPercent: 0 });
    gsap.set(chars.flat(), { autoAlpha: 1 });
    // The hero's reveal controls the first title until its video handoff ends.
    gsap.set((hasVideoIntro ? chars.slice(1) : chars).flat(), { yPercent: 0 });
    gsap.set(details.flat(), { autoAlpha: 1, y: 0 });
    announce(index);
  });
  context.add('transition', (index: number, direction: number, first = false) => {
    if (disposed || animating || (index === current && !first)) return;
    animating = true;
    const previous = first ? -1 : current;
    const factor = direction < 0 ? -1 : 1;
    timeline = gsap.timeline({
      defaults: { duration: 1.25, ease: 'power1.inOut' },
      onComplete: () => {
        animating = false;
        if (!disposed && desired !== current) context.transition(desired, desired > current ? 1 : -1);
      }
    });
    if (previous >= 0) {
      gsap.set(panels[previous], { zIndex: 0 });
      timeline.to(scenes[previous], { yPercent: -15 * factor }, 0)
        .set(panels[previous], { autoAlpha: 0 });
    }
    gsap.set(panels[index], { autoAlpha: 1, zIndex: 1 });
    timeline.fromTo([outer[index], inner[index]], {
      yPercent: i => i ? -100 * factor : 100 * factor
    }, { yPercent: 0 }, 0)
      .fromTo(scenes[index], { yPercent: 15 * factor }, { yPercent: 0 }, 0);
    addTitleLetterReveal(timeline, chars[index], .2, .9, .38);
    timeline.fromTo(details[index], { autoAlpha: 0, y: 12 * factor }, {
        autoAlpha: 1, y: 0, duration: .8, stagger: .08
      }, .45);
    current = index;
    announce(index);
  });
  const indexAt = (progress: number) => Math.min(panels.length - 1, Math.floor(progress * panels.length));
  const request = (index: number) => {
    desired = index;
    if (desired !== current) context.transition(desired, desired > current ? 1 : -1);
  };
  context.settle(0);
  const scroll = ScrollTrigger.create({
    trigger: root,
    start: () => `top ${document.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 86}px`,
    end: 'bottom bottom',
    invalidateOnRefresh: true,
    onUpdate: self => request(indexAt(self.progress)),
    onRefresh: self => context.settle(indexAt(self.progress)),
    onLeave: () => context.settle(panels.length - 1),
    onLeaveBack: () => context.settle(0)
  });
  const entrance = hasVideoIntro ? undefined : ScrollTrigger.create({
    trigger: root, start: 'top 78%', end: 'top top',
    onEnter: () => {
      if (entered) return;
      entered = true;
      if (window.scrollY < scroll.start + 1) context.transition(0, 1, true);
    }
  });
  const keydown = (event: KeyboardEvent) => {
    if (document.querySelector('dialog[open]') || event.altKey || event.metaKey || event.ctrlKey) return;
    const direction = ['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : ['ArrowUp', 'ArrowLeft'].includes(event.key) ? -1 : 0;
    if (!direction) return;
    const next = current + direction;
    if (next < 0 || next >= panels.length) return;
    event.preventDefault();
    controls[next]?.focus({ preventScroll: true });
    window.scrollTo({ top: scroll.start + (scroll.end - scroll.start) * (next === 0 && hasVideoIntro ? .4 : next + .2) / panels.length, behavior: 'smooth' });
  };
  root.addEventListener('keydown', keydown);
  return () => {
    disposed = true;
    root.removeEventListener('keydown', keydown);
    scroll.kill();
    entrance?.kill();
    timeline?.kill();
    context.revert();
    delete root.dataset.currentProject;
    panels.forEach(panel => { panel.inert = false; panel.removeAttribute('aria-hidden'); });
    // The enclosing matchMedia context also reverts its nested contexts. Clear only the
    // properties owned by this scene so a second revert cannot retain an identity matrix.
    [...panels, ...outer, ...inner, ...scenes, ...chars.flat(), ...details.flat()].forEach(element => {
      ['transform', 'opacity', 'visibility', 'z-index'].forEach(property => element.style.removeProperty(property));
    });
  };
}
