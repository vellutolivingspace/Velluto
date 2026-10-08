import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, Calendar } from 'lucide-react';

export const MobileQuickActionBar: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Reveal once scrolled slightly down (e.g. past first 150px)
      setVisible(window.scrollY > 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <aside
      aria-label="Quick contact actions"
      className="fixed bottom-3 left-3 right-3 z-40 max-w-sm mx-auto animate-fade-in pointer-events-auto"
    >
      <div className="bg-[#faf6f2]/95 backdrop-blur-xl border border-[#d6c4b2]/90 rounded-full px-3 py-1.5 shadow-[0_6px_25px_rgba(140,80,30,0.18)] flex items-center justify-between gap-1.5">
        {/* 1-Tap Direct Call */}
        <a
          href="tel:+919213518005"
          className="flex-1 py-1.5 px-2 rounded-full bg-white/80 hover:bg-white text-[#38271e] text-[10px] font-mono uppercase tracking-wider font-semibold border border-[#decbb8]/60 flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs"
        >
          <Phone className="w-3 h-3 text-[#8c4c1d]" />
          <span>Call Desk</span>
        </a>

        {/* 1-Tap WhatsApp */}
        <a
          href="https://wa.me/919213518005?text=Hello+Velluto+Living+Space%2C+I%E2%80%99d+like+to+know+more+about+your+spaces+and+services"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-1.5 px-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-mono uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs"
        >
          <MessageSquare className="w-3 h-3 text-white" />
          <span>WhatsApp</span>
        </a>

        {/* 1-Tap Inquire / Visit */}
        <a
          href="#contact"
          className="flex-1 py-1.5 px-2 rounded-full bg-[#8c4c1d] hover:bg-[#723c14] text-white text-[10px] font-mono uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs"
        >
          <Calendar className="w-3 h-3 text-white" />
          <span>Visit Plant</span>
        </a>
      </div>
    </aside>
  );
};
