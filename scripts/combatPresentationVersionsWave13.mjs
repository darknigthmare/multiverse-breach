import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

// Only these three pre-existing recipes were deliberately versioned by W13.
// Both complete historical objects and complete selected objects remain pinned;
// every other historical recipe still uses direct deep equality in its test.
const revisions = {
  luke: {
    priorSha256: '67c0b54eb7678c778ef887d341270d42d252adbd68641f24e780185cae9a3cb5',
    selectedSha256: 'cf170149cbb5c9013d5fe59150fe78bb8ee6e804ba59e65bb2f088501f71fa37',
    sourceAction: 'Enchaînement au sabre vert de Luke',
    sourceWork: 'Star Wars: Return of the Jedi (1983), adult Luke Skywalker aboard the second Death Star',
    sourceReference: 'https://www.starwars.com/databank/luke-skywalker',
    kind: 'green-lightsaber',
    missingAssets: []
  },
  vader: {
    priorSha256: 'd340325d33ecbd9dc967b7ee5e9dde5dd81ad11552ce99297e691592a5d6ef91',
    selectedSha256: '6f1dd5bdcbc1e28b468181b2423f5ba24a067271fbd481c580e90f65d86b6c97',
    sourceAction: 'Taille au sabre rouge de Vador',
    sourceWork: 'Star Wars: The Empire Strikes Back (1980), Darth Vader at Bespin',
    sourceReference: 'https://www.starwars.com/databank/darth-vader',
    kind: 'red-lightsaber',
    missingAssets: ['native-all-phase-artwork', 'native-base16-artwork']
  },
  obi_wan: {
    priorSha256: 'c6d11e45fda8fe5cddbaae16c4ed254f1c08e76b8832a5226ce0e8adec0ac539',
    selectedSha256: '9c298cb32928027443b557e8a50d99c05e29a5ffac215f7b5f6cf45f6c51216c',
    sourceAction: 'Contre au sabre bleu d’Obi-Wan',
    sourceWork: 'Star Wars: Revenge of the Sith (2005), adult Obi-Wan Kenobi',
    sourceReference: 'https://www.starwars.com/databank/obi-wan-kenobi',
    kind: 'blue-lightsaber',
    missingAssets: ['native-all-phase-artwork', 'native-base16-artwork']
  }
};
const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');

export function assertHistoricalPresentationOrWave13Version(id, prior, selected) {
  const revision = revisions[id];
  if (!revision) return assert.deepEqual(selected, prior, id);
  assert.equal(digest(prior), revision.priorSha256, id + ': historical recipe changed');
  assert.equal(digest(selected), revision.selectedSha256, id + ': selected W13 recipe changed');
  assert.equal(selected.heroId, id);
  assert.equal(selected.universe, 'Star Wars');
  assert.equal(selected.sourceAction, revision.sourceAction);
  assert.equal(selected.sourceReference, `${revision.sourceWork}. ${revision.sourceReference}. Native drawings and bounded engine mechanics are adaptations; source 1:1 is not certified.`);
  assert.deepEqual(Object.keys(selected.phases).sort(), ['intro', 'outro', 'fatality', 'victory', 'defeat', 'roundVictory', 'roundDefeat'].sort());
  for (const [phase, script] of Object.entries(selected.phases)) {
    assert.equal(script.heroId, id);
    assert.equal(script.universe, 'Star Wars');
    assert.equal(script.phase, phase);
    assert.equal(script.effect.kind, phase === 'fatality' ? revision.kind : 'none');
    assert.deepEqual(script.missingAssets, revision.missingAssets);
    assert.equal(script.provenance.canonicalSequence, false);
    assert.equal(script.provenance.networkVerified, false);
  }
}
