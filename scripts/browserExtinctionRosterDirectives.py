#!/usr/bin/env python3
"""Real FPS scene: source-backed profiles, real media and four optional directives.
Prepared ownership only. Native keyboard/pointer input, fixed semantic seeds and
virtual time; no writes to player position, health, enemies, objectives or endings.
Run with the existing city-extinction fixture (SSR/static/native CI Chromium).
"""
import argparse
import hashlib
import json
import math
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
from browserCityExtinction import check
from browserResidentViewmodels import prepare_fps_clock
from browserSceneServices import aim, state

MODES = {'extraction': ('Solo Extraction', 'Solo Extraction'),
         'last_signal': ('Dernier Signal', 'Last Signal'),
         'infestation': ('Infestation', 'Infestation'),
         'hunt': ('Chasse au Champion', 'Champion Hunt')}


def seed_for(name):
    value = 2166136261
    for byte in ('multiverse-fps-roster-directives-v1:' + name).encode():
        value = ((value ^ byte) * 16777619) & 0xffffffff
    return value


def read(page):
    current = state(page)
    extra = page.evaluate('''() => {const s=window.__sceneQA.state();
      const directive=s.fieldDirective?structuredClone(s.fieldDirective):null;
      if(directive)delete directive.runId;
      return {directive,directiveSummary:s.directiveSummary||null,
        ownerMatches:!s.fieldDirective||(s.fieldDirective.runId===s.runId&&s.fieldDirective.heroId===s.heroId),
        relay:s.relayOperation?{beacons:s.relayOperation.beacons}:null,relaySummary:s.relaySummary||null,
        personalKit:s.personalKit?{ammo:s.personalKit.weapon.ammo,reserveAmmo:s.personalKit.reserveAmmo}:null};}''')
    return {**current, **extra}


def load(page, args, lang):
    page.goto(f'{args.url}/scripts/fixtures/city-extinction.html?mode=fps&catalog=full&lang={lang}', wait_until='networkidle')
    page.wait_for_function('window.__sceneQA?.state()?.phase === "ready"')
    expect(page.locator('.extinction-panel select option')).to_have_count(1811)
    page.evaluate('document.fonts.ready')


def media_capture(context):
    context.add_init_script('''window.__fpsCatalogDraws=[];window.__fpsSchematicStrokes=[];window.__fpsAimStrokes=[];
      const nativeTimeout=setTimeout.bind(window),nativeClear=clearTimeout.bind(window);
      window.__fpsAfterNativeLayout=()=>new Promise((resolve,reject)=>{
        const roots=[...document.querySelectorAll('.fps-royale-canvas,.extinction-hud-dock .nexus-play-stats,.extinction-hud-dock .nexus-play-actions,.extinction-stowed-readout,.extinction-objective-strip')];
        const animations=[...new Set(roots.flatMap(el=>el.getAnimations({subtree:true})))]
          .filter(a=>a.playState==='running'&&Number.isFinite(a.effect?.getComputedTiming().endTime));
        const start=document.timeline.currentTime;let observer,done=false;
        const finish=(error,entries=[])=>{if(done)return;done=true;observer?.disconnect();nativeClear(timeout);
          if(error)reject(error);else resolve({awaitedAnimations:animations.length,
            properties:[...new Set(animations.map(a=>a.transitionProperty||a.animationName||'animation'))],
            nativeElapsedMs:document.timeline.currentTime-start,observedElements:entries.length});};
        const timeout=nativeTimeout(()=>finish(new Error('Native HUD layout did not settle')),5000);
        Promise.allSettled(animations.map(a=>a.finished)).then(()=>{
          if(done)return;if(!roots.length){finish(new Error('No HUD layout roots'));return;}
          observer=new ResizeObserver(entries=>finish(null,entries));
          for(const root of roots)observer.observe(root);
        }).catch(finish);
      });
      const proto=CanvasRenderingContext2D.prototype, paths=new WeakMap();
      const point=(ctx,x,y)=>{const m=ctx.getTransform();
        const points=paths.get(ctx)||[];points.push({x:m.a*x+m.c*y+m.e,y:m.b*x+m.d*y+m.f});paths.set(ctx,points);};
      const begin=proto.beginPath;proto.beginPath=function(){paths.set(this,[]);return begin.call(this);};
      for(const name of ['moveTo','lineTo','bezierCurveTo']){const method=proto[name];proto[name]=function(...args){
        if(this.canvas.classList.contains('fps-royale-canvas'))for(let i=0;i<args.length;i+=2)point(this,args[i],args[i+1]);
        return method.apply(this,args);};}
      const arc=proto.arc;proto.arc=function(x,y,r,start,end,ccw=false){
        if(this.canvas.classList.contains('fps-royale-canvas')){
          let length=end-start;if(ccw&&length>0)length-=Math.PI*2;if(!ccw&&length<0)length+=Math.PI*2;
          for(let i=0;i<=32;i++){const a=start+length*i/32;point(this,x+Math.cos(a)*r,y+Math.sin(a)*r);}}
        return arc.call(this,x,y,r,start,end,ccw);};
      const stroke=proto.stroke;proto.stroke=function(...args){
        if(this.canvas.classList.contains('fps-royale-canvas')&&String(this.strokeStyle).replace(/\\s/g,'')==='rgba(225,246,255,0.66)'){
          const points=paths.get(this)||[],m=this.getTransform(),pad=this.lineWidth*Math.max(Math.abs(m.a),Math.abs(m.d))/2;
          if(points.length)window.__fpsAimStrokes.push({at:performance.now(),cw:this.canvas.width,ch:this.canvas.height,
            left:Math.min(...points.map(p=>p.x))-pad,top:Math.min(...points.map(p=>p.y))-pad,
            right:Math.max(...points.map(p=>p.x))+pad,bottom:Math.max(...points.map(p=>p.y))+pad});
          if(window.__fpsAimStrokes.length>400)window.__fpsAimStrokes.splice(0,200);}
        if(this.canvas.classList.contains('fps-royale-canvas')&&String(this.strokeStyle).replace(/\\s/g,'')==='rgba(225,246,255,0.65)'){
          const points=paths.get(this)||[],m=this.getTransform(),pad=this.lineWidth*Math.max(Math.abs(m.a),Math.abs(m.d))/2;
          if(points.length)window.__fpsSchematicStrokes.push({at:performance.now(),cw:this.canvas.width,ch:this.canvas.height,
            left:Math.min(...points.map(p=>p.x))-pad,top:Math.min(...points.map(p=>p.y))-pad,
            right:Math.max(...points.map(p=>p.x))+pad,bottom:Math.max(...points.map(p=>p.y))+pad});
          if(window.__fpsSchematicStrokes.length>400)window.__fpsSchematicStrokes.splice(0,200);}
        return stroke.apply(this,args);};
      const draw=proto.drawImage;proto.drawImage=function(image,...args){
        if(this.canvas.classList.contains('fps-royale-canvas')&&typeof image?.src==='string'){
          const m=this.getTransform();
          window.__fpsCatalogDraws.push({src:image.src,args,at:performance.now(),matrix:[m.a,m.b,m.c,m.d,m.e,m.f],cw:this.canvas.width,ch:this.canvas.height});
          if(window.__fpsCatalogDraws.length>250)window.__fpsCatalogDraws.shift();
        } return draw.call(this,image,...args);
      };''')


