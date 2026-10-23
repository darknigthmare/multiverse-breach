// Empty scene hardware, never source-game footage. Location/function references
// are distinct from the authored cutaways, dimensions, drive parts and cycles.
const adaptation = ' Empty no-load background study: outlines, exposed drives, dimensions, phase and repeat are authored. It creates no access, vehicle, person, reward, hazard, damage or collision and is not verified source animation.';
const pack = (universe, sourceWork, sourceReference, sourceAccess, continuity, excludedScenePattern, scenes) => scenes.map(spec => Object.freeze({
  ...spec, universes: Object.freeze([universe]), sourceWork: spec.sourceWork || sourceWork,
  sourceReference: spec.sourceReference || sourceReference, sourceAccess: spec.sourceAccess || sourceAccess,
  continuity: spec.continuity || continuity, excludedScenePattern: new RegExp('(?:'+(spec.excludedScenePattern || excludedScenePattern).source+')|\\bdestroyed\\b','i'),
  sceneEvidence: spec.sceneEvidence + adaptation,
  animationWave: 10, animationProvenance: 'authored-scene-mechanism-geometry-and-timing',
  renderingKind: 'authored-mechanism', localBackdrops: Object.freeze({}),
  timeSource: 'simulation-elapsed-seconds', reducedMotionBehavior: 'freeze-at-time-zero',
  sourceVisualValidation: 'not-validated-1:1', fidelityVerified: false, officialSourceFrames: false, gameplayEffect: 'none'
}));
export const STAGE_ANIMATION_WAVE_10 = Object.freeze([
  ...pack('Breaking Bad','Breaking Bad (2008–2013), Albuquerque laundry and car wash','https://breakingbad.fandom.com/wiki/Lavander%C3%ADa_Brillante','indexed-excerpt-only-open-failed','Original television locations before their closure; no El Camino scene or chemical production',/el camino|better call saul|destroyed|closed permanently/i,[
    {id:'bb-a1a-empty-brush-bay',sourceScene:'A1A Car Wash — brosses de la baie vide, Breaking Bad 2008',scenePattern:/a1a.*(?:wash|bross|brush|baie)/i,mechanism:'a1a-twin-cylindrical-brushes',color:'#9cb7bd',periodSeconds:47,sceneEvidence:'A1A is the series car-wash workplace. Two cylindrical service brushes interpret the washing function; their particular machinery and rotation are not established by the location reference.',sourceReference:'https://www.visitalbuquerque.org/abq365/blog/post/breaking-bad-filming-locations-you-can-visit/',sourceAccess:'opened-location-text-function-adaptation'},
    {id:'bb-lavanderia-tilting-machine',sourceScene:'Lavandería Brillante — machine basculante de l’entrée cachée, Breaking Bad',scenePattern:/lavander[ií]a.*(?:machine|entr|tilt|basc)/i,mechanism:'lavanderia-rigid-machine-tilt-link',color:'#aab7a1',periodSeconds:79,sceneEvidence:'The laundry reference identifies the entrance hidden behind a laundry machine. An empty rectangular machine tilts about a fixed hinge with a constant-length connecting rod; no lab or working chemistry is depicted.'}
  ]),
  ...pack('La Casa de Papel','La Casa de Papel (2017–2021), Royal Mint and fictional Bank of Spain','https://www.newtral.es/fact-fiction-camara-acorazada-banco-de-espana-casa-de-papel/20210829/','opened-selected-fact-fiction-passage','The television vault differs from the real institution; no flood, gold transfer or robbery progression',/berlin spin.?off|korea|real bank blueprint|flooded|destroyed/i,[
    {id:'casa-royalmint-empty-press',sourceScene:'Royal Mint — presse à billets sans papier, La Casa de Papel parties 1 et 2',scenePattern:/(?:royal mint|fabrique.*monnaie|imprimerie).*(?:press|presse|billet)/i,mechanism:'royalmint-four-nip-printing-cylinders',color:'#a4b8a0',periodSeconds:61,sceneEvidence:'The first heist uses the Mint printing room. Four opposed cylinders and an empty feed demonstrate a press; no banknote artwork, denomination, printing output or money is produced.',sourceReference:'https://casa-de-papel.hypnoweb.net/la-casa-de-papel/les-dossiers-du-professeur/les-lieux-emblematiques/la-fabrique-nationale-de-la-monnaie.271.110/',sourceAccess:'indexed-location-excerpt-only'},
    {id:'casa-bank-vault-bolts',sourceScene:'Bank of Spain — verrous radiaux de la porte fictive, La Casa de Papel partie 3',scenePattern:/(?:bank of spain|banco.*espa|banque.*espagne).*(?:vault|verrou|coffre|porte)/i,mechanism:'fictional-bank-eight-linked-locking-bolts',color:'#b9b1a0',periodSeconds:83,sceneEvidence:'The opened fact-check explicitly distinguishes the series single armored door from the actual succession of bank doors. Eight linked empty bolts are an invented functional cutaway, not a real security-system plan.'}
  ]),
  ...pack('The Da Vinci Code','The Da Vinci Code (2006 film), cryptex and Rosslyn Chapel','https://www.filmsite.org/davincicode.html','opened-selected-film-summary-passages','2006 film props only; no code solution, contents, tomb or inferred historical machine',/angels.*demons|inferno|2003 novel only|destroyed/i,[
    {id:'dvc-cryptex-five-bands',sourceScene:'Cryptex — cinq bagues sans lettres, The Da Vinci Code 2006',scenePattern:/cryptex.*(?:bague|band|dial|2006)/i,mechanism:'cryptex-five-independent-plain-bands',color:'#c0b18f',periodSeconds:73,sceneEvidence:'The film account specifies five rotating alphabetic dials. Five plain bands rotate about one cylinder; letters, password, vinegar and opening are deliberately absent.'},
    {id:'dvc-rosslyn-empty-floor-hatch',sourceScene:'Rosslyn Chapel — trappe de l’escalier inférieur, The Da Vinci Code 2006',scenePattern:/rosslyn.*(?:hatch|trappe|escalier|2006)/i,mechanism:'rosslyn-floor-hatch-fixed-hinge',color:'#b9b6ac',periodSeconds:89,sceneEvidence:'The film summary identifies a basement trapdoor stairway at Rosslyn. A rigid empty hatch pivots about one fixed edge, without opening any passage or depicting remains.'}
  ]),
  ...pack('Home Alone','Home Alone (1990); January 1990 draft used as prop reference','https://assets.scriptslug.com/live/pdf/scripts/home-alone-1990.pdf','opened-selected-draft-passages','McCallister furnace and garage, no living furnace face and no traps; draft is not final-film frame proof',/home alone.?2\b|lost in new york|2021|face|monster|destroyed/i,[
    {id:'home1990-furnace-plain-damper',sourceScene:'McCallister basement — volet métallique du four sans visage, Home Alone 1990',scenePattern:/(?:mccallister|basement|sous.sol).*(?:furnace|four|volet)/i,mechanism:'mccallister-plain-hinged-furnace-damper',color:'#b5a28c',periodSeconds:67,sceneEvidence:'The opened draft operates the furnace with a lever and later describes an imagined face. Only the real mechanical casing, lever and hinged damper are interpreted, with no eyes, mouth, flame or trap.'},
    {id:'home1990-garage-sectional-door',sourceScene:'McCallister garage — porte segmentée vide, Home Alone 1990',scenePattern:/(?:mccallister.*garage|garage.*(?:section|porte|door|1990))/i,mechanism:'mccallister-door-panels-on-quarter-track',color:'#b6bbae',periodSeconds:97,sceneEvidence:'The draft explicitly shows the garage door open and discusses whether it was closed. A sectional overhead track is an authored functional interpretation, without cars, entry, injury or security state.'}
  ]),
  ...pack('Men in Black','Men in Black (1997), headquarters and Ford LTD','https://sony.fandom.com/wiki/Men_in_Black_%281997_film%29/Transcript','indexed-excerpt-only-open-failed','Original 1997 headquarters and LTD only; no sequel vehicle or live performer',/men in black.?[23]\b|international|2019|destroyed/i,[
    {id:'mib1997-headquarters-elevator',sourceScene:'MIB Headquarters — portes de l’ascenseur d’entrée, 1997',scenePattern:/(?:mib.*headquarters|quartier.*mib).*(?:elevator|ascenseur|entr)/i,mechanism:'mib-entry-offset-split-lift-doors',color:'#b7c3c6',periodSeconds:59,sceneEvidence:'The indexed transcript opens the elevator onto headquarters. Two offset steel leaves move in opposed guides; no alien, visitor, authentication or lift transport is created.'},
    {id:'mib1997-ltd-wheel-rotation',sourceScene:'Ford LTD — train roulant à vide du tunnel, Men in Black 1997',scenePattern:/ford.*ltd.*(?:wheel|roulant|tunnel|1997)/i,mechanism:'ltd-two-axle-tunnel-traction-study',color:'#a4b6c8',periodSeconds:71,sceneEvidence:'The indexed screenplay drives the LTD along the tunnel wall and ceiling. Two empty axles rotate inside a fixed chassis study; no transformed chassis or sequel car is asserted.'}
  ]),
  ...pack('Starship Troopers','Starship Troopers (1997), Rodger Young and DR-8 retrieval craft','https://scifiinterfaces.com/category/starship-troopers-1997/?order=asc','opened-selected-door-analysis','1997 film hardware; not the 2005 game Outpost 29 or a battle scene',/outpost.?29|2005 game|invasion 2012|traitor.*mars|destroyed/i,[
    {id:'sst1997-rodgeryoung-vertical-door',sourceScene:'Rodger Young bridge — porte lourde à levée verticale, Starship Troopers 1997',scenePattern:/rodger.*young.*(?:bridge|passerelle).*(?:door|porte|1997)/i,mechanism:'rodgeryoung-single-heavy-plate-and-rack',color:'#aab4bd',periodSeconds:79,sceneEvidence:'The opened analysis specifies vertically rising plate-metal bridge doors with safety stripes. A toothed rack raises one empty plate; the rack and repeated return are authored.'},
    {id:'sst1997-whiskey-retrieval-hatch',sourceScene:'Whiskey Outpost — trappe vide du DR-8 de récupération, film 1997',scenePattern:/whiskey.*(?:dr.?8|retrieval|trappe|hatch|1997)/i,mechanism:'dr8-retrieval-two-leaf-ramp-hinge',color:'#b3b2a1',periodSeconds:83,sceneEvidence:'The retrieval-craft reference identifies the landing boat at Whiskey Outpost in the film. Two unloaded hatch panels demonstrate access hardware; exact hinge construction is adapted, not the modified 2005-game rear hatch.',sourceReference:'https://starshiptroopers.fandom.com/wiki/DR-8_Skyhook',sourceAccess:'indexed-film-location-excerpt-only'}
  ]),
  ...pack('H2G2','The Hitchhiker’s Guide to the Galaxy (2005 film)','https://www.springfieldspringfield.co.uk/movie_script.php?movie=the-hitchhikers-guide-to-the-galaxy','opened-selected-film-dialogue','2005 film doors only, no radio-series or Infocom-game hardware and no ejection',/1981|1984|infocom|radio series|destroyed/i,[
    {id:'h2g2-heartofgold-door-travel',sourceScene:'Heart of Gold — portes Sirius sans voix ni visage, film 2005',scenePattern:/heart of gold.*(?:sirius|door|porte|2005)/i,mechanism:'heartofgold-two-curved-door-tracks',color:'#bfc3b1',periodSeconds:73,sceneEvidence:'The opened dialogue identifies the programmed doors aboard the Heart of Gold. Two curved unoccupied tracks and plain leaves adapt opening and closing; no personality face or audio is reproduced.'},
    {id:'h2g2-vogon-empty-airlock',sourceScene:'Vogon ship — sas circulaire vide, film H2G2 2005',scenePattern:/vogon.*(?:airlock|sas|2005)/i,mechanism:'vogon-airlock-three-spoke-handwheel',color:'#aab39a',periodSeconds:101,sceneEvidence:'The film story ejects the travelers through a Vogon airlock. Only a shut hatch with a three-spoke locking wheel is interpreted; no pressure, passenger, void or ejection occurs.'}
  ]),
  ...pack('Inside Out','Inside Out (2015), original Headquarters and Long-Term Memory','https://assets.scriptslug.com/live/pdf/scripts/inside-out-2015.pdf','opened-selected-final-script-passages','Original 2015 machinery before collapse; not Inside Out 2, puberty console or character action',/inside out.?2\b|2024|puberty|collapsed|broken/i,[
    {id:'io2015-headquarters-vacuum-sleeve',sourceScene:'Headquarters — tube aspirant rétractable vide, Inside Out 2015',scenePattern:/headquarters.*(?:vacuum|aspirant|r[eé]tract|2015)/i,mechanism:'headquarters-three-telescoping-suction-sleeves',color:'#abbfc2',periodSeconds:67,sceneEvidence:'The opened final script explicitly retracts the Headquarters vacuum tube. Three coaxial sleeves extend on one axis; no memory, emotion, body or mental state is transferred.'},
    {id:'io2015-longterm-recall-carrier',sourceScene:'Long-Term Memory — tube de rappel et sphère sans image, Inside Out 2015',scenePattern:/long.term.*(?:recall|rappel|tube|2015)/i,mechanism:'longterm-elbow-tube-empty-marker-transport',color:'#bab99a',periodSeconds:89,sceneEvidence:'The script exposes a shelf-end tube and sends a memory toward Headquarters. A blank technical marker travels through an elbow tube, with constant-radius bend; no picture, recall, story event or shelf collapse is recreated.'}
  ]),
  ...pack('Zootopia','Zootopia (2016 original film), climate wall and central station','https://www.comingsoon.net/movies/features/648837-zootopia-guide-how-disneys-new-film-builds-a-different-kind-of-world','opened-location-press-material','2016 climate districts, with no Zootopia 2 weather-wall history or living silhouettes',/zootopia.?2\b|2025|reptile|destroyed/i,[
    {id:'zootopia2016-climatewall-fan',sourceScene:'Sahara–Tundratown climate wall — ventilation vide, Zootopia 2016',scenePattern:/(?:sahara|tundratown|climate wall).*(?:fan|ventil|2016)/i,mechanism:'climatewall-four-louver-and-crossflow-fan',color:'#abc5c7',periodSeconds:53,sceneEvidence:'Production material explicitly describes the wall as large air conditioning between hot and cold districts. A crossflow rotor behind four linked louvers interprets that function; exact machinery and thermodynamics are not verified.'},
    {id:'zootopia2016-station-empty-escalator',sourceScene:'Zootopia Central Station — escalier roulant sans passagers, 2016',scenePattern:/(?:zootopia.*central station|gare centrale).*(?:escal|roulant|2016)/i,mechanism:'centralstation-return-loop-escalator-steps',color:'#bcb6a2',periodSeconds:71,sceneEvidence:'The indexed film transcript explicitly places Judy on the central-station escalator. Rigid empty steps follow a closed incline/return path, without any animal, passenger or transport.',sourceReference:'https://zootopia.fandom.com/wiki/Zootopia/Transcript',sourceAccess:'indexed-excerpt-only-open-failed'}
  ]),
  ...pack('Chappie','Chappie (2015), Tetravaal manufacturing facility and MOOSE hardware','https://en.wikipedia.org/wiki/Chappie_%28film%29','opened-location-summary-function-adaptation','2015 machinery on empty maintenance fixtures; no consciousness, robot anatomy or combat firing',/district.?9|elysium|occupied|destroyed/i,[
    {id:'chappie2015-tetravaal-empty-gantry',sourceScene:'Tetravaal factory — portique de fabrication sans corps, Chappie 2015',scenePattern:/tetravaal.*(?:factory|fabric|gantry|portique)/i,mechanism:'tetravaal-empty-two-axis-production-gantry',color:'#b6bba5',periodSeconds:83,sceneEvidence:'The film summary identifies Tetravaal’s manufacturing facility. An empty two-axis production gantry is a functional study of that setting, not a claimed source model or a robot-production animation.'},
    {id:'chappie2015-moose-unloaded-rotor',sourceScene:'Tetravaal MOOSE workshop — faisceau rotatif désarmé sur établi, 2015',scenePattern:/(?:moose.*(?:workshop|atelier|rotor)|tetravaal.*moose)/i,mechanism:'moose-detached-unloaded-barrel-cluster',color:'#b5a891',periodSeconds:61,sceneEvidence:'MOOSE is the film’s armed remote-controlled machine. A detached unpowered barrel cluster turns on an empty workshop mount; count and cradle are authored, with no robot body, ammunition, targeting or discharge.'}
  ]),
  ...pack('BlazBlue','BlazBlue: Calamity Trigger (2008), Kagutsuchi Monorail and Port','https://blazblue.wiki/wiki/Kagutsuchi_Port','opened-selected-location-passages','Calamity Trigger Kagutsuchi; not the Embryo replica, Cross Tag or Central Fiction continuity',/embryo|cross tag|central fiction|chrono phantasma|destroyed/i,[
    {id:'bbct2008-monorail-bogie',sourceScene:'Kagutsuchi Monorail — bogie vide sur rail unique, Calamity Trigger 2008',scenePattern:/monorail.*(?:bogie|rail|calamity|2008)/i,mechanism:'kagutsuchi-monorail-opposed-guide-wheels',color:'#a7b5c1',periodSeconds:59,sceneEvidence:'The indexed Monorail entry places the Calamity Trigger stage on Kagutsuchi railway. Opposed guide wheels around one beam are a transport-function cutaway; exact bogie construction is not asserted.',sourceReference:'https://blazblue.wiki/wiki/Monorail',sourceAccess:'indexed-excerpt-only-open-failed'},
    {id:'bbct2008-port-steampunk-clock',sourceScene:'Kagutsuchi Port — horloge mécanique du quai aérien, Calamity Trigger 2008',scenePattern:/kagutsuchi.*port.*(?:clock|horloge|2008)/i,mechanism:'kagutsuchi-port-clock-three-geared-arbors',color:'#c2ae8e',periodSeconds:97,sceneEvidence:'The opened location page explicitly names the large steampunk clock hanging by the aerial harbor. Three exposed geared arbors and plain clock hands interpret its mechanism; the source-stage time label is not used as an actual simulation clock.'}
  ]),
  ...pack('Killzone','Killzone 2 (2009), Tharsis Refinery','https://portforward.com/games/walkthroughs/Killzone-2/Mission-7.-Tharsis-Refinery.htm','opened-selected-walkthrough-passages','Original working Tharsis hardware, with no Arc Trooper, petruzyte discharge or sequel map',/killzone.?3|shadow fall|mercenary|destroyed|electrified/i,[
    {id:'kz22009-tharsis-empty-lift',sourceScene:'Tharsis Refinery — ascenseur central vide, Killzone 2 2009',scenePattern:/tharsis.*(?:central.*lift|ascenseur central|elevator)/i,mechanism:'tharsis-central-car-and-chain-return',color:'#b7b3a0',periodSeconds:79,sceneEvidence:'The opened guide operates the central elevator using its switch. An empty guided deck shares a chain return with a counterweight; no character, floor access or electrical hazard is created.'},
    {id:'kz22009-tharsis-empty-slagpots',sourceScene:'Tharsis Refinery — pots à laitier vides sur rail, Killzone 2 2009',scenePattern:/tharsis.*(?:slag|laitier|pots|rail)/i,mechanism:'tharsis-overhead-empty-slagpot-trolley',color:'#b1a394',periodSeconds:67,sceneEvidence:'The guide explicitly rides slag pots along an overhead path. Two empty rigid carriers roll on the rail, without molten material, weapon fire, passenger or gameplay conveyor.'}
  ]),
  ...pack('Jet Set Radio','Jet Set Radio / Jet Grind Radio (2000–2001 Dreamcast)','https://hardandsoftgaming.wordpress.com/2011/04/05/jet-set-radio-guide-walkthrough/','opened-selected-original-guide-passages','Original Dreamcast Shibuya and Benten, no Jet Set Radio Future or imported HD map changes',/future|2002 xbox|destroyed/i,[
    {id:'jsr2000-shibuya-empty-crane',sourceScene:'Shibuya park — grue de la route inachevée, Jet Set Radio Dreamcast',scenePattern:/shibuya.*(?:crane|grue|unfinished|inachev)/i,mechanism:'shibuya-crane-fixed-jib-empty-hoist',color:'#c8b783',periodSeconds:83,sceneEvidence:'The opened 2001 guide crosses the crane by Shibuya park and its unfinished road. A fixed truss carries a small empty hoist on two ropes; its no-load cycle is authored and never becomes a grindable surface.'},
    {id:'jsr2000-benten-empty-railcar',sourceScene:'Benten Graffiti High — train vide du couloir ferroviaire, Dreamcast',scenePattern:/(?:benten|graffiti high).*(?:train|rail|ferroviaire)/i,mechanism:'benten-empty-railcar-two-bogie-pass',color:'#a8bdc3',periodSeconds:71,sceneEvidence:'The opened Graffiti High passage starts atop a train and observes another passing train. One empty carriage and two rotating bogies pass in the background, without skaters, tags, points or collision.'}
  ]),
  ...pack('Streets of Rage','Streets of Rage 2 (1992 Mega Drive), Munitions Plant cargo elevator','https://manuals.sega.com/genesismini/pdf/STREETS_OF_RAGE_2.pdf','indexed-manual-excerpt-open-timeout','Mega Drive cargo elevator as two separate exposed service mechanisms; not the Game Gear remake or a live playable lift',/game gear|streets of rage.?[134]\b|2020|occupied|destroyed/i,[
    {id:'sor21992-plant-hoist',sourceScene:'Munitions Plant — treuil du cargo elevator vide, Streets of Rage 2 Mega Drive',scenePattern:/munitions plant.*(?:hoist|treuil|cargo elevator)/i,mechanism:'munitionsplant-two-drum-cargo-hoist',color:'#bba48f',periodSeconds:73,sceneEvidence:'The official manual excerpt explicitly takes a cargo elevator to the roof. Two linked winding drums interpret the lift drive; exact internal design is not shown or certified by that excerpt.'},
    {id:'sor21992-plant-lift-gate',sourceScene:'Munitions Plant — grille de desserte du cargo lift, Streets of Rage 2 Mega Drive',scenePattern:/munitions plant.*(?:grille|service gate|cargo lift)/i,mechanism:'munitionsplant-empty-scissor-service-gate',color:'#aab6ad',periodSeconds:89,sceneEvidence:'The same documented cargo elevator anchors a distinct empty service-gate cutaway. Rigid scissor links telescope across a fixed opening. The gate design is an explicit functional adaptation, not a second claimed original source prop.'}
  ]),
  ...pack('Parasite Eve','Parasite Eve (1998 PlayStation), Chrysler EX Game and final carrier','https://www.neoseeker.com/parasite-eve/faqs/31680-e.html','indexed-walkthrough-excerpt-open-failed','Original 1998 locations; working empty mechanisms before the final detonation, no mutated bodies',/parasite eve.?2\b|third birthday|remake|explosion|destroyed/i,[
    {id:'pe1998-chrysler-keyed-elevator',sourceScene:'Chrysler Building EX Game — cabine à clé vide, Parasite Eve 1998',scenePattern:/chrysler.*(?:elevator|ascenseur|key|cl[eé])/i,mechanism:'chrysler-keyed-lift-and-segment-indicator',color:'#b1bdc3',periodSeconds:97,sceneEvidence:'The indexed guide unlocks the Chrysler elevator by floor keys. An empty car moves along a guide beside a bounded plain mechanical indicator; no key, floor access or enemy reset is simulated.'},
    {id:'pe1998-carrier-unheated-boiler',sourceScene:'Aircraft carrier Engine Room — chaudière froide, Parasite Eve 1998',scenePattern:/(?:carrier|porte.avions|aircraft).*engine room.*(?:boiler|chaudi[eè]re|1998)/i,mechanism:'carrier-boiler-cold-pressure-linkage',color:'#b6ac99',periodSeconds:61,sceneEvidence:'The indexed final walkthrough operates the carrier’s engine-room boiler. A cold piston and gauge linkage form an empty service study; steam, pressure increase, timed detonation and infection are absent.'}
  ]),
  ...pack('Dead by Daylight','Dead by Daylight (2016 base game), MacMillan Estate','https://deadbydaylight.wiki.gg/wiki/Generators','indexed-official-wiki-excerpt-open-failed','Base-realm hardware, no event generator, skill check, repair progress or escape',/event generator|esoteric|halloween event|destroyed|damaged/i,[
    {id:'dbd-macmillan-coaltower-generator',sourceScene:'MacMillan Coal Tower — vilebrequin du générateur vide, Dead by Daylight',scenePattern:/(?:macmillan|coal tower).*(?:generator|g[eé]n[eé]rateur|crank)/i,mechanism:'coaltower-four-piston-generator-crankshaft',color:'#a7b59a',periodSeconds:59,sceneEvidence:'The official wiki excerpt identifies a generator on Coal Tower’s upper floor. Four aligned pistons drive a shared crankshaft in a distant maintenance model; no repair, noise alert, electricity or skill check is created.',sourceReference:'https://deadbydaylight.wiki.gg/wiki/Coal_Tower'},
    {id:'dbd-macmillan-empty-exitgate',sourceScene:'MacMillan Estate — chaîne de porte de sortie vide, Dead by Daylight',scenePattern:/macmillan.*(?:exit.*gate|porte.*sortie|cha[iî]ne)/i,mechanism:'macmillan-exitgate-chain-and-rack',color:'#b4b0a0',periodSeconds:83,sceneEvidence:'Exit gates are powered by repaired generators in the source game. Only an empty rack, chain and shutter move decoratively; no gates are powered or opened for gameplay and no endgame clock begins.',sourceReference:'https://deadbydaylight.wiki.gg/wiki/Exit_Gates'}
  ]),
  ...pack('Crysis','Crysis (2007 original PC), Awakening mine and Reckoning carrier','https://portforward.com/games/walkthroughs/Crysis/Awakening.htm','opened-location-text-indexed-function','Original PC empty hardware, no remaster/console sequence, suit ability, alien or falling lift',/remastered|crysis.?[23]\b|console version|crash|destroyed/i,[
    {id:'crysis2007-awakening-mine-hoist',sourceScene:'Awakening mine — ascenseur de mine en essai stable, Crysis PC 2007',scenePattern:/awakening.*(?:mine|lift|ascenseur|hoist)/i,mechanism:'awakening-mine-stable-rope-elevator',color:'#a9b69f',periodSeconds:79,sceneEvidence:'The guide identifies the mine exit lift before its later drop. The stable restored empty mechanism has opposed rope runs and a counterweight; the scripted fall, hostage and rescue are excluded.'},
    {id:'crysis2007-reckoning-hangar-platform',sourceScene:'Reckoning carrier — plateforme vide du hangar, Crysis PC 2007',scenePattern:/reckoning.*(?:hangar|platform|plateforme|carrier)/i,mechanism:'reckoning-carrier-two-column-service-platform',color:'#a9b9c2',periodSeconds:101,sceneEvidence:'The carrier chapter supplies the hangar setting. A bounded empty two-column service platform is an authored carrier-maintenance interpretation; no VTOL body, nuke, alien or usable platform is represented.',sourceReference:'https://portforward.com/games/walkthroughs/Crysis/Reckoning.htm',sourceAccess:'indexed-location-reference'}
  ]),
  ...pack('F.E.A.R.','F.E.A.R. (2005 original PC), industrial waterworks and freight access','https://www.gamespot.com/articles/fear-walkthrough/1100-6136085/','indexed-specific-walkthrough-passages','Original industrial hardware in a no-load maintenance state; no hallucination, flooding or combat entity',/extraction point|perseus mandate|project origin|fear.?[23]\b|destroyed/i,[
    {id:'fear2005-badwater-handwheel',sourceScene:'Bad Water — volant de la conduite du bassin, F.E.A.R. 2005',scenePattern:/bad water.*(?:wheel|volant|conduite|basin)/i,mechanism:'badwater-wheel-rising-valve-stem',color:'#a3b7ad',periodSeconds:67,sceneEvidence:'The indexed walkthrough turns a wheel to fill a bridge area. Only the handwheel and rising stem move here, without water level, floating boxes, route change or hazard.'},
    {id:'fear2005-freightlift-empty-cage',sourceScene:'Armacham freight elevator — cage vide remise sous tension, F.E.A.R. 2005',scenePattern:/(?:armacham.*freight|freight elevator).*(?:cage|empty|vide|2005)/i,mechanism:'armacham-empty-cage-and-overhead-sheave',color:'#b4ac9c',periodSeconds:89,sceneEvidence:'The indexed guide explicitly powers a freight elevator. An empty mesh cage and top sheave interpret restored function; exact interval placement, machinery internals and cycle are adapted, not a new power puzzle.'}
  ]),
  ...pack('Remember Me','Remember Me (2013), episodes 3 and 5','https://gamefaqs.gamespot.com/pc/680024-remember-me-2013/faqs/67168/episode-3','indexed-walkthrough-excerpt-open-failed','2013 Neo-Paris prop functions, no memory remix, flood, Spammer action or changed objective',/remix|flooded|destroyed|broken/i,[
    {id:'remember2013-ep3-turbine',sourceScene:'Episode 3 Bastille approach — turbine du conduit, Remember Me 2013',scenePattern:/(?:episode.?3|bastille approach).*(?:turbine|conduit|fan)/i,mechanism:'bastille-approach-nine-blade-turbine',color:'#a5b9be',periodSeconds:53,sceneEvidence:'The indexed episode-3 guide turns off a turbine before crossing its fan. A remote unoccupied turbine rotates behind a fixed grille; no stopping interaction, traversal window or collision is added.'},
    {id:'remember2013-ep5-force-lift',sourceScene:'Episode 5 Saint-Michel — ascenseur de service vide, Remember Me 2013',scenePattern:/(?:episode.?5|saint.michel).*(?:lift|elevator|ascenseur)/i,mechanism:'saintmichel-four-guide-empty-service-lift',color:'#bbb09b',periodSeconds:83,sceneEvidence:'The indexed episode-5 checkpoint raises an elevator with the Force Spammer. A four-guide empty service deck moves independently as scenery; the power, Nilin’s action, memory and dam flooding are absent.',sourceReference:'https://gamefaqs.gamespot.com/pc/680024-remember-me-2013/faqs/67168/episode-5'}
  ]),
  ...pack('The Binding of Isaac: Rebirth','The Binding of Isaac: Rebirth (2014 base game), Shop and Arcade','https://bindingofisaacrebirth.wiki.gg/wiki/Machines','indexed-official-wiki-excerpt-open-failed','Rebirth machines only, no Blood Donation Machine, Greed machine, Repentance restock or gambling interaction',/blood donation|greed|repentance|afterbirth|explosion|destroyed/i,[
    {id:'isaac2014-shop-donation-counter',sourceScene:'Rebirth Shop — compteur de Donation Machine sans pièces, 2014',scenePattern:/(?:rebirth.*shop|shop.*donation).*(?:counter|compteur|machine|2014)/i,mechanism:'rebirth-donation-three-plain-counter-drums',color:'#b5b29a',periodSeconds:97,sceneEvidence:'The wiki excerpt increases the Donation Machine’s displayed coin total when donated to. Three plain display drums interpret a mechanical counter in idle service; no readable amount, coin, donation or unlock occurs.',sourceReference:'https://bindingofisaacrebirth.wiki.gg/wiki/Donation_Machine'},
    {id:'isaac2014-arcade-slot-reels',sourceScene:'Rebirth Arcade — trois rouleaux de Slot Machine sans pari, 2014',scenePattern:/(?:rebirth.*arcade|arcade.*slot).*(?:reel|rouleau|machine|2014)/i,mechanism:'rebirth-slot-three-offset-empty-reels',color:'#bdab8e',periodSeconds:71,sceneEvidence:'The wiki identifies the ordinary Slot Machine. Three abstract blank reels run an empty maintenance cycle; no coin, symbol sequence, payout, probability, destruction or gameplay gambling is implemented.'}
  ]),
  ...pack('Stranger Things','Stranger Things season 3 (2019), Starcourt Soviet base','https://www.netflix.com/tudum/articles/stranger-things-season-3-recap','opened-official-season-summary','Season 3 Starcourt machinery only, with no portal, Season 1 laboratory or creature',/season.?[1245]|1983|vecna|demogorgon|destroyed/i,[
    {id:'st32019-starcourt-freight-box',sourceScene:'Starcourt loading dock — boîte d’ascenseur vide, Stranger Things saison 3',scenePattern:/starcourt.*(?:loading dock|freight|ascenseur|chargement)/i,mechanism:'starcourt-loading-box-two-stage-guide',color:'#b3b29d',periodSeconds:101,sceneEvidence:'Netflix’s recap explicitly identifies the shipping room as an elevator descending under Starcourt. An empty freight box and cable guide move without visitors, Russian workers or underground transport.'},
    {id:'st32019-russian-key-drive',sourceScene:'Starcourt Russian Key — rotors mécaniques désactivés, saison 3',scenePattern:/starcourt.*(?:russian key|rotor|cl[eé].*russe)/i,mechanism:'starcourt-key-empty-counterrotating-collars',color:'#a1b6bd',periodSeconds:73,sceneEvidence:'The official recap identifies the Soviet machine opening the gate. Three empty mechanical collars counter-rotate on a service bench, with no energy ray, gate, portal or dimensional effect; their exposed construction is authored.'}
  ]),
  ...pack('Prometheus','Prometheus (2012), MedPod and loading bay','https://www.avpcentral.com/prometheus','opened-production-location-reference','2012 film props, empty unpowered maintenance only, no surgery, patient or collision',/covenant|alien.?romulus|occupied|surgery in progress|destroyed/i,[
    {id:'prom2012-medpod-empty-cover',sourceScene:'Prometheus MedPod — capot vide sans instruments chirurgicaux, 2012',scenePattern:/prometheus.*medpod.*(?:cover|capot|vide|2012)/i,mechanism:'prometheus-empty-medpod-two-shell-cover',color:'#bdc5c0',periodSeconds:89,sceneEvidence:'The production account identifies the MedLab and MedPod. Two rigid cover shells open above an empty slab; no surgical arm, patient, embryo, procedure, injury or medical gameplay is shown.'},
    {id:'prom2012-loading-ramp-jacks',sourceScene:'Prometheus loading bay — rampe sans véhicule, film 2012',scenePattern:/prometheus.*(?:loading bay|soute).*(?:ramp|rampe|2012)/i,mechanism:'prometheus-ramp-two-fixed-length-supports',color:'#aab6b9',periodSeconds:79,sceneEvidence:'The opened production account explicitly mentions the cargo-bay ramp used by a vehicle. A rigid empty ramp pivots with two pinned support bars; vehicle, weather, crash and atmosphere remain absent.'}
  ]),
  ...pack('Alien Resurrection','Alien: Resurrection (1997); 1996 screenplay draft as hardware reference','https://assets.scriptslug.com/live/pdf/scripts/alien-resurrection-1997.pdf?v=1729114856','opened-draft-hardware-reference','Auriga/Betty hardware only, empty safe no-load cycles; draft layout is not certified final-film footage',/romulus|covenant|prometheus|occupied|destroyed/i,[
    {id:'alien41997-auriga-docking-clamps',sourceScene:'Auriga docking bay — pinces de retenue à vide, Alien Resurrection 1997',scenePattern:/auriga.*(?:clamp|pince|retenue|docking)/i,mechanism:'auriga-four-articulated-holding-clamps',color:'#a7b0aa',periodSeconds:83,sceneEvidence:'The film dialogue opens Auriga’s airlocks and releases holding clamps. Four fixed-root empty clamps fold around a stationary rim; the number, linkage and no-load repeat are authored.'},
    {id:'alien41997-betty-plain-hatch',sourceScene:'Betty — trappe de soute vide, Alien Resurrection 1997',scenePattern:/betty.*(?:hatch|trappe|soute|1997)/i,mechanism:'betty-offset-cargo-hatch-and-slide',color:'#b8ae97',periodSeconds:97,sceneEvidence:'The draft explicitly operates the Betty hatch during departure. A plain offset hatch slides above an empty cargo sill, without passengers, creature, vacuum, ejection or ship movement.'}
  ]),
  ...pack('Alien: Covenant','Alien: Covenant (2017), cargo crane and terraforming bay','https://www.springfieldspringfield.co.uk/movie_script.php?movie=alien-covenant','opened-selected-film-dialogue','2017 film empty hardware, no novelization-only anatomy, ejection or damage',/novelization only|romulus|resurrection|occupied|destroyed/i,[
    {id:'covenant2017-cargo-crane-empty-jaws',sourceScene:'Covenant cargo crane — mâchoires de chargement sans contenu, 2017',scenePattern:/covenant.*(?:cargo crane|grue).*(?:jaw|charge|vide|empty|2017)/i,mechanism:'covenant-empty-loader-two-jaw-linkage',color:'#b3b19d',periodSeconds:71,sceneEvidence:'The opened film transcript explicitly releases the crane. Only two opposed mechanical loader jaws articulate on rigid links; no organic jaw, load, alien, crushing or movement of a person is represented.'},
    {id:'covenant2017-terraform-bay-shutters',sourceScene:'Covenant terraforming bay — panneaux extérieurs fermés en essai, 2017',scenePattern:/covenant.*terraform.*(?:bay|panneau|shutter|2017)/i,mechanism:'covenant-terraform-four-guided-bay-panels',color:'#a7b9bb',periodSeconds:89,sceneEvidence:'The opened dialogue orders the terraforming-bay doors open. Four guided empty panels demonstrate the access function, with no outer space, atmosphere loss, vehicle release, alien or pressure effect.'}
  ]),
  ...pack('Alien: Romulus','Alien: Romulus (2024 released film dialogue), Renaissance station','https://www.springfieldspringfield.co.uk/movie_script.php?movie=alien-romulus','opened-released-film-dialogue','Released 2024 station, not Alien: Renaissance early-draft events; no gravity, cold or crash mechanic',/early draft|renaissance draft|covenant|resurrection|destroyed/i,[
    {id:'romulus2024-freight-elevator-sheaves',sourceScene:'Renaissance Romulus freight elevator — poulies en essai stable, film 2024',scenePattern:/romulus.*freight elevator.*(?:sheave|poulie|2024)/i,mechanism:'romulus-freight-three-sheave-rope-loop',color:'#a7b7af',periodSeconds:83,sceneEvidence:'The released-film dialogue identifies the freight elevator and notes that it does not work without gravity. Three empty sheaves and a short guided counterweight test hardware with steady gravity, never a gravity purge.'},
    {id:'romulus2024-cryo-chamber-empty-lock',sourceScene:'Renaissance cryo chamber — verrou du compartiment vide, Alien Romulus 2024',scenePattern:/(?:renaissance|romulus).*cryo.*(?:lock|verrou|chamber|compartiment)/i,mechanism:'renaissance-cryo-door-linked-bolt-cam',color:'#a9bec3',periodSeconds:101,sceneEvidence:'The station’s cryogenic chamber supplies the location and sealed access function. A plain cam moves four empty door bolts, without facehuggers, cryogenic fluids, temperature puzzle or living contents.'}
  ]),
  ...pack('Predator 2','Predator 2 (1990); shooting draft for Los Angeles hardware','https://assets.scriptslug.com/live/pdf/scripts/predator-2-1990.pdf','opened-draft-location-reference','Los Angeles subway and industrial slaughterhouse, empty service study; no chase, people or meat',/predators.?2010|the predator.?2018|prey.?2022|occupied|destroyed/i,[
    {id:'pred21990-subway-door-pockets',sourceScene:'Los Angeles subway — portes vides du wagon, Predator 2 1990',scenePattern:/(?:los angeles.*subway|predator.?2.*subway).*(?:door|porte|wagon|1990)/i,mechanism:'la-subway-three-pocket-door-slide',color:'#adb8bd',periodSeconds:73,sceneEvidence:'The film/draft subway sequence establishes the carriage. Three empty door pockets slide on a shared guide as an authored transit-hardware study; no passenger, victim or attack is drawn.'},
    {id:'pred21990-slaughterhouse-empty-chain',sourceScene:'Slaughterhouse Los Angeles — convoyeur de crochets vides, Predator 2 1990',scenePattern:/slaughterhouse.*(?:chain|cha[iî]ne|convoyeur|hook|1990)/i,mechanism:'slaughterhouse-empty-overhead-chain-hooks',color:'#b6ac9d',periodSeconds:89,sceneEvidence:'The draft establishes the industrial slaughterhouse. An empty overhead chain with blunt U-shaped hangers interprets its transport equipment; no meat, sharp contact, body, vapor or hazard is shown.'}
  ]),
  ...pack('Predators','Predators (2010), abandoned alien drill','https://avp.fandom.com/wiki/Abandoned_Alien_Drill','indexed-equipment-excerpt-open-failed','Abandoned drill restored only as an empty mechanical study; no claim that the derelict prop runs in the film',/predator.?2|badlands|occupied|fire|explosion|destroyed/i,[
    {id:'pred2010-derelict-drill-drive',sourceScene:'Abandoned Alien Drill — arbre de forage sans charge, Predators 2010',scenePattern:/abandoned.*drill.*(?:drive|arbre|forage|2010)/i,mechanism:'abandoned-drill-empty-helical-spindle',color:'#b8aa90',periodSeconds:79,sceneEvidence:'The indexed equipment reference identifies Noland’s abandoned alien drill. A helical spindle turns without rock or excavation as an explicit restored cutaway; its operating state and exact machine shape are not source-verified.'},
    {id:'pred2010-noland-drill-hatch',sourceScene:'Noland drill shelter — trappe vide du refuge, Predators 2010',scenePattern:/noland.*(?:drill|shelter|refuge).*(?:hatch|trappe|2010)/i,mechanism:'noland-drill-hatch-six-leaf-inner-latch',color:'#aaa99b',periodSeconds:101,sceneEvidence:'The indexed reference describes passages and exits through the derelict drill. An empty access hatch with six linked inner latches interprets that function; exact latch count is authored and no fire, confinement or escape occurs.'}
  ]),
  ...pack('Alien vs Predator','AVP: Alien vs. Predator (2004 film), Bouvetøya whaling station and pyramid','https://www.springfieldspringfield.co.uk/movie_script.php?movie=avp-alien-vs-predator','opened-selected-film-dialogue','2004 pyramid changes isolated to empty background blocks; not Requiem or Queen machinery',/requiem|2007|queen|reine|destroyed/i,[
    {id:'avp2004-pyramid-shifting-grid',sourceScene:'Bouvetøya pyramid — blocs de couloir en translation, AVP 2004',scenePattern:/bouvet.*pyramid.*(?:block|bloc|shift|translation|2004)/i,mechanism:'bouvet-pyramid-three-phase-stone-blocks',color:'#b5ac98',periodSeconds:101,sceneEvidence:'The opened film dialogue explicitly reports the pyramid shifting again. Three interlocking rigid blocks slide in distinct phases across a small empty cutaway; no playable wall, maze solution, trap or crushing surface changes.'},
    {id:'avp2004-whalingstation-cable-drum',sourceScene:'Bouvetøya whaling station — tambour du câble de descente vide, AVP 2004',scenePattern:/bouvet.*(?:whaling|baleinier).*(?:cable|c[aâ]ble|drum|tambour)/i,mechanism:'whalingstation-empty-cable-drum-and-sled',color:'#aaa797',periodSeconds:83,sceneEvidence:'The film/draft references the whaling-station tunnel descent. A cable drum and empty guided sled adapt the descent hardware; no explorer, ascent, falling equipment or passage is created.'}
  ]),
  ...pack('Prey (2006)','Prey (2006 original), Roadhouse and Sphere','https://www.gamespot.com/articles/prey-walkthrough/1100-6154055/','opened-guide-indexed-specific-function','2006 Human Head game, not Arkane 2017; no abduction, gravity change, music or portals',/arkane|talos|2017|destroyed/i,[
    {id:'prey2006-roadhouse-jukebox',sourceScene:'Roadhouse bar — mécanique de jukebox muet, Prey 2006',scenePattern:/roadhouse.*(?:jukebox|bar|2006)/i,mechanism:'roadhouse-empty-record-carousel-and-selector',color:'#c0af94',periodSeconds:97,sceneEvidence:'The original bar contains an interactive jukebox. An empty record carousel and selector carriage demonstrate a music-device mechanism, with no record content, sound, people or abduction.'},
    {id:'prey2006-sphere-switch-dial',sourceScene:'Sphere All Fall Down — cadran du panneau de gravité sans champ, Prey 2006',scenePattern:/sphere.*(?:all fall down|gravity panel|panneau.*gravit)/i,mechanism:'sphere-gravity-panel-unpowered-rotary-dial',color:'#a9b9b3',periodSeconds:73,sceneEvidence:'The walkthrough explicitly operates gravity panels in the Sphere. A plain four-way mechanical selector turns on a fixed base without any gravity field, portal, actor inversion or route alteration.'}
  ]),
  ...pack("Assassin's Creed",'Assassin’s Creed II (2009), Monteriggioni and Venice tomb','https://assassinscreed.fandom.com/wiki/Sanctuary','indexed-location-excerpt-open-failed','Ezio-era ACII mechanisms, not Brotherhood modern Sanctuary or Odyssey; no seals awarded or armor revealed',/brotherhood|2012 modern|odyssey|valhalla|destroyed/i,[
    {id:'ac22009-sanctuary-six-locks',sourceScene:'Monteriggioni Sanctuary — six verrous de la grille sans statue, Assassin’s Creed II',scenePattern:/monteriggioni.*sanctuary.*(?:lock|verrou|grille)/i,mechanism:'auditore-sanctuary-six-radial-lock-rods',color:'#c0b28d',periodSeconds:101,sceneEvidence:'The Sanctuary reference explicitly requires six seals to unlock the gate. Six plain radial rods move together around an empty fixed hub; no statue, seal, armor, collectible or unlock is depicted.'},
    {id:'ac22009-san-marco-lever',sourceScene:'San Marco Assassin Tomb — levier et grille vide, Assassin’s Creed II Venise',scenePattern:/san marco.*(?:tomb|tombe).*(?:lever|levier|grille)/i,mechanism:'sanmarco-fourbar-lever-and-gate-rack',color:'#b6b1a0',periodSeconds:83,sceneEvidence:'The original tomb route uses levers and timed gates. A four-bar lever drives one empty rack in a distant cutaway; exact linkage and repeat are authored, without timed traversal, tomb contents or reward.',sourceReference:'https://www.bazicenter.com/features/ign_guides/assacreed2_ignpdf.pdf',sourceAccess:'indexed-guide-excerpt-open-too-large'}
  ]),
  ...pack('Warhammer 40,000: Space Marine','Warhammer 40,000: Space Marine (2011), Graia Invictus manufactorum','https://howcast.com/videos/504222-warhammer-40k-space-marine-walkthrough-part-39-waking-the-sleeping-giant/','opened-selected-gameplay-transcript','2011 Graia service hardware, not Space Marine 2 or a Titan body/weapon discharge',/space marine.?2\b|2024|occupied|firing|destroyed/i,[
    {id:'sm2011-graia-mooring-clamps',sourceScene:'Graia manufactorum — pinces de mouillage vides d’Invictus, Space Marine 2011',scenePattern:/graia.*(?:mooring|mouillage|clamp|pince)/i,mechanism:'graia-two-fixed-base-mooring-clamps',color:'#b7af94',periodSeconds:89,sceneEvidence:'The opened transcript names the elevator to the mooring-clamp controls. Two empty fixed-base clamps unfold on rigid arms; the Titan, marines, boarding and powering up remain absent.'},
    {id:'sm2011-volcano-maintenance-apse',sourceScene:'Graia Volcano Cannon — trappe de l’apse de maintenance vide, Space Marine 2011',scenePattern:/graia.*volcano.*(?:maintenance|apse|trappe)/i,mechanism:'volcano-empty-maintenance-apse-fanout',color:'#a7b3ad',periodSeconds:73,sceneEvidence:'The opened transcript explicitly opens a maintenance apse for the Volcano Cannon. Three empty hinged inspection covers fan out from a fixed service frame, with no cannon shot, heat, blast or Titan anatomy.'}
  ]),
  ...pack('Tail Concerto','Tail Concerto (1998 PlayStation), Resaca and Felsen','https://gamefaqs.gamespot.com/ps/198882-tail-concerto/faqs/17187','indexed-original-walkthrough-excerpt-open-failed','Original 1998 empty town equipment, no robot or animal body and no Solatorobo machinery',/solatorobo|fuga|occupied|broken airship|destroyed/i,[
    {id:'tail1998-resaca-steam-lift',sourceScene:'Resaca central plaza — ascenseur à vapeur vide, Tail Concerto 1998',scenePattern:/resaca.*(?:steam lift|ascenseur|plaza|place)/i,mechanism:'resaca-steam-lift-cylinder-and-deck',color:'#b5b19c',periodSeconds:83,sceneEvidence:'The walkthrough route supplies coal to restore the town steam elevator. An empty cylinder and small guided deck interpret that function; coal, steam, passengers, restoration and usable lift access are absent.'},
    {id:'tail1998-felsen-mine-cart',sourceScene:'Felsen mines — chariot vide du tunnel, Tail Concerto 1998',scenePattern:/felsen.*(?:mine|cart|chariot|tunnel)/i,mechanism:'felsen-empty-short-wheelbase-mine-cart',color:'#baa68f',periodSeconds:71,sceneEvidence:'The original guide identifies the Felsen mining route. A small empty mine cart with linked wheels is an authored mining-function study; its precise prop model and path are unverified, with no mineral, rider or collision.'}
  ]),
  ...pack('Natural Selection 2','Natural Selection 2 (2012), ns2_tram and ns2_refinery','https://naturalselection.fandom.com/wiki/Maps/Ns2_tram','indexed-map-excerpt-open-failed','Human industrial map/structure functions only; no alien anatomy, resources, power or commander action',/natural selection.?1\b|alien harvester|gorge|destroyed/i,[
    {id:'ns22012-tram-elevator-transfer',sourceScene:'ns2_tram Elevator Transfer — transfert mécanique vide, Natural Selection 2',scenePattern:/ns2.?tram.*elevator transfer/i,mechanism:'tram-elevator-transfer-twin-rail-cage',color:'#a8babf',periodSeconds:97,sceneEvidence:'The map reference explicitly names Elevator Transfer on the industrial Tram map. Two empty guided transfer decks interpret that location’s name; exact moving prop geometry is authored, not a claimed mapper animation.'},
    {id:'ns22012-refinery-empty-extractor',sourceScene:'ns2_refinery — pompe d’Extractor sans ressource, Natural Selection 2',scenePattern:/ns2.?refinery.*(?:extractor|pompe|resource)/i,mechanism:'refinery-extractor-three-cylinder-pump',color:'#b5b29a',periodSeconds:67,sceneEvidence:'The game’s terminology distinguishes the Marine Extractor resource tower from the Alien Harvester. Three cold empty pump cylinders interpret its function in Refinery, without a node, resource income, power or construction.',sourceReference:'https://steamcommunity.com/sharedfiles/filedetails/?id=122652051',sourceAccess:'indexed-game-terminology-excerpt'}
  ]),
  ...pack('Nemesis — Awaken Realms','Nemesis (Awaken Realms, 2018 board game), original ship rooms','https://awakenrealms.com/images/download/Nemesis/ENG/RULEBOOK_280x280mm_bleed3mm_28pages_PRINT.pdf','indexed-official-rulebook-excerpt-open-too-large','Original Nemesis board-game room functions, never source animation; not Lockdown or Retaliation',/lockdown|retaliation|occupied|destroyed/i,[
    {id:'nemesis2018-engine-room-collar',sourceScene:'Nemesis Engine Room 1 — collier de moteur vide, jeu de plateau 2018',scenePattern:/nemesis.*engine room.?1.*(?:collar|collier|2018)/i,mechanism:'nemesis-engine-one-three-bearing-collar',color:'#aab2a2',periodSeconds:79,sceneEvidence:'The official rulebook identifies Engine Rooms and their checked status. A three-bearing empty engine collar is an explicit functional board-room adaptation; no official animated engine or change of engine status is claimed.'},
    {id:'nemesis2018-hibernatorium-pods',sourceScene:'Nemesis Hibernatorium — capots de couchettes vides, jeu de plateau 2018',scenePattern:/nemesis.*hibernatorium.*(?:pod|capot|couchette|2018)/i,mechanism:'nemesis-three-empty-hibernation-lids',color:'#a8bdc2',periodSeconds:101,sceneEvidence:'The official rulebook identifies the Hibernatorium as the ship room for hibernation. Three empty rigid lids lift above plain slabs; no miniature, sleep state, evacuation, survival check or room action is implemented.'}
  ]),
  ...pack('Phantasmagoria','Phantasmagoria (1995), Carnovasch estate garden and pantry','https://sierrahelp.com/Walkthroughs/Phantasmagoria1Walkthrough.html','opened-selected-walkthrough-passages','Original 1995 props, without spirits, people, graphic scenes or an operating trap',/puzzle of flesh|phantasmagoria.?2\b|occupied|destroyed/i,[
    {id:'phanta1995-estate-garden-fountain',sourceScene:'Carnovasch estate garden — fontaine à eau claire sans figure, Phantasmagoria 1995',scenePattern:/carnovasch.*(?:estate garden|jardin).*(?:fountain|fontaine|1995)/i,mechanism:'carnovasch-plain-fountain-two-bounded-jets',color:'#a9bfc1',periodSeconds:73,sceneEvidence:'The walkthrough examines the estate garden fountain separately from the upstairs conservatory. Two bounded plain water jets arc back into an empty basin, without sculpted anatomy, blood, vision or narrative trigger.'},
    {id:'phanta1995-pantry-cellar-hatch',sourceScene:'Carnovasch pantry — trappe vide vers la cave, Phantasmagoria 1995',scenePattern:/carnovasch.*pantry.*(?:trapdoor|trappe|cave|1995)/i,mechanism:'carnovasch-pantry-fixed-edge-plain-hatch',color:'#b5a58f',periodSeconds:97,sceneEvidence:'The opened guide moves the pantry rug and opens a trapdoor with a poker. Only the empty rigid lid and its fixed hinge are interpreted; no hand, tool action, person, secret-passage unlock or puzzle solution is played.'}
  ]),
  ...pack('The Ball','The Ball (2010 retail), Oztoc II and Teotl II','https://mysterymanor.net/walkthroughs/TheBall/Level_3_Oztoc_2/the_ball_oztoc_2.htm','opened-selected-retail-walkthrough','Retail 2010 puzzle hardware, not the earlier Unreal Tournament mod; no Ball body, puzzle solution or moving playable floor',/unreal tournament mod|2008 mod|destroyed/i,[
    {id:'ball2010-oztoc-rotating-axis',sourceScene:'Oztoc II — axe du sol et mur en rotation vide, The Ball 2010',scenePattern:/oztoc.*(?:rotating axis|axe|rotation|2010)/i,mechanism:'oztoc-right-angle-wall-floor-axis',color:'#b6b096',periodSeconds:89,sceneEvidence:'The opened retail walkthrough names a rotating axis which rotates the floor and wall. One rigid right-angle cutaway turns around a fixed axle, without modifying the actual arena or its collision floor.'},
    {id:'ball2010-teotl-empty-elevator',sourceScene:'Teotl II — ascenseur et gouttière sans Ball, The Ball 2010',scenePattern:/teotl.*(?:elevator|ascenseur|gutter|goutti[eè]re)/i,mechanism:'teotl-empty-elevator-and-fixed-gutter',color:'#abae9c',periodSeconds:83,sceneEvidence:'The retail Teotl-II guide identifies the timed elevator and Ball gutter. A narrow empty deck lifts beside a fixed gutter, with no ball, timed challenge, button interaction or level completion.',sourceReference:'https://mysterymanor.net/walkthroughs/TheBall/Level_5_Teotl_2/the_ball_teotl_2.htm',sourceAccess:'indexed-retail-walkthrough-excerpt'}
  ]),
  ...pack('Turok','Turok 2: Seeds of Evil (1998 N64), Primagen’s Lightship','https://www.supercheats.com/nintendo64/walkthroughs/turok2seedsofevil-walkthrough01.txt','opened-original-guide-indexed-specific-function','1998 N64 Lightship hardware only, no 2017 remaster assertion, creature or ion charge',/dinosaur hunter|turok.?3\b|2008|2017 remaster|destroyed/i,[
    {id:'turok21998-lightship-bridge',sourceScene:'Primagen Lightship — pont d’accès au Ion Capacitor sans charge, Turok 2 N64',scenePattern:/primagen.*lightship.*(?:bridge|pont|capacitor)/i,mechanism:'primagen-two-leaf-capacitor-access-bridge',color:'#a6bab1',periodSeconds:97,sceneEvidence:'The indexed original route operates a switch to activate the bridge toward the Ion Capacitor. Two empty rigid leaves rotate from their hinges, with no switch, capacitor, route opening or enemy.'},
    {id:'turok21998-lightship-ventilation-fan',sourceScene:'Primagen Lightship ventilation shaft — ventilateur sans flux, Turok 2 N64 1998',scenePattern:/primagen.*lightship.*(?:ventilation|fan|ventilateur|1998)/i,mechanism:'primagen-fixed-duct-seven-blade-fan',color:'#b4ad96',periodSeconds:67,sceneEvidence:'The opened original Lightship route explicitly uses fans and a ventilation shaft. Seven rigid blades turn inside a fixed remote duct; blade count is authored, and no air push, lift, platform timing, ion charge or collision occurs.'}
  ]),
  ...pack('Hotline Miami','Hotline Miami (2012), Clean Hit and Vengeance','https://hotlinemiami.fandom.com/wiki/Clean_Hit','indexed-location-excerpt-open-failed','Original 2012 overhead locations, no Wrong Number chapter or violent reenactment',/wrong number|hotline miami.?2\b|occupied|destroyed/i,[
    {id:'hm2012-cleanhit-empty-elevator',sourceScene:'Clean Hit hotel — portes d’ascenseur vides, Hotline Miami 2012',scenePattern:/clean hit.*(?:hotel|elevator|ascenseur|2012)/i,mechanism:'cleanhit-hotel-four-fold-lift-leaves',color:'#bcabbc',periodSeconds:79,sceneEvidence:'The indexed Clean Hit route exits an elevator onto the hotel second floor. Four folding empty leaves move in their frame, without a masked person, weapon, victim or doorway collision.'},
    {id:'hm2012-vengeance-office-door',sourceScene:'Vengeance mansion — porte mécanique vide du hall, Hotline Miami 2012',scenePattern:/vengeance.*(?:mansion|hall|porte|door)/i,mechanism:'vengeance-empty-double-door-closers',color:'#b9af9c',periodSeconds:101,sceneEvidence:'The original Vengeance location provides the mansion hall and doors. Two empty door leaves and their linked closers interpret physical access; this is an authored maintenance movement, not an encounter or playable door.',sourceReference:'https://hotlinemiami.fandom.com/wiki/Vengeance'}
  ]),
  ...pack('Lilo & Stitch','Lilo & Stitch (2002 original animated film), Galactic Federation ships','https://www.springfieldspringfield.co.uk/movie_script.php?movie=lilo-and-stitch','opened-selected-film-dialogue','Original 2002 ship props, not the live-action remake or sequel; no creature, prison occupant or gunfire',/2025|live.action|stitch.?2\b|leroy|occupied|destroyed/i,[
    {id:'lilo2002-prison-cell-lock',sourceScene:'Galactic Federation cell bay — verrou mécanique vide, Lilo & Stitch 2002',scenePattern:/galactic federation.*cell bay.*(?:lock|verrou|2002)/i,mechanism:'federation-empty-cell-six-radial-locks',color:'#a9b8c3',periodSeconds:83,sceneEvidence:'The opened film dialogue secures the cell and reports gunfire in the cell bay. Only six empty radial lock bars are interpreted, without a captive, weapon, force field, alarm or prison gameplay.'},
    {id:'lilo2002-ship-door-seven',sourceScene:'Galactic Federation Door Seven — rails de sas vides, Lilo & Stitch 2002',scenePattern:/galactic federation.*(?:door seven|door.?7|porte sept)/i,mechanism:'federation-door-seven-three-nested-tracks',color:'#b4adc0',periodSeconds:97,sceneEvidence:'The dialogue explicitly sends security to Door Seven aboard the ship. Three nested empty curved rails and a plain shutter interpret that access point; exact geometry is authored, with no security response or passage.'}
  ]),
  ...pack('Spy Kids','Spy Kids (2001 original film), Safe House and miniature submarine','https://www.springfieldspringfield.co.uk/movie_script.php?movie=spy-kids','opened-selected-film-dialogue','Original 2001 gadgets and empty transport, not sequel or Armageddon; no child/robot body, food grant or weapon',/island.*lost dreams|game over|armageddon|2023|occupied|destroyed/i,[
    {id:'spy2001-safehouse-pantry',sourceScene:'Spy Kids Safe House — étagères de garde-manger vides, film 2001',scenePattern:/spy kids.*safe house.*(?:pantry|garde.manger|[eé]tag[eè]re)/i,mechanism:'safehouse-three-plain-retracting-pantry-trays',color:'#b9bdad',periodSeconds:89,sceneEvidence:'The indexed Safe House reference describes a pantry becoming stocked. Three empty retracting trays interpret the hidden storage function, with no food, brand, magical materialization or inventory reward.',sourceReference:'https://spykids.fandom.com/wiki/Safe_House',sourceAccess:'indexed-location-function-excerpt'},
    {id:'spy2001-submarine-hatch-wheel',sourceReference:'https://en.wikipedia.org/wiki/Spy_Kids_%28film%29',sourceAccess:'opened-selected-film-summary',sourceScene:'Spy Kids miniature submarine — roue de trappe vide, film 2001',scenePattern:/spy kids.*miniature submarine.*(?:hatch|trappe|wheel|roue)/i,mechanism:'cortez-miniature-submarine-hatch-and-dog-links',color:'#a8b8c5',periodSeconds:73,sceneEvidence:'The original film uses a miniature submarine to reach the Safe House. A plain small hatch wheel links to four locking dogs on an empty casing; the particular cutaway is authored, without passengers or underwater travel.'}
  ])
]);

