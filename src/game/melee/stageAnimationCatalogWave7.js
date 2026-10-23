// Scene functions are referenced below; every outline, scale and repeating
// maintenance cycle is authored here. These are not frames from the source work.
const scene = definition => Object.freeze({
  ...definition, animationWave: 7,
  animationProvenance: 'authored-scene-mechanism-geometry-and-timing',
  renderingKind: 'authored-mechanism', localBackdrops: Object.freeze({}),
  timeSource: 'simulation-elapsed-seconds', reducedMotionBehavior: 'freeze-at-time-zero',
  sourceVisualValidation: 'not-validated-1:1', fidelityVerified: false,
  officialSourceFrames: false, gameplayEffect: 'none'
});

export const STAGE_ANIMATION_WAVE_7 = Object.freeze([
  scene({
    id: 'payday2011-firstworldbank-security-drill', universes: ['Payday'],
    scenePattern: /first world bank.*(?:security gate|grille|drill|perceuse|2011)/i,
    excludedScenePattern: /payday\s*(?:2|3)\b|2015|remake|overdrill|thermite|vault floor|sol.*coffre|broken|cass[eé]/i,
    sourceWork: 'PAYDAY: The Heist (2011), First World Bank', sourceReference: 'https://payday.fandom.com/wiki/First_World_Bank/Walkthrough', sourceAccess: 'indexed-excerpt-only-open-failed',
    sourceScene: 'First World Bank — perceuse de la grille de sécurité, PAYDAY The Heist 2011', continuity: 'Original 2011 security gate, before thermite; excludes the PAYDAY 2 remake and Overdrill',
    mechanism: 'firstworldbank-clamped-security-drill', color: '#a5b8bc', periodSeconds: 39,
    sceneEvidence: 'The indexed walkthrough distinguishes the security-gate drill from later thermite used on the vault floor. A clamped drill with a bounded sliding feed and rotating chuck interprets that gate operation. Exact casing, feed length and repeated unloaded cycle are authored; no door opens and no heist objective progresses.'
  }),
  scene({
    id: 'payday2-goldengrin-bfd-gantry', universes: ['Payday'],
    scenePattern: /golden grin.*(?:casino|bfd|gantry|portique|2015)/i,
    excludedScenePattern: /payday\s*(?:the heist|3)\b|stealth|furtif|broken|cass[eé]|after.*breach|apr[eè]s.*per[cç]/i,
    sourceWork: 'PAYDAY 2 (2015), Golden Grin Casino, BFD', sourceReference: 'https://www.paydaythegame.com/payday2/updates/goldengrin/', sourceAccess: 'opened-official-update-text',
    sourceScene: 'Golden Grin Casino — portique BFD, PAYDAY 2 2015', continuity: 'Golden Grin loud approach with the BFD assembled, before the breach; not stealth',
    mechanism: 'goldengrin-bfd-bounded-tool-gantry', color: '#b5b1a3', periodSeconds: 47,
    sceneEvidence: 'The official DLC page explicitly names the customizable BFD. This distant gantry studies a suspended tool carriage and paired cooling rotors without claiming a source-verified cutter design. It deliberately omits a conventional screw-drill bit, drilling progress, turrets, heat, floor removal and heist effects.'
  }),
  scene({
    id: 'duke1996-hollywood-projection', universes: ['Duke Nukem'],
    scenePattern: /hollywood holocaust.*(?:cinema|cin[eé]ma|project|1996)/i,
    excludedScenePattern: /duke\s*(?:nukem\s*)?64\b|dn64|forever|world tour|2016|destroyed|d[eé]truit/i,
    sourceWork: 'Duke Nukem 3D (1996 DOS), Hollywood Holocaust projector room', sourceReference: 'https://infosuite.duke4.net/index.php?page=e1l1', sourceAccess: 'opened-level-guide-text',
    sourceScene: 'Hollywood Holocaust — cabine de projection du cinéma, Duke Nukem 3D DOS 1996', continuity: 'Original DOS cinema projection booth, intact; no Duke Nukem 64 or World Tour layout',
    mechanism: 'hollywood-projector-reels-and-shutter', color: '#b8ab96', periodSeconds: 34,
    sceneEvidence: 'The level guide identifies the projection room and movie projector. Unequal take-up reels, film guides and a shutter rotate on fixed axles in this authored study. Film content and the screen are omitted; no source image, switch event, weapon pickup or destructible screen is reproduced.'
  }),
  scene({
    id: 'duke1996-rabidtransit-metro', universes: ['Duke Nukem'],
    scenePattern: /rabid transit.*(?:train|metro|m[eé]tro|station|1996)/i,
    excludedScenePattern: /duke\s*(?:nukem\s*)?64\b|dn64|forever|world tour|2016|derail|d[eé]raill|destroyed|d[eé]truit/i,
    sourceWork: 'Duke Nukem 3D (1996 DOS), Rabid Transit', sourceReference: 'https://www.frag-net.com/past/www.3drealms.com/duke3d/walkthrough/e3m7.html', sourceAccess: 'opened-archived-official-guide',
    sourceScene: 'Rabid Transit — train du métro entre les stations, Duke Nukem 3D DOS 1996', continuity: 'Original DOS Rabid Transit train; level numbering varies in the archived guide so none is asserted',
    mechanism: 'rabidtransit-metro-two-bogie-car', color: '#aab6ba', periodSeconds: 61,
    sceneEvidence: 'The archived 3D Realms guide describes the train and subway stations. A closed distant rail circuit carries an empty two-bogie car with wheel rotations tied to travel. Track shape and car proportions are authored rather than a copied map; the train cannot be ridden or hit an actor.'
  }),
  scene({
    id: 'wolf2001-tramride-cablecar', universes: ['Wolfenstein'],
    scenePattern: /(?:tram ride|trajet.*tram).*(?:cable|c[aâ]ble|t[eé]l[eé]ph[eé]rique|2001)/i,
    excludedScenePattern: /new order|new colossus|old blood|tides of war|2003|destroyed|d[eé]truit|power out|hors tension/i,
    sourceWork: 'Return to Castle Wolfenstein (2001 PC), Tram Ride', sourceReference: 'https://www.it-he.org/rtcw.php', sourceAccess: 'opened-level-account-text',
    sourceScene: 'Tram Ride — cabine et poulies du téléphérique, Return to Castle Wolfenstein PC 2001', continuity: 'Original PC mission with working pulley mechanism, before the cable car is damaged',
    mechanism: 'tramride-cablecar-fixed-span', color: '#aeb6ac', periodSeconds: 58,
    sceneEvidence: 'The opened level account describes activating a pulley mechanism and calling the cable car between stations. The empty carriage follows a fixed sloping cable and retains a vertical suspension. Wheel size, cabin geometry and smooth return cycle are authored; it carries no actors and changes no route or power state.'
  }),
  scene({
    id: 'wolf2014-eisenwald-cellblock-lift', universes: ['Wolfenstein'],
    scenePattern: /eisenwald.*(?:prison|cell|ascenseur|elevator|2014)/i,
    excludedScenePattern: /return to castle|old blood|new colossus|youngblood|destroyed|d[eé]truit|power out|hors tension/i,
    sourceWork: 'Wolfenstein: The New Order (2014), Eisenwald Prison cell block', sourceReference: 'https://primagames.com/news/wolfenstein-new-order-walkthrough-eisenwald-prison-find-key-coal-loader-room', sourceAccess: 'opened-walkthrough-text',
    sourceScene: 'Eisenwald Prison — ascenseur du bloc de cellules, The New Order 2014', continuity: '2014 main-game chapter 4 cell-block elevator before escape; not the coal loader itself',
    mechanism: 'eisenwald-caged-lift-and-drum', color: '#a8ada9', periodSeconds: 53,
    sceneEvidence: 'The guide specifically takes the cell-block elevator upward before entering cell B2. A caged empty lift, winding drum and opposing counterweight interpret that transport. Cage dimensions and shaft arrangement are authored; no door, alarm, prison population, escape flag or player elevation changes.'
  }),
  scene({
    id: 'poppy1-makeafriend-assembly', universes: ['Poppy Playtime'],
    scenePattern: /(?:make.a.friend|fabriq.*ami).*(?:chapter.?1|chapitre.?1|2021|assembl|convoyeur|conveyor)/i,
    excludedScenePattern: /chapter.?[2-6]|chapitre.?[2-6]|project[\s:.-]*playtime|escape trials|destroyed|d[eé]truit|power out|hors tension/i,
    sourceWork: 'Poppy Playtime, Chapter 1: A Tight Squeeze (2021), Make-A-Friend', sourceReference: 'https://www.pockettactics.com/poppy-playtime/chapter-1', sourceAccess: 'opened-walkthrough-text',
    sourceScene: 'Make-A-Friend — trois distributeurs et convoyeur d’assemblage, chapitre 1 2021', continuity: 'Chapter 1 after restoring the machine power, before the chase; no later chapter machine',
    mechanism: 'makeafriend-three-hopper-conveyor', color: '#b0bca1', periodSeconds: 46,
    sceneEvidence: 'The walkthrough describes powering the console and pulling three levers to assemble a toy. Three hoppers with linked lever arms feed blank nonliving parts above an empty conveyor. Parts, proportions and repeat are authored; no toy character, inventory reward, door unlock or chase is triggered.'
  }),
  scene({
    id: 'poppy2-gamestation-train-controls', universes: ['Poppy Playtime'],
    scenePattern: /game station.*(?:train|levier|lever|chapter.?2|chapitre.?2|2022)/i,
    excludedScenePattern: /chapter.?[13456]|chapitre.?[13456]|project[\s:.-]*playtime|playcare|derail|d[eé]raill|after.*crash|apr[eè]s.*accident/i,
    sourceWork: 'Poppy Playtime, Chapter 2: Fly in a Web (2022), Game Station', sourceReference: 'https://holdtoreset.com/poppy-playtime-chapter-2-guide-game-station-musical-memory/', sourceAccess: 'opened-walkthrough-text',
    sourceScene: 'Game Station — pupitre à levier et train à quai, chapitre 2 2022', continuity: 'Chapter 2 Game Station before departure and derailment, not the Project: Playtime train',
    mechanism: 'gamestation-lever-and-access-shutter', color: '#bda69a', periodSeconds: 49,
    sceneEvidence: 'The guide identifies a lever on the train platform that opens access to Musical Memory. An empty train stays at the platform while that lever and an access shutter demonstrate an authored bounded maintenance motion. The door geometry and linkage are adapted; no train-code entry, minigame access, departure or crash happens.'
  }),
  scene({
    id: 'bendy1-inkmachine-clockwork', universes: ['Bendy and the Ink Machine'],
    scenePattern: /(?:moving pictures|chapitre.?1|chapter.?1).*(?:ink machine|machine.*encre|2017)/i,
    excludedScenePattern: /dark revival|dark survival|chapter.?[2-5]|chapitre.?[2-5]|2018 remaster|apr[eè]s.*inond|after.*flood|broken|cass[eé]/i,
    sourceWork: 'Bendy and the Ink Machine, Chapter 1: Moving Pictures (2017)', sourceReference: 'https://en.wikipedia.org/wiki/Bendy_and_the_Ink_Machine', sourceAccess: 'opened-plot-and-release-text',
    sourceScene: 'Moving Pictures — machine à encre remise en marche, chapitre 1 2017', continuity: 'Original 2017 chapter 1 working machine before flooding, not the 2018 remastered room',
    mechanism: 'movingpictures-ink-machine-pump', color: '#c4b57e', periodSeconds: 44,
    sceneEvidence: 'The plot account establishes repairing and activating the Ink Machine before flooding; its release history distinguishes the first chapter. A guided piston, crank and bounded liquid indicator interpret that function. Their layout and continuous empty running cycle are authored; no ink flood, monster or gameplay trigger is added.'
  }),
  scene({
    id: 'bendy3-heavenlytoys-geared-belt', universes: ['Bendy and the Ink Machine'],
    scenePattern: /(?:heavenly toys|toy machine room|production room).*(?:belt|gears|engrenage|convoyeur|chapter.?3|chapitre.?3|2017)/i,
    excludedScenePattern: /dark revival|dark survival|chapter.?[1245]|chapitre.?[1245]|jammed|bloqu[eé]|broken|cass[eé]|power out|hors tension/i,
    sourceWork: 'Bendy and the Ink Machine, Chapter 3: Rise and Fall (2017), Toy Machine Room', sourceReference: 'https://bendy.fandom.com/wiki/Toy_Machine_Room', sourceAccess: 'indexed-excerpt-only-open-failed',
    sourceScene: 'Heavenly Toys — engrenages et convoyeur de la Toy Machine Room, chapitre 3 2017', continuity: 'Chapter 3 toy production room after its gears are unclogged and belts powered',
    mechanism: 'heavenlytoys-meshed-gears-and-belt', color: '#baa97b', periodSeconds: 38,
    sceneEvidence: 'The indexed room entry describes powering the belts and removing objects from gears to unclog them; full opening failed. Two externally meshed equal gears turn oppositely and drive a blank belt. Shape, tooth count and safe repeat are authored; no mission objects are removed, generated or granted.'
  }),
  scene({
    id: 'atomic-vavilov-algae-cart', universes: ['Atomic Heart'],
    scenePattern: /(?:vavilov|vavillov|algae workshop|atelier.*algue).*(?:cart|chariot|motor|moteur|2023)/i,
    excludedScenePattern: /annihilation instinct|trapped in limbo|enchanted|neptune|destroyed|d[eé]truit|power out|hors tension/i,
    sourceWork: 'Atomic Heart (2023), Vavilov Complex Algae Workshop', sourceReference: 'https://gameranx.com/features/id/442739/article/atomic-heart-how-to-get-the-hot-workshop-algae-workshop-canisters-in-an-overgrown-park-mission-guide/', sourceAccess: 'opened-walkthrough-text',
    sourceScene: 'Vavilov — atelier des algues, chariot circulant devant cinq moteurs, Atomic Heart 2023', continuity: 'Base-game Algae Workshop after restarting its platform, no DLC location',
    mechanism: 'vavilov-algae-five-motor-cart', color: '#a5bcab', periodSeconds: 67,
    sceneEvidence: 'The guide specifies riding a cart around the pool and charging five motors, with the cart returning if missed. An empty carriage and five bounded motor shafts interpret that machinery. Their rail path and rotation are authored; no Shok, polymer filling, enemy spawn or canister progression occurs.'
  }),
  scene({
    id: 'atomic-vdnh-magnet-platforms', universes: ['Atomic Heart'],
    scenePattern: /(?:vdnh|exhibition|exposition).*(?:mirror|miroir|magnet|aimant|2023)/i,
    excludedScenePattern: /annihilation instinct|trapped in limbo|enchanted|neptune|destroyed|d[eé]truit|power out|hors tension/i,
    sourceWork: 'Atomic Heart (2023), A Glass, Darkly, exhibition mirror basement', sourceReference: 'https://guided.news/en/guides/atomic-heart-how-to-solve-the-exhibition-mirror-puzzle/', sourceAccess: 'opened-walkthrough-text',
    sourceScene: 'VDNH exhibition — sous-sol du miroir, aimants de plafond et plateformes, Atomic Heart 2023', continuity: 'Base-game exhibition entrance magnetic rooms before the mirror opens, no DLC puzzle',
    mechanism: 'vdnh-opposed-magnetic-platform-racks', color: '#9fb7c8', periodSeconds: 55,
    sceneEvidence: 'The walkthrough describes ceiling magnet reversals moving red and blue platforms below the entrance mirror. Two empty racks move in opposition beneath fixed magnet housings; rack dimensions, support rods and timing are authored. Magnetic forces, puzzles, mirror state and traversable platforms are unchanged.'
  }),
  scene({
    id: 'hzd2017-meridian-elevators', universes: ['Horizon Zero Dawn'],
    scenePattern: /meridian.*(?:elevator|ascenseur|lift|2017)/i,
    excludedScenePattern: /forbidden west|remaster|2024|battle.*alight|bataille|collapsed|effondr|after.*attack|apr[eè]s.*attaque/i,
    sourceWork: 'Horizon Zero Dawn (2017), Meridian southeastern elevators', sourceReference: 'https://www.neoseeker.com/horizon-zero-dawn/walkthrough/The_City_of_the_Sun', sourceAccess: 'indexed-excerpt-only-open-forbidden',
    sourceScene: 'Meridian — paire d’ascenseurs vers la ville basse, Horizon Zero Dawn 2017', continuity: 'Original game Meridian before the final attack; excludes collapsed/rebuilding elevators and remaster',
    mechanism: 'meridian-twin-mesa-lifts', color: '#b6a780', periodSeconds: 73,
    sceneEvidence: 'The indexed walkthrough identifies a pair of large elevators on the southeastern mesa; full opening returned 403. Paired empty cages move within separate fixed guides and each has a constant-sum counterweight rope. Exact architecture and timing are authored; no actor is lifted and no city route changes.'
  }),
  scene({
    id: 'hzd2017-sigma-hover-conveyor', universes: ['Horizon Zero Dawn'],
    scenePattern: /(?:cauldron|creuset).*sigma.*(?:conveyor|assembly|convoyeur|assemblage|2017)/i,
    excludedScenePattern: /forbidden west|remaster|2024|cauldron.*(?:rho|xi|zeta)|creuset.*(?:rho|xi|zeta)|disabled|arr[eê]t[eé]/i,
    sourceWork: 'Horizon Zero Dawn (2017), Cauldron SIGMA hovering assembly line', sourceReference: 'https://www.gamerguides.com/horizon-zero-dawn/guide/walkthrough/seeking-mothers-crown/cauldron-sigma/into-the-cauldron', sourceAccess: 'opened-walkthrough-text',
    sourceScene: 'Cauldron SIGMA — chaîne d’assemblage flottante et barres suspendues, Horizon Zero Dawn 2017', continuity: 'Original SIGMA chamber hovering freight, not RHO turbines or another cauldron',
    mechanism: 'sigma-hover-freight-underbar-loop', color: '#93b9bf', periodSeconds: 63,
    sceneEvidence: 'The guide describes hovering devices and crates with bars underneath that Aloy can grab while they travel. Empty triangular carriers with fixed underbars follow an authored oval transport path. The route, scale and repeat are adapted; no grab anchor, machine enemy, cover vent or playable freight is created.'
  }),
  scene({
    id: 'scp914-cell109b-clockworks', universes: ['SCP Foundation'],
    scenePattern: /scp.?914.*(?:109.?b|clockwork|horlog|contain|cell|confin)/i,
    excludedScenePattern: /secret laboratory|containment breach|site.?02|roleplay|scp.?294|broken|cass[eé]/i,
    sourceWork: 'SCP-914 by Dr Gears, SCP Wiki primary article, research cell 109-B', sourceReference: 'https://scp-wiki.wikidot.com/scp-914', sourceAccess: 'opened-primary-article-text',
    sourceScene: 'SCP-914 — cellule de recherche 109-B, cabines et horlogerie', continuity: 'Primary SCP-914 article, research cell 109-B; no game-specific Site-02 or Site-19 layout asserted',
    mechanism: 'scp914-empty-booths-mainspring', color: '#b6a789', periodSeconds: 79,
    sceneEvidence: 'Dr Gears’ CC BY-SA primary article specifies two booths linked by copper tubes, sliding doors, gears, a selection knob and mainspring key. Empty booth shutters and a winding key form an authored maintenance study. No refinement, item, anomalous output or claimed five-to-ten-minute operating sequence is simulated.'
  }),
  scene({
    id: 'scp294-secondfloor-dispenser', universes: ['SCP Foundation'],
    scenePattern: /scp.?294.*(?:break room|salle.*pause|second floor|2nd floor|deuxi[eè]me|distribut)/i,
    excludedScenePattern: /secret laboratory|containment breach|site.?02|roleplay|scp.?914|blood|sang|acid|acide|broken|cass[eé]/i,
    sourceWork: 'SCP-294 by Arcibi, SCP Wiki primary article, second-floor personnel break room', sourceReference: 'https://scp-wiki.wikidot.com/scp-294', sourceAccess: 'opened-primary-article-text',
    sourceScene: 'SCP-294 — distributeur de la salle de pause du deuxième étage', continuity: 'Primary article break room, no game-specific cafeteria or facility number asserted',
    mechanism: 'scp294-paper-cup-dispenser', color: '#a2b7b7', periodSeconds: 57,
    sceneEvidence: 'Arcibi’s CC BY-SA primary article places the vending machine in the second-floor personnel break room and specifies QWERTY keys, a coin slot and a paper cup. A bounded cup feeder and plain water line are authored decorative interpretations; no anomalous retrieval, cost, drink, healing or inventory effect is produced.'
  }),
  scene({
    id: 'hellraiser1987-attic-lament-panels', universes: ['Hellraiser'],
    scenePattern: /(?:attic|grenier).*(?:lament|configuration|puzzle|bo[iî]te|1987)/i,
    excludedScenePattern: /2022|bloodline|minos|hellbound|1988|judgment|inferno|after.*destroy|apr[eè]s.*destr/i,
    sourceWork: 'Hellraiser (1987), Frank’s attic and the Lament Configuration', sourceReference: 'https://www.slashfilm.com/1038052/hellraiser-the-history-and-lore-of-the-lament-configuration-explained/', sourceAccess: 'opened-film-prop-account',
    sourceScene: 'Grenier — panneaux coulissants de la Lament Configuration, Hellraiser 1987', continuity: 'Original 1987 film puzzle box before opening; excludes the 2022 mechanism and later configurations',
    mechanism: 'attic-lament-interlocking-cube-panels', color: '#bca275', periodSeconds: 69,
    sceneEvidence: 'The film-prop account explains sliding and rotating the box panels and discusses the original 1987 film. A small empty cube outline separates three interlocking panels and returns them along fixed guides. Ornament, projection and repeat are authored; it opens no portal and summons no character or chains.'
  }),
  scene({
    id: 'hellbound1988-labyrinth-leviathan', universes: ['Hellraiser'],
    scenePattern: /(?:labyrinth|labyrinthe).*(?:leviathan|l[eé]viathan|hellbound|1988)/i,
    excludedScenePattern: /2022|bloodline|minos|1987|judgment|inferno|dormant|cube.*ferm|closed.*cube/i,
    sourceWork: 'Hellbound: Hellraiser II (1988), Leviathan above the Labyrinth', sourceReference: 'https://hellraiser.fandom.com/wiki/Leviathan', sourceAccess: 'indexed-excerpt-only-open-failed',
    sourceScene: 'Labyrinthe — Léviathan en rotation, Hellbound Hellraiser II 1988', continuity: '1988 film suspended rotating form before it reverts; not the 2022 reboot',
    mechanism: 'labyrinth-leviathan-suspended-rhombus', color: '#aaa8b7', periodSeconds: 83,
    sceneEvidence: 'The indexed entry describes Leviathan as a massive rotating rhombus above the labyrinth; full opening failed. A projected faceted lozenge rotates over a distant maze outline. Facets, perspective and period are authored; its source beams, realm control, characters and puzzle transformations are not applied.'
  }),
  scene({
    id: 'ut99-conveyor-smelter-belt', universes: ['Unreal Tournament'],
    scenePattern: /dm.?conveyor.*(?:1999|ut99|smelt|fonderie|belt|convoyeur)/i,
    excludedScenePattern: /ut\s*(?:2003|2004|3|4)\b|unreal tournament\s*(?:2003|2004|3|4)\b|custom|remake|2018|stopped|arr[eê]t[eé]/i,
    sourceWork: 'Unreal Tournament (1999), DM-Conveyor by Shane Caudle', sourceReference: 'https://unrealarchive.org/wikis/the-liandri-archives/DM-Conveyor.html', sourceAccess: 'opened-archived-map-description',
    sourceScene: 'DM-Conveyor — convoyeur de la fonderie, Unreal Tournament UT99 1999', continuity: 'Stock original Unreal Tournament map, not a later remake or workshop layout',
    mechanism: 'conveyor-smelter-stepped-roller-belt', color: '#b7a18b', periodSeconds: 41,
    sceneEvidence: 'The archived Liandri map description identifies an industrial smelter and its namesake conveyor belt. A three-level roller belt follows an authored closed path beside unheated vessel outlines. Belt count and route are adapted; no molten material, moving floor, pickups or map damage is added.'
  }),
  scene({
    id: 'ut99-pressure-empty-chamber', universes: ['Unreal Tournament'],
    scenePattern: /dm.?pressure.*(?:1999|ut99|chamber|chambre|pressure|pression)/i,
    excludedScenePattern: /ut\s*(?:2003|2004|3|4)\b|unreal tournament\s*(?:2003|2004|3|4)\b|custom|remake|occupied|occup[eé]|victim|victime/i,
    sourceWork: 'Unreal Tournament (1999), DM-Pressure empty pressure chamber', sourceReference: 'https://unrealarchive.org/wikis/the-liandri-archives/DM-Pressure.html', sourceAccess: 'opened-archived-map-description',
    sourceScene: 'DM-Pressure — chambre de pression vide, Unreal Tournament UT99 1999', continuity: 'Stock original UT map, unoccupied chamber exterior; source trap gameplay is excluded',
    mechanism: 'pressure-chamber-empty-sliding-seals', color: '#a8b5aa', periodSeconds: 59,
    sceneEvidence: 'The archived map entry identifies a central pressure chamber and lateral buttons that close it. Only empty exterior seal panels and a bounded gauge move here. Internal pressure, occupants, rewards and the source trap timer are omitted; outline and maintenance timing are authored without a damage or collision volume.'
  }),
  scene({
    id: 'crash1996-heavymachinery-drop-platforms', universes: ['Crash Bandicoot'],
    scenePattern: /heavy machinery.*(?:platform|plateforme|1996|drop|chute)/i,
    excludedScenePattern: /n.?sane|2017|crash\s*(?:2|3|4)\b|flashback|2020|destroyed|d[eé]truit/i,
    sourceWork: 'Crash Bandicoot (1996 PlayStation), Heavy Machinery', sourceReference: 'https://en.wikipedia.org/wiki/Crash_Bandicoot_(video_game)', sourceAccess: 'opened-development-account',
    sourceScene: 'Heavy Machinery — plateformes mécaniques de l’usine, Crash Bandicoot PlayStation 1996', continuity: 'Original 1996 game machinery room; excludes N. Sane Trilogy and Crash 4 flashbacks',
    mechanism: 'heavymachinery-guided-drop-platforms', color: '#b6a18a', periodSeconds: 43,
    sceneEvidence: 'The development account names Heavy Machinery and its drop platforms and heated-pipe setting. Three empty platforms cycle on authored short vertical guides above fixed unheated pipes. Exact positions, return drives and timing are adapted; no collapsing playable surface, heat, bounce or collision is implemented.'
  }),
  scene({
    id: 'crash1996-castlemachinery-lift-loop', universes: ['Crash Bandicoot'],
    scenePattern: /castle machinery.*(?:platform|plateforme|lift|ascenseur|1996)/i,
    excludedScenePattern: /n.?sane|2017|crash\s*(?:2|3|4)\b|flashback|2020|green gem|gemme verte|destroyed|d[eé]truit/i,
    sourceWork: 'Crash Bandicoot (1996 PlayStation), Castle Machinery ordinary platform route', sourceReference: 'https://gamefaqs.gamespot.com/ps/196986-crash-bandicoot/faqs/48030', sourceAccess: 'opened-original-game-walkthrough',
    sourceScene: 'Castle Machinery — circuit des plateformes élévatrices ordinaires, Crash Bandicoot 1996', continuity: 'Original ordinary moving-platform route, not the green-gem shortcut or remake',
    mechanism: 'castlemachinery-alternating-vertical-carriers', color: '#b8aa7c', periodSeconds: 51,
    sceneEvidence: 'The original-game walkthrough describes taking moving platforms upward between pipes. Alternating empty carriers remain within two vertical guides with opposite crank drives. Their transmission and repeat are authored, not the speedrun cycle; no gem path, life pickup or playable lift is created.'
  }),
  scene({
    id: 'spyro2-hurricos-windmill-drive', universes: ['Spyro'],
    scenePattern: /hurricos.*(?:windmill|moulin|factory|usine|1999)/i,
    excludedScenePattern: /reignited|2018|skylanders|legend of spyro|destroyed|d[eé]truit|stopped|arr[eê]t[eé]|after.*shutdown/i,
    sourceWork: 'Spyro 2: Ripto’s Rage! / Gateway to Glimmer (1999), Hurricos', sourceReference: 'https://www.darkspyro.net/glimmer/summer/?page=1', sourceAccess: 'opened-original-game-walkthrough',
    sourceScene: 'Hurricos — grandes roues de moulin de l’usine, Spyro 2 PlayStation 1999', continuity: 'Original 1999 Hurricos working factory before shutdown, not Reignited or Skylanders',
    mechanism: 'hurricos-opposed-windmill-wheels', color: '#b9b58f', periodSeconds: 62,
    sceneEvidence: 'The walkthrough describes slowing large rotating factory structures with buttons and gliding across windmill mechanisms. Two spoked factory wheels rotate on fixed axles in an authored distant study. Blade count and spacing are adapted; no electricity theft, button objective or rotating playable platform is reproduced.'
  }),
  scene({
    id: 'spyro2-aquaria-moneybags-submarine', universes: ['Spyro'],
    scenePattern: /aquaria towers.*(?:moneybags|submarine|sous.marin|1999)/i,
    excludedScenePattern: /reignited|2018|skylanders|legend of spyro|destroyed|d[eé]truit|drained|ass[eé]ch/i,
    sourceWork: 'Spyro 2: Ripto’s Rage! / Gateway to Glimmer (1999), Aquaria Towers, Moneybags submarine', sourceReference: 'https://www.darkspyro.net/glimmer/summer/?page=1', sourceAccess: 'opened-original-game-walkthrough',
    sourceScene: 'Aquaria Towers — petit sous-marin de Moneybags dans le bassin, Spyro 2 PlayStation 1999', continuity: 'Original flooded 1999 Aquaria Towers submarine route, not Reignited or another Spyro continuity',
    mechanism: 'aquaria-moneybags-submarine-screw', color: '#a5beb0', periodSeconds: 71,
    sceneEvidence: 'The walkthrough explicitly describes paying Moneybags to use his submarine to bypass metal sharks. A tiny empty rounded craft follows a bounded tank route with a turning rear screw. Shape, scale and movement loop are authored; no sharks, passengers, payment, water-level change or travel action occurs.'
  })
]);

