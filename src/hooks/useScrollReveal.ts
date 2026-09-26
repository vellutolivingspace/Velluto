import { useEffect } from 'react';

export const useScrollReveal = () => {
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          entry.target.setAttribute('data-revealed', 'true');
          // Once revealed, unobserve to maintain performance
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1,
    });

    const elements = document.querySelectorAll(
      '.scroll-reveal, .scroll-reveal-scale, .scroll-reveal-line, .folio-page'
    );

    elements.forEach((el) => {
      if (el.getAttribute('data-revealed') === 'true') {
        el.classList.add('is-revealed');
      } else {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);
};
