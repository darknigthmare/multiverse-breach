// Reproduce the runtime coverage and source-access ledger from the repository:
// node docs/combat-fidelity-wave7-2026-10-20/stage-audit.mjs
// This does not recapture or overwrite the pre-edit preservation baseline.
import fs from 'node:fs';
import { HEROES_DB } from '../../src/game/heroes.js';
import { STAGE_ANIMATION_PROFILES, getStageAnimationProfile } from '../../src/game/melee/stageAnimationCatalog.js';
import { STAGE_ANIMATION_WAVE_7 } from '../../src/game/melee/stageAnimationCatalogWave7.js';
import { getStageAtmosphereProfile } from '../../src/game/melee/stageAtmosphere.js';
const directory = new URL('./', import.meta.url);
const previous = JSON.parse(fs.readFileSync(new URL('../combat-fidelity-wave6-2026-10-20/stage-coverage.json', directory), 'utf8'));
const baseline = JSON.parse(fs.readFileSync(new URL('stage-baseline.json', directory), 'utf8'));
const modes = ['Combat', 'Melee', 'RPG', 'Tactics'];
const rows = [...new Set(HEROES_DB.map(hero => hero.universe))].map(universe => {
  const atmosphere = getStageAtmosphereProfile({ universe });
  const mechanisms = Object.fromEntries(modes.map(mode => [mode, getStageAnimationProfile({ universe, mode })?.id || null]));
  return { universe, baseAtmosphereEnabled: atmosphere.enabled, baseAtmosphereStatus: atmosphere.status, baseAtmosphereEffect: atmosphere.effect, mechanisms, anyModeMechanism: Object.values(mechanisms).some(Boolean), everyModeMechanism: Object.values(mechanisms).every(Boolean), source1to1Validated: false };
});
const after = {
  universes: rows.length,
  withAnyModeMechanism: rows.filter(r => r.anyModeMechanism).length,
  withEveryModeMechanism: rows.filter(r => r.everyModeMechanism).length,
  baseAtmosphereOnly: rows.filter(r => !r.anyModeMechanism).length,
  byMode: Object.fromEntries(modes.map(mode => [mode, { mechanisms: rows.filter(r => r.mechanisms[mode]).length, baseAtmosphereOnly: rows.filter(r => !r.mechanisms[mode]).length }]))
};
// Access was performed on 20 October through explicit URL opens and focused
// finds. Re-running this local audit regenerates the ledger, not web requests.
const sourceNotes = [
  ['indexed original-game walkthrough', 'First World Bank security-gate drill / thermite distinction; full open failed', 'The original heist uses a drill on the security gate, then thermite at the vault floor.'],
  ['official DLC announcement', 'The Big Fucking Drill subsection', 'The Golden Grin Casino update names and describes customization of the BFD. The cutter internals and gantry path are not verified.'],
  ['original-level secrets guide', 'Hollywood Holocaust, projector-room secret', 'The cinema contains a projection room and projector. Reel geometry is a functional interpretation, not a photographed prop reconstruction.'],
  ['archived official level walkthrough', 'Rabid Transit station/train instructions', 'The archived 3D Realms guide describes subway stations and riding the train. No disputed level number is asserted.'],
  ['original-level account', 'I Like Trams subsection', 'A pulley mechanism calls the cable car between stations in Return to Castle Wolfenstein.'],
  ['published walkthrough', 'Cell-block elevator before cell B2', 'The New Order chapter 4 uses an upward elevator before entering cell B2. It is distinct from the coal-loader room.'],
  ['published walkthrough', 'Make A Friend console and three levers', 'Chapter 1 powers the toy-assembly machine and operates three levers. Blank parts replace living toy characters.'],
  ['published walkthrough', 'Game Station subsection: train-platform control-panel lever', 'The lever on the train platform opens the Musical Memory door. The train stays stationary; a railway-points function is not claimed.'],
  ['plot and release account', 'Chapter 1: Moving Pictures; 2017 release and 2018 remaster history', 'Henry repairs and activates the Ink Machine before flooding. Internal pump arrangement is an adaptation.'],
  ['indexed room reference', 'Toy Machine Room belt power / unclogging gears excerpt; full open failed', 'The toy room requires powering belts and clearing gears. Tooth count and transmission layout are authored.'],
  ['published walkthrough', 'How To Get The Algae Workshop Canister & Restore Power', 'A cart passes the pool and five motors; the cart returns if the player misses it. No enemies or canister progression is reproduced.'],
  ['published walkthrough', 'How to Solve the Exhibition Mirror Puzzle', 'Ceiling magnet reversals move red and blue platforms under the exhibition mirror. Exact room geometry is not verified.'],
  ['indexed published walkthrough', 'The City of the Sun, pair of elevators on southeastern mesa; full open returned403', 'Two large elevators connect Meridian and its lower town. Cage and rope layout is an authored functional interpretation.'],
  ['published walkthrough', 'Catching a Holo-Conveyor / hovering assembly line and underbars', 'Cauldron SIGMA contains hovering freight with bars beneath it. Rail path and carrier proportions are adapted.'],
  ['primary article by Dr Gears', 'Description, research cell109-B and two booths / copper tubes / selector and mainspring', 'The article describes screw drives, belts, pulleys and clockwork and two sliding-door booths. This is not a game-specific containment-site layout.'],
  ['primary article by Arcibi', 'Special Containment Procedures and Description', 'The machine occupies the second-floor personnel break room, with QWERTY input, coin slot and paper-cup dispensing. No anomalous retrieval is simulated.'],
  ['film-prop account', 'The Lament Configuration, sliding and rotating panels; discussion of1987 film', 'The box panels slide apart, rotate and return. The exact ornamental design and moves are not verified.'],
  ['indexed film reference', 'Leviathan rotating rhombus above the Labyrinth; full open failed', 'The 1988 film depicts a rotating suspended form above the Labyrinth. Its beams and realm effects are excluded.'],
  ['archived original-map description', 'Map Description: industrial smelter and namesake belt', 'The stock original DM-Conveyor map has an industrial smelter and conveyor belt. Exact track shape is adapted.'],
  ['archived original-map description', 'Map Description: Pressure hall / chamber and lateral buttons', 'The chamber closes through lateral buttons. Only empty exterior seals and a gauge are interpreted; the source damage trap is omitted.'],
  ['development account', '1995 factory experiments / Heavy Machinery and Generator Room', 'The factory levels used drop platforms, steam vents and heated pipes. This study uses only empty guided platforms and unheated pipe outlines.'],
  ['original-game walkthrough by Crazyreyn', 'Castle Machinery subsection, ordinary route before and after first checkpoint', 'The route repeatedly uses moving platforms upward between pipes. The green-gem shortcut is excluded.'],
  ['original-game walkthrough', 'Hurricos, Factory Glide1 / Factory Glide2', 'Buttons slow large rotating structures and the glide route crosses windmill mechanisms. No shutdown objective is reproduced.'],
  ['original-game walkthrough', 'Aquaria Towers, Moneybags submarine after the second filling', 'Moneybags offers a submarine that bypasses metal sharks. The empty craft adds no payment, transport or water-level changes.']
];
const checks = STAGE_ANIMATION_WAVE_7.map((p, i) => ({
  profileIds: [p.id], sourceUrl: p.sourceReference, sourceType: sourceNotes[i][0], readStatus: p.sourceAccess,
  locator: sourceNotes[i][1], fact: sourceNotes[i][2],
  locationOrFunctionSupportedByOpenedText: !p.sourceAccess.startsWith('indexed'),
  exactPropGeometryVerified: false, exactSourceLoopVerified: false, visual1to1Verified: false
}));
const sourceChecks = {
  date: '2026-10-20', method: 'Explicit web searches, full URL opens and focused finds. Readable text and indexed excerpts after failed/403 opens are distinguished. Reproduction of this local ledger does not repeat the web-access session.',
  scope: 'Narrow location/function/continuity support for24mechanisms; no direct quotations, images or official animation frames imported. Geometry, perspective, colors, distances, timing and reset cycles are authored.',
  globalCanon1to1Verified: false, globalVisual1to1Verified: false, officialAnimationFramesImported: 0,
  sourceReadCounts: {
    uniqueUrls: new Set(checks.map(c => c.sourceUrl)).size,
    profilesWithOpenedText: checks.filter(c => c.locationOrFunctionSupportedByOpenedText).length,
    profilesWithOnlyIndexedExcerpts: checks.filter(c => !c.locationOrFunctionSupportedByOpenedText).length,
    uniqueOpenedUrls: new Set(checks.filter(c => c.locationOrFunctionSupportedByOpenedText).map(c => c.sourceUrl)).size,
    uniqueIndexedOnlyUrls: new Set(checks.filter(c => !c.locationOrFunctionSupportedByOpenedText).map(c => c.sourceUrl)).size
  }, checks
};
const slugs = ['payday', 'duke', 'duke-nukem', 'wolfenstein', 'poppy', 'poppy-playtime', 'bendy', 'bendy-and-the-ink-machine', 'atomic-heart', 'horizon', 'horizon-zero-dawn', 'scp', 'scp-foundation', 'hellraiser', 'unreal', 'unreal-tournament', 'crash', 'crash-bandicoot', 'spyro'];
const publicRoot = new URL('../../public/', import.meta.url);
const localPaths = fs.readdirSync(publicRoot, { recursive: true }).map(String).filter(file => /\.(png|webp|json)$/.test(file) && slugs.some(slug => file.includes('/' + slug + '/') || file.endsWith('/' + slug + '.webp') || file.endsWith('/' + slug + '-smash-openai.png'))).map(file => 'public/' + file).sort();
const coverage = {
  date: '2026-10-20', scope: 'All525HEROES_DBuniverses; mode defaults measured without a concrete scene name. Concrete scene names override these reference defaults and may choose another profile or none.',
  baselineProfiles: baseline.profiles.length, addedProfiles: STAGE_ANIMATION_WAVE_7.length, totalProfiles: STAGE_ANIMATION_PROFILES.length,
  addedUniverses: [...new Set(STAGE_ANIMATION_WAVE_7.flatMap(p => p.universes))], before: previous.after, after,
  declaredProfileUniverseStringsIncludingNonRoster: new Set(STAGE_ANIMATION_PROFILES.flatMap(p => p.universes)).size,
  newOfficialAnimationFrames: 0, newEffectAtlases: 0, newStaticBackdropRegions: 0, source1to1Validated: 0, fidelityVerified: false, officialSourceFrames: false,
  mechanismGeometry: '24individually drawn scene mechanisms, without new image assets or backdrop composites.',
  timeSource: 'simulation-elapsed-seconds', reducedMotion: 'freeze-at-time-zero', gameplayEffect: 'none',
  preservationEvidence: {
    path: 'stage-baseline.json', definitions: baseline.profiles.length, drawingCommandHashes: baseline.profiles.reduce((n, p) => n + p.samples.length, 0), bitmapPixelComparison: false,
    note: 'Preservation SHA256 covers recorded Canvas commands at1040x460, without loading images. These are not screenshot/source-frame comparison hashes. Old files, bitmaps, reports and tests are not rewritten.'
  }, sourceChecks: 'stage-source-checks.json', browserEvidence: 'stage-browser.json',
  localAssetInventory: { paths: localPaths, count: localPaths.length, method: 'Read-only filename inventory for selected universes; filenames alone do not prove source frames or scene suitability. None is imported by the new profiles.', importedByNewMechanisms: 0, newImagesGenerated: 0 },
  profiles: STAGE_ANIMATION_WAVE_7.map(p => JSON.parse(JSON.stringify(p, (_, v) => v instanceof RegExp ? v.toString() : v))), rows
};
for (const [name, value] of [['stage-source-checks.json', sourceChecks], ['stage-coverage.json', coverage]]) fs.writeFileSync(new URL(name, directory), JSON.stringify(value, null, 2) + '\n');
const escape = s => String(s).replaceAll('|', '\\|');
const profileTable = STAGE_ANIMATION_WAVE_7.map(p => `| ${escape(p.universes[0])} | ${escape(p.sourceScene)} | \`${p.mechanism}\` | ${p.sourceAccess.startsWith('indexed') ? 'Extrait indexé seulement' : 'Texte ouvert et lu'} |`).join('\n');
const universeTable = rows.map(r => `| ${escape(r.universe)} | ${r.anyModeMechanism ? 'Mécanisme ciblé' : 'Ambiance de base seule'} | ${modes.map(mode => r.mechanisms[mode] ? `\`${r.mechanisms[mode]}\`` : '—').join(' | ')} |`).join('\n');
const report = `# Décors — vague 7, 20 octobre 2026

