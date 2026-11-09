// Jet Set Radio — definitions consumed by src/game/canonRosterWavePartJ.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRows({ r, t }) {
  return (r('jet-set-radio','Jet Set Radio','https://store.steampowered.com/app/205950/Jet_Set_Radio/',['Beat - casque vert','Gum - tenue verte','Corn - bonnet et veste'],['Rokkaku Patrol','Rokkaku Riot Unit','Rokkaku Helicopter'],['Poison Jam','Noise Tanks','Love Shockers'],'Goji Rokkaku',['Inline Skates','Spray Can','Pirate Radio'],[t('Shibuya-cho Tag Rush','taguer les murs'),t('Benten-cho Grind Line','finir sans chute'),t('Grind Square Soul Hunt','collecter les Graffiti Souls')],{aliases:['Jet Grind Radio','JSR'],continuity:'Jeu original et reedition HD.',adaptationRule:'Rivaux de style ; stages sans combat.',visualAnchor:'cel-shading, rollers, graffiti et Tokyo-to'}));
}
