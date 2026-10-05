import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { useLocale } from '../context/LocaleContext';

const columns = Array.from({ length: 10 }, (_, i) => i);

/** The original monochrome dot wave, rendered as React-owned SVG. */
export function Preloader({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const { t } = useLocale();

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    let active = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const content = element.closest('.site')?.querySelector<HTMLElement>('.site-content');
    const image = content?.querySelector<HTMLImageElement>('.hero-image img');
    const stage = element.querySelector<SVGSVGElement>('.preloader-stage')!;
    const bar = element.querySelector<HTMLElement>('.site-preloader__bar-fill')!;
    const label = element.querySelector<HTMLElement>('.site-preloader__label')!;
    let removeImageListeners = () => {};
    let removeLoadListener = () => {};
    let minimumTimer = 0;
    let fallbackTimer = 0;

    const ctx = gsap.context(() => {
      if (content) gsap.set(content, { opacity: 0 });
      const dots = gsap.timeline({ repeat: -1 });
      dots.to('.preloader-col', {
        y: 11, duration: 1.5, ease: 'sine.inOut',
        stagger: { amount: 3, repeat: -1, yoyo: true }
      }, 0);
      columns.forEach(column => {
        dots.add(gsap.fromTo(`.preloader-col-${column} circle`, {
          y: (row: number) => gsap.utils.interpolate(77, -77, row / 10),
          transformOrigin: '50% 50%', scale: 0.133
        }, {
          y: (row: number) => gsap.utils.interpolate(column, -column, row / 10),
          scale: 0.8, duration: 1, ease: 'sine.inOut',
          repeat: -1, yoyo: true, yoyoEase: 'sine.in'
        }), column / 10);
      });
      dots.play(50);
      gsap.timeline()
        .to(bar, { width: '72%', duration: 1.25, ease: 'power2.out' })
        .to(bar, { width: '92%', duration: 1.1, ease: 'sine.inOut' });
    }, element);

    const pageReady = new Promise<void>(resolve => {
      if (document.readyState === 'complete') { resolve(); return; }
      const loaded = () => resolve();
      window.addEventListener('load', loaded, { once: true });
      removeLoadListener = () => window.removeEventListener('load', loaded);
    });
    const imageReady = new Promise<void>(resolve => {
      if (!image || image.complete) { resolve(); return; }
      const loaded = () => resolve();
      image.addEventListener('load', loaded, { once: true });
      image.addEventListener('error', loaded, { once: true });
      removeImageListeners = () => {
        image.removeEventListener('load', loaded);
        image.removeEventListener('error', loaded);
      };
    });
    const minimum = new Promise<void>(resolve => { minimumTimer = window.setTimeout(resolve, 1600); });
    const fallback = new Promise<void>(resolve => { fallbackTimer = window.setTimeout(resolve, 6000); });
    const ready = Promise.race([Promise.all([pageReady, imageReady, document.fonts.ready]), fallback]);

    Promise.all([ready, minimum]).then(() => {
      if (!active) return;
      window.clearTimeout(fallbackTimer);
      ctx.add(() => {
        gsap.killTweensOf(bar);
        gsap.to(bar, { width: '100%', duration: 0.45, ease: 'power2.out' });
        const exit = gsap.timeline({
          delay: 0.35, defaults: { ease: 'expo.inOut' },
          onComplete: () => { if (active) onComplete(); }
        });
        exit.to(stage, { scale: 0.92, opacity: 0, duration: 0.8 }, 0);
        exit.to([bar, label], { opacity: 0, y: -8, duration: 0.45 }, 0.05);
        exit.to(element, { yPercent: -100, duration: 1.05 }, 0.2);
        if (content) exit.to(content, { opacity: 1, duration: 0.45, ease: 'power2.out' }, 0.75);
      });
    });

    return () => {
      active = false;
      window.clearTimeout(minimumTimer);
      window.clearTimeout(fallbackTimer);
      removeImageListeners();
      removeLoadListener();
      ctx.revert();
      document.body.style.overflow = previousOverflow;
    };
  }, [onComplete]);

  return <div ref={root} className="site-preloader" id="sitePreloader" role="status" aria-label={t.loading}>
    <div className="site-preloader__inner">
      <svg aria-hidden="true" className="preloader-stage" viewBox="0 0 98 108">
        <defs><mask id="camila-loader-mask"><rect fill="#fff" width="10" height="10" /></mask></defs>
        {columns.map(column => <g key={column} className={`preloader-col preloader-col-${column}`} transform={`translate(${column * 10} 0)`}>
          {columns.map(row => <g key={row} className="preloader-box" transform={`translate(0 ${row * 10})`}><g mask="url(#camila-loader-mask)"><circle cx="5" cy="5" r="5" /></g></g>)}
        </g>)}
      </svg>
      <div className="site-preloader__bar" aria-hidden="true"><span className="site-preloader__bar-fill" /></div>
      <div className="site-preloader__label" aria-hidden="true">Loading</div>
    </div>
  </div>;
}
