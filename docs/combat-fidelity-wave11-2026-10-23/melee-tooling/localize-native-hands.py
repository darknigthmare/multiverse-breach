from pathlib import Path
from PIL import Image,ImageDraw
import numpy as np,json
base=Path('/workspace/multiverse-breach/docs/combat-fidelity-wave11-2026-10-23')
pts={
'buffy':{'ledgeCatch':[((255,40),(249,54)),((478,32),(476,50)),((747,30),(747,47)),((1054,34),(1055,51))],'ledgeHang':[((166,354),(167,372)),((468,355),(469,372)),((736,356),(738,374)),((1023,354),(1025,372))],'ledgeClimb':[((179,650),(181,667)),((430,653),(420,670)),((783,805),(767,790)),((1049,815),(1043,798))]},
'arthur':{'ledgeCatch':[((291,32),(275,53)),((540,43),(528,62)),((791,41),(793,59)),((1054,51),(1056,70))],'ledgeHang':[((194,343),(195,362)),((483,345),(484,365)),((768,345),(771,366)),((1034,345),(1037,364))],'ledgeClimb':[((187,641),(190,659)),((473,640),(479,659)),((788,826),(775,809)),((1067,825),(1056,812))]}}
for h,states in pts.items():
 im=Image.open(base/(h+'-sources')/(h+'-ledge.native.png'));a=np.array(im);proof=Image.new('RGB',(6*180,4*220),'#333333');out=[]
 for n,(state,col,pair)in enumerate((s,c,p)for s,ps in states.items()for c,p in enumerate(ps)):
  crop=Image.new('RGB',(180,220),'#333333');dr=ImageDraw.Draw(crop);dr.text((4,2),state+str(col),fill='white')
  rec={'state':state,'column':col}
  for j,(label,(x,y))in enumerate(zip(['palm','wrist'],pair)):
   roi=im.crop((x-20,y-20,x+21,y+21)).convert('RGBA');bg=Image.new('RGBA',roi.size,'#777777');bg.alpha_composite(roi);rgb=bg.convert('RGB').resize((164,164),Image.Resampling.NEAREST);dd=ImageDraw.Draw(rgb);dd.rectangle((64,64,99,99),outline='cyan',width=1);tile=Image.new('RGB',(180,220),'#333333');tile.paste(rgb,(8,30));ImageDraw.Draw(tile).text((4,3),f'{state}{col} {label}',fill='white');count=int((a[y-4:y+5,x-4:x+5,3]>24).sum());ImageDraw.Draw(tile).text((4,200),f'{x},{y} alpha>24:{count}',fill='white');i=n*2+j;proof.paste(tile,((i%6)*180,(i//6)*220));rec[label]={'x':x,'y':y,'alphaAbove24':count}
  out.append(rec)
 proof.save(base/(h+'-sources')/'native-hand-localization.png');(base/(h+'-sources')/'native-hand-points.json').write_text(json.dumps(out,indent=2)+'\n');print(h,[(o['state'],o['column'],o['palm']['alphaAbove24'],o['wrist']['alphaAbove24'])for o in out])
