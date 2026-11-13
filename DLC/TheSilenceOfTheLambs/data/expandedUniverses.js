// The Silence of the Lambs — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'silence_of_the_lambs',
    universe: 'The Silence of the Lambs',
    mediaType: 'movie',
    faction: 'horror',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    stage: 'Baltimore Hospital Behavioral Wing',
    boss: 'Buffalo Bill Basement Hunt',
    cast: [
      ['clarice_starling', 'Clarice Starling', 'tactical'],
      ['jack_crawford_sotl', 'Jack Crawford', 'marine'],
      ['barney_matthews_sotl', 'Barney Matthews', 'hacker']
    ],
    enemies: ['False Witness Echo', 'Basement Stalker', 'Asylum Escapee'],
    bosses: ['Hannibal Lecter Escape Pattern', 'Buffalo Bill'],
    gear: [
      ['case_file', 'Buffalo Bill Case File', 'Dossier Buffalo Bill'],
      ['night_vision', 'Basement Night-Vision Goggles', 'Lunettes nocturnes de la cave'],
      ['moth_cocoon', 'Death s-Head Moth Cocoon', 'Cocon de sphinx tete-de-mort']
    ],
    event: ['quid_pro_quo', 'Quid Pro Quo Interview', 'Entretien donnant-donnant', 'Clarice extracts the hidden target pattern, exposing every ambush without granting Lecter control.', 'Clarice extrait le schema cache des cibles, revele chaque embuscade sans laisser Lecter prendre le controle.'],
    origin: ['FBI trainee Clarice Starling consults imprisoned psychiatrist Hannibal Lecter to identify serial killer Buffalo Bill before another captive dies.', 'La stagiaire du FBI Clarice Starling consulte le psychiatre emprisonne Hannibal Lecter pour identifier le tueur Buffalo Bill avant la mort d une autre captive.'],
    breach: ['Lecter reads portal behavior as psychology and starts predicting which memories A.R.C.A. will sacrifice under pressure.', 'Lecter lit le comportement des portails comme une psychologie et predit quels souvenirs A.R.C.A. sacrifiera sous pression.'],
    motif: 'facility',
    colors: ['#20221d', '#030403', '#c5b879']
  }));
}