def view_geometry(page, source, out, name):
    """Observe actual Canvas strokes/drawImage, independently of placement helpers."""
    geometry = page.evaluate('''source=>{
      const canvas=document.querySelector('.fps-royale-canvas'),r=canvas.getBoundingClientRect(),layout=window.__sceneQA.fpsViewLayout();
      const local=b=>({left:r.left+b.left*r.width/canvas.width,top:r.top+b.top*r.height/canvas.height,
        right:r.left+b.right*r.width/canvas.width,bottom:r.top+b.bottom*r.height/canvas.height});
      const union=boxes=>boxes.length?({left:Math.min(...boxes.map(b=>b.left)),top:Math.min(...boxes.map(b=>b.top)),
        right:Math.max(...boxes.map(b=>b.right)),bottom:Math.max(...boxes.map(b=>b.bottom))}):null;
      let actual=null,samples=0,drawnAt=null;
      if(source){const d=window.__fpsCatalogDraws.filter(d=>d.src.endsWith(source)&&d.args.length===8&&d.cw===canvas.width&&d.ch===canvas.height).at(-1);
        if(d){const [a,b,c,e,tx,ty]=d.matrix,[,,,,x,y,w,h]=d.args;
          actual=union([[x,y],[x+w,y],[x,y+h],[x+w,y+h]].map(([px,py])=>({left:a*px+c*py+tx,right:a*px+c*py+tx,top:b*px+e*py+ty,bottom:b*px+e*py+ty})));samples=1;drawnAt=d.at;}}
      else {const strokes=window.__fpsSchematicStrokes.filter(d=>d.cw===canvas.width&&d.ch===canvas.height),at=strokes.at(-1)?.at;
        const latest=strokes.filter(d=>d.at===at);actual=union(latest);samples=latest.length;drawnAt=at??null;}
      const rect=el=>{const b=el.getBoundingClientRect();return {left:b.left,top:b.top,right:b.right,bottom:b.bottom,width:b.width,height:b.height};};
      const hud=[...document.querySelectorAll('.extinction-hud-dock .nexus-play-stats,.extinction-hud-dock .nexus-play-actions,.extinction-stowed-readout,.extinction-objective-strip')]
        .filter(el=>el.getClientRects().length).map(el=>({kind:el.className,...rect(el)}));
      const reticle=local({left:canvas.width/2-18,top:canvas.height/2-18,right:canvas.width/2+18,bottom:canvas.height/2+18});
      const aimStrokes=window.__fpsAimStrokes.filter(d=>d.cw===canvas.width&&d.ch===canvas.height),aimAt=aimStrokes.at(-1)?.at;
      const latestAim=aimStrokes.filter(d=>d.at===aimAt),aimBounds=union(latestAim);
      const primary=document.querySelector('[data-primary-action]'),hint=primary?.querySelector('[data-fps-aim-hint]');
      const current=window.__sceneQA.state();
      const aimReadout=primary?{kind:primary.dataset.fpsAimKind,source:primary.dataset.fpsAimSource,
        state:primary.dataset.fpsAimState,target:primary.dataset.fpsAimTarget||null,command:primary.querySelector('span').innerText,
        hint:hint?.innerText,accessibleName:primary.getAttribute('aria-label'),title:primary.title,
        expectedKind:current.weapon.type==='pistol'?current.protocols.profile.actions.simple.kind:current.weapon.type,
        expectedSource:current.weapon.type==='pistol'?'personal':'pickup',button:rect(primary)}:null;
      const radar=window.__sceneQA.hudLayout().fpsRadar;
      const radarBox=local({left:radar.x-radar.radius,top:radar.y-radar.radius,right:radar.x+radar.radius,bottom:radar.y+radar.radius});
      const overlap=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
      const view=actual?local(actual):null;
      const buttons=[...document.querySelectorAll('.extinction-hud-dock button')].filter(el=>el.getClientRects().length)
        .map(el=>({label:el.getAttribute('aria-label')||el.innerText,visibleLabel:el.innerText,...rect(el)}));
      const heading=document.querySelector('.extinction-directive-heading');
      const fontSize=el=>parseFloat(getComputedStyle(el).fontSize),rootFontSize=fontSize(document.documentElement);
      const directiveTypography=heading?{rootFontSize,minimumFontSize:rootFontSize*.8,
        textScale:parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--game-text-scale'))||1,
        headingFontSize:fontSize(heading),titleFontSize:fontSize(heading.querySelector('.extinction-directive-title')),
        countFontSize:fontSize(heading.querySelector('.extinction-directive-count'))}:null;
      const placement=layout?.placement;
      return {view,samples,drawnAt,observedAt:performance.now(),cacheDrawn:!!layout&&Object.hasOwn(layout,'placement'),
        canvas:rect(canvas),canvasWidth:canvas.width,canvasHeight:canvas.height,
        placement:placement?{region:placement.region,...local({left:placement.x,top:placement.y,right:placement.x+placement.w,bottom:placement.y+placement.h})}:null,
        reserved:layout?{width:layout.width,height:layout.height,safeArea:layout.safeArea}:null,hud,reticle,radar:radarBox,
        aimReadout,aimDrawing:aimBounds?local(aimBounds):null,aimSamples:latestAim.length,aimDrawnAt:aimAt??null,
        viewOverlaps:view?[...hud,reticle,radarBox].filter(b=>overlap(view,b)):[],hudReticleOverlaps:hud.filter(b=>overlap(reticle,b)),
        minButtonWidth:Math.min(...buttons.map(b=>b.width)),minButtonHeight:Math.min(...buttons.map(b=>b.height)),buttons,
        intelButton:rect(document.querySelector('.extinction-intel-button')),directiveTypography,
        hasKit:!!document.querySelector('[data-personal-kit]'),hasField:!!document.querySelector('[data-field-weapon]'),
        hasMark:!!document.querySelector('[data-hunt-mark]')};
    }''', source)
    (out / f'{name}-geometry.json').write_text(json.dumps(geometry, indent=2, ensure_ascii=False))
    view = geometry['view']; check(view and geometry['samples'] > 0, 'no actual held view drawing')
    check(geometry['cacheDrawn'], 'measured HUD cache has not been redrawn')
    placement = geometry['placement']; check(placement and placement['region'] in ['lower', 'lateral'], 'held view has no measured region')
    # Size the reserved view consistently. A thin beam/contact stroke should
    # not be forced upward just to match a square sheet's painted width.
    check(placement['right'] - placement['left'] >= (64 if source else 80)
          and placement['bottom'] - placement['top'] >= (64 if source else 72), 'held view reduced below useful dimensions')
    check(view['right'] - view['left'] >= 8 and view['bottom'] - view['top'] >= 24, 'actual held drawing collapsed inside its envelope')
    check(view['left'] >= placement['left'] - 1 and view['right'] <= placement['right'] + 1
          and view['top'] >= placement['top'] - 1 and view['bottom'] <= placement['bottom'] + 1, 'actual draw escaped its reserved region')
    check(not geometry['viewOverlaps'], 'actual held view overlaps HUD, radar or reticle')
    reserved = geometry['reserved']; check(reserved and reserved['width'] == geometry['canvasWidth'] and reserved['height'] == geometry['canvasHeight'], 'cached layout did not follow canvas resize')
    c = geometry['canvas']; edge = reserved['safeArea']
    check(view['left'] >= c['left'] + edge - 1 and view['right'] <= c['right'] - edge + 1
          and view['bottom'] <= c['bottom'] - edge + 1, 'held view ignores chosen safe area')
    check(geometry['minButtonWidth'] >= 43.5 and geometry['minButtonHeight'] >= (43.5 if c['width'] <= 900 else 39.5), 'touch target shrunk below its usable size')
    if c['width'] >= 600 and c['height'] <= 500:
        check(geometry['intelButton']['width'] >= 43.5 and geometry['intelButton']['height'] >= 43.5, 'compact directive opener shrunk below its usable size')
    check(not geometry['hudReticleOverlaps'], 'HUD controls cover the central reticle')
    aim_drawing = geometry['aimDrawing']; reticle = geometry['reticle']; aim_readout = geometry['aimReadout']
    check(aim_drawing and geometry['aimSamples'] > 0, 'no actual action-specific reticle painted')
    check(aim_drawing['left'] >= reticle['left'] and aim_drawing['right'] <= reticle['right']
          and aim_drawing['top'] >= reticle['top'] and aim_drawing['bottom'] <= reticle['bottom'], 'actual reticle escaped its reserved area')
    check(aim_readout and aim_readout['kind'] == aim_readout['expectedKind'] and aim_readout['source'] == aim_readout['expectedSource'],
          'primary feedback does not follow the held kit or pickup')
    check(aim_readout['command'] and aim_readout['hint'] and aim_readout['accessibleName'] and aim_readout['title'],
          'primary feedback lost its visible command, hint or complete accessible description')
    if aim_readout['kind'] in ['dash', 'teleport']:
        check(aim_readout['command'] in ['BOUGER', 'MOVE'], 'movement is still presented as gunfire')
    typography = geometry['directiveTypography']
    if typography:
        check(min(typography[key] for key in ['headingFontSize', 'titleFontSize', 'countFontSize']) >= typography['minimumFontSize'] - .05,
              'directive title or count ignores the chosen readable text size')
    return geometry


