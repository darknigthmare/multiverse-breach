// Source-scene definitions consumed by src/game/sourceSceneStages.js.
// Inject shared builders without importing back into the aggregate catalog.

export function createPredator1987SourceSceneStage({ base, command, commonAdaptation }) {
  return ({
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
  });
}

// Keep Harrigan in the legacy Predator roster universe for save and party identity.
export function createPredator2SourceSceneStage({ base, command, commonAdaptation }) {
  return ({
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
  });
}
