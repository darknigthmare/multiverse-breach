// Cowboy Bebop — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'cowboy_bebop',
    universe: 'Cowboy Bebop',
    mediaType: 'series',
    faction: 'sciFi',
    mode: 'Tactics',
    difficulty: 'Hard',
    titleFr: 'Cowboy Bebop',
    stage: 'Mars Red Dragon Bounty',
    boss: 'Vicious Red Dragon Syndicate',
    hero: ['spike_spiegel', 'Spike Spiegel', 'tactical'],
    allies: [['faye_valentine', 'Faye Valentine', 'slayer'], ['jet_black', 'Jet Black', 'marine']],
    monsters: ['Red Dragon Gunman', 'Space Pirate Bounty', 'ISSP Security Drone'],
    bosses: ['Mad Pierrot Tongpu', 'Asimov Red Eye Berserker'],
    gear: [['spike_jericho', 'Jericho 941 R', 'Jericho 941 R', { atk: 10, spd: 1 }], ['faye_glock', 'Fayes Glock 30', 'Glock 30 de Faye', { atk: 8, spd: 2 }], ['bebop_bounty_file', 'Bebop Bounty File', 'Dossier de prime du Bebop', { def: 5, hp: 60 }]],
    event: ['evt_bebop_bell_peppers', 'Bell Peppers and Beef', 'Poivrons et boeuf', 'Jet patches the crew up with whatever remains in the galley before the next bounty.', 'Jet remet l equipe sur pied avec ce qui reste dans la cuisine avant la prochaine prime.'],
    theme: 'solar-system bounty hunting, jazz timing, old syndicate wounds, and the broke crew of the Bebop',
    desc: { en: 'Bounties, fuel, ammunition, and unresolved pasts matter more than generic space heroics.', fr: 'Les primes, le carburant, les munitions et les passifs non resolus comptent plus qu un heroisme spatial generique.' },
    motif: 'shipdeck',
    colors: ['#16232b', '#030506', '#e6bc4f'],
    stageVariants: [['RPG', 'Bebop Hangar Bounty Briefing', 'Medium', 'Asimov Red Eye Berserker'], ['Smash', 'Mars Cathedral Ballad', 'Very Hard', 'Vicious Red Dragon Syndicate']]
  });
}