def settle_presentation(page, source, out, name):
    """Native CSS/ResizeObserver and the controlled game RAF have separate clocks."""
    records = []; previous = None
    for _ in range(6):
        native = page.evaluate('window.__fpsAfterNativeLayout()')
        before = page.evaluate('performance.now()')
        page.clock.run_for(32)
        current = page.evaluate('''source=>{const canvas=document.querySelector('.fps-royale-canvas'),layout=window.__sceneQA.fpsViewLayout();
          const rects=[...document.querySelectorAll('.fps-royale-canvas,.extinction-hud-dock .nexus-play-stats,.extinction-hud-dock .nexus-play-actions,.extinction-stowed-readout,.extinction-objective-strip')]
            .map(el=>{const r=el.getBoundingClientRect();return [r.left,r.top,r.width,r.height];});
          const draws=source?window.__fpsCatalogDraws.filter(d=>d.src.endsWith(source)&&d.args.length===8):window.__fpsSchematicStrokes;
          const last=draws.filter(d=>d.cw===canvas.width&&d.ch===canvas.height).at(-1);
          return {rects,cacheDrawn:!!layout&&Object.hasOwn(layout,'placement'),hasRegion:!!layout?.placement,
            canvasMatches:layout?.width===canvas.width&&layout?.height===canvas.height,
            lastDrawAt:last?.at??null,observedAt:performance.now(),tick:window.__sceneQA.state().t};}''', source)
        records.append({'native': native, 'advanceFrom': before, **current})
        # A genuinely empty region must still reach view_geometry and fail there.
        # Never wait until an intersection happens to disappear.
        settled = current['cacheDrawn'] and current['canvasMatches'] and previous == current['rects']
        receipt = {'settled': settled, 'attempts': len(records), 'records': records}
        (out / f'{name}-presentation.json').write_text(json.dumps(receipt, indent=2, ensure_ascii=False))
        if settled:
            if current['hasRegion']:
                check(current['lastDrawAt'] is not None and current['lastDrawAt'] >= before, 'held view was not painted after its current layout')
            return receipt
        previous = current['rects']
    check(False, 'HUD cache and native layout did not stabilize within six render cycles')


def layout_variant(page, width, height, large, source, out, name):
    page.set_viewport_size({'width': width, 'height': height})
    page.evaluate('''large=>{const s=document.documentElement.style;
      s.setProperty('--game-hud-scale',large?'1.4':'1');s.setProperty('--game-text-scale',large?'1.5':'1');
      s.setProperty('--game-safe-area',large?'32px':'12px');window.dispatchEvent(new Event('multiverse:display-preferences'));}''', large)
    # Keep gameplay advancing naturally; this JS clock does not settle CSS.
    page.clock.run_for(256)
    settle_presentation(page, source, out, name)
    page.screenshot(path=str(out / f'{name}.png'))
    return view_geometry(page, source, out, name)


def directive_details_case(page, out, name):
    """The compact strip retains its complete current instruction in the modal."""
    expected = page.evaluate('''() => {const strip=document.querySelector('.extinction-objective-strip');
      const directive=strip.querySelector('[data-directive]'),detail=directive.querySelector('.extinction-directive-detail');
      return {id:directive.dataset.directive,objective:strip.querySelector(':scope > span').textContent,
        title:directive.querySelector('.extinction-directive-title').textContent,
        count:directive.querySelector('.extinction-directive-count').textContent,text:detail.textContent,
        detailCollapsed:getComputedStyle(detail).display==='none'};}''')
    check(expected['detailCollapsed'] and expected['title'] and expected['text'], 'compact directive lost its full instruction')
    check(expected['count'] == f"{min(1, read(page)['directive']['marks'])}/1", 'compact hunt counter differs from native progress')
    page.locator('.extinction-intel-button').click()
    dialog = page.get_by_role('dialog', name='Directive and controls', exact=True)
    expect(dialog).to_be_visible()
    details = dialog.locator('[data-directive-details]')
    expect(details).to_have_attribute('data-directive-details', expected['id'])
    expect(dialog.locator('[data-extinction-current-objective]')).to_have_text(expected['objective'])
    expect(details.locator('[data-directive-title]')).to_have_text(expected['title'])
    expect(details.locator('[data-directive-count]')).to_have_text(expected['count'])
    expect(details.locator('[data-directive-text]')).to_have_text(expected['text'])
    held = read(page)['weaponType']
    if held in ['shotgun', 'plasma', 'rocket']:
        pickup_brief = dialog.locator('[data-fps-pickup-brief]')
        expect(pickup_brief).to_have_attribute('data-fps-pickup-brief', held)
        expect(pickup_brief).to_contain_text({'shotgun': 'seven pellets', 'plasma': 'damage arrives on contact', 'rocket': 'explodes on contact'}[held])
    details.locator('[data-directive-text]').scroll_into_view_if_needed()
    content = dialog.locator('.immersive-drawer-content')
    check(content.evaluate('el=>el.scrollWidth<=el.clientWidth+1'), 'full directive overflows its scrollable panel')
    page.screenshot(path=str(out / f'{name}-directive-details.png'))
    dialog.focus(); expect(dialog).to_be_focused()
    frozen = read(page)
    page.keyboard.down('w')
    for key in ['Space', 'f', 'c', 'v', 't']: page.keyboard.press(key)
    page.clock.run_for(800); page.keyboard.up('w')
    check(read(page) == frozen, 'directive details accepted gameplay input or advanced the simulation')
    page.keyboard.press('Escape')
    expect(dialog).to_have_count(0); expect(page.locator('.extinction-intel-button')).to_be_focused()
    check(read(page) == frozen, 'closing directive details changed the paused state')
    # Closing resets the fixed-step clock: the first 16 ms RAF is a baseline,
    # and a second RAF alone adds only 16 ms, less than one 60 Hz simulation step.
    page.locator('.fps-royale-canvas').focus(); page.clock.run_for(16)
    baseline = read(page)
    check(baseline == frozen, 'first resumed frame caught up paused simulation time')
    page.clock.run_for(48)
    resumed = read(page)
    receipt = {**expected, 'pausePreserved': True, 'focusReturned': True,
               'pausedTick': frozen['t'], 'baselineTick': baseline['t'], 'resumedTick': resumed['t']}
    (out / f'{name}-directive-details.json').write_text(json.dumps(receipt, indent=2, ensure_ascii=False))
    check(0 < resumed['t'] - frozen['t'] <= 3 and resumed['phase'] == 'running', 'simulation did not resume normally after directive details')
    return receipt


