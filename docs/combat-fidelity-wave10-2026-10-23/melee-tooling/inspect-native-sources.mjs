import fs from 'node:fs/promises';import crypto from 'node:crypto';import sharp from 'sharp';const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
async function segmentSource(file, expectedRows) {
  const bytes = await fs.readFile(file);
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const size = info.width * info.height;
  const labels = new Int32Array(size).fill(-1), queue = new Int32Array(size), components = [];
  for (let start = 0; start < size; start++) {
    if (labels[start] >= 0 || data[start * 4 + 3] < 24) continue;
    const id = components.length;
    let head = 0, tail = 1, x0 = info.width, y0 = info.height, x1 = -1, y1 = -1;
    queue[0] = start; labels[start] = id;
    while (head < tail) {
      const at = queue[head++], x = at % info.width, y = Math.floor(at / info.width);
      x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= info.width || ny >= info.height) continue;
        const next = ny * info.width + nx;
        if (labels[next] < 0 && data[next * 4 + 3] >= 24) { labels[next] = id; queue[tail++] = next; }
      }
    }
    components.push({ id, pixels: tail, x0, y0, x1, y1 });
  }
  // Whole connected bodies are assigned before rows. A horizontal grid cut
  // can otherwise cut a real raised arm, shoe or lowered crouch. No anatomy
  // is reconstructed and no pose is rotated, mirrored or duplicated.
  const bodies = [...components].sort((a, b) => b.pixels - a.pixels).slice(0, expectedRows * 4);
  if (bodies.length !== expectedRows * 4 || bodies.at(-1).pixels < 1000) throw new Error(`Incomplete native source ${file}`);
  bodies.sort((a, b) => (a.y0 + a.y1) - (b.y0 + b.y1));
  const ordered = [];
  for (let row = 0; row < expectedRows; row++) ordered.push(...bodies.slice(row * 4, row * 4 + 4).sort((a, b) => (a.x0 + a.x1) - (b.x0 + b.x1)));
  const bodyFrames = new Map(ordered.map((body, i) => [body.id, i]));
  const owner = components.map(component => {
    if (bodyFrames.has(component.id)) return bodyFrames.get(component.id);
    const cx = (component.x0 + component.x1) / 2, cy = (component.y0 + component.y1) / 2;
    let selected = 0, best = Infinity;
    ordered.forEach((body, i) => {
      const dx = Math.max(body.x0 - cx, 0, cx - body.x1), dy = Math.max(body.y0 - cy, 0, cy - body.y1);
      const distance = dx * dx + dy * dy + 0.01 * ((cx - (body.x0 + body.x1) / 2) ** 2 + (cy - (body.y0 + body.y1) / 2) ** 2);
      if (distance < best) { best = distance; selected = i; }
    });
    return selected;
  });
  const bounds = ordered.map(() => ({ x0: info.width, y0: info.height, x1: -1, y1: -1 }));
  for (const component of components) {
    const target = bounds[owner[component.id]];
    target.x0 = Math.min(target.x0, component.x0); target.y0 = Math.min(target.y0, component.y0);
    target.x1 = Math.max(target.x1, component.x1); target.y1 = Math.max(target.y1, component.y1);
  }
  const buffers = bounds.map(bound => Buffer.alloc((bound.x1 - bound.x0 + 1) * (bound.y1 - bound.y0 + 1) * 4));
  for (let at = 0; at < size; at++) {
    if (labels[at] < 0) continue;
    const frame = owner[labels[at]], bound = bounds[frame];
    const offset = ((Math.floor(at / info.width) - bound.y0) * (bound.x1 - bound.x0 + 1) + at % info.width - bound.x0) * 4;
    data.copy(buffers[frame], offset, at * 4, at * 4 + 4);
  }
  const edgePixels = { top: 0, bottom: 0, left: 0, right: 0 };
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] < 24) continue;
    if (y === 0) edgePixels.top++;
    if (y === info.height - 1) edgePixels.bottom++;
    if (x === 0) edgePixels.left++;
    if (x === info.width - 1) edgePixels.right++;
  }
  if (Object.values(edgePixels).some(Boolean)) throw new Error(`Native canvas clips a pose: ${file}`);
  return { file, sha256: hash(bytes), width: info.width, height: info.height, edgePixels,
    frames: bounds.map((bound, i) => ({ raw: buffers[i], width: bound.x1 - bound.x0 + 1, height: bound.y1 - bound.y0 + 1,
      sourceImage: file, nativeRow: Math.floor(i / 4), nativeColumn: i % 4,
      sourceRect: { x: bound.x0, y: bound.y0, width: bound.x1 - bound.x0 + 1, height: bound.y1 - bound.y0 + 1 } })) };
}


const result={};
for(const hero of ['neo','freeman']){
 const calls=JSON.parse(await fs.readFile(`docs/combat-fidelity-wave10-2026-10-23/${hero}-sources/actual-tool-calls.json`));
 for(const call of calls){if(!call.savedSource)continue;let s;try{s=await segmentSource(call.savedSource,call.observedRows)}catch(error){result[call.id]={image:call.savedSource,error:String(error)};continue;}result[call.id]={image:call.savedSource,width:s.width,height:s.height,edgePixels:s.edgePixels,frames:s.frames.map(f=>({row:f.nativeRow,column:f.nativeColumn,rect:f.sourceRect}))};}
}
await fs.writeFile('docs/combat-fidelity-wave10-2026-10-23/melee-tooling/source-segmentation-review.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(Object.fromEntries(Object.entries(result).map(([k,v])=>[k,{width:v.width,height:v.height,frames:v.frames?.length,error:v.error}]))));
