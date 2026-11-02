import test from 'node:test';
import assert from 'node:assert/strict';
import { deflateSync } from 'node:zlib';
import { inspectPngEvidence, pngCrc32 } from './pngEvidence.mjs';
import { assessCostumeFidelity, COSTUME_FIDELITY_CRITERIA as criteria, COSTUME_REFERENCE_VIEWS as views } from '../src/game/wardrobeFidelity.js';
const sig = Buffer.from('89504e470d0a1a0a', 'hex');
function chunk(name, data = Buffer.alloc(0)) {
  const out = Buffer.alloc(data.length + 12); out.writeUInt32BE(data.length, 0); out.write(name, 4);
  data.copy(out, 8); out.writeUInt32BE(pngCrc32(out.subarray(4, out.length - 4)), out.length - 4); return out;
}
function header({ width = 2, height = 2, depth = 8, type = 6, interlace = 0, compression = 0, filter = 0 } = {}) {
  const data = Buffer.alloc(13); data.writeUInt32BE(width, 0); data.writeUInt32BE(height, 4);
  data[8] = depth; data[9] = type; data[10] = compression; data[11] = filter; data[12] = interlace; return chunk('IHDR', data);
}
function png({ raw, type = 6, width = 2, height = 2, before = [], after = [], level = 6 } = {}) {
  return Buffer.concat([sig, header({ type, width, height }), ...before,
    chunk('IDAT', deflateSync(raw || Buffer.from([0,10,20,30,255,40,50,60,255,0,70,80,90,255,100,110,120,255]), { level })), ...after, chunk('IEND')]);
}
const image = png();
test('known CRC32 vector', () => assert.equal(pngCrc32(Buffer.from('123456789')), 0xcbf43926));
test('real RGBA evidence is decoded and hashed', () => {
  const r = inspectPngEvidence(image); assert.equal(r.decoded,true); assert.equal(r.visiblePixels,4); assert.equal(r.width,2); assert.equal(r.pixelSha256.length,64);
});
test('metadata and compression cannot create a distinct visual proof', () => {
  const alternate=png({before:[chunk('tEXt',Buffer.from('caption\0not a different image'))],level:0});
  assert.notEqual(inspectPngEvidence(image).sha256,inspectPngEvidence(alternate).sha256);
  assert.equal(inspectPngEvidence(image).pixelSha256,inspectPngEvidence(alternate).pixelSha256);
});
for (const filter of [0,1,2,3,4]) test(`inverse PNG filter ${filter} preserves samples`,()=>{
  const rows=[[10,20,30,255,40,50,60,255],[70,80,90,255,100,110,120,255]];
  const prediction=(a,b,c)=>{const p=a+b-c,da=Math.abs(p-a),db=Math.abs(p-b),dc=Math.abs(p-c);return da<=db&&da<=dc?a:db<=dc?b:c;};
  const raw=[];
  rows.forEach((row,y)=>{raw.push(filter);row.forEach((value,x)=>{const a=x>=4?row[x-4]:0,b=y?rows[y-1][x]:0,c=y&&x>=4?rows[y-1][x-4]:0;raw.push((value-[0,a,b,Math.floor((a+b)/2),prediction(a,b,c)][filter])&255);});});
  assert.equal(inspectPngEvidence(png({raw:Buffer.from(raw)})).pixelSha256,inspectPngEvidence(image).pixelSha256);
});
for(const [type,raw,extra] of [
  [0,[0,31,32,0,33,34],[]], [2,[0,31,31,31,32,32,32,0,33,33,33,34,34,34],[]],
  [3,[0,0,1,0,2,3],[chunk('PLTE',Buffer.from([31,31,31,32,32,32,33,33,33,34,34,34]))]],
  [4,[0,31,255,32,255,0,33,255,34,255],[]]
])test(`supported color type ${type} canonicalizes to RGBA`,()=>{
  const rgba=png({raw:Buffer.from([0,31,31,31,255,32,32,32,255,0,33,33,33,255,34,34,34,255])});
  assert.equal(inspectPngEvidence(png({type,raw:Buffer.from(raw),before:extra})).pixelSha256,inspectPngEvidence(rgba).pixelSha256);
});
test('indexed tRNS transparency is honored',()=>{
 const b=png({type:3,raw:Buffer.from([0,0,1,0,0,1]),before:[chunk('PLTE',Buffer.from([1,2,3,10,20,30])),chunk('tRNS',Buffer.from([0,255]))]});
 assert.equal(inspectPngEvidence(b).visiblePixels,2);
});
test('hidden RGB is ignored in visual evidence identity',()=>{
 const a=png({raw:Buffer.from([0,1,2,3,0,40,50,60,255,0,70,80,90,255,100,110,120,255])});
 const b=png({raw:Buffer.from([0,99,99,99,0,40,50,60,255,0,70,80,90,255,100,110,120,255])});
 assert.equal(inspectPngEvidence(a).pixelSha256,inspectPngEvidence(b).pixelSha256);
});
const malformed = [
 ['old header-only forgery',Buffer.concat([sig,header(),Buffer.from('000000000000IEND000000000000000000')])],
 ['truncated file',image.subarray(0,image.length-3)],
 ['CRC damage',Buffer.from(image).map((b,i)=>i===29?b^1:b)],
 ['missing IDAT',Buffer.concat([sig,header(),chunk('IEND')])],
 ['trailing bytes',Buffer.concat([image,Buffer.from('junk')])],
 ['duplicate header',Buffer.concat([sig,header(),header(),image.subarray(33)])],
 ['unsupported 16 bit',Buffer.concat([sig,header({depth:16}),image.subarray(33)])],
 ['unsupported interlace',Buffer.concat([sig,header({interlace:1}),image.subarray(33)])],
 ['oversized geometry',Buffer.concat([sig,header({width:8192,height:8192}),image.subarray(33)])],
 ['invalid method',Buffer.concat([sig,header({compression:1}),image.subarray(33)])],
 ['unknown critical chunk',png({before:[chunk('ABCD')]})],
 ['animated image',png({before:[chunk('acTL',Buffer.alloc(8))]})],
 ['wrong row size',png({raw:Buffer.alloc(10)})],
 ['deflate expansion beyond geometry',png({raw:Buffer.alloc(1024*1024)})],
 ['invalid filter',png({raw:Buffer.from([9,10,20,30,255,40,50,60,255,0,70,80,90,255,100,110,120,255])})],
 ['fully transparent',png({raw:Buffer.alloc(18)})],
 ['palette missing',png({type:3,raw:Buffer.from([0,0,1,0,0,1])})],
 ['palette index missing',png({type:3,raw:Buffer.from([0,1,1,0,1,1]),before:[chunk('PLTE',Buffer.from([1,2,3]))]})],
 ['non-contiguous data',png({after:[chunk('tEXt',Buffer.from('x\0y')),chunk('IDAT',Buffer.alloc(0))]})],
 ['late transparency',png({after:[chunk('tRNS',Buffer.alloc(1))]})]
];
for(const [name,bytes] of malformed)test(`reject ${name}`,()=>assert.throws(()=>inspectPngEvidence(bytes),/PNG_EVIDENCE/));
const entry={id:'test-costume',actorKey:'test-actor',origin:'OFFICIAL',sourceWork:'Test edition',sourceUrl:'https://example.com/source'};
function reviewFixture(){
 const inventory=new Map();let i=0;
 const proof=()=>{const path=`proof-${++i}.png`,data=png({width:1,height:1,raw:Buffer.from([0,i,10,20,255])}),evidence=inspectPngEvidence(data);inventory.set(path,evidence);return {path,sha256:evidence.sha256};};
 const review={entryId:entry.id,actorKey:entry.actorKey,incarnation:'Test identity',sourceWork:entry.sourceWork,reviewer:'Synthetic unit test',reviewedOn:'2026-10-25',
  scores:Object.fromEntries(criteria.map(c=>[c.key,c.max])),notes:Object.fromEntries(criteria.map(c=>[c.key,'Synthetic test, no art review.'])),
  references:views.map(view=>({view,sourceUrl:entry.sourceUrl,...proof()})),sheet:proof(),inGame:proof(),checkedStates:[{state:'auto:idle',passed:true,notes:'Synthetic state',...proof()}]};
 return {inventory,review,requirements:{actorKey:entry.actorKey,states:['auto:idle'],asOf:'2026-10-25'}};
}
test('decoded complete synthetic evidence is still never art approval',()=>{const x=reviewFixture(),r=assessCostumeFidelity(entry,x.review,x.inventory,x.requirements);assert.deepEqual(r.blockers,[]);assert.equal(r.artApproved,false);assert.equal(r.equippable,false);});
test('header-only inventory metadata no longer qualifies',()=>{const x=reviewFixture();delete x.inventory.get(x.review.sheet.path).decoded;assert.ok(assessCostumeFidelity(entry,x.review,x.inventory,x.requirements).blockers.includes('COSTUME_SHEET_REQUIRED'));});
for(const kind of ['reference','sheet','state','capture'])test(`identical samples with different file SHA cannot masquerade as ${kind}`,()=>{
 const x=reviewFixture(),from=x.review.references[0];
 let target,blocker;
 if(kind==='reference'){target=x.review.references[1];blocker='REFERENCE_VIEWS_NOT_DISTINCT';}
 if(kind==='sheet'){target=x.review.sheet;blocker='SOURCE_IS_OUTPUT_SHEET';}
 if(kind==='state'){target=x.review.checkedStates[0];blocker='STATE_PROOF_IS_REFERENCE:auto:idle';}
 if(kind==='capture'){target=x.review.inGame;blocker='IN_GAME_CAPTURE_IS_REFERENCE';}
 x.inventory.get(target.path).pixelSha256=x.inventory.get(from.path).pixelSha256;
 assert.notEqual(target.sha256,from.sha256);
 assert.ok(assessCostumeFidelity(entry,x.review,x.inventory,x.requirements).blockers.includes(blocker));
});

test('high-bit chunk bytes cannot masquerade as ASCII type letters', () => {
  const extra = chunk('tEXt', Buffer.from('x\0y')); extra[4] |= 128;
  extra.writeUInt32BE(pngCrc32(extra.subarray(4, extra.length - 4)), extra.length - 4);
  assert.throws(() => inspectPngEvidence(png({before:[extra]})), /invalid chunk type/);
});
