/** Source-backed FPS adapters. This is game tuning, never a canon/art certificate.
 * The twelve authored Nexus kits always win; the remaining catalog uses explicit
 * shared delivery rules. Nothing here grants ownership or mutates hero records.
 */
import { EXTINCTION_SIGNATURE_SLOTS, getExtinctionSignature, getExtinctionActionReach } from './extinctionSignatures.js';
import { getExtinctionViewmodel, isExtinctionCombatant } from './extinctionContent.js';

const finite = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const text = value => typeof value === 'string' ? value : value?.fr || value?.en || '';
const copy = value => value && typeof value === 'object' ? { ...value } : value;
const GENERIC_NAME = /signature strike|breach technique|origin burst|signature action|signature technique|defensive action|decisive action/i;
const EVASION_CHARGE = Object.freeze({ kind: 'evasion', gain: 20, threatRange: 3,
  minimumTravel: 1, minimumSeparationGain: 1,
  rule: Object.freeze({
    fr: 'Ultime : utilise le déplacement principal pour t’éloigner d’une menace située à trois unités maximum. Parcours au moins une unité et gagne une unité d’écart pour obtenir 20 de charge. Cinq esquives réussies remplissent la jauge.',
    en: 'Ultimate: use your primary movement to escape a threat within three units. Move at least one unit and gain one unit of separation to earn 20 charge. Five successful evasions fill the gauge.'
  }) });
const DELIVERY = Object.freeze({
  melee: 'melee', melee_aoe: 'sweep', drill_smash: 'sweep',
  bullet: 'hitscan', bullet_aoe: 'volley', shotgun: 'scatter', shotgun_aoe: 'scatter',
  projectile: 'projectile', plasma: 'projectile', energy: 'projectile', magic: 'projectile',
  water: 'projectile', rocket: 'projectile', projectile_aoe: 'projectile', cannon_aoe: 'projectile',
  beam: 'beam', beam_aoe: 'beam', laser: 'beam', zap: 'beam', shrink: 'control',
  fire: 'cone', spray: 'cone', poison: 'cone',
  heal: 'heal', heal_aoe: 'heal', shield: 'guard', shield_aoe: 'guard', dodge: 'guard',
  dash: 'dash', teleport: 'teleport', dodge_strike: 'counter', buff: 'buff', tactical: 'buff',
  support: 'support', support_aoe: 'support', summon: 'summon', summon_aoe: 'summon',
  trap: 'mine', trap_aoe: 'mine',
  hack: 'control', control: 'control', debuff: 'control', confuse: 'control',
  taunt: 'control', fear: 'control', flash: 'control', status: 'control',
  signature: 'focus', ability: 'focus', spirit: 'focus', darkness: 'focus', sound: 'focus',
  music: 'focus', glitch: 'focus', gravity: 'focus', force: 'focus', radiation: 'focus',
  temporal_aoe: 'control_pulse', time_aoe: 'control_pulse', hack_aoe: 'control_pulse',
  shrink_aoe: 'control_pulse', fear_aoe: 'control_pulse', mind_aoe: 'control_pulse',
  nexus_aoe: 'pulse', origin_aoe: 'pulse', glitch_aoe: 'pulse', magic_aoe: 'pulse',
  fire_aoe: 'pulse', dark_aoe: 'pulse', gravity_aoe: 'pulse', ritual_aoe: 'pulse',
  explosive_aoe: 'pulse', plasma_aoe: 'pulse', energy_aoe: 'pulse', light_aoe: 'pulse',
  science_aoe: 'pulse', gadget_aoe: 'pulse', sound_aoe: 'pulse', horror_aoe: 'pulse',
  music_aoe: 'pulse', airstrike_aoe: 'pulse', water_aoe: 'pulse', earth_aoe: 'pulse',
  force_aoe: 'pulse', vortex: 'pulse', portal_vortex: 'pulse'
});

export const EXTINCTION_SOURCE_DELIVERY_TYPES = Object.freeze(Object.keys(DELIVERY));

