// Digital Circus — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('ragatha', 'Ragatha', 'horror', '#c0392b', 'needle', 'Ragdoll Stitch', 'Comfort Patch', 'Anxiety Cushion Guard', 'Dollhouse Recovery'),
    hero('gangle', 'Gangle', 'hacker', '#ff7675', 'ribbon', 'Ribbon Snap', 'Comedy Mask Swap', 'Tragedy Mask Guard', 'Emotion Loop Snare'),
    hero('kinger', 'Kinger', 'tactical', '#f1c40f', 'chess', 'Chess Piece Bash', 'Pillow Fort Counter', 'Royal Panic Guard', 'Checkmate Delusion'),
    hero('zooble', 'Zooble', 'slayer', '#9b59b6', 'limb', 'Modular Limb Hit', 'Body Part Throw', 'Detach Dodge', 'Abstract Reassembly')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('melee', 'Prank Rabbit Hit', 'Exit Door Fakeout', 'Cartoon Dodge', 'Abstract Taunt Loop', '#a29bfe'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('magic', 'Ringmaster Snap', 'Exit Door Illusion', 'Digital God Guard', 'Circus Reset Command', '#ff7675'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Abstracted Avatar', 105, 14, 6, '#111111', 'glitch_claws'),
      monster('Gloink Swarm', 70, 11, 8, '#e67e22', 'swarm'),
      monster('Exit Door Illusion', 95, 12, 4, '#dfe6e9', 'trap')
    ],
    bosses: [
      boss('Kaufmo Abstracted Core', 570, 20, 6, '#2d2d2d', 'glitch_body', 'Abstraction Spiral'),
      boss('Caine Broken Ringmaster', 590, 21, 7, '#ff7675', 'admin_magic', 'Circus Admin Reset')
    ]
  });
}
