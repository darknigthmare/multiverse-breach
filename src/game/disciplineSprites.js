import { DISCIPLINE_SPRITE_CATALOG } from './disciplineSpriteCatalog.js';

export const DISCIPLINE_UNIVERSE = 'Discipline: The Record of a Crusade';
export const DISCIPLINE_COSTUME_BASE = '/sprites/generated/heroes/discipline-the-record-of-a-crusade/costumes/';

// Bind only identities already present in HEROES_DB. The remaining catalogue
// characters are artwork records, not newly created playable characters.
export const DISCIPLINE_HERO_BINDINGS = Object.freeze({
  discipline_saori_otokawa: 'saori',
  discipline_ruri_nonomiya: 'ruri',
  discipline_takurou_hayami: 'takurou'
});

export const DISCIPLINE_STATIC_LAYOUT = Object.freeze({
  columns: 1,
  rows: 1,
  rowByState: Object.freeze({ idle: 0, run: 0, attack: 0, defense: 0, support: 0, special: 0, hit: 0, dead: 0, jump: 0, fall: 0, reload: 0 })
});

export const DISCIPLINE_PROVENANCE_LABELS = Object.freeze({
  reference: Object.freeze({ fr: 'D’après la référence', en: 'Based on the reference' }),
  adapted: Object.freeze({ fr: 'Adaptation identifiée', en: 'Labelled adaptation' }),
  original: Object.freeze({ fr: 'Création originale', en: 'Original design' })
});

export const DISCIPLINE_CATEGORY_LABELS = Object.freeze({
  uniform: Object.freeze({ fr: 'Uniforme', en: 'Uniform' }),
  civilian: Object.freeze({ fr: 'Tenue civile', en: 'Civilian outfit' }),
  military: Object.freeze({ fr: 'Tenue militaire', en: 'Military outfit' }),
  swimwear: Object.freeze({ fr: 'Natation', en: 'Swimwear' }),
  sport: Object.freeze({ fr: 'Sport', en: 'Sport' }),
  other: Object.freeze({ fr: 'Autre tenue', en: 'Other outfit' })
});

const validKey = value => typeof value === 'string' && /^[a-z0-9][a-z0-9_-]*$/.test(value);
const localised = value => value && typeof value.fr === 'string' && value.fr.trim()
  && typeof value.en === 'string' && value.en.trim();

export const disciplineCostumeId = (characterId, costumeId) => (
  validKey(characterId) && validKey(costumeId) ? `discipline-sprite-v1:${characterId}:${costumeId}` : ''
);

export function createDisciplineSpriteRegistry(catalogue) {
  if (!Array.isArray(catalogue)) throw new TypeError('Discipline sprite catalogue must be an array');
  const byId = Object.create(null);
  const byCharacter = Object.create(null);
  const layouts = Object.create(null);
  const defaults = new Set();
  const entries = catalogue.map(row => {
    const id = disciplineCostumeId(row?.characterId, row?.costumeId);
    if (!id || typeof row.characterName !== 'string' || !row.characterName.trim() || !localised(row.label)) {
      throw new Error(`Invalid Discipline costume identity or label: ${id || 'unknown'}`);
    }
    if (Object.hasOwn(byId, id)) throw new Error(`Duplicate Discipline costume: ${id}`);
    if (!Object.hasOwn(DISCIPLINE_PROVENANCE_LABELS, row.provenance)
      || !Object.hasOwn(DISCIPLINE_CATEGORY_LABELS, row.category)) {
      throw new Error(`Invalid Discipline costume provenance or category: ${id}`);
    }
    if (typeof row.src !== 'string' || !row.src.startsWith(DISCIPLINE_COSTUME_BASE)
      || !/^[a-z0-9/_-]+\.png$/.test(row.src) || row.src.includes('//')) {
      throw new Error(`Invalid Discipline costume PNG path: ${id}`);
    }
    if (Object.hasOwn(layouts, row.src)) throw new Error(`Duplicate Discipline costume PNG: ${row.src}`);
    if (typeof row.available !== 'boolean' || typeof row.isDefault !== 'boolean') {
      throw new Error(`Discipline costume availability/default flags must be explicit: ${id}`);
    }
    if (row.isDefault) {
      if (defaults.has(row.characterId)) throw new Error(`Duplicate Discipline default: ${row.characterId}`);
      defaults.add(row.characterId);
    }
    const entry = Object.freeze({
      ...row,
      id,
      label: Object.freeze({ ...row.label }),
      ...(localised(row.notes) ? { notes: Object.freeze({ ...row.notes }) } : {})
    });
    byId[id] = entry;
    (byCharacter[row.characterId] ||= []).push(entry);
    // Register even temporarily unavailable entries: a declared static PNG must
    // never fall back to the engine's default four-by-four sheet interpretation.
    layouts[row.src] = DISCIPLINE_STATIC_LAYOUT;
    return entry;
  });
  for (const rows of Object.values(byCharacter)) Object.freeze(rows);
  return Object.freeze({
    entries: Object.freeze(entries),
    byId: Object.freeze(byId),
    byCharacter: Object.freeze(byCharacter),
    layouts: Object.freeze(layouts)
  });
}

export const DISCIPLINE_SPRITE_REGISTRY = createDisciplineSpriteRegistry(DISCIPLINE_SPRITE_CATALOG);
export const DISCIPLINE_SPRITE_LAYOUTS = DISCIPLINE_SPRITE_REGISTRY.layouts;

export function getDisciplineCharacterId(actor) {
  return actor?.universe === DISCIPLINE_UNIVERSE && Object.hasOwn(DISCIPLINE_HERO_BINDINGS, actor.id)
    ? DISCIPLINE_HERO_BINDINGS[actor.id] : '';
}

export function getDisciplineCostumes(actor, registry = DISCIPLINE_SPRITE_REGISTRY) {
  const characterId = getDisciplineCharacterId(actor);
  return (registry.byCharacter[characterId] || []).filter(row => row.available).map(row => ({
    ...row,
    name: row.label,
    key: row.costumeId,
    nature: 'generated-static-costume',
    equippable: true,
    colors: {},
    brief: row.notes
  }));
}

export function resolveDisciplineCostume(actor, selectedId, registry = DISCIPLINE_SPRITE_REGISTRY) {
  if (typeof selectedId !== 'string' || !Object.hasOwn(registry.byId, selectedId)) return null;
  const entry = registry.byId[selectedId];
  return entry.available && entry.characterId === getDisciplineCharacterId(actor) ? entry : null;
}

export function getDisciplineSpriteSources(actor, registry = DISCIPLINE_SPRITE_REGISTRY) {
  const selected = resolveDisciplineCostume(actor, actor?.disciplineSpriteId, registry);
  if (!selected) return [];
  const available = registry.byCharacter[selected.characterId].filter(row => row.available);
  const fallback = available.find(row => row.isDefault) || available[0];
  return [...new Set([selected.src, fallback?.src].filter(Boolean))];
}

export function getDisciplineSpriteLayout(src, registry = DISCIPLINE_SPRITE_REGISTRY) {
  if (typeof src !== 'string' || !src) return null;
  try {
    const pathname = new URL(src, 'https://sprite.invalid').pathname;
    return Object.hasOwn(registry.layouts, pathname) ? registry.layouts[pathname] : null;
  } catch {
    return null;
  }
}
