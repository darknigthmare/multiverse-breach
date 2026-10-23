import assert from 'node:assert/strict';
import test from 'node:test';
import { prepareCgRosterDeliveries } from './installCgRosterDeliveries.mjs';

test('artist receipts cannot put private generation paths in runtime art or applicability metadata', async () => {
  await assert.rejects(prepareCgRosterDeliveries([{
    schemaVersion: 1,
    entries: [{ id: 'unpublished', sourceRefs: ['/workspace/private-reference.png'] }]
  }]), /Runtime CG metadata must not expose private evidence paths/);
  for (const reference of ['.tmp/private-reference.png', '/tmp/reference.png', 'file:///private/reference.png']) {
    await assert.rejects(prepareCgRosterDeliveries([{
      schemaVersion: 1,
      heroId: 'freeman',
      entries: [],
      applicability: [{ slot: 2, status: 'not-applicable', reason: 'Example source-reviewed exception with no delivered image.', sourceRefs: [reference] }]
    }]), /Runtime applicability must not expose private evidence paths/);
  }
});
