// Freeze literal old and selected expectations before the W13 final build.
// This authoring step never computes expected profiles during the tests.
import fs from 'node:fs';
import { ABILITIES_WAVE13_DEFINITIONS as kits } from '../../src/game/combat/abilities/abilitiesWave13Definitions.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE13 as sources } from '../../src/game/combat/combatSourceDefinitionsWave13.js';
const directory=new URL('./',import.meta.url);
const baseline=JSON.parse(fs.readFileSync(new URL('ability-baseline-before.json',directory)));
const target=new URL('../../scripts/combatCompletion.test.mjs',import.meta.url);
let source=fs.readFileSync(target,'utf8');
if(source.includes('const wave13CompletedRevisions'))throw new Error('W13 completion expectations are already frozen');
fs.writeFileSync(new URL('completion-test-before-wave13.txt',directory),source);
const revisions=Object.fromEntries(Object.entries(baseline.completion).map(([id,old])=>[id,{
 work:sources[id].sourceWork,name:sources[id].name,basis:'canonical-role',
 referencePrefix:kits[id].sourceReference,
 historicalSpecial:old.special.name,historicalWork:old.sourceWork,historicalReference:old.sourceReference,
 historicalSemantics:{effect:old.special.targeting.effect,shape:old.special.targeting.shape,targetSide:old.special.targeting.targetSide,damage:old.special.dmg},
 selectedSemantics:{effect:kits[id].special.targeting.effect,delivery:kits[id].special.targeting.delivery,shape:kits[id].special.targeting.shape,targetSide:kits[id].special.targeting.targetSide,multiplier:kits[id].special.dmg}
}]));
const block='// These twenty W13 selections are bounded to the frozen forty-character plan.\n'+
 '// Both historical completion records and selected source versions have literal expectations.\n'+
 'const wave13CompletedRevisions = '+JSON.stringify(revisions,null,2)+';\n'+
 "const wave13SelectedIds = Object.values(JSON.parse(readProjectFile('docs/combat-fidelity-wave13-2026-10-24/batch-plan-before.json')).parts).flat();\n\n";
const marker="test('completion covers every exact identity";
source=source.replace(marker,block+marker);
source=source.replace("test('every completed action carries an explicit identity basis and source scene', () => {", "test('every completed action carries an explicit identity basis and source scene', () => {\n  assert.equal(Object.keys(wave13CompletedRevisions).length, 20);\n  assert.deepEqual(sorted(Object.keys(wave13CompletedRevisions)), sorted(wave13SelectedIds.filter(id => Object.hasOwn(COMBAT_CAPABILITY_COMPLETION, id))), 'W13 revisions must match only selected historical completion identities');");
source=source.replace('const revision = wave12CompletedRevisions[id] ||','const revision = wave13CompletedRevisions[id] || wave12CompletedRevisions[id] ||');
source=source.replace('if (wave12CompletedRevisions[id] || wave11CompletedRevisions[id]) {','if (wave13CompletedRevisions[id] || wave12CompletedRevisions[id] || wave11CompletedRevisions[id]) {');
source=source.replace('if (wave12CompletedRevisions[id]) {','if (wave13CompletedRevisions[id] || wave12CompletedRevisions[id]) {');
source=source.replace('const selectedRevision=wave12CompletedRevisions[id] || wave11CompletedRevisions[id];','const selectedRevision=wave13CompletedRevisions[id] || wave12CompletedRevisions[id] || wave11CompletedRevisions[id];');
source=source.replace("    assert.equal(profile.effect, effect, id);\n    assert.equal(profile.targetSide, side, id);", "    if (id === 'granny_dw') {\n      assert.equal(COMBAT_CAPABILITY_COMPLETION[id].special.targeting.effect, effect, 'Historical headology cleanse remains immutable');\n      assert.equal(wave13CompletedRevisions[id].selectedSemantics.effect, 'guard');\n      assert.equal(profile.effect, 'guard', 'W13 selects nonoffensive practical instructions');\n    } else assert.equal(profile.effect, effect, id);\n    assert.equal(profile.targetSide, side, id);");
source=source.replace("test('the82 historical entity bindings retain their assets while ten explicit W10 callers select real partners',", "test('the82 historical entity bindings retain their assets while ten W10 and six W13 callers select real partners',");
source=source.replace("  const revisedCallers = new Set();", "  const selectedW13 = { chell: 'atlas', atlas: 'pbody', pbody: 'atlas', glados: 'atlas', wheatley: 'atlas', doug_rattmann: 'chell' };\n  assert.equal(Object.keys(selectedW10).length, 10); assert.equal(Object.keys(selectedW13).length, 6);\n  assert.ok(Object.keys(selectedW13).every(id => wave13SelectedIds.includes(id)));\n  const selectedPartners = { ...selectedW10, ...selectedW13 };\n  const revisedCallers = new Set();");
source=source.replaceAll('if (selectedW10[id]) {','if (selectedPartners[id]) {').replaceAll('selectedW10[id], id','selectedPartners[id], id');
source=source.replace('assert.equal(activeLegacyCallers.size, 72);', 'assert.equal(activeLegacyCallers.size, 66);');
source=source.replace('sorted(Object.keys(selectedW10)));','sorted(Object.keys(selectedPartners)));');
fs.writeFileSync(target,source);
console.log(JSON.stringify({literalSelectedCompletionRevisions:Object.keys(revisions).length,historicalEntityBindings:82,selectedW10:10,selectedW13:6,activeLegacyCallers:66}));
