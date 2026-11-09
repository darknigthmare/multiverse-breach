// Blade Runner — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'blade_runner',
    universe: 'Blade Runner',
    mediaType: 'movie',
    faction: 'cyber',
    mode: 'RPG',
    difficulty: 'Very Hard',
    stage: 'Los Angeles 2019 Tyrell Pyramid',
    boss: 'Tyrell Replicant Recall',
    cast: [
      ['rick_deckard_br', 'Rick Deckard', 'tactical'],
      ['rachael_br', 'Rachael', 'hacker'],
      ['k_br2049', 'K', 'slayer']
    ],
    enemies: ['Replicant Hunter', 'Wallace Drone', 'Synthetic Memory Echo'],
    bosses: ['Roy Batty', 'Luv'],
    gear: [
      ['blaster', 'Blade Runner Blaster', 'Blaster de Blade Runner'],
      ['voight_kampff', 'Voight-Kampff Unit', 'Unite Voight-Kampff'],
      ['wood_horse', 'Wooden Horse Memory', 'Souvenir du cheval en bois']
    ],
    event: ['tears_rain', 'Tears in Rain', 'Larmes dans la pluie', 'A dying memory is preserved instead of erased, cancelling the next hostile recall order.', 'Un souvenir mourant est preserve au lieu d etre efface, annulant le prochain ordre de retrait hostile.'],
    origin: ['Blade runners hunt engineered replicants in rain-soaked futures where memory, empathy, labor, and personhood are controlled by corporations.', 'Des blade runners traquent des replicants fabriques dans des futurs pluvieux ou memoire, empathie, travail et personne sont controles par des corporations.'],
    breach: ['manufactured memories match real Trame anchors, so A.R.C.A. must recognize personhood without relying on origin certificates.', 'des souvenirs fabriques correspondent a de vraies ancres de Trame, et A.R.C.A. doit reconnaitre les personnes sans se fier aux certificats d origine.'],
    motif: 'arcanecity',
    colors: ['#151c28', '#030405', '#d08748']
  }));
}
