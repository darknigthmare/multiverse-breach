// Shaun of the Dead — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Zombie Philip',
      weapon: 'undead_grab_and_bite',
      special: 'Stepfather Recognition Stagger',
      phases: ['Uses slow grabs and bites', 'Briefly recognizes Shaun and becomes vulnerable before the last lunge'],
      lore: {
        fr: 'Philip infecte reste une rencontre tragique et lente.',
        en: 'The infected Philip remains a tragic and slow encounter.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Shaun_of_the_Dead',
      visualAnchor: 'The exact middle-aged film appearance, glasses, bloodied shirt and restrained zombie makeup of Philip.'
    },
    {
      name: 'Zombie John',
      weapon: 'heavy_undead_grab',
      special: 'Winchester Landlord Lunge',
      phases: ['Uses heavy pub-floor lunges and grabs', 'Becomes faster after being knocked away from the bar'],
      lore: {
        fr: 'John, proprietaire du Winchester, est utilise dans sa forme infectee du film.',
        en: 'John, the Winchester landlord, is used in his infected film form.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Shaun_of_the_Dead',
      visualAnchor: 'The elderly Winchester landlord in his exact film clothing and grounded zombie makeup, with no mutations.'
    }
  ]);
}
