// Twenty-four explicit scene mechanisms, not genre/name-selected effects.
// These original drawings animate documented props and mechanical functions;
// their geometry and timing are project adaptations, not official game frames.
const scene = definition => Object.freeze({
  ...definition,
  animationWave: 3,
  animationProvenance: 'authored-scene-mechanism-geometry-and-timing',
  renderingKind: 'authored-mechanism',
  localBackdrops: Object.freeze({}),
  timeSource: 'simulation-elapsed-seconds',
  reducedMotionBehavior: 'freeze-at-time-zero',
  sourceVisualValidation: 'not-validated-1:1',
  gameplayEffect: 'none'
});

export const STAGE_ANIMATION_WAVE_3 = Object.freeze([
  scene({
    id: 'metal-gear-shadow-moses-heliport-searchlights', universes: ['Metal Gear'], scenePattern: /shadow moses.*(?:heliport|h[eé]liport)|(?:heliport|h[eé]liport).*shadow moses/i,
    excludedScenePattern: /rising|revengeance|ground zeroes|phantom pain|camp omega/i,
    sourceWork: 'Metal Gear Solid (1998) — Shadow Moses heliport', sourceReference: 'https://www.konami.com/mg/',
    sourceScene: 'Shadow Moses — héliport, projecteurs du périmètre de MGS 1998', continuity: 'Metal Gear Solid (1998)',
    mechanism: 'shadow-moses-heliport-searchlights', color: '#b6c9cf', periodSeconds: 27,
    sceneEvidence: 'The heliport infiltration has moving searchlights. Two fixed-height lighting fixtures scan only their distant backdrop sectors; they never detect actors, raise an alert or deal damage.'
  }),
  scene({
    id: 'metal-gear-shadow-moses-cargo-lift', universes: ['Metal Gear'], scenePattern: /shadow moses.*(?:cargo|dock|quai|ascenseur)|(?:cargo dock|quai).*shadow moses/i,
    excludedScenePattern: /rising|revengeance|ground zeroes|phantom pain|camp omega/i,
    sourceWork: 'Metal Gear Solid (1998) — Shadow Moses cargo dock', sourceReference: 'https://www.konami.com/mg/',
    sourceScene: 'Shadow Moses — quai de chargement, ascenseur à câbles de l’introduction', continuity: 'Metal Gear Solid (1998)',
    mechanism: 'shadow-moses-cargo-lift', color: '#acbbb7', periodSeconds: 34,
    sceneEvidence: 'Snake reaches the heliport by the cargo-dock elevator in the opening infiltration. An empty distant freight platform moves on its guides; it is not a playable platform or route.'
  }),
  scene({
    id: 'guilty-gear-zepp-airship-propellers', universes: ['Guilty Gear'], scenePattern: /\bzepp\b.*(?:airship|dirigeable|h[eé]lice|propell)|(?:airship|dirigeable).*\bzepp\b/i,
    excludedScenePattern: /strive|xrd|l.oro|illyria|jellyfish skyarium/i,
    sourceWork: 'Guilty Gear XX — Zepp military airship setting', sourceReference: 'https://www.guiltygear.com/',
    sourceScene: 'Zepp — dirigeable militaire de Guilty Gear XX, hélices latérales', continuity: 'Guilty Gear XX setting',
    mechanism: 'zepp-airship-propellers', color: '#b9b4a0', periodSeconds: 15,
    sceneEvidence: 'Zepp is the airborne military nation associated with Potemkin. The propeller housings interpret its airship machinery; this is authored mechanical staging, not a verified original stage loop.'
  }),
  scene({
    id: 'guilty-gear-may-ship-anchor-winch', universes: ['Guilty Gear'], scenePattern: /may.?ship|navire.*may|jellyfish.*(?:anchor|ancre|winch|treuil)/i,
    excludedScenePattern: /strive|xrd|l.oro|illyria|jellyfish skyarium/i,
    sourceWork: 'Guilty Gear XX — May Ship, Jellyfish Pirates', sourceReference: 'https://www.guiltygear.com/',
    sourceScene: 'May Ship — treuil d’ancre du navire des Jellyfish Pirates, version XX', continuity: 'Guilty Gear XX setting',
    mechanism: 'may-ship-anchor-winch', color: '#c6b48d', periodSeconds: 23,
    sceneEvidence: 'May belongs to the Jellyfish Pirates and uses an anchor. The shipboard drum, rope and suspended anchor are an explicit mechanical adaptation of that nautical setting; no anchor attacks actors.'
  }),
  scene({
    id: 'mass-effect-normandy-sr1-galaxy-map', universes: ['Mass Effect'], scenePattern: /normandy.*(?:sr.?1|galaxy|galaxie|carte)|(?:galaxy map|carte.*galaxie).*normandy/i,
    excludedScenePattern: /andromeda|tempest|sr.?2|mass effect\s*[23]|normandy.*(?:2165|2185|2186)/i,
    sourceWork: 'Mass Effect (2007) — Normandy SR-1 galaxy map', sourceReference: 'https://www.ea.com/games/mass-effect/mass-effect-legendary-edition',
    sourceScene: 'Normandy SR-1 — carte galactique holographique du pont de navigation', continuity: 'Mass Effect (2007), SR-1',
    mechanism: 'normandy-sr1-galaxy-map', color: '#9dbed6', periodSeconds: 38,
    sceneEvidence: 'The SR-1 navigation deck has a projected galaxy map. Fixed star clusters rotate above its projector; the display changes no destination, mission, squad state or simulation clock.'
  }),
  scene({
    id: 'mass-effect-presidium-skycar-lanes', universes: ['Mass Effect'], scenePattern: /presidium|pr[eé]sidium|citadel.*skycar|citadelle.*a[eé]rocar/i,
    excludedScenePattern: /andromeda|nexus|tempest|citadel.*(?:destroyed|d[eé]truite)|citadelle.*d[eé]truite/i,
    sourceWork: 'Mass Effect (2007) — Citadel Presidium transit', sourceReference: 'https://www.ea.com/games/mass-effect/mass-effect-legendary-edition',
    sourceScene: 'Citadelle — Presidium, voies aériennes des skycars sous le ciel artificiel', continuity: 'Mass Effect (2007), Citadel Presidium',
    mechanism: 'presidium-skycar-lanes', color: '#b0ced5', periodSeconds: 48,
    sceneEvidence: 'Skycars travel through the Citadel’s urban space beneath the artificial sky. Small cars follow two background transit lanes without becoming targets, vehicles or collision objects.'
  }),
  scene({
    id: 'dead-space-ishimura-centrifuge', universes: ['Dead Space'], scenePattern: /ishimura.*(?:centrifuge|centrifugeuse|engineering|ing[eé]nierie)|(?:centrifuge|centrifugeuse).*ishimura/i,
    excludedScenePattern: /titan station|sprawl|tau volantis|dead space\s*[23]/i,
    sourceWork: 'Dead Space (2008) — USG Ishimura engineering centrifuge', sourceReference: 'https://www.ea.com/games/dead-space',
    sourceScene: 'USG Ishimura — ingénierie, bras de la centrifugeuse', continuity: 'Dead Space (2008), Ishimura',
    mechanism: 'ishimura-engineering-centrifuge', color: '#b3b9ac', periodSeconds: 18,
    sceneEvidence: 'The engineering chapter includes a large rotating centrifuge. Its projected arms remain inside a distant circular housing; the game receives no zero-gravity field, sweep hazard or collision.'
  }),
  scene({
    id: 'dead-space-ishimura-tram-coupling', universes: ['Dead Space'], scenePattern: /ishimura.*tram|tram.*ishimura/i,
    excludedScenePattern: /titan station|sprawl|tau volantis|dead space\s*[23]/i,
    sourceWork: 'Dead Space (2008) — USG Ishimura tram repair and transit', sourceReference: 'https://www.ea.com/games/dead-space',
    sourceScene: 'USG Ishimura — station du tram, voiture et bras d’arrimage', continuity: 'Dead Space (2008), Ishimura',
    mechanism: 'ishimura-tram-coupling', color: '#a2c0c3', periodSeconds: 31,
    sceneEvidence: 'The opening repair sequence reconnects the Ishimura tram using mechanical arms. A background car approaches a stop and the coupling arms pivot; no repair objective or ride is added.'
  }),
  scene({
    id: 'metal-gear-rising-world-marshal-freight-lift', universes: ['Metal Gear Rising'], scenePattern: /world marshal.*(?:lift|elevator|ascenseur|freight|monte.charge)|denver.*(?:lift|ascenseur|monte.charge)/i,
    excludedScenePattern: /shadow moses|big shell|groznyj|mother base/i,
    sourceWork: 'Metal Gear Rising: Revengeance (2013) — R-04 World Marshal headquarters', sourceReference: 'https://store.steampowered.com/app/235460/METAL_GEAR_RISING_REVENGEANCE/',
    sourceScene: 'Denver — World Marshal R-04, monte-charge du siège', continuity: 'Metal Gear Rising: Revengeance (2013)',
    mechanism: 'world-marshal-freight-lift', color: '#b7c1be', periodSeconds: 29,
    sceneEvidence: 'Raiden traverses the World Marshal headquarters and rides freight elevators in R-04. This empty shaft’s counterweight and platform move only in the background, with no combat spawning.'
  }),
  scene({
    id: 'metal-gear-rising-abkhazia-refinery-compressor', universes: ['Metal Gear Rising'], scenePattern: /abkhazia.*(?:refinery|raffinerie|compress)|(?:refinery|raffinerie).*abkhaz|mistral.*refinery/i,
    excludedScenePattern: /shadow moses|big shell|groznyj|mother base/i,
    sourceWork: 'Metal Gear Rising: Revengeance (2013) — R-01 Abkhazia refinery', sourceReference: 'https://store.steampowered.com/app/235460/METAL_GEAR_RISING_REVENGEANCE/',
    sourceScene: 'Abkhazia — raffinerie R-01, compresseurs sur les conduites', continuity: 'Metal Gear Rising: Revengeance (2013)',
    mechanism: 'abkhazia-refinery-compressor', color: '#b9b19d', periodSeconds: 17,
    sceneEvidence: 'The R-01 refinery is the industrial setting of the Mistral encounter. Crank-driven compressors are an authored interpretation of its process machinery, not a claim that these exact pistons appear in a source frame.'
  }),
  scene({
    id: 'tekken8-urban-square-taxi-traffic', universes: ['Tekken'], scenePattern: /urban square|times square.*tekken/i,
    excludedScenePattern: /tekken\s*(?:[1-7]|tag)|yakushima|moonlit wilderness/i,
    sourceWork: 'Tekken 8 — Urban Square', sourceReference: 'https://tekken.com/',
    sourceScene: 'Urban Square — taxis derrière les barrières de la place de Tekken 8', continuity: 'Tekken 8',
    mechanism: 'urban-square-taxi-traffic', color: '#c6b88a', periodSeconds: 35,
    sceneEvidence: 'Urban Square is a New York-inspired street stage with urban traffic. Yellow-cab silhouettes and rotating wheels follow the fenced backdrop road; no vehicle enters or strikes the combat lane.'
  }),
  scene({
    id: 'tekken4-airport-parked-airliner-turbine', universes: ['Tekken'], scenePattern: /tekken\s*4.*airport|airport.*tekken\s*4|a[eé]roport.*tekken\s*4/i,
    excludedScenePattern: /tekken\s*(?:[1235678]|tag)|urban square/i,
    sourceWork: 'Tekken 4 — Airport', sourceReference: 'https://www.bandainamcoent.co.jp/cs/list/tekken4/stages/index.html',
    sourceScene: 'Airport de Tekken 4 — turbine d’un avion stationné sur le parking arrière', continuity: 'Tekken 4',
    mechanism: 'airport-parked-airliner-turbine', color: '#b8c2c9', periodSeconds: 55,
    sceneEvidence: 'The official Tekken 4 stage page describes parked aircraft and their wheels. The fuselage and wheels stay fixed here; only the engine fan turns as an authored mechanical interpretation, not a verified original idle loop.'
  }),
  scene({
    id: 'rayman3-hoodlum-headquarters-conveyor', universes: ['Rayman'], scenePattern: /hoodlum.*headquarter|rayman\s*3.*(?:usine|convoyeur)|quartier.*g[eé]n[eé]ral.*hoodlum/i,
    excludedScenePattern: /rayman\s*[12](?!\d)|legends|origins|band land/i,
    sourceWork: 'Rayman 3: Hoodlum Havoc (2003) — Hoodlum Headquarters', sourceReference: 'https://www.ubisoft.com/en-us/game/rayman',
    sourceScene: 'Rayman 3 — Hoodlum Headquarters, convoyeur de l’usine', continuity: 'Rayman 3: Hoodlum Havoc (2003)',
    mechanism: 'hoodlum-headquarters-conveyor', color: '#baa581', periodSeconds: 21,
    sceneEvidence: 'Hoodlum Headquarters is the industrial Hoodlum factory. Small closed crates advance around a chain conveyor behind a fixed guard; the belt cannot carry characters or create enemies.'
  }),
  scene({
    id: 'rayman-legends-undersea-security-scanner', universes: ['Rayman'], scenePattern: /20.?000.*(?:lums|lieues)|rayman legends.*(?:undersea|sous.marin)|under the sea/i,
    excludedScenePattern: /rayman\s*[123](?!\d)|origins|hoodlum/i,
    sourceWork: 'Rayman Legends (2013) — 20,000 Lums Under the Sea', sourceReference: 'https://www.ubisoft.com/en-us/game/rayman/legends',
    sourceScene: 'Rayman Legends — 20 000 Lums Under the Sea, scanner de la base sous-marine', continuity: 'Rayman Legends (2013)',
    mechanism: 'undersea-security-scanner', color: '#9cbbc8', periodSeconds: 19,
    sceneEvidence: 'The undersea world uses stealth, underwater bases and security searchlights. A sealed window scanner sweeps a backdrop chamber only; it has no detection callback, alarm or attack.'
  }),
  scene({
    id: 'soul-calibur2-village-wind-mill', universes: ['Soul Calibur'], scenePattern: /village.*(?:wind|vent)|(?:windmill|moulin).*soul.?calibur\s*(?:ii|2)\b/i,
    excludedScenePattern: /soul.?calibur\s*(?:iii|iv|vi|v|[3456])\b|grand labyrinth|sealed corridor/i,
    sourceWork: 'Soulcalibur II (2002/2003) — Village of the Wind', sourceReference: 'https://www.piggyback.com/en/wp-content/uploads/sites/7/2020/04/SCII_E_SamplePages.pdf',
    sourceScene: 'Village of the Wind — moulin de Talim dans Soulcalibur II', continuity: 'Soulcalibur II',
    mechanism: 'village-of-wind-mill', color: '#c5b18c', periodSeconds: 24,
    sceneEvidence: 'The licensed Piggyback guide identifies Chapter 4-2 Windmill as the Village of the Wind stage. Rotating wooden sails drive the small hub gear; their timing and dimensions are authored, with no change to arena bounds.'
  }),
  scene({
    id: 'soul-calibur6-indian-port-moored-boats', universes: ['Soul Calibur'], scenePattern: /indian port|port indien|impending storm/i,
    excludedScenePattern: /soul.?calibur\s*(?:ii(?!i)|iii|iv|v(?!i)|[2345])\b|village.*wind/i,
    sourceWork: 'Soulcalibur VI — Indian Port: Impending Storm', sourceReference: 'https://www.bandainamcoent.com/games/soulcalibur-vi',
    sourceScene: 'Indian Port — Impending Storm de Soulcalibur VI, embarcations amarrées', continuity: 'Soulcalibur VI',
    mechanism: 'indian-port-moored-boats', color: '#b7b6a0', periodSeconds: 28,
    sceneEvidence: 'Indian Port is a coastal harbor stage with boats and moorings. Tethered hulls rock on the background water while their lines remain attached; no storm hazard or moving combat floor is introduced.'
  }),
  scene({
    id: 'nier-automata-amusement-carousel', universes: ['NieR'], scenePattern: /automata.*(?:amusement|parc)|amusement park|parc.*attraction/i,
    excludedScenePattern: /replicant|gestalt|seafront|fa[çc]ade|nier.*(?:2010|2011)/i,
    sourceWork: 'NieR:Automata (2017) — Amusement Park', sourceReference: 'https://nierautomata.square-enix-games.com/',
    sourceScene: 'NieR Automata — Amusement Park, manège circulaire des machines', continuity: 'NieR:Automata (2017)',
    mechanism: 'automata-amusement-carousel', color: '#c3b393', periodSeconds: 30,
    sceneEvidence: 'Automata’s amusement park contains mechanical rides and a carousel. Rotating seats, suspension rods and the canopy refer to that location, without summoning machine enemies or importing Replicant locations.'
  }),
  scene({
    id: 'nier-automata-abandoned-factory-conveyor', universes: ['NieR'], scenePattern: /automata.*(?:factory|usine)|(?:factory|usine).*automata/i,
    excludedScenePattern: /replicant|gestalt|seafront|fa[çc]ade|nier.*(?:2010|2011)/i,
    sourceWork: 'NieR:Automata (2017) — Abandoned Factory', sourceReference: 'https://nierautomata.square-enix-games.com/',
    sourceScene: 'NieR Automata — usine abandonnée, chaîne de production du plan arrière', continuity: 'NieR:Automata (2017)',
    mechanism: 'automata-factory-production-line', color: '#b6ac94', periodSeconds: 22,
    sceneEvidence: 'The abandoned factory contains industrial production lines and robotic machinery. Workpieces move beneath a synchronized mechanical arm on a distant belt, without spawning units or altering collision.'
  }),
  scene({
    id: 'dark-souls-firelink-parish-elevator', universes: ['Dark Souls'], scenePattern: /firelink.*(?:parish|elevator|lift)|lige.feu.*(?:paroisse|ascenseur)|undead parish.*(?:lift|elevator)/i,
    excludedScenePattern: /dark souls\s*(?:iii|ii|[23])\b|lothric|drangleic|majula|firelink.*2016/i,
    sourceWork: 'Dark Souls (2011) — Firelink Shrine / Undead Parish elevator', sourceReference: 'https://en.bandainamcoent.eu/dark-souls/dark-souls-remastered',
    sourceScene: 'Firelink Shrine de Dark Souls 2011 — ascenseur du raccourci vers Undead Parish', continuity: 'Dark Souls (2011), Lordran',
    mechanism: 'firelink-parish-elevator', color: '#b7b09c', periodSeconds: 33,
    sceneEvidence: 'The original Firelink Shrine connects to Undead Parish by paired elevators. Counterbalanced empty platforms move inside the distant stone shaft; no shortcut is unlocked and actors cannot ride them.'
  }),
  scene({
    id: 'dark-souls-anor-londo-rotating-staircase', universes: ['Dark Souls'], scenePattern: /anor londo.*(?:stair|escalier|rotat|tour)|(?:rotating staircase|escalier tournant).*anor londo/i,
    excludedScenePattern: /dark souls\s*(?:iii|ii|[23])\b|lothric|drangleic|majula|anor londo.*2016/i,
    sourceWork: 'Dark Souls (2011) — Anor Londo rotating staircase tower', sourceReference: 'https://en.bandainamcoent.eu/dark-souls/dark-souls-remastered',
    sourceScene: 'Anor Londo de Dark Souls 2011 — tour de l’escalier tournant', continuity: 'Dark Souls (2011), Lordran',
    mechanism: 'anor-londo-rotating-staircase', color: '#c4b69c', periodSeconds: 44,
    sceneEvidence: 'The Anor Londo tower changes the orientation and height of its spiral stairway. A small architectural model turns behind the arena; the playable topology and bridges never move.'
  }),
  scene({
    id: 'devil-may-cry3-temen-ni-gru-gears', universes: ['Devil May Cry'], scenePattern: /temen.?ni.?gru.*(?:gear|rouage|engrenage)|gears of madness/i,
    excludedScenePattern: /devil may cry\s*[1245]\b|dmc\s*[1245]\b|limbo city|red grave/i,
    sourceWork: 'Devil May Cry 3 (2005) — Temen-ni-gru, Gears of Madness', sourceReference: 'https://www.gamespot.com/articles/devil-may-cry-3-dantes-awakening-walkthrough/1100-6120168/',
    sourceScene: 'Temen-ni-gru — Gears of Madness de Devil May Cry 3, train d’engrenages', continuity: 'Devil May Cry 3 (2005)',
    mechanism: 'temen-ni-gru-gear-train', color: '#baa995', periodSeconds: 26,
    sceneEvidence: 'Gears of Madness is a mechanical room of Temen-ni-gru. Three different-size gears counter-rotate on the back wall, with no platform, trap, enemy or progression effect.'
  }),
  scene({
    id: 'devil-may-cry4-fortuna-gyro-blade', universes: ['Devil May Cry'], scenePattern: /fortuna.*gyro|gyro.?blade.*(?:fortuna|devil may cry 4|dmc4)/i,
    excludedScenePattern: /devil may cry\s*[1235]\b|dmc\s*[1235]\b|temen|limbo city|red grave/i,
    sourceWork: 'Devil May Cry 4 (2008) — Fortuna Gyro Blade mechanism', sourceReference: 'https://www.devilmaycry.com/',
    sourceScene: 'Fortuna — Gyro Blade de Devil May Cry 4 dans son support arrière', continuity: 'Devil May Cry 4 (2008)',
    mechanism: 'fortuna-gyro-blade', color: '#a5bec0', periodSeconds: 20,
    sceneEvidence: 'Nero activates Gyro Blades as rotating mechanical puzzle objects in Fortuna. This decorative specimen stays inside its background support: it never launches, cuts, collides or interacts with a character.'
  }),
  scene({
    id: 'ff8-balamb-garden-flight-ring', universes: ['Final Fantasy VIII'], scenePattern: /balamb.*(?:garden|fac|flight|vol)|(?:garden|fac).*balamb/i,
    excludedScenePattern: /galbadia|trabia|lunar base|base lunaire|final fantasy vii\b/i,
    sourceWork: 'Final Fantasy VIII (1999) — mobile Balamb Garden', sourceReference: 'https://ffviiiremastered.square-enix-games.com/',
    sourceScene: 'Balamb Garden — anneaux et stabilisateurs du Garden en vol', continuity: 'Final Fantasy VIII (1999)',
    mechanism: 'balamb-garden-flight-ring', color: '#b3c8c5', periodSeconds: 40,
    sceneEvidence: 'Balamb Garden becomes mobile after its MD-level systems activate. A distant architectural silhouette and rotating ring describe that mode; neither the scene camera nor any combat platform flies.'
  }),
  scene({
    id: 'ff8-d-district-prison-screw-tower', universes: ['Final Fantasy VIII'], scenePattern: /d.?district.*prison|prison.*d.?district|prison.*d[eé]sert.*ffviii/i,
    excludedScenePattern: /balamb|galbadia garden|final fantasy vii\b/i,
    sourceWork: 'Final Fantasy VIII (1999) — D-District Prison', sourceReference: 'https://ffviiiremastered.square-enix-games.com/',
    sourceScene: 'D-District Prison — tour à vis et niveaux du bloc cellulaire', continuity: 'Final Fantasy VIII (1999)',
    mechanism: 'd-district-prison-screw-tower', color: '#b9b39e', periodSeconds: 37,
    sceneEvidence: 'D-District Prison has cylindrical towers and a screw-like raising mechanism. Window bands orbit a distant tower while its base moves slightly on the helix; no cell, prisoner or gameplay floor moves.'
  })
]);