def profile_case(page, identity, lang, args, out, name):
    page.locator('.extinction-panel select').select_option(identity)
    brief = page.locator(f'[data-fighter-profile="{identity}"]')
    expect(brief).to_be_visible()
    expected_src = brief.get_attribute('data-fps-view-src')
    if expected_src and args.require_art:
        page.wait_for_function('src => window.__sceneQA.media.some(item => item.src===src&&item.loaded)', arg=expected_src)
    ready = page.evaluate('''() => {const loadout=document.querySelector('[data-fps-loadout]');return {width:innerWidth,scroll:document.documentElement.scrollWidth,
      profile:document.querySelector('[data-fighter-profile]').dataset,
      loadout:{kind:loadout.dataset.fpsLoadout,text:loadout.innerText,value:loadout.querySelector('[data-fps-loadout-value]').textContent},
      media:window.__sceneQA.media.filter(item=>item.loaded)};}''')
    check(ready['scroll'] <= ready['width'] + 1, 'profile briefing overflows the viewport')
    brief.scroll_into_view_if_needed()
    brief.screenshot(path=str(out / f'{name}-briefing.png'))
    prepare_fps_clock(page)
    page.evaluate('seed => window.__sceneQA.prepareReplay(seed)', seed_for(identity))
    page.get_by_role('button', name='DEMARRER RUN' if lang == 'fr' else 'START RUN', exact=True).click()
    page.locator('.fps-royale-canvas').focus()
    page.clock.run_for(32)
    initial = read(page)
    check(list(initial['protocols']['actions']) == ['simple', 'secondary', 'defense', 'special'], 'personal actions missing')
    if identity in ['arthur_kaamelott', 'serj_tankian']:
        primary_name = initial['protocols']['actions']['simple']['name']
        if isinstance(primary_name, dict): primary_name = primary_name.get(lang) or primary_name.get('fr') or primary_name.get('en')
        prefix = 'Action principale du kit :' if lang == 'fr' else 'Kit primary action:'
        check(ready['loadout']['kind'] == 'primary-action' and ready['loadout']['value'] == primary_name
              and ready['loadout']['text'].startswith(prefix), 'briefing presents a technical weapon type instead of the actual primary action')
    elif identity == 'predator':
        check(ready['loadout']['kind'] == 'equipment' and 'Wristblades' in ready['loadout']['value'], 'briefing lost explicit source equipment')
    expect(page.locator('.extinction-panel select')).to_be_disabled()
    target = min(initial['enemies'], key=lambda item: math.hypot(item['wx'], item['wy']))
    aim(page, initial, target['wx'], target['wy'])
    page.keyboard.press('Space'); page.keyboard.press('f'); page.keyboard.press('c'); page.clock.run_for(400)
    active = read(page)
    check(all(active['protocols']['casts'][slot] == 1 for slot in ['simple', 'secondary', 'defense']), 'native personal action did not execute once')
    page.locator('#qa-pause').click()
    # Space activates a focused native button. Aim these gameplay inputs at
    # the canvas so they exercise the scene's pause guard, not QA's pause toggle.
    canvas = page.locator('.fps-royale-canvas')
    canvas.focus(); expect(canvas).to_be_focused()
    expect(page.locator('[data-primary-action]')).to_have_attribute('data-fps-aim-state', 'paused')
    expect(page.locator('.extinction-intel-button')).to_be_disabled()
    frozen = read(page)
    check(frozen['phase'] == 'running', 'pause must preserve an active run')
    page.keyboard.press('Space'); page.keyboard.press('f'); page.keyboard.press('c'); page.keyboard.press('v'); page.keyboard.press('t')
    page.clock.run_for(900)
    expect(canvas).to_be_focused()
    expect(page.locator('.extinction-intel-button')).to_be_disabled()
    check(read(page) == frozen, 'pause accepted input or progressed the source kit')
    page.locator('#qa-pause').click()
    expect(page.locator('.extinction-intel-button')).to_be_enabled()
    expect(page.locator('[data-primary-action]')).not_to_have_attribute('data-fps-aim-state', 'paused')
    canvas.focus(); page.clock.run_for(32)
    draws = page.evaluate('window.__fpsCatalogDraws')
    if expected_src and args.require_art:
        personal = [entry for entry in draws if entry['src'].endswith(expected_src) and len(entry['args']) == 8]
        check(personal, f'personal FPS sheet never drawn: {identity}')
        for entry in personal:
            _, _, sw, sh, _, _, dw, dh = entry['args']
            check(abs(sw / sh - dw / dh) < 1e-6, 'personal FPS sheet distorted')
    page.screenshot(path=str(out / f'{name}-active.png'))
    geometry = view_geometry(page, expected_src, out, f'{name}-active')
    variants = []
    if identity in ['lilo_pelekai', 'serj_tankian']:
        for width, height, large in [(390, 844, True), (844, 390, False), (844, 390, True)]:
            variants.append(layout_variant(page, width, height, large, expected_src, out,
                f'{name}-layout-{width}x{height}-' + ('large' if large else 'default')))
    page.locator('#qa-exit').click()
    check(page.evaluate('window.__sceneQA.reports.filter(report=>report.reason==="completed").length') == 0, 'abandonment granted completion')
    return {'heroId': identity, 'briefing': ready, 'actions': active['protocols'], 'nativeInputs': True,
            'viewSource': expected_src, 'draws': draws, 'geometry': geometry, 'layoutVariants': variants,
            'pausePreserved': True, 'abandonNoReward': True}


def walk(page, current, point, aim_input=aim):
    distance = math.hypot(point['wx'] - current['px'], point['wy'] - current['py'])
    aim_input(page, current, point['wx'], point['wy'])
    duration = min(180, max(17, int((distance - .8) / .25) * 17))
    page.keyboard.down('w'); page.clock.run_for(duration); page.keyboard.up('w'); page.clock.run_for(70)
    return {'kind': 'walk', 'target': point['id'], 'milliseconds': duration + 70}


def combat(page, current, targets):
    drones = [target for target in targets if target['kind'] == 'Drone Protecteur']
    target = min(drones or targets, key=lambda item: math.hypot(item['wx'] - current['px'], item['wy'] - current['py']))
    aim(page, current, target['wx'], target['wy'])
    distance = math.hypot(target['wx'] - current['px'], target['wy'] - current['py'])
    protocol = current['protocols']; actions = protocol['actions']; cooldowns = protocol['cooldowns']
    commands = []
    if cooldowns.get('defense', 0) <= 0 and distance < 5:
        page.keyboard.press('c'); commands.append('defense')
    if cooldowns.get('secondary', 0) <= 0 and distance <= actions['secondary']['range']:
        page.keyboard.press('f'); commands.append('secondary')
    if cooldowns.get('special', 0) <= 0 and protocol['charge'] >= 100 and distance <= actions['special']['range']:
        page.keyboard.press('x'); commands.append('special')
    primary = actions['simple']
    if current['weaponType'] == 'pistol' and primary['kind'] == 'melee' and distance > primary['range'] * .9:
        duration = min(180, max(17, int((distance - primary['range'] * .85) / .25) * 17))
        page.keyboard.down('w'); page.clock.run_for(duration); page.keyboard.up('w')
        return {'kind': 'approach-melee', 'target': target['id'], 'milliseconds': duration, 'protocols': commands}
    page.keyboard.press('Space'); duration = max(350, math.ceil(primary['cooldown'] * 1000 / 60) + 17)
    page.clock.run_for(duration)
    return {'kind': 'fire', 'target': target['id'], 'milliseconds': duration, 'protocols': commands}


def aim_pickup_without_fire(page, current, x, y):
    """Use a real drag even for fine corrections, which otherwise count as taps."""
    probe = '''() => {const s=window.__sceneQA.state();return {t:s.t,ammo:s.ammo,
      weaponAmmo:s.weapon.ammo,casts:structuredClone(s.protocols.casts),
      projectiles:structuredClone(s.protocols.projectiles)};}'''
    before = page.evaluate(probe)
    angle = math.atan2(x - current['px'], y - current['py'])
    delta = (angle - current['angle'] + math.pi) % (2 * math.pi) - math.pi
    if abs(delta) >= .006:
        box = page.locator('.fps-royale-canvas').bounding_box()
        start_x = box['x'] + box['width'] / 2; start_y = box['y'] + box['height'] * .48
        pixels = delta / .008
        page.mouse.move(start_x, start_y); page.mouse.down()
        # The production pointer handler suppresses click-fire after >4 px of
        # cumulative travel. Overshoot then return without advancing game time.
        if abs(pixels) < 8: page.mouse.move(start_x + math.copysign(8, pixels), start_y)
        page.mouse.move(start_x + pixels, start_y, steps=2); page.mouse.up()
    return {'kind': 'aim-without-fire', 'angleDelta': delta, 'before': before, 'after': page.evaluate(probe)}