export const WAVE_10_MODE_REFERENCE_SCENES = Object.freeze(Object.fromEntries(
  STAGE_ANIMATION_WAVE_10.filter((_,i)=>i%2===0).map((p,i)=>[p.universes[0],Object.freeze({Combat:p.sourceScene,RPG:p.sourceScene,Melee:STAGE_ANIMATION_WAVE_10[i*2+1].sourceScene,Tactics:STAGE_ANIMATION_WAVE_10[i*2+1].sourceScene})])
));

const TAU = Math.PI * 2;
const polar = (p,r,a) => [p[0]+r*Math.cos(a),p[1]+r*Math.sin(a)];
const line = (ctx,points) => {ctx.beginPath();ctx.moveTo(...points[0]);for(const p of points.slice(1))ctx.lineTo(...p);ctx.stroke();};
const box = (ctx,x,y,w,h) => ctx.strokeRect(x,y,w,h);
const ellipse = (ctx,x,y,rx,ry=rx) => {ctx.beginPath();ctx.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),0,0,TAU);ctx.stroke();};
const polygon = (ctx,points) => line(ctx,[...points,points[0]]);
function wheel(ctx,x,y,r,angle,spokes=6) {ellipse(ctx,x,y,r);ellipse(ctx,x,y,r*.13);for(let i=0;i<spokes;i++)line(ctx,[[x,y],polar([x,y],r*.94,angle+i*TAU/spokes)]);}
function gear(ctx,x,y,r,angle,teeth=16) {wheel(ctx,x,y,r,angle,5);for(let i=0;i<teeth;i++){const a=angle+i*TAU/teeth;line(ctx,[polar([x,y],r*.94,a),polar([x,y],r*1.08,a)]);}}
function hinge(ctx,root,length,angle,thickness) {const end=polar(root,length,angle),offset=[-Math.sin(angle)*thickness,Math.cos(angle)*thickness];polygon(ctx,[root,end,[end[0]+offset[0],end[1]+offset[1]],[root[0]+offset[0],root[1]+offset[1]]]);ellipse(ctx,...root,thickness*.32);return end;}
function collar(ctx,x,y,r,a,n=8) {ellipse(ctx,x,y,r,r*.6);ellipse(ctx,x,y,r*.72,r*.42);for(let i=0;i<n;i++){const q=a+i*TAU/n;line(ctx,[[x+r*.72*Math.cos(q),y+r*.42*Math.sin(q)],[x+r*Math.cos(q),y+r*.6*Math.sin(q)]]);}}
function rail(ctx,x,y,length,t,n=8) {box(ctx,x,y,length,length*.055);for(let i=0;i<n;i++){const cx=x+length*((t+i/n)%1);line(ctx,[[cx,y],[cx,y+length*.055]]);}}
function lift(ctx,x,y,u,t,{width=.2,travel=.15,guides=2}={}) {const q=(1-Math.cos(t*TAU))/2,cy=y+u*travel*q,other=y+u*travel*(1-q),left=x-u*width/2,right=x+u*width/2;for(let i=0;i<guides;i++){const gx=left-u*.02+i*(right-left+u*.04)/(guides-1);line(ctx,[[gx,y-u*.08],[gx,y+u*(travel+.08)]]);}line(ctx,[[x,cy],[x,y-u*.08],[right+u*.06,y-u*.08],[right+u*.06,other]]);wheel(ctx,(x+right+u*.06)/2,y-u*.08,u*.025,q*3,5);box(ctx,left,cy,u*width,u*.06);box(ctx,right+u*.04,other,u*.04,u*.045);return {car:[x,cy],counter:[right+u*.06,other],sum:2*y+u*travel};}
function boltCam(ctx,x,y,u,t,n=6,r=.09) {const a=t*TAU,q=(1-Math.cos(a))/2;ellipse(ctx,x,y,u*r);wheel(ctx,x,y,u*r*.45,a,3);for(let i=0;i<n;i++){const b=i*TAU/n,p=polar([x,y],u*(r*.7+.035*q),b),end=polar(p,u*.09,b);line(ctx,[[x,y],p,end]);ellipse(ctx,...p,u*.006);}}

