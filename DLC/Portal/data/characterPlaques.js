// Portal — definitions consumed by src/game/characterPlaques.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCharacterPlaques() {
  return ({
    clearance: 'APT-01',
    rank: { fr: 'Sujet de test', en: 'Test Subject' },
    role: { fr: 'Mobilite par portails', en: 'Portal mobility' },
    callSign: 'Chell',
    origin: { fr: 'Aperture Science', en: 'Aperture Science' },
    dossier: {
      fr: 'Sujet silencieux a resistance exceptionnelle. Chell transforme la geometrie d une breche en raccourci, piege ou redirection tactique.',
      en: 'Silent subject with exceptional endurance. Chell turns breach geometry into shortcuts, traps, or tactical redirection.'
    },
    doctrine: { fr: 'Portail, redirection, tourelle improvisee.', en: 'Portal, redirect, improvised turret.' },
    tags: ['Aperture', 'Portal', 'Redirect', 'Test']
  });
}
