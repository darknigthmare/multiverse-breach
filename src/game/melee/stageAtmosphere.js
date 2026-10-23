import { getStageLoreProfile } from '../stageLoreProfiles.js';
import { getRecentUniverseLevelProfile } from '../recentUniverseLevels.js';
import { getUniverseStageAtmosphereDefault } from './stageAtmosphereUniverseDefaults.js';
import { getStageAnimationProfile, renderStageAnimation } from './stageAnimationCatalog.js';

// These are background adaptations of locations already named by the stage
// catalogue, not claims that a procedural drawing reproduces a source 1:1.
// Gameplay events stay in stageEventEngine: this layer never changes collisions,
// damage, platform positions, camera position, or the visibility of telegraphs.
export const STAGE_ATMOSPHERE_FIDELITY = Object.freeze({
  authored: 'authored-location-adaptation',
  physical: 'physical-motif-adaptation',
  unavailable: 'unconfigured'
});

const authored = (id, universes, anchor, effect, color, description) => Object.freeze({
  id,
  universes: Object.freeze(universes),
  anchor,
  effect,
  color,
  description
});

export const AUTHORED_STAGE_ATMOSPHERES = Object.freeze([
  authored('stargate-event-horizon', ['Stargate', 'Stargate Atlantis', 'Stargate Universe', 'Stargate Infinity'], /gate|sgc|abydos|destiny|atlantis/i, 'gate-ripples', '#75cfff', 'Ondulations lentes de la surface de la Porte, dans le fond du lieu.'),
  authored('matrix-digital-pipeline', ['The Matrix', 'Matrix'], /digital|pipeline|matrix|construct|source/i, 'matrix-code', '#72d89a', 'Flux vert de données dans la couche numérique décrite par le lieu.'),
  authored('new-port-network', ['Ghost in the Shell'], /new port|network|cyberbrain|node/i, 'network-traces', '#8dd6cb', 'Traces segmentées du réseau de New Port, distinctes du flux de la Matrice.'),
  authored('toluca-fog', ['Silent Hill'], /fog|toluca|brouillard|mist/i, 'cold-haze', '#c0c7c2', 'Brume de Toluca qui reste derrière les personnages et les avertissements.'),
  authored('ishimura-ventilation', ['Dead Space'], /ishimura|mining deck|engineering/i, 'vent-steam', '#b1c7cb', 'Vapeur des conduits du pont minier de l’Ishimura.'),
  authored('alien-processor-vents', ['Alien', 'Aliens', 'Alien Resurrection', 'Alien: Romulus'], /hive|lv-426|nostromo|processor|containment|renaissance|auriga/i, 'vent-steam', '#a2c5bd', 'Vapeur discrète des conduits du vaisseau ou du processeur atmosphérique.'),
  authored('fiorina-furnace', ['Alien 3'], /fiorina|furnace|leadwork/i, 'embers', '#df8749', 'Chaleur et petites braises des fonderies de Fiorina 161.'),
  authored('camera-cafe-machine', ['Camera Cafe'], /caf[eé]|bureau|couloir|office/i, 'coffee-steam', '#d6b68d', 'Vapeur de la machine à café sur le côté du couloir, sans bonus de combat.'),
  authored('heat-waterfront', ['Godzilla The Animated Series'], /bay|waterfront|heat|h\.e\.a\.t|jamaica|manhattan/i, 'water-ripples', '#65b7b0', 'Reflets de l’eau du front de mer H.E.A.T., sans ajouter de monstre au décor.'),
  authored('mako-reactor-1', ['Final Fantasy VII'], /mako|reactor|midgar/i, 'mako-flow', '#63e5b1', 'Flux vert de Mako derrière les passerelles du réacteur.'),
  authored('alive-led-pyramid', ['Daft Punk'], /alive|pyramid|led/i, 'led-pyramid', '#76d5ff', 'Balayage lent des arêtes de la pyramide LED Alive 2007.'),
  authored('rammstein-feuerzone', ['Rammstein'], /feuerzone|stadium|tower/i, 'tower-heat', '#ee9959', 'Chaleur lente dans les tours du plateau, sans jet de flamme dans l’arène.'),
  authored('magical-mirai-lights', ['Vocaloid'], /mirai|concert|projection|shibuya/i, 'concert-lights', '#71e3dc', 'Projecteurs lents de Magical Mirai et du plateau de projection.'),
  authored('nazarick-throne', ['Overlord Anime'], /nazarick|throne|lemegeton/i, 'candlelight', '#b3a1ed', 'Scintillement doux des lumières du trône de Nazarick.'),
  authored('kaamelott-arches', ['Kaamelott'], /table ronde|kaamelott|cour|chateau/i, 'candlelight', '#e2b779', 'Lueur chaude aux arches de la salle de la Table Ronde.'),
  authored('aburaya-boiler', ['Voyage de Chihiro'], /aburaya|bathhouse|boiler/i, 'vent-steam', '#ead9b0', 'Vapeur montante des bains et de l’accès à la chaufferie.'),
  authored('curien-laboratory', ['House of the Dead', 'House of the Dead 3'], /curien|laboratory|efi|facility/i, 'lab-monitors', '#8cc6ad', 'Voyants discrets dans le laboratoire de Curien ou le complexe EFI.'),
  authored('shin-tokyo-evacuation', ['Godzilla'], /shin|evacuation|tokyo/i, 'city-lights', '#dfa36b', 'Lumières lointaines de la grille d’évacuation de Tokyo.'),
  authored('night-city-neon', ['Cyberpunk: Edgerunners'], /night city|santo domingo|arasaka/i, 'neon-signals', '#e4dc59', 'Éclairage de la route et signaux au loin de Night City.'),
  authored('tokyo-ghoul-rain', ['Tokyo Ghoul'], /rooftop|rain/i, 'rain', '#af9bb8', 'Pluie fine devant les surfaces déjà décrites comme humides de Tokyo.'),
  authored('cartenon-blue-flames', ['Solo Leveling'], /cartenon|double.dungeon/i, 'candlelight', '#719ddf', 'Lueurs bleues du Double Donjon, sans portail ou invocation ajouté.'),
  authored('infinity-castle-panels', ['Demon Slayer'], /infinity castle|tatami/i, 'castle-panels', '#d39c72', 'Parallaxe lente des cadres de bois dans le fond du Château de l’Infini.'),
  authored('namek-water', ['Dragon Ball Z'], /namek/i, 'water-ripples', '#8fc7b2', 'Petits reflets d’eau du champ de bataille de Namek.'),
  authored('pingu-snow', ['Pingu'], /igloo|village|fishing/i, 'snow', '#dcecf3', 'Neige légère du village d’igloos.'),
  authored('outpost31-cold', ['The Thing'], /outpost|blood test/i, 'cold-haze', '#c0d2df', 'Brume froide discrète près des bords de la salle de l’Outpost 31.'),
  authored('thalassa-testimony', ['Thalassa Mnémique'], /r[eé]cif|salt archive|memory.coral|testimony/i, 'testimony-ribbons', '#8ae0da', 'Rubans bioluminescents du Récif des Registres, selon le canon original du projet.'),
  authored('meridien-clockwork', ['Méridien Creux'], /cadran|chronobank|clockwork|dial/i, 'clock-dials', '#e0b165', 'Rotation lente des cadrans lointains de la Chronobanque, selon le canon original du projet.'),
  authored('viridienne-orbits', ['Viridienne Ultime'], /orbit|star.seed|root.sun|cosmic garden/i, 'orbital-seeds', '#bddea0', 'Graines lumineuses sur les orbites du jardin, selon le canon original du projet.'),
  authored('neon-requiem-rainline', ['Neon Requiem'], /nadir|rainline|acid rain/i, 'rain', '#a5b8d4', 'Pluie du Rainline Bazaar, selon le canon original du projet.')
]);