// Coordinates returned here are consumed by the renderer, so physical tests
// constrain the actual visible links instead of a second unused simulation.
export function getStageAnimationWave10Geometry(mechanism,t,w,h) {
  const u=Math.min(w,h),x=w*.53,y=h*.32,a=t*TAU;
  if(mechanism==='lavanderia-rigid-machine-tilt-link'||mechanism==='rosslyn-floor-hatch-fixed-hinge') {
    const root=[x-u*.15,y+u*.08],length=u*.28,angle=mechanism.startsWith('lavanderia')?-.45-.35*Math.sin(a):-.15-.8*(1-Math.cos(a))/2;
    return {type:'rigid-hinge',root,end:polar(root,length,angle),length,angle};
  }
  if(mechanism==='munitionsplant-empty-scissor-service-gate') {
    const length=u*.08,angle=.22+.75*(1-Math.cos(a))/2,step=length*Math.cos(angle),dy=length*Math.sin(angle),root=[x-u*.26,y];
    const points=Array.from({length:9},(_,i)=>[root[0]+i*step,root[1]+(i%2?dy:0)]);
    return {type:'scissor',points,length};
  }
  if(mechanism==='coaltower-four-piston-generator-crankshaft'||mechanism==='refinery-extractor-three-cylinder-pump') {
    const count=mechanism.startsWith('coaltower')?4:3,radius=u*.027,length=u*.105;
    const rods=Array.from({length:count},(_,i)=>{const root=[x+u*(-.16+i*.1),y+u*.07],crank=polar(root,radius,a+i*TAU/count),dy=crank[1]-root[1],slider=[crank[0]+Math.sqrt(length*length-dy*dy),root[1]];return {root,crank,slider,radius,length};});
    return {type:'crank-slider',rods};
  }
  if(mechanism==='covenant-empty-loader-two-jaw-linkage'||mechanism==='graia-two-fixed-base-mooring-clamps'||mechanism==='auriga-four-articulated-holding-clamps') {
    const count=mechanism.startsWith('auriga')?4:2,armlengths=[u*.085,u*.065];
    const arms=Array.from({length:count},(_,i)=>{const side=i%2?-1:1,root=[x+side*u*.18,y+u*(i>1?.1:-.06)],angle=side>0?Math.PI-.55-.25*Math.sin(a):.55+.25*Math.sin(a),elbow=polar(root,armlengths[0],angle),tip=polar(elbow,armlengths[1],angle+(side>0?-.6:.6));return {root,elbow,tip,lengths:armlengths};});
    return {type:'rigid-arms',arms};
  }
  if(mechanism==='primagen-two-leaf-capacitor-access-bridge') {
    const length=u*.17,angle=.1+.6*(1-Math.cos(a))/2;
    return {type:'bridge',leaves:[{root:[x-u*.18,y],end:polar([x-u*.18,y],length,-angle),length},{root:[x+u*.18,y],end:polar([x+u*.18,y],length,Math.PI+angle),length}]};
  }
  if(mechanism==='longterm-elbow-tube-empty-marker-transport') {
    const center=[x,y],radius=u*.085,angle=-Math.PI/2+t*Math.PI/2;
    return {type:'circular-marker',center,radius,marker:polar(center,radius,angle)};
  }
  if(mechanism==='starcourt-key-empty-counterrotating-collars') {
    const radii=[u*.06,u*.09,u*.12];return {type:'counterrotation',center:[x,y],radii,ends:radii.map((r,i)=>polar([x,y],r,(i%2?-a:a)+i*.6))};
  }
  return null;
}

