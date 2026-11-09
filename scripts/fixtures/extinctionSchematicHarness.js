import { HEROES_DB } from '../../src/game/heroes.js';
import { createPlayerHero } from '../../src/game/playerHero.js';
import { getExtinctionFighterProfile } from '../../src/game/extinctionFighterProfiles.js';
import { createExtinctionProtocolState, activateExtinctionProtocol, tickExtinctionProtocols } from '../../src/game/extinctionSignatures.js';
import { drawExtinctionSchematic } from '../../src/game/extinctionContent.js';

const heroes = [createPlayerHero(), ...HEROES_DB];
const identities = ['player_anchor', 'arca_tessera', 'masterchief', 'ripley', 'survivor',
  'doomslayer', 'rick_dc', 'siren_head', 'hw_wheelchair_guy'];
const localized = value => typeof value === 'string' ? value : value?.fr || value?.en || '';
const samples = identities.map(id => {
  const profile = getExtinctionFighterProfile(heroes.find(hero => hero.id === id));
  return { id, profile, title: profile.name, detail: localized(profile.signature.actions.simple.name) };
});
for (const [type, title, color] of [['shotgun', 'Fusil de terrain', '#f0b46c'], ['rocket', 'Lanceur de terrain', '#f08075'], ['plasma', 'Plasma de terrain', '#75cfef']]) {
  samples.push({ id: `pickup-${type}`, profile: samples[0].profile, type, color, title, detail: 'Arme récupérée — kit personnel conservé' });
}

let phase = 'idle';
const select = document.querySelector('#sample'), matrix = document.querySelector('#matrix');
for (const sample of samples) {
  const option = document.createElement('option'); option.value = sample.id; option.textContent = sample.title; select.append(option);
  const card = document.createElement('article'); card.dataset.sample = sample.id;
  const header = document.createElement('header'), title = document.createElement('strong'), detail = document.createElement('small');
  title.textContent = sample.title; detail.textContent = sample.detail; header.append(title, detail);
  const canvas = document.createElement('canvas'); canvas.setAttribute('aria-label', `Schéma : ${sample.title}`);
  const footer = document.createElement('footer'); card.append(header, canvas, footer); matrix.append(card);
}

function prepare(sample) {
  const profile = sample.profile;
  const state = { phase: 'running', heroId: profile.heroId, runId: 'schematic-fixture', t: 100,
    hp: 75, maxHp: 100, px: 0, py: 0, angle: 0, vx: 0, vy: 0, turnVel: 0, ammo: 24, maxAmmo: 24,
    weapon: { type: 'pistol', ammo: 24, maxAmmo: 24, resource: profile.resource.kind },
    protocols: createExtinctionProtocolState(profile.signature, 'schematic-fixture'),
    enemies: [{ id: 'target', kind: 'Traqueur', wx: 0, wy: 2, hp: 500, maxHp: 500, size: 1 }] };
  if (sample.type) state.weapon = { type: sample.type, ammo: 6, maxAmmo: 6, fireRate: 1, color: sample.color };
  if (phase === 'attack' || phase === 'recovery') {
    if (sample.type) { state.lastFireTime = 100; state.muzzle = 36; }
    else if (!activateExtinctionProtocol(state, 'simple').activated) throw new Error(`Fixture action refused: ${sample.id}`);
    if (phase === 'recovery') for (let i = 0; i < 8; i++) { state.t++; tickExtinctionProtocols(state); }
    // Pickup recoil lasts 12 ticks; its actual fire-rate recovery lasts 18.
    if (sample.type && phase === 'recovery') state.t += 6;
  }
  if (phase === 'reload' && (sample.type || profile.resource.kind === 'ammo')) state.reloadPulse = 18;
  if (phase === 'empty' && (sample.type || profile.resource.kind === 'ammo')) { state.ammo = 0; state.weapon.ammo = 0; }
  return state;
}

function draw(canvas, sample, stage = false) {
  const bounds = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, Math.round(bounds.width));
  canvas.height = Math.max(1, Math.round(stage ? bounds.height : bounds.width / 1.65));
  const state = prepare(sample), before = JSON.stringify(state);
  const result = drawExtinctionSchematic(canvas.getContext('2d'), state, canvas.width, canvas.height);
  return { id: sample.id, ...result, width: canvas.width, height: canvas.height,
    unchanged: JSON.stringify(state) === before, requestedPhase: phase };
}

const qa = { records: [], stage: null };
function render() {
  qa.records = samples.map(sample => {
    const card = document.querySelector(`[data-sample="${sample.id}"]`), record = draw(card.querySelector('canvas'), sample);
    card.querySelector('footer').textContent = `${record.view.style} · ${record.view.phase} · ${record.view.source}`;
    return record;
  });
  const selected = samples.find(sample => sample.id === select.value) || samples[0];
  qa.stage = draw(document.querySelector('#stage'), selected, true);
  document.querySelector('#stage-caption').textContent = `${selected.title} · ${selected.detail} · ${qa.stage.view.phase}`;
}

function pixels(canvas) {
  const { width, height } = canvas, bytes = canvas.getContext('2d').getImageData(0, 0, width, height).data;
  let count = 0, bright = 0, topHalf = 0, hash = 2166136261;
  const bounds = { left: width, top: height, right: -1, bottom: -1 };
  for (let i = 0; i < bytes.length; i += 4) {
    for (let channel = 0; channel < 4; channel++) hash = Math.imul(hash ^ bytes[i + channel], 16777619) >>> 0;
    if (bytes[i + 3] < 16) continue;
    const pixel = i / 4, x = pixel % width, y = Math.floor(pixel / width); count++;
    if (y < height / 2) topHalf++;
    if (bytes[i] + bytes[i + 1] + bytes[i + 2] > 420) bright++;
    bounds.left = Math.min(bounds.left, x); bounds.right = Math.max(bounds.right, x);
    bounds.top = Math.min(bounds.top, y); bounds.bottom = Math.max(bounds.bottom, y);
  }
  return { count, bright, topHalf, bounds, hash: hash.toString(16).padStart(8, '0') };
}

window.__schematicQA = {
  render,
  read: () => ({ phase, records: qa.records.map(record => ({ ...record,
    pixels: pixels(document.querySelector(`[data-sample="${record.id}"] canvas`)) })),
    stage: { ...qa.stage, pixels: pixels(document.querySelector('#stage')) } })
};
select.addEventListener('change', render);
document.querySelectorAll('[data-phase]').forEach(button => button.addEventListener('click', () => {
  phase = button.dataset.phase;
  document.querySelectorAll('[data-phase]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
  render();
}));
window.addEventListener('resize', render);
requestAnimationFrame(render);