// Physical adaptation only: terms name actual surfaces/props in authored data.
// Faction, genre, a random hash and the mere universe name cannot pick a motif.
const PHYSICAL_MOTIFS = Object.freeze([
  { match: /snow|snowfield|alpine|igloo|neige|glacier|arctic|winter/i, effect: 'snow', color: '#d7e7ec' },
  { match: /rain.dark|rain.line|acid rain|rainy|rainfall|pluie/i, effect: 'rain', color: '#aebac9' },
  { match: /fog|brouillard|mist|brume/i, effect: 'cold-haze', color: '#b9c6cb' },
  { match: /lava|furnace|leadwork|feuer|charred|scorched|combustion|boiler|fonderie/i, effect: 'embers', color: '#ce9568' },
  { match: /water|waterfront|ocean|canal|bathysphere|flood|river|pond|lake|submerged|shore|tide|undersea|beach|pools/i, effect: 'water-ripples', color: '#83b7c0' },
  { match: /current junction|blood.vessel|reproductive.tract/i, effect: 'testimony-ribbons', color: '#c3a8aa' },
  { match: /jungle|forest|canopy|meadow|moss|garden|roots|rainforest|for[eê]t/i, effect: 'foliage', color: '#a6c4a2' },
  { match: /led|concert|performance|theat(re|er)|floor.show|rock.off|live club|club 30|studio|scene|sc[eè]ne|\bstage\b|soundstage|video.wall|projector|kami.band.risers/i, effect: 'concert-lights', color: '#bdb1ce' },
  { match: /data.lattice|white digital/i, effect: 'network-traces', color: '#bfc8d1' },
  { match: /laboratory|research|reactor|containment|machine.shop|robotics|test chamber|cyberbrain|circuit|alloy|armor|hangar|steel|industrial|factory|assembly|conveyor|railway|crusher/i, effect: 'lab-monitors', color: '#a1bfc8' },
  { match: /city|street|rooftop|highway|metropol|tokyo|asphalt|boulevard|rue|ville|urban|town|plaza|road|freeway|block.party/i, effect: 'city-lights', color: '#c9b7a0' },
  { match: /wood|timber|tatami|castle|chateau|temple|stone|masonry|ruins|dungeon|dojo|library|hall|corridor|room|concrete|salon|bureau|crater|sand|earth|floor|vault|atelier|wreck|pyramid|ramp|passage|aisle|dock|court|alley|bunker|trench|pub|yard|school|class|stair|lawn|residence|foyer|basement|bridge|apartment|attic|warehouse|outpost|museum|house|pens|pillar|sanctuary|checkpoint|field|cabin|throne|circus|theme.park|playground|cave|desert|headquarters|fortress|workshop|village|clearing|junkyard|dust/i, effect: 'dust', color: '#b7af9f' }
]);

