import { HEROES_DB } from './heroes.js';
import { CANONICAL_COMBAT_OVERRIDES, CANONICAL_UNIVERSE_SUMMONS } from './canonicalCombatOverrides.js';
import { CANONICAL_COMBAT_EXTENSIONS } from './combatCanonExtensions.js';
import { COMBAT_CAPABILITY_COMPLETION } from './combat/completion/catalog.js';
import { attachCombatEntityAsset } from './combat/entityAssets.js';
import { COMBAT_ABILITY_OVERRIDES } from './combat/abilities/catalog.js';
import { resolvePresentationScript } from './combat/presentationCatalog.js';
import { ROSTER_REINFORCEMENTS_WAVE10 } from './combat/rosterReinforcementsWave10.js';
import { ROSTER_REINFORCEMENTS_WAVE11 } from './combat/rosterReinforcementsWave11.js';

// This catalog preserves the source of each action. A runtime adaptation and an
// actual source-game animation are different claims; no animation is certified
// by resolving one of these profiles.
const beneficial = new Set(['heal', 'guard', 'buff', 'cleanse', 'revive']);
const effects = new Set(['damage', ...beneficial]);
const allowedStatuses = new Set(['infected', 'glitched', 'radiated']);
const slots = ['special', 'secondary', 'simple'];
const heroSpriteIdentities = new Map(HEROES_DB.map(hero => [hero.id, hero]));
const universes = new Map();
for (const hero of HEROES_DB) {
  if (!universes.has(hero.universe)) universes.set(hero.universe, []);
  universes.get(hero.universe).push(hero);
}
const clone = value => Array.isArray(value) ? value.map(clone)
  : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, clone(item)])) : value;
const finite = (value, fallback, min = 0) => Number.isFinite(Number(value)) && Number(value) >= min ? Number(value) : fallback;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const combatIdentityText = (value, fallback = '') => typeof value === 'string' && value.trim() ? value
  : value && typeof value === 'object' ? combatIdentityText(value.fr, combatIdentityText(value.en, fallback)) : fallback;
// A side-prefixed battle ID must not turn a known roster hero into a monster
// sprite. Only an exact source ID and universe can select that hero's artwork.
export function resolveCombatHeroSpriteActor(actor) {
  if (!actor?.universe) return null;
  const hero = [actor.sourceHeroId, actor.sourceId, actor.id]
    .map(id => heroSpriteIdentities.get(id))
    .find(candidate => candidate?.universe === actor.universe);
  return hero ? { ...hero, ...actor, id: hero.id } : null;
}
const identity = actor => actor?.sourceHeroId || actor?.sourceId || actor?.id;
const hasAbility = action => !!(action && typeof action === 'object' && combatIdentityText(action.name) && typeof action.type === 'string');
const overrideFor = actor => {
  const record = CANONICAL_COMBAT_OVERRIDES[identity(actor)] || CANONICAL_COMBAT_EXTENSIONS[identity(actor)] || COMBAT_CAPABILITY_COMPLETION[identity(actor)];
  return record?.universe === actor?.universe ? record : null;
};
const provenanceFor = (actor, slot, action, override = null) => ({
  kind: override ? 'authored-canonical-identity' : 'existing-catalog-ability',
  sourceHeroId: identity(actor),
  sourceUniverse: actor.universe,
  sourceSlot: slot,
  sourceAbilityName: combatIdentityText(action.name),
  originalCatalogName: combatIdentityText(actor[slot]?.name),
  sourceWork: override?.sourceWork || actor.universe,
  sourceReference: override?.sourceReference || null,
  sourceUrl: override?.sourceUrl || null,
  identityBasis: override?.identityBasis || (override ? 'authored-source-adaptation' : 'existing-catalog'),
  canonicalVerified: false,
  networkVerified: false,
  identityAuthored: !!override,
  genericCatalogIdentity: /Origin Burst|Signature Strike|Breach Technique|decisive\s+action/i.test(combatIdentityText(action.name)),
  gameplayAdaptation: true,
  visualFidelity: 'adapted-runtime-presentation'
});

