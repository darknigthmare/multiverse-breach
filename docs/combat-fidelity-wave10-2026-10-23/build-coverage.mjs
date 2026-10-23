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
const [oldHeader, ...old] = parseCSV(read('docs/combat-fidelity-wave9-2026-10-22/coverage.csv').toString());
assert.deepEqual(oldHeader.slice(0, 7), ['heroId', 'name', 'universe', 'nativePresentationAtlas', 'full45StateMeleeManifest', 'correctedBaseAtlas', 'source1to1Verified']);
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
const allNative = getCharacterAnimationAssets().filter(delivered);
const native = allNative.filter(entry => entry.frames === 32);
const partial = allNative.filter(entry => entry.frames !== 32);
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
const header = [...oldHeader.slice(0, 7), 'scriptedPresentation', 'stageBaseAtmosphere', 'stageMechanismAnyMode', 'stageMechanismAllFourModes', ...modes.map(mode => mode.toLowerCase() + 'StageMechanism'), 'nativeAtlasSheet', 'correctedBaseSheet', 'full45StateFrames', 'sourceFidelityStatus', 'partialNativePresentation', 'partialNativePoseCount'];
const rows = old.map(previous => {
  const hero = roster.get(previous[0]), asset = nativeMap.get(hero.id), correction = correctedMap.get(hero.id);
  const mechanisms = modes.map(mode => getStageAnimationProfile({ universe: hero.universe, mode })?.id || '');
  const row = [hero.id, hero.name, hero.universe, String(!!asset), String(full.has(hero.id)), String(!!correction), 'false',
    String(CHARACTER_PRESENTATIONS[hero.id]?.universe === hero.universe), String(!!getStageAtmosphereProfile({ universe: hero.universe }).enabled),
    String(mechanisms.some(Boolean)), String(mechanisms.every(Boolean)), ...mechanisms,
    asset?.sheet || '', correction?.sheet || '', String(full.has(hero.id) ? MELEE_STATES.length * 4 : 0), 'not-validated-1:1', String(partial.some(entry => entry.heroId === hero.id)), String(partial.find(entry => entry.heroId === hero.id)?.frames || 0)];
  for (const column of [3, 4, 5]) if (previous[column] === 'true') assert.equal(row[column], 'true', 'previous coverage regressed');
  return row;
});
// Refused native requests, refused bases and unattempted Luke/Vader bases must never become delivered flags.
for (const id of ['luke', 'vader', 'obi_wan', 'robin_tt', 'raven_tt', 'starfire_tt']) { assert.equal(nativeMap.has(id), false, id); assert.equal(correctedMap.has(id), false, id); }
assert.equal(correctedMap.has('leia_organa'), false, 'Leia base was refused; her accepted presentation atlas is a separate asset');
const current = json('docs/combat-fidelity-wave10-2026-10-23/current.json');
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

const baseline = json('docs/combat-fidelity-wave10-2026-10-23/baseline.json');
const beforeNative = new Set(baseline.meleeBindings.nativePresentationHeroIds);
const newNative = native.filter(entry => !beforeNative.has(entry.heroId));
const beforeBases = new Set(baseline.baseSpriteCorrections.entries.map(entry => entry.heroId));
const newBases = [...correctedMap.values()].filter(entry => !beforeBases.has(entry.heroId));
const beforeFull = new Set(baseline.meleeBindings.fullDetailedMeleeManifestHeroes);
const newFull = current.meleeBindings.detailedManifestCoverage.filter(entry => entry.complete && !beforeFull.has(entry.id));
const beforeSummons = new Set(baseline.entities.nativeAnimationEntries.map(entry => entry.key));
const newSummons = current.entities.nativeAnimationEntries.filter(entry => !beforeSummons.has(entry.key));
const beforePartial = new Set(baseline.meleeBindings.nativePartialPresentationEntries.map(entry => entry.heroId));
const newPartial = partial.filter(entry => !beforePartial.has(entry.heroId));
const poses = newPartial.reduce((n, e) => n + e.frames, 0) + newNative.reduce((n, e) => n + e.frames, 0) + newBases.reduce((n, e) => n + e.frames, 0)
  + newFull.reduce((n, e) => n + e.boundFrames, 0) + newSummons.length * 16;
