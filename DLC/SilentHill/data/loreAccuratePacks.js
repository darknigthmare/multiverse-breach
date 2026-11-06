// Silent Hill — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('harry_mason', 'Harry Mason', 'horror', '#6f7d7a', 'flashlight', 'Flashlight Search', 'Radio Static Alert', 'Parent Resolve Guard', 'Alessa Trail Revelation'),
    hero('cybil_bennett', 'Cybil Bennett', 'tactical', '#355c7d', 'gun', 'Service Pistol Shot', 'Brahms Police Cover', 'Possession Resist', 'Good Ending Intervention'),
    hero('maria_sh2', 'Maria', 'horror', '#c26f8c', 'knife', 'Echo Tease Cut', 'Labyrinth Door Lure', 'Memory Double Guard', 'Born From A Wish')
  ]);
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Insane Cancer Mass', 130, 14, 3, '#7a5f55', 'body_slam'),
      monster('Schism Blade Splitter', 105, 15, 5, '#9b6f62', 'split_head'),
      monster('Siam Bound Pair', 125, 16, 4, '#7d6960', 'double_grab')
    ],
    bosses: [
      boss('Valtiel Ritual Warden', 560, 19, 5, '#7c2d22', 'ritual_blade', 'Halo of the Sun Reset'),
      boss('Scarlet Doll Memory', 540, 20, 4, '#b03a2e', 'porcelain_claws', 'Dollhouse Blood Waltz')
    ]
  });
}
