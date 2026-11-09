// The Simpsons — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterExpansion() {
  return ([
    { id: 'marge_simpsons', name: 'Marge Simpson', cat: 'hacker', color: '#3498db' },
    { id: 'lisa_simpsons', name: 'Lisa Simpson', cat: 'hacker', color: '#f4d03f' },
    { id: 'maggie_simpsons', name: 'Maggie Simpson', cat: 'horror', color: '#5dade2' },
    { id: 'ned_flanders', name: 'Ned Flanders', cat: 'tactical', color: '#27ae60' }
  ]);
}