// Explicit universe reference scenes apply only without a caller-provided place.
// They do not assert that all existing mode backgrounds depict those locations.
export const WAVE_3_MODE_REFERENCE_SCENES = Object.freeze({
  'Metal Gear': { Combat: 'Shadow Moses heliport', Melee: 'Shadow Moses cargo dock elevator', RPG: 'Shadow Moses heliport', Tactics: 'Shadow Moses cargo dock elevator' },
  'Guilty Gear': { Combat: 'Zepp airship propellers', Melee: 'May Ship anchor winch', RPG: 'May Ship anchor winch', Tactics: 'Zepp airship propellers' },
  'Mass Effect': { Combat: 'Normandy SR1 galaxy map', Melee: 'Citadel Presidium skycars', RPG: 'Normandy SR1 galaxy map', Tactics: 'Citadel Presidium skycars' },
  'Dead Space': { Combat: 'Ishimura engineering centrifuge', Melee: 'Ishimura tram station', RPG: 'Ishimura tram station', Tactics: 'Ishimura engineering centrifuge' },
  'Metal Gear Rising': { Combat: 'World Marshal freight elevator', Melee: 'Abkhazia refinery compressor', RPG: 'World Marshal freight elevator', Tactics: 'Abkhazia refinery compressor' },
  Tekken: { Combat: 'Urban Square Tekken 8', Melee: 'Airport Tekken 4', RPG: 'Urban Square Tekken 8', Tactics: 'Airport Tekken 4' },
  Rayman: { Combat: 'Rayman 3 Hoodlum Headquarters', Melee: 'Rayman Legends 20 000 Lums Under the Sea', RPG: 'Rayman 3 Hoodlum Headquarters', Tactics: 'Rayman Legends 20 000 Lums Under the Sea' },
  'Soul Calibur': { Combat: 'Village of the Wind Soulcalibur II', Melee: 'Indian Port Impending Storm Soulcalibur VI', RPG: 'Village of the Wind Soulcalibur II', Tactics: 'Indian Port Impending Storm Soulcalibur VI' },
  NieR: { Combat: 'Automata Amusement Park', Melee: 'Automata abandoned factory', RPG: 'Automata Amusement Park', Tactics: 'Automata abandoned factory' },
  'Dark Souls': { Combat: 'Firelink Shrine parish elevator Dark Souls 2011', Melee: 'Anor Londo rotating staircase Dark Souls 2011', RPG: 'Firelink Shrine parish elevator Dark Souls 2011', Tactics: 'Anor Londo rotating staircase Dark Souls 2011' },
  'Devil May Cry': { Combat: 'Temen ni gru Gears of Madness DMC3', Melee: 'Fortuna Gyro Blade DMC4', RPG: 'Temen ni gru Gears of Madness DMC3', Tactics: 'Fortuna Gyro Blade DMC4' },
  'Final Fantasy VIII': { Combat: 'Balamb Garden flight ring', Melee: 'D-District Prison screw tower', RPG: 'Balamb Garden flight ring', Tactics: 'D-District Prison screw tower' }
});

