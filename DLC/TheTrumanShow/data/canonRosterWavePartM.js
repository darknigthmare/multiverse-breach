// The Truman Show — definitions consumed by src/game/canonRosterWavePartM.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRows({ r }) {
  return (r('truman_show', 'The Truman Show', 'https://www.paramountpictures.com/movies/the-truman-show',
    ['Truman Burbank', 'Sylvia / Lauren Garland', 'Marlon'], ['Continuity Error', 'Hidden Camera Blind Spot', 'Scripted Traffic Loop'], ['Radio Tracking Puzzle', 'Seahaven Exit Blockade', 'Studio Storm Sequence'],
    { id: 'christof_control', name: 'Christof’s Control Room', nonCombat: true, objective: 'Expose the broadcast controls, cross the studio sea and reach the exit door.', visualAnchor: 'Moon-shaped studio control room overlooking the artificial ocean and exit staircase; original faces only.' },
    ['Sailboat Compass', 'Hidden Camera Map', 'Exit Door Key'], ['Seahaven Morning Loop', 'Mococoa Broadcast Set', 'Studio Ocean Exit'],
    { aliases: ['Truman show'], continuity: 'The Truman Show (1998) film continuity', allNonCombat: true, faction: 'drama', difficulty: 'Normal', rule: 'Investigation, observation, sailing and exit Trials only. No actor likeness, combat, stalking mechanics or invasion of private real-person data.', anchor: 'Pastel Seahaven streets, concealed studio cameras, artificial horizon, sailboat and black exit doorway.' }));
}
