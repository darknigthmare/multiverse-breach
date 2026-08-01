import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const referenceDirectory = path.join(
  projectRoot,
  'docs',
  'rift-dossiers',
  'references'
);

const BATCHES = [
  {
    file: 'universe-cosmetics-official-web-batch-01.json',
    scope: 'universe-cosmetics-official-web-batch-01',
    universes: new Set([
      'Payday',
      'Guilty Gear',
      'BlazBlue',
      'Fallout',
      'Harry Potter',
      'Star Wars',
      'Scary Movie',
      'Rick & Morty',
      'Digital Circus',
      'Digimon'
    ])
  },
  {
    file: 'universe-cosmetics-official-web-batch-02.json',
    scope: 'universe-cosmetics-official-web-batch-02',
    universes: new Set([
      'Vocaloid',
      'Slender Man',
      'Unreal',
      'Discworld',
      'Joker New 52',
      'The Batman Who Laughs',
      'Kaamelott',
      'Prometheus',
      'Aliens',
      'Alien 3'
    ])
  },
  {
    file: 'universe-cosmetics-official-web-batch-03.json',
    scope: 'universe-cosmetics-official-web-batch-03',
    universes: new Set([
      'Alien Resurrection',
      'Alien: Covenant',
      'Alien: Romulus',
      'Predator 2',
      'Predators',
      'The Predator',
      'Prey',
      'Predator: Killer of Killers',
      'Predator: Badlands',
      'Alien vs Predator'
    ])
  },
  {
    file: 'universe-cosmetics-official-web-batch-04.json',
    scope: 'universe-cosmetics-official-web-batch-04',
    universes: new Set([
      'Saw',
      'Mad Max',
      'Aliens vs Predator: Requiem',
      'Dungeon Meshi',
      'Noob',
      'Rammstein',
      'System of a Down',
      'Rob Zombie',
      'Daft Punk',
      'Oliver Tree'
    ])
  },
  {
    file: 'universe-cosmetics-official-web-batch-05.json',
    scope: 'universe-cosmetics-official-web-batch-05',
    universes: new Set([
      'Hazbin Hotel',
      'Splice',
      'Police Squad',
      'Breaking Bad',
      'Stargate Atlantis',
      'Stargate Universe',
      'Stargate Infinity',
      'The Brave Little Toaster',
      'Evolution',
      'Evolution: The Animated Series'
    ])
  },
  {
    file: 'universe-cosmetics-official-web-batch-06.json',
    scope: 'universe-cosmetics-official-web-batch-06',
    universes: new Set([
      'Early Edition',
      'Charmed',
      'Buffy the Vampire Slayer',
      'Attack on Titan',
      'Death Note',
      'Inuyashiki',
      'Borderlands',
      'VelociPastor',
      'Rubber',
      'From'
    ])
  },
  {
    file: 'universe-cosmetics-official-web-batch-07.json',
    scope: 'universe-cosmetics-official-web-batch-07',
    universes: new Set([
      'Uzumaki',
      'Toxic Avenger',
      'Exit 8',
      'Hell House LLC',
      'Sausage Party',
      'Spermageddon',
      'Spy x Family',
      'Terrifier',
      'Zak et Crysta',
      'Richard au pays des livres magiques'
    ])
  },
  {
    file: 'universe-cosmetics-official-web-batch-08.json',
    scope: 'universe-cosmetics-official-web-batch-08',
    universes: new Set([
      'Les Visiteurs du Futur',
      'Tenacious D',
      'M3GAN',
      'Camera Cafe',
      'Samantha Oups!',
      'Les Chevaliers du Fiel',
      'Noelle Perna',
      'War of the Worlds',
      'Ghostbusters',
      'Onechanbara'
    ])
  }
];

