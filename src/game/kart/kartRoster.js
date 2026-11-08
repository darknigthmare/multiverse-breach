import { HEROES_DB } from '../heroes.js';
import { createPlayerHero, PLAYER_HERO_ID } from '../playerHero.js';
import { isUniverseInstalled } from '../dlcInstallation.js';
import {
  getHeroSpriteSheetSources,
  getSpriteFrameForLayout,
  getSpriteSheetLayout,
  slugifyAsset
} from '../spriteAssets.js';

/**
 * Kart identities follow the character catalogue, never its array index.
 * These are original crossover chassis, not claims that the source characters
 * canonically own racing karts. No stat/reward/ownership rule is changed here.
 */
export const KART_MODEL_VERSION = 'parametric-v1';
export const KART_DIRECTIONS = Object.freeze([
  'rear', 'rear-right', 'right', 'front-right',
  'front', 'front-left', 'left', 'rear-left'
]);

const curated = (bodyStyle, signature, label, options = {}) => Object.freeze({
  bodyStyle, signature, label, designSource: 'authored-character-adaptation', ...options
});

// Identity-specific structure is kept separate from the broadly reusable frame.
// Every item is a design adaptation; only the linked character/kit is a source.
export const CHARACTER_KART_DESIGNS = Object.freeze({
  player_anchor: curated('suture', 'beacon', 'Balise d’Ancre', { wheelbase: 1.96, width: 1.62 }),
  arca_mirelle: curated('suture-disc', 'hologram-cards', 'Disque de Suture', {
    color: '#17272a', accent: '#d5a342', detailColor: '#71e9f2', wheelbase: 2.08, width: 1.55,
    referenceAsset: '/sprites/generated/heroes/nexus-de-convergence/arca-mirelle-complete/arca-mirelle-kart-directions.png'
  }),
  arca_bastion: curated('armored', 'shield', 'Relève du Rempart', { wheelbase: 1.94, width: 1.88 }),
  arca_nova: curated('aero', 'clock', 'Battement de Nova', { wheelbase: 2.2, width: 1.48 }),
  arca_marrow: curated('salvage', 'hooks', 'Crochet de Marrow', { wheelbase: 1.88, width: 1.74 }),
  arca_sable: curated('rally', 'compass', 'Route d’Orison', { wheelbase: 1.98, width: 1.63 }),
  arca_loom: curated('armored', 'relay', 'Relais d’Ivara', { wheelbase: 2.12, width: 1.74 }),
  arca_tessera: curated('aero', 'mirrors', 'Fenêtre de Tessera', { wheelbase: 2.0, width: 1.62 }),
  arca_quillon: curated('industrial', 'tanks', 'Pompe de Rusk', { wheelbase: 1.88, width: 1.8 }),
  arca_nadir: curated('science', 'probe', 'Sonde de Nadir', { wheelbase: 2.15, width: 1.58 }),
  arca_elyra: curated('science', 'prism', 'Prisme d’Elyra', { wheelbase: 2.24, width: 1.52 }),
  arca_oryn: curated('gothic', 'blades', 'Serment d’Oryn', { wheelbase: 2.07, width: 1.7 }),
  masterchief: curated('military', 'rollbar', 'Éclaireur Spartan', { wheelbase: 2.1, width: 1.82 }),
  arbiter: curated('aero', 'plasma', 'Lame de l’Arbiter', { wheelbase: 2.18, width: 1.72 }),
  johnson: curated('military', 'antenna', 'Patrouille Johnson', { wheelbase: 1.94, width: 1.78 }),
  ripley: curated('industrial', 'loader', 'Chargeur de Ripley', { color: '#c8a42c', accent: '#1b2529', wheelbase: 1.86, width: 1.86 }),
  bishop: curated('science', 'scanner', 'Atelier de Bishop', { wheelbase: 2.06, width: 1.58 }),
  predator: curated('hunter', 'tusks', 'Chasseur de Jungle', { wheelbase: 2.13, width: 1.74 }),
  greyback_yautja: curated('hunter', 'trophies', 'Ancien de la Meute', { wheelbase: 2.04, width: 1.81 }),
  freeman: curated('science', 'coil', 'Résonance H.E.V.', { wheelbase: 2.16, width: 1.62 }),
  chell: curated('science', 'portals', 'Épreuve Aperture', { wheelbase: 2.24, width: 1.52 }),
  oneill: curated('military', 'gate', 'Reconnaissance SG-1', { wheelbase: 2.0, width: 1.73 }),
  marcus: curated('armored', 'gear', 'Patrouille Fenix', { wheelbase: 1.87, width: 1.93 }),
  snake: curated('military', 'antenna', 'Infiltration Snake', { wheelbase: 2.08, width: 1.7 }),
  solidsnake: curated('military', 'antenna', 'Infiltration Snake', { wheelbase: 2.08, width: 1.7 }),
  neo: curated('aero', 'matrix', 'Ligne de Neo', { wheelbase: 2.2, width: 1.48 }),
  doomslayer: curated('armored', 'vents', 'Bastion du Slayer', { wheelbase: 1.92, width: 1.91 }),
  doomguy: curated('armored', 'vents', 'Bastion du Slayer', { wheelbase: 1.92, width: 1.91 }),
  vader: curated('gothic', 'twin-panels', 'Escadre de Vader', { wheelbase: 2.12, width: 1.78 }),
  luke: curated('aero', 'wings', 'Escadrille de Luke', { wheelbase: 2.24, width: 1.68 }),
  luke_skywalker: curated('aero', 'wings', 'Escadrille de Luke', { wheelbase: 2.24, width: 1.68 }),
  arthur_kaamelott: curated('medieval', 'shield', 'Cour du Roi', { wheelbase: 1.94, width: 1.72 }),
  serj_tankian: curated('stage', 'speakers', 'Retour de Scène', { wheelbase: 1.99, width: 1.8 }),
  bucket_guitar_echo: curated('stage', 'amplifier', 'Cabine de Bucket', { wheelbase: 2.15, width: 1.64 }),
  pyramidhead: curated('gothic', 'prism', 'Fer Rouillé', { wheelbase: 1.94, width: 1.84 }),
  miku: curated('stage', 'equalizer', 'Tempo de Miku', { wheelbase: 2.16, width: 1.6 }),
  hatsune_miku: curated('stage', 'equalizer', 'Tempo de Miku', { wheelbase: 2.16, width: 1.6 })
});