export const WAVE_7_MODE_REFERENCE_SCENES = Object.freeze(Object.fromEntries(
  Array.from({ length: 12 }, (_, index) => {
    const [a, b] = STAGE_ANIMATION_WAVE_7.slice(index * 2, index * 2 + 2);
    return [a.universes[0], Object.freeze({ Combat: a.sourceScene, Melee: b.sourceScene, RPG: a.sourceScene, Tactics: b.sourceScene })];
  })
));

const TAU = Math.PI * 2;
const line = (ctx, points) => { ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); };
const polygon = (ctx, points) => { ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.stroke(); };
const ellipse = (ctx, x, y, rx, ry, rotation = 0) => { ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), rotation, 0, TAU); ctx.stroke(); };
const polar = (x, y, r, a) => [x + r * Math.cos(a), y + r * Math.sin(a)];
const wheel = (ctx, x, y, r, angle, spokes = 6) => {
  ellipse(ctx, x, y, r, r);
  for (let n = 0; n < spokes; n++) line(ctx, [[x, y], polar(x, y, r, angle + TAU * n / spokes)]);
};
const box = (ctx, x, y, w, h) => ctx.strokeRect(x, y, w, h);
const rail = (ctx, x1, y1, x2, y2, gap) => {
  const dx = x1 === x2 ? gap : 0, dy = x1 === x2 ? 0 : gap;
  line(ctx, [[x1, y1], [x2, y2]]); line(ctx, [[x1 + dx, y1 + dy], [x2 + dx, y2 + dy]]);
};