// Explicit action metadata wins over a type; the two OC medical/defensive
// drones retain the support semantics already documented by rpgTargeting.
function abilityProfile(actor, slot, action) {
  const explicit = Object.assign({}, typeof action.targeting === 'object' ? action.targeting : null, action.attackProfile, action.rpgProfile, actor.rpgAttacks?.[slot]);
  const type = action.type.toLowerCase();
  const loreEffect = identity(actor) === 'arca_loom' && slot === 'secondary' ? 'heal'
    : identity(actor) === 'arca_bastion' && slot === 'secondary' ? 'guard' : null;
  const declared = explicit.effect || action.effect?.type || (typeof action.effect === 'string' ? action.effect : null);
  const effect = effects.has(declared) ? declared : loreEffect
    || (/reviv|resurrect/.test(type) ? 'revive' : /heal|restore|regen/.test(type) ? 'heal'
      : /cleanse|purify/.test(type) ? 'cleanse' : /buff|support/.test(type) ? 'buff'
        : /shield|guard/.test(type) ? 'guard' : 'damage');
  const supported = beneficial.has(effect);
  const declaredDelivery = explicit.delivery || action.delivery;
  const delivery = supported ? 'support'
    : ['melee', 'projectile', 'beam', 'area'].includes(declaredDelivery) ? declaredDelivery
      : /melee|slash|punch|dodge_strike|drill_smash/.test(type) ? 'melee'
        : /beam|laser/.test(type) ? 'beam'
          : /bullet|shotgun|rocket|projectile|boomerang|cannon/.test(type) ? 'projectile' : 'area';
  const side = explicit.targetSide || action.targetSide;
  const targetSide = ['self', 'ally', 'enemy'].includes(side) ? side
    : side === 'allies' ? 'ally' : side === 'enemies' ? 'enemy' : supported ? 'ally' : 'enemy';
  const aliases = { all: 'group', allies: 'group', enemies: 'group', aoe: 'area', zone: 'area', ray: 'line' };
  const declaredShape = explicit.shape || explicit.pattern || (typeof action.targeting === 'string' ? action.targeting : null);
  const fallbackShape = targetSide === 'self' ? 'single' : supported && (slot === 'special' || /_aoe/.test(type)) ? 'group'
    : /beam|laser/.test(type) ? 'line' : /_aoe|rocket|vortex/.test(type) ? 'area' : 'single';
  const shape = aliases[declaredShape] || declaredShape || fallbackShape;
  const duration = finite(explicit.duration ?? action.duration ?? action.dur, supported ? 3 : 0.95, 0.1);
  return {
    effect,
    delivery,
    targetSide,
    excludeSelf: explicit.excludeSelf === true,
    shape: ['single', 'group', 'multi', 'area', 'line', 'cone'].includes(shape) ? shape : fallbackShape,
    range: finite(explicit.range ?? action.range ?? action.rpgRange, delivery === 'melee' ? 170 : delivery === 'support' ? 760 : 640, 1),
    areaRadius: finite(explicit.areaRadius ?? explicit.radius ?? action.areaRadius, 135, 1),
    lineWidth: finite(explicit.lineWidth ?? action.lineWidth, 48, 1),
    coneAngle: clamp(finite(explicit.coneAngle ?? action.coneAngle, 55, 1), 1, 180),
    maxTargets: finite(explicit.maxTargets ?? action.maxTargets, shape === 'single' ? 1 : 8, 1),
    multiplier: finite(action.dmg, 1),
    duration,
    healRatio: clamp(finite(explicit.healRatio ?? action.healRatio, 0), 0, 1),
    guardReduce: clamp(finite(explicit.reduce ?? action.reduce, 0.4), 0, 0.95),
    buffMultiplier: finite(explicit.buffMultiplier ?? action.buffMultiplier, 1.2, 1),
    reviveRatio: clamp(finite(explicit.reviveRatio ?? action.reviveRatio, 0.3), 0.01, 1),
    cleanses: explicit.cleanses ?? action.cleanses ?? effect === 'cleanse',
    statusEffect: allowedStatuses.has(action.statusEffect) ? action.statusEffect : null
  };
}

