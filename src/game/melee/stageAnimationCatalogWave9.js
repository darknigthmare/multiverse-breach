// Locations and functions below have narrow references. Every outline, exposed
// drive, distance, maintenance loop and duration is authored, not a source frame.
const scene = definition => Object.freeze({
  ...definition, animationWave: 9,
  animationProvenance: 'authored-scene-mechanism-geometry-and-timing',
  renderingKind: 'authored-mechanism', localBackdrops: Object.freeze({}),
  timeSource: 'simulation-elapsed-seconds', reducedMotionBehavior: 'freeze-at-time-zero',
  sourceVisualValidation: 'not-validated-1:1', fidelityVerified: false,
  officialSourceFrames: false, gameplayEffect: 'none'
});
export const STAGE_ANIMATION_WAVE_9 = Object.freeze([
  scene({ id:'sga2004-rising-jumperbay-hatch', universes:['Stargate Atlantis'],
    scenePattern:/(?:atlantis|rising|jumper bay).*(?:ceiling|plafond|trappe|hatch|2004)/i, excludedScenePattern:/universe|destiny|sg.?1\b|siege|si[eè]ge|destroyed|d[eé]truit/i,
    sourceWork:'Stargate Atlantis (2004), Rising, ceiling between Jumper Bay and Gate Room', sourceReference:'https://stargate-sg1-solutions.com/wiki/SGA_1.01_%22Rising_Parts_1_And_2%22_Transcript', sourceAccess:'opened-selected-transcript-passages',
    sourceScene:'Atlantis Jumper Bay — trappe du plafond du Gate Room, Rising 2004', continuity:'Original Rising hangar opening before any siege; no Stargate portal is drawn',
    mechanism:'atlantis-jumperbay-eight-sliding-hatch-leaves', color:'#a6c2cf', periodSeconds:71,
    sceneEvidence:'The opened transcript explicitly retracts the ceiling while the jumper lowers into the Gate Room. Eight rigid sliding leaves interpret that access function. Leaf count, overhead projection, drives and repeated empty test cycle are authored; no craft, occupant, wormhole, transport or collision surface is created.' }),
  scene({ id:'sga2004-thirtyeight-pod-test', universes:['Stargate Atlantis'],
    scenePattern:/(?:thirty.eight minutes|trente.huit minutes|jumper one).*(?:pod|nacelle|r[eé]tract|2004)/i, excludedScenePattern:/universe|destiny|sg.?1\b|jammed|bloqu[eé]|failed|panne|damaged|endommag|destroyed|d[eé]truit/i,
    sourceWork:'Stargate Atlantis (2004), Thirty-Eight Minutes, Puddle Jumper One retractable drive pods', sourceReference:'https://stargate-sg1-solutions.com/wiki/SGA_1.04_%22Thirty-Eight_Minutes%22_Transcript', sourceAccess:'opened-selected-transcript-passages',
    sourceScene:'Thirty-Eight Minutes — nacelles du Jumper One en essai après réparation, 2004', continuity:'Recovered retracting-pod function, not the jammed/damaged state inside the Stargate',
    mechanism:'jumperone-opposed-retracting-drive-pods', color:'#b0c3b7', periodSeconds:83,
    sceneEvidence:'The transcript distinguishes retracting drive pods from the right pod that stops short. An empty hull has two opposed guided pods in a repaired maintenance interpretation. Exact pod outlines, stroke and repeat are authored; the jam, event horizon, injuries, passengers and emergency countdown are excluded.' }),
  scene({ id:'sgu2009-destiny-wholegate-bearing', universes:['Stargate Universe'],
    scenePattern:/(?:destiny\s+stargate\b|destiny.*(?:gate bearing|porte.*roulement|anneau complet))/i, excludedScenePattern:/atlantis|pegasus|p[eé]gase|sg.?1\b|inner ring only|anneau interne seul|destroyed|d[eé]truit/i,
    sourceWork:'Stargate Universe (2009), Destiny Stargate and fixed gate bearing', sourceReference:'https://stargate.fandom.com/wiki/Destiny', sourceAccess:'indexed-excerpt-only-open-failed',
    sourceScene:'Destiny Stargate — anneau complet dans son roulement fixe, Air 2009', continuity:'Destiny whole rotating gate with chevrons moving with it; not a Pegasus electronic glyph ring',
    mechanism:'destiny-whole-annulus-and-fixed-bearing', color:'#b3b8a8', periodSeconds:61,
    sceneEvidence:'The indexed Destiny reference explicitly rotates the entire gate including chevrons and distinguishes its fixed bearing. Hardware marks turn together within a stationary support. Glyph design, reversal timing and continuous empty cycle are authored; there is no address, opening, water surface, portal, teleport or gameplay lock.' }),
  scene({ id:'sgu2009-destiny-shuttle-clamps', universes:['Stargate Universe'],
    scenePattern:/destiny.*(?:shuttle|navette).*(?:dock|clamp|arrim|2009)/i, excludedScenePattern:/atlantis|puddle jumper|sg.?1\b|detached|d[eé]tach[eé]|destroyed|d[eé]truit/i,
    sourceWork:'Stargate Universe (2009), Destiny shuttle docking clamps', sourceReference:'https://stargate.fandom.com/wiki/Destiny', sourceAccess:'indexed-excerpt-only-open-failed',
    sourceScene:'Destiny shuttle — pinces du sas d’arrimage, Stargate Universe 2009', continuity:'Original Destiny docking hardware, empty clamp test while the docking collar stays fixed',
    mechanism:'destiny-shuttle-two-articulated-docking-clamps', color:'#b8afa0', periodSeconds:79,
    sceneEvidence:'The indexed ship reference specifically requires secure shuttle docking clamps during attached flight. Two rigid two-link clamps move around a fixed collar in an authored unloaded test. Exact joint construction and repeat are not verified; no shuttle separation, person, atmosphere, pressure, FTL transition or transport is simulated.' }),
  scene({ id:'999-steamengine-three-gears', universes:['Zero Escape: The Nonary Games'],
    scenePattern:/(?:999|steam engine room|salle.*machines).*(?:gear|engrenage|steam|vapeur)/i, excludedScenePattern:/virtue.?s last reward|zero time dilemma|vlr|ztd|explosion|destroyed|d[eé]truit/i,
    sourceWork:'999: Nine Hours, Nine Persons, Nine Doors, The Nonary Games (2017), Steam Engine Room', sourceReference:'https://steamcommunity.com/sharedfiles/filedetails/?id=2462042210', sourceAccess:'opened-selected-walkthrough-passages',
    sourceScene:'999 Steam Engine Room — trois roues à disques métalliques, The Nonary Games 2017', continuity:'999 room in the 2017 collection; not Virtue’s Last Reward or Zero Time Dilemma',
    mechanism:'nonary-steam-three-disc-gears', color:'#bba88b', periodSeconds:59,
    sceneEvidence:'The guide operates a sliding switch to rotate gear wheels and retrieves three metal discs. Three equal empty gears turn in alternating directions with meshed pitch circles. Tooth count, exposed bearings and service cycle are authored; no coal consumption, disc reward, puzzle solution, door unlock or escape state changes.' }),
  scene({ id:'999-firstclass-piano-action', universes:['Zero Escape: The Nonary Games'],
    scenePattern:/(?:999|1st class cabin|first.class cabin|cabine.*premi[eè]re).*(?:piano|touches|keyboard)/i, excludedScenePattern:/virtue.?s last reward|zero time dilemma|vlr|ztd|code.*solved|solution|destroyed|d[eé]truit/i,
    sourceWork:'999: Nine Hours, Nine Persons, Nine Doors, The Nonary Games (2017), 1st Class Cabin piano', sourceReference:'https://steamcommunity.com/sharedfiles/filedetails/?id=2462042210', sourceAccess:'opened-selected-walkthrough-passages',
    sourceScene:'999 1st Class Cabin — mécanique des touches du piano, The Nonary Games 2017', continuity:'999 first-class cabin piano before the puzzle is solved; no score or key-code transcription',
    mechanism:'nonary-piano-three-empty-key-levers', color:'#b8b9ad', periodSeconds:73,
    sceneEvidence:'The opened guide identifies the cabin piano and its key puzzle. Three plain key levers and their fixed-length action links demonstrate a mechanical return. Layout, colors, selected idle keys and timing are authored; no source solution sequence, sheet music, sound, character hands or puzzle flag is reproduced.' }),
  scene({ id:'mirrors2008-jacknife-valve', universes:["Mirror's Edge"],
    scenePattern:/jacknife.*(?:storm|drain|valve|vanne|2008)/i, excludedScenePattern:/catalyst|2016|shard|malfunctioning|broken|cass[eé]|destroyed|d[eé]truit/i,
    sourceWork:'Mirror’s Edge (2008 original), chapter 2 Jacknife storm-drain steam valve', sourceReference:'https://dl.gamesradar.com/guides/mirrorsedgeguide.pdf', sourceAccess:'opened-selected-pdf-text-passages',
    sourceScene:'Jacknife — vanne du conduit après le storm drain, Mirror’s Edge original 2008', continuity:'Chapter 2 valve, not the explosive gas valve at the Shard or Catalyst equipment',
    mechanism:'jacknife-fixed-stem-handwheel-valve', color:'#b4c5c2', periodSeconds:67,
    sceneEvidence:'The PDF chapter 2 passage turns a valve after the storm drain to stop steam before entering a vent. A handwheel and guided stem interpret only that prop. Threading, cutaway and unloaded repeat are authored; no steam, gas, explosion, pipe collision, route unlock or actor traversal is added.' }),
  scene({ id:'mirrors2008-heat-crane-girders', universes:["Mirror's Edge"],
    scenePattern:/(?:heat|chapter.?3|chapitre.?3).*(?:crane|grue|girder|poutre|2008)/i, excludedScenePattern:/catalyst|2016|the boat|ropeburn|broken|cass[eé]|destroyed|d[eé]truit/i,
    sourceWork:'Mirror’s Edge (2008 original), chapter 3 Heat construction crane and suspended girders', sourceReference:'https://dl.gamesradar.com/guides/mirrorsedgeguide.pdf', sourceAccess:'opened-selected-pdf-text-passages',
    sourceScene:'Heat chapitre 3 — grue et poutre suspendue, Mirror’s Edge original 2008', continuity:'Original chapter 3 Heat crane jump, not chapter 7 The Boat or Catalyst',
    mechanism:'heat-crane-rigid-girder-two-cables', color:'#c2b49a', periodSeconds:89,
    sceneEvidence:'The chapter 3 section of the PDF climbs a crane and jumps toward the girders it holds. A rigid empty girder swings beneath two equal parallel cables while the crane stays fixed. Beam dimensions and mild idle motion are authored; no jump target, playable platform, height change or fall danger is added.' }),
  scene({ id:'sc2002-ciahq-rooffan', universes:['Tom Clancy’s Splinter Cell'],
    scenePattern:/cia.*(?:hq|headquarters).*(?:roof|fan|ventilat|2002)/i, excludedScenePattern:/pandora|chaos theory|double agent|conviction|blacklist|disabled|arr[eê]t[eé]|destroyed|d[eé]truit/i,
    sourceWork:'Tom Clancy’s Splinter Cell (2002 original), CIA HQ roof ventilation entry', sourceReference:'https://splintercell.fandom.com/wiki/CIA_HQ', sourceAccess:'indexed-excerpt-only-open-failed',
    sourceScene:'CIA HQ — ventilateur du conduit d’entrée sur le toit, Splinter Cell original 2002', continuity:'Original CIA roof fan in its operating state, before a temporary insertion pause',
    mechanism:'cia-entry-six-blade-ventilation-fan', color:'#a8b8a7', periodSeconds:53,
    sceneEvidence:'The indexed mission text explicitly mentions pausing the ventilation fan for stealth insertion. A recessed fan turns behind a fixed grille as a separate distant prop. Blade count, housing and no-load speed are authored; no entry window, stealth check, player contact, alarm or damage is created.' }),
  scene({ id:'sc2002-defenceministry-elevator', universes:['Tom Clancy’s Splinter Cell'],
    scenePattern:/(?:defen[cs]e ministry|minist[eè]re.*d[eé]fense).*(?:lift|elevator|ascenseur|2002)/i, excludedScenePattern:/pandora|chaos theory|double agent|conviction|blacklist|kalinatek|broken|cass[eé]|destroyed|d[eé]truit/i,
    sourceWork:'Tom Clancy’s Splinter Cell (2002 original PC), Defense Ministry office elevator', sourceReference:'https://steamcommunity.com/sharedfiles/filedetails/?id=2894619814&searchtext=Search+Tom+Clancy%27s+Splinter+Cell+Guides', sourceAccess:'opened-selected-walkthrough-passages',
    sourceScene:'Defense Ministry — cabine et portes de l’ascenseur des bureaux, Splinter Cell PC 2002', continuity:'Original PC Ministry working office lift before the rooftop escape; not Kalinatek’s empty shaft',
    mechanism:'ministry-office-car-and-split-door-linkage', color:'#b8b6a3', periodSeconds:83,
    sceneEvidence:'The walkthrough’s Ministry route exits a working elevator before entering the office and later distinguishes the roof escape shaft. An empty car stays fixed while its split doors slide on upper rollers. Exact casing and service cycle are authored; no office access, camera detection, passenger, floor or stealth objective changes.' }),
  scene({ id:'mp2-2003-hospital-lift', universes:['Max Payne 2'],
    scenePattern:/(?:hospital|h[oô]pital).*(?:prologue|lift|elevator|ascenseur|2003)/i, excludedScenePattern:/max payne.?3\b|2012|remake|broken|cass[eé]|destroyed|d[eé]truit/i,
    sourceWork:'Max Payne 2: The Fall of Max Payne (2003), hospital prologue elevator', sourceReference:'https://www.gamespot.com/articles/max-payne-2-walkthrough/1100-6075825/', sourceAccess:'opened-selected-walkthrough-passages',
    sourceScene:'Hospital prologue — ascenseur de descente vide, Max Payne 2 2003', continuity:'Working hospital descent before the Bravura lobby encounter, no smoke or injured occupants',
    mechanism:'payne-hospital-lift-counterweight-loop', color:'#a7b8b8', periodSeconds:79,
    sceneEvidence:'The opened walkthrough explicitly uses the hospital elevator controls to descend and meets Bravura below. A narrow empty car and opposite counterweight share a constant-length rope. Shaft layout and repeat are authored; no patient, smoke, gunfire, death, elevator travel for an actor or narrative event occurs.' }),
  scene({ id:'mp2-2003-warehouselift-forklift', universes:['Max Payne 2'],
    scenePattern:/(?:elevator doors|warehouse|entrep[oô]t).*(?:fork.?lift|chariot|fourche|2003)/i, excludedScenePattern:/max payne.?3\b|2012|remake|occupied|occup[eé]|destroyed|d[eé]truit/i,
    sourceWork:'Max Payne 2: The Fall of Max Payne (2003), Elevator Doors warehouse forklifts', sourceReference:'https://www.gamespot.com/articles/max-payne-2-walkthrough/1100-6075825/', sourceAccess:'opened-selected-walkthrough-passages',
    sourceScene:'Elevator Doors warehouse — fourches du chariot élévateur vide, Max Payne 2 2003', continuity:'Original warehouse equipment as an empty maintenance study, no Cleaner driver or pursuit',
    mechanism:'payne-warehouse-empty-forklift-mast', color:'#c1af91', periodSeconds:61,
    sceneEvidence:'The opened warehouse chapter specifically describes forklifts in the encounter. A small empty chassis has twin vertical mast guides and a bounded lifting fork. Hydraulic layout, dimensions and repeated unloaded lift are authored; no driver, collision, enemies, crate impact or combat event is added.' }),
  scene({ id:'flashback1992-newwashington-fuselift', universes:['Flashback'],
    scenePattern:/new washington.*(?:fuse|fusible|lift|elevator|ascenseur|1992)/i, excludedScenePattern:/2013|remake|flashback.?2\b|2023|broken|cass[eé]|destroyed|d[eé]truit/i,
    sourceWork:'Flashback (1992 original), level 2 New Washington elevator after fuse repair', sourceReference:'https://retro.flashback.cz/en/articles/flashback-walkthrough', sourceAccess:'opened-selected-walkthrough-passages',
    sourceScene:'New Washington — ascenseur après pose du fusible, Flashback original 1992', continuity:'Original New Washington working elevator, not its unpowered pre-repair state or the 2013 remake',
    mechanism:'newwashington-single-post-platform-and-drive', color:'#9ebdba', periodSeconds:71,
    sceneEvidence:'The opened level 2 guide retrieves a fuse and repairs the elevator before continuing through New Washington. An empty post-guided slab and exposed drive show that restored function. The drive design and loop are authored; no fuse reward, power-state change, Conrad body, usable platform or route alteration occurs.' }),
  scene({ id:'flashback1992-deathtower-accessblock', universes:['Flashback'],
    scenePattern:/death tower.*(?:floor|[eé]tage|hatch|bloc|switch|1992)/i, excludedScenePattern:/2013|remake|flashback.?2\b|2023|destroyed|d[eé]truit/i,
    sourceWork:'Flashback (1992 original), level 3 Death Tower next-floor access switch', sourceReference:'https://retro.flashback.cz/en/articles/flashback-walkthrough', sourceAccess:'opened-selected-walkthrough-passages',
    sourceScene:'Death Tower — bloc d’accès à l’étage commandé par interrupteur, Flashback 1992', continuity:'Original eight-floor television-tower access mechanism, no remake or enemy sequence',
    mechanism:'deathtower-empty-access-block-and-switch', color:'#b0a4c1', periodSeconds:67,
    sceneEvidence:'The guide describes eight circular floors and an opposite-side switch opening access to each next floor. A rigid guided access block and short-stroke wall switch interpret that function. Door orientation, hidden linkage and repeat are authored; no TV contestant, weapon, floor clear, score or passage change occurs.' }),
  scene({ id:'lp2-2010-railwaygun-loader', universes:['Lost Planet 2'],
    scenePattern:/(?:railway gun|canon ferroviaire).*(?:crane|loader|grue|chargeur|2010)/i, excludedScenePattern:/extreme condition|lost planet.?3\b|2013|firing|tir r[eé]el|destroyed|d[eé]truit/i,
    sourceWork:'Lost Planet 2 (2010), episode 3 Railway Gun loading station', sourceReference:'https://www.trueachievements.com/game/Lost-Planet-2/walkthrough/3', sourceAccess:'indexed-excerpt-only-open-failed',
    sourceScene:'Railway Gun — grue du poste de chargement à vide, Lost Planet 2 2010', continuity:'2010 railway-gun load station, empty mechanism without Red Eye or ammunition',
    mechanism:'railwaygun-loading-jib-empty-shell-cradle', color:'#bab49a', periodSeconds:73,
    sceneEvidence:'The indexed campaign guide describes loading the railway gun, and the equipment reference distinguishes its rear loading crane from the T-ENG charging station. A fixed jib carries an empty cradle on a cable. Dimensions and service swing are authored; no shell, charge, monster, cannon fire or gameplay loading occurs.' }),
  scene({ id:'lp2-2010-neos-cannon-collar', universes:['Lost Planet 2'],
    scenePattern:/neos.*(?:orbital cannon|canon orbital|collar|collier|2010)/i, excludedScenePattern:/extreme condition|lost planet.?3\b|2013|after.*crash|apr[eè]s.*collision|destroyed|d[eé]truit/i,
    sourceWork:'Lost Planet 2 (2010), episode 6 Meltdown, NEOS Orbital Cannon', sourceReference:'https://en.wikipedia.org/wiki/Lost_Planet_2', sourceAccess:'opened-selected-plot-passages',
    sourceScene:'NEOS — collier de positionnement du canon orbital intact, Lost Planet 2 2010', continuity:'Intact NEOS mechanism before the final cannon shot and collision with the Over-G',
    mechanism:'neos-orbital-cannon-empty-positioning-collar', color:'#a4bdc9', periodSeconds:89,
    sceneEvidence:'The opened episode 6 plot places the Orbital Cannon on NEOS and separates operation from its later collision. An empty barrel housing sits in a turning positioning collar with fixed trunnions. Exposed bearings and motion are authored functional cutaways, not verified model internals; no beam, shot, impact, GPS or station movement occurs.' }),
  scene({ id:'bl2009-saltflats-thor-wheel', universes:['Borderlands'],
    scenePattern:/(?:salt flats|salines).*thor.*(?:wheel|roue|excavat|2009)/i, excludedScenePattern:/borderlands.?[23]\b|pre.sequel|wonderlands|caustic caverns|destroyed|d[eé]truit/i,
    sourceWork:'Borderlands (2009 original), The Salt Flats, Thor bucket-wheel mining rig', sourceReference:'https://borderlands.fandom.com/wiki/The_Salt_Flats', sourceAccess:'indexed-excerpt-only-open-failed',
    sourceScene:'Salt Flats Thor — roue à godets de l’ancienne excavatrice, Borderlands 2009', continuity:'Original Salt Flats Thor functional cutaway; no assertion that the abandoned rig runs in the source game',
    mechanism:'thor-empty-bucket-wheel-and-counterboom', color:'#c1ad8b', periodSeconds:83,
    sceneEvidence:'The indexed location reference identifies Thor’s front bucket wheel and rear counterweight. A distant empty wheel turns on a fixed boom in an authored maintenance study. Bucket count and drive are adapted; source operation is not asserted, and there is no mining, ore, terrain removal, bandit or hazardous contact.' }),
  scene({ id:'bl2009-headstone-cargolift', universes:['Borderlands'],
    scenePattern:/headstone mine.*(?:lift|elevator|ascenseur|cargo|2009)/i, excludedScenePattern:/borderlands.?[23]\b|pre.sequel|wonderlands|destroyed|d[eé]truit/i,
    sourceWork:'Borderlands (2009 original), Sledge: Battle for the Badlands, Headstone Mine elevator', sourceReference:'https://borderlands.neoseeker.com/wiki/Sledge%3A_Battle_for_the_Badlands', sourceAccess:'indexed-excerpt-only-open-failed',
    sourceScene:'Headstone Mine — ascenseur de fret vers Sledge, Borderlands original 2009', continuity:'Original Headstone Mine route, empty lift without Sledge or a quest encounter',
    mechanism:'headstone-mine-open-cargo-lift-and-drum', color:'#afa48f', periodSeconds:77,
    sceneEvidence:'The indexed original quest walkthrough explicitly enters the Headstone Mine elevator and goes upward. An empty open cargo deck has two guide posts and a winding drum. Deck, rope arrangement and unloaded repeat are authored; no bandit, boss, crate reward, floor movement for an actor or quest flag is added.' }),
  scene({ id:'aot2013-trost-supply-lift', universes:['Attack on Titan'],
    scenePattern:/trost.*(?:supply|ravitaillement|headquarters|qg).*(?:lift|ascenseur|2013)/i, excludedScenePattern:/final season|marley|shiganshina|wall lift|mur.*transport|destroyed|d[eé]truit/i,
    sourceWork:'Attack on Titan (2013 anime), episode 8, Trost supply headquarters central lift', sourceReference:'https://www.springfieldspringfield.co.uk/view_episode_scripts.php?episode=s01e08&tv-show=attack-on-titan-2013', sourceAccess:'opened-selected-transcript-passages',
    sourceScene:'Trost supply headquarters — ascenseur du plafond central, épisode 8 anime 2013', continuity:'Season 1 supply-building lift; no Titans, cadets, weapons or later wall-expedition lift',
    mechanism:'trost-supply-empty-four-rope-deck', color:'#b1aa91', periodSeconds:81,
    sceneEvidence:'The episode 8 transcript explicitly lowers a group using a lift from the center ceiling. Only an empty four-rope deck and ceiling pulleys are interpreted. Rope spacing, deck proportions and return cycle are authored; no organic body, attack, blinding plan, gas refill, rescue or usable platform is simulated.' }),
  scene({ id:'aot2018-trost-wall-transport', universes:['Attack on Titan'],
    scenePattern:/(?:wall rose|mur rose|trost wall|mur.*trost).*(?:lift|transport|monte.charge|exp[eé]dition)/i, excludedScenePattern:/supply headquarters|ravitaillement|episode.?8\b|[eé]pisode.?8\b|marley|destroyed|d[eé]truit/i,
    sourceWork:'Attack on Titan anime, Trost Wall Rose lift before the Shiganshina expedition in year 850', sourceReference:'https://attackontitan.fandom.com/wiki/Trost_District', sourceAccess:'indexed-excerpt-only-open-failed',
    sourceScene:'Trost Wall Rose — monte-charge avant l’expédition de l’an 850', continuity:'Pre-expedition Wall Rose transport, separate from the season 1 indoor supply lift',
    mechanism:'trost-wall-empty-carrier-fixed-suspension', color:'#b8ad94', periodSeconds:97,
    sceneEvidence:'The indexed district account places the Survey Corps riding the wall lift before departing for Shiganshina. A broad empty carrier runs up a masonry guide with a separated counterweight. Architecture, exposed winding drive and repeat are authored; no horse, soldier, Titan, gate breach, player transport or campaign event occurs.' }),
  scene({ id:'monkey2009-seamonkey-cannon', universes:['Secret of Monkey Island'],
    scenePattern:/sea monkey.*(?:deck|pont|cannon|canon|2009)/i, excludedScenePattern:/monkey island.?2\b|lechuck.?s revenge|curse|escape|tales|return to|occupied|occup[eé]/i,
    sourceWork:'The Secret of Monkey Island Special Edition (2009), Sea Monkey deck cannon', sourceReference:'https://www.walkthroughking.com/text/monkeyislandspecial.aspx', sourceAccess:'opened-selected-walkthrough-passages',
    sourceScene:'Sea Monkey — affût du canon de pont vide, Secret of Monkey Island Special Edition 2009', continuity:'2009 Special Edition prop function; no imported original-1990 or remake frame asserted',
    mechanism:'seamonkey-unloaded-cannon-trunnion-and-wheels', color:'#b5a080', periodSeconds:83,
    sceneEvidence:'The opened Special Edition walkthrough uses the ship’s deck cannon with a rope fuse to reach Monkey Island. An unloaded empty cannon has trunnion elevation and carriage wheels in a restrained service study. Layout and idle movement are authored; no powder, shot, human cannonball, firing, island travel or puzzle effect occurs.' }),
  scene({ id:'monkey2009-stan-grogmachine', universes:['Secret of Monkey Island'],
    scenePattern:/stan.*(?:grog|vending|distribut|2009)/i, excludedScenePattern:/monkey island.?2\b|lechuck.?s revenge|curse|escape|tales|return to|destroyed|d[eé]truit/i,
    sourceWork:'The Secret of Monkey Island Special Edition (2009), Stan’s Used Ship Emporium grog machine', sourceReference:'https://www.walkthroughking.com/text/monkeyislandspecial.aspx', sourceAccess:'opened-selected-walkthrough-passages',
    sourceScene:'Stan’s Used Ship Emporium — distributeur de grog, Special Edition 2009', continuity:'Intact Special Edition machine before the final punch interaction, empty service demonstration',
    mechanism:'stan-grog-empty-helix-and-can-chute', color:'#b7c0a2', periodSeconds:59,
    sceneEvidence:'The opened guide explicitly identifies the grog machine at Stan’s emporium and the root beer it releases. An empty helical feeder and shutter study the dispensing function. Internal helix and timing are authored, not a verified cutaway; no drink, money, inventory, ghost, combat or ending sequence is added.' }),
  scene({ id:'lbp2008-getagrip-sponge', universes:['LittleBigPlanet'],
    scenePattern:/get a grip.*(?:sponge|[eé]ponge|swing|suspension|2008)/i, excludedScenePattern:/littlebigplanet.?[23]\b|sackboy.*big adventure|remake|destroyed|d[eé]truit/i,
    sourceWork:'LittleBigPlanet (2008 PS3), The Gardens, Get a Grip hanging sponge', sourceReference:'https://portforward.com/games/walkthroughs/Little-Big-Planet/The-Gardens-Get-a-Grip.htm', sourceAccess:'opened-selected-walkthrough-passages',
    sourceScene:'Get a Grip — éponge suspendue de The Gardens, LittleBigPlanet PS3 2008', continuity:'Original PS3 hanging grab prop; no wooden character, Sackboy or later game object',
    mechanism:'gardens-rectangular-sponge-fixed-cord-swing', color:'#b8bd97', periodSeconds:73,
    sceneEvidence:'The opened guide explicitly swings between hanging sponges in Get a Grip. One plain rectangular sponge hangs from a constant-length cord with a bounded gravity-like swing. Surface marks, dimensions and passive motion are authored; no Sackboy body, grab point, bubbles, water danger or gameplay rope is created.' }),
  scene({ id:'lbp2008-skatetovictory-windmills', universes:['LittleBigPlanet'],
    scenePattern:/skate to victory.*(?:windmill|moulin|blade|pale|2008)/i, excludedScenePattern:/littlebigplanet.?[23]\b|sackboy.*big adventure|remake|destroyed|d[eé]truit/i,
    sourceWork:'LittleBigPlanet (2008 PS3), The Gardens, Skate to Victory spinning windmills', sourceReference:'https://portforward.com/games/walkthroughs/Little-Big-Planet/The-Gardens-Skate-to-Victory.htm', sourceAccess:'opened-selected-walkthrough-passages',
    sourceScene:'Skate to Victory — moulins à pales de The Gardens, LittleBigPlanet PS3 2008', continuity:'Original PS3 rotating grabbable structures, distinct from the portable water-wheel prize',
    mechanism:'skatetovictory-staggered-four-grip-wheels', color:'#c4af91', periodSeconds:67,
    sceneEvidence:'The guide identifies spinning windmills whose blade ends can be grabbed to reach the next platform. Two empty rigid wheels have broad end grips and staggered hubs. Count, geometry and speed are authored; no organic figure, usable grab surface, timed jump, prize bubble or score effect is added.' }),
  scene({ id:'ristar1995-scorch-empty-cage', universes:['Ristar'],
    scenePattern:/planet scorch.*(?:cage|furnace|four|1995)/i, excludedScenePattern:/game gear|8.bit|sonata|heated|chauff[eé]|destroyed|d[eé]truit/i,
    sourceWork:'Ristar (1995 Mega Drive/Genesis), Planet Scorch furnace cage', sourceReference:'https://gamefaqs.gamespot.com/genesis/586423-ristar/faqs/15192', sourceAccess:'indexed-excerpt-only-open-failed',
    sourceScene:'Planet Scorch — cage vide au-dessus du four éteint, Ristar Mega Drive 1995', continuity:'16-bit Scorch cage study with furnace off; the Game Gear version omits Planet Scorch',
    mechanism:'scorch-empty-cage-and-unheated-shutter', color:'#bda58b', periodSeconds:83,
    sceneEvidence:'The indexed original Genesis guide explicitly describes a cage over a furnace that turns on and off; the Game Gear reference omits Scorch. Only an empty guided cage and an unheated service shutter move. Their transmission and repeat are authored; no flame, character, capture volume, heat or damage exists.' }),
  scene({ id:'ristar1995-sonata-metronome', universes:['Ristar'],
    scenePattern:/planet sonata.*(?:metronome|m[eé]tronome|1995)/i, excludedScenePattern:/game gear|8.bit|clock tower|tour.*horloge|destroyed|d[eé]truit/i,
    sourceWork:'Ristar (1995 Mega Drive/Genesis), Planet Sonata portable metronome', sourceReference:'https://gamefaqs.gamespot.com/genesis/586423-ristar/faqs/15192', sourceAccess:'indexed-excerpt-only-open-failed',
    sourceScene:'Planet Sonata — balancier du métronome posé à vide, Ristar Mega Drive 1995', continuity:'16-bit portable metronome object, not Game Gear’s separate clock-tower gear level',
    mechanism:'sonata-metronome-rigid-adjustable-weight', color:'#b3b3c6', periodSeconds:59,
    sceneEvidence:'The indexed Genesis walkthrough carries metronomes to Sonata’s musical guards. A plain empty metronome has one fixed pivot, rigid rod and attached sliding weight in an authored demonstration. Its casing and timing are adapted; no bird, arms, puzzle delivery, tune, guard behavior or music unlock is rendered.' }),
  scene({ id:'surge2017-conveyorhub-empty-belt', universes:['The Surge'],
    scenePattern:/central production b.*(?:conveyor hub|convoyeur|2017)/i, excludedScenePattern:/the surge\s*2\b|2019|walk in the park|dlc|destroyed|d[eé]truit/i,
    sourceWork:'The Surge (2017 base game), Central Production B Conveyor Hub', sourceReference:'https://www.neoseeker.com/the-surge/walkthrough/Central_Production_B_-_Conveyor_Hub', sourceAccess:'indexed-excerpt-only-open-failed',
    sourceScene:'Central Production B Conveyor Hub — chaîne de fret vide entre cylindres, The Surge 2017', continuity:'Original base-game Conveyor Hub logistics interpretation, not the theme-park DLC or sequel',
    mechanism:'creo-conveyorhub-two-cylinder-empty-belt', color:'#b6b19a', periodSeconds:71,
    sceneEvidence:'The indexed hub guide identifies cargo containers and two large cylindrical objects in Central Production B. A bounded empty logistics belt between paired housings is an authored functional interpretation of the Conveyor Hub, not a verified scene model. No RIG body, loot, machinery hazard, bridge collision or route change is added.' }),
  scene({ id:'surge2017-resolve-courtyard-lift', universes:['The Surge'],
    scenePattern:/resolve biolabs.*(?:courtyard|cour|lift|ascenseur|2017)/i, excludedScenePattern:/the surge\s*2\b|2019|walk in the park|dlc|destroyed|d[eé]truit/i,
    sourceWork:'The Surge (2017 base game), ReSOLVE Biolabs lower-floor courtyard elevator', sourceReference:'https://www.gamepressure.com/the-surge/what-can-be-found-beyond-the-creo-security-doors/z99d39', sourceAccess:'opened-selected-walkthrough-passages',
    sourceScene:'ReSOLVE Biolabs — ascenseur des étages bas vers la cour, The Surge 2017', continuity:'Original Biolabs working elevator near the security-room route, no sequel or DLC',
    mechanism:'resolve-courtyard-empty-exolift-guide', color:'#a5bdb5', periodSeconds:89,
    sceneEvidence:'The opened guide goes from the Biolabs MedBay through lower floors to an elevator leading to the courtyard. A narrow empty exo-lift follows a vertical rail with a bounded chain drive. Structure and repeat are authored; no implant, security-door access, Warren body, usable anchor or actor movement is added.' }),
  scene({ id:'putt1995-zoo-hydrodam', universes:['Putt-Putt'],
    scenePattern:/(?:cartown zoo|zoo).*hydro.?dam.*(?:pulley|poulie|1995)/i, excludedScenePattern:/joins the parade|travels through time|enters the race|circus|moon|destroyed|d[eé]truit/i,
    sourceWork:'Putt-Putt Saves the Zoo (1995), Cartown Zoo Grasslands Hydro Dam', sourceReference:'https://steamcommunity.com/sharedfiles/filedetails/?id=292892521', sourceAccess:'opened-selected-walkthrough-passages',
    sourceScene:'Cartown Zoo Hydro Dam — poulie du barrage sans eau, Saves the Zoo 1995', continuity:'Original zoo dam after repair, no guessed randomized pulley-wedge solution',
    mechanism:'cartown-hydrodam-empty-pulley-and-sluice', color:'#a5c2bd', periodSeconds:79,
    sceneEvidence:'The guide repairs the Hydro Dam using one of several randomized pulley wedges so its barrier can lower. A plain pulley and guided empty sluice study the mechanism without selecting a puzzle shape. Geometry and reset are authored; no animal, water-level change, rescue, toolbox, random solution or usable gate is added.' }),
  scene({ id:'putt1995-zoo-jungle-drawbridge', universes:['Putt-Putt'],
    scenePattern:/(?:jungle land|jungleland|cartown zoo).*(?:drawbridge|pont.levis|masai|1995.*bridge)/i, excludedScenePattern:/joins the parade|travels through time|enters the race|circus|moon|blocked|bloqu[eé]|destroyed|d[eé]truit/i,
    sourceWork:'Putt-Putt Saves the Zoo (1995), Jungle Land drawbridge by Masai', sourceReference:'https://steamcommunity.com/sharedfiles/filedetails/?id=292892521', sourceAccess:'opened-selected-walkthrough-passages',
    sourceScene:'Jungle Land — pont-levis et volant après retrait du rocher, Cartown Zoo 1995', continuity:'Unobstructed zoo drawbridge only, not the rock-blocked state or a different Putt-Putt game',
    mechanism:'jungleland-rigid-drawbridge-and-winding-rope', color:'#bca98b', periodSeconds:97,
    sceneEvidence:'The opened guide removes the blocking rock and then uses a turning wheel to lower the drawbridge. A rigid empty bridge rotates at one hinge with cable length and drum angle coupled. Exact span and transmission are authored; no giraffe, car body, rescue, river, collision bridge or world-state change occurs.' }),
  scene({ id:'freddi1994-sunkenship-window', universes:['Freddi Fish'],
    scenePattern:/sunken ship.*(?:window|fen[eê]tre|crank|manivelle|1994)/i, excludedScenePattern:/haunted schoolhouse|stolen conch|hogfish|creature.*coral|freddi fish\s*[2-5]\b|destroyed|d[eé]truit/i,
    sourceWork:'Freddi Fish and the Case of the Missing Kelp Seeds (1994), sunken-ship pulley window', sourceReference:'https://steamcommunity.com/sharedfiles/filedetails/?id=348025148', sourceAccess:'opened-selected-walkthrough-passages',
    sourceScene:'Sunken Ship — manivelle et poulie de la fenêtre, Freddi Fish Kelp Seeds 1994', continuity:'First game treasure-room window, no later case, creature or pirate anatomy',
    mechanism:'kelpseeds-window-crank-guided-panel', color:'#a4bfc9', periodSeconds:83,
    sceneEvidence:'The opened guide attaches a crank handle to the sunken ship window pulley. A plain framed window panel moves within two guides as its crank turns. Rope path and continuous empty return are authored; no fish, treasure, seeds, inventory, underwater pressure or opened playable passage is created.' }),
  scene({ id:'freddi1994-volcano-bucketgate', universes:['Freddi Fish'],
    scenePattern:/(?:volcano gate|volcano theater|porte.*volcan).*(?:bucket|seau|1994)/i, excludedScenePattern:/haunted schoolhouse|stolen conch|hogfish|creature.*coral|freddi fish\s*[2-5]\b|destroyed|d[eé]truit/i,
    sourceWork:'Freddi Fish and the Case of the Missing Kelp Seeds (1994), undersea-volcano theater gate', sourceReference:'https://steamcommunity.com/sharedfiles/filedetails/?id=348025148', sourceAccess:'opened-selected-walkthrough-passages',
    sourceScene:'Volcano Gate — seau et liaison de la porte du théâtre, Kelp Seeds 1994', continuity:'First-game bucket-operated gate without sea-urchin tokens or a fixed random clue route',
    mechanism:'kelpseeds-volcano-empty-bucket-countergate', color:'#b6a7b7', periodSeconds:73,
    sceneEvidence:'The guide uses four sea-urchin tokens in the volcano theater bucket to open its gate. Only an empty bucket, rope and guided panel are interpreted as a counterweight study. Support geometry and repeat are authored; no living token, fish, payment, random clue, gate unlock or inventory effect occurs.' }),
  scene({ id:'spyfox1997-mobcom-dispenser', universes:['Spy Fox'],
    scenePattern:/(?:mobcom|mobile command cent[er]+).*(?:vending|distribut|gadget|1997)/i, excludedScenePattern:/some assembly required|operation ozone|1999|2001|destroyed|d[eé]truit/i,
    sourceWork:'SPY Fox in Dry Cereal (1997), Spy Corps Mobile Command Center gadget vending machine', sourceReference:'https://steamcommunity.com/sharedfiles/filedetails/?id=250642124', sourceAccess:'opened-selected-walkthrough-passages',
    sourceScene:'MobCom — distributeur de gadgets vide, SPY Fox Dry Cereal 1997', continuity:'First-game command-center vending mechanism, no character or later SPY Fox mission',
    mechanism:'mobcom-empty-selector-carousel-and-tray', color:'#b4bbc3', periodSeconds:61,
    sceneEvidence:'The opened guide explicitly obtains gadgets from MobCom’s vending machine and limits carried gadgets. An empty rotating selector carousel and guided tray study its dispensing function. Internal layout and idle cycle are authored; no gadget, fox, duck, inventory slot, gift or mission progress is generated.' }),
  scene({ id:'spyfox1997-nog-fortress-tram', universes:['Spy Fox'],
    scenePattern:/(?:nog|william.*fortress|kid.*fortress).*(?:tram|transit|1997)/i, excludedScenePattern:/some assembly required|operation ozone|1999|2001|destroyed|d[eé]truit/i,
    sourceWork:'SPY Fox in Dry Cereal (1997), William the Kid’s N.O.G. fortress tram', sourceReference:'https://humongous.fandom.com/wiki/SPY_Fox_in_%22Dry_Cereal%22/Walkthrough', sourceAccess:'indexed-excerpt-only-open-failed',
    sourceScene:'NOG fortress — tram intérieur vide de William the Kid, Dry Cereal 1997', continuity:'Original fortress tram route, not a later title’s toy or ozone machinery',
    mechanism:'nog-empty-fortress-tram-and-guide-rollers', color:'#c0ad98', periodSeconds:89,
    sceneEvidence:'The indexed first-game walkthrough repeatedly takes the fortress tram between internal routes. An empty cabin follows fixed rails with rotating guide rollers. Rail slope, vehicle construction and return are authored; no animal occupant, diode, key, laser puzzle, usable transit or mission-state change is added.' }),
  scene({ id:'sam2001-luxor-risingobelisk', universes:['Serious Sam'],
    scenePattern:/luxor.*(?:obelisk|ob[eé]lisque|ritual|rituel|2001)/i, excludedScenePattern:/second encounter|serious sam\s*[234]\b|hd|2009|2011|destroyed|d[eé]truit/i,
    sourceWork:'Serious Sam: The First Encounter (2001 original), Luxor ritual-site transmitter obelisk', sourceReference:'https://en.wikipedia.org/wiki/Serious_Sam%3A_The_First_Encounter', sourceAccess:'opened-selected-plot-passages',
    sourceScene:'Luxor — obélisque mobile du site rituel, First Encounter original 2001', continuity:'Original Luxor rising structure, not Metropolis or HD remake; transmitter effects omitted',
    mechanism:'luxor-rigid-rising-obelisk-and-pedestal', color:'#bfaf88', periodSeconds:97,
    sceneEvidence:'The opened plot places a rising transmitter obelisk at the Luxor ritual site before the Great Pyramid. A rigid tapered obelisk moves in a fixed pedestal guide. Dimensions and repeat are authored; there is no activation beam, spaceship, enemy, Amun-Ra inventory use, ritual trigger or gameplay transport.' }),
  scene({ id:'sam2001-greatpyramid-door', universes:['Serious Sam'],
    scenePattern:/great pyramid.*(?:entry|door|porte|entr[eé]e|2001)/i, excludedScenePattern:/second encounter|serious sam\s*[234]\b|hd|2009|2011|destroyed|d[eé]truit/i,
    sourceWork:'Serious Sam: The First Encounter (2001 original), Great Pyramid entrance doors', sourceReference:'https://speeddemosarchive.com/SeriousSamFE.html', sourceAccess:'opened-selected-speedrun-commentary',
    sourceScene:'Great Pyramid — portes d’entrée intactes, First Encounter original 2001', continuity:'Original ramp-triggered entrance, no HD model, boss or tractor-beam sequence',
    mechanism:'greatpyramid-opposed-stepped-stone-doors', color:'#b8aa8c', periodSeconds:89,
    sceneEvidence:'The opened runner commentary explicitly times the Great Pyramid doors from reaching the ramp. Two empty stepped stone panels translate within a fixed lintel in an authored mechanism study. Profile, hidden drives and repeat are adapted; no countdown, boss, pyramid access, key use, tractor beam or actor collision occurs.' }),
  scene({ id:'nms2016-foundation-signalbooster', universes:["No Man's Sky"],
    scenePattern:/foundation.*(?:signal booster|balise.*signal|signal.*antenna|antenne)/i, excludedScenePattern:/next update|beyond|2018|2019|mods?|destroyed|d[eé]truit/i,
    sourceWork:'No Man’s Sky Foundation update (2016), buildable planetary Signal Booster', sourceReference:'https://www.nomanssky.com/foundation-update/', sourceAccess:'opened-official-selected-release-notes',
    sourceScene:'Foundation survey clearing — antenne du Signal Booster, No Man’s Sky 2016', continuity:'Foundation-era portable navigation function; clearing is authored, not a canonical named planet or seed',
    mechanism:'foundation-signalbooster-three-feet-scan-head', color:'#a6c2c5', periodSeconds:71,
    sceneEvidence:'The official Foundation notes rename Signal Scanners, make boosters buildable and list their navigation searches. A three-foot standing device has a bounded turning antenna head. Prop outline and motion are authored, not verified source animation; no scan result, planet seed, beacon placement, resource discovery or gameplay signal is produced.' }),
  scene({ id:'nms2019-beyond-mineralextractor', universes:["No Man's Sky"],
    scenePattern:/beyond.*(?:mineral extractor|extracteur.*min[eé]ra|industrial.*outpost|avant.poste.*extract)/i, excludedScenePattern:/foundation|2016|next update|2018|mods?|destroyed|d[eé]truit/i,
    sourceWork:'No Man’s Sky Beyond update (2019), mineral extractor at an authored planetary industrial outpost', sourceReference:'https://www.nomanssky.com/beyond-update/?cli_action=1565810406.292', sourceAccess:'opened-official-selected-release-notes',
    sourceScene:'Beyond industrial outpost — piston de l’extracteur minéral, No Man’s Sky 2019', continuity:'Beyond industrial base-part function, no claimed canonical planet, hotspot grade or actual base layout',
    mechanism:'beyond-extractor-fixed-rod-piston', color:'#b2bca4', periodSeconds:59,
    sceneEvidence:'Official Beyond notes add mineral extractors, pipelines and survey hotspots. An empty extractor housing uses a constrained crank, fixed-length rod and guided piston in a functional cutaway. Exact internals and cycle are authored; no mining, terrain edit, power cost, resource collection, offline progress or hotspot is simulated.' }),
  scene({ id:'brutal2009-dryice-railcarrier', universes:['Brütal Legend'],
    scenePattern:/dry ice.*(?:mines|quarry|rail|cart|chariot|2009)/i, excludedScenePattern:/drowning.*body|headbanger.*body|destroyed|d[eé]truit/i,
    sourceWork:'Brütal Legend (2009), Dry Ice Mines cart-track logistics', sourceReference:'https://brutallegend.fandom.com/wiki/Dry_Ice_Mines', sourceAccess:'indexed-excerpt-only-open-failed',
    sourceScene:'Dry Ice Mines — petit chariot de service sur les rails, Brütal Legend 2009', continuity:'Original mine cart-track setting, empty logistics study with no fog or character unit',
    mechanism:'dryice-empty-short-wheelbase-service-cart', color:'#a6b9bd', periodSeconds:83,
    sceneEvidence:'The indexed location reference explicitly uses mine-cart tracks to navigate Dry Ice Mines. An empty service carrier interprets that logistics function; its model, wheelbase and return drive are authored rather than a verified source cart. No band, body, army, fog, resource, cargo reward or traversable rail vehicle is added.' }),
  scene({ id:'brutal2009-bladehenge-megastage', universes:['Brütal Legend'],
    scenePattern:/bladehenge.*(?:ironheade|megastage|speaker|enceinte|2009)/i, excludedScenePattern:/drowning doom|tainted coil|level.?4|niveau.?4|destroyed|d[eé]truit/i,
    sourceWork:'Brütal Legend (2009), Bladehenge Ironheade Megastage speaker hardware', sourceReference:'https://brutallegend.fandom.com/wiki/Stage_Upgrades', sourceAccess:'indexed-excerpt-only-open-failed',
    sourceScene:'Bladehenge Ironheade — cônes des enceintes du Megastage, Brütal Legend 2009', continuity:'Original Ironheade early-stage sound hardware, no animated unit/portrait on monitors',
    mechanism:'bladehenge-megastage-linked-speaker-cones', color:'#bca697', periodSeconds:67,
    sceneEvidence:'The indexed stage-upgrade reference explicitly adds speakers and monitors to the Megastage. An empty Ironheade stage has mechanically moving speaker cones under a fixed truss. Placement and diaphragm cycle are authored, without a source-loop claim; no character screen, music playback, upgrade, fans, troops or battle effect occurs.' })
]);

