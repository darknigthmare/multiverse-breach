// Borderlands — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterExtraPatch() {
  return ([
    { id: 'roland_bl', name: 'Roland', cat: 'marine', color: '#34495e', simpleName: 'Crimson Lance Rifle', secondaryName: 'Scorpio Turret', defenseName: 'Soldier Shield', specialName: 'Crimson Raiders Rally' },
    { id: 'mordecai_bl', name: 'Mordecai', cat: 'tactical', color: '#8e6e53', simpleName: 'Sniper Shot', secondaryName: 'Bloodwing Dive', defenseName: 'Hunter Roll', specialName: 'Bird of Prey Barrage' },
    { id: 'brick_bl', name: 'Brick', cat: 'slayer', color: '#c0392b', simpleName: 'Berserk Punch', secondaryName: 'Explosive Uppercut', defenseName: 'Bandit Hide Guard', specialName: 'Slab King Rampage' },
    { id: 'tiny_tina_bl', name: 'Tiny Tina', cat: 'hacker', color: '#9b59b6', simpleName: 'Tea Party Toss', secondaryName: 'Bunny Bomb', defenseName: 'Bunker Blanket', specialName: 'Badonkadonk Chain' }
  ]);
}
