// Ghosts of Mars — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'ghosts_of_mars',
    universe: 'Ghosts of Mars',
    mediaType: 'movie',
    faction: 'horror',
    mode: 'Smash',
    difficulty: 'Very Hard',
    titleFr: 'Ghosts of Mars',
    stage: 'Shining Canyon Mining Colony',
    boss: 'Big Daddy Mars Possession Horde',
    cast: [
      ['melanie_ballard_gom', 'Melanie Ballard', 'tactical'],
      ['desolation_williams_gom', 'Desolation Williams', 'slayer'],
      ['bashira_kincaid_gom', 'Bashira Kincaid', 'marine']
    ],
    enemies: ['Possessed Miner', 'Martian Warrior', 'Rail Convoy Ambusher'],
    bosses: ['Big Daddy Mars', 'Ancient Martian Spirit Cloud'],
    gear: [
      ['rail_rifle', 'Mars Police Rail Rifle', 'Fusil ferroviaire de la police martienne'],
      ['spirit_sample', 'Martian Spirit Sample', 'Echantillon d esprit martien'],
      ['train_charge', 'Mining Train Charge', 'Charge du train minier']
    ],
    event: ['train_blast', 'Shining Canyon Rail Detonation', 'Detonation ferroviaire de Shining Canyon', 'The mining train detonates behind the extraction, burning the possession cloud out of the lane.', 'Le train minier explose derriere l extraction et brule le nuage de possession hors de la voie.'],
    origin: ['Martian police and prisoner Desolation Williams face ancient spirits that possess miners and revive a dead warrior culture.', 'La police martienne et le prisonnier Desolation Williams affrontent des esprits antiques qui possedent les mineurs et ressuscitent une culture guerriere morte.'],
    breach: ['the spirits inhabit anyone crossing a red portal, turning travel itself into a possession vector that Ballard must quarantine.', 'les esprits habitent toute personne traversant un portail rouge, transformant le voyage en vecteur de possession que Ballard doit mettre en quarantaine.'],
    motif: 'wasteland',
    colors: ['#351713', '#070302', '#d44b32']
  }));
}
