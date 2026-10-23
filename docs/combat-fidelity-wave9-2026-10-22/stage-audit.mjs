// Regenerate local coverage and the source/function ledger, not Web access or
// the immutable pre-edit preservation baseline. Run from the repository root.
import fs from 'node:fs';
import { HEROES_DB } from '../../src/game/heroes.js';
import { STAGE_ANIMATION_PROFILES, getStageAnimationProfile } from '../../src/game/melee/stageAnimationCatalog.js';
import { STAGE_ANIMATION_WAVE_9 } from '../../src/game/melee/stageAnimationCatalogWave9.js';
import { getStageAtmosphereProfile } from '../../src/game/melee/stageAtmosphere.js';
const directory = new URL('./', import.meta.url);
const before = JSON.parse(fs.readFileSync(new URL('../combat-fidelity-wave8-2026-10-20/stage-coverage.json', directory))).after;
const baseline = JSON.parse(fs.readFileSync(new URL('stage-baseline.json', directory)));
const access = JSON.parse(fs.readFileSync(new URL('stage-source-access.json', directory)));
const modes = ['Combat', 'Melee', 'RPG', 'Tactics'];
const rows = [...new Set(HEROES_DB.map(h => h.universe))].map(universe => {
  const atmosphere = getStageAtmosphereProfile({ universe });
  const mechanisms = Object.fromEntries(modes.map(mode => [mode, getStageAnimationProfile({ universe, mode })?.id || null]));
  return { universe, baseAtmosphereEnabled: atmosphere.enabled, baseAtmosphereStatus: atmosphere.status, baseAtmosphereEffect: atmosphere.effect, mechanisms, anyModeMechanism: Object.values(mechanisms).some(Boolean), everyModeMechanism: Object.values(mechanisms).every(Boolean), source1to1Validated: false };
});
const after = { universes: rows.length, withAnyModeMechanism: rows.filter(r => r.anyModeMechanism).length, withEveryModeMechanism: rows.filter(r => r.everyModeMechanism).length, baseAtmosphereOnly: rows.filter(r => !r.anyModeMechanism).length,
  byMode: Object.fromEntries(modes.map(mode => [mode, { mechanisms: rows.filter(r => r.mechanisms[mode]).length, baseAtmosphereOnly: rows.filter(r => !r.mechanisms[mode]).length }])) };
const checks = STAGE_ANIMATION_WAVE_9.map(p => ({ profileIds: [p.id], sourceUrl: p.sourceReference, readStatus: p.sourceAccess,
  accessAttempts: access.access.filter(a => a.url === p.sourceReference).map(a => ({ status: a.status, totalLines: a.totalLines })),
  sourceWork: p.sourceWork, locator: p.sourceScene, evidenceAndAdaptationLimits: p.sceneEvidence,
  locationOrFunctionSupportedByOpenedText: !p.sourceAccess.startsWith('indexed'), exactPropGeometryVerified: false, exactSourceLoopVerified: false, visual1to1Verified: false }));
const sourceChecks = { date: '2026-10-22', method: 'Explicit full-URL opens and focused passage searches; selected relevant text, indexed excerpts, failed opens and regional redirects are distinguished in stage-source-access.json. No claim of reading entire pages or watching a video. This generator does not repeat Web access.',
  scope: 'Locations, original versions and prop functions only. No source images, official animation frames or quotations imported. Outlines, cutaways, colors, scale, drive internals, no-load maintenance cycles and timing are authored.',
  globalCanon1to1Verified: false, globalVisual1to1Verified: false, officialAnimationFramesImported: 0,
  sourceReadCounts: { uniqueUrls: new Set(checks.map(c => c.sourceUrl)).size, profilesWithOpenedText: checks.filter(c => c.locationOrFunctionSupportedByOpenedText).length, profilesWithOnlyIndexedExcerpts: checks.filter(c => !c.locationOrFunctionSupportedByOpenedText).length,
    uniqueOpenedUrls: new Set(checks.filter(c => c.locationOrFunctionSupportedByOpenedText).map(c => c.sourceUrl)).size, uniqueIndexedOnlyUrls: new Set(checks.filter(c => !c.locationOrFunctionSupportedByOpenedText).map(c => c.sourceUrl)).size }, checks };
