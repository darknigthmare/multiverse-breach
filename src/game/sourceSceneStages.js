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
  },

  // 1987 film finale: the Hunter is beaten by terrain and timing, not depleted HP.
  // The board compresses the river, night ambush, counterweight and escape route.
  {
    ...base(50104, 'predator_1987_jungle_finale', 'Predator', 'dutch',
      'Predator (1987) — Dutch / Jungle Hunter final confrontation',
      'Predator 1987 — Jungle Finale', 'Predator 1987 — duel final dans la jungle'),
    bossName: 'Jungle Hunter', enemyRoster: ['Jungle Hunter'],
    referenceUrl: 'https://www.20thcenturystudios.com/movies/predator',
    referenceUrls: [
      'https://www.20thcenturystudios.com/movies/predator',
      'https://d23.com/20th-century-fox-spooktacular-1980s-predator/'
    ],
    visualAnchor: 'Predator (1987) nighttime jungle and riverbank: mud-covered Dutch, improvised wooden bow and stakes, signal fire, suspended log counterweight, original Jungle Hunter with silver biomask and shoulder caster, then wrist self-destruct. No City Hunter smart disc, Feral bone mask, or alien hive.',
    sceneLead: { id: 'dutch', universe: 'Predator' }, threatName: 'Jungle Hunter',
    briefing: {
      fr: {
        objective: 'Dutch seul : utilise la boue froide pour masquer sa chaleur, fabrique arc et pieux, prépare une bûche à contrepoids, puis attire le Jungle Hunter avec un brasier. Endommage son camouflage, traverse la rivière qui enlève ta boue, dévie-le vers le piège et libère la bûche. Dès son autodestruction activée, rejoins l abri avant la fin du compte à rebours. Le tuer en diminuant ses PV ne remplace pas le piège.',
        adaptation: commonAdaptation.fr + ' Neuf commandes de scénario condensent le duel final du film en grille 2D. La rivière enlève la protection thermique ; le piège ne peut être déclenché avant la préparation. Échelle, distances, agressions et minuteur (8 fins de tour après la bûche) sont des adaptations, non la chorégraphie exacte du film. Maximum : 38 tours. Assets existants non certifiés visuellement.'
      },
      en: {
        objective: 'Dutch alone: use cold mud to hide your heat, make a bow and stakes, rig a log counterweight, then lure the Jungle Hunter with a signal fire. Disrupt his cloak, cross the river and lose your mud cover, draw him toward the trap and release the log. Once his wrist self-destruct starts, reach shelter before the countdown ends. Ordinary HP damage cannot replace the trap.',
        adaptation: commonAdaptation.en + ' Nine story commands compress the film finale into a 2D grid. The river removes thermal concealment; the counterweight requires preparation. Scale, distances, hazards and countdown (8 turn endings after the log) adapt the film rather than reproduce exact choreography. Maximum: 38 turns. Existing art is not visually certified.'
      }
    },
    turnLimit: 38, selfDestructTurnLimit: 8,
    field: {
      rows: 7, cols: 9, heroSpawns: [{ x: 0, y: 3 }],
      blocked: [[2,0],[4,0],[7,0],[2,6],[4,6],[7,6]],
      props: [
        { id: 'mud', x: 1, y: 3, label: 'MUD', kind: 'mud' },
        { id: 'bow', x: 3, y: 1, label: 'BOW / STAKES', kind: 'camp' },
        { id: 'counterweight', x: 6, y: 2, label: 'LOG', kind: 'trap' },
        { id: 'signalFire', x: 5, y: 4, label: 'FIRE', kind: 'fire' },
        { id: 'river', x: 5, y: 5, label: 'RIVER', kind: 'river' },
        { id: 'bait', x: 6, y: 3, label: 'AMBUSH', kind: 'trap' },
        { id: 'shelter', x: 0, y: 1, label: 'COVER', kind: 'refuge' }
      ]
    },
    commands: [
      command('mud', 1, 3, 'Camouflage à la boue froide', 'Apply cold mud camouflage'),
      command('bow', 3, 1, 'Fabriquer l arc et les pieux', 'Make bow and stakes', ['mud']),
      command('rig', 6, 2, 'Préparer la bûche à contrepoids', 'Rig the log counterweight', ['bow']),
      command('lure', 5, 4, 'Allumer le brasier de défi', 'Light the challenge fire', ['rig']),
      command('disrupt', 6, 4, 'Briser le camouflage du chasseur', 'Disable the hunter cloak', ['lure']),
      command('wash', 5, 5, 'Traverser la rivière, perdre la boue', 'Cross river and lose mud cover', ['disrupt']),
      command('bait', 6, 3, 'Attirer le chasseur près du piège', 'Draw the hunter toward the trap', ['wash']),
      command('crush', 6, 2, 'Libérer le contrepoids sur le chasseur', 'Drop the counterweight on the hunter', ['bait']),
      command('escape', 0, 1, 'Se mettre à couvert de l explosion', 'Take shelter from the explosion', ['crush'], { final: true })
    ],
    dangerPatterns: [
      [[3,4],[4,4]], [[5,4],[6,4]], [[6,3],[5,3]], [[4,2],[5,2]]
    ],
    threatCell: { x: 7, y: 3 }, accent: '#c8ad65', material: 'jungle'
  },
  // Predator 2 (1990) is a different hunt: Harrigan DISARMS the roof countdown
  // before this separate trophy-ship finale. No 1987 wrist-bomb victory template.
  {
    ...base(50105, 'predator_2_lost_tribe_ship_1990', 'Predator', 'harrigan_predator',
      'Predator 2 (1990) — Los Angeles subterranean Lost Tribe ship / trophy chamber',
      'Predator 2 — Lost Tribe Ship', 'Predator 2 — vaisseau du clan perdu'),
    bossName: 'City Hunter Predator', enemyRoster: ['City Hunter Predator'],
    referenceUrl: 'https://www.20thcenturystudios.com/movies/predator-2',
    referenceUrls: [
      'https://www.20thcenturystudios.com/movies/predator-2',
      'https://catalog.afi.com/Film/58654-PREDATOR-2'
    ],
    visualAnchor: 'Predator 2 (1990) climax, Los Angeles subterranean Predator spacecraft. Dark ribbed techno-organic chamber and trophy wall with many skulls including a Xenomorph skull as a static cameo; injured City Hunter with smart disc, Lost Tribe witnesses, Greyback presenting a Raphael Adolini 1715 flintlock, then ship engine launch. No jungle log trap, 1987 Jungle Hunter, Alien Queen or playable Xenomorph opponent.',
    sceneLead: { id: 'harrigan_predator', universe: 'Predator' }, threatName: 'City Hunter Predator',
    briefing: {
      fr: {
        objective: 'Harrigan seul : après avoir désarmé le dispositif au poignet du City Hunter sur le toit, poursuis-le dans son vaisseau souterrain de Los Angeles. Traverse la salle des trophées, résiste au filet, libère-toi avec le disque intelligent récupéré puis vaincs le City Hunter avec cette arme. Le clan reprend son mort sans combattre ; reçois de l Ancien un pistolet à silex marqué Raphael Adolini 1715. Dès l allumage des moteurs, gagne la sortie avant le souffle du décollage. Aucun massacre du clan ni victoire par PV.',
        adaptation: commonAdaptation.fr + ' Le duel du toit et son autodestruction désamorcée sont des événements antérieurs, pas un nouveau compte à rebours ici. Salle des trophées, filet, duel, Ancien et échappée condensés en une carte 9×7. Le pistolet est une preuve narrative, pas un équipement gratuit ajouté à l inventaire. Décollage sur 8 fins de tour, limite totale de 38 tours, graphismes et gestes non certifiés 1:1.'
      },
      en: {
        objective: 'Harrigan alone: after disarming the City Hunter wrist device on the roof, follow the wounded hunter into its underground Los Angeles ship. Cross the trophy room, survive the net, cut free with the recovered smart disc and defeat the City Hunter using that disc. The Lost Tribe retrieves its fallen member rather than attacking; receive Greyback elder’s Raphael Adolini 1715 flintlock. When the engines ignite, reach the cavern exit before take-off blast. No clan massacre or ordinary HP victory.',
        adaptation: commonAdaptation.en + ' The rooftop duel and already-disarmed wrist device happen before this scene, not another countdown here. Trophy room, net, duel, elder and escape are compressed into one 9×7 tactical map. The flintlock is narrative evidence, NOT a free inventory item. An eight-turn launch window and 38-turn total are gameplay adaptations; visuals and choreography are not certified 1:1.'
      }
    },
    turnLimit: 38, shipLaunchTurnLimit: 8,
    field: {
      rows: 7, cols: 9, heroSpawns: [{ x: 0, y: 3 }],
      blocked: [[2,0],[3,0],[4,0],[8,0],[8,1],[8,5],[8,6],[2,6],[3,6]],
      props: [
        { id: 'entrance', x: 1, y: 3, label: 'HATCH', kind: 'airlock' },
        { id: 'trophies', x: 2, y: 2, label: 'TROPHIES', kind: 'trophy' },
        { id: 'net', x: 3, y: 3, label: 'NET', kind: 'net' },
        { id: 'duel', x: 5, y: 3, label: 'DUEL', kind: 'arena' },
        { id: 'tribe', x: 6, y: 2, label: 'CLAN', kind: 'refuge' },
        { id: 'engine', x: 6, y: 4, label: 'ENGINES', kind: 'generator' },
        { id: 'tunnel', x: 0, y: 5, label: 'CAVE EXIT', kind: 'ladder' }
      ]
    },
    commands: [
      command('enter', 1, 3, 'Franchir le sas du vaisseau', 'Enter the hidden ship'),
      command('trophies', 2, 2, 'Observer la salle des trophées', 'Inspect the trophy chamber', ['enter']),
      command('net', 3, 3, 'Survivre à l embuscade au filet', 'Survive the net ambush', ['trophies']),
      command('cut_net', 3, 3, 'Couper le filet avec le Smart Disc', 'Cut the net with the smart disc', ['net']),
      command('duel', 5, 3, 'Vaincre le City Hunter avec son disque', 'Defeat City Hunter using its own disc', ['cut_net']),
      command('tribe', 6, 2, 'Laisser le clan reprendre son mort', 'Let the Lost Tribe reclaim its fallen hunter', ['duel']),
      command('gift', 6, 2, 'Recevoir le pistolet Adolini 1715', 'Receive the Adolini 1715 flintlock', ['tribe']),
      command('ignite', 6, 4, 'Repérer le démarrage des moteurs', 'Detect the engines powering up', ['gift']),
      command('escape', 0, 5, 'Fuir le souffle du vaisseau', 'Escape the ship take-off blast', ['ignite'], { final: true })
    ],
    dangerPatterns: [
      [[3,2],[4,2]], [[4,3],[5,3]], [[3,4],[4,4]], [[5,2],[5,4]]
    ],
    launchDangerPatterns: [
      [[6,4],[5,4]], [[5,4],[4,4]], [[4,4],[3,4]], [[3,3],[2,3]]
    ],
    threatCell: { x: 5, y: 3 }, accent: '#84c7b6', material: 'ship'
  }
