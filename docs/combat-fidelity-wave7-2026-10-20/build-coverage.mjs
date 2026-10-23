// Run after the final runtime registration and current.json audit are frozen.
// This writes only this wave's coverage.csv, never prior-wave reports.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { HEROES_DB } from '../../src/game/heroes.js';
import { getCharacterAnimationAssets, getCharacterAnimationFrame, resolveCharacterAnimationAsset } from '../../src/game/combat/characterAnimationCatalog.js';
import { getMeleeAnimationManifest } from '../../src/game/melee/meleeAnimationManifest.js';
import { MELEE_STATES } from '../../src/game/melee/meleeStateMachine.js';
import { getHeroMeleeAnimationFrame, getHeroSpriteSheetSrc } from '../../src/game/spriteAssets.js';
import { CHARACTER_PRESENTATIONS } from '../../src/game/combat/presentationCatalog.js';
import { getStageAnimationProfile } from '../../src/game/melee/stageAnimationCatalog.js';
import { getStageAtmosphereProfile } from '../../src/game/melee/stageAtmosphere.js';
const root = new URL('../../', import.meta.url);
const read = path => fs.readFileSync(new URL(path, root));
const json = path => JSON.parse(read(path));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const parseCSV = text => {
  const rows = []; let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') { if (quoted && text[i + 1] === '"') { cell += '"'; i++; } else quoted = !quoted; }
    else if (c === ',' && !quoted) { row.push(cell); cell = ''; }
    else if (c === '\n' && !quoted) { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c !== '\r' || quoted) cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  assert.equal(quoted, false); return rows;
};
const [oldHeader, ...old] = parseCSV(read('docs/combat-fidelity-wave6-2026-10-20/coverage.csv').toString());
assert.deepEqual(oldHeader, ['heroId', 'name', 'universe', 'nativePresentationAtlas', 'full45StateMeleeManifest', 'correctedBaseAtlas', 'source1to1Verified']);
const roster = new Map(HEROES_DB.map(hero => [hero.id, hero]));
assert.equal(roster.size, 1911); assert.equal(old.length, 1911);
assert.deepEqual(new Set(old.map(row => row[0])), new Set(roster.keys()));
const delivered = entry => {
  const bytes = read('public' + entry.sheet);
  assert.equal(sha(bytes), entry.sha256, entry.sheet);
  assert.ok(bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])));
  assert.equal(bytes.readUInt32BE(16), entry.width ?? entry.dimensions.width);
  assert.equal(bytes.readUInt32BE(20), entry.height ?? entry.dimensions.height);
  assert.ok([4, 6].includes(bytes[25])); return true;
};
const native = getCharacterAnimationAssets().filter(delivered);
const nativeMap = new Map(native.map(entry => [entry.heroId, entry]));
const files = fs.readdirSync(new URL('src/game/combat/', root));
const meleeMap = new Map(files.filter(file => /Melee(?:Motion|Combat)\.generated\.json$/.test(file)).flatMap(file => json('src/game/combat/' + file).entries).map(entry => [entry.sheet, entry]));
const correctionCandidates = files.filter(file => /^characterSpriteCorrections.*\.generated\.json$/.test(file)).flatMap(file => json('src/game/combat/' + file).entries);
const correctedMap = new Map(correctionCandidates.filter(entry => roster.has(entry.heroId) && getHeroSpriteSheetSrc(roster.get(entry.heroId), 'combat') === entry.sheet).filter(delivered).map(entry => [entry.heroId, entry]));
const full = new Set();
for (const hero of HEROES_DB) {
  const asset = nativeMap.get(hero.id);
  if (asset) {
    assert.equal(asset.universe, hero.universe); assert.equal(asset.frames, 32);
    assert.equal(resolveCharacterAnimationAsset(hero), asset);
    assert.notEqual(asset.visualValidation?.canon1to1Verified, true);
    for (const phase of ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super']) for (const progress of [0, 0.26, 0.51, 1]) {
      const frame = getCharacterAnimationFrame(hero, { phase, progress });
      assert.equal(frame.asset, asset); assert.equal(frame.frames, 4);
    }
  }
  const manifest = getMeleeAnimationManifest(hero.id);
  if (manifest) {
    assert.equal(manifest.universe, hero.universe); const rows = new Set();
    assert.notEqual(manifest.source1to1Verified, true);
    for (const state of MELEE_STATES) {
      const animation = manifest.animations[state], source = meleeMap.get(animation?.sheet);
      assert.ok(animation && source, `${hero.id}/${state}`);
      assert.equal(source.heroId, hero.id); assert.equal(source.universe, hero.universe); delivered(source);
      assert.equal(animation.frameCount, 4); assert.ok(animation.row >= 0 && animation.row < source.rows);
      assert.ok(animation.startColumn >= 0 && animation.startColumn + animation.frameCount <= source.columns);
      rows.add(animation.sheet + ':' + animation.row);
      const selected = getHeroMeleeAnimationFrame({ ...hero, state }, 0);
      assert.equal(selected.animation.sheet, animation.sheet); assert.equal(selected.animation.row, animation.row);
    }
    assert.equal(rows.size, 45); full.add(hero.id);
  }
  const corrected = correctedMap.get(hero.id);
  if (corrected) { assert.equal(corrected.frames, 16); assert.equal(corrected.universe, hero.universe); }
}
const modes = ['Combat', 'Melee', 'RPG', 'Tactics'];
const header = [...oldHeader, 'scriptedPresentation', 'stageBaseAtmosphere', 'stageMechanismAnyMode', 'stageMechanismAllFourModes', ...modes.map(mode => mode.toLowerCase() + 'StageMechanism'), 'nativeAtlasSheet', 'correctedBaseSheet', 'full45StateFrames', 'sourceFidelityStatus'];
const rows = old.map(previous => {
  const hero = roster.get(previous[0]), asset = nativeMap.get(hero.id), correction = correctedMap.get(hero.id);
  const mechanisms = modes.map(mode => getStageAnimationProfile({ universe: hero.universe, mode })?.id || '');
  const row = [hero.id, hero.name, hero.universe, String(!!asset), String(full.has(hero.id)), String(!!correction), 'false',
    String(CHARACTER_PRESENTATIONS[hero.id]?.universe === hero.universe), String(!!getStageAtmosphereProfile({ universe: hero.universe }).enabled),
    String(mechanisms.some(Boolean)), String(mechanisms.every(Boolean)), ...mechanisms,
    asset?.sheet || '', correction?.sheet || '', String(full.has(hero.id) ? MELEE_STATES.length * 4 : 0), 'not-validated-1:1'];
  for (const column of [3, 4, 5]) if (previous[column] === 'true') assert.equal(row[column], 'true', 'previous coverage regressed');
  return row;
});
// Refused native requests, refused bases and unattempted Luke/Vader bases must never become delivered flags.
for (const id of ['luke', 'vader', 'obi_wan']) { assert.equal(nativeMap.has(id), false, id); assert.equal(correctedMap.has(id), false, id); }
assert.equal(correctedMap.has('leia_organa'), false, 'Leia base was refused; her accepted presentation atlas is a separate asset');
const current = json('docs/combat-fidelity-wave7-2026-10-20/current.json');
assert.equal(current.meleeBindings.nativePresentationHeroes, nativeMap.size);
assert.equal(current.baseSpriteCorrections.heroes, correctedMap.size);
assert.equal(current.meleeBindings.fullDetailedMeleeManifestHeroes.length, full.size);
assert.equal(current.presentations.scriptedHeroes, rows.filter(row => row[7] === 'true').length);
const quote = value => '"' + String(value).replaceAll('"', '""') + '"';
const output = new URL('coverage.csv', import.meta.url);
fs.writeFileSync(output, [header, ...rows].map(row => row.map(quote).join(',')).join('\n') + '\n');
assert.deepEqual(parseCSV(fs.readFileSync(output, 'utf8')), [header, ...rows]);
console.log(JSON.stringify({ output: output.pathname, characters: rows.length, nativeHeroes: nativeMap.size, nativePoses: native.reduce((n, e) => n + e.frames, 0),
  full45Heroes: [...full], correctedBaseHeroes: correctedMap.size, correctedBasePoses: [...correctedMap.values()].reduce((n, e) => n + e.frames, 0),
  scriptedRosterHeroes: rows.filter(row => row[7] === 'true').length, missingNative: rows.length - nativeMap.size, missingFull45: rows.length - full.size,
  source1to1Verified: rows.filter(row => row[6] === 'true').length, orderPreserved: true }, null, 2));
