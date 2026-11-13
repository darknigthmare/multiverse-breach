// Alien — definitions consumed by src/game/sourceSceneStages.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSourceSceneStages({ base, command, commonAdaptation }) {
  return ({
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
  });
}