const textValue = value => typeof value === 'string' ? value : value && typeof value === 'object'
  ? [value.fr, value.en].filter(item => typeof item === 'string').join(' ')
  : '';
const validColor = (value, fallback) => /^#[0-9a-f]{6}$/i.test(value || '') ? value : fallback;
const wrap = (value, size) => ((value % size) + size) % size;

export function getStageAtmosphereProfile(stageOrUniverse = {}) {
  const stage = typeof stageOrUniverse === 'string' ? { universe: stageOrUniverse } : (stageOrUniverse || {});
  const lore = getStageLoreProfile(stage);
  const level = getRecentUniverseLevelProfile(stage.universe);
  const stageName = textValue(stage.name);
  // Fighter's lobby label is not a physical place; its universe lore is the
  // source until the player selects a concrete location.
  const concreteStageName = /^A\.R\.C\.A\. Impact Arena\s*-/i.test(stageName) ? '' : stageName;
  const stageLocation = [concreteStageName, textValue(stage.description), textValue(stage.location)].filter(Boolean).join(' ');
  // A concrete stage name wins over the universe-wide list of possible places.
  // For example Cell Games must not inherit Namek water or the Time Chamber.
  const sourceText = stageLocation || [lore?.canonicalName, lore?.visualAnchor].filter(Boolean).join(' ');
  const universes = lore?.universes || [stage.universe];
  const specific = AUTHORED_STAGE_ATMOSPHERES.find(profile => (
    profile.universes.some(universe => universes.includes(universe)) && profile.anchor.test(sourceText)
  ));
  const physicalFromLocation = specific ? null : PHYSICAL_MOTIFS.find(profile => profile.match.test(sourceText));
  const physical = physicalFromLocation || (specific ? null : PHYSICAL_MOTIFS.find(profile => profile.match.test(level?.material?.pattern || '')));
  // Defaults are explicit reference scenes for roster universes with no scene
  // supplied. A concrete caller-provided scene ALWAYS wins, even if its visual
  // motif is unknown: choosing a different famous place would be misleading.
  const universeDefault = !stageLocation && !specific && !physical
    ? getUniverseStageAtmosphereDefault(stage.universe)
    : null;
  const effect = specific?.effect || physical?.effect || universeDefault?.effect || null;
  const matchedSourceText = specific || physicalFromLocation ? sourceText : (level?.material?.pattern || '');
  const sourceMatchedMotif = specific ? matchedSourceText.match(specific.anchor)?.[0]
    : physical ? matchedSourceText.match(physical.match)?.[0] : null;
  const sourceFields = Object.freeze([
    ...(stageLocation ? ['stage.name/description/location'] : []),
    ...(!stageLocation && lore ? ['stageLoreProfiles.canonicalName/visualAnchor'] : []),
    ...(level && (!physicalFromLocation || level.material?.edge) ? ['recentUniverseLevels.material'] : []),
    ...(universeDefault ? ['stageAtmosphereUniverseDefaults.' + stage.universe] : [])
  ]);
  const sceneAnimation = getStageAnimationProfile(stage);
  return Object.freeze({
    id: specific?.id || (universeDefault ? `universe-default:${stage.universe}` : effect ? `physical-${effect}` : sceneAnimation?.id || 'unconfigured'),
    universe: stage.universe || null,
    effect,
    color: validColor(universeDefault?.color || level?.material?.edge, specific?.color || physical?.color || '#adbcc5'),
    description: specific?.description || universeDefault?.motif || (effect ? 'Animation physique adaptée aux surfaces et accessoires décrits pour ce lieu.' : 'Aucun motif de décor explicite disponible.'),
    fidelity: specific || universeDefault ? STAGE_ATMOSPHERE_FIDELITY.authored : effect ? STAGE_ATMOSPHERE_FIDELITY.physical : STAGE_ATMOSPHERE_FIDELITY.unavailable,
    selection: universeDefault ? 'universe-default' : stageLocation ? 'stage-scene' : lore ? 'universe-lore' : physical ? 'level-material' : 'unavailable',
    sourceFields,
    sourceAnchor: stageLocation || lore?.canonicalName || universeDefault?.location || null,
    sourceMatchedMotif: sourceMatchedMotif || universeDefault?.motif || null,
    sourceWork: universeDefault?.sourceWork || null,
    sourceReference: universeDefault?.sourceReference || null,
    sourceSceneEvidence: universeDefault?.sourceSceneEvidence || null,
    sourceDefinitionFidelity: universeDefault?.fidelity || null,
    referenceUrls: lore?.referenceUrls || Object.freeze(universeDefault?.sourceReference?.startsWith('https://') ? [universeDefault.sourceReference] : []),
    sourceAuditStatus: lore?.auditStatus || (universeDefault ? 'ADAPTATION-NON-VALIDEE' : null),
    sourceVisualValidation: 'not-validated-1:1',
    renderingKind: sceneAnimation?.renderingKind || 'procedural-atmosphere',
    sceneAnimation,
    placement: universeDefault?.placement || null,
    gameplayEffect: 'none',
    enabled: Boolean((effect || sceneAnimation) && !stage.disableStageAtmosphere && !stage.disableStageAnimations)
  });
}

