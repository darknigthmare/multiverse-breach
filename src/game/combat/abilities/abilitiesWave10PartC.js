import { buff, defend, heal, shot } from './rules.js';
const special = (action, color) => ({ ...action, color, animationDuration: 1.1, hitAt: 0.451, meterCost: 100 });
const kit = (sourceHeroId, sourceReference, simple, secondary, defense, superAction) => ({
  sourceHeroId, universe: 'Payday', sourceWork: 'PAYDAY 2 (2013), selected player loadout',
  sourceUrl: 'https://www.paydaythegame.com/payday2/updates/', sourceReference,
  identityBasis: 'canonical-role', canonicalVerified: false, networkVerified: false, gameplayAdaptation: true,
  simple, secondary: { cd: 6, ...secondary }, defense, special: superAction
});
export const ABILITIES_WAVE10_PART_C = Object.freeze({
  dallas: kit('dallas',
    'Dallas wears his American-pattern clown mask in PAYDAY2. Select the available AMCAR rifle loadout. Medical equipment is finite player equipment, not innate healing. The thermal-drill quotation describes a mission tool and is not a damaging ultimate; his super is a bounded ordinary ammunition volley.',
    shot('Tir d’AMCAR de Dallas', 1.1), buff('Repérer l’accès de Dallas', { targetSide: 'self', shape: 'single', range: 1, duration: 3, buffMultiplier: 1.15 }),
    heal('Sac de soins de Dallas', { targetSide: 'ally', shape: 'single', healRatio: 0.2 }),
    special(shot('Rafale d’AMCAR de Dallas', 4.6, { range: 640 }), '#9eb8cf')),
  wolf_pd: kit('wolf_pd',
    'PAYDAY2 Wolf uses his own white mask with red markings, never Dallas’ American flag. The selected AK rifle is a player loadout. A drill restart or the Panic Room heist title is not an area blast. Personal armor cover protects Wolf; the actual held rifle fires normal rounds.',
    shot('Tir d’AK de Wolf', 1.1), buff('Contrôle technique de Wolf', { targetSide: 'self', shape: 'single', range: 1, duration: 3, buffMultiplier: 1.15 }),
    defend('Couvert personnel de Wolf', 0.5), special(shot('Rafale d’AK de Wolf', 4.7, { range: 640 }), '#d3b9ab')),
  hoxton: kit('hoxton',
    'PAYDAY2 original British James Hoxworth after Hoxton Breakout2014, Hoxton Reborn damaged pink/white mask. This is not Houston, who used the earlier Hoxton identity. Select available akimbo Bernetti9 pistols as a player loadout; they are not exclusive innate character weapons. ECM and a heist title do not explode enemies.',
    shot('Akimbo Bernetti 9 de Hoxton', 1.1), buff('Ajuster le tir de Hoxton', { targetSide: 'self', shape: 'single', range: 1, duration: 3, buffMultiplier: 1.15 }),
    defend('Esquive personnelle de Hoxton', 0.45), special(shot('Double tir de Hoxton', 4.5, { range: 620 }), '#c3a0af'))
});
const revision = (universe, sourceWork, versionNote, extra = {}) => ({ universe, sourceWork, versionNote, ...extra });
export const ABILITY_REVISIONS_WAVE10_PART_C = Object.freeze({
  hicks_aliens: revision('Aliens', 'Aliens (1986), Corporal Dwayne Hicks', 'Michael Biehn likeness selected: human Colonial Marine, M41A pulse rifle and backup shotgun. Keep the existing physical burst; never infer laser/alien anatomy from the weapon name.'),
  vasquez_aliens: revision('Aliens', 'Aliens (1986), Private Jenette Vasquez', 'Jenette Goldstein likeness selected, red bandanna and physically harness-supported M56 Smartgun. The forward cone is a bounded adaptation of a physical suppressive burst, not a magical global enemy attack.', { special: special(shot('M56 Smartgun de Vasquez', 4.8, { range: 650, shape: 'cone', coneAngle: 45, maxTargets: 5 }), '#c6ad85') }),
  bishop_aliens: revision('Aliens', 'Aliens (1986), Bishop synthetic', 'Lance Henriksen likeness selected in plain utility coveralls, no Marine armor or Apone substitution. Keep support systems/medical preparation and second-dropship extraction as allied guard. Radio coordination only in these native poses; no invented gun, eye laser, dropship body or hostile synthetic power.'),
  ripley_aliens: revision('Aliens', 'Aliens (1986), human Ellen Ripley', 'Sigourney Weaver likeness selected, ordinary human body and M41A/flamethrower rescue equipment. P5000 super/finale uses the full real yellow open-frame work loader with visible human operator; no transplanted xenomorph arm or later Alien Resurrection clone biology.'),
  hudson_aliens: revision('Aliens', 'Aliens (1986), Private William Hudson', 'Bill Paxton likeness selected with human Marine kit, M41A and motion tracker. Existing super is allied communication/target-awareness buff, not the Game Over quote as a damaging attack. No Apone body or mounted minigun substitution.'),
  chains_pd: revision('Payday', 'PAYDAY 2 (2013), Chains with selected KSP loadout', 'Select the actual available KSP light-machine-gun player loadout and Chains’ own white/blue/red mask, dark suit and vest. Heavy cover fire remains conventional bullets, not a heist-name explosion or exclusive supernatural Enforcer power.'),
  clover_pd: revision('Payday', 'PAYDAY 2 (2013), Clover Character Pack (2014)', 'Irish Clover uses her white/green default mask and the real Queen’s Wrath rifle from her2014 pack, carried safely during support. Preserve route observation and team stealth guard as bounded tactical communication adaptations. No fake healing spray, cloak spell, shared innate invisibility or damaging support animation.')
});
