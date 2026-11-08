/**
 * Track art briefs are adaptations made for Multiverse, not canonical race tracks.
 * Dimensions and paths are gameplay measurements; no entry claims a 1:1 rebuild.
 * Geometry keys are consumed by KartRenderer3D. Exact sources stay beside each brief.
 */
const local = path => `https://github.com/darknigthmare/multiverse-breach/blob/master/${path}`;
const ocSource = local('src/game/ocDlcPacks.js');
const palette = (sky, ground, road, shoulder, accent, fog = sky) => ({ sky, ground, road, shoulder, accent, fog });
const prop = (kind, label, x, z, width, height, depth, color, accent, rotation = 0) => ({
  kind, label, x, z, width, height, depth, color, accent: accent || color, rotation
});

export const KART_THEME_PALETTES = Object.freeze({
  nexus: palette('#101c39', '#18213c', '#46536d', '#42c7c4', '#ffe87b'),
  coast: palette('#78bddf', '#5b7950', '#b5a080', '#d2c59f', '#7fd8ef'),
  industrial: palette('#111d26', '#29343b', '#606c71', '#b59253', '#7bdacb'),
  desert: palette('#c9a67b', '#b39160', '#c4a678', '#72583b', '#efbe65'),
  forest: palette('#a4c7bd', '#3e6746', '#8b795b', '#496b3b', '#d4bb68'),
  snow: palette('#7e9cac', '#c0ced2', '#71818a', '#e6f0f2', '#84d8ed'),
  city: palette('#152238', '#303843', '#59616a', '#9c8d67', '#6cc6c7'),
  castle: palette('#5b6574', '#48554e', '#827b69', '#a6a095', '#bb8261'),
  ruins: palette('#768e96', '#575e52', '#8e8770', '#b4a682', '#9cb9b2'),
  infernal: palette('#361c23', '#3c2b2e', '#65514e', '#be4d39', '#f79942'),
  ocean: palette('#0b3246', '#184c57', '#547f85', '#9fc3bd', '#67e4de'),
  clockwork: palette('#2b2942', '#473b39', '#8f7a5f', '#d0ad6e', '#68c9d1'),
  orbital: palette('#09152a', '#28384c', '#637389', '#91bac8', '#b4a2e8'),
  stage: palette('#281a3a', '#362a45', '#74647c', '#b8a5b6', '#db9ac6'),
  voxel: palette('#88c5e8', '#5d9644', '#9d8660', '#75a44a', '#77cbea'),
  laboratory: palette('#859da8', '#74848c', '#d2d9d8', '#657a82', '#59b6cb')
});

export const KART_THEME_LANDMARKS = Object.freeze({
  nexus: ['arch', 'crystal', 'tower'],
  coast: ['rock', 'palm', 'arch'],
  industrial: ['hangar', 'pipe', 'reactor'],
  desert: ['mountain', 'pyramid', 'rock'],
  forest: ['tree', 'rock', 'tree'],
  snow: ['mountain', 'rock', 'hangar'],
  city: ['tower', 'house', 'arch'],
  castle: ['castle', 'tower', 'gate'],
  ruins: ['temple', 'rock', 'arch'],
  infernal: ['spire', 'mountain', 'tower'],
  ocean: ['crystal', 'pipe', 'arch'],
  clockwork: ['clock-tower', 'pipe', 'ring'],
  orbital: ['hangar', 'ring', 'tower'],
  stage: ['tower', 'arch', 'ring'],
  voxel: ['voxel-tree', 'block', 'block'],
  laboratory: ['hangar', 'pipe', 'arch']
});