export function adaptExtinctionSourceAction(hero, slot) {
  const source = hero?.[slot];
  if (!source || typeof source !== 'object' || !DELIVERY[source.type]) return null;
  // Explicit delivery on the source action is stronger than a generic type.
  const declared = source.attackProfile?.delivery;
  const kind = ['signature', 'ability', 'origin_aoe'].includes(source.type) && declared === 'melee'
    ? (source.attackProfile?.shape === 'aoe' ? 'sweep' : 'melee') : DELIVERY[source.type];
  const contact = ['melee', 'sweep', 'counter'].includes(kind);
  const control = ['control', 'control_pulse'].includes(kind);
  const ammo = slot === 'simple' && ['bullet', 'shotgun'].includes(source.type);
  const generic = GENERIC_NAME.test(text(source.name)) || ['signature', 'origin_aoe', 'ability'].includes(source.type);
  const duration = Math.round(clamp(finite(source.dur, control ? 2 : 3), 0.2, 8) * 60);
  const sourceRange = contact ? (slot === 'simple' ? 2.3 : 3.2)
    : ['cone', 'scatter'].includes(kind) ? 9 : ['pulse', 'control_pulse', 'focus'].includes(kind) ? 8 : 24;
  return Object.freeze({
    slot, name: copy(source.name), sourceType: source.type, kind,
    cooldown: slot === 'simple' ? (contact ? 26 : control ? 45 : 20)
      : slot === 'defense' ? Math.max(360, duration + 60)
        : Math.round(clamp(finite(source.cd ?? source.cooldown, slot === 'special' ? 12 : 7), 1, 60) * 60),
    duration, reduction: clamp(finite(source.reduce, 0.6), 0, 0.95),
    damage: control ? 0 : Math.round(28 * clamp(finite(source.dmg, 1), 0.1, 8)),
    range: getExtinctionActionReach({ kind, range: sourceRange }).value,
    color: source.color || hero.secondaryColor || hero.primaryColor || '#39c5bb',
    resource: ammo ? 'ammo' : 'cooldown',
    splash: ['rocket', 'projectile_aoe', 'cannon_aoe'].includes(source.type) ? 2.2 : 0,
    sourcePath: `${hero.isPlayer ? 'src/game/playerHero.js' : 'src/game/heroes.js'}#${hero.id}.${slot}`,
    sourceReference: hero.referenceUrl || hero.referenceUrls?.[0] || '',
    adaptationStatus: generic ? 'GENERIC_SOURCE_REVIEW_REQUIRED' : 'SOURCE_TYPE_ADAPTED',
    sourceDelivery: declared || null,
    sourcePresentation: source.canonPresentation?.kind || null
  });
}

/** Player-facing instructions use the same effective reach as the runtime. */
export function getExtinctionPrimaryInstruction(action, lang = 'fr') {
  if (!action) return '';
  const fr = lang === 'fr', reach = getExtinctionActionReach(action);
  const value = fr ? String(reach.value).replace('.', ',') : String(reach.value);
  if (reach.kind === 'movement') return fr
    ? `Déplacement principal : jusqu’à ${value} unités dans la direction du regard, dans les limites de l’arène.`
    : `Primary movement: up to ${value} units in your viewing direction, within the arena boundaries.`;
  if (reach.kind === 'self') return fr ? 'Action personnelle : agit sur toi, sans cible à viser.' : 'Personal action: affects you, with no target to aim at.';
  if (reach.kind === 'anchor') return fr ? 'Pose un point de retour à ta position.' : 'Place a return point at your position.';
  if (reach.kind === 'placement') return fr
    ? `Pose un piège jusqu’à ${value} unités devant toi. Son effet atteint les menaces dans un rayon de ${String(reach.effectRadius).replace('.', ',')} unités.`
    : `Place a trap up to ${value} units ahead. Its effect reaches threats within a ${reach.effectRadius}-unit radius.`;
  if (reach.kind === 'support-radius') return fr
    ? `Pose un soutien à ta position. Il agit sur les menaces dans un rayon de ${value} unités.`
    : `Place a support at your position. It affects threats within a ${value}-unit radius.`;
  if (reach.kind === 'radius') return fr
    ? `Action de zone : agit sur les menaces dans un rayon de ${value} unités autour de toi.`
    : `Area action: affects threats within a ${value}-unit radius around you.`;
  if (action.kind === 'control') return fr
    ? `Vise une menace à moins de ${value} unités pour la ralentir. Une application réussie charge l’ultime.`
    : `Aim at a threat within ${value} units to slow it. A successful application charges the ultimate.`;
  if (reach.kind === 'contact') return fr
    ? `Action de contact : approche à moins de ${value} unités et garde la cible devant toi.`
    : `Contact action: move within ${value} units and keep the target in front of you.`;
  return fr ? `Action principale : portée ${value} unités. Vise avec la souris ou en glissant sur la vue.`
    : `Primary action: range ${value} units. Aim with the mouse or by dragging the view.`;
}

