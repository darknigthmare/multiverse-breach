import { ROSTER_SUMMON_CHOREOGRAPHIES_WAVE11, drawRosterSummonCueWave11 } from './rosterSummonChoreographyWave11.js';
import { ROSTER_SUMMON_CHOREOGRAPHIES_WAVE10, drawRosterSummonCueWave10 } from './rosterSummonChoreographyWave10.js';
// Authored motion and effects for exact entity/action identities. These are
// runtime adaptations of the cited actions, not original source-game frames.
// This module only describes/draws motion: it never changes combat resources,
// targets, HP, statuses, or the simulation's single impact callback.
import { ROSTER_SUMMON_CHOREOGRAPHIES_WAVE8 } from './rosterSummonChoreographyWave8.js';
import { ROSTER_SUMMON_CHOREOGRAPHIES_WAVE9, drawRosterSummonCueWave9 } from './rosterSummonChoreographyWave9.js';

const keyFor = (universe, entityName, actionName) => [universe, entityName, actionName].join('::');
const cue = (id, universe, entityName, actionName, sourceReference, motion) => Object.freeze({
  id, universe, entityName, actionName, sourceReference,
  fidelity: 'authored-motion-adaptation', ...motion, muzzle: Object.freeze([...motion.muzzle])
});
const entries = [
  cue('nexus-barricade', 'Nexus de Convergence', 'Balise Barricade', 'Balise Barricade',
    'Bastion’s beacon defines a safe route: deployment, alignment and protective planes, never an explosion.',
    { path: 'floor-deploy', arrival: 0.42, travelTicks: 22, holdTicks: 30, scale: 0.82, offsetX: 72, preparation: 'barricade-align', attack: 'barricade-shields', recovery: 'beacon-retract', muzzle: [0.1, -0.5] }),
  cue('nexus-suture-drone', 'Nexus de Convergence', 'Drone de Suture', 'Drone de Suture',
    'Loom’s drone maintains an ally’s signature: hover, medical link, stabilization and return to the caller.',
    { path: 'ally-hover', arrival: 0.38, travelTicks: 28, holdTicks: 38, scale: 0.7, offsetX: 30, preparation: 'medical-lock', attack: 'medical-tether', recovery: 'medical-return', muzzle: [0, -0.4] }),
  cue('nexus-tessera-reflection', 'Nexus de Convergence', 'Reflet Non Remplace', 'Reflet Non Remplace',
    'Tessera manifests a possible reflection without replacing a person: a mirrored arrival and refracted proof, then dissolution.',
    { path: 'reflection-step', arrival: 0.34, travelTicks: 23, holdTicks: 25, scale: 0.93, offsetX: 96, preparation: 'reflection-align', attack: 'reflection-rays', recovery: 'reflection-dissolve', muzzle: [0.18, -0.48] }),
  cue('nexus-return-probe', 'Nexus de Convergence', 'Sonde de Retour', 'Sonde de Retour',
    'Nadir’s probe verifies a route in both directions: outbound scan, measured contact and a visible retraced return.',
    { path: 'probe-route', arrival: 0.3, travelTicks: 34, holdTicks: 18, scale: 0.65, offsetX: 55, preparation: 'probe-route', attack: 'probe-scan', recovery: 'probe-retrace', muzzle: [0.22, -0.38] }),
  cue('halo-pelican', 'Halo', 'D77-TC Pelican', 'Tir de couverture Pelican',
    'Halo Pelican gunship support: heavy approach, undercarriage firing pass and continued flight out of the arena.',
    { path: 'heavy-flyby', arrival: 0.36, travelTicks: 24, holdTicks: 24, scale: 1.17, flightY: 0.53, bank: 0.045, preparation: 'gunship-lock', attack: 'pelican-ballistics', recovery: 'engine-wake', muzzle: [0.28, -0.23] }),
  cue('half-life-dog', 'Half-Life', 'Dog Breach Assist', 'Dog Breach Assist',
    'Dog’s physical assistance uses a robot leap and grounded force, followed by a bounding retreat; no energy detonation.',
    { path: 'robot-leap', arrival: 0.3, travelTicks: 28, holdTicks: 23, scale: 1.04, offsetX: 68, preparation: 'robot-brace', attack: 'dog-ground-impact', recovery: 'robot-retreat', muzzle: [0.24, -0.35] }),
  cue('portal-turret', 'Portal', 'Turret Summon', 'Turret Summon',
    'Portal sentry: vertical placement, visible red targeting line, a ballistic burst and folding withdrawal.',
    { path: 'turret-drop', arrival: 0.39, travelTicks: 16, holdTicks: 27, scale: 0.72, offsetX: 76, preparation: 'portal-sight', attack: 'portal-burst', recovery: 'turret-fold', muzzle: [0.19, -0.52] }),
  cue('payday-sentry', 'Payday', 'Sentry Deploy', 'Sentry Deploy',
    'PAYDAY’s deployable sentry is placed on the floor, aims mechanically and fires bullets; it does not walk or cast a beam.',
    { path: 'sentry-unfold', arrival: 0.48, travelTicks: 18, holdTicks: 34, scale: 0.73, offsetX: 90, preparation: 'sentry-track', attack: 'sentry-burst', recovery: 'sentry-pack', muzzle: [0.25, -0.52] }),
  cue('slender-pages', 'Slender Man', 'Page Trap', 'Page Trap',
    'The existing page deployment is represented by placed pages, paper motion and camera-static interference, without a fire or magic blast.',
    { path: 'page-scatter', arrival: 0.45, travelTicks: 26, holdTicks: 25, scale: 0.78, offsetX: 60, preparation: 'page-place', attack: 'page-static', recovery: 'page-recall', muzzle: [0, -0.38] }),
  cue('doom-bfg9000', 'Doom', 'BFG-9000', 'BFG-9000',
    'BFG-9000: capacitor charge, one traveling plasma sphere and branching green energy arcs; a single gameplay impact remains authoritative.',
    { path: 'weapon-deploy', arrival: 0.32, travelTicks: 30, holdTicks: 32, scale: 0.87, offsetX: 67, preparation: 'bfg-charge', attack: 'bfg-plasma', recovery: 'bfg-cooldown', muzzle: [0.31, -0.4] }),
  cue('guilty-gear-yamada', 'Guilty Gear', 'Yamada', 'Great Yamada Attack',
    'May’s Great Yamada Attack brings the whale across the scene in an arcing passage with a water surge, then carries it out.',
    { path: 'whale-arc', arrival: 0.26, travelTicks: 31, holdTicks: 25, scale: 1.27, preparation: 'water-rise', attack: 'yamada-water-surge', recovery: 'water-settle', muzzle: [0.3, -0.32] }),
  cue('ff7-ifrit', 'Final Fantasy VII', 'Ifrit', 'Hellfire',
    'Final Fantasy VII Hellfire: Ifrit arrives, gathers fire and sends a ground-reaching flame wave into the opposing formation.',
    { path: 'ifrit-manifest', arrival: 0.32, travelTicks: 30, holdTicks: 35, scale: 1.1, offsetX: 104, preparation: 'hellfire-charge', attack: 'hellfire-wave', recovery: 'hellfire-embers', muzzle: [0.3, -0.43] }),
  cue('ff7-shiva', 'Final Fantasy VII', 'Shiva', 'Diamond Dust',
    'Final Fantasy VII Diamond Dust: Shiva gathers cold, encases targets in ice and shatters the ice before disappearing.',
    { path: 'shiva-manifest', arrival: 0.29, travelTicks: 33, holdTicks: 39, scale: 1.02, offsetX: 100, preparation: 'diamond-frost', attack: 'diamond-freeze-shatter', recovery: 'diamond-dust', muzzle: [0.24, -0.58] }),
  cue('ff7-bahamut', 'Final Fantasy VII', 'Bahamut', 'Megaflare',
    'Final Fantasy VII Megaflare: Bahamut descends above the battlefield, charges at its mouth and releases the charged ray into the targets.',
    { path: 'bahamut-descent', arrival: 0.3, travelTicks: 15, holdTicks: 36, scale: 1.2, offsetX: 102, preparation: 'megaflare-charge', attack: 'megaflare-beam', recovery: 'megaflare-fade', muzzle: [0.33, -0.44] }),
  cue('sonic-tornado', 'Sonic', 'Tails et le Tornado', 'Tornado Machine Gun',
    'Sonic Adventure’s Tornado: a banked airplane approach, machine-gun pass and rising departure, without a teleporting ground entrance.',
    { path: 'tornado-swoop', arrival: 0.34, travelTicks: 22, holdTicks: 23, scale: 1.08, flightY: 0.57, bank: 0.12, preparation: 'tornado-lineup', attack: 'tornado-ballistics', recovery: 'tornado-climb', muzzle: [0.36, -0.33] }),
  cue('jojo-star-platinum', "JoJo's Bizarre Adventure", 'Star Platinum', 'Ora Ora',
    'Star Platinum manifests by Jotaro, closes to punch range, performs a visible fist barrage and withdraws to the caller.',
    { path: 'stand-rush', arrival: 0.31, travelTicks: 23, holdTicks: 32, scale: 1.0, offsetX: 72, preparation: 'star-platinum-focus', attack: 'ora-barrage', recovery: 'stand-withdraw', muzzle: [0.23, -0.48] }),
  cue('jojo-hermit-purple', "JoJo's Bizarre Adventure", 'Hermit Purple', 'Hermit Purple — Hamon',
    'Hermit Purple grows from Joseph as thorny purple vines; a gold Hamon pulse travels along the vine and retracts with it.',
    { path: 'vine-manifest', arrival: 0.38, travelTicks: 34, holdTicks: 25, scale: 0.9, offsetX: 62, preparation: 'hermit-vine-grow', attack: 'hermit-hamon', recovery: 'hermit-vine-retract', muzzle: [0.12, -0.48] }),
  cue('jojo-gold-experience', "JoJo's Bizarre Adventure", 'Gold Experience', 'Muda Muda',
    'Gold Experience manifests beside Giorno, advances to its selected target, punches in a compact barrage and returns.',
    { path: 'stand-rush', arrival: 0.36, travelTicks: 19, holdTicks: 30, scale: 0.97, offsetX: 66, preparation: 'gold-experience-focus', attack: 'muda-barrage', recovery: 'stand-withdraw', muzzle: [0.23, -0.5] }),
  cue('neon-ghostline', 'Neon Requiem', 'Soulèvement Ghostline', 'Soulèvement Ghostline',
    'Imani’s project-owned Ghostline uprising spreads coordinated drone/signal links; its technology is not a ghost-shaped magical explosion.',
    { path: 'network-fan', arrival: 0.4, travelTicks: 27, holdTicks: 28, scale: 1.0, offsetX: 80, preparation: 'ghostline-handshake', attack: 'ghostline-links', recovery: 'ghostline-release', muzzle: [0.18, -0.5] }),
  cue('aether-sky-mutineers', 'The Aether Crown', 'Mutinerie des Cieux', 'Mutinerie des Cieux',
    'Elara’s project-owned corsair command brings airborne allied craft along an advancing sky route with coordinated deck fire.',
    { path: 'corsair-flyby', arrival: 0.38, travelTicks: 26, holdTicks: 27, scale: 1.12, flightY: 0.6, bank: 0.035, preparation: 'corsair-broadside', attack: 'mutineer-salvo', recovery: 'corsair-wake', muzzle: [0.28, -0.3] }),
  cue('aether-valve-drone', 'The Aether Crown', 'Drone Soupape', 'Drone Soupape',
    'Bram Quill’s autonomous valve drone hovers, builds pressure and vents directed steam, then returns without exploding.',
    { path: 'valve-hover', arrival: 0.4, travelTicks: 24, holdTicks: 25, scale: 0.72, offsetX: 77, preparation: 'valve-pressure', attack: 'valve-steam', recovery: 'valve-decompress', muzzle: [0.23, -0.39] }),
  cue('meridian-clockwork-falcon', 'Meridian Clockwork', 'Faucon à Ressort', 'Faucon à Ressort',
    'Lio’s spring-driven mechanical falcon winds up, dives along a clockwork arc and visibly homes back toward its operator.',
    { path: 'falcon-dive', arrival: 0.3, travelTicks: 32, holdTicks: 16, scale: 0.76, offsetX: 63, preparation: 'falcon-windup', attack: 'falcon-strike', recovery: 'falcon-home', muzzle: [0.25, -0.42] }),
  cue('aegea-shield-forge', 'Aegea: War of the Moirai', 'Forge des Cent Boucliers', 'Forge des Cent Boucliers',
    'Doros’s project-owned forge constructs a bronze shield formation: assembling plates, a closing line and orderly withdrawal.',
    { path: 'shield-forge', arrival: 0.49, travelTicks: 22, holdTicks: 34, scale: 1.07, offsetX: 105, preparation: 'forge-assembly', attack: 'forge-shield-line', recovery: 'forge-disassemble', muzzle: [0.1, -0.44] }),
  cue('tawantinsuyu-relay', 'Tawantinsuyu: The Split Sun', 'Message des Quatre Quartiers', 'Message des Quatre Quartiers',
    'Killa Mayu’s four-quarter message is a courier relay with linked route points and traveling signals, not an explosive summoned army.',
    { path: 'courier-relay', arrival: 0.33, travelTicks: 32, holdTicks: 25, scale: 0.92, offsetX: 90, preparation: 'quarter-route', attack: 'quarter-relay', recovery: 'quarter-route-close', muzzle: [0.1, -0.45] }),
  cue('yomi-yokai-parade', 'Yomi no Kage', 'Parade Nocturne Réconciliée', 'Parade Nocturne Réconciliée',
    'Daichi’s reconciled tsukumogami take a ground procession route with lantern-like markers before passing out of the scene.',
    { path: 'yokai-procession', arrival: 0.35, travelTicks: 27, holdTicks: 29, scale: 1.08, offsetX: 80, preparation: 'yokai-gather', attack: 'yokai-procession', recovery: 'yokai-depart', muzzle: [0.2, -0.42] }),
  cue('mandate-ancestor', 'Mandate of Nine Heavens', 'Pas de l’Ancêtre', 'Pas de l’Ancêtre',
    'Mei Zhen’s ancestor conveys a message without becoming a soldier: gentle manifestation, guiding threads and a dissolving return.',
    { path: 'ancestor-guidance', arrival: 0.36, travelTicks: 29, holdTicks: 34, scale: 0.96, offsetX: 65, preparation: 'ancestor-listen', attack: 'ancestor-guiding-threads', recovery: 'ancestor-rest', muzzle: [0.12, -0.5] }),
  cue('ilyr-nym-choir', 'Ilyr Concordat', 'Chœur Nym Non Unanime', 'Chœur Nym Non Unanime',
    'Ixo-9’s distributed Nym collective coordinates distinct node voices through linked signal waves, not an indiscriminate explosion.',
    { path: 'choir-network', arrival: 0.42, travelTicks: 28, holdTicks: 32, scale: 1.02, offsetX: 83, preparation: 'nym-tuning', attack: 'nym-signal-choir', recovery: 'nym-separate', muzzle: [0.15, -0.5] }),
  cue('skullgirls-black-egrets', 'Skullgirls', 'Black Egrets', 'Inferno Brigade',
    'Parasoul’s Inferno Brigade calls physical Black Egret support: a ground convoy, coordinated ballistic fire and departure.',
    { path: 'egret-convoy', arrival: 0.43, travelTicks: 20, holdTicks: 31, scale: 1.1, offsetX: 83, preparation: 'egret-form-up', attack: 'egret-ballistics', recovery: 'egret-depart', muzzle: [0.3, -0.36] })
];