// Keypoints returned here are the very coordinates consumed below, not a
// parallel simulation. This permits tests of ropes, cable position and cranks.
export function getStageAnimationWave7Geometry(mechanism, progress, width, height) {
  const a = progress * TAU, w = width, h = height, unit = Math.min(w, h);
  if (mechanism === 'tramride-cablecar-fixed-span') {
    const start = [w * 0.22, h * 0.21], end = [w * 0.77, h * 0.31], t = (1 - Math.cos(a)) / 2;
    const pulley = [start[0] + (end[0] - start[0]) * t, start[1] + (end[1] - start[1]) * t];
    return { start, end, pulley, cage: [pulley[0], pulley[1] + unit * 0.09], suspension: unit * 0.09, t };
  }
  if (mechanism === 'eisenwald-caged-lift-and-drum' || mechanism === 'meridian-twin-mesa-lifts') {
    return { lifts: Array.from({ length: mechanism === 'meridian-twin-mesa-lifts' ? 2 : 1 }, (_, i) => {
      const x = w * (mechanism === 'meridian-twin-mesa-lifts' ? 0.38 + i * 0.23 : 0.49);
      const y = h * (0.25 + 0.13 * (1 - Math.cos(a + i * Math.PI)) / 2);
      return { cage: [x, y], counterweight: [x + unit * 0.16, h * 0.63 - y], top: h * 0.15, sum: h * 0.63 };
    }) };
  }
  if (mechanism === 'movingpictures-ink-machine-pump' || mechanism === 'firstworldbank-clamped-security-drill') {
    const root = [w * 0.46, h * 0.34], radius = unit * 0.045, length = unit * 0.15;
    const crank = polar(root[0], root[1], radius, a);
    const slider = [root[0] + radius * Math.cos(a) + Math.sqrt(length * length - (crank[1] - root[1]) ** 2), root[1]];
    return { root, crank, slider, length, radius };
  }
  if (mechanism === 'hurricos-opposed-windmill-wheels') {
    return { wheels: [0, 1].map(i => ({ center: [w * (0.4 + i * 0.23), h * 0.32], radius: unit * (i ? 0.095 : 0.13), ends: Array.from({ length: i ? 5 : 7 }, (_, n) => polar(w * (0.4 + i * 0.23), h * 0.32, unit * (i ? 0.095 : 0.13), (i ? -a : a) + n * TAU / (i ? 5 : 7))) })) };
  }
  return null;
}

