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
  heal: 'heal', heal_aoe: 'heal', shield: 'guard', shield_aoe: 'guard', guard: 'guard', dodge: 'guard',
  dash: 'dash', teleport: 'teleport', dodge_strike: 'counter', buff: 'buff', tactical: 'buff',
  support: 'support', support_aoe: 'support', summon: 'summon', summon_aoe: 'summon',
  trap: 'mine', trap_aoe: 'mine',
  hack: 'control', control: 'control', debuff: 'control', confuse: 'control',
  taunt: 'control', fear: 'control', flash: 'control', status: 'control',
  signature: 'focus', ability: 'focus', spirit: 'focus', darkness: 'focus', sound: 'focus',
  music: 'focus', glitch: 'focus', gravity: 'focus', force: 'focus', radiation: 'focus',
  temporal_aoe: 'control_pulse', time_aoe: 'control_pulse', hack_aoe: 'control_pulse',
  shrink_aoe: 'control_pulse', fear_aoe: 'control_pulse', mind_aoe: 'control_pulse',
  area: 'pulse', nexus_aoe: 'pulse', origin_aoe: 'pulse', glitch_aoe: 'pulse', magic_aoe: 'pulse',
  fire_aoe: 'pulse', dark_aoe: 'pulse', gravity_aoe: 'pulse', ritual_aoe: 'pulse',
  explosive_aoe: 'pulse', plasma_aoe: 'pulse', energy_aoe: 'pulse', light_aoe: 'pulse',
  science_aoe: 'pulse', gadget_aoe: 'pulse', sound_aoe: 'pulse', horror_aoe: 'pulse',
  music_aoe: 'pulse', airstrike_aoe: 'pulse', water_aoe: 'pulse', earth_aoe: 'pulse',
  force_aoe: 'pulse', vortex: 'pulse', portal_vortex: 'pulse'
});

export const EXTINCTION_SOURCE_DELIVERY_TYPES = Object.freeze(Object.keys(DELIVERY));

