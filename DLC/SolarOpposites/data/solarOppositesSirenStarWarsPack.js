// Solar Opposites — definitions consumed by src/game/solarOppositesSirenStarWarsPack.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createKorvo({ action, fighter }) {
  return (fighter({
  id: 'korvo_solar',
  name: 'Korvo',
  cat: 'hacker',
  color: '#9fd9f2',
  accent: '#1b2638',
  weaponType: 'raygun',
  stats: { hp: 112, atk: 13, def: 7, spd: 7 },
  simple: action('Shlorpian Ray Burst', 'energy', 1.05),
  secondary: action('Quantum Ring Calibration', 'hack', 1.75, { cd: 6 }),
  defense: action('Nanobot Hardlight Screen', 'shield', 0, { dur: 2.2, reduce: 0.82 }),
  special: action('Planetary Science Override', 'science_aoe', 4.55, { color: '#9fd9f2' }),
  equipment: ['Shlorpian Ray Pistol', 'Quantum Ring', 'Pupa Telemetry Scanner'],
  incarnation: 'Solar Opposites - suburban Earth mission'
}));
}

export function createTerry({ action, fighter }) {
  return (fighter({
  id: 'terry_solar',
  name: 'Terry',
  cat: 'tactical',
  color: '#86d45a',
  accent: '#f28c28',
  weaponType: 'raygun',
  stats: { hp: 126, atk: 11, def: 8, spd: 7 },
  simple: action('Casual Raygun Snap', 'energy', 0.98),
  secondary: action('Earth-Culture Distraction', 'taunt', 1.45, { cd: 5 }),
  defense: action('Shlorpian Family Cover', 'shield', 0, { dur: 2.4, reduce: 0.78 }),
  special: action('Suburban Gadget Avalanche', 'gadget_aoe', 4.25, { color: '#f28c28' }),
  equipment: ['Shlorpian Ray Pistol', 'Earth Souvenir Pack', 'Emergency Replicator'],
  incarnation: 'Solar Opposites - suburban Earth mission'
}));
}

export function createYumyulack({ action, fighter }) {
  return (fighter({
  id: 'yumyulack_solar',
  name: 'Yumyulack',
  cat: 'hacker',
  color: '#a8def2',
  accent: '#765b3d',
  weaponType: 'shrink_ray',
  stats: { hp: 104, atk: 13, def: 5, spd: 8 },
  simple: action('Shrink Ray Tap', 'shrink', 1.02),
  secondary: action('Wall Containment Beam', 'control', 1.7, { cd: 6 }),
  defense: action('Miniature Decoy Habitat', 'dodge', 0, { dur: 1.8, reduce: 0.76 }),
  special: action('Pocket Civilization Collapse', 'shrink_aoe', 4.45, { color: '#8cdcf4' }),
  equipment: ['Shrink Ray', 'Specimen Terrarium', 'Shlorpian Wrist Computer'],
  incarnation: 'Solar Opposites - replicant scientist'
}));
}

export function createJesse({ action, fighter }) {
  return (fighter({
  id: 'jesse_solar',
  name: 'Jesse',
  cat: 'tactical',
  color: '#7fd45d',
  accent: '#f483b6',
  weaponType: 'raygun',
  stats: { hp: 118, atk: 11, def: 7, spd: 8 },
  simple: action('Replicant Ray Shot', 'energy', 0.96),
  secondary: action('Neighborhood Rescue Route', 'support', 1.35, { cd: 5 }),
  defense: action('Pupa-Safe Diversion', 'dodge', 0, { dur: 2.0, reduce: 0.8 }),
  special: action('Earth Friendship Chain', 'support_aoe', 4.1, { color: '#f483b6' }),
  equipment: ['Shlorpian Ray Pistol', 'Replicant Utility Band', 'Pupa Emergency Beacon'],
  incarnation: 'Solar Opposites - replicant student'
}));
}

export function createSolarOppositesSirenStarWarsHeroExpansions({ jesse, korvo, terry, yumyulack }) {
  return ([korvo, terry, yumyulack, jesse]);
}

