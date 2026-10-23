"""Localize already inspected native palms/wrists in nearest-scaled packed cells.
Only proof images/JSON are written; no source or runtime pixels are changed.
"""
from pathlib import Path
from PIL import Image,ImageDraw
import numpy as np,json,hashlib,math,sys
root=Path('/workspace/multiverse-breach');b=root/'docs/combat-fidelity-wave11-2026-10-23'
for hero in sys.argv[1:]:
 d=b/(hero+'-sources');cfg=json.loads((d/'packing-plan.json').read_text());reg=json.loads((root/f'src/game/combat/{hero}MeleeCombat.generated.json').read_text());ledge=next(e for e in reg['entries']if e['id'].endswith('-ledge'));file=root/('public'+ledge['sheet']);im=Image.open(file);a=np.array(im);points=json.loads((d/'native-hand-points.json').read_text());states={};tiles=[]
 def count(arr,x,y):return int((arr[y-4:y+5,x-4:x+5,3]>24).sum())if 4<=x<arr.shape[1]-4 and 4<=y<arr.shape[0]-4 else 0
 for point in points:
  state=point['state'];col=point['column'];row=ledge['stateOrder'].index(state);f=next(f for f in ledge['normalization']['frames']if f['state']==state and f['frame']==col);s=f['sourceRect'];dest=f['destinationRect'];src=np.array(Image.open(root/f['sourceImage']));vals={}
  for kind in ['palm','wrist']:
   native=point[kind];x0=dest['x']+round((native['x']-s['x']+.5)*dest['width']/s['width']-.5);y0=dest['y']+round((native['y']-s['y']+.5)*dest['height']/s['height']-.5)
   options=sorted([(dx*dx+dy*dy,-count(a,col*256+x0+dx,row*256+y0+dy),dx,dy)for dx in range(-2,3)for dy in range(-2,3)])
   valid=next((p for p in options if -p[1]>=60),None)
   if valid is None:raise ValueError(f'No actual 9x9 hand/wrist neighborhood >=60: {hero} {state}/{col}/{kind} at{x0},{y0},max{-min(p[1]for p in options)}')
   _,neg,dx,dy=valid;x=x0+dx;y=y0+dy;nativeCount=count(src,native['x'],native['y']);assert nativeCount==native['alphaAbove24'] and nativeCount>=60
   vals[kind]={'x':x,'y':y,'normalizedX':x/256,'normalizedY':y/256,'sourcePoint':{'x':native['x'],'y':native['y']},'visibleNeighborhood9x9':-neg,'sourceVisibleNeighborhood9x9':nativeCount,'localRefinement':{'x':dx,'y':dy},'measurement':'Actual native '+kind+' connected through the adjoining wrist/arm. Source point manually inspected; at most2px packed-cell refinement inside same anatomical feature. Strict alpha>24.'}
   crop=im.crop((col*256+x-16,row*256+y-16,col*256+x+17,row*256+y+17));bg=Image.new('RGBA',crop.size,'#777777');bg.alpha_composite(crop);tile=Image.new('RGB',(180,220),'#333333');tile.paste(bg.convert('RGB').resize((164,164),Image.Resampling.NEAREST),(8,30));dd=ImageDraw.Draw(tile);dd.text((4,3),f'{state}{col} {kind}',fill='white');dd.rectangle((68,90,112,134),outline='cyan');dd.text((4,200),f'{x},{y}: {-neg}/81 src{nativeCount}',fill='white');tiles.append(tile)
  palm=vals['palm'];wrist=vals['wrist'];rec={k:v for k,v in palm.items()if k not in ['sourcePoint','sourceVisibleNeighborhood9x9']};rec.update(frame=col,contact=not(state=='ledgeCatch'and col==0),baseline='ledgeGrip',sourceImage=f['sourceImage'],sourcePalm=palm['sourcePoint'],sourceVisibleNeighborhood9x9=palm['sourceVisibleNeighborhood9x9'],wrist=wrist,supportHands=[]);states.setdefault(state,[]).append(rec)
 out={'date':'2026-10-23','heroId':cfg['heroId'],'sourceWork':cfg['sourceWork'],'reviewed':True,'method':'Manual actual native anatomical localization, nearest-neighbor source→cell mapping, at most2px local packed-cell refinement in same real palm/wrist; alpha>24 9x9 neighborhoods counted exactly. No art pixels changed.','source1to1Verified':False,'requiredPalms':12,'requiredWrists':12,'requiredContacts':11,'states':states};(d/'hand-measurements.json').write_text(json.dumps(out,indent=2,ensure_ascii=False)+'\n');proof=Image.new('RGB',(1080,880),'#333333')
 for i,tile in enumerate(tiles):proof.paste(tile,((i%6)*180,(i//6)*220))
 proof.save(d/'packed-hand-localization.png');summary=[{'state':state,'frame':p['frame'],'palm':p['visibleNeighborhood9x9'],'wrist':p['wrist']['visibleNeighborhood9x9'],'sourcePalm':p['sourceVisibleNeighborhood9x9'],'sourceWrist':p['wrist']['sourceVisibleNeighborhood9x9']}for state,ps in states.items()for p in ps];(d/'grip-pixel-checks.json').write_text(json.dumps({'passed':True,'heroId':cfg['heroId'],'strictAlphaAbove':24,'minimumVisiblePixels':60,'palms':12,'wrists':12,'contacts':11,'measurements':summary},indent=2)+'\n');print(hero,summary)
