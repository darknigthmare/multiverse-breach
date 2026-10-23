// Source references establish locations and functions only. These empty-prop
// outlines, scales, maintenance motions and timing are authored adaptations.
const scene = definition => Object.freeze({
  ...definition, animationWave: 8,
  animationProvenance: 'authored-scene-mechanism-geometry-and-timing',
  renderingKind: 'authored-mechanism', localBackdrops: Object.freeze({}),
  timeSource: 'simulation-elapsed-seconds', reducedMotionBehavior: 'freeze-at-time-zero',
  sourceVisualValidation: 'not-validated-1:1', fidelityVerified: false,
  officialSourceFrames: false, gameplayEffect: 'none'
});

export const STAGE_ANIMATION_WAVE_8 = Object.freeze([
  scene({ id: 'tt2003-cartrouble-empty-tcar', universes: ['Teen Titans'],
    scenePattern: /(?:car trouble|t.car).*(?:garage|tower|roue|wheel|2003)/i, excludedScenePattern: /titans go|2013|live.action|comics|overload|poss[eé]d|destroyed|d[eé]truit/i,
    sourceWork: 'Teen Titans (2003), Car Trouble', sourceReference: 'https://dcanimated.com/teen-titans/reviews/tt-review-car-trouble/', sourceAccess: 'opened-selected-text-passages',
    sourceScene: 'Car Trouble — T-Car vide dans le garage de la tour, Teen Titans 2003', continuity: 'Original 2003 animated series, completed T-Car before theft or Overload possession',
    mechanism: 'tcar-four-wheel-empty-test-rig', color: '#a9c2ce', periodSeconds: 39,
    sceneEvidence: 'The review identifies the 2003 episode and Cyborg finishing the T-Car. An empty four-wheel vehicle is studied on rollers, with wheels coupled to the rollers. The garage test rig, outline and maintenance cycle are authored; no occupant, possession, road chase or weapon is depicted.' }),
  scene({ id: 'tt2003-deepsix-tsub', universes: ['Teen Titans'],
    scenePattern: /deep six.*(?:t.sub|submersible|sous.marin|2003)/i, excludedScenePattern: /titans go|2013|live.action|comics|space|espace|jet|t.ship|destroyed|d[eé]truit/i,
    sourceWork: 'Teen Titans (2003), Deep Six, original T-Sub', sourceReference: 'https://teentitans.fandom.com/wiki/Deep_Six/Transcript', sourceAccess: 'indexed-excerpt-only-open-failed',
    sourceScene: 'Deep Six — T-Sub sous-marin vide, Teen Titans 2003', continuity: 'Original Deep Six submarine before damage, not the later jet or space T-Ship',
    mechanism: 'deepsix-tsub-ducted-screws', color: '#99c5c8', periodSeconds: 51,
    sceneEvidence: 'The indexed transcript explicitly places the team in their five-person T-Sub. Only the empty pressure hull and paired ducted screws are interpreted. Exact propeller construction, dimensions and a bounded underwater maintenance drift are authored; the later flying T-Ship, occupants and attacks are excluded.' }),
  scene({ id: 'yakuza0-kamurocho-pocketcircuit', universes: ['Yakuza'],
    scenePattern: /(?:kamurocho.*pocket circuit|pocket circuit.*kamurocho)/i, excludedScenePattern: /kiwami|gaiden|like a dragon|director.?s cut|2025|destroyed|d[eé]truit/i,
    sourceWork: 'Yakuza 0 (2015 original), Kamurocho in 1988, Pocket Circuit Stadium', sourceReference: 'https://games.sega.com/yakuza0/world.html', sourceAccess: 'opened-official-selected-text-passages',
    sourceScene: 'Kamurocho — circuit de voitures miniatures Pocket Circuit, Yakuza 0 original 1988', continuity: 'Original Yakuza 0 Kamurocho play spot, not Kiwami or Director’s Cut',
    mechanism: 'pocketcircuit-miniature-banked-oval', color: '#bbc995', periodSeconds: 37,
    sceneEvidence: 'SEGA explicitly describes customized model-car racing on purpose-built circuits in Kamurocho in 1988. Two tiny unoccupied cars follow concentric closed lanes with wheel positions tied to the cars. The oval layout, spacing and speeds are authored; no race result, part upgrade or bet is generated.' }),
  scene({ id: 'yakuza0-sotenbori-ufocatcher', universes: ['Yakuza'],
    scenePattern: /sotenbori.*(?:ufo|hi.tech|grue|catcher)/i, excludedScenePattern: /kiwami|gaiden|like a dragon|director.?s cut|2025|destroyed|d[eé]truit/i,
    sourceWork: 'Yakuza 0 (2015 original), Sotenbori Hi-Tech Land SEGA', sourceReference: 'https://games.sega.com/yakuza0/world.html', sourceAccess: 'opened-official-selected-text-passages',
    sourceScene: 'Sotenbori — UFO catcher de Hi-Tech Land SEGA, Yakuza 0 original 1988', continuity: 'Yakuza 0 original arcade, 1988; no later game cabinet layout asserted',
    mechanism: 'sotenbori-ufo-gantry-empty-claw', color: '#c5adb9', periodSeconds: 57,
    sceneEvidence: 'SEGA names Hi-Tech Land SEGA and UFO catchers as period play spots; the original game arcade guide locates the Sotenbori arcade. An empty gantry carries a fixed-length suspension and two-jaw claw. Cabinet proportions and unloaded maintenance cycle are authored; no plush body, coin, prize or inventory change occurs.' }),
  scene({ id: 'meshi2024-secondfloor-trap-linkage', universes: ['Dungeon Meshi'],
    scenePattern: /(?:second.floor|deuxi[eè]me [eé]tage|[eé]tage 2|kakiage).*(?:trap|pi[eè]ge|2024)/i, excludedScenePattern: /manga only|live.action|episode.?5|[eé]pisode.?5|ghost|fant[oô]me|dragon/i,
    sourceWork: 'Delicious in Dungeon (2024 anime), episode 2, Kakiage trap room', sourceReference: 'https://www.springfieldspringfield.co.uk/view_episode_scripts.php?episode=s01e02&tv-show=delicious-in-dungeon-2024', sourceAccess: 'opened-selected-transcript-passages',
    sourceScene: 'Deuxième étage — liaison mécanique du piège à huile, Kakiage épisode 2 anime 2024', continuity: '2024 anime episode 2, empty trap mechanism study; not a later dungeon room',
    mechanism: 'kakiage-pressure-plate-oil-valve', color: '#b6aa8a', periodSeconds: 61,
    sceneEvidence: 'The transcript distinguishes a pressure-triggered oil release from the fire trap used for cooking. A bounded pressure plate links to a closing valve in an empty reservoir. This exposes authored functional internals, with no flowing hot oil, flame, food, actor, trap damage or traversable switch.' }),
  scene({ id: 'meshi2024-sorbet-ropejar', universes: ['Dungeon Meshi'],
    scenePattern: /(?:exorcism sorbet|sorbet.*exorci|episode.?5|[eé]pisode.?5).*(?:jar|bocal|corde|rope|2024)/i, excludedScenePattern: /manga only|live.action|episode.?2|[eé]pisode.?2|dragon|resurrection/i,
    sourceWork: 'Delicious in Dungeon (2024 anime), episode 5, Snacks/Sorbet', sourceReference: 'https://www.springfieldspringfield.co.uk/view_episode_scripts.php?episode=s01e05&tv-show=delicious-in-dungeon-2024', sourceAccess: 'opened-selected-transcript-passages',
    sourceScene: 'Exorcism Sorbet — bocal suspendu à sa corde, épisode 5 anime 2024', continuity: '2024 anime episode 5 holy-water jar, empty prop study without ghosts or casters',
    mechanism: 'sorbet-sealed-jar-fixed-rope-swing', color: '#aabfc9', periodSeconds: 67,
    sceneEvidence: 'The episode transcript explicitly describes tying a rope to the jar before the sorbet sequence. A sealed plain jar swings at constant rope length from a distant fixed support. Support, amplitude, timing and reset are authored; no person, ghost, exorcism, freezing effect, food or gameplay reward is produced.' }),
  scene({ id: 'l4d2008-nomercy-rooftop-rotor', universes: ['Left 4 Dead'],
    scenePattern: /(?:no mercy|mercy hospital).*(?:roof|toit|h[eé]licopt|helicopter|2008)/i, excludedScenePattern: /left.?4.?dead.?2|l4d2|crash course|after.*crash|apr[eè]s.*accident|destroyed|d[eé]truit/i,
    sourceWork: 'Left 4 Dead (2008 original), No Mercy hospital rooftop rescue', sourceReference: 'https://en.wikipedia.org/wiki/Left_4_Dead', sourceAccess: 'opened-selected-plot-passages',
    sourceScene: 'No Mercy — hélicoptère vide sur le toit de Mercy Hospital, original 2008', continuity: 'Original game rescue craft before departure and subsequent Crash Course crash',
    mechanism: 'mercy-rooftop-empty-helicopter-rotors', color: '#aebbbe', periodSeconds: 43,
    sceneEvidence: 'The plot account identifies the helicopter rescue on Mercy Hospital’s roof and the later crash separately. An empty landing craft has a mast-mounted rotor and tail rotor with fixed hubs. Exact craft outline and idle test rotation are authored; no pilot, infected, rescue, departure or damage is simulated.' }),
  scene({ id: 'l4d2008-deathtoll-boathouse', universes: ['Left 4 Dead'],
    scenePattern: /death toll.*(?:boathouse|embarcad[eè]re|bateau|fishing|2008)/i, excludedScenePattern: /left.?4.?dead.?2|l4d2|sacrifice|last stand|destroyed|d[eé]truit|newburg.*flames/i,
    sourceWork: 'Left 4 Dead (2008 original), Death Toll Boathouse Finale', sourceReference: 'https://en.wikipedia.org/wiki/Left_4_Dead', sourceAccess: 'opened-selected-plot-passages',
    sourceScene: 'Death Toll — petit bateau de pêche près du Boathouse, original 2008', continuity: 'Original Death Toll rescue vessel at the boathouse before the Newburg crossing',
    mechanism: 'deathtoll-fishing-vessel-moored-drum', color: '#adb8a3', periodSeconds: 73,
    sceneEvidence: 'The plot account names the boathouse rescue by a small fishing vessel before the Newburg river crossing. An empty boat moves on a bounded mooring rope with an exposed empty deck drum. Hull, drum and dock arrangement are authored; no passenger, fishing catch, rescue trigger or transport is added.' }),
  scene({ id: 'cs16-assault-security-door', universes: ['Counter-Strike'],
    scenePattern: /cs.assault.*(?:security|s[eé]curit[eé]|sliding|coulissant|1\.6)/i, excludedScenePattern: /source|global offensive|cs.?go|cs.?2\b|night|garage|destroyed|d[eé]truit/i,
    sourceWork: 'Counter-Strike 1.6, cs_assault warehouse security-room sliding door', sourceReference: 'https://gamefaqs.gamespot.com/pc/429818-counter-strike/faqs/14509', sourceAccess: 'indexed-excerpt-only-open-failed',
    sourceScene: 'cs_assault — porte coulissante de la salle de sécurité, Counter-Strike 1.6', continuity: 'Classic cs_assault interior sliding door; the half-open garage gate is deliberately excluded',
    mechanism: 'assault-security-horizontal-door-guide', color: '#a9b6ad', periodSeconds: 59,
    sceneEvidence: 'The indexed classic-map guide describes the security-room sliding door, unlike the static half-open garage entrance. One rigid door leaf translates within a horizontal guide and has paired rollers. Internal rollers and bounded maintenance repeat are authored; no hostage, passage, collision or competitive state changes.' }),
  scene({ id: 'css2004-nuke-turbine', universes: ['Counter-Strike'],
    scenePattern: /de.nuke.*(?:turbine|generator|g[eé]n[eé]rateur|source 2004)/i, excludedScenePattern: /1\.6|global offensive|cs.?go|cs.?2\b|remake|destroyed|d[eé]truit/i,
    sourceWork: 'Counter-Strike: Source (2004), de_nuke turbine-generator prop', sourceReference: 'https://gamefaqs.gamespot.com/pc/922013-counter-strike-source/faqs/55895', sourceAccess: 'indexed-excerpt-only-open-failed',
    sourceScene: 'de_nuke — générateur à turbine, Counter-Strike Source 2004', continuity: 'Source-era de_nuke prop; not the classic 1.6 or Global Offensive/CS2 plant',
    mechanism: 'nuke-source-generator-section-rotor', color: '#a6bec1', periodSeconds: 47,
    sceneEvidence: 'The indexed Source model list explicitly includes props/de_nuke/turbinegenerator.mdl. A cutaway rotor on fixed bearings interprets that prop’s function. It is not a verified animation of that model: vane count, shaft layout, exposed section and no-load rotation are authored; no power, radiation or damage changes.' }),
  scene({ id: 'bl2-sanctuary-luckyshot', universes: ['Borderlands 2'],
    scenePattern: /sanctuary.*(?:moxxi|lucky shot|slot|reel|rouleau)/i, excludedScenePattern: /borderlands.?3|pre.sequel|wonderlands|jackpot dlc|destroyed|d[eé]truit/i,
    sourceWork: 'Borderlands 2 (2012), Sanctuary, Moxxi’s Lucky Shot', sourceReference: 'https://borderlands.fandom.com/wiki/Jackpot%21_%28Borderlands_2%29', sourceAccess: 'indexed-excerpt-only-open-failed',
    sourceScene: 'Sanctuary — trois rouleaux mécaniques Lucky Shot chez Moxxi, Borderlands 2 2012', continuity: 'Original Sanctuary bar cabinet, before city relocation; no BL3 casino DLC',
    mechanism: 'moxxi-three-reels-blank-maintenance', color: '#bdac9b', periodSeconds: 53,
    sceneEvidence: 'The indexed Lucky Shot reference places three-reel slot machines in Moxxi’s Sanctuary bar. Three separate cylindrical reels carry blank mechanical indexing bars. Reel construction and continuous empty service cycle are authored; no gambling input, currency, reward, loot symbols or winning combination is displayed.' }),
  scene({ id: 'bl2-lynchwood-oldmine-lift', universes: ['Borderlands 2'],
    scenePattern: /lynchwood.*(?:old mine|mine|elevator|ascenseur|demon hunter)/i, excludedScenePattern: /borderlands.?3|pre.sequel|wonderlands|destroyed|d[eé]truit|boss.*corpse/i,
    sourceWork: 'Borderlands 2 (2012), Demon Hunter, Lynchwood mine elevator', sourceReference: 'https://www.gamesradar.com/borderlands-2-side-missions-guide/8/', sourceAccess: 'opened-selected-walkthrough-passages',
    sourceScene: 'Lynchwood — ascenseur de l’ancienne mine, Demon Hunter Borderlands 2 2012', continuity: 'Main-game mine entrance to Dukino’s Mom arena; empty transport study',
    mechanism: 'lynchwood-mine-lift-chain-cage', color: '#b8ad8d', periodSeconds: 71,
    sceneEvidence: 'GamesRadar’s Demon Hunter directions turn right from the station into the mine and take an elevator down. A narrow empty mine cage and two guided chains interpret that transport. Cage construction and winding geometry are authored; the boss, quest, elevator interaction, loot and actor positions remain untouched.' }),
  scene({ id: 'cuphead2017-carnival-coaster', universes: ['Cuphead'],
    scenePattern: /carnival kerfuffle.*(?:roller|coaster|rail|2017)/i, excludedScenePattern: /delicious last course|dlc|show|netflix|2022|beppi.*body|destroyed|d[eé]truit/i,
    sourceWork: 'Cuphead (2017), Carnival Kerfuffle background rollercoaster', sourceReference: 'https://www.neoseeker.com/cuphead/walkthrough/Carnival_Kerfuffle', sourceAccess: 'indexed-excerpt-only-open-failed',
    sourceScene: 'Carnival Kerfuffle — petits wagons vides du rollercoaster, Cuphead 2017', continuity: 'Original base-game carnival rail mechanism, no Beppi or living coaster passengers',
    mechanism: 'carnival-empty-coaster-connected-carts', color: '#c5b09b', periodSeconds: 41,
    sceneEvidence: 'The indexed guide explicitly describes the rollercoaster making successive rounds in Carnival Kerfuffle. Three empty cars follow one closed rail curve with axles tied to each car. Track, spacing and loop duration are authored; no clown, balloon, passenger, contact damage or boss phase is reproduced.' }),
  scene({ id: 'cuphead2017-railroad-handcart', universes: ['Cuphead'],
    scenePattern: /railroad wrath.*(?:handcart|chariot|platform|plateforme|2017)/i, excludedScenePattern: /delicious last course|dlc|show|netflix|2022|train.*legs|jambes|boss.*body/i,
    sourceWork: 'Cuphead (2017), Railroad Wrath, player’s rail cart', sourceReference: 'https://www.gamersky.com/handbook/202207/1498736_27.shtml', sourceAccess: 'opened-selected-walkthrough-passages',
    sourceScene: 'Railroad Wrath — chariot vide et deux commandes rotatives, Cuphead 2017', continuity: 'Mechanical player platform only; no Phantom Express living locomotive or boss anatomy',
    mechanism: 'railroad-handcart-two-end-controls', color: '#b6b8a0', periodSeconds: 49,
    sceneEvidence: 'The guide describes standing on a rail cart and moving it through rotating controls at both ends. An empty rigid cart rolls between bounded stops with two rotating end controls. Its outline, travel cycle and drive linkage are authored; no source boss, parry event, rider or playable moving platform is created.' }),
  scene({ id: 'bge2003-akuda-diskgame', universes: ['Beyond Good & Evil'],
    scenePattern: /akuda.*(?:francis|disk|pallet|palet|2003)/i, excludedScenePattern: /20th anniversary|2024|hd remake|beyond good.*evil\s*2\b|peepers.*game|destroyed|d[eé]truit/i,
    sourceWork: 'Beyond Good & Evil (2003 original), Akuda Bar, Francis’s disk game', sourceReference: 'https://www.justadventure.com/walkthrough/beyond-good-evil/', sourceAccess: 'opened-selected-walkthrough-passages',
    sourceScene: 'Akuda Bar — table du jeu de palets de Francis, Beyond Good & Evil original 2003', continuity: 'Original 2003 bar table; Francis plays the disk game, Peepers provides information upstairs',
    mechanism: 'akuda-disk-table-empty-puck-guides', color: '#b5b69c', periodSeconds: 63,
    sceneEvidence: 'The original-game walkthrough identifies Francis at Akuda Bar and the disk-game pearl. Only the distant empty table and two blank pucks are interpreted, with bounded planar sliding. Table proportions, guide lines and repeated demonstration are authored; no animal character, bet, victory, pearl or inventory effect occurs.' }),
  scene({ id: 'bge2003-mammago-tow', universes: ['Beyond Good & Evil'],
    scenePattern: /mammago.*(?:garage|tow|remorqu|2003)/i, excludedScenePattern: /20th anniversary|2024|hd remake|beyond good.*evil\s*2\b|destroyed|d[eé]truit/i,
    sourceWork: 'Beyond Good & Evil (2003 original), Mammago Garage tow-in sequence', sourceReference: 'https://www.walkthroughking.com/text/beyondgoodandevil.aspx', sourceAccess: 'opened-selected-walkthrough-passages',
    sourceScene: 'Mammago Garage — câble de remorquage du hovercraft vide, original 2003', continuity: 'Original first breakdown and tow-in before buying the Speedcraft Motor, not a later spacecraft upgrade',
    mechanism: 'mammago-tow-drum-hovercraft-guide', color: '#aabdae', periodSeconds: 77,
    sceneEvidence: 'The guide explicitly describes the hovercraft breaking down before Mammago and being towed to the garage. An empty craft translates along a fixed tow line as a winding drum rotates. Winch mounting, exposed cable and bounded repeat are authored; no rhinoceros body, repair purchase, vehicle upgrade or actor transport occurs.' }),
  scene({ id: 'sammax1993-twine-cablecar', universes: ['Sam & Max'],
    scenePattern: /(?:ball of twine|boule.*ficelle).*(?:cable|tram|t[eé]l[eé]ph[eé]rique|1993)/i, excludedScenePattern: /telltale|save the world|beyond time|devil.?s playhouse|vr|destroyed|d[eé]truit/i,
    sourceWork: 'Sam & Max Hit the Road (1993), World’s Largest Ball of Twine cable car', sourceReference: 'https://www.walkthroughking.com/text/samandmaxhittheroad.aspx', sourceAccess: 'opened-selected-walkthrough-passages',
    sourceScene: 'World’s Largest Ball of Twine — téléphérique vide vers le diner, Hit the Road 1993', continuity: 'Original LucasArts adventure attraction before entering the diner, not Telltale continuity',
    mechanism: 'twine-empty-tram-fixed-diagonal-cable', color: '#b9b49e', periodSeconds: 69,
    sceneEvidence: 'The walkthrough says to use the cable car to reach the top of the Ball before the diner elevator. An empty suspended cabin follows a fixed diagonal cable and retains a vertical hanger. Architecture, cable slope and automatic return are authored; no Sam or Max body, item, tourist travel or puzzle progress is added.' }),
  scene({ id: 'sammax1993-mysteryvortex-magnets', universes: ['Sam & Max'],
    scenePattern: /mystery vortex.*(?:magnet|aimant|1993)/i, excludedScenePattern: /telltale|save the world|beyond time|devil.?s playhouse|vr|destroyed|d[eé]truit/i,
    sourceWork: 'Sam & Max Hit the Road (1993), Mystery Vortex underground magnet cavern', sourceReference: 'https://www.walkthroughking.com/text/samandmaxhittheroad.aspx', sourceAccess: 'opened-selected-walkthrough-passages',
    sourceScene: 'Mystery Vortex — sélecteurs des trois aimants souterrains, Hit the Road 1993', continuity: 'Original magnet cavern with red, blue and yellow controls; no character-size transformation',
    mechanism: 'mysteryvortex-three-magnet-selector-levers', color: '#a9b4c3', periodSeconds: 55,
    sceneEvidence: 'The guide distinguishes left red, middle blue and right yellow magnets controlled in the underground cavern. Three fixed horseshoe housings have bounded lever selectors. Their outlines and idle lever return are authored; no magnetic field, door solution, character scale, person or world-state change is simulated.' }),
  scene({ id: 'deponia2012-kuvaq-coffee', universes: ['Deponia'],
    scenePattern: /(?:kuvaq|lonzo).*(?:coffee|caf[eé]|espresso)/i, excludedScenePattern: /chaos on|goodbye|doomsday|2013|2016|destroyed|d[eé]truit/i,
    sourceWork: 'Deponia (2012 original), Kuvaq, Lonzo’s espresso machine', sourceReference: 'https://www.justadventure.com/walkthrough/deponia/', sourceAccess: 'opened-selected-walkthrough-passages',
    sourceScene: 'Kuvaq — réservoir et tiroir de la machine à café de Lonzo, Deponia 2012', continuity: 'Original first-game Lonzo coffee puzzle, not later Deponia sequels',
    mechanism: 'lonzo-espresso-tank-tray-linkage', color: '#b9aa8b', periodSeconds: 53,
    sceneEvidence: 'The walkthrough describes opening the tank lid, pulling out the tray and adding the blend at Lonzo’s bar. A hinged tank lid and rigid guided tray form an empty service study. Linkage and automatic cycling are authored; no ingredients, sedative, acid, drink, character revival or quest change is produced.' }),
  scene({ id: 'deponia2012-postoffice-belts', universes: ['Deponia'],
    scenePattern: /(?:kuvaq.*post|post office|bureau.*poste).*(?:conveyor|convoyeur|2012|belt)/i, excludedScenePattern: /chaos on|goodbye|doomsday|2013|2016|destroyed|d[eé]truit/i,
    sourceWork: 'Deponia (2012 original), Kuvaq post office conveyors', sourceReference: 'https://www.justadventure.com/walkthrough/deponia/', sourceAccess: 'opened-selected-walkthrough-passages',
    sourceScene: 'Kuvaq post office — deux convoyeurs de la poste, Deponia 2012', continuity: 'First-game postal conveyors; source power is offscreen cats, no invented autonomous power supply',
    mechanism: 'kuvaq-two-speed-empty-postal-belts', color: '#b4bc9b', periodSeconds: 47,
    sceneEvidence: 'The guide states that the ginger and white postal kittens run conveyors at different speeds. Two empty belt loops demonstrate unequal roller speeds while their source power stays offscreen. No cat, pigeon or robot anatomy is drawn; belt spacing and empty continuous cycle are authored, with no parcels, stamps or delivery puzzle effects.' }),
  scene({ id: 'hitman2016-paris-rig-winch', universes: ['HITMAN — World of Assassination'],
    scenePattern: /(?:paris|sanguine|walewska).*(?:light rig|winch|treuil|rampe.*[eé]clair|2016)/i, excludedScenePattern: /alpha|beta|2015 demo|dropped|effondr|collapse|destroyed|d[eé]truit/i,
    sourceWork: 'HITMAN (2016), Paris, Sanguine fashion-show lighting rig winch', sourceReference: 'https://www.trueachievements.com/game/HITMAN/walkthrough/4', sourceAccess: 'indexed-excerpt-only-open-failed',
    sourceScene: 'Paris Sanguine — treuil de service du light rig intact, HITMAN 2016', continuity: 'Released Paris mission with rig intact; excludes alpha layout and falling-rig outcome',
    mechanism: 'paris-light-rig-restrained-winch', color: '#bfc0ad', periodSeconds: 79,
    sceneEvidence: 'The indexed walkthrough locates a winch in the middle of the light rig. A supported empty truss keeps all suspended lamps at constant height while a separate unloaded service drum turns. This authored restrained maintenance interpretation omits release, fall, victims, accident kills, lighting control and mission effects.' }),
  scene({ id: 'hitman2016-hokkaido-kai', universes: ['HITMAN — World of Assassination'],
    scenePattern: /(?:hokkaido|gama|situs inversus).*(?:kai|robot|hydraul|2016)/i, excludedScenePattern: /patient|soders.*body|malfunction|fatal|destroyed|d[eé]truit|operating.*person/i,
    sourceWork: 'HITMAN (2016), Situs Inversus, GAMA surgical robot KAI', sourceReference: 'https://www.gamepressure.com/hitman/murdering-erich-soders/z29603', sourceAccess: 'opened-selected-walkthrough-passages',
    sourceScene: 'Hokkaido GAMA — bras mécaniques KAI en maintenance à vide, Situs Inversus 2016', continuity: 'Original 2016 Hokkaido robot mechanism, empty maintenance study with no patient',
    mechanism: 'gama-kai-two-fixed-length-tool-arms', color: '#b1c1c5', periodSeconds: 83,
    sceneEvidence: 'The Hokkaido guide identifies the KAI surgical robot and control system. Two rigid two-link mechanical tool arms move above an empty cradle while every link retains constant length. Arm silhouettes, tool motion and empty cycle are authored; no patient, surgery, poisoning, malfunction, kill or gameplay contact is reproduced.' }),
  scene({ id: 'rf2001-abandoned-crusher', universes: ['Red Faction'],
    scenePattern: /(?:abandoned mine|abandoned crusher|mine abandonn[eé]e).*(?:crusher|broyeur|2001)/i, excludedScenePattern: /guerrilla|armageddon|red faction.?2\b|remarstered|destroyed|d[eé]truit/i,
    sourceWork: 'Red Faction (2001), Abandoned Mine, old rock crusher', sourceReference: 'https://www.redfactionwiki.com/wiki/Abandoned_Mine', sourceAccess: 'opened-selected-level-passages',
    sourceScene: 'Abandoned Mine — ancien broyeur de roche à vide, Red Faction 2001', continuity: 'Original abandoned mine before Geothermal Power Plant, not Guerrilla or Armageddon',
    mechanism: 'abandonedmine-opposed-empty-crusher-rolls', color: '#b2a58d', periodSeconds: 51,
    sceneEvidence: 'The level reference identifies the Abandoned Crusher section and a crusher by a retractable bridge. Two opposed empty rolls in a distant hopper interpret the crushing function. Roll construction, tooth count and transmission are authored; no ore, body, bridge change, terrain destruction or stage hazard is added.' }),
  scene({ id: 'rf2001-geothermal-turbine', universes: ['Red Faction'],
    scenePattern: /geothermal power plant.*(?:turbine|2001)/i, excludedScenePattern: /guerrilla|armageddon|red faction.?2\b|remarstered|sabotaged|sabot[eé]|destroyed|d[eé]truit/i,
    sourceWork: 'Red Faction (2001), Geothermal Power Plant turbine room', sourceReference: 'https://www.gamerevolution.com/guides/30610-red-faction-walkthrough', sourceAccess: 'opened-selected-walkthrough-passages',
    sourceScene: 'Geothermal Power Plant — rangée de turbines intactes, Red Faction 2001', continuity: 'Original plant before sabotage, empty decorative turbine section',
    mechanism: 'geothermal-twin-bearing-turbine-shaft', color: '#adbbad', periodSeconds: 43,
    sceneEvidence: 'The original walkthrough explicitly lists the turbine room among five plant facilities before sabotage. A shared shaft runs through two separate turbine housings on fixed bearings. The exposed cutaway and blade pattern are authored; no sabotage progress, electricity, coolant, lava, terrain or actor health changes.' }),
  scene({ id: 'marathon1994-arrival-lift', universes: ['Marathon'],
    scenePattern: /arrival.*(?:hangar|engineering|49.h|elevator|ascenseur|1994)/i, excludedScenePattern: /redux|m1a1|durandal.?1995|infinity|2026|reboot|destroyed|d[eé]truit/i,
    sourceWork: 'Marathon (1994 Macintosh), Arrival, Hangar Area-5 engineering access', sourceReference: 'https://marathongame.fandom.com/wiki/Hangar_Area-5_Engineering_Access_49-h', sourceAccess: 'indexed-excerpt-only-open-failed',
    sourceScene: 'Arrival — ascenseur près de Hangar Area-5 Engineering Access 49-h, Marathon 1994', continuity: 'Original Arrival passage after the pattern buffer, not Redux or the 2026 game',
    mechanism: 'arrival-empty-platform-screw-guide', color: '#a8bdbb', periodSeconds: 67,
    sceneEvidence: 'The indexed terminal-location instructions place an elevator in Arrival near Hangar Area-5 Engineering Access 49-h. A bare empty platform moves in a fixed guide; an exposed screw is an authored functional cutaway. Its drive and loop are not source-verified; no terminals, map geometry, actors or progression change.' }),
  scene({ id: 'marathon1994-colony-sevenplatform', universes: ['Marathon'],
    scenePattern: /colony ship for sale.*(?:cheap|platform|plateforme|1994)/i, excludedScenePattern: /redux|m1a1|durandal.?1995|infinity|2026|reboot|solved|r[eé]solu/i,
    sourceWork: 'Marathon (1994 Macintosh), Colony Ship For Sale, Cheap platform puzzle', sourceReference: 'https://marathongame.fandom.com/wiki/Colony_Ship_For_Sale%2C_Cheap_%28Level%29', sourceAccess: 'opened-selected-level-passages',
    sourceScene: 'Colony Ship For Sale Cheap — sept plateformes de réglage, Marathon 1994', continuity: 'Original 1994 platform-raising puzzle before its final configured state, not Redux',
    mechanism: 'colony-seven-independent-height-columns', color: '#c0ac9a', periodSeconds: 89,
    sceneEvidence: 'The opened level reference explains individually raising platforms to precise heights from controls spread around the level. The original walkthrough names a seven-platform room. Seven empty guided columns demonstrate bounded heights; layout and perpetual maintenance movement are authored, with no stair solution, player transport or puzzle state change.' }),
  scene({ id: 'ut2004-insidious-fan', universes: ['Unreal Tournament 2004'],
    scenePattern: /dm.insidious.*(?:fan|ventilat|2004)/i, excludedScenePattern: /ut99|1999|unreal.?3\b|ut3|remake|destroyed|d[eé]truit/i,
    sourceWork: 'Unreal Tournament 2004, DM-Insidious central fan pit', sourceReference: 'https://unrealarchive.org/wikis/the-liandri-archives/Recurring_maps.html', sourceAccess: 'opened-selected-archived-map-passages',
    sourceScene: 'DM-Insidious — ventilateur central protégé en coupe, UT2004', continuity: '2004 stock DM-Insidious, not the original Unreal DmDeathFan map',
    mechanism: 'insidious-recessed-rotor-behind-grating', color: '#a7b7c3', periodSeconds: 47,
    sceneEvidence: 'The archived map comparison explicitly identifies DM-Insidious’s central pit rotary fan. A distant recessed rotor turns behind a fixed protective grating. Grating, blade count and viewing section are authored; the source pit’s lethal function is omitted, with no fall volume, collision or damage attached.' }),
  scene({ id: 'ut2004-convoy-axles', universes: ['Unreal Tournament 2004'],
    scenePattern: /as.convoy.*(?:repair|r[eé]paration|axle|essieu|2004)/i, excludedScenePattern: /ut99|1999|unreal.?3\b|ut3|remake|missile.*launch|lancement|destroyed|d[eé]truit/i,
    sourceWork: 'Unreal Tournament 2004, AS-Convoy repair vessel and transport trailers', sourceReference: 'https://unreal.fandom.com/wiki/AS-Convoy', sourceAccess: 'indexed-excerpt-only-open-failed',
    sourceScene: 'AS-Convoy — essieux du véhicule de réparation et remorques, UT2004', continuity: 'Original stock assault-map moving convoy, not a later remake or missile launch',
    mechanism: 'convoy-articulated-trailer-wheel-bogies', color: '#b7aa95', periodSeconds: 59,
    sceneEvidence: 'The indexed map reference places the repair vessel between convoy vehicles and a missile trailer. Empty articulated vehicle underframes have rotating wheel bogies while remaining on a fixed distant lane. Wheel layout, joint spacing and movement are authored; no boarding surface, missile, objective, cargo or player movement is added.' }),
  scene({ id: 'ms1996-jungle-sv001', universes: ['Metal Slug'],
    scenePattern: /(?:mission.?1|jungle).*(?:sv.001|tank|char|metal slug|1996)/i, excludedScenePattern: /metal slug.?[2-7]\b|1st mission|first mission.*pocket|1999 pocket|pilot|pilote|destroyed|d[eé]truit/i,
    sourceWork: 'Metal Slug (1996 original), mission 1 jungle SV-001', sourceReference: 'https://gamefaqs.gamespot.com/ps/573212-metal-slug/faqs/7', sourceAccess: 'opened-selected-original-game-port-walkthrough-passages',
    sourceScene: 'Mission 1 jungle — transmission du SV-001 vide, Metal Slug original 1996', continuity: 'Original game vehicle, using a walkthrough of its PlayStation port; not Metal Slug 2 or NGPC 1st Mission',
    mechanism: 'jungle-empty-sv001-track-idlers', color: '#a7ba9c', periodSeconds: 43,
    sceneEvidence: 'The walkthrough of the original game’s PlayStation port describes the first jungle mission and its Metal Slug vehicle. Only an empty armored hull and continuous track idlers are interpreted. This does not verify the arcade’s precise sprite frames; outline, suspension and no-load wheel cycle are authored, without pilot, shot or collision.' }),
  scene({ id: 'ms1996-railway-rollingcar', universes: ['Metal Slug'],
    scenePattern: /(?:railway|rail section|section ferroviaire).*(?:rolling|wagon|car|metal slug|1996)/i, excludedScenePattern: /metal slug.?[2-7]\b|1st mission|first mission.*pocket|1999 pocket|pilot|pilote|destroyed|d[eé]truit/i,
    sourceWork: 'Metal Slug (1996 original), rolling train-car section, PlayStation-port walkthrough', sourceReference: 'https://gamefaqs.gamespot.com/ps/573212-metal-slug/faqs/7', sourceAccess: 'opened-selected-original-game-port-walkthrough-passages',
    sourceScene: 'Section ferroviaire — wagon roulant vide, Metal Slug original 1996', continuity: 'Original-game rail sequence as described for the PlayStation port; no unsupported mission number asserted',
    mechanism: 'slug-rolling-three-platform-traincar', color: '#bda991', periodSeconds: 61,
    sceneEvidence: 'The original-game PlayStation walkthrough explicitly instructs boarding a rolling train car. The guide also distinguishes three raised platforms on the car. Three empty guided decks rise over two equal axles with a constant-length authored coupling rod. Frame shape, drive and repeat are authored; no mission number is guessed and no soldier, passenger, gunfire or traversal is created.' }),
  scene({ id: 'dr2006-wonderland-spacerider', universes: ['Dead Rising'],
    scenePattern: /wonderland.*(?:space rider|coaster|roller)/i, excludedScenePattern: /deluxe remaster|2024|dead rising.?[234]\b|adam.*body|destroyed|d[eé]truit/i,
    sourceWork: 'Dead Rising (2006 original), Wonderland Plaza Space Rider coaster', sourceReference: 'https://gamefaqs.gamespot.com/xbox360/928326-dead-rising/faqs/44355', sourceAccess: 'indexed-excerpt-only-open-failed',
    sourceScene: 'Wonderland Plaza — voitures vides de Space Rider, Dead Rising original 2006', continuity: 'Original Xbox 360 mall ride mechanism, not Deluxe Remaster and no Adam body',
    mechanism: 'spacerider-empty-coaster-vertical-oval', color: '#b5abc5', periodSeconds: 47,
    sceneEvidence: 'The indexed original-game guide places the Out of Control scoop at the Space Rider coaster in Wonderland Plaza. Two empty ride cars follow a closed raised rail. Track shape and idle maintenance cycle are authored, not a reproduced mall model; no clown, hostage, contact hazard, scoop or rescue progression occurs.' }),
  scene({ id: 'dr2006-wonderland-playpark-windmill', universes: ['Dead Rising'],
    scenePattern: /(?:wonderland|play park).*(?:windmill|moulin|2006)/i, excludedScenePattern: /deluxe remaster|2024|dead rising.?[234]\b|leisure park|destroyed|d[eé]truit/i,
    sourceWork: 'Dead Rising (2006 original), Wonderland Plaza Play Park windmill', sourceReference: 'https://gamefaqs.gamespot.com/xbox360/928326-dead-rising/faqs/67731', sourceAccess: 'indexed-excerpt-only-open-failed',
    sourceScene: 'Wonderland Play Park — petit moulin décoratif, Dead Rising original 2006', continuity: 'Original Wonderland Play Park prop, not Leisure Park or Deluxe Remaster',
    mechanism: 'playpark-four-sail-display-windmill', color: '#bcb893', periodSeconds: 71,
    sceneEvidence: 'The indexed original-game guide lists the windmill in Wonderland Plaza’s Play Park as photo target 083. Four rigid sails rotate around one fixed hub in an authored decorative-function study. This does not assert an observed source animation; size, motion and repeat are adapted, with no PP bonus, photo or character effect.' }),
  scene({ id: 'quake1996-slipgate-cavelift', universes: ['Quake'],
    scenePattern: /(?:e1m1|slipgate complex).*(?:cave|grotte|lift|ascenseur|1996)/i, excludedScenePattern: /quake.?[234]\b|saturn|n64|remaster|2021|destroyed|d[eé]truit/i,
    sourceWork: 'Quake (1996 PC), E1M1 The Slipgate Complex cave lift', sourceReference: 'https://www.quakehaus.com/archiv/quake1/quake1_secrets.html', sourceAccess: 'opened-selected-secrets-guide-passages',
    sourceScene: 'E1M1 Slipgate Complex — ascenseur de la grotte vers le départ, Quake PC 1996', continuity: 'Original PC cave secret route under the first bridge, not Saturn/N64 or remaster',
    mechanism: 'slipgate-cave-recessed-single-lift', color: '#9db5ad', periodSeconds: 73,
    sceneEvidence: 'The German guide locates a lift at the end of the cave beneath the first bridge returning to the start. An empty slab moves inside a deep framed recess. Hidden guides and timing are authored; no slipgate portal, pickups, water current, map opening, secret activation or usable lift is created.' }),
  scene({ id: 'quake1996-damned-columnplate', universes: ['Quake'],
    scenePattern: /(?:e1m2|castle of the damned).*(?:column|pilier|plate|plaque|1996)/i, excludedScenePattern: /quake.?[234]\b|saturn|n64|remaster|2021|destroyed|d[eé]truit/i,
    sourceWork: 'Quake (1996 PC), E1M2 Castle of the Damned stone column switch', sourceReference: 'https://www.quakehaus.com/archiv/quake1/quake1_secrets.html', sourceAccess: 'opened-selected-secrets-guide-passages',
    sourceScene: 'E1M2 Castle of the Damned — plaque mobile du pilier, Quake PC 1996', continuity: 'Original PC stone-plate secret mechanism, empty demonstration without the Quad Damage reward',
    mechanism: 'damned-column-inset-plate-linked-shutter', color: '#b1aa96', periodSeconds: 83,
    sceneEvidence: 'The opened German E1M2 secrets guide describes pressing the stone plate on the column to open a door beside it. A short-stroke plate links to an empty bounded shutter in an authored cutaway; no reward, secret counter, door collision or gameplay trigger changes.' }),
  scene({ id: 'sg2011-fgl-phonewave', universes: ['Steins;Gate'],
    scenePattern: /(?:future gadget lab|laboratoire.*gadgets|phonewave).*(?:microwave|micro.onde|plateau|2011)/i, excludedScenePattern: /steins.?gate.?0\b|2018|elite|reboot|worldline.*change|changement.*ligne/i,
    sourceWork: 'Steins;Gate (2011 anime), Future Gadget Laboratory Phone Microwave', sourceReference: 'https://www.transcripts.foreverdreaming.org/viewtopic.php?t=85145', sourceAccess: 'opened-selected-transcript-passages',
    sourceScene: 'Future Gadget Lab — plateau du Phone Microwave à vide, anime Steins Gate 2011', continuity: 'Original 2011 anime Phone Microwave, not Steins;Gate 0, Elite or a time-leap demonstration',
    mechanism: 'phonewave-empty-microwave-turntable', color: '#b2bcb1', periodSeconds: 67,
    sceneEvidence: 'The 2011 episode transcript explicitly discusses the Phone Microwave second edition and its phone connection. An empty microwave cabinet shows a turning platter and fixed phone cable as a functional prop study. Visible internals and idle operation are authored; no banana, gel body, D-mail, worldline or time-travel effect is simulated.' }),
  scene({ id: 'sg2011-braun-42crt', universes: ['Steins;Gate'],
    scenePattern: /(?:braun tube workshop|braun.*atelier|atelier.*braun).*(?:42|crt|cathod|2011)/i, excludedScenePattern: /steins.?gate.?0\b|2018|elite|reboot|ibn.?5100|worldline.*change/i,
    sourceWork: 'Steins;Gate (2011 anime), Braun Tube Workshop 42-inch CRT', sourceReference: 'https://singulary.exblog.jp/15777393/', sourceAccess: 'opened-selected-contemporary-analysis-passages',
    sourceScene: 'Braun Tube Workshop — téléviseur cathodique 42 pouces en coupe, anime 2011', continuity: '2011 anime downstairs 42-inch CRT; fan analysis supports its plot role, not an engineering reconstruction',
    mechanism: 'braun-crt-moving-raster-and-yoke', color: '#a8bea0', periodSeconds: 47,
    sceneEvidence: 'The contemporaneous June 2011 Japanese analysis identifies the downstairs 42-inch CRT as the PhoneWave lifter. A moving raster and fixed deflection-yoke cutaway interpret ordinary CRT operation. Geometry and scan speed are authored; no official engineering claim, message, character portrait, electron anomaly or worldline change is rendered.' }),
  scene({ id: 'minecraft-java121-village-grindstone', universes: ['Minecraft'],
    scenePattern: /(?:plains village|village.*plaines).*(?:grindstone|meule|java 1\.21)/i, excludedScenePattern: /bedrock|dungeons|story mode|modded|modpack|1\.12|destroyed|d[eé]truit/i,
    sourceWork: 'Minecraft Java Edition 1.21, ordinary plains-village grindstone block', sourceReference: 'https://www.minecraft.net/pl-pl/article/village---pillage-out-java-', sourceAccess: 'opened-official-selected-release-notes',
    sourceScene: 'Plains village — meule sur ses deux supports, Minecraft Java 1.21', continuity: 'Vanilla Java 1.21 block-function study; no unique canonical seed or automatic source block animation asserted',
    mechanism: 'village-grindstone-fixed-axle-block', color: '#aaba9d', periodSeconds: 59,
    sceneEvidence: 'The official Village and Pillage release notes establish the grindstone and its repair function. A voxel-edged wheel on two fixed supports demonstrates that function decoratively. Rotation and chosen village framing are authored, not an observed automatic vanilla animation; no item, enchantment, XP, villager body or world block changes.' }),
  scene({ id: 'minecraft-java121-mineshaft-cart', universes: ['Minecraft'],
    scenePattern: /(?:abandoned mineshaft|mine abandonn[eé]e).*(?:minecart|wagonnet|rail|java 1\.21)/i, excludedScenePattern: /bedrock|dungeons|story mode|modded|modpack|tnt|command block|destroyed|d[eé]truit/i,
    sourceWork: 'Minecraft Java Edition 1.21, abandoned mineshaft rails and minecart', sourceReference: 'https://www.minecraft.net/en-us/article/caves---cliffs--part-i-out-today-java', sourceAccess: 'opened-official-selected-release-notes',
    sourceScene: 'Abandoned mineshaft — wagonnet vide sur rails, Minecraft Java 1.21', continuity: 'Vanilla Java rail props in a mineshaft study; no canonical seed, chest loot, TNT or command cart',
    mechanism: 'mineshaft-empty-minecart-wheelbase', color: '#b5ac92', periodSeconds: 71,
    sceneEvidence: 'Official Java release notes explicitly mention mineshaft chest minecarts and supported mineshaft corridors. A plain empty cart moves between bounded stops on an authored timber-framed rail. The rail arrangement and return drive are adapted; no seed layout, loot chest, chest inventory, TNT, redstone or collision is created.' }),
  scene({ id: 'unreal1998-vortex-cargolift', universes: ['Unreal'],
    scenePattern: /vortex rikers.*(?:cargo|fret|lift|ascenseur|1998)/i, excludedScenePattern: /beta|alpha|1997|return to na pali|unreal.?2\b|ut99|tournament|destroyed|d[eé]truit/i,
    sourceWork: 'Unreal (1998 original release), Vortex Rikers cargo lift', sourceReference: 'https://unrealarchive.org/wikis/the-liandri-archives/Vortex_Rikers.html', sourceAccess: 'opened-selected-archived-walkthrough-passages',
    sourceScene: 'Vortex Rikers — ascenseur de fret vers la passerelle, Unreal original 1998', continuity: 'Released original cargo lift called from the console, not the early beta cargo ramp',
    mechanism: 'vortex-cargo-forklift-empty-platform', color: '#a4b5c4', periodSeconds: 79,
    sceneEvidence: 'The archived original walkthrough describes calling the cargo lift from a console and riding to the upper walkway. An empty broad lift deck rises in twin fork guides. Platform shape, visible drive and repeating test cycle are authored; no prisoners, gameplay console, route, inventory or actor elevation changes.' }),
  scene({ id: 'unreal1998-isvkran-ductfan', universes: ['Unreal'],
    scenePattern: /isv.kran.*(?:deck.?4|pont.?4).*(?:duct|fan|ventilat|conduit|1998)/i, excludedScenePattern: /beta|alpha|return to na pali|unreal.?2\b|ut99|tournament|destroyed|d[eé]truit/i,
    sourceWork: 'Unreal (1998 original), ISV-Kran Deck 4 lower ventilation duct', sourceReference: 'https://www.oldunreal.com/wiki/index.php?title=ISV-Kran_Deck_4', sourceAccess: 'opened-selected-walkthrough-passages',
    sourceScene: 'ISV-Kran Deck 4 — ventilateur derrière la grille du conduit inférieur, Unreal 1998', continuity: 'Original Deck 4 duct fan behind the grate, not the offline Deck 1 engine or a coolant simulation',
    mechanism: 'isvkran-duct-fan-offset-drive-shaft', color: '#a8beb8', periodSeconds: 53,
    sceneEvidence: 'The opened Deck 4 guide repeatedly identifies a spinning fan in the duct and a fan behind a grate near the upper walkway. An offset shaft drives an enclosed rotor behind fixed slats. Shaft exposure, dimensions and speed are authored; source corpse effects, coolant, grate activation and fan damage are excluded.' })
]);