const OFFICIAL_HOSTS = new Set([
  'fbi.paydaythegame.com',
  'www.paydaythegame.com',
  'www.starbreeze.com',
  'www.guiltygear.com',
  'www.blazblue.jp',
  'fallout.bethesda.net',
  'gear.bethesda.net',
  'www.harrypotter.com',
  'www.starwars.com',
  'www.miramax.com',
  'www.adultswim.com',
  'www.glitchprod.com',
  'glitchproductions.store',
  'digimon.net',
  'piapro.net',
  'magicalmirai.com',
  'www.slenderarrival.com',
  'www.epicgames.com',
  'discworld.com',
  'www.dc.com',
  'www.m6.fr',
  'd23.com',
  'www.20thcenturystudios.com',
  'www.studioadi.com',
  'studioadi.com',
  'thewaltdisneycompany.com',
  'www.lionsgate.com',
  'shop.lionsgate.com',
  'avalanchestudios.com',
  'www.youtube.com',
  'delicious-in-dungeon.com',
  'yenpress.com',
  'olydriverse.com',
  'wiki.olydri.com',
  'www.noob-tv.com',
  'www.rammstein.de',
  'shop.rammstein.de',
  'www.systemofadown.com',
  'www.robzombie.com',
  'www.daftpunk.com',
  'www.olivertreemusic.com',
  'www.aboutamazon.com',
  'www.gaumont.com',
  'www.paramountplus.com',
  'www.paramountpictures.com',
  'www.sonypictures.com',
  'www.mgm.com',
  'www.primevideo.com',
  'movies.disney.com',
  'www.disneyplus.com',
  'play.google.com',
  'www.paramountpressexpress.com',
  'www.intl.paramountplus.com',
  'www.hulu.com',
  'shingeki.tv',
  'www.viz.com',
  'www.inuyashiki-project.com',
  'www.gearboxsoftware.com',
  'assets.2k.com',
  'borderlands.2k.com',
  'www.thevelocipastor.com',
  'www.mgmplus.com',
  'press.wbd.com',
  'tv.apple.com',
  'www.troma.com',
  'classic.toxicavenger.com',
  'playism.com',
  'www.qvisten.no',
  '74entertainment.no',
  'spy-family.net',
  'fuzzonthelens.com',
  'family.20thcenturystudios.com',
  'www.criterionpicusa.com',
  'www.levisiteurdufutur.com',
  'tenaciousd.com',
  'www.universalpictures.com',
  'www.blumhouse.com',
  'actu.m6.fr',
  'pro.m6.fr',
  'www.france.tv',
  'www.leschevaliersdufiel.com',
  'www.noelleperna.fr',
  'cotedazurfrance.fr',
  'amblin.com',
  'www.ghostbusters.com',
  'www.d3p.co.jp'
]);

const readBatch = batch => readFile(path.join(referenceDirectory, batch.file), 'utf8')
  .then(value => JSON.parse(value));