const allEntries = [...entries, ...ROSTER_SUMMON_CHOREOGRAPHIES_WAVE8, ...ROSTER_SUMMON_CHOREOGRAPHIES_WAVE9, ...ROSTER_SUMMON_CHOREOGRAPHIES_WAVE10, ...ROSTER_SUMMON_CHOREOGRAPHIES_WAVE11];
export const SUMMON_CHOREOGRAPHIES = Object.freeze(Object.fromEntries(allEntries.map(entry => [keyFor(entry.universe, entry.entityName, entry.actionName), entry])));
if (Object.keys(SUMMON_CHOREOGRAPHIES).length !== allEntries.length) throw new Error('Duplicate exact summon choreography identity');
export function resolveSummonChoreography(descriptor) {
  if (!descriptor?.universe || !descriptor.entityName || !descriptor.action?.name) return null;
  return SUMMON_CHOREOGRAPHIES[keyFor(descriptor.universe, descriptor.entityName, descriptor.action.name)] || null;
}

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const unit = value => clamp(value, 0, 1);
const lerp = (a, b, progress) => a + (b - a) * progress;
const ease = progress => 1 - (1 - unit(progress)) ** 3;
const point = (x, y) => ({ x, y });
const average = (items, key, fallback) => items.length ? items.reduce((sum, item) => sum + (Number(item[key]) || 0), 0) / items.length : fallback;

