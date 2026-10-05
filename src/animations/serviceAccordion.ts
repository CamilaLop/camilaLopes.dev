import gsap from 'gsap';

/** Keep the native disclosure and animate only its description's measured height. */
export function initServiceAccordion(scope: HTMLElement, reduced: boolean) {
  const root = scope.querySelector<HTMLElement>('#services');
  const stage = root?.querySelector<HTMLElement>('.services-circular-stage');
  if (!root) return () => {};
  const active = new Set<HTMLDetailsElement>();
  let disposed = false;

  const syncHeight = () => {
    if (root.dataset.circularReveal !== 'true' || !stage) return;
    const travel = Number.parseFloat(root.style.getPropertyValue('--services-circle-travel')) || 0;
    // Follow the local layout during expansion without rebuilding the scroll scenes.
    root.style.height = `${Math.ceil(stage.offsetHeight + travel)}px`;
  };
  const settled = () => {
    syncHeight();
    if (!disposed && active.size === 0) root.dispatchEvent(new Event('services:layout', { bubbles: true }));
  };

  const cleanups = Array.from(root.querySelectorAll<HTMLDetailsElement>('.service-row')).map(row => {
    const summary = row.querySelector<HTMLElement>('summary');
    const panel = row.querySelector<HTMLElement>('.service-description-panel');
    if (!summary || !panel) return () => {};
    let expanded = row.open;
    let animation: gsap.core.Tween | undefined;

    const reflect = () => {
      row.dataset.expanded = String(expanded);
      summary.setAttribute('aria-expanded', String(expanded));
      panel.inert = row.open && !expanded;
    };
    const finish = (notify = true) => {
      animation?.kill();
      animation = undefined;
      row.open = expanded;
      panel.style.removeProperty('height');
      delete row.dataset.animating;
      active.delete(row);
      reflect();
      if (notify) settled();
    };
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      event.preventDefault();
      // Read the current frame before cancelling, so repeated clicks reverse smoothly.
      const from = row.open ? panel.getBoundingClientRect().height : 0;
      animation?.kill();
      expanded = !expanded;
      panel.style.height = `${from}px`;
      row.open = true;
      reflect();
      const to = expanded ? panel.scrollHeight : 0;
      if (reduced || Math.abs(to - from) < 1) { finish(); return; }
      active.add(row);
      row.dataset.animating = 'true';
      animation = gsap.to(panel, {
        height: to,
        duration: Math.min(.42, Math.max(.24, .18 + Math.abs(to - from) * .0018)),
        ease: 'power2.inOut',
        onUpdate: syncHeight,
        onComplete: () => finish()
      });
    };
    const toggle = () => {
      // Also support a browser opening a disclosure through Find in page.
      if (animation || row.open === expanded) return;
      expanded = row.open;
      reflect();
      settled();
    };
    const resize = () => { if (animation) finish(); };
    reflect();
    summary.addEventListener('click', click);
    row.addEventListener('toggle', toggle);
    window.addEventListener('resize', resize);
    return () => {
      summary.removeEventListener('click', click);
      row.removeEventListener('toggle', toggle);
      window.removeEventListener('resize', resize);
      finish(false);
      delete row.dataset.expanded;
      panel.inert = false;
      summary.removeAttribute('aria-expanded');
    };
  });

  return () => {
    disposed = true;
    cleanups.forEach(cleanup => cleanup());
  };
}
