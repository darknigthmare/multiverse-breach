// Siren Head — definitions consumed by src/game/solarOppositesSirenStarWarsPack.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSirenHead({ action, fighter }) {
  return (fighter({
  id: 'siren_head',
  name: 'Siren Head',
  cat: 'horror',
  color: '#6b3828',
  accent: '#202020',
  weaponType: 'broadcast',
  stats: { hp: 172, atk: 16, def: 9, spd: 7 },
  simple: action('Number Station Burst', 'sound', 1.12),
  secondary: action('Stolen Voice Lure', 'fear', 1.9, { cd: 6 }),
  defense: action('Tree-Line Camouflage', 'dodge', 0, { dur: 2.3, reduce: 0.86 }),
  special: action('Emergency Broadcast Blackout', 'sound_aoe', 4.95, { color: '#b33b2e' }),
  equipment: ['Twin Organic Sirens', 'Mimetic Broadcast Archive', 'Camouflage Tissue'],
  incarnation: 'Trevor Henderson original solitary mimetic predator'
}));
}

export function createLongHorse({ action, fighter }) {
  return (fighter({
  id: 'long_horse',
  name: 'Long Horse',
  cat: 'tactical',
  color: '#d8d2bd',
  accent: '#3a332d',
  weaponType: 'omen',
  stats: { hp: 132, atk: 9, def: 10, spd: 7 },
  simple: action('Vertebral Warning Arc', 'spirit', 0.88),
  secondary: action('Disaster Omen', 'debuff', 1.2, { cd: 5 }),
  defense: action('Impossible Corner Retreat', 'dodge', 0, { dur: 2.6, reduce: 0.9 }),
  special: action('Patron Warning Across Worlds', 'support_aoe', 3.8, { color: '#d8d2bd' }),
  equipment: ['Infinite Vertebral Path', 'Cinnamon Omen Trace', 'Cross-Thread Warning'],
  incarnation: 'Trevor Henderson benevolent omen entity'
}));
}

export function createCartoonCat({ action, fighter }) {
  return (fighter({
  id: 'cartoon_cat',
  name: 'Cartoon Cat',
  cat: 'slayer',
  color: '#111111',
  accent: '#f3ead7',
  weaponType: 'rubber_hose',
  stats: { hp: 128, atk: 17, def: 6, spd: 9 },
  simple: action('Rubber-Hose Claw', 'melee', 1.18),
  secondary: action('Faux-Body Stretch', 'melee', 2.05, { cd: 6 }),
  defense: action('Old-Film Frame Skip', 'dodge', 0, { dur: 1.7, reduce: 0.88 }),
  special: action('Broadcast Cartoon Manifestation', 'horror_aoe', 5.0, { color: '#f3ead7' }),
  equipment: ['Faux Cartoon Body', 'Old-Media Portal', 'Elastic Claws'],
  incarnation: 'Trevor Henderson old-media manifestation'
}));
}

export function createSolarOppositesSirenStarWarsHeroExpansions({ cartoonCat, longHorse, sirenHead }) {
  return ([sirenHead, longHorse, cartoonCat]);
}

export function createSolarOppositesSirenStarWarsUniverseWave() {
  return ({
    key: 'siren_head',
    universe: 'Siren Head',
    mediaType: 'web',
    faction: 'horror',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    titleFr: 'Siren Head',
    stage: 'North American Forest Number Station',
    boss: 'False Distress Broadcast Relay',
    worldBoss: 'Siren Head Mimetic Hunt',
    hero: ['siren_head', 'Siren Head', 'horror'],
    allies: [
      ['long_horse', 'Long Horse', 'tactical'],
      ['cartoon_cat', 'Cartoon Cat', 'slayer']
    ],
    monsters: ['Tree-Line Mimic', 'Stolen Voice Echo', 'Number Station Lure'],
    bosses: ['Broadcast Relay Colossus', 'Old-Media Faux Body'],
    gear: [
      ['siren_number_recorder', 'Number Station Field Recorder', 'Enregistreur de station de nombres', { atk: 8, spd: 1 }],
      ['siren_camouflage_stake', 'Tree-Line Survey Stake', 'Piquet de releve forestier', { def: 7, hp: 50 }],
      ['siren_omen_trace', 'Long Horse Omen Trace', 'Trace de presage de Long Horse', { hp: 80, spd: 1 }]
    ],
    event: [
      'evt_siren_long_horse_warning',
      'Long Horse Warning',
      'Avertissement de Long Horse',
      'Long Horse bends through impossible corners to mark the only route whose voices were not copied by Siren Head.',
      'Long Horse se courbe par des angles impossibles pour signaler la seule route dont les voix n ont pas ete copiees par Siren Head.'
    ],
    theme: 'Trevor Henderson cryptid horror, rural disappearances, audio mimicry, impossible silhouettes, and old-media manifestations',
    desc: {
      en: 'Siren Head is treated as a solitary mimetic predator rather than an SCP or a mechanical robot. Its organic sirens imitate broadcasts and familiar voices while its body disappears against trees and utility structures. In Multiverse Breach, stolen A.R.C.A. distress calls let the entity hunt across portals; Long Horse warns survivors, while Cartoon Cat exploits the same media fractures for its own hostile manifestation.',
      fr: 'Siren Head est traite comme un predateur mimetique solitaire, et non comme un SCP ou un robot mecanique. Ses sirenes organiques imitent les emissions et les voix familieres tandis que son corps se confond avec les arbres et structures techniques. Dans Multiverse Breach, des appels de detresse A.R.C.A. voles lui permettent de chasser entre les portails; Long Horse avertit les survivants, tandis que Cartoon Cat exploite les memes fractures mediatiques pour sa propre manifestation hostile.'
    },
    motif: 'wasteland',
    colors: ['#211915', '#030302', '#9b4b35'],
    stageVariants: [
      ['RPG', 'Abandoned Cemetery Broadcast Trail', 'Very Hard', 'Tree-Line Mimic'],
      ['Smash', 'Dead Television Studio Manifestation', 'Expert', 'Old-Media Faux Body']
    ]
  });
}

