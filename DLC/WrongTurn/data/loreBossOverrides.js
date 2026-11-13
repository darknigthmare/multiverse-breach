// Wrong Turn — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Three Finger',
      weapon: 'bow_and_blade',
      special: 'Forest Ambush',
      phases: ['Uses a bow from concealment and sets simple traps', 'Closes distance with his documented blade and feral movement'],
      lore: {
        fr: 'Three Finger est le chasseur cannibale recurrent de la franchise.',
        en: 'Three Finger is the franchise s recurring cannibal hunter.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Wrong_Turn_(film_series)',
      visualAnchor: 'Exact selected-film Three Finger makeup, asymmetrical face, dirty hunting clothes, bow and blade; no supernatural mutation.'
    },
    {
      name: 'Saw Tooth',
      weapon: 'axe',
      special: 'Cannibal Heavy Charge',
      phases: ['Uses broad axe swings and blocks narrow paths', 'Charges more aggressively after receiving visible human injuries'],
      lore: {
        fr: 'Saw Tooth est le membre massif du clan cannibale.',
        en: 'Saw Tooth is the massive member of the cannibal clan.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Wrong_Turn_(film_series)',
      visualAnchor: 'Exact selected-film Saw Tooth prosthetic makeup, huge human build, forest clothing and axe; no monster armor.'
    }
  ]);
}