const strokePath = (ctx, points) => {
  ctx.beginPath();
  points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.stroke();
};

function drawAtmosphere(ctx, effect, width, height, time) {
  switch (effect) {
    case 'desert-drift': {
      for (let drift = 0; drift < 9; drift++) {
        const progress = wrap(time * 0.025 + drift * 0.137, 1);
        const x = width * progress;
        const y = height * (0.43 + (drift % 4) * 0.035);
        ctx.globalAlpha = 0.035 * Math.sin(progress * Math.PI);
        ctx.beginPath();
        ctx.ellipse(x, y + Math.sin(time * 0.18 + drift) * height * 0.008, width * (0.035 + drift % 3 * 0.013), height * 0.008, -0.05, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case 'starfield': {
      for (let star = 0; star < 24; star++) {
        const x = width * wrap(star * 0.38196601125 + time * 0.0008, 1);
        const y = height * (0.1 + wrap(star * 0.61803398875, 0.39));
        ctx.globalAlpha = 0.07 + (1 + Math.sin(time * 0.28 + star)) * 0.035;
        ctx.fillRect(x, y, star % 5 === 0 ? 2 : 1, 1);
      }
      break;
    }
    case 'aurora': {
      for (let band = 0; band < 4; band++) {
        ctx.globalAlpha = 0.028;
        ctx.lineWidth = Math.max(2, height * 0.009);
        strokePath(ctx, Array.from({ length: 20 }, (_, index) => [
          width * (0.025 + index * 0.05),
          height * (0.19 + band * 0.025 + Math.sin(index * 0.27 + time * 0.09 + band) * 0.04)
        ]));
      }
      break;
    }
    case 'spores': {
      for (let mote = 0; mote < 17; mote++) {
        const progress = wrap(time * 0.013 + mote * 0.61803398875, 1);
        const x = width * wrap(mote * 0.38196601125 + Math.sin(time * 0.17 + mote) * 0.01, 1);
        const y = height * (0.54 - progress * 0.43);
        ctx.globalAlpha = 0.1 * Math.sin(progress * Math.PI);
        ctx.beginPath();
        ctx.arc(x, y, Math.max(0.7, height * 0.002), 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case 'matrix-code': {
      ctx.globalAlpha = 0.11;
      for (let column = 0; column < 14; column++) {
        const x = width * (0.03 + column * 0.072);
        for (let symbol = 0; symbol < 4; symbol++) {
          const y = height * (0.08 + wrap(time * 0.035 + column * 0.19 + symbol * 0.042, 0.47));
          ctx.fillRect(x, y, Math.max(1, width * 0.002), 3);
          if ((column + symbol) % 2) ctx.fillRect(x + 3, y + 1, 2, 1);
        }
      }
      break;
    }
    case 'network-traces': {
      for (let line = 0; line < 6; line++) {
        const y = height * (0.13 + line * 0.073);
        const x = width * (line % 2 ? 0.69 : 0.08);
        ctx.globalAlpha = 0.055;
        strokePath(ctx, [[x, y], [x + width * 0.07, y], [x + width * 0.1, y + height * 0.035], [x + width * 0.19, y + height * 0.035]]);
        ctx.globalAlpha = 0.14;
        const progress = wrap(time * 0.09 + line * 0.17, 1);
        ctx.fillRect(x + progress * width * 0.19, y + (progress > 0.5 ? height * 0.035 : 0), 3, 2);
      }
      break;
    }
    case 'gate-ripples': {
      const radius = Math.min(width * 0.12, height * 0.24);
      for (let ring = 0; ring < 5; ring++) {
        const progress = wrap(time * 0.16 + ring / 5, 1);
        ctx.globalAlpha = 0.13 * (1 - progress);
        ctx.beginPath();
        ctx.ellipse(width * 0.76, height * 0.34, radius * progress, radius * 1.05 * progress, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    }
    case 'coffee-steam':
    case 'vent-steam':
    case 'cold-haze': {
      const coffee = effect === 'coffee-steam';
      for (let plume = 0; plume < (coffee ? 3 : 6); plume++) {
        const progress = wrap(time * (coffee ? 0.12 : 0.055) + plume / 6, 1);
        const x = coffee ? width * 0.12 : width * (plume % 2 ? 0.91 : 0.09);
        const y = height * (0.57 - progress * 0.24);
        ctx.globalAlpha = (coffee ? 0.13 : 0.055) * Math.sin(progress * Math.PI);
        ctx.beginPath();
        ctx.ellipse(x + Math.sin(progress * 5 + plume) * width * 0.012, y, width * (coffee ? 0.012 : 0.08), height * 0.018, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case 'mako-flow':
    case 'testimony-ribbons': {
      ctx.globalAlpha = 0.09;
      for (let column = 0; column < 5; column++) {
        const x = width * (0.06 + column * 0.22);
        strokePath(ctx, Array.from({ length: 9 }, (_, index) => [
          x + Math.sin(time * 0.55 + index * 0.65 + column) * width * 0.014,
          height * (0.16 + index * 0.042)
        ]));
      }
      break;
    }
    case 'water-ripples': {
      for (let ripple = 0; ripple < 9; ripple++) {
        ctx.globalAlpha = 0.04 + (Math.sin(time * 0.7 + ripple) + 1) * 0.025;
        const x = width * (0.04 + ripple * 0.105);
        const y = height * (0.52 + ripple % 3 * 0.025);
        ctx.fillRect(x + Math.sin(time * 0.22 + ripple) * width * 0.01, y, width * (0.035 + ripple % 2 * 0.015), Math.max(1, height * 0.002));
      }
      break;
    }
    case 'led-pyramid': {
      const top = [width * 0.5, height * 0.12];
      const left = [width * 0.32, height * 0.56];
      const right = [width * 0.68, height * 0.56];
      ctx.globalAlpha = 0.08;
      strokePath(ctx, [left, top, right, left]);
      for (let row = 0; row < 5; row++) {
        const progress = wrap(time * 0.08 + row / 5, 1);
        ctx.globalAlpha = 0.08 * (1 - progress);
        strokePath(ctx, [[top[0] + (left[0] - top[0]) * progress, top[1] + (left[1] - top[1]) * progress], [top[0] + (right[0] - top[0]) * progress, top[1] + (right[1] - top[1]) * progress]]);
      }
      break;
    }
    case 'concert-lights': {
      ctx.globalAlpha = 0.035;
      for (let light = 0; light < 4; light++) {
        const x = width * (0.12 + light * 0.25);
        const sway = Math.sin(time * 0.16 + light) * width * 0.035;
        ctx.beginPath();
        ctx.moveTo(x, height * 0.08);
        ctx.lineTo(x + sway - width * 0.035, height * 0.56);
        ctx.lineTo(x + sway + width * 0.035, height * 0.56);
        ctx.closePath();
        ctx.fill();
      }
      break;
    }
    case 'castle-panels': {
      ctx.globalAlpha = 0.065;
      for (let frame = 0; frame < 4; frame++) {
        const x = width * (0.06 + frame * 0.265) + Math.sin(time * 0.12 + frame) * width * 0.009;
        ctx.strokeRect(x, height * 0.13, width * 0.09, height * 0.36);
        strokePath(ctx, [[x + width * 0.045, height * 0.13], [x + width * 0.045, height * 0.49]]);
      }
      break;
    }
    case 'clock-dials':
    case 'orbital-seeds': {
      const orbital = effect === 'orbital-seeds';
      ctx.globalAlpha = 0.08;
      for (let index = 0; index < 3; index++) {
        const x = width * (0.17 + index * 0.32);
        const y = height * (0.27 + index % 2 * 0.12);
        const radius = Math.min(width * 0.052, height * 0.09);
        const angle = time * (orbital ? 0.12 : 0.055) + index * 2;
        ctx.beginPath();
        ctx.ellipse(x, y, radius, radius * (orbital ? 0.45 : 1), 0, 0, Math.PI * 2);
        ctx.stroke();
        if (orbital) {
          ctx.beginPath();
          ctx.arc(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius * 0.45, 2.3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          strokePath(ctx, [[x, y], [x + Math.sin(angle) * radius * 0.8, y - Math.cos(angle) * radius * 0.8]]);
          strokePath(ctx, [[x, y], [x + Math.sin(angle / 12 + index) * radius * 0.5, y - Math.cos(angle / 12 + index) * radius * 0.5]]);
        }
      }
      break;
    }
    case 'lab-monitors':
    case 'neon-signals':
    case 'city-lights':
    case 'candlelight':
    case 'tower-heat': {
      const count = effect === 'tower-heat' ? 2 : 9;
      for (let index = 0; index < count; index++) {
        const x = width * (0.08 + index * (count === 2 ? 0.82 : 0.105));
        const y = height * (0.24 + index % 3 * 0.075);
        ctx.globalAlpha = 0.055 + (Math.sin(time * 0.65 + index * 1.8) + 1) * 0.025;
        const tall = effect === 'candlelight' || effect === 'tower-heat';
        ctx.fillRect(x, y, Math.max(2, width * (tall ? 0.008 : 0.013)), height * (tall ? 0.055 : 0.008));
      }
      break;
    }
    case 'rain':
    case 'snow':
    case 'embers':
    case 'foliage':
    case 'dust': {
      const rain = effect === 'rain';
      const snow = effect === 'snow';
      const embers = effect === 'embers';
      const foliage = effect === 'foliage';
      const count = rain ? 28 : snow ? 18 : 12;
      ctx.globalAlpha = rain ? 0.105 : snow ? 0.18 : 0.13;
      for (let index = 0; index < count; index++) {
        const speed = rain ? 0.2 : snow ? 0.035 : 0.02;
        const progress = wrap(index * 0.61803398875 + time * speed, 1);
        const x = wrap(index * 0.38196601125 + time * (rain ? -0.008 : 0.004) + Math.sin(time * 0.25 + index) * 0.004, 1) * width;
        const y = height * (0.08 + (embers ? 1 - progress : progress) * 0.5);
        if (rain) strokePath(ctx, [[x, y], [x - width * 0.002, y + height * 0.018]]);
        else ctx.fillRect(x, y, foliage ? 4 : 2, snow || foliage ? 2 : 1);
      }
      break;
    }
  }
}

/** Draw after the backdrop, before platforms, telegraphs, actors and HUD. */
export function renderStageAtmosphere(ctx, { stage = {}, width, height, elapsedSeconds = 0, reducedMotion = false } = {}) {
  if (getStageAnimationProfile(stage)?.enabled) {
    return renderStageAnimation(ctx, { stage, width, height, elapsedSeconds, reducedMotion });
  }
  const profile = getStageAtmosphereProfile(stage);
  if (!ctx || !profile.enabled || !Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0) return false;
  const seconds = Number.isFinite(elapsedSeconds) ? Math.max(0, elapsedSeconds) : 0;
  // Freeze the drawing for reduced motion; no wall-clock or random state makes
  // pause, replay and deterministic screenshots keep the same presentation.
  const time = reducedMotion || stage.reducedMotion ? 0 : seconds;
  ctx.save();
  try {
    ctx.beginPath();
    ctx.rect(0, height * 0.065, width, height * 0.55);
    ctx.clip();
    ctx.strokeStyle = profile.color;
    ctx.fillStyle = profile.color;
    ctx.lineWidth = Math.max(1, Math.min(2, width / 1000));
    ctx.globalCompositeOperation = 'source-over';
    if (profile.placement) {
      const { x, y, spread } = profile.placement;
      ctx.translate(width * (x - spread * 0.5), height * (y - 0.3 * 0.8));
      ctx.scale(spread, 0.8);
    }
    drawAtmosphere(ctx, profile.effect, width, height, time);
  } finally {
    ctx.restore();
  }
  return true;
}
