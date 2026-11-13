/** Deterministic source inventory consumed by the PR workbook. No game mutation. */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HEROES_DB } from '../src/game/heroes.js';
import { createPlayerHero } from '../src/game/playerHero.js';
import { getExtinctionFighterProfile } from '../src/game/extinctionFighterProfiles.js';
import { EXTINCTION_FIELD_DIRECTIVES } from '../src/game/extinctionFieldDirectives.js';
import { getExtinctionActionReach } from '../src/game/extinctionSignatures.js';

export function buildExtinctionFighterCatalog(sourceCommit = '') {
  if (sourceCommit && !/^[a-f0-9]{40}$/.test(sourceCommit)) throw new Error('Expected full source commit');
  const profiles = [createPlayerHero(), ...HEROES_DB].map(hero => {
    const profile = getExtinctionFighterProfile(hero);
    const { signature, ...record } = profile;
    return { ...record, kitStatus: signature?.status || 'NON_COMBAT_PRESERVED',
      actions: Object.entries(signature?.actions || {}).map(([slot, action]) => ({ ...action,
        reach: getExtinctionActionReach(action),
        sourcePath: action.sourcePath || `${profile.source.path}#${profile.heroId}.${slot}`,
        adaptationStatus: action.adaptationStatus || 'AUTHORED_NEXUS_ADAPTATION',
        resource: action.resource || (slot === 'simple' ? profile.resource.kind : 'cooldown'),
        sourceReference: action.sourceReference || profile.source.referenceUrls[0] || '' })) };
  });
  return { schemaVersion: 'extinction-fighter-catalog-v1', sourceCommit,
    scope: 'Source-backed simulation adapters. Shared rules are not personal art, canonical choreography or an ownership grant.',
    counts: { characters: profiles.length, combatants: profiles.filter(profile => profile.eligible).length,
      peaceful: profiles.filter(profile => !profile.eligible).length,
      authoredKits: profiles.filter(profile => profile.reviewStatus === 'AUTHORED_KIT_ART_PENDING').length,
      sourceAdaptedKits: profiles.filter(profile => profile.eligible && profile.reviewStatus !== 'AUTHORED_KIT_ART_PENDING').length,
      genericSourceReview: profiles.filter(profile => profile.reviewStatus === 'GENERIC_SOURCE_REVIEW_REQUIRED').length,
      boundPersonalViews: profiles.filter(profile => profile.eligible && profile.view.src).length,
      actions: profiles.reduce((count, profile) => count + profile.actions.length, 0) },
    profiles,
    modes: Object.entries(EXTINCTION_FIELD_DIRECTIVES).map(([mode, directive]) => ({ mode, ...directive,
      optional: true, rewardPolicy: 'Existing mode formula and single run receipt; no extra currency or unlock.',
      sourcePath: mode === 'extraction' ? 'src/game/extinctionRelayOperation.js' : 'src/game/extinctionFieldDirectives.js' })) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const outIndex = process.argv.indexOf('--out'), commitIndex = process.argv.indexOf('--source-commit');
  if (outIndex < 0 || !process.argv[outIndex + 1]) throw new Error('Usage: --out <file.json> [--source-commit <40-char sha>]');
  const target = path.resolve(process.argv[outIndex + 1]);
  const result = buildExtinctionFighterCatalog(commitIndex >= 0 ? process.argv[commitIndex + 1] : '');
  mkdirSync(path.dirname(target), { recursive: true }); writeFileSync(target, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify({ out: target, counts: result.counts }));
}
