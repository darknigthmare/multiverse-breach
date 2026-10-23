// Reproduce local measurements. Does not fetch Web pages or overwrite baseline.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {HEROES_DB} from '../../src/game/heroes.js';
import {STAGE_ANIMATION_PROFILES,getStageAnimationProfile} from '../../src/game/melee/stageAnimationCatalog.js';
import {STAGE_ANIMATION_WAVE_11} from '../../src/game/melee/stageAnimationCatalogWave11.js';
import {getStageAtmosphereProfile} from '../../src/game/melee/stageAtmosphere.js';
const directory=new URL('./',import.meta.url), read=name=>JSON.parse(fs.readFileSync(new URL(name,directory),'utf8'));
const baseline=read('stage-baseline.json'), access=read('stage-source-access.json'), browser=read('stage-browser.json');
const before=read('../combat-fidelity-wave10-2026-10-23/stage-coverage.json').after;
const sha=path=>createHash('sha256').update(fs.readFileSync(new URL(path,directory))).digest('hex');
const canon=value=>{try{const u=new URL(value);return decodeURIComponent(u.origin+u.pathname).replace(/\/$/,'');}catch{return value;}};
const modes=['Combat','Melee','RPG','Tactics'];
const rows=[...new Set(HEROES_DB.map(h=>h.universe))].map(universe=>{
  const atmosphere=getStageAtmosphereProfile({universe}),mechanisms=Object.fromEntries(modes.map(mode=>[mode,getStageAnimationProfile({universe,mode})?.id||null]));
  return{universe,baseAtmosphereEnabled:atmosphere.enabled,baseAtmosphereStatus:atmosphere.status,baseAtmosphereEffect:atmosphere.effect,mechanisms,anyModeMechanism:Object.values(mechanisms).some(Boolean),everyModeMechanism:Object.values(mechanisms).every(Boolean),source1to1Validated:false};
});
assert.equal(rows.length,525);assert.ok(rows.every(r=>r.baseAtmosphereEnabled));
const after={universes:rows.length,withAnyModeMechanism:rows.filter(r=>r.anyModeMechanism).length,withEveryModeMechanism:rows.filter(r=>r.everyModeMechanism).length,baseAtmosphereOnly:rows.filter(r=>!r.anyModeMechanism).length,byMode:Object.fromEntries(modes.map(mode=>[mode,{mechanisms:rows.filter(r=>r.mechanisms[mode]).length,baseAtmosphereOnly:rows.filter(r=>!r.mechanisms[mode]).length}]))};
const checks=STAGE_ANIMATION_WAVE_11.map(p=>{
  const attempts=access.access.filter(a=>canon(a.url)===canon(p.sourceReference));
  assert.ok(attempts.length,p.id+'/reference was actually accessed or indexed');
  return{profileId:p.id,universe:p.universes[0],sourceUrl:p.sourceReference,sourceWork:p.sourceWork,sourceScene:p.sourceScene,sourceAccessLabel:p.sourceAccess,primaryReferenceHasOpenedKeywordPassage:attempts.some(a=>a.specificPassageOpened),accessAttempts:attempts,evidenceAndAdaptationLimits:p.sceneEvidence,exactPropGeometryVerified:false,exactSourceLoopVerified:false,visual1to1Verified:false};
});
const sourceCounts={primaryUniqueUrls:new Set(checks.map(p=>p.sourceUrl)).size,profilesWhosePrimaryUrlHasOpenedKeywordPassage:checks.filter(p=>p.primaryReferenceHasOpenedKeywordPassage).length,profilesWithoutOpenedKeywordPassage:checks.filter(p=>!p.primaryReferenceHasOpenedKeywordPassage).length,accessRecords:access.access.length,failedOrUnmatchedAccesses:access.access.filter(a=>!a.matched).length};
const sourceChecks={date:'2026-10-23',method:'Opened keyword passages and indexed excerpts identify settings; a keyword match does not authenticate every prop or source animation. No full-page, movie, video, official frame or measured-set review claimed.',sourceCounts,source1to1Verified:false,officialSourceFramesImported:0,checks};
const addedUniverses=[...new Set(STAGE_ANIMATION_WAVE_11.flatMap(p=>p.universes))];
assert.equal(addedUniverses.length,40);assert.equal(STAGE_ANIMATION_WAVE_11.length,80);assert.equal(STAGE_ANIMATION_PROFILES.length,401);
assert.ok(addedUniverses.every(u=>!baseline.profiles.some(p=>p.definition.universes.includes(u))));
const slug=u=>u.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const slugs=addedUniverses.map(slug);
const localPaths=fs.readdirSync(new URL('../../public/',import.meta.url),{recursive:true}).map(String).filter(p=>/\.(png|webp|json)$/.test(p)&&slugs.some(s=>p.includes('/'+s+'/')||p.endsWith('/'+s+'.webp')||p.endsWith('/'+s+'.png')||p.includes('/'+s+'-'))).map(p=>'public/'+p).sort();
const coverage={date:'2026-10-23',scope:'All525 roster universes, using universe and mode only. An explicit unknown scene never receives a reference-scene mechanism.',baselineProfiles:baseline.profiles.length,addedProfiles:STAGE_ANIMATION_WAVE_11.length,totalProfiles:STAGE_ANIMATION_PROFILES.length,addedUniverses,before,after,declaredProfileUniverseStringsIncludingNonRoster:new Set(STAGE_ANIMATION_PROFILES.flatMap(p=>p.universes)).size,source1to1Validated:0,fidelityVerified:false,officialSourceFrames:false,newOfficialAnimationFrames:0,newEffectAtlases:0,newStaticBackdropRegions:0,newProductionPngs:0,mechanismGeometry:'80 explicit authored architecture / landscape studies,40 previously uncovered roster universes; neutral maintenance or natural cycles, no anatomical character, weapon, wearable or vehicle body.',timeSource:'simulation-elapsed-seconds',reducedMotion:'freeze-at-time-zero',gameplayEffect:'none',preservationEvidence:{path:'stage-baseline.json',definitions:baseline.profiles.length,drawingCommandHashes:baseline.profiles.reduce((n,p)=>n+p.samples.length,0),sha256:sha('stage-baseline.json'),bitmapPixelComparison:false,note:'Canvas-command SHA256 in Node without Image,1040x460 at two pre-edit times. Not source pixels or old bitmap equivalence.'},sourceChecks:'stage-source-checks.json',sourceAccess:'stage-source-access.json',browserEvidence:'stage-browser.json',localAssetInventory:{count:localPaths.length,paths:localPaths,method:'Read-only filename inventory. A filename does not establish source continuity, canonical prop proportions or frames.',importedByNewMechanisms:0,newImagesGenerated:0},profiles:STAGE_ANIMATION_WAVE_11.map(p=>JSON.parse(JSON.stringify(p,(_,v)=>v instanceof RegExp?v.toString():v))),rows};
const proof=(name,count)=>{const log=fs.readFileSync(new URL(name,directory),'utf8');assert.match(log,new RegExp('tests '+count+'\\b'));assert.match(log,/fail 0\b/);assert.match(log,new RegExp('pass '+count+'\\b'));return{path:name,tests:count,passed:count,failed:0,sha256:sha(name)};};
const nodeProof=proof('stage-node-atmosphere.log',15),regressionProof=proof('stage-regression.log',74);
assert.equal(browser.mechanisms,80);assert.equal(browser.universes,40);assert.equal(browser.modeRenderChecks,320);assert.equal(browser.additionalViewportChecks,240);assert.deepEqual(browser.pageErrors,[]);
const inputPaths=['../../src/game/melee/stageAnimationCatalogWave11.js','../../src/game/melee/stageAnimationCatalog.js','../../scripts/stageAnimationWave11.test.mjs','../../scripts/stageAnimationWave11.browser.mjs','stage-baseline.json','stage-source-access.json','stage-browser.json','stage-audit.mjs'];
const validation={date:'2026-10-23',stageProductionFrozen:true,source1to1Validated:false,definitions:coverage.totalProfiles,addedMechanisms:coverage.addedProfiles,coveredRosterUniverses:after.withAnyModeMechanism,fourModeUniverses:after.withEveryModeMechanism,baseOnly:after.baseAtmosphereOnly,oldDefinitionsPreserved:baseline.profiles.length,oldCommandHashesPreserved:coverage.preservationEvidence.drawingCommandHashes,baselineSha256:coverage.preservationEvidence.sha256,tests:[{command:'node --test scripts/stageAnimationWave11.test.mjs scripts/stageAtmosphere.test.mjs',dedicatedWave11:6,atmosphere:9,...nodeProof},{command:'npm run test:stages',...regressionProof}],historicalTestFilesChanged:0,lint:{command:'npx oxlint src/game/melee/stageAnimationCatalogWave11.js src/game/melee/stageAnimationCatalog.js scripts/stageAnimationWave11.test.mjs scripts/stageAnimationWave11.browser.mjs',exitCode:0,log:'stage-lint.log'},browser:{mechanisms:browser.mechanisms,modeRenderChecks:browser.modeRenderChecks,additionalViewportChecks:browser.additionalViewportChecks,pageErrors:browser.pageErrors,worstMirrorAlphaErrorRatio:Math.max(...browser.rows.map(p=>p.mirrorAlphaErrorRatio)),visualReview:{reviewed:['stage-browser-panel-1.png','stage-browser-panel-2.png','stage-browser-panel-3.png','stage-browser-panel-4.png'],observations:'All four final sheets inspected. Architectural sections / flow lines stay behind the upper clip; empty combat lane. Full mechanisms fit the reduced height-based unit. No bodies, weapons, vehicles, teleport or falling-hazard action. These are schematic authored outlines, not official scene images.'}},inputHashes:inputPaths.map(path=>({path,sha256:sha(path)})),globalBuild:'owned-by-root-not-asserted'};
for(const[name,value]of[['stage-source-checks.json',sourceChecks],['stage-coverage.json',coverage],['stage-validation.json',validation]])fs.writeFileSync(new URL(name,directory),JSON.stringify(value,null,2)+'\n');
const esc=s=>String(s).replaceAll('|','\\|');
const profiles=checks.map(p=>`| ${esc(p.universe)} | ${esc(p.sourceScene)} | \`${p.profileId}\` | ${p.primaryReferenceHasOpenedKeywordPassage?'Passage ciblé ouvert':'Extrait indexé / ouverture sans passage'} |`).join('\n');
const roster=rows.map(r=>`| ${esc(r.universe)} | ${r.anyModeMechanism?'Mécanisme ciblé':'Ambiance seule'} | ${modes.map(m=>r.mechanisms[m]?'`'+r.mechanisms[m]+'`':'—').join(' | ')} |`).join('\n');
fs.writeFileSync(new URL('stage-coverage.md',directory),`# Décors — vague 11, 23 octobre 2026

80 études architecturales et cycles naturels ajoutent deux références de scène à 40 univers du roster auparavant limités à une ambiance. **Aucune fidélité visuelle 1:1 n’est certifiée.** Les contours, proportions, teintes et cycles sont des adaptations créées pour le projet, sans frames officielles.

| Mesure | Avant | Après |
| --- | ---: | ---: |
| Définitions | ${coverage.baselineProfiles} | ${coverage.totalProfiles} |
| Univers couverts dans au moins un mode | ${before.withAnyModeMechanism} | ${after.withAnyModeMechanism} |
| Univers couverts dans les quatre modes | ${before.withEveryModeMechanism} | ${after.withEveryModeMechanism} |
| Univers avec ambiance seule | ${before.baseAtmosphereOnly} | ${after.baseAtmosphereOnly} |

Les 525 ambiances restent configurées. Combat couvre ${after.byMode.Combat.mechanisms} univers, Mêlée ${after.byMode.Melee.mechanisms}, RPG ${after.byMode.RPG.mechanisms} et Tactique ${after.byMode.Tactics.mechanisms}. Les ${coverage.declaredProfileUniverseStringsIncludingNonRoster} chaînes déclarées incluent un ancien alias hors roster : la couverture mesurée porte sur ${after.withAnyModeMechanism} univers réels. Une scène explicite prime ; un lieu inconnu ne reçoit aucun mécanisme de référence par défaut.

## Scènes ajoutées

| Univers | Scène et version | Profil | Référence principale |
| --- | --- | --- | --- |
${profiles}

## Sources et limites

Le [journal d’accès réel](stage-source-access.json) conserve ${sourceCounts.accessRecords} ouvertures, recherches ciblées et extraits indexés, dont ${sourceCounts.failedOrUnmatchedAccesses} échecs ou recherches sans correspondance. Les extraits retenus sont bornés par URL. Les [contrôles par profil](stage-source-checks.json) distinguent ${sourceCounts.primaryUniqueUrls} URL principales : ${sourceCounts.profilesWhosePrimaryUrlHasOpenedKeywordPassage} profils disposent d’un passage ciblé ouvert sur cette référence ; ${sourceCounts.profilesWithoutOpenedKeywordPassage} reposent sur un extrait indexé ou une ouverture sans passage. Un mot trouvé sur une page ne valide ni chaque objet ni son animation. Aucune page entière, vidéo ou frame source n’est déclarée visionnée.

Les lieux et la continuité servent d’ancres. Les portes, ventilations, rideaux, sections architecturales, écoulements, végétaux et leurs positions/cycles restent adaptés. Certaines références ne confirment que le lieu : par exemple le ventilateur neutre du bunker de Tremors, les fenêtres du domicile Yagami et l’irrigation du village de The Creator ne sont pas des accessoires mesurés ou des animations canoniques attestées. Les études ne constituent pas 80 nouvelles animations officielles.

Le contrôle des références distingue le puits sec du Silence des agneaux des puits à eau de The Ring ; les deux études de Memphis utilisent plutôt la cage et l’ascenseur décrits dans le scénario. Le scénario reste distinct des images finales. Matool (aussi transcrit Matul) est l’île de Zombi 2, pas le centre commercial de Dawn of the Dead. Minions emploie la Tour de Londres et le lustre de Westminster Abbey de 2015, sans importer une scène de Rise of Gru. Commando conserve l’île d’Arius et le centre commercial, sans inventer un sauvetage à Val Verde. Les références du film The Creator sont séparées des descriptions des autres œuvres portant un titre voisin.

Aucun corps humain, animal, monstre, robot, pose anatomique, arme, objet porté ou corps de véhicule n’est dessiné. Les lustres restent suspendus ; les portes effectuent un cycle décoratif à vide ; eau, air et vapeur ne produisent aucun événement, dégât, danger, accès ou collision. Le rendu reste sous le décor avant les acteurs et télégraphes. L’inventaire local trouve ${localPaths.length} chemins pertinents, dont aucun n’est importé par ces nouveaux rendus. Zéro PNG de production, atlas ou région de bitmap ajouté.

## Vérification exécutée

La [baseline préédition](stage-baseline.json) conserve 321 définitions et 642 SHA256 de commandes Canvas, exigés strictement égaux par les nouveaux tests. Ces empreintes Node sont calculées sans Image ; elles ne comparent pas des pixels de bitmaps. Aucun ancien profil, test, rapport ou PNG n’a été modifié.

Les six tests W11 couvrent les 80 géométries distinctes, les scènes précises/exclusions de versions, quatre modes, coordonnées finies, déterminisme, pause à temps identique, les deux chemins de mouvement réduit, miroir, découpage, désactivation et absence de mutation des acteurs/PV/événements. Des coordonnées effectivement dessinées vérifient les longueurs rigides des charnières et pendules, les courses de trois ascenseurs, leurs câbles et les deux aiguilles d’horloge, à six instants dans quatre formats. Le contour de la tour de refroidissement utilise des points de Bézier échantillonnés via lineTo ; aucun recorder historique n’a été affaibli ou étendu.

Résultats : W11 6/6 et ambiances 9/9 dans le [journal commun](stage-node-atmosphere.log) ; commande historique test:stages ${regressionProof.passed}/${regressionProof.tests} dans le [journal de régression](stage-regression.log). Lint ciblé code 0. [Chromium](stage-browser.json) valide 80 mécanismes, 320 rendus quatre modes et 240 formats supplémentaires, sans erreur de page. Erreur alpha maximale du miroir : ${validation.browser.worstMirrorAlphaErrorRatio.toFixed(5)}. Les quatre planches finales ont été réellement inspectées : [1](stage-browser-panel-1.png), [2](stage-browser-panel-2.png), [3](stage-browser-panel-3.png), [4](stage-browser-panel-4.png). Les plans restent schématiques et discrets ; la voie de combat reste vide. [Validation et empreintes](stage-validation.json).

Le build et l’audit globaux appartiennent à la racine et ne sont pas annoncés réussis dans ce rapport.

~~~sh
node --test scripts/stageAnimationWave11.test.mjs scripts/stageAtmosphere.test.mjs
npm run test:stages
node scripts/stageAnimationWave11.browser.mjs
npx oxlint src/game/melee/stageAnimationCatalogWave11.js src/game/melee/stageAnimationCatalog.js scripts/stageAnimationWave11.test.mjs scripts/stageAnimationWave11.browser.mjs
node docs/combat-fidelity-wave11-2026-10-23/stage-audit.mjs
~~~

Le navigateur utilise 5188, modifiable avec STAGE_ANIMATION_REVIEW_URL. Le générateur relit les preuves et recompte le catalogue ; il ne consulte pas le Web et n’écrase jamais la baseline.

## Inventaire des 525 univers

| Univers | Statut | Combat | Mêlée | RPG | Tactique |
| --- | --- | --- | --- | --- | --- |
${roster}
`);
console.log(JSON.stringify({definitions:coverage.totalProfiles,added:coverage.addedProfiles,after,sourceCounts,preservedDefinitions:baseline.profiles.length,preservedCommandHashes:coverage.preservationEvidence.drawingCommandHashes},null,2));
