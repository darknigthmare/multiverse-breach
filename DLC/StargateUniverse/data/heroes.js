// Stargate Universe — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterExtraPatch() {
  return ([
    { id: 'chloe_sgu', name: 'Chloe Armstrong', cat: 'hacker', color: '#d7bde2', simpleName: 'Ancient Interface Touch', secondaryName: 'Alien Signal Echo', defenseName: 'Destiny Corridor Hide', specialName: 'Transformation Data Burst' },
    { id: 'greer_sgu', name: 'Ronald Greer', cat: 'marine', color: '#34495e', simpleName: 'Destiny Rifle Burst', secondaryName: 'Military Breach Clear', defenseName: 'Hold the Line', specialName: 'Stargate Room Lockdown' },
    { id: 'matt_scott_sgu', name: 'Matthew Scott', cat: 'tactical', color: '#566573', simpleName: 'Lt. Sidearm Shot', secondaryName: 'Kino Recon Route', defenseName: 'Away Team Cover', specialName: 'Destiny Jump Gate Plan' },
    { id: 'eli_wallace_sgu', name: 'Eli Wallace', cat: 'hacker', color: '#85c1e9', simpleName: 'Kino Tablet Ping', secondaryName: 'Ancient Math Shortcut', defenseName: 'Destiny Console Cover', specialName: 'Gate Address Simulation' }
  ]);
}
