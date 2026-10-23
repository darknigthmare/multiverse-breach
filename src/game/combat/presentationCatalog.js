import { getHeroSpriteSheetSrc, getSpriteSheetLayout, getSpriteFrameForLayout } from '../spriteAssets.js';
import { getMeleeAnimationManifest } from '../melee/meleeAnimationManifest.js';
import { WAVE_3_PRESENTATION_DEFINITIONS } from './presentationCatalogWave3.js';
import { WAVE_6_PRESENTATION_DEFINITIONS } from './presentationCatalogWave6.js';
import { WAVE_7_PRESENTATION_DEFINITIONS } from './presentationCatalogWave7.js';
import { WAVE_8_PRESENTATION_DEFINITIONS } from './presentationCatalogWave8.js';
import { WAVE_9_PRESENTATION_DEFINITIONS } from './presentationCatalogWave9.js';
import { WAVE_10_PRESENTATION_DEFINITIONS } from './presentationCatalogWave10.js';
import { WAVE_11_PRESENTATION_DEFINITIONS } from './presentationCatalogWave11.js';
import { getCharacterAnimationFrame } from './characterAnimationCatalog.js';

export const PRESENTATION_PHASES = Object.freeze(['intro', 'outro', 'fatality', 'victory', 'defeat', 'roundVictory', 'roundDefeat']);
const durations = { intro: 1.7, outro: 1.9, fatality: 2.4, victory: 1.9, defeat: 1.9, roundVictory: 1.3, roundDefeat: 1.3 };
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const freeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
};
const beat = (at, state, frame, x = 0, y = 0, scale = 1, opacity = 1) => ({ at, state, frame, x, y, scale, opacity });

// These recipes interpolate existing character art. They never create hitboxes,
// change HP, emit gameplay events, or claim to be source-game cinematics.
const motions = {
  nativeWave11Scene: [beat(0, 'idle', 0), beat(0.34, 'idle', 1), beat(0.67, 'idle', 2), beat(1, 'idle', 3)],
  nativeWave10Scene: [beat(0, 'idle', 0), beat(0.34, 'idle', 1), beat(0.67, 'idle', 2), beat(1, 'idle', 3)],
  bladeReady: [beat(0, 'run', 0, -42), beat(0.35, 'idle', 0), beat(0.65, 'attack', 0), beat(1, 'idle', 1)],
  fistReady: [beat(0, 'idle', 0, -18), beat(0.3, 'idle', 1), beat(0.68, 'attack', 0, 0, -4), beat(1, 'idle', 1)],
  kiReady: [beat(0, 'idle', 0), beat(0.35, 'idle', 1, 0, -3), beat(0.7, 'idle', 2, 0, -8), beat(1, 'idle', 1)],
  ninjaReady: [beat(0, 'run', 0, -45), beat(0.45, 'idle', 0), beat(0.72, 'idle', 2), beat(1, 'idle', 1)],
  gunReady: [beat(0, 'run', 0, -30), beat(0.42, 'idle', 0), beat(0.75, 'attack', 0), beat(1, 'idle', 1)],
  staffReady: [beat(0, 'idle', 0, -15), beat(0.4, 'idle', 1), beat(0.75, 'attack', 0), beat(1, 'idle', 0)],
  braceReady: [beat(0, 'idle', 0), beat(0.4, 'defense', 0), beat(0.72, 'defense', 1), beat(1, 'idle', 0)],
  walkExit: [beat(0, 'idle', 0), beat(0.28, 'idle', 1), beat(0.45, 'run', 0, -5), beat(0.75, 'run', 2, -65), beat(1, 'run', 3, -120, 0, 1, 0.2)],
  ninjaExit: [beat(0, 'idle', 0), beat(0.3, 'run', 0, 0, -4), beat(0.65, 'run', 2, -80, -16), beat(1, 'run', 3, -155, -28, 1, 0.1)],
  floatExit: [beat(0, 'idle', 1), beat(0.3, 'idle', 0, 0, -15), beat(0.7, 'run', 1, -45, -45), beat(1, 'run', 2, -100, -80, 1, 0.2)],
  bladeWin: [beat(0, 'attack', 3), beat(0.3, 'idle', 0, 0, -2), beat(0.7, 'idle', 1), beat(1, 'idle', 0)],
  fistWin: [beat(0, 'attack', 3), beat(0.3, 'idle', 1, 0, -5), beat(0.7, 'idle', 2), beat(1, 'idle', 1)],
  calmWin: [beat(0, 'idle', 0), beat(0.35, 'idle', 1, 0, -3), beat(0.7, 'idle', 2), beat(1, 'idle', 0)],
  gunWin: [beat(0, 'attack', 3), beat(0.3, 'idle', 0), beat(0.65, 'idle', 1), beat(1, 'idle', 0)],
  collapse: [beat(0, 'hit', 0), beat(0.35, 'hit', 1, -7, 3), beat(0.72, 'hit', 2, -10, 5), beat(1, 'hit', 3, -10, 5)],
  recover: [beat(0, 'hit', 0, -10, 3), beat(0.4, 'hit', 1, -5, 2), beat(0.7, 'idle', 0), beat(1, 'idle', 1)],
  bladeRound: [beat(0, 'attack', 3), beat(0.4, 'idle', 0), beat(0.7, 'attack', 0), beat(1, 'idle', 0)],
  fistRound: [beat(0, 'attack', 3), beat(0.35, 'idle', 1), beat(0.75, 'attack', 0), beat(1, 'idle', 1)],
  calmRound: [beat(0, 'idle', 0), beat(0.4, 'idle', 1), beat(0.7, 'idle', 2), beat(1, 'idle', 0)],
  slashFinal: [beat(0, 'idle', 0), beat(0.22, 'attack', 0), beat(0.42, 'attack', 1, 45, -5), beat(0.58, 'attack', 2, 80, -8), beat(0.76, 'attack', 3, 110), beat(1, 'idle', 0, 70)],
  omnislash: [beat(0, 'attack', 0), beat(0.18, 'attack', 1, 30, -12), beat(0.31, 'attack', 2, 110, -35), beat(0.44, 'attack', 1, 45, -70), beat(0.57, 'attack', 2, 130, -50), beat(0.72, 'attack', 3, 95), beat(1, 'idle', 0, 60)],
  fistFinal: [beat(0, 'idle', 1), beat(0.25, 'attack', 0, -12), beat(0.46, 'attack', 1, 45, -15), beat(0.62, 'attack', 2, 85, -4), beat(0.8, 'attack', 3, 80), beat(1, 'idle', 1, 45)],
  beamFinal: [beat(0, 'idle', 1), beat(0.2, 'attack', 2), beat(0.42, 'attack', 2, -8), beat(0.55, 'attack', 3, -3), beat(0.85, 'attack', 3), beat(1, 'idle', 1)],
  cannonFinal: [beat(0, 'idle', 0), beat(0.25, 'attack', 0), beat(0.5, 'attack', 1, -5), beat(0.65, 'attack', 2, -12), beat(0.84, 'attack', 3), beat(1, 'idle', 0)],
  orbFinal: [beat(0, 'idle', 1), beat(0.22, 'attack', 2), beat(0.43, 'attack', 2, -8), beat(0.56, 'attack', 3, 45), beat(0.76, 'attack', 3, 125, -8), beat(1, 'idle', 0, 75)],
  rushFinal: [beat(0, 'idle', 0), beat(0.3, 'attack', 1, -14), beat(0.5, 'attack', 2, 20, -7), beat(0.65, 'attack', 3, 120, -12), beat(0.8, 'attack', 3, 150), beat(1, 'idle', 0, 90)],
  skyFinal: [beat(0, 'idle', 0), beat(0.25, 'attack', 0, 0, -30), beat(0.45, 'attack', 1, 35, -100), beat(0.65, 'attack', 2, 80, -60), beat(0.8, 'attack', 3, 105), beat(1, 'idle', 0, 70)],
  catastropheFinal: [beat(0, 'attack', 0), beat(0.25, 'attack', 1, 10, -108), beat(0.5, 'attack', 2, 10, -108), beat(0.75, 'attack', 3, 10, -108), beat(1, 'idle', 0, 10)],
  noMercyFinal: [beat(0, 'idle', 0), beat(0.2, 'attack', 0, -8), beat(0.36, 'attack', 1, 12, -5), beat(0.55, 'attack', 2, 52, -8), beat(0.76, 'attack', 3, 78), beat(1, 'idle', 0, 45)],
  desperadoFinal: [beat(0, 'idle', 0), beat(0.18, 'attack', 0, 10, -35), beat(0.37, 'attack', 1, 18, -84), beat(0.59, 'attack', 2, 18, -84), beat(0.78, 'attack', 3, 14, -30), beat(1, 'idle', 0, 10)],
  myFinalHeavenFinal: [beat(0, 'idle', 0), beat(0.2, 'run', 0, -20), beat(0.37, 'run', 2, 30, -4), beat(0.52, 'attack', 1, 105, -8), beat(0.67, 'attack', 2, 170, -5), beat(0.82, 'attack', 3, 170), beat(1, 'idle', 1, 140)],
  theEndFinal: [beat(0, 'idle', 0), beat(0.24, 'idle', 1), beat(0.47, 'idle', 2, 0, -3), beat(0.72, 'idle', 3, 0, -3), beat(1, 'idle', 0)],
  hyperShotFinal: [beat(0, 'idle', 0), beat(0.2, 'attack', 0), beat(0.4, 'attack', 1, -4), beat(0.58, 'attack', 2, -9), beat(0.78, 'attack', 3, -5), beat(1, 'idle', 0)],
  supportFinal: [beat(0, 'idle', 0), beat(0.24, 'support', 0), beat(0.42, 'support', 1, 0, -4), beat(0.66, 'support', 2, 0, -7), beat(0.84, 'support', 3, 0, -3), beat(1, 'idle', 0)],
  standFinal: [beat(0, 'idle', 0), beat(0.22, 'special', 0), beat(0.44, 'special', 1, 0, -2), beat(0.62, 'special', 2, 0, -2), beat(0.82, 'special', 3), beat(1, 'idle', 0)],
  specialFinal: [beat(0, 'idle', 0), beat(0.25, 'special', 0), beat(0.5, 'special', 1), beat(0.7, 'special', 2), beat(0.85, 'special', 3), beat(1, 'idle', 0)],
  anchorIntro: [beat(0, 'intro', 0), beat(0.35, 'intro', 1), beat(0.7, 'intro', 2), beat(1, 'intro', 3)],
  anchorVictory: [beat(0, 'victory', 0), beat(0.35, 'victory', 1), beat(0.7, 'victory', 2), beat(1, 'victory', 3)],
  anchorDefeat: [beat(0, 'defeat', 0), beat(0.35, 'defeat', 1), beat(0.7, 'defeat', 2), beat(1, 'defeat', 3)]
};

