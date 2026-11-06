// Dead Space — definitions consumed by src/game/characterPlaques.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCharacterPlaques() {
  return ({
    clearance: 'CEC-RIG',
    rank: { fr: 'Ingenieur CEC', en: 'CEC Engineer' },
    role: { fr: 'Demembrement necromorphe', en: 'Necromorph dismemberment' },
    callSign: 'Clarke',
    origin: { fr: 'USG Ishimura', en: 'USG Ishimura' },
    dossier: {
      fr: 'Ingenieur force a survivre a l impossible. Isaac traite une breche comme un systeme en panne: coupe, ralentit, repare, puis avance.',
      en: 'Engineer forced to survive the impossible. Isaac treats a breach like a failing system: cut, slow, repair, then move.'
    },
    doctrine: { fr: 'Plasma cutter, stase, telekinesie RIG.', en: 'Plasma cutter, stasis, RIG kinesis.' },
    tags: ['CEC', 'RIG', 'Stasis', 'Dismember']
  });
}
