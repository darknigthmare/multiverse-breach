// Inuyashiki — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Hiro Shishigami',
      weapon: 'cybernetic_finger_guns_and_missiles',
      special: 'Remote Kill Network',
      phases: ['Uses finger-gun shots, flight and cybernetic targeting', 'Escalates to the documented missile and network attack pattern'],
      lore: {
        fr: 'Les deux noms de mecanique deviennent une seule rencontre multiphase avec Hiro.',
        en: 'The two mechanic names become one multiphase encounter with Hiro.'
      },
      referenceUrl: 'https://inuyashiki-project.com/',
      visualAnchor: 'Exact anime Hiro Shishigami, black school uniform, dark hair, youthful face and source-accurate internal machine effects.'
    }
  ]);
}