const define = (heroId, universe, sourceReference, sourceAction, phaseNames, motionIds, effectKind, missingAssets = []) => ({
  heroId, universe, sourceReference, sourceAction,
  phases: Object.fromEntries(PRESENTATION_PHASES.map((phase, index) => [phase, {
    id: `${heroId}:${phase}:authored-v1`, heroId, universe, phase,
    name: phaseNames[index], sourceAction: phase === 'fatality' ? sourceAction : phaseNames[index],
    sourceReference, duration: durations[phase], beats: motions[motionIds[index]].map(entry => ({ ...entry })),
    effect: { kind: phase === 'fatality' ? effectKind : motionIds[index] === 'kiReady' ? 'ki-aura' : 'none', startsAt: phase === 'fatality' ? 0.2 : 0.25, endsAt: 0.92 },
    missingAssets: [...missingAssets],
    provenance: { kind: 'explicit-character-presentation', canonicalSequence: false, networkVerified: false, visualFidelity: 'existing-character-frames-and-authored-choreography' }
  }]))
});

// Each ID selects its own seven named scenes and its own source action.
// Shared interpolation recipes do not select names, worlds, equipment or powers.
export const CHARACTER_PRESENTATIONS = freeze({
  ...Object.fromEntries(WAVE_10_PRESENTATION_DEFINITIONS.map(args => [args[0], define(...args)])),
  ...Object.fromEntries(WAVE_11_PRESENTATION_DEFINITIONS.map(args => [args[0], define(...args)])),
  ...Object.fromEntries(WAVE_3_PRESENTATION_DEFINITIONS.map(args => [args[0], define(...args)])),
  ...Object.fromEntries(WAVE_6_PRESENTATION_DEFINITIONS.map(args => [args[0], define(...args)])),
  ...Object.fromEntries(WAVE_7_PRESENTATION_DEFINITIONS.map(args => [args[0], define(...args)])),
  ...Object.fromEntries(WAVE_8_PRESENTATION_DEFINITIONS.map(args => [args[0], define(...args)])),
  ...Object.fromEntries(WAVE_9_PRESENTATION_DEFINITIONS.map(args => [args[0], define(...args)])),
  "cloud_ff7": define("cloud_ff7", "Final Fantasy VII", "Final Fantasy VII (1997) : Buster Sword et Limit Break Omnislash. Mouvements ici adaptés des poses du sprite, sans reproduction de la cinématique originale.", "Omnislash", ["Buster Sword à l'épaule", "Départ de Cloud, lame abaissée", "Omnislash, enchaînement final", "Repos de la Buster Sword", "Appui sur la Buster Sword", "Retour à la garde de Cloud", "Cloud reprend son souffle"], ["bladeReady", "walkExit", "omnislash", "bladeWin", "collapse", "bladeRound", "recover"], "multi-slash", []),
  "tifa_ff7": define("tifa_ff7", "Final Fantasy VII", "Final Fantasy VII (1997) : gants de combat et Limit Break Final Heaven de Tifa. L'impact au poing est une présentation adaptée et non une exécution.", "Final Heaven", ["Tifa ajuste ses gants", "Tifa desserre les poings", "Final Heaven, impact du poing", "Tifa lève les bras", "Tifa reprend appui", "Garde de boxe de Tifa", "Tifa rétablit son équilibre"], ["fistReady", "walkExit", "fistFinal", "fistWin", "collapse", "fistRound", "recover"], "fist-impact", []),
  "aerith_ff7": define("aerith_ff7", "Final Fantasy VII", "Final Fantasy VII (1997) : Aerith emploie un bâton et Great Gospel est un Limit Break de soin et de protection. Aucune attaque de mêlée n'est attribuée à ce final.", "Great Gospel", ["Aerith présente son bâton", "Salut d'Aerith", "Great Gospel, bénédiction", "Bâton levé d'Aerith", "Aerith prend appui", "Signe protecteur d'Aerith", "Aerith reprend son souffle"], ["staffReady", "walkExit", "supportFinal", "calmWin", "collapse", "calmRound", "recover"], "gospel", []),
  "barret_ff7": define("barret_ff7", "Final Fantasy VII", "Final Fantasy VII (1997) : Catastrophe fait décoller Barret ; maintenu en vol, il dirige le rayon de son bras-canon vers le sol avant d'atterrir. Déplacement, dessin du rayon et durée adaptés au combat 2D, sans certification de la cinématique originale.", "Catastrophe", ["Inspection du bras-canon", "Barret abaisse son canon", "Catastrophe, rayon descendant", "Barret tient sa position", "Barret pose un genou", "Contrôle du canon de Barret", "Barret reprend appui"], ["gunReady", "walkExit", "catastropheFinal", "gunWin", "collapse", "calmRound", "recover"], "catastrophe", []),
  "redxiii_ff7": define("redxiii_ff7", "Final Fantasy VII", "Final Fantasy VII (1997) : Red XIII est un quadrupède à queue enflammée ; Cosmo Memory utilise une énergie astrale. Pas de posture d'humain armé.", "Cosmo Memory", ["Veille de Red XIII", "Red XIII quitte le cercle", "Cosmo Memory, lumière astrale", "Red XIII relève la tête", "Red XIII se replie", "Red XIII retrouve son appui", "Red XIII reprend son souffle"], ["braceReady", "walkExit", "specialFinal", "calmWin", "collapse", "calmRound", "recover"], "cosmo-stars", []),
  "yuffie_ff7": define("yuffie_ff7", "Final Fantasy VII", "Final Fantasy VII (1997) : Yuffie manie le shuriken et All Creation produit un important rayon d'énergie ; projection adaptée.", "All Creation", ["Yuffie prépare son shuriken", "Yuffie repart d'un bond", "All Creation, projection d'énergie", "Shuriken au repos de Yuffie", "Yuffie reprend appui", "Yuffie reprend la garde", "Yuffie retrouve son équilibre"], ["ninjaReady", "ninjaExit", "beamFinal", "bladeWin", "collapse", "bladeRound", "recover"], "all-creation", []),
  "vincent_ff7": define("vincent_ff7", "Final Fantasy VII", "Final Fantasy VII (1997) : le dernier Limit Break de Vincent transforme son corps en Chaos. Un atlas natif distinct montre le démon ailé pendant le buff réel et la finale. Le contrôle manuel, la durée et les attaques restent adaptés ; Berserk, Chaos Saber et Satan Slam ne sont pas reproduits.", "Chaos", ["Vincent vérifie son arme", "Vincent se retire", "Préparation de Chaos", "Arme abaissée de Vincent", "Vincent prend appui", "Vincent rétablit sa visée", "Vincent reprend son souffle"], ["gunReady", "walkExit", "supportFinal", "gunWin", "collapse", "calmRound", "recover"], "limit-aura", []),
  "squall_ff8": define("squall_ff8", "Final Fantasy VIII", "Final Fantasy VIII (1999) : Squall utilise une gunblade et Lion Heart est son finisher de Renzokuken ; tailles adaptées avec les frames de la gunblade.", "Lion Heart", ["Garde de gunblade de Squall", "Squall abaisse sa gunblade", "Lion Heart, tailles successives", "Gunblade de Squall au repos", "Squall prend appui", "Squall rétablit sa garde", "Squall reprend son souffle"], ["bladeReady", "walkExit", "omnislash", "bladeWin", "collapse", "bladeRound", "recover"], "gunblade-slash", []),
  "rinoa_ff8": define("rinoa_ff8", "Final Fantasy VIII", "Final Fantasy VIII (1999) : Wishing Star est un Combine de Rinoa avec Angelo, distinct d’Angel Wing. Les nouvelles illustrations natives des phases finale et super intègrent le chien et leur bond partagé ; elles condensent cette attaque sans fournir une entité Angelo autonome ni certifier la cinématique originale.", "Wishing Star", ["Rinoa prépare son appel", "Rinoa salue son partenaire", "Préparation de Wishing Star", "Rinoa abaisse son arme", "Rinoa reprend appui", "Rinoa prépare la suite", "Rinoa reprend son souffle"], ["staffReady", "walkExit", "supportFinal", "calmWin", "collapse", "calmRound", "recover"], "wishing-star", []),
  "quistis_ff8": define("quistis_ff8", "Final Fantasy VIII", "Final Fantasy VIII (1999) : Quistis utilise un fouet et Shockwave Pulsar est une technique de Blue Magic ; onde astrale adaptée, sans invocation inventée.", "Shockwave Pulsar", ["Quistis prépare son fouet", "Quistis rassemble son fouet", "Shockwave Pulsar, onde de Blue Magic", "Quistis baisse son fouet", "Quistis prend appui", "Quistis rétablit la distance", "Quistis retrouve son équilibre"], ["bladeReady", "walkExit", "specialFinal", "bladeWin", "collapse", "bladeRound", "recover"], "pulsar", []),
  "seifer_ff8": define("seifer_ff8", "Final Fantasy VIII", "Final Fantasy VIII (1999) : Seifer manie Hyperion à une main ; Fire Cross — No Mercy associe son attaque de gunblade à une décharge enflammée. La courte avancée et les flammes sont adaptées au cadre 2D, sans changer les dégâts du match ni lui attribuer une Limit Break de Squall.", "No Mercy", ["Seifer relève Hyperion", "Seifer baisse sa gunblade", "No Mercy, Fire Cross de Seifer", "Hyperion sur l’épaule de Seifer", "Seifer prend appui sur sa jambe", "Seifer rétablit sa garde à une main", "Seifer reprend son équilibre"], ["bladeReady", "walkExit", "noMercyFinal", "bladeWin", "collapse", "bladeRound", "recover"], "tyrant-flame", []),
  "laguna_ff8": define("laguna_ff8", "Final Fantasy VIII", "Final Fantasy VIII (1999) : Desperado fait sauter Laguna, tirer à la mitrailleuse depuis sa corde puis lancer une grenade avant de retomber. La suspension est représentée par un déplacement vertical ; armes et pose de tir restent celles de Laguna, sans laser ni transformation.", "Desperado", ["Laguna vérifie sa mitrailleuse", "Laguna abaisse son arme", "Desperado, suspension et tir de Laguna", "Laguna relâche sa visée", "Laguna pose un genou", "Laguna vérifie sa ligne de tir", "Laguna se redresse après la manche"], ["gunReady", "walkExit", "desperadoFinal", "gunWin", "collapse", "calmRound", "recover"], "desperado", []),
  "zell_ff8": define("zell_ff8", "Final Fantasy VIII", "Final Fantasy VIII (1999) : My Final Heaven est une finition de Duel où Zell prend un immense élan avant une percussion au poing. Course et impact sont condensés dans l’arène, sans prétendre reproduire le tour du monde ni ajouter une arme à ce combattant à mains nues.", "My Final Heaven", ["Zell ajuste ses gants", "Zell desserre sa garde", "My Final Heaven, course et percussion", "Zell lève le poing", "Zell reprend appui", "Zell retrouve sa garde de Duel", "Zell reprend son souffle"], ["fistReady", "walkExit", "myFinalHeavenFinal", "fistWin", "collapse", "fistRound", "recover"], "fist-impact", []),
  "selphie_ff8": define("selphie_ff8", "Final Fantasy VIII", "Final Fantasy VIII (1999) : The End est un résultat rare de Slots qui présente une prairie fleurie et le carton de fin. Cette finale de présentation reste calme et sans gore ; ses poses et le tableau natif ne causent aucun dégât, n’effacent aucun adversaire et ne rejouent pas le calcul d’issue du match.", "The End", ["Selphie présente son nunchaku", "Selphie salue avant de partir", "The End, tableau fleuri de Slots", "Selphie salue la victoire", "Selphie reprend doucement appui", "Selphie se prépare à la manche suivante", "Selphie retrouve son équilibre"], ["staffReady", "walkExit", "theEndFinal", "calmWin", "collapse", "calmRound", "recover"], "the-end-meadow", []),
  "irvine_ff8": define("irvine_ff8", "Final Fantasy VIII", "Final Fantasy VIII (1999) : Irvine manie un fusil ; Hyper Shot est une option de Shot utilisant les Pulse Ammo. Visée, préparation et recul du tir sont adaptés à ses poses, sans rayon de gunblade ni équipement de Laguna inventé.", "Hyper Shot", ["Irvine vérifie son fusil", "Irvine baisse sa visée", "Hyper Shot, tir aux Pulse Ammo", "Irvine abaisse son fusil", "Irvine pose un genou", "Irvine contrôle sa visée", "Irvine se redresse après la manche"], ["gunReady", "walkExit", "hyperShotFinal", "gunWin", "collapse", "calmRound", "recover"], "hyper-shot-pulse", []),
  "lightning_ff13": define("lightning_ff13", "Final Fantasy XIII", "Final Fantasy XIII (2009) : Lightning emploie sa gunblade et Army of One enchaîne des tailles et des tirs. Les déplacements sont adaptés au cadre 2D.", "Army of One", ["Lightning prépare sa gunblade", "Lightning range sa garde", "Army of One, enchaînement de Lightning", "Gunblade de Lightning abaissée", "Lightning reprend appui", "Lightning rétablit sa visée", "Lightning reprend son souffle"], ["bladeReady", "walkExit", "omnislash", "bladeWin", "collapse", "bladeRound", "recover"], "gunblade-slash", []),
  "fang_ff13": define("fang_ff13", "Final Fantasy XIII", "Final Fantasy XIII (2009) : Fang utilise une lance et Highwind se termine par une frappe plongeante ; trajectoire adaptée à l'arène.", "Highwind", ["Fang prépare sa lance", "Fang se retire, lance basse", "Highwind, plongeon de Fang", "Fang relève sa lance", "Fang se stabilise", "Fang rétablit sa garde", "Fang reprend son souffle"], ["bladeReady", "walkExit", "skyFinal", "bladeWin", "collapse", "bladeRound", "recover"], "spear-dive", []),
  "vanille_ff13": define("vanille_ff13", "Final Fantasy XIII", "Final Fantasy XIII (2009) : Vanille utilise son bâton et sa compétence Death. Le final de présentation n'inflige aucun dégât supplémentaire et n'est pas une exécution.", "Death", ["Vanille présente son bâton", "Vanille salue avant de partir", "Death, motif de magie de Vanille", "Vanille relève son bâton", "Vanille prend appui", "Vanille rétablit sa position", "Vanille reprend son souffle"], ["staffReady", "walkExit", "supportFinal", "calmWin", "collapse", "calmRound", "recover"], "dark-petals", []),
  "noctis_ff15": define("noctis_ff15", "Final Fantasy XV", "Final Fantasy XV (2016) : Noctis utilise les armes royales de l'Armiger ; les silhouettes d'armes sont des traits de lumière adaptés, pas de nouveaux équipements.", "Armiger", ["Noctis prépare sa lame", "Noctis quitte sa position", "Armiger, cercle d'armes royales", "Noctis abaisse sa lame", "Noctis prend appui", "Noctis rétablit sa garde", "Noctis reprend son souffle"], ["bladeReady", "walkExit", "slashFinal", "bladeWin", "collapse", "bladeRound", "recover"], "armiger", []),
  "gladiolus_ff15": define("gladiolus_ff15", "Final Fantasy XV", "Final Fantasy XV (2016) : Gladiolus utilise une grande épée et la technique Dawnhammer ; impact vertical adapté des poses de son arme.", "Dawnhammer", ["Gladiolus présente sa grande épée", "Gladiolus baisse son arme", "Dawnhammer, frappe verticale", "Grande épée au repos de Gladiolus", "Gladiolus prend appui", "Gladiolus rétablit sa garde", "Gladiolus reprend son souffle"], ["bladeReady", "walkExit", "skyFinal", "bladeWin", "collapse", "bladeRound", "recover"], "heavy-blade", []),
  "ignis_ff15": define("ignis_ff15", "Final Fantasy XV", "Final Fantasy XV (2016) : Overwhelm d'Ignis coordonne une attaque de groupe. La scène montre ses dagues et le signal tactique ; les autres membres ne sont pas inventés hors de l'équipe.", "Overwhelm", ["Ignis prépare ses dagues", "Ignis rassemble ses dagues", "Overwhelm, signal tactique", "Ignis abaisse ses dagues", "Ignis reprend appui", "Ignis vérifie sa garde", "Ignis retrouve son équilibre"], ["bladeReady", "walkExit", "slashFinal", "bladeWin", "collapse", "bladeRound", "recover"], "dagger-cross", ["overwhelm-party-animation"]),
  "lunafreya_ff15": define("lunafreya_ff15", "Final Fantasy XV", "Final Fantasy XV (2016) : Lunafreya est l'Oracle et utilise une bénédiction de soutien ; ce final ne lance aucune attaque offensive.", "Oracle's Blessing", ["Lunafreya présente son trident", "Salut de l'Oracle", "Bénédiction de l'Oracle", "Trident de Lunafreya au repos", "Lunafreya prend appui", "Lunafreya rétablit sa position", "Lunafreya reprend son souffle"], ["staffReady", "walkExit", "supportFinal", "calmWin", "collapse", "calmRound", "recover"], "oracle-light", []),
  "naruto_uzumaki_young": define("naruto_uzumaki_young", "Naruto", "Naruto, première série : Naruto forme le Rasengan dans sa paume et avance pour toucher. Les frames réelles attack 2 et 3 du sprite montrent cette préparation et cette ruée.", "Rasengan", ["Naruto ajuste sa garde", "Naruto repart en courant", "Rasengan, formation et ruée", "Signe amical du jeune Naruto", "Naruto reprend appui", "Naruto rétablit sa garde", "Naruto reprend son souffle"], ["ninjaReady", "ninjaExit", "orbFinal", "fistWin", "collapse", "fistRound", "recover"], "rasengan", []),
  "sasuke_uchiha_young": define("sasuke_uchiha_young", "Naruto", "Naruto, première série : Sasuke rassemble la foudre du Chidori dans sa main puis charge ; aucune capacité de Rinnegan n'est ajoutée à sa version jeune.", "Chidori", ["Sasuke prépare sa garde", "Sasuke quitte le terrain", "Chidori, charge du jeune Sasuke", "Sasuke baisse sa main", "Sasuke prend appui", "Sasuke rétablit sa distance", "Sasuke reprend son souffle"], ["ninjaReady", "ninjaExit", "rushFinal", "calmWin", "collapse", "fistRound", "recover"], "chidori", []),
  "sakura_haruno_young": define("sakura_haruno_young", "Naruto", "Naruto, première série : Sakura prépare le Bunshin no Jutsu ; les illustrations natives montrent apparition et dissipation du clone illusoire. Le soutien ne cible que Sakura, sans soin, dégâts de clone ni force de Shippuden.", "Bunshin no Jutsu", ["Sakura prépare son signe de main", "Sakura salue puis repart", "Bunshin, préparation de Sakura", "Sakura se redresse", "Sakura reprend appui", "Sakura prépare la prochaine garde", "Sakura reprend son souffle"], ["ninjaReady", "walkExit", "supportFinal", "calmWin", "collapse", "calmRound", "recover"], "clone-smoke", []),
  "naruto_six_paths": define("naruto_six_paths", "Naruto Shippuden", "Naruto Shippuden : Naruto Six Paths forme et lance le Rasenshuriken ; le disque et les traînées utilisent son attaque source, sans le confondre avec Naruto enfant.", "Wind Release: Rasenshuriken", ["Naruto Six Paths se place", "Naruto Six Paths quitte le terrain", "Rasenshuriken, disque lancé", "Naruto Six Paths salue", "Naruto Six Paths reprend appui", "Naruto Six Paths reprend la garde", "Naruto Six Paths reprend son souffle"], ["kiReady", "ninjaExit", "beamFinal", "fistWin", "collapse", "fistRound", "recover"], "rasenshuriken", []),
  "sasuke_rinnegan": define("sasuke_rinnegan", "Naruto Shippuden", "Naruto Shippuden : Indra's Arrow est tirée par le Susanoo de Sasuke. L'asset Susanoo manque ; le cadrage humain montre la préparation et l'énergie, sans inventer un Susanoo miniature.", "Indra's Arrow", ["Sasuke Rinnegan abaisse son sabre", "Sasuke Rinnegan se retire", "Indra's Arrow, préparation de l'arc", "Sasuke Rinnegan reprend sa posture", "Sasuke Rinnegan prend appui", "Sasuke Rinnegan rétablit sa garde", "Sasuke Rinnegan reprend son souffle"], ["bladeReady", "walkExit", "beamFinal", "bladeWin", "collapse", "bladeRound", "recover"], "indra-arrow", ["sasuke-susanoo-archer"]),
  "kakashi_war": define("kakashi_war", "Naruto Shippuden", "Naruto Shippuden, Kakashi de la guerre : Kamui utilise le Mangekyo Sharingan et la distorsion spatiale. Le vortex reste un effet de présentation sans téléportation de gameplay.", "Kamui", ["Kakashi prépare son œil", "Kakashi quitte sa position", "Kamui, distorsion de Kakashi", "Kakashi abaisse sa garde", "Kakashi reprend appui", "Kakashi rétablit sa distance", "Kakashi reprend son souffle"], ["ninjaReady", "ninjaExit", "specialFinal", "calmWin", "collapse", "calmRound", "recover"], "kamui", []),
  "boruto_uzumaki": define("boruto_uzumaki", "Boruto: Naruto Next Generations", "Boruto: Naruto Next Generations : le Vanishing Rasengan disparaît pendant sa trajectoire. Opacité et mouvement sont adaptés à sa capacité de projectile.", "Vanishing Rasengan", ["Boruto prépare sa garde", "Boruto repart en courant", "Vanishing Rasengan, disparition", "Boruto salue", "Boruto reprend appui", "Boruto rétablit sa garde", "Boruto reprend son souffle"], ["ninjaReady", "ninjaExit", "orbFinal", "fistWin", "collapse", "fistRound", "recover"], "vanishing-rasengan", []),
  "sarada_uchiha": define("sarada_uchiha", "Boruto: Naruto Next Generations", "Boruto: Naruto Next Generations : Sarada apprend et utilise Chidori ; charge de foudre adaptée à son propre sprite, sans transformation de Sasuke ajoutée.", "Chidori", ["Sarada prépare sa garde", "Sarada quitte le terrain", "Chidori de Sarada", "Sarada rétablit sa posture", "Sarada prend appui", "Sarada reprend sa garde", "Sarada reprend son souffle"], ["ninjaReady", "ninjaExit", "rushFinal", "calmWin", "collapse", "fistRound", "recover"], "chidori", []),
  "mitsuki_boruto": define("mitsuki_boruto", "Boruto: Naruto Next Generations", "Boruto: Naruto Next Generations : Mitsuki utilise Snake Lightning ; le tracé électrique ondule et ne devient pas un rayon mécanique.", "Lightning Release: Snake Lightning", ["Mitsuki prépare ses mains", "Mitsuki se retire", "Snake Lightning, foudre ondulante", "Mitsuki retrouve sa posture", "Mitsuki reprend appui", "Mitsuki rétablit sa distance", "Mitsuki reprend son souffle"], ["ninjaReady", "walkExit", "beamFinal", "calmWin", "collapse", "calmRound", "recover"], "snake-lightning", []),
  "goku_dbz": define("goku_dbz", "Dragon Ball Z", "Dragon Ball Z : Goku charge le Kamehameha près de sa hanche puis projette ses paumes. Les frames attack 2 et 3 du sprite existant montrent la charge et le tir.", "Kamehameha", ["Goku se met en garde", "Goku salue et s'envole", "Kamehameha, charge et projection", "Goku salue son adversaire", "Goku reprend appui", "Goku rétablit sa garde", "Goku reprend son souffle"], ["kiReady", "floatExit", "beamFinal", "fistWin", "collapse", "fistRound", "recover"], "kamehameha", []),
  "vegeta_dbz": define("vegeta_dbz", "Dragon Ball Z", "Dragon Ball Z, saga Cell : Vegeta ouvre les bras avant de réunir ses mains devant lui pour Final Flash. Les mouvements 2D ne certifient pas la pose exacte de l'anime.", "Final Flash", ["Vegeta, garde et bras croisés", "Vegeta se retire en vol", "Final Flash, charge et faisceau", "Vegeta reprend sa posture fière", "Vegeta pose un genou", "Vegeta rétablit sa garde", "Vegeta reprend son souffle"], ["kiReady", "floatExit", "beamFinal", "calmWin", "collapse", "fistRound", "recover"], "final-flash", []),
  "piccolo_dbz": define("piccolo_dbz", "Dragon Ball Z", "Dragon Ball Z : Piccolo prépare le Makankosappo avec deux doigts près de son front puis projette un rayon en spirale. Effet de spirale adapté de la technique.", "Special Beam Cannon", ["Piccolo rassemble son ki", "Piccolo quitte la zone en vol", "Makankosappo, spirale de Piccolo", "Piccolo retrouve sa posture", "Piccolo prend appui", "Piccolo rétablit sa garde", "Piccolo reprend son souffle"], ["kiReady", "floatExit", "beamFinal", "calmWin", "collapse", "calmRound", "recover"], "special-beam-cannon", []),
  "masterchief": define("masterchief", "Halo", "Halo 3 : le Spartan Laser charge un tir rouge. Le pack Master Chief existant contient des lignes de défense et d'attaque qui sont sélectionnées explicitement.", "Spartan Laser", ["Contrôle d'armure de Master Chief", "Master Chief abaisse son arme", "Spartan Laser, charge de Chief", "Master Chief baisse sa visée", "Master Chief pose un genou", "Master Chief vérifie son secteur", "Master Chief reprend appui"], ["braceReady", "walkExit", "cannonFinal", "gunWin", "collapse", "calmRound", "recover"], "spartan-laser", []),
  "arbiter": define("arbiter", "Halo", "Halo 2 : Thel Vadam utilise l'épée à énergie et peut activer son camouflage ; la ruée conserve une lame et non un fusil.", "Energy Sword Lunge", ["Garde à l'épée de l'Arbiter", "L'Arbiter abaisse sa lame", "Ruée à l'épée à énergie", "L'Arbiter rétablit sa posture", "L'Arbiter prend appui", "L'Arbiter reprend sa garde", "L'Arbiter reprend son souffle"], ["bladeReady", "walkExit", "rushFinal", "bladeWin", "collapse", "bladeRound", "recover"], "energy-sword", []),
  "johnson": define("johnson", "Halo", "Halo 3, fin de campagne : Johnson porte et utilise le Spartan Laser ; le tir est une arme chargée et non un pouvoir de zone.", "Spartan Laser", ["Johnson contrôle son secteur", "Johnson baisse son arme", "Spartan Laser de Johnson", "Johnson rétablit sa position", "Johnson pose un genou", "Johnson vérifie sa visée", "Johnson reprend appui"], ["gunReady", "walkExit", "cannonFinal", "gunWin", "collapse", "calmRound", "recover"], "spartan-laser", []),
  "leon": define("leon", "Resident Evil", "Resident Evil 4 (2005) : Leon utilise le lance-roquettes spécial contre Saddler ; la propulsion et l'impact sont présentés après confirmation du match, sans dégâts supplémentaires.", "Special Rocket Launcher", ["Leon contrôle son arme", "Leon baisse sa visée", "Tir du lance-roquettes spécial", "Leon rétablit sa posture", "Leon prend appui", "Leon vérifie son secteur", "Leon reprend son souffle"], ["gunReady", "walkExit", "cannonFinal", "gunWin", "collapse", "calmRound", "recover"], "rocket-launcher", []),
  "jill": define("jill", "Resident Evil", "Resident Evil 3 (2020) : Jill utilise le FINGeR contre Nemesis. Le canon reste un équipement massif à préparer, pas une magie personnelle.", "FINGeR Railgun", ["Jill contrôle son équipement", "Jill abaisse son arme", "FINGeR, charge et tir", "Jill relâche sa visée", "Jill reprend appui", "Jill vérifie sa ligne", "Jill reprend son souffle"], ["gunReady", "walkExit", "cannonFinal", "gunWin", "collapse", "calmRound", "recover"], "railgun", []),
  "rebecca_chambers": define("rebecca_chambers", "Resident Evil", "Resident Evil 0 : Rebecca est médecin et utilise les herbes de soin ; la finale présente ses gestes de soutien sans explosion ou attaque au patient.", "First Aid", ["Rebecca prépare ses soins", "Rebecca range son matériel", "Premiers soins de Rebecca", "Rebecca vérifie son matériel", "Rebecca reprend appui", "Rebecca prépare le prochain soin", "Rebecca reprend son souffle"], ["staffReady", "walkExit", "supportFinal", "calmWin", "collapse", "calmRound", "recover"], "first-aid", []),
  "doomslayer": define("doomslayer", "Doom", "DOOM Eternal : le BFG-9000 projette une sphère verte avec des arcs d'énergie. Le finisher est un tir d'arme, sans exécution gore.", "BFG-9000", ["Le Slayer inspecte son arme", "Le Slayer abaisse le BFG", "BFG-9000, sphère d'énergie", "Le Slayer reprend sa garde", "Le Slayer prend appui", "Le Slayer vérifie son secteur", "Le Slayer reprend position"], ["gunReady", "walkExit", "cannonFinal", "gunWin", "collapse", "calmRound", "recover"], "bfg-orb", []),
  "doom_marine_classic": define("doom_marine_classic", "Doom", "DOOM (1993) : le Marine classique utilise le BFG-9000 à projectile vert. Sa scène respecte sa version classique, sans Crucible ou équipement d'Eternal.", "BFG-9000", ["Le Marine prépare son arme", "Le Marine quitte son secteur", "BFG classique, projectile vert", "Le Marine rétablit sa position", "Le Marine reprend appui", "Le Marine contrôle sa ligne", "Le Marine retrouve sa garde"], ["gunReady", "walkExit", "cannonFinal", "gunWin", "collapse", "calmRound", "recover"], "bfg-orb", []),
  "solbadguy": define("solbadguy", "Guilty Gear", "Guilty Gear -Strive- : Tyrant Rave est une frappe courte et enflammée de Sol ; déplacement et combustion suivent sa technique plutôt qu'un faisceau pleine arène.", "Tyrant Rave", ["Sol prépare son arme", "Sol quitte sa garde", "Tyrant Rave, frappe enflammée", "Sol abaisse son arme", "Sol reprend appui", "Sol rétablit sa garde", "Sol reprend son souffle"], ["bladeReady", "walkExit", "fistFinal", "bladeWin", "collapse", "fistRound", "recover"], "tyrant-flame", []),
  "ky": define("ky", "Guilty Gear", "Guilty Gear -Strive- : Ky charge entouré d'électricité lors de Ride the Lightning ; le tracé suit son déplacement de mêlée.", "Ride the Lightning", ["Ky prépare son épée", "Ky abaisse sa lame", "Ride the Lightning, charge électrique", "Ky rétablit sa posture", "Ky prend appui", "Ky reprend sa garde", "Ky reprend son souffle"], ["bladeReady", "walkExit", "rushFinal", "bladeWin", "collapse", "bladeRound", "recover"], "ride-lightning", []),
  "player_anchor": define("player_anchor", "Nexus de Convergence", "src/game/melee/meleeAnimationManifest.js : Player Anchor possède déjà les animations dédiées intro, victory, defeat et special sur les cinq sheets mêlée. Ces assets sont lus avant les poses génériques.", "Commandement d Ancrage", ["Ancrage initial d'A.R.C.A.", "Retour de l'Anchor", "Impulsion du Nexus", "Victoire de l'Anchor", "Repli de l'Anchor", "Signature de manche de l'Anchor", "L'Anchor reprend sa garde"], ["anchorIntro", "walkExit", "specialFinal", "anchorVictory", "anchorDefeat", "anchorVictory", "recover"], "nexus-grid", []),
  "arca_mirelle": define("arca_mirelle", "Nexus de Convergence", "src/game/heroes.js : Mirelle utilise les fils et cartes de résonance ; son pack melee-combat possède des lignes de défense réelles. La suture conserve son identité de trame.", "Suture du Voile", ["Mirelle prépare ses cartes", "Mirelle rassemble ses fils", "Suture du Voile, trame de Mirelle", "Mirelle referme sa trame", "Mirelle reprend appui", "Mirelle ajuste sa garde", "Mirelle reprend son souffle"], ["braceReady", "walkExit", "supportFinal", "calmWin", "collapse", "calmRound", "recover"], "suture-threads", []),
  "arca_bastion": define("arca_bastion", "Nexus de Convergence", "src/game/heroes.js et spriteAssets.js : Bastion Korr utilise son armement et ses barricades ; son pack universel possède des lignes support et special dédiées.", "Verrou de Convergence", ["Bastion prépare son rempart", "Bastion sécurise son départ", "Verrou de Convergence", "Bastion garde le secteur", "Bastion reprend appui", "Bastion vérifie son rempart", "Bastion reprend position"], ["braceReady", "walkExit", "specialFinal", "gunWin", "collapse", "calmRound", "recover"], "convergence-lock", []),
});