test('official cosmetic web batches are complete, structured and primary-source only', async () => {
  for (const batch of BATCHES) {
    const document = await readBatch(batch);
    assert.equal(document.schemaVersion, 1, `${batch.scope}: schema version`);
    assert.equal(document.scope, batch.scope, `${batch.scope}: scope`);
    assert.equal(document.entries.length, batch.universes.size, `${batch.scope}: entry count`);
    assert.deepEqual(
      new Set(document.entries.map(entry => entry.universe)),
      batch.universes,
      `${batch.scope}: universe coverage`
    );

    for (const entry of document.entries) {
      assert.equal(entry.webResearchVerified, true, `${entry.universe}: explicit verification gate`);
      assert.equal(entry.webResearch?.verified, true, `${entry.universe}: researched block`);
      assert.match(entry.webResearch?.verifiedAt || '', /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(entry.canonicalLocationOrMotif, `${entry.universe}: canonical motif`);

      for (const key of ['architecture', 'materials', 'palette', 'props', 'effects']) {
        assert.ok(entry.visualAnchor?.[key], `${entry.universe}: ${key}`);
      }

      assert.ok(
        entry.webResearch.environmentAnchors.length >= 3,
        `${entry.universe}: at least three environment anchors`
      );
      assert.ok(
        entry.webResearch.leadVisualAnchors.length >= 4,
        `${entry.universe}: at least four lead anchors`
      );
      const categories = new Set(
        entry.webResearch.leadVisualAnchors.map(anchor => anchor.category)
      );
      for (const category of ['silhouette', 'costume', 'equipment', 'colors']) {
        assert.equal(categories.has(category), true, `${entry.universe}: lead ${category}`);
      }

      assert.ok(entry.webResearch.officialSources.length > 0, `${entry.universe}: sources`);
      for (const source of entry.webResearch.officialSources) {
        assert.equal(source.sourceType, 'official', `${entry.universe}: source type`);
        assert.ok(source.title, `${entry.universe}: source title`);
        assert.ok(source.publisher, `${entry.universe}: source publisher`);
        const url = new URL(source.url);
        assert.equal(url.protocol, 'https:', `${entry.universe}: direct HTTPS source`);
        assert.equal(OFFICIAL_HOSTS.has(url.hostname), true, `${entry.universe}: official host`);
        assert.equal(
          entry.referenceUrls.includes(source.url),
          true,
          `${entry.universe}: builder-compatible URL provenance`
        );
      }
    }
  }
});

test('live-action leads remain anonymous Thread Echoes with no actor likeness', async () => {
  const documents = await Promise.all(BATCHES.map(readBatch));
  const entries = documents.flatMap(document => document.entries);
  for (const universe of [
    'Harry Potter',
    'Star Wars',
    'Scary Movie',
    'Kaamelott',
    'Prometheus',
    'Aliens',
    'Alien 3',
    'Alien Resurrection',
    'Alien: Covenant',
    'Alien: Romulus',
    'Predator 2',
    'Predators',
    'The Predator',
    'Prey',
    'Predator: Badlands',
    'Alien vs Predator',
    'Mad Max',
    'Aliens vs Predator: Requiem',
    'Noob',
    'Rammstein',
    'System of a Down',
    'Rob Zombie',
    'Daft Punk',
    'Oliver Tree',
    'Splice',
    'Police Squad',
    'Breaking Bad',
    'Stargate Atlantis',
    'Stargate Universe',
    'Evolution',
    'Early Edition',
    'Charmed',
    'Buffy the Vampire Slayer',
    'VelociPastor',
    'From',
    'Toxic Avenger',
    'Hell House LLC',
    'Terrifier',
    'Les Visiteurs du Futur',
    'Tenacious D',
    'M3GAN',
    'Camera Cafe',
    'Samantha Oups!',
    'Les Chevaliers du Fiel',
    'Noelle Perna',
    'War of the Worlds',
    'Ghostbusters'
  ]) {
    const entry = entries.find(candidate => candidate.universe === universe);
    assert.match(entry.leadCharacterName, /Thread Echo$/);
    assert.match(entry.visualAnchor.identitySafety, /anonymous|anonyme/i);
    assert.match(
      entry.visualAnchor.identitySafety,
      /no resemblance|aucune ressemblance|sans ressemblance/i
    );
  }
});

test('batch 06 preserves exact runtime leads and its strict four-by-four fidelity gate', async () => {
  const batch = BATCHES.find(candidate => candidate.scope.endsWith('batch-06'));
  const document = await readBatch(batch);
  const expectedLeads = new Map([
    ['Early Edition', 'Gary Hobson Thread Echo'],
    ['Charmed', 'Prue Halliwell Thread Echo'],
    ['Buffy the Vampire Slayer', 'Buffy Summers Thread Echo'],
    ['Attack on Titan', 'Eren Yeager'],
    ['Death Note', 'Light Yagami'],
    ['Inuyashiki', 'Ichiro Inuyashiki'],
    ['Borderlands', 'Lilith'],
    ['VelociPastor', 'Carol Thread Echo'],
    ['Rubber', 'Robert Rubber'],
    ['From', 'Boyd From Thread Echo']
  ]);

  for (const [universe, lead] of expectedLeads) {
    const entry = document.entries.find(candidate => candidate.universe === universe);
    assert.equal(entry?.leadCharacterName, lead, `${universe}: exact lead`);
    assert.equal(entry.webResearch.environmentAnchors.length, 4, `${universe}: four environment anchors`);
    assert.equal(entry.webResearch.leadVisualAnchors.length, 4, `${universe}: four lead anchors`);
    assert.deepEqual(
      new Set(entry.webResearch.leadVisualAnchors.map(anchor => anchor.category)),
      new Set(['silhouette', 'costume', 'equipment', 'colors']),
      `${universe}: exact lead-anchor categories`
    );
  }

  for (const universe of [
    'Attack on Titan',
    'Death Note',
    'Inuyashiki',
    'Borderlands'
  ]) {
    const entry = document.entries.find(candidate => candidate.universe === universe);
    assert.doesNotMatch(entry.leadCharacterName, /Thread Echo$/);
    assert.match(
      entry.visualAnchor.identitySafety,
      /original (animated|manga)|original stylized video-game/i,
      `${universe}: original fictional design`
    );
    assert.match(entry.visualAnchor.identitySafety, /no resemblance/i);
  }

  const robert = document.entries.find(candidate => candidate.universe === 'Rubber');
  assert.doesNotMatch(robert.leadCharacterName, /Thread Echo$/);
  assert.match(robert.visualAnchor.identitySafety, /nonhuman/i);
  assert.match(robert.visualAnchor.identitySafety, /no actor or performer likeness/i);
});

test('batch 07 preserves exact runtime leads and its strict four-by-four fidelity gate', async () => {
  const batch = BATCHES.find(candidate => candidate.scope.endsWith('batch-07'));
  const document = await readBatch(batch);
  const expectedLeads = new Map([
    ['Uzumaki', 'Azami Uzumaki'],
    ['Toxic Avenger', 'Toxie Thread Echo'],
    ['Exit 8', 'Sign Watcher'],
    ['Hell House LLC', 'Alex Hellhouse Thread Echo'],
    ['Sausage Party', 'Frank'],
    ['Spermageddon', 'Simen'],
    ['Spy x Family', 'Loid Forger'],
    ['Terrifier', 'Sienna Terrifier Thread Echo'],
    ['Zak et Crysta', 'Crysta'],
    ['Richard au pays des livres magiques', 'Adventure']
  ]);

  for (const [universe, lead] of expectedLeads) {
    const entry = document.entries.find(candidate => candidate.universe === universe);
    assert.equal(entry?.leadCharacterName, lead, `${universe}: exact lead`);
    assert.equal(entry.webResearch.environmentAnchors.length, 4, `${universe}: four environment anchors`);
    assert.equal(entry.webResearch.leadVisualAnchors.length, 4, `${universe}: four lead anchors`);
    assert.deepEqual(
      new Set(entry.webResearch.leadVisualAnchors.map(anchor => anchor.category)),
      new Set(['silhouette', 'costume', 'equipment', 'colors']),
      `${universe}: exact lead-anchor categories`
    );
  }

  for (const universe of [
    'Uzumaki',
    'Exit 8',
    'Sausage Party',
    'Spermageddon',
    'Spy x Family',
    'Zak et Crysta',
    'Richard au pays des livres magiques'
  ]) {
    const entry = document.entries.find(candidate => candidate.universe === universe);
    assert.doesNotMatch(entry.leadCharacterName, /Thread Echo$/);
    assert.match(
      entry.visualAnchor.identitySafety,
      /original (anonymous video-game|monochrome manga and animated|nonhuman animated|nonhuman full-CGI-style|animated and manga fictional)/i,
      `${universe}: original fictional or nonhuman design`
    );
    assert.match(
      entry.visualAnchor.identitySafety,
      /no resemblance|no actor|no actor, voice-performer|no performer/i,
      `${universe}: no real-person likeness`
    );
  }

  const limitationText = universe => document.entries
    .find(candidate => candidate.universe === universe)
    .webResearch.limitations.join(' ');
  assert.match(limitationText('Uzumaki'), /Azami Kurotani/);
  assert.match(limitationText('Hell House LLC'), /Alex Taylor/);
  assert.match(limitationText('Terrifier'), /Sienna Shaw/);

  const signWatcher = document.entries.find(candidate => candidate.universe === 'Exit 8');
  assert.match(signWatcher.visualAnchor.identitySafety, /original anonymous video-game avatar/i);
  assert.match(signWatcher.visualAnchor.identitySafety, /Kazunari Ninomiya/);
});

test('batch 08 preserves exact runtime leads and its strict four-by-four fidelity gate', async () => {
  const batch = BATCHES.find(candidate => candidate.scope.endsWith('batch-08'));
  const document = await readBatch(batch);
  const expectedLeads = new Map([
    ['Les Visiteurs du Futur', 'Le Visiteur Thread Echo'],
    ['Tenacious D', 'JB Thread Echo'],
    ['M3GAN', 'Gemma Thread Echo'],
    ['Camera Cafe', 'Jean-Claude Convenant Thread Echo'],
    ['Samantha Oups!', 'Samantha Thread Echo'],
    ['Les Chevaliers du Fiel', 'Agent Municipal Thread Echo'],
    ['Noelle Perna', 'Mado la Nicoise Thread Echo'],
    ['War of the Worlds', 'Ray Wotw Thread Echo'],
    ['Ghostbusters', 'Peter Venkman Thread Echo'],
    ['Onechanbara', 'Aya']
  ]);

  for (const [universe, lead] of expectedLeads) {
    const entry = document.entries.find(candidate => candidate.universe === universe);
    assert.equal(entry?.leadCharacterName, lead, `${universe}: exact lead`);
    assert.equal(entry.webResearch.environmentAnchors.length, 4, `${universe}: four environment anchors`);
    assert.equal(entry.webResearch.leadVisualAnchors.length, 4, `${universe}: four lead anchors`);
    assert.deepEqual(
      new Set(entry.webResearch.leadVisualAnchors.map(anchor => anchor.category)),
      new Set(['silhouette', 'costume', 'equipment', 'colors']),
      `${universe}: exact lead-anchor categories`
    );
  }

  const aya = document.entries.find(candidate => candidate.universe === 'Onechanbara');
  assert.doesNotMatch(aya.leadCharacterName, /Thread Echo$/);
  assert.match(aya.visualAnchor.identitySafety, /original stylized video-game/i);
  assert.match(aya.visualAnchor.identitySafety, /no resemblance/i);

  const ray = document.entries.find(candidate => candidate.universe === 'War of the Worlds');
  assert.match(ray.webResearch.limitations.join(' '), /Ray Ferrier/);

  const municipal = document.entries.find(
    candidate => candidate.universe === 'Les Chevaliers du Fiel'
  );
  assert.match(municipal.visualAnchor.identitySafety, /composite Thread Echo/i);
  assert.match(municipal.visualAnchor.identitySafety, /Eric Carriere/);
  assert.match(municipal.visualAnchor.identitySafety, /Francis Ginibre/);
});

test('animated Killer of Killers lead remains an original non-performer design', async () => {
  const batch = BATCHES.find(candidate => candidate.scope.endsWith('batch-03'));
  const document = await readBatch(batch);
  const entry = document.entries.find(
    candidate => candidate.universe === 'Predator: Killer of Killers'
  );
  assert.equal(entry.leadCharacterName, 'Viking Shieldmaiden');
  assert.doesNotMatch(entry.leadCharacterName, /Thread Echo$/);
  assert.match(entry.visualAnchor.identitySafety, /animée originale/i);
  assert.match(entry.visualAnchor.identitySafety, /aucune ressemblance|sans ressemblance/i);
});

test('batch 04 preserves exact canonical leads and Thread Echo policy', async () => {
  const batch = BATCHES.find(candidate => candidate.scope.endsWith('batch-04'));
  const document = await readBatch(batch);
  const expectedLeads = new Map([
    ['Saw', 'Billy the Puppet'],
    ['Mad Max', 'Mad Max Thread Echo'],
    ['Aliens vs Predator: Requiem', 'Wolf Predator Thread Echo'],
    ['Dungeon Meshi', 'Laios Touden'],
    ['Noob', 'Sparadrap Thread Echo'],
    ['Rammstein', 'Till Lindemann Thread Echo'],
    ['System of a Down', 'Serj Tankian Thread Echo'],
    ['Rob Zombie', 'Rob Zombie Thread Echo'],
    ['Daft Punk', 'Thomas Bangalter Thread Echo'],
    ['Oliver Tree', 'Oliver Tree Thread Echo']
  ]);

  for (const [universe, lead] of expectedLeads) {
    const entry = document.entries.find(candidate => candidate.universe === universe);
    assert.equal(entry?.leadCharacterName, lead, `${universe}: exact lead`);
  }

  const billy = document.entries.find(candidate => candidate.universe === 'Saw');
  assert.doesNotMatch(billy.leadCharacterName, /Thread Echo$/);
  assert.match(billy.visualAnchor.identitySafety, /marionnette non humaine/i);

  const laios = document.entries.find(candidate => candidate.universe === 'Dungeon Meshi');
  assert.doesNotMatch(laios.leadCharacterName, /Thread Echo$/);
  assert.match(laios.visualAnchor.identitySafety, /aventurier anim/i);
  assert.match(laios.visualAnchor.identitySafety, /aucune ressemblance|sans ressemblance/i);
});

test('batch 05 preserves exact runtime leads and its strict four-by-four fidelity gate', async () => {
  const batch = BATCHES.find(candidate => candidate.scope.endsWith('batch-05'));
  const document = await readBatch(batch);
  const expectedLeads = new Map([
    ['Hazbin Hotel', 'Charlie Morningstar'],
    ['Splice', 'Elsa Kast Thread Echo'],
    ['Police Squad', 'Frank Drebin Thread Echo'],
    ['Breaking Bad', 'Walter White Thread Echo'],
    ['Stargate Atlantis', 'John Sheppard Thread Echo'],
    ['Stargate Universe', 'Nicholas Rush Thread Echo'],
    ['Stargate Infinity', 'Gus Bonner'],
    ['The Brave Little Toaster', 'Toaster'],
    ['Evolution', 'Ira Kane Thread Echo'],
    ['Evolution: The Animated Series', 'Ira Kane Animated']
  ]);

  for (const [universe, lead] of expectedLeads) {
    const entry = document.entries.find(candidate => candidate.universe === universe);
    assert.equal(entry?.leadCharacterName, lead, `${universe}: exact lead`);
    assert.equal(entry.webResearch.environmentAnchors.length, 4, `${universe}: four environment anchors`);
    assert.equal(entry.webResearch.leadVisualAnchors.length, 4, `${universe}: four lead anchors`);
    assert.deepEqual(
      new Set(entry.webResearch.leadVisualAnchors.map(anchor => anchor.category)),
      new Set(['silhouette', 'costume', 'equipment', 'colors']),
      `${universe}: exact lead-anchor categories`
    );
  }

  for (const universe of [
    'Hazbin Hotel',
    'Stargate Infinity',
    'Evolution: The Animated Series'
  ]) {
    const entry = document.entries.find(candidate => candidate.universe === universe);
    assert.doesNotMatch(entry.leadCharacterName, /Thread Echo$/);
    assert.match(entry.visualAnchor.identitySafety, /anim[eé]e? originale?/i);
    assert.match(entry.visualAnchor.identitySafety, /aucune ressemblance|sans ressemblance/i);
  }

  const toaster = document.entries.find(
    candidate => candidate.universe === 'The Brave Little Toaster'
  );
  assert.doesNotMatch(toaster.leadCharacterName, /Thread Echo$/);
  assert.match(toaster.visualAnchor.identitySafety, /non humain/i);
  assert.match(toaster.visualAnchor.identitySafety, /aucune ressemblance|sans ressemblance/i);
});
