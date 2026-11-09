// System of a Down — definitions consumed by src/game/narrativeSystems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createUniverseNarrativeArcs() {
  return ({
    id: 'soad_toxicity_protest_stage',
    title: { fr: 'Arc Univers - System of a Down: scene Toxicity', en: 'Universe Arc - System of a Down: Toxicity Stage' },
    universes: ['System of a Down'],
    intro: { fr: 'Une scene de protestation apparait dans le Nexus: les ecrans diffusent des ordres contradictoires, les riffs changent de mesure et la foule de resonance refuse de marcher droit.', en: 'A protest stage appears inside the Nexus: screens broadcast contradictory orders, riffs change meter, and the resonance crowd refuses to march straight.' },
    missions: [
      { fr: 'Intro - Signal Toxicity: identifier les broadcasts qui transforment la colere en bruit manipulable.', en: 'Intro - Toxicity Signal: identify broadcasts turning anger into manipulable noise.' },
      { fr: 'Mission - Prison Song Siren: couper les sirenes de controle sans effacer le message de protestation.', en: 'Mission - Prison Song Siren: cut control sirens without erasing the protest message.' },
      { fr: 'Interlude - Chop Suey Pulse: la mesure se casse et A.R.C.A. perd le tempo pendant huit battements.', en: 'Interlude - Chop Suey Pulse: the meter breaks and A.R.C.A. loses tempo for eight beats.' },
      { fr: 'Mission - Aerials Falling Sky: stabiliser une montee melodique avant qu elle ne devienne chute de Trame.', en: 'Mission - Aerials Falling Sky: stabilize a melodic rise before it becomes Thread collapse.' },
      { fr: 'Boss - Toxicity Riot Core: vaincre le noyau qui recycle protestation, satire et guerre en propagande vide.', en: 'Boss - Toxicity Riot Core: defeat the core recycling protest, satire, and war into empty propaganda.' }
    ],
    outro: { fr: 'La scene reste chaotique, mais le message redevient lisible. A.R.C.A. classe SOAD comme Trame de rupture: elle derange pour empecher le mensonge de devenir cadence.', en: 'The stage remains chaotic, but the message becomes readable again. A.R.C.A. classifies SOAD as a rupture Thread: it disturbs to prevent lies from becoming cadence.' },
    reward: { fr: 'Relique Banniere anti-guerre + pick rupture tempo', en: 'Anti-War Banner Relic + tempo break pick' }
  });
}

export function createCuratedCharacterNarrativeArcs() {
  return ({
    id: 'soad_frontline_voice_broadcast',
    stageId: 9232,
    heroId: 'serj_tankian',
    title: { fr: 'Arc Personnage - SOAD Voice: broadcast brise', en: 'Character Arc - SOAD Voice: Broken Broadcast' },
    mode: 'RPG',
    difficulty: 'Personal',
    bossName: 'Propagande a voix vide',
    unlock: { type: 'level', value: 3 },
    intro: { fr: 'Le Sans-Auteur vole les refrains de protestation pour en faire des ordres sans sens. Frontline Voice doit rendre la cassure audible sans transformer la colere en slogan automatique.', en: 'The Authorless steals protest choruses and turns them into meaningless orders. Frontline Voice must make the rupture audible without turning anger into automatic slogan.' },
    missions: [
      { fr: 'Mission 1 - Murmure et cri: retrouver le contraste vocal avant que la Trame ne normalise toute emotion.', en: 'Mission 1 - Whisper and Scream: recover vocal contrast before the Thread normalizes every emotion.' },
      { fr: 'Mission 2 - Toxicity feed: interrompre une diffusion qui recycle la peur politique en bruit de fond.', en: 'Mission 2 - Toxicity Feed: interrupt a broadcast recycling political fear into background noise.' },
      { fr: 'Mission 3 - Voix vide: vaincre la propagande qui imite la protestation sans porter de memoire.', en: 'Mission 3 - Empty Voice: defeat propaganda imitating protest without carrying memory.' }
    ],
    outro: { fr: 'La voix ne devient pas propre; elle redevient vraie. A.R.C.A. archive la dissonance comme protection contre les recits trop lisses.', en: 'The voice does not become clean; it becomes true again. A.R.C.A. archives dissonance as protection against overly smooth narratives.' },
    reward: { fr: 'Apparence Frontline Voice Toxicity + micro rupture', en: 'Toxicity Frontline Voice Skin + rupture mic' },
    rewardItemId: 'char_soad_frontline_voice'
  });
}