export function createSolarOppositesSirenStarWarsLoreDb({ SOLAR_OPPOSITES_SIREN_STAR_WARS_UNIVERSE_WAVE, localized }) {
  return ({
    mediaType: 'web',
    faction: 'horror',
    title: localized('Siren Head', 'Siren Head'),
    desc: SOLAR_OPPOSITES_SIREN_STAR_WARS_UNIVERSE_WAVE[1].desc,
    theme: SOLAR_OPPOSITES_SIREN_STAR_WARS_UNIVERSE_WAVE[1].theme,
    stageName: SOLAR_OPPOSITES_SIREN_STAR_WARS_UNIVERSE_WAVE[1].stage,
    bossName: SOLAR_OPPOSITES_SIREN_STAR_WARS_UNIVERSE_WAVE[1].boss,
    worldBoss: SOLAR_OPPOSITES_SIREN_STAR_WARS_UNIVERSE_WAVE[1].worldBoss
  });
}

export function createSolarOppositesSirenStarWarsCharacterPlaques({ plaque }) {
  return (plaque({
    clearance: 'SH-NULL',
    rankFr: 'Anomalie mimetique solitaire',
    rankEn: 'Solitary mimetic anomaly',
    roleFr: 'Predateur sonore sous verrou de resonance',
    roleEn: 'Audio predator under resonance lock',
    callSign: 'Siren Head',
    originFr: 'Legende visuelle de Trevor Henderson - zones rurales et forestieres',
    originEn: 'Trevor Henderson visual legend - rural and wooded areas',
    dossierFr: 'Dans sa Trame d origine, Siren Head est un unique predateur organique, immense et emacie, dont le cou porte deux sirenes fusionnees a la chair et aux cables. Il n est ni un SCP ni un robot. Il se confond avec les arbres et poteaux, se deplace avec une vitesse contradictoire a sa silhouette et utilise alertes, stations de nombres, fragments musicaux, animaux ou voix humaines imitees pour isoler ses proies. Sa force vient moins d un duel frontal que de la certitude qu un appel familier peut etre un piege.',
    dossierEn: 'In its origin Thread, Siren Head is a single organic predator, immense and emaciated, with two sirens fused to flesh and cables atop its neck. It is neither an SCP nor a robot. It blends with trees and utility poles, moves with speed that contradicts its silhouette, and uses alerts, number stations, music fragments, animals, or copied human voices to isolate prey. Its power comes less from a direct duel than from the certainty that a familiar call may be a trap.',
    breachFr: 'La Premiere Breche lui donne acces aux archives audio des equipes disparues. Chaque portail devient alors un haut-parleur possible et chaque appel de secours une piste de chasse. A.R.C.A. ne recrute pas Siren Head: elle enferme une empreinte de son comportement dans une plaquette de resonance utilisable en simulation. Cette version jouable reste un outil dangereux, incapable de promettre une alliance. Sa mission personnelle consiste a detruire les relais copies par le Sans-Auteur avant que le vrai predateur ne puisse parler avec toutes les voix du Nexus.',
    breachEn: 'The First Breach grants it access to audio archives from missing teams. Every portal becomes a possible speaker and every distress call a hunting trail. A.R.C.A. does not recruit Siren Head: it seals a behavioral imprint inside a resonance plaque usable in simulation. This playable version remains a dangerous tool incapable of promising alliance. Its personal mission is to destroy relays copied by the Authorless before the true predator can speak with every voice in the Nexus.',
    doctrineFr: 'Mimique audio, camouflage forestier, rafale de station de nombres et brouillage des appels ennemis.',
    doctrineEn: 'Audio mimicry, forest camouflage, number-station burst, and hostile-call jamming.',
    threatFr: 'Risque A.R.C.A. maximal: ne jamais suivre une voix emise par la plaquette hors du perimetre de simulation.',
    threatEn: 'Maximum A.R.C.A. risk: never follow a voice emitted by the plaque outside the simulation perimeter.',
    tags: ['Siren Head', 'Trevor Henderson', 'Mimicry', 'Audio', 'Horror']
  }));
}