const slugs = ['stargate-atlantis','stargate-universe','zero-escape-the-nonary-games','zero-escape', 'mirrors-edge','splinter-cell','tom-clancys-splinter-cell','max-payne-2','flashback','lost-planet-2','borderlands','attack-on-titan','secret-of-monkey-island','littlebigplanet','ristar','the-surge','putt-putt','freddi-fish','spy-fox','serious-sam','no-mans-sky','brutal-legend'];
const localPaths = fs.readdirSync(new URL('../../public/', import.meta.url), { recursive: true }).map(String).filter(file => /\.(png|webp|json)$/.test(file) && slugs.some(slug => file.includes('/'+slug+'/') || file.endsWith('/'+slug+'.webp') || file.endsWith('/'+slug+'-smash-openai.png'))).map(file => 'public/'+file).sort();
const coverage = { date: '2026-10-22', scope: 'All 525 HEROES_DB universes, using universe and mode only. A concrete scene name or description overrides the default reference and can select another profile or none.',
  baselineProfiles: baseline.profiles.length, addedProfiles: STAGE_ANIMATION_WAVE_9.length, totalProfiles: STAGE_ANIMATION_PROFILES.length, addedUniverses: [...new Set(STAGE_ANIMATION_WAVE_9.flatMap(p => p.universes))], before, after,
  declaredProfileUniverseStringsIncludingNonRoster: new Set(STAGE_ANIMATION_PROFILES.flatMap(p => p.universes)).size,
  source1to1Validated: 0, fidelityVerified: false, officialSourceFrames: false, newOfficialAnimationFrames: 0, newEffectAtlases: 0, newStaticBackdropRegions: 0,
  mechanismGeometry: '40 individual empty-prop mechanisms in 20 new roster universes; no generated anatomy or character silhouettes.', timeSource: 'simulation-elapsed-seconds', reducedMotion: 'freeze-at-time-zero', gameplayEffect: 'none',
  preservationEvidence: { path: 'stage-baseline.json', definitions: baseline.profiles.length, drawingCommandHashes: baseline.profiles.reduce((n,p) => n+p.samples.length,0), bitmapPixelComparison: false, note: 'SHA256 of Canvas commands at 1040x460, at zero and 23 percent of each period, with no Image in Node. Not pixel hashes or source-frame fidelity verification.' },
  sourceChecks: 'stage-source-checks.json', sourceAccess: 'stage-source-access.json', browserEvidence: 'stage-browser.json',
  localAssetInventory: { count: localPaths.length, paths: localPaths, method: 'Read-only relevant filename inventory. Names do not prove source suitability, specific map geometry or official frames.', importedByNewMechanisms: 0, newImagesGenerated: 0 },
  profiles: STAGE_ANIMATION_WAVE_9.map(p => JSON.parse(JSON.stringify(p, (_,v) => v instanceof RegExp ? v.toString() : v))), rows };
