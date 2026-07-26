import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const catalogKeys = [
  'KART_CATALOG',
  'BATTLE_MUSIC_CATALOG',
  'STAGE_MUSIC_CATALOG',
  'FIELD_SUPER_CATALOG'
];
const kindByCatalogKey = {
  KART_CATALOG: 'kart',
  BATTLE_MUSIC_CATALOG: 'battleMusic',
  STAGE_MUSIC_CATALOG: 'stageMusic',
  FIELD_SUPER_CATALOG: 'fieldSuper'
};

let vite;
let unlockableModule;
let secondUnlockableModule;
let heroModule;
let battleItemModule;
let musicModule;
let appModule;
let fighterEngineModule;

const localizedTextIsComplete = (value) => (
  value
  && typeof value.fr === 'string'
  && value.fr.trim().length > 0
  && typeof value.en === 'string'
  && value.en.trim().length > 0
);

const snapshotCatalogs = (module) => Object.fromEntries(
  catalogKeys.map((catalogKey) => [
    catalogKey,
    JSON.parse(JSON.stringify(module[catalogKey]))
  ])
);

before(async () => {
  vite = await createServer({
    root: projectRoot,
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true }
  });
  [
    unlockableModule,
    secondUnlockableModule,
    heroModule,
    battleItemModule,
    musicModule,
    appModule,
    fighterEngineModule
  ] = await Promise.all([
    vite.ssrLoadModule('/src/game/universeUnlockables.js?determinism=first'),
    vite.ssrLoadModule('/src/game/universeUnlockables.js?determinism=second'),
    vite.ssrLoadModule('/src/game/heroes.js'),
    vite.ssrLoadModule('/src/game/battleItems.js'),
    vite.ssrLoadModule('/src/game/stageMusicProfiles.js'),
    vite.ssrLoadModule('/src/App.jsx?unlockable-save-migration'),
    vite.ssrLoadModule('/src/game/engineFighter.js?field-super-test')
  ]);
});

after(async () => {
  await vite?.close();
});

