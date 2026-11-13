import { HEROES_DB } from '../heroes.js';
import { createPlayerHero, PLAYER_HERO_ID } from '../playerHero.js';
import { isUniverseInstalled } from '../dlcInstallation.js';
import { CHARACTER_KART_IDENTITIES, KART_IDENTITY_VERSION, getKartVehicleIdentity } from './kartIdentityCatalog.js';
import {
  getHeroSpriteSheetSources,
  getSpriteFrameForLayout,
  getSpriteSheetLayout,
  slugifyAsset
} from '../spriteAssets.js';

/**
 * Kart identities follow the character catalogue, never its array index.
 * Canonical vehicles are adapted to racing proportions; invented vehicles use
 * explicit universe motifs. Neither choice asserts canonical ownership of a kart. No stat/reward/ownership rule is changed here.
 */
export const KART_MODEL_VERSION = KART_IDENTITY_VERSION;
export const KART_DIRECTIONS = Object.freeze([
  'rear', 'rear-right', 'right', 'front-right',
  'front', 'front-left', 'left', 'rear-left'
]);

// Kept as a named export for catalogue consumers; every entry is now an
// explicit vehicle or a character-specific invention rather than a role kit.
export const CHARACTER_KART_DESIGNS = CHARACTER_KART_IDENTITIES;

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
  const design = getKartVehicleIdentity(hero);
  if (!design) return null;
  const seed = hash(hero.id);
  // Geometry follows the authored vehicle proportions. A character hash no
  // longer selects or perturbs its silhouette.
  const dimensions = design.dimensions;
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
    ...design.sourceUrls, hero.referenceUrl, ...(Array.isArray(hero.referenceUrls) ? hero.referenceUrls : [])
  ].filter(value => typeof value === 'string' && /^https?:\/\//.test(value)))];
  return Object.freeze({
    id: `kart-hero:${hero.id}`, heroId: hero.id,
    name: hero.name || hero.id, universe: hero.universe, category: hero.category || 'unknown',
    kartName: Object.freeze({ fr: design.label, en: design.labelEn || design.referenceVehicle || design.label }),
    color: safeColor(design.color || hero.primaryColor, '#39c5bb'),
    accent: safeColor(design.accent || hero.secondaryColor, '#e1b95b'),
    detailColor: safeColor(design.detailColor || hero.weaponColor, '#e4eef1'),
    bodyStyle: design.model, signature: design.motifs.join('+'), dimensions, seed,
    vehicleIdentity: design,
    designSource: design.designScope === 'character-specific' ? 'authored-character-adaptation' : 'universe-family-adaptation',
    modelVersion: KART_MODEL_VERSION,
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
const roster = Object.freeze([createPlayerHero(), ...HEROES_DB].map(hero => {
  const spec = createKartSpec(hero);
  if (!spec) throw new Error(`Missing authored kart identity for ${hero.id} (${hero.universe})`);
  return spec;
}));
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