// Closed bindings for sixteen source-selected physical firearms. Thirteen
// retain pre-projection ammunition, Chief repairs an older adapter regression,
// and Baird/Kait intentionally replace their old energy/contact abstractions.
// Arbitrary projectiles, energy weapons and custom profiles remain distinct.
const BALLISTIC_SOURCE_BINDINGS = Object.freeze({
  marcus: { universe: "Gears of War", name: "Marcus Fenix",
    incarnation: "Gears of War 2 (2008), Marcus Fenix in original Delta Squad armor", marker: "sourceFidelityAudit",
    revision: "gears-deadspace-040-2026-11-13", referenceUrl: "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Marcus_Fenix",
    weaponType: "chainsaw", equipment: "Lancer Mk2 assault rifle with chainsaw bayonet",
    actionName: "Lancer Fire", damage: 1,
    range: 640, actorAbilityMetadata: true },
  masterchief: { universe: "Halo", name: "Master Chief",
    incarnation: "Halo 3", marker: "sourceContractRevision",
    revision: "scifi-lot-040-2026-11-13", referenceUrl: "https://www.halopedia.org/John-117",
    weaponType: "gun", equipment: "MA5C assault rifle",
    actionName: "Rafale du MA5C", damage: 1.2,
    range: 480 },
  dom: { universe: "Gears of War", name: "Dom Santiago",
    incarnation: "Gears of War 2 (2008), Dominic Santiago in Delta Squad armor", marker: "sourceFidelityAudit",
    revision: "gears-deadspace-040-2026-11-13", referenceUrl: "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Dominic_Santiago",
    weaponType: "gun", equipment: "Lancer Mk2",
    actionName: "Lancer Cover Fire", damage: 1,
    range: 640, actorAbilityMetadata: true },
  cole: { universe: "Gears of War", name: "Augustus Cole",
    incarnation: "Gears of War 2 (2008), Augustus Cole in original Delta Squad armor", marker: "sourceFidelityAudit",
    revision: "gears-deadspace-040-2026-11-13", referenceUrl: "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Augustus_Cole",
    weaponType: "gun", equipment: "Lancer Mk2",
    actionName: "Tir de Lancer de Cole", damage: 1.1,
    range: 640, actorAbilityMetadata: true },
  anya_stroud: { universe: "Gears of War", name: "Anya Stroud",
    incarnation: "Gears of War 3 (2011), Anya Stroud in frontline COG armor", marker: "sourceFidelityAudit",
    revision: "gears-deadspace-040-2026-11-13", referenceUrl: "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Anya_Stroud",
    weaponType: "gun", equipment: "Lancer Mk2",
    actionName: "Tir du Lancer Mk2 d’Anya", damage: 1.15,
    range: 480, actorAbilityMetadata: true },
  hoffman_cog: { universe: "Gears of War", name: "Colonel Hoffman",
    incarnation: "Gears of War 2 (2008), Colonel Victor Hoffman during the Jacinto defense", marker: "sourceFidelityAudit",
    revision: "gears-deadspace-040-2026-11-13", referenceUrl: "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Victor_Hoffman",
    weaponType: "gun", equipment: "Physical COG service firearm",
    actionName: "Arme de service du colonel Hoffman", damage: 1.2,
    range: 480, actorAbilityMetadata: true },
  carmine_cog: { universe: "Gears of War", name: "Carmine",
    incarnation: "Gears of War 3 (2011), specifically adult Clayton Carmine", marker: "sourceFidelityAudit",
    revision: "gears-deadspace-040-2026-11-13", referenceUrl: "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Carmine_family",
    weaponType: "gun", equipment: "Lancer Mk2",
    actionName: "Tir du Lancer de Clayton", damage: 1.15,
    range: 480, actorAbilityMetadata: true },
  carver: { universe: "Dead Space", name: "John Carver",
    incarnation: "Dead Space 3 (2013), John Carver in military RIG", marker: "sourceFidelityAudit",
    revision: "gears-deadspace-040-2026-11-13", referenceUrl: "https://en.wikipedia.org/wiki/Dead_Space_3",
    weaponType: "gun", equipment: "Physical modular military rifle",
    actionName: "Tir du fusil militaire de Carver", damage: 1.2,
    range: 600, actorAbilityMetadata: true },
  ellie: { universe: "Dead Space", name: "Ellie Langford",
    incarnation: "Dead Space 2 (2011), Ellie Langford in civilian pilot workwear", marker: "sourceFidelityAudit",
    revision: "gears-deadspace-040-2026-11-13", referenceUrl: "https://en.wikipedia.org/wiki/Dead_Space_2",
    weaponType: "gun", equipment: "Physical rifle used for cover",
    actionName: "Tir du fusil d’Ellie", damage: 1.1,
    range: 560, actorAbilityMetadata: true },
  zach_hammond: { universe: "Dead Space", name: "Zach Hammond",
    incarnation: "Dead Space (2008), security chief Zach Hammond", marker: "sourceFidelityAudit",
    revision: "gears-deadspace-040-2026-11-13", referenceUrl: "https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)",
    weaponType: "gun", equipment: "SWS Motorized Pulse Rifle",
    actionName: "Tir du Pulse Rifle de Hammond", damage: 1,
    range: 480, actorAbilityMetadata: true },
  bill_l4d: { universe: "Left 4 Dead", name: "Bill",
    incarnation: "Left 4 Dead (2008), Bill in his original Vietnam-veteran survivor outfit", marker: "sourceContractRevision",
    revision: "portal-l4d-040-2026-11-13", referenceUrl: "https://store.steampowered.com/app/500/Left_4_Dead/",
    weaponType: "gun", equipment: "Assault Rifle",
    actionName: "Rafale de vétéran de Bill", damage: 1.2,
    range: 480 },
  ellis_l4d: { universe: "Left 4 Dead", name: "Ellis",
    incarnation: "Left 4 Dead 2 (2009), Ellis in the original mechanic survivor outfit", marker: "sourceContractRevision",
    revision: "portal-l4d-040-2026-11-13", referenceUrl: "https://store.steampowered.com/app/550/Left_4_Dead_2/",
    weaponType: "gun", equipment: "Ordinary survivor firearm",
    actionName: "Tir de survie d’Ellis", damage: 1.2,
    range: 480 },
  coach_l4d: { universe: "Left 4 Dead", name: "Coach",
    incarnation: "Left 4 Dead 2 (2009), Coach in the original school-coach survivor outfit", marker: "sourceContractRevision",
    revision: "portal-l4d-040-2026-11-13", referenceUrl: "https://store.steampowered.com/app/550/Left_4_Dead_2/",
    weaponType: "gun", equipment: "Ordinary survivor firearm",
    actionName: "Tir du survivant Coach", damage: 1.2,
    range: 480 },
  nick_l4d: { universe: "Left 4 Dead", name: "Nick",
    incarnation: "Left 4 Dead 2 (2009), Nick in the original gambler survivor outfit", marker: "sourceContractRevision",
    revision: "portal-l4d-040-2026-11-13", referenceUrl: "https://store.steampowered.com/app/550/Left_4_Dead_2/",
    weaponType: "gun", equipment: "Standard survivor pistols",
    actionName: "Premier pistolet de Nick", damage: 1.2,
    range: 480 },
  baird: { universe: "Gears of War", name: "Damon Baird",
    incarnation: "Gears of War 2 (2008), young Damon Baird in COG field armor", marker: "sourceFidelityAudit",
    revision: "gears-deadspace-040-2026-11-13", referenceUrl: "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Damon_Baird",
    weaponType: "gun", equipment: "Lancer Mk2",
    actionName: "Tir du Lancer de Baird", damage: 1.2,
    range: 480, actorAbilityMetadata: true },
  kait_diaz: { universe: "Gears of War", name: "Kait Diaz",
    incarnation: "Gears 5 (2019), adult Kait in the winter COG field outfit", marker: "sourceFidelityAudit",
    revision: "gears-deadspace-040-2026-11-13", referenceUrl: "https://en.wikipedia.org/wiki/List_of_Gears_of_War_characters#Kait_Diaz",
    weaponType: "gun", equipment: "Lancer Mk3",
    actionName: "Tir du Lancer Mk3 de Kait", damage: 1.15,
    range: 480, actorAbilityMetadata: true }
});
function selectedBallisticSource(hero, slot, source) {
  const binding = Object.hasOwn(BALLISTIC_SOURCE_BINDINGS, hero?.id) ? BALLISTIC_SOURCE_BINDINGS[hero.id] : null;
  if (slot !== 'simple' || !binding || hero.universe !== binding.universe || hero.name !== binding.name
    || hero.incarnation !== binding.incarnation || hero[binding.marker] !== binding.revision
    || hero.referenceUrl !== binding.referenceUrl || hero.weaponType !== binding.weaponType
    || !Array.isArray(hero.equipment) || !hero.equipment.includes(binding.equipment)) return false;
  const keys = ['name', 'type', 'dmg', 'animationDuration', 'hitAt', 'targeting',
    ...(binding.actorAbilityMetadata ? ['slot', 'sourceHeroId'] : [])];
  if (Object.keys(source).length !== keys.length || !keys.every(key => Object.hasOwn(source, key))
    || source.type !== 'projectile' || source.name !== binding.actionName || source.dmg !== binding.damage
    || source.animationDuration !== 0.55 || source.hitAt !== 0.2
    || binding.actorAbilityMetadata && (source.slot !== 'simple' || source.sourceHeroId !== hero.id)) return false;
  const targeting = source.targeting;
  return targeting && Object.keys(targeting).length === 5
    && Object.hasOwn(targeting, 'effect') && targeting.effect === 'damage'
    && Object.hasOwn(targeting, 'delivery') && targeting.delivery === 'projectile'
    && Object.hasOwn(targeting, 'shape') && targeting.shape === 'single'
    && Object.hasOwn(targeting, 'range') && targeting.range === binding.range
    && Object.hasOwn(targeting, 'targetSide') && targeting.targetSide === 'enemy';
}

