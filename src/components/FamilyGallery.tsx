import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { FAMILY_PHOTOS, FamilyCategory, FamilyPhoto } from '../data/familyData';

const FILTER_OPTIONS: Array<{ id: FamilyCategory; label: string }> = [
  { id: 'all', label: 'Tüm Aile' },
  { id: 'elders', label: 'Aile Büyükleri' },
  { id: 'children', label: 'Çocuklarımız' },
  { id: 'grandchildren', label: 'Torunlarımız' },
];

export const FamilyGallery: React.FC = () => {
  const [filter, setFilter] = useState<FamilyCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const visiblePhotos = useMemo(() => {
    if (filter === 'all') return FAMILY_PHOTOS;
    return FAMILY_PHOTOS.filter(
      (photo) => photo.category === filter || photo.secondaryCategory === filter
    );
  }, [filter]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) =>
          prev === null ? null : (prev + 1) % visiblePhotos.length
        );
      }
      if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) =>
          prev === null ? null : (prev - 1 + visiblePhotos.length) % visiblePhotos.length
        );
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedIndex, visiblePhotos.length]);

  const activePhoto: FamilyPhoto | null =
    selectedIndex !== null && visiblePhotos[selectedIndex]
      ? visiblePhotos[selectedIndex]
      : null;

  return (
    <section id="album" className="relative py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#C9A84C] mb-2">
              Üç Kuşak · Hatıralar
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#F5EFE2]">
              Kodak Aile Albümü
            </h2>
            <p className="mt-2.5 font-serif italic text-lg sm:text-xl text-[#E8DAC0] max-w-xl">
              “Bu hayatta bir insanın sığınabileceği tek gerçek kale, kendi ailesidir.”
            </p>
            <p className="mt-1.5 text-sm text-[#A99F8E] max-w-xl">
              Babamız Mehmet Kodak’tan çocuklarımıza, evin neşesi torunlarımıza uzanan özel kareler. Fotoğraflara tıklayarak tam ekran inceleyebilirsiniz.
            </p>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#120F0C] border border-[#C9A84C]/25 self-start lg:self-auto">
            {FILTER_OPTIONS.map((opt) => {
              const active = filter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setFilter(opt.id);
                    setSelectedIndex(null);
                  }}
                  className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#C9A84C] text-[#090705] font-semibold'
                      : 'text-[#C6BCA9] hover:text-[#F5EFE2] hover:bg-[#1C1712]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visiblePhotos.map((photo, idx) => {
            const isBroken = Boolean(failedImages[photo.id]);
            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className="group leather-card rounded-xl overflow-hidden text-left transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-2 cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0A0807]">
                  {!isBroken ? (
                    <img
                      src={photo.src}
                      alt={photo.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [photo.id]: true }))
                      }
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#15110E] p-6 text-center">
                      <span className="font-display text-base text-[#C9A84C]">{photo.title}</span>
                    </div>
                  )}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0C0A08]/80 via-transparent to-transparent opacity-80"
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#C9A84C] mb-1.5">
                      <span>{photo.roleLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#9E9484]">{photo.generation}</span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-[#F5EFE2] group-hover:text-[#E8CB78] transition-colors">
                      {photo.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-[#AFA595] leading-relaxed line-clamp-2">
                      {photo.caption}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activePhoto && selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-md p-4 sm:p-8"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative w-full max-w-4xl leather-card rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              aria-label="Fotoğrafı kapat"
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/75 border border-[#C9A84C]/40 text-[#F5EFE2] hover:bg-[#C9A84C] hover:text-[#090705] transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative bg-[#070605] flex items-center justify-center max-h-[68vh] min-h-[320px]">
              <img
                src={activePhoto.src}
                alt={activePhoto.title}
                referrerPolicy="no-referrer"
                className="max-h-[68vh] w-auto max-w-full object-contain"
              />

              {visiblePhotos.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Önceki fotoğraf"
                    onClick={() =>
                      setSelectedIndex(
                        (selectedIndex - 1 + visiblePhotos.length) % visiblePhotos.length
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/70 border border-[#C9A84C]/35 text-[#F5EFE2] hover:bg-[#C9A84C] hover:text-[#090705] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Sonraki fotoğraf"
                    onClick={() =>
                      setSelectedIndex((selectedIndex + 1) % visiblePhotos.length)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/70 border border-[#C9A84C]/35 text-[#F5EFE2] hover:bg-[#C9A84C] hover:text-[#090705] transition-colors cursor-pointer"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            <div className="p-6 bg-[#120F0C] border-t border-[#C9A84C]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#C9A84C] mb-1">
                  <span>{activePhoto.roleLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activePhoto.generation}</span>
                </div>
                <h3 className="font-display text-xl font-semibold text-[#F5EFE2]">
                  {activePhoto.title}
                </h3>
                <p className="mt-1 text-sm text-[#BDB3A2]">{activePhoto.caption}</p>
              </div>
              <p className="font-mono text-xs text-[#9C9282] tabular-nums shrink-0">
                {selectedIndex + 1} / {visiblePhotos.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