const tau = Math.PI * 2;
const wrap = value => ((value % 1) + 1) % 1;
const line = (ctx, points) => { ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); };
const polygon = (ctx, points) => { ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill(); };
const ellipse = (ctx, x, y, rx, ry, fill = false) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, tau); if (fill) ctx.fill(); else ctx.stroke(); };
const gear = (ctx, x, y, radius, phase, teeth = 12) => {
  const points = Array.from({ length: teeth * 4 }, (_, i) => {
    const a = phase + i * tau / (teeth * 4), r = radius * (i % 4 === 0 || i % 4 === 3 ? 0.83 : 1);
    return [x + Math.cos(a) * r, y + Math.sin(a) * r];
  });
  line(ctx, [...points, points[0]]); ellipse(ctx, x, y, radius * 0.22, radius * 0.22);
  for (let arm = 0; arm < 4; arm++) { const a = phase + arm * tau / 4; line(ctx, [[x + Math.cos(a) * radius * 0.25, y + Math.sin(a) * radius * 0.25], [x + Math.cos(a) * radius * 0.75, y + Math.sin(a) * radius * 0.75]]); }
};

/** All moving components stay behind the caller's shared backdrop clip. */
export function drawStageAnimationWave3(ctx, animation, frame, width, height) {
  if (animation.animationWave !== 3) return false;
  const w = width, h = height, phase = frame.phase, p = frame.progress;
  ctx.globalAlpha = 0.13;
  switch (animation.mechanism) {
    case 'shadow-moses-heliport-searchlights':
      for (const [x, offset] of [[0.12, 0], [0.88, Math.PI]]) {
        ctx.globalAlpha = 0.13;
        line(ctx, [[w * x, h * 0.43], [w * x, h * 0.18]]);
        const tip = w * (x + Math.sin(phase + offset) * 0.05);
        ctx.strokeRect(tip - w * 0.008, h * 0.175, w * 0.016, h * 0.012);
        const target = w * (x + Math.sin(phase + offset) * 0.13);
        ctx.globalAlpha = 0.04;
        polygon(ctx, [[tip, h * 0.19], [target - w * 0.035, h * 0.47], [target + w * 0.035, h * 0.47]]);
        ctx.globalAlpha = 0.1; ellipse(ctx, target, h * 0.47, w * 0.035, h * 0.006);
      }
      break;
    case 'shadow-moses-cargo-lift': {
      const left = w * 0.08, right = w * 0.25, y = h * (0.31 + Math.cos(phase) * 0.09);
      for (const x of [left, right]) { ctx.strokeRect(x - w * 0.005, h * 0.13, w * 0.01, h * 0.38); line(ctx, [[x, h * 0.14], [x, y]]); }
      ctx.strokeRect(left, y, right - left, h * 0.02);
      for (let panel = 0; panel < 5; panel++) line(ctx, [[left + panel * w * 0.034, y], [left + panel * w * 0.034, y - h * 0.04]]);
      line(ctx, [[left, y - h * 0.04], [right, y - h * 0.04]]);
      for (const x of [left, right]) gear(ctx, x, h * 0.13, h * 0.017, -phase, 8);
      break;
    }
    case 'zepp-airship-propellers': {
      const cx = w * 0.73, cy = h * 0.22;
      polygon(ctx, [[cx - w * 0.11, cy], [cx - w * 0.06, cy - h * 0.035], [cx + w * 0.09, cy - h * 0.025], [cx + w * 0.12, cy], [cx + w * 0.06, cy + h * 0.025], [cx - w * 0.07, cy + h * 0.025]]);
      for (const side of [-1, 1]) {
        const x = cx + side * w * 0.08, y = cy + h * 0.045;
        ellipse(ctx, x, y, h * 0.022, h * 0.032);
        for (let blade = 0; blade < 3; blade++) {
          const a = phase * side + blade * tau / 3;
          line(ctx, [[x, y], [x + Math.cos(a) * h * 0.018, y + Math.sin(a) * h * 0.029]]);
        }
      }
      break;
    }
    case 'may-ship-anchor-winch': {
      const x = w * 0.16, y = h * 0.24, anchorY = h * (0.38 + Math.sin(phase) * 0.025);
      for (const side of [-1, 1]) { ellipse(ctx, x + side * w * 0.024, y, h * 0.016, h * 0.034); line(ctx, [[x + side * w * 0.024, y - h * 0.034], [x + side * w * 0.024, y + h * 0.034]]); }
      for (let coil = 0; coil < 5; coil++) line(ctx, [[x - w * 0.021 + coil * w * 0.01, y - h * 0.025], [x - w * 0.024 + wrap(p + coil / 5) * w * 0.048, y + h * 0.025]]);
      line(ctx, [[x, y], [x, anchorY]]); ellipse(ctx, x, anchorY, h * 0.006, h * 0.006);
      line(ctx, [[x, anchorY], [x, anchorY + h * 0.05]]);
      line(ctx, [[x - w * 0.025, anchorY + h * 0.025], [x - w * 0.018, anchorY + h * 0.047], [x, anchorY + h * 0.057], [x + w * 0.018, anchorY + h * 0.047], [x + w * 0.025, anchorY + h * 0.025]]);
      break;
    }
    case 'normandy-sr1-galaxy-map': {
      const cx = w * 0.79, cy = h * 0.32;
      ellipse(ctx, cx, h * 0.43, w * 0.07, h * 0.018); line(ctx, [[cx - w * 0.025, h * 0.43], [cx - w * 0.015, h * 0.48], [cx + w * 0.015, h * 0.48], [cx + w * 0.025, h * 0.43]]);
      for (let arm = 0; arm < 3; arm++) {
        const points = Array.from({ length: 11 }, (_, i) => { const r = i / 10, a = phase + arm * tau / 3 + r * 2; return [cx + Math.cos(a) * w * 0.078 * r, cy + Math.sin(a) * h * 0.037 * r]; });
        line(ctx, points);
        for (const index of [3, 6, 9]) ellipse(ctx, points[index][0], points[index][1], 1.5, 1.5, true);
      }
      ctx.globalAlpha = 0.045; polygon(ctx, [[cx - w * 0.025, h * 0.415], [cx + w * 0.025, h * 0.415], [cx + w * 0.07, cy], [cx - w * 0.07, cy]]);
      break;
    }
    case 'presidium-skycar-lanes':
      for (let lane = 0; lane < 2; lane++) {
        const y = h * (0.18 + lane * 0.105);
        ctx.globalAlpha = 0.045; line(ctx, [[0, y], [w * 0.35, y + h * 0.015], [w * 0.7, y + h * 0.015], [w, y]]);
        for (let car = 0; car < 3; car++) {
          const travel = wrap((lane ? -p : p) + car / 3), x = travel * w;
          ctx.globalAlpha = 0.12;
          polygon(ctx, [[x - w * 0.018, y], [x - w * 0.011, y - h * 0.009], [x + w * 0.01, y - h * 0.009], [x + w * 0.02, y], [x + w * 0.012, y + h * 0.005], [x - w * 0.012, y + h * 0.005]]);
          line(ctx, [[x - w * 0.009, y - h * 0.006], [x + w * 0.008, y - h * 0.006]]);
        }
      }
      break;
    case 'ishimura-engineering-centrifuge': {
      const cx = w * 0.77, cy = h * 0.35;
      ellipse(ctx, cx, cy, w * 0.095, h * 0.054); ellipse(ctx, cx, cy, w * 0.028, h * 0.018);
      for (let arm = 0; arm < 3; arm++) {
        const a = phase + arm * tau / 3, endX = cx + Math.cos(a) * w * 0.084, endY = cy + Math.sin(a) * h * 0.046;
        line(ctx, [[cx, cy], [endX, endY]]); ctx.strokeRect(endX - w * 0.012, endY - h * 0.011, w * 0.024, h * 0.022);
      }
      for (const x of [0.68, 0.86]) line(ctx, [[w * x, cy], [w * x, h * 0.48]]);
      break;
    }
    case 'ishimura-tram-coupling': {
      const cx = w * 0.19, depth = (1 - Math.cos(phase)) / 2, spread = w * (0.025 + depth * 0.025), y = h * (0.23 + depth * 0.12);
      line(ctx, [[cx - w * 0.085, h * 0.49], [cx - w * 0.015, h * 0.2], [cx + w * 0.015, h * 0.2], [cx + w * 0.085, h * 0.49]]);
      ctx.strokeRect(cx - spread, y - h * 0.035, spread * 2, h * (0.05 + depth * 0.04));
      ctx.strokeRect(cx - spread * 0.7, y - h * 0.025, spread * 1.4, h * 0.025);
      for (const side of [-1, 1]) {
        const pivotX = cx + side * w * 0.09, pivotY = h * 0.37, reach = depth * w * 0.035;
        ellipse(ctx, pivotX, pivotY, 3, 3); line(ctx, [[pivotX, pivotY], [pivotX - side * (w * 0.025 + reach), pivotY - h * 0.025], [cx + side * (spread + w * 0.007), y + h * 0.035]]);
      }
      break;
    }
    case 'world-marshal-freight-lift': {
      const left = w * 0.7, right = w * 0.91, y = h * (0.28 + Math.sin(phase) * 0.085), counterY = h * (0.28 - Math.sin(phase) * 0.085);
      for (const x of [left, right]) line(ctx, [[x, h * 0.12], [x, h * 0.51]]);
      ctx.strokeRect(left, y, right - left, h * 0.075);
      for (let slat = 0; slat < 5; slat++) line(ctx, [[left + slat * w * 0.042, y], [left + slat * w * 0.042, y + h * 0.075]]);
      line(ctx, [[left + w * 0.025, y], [left + w * 0.025, h * 0.13], [right + w * 0.024, h * 0.13], [right + w * 0.024, counterY]]);
      ctx.strokeRect(right + w * 0.014, counterY, w * 0.02, h * 0.065);
      break;
    }
    case 'abkhazia-refinery-compressor':
      for (let piston = 0; piston < 3; piston++) {
        const x = w * (0.1 + piston * 0.055), y = h * 0.37, a = phase + piston * tau / 3;
        gear(ctx, x, y, h * 0.022, a, 8);
        const crank = [x + Math.cos(a) * h * 0.015, y + Math.sin(a) * h * 0.015];
        const headY = h * 0.26 + Math.sin(a) * h * 0.022;
        line(ctx, [crank, [x, headY]]); ctx.strokeRect(x - w * 0.01, headY - h * 0.012, w * 0.02, h * 0.024);
        ctx.strokeRect(x - w * 0.014, h * 0.2, w * 0.028, h * 0.11);
        line(ctx, [[x, h * 0.2], [x, h * 0.17], [w * 0.3, h * 0.17]]);
      }
      break;
    case 'urban-square-taxi-traffic': {
      const x = w * (-0.1 + p * 1.2), y = h * 0.32;
      polygon(ctx, [[x, y], [x + w * 0.022, y], [x + w * 0.035, y - h * 0.02], [x + w * 0.075, y - h * 0.02], [x + w * 0.09, y], [x + w * 0.11, y], [x + w * 0.11, y + h * 0.02], [x, y + h * 0.02]]);
      for (const dx of [0.025, 0.085]) gear(ctx, x + w * dx, y + h * 0.022, h * 0.012, phase * 4, 6);
      ctx.strokeRect(x + w * 0.047, y - h * 0.028, w * 0.016, h * 0.006);
      ctx.globalAlpha = 0.075;
      for (let post = 0; post < 9; post++) line(ctx, [[w * (0.05 + post * 0.112), h * 0.37], [w * (0.05 + post * 0.112), h * 0.43]]);
      line(ctx, [[0, h * 0.385], [w, h * 0.385]]);
      break;
    }
    case 'airport-parked-airliner-turbine': {
      const x = w * 0.68, y = h * 0.26;
      polygon(ctx, [[x, y], [x + w * 0.18, y], [x + w * 0.21, y + h * 0.015], [x + w * 0.17, y + h * 0.025], [x + w * 0.02, y + h * 0.025], [x, y + h * 0.012]]);
      polygon(ctx, [[x + w * 0.02, y], [x + w * 0.012, y - h * 0.045], [x + w * 0.035, y - h * 0.045], [x + w * 0.05, y]]);
      line(ctx, [[x + w * 0.09, y + h * 0.012], [x + w * 0.13, y + h * 0.055], [x + w * 0.165, y + h * 0.055], [x + w * 0.13, y + h * 0.012]]);
      for (let window = 0; window < 12; window++) ctx.fillRect(x + w * (0.035 + window * 0.011), y + h * 0.006, 2, 2);
      gear(ctx, x + w * 0.13, y + h * 0.045, h * 0.014, phase * 3, 8);
      for (const dx of [0.045, 0.165]) ellipse(ctx, x + w * dx, y + h * 0.032, h * 0.006, h * 0.006, true);
      break;
    }
    case 'hoodlum-headquarters-conveyor': {
      const left = w * 0.08, right = w * 0.3, top = h * 0.2, bottom = h * 0.45;
      for (const y of [top, bottom]) { line(ctx, [[left, y], [right, y]]); gear(ctx, left, y, h * 0.022, phase, 8); gear(ctx, right, y, h * 0.022, phase, 8); }
      for (let crate = 0; crate < 4; crate++) {
        const travel = wrap(p + crate / 4);
        const x = travel < 0.35 ? left + travel / 0.35 * (right - left) : travel < 0.5 ? right : travel < 0.85 ? right - (travel - 0.5) / 0.35 * (right - left) : left;
        const y = travel < 0.35 ? top : travel < 0.5 ? top + (travel - 0.35) / 0.15 * (bottom - top) : travel < 0.85 ? bottom : bottom - (travel - 0.85) / 0.15 * (bottom - top);
        ctx.strokeRect(x - w * 0.011, y - h * 0.031, w * 0.022, h * 0.03);
        line(ctx, [[x - w * 0.011, y - h * 0.031], [x + w * 0.011, y - h * 0.001]]);
      }
      for (const x of [left, right]) line(ctx, [[x, top], [x, bottom]]);
      line(ctx, [[left - w * 0.025, top], [left - w * 0.025, bottom], [right + w * 0.025, bottom], [right + w * 0.025, top]]);
      break;
    }
    case 'undersea-security-scanner': {
      const cx = w * 0.82, cy = h * 0.3;
      ellipse(ctx, cx, cy, w * 0.065, h * 0.1);
      for (let bolt = 0; bolt < 8; bolt++) { const a = bolt * tau / 8; ctx.fillRect(cx + Math.cos(a) * w * 0.07, cy + Math.sin(a) * h * 0.108, 2, 2); }
      const a = Math.sin(phase) * 0.75, tip = [cx + Math.sin(a) * w * 0.055, cy + Math.cos(a) * h * 0.085];
      ctx.strokeRect(cx - w * 0.008, cy - h * 0.035, w * 0.016, h * 0.025);
      ctx.globalAlpha = 0.045; polygon(ctx, [[cx, cy - h * 0.01], [tip[0] - w * 0.018, tip[1]], [tip[0] + w * 0.018, tip[1]]]);
      ctx.globalAlpha = 0.12; line(ctx, [[cx, cy - h * 0.01], tip]);
      break;
    }
    case 'village-of-wind-mill': {
      const cx = w * 0.8, cy = h * 0.27, radius = h * 0.09;
      line(ctx, [[cx - w * 0.035, h * 0.48], [cx - w * 0.02, h * 0.2], [cx + w * 0.02, h * 0.2], [cx + w * 0.035, h * 0.48]]);
      polygon(ctx, [[cx - w * 0.03, h * 0.2], [cx, h * 0.14], [cx + w * 0.03, h * 0.2]]);
      for (let sail = 0; sail < 4; sail++) {
        const a = phase + sail * tau / 4;
        const tip = [cx + Math.cos(a) * radius, cy + Math.sin(a) * radius];
        const root = [cx + Math.cos(a) * radius * 0.3, cy + Math.sin(a) * radius * 0.3];
        line(ctx, [[cx, cy], tip]);
        polygon(ctx, [root, tip, [tip[0] - Math.sin(a) * h * 0.014, tip[1] + Math.cos(a) * h * 0.014], [root[0] - Math.sin(a) * h * 0.014, root[1] + Math.cos(a) * h * 0.014]]);
      }
      gear(ctx, cx, cy, h * 0.014, phase, 8);
      break;
    }
    case 'indian-port-moored-boats':
      for (const [x, y, offset] of [[0.11, 0.37, 0], [0.26, 0.42, 1.4]]) {
        const bob = Math.sin(phase + offset) * h * 0.006, tilt = Math.sin(phase + offset) * h * 0.003;
        polygon(ctx, [[w * (x - 0.035), h * y + bob - tilt], [w * (x + 0.035), h * y + bob + tilt], [w * (x + 0.02), h * y + bob + h * 0.018], [w * (x - 0.019), h * y + bob + h * 0.018]]);
        line(ctx, [[w * x, h * y + bob], [w * x, h * (y - 0.1) + bob]]);
        line(ctx, [[w * (x - 0.035), h * y + bob - tilt], [w * (x - 0.058), h * (y - 0.03)], [w * (x - 0.058), h * (y + 0.03)]]);
        line(ctx, [[w * (x + 0.035), h * y + bob + tilt], [w * (x + 0.06), h * (y - 0.02)], [w * (x + 0.06), h * (y + 0.025)]]);
      }
      break;
    case 'automata-amusement-carousel': {
      const cx = w * 0.78, cy = h * 0.24, rx = w * 0.085;
      ellipse(ctx, cx, cy, rx, h * 0.018); polygon(ctx, [[cx - rx, cy], [cx, cy - h * 0.08], [cx + rx, cy]]);
      for (let seat = 0; seat < 8; seat++) {
        const a = phase + seat * tau / 8, x = cx + Math.cos(a) * rx * 0.87, y = h * (0.385 + Math.sin(a) * 0.025);
        ctx.globalAlpha = 0.07 + (1 + Math.sin(a)) * 0.03;
        line(ctx, [[x, cy + Math.sin(a) * h * 0.016], [x, y]]);
        ellipse(ctx, x, y, w * 0.013, h * 0.009);
        ctx.strokeRect(x - w * 0.009, y - h * 0.015, w * 0.018, h * 0.011);
      }
      ctx.globalAlpha = 0.13; ellipse(ctx, cx, h * 0.435, rx, h * 0.02);
      break;
    }
    case 'automata-factory-production-line': {
      const left = w * 0.09, right = w * 0.32, y = h * 0.4;
      ctx.strokeRect(left, y, right - left, h * 0.025);
      for (let part = 0; part < 5; part++) { const x = left + wrap(p + part / 5) * (right - left); ctx.strokeRect(x, y - h * 0.021, w * 0.018, h * 0.02); }
      const pivot = [w * 0.2, h * 0.19], elbow = [w * (0.2 + Math.sin(phase) * 0.035), h * 0.27], hand = [w * (0.23 + Math.sin(phase) * 0.022), h * (0.34 + Math.cos(phase) * 0.015)];
      line(ctx, [pivot, elbow, hand]); ellipse(ctx, pivot[0], pivot[1], 4, 4); ellipse(ctx, elbow[0], elbow[1], 3, 3);
      line(ctx, [[hand[0] - w * 0.007, hand[1] + h * 0.015], [hand[0] - w * 0.007, hand[1]], [hand[0] + w * 0.007, hand[1]], [hand[0] + w * 0.007, hand[1] + h * 0.015]]);
      break;
    }
    case 'firelink-parish-elevator': {
      const left = w * 0.09, top = h * 0.15, bottom = h * 0.48;
      for (let shaft = 0; shaft < 2; shaft++) {
        const x = left + shaft * w * 0.083, y = h * (0.32 + Math.sin(phase + shaft * Math.PI) * 0.105);
        ctx.strokeRect(x, top, w * 0.065, bottom - top);
        ctx.strokeRect(x + w * 0.007, y, w * 0.051, h * 0.016);
        for (const side of [0.012, 0.053]) line(ctx, [[x + w * side, top], [x + w * side, y]]);
        line(ctx, [[x + w * 0.007, y - h * 0.055], [x + w * 0.007, y], [x + w * 0.058, y], [x + w * 0.058, y - h * 0.055]]);
      }
      break;
    }
    case 'anor-londo-rotating-staircase': {
      const cx = w * 0.78, cy = h * 0.35;
      ctx.strokeRect(cx - w * 0.012, h * 0.18, w * 0.024, h * 0.29);
      for (let step = 0; step < 20; step++) {
        const a = phase + step * tau / 20, y = cy - step * h * 0.006;
        const inner = [cx + Math.cos(a) * w * 0.014, y + Math.sin(a) * h * 0.007], outer = [cx + Math.cos(a) * w * 0.075, y + Math.sin(a) * h * 0.029];
        line(ctx, [inner, outer]); line(ctx, [outer, [outer[0], outer[1] - h * 0.019]]);
      }
      for (const side of [-1, 1]) {
        const a = phase + (side < 0 ? Math.PI : 0);
        line(ctx, [[cx, cy], [cx + Math.cos(a) * w * 0.11, cy + Math.sin(a) * h * 0.035]]);
      }
      break;
    }
    case 'temen-ni-gru-gear-train': {
      const cx = w * 0.2, cy = h * 0.32;
      // 7/10/14 complete turns make the 20/14/10-tooth train mesh and
      // return every spoke to its starting orientation at the loop boundary.
      gear(ctx, cx, cy, h * 0.065, phase * 7, 20);
      gear(ctx, cx + h * 0.102, cy - h * 0.035, h * 0.0455, -phase * 10, 14);
      gear(ctx, cx - h * 0.089, cy + h * 0.02, h * 0.0325, -phase * 14, 10);
      line(ctx, [[cx, cy - h * 0.08], [cx, h * 0.14]]);
      break;
    }
    case 'fortuna-gyro-blade': {
      const cx = w * 0.81, cy = h * 0.32;
      ctx.strokeRect(cx - w * 0.055, h * 0.2, w * 0.11, h * 0.25);
      ellipse(ctx, cx, cy, h * 0.047, h * 0.047); ellipse(ctx, cx, cy, h * 0.019, h * 0.019);
      for (let blade = 0; blade < 6; blade++) {
        const a = phase + blade * tau / 6;
        polygon(ctx, [[cx + Math.cos(a) * h * 0.02, cy + Math.sin(a) * h * 0.02], [cx + Math.cos(a + 0.3) * h * 0.043, cy + Math.sin(a + 0.3) * h * 0.043], [cx + Math.cos(a + 0.6) * h * 0.031, cy + Math.sin(a + 0.6) * h * 0.031]]);
      }
      line(ctx, [[cx - w * 0.055, h * 0.425], [cx + w * 0.055, h * 0.425]]);
      break;
    }
    case 'balamb-garden-flight-ring': {
      const cx = w * 0.79, cy = h * 0.29;
      polygon(ctx, [[cx - w * 0.045, cy], [cx - w * 0.02, cy - h * 0.07], [cx, cy - h * 0.11], [cx + w * 0.02, cy - h * 0.07], [cx + w * 0.045, cy], [cx, cy + h * 0.035]]);
      for (let ring = 0; ring < 2; ring++) {
        const rx = w * (0.074 + ring * 0.022), ry = h * (0.025 + ring * 0.012);
        ellipse(ctx, cx, cy + ring * h * 0.024, rx, ry);
        for (let fin = 0; fin < 3; fin++) {
          const a = phase * (ring ? -1 : 1) + fin * tau / 3, x = cx + Math.cos(a) * rx, y = cy + ring * h * 0.024 + Math.sin(a) * ry;
          polygon(ctx, [[x, y], [x + Math.cos(a) * w * 0.02, y + Math.sin(a) * h * 0.015], [x - Math.sin(a) * w * 0.008, y + Math.cos(a) * h * 0.012]]);
        }
      }
      break;
    }
    case 'd-district-prison-screw-tower': {
      const cx = w * 0.19, top = h * (0.18 + Math.sin(phase) * 0.012), rx = w * 0.05;
      ellipse(ctx, cx, top, rx, h * 0.017); ellipse(ctx, cx, top + h * 0.25, rx, h * 0.017);
      for (const side of [-1, 1]) line(ctx, [[cx + side * rx, top], [cx + side * rx, top + h * 0.25]]);
      for (let floor = 0; floor < 5; floor++) {
        const y = top + h * (0.025 + floor * 0.045);
        ellipse(ctx, cx, y, rx, h * 0.014);
        for (let cell = 0; cell < 6; cell++) {
          const a = phase + cell * tau / 6;
          if (Math.sin(a) < 0) continue;
          const x = cx + Math.cos(a) * rx * 0.92;
          ctx.strokeRect(x - w * 0.003, y + Math.sin(a) * h * 0.013, w * 0.006, h * 0.012);
        }
      }
      line(ctx, Array.from({ length: 45 }, (_, i) => { const a = phase + i * tau / 12; return [cx + Math.cos(a) * rx * 0.5, top + h * 0.2 + i * h * 0.002]; }));
      break;
    }
    default: return false;
  }
  return true;
}
