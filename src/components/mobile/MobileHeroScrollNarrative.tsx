import React, { useEffect, useState, useRef } from 'react';

interface ChapterConfig {
  num: string;
  tag: string;
  title: string;
  desc: string;
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
    desc: 'Custom layouts engineered to exact room measurements with waterproof HDHMR carcases and seamless cabinet alignment.',
    start: 0.06,
    peakIn: 0.12,
    peakOut: 0.23,
    end: 0.28,
  },
  {
    num: '02',
    tag: 'APPLIANCES & CABINETRY',
    title: 'Integrated Storage & Countertops',
    desc: 'Provisions for hobs, ovens, sinks, and tall pantry pull-outs with concealed soft-close runners.',
    start: 0.29,
    peakIn: 0.35,
    peakOut: 0.45,
    end: 0.50,
  },
  {
    num: '03',
    tag: 'MOISTURE & HEAT SEALING',
    title: 'Waterproof PUR Edge Banding',
    desc: 'Automated high-temp PUR edge banding seals every panel against steam and water with zero visible glue lines.',
    start: 0.51,
    peakIn: 0.57,
    peakOut: 0.67,
    end: 0.72,
  },
  {
    num: '04',
    tag: 'PRECISION AUTOMATION',
    title: 'Engineered for Generations',
    desc: 'Automated computerized machinery in Gandhinagar, tested for over 200,000 smooth opening cycles.',
    start: 0.73,
    peakIn: 0.79,
    peakOut: 0.89,
    end: 0.95,
  },
];

function calculateMobilePhaseStyle(
  progress: number,
  start: number,
  peakIn: number,
  peakOut: number,
  end: number
) {
  if (progress < start || progress > end) {
    return {
      opacity: 0,
      transform: 'translateY(16px)',
      pointerEvents: 'none' as const,
      visibility: 'hidden' as const,
    };
  }

  let opacity = 0;
  let translateY = 0;

  if (progress < peakIn) {
    const factor = (progress - start) / (peakIn - start);
    const eased = Math.sin((factor * Math.PI) / 2);
    opacity = eased;
    translateY = (1 - eased) * 16;
  } else if (progress <= peakOut) {
    opacity = 1;
    translateY = 0;
  } else {
    const factor = (progress - peakOut) / (end - peakOut);
    const eased = Math.sin((factor * Math.PI) / 2);
    opacity = 1 - eased;
    translateY = -eased * 16;
  }

  return {
    opacity: Number(opacity.toFixed(3)),
    transform: `translateY(${translateY.toFixed(1)}px)`,
    pointerEvents: opacity > 0.2 ? ('auto' as const) : ('none' as const),
    visibility: opacity > 0.005 ? ('visible' as const) : ('hidden' as const),
  };
}

export const MobileHeroScrollNarrative: React.FC = () => {
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

  // Active Chapter Index for progress pills
  const activeChapterIndex = CHAPTERS.findIndex(
    (ch) => scrollProgress >= ch.start && scrollProgress <= ch.end
  );

  return (
    <div className="fixed inset-x-0 bottom-6 z-30 pointer-events-none flex justify-center px-4">
      {CHAPTERS.map((ch, idx) => {
        const style = calculateMobilePhaseStyle(
          scrollProgress,
          ch.start,
          ch.peakIn,
          ch.peakOut,
          ch.end
        );

        return (
          <div
            key={ch.num}
            className="absolute bottom-0 w-full max-w-sm transition-none pointer-events-none"
            style={style}
          >
            {/* Ergonomic Floating Glass Card: Compact, highly readable, does not obscure 3D kitchen */}
            <div className="bg-white/85 backdrop-blur-xl border border-[#decbb8]/90 rounded-2xl p-4 shadow-[0_8px_25px_rgba(140,80,30,0.12)] space-y-2 pointer-events-auto">
              {/* Header Row: Chapter Tag + 4-Segment Progress Bar */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8c4c1d]" />
                  <span className="text-[9px] font-mono tracking-widest text-[#8c4c1d] uppercase font-semibold">
                    {ch.tag}
                  </span>
                </div>

                {/* 4 Mini Progress Segments */}
                <div className="flex items-center gap-1">
                  {CHAPTERS.map((_, dotIdx) => (
                    <div
                      key={dotIdx}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        dotIdx === (activeChapterIndex >= 0 ? activeChapterIndex : idx)
                          ? 'w-4 bg-[#8c4c1d]'
                          : 'w-1.5 bg-[#d6c4b2]/60'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Title */}
              <h2 className="font-serif text-lg font-normal tracking-tight text-[#26170f] leading-snug rich-brown-gradient">
                {ch.title}
              </h2>

              {/* Description */}
              <p className="text-[11px] text-[#523e32] font-normal leading-relaxed">
                {ch.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
