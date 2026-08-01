import assert from 'node:assert/strict';
import test from 'node:test';
import { CANON_ROSTER_WAVE } from '../src/game/canonRosterWave.js';
import {
  EXPANDED_ENEMIES_DB,
  EXPANDED_UNIVERSES,
  getExpandedStages,
  stableTrialStageId
} from '../src/game/expandedUniverses.js';
import { HEROES_DB } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';

const EXPECTED_UNIVERSES = Object.freeze([
  'Poppy Playtime',
  'Plants vs. Zombies',
  "Avatar (Na'vi)",
  'Skyline',
  'Happy Wheels',
  'Marble Hornets',
  'The Horribly Slow Murderer',
  'Sartorius Stedim Biotech',
  'Skibidi',
  'Trololo',
  'Rick Astley',
  'Nyan Cat',
  'SCP Foundation',
  'Mr. Bean',
  'Kill Bill',
  'Famille Pirate',
  'The Wild Thornberrys',
  'Téléchat',
  'Nicolas et Pimprenelle',
  'Le Donjon de Naheulbeuk',
  'Les Aventuriers du Survivaure',
  'Adoprixtoxis',
  'Reflets d’Acide',
  'Unreal Tournament',
  'Unreal',
  'Zootopia',
  'Mad Max: Fury Road',
  'The Purge',
  'Saw',
  'Puppet Master',
  'Planete Hurlante'
]);

const normalize = value => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase();

const slugify = value => normalize(value)
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const assertText = (value, label) => {
  assert.equal(typeof value, 'string', `${label} must be a string`);
  assert.ok(value.trim().length > 0, `${label} must not be empty`);
};

const assertLore = (lore, label) => {
  assert.ok(lore && typeof lore === 'object' && !Array.isArray(lore), `${label} must be an object`);
  assertText(lore.fr, `${label}.fr`);
  assertText(lore.en, `${label}.en`);
};

const assertHttpsUrl = (value, label) => {
  assertText(value, label);
  const parsed = new URL(value);
  assert.equal(parsed.protocol, 'https:', `${label} must use HTTPS`);
};

const assertFidelityMetadata = (value, label) => {
  assert.ok(value && typeof value === 'object' && !Array.isArray(value), `${label} must be an object`);
  assertHttpsUrl(value.referenceUrl, `${label}.referenceUrl`);
  assertText(value.visualAnchor, `${label}.visualAnchor`);
  assertText(value.canonStatus, `${label}.canonStatus`);
  assertLore(value.lore, `${label}.lore`);
};

const assertUnique = (values, label) => {
  assert.equal(new Set(values).size, values.length, `${label} must be unique`);
};

const getCharacters = entry => [entry.hero, ...entry.allies];
const threatName = entry => typeof entry === 'string' ? entry : entry?.name;

const assertTuple = (value, minimumLength, label) => {
  assert.ok(Array.isArray(value), `${label} must be a tuple`);
  assert.ok(value.length >= minimumLength, `${label} must contain at least ${minimumLength} fields`);
  assertText(value[0], `${label}[0] id`);
  assertText(value[1], `${label}[1] name`);
};

const assertStage = (value, label) => {
  if (Array.isArray(value)) {
    assert.ok(value.length >= 2, `${label} tuple must expose its mode and name`);
    assertText(value[1], `${label}[1] name`);
    return;
  }
  assertText(value, label);
};

const identityText = value => normalize([
  Array.isArray(value) ? value[0] : value?.id,
  Array.isArray(value) ? value[1] : value?.name,
  value?.role,
  value?.kind,
  value?.entityType,
  value?.classification
].filter(Boolean).join(' '));

const flattenText = value => normalize(JSON.stringify(value));

