import assert from'node:assert/strict';import fs from'node:fs';import{createHash}from'node:crypto';import sharp from'sharp';
const dir='docs/combat-fidelity-wave10-2026-10-23',file=dir+'/summon-generation-records.json',j=JSON.parse(fs.readFileSync(file)),reg=JSON.parse(fs.readFileSync('src/game/combat/summonAnimationsWave10.generated.json'));
const selections={
 trinity:{preparation:[null,[327,106],[319,91],[313,95]],attack:[[301,99],[302,98],[307,101],null]},
 tealc:{preparation:[null,[350,118],[337,96],[339,98]],attack:[[361,105],[325,105],[321,105],null]},
 alyx:{preparation:[null,[317,114],[325,101],[314,99]],attack:[[310,102],[311,106],[325,107],null]},
 nick:{preparation:[null,null,[326,106],[298,105]],attack:[[328,110],[314,108],[320,110],null]},
 hicks:{preparation:[null,[335,101],[333,102],[333,102]],attack:[[313,106],[317,104],[315,106],null]},
 chains:{preparation:[null,[340,128],[349,118],[335,114]],attack:[[327,112],[321,113],[330,116],null]}
};
const measurements=[];fs.mkdirSync(dir+'/summon-anchor-proofs',{recursive:true});
for(const record of j.records){
 const selected=selections[record.slug];if(!selected){record.effectAnchors=null;continue;}
 const e=reg.entries.find(e=>e.id===record.id);assert.ok(e);const{data,info}=await sharp('public'+e.sheet).ensureAlpha().raw().toBuffer({resolveWithObject:true});record.effectAnchors={arrival:[null,null,null,null],preparation:[],attack:[],recovery:[null,null,null,null]};const crops=[];
 for(const[phase,coords]of Object.entries(selected))for(let col=0;col<4;col++){
  const near=coords[col];if(!near){record.effectAnchors[phase][col]=null;continue;}
  const row=e.phases[phase].row;let points=[];
  // A human-selected barrel ROI bounds this search. It cannot choose an eye,
  // hand, torso or unrelated object. Select the forward dark material edge.
  for(let dy=-4;dy<=4;dy++)for(let dx=-7;dx<=7;dx++){
   const x=near[0]+dx,y=near[1]+dy,at=((row*256+y)*info.width+col*512+x)*4,[r,g,b,a]=data.subarray(at,at+4);
   if(a>180&&Math.max(r,g,b)<165&&Math.max(r,g,b)-Math.min(r,g,b)<125)points.push({x,y});
  }
  assert.ok(points.length>=3,`${record.slug}/${phase}/${col}: no physical barrel pixels`);
  const x=Math.max(...points.map(p=>p.x)),edge=points.filter(p=>p.x===x).sort((a,b)=>a.y-b.y),y=edge[Math.floor(edge.length/2)].y,p=record.slug==='nick'&&phase==='attack'&&col===2?{x:325,y:108}:{x,y};
  record.effectAnchors[phase][col]=p;const px=p.x,py=p.y;const rgba=Buffer.alloc(9*9*4);let visible=0,metal=0,k=0;
  for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){
   const at=((row*256+py+dy)*info.width+col*512+px+dx)*4,[r,g,b,a]=data.subarray(at,at+4);data.copy(rgba,k++*4,at,at+4);
   if(a>24)visible++;if(a>180&&Math.max(r,g,b)<165)metal++;
  }
  assert.ok(visible>=7&&metal>=3,`${record.slug}/${phase}/${col}: barrel proof empty`);
  const crop=await sharp('public'+e.sheet).extract({left:col*512+px-18,top:row*256+py-18,width:37,height:37}).resize(148,148,{kernel:'nearest'}).png().toBuffer();
  const cross=Buffer.from('<svg width="148" height="148"><path d="M74 0v148M0 74h148" stroke="#55edbd" stroke-opacity=".55"/></svg>');
  crops.push({input:await sharp(crop).composite([{input:cross}]).png().toBuffer(),left:col*160,top:phase==='preparation'?0:160});
  measurements.push({id:e.id,performerHeroId:e.performerHeroId,phase,column:col,point:p,manualPhysicalLipOverride:record.slug==='nick'&&phase==='attack'&&col===2,visuallySelectedBarrelROI:{center:{x:near[0],y:near[1]},radiusX:7,radiusY:4},visiblePixels:visible,physicalDarkMaterialPixels:metal,rgbaSha256:createHash('sha256').update(rgba).digest('hex'),sheet:e.sheet,sheetSha256:e.sha256,frameWidth:512,frameHeight:256,baseline:244});
 }
 await sharp({create:{width:640,height:320,channels:4,background:'#151b29'}}).composite(crops).png().toFile(`${dir}/summon-anchor-proofs/${e.id}.png`);
}
fs.writeFileSync(file,JSON.stringify(j,null,2)+'\n');fs.writeFileSync(dir+'/summon-anchor-review.json',JSON.stringify({date:'2026-10-23',measurements,method:'Visual selection of the physical barrel in each packed native cell, followed by a bounded dark-material edge measurement and9x9 RGBA proof. Inactive and recovery cells are null; PKE and Coach support have no muzzle.',source1to1Verified:false},null,2)+'\n');console.log({measuredAnchors:measurements.length,rosterGuns:Object.keys(selections).length,unarmedSupports:2});
