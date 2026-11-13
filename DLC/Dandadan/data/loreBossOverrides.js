// Dandadan — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Evil Eye',
      weapon: 'cursed_body_and_ki',
      special: 'Grudge Ball',
      phases: ['Uses acrobatic cursed-body strikes and wall movement', 'Condenses hatred into the canonical destructive grudge projectile'],
      lore: {
        fr: 'Evil Eye est l esprit vengeur qui prend possession de Jiji.',
        en: 'Evil Eye is the vengeful spirit that possesses Jiji.'
      },
      referenceUrl: 'https://anime-dandadan.com/en/character/',
      visualAnchor: 'Exact anime Evil Eye design in Jiji s body, pale skin, long light hair, black briefs, facial markings and manic eyes.'
    },
    {
      name: 'Serpo-Dover Demon-Nessie Fusion',
      weapon: 'mantis_shrimp_fists_and_alien_beam',
      special: 'Composite Alien Assault',
      phases: ['Uses Dover Demon boxing power and Serpo energy attacks', 'Extends the Nessie-derived body for a full composite charge'],
      lore: {
        fr: 'Cette fusion canonique combine le Serpo, le Dover Demon et Nessie.',
        en: 'This canonical fusion combines the Serpoian, Dover Demon and Nessie.'
      },
      referenceUrl: 'https://anime-dandadan.com/en/character/',
      visualAnchor: 'Exact anime composite anatomy with Serpo head elements, mantis-shrimp boxing limbs and the long Nessie-derived body.'
    }
  ]);
}