24 mécanismes supplémentaires couvrent 12 univers du roster auparavant sans mécanisme ciblé. Les 525 ambiances de base sont conservées. Aucune fidélité visuelle 1:1 n’est certifiée.

| Mesure | Avant | Après |
| --- | ---: | ---: |
| Définitions de mécanismes | ${coverage.baselineProfiles} | ${coverage.totalProfiles} |
| Univers du roster couverts dans au moins un mode | ${coverage.before.withAnyModeMechanism} | ${after.withAnyModeMechanism} |
| Univers couverts dans les quatre modes | ${coverage.before.withEveryModeMechanism} | ${after.withEveryModeMechanism} |
| Univers ayant seulement l’ambiance de base | ${coverage.before.baseAtmosphereOnly} | ${after.baseAtmosphereOnly} |

Couverture par mode : Combat ${after.byMode.Combat.mechanisms}, Mêlée ${after.byMode.Melee.mechanisms}, RPG ${after.byMode.RPG.mechanisms}, Tactique ${after.byMode.Tactics.mechanisms}. Les ${coverage.declaredProfileUniverseStringsIncludingNonRoster} chaînes d’univers déclarées incluent un ancien alias hors roster. La mesure porte donc bien sur ${after.withAnyModeMechanism} des 525 univers réels du roster. Les références par mode s’appliquent uniquement sans nom précis de scène ; un lieu concret inconnu ne reçoit aucun mécanisme ciblé.