export function createSolarOppositesSirenStarWarsUniverseWave() {
  return ({
    key: 'solar_opposites',
    universe: 'Solar Opposites',
    mediaType: 'series',
    faction: 'sciFi',
    mode: 'RPG',
    difficulty: 'Hard',
    titleFr: 'Solar Opposites',
    stage: 'Suburban Shlorpian Terraforming Incident',
    boss: 'Red Goobler Containment Failure',
    worldBoss: 'Pupa Terraforming Event',
    hero: ['korvo_solar', 'Korvo', 'hacker'],
    allies: [
      ['terry_solar', 'Terry', 'tactical'],
      ['yumyulack_solar', 'Yumyulack', 'hacker'],
      ['jesse_solar', 'Jesse', 'tactical']
    ],
    monsters: ['Shlorpian Replicator Drone', 'Nanobot Goobler', 'Wall Patrol Miniature'],
    bosses: ['Red Goobler', 'SilverCop Retrieval Unit'],
    gear: [
      ['solar_shrink_ray', 'Yumyulack Shrink Ray', 'Rayon reducteur de Yumyulack', { atk: 9, spd: 2 }],
      ['solar_quantum_ring', 'Korvo Quantum Ring', 'Anneau quantique de Korvo', { def: 7, hp: 45 }],
      ['solar_pupa_scanner', 'Pupa Telemetry Scanner', 'Scanner telemetrique du Pupa', { hp: 75, spd: 1 }]
    ],
    event: [
      'evt_solar_pupa_pulse',
      'Pupa Terraforming Pulse',
      'Impulsion terraformante du Pupa',
      'The Pupa releases a controlled growth pulse that roots enemies while Korvo redirects the sequence away from civilians.',
      'Le Pupa libere une impulsion de croissance controlee qui immobilise les ennemis pendant que Korvo detourne la sequence loin des civils.'
    ],
    theme: 'Shlorpian science, suburban chaos, the Wall micro-society, Gooblers, and the Pupa terraforming mission',
    desc: {
      en: 'Korvo, Terry, Yumyulack, and Jesse escaped the destruction of Shlorp and crashed into suburban Earth while protecting the Pupa, a living supercomputer intended to terraform the planet. In Multiverse Breach, portal radiation makes the Pupa read Mosaic City as a replacement world, so the family must contain its own technology before whole districts become competing suburban biomes.',
      fr: 'Korvo, Terry, Yumyulack et Jesse ont fui la destruction de Shlorp avant de s ecraser dans une banlieue terrestre en protegeant le Pupa, superordinateur vivant destine a terraformer la planete. Dans Multiverse Breach, le rayonnement des portails fait lire la Cite-Mosaique au Pupa comme monde de remplacement; la famille doit contenir sa propre technologie avant que des quartiers entiers deviennent des biomes de banlieue concurrents.'
    },
    motif: 'arcanecity',
    colors: ['#17272f', '#030607', '#86d45a'],
    stageVariants: [
      ['Tactics', 'The Wall Pocket-City Uprising', 'Hard', 'Duke Wall Regime'],
      ['Smash', 'Shlorpian Roof-Array Breakdown', 'Very Hard', 'SilverCop Retrieval Unit']
    ]
  });
}

export function createSolarOppositesSirenStarWarsLoreDb({ SOLAR_OPPOSITES_SIREN_STAR_WARS_UNIVERSE_WAVE, localized }) {
  return ({
    mediaType: 'series',
    faction: 'sciFi',
    title: localized('Solar Opposites', 'Solar Opposites'),
    desc: SOLAR_OPPOSITES_SIREN_STAR_WARS_UNIVERSE_WAVE[0].desc,
    theme: SOLAR_OPPOSITES_SIREN_STAR_WARS_UNIVERSE_WAVE[0].theme,
    stageName: SOLAR_OPPOSITES_SIREN_STAR_WARS_UNIVERSE_WAVE[0].stage,
    bossName: SOLAR_OPPOSITES_SIREN_STAR_WARS_UNIVERSE_WAVE[0].boss,
    worldBoss: SOLAR_OPPOSITES_SIREN_STAR_WARS_UNIVERSE_WAVE[0].worldBoss
  });
}