const derivedSpriteOutput = (universe, kind, value) => {
  const metadata = Array.isArray(value) ? value[3] : value;
  if (metadata?.output) return metadata.output;
  const universeSlug = slugify(universe);
  const id = Array.isArray(value) ? value[0] : value.id;
  const name = Array.isArray(value) ? value[1] : value.name;
  if (kind === 'hero') {
    return `/sprites/generated/heroes/${universeSlug}/${slugify(id)}.png`;
  }
  return `/sprites/generated/bosses/${universeSlug}/${slugify(name || id)}.png`;
};

const byUniverse = universe => {
  const entry = CANON_ROSTER_WAVE.find(candidate => candidate.universe === universe);
  assert.ok(entry, `missing ${universe}`);
  return entry;
};

test('canon roster wave exposes exactly the thirty-one requested runtime universes', () => {
  assert.ok(Array.isArray(CANON_ROSTER_WAVE));
  assert.equal(CANON_ROSTER_WAVE.length, EXPECTED_UNIVERSES.length);
  assert.deepEqual(CANON_ROSTER_WAVE.map(entry => entry.universe), EXPECTED_UNIVERSES);

  CANON_ROSTER_WAVE.forEach((entry, index) => {
    assertText(entry.key, `wave[${index}].key`);
    assert.match(entry.key, /^[a-z0-9][a-z0-9_]*$/, `wave[${index}].key must be stable`);
    assertFidelityMetadata(entry, `wave[${index}]`);
  });

  assertUnique(CANON_ROSTER_WAVE.map(entry => entry.key), 'wave keys');
  assertUnique(CANON_ROSTER_WAVE.map(entry => entry.universe), 'wave universe names');
});

test('every universe owns three heroes, three enemies, three bosses, one world boss, stages, gear and event', () => {
  const globalIds = [];

  CANON_ROSTER_WAVE.forEach((entry, universeIndex) => {
    const label = `wave[${universeIndex}] ${entry.universe}`;
    assertTuple(entry.hero, 4, `${label}.hero`);
    assert.equal(entry.allies.length, 2, `${label} must expose two allies beside its lead hero`);
    assert.equal(getCharacters(entry).length, 3, `${label} must expose three heroes in total`);
    assert.equal(entry.monsters.length, 3, `${label} must expose three enemies`);
    assert.equal(entry.bosses.length, 3, `${label} must expose three bosses`);
    assert.ok(entry.worldBoss && !Array.isArray(entry.worldBoss), `${label} must expose one world boss`);
    assertText(entry.stage, `${label}.stage`);
    assert.ok(Array.isArray(entry.stageVariants), `${label}.stageVariants must be an array`);
    assert.ok(1 + entry.stageVariants.length >= 3, `${label} must expose at least three stages`);
    assert.equal(entry.gear.length, 3, `${label} must expose three gear pieces`);
    assertTuple(entry.event, 6, `${label}.event`);

    getCharacters(entry).forEach((character, index) => {
      const contentLabel = `${label}.characters[${index}]`;
      assertTuple(character, 4, contentLabel);
      assertFidelityMetadata(character[3], `${contentLabel}[3] metadata`);
      globalIds.push(character[0]);
    });

    [...entry.monsters, ...entry.bosses, entry.worldBoss].forEach((threat, index) => {
      const contentLabel = `${label}.threats[${index}]`;
      assertFidelityMetadata(threat, contentLabel);
      assertText(threat.id, `${contentLabel}.id`);
      globalIds.push(threat.id);
    });

    entry.stageVariants.forEach((stage, index) => assertStage(stage, `${label}.stageVariants[${index}]`));

    entry.gear.forEach((gear, index) => {
      const contentLabel = `${label}.gear[${index}]`;
      assertTuple(gear, 5, contentLabel);
      assertFidelityMetadata(gear[4], `${contentLabel}[4] metadata`);
      globalIds.push(gear[0]);
    });

    assertFidelityMetadata(entry.event[5], `${label}.event[5] metadata`);
    globalIds.push(entry.event[0]);
  });

  globalIds.forEach((id, index) => {
    assert.match(id, /^[a-z0-9][a-z0-9_.:-]*$/i, `content id[${index}] must be stable`);
  });
  assertUnique(globalIds, 'all canon roster content IDs');
});

