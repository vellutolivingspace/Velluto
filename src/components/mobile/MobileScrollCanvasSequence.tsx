import React, { useEffect, useRef, useState, useCallback } from 'react';
import { VellutoLogo } from '../VellutoLogo';

const TOTAL_FRAMES = 300;
const SMOOTHING_FACTOR = 0.22;
const ANIMATION_END_RATIO = 0.86;

export const MobileScrollCanvasSequence: React.FC = () => {
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

  // High-Performance Mobile Canvas 2D Drawing Engine
  const drawFrame = useCallback((frameIdx: number, force = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const safeIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(frameIdx)));

    if (!force && safeIndex === lastDrawnIndexRef.current) {
      return;
    }

    const assets = imageBitmapsRef.current;
    let asset = assets[safeIndex];

    // Nearest loaded frame fallback to prevent blank flashes
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

    // Cover mobile canvas naturally
    if (canvasAspect > assetAspect) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / assetAspect;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * assetAspect;
      offsetX = (canvasWidth - drawWidth) / 2;
    }

    // Clear background if needed
    if (drawWidth < canvasWidth || drawHeight < canvasHeight || offsetX > 0 || offsetY > 0) {
      ctx.fillStyle = '#faf7f2';
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

  // Fast Progressive Stream of Mobile Frames
  useEffect(() => {
    let mounted = true;
    let count = 0;
    const inFlight = new Set<number>();
    const isLoaded = new Set<number>();
    const highPriorityQueue: number[] = [];
    const backgroundQueue: number[] = [];
    const MAX_CONCURRENT = 6;
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
        // Mobile frames uploaded by user in public/mobile frames/ezgif-frame-XXX.jpg
        const imgSrc = `/mobile%20frames/ezgif-frame-${frameIndex}.jpg`;
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

        img.src = imgSrc;
      });
    };

    // Scrub Priority Booster
    prioritizeAroundFrameRef.current = (centerIndex: number) => {
      const center = Math.round(centerIndex);
      const radius = 5;
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
      // 1. Initial Priority Batch: First 8 frames load in parallel (~80KB total, <100ms)
      const initialBatch = Array.from({ length: 8 }, (_, i) => loadSingleFrame(i));
      await Promise.all(initialBatch);

      if (mounted) {
        setIsFadingOut(true);
        setTimeout(() => {
          if (mounted) setIsLoading(false);
        }, 300);
      }

      // 2. Keyframe Backbone across entire scroll journey (every 8th frame)
      for (let i = 8; i < TOTAL_FRAMES; i += 8) {
        if (!isLoaded.has(i)) {
          backgroundQueue.push(i);
        }
      }
      pumpQueue();

      // 3. Dense Infill (every 2nd frame)
      for (let i = 8; i < TOTAL_FRAMES; i += 2) {
        if (!isLoaded.has(i) && !backgroundQueue.includes(i)) {
          backgroundQueue.push(i);
        }
      }

      // 4. Full 60fps Finish
      for (let i = 8; i < TOTAL_FRAMES; i++) {
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

  // Mobile Canvas Scaling
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetW = Math.round(rect.width * dpr);
    const targetH = Math.round(rect.height * dpr);

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

  // Animation Loop with instant halt
  useEffect(() => {
    const loop = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;

      if (Math.abs(diff) > 0.005) {
        if (Math.abs(diff) < 0.1) {
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

  // Mobile Scroll Position Tracking
  useEffect(() => {
    const updateOverlays = (currentScroll: number, windowHeight: number) => {
      // 1. Scroll Indicator travels and dissolves quickly
      const travelDistance = Math.max(160, windowHeight * 0.25);
      const progress = Math.min(1, Math.max(0, currentScroll / travelDistance));
      const translateY = -progress * 60;
      const indicatorOpacity = Math.max(0, 1 - progress * 1.5);

      if (scrollIndicatorRef.current) {
        if (indicatorOpacity <= 0.01) {
          scrollIndicatorRef.current.style.opacity = '0';
          scrollIndicatorRef.current.style.visibility = 'hidden';
        } else {
          scrollIndicatorRef.current.style.visibility = 'visible';
          scrollIndicatorRef.current.style.opacity = indicatorOpacity.toFixed(3);
          scrollIndicatorRef.current.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
        }
      }

      // 2. Brand Logo Dissolve
      if (logoBrandRef.current) {
        const logoThreshold = Math.max(120, windowHeight * 0.2);
        const logoProgress = Math.min(1, Math.max(0, currentScroll / logoThreshold));
        const logoOpacity = Math.max(0, 1 - logoProgress);
        const logoTranslateY = -logoProgress * 30;

        if (logoOpacity <= 0.01) {
          logoBrandRef.current.style.opacity = '0';
          logoBrandRef.current.style.visibility = 'hidden';
        } else {
          logoBrandRef.current.style.visibility = 'visible';
          logoBrandRef.current.style.opacity = logoOpacity.toFixed(3);
          logoBrandRef.current.style.transform = `translate3d(0, ${logoTranslateY.toFixed(1)}px, 0)`;
        }
      }

      // 3. Editorial Tagline Dissolve
      if (taglineRef.current) {
        const tagThreshold = Math.max(100, windowHeight * 0.18);
        const tagProgress = Math.min(1, Math.max(0, currentScroll / tagThreshold));
        const tagOpacity = Math.max(0, 1 - tagProgress);

        if (tagOpacity <= 0.01) {
          taglineRef.current.style.opacity = '0';
          taglineRef.current.style.visibility = 'hidden';
        } else {
          taglineRef.current.style.visibility = 'visible';
          taglineRef.current.style.opacity = tagOpacity.toFixed(3);
        }
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

      updateOverlays(currentScroll, windowHeight);

      const animProgress = Math.max(0, Math.min(1, scrollRatio / ANIMATION_END_RATIO));
      const targetFrame = animProgress * (TOTAL_FRAMES - 1);
      targetFrameRef.current = targetFrame;

      if (prioritizeAroundFrameRef.current) {
        prioritizeAroundFrameRef.current(targetFrame);
      }

      if (scrollEndTimerRef.current !== null) {
        window.clearTimeout(scrollEndTimerRef.current);
      }
      scrollEndTimerRef.current = window.setTimeout(() => {
        currentFrameRef.current = targetFrameRef.current;
        drawFrame(currentFrameRef.current);
      }, 40);
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
      {/* Fast Minimalist Mobile Loading Screen */}
      {isLoading && (
        <div
          className={`fixed inset-0 z-[100] bg-[#faf7f2] flex flex-col items-center justify-center p-6 transition-all duration-500 ${
            isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="relative flex items-center justify-center mb-5">
            <div className="w-20 h-20 rounded-full border border-[#d6c4b2] border-t-[#8c4c1d] border-r-[#8c4c1d]/40 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <VellutoLogo size={36} showText={false} className="animate-pulse" />
            </div>
          </div>

          <div className="flex flex-col items-center text-center space-y-1 z-10">
            <span className="font-serif text-lg font-normal tracking-[0.25em] rich-brown-gradient">
              VELLUTO
            </span>
            <span className="font-montserrat font-medium text-[11px] rich-brown-subtle tracking-[0.15em]">
              Simply luxurious
            </span>
            <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-[#8c4c1d]/90 uppercase pt-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8c4c1d] animate-ping" />
              <span>3D WALKTHROUGH</span>
            </div>
          </div>

          {/* Micro Progress Bar */}
          <div className="w-32 h-[2px] bg-[#e6dcd0] rounded-full overflow-hidden mt-4 relative">
            <div
              className="h-full bg-gradient-to-r from-[#d89f6d] via-[#c8824a] to-[#8c471c] transition-all duration-200"
              style={{
                width: isFadingOut ? '100%' : `${Math.min(100, Math.round((loadedCount / 8) * 100))}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Measured Mobile Scroll Track: 580vh for slower, smoother, cinematic scrubbing */}
      <div ref={containerRef} className="relative h-[580vh]">
        {/* Sticky Fullscreen Mobile Viewport */}
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex items-center justify-center bg-[#faf7f2]">
          {/* Razor-Sharp Portrait Mobile 3D Canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover block"
            style={{
              imageRendering: '-webkit-optimize-contrast',
              filter: 'contrast(1.02) saturate(1.02)',
            }}
          />

          {/* Soft Edge Gradient for Depth */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#faf7f2]/90 via-transparent to-[#faf7f2]/40" />

          {/* Initial Clean Brand Overlay: Perfectly Proportioned for Mobile Screen */}
          <div
            ref={logoOverlayRef}
            className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4 text-center z-30"
          >
            {/* Classy Compact Logo (Size 200 instead of desktop 360) */}
            <div ref={logoBrandRef} className="will-change-transform flex flex-col items-center">
              <VellutoLogo
                size={200}
                showText={true}
                showTagline={false}
                showCategories={false}
                className="drop-shadow-lg"
                imageClassName="[filter:brightness(0.78)_contrast(1.12)]"
              />
            </div>

            {/* Mobile Touch & Scroll Indicator */}
            <div
              ref={scrollIndicatorRef}
              className="mt-6 flex flex-col items-center gap-2 select-none will-change-transform"
            >
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[#8c4c1d]/60" />
                <span className="font-montserrat font-medium text-[9px] tracking-[0.25em] text-[#7d4e30] uppercase drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
                  Swipe down to explore
                </span>
                <span className="w-1 h-1 rounded-full bg-[#8c4c1d]/60" />
              </div>

              {/* Minimalist Touch / Scroll Capsule */}
              <div className="w-[18px] h-[30px] rounded-full border-[1.5px] border-[#8c4c1d]/45 bg-white/50 backdrop-blur-md flex justify-center pt-1 shadow-sm">
                <div className="w-[2.5px] h-[6px] rounded-full bg-gradient-to-b from-[#8c4c1d] to-[#d8965f] animate-scroll-wheel shadow-sm" />
              </div>
            </div>
          </div>

          {/* Compact Tagline Anchor - Bottom Right */}
          <div
            ref={taglineRef}
            className="absolute bottom-4 right-4 pointer-events-none flex items-center gap-2 will-change-transform z-30 select-none"
          >
            <span className="w-6 h-[1px] bg-[#8c4c1d]/45" />
            <span className="font-montserrat font-medium text-[10px] tracking-[0.2em] slogan-light-gradient uppercase drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
              Simply luxurious
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