export function drawStageAnimationWave10(ctx,animation,frame,w,h) {
  const t=frame.progress,a=t*TAU,s=Math.sin(a),c=Math.cos(a),u=Math.min(w,h),x=w*.53,y=h*.32;
  ctx.globalAlpha=.16;
  switch(animation.mechanism) {
    case 'a1a-twin-cylindrical-brushes': {
      box(ctx,x-u*.25,y-u*.15,u*.5,u*.29);for(const side of [-1,1]){const bx=x+side*u*.13;ellipse(ctx,bx,y-u*.10,u*.045,u*.016);ellipse(ctx,bx,y+u*.10,u*.045,u*.016);for(let i=0;i<12;i++){const dx=u*.044*Math.cos(a*side+i*TAU/12);line(ctx,[[bx+dx,y-u*.10],[bx+dx,y+u*.10]]);}}line(ctx,[[x-u*.25,y+u*.15],[x+u*.25,y+u*.15]]);break;
    }
    case 'lavanderia-rigid-machine-tilt-link': {
      const g=getStageAnimationWave10Geometry(animation.mechanism,t,w,h),n=[-Math.sin(g.angle)*u*.14,Math.cos(g.angle)*u*.14];polygon(ctx,[g.root,g.end,[g.end[0]-n[0],g.end[1]-n[1]],[g.root[0]-n[0],g.root[1]-n[1]]]);line(ctx,[g.root,g.end]);ellipse(ctx,...g.root,u*.014);const mid=[(g.root[0]+g.end[0])/2-n[0]/2,(g.root[1]+g.end[1])/2-n[1]/2];wheel(ctx,...mid,u*.05,a*.1,7);line(ctx,[[x-u*.18,y+u*.11],[x+u*.2,y+u*.11]]);break;
    }
    case 'royalmint-four-nip-printing-cylinders': {
      for(let i=0;i<4;i++){const xx=x+u*(-.18+i*.12);gear(ctx,xx,y,u*.051,i%2?-a:a,16);ellipse(ctx,xx,y+u*.085,u*.042);line(ctx,[[xx,y+u*.05],[xx,y+u*.13]]);}line(ctx,[[x-u*.27,y+u*.052],[x+u*.27,y+u*.052]]);box(ctx,x-u*.27,y+u*.13,u*.54,u*.025);break;
    }
    case 'fictional-bank-eight-linked-locking-bolts': boltCam(ctx,x,y,u,t,8,.12);box(ctx,x-u*.24,y-u*.18,u*.48,u*.36);break;
    case 'cryptex-five-independent-plain-bands': {
      for(let i=0;i<5;i++){const bx=x+u*(-.15+i*.06);box(ctx,bx,y-u*.055,u*.052,u*.11);for(let j=0;j<8;j++){const q=a*(i%2?-1:1)+j*TAU/8;line(ctx,[[bx,y+u*.05*Math.sin(q)],[bx+u*.052,y+u*.05*Math.sin(q)]]);}}ellipse(ctx,x-u*.16,y,u*.018,u*.055);ellipse(ctx,x+u*.15,y,u*.018,u*.055);break;
    }
    case 'rosslyn-floor-hatch-fixed-hinge': {
      const g=getStageAnimationWave10Geometry(animation.mechanism,t,w,h);hinge(ctx,g.root,g.length,g.angle,u*.025);line(ctx,[[x-u*.2,y+u*.1],[x+u*.2,y+u*.1]]);for(let i=0;i<5;i++)line(ctx,[[x-u*.13+i*u*.05,y+u*(.12+i*.01)],[x-u*.08+i*u*.05,y+u*(.12+i*.01)]]);break;
    }
    case 'mccallister-plain-hinged-furnace-damper': {
      box(ctx,x-u*.11,y-u*.14,u*.22,u*.28);line(ctx,[[x-u*.05,y-u*.14],[x-u*.05,y-u*.21],[x+u*.10,y-u*.21]]);hinge(ctx,[x-u*.065,y+u*.025],u*.13,-.2-.7*(1-c)/2,u*.025);const p=polar([x+u*.12,y],u*.055,-.8+.6*s);line(ctx,[[x+u*.08,y],p]);ellipse(ctx,x+u*.12,y,u*.008);break;
    }
    case 'mccallister-door-panels-on-quarter-track': {
      const rise=u*.12*(1-c)/2;box(ctx,x-u*.19,y-u*.14,u*.38,u*.3);for(let i=0;i<6;i++){const yy=y+u*.13-i*u*.047-rise;box(ctx,x-u*.17,yy,u*.34,u*.042);}line(ctx,[[x-u*.2,y+u*.17],[x-u*.2,y-u*.18],[x+u*.2,y-u*.18],[x+u*.2,y+u*.17]]);wheel(ctx,x,y-u*.2,u*.018,rise/(u*.018),6);break;
    }
    case 'mib-entry-offset-split-lift-doors': {
      const q=u*.085*(1-c)/2;box(ctx,x-u*.16,y-u*.17,u*.32,u*.34);box(ctx,x-u*.13-q,y-u*.15,u*.13,u*.3);box(ctx,x+q,y-u*.15,u*.13,u*.3);for(const side of [-1,1]){const bx=x+side*(u*.065+q);line(ctx,[[bx,y-u*.15],[bx,y-u*.19]]);wheel(ctx,bx,y-u*.19,u*.012,a*side,4);}break;
    }
    case 'ltd-two-axle-tunnel-traction-study': {
      polygon(ctx,[[x-u*.23,y+u*.035],[x-u*.19,y-u*.035],[x-u*.08,y-u*.035],[x-u*.045,y-u*.085],[x+u*.10,y-u*.085],[x+u*.17,y-u*.035],[x+u*.23,y-u*.025],[x+u*.23,y+u*.035]]);for(const dx of [-.14,.14]){wheel(ctx,x+u*dx,y+u*.04,u*.04,a,7);line(ctx,[[x+u*dx-u*.045,y+u*.09],[x+u*dx+u*.045,y+u*.09]]);}break;
    }
    case 'rodgeryoung-single-heavy-plate-and-rack': {
      const q=u*.14*(1-c)/2;box(ctx,x-u*.14,y-u*.16,u*.28,u*.32);box(ctx,x-u*.125,y-u*.14-q,u*.25,u*.29);for(let i=0;i<7;i++)line(ctx,[[x-u*.11+i*u*.032,y+u*.1-q],[x-u*.09+i*u*.032,y+u*.13-q]]);gear(ctx,x+u*.16,y-u*.08,u*.027,q/(u*.027),12);for(let i=0;i<9;i++)line(ctx,[[x+u*.13,y-u*.18-q+i*u*.033],[x+u*.15,y-u*.18-q+i*u*.033]]);break;
    }
    case 'dr8-retrieval-two-leaf-ramp-hinge': {
      const q=.15+.5*(1-c)/2;box(ctx,x-u*.18,y-u*.12,u*.36,u*.18);hinge(ctx,[x-u*.17,y+u*.065],u*.16,q,u*.018);hinge(ctx,[x+u*.17,y+u*.065],u*.16,Math.PI-q,u*.018);line(ctx,[[x-u*.2,y+u*.14],[x+u*.2,y+u*.14]]);break;
    }
    case 'heartofgold-two-curved-door-tracks': {
      const shift=u*.09*(1-c)/2;ellipse(ctx,x,y,u*.13,u*.16);for(const side of [-1,1]){const xx=x+side*shift;ctx.beginPath();ctx.ellipse(xx,y,u*.12,u*.15,0,side<0?Math.PI/2:-Math.PI/2,side<0?Math.PI*1.5:Math.PI/2);ctx.stroke();line(ctx,[[xx,y-u*.15],[xx,y+u*.15]]);}break;
    }
    case 'vogon-airlock-three-spoke-handwheel': {
      ellipse(ctx,x,y,u*.145);ellipse(ctx,x,y,u*.115);wheel(ctx,x-u*.025,y+u*.02,u*.065,a*.25,3);for(let i=0;i<5;i++)ellipse(ctx,...polar([x,y],u*.132,i*TAU/5),u*.007);box(ctx,x+u*.15,y-u*.055,u*.035,u*.11);break;
    }
    case 'headquarters-three-telescoping-suction-sleeves': {
      const q=(1-c)/2;for(let i=0;i<3;i++){const yy=y-u*.1+i*u*(.055+.025*q),r=u*(.09-i*.016);box(ctx,x-r,yy,r*2,u*.08);ellipse(ctx,x,yy+u*.08,r,u*.018);}line(ctx,[[x-u*.11,y-u*.12],[x+u*.11,y-u*.12]]);break;
    }
    case 'longterm-elbow-tube-empty-marker-transport': {
      const g=getStageAnimationWave10Geometry(animation.mechanism,t,w,h);for(const dr of [-.012,.012]){ctx.beginPath();ctx.arc(...g.center,g.radius+u*dr,-Math.PI/2,0);ctx.stroke();}line(ctx,[[x,y-u*.15],[x,y-u*.085],[x+u*.085,y],[x+u*.18,y]]);ellipse(ctx,...g.marker,u*.009);ellipse(ctx,x+u*.18,y,u*.009,u*.024);break;
    }
    case 'climatewall-four-louver-and-crossflow-fan': {
      box(ctx,x-u*.17,y-u*.15,u*.34,u*.3);for(let i=0;i<4;i++){const yy=y+u*(-.105+i*.07),q=.15+.4*s;hinge(ctx,[x-u*.14,yy],u*.28,q,u*.009);}for(const dx of [-.12,.12])wheel(ctx,x+u*dx,y,u*.07,a,9);break;
    }
    case 'centralstation-return-loop-escalator-steps': {
      const start=[x-u*.22,y+u*.11],end=[x+u*.2,y-u*.09];line(ctx,[start,end,[end[0]+u*.02,end[1]+u*.04],[start[0]+u*.02,start[1]+u*.04],start]);for(let i=0;i<14;i++){const q=(t+i/14)%1,xx=start[0]+(end[0]-start[0])*q,yy=start[1]+(end[1]-start[1])*q;line(ctx,[[xx,yy],[xx+u*.03,yy],[xx+u*.03,yy+u*.025]]);}line(ctx,[[start[0],start[1]-u*.07],[end[0],end[1]-u*.07]]);break;
    }
    case 'tetravaal-empty-two-axis-production-gantry': {
      const xx=x+u*.12*s,yy=y-u*.03+u*.045*c;box(ctx,x-u*.23,y-u*.14,u*.46,u*.27);line(ctx,[[xx,y-u*.14],[xx,y+u*.13]]);box(ctx,xx-u*.035,yy,u*.07,u*.04);line(ctx,[[xx,yy+u*.04],[xx,yy+u*.065]]);rail(ctx,x-u*.23,y-u*.17,u*.46,t,12);break;
    }
    case 'moose-detached-unloaded-barrel-cluster': {
      ellipse(ctx,x,y,u*.09);ellipse(ctx,x+u*.12,y,u*.09);for(let i=0;i<6;i++){const q=a+i*TAU/6,p=polar([x,y],u*.055,q),e=[p[0]+u*.12,p[1]];line(ctx,[p,e]);ellipse(ctx,...e,u*.015);}box(ctx,x-u*.04,y+u*.1,u*.2,u*.025);line(ctx,[[x,y+u*.1],[x,y+u*.04]]);break;
    }
    case 'kagutsuchi-monorail-opposed-guide-wheels': {
      box(ctx,x-u*.24,y-u*.025,u*.48,u*.05);for(const dx of [-.12,.12])for(const side of [-1,1])wheel(ctx,x+u*dx,y+side*u*.065,u*.035,a*side,6);box(ctx,x-u*.18,y-u*.14,u*.36,u*.035);line(ctx,[[x-u*.14,y-u*.1],[x-u*.14,y-u*.025],[x+u*.14,y-u*.025],[x+u*.14,y-u*.1]]);break;
    }
    case 'kagutsuchi-port-clock-three-geared-arbors': {
      ellipse(ctx,x,y,u*.14);gear(ctx,x-u*.11,y+u*.1,u*.055,a,20);gear(ctx,x,y+u*.1,u*.055,-a,20);gear(ctx,x+u*.11,y+u*.1,u*.055,a,20);line(ctx,[[x,y],polar([x,y],u*.1,a/12-Math.PI/2)]);line(ctx,[[x,y],polar([x,y],u*.065,a/144-Math.PI/2)]);for(let i=0;i<12;i++)line(ctx,[polar([x,y],u*.12,i*TAU/12),polar([x,y],u*.135,i*TAU/12)]);break;
    }
    case 'tharsis-central-car-and-chain-return': lift(ctx,x,y-u*.1,u,t,{width:.27,travel:.16,guides:3});rail(ctx,x-u*.2,y+u*.12,u*.4,t,10);break;
    case 'tharsis-overhead-empty-slagpot-trolley': {
      line(ctx,[[x-u*.28,y-u*.1],[x+u*.28,y-u*.1]]);for(let i=0;i<2;i++){const xx=x+u*((t+i*.5)%1-.5)*.48;wheel(ctx,xx,y-u*.1,u*.025,a,5);line(ctx,[[xx,y-u*.08],[xx,y+u*.035]]);polygon(ctx,[[xx-u*.06,y+u*.02],[xx-u*.04,y+u*.1],[xx+u*.04,y+u*.1],[xx+u*.06,y+u*.02]]);}break;
    }
    case 'shibuya-crane-fixed-jib-empty-hoist': {
      line(ctx,[[x-u*.18,y+u*.15],[x-u*.18,y-u*.15],[x+u*.23,y-u*.15]]);for(let i=0;i<6;i++)polygon(ctx,[[x+u*(-.18+i*.067),y-u*.15],[x+u*(-.146+i*.067),y-u*.11],[x+u*(-.113+i*.067),y-u*.15]]);const xx=x+u*.12*s,yy=y+u*.045*(1-c);for(const dx of [-.025,.025]){line(ctx,[[xx+u*dx,y-u*.15],[xx+u*dx,yy]]);wheel(ctx,xx+u*dx,y-u*.15,u*.014,yy/(u*.014),4);}box(ctx,xx-u*.055,yy,u*.11,u*.025);break;
    }
    case 'benten-empty-railcar-two-bogie-pass': {
      const xx=x+u*.26*s;box(ctx,xx-u*.2,y-u*.08,u*.4,u*.12);for(let i=0;i<5;i++)box(ctx,xx+u*(-.17+i*.07),y-u*.055,u*.045,u*.04);for(const dx of [-.13,.13]){for(const j of [-1,1])wheel(ctx,xx+u*dx+j*u*.025,y+u*.06,u*.018,a*2,4);box(ctx,xx+u*dx-u*.05,y+u*.035,u*.1,u*.025);}line(ctx,[[x-u*.5,y+u*.085],[x+u*.5,y+u*.085]]);break;
    }
    case 'munitionsplant-two-drum-cargo-hoist': {
      const q=(1-c)/2;for(const side of [-1,1]){wheel(ctx,x+side*u*.11,y-u*.1,u*.04,q*2,8);line(ctx,[[x+side*u*.11,y-u*.06],[x+side*u*.11,y+u*(.03+.12*q)]]);}box(ctx,x-u*.18,y+u*(.03+.12*q),u*.36,u*.025);line(ctx,[[x-u*.22,y-u*.16],[x+u*.22,y-u*.16]]);break;
    }
    case 'munitionsplant-empty-scissor-service-gate': {
      const g=getStageAnimationWave10Geometry(animation.mechanism,t,w,h);line(ctx,g.points);line(ctx,g.points.map(p=>[p[0],2*y+u*.08-p[1]]));for(const p of g.points)ellipse(ctx,...p,u*.005);line(ctx,[[x-u*.21,y-u*.04],[x-u*.21,y+u*.15]]);break;
    }
    case 'chrysler-keyed-lift-and-segment-indicator': {
      lift(ctx,x-u*.05,y-u*.11,u,t,{width:.19,travel:.15});const q=(1-c)/2;box(ctx,x+u*.18,y-u*.14,u*.045,u*.25);for(let i=0;i<7;i++)line(ctx,[[x+u*.185,y+u*(-.12+i*.032)],[x+u*.216,y+u*(-.12+i*.032)]]);box(ctx,x+u*.182,y-u*.13+u*.2*q,u*.04,u*.025);break;
    }
    case 'carrier-boiler-cold-pressure-linkage': {
      box(ctx,x-u*.15,y-u*.1,u*.3,u*.22);ellipse(ctx,x-u*.15,y+u*.01,u*.025,u*.11);ellipse(ctx,x+u*.15,y+u*.01,u*.025,u*.11);const q=(1-c)/2;box(ctx,x-u*.08,y-u*.15-u*.03*q,u*.05,u*.1);line(ctx,[[x-u*.055,y-u*.05],[x-u*.055,y+u*.08]]);ellipse(ctx,x+u*.08,y-u*.06,u*.035);line(ctx,[[x+u*.08,y-u*.06],polar([x+u*.08,y-u*.06],u*.027,-2+.6*q)]);break;
    }
    case 'coaltower-four-piston-generator-crankshaft': case 'refinery-extractor-three-cylinder-pump': {
      const g=getStageAnimationWave10Geometry(animation.mechanism,t,w,h);for(const rod of g.rods){wheel(ctx,...rod.root,rod.radius,a,5);line(ctx,[rod.root,rod.crank,rod.slider]);box(ctx,rod.slider[0]-u*.01,rod.slider[1]-u*.025,u*.02,u*.05);line(ctx,[[rod.root[0]-u*.02,y-u*.1],[rod.root[0]-u*.02,y+u*.14]]);}box(ctx,x-u*.21,y+u*.13,u*.48,u*.025);break;
    }
    case 'macmillan-exitgate-chain-and-rack': {
      const q=u*.12*(1-c)/2;box(ctx,x-u*.19,y-u*.17,u*.38,u*.34);box(ctx,x-u*.17,y-u*.15-q,u*.34,u*.29);for(let i=0;i<7;i++)line(ctx,[[x-u*.14+i*u*.045,y-u*.14-q],[x-u*.14+i*u*.045,y+u*.13-q]]);wheel(ctx,x+u*.22,y-u*.13,u*.023,q/(u*.023),7);line(ctx,[[x+u*.2,y-u*.13],[x+u*.2,y+u*.16],[x+u*.24,y+u*.16],[x+u*.24,y-u*.13]]);break;
    }
    case 'awakening-mine-stable-rope-elevator': lift(ctx,x-u*.03,y-u*.1,u,t,{width:.31,travel:.14,guides:2});for(let i=0;i<4;i++)line(ctx,[[x-u*.17+i*u*.1,y+u*.11],[x-u*.17+i*u*.1,y+u*.16]]);break;
    case 'reckoning-carrier-two-column-service-platform': {
      const q=(1-c)/2;for(const dx of [-.18,.18]){box(ctx,x+u*dx-u*.012,y-u*.14,u*.024,u*.3);box(ctx,x+u*dx-u*.025,y-u*.1+u*.16*q,u*.05,u*.045);}box(ctx,x-u*.22,y-u*.065+u*.16*q,u*.44,u*.025);for(let i=0;i<8;i++)line(ctx,[[x-u*.20+i*u*.05,y-u*.062+u*.16*q],[x-u*.18+i*u*.05,y-u*.04+u*.16*q]]);break;
    }
    case 'badwater-wheel-rising-valve-stem': {
      const q=u*.035*(1-c)/2;line(ctx,[[x-u*.24,y+u*.08],[x+u*.24,y+u*.08]]);line(ctx,[[x-u*.24,y+u*.12],[x+u*.24,y+u*.12]]);box(ctx,x-u*.03,y+u*.05,u*.06,u*.1);line(ctx,[[x,y-u*.07-q],[x,y+u*.06]]);wheel(ctx,x,y-u*.09-q,u*.07,a*.3,5);for(let i=0;i<6;i++)line(ctx,[[x-u*.012,y-u*.025-q+i*u*.012],[x+u*.012,y-u*.018-q+i*u*.012]]);break;
    }
    case 'armacham-empty-cage-and-overhead-sheave': {
      const q=u*.12*(1-c)/2;box(ctx,x-u*.12,y-u*.07+q,u*.24,u*.16);for(let i=1;i<6;i++)line(ctx,[[x-u*.12+i*u*.04,y-u*.07+q],[x-u*.12+i*u*.04,y+u*.09+q]]);line(ctx,[[x,y-u*.07+q],[x,y-u*.17]]);wheel(ctx,x,y-u*.19,u*.03,q/(u*.03),8);for(const dx of [-.16,.16])line(ctx,[[x+u*dx,y-u*.17],[x+u*dx,y+u*.23]]);break;
    }
    case 'bastille-approach-nine-blade-turbine': {
      ellipse(ctx,x,y,u*.15);ellipse(ctx,x,y,u*.11);for(let i=0;i<9;i++){const q=a+i*TAU/9;polygon(ctx,[polar([x,y],u*.035,q),polar([x,y],u*.125,q+.08),polar([x,y],u*.12,q+.35),polar([x,y],u*.04,q+.24)]);}for(const dx of [-.07,0,.07])line(ctx,[[x+u*dx,y-u*.15],[x+u*dx,y+u*.15]]);break;
    }
    case 'saintmichel-four-guide-empty-service-lift': lift(ctx,x,y-u*.11,u,t,{width:.32,travel:.17,guides:4});box(ctx,x-u*.22,y+u*.17,u*.44,u*.022);break;
    case 'rebirth-donation-three-plain-counter-drums': {
      box(ctx,x-u*.13,y-u*.15,u*.26,u*.3);box(ctx,x-u*.1,y-u*.12,u*.2,u*.08);for(let i=0;i<3;i++){const xx=x+u*(-.063+i*.063);box(ctx,xx-u*.025,y-u*.105,u*.05,u*.05);for(let j=0;j<5;j++){const yy=y-u*.08+u*.022*Math.sin(a*(i+1)/3+j*TAU/5);line(ctx,[[xx-u*.02,yy],[xx+u*.02,yy]]);}}line(ctx,[[x-u*.05,y+u*.045],[x+u*.05,y+u*.045]]);break;
    }
    case 'rebirth-slot-three-offset-empty-reels': {
      box(ctx,x-u*.15,y-u*.15,u*.3,u*.3);for(let i=0;i<3;i++){const xx=x+u*(-.09+i*.09);box(ctx,xx-u*.035,y-u*.08,u*.07,u*.12);for(let j=0;j<6;j++){const yy=y-u*.02+u*.05*Math.sin(a+i*.9+j*TAU/6);box(ctx,xx-u*.02,yy,u*.04,u*.011);}}const tip=polar([x+u*.16,y],u*.065,-1.2+.4*s);line(ctx,[[x+u*.16,y],tip]);ellipse(ctx,...tip,u*.012);break;
    }
    case 'starcourt-loading-box-two-stage-guide': {
      const q=(1-c)/2;for(const dx of [-.19,.19])box(ctx,x+u*dx-u*.01,y-u*.18,u*.02,u*.37);box(ctx,x-u*.16,y-u*.12+u*.16*q,u*.32,u*.15);box(ctx,x-u*.13,y-u*.1+u*.16*q,u*.26,u*.1);for(let i=0;i<5;i++)line(ctx,[[x-u*.13,y-u*.1+u*.16*q+i*u*.023],[x+u*.13,y-u*.1+u*.16*q+i*u*.023]]);line(ctx,[[x,y-u*.12+u*.16*q],[x,y-u*.2]]);break;
    }
    case 'starcourt-key-empty-counterrotating-collars': {
      const g=getStageAnimationWave10Geometry(animation.mechanism,t,w,h);for(let i=0;i<3;i++){ellipse(ctx,...g.center,g.radii[i]);line(ctx,[g.center,g.ends[i]]);ellipse(ctx,...g.ends[i],u*.008);}for(const dx of [-.16,.16])box(ctx,x+u*dx-u*.015,y-u*.15,u*.03,u*.3);line(ctx,[[x-u*.2,y+u*.16],[x+u*.2,y+u*.16]]);break;
    }
    case 'prometheus-empty-medpod-two-shell-cover': {
      box(ctx,x-u*.2,y+u*.06,u*.4,u*.04);for(const side of [-1,1])hinge(ctx,[x+side*u*.18,y+u*.055],u*.17,side>0?Math.PI+.6*(1-c)/2:-.6*(1-c)/2,u*.045);for(const dx of [-.13,.13])line(ctx,[[x+u*dx,y+u*.1],[x+u*dx,y+u*.17]]);break;
    }
    case 'prometheus-ramp-two-fixed-length-supports': {
      const root=[x-u*.2,y-u*.04],angle=.15+.35*(1-c)/2;hinge(ctx,root,u*.39,angle,u*.025);for(const len of [.16,.3]){const p=polar(root,u*len,angle);line(ctx,[root,p]);ellipse(ctx,...p,u*.007);}box(ctx,x-u*.24,y-u*.14,u*.08,u*.23);break;
    }
    case 'auriga-four-articulated-holding-clamps': case 'covenant-empty-loader-two-jaw-linkage': case 'graia-two-fixed-base-mooring-clamps': {
      const g=getStageAnimationWave10Geometry(animation.mechanism,t,w,h);for(const arm of g.arms){line(ctx,[arm.root,arm.elbow,arm.tip]);ellipse(ctx,...arm.root,u*.012);ellipse(ctx,...arm.elbow,u*.011);box(ctx,arm.tip[0]-u*.012,arm.tip[1]-u*.02,u*.024,u*.04);}if(animation.mechanism.startsWith('auriga'))ellipse(ctx,x,y,u*.09,u*.14);else {box(ctx,x-u*.22,y+u*.12,u*.44,u*.025);if(animation.mechanism.startsWith('covenant')){line(ctx,[[x,y-u*.15],[x,y+u*.1]]);gear(ctx,x,y+u*.07,u*.035,a,12);}else for(const dx of [-.19,-.12,.12,.19])ellipse(ctx,x+u*dx,y+u*.13,u*.006);}break;
    }
    case 'betty-offset-cargo-hatch-and-slide': {
      const q=u*.12*(1-c)/2;polygon(ctx,[[x-u*.18,y-u*.1],[x+u*.1,y-u*.1],[x+u*.18,y],[x+u*.1,y+u*.1],[x-u*.18,y+u*.1]]);box(ctx,x-u*.14+q,y-u*.07,u*.24,u*.14);for(const yy of [-.13,.13])line(ctx,[[x-u*.2,y+u*yy],[x+u*.24,y+u*yy]]);wheel(ctx,x-u*.1+q,y,u*.035,a*.3,4);break;
    }
    case 'covenant-terraform-four-guided-bay-panels': {
      const q=u*.13*(1-c)/2;box(ctx,x-u*.22,y-u*.16,u*.44,u*.32);for(const side of [-1,1])for(const vertical of [-1,1]){const xx=x+side*(u*.11+q*.5),yy=y+vertical*(u*.08+q*.3);box(ctx,xx-u*.1,yy-u*.07,u*.2,u*.14);}for(const dx of [-.24,.24])line(ctx,[[x+u*dx,y-u*.18],[x+u*dx,y+u*.18]]);break;
    }
    case 'romulus-freight-three-sheave-rope-loop': {
      const q=u*.13*(1-c)/2;const pts=[[x-u*.12,y-u*.11],[x,y-u*.17],[x+u*.12,y-u*.11]];for(let i=0;i<3;i++)wheel(ctx,...pts[i],u*.025,(i%2?-q:q)/(u*.025),7);line(ctx,[[x-u*.12,y+q],...pts,[x+u*.12,y+u*.15-q]]);box(ctx,x-u*.15,y+q,u*.06,u*.04);box(ctx,x+u*.09,y+u*.15-q,u*.06,u*.04);break;
    }
    case 'renaissance-cryo-door-linked-bolt-cam': box(ctx,x-u*.19,y-u*.15,u*.38,u*.3);boltCam(ctx,x,y,u,t,4,.10);for(const yy of [-.12,.12])box(ctx,x-u*.22,y+u*yy,u*.045,u*.025);break;
    case 'la-subway-three-pocket-door-slide': {
      const q=u*.065*(1-c)/2;box(ctx,x-u*.27,y-u*.12,u*.54,u*.24);for(let i=0;i<3;i++){const xx=x+u*(-.18+i*.18);box(ctx,xx-u*.065+q,y-u*.1,u*.13,u*.2);box(ctx,xx-u*.045+q,y-u*.08,u*.09,u*.055);}line(ctx,[[x-u*.29,y+u*.14],[x+u*.29,y+u*.14]]);break;
    }
    case 'slaughterhouse-empty-overhead-chain-hooks': {
      rail(ctx,x-u*.27,y-u*.1,u*.54,t,16);for(let i=0;i<6;i++){const xx=x+u*.50*((t+i/6)%1-.5);line(ctx,[[xx,y-u*.07],[xx,y+u*.035],[xx+u*.025,y+u*.035],[xx+u*.025,y+u*.005]]);ellipse(ctx,xx,y-u*.065,u*.008);}break;
    }
    case 'abandoned-drill-empty-helical-spindle': {
      box(ctx,x-u*.19,y-u*.08,u*.38,u*.16);line(ctx,[[x-u*.23,y],[x+u*.25,y]]);for(let i=0;i<9;i++){const xx=x+u*(-.16+i*.04);ellipse(ctx,xx,y,u*.012,u*.07);line(ctx,[[xx,y+u*.065*Math.sin(a+i*.6)],[xx+u*.04,y+u*.065*Math.sin(a+(i+1)*.6)]]);}wheel(ctx,x-u*.24,y,u*.07,a,5);break;
    }
    case 'noland-drill-hatch-six-leaf-inner-latch': {
      ellipse(ctx,x,y,u*.14);for(let i=0;i<6;i++){const q=i*TAU/6,root=polar([x,y],u*.12,q),tip=polar(root,u*.055,q+Math.PI+.5*s);line(ctx,[root,tip]);ellipse(ctx,...root,u*.009);}ellipse(ctx,x,y,u*.065);box(ctx,x+u*.14,y-u*.04,u*.03,u*.08);break;
    }
    case 'bouvet-pyramid-three-phase-stone-blocks': {
      for(let i=0;i<3;i++){const q=(1-Math.cos(a-i*TAU/3))/2;box(ctx,x+u*(-.22+i*.145),y-u*.13+u*.085*q,u*.13,u*.25);for(let j=0;j<4;j++)line(ctx,[[x+u*(-.21+i*.145),y+u*(-.09+j*.055)+u*.085*q],[x+u*(-.10+i*.145),y+u*(-.09+j*.055)+u*.085*q]]);}line(ctx,[[x-u*.26,y+u*.22],[x+u*.26,y+u*.22]]);break;
    }
    case 'whalingstation-empty-cable-drum-and-sled': {
      const q=(1-c)/2;wheel(ctx,x-u*.17,y-u*.06,u*.055,q*3,8);wheel(ctx,x+u*.19,y-u*.1,u*.025,-q*6,5);line(ctx,[[x-u*.17,y-u*.115],[x+u*.19,y-u*.125],[x+u*.19,y+u*(.02+.12*q)]]);box(ctx,x+u*.13,y+u*(.02+.12*q),u*.12,u*.025);line(ctx,[[x+u*.11,y-u*.12],[x+u*.11,y+u*.2],[x+u*.27,y+u*.2],[x+u*.27,y-u*.12]]);break;
    }
    case 'roadhouse-empty-record-carousel-and-selector': {
      box(ctx,x-u*.13,y-u*.16,u*.26,u*.32);ellipse(ctx,x,y-u*.02,u*.085);for(let i=0;i<9;i++){const q=a+i*TAU/9;line(ctx,[polar([x,y-u*.02],u*.035,q),polar([x,y-u*.02],u*.08,q)]);}const yy=y+u*.10*s;box(ctx,x+u*.07,yy,u*.035,u*.018);line(ctx,[[x+u*.09,y-u*.13],[x+u*.09,y+u*.12]]);break;
    }
    case 'sphere-gravity-panel-unpowered-rotary-dial': {
      polygon(ctx,[[x-u*.14,y-u*.12],[x+u*.12,y-u*.15],[x+u*.15,y+u*.12],[x-u*.12,y+u*.15]]);wheel(ctx,x,y,u*.085,a*.25,4);for(let i=0;i<4;i++)box(ctx,...polar([x-u*.007,y-u*.007],u*.113,i*TAU/4),u*.014,u*.014);break;
    }
    case 'auditore-sanctuary-six-radial-lock-rods': {
      boltCam(ctx,x,y,u,t,6,.08);for(let i=0;i<6;i++){const p=polar([x,y],u*.20,i*TAU/6);box(ctx,p[0]-u*.022,p[1]-u*.022,u*.044,u*.044);line(ctx,[polar([x,y],u*.13,i*TAU/6),p]);}break;
    }
    case 'sanmarco-fourbar-lever-and-gate-rack': {
      const p1=[x-u*.17,y+u*.09],p2=[x-u*.04,y+u*.09],len=u*.11,ang=-1+.3*s,end1=polar(p1,len,ang),end2=polar(p2,len,ang);line(ctx,[p1,end1,end2,p2]);for(const p of [p1,p2,end1,end2])ellipse(ctx,...p,u*.008);const q=u*.1*(1-c)/2;box(ctx,x+u*.08,y-u*.10-q,u*.12,u*.21);for(let i=0;i<4;i++)line(ctx,[[x+u*.1+i*u*.025,y-u*.10-q],[x+u*.1+i*u*.025,y+u*.11-q]]);break;
    }
    case 'volcano-empty-maintenance-apse-fanout': {
      box(ctx,x-u*.23,y+u*.09,u*.46,u*.035);for(let i=0;i<3;i++){const root=[x+u*(-.15+i*.15),y+u*.075];hinge(ctx,root,u*.14,-Math.PI/2+(.15+.5*(1-c)/2)*(i-1),u*.055);}line(ctx,[[x-u*.26,y+u*.15],[x+u*.26,y+u*.15]]);break;
    }
    case 'resaca-steam-lift-cylinder-and-deck': {
      const q=u*.14*(1-c)/2;box(ctx,x-u*.04,y+u*.02,u*.08,u*.15);box(ctx,x-u*.015,y-u*.10+q,u*.03,u*.14-q);box(ctx,x-u*.14,y-u*.12+q,u*.28,u*.025);for(const dx of [-.18,.18])line(ctx,[[x+u*dx,y-u*.14],[x+u*dx,y+u*.17]]);wheel(ctx,x-u*.13,y+u*.09,u*.035,q/(u*.035),7);break;
    }
    case 'felsen-empty-short-wheelbase-mine-cart': {
      const xx=x+u*.14*s;polygon(ctx,[[xx-u*.12,y-u*.07],[xx+u*.12,y-u*.07],[xx+u*.09,y+u*.04],[xx-u*.09,y+u*.04]]);for(const dx of [-.07,.07])wheel(ctx,xx+u*dx,y+u*.065,u*.025,a,5);line(ctx,[[x-u*.3,y+u*.095],[x+u*.3,y+u*.095]]);for(let i=0;i<7;i++)line(ctx,[[x+u*(-.27+i*.09),y+u*.1],[x+u*(-.24+i*.09),y+u*.13]]);break;
    }
    case 'tram-elevator-transfer-twin-rail-cage': {
      const q=(1-c)/2;for(const side of [-1,1]){const yy=y+u*(side*.08*q-.04);box(ctx,x+side*u*.13-u*.075,yy,u*.15,u*.055);line(ctx,[[x+side*u*.13,y-u*.15],[x+side*u*.13,y+u*.16]]);}line(ctx,[[x-u*.22,y-u*.16],[x+u*.22,y-u*.16]]);wheel(ctx,x,y-u*.16,u*.024,a,6);break;
    }
    case 'nemesis-engine-one-three-bearing-collar': {
      for(let i=0;i<3;i++){const xx=x+u*(-.12+i*.12);collar(ctx,xx,y,u*.08,i%2?-a:a,7);box(ctx,xx-u*.025,y+u*.08,u*.05,u*.025);}line(ctx,[[x-u*.25,y+u*.12],[x+u*.25,y+u*.12]]);break;
    }
    case 'nemesis-three-empty-hibernation-lids': {
      for(let i=0;i<3;i++){const xx=x+u*(-.17+i*.17),q=.1+.6*(1-Math.cos(a+i*.7))/2;box(ctx,xx-u*.065,y+u*.04,u*.13,u*.04);hinge(ctx,[xx-u*.06,y+u*.035],u*.12,-q,u*.017);}break;
    }
    case 'carnovasch-plain-fountain-two-bounded-jets': {
      ellipse(ctx,x,y+u*.13,u*.21,u*.035);ellipse(ctx,x,y+u*.15,u*.19,u*.03);for(const side of [-1,1]){const root=[x,y+u*.035],end=[x+side*u*.16,y+u*.12],peak=[x+side*u*.08,y-u*.16];ctx.beginPath();ctx.moveTo(...root);ctx.quadraticCurveTo(...peak,...end);ctx.stroke();for(let i=0;i<5;i++){const q=(t+i/5)%1,xx=(1-q)**2*root[0]+2*(1-q)*q*peak[0]+q*q*end[0],yy=(1-q)**2*root[1]+2*(1-q)*q*peak[1]+q*q*end[1];ellipse(ctx,xx,yy,u*.004,u*.007);}}break;
    }
    case 'carnovasch-pantry-fixed-edge-plain-hatch': {
      const q=.1+.65*(1-c)/2,root=[x-u*.16,y+u*.1];hinge(ctx,root,u*.32,-q,u*.02);box(ctx,x-u*.19,y+u*.105,u*.38,u*.025);for(let i=0;i<4;i++)line(ctx,[[x-u*.24+i*u*.12,y+u*.15],[x-u*.16+i*u*.12,y+u*.15]]);ellipse(ctx,x-u*.16,y+u*.1,u*.014);break;
    }
    case 'oztoc-right-angle-wall-floor-axis': {
      const root=[x,y],q=.3*s,p1=polar(root,u*.18,q),p2=polar(root,u*.15,q-Math.PI/2);line(ctx,[p1,root,p2]);line(ctx,[[p1[0],p1[1]+u*.025],[x,y+u*.025],[p2[0]+u*.025,p2[1]]]);wheel(ctx,x,y,u*.035,a*.1,5);for(let i=1;i<5;i++)ellipse(ctx,...polar(root,u*.035*i,q),u*.004);break;
    }
    case 'teotl-empty-elevator-and-fixed-gutter': {
      lift(ctx,x-u*.08,y-u*.1,u,t,{width:.18,travel:.14});line(ctx,[[x+u*.10,y+u*.1],[x+u*.24,y+u*.02],[x+u*.25,y+u*.04],[x+u*.11,y+u*.12]]);box(ctx,x+u*.21,y-u*.14,u*.04,u*.12);break;
    }
    case 'primagen-two-leaf-capacitor-access-bridge': {
      const g=getStageAnimationWave10Geometry(animation.mechanism,t,w,h);for(const leaf of g.leaves){line(ctx,[leaf.root,leaf.end]);ellipse(ctx,...leaf.root,u*.012);const side=leaf.root[0]<x?-1:1;line(ctx,[[leaf.root[0]+side*u*.025,leaf.root[1]+u*.08],leaf.end]);}box(ctx,x-u*.25,y+u*.08,u*.12,u*.035);box(ctx,x+u*.13,y+u*.08,u*.12,u*.035);break;
    }
    case 'primagen-fixed-duct-seven-blade-fan': {
      box(ctx,x-u*.19,y-u*.16,u*.38,u*.32);ellipse(ctx,x,y,u*.135);for(let i=0;i<7;i++){const q=a+i*TAU/7;polygon(ctx,[polar([x,y],u*.028,q),polar([x,y],u*.12,q+.09),polar([x,y],u*.115,q+.5),polar([x,y],u*.04,q+.35)]);}for(const yy of [-.1,0,.1])line(ctx,[[x-u*.17,y+u*yy],[x+u*.17,y+u*yy]]);break;
    }
    case 'cleanhit-hotel-four-fold-lift-leaves': {
      box(ctx,x-u*.17,y-u*.16,u*.34,u*.32);const q=.2+.8*(1-c)/2;for(const side of [-1,1]){const root=[x+side*u*.15,y-u*.14],dx=side*u*.07*Math.cos(q);for(let i=0;i<2;i++){const xx=root[0]-dx*i;polygon(ctx,[[xx,y-u*.14],[xx-dx,y-u*.14],[xx-dx,y+u*.14],[xx,y+u*.14]]);}}break;
    }
    case 'vengeance-empty-double-door-closers': {
      const q=.15+.8*(1-c)/2;for(const side of [-1,1]){const root=[x+side*u*.16,y+u*.08],end=hinge(ctx,root,u*.15,side>0?Math.PI+q:-q,u*.012);line(ctx,[[root[0],y-u*.1],[end[0],y-u*.1],[end[0],end[1]]]);const clos=[root[0]-side*u*.04,y-u*.12];line(ctx,[[root[0],y-u*.12],clos,[end[0],y-u*.1]]);}break;
    }
    case 'federation-empty-cell-six-radial-locks': {
      polygon(ctx,Array.from({length:6},(_,i)=>polar([x,y],u*.20,i*TAU/6)));boltCam(ctx,x,y,u,t,6,.105);for(let i=0;i<6;i++)ellipse(ctx,...polar([x,y],u*.18,i*TAU/6),u*.008);break;
    }
    case 'federation-door-seven-three-nested-tracks': {
      for(let i=0;i<3;i++){const q=u*.025*i*(1-c)/2;ellipse(ctx,x+q,y,u*(.10+i*.03),u*(.13+i*.03));line(ctx,[[x+q,y-u*(.13+i*.03)],[x+q,y+u*(.13+i*.03)]]);}box(ctx,x-u*.21,y+u*.17,u*.42,u*.02);break;
    }
    case 'safehouse-three-plain-retracting-pantry-trays': {
      box(ctx,x-u*.17,y-u*.15,u*.34,u*.3);for(let i=0;i<3;i++){const q=u*.065*(1-Math.cos(a+i*.8))/2,yy=y+u*(-.10+i*.095);polygon(ctx,[[x-u*.14,yy],[x+u*.14,yy],[x+u*.14+q,yy+u*.035],[x-u*.14+q,yy+u*.035]]);line(ctx,[[x-u*.14+q,yy+u*.035],[x-u*.14+q,yy+u*.017],[x+u*.14+q,yy+u*.017]]);}break;
    }
    case 'cortez-miniature-submarine-hatch-and-dog-links': {
      ellipse(ctx,x,y,u*.16,u*.12);ellipse(ctx,x,y,u*.125,u*.095);wheel(ctx,x,y,u*.065,a*.3,5);for(let i=0;i<4;i++){const q=i*TAU/4,p=polar([x,y],u*(.09+.015*s),q);line(ctx,[polar([x,y],u*.055,q+a*.3),p]);box(ctx,p[0]-u*.012,p[1]-u*.012,u*.024,u*.024);}box(ctx,x-u*.21,y+u*.13,u*.42,u*.02);break;
    }
    default:return false;
  }
  return true;
}