export const WAVE_9_MODE_REFERENCE_SCENES = Object.freeze(Object.fromEntries(Array.from({length:20},(_,index)=>{
  const [a,b]=STAGE_ANIMATION_WAVE_9.slice(index*2,index*2+2);
  return [a.universes[0],Object.freeze({Combat:a.sourceScene,RPG:a.sourceScene,Melee:b.sourceScene,Tactics:b.sourceScene})];
})));
const TAU=Math.PI*2;
const polar=(x,y,r,a)=>[x+r*Math.cos(a),y+r*Math.sin(a)];
const line=(ctx,pts)=>{ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();};
const polygon=(ctx,pts)=>{ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.stroke();};
const ellipse=(ctx,x,y,rx,ry,angle=0)=>{ctx.beginPath();ctx.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),angle,0,TAU);ctx.stroke();};
const box=(ctx,x,y,w,h)=>ctx.strokeRect(x,y,w,h);
const wheel=(ctx,x,y,r,a,n=6)=>{ellipse(ctx,x,y,r,r);for(let i=0;i<n;i++)line(ctx,[[x,y],polar(x,y,r,a+i*TAU/n)]);};

// Drawn keypoints, not a parallel simulation: consumers can verify physical
// constraints on the actual positions passed to the Canvas below.
export function getStageAnimationWave9Geometry(mechanism,progress,w,h){
  const a=progress*TAU,u=Math.min(w,h),s=Math.sin(a),c=Math.cos(a);
  if(mechanism==='destiny-shuttle-two-articulated-docking-clamps')return {arms:[-1,1].map(side=>{
    const root=[w*(.5+side*.16),h*.23],lengths=[u*.095,u*.075];
    const elbow=polar(...root,lengths[0],Math.PI/2+side*(.35+.2*s));
    const tip=polar(...elbow,lengths[1],Math.PI/2-side*(.6+.25*c));return{root,elbow,tip,lengths};
  })};
  if(mechanism==='heat-crane-rigid-girder-two-cables'){
    const roots=[[w*.39,h*.19],[w*.61,h*.19]],length=u*.17,angle=Math.PI/2+.19*s;
    const ends=roots.map(p=>polar(...p,length,angle));return{roots,ends,length,span:roots[1][0]-roots[0][0]};
  }
  if(mechanism==='payne-hospital-lift-counterweight-loop'){
    const car=[w*.46,h*(.25+.12*(1-c)/2)],counterweight=[w*.46+u*.18,h*.64-car[1]];
    return{car,counterweight,top:h*.16,sum:h*.64};
  }
  if(mechanism==='jungleland-rigid-drawbridge-and-winding-rope'){
    const root=[w*.36,h*.43],length=u*.32,angle=-.53*(1-c)/2,end=polar(...root,length,angle),drum=[w*.35,h*.19];
    const cableLength=Math.hypot(end[0]-drum[0],end[1]-drum[1]);return{root,end,drum,length,cableLength,drumAngle:cableLength/(u*.03)};
  }
  if(mechanism==='kelpseeds-volcano-empty-bucket-countergate'){
    const top=h*.19,bucket=[w*.4,h*(.29+.1*(1-c)/2)],gate=[w*.61,h*.68-bucket[1]];
    return{top,bucket,gate,sum:h*.68};
  }
  if(mechanism==='beyond-extractor-fixed-rod-piston'){
    const root=[w*.46,h*.31],radius=u*.04,length=u*.15,crank=polar(...root,radius,a);
    const slider=[root[0]+radius*c+Math.sqrt(length*length-(crank[1]-root[1])**2),root[1]];
    return{root,crank,slider,radius,length};
  }
  if(mechanism==='sonata-metronome-rigid-adjustable-weight'){
    const root=[w*.5,h*.42],length=u*.19,angle=-Math.PI/2+.32*s;
    return{root,end:polar(...root,length,angle),weight:polar(...root,length*.65,angle),length};
  }
  if(mechanism==='gardens-rectangular-sponge-fixed-cord-swing'){
    const root=[w*.5,h*.16],length=u*.19;return{root,end:polar(...root,length,Math.PI/2+.3*s),length};
  }
  return null;
}

