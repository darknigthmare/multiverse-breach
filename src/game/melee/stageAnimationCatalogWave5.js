// Original scene mechanisms: references establish places and functions. These
// drawings, dimensions and repeated timings are adaptations, never source frames.
const scene = definition => Object.freeze({
  ...definition,
  animationWave: 5,
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

export const STAGE_ANIMATION_WAVE_5 = Object.freeze([
  scene({
    id: 'lotr2002-isengard-forge-wheel', universes: ['The Lord of the Rings'], scenePattern: /isengard.*(?:forge|wheel|roue|machin)/i,
    excludedScenePattern: /flooded|inond[eé]|apr[eè]s.*(?:crue|ent)|after.*ent|return of the king|retour du roi|rings of power|anneaux de pouvoir|bakshi|1978|rankin|book|roman/i,
    sourceWork: 'The Lord of the Rings: The Two Towers (2002), Isengard industry', sourceReference: 'https://en.wikipedia.org/wiki/Isengard',
    sourceScene: 'Isengard — roue et transmission des forges du film Les Deux Tours 2002, avant la crue', continuity: 'Jackson film The Two Towers (2002), working Isengard before flooding',
    mechanism: 'isengard-forge-wheel-transmission', color: '#b5a181', periodSeconds: 33,
    sceneEvidence: 'Isengard is converted into an industrial complex with underground machinery before the Ents flood it. The linked wheel, crank and empty forge bellows interpret that function; their exact mechanism and cycle are authored, not a verified film prop loop.'
  }),
  scene({
    id: 'lotr2002-morannon-chain-lever', universes: ['The Lord of the Rings'], scenePattern: /morannon|black gate|porte noire/i,
    excludedScenePattern: /destroyed|d[eé]truit|collapse|effondr|after.*ring.*destr|apr[eè]s.*anneau|rings of power|anneaux de pouvoir|bakshi|1978|rankin|book|roman/i,
    sourceWork: 'The Lord of the Rings: The Two Towers (2002), Black Gate', sourceReference: 'https://lotr.fandom.com/wiki/Black_Gate',
    sourceScene: 'Morannon — Porte Noire du film Les Deux Tours 2002, chaînes et leviers sans occupants', continuity: 'Jackson trilogy, intact Morannon; referenced opening in The Two Towers (2002)',
    mechanism: 'morannon-chain-operated-leaves', color: '#b0ada0', periodSeconds: 46,
    sceneEvidence: 'The film-specific Black Gate reference describes chains and a gate lever operated by trolls. Empty chain-and-lever assemblies move the two distant leaves here; no troll, army, passage or source animation is instantiated.'
  }),
  scene({
    id: 'potter2004-clock-tower-pendulum', universes: ['Harry Potter'], scenePattern: /clock tower|tour.*horloge/i,
    excludedScenePattern: /hogwarts legacy|1890|fantastic beasts|animaux fantastiques|battle of hogwarts|bataille.*poudlard|destroyed|d[eé]truite|book|roman|1999/i,
    sourceWork: 'Harry Potter and the Prisoner of Azkaban (2004 film), Hogwarts Clock Tower', sourceReference: 'https://www.wbstudiotour.co.uk/the-experience/explore-the-tour/sets/the-hogwarts-bridge/',
    sourceScene: 'Poudlard — Clock Tower du film Prisonnier d’Azkaban 2004, pendule derrière le cadran', continuity: '2004 film architecture, intact Clock Tower; not Hogwarts Legacy or the novel',
    mechanism: 'hogwarts-clock-tower-pendulum', color: '#b8aa89', periodSeconds: 20,
    sceneEvidence: 'The official Studio Tour locates the Clock Tower and its bridge in the film architecture introduced with Prisoner of Azkaban. A bounded pendulum, escapement and hands interpret its clockwork; the page does not certify their exact dimensions or repeated timing.'
  }),
  scene({
    id: 'potter-burrow-nine-hand-clock', universes: ['Harry Potter'], scenePattern: /(?:burrow|terrier|weasley).*(?:clock|horloge)|family location clock/i,
    excludedScenePattern: /film|2002|2005|1995|1996|1997|1998|mortal peril|danger.*mort|voldemort.*retour|return.*voldemort|burnt|br[uû]l[eé]/i,
    sourceWork: 'Harry Potter and the Goblet of Fire (2000 novel), Burrow in summer 1994', sourceReference: 'https://www.harrypotter.com/features/4-reasons-we-always-wanted-to-run-away-to-the-burrow',
    sourceScene: 'Le Terrier — horloge familiale à neuf aiguilles, roman Coupe de feu, été 1994', continuity: 'Novel interpretation, summer 1994 before Voldemort’s return; no film clock substitution',
    mechanism: 'burrow-nine-location-hands', color: '#bda77f', periodSeconds: 54,
    sceneEvidence: 'The official editorial describes the Burrow’s enchanted nine-hand location clock. Nine visible hands make small independent movements on an authored dial; they report no actual character location or danger and do not claim an official clock animation.'
  }),
  scene({
    id: 'fallout4-vault111-round-lift', universes: ['Fallout'], scenePattern: /vault\s*111|abri\s*111/i,
    excludedScenePattern: /fallout\s*(?:[12376]\b|76)|new vegas|vault\s*(?:13|76|101|33)\b|abri\s*(?:13|76|101|33)\b|tv series|s[eé]rie.*tv|destroyed|d[eé]truit/i,
    sourceWork: 'Fallout 4 (2015), Vault 111 entrance elevator', sourceReference: 'https://www.gamepressure.com/fallout4/prologue/z67ee5',
    sourceScene: 'Fallout 4 — Vault 111, plateforme circulaire de l’ascenseur dans son puits', continuity: 'Fallout 4 Vault 111, functional entrance lift; no nuclear blast reenactment',
    mechanism: 'vault111-round-platform-shaft', color: '#b7b49a', periodSeconds: 39,
    sceneEvidence: 'The Fallout 4 prologue guide explicitly describes the round platform descending into Vault 111. An empty circular lift travels on fixed shaft guides; the repeating return trip is authored and cannot transport actors or change the stage floor.'
  }),
  scene({
    id: 'fallout4-prydwen-propeller-outriggers', universes: ['Fallout'], scenePattern: /prydwen.*(?:airport|a[eé]roport|propell|h[eé]lice|boston)|boston airport.*prydwen/i,
    excludedScenePattern: /fallout\s*(?:[12376]\b|76)|new vegas|tv series|s[eé]rie.*tv|before.*reunions|avant.*reunions|destroyed|d[eé]truit|burning|incendi[eé]|rocket.s red glare|airship down/i,
    sourceWork: 'Fallout 4 (2015), Prydwen over Boston Airport', sourceReference: 'https://primagames.com/eguides/fallout-4-eguide/map/zone-4-coastal-commonwealth/primary-locations/428-prydwen',
    sourceScene: 'Fallout 4 — Prydwen intact à Boston Airport, hélices sur les bras latéraux', continuity: 'Fallout 4 after Reunions arrival and before a destruction ending',
    mechanism: 'prydwen-four-propeller-outriggers', color: '#b1b49f', periodSeconds: 32,
    sceneEvidence: 'The Prima guide places the Prydwen mooring at Boston Airport; indexed game context dates its arrival after Reunions. The hull remains moored while four projected propellers rotate on fixed outriggers; their arrangement, speed and distant silhouette are authored approximations, not imported game frames.'
  }),
  scene({
    id: 'ghostbusters1984-firehouse-loading-grid', universes: ['Ghostbusters'], scenePattern: /(?:firehouse|caserne).*(?:containment|confinement|grid|stockage)|containment unit.*1984/i,
    excludedScenePattern: /1989|2016|afterlife|frozen empire|2024|2021|peck.*(?:shutdown|arr[eê]t)|after.*shutdown|apr[eè]s.*arr[eê]t|destroyed|d[eé]truit/i,
    sourceWork: 'Ghostbusters (1984), firehouse basement containment-unit loading', sourceReference: 'https://www.gbfans.com/wiki/equipment/ghost-trap',
    sourceScene: 'Caserne de Ghostbusters 1984 — trappe de chargement de l’unité de confinement', continuity: '1984 film loading demonstration, before the shutdown',
    mechanism: 'firehouse-empty-trap-loading-slide', color: '#b6b7a3', periodSeconds: 37,
    sceneEvidence: 'The 1984 section describes opening the containment unit, docking a trap and setting the entry grid. A small empty cartridge and loading hatch interpret those actions; no ghost is captured or released, and no switch changes gameplay.'
  }),
  scene({
    id: 'ghostbusters1984-sedgewick-trap-hinges', universes: ['Ghostbusters'], scenePattern: /sedgewick.*(?:ballroom|salle|trap|pi[eè]ge)|(?:trap|pi[eè]ge).*sedgewick/i,
    excludedScenePattern: /1989|2016|afterlife|frozen empire|2024|2021|video game|jeu vid[eé]o/i,
    sourceWork: 'Ghostbusters (1984), Sedgewick Hotel ballroom trap', sourceReference: 'https://www.gbfans.com/wiki/equipment/ghost-trap',
    sourceScene: 'Sedgewick Hotel — salle de bal du film 1984, volets et pédale du piège vide', continuity: 'Ghostbusters (1984), mechanical trap prop; no entity or capture beam',
    mechanism: 'sedgewick-pedal-and-trap-hinges', color: '#baa779', periodSeconds: 28,
    sceneEvidence: 'The reference identifies the first trap use in the Sedgewick ballroom and its foot pedal. Hinged striped doors and a linked pedal articulate on an empty prop; shape and repeated test cycle are authored, with no vortex, flash, sound or combat effect.'
  }),
  scene({
    id: 'tomb-raider1996-lost-valley-sluice', universes: ['Tomb Raider'], scenePattern: /lost valley|vall[eé]e perdue/i,
    excludedScenePattern: /anniversary|2007|2013|rise|shadow|legend|underworld|tomb raider\s*(?:ii|iii|[23456789])\b|missing cogs|rouages manquants|not repaired|non r[eé]par[eé]/i,
    sourceWork: 'Tomb Raider (1996), Lost Valley repaired three-cog machine', sourceReference: 'https://www.tombraiders.net/stella/walks/TR1-classic/03lostvalley.html',
    sourceScene: 'Lost Valley — trois rouages remontés et vanne du torrent de Tomb Raider 1996', continuity: 'Tomb Raider 1996, repaired machine; not Anniversary',
    mechanism: 'lost-valley-three-cog-sluice', color: '#b2aa8e', periodSeconds: 34,
    sceneEvidence: 'The classic walkthrough describes replacing three cogs, starting the machine and diverting the stream with its gate. Three linked gears drive a bounded decorative sluice; this authored repeated cycle does not repair a puzzle, stop a waterfall or open a playable path.'
  }),
  scene({
    id: 'tomb-raider1996-thor-room-hammer', universes: ['Tomb Raider'], scenePattern: /(?:st.?\s*francis|folly).*(?:thor|hammer|marteau)|thor room.*1996/i,
    excludedScenePattern: /anniversary|2007|2013|rise|shadow|legend|underworld|hephaestus|h[eé]pha[iï]stos|tomb raider\s*(?:ii|iii|[23456789])\b/i,
    sourceWork: 'Tomb Raider (1996), St. Francis’ Folly Thor room', sourceReference: 'https://www.tombraiderchronicles.com/tr1/walkthrough/level05.html',
    sourceScene: 'St Francis Folly — salle de Thor, marteau mécanique de Tomb Raider 1996', continuity: 'Tomb Raider 1996 Thor room; not Anniversary’s Hephaestus room',
    mechanism: 'thor-room-empty-hammer-rig', color: '#b4ae9a', periodSeconds: 43,
    sceneEvidence: 'The 1996 walkthrough identifies the Thor room’s giant falling hammer. A small empty rig shows a pivot and lifting cable in the backdrop; its safe return cycle is an authored mechanical study, without lightning, trigger tiles, impact damage or falling gameplay blocks.'
  }),
  scene({
    id: 'oddworld1997-rupturefarms-barrel-stamp', universes: ['Oddworld'], scenePattern: /rupture.?farms.*(?:barrel|f[uû]t|stamp|emballage|conditionnement)/i,
    excludedScenePattern: /new.?n.?tasty|2014|exoddus|1998|soulstorm|2021|closed|ferm[eé]|halted|arr[eê]t[eé]|out of service|hors.service/i,
    sourceWork: 'Oddworld: Abe’s Oddysee (1997), RuptureFarms introduction', sourceReference: 'https://gamefaqs.gamespot.com/pc/36010-oddworld-abes-oddysee/faqs/61136',
    sourceScene: 'RuptureFarms — conditionnement des fûts, introduction d’Abe’s Oddysee 1997', continuity: 'Abe’s Oddysee 1997 before factory shutdown; not New ’n’ Tasty',
    mechanism: 'rupturefarms-sealed-barrel-stamper', color: '#a8b18d', periodSeconds: 25,
    sceneEvidence: 'The introduction transcript describes conveyor processing and stamped barrels. Sealed unlabeled barrels move beneath a press in this adaptation; no contents, workers, creatures or copied logo are depicted, and the belt has no collision or production state.'
  }),
  scene({
    id: 'oddworld1998-feeco-train-points', universes: ['Oddworld'], scenePattern: /feeco.*(?:depot|gare|train)|gare.*feeco/i,
    excludedScenePattern: /oddysee|1997|new.?n.?tasty|2014|soulstorm|2021|comet depot|destroyed|d[eé]truit|out of service|hors.service/i,
    sourceWork: 'Oddworld: Abe’s Exoddus (1998), FeeCo Depot train junction', sourceReference: 'https://oddworld.fandom.com/wiki/FeeCo_Depot_(Abe%27s_Exoddus)',
    sourceScene: 'FeeCo Depot — aiguillage et rame d’Abe’s Exoddus 1998', continuity: 'Abe’s Exoddus (1998), FeeCo; not the Soulstorm version',
    mechanism: 'feeco-depot-train-and-points', color: '#acaf92', periodSeconds: 48,
    sceneEvidence: 'The FeeCo level reference identifies the train connections in Abe’s Exoddus. A short railcar passes a visible linked point lever in a distant junction; the exact projection and timetable are authored, without destinations, alarms, passengers or train interaction.'
  }),
  scene({
    id: 'soul-reaver1999-cathedral-steam-valves', universes: ['Legacy of Kain'], scenePattern: /silenced cathedral.*(?:valve|pipe|steam|vanne|tuyau|vapeur)|cath[eé]drale.*silenc.*(?:vanne|tuyau|vapeur)/i,
    excludedScenePattern: /soul reaver\s*2|defiance|blood omen|spectral|pinnacle|sommet|hymn of death|hymne.*mort|cut content|unused|contenu.*coup[eé]/i,
    sourceWork: 'Legacy of Kain: Soul Reaver (1999), released Silenced Cathedral pipe puzzle', sourceReference: 'https://gamefaqs.gamespot.com/pc/142681-legacy-of-kain-soul-reaver/faqs/2550',
    sourceScene: 'Silenced Cathedral — vannes des trois tuyaux, Soul Reaver 1999, plan matériel', continuity: 'Released Soul Reaver (1999), material realm; not the cut sounding-pipe finale',
    mechanism: 'silenced-cathedral-three-valves', color: '#a5aea0', periodSeconds: 31,
    sceneEvidence: 'The released-game walkthrough identifies the Cathedral’s room of three pipes; indexed walkthrough context describes its valve and air puzzles. Three physical handwheels and sliding collars interpret that released mechanism, excluding the unused destructive sounding-pipe finale and any lift force.'
  }),
  scene({
    id: 'soul-reaver1999-drowned-abbey-bell', universes: ['Legacy of Kain'], scenePattern: /(?:drowned|drowning) abbey.*(?:bell|cloche)|abbaye.*(?:noy[eé]|engloutie).*cloche/i,
    excludedScenePattern: /soul reaver\s*2|defiance|blood omen|spectral|pinnacle|hymn of death|cut content|unused|contenu.*coup[eé]/i,
    sourceWork: 'Legacy of Kain: Soul Reaver (1999), Drowned Abbey bell tower', sourceReference: 'https://legacyofkain.fandom.com/wiki/Switches',
    sourceScene: 'Drowned Abbey — cloche et chaîne du beffroi, Soul Reaver 1999, plan matériel', continuity: 'Released Soul Reaver (1999), Drowned Abbey material realm',
    mechanism: 'drowned-abbey-pull-chain-bell', color: '#a9b6b0', periodSeconds: 29,
    sceneEvidence: 'The switches reference identifies a pull chain ringing the Drowned Abbey bell to reach Rahab. The distant bell, clapper and chain are mechanically linked in an original cycle; no sound, broken glass, path opening, spectral shift or damage is produced.'
  }),
  scene({
    id: 'thing1982-outpost31-generator', universes: ['The Thing'], scenePattern: /outpost\s*(?:#\s*)?31.*(?:generator|g[eé]n[eé]rateur)|generator room.*1982/i,
    excludedScenePattern: /2011|2002.*game|jeu.*2002|norwegian|norv[eé]gien|destroyed|d[eé]truit|after.*sabotage|apr[eè]s.*sabotage|power.*out|courant.*coup[eé]/i,
    sourceWork: 'The Thing (1982), U.S. Outpost 31 generator room', sourceReference: 'https://en.wikipedia.org/wiki/The_Thing_(1982_film)',
    sourceScene: 'U.S. Outpost 31 — générateur en service du film The Thing 1982, avant sabotage', continuity: 'John Carpenter film (1982), working U.S. station before generator destruction',
    mechanism: 'outpost31-generator-flywheel', color: '#aab8b6', periodSeconds: 22,
    sceneEvidence: 'The film establishes Outpost 31’s generator and its later destruction. A flywheel, belt and radiator fan interpret the working plant beforehand; exact machinery is an authored setting adaptation, not a source-verified generator model or an event that changes station power.'
  }),
  scene({
    id: 'thing1982-outpost31-bell206-rotors', universes: ['The Thing'], scenePattern: /outpost\s*(?:#\s*)?31.*(?:helipad|h[eé]liport|bell.?206)|macready.*(?:helicopter|h[eé]licopt[eè]re)/i,
    excludedScenePattern: /2011|2002.*game|jeu.*2002|norwegian|norv[eé]gien|destroyed|d[eé]truit|after.*sabotage|apr[eè]s.*sabotage|wreck|[eé]pave/i,
    sourceWork: 'The Thing (1982), MacReady’s Bell 206 at U.S. Outpost 31', sourceReference: 'https://thething.fandom.com/wiki/Bell_206_Jetranger',
    sourceScene: 'U.S. Outpost 31 — héliport, Bell 206 de MacReady intact dans The Thing 1982', continuity: 'John Carpenter film (1982), U.S. helicopter before Blair’s sabotage',
    mechanism: 'outpost31-bell206-main-tail-rotors', color: '#b2b9b6', periodSeconds: 24,
    sceneEvidence: 'The helicopter reference identifies Outpost 31’s Bell 206 and its flight to the Norwegian camp. The parked airframe stays fixed while its main and tail rotors turn; startup timing and outlines are authored, with no flight, passengers, gunfire or collision.'
  }),
  scene({
    id: 'evil-dead1981-cabin-tape-reels', universes: ['Evil Dead'], scenePattern: /(?:knowby|cabin|cabane).*(?:tape|recorder|magn[eé]tophone)|reel.to.reel.*1981/i,
    excludedScenePattern: /1987|evil dead\s*(?:ii|2)\b|2013|rise|2023|army of darkness|arm[eé]e.*t[eé]n[eè]bres|ash vs/i,
    sourceWork: 'The Evil Dead (1981), Knowby cabin reel-to-reel recorder', sourceReference: 'https://bookofthedead.ws/website/the_evil_dead_props.html',
    sourceScene: 'Cabane Knowby — magnétophone à deux bobines du film The Evil Dead 1981', continuity: 'The Evil Dead (1981), physical tape transport without playback',
    mechanism: 'knowby-recorder-reels-capstan', color: '#b9ac94', periodSeconds: 27,
    sceneEvidence: 'The prop reference documents the original film’s reel-to-reel recorder. Unequal reels, tape path and capstan turn as a transport mechanism; no recording, incantation, possession, enemy or source audio is played and the repeated tape segment is an adaptation.'
  }),
  scene({
    id: 'evil-dead2-workshed-empty-vice', universes: ['Evil Dead'], scenePattern: /(?:evil dead\s*(?:ii|2)|1987).*(?:workshed|[eé]tabli|[eé]tau)|workshed.*(?:vice|[eé]tau)/i,
    excludedScenePattern: /1981|2013|rise|2023|army of darkness|arm[eé]e.*t[eé]n[eè]bres|ash vs/i,
    sourceWork: 'Evil Dead II (1987), workshed bench vice', sourceReference: 'https://www.bookofthedead.ws/website/evil_dead_2_versions.html',
    sourceScene: 'Evil Dead II 1987 — workshed, étau vide sur l’établi', continuity: 'Evil Dead II (1987), empty mechanical prop study',
    mechanism: 'workshed-empty-vice-screw', color: '#b4a38b', periodSeconds: 36,
    sceneEvidence: 'The film reference locates a vice in the workshed. Only the empty tool is drawn: a turning screw advances its jaw within a fixed body. There is no occupant, body part or reenacted injury; screw pitch, return cycle and projected proportions are authored.'
  }),
  scene({
    id: 'mummy1999-cairo-key-box', universes: ['The Mummy'], scenePattern: /(?:cairo|caire).*(?:museum|mus[eé]e).*(?:key|box|bo[iî]te|cl[eé])|puzzle box.*cairo/i,
    excludedScenePattern: /1932|1959|2017|returns|retour.*momie|2001|dragon emperor|empereur dragon|2008/i,
    sourceWork: 'The Mummy (1999), Cairo Museum puzzle-key box', sourceReference: 'https://www.filmsite.org/series-mummy.html',
    sourceScene: 'Le Caire — musée, boîte-clef à huit pétales du film La Momie 1999', continuity: 'The Mummy (1999), Jonathan and Evelyn’s box; not later films',
    mechanism: 'cairo-eight-petal-key-box', color: '#bca57b', periodSeconds: 44,
    sceneEvidence: 'The reference identifies a puzzle box that unfolds into key attachments and contains the Hamunaptra map. Eight linked petals open above an empty display stand; no map artwork, spell, readable inscription or official prop animation is reproduced.'
  }),
  scene({
    id: 'mummy1999-hamunaptra-sarcophagus-lock', universes: ['The Mummy'], scenePattern: /hamunaptra.*(?:sarcophag|lock|serrure|verrou)|imhotep.*sarcophag.*1999/i,
    excludedScenePattern: /1932|1959|2017|returns|retour.*momie|2001|dragon emperor|empereur dragon|2008|opened.*mummy|momie.*sortie|destroyed|d[eé]truit|collapsed|effondr|apr[eè]s.*(?:destruction|beni)/i,
    sourceWork: 'The Mummy (1999), Hamunaptra sarcophagus key lock', sourceReference: 'https://www.filmsite.org/series-mummy.html',
    sourceScene: 'Hamunaptra — serrure à clef déployée du sarcophage dans La Momie 1999', continuity: 'The Mummy (1999), closed coffin detail before opening; no occupant depicted',
    mechanism: 'hamunaptra-radial-key-lock', color: '#b6a17e', periodSeconds: 40,
    sceneEvidence: 'The film synopsis describes the peculiar sarcophagus lock accepting the unfolded box as its key. A large projected lock face, eight key arms and retracting bolts interpret it; the lid stays closed, no mummy appears, and the inferred internal linkage is openly authored.'
  }),
  scene({
    id: 'fma2009-rockbell-automail-hand', universes: ['Fullmetal Alchemist'], scenePattern: /(?:rockbell|resembo[o]?l).*(?:automail|workshop|atelier)|winry.*(?:atelier|workshop)/i,
    excludedScenePattern: /2003|shamballa|2017.*live|live.action|film.*2017|briggs|northern|nordique/i,
    sourceWork: 'Fullmetal Alchemist: Brotherhood (2009), Rockbell workshop in Resembool', sourceReference: 'https://fullmetalalchemistusa.com/character/',
    sourceScene: 'Resembool — atelier Rockbell de Brotherhood 2009, main automail sur un support de test', continuity: 'Brotherhood (2009), Resembool workshop; not the 2003 anime or northern automail',
    mechanism: 'rockbell-automail-finger-linkages', color: '#b9b5a7', periodSeconds: 30,
    sceneEvidence: 'The official Brotherhood character page places the Rockbell artificial-limb shop in Resembool and names Winry as Ed’s mechanic. An empty hand on a bench articulates linked fingers and a wrist joint; the testing fixture, finger gearing and cycle are mechanical interpretations, not healing or transmutation.'
  }),
  scene({
    id: 'fma2009-resembool-railway-rods', universes: ['Fullmetal Alchemist'], scenePattern: /resembo[o]?l.*(?:station|gare|train|rail)|brotherhood.*(?:train|rail).*episode\s*6/i,
    excludedScenePattern: /2003|shamballa|2017.*live|live.action|film.*2017|1907|ishval.*bomb|bomb.*ishval|destroyed|d[eé]truite/i,
    sourceWork: 'Fullmetal Alchemist: Brotherhood (2009), episode 6 Road of Hope, Resembool rail journey', sourceReference: 'https://en.wikipedia.org/wiki/List_of_Fullmetal_Alchemist:_Brotherhood_episodes',
    sourceScene: 'Resembool — gare du voyage de Brotherhood épisode 6, bielles de locomotive', continuity: 'Brotherhood (2009), Road of Hope journey; not the 1907 station bombing',
    mechanism: 'resembool-locomotive-coupling-rods', color: '#b3b5a9', periodSeconds: 35,
    sceneEvidence: 'Episode 6 takes the Elrics and Armstrong back to Resembool by rail before automail repairs. A distant engine couples its driving wheels with a rigid rod; its mechanical projection, waiting-bay motion and repeated rotation are authored, with no passengers or usable train.'
  }),
  scene({
    id: 'medievil2019-scarecrow-windmill', universes: ['MediEvil'], scenePattern: /scarecrow fields.*(?:windmill|moulin)|champs.*[eé]pouvantail.*moulin/i,
    excludedScenePattern: /1998|resurrection|2005|medievil\s*(?:ii|2)\b|2000|destroyed|d[eé]truit/i,
    sourceWork: 'MediEvil (2019 remake), Scarecrow Fields windmill', sourceReference: 'https://www.gamepressure.com/medievil/scarecrow-fields/zccc2d',
    sourceScene: 'Scarecrow Fields — moulin aux ailes de bois de MediEvil remake 2019', continuity: 'MediEvil 2019, Scarecrow Fields; no original-stage collision recreation',
    mechanism: 'scarecrow-fields-wooden-windmill', color: '#b7a17c', periodSeconds: 28,
    sceneEvidence: 'The 2019 walkthrough explicitly describes the windmill and passing through its wings. A small fixed building and wooden lattice sails turn in the backdrop; no blades, fire projectiles, enemies, damage or moving gameplay surface are added.'
  }),
  scene({
    id: 'medievil2019-time-device-clock-carriage', universes: ['MediEvil'], scenePattern: /time device|machine.*temps.*medievil/i,
    excludedScenePattern: /1998|resurrection|2005|medievil\s*(?:ii|2)\b|2000|destroyed|d[eé]truit/i,
    sourceWork: 'MediEvil (2019 remake), The Time Device clock puzzle', sourceReference: 'https://www.gamepressure.com/medievil/the-time-device/z0cc73',
    sourceScene: 'The Time Device — horloge descendante et cadran mécanique de MediEvil remake 2019', continuity: 'MediEvil 2019, The Time Device; no puzzle or time travel effect',
    mechanism: 'time-device-descending-clock-carriage', color: '#b4b0a0', periodSeconds: 42,
    sceneEvidence: 'The walkthrough describes a descending reference clock and a large clock set by two controls. A small suspended clock and two geared hands visualize that mechanism; the chosen time is fixed authored choreography, never a code, rune, force-field switch or time-travel action.'
  })
]);

export const WAVE_5_MODE_REFERENCE_SCENES = Object.freeze({
  'The Lord of the Rings': { Combat: 'Isengard forge wheel The Two Towers 2002', Melee: 'Morannon Black Gate The Two Towers 2002', RPG: 'Isengard forge wheel The Two Towers 2002', Tactics: 'Morannon Black Gate The Two Towers 2002' },
  'Harry Potter': { Combat: 'Hogwarts Clock Tower film 2004', Melee: 'Burrow Weasley family clock novel summer 1994', RPG: 'Hogwarts Clock Tower film 2004', Tactics: 'Burrow Weasley family clock novel summer 1994' },
  Fallout: { Combat: 'Fallout 4 Vault 111 round lift', Melee: 'Fallout 4 Prydwen Boston Airport propellers', RPG: 'Fallout 4 Vault 111 round lift', Tactics: 'Fallout 4 Prydwen Boston Airport propellers' },
  Ghostbusters: { Combat: 'Firehouse containment unit loading 1984', Melee: 'Sedgewick ballroom trap pedal 1984', RPG: 'Firehouse containment unit loading 1984', Tactics: 'Sedgewick ballroom trap pedal 1984' },
  'Tomb Raider': { Combat: 'Lost Valley repaired three cogs Tomb Raider 1996', Melee: 'St Francis Folly Thor hammer Tomb Raider 1996', RPG: 'Lost Valley repaired three cogs Tomb Raider 1996', Tactics: 'St Francis Folly Thor hammer Tomb Raider 1996' },
  Oddworld: { Combat: 'RuptureFarms barrel stamper Abe Oddysee 1997', Melee: 'FeeCo Depot train Abe Exoddus 1998', RPG: 'RuptureFarms barrel stamper Abe Oddysee 1997', Tactics: 'FeeCo Depot train Abe Exoddus 1998' },
  'Legacy of Kain': { Combat: 'Silenced Cathedral steam valves Soul Reaver 1999 material realm', Melee: 'Drowned Abbey bell Soul Reaver 1999 material realm', RPG: 'Silenced Cathedral steam valves Soul Reaver 1999 material realm', Tactics: 'Drowned Abbey bell Soul Reaver 1999 material realm' },
  'The Thing': { Combat: 'Outpost 31 generator working The Thing 1982', Melee: 'Outpost 31 helipad MacReady Bell206 The Thing 1982', RPG: 'Outpost 31 generator working The Thing 1982', Tactics: 'Outpost 31 helipad MacReady Bell206 The Thing 1982' },
  'Evil Dead': { Combat: 'Knowby cabin reel-to-reel tape recorder 1981', Melee: 'Evil Dead II 1987 workshed empty vice', RPG: 'Knowby cabin reel-to-reel tape recorder 1981', Tactics: 'Evil Dead II 1987 workshed empty vice' },
  'The Mummy': { Combat: 'Cairo museum puzzle key box 1999', Melee: 'Hamunaptra sarcophagus lock 1999', RPG: 'Cairo museum puzzle key box 1999', Tactics: 'Hamunaptra sarcophagus lock 1999' },
  'Fullmetal Alchemist': { Combat: 'Resembool Rockbell automail workshop Brotherhood 2009', Melee: 'Resembool station railway Brotherhood episode 6', RPG: 'Resembool Rockbell automail workshop Brotherhood 2009', Tactics: 'Resembool station railway Brotherhood episode 6' },
  MediEvil: { Combat: 'Scarecrow Fields windmill MediEvil remake 2019', Melee: 'The Time Device clock carriage MediEvil remake 2019', RPG: 'Scarecrow Fields windmill MediEvil remake 2019', Tactics: 'The Time Device clock carriage MediEvil remake 2019' }
});

const tau = Math.PI * 2;
const wrap = value => ((value % 1) + 1) % 1;
const line = (ctx, points) => { ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); };
const polygon = (ctx, points, fill = true) => { ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); if (fill) ctx.fill(); else ctx.stroke(); };
const ellipse = (ctx, x, y, rx, ry, fill = false) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, tau); if (fill) ctx.fill(); else ctx.stroke(); };
const wheel = (ctx, x, y, r, angle, spokes = 6) => {
  ellipse(ctx, x, y, r, r);
  for (let i = 0; i < spokes; i++) { const a = angle + i * tau / spokes; line(ctx, [[x, y], [x + Math.cos(a) * r * 0.85, y + Math.sin(a) * r * 0.85]]); }
};
const gear = (ctx, x, y, r, angle, teeth = 12) => {
  const points = Array.from({ length: teeth * 4 }, (_, i) => { const a = angle + i * tau / (teeth * 4), radius = r * (i % 4 === 0 || i % 4 === 3 ? 0.84 : 1); return [x + Math.cos(a) * radius, y + Math.sin(a) * radius]; });
  polygon(ctx, points, false); wheel(ctx, x, y, r * 0.7, angle, 4);
};
const joint = (ctx, points, r = 2) => { line(ctx, points); for (const [x, y] of points) ellipse(ctx, x, y, r, r); };
const chain = (ctx, x, top, bottom, offset, h) => {
  line(ctx, [[x, top], [x, bottom]]);
  for (let link = 0; link < 8; link++) ellipse(ctx, x, top + wrap(offset + link / 8) * (bottom - top), h * 0.003, h * 0.006);
};