export function createCuratedCharacterNarrativeArcs2() {
  return ({
    id: 'soad_staccato_guitar_measure',
    stageId: 9233,
    heroId: 'daron_malakian',
    title: { fr: 'Arc Personnage - SOAD Guitar: mesure brisee', en: 'Character Arc - SOAD Guitar: Broken Measure' },
    mode: 'Smash',
    difficulty: 'Personal',
    bossName: 'Metronome de controle',
    unlock: { type: 'clears', value: 5 },
    intro: { fr: 'Une faille impose une mesure militaire droite a la scene SOAD. Staccato Guitar entre pour casser le metronome et rendre au riff son danger.', en: 'A breach imposes a straight military meter on the SOAD stage. Staccato Guitar enters to break the metronome and give the riff its danger back.' },
    missions: [
      { fr: 'Mission 1 - Riff angulaire: couper les drones qui marchent uniquement sur temps forts.', en: 'Mission 1 - Angular Riff: cut drones that march only on downbeats.' },
      { fr: 'Mission 2 - Relance absurde: changer de motif avant que le Sans-Auteur ne prevoie le solo.', en: 'Mission 2 - Absurd Restart: shift motif before the Authorless predicts the solo.' },
      { fr: 'Mission 3 - Metronome de controle: vaincre la machine qui veut rendre tous les riffs obeissants.', en: 'Mission 3 - Control Metronome: defeat the machine trying to make every riff obedient.' }
    ],
    outro: { fr: 'La mesure reste instable, donc vivante. A.R.C.A. classe la guitare staccato comme arme contre la cadence imposee.', en: 'The meter remains unstable, therefore alive. A.R.C.A. classifies staccato guitar as a weapon against imposed cadence.' },
    reward: { fr: 'Apparence Staccato Guitar + mediator syncopé', en: 'Staccato Guitar Skin + syncopated pick' },
    rewardItemId: 'char_soad_staccato_guitar'
  });
}

export function createCuratedCharacterNarrativeArcs3() {
  return ({
    id: 'soad_groove_bass_frontline',
    stageId: 9234,
    heroId: 'shavo_odadjian',
    title: { fr: 'Arc Personnage - SOAD Bass: ligne de front', en: 'Character Arc - SOAD Bass: Frontline Groove' },
    mode: 'Tactics',
    difficulty: 'Personal',
    bossName: 'Riot Core de basse vide',
    unlock: { type: 'level', value: 3 },
    intro: { fr: 'La scene Toxicity devient trop chaotique pour avancer. Groove Bass doit transformer la protestation en ligne tactique sans calmer ce qui doit rester en colere.', en: 'The Toxicity stage becomes too chaotic to advance. Groove Bass must turn protest into tactical line without calming what must remain angry.' },
    missions: [
      { fr: 'Mission 1 - Pulsation lourde: ancrer l escouade pendant une cascade de ruptures de tempo.', en: 'Mission 1 - Heavy Pulse: anchor the squad during a cascade of tempo breaks.' },
      { fr: 'Mission 2 - Banniere stable: proteger une zone de protestation pendant que les broadcasts ennemis la parasitent.', en: 'Mission 2 - Stable Banner: protect a protest zone while hostile broadcasts corrupt it.' },
      { fr: 'Mission 3 - Riot Core: vaincre le noyau qui transforme la foule en bruit sans direction.', en: 'Mission 3 - Riot Core: defeat the core turning the crowd into directionless noise.' }
    ],
    outro: { fr: 'La basse laisse une ligne au sol: pas une marche militaire, une route de resistance.', en: 'The bass leaves a line on the floor: not a military march, a resistance route.' },
    reward: { fr: 'Apparence Groove Bass Protest + ampli d ancrage', en: 'Protest Groove Bass Skin + anchor amp' },
    rewardItemId: 'char_soad_groove_bass'
  });
}

export function createSkinCatalog() {
  return ({
    id: 'char_soad_frontline_voice',
    heroId: 'serj_tankian',
    name: { fr: 'Frontline Voice Toxicity', en: 'Toxicity Frontline Voice' },
    colors: { primaryColor: '#b03a2e', secondaryColor: '#f1c40f' }
  });
}

export function createSkinCatalog2() {
  return ({
    id: 'char_soad_staccato_guitar',
    heroId: 'daron_malakian',
    name: { fr: 'Staccato Guitar Syncopé', en: 'Syncopated Staccato Guitar' },
    colors: { primaryColor: '#1c2833', secondaryColor: '#f1c40f' }
  });
}

export function createSkinCatalog3() {
  return ({
    id: 'char_soad_groove_bass',
    heroId: 'shavo_odadjian',
    name: { fr: 'Groove Bass Protest', en: 'Protest Groove Bass' },
    colors: { primaryColor: '#7d6608', secondaryColor: '#b03a2e' }
  });
}