export function getSummonChoreographyState(scene, arena = {}) {
  const spec = scene?.choreography || resolveSummonChoreography(scene?.descriptor);
  if (!spec || !scene?.actor) return null;
  const width = Number(arena.width) || 760;
  const height = Number(arena.height) || 420;
  const side = scene.side === 'enemy' ? -1 : 1;
  const xFromSide = fraction => width * (side > 0 ? fraction : 1 - fraction);
  const tick = Math.max(0, Number(scene.tick) || 0);
  const durationTicks = Math.max(30, Number(scene.durationTicks) || 192);
  const impactTick = clamp(Number(scene.impactTick) || 99, 1, durationTicks - 12);
  const arrivalEndTick = Math.max(1, Math.round(impactTick * spec.arrival));
  const returnStartTick = Math.min(durationTicks - 12, impactTick + spec.holdTicks);
  const attackStartTick = Math.max(arrivalEndTick, impactTick - spec.travelTicks);
  const arrivalProgress = unit(tick / arrivalEndTick);
  const preparationProgress = unit((tick - arrivalEndTick) / Math.max(1, impactTick - arrivalEndTick));
  const travelProgress = unit((tick - attackStartTick) / Math.max(1, impactTick - attackStartTick));
  const attackProgress = unit((tick - impactTick) / Math.max(1, returnStartTick - impactTick));
  const returnProgress = unit((tick - returnStartTick) / Math.max(1, durationTicks - returnStartTick));
  const poseIndex = tick < arrivalEndTick ? 0 : tick < impactTick ? 1 : tick <= returnStartTick ? 2 : 3;
  const phase = ['arrival', 'preparation', 'attack', 'return'][poseIndex];
  // W9/W10 native weapon partners supply this accepted-hit snapshot.
  // Historical scene geometry and targeting remain byte-for-byte equivalent.
  const visualTargets = Array.isArray(scene.visualContacts) && scene.impacted ? scene.visualContacts : scene.targets;
  const targets = (visualTargets || []).map(target => ({
    id: target.battleId || target.runtimeId || target.id,
    x: Number(target.x) || 0, y: Number(target.y) || 0,
    centerY: (Number(target.y) || 0) - height * 0.095
  }));
  const caller = point(Number(scene.actor.homeX ?? scene.actor.x) || xFromSide(0.18), Number(scene.actor.homeY ?? scene.actor.y) || height * 0.78);
  const target = point(average(targets, 'x', xFromSide(0.78)), average(targets, 'y', height * 0.78));
  const nearTarget = point(clamp(target.x - side * (Number(spec.contactDistance) || 68), 45, width - 45), target.y);
  const station = point(clamp(caller.x + side * (spec.offsetX || 75), 45, width - 45), clamp(caller.y, height * 0.65, height * 0.88));
  let x = station.x;
  let y = station.y;
  let scale = spec.scale;
  let rotation = 0;
  let alpha = Math.min(1, arrivalProgress * 2) * (1 - returnProgress);
  const move = (from, to, progress) => { x = lerp(from.x, to.x, progress); y = lerp(from.y, to.y, progress); };

  switch (spec.path) {
    case 'roster-cannon': case 'roster-cover-fire':
      x = lerp(caller.x, station.x, ease(arrivalProgress));
      if (returnProgress > 0) x = lerp(station.x, caller.x, ease(returnProgress));
      break;
    case 'roster-ground-rush': case 'roster-blade-rush': case 'roster-sword-advance':
      move(station, nearTarget, ease(travelProgress));
      if (tick < attackStartTick) x = lerp(caller.x, station.x, ease(arrivalProgress));
      if (returnProgress > 0) move(nearTarget, station, ease(returnProgress));
      break;
    case 'heavy-flyby': case 'tornado-swoop': case 'corsair-flyby': {
      const flightX = tick <= impactTick
        ? lerp(-0.2, spec.path === 'heavy-flyby' ? 0.54 : 0.61, ease(tick / impactTick))
        : lerp(spec.path === 'heavy-flyby' ? 0.54 : 0.61, 1.25, unit((tick - impactTick) / (durationTicks - impactTick)));
      x = xFromSide(flightX);
      y = height * spec.flightY;
      if (spec.path === 'tornado-swoop') y += Math.sin(unit(tick / durationTicks) * Math.PI) * height * 0.09 - returnProgress * height * 0.16;
      if (spec.path === 'corsair-flyby') y += Math.sin(tick * 0.035) * 5;
      rotation = side * spec.bank * (tick < impactTick ? 1 - preparationProgress : -returnProgress);
      break;
    }
    case 'floor-deploy': case 'turret-drop': case 'sentry-unfold': case 'shield-forge':
      y = station.y - (1 - ease(arrivalProgress)) * (spec.path === 'turret-drop' ? 130 : 72);
      if (spec.path === 'sentry-unfold') scale *= 0.78 + ease(arrivalProgress) * 0.22;
      if (spec.path === 'shield-forge') scale *= 0.85 + ease(arrivalProgress) * 0.15;
      y += returnProgress * 38;
      break;
    case 'ally-hover':
      move(point(caller.x, caller.y - 30), point(target.x + side * 28, target.y - 64), ease(arrivalProgress));
      y -= Math.sin(tick * 0.07) * 4;
      if (returnProgress > 0) move(point(target.x + side * 28, target.y - 64), point(caller.x, caller.y - 25), ease(returnProgress));
      break;
    case 'valve-hover': case 'network-fan': case 'choir-network':
      y = station.y - 38 - Math.sin(tick * (spec.path === 'valve-hover' ? 0.055 : 0.035)) * 5;
      x = lerp(caller.x, station.x, ease(arrivalProgress));
      if (returnProgress > 0) x = lerp(station.x, caller.x, ease(returnProgress));
      break;
    case 'weapon-deploy':
      x = lerp(caller.x, station.x, ease(arrivalProgress));
      y = station.y - 14 + (1 - arrivalProgress) * 20;
      scale *= 0.85 + arrivalProgress * 0.15;
      break;
    case 'robot-leap': case 'falcon-dive': {
      const launch = point(caller.x + side * 55, spec.path === 'falcon-dive' ? caller.y - 110 : caller.y);
      move(launch, nearTarget, ease(travelProgress));
      y -= Math.sin(travelProgress * Math.PI) * height * (spec.path === 'falcon-dive' ? 0.29 : 0.22);
      if (tick < attackStartTick) { x = launch.x; y = launch.y - Math.sin(tick * 0.07) * (spec.path === 'falcon-dive' ? 5 : 0); }
      if (returnProgress > 0) {
        move(nearTarget, launch, ease(returnProgress));
        y -= Math.sin(returnProgress * Math.PI) * height * 0.2;
      }
      rotation = spec.path === 'falcon-dive' ? side * Math.sin(travelProgress * Math.PI) * 0.16 : 0;
      break;
    }
    case 'stand-rush':
      move(station, nearTarget, ease(travelProgress));
      if (tick >= impactTick && tick <= returnStartTick) x += side * Math.sin(tick * 0.9) * 4;
      if (returnProgress > 0) move(nearTarget, station, ease(returnProgress));
      break;
    case 'vine-manifest':
      scale *= 0.78 + arrivalProgress * 0.22;
      break;
    case 'probe-route':
      move(station, point(target.x - side * 85, target.y - 55), ease(travelProgress));
      y -= Math.sin(travelProgress * Math.PI) * 32;
      if (returnProgress > 0) move(point(target.x - side * 85, target.y - 55), point(caller.x, caller.y - 30), ease(returnProgress));
      break;
    case 'whale-arc': {
      const progress = unit(tick / durationTicks);
      x = tick <= impactTick
        ? lerp(xFromSide(-0.3), target.x - side * 55, ease(tick / impactTick))
        : lerp(target.x - side * 55, xFromSide(1.3), unit((tick - impactTick) / (durationTicks - impactTick)));
      y = height * (1.15 - Math.sin(progress * Math.PI) * 0.61);
      rotation = side * Math.cos(progress * Math.PI) * 0.1;
      break;
    }
    case 'ifrit-manifest':
      y = station.y + (1 - ease(arrivalProgress)) * 80;
      scale *= 0.84 + arrivalProgress * 0.16;
      break;
    case 'shiva-manifest':
      y = station.y - 16 - (1 - ease(arrivalProgress)) * 45;
      y -= Math.sin(tick * 0.035) * 3;
      break;
    case 'bahamut-descent':
      y = height * 0.78 - (1 - ease(arrivalProgress)) * height * 0.65 - returnProgress * height * 0.55;
      x = lerp(xFromSide(0.36), station.x, ease(arrivalProgress));
      break;
    case 'reflection-step':
      x = station.x + side * (1 - ease(arrivalProgress)) * 35;
      scale *= 0.82 + arrivalProgress * 0.18;
      alpha *= 0.82 + Math.sin(tick * 0.09) * 0.06;
      break;
    case 'page-scatter':
      x = lerp(caller.x, station.x, ease(arrivalProgress));
      y = station.y - 10 - Math.sin(tick * 0.045) * 6;
      break;
    case 'courier-relay':
      x = lerp(caller.x, station.x, ease(arrivalProgress));
      y = station.y - Math.sin(preparationProgress * Math.PI) * 16;
      if (returnProgress > 0) x = lerp(station.x, caller.x, ease(returnProgress));
      break;
    case 'yokai-procession': case 'egret-convoy':
      x = tick < arrivalEndTick ? lerp(xFromSide(-0.16), station.x, ease(arrivalProgress))
        : tick > returnStartTick ? lerp(station.x, xFromSide(1.2), ease(returnProgress)) : station.x;
      y = station.y + (spec.path === 'yokai-procession' ? Math.sin(tick * 0.09) * 3 : 0);
      break;
    case 'ancestor-guidance':
      x = lerp(caller.x, station.x, ease(arrivalProgress));
      y = station.y - 22 - Math.sin(tick * 0.03) * 4;
      scale *= 0.88 + arrivalProgress * 0.12 - returnProgress * 0.1;
      alpha *= 0.85;
      break;
  }
  const size = Math.min(spec.maxSize || 228, height * 0.5) * scale;
  const origin = point(x + side * size * spec.muzzle[0], y + size * spec.muzzle[1]);
  const visuals = [];
  if (tick >= arrivalEndTick && tick <= impactTick) visuals.push({ kind: spec.preparation, layer: 'behind', progress: preparationProgress, strength: 1, stage: 'preparation' });
  if (tick >= attackStartTick && tick <= returnStartTick) visuals.push({ kind: spec.attack, layer: 'front', progress: travelProgress, strength: tick <= impactTick ? 1 : 1 - attackProgress * 0.6, stage: tick < impactTick ? 'travel' : 'contact' });
  if (tick > returnStartTick) visuals.push({ kind: spec.recovery, layer: 'behind', progress: returnProgress, strength: 1 - returnProgress, stage: 'return' });
  return {
    id: spec.id, fidelity: spec.fidelity, path: spec.path, phase, poseIndex,
    tick, durationTicks, impactTick, arrivalEndTick, attackStartTick, returnStartTick,
    arrivalProgress, preparationProgress, travelProgress, attackProgress, returnProgress,
    effect: scene.profile?.effect || scene.descriptor?.action?.targeting?.effect || 'damage',
    color: scene.color || scene.descriptor?.color || '#ffffff', side, width, height,
    performer: { x, y, scale, size, alpha: clamp(alpha, 0, 1), facing: side, rotation },
    origin, caller, target, targets, visuals
  };
}