## Ajouts

| Univers | Scène et version | Mécanisme dessiné | Accès à la référence principale |
| --- | --- | --- | --- |
${profileTable}

## Sources et adaptations

[Le registre des sources](stage-source-checks.json) distingue ${sourceChecks.sourceReadCounts.profilesWithOpenedText} profils appuyés par un texte ouvert et ${sourceChecks.sourceReadCounts.profilesWithOnlyIndexedExcerpts} par un extrait indexé seulement, soit ${sourceChecks.sourceReadCounts.uniqueUrls} URL distinctes. Il consigne le passage consulté et le fait restreint supporté. Les pages complètes de First World Bank, Toy Machine Room et Leviathan n’ont pas pu être ouvertes ; celle de Meridian a répondu 403. Les profils signalent ces limites. Aucun extrait de résultat de recherche n’est présenté comme une observation du modèle animé.

Le schéma du BFD est une adaptation mécanique appuyée par la page officielle du DLC, sans prétendre connaître ses organes internes. Le levier de Game Station commande une porte d’accès aux mini-jeux et le train reste à quai. SCP-914 suit la cellule 109-B du texte de Dr Gears ; SCP-294 suit la salle de pause du deuxième étage du texte d’Arcibi, sans importer un emplacement propre aux jeux. Ces deux articles du SCP Wiki sont attribués à leurs auteurs et publiés sous [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). Les silhouettes et transmissions sont créées pour le projet, sans reprise d’image ni de texte.