export const WAVE_8_MODE_REFERENCE_SCENES = Object.freeze(Object.fromEntries(
  Array.from({ length: 20 }, (_, index) => {
    const [a, b] = STAGE_ANIMATION_WAVE_8.slice(index * 2, index * 2 + 2);
    return [a.universes[0], Object.freeze({ Combat: a.sourceScene, RPG: a.sourceScene, Melee: b.sourceScene, Tactics: b.sourceScene })];
  })
));

const TAU = Math.PI * 2;
const polar = (x, y, r, a) => [x + r * Math.cos(a), y + r * Math.sin(a)];
const line = (ctx, pts) => { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); };
const polygon = (ctx, pts) => { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.stroke(); };
const ellipse = (ctx, x, y, rx, ry, angle = 0) => { ctx.beginPath(); ctx.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), angle, 0, TAU); ctx.stroke(); };
const box = (ctx, x, y, w, h) => ctx.strokeRect(x, y, w, h);
const wheel = (ctx, x, y, r, a, n = 6) => { ellipse(ctx, x, y, r, r); for (let i = 0; i < n; i++) line(ctx, [[x, y], polar(x, y, r, a + i * TAU / n)]); };

// These keypoints are consumed directly by the renderer: tests measure the
// drawn rope, articulated tool links, wheelbase and coupling-rod constraints.
export function getStageAnimationWave8Geometry(mechanism, progress, w, h) {
  const a = progress * TAU, u = Math.min(w, h), s = Math.sin(a), c = Math.cos(a);
  if (mechanism === 'sorbet-sealed-jar-fixed-rope-swing') {
    const root = [w * .5, h * .16], length = u * .2, angle = Math.PI / 2 + .36 * s;
    return { root, end: polar(...root, length, angle), length };
  }
  if (mechanism === 'twine-empty-tram-fixed-diagonal-cable') {
    const start = [w * .23, h * .37], end = [w * .76, h * .19], t = (1 - c) / 2;
    const trolley = [start[0] + t * (end[0] - start[0]), start[1] + t * (end[1] - start[1])];
    return { start, end, trolley, cage: [trolley[0], trolley[1] + u * .07], hanger: u * .07, t };
  }
  if (mechanism === 'gama-kai-two-fixed-length-tool-arms') {
    return { arms: [-1, 1].map(side => {
      const root = [w * (.5 + side * .2), h * .2], lengths = [u * .12, u * .1];
      const elbow = polar(...root, lengths[0], side < 0 ? .6 + s * .25 : Math.PI - .6 - s * .25);
      const tip = polar(...elbow, lengths[1], Math.PI / 2 + side * (.35 + c * .22));
      return { root, elbow, tip, lengths };
    }) };
  }
  if (mechanism === 'slug-rolling-three-platform-traincar') {
    const center = [w * (.5 + .12 * s), h * .39], radius = u * .033, wheelbase = u * .22;
    const axles = [[center[0] - wheelbase / 2, center[1]], [center[0] + wheelbase / 2, center[1]]];
    return { axles, pins: axles.map(p => polar(...p, radius * .62, a * 2)), radius, wheelbase };
  }
  if (mechanism === 'sotenbori-ufo-gantry-empty-claw') {
    const carriage = [w * (.4 + .18 * (1 - c) / 2), h * .22], ropeLength = u * .16;
    return { carriage, claw: [carriage[0], carriage[1] + ropeLength], ropeLength };
  }
  if (mechanism === 'mammago-tow-drum-hovercraft-guide') {
    const drum = [w * .31, h * .3], end = [w * (.48 + .13 * (1 - c) / 2), h * .3];
    return { drum, end, cableLength: end[0] - drum[0] };
  }
  return null;
}

