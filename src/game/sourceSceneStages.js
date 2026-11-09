/** Source-locked scenes. Grids/timing are explicit tactical adaptations, NOT art certification. */
const text = (fr, en) => ({ fr, en });
const command = (id, x, y, fr, en, requires = [], extra = {}) => ({
  id, cell: { x, y }, label: text(fr, en), requires, ...extra
});
const commonAdaptation = text(
  'Reconstruction tactique en grille : distances, tours, dégâts et positions sont adaptés. Seul le protagoniste requis participe ; les équipiers restent hors scène. Les commandes de mission remplacent armes, objets et événements crossover. Décors procéduraux et sprites existants : fidélité artistique non certifiée.',
  'Tactical grid reconstruction: distances, turns, damage and positions are adapted. Only the required protagonist participates; teammates stay off-scene. Mission commands replace crossover weapons, items and events. Procedural scenery and existing sprites: artistic fidelity is not certified.'
);
const base = (id, key, universe, heroId, incarnation, name, nameFr) => ({
  id, sourceSceneId: key, universe, mode: 'Tactics', difficulty: 'Hard', unlockClears: 0,
  name, nameFr, incarnation, canonStatus: 'Source-locked tactical adaptation; artistic review pending',
  visualReviewStatus: 'pending', sourceSceneParty: 'required-protagonist-only',
  requiredTeam: { type: 'character', heroId, firstClearOnly: false, freeReplayAfterArc: false, allowAnchor: true },
  tacticsBattlefieldId: key, enemyRosterExclusive: true,
  disableItems: true, gameplayAdaptation: commonAdaptation.en
});

