// Heavy Metal 2000 — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Odin - Arakacian Revealed',
      weapon: 'Arakacian strength and fountain chamber controls',
      special: 'Arakacian Empire Claim',
      phases: ['Discards the cloaked sage disguise and reveals his final-film Arakacian body', 'Attempts to seize the fountain chamber until Zeek removes the crystal key and seals him inside'],
      lore: {
        fr: 'Odin revele etre le dernier Arakacien et tente de reprendre la fontaine afin de restaurer son empire.',
        en: 'Odin reveals himself as the last Arakacian and attempts to reclaim the fountain to restore his empire.'
      },
      referenceUrl: 'https://www.imdb.com/title/tt0119273/plotsummary/',
      visualAnchor: 'Odin in the exact computer-animated Arakacian form revealed at the end of the 2000 film, after throwing off the dark sage cloak; preserve the film silhouette, pale alien materials and fountain-chamber look, with no Norse armor, no stone Zeek anatomy and no generic wizard redesign.'
    }
  ]);
}

export function createRawSlotPolicies({ definePolicy, fallbackName }) {
  return (definePolicy({
    removeSlots: [fallbackName('Heavy Metal 2000', 'CA')],
    convertTo: { [fallbackName('Heavy Metal 2000', 'CA')]: 'enemyWave:pirates' },
    fr: 'Tyler est deja world boss; un second boss local invente ferait doublon.',
    en: 'Tyler is already the world boss; an invented second local boss would be a duplicate.'
  }));
}
