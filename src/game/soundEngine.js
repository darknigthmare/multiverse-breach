// Web Audio API Retro 8-bit Sound Synthesizer

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.bgmNode = null;
    this.activeSources = [];
    this.bgmInterval = null;
    this.bgmSequence = null;
    this.currentTempo = 120;
    this.beatIndex = 0;
    this.bgmTheme = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      this.ctx = new AudioContext();
    }
  }

  resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMute(mute) {
    this.muted = mute;
    if (mute) {
      this.stopBgm();
      if (this.ctx && this.ctx.state === 'running') {
        this.ctx.suspend();
      }
    } else {
      this.resume();
      if (this.bgmTheme) {
        this.playBgm(this.bgmTheme);
      }
    }
  }

  playSfx(type) {
    this.resume();
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
        gain.connect(ctx.destination);
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
        gain.connect(ctx.destination);
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
        gain.connect(ctx.destination);
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
        gain.connect(ctx.destination);
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
        gain.connect(ctx.destination);
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
        gain.connect(ctx.destination);
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
          gain.connect(ctx.destination);
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
          gain.connect(ctx.destination);
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
          gain.connect(ctx.destination);
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
          gain.connect(ctx.destination);
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
        gain.connect(ctx.destination);
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
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.16);
        });
        break;
      }
    }
  }

  playBgm(theme) {
    this.resume();
    this.bgmTheme = theme;
    if (this.muted || !this.ctx) return;

    this.stopBgm();

    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88;
    const C3 = 130.81, D3 = 146.83, E3 = 164.81, F3 = 174.61, FS3 = 185.00, G3 = 196.00, A3 = 220.00, B3 = 246.94;
    const C5 = 523.25, D5 = 587.33, E5 = 659.25, G5 = 783.99, A5 = 880.00;

    let melody = [];
    let bass = [];
    let tempo = 120;

    if (theme === 'hub') {
      tempo = 110;
      melody = [E4, G4, A4, B4, 0, B4, A4, G4, E4, D4, E4, G4, A4, 0, B4, D5];
      bass = [E3, E3, G3, G3, A3, A3, B3, B3, E3, E3, G3, G3, A3, A3, B3, D3];
    } else if (theme === 'battle') {
      tempo = 140;
      melody = [E4, E4, 0, G4, A4, G4, B4, A4, E4, E4, 0, D5, C5, B4, A4, G4];
      bass = [E3, B3, E3, B3, G3, D3, G3, D3, A3, E3, A3, E3, B3, FS3, B3, B3];
    } else {
      return;
    }

    this.currentTempo = tempo;
    const secondsPerBeat = 60.0 / tempo;
    const noteDuration = secondsPerBeat * 0.5;

    let nextNoteTime = this.ctx.currentTime;
    this.beatIndex = 0;

    const scheduleNotes = () => {
      while (nextNoteTime < this.ctx.currentTime + 0.2) {
        const currentMelodyNote = melody[this.beatIndex % melody.length];
        const currentBassNote = bass[this.beatIndex % bass.length];

        if (currentMelodyNote > 0) {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(currentMelodyNote, nextNoteTime);
          gain.gain.setValueAtTime(0.05, nextNoteTime);
          gain.gain.linearRampToValueAtTime(0.005, nextNoteTime + noteDuration - 0.02);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(nextNoteTime);
          osc.stop(nextNoteTime + noteDuration);
          this.activeSources.push(osc);
        }

        if (currentBassNote > 0) {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(currentBassNote, nextNoteTime);
          gain.gain.setValueAtTime(0.04, nextNoteTime);
          gain.gain.linearRampToValueAtTime(0.005, nextNoteTime + noteDuration - 0.02);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(nextNoteTime);
          osc.stop(nextNoteTime + noteDuration);
          this.activeSources.push(osc);
        }

        nextNoteTime += noteDuration;
        this.beatIndex++;
      }
    };

    this.bgmInterval = setInterval(scheduleNotes, 100);
  }

  stopBgm() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.activeSources.forEach(src => {
      try {
        src.stop();
      } catch (e) {}
    });
    this.activeSources = [];
  }
}

const sound = new SoundEngine();
export default sound;
