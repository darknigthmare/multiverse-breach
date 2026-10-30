import assert from 'node:assert/strict';
import test from 'node:test';
import { SoundEngine } from '../src/game/soundEngine.js';

const stage = id => ({ id, name: id, universe: 'Nexus de Convergence', mode: 'RPG' });
const audioParam = () => ({
  value: 0,
  setValueAtTime(value) { this.value = value; },
  linearRampToValueAtTime(value) { this.value = value; },
  exponentialRampToValueAtTime(value) { this.value = value; }
});

// Only the browser audio graph and interval driver are replaced. Every music
// request, plan, source scheduling and lifecycle call uses the real engine.
function withAudio(callback) {
  const descriptors = new Map(['window', 'setInterval', 'clearInterval'].map(
    key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]
  ));
  const nodes = [], contexts = [], intervals = new Map();
  let nextInterval = 0;
  class AudioNode {
    constructor(kind) {
      this.kind = kind;
      this.connections = [];
      this.stops = [];
      this.disconnected = false;
      for (const key of ['gain', 'frequency', 'detune', 'Q', 'playbackRate']) this[key] = audioParam();
      nodes.push(this);
    }
    connect(destination) { this.connections.push(destination); }
    disconnect() { this.connections = []; this.disconnected = true; }
    start(time) { this.started = time; }
    stop(time) { this.stops.push(time); }
    addEventListener() {}
  }
  class AudioContext {
    constructor() {
      this.currentTime = 0;
      this.state = 'running';
      this.sampleRate = 8000;
      this.destination = {};
      contexts.push(this);
    }
    createGain() { return new AudioNode('gain'); }
    createOscillator() { return new AudioNode('oscillator'); }
    createBiquadFilter() { return new AudioNode('filter'); }
    createBufferSource() { return new AudioNode('buffer'); }
    createBuffer(channels, length, sampleRate) {
      return { sampleRate, getChannelData: () => new Float32Array(length) };
    }
    resume() { this.state = 'running'; return Promise.resolve(); }
    suspend() { this.state = 'suspended'; return Promise.resolve(); }
  }
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { AudioContext } });
  globalThis.setInterval = handler => { intervals.set(++nextInterval, handler); return nextInterval; };
  globalThis.clearInterval = id => intervals.delete(id);
  const sound = new SoundEngine({ storage: null });
  const start = (id = 'current-scene') => {
    const plan = sound.playStageBgm(stage(id), 'battle');
    sound.unlockFromGesture();
    assert.equal(intervals.size, 1);
    assert.ok(sound.activeSources.length > 0);
    return plan;
  };
  try { callback({ sound, start, nodes, contexts, intervals }); }
  finally {
    sound.stopBgm();
    for (const [key, descriptor] of descriptors) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
}

test('an explicit scene stop cannot be undone by another gesture unlock', () => withAudio(({ sound, start, intervals }) => {
  start('finished-battle');
  sound.stopBgm();
  sound.unlockFromGesture();
  sound.unlockFromGesture();
  assert.equal(intervals.size, 0);
  assert.equal(sound.activeSources.length, 0);
}));

test('a sound effect after scene stop still plays through SFX without restarting music', () => withAudio(({ sound, start, nodes, intervals }) => {
  start('finished-battle');
  sound.stopBgm();
  const before = nodes.length;
  sound.playSfx('coin');
  assert.equal(intervals.size, 0);
  assert.equal(sound.activeSources.length, 0);
  const oscillators = nodes.slice(before).filter(node => node.kind === 'oscillator');
  assert.equal(oscillators.length, 1, 'Only the requested coin oscillator is created');
  assert.equal(oscillators[0].connections[0].connections[0], sound.sfxOutput);
}));

test('a pending scene cancelled before the first gesture never starts music', () => withAudio(({ sound, contexts, intervals }) => {
  sound.playStageBgm(stage('abandoned-before-unlock'), 'battle');
  assert.equal(contexts.length, 0);
  sound.stopBgm();
  sound.unlockFromGesture();
  assert.equal(contexts.length, 1, 'A real gesture may still initialize the audio buses');
  assert.equal(intervals.size, 0);
  assert.equal(sound.activeSources.length, 0);
}));

test('an explicit stop while muted cancels the scene before unmuting', () => withAudio(({ sound, start, intervals }) => {
  start();
  sound.setMute(true);
  sound.stopBgm();
  sound.setMute(false);
  assert.equal(intervals.size, 0);
  assert.equal(sound.activeSources.length, 0);
}));

