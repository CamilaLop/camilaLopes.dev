import { useLayoutEffect, type RefObject } from 'react';
import { initPortfolioAnimations } from '../animations/portfolioAnimations';
import type { Locale } from '../data/translations';

export function usePortfolioAnimations(scope: RefObject<HTMLDivElement | null>, locale: Locale, ready: boolean, reduced: boolean) {
  useLayoutEffect(() => {
    if (scope.current && ready) return initPortfolioAnimations(scope.current, reduced);
  }, [scope, locale, ready, reduced]);
}
