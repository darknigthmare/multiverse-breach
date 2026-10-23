// Scene-specific decorative mechanisms. Source references identify the work and
// location; geometry, timing and motion are authored adaptations, never ripped
// source frames. Existing backdrop regions remain still-image compositing.
const scene = definition => Object.freeze({
  ...definition,
  animationProvenance: 'authored-scene-geometry-and-timing',
  timeSource: 'simulation-elapsed-seconds',
  reducedMotionBehavior: 'freeze-at-time-zero',
  sourceVisualValidation: 'not-validated-1:1',
  gameplayEffect: 'none',
  renderingKind: definition.localBackdrops ? 'static-backdrop-compositing-and-authored-mechanism' : 'authored-mechanism'
});
const patch = (path, x, y, width, height) => Object.freeze({ path, region: Object.freeze({ x, y, width, height }), motion: 'glow' });

export const STAGE_ANIMATION_WAVE_2 = Object.freeze([
  scene({
    id: 'resident-evil-rpd-reception-console', universes: ['Resident Evil'], scenePattern: /rpd.*(?:hall|r[eé]ception)|(?:hall|r[eé]ception).*rpd|police.*main hall/i,
    sourceWork: 'Resident Evil 2 — Raccoon Police Department', sourceReference: 'https://www.residentevil.com/re2/',
    sourceScene: 'RPD — hall principal, terminal du bureau de réception', mechanism: 'rpd-reception-console', color: '#adbaa6', periodSeconds: 14,
    sceneEvidence: 'The reception desk and computer sit inside the RPD main hall; the decorative display refresh is authored, not an extracted game animation.'
  }),
  scene({
    id: 'resident-evil-spencer-dining-clock', universes: ['Resident Evil'], scenePattern: /spencer.*(?:dining|salle.*manger|horloge)|dining.*(?:clock|manor)|salle.*manger.*spencer/i,
    sourceWork: 'Resident Evil (1996) — Spencer Mansion dining room', sourceReference: 'https://game.capcom.com/residentevil/en/',
    sourceScene: 'Manoir Spencer — salle à manger, pendule de la grande horloge', mechanism: 'spencer-dining-clock', color: '#c3ac83', periodSeconds: 12,
    sceneEvidence: 'The dining-room grandfather clock is a mansion puzzle prop. Its unlabelled hands stay fixed as authored composition, not a verified puzzle solution; only its pendulum moves without changing game state.'
  }),
  scene({
    id: 'half-life-sector-c-spectrometer-rotor', universes: ['Half-Life'], scenePattern: /sector.?c|secteur.?c|test chamber|chambre.*(?:test|essai)|spectrom[eè]tre|spectrometer|resonance cascade/i,
    sourceWork: 'Half-Life (1998) — Sector C anti-mass spectrometer', sourceReference: 'https://store.steampowered.com/app/70/HalfLife/',
    sourceScene: 'Black Mesa — chambre d’essai du secteur C, rotor du spectromètre', mechanism: 'black-mesa-spectrometer-rotor', color: '#b5bea4', periodSeconds: 18,
    sceneEvidence: 'The anti-mass spectrometer has a rotating mechanical assembly in the test chamber. This loop shows its machinery, with no resonance beam, Xen aperture or attack.'
  }),
  scene({
    id: 'half-life-black-mesa-transit-tram', universes: ['Half-Life'], scenePattern: /black mesa.*(?:tram|transit)|tram.*black mesa|inbound/i,
    sourceWork: 'Half-Life (1998) — Black Mesa Inbound', sourceReference: 'https://store.steampowered.com/app/70/HalfLife/',
    sourceScene: 'Black Mesa — voie de transit, wagon du tram sur le rail éloigné', mechanism: 'black-mesa-transit-tram', color: '#b4aa85', periodSeconds: 45,
    sceneEvidence: 'The opening tram travels through Black Mesa; the distant car follows a fixed backdrop rail and never becomes a platform or collider.'
  }),
  scene({
    id: 'bioshock-bathysphere-pressure-winch', universes: ['BioShock'], scenePattern: /bathysph[eè]re|bathysphere|rapture.*(?:arrival|arriv[eé]e|station)/i,
    sourceWork: 'BioShock (2007) — Rapture bathysphere station', sourceReference: 'https://bioshock.2k.com/',
    sourceScene: 'Rapture — station de bathysphère, treuil et aiguille de pression', mechanism: 'rapture-bathysphere-winch', color: '#8fc1bd', periodSeconds: 28,
    sceneEvidence: 'Bathyspheres connect stations in Rapture. The cable, winch and pressure gauge are a decorative mechanical interpretation; no transport or pressure damage is simulated.'
  }),
  scene({
    id: 'bioshock-hephaestus-core-regulators', universes: ['BioShock'], scenePattern: /hephaestus|h[eé]pha[iï]stos|rapture.*(?:power core|c[oœ]ur.*[eé]nergie)/i,
    sourceWork: 'BioShock (2007) — Hephaestus Core', sourceReference: 'https://bioshock.2k.com/',
    sourceScene: 'Hephaestus — régulateurs mécaniques du cœur énergétique de Rapture', mechanism: 'hephaestus-core-regulators', color: '#c89b65', periodSeconds: 20,
    sceneEvidence: 'Hephaestus contains Rapture’s power core and industrial machinery. The regulator cycle is authored from that function, not a claimed exact original machine cycle.'
  }),
  scene({
    id: 'silent-hill-toluca-rowboat-wake', universes: ['Silent Hill'], scenePattern: /toluca.*(?:lake|lac|boat|barque|rive)|(?:lac|lake).*toluca/i,
    sourceWork: 'Silent Hill 2 — Toluca Lake crossing', sourceReference: 'https://www.konami.com/games/silenthill/2r/',
    sourceScene: 'Lac Toluca — barque de la traversée et sillage lointain', mechanism: 'toluca-rowboat-wake', color: '#afbcb4', periodSeconds: 36,
    sceneEvidence: 'James crosses Toluca Lake by rowing boat. The small distant hull and directional wake refer to that crossing, not a generic fog animation.'
  }),
  scene({
    id: 'silent-hill-lakeside-carousel', universes: ['Silent Hill'], scenePattern: /lakeside|amusement.*park|parc.*attraction|carrousel.*silent/i,
    sourceWork: 'Silent Hill 3 — Lakeside Amusement Park carousel', sourceReference: 'https://www.konami.com/games/silenthill/',
    sourceScene: 'Lakeside Amusement Park — rotation du carrousel au plan éloigné', mechanism: 'lakeside-carousel', color: '#b8a38e', periodSeconds: 32,
    sceneEvidence: 'The carousel is a location in Silent Hill 3. Only a distant canopy, poles and moving horse silhouettes are drawn; no boss, damage or combat trigger is added.'
  }),
  scene({
    id: 'alien-nostromo-mother-relay-panels', universes: ['Alien'], scenePattern: /mu.?th.?ur|mother|maman|nostromo.*(?:terminal|ordinateur|relay|relais)/i,
    sourceWork: 'Alien (1979) — Nostromo MU/TH/UR 6000 room', sourceReference: 'https://www.20thcenturystudios.com/movies/alien',
    sourceScene: 'Nostromo — salle MU/TH/UR, séquence des panneaux de relais', mechanism: 'nostromo-mother-relays', color: '#d0c6a6', periodSeconds: 16,
    sceneEvidence: 'The MU/TH/UR room is lined with illuminated relay panels. The authored sequence uses those panels rather than Matrix code or a hologram from another continuity.'
  }),
  scene({
    id: 'alien-nostromo-airlock-pressure-cycle', universes: ['Alien'], scenePattern: /nostromo.*(?:airlock|sas|coursive|conduit)|(?:airlock|sas).*nostromo/i,
    sourceWork: 'Alien (1979) — Nostromo airlock machinery', sourceReference: 'https://www.20thcenturystudios.com/movies/alien',
    sourceScene: 'Nostromo — sas technique, vérins de porte et indicateur de pression', mechanism: 'nostromo-airlock-pistons', color: '#a7beba', periodSeconds: 24,
    sceneEvidence: 'Alien uses mechanical airlocks and retro control hardware. A sealed background door and its piston cycle are decorative; they do not open a route or affect oxygen.'
  }),
  scene({
    id: 'predator-jungle-waterfall-vines', universes: ['Predator'], scenePattern: /(?:jungle|dutch).*(?:waterfall|cascade)|(?:waterfall|cascade).*dutch/i,
    sourceWork: 'Predator (1987) — jungle waterfall escape', sourceReference: 'https://www.20thcenturystudios.com/movies/predator',
    sourceScene: 'Jungle de Dutch — cascade de la fuite, rideau d’eau et lianes', mechanism: 'dutch-waterfall-vines', color: '#9ac2ad', periodSeconds: 10,
    sceneEvidence: 'Dutch reaches the waterfall during his escape. Water streaks descend within a narrow fall while nearby vines sway; no Yautja energy, Maya portal or creature is invented.'
  }),
  scene({
    id: 'predator-dutch-counterweight-ropes', universes: ['Predator'], scenePattern: /dutch.*(?:trap|pi[eè]ge|pr[eé]paration|counterweight|contrepoids)|(?:trap|pi[eè]ge).*dutch/i,
    sourceWork: 'Predator (1987) — Dutch’s trap preparation', sourceReference: 'https://www.20thcenturystudios.com/movies/predator',
    sourceScene: 'Jungle de Dutch — préparation des cordages et du contrepoids suspendu', mechanism: 'dutch-counterweight-ropes', color: '#acac83', periodSeconds: 15,
    sceneEvidence: 'Dutch rigs rope-and-log traps during his preparation montage. This distant counterweight only sways while suspended: it never releases, strikes or becomes a stage hazard.'
  }),
  scene({
    id: 'terminator-2029-hk-searchlight', universes: ['Terminator'], scenePattern: /2029|future war|guerre.*futur|r[eé]sistance.*ruin|ruin.*r[eé]sistance/i,
    sourceWork: 'The Terminator (1984) — Los Angeles 2029 Future War', sourceReference: 'https://www.mgm.com/movies/the-terminator',
    sourceScene: 'Los Angeles 2029 — projecteur du HK aérien derrière les ruines', mechanism: 'future-war-hk-searchlight', color: '#a7b6ce', periodSeconds: 25,
    sceneEvidence: 'The Future War depicts aerial Hunter-Killers sweeping the ruins. The beam scans a backdrop wall only; it has no detection, target lock, weapon fire or damage.'
  }),
  scene({
    id: 'terminator-factory-hydraulic-press', universes: ['Terminator'], scenePattern: /(?:factory|usine).*(?:press|presse)|(?:press|presse).*hydraul/i,
    sourceWork: 'The Terminator (1984) — automated factory finale', sourceReference: 'https://www.mgm.com/movies/the-terminator',
    sourceScene: 'Usine automatisée — vérins de la presse hydraulique du plan arrière', mechanism: 'factory-hydraulic-press', color: '#a9b3af', periodSeconds: 22,
    sceneEvidence: 'The finale takes place around an automated hydraulic press. Only a distant empty machine moves within its housing; the playable floor and actors are unaffected.'
  }),
  scene({
    id: 'sonic-green-hill-sunflowers', universes: ['Sonic'], scenePattern: /green hill|colline.*verte/i,
    sourceWork: 'Sonic the Hedgehog (1991) — Green Hill Zone', sourceReference: 'https://sonic.sega.jp/SonicChannel/gametitle/SonicTheHedgehog.html',
    sourceScene: 'Green Hill Zone — tournesols animés et palmes au bord du lagon', mechanism: 'green-hill-sunflowers', color: '#bdd07e', periodSeconds: 12,
    sceneEvidence: 'Green Hill has animated flowers, palms, checkerboard terrain and water. The flower heads rotate beside segmented palms; no rings, springs or collision objects are spawned.'
  }),
  scene({
    id: 'sonic-scrap-brain-conveyor-gears', universes: ['Sonic'], scenePattern: /scrap brain|cerveau.*ferraille/i,
    sourceWork: 'Sonic the Hedgehog (1991) — Scrap Brain Zone', sourceReference: 'https://sonic.sega.jp/SonicChannel/gametitle/SonicTheHedgehog.html',
    sourceScene: 'Scrap Brain Zone — engrenages et bande transporteuse derrière la grille', mechanism: 'scrap-brain-conveyor-gears', color: '#b7ad90', periodSeconds: 16,
    sceneEvidence: 'Scrap Brain is an industrial zone with conveyor machinery. The decorative belt is behind a fixed grille and cannot move actors or add an obstacle.'
  }),
  scene({
    id: 'back-future-1955-clocktower-escapement', universes: ['Back to the Future'], scenePattern: /1955.*(?:horloge|clock|courthouse)|(?:horloge|clock).*1955.*(?:avant|before)/i,
    excludedScenePattern: /1985|stopped|arr[eê]t[eé]|apr[eè]s.*(?:foudre|strike)|after.*(?:lightning|strike)/i,
    sourceWork: 'Back to the Future (1985) — Hill Valley clock tower in 1955 before the strike', sourceReference: 'https://www.backtothefuture.com/movies/backtothefuture1',
    sourceScene: 'Hill Valley 1955 — engrenages de l’horloge avant la foudre de 22 h 04', mechanism: 'hill-valley-clock-escapement', color: '#c4b38c', periodSeconds: 20,
    sceneEvidence: 'The tower works before the 1955 lightning strike and remains stopped afterwards. The selected hands stay at 10:03 while the pre-strike escapement moves; a concrete post-strike or 1985 stopped-clock scene never selects this mechanism.'
  }),
  scene({
    id: 'back-future-doc-garage-flux-capacitor', universes: ['Back to the Future'], scenePattern: /doc.*(?:garage|atelier)|(?:garage|atelier).*doc|flux capacitor|convecteur.*temporel|twin pines.*(?:circuit|delorean)/i,
    sourceWork: 'Back to the Future (1985) — Doc Brown’s garage and DeLorean time circuits', sourceReference: 'https://www.backtothefuture.com/movies/backtothefuture1',
    sourceScene: 'Atelier de Doc — trois branches lumineuses du convecteur temporel', mechanism: 'doc-flux-capacitor', color: '#b1c9d7', periodSeconds: 9,
    sceneEvidence: 'The flux capacitor is the Y-shaped illuminated component of Doc’s time machine. This background workbench view animates its three branches without a portal, car movement or time travel.'
  }),
  scene({
    id: 'dino-crisis-ibis-reactor-regulation', universes: ['Dino Crisis'], scenePattern: /third energy|troisi[eè]me.*[eé]nergie|ibis.*(?:reactor|r[eé]acteur)/i,
    sourceWork: 'Dino Crisis (1999) — Ibis Island Third Energy reactor', sourceReference: 'https://www.capcom-games.com/product/en-us/dinocrisis/',
    sourceScene: 'Île Ibis — chambre du réacteur Third Energy, bagues de régulation', mechanism: 'third-energy-reactor-regulation', color: '#a1bdc6', periodSeconds: 19,
    sceneEvidence: 'The Ibis facility houses the Third Energy reactor. The contained hardware and regulator lamps cycle only; no time vortex, dinosaur spawn or discharge is added.'
  }),
  scene({
    id: 'dino-crisis-ibis-perimeter-beacons', universes: ['Dino Crisis'], scenePattern: /ibis.*(?:perimeter|p[eé]rim[eè]tre|gate|entr[eé]e|ext[eé]rieur)|(?:perimeter|p[eé]rim[eè]tre).*ibis/i,
    sourceWork: 'Dino Crisis (1999) — Ibis Island facility perimeter', sourceReference: 'https://www.capcom-games.com/product/en-us/dinocrisis/',
    sourceScene: 'Île Ibis — périmètre du complexe, gyrophares des postes de contrôle', mechanism: 'ibis-perimeter-beacons', color: '#c69b86', periodSeconds: 8,
    sceneEvidence: 'The local Ibis exterior backdrop has red checkpoint lamps. Their rotating reflectors are an authored animation of those fixtures, without activating the depicted fence as a gameplay hazard.',
    localBackdrops: { Melee: patch('/backgrounds/dino-crisis-smash-openai.png', 0.17, 0.12, 0.04, 0.07) }, sourceSceneStatus: 'source-location-with-project-backdrop-fixtures'
  }),
  scene({
    id: 'aliens-hadleys-hope-operations-display', universes: ['Aliens'], scenePattern: /hadley.*(?:operation|op[eé]ration)|operations.*hadley|colony.*command/i,
    sourceWork: 'Aliens (1986) — Hadley’s Hope operations room', sourceReference: 'https://www.20thcenturystudios.com/movies/aliens',
    sourceScene: 'Hadley’s Hope — salle des opérations, affichage tactique de la colonie', mechanism: 'hadleys-hope-operations-display', color: '#a3c8aa', periodSeconds: 14,
    sceneEvidence: 'The Marines coordinate from the colony operations room and consult tactical information. The display is a fixed scene prop, not an enemy detector connected to game entities.'
  }),
  scene({
    id: 'aliens-atmosphere-processor-pressure-valves', universes: ['Aliens'], scenePattern: /atmosphere processor|processeur.*atmosph[eé]r|(?:hadley|colony).*(?:exterior|ext[eé]rieur|tower|tour)/i,
    sourceWork: 'Aliens (1986) — atmosphere processing station', sourceReference: 'https://www.20thcenturystudios.com/movies/aliens',
    sourceScene: 'Processeur atmosphérique — vannes et jauges sur les conduites extérieures', mechanism: 'atmosphere-processor-pressure-valves', color: '#b2bda9', periodSeconds: 26,
    sceneEvidence: 'The colony’s atmosphere processor is a large industrial installation. Small gauge needles and valve handwheels are authored from that mechanical function; no meltdown, countdown or explosion is triggered.'
  }),
  scene({
    id: 'alien3-fiorina-leadworks-ladle-hoist', universes: ['Alien 3'], scenePattern: /fiorina.*(?:furnace|fonderie|leadwork|hoist|palan)|leadworks.*(?:ladle|hoist)|fonderie.*fiorina/i,
    excludedScenePattern: /sprinkl|arrosage|refroid|cooling/i,
    sourceWork: 'Alien 3 (1992) — Fiorina 161 leadworks', sourceReference: 'https://www.20thcenturystudios.com/horror',
    sourceScene: 'Fiorina 161 — fonderie, palan de la poche au-dessus des fours', mechanism: 'fiorina-ladle-hoist', color: '#c8a078', periodSeconds: 30,
    sceneEvidence: 'The leadworks finale uses industrial hoists, furnaces and molten lead. A small empty ladle moves only along the upper background rail and never pours or crosses the combat lane.',
    localBackdrops: {
      Combat: patch('/backgrounds/lore-stages/alien-3/combat.webp', 0.11, 0.43, 0.07, 0.14),
      Melee: patch('/backgrounds/lore-stages/alien-3/melee.webp', 0.1, 0.31, 0.11, 0.2),
      RPG: patch('/backgrounds/lore-stages/alien-3/rpg.webp', 0.43, 0.32, 0.14, 0.19),
      Tactics: patch('/backgrounds/lore-stages/alien-3/tactics.webp', 0.88, 0.23, 0.1, 0.21)
    }
  }),
  scene({
    id: 'alien3-fiorina-mold-cooling-sprinklers', universes: ['Alien 3'], scenePattern: /fiorina.*(?:sprinkl|arrosage|refroid|cooling)|(?:mold|moule).*(?:cooling|refroid|arrosage)/i,
    sourceWork: 'Alien 3 (1992) — leadworks cooling-water system', sourceReference: 'https://www.20thcenturystudios.com/horror',
    sourceScene: 'Fiorina 161 — arrosage de refroidissement du moule derrière la passerelle', mechanism: 'fiorina-mold-cooling-sprinklers', color: '#b6c2ba', periodSeconds: 13,
    sceneEvidence: 'Cooling water is released above the lead mold in the film’s finale. Only small distant water strands are drawn here; temperature, lead, actors and damage have no simulation.'
  })
]);