export function adaptExtinctionSourceAction(hero, slot) {
  const source = hero?.[slot];
  if (!source || typeof source !== 'object' || typeof source.type !== 'string' || !Object.hasOwn(DELIVERY, source.type)) return null;
  // Explicit delivery on the source action is stronger than a generic type.
  const explicit = Object.assign({}, source.targeting, source.attackProfile, source.rpgProfile);
  const declared = explicit.delivery;
  const beneficial = ['guard', 'buff', 'heal', 'support'].includes(explicit.effect) ? explicit.effect : null;
  const ballistic = selectedBallisticSource(hero, slot, source);
  const kind = beneficial || (ballistic ? 'hitscan'
    : ['signature', 'ability', 'origin_aoe'].includes(source.type) && declared === 'melee'
      ? (explicit.shape === 'aoe' ? 'sweep' : 'melee') : DELIVERY[source.type]);
  const contact = ['melee', 'sweep', 'counter'].includes(kind);
  const control = ['control', 'control_pulse'].includes(kind);
  const ammo = slot === 'simple' && (ballistic || ['bullet', 'shotgun'].includes(source.type));
  const generic = GENERIC_NAME.test(text(source.name)) || ['signature', 'origin_aoe', 'ability'].includes(source.type);
  const duration = Math.round(clamp(finite(explicit.duration ?? source.duration ?? source.dur, control ? 2 : 3), 0.2, 8) * 60);
  const sourceRange = contact ? (slot === 'simple' ? 2.3 : 3.2)
    : ['cone', 'scatter'].includes(kind) ? 9 : ['pulse', 'control_pulse', 'focus'].includes(kind) ? 8 : 24;
  return Object.freeze({
    slot, name: copy(source.name), sourceType: source.type, kind,
    cooldown: slot === 'simple' ? (contact ? 26 : control ? 45 : 20)
      : slot === 'defense' ? Math.max(360, duration + 60)
        : Math.round(clamp(finite(source.cd ?? source.cooldown, slot === 'special' ? 12 : 7), 1, 60) * 60),
    duration, reduction: clamp(finite(explicit.reduce ?? source.reduce, 0.6), 0, 0.95),
    damage: control || ['guard', 'buff', 'heal', 'support'].includes(kind) ? 0 : Math.round(28 * clamp(finite(source.dmg, 1), 0.1, 8)),
    range: getExtinctionActionReach({ kind, range: sourceRange }).value,
    color: source.color || hero.secondaryColor || hero.primaryColor || '#39c5bb',
    resource: ammo ? 'ammo' : 'cooldown',
    splash: ['rocket', 'projectile_aoe', 'cannon_aoe'].includes(source.type) ? 2.2 : 0,
    sourcePath: `${hero.isPlayer ? 'src/game/playerHero.js' : 'src/game/heroes.js'}#${hero.id}.${slot}`,
    sourceReference: hero.referenceUrl || hero.referenceUrls?.[0] || '',
    adaptationStatus: generic ? 'GENERIC_SOURCE_REVIEW_REQUIRED' : 'SOURCE_TYPE_ADAPTED',
    sourceDelivery: declared || null,
    sourcePresentation: source.canonPresentation?.kind || null,
    ...(ballistic ? { sourceBallisticCompatibility: 'exact-source-firearm-projectile-to-FPS-hitscan' } : {})
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