const UNIVERSE_BODY_STYLES = Object.freeze({
  Halo: ['military', 'antenna'], Alien: ['industrial', 'tanks'], Aliens: ['industrial', 'rollbar'],
  Predator: ['hunter', 'tusks'], 'Gears of War': ['armored', 'gear'],
  'Half-Life': ['science', 'coil'], Portal: ['science', 'portals'],
  Stargate: ['military', 'gate'], 'Stargate Atlantis': ['science', 'gate'],
  'Stargate Universe': ['industrial', 'gate'], 'The Matrix': ['aero', 'matrix'],
  'Metal Gear': ['military', 'antenna'], 'Metal Gear Rising': ['aero', 'blades'],
  'Mass Effect': ['aero', 'relay'], 'Star Wars': ['aero', 'wings'],
  Fallout: ['salvage', 'tanks'], Doom: ['armored', 'vents'], 'Dead Space': ['industrial', 'scanner'],
  'Resident Evil': ['rally', 'scanner'], 'Dino Crisis': ['rally', 'rollbar'],
  'Silent Hill': ['gothic', 'prism'], Hellraiser: ['gothic', 'hooks'],
  'Mad Max': ['salvage', 'exhaust'], 'Borderlands': ['salvage', 'exhaust'],
  Kaamelott: ['medieval', 'shield'], 'Harry Potter': ['arcane', 'lantern'],
  'The Lord of the Rings': ['medieval', 'lantern'], 'Dungeon Meshi': ['medieval', 'tanks'],
  Vocaloid: ['stage', 'equalizer'], 'System of a Down': ['stage', 'speakers'],
  Buckethead: ['stage', 'amplifier'], Buckhead: ['stage', 'amplifier'],
  'Nexus de Convergence': ['suture', 'beacon']
});

const CATEGORY_DESIGNS = Object.freeze({
  hacker: ['science', 'scanner'], tactical: ['military', 'rollbar'], slayer: ['gothic', 'blades'],
  marine: ['military', 'antenna'], horror: ['gothic', 'hooks'], support: ['science', 'beacon'],
  trial: ['classic', 'badge'], operator: ['industrial', 'relay'], ranger: ['rally', 'compass'],
  guardian: ['armored', 'shield'], racer: ['aero', 'wings'], investigator: ['rally', 'scanner'],
  survivor: ['salvage', 'tanks'], medic: ['science', 'tanks'], technician: ['industrial', 'coil'],
  performer: ['stage', 'speakers']
});

const hash = value => {
  let result = 2166136261;
  for (const character of String(value)) result = Math.imul(result ^ character.codePointAt(0), 16777619) >>> 0;
  return result;
};

const safeColor = (value, fallback) => /^#[0-9a-f]{6}$/i.test(String(value)) ? value : fallback;

const describeSource = (src, context) => {
  const layout = getSpriteSheetLayout(src);
  const frame = getSpriteFrameForLayout('idle', 0, layout);
  return Object.freeze({
    src, columns: layout.columns, rows: layout.rows,
    col: frame.col, row: frame.row,
    trim: frame.trim ? Object.freeze({ ...frame.trim }) : null,
    sourceContext: context, upperBodyRatio: 0.68
  });
};