// Defaults select a documented reference scene only when no concrete scene is
// supplied. The actual known RPG Silent Hill street is intentionally not a
// lake or carousel; it keeps the base fog atmosphere in that mode.
export const WAVE_2_MODE_REFERENCE_SCENES = Object.freeze({
  'Resident Evil': { Combat: 'Spencer dining room clock', Melee: 'Spencer dining room clock', RPG: 'Spencer dining room clock', Tactics: 'RPD main hall reception' },
  'Half-Life': { Combat: 'Black Mesa Sector C test chamber', Melee: 'Black Mesa Sector C test chamber', RPG: 'Black Mesa transit tram', Tactics: 'Black Mesa transit tram' },
  BioShock: { Combat: 'Rapture bathysphere station', Melee: 'Rapture bathysphere station', RPG: 'Rapture bathysphere station', Tactics: 'Hephaestus Core' },
  'Silent Hill': { Combat: 'Toluca Lake crossing', Melee: 'Lakeside Amusement Park carousel', RPG: 'South Vale foggy street', Tactics: 'Toluca Lake crossing' },
  Alien: { Combat: 'Nostromo MU/TH/UR room', Melee: 'Nostromo technical airlock', RPG: 'Nostromo MU/TH/UR room', Tactics: 'Nostromo technical airlock' },
  Predator: { Combat: 'Dutch trap preparation counterweight', Melee: 'Dutch jungle waterfall', RPG: 'Dutch jungle waterfall', Tactics: 'Dutch trap preparation counterweight' },
  Terminator: { Combat: 'Los Angeles 2029 Future War', Melee: 'Automated factory hydraulic press', RPG: 'Los Angeles 2029 Future War', Tactics: 'Automated factory hydraulic press' },
  Sonic: { Combat: 'Green Hill Zone', Melee: 'Green Hill Zone', RPG: 'Green Hill Zone', Tactics: 'Scrap Brain Zone' },
  'Back to the Future': { Combat: 'Hill Valley 1955 clock tower before the strike', Melee: 'Doc garage flux capacitor', RPG: 'Hill Valley 1955 clock tower before the strike', Tactics: 'Doc garage flux capacitor' },
  'Dino Crisis': { Combat: 'Ibis Third Energy reactor', Melee: 'Ibis facility perimeter gate', RPG: 'Ibis Third Energy reactor', Tactics: 'Ibis Third Energy reactor' },
  Aliens: { Combat: 'Hadleys Hope colony exterior atmosphere processor', Melee: 'Hadleys Hope colony exterior atmosphere processor', RPG: 'Hadleys Hope colony exterior atmosphere processor', Tactics: 'Hadleys Hope colony exterior atmosphere processor' },
  'Alien 3': { Combat: 'Fiorina 161 leadworks furnace', Melee: 'Fiorina 161 leadworks furnace', RPG: 'Fiorina 161 leadworks furnace', Tactics: 'Fiorina 161 leadworks furnace' }
});