export function drawStageAnimationWave7(ctx, animation, frame, w, h) {
  const a = frame.phase, t = frame.progress, u = Math.min(w, h), c = Math.cos(a), s = Math.sin(a);
  ctx.globalAlpha = 0.16;
  switch (animation.mechanism) {
    case 'firstworldbank-clamped-security-drill': {
      for (let i = 0; i < 7; i++) line(ctx, [[w * (0.59 + i * 0.018), h * 0.18], [w * (0.59 + i * 0.018), h * 0.49]]);
      rail(ctx, w * 0.38, h * 0.4, w * 0.66, h * 0.4, u * 0.015);
      const g = getStageAnimationWave7Geometry(animation.mechanism, t, w, h);
      wheel(ctx, ...g.root, g.radius, a, 5); line(ctx, [g.crank, g.slider]);
      box(ctx, g.slider[0] - u * 0.025, g.slider[1] - u * 0.03, u * 0.07, u * 0.06);
      line(ctx, [g.slider, [w * 0.65, g.slider[1]]]); ellipse(ctx, w * 0.63, g.slider[1], u * 0.008, u * (0.012 + 0.006 * c));
      line(ctx, [[w * 0.39, h * 0.23], [w * 0.39, h * 0.47], [w * 0.64, h * 0.47]]); break;
    }
    case 'goldengrin-bfd-bounded-tool-gantry': {
      box(ctx, w * 0.35, h * 0.18, w * 0.34, h * 0.31); rail(ctx, w * 0.37, h * 0.24, w * 0.67, h * 0.24, u * 0.025);
      const x = w * 0.5 + u * 0.045 * s; box(ctx, x - u * 0.055, h * 0.25, u * 0.11, u * 0.075);
      polygon(ctx, [[x - u * 0.018, h * 0.25 + u * 0.075], [x + u * 0.018, h * 0.25 + u * 0.075], [x + u * 0.009, h * 0.45], [x - u * 0.009, h * 0.45]]);
      wheel(ctx, w * 0.4, h * 0.38, u * 0.035, a, 5); wheel(ctx, w * 0.64, h * 0.38, u * 0.035, -a, 5);
      ellipse(ctx, w * 0.52, h * 0.49, u * 0.12, u * 0.018); break;
    }
    case 'hollywood-projector-reels-and-shutter': {
      box(ctx, w * 0.45, h * 0.3, u * 0.16, u * 0.13);
      wheel(ctx, w * 0.45, h * 0.255, u * 0.06, a, 5); wheel(ctx, w * 0.45 + u * 0.14, h * 0.255, u * 0.044, -a * 2, 4);
      line(ctx, [[w * 0.45, h * 0.255 + u * 0.06], [w * 0.45 + u * 0.045, h * 0.38], [w * 0.45 + u * 0.14, h * 0.255 + u * 0.044]]);
      wheel(ctx, w * 0.45 + u * 0.08, h * 0.35, u * 0.026, a * 3, 3);
      box(ctx, w * 0.45 + u * 0.16, h * 0.33, u * 0.05, u * 0.04); line(ctx, [[w * 0.45 + u * 0.08, h * 0.3 + u * 0.13], [w * 0.45 + u * 0.08, h * 0.5]]); break;
    }
    case 'rabidtransit-metro-two-bogie-car': {
      ellipse(ctx, w * 0.5, h * 0.35, w * 0.31, h * 0.095); ellipse(ctx, w * 0.5, h * 0.35, w * 0.31, h * 0.095 + u * 0.014);
      const x = w * 0.5 + w * 0.28 * c, y = h * 0.35 + h * 0.085 * s;
      box(ctx, x - u * 0.13, y - u * 0.065, u * 0.26, u * 0.065);
      for (let i = 0; i < 4; i++) box(ctx, x - u * 0.105 + i * u * 0.055, y - u * 0.054, u * 0.035, u * 0.027);
      for (const offset of [-0.085, 0.085]) { wheel(ctx, x + u * offset, y + u * 0.012, u * 0.018, a * 4, 3); } break;
    }
    case 'tramride-cablecar-fixed-span': {
      const g = getStageAnimationWave7Geometry(animation.mechanism, t, w, h);
      line(ctx, [g.start, g.end]); line(ctx, [[g.start[0], h * 0.49], g.start, [g.start[0] - u * 0.05, g.start[1]]]); line(ctx, [g.end, [g.end[0], h * 0.49]]);
      wheel(ctx, ...g.pulley, u * 0.018, a, 4); line(ctx, [g.pulley, g.cage]);
      box(ctx, g.cage[0] - u * 0.065, g.cage[1], u * 0.13, u * 0.075);
      for (const dx of [-0.038, 0, 0.038]) box(ctx, g.cage[0] + u * dx - u * 0.014, g.cage[1] + u * 0.012, u * 0.028, u * 0.03); break;
    }
    case 'eisenwald-caged-lift-and-drum':
    case 'meridian-twin-mesa-lifts': {
      const g = getStageAnimationWave7Geometry(animation.mechanism, t, w, h), meridian = animation.mechanism.startsWith('meridian');
      for (const { cage, counterweight, top } of g.lifts) {
        const [x, y] = cage, r = u * 0.16 / 2;
        rail(ctx, x - u * 0.055, top, x - u * 0.055, h * 0.5, u * 0.11);
        line(ctx, [cage, [x, top], [counterweight[0], top], counterweight]);
        ellipse(ctx, x + r, top, r, u * 0.018); wheel(ctx, x + r, top, u * 0.022, a, 5);
        box(ctx, x - u * 0.045, y, u * 0.09, u * (meridian ? 0.075 : 0.09));
        box(ctx, counterweight[0] - u * 0.016, counterweight[1], u * 0.032, u * 0.045);
        for (let i = 1; i <= (meridian ? 2 : 4); i++) line(ctx, [[x - u * 0.045 + u * 0.09 * i / (meridian ? 3 : 5), y], [x - u * 0.045 + u * 0.09 * i / (meridian ? 3 : 5), y + u * (meridian ? 0.075 : 0.09)]]);
      } break;
    }
    case 'makeafriend-three-hopper-conveyor': {
      rail(ctx, w * 0.31, h * 0.43, w * 0.72, h * 0.43, u * 0.025);
      for (let i = 0; i < 3; i++) {
        const x = w * (0.37 + i * 0.12), lift = u * 0.018 * Math.sin(a + i * TAU / 3);
        polygon(ctx, [[x - u * 0.05, h * 0.2], [x + u * 0.05, h * 0.2], [x + u * 0.018, h * 0.31], [x - u * 0.018, h * 0.31]]);
        line(ctx, [[x, h * 0.31], [x, h * 0.35 + lift], [x + u * 0.035, h * 0.36 + lift]]);
        const phase = (t + i / 3) % 1; ellipse(ctx, w * 0.33 + phase * w * 0.37, h * 0.415, u * 0.015, u * 0.011);
      }
      for (let i = 0; i < 9; i++) wheel(ctx, w * (0.33 + i * 0.046), h * 0.455, u * 0.015, a * 2, 3); break;
    }
    case 'gamestation-lever-and-access-shutter': {
      box(ctx, w * 0.34, h * 0.3, u * 0.18, u * 0.11); const pivot = [w * 0.34 + u * 0.09, h * 0.3], tip = polar(...pivot, u * 0.075, -Math.PI / 2 + 0.35 * s);
      line(ctx, [pivot, tip]); ellipse(ctx, ...tip, u * 0.009, u * 0.009);
      rail(ctx, w * 0.57, h * 0.45, w * 0.79, h * 0.45, u * 0.014);
      box(ctx, w * 0.46, h * 0.17, u * 0.08, h * 0.21);
      box(ctx, w * 0.46 + u * 0.008, h * 0.175, u * 0.064, h * (0.08 + 0.11 * (1 + c) / 2));
      line(ctx, [[pivot[0], h * 0.3], [w * 0.46 + u * 0.04, h * 0.155], [w * 0.46 + u * 0.04, h * 0.175]]);
      box(ctx, w * 0.6, h * 0.31, u * 0.2, u * 0.085); box(ctx, w * 0.6 + u * 0.025, h * 0.285, u * 0.075, u * 0.055);
      for (const dx of [0.04, 0.15]) ellipse(ctx, w * 0.6 + u * dx, h * 0.4, u * 0.019, u * 0.019); break;
    }
    case 'movingpictures-ink-machine-pump': {
      const g = getStageAnimationWave7Geometry(animation.mechanism, t, w, h);
      box(ctx, w * 0.36, h * 0.19, w * 0.29, h * 0.28); wheel(ctx, ...g.root, g.radius, a, 7); line(ctx, [g.root, g.crank, g.slider]);
      box(ctx, g.slider[0] - u * 0.012, g.slider[1] - u * 0.022, u * 0.024, u * 0.044); box(ctx, w * 0.64, h * 0.235, u * 0.024, h * 0.19);
      line(ctx, [[w * 0.64, h * (0.32 + s * 0.055)], [w * 0.64 + u * 0.024, h * (0.32 + s * 0.055)]]);
      line(ctx, [[w * 0.39, h * 0.19], [w * 0.39, h * 0.14], [w * 0.61, h * 0.14], [w * 0.61, h * 0.19]]); break;
    }
    case 'heavenlytoys-meshed-gears-and-belt': {
      const x = w * 0.49, y = h * 0.29, r = u * 0.065;
      wheel(ctx, x, y, r, a, 9); wheel(ctx, x + 2 * r, y, r, -a + Math.PI / 9, 9);
      for (let i = 0; i < 12; i++) for (const [cx, angle] of [[x, a], [x + 2 * r, -a + Math.PI / 12]]) line(ctx, [polar(cx, y, r * 0.93, angle + i * TAU / 12), polar(cx, y, r * 1.07, angle + i * TAU / 12)]);
      rail(ctx, w * 0.32, h * 0.44, w * 0.72, h * 0.44, u * 0.03);
      for (let i = 0; i < 10; i++) { const v = (i / 10 + t) % 1; line(ctx, [[w * 0.32 + v * w * 0.4, h * 0.44], [w * 0.32 + v * w * 0.4, h * 0.44 + u * 0.03]]); } break;
    }
    case 'vavilov-algae-five-motor-cart': {
      ellipse(ctx, w * 0.5, h * 0.38, w * 0.29, h * 0.075); ellipse(ctx, w * 0.5, h * 0.38, w * 0.29, h * 0.06);
      for (let i = 0; i < 5; i++) { const x = w * (0.29 + 0.105 * i); box(ctx, x - u * 0.025, h * 0.21, u * 0.05, u * 0.075); wheel(ctx, x, h * 0.235, u * 0.02, a + i * 0.4, 4); }
      const x = w * 0.5 + w * 0.29 * c, y = h * 0.38 + h * 0.075 * s;
      polygon(ctx, [[x - u * 0.065, y], [x + u * 0.065, y], [x + u * 0.045, y + u * 0.025], [x - u * 0.045, y + u * 0.025]]);
      line(ctx, [[x, y], [x, y - u * 0.055]]); break;
    }
    case 'vdnh-opposed-magnetic-platform-racks': {
      for (let i = 0; i < 2; i++) {
        const x = w * (0.4 + i * 0.22), y = h * (0.26 + 0.12 * (1 + (i ? -c : c)) / 2);
        box(ctx, x - u * 0.075, h * 0.16, u * 0.15, u * 0.04); for (const dx of [-0.05, 0, 0.05]) line(ctx, [[x + u * dx, h * 0.16 + u * 0.04], [x + u * dx, h * 0.235]]);
        for (const dx of [-0.075, 0.075]) line(ctx, [[x + u * dx, h * 0.23], [x + u * dx, h * 0.5]]);
        box(ctx, x - u * 0.065, y, u * 0.13, u * 0.025); line(ctx, [[x, y], [x, y - u * 0.06]]);
      } break;
    }
    case 'sigma-hover-freight-underbar-loop': {
      ellipse(ctx, w * 0.51, h * 0.3, w * 0.3, h * 0.065);
      for (let i = 0; i < 4; i++) {
        const p = a + i * TAU / 4, x = w * 0.51 + w * 0.3 * Math.cos(p), y = h * 0.3 + h * 0.065 * Math.sin(p);
        polygon(ctx, [[x, y - u * 0.035], [x + u * 0.04, y + u * 0.018], [x - u * 0.04, y + u * 0.018]]);
        line(ctx, [[x - u * 0.03, y + u * 0.018], [x - u * 0.03, y + u * 0.06], [x + u * 0.03, y + u * 0.06], [x + u * 0.03, y + u * 0.018]]);
      } break;
    }
    case 'scp914-empty-booths-mainspring': {
      for (let i = 0; i < 2; i++) {
        const x = w * (0.33 + i * 0.27), y = h * 0.23, closed = (1 - c) / 2;
        box(ctx, x, y, u * 0.115, h * 0.24); box(ctx, x + u * 0.01, y + h * 0.02, u * 0.095, h * 0.2 * closed);
        line(ctx, [[x + u * 0.057, y], [x + u * 0.057, h * 0.17], [w * 0.52, h * 0.17], [w * 0.52, h * 0.25]]);
      }
      wheel(ctx, w * 0.52, h * 0.29, u * 0.045, a, 8); wheel(ctx, w * 0.52 + u * 0.069, h * 0.29, u * 0.024, -a * 2, 6);
      const tip = polar(w * 0.52, h * 0.4, u * 0.028, a); line(ctx, [[w * 0.52, h * 0.4], tip]); ellipse(ctx, ...tip, u * 0.012, u * 0.006, a); break;
    }
    case 'scp294-paper-cup-dispenser': {
      box(ctx, w * 0.45, h * 0.18, u * 0.2, h * 0.32); box(ctx, w * 0.45 + u * 0.025, h * 0.22, u * 0.15, u * 0.035);
      for (let row = 0; row < 3; row++) for (let col = 0; col < 10; col++) box(ctx, w * 0.45 + u * (0.02 + col * 0.016), h * 0.29 + u * row * 0.014, u * 0.01, u * 0.008);
      const x = w * 0.45 + u * 0.1, y = h * 0.38 + u * 0.018 * (1 - c);
      box(ctx, x - u * 0.055, h * 0.365, u * 0.11, h * 0.1);
      polygon(ctx, [[x - u * 0.026, y], [x + u * 0.026, y], [x + u * 0.018, y + u * 0.045], [x - u * 0.018, y + u * 0.045]]);
      line(ctx, [[x, h * 0.365], [x, y]]); break;
    }
    case 'attic-lament-interlocking-cube-panels': {
      const x = w * 0.5, y = h * 0.32, r = u * 0.08, d = u * 0.026 * (1 - c) / 2;
      polygon(ctx, [[x - r, y - r * 0.5], [x, y - r], [x + r, y - r * 0.5], [x + r, y + r * 0.6], [x, y + r], [x - r, y + r * 0.6]]);
      polygon(ctx, [[x - r - d, y - r * 0.5], [x - d, y], [x - d, y + r], [x - r - d, y + r * 0.5]]);
      polygon(ctx, [[x + d, y], [x + r + d, y - r * 0.5], [x + r + d, y + r * 0.5], [x + d, y + r]]);
      polygon(ctx, [[x - r, y - r * 0.5 - d], [x, y - r - d], [x + r, y - r * 0.5 - d], [x, y - d]]);
      for (const dx of [-0.025, 0.025]) box(ctx, x + u * dx - u * 0.01, y + u * 0.012, u * 0.02, u * 0.03); break;
    }
    case 'labyrinth-leviathan-suspended-rhombus': {
      const x = w * 0.52, y = h * 0.29, r = u * 0.12, projected = u * (0.025 + 0.055 * Math.abs(c));
      polygon(ctx, [[x, y - r], [x + projected, y], [x, y + r], [x - projected, y]]);
      const seam = x + projected * s; line(ctx, [[x, y - r], [seam, y], [x, y + r]]); line(ctx, [[x - projected, y], [seam, y], [x + projected, y]]);
      for (let i = 0; i < 5; i++) line(ctx, [[w * 0.3 + i * u * 0.04, h * 0.48], [w * 0.3 + i * u * 0.04, h * 0.44], [w * 0.7 - i * u * 0.03, h * 0.44]]); break;
    }
    case 'conveyor-smelter-stepped-roller-belt': {
      const points = [[w * 0.26, h * 0.42], [w * 0.44, h * 0.42], [w * 0.53, h * 0.3], [w * 0.75, h * 0.3]]; line(ctx, points); line(ctx, points.map(([x, y]) => [x, y + u * 0.025]));
      for (const [x, y] of points) wheel(ctx, x, y + u * 0.012, u * 0.022, a * 2, 5);
      for (let i = 0; i < 14; i++) {
        const q = (i / 14 + t) % 1, v = q * 3, index = Math.min(2, Math.floor(v)), f = v - index;
        const x = points[index][0] + f * (points[index + 1][0] - points[index][0]), y = points[index][1] + f * (points[index + 1][1] - points[index][1]); line(ctx, [[x, y], [x, y + u * 0.025]]);
      } ellipse(ctx, w * 0.34, h * 0.27, u * 0.055, u * 0.018); box(ctx, w * 0.34 - u * 0.055, h * 0.27, u * 0.11, h * 0.07); break;
    }
    case 'pressure-chamber-empty-sliding-seals': {
      box(ctx, w * 0.4, h * 0.2, w * 0.23, h * 0.29); const shift = u * 0.045 * (1 - c) / 2;
      for (const side of [-1, 1]) box(ctx, w * 0.515 + side * (u * 0.047 + shift) - u * 0.045, h * 0.24, u * 0.09, h * 0.2);
      ellipse(ctx, w * 0.515, h * 0.18, u * 0.032, u * 0.032); line(ctx, [[w * 0.515, h * 0.18], polar(w * 0.515, h * 0.18, u * 0.023, -Math.PI * 0.6 + s * 0.4)]);
      for (const x of [0.36, 0.67]) { box(ctx, w * x, h * 0.31, u * 0.02, u * 0.04); } break;
    }
    case 'heavymachinery-guided-drop-platforms': {
      for (let i = 0; i < 3; i++) {
        const x = w * (0.36 + i * 0.14), q = (1 - Math.cos(a + i * TAU / 3)) / 2, y = h * (0.26 + q * 0.11);
        line(ctx, [[x, h * 0.21], [x, h * 0.46]]); box(ctx, x - u * 0.06, y, u * 0.12, u * 0.023);
        wheel(ctx, x, h * 0.2, u * 0.018, a + i * TAU / 3, 4);
      } rail(ctx, w * 0.28, h * 0.49, w * 0.78, h * 0.49, u * 0.02); break;
    }
    case 'castlemachinery-alternating-vertical-carriers': {
      for (let i = 0; i < 2; i++) {
        const x = w * (0.41 + i * 0.22), y = h * (0.27 + 0.1 * (1 + (i ? -c : c)) / 2);
        rail(ctx, x - u * 0.065, h * 0.18, x - u * 0.065, h * 0.5, u * 0.13); box(ctx, x - u * 0.055, y, u * 0.11, u * 0.03);
        const center = [x, h * 0.45]; wheel(ctx, ...center, u * 0.032, a + i * Math.PI, 6); line(ctx, [polar(...center, u * 0.032, a + i * Math.PI), [x, y + u * 0.015]]);
      } break;
    }
    case 'hurricos-opposed-windmill-wheels': {
      const g = getStageAnimationWave7Geometry(animation.mechanism, t, w, h);
      for (const item of g.wheels) {
        const [x, y] = item.center; line(ctx, [[x - item.radius * 0.3, h * 0.5], [x, y], [x + item.radius * 0.3, h * 0.5]]); ellipse(ctx, x, y, item.radius, item.radius);
        for (const end of item.ends) { line(ctx, [item.center, end]); ellipse(ctx, ...end, u * 0.012, u * 0.007); }
      } break;
    }
    case 'aquaria-moneybags-submarine-screw': {
      ellipse(ctx, w * 0.52, h * 0.35, w * 0.27, h * 0.12);
      const x = w * 0.52 + w * 0.13 * c, y = h * 0.35 + u * 0.025 * s;
      ellipse(ctx, x, y, u * 0.09, u * 0.045); ellipse(ctx, x + u * 0.035, y, u * 0.023, u * 0.023);
      line(ctx, [[x - u * 0.025, y - u * 0.04], [x - u * 0.025, y - u * 0.075], [x + u * 0.01, y - u * 0.075]]);
      line(ctx, [[x - u * 0.09, y], [x - u * 0.12, y]]); ellipse(ctx, x - u * 0.12, y, u * 0.01, u * (0.008 + 0.022 * Math.abs(c)));
      for (let i = 0; i < 3; i++) ellipse(ctx, x - u * (0.15 + i * 0.035), y - u * 0.015 * Math.sin(a + i), u * (0.006 + i * 0.002), u * (0.006 + i * 0.002)); break;
    }
    default: return false;
  }
  return true;
}