export function createKartSpec(hero) {
  if (!hero?.id || !hero.universe) return null;
  const authored = CHARACTER_KART_DESIGNS[hero.id];
  const [family, motif] = UNIVERSE_BODY_STYLES[hero.universe]
    || CATEGORY_DESIGNS[hero.category] || ['classic', 'badge'];
  const design = authored || {
    bodyStyle: family, signature: motif,
    label: `Kart de ${hero.name || hero.id}`,
    designSource: UNIVERSE_BODY_STYLES[hero.universe] ? 'universe-family-adaptation' : 'character-palette-and-role'
  };
  const seed = hash(hero.id);
  // Hashing varies geometry only. It is not a substitute for a source reference.
  const dimensions = Object.freeze({
    wheelbase: design.wheelbase || 1.88 + (seed % 31) / 100,
    width: design.width || 1.55 + ((seed >>> 5) % 30) / 100,
    nose: 0.65 + ((seed >>> 10) % 25) / 100,
    fin: 0.3 + ((seed >>> 15) % 21) / 100,
    wheelRadius: ['armored', 'salvage', 'rally'].includes(design.bodyStyle) ? 0.35 : 0.31
  });
  const sourceContext = hero.id === PLAYER_HERO_ID ? 'melee' : 'rpg';
  const candidates = Object.freeze(getHeroSpriteSheetSources(hero, sourceContext).map(src => describeSource(src, sourceContext)));
  const driverSprite = Object.freeze({
    ...candidates[0],
    sources: Object.freeze(candidates.map(candidate => candidate.src)),
    candidates,
    identity: hero.id,
    missingPolicy: 'empty-seat-and-visible-name',
    directionalStatus: 'existing-hero-idle-billboard; dedicated seated directions pending'
  });
  const base = `/kart/${slugifyAsset(hero.universe)}/${slugifyAsset(hero.id)}`;
  const sourceReferences = [...new Set([
    hero.referenceUrl, ...(Array.isArray(hero.referenceUrls) ? hero.referenceUrls : [])
  ].filter(value => typeof value === 'string' && /^https?:\/\//.test(value)))];
  return Object.freeze({
    id: `kart-hero:${hero.id}`, heroId: hero.id,
    name: hero.name || hero.id, universe: hero.universe, category: hero.category || 'unknown',
    kartName: Object.freeze({ fr: design.label, en: `${hero.name || hero.id} kart` }),
    color: safeColor(design.color || hero.primaryColor, '#39c5bb'),
    accent: safeColor(design.accent || hero.secondaryColor, '#e1b95b'),
    detailColor: safeColor(design.detailColor || hero.weaponColor, '#e4eef1'),
    bodyStyle: design.bodyStyle, signature: design.signature, dimensions, seed,
    designSource: design.designSource, modelVersion: KART_MODEL_VERSION,
    driverSprite,
    driverAnchor: Object.freeze([0, 0.78, 0.18]),
    sprite2D: Object.freeze({ src: `${base}/kart-directions.png`, columns: 8, rows: 1, frameWidth: 128, frameHeight: 128,
      anchor: Object.freeze({ x: 0.5, y: 0.86 }), directions: KART_DIRECTIONS, containsDriver: false }),
    modelAsset: `${base}/kart.glb`,
    illustration2D: hero.id === 'arca_mirelle' ? `${base}/kart-illustration-v1.png` : null,
    sourceReferences: Object.freeze(sourceReferences),
    referenceAsset: design.referenceAsset || null,
    characterReference: hero.visualAnchor || hero.incarnation || '',
    fidelityStatus: 'unreviewed-original-kart-adaptation',
    driverFidelityStatus: hero.visualReviewStatus || 'inherits-existing-sprite-review',
    equipmentReference: Object.freeze(Array.isArray(hero.equipment) ? [...hero.equipment] : []),
    statsPolicy: 'existing-race-and-garage-stats'
  });
}

const heroById = new Map(HEROES_DB.map(hero => [hero.id, hero]));
const roster = Object.freeze([createPlayerHero(), ...HEROES_DB].map(createKartSpec));
const kartById = new Map(roster.flatMap(kart => [[kart.id, kart], [kart.heroId, kart]]));

/** Project availability without changing the player's save or DLC preferences. */
export function getKartRoster({ hiddenUniverses = [], installed = isUniverseInstalled, playerProfile = null } = {}) {
  const hidden = new Set(Array.isArray(hiddenUniverses) ? hiddenUniverses : []);
  return roster.filter(kart => (
    kart.heroId === PLAYER_HERO_ID || (installed(kart.universe) && !hidden.has(kart.universe))
  )).map(kart => kart.heroId === PLAYER_HERO_ID && playerProfile
    ? createKartSpec(createPlayerHero(playerProfile)) : kart);
}

/** An unknown ID has no fallback pilot: another character must not replace it. */
export function getKartForHero(heroOrId) {
  if (heroOrId && typeof heroOrId === 'object') return createKartSpec(heroOrId);
  return kartById.get(heroOrId) || null;
}

export function getKartHero(heroId) {
  return heroId === PLAYER_HERO_ID ? createPlayerHero() : heroById.get(heroId) || null;
}

export function getKartDriverFrame(spec, source = null) {
  const driver = spec?.driverSprite;
  if (!driver) return null;
  return driver.candidates.find(candidate => candidate.src === source) || driver.candidates[0] || null;
}

export const KART_ROSTER = roster;
