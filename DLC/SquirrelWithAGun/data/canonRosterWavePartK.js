// Squirrel with a Gun — definitions consumed by src/game/canonRosterWavePartK.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRows({ r, t }) {
  return (r('squirrel-with-a-gun','Squirrel with a Gun','https://squirrelwithagun.com/',['Squirrel - Pistol Build','Squirrel - SMG Build','Squirrel - Shotgun Build'],['Agent','Sniper Agent','Security Drone'],['Elite Agent','Tank','Father'],'Mother Helicopter',['Golden Acorn','Pistol','Remote-Control Car'],[t('Acorn Parkour','collecter les glands'),t('Recoil Puzzle House','utiliser le recul pour monter'),'Agent Compound Escape'],{continuity:'Jeu de Dee Dee Creations ; trois builds du meme ecureuil.',adaptationRule:'Ne pas inventer trois ecureuils ; comedie physique et armes stylisees.',visualAnchor:'ecureuil realiste stylise, banlieue lumineuse et agents en costume'}));
}
