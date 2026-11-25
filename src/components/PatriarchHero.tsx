import React, { useState } from 'react';
import { ArrowDownRight, Gamepad2 } from 'lucide-react';
import { GODFATHER_FAMILY_QUOTES, PATRIARCH_PORTRAITS } from '../data/familyData';
import { FamilyCrest } from './FamilyCrest';
import { GodfatherCoverGraphic } from './GodfatherCoverGraphic';
import { GodfatherRose } from './RoseMotif';

export const PatriarchHero: React.FC = () => {
  const [activePortrait, setActivePortrait] = useState<'rose' | 'bakery'>('rose');
  const [imgError, setImgError] = useState(false);

  const portraitSrc =
    activePortrait === 'rose' ? PATRIARCH_PORTRAITS.rose : PATRIARCH_PORTRAITS.bakery;

  return (
    <section id="aile-reisi" className="relative pt-8 pb-16 lg:pt-10 lg:pb-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Mario Puzo Godfather Poster Cover adapted for The Kodak Family */}
        <div className="mb-10">
          <GodfatherCoverGraphic />
        </div>

        {/* Top-of-Page Authoritative Godfather Epigraph */}
        <div className="mb-10 pb-8 border-b border-[#C9A84C]/20 text-center max-w-3xl mx-auto">
          <p className="font-serif italic text-2xl sm:text-3xl text-[#F5E7C4] leading-snug">
            “Bir adam ailesine vakit ayırmıyorsa asla gerçek bir adam olamaz.”
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.22em] text-[#C9A84C]">
            Don Vito Corleone · The Godfather
          </p>
        </div>

        {/* 2-Column Split Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Typographic Column */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-3 text-xs tracking-[0.22em] uppercase text-[#C9A84C] mb-4">
              <GodfatherRose className="h-5 w-5 shrink-0" />
              <span>Ailenin Reisi</span>
              <span aria-hidden="true">·</span>
              <span>Il Padrino</span>
            </div>

            <h1
              className="font-display text-4xl sm:text-5xl lg:text-[3.65rem] font-bold leading-[1.12] tracking-tight text-[#F5EFE2] mb-6"
              style={{ textWrap: 'balance' }}
            >
              Bir Çınarın Gölgesinde:{' '}
              <span className="gold-foil-text">Mehmet Kodak</span>
            </h1>

            <blockquote className="py-5 my-2 border-y border-[#8F141D]/45">
              <p className="font-serif italic text-xl sm:text-2xl text-[#EFE5D4] leading-relaxed">
                “Dostlarını yakın tut; ama aileni her şeyden, herkesten daha yakın tut.”
              </p>
              <footer className="mt-2 text-xs uppercase tracking-[0.18em] text-[#C9A84C]">
                Baba Ocağı Düsturu · Kodak Ailesi
              </footer>
            </blockquote>

            <p className="mt-5 text-base text-[#BEB4A4] leading-relaxed max-w-2xl">
              Elinde kırmızı gülü, yüzünde ağırbaşlı vakarı ve omuzlarında koca bir ailenin sorumluluğuyla Mehmet Kodak; çocuklarına ve torunlarına sarsılmaz bir aile bağı, onurlu bir soyadı ve Kodak Fırın’ın sıcaklığını miras bıraktı.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#kodak-firin"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#8F141D] via-[#B48A30] to-[#D4B259] px-6 py-3 text-sm font-semibold text-[#FDF9F0] border border-[#C9A84C]/40 hover:brightness-110 transition-all whitespace-nowrap shrink-0"
              >
                <span>Kodak Fırın &amp; Aile Sözleri</span>
                <ArrowDownRight className="h-4 w-4" />
              </a>

              <a
                href="#firin-oyunu"
                className="inline-flex items-center gap-2 rounded-lg border border-[#C9A84C]/40 bg-[#120D0C] px-5 py-3 text-sm font-medium text-[#EFE6D5] hover:border-[#E2C26B] hover:text-[#F5E1A4] transition-colors whitespace-nowrap shrink-0"
              >
                <Gamepad2 className="h-4 w-4 text-[#C9A84C]" />
                <span>Fırından Kaçış Oyna</span>
              </a>
            </div>
          </div>

          {/* Right Portrait Showcase Column */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="leather-card rounded-2xl p-3 flex-1 flex flex-col">
              <div className="relative flex-1 min-h-[380px] sm:min-h-[450px] rounded-xl overflow-hidden bg-[#0A0707]">
                {!imgError ? (
                  <img
                    src={portraitSrc}
                    alt={
                      activePortrait === 'rose'
                        ? 'Mehmet Kodak elinde kırmızı gül ile portre'
                        : 'Mehmet Kodak Kodak Fırın içerisinde'
                    }
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="h-full w-full object-cover object-top transition-all duration-500 contrast-[1.07]"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
                    <FamilyCrest className="h-20 w-20 mb-3" />
                    <p className="font-display text-lg text-[#C9A84C]">Mehmet Kodak</p>
                  </div>
                )}

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080606] via-transparent to-black/25"
                />

                {/* Top right subtle red rose mark */}
                <div className="absolute top-3.5 right-3.5 rounded-full bg-black/60 border border-[#8F141D]/55 p-2 backdrop-blur-sm">
                  <GodfatherRose className="h-5 w-5" />
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#C9A84C]">
                      {activePortrait === 'rose' ? 'Baba · Kırmızı Gül' : 'Kodak Fırın · Reis'}
                    </p>
                    <p className="font-display text-lg font-semibold text-[#F5EFE2]">
                      Mehmet Kodak
                    </p>
                  </div>

                  {/* Interactive Portrait Switcher */}
                  <div className="flex items-center gap-1 rounded-lg bg-[#0A0807]/85 p-1 border border-[#C9A84C]/25 backdrop-blur-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setImgError(false);
                        setActivePortrait('rose');
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        activePortrait === 'rose'
                          ? 'bg-[#C9A84C] text-[#090705]'
                          : 'text-[#CFC6B4] hover:text-[#F5EFE2]'
                      }`}
                    >
                      Portre
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImgError(false);
                        setActivePortrait('bakery');
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        activePortrait === 'bakery'
                          ? 'bg-[#C9A84C] text-[#090705]'
                          : 'text-[#CFC6B4] hover:text-[#F5EFE2]'
                      }`}
                    >
                      Fırında
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Godfather Family Quotes Strip Below Split */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-b border-[#C9A84C]/20 py-7">
          {GODFATHER_FAMILY_QUOTES.map((item) => (
            <div key={item.author} className="space-y-1.5">
              <p className="font-serif italic text-base sm:text-lg text-[#ECE2D0] leading-snug">
                “{item.quote}”
              </p>
              <p className="text-xs uppercase tracking-[0.15em] text-[#C9A84C]">
                {item.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