test('builds one complete unlockable of every new kind for all runtime universes', () => {
  const runtimeUniverses = [...new Set(
    heroModule.HEROES_DB.map((hero) => hero.universe).filter(Boolean)
  )].sort();
  assert.equal(runtimeUniverses.length, 357);

  const allIds = [];
  for (const catalogKey of catalogKeys) {
    const catalog = unlockableModule[catalogKey];
    const expectedKind = kindByCatalogKey[catalogKey];
    assert.ok(Object.isFrozen(catalog), `${catalogKey} must be frozen`);
    assert.equal(catalog.length, runtimeUniverses.length);
    assert.deepEqual(
      catalog.map((item) => item.universe).sort(),
      runtimeUniverses,
      `${catalogKey} universe coverage differs from the runtime roster`
    );
    assert.equal(new Set(catalog.map((item) => item.id)).size, catalog.length);

    for (const item of catalog) {
      assert.ok(Object.isFrozen(item), `${item.id} must be frozen`);
      assert.equal(item.kind, expectedKind);
      assert.ok(item.id.startsWith(`${expectedKind === 'battleMusic'
        ? 'battle-music'
        : expectedKind === 'stageMusic'
          ? 'stage-music'
          : expectedKind === 'fieldSuper'
            ? 'field-super'
            : 'kart'}:`));
      assert.ok(localizedTextIsComplete(item.name), `${item.id}: incomplete name`);
      assert.ok(localizedTextIsComplete(item.desc), `${item.id}: incomplete description`);
      assert.match(item.color, /^#[0-9a-f]{6}$/i, `${item.id}: invalid color`);
      assert.equal(
        unlockableModule.getUnlockableById(expectedKind, item.id),
        item,
        `${item.id}: lookup does not return its catalog record`
      );
      assert.equal(
        unlockableModule.getUniverseUnlockables(item.universe)?.[expectedKind],
        item,
        `${item.id}: universe lookup does not return its catalog record`
      );
      allIds.push(item.id);
    }
  }

  assert.equal(allIds.length, 357 * catalogKeys.length);
  assert.equal(new Set(allIds).size, allIds.length, 'New catalog IDs collide across kinds');
});

test('catalog generation is deterministic', () => {
  assert.deepEqual(
    snapshotCatalogs(unlockableModule),
    snapshotCatalogs(secondUnlockableModule)
  );
});

test('karts remain cosmetic, procedural, and style-bounded', () => {
  const allowedStyles = new Set(['needle', 'drift', 'bastion', 'wing', 'pulse']);
  const representedStyles = new Set();

  for (const kart of unlockableModule.KART_CATALOG) {
    assert.ok(allowedStyles.has(kart.style), `${kart.id}: unknown style`);
    representedStyles.add(kart.style);
    assert.match(kart.desc.fr, /cosmetique/i);
    assert.match(kart.desc.en, /cosmetic/i);
  }

  assert.deepEqual(representedStyles, allowedStyles);
});

test('battle and stage music are distinct original procedural plans for every universe', () => {
  const battlePlans = new Map();
  const stagePlans = new Map();

  for (const entry of Object.values(unlockableModule.UNIVERSE_UNLOCKABLES)) {
    const battleMusic = entry.battleMusic;
    const stageMusic = entry.stageMusic;
    assert.ok(Object.isFrozen(battleMusic.musicStage));
    assert.ok(Object.isFrozen(stageMusic.musicStage));
    assert.equal(battleMusic.musicStage.universe, battleMusic.universe);
    assert.equal(stageMusic.musicStage.universe, stageMusic.universe);

    const firstBattlePlan = musicModule.resolveStageMusicProfile(
      battleMusic.musicStage,
      battleMusic.state
    );
    const secondBattlePlan = musicModule.resolveStageMusicProfile(
      battleMusic.musicStage,
      battleMusic.state
    );
    const stagePlan = musicModule.resolveStageMusicProfile(
      stageMusic.musicStage,
      stageMusic.state
    );

    assert.equal(firstBattlePlan.key, secondBattlePlan.key);
    assert.equal(firstBattlePlan.sourcePolicy, 'original-procedural-only');
    assert.equal(stagePlan.sourcePolicy, 'original-procedural-only');
    assert.ok(firstBattlePlan.steps.length > 0);
    assert.ok(stagePlan.steps.length > 0);
    assert.notEqual(
      firstBattlePlan.key,
      stagePlan.key,
      `${battleMusic.universe}: battle and stage music share a runtime key`
    );
    battlePlans.set(battleMusic.universe, firstBattlePlan.key);
    stagePlans.set(stageMusic.universe, stagePlan.key);
  }

  assert.equal(new Set(battlePlans.values()).size, 357);
  assert.equal(new Set(stagePlans.values()).size, 357);
  assert.doesNotMatch(
    JSON.stringify([
      unlockableModule.BATTLE_MUSIC_CATALOG,
      unlockableModule.STAGE_MUSIC_CATALOG
    ]),
    /\.(?:mp3|ogg|wav|flac|m4a)\b/i,
    'Music unlockables must not embed recorded audio'
  );
});

test('field supers reuse the existing universe ultimate and stay within balance bounds', () => {
  const ultimateIdByUniverse = new Map(
    Object.entries(battleItemModule.BATTLE_ITEMS_BY_UNIVERSE).map(
      ([universe, items]) => [
        universe,
        items.find((item) => item.tier === 'ultimate')?.id
      ]
    )
  );

  for (const fieldSuper of unlockableModule.FIELD_SUPER_CATALOG) {
    assert.equal(
      fieldSuper.sourceUltimateId,
      ultimateIdByUniverse.get(fieldSuper.universe),
      `${fieldSuper.id}: does not reuse its universe ultimate`
    );
    assert.ok(Object.isFrozen(fieldSuper.effect));
    assert.ok(fieldSuper.effect.damage >= 30 && fieldSuper.effect.damage <= 50);
    assert.ok(fieldSuper.effect.guardDamage >= 40 && fieldSuper.effect.guardDamage <= 100);
    assert.ok(fieldSuper.effect.knockback >= 240 && fieldSuper.effect.knockback <= 480);
    assert.ok(fieldSuper.effect.healRatio >= 0 && fieldSuper.effect.healRatio <= 0.1);
  }
});

test('save v5 migrates legacy portal collections and validates active loadouts', () => {
  const archive = { id: 'archive:Nexus de Convergence:RPG', universe: 'Nexus de Convergence' };
  const hud = { id: 'hud:Nexus de Convergence', universe: 'Nexus de Convergence' };
  const kart = unlockableModule.KART_CATALOG[0];
  const battleMusic = unlockableModule.BATTLE_MUSIC_CATALOG[0];
  const stageMusic = unlockableModule.STAGE_MUSIC_CATALOG[0];
  const fieldSuper = unlockableModule.FIELD_SUPER_CATALOG[0];

  const migratedLegacy = appModule.default.normalizeSavePayload({
    saveVersion: 4,
    portalCollection: {
      archives: [archive],
      hudThemes: [hud],
      activeHudTheme: hud.id
    }
  }, { existing: true });

  assert.equal(migratedLegacy.saveVersion, 5);
  assert.deepEqual(migratedLegacy.portalCollection.karts, []);
  assert.deepEqual(migratedLegacy.portalCollection.battleMusic, []);
  assert.deepEqual(migratedLegacy.portalCollection.stageMusic, []);
  assert.deepEqual(migratedLegacy.portalCollection.fieldSupers, []);
  assert.deepEqual(migratedLegacy.portalCollection.customLoadout, {
    archive: null,
    battleMusic: null,
    stageMusic: null,
    fieldSuper: null
  });
  assert.equal(migratedLegacy.portalCollection.activeHudTheme, hud.id);

  const normalized = appModule.default.normalizeSavePayload({
    portalCollection: {
      archives: [archive],
      hudThemes: [hud],
      karts: [kart.id, kart.id, null],
      battleMusic: [battleMusic.id],
      stageMusic: [stageMusic.id],
      fieldSupers: [fieldSuper.id],
      activeHudTheme: 'hud:not-owned',
      activeKart: kart.id,
      customLoadout: {
        archive: archive.id,
        battleMusic: battleMusic.id,
        stageMusic: 'stage-music:not-owned',
        fieldSuper: fieldSuper.id
      }
    }
  });

  assert.deepEqual(normalized.portalCollection.karts, [kart.id]);
  assert.equal(normalized.portalCollection.activeHudTheme, null);
  assert.equal(normalized.portalCollection.activeKart, kart.id);
  assert.deepEqual(normalized.portalCollection.customLoadout, {
    archive: archive.id,
    battleMusic: battleMusic.id,
    stageMusic: null,
    fieldSuper: fieldSuper.id
  });
});

test('field super has a separate one-use charge and applies its balanced arena effect', () => {
  const fieldSuper = unlockableModule.FIELD_SUPER_CATALOG[0];
  const playerHero = heroModule.HEROES_DB[0];
  const cpuHero = heroModule.HEROES_DB[1];
  const sfx = [];
  const engine = new fighterEngineModule.EngineFighter(
    960,
    540,
    [playerHero],
    [cpuHero],
    { add: () => {} },
    (name) => sfx.push(name),
    () => {},
    { fieldSuper }
  );

  const player = engine.getActive('player');
  const target = engine.getActive('cpu');
  player.currentHp = player.maxHp * 0.5;
  const initialTargetHp = target.currentHp;
  const initialPersonalMeter = player.meter;

  assert.equal(engine.triggerFieldSuper(), false, 'must not fire during countdown');
  engine.countdown = 0;
  engine.fieldSuperCharge = 100;
  assert.equal(engine.triggerFieldSuper(), true);
  assert.equal(engine.fieldSuperUsed, true);
  assert.equal(engine.fieldSuperCharge, 0);
  assert.ok(player.currentHp > player.maxHp * 0.5, 'team heal was not applied');
  assert.ok(target.currentHp < initialTargetHp, 'arena damage was not applied');
  assert.ok(player.meter >= initialPersonalMeter, 'personal meter must not be spent');
  assert.deepEqual(sfx.slice(0, 2), ['portal', 'special']);
  assert.equal(engine.triggerFieldSuper(), false, 'field super must stay one-use');
  assert.equal(engine.getSnapshot().fieldSuperId, fieldSuper.id);
});
