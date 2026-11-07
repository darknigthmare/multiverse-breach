// The Ball — definitions consumed by src/game/canonRosterWavePartK.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRows({ r, t }) {
  return (r('the-ball','The Ball','https://store.steampowered.com/app/35460/The_Ball/',['Unnamed Archaeologist','Ball Push Configuration','Ball Pull Configuration'],['Mummy','Fireball Zombie','Oztoc Guardian'],['Giant Mummy','Stone Brute','Arena Guardian'],'Oztoc Defense Core',['The Ball','Ancient Glove','Oztoc Torch'],[t('Pehua Caverns Roll Trial','guider la Ball dans les portes'),t('Oztoc Weight Puzzle','placer les masses sur les dalles'),t('Guardian Raceway','finir le parcours sans collision')],{continuity:'Jeu The Ball de Teotl Studios uniquement.',adaptationRule:'Un heros anonyme et deux configurations de la Ball clairement etiquetees ; stages de physique non combattants.',visualAnchor:'ruines mesoamericaines souterraines, glove magnetique et sphere de pierre'}));
}