export function resolvePresentationScript(actor, phase) {
  const heroId = actor?.sourceHeroId || actor?.sourceId || actor?.id;
  const record = CHARACTER_PRESENTATIONS[heroId];
  if (!record || record.universe !== actor?.universe || !record.phases[phase]) return null;
  return {
    ...record.phases[phase],
    beats: record.phases[phase].beats.map(entry => ({ ...entry })),
    effect: { ...record.phases[phase].effect },
    missingAssets: [...record.phases[phase].missingAssets],
    provenance: { ...record.phases[phase].provenance },
    actor: { ...actor, id: heroId }
  };
}

function resolveAsset(actor, poseState, col, stateElapsed, phase, progress) {
  const native = getCharacterAnimationFrame(actor, { phase, progress });
  if (native) return {
    kind: 'native-generated-character-animation', actorId: native.asset.heroId, sheet: native.asset.sheet,
    state: poseState, requestedState: poseState, row: native.row, col: native.col,
    columns: native.columns, rows: native.rows, dedicatedPhaseAsset: true
  };
  const manifest = getMeleeAnimationManifest(actor.id);
  const aliases = { attack: 'attackLight1', defense: 'shieldHold', hit: 'hitStun' };
  const requestedState = aliases[poseState] || poseState;
  if (manifest?.animations?.[requestedState]) {
    const entry = manifest.animations[requestedState];
    const absoluteFrame = Math.floor(stateElapsed * entry.fps);
    const frame = entry.loop ? absoluteFrame % entry.frameCount : Math.min(entry.frameCount - 1, absoluteFrame);
    return { kind: 'melee-manifest', actorId: actor.id, sheet: entry.sheet, state: poseState, requestedState, row: entry.row, col: entry.startColumn + frame, columns: manifest.columns, rows: manifest.rows, dedicatedPhaseAsset: ['intro', 'victory', 'defeat'].includes(poseState) };
  }
  let state = poseState;
  let sheet = getHeroSpriteSheetSrc({ ...actor, state }, 'melee');
  let layout = getSpriteSheetLayout(sheet);
  const actualStates = layout.rowByState ? Object.keys(layout.rowByState) : ['idle', 'run', 'attack', 'hit'];
  if (!actualStates.includes(state)) {
    state = state === 'support'
      ? (actualStates.includes('defense') ? 'defense' : 'idle')
      : state === 'special' ? 'attack' : state === 'defeat' ? 'hit' : 'idle';
    sheet = getHeroSpriteSheetSrc({ ...actor, state }, 'melee');
    layout = getSpriteSheetLayout(sheet);
  }
  const frame = getSpriteFrameForLayout(state, clamp(col, 0, layout.columns - 1) * 10, layout);
  return { kind: 'character-state-sheet', actorId: actor.id, sheet, state, requestedState: poseState, row: frame.row, col: frame.col, columns: layout.columns, rows: layout.rows, dedicatedPhaseAsset: false };
}