def held_pickup_fire_case(page, out, name, restore_in_flight=False):
    """Fire a naturally dropped weapon through the shared native input route."""
    steps = []
    attack_probe = '''() => {const s=window.__sceneQA.state(),p=s.protocols;return {
      tick:s.t,turret:s.turret,reflection:structuredClone(p.reflection||null),
      summon:structuredClone(p.summon||null),projectiles:structuredClone(p.projectiles)};}'''
    def record_preparation(action):
        steps.append(action)
        (out / f'{name}-pickup-preparation.json').write_text(json.dumps({'steps': steps}, indent=2, ensure_ascii=False))
    def aim_pickup(page, current, x, y):
        proof = aim_pickup_without_fire(page, current, x, y)
        record_preparation(proof)
        check(proof['before'] == proof['after'], 'native pickup aiming advanced simulation, spent ammo or created an attack')
    for _ in range(50):
        current = read(page)
        check(current['phase'] == 'running' and current['weaponType'] in ['shotgun', 'plasma', 'rocket'], 'held pickup lost before native firing')
        targets = [enemy for enemy in current['enemies'] if enemy['hp'] > 0]
        check(targets, 'no live threat for the held pickup')
        # Stay on the ordinary threat/drone route; no protected-core shortcut.
        drones = [enemy for enemy in targets if enemy['kind'] == 'Drone Protecteur']
        travelling = current['weaponType'] in ['plasma', 'rocket']
        target = min(drones or targets, key=lambda item: math.hypot(item['wx'] - current['px'], item['wy'] - current['py'])
                     - (.28 * item.get('size', 1) if travelling else 0))
        distance = math.hypot(target['wx'] - current['px'], target['wy'] - current['py'])
        if distance > 3:
            steps.append(walk(page, current, target, aim_input=aim_pickup if travelling else aim)); continue
        if travelling and distance < 1.6:
            aim_pickup(page, current, target['wx'], target['wy'])
            page.keyboard.down('s'); page.clock.run_for(120); page.keyboard.up('s')
            steps.append({'kind': 'step-back-for-flight', 'milliseconds': 120}); continue
        if current['reloadPulse'] > 0:
            page.clock.run_for(100); steps.append({'kind': 'wait-existing-reload', 'milliseconds': 100}); continue
        if travelling:
            pending = page.evaluate(attack_probe)
            if pending['projectiles'] or pending['reflection'] or pending['summon']:
                # Let actual attacks finish in the running simulation. Never
                # clear effects or inject a quiet scene for the measured shot.
                page.clock.run_for(100)
                record_preparation({'kind': 'wait-for-native-attacks', 'milliseconds': 100,
                                    'before': pending, 'after': page.evaluate(attack_probe)})
                continue
        # The ordinary acquisition route can have an active role turret. Observe
        # between its real 34-tick pulses so later HP loss cannot be credited to it.
        if travelling and page.evaluate('window.__sceneQA.state().turret>0') and current['t'] % 34 > 14:
            duration = math.ceil((35 - current['t'] % 34) * 1000 / 60)
            page.clock.run_for(duration)
            steps.append({'kind': 'wait-for-support-pulse', 'milliseconds': duration}); continue
        break
    else: raise AssertionError('could not approach a live threat with the real held pickup')
    (aim_pickup if travelling else aim)(page, current, target['wx'], target['wy'])
    page.locator('.fps-royale-canvas').focus()
    if target['kind'] == 'Champion de Trame': page.keyboard.press('t')
    before = read(page)
    pending_damage = page.evaluate(attack_probe)
    if travelling:
        record_preparation({'kind': 'ready-for-native-shot', 'state': before, 'pendingDamage': pending_damage})
        check(not pending_damage['projectiles'] and not pending_damage['reflection'] and not pending_damage['summon'],
              'another travelling or autonomous attack would make native pickup damage ambiguous')
    page.keyboard.press('Space')
    fired = read(page)
    check(fired['ammo'] == before['ammo'] - 1, 'native pickup fire must spend exactly one round')
    check(fired['protocols']['casts'] == before['protocols']['casts'], 'pickup fire borrowed a personal action')
    detail = page.evaluate('''() => {const s=window.__sceneQA.state();return {
      projectiles:structuredClone(s.protocols.projectiles),status:s.statusText,
      confirmed:s.hitMarkerTimer>0,charge:s.protocols.charge};}''')
    flight = []; in_flight = None; shot_id = None
    if not travelling:
        hit = next(enemy for enemy in fired['enemies'] if enemy['id'] == target['id'])
        check(hit['hp'] < target['hp'] and detail['confirmed'], 'native close shotgun did not confirm real damage')
        check(detail['charge'] <= min(100, before['protocols']['charge'] + 8), 'one shotgun discharge multiplied ultimate credit')
    else:
        shots = [shot for shot in detail['projectiles'] if shot.get('source') == 'pickup' and shot.get('weaponType') == current['weaponType']]
        check(len(shots) == 1 and shots[0]['age'] == 0, 'native pickup did not launch exactly one travelling projectile')
        shot_id = shots[0]['id']
        hit = next(enemy for enemy in fired['enemies'] if enemy['id'] == target['id'])
        check(hit['hp'] == target['hp'], 'projectile damage happened before simulation flight')
        check([(enemy['id'], enemy['hp']) for enemy in fired['enemies']] == [(enemy['id'], enemy['hp']) for enemy in before['enemies']]
              and fired['protocols']['charge'] == before['protocols']['charge'], 'launch damaged another threat or granted premature charge')
        for _ in range(3):
            page.clock.run_for(16)
            snapshot = read(page)
            observed = page.evaluate('structuredClone(window.__sceneQA.state().protocols.projectiles)')
            flight.append({'state': snapshot, 'projectiles': observed})
            if snapshot['t'] > before['t']:
                in_flight = next((shot for shot in observed if shot['id'] == shot_id), None)
                check(in_flight and in_flight['age'] == 1, 'projectile did not remain in flight after its first native tick')
                check(math.hypot(in_flight['wx'] - shots[0]['wx'], in_flight['wy'] - shots[0]['wy']) > 0,
                      'travelling projectile did not leave the muzzle')
                check([(enemy['id'], enemy['hp']) for enemy in snapshot['enemies']] == [(enemy['id'], enemy['hp']) for enemy in before['enemies']],
                      'damage preceded the observed travelling contact')
                page.screenshot(path=str(out / f'{name}-projectile-in-flight.png'))
                break
        check(in_flight, 'no native projectile flight was observed')
    page.locator('#qa-pause').click()
    page.locator('.fps-royale-canvas').focus()
    frozen = read(page)
    frozen_projectiles = page.evaluate('structuredClone(window.__sceneQA.state().protocols.projectiles)')
    page.keyboard.press('Space'); page.clock.run_for(400)
    check(read(page) == frozen and page.evaluate('structuredClone(window.__sceneQA.state().protocols.projectiles)') == frozen_projectiles,
          'pause advanced a pickup projectile or accepted a shot')
    page.locator('#qa-pause').click(); page.locator('.fps-royale-canvas').focus()
    page.clock.run_for(16)
    if travelling:
        check(read(page) == frozen and page.evaluate('structuredClone(window.__sceneQA.state().protocols.projectiles)') == frozen_projectiles,
              'first resumed frame caught up time spent with the projectile paused')
    restored_during_flight = None
    if restore_in_flight:
        check(travelling and before['personalKit'], 'in-flight kit return needs a real retained personal kit')
        page.keyboard.press('v')
        restored_during_flight = read(page)
        check(restored_during_flight['weaponType'] == 'pistol' and restored_during_flight['ammo'] == before['personalKit']['ammo']
              and restored_during_flight['reserveAmmo'] == before['personalKit']['reserveAmmo'], 'in-flight kit return altered personal stock')
        check(page.evaluate('structuredClone(window.__sceneQA.state().protocols.projectiles)') == frozen_projectiles,
              'returning to the kit removed or rewrote the launched pickup projectile')
    if travelling:
        for _ in range(18):
            page.clock.run_for(16)
            after = read(page)
            observed = page.evaluate('''() => {const s=window.__sceneQA.state();return {
              projectiles:structuredClone(s.protocols.projectiles),effects:structuredClone(s.protocols.effects),
              hit:s.hitMarkerTimer>0,turret:s.turret};}''')
            flight.append({'state': after, **observed})
            check(after['t'] - before['t'] <= 18, 'pickup delivery exceeded the original 300 ms simulation window')
            check(not pending_damage['turret'] or all(tick % 34 != 0 for tick in range(before['t'] + 1, after['t'] + 1)),
                  'a support pulse would make the native projectile impact ambiguous')
            if not any(shot['id'] == shot_id for shot in observed['projectiles']): break
            check([(enemy['id'], enemy['hp']) for enemy in after['enemies']] == [(enemy['id'], enemy['hp']) for enemy in before['enemies']],
                  'a threat took damage while the pickup projectile was still in flight')
        else: raise AssertionError('travelling pickup missed its nearby target within the original 300 ms delivery window')
        hit = next(enemy for enemy in after['enemies'] if enemy['id'] == target['id'])
        check(hit['hp'] < target['hp'] and observed['hit'], 'travelling pickup did not confirm a real hit on the aimed nearby target')
        check(after['protocols']['casts'] == before['protocols']['casts'], 'flight or kit return cast a personal attack')
        check(after['protocols']['charge'] == min(100, before['protocols']['charge'] + 8), 'projectile contact did not grant exactly one discharge of charge')
        if current['weaponType'] == 'rocket':
            check(any(effect['kind'] == 'explosion' and effect.get('effectRadius') == 2.2 for effect in observed['effects']),
                  'native rocket contact did not create its physical explosion')
    else:
        page.clock.run_for(300)
        after = read(page)
    page.screenshot(path=str(out / f'{name}-pickup-fire.png'))
    receipt = {'type': current['weaponType'], 'nativeInputs': True, 'injectedState': False,
               'approach': steps, 'targetId': target['id'], 'before': before, 'fired': fired,
               'delivery': detail, 'pausedProjectiles': frozen_projectiles, 'after': after,
               'pausePreserved': True, 'pendingDamage': pending_damage, 'flight': flight,
               'inFlight': in_flight, 'restoredDuringFlight': restored_during_flight}
    (out / f'{name}-pickup-fire.json').write_text(json.dumps(receipt, indent=2, ensure_ascii=False))
    return receipt


