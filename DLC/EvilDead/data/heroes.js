// Evil Dead — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterExtraPatch() {
  return ([
    { id: 'pablo_evil_dead', name: 'Pablo Bolivar', cat: 'hacker', color: '#8e6e53', simpleName: 'Brujo Talisman Hit', secondaryName: 'Necronomicon Patch', defenseName: 'Trailer Door Brace', specialName: 'El Brujo Ritual Seal' },
    { id: 'kelly_evil_dead', name: 'Kelly Maxwell', cat: 'slayer', color: '#5d6d7e', simpleName: 'Meat Hammer Swing', secondaryName: 'Deadite Shotgun Blast', defenseName: 'Cabin Counter', specialName: 'Possession Breakout' },
    { id: 'ruby_evil_dead', name: 'Ruby Knowby', cat: 'horror', color: '#7b241c', weapon: 'dagger', simpleName: 'Kandarian Dagger', secondaryName: 'Book Page Curse', defenseName: 'Immortal Bargain', specialName: 'Dark One Contract' }
  ]);
}
