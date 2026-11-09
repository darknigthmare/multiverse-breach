// Aliens — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterExpansion() {
  return ([
    {
      id: 'ripley_aliens', name: 'Ellen Ripley Aliens', cat: 'marine', color: '#8b8589',
      incarnation: 'Aliens (1986) - LV-426 / Sulaco',
      referenceUrl: 'https://www.20thcenturystudios.com/movies/aliens',
      visualAnchor: 'Ellen Ripley as played by Sigourney Weaver in Aliens (1986): short curly hair, blue-gray work shirt, M41A pulse rifle taped to an M240 incinerator; the yellow Caterpillar P-5000 power loader is situational equipment. No Nostromo 1979 flight suit.',
      canonStatus: 'source-locked-gameplay-adaptation',
      visualReviewStatus: 'pending',
      equipment: ['M41A pulse rifle', 'M240 incinerator', 'Caterpillar P-5000 power loader'],
      simple: { name: 'M41A Pulse Rifle', type: 'bullet', dmg: 1.0 },
      secondary: { name: 'M240 Incinerator', type: 'fire', cd: 7, dmg: 1.7 },
      defense: { name: 'Power Loader Block', type: 'shield', dur: 2.0, reduce: 0.75 },
      special: { name: 'Power Loader Smash', type: 'melee_aoe', dmg: 4.2 }
    },
    { id: 'newt_hadley', name: 'Newt', cat: 'hacker', color: '#e0c18c' },
    { id: 'hudson_aliens', name: 'Hudson', cat: 'marine', color: '#6b7767' },
    { id: 'apone_aliens', name: 'Apone', cat: 'tactical', color: '#566573' }
  ]);
}
