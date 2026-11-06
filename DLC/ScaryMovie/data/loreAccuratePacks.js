// Scary Movie — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('brenda_meeks', 'Brenda Meeks', 'horror', '#8e44ad', 'bat', 'Cinema Seat Swing', 'Reality TV Counter', 'Loud Survival Guard', 'Parody Final Girl Assist'),
    hero('ray_wilkins', 'Ray Wilkins', 'slayer', '#2980b9', 'knife', 'Absurd Knife Feint', 'Locker Room Dash', 'Comedy Dodge', 'Slasher Logic Break'),
    hero('gail_hailstorm', 'Gail Hailstorm', 'tactical', '#f1c40f', 'camera', 'News Camera Flash', 'Live Broadcast Trap', 'Media Shield', 'Breaking News Escape')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('melee', 'Final Girl Swing', 'Parody Clue Reveal', 'Awkward Dodge', 'Scary Logic Break', '#ffeaa7'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('melee', 'Slacker Punch', 'Smoke Cloud Confusion', 'Couch Hide Guard', 'Wassup Chain Call', '#55efc4'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Ghostface Parody Stalker', 75, 12, 7, '#f5f5f5', 'knife'),
      monster('Possessed Joke Prop', 65, 10, 8, '#e67e22', 'prop'),
      monster('Awkward Police Extra', 85, 9, 5, '#2980b9', 'baton')
    ],
    bosses: [
      boss('Doofy Reveal Killer', 520, 18, 6, '#dfe6e9', 'knife', 'Parody Mask Reveal'),
      boss('Tabloid Horror Mashup', 560, 19, 5, '#e74c3c', 'gag_trap', 'Genre Rule Collapse')
    ]
  });
}