const newSheets = new Set([...newPartial.map(e => e.sheet), ...newNative.map(e => e.sheet), ...newBases.map(e => e.sheet), ...newFull.flatMap(e => e.sheets), ...newSummons.map(e => e.sheet)]);
let validationText = 'Les contrôles finaux du build et de distribution sont encore en cours. Aucun build complet réussi n’est déduit des tests ciblés.';
const validationPath = new URL('validation.json', import.meta.url);
if (fs.existsSync(validationPath)) {
 const v = JSON.parse(fs.readFileSync(validationPath));
 if (v.build?.exitCode === 0 && v.passed === true) validationText = `Build complet réussi (code0), ${v.tests?.total ?? v.build?.testCount ?? 'voir le rapport'} tests. Validation de distribution des PNG et preuves navigateur : [validation.json](validation.json).`;
}
const doc = `# Lot 10 — 40 personnages, 23 octobre 2026

Matrix Reloaded : Neo, Trinity, Morpheus, Smith et Seraph. Stargate SG-1 saison 4 : O’Neill, Teal’c, Carter, Daniel et Hammond. Half-Life 2 : Freeman, Barney, Alyx, Eli et Kleiner. Fallout 4 : Danse, Nick Valentine, Dogmeat, Piper et Preston. Aliens : Hicks, Vasquez, Bishop, Ripley et Hudson. PAYDAY 2 : Dallas, Wolf, Hoxton, Chains et Clover. Ghostbusters 1984 : Venkman, Ray, Winston, Egon et Janine. Left 4 Dead : Bill du premier jeu ; Ellis, Coach, Rochelle et Nick du second.

Livré et mesuré : **${newNative.length} atlas complets de 32 poses**, **${newPartial.length} atlas partiel (${newPartial.reduce((n, e) => n + e.frames, 0)} poses)**, **${newBases.length} bases de 16 poses**, **${newFull.length} manifestes Mêlée de 45 états** et **${newSummons.length} renforts de 16 poses**. Ces assets représentent **${poses} poses natives dans ${newSheets.size} nouveaux PNG**. Les dessins rejetés et les supports de contrôle sont exclus. Quarante recettes donnent à chaque personnage sept scènes de combat ; leurs clocks sélectionnent les gestes natifs sans déformer leur corps.

Les bases de 16 poses couvrent quatre états généraux ; elles ne constituent pas une animation distincte de chaque capacité. Par exemple, le secondaire au zat d’O’Neill n’a pas de planche dédiée dans ce lot. Les 45 états complets ajoutés concernent Neo et Freeman.

Les attaques utilisent les gestes et équipements de la version choisie. Neo et Smith combattent physiquement ; les répliques et réécritures du code ne deviennent pas des pouvoirs. Freeman distingue le Gravity Gun orange et la version bleue surchargée qui relance une sphère Combine. Carter tire avec son P90. Nick Valentine emploie son revolver artisanal. Dogmeat reste quadrupède. Ripley pilote le véritable P-5000 dessiné dans son atlas. Les informations d’Egon, Daniel, Janine ou Coach soutiennent les alliés sans attaque de scanner, téléphone ou voix. Les impacts et coûts restent décidés une seule fois par le moteur.

| Couverture cumulative | Mesure réelle |
| --- | --- |
| Actions simples, secondaires et défenses explicites | ${current.abilities.authoredHeroes} héros, ${current.abilities.authoredSlots} actions |
| Libellés strictement génériques effectifs | ${current.abilities.effectiveStrictGenericSlots} |
| Atlas natifs complets de 32 poses | ${nativeMap.size}/1911 ; ${current.meleeBindings.heroesWithoutDedicatedPresentationAtlas} encore manquants |
| Atlas partiels | ${partial.length}, suivis séparément |
| Mêlée complète de 45 états | ${full.size}/1911 ; ${current.meleeBindings.heroesWithoutFullDetailedMeleeManifest} encore manquants |
| Bases corrigées de 16 poses | ${correctedMap.size} héros |
| Présentations | ${current.presentations.scriptedHeroes} héros, ${current.presentations.scriptedPairs} paires héros/phase |
| Invocations et renforts natifs de 16 poses | ${current.entities.nativeAnimationAtlases} atlas |
| Décors | ${current.stages.sceneMechanismDefinitions} mécanismes dans ${current.stages.rosterUniversesWithSceneMechanismDefinition}/525 univers |
| Univers avec ambiance de base seule | ${current.stages.rosterUniversesWithoutSpecificSceneMechanism} |

Les nouveaux renforts sont Trinity, Teal’c, Alyx, Nick Valentine, Hicks, Chains, Egon et Coach. Les huit paires principales et les 32 appelants servis par ces atlas restent dans leur univers ; huit autres appelants choisissent un partenaire réel différent pour éviter l’auto-appel. Les cellules 512×256 conservent la portée des armes et la stature humaine commune. Les anciens PNG et registres restent vérifiés. Dix appels historiques du lot Half-Life/PAYDAY passent explicitement de Dog/Sentry à un partenaire, tandis que les autres anciens bindings sont préservés. [Sources et corrections des renforts](summon-provenance.json).

Les [décors](stage-coverage.md) ajoutent ${current.stages.sceneMechanismDefinitions-baseline.stages.sceneMechanismDefinitions} mécanismes à ${current.stages.rosterUniversesWithSceneMechanismDefinition-baseline.stages.rosterUniversesWithSceneMechanismDefinition} univers auparavant limités à l’ambiance de base. Les 241 définitions et 482 signatures Canvas précédentes restent contrôlées. Les 525 univers conservent leur ambiance configurée.

Les sources originales, prompts exacts, arguments, références, corrections et incidents techniques sont conservés dans les provenances [A](part-a-provenance.json), [B](part-b-provenance.json), [C](part-c-provenance.json) et [D](part-d-provenance.json). Janine conserve six phases natives (24 poses) ; la correction des phases super/finale a reçu un refus explicite de l’outil et ces deux phases et les actions ordinaires réutilisent explicitement les poses acceptées, sans les compter comme nouvelles phases ni base16. Aucune nouvelle base16 de Janine n’est livrée. [Refus conservé](part-d-sources/janine_gb-phone-correction-refusal.json). Les anciens refus ne sont pas retentés sous un alias. **Les dessins générés et les mécaniques sont des adaptations ; aucune fidélité source 1:1 n’est certifiée.**

L’audit des références contrôle toujours les 1912 chemins courants et mesure aussi l’ancien PNG de Freeman comme cas historique de calibration. Ce correctif conserve tous les seuils, attentes et fonctions de classification ; une référence historique absente ou dégradée échoue encore. [Correctif et cinq tests de régression](rift-refresh/retired-known-case-regression.json).

${validationText}

[Mesures](current.json) · [Couverture des 1911 héros](coverage.csv) · [Preuves navigateur](browser-checks.json) · [État W9 conservé](baseline.json).

Reproduire : \`node scripts/combatFidelityAudit.mjs --check\`, puis \`node docs/combat-fidelity-wave10-2026-10-23/build-coverage.mjs\`.
`;

fs.writeFileSync(new URL('README.md', import.meta.url), doc);
console.log(JSON.stringify({wave:10,newNativeHeroes:newNative.length,newBases:newBases.length,newFull:newFull.length,newPartners:newSummons.length,newPoses:poses,newPng:newSheets.size}));
