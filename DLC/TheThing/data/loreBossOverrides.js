// The Thing — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Norris-Thing',
      weapon: 'chest_maw_and_spider_head',
      special: 'Defibrillator Chest Rupture',
      phases: ['Reveals the canonical chest maw and severs the doctor s arms as an attack cue', 'Detaches the spider-head and uses tendrils for the mobile phase'],
      lore: {
        fr: 'La transformation de Norris reproduit les deux etapes pratiques du film de 1982.',
        en: 'Norris s transformation reproduces the two practical-effects stages from the 1982 film.'
      },
      referenceUrl: 'https://www.theofficialjohncarpenter.com/the-thing/',
      visualAnchor: 'Exact practical-effects chest maw, torn human torso, detached spider-head and flesh tendrils from John Carpenter s film.'
    },
    {
      name: 'Blair-Thing',
      weapon: 'assimilation_tendrils',
      special: 'Generator-Room Emergence',
      phases: ['Emerges from below with asymmetrical crushing limbs', 'Reveals the human and canine assimilation features for the final attack'],
      lore: {
        fr: 'Blair-Thing est la masse d assimilation finale du generateur.',
        en: 'Blair-Thing is the final assimilation mass in the generator room.'
      },
      referenceUrl: 'https://www.theofficialjohncarpenter.com/the-thing/',
      visualAnchor: 'Exact final practical-effects mass with Blair s features, canine elements, wet flesh and asymmetrical crushing limbs.'
    }
  ]);
}
