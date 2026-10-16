import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createServer } from 'vite';
// Builds a complete coverage inventory; availability is not a fidelity approval.
const output = path.resolve(process.argv[2] || 'audit/signature-coverage.json');
const vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { HEROES_DB, EVENT_ITEMS_DB } = await vite.ssrLoadModule('/src/game/heroes.js');
  const { ENEMIES_DB } = await vite.ssrLoadModule('/src/game/enemies.js');
  const { createPlayerHero } = await vite.ssrLoadModule('/src/game/playerHero.js');
  const { describeNativeSignature, resolveSignatureInvocation, isSignatureCombatant } = await vite.ssrLoadModule('/src/game/signatureCatalog.js');
  const { getSmashAbilityProfile } = await vite.ssrLoadModule('/src/game/smashAbilityProfiles.js');
  const entries = [];
  const add = (actor, kind, index, universe) => {
    const unit = { ...actor, universe: actor.universe || universe };
    const summon = ['secondary', 'special'].find(key => unit[key]?.type === 'summon' && describeNativeSignature(unit, key));
    const superAction = describeNativeSignature(unit);
    const profiledSuper = !!superAction && !!getSmashAbilityProfile(unit, 'special');
    const event = resolveSignatureInvocation(EVENT_ITEMS_DB[unit.universe], unit);
    entries.push({ key: `${universe}::${kind}::${index}::${unit.id || unit.name}`, universe, kind,
      actorId: unit.id || null, name: unit.name, excludedNonCombat: !isSignatureCombatant(unit),
      nativeSummon: summon ? unit[summon].name : null, equippedInvocation: event?.id || null,
      meleeSuper: profiledSuper ? superAction.name.fr : null,
      sourceStatus: !isSignatureCombatant(unit) ? 'non-combat-preserved' : profiledSuper || summon || event ? 'adaptation-source-review-required' : 'missing-authored-signature',
      fidelityApproved: false });
  };
  [createPlayerHero(), ...HEROES_DB].forEach((actor, i) => add(actor, 'hero', i, actor.universe));
  for (const [universe, roster] of Object.entries(ENEMIES_DB)) {
    (roster.monsters || []).forEach((actor, i) => add(actor, 'enemy', i, universe));
    (roster.bosses || []).forEach((actor, i) => add(actor, 'boss', i, universe));
    if (roster.worldBoss) add(roster.worldBoss, 'worldBoss', 0, universe);
  }
  const summary = { universes: new Set(entries.map(e => e.universe)).size, total: entries.length,
    heroes: entries.filter(e => e.kind === 'hero').length, enemiesAndBosses: entries.filter(e => e.kind !== 'hero').length,
    nativeSummoners: entries.filter(e => e.nativeSummon).length, equippedInvocationBindings: entries.filter(e => e.equippedInvocation).length,
    profiledMeleeSupers: entries.filter(e => e.meleeSuper).length, nonCombat: entries.filter(e => e.excludedNonCombat).length,
    missing: entries.filter(e => e.sourceStatus === 'missing-authored-signature').length, fidelityApproved: 0 };
  mkdirSync(path.dirname(output), { recursive: true });
  writeFileSync(output, JSON.stringify({ version: 1, summary, disclaimer: 'Full inventory, not full implementation or 1:1 approval. No actors are granted new powers by this report.', entries }, null, 2) + '\n');
  console.log(JSON.stringify(summary));
} finally { await vite.close(); }
