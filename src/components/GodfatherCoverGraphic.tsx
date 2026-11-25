import React from 'react';

interface GodfatherCoverGraphicProps {
  compact?: boolean;
}

/**
 * Iconic Mario Puzo book-cover inspired "The Kodak Family / Mehmet Kodak"
 * graphic with pure black backdrop, white marionette hand + crossbar,
 * descending puppet strings, and crimson-white display typography.
 */
export const GodfatherCoverGraphic: React.FC<GodfatherCoverGraphicProps> = ({ compact = false }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-[#000000] border border-[#C9A84C]/25 shadow-2xl ${
        compact ? 'px-6 py-7' : 'px-6 py-10 sm:px-12 sm:py-12'
      }`}
    >
      {/* Marionette Hand, Crossbar & Descending Strings (SVG) */}
      <svg
        viewBox="0 0 600 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="pointer-events-none absolute right-2 sm:right-8 top-0 h-full w-auto max-w-[72%] opacity-95"
        aria-hidden="true"
      >
        {/* Vertical puppet strings descending behind lettering */}
        <g stroke="#9E9A94" strokeWidth="1.25" strokeOpacity="0.65">
          <line x1="278" y1="88" x2="278" y2="295" />
          <line x1="316" y1="95" x2="316" y2="295" />
          <line x1="354" y1="84" x2="354" y2="295" />
          <line x1="398" y1="74" x2="398" y2="295" />
          <line x1="438" y1="82" x2="438" y2="295" />
          <line x1="478" y1="90" x2="478" y2="295" />
        </g>

        {/* Arm descending from top */}
        <path
          d="M362 -8 L384 58 L422 54 L436 -8 Z"
          fill="#F5F3EE"
        />
        {/* Cuff / wrist shadow */}
        <path d="M382 54 L424 50 L422 60 L384 64 Z" fill="#181615" />

        {/* Marionette Crossbars (angled white wood bars) */}
        <polygon points="266,86 492,46 496,57 270,98" fill="#F5F3EE" />
        <polygon points="342,46 494,94 489,105 337,57" fill="#EAE6DF" />

        {/* Fingers gripping the crossbar */}
        <path
          d="M382 56 C376 68, 378 80, 386 84 C394 86, 398 76, 396 66"
          fill="#F5F3EE"
          stroke="#050505"
          strokeWidth="2.2"
        />
        <path
          d="M396 54 C392 68, 394 82, 402 85 C410 86, 414 75, 412 63"
          fill="#F5F3EE"
          stroke="#050505"
          strokeWidth="2.2"
        />
        <path
          d="M412 52 C408 66, 410 80, 418 82 C426 83, 430 72, 426 58"
          fill="#F5F3EE"
          stroke="#050505"
          strokeWidth="2.2"
        />
        <path
          d="M372 72 C368 78, 372 86, 382 86"
          stroke="#F5F3EE"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>

      {/* Bold Cover Typography */}
      <div className="relative z-10 max-w-2xl">
        <p
          className={`font-display font-black leading-[0.9] tracking-tight text-[#DE2C24] ${
            compact ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-6xl lg:text-[4.25rem]'
          }`}
        >
          The
        </p>
        <h2
          className={`font-display font-black leading-[0.92] tracking-tight text-[#DE2C24] ${
            compact ? 'text-4xl sm:text-5xl' : 'text-5xl sm:text-7xl lg:text-[5.15rem]'
          }`}
        >
          Kodak Family
        </h2>

        <div className={`mt-4 sm:mt-5 flex flex-wrap items-end justify-between gap-4`}>
          <div className="font-display font-black leading-[0.95] text-[#F7F4EE]">
            <p className={compact ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-5xl'}>
              Mehmet
            </p>
            <p className={compact ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-5xl'}>
              Kodak
            </p>
          </div>

          <div className="text-right font-display uppercase tracking-[0.14em] text-[#DE2C24] text-[11px] sm:text-xs leading-relaxed">
            <p>Kodak Fırın &amp; Aile Mirası</p>
            <p>Güngören · İstanbul</p>
            <p className="text-[#C9A84C]">Baba Ocağı Özel Arşivi</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Pure black subtle marionette-strings background accent anchored cleanly at the top edge
 */
export const MarionetteBackdropStrings: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[420px] overflow-hidden opacity-35"
    >
      <svg
        viewBox="0 0 1440 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMin slice"
      >
        <g stroke="url(#bgStringFade)" strokeWidth="1">
          <line x1="210" y1="0" x2="210" y2="420" />
          <line x1="250" y1="0" x2="250" y2="360" />
          <line x1="1150" y1="0" x2="1150" y2="420" />
          <line x1="1190" y1="0" x2="1190" y2="390" />
          <line x1="1230" y1="0" x2="1230" y2="420" />
          <line x1="1270" y1="0" x2="1270" y2="350" />
        </g>
        <defs>
          <linearGradient id="bgStringFade" x1="0" y1="0" x2="0" y2="420" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
