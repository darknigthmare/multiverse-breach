// Exact same-universe roster pairings. A gameplay relay does not claim a
// canonical summon, historical alliance or identical point in the timeline.
const partners = {
  ripley: 'hicks', hicks: 'ripley', bishop: 'hicks', dallas_alien: 'ripley',
  parker_alien: 'ripley', lambert_alien: 'ripley', ash_alien: 'bishop', amanda_ripley: 'ripley',
  chell: 'atlas', atlas: 'pbody', pbody: 'atlas', glados: 'atlas', wheatley: 'atlas', doug_rattmann: 'chell',
  rincewind_dw: 'twoflower_dw', vimes_dw: 'granny_dw', granny_dw: 'nanny_ogg_dw',
  twoflower_dw: 'rincewind_dw', death_dw: 'vimes_dw', nanny_ogg_dw: 'granny_dw',
  meryl_mgs: 'big_boss', liquid_snake: 'gray_fox', the_boss_mgs: 'big_boss',
  ocelot_mgs: 'meryl_mgs', gray_fox: 'meryl_mgs', big_boss: 'the_boss_mgs',
  luke: 'obi_wan', vader: 'luke', ahsoka_adult: 'obi_wan', aayla_secura: 'obi_wan',
  darth_revan: 'vader', obi_wan: 'yoda', yoda: 'obi_wan', darth_maul: 'vader',
  joel_tlou: 'tess_tlou', tess_tlou: 'joel_tlou', tommy_tlou: 'joel_tlou',
  dina_tlou2: 'joel_tlou', abby_tlou2: 'tommy_tlou', hayden: 'doomslayer'
};
const universes = {
  Alien: ['ripley','hicks','bishop','dallas_alien','parker_alien','lambert_alien','ash_alien','amanda_ripley'],
  Portal: ['chell','atlas','pbody','glados','wheatley','doug_rattmann'],
  Discworld: ['rincewind_dw','vimes_dw','granny_dw','twoflower_dw','death_dw','nanny_ogg_dw'],
  'Metal Gear': ['meryl_mgs','liquid_snake','the_boss_mgs','ocelot_mgs','gray_fox','big_boss'],
  'Star Wars': ['luke','vader','ahsoka_adult','aayla_secura','darth_revan','obi_wan','yoda','darth_maul'],
  'The Last of Us': ['joel_tlou','tess_tlou','tommy_tlou','dina_tlou2','abby_tlou2'],
  Doom: ['hayden']
};
const universeById = new Map(Object.entries(universes).flatMap(([universe, ids]) => ids.map(id => [id, universe])));
export const ROSTER_REINFORCEMENTS_WAVE13 = Object.freeze(Object.fromEntries(Object.entries(partners)
  .map(([id, performerHeroId]) => [id, Object.freeze({ universe: universeById.get(id), performerHeroId, slot: 'special', sourceWave: 13 })])));
