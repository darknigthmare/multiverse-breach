// Freddi Fish — definitions consumed by src/game/canonRosterWavePartI.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPartI() {
  return ({
    key: 'freddi_fish', universe: 'Freddi Fish', aliases: ['Freddi Fish franchise'], allNonCombat: true,
    continuity: 'Humongous Entertainment Freddi Fish adventure series',
    adaptationRule: 'Dialogue, clues, collection and environmental puzzles only. Rivals and suspects are never hit or framed as combat enemies.',
    visualAnchor: 'Cheerful hand-painted underwater coves, bright coral, soft bubbles and readable cartoon silhouettes recreated as original fan art.',
    referenceUrl: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/283940/manuals/freddifish1-manual.pdf?t=1578016205', colors: ['#167fa3', '#062c45', '#ffd35a'], motif: 'clue', mode: 'Trial', difficulty: 'Easy',
    heroes: [
      { id: 'freddi', name: 'Freddi Fish', visualAnchor: 'Small golden-yellow fish with blue fins, long eyelashes and curious friendly expression.' },
      { id: 'luther', name: 'Luther', visualAnchor: 'Small bright-green fish with yellow fins, round eyes and playful expression.' },
      { id: 'cousin_calico', name: 'Cousin Calico', visualAnchor: 'Friendly orange-yellow older fish with purple accessories and calm guide posture.' }
    ],
    enemies: ['Kelp Maze', 'Bubble Current', 'Jellyfish Gate'],
    bosses: ['Boss & Spongehead Clue Confrontation', 'Royal Crown Maze', 'Haunted School Puzzle'],
    worldBoss: { id: 'squidfather_case', name: 'Squidfather Case Finale', visualAnchor: 'A clue board of shells, kelp routes and a friendly squid-shaped shadow resolving into the recovered object.' },
    gear: ['Purple Sea Urchin Notebook', 'Message Bottle', 'Treasure Map'],
    stages: ['Grandma Grouper’s Kelp Seeds', 'Case of the Haunted Schoolhouse', 'Creatures of Coral Cove Park'],
    event: { id: 'missing_conch', name: 'The Missing Conch Clue', frName: 'L’indice de la conque disparue' }
  });
}
