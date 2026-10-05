import gsap from 'gsap';

/** The pointer tilts its own layer; scroll and image reveal retain their transforms. */
export function initCasesPerspective(scope: HTMLElement) {
  const media = gsap.matchMedia();
  media.add('(hover: hover) and (pointer: fine)', () => {
    const cleanups: (() => void)[] = [];
    scope.querySelectorAll<HTMLElement>('.case-perspective').forEach(frame => {
      const pose = frame.querySelector<HTMLElement>('.case-pointer-pose');
      const image = frame.querySelector<HTMLElement>('.case-image-parallax');
      if (!pose || !image) return;
      const rx = gsap.quickTo(pose, 'rotationX', { duration: .8, ease: 'power3.out' });
      const ry = gsap.quickTo(pose, 'rotationY', { duration: .8, ease: 'power3.out' });
      const x = gsap.quickTo(image, 'x', { duration: .8, ease: 'power3.out' });
      const y = gsap.quickTo(image, 'y', { duration: .8, ease: 'power3.out' });
      const leave = () => { rx(0); ry(0); x(0); y(0); };
      const move = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse' || document.querySelector('dialog[open]')) return;
        const box = frame.getBoundingClientRect();
        const px = gsap.utils.clamp(0, 1, (event.clientX - box.left) / box.width);
        const py = gsap.utils.clamp(0, 1, (event.clientY - box.top) / box.height);
        rx(gsap.utils.interpolate(10, -10, py));
        ry(gsap.utils.interpolate(-10, 10, px));
        x(gsap.utils.interpolate(-16, 16, px));
        y(gsap.utils.interpolate(-10, 10, py));
      };
      frame.addEventListener('pointermove', move);
      frame.addEventListener('pointerleave', leave);
      frame.addEventListener('pointercancel', leave);
      frame.addEventListener('focusout', leave);
      cleanups.push(() => {
        frame.removeEventListener('pointermove', move);
        frame.removeEventListener('pointerleave', leave);
        frame.removeEventListener('pointercancel', leave);
        frame.removeEventListener('focusout', leave);
        [rx, ry, x, y].forEach(set => set.tween.kill());
      });
    });
    return () => cleanups.forEach(cleanup => cleanup());
  }, scope);
  return () => media.revert();
}
