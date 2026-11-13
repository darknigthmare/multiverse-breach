#!/usr/bin/env python3
"""Deterministic atlas packing; no painting, flipped or synthesized poses."""
from pathlib import Path
import hashlib
import json
from PIL import Image, __version__ as pillow_version

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[4]
SOURCE = HERE / 'generation/imp-classic.raw.png'
OUTPUT = ROOT / 'DLC/Doom/assets/sprites/generated/bosses/doom/imp-fireballer.png'
CELL_W, CELL_H = 384, 256
BASELINE = 232
SCALE = 0.95
EDGES_X = [0, 384, 768, 1152, 1536]
EDGES_Y = [0, 256, 512, 768, 1024]

def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

def main():
    source = Image.open(SOURCE).convert('RGBA')
    assert source.size == (1536, 1024)
    source.putalpha(source.getchannel('A').point(lambda a: 0 if a <= 8 else 255 if a >= 248 else a))
    atlas = Image.new('RGBA', (CELL_W*4, CELL_H*4))
    frames = []
    previews = []
    for i in range(16):
        row, col = divmod(i, 4)
        rect = [EDGES_X[col], EDGES_Y[row], EDGES_X[col+1], EDGES_Y[row+1]]
        frame = source.crop(rect)
        mask = frame.getchannel('A').point(lambda a: 255 if a >= 64 else 0)
        bbox = mask.getbbox()
        assert bbox and min(bbox[0], bbox[1], frame.width-bbox[2], frame.height-bbox[3]) >= 3, (i, bbox)
        # Both feet, including a raised foot, determine one root during a stride.
        feet = mask.crop((0, max(bbox[1], bbox[3]-80), frame.width, bbox[3])).getbbox()
        assert feet
        pivot = (feet[0]+feet[2])/2
        resized = frame.resize(tuple(round(n*SCALE) for n in frame.size), Image.Resampling.NEAREST)
        offset = (round(CELL_W/2-pivot*SCALE), round(BASELINE-bbox[3]*SCALE))
        normalized = Image.new('RGBA', (CELL_W, CELL_H))
        normalized.alpha_composite(resized, offset)
        bounds = normalized.getchannel('A').point(lambda a: 255 if a >= 64 else 0).getbbox()
        assert bounds and min(bounds[0], bounds[1], CELL_W-bounds[2], CELL_H-bounds[3]) >= 4, (i, bounds)
        assert abs(bounds[3]-BASELINE) <= 1, (i, bounds)
        atlas.alpha_composite(normalized, (col*CELL_W, row*CELL_H))
        preview = Image.new('RGBA', normalized.size, '#283038')
        preview.alpha_composite(normalized)
        previews.append(preview.convert('RGB'))
        frames.append({'index': i, 'row': row, 'column': col, 'state': ['idle','run','attack','hit'][row],
                       'sourceRect': rect, 'sourceAlpha64Bounds': list(bbox), 'sourceBothFeetPivot': [pivot,bbox[3]],
                       'destinationOffset': list(offset), 'alpha64Bounds': list(bounds),
                       'rgbaSha256': hashlib.sha256(normalized.tobytes()).hexdigest()})
    assert len({f['rgbaSha256'] for f in frames}) == 16
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    atlas.save(OUTPUT, optimize=True)
    validation = HERE / 'validation'
    validation.mkdir(exist_ok=True)
    contact = Image.new('RGB', atlas.size, '#283038')
    for i, preview in enumerate(previews):
        row, col = divmod(i,4)
        contact.paste(preview,(col*CELL_W,row*CELL_H))
    for height in (68,96):
        contact.resize((round(height*CELL_W/CELL_H)*4,height*4),Image.Resampling.NEAREST).save(validation/f'imp-contact-{height}px.png')
    for row, state in enumerate(['idle','run','attack','hit']):
        gif = [image.resize((144,96),Image.Resampling.NEAREST) for image in previews[row*4:row*4+4]]
        gif[0].save(validation/f'imp-{state}.gif',save_all=True,append_images=gif[1:],duration=167,loop=0)
    report = {'schemaVersion':1,'status':'TECHNICAL_QA_PASSED_VISUAL_REVIEW_PENDING',
              'source':str(SOURCE.relative_to(ROOT)),'sourceSha256':sha(SOURCE),'sourceSize':list(source.size),
              'output':str(OUTPUT.relative_to(ROOT)),'outputSha256':sha(OUTPUT),'outputBytes':OUTPUT.stat().st_size,
              'size':list(atlas.size),'mode':atlas.mode,'alphaRange':list(atlas.getchannel('A').getextrema()),
              'columns':4,'rows':4,'frameCount':16,'uniqueRgbaFrames':16,'cellSize':[CELL_W,CELL_H],
              'wideCellReason':'The forward casting arm has room inside384x256cells at one shared scale. The existing renderer divides image width and height independently; no layout override is needed.',
              'sharedScale':SCALE,'baseline':BASELINE,'resampling':'nearest-neighbor','pillow':pillow_version,
              'alphaTreatment':'alpha<=8 becomes0; alpha>=248 becomes255; remaining alpha/RGB retained. No anatomy repainted.',
              'pivot':'Both feet lower80 source pixels midpoint. Uniform shared scale; no per-pose size normalization.',
              'frames':frames,'source1to1Verified':False,'canonicalAnimationTimingVerified':False,'inGameReviewPerformed':False}
    (validation/'imp-technical-qa.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps({k:report[k] for k in ['status','output','outputSha256','outputBytes','size','uniqueRgbaFrames']}))

if __name__ == '__main__':
    main()
