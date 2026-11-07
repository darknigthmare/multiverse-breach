// Rosario + Vampire — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('mizore_shirayuki', 'Mizore Shirayuki', 'horror', '#74b9ff', 'ice', 'Ice Claw Shard', 'Stalker Snow Bind', 'Frozen Mist Guard', 'Yuki-Onna Blizzard'),
    hero('yukari_sendo', 'Yukari Sendo', 'hacker', '#a29bfe', 'wand', 'Witch Glyph Shot', 'Basin Drop Spell', 'Magic Hat Guard', 'Prodigy Circle'),
    hero('gin_morioka', 'Gin Morioka', 'slayer', '#95a5a6', 'claws', 'Werewolf Dash', 'Newspaper Flash Feint', 'Beast Guard', 'Full Moon Sprint')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('melee', 'Human Courage Strike', 'Rosary Support Pulse', 'Ghoul Restraint Guard', 'Vampire Blood Awakening', '#ffeaa7'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('claws', 'Succubus Claw Swipe', 'Charm Wing Rush', 'Dream Mist Guard', 'Kurumu Love Dive', '#fd79a8'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Yokai Academy Bully', 85, 12, 6, '#7f8c8d', 'claws'),
      monster('Snow Woman Familiar', 80, 13, 6, '#74b9ff', 'ice'),
      monster('Witchcraft Doll Swarm', 70, 12, 7, '#a29bfe', 'magic')
    ],
    bosses: [
      boss('Inner Moka Blood Seal', 600, 24, 8, '#e74c3c', 'vampire_kick', 'Rosary Release Kick'),
      boss('Fairy Tale Commander', 580, 21, 6, '#6c5ce7', 'monster_army', 'Yokai War Order')
    ]
  });
}
