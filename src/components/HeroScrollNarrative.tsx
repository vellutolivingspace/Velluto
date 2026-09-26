import React, { useEffect, useState, useRef } from 'react';

interface ChapterConfig {
  num: string;
  tag: string;
  title: string;
  desc: string;
  alignment: 'left' | 'right' | 'center';
  start: number;
  peakIn: number;
  peakOut: number;
  end: number;
}

const CHAPTERS: ChapterConfig[] = [
  {
    num: '01',
    tag: 'FACTORY-BUILT KITCHENS',
    title: 'Precision Modular Kitchens',
    desc: 'Custom kitchen layouts engineered to exact room measurements with waterproof HDHMR carcases and seamless cabinet alignment.',
    alignment: 'left',
    start: 0.07,
    peakIn: 0.13,
    peakOut: 0.22,
    end: 0.28,
  },
  {
    num: '02',
    tag: 'APPLIANCES & CABINETRY',
    title: 'Integrated Storage & Countertops',
    desc: 'Built-in provisions for hobs, ovens, sinks, and tall pantry pull-outs with concealed soft-close drawer runners.',
    alignment: 'right',
    start: 0.29,
    peakIn: 0.35,
    peakOut: 0.44,
    end: 0.50,
  },
  {
    num: '03',
    tag: 'MOISTURE & HEAT SEALING',
    title: 'Waterproof PUR Edge Banding',
    desc: 'Automated high-temperature PUR edge banding seals every panel against steam, water, and cooking heat with zero visible glue lines.',
    alignment: 'left',
    start: 0.51,
    peakIn: 0.57,
    peakOut: 0.66,
    end: 0.72,
  },
  {
    num: '04',
    tag: 'PRECISION AUTOMATION // BUILT TO LAST',
    title: 'Engineered for Generations.',
    desc: 'Manufactured with automated computerized machinery in Gandhinagar, tested for over 200,000 smooth opening cycles with lifetime soft-close operation.',
    alignment: 'center',
    start: 0.73,
    peakIn: 0.79,
    peakOut: 0.88,
    end: 0.94,
  },
];

function calculatePhaseStyle(
  progress: number,
  start: number,
  peakIn: number,
  peakOut: number,
  end: number
) {
  if (progress < start || progress > end) {
    return {
      opacity: 0,
      transform: 'translateY(28px) scale(0.96)',
      filter: 'blur(6px)',
      pointerEvents: 'none' as const,
      visibility: 'hidden' as const,
    };
  }

  let opacity = 0;
  let translateY = 0;
  let scale = 1;
  let blur = 0;

  if (progress < peakIn) {
    const factor = (progress - start) / (peakIn - start);
    const eased = Math.sin((factor * Math.PI) / 2);
    opacity = eased;
    translateY = (1 - eased) * 28;
    scale = 0.96 + eased * 0.04;
    blur = (1 - eased) * 6;
  } else if (progress <= peakOut) {
    opacity = 1;
    translateY = 0;
    scale = 1;
    blur = 0;
  } else {
    const factor = (progress - peakOut) / (end - peakOut);
    const eased = Math.sin((factor * Math.PI) / 2);
    opacity = 1 - eased;
    translateY = -eased * 28;
    scale = 1 - eased * 0.04;
    blur = eased * 6;
  }

  return {
    opacity: Number(opacity.toFixed(3)),
    transform: `translateY(${translateY.toFixed(1)}px) scale(${scale.toFixed(3)})`,
    filter: `blur(${blur.toFixed(1)}px)`,
    pointerEvents: opacity > 0.2 ? ('auto' as const) : ('none' as const),
    visibility: opacity > 0.005 ? ('visible' as const) : ('hidden' as const),
  };
}

export const HeroScrollNarrative: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInSequence, setIsInSequence] = useState(false);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

      rafIdRef.current = requestAnimationFrame(() => {
        const hero = document.getElementById('hero');
        if (!hero) return;

        const rect = hero.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const totalScrollable = rect.height - windowHeight;

        if (totalScrollable <= 0) return;

        const currentScroll = -rect.top;
        const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
        setScrollProgress(progress);
        setIsInSequence(progress > 0.05 && progress < 0.96);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  if (!isInSequence) return null;

  return (
    <div className="fixed inset-0 z-30 pointer-events-none flex items-center justify-center">
      {CHAPTERS.map((ch) => {
        const style = calculatePhaseStyle(
          scrollProgress,
          ch.start,
          ch.peakIn,
          ch.peakOut,
          ch.end
        );

        let containerClasses = 'absolute max-w-xl px-6 sm:px-10 transition-none pointer-events-none';
        if (ch.alignment === 'left') {
          containerClasses += ' left-4 sm:left-12 lg:left-24 top-1/2 -translate-y-1/2 text-left';
        } else if (ch.alignment === 'right') {
          containerClasses += ' right-4 sm:right-12 lg:right-24 top-1/2 -translate-y-1/2 text-left sm:text-right';
        } else {
          containerClasses += ' left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center max-w-2xl';
        }

        return (
          <div key={ch.num} className={containerClasses} style={style}>
            {/* FULLY TRANSPARENT: No background card or border, pure floating typography */}
            <div className="bg-transparent border-0 p-0 shadow-none space-y-3">
              {/* Tag / Category */}
              <div
                className={`flex items-center gap-2.5 ${
                  ch.alignment === 'right'
                    ? 'justify-start sm:justify-end'
                    : ch.alignment === 'center'
                    ? 'justify-center'
                    : 'justify-start'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#8c4c1d]" />
                <span className="text-[11px] font-mono tracking-widest text-[#8c4c1d] uppercase font-medium drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
                  {ch.tag}
                </span>
              </div>

              {/* Title in Rich Brown Gradient */}
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-normal tracking-tight leading-[1.15] rich-brown-gradient drop-shadow-[0_2px_12px_rgba(255,255,255,0.8)]">
                {ch.title}
              </h2>

              {/* Subtitle / Description in Warm Espresso */}
              <p className="text-xs sm:text-sm lg:text-base text-[#4a3629] font-normal leading-relaxed max-w-lg mx-auto drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
                {ch.desc}
              </p>

              {/* Subtle Rich Brown Accent Hairline */}
              <div
                className={`pt-1 flex ${
                  ch.alignment === 'right'
                    ? 'justify-start sm:justify-end'
                    : ch.alignment === 'center'
                    ? 'justify-center'
                    : 'justify-start'
                }`}
              >
                <div className="w-20 h-[1.5px] bg-gradient-to-r from-[#8c4c1d] via-[#c8824a] to-transparent" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
