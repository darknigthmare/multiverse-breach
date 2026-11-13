// Half-Life — definitions consumed by src/game/sourceSceneStages.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSourceSceneStages({ base, command, commonAdaptation }) {
  return ({
    ...base(50103, 'blast_pit_test_silo_1998', 'Half-Life', 'freeman',
      'Half-Life (1998) — Blast Pit rocket test silo',
      'Blast Pit — Rocket Test Silo', 'Blast Pit — silo d’essai'),
    bossName: 'Tentacles — environmental threat', enemyRoster: [],
    referenceUrl: 'https://www.half-life.com/en/halflife/25th',
    mechanicsReference: 'https://github.com/ValveSoftware/halflife/blob/master/dlls/tentacle.cpp',
    visualAnchor: 'GoldSrc Black Mesa silo, three tall tentacle stalks, ring walkway, separate oxygen/fuel/power routes and protected test-fire console. Not the Black Mesa remake; no Combine.',
    sceneLead: { id: 'freeman', universe: 'Half-Life' }, threatName: 'Tentacles',
    briefing: {
      fr: { objective: 'Freeman seul : rétablissez oxygène, carburant et alimentation, dans l’ordre choisi. Rejoignez ensuite le poste d’essai, fermez la protection et déclenchez la combustion ; empruntez le passage libéré. Les tentacules restent une menace environnementale. Trois grenades de diversion déplacent leur attention pendant deux fins de tour.', adaptation: commonAdaptation.fr + ' Les trajets et étages du chapitre sont condensés en une grille ; les menaces utilisent des cases annoncées, pas une IA acoustique complète. Limite adaptée : 48 tours. Le sprite existant de Freeman n’est pas certifié HEV Mark IV ; son équipement HL2 est indisponible ici.' },
      en: { objective: 'Freeman alone: restore oxygen, fuel and power in any order. Reach the test booth, close the protective screen and fire the engine; use the cleared passage. Tentacles remain an environmental threat. Three distraction grenades redirect their attention for two turn endings.', adaptation: commonAdaptation.en + ' Chapter routes and floors are condensed into one grid; hazards use announced cells, not full acoustic AI. Adapted limit: 48 turns. The existing Freeman sprite is not certified HEV Mark IV; HL2 equipment is unavailable here.' }
    },
    turnLimit: 48,
    field: { rows: 7, cols: 9, heroSpawns: [{ x: 0, y: 3 }],
      blocked: [[3,2],[4,2],[5,2],[3,3],[4,3],[5,3],[3,4],[4,4],[5,4]],
      props: [{id:'oxygen',x:1,y:1,label:'O2',kind:'valve'},
        {id:'fuel',x:7,y:1,label:'FUEL',kind:'valve'},
        {id:'power',x:7,y:5,label:'POWER',kind:'generator'},
        {id:'booth',x:1,y:5,label:'TEST FIRE',kind:'booth'},
        {id:'pit',x:4,y:3,label:'SILO',kind:'pit'},
        {id:'passage',x:4,y:6,label:'EXIT',kind:'ladder'}] },
    commands: [
      command('oxygen',1,1,'Ouvrir l’oxygène','Restore oxygen'),
      command('fuel',7,1,'Ouvrir le carburant','Restore fuel'),
      command('power',7,5,'Rétablir l’alimentation','Restore power'),
      command('screen',1,5,'Fermer la protection du poste','Close booth screen',['oxygen','fuel','power']),
      command('ignite',1,5,'Déclencher l’essai moteur','Fire the test engine',['screen']),
      command('exit',4,6,'Emprunter le passage','Use the cleared passage',['ignite'],{final:true}),
      command('decoy',0,0,'Lancer une diversion sonore','Throw a noise decoy',[],{repeatable:true,anywhere:true})
    ],
    dangerPatterns: [[[2,2],[2,3],[2,4]],[[3,1],[4,1],[5,1]],[[6,2],[6,3],[6,4]],[[3,5],[4,5],[5,5]]],
    threatCell: { x: 4, y: 3 }, accent: '#df883e', material: 'silo'
  });
}
