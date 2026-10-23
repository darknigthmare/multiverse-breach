// Explicit identities from the named games/series. Timing, damage and equipped
// materia are Multiverse Breach adaptations; this is not an asset fidelity claim.
const entry = (universe, sourceWork, name, type, color, targeting = {}) => ({
  universe,
  sourceWork,
  sourceReference: `${sourceWork}: ${name}`,
  special: { name, type, dmg: 4.5, color, targeting }
});
const ff7 = (name, type, color, targeting) => entry('Final Fantasy VII', 'Final Fantasy VII (1997), Limit Break', name, type, color, targeting);
const ff8 = (name, type, color) => entry('Final Fantasy VIII', 'Final Fantasy VIII (1999), Limit Break', name, type, color);
const ff13 = (name, type, color, targeting) => entry('Final Fantasy XIII', 'Final Fantasy XIII (2009), unique ability', name, type, color, targeting);
const ff15 = (name, type, color) => entry('Final Fantasy XV', 'Final Fantasy XV (2016), character technique', name, type, color);
const naruto = (universe, name, type, color, targeting) => entry(universe, `${universe}, character technique`, name, type, color, targeting);

export const CANONICAL_COMBAT_OVERRIDES = {
  cloud_ff7: ff7('Omnislash', 'melee_aoe', '#84dfff'),
  tifa_ff7: ff7('Final Heaven', 'melee', '#fff2b3'),
  aerith_ff7: ff7('Great Gospel', 'heal_aoe', '#b7ffd8', { effect: 'heal', targetSide: 'ally', shape: 'group', healRatio: 0.6, duration: 3 }),
  barret_ff7: ff7('Catastrophe', 'beam_aoe', '#ffbe53'),
  redxiii_ff7: ff7('Cosmo Memory', 'fire_aoe', '#ff754a'),
  yuffie_ff7: ff7('All Creation', 'beam_aoe', '#8effcc'),
  vincent_ff7: ff7('Chaos', 'buff', '#d96887', { effect: 'buff', targetSide: 'self', shape: 'single', buffMultiplier: 1.5, duration: 5 }),
  squall_ff8: ff8('Lion Heart', 'melee_aoe', '#87bfff'),
  rinoa_ff8: ff8('Wishing Star', 'melee_aoe', '#d5efff'),
  quistis_ff8: ff8('Shockwave Pulsar', 'magic_aoe', '#8f91ff'),
  // Seifer is a temporary party member with Fire Cross, not a generic burst.
  seifer_ff8: entry('Final Fantasy VIII', 'Final Fantasy VIII (1999), Fire Cross', 'No Mercy', 'fire_aoe', '#ffb363'),
  laguna_ff8: ff8('Desperado', 'bullet_aoe', '#ffca75'),
  zell_ff8: ff8('My Final Heaven', 'melee', '#ffdc66'),
  selphie_ff8: ff8('The End', 'magic_aoe', '#ffe1a8'),
  irvine_ff8: {
    ...entry('Final Fantasy VIII', 'Final Fantasy VIII (1999), Pulse Ammo / Shot', 'Hyper Shot', 'bullet', '#e4bd7e', { targetSide: 'enemy', shape: 'single', maxTargets: 1 }),
    sourceReference: 'Pulse Ammo / Hyper Shot damages one enemy; Scatter Shot and Flame Shot target the group. Damage, timing and armor rules remain engine adaptations.',
    sourceUrl: 'https://guides.gamercorner.net/ffviii/limit-breaks/hyper-shot'
  },
  lightning_ff13: {
    ...ff13('Army of One', 'melee', '#f4c3ff', { targetSide: 'enemy', shape: 'single', maxTargets: 1 }),
    sourceReference: 'Final Fantasy XIII:11-part physical Ravager combination on one enemy. Poses, damage, chain mechanics and one engine impact are adaptations.',
    sourceUrl: 'https://guides.gamercorner.net/ffxiii/abilities/army-of-one'
  },
  fang_ff13: {
    ...ff13('Highwind', 'melee_aoe', '#bf8bff'),
    sourceReference: 'Final Fantasy XIII: descending lance strike and a ground eruption with nearby area damage. The engine condenses its damage components into one impact.',
    sourceUrl: 'https://guides.gamercorner.net/ffxiii/abilities/highwind'
  },
  vanille_ff13: {
    ...ff13('Death', 'dark', '#d789e3', { targetSide: 'enemy', shape: 'single', maxTargets: 1 }),
    sourceReference: 'Final Fantasy XIII: Saboteur spell on one enemy with a chance of death and magic damage on failure. This engine adapts the damage branch without implementing the source death probability or guaranteeing an execution.',
    sourceUrl: 'https://guides.gamercorner.net/ffxiii/abilities/death'
  },
  snow_ff13: {
    ...ff13('Sovereign Fist', 'melee_aoe', '#a8dfff'),
    sourceReference: 'Final Fantasy XIII: descending fist attack with area damage. The source damage-component count is unverified; the engine retains one authoritative impact.',
    sourceUrl: 'https://guides.gamercorner.net/ffxiii/abilities/sovereign-fist'
  },
  sazh_ff13: {
    ...ff13('Cold Blood', 'bullet', '#ffd17f', { targetSide: 'enemy', shape: 'single', maxTargets: 1 }),
    sourceReference: 'Final Fantasy XIII: dual-pistol volley on one enemy,17 source hits. Visible tracers are condensed around one engine damage event; timing and damage remain adaptations.',
    sourceUrl: 'https://guides.gamercorner.net/ffxiii/abilities/cold-blood'
  },
  hope_ff13: ff13('Last Resort', 'magic_aoe', '#eaffbe'),
  noctis_ff15: ff15('Armiger', 'melee_aoe', '#a3bdff'),
  gladiolus_ff15: ff15('Dawnhammer', 'melee', '#ffbb76'),
  ignis_ff15: ff15('Overwhelm', 'melee_aoe', '#acffd9'),
  prompto_ff15: ff15('Trigger Happy', 'bullet_aoe', '#ffe47d'),
  // Lunafreya's blessing is support; it does not become an offensive explosion.
  lunafreya_ff15: entry('Final Fantasy XV', 'Final Fantasy XV (2016), oracle blessing', 'Oracle’s Blessing', 'heal_aoe', '#efffff', { effect: 'heal', targetSide: 'ally', shape: 'group', healRatio: 0.4 }),
  naruto_uzumaki_young: naruto('Naruto', 'Rasengan', 'melee', '#9cdcff'),
  sasuke_uchiha_young: naruto('Naruto', 'Chidori', 'melee', '#b3d4ff'),
  // Young Sakura has no later-series superhuman strength or healing technique.
  sakura_haruno_young: naruto('Naruto', 'Bunshin no Jutsu', 'buff', '#ffd4df', { effect: 'buff', targetSide: 'self', shape: 'single', maxTargets: 1 }),
  naruto_six_paths: naruto('Naruto Shippuden', 'Wind Release: Rasenshuriken', 'projectile_aoe', '#a7f0ff'),
  sasuke_rinnegan: naruto('Naruto Shippuden', 'Indra’s Arrow', 'projectile_aoe', '#bd9cff'),
  kakashi_war: naruto('Naruto Shippuden', 'Kamui', 'vortex', '#b0ddff'),
  boruto_uzumaki: naruto('Boruto: Naruto Next Generations', 'Vanishing Rasengan', 'projectile', '#b6eaff'),
  sarada_uchiha: naruto('Boruto: Naruto Next Generations', 'Chidori', 'melee', '#b3d4ff'),
  mitsuki_boruto: naruto('Boruto: Naruto Next Generations', 'Lightning Release: Snake Lightning', 'beam', '#b1e9ff'),
  goku_dbz: entry('Dragon Ball Z', 'Dragon Ball Z, Son Goku technique', 'Kamehameha', 'beam', '#9bdcff'),
  vegeta_dbz: entry('Dragon Ball Z', 'Dragon Ball Z, Vegeta technique', 'Final Flash', 'beam', '#fff38c'),
  piccolo_dbz: entry('Dragon Ball Z', 'Dragon Ball Z, Piccolo technique', 'Special Beam Cannon', 'beam', '#ffdc80')
};

// All FFVII party members can equip summon materia. The chosen materia is an
// explicit game loadout, not a claim that a character innately owns that summon.
const materia = (entityName, technique, type, color, visualStyle) => ({
  entityName,
  name: `${entityName} — ${technique}`,
  color,
  visualStyle,
  sourceWork: 'Final Fantasy VII (1997)',
  sourceReference: `${entityName} summon materia: ${technique}`,
  equipmentAssignment: true,
  action: { name: technique, type, dmg: 4.5, targeting: { effect: 'damage', targetSide: 'enemy', shape: 'group' } }
});
const ifrit = materia('Ifrit', 'Hellfire', 'fire_aoe', '#ff8645', 'fire');
const shiva = materia('Shiva', 'Diamond Dust', 'ice_aoe', '#a5ebff', 'ice');
const bahamut = materia('Bahamut', 'Megaflare', 'beam_aoe', '#c2b1ff', 'beam');

export const CANONICAL_UNIVERSE_SUMMONS = {
  cloud_ff7: ifrit,
  tifa_ff7: shiva,
  aerith_ff7: bahamut,
  barret_ff7: ifrit,
  redxiii_ff7: ifrit,
  yuffie_ff7: shiva,
  vincent_ff7: bahamut
};