def field_equipment_cycle(page, out, name, firing):
    """Recover the naturally obtained weapon through both button and keyboard.

    Keep this probe separate from read(): the eight victory replay observations
    and their semantic seeds are unchanged by the new optional equipment path.
    """
    probe = '''() => {const s=window.__sceneQA.state();return {
      t:s.t,phase:s.phase,heroId:s.heroId,runId:s.runId,weapon:structuredClone(s.weapon),
      ammo:s.ammo,reserveAmmo:s.reserveAmmo,reloadPulse:s.reloadPulse,
      fieldWeapon:structuredClone(s.fieldWeapon||null),personalKit:structuredClone(s.personalKit||null),
      lastFireTime:s.lastFireTime,protocols:{cooldowns:structuredClone(s.protocols.cooldowns),
        casts:structuredClone(s.protocols.casts),projectiles:structuredClone(s.protocols.projectiles),charge:s.protocols.charge}};}'''
    before = page.evaluate(probe)
    carried = before['fieldWeapon']
    check(before['phase'] == 'running' and before['weapon']['type'] == 'pistol' and carried,
          'V did not retain the naturally collected field weapon')
    check(carried['weapon']['type'] == firing['type'] and carried['weapon']['ammo'] == firing['fired']['ammo']
          and carried['reserveAmmo'] == firing['fired']['reserveAmmo'], 'V changed the fired field weapon stock')
    check(carried['heroId'] == before['heroId'] and carried['runId'] == before['runId'], 'stored equipment lost its exact owner')
    button = page.locator('[data-field-weapon]')
    expect(button).to_be_visible()
    label = button.evaluate("el=>[el.innerText,el.getAttribute('aria-label'),el.title].filter(Boolean).join(' ')")
    check(carried['weapon']['name'] in label, 'stored field weapon is not identified in its control')
    page.locator('.fps-royale-canvas').focus(); page.keyboard.press('v')
    check(page.evaluate(probe) == before, 'repeated V modified an already active personal kit')
    button.click()
    restored = page.evaluate(probe)
    check(restored['weapon'] == carried['weapon'] and restored['ammo'] == carried['weapon']['ammo']
          and restored['reserveAmmo'] == carried['reserveAmmo'], 'B button refilled or replaced the stored field weapon')
    check(restored['reloadPulse'] == max(0, carried['reloadReadyAtTick'] - restored['t']), 'B button discarded the field reload deadline')
    check(restored['personalKit']['weapon'] == before['weapon'] and restored['personalKit']['reserveAmmo'] == before['reserveAmmo'],
          'B button altered the personal kit it put away')
    check(restored['fieldWeapon'] is None and restored['protocols'] == before['protocols']
          and restored['lastFireTime'] == before['lastFireTime'], 'B reset abilities, shot cadence or projectiles')
    expect(page.locator('[data-personal-kit]')).to_be_visible()
    expect(page.locator('[data-field-weapon]')).to_have_count(0)
    page.locator('.fps-royale-canvas').focus(); page.keyboard.press('b')
    check(page.evaluate(probe) == restored, 'repeated B changed an already equipped field weapon')
    loaded = min(restored['weapon']['maxAmmo'] - restored['ammo'], restored['reserveAmmo'])
    check(loaded > 0, 'native equipment cycle needs the ammunition spent by its measured shot')
    page.keyboard.press('r')
    reloading = page.evaluate(probe)
    check(reloading['ammo'] == restored['ammo'] + loaded and reloading['reserveAmmo'] == restored['reserveAmmo'] - loaded
          and reloading['reloadPulse'] == 36, 'real field reload did not transfer exactly its available reserve')
    page.keyboard.press('v')
    holstered = page.evaluate(probe)
    check(holstered['weapon'] == before['weapon'] and holstered['reserveAmmo'] == before['reserveAmmo'],
          'field reload leaked ammunition into the personal kit')
    check(holstered['fieldWeapon']['weapon'] == reloading['weapon']
          and holstered['fieldWeapon']['reloadReadyAtTick'] == holstered['t'] + 36, 'V bypassed the new field reload')
    page.locator('#qa-pause').click(); page.locator('.fps-royale-canvas').focus()
    frozen = page.evaluate(probe)
    page.keyboard.press('b'); page.keyboard.press('v'); page.clock.run_for(400)
    check(page.evaluate(probe) == frozen, 'paused V/B changed equipment or advanced a holstered reload')
    page.locator('#qa-pause').click(); page.locator('.fps-royale-canvas').focus()
    # Only active scene ticks count. Observe them rather than assuming a RAF
    # timestamp conversion or modifying the simulation clock/state directly.
    for _ in range(16):
        if page.evaluate('window.__sceneQA.state().t') - holstered['t'] >= 10: break
        page.clock.run_for(16)
    active = page.evaluate(probe)
    check(active['phase'] == 'running' and 10 <= active['t'] - holstered['t'] <= 11, 'could not observe ten ordinary active reload ticks')
    page.keyboard.press('b')
    keyboard = page.evaluate(probe)
    check(keyboard['weapon'] == reloading['weapon'] and keyboard['reserveAmmo'] == reloading['reserveAmmo'],
          'keyboard B did not recover the reloaded field stock')
    remaining = holstered['fieldWeapon']['reloadReadyAtTick'] - keyboard['t']
    check(25 <= remaining <= 26 and keyboard['reloadPulse'] == remaining, 'keyboard B reset or skipped remaining recharge')
    check(keyboard['protocols'] == active['protocols'] and keyboard['lastFireTime'] == active['lastFireTime'],
          'keyboard B changed an independent ability, projectile or firing deadline')
    page.keyboard.press('Space')
    check(page.evaluate(probe) == keyboard, 'recovering a reloading weapon allowed an early shot')
    page.keyboard.press('v')
    final = page.evaluate(probe)
    check(final['weapon'] == before['weapon'] and final['reserveAmmo'] == before['reserveAmmo']
          and final['fieldWeapon']['weapon'] == reloading['weapon'], 'final V lost either exact equipment stock')
    expect(page.locator('[data-field-weapon]')).to_be_visible()
    stock_readout = page.locator('[data-field-weapon-stock]')
    expect(stock_readout).to_be_visible()
    expect(stock_readout).to_contain_text(final['fieldWeapon']['weapon']['name'])
    expect(stock_readout).to_contain_text(f"{final['fieldWeapon']['weapon']['ammo']}/{final['fieldWeapon']['weapon']['maxAmmo']}")
    page.screenshot(path=str(out / f'{name}-stored-field-weapon.png'))
    receipt = {'nativeInputs': True, 'injectedState': False, 'before': before, 'restoredWithButton': restored,
               'reloading': reloading, 'holstered': holstered, 'paused': frozen,
               'activeTicks': active['t'] - holstered['t'], 'restoredWithKeyboard': keyboard, 'final': final}
    (out / f'{name}-field-equipment.json').write_text(json.dumps(receipt, indent=2, ensure_ascii=False))
    return {'type': firing['type'], 'nativeInputs': True, 'buttonAndKeyboard': True,
            'pausePreserved': True, 'exactStocks': True, 'remainingReloadTicks': remaining}