export const SOURCE_SCENE_STAGES = [
  {
    ...base(50101, 'sulaco_cargo_airlock_1986', 'Aliens', 'ripley_aliens',
      'Aliens (1986) — Sulaco cargo hangar finale',
      'Sulaco — Cargo Airlock', 'Sulaco — sas du hangar'),
    requiredLeadInStageId: 3, bossName: 'Alien Queen', enemyRoster: ['Alien Queen'],
    referenceUrl: 'https://www.20thcenturystudios.com/movies/aliens',
    visualAnchor: 'Industrial cargo hangar; yellow loader, floor airlock, ladder and service grating. No hive, eggs or atmospheric processor.',
    sceneLead: { id: 'ripley_aliens', universe: 'Aliens' }, threatName: 'Alien Queen',
    briefing: {
      fr: { objective: 'Ripley seule : rejoignez le chargeur, saisissez la Reine, amenez-la au sas et ouvrez la trappe intérieure. Dégagez-vous du chargeur, ouvrez le sas extérieur, remontez puis refermez. Bishop retient Newt pendant la décompression. Aucun dégât ordinaire ne termine cette rencontre.', adaptation: commonAdaptation.fr + ' Le sauvetage de Newt dans le processeur (mission 3) doit être terminé. Bishop et Newt sont des repères protégés, pas des combattants. Limite adaptée : 32 tours du protagoniste.' },
      en: { objective: 'Ripley alone: reach the loader, grapple the Queen, bring her to the airlock and open the inner hatch. Release the loader, open the outer lock, climb out and seal it. Bishop holds Newt during decompression. Ordinary damage cannot complete this encounter.', adaptation: commonAdaptation.en + ' Complete the processor rescue (mission 3) first. Bishop and Newt are protected markers, not combatants. Adapted limit: 32 protagonist turns.' }
    },
    turnLimit: 32,
    field: { rows: 6, cols: 9, heroSpawns: [{ x: 0, y: 4 }],
      blocked: [[2,0],[2,1],[7,0],[7,1],[7,4],[7,5]],
      props: [{id:'dropship',x:2,y:0,w:1,h:2,label:'UD-4L',kind:'dropship'},
        {id:'loader',x:1,y:4,label:'LOADER',kind:'loader'},
        {id:'airlock',x:6,y:3,label:'AIRLOCK',kind:'airlock'},
        {id:'ladder',x:5,y:3,label:'LADDER',kind:'ladder'},
        {id:'newt',x:7,y:5,label:'NEWT / BISHOP',kind:'refuge'}] },
    commands: [
      command('loader',1,4,'Sangler le chargeur','Strap into loader'),
      command('grapple',4,2,'Saisir la Reine','Grapple the Queen',['loader']),
      command('inner',6,3,'Ouvrir la trappe intérieure','Open inner hatch',['grapple']),
      command('release',6,3,'Se dégager du chargeur','Release loader harness',['inner']),
      command('outer',6,3,'Ouvrir le sas extérieur','Open outer airlock',['release']),
      command('climb',5,3,'Remonter par l’échelle','Climb the ladder',['outer']),
      command('seal',5,3,'Refermer le sas','Seal the airlock',['climb'],{final:true})
    ],
    dangerPatterns: [[[3,1],[4,1],[5,1]],[[4,2],[5,2],[6,2]],[[3,3],[4,3],[4,4]]],
    threatCell: { x: 5, y: 2 }, accent: '#e2b438', material: 'hangar'
  },
  {
    ...base(50102, 'narcissus_escape_1979', 'Alien', 'ripley',
      'Alien (1979) — Narcissus final confrontation',
      'Narcissus — Final Escape', 'Narcissus — dernière fuite'),
    bossName: 'Big Chap Stalker', enemyRoster: ['Big Chap Stalker'],
    referenceUrl: 'https://www.20thcenturystudios.com/movies/alien',
    visualAnchor: 'Cramped white/grey shuttle cabin, pressure-suit locker, restrained seat, rear hatch and thruster controls. One adult Alien; Jones already sheltered. No Queen or pulse rifle.',
    sceneLead: { id: 'ripley', universe: 'Alien' }, threatName: 'Big Chap Stalker',
    briefing: {
      fr: { objective: 'Ripley seule : enfilez la combinaison et prenez le lance-grappin dans le casier. Attachez le harnais au siège, chassez l’Alien de sa cache avec la purge, ouvrez le sas, tirez le grappin, refermez puis allumez les propulseurs. Jones est déjà à l’abri. Pas de victoire par les PV.', adaptation: commonAdaptation.fr + ' Une fois le harnais attaché, les commandes restent au siège. Limite adaptée : 24 tours. Le scénario de tournage de juin 1978 diffère du film et ne valide pas ses détails exacts.' },
      en: { objective: 'Ripley alone: put on the pressure suit and take the grapple gun from the locker. Strap into the seat, flush the Alien from hiding, open the hatch, fire the grapple, close the hatch and ignite the thrusters. Jones is already sheltered. HP depletion cannot win.', adaptation: commonAdaptation.en + ' Once restrained, all remaining commands are at the seat. Adapted limit: 24 turns. The June 1978 shooting screenplay differs from the released film and does not verify its exact details.' }
    },
    turnLimit: 24,
    field: { rows: 5, cols: 7, heroSpawns: [{ x: 0, y: 2 }],
      blocked: [[0,0],[0,4],[1,0],[1,4],[5,0],[5,4],[6,0],[6,4],[6,1],[6,3]],
      props: [{id:'locker',x:1,y:1,label:'SUIT',kind:'locker'},
        {id:'seat',x:3,y:3,label:'CONTROLS',kind:'seat'},
        {id:'hatch',x:6,y:2,label:'HATCH',kind:'airlock'},
        {id:'pod',x:1,y:4,label:'JONES',kind:'refuge'}] },
    commands: [
      command('suit',1,1,'Enfiler la combinaison','Put on pressure suit'),
      command('grappleGun',1,1,'Prendre le lance-grappin','Take grapple gun',['suit']),
      command('harness',3,3,'Attacher le harnais','Fasten seat harness',['grappleGun']),
      command('flush',3,3,'Purger la cache de l’Alien','Flush the Alien from hiding',['harness']),
      command('hatch',3,3,'Ouvrir le sas','Open rear hatch',['flush']),
      command('harpoon',3,3,'Tirer le grappin','Fire grapple',['hatch']),
      command('close',3,3,'Refermer le sas','Close rear hatch',['harpoon']),
      command('thrust',3,3,'Allumer les propulseurs','Ignite thrusters',['close'],{final:true})
    ],
    dangerPatterns: [[[4,1],[4,2]],[[3,1],[3,2]],[[4,2],[5,2]]],
    threatCell: { x: 5, y: 1 }, accent: '#a9cad2', material: 'shuttle'
  },
  {
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
  }
];

export function resolveSourceScene(stage) {
  if (!stage || stage.customBattle || stage.isCustomBattle || stage.isCustom
    || stage.forceBaseArena || stage.dlcSuppressedArena) return null;
  return SOURCE_SCENE_STAGES.find(s => Number(stage.id) === s.id
    && stage.sourceSceneId === s.sourceSceneId && stage.universe === s.universe
    && stage.mode === s.mode && stage.incarnation === s.incarnation) || null;
}
export function getSourceSceneBattlefield(stage) {
  const scene = resolveSourceScene(stage);
  if (!scene) return null;
  return { id: scene.sourceSceneId, label: text(scene.nameFr, scene.name), objective:'source_scene',
    objectiveTarget:scene.commands.filter(c=>!c.repeatable).length, rows:scene.field.rows,cols:scene.field.cols,
    heroSpawns:scene.field.heroSpawns.map(p=>({...p})), monsterSpawns:[],bossSpawns:[],obstacles:[],
    tags:['sourceScene'], tiles:scene.field.blocked.map(([x,y])=>({x,y,type:'blocked'})) };
}