test('every URL encoded by the wave uses HTTPS', () => {
  let urlCount = 0;

  const visit = (value, label) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, `${label}[${index}]`));
      return;
    }
    if (!value || typeof value !== 'object') return;

    for (const [key, child] of Object.entries(value)) {
      const childLabel = `${label}.${key}`;
      if (typeof child === 'string' && /^https?:\/\//i.test(child)) {
        urlCount += 1;
        assertHttpsUrl(child, childLabel);
      } else {
        visit(child, childLabel);
      }
    }
  };

  visit(CANON_ROSTER_WAVE, 'wave');
  assert.ok(urlCount >= EXPECTED_UNIVERSES.length, 'the wave must encode researched HTTPS provenance');
});

test('sensitive canon and safety invariants remain explicit', () => {
  const sartorius = byUniverse('Sartorius Stedim Biotech');
  for (const [index, enemy] of sartorius.monsters.entries()) {
    assert.doesNotMatch(
      identityText(enemy),
      /\b(operator|operateur|operatrice|employee|employe|worker|technician|technicien|personnel|human|humain)\b/,
      `Sartorius enemy[${index}] must be a production hazard, never a human or employee`
    );
  }

  const avatar = byUniverse("Avatar (Na'vi)");
  for (const [index, enemy] of avatar.monsters.entries()) {
    assert.doesNotMatch(
      identityText(enemy),
      /\b(na'?vi|toruk|ikran|banshee|thanator|viperwolf|direhorse|pali|tulkun|ilu|skimwing|hammerhead|hexapede)\b/,
      `Avatar enemy[${index}] must not turn Pandoran fauna or Na'vi into enemies`
    );
  }

  const thornberrys = byUniverse('The Wild Thornberrys');
  for (const [index, enemy] of thornberrys.monsters.entries()) {
    assert.match(
      identityText(enemy),
      /\b(poacher|braconnier|kip|odonnell|neil|biederman|sloan|bree|blackburn|hunter)\b/,
      `Wild Thornberrys enemy[${index}] must be a human poacher, never an animal`
    );
  }

  assert.doesNotMatch(flattenText(byUniverse('Marble Hornets')), /\bproxies?\b/);

  const scp = byUniverse('SCP Foundation');
  assert.match(flattenText(scp), /cc by-sa(?: 3\.0)?/);
  const scpObjective = flattenText(
    scp.worldBoss.objective
      || scp.worldBoss.winCondition
      || scp.worldBoss.victoryCondition
      || scp.worldBoss
  );
  assert.match(scpObjective, /recontain|reconfin/);
  assert.doesNotMatch(scpObjective, /\b(kill|destroy|eliminate|tuer|detruire|eliminer)\b/);

  const skibidiWorldBossName = normalize(byUniverse('Skibidi').worldBoss.name);
  assert.match(skibidiWorldBossName, /astro.*mothership|mothership.*astro/);

  const bedtimeEnemies = byUniverse('Nicolas et Pimprenelle').monsters.map(identityText);
  bedtimeEnemies.forEach((enemy, index) => {
    assert.doesNotMatch(enemy, /marchand de sable|sandman/, `bedtime enemy[${index}] must not be the Sandman`);
  });
});

test('wave C locks the researched continuity and noncombat finales', () => {
  const tournament = byUniverse('Unreal Tournament');
  assert.deepEqual(getCharacters(tournament).map(value => value[1]), ['Malcom', 'Brock', 'Lauren']);
  getCharacters(tournament).forEach(value => assert.equal(value[3].uniqueAbility, false));
  tournament.bosses.forEach(boss => assert.match(normalize(boss.canonStatus), /console-port-only/));
  assert.equal(tournament.worldBoss.name, 'Xan Kriegor');

  const unreal = byUniverse('Unreal');
  assert.deepEqual(getCharacters(unreal).map(value => value[1]), ['Gina', 'Dante', 'Kurgan']);
  getCharacters(unreal).forEach(value => {
    assert.equal(value[3].narrativeRole, 'Prisoner 849');
    assert.equal(value[3].uniqueAbility, false);
  });
  assert.doesNotMatch(flattenText(unreal.hero), /malcolm|malcom/);
  assert.equal(unreal.worldBoss.name, 'Skaarj Queen');

  const zootopia = byUniverse('Zootopia');
  ['Renato Manchas', 'Mr. Big'].forEach(name => {
    const encounter = zootopia.bosses.find(boss => boss.name === name);
    assert.equal(encounter?.nonCombat, true, `${name} must stay a nonlethal story encounter`);
  });
  assert.equal(zootopia.worldBoss.nonCombat, true);
  assert.match(flattenText(zootopia.worldBoss.objective), /confess|record|arrest/);

  const purge = byUniverse('The Purge');
  assert.deepEqual(getCharacters(purge).map(value => value[1]), ['James Sandin', 'Mary Sandin', 'Zoey Sandin']);
  assert.equal(purge.worldBoss.entityType, 'systemic-survival-event');
  assert.equal(purge.worldBoss.nonCombat, true);
  assert.match(flattenText(purge.worldBoss), /survive.*morning|7:00 a\.m/);

  const saw = byUniverse('Saw');
  assert.equal(saw.worldBoss.entityType, 'narrative-test-controller');
  assert.equal(saw.worldBoss.nonCombat, true);
  assert.equal(saw.worldBoss.messenger, 'Billy the Puppet');
  assert.match(flattenText(saw.worldBoss.objective), /interpret|disarm|rescue/);
  assert.doesNotMatch(saw.monsters.map(value => value.name).join(' '), /billy/i);

  const screamers = byUniverse('Planete Hurlante');
  assert.equal(screamers.worldBoss.name, 'Underground Screamer Production System');
  assert.equal(screamers.worldBoss.entityType, 'autonomous-production-network');
  assert.equal(screamers.worldBoss.nonCombat, true);
  assert.doesNotMatch(screamers.worldBoss.name, /queen|reine|mastermind|core/i);

  const alia = byUniverse('Reflets d’Acide').bosses.find(boss => boss.name === 'Alia-Aénor');
  assert.equal(alia?.entityType, 'rescue-trial');
  assert.equal(alia?.nonCombat, true);

  const survivaure = byUniverse('Les Aventuriers du Survivaure');
  assert.equal(survivaure.licensing?.permissionRequired, true);
  assert.equal(survivaure.licensing?.status, 'not-authorized-for-public-release');

  const expectedTrialTypes = new Map([
    ['survivaure_haldar', 'evidence'],
    ['reflets_acide_alia_aenor', 'rescue'],
    ['zootopia_duke_weaselton', 'escape'],
    ['zootopia_manchas', 'rescue'],
    ['zootopia_mr_big', 'evidence'],
    ['zootopia_bellwether', 'evidence'],
    ['the_purge_2013_purge_night', 'survive'],
    ['saw_john_kramer', 'rescue'],
    ['planete_hurlante_underground_production_system', 'switches']
  ]);
  for (const runtime of EXPANDED_UNIVERSES) {
    for (const encounter of runtime.encounters || []) {
      if (expectedTrialTypes.has(encounter.id)) {
        assert.equal(encounter.policy?.trialType, expectedTrialTypes.get(encounter.id), encounter.name);
      }
    }
  }
  assert.equal(expectedTrialTypes.size, 9);
});

test('legacy hero identities stay compatible while corrected canon anchors remain locked', () => {
  const heroIds = universe => getCharacters(byUniverse(universe)).map(character => character[0]);

  assert.deepEqual(heroIds("Avatar (Na'vi)"), ['jake_sully_avatar', 'neytiri_avatar', 'kiri_avatar']);
  assert.deepEqual(heroIds('Skyline'), ['jarrod_skyline', 'elaine_skyline', 'rose_skyline']);
  assert.deepEqual(heroIds('Skibidi'), ['cameraman_skibidi', 'speakerman_skibidi', 'tvman_skibidi']);
  assert.deepEqual(heroIds('SCP Foundation'), ['mtf_commander_scp', 'researcher_scp', 'scp_999_echo']);
  assert.deepEqual(heroIds('Kill Bill').slice(0, 2), ['beatrix_kiddo_kb', 'hattori_hanzo_kb']);

  const skyline = byUniverse('Skyline');
  assert.match(flattenText(skyline.monsters.find(enemy => enemy.name === 'Skyline Drone')), /small octopoid/);
  assert.match(flattenText(skyline.monsters.find(enemy => enemy.name === 'Skyline Hydra')), /large flying squid/);
  assert.match(flattenText(byUniverse('Marble Hornets').bosses.find(boss => boss.name.includes('Brian'))), /beige hoodie/);
  assert.deepEqual(byUniverse('Nyan Cat').allies.map(character => character[1]), ['Supernyan', 'Zombienyan']);
});

test('derived character and threat output identities never collide', () => {
  const outputs = CANON_ROSTER_WAVE.flatMap(entry => [
    ...getCharacters(entry).map(value => derivedSpriteOutput(entry.universe, 'hero', value)),
    ...entry.monsters.map(value => derivedSpriteOutput(entry.universe, 'enemy', value)),
    ...entry.bosses.map(value => derivedSpriteOutput(entry.universe, 'boss', value)),
    derivedSpriteOutput(entry.universe, 'worldBoss', entry.worldBoss)
  ]);

  assertUnique(outputs, 'canon roster sprite output identities');
});

test('the final expanded runtime keeps one complete fidelity-aware entry per requested universe', () => {
  for (const universe of EXPECTED_UNIVERSES) {
    const matches = EXPANDED_UNIVERSES.filter(entry => entry.universe === universe);
    assert.equal(matches.length, 1, `${universe} must be registered exactly once in the final runtime`);
    const runtime = matches[0];
    assert.equal([runtime.hero, ...runtime.allies].length, 3, `${universe} runtime heroes`);
    const encounters = runtime.encounters || [];
    assert.equal(
      runtime.monsters.length + encounters.filter(entry => entry.kind === 'monster').length,
      3,
      `${universe} runtime enemies and trials`
    );
    assert.equal(
      runtime.bosses.length + encounters.filter(entry => entry.kind === 'boss').length,
      3,
      `${universe} runtime bosses and trials`
    );
    const worldBossTrials = encounters.filter(entry => entry.kind === 'worldBoss');
    assert.equal(Number(Boolean(runtime.worldBoss)) + worldBossTrials.length, 1, `${universe} runtime finale`);
    if (runtime.worldBoss) {
      assertFidelityMetadata(runtime.worldBoss, `${universe} runtime world boss`);
    } else {
      assert.ok(runtime.worldBossPolicy, `${universe} noncombat finale policy`);
    }
  }
});

test('noncombat roster entries are trial stages and never combat actors', () => {
  const stages = getExpandedStages();

  for (const universe of EXPECTED_UNIVERSES) {
    const runtime = EXPANDED_UNIVERSES.find(entry => entry.universe === universe);
    const enemyData = EXPANDED_ENEMIES_DB[universe];
    for (const encounter of runtime.encounters || []) {
      const combatActors = [
        ...(enemyData.monsters || []),
        ...(enemyData.bosses || []),
        ...(enemyData.worldBoss ? [enemyData.worldBoss] : [])
      ];
      assert.equal(
        combatActors.some(actor => actor.id === encounter.id || actor.name === encounter.name),
        false,
        `${universe}/${encounter.name} leaked into combat actors`
      );
      const trialStage = stages.find(stage => (
        stage.universe === universe
        && stage.encounterId === encounter.id
        && stage.nonCombatTrial
      ));
      assert.ok(trialStage, `${universe}/${encounter.name} must own a playable trial stage`);
      assert.equal(trialStage.bossName, null, `${universe}/${encounter.name} must not expose a fake boss label`);
      assert.deepEqual(trialStage.enemyRoster, [], `${universe}/${encounter.name} trial roster`);
    }
  }
});

test('canon noncombat directives keep their authored French objective', () => {
  const expectedObjectives = new Map([
    ['rick_astley_infinite_rickroll', 'Synchroniser la boucle de redirection avec le refrain en direct puis rouvrir la sortie.'],
    ['nyan_cat_tac_nayn', 'Distancer Tac Nayn à travers le portail de l’univers parallèle puis rétablir la route arc-en-ciel.'],
    ['scp_foundation_scp_682', 'Rétablir les systèmes de confinement, immobiliser SCP-682 puis le reconfiner dans la chambre sécurisée.'],
    ['mr_bean_paint_bomb_chain', 'Achever la rénovation d’un seul geste, contenir l’explosion de peinture puis laisser l’appartement présentable.'],
    ['famille_pirate_ecumoir', 'Manœuvrer mieux que l’Écumoir, récupérer la cargaison disputée puis mettre fin à la dernière farce des voisins.'],
    ['telechat_tele_bete_revolt', 'Ramener le signal de la Télé-Bête sur son plateau, rétablir le journal des objets puis rendre le bureau à Groucha et Lola.'],
    ['nicolas_pimprenelle_sleepless_night', 'Terminer l’histoire, aligner la route du nuage puis rétablir un rituel du coucher apaisé pour Nicolas et Pimprenelle.'],
    ['survivaure_haldar', 'Rassembler les preuves de campagne, dévoiler la complicité krygonite de Haldar puis obtenir son arrestation pour haute trahison.'],
    ['reflets_acide_alia_aenor', 'Libérer Alia-Aénor puis survivre à son éveil sans la tuer.'],
    ['zootopia_duke_weaselton', 'Rattraper et arrêter Duke sans blesser les passants.'],
    ['zootopia_manchas', 'Soigner Manchas avec une fléchette d’antidote au Hurleur nocturne.'],
    ['zootopia_mr_big', 'Gagner la confiance de Mr. Big puis obtenir la piste menant à Manchas.'],
    ['zootopia_bellwether', 'Pousser Bellwether à avouer, enregistrer les preuves puis l’arrêter.'],
    ['the_purge_2013_purge_night', 'Protéger la famille Sandin et survivre jusqu’à la sirène de 7 h.'],
    ['saw_john_kramer', 'Interpréter chaque règle, désamorcer les mécanismes puis sauver les captifs.'],
    ['planete_hurlante_underground_production_system', 'Cartographier les chaînes autonomes, arrêter la réplication puis condamner les tunnels de production.']
  ]);

  const encounters = EXPANDED_UNIVERSES.flatMap(runtime => runtime.encounters || []);
  for (const [id, objectiveFr] of expectedObjectives) {
    const encounter = encounters.find(candidate => candidate.id === id);
    assert.ok(encounter, `${id} runtime encounter`);
    assert.equal(encounter.policy?.objective?.fr, objectiveFr, `${id} French objective`);
    assertText(encounter.policy?.objective?.en, `${id} English objective`);
  }
});

test('expanded music universes use performance trials instead of invented enemies', () => {
  const stages = getExpandedStages();
  const musicUniverses = EXPANDED_UNIVERSES.filter(entry => entry.mediaType === 'music');
  assert.ok(musicUniverses.length > 0);

  for (const universe of musicUniverses) {
    const enemyData = EXPANDED_ENEMIES_DB[universe.universe];
    assert.deepEqual(enemyData.monsters, [], `${universe.universe} invented monsters`);
    assert.deepEqual(enemyData.bosses, [], `${universe.universe} invented bosses`);
    assert.equal(enemyData.worldBoss, null, `${universe.universe} invented world boss`);
    assert.ok(
      stages.some(stage => stage.universe === universe.universe && stage.nonCombatTrial),
      `${universe.universe} performance trial`
    );
  }
});

test('global hero and enemy catalogs cannot append legacy extras to canon rosters', () => {
  for (const authored of CANON_ROSTER_WAVE) {
    const runtime = EXPANDED_UNIVERSES.find(entry => entry.universe === authored.universe);
    assert.deepEqual(
      HEROES_DB.filter(hero => hero.universe === authored.universe).map(hero => hero.id),
      [runtime.hero, ...runtime.allies].map(hero => hero.id),
      `${authored.universe} global heroes`
    );
    const globalEnemies = ENEMIES_DB[authored.universe];
    assert.deepEqual(
      globalEnemies.monsters.map(enemy => enemy.name),
      runtime.monsters.map(threatName),
      `${authored.universe} global monsters`
    );
    assert.deepEqual(
      globalEnemies.bosses.map(enemy => enemy.name),
      runtime.bosses.map(threatName),
      `${authored.universe} global bosses`
    );
    assert.equal(globalEnemies.worldBoss?.name, runtime.worldBoss?.name);
  }
});

test('legacy puzzle and pursuit worlds expose trials instead of fake combat rosters', () => {
  const stages = getExpandedStages();
  const pureTrialUniverses = [
    'Death Note',
    'Exit 8',
    'Hell House LLC',
    'Spermageddon',
    'Another',
    'Pingu',
    'La Cite de la Peur',
    'Cool Spot',
    'Zero Escape: The Nonary Games',
    'Siren Head'
  ];

  for (const universe of pureTrialUniverses) {
    assert.deepEqual(ENEMIES_DB[universe].monsters, [], `${universe} fake monsters`);
    assert.deepEqual(ENEMIES_DB[universe].bosses, [], `${universe} fake bosses`);
    assert.equal(ENEMIES_DB[universe].worldBoss, null, `${universe} fake world boss`);
    assert.ok(
      stages.some(stage => stage.universe === universe && stage.nonCombatTrial),
      `${universe} playable trial`
    );
  }
});

test('a finale policy is never rendered as a boss label', () => {
  const stages = getExpandedStages();
  for (const universe of EXPANDED_UNIVERSES.filter(entry => entry.worldBossPolicy)) {
    const combatBossNames = new Set(universe.bosses.map(threatName));
    const primary = stages.find(stage => stage.universe === universe.universe);
    assert.notEqual(
      primary?.bossName,
      universe.worldBossPolicy.objective.fr,
      `${universe.universe} policy objective leaked into boss label`
    );
    assert.ok(
      primary?.bossName == null || combatBossNames.has(primary.bossName),
      `${universe.universe} primary boss must be a real combat boss or null`
    );
  }
});

test('hybrid set pieces preserve a hostile stage before their neutral finale', () => {
  const stages = getExpandedStages();
  for (const universe of ['Spider: The Video Game', 'Neon Genesis Evangelion']) {
    const universeStages = stages.filter(stage => stage.universe === universe);
    const hostileLeadIn = universeStages.find(stage => !stage.nonCombatTrial && stage.bossName);
    const neutralFinale = universeStages.find(stage => stage.nonCombatTrial && stage.bossName === null);
    assert.ok(hostileLeadIn, `${universe} hostile lead-in`);
    assert.ok(neutralFinale, `${universe} neutral set-piece finale`);
    assert.equal(neutralFinale.requiredLeadInStageId, hostileLeadIn.id, `${universe} ordered phases`);
  }
});

test('dedicated trial IDs are stable and globally unique', () => {
  const stages = getExpandedStages();
  assert.equal(new Set(stages.map(stage => stage.id)).size, stages.length);
  for (const stage of stages.filter(entry => entry.optionalTrial && entry.id >= 810000000)) {
    assert.equal(stage.id, stableTrialStageId(stage.universe, stage.encounterId), stage.name);
    assert.equal(stage.countsTowardCampaign, false, stage.name);
  }
});
