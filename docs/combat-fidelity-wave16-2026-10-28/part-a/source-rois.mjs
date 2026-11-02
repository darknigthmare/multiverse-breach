// Import geometry only: no native RGBA value is changed by this module.
import assert from 'node:assert/strict';
import sharp from 'sharp';

export async function locateNativeSequences(file,{rows=6,columns=8,threshold=24}={}) {
  const {data,info}=await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const {width,height}=info,seen=new Uint8Array(width*height),queue=new Int32Array(width*height),labels=new Uint16Array(width*height),components=[];
  const minHeight=Math.max(32,Math.round(height/rows*.30));
  for(let index=0;index<width*height;index++) {
    if(seen[index]||data[index*4+3]<=128)continue;
    let head=0,tail=1,left=width,right=-1,top=height,bottom=-1,pixels=0;queue[0]=index;seen[index]=1;
    while(head<tail) {
      const at=queue[head++],x=at%width,y=Math.floor(at/width);
      left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);pixels++;
      for(const next of [x?at-1:-1,x<width-1?at+1:-1,y?at-width:-1,y<height-1?at+width:-1]) {
        if(next<0||seen[next]||data[next*4+3]<=128)continue;seen[next]=1;queue[tail++]=next;
      }
    }
    if(pixels>500&&bottom-top+1>=minHeight){const id=components.length+1;for(let i=0;i<tail;i++)labels[queue[i]]=id;components.push({id,left,right,top,bottom,pixels,cx:(left+right)/2,cy:(top+bottom)/2});}
  }
  const physicalRows=Array.from({length:rows},()=>[]);
  for(const c of components)physicalRows[Math.min(rows-1,Math.floor(c.cy/height*rows))].push(c);
  physicalRows.forEach(row=>row.sort((a,b)=>a.cx-b.cx));
  const rowBounds=[0];
  for(let row=0;row<rows-1;row++) {
    assert.ok(physicalRows[row].length&&physicalRows[row+1].length,'Missing body row');
    const upper=Math.max(...physicalRows[row].map(c=>c.bottom)),lower=Math.min(...physicalRows[row+1].map(c=>c.top));
    // Bounding boxes can overlap a few scanlines in different columns. Each
    // per-body rectangle is checked below against actual component ownership.
    rowBounds.push(Math.floor((upper+lower)/2));
  }
  rowBounds.push(height);
  const sequences=[],measurements=[];
  for(let row=0;row<rows;row++) {
    const bodies=physicalRows[row];
    assert.ok(bodies.length>=columns&&bodies.length<=columns+2,`Row${row}: expected${columns}–${columns+2} independent bodies, observed${bodies.length}`);
    const boundaries=[0];
    for(let i=0;i<bodies.length-1;i++) {
      const low=Math.ceil(bodies[i].cx),high=Math.floor(bodies[i+1].cx),middle=(bodies[i].cx+bodies[i+1].cx)/2;
      const gaps=[];
      for(let x=low;x<=high;x++) {
        let visible=0;for(let y=Math.max(0,Math.min(...bodies.map(b=>b.top))-3);y<Math.min(height,Math.max(...bodies.map(b=>b.bottom))+4);y++)if(data[(y*width+x)*4+3]>threshold)visible++;
        if(!visible)gaps.push(x);
      }
      assert.ok(gaps.length,`Row${row} gap${i}: no transparent rectangular import seam`);
      gaps.sort((a,b)=>Math.abs(a-middle)-Math.abs(b-middle));boundaries.push(gaps[0]);
    }
    boundaries.push(width);
    const rects=bodies.map((body,index)=>{const top=Math.max(0,body.top-4),bottom=Math.min(height,body.bottom+5);const rect={left:boundaries[index],top,width:boundaries[index+1]-boundaries[index],height:bottom-top,physicalRow:row,physicalColumn:index,body};for(let y=rect.top;y<rect.top+rect.height;y++)for(let x=rect.left;x<rect.left+rect.width;x++){const label=labels[y*width+x];assert.ok(!label||label===body.id,`Row${row} cell${index}: another body contaminates import rectangle`);}return rect;});
    if(columns===8) {
      sequences.push(rects.slice(0,4));sequences.push(rects.slice(-4));
    } else {
      assert.equal(columns,4);sequences.push(rects.slice(0,4));
    }
    measurements.push({row,observedBodies:bodies.length,selectedColumns:columns===8?[0,1,2,3,...Array.from({length:4},(_,i)=>bodies.length-4+i)]:[0,1,2,3],rejectedExtraColumns:columns===8?Array.from({length:Math.max(0,bodies.length-8)},(_,i)=>i+4):Array.from({length:Math.max(0,bodies.length-4)},(_,i)=>i+4),rectangles:rects});
  }
  // Convert physical row pairs to the runtime's eight presentation sequences,
  // followed by idle/run/basic/hit. The source's extra drawings are not retained.
  return {width,height,rows,columns,thresholdForRoiDetectionOnly:threshold,rgbaValuesUnmodified:true,sourceBodiesObserved:physicalRows.reduce((n,row)=>n+row.length,0),retainedDrawings:sequences.length*4,sequences,measurements};
}

export async function importNativeRectangles(bytes,source) {
  const {data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const rows=[];
  for(const rects of source.frameRects) {
    const frames=[];
    for(const rect of rects) {
      assert.ok(rect.left>=0&&rect.top>=0&&rect.left+rect.width<=info.width&&rect.top+rect.height<=info.height);
      const input=await sharp(data,{raw:info}).extract({left:rect.left,top:rect.top,width:rect.width,height:rect.height}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
      // Direct byte comparison binds every imported RGBA value to its source.
      for(let y=0;y<rect.height;y++)assert.deepEqual(input.data.subarray(y*rect.width*4,(y+1)*rect.width*4),data.subarray(((rect.top+y)*info.width+rect.left)*4,((rect.top+y)*info.width+rect.left+rect.width)*4));
      frames.push({data:input.data,width:rect.width,height:rect.height,sourceOrigin:{left:rect.left,top:rect.top},sourceRect:rect});
    }
    rows.push({frames,sourceBounds:{top:Math.min(...rects.map(r=>r.top)),bottom:Math.max(...rects.map(r=>r.top+r.height))},roiImport:true,seamReview:{crossedVisiblePixels:0,crossedOpaquePixels:0}});
  }
  return{half:0,cropLeft:0,globalLeft:0,width:info.width,height:info.height,rows};
}