// Catastrophe is an airborne, downward cannon attack. Both battle supers and
// post-result scenes use this visual clock; neither helper changes combat data.
export function sampleCatastropheMotion(progressValue, impactProgress = 0.5, landingProgress = 0.75) {
  const actionProgress = clamp(Number(progressValue) || 0, 0, 1);
  const impact = clamp(Number(impactProgress) || 0.5, 0.05, 0.9);
  const landing = clamp(Number(landingProgress) || 0.75, impact + 0.01, 0.99);
  const progress = actionProgress < impact
    ? actionProgress * 0.5 / impact
    : actionProgress < landing
      ? 0.5 + (actionProgress - impact) * 0.25 / (landing - impact)
      : 0.75 + (actionProgress - landing) * 0.25 / (1 - landing);
  const beats = motions.catastropheFinal;
  let index = 0;
  while (index + 1 < beats.length && beats[index + 1].at <= progress) index += 1;
  const from = beats[index];
  const to = beats[Math.min(index + 1, beats.length - 1)];
  const t = to.at === from.at ? 0 : clamp((progress - from.at) / (to.at - from.at), 0, 1);
  return { progress, actionProgress, x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t };
}

export function getCatastropheBeamGeometry({ x, feetY, groundY, facing = 1, reach = 320, progress = 0, scale = 1 }) {
  const direction = facing < 0 ? -1 : 1;
  const muzzle = { x: x + direction * 52 * scale, y: feetY - 82 * scale };
  const target = { x: muzzle.x + direction * Math.max(0, reach), y: groundY - 6 * scale };
  return {
    muzzle, target,
    charging: progress >= 0.2 && progress < 0.5,
    firing: progress >= 0.5 && progress < 0.75,
    charge: clamp((progress - 0.2) / 0.3, 0, 1),
    fireProgress: clamp((progress - 0.5) / 0.25, 0, 1),
    scale
  };
}