for (const [name,value] of [['stage-source-checks.json',sourceChecks],['stage-coverage.json',coverage]]) fs.writeFileSync(new URL(name,directory),JSON.stringify(value,null,2)+'\n');
const escape = s => String(s).replaceAll('|','\\|');
const table = STAGE_ANIMATION_WAVE_9.map(p => `| ${escape(p.universes[0])} | ${escape(p.sourceScene)} | \`${p.mechanism}\` | ${p.sourceAccess.startsWith('indexed') ? 'Extrait indexé seulement' : 'Passage ciblé ouvert et lu'} |`).join('\n');
const roster = rows.map(r => `| ${escape(r.universe)} | ${r.anyModeMechanism ? 'Mécanisme ciblé' : 'Ambiance de base seule'} | ${modes.map(m => r.mechanisms[m] ? '`'+r.mechanisms[m]+'`' : '—').join(' | ')} |`).join('\n');
const report = `# Décors — vague 9, 22 octobre 2026

40 mécanismes supplémentaires couvrent 20 univers du roster auparavant limités à leur ambiance de base. Les 525 ambiances restent disponibles. Aucune fidélité visuelle 1:1 n’est certifiée.

| Mesure | Avant | Après |
| --- | ---: | ---: |
| Définitions de mécanismes | ${coverage.baselineProfiles} | ${coverage.totalProfiles} |
| Univers couverts dans au moins un mode | ${before.withAnyModeMechanism} | ${after.withAnyModeMechanism} |
| Univers couverts dans les quatre modes | ${before.withEveryModeMechanism} | ${after.withEveryModeMechanism} |
| Univers avec seulement l’ambiance de base | ${before.baseAtmosphereOnly} | ${after.baseAtmosphereOnly} |

Couverture par mode : Combat ${after.byMode.Combat.mechanisms}, Mêlée ${after.byMode.Melee.mechanisms}, RPG ${after.byMode.RPG.mechanisms}, Tactique ${after.byMode.Tactics.mechanisms}. Les ${coverage.declaredProfileUniverseStringsIncludingNonRoster} chaînes d’univers déclarées comprennent un ancien alias hors roster : le compteur porte sur ${after.withAnyModeMechanism} des 525 univers réels.

Gears of War, Mass Effect, Ghost in the Shell et Resident Evil, univers du lot personnages, possédaient déjà des mécanismes ciblés. Cette vague avance donc vingt autres lacunes. Une scène précise prime toujours sur la référence par mode ; un lieu concret inconnu ne reçoit aucun mécanisme ciblé.

## Mécanismes livrés

| Univers | Scène et version | Mécanisme dessiné | Accès à la référence principale |
| --- | --- | --- | --- |
${table}

## Sources et adaptations

Le [registre de faits et limites](stage-source-checks.json) distingue ${sourceChecks.sourceReadCounts.profilesWithOpenedText} profils appuyés par un passage ciblé ouvert et ${sourceChecks.sourceReadCounts.profilesWithOnlyIndexedExcerpts} par un extrait indexé seulement, sur ${sourceChecks.sourceReadCounts.uniqueUrls} URL principales. Le [journal d’accès](stage-source-access.json) conserve les tentatives d’ouverture et recherches ciblées, y compris les candidats non retenus. Un refus, une page bloquée ou une absence de passage ne devient pas une lecture complète. Aucun film, vidéo ou atlas officiel n’a été inspecté ou importé pour ces ajouts.

Les transcripts Atlantis accessibles distinguent la trappe de Rising des nacelles rétractables de Thirty-Eight Minutes. Destiny fait tourner tout son anneau et ses chevrons dans un support fixe, sans emprunter la logique du Pegasus Gate. Seuls le matériel et ses mouvements adaptés sont dessinés : aucun portail ou déplacement réel. Le guide 999 distingue les trois engrenages de la salle des machines du piano de première classe, sans reproduire un code musical. Le PDF Mirror’s Edge situe les poutres suspendues dans Heat, chapitre 3 ; le profil n’est pas attribué au chapitre The Boat. Le working elevator de Defense Ministry est distinct du puits d’ascenseur de Kalinatek. Les chariots élévateurs et l’ascenseur d’hôpital de Max Payne 2 suivent le guide publié, sans personnage, collision ni feu.

Thor est une excavatrice abandonnée : sa roue tourne ici dans une étude mécanique de maintenance, sans prétendre qu’elle tourne dans la scène originale. Les organes exposés du Conveyor Hub, du distributeur de Stan, de la pince de Destiny et du canon orbital sont des coupes fonctionnelles créées pour le projet ; leurs entrailles ne sont pas présentées comme vérifiées. Les courbes, contours, couleurs, distances, nombres de dents, dimensions et cycles de retour restent des adaptations.

Les objets No Man’s Sky sont des fonctions de base Foundation 2016 et Beyond 2019. La clairière et l’avant-poste sont des cadrages créés pour le projet, sans planète canonique ni seed prétendu. Aucun scan, hotspot, gain de ressources ou travail hors ligne n’est ajouté. Les versions des vingt univers sont explicites ; les exclusions séparent suites, rééditions et états cassés, occupés ou obstrués. Les objets variables de Putt-Putt et les chemins aléatoires de Freddi Fish ne sont pas transformés en solutions fixes. Les scènes restent vides : aucun corps humain, animal ou pose anatomique n’est dessiné par ces géométries.

L’inventaire trouve ${localPaths.length} chemins locaux associés aux univers retenus. Aucun n’est importé dans les quarante nouveaux mécanismes : 0 nouvelle image de production, 0 atlas, 0 frame officielle et 0 région de fond recomposée. Les dessins sont décoratifs, à faible opacité dans la zone haute ; aucune modification de PV, collisions, plateformes jouables, dangers, quêtes, inventaire, transport, accès ou score.

## Vérifications

La [baseline](stage-baseline.json), créée avant édition sans possibilité d’écrasement, conserve les 201 anciennes définitions et leurs 402 SHA256 de commandes Canvas à 1040 × 460. Les tests imposent leur conservation exacte. Ces empreintes sont enregistrées sans chargement d’image en Node : elles ne sont ni des comparaisons de pixels des anciens bitmaps ni des preuves de fidélité aux œuvres sources. Aucun ancien profil, test, bitmap ou rapport n’est réécrit.

Les six tests dédiés passent : conservation, quarante profils distincts dans vingt univers neufs, quarante exclusions de continuité, résolution des scènes concrètes dans quatre modes, mobilité réelle des coordonnées, couleurs propres, déterminisme et absence de mutation. Huit ensembles de coordonnées réellement consommés par le renderer vérifient les bras articulés de longueur constante, deux câbles parallèles et une poutre rigide, les sommes des cordes d’ascenseur, le pont-levis couplé à son treuil, les contrepoids, les pendules et la bielle de l’extracteur, à six instants et quatre formats.

[Chromium](stage-browser.json) valide quarante mécanismes, 160 rendus quatre modes et 120 formats supplémentaires (360 × 780, 1920 × 480, 512 × 512). Les pixels changent avec le temps simulé, restent stables à temps identique en pause et se figent à zéro par les deux chemins de mouvement réduit. Le miroir, le découpage, les drapeaux de désactivation et la restauration du Canvas sont vérifiés ; aucune erreur JavaScript de page. [Planche de contrôle réellement inspectée](stage-browser.png).

La commande existante test:stages passe ses 62 tests et les tests d’ambiance passent 9/9 après intégration. Les six tests W9 sont lancés séparément tant que l’intégration principale n’a pas raccordé le fichier à son paquet. Lint ciblé sans avertissement. [Validation ciblée](stage-validation.json). L’audit combat global et la compilation appartiennent à la racine du chantier et ne sont pas déclarés passés ici.

Commandes depuis la racine du dépôt :

~~~sh
node --test scripts/stageAnimationWave9.test.mjs
node scripts/stageAnimationWave9.browser.mjs
npm run test:stages
node --test scripts/stageAtmosphere.test.mjs
npx oxlint src/game/melee/stageAnimationCatalogWave9.js src/game/melee/stageAnimationCatalog.js scripts/stageAnimationWave9.test.mjs scripts/stageAnimationWave9.browser.mjs
node docs/combat-fidelity-wave9-2026-10-22/stage-audit.mjs
~~~

Le navigateur utilise 5188 par défaut, modifiable avec STAGE_ANIMATION_REVIEW_URL. Ce générateur reproduit les mesures locales et les faits consignés, sans relire le Web ni écraser la baseline. [JSON complet](stage-coverage.json).

## Inventaire des 525 univers

Ces références sont calculées avec univers et mode seuls. Un nom concret de scène peut changer le profil résolu.

| Univers | Statut | Combat | Mêlée | RPG | Tactique |
| --- | --- | --- | --- | --- | --- |
${roster}
`;
fs.writeFileSync(new URL('stage-coverage.md',directory),report);
console.log(JSON.stringify({definitions:coverage.totalProfiles,added:coverage.addedProfiles,newUniverses:coverage.addedUniverses.length,rows:rows.length,after,sourceReads:sourceChecks.sourceReadCounts,localAssetPaths:localPaths.length},null,2));
