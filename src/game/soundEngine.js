// Web Audio API Retro 8-bit Sound Synthesizer
import { resolveStageMusicProfile } from './stageMusicProfiles.js';
import { readAudioPreferences, writeAudioPreferences } from './audioPreferences.js';

export class SoundEngine {
  constructor({ storage = globalThis?.localStorage } = {}) {
    const preferences = readAudioPreferences(storage);
    this.storage = storage;
    this.ctx = null;
    this.unlocked = false;
    this.muted = preferences.muted;
    this.musicVolume = preferences.musicVolume;
    this.sfxVolume = preferences.sfxVolume;
    this.masterOutput = null;
    this.musicOutput = null;
    this.sfxOutput = null;
    this.bgmNode = null;
    this.activeSources = [];
    this.bgmInterval = null;
    this.bgmSequence = null;
    this.currentTempo = 120;
    this.beatIndex = 0;
    this.bgmTheme = null;
    this.bgmRequest = null;
    this.currentMusicPlan = null;
    this.bgmMaster = null;
    this.noiseBuffer = null;
  }

  init() {
    if (this.ctx) return;
    if (!this.unlocked || typeof window === 'undefined') return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      this.ctx = new AudioContext();
      this.masterOutput = this.ctx.createGain();
      this.musicOutput = this.ctx.createGain();
      this.sfxOutput = this.ctx.createGain();
      this.musicOutput.connect(this.masterOutput);
      this.sfxOutput.connect(this.masterOutput);
      this.masterOutput.connect(this.ctx.destination);
      this.applyOutputSettings();
    }
  }

  resume() {
    if (!this.unlocked) return;
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  unlockFromGesture() {
    if (!this.unlocked) this.unlocked = true;
    this.resume();
    if (this.muted) return;
    if (this.bgmRequest?.type === 'stage') {
      this.playStageBgm(this.bgmRequest.stage, this.bgmRequest.state);
    } else if (this.bgmTheme) {
      this.playBgm(this.bgmTheme);
    }
  }

  getSettings() {
    return {
      musicVolume: this.musicVolume,
      sfxVolume: this.sfxVolume,
      muted: this.muted
    };
  }

  persistSettings() {
    writeAudioPreferences(this.getSettings(), this.storage);
  }

  applyOutputSettings() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.masterOutput?.gain.setValueAtTime(this.muted ? 0 : 1, now);
    this.musicOutput?.gain.setValueAtTime(this.musicVolume, now);
    this.sfxOutput?.gain.setValueAtTime(this.sfxVolume, now);
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.min(1, Math.max(0, Number(volume) || 0));
    this.applyOutputSettings();
    this.persistSettings();
    return this.getSettings();
  }

  setSfxVolume(volume) {
    this.sfxVolume = Math.min(1, Math.max(0, Number(volume) || 0));
    this.applyOutputSettings();
    this.persistSettings();
    return this.getSettings();
  }

  setMute(mute) {
    this.muted = Boolean(mute);
    this.applyOutputSettings();
    this.persistSettings();
    if (mute) {
      this.stopBgm();
      if (this.ctx && this.ctx.state === 'running') {
        this.ctx.suspend();
      }
    } else {
      this.resume();
      if (this.bgmRequest?.type === 'stage') {
        this.playStageBgm(this.bgmRequest.stage, this.bgmRequest.state);
      } else if (this.bgmTheme) {
        this.playBgm(this.bgmTheme);
      }
    }
  }

  playSfx(type) {
    this.unlockFromGesture();
    if (this.muted || !this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    switch (type) {
      case 'hit': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(10, now + 0.15);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain);
        gain.connect(this.sfxOutput);
        osc.start(now);
        osc.stop(now + 0.16);
        break;
      }
      case 'shoot': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(this.sfxOutput);
        osc.start(now);
        osc.stop(now + 0.21);
        break;
      }
      case 'slash': {
        // High frequency sweep simulating a sword swipe
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.12);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
        osc.connect(gain);
        gain.connect(this.sfxOutput);
        osc.start(now);
        osc.stop(now + 0.13);
        break;
      }
      case 'laser': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.linearRampToValueAtTime(300, now + 0.4);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc.connect(gain);
        gain.connect(this.sfxOutput);
        osc.start(now);
        osc.stop(now + 0.41);
        break;
      }
      case 'jump': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(500, now + 0.18);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.18);
        osc.connect(gain);
        gain.connect(this.sfxOutput);
        osc.start(now);
        osc.stop(now + 0.19);
        break;
      }
      case 'shield': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(600, now + 0.25);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.connect(gain);
        gain.connect(this.sfxOutput);
        osc.start(now);
        osc.stop(now + 0.26);
        break;
      }
      case 'special': {
        // Star arpeggio
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C Major
        notes.forEach((freq, idx) => {
          const t = now + idx * 0.06;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.15, t);
          gain.gain.linearRampToValueAtTime(0.01, t + 0.15);
          osc.connect(gain);
          gain.connect(this.sfxOutput);
          osc.start(t);
          osc.stop(t + 0.16);
        });
        break;
      }
      case 'portal': {
        // Mysterious portal whoosh
        const notes = [440, 554, 659, 880]; // A major
        notes.forEach((freq, idx) => {
          const t = now + idx * 0.08;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.3);
          gain.gain.setValueAtTime(0.1, t);
          gain.gain.linearRampToValueAtTime(0.01, t + 0.3);
          osc.connect(gain);
          gain.connect(this.sfxOutput);
          osc.start(t);
          osc.stop(t + 0.31);
        });
        break;
      }
      case 'victory': {
        const victoryNotes = [
          { freq: 261.63, dur: 0.1 }, // C4
          { freq: 329.63, dur: 0.1 }, // E4
          { freq: 392.00, dur: 0.1 }, // G4
          { freq: 523.25, dur: 0.2 }, // C5
          { freq: 392.00, dur: 0.1 }, // G4
          { freq: 523.25, dur: 0.5 }  // C5
        ];
        let runningTime = now;
        victoryNotes.forEach(note => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.value = note.freq;
          gain.gain.setValueAtTime(0.15, runningTime);
          gain.gain.linearRampToValueAtTime(0.01, runningTime + note.dur - 0.02);
          osc.connect(gain);
          gain.connect(this.sfxOutput);
          osc.start(runningTime);
          osc.stop(runningTime + note.dur);
          runningTime += note.dur;
        });
        break;
      }
      case 'defeat': {
        const defeatNotes = [
          { freq: 392.00, dur: 0.2 }, // G4
          { freq: 369.99, dur: 0.2 }, // F#4
          { freq: 349.23, dur: 0.2 }, // F4
          { freq: 311.13, dur: 0.6 }  // D#4
        ];
        let runningTime = now;
        defeatNotes.forEach(note => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = note.freq;
          gain.gain.setValueAtTime(0.2, runningTime);
          gain.gain.linearRampToValueAtTime(0.01, runningTime + note.dur - 0.02);
          osc.connect(gain);
          gain.connect(this.sfxOutput);
          osc.start(runningTime);
          osc.stop(runningTime + note.dur);
          runningTime += note.dur;
        });
        break;
      }
      case 'coin': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.connect(gain);
        gain.connect(this.sfxOutput);
        osc.start(now);
        osc.stop(now + 0.26);
        break;
      }
      case 'levelup': {
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, idx) => {
          const t = now + idx * 0.05;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.linearRampToValueAtTime(0.01, t + 0.15);
          osc.connect(gain);
          gain.connect(this.sfxOutput);
          osc.start(t);
          osc.stop(t + 0.16);
        });
        break;
      }
    }
  }

  playStageBgm(stage = {}, state = null) {
    const normalizedStage = {
      ...stage,
      id: stage.id || stage.name || 'unknown-stage',
      name: stage.name || String(stage.id || 'Unknown Stage'),
      universe: stage.universe || 'Nexus de Convergence',
      mode: stage.mode || 'RPG'
    };
    const requestedState = state
      || stage.musicState
      || (stage.bossActive || stage.finalGameBoss ? 'boss' : 'battle');
    const plan = resolveStageMusicProfile(normalizedStage, requestedState);
    const alreadyPlaying = this.bgmInterval && this.currentMusicPlan?.key === plan.key;

    this.bgmTheme = `stage|${normalizedStage.mode}|${normalizedStage.universe}|${normalizedStage.id}`;
    this.bgmRequest = { type: 'stage', stage: normalizedStage, state: requestedState };
    this.currentMusicPlan = plan;
    this.currentTempo = plan.tempo;
    if (!this.unlocked) return plan;
    this.resume();

    if (this.muted || !this.ctx || alreadyPlaying) return plan;
    this.startMusicPlan(plan, { arcaIdent: Boolean(normalizedStage.titleIntro) });
    return plan;
  }

  setStageMusicState(state, stagePatch = {}) {
    const baseStage = this.bgmRequest?.stage || {
      id: 'nexus-fallback',
      name: 'Nexus de Convergence',
      universe: 'Nexus de Convergence',
      mode: 'RPG'
    };
    return this.playStageBgm({ ...baseStage, ...stagePatch }, state);
  }

  playStageMusicStinger(kind = 'boss') {
    if (this.muted || !this.ctx || !this.currentMusicPlan) return;
    this.scheduleProfileStinger(this.currentMusicPlan, kind, this.ctx.currentTime + 0.025);
  }

  playBgm(theme) {
    const themeKey = String(theme || '');
    this.bgmTheme = themeKey;

    if (themeKey === 'title') {
      return this.playStageBgm({
        id: 'nexus-title',
        name: 'A.R.C.A. Title Signal',
        universe: 'Nexus de Convergence',
        mode: 'RPG',
        titleIntro: true
      }, 'hub');
    }

    if (themeKey === 'hub') {
      return this.playStageBgm({
        id: 'nexus-hub',
        name: 'A.R.C.A. Nexus Hub',
        universe: 'Nexus de Convergence',
        mode: 'RPG'
      }, 'hub');
    }

    if (themeKey === 'battle') {
      return this.playStageBgm({
        id: 'nexus-legacy-battle',
        name: 'A.R.C.A. Impact Arena',
        universe: 'Nexus de Convergence',
        mode: 'Fighter'
      }, 'battle');
    }

    if (themeKey.startsWith('stage|')) {
      const [, mode = 'RPG', universe = 'Nexus de Convergence', stageId = 'legacy-stage'] = themeKey.split('|');
      return this.playStageBgm({
        id: stageId,
        name: stageId,
        universe,
        mode
      }, 'battle');
    }

    this.bgmRequest = null;
    this.currentMusicPlan = null;
    this.stopBgm();
    return null;
  }

  startMusicPlan(plan, { arcaIdent = false } = {}) {
    if (!this.ctx || !plan?.steps?.length) return;
    this.stopBgm();
    this.currentMusicPlan = plan;
    this.currentTempo = plan.tempo;
    this.beatIndex = 0;

    this.bgmMaster = this.ctx.createGain();
    this.bgmMaster.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    this.bgmMaster.gain.exponentialRampToValueAtTime(0.72, this.ctx.currentTime + 0.08);
    this.bgmMaster.connect(this.musicOutput);

    const stepDuration = (60 / plan.tempo) * plan.stepDurationBeats;
    let nextStepTime = this.ctx.currentTime + 0.035;

    if (arcaIdent) {
      nextStepTime += this.scheduleArcaIdent(plan, nextStepTime);
    }

    if (plan.stinger) {
      this.scheduleProfileStinger(plan, plan.stinger, nextStepTime);
      nextStepTime += stepDuration * (plan.stinger === 'boss' ? 2 : 1);
    }

    const scheduleNotes = () => {
      if (!this.ctx || this.muted || this.currentMusicPlan?.key !== plan.key) return;
      while (nextStepTime < this.ctx.currentTime + 0.22) {
        const stepIndex = this.beatIndex % plan.steps.length;
        this.scheduleMusicStep(plan, plan.steps[stepIndex], stepIndex, nextStepTime, stepDuration);
        nextStepTime += stepDuration;
        this.beatIndex += 1;
      }
    };

    scheduleNotes();
    this.bgmInterval = setInterval(scheduleNotes, 75);
  }

  // Ident original tres court : cinq impulsions A.R.C.A. sont programmees
  // avant que la premiere mesure du theme Nexus ne commence.
  scheduleArcaIdent(plan, startTime) {
    const intervals = [0, 7, 3, 10, 12];
    const durations = [0.11, 0.11, 0.14, 0.14, 0.28];
    let cursor = startTime;
    intervals.forEach((interval, index) => {
      this.scheduleTone({
        midi: plan.tonalCenterMidi + 12 + interval,
        wave: index === intervals.length - 1 ? 'sine' : 'triangle',
        startTime: cursor,
        duration: durations[index],
        volume: plan.gains.lead * (index === intervals.length - 1 ? 1.18 : 0.92),
        filterFrequency: plan.filters.lead * 1.2,
        attack: 0.008
      });
      cursor += durations[index] + 0.045;
    });
    return cursor - startTime + 0.12;
  }

  scheduleMusicStep(plan, step, stepIndex, startTime, stepDuration) {
    const accent = Math.max(0.2, step.accent || 0.5);
    const detune = ((plan.seed + stepIndex * 17) % 9) - 4;

    if (step.lead) {
      this.scheduleTone({
        midi: step.lead,
        wave: plan.waves.lead,
        startTime,
        duration: stepDuration * 0.88,
        volume: plan.gains.lead * (0.72 + accent * 0.3),
        filterFrequency: plan.filters.lead,
        detune
      });
    }

    if (step.bass) {
      this.scheduleTone({
        midi: step.bass,
        wave: plan.waves.bass,
        startTime,
        duration: stepDuration * 1.75,
        volume: plan.gains.bass * (0.8 + accent * 0.25),
        filterFrequency: plan.filters.bass,
        detune: -detune * 0.4
      });
    }

    if (step.chord) {
      const chordDuration = stepDuration * plan.stepsPerBar * 1.65;
      step.chord.forEach((midi, index) => {
        this.scheduleTone({
          midi,
          wave: plan.waves.pad,
          startTime: startTime + index * 0.012,
          duration: chordDuration,
          volume: plan.gains.pad / Math.max(1, step.chord.length),
          filterFrequency: plan.filters.pad,
          attack: Math.min(0.16, chordDuration * 0.2),
          detune: (index - 1) * 3
        });
      });
    }

    if (step.drum) {
      this.scheduleDrum(step.drum, startTime, stepDuration, plan, accent);
    }

    if (plan.bossLayerEnabled && step.boss) {
      this.scheduleTone({
        midi: step.boss,
        wave: plan.boss.wave || plan.waves.boss,
        startTime,
        duration: stepDuration * 2.4,
        volume: (plan.boss.gain || plan.gains.boss) * (0.8 + accent * 0.25),
        filterFrequency: plan.filters.boss,
        detune: -7
      });
    }
  }

  scheduleTone({
    midi,
    wave = 'triangle',
    startTime,
    duration,
    volume,
    filterFrequency,
    detune = 0,
    attack = 0.012
  }) {
    if (!this.ctx || !this.bgmMaster || !Number.isFinite(midi)) return;
    const safeDuration = Math.max(0.045, duration);
    const endTime = startTime + safeDuration;
    const peakTime = Math.min(endTime - 0.025, startTime + Math.max(0.004, attack));
    const oscillator = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    oscillator.type = ['sine', 'square', 'sawtooth', 'triangle'].includes(wave) ? wave : 'triangle';
    oscillator.frequency.setValueAtTime(440 * (2 ** ((midi - 69) / 12)), startTime);
    oscillator.detune.setValueAtTime(detune, startTime);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.max(120, filterFrequency || 1800), startTime);
    filter.Q.setValueAtTime(0.7, startTime);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), peakTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmMaster);
    oscillator.start(startTime);
    oscillator.stop(endTime + 0.01);
    this.trackSource(oscillator);
  }

  scheduleDrum(code, startTime, stepDuration, plan, accent) {
    const baseGain = plan.gains.drums * (0.68 + accent * 0.36);
    if (code === 1) {
      const oscillator = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(128, startTime);
      oscillator.frequency.exponentialRampToValueAtTime(42, startTime + Math.min(0.16, stepDuration));
      gain.gain.setValueAtTime(Math.max(0.0002, baseGain * 1.18), startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + Math.min(0.18, stepDuration * 0.9));
      oscillator.connect(gain);
      gain.connect(this.bgmMaster);
      oscillator.start(startTime);
      oscillator.stop(startTime + Math.min(0.2, stepDuration));
      this.trackSource(oscillator);
      return;
    }

    const duration = code === 3 ? Math.min(0.055, stepDuration * 0.45) : Math.min(0.14, stepDuration * 0.75);
    const filterType = code === 3 ? 'highpass' : code === 4 ? 'bandpass' : 'bandpass';
    const frequency = code === 3 ? 5200 : code === 4 ? plan.filters.noise * 0.72 : plan.filters.noise;
    this.scheduleNoise({
      startTime,
      duration,
      volume: baseGain * (code === 3 ? 0.44 : code === 4 ? 0.88 : 0.72),
      filterType,
      frequency,
      playbackRate: code === 4 ? 0.76 : code === 3 ? 1.32 : 1
    });

    if (code === 4) {
      this.scheduleTone({
        midi: 72 + ((plan.seed + this.beatIndex) % 8),
        wave: 'square',
        startTime,
        duration: Math.min(0.1, stepDuration * 0.65),
        volume: baseGain * 0.36,
        filterFrequency: Math.max(900, plan.filters.noise),
        detune: 11
      });
    }
  }

  scheduleNoise({ startTime, duration, volume, filterType = 'bandpass', frequency = 1800, playbackRate = 1 }) {
    if (!this.ctx || !this.bgmMaster) return;
    const source = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    source.buffer = this.getNoiseBuffer();
    source.playbackRate.setValueAtTime(playbackRate, startTime);
    filter.type = filterType;
    filter.frequency.setValueAtTime(Math.max(120, frequency), startTime);
    filter.Q.setValueAtTime(filterType === 'bandpass' ? 1.6 : 0.8, startTime);
    gain.gain.setValueAtTime(Math.max(0.0002, volume), startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmMaster);
    source.start(startTime);
    source.stop(startTime + duration + 0.01);
    this.trackSource(source);
  }

  getNoiseBuffer() {
    if (this.noiseBuffer && this.noiseBuffer.sampleRate === this.ctx.sampleRate) return this.noiseBuffer;
    const length = Math.max(1, Math.round(this.ctx.sampleRate * 0.5));
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let seed = 0x13579BDF;
    for (let index = 0; index < length; index += 1) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      data[index] = ((seed / 4294967295) * 2 - 1) * (1 - index / length * 0.18);
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  scheduleProfileStinger(plan, kind, startTime) {
    const secondsPerBeat = 60 / plan.tempo;
    const isBoss = kind === 'boss';
    const isDefeat = kind === 'defeat';
    const intervals = isBoss
      ? plan.boss.stinger
      : isDefeat
        ? [7, 6, 3, 1, 0]
        : plan.victory.intervals;
    const beats = isBoss
      ? intervals.map((_, index) => index === intervals.length - 1 ? 1.25 : 0.38)
      : isDefeat
        ? [0.7, 0.7, 0.8, 0.9, 1.5]
        : plan.victory.beats;
    const wave = isBoss
      ? plan.boss.wave || plan.waves.boss
      : isDefeat
        ? 'triangle'
        : plan.victory.wave || plan.waves.lead;
    let cursor = startTime;

    intervals.forEach((interval, index) => {
      const beatLength = beats[index] || 0.5;
      const duration = secondsPerBeat * beatLength;
      this.scheduleTone({
        midi: plan.tonalCenterMidi + 12 + interval,
        wave,
        startTime: cursor,
        duration: Math.max(0.08, duration * 0.92),
        volume: isBoss ? plan.gains.boss * 1.28 : plan.gains.lead * 1.2,
        filterFrequency: isBoss ? plan.filters.boss * 1.25 : plan.filters.lead * 1.15,
        attack: isBoss ? 0.006 : 0.012,
        detune: isBoss ? -5 : 0
      });
      cursor += duration;
    });

    if (isBoss) {
      this.scheduleNoise({
        startTime,
        duration: Math.min(0.24, secondsPerBeat * 0.65),
        volume: plan.gains.drums * 1.35,
        filterType: 'lowpass',
        frequency: Math.max(260, plan.filters.boss),
        playbackRate: 0.58
      });
    }
  }

  trackSource(source) {
    this.activeSources.push(source);
    source.addEventListener('ended', () => {
      const index = this.activeSources.indexOf(source);
      if (index >= 0) this.activeSources.splice(index, 1);
    }, { once: true });
  }

  stopBgm() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    const sources = [...this.activeSources];
    this.activeSources = [];
    sources.forEach(source => {
      try {
        source.stop();
      } catch {}
    });
    if (this.bgmMaster) {
      try {
        this.bgmMaster.disconnect();
      } catch {}
      this.bgmMaster = null;
    }
  }
}

const sound = new SoundEngine();
export default sound;
