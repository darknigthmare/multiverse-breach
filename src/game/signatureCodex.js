import { FIGHTER_MELEE_SIGNATURE_KEYS } from './fighterMeleeSignatures.js';
import { prepareSourceSignature } from './signatureSourceKits.js';

/** Read-only view of the exact battle preparation contract. Never changes a
 * catalog actor, equipment, charge, saved progression or source approval. */
export function getSignatureCodex(actor) {
  if (!actor || typeof actor !== 'object' || Array.isArray(actor)) return null;
  const copy = { ...actor };
  const source = prepareSourceSignature(copy);
  if (!source) return null;
  return Object.freeze({
    key: source.key, name: source.name, legacyName: source.legacyName || null,
    universe: source.universe, continuity: source.requiredContinuity || actor.continuityScope || null,
    effect: source.effect, kind: source.kind, hits: source.hits,
    distribution: source.distribution, shape: source.shape, range: source.range,
    minRange: source.minRange || 0, summonName: source.summonName || null,
    projectile: source.projectile || null, summonAgent: source.summonAgent || null,
    protection: source.protection || null, durationTicks: source.durationTicks || null,
    referenceUrl: safeSignatureReference(source.referenceUrl), note: source.note,
    fidelity: source.fidelity, visualStatus: source.visualStatus,
    canonicalFidelityApproved: false
  });
}

export function safeSignatureReference(value) {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

/** Reward identity and source universe must agree. Never resolve by a displayed
 * name, grant a skin's incarnation, or pick the first of ambiguous matches. */
export function resolveCardSignatureActor(definition, heroes) {
  if (definition?.kind !== 'character' || definition.rewardKind !== 'hero'
    || typeof definition.characterId !== 'string' || !definition.characterId
    || definition.characterId !== definition.rewardId || !Array.isArray(heroes)) return null;
  const matches = heroes.filter(actor => actor && actor.id === definition.characterId
    && actor.universe === definition.universe);
  return matches.length === 1 ? matches[0] : null;
}

export function signatureText(value, lang = 'fr', fallback = '') {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const key of [lang === 'fr' ? 'fr' : 'en', 'fr', 'en', 'name']) {
      if (typeof value[key] === 'string') return value[key];
    }
  }
  return typeof fallback === 'string' ? fallback : '';
}

/** Correct only the old label of a verified source contract, not surrounding
 * biography, equipment, other abilities or lore of an unverified incarnation. */
export function synchronizeSignatureText(text, codex) {
  if (typeof text !== 'string') return '';
  if (!codex?.legacyName || codex.legacyName === codex.name) return text;
  return text.split(codex.legacyName).join(codex.name);
}

export function getSignatureSummary(codex, lang = 'fr') {
  if (!codex) return '';
  const fr = lang === 'fr';
  const prefix = fr ? 'Signature disponible en RPG et mêlée' : 'Signature available in RPG and melee';
  const stock = codex.protection === 'stock-uber';
  const adaptation = stock ? (fr
    ? ' ÜberCharge aussi en Fighter (soi uniquement) et Tactics (soi + un patient, 3 cases, ligne de vue), pendant 8 secondes actives. Pas de soin ni de dégâts.'
    : ' UberCharge also works in Fighter (self only) and Tactics (self + one patient, 3 cells, line of sight) for 8 active seconds. No healing or damage.') : '';
  const cost = fr ? '100 % de jauge spéciale ; ATB pleine aussi en RPG. Tactics conserve son kit existant.'
    : '100% special meter; full ATB also required in RPG. Tactics keeps its existing kit.';
  const limit = fr ? 'Adaptation jouable ; animation et fidélité 1:1 non certifiées.'
    : 'Playable adaptation; animation and 1:1 fidelity are not certified.';
  const healing = codex.key === 'aerith_ff7' ? (fr
    ? ' Healing Wind soigne aussi la cellule vivante en Fighter et les alliés vivants en Tactics (5 cases, ligne de vue), jusqu’à 50 % de leurs PV maximum et dans la limite des PV récupérables. Ni purification, ni résurrection, ni dégâts. Aucun lancement si aucun PV n’est récupérable.'
    : ' Healing Wind also heals the living Fighter team and living Tactics allies (5 cells, line of sight), up to 50% of their maximum HP within recoverable HP limits. No cleanse, revival or damage. No activation when no HP is recoverable.') : '';
  const fighterMelee = FIGHTER_MELEE_SIGNATURE_KEYS.includes(codex.key) ? (fr
    ? ` Fighter : ${codex.hits} contact(s) à courte portée sur l’adversaire actif confirmé, sans toucher les réservistes. La puissance totale est répartie entre les contacts ; sortie de portée, esquive et garde restent applicables. Préparation et récupération adaptées à ce mode.`
    : ` Fighter: ${codex.hits} close-range contact(s) against the confirmed active opponent, never reserves. The total damage budget is split between contacts; moving out of reach, dodging and guarding still apply. Windup and recovery are adapted to this mode.`) : '';
  return `${prefix} : ${codex.name}. ${stock || healing ? cost.split(' Tactics')[0] : cost}${adaptation}${healing}${fighterMelee} ${limit}`;
}

/** Booster candidates carry their exact underlying hero; names are not keys. */
export function getRewardSignatureCodex(reward) {
  const actor = reward?.data?.hero;
  if (reward?.kind !== 'hero' || !actor || actor.universe !== reward.universe
    || actor.id !== reward.rewardId) return null;
  return getSignatureCodex(actor);
}

/** Search-only copies preserve probabilities, reward IDs and the real catalog. */
export function withSignatureSearchText(rewards) {
  return rewards.map(reward => {
    const codex = getRewardSignatureCodex(reward);
    return codex ? { ...reward, desc: { fr: `${signatureText(reward.desc, 'fr')} ${codex.name}`,
      en: `${signatureText(reward.desc, 'en')} ${codex.name}` } } : reward;
  });
}