export function resolveMeleeSuper(actor) {
  if (!actor?.universe || !hasAbility(actor.special)) return null;
  const authored = COMBAT_ABILITY_OVERRIDES[identity(actor)];
  const canonical = authored?.universe === actor.universe && authored.special ? authored : overrideFor(actor);
  // A selected source version applies to the super as well as basic commands.
  // Retain its canonical action and reference, and record the explicit revision.
  const override = canonical && authored?.universe === actor.universe && authored.versionRevision
    ? { ...canonical, sourceWork: authored.sourceWork,
      sourceUrl: authored.sourceUrl || canonical.sourceUrl,
      sourceReference: [canonical.sourceReference, authored.sourceReference].filter(Boolean).join(' ') }
    : canonical;
  const action = clone(override?.special || actor.special);
  if (!hasAbility(action)) return null;
  const profile = abilityProfile(actor, 'special', action);
  const duration = finite(action.animationDuration, 1.1, 0.2);
  return {
    id: `${identity(actor) || actor.universe}:super`,
    name: combatIdentityText(action.name),
    universe: actor.universe,
    ...profile,
    // A super uses a short action timeline; beneficial effect duration is kept
    // separately so a five-second buff does not lock the fighter for five seconds.
    duration,
    effectDuration: profile.duration,
    hitAt: clamp(finite(action.hitAt, duration * 0.41, 0.01), 0.01, duration * 0.95),
    meterCost: clamp(finite(action.meterCost, 100, 1), 1, 100),
    color: action.color || actor.secondaryColor || actor.primaryColor || '#ffffff',
    visualStyle: beneficial.has(profile.effect) ? profile.effect : profile.delivery,
    sourceHeroId: identity(actor),
    sourceAbility: { ...action, name: combatIdentityText(action.name), slot: 'special', sourceHeroId: identity(actor) },
    provenance: provenanceFor(actor, 'special', action, override)
  };
}

// Basic commands need the same identity and effect guarantees as supers.
// Keeping the raw roster intact also preserves custom actors and source proofs.
export function resolveCombatAbility(actor, slot = 'special') {
  if (slot === 'special') return resolveMeleeSuper(actor);
  if (!['simple', 'secondary', 'defense'].includes(slot) || !actor?.universe || !hasAbility(actor[slot])) return null;
  const candidate = COMBAT_ABILITY_OVERRIDES[identity(actor)];
  const override = candidate?.universe === actor.universe && candidate[slot] ? candidate : null;
  const action = clone(override?.[slot] || actor[slot]);
  if (!hasAbility(action)) return null;
  const profile = abilityProfile(actor, slot, action);
  const duration = finite(action.animationDuration, slot === 'simple' ? 0.4 : slot === 'secondary' ? 0.7 : 0.5, 0.1);
  return {
    id: `${identity(actor)}:${slot}`, name: combatIdentityText(action.name), universe: actor.universe,
    ...profile, duration, effectDuration: profile.duration,
    hitAt: clamp(finite(action.hitAt, duration * 0.42, 0.01), 0.01, duration * 0.95),
    color: action.color || actor.secondaryColor || actor.primaryColor || '#ffffff',
    visualStyle: beneficial.has(profile.effect) ? profile.effect : profile.delivery,
    sourceHeroId: identity(actor),
    sourceAbility: { ...action, name: combatIdentityText(action.name), slot, sourceHeroId: identity(actor) },
    provenance: provenanceFor(actor, slot, action, override)
  };
}

function resolvedAction(actor, slot, rawAction) {
  const action = clone(rawAction);
  const profile = abilityProfile(actor, slot, action);
  // A cinematic caller delegates the action to an arriving performer. Its RPG
  // selection range covers the arena; this does not change the melee super's
  // actual combat range or the source ability's preserved metadata.
  const targeting = { ...profile, range: finite(action.summonRange, 1200, 1), reduce: profile.guardReduce, delivery: profile.delivery === 'projectile' || profile.delivery === 'beam' || profile.delivery === 'area' ? 'ranged' : profile.delivery };
  return { ...action, name: combatIdentityText(action.name), dmg: profile.multiplier, targeting, rpgProfile: clone(targeting) };
}

function canonicalSummon(actor, override) {
  const action = resolvedAction(actor, 'summon', override.action);
  const kind = override.kind === 'reinforcement' ? 'reinforcement' : 'summon';
  const duration = finite(override.duration, 3.6, 0.5);
  return {
    id: `${identity(actor)}:summon:${override.entityName}`,
    name: combatIdentityText(override.name, override.entityName),
    universe: actor.universe,
    kind,
    entityName: override.entityName,
    performer: null,
    action,
    color: override.color || actor.secondaryColor || '#ffffff',
    duration,
    impactAt: clamp(finite(override.impactAt, duration * 0.53, 0.1), 0.1, duration * 0.95),
    visualStyle: override.visualStyle || 'area',
    entityRender: { kind: kind === 'reinforcement' ? 'deployment' : 'ability-manifestation', style: override.visualStyle || 'area', assetMissing: true, entityName: override.entityName },
    sourceHeroId: identity(actor),
    sourceAbility: { ...clone(override.action), slot: 'summon', sourceHeroId: identity(actor) },
    provenance: {
      ...provenanceFor(actor, 'summon', override.action, override),
      kind: kind === 'reinforcement' ? 'authored-universe-deployment' : 'authored-universe-summon',
      canonicalEntity: kind === 'summon',
      sourceEquipmentOrPartner: kind === 'reinforcement',
      equipmentAssignment: override.equipmentAssignment === true,
      entityAssetMissing: true
    }
  };
}

