// Dino Crisis — definitions consumed by src/game/narrativeSystems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createUniverseNarrativeArcs() {
  return ({
    id: 'dino_crisis_third_energy_incident',
    title: { fr: 'Arc Univers - Dino Crisis: incident Third Energy', en: 'Universe Arc - Dino Crisis: Third Energy Incident' },
    universes: ['Dino Crisis'],
    intro: { fr: 'Ibis Island reapparait dans le Nexus avec son alarme principale active. La Third Energy n ouvre pas une porte: elle deplace un ecosysteme prehistorique entier dans un laboratoire militaire.', en: 'Ibis Island reappears inside the Nexus with its main alarm active. Third Energy does not open a door: it displaces an entire prehistoric ecosystem into a military laboratory.' },
    missions: [
      { fr: 'Intro - Signal Kirk: recuperer les premiers fichiers Third Energy avant que le systeme ne classe les dinosaures comme securite locale.', en: 'Intro - Kirk Signal: recover the first Third Energy files before the system classifies dinosaurs as local security.' },
      { fr: 'Mission - Couloirs raptors: traverser les laboratoires avec key plugs, darts et munitions comptees.', en: 'Mission - Raptor Corridors: cross the laboratories with key plugs, darts, and counted ammunition.' },
      { fr: 'Interlude - Edward City derive: A.R.C.A. confirme que la crise commence a importer des fragments de Dino Crisis 2.', en: 'Interlude - Edward City Drift: A.R.C.A. confirms the crisis is importing Dino Crisis 2 fragments.' },
      { fr: 'Mission - Jungle temporelle: escorter les survivants TRAT pendant qu une meute alpha cherche la sortie Nexus.', en: 'Mission - Temporal Jungle: escort TRAT survivors while an alpha pack searches for the Nexus exit.' },
      { fr: 'Boss - T-Rex Third Energy: attirer le predateur dans une chambre de confinement et couper la frequence avant collision temporelle.', en: 'Boss - Third Energy T-Rex: lure the predator into a containment chamber and cut the frequency before temporal collision.' }
    ],
    outro: { fr: 'Le laboratoire cesse de hurler, mais la lecon reste ouverte: le temps n est pas une ressource exploitable sans retour de morsure.', en: 'The laboratory stops screaming, but the lesson remains open: time is not a resource to exploit without a bite back.' },
    reward: { fr: 'Relique Reacteur Third Energy + cache SORT', en: 'Third Energy Reactor Relic + SORT cache' }
  });
}

export function createCuratedCharacterNarrativeArcs() {
  return ({
    id: 'regina_ibis_extraction',
    stageId: 9224,
    heroId: 'regina',
    title: { fr: 'Arc Personnage - Regina: extraction Ibis Island', en: 'Character Arc - Regina: Ibis Island Extraction' },
    mode: 'Smash',
    difficulty: 'Personal',
    bossName: 'T-Rex de confinement',
    unlock: { type: 'level', value: 3 },
    intro: { fr: 'A.R.C.A. rouvre Ibis Island au moment ou les alarmes SORT se melangent au signal Third Energy. Regina entre pour recuperer les preuves, pas pour jouer les chasseuses.', en: 'A.R.C.A. reopens Ibis Island as SORT alarms mix with the Third Energy signal. Regina enters to recover proof, not to play hunter.' },
    missions: [
      { fr: 'Mission 1 - Key plug rouge: ouvrir une route de laboratoire sans liberer la meute enfermee derriere.', en: 'Mission 1 - Red Key Plug: open a lab route without releasing the pack locked behind it.' },
      { fr: 'Mission 2 - Secteur raptor: utiliser darts, leurres et tir mobile pour traverser une zone de poursuite.', en: 'Mission 2 - Raptor Sector: use darts, lures, and mobile fire to cross a pursuit zone.' },
      { fr: 'Mission 3 - Extraction Kirk: recuperer les donnees Third Energy avant que le T-Rex ne deforme la sortie Nexus.', en: 'Mission 3 - Kirk Extraction: recover Third Energy data before the T-Rex bends the Nexus exit.' }
    ],
    outro: { fr: 'Regina sort avec les preuves et une regle claire: l anomalie doit etre fermee avant de devenir attraction.', en: 'Regina leaves with the proof and a clear rule: the anomaly must be closed before it becomes an attraction.' },
    reward: { fr: 'Apparence Regina SORT Ibis + key plug rouge', en: 'Ibis SORT Regina Skin + red key plug' },
    rewardItemId: 'char_regina_sort_ibis'
  });
}

