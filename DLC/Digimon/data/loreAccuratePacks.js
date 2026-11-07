// Digimon — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('sora_biyomon', 'Sora & Biyomon', 'tactical', '#e74c3c', 'fire', 'Spiral Twister', 'Love Crest Rally', 'Birdramon Guard', 'Phoenixmon Ascension'),
    hero('mimi_palmon', 'Mimi & Palmon', 'hacker', '#2ecc71', 'plant', 'Poison Ivy Whip', 'Sincerity Heal Song', 'Togemon Guard', 'Rosemon Bloom'),
    hero('joe_gomamon', 'Joe & Gomamon', 'tactical', '#3498db', 'water', 'Marching Fishes', 'Reliability Rescue', 'Ikkakumon Guard', 'Zudomon Hammer Tide')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('digivice', 'Gabumon Blue Blaster', 'Friendship Crest Boost', 'Garurumon Guard', 'MetalGarurumon Barrage', '#74b9ff'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('laptop', 'Tentomon Electro Shocker', 'Digi-Analysis Hack', 'Knowledge Crest Guard', 'MegaKabuterimon Beam', '#81ecec'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Devimon Shadow Wing', 115, 15, 6, '#111111', 'dark_claw'),
      monster('Etemon Dark Network', 105, 14, 7, '#f1c40f', 'music'),
      monster('Myotismon Bat Swarm', 120, 16, 6, '#8e44ad', 'vampire_bite')
    ],
    bosses: [
      boss('Piedmon Dark Master', 640, 24, 8, '#d35400', 'trump_sword', 'Trump Sword Finale'),
      boss('Apocalymon Data Collapse', 800, 30, 3, '#2c3e50', 'data_void', 'Darkness Zone Reboot')
    ]
  });
}