export function createSolarOppositesSirenStarWarsCharacterPlaques({ plaque }) {
  return (plaque({
    clearance: 'SOL-KORV',
    rankFr: 'Scientifique shlorpien',
    rankEn: 'Shlorpian scientist',
    roleFr: 'Controle technologique et lecture de terraformation',
    roleEn: 'Technology control and terraforming analysis',
    callSign: 'Korvo',
    originFr: 'Shlorp / banlieue terrestre - mission du Pupa',
    originEn: 'Shlorp / suburban Earth - Pupa mission',
    dossierFr: 'Dans sa Trame d origine, Korvo fait partie des quatre Shlorpiens evacues avant la destruction de leur monde. Echoue dans une banlieue americaine avec Terry et leurs replicants Yumyulack et Jesse, il traite la Terre comme une planete primitive et tente de poursuivre la mission centrale: proteger le Pupa jusqu a sa forme finale de terraformation. Son intelligence, ses anneaux quantiques, rayons, nanorobots et inventions domestiques sont immenses, mais son impatience transforme souvent une correction scientifique en nouvelle crise.',
    dossierEn: 'In his origin Thread, Korvo is one of four Shlorpians evacuated before their world was destroyed. Stranded in American suburbia with Terry and their replicants Yumyulack and Jesse, he treats Earth as a primitive planet while continuing the central mission: protect the Pupa until its final terraforming form. His intelligence, quantum rings, rays, nanobots, and household inventions are immense, but his impatience often turns a scientific correction into a new crisis.',
    breachFr: 'La Premiere Breche fait confondre au Pupa la Cite-Mosaique avec une planete de remplacement. Korvo rejoint A.R.C.A. pour mesurer cette lecture avant qu elle ne convertisse les salles stabilisees en banlieues incompatibles. Il refuse toutefois de remettre le Pupa a l organisation: sa doctrine consiste a corriger ses propres machines tout en conservant la responsabilite familiale de la mission shlorpienne. Le Sans-Auteur exploite sa nostalgie de Shlorp en lui proposant une copie parfaite de la planete; Korvo la rejette lorsqu il comprend qu elle exige d effacer la Terre et tous les liens formes depuis le crash.',
    breachEn: 'The First Breach causes the Pupa to mistake Mosaic City for a replacement planet. Korvo joins A.R.C.A. to measure that reading before it converts stabilized rooms into incompatible suburbs. He still refuses to surrender the Pupa to the organization: his doctrine is to correct his own machines while keeping family responsibility for the Shlorpian mission. The Authorless exploits his nostalgia for Shlorp by offering a perfect copy of the planet; Korvo rejects it when he understands that it requires erasing Earth and every bond formed since the crash.',
    doctrineFr: 'Rayon shlorpien, anneau quantique, scan du Pupa, nanobouclier et neutralisation de terraformation.',
    doctrineEn: 'Shlorpian ray, quantum ring, Pupa scan, nanoshield, and terraforming neutralization.',
    threatFr: 'Risque A.R.C.A.: une solution imposee trop vite peut stabiliser la machine tout en sacrifiant les habitants qu il avait oublie de compter.',
    threatEn: 'A.R.C.A. risk: a solution imposed too quickly can stabilize the machine while sacrificing residents he forgot to count.',
    tags: ['Solar Opposites', 'Shlorp', 'Pupa', 'Science', 'Hacker']
  }));
}

