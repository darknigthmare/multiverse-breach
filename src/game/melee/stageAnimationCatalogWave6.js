// References identify scene functions, never imported animation frames. Every
// outline, distance, speed and repeating maintenance cycle below is authored.
const scene = definition => Object.freeze({
  ...definition,
  animationWave: 6,
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

export const STAGE_ANIMATION_WAVE_6 = Object.freeze([
  scene({
    id: 'titanfall2-assembly-house-arms', universes: ['Titanfall 2'],
    scenePattern: /(?:into the abyss|dans les abysses|dynamic testing|urban assembly).*(?:assembl|factory|usine|pr[eé]fab|robot|bras)/i,
    excludedScenePattern: /titanfall\s*1\b|apex|destroyed|d[eé]truit|after.*collapse|apr[eè]s.*effondrement/i,
    sourceWork: 'Titanfall 2 (2016), Into the Abyss, Dynamic Testing Facility',
    sourceReference: 'https://www.pcgamer.com/titanfall-2s-singleplayer-campaign-is-more-portal-2-than-call-of-duty/', sourceAccess: 'opened-text',
    sourceScene: 'Into the Abyss — usine de maisons préfabriquées, bras d’assemblage, Titanfall 2 2016',
    continuity: '2016 released campaign, running factory before its collapse',
    mechanism: 'assembly-house-two-link-arms', color: '#aab6b9', periodSeconds: 42,
    sceneEvidence: 'The review describes robotic arms assembling houses and rotating their structure; the indexed Prima guide also identifies two stair/floor arms. Fixed-length two-link arms position an empty frame in this original distant study. Exact joints, trajectory and return cycle are adapted; no crushing plate, occupied house or gameplay platform is added.'
  }),
  scene({
    id: 'titanfall2-beacon-substation-fans', universes: ['Titanfall 2'],
    scenePattern: /(?:beacon|balise).*(?:substation|sous.station|triple fans|ventilat)/i,
    excludedScenePattern: /titanfall\s*1\b|apex|arc tool.*(?:disabled|off)|ventilat.*arr[eê]t|fan.*(?:stopped|disabled)|destroyed|d[eé]truit/i,
    sourceWork: 'Titanfall 2 (2016), The Beacon substation', sourceReference: 'https://www.monster-clip.com/titanfall2.html', sourceAccess: 'opened-designer-text',
    sourceScene: 'The Beacon — sous-station et Triple Fans, Titanfall 2 2016', continuity: 'Released Titanfall 2 campaign, working substation ventilation; no early prototype layout claimed',
    mechanism: 'beacon-substation-three-axial-fans', color: '#9fb8b2', periodSeconds: 26,
    sceneEvidence: 'Designer Jason McCord discusses the Beacon substation, its fan traversal sections and Arc Tool. Three caged axial fans reference that machinery; their positions, blade geometry and speeds are authored. No airflow, movement force, Arc Tool activation or obstacle is created.'
  }),
  scene({
    id: 'ff13-palumpolum-mobile-paddies', universes: ['Final Fantasy XIII'],
    scenePattern: /(?:palumpolum|carbuncle|nutriculture).*(?:padd|hydropon|rizi[eè]re|culture|complex)/i,
    excludedScenePattern: /xiii\s*-?\s*2\b|13\s*-\s*2\b|lightning returns|after.*catastrophe|apr[eè]s.*catastrophe|dormant|destroyed|d[eé]truit/i,
    sourceWork: 'Final Fantasy XIII (2009), Palumpolum Nutriculture Complex', sourceReference: 'https://jegged.com/Games/Final-Fantasy-XIII/Datalog/The-FalCie.html', sourceAccess: 'opened-datalog-transcription',
    sourceScene: 'Palumpolum — complexe nutricole de Carbuncle, rizières mobiles de Final Fantasy XIII 2009', continuity: 'Original FFXIII chapter 7; not XIII-2 or Lightning Returns',
    mechanism: 'palumpolum-oval-mobile-paddies', color: '#91bca2', periodSeconds: 56,
    sceneEvidence: 'The Carbuncle datalog describes mobile hydroponic paddies and regulated light and water. Empty planted trays follow an authored closed oval guide; this is a physical interpretation of the stated farming function, not a source-verified rail plan, edible resource or platform.'
  }),
  scene({
    id: 'ff13-mahhabara-atomos-cutter', universes: ['Final Fantasy XIII'],
    scenePattern: /(?:mah.?habara|atomos).*(?:cutter|tunnel|excavat|forage|creus|fal.cie)/i,
    excludedScenePattern: /xiii\s*-?\s*2\b|13\s*-\s*2\b|lightning returns|dead dunes|dunes.*mort|immobili|destroyed|d[eé]truit/i,
    sourceWork: 'Final Fantasy XIII (2009), Mah’habara Subterra, fal’Cie Atomos', sourceReference: 'https://jegged.com/Games/Final-Fantasy-XIII/Datalog/The-FalCie.html', sourceAccess: 'opened-datalog-transcription',
    sourceScene: 'Mah’habara — Atomos, fal’Cie de forage dans Final Fantasy XIII 2009', continuity: 'Original FFXIII on Gran Pulse, working Atomos; not its later immobilized incarnation',
    mechanism: 'mahhabara-atomos-segmented-excavator', color: '#b7aa91', periodSeconds: 47,
    sceneEvidence: 'The Atomos datalog establishes continuous tunnel excavation and exposed mineral deposits at Mah’habara. A distant segmented spherical cutter rotates against a fixed empty tunnel mouth; the cutting teeth, scale and repeat are original approximations. No terrain is removed and nobody rides it.'
  }),
  scene({
    id: 'ff15-hammerhead-fuel-meter', universes: ['Final Fantasy XV'],
    scenePattern: /hammerhead.*(?:fuel|pump|essence|pompe|station)/i,
    excludedScenePattern: /comrades|dawn of the future|episode ardyn|world of ruin|monde.*ruine|perpetual darkness|dix ans|ten years|abandon|destroyed|d[eé]truit/i,
    sourceWork: 'Final Fantasy XV (2016), Hammerhead service station', sourceReference: 'https://finalfantasyxv.fandom.com/wiki/Hammerhead', sourceAccess: 'indexed-excerpt-only-open-failed',
    sourceScene: 'Hammerhead — station-service, pompe et flexible de carburant, Final Fantasy XV 2016', continuity: 'Daylit main-game Hammerhead before the ten-year absence',
    mechanism: 'hammerhead-pump-meter-and-hose', color: '#b7b0a2', periodSeconds: 43,
    sceneEvidence: 'The indexed location entry lists Hammerhead’s garage and gas pump; full opening was blocked. A pump enclosure, mechanical meter and tethered hose interpret refuelling. Counter construction and sway are authored, with no vehicle, fuel consumption, economic effect or claim of a verified animated prop.'
  }),
  scene({
    id: 'ff15-lestallum-steam-valves', universes: ['Final Fantasy XV'],
    scenePattern: /(?:lestallum|exineris).*(?:steam|valve|vapeur|vanne|pipe|tuyau)/i,
    excludedScenePattern: /comrades|dawn of the future|episode ardyn|world of ruin|monde.*ruine|ten years|dix ans|destroyed|d[eé]truit/i,
    sourceWork: 'Final Fantasy XV (2016), Holly’s Steam Valve Inspection in Lestallum', sourceReference: 'https://www.gamerguides.com/final-fantasy-xv/guide/optional-content/sidequests/hollys-sidequests', sourceAccess: 'opened-walkthrough-text',
    sourceScene: 'Lestallum — EXINERIS, groupe de trois tuyaux bleus et vannes de vapeur de Holly', continuity: 'Main game chapter 8, after A Precious Source of Power; no quest progression',
    mechanism: 'lestallum-blue-pipe-valve-array', color: '#8eafc4', periodSeconds: 37,
    sceneEvidence: 'The guide specifies blue steam pipes in groups of three and their inspection after the power-plant quest. Three handwheels and bounded valve stems interpret that repair context; no leak, heat, power loss or completed objective is imposed by the decorative maintenance cycle.'
  }),
  scene({
    id: 'tf2-turbine-three-rotors', universes: ['Team Fortress 2'],
    scenePattern: /(?:ctf.?turbine|turbine).*(?:room|salle|rotor|hall)|ctf.?turbine/i,
    excludedScenePattern: /team fortress classic|tf\s*1\b|custom|workshop|community remix|destroyed|d[eé]truit|stopped|arr[eê]t[eé]/i,
    sourceWork: 'Team Fortress 2, official ctf_turbine map (2008 release)', sourceReference: 'https://strategywiki.org/wiki/Team_Fortress_2/ctf_turbine', sourceAccess: 'indexed-excerpt-only-open-failed',
    sourceScene: 'ctf_turbine — salle centrale aux trois turbines, Team Fortress 2', continuity: 'Official stock ctf_turbine; no workshop geometry or custom variant',
    mechanism: 'turbine-central-three-horizontal-rotors', color: '#a5b0ac', periodSeconds: 31,
    sceneEvidence: 'The indexed map guide identifies three turbines in the central room; full page opening failed. Three separate cylindrical housings and rotating shafts interpret that arrangement. Blade profiles and phase offsets are authored, without push force, routes, objectives or copied map textures.'
  }),
  scene({
    id: 'tf2-sawmill-paired-blades', universes: ['Team Fortress 2'],
    scenePattern: /sawmill.*(?:arena|scierie|blade|scie)|arena.?sawmill/i,
    excludedScenePattern: /koth|king of the hill|capture.*flag|ctf|custom|workshop|team fortress classic|destroyed|d[eé]truit/i,
    sourceWork: 'Team Fortress 2, arena_sawmill (2009)', sourceReference: 'https://wiki.teamfortress.com/wiki/Community_Sawmill_(Arena)_strategy', sourceAccess: 'indexed-excerpt-only-open-failed',
    sourceScene: 'arena_sawmill — paire de scies du hangar central, Team Fortress 2 2009', continuity: 'Official Arena version of Sawmill; imagery isolated behind the combat lane',
    mechanism: 'sawmill-two-enclosed-saw-wheels', color: '#b4ac98', periodSeconds: 29,
    sceneEvidence: 'The indexed official wiki identifies Sawmill’s two saw blades. Their source-map hazards are not reproduced: the authored pair is rendered as a distant enclosed mechanical study, with no collision, instant kill, hit detection or playable cutting plane.'
  }),
  scene({
    id: 'tlou2013-hotel-generator-starter', universes: ['The Last of Us'],
    scenePattern: /(?:pittsburgh|hotel lobby|h[oô]tel).*(?:basement|sous.sol|generator|g[eé]n[eé]rateur)/i,
    excludedScenePattern: /part\s*(?:ii|2|i\b)|remake|2022|hbo|tv series|s[eé]rie|seattle|destroyed|d[eé]truit|out of fuel|sans carburant/i,
    sourceWork: 'The Last of Us (2013), Pittsburgh Hotel Lobby basement generator', sourceReference: 'https://gamewith.net/the-last-of-us/article/show/18622', sourceAccess: 'opened-walkthrough-text',
    sourceScene: 'Pittsburgh — sous-sol de l’hôtel et générateur, The Last of Us 2013', continuity: 'Original 2013 game or 2014 remaster; excludes the 2022 remake and television',
    mechanism: 'hotel-generator-pullcord-flywheel', color: '#aaa687', periodSeconds: 41,
    sceneEvidence: 'The walkthrough places the generator in the hotel basement near the locked exit. A bounded pull starter and fixed flywheel reinterpret its starting action. Exact machinery and repeated safe test are authored; no infected spawn, lights, lock, sound or escape objective changes.'
  }),
  scene({
    id: 'tlou2013-tommy-dam-bridge-valves', universes: ['The Last of Us'],
    scenePattern: /(?:tommy|jackson|hydroelectric).*(?:dam|barrage|bridge|pont|valve|vanne)/i,
    excludedScenePattern: /part\s*(?:ii|2|i\b)|remake|2022|hbo|tv series|s[eé]rie|seattle|destroyed|d[eé]truit/i,
    sourceWork: 'The Last of Us (2013), Tommy’s Dam hydroelectric approach', sourceReference: 'https://www.gamepressure.com/thelastofus/hydroelectric-dam/zd50bf', sourceAccess: 'opened-walkthrough-text',
    sourceScene: 'Tommy’s Dam — barrage hydroélectrique, deux passerelles relevées par les vannes, 2013', continuity: 'Original game dam approach before meeting Tommy; not a later Jackson settlement',
    mechanism: 'tommys-dam-paired-lift-bridges', color: '#a9b4aa', periodSeconds: 53,
    sceneEvidence: 'The guide describes two red valves raising separate bridge sections. Two small platforms remain on fixed vertical guides and are linked visually to handwheels. Their symmetric return cycle is authored, without changing water height, the traversable floor, rescue state or character position.'
  }),
  scene({
    id: 'deusex2000-versalife-security-ramp', universes: ['Deus Ex'],
    scenePattern: /versa.?life.*(?:level.?2|niveau.?2|security ramp|rampe|labs|laboratoire)/i,
    excludedScenePattern: /invisible war|human revolution|mankind divided|revision|gmdx|destroyed|d[eé]truit|after.*uc.*destr/i,
    sourceWork: 'Deus Ex (2000), Hong Kong VersaLife level-two labs security ramp', sourceReference: 'https://www.supercheats.com/pc/walkthroughs/deusex-walkthrough04.txt', sourceAccess: 'opened-walkthrough-text',
    sourceScene: 'VersaLife — laboratoires niveau 2, rampe de sécurité de Deus Ex 2000', continuity: 'Original 2000 game level-two lab before UC destruction; no overhaul mod',
    mechanism: 'versalife-hinged-security-ramp', color: '#9baeb9', periodSeconds: 49,
    sceneEvidence: 'Section 009.1 describes lowering a ramp across the labs and a security terminal raising it. A rigid hinged walkway and tension cable interpret this documented mechanism. Its dimensions and empty cycle are authored; no terminal, camera, robot, security flag or reachable path changes.'
  }),
  scene({
    id: 'deusex2000-subbase-mini-sub', universes: ['Deus Ex'],
    scenePattern: /(?:mj12|sub.?base|base sous.marine).*(?:mini.?sub|submarine|sous.marin|dock|quai)/i,
    excludedScenePattern: /invisible war|human revolution|mankind divided|revision|gmdx|destroyed|d[eé]truit|ocean lab.*ruins/i,
    sourceWork: 'Deus Ex (2000), MJ12 New West Coast submarine base', sourceReference: 'https://www.supercheats.com/pc/walkthroughs/deusex-walkthrough04.txt', sourceAccess: 'opened-walkthrough-text',
    sourceScene: 'MJ12 Sub Base — quai du mini-sous-marin pour l’Ocean Lab, Deus Ex 2000', continuity: 'Original game mission 020 at the sub base; no Ocean Lab collapse scene',
    mechanism: 'mj12-mini-sub-docking-screw', color: '#9baea7', periodSeconds: 38,
    sceneEvidence: 'Mission 020 establishes the mini-sub at the MJ12 base and travel to the Ocean Lab. A small empty moored pressure hull with a turning screw and linked rudder is an authored functional projection. Exact propeller arrangement is not source-verified; it transports no actor and launches no mission.'
  }),
  scene({
    id: 'pirates2003-portroyal-smithy-wheel', universes: ['Pirates of the Caribbean'],
    scenePattern: /(?:port royal|john brown).*(?:smith|forge|wheel|roue)/i,
    excludedScenePattern: /dead man.s chest|secret du coffre|2006|2007|2011|2017|lego|ride|attraction|destroyed|d[eé]truit/i,
    sourceWork: 'Pirates of the Caribbean: The Curse of the Black Pearl (2003), John Brown’s smithy', sourceReference: 'https://www.americanhumane.org/production/pirates-of-the-caribbean-the-curse-of-the-black-pearl/', sourceAccess: 'opened-production-report',
    sourceScene: 'Port Royal — roue de la forge de John Brown, La Malédiction du Black Pearl 2003', continuity: '2003 film smithy duel setting, empty machinery study rather than a reenacted fight',
    mechanism: 'portroyal-smithy-sweep-wheel', color: '#b6a485', periodSeconds: 57,
    sceneEvidence: 'The production animal-action report confirms the smithy wheel during Jack and Will’s duel and explains its off-camera operation. An empty sweep and wheel rotate on a fixed axle here; the animal, fight and heated poker are absent. Transmission details and the continuous test cycle are authored.'
  }),
  scene({
    id: 'pirates2006-isla-cruces-millwheel', universes: ['Pirates of the Caribbean'],
    scenePattern: /isla cruces.*(?:mill|wheel|moulin|roue)/i,
    excludedScenePattern: /2003|2007|2011|2017|lego|detached|d[eé]tach[eé]|rolling away|roue.*libre|after.*break|apr[eè]s.*rupture|destroyed|d[eé]truit/i,
    sourceWork: 'Pirates of the Caribbean: Dead Man’s Chest (2006), Isla Cruces old mill', sourceReference: 'https://pirates.fandom.com/wiki/Isla_Cruces', sourceAccess: 'indexed-excerpt-only-open-failed',
    sourceScene: 'Isla Cruces — roue encore fixée au vieux moulin, Dead Man’s Chest 2006', continuity: '2006 film before the wheel breaks off; no rolling duel or detached wheel',
    mechanism: 'isla-cruces-attached-mill-wheel', color: '#b3a88d', periodSeconds: 51,
    sceneEvidence: 'The indexed island entry identifies the abandoned mill waterwheel; the linked battle context describes its later detachment. This cycle keeps the wheel fixed to its bearing before that event. The spoke count, slow rotation and empty masonry silhouette are authored, without rolling objects or occupants.'
  }),
  scene({
    id: 'chickenrun2000-pie-machine-press', universes: ['Chicken Run'],
    scenePattern: /(?:tweedy|pie.machine|machine.*tourte).*(?:barn|grange|press|presse|conveyor|convoyeur)|pie.machine/i,
    excludedScenePattern: /dawn of the nugget|2023|fun.land|explod|explos|after.*destr|apr[eè]s.*destr|destroyed|d[eé]truit/i,
    sourceWork: 'Chicken Run (2000), Tweedy farm pie-machine barn', sourceReference: 'https://www.filmsite.org/chickenrun.html', sourceAccess: 'opened-film-scene-account',
    sourceScene: 'Ferme Tweedy — grange de la machine à tourtes, Chicken Run 2000', continuity: 'Original 2000 film, intact machine before the final explosion',
    mechanism: 'tweedy-empty-pie-press-conveyor', color: '#aca692', periodSeconds: 36,
    sceneEvidence: 'The film account identifies the delivered automated pie machine and its barn. Empty circular tins move under a guided press in a sealed distant study. The production path and timing are authored; no animal, meat, oven heat, pressure explosion or cutting hazard is rendered or applied.'
  }),
  scene({
    id: 'chickenrun2000-old-crate-drive', universes: ['Chicken Run'],
    scenePattern: /(?:old crate|vieux coucou|aircraft|avion).*(?:chicken run|2000|coop|poulailler|fowler|pedal|p[eé]dal)/i,
    excludedScenePattern: /dawn of the nugget|2023|fun.land|airborne|en vol|crash|destroyed|d[eé]truit/i,
    sourceWork: 'Chicken Run (2000), Old Crate aircraft assembly in the coops', sourceReference: 'https://www.filmsite.org/chickenrun.html', sourceAccess: 'opened-film-scene-account',
    sourceScene: 'Old Crate — atelier du poulailler, entraînement de l’avion de Chicken Run 2000', continuity: 'Original 2000 film aircraft, stationary assembly/test interpretation before takeoff',
    mechanism: 'old-crate-pedal-chain-propeller', color: '#b3ab91', periodSeconds: 32,
    sceneEvidence: 'The film account establishes the chicken-coop aircraft assembled for the escape. A stationary empty crank, chain and propeller interpret its hand-built drive; exact gearing and test cycle are authored. No passengers, aircraft flight, launch event or gameplay vehicle is introduced.'
  }),
  scene({
    id: 'wallace1993-living-room-model-train', universes: ['Wallace & Gromit'],
    scenePattern: /(?:wrong trousers|mauvais pantalon|1993).*(?:train|rail|living room|salon)/i,
    excludedScenePattern: /close shave|ras[eé].*pr[eè]s|1995|grand day out|1989|2005|2008|2024|vengeance|museum|mus[eé]e/i,
    sourceWork: 'Wallace & Gromit: The Wrong Trousers (1993), living-room model railway', sourceReference: 'https://en.wikipedia.org/wiki/The_Wrong_Trousers', sourceAccess: 'opened-film-account',
    sourceScene: 'The Wrong Trousers 1993 — train miniature dans le salon de West Wallaby Street', continuity: '1993 short film railway, no museum heist or later film',
    mechanism: 'westwallaby-model-train-oval', color: '#a8b59d', periodSeconds: 44,
    sceneEvidence: 'The account identifies the indoor model railway chase in The Wrong Trousers. An empty small locomotive follows an authored closed oval while its wheels turn; the track layout, scale and loop are adapted. No pursuit, weapon, collision, captured character or automatic track building occurs.'
  }),
  scene({
    id: 'wallace1995-workshop-knitomatic', universes: ['Wallace & Gromit'],
    scenePattern: /(?:close shave|ras[eé].*pr[eè]s|1995).*(?:knit.o.matic|atelier|workshop)|knit.o.matic.*wallace/i,
    excludedScenePattern: /mutton.o.matic|preston.*factory|usine.*preston|wrong trousers|1993|1989|2005|2008|2024|vengeance/i,
    sourceWork: 'Wallace & Gromit: A Close Shave (1995), Wallace’s Knit-O-Matic at 62 West Wallaby Street', sourceReference: 'https://www.wallaceandgromit.com/films/a-close-shave/', sourceAccess: 'opened-official-film-page',
    sourceScene: 'A Close Shave 1995 — atelier de Wallace et Knit-O-Matic à West Wallaby Street', continuity: 'Wallace’s original household invention, not Preston’s destructive factory variant',
    mechanism: 'wallace-knitomatic-yarn-carriage', color: '#a3b5ac', periodSeconds: 35,
    sceneEvidence: 'The official film page identifies Wallace’s Knit-O-Matic at his home. Two yarn bobbins feed a reciprocating empty knitting carriage in this authored mechanical interpretation. No sheep is washed or sheared, and no clothing inventory, occupant or factory mincer is created.'
  }),
  scene({
    id: 'chihiro2001-kamaji-boiler-shutters', universes: ['Voyage de Chihiro'],
    scenePattern: /(?:kamaj[iī]|boiler room|chaufferie).*(?:boiler|furnace|chaudi[eè]re|aburaya|2001)|chaufferie.*kamaj/i,
    excludedScenePattern: /stage play|pi[eè]ce.*th[eé][aâ]tre|2022|2023|destroyed|d[eé]truit|extinguished|[eé]teint/i,
    sourceWork: 'Spirited Away / Sen to Chihiro no Kamikakushi (2001), Kamaji’s boiler room', sourceReference: 'https://en.wikipedia.org/wiki/Spirited_Away', sourceAccess: 'opened-film-account',
    sourceScene: 'Kamaji — chaufferie des chaudières d’Aburaya, Le Voyage de Chihiro 2001', continuity: 'Original 2001 animated film boiler-room setting, no stage-play adaptation',
    mechanism: 'kamaji-boiler-feed-shutters', color: '#b4a281', periodSeconds: 46,
    sceneEvidence: 'The film account places Kamaji in the bathhouse boiler room. A boiler front, feeding shutter and bounded handwheel interpret its working function; geometry and autonomous empty maintenance motion are authored. No soot sprite is substituted by a particle effect, and no heat or coal resource affects play.'
  }),
  scene({
    id: 'chihiro2001-aburaya-lift-counterweight', universes: ['Voyage de Chihiro'],
    scenePattern: /(?:aburaya|bathhouse|bains).*(?:elevator|lift|ascenseur|radish|radis)/i,
    excludedScenePattern: /stage play|pi[eè]ce.*th[eé][aâ]tre|2022|2023|destroyed|d[eé]truit|zeniba.*cottage/i,
    sourceWork: 'Spirited Away (2001), Aburaya interior elevator ascent', sourceReference: 'https://www.nausicaa.net/miyazaki/sen/synopsis/page2.html', sourceAccess: 'indexed-excerpt-only-open-failed',
    sourceScene: 'Aburaya — cage d’ascenseur intérieur vers les étages des bains, film 2001', continuity: 'Original film bathhouse ascent; empty shaft study, no Radish Spirit occupant',
    mechanism: 'aburaya-lift-rope-counterweight', color: '#b5aa8d', periodSeconds: 59,
    sceneEvidence: 'The indexed synopsis explicitly describes the sequence of interior elevators and the Radish Spirit ride; full opening failed. A small empty cage, pulley and opposite counterweight form an authored mechanism with constant rope length. No passengers, accessible floor or character transport is provided.'
  }),
  scene({
    id: 'gremlins1984-dorry-ceiling-fan', universes: ['Gremlins'],
    scenePattern: /dorry.*(?:tavern|taverne|fan|ventilat)/i,
    excludedScenePattern: /gremlins\s*2|1990|new batch|clamp|rough cut|1982.*draft|after.*wreck|apr[eè]s.*destr|destroyed|d[eé]truit/i,
    sourceWork: 'Gremlins (1984), Dorry’s Tavern ceiling fan', sourceReference: 'https://www.imdb.com/title/tt0087363/goofs/', sourceAccess: 'indexed-excerpt-only-open-failed',
    sourceScene: 'Dorry’s Tavern — ventilateur de plafond vide, Gremlins 1984', continuity: 'Released 1984 film tavern scene, not the 1982 draft, rough cut or sequel',
    mechanism: 'dorry-four-blade-ceiling-fan', color: '#b5ab92', periodSeconds: 27,
    sceneEvidence: 'The indexed continuity note describes the turning ceiling fan in Dorry’s Tavern. A fixed downrod supports an empty four-bladed fan here; blade count, speed and projection are authored. No gremlin hangs on it, and no spinning body, throw, collision or environmental damage occurs.'
  }),
  scene({
    id: 'gremlins1984-cinema-film-transport', universes: ['Gremlins'],
    scenePattern: /(?:kingston falls|gremlins).*(?:cinema|cin[eé]ma|movie theater|projection)/i,
    excludedScenePattern: /gremlins\s*2|1990|new batch|clamp|rough cut|1982.*draft|after.*explosion|apr[eè]s.*explosion|destroyed|d[eé]truit/i,
    sourceWork: 'Gremlins (1984), Kingston Falls movie theater during the screening', sourceReference: 'https://www.springfieldspringfield.co.uk/movie_script.php?movie=gremlins', sourceAccess: 'opened-released-film-transcript',
    sourceScene: 'Kingston Falls — cinéma et transport du film en cabine, Gremlins 1984', continuity: 'Released 1984 film, theater intact during screening; Rialto is not asserted as its name',
    mechanism: 'kingston-cinema-two-reel-projector', color: '#acb1b1', periodSeconds: 34,
    sceneEvidence: 'The released-film transcript confirms the cinema screening and its boiler-room location. A two-reel film transport is a functional authored reconstruction of projection, not a verified model of the film prop. No screen image, copied Snow White frame, gas leak, fire or explosion is created.'
  }),
  scene({
    id: 'gears2007-timgad-drawbridge', universes: ['Gears of War'],
    scenePattern: /timgad.*(?:bridge|pont|drawbridge)|(?:impasse|punto muerto).*(?:bridge|pont)/i,
    excludedScenePattern: /xbox\s*360|2006|ultimate edition|2015|gears(?: of war)?\s*(?:[2345]\b|judgment|e.day)|power.*out|courant.*coup[eé]|destroyed|d[eé]truit/i,
    sourceWork: 'Gears of War for Windows (2007), added Act 5 Timgad bridge sequence', sourceReference: 'https://gearsofwar.fandom.com/wiki/Impasse', sourceAccess: 'indexed-excerpt-only',
    sourceScene: 'Timgad — pont-levis après rétablissement électrique, Gears of War Windows 2007', continuity: '2007 Windows added campaign chapters, restored power; not the 2006 Xbox 360 route',
    mechanism: 'timgad-two-leaf-restored-drawbridge', color: '#a9ada3', periodSeconds: 61,
    sceneEvidence: 'The indexed Impasse and mission references identify the raised Timgad drawbridge in the added PC act and the power repair. Two rigid leaves and winch cables interpret the restored empty bridge. Geometry and return cycle are authored; no power puzzle, route, bridge collision or Brumak is added.'
  }),
  scene({
    id: 'gears2006-tyropillar-coupler', universes: ['Gears of War'],
    scenePattern: /tyro.?pillar.*(?:coupl|attelage|third car|troisi[eè]me wagon|train)/i,
    excludedScenePattern: /gears(?: of war)?\s*(?:[2345]\b|judgment|e.day)|wreck|d[eé]rail|after.*crash|apr[eè]s.*accident|destroyed|d[eé]truit/i,
    sourceWork: 'Gears of War (2006), Tyro Pillar third-car coupling', sourceReference: 'https://primagames.com/eguides/gears-war-eguide/campaign-walkthrough/act-5-desperation', sourceAccess: 'opened-walkthrough-text',
    sourceScene: 'Tyro Pillar — attelage mécanique du troisième wagon, Gears of War 2006', continuity: 'Original game working train before derailment; empty coupling study without a combat sequence',
    mechanism: 'tyro-pillar-two-jaw-coupling', color: '#a8b1a9', periodSeconds: 45,
    sceneEvidence: 'The walkthrough identifies the third-car coupler control used to disconnect rear cars. Two empty mechanical jaws open on fixed hinges while the car faces stay aligned. Their safe reset cycle is authored; no car is detached, no passenger falls, and no bomb, enemy or train mission is simulated.'
  })
]);

export const WAVE_6_MODE_REFERENCE_SCENES = Object.freeze({
  'Titanfall 2': { Combat: 'Into the Abyss factory assembly arms', Melee: 'The Beacon substation triple fans', RPG: 'Into the Abyss factory assembly arms', Tactics: 'The Beacon substation triple fans' },
  'Final Fantasy XIII': { Combat: 'Palumpolum Nutriculture Complex mobile paddies', Melee: 'Mahhabara Atomos falCie cutter', RPG: 'Palumpolum Nutriculture Complex mobile paddies', Tactics: 'Mahhabara Atomos falCie cutter' },
  'Final Fantasy XV': { Combat: 'Hammerhead fuel pump station', Melee: 'Lestallum EXINERIS steam valve pipes', RPG: 'Hammerhead fuel pump station', Tactics: 'Lestallum EXINERIS steam valve pipes' },
  'Team Fortress 2': { Combat: 'ctf_turbine rotor room', Melee: 'arena_sawmill paired saw blades', RPG: 'ctf_turbine rotor room', Tactics: 'arena_sawmill paired saw blades' },
  'The Last of Us': { Combat: 'Pittsburgh hotel basement generator 2013', Melee: 'Tommy hydroelectric dam bridge valves 2013', RPG: 'Pittsburgh hotel basement generator 2013', Tactics: 'Tommy hydroelectric dam bridge valves 2013' },
  'Deus Ex': { Combat: 'VersaLife level 2 security ramp 2000', Melee: 'MJ12 Sub Base mini-sub dock 2000', RPG: 'VersaLife level 2 security ramp 2000', Tactics: 'MJ12 Sub Base mini-sub dock 2000' },
  'Pirates of the Caribbean': { Combat: 'Port Royal John Brown smithy wheel 2003', Melee: 'Isla Cruces attached mill wheel 2006', RPG: 'Port Royal John Brown smithy wheel 2003', Tactics: 'Isla Cruces attached mill wheel 2006' },
  'Chicken Run': { Combat: 'Tweedy pie machine barn press 2000', Melee: 'Old Crate aircraft chicken run 2000 pedal', RPG: 'Tweedy pie machine barn press 2000', Tactics: 'Old Crate aircraft chicken run 2000 pedal' },
  'Wallace & Gromit': { Combat: 'Wrong Trousers 1993 living room model train', Melee: 'A Close Shave 1995 Wallace workshop Knit-O-Matic', RPG: 'Wrong Trousers 1993 living room model train', Tactics: 'A Close Shave 1995 Wallace workshop Knit-O-Matic' },
  'Voyage de Chihiro': { Combat: 'Kamaji boiler room furnace 2001', Melee: 'Aburaya bathhouse elevator 2001', RPG: 'Kamaji boiler room furnace 2001', Tactics: 'Aburaya bathhouse elevator 2001' },
  Gremlins: { Combat: 'Dorry Tavern ceiling fan 1984', Melee: 'Kingston Falls movie theater projection 1984', RPG: 'Dorry Tavern ceiling fan 1984', Tactics: 'Kingston Falls movie theater projection 1984' },
  'Gears of War': { Combat: 'Timgad drawbridge restored Windows 2007', Melee: 'Tyro Pillar third car coupling train 2006', RPG: 'Timgad drawbridge restored Windows 2007', Tactics: 'Tyro Pillar third car coupling train 2006' }
});

const tau = Math.PI * 2;
const line = (ctx, points) => { ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); };
const polygon = (ctx, points) => { ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.stroke(); };
const ellipse = (ctx, x, y, rx, ry = rx) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, tau); ctx.stroke(); };
const polar = (origin, length, angle) => [origin[0] + Math.cos(angle) * length, origin[1] + Math.sin(angle) * length];
const wheel = (ctx, x, y, radius, angle, spokes = 6) => {
  ellipse(ctx, x, y, radius);
  for (let spoke = 0; spoke < spokes; spoke++) line(ctx, [[x, y], polar([x, y], radius * 0.86, angle + spoke * tau / spokes)]);
};
const fan = (ctx, x, y, radius, angle, blades = 5, flatten = 1) => {
  ellipse(ctx, x, y, radius * 1.12, radius * 1.12 * flatten);
  for (let blade = 0; blade < blades; blade++) {
    const b = angle + blade * tau / blades;
    polygon(ctx, [[x, y], [x + Math.cos(b) * radius, y + Math.sin(b) * radius * flatten], [x + Math.cos(b + 0.35) * radius * 0.84, y + Math.sin(b + 0.35) * radius * 0.84 * flatten], [x + Math.cos(b + 0.8) * radius * 0.22, y + Math.sin(b + 0.8) * radius * 0.22 * flatten]]);
  }
  ellipse(ctx, x, y, radius * 0.13, radius * 0.13 * flatten);
};
const joint = (ctx, points) => { line(ctx, points); for (const point of points) ellipse(ctx, ...point, 2); };

