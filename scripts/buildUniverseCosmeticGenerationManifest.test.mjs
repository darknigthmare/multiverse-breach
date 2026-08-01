import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildUniverseCosmeticGenerationManifest,
  buildUniverseCosmeticGenerationPrompt,
  extractReferenceEntries,
  flattenVisualAnchor,
  isThreadEchoLeadName,
  normalizeCharacterIdentity,
  normalizeOfficialWebResearch,
  normalizeUniverseAlias,
  resolveCosmeticLeadHeroName,
  shouldRequireWebResearch,
  slugifyForCosmeticProcessor
} from './buildUniverseCosmeticGenerationManifest.mjs';

const projectRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));

const qualifiedOfficialWebResearch = () => ({
  verified: true,
  verifiedAt: '2026-08-01',
  officialSources: [{
    url: 'https://studio.example.com/world/lead',
    title: 'Official character and world guide',
    publisher: 'Example Studio',
    sourceType: 'official'
  }],
  environmentAnchors: [
    'Ribbed bronze transit arches surrounding a flooded central platform',
    'Narrow basalt control bridge lit by alternating amber warning lamps'
  ],
  leadVisualAnchors: [
    { category: 'silhouette', detail: 'Tall triangular shoulder profile with a narrow upright stance' },
    { category: 'costume', detail: 'Weathered navy flight coat over segmented bronze chest panels' },
    { category: 'equipment', detail: 'Short ion baton carried in a square mechanical forearm holster' },
    { category: 'colors', detail: 'Navy blue, oxidized bronze and restrained amber energy accents' }
  ]
});

const identitiesOverlap = (left, right) => {
  // `Thread Echo` is an identity-safety treatment, not part of the canonical
  // character token stored in the bitmap-quality metadata.
  const comparableIdentity = value => normalizeCharacterIdentity(
    String(value || '').replace(/\s+Thread Echo$/i, '')
  );
  const normalizedLeft = comparableIdentity(left);
  const normalizedRight = comparableIdentity(right);
  return normalizedLeft === normalizedRight || (
    Math.min(normalizedLeft.length, normalizedRight.length) >= 4
    && (normalizedLeft.includes(normalizedRight) || normalizedRight.includes(normalizedLeft))
  );
};

