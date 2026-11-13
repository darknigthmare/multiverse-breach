// La Petite Histoire de France — definitions consumed by src/game/canonRosterWavePartJ.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRows({ r, t }) {
  return (r('la-petite-histoire-de-france','La Petite Histoire de France','https://pro.m6.fr/w9/programme/2026-1/la-petite-histoire-de-france-70068585835889856',['Francois d Arc - 1430','Philippe Honore de Roche Saint-Pierre - 1695','Renata Plancher - 1810'],['Lost Royal Decree','Empty Family Purse','Tavern Rush'],['Audience Refused','Banquet Disaster','Imperial Inspection'],'La Grande Histoire',['Tavern Ledger','Royal Seal','Imperial Serving Tray'],[t('La taverne de 1430','memoriser les commandes'),t('Le salon de 1695','resoudre le protocole'),t('L auberge de 1810','associer chambres et bagages')],{aliases:['Petite histoire de France serie'],continuity:'Serie W9/M6, entree dedupliquee.',adaptationRule:'Tout non combattant ; aucun likeness des acteurs.',visualAnchor:'costumes de 1430, 1695 et 1810',allNonCombat:true}));
}
