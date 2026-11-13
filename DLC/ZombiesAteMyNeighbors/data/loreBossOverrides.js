// Zombies Ate My Neighbors — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Dr. Tongue',
      weapon: 'monster_lab_devices',
      special: 'Monster Formula',
      phases: ['Uses laboratory devices and monster reinforcements', 'Triggers his documented transformation or final device pattern from the selected game'],
      lore: {
        fr: 'Dr. Tongue est le savant responsable de l invasion de monstres.',
        en: 'Dr. Tongue is the scientist responsible for the monster invasion.'
      },
      referenceUrl: 'https://zombiesatemyneighbors.fandom.com/wiki/Dr._Tongue',
      visualAnchor: 'Faithful high-detail expansion of Dr. Tongue s 16-bit scientist design, laboratory coat, facial features and source apparatus.'
    },
    {
      name: 'Giant Ant Queen',
      weapon: 'mandibles_and_acid',
      special: 'Nest Brood',
      phases: ['Uses mandible bites and short acid spits', 'Spawns a limited ant wave while exposing the abdomen'],
      lore: {
        fr: 'La reine geante defend le nid de fourmis.',
        en: 'The giant queen defends the ant nest.'
      },
      referenceUrl: 'https://zombiesatemyneighbors.fandom.com/wiki/Giant_Ant',
      visualAnchor: 'Faithful high-detail expansion of the 16-bit giant ant anatomy and palette, huge abdomen and mandibles, no fantasy armor.'
    }
  ]);
}