/** JSON-serializable catalog/runtime API, including peaceful characters. */
export function getExtinctionFighterProfile(hero) {
  const eligible = isExtinctionCombatant(hero);
  const authored = eligible ? getExtinctionSignature(hero) : null;
  const view = getExtinctionViewmodel(hero);
  const sourceEquipment = Array.isArray(hero?.equipment) ? hero.equipment : [];
  const equipment = sourceEquipment.filter(item => text(item)).map(item => ({ label: copy(item), provenance: 'hero.equipment' }));
  if (!equipment.length && text(hero?.weapon)) equipment.push({ label: copy(hero.weapon), provenance: 'hero.weapon' });
  if (!equipment.length && text(hero?.weaponType)) equipment.push({ label: hero.weaponType, provenance: 'hero.weaponType', reviewRequired: true });
  const actions = {};
  if (eligible && !authored) for (const slot of EXTINCTION_SIGNATURE_SLOTS) {
    const action = adaptExtinctionSourceAction(hero, slot);
    if (action) actions[slot] = action;
  }
  // The source currently contains exactly three dash/buff/guard mobility kits.
  // They cannot earn damage charge before their first ultimate. Credit an
  // actual escape from a nearby threat, never a button press or an empty dash.
  const evasionCharge = !authored && actions.simple?.kind === 'dash'
    && actions.secondary?.kind === 'buff' && actions.defense?.kind === 'guard';
  const signature = authored || (eligible && Object.keys(actions).length ? Object.freeze({
    heroId: hero.id, actions: Object.freeze(actions), status: 'SOURCE_ADAPTED_ART_PENDING',
    ...(evasionCharge ? { ultimateCharge: EVASION_CHARGE } : {})
  }) : null);
  const generic = Object.values(actions).some(action => action.adaptationStatus === 'GENERIC_SOURCE_REVIEW_REQUIRED');
  const primary = signature?.actions.simple;
  const resource = primary?.resource || (primary?.kind === 'melee' ? 'cooldown' : 'ammo');
  return {
    heroId: hero?.id || '', eligible, name: hero?.name || '', universe: hero?.universe || '',
    source: { path: hero?.isPlayer ? 'src/game/playerHero.js' : 'src/game/heroes.js',
      incarnation: hero?.incarnation || '', referenceUrls: [...new Set([hero?.referenceUrl, ...(hero?.referenceUrls || [])].filter(Boolean))],
      identityType: hero?.entityType || hero?.sourceIdentityType || '', canonStatus: hero?.canonStatus || '',
      originalContent: hero?.originalContent === true, visualAnchor: text(hero?.visualAnchor),
      morphologyStatus: hero?.visualAnchor ? 'SOURCE_DESCRIPTION_NOT_MODEL' : 'MORPHOLOGY_REVIEW_REQUIRED' },
    equipment, signature,
    ultimateCharge: !eligible ? { kind: 'none', rule: { fr: 'Hors combat.', en: 'Outside combat.' } }
      : evasionCharge ? EVASION_CHARGE : { kind: 'damage-and-control', rule: {
        fr: 'Charge obtenue sur les dégâts réels et les contrôles réussis ; l’ultime ne se recharge pas lui-même.',
        en: 'Charge comes from actual damage and successful control effects; the ultimate cannot recharge itself.' } },
    resource: { kind: eligible ? resource : 'none',
      status: !eligible ? 'OUTSIDE_FPS' : authored ? 'EXISTING_AUTHORED_RUNTIME' : 'GAME_BALANCE_ADAPTATION',
      reload: eligible && resource === 'ammo' },
    view: { ...view, ownerId: hero?.id || '',
      artStatus: !eligible ? 'OUTSIDE_FPS' : view.src ? 'EXACT_OWNER_PARTIAL_ART_REVIEW_REQUIRED' : 'SCHEMATIC_ART_PENDING',
      schematicKind: primary?.kind || 'none', morphologyInferred: false },
    reviewStatus: !eligible ? 'NON_COMBAT_PRESERVED' : authored ? 'AUTHORED_KIT_ART_PENDING'
      : Object.keys(actions).length < 4 ? 'UNSUPPORTED_SOURCE_ACTION'
        : generic ? 'GENERIC_SOURCE_REVIEW_REQUIRED' : 'SOURCE_TYPE_ADAPTED_ART_PENDING'
  };
}

/** A pickup never refills the personal kit. Store it exactly once before swapping. */
export function rememberExtinctionPersonalKit(state) {
  if (state?.phase !== 'running' || state.weapon?.type !== 'pistol' || !state.protocols?.profile
    || state.protocols.ownerId !== state.heroId || state.protocols.runId !== state.runId
    || !Number.isSafeInteger(state.t) || state.t < 0) return false;
  state.personalKit = { heroId: state.heroId, runId: state.runId, weapon: { ...state.weapon }, reserveAmmo: state.reserveAmmo,
    storedAtTick: state.t, reloadReadyAtTick: state.t + Math.max(0, finite(state.reloadPulse, 0)) };
  return true;
}

export function restoreExtinctionPersonalKit(state) {
  const kit = state?.personalKit;
  if (state?.phase !== 'running' || state.paused || !kit || state.weapon?.type === 'pistol'
    || kit.heroId !== state.heroId || kit.runId !== state.runId
    || state.protocols?.ownerId !== state.heroId || state.protocols?.runId !== state.runId
    || !Number.isSafeInteger(state.t) || !Number.isSafeInteger(kit.storedAtTick) || !Number.isFinite(kit.reloadReadyAtTick)
    || state.t < kit.storedAtTick || kit.reloadReadyAtTick < kit.storedAtTick) return false;
  state.weapon = { ...kit.weapon }; state.ammo = state.weapon.ammo;
  state.maxAmmo = state.weapon.maxAmmo; state.reserveAmmo = kit.reserveAmmo;
  state.reloadPulse = Math.max(0, kit.reloadReadyAtTick - state.t); state.personalKit = null;
  return true;
}