// The draw paths use these exact points. Exposed for constraint tests rather
// than computing disconnected test-only approximations of mechanical lengths.
export function getStageAnimationWave6Geometry(mechanism, progress, width, height) {
  const p = Number.isFinite(progress) ? ((progress % 1) + 1) % 1 : 0;
  const a = p * tau, travel = (1 - Math.cos(a)) / 2, w = width, h = height;
  switch (mechanism) {
    case 'assembly-house-two-link-arms': return { arms: [-1, 1].map(side => {
      const base = [w * (side < 0 ? 0.68 : 0.9), h * 0.42], lengths = [h * 0.1, h * 0.085];
      const elbow = polar(base, lengths[0], -Math.PI / 2 + side * (0.3 + Math.sin(a) * 0.22));
      return { base, elbow, tip: polar(elbow, lengths[1], -Math.PI / 2 - side * (0.65 + Math.cos(a) * 0.25)), lengths };
    }) };
    case 'hammerhead-pump-meter-and-hose': {
      const root = [w * 0.845, h * 0.275], length = h * 0.155;
      return { root, length, nozzle: polar(root, length, Math.PI / 2 + Math.sin(a) * 0.15) };
    }
    case 'versalife-hinged-security-ramp': {
      const pivot = [w * 0.1, h * 0.43], length = Math.min(w * 0.18, h * 0.22), angle = -travel * 0.55;
      return { pivot, length, angle, end: polar(pivot, length, angle) };
    }
    case 'aburaya-lift-rope-counterweight': return {
      pulley: [w * 0.77, h * 0.14], radius: h * 0.025,
      cage: [w * 0.77 - h * 0.025, h * (0.23 + travel * 0.15)],
      counterweight: [w * 0.77 + h * 0.025, h * (0.4 - travel * 0.15)]
    };
    case 'timgad-two-leaf-restored-drawbridge': return { leaves: [-1, 1].map(side => {
      const length = Math.min(w * 0.1, h * 0.17), pivot = [w * 0.79 + side * length, h * 0.4];
      const angle = side < 0 ? -travel * 0.55 : Math.PI + travel * 0.55;
      return { pivot, length, angle, end: polar(pivot, length, angle) };
    }) };
    default: return null;
  }
}

