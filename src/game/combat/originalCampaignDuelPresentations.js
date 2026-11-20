// Match choreography for the original campaign bodies, sourced from
// originalUniversesManifest.json and the exact 4×4 sheets named below.
const phaseOrder = ['intro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'outro'];
const pose = (at, state, frame, x = 0, y = 0, opacity = 1) => ({ at, state, frame, x, y, opacity, scale: 1 });

function campaignDuel({ universe, weapon, sheet, footAnchor, effect, approach, recoil, low, attack, names, finaleState = 'attack' }) {
  const [entryDuration, entryDistance, step] = approach;
  const [duration, ready, release, settle, travel] = attack;
  const [intro, roundVictory, roundDefeat, fatality, victory, defeat, outro] = names;
  const clips = [
    { name: intro[0], duration: entryDuration, effectWindow: [.53, .96],
      beats: [pose(0, 'run', 0, -entryDistance), pose(.2, 'run', 1, -entryDistance * .68),
        pose(.39, 'run', 2, -entryDistance * .32), pose(.58, 'idle', step), pose(1, 'idle', 0)] },
    { name: roundVictory[0], duration: 1.25, effectWindow: [.22, .88],
      beats: [pose(0, 'idle', step), pose(.4, 'idle', 2), pose(1, 'idle', 0)] },
    { name: roundDefeat[0], duration: 1.35,
      beats: [pose(0, 'hit', 0), pose(.34, 'hit', low, -recoil), pose(1, 'hit', low, -recoil)] },
    { name: fatality[0], duration, effectWindow: [.34, .92],
      beats: [pose(0, 'idle', step), pose(.19, finaleState, ready, travel * .14),
        pose(.42, finaleState, release, travel), pose(.66, finaleState, settle, travel * .76),
        pose(.9, 'idle', step, travel * .28), pose(1, 'idle', 0)] },
    { name: victory[0], duration: 1.82, effectWindow: [.17, .88],
      beats: [pose(0, 'idle', step), pose(.34, 'idle', 3), pose(.7, 'idle', 1), pose(1, 'idle', 0)] },
    { name: defeat[0], duration: 1.78,
      beats: [pose(0, 'hit', 0), pose(.29, 'hit', 1, -recoil * .65), pose(.57, 'hit', low, -recoil),
        pose(1, 'hit', low, -recoil)] },
    { name: outro[0], duration: entryDuration + .24,
      beats: [pose(0, 'idle', 0), pose(.23, 'idle', step), pose(.4, 'run', 0, -8),
        pose(.57, 'run', 1, -30), pose(.74, 'run', 2, -61), pose(.89, 'run', 3, -99, 0, .63),
        pose(1, 'run', 0, -128, 0, .15)] }
  ];
  return { universe, weapon, sheet: '/sprites/generated/heroes/' + sheet, footAnchor, effect, sourceType: 'original',
    sourceReference: 'src/game/originalUniversesManifest.json — ' + fatality[0],
    phases: Object.fromEntries(phaseOrder.map((phase, index) => [phase, { ...clips[index], nameEnglish: names[index][1] }])) };
}

export const ORIGINAL_CAMPAIGN_DUELS = {
  elara_voss: campaignDuel({
    universe: 'The Aether Crown', weapon: 'rapier_pistol', sheet: 'the-aether-crown/elara-voss-v2-fidelity-wave4-2026-10-20.png',
    footAnchor: 240, effect: 'sky-mutiny', approach: [1.64, 62, 3], recoil: 11, low: 2, attack: [2.34, 0, 1, 3, 16],
    names: [['Elara prend le pont', 'Elara takes the deck'], ['La voie des quartiers bas s’ouvre', 'The lower decks have a way through'],
      ['Elara plie sous le recul', 'Elara buckles under the recoil'], ['Mutinerie des Cieux', 'Mutiny of the Skies'],
      ['La capitaine tient le pont', 'The captain holds the deck'], ['Elara s’appuie sur le pont', 'Elara braces against the deck'],
      ['Elara rejoint son équipage', 'Elara rejoins her crew']]
  }),
  bram_quill: campaignDuel({
    universe: 'The Aether Crown', weapon: 'aether_wrench', sheet: 'the-aether-crown/bram-quill-v2-fidelity-wave8-2026-10-24.png',
    footAnchor: 243, effect: 'free-aether', approach: [1.76, 49, 1], recoil: 9, low: 2, attack: [2.47, 0, 1, 2, 3],
    names: [['Bram vérifie la soupape', 'Bram checks the valve'], ['La pression se stabilise', 'The pressure stabilizes'],
      ['Bram se rattrape sur sa clef', 'Bram braces on his wrench'], ['Théorème d’Éther Libre', 'Free Aether Theorem'],
      ['La soupape reste libre', 'The valve stays open'], ['Bram garde sa clef près de lui', 'Bram holds on to his wrench'],
      ['Bram ferme son circuit', 'Bram shuts down his circuit']]
  }),
  merek_flint: campaignDuel({
    universe: 'The Aether Crown', weapon: 'steam_hammer', sheet: 'the-aether-crown/merek-flint-v2-fidelity-wave11-2026-10-26.png',
    footAnchor: 243, effect: 'boiler-overload', approach: [1.92, 44, 2], recoil: 4, low: 0, attack: [2.54, 0, 2, 3, 11],
    names: [['Merek met sa chaudière sous pression', 'Merek pressurizes his boiler'], ['La pression reste contenue', 'The pressure holds'],
      ['Les plaques de Merek encaissent le choc', 'Merek’s plates absorb the shock'], ['Surcharge de la Grande Chaudière', 'Great Boiler Overload'],
      ['Merek ventile sa chaudière', 'Merek vents his boiler'], ['Merek prend appui sur son marteau', 'Merek steadies himself on his hammer'],
      ['Merek évacue la vapeur', 'Merek vents the remaining steam']]
  }),
  seraphine_meridius: campaignDuel({
    universe: 'Meridian Clockwork', weapon: 'spring_rapier', sheet: 'meridian-clockwork/seraphine-meridius-v2-fidelity-wave5-2026-10-22.png',
    footAnchor: 242, effect: 'thirteenth-chime', approach: [1.53, 66, 3], recoil: 12, low: 2, attack: [2.42, 0, 1, 2, 21],
    names: [['Seraphine prend la mesure', 'Seraphine sets the tempo'], ['Une minute reste libre', 'One minute stays free'],
      ['Seraphine ramène sa rapière', 'Seraphine draws her rapier back'], ['Treizième Coup', 'Thirteenth Chime'],
      ['Seraphine protège les minutes libres', 'Seraphine guards the free minutes'], ['Seraphine perd la mesure', 'Seraphine loses the beat'],
      ['Seraphine quitte la garde', 'Seraphine leaves her watch']]
  }),
  lio_ferrante: campaignDuel({
    universe: 'Meridian Clockwork', weapon: 'gear_launcher', sheet: 'meridian-clockwork/lio-ferrante-v2-fidelity-wave8-2026-10-24.png',
    footAnchor: 240, effect: 'world-adjustment', approach: [1.58, 60, 2], recoil: 14, low: 1, attack: [2.35, 0, 2, 3, -6],
    names: [['Lio écoute le mécanisme', 'Lio listens to the mechanism'], ['Deux rouages se raccordent', 'Two cogs mesh'],
      ['Lio baisse son lance-rouages', 'Lio lowers his gear launcher'], ['Réglage du Monde', 'Tuning the World'],
      ['Lio rétablit la cadence', 'Lio restores the cadence'], ['Lio s’accroupit avec son outil', 'Lio crouches with his tool'],
      ['Lio remet ses outils en place', 'Lio gathers his tools']]
  }),
  brother_ors: campaignDuel({
    universe: 'Meridian Clockwork', weapon: 'pendulum_maul', sheet: 'meridian-clockwork/brother-ors-v2-fidelity-wave11-2026-10-26.png',
    footAnchor: 243, effect: 'last-peal', approach: [1.91, 45, 0], recoil: 5, low: 1, attack: [2.57, 0, 1, 2, 8],
    names: [['Le frère Ors cale son maillet', 'Brother Ors steadies his maul'], ['L’heure non inscrite est préservée', 'The unrecorded hour is safe'],
      ['Ors amortit le choc du maillet', 'Ors braces against the maul'], ['Dernière Sonnerie', 'The Last Peal'],
      ['Ors laisse mourir l’écho', 'Ors lets the echo fade'], ['Ors s’incline avec son maillet', 'Ors bows with his maul'],
      ['Ors regagne le clocher', 'Ors returns to the belfry']]
  }),
  mara_veylan: campaignDuel({
    universe: 'Iron Tempest', weapon: 'diesel_carbine', sheet: 'iron-tempest/mara-veylan-v2-fidelity-wave5-2026-10-22.png',
    footAnchor: 241, effect: 'radio-order-zero', approach: [1.6, 66, 3], recoil: 13, low: 1, attack: [2.32, 0, 1, 2, -9],
    names: [['Mara se met en écoute', 'Mara listens on the radio'], ['La fréquence est tenue', 'The frequency is secure'],
      ['Mara se replie à couvert', 'Mara ducks into cover'], ['Ordre Zéro Radio', 'Radio Order Zero'],
      ['Mara maintient la diffusion', 'Mara keeps broadcasting'], ['Mara reste accroupie', 'Mara stays crouched'],
      ['Mara coupe son émission', 'Mara ends the transmission']]
  }),
  anton_rook: campaignDuel({
    universe: 'Iron Tempest', weapon: 'rivet_cannon', sheet: 'iron-tempest/anton-rook-v2-fidelity-wave8-2026-10-24.png',
    footAnchor: 243, effect: 'controlled-derailment', approach: [1.91, 42, 1], recoil: 6, low: 0, attack: [2.46, 0, 1, 3, -12],
    names: [['Anton cale son canon à rivets', 'Anton braces his rivet cannon'], ['Anton vérifie la voie', 'Anton checks the track'],
      ['Anton encaisse sous son canon', 'Anton braces beneath his cannon'], ['Déraillement Contrôlé', 'Controlled Derailment'],
      ['La voie est dégagée', 'The track is clear'], ['Anton rabat son canon', 'Anton lowers his cannon'],
      ['Anton retourne au train', 'Anton returns to the train']]
  }),
  ilya_cross: campaignDuel({
    universe: 'Iron Tempest', weapon: 'propeller_blade', sheet: 'iron-tempest/ilya-cross-v2-fidelity-wave11-2026-10-26.png',
    footAnchor: 243, effect: 'flagless-sky', approach: [1.53, 69, 1], recoil: 15, low: 1, attack: [2.51, 0, 2, 3, 29],
    names: [['Ilya reprend l’axe du piqué', 'Ilya lines up the dive'], ['Le ciel est dégagé', 'The sky is clear'],
      ['Ilya perd son élan', 'Ilya loses momentum'], ['Ciel sans Drapeau', 'Sky without a Flag'],
      ['Ilya abaisse sa lame', 'Ilya lowers her blade'], ['Ilya reprend appui', 'Ilya steadies herself'],
      ['Ilya quitte le champ', 'Ilya leaves the field']]
  }),
  ysara_flint: campaignDuel({
    universe: 'The Crownless Sea', weapon: 'cutlass_pistol', sheet: 'the-crownless-sea/ysara-flint-v2-fidelity-wave7-2026-10-23.png',
    footAnchor: 241, effect: 'fallen-flags', approach: [1.67, 65, 1], recoil: 9, low: 2, attack: [2.43, 1, 2, 3, 13],
    names: [['Ysara prend le bastingage', 'Ysara takes the rail'], ['Le pont reste aux équipages', 'The crews hold the deck'],
      ['Ysara descend sous le bastingage', 'Ysara ducks below the rail'], ['Tous Pavillons Abattus', 'All Flags Struck'],
      ['Le pont reste sans pavillon', 'The deck remains flagless'], ['Ysara fléchit, sabre en main', 'Ysara buckles with her cutlass in hand'],
      ['Ysara rejoint le pont libre', 'Ysara returns to the free deck']]
  }),
  milo_quill: campaignDuel({
    universe: 'The Crownless Sea', weapon: 'map_tools', sheet: 'the-crownless-sea/milo-quill.png',
    footAnchor: 244, effect: 'ink-sea', approach: [1.55, 67, 2], recoil: 13, low: 3, attack: [2.39, 0, 3, 2, 7],
    names: [['Milo relève le courant', 'Milo charts the current'], ['Le courant dessiné tient', 'The charted current holds'],
      ['Milo se plie sur sa carte', 'Milo folds over his chart'], ['Mer Réécrite à l’Encre', 'Sea Rewritten in Ink'],
      ['Milo finit son relevé', 'Milo finishes his survey'], ['Milo conserve son compas', 'Milo holds on to his compass'],
      ['Milo replie la carte', 'Milo folds the chart']]
  }),
  brann_crow: campaignDuel({
    universe: 'The Crownless Sea', weapon: 'boarding_axe', sheet: 'the-crownless-sea/brann-crow-v2-fidelity-wave6-2026-10-23.png',
    footAnchor: 240, effect: 'lower-deck-revolt', approach: [1.86, 47, 1], recoil: 5, low: 1, attack: [2.56, 0, 1, 2, 21],
    names: [['Brann rejoint le pont inférieur', 'Brann reaches the lower deck'], ['La coque tient', 'The hull holds'],
      ['Brann s’ancre sur le pont', 'Brann braces against the deck'], ['Révolte du Pont Inférieur', 'Lower Deck Uprising'],
      ['Brann garde le passage libre', 'Brann keeps the passage clear'], ['Brann prend appui sur le pont', 'Brann braces on the deck'],
      ['Brann retourne sous le pont', 'Brann heads below deck']]
  }),
  mara_ell: campaignDuel({
    universe: 'The Drowned Testament', weapon: 'signal_lamp', sheet: 'the-drowned-testament/mara-ell-v2-fidelity-wave6-2026-10-23.png',
    footAnchor: 241, effect: 'unbowed-translation', approach: [1.74, 54, 1], recoil: 11, low: 3, attack: [2.45, 0, 1, 3, -3],
    names: [['Mara règle la fréquence', 'Mara tunes the frequency'], ['Le signal reste intelligible', 'The signal is still readable'],
      ['Mara abrite sa lampe', 'Mara shields her lamp'], ['Traduction sans Soumission', 'Translation without Submission'],
      ['Mara referme la transcription', 'Mara closes the transcription'], ['Mara serre sa lampe', 'Mara holds her lamp close'],
      ['Mara emporte le relevé', 'Mara carries the record away']]
  }),
  jonas_mire: campaignDuel({
    universe: 'The Drowned Testament', weapon: 'harpoon', sheet: 'the-drowned-testament/jonas-mire.png',
    footAnchor: 244, effect: 'greywake-beacon', approach: [1.84, 47, 0], recoil: 6, low: 2, attack: [2.62, 0, 1, 2, 2],
    names: [['Jonas prend son quart', 'Jonas takes his watch'], ['La balise reste allumée', 'The beacon stays lit'],
      ['Jonas plie sous la lame de fond', 'Jonas buckles under the swell'], ['Lumière jusqu’au Fond', 'Light to the Bottom'],
      ['La lumière atteint les fonds', 'The light reaches the depths'], ['Jonas s’accroupit à la balise', 'Jonas crouches by the beacon'],
      ['Jonas remonte vers Greywake', 'Jonas heads back to Greywake']]
  }),
  oona_vell: campaignDuel({
    universe: 'The Drowned Testament', weapon: 'dream_compass', sheet: 'the-drowned-testament/oona-vell-v2-fidelity-wave11-2026-10-28.png',
    footAnchor: 243, effect: 'absent-shore', approach: [1.66, 63, 1], recoil: 14, low: 2, attack: [2.55, 0, 1, 3, 5],
    names: [['Oona cherche un angle dormant', 'Oona seeks a sleeping angle'], ['Le cadran retrouve le rivage', 'The dial finds the shore again'],
      ['Le rivage échappe à Oona', 'The shore slips away from Oona'], ['Carte du Rivage qui n’Existe Pas', 'Chart of the Shore That Isn’t There'],
      ['Oona replie la côte rêvée', 'Oona folds the dream coast'], ['Oona garde son cadran', 'Oona holds on to her dial'],
      ['Oona suit la côte invisible', 'Oona follows the unseen coast']]
  }),
  aelwen_starbough: campaignDuel({
    universe: 'Valedor: The Shattered Crown', weapon: 'longbow', sheet: 'valedor-the-shattered-crown/aelwen-starbough-v2-fidelity-wave7-2026-10-23.png',
    footAnchor: 240, effect: 'seven-kingdoms-rain', approach: [1.54, 67, 2], recoil: 14, low: 2, attack: [2.37, 0, 1, 2, -6],
    names: [['Aelwen observe la lisière', 'Aelwen watches the treeline'], ['Aelwen tient la lisière', 'Aelwen holds the treeline'],
      ['Aelwen baisse son arc', 'Aelwen lowers her bow'], ['Pluie sur les Sept Royaumes', 'Rain over the Seven Kingdoms'],
      ['Aelwen détend son arc', 'Aelwen relaxes her bow'], ['Aelwen prend appui à genou', 'Aelwen braces on one knee'],
      ['Aelwen retourne sous la canopée', 'Aelwen returns to the canopy']]
  }),
  brokk_embervein: campaignDuel({
    universe: 'Valedor: The Shattered Crown', weapon: 'warhammer', sheet: 'valedor-the-shattered-crown/brokk-embervein.png',
    footAnchor: 244, effect: 'seven-oaths-anvil', approach: [1.94, 42, 0], recoil: 4, low: 1, attack: [2.62, 0, 1, 2, 13],
    names: [['Brokk prend appui à la forge', 'Brokk braces at the forge'], ['Le métal garde sa forme', 'The metal holds its shape'],
      ['Brokk plie sous le choc', 'Brokk buckles under the blow'], ['Enclume des Sept Serments', 'Anvil of the Seven Oaths'],
      ['Les sept serments sont réunis', 'The seven oaths are reunited'], ['Brokk se ramasse près de l’enclume', 'Brokk crouches by the anvil'],
      ['Brokk rejoint sa forge', 'Brokk returns to his forge']]
  }),
  goruk_ash_tusk: campaignDuel({
    universe: 'Valedor: The Shattered Crown', weapon: 'great_axe', sheet: 'valedor-the-shattered-crown/goruk-ash-tusk.png',
    footAnchor: 244, effect: 'free-clans', approach: [1.81, 50, 0], recoil: 8, low: 1, attack: [2.58, 0, 2, 3, 19],
    names: [['Goruk prend la tête du cercle', 'Goruk takes the head of the circle'], ['Les clans gardent leur place', 'The clans hold their place'],
      ['Goruk baisse les épaules', 'Goruk drops his shoulders'], ['Aucun Peuple ne Sera l’Ennemi', 'No People Shall Be the Enemy'],
      ['Le cercle des clans est ouvert', 'The clan circle stays open'], ['Goruk reste à couvert', 'Goruk stays under cover'],
      ['Goruk retrouve les clans', 'Goruk returns to the clans']]
  }),
  celeste_ray: campaignDuel({
    universe: 'Helios 56', weapon: 'ray_emitter', sheet: 'helios-56/celeste-ray-v2-fidelity-wave5-2026-10-22.png',
    footAnchor: 241, effect: 'safe-sun-equation', approach: [1.75, 56, 1], recoil: 10, low: 1, attack: [2.48, 0, 1, 2, -3],
    names: [['Celeste règle son émetteur', 'Celeste calibrates her emitter'], ['L’étalonnage est stable', 'Calibration holds'],
      ['Celeste pose un genou', 'Celeste drops to one knee'], ['Équation du Soleil Sûr', 'Safe Sun Equation'],
      ['Celeste confirme ses mesures', 'Celeste confirms her readings'], ['Celeste s’appuie près de son émetteur', 'Celeste braces beside her emitter'],
      ['Celeste emporte ses relevés', 'Celeste carries her readings away']]
  }),
  nova_bell: campaignDuel({
    universe: 'Helios 56', weapon: 'ray_pistol', sheet: 'helios-56/nova-bell-v2-fidelity-wave11-2026-10-26.png',
    footAnchor: 243, effect: 'comet-passage', approach: [1.57, 68, 1], recoil: 14, low: 1, attack: [2.43, 0, 2, 3, 22],
    names: [['Nova annonce son passage', 'Nova announces her flyby'], ['La fréquence reste libre', 'The frequency stays open'],
      ['Nova perd son élan', 'Nova loses momentum'], ['Passage Comète', 'Comet Flyby'],
      ['Nova confirme la trajectoire', 'Nova confirms the trajectory'], ['Nova baisse son pistolet', 'Nova lowers her pistol'],
      ['Nova quitte la fréquence', 'Nova signs off']]
  }),
  aura_7: campaignDuel({
    universe: 'Helios 56', weapon: 'atomic_gauntlet', sheet: 'helios-56/aura-7-v2-fidelity-wave11-2026-10-26.png',
    footAnchor: 243, effect: 'rescue-directive', approach: [1.92, 46, 1], recoil: 6, low: 1,
    attack: [2.54, 1, 2, 0, 0], finaleState: 'idle',
    names: [['AURA-7 détecte l’équipe', 'AURA-7 detects the crew'], ['AURA-7 maintient son bouclier', 'AURA-7 holds up its shield'],
      ['AURA-7 s’abaisse sous le choc', 'AURA-7 braces under the impact'], ['Directive : Sauver Tout le Monde', 'Directive: Save Everyone'],
      ['AURA-7 vérifie le périmètre', 'AURA-7 checks the perimeter'], ['AURA-7 s’ancre au sol', 'AURA-7 braces on the ground'],
      ['AURA-7 sécurise le retour', 'AURA-7 secures the return']]
  }),
  astra_vey: campaignDuel({
    universe: 'Mythos Primordia', weapon: 'star_compass', sheet: 'mythos-primordia/astra-vey.png',
    footAnchor: 244, effect: 'beforeworld-chart', approach: [1.64, 59, 2], recoil: 13, low: 2, attack: [2.49, 0, 2, 3, 7],
    names: [['Astra repère la première étoile', 'Astra locates the first star'], ['La carte reste lisible', 'The chart is still readable'],
      ['Astra protège son relevé', 'Astra shields her survey'], ['Carte de l’Avant-Monde', 'Map of the Beforeworld'],
      ['Astra trace la constellation', 'Astra charts the constellation'], ['Astra baisse son regard', 'Astra lowers her gaze'],
      ['Astra suit la carte', 'Astra follows the chart']]
  }),
  korun_stoneborn: campaignDuel({
    universe: 'Mythos Primordia', weapon: 'stone_maul', sheet: 'mythos-primordia/korun-stoneborn.png',
    footAnchor: 244, effect: 'rising-foundations', approach: [1.96, 42, 0], recoil: 5, low: 2, attack: [2.62, 1, 2, 3, 16],
    names: [['Korun prend appui', 'Korun sets his feet'], ['La roche tient', 'The stone holds'],
      ['Korun encaisse le choc', 'Korun takes the impact'], ['Soulèvement des Fondations', 'Uprising of the Foundations'],
      ['Korun stabilise la roche', 'Korun steadies the stone'], ['Korun se tient près du sol', 'Korun stays close to the ground'],
      ['Korun rejoint la montagne', 'Korun returns to the mountain']]
  }),
  nyme_first_song: campaignDuel({
    universe: 'Mythos Primordia', weapon: 'voice', sheet: 'mythos-primordia/nyme-first-song-v2-fidelity-wave11-2026-10-26.png',
    footAnchor: 243, effect: 'first-song-memory', approach: [1.83, 50, 1], recoil: 9, low: 2, attack: [2.56, 0, 1, 2, 3],
    names: [['Nyme reprend le Premier Chant', 'Nyme takes up the First Song'], ['La mélodie garde sa forme', 'The melody holds its shape'],
      ['Nyme reprend son souffle', 'Nyme catches her breath'], ['Le Monde se souvient de son Chant', 'The World Remembers Its Song'],
      ['Nyme tient la dernière note', 'Nyme holds the final note'], ['Nyme baisse les bras', 'Nyme lowers her arms'],
      ['Nyme laisse mourir l’écho', 'Nyme lets the echo fade']]
  })
};

const turn = Math.PI * 2;
function trace(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  for (const point of points.slice(1)) ctx.lineTo(...point);
  ctx.stroke();
}
function arc(ctx, x, y, rx, ry, tilt = 0, start = 0, end = turn) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, tilt, start, end);
  ctx.stroke();
}

