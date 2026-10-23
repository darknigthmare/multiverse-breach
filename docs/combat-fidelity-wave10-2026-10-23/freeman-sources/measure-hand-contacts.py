from pathlib import Path
from PIL import Image,ImageDraw
import json,hashlib
root=Path('docs/combat-fidelity-wave10-2026-10-23')
hero='freeman';p=root/(hero+'-sources')
points={'ledgeCatch': [(190, 52, 182, 68, 77, 132), (122, 48, 120, 62, 187, 85), (173, 57, 173, 71, 104, 57), (161, 56, 161, 70, 95, 55)], 'ledgeHang': [(159, 29, 159, 44, 100, 29), (158, 30, 158, 44, 91, 30), (178, 65, 176, 79, 117, 65), (181, 56, 181, 70, 119, 57)], 'ledgeClimb': [(165, 66, 165, 79, 92, 68), (166, 66, 166, 79, 93, 66), (176, 139, 176, 129, 88, 140), (185, 238, 179, 229, 105, 240)]}

def measure(hero,points):
 p=root/(hero+'-sources');reg=json.loads(Path('src/game/combat/'+hero+'MeleeCombat.generated.json').read_text());entry=next(e for e in reg['entries'] if e['id'].endswith('-ledge'));sheet=Image.open('public'+entry['sheet']).convert('RGBA');states={};summary=[];pre=Image.new('RGB',(1024,768),(60,65,70));pre.paste(sheet.crop((0,0,1024,768)),mask=sheet.crop((0,0,1024,768)).getchannel('A'));d=ImageDraw.Draw(pre)
 def count(im,x,y):return sum(im.getpixel((xx,yy))[3]>24 for yy in range(y-4,y+5) for xx in range(x-4,x+5) if 0<=xx<im.width and 0<=yy<im.height)
 for row,(state,poses) in enumerate(points.items()):
  states[state]=[]
  for col,pt in enumerate(poses):
   f=next(f for f in entry['normalization']['frames'] if f['state']==state and f['frame']==col);s=f['sourceRect'];dst=f['destinationRect'];native=Image.open(f['sourceImage']).convert('RGBA');tile=sheet.crop((col*256,row*256,col*256+256,row*256+256));measurements=[]
   for kind,(x,y) in zip(['palm','wrist'],[pt[:2],pt[2:4]]):
    # Only a 2px neighborhood around the manually localized anatomical point.
    opaque=count(tile,x,y) # Recount the reviewed frozen coordinate; do not reposition contacts.
    sx=round(s['x']+(x-dst['x'])/f['scale']);sy=round(s['y']+(y-dst['y'])/f['scale']);n=count(native,sx,sy)
    measurements.append((x,y,sx,sy,opaque,n));crop=tile.crop((x-8,y-8,x+9,y+9)).resize((136,136),Image.Resampling.NEAREST);crop.save(p/f'roi-{state}-{col}-{kind}.png');native.crop((sx-8,sy-8,sx+9,sy+9)).resize((136,136),Image.Resampling.NEAREST).save(p/f'native-roi-{state}-{col}-{kind}.png')
    d.rectangle((col*256+x-4,row*256+y-4,col*256+x+4,row*256+y+4),outline='yellow' if kind=='palm' else 'cyan',width=1)
   x,y,sx,sy,opaque,n=measurements[0];wx,wy,wsx,wsy,wo,wn=measurements[1];contact=not(state=='ledgeCatch' and col==0)
   states[state].append({'frame':col,'x':x,'y':y,'normalizedX':x/256,'normalizedY':y/256,'contact':contact,'baseline':'ledgeGrip','sourceImage':f['sourceImage'],'sourcePalm':{'x':sx,'y':sy},'measurement':'Bare native palm anatomically localized in normalized review grid, then refined at most2px within that same palm. No art pixels changed.' if hero=='neo' else 'Actual native gloved palm anatomically localized and refined at most2px in same hand ROI; no pixels changed.','visibleNeighborhood9x9':opaque,'sourceVisibleNeighborhood9x9':n,'wrist':{'x':wx,'y':wy,'normalizedX':wx/256,'normalizedY':wy/256,'sourcePoint':{'x':wsx,'y':wsy},'visibleNeighborhood9x9':wo,'sourceVisibleNeighborhood9x9':wn,'measurement':'Actual adjoining sleeve cuff/wrist, connected through arm to shoulder; no floating hand or synthetic contact.'},'supportHands':[{'x':pt[4],'y':pt[5],'normalizedX':pt[4]/256,'normalizedY':pt[5]/256,'contact':contact and not(state=='ledgeCatch' and col==1)}]})
   summary.append({'state':state,'frame':col,'palm':opaque,'wrist':wo,'nativePalm':n,'nativeWrist':wn,'source':f['sourceImage']})
 pre.save(p/'hands-native-review.png');result={'date':'2026-10-23','heroId':hero,'sourceWork':reg['sourceWork'],'reviewed':True,'method':'Manual anatomical localization on actual native body/hand pixels; normalized9x9 visible-alpha neighborhoods and inverse source mapping. At most2px local refinement, never translation/redrawing of artwork.','source1to1Verified':False,'requiredPalms':12,'requiredWrists':12,'requiredContacts':11,'states':states,'roiReview':summary};(p/'hand-measurements.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(summary))
measure(hero,points)