export function createCuratedCharacterNarrativeArcs2() {
  return ({
    id: 'dylan_edward_city_route',
    stageId: 9225,
    heroId: 'dylan',
    title: { fr: 'Arc Personnage - Dylan: route Edward City', en: 'Character Arc - Dylan: Edward City Route' },
    mode: 'Tactics',
    difficulty: 'Personal',
    bossName: 'Giganotosaurus de derive',
    unlock: { type: 'clears', value: 6 },
    intro: { fr: 'La Breche recolle Edward City a une jungle prehistorique. Dylan sait qu un soldat ne vaut rien s il gagne la route en abandonnant les survivants.', en: 'The Breach stitches Edward City to a prehistoric jungle. Dylan knows a soldier is worthless if he wins the route by abandoning survivors.' },
    missions: [
      { fr: 'Mission 1 - Route TRAT: former une ligne de tir et sauver les signatures civiles avant fermeture du passage.', en: 'Mission 1 - TRAT Route: form a firing line and save civilian signatures before the passage closes.' },
      { fr: 'Mission 2 - Paula fantome: suivre une trace future sans provoquer de paradoxe Third Energy.', en: 'Mission 2 - Ghost Paula: follow a future trace without causing a Third Energy paradox.' },
      { fr: 'Mission 3 - Chute du Giganotosaurus: tenir le terrain assez longtemps pour extraire la ville indexee.', en: 'Mission 3 - Giganotosaurus Fall: hold the field long enough to extract the indexed city.' }
    ],
    outro: { fr: 'Dylan transforme la retraite en sauvetage. A.R.C.A. archive Edward City comme avertissement: un futur sauve de force peut encore blesser le present.', en: 'Dylan turns retreat into rescue. A.R.C.A. archives Edward City as warning: a future saved by force can still wound the present.' },
    reward: { fr: 'Apparence Dylan TRAT + balise Edward City', en: 'TRAT Dylan Skin + Edward City beacon' },
    rewardItemId: 'char_dylan_trat'
  });
}

export function createCuratedCharacterNarrativeArcs3() {
  return ({
    id: 'rick_third_energy_lockout',
    stageId: 9226,
    heroId: 'rick_dc',
    title: { fr: 'Arc Personnage - Rick: verrou Third Energy', en: 'Character Arc - Rick: Third Energy Lockout' },
    mode: 'RPG',
    difficulty: 'Personal',
    bossName: 'Console Kirk recodee',
    unlock: { type: 'level', value: 3 },
    intro: { fr: 'Les portes d Ibis Island changent de codes a chaque impulsion. Rick entre dans le systeme pour prouver que Dino Crisis n est pas qu une poursuite: c est aussi une panne scientifique.', en: 'Ibis Island doors change codes with every pulse. Rick enters the system to prove Dino Crisis is not only a chase: it is also a scientific failure.' },
    missions: [
      { fr: 'Mission 1 - Terminal SORT: recuperer les droits d acces sans ouvrir les cages de specimens.', en: 'Mission 1 - SORT Terminal: recover access rights without opening specimen cages.' },
      { fr: 'Mission 2 - Boucle key card: casser une sequence de portes que le Sans-Auteur utilise pour enfermer l escouade.', en: 'Mission 2 - Key Card Loop: break a door sequence the Authorless uses to trap the squad.' },
      { fr: 'Mission 3 - Arret du reacteur: couper la Third Energy avant que le laboratoire ne copie une autre epoque.', en: 'Mission 3 - Reactor Shutdown: cut Third Energy before the lab copies another era.' }
    ],
    outro: { fr: 'Rick ferme la console et laisse une route propre derriere l equipe. A.R.C.A. classe le verrouillage comme victoire de support, pas comme detail technique.', en: 'Rick closes the console and leaves a clean route behind the team. A.R.C.A. classifies the lockout as a support victory, not a technical detail.' },
    reward: { fr: 'Apparence Rick Terminal SORT + verrou Third Energy', en: 'SORT Terminal Rick Skin + Third Energy lock' },
    rewardItemId: 'char_rick_third_energy'
  });
}

export function createSkinCatalog() {
  return ({
    id: 'char_regina_sort_ibis',
    heroId: 'regina',
    name: { fr: 'Regina SORT Ibis', en: 'Ibis SORT Regina' },
    colors: { primaryColor: '#a52a2a', secondaryColor: '#ff6b56' }
  });
}

export function createSkinCatalog2() {
  return ({
    id: 'char_dylan_trat',
    heroId: 'dylan',
    name: { fr: 'Dylan TRAT', en: 'TRAT Dylan' },
    colors: { primaryColor: '#2f6b43', secondaryColor: '#f1c40f' }
  });
}

export function createSkinCatalog3() {
  return ({
    id: 'char_rick_third_energy',
    heroId: 'rick_dc',
    name: { fr: 'Rick Verrou Third Energy', en: 'Third Energy Lockout Rick' },
    colors: { primaryColor: '#e74c3c', secondaryColor: '#39c5bb' }
  });
}
