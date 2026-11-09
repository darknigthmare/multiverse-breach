import test from 'node:test';
import assert from 'node:assert/strict';
import { keyFor, httpsReference, stageReferenceIndex, resolveStageReference,
  isDeclaredOriginalIdentity, reviewSubstitution, rasterEvidence, summarizeResolutions, toCsv, gitTreeIndex } from './fidelityEvidence.mjs';
const pack = { key: 'p', universe: 'World', continuity: 'Edition 1', stage: 'Bridge',
  stageMeta: { referenceUrl: 'https://example.com/game', visualAnchor: 'Stone arch' },
  stageVariants: [['RPG','Mines','Hard','Boss',{ referenceUrl: 'https://example.com/game', visualAnchor: 'Crystal' }]] };
test('primary stage source metadata recovered', () => assert.equal(resolveStageReference({universe:'World',name:'Bridge'},stageReferenceIndex([pack])).visualAnchor,'Stone arch'));
test('array variant source metadata recovered', () => assert.equal(resolveStageReference({universe:'World',name:'Mines'},stageReferenceIndex([pack])).status,'PACK_REFERENCE_FOUND'));
test('object variants supported', () => assert.equal(stageReferenceIndex([{...pack,stageVariants:[{name:'Other',referenceUrl:'https://example.com/other'}]}]).size,2));
test('universe names never conflated', () => assert.equal(resolveStageReference({universe:'Other',name:'Bridge'},stageReferenceIndex([pack])).status,'NOT_FOUND'));
test('no fuzzy stage-name match', () => assert.equal(resolveStageReference({universe:'World',name:'Bridge Finale'},stageReferenceIndex([pack])).status,'NOT_FOUND'));
test('Unicode canonical normalization only', () => assert.equal(keyFor('Cafe\u0301','A'),keyFor('Caf\u00e9','A')));
test('case-sensitive identities retained', () => assert.notEqual(keyFor('World','A'),keyFor('world','A')));
test('duplicate identical declarations deduplicated', () => assert.equal(stageReferenceIndex([pack,pack]).get(keyFor('World','Bridge')).length,1));
test('conflicting declarations remain ambiguous', () => assert.equal(resolveStageReference({universe:'World',name:'Bridge'},stageReferenceIndex([pack,{...pack,continuity:'Edition 2'}])).status,'AMBIGUOUS'));
test('existing different reference preserved', () => assert.equal(resolveStageReference({universe:'World',name:'Bridge',referenceUrl:'https://example.com/scene'},stageReferenceIndex([pack])).existingReference,'https://example.com/scene'));
test('pack match never approves art', () => assert.equal(resolveStageReference({universe:'World',name:'Bridge'},stageReferenceIndex([pack])).artApproved,false));
test('anchor-only not promoted to reference', () => assert.equal(resolveStageReference({universe:'World',name:'Bridge'},stageReferenceIndex([{...pack,stageMeta:{visualAnchor:'Only anchor'}}])).status,'ANCHOR_ONLY'));
for (const url of ['http://example.com','javascript:alert(1)','https://user:password@example.com','invalid']) test(`unsafe reference rejected ${url.split(':')[0]}`, () => assert.equal(httpsReference(url),''));
test('OC declaration recognized', () => assert.equal(isDeclaredOriginalIdentity({incarnation:'Multiverse Breach original companion - Guard'}),true));
test('fan-made art not misclassified as OC', () => assert.equal(isDeclaredOriginalIdentity({canonStatus:'canon continuity with original fan-made project art'}),false));
test('explicit original companion removes external P0, not art review', () => assert.deepEqual(reviewSubstitution({canonStatus:'Original project companion, not canon'},'P0').priority,'P1'));
test('other P0 not silently closed', () => assert.equal(reviewSubstitution({canonStatus:'Source props locked'},'P0').priority,'P0'));
test('original art still unapproved', () => assert.equal(reviewSubstitution({canonStatus:'Original project companion, not canon'},'P0').artApproved,false));
const tree=gitTreeIndex({truncated:false,tree:[{type:'blob',path:'public/sprites/a.png',sha:'abc',size:25}]});
test('path presence preserves blob identity', () => assert.equal(rasterEvidence('/sprites/a.png',tree).gitBlob,'abc'));
test('missing path is not a crash claim', () => assert.equal(rasterEvidence('/sprites/b.png',tree).status,'MISSING_IN_GIT'));
test('query/hash normalized without rewriting filenames', () => assert.equal(rasterEvidence('/sprites/a.png?v=1#x',tree).present,true));
test('external src not falsely missing', () => assert.equal(rasterEvidence('https://example.com/a.png',tree).present,null));
test('protocol-relative src not treated as local', () => assert.equal(rasterEvidence('//example.com/a.png',tree).present,null));
test('traversal rejected', () => assert.equal(rasterEvidence('/sprites/../a.png',tree).status,'INVALID_PATH'));
test('unresolved distinct from absent', () => assert.equal(rasterEvidence('',tree).status,'UNRESOLVED'));
test('truncated tree rejected', () => assert.throws(()=>gitTreeIndex({truncated:true,tree:[]})));
test('unknown tree completeness rejected', () => assert.throws(()=>gitTreeIndex({tree:[]})));
test('duplicate modes not counted as extra assets', () => assert.equal(summarizeResolutions([{path:'/a',present:true,columns:1,rows:1},{path:'/a',present:true,columns:1,rows:1}]).staticAssets,1));
test('CSV prevents formula injection after whitespace', () => assert.match(toCsv([{name:' \t=SUM(A1)'}],['name']),/"' \t=SUM/));
test('CSV quotes semicolon and embedded quote', () => assert.match(toCsv([{name:'A;"B'}],['name']),/"A;""B"/));
test('audit functions do not mutate source', () => { const before=JSON.stringify(pack); stageReferenceIndex([pack]);assert.equal(JSON.stringify(pack),before); });

test('static HUD is not a missing gameplay animation', () => assert.equal(summarizeResolutions([{path:'/avatar',present:true,columns:1,rows:1,context:'hud'}]).staticGameplayAssets,0));
test('static enemy sheet is separately flagged for review', () => assert.equal(summarizeResolutions([{path:'/enemy',present:true,columns:1,rows:1,context:'enemy-sheet'}]).staticGameplayAssets,1));

test('original tribute persona recognized from explicit source, not name', () => assert.equal(isDeclaredOriginalIdentity({incarnation:'Multiverse Breach original tribute persona - King of Pop Avatar'}),true));
test('original adaptation wording alone never converts a licensed hero to OC', () => assert.equal(isDeclaredOriginalIdentity({canonStatus:'Musical combat is an original game adaptation.'}),false));