export function createSolarOppositesSirenStarWarsCharacterPlaques2({ plaque }) {
  return (plaque({
    clearance: 'SOL-TERR',
    rankFr: 'Specialiste culturel improvise',
    rankEn: 'Improvised culture specialist',
    roleFr: 'Soutien mobile, diversion et cohesion familiale',
    roleEn: 'Mobile support, diversion, and family cohesion',
    callSign: 'Terry',
    originFr: 'Shlorp / banlieue terrestre - mission du Pupa',
    originEn: 'Shlorp / suburban Earth - Pupa mission',
    dossierFr: 'Dans sa Trame d origine, Terry est l adulte shlorpien qui adopte le plus volontiers la culture terrestre: television, nourriture, vetements, fetes et habitudes de voisinage. Ce gout ne le rend pas incompetent; il lui donne une lecture sociale que Korvo ne possede pas. Terry sait quand une invention menace la famille, quand un voisin devient un temoin et quand un plaisir terrestre peut servir de pont entre des extraterrestres bloques et leur monde d accueil.',
    dossierEn: 'In his origin Thread, Terry is the Shlorpian adult who most readily embraces Earth culture: television, food, clothes, parties, and neighborhood habits. That taste does not make him incompetent; it gives him a social reading Korvo lacks. Terry knows when an invention threatens the family, when a neighbor becomes a witness, and when an Earth pleasure can bridge stranded aliens and their adopted world.',
    breachFr: 'Dans la Cite-Mosaique, Terry stabilise les fragments de banlieue par leurs habitudes reelles plutot que par des calculs abstraits. Ses souvenirs de series, magasins et rituels domestiques donnent a A.R.C.A. des reperes humains pour distinguer une maison vecue d un decor copie. Le Sans-Auteur le cible avec des quartiers composes uniquement de divertissements sans consequences. Terry comprend que ce paradis ne contient ni famille a proteger ni personne avec qui partager ces plaisirs, puis utilise sa chaine de gadgets absurdes pour rouvrir la route authentique.',
    breachEn: 'In Mosaic City, Terry stabilizes suburban fragments through their lived habits instead of abstract calculations. His memories of shows, stores, and domestic rituals give A.R.C.A. human markers that distinguish a lived-in home from a copied set. The Authorless targets him with districts made only of consequence-free entertainment. Terry realizes that this paradise contains neither family to protect nor anyone with whom to share those pleasures, then uses his chain of absurd gadgets to reopen the authentic route.',
    doctrineFr: 'Tir opportuniste, diversion culturelle, couverture familiale, gadgets domestiques et extraction de civils.',
    doctrineEn: 'Opportunistic fire, cultural diversion, family cover, household gadgets, and civilian extraction.',
    threatFr: 'Risque A.R.C.A.: les fausses Trames de confort peuvent retenir Terry assez longtemps pour laisser le Pupa poursuivre une sequence non surveillee.',
    threatEn: 'A.R.C.A. risk: false comfort Threads can hold Terry long enough for the Pupa to continue an unsupervised sequence.',
    tags: ['Solar Opposites', 'Shlorp', 'Earth', 'Support', 'Tactical']
  }));
}

export function createSolarOppositesSirenStarWarsCharacterPlaques3({ plaque }) {
  return (plaque({
    clearance: 'SOL-YUMY',
    rankFr: 'Replicant experimental',
    rankEn: 'Experimental replicant',
    roleFr: 'Miniaturisation, controle de zone et analyse hostile',
    roleEn: 'Miniaturization, zone control, and hostile analysis',
    callSign: 'Yumyulack',
    originFr: 'Replicant shlorpien / societe miniature du Mur',
    originEn: 'Shlorpian replicant / miniature Wall society',
    dossierFr: 'Dans sa Trame d origine, Yumyulack est le replicant de Korvo. Il partage son mepris initial pour la Terre et transforme une curiosite scientifique en systeme de captivite: son rayon reducteur place des humains dans le Mur de sa chambre. Cette societe miniature developpe ses propres pouvoirs, revoltes, religions et tragedies. Yumyulack reste brillant et dangereux precisement parce qu il considere longtemps les vies reduites comme des specimens plutot que comme un peuple dont il porte la responsabilite.',
    dossierEn: 'In his origin Thread, Yumyulack is Korvo replicant. He shares Korvo early contempt for Earth and turns scientific curiosity into a system of captivity: his shrink ray places humans inside the Wall in his room. That miniature society develops its own powers, revolts, religions, and tragedies. Yumyulack remains brilliant and dangerous precisely because he long treats the reduced lives as specimens rather than a people for whom he is responsible.',
    breachFr: 'Les portails font du Mur une matrice capable d enfermer des fragments d univers entiers a l echelle miniature. Yumyulack pourrait ainsi sauver des quartiers de l effacement, mais chaque sauvegarde devient aussi une prison qu il controle. Son arc Breach ne glorifie pas le rayon reducteur: A.R.C.A. lui impose de rendre taille, sortie et autonomie a toute population extraite. Ses attaques miniaturisent temporairement armes et couvertures, jamais une conscience comme simple recompense.',
    breachEn: 'The portals turn the Wall into a matrix capable of holding entire universe fragments at miniature scale. Yumyulack could save districts from deletion this way, but every save also becomes a prison he controls. His Breach arc does not glorify the shrink ray: A.R.C.A. requires him to restore size, exit, and autonomy to every extracted population. His attacks temporarily miniaturize weapons and cover, never a consciousness as a mere reward.',
    doctrineFr: 'Rayon reducteur, confinement temporaire, lecture du Mur, decoy miniature et restitution obligatoire.',
    doctrineEn: 'Shrink ray, temporary containment, Wall analysis, miniature decoy, and mandatory restoration.',
    threatFr: 'Risque A.R.C.A.: son detachement scientifique peut convertir une evacuation en collection de specimens.',
    threatEn: 'A.R.C.A. risk: his scientific detachment can turn an evacuation into a specimen collection.',
    tags: ['Solar Opposites', 'Replicant', 'The Wall', 'Shrink Ray', 'Hacker']
  }));
}

