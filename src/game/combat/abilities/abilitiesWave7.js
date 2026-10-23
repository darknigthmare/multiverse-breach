import { area, defend, hit, shot } from './rules.js';

const special = (action, color) => ({ ...action, color, animationDuration: 1.1, hitAt: 0.451, meterCost: 100 });
const kit = (sourceHeroId, sourceWork, sourceReference, simple, secondary, defense, superAction) => ({
  sourceHeroId, universe: 'Star Wars', sourceWork, sourceReference,
  identityBasis: 'explicit-source-loadout', canonicalVerified: false, networkVerified: false,
  gameplayAdaptation: true, simple, secondary: { cd: 6, ...secondary }, defense, special: superAction
});

// These named legacy commands previously had no explicit basic-action records.
// Film equipment and abilities replace invented mental beams, song attacks and
// a ship-speed achievement presented as a personal damaging power.
export const ABILITIES_WAVE7 = Object.freeze({
  luke: kit('luke', 'Star Wars: Return of the Jedi (1983)',
    'Adult Luke wears black and uses his green lightsaber. Force push is adapted as a bounded local force impulse. His close saber sequence is one timed impact, not a damaging Jedi mind beam or an invented telepathic attack.',
    hit('Taille du sabre vert de Luke', 1),
    area('Poussée de Force de Luke', 1.8, { range: 170, areaRadius: 85 }),
    defend('Parade du sabre de Luke', 0.45),
    special(hit('Enchaînement au sabre de Luke', 5.2, { range: 170 }), '#6fe687')),
  vader: kit('vader', 'Star Wars original trilogy (1977–1983)',
    'Armored Darth Vader uses his red lightsaber and telekinetic Force choke. Choke is a bounded single-target damaging command without a forced instant kill or invented infection. The Imperial March is music, not an attack.',
    hit('Taille du sabre de Vader', 1),
    area('Étranglement de Force de Vader', 1.9, { shape: 'single', range: 240, maxTargets: 1 }),
    defend('Parade du sabre de Vader', 0.55),
    special(hit('Enchaînement au sabre de Vader', 4.6, { range: 170 }), '#ee6a6a')),
  han_solo: kit('han_solo', 'Star Wars: A New Hope (1977)',
    'Han uses a DL-44 heavy blaster and practical cover. His personal super is one accurate blaster shot. The Kessel Run and Millennium Falcon are not a remote area power, and cover provides no magical carbonite barrier.',
    shot('Tir du DL-44 de Han', 1),
    shot('Tir de couverture de Han', 1.8),
    defend('Mise à couvert de Han', 0.4),
    special(shot('Tir précis au DL-44', 4.6, { range: 640 }), '#ffc28a'))
});

const cse = 'BlazBlue: Continuum Shift Extend (2011)';
const xrd = 'Guilty Gear Xrd REV 2 (2017)';
// Explicit revisions of existing IDs preserve their original source records and
// action data. The catalog rejects unknown IDs and cross-universe revisions.
export const ABILITY_REVISIONS_WAVE7 = Object.freeze({
  ...Object.fromEntries(['ragna', 'jin', 'noel', 'rachel_bb', 'hazama_bb'].map(id => [id, {
    universe: 'BlazBlue', sourceWork: cse,
    versionNote: 'Chosen costume and technique continuity: Continuum Shift Extend. The named techniques also appear in later games; no later costume, Astral instant-kill rule or automatic Soul Eater healing is introduced.'
  }])),
  ...Object.fromEntries(['may_gg', 'dizzy_gg', 'millia_gg', 'axl_gg', 'baiken_gg'].map(id => [id, {
    universe: 'Guilty Gear', sourceWork: xrd,
    versionNote: 'Chosen Xrd REV 2 costume and equipment. Numeric timings are adapted; no Strive redesign, time-stop or automatic instant-kill rule is introduced.'
  }])),
  axl_gg: { universe: 'Guilty Gear', sourceWork: xrd,
    versionNote: 'Sickle Storm is an Xrd Overdrive. Rensen Geki remains the ordinary chain technique, and Axl Bomber is not relabeled as an Overdrive. Flame and chain visuals do not add extra gameplay hits.',
    special: special(hit('Sickle Storm', 3.1, { range: 170 }), '#f4d03f') },
  baiken_gg: { universe: 'Guilty Gear', sourceWork: xrd,
    versionNote: 'Xrd Baiken has a left eyepatch and empty right sleeve. Azami is her Xrd guard; Hiiragi belongs to her Strive kit. Preserve the existing guard effect and its balance values.',
    defenseName: 'Azami de Baiken' }
});