// These names, routes and shape combinations are deliberate per-universe designs.
// A checked official page supports only the named subject, never model accuracy.
export const KART_CURATED_TRACK_DESIGNS = Object.freeze({
  'Nexus de Convergence': {
    name: ['Atrium — Tour des Ancres', 'Atrium — Anchor Circuit'],
    place: 'Atrium central et infrastructure A.R.C.A.',
    theme: 'nexus', layout: 'atrium', difficulty: 1, roadWidth: 108, original: true,
    description: 'La voie des Ancres contourne le cœur de l’Atrium, passe entre les portiques de suture et retrouve les balises de la grille.',
    references: [local('src/game/ocCampaign.js'), local('src/game/lore.js')],
    landmarks: [
      prop('crystal', 'Cœur de convergence', 480, 270, 70, 145, 70, '#45bdb5', '#ffe375'),
      prop('arch', 'Portique de suture', 480, 265, 224, 112, 24, '#687891', '#5ce3d8'),
      prop('tower', 'Archives statiques', 310, 270, 58, 104, 76, '#263753', '#79d9db'),
      prop('tower', 'Console des Ancres', 650, 270, 58, 80, 76, '#263753', '#e4d48d')
    ]
  },
  'Thalassa Mnémique': {
    name: ['Récif des Registres', 'Registry Reef'], place: 'Récif des Registres sous les Archives de Sel',
    theme: 'ocean', layout: 'lagoon', difficulty: 2, roadWidth: 90, original: true,
    description: 'Les sas de cuivre et les cartes de verre bordent le récif mnémique. La piste reste dans les coursives sèches sous la fausse aube.',
    references: [ocSource, local('DLC/ThalassaMnemique/data/stageLoreProfiles.js')],
    landmarks: [
      prop('crystal', 'Corail-mémoire', 390, 272, 95, 125, 85, '#aec9bc', '#64e6dd'),
      prop('arch', 'Sas des Archives de Sel', 570, 260, 130, 96, 30, '#bb925a', '#77d8d6'),
      prop('pipe', 'Moteur de marée', 520, 300, 48, 75, 42, '#877a59', '#64e6dd'),
      prop('crystal', 'Registre de verre', 310, 280, 26, 78, 24, '#b9e4e5', '#e8bd70')
    ]
  },
  'Méridien Creux': {
    name: ['Grand Cadran — Chronobanque', 'Great Dial — Chronobank'], place: 'Quartier du Grand Cadran et Chronobanque',
    theme: 'clockwork', layout: 'dial', difficulty: 3, roadWidth: 94, original: true,
    description: 'Le tour du Grand Cadran suit les conduites d’heures saisies. Les secondes cyan éclairent les contre-allées de la Chronobanque.',
    references: [ocSource, local('DLC/MeridienCreux/data/stageLoreProfiles.js')],
    landmarks: [
      prop('clock-tower', 'Grand Cadran', 480, 260, 100, 210, 74, '#887252', '#e9c777'),
      prop('hangar', 'Chronobanque', 340, 270, 118, 90, 90, '#6d5d4c', '#d8a44f'),
      prop('pipe', 'Conduite des secondes', 645, 265, 34, 110, 44, '#73d7d4', '#c9f6ef')
    ]
  },
  'Viridienne Ultime': {
    name: ['Canopée des Orbites', 'Canopy of Orbits'], place: 'Canopée des Orbites et Pépinière des graines-planètes',
    theme: 'forest', layout: 'grove', difficulty: 2, roadWidth: 92, original: true,
    palette: palette('#122c39', '#284b47', '#7d9476', '#50c88f', '#dfbbf0'),
    description: 'Les racines lumineuses portent les graines-planètes hors de la chaussée. La course suit les branches de la pépinière autour du Soleil-Racine.',
    references: [ocSource, local('DLC/ViridienneUltime/data/stageLoreProfiles.js')],
    landmarks: [
      prop('tree', 'Soleil-Racine', 480, 260, 160, 230, 110, '#427c61', '#c9ef9d'),
      prop('ring', 'Orbite des semences', 480, 260, 230, 170, 14, '#84d8ba', '#dfbbf0'),
      prop('crystal', 'Graine-planète', 320, 250, 48, 70, 48, '#c1b3d9', '#77ebc4'),
      prop('crystal', 'Pépinière prismatique', 660, 260, 48, 85, 42, '#82d7cb', '#dfbbf0')
    ]
  },
  Halo: {
    name: ['Installation 04 — Rivage du Cartographe', 'Installation 04 — Cartographer Shore'],
    place: 'Installation 04, rivage du Silent Cartographer', theme: 'coast', layout: 'coast', difficulty: 2, roadWidth: 96,
    description: 'Une boucle côtière entre le sable, les reliefs rocheux et une entrée Forerunner. L’anneau reste un élément de ciel monumental.',
    references: ['https://www.halowaypoint.com/news/silent-cartographer-third-person-gameplay-halo-campaign-evolved'],
    checkedReference: 'Halo Studios — présentation officielle du rivage du Cartographe, consultée le 8 novembre 2026.',
    continuity: 'Halo: Combat Evolved / Installation 04 ; adaptation kart, topographie simplifiée.',
    landmarks: [
      prop('halo-ring', 'Courbure d’Installation 04', 480, -700, 1600, 1600, 56, '#aac4c5', '#76ccd7'),
      prop('forerunner', 'Accès Forerunner', 480, 270, 150, 125, 98, '#99a7a7', '#80dedc'),
      prop('mountain', 'Massif de l’île', 315, 262, 112, 140, 100, '#5c6d69', '#839984'),
      prop('rock', 'Escarpement côtier', 660, 270, 102, 70, 85, '#8d8b7e', '#aaa798')
    ]
  },
  Alien: {
    name: ['Nostromo — Pont de maintenance', 'Nostromo — Maintenance Deck'],
    place: 'USCSS Nostromo, coursives industrielles', theme: 'industrial', layout: 'freighter', difficulty: 3, roadWidth: 86,
    palette: palette('#141b21', '#262d31', '#6a706e', '#c1bba1', '#cdd3b9'),
    description: 'Des cloisons pâles ouvrent sur les conduites, les racks et les zones de maintenance du remorqueur. Aucun décor de Sevastopol n’est mélangé à ce parcours.',
    references: ['https://www.20thcenturystudios.com/movies/alien'],
    checkedReference: '20th Century Studios — galerie officielle d’Alien (1979), consultée le 8 novembre 2026.',
    continuity: 'Alien (1979) ; coursive kart recomposée, pas plan exact du vaisseau.',
    landmarks: [
      prop('hangar', 'Module de maintenance', 480, 265, 210, 78, 125, '#9ba39a', '#e0d5a2'),
      prop('pipe', 'Conduite primaire', 320, 270, 50, 150, 60, '#687671', '#c5c7b9'),
      prop('pipe', 'Conduite secondaire', 650, 270, 50, 110, 60, '#687671', '#c5c7b9'),
      prop('bulkhead', 'Cloison nervurée', 480, 265, 272, 118, 20, '#bac0b7', '#e0d5a2')
    ]
  },
  Aliens: {
    name: ['Hadley’s Hope — Complexe atmosphérique', 'Hadley’s Hope — Atmosphere Complex'],
    place: 'Hadley’s Hope, LV-426', theme: 'industrial', layout: 'service', difficulty: 3, roadWidth: 90,
    palette: palette('#17252e', '#273b42', '#586c74', '#c29a56', '#74c4d3'),
    description: 'La route de service contourne les modules bas de la colonie et le processeur atmosphérique ; les conduites et passerelles restent extérieures à la trajectoire.',
    landmarks: [
      prop('reactor', 'Processeur atmosphérique', 480, 250, 166, 188, 120, '#6a7e85', '#c8a85d'),
      prop('hangar', 'Module de colonie', 320, 260, 105, 50, 80, '#697c82', '#c6b995'),
      prop('hangar', 'Module d’exploitation', 665, 270, 105, 50, 80, '#697c82', '#c6b995')
    ]
  },
  'Star Wars': {
    name: ['Mos Espa — Boucle du Boonta', 'Mos Espa — Boonta Circuit'],
    place: 'Mos Espa Grand Arena, Tatooine', theme: 'desert', layout: 'canyon', difficulty: 3, roadWidth: 96,
    description: 'Départ près des tribunes de Mos Espa, grands virages sableux et rochers usés du canyon. Les karts roulent sur une adaptation du parcours de course.',
    references: ['https://www.starwars.com/databank/mos-espa-grand-arena', 'https://www.starwars.com/databank/boonta-eve-classic-podracer-pilots'],
    checkedReference: 'Lucasfilm — Databank Mos Espa Grand Arena et Boonta Eve Classic, consulté le 8 novembre 2026.',
    continuity: 'Star Wars: The Phantom Menace ; tracé kart original inspiré du lieu.',
    landmarks: [
      prop('hangar', 'Tribunes de Mos Espa', 480, 265, 180, 65, 96, '#c5aa83', '#e7c9a1'),
      prop('mountain', 'Aiguille de canyon', 300, 255, 90, 190, 84, '#ab8054', '#d6ac79'),
      prop('mountain', 'Arête érodée', 665, 255, 100, 140, 84, '#a17c56', '#d6ac79'),
      prop('arch', 'Arche de roche', 480, -55, 185, 120, 40, '#c19b6c', '#d6ac79')
    ]
  },
  Stargate: {
    name: ['Abydos — Parvis de la Porte', 'Abydos — Gate Forecourt'],
    place: 'Abydos, pyramide et Porte des étoiles', theme: 'desert', layout: 'temple', difficulty: 2, roadWidth: 96,
    description: 'La pyramide domine le désert. La Porte et ses chevrons servent de repère au bord du parvis, sans téléporter le kart au-delà des contrôles de tour.',
    references: [local('DLC/Stargate/data/loreDescriptions.js'), local('DLC/Stargate/data/loreAccuratePacks.js')],
    landmarks: [
      prop('pyramid', 'Pyramide d’Abydos', 480, 260, 195, 175, 145, '#ad8958', '#d9bb86'),
      prop('ring', 'Porte des étoiles', 480, -22, 132, 132, 17, '#6e777b', '#f3c76f'),
      prop('sandstone-terrace', 'Parvis abydonien', 300, 270, 74, 50, 72, '#bda276', '#e0c08e'),
      prop('rock', 'Affleurement du désert', 670, 265, 92, 56, 84, '#aa895f', '#d6b586')
    ]
  },
  'Stargate Atlantis': {
    name: ['Atlantis — Digues de la Cité', 'Atlantis — City Piers'],
    place: 'Cité d’Atlantis, tours et quais', theme: 'ocean', layout: 'lagoon', difficulty: 3, roadWidth: 88,
    palette: palette('#78aebf', '#255a70', '#8397a2', '#b5bdb6', '#66bcd3'),
    description: 'Les tours des Anciens et leurs baies bleutées dominent une boucle sur les quais ; la mer reste sous les voies de la cité.',
    landmarks: [
      prop('spire', 'Tour centrale', 480, 255, 86, 220, 90, '#a6b6bc', '#87d5e6'),
      prop('tower', 'Tour des quais', 320, 265, 68, 140, 72, '#8f9fa9', '#8bcfdb'),
      prop('tower', 'Tour du conseil', 660, 265, 68, 115, 72, '#8f9fa9', '#8bcfdb')
    ]
  },
  'Stargate Universe': {
    name: ['Destiny — Coursives anciennes', 'Destiny — Ancient Corridors'],
    place: 'Destiny, coursives et noyau technique', theme: 'industrial', layout: 'freighter', difficulty: 3, roadWidth: 86,
    palette: palette('#1a2026', '#393934', '#776c55', '#bda778', '#b6cbd0'),
    description: 'Des masses métalliques anciennes, des nervures usées et des éclairages ambre accompagnent la boucle technique du Destiny.',
    landmarks: [
      prop('hangar', 'Noyau technique', 480, 270, 170, 92, 104, '#756e5b', '#c8b17f'),
      prop('arch', 'Nervures de coursive', 480, 270, 236, 116, 22, '#92856a', '#c8b17f'),
      prop('pipe', 'Conduite ancienne', 665, 260, 50, 105, 40, '#5f6359', '#b6cbd0')
    ]
  },
  Sonic: {
    name: ['Green Hill — Anneaux du littoral', 'Green Hill — Coastal Rings'],
    place: 'Green Hill', theme: 'coast', layout: 'coast', difficulty: 1, roadWidth: 104,
    palette: palette('#72cbed', '#3ba353', '#bd8654', '#76c946', '#efca49'),
    description: 'Palmiers, falaises à damier, herbe vive et anneaux dorés accompagnent une boucle côtière. Les loopings sont des repères de décor, pas une conduite verticale simulée.',
    references: ['https://www.sega.jp/game/detail/sonicmania/'],
    checkedReference: 'SEGA — présentation et captures Green Hill de Sonic Mania, consultée le 8 novembre 2026.',
    continuity: 'Green Hill, adaptation kart ; pas une reproduction du niveau original.',
    landmarks: [
      prop('checker-hill', 'Falaise à damier', 480, 260, 160, 125, 116, '#aa7043', '#67c348'),
      prop('palm', 'Palmier de Green Hill', 310, 265, 66, 135, 60, '#518c46', '#b48b52'),
      prop('palm', 'Palmier du rivage', 665, 255, 66, 115, 60, '#518c46', '#b48b52'),
      prop('ring', 'Anneau de repère', 480, -30, 112, 112, 12, '#eec744', '#fff18c')
    ]
  },
  Minecraft: {
    name: ['Overworld — Vallée des blocs', 'Overworld — Block Valley'],
    place: 'Overworld, paysage construit en blocs', theme: 'voxel', layout: 'quarry', difficulty: 2, roadWidth: 96,
    description: 'Des terrasses cubiques, des arbres à feuilles cubiques et une entrée de mine bordent un tracé construit en blocs. Il ne prétend reproduire aucune seed canonique.',
    references: ['https://www.minecraft.net/en-us/about-minecraft'],
    checkedReference: 'Mojang — présentation officielle du monde en blocs, consultée le 8 novembre 2026.',
    landmarks: [
      prop('block', 'Terrasse de pierre', 480, 275, 142, 68, 100, '#8f9392', '#c1c4bf'),
      prop('voxel-tree', 'Chêne cubique', 310, 260, 64, 124, 64, '#658e3c', '#8a653d'),
      prop('voxel-tree', 'Arbre du coteau', 660, 250, 70, 110, 70, '#4b7d38', '#8a653d'),
      prop('arch', 'Entrée de mine', 480, 270, 102, 92, 28, '#7f7e78', '#b39b69')
    ]
  },
  'Final Fantasy VII': {
    name: ['Midgar — Anneau du réacteur', 'Midgar — Reactor Circuit'],
    place: 'Midgar, réacteur Mako et voies de service', theme: 'industrial', layout: 'reactor', difficulty: 3, roadWidth: 88,
    palette: palette('#15232c', '#2c383d', '#6d7471', '#baa675', '#72dcc0'),
    description: 'Le réacteur à lueur Mako, ses grosses conduites et les silhouettes industrielles de Midgar structurent les lignes de fuite.',
    references: ['https://na.finalfantasy.com/en/titles/finalfantasy7/', 'https://blog.fr.playstation.com/2020/03/06/rinventer-midgar-les-crateurs-de-final-fantasy-vii-remake-racontent-la-reconstruction-de-la-ville-emblmatique-sur-ps4/'],
    checkedReference: 'Square Enix et entretien officiel PlayStation sur Midgar, consultés le 8 novembre 2026.',
    landmarks: [
      prop('reactor', 'Réacteur Mako', 480, 260, 155, 210, 108, '#707d78', '#75e7bb'),
      prop('pipe', 'Conduite Mako', 320, 270, 62, 110, 62, '#7d897e', '#7fe9c1'),
      prop('tower', 'Pile de service', 665, 265, 80, 164, 70, '#52616b', '#a0bfb3')
    ]
  },
  Naruto: {
    name: ['Konoha — Tour des remparts', 'Konoha — Wall Circuit'],
    place: 'Konoha avant l’ellipse de Shippuden', theme: 'forest', layout: 'village', difficulty: 2, roadWidth: 96,
    description: 'Toitures du village, portes de bois et lisière forestière entourent la route. Ce parcours reste dans la période du jeune Naruto.',
    references: ['https://naruto-official.com/en/anime/naruto1', local('DLC/Naruto/data/stageLoreProfiles.js')],
    checkedReference: 'Site officiel Naruto — présentation de la première série, consultée le 8 novembre 2026.',
    continuity: 'Naruto première série, avant Shippuden.',
    landmarks: [
      prop('house', 'Maison de Konoha', 365, 270, 102, 98, 78, '#d6b582', '#9b674b'),
      prop('house', 'Toitures du village', 585, 275, 132, 120, 78, '#c3a379', '#8c664a'),
      prop('gate', 'Porte de bois', 480, -35, 165, 135, 22, '#9e714c', '#c8a57b'),
      prop('tree', 'Lisière de Konoha', 700, 270, 45, 116, 54, '#55844b', '#856d4b')
    ]
  },
  'Naruto Shippuden': {
    name: ['Amegakure — Sous la pluie', 'Amegakure — Rain Circuit'],
    place: 'Amegakure, période Shippuden', theme: 'city', layout: 'service', difficulty: 3, roadWidth: 86,
    palette: palette('#607885', '#334c59', '#647783', '#91a6ac', '#b1bbaa'),
    description: 'La course passe entre des tours métalliques et des conduites ruisselantes. Le décor d’Amegakure reste distinct des maisons de Konoha.',
    references: ['https://naruto-official.com/en/anime/naruto2', local('DLC/NarutoShippuden/data/stageLoreProfiles.js')],
    landmarks: [
      prop('tower', 'Tour d’Amegakure', 480, 270, 78, 240, 85, '#7c939b', '#a8bbc0'),
      prop('pipe', 'Conduite verticale', 330, 260, 54, 162, 50, '#667f89', '#bdc9ca'),
      prop('tower', 'Tour de pluie', 650, 260, 65, 182, 70, '#6f848d', '#a8bbc0')
    ]
  },
  'Dragon Ball Z': {
    name: ['Namek — Rives du ciel vert', 'Namek — Green-Sky Shores'],
    place: 'Namek, pendant la période Dragon Ball Z', theme: 'coast', layout: 'lagoon', difficulty: 2, roadWidth: 96,
    palette: palette('#79b886', '#2d927e', '#8a8a67', '#47a5a6', '#c8d3a0'),
    description: 'Ciel vert, eaux bleues, buttes rocheuses et arbres fins scandent les longues courbes. Le circuit reste sur une seule planète.',
    references: ['https://en.dragon-ball-official.com/news/01_1258.html', local('DLC/DragonBallZ/data/stageLoreProfiles.js')],
    landmarks: [
      prop('rock', 'Butte namek', 470, 265, 130, 115, 100, '#8f936f', '#bbc49a'),
      prop('tree', 'Arbre de Namek', 310, 260, 42, 152, 46, '#689f7b', '#c3c991'),
      prop('tree', 'Arbre du rivage', 660, 270, 42, 130, 46, '#689f7b', '#c3c991')
    ]
  },
  'The Lord of the Rings': {
    name: ['Mordor — Au pied de Barad-dûr', 'Mordor — Below Barad-dûr'],
    place: 'Mordor, Barad-dûr', theme: 'infernal', layout: 'fortress', difficulty: 4, roadWidth: 90,
    description: 'La tour sombre, les arêtes volcaniques et les contreforts écrasent la route de cendre. Cette adaptation de course n’ajoute pas d’événement à la Guerre de l’Anneau.',
    references: [local('DLC/TheLordOfTheRings/data/expandedUniverses.js')],
    landmarks: [
      prop('tower', 'Barad-dûr — silhouette', 480, 265, 88, 305, 94, '#343138', '#b96b46'),
      prop('spire', 'Contrefort noir', 335, 260, 76, 160, 72, '#3c3a3c', '#866b5d'),
      prop('mountain', 'Relief volcanique', 665, 265, 108, 180, 90, '#443a39', '#b96340')
    ]
  },
  'Half-Life': {
    name: ['Cité 17 — Voies du Combine', 'City 17 — Combine Service Roads'],
    place: 'Cité 17, Citadelle et rues occupées', theme: 'city', layout: 'service', difficulty: 3, roadWidth: 90,
    palette: palette('#91a0a8', '#5d635c', '#777970', '#b3a996', '#77b8ce'),
    description: 'Les immeubles vieillissants cèdent devant les volumes métalliques du Combine ; la Citadelle sert de point de repère lointain.',
    references: [local('DLC/HalfLife/data/loreAccuratePacks.js')],
    landmarks: [
      prop('spire', 'Citadelle', 480, -220, 146, 680, 130, '#526975', '#91d1e2'),
      prop('house', 'Immeuble de Cité 17', 350, 270, 120, 130, 90, '#aaa08a', '#6b7775'),
      prop('gate', 'Barrage Combine', 610, 260, 110, 100, 30, '#4b636e', '#9dcdda')
    ]
  },
  Portal: {
    name: ['Aperture — Anneau de test', 'Aperture — Test Circuit'],
    place: 'Aperture Science, chambres de test', theme: 'laboratory', layout: 'laboratory', difficulty: 2, roadWidth: 94,
    description: 'Panneaux blancs modulaires, travées de test et deux anneaux colorés composent la chambre. Les anneaux du décor ne téléportent pas le kart.',
    references: ['https://store.steampowered.com/app/620/Portal_2/'],
    landmarks: [
      prop('hangar', 'Module de test', 480, 260, 180, 118, 110, '#e5e7de', '#6c7f83'),
      prop('ring', 'Ouverture orange', 325, 260, 56, 92, 12, '#f2a14c', '#ffc475'),
      prop('ring', 'Ouverture bleue', 650, 260, 56, 92, 12, '#4aafd6', '#95def1')
    ]
  },
  'Resident Evil': {
    name: ['Raccoon City — Autour du R.P.D.', 'Raccoon City — R.P.D. Circuit'],
    place: 'Raccoon City, commissariat R.P.D.', theme: 'city', layout: 'village', difficulty: 3, roadWidth: 90,
    palette: palette('#26384a', '#393f3e', '#68706d', '#ada083', '#a5baca'),
    description: 'Le bâtiment de briques, son porche et les barrières de rue structurent un détour autour du R.P.D. Le brouillard n’emprunte pas les symboles de Silent Hill.',
    references: ['https://game.capcom.com/residentevil/', local('DLC/ResidentEvil/data/loreAccuratePacks.js')],
    landmarks: [
      prop('house', 'Commissariat R.P.D.', 480, 270, 205, 140, 105, '#827469', '#b6b3a4'),
      prop('arch', 'Porche', 480, 280, 84, 86, 26, '#b9b4a1', '#c9c0aa'),
      prop('tower', 'Immeuble de Raccoon City', 680, 265, 66, 138, 76, '#6a706d', '#a3b0af')
    ]
  },
  'Silent Hill': {
    name: ['Silent Hill — Route du brouillard', 'Silent Hill — Fog Road'],
    place: 'Silent Hill, rues noyées de brouillard', theme: 'city', layout: 'grove', difficulty: 3, roadWidth: 90,
    palette: palette('#a0aaa9', '#6e7472', '#898c88', '#a6a498', '#baae92', '#adb8b5'),
    description: 'Des façades usées se dissolvent dans une brume froide. Le parcours reste dans les rues et ne mélange pas automatiquement toutes les versions de l’Autre Monde.',
    references: ['https://www.konami.com/games/silenthill/', local('DLC/SilentHill/data/loreAccuratePacks.js')],
    landmarks: [
      prop('house', 'Façade abandonnée', 365, 270, 105, 110, 90, '#8a8e86', '#a6a999'),
      prop('house', 'Bâtiment dans la brume', 610, 260, 125, 134, 96, '#7b8580', '#a3ada4'),
      prop('tree', 'Arbre dénudé stylisé', 485, 270, 45, 135, 45, '#6c756a', '#a7b29f')
    ]
  },
  'Metal Gear': {
    name: ['Shadow Moses — Périmètre du hangar', 'Shadow Moses — Hangar Perimeter'],
    place: 'Shadow Moses, Alaska', theme: 'snow', layout: 'freighter', difficulty: 3, roadWidth: 92,
    description: 'Les hangars militaires, la neige tassée et les tours de surveillance orientent la course autour de l’installation isolée.',
    references: ['https://www.konami.com/mg/', local('DLC/MetalGear/data/loreAccuratePacks.js')],
    landmarks: [
      prop('hangar', 'Hangar de Shadow Moses', 480, 270, 195, 105, 116, '#65767e', '#9cb6c2'),
      prop('tower', 'Tour de garde', 310, 270, 50, 142, 50, '#647783', '#b1c7cd'),
      prop('mountain', 'Relief enneigé', 675, 260, 100, 145, 98, '#9aadb6', '#dae3e4')
    ]
  },
  'Mass Effect': {
    name: ['Citadelle — Promenade du Présidium', 'Citadel — Presidium Promenade'],
    place: 'Citadelle, Présidium', theme: 'orbital', layout: 'atrium', difficulty: 2, roadWidth: 100,
    palette: palette('#70a4c0', '#497b79', '#c3cece', '#7b999b', '#8bd3ee'),
    description: 'Une promenade claire contourne les jardins du Présidium. Les tours et la courbe de la station restent lisibles au-dessus de la piste.',
    references: [local('DLC/MassEffect/data/loreAccuratePacks.js')],
    landmarks: [
      prop('spire', 'Tour du Présidium', 480, 265, 72, 210, 80, '#c4d3d6', '#8bceeb'),
      prop('arch', 'Courbe de la Citadelle', 480, 270, 270, 160, 24, '#c9d8d6', '#abdcea'),
      prop('tree', 'Jardin du Présidium', 310, 260, 60, 95, 62, '#628e70', '#97b892')
    ]
  },
  Fallout: {
    name: ['Terres désolées — Route de l’Abri', 'Wasteland — Vault Road'],
    place: 'Terres désolées et entrée d’Abri', theme: 'desert', layout: 'quarry', difficulty: 2, roadWidth: 96,
    palette: palette('#b5b799', '#827c5e', '#9b9475', '#b6a778', '#a5ba81'),
    description: 'Bitume usé, baraques de récupération et entrée d’Abri encastrée dans la roche. Le numéro de l’Abri reste indéfini plutôt qu’inventé comme canon.',
    references: [local('DLC/Fallout/data/loreDescriptions.js'), local('DLC/Fallout/data/loreAccuratePacks.js')],
    landmarks: [
      prop('rock', 'Massif de l’Abri', 480, 260, 170, 145, 105, '#8c8c76', '#b0af8f'),
      prop('ring', 'Porte d’Abri stylisée', 480, 295, 88, 88, 16, '#7d918e', '#b3c2a7'),
      prop('house', 'Baraque de récupération', 660, 270, 92, 60, 72, '#9a835f', '#c5b18a')
    ]
  },
  Doom: {
    name: ['Mars — Circuit de la fonderie', 'Mars — Foundry Circuit'],
    place: 'Mars, installation industrielle UAC', theme: 'infernal', layout: 'reactor', difficulty: 4, roadWidth: 88,
    palette: palette('#4b2829', '#543c34', '#796052', '#d49949', '#f0b369'),
    description: 'La fonderie UAC alterne acier massif, conduites et roche martienne. Les accès de maintenance sont adaptés à la conduite au sol.',
    references: [local('DLC/Doom/data/loreAccuratePacks.js')],
    landmarks: [
      prop('reactor', 'Cœur de fonderie', 480, 260, 164, 182, 108, '#71604d', '#eda451'),
      prop('pipe', 'Conduite de transfert', 320, 260, 58, 128, 62, '#7d6953', '#e7a84d'),
      prop('mountain', 'Roche martienne', 665, 270, 100, 126, 100, '#916849', '#ba8e61')
    ]
  },
  'The Matrix': {
    name: ['Mégapole — Échangeur de la Matrice', 'Megacity — Matrix Interchange'],
    place: 'Mégapole simulée, réseau routier', theme: 'city', layout: 'service', difficulty: 3, roadWidth: 92,
    palette: palette('#23352b', '#293c30', '#617361', '#91a388', '#b1c99a'),
    description: 'Tours froides, piles de béton et lumière verdâtre donnent une identité routière à la mégapole. La pluie de code reste un motif du Nexus.',
    references: [local('DLC/TheMatrix/data/loreAccuratePacks.js')],
    landmarks: [
      prop('tower', 'Tour de la mégapole', 375, 260, 90, 230, 92, '#5c6f60', '#a5c09b'),
      prop('tower', 'Immeuble de bureaux', 600, 260, 114, 164, 92, '#6b786b', '#99b08f'),
      prop('arch', 'Pile d’échangeur', 480, 270, 248, 106, 25, '#83917b', '#b5bda0')
    ]
  },
  Predator: {
    name: ['Jungle — Piste de l’extraction', 'Jungle — Extraction Trail'],
    place: 'Jungle tropicale de Predator (1987)', theme: 'forest', layout: 'grove', difficulty: 3, roadWidth: 88,
    description: 'La piste suit une clairière humide, des racines et des rochers ; les feuillages conservent une silhouette de jungle dense autour du couloir roulable.',
    references: ['https://www.20thcenturystudios.com/movies/predator', local('DLC/Predator/data/loreAccuratePacks.js')],
    landmarks: [
      prop('tree', 'Arbre de la canopée', 480, 260, 145, 216, 110, '#426d3e', '#8ba463'),
      prop('palm', 'Palme de jungle', 310, 260, 64, 145, 62, '#558345', '#839e53'),
      prop('rock', 'Roche humide', 660, 270, 110, 72, 86, '#636e55', '#91a378')
    ]
  },
  'Harry Potter': {
    name: ['Poudlard — Cour de pierre', 'Hogwarts — Stone Courtyard'],
    place: 'Poudlard, cour et tours', theme: 'castle', layout: 'fortress', difficulty: 2, roadWidth: 94,
    description: 'Une boucle pavée relie les arches de la cour aux tours de pierre. Le paysage garde une unité de château écossais.',
    references: [local('DLC/HarryPotter/data/loreAccuratePacks.js')],
    landmarks: [
      prop('castle', 'Tours de Poudlard', 480, 265, 185, 190, 100, '#a59b83', '#6b7c88'),
      prop('arch', 'Arcade de la cour', 315, 270, 100, 94, 28, '#afa58a', '#c4bca7'),
      prop('tower', 'Tour secondaire', 660, 260, 62, 170, 62, '#b2a58b', '#737f89')
    ]
  },
  'Crash Bandicoot': {
    name: ['Île N. Sanity — Sentier des ruines', 'N. Sanity Island — Ruins Trail'],
    place: 'Île N. Sanity, jungle et ruines', theme: 'forest', layout: 'canyon', difficulty: 2, roadWidth: 96,
    palette: palette('#7bc2d4', '#488246', '#aa8757', '#c5a275', '#dfb45b'),
    description: 'La route en terre longe des ruines massives et des palmiers ; les caisses restent des volumes de décor tant qu’aucun comportement de casse n’est joué.',
    references: [local('DLC/CrashBandicoot/data/stageLoreProfiles.js')],
    landmarks: [
      prop('temple', 'Ruines de l’île', 480, 260, 148, 143, 112, '#a49168', '#c3ad79'),
      prop('palm', 'Palmier de N. Sanity', 315, 265, 70, 140, 65, '#488746', '#bb965e'),
      prop('block', 'Caisses de parcours', 660, 260, 54, 52, 54, '#ae7b43', '#d9ab68')
    ]
  }
});