/** Shared clip/state saving belongs to stageAnimationCatalog; no wall clock here. */
export function drawStageAnimationWave5(ctx, animation, frame, width, height) {
  if (animation.animationWave !== 5) return false;
  const w = width, h = height, a = frame.phase, p = frame.progress, travel = (1 - Math.cos(a)) / 2;
  ctx.globalAlpha = 0.14;
  switch (animation.mechanism) {
    case 'isengard-forge-wheel-transmission': {
      const x = w * 0.76, y = h * 0.3, r = h * 0.075;
      wheel(ctx, x, y, r, a, 10);
      for (let tooth = 0; tooth < 10; tooth++) { const angle = a + tooth * tau / 10; line(ctx, [[x + Math.cos(angle) * r * 0.93, y + Math.sin(angle) * r * 0.93], [x + Math.cos(angle) * r * 1.12, y + Math.sin(angle) * r * 1.12]]); }
      const crank = [x + Math.cos(a) * r * 0.38, y + Math.sin(a) * r * 0.38], head = [w * 0.86, h * (0.31 + Math.sin(a) * 0.025)];
      joint(ctx, [crank, head]);
      polygon(ctx, [[w * 0.83, h * 0.35], [w * 0.89, h * 0.35], [head[0] + w * 0.03, head[1]], [head[0] - w * 0.03, head[1]]], false);
      for (let fold = 0; fold < 4; fold++) line(ctx, [[w * 0.83, h * 0.35 + (head[1] - h * 0.35) * fold / 4], [w * 0.89, h * 0.35 + (head[1] - h * 0.35) * fold / 4]]);
      line(ctx, [[w * 0.89, h * 0.34], [w * 0.92, h * 0.34], [w * 0.92, h * 0.41]]);
      for (const dx of [-0.022, 0.022]) line(ctx, [[x + w * dx, y], [x + w * dx, h * 0.45]]);
      break;
    }
    case 'morannon-chain-operated-leaves': {
      const cx = w * 0.2, y = h * 0.2, half = w * 0.075, opening = travel * 0.75;
      for (const side of [-1, 1]) {
        const pivot = cx + side * half, edge = pivot - side * half * Math.cos(opening), depth = Math.sin(opening) * h * 0.035;
        polygon(ctx, [[pivot, y], [edge, y + depth], [edge, h * 0.43 + depth], [pivot, h * 0.43]], false);
        for (let spike = 0; spike < 6; spike++) { const x = pivot + (edge - pivot) * spike / 6; line(ctx, [[x, y + depth * spike / 6], [x, y - h * 0.025 + depth * spike / 6]]); }
        const lever = [pivot + side * w * 0.035, h * 0.36], tip = [lever[0] + side * Math.cos(opening) * w * 0.035, lever[1] - Math.sin(opening) * h * 0.075];
        joint(ctx, [lever, tip]); line(ctx, [tip, [edge, h * 0.34 + depth]]);
        chain(ctx, pivot + side * w * 0.012, h * 0.16, h * 0.36, p * side, h);
        ctx.strokeRect(pivot - w * 0.009, h * 0.145, w * 0.018, h * 0.3);
      }
      break;
    }
    case 'hogwarts-clock-tower-pendulum': {
      const cx = w * 0.8, top = h * 0.17, swing = Math.sin(a) * 0.3, length = h * 0.22;
      ctx.strokeRect(cx - w * 0.063, h * 0.12, w * 0.126, h * 0.35);
      ellipse(ctx, cx, top, h * 0.04, h * 0.04);
      line(ctx, [[cx, top], [cx + Math.cos(-a * 12) * h * 0.03, top + Math.sin(-a * 12) * h * 0.03]]);
      line(ctx, [[cx, top], [cx + Math.cos(-a) * h * 0.02, top + Math.sin(-a) * h * 0.02]]);
      const pivot = [cx, h * 0.23], bob = [cx + Math.sin(swing) * length, pivot[1] + Math.cos(swing) * length];
      line(ctx, [pivot, bob]); ellipse(ctx, bob[0], bob[1], h * 0.024, h * 0.018);
      gear(ctx, cx - w * 0.042, h * 0.27, h * 0.023, a, 10); gear(ctx, cx - w * 0.042, h * 0.305, h * 0.012, -a * 2, 5);
      break;
    }
    case 'burrow-nine-location-hands': {
      const cx = w * 0.17, cy = h * 0.27, radius = h * 0.09;
      polygon(ctx, [[cx - w * 0.055, h * 0.43], [cx - w * 0.05, h * 0.17], [cx, h * 0.125], [cx + w * 0.05, h * 0.17], [cx + w * 0.055, h * 0.43]], false);
      ellipse(ctx, cx, cy, radius, radius);
      for (let sector = 0; sector < 9; sector++) { const angle = sector * tau / 9; ellipse(ctx, cx + Math.cos(angle) * radius * 0.86, cy + Math.sin(angle) * radius * 0.86, 2, 2); }
      for (let hand = 0; hand < 9; hand++) {
        const angle = hand * tau / 9 + Math.sin(a + hand * 0.7) * 0.2, end = [cx + Math.cos(angle) * radius * (0.53 + hand * 0.032), cy + Math.sin(angle) * radius * (0.53 + hand * 0.032)];
        line(ctx, [[cx, cy], end]); ellipse(ctx, end[0], end[1], h * 0.006, h * 0.009);
      }
      ellipse(ctx, cx, cy, 3, 3, true);
      break;
    }
    case 'vault111-round-platform-shaft': {
      const cx = w * 0.8, y = h * (0.25 + travel * 0.17), rx = w * 0.075;
      ellipse(ctx, cx, h * 0.18, rx, h * 0.023); ellipse(ctx, cx, h * 0.48, rx, h * 0.023);
      for (const side of [-1, 1]) { line(ctx, [[cx + side * rx, h * 0.18], [cx + side * rx, h * 0.48]]); ctx.strokeRect(cx + side * rx - w * 0.005, y - h * 0.014, w * 0.01, h * 0.03); }
      ellipse(ctx, cx, y, rx, h * 0.023); ellipse(ctx, cx, y + h * 0.014, rx, h * 0.023);
      for (let spoke = 0; spoke < 8; spoke++) { const angle = spoke * tau / 8; line(ctx, [[cx, y], [cx + Math.cos(angle) * rx, y + Math.sin(angle) * h * 0.023]]); }
      line(ctx, [[cx, h * 0.13], [cx, y - h * 0.035], [cx - w * 0.03, y], [cx + w * 0.03, y], [cx, y - h * 0.035]]);
      break;
    }
    case 'prydwen-four-propeller-outriggers': {
      const cx = w * 0.22, cy = h * 0.26;
      ellipse(ctx, cx, cy, w * 0.12, h * 0.055);
      for (let rib = -2; rib <= 2; rib++) ellipse(ctx, cx + rib * w * 0.032, cy, w * (0.018 - Math.abs(rib) * 0.002), h * (0.052 - Math.abs(rib) * 0.009));
      polygon(ctx, [[cx - w * 0.095, cy], [cx - w * 0.135, cy - h * 0.055], [cx - w * 0.11, cy + h * 0.02]], false);
      ctx.strokeRect(cx - w * 0.05, cy + h * 0.045, w * 0.11, h * 0.025);
      for (const side of [-1, 1]) for (const aft of [-1, 1]) {
        const x = cx + aft * w * 0.065, y = cy + side * h * 0.065;
        line(ctx, [[x, cy + side * h * 0.025], [x, y]]); ellipse(ctx, x, y, h * 0.016, h * 0.016);
        for (let blade = 0; blade < 3; blade++) { const angle = a * side + blade * tau / 3; line(ctx, [[x, y], [x + Math.cos(angle) * h * 0.022, y + Math.sin(angle) * h * 0.022]]); }
      }
      line(ctx, [[cx - w * 0.07, cy + h * 0.05], [w * 0.09, h * 0.47]]);
      break;
    }
    case 'firehouse-empty-trap-loading-slide': {
      const x = w * 0.72, y = h * 0.17, slide = travel * h * 0.09;
      ctx.strokeRect(x, y, w * 0.16, h * 0.29);
      ctx.strokeRect(x + w * 0.022, y + h * 0.08, w * 0.115, h * 0.14);
      ctx.save(); ctx.beginPath(); ctx.rect(x + w * 0.022, y + h * 0.08, w * 0.115, h * 0.14); ctx.clip();
      ctx.strokeRect(x + w * 0.022, y + h * 0.08 - slide, w * 0.115, h * 0.07);
      ctx.strokeRect(x + w * (0.035 + travel * 0.015), y + h * 0.167, w * 0.06, h * 0.04); ctx.restore();
      for (let bar = 0; bar < 5; bar++) ctx.strokeRect(x + w * (0.025 + bar * 0.025), y + h * 0.028, w * 0.013, h * 0.022);
      joint(ctx, [[x + w * 0.142, y + h * 0.23], [x + w * (0.142 + Math.sin(a) * 0.014), y + h * 0.17]]);
      break;
    }
    case 'sedgewick-pedal-and-trap-hinges': {
      const cx = w * 0.18, y = h * 0.34, open = travel * 1.25, half = w * 0.04;
      ctx.strokeRect(cx - half, y, half * 2, h * 0.06);
      for (const side of [-1, 1]) {
        const edge = cx + side * half, tip = [edge - side * Math.cos(open) * half, y - Math.sin(open) * h * 0.085];
        polygon(ctx, [[edge, y], tip, [tip[0], tip[1] + h * 0.012], [edge, y + h * 0.012]], false);
        for (let stripe = 1; stripe < 4; stripe++) { const x = edge + (tip[0] - edge) * stripe / 4, sy = y + (tip[1] - y) * stripe / 4; line(ctx, [[x, sy], [x, sy + h * 0.012]]); }
      }
      const pedal = [cx + w * 0.1, y + h * 0.065];
      line(ctx, [[cx + half, y + h * 0.035], [cx + w * 0.07, y + h * 0.08], pedal]);
      line(ctx, [pedal, [pedal[0] + w * 0.035, pedal[1] - h * (0.024 - travel * 0.018)]]);
      ctx.strokeRect(pedal[0], pedal[1], w * 0.04, h * 0.01);
      break;
    }
    case 'lost-valley-three-cog-sluice': {
      const x = w * 0.76, y = h * 0.26, r = h * 0.032;
      gear(ctx, x, y, r, a * 3, 12); gear(ctx, x + r * 1.5, y + r * 0.9, r * 0.75, -a * 4, 9); gear(ctx, x + r * 3, y, r, a * 3, 12);
      const gateX = w * 0.73, gateY = h * (0.38 - travel * 0.06);
      ctx.strokeRect(gateX - w * 0.012, h * 0.31, w * 0.16, h * 0.17);
      ctx.strokeRect(gateX, gateY, w * 0.13, h * 0.065);
      for (let slat = 1; slat < 6; slat++) line(ctx, [[gateX + slat * w * 0.021, gateY], [gateX + slat * w * 0.021, gateY + h * 0.065]]);
      line(ctx, [[x + r * 3, y], [x + r * 3, h * 0.3], [gateX + w * 0.065, gateY]]);
      ctx.globalAlpha = 0.055;
      for (let stream = 0; stream < 4; stream++) line(ctx, [[w * 0.68 + wrap(p + stream / 4) * w * 0.22, h * 0.485], [w * 0.7 + wrap(p + stream / 4) * w * 0.22, h * 0.485]]);
      break;
    }
    case 'thor-room-empty-hammer-rig': {
      const pivot = [w * 0.13, h * 0.24], angle = -0.7 + travel * 1.3, length = h * 0.18;
      const head = [pivot[0] + Math.cos(angle) * length, pivot[1] + Math.sin(angle) * length];
      line(ctx, [[w * 0.1, h * 0.43], [w * 0.1, h * 0.15], [w * 0.3, h * 0.15], [w * 0.3, h * 0.43]]);
      joint(ctx, [pivot, head], 3);
      const ux = Math.cos(angle), uy = Math.sin(angle), long = h * 0.038, short = h * 0.018;
      polygon(ctx, [[head[0] - uy * long - ux * short, head[1] + ux * long - uy * short], [head[0] + uy * long - ux * short, head[1] - ux * long - uy * short], [head[0] + uy * long + ux * short, head[1] - ux * long + uy * short], [head[0] - uy * long + ux * short, head[1] + ux * long + uy * short]], false);
      line(ctx, [head, [w * 0.28, h * 0.16], [w * 0.28, h * (0.29 + travel * 0.09)]]);
      wheel(ctx, w * 0.28, h * 0.16, h * 0.015, a, 5);
      break;
    }
    case 'rupturefarms-sealed-barrel-stamper': {
      const left = w * 0.69, right = w * 0.92, y = h * 0.4;
      ctx.strokeRect(left, y, right - left, h * 0.025);
      for (const x of [left, right]) wheel(ctx, x, y + h * 0.012, h * 0.014, a * 2, 7);
      for (let drum = 0; drum < 4; drum++) {
        const x = left + wrap(p + drum / 4) * (right - left);
        ctx.strokeRect(x - w * 0.012, y - h * 0.055, w * 0.024, h * 0.054); ellipse(ctx, x, y - h * 0.055, w * 0.012, h * 0.006);
        for (const rib of [0.012, 0.042]) line(ctx, [[x - w * 0.012, y - h * rib], [x + w * 0.012, y - h * rib]]);
      }
      const stampY = h * (0.265 + travel * 0.055);
      ctx.strokeRect(w * 0.79, h * 0.17, w * 0.012, stampY - h * 0.17); ctx.strokeRect(w * 0.77, stampY, w * 0.052, h * 0.017);
      line(ctx, [[w * 0.75, h * 0.17], [w * 0.85, h * 0.17], [w * 0.85, y]]);
      break;
    }
    case 'feeco-depot-train-and-points': {
      const x = w * (-0.18 + p * 0.72), y = h * 0.27;
      line(ctx, [[0, h * 0.37], [w * 0.42, h * 0.37]]); line(ctx, [[w * 0.08, h * 0.43], [w * 0.27, h * 0.37]]);
      for (let tie = 0; tie < 12; tie++) line(ctx, [[tie * w * 0.038, h * 0.36], [tie * w * 0.038, h * 0.39]]);
      ctx.strokeRect(x, y, w * 0.14, h * 0.075); ctx.strokeRect(x + w * 0.025, y + h * 0.012, w * 0.035, h * 0.028);
      polygon(ctx, [[x + w * 0.14, y + h * 0.01], [x + w * 0.16, y + h * 0.035], [x + w * 0.14, y + h * 0.075]], false);
      for (const dx of [0.025, 0.115]) wheel(ctx, x + w * dx, y + h * 0.078, h * 0.018, a * 3, 8);
      const handle = [w * (0.31 + Math.sin(a) * 0.018), h * 0.43];
      joint(ctx, [[w * 0.31, h * 0.48], handle]); line(ctx, [handle, [w * 0.23, h * 0.377], [w * (0.15 + travel * 0.018), h * 0.385]]);
      break;
    }
    case 'silenced-cathedral-three-valves': {
      for (let pipe = 0; pipe < 3; pipe++) {
        const x = w * (0.7 + pipe * 0.073), y = h * 0.32, phase = a + pipe * tau / 3, slide = Math.sin(phase) * h * 0.012;
        ctx.strokeRect(x - w * 0.014, h * 0.17, w * 0.028, h * 0.28);
        ellipse(ctx, x, h * 0.17, w * 0.014, h * 0.008); wheel(ctx, x, y, h * 0.025, phase, 5);
        ctx.strokeRect(x - w * 0.02, y + h * 0.055 + slide, w * 0.04, h * 0.015);
        line(ctx, [[x, y + h * 0.025], [x, y + h * 0.055 + slide]]);
        for (const bolt of [-1, 1]) ctx.fillRect(x + bolt * w * 0.016, y + h * 0.057 + slide, 2, 2);
      }
      break;
    }
    case 'drowned-abbey-pull-chain-bell': {
      const cx = w * 0.2, pivot = [cx, h * 0.18], swing = Math.sin(a) * 0.24;
      const transform = (x, y) => [pivot[0] + x * Math.cos(swing) - y * Math.sin(swing), pivot[1] + x * Math.sin(swing) + y * Math.cos(swing)];
      line(ctx, [[cx - w * 0.065, h * 0.45], [cx - w * 0.065, h * 0.16], [cx + w * 0.065, h * 0.16], [cx + w * 0.065, h * 0.45]]);
      polygon(ctx, [[-w * 0.016, h * 0.015], [w * 0.016, h * 0.015], [w * 0.025, h * 0.095], [w * 0.035, h * 0.115], [-w * 0.035, h * 0.115], [-w * 0.025, h * 0.095]].map(([x, y]) => transform(x, y)), false);
      const clapper = transform(Math.sin(-swing * 1.5) * h * 0.015, h * 0.12);
      line(ctx, [pivot, clapper]); ellipse(ctx, clapper[0], clapper[1], 4, 4);
      const chainTop = transform(w * 0.023, h * 0.02); chain(ctx, chainTop[0], chainTop[1], h * (0.43 + Math.sin(a) * 0.012), p, h);
      break;
    }
    case 'outpost31-generator-flywheel': {
      const x = w * 0.75, y = h * 0.33;
      ctx.strokeRect(x - w * 0.04, y - h * 0.06, w * 0.16, h * 0.13);
      wheel(ctx, x, y, h * 0.044, a * 2, 8); wheel(ctx, x + w * 0.085, y, h * 0.026, a * 3, 7);
      line(ctx, [[x, y - h * 0.044], [x + w * 0.085, y - h * 0.026], [x + w * 0.085, y + h * 0.026], [x, y + h * 0.044]]);
      for (let fin = 0; fin < 7; fin++) line(ctx, [[x + w * (0.037 + fin * 0.01), y - h * 0.05], [x + w * (0.037 + fin * 0.01), y + h * 0.05]]);
      line(ctx, [[x - w * 0.02, y - h * 0.06], [x - w * 0.02, h * 0.2], [x + w * 0.1, h * 0.2], [x + w * 0.1, y - h * 0.06]]);
      for (const side of [-1, 1]) line(ctx, [[x + w * 0.04 + side * w * 0.065, y + h * 0.07], [x + w * 0.04 + side * w * 0.07, h * 0.46]]);
      break;
    }
    case 'outpost31-bell206-main-tail-rotors': {
      const x = w * 0.21, y = h * 0.33;
      polygon(ctx, [[x - w * 0.045, y], [x - w * 0.03, y - h * 0.045], [x + w * 0.02, y - h * 0.045], [x + w * 0.04, y - h * 0.015], [x + w * 0.12, y - h * 0.03], [x + w * 0.12, y - h * 0.015], [x + w * 0.025, y + h * 0.015], [x - w * 0.04, y + h * 0.015]], false);
      line(ctx, [[x - w * 0.02, y + h * 0.015], [x - w * 0.02, y + h * 0.045], [x + w * 0.045, y + h * 0.045]]);
      const rotorY = y - h * 0.065; line(ctx, [[x, y - h * 0.045], [x, rotorY]]);
      for (const side of [-1, 1]) line(ctx, [[x, rotorY], [x + side * Math.cos(a * 2) * w * 0.09, rotorY + side * Math.sin(a * 2) * h * 0.013]]);
      wheel(ctx, x + w * 0.12, y - h * 0.025, h * 0.016, a * 3, 3);
      ctx.strokeRect(x - w * 0.018, y - h * 0.034, w * 0.028, h * 0.025);
      break;
    }
    case 'knowby-recorder-reels-capstan': {
      const x = w * 0.7, y = h * 0.21, left = [x + w * 0.034, y + h * 0.07], right = [x + w * 0.118, y + h * 0.07];
      ctx.strokeRect(x, y, w * 0.16, h * 0.23);
      wheel(ctx, left[0], left[1], h * 0.035, a * 7, 3); wheel(ctx, right[0], right[1], h * 0.049, a * 5, 3);
      line(ctx, [[left[0], left[1] + h * 0.03], [x + w * 0.055, y + h * 0.15], [x + w * 0.1, y + h * 0.15], [right[0], right[1] + h * 0.044]]);
      wheel(ctx, x + w * 0.1, y + h * 0.15, h * 0.009, a * 35, 4);
      for (let button = 0; button < 5; button++) ctx.strokeRect(x + w * (0.02 + button * 0.025), y + h * 0.19, w * 0.017, h * 0.015);
      break;
    }
    case 'workshed-empty-vice-screw': {
      const x = w * 0.15, y = h * 0.31, jawX = x + w * (0.045 + travel * 0.03);
      line(ctx, [[x - w * 0.035, h * 0.43], [x + w * 0.16, h * 0.43]]);
      ctx.strokeRect(x, y, w * 0.027, h * 0.1); ctx.strokeRect(jawX, y, w * 0.02, h * 0.07);
      ctx.strokeRect(x + w * 0.02, y + h * 0.065, w * 0.09, h * 0.025);
      const end = x + w * 0.14; line(ctx, [[x + w * 0.027, y + h * 0.05], [end, y + h * 0.05]]);
      for (let thread = 0; thread < 12; thread++) { const tx = x + w * (0.028 + thread * 0.009); line(ctx, [[tx, y + h * 0.044], [tx + w * 0.004, y + h * 0.056]]); }
      const handleY = y + h * 0.05; line(ctx, [[end - Math.cos(a * 2) * h * 0.025, handleY - Math.sin(a * 2) * h * 0.025], [end + Math.cos(a * 2) * h * 0.025, handleY + Math.sin(a * 2) * h * 0.025]]);
      for (const dx of [0, 0.02]) ctx.strokeRect(x + dx * w, h * 0.43, w * 0.01, h * 0.025);
      break;
    }
    case 'cairo-eight-petal-key-box': {
      const cx = w * 0.79, cy = h * 0.29, base = h * 0.033, extend = travel * h * 0.038;
      for (let petal = 0; petal < 8; petal++) {
        const angle = petal * tau / 8, ux = Math.cos(angle), uy = Math.sin(angle), root = [cx + ux * base * 0.65, cy + uy * base * 0.65], end = [cx + ux * (base + extend), cy + uy * (base + extend)], side = h * 0.009;
        polygon(ctx, [[root[0] - uy * side, root[1] + ux * side], [end[0] - uy * side, end[1] + ux * side], [end[0] + uy * side, end[1] - ux * side], [root[0] + uy * side, root[1] - ux * side]], false);
        ellipse(ctx, root[0], root[1], 2, 2);
      }
      polygon(ctx, Array.from({ length: 8 }, (_, i) => [cx + Math.cos(i * tau / 8) * base * 0.75, cy + Math.sin(i * tau / 8) * base * 0.75]), false);
      line(ctx, [[cx - w * 0.045, h * 0.43], [cx - w * 0.025, h * 0.38], [cx + w * 0.025, h * 0.38], [cx + w * 0.045, h * 0.43]]);
      break;
    }
    case 'hamunaptra-radial-key-lock': {
      const cx = w * 0.2, cy = h * 0.29, radius = h * 0.06, turn = Math.sin(a) * 0.24;
      polygon(ctx, [[cx - w * 0.04, h * 0.16], [cx + w * 0.04, h * 0.16], [cx + w * 0.055, h * 0.43], [cx - w * 0.055, h * 0.43]], false);
      ellipse(ctx, cx, cy, radius, radius);
      for (let arm = 0; arm < 8; arm++) {
        const angle = turn + arm * tau / 8, ux = Math.cos(angle), uy = Math.sin(angle);
        line(ctx, [[cx + ux * radius * 0.22, cy + uy * radius * 0.22], [cx + ux * radius * 0.78, cy + uy * radius * 0.78]]);
        ctx.strokeRect(cx + ux * radius * 0.78 - 2, cy + uy * radius * 0.78 - 2, 4, 4);
      }
      for (const side of [-1, 1]) { const x = cx + side * w * (0.027 + travel * 0.011); ctx.strokeRect(x - w * 0.009, cy - h * 0.011, w * 0.018, h * 0.022); line(ctx, [[cx, cy], [x, cy]]); }
      break;
    }
    case 'rockbell-automail-finger-linkages': {
      const x = w * 0.76, y = h * 0.35;
      ctx.strokeRect(x - w * 0.025, y - h * 0.05, w * 0.05, h * 0.06); ellipse(ctx, x, y + h * 0.025, h * 0.016, h * 0.016);
      for (let finger = 0; finger < 4; finger++) {
        const root = [x + w * (-0.021 + finger * 0.014), y - h * 0.05], bend = travel * (0.65 + finger * 0.06), length = h * (0.045 + (finger === 1 || finger === 2 ? 0.006 : 0));
        const first = [root[0] + Math.sin(bend) * length * 0.45, root[1] - Math.cos(bend) * length], second = [first[0] + Math.sin(bend * 2) * length * 0.45, first[1] - Math.cos(bend * 2) * length * 0.65];
        joint(ctx, [root, first, second]); line(ctx, [[root[0] - 2, root[1]], [first[0] - 2, first[1]], [second[0] - 2, second[1]]]);
      }
      joint(ctx, [[x - w * 0.025, y - h * 0.025], [x - w * (0.045 - travel * 0.009), y - h * 0.05], [x - w * (0.05 - travel * 0.02), y - h * 0.075]]);
      line(ctx, [[x, y + h * 0.04], [x, h * 0.43], [x - w * 0.06, h * 0.43], [x + w * 0.06, h * 0.43]]);
      break;
    }
    case 'resembool-locomotive-coupling-rods': {
      const x = w * 0.09, y = h * 0.28, r = h * 0.025;
      ctx.strokeRect(x, y, w * 0.18, h * 0.07); ctx.strokeRect(x + w * 0.13, y - h * 0.04, w * 0.05, h * 0.04);
      ctx.strokeRect(x + w * 0.015, y - h * 0.05, w * 0.018, h * 0.05); ellipse(ctx, x + w * 0.015, y + h * 0.035, h * 0.017, h * 0.035);
      const centers = [0.04, 0.085, 0.13].map(dx => [x + w * dx, y + h * 0.08]);
      for (const [cx, cy] of centers) wheel(ctx, cx, cy, r, a, 7);
      const pins = centers.map(([cx, cy]) => [cx + Math.cos(a) * r * 0.65, cy + Math.sin(a) * r * 0.65]);
      joint(ctx, pins); line(ctx, [[x + w * 0.005, y + h * 0.08], pins[0]]);
      line(ctx, [[w * 0.05, h * 0.405], [w * 0.34, h * 0.405]]);
      for (const post of [0.065, 0.3]) line(ctx, [[w * post, h * 0.43], [w * post, h * 0.18]]);
      line(ctx, [[w * 0.055, h * 0.18], [w * 0.31, h * 0.18]]);
      break;
    }
    case 'scarecrow-fields-wooden-windmill': {
      const cx = w * 0.8, cy = h * 0.28, r = h * 0.105;
      polygon(ctx, [[cx - w * 0.045, h * 0.46], [cx - w * 0.03, h * 0.2], [cx + w * 0.025, h * 0.2], [cx + w * 0.042, h * 0.46]], false);
      polygon(ctx, [[cx - w * 0.04, h * 0.2], [cx - w * 0.008, h * 0.145], [cx + w * 0.035, h * 0.2]], false);
      for (let sail = 0; sail < 4; sail++) {
        const angle = a + sail * tau / 4, ux = Math.cos(angle), uy = Math.sin(angle), root = [cx + ux * r * 0.18, cy + uy * r * 0.18], end = [cx + ux * r, cy + uy * r];
        polygon(ctx, [root, end, [end[0] - uy * h * 0.019, end[1] + ux * h * 0.019], [root[0] - uy * h * 0.009, root[1] + ux * h * 0.009]], false);
        for (let cross = 1; cross < 5; cross++) { const t = cross / 5, x = root[0] + (end[0] - root[0]) * t, y = root[1] + (end[1] - root[1]) * t; line(ctx, [[x, y], [x - uy * h * (0.009 + t * 0.01), y + ux * h * (0.009 + t * 0.01)]]); }
      }
      ellipse(ctx, cx, cy, h * 0.01, h * 0.01); ctx.strokeRect(cx - w * 0.012, h * 0.39, w * 0.024, h * 0.07);
      break;
    }
    case 'time-device-descending-clock-carriage': {
      const cx = w * 0.19, cy = h * 0.35, radius = h * 0.075, refY = h * (0.16 + travel * 0.085);
      ellipse(ctx, cx, cy, radius, radius);
      gear(ctx, cx - radius * 0.75, cy + radius * 0.8, radius * 0.34, a, 8); gear(ctx, cx + radius * 0.75, cy + radius * 0.8, radius * 0.34, -a, 8);
      for (const [angle, length] of [[a, 0.8], [-a * 2, 0.55]]) line(ctx, [[cx, cy], [cx + Math.cos(angle) * radius * length, cy + Math.sin(angle) * radius * length]]);
      for (const side of [-1, 1]) line(ctx, [[cx + side * w * 0.021, h * 0.11], [cx + side * w * 0.021, refY]]);
      ctx.strokeRect(cx - w * 0.03, refY - h * 0.025, w * 0.06, h * 0.05);
      ellipse(ctx, cx, refY, h * 0.02, h * 0.02);
      line(ctx, [[cx, refY - h * 0.015], [cx, refY], [cx + h * 0.012, refY + h * 0.004]]);
      break;
    }
    default: return false;
  }
  return true;
}
