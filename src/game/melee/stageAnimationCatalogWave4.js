// Scene-specific original geometry. Sources establish the setting/prop, not
// the dimensions or repeated timings below. No official frames are imported.
const scene = definition => Object.freeze({
  ...definition,
  animationWave: 4,
  animationProvenance: 'authored-scene-mechanism-geometry-and-timing',
  renderingKind: 'authored-mechanism',
  localBackdrops: Object.freeze({}),
  timeSource: 'simulation-elapsed-seconds',
  reducedMotionBehavior: 'freeze-at-time-zero',
  sourceVisualValidation: 'not-validated-1:1',
  fidelityVerified: false,
  officialSourceFrames: false,
  gameplayEffect: 'none'
});

export const STAGE_ANIMATION_WAVE_4 = Object.freeze([
  scene({
    id: 'star-wars-death-star1-blast-doors', universes: ['Star Wars'], scenePattern: /(?:death star|[eé]toile.*mort).*(?:hangar|blast|porte)|(?:hangar|blast door).*(?:death star|[eé]toile.*mort)/i,
    excludedScenePattern: /death star\s*(?:ii|2)|[eé]toile.*mort\s*(?:ii|2)|endor|starkiller|[eé]pisode\s*(?:vi\b|vii|viii|ix|[6789])|destroyed|d[eé]truite/i,
    sourceWork: 'Star Wars: A New Hope (1977), first Death Star', sourceReference: 'https://www.starwars.com/databank/Death-Star',
    sourceScene: 'Death Star I — hangar, portes blindées de l’Épisode IV', continuity: 'Episode IV, first Death Star before destruction',
    mechanism: 'death-star1-blast-doors', color: '#aebbc5', periodSeconds: 30,
    sceneEvidence: 'The official Databank establishes the first Death Star and Episode IV. These empty hangar blast-door leaves interpret its mechanical architecture; exact panel outlines and the repeated opening cycle are authored, not validated film frames.'
  }),
  scene({
    id: 'star-wars-cloud-city-carbon-lift', universes: ['Star Wars'], scenePattern: /(?:cloud city|cit[eé].*nuages|bespin).*(?:carbon|cong[eé]lation)|carbon.*(?:cloud city|bespin)/i,
    excludedScenePattern: /kamino|death star|starkiller|[eé]pisode\s*(?:iv\b|vi\b|vii|viii|ix|[46789])|destroyed|d[eé]truite/i,
    sourceWork: 'Star Wars: The Empire Strikes Back (1980), Cloud City', sourceReference: 'https://www.starwars.com/databank/carbon-freezing',
    sourceScene: 'Cloud City — chambre de congélation carbonique, plateforme vide de l’Épisode V', continuity: 'Episode V, Cloud City carbon-freezing chamber',
    mechanism: 'cloud-city-carbon-lift', color: '#c2a183', periodSeconds: 36,
    sceneEvidence: 'The Databank locates carbon freezing in Cloud City in Episode V. An empty chamber platform, guide rods and overhead handling yoke move as a mechanical adaptation; nobody is frozen, injured or spawned.'
  }),
  scene({
    id: 'ghost-shell-sac-tachikoma-maintenance', universes: ['Ghost in the Shell'], scenePattern: /(?:section\s*9|sac|stand alone complex).*tachikoma|tachikoma.*(?:maintenance|atelier|entretien)/i,
    excludedScenePattern: /1995|2017|sac.?2045|arise|innocence|tachikoma.*(?:destroyed|d[eé]truit)/i,
    sourceWork: 'Ghost in the Shell: Stand Alone Complex 2nd GIG (2004)', sourceReference: 'https://theghostintheshell.jp/en/series/stand_alone_complex',
    sourceScene: 'Section 9 — atelier de maintenance des Tachikoma, SAC 2nd GIG', continuity: 'Stand Alone Complex / 2nd GIG, not the 1995 film or SAC_2045',
    mechanism: 'sac-tachikoma-wheel-diagnostic', color: '#90b8c8', periodSeconds: 26,
    sceneEvidence: 'The official SAC page describes four-legged wheeled Tachikoma and Proto maintaining them. Four wheel hubs turn on a fixed maintenance cradle; the small chassis stays in the workshop and has no targeting, weapon or collision.'
  }),
  scene({
    id: 'ghost-shell-sac-cyberbrain-dive-room', universes: ['Ghost in the Shell'], scenePattern: /(?:section\s*9|sac|stand alone complex).*(?:dive|plong[eé]e|cyberbrain.*room)|cyberbrain dive room/i,
    excludedScenePattern: /1995|2017|sac.?2045|arise|innocence/i,
    sourceWork: 'Ghost in the Shell: Stand Alone Complex 2nd GIG (2004)', sourceReference: 'https://theghostintheshell.jp/en/series/stand_alone_complex',
    sourceScene: 'Section 9 — salle de plongée cyberbrain d’Ishikawa, SAC 2nd GIG', continuity: 'Stand Alone Complex / 2nd GIG',
    mechanism: 'sac-dive-room-cable-reels', color: '#9ebbc3', periodSeconds: 32,
    sceneEvidence: 'The official SAC page places Ishikawa in a cyberbrain dive room. Empty seats, cable reels and articulated connector booms give that documented room an authored mechanical treatment; reel geometry and idle motion are adaptations, not a claimed source loop.'
  }),
  scene({
    id: 'mad-max-mfp-interceptor-blower', universes: ['Mad Max'], scenePattern: /mfp.*(?:garage|interceptor|pursuit)|(?:garage|interceptor).*mfp/i,
    excludedScenePattern: /fury road|furiosa|citadel|citadelle|1979.*destroyed|d[eé]truit|road warrior|mad max\s*2/i,
    sourceWork: 'Mad Max (1979), Main Force Patrol garage', sourceReference: 'https://en.wikipedia.org/wiki/Pursuit_Special',
    sourceScene: 'MFP — garage de Mad Max 1979, courroie du compresseur de l’Interceptor', continuity: 'Mad Max (1979), fictional blower engaged',
    mechanism: 'mfp-interceptor-blower-belt', color: '#b9b5a2', periodSeconds: 19,
    sceneEvidence: 'The Pursuit Special is assembled in the MFP garage. The fictional engaged supercharger drives this belt drawing; the 1979 filming prop had a nonfunctional blower, so this is explicitly a film-world interpretation rather than a claim about real prop mechanics.'
  }),
  scene({
    id: 'mad-max2-refinery-process-pump', universes: ['Mad Max'], scenePattern: /(?:mad max\s*2|road warrior|pappagallo).*(?:refinery|raffinerie)|(?:refinery|raffinerie).*pappagallo/i,
    excludedScenePattern: /fury road|furiosa|citadel|citadelle|exploded|explos[eé]e|destroyed|d[eé]truite|apr[eè]s.*explosion/i,
    sourceWork: 'Mad Max 2 / The Road Warrior (1981), Pappagallo refinery compound', sourceReference: 'https://en.wikipedia.org/wiki/Mad_Max_2',
    sourceScene: 'Road Warrior — raffinerie de Pappagallo en activité, pompes de procédé', continuity: 'Mad Max 2 (1981), refinery before demolition',
    mechanism: 'road-warrior-refinery-process-pump', color: '#c1ac87', periodSeconds: 23,
    sceneEvidence: 'The plot establishes a working oil refinery occupied by Pappagallo’s settlers before its demolition. A linked flywheel, piston and process pipe interpret that function; this exact pump layout and timing are original, not a verified film prop.'
  }),
  scene({
    id: 'fury-road-citadel-water-actuators', universes: ['Mad Max: Fury Road'], scenePattern: /(?:citadel|citadelle).*(?:water|eau|aqua\s*cola|actuat|actionneur)|aqua\s*cola.*(?:citadel|citadelle)/i,
    excludedScenePattern: /mad max\s*2|road warrior|mfp|1979|furiosa.*2024|destroyed|d[eé]truite/i,
    sourceWork: 'Mad Max: Fury Road (2015), Citadel water release', sourceReference: 'https://www.fxguide.com/fxfeatured/a-graphic-tale-the-visual-effects-of-mad-max-fury-road/',
    sourceScene: 'Citadelle de Fury Road 2015 — actionneurs des conduites d’Aqua Cola', continuity: 'Mad Max: Fury Road (2015)',
    mechanism: 'citadel-water-pipe-actuators', color: '#b7c5b3', periodSeconds: 39,
    sceneEvidence: 'The fxguide production interview identifies ship-pump actuators on the Citadel balcony and the water-release shot. Linked valve arms and a bounded falling-water ribbon interpret those pieces; no water pushes, floods or changes the combat floor.'
  }),
  scene({
    id: 'fury-road-war-rig-tanker-coupling', universes: ['Mad Max: Fury Road'], scenePattern: /war rig.*(?:desert|d[eé]sert|tanker|citerne|coupl)|(?:citerne|tanker).*war rig/i,
    excludedScenePattern: /mad max\s*2|road warrior|mfp|1979|furiosa.*2024|crash|wreck|[eé]pave|renvers[eé]/i,
    sourceWork: 'Mad Max: Fury Road (2015), War Rig on the desert route', sourceReference: 'https://www.fxguide.com/fxfeatured/a-graphic-tale-the-visual-effects-of-mad-max-fury-road/',
    sourceScene: 'Fury Road — route désertique du War Rig, roues et attelage de la citerne', continuity: 'Mad Max: Fury Road (2015), intact travelling War Rig',
    mechanism: 'war-rig-articulated-tanker', color: '#c0aa8b', periodSeconds: 41,
    sceneEvidence: 'The production interview describes the War Rig driving in the desert and its physical/VFX vehicle work. A distant tractor and cylindrical tanker share a fixed hitch while their wheels turn; no chase actors, collisions or playable vehicle are introduced.'
  }),
  scene({
    id: 'cyberpunk2077-ncart-viaduct-train', universes: ['Cyberpunk'], scenePattern: /(?:2077|night city|ncart).*(?:ncart|viaduct|viaduc|metro|m[eé]tro)|ncart.*(?:2\.1|train)/i,
    excludedScenePattern: /edgerunners|2076|2075|2022 anime|before.*2\.1|avant.*2\.1/i,
    sourceWork: 'Cyberpunk 2077, Update 2.1 (2023), NCART', sourceReference: 'https://www.cyberpunk.net/en/news/49597/update-2-1-patch-notes',
    sourceScene: 'Night City 2077 — NCART 2.1, rame articulée sur le viaduc', continuity: 'Cyberpunk 2077, playable NCART introduced in Update 2.1',
    mechanism: 'ncart2077-viaduct-train', color: '#b9b37f', periodSeconds: 43,
    sceneEvidence: 'CDPR Update 2.1 documents five NCART lines and nineteen stations. A three-car train crosses a concrete viaduct with articulated joins; the chosen span and timetable are authored and provide no ride, route change or collision.'
  }),
  scene({
    id: 'cyberpunk2077-h10-apartment-door', universes: ['Cyberpunk'], scenePattern: /(?:h10|v.s apartment|appartement.*v).*(?:apartment|appartement|door|porte)|(?:apartment|appartement|door|porte).*h10/i,
    excludedScenePattern: /edgerunners|2076|2075|h4\b|gloria|david|abandoned|abandonn[eé]/i,
    sourceWork: 'Cyberpunk 2077, V’s Megabuilding H10 apartment', sourceReference: 'https://www.cyberpunk.net/en/news/49831/patch-2-11',
    sourceScene: 'Megabuilding H10 — appartement de V, porte coulissante et rail supérieur', continuity: 'Cyberpunk 2077, H10 apartment; not David’s H4 home',
    mechanism: 'h10-apartment-sliding-door', color: '#b8b291', periodSeconds: 33,
    sceneEvidence: 'The official Patch 2.11 notes identify the H10 apartment door and its automatic closing. The sliding leaf and overhead drive interpret that doorway; their shape and maintenance-style opening cycle are authored, with no usable entrance, apartment state or security effect.'
  }),
  scene({
    id: 'edgerunners-david-ncart-platform', universes: ['Cyberpunk: Edgerunners'], scenePattern: /(?:david|edgerunners).*(?:ncart|metro|m[eé]tro|platform|quai)|ncart.*(?:2076|2075|anime)/i,
    excludedScenePattern: /update\s*2\.1|2077.*game|jeu.*2077|phantom liberty|v.s apartment/i,
    sourceWork: 'Cyberpunk: Edgerunners (2022), David’s commute', sourceReference: 'https://vulkk.com/2022/09/17/all-locations-from-edgerunners-in-cyberpunk2077/',
    sourceScene: 'Edgerunners — quai NCART du trajet scolaire de David, rame à l’arrêt', continuity: 'Cyberpunk: Edgerunners (2022), anime commute before Academy expulsion',
    mechanism: 'edgerunners-platform-train-doors', color: '#b1bd8b', periodSeconds: 37,
    sceneEvidence: 'The location comparison identifies the metro station used by David on his way to Arasaka Academy. A stopped train opens paired leaves behind a fixed platform screen; the door cycle and projection are authored, not footage or an anime timing reconstruction.'
  }),
  scene({
    id: 'edgerunners-doc-clinic-chair', universes: ['Cyberpunk: Edgerunners'], scenePattern: /(?:doc|ripperdoc).*clinic|clinique.*(?:doc|ripper)|edgerunners.*(?:chair|fauteuil|clinic)/i,
    excludedScenePattern: /viktor|vektor|phantom liberty|update\s*2\.1|2077.*game|jeu.*2077/i,
    sourceWork: 'Cyberpunk: Edgerunners (2022), Doc’s clinic in episodes 1–2', sourceReference: 'https://www.springfieldspringfield.co.uk/view_episode_scripts.php?episode=s01e02&tv-show=cyberpunk-edgerunners-2022',
    sourceScene: 'Edgerunners — clinique de Doc, fauteuil de cyberware vide et appui articulé', continuity: 'Cyberpunk: Edgerunners (2022), Doc; not Viktor Vektor’s game clinic',
    mechanism: 'edgerunners-doc-chair-linkage', color: '#a2b9b6', periodSeconds: 34,
    sceneEvidence: 'Episode 2’s transcript explicitly names Doc’s clinic and treatment. The empty reclining fixture and linked support are an authored interpretation of that clinical setting, not evidence that these exact moving struts appear in an official frame; no treatment changes a hero.'
  }),
  scene({
    id: 'robocop1987-ocp-ed209-diagnostic', universes: ['RoboCop'], scenePattern: /ocp.*(?:ed.?209|boardroom|conseil)|ed.?209.*(?:ocp|diagnostic|demo)/i,
    excludedScenePattern: /2014|remake|robocop\s*[23]|delta city.*completed|d[eé]truit|destroyed/i,
    sourceWork: 'RoboCop (1987), OCP boardroom ED-209 demonstration', sourceReference: 'https://en.wikipedia.org/wiki/RoboCop',
    sourceScene: 'OCP — salle du conseil de RoboCop 1987, diagnostic mécanique de l’ED-209', continuity: 'RoboCop (1987), ED-209 demonstration; no attack reenactment',
    mechanism: 'ocp-ed209-diagnostic-joints', color: '#abb8bf', periodSeconds: 29,
    sceneEvidence: 'The film’s plot identifies the OCP boardroom ED-209 demonstration. The distant unit pivots its upper housing and knee joints above fixed feet; this harmless diagnostic cycle adapts the prop without reenacting its attack or adding an NPC.'
  }),
  scene({
    id: 'robocop1987-metro-west-maintenance', universes: ['RoboCop'], scenePattern: /metro west.*(?:maintenance|chair|fauteuil|atelier)|robocop.*1987.*maintenance/i,
    excludedScenePattern: /2014|remake|robocop\s*[23]|ed.?209|destroyed|d[eé]truit/i,
    sourceWork: 'RoboCop (1987), Metro West maintenance station', sourceReference: 'https://en.wikipedia.org/wiki/RoboCop',
    sourceScene: 'Metro West — station de maintenance de RoboCop 1987, siège et connecteurs vides', continuity: 'RoboCop (1987), Metro West police station',
    mechanism: 'metro-west-maintenance-booms', color: '#a6babc', periodSeconds: 35,
    sceneEvidence: 'The film places RoboCop at Metro West and shows him during maintenance. A fixed upright service chair and two connector booms interpret that station; no occupant, memory sequence, healing or armor change is simulated and the exact mechanism is authored.'
  }),
  scene({
    id: 'blade-runner1982-spinner-vtol', universes: ['Blade Runner'], scenePattern: /(?:los angeles|la\s*2019|blade runner.*1982).*(?:spinner|vtol)|spinner.*(?:2019|1982)/i,
    excludedScenePattern: /2049|2099|wallace|las vegas|k.s spinner/i,
    sourceWork: 'Blade Runner (1982), Los Angeles 2019 police Spinner', sourceReference: 'https://www.bfi.org.uk/features/blade-runner',
    sourceScene: 'Los Angeles 2019 — Spinner de Blade Runner 1982, ascension verticale', continuity: 'Blade Runner (1982), Los Angeles 2019; not 2049',
    mechanism: 'blade-runner-spinner-vtol', color: '#a6b8c4', periodSeconds: 47,
    sceneEvidence: 'The BFI article describes the film’s flying cars and its Los Angeles setting. A recognizable twin-front-pod police Spinner rises behind the scene; its path and mechanical outline are original approximations, without importing a vehicle, pilot or source frames.'
  }),
  scene({
    id: 'blade-runner1982-bradbury-cage-lift', universes: ['Blade Runner'], scenePattern: /bradbury.*(?:elevator|lift|ascenseur|cage)|(?:elevator|ascenseur).*bradbury/i,
    excludedScenePattern: /2049|2099|wallace|las vegas/i,
    sourceWork: 'Blade Runner (1982), Bradbury Building atrium elevator', sourceReference: 'https://moviemaps.org/images/1d7i',
    sourceScene: 'Bradbury Building — ascenseur à cage de l’atrium dans Blade Runner 1982', continuity: 'Blade Runner (1982), Bradbury Building',
    mechanism: 'bradbury-cage-elevator', color: '#b9aa91', periodSeconds: 44,
    sceneEvidence: 'MovieMaps identifies the on-screen Bradbury elevator ascending the atrium; the BFI separately identifies the filming location. The small lattice cage travels within fixed iron guides, with no usable platform or change to stage collision.'
  }),
  scene({
    id: 'bebop-swordfish-hangar-folding-wings', universes: ['Cowboy Bebop'], scenePattern: /bebop.*(?:hangar|swordfish.*wing)|swordfish.*(?:fold|ailes|wings)/i,
    excludedScenePattern: /2021|netflix.*live|live.action|remake|red tail|hammerhead/i,
    sourceWork: 'Cowboy Bebop (1998 anime), Swordfish II in the Bebop hangar', sourceReference: 'https://special.goodsmile.info/swordfish-II/en/',
    sourceScene: 'Bebop — hangar du Swordfish II, repli des ailes de l’anime de 1998', continuity: 'Cowboy Bebop (1998 anime), Swordfish II; not the 2021 live-action show',
    mechanism: 'swordfish-folding-wings', color: '#c09284', periodSeconds: 31,
    sceneEvidence: 'The licensed Swordfish model page, supervised by mechanical designer Kimitoshi Yamane, documents folding wings, landing gear and a parked configuration. This empty hangar silhouette articulates the wing joints; proportions and maintenance cycle are authored.'
  }),
  scene({
    id: 'bebop-swordfish-service-monopod', universes: ['Cowboy Bebop'], scenePattern: /swordfish.*(?:monopod|train.*atterrissage|service|landing gear)|bebop.*service bay/i,
    excludedScenePattern: /2021|netflix.*live|live.action|remake|red tail|hammerhead|folding wings|repli.*ailes/i,
    sourceWork: 'Cowboy Bebop (1998 anime), Swordfish II service bay', sourceReference: 'https://special.goodsmile.info/swordfish-II/en/',
    sourceScene: 'Swordfish II — baie de service du Bebop, monopode et verrière articulés', continuity: 'Cowboy Bebop (1998 anime), Swordfish II mechanical design',
    mechanism: 'swordfish-service-monopod', color: '#b69c91', periodSeconds: 38,
    sceneEvidence: 'The supervised licensed model documents a monopod shown closed or open and an opening cockpit cover. A side-view service cradle supports the ship while the monopod and empty canopy move; the repeated maintenance choreography is an adaptation, not a claimed anime scene loop.'
  }),
  scene({
    id: 'eva1995-tokyo3-retracting-buildings', universes: ['Neon Genesis Evangelion'], scenePattern: /tokyo.?3.*(?:retract|r[eé]tract|building|immeuble|fortress)|fortress.*tokyo.?3/i,
    excludedScenePattern: /rebuild|3\.0|2\.0|1\.0|wunder|end of evangelion|third impact|troisi[eè]me impact|destroyed|d[eé]truite|crater|crat[eè]re/i,
    sourceWork: 'Neon Genesis Evangelion (1995 TV), Tokyo-3 fortress city', sourceReference: 'https://wiki.evageeks.org/Tokyo-3',
    sourceScene: 'Tokyo-3 — immeubles rétractables de la série TV 1995, configuration de forteresse', continuity: '1995 TV, intact Tokyo-3 before its destruction; not Rebuild',
    mechanism: 'tokyo3-hydraulic-buildings', color: '#b7b6a0', periodSeconds: 49,
    sceneEvidence: 'EvaWiki describes buildings descending under the surface on hydraulic systems and protective armor sliding over them. Three bounded background shafts show that mechanism; their speeds and projections are original, and the battle floor never retracts.'
  }),
  scene({
    id: 'eva1995-nerv-launch-frame', universes: ['Neon Genesis Evangelion'], scenePattern: /(?:nerv|geofront|g[eé]ofront).*(?:launch|catapult|lancement)|tokyo.?3.*(?:eva.*launch|lancement.*eva)/i,
    excludedScenePattern: /rebuild|3\.0|2\.0|1\.0|wunder|end of evangelion|third impact|troisi[eè]me impact|destroyed|d[eé]truite|crater|crat[eè]re/i,
    sourceWork: 'Neon Genesis Evangelion (1995 TV), NERV launch shafts beneath Tokyo-3', sourceReference: 'https://wiki.evageeks.org/Tokyo-3',
    sourceScene: 'NERV — puits de lancement du Géofront TV 1995, berceau vide sur rails', continuity: '1995 TV, intact NERV Tokyo-3 launch system',
    mechanism: 'nerv-empty-launch-frame', color: '#b5aa92', periodSeconds: 27,
    sceneEvidence: 'EvaWiki identifies EVA units launching from beneath Tokyo-3 through disguised gates. This empty guide-frame, interlock and cable assembly interprets that system; no EVA, weapon cache, launch command, collision or encounter is created.'
  }),
  scene({
    id: 'fifth-element2263-taxi-lanes', universes: ['Le Cinquième Element'], scenePattern: /(?:new york|2263|cinqui[eè]me).*(?:taxi|traffic|trafic)|taxi.*(?:korben|2263)/i,
    excludedScenePattern: /1914|fhloston|floston|destroyed|d[eé]truit/i,
    sourceWork: 'The Fifth Element (1997), New York 2263 taxi traffic', sourceReference: 'https://en.wikipedia.org/wiki/The_Fifth_Element',
    sourceScene: 'New York 2263 — taxi jaune de Korben et voies aériennes du Cinquième Élément', continuity: 'The Fifth Element (1997), future New York 2263; not the 1914 prologue',
    mechanism: 'new-york2263-yellow-taxi-lanes', color: '#c4b174', periodSeconds: 45,
    sceneEvidence: 'The film article describes Korben’s flying taxi and the digitally created traffic lanes. Boxy yellow taxis travel on separated height bands with vertical connector lights; the routes and timing are authored, without playable traffic or a chase.'
  }),
  scene({
    id: 'fifth-element-fhloston-opera-curtains', universes: ['Le Cinquième Element'], scenePattern: /fhloston.*(?:opera|op[eé]ra|curtain|rideau|paradise)|floston.*(?:opera|rideau)/i,
    excludedScenePattern: /after.*(?:bomb|explosion)|apr[eè]s.*(?:bombe|explosion)|destroyed|d[eé]truit|1914/i,
    sourceWork: 'The Fifth Element (1997), Fhloston Paradise opera auditorium', sourceReference: 'https://en.wikipedia.org/wiki/The_Fifth_Element',
    sourceScene: 'Fhloston Paradise — salle d’opéra avant évacuation, rideaux et câbles de cintres', continuity: 'The Fifth Element (1997), Fhloston Paradise before destruction',
    mechanism: 'fhloston-opera-curtain-rig', color: '#b09db9', periodSeconds: 42,
    sceneEvidence: 'The film article identifies the Fhloston opera performance and the Royal Opera House filming location. Pleated curtains and a visible rig drum interpret the auditorium’s staging; this cycle is authored, with no Diva performance, explosion or automatic music playback.'
  }),
  scene({
    id: 'futurama-new-new-york-tubes', universes: ['Futurama'], scenePattern: /new new york.*(?:tube|transport)|futurama.*(?:transport tube|tube.*transport)/i,
    excludedScenePattern: /1999.*old new york|old new york|ancien new york|destroyed|d[eé]truit/i,
    sourceWork: 'Futurama, Space Pilot 3000 (1999), New New York transport tubes', sourceReference: 'https://imsdb.com/transcripts/Futurama-Space-Pilot-3000.html',
    sourceScene: 'New New York — tubes de transport du pilote de Futurama, conduits transparents', continuity: 'Space Pilot 3000, future New New York',
    mechanism: 'new-new-york-pneumatic-tubes', color: '#9cbeac', periodSeconds: 33,
    sceneEvidence: 'The pilot transcript describes green overhead tubes carrying passengers across the city. Two routed transparent conduits show small air-flow markers instead of occupants; the pressure visualization is authored, with no transport, suction or character displacement.'
  }),
  scene({
    id: 'futurama-planet-express-roof', universes: ['Futurama'], scenePattern: /planet express.*(?:hangar|roof|toit)|(?:hangar|toit).*planet express/i,
    excludedScenePattern: /destroyed|d[eé]truit|crash|[eé]pave/i,
    sourceWork: 'Futurama, Space Pilot 3000 (1999), Planet Express hangar', sourceReference: 'https://imsdb.com/transcripts/Futurama-Space-Pilot-3000.html',
    sourceScene: 'Planet Express — hangar du pilote, toit rétractable et vérin de rampe', continuity: 'Space Pilot 3000, intact Planet Express headquarters',
    mechanism: 'planet-express-retractable-roof', color: '#9cb7b1', periodSeconds: 40,
    sceneEvidence: 'The pilot transcript explicitly describes machinery tilting the ship and the whole hangar roof retracting. Sliding roof panels and an empty hinged service ramp interpret that mechanism; no ship launches, floor angle or building state changes.'
  })
]);

