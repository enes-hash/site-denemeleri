import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Volume2, VolumeX } from 'lucide-react';
import { FAMILY_ACCESS_CODES, PATRIARCH_PORTRAITS } from '../data/familyData';
import { FamilyCrest } from './FamilyCrest';
import { MarionetteBackdropStrings } from './GodfatherCoverGraphic';
import { GodfatherRose } from './RoseMotif';
import { SmokeOverlay } from './SmokeOverlay';

interface AuthGateProps {
  onUnlock: (enableJazz: boolean) => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({ onUnlock }) => {
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [shake, setShake] = useState(false);
  const [withJazz, setWithJazz] = useState(true);
  const [imgError, setImgError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = passcode.trim().toLocaleLowerCase('tr-TR');
    if (!cleaned) {
      triggerError('Lütfen aile şifresini giriniz.');
      return;
    }

    if (FAMILY_ACCESS_CODES.includes(cleaned)) {
      onUnlock(withJazz);
    } else {
      triggerError('Şifre doğrulanamadı. Bu kapı yalnızca Kodak ailesine açıktır.');
    }
  };

  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    setShake(true);
    window.setTimeout(() => setShake(false), 420);
  };

  return (
    <div className="relative min-h-screen w-full godfather-canvas flex items-center justify-center px-4 py-10 overflow-hidden">
      <MarionetteBackdropStrings />
      <SmokeOverlay intensity="gate" />

      {/* Subtle Godfather red-black vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 42%, rgba(216, 40, 32, 0.10) 0%, rgba(3, 3, 3, 0.92) 72%)',
        }}
      />

      <main className="relative z-10 w-full max-w-4xl">
        <div
          className={`leather-card rounded-2xl overflow-hidden transition-transform ${
            shake ? 'animate-shake' : ''
          }`}
        >
          <div className="leather-stitch m-2 rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* Left Portrait Column */}
            <div className="relative lg:col-span-5 min-h-[280px] lg:min-h-[530px] bg-[#000000] overflow-hidden">
              {!imgError ? (
                <img
                  src={PATRIARCH_PORTRAITS.rose}
                  alt="Mehmet Kodak — Kodak Ailesi Reisi"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover object-top grayscale-[20%] contrast-[1.1] brightness-[0.86]"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-[#080707] p-8 text-center">
                  <FamilyCrest className="h-20 w-20 mb-4" />
                  <p className="font-display text-lg text-[#D4B259]">Mehmet Kodak</p>
                </div>
              )}

              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/35 to-transparent"
              />

              {/* Red Rose Lapel Emblem */}
              <div className="absolute top-4 left-4 flex items-center gap-2 rounded-lg bg-black/75 border border-[#DE2C24]/50 px-2.5 py-1.5 backdrop-blur-sm">
                <GodfatherRose className="h-5 w-5" />
                <span className="font-serif italic text-xs text-[#F5D6D4]">The Kodak Family</span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xs tracking-[0.22em] uppercase text-[#C9A84C] mb-1">
                  Baba · Ailenin Reisi
                </p>
                <h2 className="font-display text-2xl font-semibold text-[#F5EFE2]">
                  Mehmet Kodak
                </h2>
                <p className="mt-2 font-serif italic text-base text-[#E2D6C5] leading-snug">
                  “Bir adam ailesine vakit ayırmıyorsa asla gerçek bir adam olamaz.”
                </p>
              </div>
            </div>

            {/* Right Vault Form Column */}
            <div className="lg:col-span-7 p-7 sm:p-10 lg:p-12 flex flex-col justify-between bg-[#080707]/95">
              <div>
                <div className="flex items-center justify-between gap-4 mb-7">
                  <div className="flex items-center gap-3.5">
                    <FamilyCrest className="h-14 w-14 shrink-0" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-[#C9A84C]">
                        Özel Aile Arşivi
                      </p>
                      <h1 className="font-display text-2xl sm:text-3xl font-black text-[#DE2C24] tracking-wide">
                        The Kodak Family
                      </h1>
                    </div>
                  </div>
                  <GodfatherRose className="h-8 w-8 hidden sm:block opacity-90" />
                </div>

                <div className="h-px bg-gradient-to-r from-[#DE2C24]/60 via-[#C9A84C]/45 to-transparent mb-7" />

                <p className="font-serif text-lg sm:text-xl text-[#EAE2D3] leading-relaxed mb-2">
                  Bu kapı yalnızca Kodak soyadını ve Kodak Fırın’ın şerefini paylaşan aile fertlerine açılır.
                </p>
                <p className="text-sm text-[#A59B8C] leading-relaxed mb-7">
                  İçeri adım atmak için aile şifresini giriniz.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div>
                    <label
                      htmlFor="family-passcode"
                      className="block text-xs uppercase tracking-[0.18em] text-[#C9A84C] mb-2.5"
                    >
                      Aile Şifresi
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A59B8C]">
                        <Lock className="h-4 w-4" />
                      </span>
                      <input
                        id="family-passcode"
                        type={showPasscode ? 'text' : 'password'}
                        value={passcode}
                        onChange={(e) => {
                          setPasscode(e.target.value);
                          if (errorMsg) setErrorMsg('');
                        }}
                        placeholder="Şifreyi giriniz..."
                        autoComplete="current-password"
                        className="w-full rounded-lg bg-[#030303] border border-[#C9A84C]/30 pl-10 pr-11 py-3 text-sm text-[#F2ECE1] placeholder-[#6E665B] focus:border-[#E2C26B] focus:outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasscode((prev) => !prev)}
                        aria-label={showPasscode ? 'Şifreyi gizle' : 'Şifreyi göster'}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-[#A59B8C] hover:text-[#E2C26B] transition-colors"
                      >
                        {showPasscode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {errorMsg && (
                    <p
                      role="alert"
                      className="text-sm text-[#F29B8E] bg-[#3A1214]/60 border border-[#B84A39]/45 rounded-lg px-3.5 py-2.5"
                    >
                      {errorMsg}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                    <button
                      type="button"
                      onClick={() => setWithJazz((prev) => !prev)}
                      className="inline-flex items-center gap-2 text-xs text-[#C7BFA9] hover:text-[#E5C76B] transition-colors py-1.5 cursor-pointer"
                    >
                      {withJazz ? (
                        <Volume2 className="h-4 w-4 text-[#C9A84C]" />
                      ) : (
                        <VolumeX className="h-4 w-4 text-[#787066]" />
                      )}
                      <span>
                        {withJazz ? 'Godfather müziğiyle giriş yap' : 'Sessiz giriş yap'}
                      </span>
                    </button>

                    <span className="text-xs text-[#8D8477]">
                      Varsayılan şifre: <span className="font-mono text-[#C9A84C]">kodak</span>
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-gradient-to-r from-[#8A141D] via-[#B88F35] to-[#D4B259] px-6 py-3.5 text-sm font-semibold tracking-wider uppercase text-[#FDF9F0] shadow-lg shadow-black/60 hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer border border-[#C9A84C]/40"
                  >
                    Aile Kapısını Aç
                  </button>
                </form>
              </div>

              <div className="mt-8 pt-5 border-t border-[#C9A84C]/15 flex items-center justify-between text-xs text-[#7F766A]">
                <span>Kodak Fırın · Güngören</span>
                <span>Sadece Aileye Özel</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
