// Gears of War — definitions consumed by src/game/canonicalArchiveLore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalArchiveEnemyLore({ notice }) {
  return (Object.freeze({
    'Locust Drone': notice(
      'Locust Drone', 'Gears of War (2006)',
      'https://gearsofwar.fandom.com/wiki/Drone',
      'Fantassin de la Horde Locuste sur Sera, le Drone combat avec les armes de la Horde, notamment le fusil Hammerburst. Sur le train de la bombe Lightmass, il appartient aux forces de RAAM.',
      'A Locust Horde infantryman on Sera, the Drone uses Horde weapons including the Hammerburst rifle. On the Lightmass Bomb train, it belongs to RAAM’s forces.'
    ),
    'Theron Guard': notice(
      'Theron Guard', 'Gears of War (2006)',
      'https://gearsofwar.fandom.com/wiki/Theron_Guard',
      'Garde d’élite Locuste en armure rouge sombre, le Theron utilise le Torque Bow et ses traits explosifs. Il est présent dans le premier Gears of War, pendant l’offensive contre la Horde.',
      'A Locust elite guard in dark red armor, the Theron uses the Torque Bow and its explosive bolts. It appears in the original Gears of War during the offensive against the Horde.'
    ),
    'General RAAM': notice(
      'General RAAM', 'Gears of War (2006)',
      'https://gearsofwar.fandom.com/wiki/RAAM',
      'Le général Locuste affronte Marcus Fenix et Dominic Santiago sur le train de la bombe Lightmass. Il porte une lourde armure et une mitrailleuse Troika ; les Kryll qui l’entourent le protègent et peuvent attaquer ses adversaires.',
      'The Locust general confronts Marcus Fenix and Dominic Santiago aboard the Lightmass Bomb train. He carries heavy armor and a Troika machine gun; the Kryll surrounding him provide protection and can attack his opponents.'
    )
  }));
}
