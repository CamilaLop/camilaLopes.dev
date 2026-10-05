import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

type MotionPreference = 'system' | 'full' | 'reduce';
const storageKey = 'camila-portfolio-motion';

/** One effective preference drives both CSS and GSAP, including a visitor's choice. */
export function useMotionPreference() {
  const [preference, setPreference] = useState<MotionPreference>(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved === 'full' || saved === 'reduce') return saved;
    } catch { /* The choice still works for this visit when storage is unavailable. */ }
    return 'system';
  });
  const [systemReduced, setSystemReduced] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const reduced = preference === 'reduce' || (preference === 'system' && systemReduced);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setSystemReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useLayoutEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'reduce' : 'full';
    return () => { delete document.documentElement.dataset.motion; };
  }, [reduced]);

  const choose = useCallback((next: MotionPreference) => {
    setPreference(next);
    try {
      if (next === 'system') window.localStorage.removeItem(storageKey);
      else window.localStorage.setItem(storageKey, next);
    } catch { /* A blocked storage API must never block the interface. */ }
  }, []);

  return { reduced, choose };
}
