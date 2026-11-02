// Native sprite import. Seams select source pixels; they never recolor or
// synthesize a pixel. Alpha<=24 is used only to route the import boundaries.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const sha=b=>createHash('sha256').update(b).digest('hex');

function seam(length,low,high,preferred,alphaAt) {
  low=Math.ceil(low);high=Math.floor(high);assert.ok(high>=low);
  const span=high-low+1,parents=Array.from({length},()=>new Int16Array(span));
  const cost=(step,value)=>{const a=alphaAt(step,value);return (a>24?1e12:a*a)+(value-preferred)**2*.0035;};
  let prev=Float64Array.from({length:span},(_,i)=>cost(0,low+i));
  for(let step=1;step<length;step++) {
    const next=new Float64Array(span);
    for(let value=0;value<span;value++) {
      let best=Infinity,at=value;
      for(let delta=-1;delta<=1;delta++) {const p=value+delta;if(p<0||p>=span)continue;const c=prev[p]+Math.abs(delta)*1.5;if(c<best){best=c;at=p;}}
      next[value]=best+cost(step,low+value);parents[step][value]=at;
    }
    prev=next;
  }
  let at=0;for(let i=1;i<span;i++)if(prev[i]<prev[at])at=i;
  const result=new Int32Array(length);
  for(let step=length-1;step>=0;step--){result[step]=low+at;at=parents[step][at];}
  const crossedVisiblePixels=[...result].filter((v,i)=>alphaAt(i,v)>24).length;
  assert.equal(crossedVisiblePixels,0,'Import seam would cross visible native artwork '+JSON.stringify({low,high,preferred,points:[...result].flatMap((v,i)=>alphaAt(i,v)>24?[{i,v,a:alphaAt(i,v)}]:[])}));
  return{path:[...result],sha256:sha(Buffer.from(result.buffer)),crossedVisiblePixels};
}

export function bodyComponents(data,width,height,rows) {
  const seen=new Uint8Array(width*height),queue=new Int32Array(width*height),labels=new Uint16Array(width*height),bodies=[];
  for(let start=0;start<width*height;start++) {
    if(seen[start]||data[start*4+3]<=128)continue;
    let head=0,tail=1,left=width,right=-1,top=height,bottom=-1,pixels=0;queue[0]=start;seen[start]=1;
    while(head<tail) {
      const at=queue[head++],x=at%width,y=Math.floor(at/width);left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);pixels++;
      for(const next of [x?at-1:-1,x<width-1?at+1:-1,y?at-width:-1,y<height-1?at+width:-1]) {if(next<0||seen[next]||data[next*4+3]<=128)continue;seen[next]=1;queue[tail++]=next;}
    }
    if(pixels>500&&bottom-top+1>=Math.max(32,height/rows*.30)) {const id=bodies.length+1;for(let i=0;i<tail;i++)labels[queue[i]]=id;bodies.push({id,left,right,top,bottom,pixels,cx:(left+right)/2,cy:(top+bottom)/2});}
  }
  const groups=Array.from({length:rows},()=>[]);
  for(const body of bodies)groups[Math.min(rows-1,Math.floor(body.cy/height*rows))].push(body);
  groups.forEach(group=>group.sort((a,b)=>a.cx-b.cx));
  return{groups,labels};
}

