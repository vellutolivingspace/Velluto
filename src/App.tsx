import React from 'react';
import { Navbar } from './components/Navbar';
import { ScrollCanvasSequence } from './components/ScrollCanvasSequence';
import { HeroScrollNarrative } from './components/HeroScrollNarrative';
import { FeaturesSection } from './components/FeaturesSection';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#2c1f18] selection:bg-[#c8824a]/25 selection:text-[#2c1f18] relative">
      {/* Immovable Still Canvas Background: Motionless and serene while elements and cards float */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[#faf7f2] overflow-hidden" aria-hidden="true">
        {/* Soft Stationary Architectural Light Meshes */}
        <div className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vw] max-w-[900px] max-h-[900px] rounded-full bg-gradient-to-br from-[#eddccb]/35 via-[#f5eae0]/20 to-transparent blur-3xl" />
        <div className="absolute top-[35%] -right-[15%] w-[70vw] h-[70vw] max-w-[950px] max-h-[950px] rounded-full bg-gradient-to-bl from-[#e5d0be]/30 via-[#eddccb]/20 to-transparent blur-3xl" />
        <div className="absolute -bottom-[20%] left-[10%] w-[75vw] h-[75vw] max-w-[1050px] max-h-[1050px] rounded-full bg-gradient-to-t from-[#eddccb]/35 via-[#f5ebe0]/20 to-transparent blur-3xl" />
      </div>

      <Navbar />
      
      {/* Floating Scroll Narrative during 3D Hero Sequence */}
      <HeroScrollNarrative />

      <main className="relative z-10">
        {/* Hero 3D Scroll Sequence Section (Frozen & Untouched Animation Engine) */}
        <ScrollCanvasSequence />
        
        {/* Classy Modern Minimalist Editorial Landing Page */}
        <FeaturesSection />
      </main>

      <Footer />
    </div>
  );
};

export default App;