export function samplePresentationScript(script, elapsedSeconds = 0) {
  if (!script?.beats?.length) return null;
  const progress = clamp((Number(elapsedSeconds) || 0) / script.duration, 0, 1);
  let index = 0;
  while (index + 1 < script.beats.length && script.beats[index + 1].at <= progress) index += 1;
  const from = script.beats[index];
  const to = script.beats[Math.min(index + 1, script.beats.length - 1)];
  const t = to.at === from.at ? 0 : clamp((progress - from.at) / (to.at - from.at), 0, 1);
  const mix = key => from[key] + (to[key] - from[key]) * t;
  let stateStart = index;
  while (stateStart > 0 && script.beats[stateStart - 1].state === from.state) stateStart -= 1;
  const stateElapsed = Math.max(0, elapsedSeconds - script.beats[stateStart].at * script.duration);
  const asset = resolveAsset(script.actor, from.state, from.frame, stateElapsed, script.phase, progress);
  return {
    poseState: asset.state, frame: asset.col, asset,
    x: mix('x'), y: mix('y'), scale: mix('scale'), opacity: mix('opacity'), progress,
    facing: script.phase === 'outro' && from.state === 'run' && script.beats.some(entry => entry.y === 0 && entry.x < -100) ? -1 : 1,
    stateElapsed,
    effect: { ...script.effect, active: progress >= script.effect.startsAt && progress <= script.effect.endsAt, progress: clamp((progress - script.effect.startsAt) / (script.effect.endsAt - script.effect.startsAt), 0, 1) }
  };
}
