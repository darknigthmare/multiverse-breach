/** Read-only probes of the real source resolvers; names are not 1:1 approval. */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const [sourceRoot, output] = process.argv.slice(2);
if (!sourceRoot || !output) throw new Error('Usage: inspect_runtime_techniques.mjs SOURCE_ROOT OUTPUT.json');
const moduleAt = name => import(pathToFileURL(path.join(sourceRoot, name)).href);
const { HEROES_DB } = await moduleAt('src/game/heroes.js');
const { ENEMIES_DB } = await moduleAt('src/game/enemies.js');
const { createPlayerHero } = await moduleAt('src/game/playerHero.js');
const { wardrobeActorKey } = await moduleAt('src/game/wardrobe.js');
const { readActorTechniques } = await moduleAt('src/game/actorFidelityBacklog.js');
const { resolveCombatAbility } = await moduleAt('src/game/combatIdentity.js');
const { prepareSourceSignature } = await moduleAt('src/game/signatureSourceKits.js');
const { getRpgCombatantAbility } = await moduleAt('src/game/rpgTargeting.js');
const clone = value => Array.isArray(value) ? value.map(clone) : value && typeof value === 'object'
  ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, clone(item)])) : value;
const text = value => typeof value === 'string' ? value : value?.en || value?.fr || '';
const generic = name => /(?:signature strike|breach technique|origin burst|signature action|signature technique|defensive action|decisive action)$/i.test(name);
const actors = [createPlayerHero(), ...HEROES_DB].map(actor => ({ actor, kind: 'hero' }));
for (const [universe, roster] of Object.entries(ENEMIES_DB)) for (const [field, kind] of [['monsters', 'enemy'], ['bosses', 'boss'], ['worldBoss', 'worldBoss']]) {
  for (const actor of field === 'worldBoss' ? (roster[field] ? [roster[field]] : []) : roster[field] || []) actors.push({ actor: { ...actor, universe: actor.universe || universe }, kind });
}
const rows = [];
for (const { actor, kind } of actors) {
  const raw = readActorTechniques(actor).filter(action => action.genericName);
  if (!raw.length) continue;
  const prepared = clone(actor);
  const legacy = prepareSourceSignature(prepared);
  const slots = raw.map(({ slot, name }) => {
    const combat = resolveCombatAbility(actor, slot), rpg = getRpgCombatantAbility(actor, slot);
    const preparedCombat = resolveCombatAbility(prepared, slot), preparedRpg = getRpgCombatantAbility(prepared, slot);
    return { slot, rawName: name, combatName: text(combat?.name), rpgName: text(rpg?.name),
      preparedName: text(prepared[slot]?.name), preparedCombatName: text(preparedCombat?.name), preparedRpgName: text(preparedRpg?.name),
      combatStillGeneric: !combat?.name || generic(text(combat.name)), rpgStillGeneric: !rpg?.name || generic(text(rpg.name)),
      preparedRpgStillGeneric: !preparedRpg?.name || generic(text(preparedRpg.name)),
      provenance: combat?.provenance || null };
  });
  rows.push({ actorKey: wardrobeActorKey(actor), actorId: actor.id || '', name: actor.name, universe: actor.universe, kind,
    slots, legacyPreparationSelected: Boolean(legacy), rawGenericSlots: raw.length,
    allCombatNamesResolved: slots.every(row => !row.combatStillGeneric), allRpgNamesResolved: slots.every(row => !row.rpgStillGeneric),
    allPreparedRpgNamesResolved: slots.every(row => !row.preparedRpgStillGeneric), source1to1Verified: false, artApproved: false });
}
const summary = { runtimeActors: actors.length, rawGenericActors: rows.length, rawGenericSlots: rows.reduce((sum, row) => sum + row.slots.length, 0),
  allCombatNamesResolvedActors: rows.filter(row => row.allCombatNamesResolved).length,
  allRpgNamesResolvedActors: rows.filter(row => row.allRpgNamesResolved).length,
  allPreparedRpgNamesResolvedActors: rows.filter(row => row.allPreparedRpgNamesResolved).length,
  scope: 'Real resolver calls on exact source actors and a battle-local preparation clone. A changed name does not certify source semantics, every engine call path or visual fidelity.',
  automaticClosures: 0, artApprovals: 0 };
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify({ summary, rows }, null, 2) + '\n');
console.log(JSON.stringify(summary));
