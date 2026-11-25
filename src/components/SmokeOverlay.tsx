import React from 'react';

export const SmokeOverlay: React.FC<{ intensity?: 'subtle' | 'gate' }> = ({ intensity = 'subtle' }) => {
  const opacityClass = intensity === 'gate' ? 'opacity-55' : 'opacity-30';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${opacityClass}`}
    >
      {/* Top-left warm cigar-haze drift */}
      <div
        className="smoke-wisp-a absolute -top-28 -left-24 h-[520px] w-[620px] rounded-full blur-[110px]"
        style={{
          background:
            'radial-gradient(circle at 40% 40%, rgba(201, 168, 76, 0.14) 0%, rgba(120, 100, 75, 0.08) 45%, transparent 75%)',
        }}
      />
      {/* Mid-right soft charcoal-amber smoke */}
      <div
        className="smoke-wisp-b absolute top-1/3 -right-28 h-[560px] w-[640px] rounded-full blur-[125px]"
        style={{
          background:
            'radial-gradient(circle at 55% 50%, rgba(168, 146, 112, 0.13) 0%, rgba(75, 62, 48, 0.09) 48%, transparent 78%)',
        }}
      />
      {/* Lower horizon warm ember mist */}
      <div
        className="smoke-wisp-a absolute -bottom-36 left-1/4 h-[440px] w-[720px] rounded-full blur-[130px]"
        style={{
          background:
            'radial-gradient(circle at 50% 60%, rgba(185, 138, 60, 0.11) 0%, rgba(50, 38, 26, 0.08) 52%, transparent 80%)',
        }}
      />
    </div>
  );
};
