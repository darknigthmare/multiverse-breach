// Metal Gear — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'game',
    title: { en: 'Metal Gear', fr: 'Metal Gear' },
    desc: {
      en: 'Tactical espionage stealth operations against giant nuclear weapon mechs.',
      fr: 'Opérations d\'infiltration tactique contre des méchas nucléaires bipèdes.'
    }
  });
}