export function createSolarOppositesSirenStarWarsCharacterPlaques2({ plaque }) {
  return (plaque({
    clearance: 'TH-LH',
    rankFr: 'Entite de presage',
    rankEn: 'Omen entity',
    roleFr: 'Alerte interdimensionnelle et extraction',
    roleEn: 'Cross-dimensional warning and extraction',
    callSign: 'Long Horse',
    originFr: 'Mythos de Trevor Henderson - presage bienveillant',
    originEn: 'Trevor Henderson mythos - benevolent omen',
    dossierFr: 'Dans sa Trame d origine, Long Horse apparait comme un crane de cheval sans machoire inferieure prolonge par un cou vertebral apparemment sans fin. Son arrivee annonce un malheur mais ne le provoque pas: l entite avertit et protege plutot qu elle ne chasse. Sa geometrie lui permet de se courber autour d angles impossibles et de traverser des distances que le terrain visible ne contient pas.',
    dossierEn: 'In its origin Thread, Long Horse appears as a horse skull without a lower jaw, extended by an apparently endless vertebral neck. Its arrival warns of misfortune but does not cause it: the entity warns and protects rather than hunts. Its geometry lets it bend around impossible corners and cross distances the visible terrain cannot contain.',
    breachFr: 'Long Horse percoit les portails mensongers comme des articulations mal placees dans son propre cou. Il se manifeste avant les attaques de Siren Head et indique une route dont les voix n ont pas ete copiees. A.R.C.A. ne tente pas de le contenir; elle enregistre seulement les presages et laisse l entite choisir quand apparaitre. En combat, sa plaquette represente un avertissement et une issue, jamais une monture ni une arme ordinaire.',
    breachEn: 'Long Horse perceives deceptive portals as misplaced joints in its own neck. It manifests before Siren Head attacks and marks a route whose voices were not copied. A.R.C.A. does not attempt containment; it records the omens and lets the entity choose when to appear. In combat, its plaque represents warning and escape, never an ordinary mount or weapon.',
    doctrineFr: 'Presage, marquage de route sure, esquive par angle impossible et soutien de retrait.',
    doctrineEn: 'Omen, safe-route marking, impossible-corner evasion, and retreat support.',
    threatFr: 'Risque A.R.C.A.: confondre son avertissement avec la cause du desastre ferait perdre la seule avance disponible.',
    threatEn: 'A.R.C.A. risk: mistaking its warning for the cause of disaster would waste the only available lead.',
    tags: ['Siren Head', 'Trevor Henderson', 'Omen', 'Rescue', 'Tactical']
  }));
}

export function createSolarOppositesSirenStarWarsCharacterPlaques3({ plaque }) {
  return (plaque({
    clearance: 'TH-CCAT',
    rankFr: 'Manifestation de faux media',
    rankEn: 'False-media manifestation',
    roleFr: 'Assaut elastique et rupture de cadre',
    roleEn: 'Elastic assault and frame breaking',
    callSign: 'Cartoon Cat',
    originFr: 'Mythos de Trevor Henderson - forme filtree par les anciens medias',
    originEn: 'Trevor Henderson mythos - form filtered through old media',
    dossierFr: 'Dans sa Trame d origine, Cartoon Cat n est pas un personnage comique devenu reel, mais une entite malveillante qui utilise une image de dessin anime ancien comme faux corps. Sa silhouette noire, son sourire trop large et ses membres elastiques imitent le langage rubber-hose pour mieux transformer une forme familiere en predateur. La croyance, les ecrans et les images servent de passage a cette manifestation.',
    dossierEn: 'In its origin Thread, Cartoon Cat is not a comic character made real, but a malevolent entity using an old-cartoon image as a false body. Its black silhouette, oversized grin, and elastic limbs imitate rubber-hose language to turn a familiar form into a predator. Belief, screens, and images act as passages for this manifestation.',
    breachFr: 'Le Sans-Auteur diffuse Cartoon Cat dans les vignettes d archives et tente de lui offrir chaque interface comme nouvelle peau. A.R.C.A. isole une incarnation dans une plaquette de combat pour retourner son elasticite contre les cadres corrompus, sans jamais la classer comme allie fiable. Son arc consiste a couper la chaine d images qui nourrit la manifestation avant qu elle ne puisse sortir de l ecran de mission.',
    breachEn: 'The Authorless broadcasts Cartoon Cat through archive thumbnails and tries to offer every interface as a new skin. A.R.C.A. isolates one incarnation inside a combat plaque to turn its elasticity against corrupted frames, without ever classifying it as a reliable ally. Its arc is to sever the chain of images feeding the manifestation before it can leave the mission screen.',
    doctrineFr: 'Allonge rubber-hose, saut de frame, griffe elastique et rupture de diffusion.',
    doctrineEn: 'Rubber-hose reach, frame skip, elastic claw, and broadcast rupture.',
    threatFr: 'Risque A.R.C.A. maximal: toute reproduction non verrouillee de sa plaquette peut devenir un nouveau seuil.',
    threatEn: 'Maximum A.R.C.A. risk: any unlocked reproduction of its plaque can become a new threshold.',
    tags: ['Siren Head', 'Trevor Henderson', 'Old Media', 'Manifestation', 'Slayer']
  }));
}
