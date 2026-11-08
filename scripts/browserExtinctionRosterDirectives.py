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
    context.add_init_script('''window.__fpsCatalogDraws=[];window.__fpsSchematicStrokes=[];
      const nativeTimeout=setTimeout.bind(window),nativeClear=clearTimeout.bind(window);
      window.__fpsAfterNativeLayout=()=>new Promise((resolve,reject)=>{
        const roots=[...document.querySelectorAll('.fps-royale-canvas,.extinction-hud-dock .nexus-play-stats,.extinction-hud-dock .nexus-play-actions,.extinction-objective-strip')];
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
      const hud=[...document.querySelectorAll('.extinction-hud-dock .nexus-play-stats,.extinction-hud-dock .nexus-play-actions,.extinction-objective-strip')]
        .filter(el=>el.getClientRects().length).map(el=>({kind:el.className,...rect(el)}));
      const reticle=local({left:canvas.width/2-18,top:canvas.height/2-18,right:canvas.width/2+18,bottom:canvas.height/2+18});
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
        viewOverlaps:view?[...hud,reticle,radarBox].filter(b=>overlap(view,b)):[],hudReticleOverlaps:hud.filter(b=>overlap(reticle,b)),
        minButtonWidth:Math.min(...buttons.map(b=>b.width)),minButtonHeight:Math.min(...buttons.map(b=>b.height)),buttons,
        intelButton:rect(document.querySelector('.extinction-intel-button')),directiveTypography,
        hasKit:!!document.querySelector('[data-personal-kit]'),hasMark:!!document.querySelector('[data-hunt-mark]')};
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
          const rects=[...document.querySelectorAll('.fps-royale-canvas,.extinction-hud-dock .nexus-play-stats,.extinction-hud-dock .nexus-play-actions,.extinction-objective-strip')]
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


def walk(page, current, point):
    distance = math.hypot(point['wx'] - current['px'], point['wy'] - current['py'])
    aim(page, current, point['wx'], point['wy'])
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


def held_pickup_fire_case(page, out, name):
    """Fire a naturally dropped weapon through the shared native input route."""
    steps = []
    for _ in range(50):
        current = read(page)
        check(current['phase'] == 'running' and current['weaponType'] in ['shotgun', 'plasma', 'rocket'], 'held pickup lost before native firing')
        targets = [enemy for enemy in current['enemies'] if enemy['hp'] > 0]
        check(targets, 'no live threat for the held pickup')
        # Stay on the ordinary threat/drone route; no protected-core shortcut.
        drones = [enemy for enemy in targets if enemy['kind'] == 'Drone Protecteur']
        target = min(drones or targets, key=lambda item: math.hypot(item['wx'] - current['px'], item['wy'] - current['py']))
        if math.hypot(target['wx'] - current['px'], target['wy'] - current['py']) > 3:
            steps.append(walk(page, current, target)); continue
        if current['reloadPulse'] > 0:
            page.clock.run_for(100); steps.append({'kind': 'wait-existing-reload', 'milliseconds': 100}); continue
        break
    else: raise AssertionError('could not approach a live threat with the real held pickup')
    aim(page, current, target['wx'], target['wy'])
    page.locator('.fps-royale-canvas').focus()
    if target['kind'] == 'Champion de Trame': page.keyboard.press('t')
    before = read(page)
    page.keyboard.press('Space')
    fired = read(page)
    check(fired['ammo'] == before['ammo'] - 1, 'native pickup fire must spend exactly one round')
    check(fired['protocols']['casts'] == before['protocols']['casts'], 'pickup fire borrowed a personal action')
    detail = page.evaluate('''() => {const s=window.__sceneQA.state();return {
      projectiles:structuredClone(s.protocols.projectiles),status:s.statusText,
      confirmed:s.hitMarkerTimer>0,charge:s.protocols.charge};}''')
    if current['weaponType'] == 'shotgun':
        hit = next(enemy for enemy in fired['enemies'] if enemy['id'] == target['id'])
        check(hit['hp'] < target['hp'] and detail['confirmed'], 'native close shotgun did not confirm real damage')
        check(detail['charge'] <= min(100, before['protocols']['charge'] + 8), 'one shotgun discharge multiplied ultimate credit')
    else:
        shots = [shot for shot in detail['projectiles'] if shot.get('source') == 'pickup' and shot.get('weaponType') == current['weaponType']]
        check(shots and all(shot['age'] == 0 for shot in shots), 'native pickup did not launch its travelling projectile')
        hit = next(enemy for enemy in fired['enemies'] if enemy['id'] == target['id'])
        check(hit['hp'] == target['hp'], 'projectile damage happened before simulation flight')
    page.locator('#qa-pause').click()
    page.locator('.fps-royale-canvas').focus()
    frozen = read(page)
    frozen_projectiles = page.evaluate('structuredClone(window.__sceneQA.state().protocols.projectiles)')
    page.keyboard.press('Space'); page.clock.run_for(400)
    check(read(page) == frozen and page.evaluate('structuredClone(window.__sceneQA.state().protocols.projectiles)') == frozen_projectiles,
          'pause advanced a pickup projectile or accepted a shot')
    page.locator('#qa-pause').click(); page.locator('.fps-royale-canvas').focus()
    page.clock.run_for(16)
    page.clock.run_for(300)
    after = read(page)
    if current['weaponType'] != 'shotgun':
        hit = next(enemy for enemy in after['enemies'] if enemy['id'] == target['id'])
        check(hit['hp'] < target['hp'], 'travelling pickup did not hit the aimed nearby target')
    page.screenshot(path=str(out / f'{name}-pickup-fire.png'))
    receipt = {'type': current['weaponType'], 'nativeInputs': True, 'injectedState': False,
               'approach': steps, 'targetId': target['id'], 'before': before, 'fired': fired,
               'delivery': detail, 'pausedProjectiles': frozen_projectiles, 'after': after,
               'pausePreserved': True}
    (out / f'{name}-pickup-fire.json').write_text(json.dumps(receipt, indent=2, ensure_ascii=False))
    return receipt


def pickup_layout_case(page, out, name):
    """Short native hunt: earn and collect one drop, then measure KIT + MARK."""
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
    page.locator('#qa-exit').click()
    check(page.evaluate('window.__sceneQA.reports.filter(r=>r.reason==="completed").length') == 0, 'short layout case granted completion')
    return {'nativeInputs': True, 'injectedProgress': False, 'seed': seed, 'pickedWeapon': weapon,
            'nativeActions': len(trace), 'layouts': layouts, 'directiveDetails': details,
            'pickupFiring': {'type': firing['type'], 'nativeInputs': True, 'pausePreserved': firing['pausePreserved']},
            'restoredKit': True, 'abandonNoReward': True}


def full_directive(page, mode, lang, out, name):
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
            if current['personalKit'] and current['weaponType'] != 'pistol':
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
        check(current['phase'] == 'ended' and current['result'] == 'victory', f'no victory: {current["phase"]}, {current["t"]} ticks, {current["hp"]} HP')
        check(len(reports) == 1, 'completion missing or duplicated')
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
                ('serj_tankian', 390, 844, 'en'), ('arthur_kaamelott', 1280, 900, 'fr')]
    # Fail a cramped layout quickly, before spending time on full mode replays.
    cases = [('layout', 'pickup-hunt', 844, 390, 'en', 0)]
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
