// RoboCop — definitions consumed by src/game/wardrobeOfficialR14.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createWardrobeNamedPacksR14({ L }) {
  return (Object.freeze({id:'r14-robocop-damaged-body',sourceId:'nacon-damaged',sourceWork:'RoboCop: Rogue City (2023) — Damaged skin',universe:'RoboCop',actorId:'alex_murphy_robocop',sourceMode:'ROGUE_CITY_MURPHY_FILM1987_INSPIRED',
 items:Object.freeze([Object.freeze({key:'r14-robocop-damaged',name:'Damaged',nature:'official-model',component:'body-model',focus:L('Aspect endommagé inspiré de la fin du film de 1987 : relever casque, visage visible, impacts et panneaux sur le modèle Rogue City. Ne pas supposer de nouvelles blessures ni confondre avec l’armure bleue du deuxième film.','Damaged appearance inspired by the 1987 film ending: record helmet, exposed face, impacts and panels on the Rogue City model. Do not invent wounds or conflate the second film’s blue armor.')})])}));
}

export function createWardrobeResearchR14({ research }) {
  return (research('RoboCop','alex_murphy_robocop','r14-vanguard-components','nacon-vanguard-research','SOURCE_DETAILS_NOT_VERIFIED','La fiche Vanguard est identifiée par son titre : rechercher sa liste et ses vues pour distinguer armure, palette et finition de l’Auto-9.','The Vanguard listing is identified by title; obtain its item list and views to distinguish armor, palette and Auto-9 finish.'));
}
