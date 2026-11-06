// Toy Soldiers — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Zeppelin',
      weapon: 'bomb_racks_and_machine_guns',
      special: 'Toy Airship Bombing Run',
      phases: ['Strafes with gondola guns and drops bombs', 'Loses armor panels and enters a smoking crash pattern below 35 percent health'],
      lore: {
        fr: 'Le Zeppelin est un boss vehicule du Toy Soldiers classique.',
        en: 'The Zeppelin is a vehicle boss from classic Toy Soldiers.'
      },
      referenceUrl: 'https://toysoldiers.fandom.com/wiki/Bosses_(Classic)',
      visualAnchor: 'Exact World War I toy-airship construction, miniature painted metal, gondola guns and bomb racks from the classic game.'
    },
    {
      name: 'Uber Tank',
      weapon: 'heavy_cannon_and_side_guns',
      special: 'Clockwork Siege Barrage',
      phases: ['Advances with cannon and side-gun fire', 'A broken track exposes the miniature engine and slows the final phase'],
      lore: {
        fr: 'L Uber Tank fournit le second combat de siege sans technologie Nexus.',
        en: 'The Uber Tank provides the second siege battle without Nexus technology.'
      },
      referenceUrl: 'https://www.toysoldiersgame.com/',
      visualAnchor: 'Oversized World War I toy tank with riveted painted metal, tracks, main cannon and side guns in the game s miniature scale.'
    }
  ]);
}