Les exclusions séparent PAYDAY: The Heist 2011 du remake PAYDAY 2, Duke DOS 1996 de DN64 / World Tour, RTCW 2001 de Tides of War / The New Order, les chapitres Poppy 1 et 2 de Project: Playtime, Bendy 2017 de Dark Revival, Horizon 2017 de Forbidden West / Remastered, Hellraiser 1987 de Hellbound 1988 et du reboot 2022, UT99 des remakes, Crash 1996 et Spyro 1999 de leurs remakes. Lieux, fonctions et continuités ont une référence ; contours, couleurs, distances, proportions, courbes et durées restent des adaptations sans certification 1:1.

L’inventaire relève ${localPaths.length} chemins locaux associés aux univers retenus. Aucun asset n’est importé par ces 24 nouveaux profils : 0 nouvelle image, 0 atlas, 0 région de fond recomposée et 0 frame officielle. Les atlas cosmétiques existants ne sont pas détournés en machines ou portails universels. Les ajouts sont des géométries décoratives ; aucune modification de PV, collisions, plateformes, dangers, inventaire, quête ou transport.

## Vérifications

La [baseline capturée avant modification](stage-baseline.json) conserve 137 définitions et 274 SHA256 de commandes Canvas à 1040×460, à 0 et 23 % de chaque période. Les tests exigent la conservation exacte des définitions et de toutes ces empreintes. Il s’agit de commandes enregistrées sans chargement d’image en Node, pas de comparaisons de pixels des anciens bitmaps. Aucun ancien profil, test, bitmap ou rapport n’est réécrit.

