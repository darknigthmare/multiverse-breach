// R.E.P.O. — definitions consumed by src/game/canonRosterWavePartK.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRows({ r, t }) {
  return (r('repo','R.E.P.O.','https://store.steampowered.com/app/3241660/R_E_P_O/',['Orange Semibot','Blue Semibot','Green Semibot'],['Shadow Child','Upscream','Apex Predator'],['Headman','Huntsman','Reaper'],'Trudge',['C.A.R.T. Trolley','Extraction Point','Valuable Tracker'],[t('Service Station Retrieval','porter les objets sans les casser'),t('Museum Physics Sort','trier les valuables par masse'),t('Extraction Countdown','charger le quota avant la fermeture')],{aliases:['REPO','R E P O'],continuity:'Jeu Semiwork ; trois couleurs du meme Semibot, aucune classe inventee.',adaptationRule:'Physique, transport et extraction prioritaires ; stages non combattants.',visualAnchor:'petits Semibots colores, valuables fragiles et horreur sombre'}));
}
