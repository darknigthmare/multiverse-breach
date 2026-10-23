import { buff, defend, hit, shot } from './rules.js';

const kit = (sourceHeroId, sourceWork, sourceReference, simple, secondary, defense, special) => ({
  sourceHeroId, universe: 'Metal Gear', sourceWork, sourceReference,
  identityBasis: 'explicit-source-loadout', canonicalVerified: false, networkVerified: false,
  gameplayAdaptation: true, simple, secondary: { cd: 6, ...secondary }, defense,
  special: { ...special, animationDuration: 1.1, hitAt: 0.451, meterCost: 100 }
});

// These previously named commands had no authored targeting/effect records.
// Their source roles govern the effects; all numerical timings remain adapted.
export const ABILITIES_WAVE6 = Object.freeze({
  snake: kit('snake', 'Metal Gear Solid (1998)',
    'Adult Solid Snake uses the SOCOM Mk23, Nikita and cardboard box. His unarmed punch/punch/kick combo is condensed into one contact impact. Advanced CQC of other protagonists/eras and damaging chaff are not added.',
    shot('Tir du SOCOM Mk23', 1),
    shot('Nikita Missile', 1.9, { shape: 'area', areaRadius: 80 }),
    defend('Cardboard Box', 0.4),
    { ...hit('Combo de coups de Snake', 5.1, { range: 170 }), color: '#a8b8c8' }),
  raiden: kit('raiden', 'Metal Gear Rising: Revengeance (2013)',
    'Cyborg Raiden uses a high-frequency blade, Ninja Run and physical parry. Zandatsu Overdrive is the project label for an adapted close blade sequence: no instant kill, life extraction or distant area strike is implied.',
    hit('Taille de la lame haute fréquence', 1),
    hit('Ninja Run Slash', 1.8, { range: 145 }),
    defend('Parry Stance', 0.55),
    { ...hit('Zandatsu Overdrive', 4.6, { range: 170 }), color: '#a2dfff' }),
  otacon: kit('otacon', 'Metal Gear Solid (1998) / Metal Gear Solid 2 (2001)',
    'Hal Emmerich provides Codec, technical analysis and later Philanthropy intelligence. Terminal commands provide allied information support only. Philanthropy Upload and Metal Gear Data Hack are project labels, not canonical damaging attacks; no beam, infection, enemy HP loss or healing is created.',
    buff('Codec Support Ping', { shape: 'single', duration: 1.5, buffMultiplier: 1.08 }),
    buff('Metal Gear Data Hack', { duration: 2, buffMultiplier: 1.1 }),
    defend('Stealth Lab Guard', 0.35),
    { ...buff('Philanthropy Upload', { duration: 3, buffMultiplier: 1.15 }), color: '#79c7bc' })
});