const tau = Math.PI * 2;
const wrap = value => ((value % 1) + 1) % 1;
const line = (ctx, points) => {
  ctx.beginPath();
  points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.stroke();
};
const polygon = (ctx, points) => {
  ctx.beginPath();
  points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.closePath(); ctx.fill();
};
const ellipse = (ctx, x, y, rx, ry, fill = false) => {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, tau); if (fill) ctx.fill(); else ctx.stroke();
};
const wheel = (ctx, x, y, radius, phase, spokes = 6) => {
  ellipse(ctx, x, y, radius, radius);
  for (let i = 0; i < spokes; i++) {
    const a = phase + i * tau / spokes;
    line(ctx, [[x, y], [x + Math.cos(a) * radius, y + Math.sin(a) * radius]]);
  }
};

/** Draw only backdrop geometry. The caller supplies clipping and canvas save. */
export function drawStageAnimationWave2(ctx, animation, frame, width, height) {
  const w = width, h = height, phase = frame.phase, progress = frame.progress;
  ctx.globalAlpha = 0.12;
  switch (animation.mechanism) {
    case 'rpd-reception-console': {
      const x = w * 0.82, y = h * 0.3;
      ctx.strokeRect(x, y, w * 0.09, h * 0.115);
      line(ctx, [[x + w * 0.045, y + h * 0.115], [x + w * 0.045, y + h * 0.14], [x + w * 0.015, y + h * 0.14], [x + w * 0.075, y + h * 0.14]]);
      for (let row = 0; row < 5; row++) {
        ctx.globalAlpha = row <= Math.floor(progress * 5) ? 0.14 : 0.035;
        ctx.fillRect(x + w * 0.01, y + h * (0.016 + row * 0.018), w * (0.025 + row % 3 * 0.011), h * 0.004);
      }
      ctx.globalAlpha = 0.11;
      ctx.fillRect(x + w * 0.077, y + h * (0.01 + progress * 0.09), w * 0.003, h * 0.009);
      break;
    }
    case 'spencer-dining-clock': {
      const x = w * 0.115, y = h * 0.18;
      ctx.strokeRect(x - w * 0.018, y, w * 0.036, h * 0.29);
      ellipse(ctx, x, y + h * 0.047, h * 0.023, h * 0.023);
      line(ctx, [[x + h * 0.019, y + h * 0.047], [x, y + h * 0.047], [x - h * 0.014, y + h * 0.053]]);
      const a = Math.sin(phase) * 0.17, length = h * 0.105;
      const bob = [x + Math.sin(a) * length, y + h * 0.11 + Math.cos(a) * length];
      line(ctx, [[x, y + h * 0.11], bob]); ellipse(ctx, bob[0], bob[1], h * 0.011, h * 0.011, true);
      break;
    }
    case 'black-mesa-spectrometer-rotor': {
      const cx = w * 0.5, cy = h * 0.24;
      ellipse(ctx, cx, cy, w * 0.07, h * 0.025);
      line(ctx, [[cx, h * 0.13], [cx, h * 0.37]]);
      for (let arm = 0; arm < 3; arm++) {
        const a = phase + arm * tau / 3;
        const x = cx + Math.cos(a) * w * 0.075, y = cy + Math.sin(a) * h * 0.025;
        line(ctx, [[cx, cy], [x, y], [x, y + h * 0.08]]);
        ctx.strokeRect(x - w * 0.008, y + h * 0.068, w * 0.016, h * 0.025);
      }
      break;
    }
    case 'black-mesa-transit-tram': {
      const x = w * (-0.12 + progress * 1.24), y = h * 0.3;
      line(ctx, [[0, y + h * 0.1], [w, y + h * 0.1]]);
      ctx.strokeRect(x, y, w * 0.12, h * 0.075);
      for (let window = 0; window < 4; window++) ctx.strokeRect(x + w * (0.009 + window * 0.027), y + h * 0.013, w * 0.019, h * 0.03);
      for (const side of [0.025, 0.095]) wheel(ctx, x + w * side, y + h * 0.083, h * 0.013, phase * 8, 4);
      break;
    }
    case 'rapture-bathysphere-winch': {
      const cx = w * 0.84, cy = h * (0.34 + Math.sin(phase) * 0.035);
      wheel(ctx, cx, h * 0.15, h * 0.022, phase * 2, 5);
      line(ctx, [[cx, h * 0.17], [cx, cy - h * 0.06]]);
      ellipse(ctx, cx, cy, w * 0.035, h * 0.06);
      ellipse(ctx, cx, cy, h * 0.023, h * 0.023);
      ctx.strokeRect(w * 0.72, h * 0.28, w * 0.035, h * 0.085);
      const gx = w * 0.7375, gy = h * 0.32;
      ellipse(ctx, gx, gy, h * 0.022, h * 0.022);
      const a = -Math.PI / 2 + Math.sin(phase) * 0.6;
      line(ctx, [[gx, gy], [gx + Math.cos(a) * h * 0.018, gy + Math.sin(a) * h * 0.018]]);
      break;
    }
    case 'hephaestus-core-regulators': {
      const cx = w * 0.77, cy = h * 0.31;
      for (let ring = 0; ring < 3; ring++) {
        ellipse(ctx, cx, cy, w * (0.034 + ring * 0.014), h * (0.035 + ring * 0.02));
        for (let bolt = 0; bolt < 8; bolt++) {
          const a = (ring % 2 ? -phase : phase) + bolt * tau / 8;
          ctx.fillRect(cx + Math.cos(a) * w * (0.034 + ring * 0.014) - 1, cy + Math.sin(a) * h * (0.035 + ring * 0.02) - 1, 3, 3);
        }
      }
      for (const side of [-1, 1]) line(ctx, [[cx + side * w * 0.065, cy], [cx + side * w * 0.11, cy], [cx + side * w * 0.11, h * 0.5]]);
      break;
    }
    case 'toluca-rowboat-wake': {
      const cx = w * (0.24 + Math.sin(phase) * 0.035), cy = h * 0.36;
      polygon(ctx, [[cx - w * 0.025, cy], [cx + w * 0.025, cy], [cx + w * 0.015, cy + h * 0.012], [cx - w * 0.014, cy + h * 0.012]]);
      for (let wake = 0; wake < 5; wake++) {
        const distance = wrap(progress * 2 + wake / 5);
        ctx.globalAlpha = (1 - distance) * 0.12;
        line(ctx, [[cx - w * (0.022 + distance * 0.028), cy + h * (0.014 + distance * 0.06)], [cx, cy + h * (0.022 + distance * 0.06)], [cx + w * (0.022 + distance * 0.028), cy + h * (0.014 + distance * 0.06)]]);
      }
      break;
    }
    case 'lakeside-carousel': {
      const cx = w * 0.79, cy = h * 0.28, rx = w * 0.085;
      polygon(ctx, [[cx - rx, cy], [cx, cy - h * 0.09], [cx + rx, cy]]);
      ellipse(ctx, cx, h * 0.47, rx, h * 0.016);
      for (let horse = 0; horse < 6; horse++) {
        const a = phase + horse * tau / 6, x = cx + Math.cos(a) * rx * 0.82;
        const y = h * (0.385 + Math.sin(a) * 0.018 + Math.sin(phase * 2 + horse) * 0.012);
        ctx.globalAlpha = 0.065 + (1 + Math.sin(a)) * 0.035;
        line(ctx, [[x, cy], [x, h * 0.455]]);
        polygon(ctx, [[x - w * 0.014, y], [x + w * 0.01, y], [x + w * 0.017, y - h * 0.017], [x + w * 0.02, y - h * 0.008], [x + w * 0.013, y + h * 0.01], [x - w * 0.01, y + h * 0.01]]);
      }
      break;
    }
    case 'nostromo-mother-relays':
      for (let panel = 0; panel < 4; panel++) {
        const x = w * (panel < 2 ? 0.06 + panel * 0.055 : 0.83 + (panel - 2) * 0.055);
        ctx.globalAlpha = 0.1; ctx.strokeRect(x, h * 0.15, w * 0.045, h * 0.24);
        for (let row = 0; row < 8; row++) {
          ctx.globalAlpha = (row + panel + Math.floor(progress * 16)) % 5 === 0 ? 0.13 + Math.sin(phase + row * 0.3) * 0.025 : 0.025;
          ctx.fillRect(x + w * 0.006, h * (0.165 + row * 0.027), w * 0.031, h * 0.009);
        }
      }
      break;
    case 'nostromo-airlock-pistons': {
      const cx = w * 0.78, top = h * 0.19;
      ctx.strokeRect(cx - w * 0.055, top, w * 0.11, h * 0.28);
      line(ctx, [[cx, top], [cx, h * 0.47]]);
      for (const side of [-1, 1]) {
        const x = cx + side * w * 0.069, extension = (1 + Math.sin(phase)) * h * 0.025;
        ctx.strokeRect(x - w * 0.008, top + h * 0.02, w * 0.016, h * 0.08);
        line(ctx, [[x, top + h * 0.1], [x, top + h * 0.14 + extension], [x - side * w * 0.02, top + h * 0.14 + extension]]);
      }
      for (let lamp = 0; lamp < 4; lamp++) {
        ctx.globalAlpha = lamp <= Math.floor(progress * 4) ? 0.15 : 0.035;
        ctx.fillRect(cx - w * 0.026 + lamp * w * 0.017, top - h * 0.018, w * 0.007, h * 0.006);
      }
      break;
    }
    case 'dutch-waterfall-vines':
      for (let stream = 0; stream < 9; stream++) {
        const p = wrap(progress * 3 + stream * 0.17), x = w * (0.16 + stream * 0.007);
        ctx.globalAlpha = 0.07 + stream % 3 * 0.018;
        line(ctx, [[x, h * (0.18 + p * 0.24)], [x + Math.sin(phase + stream) * w * 0.001, h * (0.23 + p * 0.24)]]);
      }
      for (const x of [0.12, 0.24]) {
        ctx.globalAlpha = 0.12;
        line(ctx, [[w * x, h * 0.1], [w * (x + Math.sin(phase) * 0.005), h * 0.23], [w * (x + Math.sin(phase + 0.4) * 0.008), h * 0.39]]);
      }
      break;
    case 'dutch-counterweight-ropes': {
      const pivot = [w * 0.16, h * 0.13], angle = Math.sin(phase) * 0.07;
      const bx = pivot[0] + Math.sin(angle) * h * 0.23, by = pivot[1] + Math.cos(angle) * h * 0.23;
      line(ctx, [[w * 0.08, h * 0.13], [w * 0.25, h * 0.13]]);
      for (const side of [-1, 1]) line(ctx, [[pivot[0] + side * w * 0.025, pivot[1]], [bx + side * w * 0.025, by]]);
      ctx.strokeRect(bx - w * 0.04, by, w * 0.08, h * 0.025);
      ellipse(ctx, bx + w * 0.04, by + h * 0.0125, w * 0.005, h * 0.0125);
      break;
    }
    case 'future-war-hk-searchlight': {
      const x = w * (0.72 + Math.sin(phase) * 0.09), y = h * 0.16;
      const target = w * (0.65 + Math.sin(phase * 2) * 0.2);
      polygon(ctx, [[x - w * 0.02, y], [x, y - h * 0.012], [x + w * 0.025, y], [x + w * 0.015, y + h * 0.008], [x - w * 0.015, y + h * 0.008]]);
      ctx.globalAlpha = 0.035;
      polygon(ctx, [[x, y + h * 0.008], [target - w * 0.055, h * 0.49], [target + w * 0.055, h * 0.49]]);
      ctx.globalAlpha = 0.1;
      ellipse(ctx, target, h * 0.49, w * 0.055, h * 0.008);
      break;
    }
    case 'factory-hydraulic-press': {
      const cx = w * 0.8, drop = (1 - Math.cos(phase)) * h * 0.035;
      for (const side of [-1, 1]) ctx.strokeRect(cx + side * w * 0.05 - w * 0.006, h * 0.17, w * 0.012, h * 0.32);
      ctx.strokeRect(cx - w * 0.06, h * 0.15, w * 0.12, h * 0.03);
      ctx.strokeRect(cx - w * 0.018, h * 0.18, w * 0.036, h * 0.09);
      ctx.fillRect(cx - w * 0.005, h * 0.27, w * 0.01, h * 0.035 + drop);
      ctx.strokeRect(cx - w * 0.041, h * 0.305 + drop, w * 0.082, h * 0.025);
      ctx.strokeRect(cx - w * 0.06, h * 0.475, w * 0.12, h * 0.02);
      break;
    }
    case 'green-hill-sunflowers':
      for (const [x, y, size] of [[0.12, 0.38, 0.018], [0.88, 0.41, 0.014]]) {
        line(ctx, [[w * x, h * (y + 0.1)], [w * x, h * y]]);
        for (let petal = 0; petal < 6; petal++) {
          const a = phase + petal * tau / 6;
          ellipse(ctx, w * x + Math.cos(a) * h * size, h * y + Math.sin(a) * h * size, h * size * 0.48, h * size * 0.48, true);
        }
        ellipse(ctx, w * x, h * y, h * size * 0.5, h * size * 0.5, true);
        const palmX = w * (x < 0.5 ? 0.05 : 0.95);
        line(ctx, [[palmX, h * 0.48], [palmX, h * 0.22]]);
        for (let leaf = 0; leaf < 5; leaf++) {
          const a = -Math.PI + leaf * Math.PI / 4 + Math.sin(phase) * 0.04;
          line(ctx, [[palmX, h * 0.22], [palmX + Math.cos(a) * w * 0.035, h * 0.22 + Math.sin(a) * h * 0.045]]);
        }
      }
      break;
    case 'scrap-brain-conveyor-gears': {
      const left = w * 0.68, y = h * 0.38;
      ctx.strokeRect(left, y, w * 0.25, h * 0.04);
      for (let tooth = 0; tooth < 14; tooth++) ctx.fillRect(left + wrap(tooth / 14 + progress) * w * 0.25, y + h * 0.012, w * 0.006, h * 0.012);
      wheel(ctx, left + w * 0.03, y - h * 0.055, h * 0.038, phase, 8);
      wheel(ctx, left + w * 0.068, y - h * 0.073, h * 0.023, -phase * 1.65, 6);
      for (let bar = 0; bar < 9; bar++) line(ctx, [[left + bar * w * 0.03, h * 0.23], [left + bar * w * 0.03, h * 0.46]]);
      break;
    }
    case 'hill-valley-clock-escapement': {
      const cx = w * 0.78, cy = h * 0.22;
      ctx.strokeRect(cx - w * 0.045, h * 0.13, w * 0.09, h * 0.3);
      ellipse(ctx, cx, cy, h * 0.036, h * 0.036);
      // The hands stay at an authored pre-strike time; the visible clockwork
      // below them moves. No post-strike stopped clock receives moving hands.
      line(ctx, [[cx + Math.sin(Math.PI / 10) * h * 0.027, cy - Math.cos(Math.PI / 10) * h * 0.027], [cx, cy], [cx - h * 0.018, cy - h * 0.011]]);
      wheel(ctx, cx - w * 0.012, h * 0.33, h * 0.023, phase, 8);
      wheel(ctx, cx + w * 0.01, h * 0.355, h * 0.016, -phase * 1.5, 6);
      line(ctx, [[cx, h * 0.38], [cx + Math.sin(phase * 2) * w * 0.008, h * 0.415]]);
      break;
    }
    case 'doc-flux-capacitor': {
      const cx = w * 0.83, cy = h * 0.3;
      ctx.strokeRect(cx - w * 0.05, cy - h * 0.105, w * 0.1, h * 0.21);
      for (let branch = 0; branch < 3; branch++) {
        const a = -Math.PI * 5 / 6 + branch * tau / 3;
        const end = [cx + Math.cos(a) * w * 0.034, cy + Math.sin(a) * h * 0.072];
        ctx.globalAlpha = 0.1; line(ctx, [[cx, cy], end]);
        for (let light = 0; light < 5; light++) {
          const p = wrap(progress * 3 + light / 5);
          ctx.globalAlpha = 0.05 + p * 0.1;
          ellipse(ctx, cx + (end[0] - cx) * p, cy + (end[1] - cy) * p, 1.6, 1.6, true);
        }
      }
      break;
    }
    case 'third-energy-reactor-regulation': {
      const cx = w * 0.79;
      ctx.strokeRect(cx - w * 0.025, h * 0.18, w * 0.05, h * 0.27);
      for (let ring = 0; ring < 4; ring++) {
        const y = h * (0.22 + ring * 0.06);
        ellipse(ctx, cx, y, w * 0.055, h * 0.016);
        const a = phase + ring * Math.PI / 2;
        ctx.globalAlpha = 0.07 + (1 + Math.sin(a)) * 0.035;
        ctx.fillRect(cx + Math.cos(a) * w * 0.052 - 2, y + Math.sin(a) * h * 0.015 - 1, 4, 2);
      }
      break;
    }
    case 'ibis-perimeter-beacons':
      for (const [x, y, offset] of [[0.18, 0.18, 0], [0.84, 0.23, Math.PI]]) {
        ctx.globalAlpha = 0.13; ctx.strokeRect(w * x - w * 0.008, h * y, w * 0.016, h * 0.024);
        const dx = Math.cos(phase + offset) * w * 0.045;
        ctx.globalAlpha = 0.045;
        polygon(ctx, [[w * x, h * (y + 0.01)], [w * x + dx, h * (y - 0.002)], [w * x + dx, h * (y + 0.026)]]);
        ctx.globalAlpha = 0.055 + (1 + Math.cos(phase + offset)) * 0.04;
        ctx.fillRect(w * x - 2, h * (y + 0.008), 4, 4);
      }
      break;
    case 'hadleys-hope-operations-display': {
      const x = w * 0.72, y = h * 0.19, ww = w * 0.2, hh = h * 0.2;
      ctx.strokeRect(x, y, ww, hh);
      for (let row = 1; row < 4; row++) line(ctx, [[x, y + hh * row / 4], [x + ww, y + hh * row / 4]]);
      for (let column = 1; column < 6; column++) line(ctx, [[x + ww * column / 6, y], [x + ww * column / 6, y + hh]]);
      ctx.globalAlpha = 0.16; line(ctx, [[x + ww * progress, y], [x + ww * progress, y + hh]]);
      for (const [px, py] of [[0.2, 0.3], [0.62, 0.7], [0.8, 0.45]]) {
        ctx.globalAlpha = 0.05 + (1 + Math.sin(phase + px * tau)) * 0.045;
        ctx.strokeRect(x + ww * px - 2, y + hh * py - 2, 4, 4);
      }
      break;
    }
    case 'atmosphere-processor-pressure-valves':
      for (const [x, y, offset] of [[0.12, 0.29, 0], [0.86, 0.34, 1.1]]) {
        ctx.globalAlpha = 0.1;
        line(ctx, [[w * (x - 0.06), h * y], [w * (x + 0.04), h * y], [w * (x + 0.04), h * 0.49]]);
        wheel(ctx, w * x, h * y, h * 0.022, Math.sin(phase + offset) * 0.4, 5);
        const gx = w * (x + 0.027), gy = h * (y - 0.075);
        line(ctx, [[gx, h * y], [gx, gy]]); ellipse(ctx, gx, gy, h * 0.018, h * 0.018);
        const a = -Math.PI / 2 + Math.sin(phase + offset) * 0.5;
        line(ctx, [[gx, gy], [gx + Math.cos(a) * h * 0.015, gy + Math.sin(a) * h * 0.015]]);
      }
      break;
    case 'fiorina-ladle-hoist': {
      const x = w * (0.3 + (1 - Math.cos(phase)) * 0.15), y = h * 0.16;
      line(ctx, [[w * 0.2, y], [w * 0.78, y]]);
      ctx.strokeRect(x - w * 0.02, y - h * 0.012, w * 0.04, h * 0.024);
      const bottom = h * (0.3 + Math.sin(phase) * 0.018);
      for (const side of [-1, 1]) line(ctx, [[x + side * w * 0.012, y + h * 0.012], [x + side * w * 0.012, bottom]]);
      polygon(ctx, [[x - w * 0.025, bottom], [x + w * 0.025, bottom], [x + w * 0.018, bottom + h * 0.045], [x - w * 0.018, bottom + h * 0.045]]);
      break;
    }
    case 'fiorina-mold-cooling-sprinklers':
      line(ctx, [[w * 0.66, h * 0.19], [w * 0.94, h * 0.19]]);
      for (let nozzle = 0; nozzle < 4; nozzle++) {
        const x = w * (0.69 + nozzle * 0.07);
        ctx.globalAlpha = 0.12; ctx.strokeRect(x - 2, h * 0.19, 4, h * 0.025);
        for (let strand = 0; strand < 3; strand++) {
          const p = wrap(progress * 2 + strand / 3 + nozzle * 0.13);
          ctx.globalAlpha = Math.sin(p * Math.PI) * 0.13;
          line(ctx, [[x + (strand - 1) * p * w * 0.016, h * (0.22 + p * 0.15)], [x + (strand - 1) * (p + 0.16) * w * 0.016, h * (0.244 + p * 0.15)]]);
        }
      }
      break;
    default: return false;
  }
  return true;
}
