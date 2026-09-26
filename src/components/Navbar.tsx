import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/velluto_livingspace_official/',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[url(#navRichBrownGrad)]">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/share/1DjY4kyY2j/',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[url(#navRichBrownGrad)]">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      href: 'https://wa.me/919213518005?text=Hello+Velluto+Living+Space%2C+I%E2%80%99d+like+to+know+more+about+your+spaces+and+services',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[url(#navRichBrownGrad)]">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      ),
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 pt-3 sm:pt-5 px-4 sm:px-8 pointer-events-none">
      {/* Shared SVG LinearGradient Definition for Rich Brown Icons */}
      <svg width="0" height="0" className="absolute -z-10 pointer-events-none" aria-hidden="true">
        <defs>
          <linearGradient id="navRichBrownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#743e1d" />
            <stop offset="35%" stopColor="#9c5525" />
            <stop offset="75%" stopColor="#bf7238" />
            <stop offset="100%" stopColor="#d8965f" />
          </linearGradient>
        </defs>
      </svg>

      <div
        className={`max-w-5xl mx-auto rounded-full px-6 sm:px-8 py-2.5 sm:py-3 transition-all duration-500 pointer-events-auto flex items-center justify-between ${
          scrolled
            ? 'bg-[#faf6f0]/90 backdrop-blur-xl border border-[#d6c4b2]/60 shadow-[0_6px_25px_rgba(140,90,50,0.08)]'
            : 'bg-transparent border border-transparent'
        }`}
      >
        {/* Registered VELLUTO Wordmark PNG */}
        <a href="#" className="group flex items-center py-0.5">
          <img
            src="/brand/velluto-nav-text.png"
            alt="Velluto Living Space"
            width={128}
            height={33}
            className="h-7 sm:h-8 w-auto object-contain select-none pointer-events-none transition-transform duration-300 group-hover:scale-105"
            style={{ imageRendering: '-webkit-optimize-contrast' }}
          />
        </a>

        {/* Minimalist Desktop Navigation (3D Kitchen removed) */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-mono tracking-widest text-[#5e4b3e] uppercase">
          <a href="#products" className="hover:text-[#8c4c1d] transition-colors">
            Products
          </a>
          <a href="#machinery" className="hover:text-[#8c4c1d] transition-colors">
            Machinery
          </a>
          <a href="#materials" className="hover:text-[#8c4c1d] transition-colors">
            Materials
          </a>
          <a href="#contact" className="hover:text-[#8c4c1d] transition-colors">
            Contact
          </a>
        </nav>

        {/* Right Side: Rich Brown Gradient Mini Social Icons */}
        <div className="hidden sm:flex items-center gap-3">
          {socialLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.name}
              className="p-1.5 rounded-full hover:bg-[#ede3d5] transition-all duration-200 transform hover:scale-115 flex items-center justify-center opacity-90 hover:opacity-100"
            >
              {item.icon}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          {/* Mini social icons on mobile navbar */}
          <div className="flex items-center gap-1.5 mr-1">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.name}
                className="p-1 rounded-full hover:bg-[#ede3d5] transition-transform active:scale-95 flex items-center justify-center"
              >
                {item.icon}
              </a>
            ))}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="p-1.5 rounded-full text-[#4a3629] hover:text-[#8c4c1d]"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Minimal Drawer */}
      {menuOpen && (
        <div className="md:hidden mt-2 max-w-xs mx-auto rounded-2xl p-5 border border-[#d6c4b2]/60 space-y-3 text-xs font-mono uppercase tracking-widest bg-[#faf6f2]/95 backdrop-blur-2xl shadow-2xl pointer-events-auto">
          <a
            href="#products"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-between py-2 text-[#4a3629] hover:text-[#8c4c1d] border-b border-[#e8ded3]"
          >
            <span>Products</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8c4c1d]" />
          </a>
          <a
            href="#machinery"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-between py-2 text-[#4a3629] hover:text-[#8c4c1d] border-b border-[#e8ded3]"
          >
            <span>Machinery</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8c4c1d]" />
          </a>
          <a
            href="#materials"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-between py-2 text-[#4a3629] hover:text-[#8c4c1d] border-b border-[#e8ded3]"
          >
            <span>Materials</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8c4c1d]" />
          </a>
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-between py-2 text-[#4a3629] hover:text-[#8c4c1d] border-b border-[#e8ded3]"
          >
            <span>Factory Visit</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8c4c1d]" />
          </a>

          {/* Social Icons row inside mobile menu */}
          <div className="pt-2 flex items-center justify-around border-t border-[#e8ded3]">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-full hover:bg-[#ede3d5] transition-all flex items-center gap-1.5 text-[10px] text-[#5e4b3e]"
              >
                {item.icon}
                <span className="font-mono text-[9px] capitalize">{item.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
