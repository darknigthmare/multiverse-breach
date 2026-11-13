// Friday the 13th — definitions consumed by src/game/canonRosterWavePartM.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRows({ r }) {
  return (r('friday_13th', 'Friday the 13th', 'https://www.paramountpictures.com/movies/friday-the-13th',
    ['Alice Hardy', 'Tommy Jarvis', { id: 'ginny', name: 'Ginny Field', nonCombat: true, objective: 'Decode the cabin map and coordinate every counselor evacuation.' }],
    ['Cabin Power Failure', 'Forest Snare Route', 'Lake Fog Pursuit'], ['Pamela Voorhees', 'Jason — Sack Mask', 'Jason — Hockey Mask'],
    { id: 'camp_lockdown', name: 'Camp Crystal Lake Lockdown', nonCombat: true, objective: 'Repair the car, call for help and evacuate the camp.', visualAnchor: 'Moonlit camp map, radio tower, repaired car and safe evacuation indicators.' },
    ['Counselor Radio', 'Car Battery', 'Cabin Map'], ['Camp Crystal Lake Cabins', 'Pine Forest Escape', 'Lake Road Evacuation'],
    { aliases: ['Vendredi 13', 'Jason Voorhees'], continuity: 'Friday the 13th film-series continuity', rule: 'No actor likeness, gore or graphic injury. Young counselors are fully clothed escape participants; Jason is a clean fictional silhouette and never shown harming anyone.', anchor: 'Moonlit summer camp, pine fog, wooden cabins, lake reflections and masked slasher silhouette.' }));
}
