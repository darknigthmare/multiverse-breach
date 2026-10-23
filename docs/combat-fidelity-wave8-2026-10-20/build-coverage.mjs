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
const [oldHeader, ...old] = parseCSV(read('docs/combat-fidelity-wave7-2026-10-20/coverage.csv').toString());
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
const current = json('docs/combat-fidelity-wave8-2026-10-20/current.json');
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

const baseline = json('docs/combat-fidelity-wave8-2026-10-20/baseline.json');
const beforeNative = new Set(baseline.meleeBindings.nativePresentationHeroIds);
const newNative = native.filter(entry => !beforeNative.has(entry.heroId));
const beforeBases = new Set(baseline.baseSpriteCorrections.entries.map(entry => entry.heroId));
const newBases = [...correctedMap.values()].filter(entry => !beforeBases.has(entry.heroId));
const beforeFull = new Set(baseline.meleeBindings.fullDetailedMeleeManifestHeroes);
const newFull = current.meleeBindings.detailedManifestCoverage.filter(entry => entry.complete && !beforeFull.has(entry.id));
const beforeSummons = new Set(baseline.entities.nativeAnimationEntries.map(entry => entry.key));
const newSummons = current.entities.nativeAnimationEntries.filter(entry => !beforeSummons.has(entry.key));
const poses = partial.reduce((n,e)=>n+e.frames,0)+newNative.reduce((n,e)=>n+e.frames,0)+newBases.reduce((n,e)=>n+e.frames,0)+newFull.reduce((n,e)=>n+e.boundFrames,0)+newSummons.reduce((n,e)=>n+e.frames,0);
const png = new Set([...newNative.map(e=>e.sheet),...partial.map(e=>e.sheet),...newBases.map(e=>e.sheet),...newFull.flatMap(e=>e.sheets),...newSummons.map(e=>e.sheet)]).size;
const validationFile = new URL('validation.json', import.meta.url);
const validation = fs.existsSync(validationFile) ? JSON.parse(fs.readFileSync(validationFile)) : null;
const validationText = validation?.build?.exitCode === 0 && validation.testsFailed === 0
  ? `Build complet passé : ${validation.testsPassed} tests dans ${validation.testSuites} groupes ; lint et contrôle du diff passés. Les preuves Chromium et les fichiers de production sont détaillés dans [validation.json](validation.json).`
  : 'La validation complète est en cours ; les contrôles ciblés et leurs preuves restent consultables dans les fichiers du lot.';