const baseline = json('docs/combat-fidelity-wave7-2026-10-20/baseline.json');
const beforeNative = new Set(baseline.meleeBindings.nativePresentationHeroIds);
const newNative = native.filter(entry => !beforeNative.has(entry.heroId));
const beforeBases = new Set(baseline.baseSpriteCorrections.entries.map(entry => entry.heroId));
const newBases = [...correctedMap.values()].filter(entry => !beforeBases.has(entry.heroId));
const detailed = current.meleeBindings.detailedManifestCoverage;
const beforeFull = new Set(baseline.meleeBindings.fullDetailedMeleeManifestHeroes);
const newFull = detailed.filter(entry => entry.complete && !beforeFull.has(entry.id));
const beforeEntityKeys = new Set(baseline.entities.nativeAnimationEntries.map(entry => entry.key));
const newEntities = current.entities.nativeAnimationEntries.filter(entry => !beforeEntityKeys.has(entry.key));
const newPoseCount = newNative.reduce((n, entry) => n + entry.frames, 0) + newBases.reduce((n, entry) => n + entry.frames, 0) + newFull.reduce((n, entry) => n + entry.boundFrames, 0) + newEntities.reduce((n, entry) => n + entry.frames, 0);
const newSheetCount = new Set([...newNative.map(entry => entry.sheet), ...newBases.map(entry => entry.sheet), ...newFull.flatMap(entry => entry.sheets), ...newEntities.map(entry => entry.sheet)]).size;
const stage = current.stages, abilities = current.abilities;
const validationFile = new URL('validation.json', import.meta.url);
const validation = fs.existsSync(validationFile) ? JSON.parse(fs.readFileSync(validationFile, 'utf8')) : null;
const validationParagraph = validation?.build?.exitCode === 0 && validation?.testsFailed === 0
  && Number.isInteger(validation.testsPassed) && Number.isInteger(validation.testSuites)
  ? `**La compilation complète est passée (code 0). La validation consigne ${validation.testsPassed} tests réussis dans ${validation.testSuites} suites, sans échec.** Voir [validation.json](validation.json), le [journal de compilation](build.log) et les [preuves Chromium](browser-checks.json). Ces résultats ne certifient pas la fidélité source 1:1.`
  : '**La compilation complète et la validation globale ne sont pas déclarées terminées ici.** Le résultat réel sera consigné par l’intégration principale dans ses fichiers de validation et de build, une fois les commandes globales achevées.';
