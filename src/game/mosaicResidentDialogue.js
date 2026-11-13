import { MOSAIC_INTERACTION_RANGE } from './mosaicCityRuntime.js';
import { normalizeMosaicReconnaissance } from './mosaicReconnaissance.js';

/** Authored Cell ZERO records only. These are archive narration, not invented quotes. */
export const MOSAIC_DIALOGUE_RESIDENT_IDS = Object.freeze([
  'arca_bastion', 'arca_nova', 'arca_marrow', 'arca_sable', 'arca_loom',
  'arca_tessera', 'arca_quillon', 'arca_nadir', 'arca_elyra', 'arca_oryn'
]);
const localize = (value, lang) => typeof value === 'string' ? value
  : value?.[lang === 'fr' ? 'fr' : 'en'] || value?.fr || value?.en || '';

export function getMosaicResidentDialogue(hero, plaque, lang = 'fr') {
  if (!MOSAIC_DIALOGUE_RESIDENT_IDS.includes(hero?.id) || hero.universe !== 'Nexus de Convergence' || !plaque) return null;
  const topics = [
    ['origin', 'dossier', 'Son parcours', 'Their journey'],
    ['doctrine', 'doctrine', 'Sa spécialité', 'Their specialty'],
    ['breach', 'breachLore', 'Les failles et la Cité', 'Breaches and the City'],
    ['risk', 'threat', 'Les dangers', 'The dangers']
  ].flatMap(([id, sourceField, fr, en]) => {
    const body = localize(plaque[sourceField], lang);
    return body ? [{ id, sourceField, label: lang === 'fr' ? fr : en, body }] : [];
  });
  if (!topics.length) return null;
  return { heroId: hero.id, name: hero.name, role: localize(plaque.role, lang),
    universe: hero.universe, topics };
}

/** A directory click alone never starts a conversation or records evidence. */
export function beginMosaicResidentDialogue(interaction, { ownedHeroIds = [], plaque, lang = 'fr' } = {}) {
  const hero = interaction?.target?.hero;
  if (interaction?.type !== 'npc' || interaction.id !== hero?.id
    || !Number.isFinite(interaction.distance) || interaction.distance < 0
    || interaction.distance > MOSAIC_INTERACTION_RANGE.npc
    || !Array.isArray(ownedHeroIds) || !ownedHeroIds.includes(hero?.id)) return null;
  return getMosaicResidentDialogue(hero, plaque, lang);
}

/** Read-only view of saved proofs. Unavailable packs/records remain visible by ID. */
export function getMosaicReconnaissanceLedger(progress, { heroes = [], exhibits = [], districts = {}, lang = 'fr' } = {}) {
  const saved = normalizeMosaicReconnaissance(progress);
  const heroNames = new Map(heroes.filter(hero => hero?.id).map(hero => [hero.id, hero.name || hero.id]));
  const exhibitNames = new Map(exhibits.filter(item => item?.id).map(item => [item.id, localize(item.name, lang) || item.id]));
  return Object.entries(saved.dossiers).map(([districtId, dossier]) => {
    const district = Object.hasOwn(districts, districtId) ? districts[districtId] : null;
    const evidenceIds = dossier.exhibitGoal === 2 ? dossier.evidenceIds : dossier.exhibitId ? [dossier.exhibitId] : [];
    return { districtId, universe: dossier.universe, available: district?.universe === dossier.universe,
      completed: dossier.completed, active: saved.activeDistrictId === districtId,
      witness: dossier.residentId ? { id: dossier.residentId, name: heroNames.get(dossier.residentId) || dossier.residentId } : null,
      evidenceGoal: dossier.exhibitGoal || 1,
      evidence: evidenceIds.map(id => ({ id, name: exhibitNames.get(id) || id })) };
  }).sort((a, b) => Number(b.active) - Number(a.active) || Number(a.completed) - Number(b.completed)
    || a.universe.localeCompare(b.universe, lang === 'fr' ? 'fr' : 'en'));
}