def pickup_layout_case(page, out, name):
    """Short native hunt: earn and collect one drop, then measure KIT + MARK."""
    personal_view_source = page.locator('[data-fighter-profile]').get_attribute('data-fps-view-src') or ''
    page.locator('.extinction-mode-options button').filter(has=page.locator('strong', has_text='Champion Hunt')).click()
    page.locator('[data-field-directive]').check()
    prepare_fps_clock(page)
    seed = seed_for('hunt'); page.evaluate('seed=>window.__sceneQA.prepareReplay(seed)', seed)
    page.get_by_role('button', name='START RUN', exact=True).click()
    page.locator('.fps-royale-canvas').focus(); page.clock.run_for(350)
    trace = []; current = read(page)
    for _ in range(120):
        if current['personalKit'] and current['weaponType'] != 'pistol': break
        check(current['phase'] == 'running', 'short pickup case ended before collection')
        pickup = next((item for item in current['loot'] if item['type'] == 'weapon' and not item.get('used')), None)
        if pickup:
            if math.hypot(pickup['wx'] - current['px'], pickup['wy'] - current['py']) >= 1.05:
                action = walk(page, current, pickup)
            else:
                page.keyboard.press('e'); page.clock.run_for(80)
                action = {'kind': 'collect-weapon', 'target': pickup['id']}
        else:
            enemies = [enemy for enemy in current['enemies'] if enemy['hp'] > 0]
            check(enemies, 'no native pickup target before first drop')
            action = combat(page, current, enemies)
        current = read(page); trace.append({'action': action, 'state': current})
    (out / f'{name}-trace.json').write_text(json.dumps({'seed': seed, 'trace': trace}, indent=2, ensure_ascii=False))
    check(current['personalKit'] and current['weaponType'] != 'pistol', 'no real weapon pickup within short case')
    firing = held_pickup_fire_case(page, out, name)
    current = read(page)
    # Collection updates simulation immediately; the HUD publishes periodically.
    # Playwright's assertion wait cannot advance the deliberately paused clock.
    for _ in range(6):
        if page.locator('[data-personal-kit]').count(): break
        page.clock.run_for(100); current = read(page)
        trace.append({'action': {'kind': 'wait-for-kit-hud', 'milliseconds': 100}, 'state': current})
    (out / f'{name}-trace.json').write_text(json.dumps({'seed': seed, 'trace': trace}, indent=2, ensure_ascii=False))
    expect(page.locator('[data-personal-kit]')).to_be_visible(); expect(page.locator('[data-hunt-mark]')).to_be_visible()
    retained = current['personalKit']; weapon = current['weaponType']; layouts = []
    for height, large, suffix in [(390, False, 'default'), (390, True, 'large'),
                                  (380, True, 'large-844x380'), (500, True, 'large-844x500')]:
        layouts.append(layout_variant(page, 844, height, large, '', out, f'{name}-{suffix}'))
        check(layouts[-1]['hasKit'] and layouts[-1]['hasMark'], 'layout did not contain both optional controls')
    details = directive_details_case(page, out, name)
    trace.append({'action': {'kind': 'directive-details-pause-resume'}, 'state': read(page)})
    (out / f'{name}-trace.json').write_text(json.dumps({'seed': seed, 'trace': trace}, indent=2, ensure_ascii=False))
    page.locator('.fps-royale-canvas').focus(); page.keyboard.press('v'); page.clock.run_for(32)
    restored = read(page)
    check(restored['weaponType'] == 'pistol' and restored['ammo'] == retained['ammo']
          and restored['reserveAmmo'] == retained['reserveAmmo'], 'layout change altered retained personal stock')
    equipment = field_equipment_cycle(page, out, name, firing)
    field_layout = layout_variant(page, 844, 380, True, personal_view_source, out, f'{name}-stored-weapon-large-844x380')
    check(field_layout['hasField'] and field_layout['hasMark'] and not field_layout['hasKit'],
          'stored weapon layout lost B/mark controls or displayed conflicting equipment actions')
    page.locator('#qa-exit').click()
    check(page.evaluate('window.__sceneQA.state().fieldWeapon == null'), 'abandon retained the carried field weapon')
    check(page.evaluate('window.__sceneQA.reports.filter(r=>r.reason==="completed").length') == 0, 'short layout case granted completion')
    return {'nativeInputs': True, 'injectedProgress': False, 'seed': seed, 'pickedWeapon': weapon,
            'nativeActions': len(trace), 'layouts': layouts, 'directiveDetails': details,
            'pickupFiring': {'type': firing['type'], 'nativeInputs': True, 'pausePreserved': firing['pausePreserved']},
            'fieldEquipment': equipment, 'fieldEquipmentLayout': field_layout,
            'restoredKit': True, 'abandonNoReward': True}