const doc = `# Combat et animations — vague 7, 20 octobre 2026

Cette vague livre **${newPoseCount} poses utilisées dans ${newSheetCount} PNG** : ${newNative.length} atlas de présentation × 32 poses, ${newBases.length} corrections de base × 16, ${newFull.length} nouveau manifeste complet de Mêlée (${newFull.reduce((n, entry) => n + entry.boundFrames, 0)} poses) et ${newEntities.length} entités × 16. Le bilan repose sur les fichiers réellement livrés, leurs empreintes et leur raccord au runtime. **La fidélité source 1:1 reste non certifiée.**

| Couverture cumulée | Livraison réelle | Lacune distincte |
| --- | --- | --- |
| Présentations natives | ${nativeMap.size} héros, ${native.reduce((n, entry) => n + entry.frames, 0)} poses | ${rows.length - nativeMap.size} héros sans atlas de présentation dédié |
| Manifestes complets de Mêlée | ${full.size} héros, 45 états × 4 cellules par héros | ${rows.length - full.size} héros sans manifeste complet |
| Corrections de base | ${correctedMap.size} héros, ${[...correctedMap.values()].reduce((n, entry) => n + entry.frames, 0)} poses | Comptage séparé des présentations et des 45 états |
| Invocations et renforts natifs | ${current.entities.nativeAnimationAtlases} atlas, ${current.entities.nativeAnimationPoses} poses | Les ${current.entities.sheets} feuilles historiques à quatre poses restent conservées |
| Présentations scriptées | ${current.presentations.scriptedRecipes} recettes, ${current.presentations.scriptedHeroes} héros du roster, ${current.presentations.scriptedPairs} paires héros/phase | ${current.presentations.sharedTemplatePairs} paires utilisent les présentations communes |
| Mécanismes de décor | ${stage.sceneMechanismDefinitions} profils, ${stage.rosterUniversesWithSceneMechanismDefinition} univers ; ${stage.rosterUniversesWithMechanismInEveryMode} couverts dans les quatre modes | ${stage.rosterUniversesWithoutSpecificSceneMechanism} univers ont seulement leur ambiance de base |
| Capacités documentées | ${abilities.authoredHeroes} héros, ${abilities.authoredSlots} slots, ${abilities.completeThreeSlotKits} kits complets et ${abilities.partialSlotKits} correctifs partiels | ${abilities.effectiveStrictGenericSlots} libellé générique strict dans la résolution ; cela ne certifie pas la fidélité visuelle |
| Inventaire des fichiers | ${current.assetInventory.deliveredUniquePngFiles} PNG distincts dans ${current.assetInventory.registryFiles} registres d’assets | Les fichiers partagés ne sont comptés qu’une fois ; aucun fichier refusé n’est livré |

Les ${current.scope.heroes} héros et ${current.scope.universes} univers restent sans certification source 1:1, y compris les contenus natifs. Les huit rangées d’un atlas de présentation et les sept phases de script sont deux couvertures différentes ; un atlas de 32 poses ne prouve pas un manifeste de 45 états.

## Personnages, versions et refus

Les nouveaux atlas de présentation effectivement livrés concernent : ${newNative.map(entry => roster.get(entry.heroId).name).join(', ')}. Les scripts W7 comprennent ${current.presentations.wave7Delivery.registeredRecipes} recettes enregistrées ; leurs ${current.presentations.wave7Delivery.acceptedNativeSuperHelpers} helpers acceptent les capacités réellement résolues.

BlazBlue suit Continuum Shift Extend ; Guilty Gear suit Xrd REV 2. Les variantes de tenue, d’équipement et d’action restent explicites. Les [révisions de rôle et de source](role-and-source-revisions.json) documentent notamment les sabres de Luke et Vader, le DL-44 de Han, Sickle Storm d’Axl et Azami de Baiken. Elles ne donnent pas de dégâts à une musique ou au Kessel Run. Les costumes et armes des remplacements Kenshin, Sanosuke et Kaoru sont référencés dans leurs provenances.

Les présentations natives de **Luke et Vader ont été refusées** ; leurs bases n’ont pas été tentées après l’arrêt de leur production. La présentation native **et la base d’Obi-Wan ont été refusées**. La **base de Leia a été refusée deux fois** ; sa présentation acceptée est comptée séparément. Aucune image refusée ou non tentée n’est livrée. Les anciens sprites fournissent les poses disponibles aux emplacements sans nouvel asset. Les [tentatives B](part-b-attempts.json) et [la livraison B](part-b-delivery.json) distinguent précisément ces états, sans les convertir en succès ou en image source certifiée.

## Sources et preuves

Les [provenances A](part-a-provenance.json), [B](part-b-provenance.json), [C](part-c-provenance.json) et les corrections [de base A](base-part-a-provenance.json), [B](base-part-b-provenance.json), [C](base-part-c-provenance.json) relient prompts, sorties natives, sources locales, normalisations, empreintes et limites de version. Une URL indexée ou refusée n’est pas présentée comme une page intégralement lue. Les anciennes sources et registres restent des références immuables.

Ragna dispose du nouveau manifeste complet : [mouvement](ragna-sources/provenance-motion.json), [combat](ragna-sources/provenance-combat.json), [prise et contacts](ragna-sources/grip-pixel-checks-combat.json). Les preuves Chromium couvrent [les états et prises aux rebords](browser/ragna-core-result.json), [le déplacement au clavier et la pause](browser/ragna-movement-result.json), puis [Carnage Scissors à froid](browser/ragna-super-result.json) et [le bilan consolidé de Ragna](browser/ragna-evidence.json). Ces contrôles portent sur les images et les coordonnées effectivement utilisées ; ils ne certifient pas les frames du jeu original.

Les [trois nouvelles entités](README-invocations.md) sont Bahamut FFVII original, la baleine rose Yamada et les Black Egrets modernes sans brassards rouges. Les 48 poses natives ont été contrôlées dans les deux orientations et dans les vrais parcours GameCanvas. L’inspection a trouvé puis fait corriger une surcouche Megaflare décalée ; le diagnostic avant correction reste archivé.

Les [24 mécanismes de décor supplémentaires](stage-coverage.md) couvrent douze univers auparavant absents. Les [137 anciennes définitions et 274 signatures Canvas](stage-baseline.json) restent identiques. Les géométries sont des adaptations de machines ou de lieux précis, avec exclusions de continuité, temps de simulation et pause/mouvement réduit. Aucun danger, dégât, déplacement jouable ou frame officielle n’est ajouté.

Le [CSV de couverture](coverage.csv) conserve exactement 1911 lignes de héros dans l’ordre précédent : atlas natif, manifeste complet, base corrigée, script, ambiance et mécanisme par mode, avec statut source toujours non certifié. Le [générateur](build-coverage.mjs) lit les registres et vérifie les routes réelles avant d’écrire ce fichier ; il refuse de compter les images refusées. L’[agrégat des preuves Chromium](browser-checks.json) garde les compteurs de dessin, cellules et parcours séparés, ainsi que la panne externe Google Fonts observée par certains harnesses. Les [mesures JSON](current.json) et [leur lecture](current.md) conservent les détails et les empreintes d’entrée. Les [baselines](baseline.json) et [métadonnées avant intégration](runtime-baseline.json) ne sont pas réécrites.

## Validation

Les [tests des supers W7](../../scripts/nativeSuperRuntimeWave7.test.mjs) et [des contacts W6/W7](../../scripts/combatContactVisualWave6.test.mjs) restent distincts des preuves d’assets et de présentation. Les contrôles ciblés des décors et des invocations passent ; les preuves détaillées figurent dans leurs rapports et harness Chromium. Les huit tests d’invocation W7 et quarante tests historiques W5/W6 passent ensemble après correction de Bahamut. Le parcours navigateur enregistre 48 cellules J1, 48 J2, 48 miroirs RGBA exacts et un impact par entité sans erreur de page.

${validationParagraph}

Reproduction depuis la racine :

\`\`\`sh
node scripts/combatFidelityAudit.mjs --check
node docs/combat-fidelity-wave7-2026-10-20/build-coverage.mjs
\`\`\`
`;
fs.writeFileSync(new URL('README.md', import.meta.url), doc);
console.log(JSON.stringify({ readme: new URL('README.md', import.meta.url).pathname, deliveredThisWave: { nativeHeroes: newNative.length, bases: newBases.length, manifests: newFull.length, entities: newEntities.length, usedPoses: newPoseCount, pngFiles: newSheetCount } }, null, 2));
