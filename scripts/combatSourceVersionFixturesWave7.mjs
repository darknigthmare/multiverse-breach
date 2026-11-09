import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
// Actual raw Han from the published pre-upstream heroes.js, commit
// 9981b73deb3ee027c86877d7c15c6698e4f02191. The complete source file SHA256 is
// 14f0fa8adb4eb84c5a7634dcd22ff200d02f381285a890d6e0a81a64d06d13e2.
// Its complete actor object also matches the recovery snapshot 40c6787a.
// Keep this independent snapshot; do not strip source locks from a live actor.
const frozenHan = {
  id: 'han_solo', name: 'Han Solo', cat: 'tactical', color: '#ffeaa7',
  universe: 'Star Wars', category: 'tactical', primaryColor: '#ffeaa7',
  secondaryColor: '#ffeaa7', weaponType: 'gun', weaponColor: '#ffeaa7',
  stats: { hp: 120, atk: 11, def: 7, spd: 4 },
  simple: { name: 'DL-44 Quickdraw', type: 'bullet', dmg: 1 },
  secondary: { name: 'Falcon Smuggler Run', type: 'signature', cd: 7, dmg: 1.8 },
  defense: { name: 'Carbonite Luck Guard', type: 'shield', dur: 2, reduce: 0.8 },
  special: { name: 'Kessel Run Fire', type: 'nexus_aoe', dmg: 4.6, color: '#ffeaa7' }
};
assert.equal(hash(JSON.stringify(frozenHan)), '502b9469b0bfba8822e731c7421529631152d2d6957d254a77346095055fa14b');
// Its resolved, explicitly authored source kit is independently frozen too.
const bytes = readFileSync(new URL('../docs/combat-fidelity-wave16-2026-10-28/baseline-authored-abilities.json', import.meta.url));
assert.equal(hash(bytes), '51e6894d84970d04807ddd83f2b3d2cf0e939aeba0588df5ab794c543adef17b');
const authoredHan = JSON.parse(bytes).han_solo;
assert.equal(hash(JSON.stringify(authoredHan)), '6e58a74b27f76829581f4dba3374589ee2104b0f329f991bf17cb1b9f58c926a');
assert.equal(authoredHan.special.name, 'Tir précis au DL-44');

export const historicalWave7HanActor = () => structuredClone(frozenHan);
