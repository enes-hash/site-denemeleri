import React, { useState } from 'react';
import { KODAK_FIRIN_CHAPTERS, PATRIARCH_PORTRAITS } from '../data/familyData';
import { GodfatherRose } from './RoseMotif';

export const BakerySection: React.FC = () => {
  const [selectedChapterId, setSelectedChapterId] = useState<string>(KODAK_FIRIN_CHAPTERS[0].id);
  const [imgError, setImgError] = useState(false);

  const activeChapter =
    KODAK_FIRIN_CHAPTERS.find((item) => item.id === selectedChapterId) ?? KODAK_FIRIN_CHAPTERS[0];

  return (
    <section id="kodak-firin" className="relative py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#C9A84C] mb-2">
              Güngören · Ailenin Kalesi
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#F5EFE2]">
              Kodak Fırın
            </h2>
          </div>
          <p className="font-serif italic text-lg text-[#C7BCAE] max-w-md">
            Mehmet Kodak’ın kurduğu, çocuklarının ve torunlarının omuz omuza yaşattığı aile ocağı.
          </p>
        </div>

        <div className="leather-card rounded-2xl p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Kodak Fırın Photo Showcase */}
            <div className="lg:col-span-5 relative min-h-[350px] rounded-xl overflow-hidden bg-[#0A0707] border border-[#C9A84C]/20">
              {!imgError ? (
                <img
                  src={PATRIARCH_PORTRAITS.bakery}
                  alt="Mehmet Kodak — Kodak Fırın içinde elinde kırmızı gül ile"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover object-center contrast-[1.06]"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
                  <GodfatherRose className="h-14 w-14 mb-3" />
                  <p className="font-display text-lg text-[#F2ECE1]">Kodak Fırın</p>
                </div>
              )}

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080606]/92 via-transparent to-black/20"
              />

              <div className="absolute top-3.5 left-3.5 rounded-full bg-black/65 border border-[#8F141D]/55 p-2 backdrop-blur-sm">
                <GodfatherRose className="h-5 w-5" />
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 text-xs text-[#D8B968]">
                  <span>Kodak Fırın</span>
                  <span aria-hidden="true">·</span>
                  <span>Güngören</span>
                  <span aria-hidden="true">·</span>
                  <span>Mehmet Kodak</span>
                </div>
                <p className="mt-1 font-serif italic text-lg text-[#F5EFE2]">
                  “Her sağlam ocağın ardında sözüne sadık bir aile vardır.”
                </p>
              </div>
            </div>

            {/* Kodak Fırın & Godfather Family Code Tabs */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div
                  role="tablist"
                  aria-label="Kodak Fırın bölümleri"
                  className="grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-[#090707] border border-[#C9A84C]/20 mb-8"
                >
                  {KODAK_FIRIN_CHAPTERS.map((chapter) => {
                    const isActive = chapter.id === activeChapter.id;
                    return (
                      <button
                        key={chapter.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setSelectedChapterId(chapter.id)}
                        className={`px-3 py-2.5 text-xs font-medium rounded-lg transition-all text-center whitespace-nowrap truncate cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-[#8F141D] via-[#B48A30] to-[#D4B259] text-[#FDF9F0] font-semibold'
                            : 'text-[#BDB3A2] hover:text-[#F2ECE1] hover:bg-[#191312]'
                        }`}
                      >
                        {chapter.tabLabel}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#C9A84C]">
                    <GodfatherRose className="h-4 w-4 shrink-0" />
                    <span>{activeChapter.subtitle}</span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#F5EFE2]">
                    {activeChapter.title}
                  </h3>

                  <blockquote className="py-3 border-y border-[#8F141D]/35">
                    <p className="font-serif italic text-lg sm:text-xl text-[#EFE5D4]">
                      {activeChapter.quote}
                    </p>
                  </blockquote>

                  <p className="text-base text-[#C4BAA8] leading-relaxed">
                    {activeChapter.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    {activeChapter.principles.map((detail, idx) => (
                      <div
                        key={detail}
                        className="rounded-lg bg-[#0A0707]/90 border border-[#C9A84C]/18 px-4 py-3.5"
                      >
                        <p className="font-mono text-xs text-[#C9A84C] tabular-nums mb-1">
                          0{idx + 1}
                        </p>
                        <p className="text-sm font-medium text-[#EFE7D8]">{detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-[#C9A84C]/15 flex flex-wrap items-center justify-between gap-4 text-xs text-[#9C9282]">
                <span>Kodak Fırın · Aile Emaneti</span>
                <span>Mehmet Kodak ve Evlatları</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
