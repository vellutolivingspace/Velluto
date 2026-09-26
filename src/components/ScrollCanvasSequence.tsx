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

  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const imageBitmapsRef = useRef<(ImageBitmap | HTMLImageElement)[]>([]);
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const lastDrawnIndexRef = useRef(-1);
  const animFrameIdRef = useRef<number | null>(null);
  const scrollEndTimerRef = useRef<number | null>(null);

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

  // Fast Priority Preload & Background Stream of 300 Frames
  useEffect(() => {
    let mounted = true;
    const loadedAssets: (ImageBitmap | HTMLImageElement)[] = new Array(TOTAL_FRAMES);
    let count = 0;

    const loadSingleFrame = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        const frameIndex = (index + 1).toString().padStart(3, '0');
        const src = `/Frames/ezgif-frame-${frameIndex}.png`;
        const img = new Image();
        img.src = src;

        img.onload = async () => {
          if (!mounted) return resolve();
          let assetToStore: ImageBitmap | HTMLImageElement = img;
          try {
            if ('createImageBitmap' in window) {
              assetToStore = await createImageBitmap(img);
            }
          } catch {
            assetToStore = img;
          }

          loadedAssets[index] = assetToStore;
          imageBitmapsRef.current[index] = assetToStore;
          count++;

          if (mounted) {
            setLoadedCount(count);
            // Draw Frame 1 immediately
            if (index === 0) {
              drawFrame(0, true);
            }
          }
          resolve();
        };

        img.onerror = () => {
          if (mounted) {
            count++;
            setLoadedCount(count);
          }
          resolve();
        };
      });
    };

    const loadAllImages = async () => {
      // 1. Initial Priority Batch: First 15 frames load immediately (~0.5 - 0.8s)
      const initialBatch = Array.from({ length: 15 }, (_, i) => loadSingleFrame(i));
      await Promise.all(initialBatch);

      // Once the initial 15 frames are ready, immediately begin smooth fade out
      if (mounted) {
        setIsFadingOut(true);
        setTimeout(() => {
          if (mounted) setIsLoading(false);
        }, 600);
      }

      // 2. Background Stream: Stream the remaining frames in manageable batches
      const remainingIndices = Array.from({ length: TOTAL_FRAMES - 15 }, (_, i) => i + 15);
      const BATCH_SIZE = 12;
      for (let i = 0; i < remainingIndices.length; i += BATCH_SIZE) {
        if (!mounted) break;
        const chunk = remainingIndices.slice(i, i + BATCH_SIZE);
        await Promise.all(chunk.map((idx) => loadSingleFrame(idx)));
      }
    };

    loadAllImages();

    return () => {
      mounted = false;
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
      targetFrameRef.current = animProgress * (TOTAL_FRAMES - 1);

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
                width: isFadingOut ? '100%' : `${Math.min(100, Math.round((loadedCount / 15) * 100))}%`,
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
            {/* Main Brand Logo - Fades out softly on scroll */}
            <div ref={logoBrandRef} className="will-change-transform flex flex-col items-center">
              <VellutoLogo size={360} showText={true} showTagline={true} showCategories={false} className="drop-shadow-xl" />
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
        </div>
      </div>
    </section>
  );
};