const doc = `# Lot W8 — vingt personnages, 20 octobre 2026

Les vingt identités du [plan figé avant travail](batch-plan-before.json) sont traitées en parallèle : cinq Teen Titans2003, cinq Yakuza (Kiwami2016 / Like a Dragon2020 / Yakuza5), cinq Metal Gear Rising2013 et cinq membres humains de Dungeon Meshi2024. Le lot livre **${newNative.length} nouvelles planches complètes32 et ${partial.length} planche partielle (${partial.reduce((n,e)=>n+e.frames,0)} poses)**, **${newBases.length} bases16**, **un manifeste complet Kiryu45 états** et **quatre renforts RPG16** : **${poses} poses réellement utilisées dans ${png} PNG supplémentaires**. Vingt recettes et vingt projections de super sont enregistrées. Beast Boy reçoit uniquement ses huit poses T-Rex pour la finale et le super ; ses vingt-quatre poses humaines écartées ne sont jamais exposées. Ses autres scènes emploient la base gorille. Les volumes artistiques comptent uniquement les images acceptées et contrôlées.

Robin, Raven et Starfire n’ont pas reçu de nouvelle planche après les refus du générateur d’images. Les actions et scripts emploient les visuels existants ; les refus et limites du groupe A sont conservés. La fidélité source1:1 n’est certifiée pour aucun personnage. Les œuvres choisies, écarts de palette/proportions et adaptations de mécanique restent documentés.

| Couverture cumulée | État mesuré |
| --- | --- |
| Actions simples, secondaires, défenses | ${current.abilities.authoredHeroes} héros, ${current.abilities.authoredSlots} actions, ${current.abilities.completeThreeSlotKits} kits complets et ${current.abilities.partialSlotKits} partiels |
| Libellés strictement génériques résolus | ${current.abilities.effectiveStrictGenericSlots} ; ce compteur ne certifie pas les animations |
| Présentations natives32 | ${nativeMap.size}/1911 héros, ${current.meleeBindings.heroesWithoutDedicatedPresentationAtlas} encore sans planche dédiée |
| Mêlée45 états | ${full.size}/1911 héros, ${current.meleeBindings.heroesWithoutFullDetailedMeleeManifest} encore sans manifeste complet |
| Bases corrigées16 | ${correctedMap.size} héros |
| Recettes de présentation | ${current.presentations.scriptedHeroes} héros du roster, ${current.presentations.scriptedPairs} paires héros/phase |
| Invocations et renforts16 | ${current.entities.nativeAnimationAtlases} atlas, dont ${current.entities.nativeRosterPerformerAtlases} partenaires réels du roster |
| Décors | ${current.stages.sceneMechanismDefinitions} mécanismes, ${current.stages.rosterUniversesWithSceneMechanismDefinition}/525 univers ciblés ; ${current.stages.rosterUniversesWithoutSpecificSceneMechanism} avec ambiance de base seule |

Les protections de Raven, Saejima et Chilchuck et les soins de Senshi et Falin gardent leur rôle sans infliger de dégâts aux ennemis. Beast Boy utilise des corps animaux natifs selon le chargement sélectionné. Les armes propres de Sam, Mistral, Monsoon, Blade Wolf et Laios restent distinctes. Starfire suit son projectile physique dans Fighter ; Mêlée et RPG projettent son vol sur leur propre horloge d’impact, sans événement de dégâts supplémentaire.

Kiryu est documenté dans [ses preuves natives](kiryu-sources/native-evidence.json). Les nouveaux partenaires sont Cyborg (appelé par Robin), Kiryu (Majima), Raiden (Blade Wolf) et Laios (Marcille). Leurs cellules 512×256 maintiennent une stature 190 et la portée complète des armes ; le renderer respecte cet aspect. Le coût, le temps et l’impact unique restent ceux du moteur existant. [Provenance des renforts](summon-provenance.json).

Les [décors](stage-coverage.md) ajoutent quarante mécanismes pour vingt univers auparavant sans mécanisme ciblé. Les 161 profils et 322 signatures de commandes Canvas précédents restent identiques. Les sources ouvertes et simples extraits indexés sont distingués dans [le registre d’accès](stage-source-access.json).

Les sources natives, prompts exacts, références, correctifs et refus sont archivés par groupe : [A](part-a-provenance.json), [B](part-b-provenance.json), [C](part-c-provenance.json), [D](part-d-provenance.json). Sharp ne sert qu’à segmenter, nettoyer l’alpha, calibrer et emballer les dessins générés. Les poses et corrections anatomiques proviennent du générateur d’images.

[Mesures détaillées](current.json) · [Lecture des mesures](current.md) · [Couverture des 1911 héros](coverage.csv) · [Preuves Chromium](browser-checks.json). Les [mesures précédentes](baseline.json) et [métadonnées avant intégration](runtime-baseline.json) sont immuables.

${validationText}

Reproduire : \`node scripts/combatFidelityAudit.mjs --check\` puis \`node docs/combat-fidelity-wave8-2026-10-20/build-coverage.mjs\`.
`;
fs.writeFileSync(new URL('README.md', import.meta.url),doc);
console.log(JSON.stringify({wave:8,newNativeHeroes:newNative.length,newBases:newBases.length,newFull:newFull.length,newPartners:newSummons.length,newPoses:poses,newPng:png}));