// These signs mark the scene's central action. Drawn in effect-local space,
// they leave the inspected body and the real arena collision state alone.
const campaignMotifs = {
  'sky-mutiny'(ctx, p) {
    ctx.strokeStyle = '#d8b25c';
    for (let index = -1; index <= 1; index++) {
      const x = 12 + 11 * index + 10 * p, y = index * 12;
      trace(ctx, [[x - 15, y + 12], [x + 9, y + 12], [x + 17, y + 6]]);
      trace(ctx, [[x, y + 11], [x, y - 13], [x + 10, y + 5], [x, y + 5]]);
    }
  },
  'free-aether'(ctx, p) {
    ctx.strokeStyle = '#e7b85a';
    const span = 21 + 23 * p;
    for (const tilt of [-.55, .55]) arc(ctx, 10, 0, span, 12, tilt, .2, 5.8);
    trace(ctx, [[-8, 9], [0, 9], [0, -10], [10, -10]]);
  },
  'boiler-overload'(ctx, p) {
    ctx.strokeStyle = '#ff8a3d';
    arc(ctx, 2, 9, 23, 19, 0, Math.PI, turn);
    trace(ctx, [[2, 9], [2 + 18 * Math.sin(p * 2.9), 9 - 18 * Math.cos(p * 2.9)]]);
    for (const x of [-13, 2, 17]) trace(ctx, [[x, -12], [x - 5, -22 - 8 * p], [x + 3, -28 - 12 * p]]);
  },
  'thirteenth-chime'(ctx, p) {
    ctx.strokeStyle = '#f6d68a';
    for (let index = 0; index < 13; index++) {
      const angle = index * turn / 13 + p * .45;
      const x = Math.cos(angle), y = Math.sin(angle), extent = index === 12 ? 38 : 32;
      trace(ctx, [[x * 25, y * 25], [x * extent, y * extent]]);
    }
    trace(ctx, [[0, 0], [16 * Math.sin(p * 5), -16 * Math.cos(p * 5)]]);
  },
  'world-adjustment'(ctx, p) {
    ctx.strokeStyle = '#2e79b9';
    for (const [x, y, radius, direction] of [[-12, 7, 19, 1], [18, -8, 14, -1]]) {
      const points = Array.from({ length: 25 }, (_, index) => {
        const angle = direction * p + index * turn / 24;
        const r = radius + (index % 3 === 0 ? 5 : 0);
        return [x + Math.cos(angle) * r, y + Math.sin(angle) * r];
      });
      trace(ctx, points);
      arc(ctx, x, y, 4, 4);
    }
  },
  'last-peal'(ctx, p) {
    ctx.strokeStyle = '#c96c3a';
    trace(ctx, [[-19, 10], [-12, 0], [-9, -16], [0, -23], [9, -16], [12, 0], [19, 10], [-19, 10]]);
    arc(ctx, (p - .5) * 12, 13, 4, 4);
    for (const r of [22, 33, 45]) arc(ctx, 0, 7, r + p * 16, 14, 0, .2, Math.PI - .2);
  },
  'radio-order-zero'(ctx, p) {
    ctx.strokeStyle = '#d9483b';
    trace(ctx, [[-15, 14], [-15, -16], [-7, -22], [0, -16], [0, 14], [-15, 14]]);
    for (const r of [16, 28, 40]) arc(ctx, -8, -11, r + p * 13, r + p * 13, 0, -.7, .6);
  },
  'controlled-derailment'(ctx, p) {
    ctx.strokeStyle = '#d48336';
    trace(ctx, [[-26, 15], [0, 2], [14, 2], [42, -14 - p * 10]]);
    trace(ctx, [[-22, 22], [0, 14], [17, 14], [48, -4 - p * 10]]);
    for (let index = 0; index < 5; index++) {
      const x = index * 11 - 26;
      trace(ctx, [[x, 16 - index * 2], [x + 6, 24 - index * 2]]);
    }
  },
  'flagless-sky'(ctx, p) {
    ctx.strokeStyle = '#e8d18a';
    arc(ctx, 8, -4, 29 + p * 13, 17, -.42, Math.PI, turn + .2);
    trace(ctx, [[-19, 2], [0, -12], [17, -6], [39 + p * 12, -17]]);
    trace(ctx, [[-11, 12], [5, 1], [17, 2], [33 + p * 12, -6]]);
  },
  'fallen-flags'(ctx, p) {
    ctx.strokeStyle = '#e63946';
    for (const [x, skew] of [[-15, -1], [7, 1], [29, 2]]) {
      const fall = skew * p * 12;
      trace(ctx, [[x, 12], [x + fall, -19], [x + fall + 14, -13], [x + fall * .81, -8]]);
    }
  },
  'ink-sea'(ctx, p) {
    ctx.strokeStyle = '#00b4d8';
    for (const y of [-12, 0, 12]) {
      const points = Array.from({ length: 9 }, (_, index) => [index * 9 - 28, y + 6 * Math.sin(index * .81 - p * 5)]);
      trace(ctx, points);
    }
    ctx.strokeRect(-23, -25, 52, 50);
  },
  'lower-deck-revolt'(ctx, p) {
    ctx.strokeStyle = '#d9b44a';
    const spread = p * 15;
    trace(ctx, [[-28, 13], [-10 - spread, 9], [-4, 14], [1, 4]]);
    trace(ctx, [[5, 10], [11 + spread, 10], [39, 4]]);
    trace(ctx, [[-26, 21], [-13, 17], [-7, 22], [7, 18], [24, 19], [37, 13]]);
  },
  'unbowed-translation'(ctx, p) {
    ctx.strokeStyle = '#70d6ff';
    for (const [index, path] of [
      [[-6, 6], [0, -7], [6, 6]], [[-6, -6], [6, -6], [0, 0], [6, 6], [-6, 6]],
      [[-5, -6], [5, 6], [-5, 6], [5, -6]]
    ].entries()) {
      const x = index * 19 - 15 + p * 9;
      trace(ctx, path.map(([u, v]) => [u + x, v + (index % 2 ? 3 : -3)]));
      ctx.strokeRect(x - 8, -14, 16, 27);
    }
  },
  'greywake-beacon'(ctx, p) {
    ctx.strokeStyle = '#f4d35e';
    const distance = 32 + 37 * p;
    trace(ctx, [[-14, 0], [4, -6], [distance, -21]]);
    trace(ctx, [[-14, 0], [4, 6], [distance, 18]]);
    arc(ctx, -13, 0, 6, 7);
  },
  'absent-shore'(ctx, p) {
    ctx.strokeStyle = '#c77dff';
    trace(ctx, [[-23, 17], [-9, -10], [6, 1], [14 - p * 8, -17], [32, -10], [42, 10]]);
    arc(ctx, 2, -5, 26 + p * 10, 17, .45, -.3, 3.9);
    trace(ctx, [[0, 4], [4 + p * 8, -8], [8, 0], [0, 4]]);
  },
  'seven-kingdoms-rain'(ctx, p) {
    ctx.strokeStyle = '#8fefb5';
    for (let index = 0; index < 7; index++) {
      const x = index * 9 - 21, y = Math.abs(index - 3) * 3 - 22 + p * 18;
      trace(ctx, [[x - 5, y - 10], [x + 3, y + 6], [x - 2, y + 3]]);
    }
  },
  'seven-oaths-anvil'(ctx, p) {
    ctx.strokeStyle = '#f4a261';
    trace(ctx, [[-20, 3], [24, 3], [16, 11], [8, 13], [12, 19], [17, 19], [17, 23],
      [-14, 23], [-14, 19], [-6, 19], [-4, 13], [-14, 10], [-20, 3]]);
    for (let index = 0; index < 7; index++) {
      const angle = Math.PI + index * Math.PI / 6;
      trace(ctx, [[Math.cos(angle) * 10, Math.sin(angle) * 10],
        [Math.cos(angle) * (18 + 15 * p), Math.sin(angle) * (18 + 15 * p)]]);
    }
  },
  'free-clans'(ctx, p) {
    ctx.strokeStyle = '#e76f51';
    const span = 12 + p * 13;
    arc(ctx, 5, 11, span + 15, 10, 0, -.15, Math.PI + .15);
    for (const offset of [-15, 0, 15]) {
      const x = 5 + offset, y = offset === 0 ? -9 : -1;
      trace(ctx, [[x - 4, y + 12], [x - 4, y], [x + 5, y - 4], [x + 5, y + 8], [x - 4, y + 12]]);
    }
  },
  'safe-sun-equation'(ctx, p) {
    ctx.strokeStyle = '#23a9b0';
    arc(ctx, 7, 0, 12 + p * 7, 12 + p * 7);
    arc(ctx, 7, 0, 32, 14, -.45, p, turn + p - .7);
    trace(ctx, [[-31, -24], [-22, -24], [-22, 22], [-31, 22]]);
    trace(ctx, [[37, -24], [29, -24], [29, 22], [37, 22]]);
  },
  'comet-passage'(ctx, p) {
    ctx.strokeStyle = '#e8503d';
    const x = 12 + p * 22;
    arc(ctx, x, -8, 7, 7);
    for (const y of [-13, -8, -3]) trace(ctx, [[x - 7, y], [x - 24, y + 9], [x - 38, y + 13]]);
  },
  'rescue-directive'(ctx, p) {
    ctx.strokeStyle = '#f5d45c';
    const span = 17 + p * 10;
    trace(ctx, [[-span, -21], [span, -21], [span, 8], [0, 26], [-span, 8], [-span, -21]]);
    trace(ctx, [[-8, 0], [8, 0]]);
    trace(ctx, [[0, -8], [0, 8]]);
  },
  'beforeworld-chart'(ctx, p) {
    ctx.strokeStyle = '#7df9ff';
    const stars = [[-29, 4], [-15, -13], [2, 7], [14, -16], [34 + p * 5, -5]];
    trace(ctx, stars);
    for (const [x, y] of stars) {
      trace(ctx, [[x - 3, y], [x + 3, y]]);
      trace(ctx, [[x, y - 3], [x, y + 3]]);
    }
    arc(ctx, 2, -4, 33, 24, -.22, -.5, 2.6);
  },
  'rising-foundations'(ctx, p) {
    ctx.strokeStyle = '#b08968';
    for (const [x, height] of [[-24, 12], [-3, 29], [24, 19]]) {
      const y = 11 - p * height;
      trace(ctx, [[x - 8, 23], [x - 9, y + 6], [x - 3, y], [x + 8, y - 2], [x + 11, y + 7], [x + 8, 23]]);
    }
  },
  'first-song-memory'(ctx, p) {
    ctx.strokeStyle = '#ff70a6';
    for (const y of [-12, 0, 12]) {
      const extent = 27 + p * 11;
      const points = Array.from({ length: 9 }, (_, i) => [i * extent / 4 - extent, y + Math.sin(i * .72 - p * 4) * 6]);
      trace(ctx, points);
    }
  }
};

const scaledMotifs = Object.fromEntries(Object.entries(campaignMotifs).map(([kind, paint]) => [
  kind, (ctx, progress, size) => {
    ctx.scale(size, size);
    paint(ctx, progress);
  }
]));

export function getCampaignDuelMotif(kind) {
  return Object.hasOwn(scaledMotifs, kind) ? scaledMotifs[kind] : null;
}
