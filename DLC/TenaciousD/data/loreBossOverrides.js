// Tenacious D — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Satan / Beelzeboss',
      weapon: 'guitar_and_fire',
      special: 'Rock-Off',
      phases: ['Uses guitar riffs, fire bursts and heavy stomps in the rock-off', 'Loses the horn fragment after the final reflected attack'],
      lore: {
        fr: 'Satan est l adversaire du duel musical final et le gardien reel du Pick.',
        en: 'Satan is the final musical-duel opponent and the true guardian of the Pick.'
      },
      referenceUrl: 'https://www.newline.com/films/tenacious-d-in-the-pick-of-destiny',
      visualAnchor: 'Exact red Satan from The Pick of Destiny, massive body, horns, black goatee, leather details and film guitar.'
    }
  ]);
}

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: { 'Sasquatch Jam Spirit': 'supportCameo:Sasquatch' },
    fr: 'Sasquatch aide le groupe et ne doit pas etre classe comme ennemi.',
    en: 'Sasquatch helps the band and must not be classified as an enemy.'
  }));
}
