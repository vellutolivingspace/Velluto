import React, { useEffect, useRef, useState, useCallback } from 'react';
import { VellutoLogo } from './VellutoLogo';

const TOTAL_FRAMES = 300;
const SMOOTHING_FACTOR = 0.28;
const ANIMATION_END_RATIO = 0.82;

export const ScrollCanvasSequence: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoOverlayRef = useRef<HTMLDivElement>(null);
  const logoBrandRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const imageBitmapsRef = useRef<(ImageBitmap | HTMLImageElement)[]>([]);
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const lastDrawnIndexRef = useRef(-1);
  const animFrameIdRef = useRef<number | null>(null);
  const scrollEndTimerRef = useRef<number | null>(null);
  const prioritizeAroundFrameRef = useRef<((frame: number) => void) | null>(null);

  // High-Performance Precision Canvas 2D Drawing Engine
  const drawFrame = useCallback((frameIdx: number, force = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const safeIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(frameIdx)));

    // Prevent redundant canvas draws if the integer frame has not changed
    if (!force && safeIndex === lastDrawnIndexRef.current) {
      return;
    }

    const assets = imageBitmapsRef.current;
    let asset = assets[safeIndex];

    // Nearest loaded frame fallback to prevent blank/black flashes
    if (!asset) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        if (assets[safeIndex - offset]) {
          asset = assets[safeIndex - offset];
          break;
        }
        if (assets[safeIndex + offset]) {
          asset = assets[safeIndex + offset];
          break;
        }
      }
    }
    if (!asset) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const { width: canvasWidth, height: canvasHeight } = canvas;
    const assetWidth = asset.width;
    const assetHeight = asset.height;

    const canvasAspect = canvasWidth / canvasHeight;
    const assetAspect = assetWidth / assetHeight;

    let drawWidth: number;
    let drawHeight: number;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasAspect > assetAspect) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / assetAspect;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * assetAspect;
      offsetX = (canvasWidth - drawWidth) / 2;
    }

    // Only clear if the drawn image does not completely fill the canvas
    if (drawWidth < canvasWidth || drawHeight < canvasHeight || offsetX > 0 || offsetY > 0) {
      ctx.fillStyle = '#070708';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      asset,
      Math.round(offsetX),
      Math.round(offsetY),
      Math.round(drawWidth),
      Math.round(drawHeight)
    );

    lastDrawnIndexRef.current = safeIndex;
  }, []);

  // Fast Multi-Tier Progressive Stream of 300 Frames
  useEffect(() => {
    let mounted = true;
    let count = 0;
    const inFlight = new Set<number>();
    const isLoaded = new Set<number>();
    const highPriorityQueue: number[] = [];
    const backgroundQueue: number[] = [];
    const MAX_CONCURRENT = 8;
    let activeWorkers = 0;

    const pumpQueue = () => {
      if (!mounted) return;
      while (
        activeWorkers < MAX_CONCURRENT &&
        (highPriorityQueue.length > 0 || backgroundQueue.length > 0)
      ) {
        const nextIndex =
          highPriorityQueue.length > 0
            ? highPriorityQueue.shift()!
            : backgroundQueue.shift()!;

        if (isLoaded.has(nextIndex) || inFlight.has(nextIndex)) {
          continue;
        }

        activeWorkers++;
        loadSingleFrame(nextIndex).finally(() => {
          activeWorkers--;
          pumpQueue();
        });
      }
    };

    const loadSingleFrame = (index: number): Promise<void> => {
      if (index < 0 || index >= TOTAL_FRAMES || isLoaded.has(index) || inFlight.has(index)) {
        return Promise.resolve();
      }

      inFlight.add(index);
      return new Promise((resolve) => {
        const frameIndex = (index + 1).toString().padStart(3, '0');
        const webpSrc = `/Frames/ezgif-frame-${frameIndex}.webp`;
        const img = new Image();

        const onImageSuccess = async () => {
          if (!mounted) {
            inFlight.delete(index);
            return resolve();
          }

          let assetToStore: ImageBitmap | HTMLImageElement = img;
          try {
            if ('createImageBitmap' in window) {
              assetToStore = await createImageBitmap(img);
            }
          } catch {
            assetToStore = img;
          }

          imageBitmapsRef.current[index] = assetToStore;
          isLoaded.add(index);
          inFlight.delete(index);
          count++;

          if (mounted) {
            setLoadedCount(count);
            // Draw Frame 1 immediately on arrival
            if (index === 0 || (lastDrawnIndexRef.current === -1 && count === 1)) {
              drawFrame(0, true);
            }
          }
          resolve();
        };

        img.onload = onImageSuccess;
        img.onerror = () => {
          inFlight.delete(index);
          isLoaded.add(index);
          resolve();
        };

        img.src = webpSrc;
      });
    };

    // Dynamic scrubbing priority booster:
    // When the user scrolls towards frame N, immediately prioritize frames around N
    prioritizeAroundFrameRef.current = (centerIndex: number) => {
      const center = Math.round(centerIndex);
      const radius = 6;
      for (let offset = 0; offset <= radius; offset++) {
        const forward = center + offset;
        const backward = center - offset;
        if (forward < TOTAL_FRAMES && !isLoaded.has(forward) && !inFlight.has(forward)) {
          if (!highPriorityQueue.includes(forward)) {
            highPriorityQueue.unshift(forward);
          }
        }
        if (backward >= 0 && !isLoaded.has(backward) && !inFlight.has(backward)) {
          if (!highPriorityQueue.includes(backward)) {
            highPriorityQueue.unshift(backward);
          }
        }
      }
      pumpQueue();
    };

    const loadAllImages = async () => {
      // 1. Initial Priority Batch: First 12 frames load in parallel (~350KB in WebP vs 15MB PNG, ~150-250ms)
      const initialBatch = Array.from({ length: 12 }, (_, i) => loadSingleFrame(i));
      await Promise.all(initialBatch);

      // Instant interactive reveal: loading screen clears with zero perceptible delay
      if (mounted) {
        setIsFadingOut(true);
        setTimeout(() => {
          if (mounted) setIsLoading(false);
        }, 350);
      }

      // 2. Timeline Keyframe Backbone: Load every 8th frame across 0..299
      // Establishes visual anchors throughout the entire scroll journey so nearest fallback is never >4 frames away
      for (let i = 12; i < TOTAL_FRAMES; i += 8) {
        if (!isLoaded.has(i)) {
          backgroundQueue.push(i);
        }
      }
      pumpQueue();

      // 3. Dense Infill: Load every 2nd frame (even frames)
      for (let i = 12; i < TOTAL_FRAMES; i += 2) {
        if (!isLoaded.has(i) && !backgroundQueue.includes(i)) {
          backgroundQueue.push(i);
        }
      }

      // 4. High-Fidelity 60fps Finish: Load all remaining frames
      for (let i = 12; i < TOTAL_FRAMES; i++) {
        if (!isLoaded.has(i) && !backgroundQueue.includes(i)) {
          backgroundQueue.push(i);
        }
      }

      pumpQueue();
    };

    loadAllImages();

    return () => {
      mounted = false;
      prioritizeAroundFrameRef.current = null;
    };
  }, [drawFrame]);

  // Crisp Canvas Scaling: Capped at native 1080p (DPR up to 1.5x) to eliminate GPU fillrate bottlenecks
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const targetW = Math.min(1920, Math.round(rect.width * dpr));
    const targetH = Math.min(1080, Math.round(rect.height * dpr));

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    drawFrame(currentFrameRef.current, true);
  }, [drawFrame]);

  useEffect(() => {
    window.addEventListener('resize', updateCanvasSize, { passive: true });
    updateCanvasSize();
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [updateCanvasSize]);

  // Responsive Animation Loop: Smooth scrubbing with instant halt
  useEffect(() => {
    const loop = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;

      if (Math.abs(diff) > 0.005) {
        if (Math.abs(diff) < 0.1) {
          // Snap cleanly when very close to eliminate microscopic jitter
          currentFrameRef.current = targetFrameRef.current;
        } else {
          currentFrameRef.current += diff * SMOOTHING_FACTOR;
        }
        drawFrame(currentFrameRef.current);
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [drawFrame]);

  // Track Scroll Position with instant pause-on-stop handling
  useEffect(() => {
    const updateOverlays = (currentScroll: number, windowHeight: number) => {
      // 1. Distance for the scroll indicator to travel upside until reaching the navbar
      // Indicator rest center: roughly windowHeight * 0.5 + 135px.
      // Navbar target position: top ~48px.
      const navTargetY = 48;
      const indicatorRestY = windowHeight * 0.5 + 135;
      const travelDistance = Math.max(260, indicatorRestY - navTargetY);

      // Link vertical translation directly to user scroll (1:1 native scroll feel)
      const progress = Math.min(1, Math.max(0, currentScroll / travelDistance));
      const translateY = -progress * travelDistance;

      // Dissolve as it reaches the navbar (from 65% to 100% of the ascent)
      let indicatorOpacity = 1;
      let indicatorScale = 1;
      if (progress > 0.65) {
        const fade = (progress - 0.65) / 0.35;
        indicatorOpacity = Math.max(0, 1 - fade);
        indicatorScale = 1 - fade * 0.16;
      }

      if (scrollIndicatorRef.current) {
        if (indicatorOpacity <= 0.005) {
          scrollIndicatorRef.current.style.opacity = '0';
          scrollIndicatorRef.current.style.visibility = 'hidden';
          scrollIndicatorRef.current.style.pointerEvents = 'none';
        } else {
          scrollIndicatorRef.current.style.visibility = 'visible';
          scrollIndicatorRef.current.style.opacity = indicatorOpacity.toFixed(3);
          scrollIndicatorRef.current.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0) scale(${indicatorScale.toFixed(3)})`;
        }
      }

      // 2. Main Brand Logo: Dissolves gently as scroll begins
      if (logoBrandRef.current) {
        const logoScrollThreshold = Math.max(180, Math.round(windowHeight * 0.28));
        const logoProgress = Math.min(1, Math.max(0, currentScroll / logoScrollThreshold));
        const logoOpacity = Math.max(0, 1 - logoProgress);
        const logoTranslateY = -logoProgress * 45;

        if (logoOpacity <= 0.005) {
          logoBrandRef.current.style.opacity = '0';
          logoBrandRef.current.style.visibility = 'hidden';
          logoBrandRef.current.style.pointerEvents = 'none';
        } else {
          logoBrandRef.current.style.visibility = 'visible';
          logoBrandRef.current.style.opacity = logoOpacity.toFixed(3);
          logoBrandRef.current.style.transform = `translate3d(0, ${logoTranslateY.toFixed(1)}px, 0)`;
        }
      }

      // 3. Editorial Tagline: Dissolves synchronously on scroll
      if (taglineRef.current) {
        const taglineScrollThreshold = Math.max(160, Math.round(windowHeight * 0.25));
        const taglineProgress = Math.min(1, Math.max(0, currentScroll / taglineScrollThreshold));
        const taglineOpacity = Math.max(0, 1 - taglineProgress);
        const taglineTranslateY = -taglineProgress * 30;

        if (taglineOpacity <= 0.005) {
          taglineRef.current.style.opacity = '0';
          taglineRef.current.style.visibility = 'hidden';
          taglineRef.current.style.pointerEvents = 'none';
        } else {
          taglineRef.current.style.visibility = 'visible';
          taglineRef.current.style.opacity = taglineOpacity.toFixed(3);
          taglineRef.current.style.transform = `translate3d(0, ${taglineTranslateY.toFixed(1)}px, 0)`;
        }
      }

      // Keep overall overlay non-blocking
      if (logoOverlayRef.current) {
        const isVisible = indicatorOpacity > 0.005 || (logoBrandRef.current && logoBrandRef.current.style.visibility !== 'hidden');
        logoOverlayRef.current.style.pointerEvents = isVisible ? 'auto' : 'none';
      }
    };

    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;

      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const scrollRatio = Math.max(0, Math.min(1, currentScroll / totalScrollable));

      // Direct DOM update avoids triggering full React virtual DOM reconciliations during fast scroll
      updateOverlays(currentScroll, windowHeight);

      // Map 0 -> ANIMATION_END_RATIO (0.82) to targetFrame 0 -> 299
      const animProgress = Math.max(0, Math.min(1, scrollRatio / ANIMATION_END_RATIO));
      const targetFrame = animProgress * (TOTAL_FRAMES - 1);
      targetFrameRef.current = targetFrame;

      // On-Demand Dynamic Boost: prioritize nearby frames ahead of scrubber
      if (prioritizeAroundFrameRef.current) {
        prioritizeAroundFrameRef.current(targetFrame);
      }

      // Instant-Pause Detection:
      // When the user stops scrolling, immediately lock to the current frame within 45ms.
      if (scrollEndTimerRef.current !== null) {
        window.clearTimeout(scrollEndTimerRef.current);
      }
      scrollEndTimerRef.current = window.setTimeout(() => {
        currentFrameRef.current = targetFrameRef.current;
        drawFrame(currentFrameRef.current);
      }, 45);
    };

    const handleScrollEnd = () => {
      currentFrameRef.current = targetFrameRef.current;
      drawFrame(currentFrameRef.current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scrollend', handleScrollEnd, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scrollend', handleScrollEnd);
      if (scrollEndTimerRef.current !== null) {
        window.clearTimeout(scrollEndTimerRef.current);
      }
    };
  }, [drawFrame]);

  return (
    <section id="hero" className="relative bg-[#faf7f2]">
      {/* Fast & Animated Minimalist Loading Screen */}
      {isLoading && (
        <div
          className={`fixed inset-0 z-[100] bg-[#faf7f2] flex flex-col items-center justify-center p-6 transition-all duration-700 ${
            isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
          }`}
        >
          {/* Subtle Warm Amber/Caramel Radial Glow */}
          <div className="absolute w-[400px] h-[400px] bg-[#c8824a]/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Minimalist Animated Centerpiece */}
          <div className="relative flex items-center justify-center mb-6">
            {/* Spinning Hairline Orbit */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-[#d6c4b2] border-t-[#8c4c1d] border-r-[#8c4c1d]/40 animate-spin" />

            {/* Counter-rotating subtle outer ring */}
            <div className="absolute w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-[#e8ded3] border-b-[#c8824a]/30 animate-spin [animation-duration:8s] [animation-direction:reverse]" />

            {/* Glowing Logo Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <VellutoLogo size={48} showText={false} className="animate-pulse" />
            </div>
          </div>

          {/* Clean Typography in Rich Brown */}
          <div className="flex flex-col items-center text-center space-y-1.5 z-10">
            <span className="font-serif text-xl sm:text-2xl md:text-3xl font-normal tracking-[0.28em] rich-brown-gradient">
              VELLUTO
            </span>
            <span className="font-montserrat font-medium text-xs sm:text-sm rich-brown-subtle tracking-[0.18em]">
              Simply luxurious
            </span>
            <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-[#8c4c1d]/90 uppercase pt-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8c4c1d] animate-ping" />
              <span>INITIALIZING 3D WALKTHROUGH</span>
            </div>
          </div>

          {/* Minimalist Micro Progress Bar */}
          <div className="w-44 h-[2px] bg-[#e6dcd0] rounded-full overflow-hidden mt-6 relative">
            <div
              className="h-full bg-gradient-to-r from-[#d89f6d] via-[#c8824a] to-[#8c471c] transition-all duration-300"
              style={{
                width: isFadingOut ? '100%' : `${Math.min(100, Math.round((loadedCount / 12) * 100))}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Hero 700vh Scroll Track */}
      <div ref={containerRef} className="relative h-[700vh]">
        {/* Sticky Viewport */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#faf7f2]">
          {/* Razor-Sharp 3D Canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover block"
            style={{
              imageRendering: '-webkit-optimize-contrast',
              filter: 'contrast(1.02) saturate(1.02)',
            }}
          />

          {/* Soft Cream Vignette Overlay for Depth */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#faf7f2] via-transparent to-[#faf7f2]/60" />

          {/* Official Registered Logo Overlay & Scroll-Linked Animated Indicator */}
          <div
            ref={logoOverlayRef}
            className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6 text-center z-30"
          >
            {/* Main Brand Logo - Clean, uncluttered, iconic center */}
            <div ref={logoBrandRef} className="will-change-transform flex flex-col items-center">
              <VellutoLogo
                size={360}
                showText={true}
                showTagline={false}
                showCategories={false}
                className="drop-shadow-xl"
                imageClassName="[filter:brightness(0.78)_contrast(1.12)]"
              />
            </div>

            {/* Modern Architectural 'Scroll to Explore' Indicator - Travels upside to navbar & disappears */}
            <div
              ref={scrollIndicatorRef}
              className="mt-10 flex flex-col items-center gap-3 select-none will-change-transform"
            >
              {/* Spaced Elegant Montserrat Label */}
              <div className="flex items-center gap-2.5">
                <span className="w-1 h-1 rounded-full bg-[#8c4c1d]/60" />
                <span className="font-montserrat font-medium text-[10px] sm:text-[11px] tracking-[0.35em] text-[#7d4e30] uppercase drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
                  Scroll to explore
                </span>
                <span className="w-1 h-1 rounded-full bg-[#8c4c1d]/60" />
              </div>

              {/* Minimalist Mouse Capsule with Gliding Pearl & Downward Light Trail */}
              <div className="relative flex flex-col items-center">
                <div className="w-[20px] h-[34px] rounded-full border-[1.5px] border-[#8c4c1d]/45 bg-white/40 backdrop-blur-md flex justify-center pt-1.5 shadow-[0_2px_8px_rgba(140,80,30,0.08)]">
                  {/* Gliding Amber-Bronze Wheel */}
                  <div className="w-[3px] h-[7px] rounded-full bg-gradient-to-b from-[#8c4c1d] to-[#d8965f] animate-scroll-wheel shadow-sm" />
                </div>

                {/* Flowing Downward Light Trail Line */}
                <div className="w-[1.5px] bg-gradient-to-b from-[#8c4c1d]/70 via-[#b86d34]/40 to-transparent mt-1.5 rounded-full animate-trail-drop" />
              </div>
            </div>
          </div>

          {/* Architectural Editorial Tagline Anchor - Bottom Left */}
          <div
            ref={taglineRef}
            className="absolute bottom-8 left-6 sm:bottom-12 sm:left-12 pointer-events-none flex items-center gap-3 will-change-transform z-30 select-none"
          >
            <span className="w-8 sm:w-12 h-[1.5px] bg-[#8c4c1d]/45" />
            <span className="font-montserrat font-medium text-xs sm:text-sm tracking-[0.24em] slogan-light-gradient uppercase drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
              Simply luxurious
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
