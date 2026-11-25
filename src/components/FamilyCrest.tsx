import React from 'react';

interface FamilyCrestProps {
  className?: string;
}

export const FamilyCrest: React.FC<FamilyCrestProps> = ({ className = 'w-14 h-14' }) => {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="kodakGold" x1="12" y1="12" x2="108" y2="108" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5E1A4" />
          <stop offset="50%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#8C6D2E" />
        </linearGradient>
        <radialGradient id="crestRose" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#D6323C" />
          <stop offset="70%" stopColor="#8A121B" />
          <stop offset="100%" stopColor="#42060B" />
        </radialGradient>
      </defs>

      {/* Godfather marionette crossbars subtle crown accent */}
      <line x1="36" y1="7" x2="84" y2="7" stroke="url(#kodakGold)" strokeWidth="1.2" strokeOpacity="0.65" />
      <line x1="60" y1="7" x2="60" y2="15" stroke="url(#kodakGold)" strokeWidth="1.2" strokeOpacity="0.65" />

      {/* Outer octagonal signet ring */}
      <polygon
        points="40,12 80,12 108,40 108,80 80,108 40,108 12,80 12,40"
        stroke="url(#kodakGold)"
        strokeWidth="2"
        fill="#0D0908"
      />
      <polygon
        points="43,17 77,17 103,43 103,77 77,103 43,103 17,77 17,43"
        stroke="url(#kodakGold)"
        strokeWidth="0.75"
        strokeOpacity="0.55"
        fill="none"
      />

      {/* Crimson Godfather Rose at top of crest */}
      <circle cx="60" cy="27" r="7.5" fill="url(#crestRose)" stroke="url(#kodakGold)" strokeWidth="0.9" />
      <path
        d="M56.5 27 C57.5 24, 61.5 23.5, 63 26 C64 28, 61 30.5, 58.5 29"
        stroke="#F38D94"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />

      {/* Left & Right Wheat Stalks */}
      <path d="M31 84 C26 68, 26 51, 33 38" stroke="url(#kodakGold)" strokeWidth="1.35" strokeLinecap="round" />
      <path d="M29 68 L22 63 M28 58 L22 52 M30 48 L25 42" stroke="url(#kodakGold)" strokeWidth="1.15" strokeLinecap="round" />
      <path d="M89 84 C94 68, 94 51, 87 38" stroke="url(#kodakGold)" strokeWidth="1.35" strokeLinecap="round" />
      <path d="M91 68 L98 63 M92 58 L98 52 M90 48 L95 42" stroke="url(#kodakGold)" strokeWidth="1.15" strokeLinecap="round" />

      {/* Center Monogram K */}
      <text
        x="60"
        y="79"
        textAnchor="middle"
        fill="url(#kodakGold)"
        style={{
          fontFamily: "'Cinzel', Georgia, serif",
          fontSize: '44px',
          fontWeight: 700,
          letterSpacing: '0.02em',
        }}
      >
        K
      </text>
    </svg>
  );
};