export function resolveUniverseSummon(actor) {
  if (!actor?.universe || !identity(actor)) return null;
  // Empty enemy shells do not acquire a made-up special merely by sharing a
  // universe string with a roster character.
  if (!slots.some(slot => hasAbility(actor[slot]))) return null;
  const selectedPartner = ROSTER_REINFORCEMENTS_WAVE11[identity(actor)] || ROSTER_REINFORCEMENTS_WAVE10[identity(actor)];
  if (selectedPartner?.universe === actor.universe) {
    const performer = heroSpriteIdentities.get(selectedPartner.performerHeroId);
    const slot = selectedPartner.slot;
    const effective = performer?.universe === actor.universe && resolveCombatAbility(performer, slot);
    if (effective && performer.id !== identity(actor)) {
      const rawAction = effective.sourceAbility;
      const action = resolvedAction(performer, slot, rawAction);
      return attachCombatEntityAsset({
        id: `${identity(actor)}:reinforcement:${performer.id}:${slot}`,
        name: `${performer.name} — ${action.name}`, universe: actor.universe,
        kind: 'reinforcement', entityName: performer.name, performer: clone(performer), performerRole: 'reinforcement',
        action, color: effective.color, duration: 3.2, impactAt: 1.65,
        visualStyle: effective.delivery, sourceHeroId: performer.id,
        sourceAbility: { ...clone(rawAction), slot, sourceHeroId: performer.id },
        provenance: { ...effective.provenance, kind: 'same-universe-reinforcement',
          canonicalEntity: false, entityAssetMissing: false, sourceRosterHeroId: performer.id,
          partnerSelection: selectedPartner.sourceWave === 11 ? 'wave11-explicit-source-version' : 'wave10-explicit-source-version',
          sourceRulesLimit: 'Real same-universe partner; one bounded effect, no invented entity or transferred biology.' }
      });
    }
  }
  const record = overrideFor(actor);
  const canonical = record?.summon || (record?.universe === actor.universe ? CANONICAL_UNIVERSE_SUMMONS[identity(actor)] : null);
  if (canonical?.action && hasAbility(canonical.action)) return attachCombatEntityAsset(canonicalSummon(actor, canonical));
  const roster = universes.get(actor.universe) || [];
  const candidates = [actor, ...roster.filter(hero => identity(hero) !== identity(actor))];
  let source = null;
  for (const performer of candidates) {
    const slot = slots.find(key => hasAbility(performer[key]) && /^summon(?:_|$)/i.test(performer[key].type));
    if (slot) { source = { performer, slot, explicitSummon: true }; break; }
  }
  if (!source) {
    const performer = roster.find(hero => identity(hero) !== identity(actor) && slots.some(slot => hasAbility(hero[slot])));
    if (!performer) return null;
    const supportSlot = ['secondary', 'special'].find(slot => hasAbility(performer[slot]) && beneficial.has(abilityProfile(performer, slot, performer[slot]).effect));
    source = { performer, slot: supportSlot || (hasAbility(performer.special) ? 'special' : hasAbility(performer.secondary) ? 'secondary' : 'simple'), explicitSummon: false };
  }
  const { performer, slot, explicitSummon } = source;
  const effective = resolveCombatAbility(performer, slot);
  const sourceOverride = slot === 'special' ? overrideFor(performer)
    : effective?.provenance.identityAuthored ? COMBAT_ABILITY_OVERRIDES[identity(performer)] : null;
  // Keep authored corrections of the same named deployment (including
  // nonviolent ancestor guidance). A different personal super must not replace
  // an older caller's Dog robot or sentry with the performer's new gunshot.
  const sameExplicitAction = !explicitSummon || combatIdentityText(effective?.sourceAbility?.name) === combatIdentityText(performer[slot].name);
  const rawAction = effective?.provenance.identityAuthored && sameExplicitAction
    ? effective.sourceAbility : performer[slot];
  const action = resolvedAction(performer, slot, rawAction);
  // Catalog `summon` also covers turrets, drones, trap placement and allied
  // crews. Only these explicitly spectral original-world abilities are literal
  // summons; equipment and physical allies are presented as reinforcements.
  const literalSummoners = new Set(['arca_tessera', 'mei_zhen', 'daichi_kurogane']);
  const kind = explicitSummon && literalSummoners.has(identity(performer)) ? 'summon' : 'reinforcement';
  const entityName = explicitSummon ? combatIdentityText(rawAction.name) : combatIdentityText(performer.name, performer.id);
  return attachCombatEntityAsset({
    id: `${identity(actor)}:${explicitSummon ? 'summon' : 'reinforcement'}:${identity(performer)}:${slot}`,
    name: explicitSummon ? entityName : `${entityName} — ${action.name}`,
    universe: actor.universe,
    kind,
    entityName,
    performer: clone(performer),
    performerRole: explicitSummon ? 'caller' : 'reinforcement',
    action,
    color: rawAction.color || performer.secondaryColor || performer.primaryColor || '#ffffff',
    duration: 3.2,
    impactAt: 1.65,
    visualStyle: explicitSummon ? 'deployment' : action.targeting.delivery,
    sourceHeroId: identity(performer),
    sourceAbility: { ...clone(rawAction), name: combatIdentityText(rawAction.name), slot, sourceHeroId: identity(performer) },
    provenance: {
      ...provenanceFor(performer, slot, rawAction, sourceOverride),
      kind: explicitSummon ? kind === 'summon' ? 'existing-catalog-summon' : 'existing-catalog-deployment' : 'same-universe-reinforcement',
      canonicalEntity: false,
      entityAssetMissing: explicitSummon,
      sourceRosterHeroId: performer.id
    }
  });
}