export function drawStageAnimationWave8(ctx, animation, frame, w, h) {
  const a = frame.phase, t = frame.progress, u = Math.min(w, h), s = Math.sin(a), c = Math.cos(a);
  const x = w * .5, y = h * .33;
  ctx.globalAlpha = .16;
  switch (animation.mechanism) {
    case 'tcar-four-wheel-empty-test-rig': {
      polygon(ctx, [[x-u*.19,y],[x-u*.13,y-u*.06],[x+u*.09,y-u*.06],[x+u*.18,y],[x+u*.21,y+u*.045],[x-u*.21,y+u*.045]]);
      box(ctx,x-u*.07,y-u*.05,u*.11,u*.035);
      for (const dx of [-.13,.13]) { wheel(ctx,x+u*dx,y+u*.045,u*.045,a*2,5); wheel(ctx,x+u*dx-u*.022,y+u*.104,u*.018,-a*5,3); wheel(ctx,x+u*dx+u*.022,y+u*.104,u*.018,-a*5,3); }
      line(ctx,[[x-u*.24,y+u*.13],[x+u*.24,y+u*.13]]); break;
    }
    case 'deepsix-tsub-ducted-screws': {
      const drift=u*.018*s; ellipse(ctx,x,y+drift,u*.19,u*.065); polygon(ctx,[[x-u*.08,y-u*.05+drift],[x-u*.045,y-u*.1+drift],[x+u*.06,y-u*.1+drift],[x+u*.09,y-u*.05+drift]]);
      for(const dx of [-.14,.14]) { ellipse(ctx,x+u*dx,y+u*.065+drift,u*.046,u*.026); wheel(ctx,x+u*dx,y+u*.065+drift,u*.021,a*(dx<0?2:-2),4); }
      for(const dx of [-.075,0,.075]) ellipse(ctx,x+u*dx,y+drift,u*.021,u*.021); break;
    }
    case 'pocketcircuit-miniature-banked-oval': {
      for(const r of [.9,1,1.1]) ellipse(ctx,x,y,w*.28*r,h*.11*r);
      for(let i=0;i<2;i++){const theta=a+i*Math.PI,r=i?.96:1.04,cx=x+w*.28*r*Math.cos(theta),cy=y+h*.11*r*Math.sin(theta);box(ctx,cx-u*.035,cy-u*.014,u*.07,u*.028);for(const dx of [-.025,.025])ellipse(ctx,cx+u*dx,cy+u*.02,u*.008,u*.008);line(ctx,[[cx-u*.032,cy],[cx+u*.032,cy]]);} break;
    }
    case 'sotenbori-ufo-gantry-empty-claw': {
      const g=getStageAnimationWave8Geometry(animation.mechanism,t,w,h);box(ctx,w*.32,h*.17,w*.36,h*.31);line(ctx,[[w*.34,g.carriage[1]],[w*.66,g.carriage[1]]]);box(ctx,g.carriage[0]-u*.025,g.carriage[1]-u*.014,u*.05,u*.028);line(ctx,[g.carriage,g.claw]);
      for(const side of [-1,1]){const tip=polar(...g.claw,u*.058,Math.PI/2+side*(.25+.3*(1-c)/2));line(ctx,[g.claw,tip,[tip[0]-side*u*.012,tip[1]+u*.014]]);} break;
    }
    case 'kakiage-pressure-plate-oil-valve': {
      const plateY=h*.43+u*.014*(1-c)/2,pivot=[w*.49,h*.34],tip=polar(...pivot,u*.07,-Math.PI/2+.3*s);
      box(ctx,w*.29,plateY,u*.13,u*.018);line(ctx,[[w*.29+u*.065,plateY],[w*.29+u*.065,h*.36],tip,pivot]);box(ctx,w*.56,h*.2,u*.14,u*.15);line(ctx,[[w*.56+u*.07,h*.35],[w*.56+u*.07,h*.4],[w*.49,h*.4],pivot]);wheel(ctx,...pivot,u*.022,a*.2,4);box(ctx,w*.56+u*.035,h*.36+u*.008*s,u*.07,u*.014);break;
    }
    case 'sorbet-sealed-jar-fixed-rope-swing': {
      const g=getStageAnimationWave8Geometry(animation.mechanism,t,w,h);line(ctx,[[g.root[0]-u*.08,g.root[1]],[g.root[0]+u*.08,g.root[1]]]);line(ctx,[g.root,g.end]);
      box(ctx,g.end[0]-u*.026,g.end[1],u*.052,u*.065);box(ctx,g.end[0]-u*.031,g.end[1]-u*.009,u*.062,u*.012);line(ctx,[[g.end[0]-u*.022,g.end[1]+u*.04],[g.end[0]+u*.022,g.end[1]+u*.04]]);break;
    }
    case 'mercy-rooftop-empty-helicopter-rotors': {
      ellipse(ctx,x,y,u*.13,u*.055);polygon(ctx,[[x-u*.1,y-u*.02],[x-u*.25,y-u*.044],[x-u*.25,y+u*.005],[x-u*.1,y+u*.025]]);line(ctx,[[x,y-u*.05],[x,y-u*.1]]);const hub=[x,y-u*.1];line(ctx,[polar(...hub,u*.2,a),polar(...hub,u*.2,a+Math.PI)]);line(ctx,[polar(...hub,u*.14,a+Math.PI/2),polar(...hub,u*.14,a+Math.PI*1.5)]);wheel(ctx,x-u*.24,y-u*.03,u*.033,-a*3,4);for(const side of [-1,1])line(ctx,[[x+side*u*.07,y+u*.04],[x+side*u*.09,y+u*.08],[x+side*u*.15,y+u*.08]]);break;
    }
    case 'deathtoll-fishing-vessel-moored-drum': {
      const drift=u*.012*s;polygon(ctx,[[x-u*.19,y+drift],[x+u*.2,y+drift],[x+u*.13,y+u*.065+drift],[x-u*.13,y+u*.065+drift]]);box(ctx,x-u*.035,y-u*.075+drift,u*.1,u*.075);box(ctx,x-u*.018,y-u*.06+drift,u*.05,u*.03);wheel(ctx,x+u*.11,y-u*.025+drift,u*.025,a,6);line(ctx,[[w*.25,h*.27],[x-u*.19,y+drift]]);line(ctx,[[w*.25,h*.19],[w*.25,h*.47]]);break;
    }
    case 'assault-security-horizontal-door-guide': {
      const left=w*.39,top=h*.2,travel=u*.11*(1-c)/2;box(ctx,left,top,u*.22,h*.28);line(ctx,[[left-u*.02,top-u*.025],[left+u*.35,top-u*.025]]);box(ctx,left+travel,top+u*.01,u*.2,h*.25);for(const dx of [.025,.175])wheel(ctx,left+travel+u*dx,top-u*.014,u*.012,a,3);box(ctx,left+travel+u*.15,top+u*.08,u*.013,u*.027);break;
    }
    case 'nuke-source-generator-section-rotor': {
      box(ctx,x-u*.18,y-u*.09,u*.36,u*.18);ellipse(ctx,x,y,u*.105,u*.075);for(let i=0;i<9;i++){const q=a+i*TAU/9;line(ctx,[[x+u*.09*Math.cos(q),y+u*.06*Math.sin(q)],[x+u*.055*Math.cos(q+.3),y+u*.04*Math.sin(q+.3)]]);}line(ctx,[[x-u*.23,y],[x+u*.24,y]]);for(const dx of [-.21,.21])box(ctx,x+u*dx-u*.012,y-u*.025,u*.024,u*.11);break;
    }
    case 'moxxi-three-reels-blank-maintenance': {
      box(ctx,x-u*.18,y-u*.13,u*.36,u*.27);for(let i=0;i<3;i++){const cx=x+u*(i-1)*.105;box(ctx,cx-u*.042,y-u*.085,u*.084,u*.17);for(let j=0;j<5;j++){const q=a*(i+1)+j*TAU/5;const yy=y+u*.072*Math.sin(q);line(ctx,[[cx-u*.033,yy],[cx+u*.033,yy]]);}}break;
    }
    case 'lynchwood-mine-lift-chain-cage': {
      const cy=h*(.25+.12*(1-c)/2);for(const dx of [-.055,.055]){line(ctx,[[x+u*dx,h*.16],[x+u*dx,h*.51]]);for(let j=0;j<9;j++){const yy=h*.17+((j/9+t)%1)*h*.3;ellipse(ctx,x+u*dx,yy,u*.006,u*.011);}}box(ctx,x-u*.08,cy,u*.16,u*.095);for(let j=1;j<4;j++)line(ctx,[[x-u*.08+j*u*.04,cy],[x-u*.08+j*u*.04,cy+u*.095]]);wheel(ctx,x,h*.15,u*.035,a,6);break;
    }
    case 'carnival-empty-coaster-connected-carts': {
      ellipse(ctx,x,y,w*.29,h*.11);ellipse(ctx,x,y,w*.29,h*.11+u*.014);for(let i=0;i<3;i++){const q=a-i*.2,cx=x+w*.29*Math.cos(q),cy=y+h*.11*Math.sin(q);polygon(ctx,[[cx-u*.04,cy-u*.035],[cx+u*.04,cy-u*.035],[cx+u*.03,cy],[cx-u*.03,cy]]);for(const dx of [-.025,.025])wheel(ctx,cx+u*dx,cy+u*.009,u*.012,a*3,4);if(i<2)line(ctx,[[cx-u*.04,cy-u*.01],[x+w*.29*Math.cos(q-.2)+u*.04,y+h*.11*Math.sin(q-.2)-u*.01]]);}break;
    }
    case 'railroad-handcart-two-end-controls': {
      const cx=x+w*.13*s;line(ctx,[[w*.26,y+u*.09],[w*.77,y+u*.09]]);box(ctx,cx-u*.16,y,u*.32,u*.035);for(const side of [-1,1]){wheel(ctx,cx+side*u*.11,y+u*.065,u*.025,a*3,5);line(ctx,[[cx+side*u*.14,y],[cx+side*u*.14,y-u*.055]]);wheel(ctx,cx+side*u*.14,y-u*.065,u*.022,side*a,4);}break;
    }
    case 'akuda-disk-table-empty-puck-guides': {
      polygon(ctx,[[w*.3,h*.25],[w*.69,h*.25],[w*.75,h*.45],[w*.24,h*.45]]);line(ctx,[[w*.495,h*.25],[w*.495,h*.45]]);for(let i=0;i<2;i++){const cx=w*(.38+i*.23)+u*.025*Math.sin(a+i*Math.PI),cy=h*(.3+.1*(1+Math.cos(a+i*Math.PI))/2);ellipse(ctx,cx,cy,u*.026,u*.009);line(ctx,[[cx-u*.025,cy],[cx-u*.025,cy+u*.008],[cx+u*.025,cy+u*.008],[cx+u*.025,cy]]);}break;
    }
    case 'mammago-tow-drum-hovercraft-guide': {
      const g=getStageAnimationWave8Geometry(animation.mechanism,t,w,h);wheel(ctx,...g.drum,u*.035,a*2,7);line(ctx,[g.drum,g.end]);const [cx,cy]=g.end;ellipse(ctx,cx+u*.105,cy+u*.028,u*.13,u*.038);box(ctx,cx+u*.07,cy-u*.035,u*.09,u*.05);ellipse(ctx,cx+u*.105,cy+u*.04,u*.14,u*.035);line(ctx,[[g.drum[0],g.drum[1]+u*.035],[g.drum[0],h*.48]]);break;
    }
    case 'twine-empty-tram-fixed-diagonal-cable': {
      const g=getStageAnimationWave8Geometry(animation.mechanism,t,w,h);line(ctx,[g.start,g.end]);wheel(ctx,...g.trolley,u*.018,a,4);line(ctx,[g.trolley,g.cage]);const [cx,cy]=g.cage;polygon(ctx,[[cx-u*.045,cy],[cx+u*.045,cy],[cx+u*.055,cy+u*.06],[cx-u*.055,cy+u*.06]]);line(ctx,[[cx,cy],[cx,cy+u*.06]]);for(const p of [g.start,g.end])line(ctx,[[p[0],h*.51],p]);break;
    }
    case 'mysteryvortex-three-magnet-selector-levers': {
      for(let i=0;i<3;i++){const cx=w*(.34+i*.16),cy=h*.29;polygon(ctx,[[cx-u*.05,cy+u*.07],[cx-u*.05,cy-u*.07],[cx+u*.05,cy-u*.07],[cx+u*.05,cy+u*.07],[cx+u*.023,cy+u*.07],[cx+u*.023,cy-u*.04],[cx-u*.023,cy-u*.04],[cx-u*.023,cy+u*.07]]);const root=[cx,cy+u*.12],tip=polar(...root,u*.043,-Math.PI/2+.3*Math.sin(a+i*TAU/3));line(ctx,[root,tip]);ellipse(ctx,...tip,u*.007,u*.007);}break;
    }
    case 'lonzo-espresso-tank-tray-linkage': {
      box(ctx,x-u*.12,y-u*.08,u*.24,u*.18);const lidRoot=[x-u*.08,y-u*.08],lidEnd=polar(...lidRoot,u*.15,-.28*(1-c)/2);line(ctx,[lidRoot,lidEnd]);const shift=u*.08*(1-c)/2;box(ctx,x-u*.09+shift,y+u*.045,u*.18,u*.018);ellipse(ctx,x+u*.075,y-u*.01,u*.017,u*.017);line(ctx,[[x-u*.12,y+u*.1],[x+u*.14,y+u*.1]]);break;
    }
    case 'kuvaq-two-speed-empty-postal-belts': {
      for(let i=0;i<2;i++){const left=w*(.28+i*.27),cy=h*(.29+i*.08),length=w*.2;line(ctx,[[left,cy],[left+length,cy],[left+length,cy+u*.035],[left,cy+u*.035],[left,cy]]);for(const dx of [0,length])wheel(ctx,left+dx,cy+u*.018,u*.018,a*(i?3:1),5);for(let j=0;j<8;j++){const q=(j/8+t*(i?3:1))%1;line(ctx,[[left+length*q,cy],[left+length*q,cy+u*.035]]);}}break;
    }
    case 'paris-light-rig-restrained-winch': {
      const left=w*.28,right=w*.73,top=h*.22;box(ctx,left,top,right-left,u*.03);for(let i=0;i<7;i++)line(ctx,[[left+(right-left)*i/7,top],[left+(right-left)*(i+1)/7,top+u*.03]]);for(const cx of [left,right])line(ctx,[[cx,h*.14],[cx,top]]);for(let i=0;i<5;i++){const cx=left+(right-left)*(i+.5)/5;line(ctx,[[cx,top+u*.03],[cx,h*.34]]);box(ctx,cx-u*.015,h*.34,u*.03,u*.025);}wheel(ctx,x,h*.17,u*.032,a,7);line(ctx,[polar(x,h*.17,u*.023,a),polar(x,h*.17,u*.046,a)]);break;
    }
    case 'gama-kai-two-fixed-length-tool-arms': {
      const g=getStageAnimationWave8Geometry(animation.mechanism,t,w,h);for(const arm of g.arms){box(ctx,arm.root[0]-u*.025,arm.root[1]-u*.02,u*.05,u*.04);line(ctx,[arm.root,arm.elbow,arm.tip]);ellipse(ctx,...arm.elbow,u*.015,u*.015);ellipse(ctx,...arm.tip,u*.009,u*.009);line(ctx,[arm.tip,[arm.tip[0],arm.tip[1]+u*.025]]);}box(ctx,x-u*.12,h*.45,u*.24,u*.025);break;
    }
    case 'abandonedmine-opposed-empty-crusher-rolls': {
      polygon(ctx,[[x-u*.18,y-u*.14],[x+u*.18,y-u*.14],[x+u*.11,y+u*.08],[x-u*.11,y+u*.08]]);for(const side of [-1,1]){const cx=x+side*u*.065;wheel(ctx,cx,y,u*.06,-side*a,8);for(let j=0;j<8;j++){const q=-side*a+j*TAU/8;line(ctx,[polar(cx,y,u*.052,q),polar(cx,y,u*.068,q)]);}}line(ctx,[[x-u*.11,y+u*.08],[x-u*.11,h*.49],[x+u*.11,h*.49],[x+u*.11,y+u*.08]]);break;
    }
    case 'geothermal-twin-bearing-turbine-shaft': {
      line(ctx,[[w*.29,y],[w*.75,y]]);for(let i=0;i<2;i++){const cx=w*(.4+i*.22);ellipse(ctx,cx,y,u*.065,u*.1);for(let j=0;j<10;j++){const q=a+j*TAU/10;line(ctx,[[cx+u*.05*Math.cos(q),y+u*.085*Math.sin(q)],[cx+u*.018*Math.cos(q+.3),y+u*.04*Math.sin(q+.3)]]);}box(ctx,cx-u*.08,y+u*.105,u*.16,u*.025);}break;
    }
    case 'arrival-empty-platform-screw-guide': {
      const cy=h*(.26+.12*(1-c)/2);for(const dx of [-.08,.08])line(ctx,[[x+u*dx,h*.18],[x+u*dx,h*.51]]);line(ctx,[[x,h*.17],[x,h*.49]]);for(let j=0;j<13;j++){const yy=h*.18+j*h*.022;line(ctx,[[x-u*.012*Math.cos(a),yy],[x+u*.012*Math.cos(a),yy+u*.01]]);}box(ctx,x-u*.11,cy,u*.22,u*.026);box(ctx,x-u*.025,cy-u*.016,u*.05,u*.016);break;
    }
    case 'colony-seven-independent-height-columns': {
      for(let i=0;i<7;i++){const cx=w*(.29+i*.067),top=h*(.27+.1*(1+Math.cos(a+i*.4))/2);box(ctx,cx,top,w*.046,h*.49-top);line(ctx,[[cx,top+u*.014],[cx+w*.046,top+u*.014]]);}line(ctx,[[w*.27,h*.5],[w*.78,h*.5]]);break;
    }
    case 'insidious-recessed-rotor-behind-grating': {
      ellipse(ctx,x,y,u*.15,u*.15);for(let i=0;i<6;i++){const q=a+i*TAU/6;polygon(ctx,[polar(x,y,u*.027,q),polar(x,y,u*.13,q+.35),polar(x,y,u*.13,q+.63),polar(x,y,u*.04,q+.3)]);}for(let i=-4;i<=4;i++)line(ctx,[[x+u*i*.03,y-u*.15],[x+u*i*.03,y+u*.15]]);box(ctx,x-u*.17,y-u*.17,u*.34,u*.34);break;
    }
    case 'convoy-articulated-trailer-wheel-bogies': {
      const cy=y+u*.025*s;for(let i=0;i<2;i++){const cx=w*(.36+i*.29);box(ctx,cx-u*.13,cy-u*.065,u*.26,u*.09);for(const side of [-1,1]){wheel(ctx,cx+side*u*.075,cy+u*.06,u*.033,a*3,7);line(ctx,[[cx+side*u*.075,cy+u*.027],[cx,cy+u*.015]]);}if(i===0)line(ctx,[[cx+u*.13,cy],[w*.65-u*.13,cy]]);}line(ctx,[[w*.23,y+u*.13],[w*.81,y+u*.13]]);break;
    }
    case 'jungle-empty-sv001-track-idlers': {
      polygon(ctx,[[x-u*.17,y-u*.025],[x-u*.12,y-u*.075],[x+u*.09,y-u*.075],[x+u*.16,y-u*.025],[x+u*.16,y+u*.025],[x-u*.17,y+u*.025]]);box(ctx,x-u*.06,y-u*.105,u*.13,u*.03);line(ctx,[[x+u*.07,y-u*.09],[x+u*.18,y-u*.09]]);for(let j=0;j<5;j++)wheel(ctx,x+u*(-.13+j*.065),y+u*.055,u*.027,a*2,6);box(ctx,x-u*.165,y+u*.024,u*.33,u*.065);for(let j=0;j<12;j++){const xx=x-u*.16+((j/12+t)%1)*u*.32;line(ctx,[[xx,y+u*.087],[xx+u*.012,y+u*.087]]);}break;
    }
    case 'slug-rolling-three-platform-traincar': {
      const g=getStageAnimationWave8Geometry(animation.mechanism,t,w,h);for(const p of g.axles)wheel(ctx,...p,g.radius,a*2,6);line(ctx,g.pins);for(let i=0;i<2;i++)line(ctx,[g.axles[i],g.pins[i]]);box(ctx,g.axles[0][0]-u*.045,g.axles[0][1]-u*.045,g.wheelbase+u*.09,u*.025);for(let i=0;i<3;i++){const cx=g.axles[0][0]+g.wheelbase*i/2,top=g.axles[0][1]-u*(.09+.045*(1+Math.sin(a+i*TAU/3))/2);line(ctx,[[cx,g.axles[0][1]-u*.045],[cx,top]]);box(ctx,cx-u*.045,top,u*.09,u*.015);}line(ctx,[[w*.25,h*.39+u*.034],[w*.78,h*.39+u*.034]]);break;
    }
    case 'spacerider-empty-coaster-vertical-oval': {
      ellipse(ctx,x,y,w*.26,h*.12);for(const dx of [-.2,0,.2])line(ctx,[[x+w*dx,h*.5],[x+w*dx,y-h*.07]]);for(let i=0;i<2;i++){const q=a+i*Math.PI,cx=x+w*.26*Math.cos(q),cy=y+h*.12*Math.sin(q);polygon(ctx,[[cx-u*.04,cy-u*.04],[cx+u*.04,cy-u*.04],[cx+u*.033,cy],[cx-u*.033,cy]]);for(const dx of [-.025,.025])wheel(ctx,cx+u*dx,cy+u*.012,u*.012,a*2,4);}break;
    }
    case 'playpark-four-sail-display-windmill': {
      polygon(ctx,[[x-u*.07,h*.49],[x-u*.035,h*.22],[x+u*.035,h*.22],[x+u*.07,h*.49]]);polygon(ctx,[[x-u*.06,h*.22],[x,h*.16],[x+u*.06,h*.22]]);for(let i=0;i<4;i++){const q=a+i*TAU/4;polygon(ctx,[polar(x,y,u*.022,q),polar(x,y,u*.13,q),polar(x,y,u*.13,q+.22),polar(x,y,u*.045,q+.3)]);}ellipse(ctx,x,y,u*.02,u*.02);break;
    }
    case 'slipgate-cave-recessed-single-lift': {
      const cy=h*(.25+.16*(1-c)/2);polygon(ctx,[[x-u*.16,h*.49],[x-u*.16,h*.21],[x-u*.1,h*.16],[x+u*.12,h*.16],[x+u*.16,h*.23],[x+u*.16,h*.49]]);box(ctx,x-u*.13,cy,u*.26,u*.027);for(const side of [-1,1])line(ctx,[[x+side*u*.115,h*.2],[x+side*u*.115,h*.47]]);line(ctx,[[x-u*.16,h*.49],[x+u*.16,h*.49]]);break;
    }
    case 'damned-column-inset-plate-linked-shutter': {
      const inset=u*.012*(1-c)/2;box(ctx,w*.35,h*.18,u*.09,h*.31);box(ctx,w*.35+u*.018+inset,h*.31,u*.048,u*.04);box(ctx,w*.57,h*.21,u*.16,h*.27);box(ctx,w*.57+u*.014,h*.22,u*.132,h*(.06+.18*(1+c)/2));line(ctx,[[w*.35+u*.066+inset,h*.33],[w*.52,h*.33],[w*.52,h*.18],[w*.57+u*.08,h*.18],[w*.57+u*.08,h*.22]]);break;
    }
    case 'phonewave-empty-microwave-turntable': {
      box(ctx,x-u*.18,y-u*.1,u*.36,u*.2);box(ctx,x-u*.16,y-u*.08,u*.24,u*.16);ellipse(ctx,x-u*.045,y+u*.035,u*.085,u*.024);line(ctx,[polar(x-u*.045,y+u*.035,u*.07,a).map((v,i)=>i===1?y+u*.035+(v-(y+u*.035))*.28:v),[x-u*.045,y+u*.035]]);box(ctx,x+u*.1,y-u*.065,u*.045,u*.025);wheel(ctx,x+u*.122,y+u*.03,u*.022,a*.2,4);box(ctx,x+u*.2,y-u*.12,u*.055,u*.09);line(ctx,[[x+u*.2,y-u*.05],[x+u*.18,y-u*.05],[x+u*.18,y+u*.08]]);break;
    }
    case 'braun-crt-moving-raster-and-yoke': {
      box(ctx,x-u*.18,y-u*.12,u*.36,u*.24);box(ctx,x-u*.155,y-u*.095,u*.245,u*.18);const scan=y-u*.08+u*.15*(1-c)/2;line(ctx,[[x-u*.14,scan],[x+u*.075,scan]]);polygon(ctx,[[x+u*.1,y-u*.075],[x+u*.155,y-u*.018],[x+u*.155,y+u*.018],[x+u*.1,y+u*.075]]);for(let i=0;i<4;i++)ellipse(ctx,x+u*(.11+i*.012),y,u*.008,u*(.055-i*.01));line(ctx,[[x+u*.155,y],[x+u*.03,scan]]);break;
    }
    case 'village-grindstone-fixed-axle-block': {
      const r=u*.085;for(const side of [-1,1]){box(ctx,x+side*u*.09-u*.018,y,u*.036,u*.16);box(ctx,x+side*u*.09-u*.035,y+u*.14,u*.07,u*.025);}ellipse(ctx,x,y,r,r);line(ctx,[[x-u*.12,y],[x+u*.12,y]]);for(let i=0;i<8;i++){const q=a+i*TAU/8;line(ctx,[polar(x,y,r*.78,q),polar(x,y,r,q)]);}box(ctx,x-u*.014,y-u*.014,u*.028,u*.028);break;
    }
    case 'mineshaft-empty-minecart-wheelbase': {
      const cx=x+w*.13*s;for(const dx of [-.23,.23]){box(ctx,x+w*dx-u*.025,h*.17,u*.05,h*.34);}box(ctx,x-w*.23,h*.17,w*.46,u*.035);line(ctx,[[w*.25,h*.43],[w*.78,h*.43]]);for(let i=0;i<12;i++)box(ctx,w*(.26+i*.043),h*.43,u*.024,u*.012);polygon(ctx,[[cx-u*.085,y-u*.04],[cx+u*.085,y-u*.04],[cx+u*.065,y+u*.03],[cx-u*.065,y+u*.03]]);for(const dx of [-.05,.05])wheel(ctx,cx+u*dx,y+u*.055,u*.023,a*3,4);break;
    }
    case 'vortex-cargo-forklift-empty-platform': {
      const cy=h*(.27+.13*(1-c)/2);for(const side of [-1,1]){box(ctx,x+side*u*.15-u*.012,h*.17,u*.024,h*.32);box(ctx,x+side*u*.15-u*.024,cy-u*.05,u*.048,u*.08);}box(ctx,x-u*.21,cy,u*.42,u*.025);for(let i=0;i<5;i++)line(ctx,[[x-u*.18+i*u*.09,cy],[x-u*.16+i*u*.09,cy+u*.025]]);line(ctx,[[x,h*.17],[x,cy]]);wheel(ctx,x,h*.16,u*.025,a,6);break;
    }
    case 'isvkran-duct-fan-offset-drive-shaft': {
      box(ctx,x-u*.17,y-u*.15,u*.34,u*.3);ellipse(ctx,x,y,u*.115,u*.115);for(let i=0;i<5;i++){const q=-a+i*TAU/5;polygon(ctx,[polar(x,y,u*.02,q),polar(x,y,u*.1,q+.2),polar(x,y,u*.1,q+.55),polar(x,y,u*.035,q+.35)]);}for(let i=-3;i<=3;i++)line(ctx,[[x-u*.15,y+i*u*.037],[x+u*.15,y+i*u*.037]]);line(ctx,[[x,y],[x+u*.22,y],[x+u*.22,y-u*.11]]);wheel(ctx,x+u*.22,y-u*.11,u*.026,-a*2,5);break;
    }
    default: return false;
  }
  return true;
}