// Reference choices only fill an unspecified scene; a concrete place always wins.
export const WAVE_4_MODE_REFERENCE_SCENES = Object.freeze({
  'Star Wars': { Combat: 'Death Star I hangar blast doors Episode IV', Melee: 'Cloud City carbon-freezing chamber Episode V', RPG: 'Death Star I hangar blast doors Episode IV', Tactics: 'Cloud City carbon-freezing chamber Episode V' },
  'Ghost in the Shell': { Combat: 'Section 9 Tachikoma maintenance SAC 2nd GIG', Melee: 'Section 9 cyberbrain dive room SAC 2nd GIG', RPG: 'Section 9 Tachikoma maintenance SAC 2nd GIG', Tactics: 'Section 9 cyberbrain dive room SAC 2nd GIG' },
  'Mad Max': { Combat: 'MFP garage Interceptor Mad Max 1979', Melee: 'Road Warrior Pappagallo refinery', RPG: 'MFP garage Interceptor Mad Max 1979', Tactics: 'Road Warrior Pappagallo refinery' },
  'Mad Max: Fury Road': { Combat: 'Citadel AquaCola water actuators Fury Road 2015', Melee: 'War Rig desert tanker coupling Fury Road 2015', RPG: 'Citadel AquaCola water actuators Fury Road 2015', Tactics: 'War Rig desert tanker coupling Fury Road 2015' },
  Cyberpunk: { Combat: 'Night City 2077 NCART 2.1 viaduct train', Melee: 'Megabuilding H10 V apartment door', RPG: 'Night City 2077 NCART 2.1 viaduct train', Tactics: 'Megabuilding H10 V apartment door' },
  'Cyberpunk: Edgerunners': { Combat: 'Edgerunners David NCART platform', Melee: 'Edgerunners Doc clinic chair', RPG: 'Edgerunners David NCART platform', Tactics: 'Edgerunners Doc clinic chair' },
  RoboCop: { Combat: 'OCP ED209 boardroom diagnostic RoboCop 1987', Melee: 'Metro West maintenance chair RoboCop 1987', RPG: 'OCP ED209 boardroom diagnostic RoboCop 1987', Tactics: 'Metro West maintenance chair RoboCop 1987' },
  'Blade Runner': { Combat: 'Los Angeles 2019 Spinner Blade Runner 1982', Melee: 'Bradbury cage elevator Blade Runner 1982', RPG: 'Los Angeles 2019 Spinner Blade Runner 1982', Tactics: 'Bradbury cage elevator Blade Runner 1982' },
  'Cowboy Bebop': { Combat: 'Bebop hangar Swordfish folding wings anime 1998', Melee: 'Swordfish service monopod anime 1998', RPG: 'Bebop hangar Swordfish folding wings anime 1998', Tactics: 'Swordfish service monopod anime 1998' },
  'Neon Genesis Evangelion': { Combat: 'Tokyo-3 retracting buildings TV 1995', Melee: 'NERV Geofront launch frame TV 1995', RPG: 'Tokyo-3 retracting buildings TV 1995', Tactics: 'NERV Geofront launch frame TV 1995' },
  'Le Cinquième Element': { Combat: 'New York 2263 Korben yellow taxi traffic', Melee: 'Fhloston Paradise opera curtains', RPG: 'New York 2263 Korben yellow taxi traffic', Tactics: 'Fhloston Paradise opera curtains' },
  Futurama: { Combat: 'New New York transport tubes', Melee: 'Planet Express hangar retractable roof', RPG: 'New New York transport tubes', Tactics: 'Planet Express hangar retractable roof' }
});

