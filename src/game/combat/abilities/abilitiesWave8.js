import { area, defend, hit, shot } from './rules.js';

const special = (action, color) => ({ ...action, color, animationDuration: 1.1, hitAt: 0.451, meterCost: 100 });
const kit = (sourceHeroId, universe, sourceWork, sourceReference, simple, secondary, defense, superAction) => ({
  sourceHeroId, universe, sourceWork, sourceReference,
  identityBasis: 'canonical-role', canonicalVerified: false, networkVerified: false,
  gameplayAdaptation: true, simple, secondary: { cd: 6, ...secondary }, defense, special: superAction
});

// Correct actual equipment, support semantics and named abilities. Dialogue,
// slogans and an unrelated character's powers never become attack mechanics.
export const ABILITIES_WAVE8 = Object.freeze({
  starfire_tt: kit('starfire_tt', 'Teen Titans', 'Teen Titans (2003 animated series)',
    'Starfire projects green starbolts and flies. Her personal dodge protects herself; it does not grant unrelated allies alien biology. The volley is a bounded projectile adaptation, not a newly asserted canonical ultimate named Nova Starburst.',
    shot('Starbolt de Starfire', 1), hit('Coup de pied en vol de Starfire', 1.8, { range: 185 }),
    defend('Esquive en vol de Starfire', 0.45),
    special(shot('Salve de starbolts de Starfire', 4.6, { range: 640 }), '#82f95d')),
  beast_boy_tt: kit('beast_boy_tt', 'Teen Titans', 'Teen Titans (2003 animated series)',
    'Beast Boy retains green animal forms. This selected combat loadout uses a genuine green gorilla for ordinary physical commands and a green T-Rex for the super. Gorilla guard is self protection with zero damage; no damaging Mouse Escape or unrelated shapeshifter power is introduced.',
    hit('Poing du gorille vert', 1.1), hit('Charge du gorille vert', 1.9, { range: 170 }),
    defend('Garde du gorille vert', 0.5),
    special(hit('Charge du T-Rex vert', 4.8, { range: 185 }), '#71cf69')),
  armstrong_mgr: kit('armstrong_mgr', 'Metal Gear Rising', 'Metal Gear Rising: Revengeance (2013), final battle',
    'Armstrong fights with fists, shoulder charges and nanomachine hardening. His ground strike creates a local shockwave; the omelette dialogue is not an ability. Hardening protects Armstrong rather than granting his nanomachines to allies.',
    hit('Poing aux nanomachines d’Armstrong', 1.2), hit('Charge épaulière d’Armstrong', 1.9, { range: 170 }),
    defend('Durcissement des nanomachines', 0.6),
    special(area('Frappe sismique d’Armstrong', 4.9, { range: 190, areaRadius: 115 }), '#dd8653')),
  mistral_mgr: kit('mistral_mgr', 'Metal Gear Rising', 'Metal Gear Rising: Revengeance (2013)',
    'Mistral uses the L’Étranger polearm assembled from Dwarf Gekko arms and her attached mechanical arms. Her defense is a personal physical parry, not Monsoon’s magnetism. The named spiral is an authored description of a polearm sweep, not a claimed source-game ultimate title.',
    hit('Taille de L’Étranger', 1.1, { range: 110 }), hit('Balayage de L’Étranger', 1.9, { range: 190 }),
    defend('Parade des bras Dwarf Gekko', 0.5),
    special(hit('Spirale de L’Étranger', 4.6, { range: 195 }), '#dc728b')),
  monsoon_mgr: kit('monsoon_mgr', 'Metal Gear Rising', 'Metal Gear Rising: Revengeance (2013)',
    'Monsoon fights with Dystopia sai, magnetic control of metal and separation of his cyborg body. His self dodge is not an allied buff. Magnetically thrown debris is a source-based attack adaptation; the word memes is dialogue, not a magic projectile.',
    hit('Taille des sai Dystopia', 1.1), shot('Projection magnétique de débris', 1.9, { range: 560 }),
    defend('Esquive du corps segmenté', 0.5),
    special(area('Assaut magnétique de Monsoon', 4.7, { range: 560, areaRadius: 115 }), '#b982df'))
});

const version = (universe, sourceWork, versionNote) => ({ universe, sourceWork, versionNote });
export const ABILITY_REVISIONS_WAVE8 = Object.freeze({
  kiryu_yakuza: version('Yakuza', 'Yakuza Kiwami (2016)', 'Selected Kiwami gray suit and burgundy shirt, unarmed Dragon of Dojima style. The project combo keeps one impact; no dragon-shaped entity or laser is introduced.'),
  majima_yakuza: version('Yakuza', 'Yakuza Kiwami (2016)', 'Selected Kiwami snakeskin jacket, left eyepatch and tantō. Preserve the adapted Mad Dog knife attack without importing a different costume or a firearm.'),
  ichiban_yakuza: version('Yakuza', 'Yakuza: Like a Dragon (2020)', 'Selected red suit, white shirt and Hero-job bat. Giga Swing remains a physical bat sweep, not a gun or an innate magical beam.'),
  saejima_yakuza: version('Yakuza', 'Yakuza 5 (2012)', 'Selected short-haired Saejima in his olive parka. Herculean Spirit remains self guard with zero enemy damage and no shared invincibility.'),
  akiyama_yakuza: version('Yakuza', 'Yakuza 5 (2012)', 'Selected burgundy blazer and dark charcoal trousers; gray highlights are a palette adaptation. Launch Strike uses Akiyama’s legs; the engine adapts its launch/combo without adding a firearm.'),
  blade_wolf_mgr: version('Metal Gear Rising', 'Metal Gear Rising: Revengeance (2013)', 'LQ-84i is a quadrupedal cyborg wolf with a tail-mounted chainsaw. Keep its mechanical tail attack distinct from a human swordfighter or firearms.'),
  jetstream_sam: version('Metal Gear Rising', 'Metal Gear Rising: Revengeance (2013)', 'Samuel Rodrigues uses red high-frequency Murasama and its powered sheath. Preserve his own armor and iai, distinct from Raiden’s sword and cyborg body.'),
  ...Object.fromEntries(['laios_meshi', 'marcille_meshi', 'senshi_meshi', 'chilchuck_meshi', 'falin_meshi'].map(id => [id,
    version('Dungeon Meshi', 'Dungeon Meshi (2024 animated series), human exploration party',
      'Use the early exploration-party costume and equipment. Kensuke, Ambrosia, cooking, trap work and human healing keep their distinct roles; no firearm, elf-copy Falin or forced chimera transformation is introduced.')] ))
});