,
  // 1719 story continuity: herb suppresses thermal tracking; the bone mask
  // redirects the Feral Predator's own guided projectile at a bog target.
  // The target dies from the returned projectile, not generic HP subtraction.
  {
    ...base(50106, 'prey_1719_naru_feral_bog', 'Predator', 'naru',
      'Prey (2022) — 1719 Comanche territory, Naru versus Feral Predator bog finale',
      'Prey — Naru and the Bog', 'Prey — Naru et le marécage'),
    bossName: 'Feral Predator', enemyRoster: ['Feral Predator'],
    referenceUrl: 'https://www.20thcenturystudios.com/movies/prey',
    referenceUrls: [
      'https://www.20thcenturystudios.com/movies/prey',
      'https://www.whattowatch.com/features/prey-ending-explained'
    ],
    visualAnchor: 'Prey (2022), Comanche territory in 1719: young Naru in period-accurate earth-toned clothing with rope-tethered hatchet and Raphael’s flintlock, Sarii the dog sheltered; Feral Predator has lean body, bone/skull biomask, archaic projectile bolt launcher and distinctive shield, not Jungle Hunter silver mask or City Hunter smart disc. Bog and positioned targeting mask turn Feral’s own projectile against its head. No flying plasma cannon, Yautja starship duel or crossover adversaries.',
    sceneLead: { id: 'naru', universe: 'Predator' }, threatName: 'Feral Predator',
    briefing: {
      fr: {
        objective: 'Naru seule, en 1719 : après avoir compris les limites de la vision thermique du Feral Predator et perdu Taabe, mange la plante médicinale refroidissante, prépare le piège avec le trappeur survivant, utilise le pistolet de Raphaël pour distraire et blesser le chasseur, récupère son masque de visée en os, place-le face au marécage, attire-y le chasseur et détourne son propre projectile grâce aux pointeurs du masque. Reprends la preuve du duel et rejoins le village avec Sarii. Aucun adversaire crossover et aucune victoire par simple baisse de PV.',
        adaptation: commonAdaptation.fr + ' Le duel final et le retour au village sont condensés en une grille 9×7. Le marécage a déjà été découvert auparavant ; le masque dirige les projectiles, il ne lance pas de tir de plasma. La plante réduit la signature thermique sans supprimer les autres moyens de repérage. Le chien Sarii n est pas un combattant. Total adapté : 48 tours ; positions, vitesse et dégâts non certifiés cinématographiquement.'
      },
      en: {
        objective: 'Naru alone, in 1719: after learning the Feral Predator’s thermal weakness and losing Taabe, eat the cooling medicinal herb, arrange a trap using the surviving French trapper, use Raphael’s flintlock to wound and distract the hunter, steal its bone targeting mask, aim that mask at the bog, draw the hunter into the mire and let its own guided projectile return to its head. Recover proof of the duel and return to the Comanche village with Sarii. No crossover enemies or HP-only victory.',
        adaptation: commonAdaptation.en + ' The film finale and village return are compressed to one 9×7 grid. Naru previously discovered the bog; the bone mask GUIDES the Feral Predator’s projectiles, it does not fire plasma. The herb lowers thermal visibility without preventing hearing or direct sight. Sarii is a protected noncombat marker. Adapted limit: 48 turns; geometry, speeds and damage are not film-certified.'
      }
    },
    turnLimit: 48,
    field: {
      rows: 7, cols: 9, heroSpawns: [{ x: 0, y: 3 }],
      blocked: [[2,0],[4,0],[7,0],[0,6],[3,6],[8,6]],
      props: [
        { id: 'herb', x: 1, y: 3, label: 'HERB', kind: 'herb' },
        { id: 'trapper', x: 2, y: 4, label: 'TRAPPER', kind: 'bait' },
        { id: 'flintlock', x: 3, y: 3, label: 'FLINTLOCK', kind: 'flintlock' },
        { id: 'mask', x: 4, y: 3, label: 'BONE MASK', kind: 'bone_mask' },
        { id: 'mask_mount', x: 6, y: 2, label: 'AIMING MASK', kind: 'target' },
        { id: 'bog', x: 6, y: 4, label: 'BOG', kind: 'bog' },
        { id: 'trophy', x: 6, y: 4, label: 'PROOF', kind: 'trophy' },
        { id: 'village', x: 0, y: 2, label: 'VILLAGE / SARII', kind: 'refuge' }
      ]
    },
    commands: [
      command('herb', 1, 3, 'Prendre la plante refroidissante', 'Take the cooling medicinal herb'),
      command('bait', 2, 4, 'Préparer le piège avec le trappeur', 'Set bait using the surviving trapper', ['herb']),
      command('flintlock', 3, 3, 'Tirer avec le pistolet de Raphaël', 'Fire Raphael’s flintlock', ['bait']),
      command('take_mask', 4, 3, 'Récupérer le masque de visée en os', 'Recover the bone targeting mask', ['flintlock']),
      command('set_mask', 6, 2, 'Placer le masque face au marécage', 'Set the targeting mask facing the bog', ['take_mask']),
      command('bog', 6, 4, 'Attirer le Feral Predator dans la vase', 'Lure the Feral Predator into the bog', ['set_mask']),
      command('redirect', 5, 4, 'Détourner son propre projectile vers sa tête', 'Redirect its guided bolt into its head', ['bog']),
      command('trophy', 6, 4, 'Récupérer le trophée du duel', 'Recover the victory trophy', ['redirect']),
      command('return', 0, 2, 'Retourner au village avec Sarii', 'Return to the village with Sarii', ['trophy'], {final:true})
    ],
    dangerPatterns: [
      [[3,3],[4,3]], [[5,3],[5,4]], [[5,4],[6,4]], [[3,4],[4,4]]
    ],
    threatCell: { x: 7, y: 3 }, accent: '#c9a66a', material: 'prey'
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