const tau = Math.PI * 2;
const wrap = value => ((value % 1) + 1) % 1;
const line = (ctx, points) => { ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); };
const polygon = (ctx, points) => { ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill(); };
const ellipse = (ctx, x, y, rx, ry, fill = false) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, tau); if (fill) ctx.fill(); else ctx.stroke(); };
const wheel = (ctx, x, y, r, angle, spokes = 6) => {
  ellipse(ctx, x, y, r, r);
  for (let i = 0; i < spokes; i++) { const a = angle + i * tau / spokes; line(ctx, [[x, y], [x + Math.cos(a) * r * 0.82, y + Math.sin(a) * r * 0.82]]); }
};
const hinge = (ctx, points, r = 3) => { line(ctx, points); for (const [x, y] of points) ellipse(ctx, x, y, r, r); };

/** Each case draws a specific mechanical silhouette, using the supplied clock. */
export function drawStageAnimationWave4(ctx, animation, frame, width, height) {
  if (animation.animationWave !== 4) return false;
  const w = width, h = height, a = frame.phase, p = frame.progress, travel = (1 - Math.cos(a)) / 2;
  ctx.globalAlpha = 0.14;
  switch (animation.mechanism) {
    case 'death-star1-blast-doors': {
      const x = w * 0.7, y = h * 0.2, span = w * 0.2, gap = travel * span * 0.38;
      ctx.strokeRect(x - w * 0.012, y - h * 0.02, span + w * 0.024, h * 0.29);
      ctx.save(); ctx.beginPath(); ctx.rect(x, y, span, h * 0.25); ctx.clip();
      for (const side of [-1, 1]) {
        const edge = x + span / 2 + side * gap;
        ctx.strokeRect(side < 0 ? edge - span / 2 : edge, y, span / 2, h * 0.25);
        for (let rib = 0; rib < 4; rib++) ctx.strokeRect(edge + side * w * 0.015, y + h * (0.02 + rib * 0.055), side * span * 0.3, h * 0.025);
      }
      ctx.restore();
      for (const end of [x, x + span]) { wheel(ctx, end, y - h * 0.025, h * 0.012, a); line(ctx, [[end, y - h * 0.025], [x + span / 2, y - h * 0.025]]); }
      break;
    }
    case 'cloud-city-carbon-lift': {
      const cx = w * 0.2, y = h * (0.4 - travel * 0.11), rx = w * 0.075;
      ellipse(ctx, cx, h * 0.45, rx * 1.25, h * 0.025);
      for (const side of [-1, 1]) { const x = cx + side * rx; line(ctx, [[x, h * 0.2], [x, h * 0.45]]); ctx.strokeRect(x - w * 0.004, y, w * 0.008, h * 0.45 - y); }
      ellipse(ctx, cx, y, rx, h * 0.02); line(ctx, [[cx - rx, y], [cx - rx, y + h * 0.014], [cx + rx, y + h * 0.014], [cx + rx, y]]);
      for (let segment = 0; segment < 8; segment++) { const angle = segment * tau / 8; line(ctx, [[cx + Math.cos(angle) * rx * 0.4, y + Math.sin(angle) * h * 0.008], [cx + Math.cos(angle) * rx, y + Math.sin(angle) * h * 0.02]]); }
      const hookY = h * (0.17 + travel * 0.025);
      line(ctx, [[cx, h * 0.1], [cx, hookY], [cx - w * 0.022, hookY + h * 0.025], [cx - w * 0.022, hookY + h * 0.05]]);
      line(ctx, [[cx, hookY], [cx + w * 0.022, hookY + h * 0.025], [cx + w * 0.022, hookY + h * 0.05]]);
      break;
    }
    case 'sac-tachikoma-wheel-diagnostic': {
      const cx = w * 0.78, cy = h * 0.3;
      ellipse(ctx, cx, cy, w * 0.035, h * 0.05); ellipse(ctx, cx - w * 0.025, cy - h * 0.018, w * 0.015, h * 0.023);
      for (const side of [-1, 1]) for (const depth of [-1, 1]) {
        const root = [cx + side * w * 0.022, cy + depth * h * 0.018], knee = [cx + side * w * 0.06, cy + depth * h * 0.04], hub = [cx + side * w * 0.067, cy + h * (0.08 + depth * 0.013)];
        hinge(ctx, [root, knee, hub], 2); wheel(ctx, hub[0], hub[1], h * 0.014, a * side + depth, 5);
      }
      line(ctx, [[cx - w * 0.08, h * 0.42], [cx + w * 0.08, h * 0.42]]);
      for (const side of [-1, 1]) line(ctx, [[cx + side * w * 0.045, h * 0.42], [cx + side * w * 0.025, h * 0.35]]);
      break;
    }
    case 'sac-dive-room-cable-reels': {
      const y = h * 0.3;
      for (let station = 0; station < 2; station++) {
        const x = w * (0.12 + station * 0.14), offset = Math.sin(a + station * Math.PI) * h * 0.02;
        wheel(ctx, x, h * 0.17, h * 0.025, a + station, 8);
        ctx.strokeRect(x - w * 0.027, y, w * 0.054, h * 0.09);
        line(ctx, [[x - w * 0.02, y + h * 0.09], [x - w * 0.035, h * 0.44], [x + w * 0.035, h * 0.44], [x + w * 0.02, y + h * 0.09]]);
        hinge(ctx, [[x + w * 0.04, h * 0.17], [x + w * 0.045, h * 0.23 + offset], [x, y - h * 0.015 + offset]], 2);
        line(ctx, [[x, h * 0.195], [x - w * 0.012, h * 0.24 + offset], [x, y - h * 0.015 + offset]]);
        ctx.strokeRect(x - w * 0.007, y - h * 0.02 + offset, w * 0.014, h * 0.012);
      }
      break;
    }
    case 'mfp-interceptor-blower-belt': {
      const x = w * 0.67, y = h * 0.37;
      polygon(ctx, [[x, y], [x + w * 0.045, y - h * 0.01], [x + w * 0.08, y - h * 0.065], [x + w * 0.17, y - h * 0.065], [x + w * 0.2, y - h * 0.01], [x + w * 0.24, y], [x + w * 0.24, y + h * 0.025], [x, y + h * 0.025]]);
      for (const dx of [0.05, 0.195]) wheel(ctx, x + w * dx, y + h * 0.025, h * 0.021, 0, 5);
      const bx = x + w * 0.065, top = h * 0.28, bottom = h * 0.345;
      ctx.strokeRect(bx - w * 0.012, top - h * 0.023, w * 0.035, h * 0.025);
      for (const cy of [top, bottom]) wheel(ctx, bx, cy, h * 0.012, a * 2, 5);
      line(ctx, [[bx - h * 0.012, top], [bx - h * 0.012, bottom], [bx + h * 0.012, bottom], [bx + h * 0.012, top], [bx - h * 0.012, top]]);
      for (let tooth = 0; tooth < 6; tooth++) ctx.fillRect(bx - h * 0.013, top + wrap(p * 2 + tooth / 6) * (bottom - top), 2, 3);
      break;
    }
    case 'road-warrior-refinery-process-pump': {
      const cx = w * 0.19, cy = h * 0.37, crank = [cx + Math.cos(a) * h * 0.035, cy + Math.sin(a) * h * 0.035], headX = w * (0.28 + Math.cos(a) * 0.016);
      wheel(ctx, cx, cy, h * 0.043, a, 8); hinge(ctx, [crank, [headX, cy]], 2);
      ctx.strokeRect(w * 0.25, h * 0.35, w * 0.09, h * 0.04); ctx.strokeRect(headX - w * 0.009, h * 0.351, w * 0.018, h * 0.038);
      line(ctx, [[w * 0.31, h * 0.35], [w * 0.31, h * 0.22], [w * 0.11, h * 0.22], [w * 0.11, h * 0.41]]);
      ctx.strokeRect(w * 0.08, h * 0.27, w * 0.06, h * 0.14); ellipse(ctx, w * 0.11, h * 0.27, w * 0.03, h * 0.012);
      line(ctx, [[w * 0.15, h * 0.42], [w * 0.35, h * 0.42]]);
      break;
    }
    case 'citadel-water-pipe-actuators': {
      for (let pipe = 0; pipe < 3; pipe++) {
        const x = w * (0.7 + pipe * 0.075), open = (1 - Math.cos(a + pipe * 0.35)) / 2, y = h * 0.3;
        line(ctx, [[x, h * 0.13], [x, y], [x - w * 0.025, y + h * 0.02]]);
        ctx.strokeRect(x - w * 0.009, h * 0.15, w * 0.018, h * 0.13);
        hinge(ctx, [[x + w * 0.025, h * 0.18], [x + w * (0.035 - open * 0.02), h * (0.23 + open * 0.02)], [x, y]], 2);
        ellipse(ctx, x - w * 0.025, y + h * 0.02, w * 0.012, h * 0.008);
        ctx.globalAlpha = 0.055;
        for (let ribbon = 0; ribbon < 4; ribbon++) {
          const fall = wrap(p * 2 + ribbon / 4) * h * 0.16, end = h * (0.35 + open * 0.15);
          line(ctx, [[x - w * 0.029 + ribbon * w * 0.003, Math.min(y + h * 0.025 + fall, end)], [x - w * 0.035 + ribbon * w * 0.005, Math.min(y + h * 0.05 + fall, end)]]);
        }
        ctx.globalAlpha = 0.14;
      }
      break;
    }
    case 'war-rig-articulated-tanker': {
      const x = w * (0.095 + Math.sin(a) * 0.012), y = h * 0.35, hitch = [x + w * 0.095, y + h * 0.028];
      polygon(ctx, [[x, y], [x + w * 0.025, y - h * 0.018], [x + w * 0.045, y - h * 0.06], [x + w * 0.085, y - h * 0.06], [x + w * 0.085, y + h * 0.025], [x, y + h * 0.025]]);
      line(ctx, [[x + w * 0.075, y + h * 0.028], hitch, [hitch[0] + w * 0.022, hitch[1]]]);
      ellipse(ctx, hitch[0], hitch[1], 3, 3);
      const tilt = Math.sin(a) * h * 0.004;
      polygon(ctx, [[hitch[0] + w * 0.012, y - h * 0.048], [hitch[0] + w * 0.16, y - h * 0.048 + tilt], [hitch[0] + w * 0.18, y - h * 0.01 + tilt], [hitch[0] + w * 0.16, y + h * 0.018 + tilt], [hitch[0] + w * 0.012, y + h * 0.018]]);
      for (let rib = 0; rib < 7; rib++) line(ctx, [[hitch[0] + w * (0.025 + rib * 0.021), y - h * 0.045 + tilt * rib / 7], [hitch[0] + w * (0.025 + rib * 0.021), y + h * 0.015 + tilt * rib / 7]]);
      for (const dx of [0.02, 0.07, 0.2, 0.226, 0.25]) wheel(ctx, x + w * dx, y + h * (0.03 + (dx > 0.1 ? Math.sin(a) * 0.004 : 0)), h * 0.016, a * 3, 7);
      break;
    }
    case 'ncart2077-viaduct-train': {
      const y = h * 0.26, x = w * (-0.36 + p * 1.72);
      line(ctx, [[0, y + h * 0.072], [w, y + h * 0.072]]);
      for (const pier of [0.12, 0.44, 0.76]) line(ctx, [[w * pier, y + h * 0.072], [w * (pier - 0.012), h * 0.47], [w * (pier + 0.012), h * 0.47], [w * pier, y + h * 0.072]]);
      for (let car = 0; car < 3; car++) {
        const cx = x + car * w * 0.125; ctx.strokeRect(cx, y, w * 0.115, h * 0.06);
        for (let pane = 0; pane < 5; pane++) ctx.strokeRect(cx + w * (0.01 + pane * 0.02), y + h * 0.012, w * 0.014, h * 0.022);
        for (const dx of [0.018, 0.09]) wheel(ctx, cx + w * dx, y + h * 0.06, h * 0.008, a * 4, 4);
        if (car < 2) line(ctx, [[cx + w * 0.115, y + h * 0.025], [cx + w * 0.125, y + h * 0.025], [cx + w * 0.115, y + h * 0.045], [cx + w * 0.125, y + h * 0.045]]);
      }
      break;
    }
    case 'h10-apartment-sliding-door': {
      const x = w * 0.73, y = h * 0.18, span = w * 0.12, offset = travel * span * 0.84;
      ctx.strokeRect(x - w * 0.012, y - h * 0.018, span + w * 0.025, h * 0.29);
      line(ctx, [[x - w * 0.02, y - h * 0.025], [x + span * 1.9, y - h * 0.025]]);
      ctx.save(); ctx.beginPath(); ctx.rect(x, y, span, h * 0.25); ctx.clip();
      ctx.strokeRect(x + offset, y, span, h * 0.25);
      for (const rib of [0.04, 0.08, 0.17, 0.21]) line(ctx, [[x + offset + w * 0.012, y + h * rib], [x + offset + span - w * 0.012, y + h * rib]]);
      ctx.strokeRect(x + offset + span * 0.12, y + h * 0.11, span * 0.09, h * 0.035); ctx.restore();
      wheel(ctx, x + offset + span * 0.4, y - h * 0.025, h * 0.009, a * 2, 5);
      ctx.strokeRect(x - w * 0.028, y + h * 0.07, w * 0.014, h * 0.05);
      break;
    }
    case 'edgerunners-platform-train-doors': {
      const x = w * 0.09, y = h * 0.2, gap = travel * w * 0.028;
      ctx.strokeRect(x, y, w * 0.25, h * 0.2);
      for (const dx of [0.02, 0.17]) ctx.strokeRect(x + w * dx, y + h * 0.025, w * 0.055, h * 0.065);
      const center = x + w * 0.125;
      for (const side of [-1, 1]) {
        const edge = center + side * gap; ctx.strokeRect(side < 0 ? edge - w * 0.03 : edge, y + h * 0.02, w * 0.03, h * 0.17);
        ctx.strokeRect(edge + side * w * 0.006, y + h * 0.04, side * w * 0.017, h * 0.06);
      }
      ctx.strokeRect(x - w * 0.015, h * 0.407, w * 0.28, h * 0.02);
      line(ctx, [[center - w * 0.045, h * 0.41], [center - w * 0.045, h * 0.31], [center + w * 0.045, h * 0.31], [center + w * 0.045, h * 0.41]]);
      break;
    }
    case 'edgerunners-doc-chair-linkage': {
      const x = w * 0.75, y = h * 0.35, lean = -0.58 + Math.sin(a) * 0.15;
      const hip = [x, y], back = [x + Math.sin(lean) * w * 0.055, y - Math.cos(lean) * h * 0.13], foot = [x + w * 0.07, y + h * 0.035];
      hinge(ctx, [back, hip, [x + w * 0.045, y], foot], 3);
      for (const side of [-1, 1]) line(ctx, [[back[0] + side * w * 0.008, back[1]], [x + side * w * 0.008, y]]);
      ctx.strokeRect(x - w * 0.035, h * 0.445, w * 0.11, h * 0.018);
      hinge(ctx, [[x + w * 0.035, h * 0.445], [x - w * 0.005, y + h * 0.01], [x + w * 0.055, h * 0.445]], 2);
      hinge(ctx, [[x - w * 0.06, h * 0.43], [x - w * 0.07, h * (0.24 + travel * 0.02)], [back[0] - w * 0.014, back[1] - h * 0.018]], 2);
      break;
    }
    case 'ocp-ed209-diagnostic-joints': {
      const cx = w * 0.2, cy = h * 0.24, sway = Math.sin(a) * w * 0.008;
      polygon(ctx, [[cx - w * 0.04 + sway, cy], [cx - w * 0.035 + sway, cy - h * 0.06], [cx + w * 0.04 + sway, cy - h * 0.055], [cx + w * 0.05 + sway, cy + h * 0.015], [cx - w * 0.04 + sway, cy + h * 0.015]]);
      for (const side of [-1, 1]) {
        const hip = [cx + side * w * 0.025 + sway, cy + h * 0.02], knee = [cx + side * w * 0.047, h * (0.33 + Math.sin(a) * 0.006)], foot = [cx + side * w * 0.055, h * 0.415];
        hinge(ctx, [hip, knee, foot], 3); ctx.strokeRect(foot[0] - w * 0.018, foot[1], w * 0.036, h * 0.018);
        line(ctx, [[cx + side * w * 0.04 + sway, cy], [cx + side * w * 0.07 + sway, cy + h * 0.025], [cx + side * w * 0.08 + sway, cy + h * 0.012]]);
      }
      ctx.strokeRect(w * 0.1, h * 0.44, w * 0.2, h * 0.015);
      break;
    }
    case 'metro-west-maintenance-booms': {
      const x = w * 0.8, y = h * 0.23;
      ctx.strokeRect(x - w * 0.023, y, w * 0.046, h * 0.14);
      line(ctx, [[x - w * 0.03, h * 0.37], [x - w * 0.037, h * 0.42], [x + w * 0.035, h * 0.42], [x + w * 0.028, h * 0.37]]);
      ctx.strokeRect(x - w * 0.044, h * 0.45, w * 0.088, h * 0.025);
      for (const side of [-1, 1]) {
        const elbow = [x + side * w * (0.075 - travel * 0.02), h * (0.21 + travel * 0.03)], tip = [x + side * w * (0.03 + travel * 0.008), h * (0.285 + Math.sin(a) * 0.015)];
        hinge(ctx, [[x + side * w * 0.09, h * 0.42], elbow, tip], 3);
        ctx.strokeRect(tip[0] - w * 0.008, tip[1] - h * 0.008, w * 0.016, h * 0.016);
        line(ctx, [[x + side * w * 0.095, h * 0.42], [elbow[0] + side * w * 0.008, elbow[1]], tip]);
      }
      break;
    }
    case 'blade-runner-spinner-vtol': {
      const x = w * (0.16 + Math.sin(a) * 0.022), y = h * (0.35 - travel * 0.15);
      polygon(ctx, [[x - w * 0.055, y + h * 0.02], [x - w * 0.055, y - h * 0.012], [x - w * 0.025, y - h * 0.02], [x - w * 0.013, y - h * 0.055], [x + w * 0.025, y - h * 0.05], [x + w * 0.04, y - h * 0.01], [x + w * 0.065, y], [x + w * 0.065, y + h * 0.025]]);
      for (const side of [-1, 1]) { ellipse(ctx, x + side * w * 0.041, y + h * 0.01, w * 0.019, h * 0.018); wheel(ctx, x + side * w * 0.041, y + h * 0.01, h * 0.012, 0, 5); }
      ctx.strokeRect(x - w * 0.008, y - h * 0.045, w * 0.028, h * 0.025); ctx.strokeRect(x - w * 0.002, y - h * 0.062, w * 0.013, h * 0.006);
      ctx.globalAlpha = 0.045; ellipse(ctx, w * 0.16, h * 0.47, w * (0.065 - travel * 0.02), h * 0.007);
      break;
    }
    case 'bradbury-cage-elevator': {
      const x = w * 0.75, y = h * (0.3 - Math.cos(a) * 0.09), span = w * 0.11;
      for (const dx of [-0.012, 0, 0.11, 0.122]) line(ctx, [[x + w * dx, h * 0.11], [x + w * dx, h * 0.52]]);
      for (const level of [0.16, 0.29, 0.42]) line(ctx, [[x - w * 0.035, h * level], [x + span + w * 0.035, h * level]]);
      ctx.strokeRect(x, y, span, h * 0.105);
      for (let slat = 0; slat < 6; slat++) {
        const left = x + slat * span / 6;
        line(ctx, [[left, y], [left + span / 6, y + h * 0.105]]); line(ctx, [[left + span / 6, y], [left, y + h * 0.105]]);
      }
      for (const dx of [0.015, 0.095]) line(ctx, [[x + w * dx, h * 0.11], [x + w * dx, y]]);
      wheel(ctx, x + span / 2, h * 0.105, h * 0.014, a, 6);
      break;
    }
    case 'swordfish-folding-wings': {
      const cx = w * 0.2, cy = h * 0.31, fold = travel * 1.2, length = w * 0.07;
      polygon(ctx, [[cx, cy - h * 0.12], [cx + w * 0.02, cy + h * 0.07], [cx, cy + h * 0.09], [cx - w * 0.02, cy + h * 0.07]]);
      ellipse(ctx, cx, cy - h * 0.02, w * 0.011, h * 0.035);
      for (const side of [-1, 1]) {
        const root = [cx + side * w * 0.014, cy], end = [cx + side * (w * 0.014 + Math.cos(fold) * length), cy - Math.sin(fold) * h * 0.09];
        polygon(ctx, [root, end, [end[0], end[1] + h * 0.035], [root[0], root[1] + h * 0.06]]);
        hinge(ctx, [root, end], 2); line(ctx, [[cx + side * w * 0.01, cy + h * 0.06], [cx + side * w * 0.03, cy + h * 0.11]]);
      }
      line(ctx, [[cx - w * 0.1, h * 0.44], [cx + w * 0.1, h * 0.44]]);
      break;
    }
    case 'swordfish-service-monopod': {
      const cx = w * 0.78, cy = h * 0.3, angle = travel * 0.8, root = [cx - w * 0.025, cy + h * 0.026], knee = [cx - w * 0.025 + Math.sin(angle) * w * 0.025, cy + h * 0.026 + Math.cos(angle) * h * 0.048];
      polygon(ctx, [[cx - w * 0.1, cy + h * 0.02], [cx - w * 0.03, cy - h * 0.025], [cx + w * 0.065, cy - h * 0.02], [cx + w * 0.09, cy + h * 0.025]]);
      ellipse(ctx, cx + w * 0.07, cy + h * 0.005, h * 0.025, h * 0.03);
      const hingePoint = [cx - w * 0.02, cy - h * 0.025], canopyTip = [hingePoint[0] - Math.cos(angle) * w * 0.045, hingePoint[1] - Math.sin(angle) * h * 0.09];
      line(ctx, [hingePoint, canopyTip, [canopyTip[0] + w * 0.012, canopyTip[1] - h * 0.018]]);
      hinge(ctx, [root, knee, [knee[0] + w * 0.008, knee[1] + h * 0.024]], 2);
      line(ctx, [[knee[0] - w * 0.008, knee[1] + h * 0.026], [knee[0] + w * 0.02, knee[1] + h * 0.026]]);
      for (const side of [-1, 1]) line(ctx, [[cx + side * w * 0.05, cy + h * 0.018], [cx + side * w * 0.06, h * 0.45], [cx + side * w * 0.035, h * 0.45]]);
      break;
    }
    case 'tokyo3-hydraulic-buildings': {
      for (let building = 0; building < 3; building++) {
        const x = w * (0.69 + building * 0.078), base = h * 0.47, top = h * (0.19 + building * 0.028 + travel * 0.25), span = w * 0.052;
        ctx.save(); ctx.beginPath(); ctx.rect(x - w * 0.008, h * 0.12, span + w * 0.016, base - h * 0.12); ctx.clip();
        ctx.strokeRect(x, top, span, h * 0.28);
        for (let row = 0; row < 8; row++) line(ctx, [[x + w * 0.006, top + h * (0.02 + row * 0.03)], [x + span - w * 0.006, top + h * (0.02 + row * 0.03)]]);
        const plate = Math.max(0, travel - 0.65) / 0.35 * span;
        ctx.strokeRect(x, base - h * 0.006, plate, h * 0.012); ctx.restore();
        line(ctx, [[x - w * 0.01, base], [x + span + w * 0.01, base]]);
      }
      break;
    }
    case 'nerv-empty-launch-frame': {
      const x = w * 0.17, y = h * (0.38 - travel * 0.19), span = w * 0.11;
      for (const side of [-1, 1]) {
        const rail = x + side * span / 2; ctx.strokeRect(rail - w * 0.006, h * 0.12, w * 0.012, h * 0.38);
        line(ctx, [[rail, h * 0.13], [rail, y]]);
        for (let notch = 0; notch < 8; notch++) line(ctx, [[rail - w * 0.009, h * (0.15 + notch * 0.043)], [rail + w * 0.009, h * (0.15 + notch * 0.043)]]);
      }
      ctx.strokeRect(x - span / 2, y, span, h * 0.07);
      line(ctx, [[x - span / 2, y + h * 0.07], [x - span / 2 + w * 0.018, y + h * 0.04], [x + span / 2 - w * 0.018, y + h * 0.04], [x + span / 2, y + h * 0.07]]);
      for (const side of [-1, 1]) hinge(ctx, [[x + side * w * 0.07, h * 0.135], [x + side * w * (0.04 + travel * 0.02), h * 0.16]], 2);
      break;
    }
    case 'new-york2263-yellow-taxi-lanes': {
      for (let lane = 0; lane < 3; lane++) {
        const x = w * wrap((lane % 2 ? -p : p) + lane * 0.31), y = h * (0.17 + lane * 0.095);
        polygon(ctx, [[x - w * 0.027, y], [x - w * 0.024, y - h * 0.025], [x + w * 0.012, y - h * 0.025], [x + w * 0.027, y - h * 0.008], [x + w * 0.033, y], [x + w * 0.03, y + h * 0.018], [x - w * 0.027, y + h * 0.018]]);
        ctx.strokeRect(x - w * 0.014, y - h * 0.019, w * 0.021, h * 0.017); ctx.strokeRect(x - w * 0.006, y - h * 0.031, w * 0.015, h * 0.006);
        for (const side of [-1, 1]) ellipse(ctx, x + side * w * 0.024, y + h * 0.012, w * 0.007, h * 0.006);
        ctx.globalAlpha = 0.04; line(ctx, [[0, y + h * 0.035], [w, y + h * 0.035]]); ctx.globalAlpha = 0.14;
      }
      break;
    }
    case 'fhloston-opera-curtain-rig': {
      const cx = w * 0.8, y = h * 0.18, half = w * 0.09, opening = travel * half * 0.75;
      line(ctx, [[cx - half - w * 0.015, y], [cx + half + w * 0.015, y]]);
      for (const side of [-1, 1]) {
        const inner = cx + side * opening, outer = cx + side * half;
        polygon(ctx, [[outer, y], [inner, y], [inner + side * w * 0.008, h * 0.44], [outer, h * 0.44]]);
        for (let fold = 1; fold < 5; fold++) { const x = outer + (inner - outer) * fold / 5; line(ctx, [[x, y], [x + side * w * 0.004, h * 0.44]]); }
        wheel(ctx, cx + side * (half + w * 0.014), y - h * 0.018, h * 0.012, a * side, 6);
        line(ctx, [[outer, y], [outer, y - h * 0.018], [cx, y - h * 0.018]]);
      }
      ellipse(ctx, cx, h * 0.46, half, h * 0.015); ctx.strokeRect(cx - half, h * 0.46, half * 2, h * 0.015);
      break;
    }
    case 'new-new-york-pneumatic-tubes': {
      for (const [y, side] of [[0.22, 1], [0.37, -1]]) {
        const curve = x => h * (y + Math.sin(x * Math.PI) * 0.035);
        for (const offset of [-0.012, 0.012]) line(ctx, Array.from({ length: 21 }, (_, i) => [w * i / 20, curve(i / 20) + h * offset]));
        for (let ring = 0; ring < 11; ring++) ellipse(ctx, w * ring / 10, curve(ring / 10), w * 0.004, h * 0.012);
        for (let marker = 0; marker < 4; marker++) {
          const x = wrap(p * side + marker / 4); line(ctx, [[w * x, curve(x)], [w * Math.min(1, x + 0.016), curve(Math.min(1, x + 0.016))]]);
        }
      }
      for (const x of [0.12, 0.58, 0.9]) line(ctx, [[w * x, h * 0.17], [w * x, h * 0.45]]);
      break;
    }
    case 'planet-express-retractable-roof': {
      const cx = w * 0.2, top = h * 0.17, half = w * 0.1, slide = travel * half * 0.85;
      line(ctx, [[cx - half, top], [cx - half, h * 0.46], [cx + half, h * 0.46], [cx + half, top]]);
      for (const side of [-1, 1]) {
        const inner = cx + side * slide; line(ctx, [[cx + side * half, top], [inner, top], [inner, top + h * 0.015], [cx + side * half, top + h * 0.015]]);
        for (let rib = 0; rib < 5; rib++) line(ctx, [[inner + side * rib * w * 0.018, top], [inner + side * rib * w * 0.018, top + h * 0.015]]);
        wheel(ctx, cx + side * half, top + h * 0.02, h * 0.01, a * side, 5);
      }
      const pivot = [cx - w * 0.07, h * 0.43], tip = [pivot[0] + Math.cos(travel * Math.PI / 4) * w * 0.135, pivot[1] - Math.sin(travel * Math.PI / 4) * h * 0.23];
      line(ctx, [pivot, tip]); hinge(ctx, [[cx + w * 0.025, h * 0.46], [(pivot[0] + tip[0]) / 2, (pivot[1] + tip[1]) / 2]], 2);
      break;
    }
    default: return false;
  }
  return true;
}
