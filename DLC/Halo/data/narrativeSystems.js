// Halo — definitions consumed by src/game/narrativeSystems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createUniverseNarrativeArcs() {
  return ({
    id: 'halo_installation_04_containment',
    title: { fr: 'Arc Univers - Halo: confinement Installation 04', en: 'Universe Arc - Halo: Installation 04 Containment' },
    universes: ['Halo'],
    intro: { fr: 'Une section de l Installation 04 reapparait dans le Nexus avec son vrai danger: Covenant en poursuite, protocoles Forerunner actifs et spores Parasite qui cherchent une sortie.', en: 'A section of Installation 04 reappears inside the Nexus with its real danger: Covenant pursuit, active Forerunner protocols, and Flood spores looking for an exit.' },
    missions: [
      { fr: 'Intro - Signal Cortana: identifier pourquoi l anneau ne repond plus aux protocoles UNSC.', en: 'Intro - Cortana Signal: identify why the ring no longer answers UNSC protocols.' },
      { fr: 'Mission - Cartographe silencieux: securiser une carte Forerunner pendant que les Elites et Sentinelles se disputent le controle.', en: 'Mission - Silent Cartographer: secure a Forerunner map while Elites and Sentinels fight for control.' },
      { fr: 'Interlude - Infection detectee: A.R.C.A. confirme que le Parasite ne doit jamais atteindre la Cite-Mosaique.', en: 'Interlude - Infection Detected: A.R.C.A. confirms the Flood must never reach Mosaic City.' },
      { fr: 'Mission - Couloirs de confinement: bruler les formes de combat avant qu elles contaminent une autre Trame.', en: 'Mission - Containment Corridors: burn combat forms before they infect another Thread.' },
      { fr: 'Boss - Scarab recode: abattre une machine Covenant marquee par le Sans-Auteur avant activation de l anneau.', en: 'Boss - Recoded Scarab: destroy an Authorless-marked Covenant machine before ring activation.' }
    ],
    outro: { fr: 'L anneau reste une arme, pas un miracle. A.R.C.A. archive Halo comme protocole de guerre, de sacrifice et de confinement absolu.', en: 'The ring remains a weapon, not a miracle. A.R.C.A. archives Halo as a protocol of war, sacrifice, and absolute containment.' },
    reward: { fr: 'Relique Cartographe silencieux + skin Installation 04', en: 'Silent Cartographer Relic + Installation 04 skin' }
  });
}

export function createCuratedCharacterNarrativeArcs() {
  return ({
    id: 'chief_living_ring',
    stageId: 9203,
    heroId: 'masterchief',
    title: { fr: 'Arc Personnage - Sierra 117: anneau vivant', en: 'Character Arc - Sierra 117: Living Ring' },
    mode: 'Tactics',
    difficulty: 'Personal',
    bossName: 'Scarab Covenant recode',
    unlock: { type: 'level', value: 3 },
    intro: {
      fr: 'La Breche a ouvert une cicatrice dans une section de l Installation 04. Des signatures Covenant, des Sentinelles Forerunner et un echo du Parasite se melangent autour d un fragment Cortana. Pour John-117, l objectif reste simple: securiser l anneau, empecher la contamination de sortir et ramener l escouade vivante.',
      en: 'The Breach has opened a scar through a section of Installation 04. Covenant signatures, Forerunner Sentinels, and a Flood echo mix around a Cortana fragment. For John-117, the objective remains simple: secure the ring, prevent the contamination from escaping, and bring the squad back alive.'
    },
    missions: [
      {
        fr: 'Mission 1 - Zone d atterrissage Alpha: recuperer une balise Warthog M12, repousser Grunts et Jackals, puis installer une bulle de bouclier UNSC pour stabiliser le premier couloir de l anneau.',
        en: 'Mission 1 - Landing Zone Alpha: recover an M12 Warthog beacon, push back Grunts and Jackals, then deploy a UNSC bubble shield to stabilize the ring first corridor.'
      },
      {
        fr: 'Mission 2 - Cartographe silencieux: escorter l eclat de matrice Cortana vers une console Forerunner pendant que des Elites Minor et des Sentinelles recodees tentent d isoler le Chief.',
        en: 'Mission 2 - Silent Cartographer: escort the Cortana matrix shard to a Forerunner console while Elite Minors and recoded Sentinels try to isolate the Chief.'
      },
      {
        fr: 'Mission 3 - Couloir du Parasite: purger les spores de Trame avant qu elles ne copient la logique du Flood; utiliser grenade plasma et chargeur M6D pour couper les formes infectees de leur noyau.',
        en: 'Mission 3 - Flood Corridor: purge Thread spores before they copy Flood logic; use plasma grenades and the M6D magazine to sever infected forms from their core.'
      }
    ],
    outro: {
      fr: 'Le Scarab recode tombe avant de graver le Sans-Auteur sur l anneau. Cortana conserve une coordonnee propre, A.R.C.A. classe John-117 comme protocole de rempart Halo, et la Trame Halo reste lisible: UNSC, Covenant, Forerunner, Parasite, sans dilution multivers gratuite.',
      en: 'The recoded Scarab falls before branding the Authorless onto the ring. Cortana keeps a clean coordinate, A.R.C.A. classifies John-117 as a Halo bulwark protocol, and the Halo Thread remains readable: UNSC, Covenant, Forerunner, Flood, without random multiverse dilution.'
    },
    reward: { fr: 'Apparence MJOLNIR Installation 04 + Balise Echo 419', en: 'Installation 04 MJOLNIR Skin + Echo 419 Beacon' },
    rewardItemId: 'char_masterchief_atrium'
  });
}

export function createSkinCatalog() {
  return ({
    id: 'char_masterchief_atrium',
    heroId: 'masterchief',
    name: { fr: 'MJOLNIR Installation 04', en: 'Installation 04 MJOLNIR' },
    colors: { primaryColor: '#6aa84f', secondaryColor: '#63d7ff' }
  });
}