test('muting and unmuting after an explicit stop cannot revive the old scene', () => withAudio(({ sound, start, intervals }) => {
  start();
  sound.stopBgm();
  sound.setMute(true);
  sound.setMute(false);
  assert.equal(intervals.size, 0);
}));

test('ordinary mute and unmute preserve the current scene and independent volume settings', () => withAudio(({ sound, start, intervals }) => {
  const plan = start('preserved-scene');
  sound.setMusicVolume(0.25);
  sound.setSfxVolume(0.6);
  sound.setMute(true);
  assert.equal(intervals.size, 0);
  assert.equal(sound.masterOutput.gain.value, 0);
  sound.setMute(false);
  assert.equal(intervals.size, 1);
  assert.equal(sound.currentMusicPlan.key, plan.key);
  assert.deepEqual(sound.getSettings(), { musicVolume: 0.25, sfxVolume: 0.6, muted: false });
  assert.equal(sound.musicOutput.gain.value, 0.25);
  assert.equal(sound.sfxOutput.gain.value, 0.6);
}));

test('changing scenes while muted resumes only the latest request', () => withAudio(({ sound, start, intervals }) => {
  const previous = start('previous-scene');
  sound.setMute(true);
  const latest = sound.playStageBgm(stage('latest-scene'), 'boss');
  sound.playSfx('coin');
  assert.equal(intervals.size, 0);
  sound.setMute(false);
  assert.equal(intervals.size, 1);
  assert.notEqual(latest.key, previous.key);
  assert.equal(sound.currentMusicPlan.key, latest.key);
}));

test('a new request after an explicit muted stop can resume normally', () => withAudio(({ sound, start, intervals }) => {
  start('cancelled-scene');
  sound.setMute(true);
  sound.stopBgm();
  const plan = sound.playStageBgm(stage('new-scene'), 'hub');
  assert.equal(intervals.size, 0);
  sound.setMute(false);
  assert.equal(intervals.size, 1);
  assert.equal(sound.currentMusicPlan.key, plan.key);
}));

test('replacing active music stops its sources and leaves only one scheduler', () => withAudio(({ sound, start, intervals }) => {
  start('old-scene');
  const oldSources = [...sound.activeSources], oldMaster = sound.bgmMaster;
  const next = sound.playStageBgm(stage('next-scene'), 'battle');
  assert.equal(intervals.size, 1);
  assert.equal(sound.currentMusicPlan.key, next.key);
  assert.ok(oldSources.every(source => source.stops.includes(undefined)));
  assert.equal(oldMaster.disconnected, true);
  assert.ok(sound.activeSources.every(source => !oldSources.includes(source)));
}));

test('repeating the active request and playing SFX do not reset the music sequence', () => withAudio(({ sound, start, intervals }) => {
  const plan = start();
  const interval = sound.bgmInterval, master = sound.bgmMaster, beat = sound.beatIndex;
  sound.playStageBgm(stage('current-scene'), 'battle');
  sound.playSfx('coin');
  assert.equal(intervals.size, 1);
  assert.equal(sound.bgmInterval, interval);
  assert.equal(sound.bgmMaster, master);
  assert.equal(sound.currentMusicPlan.key, plan.key);
  assert.equal(sound.beatIndex, beat);
}));

test('stopping twice releases music once and keeps the audio context reusable', () => withAudio(({ sound, start, contexts, intervals }) => {
  start();
  const oldSources = [...sound.activeSources], context = sound.ctx;
  sound.stopBgm(); sound.stopBgm();
  assert.equal(intervals.size, 0);
  assert.ok(oldSources.every(source => source.stops.filter(time => time === undefined).length === 1));
  const plan = sound.playStageBgm(stage('fresh-scene'), 'battle');
  assert.equal(intervals.size, 1);
  assert.equal(contexts.length, 1);
  assert.equal(sound.ctx, context);
  assert.equal(sound.currentMusicPlan.key, plan.key);
}));

test('a fresh request after cancelling a locked request starts only the new scene', () => withAudio(({ sound, contexts, intervals }) => {
  sound.playStageBgm(stage('cancelled-before-gesture'), 'battle');
  sound.stopBgm();
  const fresh = sound.playStageBgm(stage('fresh-before-gesture'), 'hub');
  assert.equal(contexts.length, 0);
  sound.unlockFromGesture();
  assert.equal(intervals.size, 1);
  assert.equal(sound.currentMusicPlan.key, fresh.key);
}));
