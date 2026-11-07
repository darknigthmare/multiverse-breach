// PUBG — definitions consumed by src/game/canonRosterWavePartJ.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRows({ r, t }) {
  return (r('pubg','PUBG','https://pubg.com/en',['Assault Survivor','Scout Survivor','Medic Survivor'],['Rival Survivor','Sniper Detection Marker','Vehicle Trial Ghost'],['Red Zone Drill','Airdrop Navigation','Blue Zone Rotation'],'Final Circle',['Level 3 Helmet','Pan','First Aid Kit'],[t('Training Grounds Target Range','toucher les cibles'),t('Erangel Driving Course','finir le slalom'),t('Final Circle Survival Trial','rester couvert sans attaquer')],{aliases:['PLAYERUNKNOWNS BATTLEGROUNDS'],continuity:'PUBG contemporain ; aucun personnage narratif invente.',adaptationRule:'Avatars originaux ; stages sans combat.',visualAnchor:'casque niveau 3, parachute et Blue Zone'}));
}
