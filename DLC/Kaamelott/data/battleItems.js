// Kaamelott — definitions consumed by src/game/battleItems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createBattleItemOverrides() {
  return ({
    pickups: [
      ['Etincelle d Excalibur', 'Excalibur Spark', 'Fragment de legitimite royale: en melee elle renforce une frappe de commandement, en tactique elle stabilise une case autour du chef d escouade.'],
      ['Dossier de Table Ronde', 'Round Table Dossier', 'Ordres contradictoires mais exploitables: brouille une cible, revele un objectif secondaire et transforme une reunion ratee en avantage de terrain.'],
      ['Ration de Karadoc', 'Karadoc Ration', 'Ressource de survie de Vannes: soigne, reduit la fatigue et rappelle qu une quete sacree ne tient pas si personne ne prevoit le casse-croute.']
    ],
    summon: ['Conseil de Kaamelott', 'Kaamelott Council', 'Invocation temporaire: Arthur, Leodagan, Perceval et Karadoc saturent la zone d ordres, de disputes et d intuitions absurdes qui ralentissent les ennemis.'],
    ultimate: ['Quete du Graal en vrac', 'Disordered Grail Quest', 'Attaque ultime: la Table Ronde lance une operation impossible, les ennemis recoivent trois plans incompatibles et la Trame se referme sur leur confusion.']
  });
}
