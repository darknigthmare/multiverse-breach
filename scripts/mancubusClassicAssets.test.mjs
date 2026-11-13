import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { createCanonEnemyExpansion } from '../DLC/Doom/data/enemies.js';
import { getEnemySpriteSheetSrc, getSpriteSheetLayout, getSpriteFrameForLayout } from '../src/game/spriteAssets.js';
import { preserveEnemySpriteIdentity } from '../src/game/enemySpriteIdentity.js';
import { resolveSourceSignature } from '../src/game/signatureSourceKits.js';

const source = new URL('../DLC/Doom/assets/sprites/generated/bosses/doom/mancubus-flame-tank.png', import.meta.url);
const url = '/sprites/generated/bosses/doom/mancubus-flame-tank.png';
const template = () => createCanonEnemyExpansion().monsters.find(actor => actor.name === 'Mancubus Flame Tank');

test('classic Mancubus keeps its stable catalogue identity and a source-specific fireball without Eternal equipment', () => {
  const actor = template();
  assert.equal(actor.name, 'Mancubus Flame Tank');
  assert.deepEqual([actor.hp, actor.atk, actor.spd], [150, 17, 3]);
  assert.equal(actor.weapon, 'flame_cannons');
  assert.equal(actor.sourceSpeciesName, 'Mancubus');
  assert.equal(actor.canonicalName, undefined);
  assert.equal(actor.incarnation, 'Doom II (1994) - classic Mancubus (FATT)');
  assert.match(actor.referenceUrl, /^https:\/\/github\.com\/id-Software\/DOOM\//);
  assert.match(actor.visualAnchor, /green eyes/);
  assert.match(actor.visualAnchor, /No chest armor, held rifle, jetpack/);
  assert.match(actor.visualAnchor, /three two-projectile volleys/);
  assert.equal(actor.visualReviewStatus, 'pending');
  const signature = resolveSourceSignature({ ...actor, universe: 'Doom' });
  assert.equal(signature?.key, 'Doom::Mancubus Flame Tank');
  assert.equal(signature?.name, 'Mancubus Fireball Salvo');
  assert.equal(signature?.style, 'barrage');
  assert.equal(signature?.range, 320);
  assert.equal(signature?.source, 'doom');
  assert.equal(signature?.hits, 6);
  assert.equal(signature?.distribution, 'cycle');
});

test('the exact Mancubus resolves its delivered atlas, including preserved identities in mixed-universe encounters', () => {
  const actor = { ...template(), universe: 'Doom' };
  assert.equal(getEnemySpriteSheetSrc(actor), url);
  const projected = { ...preserveEnemySpriteIdentity(actor), name: 'Mancubus Echo 7', universe: 'Halo' };
  assert.equal(getEnemySpriteSheetSrc(projected), url);
  assert.equal(projected.sourceUniverse, 'Doom');
  assert.equal(projected.weapon, 'flame_cannons');
  assert.notEqual(getEnemySpriteSheetSrc({ ...actor, universe: 'Another Universe' }), url);
  assert.notEqual(getEnemySpriteSheetSrc({ ...actor, name: 'Armored Mancubus' }), url);
});

test('the real PNG decodes and its rectangular cells retain the ordinary four-state renderer contract', async () => {
  const bytes = readFileSync(source);
  const { info } = await sharp(bytes, { failOn: 'error' }).raw().toBuffer({ resolveWithObject: true });
  assert.deepEqual([info.width, info.height, info.channels], [1536, 1024, 4]);
  const metadata = await sharp(bytes).metadata();
  assert.equal(metadata.format, 'png');
  assert.equal(metadata.hasAlpha, true);
  const layout = getSpriteSheetLayout(url);
  assert.deepEqual([layout.columns, layout.rows], [4, 4]);
  for (const [row, state] of ['idle', 'run', 'attack', 'hit'].entries()) {
    for (let col = 0; col < 4; col++) {
      const frame = getSpriteFrameForLayout(state, col * 10, layout);
      assert.deepEqual([frame.row, frame.col], [row, col]);
      assert.equal(frame.trim, null);
    }
  }
});

test('sixteen distinct pose cells have transparency, no clipped bodies and one stable ground baseline', async () => {
  const frames = new Set();
  for (let row = 0; row < 4; row++) for (let col = 0; col < 4; col++) {
    const { data, info } = await sharp(source.pathname).extract({ left: col * 384, top: row * 256, width: 384, height: 256 })
      .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    let left = 384, top = 256, right = 0, bottom = 0, clear = 0, visible = 0;
    for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
      const alpha = data[(y * info.width + x) * 4 + 3];
      if (alpha === 0) clear++;
      if (alpha >= 64) { visible++; left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x + 1); bottom = Math.max(bottom, y + 1); }
    }
    assert.ok(clear > 10000 && visible > 8000, `frame ${row}/${col} is a real transparent body`);
    assert.ok(left >= 4 && top >= 4 && right <= 380 && bottom <= 252, `unclipped frame ${row}/${col}`);
    assert.ok(Math.abs(bottom - 232) <= 1, `baseline ${row}/${col}`);
    frames.add(createHash('sha256').update(data).digest('hex'));
  }
  assert.equal(frames.size, 16);
});
