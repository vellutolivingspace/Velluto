import React from 'react';
import { MapPin, Mail, Phone, Globe, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white/40 backdrop-blur-xl border-t border-[#decbb8]/70 pt-16 pb-12 text-[#523e32] text-xs relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#d8c7b5]">
          {/* Company & Factory Overview */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <img
                src="/brand/velluto-footer-icon.png?v=2"
                alt="Velluto Modular Living Icon"
                className="h-10 sm:h-11 w-auto object-contain select-none shrink-0"
                style={{ imageRendering: '-webkit-optimize-contrast' }}
              />
              <img
                src="/brand/velluto-footer-logo.png?v=2"
                alt="Velluto Living Space"
                className="h-8 sm:h-9 w-auto object-contain select-none"
                style={{ imageRendering: '-webkit-optimize-contrast' }}
              />
            </div>

            <p className="text-[#5c493d] font-normal text-xs leading-relaxed max-w-sm">
              Proudly Made in India. We manufacture luxury modular kitchens, wardrobes, and living spaces using automated computerized beam saws, CNC machining centers, and PUR edge-banding technology in Gandhinagar, Gujarat.
            </p>

            <div className="flex items-center gap-2 text-[10px] font-mono text-[#7d6859] pt-1">
              <span className="inline-block px-2 py-0.5 rounded-full bg-[#8c4c1d]/10 text-[#8c4c1d] font-semibold text-[9px]">MADE IN INDIA</span>
              <Clock className="w-3.5 h-3.5 text-[#8c4c1d]" />
              <span>Plant Hours: Monday — Saturday, 9:30 AM – 7:00 PM</span>
            </div>
          </div>

          {/* Direct Navigation */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-[#8c4c1d] uppercase block font-medium">
              Quick Links
            </span>
            <ul className="space-y-2 font-mono text-[11px] text-[#5c493d]">
              <li>
                <a href="#hero" className="hover:text-[#8c4c1d] transition-colors">
                  3D Kitchen Walkthrough
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-[#8c4c1d] transition-colors">
                  Modular Products
                </a>
              </li>
              <li>
                <a href="#machinery" className="hover:text-[#8c4c1d] transition-colors">
                  CNC & Factory Machinery
                </a>
              </li>
              <li>
                <a href="#materials" className="hover:text-[#8c4c1d] transition-colors">
                  Board & Finish Specifications
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#8c4c1d] transition-colors">
                  Schedule Factory Visit
                </a>
              </li>
            </ul>
          </div>

          {/* Plant Contact Information */}
          <div className="md:col-span-4 space-y-3 font-mono text-[11px]">
            <span className="text-[10px] font-mono tracking-widest text-[#8c4c1d] uppercase block font-medium">
              Factory & Office
            </span>

            <div className="flex items-center gap-2.5 text-[#38271e]">
              <Phone className="w-3.5 h-3.5 text-[#8c4c1d] shrink-0" />
              <a href="tel:+919213518005" className="hover:text-[#8c4c1d] transition-colors font-medium">
                +91 92135 18005
              </a>
            </div>

            <div className="flex items-center gap-2.5 text-[#38271e]">
              <Mail className="w-3.5 h-3.5 text-[#8c4c1d] shrink-0" />
              <a href="mailto:info@vellutolivingspace.com" className="hover:text-[#8c4c1d] transition-colors">
                info@vellutolivingspace.com
              </a>
            </div>

            <div className="flex items-center gap-2.5 text-[#38271e]">
              <Globe className="w-3.5 h-3.5 text-[#8c4c1d] shrink-0" />
              <span>vellutolivingspace.com</span>
            </div>

            <div className="flex items-start gap-2.5 text-[#5c493d] pt-1">
              <MapPin className="w-3.5 h-3.5 text-[#8c4c1d] shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                Plot No. A-55, GIDC, Sector 25, Gandhinagar, Gujarat 382024
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[10px] text-[#7d6859]">
          <span>&copy; {new Date().getFullYear()} VELLUTO LIVING SPACE. ALL RIGHTS RESERVED.</span>
        </div>
      </div>
    </footer>
  );
};