export async function locateNativeRegions(file,{rows=6,columns=8,groupComponentsByGrid=false}={}) {
  const bytes=await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const {data,info}=bytes,{width,height}=info,detected=bodyComponents(data,width,height,rows),labels=detected.labels;
  const sourceComponentsObserved=detected.groups.reduce((n,g)=>n+g.length,0);
  let groups=detected.groups;
  // A disconnected feather or an explicitly drawn astral apparition is part
  // of its source pose cell, not another independently usable animation pose.
  // This optional grouping changes ownership labels only; source RGBA is never
  // modified and the same zero-visible-crossing/complete-ownership checks run.
  if(groupComponentsByGrid){
    const remap=new Map();let nextId=1;
    groups=groups.map((row,rowIndex)=>{
      const bins=Array.from({length:columns},()=>[]);
      for(const c of row)bins[Math.min(columns-1,Math.floor(c.cx/width*columns))].push(c);
      assert.ok(bins.every(b=>b.length>0&&b.length<=3),'Grid grouping requires every pose cell and at most3 connected components');
      return bins.map((members,column)=>{const id=nextId++,left=Math.min(...members.map(c=>c.left)),right=Math.max(...members.map(c=>c.right)),top=Math.min(...members.map(c=>c.top)),bottom=Math.max(...members.map(c=>c.bottom));for(const c of members)remap.set(c.id,id);return{id,left,right,top,bottom,pixels:members.reduce((n,c)=>n+c.pixels,0),cx:(left+right)/2,cy:(top+bottom)/2,componentMembers:members,sourcePoseCell:{row:rowIndex,column}};});
    });
    for(let i=0;i<labels.length;i++)if(labels[i])labels[i]=remap.get(labels[i]);
  }
  const rowSeams=[];
  for(let row=0;row<rows-1;row++) {
    assert.ok(groups[row].length&&groups[row+1].length,'Missing physical body row');
    const above=Math.max(...groups[row].map(b=>b.bottom)),below=Math.min(...groups[row+1].map(b=>b.top)),preferred=(above+below)/2,radius=height/rows*.34;
    rowSeams.push(seam(width,Math.max(1,preferred-radius),Math.min(height-2,preferred+radius),preferred,(x,y)=>data[(y*width+x)*4+3]));
  }
  const sequences=[],measurements=[],slotToSequence={},missingSlots=[],missingGroups=[];
  for(let row=0;row<rows;row++) {
    const bodies=groups[row];assert.ok(bodies.length>=4&&bodies.length<=10,`Row${row}: expected4–10 independently connected bodies; observed${bodies.length}`);
    const top=row?Math.min(...rowSeams[row-1].path):0,bottom=row<rows-1?Math.max(...rowSeams[row].path)+1:height,rowHeight=bottom-top;
    const rowOwns=(x,y)=>(!row||y>=rowSeams[row-1].path[x])&&(row===rows-1||y<rowSeams[row].path[x]);
    const columnSeams=[];
    for(let col=0;col<bodies.length-1;col++) {
      const preferred=(bodies[col].cx+bodies[col+1].cx)/2;
      columnSeams.push(seam(rowHeight,Math.max(1,bodies[col].cx+3),Math.min(width-2,bodies[col+1].cx-3),preferred,(dy,x)=>rowOwns(x,top+dy)?data[((top+dy)*width+x)*4+3]:0));
    }
    const regions=bodies.map((body,col)=>{
      const left=col?Math.min(...columnSeams[col-1].path):0,right=col<bodies.length-1?Math.max(...columnSeams[col].path)+1:width;
      const region={left,top,width:right-left,height:rowHeight,physicalRow:row,physicalColumn:col,body,upper:row?rowSeams[row-1]:null,lower:row<rows-1?rowSeams[row]:null,leftSeam:col?columnSeams[col-1]:null,rightSeam:col<bodies.length-1?columnSeams[col]:null};
      let ownBodyPixels=0;
      for(let dy=0;dy<rowHeight;dy++)for(let x=col?columnSeams[col-1].path[dy]:0;x<(col<bodies.length-1?columnSeams[col].path[dy]:width);x++) {
        const y=top+dy;if(!rowOwns(x,y))continue;const label=labels[y*width+x];assert.ok(!label||label===body.id,`Row${row} col${col}: region contains another native body`);if(label===body.id)ownBodyPixels++;
      }
      assert.equal(ownBodyPixels,body.pixels,'Import region would cut native body pixels');
      return region;
    });
    const phaseGroups=columns===8?[regions.filter(r=>r.body.cx<width/2),regions.filter(r=>r.body.cx>=width/2)]:[regions];
    const selected=[];
    for(const[half,group]of phaseGroups.entries()) {
      const slot=columns===8?row*2+half:row;
      if(group.length!==4){missingSlots.push({slot,physicalRow:row,half,observedBodies:group.length,reason:'Exactly four independent source drawings required; no incomplete sequence counted.'});missingGroups.push({slot,regions:group});continue;}
      slotToSequence[slot]=sequences.length;sequences.push(group);selected.push(...group);
    }
    measurements.push({row,observedBodies:bodies.length,selectedColumns:selected.map(r=>r.physicalColumn),excludedColumns:regions.filter(r=>!selected.includes(r)).map(r=>r.physicalColumn),rowSeamCrossedVisiblePixels:0,columnSeamCrossedVisiblePixels:0});
  }
  return{width,height,rows,columns,alphaThresholdForBoundaryDetectionOnly:24,originalRgbaRetained:true,rowSeams,sourceComponentsObserved,componentGrouping:groupComponentsByGrid?'same-declared-grid-pose-cell; original RGBA unchanged':null,sourceBodiesObserved:groups.reduce((n,g)=>n+g.length,0),retainedDrawings:sequences.length*4,sequences,slotToSequence,missingSlots,missingGroups,measurements};
}

export async function importNativeRegions(bytes,source) {
  const {data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true}),rows=[];
  for(const regions of source.frameRegions) {
    const frames=[];
    for(const region of regions) {
      const {left,top,width,height}=region,out=Buffer.alloc(width*height*4);let retained=0;
      for(let y=top;y<top+height;y++)for(let x=left;x<left+width;x++) {
        const dy=y-top;
        if(region.upper&&y<region.upper.path[x]||region.lower&&y>=region.lower.path[x]||region.leftSeam&&x<region.leftSeam.path[dy]||region.rightSeam&&x>=region.rightSeam.path[dy])continue;
        const from=(y*info.width+x)*4,to=((y-top)*width+x-left)*4;
        data.copy(out,to,from,from+4);assert.deepEqual(out.subarray(to,to+4),data.subarray(from,from+4));retained++;
      }
      frames.push({data:out,width,height,sourceOrigin:{left,top},sourceRegion:region,retainedPixelCount:retained,originalRgbaComparisonPassed:true});
    }
    rows.push({frames,sourceBounds:{top:Math.min(...regions.map(r=>r.top)),bottom:Math.max(...regions.map(r=>r.top+r.height))},seamReview:{crossedVisiblePixels:0,crossedOpaquePixels:0},nativeRegionImport:true});
  }
  return{half:0,cropLeft:0,globalLeft:0,width:info.width,height:info.height,rows};
}