export function createSolarOppositesSirenStarWarsCharacterPlaques4({ plaque }) {
  return (plaque({
    clearance: 'SOL-JESS',
    rankFr: 'Replicant de liaison',
    rankEn: 'Liaison replicant',
    roleFr: 'Secours, mediation et ancrage relationnel',
    roleEn: 'Rescue, mediation, and relational anchoring',
    callSign: 'Jesse',
    originFr: 'Replicant shlorpienne / lycee terrestre',
    originEn: 'Shlorpian replicant / Earth high school',
    dossierFr: 'Dans sa Trame d origine, Jesse est la replicante de Terry et partage son affection pour les humains. Sa vie scolaire, ses amities et son empathie l obligent a voir les consequences que les adultes shlorpiens reduisent souvent a une experience. Elle reste equipee d une technologie extraterrestre dangereuse, mais son reflexe consiste plus volontiers a proteger une personne, reparer une relation ou faire comprendre a sa famille que la Terre n est pas un decor jetable.',
    dossierEn: 'In her origin Thread, Jesse is Terry replicant and shares his affection for humans. Her school life, friendships, and empathy force her to see consequences the Shlorpian adults often reduce to an experiment. She still carries dangerous alien technology, but her first instinct is more often to protect someone, repair a relationship, or make her family understand that Earth is not a disposable set.',
    breachFr: 'A.R.C.A. utilise Jesse comme liaison dans les quartiers ou la technologie shlorpienne a deja altere des civils. Elle identifie les personnes que les cartes classent comme dommages secondaires et maintient leurs liens assez longtemps pour que la Trame retrouve sa forme. Quand le Pupa diffuse plusieurs futurs incompatibles, Jesse refuse de choisir seulement celui ou sa famille survit: elle cherche la route qui permet aussi aux habitants de conserver leur propre histoire.',
    breachEn: 'A.R.C.A. uses Jesse as liaison in districts where Shlorpian technology has already altered civilians. She identifies people the maps classify as collateral damage and holds their connections long enough for the Thread to recover its shape. When the Pupa broadcasts several incompatible futures, Jesse refuses to choose only the one where her family survives: she searches for the route that also lets residents keep their own history.',
    doctrineFr: 'Tir de couverture, balise du Pupa, mediation, diversion et chaine de secours.',
    doctrineEn: 'Cover fire, Pupa beacon, mediation, diversion, and rescue chain.',
    threatFr: 'Risque A.R.C.A.: sa volonte de sauver simultanement famille et civils peut la maintenir dans une zone apres la fermeture de la route sure.',
    threatEn: 'A.R.C.A. risk: her determination to save family and civilians at once can keep her in a zone after the safe route closes.',
    tags: ['Solar Opposites', 'Replicant', 'Pupa', 'Rescue', 'Tactical']
  }));
}
