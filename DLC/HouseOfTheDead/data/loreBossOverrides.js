// House of the Dead — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Chariot',
      weapon: 'armored_halberd_and_charge',
      special: 'Armor Break Charge',
      phases: ['Advances in full armor with wide halberd swings and a shoulder charge', 'Broken armor exposes the unprotected body and accelerates its close-range attacks'],
      lore: {
        fr: 'Le premier gardien Tarot du manoir Curien combat dans son armure jusqu a ce que les agents la brisent.',
        en: 'The first Tarot guardian of Curien Mansion fights in armor until the agents break it.'
      },
      referenceUrl: 'https://thehouseofthedead.fandom.com/wiki/Chariot',
      visualAnchor: 'Exact original Chariot Type 27: towering gray-blue humanoid inside bulky bronze medieval armor, horned helmet and long polearm; show the exposed creature only in later damage frames, with no unrelated knight redesign.'
    },
    {
      name: 'Hangedman',
      weapon: 'claws_and_devilon_command',
      special: 'Devilon Flock Drop',
      phases: ['Hovers above the mansion roof while directing a limited Devilon flock', 'Drops into close-range claw passes after the flock is dispersed'],
      lore: {
        fr: 'Le gardien aile du Tarot commande les Devilons avant d attaquer lui-meme au-dessus du manoir.',
        en: 'The winged Tarot guardian commands Devilons before attacking directly above the mansion.'
      },
      referenceUrl: 'https://thehouseofthedead.fandom.com/wiki/Hangedman',
      visualAnchor: 'Exact original Hangedman Type 041: lean gray gargoyle-bat humanoid with long ears, membrane wings, red eyes and clawed hands and feet; no robe, gallows rope or skeletal angel anatomy.'
    }
  ]);
}
