import { writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
const [root, output] = process.argv.slice(2);
const load = path => import(pathToFileURL(`${root}/${path}`).href);
const { HEROES_DB } = await load('src/game/heroes.js');
const { createPlayerHero } = await load('src/game/playerHero.js');
const { getExtinctionFighterProfile } = await load('src/game/extinctionFighterProfiles.js');
const { createExtinctionProtocolState } = await load('src/game/extinctionSignatures.js');
const { getExtinctionSchematicView } = await load('src/game/extinctionSchematicView.js');
const { buildExtinctionFighterCatalog } = await load('scripts/extinctionFighterCatalog.mjs');
const heroes = [createPlayerHero(), ...HEROES_DB];
const missing = [], styles = {}, kinds = {}, ballisticBindings = [];
for (const hero of heroes) {
  const profile = getExtinctionFighterProfile(hero);
  if (!profile.eligible) continue;
  for (const slot of ['simple', 'secondary', 'defense', 'special']) {
    if (!profile.signature?.actions[slot]) missing.push({ id: hero.id, universe: hero.universe, slot, raw: hero[slot] });
  }
  const primary = profile.signature?.actions.simple;
  const state = { phase: 'running', heroId: hero.id, runId: 'inventory', t: 0,
    weapon: { type: 'pistol', ammo: 24, maxAmmo: 24, resource: profile.resource.kind },
    protocols: createExtinctionProtocolState(profile.signature, 'inventory') };
  const view = getExtinctionSchematicView(state);
  styles[view.style] = (styles[view.style] || 0) + 1;
  kinds[primary?.kind || 'missing'] = (kinds[primary?.kind || 'missing'] || 0) + 1;
  if (primary?.sourceBallisticCompatibility) ballisticBindings.push({ id: hero.id, universe: hero.universe, kind: primary.kind,
    resource: primary.resource, compatibility: primary.sourceBallisticCompatibility });
}
const records = heroes.map(({ id, universe, weaponType, weapon, simple, secondary, defense, special }) =>
  ({ id, universe, weaponType, weapon, simple, secondary, defense, special }));
const result = { scope: 'Actual current Extinction adapters; no source mutation, artwork approval or historical workbook replacement.',
  missing, styles, kinds, counts: buildExtinctionFighterCatalog().counts, ballisticBindings,
  sourceFingerprint: createHash('sha256').update(JSON.stringify(records)).digest('hex'), artApproved: false, source1to1Verified: false };
writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
process.stdout.write(`${JSON.stringify({ missing: missing.length, counts: result.counts, ballisticBindings: ballisticBindings.length })}\n`);
