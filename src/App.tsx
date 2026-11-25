/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Lock, Music, Volume2, VolumeX } from 'lucide-react';
import { jazzEngine } from './audio/jazzEngine';
import { AuthGate } from './components/AuthGate';
import { BakeryRunnerGame } from './components/BakeryRunnerGame';
import { BakerySection } from './components/BakerySection';
import { FamilyCrest } from './components/FamilyCrest';
import { FamilyGallery } from './components/FamilyGallery';
import { MarionetteBackdropStrings } from './components/GodfatherCoverGraphic';
import { PatriarchHero } from './components/PatriarchHero';
import { GodfatherRose, RoseDivider } from './components/RoseMotif';
import { SmokeCursorTrail } from './components/SmokeCursorTrail';
import { SmokeOverlay } from './components/SmokeOverlay';

const SESSION_AUTH_KEY = 'kodak_ailesi_unlocked_v1';

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(SESSION_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);

  useEffect(() => {
    return () => {
      jazzEngine.stop();
    };
  }, []);

  const handleUnlock = (enableMusic: boolean) => {
    try {
      sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
    } catch {
      // ignore storage unavailability
    }
    setIsUnlocked(true);
    if (enableMusic) {
      const started = jazzEngine.start();
      setMusicPlaying(started);
    }
  };

  const handleLock = () => {
    try {
      sessionStorage.removeItem(SESSION_AUTH_KEY);
    } catch {
      // ignore
    }
    jazzEngine.stop();
    setMusicPlaying(false);
    setIsUnlocked(false);
  };

  const toggleMusic = () => {
    if (musicPlaying) {
      jazzEngine.stop();
      setMusicPlaying(false);
    } else {
      const started = jazzEngine.start();
      setMusicPlaying(started);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    jazzEngine.setVolume(val);
  };

  return (
    <>
      <SmokeCursorTrail />

      {!isUnlocked ? (
        <AuthGate onUnlock={handleUnlock} />
      ) : (
        <div className="relative min-h-screen godfather-canvas text-[#F5EFE6]">
          <MarionetteBackdropStrings />
          <SmokeOverlay intensity="subtle" />

          {/* 3-Zone Top Navigation Bar */}
          <header className="sticky top-0 z-30 border-b border-[#C9A84C]/20 bg-[#030303]/92 backdrop-blur-md">
            <div className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
              <a
                href="#aile-reisi"
                className="font-display text-lg sm:text-xl font-black text-[#DE2C24] tracking-wide whitespace-nowrap shrink-0"
              >
                The Kodak Family
              </a>

              <nav
                aria-label="Ana menü"
                className="hidden md:flex items-center gap-7 text-sm font-medium text-[#CFC6B4]"
              >
                <a
                  href="#aile-reisi"
                  className="hover:text-[#E8CB78] transition-colors whitespace-nowrap shrink-0"
                >
                  Aile Reisi
                </a>
                <a
                  href="#kodak-firin"
                  className="hover:text-[#E8CB78] transition-colors whitespace-nowrap shrink-0"
                >
                  Kodak Fırın
                </a>
                <a
                  href="#album"
                  className="hover:text-[#E8CB78] transition-colors whitespace-nowrap shrink-0"
                >
                  Albüm
                </a>
                <a
                  href="#firin-oyunu"
                  className="hover:text-[#E8CB78] transition-colors whitespace-nowrap shrink-0"
                >
                  Fırın Oyunu
                </a>
              </nav>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleLock}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#C9A84C]/35 bg-[#0C0A0A] px-4 py-2 text-xs font-medium text-[#EFE7D8] hover:border-[#E2C26B] hover:text-[#F5E1A4] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Lock className="h-3.5 w-3.5 text-[#C9A84C]" />
                  <span>Kilitle</span>
                </button>
              </div>
            </div>
          </header>

          <main className="relative z-10">
            <PatriarchHero />
            <RoseDivider />
            <BakerySection />
            <RoseDivider />
            <FamilyGallery />
            <RoseDivider />
            <BakeryRunnerGame />
          </main>

          {/* Quiet Archival Footer */}
          <footer className="relative z-10 border-t border-[#C9A84C]/20 bg-[#030303] py-10">
            <div className="mx-auto max-w-6xl px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3.5">
                <FamilyCrest className="h-11 w-11 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-display text-base font-bold text-[#F5EFE6]">
                      The Kodak Family &amp; Kodak Fırın
                    </p>
                    <GodfatherRose className="h-4 w-4" />
                  </div>
                  <p className="text-xs text-[#958B7B]">
                    Mehmet Kodak öncülüğünde aile hatıra arşivi · Güngören, İstanbul
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-[#A89F91]">
                <a href="#aile-reisi" className="hover:text-[#E5C76B] transition-colors">
                  Aile Reisi
                </a>
                <span aria-hidden="true">·</span>
                <a href="#kodak-firin" className="hover:text-[#E5C76B] transition-colors">
                  Kodak Fırın
                </a>
                <span aria-hidden="true">·</span>
                <a href="#album" className="hover:text-[#E5C76B] transition-colors">
                  Albüm
                </a>
                <span aria-hidden="true">·</span>
                <a href="#firin-oyunu" className="hover:text-[#E5C76B] transition-colors">
                  Oyun
                </a>
              </div>
            </div>
          </footer>

          {/* Compact Godfather Theme Music Controller */}
          <div className="fixed bottom-4 right-4 z-40">
            <div className="flex items-center gap-2.5 rounded-xl bg-[#0A0909]/95 border border-[#C9A84C]/35 px-3.5 py-2 shadow-2xl backdrop-blur-md">
              <button
                type="button"
                onClick={toggleMusic}
                aria-label={musicPlaying ? 'Godfather müziğini duraklat' : 'Godfather müziğini çal'}
                className="inline-flex items-center gap-2 text-xs font-medium text-[#EFE7D8] hover:text-[#E8CB78] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {musicPlaying ? (
                  <Volume2 className="h-4 w-4 text-[#DE2C24]" />
                ) : (
                  <VolumeX className="h-4 w-4 text-[#8E8476]" />
                )}
                <Music className="h-3.5 w-3.5 text-[#C9A84C] hidden sm:inline" />
                <span>{musicPlaying ? 'Godfather Müziği Açık' : 'Godfather Müziği'}</span>
              </button>

              {musicPlaying && (
                <input
                  type="range"
                  min={0.05}
                  max={0.6}
                  step={0.05}
                  value={volume}
                  onChange={handleVolumeChange}
                  aria-label="Müzik ses seviyesi"
                  className="hidden sm:block w-16 accent-[#DE2C24] cursor-pointer"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
