// Night of the Living Dead — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'night_living_dead',
    universe: 'Night of the Living Dead',
    mediaType: 'movie',
    faction: 'horror',
    mode: 'RPG',
    difficulty: 'Hard',
    stage: 'Pennsylvania Farmhouse Siege',
    boss: 'Farmhouse Cellar Collapse',
    cast: [
      ['ben_nold', 'Ben', 'marine'],
      ['barbra_nold', 'Barbra', 'horror'],
      ['tom_nold', 'Tom', 'tactical']
    ],
    enemies: ['Cemetery Ghoul', 'Farmhouse Ghoul', 'Torch Mob Ghoul'],
    bosses: ['Cellar Cooper Dead', 'Farmhouse Horde'],
    gear: [
      ['radio', 'Farmhouse Radio', 'Radio de la ferme'],
      ['boards', 'Window Barricade Kit', 'Kit de barricade de fenetre'],
      ['torch', 'Sheriff Posse Torch', 'Torche de la milice']
    ],
    event: ['broadcast', 'Emergency Broadcast', 'Bulletin d urgence', 'A clear broadcast reveals the safest lane and delays the surrounding dead.', 'Un bulletin clair revele la voie la plus sure et retarde les morts qui encerclent la ferme.'],
    origin: ['A rural farmhouse becomes a pressure chamber for strangers trapped between an unexplained rising of the dead and their own mistrust.', 'Une ferme rurale devient une chambre de pression pour des inconnus coinces entre le reveil inexplique des morts et leur propre mefiance.'],
    breach: ['the farmhouse repeats as an Anchor test, and every failed argument creates another sealed room in the Nexus.', 'la ferme se repete comme une epreuve d Ancre, et chaque dispute echouee cree une nouvelle piece scellee dans le Nexus.'],
    motif: 'hauntedset',
    colors: ['#202020', '#030303', '#b8b8a8']
  }));
}
