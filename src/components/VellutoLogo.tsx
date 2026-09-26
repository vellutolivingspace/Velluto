import React from 'react';

interface VellutoLogoProps {
  className?: string;
  size?: number;
  color?: string;
  showText?: boolean;
  showTagline?: boolean;
  showCategories?: boolean;
}

export const VellutoLogo: React.FC<VellutoLogoProps> = ({
  className = '',
  size = 120,
  showText = true,
  showTagline = true,
  showCategories = false,
}) => {
  if (!showText) {
    // Registered Icon only (e.g. for Navbar, Loading spinner, Compact badges)
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <img
          src="/brand/velluto-icon.png"
          alt="Velluto Registered Logo Icon"
          width={size}
          height={Math.round(size * 0.37)}
          className="object-contain block drop-shadow-sm select-none pointer-events-none"
          style={{ imageRendering: '-webkit-optimize-contrast' }}
        />
      </div>
    );
  }

  // Full Registered Trademark Lockup
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <img
        src="/brand/velluto-logo-transparent.png"
        alt="Velluto Living Space Registered Trademark Logo"
        width={size}
        height={Math.round(size * 0.58)}
        className="w-full object-contain block select-none pointer-events-none drop-shadow-2xl"
        style={{
          maxWidth: `${size}px`,
          imageRendering: '-webkit-optimize-contrast',
        }}
      />

      {/* Official Registered Tagline: Montserrat Medium */}
      {showTagline && (
        <span className="font-montserrat font-medium text-sm sm:text-base md:text-lg slogan-light-gradient tracking-[0.2em] mt-3 block drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
          Simply luxurious
        </span>
      )}

      {/* Optional Subtitle Categories in Rich Brown if standalone */}
      {showCategories && (
        <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.25em] text-[#c8824a]/80 uppercase mt-1.5 block">
          MODULAR KITCHENS | WARDROBES | INTERIORS
        </span>
      )}
    </div>
  );
};
