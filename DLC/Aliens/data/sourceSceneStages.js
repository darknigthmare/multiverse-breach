// Aliens — definitions consumed by src/game/sourceSceneStages.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSourceSceneStages({ base, command, commonAdaptation }) {
  return ({
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
  });
}
