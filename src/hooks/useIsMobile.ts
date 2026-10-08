import { useState, useEffect } from 'react';

/**
 * Responsive device & viewport detection hook.
 * Detects mobile screens (< 768px width) and updates on resize/orientation change.
 */
export const useIsMobile = (breakpoint = 768): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const isMobilePhone =
      typeof navigator !== 'undefined' &&
      /iPhone|iPod|Android/i.test(navigator.userAgent) &&
      !/iPad/i.test(navigator.userAgent);
    return isMobilePhone || window.innerWidth < breakpoint;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isMobilePhone =
      typeof navigator !== 'undefined' &&
      /iPhone|iPod|Android/i.test(navigator.userAgent) &&
      !/iPad/i.test(navigator.userAgent);

    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const updateMatch = () => {
      setIsMobile(isMobilePhone || mql.matches || window.innerWidth < breakpoint);
    };

    updateMatch();

    try {
      mql.addEventListener('change', updateMatch);
    } catch {
      // Fallback for older browsers
      mql.addListener(updateMatch);
    }

    window.addEventListener('resize', updateMatch, { passive: true });

    return () => {
      try {
        mql.removeEventListener('change', updateMatch);
      } catch {
        mql.removeListener(updateMatch);
      }
      window.removeEventListener('resize', updateMatch);
    };
  }, [breakpoint]);

  return isMobile;
};
