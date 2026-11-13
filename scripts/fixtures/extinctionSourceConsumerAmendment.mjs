import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

export const extinctionSourceConsumerAmendment = JSON.parse(readFileSync(
  new URL('./extinction-source-consumer-amendment-2026-11-13.json', import.meta.url), 'utf8'));

// This amendment describes one frozen catalog, not permission to accept a
// different current count automatically. Keep the original published counts
// and immutable-before receipts in the fixture for historical comparisons.
export function assertExtinctionSourceAmendment(heroes) {
  const records = heroes.map(({ id, universe, weaponType, weapon, simple, secondary, defense, special }) =>
    ({ id, universe, weaponType, weapon, simple, secondary, defense, special }));
  const fingerprint = createHash('sha256').update(JSON.stringify(records)).digest('hex');
  assert.equal(fingerprint, extinctionSourceConsumerAmendment.currentSourceFingerprint,
    'Source changed outside the exact reviewed Extinction consumer amendment');
}
