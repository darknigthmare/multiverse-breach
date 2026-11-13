// Doom — definitions consumed by src/game/characterPlaques.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCharacterPlaques() {
  return ({
    clearance: 'UAC-666',
    rank: { fr: 'Tueur infernal', en: 'Hell Slayer' },
    role: { fr: 'Eradication demoniaque', en: 'Demonic eradication' },
    callSign: 'Slayer',
    origin: { fr: 'Mars / Argent D Nur', en: 'Mars / Argent D Nur' },
    dossier: {
      fr: 'Aucune negociation, aucune retraite longue. Sa plaquette sert a une seule chose: confirmer que la breche infernale doit etre fermee par force brute.',
      en: 'No negotiation, no long retreat. His plaque exists for one purpose: confirming that a hell breach must be closed by brute force.'
    },
    doctrine: { fr: 'Super shotgun, Flame Belch, BFG 9000.', en: 'Super shotgun, Flame Belch, BFG 9000.' },
    tags: ['UAC', 'Demon', 'BFG', 'Brutal']
  });
}