const phaseAliases = { round_win: 'roundVictory', roundWin: 'roundVictory', round_victory: 'roundVictory', round_loss: 'roundDefeat', roundLoss: 'roundDefeat', round_defeat: 'roundDefeat', fatalite: 'fatality', fatalité: 'fatality', finisher: 'fatality' };
const phaseLabels = { intro: 'Entrée', outro: 'Sortie', fatality: 'Finale', victory: 'Victoire', defeat: 'Défaite', roundVictory: 'Manche gagnée', roundDefeat: 'Manche perdue' };
export function resolveCombatPresentation(actor, requestedPhase) {
  if (!actor?.universe || !identity(actor)) return null;
  const phase = phaseAliases[requestedPhase] || requestedPhase;
  if (!phaseLabels[phase]) return null;
  const heroName = combatIdentityText(actor.name, identity(actor));
  const superProfile = resolveMeleeSuper(actor);
  const presentationScript = resolvePresentationScript(actor, phase);
  const actionName = superProfile?.name || combatIdentityText(actor.simple?.name);
  const defeat = phase === 'defeat' || phase === 'roundDefeat';
  return {
    id: `${identity(actor)}:presentation:${phase}`,
    phase,
    name: `${heroName} — ${phaseLabels[phase]}`,
    description: phase === 'fatality' ? `${actor.universe} · Finale adaptée${actionName ? ` : ${actionName}` : ''}`
      : `${actor.universe}${actionName && !defeat ? ` · ${actionName}` : ''}`,
    visualStyle: defeat ? 'defeat' : phase === 'intro' ? 'ready' : phase === 'outro' ? 'exit' : phase === 'fatality' ? superProfile?.visualStyle || 'victory' : 'victory',
    color: superProfile?.color || actor.secondaryColor || actor.primaryColor || '#ffffff',
    duration: presentationScript?.duration || (phase === 'fatality' ? 2.4 : phase === 'intro' ? 1.7 : phase === 'roundVictory' || phase === 'roundDefeat' ? 1.3 : 1.9),
    presentationScript,
    sourceHeroId: identity(actor),
    sourceAbility: superProfile?.sourceAbility || null,
    provenance: { ...(superProfile?.provenance || {}), gameplayAdaptation: true, canonicalSequence: false,
      presentationAuthored: !!presentationScript,
      presentationSourceReference: presentationScript?.sourceReference || null,
      visualFidelity: presentationScript ? 'authored-character-choreography' : 'existing-character-sprite-and-adapted-pose' }
  };
}