/** Canvas save/restore and the safe upper-stage clip are owned by the caller. */
export function drawStageAnimationWave6(ctx, animation, frame, width, height) {
  if (animation.animationWave !== 6) return false;
  const w = width, h = height, a = frame.phase, travel = (1 - Math.cos(a)) / 2;
  const mechanics = getStageAnimationWave6Geometry(animation.mechanism, frame.progress, w, h);
  ctx.globalAlpha = 0.14;
  switch (animation.mechanism) {
    case 'assembly-house-two-link-arms': {
      line(ctx, [[w * 0.65, h * 0.46], [w * 0.93, h * 0.46]]);
      for (const arm of mechanics.arms) { ctx.strokeRect(arm.base[0] - w * 0.012, arm.base[1], w * 0.024, h * 0.04); joint(ctx, [arm.base, arm.elbow, arm.tip]); line(ctx, [[arm.tip[0] - h * 0.012, arm.tip[1]], [arm.tip[0] + h * 0.012, arm.tip[1]]]); }
      ctx.strokeRect(w * (0.75 + Math.sin(a) * 0.015), h * 0.29, w * 0.075, h * 0.15);
      ctx.strokeRect(w * (0.76 + Math.sin(a) * 0.015), h * 0.32, w * 0.025, h * 0.04);
      for (let roller = 0; roller < 8; roller++) wheel(ctx, w * (0.67 + roller * 0.035), h * 0.455, h * 0.008, a * 2, 3);
      break;
    }
    case 'beacon-substation-three-axial-fans': {
      for (let i = 0; i < 3; i++) {
        const x = w * (0.12 + i * 0.074), y = h * (0.24 + i * 0.055), radius = Math.min(w * 0.032, h * 0.055);
        ctx.strokeRect(x - radius * 1.3, y - radius * 1.3, radius * 2.6, radius * 2.6);
        fan(ctx, x, y, radius, a * (i + 2) * (i === 1 ? -1 : 1), 5);
        line(ctx, [[x - radius * 1.2, y], [x + radius * 1.2, y]]);
      }
      line(ctx, [[w * 0.07, h * 0.44], [w * 0.32, h * 0.44]]);
      break;
    }
    case 'palumpolum-oval-mobile-paddies': {
      const cx = w * 0.79, cy = h * 0.33, rx = w * 0.105, ry = h * 0.058;
      ellipse(ctx, cx, cy, rx, ry); ellipse(ctx, cx, cy + h * 0.016, rx, ry);
      for (let tray = 0; tray < 5; tray++) {
        const t = a + tray * tau / 5, x = cx + Math.cos(t) * rx, y = cy + Math.sin(t) * ry;
        polygon(ctx, [[x - w * 0.02, y], [x, y - h * 0.012], [x + w * 0.02, y], [x, y + h * 0.013]]);
        for (let seedling = 0; seedling < 3; seedling++) { const tx = x + w * (seedling - 1) * 0.009; line(ctx, [[tx, y], [tx, y - h * 0.015], [tx + w * 0.003, y - h * 0.02]]); }
      }
      for (const dx of [-0.07, 0.07]) line(ctx, [[cx + w * dx, cy + h * 0.045], [cx + w * dx, h * 0.46]]);
      break;
    }
    case 'mahhabara-atomos-segmented-excavator': {
      const cx = w * 0.2, cy = h * 0.31, r = h * 0.093;
      ellipse(ctx, cx, cy, r, r); ellipse(ctx, cx, cy, r * 0.4, r);
      for (let segment = 0; segment < 12; segment++) {
        const angle = a + segment * tau / 12, root = polar([cx, cy], r * 0.78, angle), tip = polar([cx, cy], r * 1.08, angle + 0.1);
        polygon(ctx, [root, tip, polar([cx, cy], r * 0.91, angle + 0.28)]);
      }
      ellipse(ctx, cx, cy, r * 0.24); line(ctx, [[cx - w * 0.075, h * 0.43], [cx + w * 0.08, h * 0.43]]);
      for (let brace = 0; brace < 4; brace++) line(ctx, [[cx + w * 0.075, h * (0.18 + brace * 0.07)], [cx + w * 0.1, h * (0.2 + brace * 0.07)]]);
      break;
    }
    case 'hammerhead-pump-meter-and-hose': {
      const x = w * 0.75;
      ctx.strokeRect(x, h * 0.2, w * 0.064, h * 0.24); ctx.strokeRect(x - w * 0.006, h * 0.18, w * 0.076, h * 0.025);
      for (let drum = 0; drum < 3; drum++) {
        const cx = x + w * (0.014 + drum * 0.018); ctx.strokeRect(cx - w * 0.006, h * 0.245, w * 0.012, h * 0.05);
        for (let tick = 0; tick < 4; tick++) { const angle = a * (3 - drum) + tick * tau / 4; line(ctx, [[cx - w * 0.004, h * 0.27 + Math.sin(angle) * h * 0.021], [cx + w * 0.004, h * 0.27 + Math.sin(angle) * h * 0.021]]); }
      }
      line(ctx, [[x + w * 0.064, h * 0.31], mechanics.root, mechanics.nozzle]);
      ctx.strokeRect(mechanics.nozzle[0] - w * 0.004, mechanics.nozzle[1] - h * 0.015, w * 0.008, h * 0.03);
      line(ctx, [[x - w * 0.015, h * 0.45], [x + w * 0.09, h * 0.45]]);
      break;
    }
    case 'lestallum-blue-pipe-valve-array': {
      for (let pipe = 0; pipe < 3; pipe++) {
        const x = w * (0.13 + pipe * 0.043), y = h * (0.27 + pipe * 0.027);
        line(ctx, [[x - w * 0.008, h * 0.14], [x - w * 0.008, h * 0.44], [x + w * 0.008, h * 0.44], [x + w * 0.008, h * 0.14]]);
        for (const collar of [0.2, 0.4]) ctx.strokeRect(x - w * 0.013, h * collar, w * 0.026, h * 0.012);
        const stem = x + w * (0.017 + travel * 0.005);
        line(ctx, [[x, y], [stem, y]]); wheel(ctx, stem, y, h * 0.017, a * (pipe + 1), 5);
      }
      break;
    }
    case 'turbine-central-three-horizontal-rotors': {
      for (let turbine = 0; turbine < 3; turbine++) {
        const x = w * (0.69 + turbine * 0.077), y = h * 0.31, r = Math.min(w * 0.032, h * 0.07);
        ctx.strokeRect(x - r, y - r * 1.25, r * 2, r * 2.5);
        fan(ctx, x, y, r * 0.8, a * (turbine + 3), 7, 0.7);
        line(ctx, [[x, y + r * 1.25], [x, h * 0.45]]);
        ctx.strokeRect(x - r * 0.6, h * 0.435, r * 1.2, h * 0.016);
      }
      break;
    }
    case 'sawmill-two-enclosed-saw-wheels': {
      ctx.strokeRect(w * 0.095, h * 0.19, w * 0.215, h * 0.23);
      for (const [index, x] of [w * 0.155, w * 0.25].entries()) {
        const y = h * 0.32, r = h * 0.061, points = Array.from({ length: 48 }, (_, tooth) => polar([x, y], r * (tooth % 2 ? 1 : 0.82), a * (index ? -2 : 2) + tooth * tau / 48));
        polygon(ctx, points); wheel(ctx, x, y, r * 0.35, a * (index ? -2 : 2), 5);
      }
      for (let grille = 0; grille < 6; grille++) line(ctx, [[w * (0.105 + grille * 0.038), h * 0.2], [w * (0.105 + grille * 0.038), h * 0.415]]);
      line(ctx, [[w * 0.08, h * 0.45], [w * 0.33, h * 0.45]]);
      break;
    }
    case 'hotel-generator-pullcord-flywheel': {
      const x = w * 0.72, y = h * 0.3, handleX = x - w * (0.015 + travel * 0.045);
      ctx.strokeRect(x, y - h * 0.025, w * 0.12, h * 0.11); ctx.strokeRect(x + w * 0.025, y - h * 0.055, w * 0.06, h * 0.03);
      wheel(ctx, x + w * 0.03, y + h * 0.035, h * 0.032, a * 5, 8);
      line(ctx, [[x, y + h * 0.01], [handleX, y - h * 0.015]]);
      line(ctx, [[handleX, y - h * 0.033], [handleX, y + h * 0.003]]);
      for (const dx of [0.005, 0.105]) { line(ctx, [[x + w * dx, y + h * 0.085], [x + w * dx, h * 0.43]]); ellipse(ctx, x + w * dx, h * 0.43, h * 0.01); }
      for (let fin = 0; fin < 4; fin++) line(ctx, [[x + w * 0.07, y + h * fin * 0.013], [x + w * 0.11, y + h * fin * 0.013]]);
      break;
    }
    case 'tommys-dam-paired-lift-bridges': {
      for (const [index, cx] of [w * 0.145, w * 0.26].entries()) {
        const lift = (1 - Math.cos(a + index * Math.PI)) / 2, y = h * (0.43 - lift * 0.11);
        for (const dx of [-0.04, 0.04]) line(ctx, [[cx + w * dx, h * 0.23], [cx + w * dx, h * 0.46]]);
        ctx.strokeRect(cx - w * 0.04, y, w * 0.08, h * 0.018);
        for (let rail = 0; rail < 5; rail++) line(ctx, [[cx + w * (-0.036 + rail * 0.018), y], [cx + w * (-0.036 + rail * 0.018), y - h * 0.035]]);
        line(ctx, [[cx - w * 0.036, y - h * 0.035], [cx + w * 0.036, y - h * 0.035]]);
        wheel(ctx, cx - w * 0.053, h * 0.31, h * 0.018, a * (index ? -1 : 1), 6);
        line(ctx, [[cx - w * 0.053, h * 0.31], [cx - w * 0.04, y]]);
      }
      break;
    }
    case 'versalife-hinged-security-ramp': {
      const { pivot, end, length, angle } = mechanics, offset = [-Math.sin(angle) * h * 0.012, Math.cos(angle) * h * 0.012];
      polygon(ctx, [pivot, end, [end[0] + offset[0], end[1] + offset[1]], [pivot[0] + offset[0], pivot[1] + offset[1]]]);
      ellipse(ctx, ...pivot, h * 0.01); line(ctx, [[pivot[0], h * 0.18], end]);
      for (let strut = 0; strut < 6; strut++) { const point = polar(pivot, length * strut / 6, angle); line(ctx, [point, [point[0] + offset[0], point[1] + offset[1]]]); }
      ctx.strokeRect(w * 0.075, h * 0.18, w * 0.025, h * 0.27); ctx.strokeRect(pivot[0] + length, h * 0.43, w * 0.02, h * 0.03);
      break;
    }
    case 'mj12-mini-sub-docking-screw': {
      const x = w * 0.77, y = h * 0.32;
      ellipse(ctx, x, y, w * 0.08, h * 0.058); ellipse(ctx, x - w * 0.045, y, h * 0.022, h * 0.032);
      ctx.strokeRect(x - w * 0.018, y - h * 0.087, w * 0.034, h * 0.032);
      line(ctx, [[x + w * 0.075, y], [x + w * 0.103, y]]); fan(ctx, x + w * 0.103, y, h * 0.024, a * 3, 3, 0.85);
      const rudder = polar([x + w * 0.067, y + h * 0.02], h * 0.04, Math.PI / 2 + Math.sin(a) * 0.17); joint(ctx, [[x + w * 0.067, y + h * 0.02], rudder]);
      for (const dx of [-0.04, 0.04]) line(ctx, [[x + w * dx, y + h * 0.055], [x + w * dx, h * 0.44]]);
      line(ctx, [[w * 0.65, h * 0.44], [w * 0.92, h * 0.44]]);
      break;
    }
    case 'portroyal-smithy-sweep-wheel': {
      const x = w * 0.2, y = h * 0.29, r = h * 0.065, sweep = polar([x, y], w * 0.075, a);
      wheel(ctx, x, y, r, a, 10); wheel(ctx, x + w * 0.085, y - h * 0.075, r * 0.45, -a * 2, 5);
      joint(ctx, [[x, y], sweep]); line(ctx, [[sweep[0], sweep[1]], [sweep[0], sweep[1] + h * 0.025]]);
      line(ctx, [[x, h * 0.13], [x, h * 0.44]]); line(ctx, [[x - w * 0.08, h * 0.44], [x + w * 0.12, h * 0.44]]);
      for (const side of [-1, 1]) line(ctx, [[x + side * w * 0.07, h * 0.16], [x + side * w * 0.07, h * 0.44]]);
      break;
    }
    case 'isla-cruces-attached-mill-wheel': {
      const x = w * 0.79, y = h * 0.31, r = h * 0.1;
      ctx.strokeRect(w * 0.68, h * 0.18, w * 0.06, h * 0.27); ctx.strokeRect(w * 0.86, h * 0.25, w * 0.045, h * 0.2);
      wheel(ctx, x, y, r, a, 12); ellipse(ctx, x, y, r * 0.84);
      for (let paddle = 0; paddle < 12; paddle++) { const angle = a + paddle * tau / 12, center = polar([x, y], r * 0.96, angle), tangent = [-Math.sin(angle) * h * 0.012, Math.cos(angle) * h * 0.012]; line(ctx, [[center[0] - tangent[0], center[1] - tangent[1]], [center[0] + tangent[0], center[1] + tangent[1]]]); }
      line(ctx, [[w * 0.7, y], [w * 0.89, y]]);
      break;
    }
    case 'tweedy-empty-pie-press-conveyor': {
      const x = w * 0.12, y = h * 0.36, pressY = h * (0.22 + travel * 0.08);
      for (const dx of [0, 0.17]) wheel(ctx, x + w * dx, y + h * 0.035, h * 0.025, a * 2, 7);
      line(ctx, [[x, y + h * 0.01], [x + w * 0.17, y + h * 0.01]]); line(ctx, [[x, y + h * 0.06], [x + w * 0.17, y + h * 0.06]]);
      for (let tin = 0; tin < 4; tin++) { const offset = ((frame.progress + tin / 4) % 1) * w * 0.17; ellipse(ctx, x + offset, y, w * 0.013, h * 0.01); }
      ctx.strokeRect(x + w * 0.055, pressY, w * 0.06, h * 0.016);
      for (const dx of [0.06, 0.11]) line(ctx, [[x + w * dx, h * 0.16], [x + w * dx, pressY]]);
      line(ctx, [[x + w * 0.045, h * 0.16], [x + w * 0.125, h * 0.16]]);
      break;
    }
    case 'old-crate-pedal-chain-propeller': {
      const x = w * 0.73, y = h * 0.34, r = h * 0.022;
      polygon(ctx, [[x - w * 0.045, y - h * 0.035], [x + w * 0.12, y - h * 0.035], [x + w * 0.095, y + h * 0.04], [x - w * 0.025, y + h * 0.04]]);
      wheel(ctx, x, y, r, a, 6); wheel(ctx, x + w * 0.065, y, r * 0.5, a * 2, 4);
      for (const sign of [-1, 1]) line(ctx, [[x, y + sign * r], [x + w * 0.065, y + sign * r * 0.5]]);
      const pedal = polar([x, y], r * 0.85, a); joint(ctx, [[x, y], pedal]); line(ctx, [[pedal[0] - w * 0.008, pedal[1]], [pedal[0] + w * 0.008, pedal[1]]]);
      const propX = x + w * 0.125; line(ctx, [[x + w * 0.065, y], [propX, y]]); fan(ctx, propX, y, h * 0.065, a * 6, 2, 1);
      line(ctx, [[x - w * 0.065, h * 0.44], [x + w * 0.155, h * 0.44]]);
      break;
    }
    case 'westwallaby-model-train-oval': {
      const cx = w * 0.2, cy = h * 0.35, rx = w * 0.105, ry = h * 0.065;
      ellipse(ctx, cx, cy, rx, ry); ellipse(ctx, cx, cy, rx + h * 0.008, ry + h * 0.008);
      for (let tie = 0; tie < 20; tie++) { const angle = tie * tau / 20; line(ctx, [[cx + Math.cos(angle) * (rx - h * 0.004), cy + Math.sin(angle) * (ry - h * 0.004)], [cx + Math.cos(angle) * (rx + h * 0.012), cy + Math.sin(angle) * (ry + h * 0.012)]]); }
      const x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry, heading = Math.atan2(ry * Math.cos(a), -rx * Math.sin(a));
      ctx.save(); ctx.translate(x, y); ctx.rotate(heading);
      ctx.strokeRect(-w * 0.019, -h * 0.013, w * 0.038, h * 0.026); ctx.strokeRect(w * 0.005, -h * 0.02, w * 0.012, h * 0.007);
      for (const dx of [-0.011, 0.011]) wheel(ctx, w * dx, h * 0.012, h * 0.007, a * 8, 4);
      ctx.restore();
      break;
    }
    case 'wallace-knitomatic-yarn-carriage': {
      const x = w * 0.72, y = h * 0.23, carriageX = x + w * (0.018 + travel * 0.105);
      ctx.strokeRect(x, y, w * 0.15, h * 0.19);
      for (const [index, dx] of [0.035, 0.112].entries()) {
        wheel(ctx, x + w * dx, y + h * 0.035, h * 0.026, a * (index ? -2 : 2), 5);
        line(ctx, [[x + w * dx, y + h * 0.06], [carriageX + w * 0.009, y + h * 0.115]]);
      }
      line(ctx, [[x + w * 0.01, y + h * 0.125], [x + w * 0.14, y + h * 0.125]]);
      ctx.strokeRect(carriageX, y + h * 0.105, w * 0.018, h * 0.04);
      for (let needle = 0; needle < 9; needle++) line(ctx, [[x + w * (0.015 + needle * 0.014), y + h * 0.135], [x + w * (0.015 + needle * 0.014), y + h * (0.16 + Math.sin(a + needle * 0.2) * 0.007)]]);
      break;
    }
    case 'kamaji-boiler-feed-shutters': {
      const x = w * 0.12, y = h * 0.2;
      ctx.strokeRect(x, y, w * 0.15, h * 0.23);
      for (let boiler = 0; boiler < 2; boiler++) {
        const cx = x + w * (0.04 + boiler * 0.07), shutter = h * (0.018 + travel * 0.025);
        ellipse(ctx, cx, h * 0.31, w * 0.025, h * 0.065);
        ctx.strokeRect(cx - w * 0.022, h * 0.335 - shutter, w * 0.044, shutter);
        line(ctx, [[cx, h * 0.19], [cx, h * 0.335 - shutter]]); wheel(ctx, cx, h * 0.19, h * 0.014, a * (boiler ? -1 : 1), 5);
        for (let rivet = 0; rivet < 4; rivet++) ellipse(ctx, cx - w * 0.029, h * (0.235 + rivet * 0.05), 1.4);
      }
      line(ctx, [[x - w * 0.015, h * 0.45], [x + w * 0.17, h * 0.45]]);
      break;
    }
    case 'aburaya-lift-rope-counterweight': {
      const { pulley, radius, cage, counterweight } = mechanics;
      wheel(ctx, ...pulley, radius, a, 7);
      line(ctx, [[cage[0], pulley[1]], cage]); line(ctx, [[counterweight[0], pulley[1]], counterweight]);
      ctx.strokeRect(cage[0] - w * 0.035, cage[1], w * 0.07, h * 0.09);
      for (let bar = 0; bar < 5; bar++) line(ctx, [[cage[0] + w * (-0.03 + bar * 0.015), cage[1]], [cage[0] + w * (-0.03 + bar * 0.015), cage[1] + h * 0.09]]);
      ctx.strokeRect(counterweight[0] - w * 0.008, counterweight[1], w * 0.016, h * 0.06);
      for (const dx of [-0.055, 0.055]) line(ctx, [[pulley[0] + w * dx, h * 0.12], [pulley[0] + w * dx, h * 0.49]]);
      break;
    }
    case 'dorry-four-blade-ceiling-fan': {
      const x = w * 0.2, y = h * 0.27;
      line(ctx, [[x, h * 0.12], [x, y]]); ellipse(ctx, x, h * 0.12, h * 0.012, h * 0.004);
      fan(ctx, x, y, h * 0.115, a * 2, 4, 0.36);
      ellipse(ctx, x, y + h * 0.025, h * 0.014, h * 0.012);
      line(ctx, [[x + h * 0.014, y], [x + h * 0.014, y + h * 0.07]]); ellipse(ctx, x + h * 0.014, y + h * 0.074, h * 0.004);
      break;
    }
    case 'kingston-cinema-two-reel-projector': {
      const x = w * 0.78, y = h * 0.29, r = h * 0.04;
      ctx.strokeRect(x - w * 0.025, y, w * 0.07, h * 0.07);
      wheel(ctx, x - w * 0.018, y - h * 0.055, r, a * 3, 5); wheel(ctx, x + w * 0.058, y - h * 0.055, r, a * 3, 5);
      line(ctx, [[x - w * 0.018, y - h * 0.015], [x - w * 0.005, y + h * 0.03], [x + w * 0.03, y + h * 0.03], [x + w * 0.058, y - h * 0.015]]);
      wheel(ctx, x + w * 0.03, y + h * 0.03, h * 0.008, a * 15, 4);
      ctx.strokeRect(x + w * 0.045, y + h * 0.015, w * 0.025, h * 0.025);
      line(ctx, [[x + w * 0.01, y + h * 0.07], [x + w * 0.01, h * 0.44], [x - w * 0.03, h * 0.44], [x + w * 0.05, h * 0.44]]);
      break;
    }
    case 'timgad-two-leaf-restored-drawbridge': {
      for (const leaf of mechanics.leaves) {
        const offset = [-Math.sin(leaf.angle) * h * 0.014, Math.cos(leaf.angle) * h * 0.014];
        polygon(ctx, [leaf.pivot, leaf.end, [leaf.end[0] + offset[0], leaf.end[1] + offset[1]], [leaf.pivot[0] + offset[0], leaf.pivot[1] + offset[1]]]);
        const top = [leaf.pivot[0], h * 0.17]; line(ctx, [top, leaf.end]); line(ctx, [top, leaf.pivot]); ellipse(ctx, ...leaf.pivot, h * 0.012);
        for (let beam = 0; beam < 5; beam++) { const point = polar(leaf.pivot, leaf.length * beam / 5, leaf.angle); line(ctx, [point, [point[0] + offset[0], point[1] + offset[1]]]); }
      }
      break;
    }
    case 'tyro-pillar-two-jaw-coupling': {
      const cy = h * 0.31;
      for (const side of [-1, 1]) {
        const cx = w * (side < 0 ? 0.14 : 0.27), pivot = [cx, cy], angle = side < 0 ? -travel * 0.45 : Math.PI + travel * 0.45;
        ctx.strokeRect(cx + (side < 0 ? -w * 0.045 : 0), h * 0.23, w * 0.045, h * 0.17);
        const root = polar(pivot, w * 0.028, angle), tip = polar(root, h * 0.025, angle + Math.PI / 2);
        joint(ctx, [pivot, root, tip]);
        line(ctx, [[cx, cy + h * 0.06], [cx - side * w * 0.025, cy + h * 0.06]]);
        for (let spring = 0; spring < 6; spring++) line(ctx, [[cx - side * w * (0.008 + spring * 0.004), cy + h * 0.05], [cx - side * w * (0.01 + spring * 0.004), cy + h * 0.07]]);
      }
      line(ctx, [[w * 0.09, h * 0.44], [w * 0.32, h * 0.44]]);
      break;
    }
    default: return false;
  }
  return true;
}
