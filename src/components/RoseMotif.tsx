import React from 'react';

export const GodfatherRose: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="rosePetal" cx="45%" cy="38%" r="60%">
          <stop offset="0%" stopColor="#D6323C" />
          <stop offset="55%" stopColor="#8F141D" />
          <stop offset="100%" stopColor="#46080D" />
        </radialGradient>
        <linearGradient id="roseStem" x1="32" y1="36" x2="32" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4B6636" />
          <stop offset="100%" stopColor="#26361A" />
        </linearGradient>
      </defs>
      {/* Stem & thorns */}
      <path d="M32 34 C32 44, 31 52, 30 60" stroke="url(#roseStem)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M31 46 C24 44, 20 40, 18 36 C24 37, 28 40, 31 44Z" fill="#324722" />
      <path d="M32 50 C39 48, 43 44, 46 40 C40 41, 36 44, 32 48Z" fill="#2A3C1C" />
      {/* Outer petals */}
      <path
        d="M32 10 C22 10, 15 18, 17 28 C19 35, 25 38, 32 38 C39 38, 45 35, 47 28 C49 18, 42 10, 32 10Z"
        fill="url(#rosePetal)"
        stroke="#C9A84C"
        strokeOpacity="0.35"
        strokeWidth="0.9"
      />
      {/* Inner spiral folds */}
      <path
        d="M23 22 C24 16, 30 14, 35 16 C40 18, 42 24, 38 29 C34 33, 27 32, 25 27 C24 23, 28 19, 32 20 C35 21, 36 25, 33 27"
        stroke="#F07B82"
        strokeOpacity="0.65"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M20 26 C22 33, 28 36, 35 34 C41 32, 44 26, 42 21"
        stroke="#360509"
        strokeOpacity="0.7"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

export const RoseDivider: React.FC = () => (
  <div className="mx-auto max-w-6xl px-5 sm:px-8">
    <div className="flex items-center gap-4">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C9A84C]/35 to-[#8F141D]/55" />
      <GodfatherRose className="h-7 w-7 shrink-0 opacity-90" />
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#C9A84C]/35 to-[#8F141D]/55" />
    </div>
  </div>
);
