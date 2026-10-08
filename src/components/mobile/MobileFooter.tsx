import React from 'react';
import { MapPin, Mail, Phone, Globe, Clock } from 'lucide-react';

export const MobileFooter: React.FC = () => {
  return (
    <footer className="bg-white/40 backdrop-blur-xl border-t border-[#decbb8]/70 pt-8 pb-24 text-[#523e32] text-xs relative overflow-hidden px-4">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Brand Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <img
              src="/brand/velluto-footer-icon.png?v=2"
              alt="Velluto Icon"
              className="h-8 w-auto object-contain select-none shrink-0"
              style={{ imageRendering: '-webkit-optimize-contrast' }}
            />
            <img
              src="/brand/velluto-footer-logo.png?v=2"
              alt="Velluto Living Space"
              className="h-6 w-auto object-contain select-none"
              style={{ imageRendering: '-webkit-optimize-contrast' }}
            />
          </div>

          <p className="text-[#5c493d] text-[11px] leading-relaxed">
            Proudly Made in India. Luxury modular kitchens, wardrobes, and living units manufactured using computerized beam saws, CNC machining, and PUR edge-banding in Gandhinagar, Gujarat.
          </p>

          <div className="flex items-center gap-2 text-[9px] font-mono text-[#7d6859]">
            <span className="inline-block px-2 py-0.5 rounded-full bg-[#8c4c1d]/10 text-[#8c4c1d] font-semibold text-[8px]">
              MADE IN INDIA
            </span>
            <Clock className="w-3 h-3 text-[#8c4c1d]" />
            <span>Mon–Sat, 9:30 AM – 7:00 PM</span>
          </div>
        </div>

        {/* Quick Links Row */}
        <div className="pt-2 border-t border-[#e8ded3]/80">
          <span className="text-[9px] font-mono tracking-widest text-[#8c4c1d] uppercase block font-semibold mb-2">
            Quick Links
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#5c493d]">
            <a href="#hero" className="hover:text-[#8c4c1d]">3D Walkthrough</a>
            <a href="#products" className="hover:text-[#8c4c1d]">Modular Products</a>
            <a href="#machinery" className="hover:text-[#8c4c1d]">CNC Machinery</a>
            <a href="#materials" className="hover:text-[#8c4c1d]">Board Materials</a>
            <a href="#comparison" className="hover:text-[#8c4c1d]">Factory vs Carpenter</a>
            <a href="#contact" className="hover:text-[#8c4c1d]">Factory Desk</a>
          </div>
        </div>

        {/* Contact info */}
        <div className="pt-2 border-t border-[#e8ded3]/80 space-y-2 text-[11px] font-mono text-[#38271e]">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-[#8c4c1d] shrink-0" />
            <a href="tel:+919213518005" className="hover:text-[#8c4c1d] font-medium">
              +91 92135 18005
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-[#8c4c1d] shrink-0" />
            <a href="mailto:info@vellutolivingspace.com" className="hover:text-[#8c4c1d]">
              info@vellutolivingspace.com
            </a>
          </div>

          <div className="flex items-start gap-2 text-[#5c493d]">
            <MapPin className="w-3.5 h-3.5 text-[#8c4c1d] shrink-0 mt-0.5" />
            <span>Plot No. A-55, GIDC, Sector 25, Gandhinagar, Gujarat 382024</span>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="pt-4 border-t border-[#e8ded3]/80 text-[9px] font-mono text-[#7d6859] text-center">
          &copy; {new Date().getFullYear()} VELLUTO LIVING SPACE. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
};
