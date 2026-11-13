// Saw — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('lawrence_gordon', 'Lawrence Gordon', 'horror', '#95a5a6', 'saw', 'Surgical Saw Cut', 'Bathroom Chain Choice', 'Doctor Resolve Guard', 'Final Apprentice Reveal'),
    hero('adam_stanheight', 'Adam Stanheight', 'horror', '#7f8c8d', 'camera', 'Darkroom Camera Flash', 'Tape Clue Counter', 'Desperate Hide', 'What Do You Do Trap'),
    hero('detective_tapp', 'Detective Tapp', 'tactical', '#34495e', 'gun', 'Investigator Pistol Shot', 'Trap Map Pursuit', 'Obsessive Guard', 'Jigsaw Manhunt')
  ]);
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Razor Wire Victim Echo', 75, 12, 5, '#7f8c8d', 'razor'),
      monster('Pig Mask Apprentice', 90, 13, 6, '#78281f', 'knife'),
      monster('Shotgun Collar Device', 85, 15, 4, '#34495e', 'trap')
    ],
    bosses: [
      boss('John Kramer Jigsaw Voice', 560, 18, 4, '#1b2631', 'trap_room', 'I Want To Play A Game'),
      boss('Bathroom Chain Trial', 620, 20, 2, '#95a5a6', 'rust_saw', 'Make Your Choice')
    ]
  });
}
