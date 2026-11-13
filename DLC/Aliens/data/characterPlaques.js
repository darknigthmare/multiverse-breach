// Aliens — definitions consumed by src/game/characterPlaques.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCharacterPlaques() {
  return ({
    clearance: 'WY-LV426',
    rank: { fr: 'Survivante de LV-426', en: 'LV-426 Survivor' },
    role: { fr: 'Secours de Newt et combat de la Reine', en: 'Newt rescue and Queen confrontation' },
    callSign: 'Ripley',
    origin: { fr: 'Aliens (1986) - LV-426 / Sulaco', en: 'Aliens (1986) - LV-426 / Sulaco' },
    dossier: {
      fr: 'Cette incarnation est celle d Aliens (1986): Ripley apprend le M41A avec Hicks, associe son fusil au M240 pour sauver Newt puis utilise le power loader du Sulaco contre la Reine.',
      en: 'This is the Aliens (1986) incarnation: Ripley learns the M41A from Hicks, combines it with the M240 to rescue Newt and uses the Sulaco power loader against the Queen.'
    },
    doctrine: { fr: 'Fusil M41A, incinerateur M240, power loader P-5000.', en: 'M41A pulse rifle, M240 incinerator, P-5000 power loader.' },
    tags: ['LV-426', 'Sulaco', 'Aliens 1986', 'Newt', 'Power Loader']
  });
}
