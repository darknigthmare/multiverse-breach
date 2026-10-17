import { resolveSourceSignature } from './signatureSourceKits.js';
// A presentation/dispatch registry, NOT a certificate of source fidelity.
// No global name regex grants a spell, a support faction, or a new weapon.
const freeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze); Object.freeze(value);
  }
  return value;
};
const record = (universe, actors, kind, effect, hits, totalDamage, color, extra = {}) => freeze({
  universe, actors, kind, effect, hits, totalDamage, color,
  windupTicks: 24, revealTicks: 36, hitGapTicks: 10, outroTicks: 24,
  fidelity: 'game-adaptation', visualStatus: 'existing-artwork-and-abstract-effects',
  source: 'existing-event-contract', ...extra
});
export const SIGNATURE_INVOCATIONS = freeze({
  evt_knights_of_the_round: record('Final Fantasy VII',
    ['cloud_ff7', 'tifa_ff7', 'aerith_ff7', 'barret_ff7', 'redxiii_ff7', 'yuffie_ff7', 'vincent_ff7'],
    'summon', 'knights_of_the_round', 13, 260, '#b597ff', {
      source: 'Final Fantasy VII (1997), equipped Knights of Round materia; existing project event',
      // Thirteen separate contacts, not 13 times a full replacement attack.
      note: 'Source attack count retained; damage, cost, timing and artwork are adaptations, not 1:1 certification.'
    }),
  evt_gears_hammer: record('Gears of War', ['marcus', 'dom', 'cole', 'baird', 'anya_stroud', 'hoffman_cog', 'carmine_cog'],
    'orbital', 'hammer_strike', 1, 150, '#ffab49'),
  evt_halo_warthog: record('Halo', ['masterchief', 'johnson', 'noble_six', 'buck_odst', 'kelly_087', 'linda_058', 'buck'],
    'vehicle', 'warthog_run', 3, 120, '#91bd7a'),
  evt_aliens_sentries: record('Aliens', ['hicks_aliens', 'vasquez_aliens', 'ripley_aliens', 'hudson_aliens', 'apone_aliens'],
    'turret', 'aliens_sentries', 4, 120, '#7fe4e6'),
  evt_hl_snarks: record('Half-Life', ['freeman', 'shephard'], 'creature', 'spawn_snarks', 5, 120, '#ffa15a', {
    reference: 'https://github.com/ValveSoftware/halflife/blob/master/dlls/squeakgrenade.cpp',
    source: 'Valve Half-Life SDK, CSqueakGrenade; project containment-case item',
    // Bites and a final blast. The caster is not magically immune to that blast.
    friendlyBlastRadius: 90, friendlyBlastDamage: 18
  }),
  evt_portal_cube: record('Portal', ['chell', 'atlas', 'pbody'], 'barrier', 'companion_shield', 1, 0, '#edaacb', {
    shield: 200, targetSide: 'ally', note: 'Protective cover is the existing Nexus item adaptation, not a native healing spell.'
  }),

});
export const isSignatureCombatant = actor => !!actor && actor.nonCombat !== true
  && actor.combatEnabled !== false && actor.combatEligible !== false && !actor.nonCombatTrial;
export const signatureActorId = actor => actor?.sourceId || actor?.id;
export const signatureUniverse = actor => actor?.sourceUniverse || actor?.universe;

export function resolveSignatureInvocation(event, actor) {
  const definition = event && Object.hasOwn(SIGNATURE_INVOCATIONS, event.id) ? SIGNATURE_INVOCATIONS[event.id] : null;
  if (!definition || !isSignatureCombatant(actor)
    || event.effect !== definition.effect || signatureUniverse(actor) !== definition.universe
    || !definition.actors.includes(signatureActorId(actor))) return null;
  return { ...definition, id: event.id, name: event.name, icon: event.icon || null };
}

// Inherited actions never gain an invented name, family spell or damage type.
// Whether the inherited kit is actually source-faithful remains a separate audit.
export function describeNativeSignature(actor, abilityType = 'special') {
  const action = actor?.[abilityType];
  if (!isSignatureCombatant(actor) || !action || typeof action !== 'object'
    || typeof action.name !== 'string' || !action.name.trim()
    || !Number.isFinite(action.dmg) || action.dmg < 0) return null;
  const source = abilityType === 'special' && action.sourceSignatureKey ? resolveSourceSignature(actor) : null;
  return { id: `${signatureUniverse(actor)}::${signatureActorId(actor) || actor.canonicalName || actor.name}::${abilityType}`,
    name: { fr: action.name, en: action.name }, universe: signatureUniverse(actor),
    kind: source?.kind || (['summon', 'summon_aoe'].includes(action.type) ? 'summon' : 'personal'), action,
    fidelity: source?.fidelity || (actor.originalContent || actor.contentOrigin === 'project-original' ? 'project-original' : 'inherited-unverified'),
    color: action.color || actor.secondaryColor || actor.color || '#39c5bb',
    windupTicks: source?.windupTicks ?? 18, revealTicks: source?.revealTicks ?? 24, hitGapTicks: source?.hitGapTicks ?? 1, hits: source?.hits ?? 1, outroTicks: source?.outroTicks ?? 26 };
}
