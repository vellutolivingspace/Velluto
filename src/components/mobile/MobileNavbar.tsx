import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Phone } from 'lucide-react';

export const MobileNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/velluto_livingspace_official/',
      icon: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[url(#mobNavRichBrownGrad)]">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      href: 'https://wa.me/919213518005?text=Hello+Velluto+Living+Space%2C+I%E2%80%99d+like+to+know+more+about+your+spaces+and+services',
      icon: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[url(#mobNavRichBrownGrad)]">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      ),
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-2.5 px-3 pointer-events-none">
      {/* SVG Gradient */}
      <svg width="0" height="0" className="absolute -z-10 pointer-events-none" aria-hidden="true">
        <defs>
          <linearGradient id="mobNavRichBrownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#743e1d" />
            <stop offset="35%" stopColor="#9c5525" />
            <stop offset="75%" stopColor="#bf7238" />
            <stop offset="100%" stopColor="#d8965f" />
          </linearGradient>
        </defs>
      </svg>

      <div
        className={`max-w-lg mx-auto rounded-full px-4 py-2 transition-all duration-300 pointer-events-auto flex items-center justify-between ${
          scrolled
            ? 'bg-[#faf6f0]/95 backdrop-blur-xl border border-[#d6c4b2]/70 shadow-[0_4px_20px_rgba(140,90,50,0.1)]'
            : 'bg-white/60 backdrop-blur-md border border-[#e5d9cd]/50 shadow-sm'
        }`}
      >
        {/* Wordmark Logo */}
        <a href="#" className="flex items-center py-0.5">
          <img
            src="/brand/velluto-nav-text.png"
            alt="Velluto Living Space"
            width={100}
            height={26}
            className="h-6 w-auto object-contain select-none pointer-events-none"
            style={{ imageRendering: '-webkit-optimize-contrast' }}
          />
        </a>

        {/* Right Action Icons: Quick Call + WhatsApp + Menu Toggle */}
        <div className="flex items-center gap-1.5">
          <a
            href="tel:+919213518005"
            aria-label="Call Factory Desk"
            className="p-1.5 rounded-full bg-[#8c4c1d]/10 text-[#8c4c1d] hover:bg-[#8c4c1d]/20 transition-colors flex items-center justify-center"
          >
            <Phone className="w-3.5 h-3.5" />
          </a>

          {socialLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.name}
              className="p-1.5 rounded-full hover:bg-[#ede3d5] transition-colors flex items-center justify-center opacity-90 active:scale-95"
            >
              {item.icon}
            </a>
          ))}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            className="p-1.5 rounded-full text-[#4a3629] hover:bg-[#ede3d5] transition-colors ml-0.5"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="mt-2 max-w-sm mx-auto rounded-2xl p-4 border border-[#d6c4b2]/80 space-y-2 text-xs font-mono uppercase tracking-widest bg-[#faf6f2]/98 backdrop-blur-2xl shadow-xl pointer-events-auto animate-fade-in">
          <a
            href="#products"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-between py-2 text-[#4a3629] hover:text-[#8c4c1d] border-b border-[#e8ded3]/70"
          >
            <span>Modular Products</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8c4c1d]" />
          </a>
          <a
            href="#machinery"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-between py-2 text-[#4a3629] hover:text-[#8c4c1d] border-b border-[#e8ded3]/70"
          >
            <span>Automated Machinery</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8c4c1d]" />
          </a>
          <a
            href="#materials"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-between py-2 text-[#4a3629] hover:text-[#8c4c1d] border-b border-[#e8ded3]/70"
          >
            <span>Materials & Finishes</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8c4c1d]" />
          </a>
          <a
            href="#comparison"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-between py-2 text-[#4a3629] hover:text-[#8c4c1d] border-b border-[#e8ded3]/70"
          >
            <span>Factory vs Carpenter</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8c4c1d]" />
          </a>
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-between py-2 text-[#8c4c1d] font-medium"
          >
            <span>Visit Plant / Inquire</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8c4c1d]" />
          </a>
        </div>
      )}
    </header>
  );
};
