// Rock of Ages — definitions consumed by src/game/canonRosterWavePartK.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRows({ r, t }) {
  return (r('rock-of-ages','Rock of Ages','https://store.steampowered.com/app/22230/Rock_of_Ages/',['Sisyphus','Atlas','Elpenor'],['War Elephant','Siege Tower','Explosive Cow'],['Leonidas','Napoleon','War Pope'],'Cronus',['War Boulder','Ballista','Trebuchet'],[t('Greek Boulder Race','atteindre la porte avant le rival'),t('Rococo Defense Build','placer les defenses'),t('Heavenly Gate Run','eviter les obstacles celestes')],{aliases:['Rock of Ages franchise'],continuity:'Anthologie explicite de la franchise ACE Team.',adaptationRule:'Rivaux historiques caricaturaux et course de rocher non sanglante.',visualAnchor:'collage historique, peintures animees et rochers geants'}));
}