export function drawStageAnimationWave9(ctx,animation,frame,w,h){
  const a=frame.phase,t=frame.progress,u=Math.min(w,h),s=Math.sin(a),c=Math.cos(a),x=w*.5,y=h*.33;
  ctx.globalAlpha=.16;
  switch(animation.mechanism){
    case 'atlantis-jumperbay-eight-sliding-hatch-leaves':{
      const r=u*.115,shift=u*.065*(1-c)/2;ellipse(ctx,x,y,r*1.7,r*1.7);
      for(let i=0;i<8;i++){const q=i*TAU/8,base=polar(x,y,shift,q);polygon(ctx,[polar(...base,r*.25,q-.2),polar(...base,r*1.3,q-.3),polar(...base,r*1.5,q+.24),polar(...base,r*.57,q+.6)]);}break;
    }
    case 'jumperone-opposed-retracting-drive-pods':{
      const shift=u*.065*(1-c)/2;box(ctx,x-u*.09,y-u*.11,u*.18,u*.23);polygon(ctx,[[x-u*.09,y-u*.11],[x,y-u*.15],[x+u*.09,y-u*.11]]);
      for(const side of [-1,1]){line(ctx,[[x+side*u*.08,y],[x+side*(u*.12+shift),y]]);box(ctx,x+side*(u*.15+shift)-u*.035,y-u*.07,u*.07,u*.14);ellipse(ctx,x+side*(u*.15+shift),y+u*.04,u*.02,u*.025);}break;
    }
    case 'destiny-whole-annulus-and-fixed-bearing':{
      const r=u*.135;ellipse(ctx,x,y,r,r);ellipse(ctx,x,y,r*.83,r*.83);for(let i=0;i<9;i++){const q=a+i*TAU/9;polygon(ctx,[polar(x,y,r*.9,q-.06),polar(x,y,r*1.07,q),polar(x,y,r*.9,q+.06)]);}for(let i=0;i<18;i++){const q=a+i*TAU/18;line(ctx,[polar(x,y,r*.86,q),polar(x,y,r*.95,q)]);}polygon(ctx,[[x-u*.18,y+u*.14],[x-u*.15,y+u*.07],[x+u*.15,y+u*.07],[x+u*.18,y+u*.14]]);break;
    }
    case 'destiny-shuttle-two-articulated-docking-clamps':{
      ellipse(ctx,x,h*.4,u*.1,u*.06);ellipse(ctx,x,h*.4,u*.075,u*.045);const g=getStageAnimationWave9Geometry(animation.mechanism,t,w,h);
      for(const arm of g.arms){box(ctx,arm.root[0]-u*.02,arm.root[1]-u*.02,u*.04,u*.04);line(ctx,[arm.root,arm.elbow,arm.tip]);ellipse(ctx,...arm.elbow,u*.014,u*.014);line(ctx,[arm.tip,[arm.tip[0]+(arm.root[0]<x?1:-1)*u*.035,arm.tip[1]]]);}break;
    }
    case 'nonary-steam-three-disc-gears':{
      const r=u*.065;for(let i=0;i<3;i++){const cx=x+(i-1)*r*2,angle=i%2?-a+Math.PI/12:a;wheel(ctx,cx,y,r,angle,8);for(let j=0;j<12;j++){const q=angle+j*TAU/12;line(ctx,[polar(cx,y,r*.93,q),polar(cx,y,r*1.05,q)]);}ellipse(ctx,...polar(cx,y,r*.56,angle),u*.012,u*.012);}box(ctx,x-u*.23,h*.44,u*.46,u*.025);break;
    }
    case 'nonary-piano-three-empty-key-levers':{
      box(ctx,x-u*.19,h*.23,u*.38,u*.22);for(let i=0;i<7;i++){const left=x+u*(-.175+i*.05),press=i%2===0?u*.013*(1-Math.cos(a+i*.7))/2:0;box(ctx,left,h*.35+press,u*.045,u*.075);if(i<6&&i!==2)box(ctx,left+u*.033,h*.35,u*.022,u*.038);if(i%2===0){const root=[left+u*.022,h*.29];line(ctx,[root,[left+u*.022,h*.35+press],[left+u*.04,h*.31+press]]);ellipse(ctx,...root,u*.005,u*.005);}}break;
    }
    case 'jacknife-fixed-stem-handwheel-valve':{
      line(ctx,[[w*.29,y+u*.09],[w*.7,y+u*.09]]);line(ctx,[[w*.29,y+u*.12],[w*.7,y+u*.12]]);box(ctx,x-u*.035,y+u*.065,u*.07,u*.07);line(ctx,[[x,y-u*.075],[x,y+u*.065]]);ellipse(ctx,x,y-u*.08,u*.07,u*.022);for(let i=0;i<5;i++){const q=a+i*TAU/5;line(ctx,[[x,y-u*.08],[x+u*.068*Math.cos(q),y-u*.08+u*.02*Math.sin(q)]]);}box(ctx,x-u*.012,y-u*.02+u*.01*s,u*.024,u*.025);break;
    }
    case 'heat-crane-rigid-girder-two-cables':{
      const g=getStageAnimationWave9Geometry(animation.mechanism,t,w,h);line(ctx,[[w*.25,h*.49],[w*.25,h*.15],[w*.76,h*.15]]);for(let i=0;i<7;i++)line(ctx,[[w*.25+i*w*.073,h*.15],[w*.25+(i+.5)*w*.073,h*.185],[w*.25+(i+1)*w*.073,h*.15]]);
      for(let i=0;i<2;i++){line(ctx,[g.roots[i],g.ends[i]]);wheel(ctx,...g.roots[i],u*.015,a,5);}line(ctx,g.ends);line(ctx,g.ends.map(([cx,cy])=>[cx,cy+u*.025]));for(const p of g.ends)line(ctx,[p,[p[0],p[1]+u*.025]]);break;
    }
    case 'cia-entry-six-blade-ventilation-fan':{
      box(ctx,x-u*.16,y-u*.15,u*.32,u*.3);ellipse(ctx,x,y,u*.13,u*.13);for(let i=0;i<6;i++){const q=a+i*TAU/6;polygon(ctx,[polar(x,y,u*.02,q),polar(x,y,u*.12,q+.12),polar(x,y,u*.115,q+.53),polar(x,y,u*.045,q+.36)]);}for(const k of [-1,1])line(ctx,[[x-u*.15,y+k*u*.06],[x+u*.15,y+k*u*.06]]);line(ctx,[[x-u*.06,y-u*.15],[x-u*.06,y+u*.15],[x+u*.06,y+u*.15],[x+u*.06,y-u*.15]]);break;
    }
    case 'ministry-office-car-and-split-door-linkage':{
      const shift=u*.07*(1-c)/2;box(ctx,x-u*.12,h*.2,u*.24,h*.29);for(const side of [-1,1]){const left=x+side*(u*.055+shift)-u*.05;box(ctx,left,h*.215,u*.1,h*.26);line(ctx,[[left+u*.05,h*.215],[left+u*.05,h*.19]]);wheel(ctx,left+u*.05,h*.185,u*.012,side*a,4);}line(ctx,[[x-u*.2,h*.17],[x+u*.2,h*.17]]);break;
    }
    case 'payne-hospital-lift-counterweight-loop':{
      const g=getStageAnimationWave9Geometry(animation.mechanism,t,w,h);for(const dx of [-.07,.07])line(ctx,[[g.car[0]+u*dx,g.top],[g.car[0]+u*dx,h*.51]]);line(ctx,[g.car,[g.car[0],g.top],[g.counterweight[0],g.top],g.counterweight]);wheel(ctx,(g.car[0]+g.counterweight[0])/2,g.top,u*.03,a,5);box(ctx,g.car[0]-u*.065,g.car[1],u*.13,u*.09);box(ctx,g.counterweight[0]-u*.02,g.counterweight[1],u*.04,u*.06);break;
    }
    case 'payne-warehouse-empty-forklift-mast':{
      box(ctx,x-u*.14,y,u*.18,u*.065);polygon(ctx,[[x-u*.14,y],[x-u*.11,y-u*.065],[x-u*.035,y-u*.065],[x+u*.015,y]]);for(const dx of [-.1,.015])wheel(ctx,x+u*dx,y+u*.08,u*.03,a*.2,5);const top=y-u*(.13+.07*(1-c)/2);for(const dx of [.07,.095])line(ctx,[[x+u*dx,h*.2],[x+u*dx,y+u*.08]]);line(ctx,[[x+u*.075,top],[x+u*.075,top+u*.07],[x+u*.19,top+u*.07]]);box(ctx,x-u*.035,y-u*.09,u*.035,u*.055);break;
    }
    case 'newwashington-single-post-platform-and-drive':{
      const cy=h*(.27+.12*(1-c)/2);box(ctx,x-u*.025,h*.17,u*.05,h*.34);box(ctx,x-u*.12,cy,u*.24,u*.025);box(ctx,x-u*.04,cy-u*.025,u*.08,u*.025);for(let i=0;i<9;i++)line(ctx,[[x-u*.02,h*.19+i*h*.032],[x+u*.02,h*.19+i*h*.032]]);wheel(ctx,x,h*.15,u*.027,a,6);line(ctx,[[x,h*.17],[x,cy]]);break;
    }
    case 'deathtower-empty-access-block-and-switch':{
      const depth=h*.14*(1-c)/2;box(ctx,x-u*.15,h*.2,u*.3,h*.28);box(ctx,x-u*.13,h*.215+depth,u*.26,h*.08);for(let i=0;i<4;i++)line(ctx,[[x-u*.13,h*.23+depth+i*u*.016],[x+u*.13,h*.23+depth+i*u*.016]]);box(ctx,w*.3,h*.34,u*.055,u*.065);line(ctx,[[w*.3+u*.055,h*.37],[w*.4,h*.37],[w*.4,h*.18],[x,h*.18],[x,h*.215+depth]]);ellipse(ctx,w*.3+u*.025,h*.37,u*.012*(1+.2*s),u*.012);break;
    }
    case 'railwaygun-loading-jib-empty-shell-cradle':{
      const pivot=[w*.4,h*.23],tip=polar(...pivot,u*.24,-.2+.17*s);line(ctx,[[pivot[0],h*.49],pivot,tip]);line(ctx,[[pivot[0],h*.49],[pivot[0]+u*.07,h*.49],pivot]);wheel(ctx,...pivot,u*.03,a,6);const low=[tip[0],tip[1]+u*.12];line(ctx,[tip,low]);polygon(ctx,[[low[0]-u*.07,low[1]],[low[0]-u*.045,low[1]+u*.025],[low[0]+u*.045,low[1]+u*.025],[low[0]+u*.07,low[1]]]);break;
    }
    case 'neos-orbital-cannon-empty-positioning-collar':{
      ellipse(ctx,x,y,u*.11,u*.11);ellipse(ctx,x,y,u*.075,u*.075);for(let i=0;i<6;i++){const q=a+i*TAU/6;line(ctx,[polar(x,y,u*.075,q),polar(x,y,u*.11,q)]);}const barrelTip=polar(x,y,u*.2,-.28+.12*s);line(ctx,[[x-u*.06,y+u*.035],barrelTip]);line(ctx,[[x-u*.045,y+u*.065],[barrelTip[0],barrelTip[1]+u*.03]]);for(const side of [-1,1])line(ctx,[[x+side*u*.115,y],[x+side*u*.16,h*.48]]);break;
    }
    case 'thor-empty-bucket-wheel-and-counterboom':{
      const center=[w*.43,y],r=u*.12;wheel(ctx,...center,r,a,10);for(let i=0;i<10;i++){const p=polar(...center,r,a+i*TAU/10);box(ctx,p[0]-u*.018,p[1]-u*.014,u*.036,u*.028);}line(ctx,[[w*.35,h*.47],center,[w*.69,h*.24],[w*.71,h*.29],center]);box(ctx,w*.64,h*.24,u*.12,u*.05);box(ctx,w*.46,h*.43,u*.17,u*.04);for(let i=0;i<4;i++)ellipse(ctx,w*.47+i*u*.043,h*.48,u*.018,u*.018);break;
    }
    case 'headstone-mine-open-cargo-lift-and-drum':{
      const cy=h*(.29+.11*(1-c)/2);for(const dx of [-.11,.11])line(ctx,[[x+u*dx,h*.18],[x+u*dx,h*.5]]);wheel(ctx,x,h*.17,u*.032,a,7);line(ctx,[[x,h*.18],[x,cy]]);polygon(ctx,[[x-u*.15,cy],[x+u*.15,cy],[x+u*.12,cy+u*.025],[x-u*.12,cy+u*.025]]);for(const side of [-1,1])line(ctx,[[x+side*u*.12,cy],[x+side*u*.12,cy-u*.055],[x+side*u*.06,cy-u*.055]]);break;
    }
    case 'trost-supply-empty-four-rope-deck':{
      const cy=h*(.3+.1*(1-c)/2);for(const dx of [-.12,.12])for(const dy of [0,.025]){line(ctx,[[x+u*dx,h*.18+u*dy],[x+u*dx,cy+u*dy]]);wheel(ctx,x+u*dx,h*.17+u*dy,u*.014,a,4);}polygon(ctx,[[x-u*.16,cy],[x+u*.16,cy],[x+u*.13,cy+u*.035],[x-u*.19,cy+u*.035]]);for(let i=0;i<5;i++)line(ctx,[[x-u*.15+i*u*.06,cy],[x-u*.18+i*u*.06,cy+u*.035]]);break;
    }
    case 'trost-wall-empty-carrier-fixed-suspension':{
      const cy=h*(.25+.13*(1-c)/2);box(ctx,w*.37,h*.13,u*.055,h*.38);box(ctx,w*.66,h*.13,u*.055,h*.38);polygon(ctx,[[w*.37,cy],[w*.66+u*.055,cy],[w*.66+u*.055,cy+u*.03],[w*.37,cy+u*.03]]);line(ctx,[[w*.37+u*.025,cy],[w*.37+u*.025,h*.15],[w*.66+u*.025,h*.15],[w*.66+u*.025,cy]]);wheel(ctx,w*.37+u*.025,h*.15,u*.025,a,5);box(ctx,w*.7,h*.66-cy,u*.03,u*.055);break;
    }
    case 'seamonkey-unloaded-cannon-trunnion-and-wheels':{
      const root=[x,y],tip=polar(...root,u*.21,-.2+.08*s);line(ctx,[[x-u*.06,y-u*.025],[tip[0],tip[1]-u*.025],[tip[0],tip[1]+u*.025],[x-u*.06,y+u*.025],[x-u*.06,y-u*.025]]);ellipse(ctx,...root,u*.014,u*.014);box(ctx,x-u*.1,y+u*.035,u*.23,u*.04);for(const dx of [-.07,.09])wheel(ctx,x+u*dx,y+u*.09,u*.032,a*.1,6);line(ctx,[[x-u*.15,y+u*.13],[x+u*.18,y+u*.13]]);break;
    }
    case 'stan-grog-empty-helix-and-can-chute':{
      box(ctx,x-u*.12,y-u*.15,u*.24,u*.3);box(ctx,x-u*.09,y-u*.12,u*.18,u*.15);for(let i=0;i<10;i++){const yy=y-u*.105+i*u*.012;ellipse(ctx,x+u*.018*Math.sin(a+i*.5),yy,u*.055,u*.007);}box(ctx,x-u*.08,y+u*.055,u*.16,u*.06);box(ctx,x-u*.07,y+u*.055+u*.018*(1-c)/2,u*.14,u*.018);break;
    }
    case 'gardens-rectangular-sponge-fixed-cord-swing':{
      const g=getStageAnimationWave9Geometry(animation.mechanism,t,w,h);line(ctx,[[g.root[0]-u*.06,g.root[1]],[g.root[0]+u*.06,g.root[1]]]);line(ctx,[g.root,g.end]);box(ctx,g.end[0]-u*.045,g.end[1],u*.09,u*.065);for(let i=0;i<5;i++)ellipse(ctx,g.end[0]+u*(-.03+i*.015),g.end[1]+u*(.017+(i%2)*.024),u*.005,u*.005);break;
    }
    case 'skatetovictory-staggered-four-grip-wheels':{
      for(let j=0;j<2;j++){const cx=w*(.39+j*.22),cy=h*(.34-j*.06),r=u*(j?.09:.12);ellipse(ctx,cx,cy,r,r);for(let i=0;i<4;i++){const q=(j?-a:a)+i*TAU/4,p=polar(cx,cy,r,q);line(ctx,[[cx,cy],p]);polygon(ctx,[polar(cx,cy,r*.8,q-.12),polar(cx,cy,r*1.06,q-.12),polar(cx,cy,r*1.06,q+.12),polar(cx,cy,r*.8,q+.12)]);}line(ctx,[[cx,cy],[cx,h*.49]]);}break;
    }
    case 'scorch-empty-cage-and-unheated-shutter':{
      const cy=h*(.24+.065*(1-c)/2),sh=u*.07*(1-c)/2;box(ctx,x-u*.08,cy,u*.16,u*.1);for(let i=1;i<4;i++)line(ctx,[[x-u*.08+i*u*.04,cy],[x-u*.08+i*u*.04,cy+u*.1]]);line(ctx,[[x,h*.15],[x,cy]]);wheel(ctx,x,h*.15,u*.025,a,5);box(ctx,x-u*.13,h*.42,u*.26,u*.04);box(ctx,x-u*.12+sh,h*.43,u*.18,u*.016);break;
    }
    case 'sonata-metronome-rigid-adjustable-weight':{
      const g=getStageAnimationWave9Geometry(animation.mechanism,t,w,h);polygon(ctx,[[x-u*.075,h*.46],[x-u*.038,h*.2],[x+u*.038,h*.2],[x+u*.075,h*.46]]);line(ctx,[g.root,g.end]);ellipse(ctx,...g.root,u*.012,u*.012);box(ctx,g.weight[0]-u*.018,g.weight[1]-u*.009,u*.036,u*.018);ellipse(ctx,...g.end,u*.006,u*.006);break;
    }
    case 'creo-conveyorhub-two-cylinder-empty-belt':{
      for(const dx of [-.15,.15]){ellipse(ctx,x+u*dx,y-u*.035,u*.05,u*.09);wheel(ctx,x+u*dx,y-u*.035,u*.035,a,6);}const left=w*.3,len=w*.4;line(ctx,[[left,h*.43],[left+len,h*.43],[left+len,h*.46],[left,h*.46],[left,h*.43]]);for(let i=0;i<12;i++){const xx=left+len*((i/12+t)%1);line(ctx,[[xx,h*.43],[xx,h*.46]]);}for(let i=0;i<5;i++)wheel(ctx,w*(.33+i*.085),h*.48,u*.015,a*2,3);break;
    }
    case 'resolve-courtyard-empty-exolift-guide':{
      const cy=h*(.26+.14*(1-c)/2);box(ctx,x-u*.025,h*.17,u*.05,h*.34);const body=[x,cy];polygon(ctx,[[x-u*.075,cy-u*.02],[x+u*.075,cy-u*.02],[x+u*.06,cy+u*.03],[x-u*.06,cy+u*.03]]);for(const side of [-1,1])line(ctx,[[x+side*u*.06,cy],[x+side*u*.08,cy-u*.055]]);line(ctx,[[x,h*.17],body]);wheel(ctx,x,h*.15,u*.023,a,5);break;
    }
    case 'cartown-hydrodam-empty-pulley-and-sluice':{
      const cy=h*(.3+.1*(1-c)/2);for(const dx of [-.11,.11])box(ctx,x+u*dx-u*.015,h*.22,u*.03,h*.29);box(ctx,x-u*.1,cy,u*.2,u*.09);for(let i=0;i<4;i++)line(ctx,[[x-u*.1,cy+u*.02*i],[x+u*.1,cy+u*.02*i]]);wheel(ctx,x,h*.18,u*.045,a,6);line(ctx,[[x,h*.225],[x,cy]]);line(ctx,[[w*.3,h*.5],[w*.72,h*.5]]);break;
    }
    case 'jungleland-rigid-drawbridge-and-winding-rope':{
      const g=getStageAnimationWave9Geometry(animation.mechanism,t,w,h);line(ctx,[g.root,g.end]);line(ctx,[[g.root[0],g.root[1]+u*.02],[g.end[0],g.end[1]+u*.02]]);line(ctx,[g.drum,g.end]);wheel(ctx,...g.drum,u*.03,g.drumAngle,6);ellipse(ctx,...g.root,u*.012,u*.012);line(ctx,[[g.drum[0],h*.49],g.drum]);for(let i=1;i<7;i++){const q=i/7,cx=g.root[0]+q*(g.end[0]-g.root[0]),cy=g.root[1]+q*(g.end[1]-g.root[1]);line(ctx,[[cx,cy],[cx,cy+u*.02]]);}break;
    }
    case 'kelpseeds-window-crank-guided-panel':{
      const top=h*.23,shift=u*.065*(1-c)/2;box(ctx,x-u*.13,top,u*.26,h*.25);box(ctx,x-u*.11,top+u*.025+shift,u*.22,u*.12);line(ctx,[[x,top+u*.025+shift],[x,top+u*.145+shift]]);wheel(ctx,w*.31,h*.35,u*.035,a,4);line(ctx,[[w*.31,h*.35],[w*.31,h*.19],[x,h*.19],[x,top+u*.025+shift]]);const tip=polar(w*.31,h*.35,u*.05,a);line(ctx,[[w*.31,h*.35],tip]);ellipse(ctx,...tip,u*.007,u*.007);break;
    }
    case 'kelpseeds-volcano-empty-bucket-countergate':{
      const g=getStageAnimationWave9Geometry(animation.mechanism,t,w,h);line(ctx,[g.bucket,[g.bucket[0],g.top],[g.gate[0],g.top],g.gate]);wheel(ctx,(g.bucket[0]+g.gate[0])/2,g.top,u*.03,a,6);const [bx,by]=g.bucket;polygon(ctx,[[bx-u*.035,by],[bx+u*.035,by],[bx+u*.025,by+u*.06],[bx-u*.025,by+u*.06]]);line(ctx,[[bx-u*.026,by],[bx,by-u*.025],[bx+u*.026,by]]);box(ctx,g.gate[0]-u*.09,g.gate[1],u*.18,u*.1);for(const dx of [-.105,.105])line(ctx,[[g.gate[0]+u*dx,h*.24],[g.gate[0]+u*dx,h*.51]]);break;
    }
    case 'mobcom-empty-selector-carousel-and-tray':{
      box(ctx,x-u*.13,y-u*.15,u*.26,u*.3);ellipse(ctx,x,y-u*.035,u*.08,u*.08);for(let i=0;i<6;i++){const p=polar(x,y-u*.035,u*.06,a+i*TAU/6);box(ctx,p[0]-u*.012,p[1]-u*.012,u*.024,u*.024);}box(ctx,x-u*.08,y+u*.075,u*.16,u*.03);box(ctx,x-u*.065+u*.02*(1-c)/2,y+u*.08,u*.13,u*.018);break;
    }
    case 'nog-empty-fortress-tram-and-guide-rollers':{
      const cx=w*(.35+.28*(1-c)/2),cy=h*.34;line(ctx,[[w*.28,cy+u*.08],[w*.76,cy+u*.08]]);line(ctx,[[w*.28,cy+u*.1],[w*.76,cy+u*.1]]);box(ctx,cx-u*.09,cy-u*.08,u*.18,u*.12);box(ctx,cx-u*.065,cy-u*.06,u*.05,u*.04);box(ctx,cx+u*.015,cy-u*.06,u*.05,u*.04);for(const dx of [-.06,.06])wheel(ctx,cx+u*dx,cy+u*.06,u*.02,a*2,5);break;
    }
    case 'luxor-rigid-rising-obelisk-and-pedestal':{
      const cy=h*(.22+.055*(1-c)/2);polygon(ctx,[[x-u*.035,cy+u*.16],[x-u*.028,cy],[x,cy-u*.045],[x+u*.028,cy],[x+u*.035,cy+u*.16]]);line(ctx,[[x,cy-u*.045],[x,cy+u*.16]]);box(ctx,x-u*.085,h*.43,u*.17,u*.04);box(ctx,x-u*.12,h*.47,u*.24,u*.025);for(const side of [-1,1])line(ctx,[[x+side*u*.06,cy+u*.06],[x+side*u*.06,h*.43]]);break;
    }
    case 'greatpyramid-opposed-stepped-stone-doors':{
      const shift=u*.075*(1-c)/2;polygon(ctx,[[x-u*.19,h*.49],[x-u*.13,h*.19],[x+u*.13,h*.19],[x+u*.19,h*.49]]);for(const side of [-1,1]){const xx=x+side*shift;polygon(ctx,[[xx,h*.23],[xx+side*u*.06,h*.23],[xx+side*u*.06,h*.32],[xx+side*u*.11,h*.32],[xx+side*u*.11,h*.47],[xx,h*.47]]);for(let i=0;i<3;i++)line(ctx,[[xx,h*.28+i*h*.05],[xx+side*u*(i? .1:.06),h*.28+i*h*.05]]);}break;
    }
    case 'foundation-signalbooster-three-feet-scan-head':{
      const base=[x,h*.43];for(let i=0;i<3;i++){const q=i*TAU/3;line(ctx,[base,[x+u*.12*Math.cos(q),h*.49+u*.025*Math.sin(q)]]);}line(ctx,[base,[x,h*.23]]);box(ctx,x-u*.045,h*.28,u*.09,u*.08);const angle=.65*s,head=polar(x,h*.23,u*.07,angle);line(ctx,[[x,h*.23],head]);line(ctx,[[head[0],head[1]-u*.025],[head[0],head[1]+u*.025]]);box(ctx,x-u*.012,h*.19,u*.024,u*.035);break;
    }
    case 'beyond-extractor-fixed-rod-piston':{
      const g=getStageAnimationWave9Geometry(animation.mechanism,t,w,h);box(ctx,w*.34,h*.2,w*.3,h*.27);wheel(ctx,...g.root,g.radius,a,7);line(ctx,[g.root,g.crank,g.slider]);box(ctx,g.slider[0]-u*.016,g.slider[1]-u*.035,u*.032,u*.07);line(ctx,[[g.slider[0],g.slider[1]+u*.035],[g.slider[0],h*.46]]);box(ctx,w*.6,h*.37,u*.045,h*.1);line(ctx,[[w*.6+u*.045,h*.41],[w*.71,h*.41],[w*.71,h*.48]]);break;
    }
    case 'dryice-empty-short-wheelbase-service-cart':{
      const cx=x+w*.16*s,cy=h*.37;line(ctx,[[w*.25,cy+u*.08],[w*.77,cy+u*.08]]);line(ctx,[[w*.25,cy+u*.095],[w*.77,cy+u*.095]]);for(let i=0;i<12;i++)line(ctx,[[w*(.26+i*.043),cy+u*.08],[w*(.26+i*.043),cy+u*.095]]);polygon(ctx,[[cx-u*.1,cy-u*.045],[cx+u*.1,cy-u*.045],[cx+u*.075,cy+u*.025],[cx-u*.075,cy+u*.025]]);for(const dx of [-.06,.06])wheel(ctx,cx+u*dx,cy+u*.055,u*.022,a*3,5);break;
    }
    case 'bladehenge-megastage-linked-speaker-cones':{
      const left=w*.31,right=w*.7;box(ctx,left,h*.19,right-left,u*.025);for(const cx of [left,right-u*.08]){box(ctx,cx,h*.24,u*.08,h*.25);for(let i=0;i<3;i++){const cy=h*.28+i*u*.06,rx=u*(.027+.005*Math.sin(a+i*.7));ellipse(ctx,cx+u*.04,cy,rx,u*.027);ellipse(ctx,cx+u*.04+u*.004*s,cy,u*.01,u*.01);}}box(ctx,x-u*.085,h*.43,u*.17,u*.025);for(let i=0;i<5;i++)line(ctx,[[left+(right-left)*i/5,h*.19],[left+(right-left)*(i+1)/5,h*.19+u*.025]]);break;
    }
    default:return false;
  }
  return true;
}