const line = (ctx, from, to, color, width = 2) => {
  ctx.strokeStyle = color; ctx.lineWidth = width;
  ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y); ctx.stroke();
};
const ring = (ctx, center, radius, color, width = 2) => {
  ctx.strokeStyle = color; ctx.lineWidth = width;
  ctx.beginPath(); ctx.ellipse(center.x, center.y, radius, radius * 0.55, 0, 0, Math.PI * 2); ctx.stroke();
};
const shield = (ctx, target, scale, color) => {
  const w = 24 * scale; const h = 47 * scale;
  ctx.strokeStyle = color; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(target.x, target.centerY - h); ctx.lineTo(target.x + w, target.centerY - h * 0.7);
  ctx.lineTo(target.x + w * 0.8, target.centerY + h * 0.35); ctx.lineTo(target.x, target.centerY + h * 0.7);
  ctx.lineTo(target.x - w * 0.8, target.centerY + h * 0.35); ctx.lineTo(target.x - w, target.centerY - h * 0.7); ctx.closePath(); ctx.stroke();
};
const targetPoint = target => point(target.x, target.centerY);
const medicalMark = (ctx, target, color, size = 7) => {
  ctx.fillStyle = color;
  ctx.fillRect(target.x - size, target.centerY - 2, size * 2, 4);
  ctx.fillRect(target.x - 2, target.centerY - size, 4, size * 2);
};
const dots = (ctx, from, to, progress, color, count = 8) => {
  ctx.fillStyle = color;
  for (let index = 0; index < count; index++) {
    const position = (index / count + progress) % 1;
    ctx.beginPath(); ctx.arc(lerp(from.x, to.x, position), lerp(from.y, to.y, position), 2.5, 0, Math.PI * 2); ctx.fill();
  }
};
const pulseLinks = (ctx, state, cueState, color = state.color) => {
  state.targets.forEach((target, index) => {
    const to = targetPoint(target);
    ctx.save(); ctx.globalAlpha *= 0.35;
    line(ctx, state.origin, to, color, 1.5); ctx.restore();
    dots(ctx, state.origin, to, (state.tick * 0.013 + index * 0.09) % 1, color, 6);
    if (cueState.stage === 'contact') ring(ctx, to, 13 + state.attackProgress * 15, color, 2);
  });
};
const drawBallistics = (ctx, state, cueState, rounds = 3) => {
  state.targets.forEach((target, targetIndex) => {
    const to = targetPoint(target);
    for (let round = 0; round < rounds; round++) {
      const progress = cueState.stage === 'contact'
        ? ((state.tick - state.impactTick) * 0.14 + round / rounds) % 1
        : unit(cueState.progress * 1.15 - round * 0.055);
      const drift = (round - (rounds - 1) / 2) * 4;
      const head = point(lerp(state.origin.x, to.x, progress), lerp(state.origin.y + drift, to.y + drift, progress));
      const tail = point(lerp(state.origin.x, to.x, Math.max(0, progress - 0.12)), lerp(state.origin.y + drift, to.y + drift, Math.max(0, progress - 0.12)));
      line(ctx, tail, head, '#ffe5a1', round % 2 ? 2 : 3);
    }
    if (cueState.stage === 'contact') {
      const dx = 4 + Math.sin(state.tick + targetIndex) * 2;
      line(ctx, point(to.x - dx, to.y - 6), point(to.x + dx, to.y + 6), state.color, 2);
      line(ctx, point(to.x + dx, to.y - 6), point(to.x - dx, to.y + 6), '#fff1c2', 2);
    }
  });
  if (state.tick % 5 < 3) {
    ctx.fillStyle = '#ffe5a1';
    ctx.beginPath(); ctx.moveTo(state.origin.x, state.origin.y - 6);
    ctx.lineTo(state.origin.x + state.side * 17, state.origin.y);
    ctx.lineTo(state.origin.x, state.origin.y + 6); ctx.closePath(); ctx.fill();
  }
};
const drawVines = (ctx, state, cueState) => {
  state.targets.forEach(target => {
    const end = targetPoint(target);
    const reach = cueState.stage === 'return' ? 1 - cueState.progress : state.travelProgress;
    const to = point(lerp(state.origin.x, end.x, reach), lerp(state.origin.y, end.y, reach));
    ctx.strokeStyle = '#bf79dc'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(state.origin.x, state.origin.y);
    for (let segment = 1; segment <= 12; segment++) {
      const progress = segment / 12;
      const x = lerp(state.origin.x, to.x, progress);
      const y = lerp(state.origin.y, to.y, progress) + Math.sin(progress * Math.PI * 5 + state.tick * 0.06) * 11;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    if (cueState.kind === 'hermit-hamon') dots(ctx, state.origin, to, (state.tick * 0.025) % 1, '#ffe28c', 7);
  });
};

function drawCue(ctx, state, cueState) {
  if (drawRosterSummonCueWave11(ctx, state, cueState)) return;
  if (drawRosterSummonCueWave10(ctx, state, cueState)) return;
  if (drawRosterSummonCueWave9(ctx, state, cueState)) return;
  const { kind, progress, stage } = cueState;
  const { origin, color, tick, performer, targets } = state;
  const center = point(performer.x, performer.y - performer.size * 0.42);
  switch (kind) {
    case 'roster-sonic-align':
      ring(ctx, origin, 4 + progress * 5, '#83dafa', 1.5);
      break;
    case 'roster-sonic-beam': {
      const to = point(lerp(origin.x, state.target.x, progress), lerp(origin.y, state.target.y - state.height * 0.095, progress));
      line(ctx, origin, to, '#83dafa', stage === 'contact' ? 7 : 3);
      for (let index = 1; index <= 3; index++) ring(ctx,
        point(lerp(origin.x, to.x, index / 4), lerp(origin.y, to.y, index / 4)), 5 + index * 2, '#c4efff', 1.5);
      if (stage === 'contact') targets.forEach(target => ring(ctx, targetPoint(target), 10 + state.attackProgress * 20, '#83dafa', 2));
      break;
    }
    case 'roster-fist-ready': case 'roster-hf-ready': case 'roster-kensuke-ready':
      ring(ctx, point(performer.x, performer.y - 2), 10 + progress * 5, color, 1);
      break;
    case 'roster-physical-contact': case 'roster-blade-contact':
      // Bodies and equipment are drawn by the native sheet. A single contact
      // light follows the engine impact; it never creates additional damage.
      if (stage === 'contact') targets.forEach(target => ring(ctx, targetPoint(target), 7 + state.attackProgress * 19, color, 2));
      break;
    case 'roster-cannon-lower': case 'roster-ground-return':
      break;
    case 'hellfire-charge': case 'megaflare-charge': case 'bfg-charge': {
      const radius = 7 + progress * (kind === 'megaflare-charge' ? 24 : 17);
      ctx.fillStyle = color;
      ctx.save(); ctx.globalAlpha *= 0.3;
      ctx.beginPath(); ctx.arc(origin.x, origin.y, radius, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      ring(ctx, origin, radius + 4 + Math.sin(tick * 0.12) * 3, color, 2);
      for (let index = 0; index < 5; index++) {
        const angle = tick * 0.03 + index * Math.PI * 2 / 5;
        const distance = radius + (1 - progress) * 25;
        line(ctx, point(origin.x + Math.cos(angle) * distance, origin.y + Math.sin(angle) * distance), origin, color, 1);
      }
      break;
    }
    case 'hellfire-wave': {
      const destination = point(state.target.x, state.target.y - 8);
      const head = point(lerp(origin.x, destination.x, progress), lerp(origin.y, destination.y, progress));
      const span = stage === 'contact' ? 74 + state.attackProgress * 38 : 35 + progress * 32;
      ctx.fillStyle = '#ff9944';
      for (let index = 0; index < 7; index++) {
        const flameX = head.x + state.side * (index - 3) * span / 8;
        const height = 23 + (Math.sin(tick * 0.21 + index) + 1) * 18 + progress * 28;
        ctx.beginPath(); ctx.moveTo(flameX - 10, head.y + 5);
        ctx.quadraticCurveTo(flameX - 19, head.y - height * 0.5, flameX + state.side * 6, head.y - height);
        ctx.quadraticCurveTo(flameX + 12, head.y - height * 0.3, flameX + 12, head.y + 5); ctx.closePath(); ctx.fill();
      }
      line(ctx, point(head.x - state.side * span, head.y), head, '#ffd071', 4);
      break;
    }
    case 'diamond-frost': case 'diamond-freeze-shatter': case 'diamond-dust': {
      const freeze = kind === 'diamond-frost' ? progress : state.travelProgress;
      targets.forEach((target, index) => {
        const shatter = kind === 'diamond-dust' ? 0.8 + progress * 0.2 : stage === 'contact' ? state.attackProgress : 0;
        const base = targetPoint(target);
        if (shatter < 0.42) {
          ctx.strokeStyle = '#a5e8ff'; ctx.lineWidth = 2 + freeze;
          const h = 12 + freeze * 47;
          const w = 10 + freeze * 22;
          ctx.beginPath(); ctx.moveTo(base.x, base.y - h); ctx.lineTo(base.x + w, base.y - h * 0.3);
          ctx.lineTo(base.x + w * 0.7, base.y + h * 0.5); ctx.lineTo(base.x - w * 0.7, base.y + h * 0.5);
          ctx.lineTo(base.x - w, base.y - h * 0.3); ctx.closePath(); ctx.stroke();
          line(ctx, point(base.x, base.y - h), point(base.x, base.y + h * 0.5), '#e2f7ff', 1);
        }
        if (shatter > 0) for (let shard = 0; shard < 8; shard++) {
          const angle = shard * Math.PI / 4 + index * 0.13;
          const distance = 12 + shatter * 65;
          const x = base.x + Math.cos(angle) * distance;
          const y = base.y + Math.sin(angle) * distance * 0.7 + shatter * 12;
          ctx.fillStyle = shard % 2 ? '#b0edff' : '#eefaff';
          ctx.beginPath(); ctx.moveTo(x, y - 6); ctx.lineTo(x + 3, y + 3); ctx.lineTo(x - 3, y + 5); ctx.closePath(); ctx.fill();
        }
      });
      break;
    }
    case 'megaflare-beam': {
      const to = point(lerp(origin.x, state.target.x, progress), lerp(origin.y, state.target.y - state.height * 0.095, progress));
      const spread = (stage === 'contact' ? 24 : 8) + Math.sin(tick * 0.16) * 3;
      ctx.save(); ctx.globalAlpha *= 0.38; ctx.fillStyle = '#aeccff';
      ctx.beginPath(); ctx.moveTo(origin.x, origin.y); ctx.lineTo(to.x, to.y - spread); ctx.lineTo(to.x, to.y + spread); ctx.closePath(); ctx.fill(); ctx.restore();
      line(ctx, origin, to, '#98bdff', stage === 'contact' ? 15 : 7);
      line(ctx, origin, to, '#f1f7ff', stage === 'contact' ? 6 : 3);
      if (stage === 'contact') targets.forEach(target => ring(ctx, targetPoint(target), 18 + state.attackProgress * 40, '#c5dcff', 3));
      break;
    }
    case 'medical-lock': case 'medical-tether': case 'medical-return':
      pulseLinks(ctx, state, cueState, '#82f5c1');
      if (kind === 'medical-tether' && stage === 'contact') targets.forEach(target => medicalMark(ctx, target, '#d6ffeb', 7 + Math.sin(tick * 0.1) * 2));
      break;
    case 'barricade-align': case 'barricade-shields': case 'forge-assembly': case 'forge-shield-line':
      targets.forEach((target, index) => {
        const amount = stage === 'preparation' ? 0.5 + progress * 0.5 : 1;
        shield(ctx, target, amount, kind.startsWith('forge') ? '#c69d67' : '#79e5e7');
        if (index > 0) line(ctx, point(targets[index - 1].x, targets[index - 1].y - 5), point(target.x, target.y - 5), color, 2);
      });
      break;
    case 'probe-route': case 'probe-scan': case 'probe-retrace':
      pulseLinks(ctx, state, cueState, '#a4e8e9');
      targets.forEach(target => ring(ctx, targetPoint(target), 18 + ((tick * 0.7) % 25), '#83ccd4', 1.5));
      break;
    case 'reflection-align': case 'reflection-rays': case 'reflection-dissolve':
      targets.forEach(target => {
        const to = targetPoint(target);
        const mid = point(lerp(origin.x, to.x, 0.45), lerp(origin.y, to.y, 0.45) - 22);
        line(ctx, origin, mid, '#dfc7ff', 2); line(ctx, mid, to, color, 2);
        const size = 10 + (stage === 'preparation' ? progress : 1) * 13;
        ctx.strokeStyle = '#f0e4ff'; ctx.lineWidth = 1.5;
        ctx.strokeRect(mid.x - size / 2, mid.y - size, size, size * 2);
      });
      break;
    case 'gunship-lock': case 'tornado-lineup': case 'corsair-broadside': case 'sentry-track': case 'egret-form-up':
      targets.forEach(target => {
        ctx.save(); ctx.globalAlpha *= 0.4;
        line(ctx, origin, targetPoint(target), color, 1); ctx.restore();
        const radius = 14 - progress * 7;
        ring(ctx, targetPoint(target), radius, color, 1);
      });
      break;
    case 'portal-sight':
      targets.forEach(target => line(ctx, origin, targetPoint(target), '#ff5a5a', 1.2));
      break;
    case 'pelican-ballistics': case 'tornado-ballistics': case 'mutineer-salvo': case 'egret-ballistics':
      drawBallistics(ctx, state, cueState, kind === 'mutineer-salvo' || kind === 'egret-ballistics' ? 5 : 3);
      break;
    case 'portal-burst': case 'sentry-burst':
      drawBallistics(ctx, state, cueState, kind === 'sentry-burst' ? 5 : 3);
      break;
    case 'robot-brace': case 'dog-ground-impact':
      if (kind === 'robot-brace') ring(ctx, point(performer.x, performer.y), 18 + progress * 12, '#d8b98b', 2);
      else if (stage === 'contact') {
        targets.forEach(target => {
          ring(ctx, point(target.x, target.y - 2), 16 + state.attackProgress * 47, '#d3c7ae', 3);
          for (let index = 0; index < 5; index++) {
            const offset = (index - 2) * (8 + state.attackProgress * 15);
            ctx.fillStyle = '#a2aaa6';
            ctx.fillRect(target.x + offset, target.y - Math.sin(state.attackProgress * Math.PI) * (14 + index * 3), 5, 4);
          }
        });
      }
      break;
    case 'page-place': case 'page-static': case 'page-recall':
      targets.forEach((target, index) => {
        for (let page = 0; page < 4; page++) {
          const angle = page * Math.PI / 2 + index * 0.23 + tick * 0.004;
          const spread = 24 + (stage === 'return' ? 1 - progress : progress) * 20;
          const x = target.x + Math.cos(angle) * spread;
          const y = target.centerY + Math.sin(angle) * spread;
          ctx.fillStyle = '#ece8d6'; ctx.fillRect(x - 5, y - 8, 10, 16);
          ctx.strokeStyle = '#7d817b'; ctx.lineWidth = 1; ctx.strokeRect(x - 5, y - 8, 10, 16);
          if (kind === 'page-static') line(ctx, point(x - 12, y + 11), point(x + 8 + Math.sin(tick + page) * 9, y + 11), '#b9c3c2', 1);
        }
      });
      break;
    case 'bfg-plasma': {
      const destination = point(state.target.x, state.target.y - state.height * 0.095);
      const sphere = point(lerp(origin.x, destination.x, progress), lerp(origin.y, destination.y, progress));
      ctx.fillStyle = '#a8ff63';
      ctx.beginPath(); ctx.arc(sphere.x, sphere.y, 10 + progress * 10 + Math.sin(tick * 0.15) * 2, 0, Math.PI * 2); ctx.fill();
      targets.forEach((target, index) => {
        const to = targetPoint(target);
        ctx.strokeStyle = '#6fff45'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(sphere.x, sphere.y);
        for (let node = 1; node <= 7; node++) {
          const position = node / 7;
          ctx.lineTo(lerp(sphere.x, to.x, position), lerp(sphere.y, to.y, position) + Math.sin(node * 2 + tick * 0.15 + index) * 9 * (1 - position));
        }
        ctx.stroke();
      });
      break;
    }
    case 'water-rise': case 'yamada-water-surge': case 'water-settle':
      for (let index = 0; index < 4; index++) {
        const centerX = kind === 'yamada-water-surge' ? lerp(state.caller.x, state.target.x, progress) : performer.x;
        ring(ctx, point(centerX + state.side * index * 22, state.target.y + index * 4), 23 + index * 10 + Math.sin(tick * 0.07) * 4, '#92d9f2', 2);
      }
      break;
    case 'star-platinum-focus': case 'gold-experience-focus':
      ring(ctx, center, 19 + progress * 12, color, 2);
      break;
    case 'ora-barrage': case 'muda-barrage':
      targets.forEach(target => {
        const to = targetPoint(target);
        for (let fist = 0; fist < 8; fist++) {
          const lane = fist - 3.5;
          const beat = (tick * (kind === 'ora-barrage' ? 0.22 : 0.18) + fist / 8) % 1;
          const x = lerp(origin.x, to.x, beat);
          const y = lerp(origin.y, to.y, beat) + lane * 7;
          line(ctx, point(x - state.side * 18, y), point(x, y), color, 3);
          ctx.strokeStyle = '#f3eaff'; ctx.lineWidth = 1.5; ctx.strokeRect(x - 4, y - 3, 8, 6);
        }
      });
      break;
    case 'hermit-vine-grow': case 'hermit-hamon': case 'hermit-vine-retract':
      drawVines(ctx, state, cueState);
      break;
    case 'ghostline-handshake': case 'ghostline-links': case 'ghostline-release':
      pulseLinks(ctx, state, cueState, '#67f4d8');
      targets.forEach(target => { ctx.strokeStyle = '#ffe39a'; ctx.lineWidth = 1.5; ctx.strokeRect(target.x - 15, target.centerY - 15, 30, 30); });
      break;
    case 'valve-pressure': case 'valve-steam': case 'valve-decompress': {
      const aim = point(state.target.x, state.target.y - state.height * 0.095);
      const reach = kind === 'valve-pressure' ? progress * 0.2 : kind === 'valve-decompress' ? 0.15 * (1 - progress) : progress;
      for (let puff = 0; puff < 7; puff++) {
        const position = (puff / 7 + tick * 0.008) % 1 * reach;
        const x = lerp(origin.x, aim.x, position);
        const y = lerp(origin.y, aim.y, position) + Math.sin(puff + tick * 0.08) * (4 + position * 9);
        ctx.save(); ctx.globalAlpha *= 0.25; ctx.fillStyle = '#d2edf0';
        ctx.beginPath(); ctx.arc(x, y, 4 + position * 12, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
      break;
    }
    case 'falcon-windup': case 'falcon-strike': case 'falcon-home':
      line(ctx, state.caller, point(performer.x, performer.y), '#d2bd79', 1);
      ring(ctx, center, 11 + Math.sin(tick * 0.12) * 3, '#a5ccdb', 1.5);
      if (kind === 'falcon-strike' && stage === 'contact') targets.forEach(target => {
        line(ctx, point(target.x - 12, target.centerY + 12), point(target.x + 12, target.centerY - 12), '#e9dfba', 2);
      });
      break;
    case 'quarter-route': case 'quarter-relay': case 'quarter-route-close': {
      const route = [point(state.width * 0.22, state.height * 0.56), point(state.width * 0.38, state.height * 0.77), point(state.width * 0.67, state.height * 0.59), point(state.width * 0.81, state.height * 0.8)];
      if (state.side < 0) route.forEach(node => { node.x = state.width - node.x; });
      route.forEach((node, index) => {
        const next = route[(index + 1) % route.length];
        line(ctx, node, next, '#dfc987', 1.5);
        ring(ctx, node, 8 + Math.sin(tick * 0.08 + index) * 2, '#f6df96', 2);
        dots(ctx, node, next, (tick * 0.012) % 1, '#fff0b5', 3);
      });
      break;
    }
    case 'yokai-gather': case 'yokai-procession': case 'yokai-depart':
      for (let lantern = 0; lantern < 8; lantern++) {
        const x = performer.x - state.side * lantern * 23;
        const y = performer.y - 27 - Math.sin(tick * 0.07 + lantern * 0.6) * 7;
        ctx.fillStyle = lantern % 2 ? '#efbd85' : '#d89178';
        ctx.beginPath(); ctx.ellipse(x, y, 4, 7, 0, 0, Math.PI * 2); ctx.fill();
        line(ctx, point(x, y + 7), point(x, y + 12), '#f3dab4', 1);
      }
      break;
    case 'ancestor-listen': case 'ancestor-guiding-threads': case 'ancestor-rest':
      pulseLinks(ctx, state, cueState, '#f1dfb5');
      targets.forEach(target => ring(ctx, targetPoint(target), 16 + Math.sin(tick * 0.035) * 3, '#ebd5b3', 1));
      break;
    case 'nym-tuning': case 'nym-signal-choir': case 'nym-separate':
      pulseLinks(ctx, state, cueState, '#d1aff4');
      for (let voice = 0; voice < 4; voice++) {
        const radius = 14 + voice * 12 + Math.sin(tick * 0.075 + voice) * 4;
        ring(ctx, center, radius, voice % 2 ? '#d4b0ed' : '#9fcce7', 1.5);
      }
      break;
    case 'beacon-retract': case 'turret-fold': case 'sentry-pack': case 'forge-disassemble':
      ring(ctx, point(performer.x, performer.y), 14 + (1 - progress) * 21, color, 1.5);
      break;
    case 'hellfire-embers':
      for (let ember = 0; ember < 9; ember++) {
        ctx.fillStyle = ember % 2 ? '#ffc673' : '#f88b4c';
        const x = state.target.x + (ember - 4) * 15 + Math.sin(ember + tick * 0.04) * 8;
        const y = state.target.y - progress * (25 + ember * 4);
        ctx.fillRect(x, y, 3, 4);
      }
      break;
    case 'megaflare-fade': case 'bfg-cooldown':
      ring(ctx, origin, 10 + (1 - progress) * 18, color, 2);
      break;
    case 'engine-wake': case 'tornado-climb': case 'corsair-wake':
      for (let trail = 0; trail < 4; trail++) line(ctx,
        point(performer.x - state.side * (20 + trail * 16), performer.y - performer.size * 0.25 + trail * 4),
        point(performer.x - state.side * (54 + trail * 19), performer.y - performer.size * 0.25 + trail * 4), '#b7c8cd', 1);
      break;
    case 'robot-retreat': case 'stand-withdraw': case 'egret-depart':
      line(ctx, point(performer.x - state.side * 27, performer.y - 10), point(performer.x - state.side * 65, performer.y - 10), color, 1.5);
      break;
  }
}

export function drawSummonChoreographyEffects(ctx, state, layer = 'front', { nativeMegaflare = false } = {}) {
  if (!ctx || !state) return;
  for (const cueState of state.visuals) {
    if (cueState.layer !== layer || cueState.strength <= 0) continue;
    // The native Bahamut cells already include mouth charge and beam artwork.
    // Retain target contact light without duplicating the old muzzle projection.
    if (nativeMegaflare && cueState.kind.startsWith('megaflare-')) {
      if (cueState.kind === 'megaflare-beam' && cueState.stage === 'contact') {
        ctx.save(); ctx.globalAlpha *= cueState.strength;
        state.targets.forEach(target => ring(ctx, targetPoint(target), 18 + state.attackProgress * 40, '#c5dcff', 3));
        ctx.restore();
      }
      continue;
    }
    ctx.save();
    ctx.globalAlpha *= cueState.strength;
    drawCue(ctx, state, cueState);
    ctx.restore();
  }
}
