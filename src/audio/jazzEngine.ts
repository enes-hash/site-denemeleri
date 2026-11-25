/**
 * The Godfather Theme ("Speak Softly Love") Web Audio Synthesizer + Bakery Arcade FX
 * Synthesizes Sicilian mandolin tremolo, warm strings, and deep bass in C minor.
 * Works 100% offline with zero external audio URL dependencies.
 */

interface MelodyStep {
  freq: number | null;
  durBeats: number;
  chord?: number[];
  bass?: number;
}

// Note frequencies in Hz (C minor key — authentic Godfather Theme motif)
const N = {
  C3: 130.81,
  F3: 174.61,
  G3: 196.0,
  Ab3: 207.65,
  Bb3: 233.08,
  C4: 261.63,
  D4: 293.66,
  Eb4: 311.13,
  F4: 349.23,
  Gb4: 369.99,
  G4: 392.0,
  Ab4: 415.3,
  Bb4: 466.16,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  Eb5: 622.25,
  F5: 698.46,
};

const CM_CHORD = [N.C4, N.Eb4, N.G4];
const FM_CHORD = [N.F3, N.Ab3, N.C4];
const AB_CHORD = [N.Ab3, N.C4, N.Eb4];
const G7_CHORD = [N.G3, N.B4 * 0.5, N.D4, N.F4];

// Classic Godfather Theme ("Speak Softly Love") melodic phrase structure
const GODFATHER_SCORE: MelodyStep[] = [
  // Pickup: G4 - C5 - Eb5 - D5 - C5 - Eb5 - C5 - D5 - C5 - Ab4 - Bb4 - G4
  { freq: N.G4, durBeats: 0.5, bass: N.C3, chord: CM_CHORD },
  { freq: N.C5, durBeats: 0.5 },
  { freq: N.Eb5, durBeats: 0.5 },
  { freq: N.D5, durBeats: 0.5 },
  { freq: N.C5, durBeats: 0.5, bass: N.C3, chord: CM_CHORD },
  { freq: N.Eb5, durBeats: 0.5 },
  { freq: N.C5, durBeats: 0.5 },
  { freq: N.D5, durBeats: 0.5 },
  { freq: N.C5, durBeats: 0.5, bass: N.Ab3, chord: AB_CHORD },
  { freq: N.Ab4, durBeats: 0.5 },
  { freq: N.Bb4, durBeats: 0.5 },
  { freq: N.G4, durBeats: 2.5, bass: N.C3, chord: CM_CHORD },

  // Phrase 2: G4 - C5 - Eb5 - D5 - C5 - Eb5 - C5 - D5 - C5 - G4 - Gb4 - F4
  { freq: N.G4, durBeats: 0.5 },
  { freq: N.C5, durBeats: 0.5 },
  { freq: N.Eb5, durBeats: 0.5 },
  { freq: N.D5, durBeats: 0.5 },
  { freq: N.C5, durBeats: 0.5, bass: N.C3, chord: CM_CHORD },
  { freq: N.Eb5, durBeats: 0.5 },
  { freq: N.C5, durBeats: 0.5 },
  { freq: N.D5, durBeats: 0.5 },
  { freq: N.C5, durBeats: 0.5, bass: N.F3, chord: FM_CHORD },
  { freq: N.G4, durBeats: 0.5 },
  { freq: N.Gb4, durBeats: 0.5 },
  { freq: N.F4, durBeats: 2.5, bass: N.F3, chord: FM_CHORD },

  // Phrase 3: F4 - Ab4 - B4 - D5 / F4 - Ab4 - B4 - C5
  { freq: N.F4, durBeats: 0.5 },
  { freq: N.Ab4, durBeats: 0.5 },
  { freq: N.B4, durBeats: 0.5 },
  { freq: N.D5, durBeats: 2.0, bass: N.G3, chord: G7_CHORD },
  { freq: N.F4, durBeats: 0.5 },
  { freq: N.Ab4, durBeats: 0.5 },
  { freq: N.B4, durBeats: 0.5 },
  { freq: N.C5, durBeats: 2.0, bass: N.C3, chord: CM_CHORD },

  // Phrase 4: C4 - Eb4 - Bb4 - Ab4 - G4 - Bb4 - Ab4 - Ab4 - G4 - G4 - B3 - C4
  { freq: N.C4, durBeats: 0.5 },
  { freq: N.Eb4, durBeats: 0.5 },
  { freq: N.Bb4, durBeats: 0.5, bass: N.F3, chord: FM_CHORD },
  { freq: N.Ab4, durBeats: 0.5 },
  { freq: N.G4, durBeats: 0.5 },
  { freq: N.Bb4, durBeats: 0.5 },
  { freq: N.Ab4, durBeats: 0.5, bass: N.G3, chord: G7_CHORD },
  { freq: N.Ab4, durBeats: 0.5 },
  { freq: N.G4, durBeats: 0.5 },
  { freq: N.G4, durBeats: 0.5 },
  { freq: N.B4 * 0.5, durBeats: 0.5 },
  { freq: N.C4, durBeats: 2.5, bass: N.C3, chord: CM_CHORD },
];

class GodfatherThemeEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private volume = 0.3;
  private schedulerTimer: number | null = null;
  private stepIdx = 0;
  private nextNoteTime = 0;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.0001;
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  public start(): boolean {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return false;
    if (this.isPlaying) return true;

    this.isPlaying = true;
    const now = ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(Math.max(0.0001, this.masterGain.gain.value), now);
    this.masterGain.gain.exponentialRampToValueAtTime(Math.max(0.02, this.volume), now + 0.9);

    this.stepIdx = 0;
    this.nextNoteTime = now + 0.1;
    this.scheduleLoop();
    return true;
  }

  public stop(): void {
    this.isPlaying = false;
    if (this.schedulerTimer !== null) {
      window.clearTimeout(this.schedulerTimer);
      this.schedulerTimer = null;
    }
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(Math.max(0.0001, this.masterGain.gain.value), now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    }
  }

  public setVolume(val: number): void {
    this.volume = Math.min(0.65, Math.max(0.05, val));
    if (this.ctx && this.masterGain && this.isPlaying) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.08);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private scheduleLoop(): void {
    if (!this.isPlaying || !this.ctx) return;

    const beatSeconds = 0.56; // Nostalgic Sicilian ballad tempo
    const lookAhead = 0.3;

    while (this.nextNoteTime < this.ctx.currentTime + lookAhead) {
      const step = GODFATHER_SCORE[this.stepIdx];
      const durSec = step.durBeats * beatSeconds;

      if (step.bass) {
        this.playWarmBass(step.bass, this.nextNoteTime, Math.max(0.8, durSec * 1.6));
      }
      if (step.chord) {
        this.playStringPad(step.chord, this.nextNoteTime, Math.max(1.2, durSec * 2.2));
      }
      if (step.freq) {
        // Long sustained notes get Sicilian mandolin tremolo; short notes get crisp pluck
        if (step.durBeats >= 1.5) {
          this.playMandolinTremolo(step.freq, this.nextNoteTime, durSec * 0.92);
        } else {
          this.playMandolinPluck(step.freq, this.nextNoteTime, durSec * 0.95);
        }
      }

      this.nextNoteTime += durSec;
      this.stepIdx = (this.stepIdx + 1) % GODFATHER_SCORE.length;
    }

    this.schedulerTimer = window.setTimeout(() => this.scheduleLoop(), 110);
  }

  private playMandolinPluck(freq: number, time: number, duration: number, level = 0.14): void {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const oscOct = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    // Paired mandolin strings slightly detuned for authentic Sicilian shimmer
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);
    oscOct.type = 'sine';
    oscOct.frequency.setValueAtTime(freq * 1.003, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, time);
    filter.frequency.exponentialRampToValueAtTime(680, time + duration);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(level, time + 0.014);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    oscOct.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    oscOct.start(time);
    osc.stop(time + duration + 0.03);
    oscOct.stop(time + duration + 0.03);
  }

  private playMandolinTremolo(freq: number, time: number, duration: number): void {
    const strokeGap = 0.095;
    const strokes = Math.max(3, Math.floor(duration / strokeGap));
    for (let i = 0; i < strokes; i++) {
      const fade = 1 - (i / strokes) * 0.45;
      this.playMandolinPluck(freq, time + i * strokeGap, strokeGap * 1.8, 0.11 * fade);
    }
  }

  private playStringPad(freqs: number[], time: number, duration: number): void {
    if (!this.ctx || !this.masterGain) return;
    freqs.forEach((f) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(520, time);

      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(0.022, time + 0.18);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + duration + 0.05);
    });
  }

  private playWarmBass(freq: number, time: number, duration: number): void {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 0.5, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.18, time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  // Arcade Game Sound Effects
  public playPickup(type: 'somun' | 'simit'): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    if (type === 'simit') {
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.exponentialRampToValueAtTime(1180, now + 0.14);
    } else {
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(760, now + 0.09);
    }

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.17);
  }

  public playMove(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.07);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  public playCaught(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [220, 196, 146.83].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 500;

      const t = now + idx * 0.11;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.26);
    });
  }
}

export const jazzEngine = new GodfatherThemeEngine();
