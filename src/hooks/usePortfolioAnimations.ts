import { useEffect, useLayoutEffect, type RefObject } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initPortfolioAnimations } from '../animations/portfolioAnimations';
import type { Locale } from '../data/translations';

export function usePortfolioAnimations(
  scope: RefObject<HTMLDivElement | null>,
  locale: Locale,
  ready: boolean,
  reduced: boolean
) {
  useLayoutEffect(() => {
    if (!scope.current || !ready) return;

    let cleanup: void | (() => void);

    try {
      cleanup = initPortfolioAnimations(scope.current, reduced);
    } catch (error) {
      console.error('[portfolio] animation setup failed', error);
      return;
    }

    return () => {
      try {
        cleanup?.();
      } catch (error) {
        console.warn('[portfolio] animation cleanup failed', error);
      }
    };
  }, [scope, ready, reduced]);

  useEffect(() => {
    if (!ready) return;

    const frame = window.requestAnimationFrame(() => {
      try {
        ScrollTrigger.refresh(true);
      } catch (error) {
        console.warn('[portfolio] scroll refresh failed after locale change', error);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [locale, ready]);
}