Les 6 tests dédiés passent : 24 géométries distinctes réellement mobiles, déterminisme, état de scène inchangé, câble de téléphérique fixe, suspente verticale de longueur constante, cordes d’ascenseurs à somme constante, bielles de longueur fixe et rayons des moulins. Les contraintes sont vérifiées sur les coordonnées réellement utilisées par le dessin, à six instants et quatre formats. Les 28 scènes rejetées protègent les continuités et les univers. Les scènes précises fonctionnent dans les quatre modes ; les deux drapeaux de désactivation n’émettent aucune commande. Les coordonnées restent finies et l’opacité faible ; le découpage commun réserve la partie basse du combat.

[Chromium](stage-browser.json) contrôle 24 mécanismes, 96 rendus des quatre modes et 72 formats supplémentaires : 360×780, 1920×480 et 512×512. Les pixels changent avec le temps de simulation, restent identiques en pause et se figent à zéro avec les deux chemins mouvement-réduit. Le miroir réel du Canvas, le découpage, la restauration des transformations et l’absence de mutation sont vérifiés. Aucune erreur JavaScript de page. [Planche de contrôle](stage-browser.png).

Les 50 tests de la commande existante test:stages et les 9 tests d’ambiance passent après intégration. Le fichier dédié de cette vague est lancé séparément ; le raccord à la commande globale appartient à l’intégration principale. Lint ciblé passé. La compilation et la validation globale restent consignées par la racine du chantier.

Commandes depuis la racine du dépôt :

\`\`\`sh
node --test scripts/stageAnimationWave7.test.mjs
node scripts/stageAnimationWave7.browser.mjs
npm run test:stages
node --test scripts/stageAtmosphere.test.mjs
npx oxlint src/game/melee/stageAnimationCatalogWave7.js src/game/melee/stageAnimationCatalog.js scripts/stageAnimationWave7.test.mjs scripts/stageAnimationWave7.browser.mjs
node docs/combat-fidelity-wave7-2026-10-20/stage-audit.mjs
\`\`\`

Le navigateur utilise par défaut le serveur local 5188 ; \`STAGE_ANIMATION_REVIEW_URL\` peut définir une autre URL. Le script d’audit régénère les compteurs, les 525 lignes et le registre d’accès à partir du runtime et des faits consignés ; il ne relit pas le Web et ne recapture pas la baseline. [JSON complet](stage-coverage.json).

## Inventaire des 525 univers

Les noms précis des scènes peuvent modifier la résolution ci-dessous, calculée avec l’univers et le mode seuls.

| Univers | Statut | Combat | Mêlée | RPG | Tactique |
| --- | --- | --- | --- | --- | --- |
${universeTable}
`;
fs.writeFileSync(new URL('stage-coverage.md', directory), report);
console.log(JSON.stringify({ definitions: coverage.totalProfiles, added: coverage.addedProfiles, newUniverses: coverage.addedUniverses.length, rows: rows.length, after, localAssetPaths: localPaths.length, sourceReads: sourceChecks.sourceReadCounts }, null, 2));