test('generation prompt defines the exact keyed 4x6 atlas contract', () => {
  const prompt = buildUniverseCosmeticGenerationPrompt({
    universe: 'Test World',
    rightsClass: 'third-party',
    canonicalMotif: 'Test citadel above a storm sea',
    visualAnchors: ['architecture: stone arches', 'palette: blue and amber'],
    leadHeroName: 'Test Lead',
    heroAnchors: ['Lead character: Test Lead', 'Signature weapon type: staff'],
    leadReferencePath: 'public/sprites/generated/heroes/test-world/test-lead.png',
    officialReferenceUrls: ['https://example.com/official-test-world'],
    needsWebResearch: false
  });
  assert.match(prompt, /exactly one 1024x1536/i);
  assert.match(prompt, /4 equal columns by 6 equal rows/i);
  assert.match(prompt, /flat uniform solid #00ff00/i);
  assert.match(prompt, /PROFILE TITLE \/ HUD TOP/);
  assert.match(prompt, /PROFILE BANNER \/ HUD LOWER/);
  assert.match(prompt, /FOUR isolated 256x256 PORTAL EFFECT frames/);
  assert.match(prompt, /KO EFFECT[\s\S]*absolutely no character, body/i);
  assert.match(prompt, /INTRO POSE[\s\S]*SAME Test Lead identity/);
  assert.match(prompt, /VICTORY POSE[\s\S]*SAME Test Lead identity/);
  assert.match(prompt, /exact same source-grounded weapon model[\s\S]*dominant hand must persist/i);
  assert.match(prompt, /same weapon model[\s\S]*used throughout row 4/i);
  assert.match(prompt, /no character, costume, weapon or accessory continuity change/i);
  assert.match(prompt, /character and equipment pixel must remain inside atlas y=1048\.\.1255/i);
  assert.match(prompt, /character and equipment pixel must remain inside atlas y=1304\.\.1511/i);
  assert.match(prompt, /never raise, swing or summon a weapon above the head/i);
  assert.match(prompt, /use free-hand gesture and body posture for victory/i);
  assert.match(prompt, /conceptual only: never draw cell borders/);
  assert.match(prompt, /at least 24 pixels inside all four edges/);
  assert.match(prompt, /top frame must stay vertically inside atlas y=16\.\.231/);
  assert.match(prompt, /lower frame must stay vertically inside atlas y=272\.\.487/);
  assert.match(prompt, /identity-safe Thread Echo/i);
  assert.match(prompt, /fan-made fan-art interpretation/i);
  assert.match(prompt, /no readable text; no logo; no watermark/i);
  assert.match(prompt, /public\/sprites\/generated\/heroes\/test-world\/test-lead\.png/);
  assert.match(prompt, /facts already encoded from the researched official-source provenance/i);
  assert.match(prompt, /Do not browse, fetch, open/i);
  assert.match(prompt, /https:\/\/example\.com\/official-test-world/);
});

test('processor-compatible slugs and runtime aliases remain stable', () => {
  assert.equal(slugifyForCosmeticProcessor('Le Cinquième Element'), 'le-cinquieme-element');
  assert.equal(slugifyForCosmeticProcessor('Rick & Morty'), 'rick-morty');
  assert.equal(slugifyForCosmeticProcessor('Cells at Work!'), 'cells-at-work');
  assert.equal(normalizeUniverseAlias('Cells at Work'), 'Cells at Work!');
  assert.equal(normalizeUniverseAlias('Matrix'), 'The Matrix');
  assert.equal(normalizeUniverseAlias('Joker New52'), 'Joker New 52');
  assert.equal(normalizeUniverseAlias('Alien3'), 'Alien 3');
});

test('reference document shapes and structured anchors are normalized', () => {
  assert.deepEqual(extractReferenceEntries([{ universe: 'Alien' }]), [{ universe: 'Alien' }]);
  assert.deepEqual(
    extractReferenceEntries({ entries: [{ universe: 'Halo' }] }),
    [{ universe: 'Halo' }]
  );
  assert.deepEqual(
    flattenVisualAnchor({ palette: 'cold blue', props: ['ring', 'console'] }),
    ['palette: cold blue', 'props: ring', 'props: console']
  );
});

test('strict official Web dossier can ground a lead without a local bitmap', () => {
  const webResearch = qualifiedOfficialWebResearch();
  const normalized = normalizeOfficialWebResearch(webResearch, true);
  assert.equal(normalized.passesFidelityGate, true);
  assert.deepEqual(
    normalized.leadVisualAnchors.map(anchor => anchor.category),
    ['silhouette', 'costume', 'equipment', 'colors']
  );
  assert.equal(shouldRequireWebResearch({
    leadReferencePath: null,
    visualAnchors: normalized.environmentAnchors,
    referenceConfidence: 'high',
    webResearch,
    webResearchVerified: true
  }), false);

  const prompt = buildUniverseCosmeticGenerationPrompt({
    universe: 'Live Action Test World',
    rightsClass: 'third-party',
    canonicalMotif: 'Flooded bronze transit citadel',
    visualAnchors: normalized.environmentAnchors,
    leadHeroName: 'Anonymous Lead Thread Echo',
    heroAnchors: normalized.leadVisualAnchors.map(anchor => `${anchor.category}: ${anchor.detail}`),
    leadReferencePath: null,
    webResearch: normalized,
    officialReferenceUrls: normalized.officialSources.map(source => source.url),
    needsWebResearch: false
  });
  for (const anchor of normalized.environmentAnchors) assert.match(prompt, new RegExp(anchor));
  for (const anchor of normalized.leadVisualAnchors) assert.match(prompt, new RegExp(anchor.detail));
  assert.match(prompt, /Direct official Web provenance:/);
  assert.match(prompt, /anonymous identity-safe Thread Echo/i);
});

test('official Web gate rejects weak, indirect, or unverified dossiers', () => {
  const assertRejected = (webResearch, webResearchVerified = true) => {
    assert.equal(
      normalizeOfficialWebResearch(webResearch, webResearchVerified).passesFidelityGate,
      false
    );
    assert.equal(shouldRequireWebResearch({
      leadReferencePath: null,
      visualAnchors: ['Detailed environment one', 'Detailed environment two'],
      referenceConfidence: 'high',
      webResearch,
      webResearchVerified
    }), true);
  };

  assertRejected(qualifiedOfficialWebResearch(), false);
  assertRejected({ ...qualifiedOfficialWebResearch(), verified: false });
  assertRejected({
    ...qualifiedOfficialWebResearch(),
    officialSources: [{
      url: 'https://encyclopedia.example.net/article',
      title: 'Community summary',
      publisher: 'Fan Encyclopedia',
      sourceType: 'secondary'
    }]
  });
  assertRejected({
    ...qualifiedOfficialWebResearch(),
    officialSources: [
      ...qualifiedOfficialWebResearch().officialSources,
      {
        url: 'https://wiki.example.net/community-costume-notes',
        title: 'Community costume notes',
        publisher: 'Fan Wiki',
        sourceType: 'secondary'
      }
    ]
  });
  assertRejected({
    ...qualifiedOfficialWebResearch(),
    environmentAnchors: ['Only one concrete official environment anchor is present']
  });
  assertRejected({
    ...qualifiedOfficialWebResearch(),
    leadVisualAnchors: [
      { category: 'colors', detail: 'Blue chest panel with a restrained amber edge light' },
      { category: 'colors', detail: 'Oxidized bronze boots with dark navy sole plates' },
      { category: 'colors', detail: 'Black gloves with a small blue cuff stripe' }
    ]
  });
  assertRejected({
    ...qualifiedOfficialWebResearch(),
    verifiedAt: 'not-a-date'
  });
});

test('Thread Echo research overrides bitmap identity without discarding its non-biometric cues', () => {
  const localReference = {
    basenameName: 'Arthur Pendragon',
    characterNames: ['Arthur Pendragon']
  };
  const shared = {
    universe: 'Kaamelott',
    leadReferencePath: 'public/sprites/generated/heroes/kaamelott/arthur.png',
    leadHero: { name: 'Arthur Pendragon' },
    leadReference: localReference
  };
  assert.equal(resolveCosmeticLeadHeroName({
    ...shared,
    officialWebLeadName: 'Arthur Pendragon Thread Echo'
  }), 'Arthur Pendragon Thread Echo');
  assert.equal(resolveCosmeticLeadHeroName({
    ...shared,
    officialWebLeadName: 'King Arthur'
  }), 'Arthur Pendragon');

  for (const leadHeroName of [
    'Arthur Pendragon Thread Echo',
    'Elizabeth Shaw Thread Echo',
    'Corporal Hicks Thread Echo',
    'Ellen Ripley A3 Thread Echo'
  ]) {
    const prompt = buildUniverseCosmeticGenerationPrompt({
      universe: 'Live Action Test',
      rightsClass: 'third-party',
      canonicalMotif: 'Source-grounded live-action environment',
      visualAnchors: ['Concrete official architecture anchor', 'Concrete official palette anchor'],
      leadHeroName,
      heroAnchors: [`Lead character: ${leadHeroName}`],
      leadReferencePath: shared.leadReferencePath,
      officialReferenceUrls: ['https://studio.example.com/official'],
      needsWebResearch: false
    });
    assert.match(prompt, /strictly a non-biometric reference/i);
    assert.match(prompt, /costume, equipment, palette and broad silhouette only/i);
    assert.match(prompt, /Never use its face, facial geometry, biometric identity/i);
    assert.match(prompt, new RegExp(leadHeroName));
  }
});

test('full manifest follows the exact LORE_DB universe contract', async () => {
  const manifest = await buildUniverseCosmeticGenerationManifest();
  assert.equal(manifest.universes.length, 394);
  assert.equal(manifest.summary.universeCount, 394);
  assert.equal(
    manifest.summary.originalCount + manifest.summary.thirdPartyCount,
    manifest.summary.universeCount
  );
  assert.equal(new Set(manifest.universes.map(entry => entry.slug)).size, 394);

  const byUniverse = new Map(manifest.universes.map(entry => [entry.universe, entry]));
  assert.equal(byUniverse.has('Cells at Work!'), true);
  assert.equal(byUniverse.has('Cells at Work'), false);
  assert.equal(byUniverse.has('The Matrix'), true);
  assert.equal(byUniverse.has('Matrix'), false);
  assert.equal(byUniverse.get('Nexus de Convergence').rightsClass, 'original');
  assert.equal(byUniverse.get('Half-Life').leadHeroName, 'Gordon Freeman');
  assert.equal(byUniverse.get('Chucky').leadHeroName, 'Tiffany Valentine');
  assert.equal(byUniverse.get('Le Cinquième Element').leadHeroName, 'Leeloo');
  assert.equal(byUniverse.get('Rosario + Vampire').leadHeroName, 'Tsukune Aono');
  assert.equal(byUniverse.get('Digital Circus').leadHeroName, 'Pomni');
  assert.equal(byUniverse.get('Payday').leadHeroName, 'Dallas Thread Echo');
  assert.equal(byUniverse.get('Harry Potter').leadHeroName, 'Adult Hogwarts Wizard Thread Echo');
  assert.equal(byUniverse.get('Star Wars').leadHeroName, 'Luke Skywalker Thread Echo');
  assert.equal(byUniverse.get('Scary Movie').leadHeroName, 'Cindy Campbell Thread Echo');
  const batch02LiveActionLeads = new Map([
    ['Kaamelott', 'Arthur Pendragon Thread Echo'],
    ['Prometheus', 'Elizabeth Shaw Thread Echo'],
    ['Aliens', 'Corporal Hicks Thread Echo'],
    ['Alien 3', 'Ellen Ripley A3 Thread Echo']
  ]);
  for (const [universe, expectedLead] of batch02LiveActionLeads) {
    const entry = byUniverse.get(universe);
    assert.equal(entry.leadHeroName, expectedLead, `${universe}: anonymous researched lead`);
    assert.equal(entry.webResearchVerified, true, `${universe}: qualified research`);
    assert.equal(entry.needsWebResearch, false, `${universe}: production gate`);
    assert.match(entry.generationPrompt, /anonymous identity-safe Thread Echo/i);
    assert.equal(entry.generationPrompt.includes(expectedLead), true);
  }
  const kaamelott = byUniverse.get('Kaamelott');
  assert.match(kaamelott.leadReferencePath, /^public\/sprites\/generated\/heroes\/kaamelott\//);
  assert.match(kaamelott.generationPrompt, /strictly a non-biometric reference/i);
  assert.match(
    byUniverse.get('Half-Life').leadReferencePath,
    /^public\/sprites\/generated\/heroes\/half-life\//
  );

  for (const entry of manifest.universes) {
    assert.ok(entry.canonicalMotif, `${entry.universe}: canonical motif`);
    assert.equal(entry.canonicalStage, entry.canonicalMotif, `${entry.universe}: stage alias`);
    assert.ok(entry.visualAnchors.length > 0, `${entry.universe}: visual anchors`);
    assert.ok(entry.heroAnchors.length > 0, `${entry.universe}: hero anchors`);
    assert.ok(entry.leadHeroName, `${entry.universe}: lead hero`);
    assert.ok(entry.officialReferenceUrls.length > 0, `${entry.universe}: official URLs`);
    assert.equal(entry.generationAllowed, true, `${entry.universe}: generation permission`);
    assert.match(entry.referenceConfidence, /^(?:medium|high)$/);
    assert.equal(typeof entry.needsWebResearch, 'boolean');
    assert.equal(typeof entry.webResearchVerified, 'boolean');
    assert.equal(entry.webResearchVerified, entry.webResearch !== null);
    assert.equal(entry.needsWebResearch, shouldRequireWebResearch(entry), `${entry.universe}: web research gate`);
    assert.match(entry.generationPrompt, /exactly one 1024x1536/i);
    assert.match(entry.generationPrompt, /Identity safety:/i);
    assert.match(entry.generationPrompt, /Do not browse, fetch, open/i);
    assert.equal(entry.generationPrompt.includes(entry.canonicalMotif), true);
    assert.equal(entry.generationPrompt.includes(entry.leadHeroName), true);
    if (entry.leadReferencePath) {
      assert.equal(entry.localReferencePaths.includes(entry.leadReferencePath), true);
      assert.equal(entry.generationPrompt.includes(entry.leadReferencePath), true);
    }
    if (entry.webResearchVerified) {
      assert.equal(entry.needsWebResearch, false, `${entry.universe}: qualified Web dossier`);
      if (!entry.leadReferencePath || isThreadEchoLeadName(entry.webResearch.leadCharacterName)) {
        assert.equal(
          entry.leadHeroName,
          entry.webResearch.leadCharacterName,
          `${entry.universe}: researched lead name`
        );
      }
      for (const anchor of entry.webResearch.leadVisualAnchors) {
        assert.equal(
          entry.generationPrompt.includes(anchor.detail),
          true,
          `${entry.universe}: researched lead anchor in prompt`
        );
      }
    }
  }
});

test('every approved lead identity agrees with quality metadata or its reference basename', async () => {
  const [manifest, quality] = await Promise.all([
    buildUniverseCosmeticGenerationManifest(),
    readFile(
      path.join(projectRoot, 'docs', 'rift-dossiers', 'character-reference-quality.json'),
      'utf8'
    ).then(JSON.parse)
  ]);
  const qualityByPath = new Map((quality.referenceFiles || []).map(reference => [
    `public${String(reference.path).replaceAll('\\', '/').replace(/^\/+/, '/')}`,
    reference
  ]));

  for (const entry of manifest.universes.filter(universe => universe.leadReferencePath)) {
    const reference = qualityByPath.get(entry.leadReferencePath);
    assert.ok(reference, `${entry.universe}: quality metadata exists`);
    assert.equal(reference.classification, 'approved', `${entry.universe}: approved classification`);
    const basename = path.basename(reference.path, path.extname(reference.path)).replace(/[-_]+/g, ' ');
    const coherent = (reference.characters || []).some(character => (
      identitiesOverlap(entry.leadHeroName, character)
    )) || identitiesOverlap(entry.leadHeroName, basename);
    assert.equal(
      coherent,
      true,
      `${entry.universe}: ${entry.leadHeroName} does not match ${reference.path}`
    );
  }
});