/** Map authored OC motifs to shapes without changing their source palette or lore. */
export const KART_OC_THEME_BY_MOTIF = Object.freeze({
  cybercity: 'city', skyfoundry: 'industrial', clockworkcity: 'clockwork',
  warfront: 'industrial', atomiccity: 'city', 'desert-temple': 'desert',
  'marble-forum': 'ruins', 'aegean-temple': 'ruins', 'world-tree': 'forest',
  'andean-terraces': 'ruins', 'torii-night': 'forest', 'celestial-palace': 'castle',
  'primordial-cosmos': 'orbital', 'storm-harbor': 'coast', 'arcane-academy': 'castle',
  'infernal-citadel': 'infernal', 'alien-orbital': 'orbital', 'abyssal-harbor': 'ocean',
  'fantasy-kingdom': 'castle', 'fractured-capital': 'clockwork'
});

export const KART_OC_LAYOUT_BY_MOTIF = Object.freeze({
  cybercity: 'service', skyfoundry: 'freighter', clockworkcity: 'dial',
  warfront: 'quarry', atomiccity: 'atrium', 'desert-temple': 'temple',
  'marble-forum': 'fortress', 'aegean-temple': 'temple', 'world-tree': 'grove',
  'andean-terraces': 'canyon', 'torii-night': 'grove', 'celestial-palace': 'village',
  'primordial-cosmos': 'atrium', 'storm-harbor': 'harbor', 'arcane-academy': 'fortress',
  'infernal-citadel': 'reactor', 'alien-orbital': 'laboratory', 'abyssal-harbor': 'lagoon',
  'fantasy-kingdom': 'village', 'fractured-capital': 'dial'
});
