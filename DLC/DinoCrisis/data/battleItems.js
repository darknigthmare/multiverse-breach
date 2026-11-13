// Dino Crisis — definitions consumed by src/game/battleItems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createBattleItemOverrides() {
  return ({
    pickups: [
      ['Patch hemostatique SORT', 'SORT Hemostatic Patch', 'Soin de terrain pour morsures et griffures: en melee il stabilise vite le heros, en tactique il devient une case de repli sous poursuite de raptor.'],
      ['Key plug Third Energy', 'Third Energy Key Plug', 'Cle de laboratoire: ouvre une route, verrouille une porte derriere l escouade ou coupe une ligne de charge ennemie.'],
      ['Dart tranquillisant', 'Tranquilizer Dart', 'Munition non letale SORT: ralentit un specimen rapide, casse une charge de raptor et donne le temps de repositionner l equipe.']
    ],
    summon: ['Equipe TRAT de couverture', 'TRAT Cover Team', 'Invocation temporaire: Dylan et une unite TRAT traversent la breche, posent un tir de couverture et escortent les signatures civiles hors de la zone Third Energy.'],
    ultimate: ['Rugissement T-Rex canalise', 'Channeled T-Rex Roar', 'Attaque ultime: A.R.C.A. redirige la poursuite du T-Rex vers la ligne ennemie, provoque une charge massive, puis referme la frequence Third Energy avant retour de chasse.']
  });
}
