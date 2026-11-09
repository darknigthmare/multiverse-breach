import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { HEROES_DB } from '../../src/game/heroes.js';
import { COMBAT_ABILITY_OVERRIDES } from '../../src/game/combat/abilities/catalog.js';

const root = path.resolve(import.meta.dirname, '../..');
process.chdir(root);
const directory = 'docs/combat-fidelity-wave17-2026-11-02';
const previous = 'docs/combat-fidelity-wave16-2026-10-28';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const write = (name, value) => fs.writeFile(`${directory}/${name}`, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const parts = {
  A: 'tomba_hero charles_tomba tabby_tomba winston_tr spyro_spyro spyro_sparx spyro_hunter rayman_rayman rayman_globox rayman_barbara woodruff_hero professor_azimuth master_boozook prey_2006_tommy_tawodi prey_2006_jen prey_2006_enisi beyond_good_evil_jade beyond_good_evil_peyj beyond_good_evil_double_h metal_hellsinger_unknown metal_hellsinger_paz dantes_inferno_dante dantes_inferno_beatrice dantes_inferno_virgil shadow_man_michael_leroi shadow_man_mama_nettie shadow_man_jaunty croc_croc croc_beany_bird gex_gex heart_of_darkness_andy heart_of_darkness_amigo_evacuation rival_schools_batsu rival_schools_hinata rival_schools_kyosuke jersey_devil_jersey_devil tail_concerto_waffle tail_concerto_alicia tail_concerto_cyan redneck_rampage_leonard'.split(' '),
  B: 'thomas_rogan_hotd g_hotd sophie_hotd james_taylor_hotd2 gary_stewart_hotd2 amy_crystal_hotd2 lisa_rogan_hotd3 g_hotd3 dan_taylor_hotd3 bioshock_rapture_jack bioshock_rapture_bouncer counter_strike_sas counter_strike_gign counter_strike_fbi team_fortress_2_scout team_fortress_2_soldier team_fortress_2_medic sanctum_skye_autumn sanctum_sweet_autumn sanctum_simo hotline_miami_jacket hotline_miami_biker hotline_miami_richter walking_dead_telltale_lee_everett clementine_final_season walking_dead_telltale_kenny crypt_necrodancer_cadence crypt_necrodancer_melody nemesis_awaken_realms_soldier nemesis_awaken_realms_scientist nemesis_awaken_realms_scout absolver_downfall_windfall absolver_downfall_khalt absolver_downfall_forsaken atomic_heart_p3 atomic_heart_granny_zina atomic_heart_tereshkova bendy_ink_machine_henry bendy_ink_machine_boris bendy_ink_machine_allison'.split(' '),
  C: 'miku yugi pomni taichi rin luka len kaiba joey tea_ygo bakura_ygo mai_ygo pegasus_ygo atem jax caine ragatha kinger gangle zooble matt izzy sora_biyomon mimi_palmon joe_gomamon kari_gatomon tk_patamon korvo_solar terry_solar yumyulack_solar jesse_solar momo_ayase oken_dandadan aira_dandadan jiji_dandadan seiko_dandadan turbo_granny_cat judy_hopps nick_wilde chief_bogo'.split(' ')
};
assert.deepEqual(Object.values(parts).map(ids => ids.length), [40, 40, 40]);
assert.equal(new Set(Object.values(parts).flat()).size, 120);
const publishedCommit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
assert.equal(publishedCommit, '9981b73deb3ee027c86877d7c15c6698e4f02191');
const remote = execFileSync('git', ['ls-remote', '--heads', 'origin', 'work'], { encoding: 'utf8' }).trim().split(/\s+/)[0];
assert.equal(remote, publishedCommit, 'Publication must finish before W17 production');
const files = {};
for (const [source, destination] of [['current.json', 'baseline-current-wave16.json'], ['validation.json', 'baseline-validation-wave16.json'], ['build-exit.json', 'baseline-build-exit-wave16.json'], ['production-freeze.json', 'baseline-production-freeze-wave16.json'], ['completion-current.json', 'baseline-completion-wave16.json']]) {
  const bytes = await fs.readFile(`${previous}/${source}`);
  await fs.writeFile(`${directory}/${destination}`, bytes, { flag: 'wx' });
  files[`${directory}/${destination}`] = hash(bytes);
}
await write('baseline-authored-abilities.json', COMBAT_ABILITY_OVERRIDES);
files[`${directory}/baseline-authored-abilities.json`] = hash(await fs.readFile(`${directory}/baseline-authored-abilities.json`));
const audit = JSON.parse(await fs.readFile(`${previous}/current.json`));
const validation = JSON.parse(await fs.readFile(`${previous}/validation.json`));
assert.equal(validation.passed, true);
const heroes = Object.entries(parts).flatMap(([part, ids]) => ids.map(id => {
  const hero = HEROES_DB.find(item => item.id === id);
  assert.ok(hero, `Unknown hero ${id}`);
  const priorAuthored = COMBAT_ABILITY_OVERRIDES[id] || null;
  return { hero, part, alreadyAuthored: !!priorAuthored, priorAuthored,
    missingExplicitSlots: ['simple', 'secondary', 'defense'].filter(slot => !priorAuthored?.[slot]) };
}));
assert.equal(heroes.filter(row => !row.alreadyAuthored).length, 76);
assert.equal(heroes.reduce((sum, row) => sum + row.missingExplicitSlots.length, 0), 249);
const plan = { schemaVersion: 1, wave: 17, date: '2026-11-02', createdAt: new Date().toISOString(), publishedBaselineCommit: publishedCommit,
  parts, heroes, priorAudit: `${directory}/baseline-current-wave16.json`, priorValidation: `${directory}/baseline-validation-wave16.json`,
  rules: { charactersPerAgent: 40, disjoint: true, sourcePlansBeforeGeneration: true, noOldPngOrRegistryOverwrite: true,
    rawGenerationsAndExclusionsRetained: true, source1to1Verified: false, preselectionSourcesAreNotNetworkVerification: true,
    independentNativePosesOnly: true, priorPartialSlotsPreservedUnlessDocumentedSourceCorrection: true },
  initialTotals: { authoredHeroes: Object.keys(COMBAT_ABILITY_OVERRIDES).length, selectedHeroes: heroes.length,
    selectedNewAuthoringIdentities: 76, selectedPartialKits: 21, selectedCompleteKits: 23,
    selectedMissingExplicitSlots: 249, registryFiles: audit.assetInventory.registryFiles, pngFiles: audit.assetInventory.deliveredUniquePngFiles },
  specialPlansRequiredBeforeGeneration: { full45: 'beyond_good_evil_jade', rpg16Performers: ['beyond_good_evil_jade', 'rayman_rayman', 'sanctum_skye_autumn', 'oken_dandadan', 'crypt_necrodancer_melody', 'team_fortress_2_medic'],
    tactics: ['Beyond Good & Evil (2003)', 'Rayman Legends (2013)', 'Atomic Heart (2023)', 'Zootopia (2016)'] }
};
await write('batch-plan-before.json', plan);
files[`${directory}/batch-plan-before.json`] = hash(await fs.readFile(`${directory}/batch-plan-before.json`));
const oldPreservation = JSON.parse(await fs.readFile(`${previous}/baseline-preservation.json`));
const preservation = { createdAt: new Date().toISOString(), publishedBaselineCommit: publishedCommit, pngFiles: {}, registries: {}, historicalReports: { ...oldPreservation.historicalReports } };
for (const sheet of audit.assetInventory.sheets) preservation.pngFiles[`public${sheet}`] = hash(await fs.readFile(`public${sheet}`));
for (const registry of audit.assetInventory.registries) preservation.registries[registry] = hash(await fs.readFile(registry));
async function scan(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const name = `${dir}/${entry.name}`;
    if (entry.isDirectory()) await scan(name);
    else if (entry.isFile()) preservation.historicalReports[name] = hash(await fs.readFile(name));
  }
}
await scan(previous);
await write('baseline-preservation.json', preservation);
files[`${directory}/baseline-preservation.json`] = hash(await fs.readFile(`${directory}/baseline-preservation.json`));
await write('baseline-receipt.json', { schemaVersion: 1, createdAt: new Date().toISOString(), publishedBaselineCommit: publishedCommit, remoteCommit: remote, files, source1to1Verified: false });
console.log(JSON.stringify({ wave: 17, publishedCommit, heroes: heroes.length, slots: 249, png: Object.keys(preservation.pngFiles).length, registries: Object.keys(preservation.registries).length, preservedReports: Object.keys(preservation.historicalReports).length, planSha256: files[`${directory}/batch-plan-before.json`] }));
