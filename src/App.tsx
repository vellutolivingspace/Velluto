import React from 'react';
import { useIsMobile } from './hooks/useIsMobile';

// Desktop Components (Frozen & Pristine)
import { Navbar } from './components/Navbar';
import { ScrollCanvasSequence } from './components/ScrollCanvasSequence';
import { HeroScrollNarrative } from './components/HeroScrollNarrative';
import { FeaturesSection } from './components/FeaturesSection';
import { Footer } from './components/Footer';

// Mobile Tailored Components (Compact, Touch-Ergonomic & Vertical Scroll Animations)
import { MobileNavbar } from './components/mobile/MobileNavbar';
import { MobileScrollCanvasSequence } from './components/mobile/MobileScrollCanvasSequence';
import { MobileHeroScrollNarrative } from './components/mobile/MobileHeroScrollNarrative';
import { MobileFeaturesSection } from './components/mobile/MobileFeaturesSection';
import { MobileFooter } from './components/mobile/MobileFooter';
import { MobileQuickActionBar } from './components/mobile/MobileQuickActionBar';

export const App: React.FC = () => {
  const isMobile = useIsMobile(768);

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#2c1f18] selection:bg-[#c8824a]/25 selection:text-[#2c1f18] relative">
      {/* Immovable Still Canvas Background: Motionless and serene while elements and cards float */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[#faf7f2] overflow-hidden" aria-hidden="true">
        {/* Soft Stationary Architectural Light Meshes */}
        <div className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vw] max-w-[900px] max-h-[900px] rounded-full bg-gradient-to-br from-[#eddccb]/35 via-[#f5eae0]/20 to-transparent blur-3xl" />
        <div className="absolute top-[35%] -right-[15%] w-[70vw] h-[70vw] max-w-[950px] max-h-[950px] rounded-full bg-gradient-to-bl from-[#e5d0be]/30 via-[#eddccb]/20 to-transparent blur-3xl" />
        <div className="absolute -bottom-[20%] left-[10%] w-[75vw] h-[75vw] max-w-[1050px] max-h-[1050px] rounded-full bg-gradient-to-t from-[#eddccb]/35 via-[#f5ebe0]/20 to-transparent blur-3xl" />
      </div>

      {isMobile ? (
        /* Dedicated Mobile Landing Page Experience */
        <>
          <MobileNavbar />
          <MobileHeroScrollNarrative />
          <main className="relative z-10">
            <MobileScrollCanvasSequence />
            <MobileFeaturesSection />
          </main>
          <MobileFooter />
          <MobileQuickActionBar />
        </>
      ) : (
        /* Original High-Fidelity Desktop Experience */
        <>
          <Navbar />
          <HeroScrollNarrative />
          <main className="relative z-10">
            <ScrollCanvasSequence />
            <FeaturesSection />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
};

export default App;

