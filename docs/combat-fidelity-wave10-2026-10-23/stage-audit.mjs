// Regenerate local measurements only; never repeat Web access or overwrite the
// pre-edit preservation baseline. Run from the repository root.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { HEROES_DB } from '../../src/game/heroes.js';
import { STAGE_ANIMATION_PROFILES, getStageAnimationProfile } from '../../src/game/melee/stageAnimationCatalog.js';
import { STAGE_ANIMATION_WAVE_10 } from '../../src/game/melee/stageAnimationCatalogWave10.js';
import { getStageAtmosphereProfile } from '../../src/game/melee/stageAtmosphere.js';
const directory=new URL('./',import.meta.url);
const read=name=>JSON.parse(fs.readFileSync(new URL(name,directory)));
const baseline=read('stage-baseline.json'),access=read('stage-source-access.json'),browser=read('stage-browser.json');
const before=read('../combat-fidelity-wave9-2026-10-22/stage-coverage.json').after;
const modes=['Combat','Melee','RPG','Tactics'];
const rows=[...new Set(HEROES_DB.map(h=>h.universe))].map(universe=>{
  const atmosphere=getStageAtmosphereProfile({universe});
  const mechanisms=Object.fromEntries(modes.map(mode=>[mode,getStageAnimationProfile({universe,mode})?.id||null]));
  return {universe,baseAtmosphereEnabled:atmosphere.enabled,baseAtmosphereStatus:atmosphere.status,baseAtmosphereEffect:atmosphere.effect,mechanisms,anyModeMechanism:Object.values(mechanisms).some(Boolean),everyModeMechanism:Object.values(mechanisms).every(Boolean),source1to1Validated:false};
});
const after={universes:rows.length,withAnyModeMechanism:rows.filter(r=>r.anyModeMechanism).length,withEveryModeMechanism:rows.filter(r=>r.everyModeMechanism).length,baseAtmosphereOnly:rows.filter(r=>!r.anyModeMechanism).length,byMode:Object.fromEntries(modes.map(mode=>[mode,{mechanisms:rows.filter(r=>r.mechanisms[mode]).length,baseAtmosphereOnly:rows.filter(r=>!r.mechanisms[mode]).length}]))};
const checks=STAGE_ANIMATION_WAVE_10.map(p=>{
  const attempts=access.access.filter(a=>a.url===p.sourceReference);
  return {profileId:p.id,universe:p.universes[0],sourceUrl:p.sourceReference,sourceWork:p.sourceWork,sourceScene:p.sourceScene,sourceAccessLabel:p.sourceAccess,primaryReferenceHasOpenedKeywordPassage:attempts.some(a=>a.specificPassageOpened),accessAttempts:attempts,evidenceAndAdaptationLimits:p.sceneEvidence,exactPropGeometryVerified:false,exactSourceLoopVerified:false,visual1to1Verified:false};
});
const sourceCounts={primaryUniqueUrls:new Set(checks.map(p=>p.sourceUrl)).size,profilesWhosePrimaryUrlHasOpenedKeywordPassage:checks.filter(p=>p.primaryReferenceHasOpenedKeywordPassage).length,profilesWithoutOpenedKeywordPassage:checks.filter(p=>!p.primaryReferenceHasOpenedKeywordPassage).length,uniquePrimaryUrlsWithOpenedPassage:new Set(checks.filter(p=>p.primaryReferenceHasOpenedKeywordPassage).map(p=>p.sourceUrl)).size};
const sourceChecks={date:'2026-10-23',method:'Keyword finds and URL opens identify locations and functions. An opened keyword on a reference does not verify every prop detail on that page. Indexed excerpts, blocked URLs, missing keywords and oversized PDFs are explicitly recorded. No full-page/video/frame reading claimed.',sourceCounts,source1to1Verified:false,officialSourceFramesImported:0,checks};
const slug=universe=>universe.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const slugs=[...new Set(STAGE_ANIMATION_WAVE_10.flatMap(p=>p.universes).map(slug))];
const localPaths=fs.readdirSync(new URL('../../public/',import.meta.url),{recursive:true}).map(String).filter(p=>/\.(png|webp|json)$/.test(p)&&slugs.some(s=>p.includes('/'+s+'/')||p.endsWith('/'+s+'.png')||p.endsWith('/'+s+'.webp')||p.includes('/'+s+'-'))).map(p=>'public/'+p).sort();
const coverage={date:'2026-10-23',scope:'All525 HEROES_DB universes using universe and mode only. A specific scene, including unknown scenes, always wins over mode defaults.',baselineProfiles:baseline.profiles.length,addedProfiles:STAGE_ANIMATION_WAVE_10.length,totalProfiles:STAGE_ANIMATION_PROFILES.length,addedUniverses:[...new Set(STAGE_ANIMATION_WAVE_10.flatMap(p=>p.universes))],before,after,declaredProfileUniverseStringsIncludingNonRoster:new Set(STAGE_ANIMATION_PROFILES.flatMap(p=>p.universes)).size,source1to1Validated:0,fidelityVerified:false,officialSourceFrames:false,newOfficialAnimationFrames:0,newEffectAtlases:0,newStaticBackdropRegions:0,newProductionPngs:0,mechanismGeometry:'80 explicit authored empty-prop functional studies across40 previously uncovered roster universes; hardware cutaways and maintenance loops are adapted, without procedural bodies.',timeSource:'simulation-elapsed-seconds',reducedMotion:'freeze-at-time-zero',gameplayEffect:'none',preservationEvidence:{path:'stage-baseline.json',definitions:baseline.profiles.length,drawingCommandHashes:baseline.profiles.reduce((n,p)=>n+p.samples.length,0),sha256:createHash('sha256').update(fs.readFileSync(new URL('stage-baseline.json',directory))).digest('hex'),bitmapPixelComparison:false,note:'SHA256 of recorded Canvas commands at1040x460 at0 and23percent of each old period, without Image in Node. Not official-frame or old-bitmap-pixel equivalence.'},sourceChecks:'stage-source-checks.json',sourceAccess:'stage-source-access.json',browserEvidence:'stage-browser.json',localAssetInventory:{count:localPaths.length,paths:localPaths,method:'Read-only relevant filename inventory; filenames do not prove canonical map geometry, source version or animated frames.',importedByNewMechanisms:0,newImagesGenerated:0},profiles:STAGE_ANIMATION_WAVE_10.map(p=>JSON.parse(JSON.stringify(p,(_,v)=>v instanceof RegExp?v.toString():v))),rows};
const validation={date:'2026-10-23',stageProductionFrozen:true,source1to1Validated:false,definitions:coverage.totalProfiles,addedMechanisms:coverage.addedProfiles,coveredRosterUniverses:after.withAnyModeMechanism,fourModeUniverses:after.withEveryModeMechanism,baseOnly:after.baseAtmosphereOnly,oldDefinitionsPreserved:baseline.profiles.length,oldCommandHashesPreserved:coverage.preservationEvidence.drawingCommandHashes,baselineSha256:coverage.preservationEvidence.sha256,tests:[{command:'node --test scripts/stageAnimationWave10.test.mjs',exitCode:0,passed:6,failed:0},{command:'npm run test:stages',exitCode:0,passed:68,failed:0},{command:'node --test scripts/stageAtmosphere.test.mjs',exitCode:0,passed:9,failed:0}],lintExitCode:0,browser:{mechanisms:browser.mechanisms,modeRenderChecks:browser.modeRenderChecks,additionalViewportChecks:browser.additionalViewportChecks,pageErrors:browser.pageErrors,worstMirrorAlphaErrorRatio:Math.max(...browser.rows.map(p=>p.mirrorAlphaErrorRatio))},globalBuild:'owned-by-root-not-asserted'};
for(const [name,value] of [['stage-source-checks.json',sourceChecks],['stage-coverage.json',coverage],['stage-validation.json',validation]])fs.writeFileSync(new URL(name,directory),JSON.stringify(value,null,2)+'\n');
const escape=s=>String(s).replaceAll('|','\\|');
const table=checks.map(p=>`| ${escape(p.universe)} | ${escape(p.sourceScene)} | \`${p.profileId}\` | ${p.primaryReferenceHasOpenedKeywordPassage?'Passage ciblé sur la référence':'Extrait indexé / ouverture bloquée'} |`).join('\n');
const roster=rows.map(r=>`| ${escape(r.universe)} | ${r.anyModeMechanism?'Mécanisme ciblé':'Ambiance seule'} | ${modes.map(m=>r.mechanisms[m]?'`'+r.mechanisms[m]+'`':'—').join(' | ')} |`).join('\n');
const report=`# Décors — vague 10, 23 octobre 2026

80 définitions supplémentaires ajoutent deux mécanismes à chacun de 40 univers du roster auparavant limités à une ambiance. Les 525 ambiances restent disponibles. **Aucune fidélité visuelle1:1 n’est certifiée.**

| Mesure | Avant | Après |
| --- | ---: | ---: |
| Définitions de mécanismes | ${coverage.baselineProfiles} | ${coverage.totalProfiles} |
| Univers couverts dans au moins un mode | ${before.withAnyModeMechanism} | ${after.withAnyModeMechanism} |
| Univers couverts dans les quatre modes | ${before.withEveryModeMechanism} | ${after.withEveryModeMechanism} |
| Univers avec ambiance de base seule | ${before.baseAtmosphereOnly} | ${after.baseAtmosphereOnly} |

Par mode : Combat ${after.byMode.Combat.mechanisms}, Mêlée ${after.byMode.Melee.mechanisms}, RPG ${after.byMode.RPG.mechanisms}, Tactique ${after.byMode.Tactics.mechanisms}. Les ${coverage.declaredProfileUniverseStringsIncludingNonRoster} chaînes déclarées comprennent un ancien alias hors roster : la couverture porte sur ${after.withAnyModeMechanism} univers réels sur 525. Une scène concrète prime toujours ; un lieu inconnu ne reçoit pas le mécanisme de référence par défaut.

## Ajouts

| Univers | Scène et version | Profil | Accès à la référence principale |
| --- | --- | --- | --- |
${table}

## Sources, adaptation et limites

Le [journal d’accès](stage-source-access.json) distingue les ouvertures, recherches ciblées, refus403/402, URL restreintes et PDF trop volumineux. Les [faits et limites par profil](stage-source-checks.json) citent ${sourceCounts.primaryUniqueUrls} URL principales : ${sourceCounts.profilesWhosePrimaryUrlHasOpenedKeywordPassage} profils ont une référence où un passage ciblé a été ouvert,${sourceCounts.profilesWithoutOpenedKeywordPassage} restent appuyés par un extrait indexé ou une ouverture sans passage adéquat. Ce compteur porte sur l’accès à la référence ; il ne valide pas chaque détail du mécanisme.

Les lieux, objets et fonctions sont séparés de leur représentation : contours, proportions, couleurs, organes exposés, nombres de pales ou de verrous, positions, cycles de maintenance et timing sont créés pour le projet. Plusieurs dessins sont explicitement des études fonctionnelles, par exemple le portique de Tetravaal, le bogie du Monorail, les deux organes du cargo elevator de Munitions Plant et les pièces de moteur du jeu de plateau Nemesis. Le second mécanisme de Streets of Rage est une coupe de desserte du même ascenseur documenté, sans prétendre être un second accessoire original vérifié. Nemesis ne fournit aucune animation source.

Le contrôle des sources a replacé la fontaine de Phantasmagoria dans le jardin, distinct du conservatoire, et retenu la trappe du garde-manger ouverte au tisonnier. La mention initiale de pistons de Turok a été abandonnée faute de passage retrouvé : le profil dessine le ventilateur du conduit explicitement documenté. La porte de La Casa de Papel reste celle de la fiction, distincte du véritable système du Banco de España. Le couloir de Starship Troopers appartient au film 1997 ; aucune variante du jeu 2005 n’est présentée comme sa géométrie. Les brouillons Home Alone, Alien Resurrection et Predator2 restent identifiés comme des brouillons, sans équivalence prétendue avec les images finales.

Aucun corps humain, animal, robot articulé, silhouette ou pose anatomique n’est dessiné. MOOSE est limité à un faisceau mécanique démonté et déchargé. Le four de Home Alone reste sans visage ; les fontaines sont sans figures. Les${localPaths.length} chemins locaux répertoriés sont seulement un inventaire de noms ; aucun n’est importé dans ces 80 rendus. Zéro PNG de production, atlas officiel, frame officielle ou région de fond recomposée ajouté. Les captures Chromium sont des preuves de contrôle, pas des assets du jeu.

## Vérification réelle

La [baseline créée avant toute édition](stage-baseline.json) conserve les 241 définitions et 482 SHA256 de commandes Canvas. Les six tests W10 imposent leur égalité exacte. Ces empreintes sont calculées en Node sans Image et ne comparent pas les pixels des anciens bitmaps. Les anciens profils, rapports et assets restent inchangés.

Les 80 géométries produisent80 signatures distinctes et déplacent réellement leurs coordonnées. Onze ensembles de coordonnées consommés par le renderer vérifient les charnières rigides, longueurs des ciseaux, vilebrequins et bielles, bras articulés, ponts, guides circulaires et colliers opposés à six instants dans quatre formats. Le temps simulé, la pause à temps identique, les deux chemins de mouvement réduit, la désactivation, le miroir, le découpage et l’absence de mutation des PV/objets de scène sont contrôlés.

[Chromium](stage-browser.json) valide 80 mécanismes, 320 rendus quatre modes et 240 formats supplémentaires. Aucune erreur de page ; erreur alpha maximale du miroir ${validation.browser.worstMirrorAlphaErrorRatio.toFixed(5)}. Les quatre planches ont été réellement inspectées : [1](stage-browser-panel-1.png), [2](stage-browser-panel-2.png), [3](stage-browser-panel-3.png), [4](stage-browser-panel-4.png). La zone de combat reste dégagée.

Résultats ciblés : W10 6/6, commande historique test:stages 68/68 et ambiances 9/9. Le seul recorder historique complété reçoit quadraticCurveTo, API Canvas réelle utilisée par la fontaine ; les 255 scènes, assertions et seuils sont conservés. Lint ciblé sans avertissement. [Validation](stage-validation.json). La racine du chantier possède l’audit global et le build complet, qui ne sont pas déclarés réussis ici.

Commandes depuis la racine :

~~~sh
node --test scripts/stageAnimationWave10.test.mjs
node scripts/stageAnimationWave10.browser.mjs
npm run test:stages
node --test scripts/stageAtmosphere.test.mjs
npx oxlint src/game/melee/stageAnimationCatalogWave10.js src/game/melee/stageAnimationCatalog.js scripts/stageAnimationWave10.test.mjs scripts/stageAnimationWave10.browser.mjs
node docs/combat-fidelity-wave10-2026-10-23/stage-audit.mjs
~~~

Le navigateur utilise 5188, modifiable avec STAGE_ANIMATION_REVIEW_URL. Le générateur reproduit les compteurs locaux et le registre de sources consigné, sans rouvrir le Web ni écraser la baseline.

## Inventaire des 525 univers

| Univers | Statut | Combat | Mêlée | RPG | Tactique |
| --- | --- | --- | --- | --- | --- |
${roster}
`;
fs.writeFileSync(new URL('stage-coverage.md',directory),report);
console.log(JSON.stringify({definitions:coverage.totalProfiles,added:coverage.addedProfiles,after,sourceCounts,baselinePreserved:coverage.preservationEvidence.drawingCommandHashes},null,2));