def full_directive(page, mode, lang, out, name, pickup_type=None):
    page.locator('.extinction-mode-options button').filter(has=page.locator('strong', has_text=MODES[mode][0 if lang == 'fr' else 1])).click()
    page.locator('[data-relay-operation]' if mode == 'extraction' else '[data-field-directive]').check()
    prepare_fps_clock(page); page.clock.run_for(32)
    seed = seed_for(mode); page.evaluate('seed=>window.__sceneQA.prepareReplay(seed)', seed)
    trace = []; result = {'mode': mode, 'seed': seed, 'nativeInputs': True, 'injectedProgress': False}
    def observe(action):
        current = read(page); check(current['ownerMatches'], 'directive has a foreign run or hero')
        trace.append({'action': action, 'state': current, 'random': page.evaluate('window.__sceneQA.replayRandom()')})
        return current
    try:
        page.get_by_role('button', name='DEMARRER RUN' if lang == 'fr' else 'START RUN', exact=True).click()
        page.locator('.fps-royale-canvas').focus(); current = observe({'kind': 'start'})
        check(current['t'] == 0, 'run advanced before controlled input')
        page.clock.run_for(350); current = observe({'kind': 'advance', 'milliseconds': 350})
        paused = False
        for index in range(1000):
            if current['phase'] != 'running': break
            if not paused:
                page.locator('#qa-pause').click(); before = read(page)
                page.keyboard.press('e'); page.keyboard.press('t'); page.clock.run_for(1000)
                check(read(page) == before, 'directive progressed under shell pause')
                page.locator('#qa-pause').click(); page.locator('.fps-royale-canvas').focus(); page.clock.run_for(32)
                current = observe({'kind': 'pause-resume'}); paused = True
            if current['skillCooldown'] == 0: page.keyboard.press('Shift')
            requested_held = pickup_type and current['personalKit'] and current['weaponType'] == pickup_type
            if requested_held and any(enemy['hp'] > 0 for enemy in current['enemies']):
                firing = held_pickup_fire_case(page, out, name, restore_in_flight=True)
                current = observe({'kind': 'native-pickup-flight-pause-and-kit-return', 'weaponType': pickup_type})
                check(current['phase'] == 'running' and current['weaponType'] == 'pistol', 'pickup flight case did not retain an active personal kit')
                equipment = field_equipment_cycle(page, out, name, firing)
                page.locator('#qa-exit').click()
                check(page.evaluate('window.__sceneQA.state().fieldWeapon == null'), 'abandon retained the carried field weapon')
                check(page.evaluate('window.__sceneQA.reports.filter(report=>report.reason==="completed").length') == 0,
                      'the short projectile case granted completion')
                result.update(result='pickup-verified', pickedWeapon=pickup_type, pausePreserved=True,
                              restoredKit=True, abandonNoReward=True, nativeActions=len(trace),
                              fieldEquipment=equipment,
                              pickupFiring={'type': firing['type'], 'nativeInputs': True, 'injectedState': False,
                                            'launchTick': firing['before']['t'], 'impactTick': firing['after']['t'],
                                            'projectileId': firing['inFlight']['id'], 'returnedDuringFlight': True})
                return result
            if current['personalKit'] and current['weaponType'] != 'pistol' and not requested_held:
                retained = current['personalKit']; page.keyboard.press('v')
                current = observe({'kind': 'restore-personal-kit'})
                check(current['weaponType'] == 'pistol' and current['ammo'] == retained['ammo']
                      and current['reserveAmmo'] == retained['reserveAmmo'], 'pickup return refilled or changed the personal kit')
                result['kitReturns'] = result.get('kitReturns', 0) + 1
            enemies = [enemy for enemy in current['enemies'] if enemy['hp'] > 0]
            directive = current['directive']; points = (directive or {}).get('markers', [])
            markers = [point for point in points if point['status'] != 'secured' and
                       (point['wave'] == current['wave'] if mode == 'last_signal' else current['t'] >= point['opensAt'])]
            marker = markers[0] if markers else None
            pickup = next((item for item in current['loot'] if item['type'] == 'beacon' and not item.get('used')), None) if not enemies and mode == 'extraction' else None
            if marker and (mode == 'infestation' or not enemies): pickup = marker
            if current['hp'] < 50:
                pickup = next((item for item in current['loot'] if item.get('effect') == 'heal' and not item.get('used')), pickup)
            # Continue the existing extraction route until the requested weapon
            # actually drops. A cleared wave still needs its real beacon before
            # another live target exists; no enemy, loot or position is injected.
            if pickup_type and not requested_held and enemies:
                pickup = next((item for item in current['loot'] if item['type'] == 'weapon' and not item.get('used')
                               and item.get('weaponData', {}).get('type') == pickup_type), pickup)
            if mode == 'hunt' and directive and directive['markTicks'] == 0:
                champion = next((enemy for enemy in enemies if enemy['kind'] == 'Champion de Trame'), None)
                if champion and math.hypot(champion['wx'] - current['px'], champion['wy'] - current['py']) <= 12:
                    aim(page, current, champion['wx'], champion['wy']); page.keyboard.press('t')
                    current = observe({'kind': 'mark'}); directive = current['directive']
            close = [enemy for enemy in enemies if math.hypot(enemy['wx'] - current['px'], enemy['wy'] - current['py']) < 3]
            if mode == 'infestation' and pickup is marker and close:
                action = combat(page, current, close)
            elif pickup:
                distance = math.hypot(pickup['wx'] - current['px'], pickup['wy'] - current['py'])
                if distance >= 1.05: action = walk(page, current, pickup)
                else:
                    page.keyboard.press('e'); page.clock.run_for(180)
                    action = {'kind': 'interact', 'target': pickup['id'], 'milliseconds': 180}
            elif enemies: action = combat(page, current, enemies)
            else:
                page.clock.run_for(180); action = {'kind': 'wait', 'milliseconds': 180}
            current = observe(action)
            if index % 75 == 0: print(f'PROGRESS {name}: {index} actions, {current["t"]} ticks, {current["hp"]} HP', flush=True)
        reports = page.evaluate('window.__sceneQA.reports.filter(report=>report.reason==="completed")')
        check(pickup_type is None, f'no native {pickup_type} pickup and impact before the extraction ended')
        check(current['phase'] == 'ended' and current['result'] == 'victory', f'no victory: {current["phase"]}, {current["t"]} ticks, {current["hp"]} HP')
        check(len(reports) == 1, 'completion missing or duplicated')
        check(page.evaluate('window.__sceneQA.state().fieldWeapon == null'), 'completion retained the carried field weapon')
        if mode == 'extraction': check(current['beacons'] == 3 and current['relaySummary']['secured'] == 3, 'relay objective skipped')
        else:
            check(current['directiveSummary']['completed'] == current['directiveSummary']['required'], 'directive objective skipped')
            if mode == 'infestation': check(current['t'] >= 3600, 'survival time skipped')
        rewards = reports[0]['rewards']; check(rewards['gold'] == 70 + current['wave'] * 22 + current['kills'] * 3, 'reward formula changed')
        page.screenshot(path=str(out / f'{name}-result.png'))
        page.keyboard.press('Space'); page.keyboard.press('e'); page.keyboard.press('t'); page.clock.run_for(500)
        check(page.evaluate('window.__sceneQA.reports.filter(report=>report.reason==="completed").length') == 1, 'result input granted another receipt')
        result.update(ticks=current['t'], kills=current['kills'], hp=current['hp'], result=current['result'],
                      directive=current['directiveSummary'], relays=current['relaySummary'], rewards=rewards, casts=current['protocols']['casts'])
    finally:
        result['traceFile'] = f'{name}-trace.json'
        serialized = json.dumps(trace, sort_keys=True, separators=(',', ':'), ensure_ascii=False)
        result['traceDigest'] = hashlib.sha256(serialized.encode()).hexdigest()
        (out / result['traceFile']).write_text(json.dumps({'seed': seed, 'trace': trace}, indent=2, ensure_ascii=False))
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--url', default='http://127.0.0.1:4173'); parser.add_argument('--evidence', default='/tmp/extinction-roster-directives')
    parser.add_argument('--executable'); parser.add_argument('--require-art', action='store_true'); parser.add_argument('--case', default='')
    parser.add_argument('--replays', type=int, default=2, choices=range(1, 6)); args = parser.parse_args()
    out = Path(args.evidence); out.mkdir(parents=True, exist_ok=True); results = []; reference = {}
    profiles = [('arca_mirelle', 1280, 900, 'fr'), ('masterchief', 1280, 900, 'en'), ('predator', 1280, 900, 'fr'),
                ('doomslayer', 1280, 900, 'en'), ('lilo_pelekai', 390, 844, 'fr'), ('long_horse', 390, 844, 'en'),
                ('serj_tankian', 390, 844, 'en'), ('arthur_kaamelott', 1280, 900, 'fr'),
                ('hw_wheelchair_guy', 844, 390, 'fr')]
    # Fail a cramped layout quickly, before spending time on full mode replays.
    cases = [('layout', 'pickup-hunt', 844, 390, 'en', 0)]
    # Same fixed extraction seed and ordinary acquisition route as the full
    # replay. These cases end after real flight/contact; the eight victory
    # replays below keep all their original objectives and comparison gates.
    cases += [('pickup', weapon, 1280, 900, 'fr', 0) for weapon in ['plasma', 'rocket']]
    cases += [('profile', hero, width, height, lang, 0) for hero, width, height, lang in profiles]
    cases += [('directive', mode, 1280, 900, 'fr' if mode in ['extraction', 'last_signal'] else 'en', replay)
              for mode in MODES for replay in range(1, args.replays + 1)]
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, args=['--no-sandbox'], **({'executable_path': args.executable} if args.executable else {}))
        try:
            for kind, identity, width, height, lang, replay in cases:
                name = f'{kind}-{identity}-{width}x{height}-{lang}' + (f'-{replay}' if replay else '')
                if args.case and args.case not in name: continue
                print('START ' + name, flush=True)
                context = browser.new_context(viewport={'width': width, 'height': height}, has_touch=True); media_capture(context)
                page = context.new_page(); page.set_default_timeout(15000); errors = []; page.on('pageerror', lambda error: errors.append(str(error)))
                record = {'name': name, 'passed': False, 'pageErrors': errors}
                try:
                    load(page, args, lang)
                    record.update(profile_case(page, identity, lang, args, out, name) if kind == 'profile'
                                  else pickup_layout_case(page, out, name) if kind == 'layout'
                                  else full_directive(page, 'extraction', lang, out, name, pickup_type=identity) if kind == 'pickup'
                                  else full_directive(page, identity, lang, out, name))
                    if kind == 'directive':
                        if identity in reference: check(record['traceDigest'] == reference[identity], 'fresh-context deterministic replay differs')
                        reference[identity] = record['traceDigest']
                    check(not errors, str(errors)); record['passed'] = True
                except Exception as error:
                    record['error'] = str(error); page.screenshot(path=str(out / f'{name}-FAILED.png'))
                finally:
                    results.append(record); context.close()
                    (out / 'report.json').write_text(json.dumps({'results': results}, indent=2, ensure_ascii=False))
                    print(json.dumps({'name': name, 'passed': record['passed'], 'error': record.get('error')}), flush=True)
                if kind == 'layout' and not record['passed']: break
        finally: browser.close()
    check(results and all(record['passed'] for record in results), 'FPS roster/directive browser failures')


if __name__ == '__main__': main()
