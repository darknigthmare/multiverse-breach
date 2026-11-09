// Dino Crisis — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('gail_dc', 'Gail', 'marine', '#38453c', 'gun', 'SORT Carbine Burst', 'Hardline Extraction', 'Mission First Guard', 'Kirk Capture Protocol'),
    hero('paula_dc2', 'Paula', 'horror', '#d67c6c', 'knife', 'Jungle Ambush Cut', 'Time-Shift Signal', 'Survivor Hide', 'Edward City Rescue'),
    hero('david_folk_dc2', 'David Folk', 'marine', '#6b4f3d', 'gun', 'TRAT Shotgun Blast', 'Heavy Door Breach', 'Raptor Line Hold', 'Temporal Rescue Charge')
  ]);
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Allosaurus Ambusher', 135, 16, 6, '#6f4e37', 'jaw'),
      monster('Inostrancevia Heavy', 155, 17, 4, '#565d40', 'tusk'),
      monster('Mosasaur Tank Breach', 125, 15, 5, '#2f6f73', 'water_bite')
    ],
    bosses: [
      boss('Doctor Kirk Security Override', 500, 18, 5, '#52616b', 'third_energy', 'Third Energy Lockout'),
      boss('Gigantosaurus Final Pursuer', 720, 27, 4, '#3c2f25', 'jaw', 'Edward City Devour')
    ]
  });
}
