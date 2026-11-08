#!/usr/bin/env python3
"""Input-driven district reconnaissance and optional FPS relay operations.

Ownership and the initial City district are prepared by the isolated fixture.
Progress, movement, combat, synchronization and completion use the real scenes.
No live account, cloud save, injected damage, position changes during a mission,
or forced victory. FPS replays use a new semantic seed and fresh contexts.
"""
import argparse
import hashlib
import json
import math
from pathlib import Path

from playwright.sync_api import sync_playwright, expect
from browserCityExtinction import check, load_scene
from browserResidentViewmodels import CLOCK_EPOCH, CLOCK_START, prepare_fps_clock
from browserSceneServices import aim, state
from hudTextProof import BUTTON_TEXT_PROOF_JS
from mosaicMotionProof import validate_mosaic_motion


DISTRICT = 'universe-nexus-de-convergence'
SEED_NAME = 'multiverse-city-fps-operations-v1:relay-under-pressure'


def relay_seed():
    value = 2166136261
    for byte in SEED_NAME.encode('utf-8'):
        value = ((value ^ byte) * 16777619) & 0xffffffff
    return value


def reconnaissance(page):
    return page.evaluate('window.__sceneQA.reconnaissance')


def open_city_terminal(page):
    conversation = page.locator('.mosaic-resident-dialogue')
    if conversation.count():
        conversation.locator('[data-dialogue-journal]').click()
        expect(conversation).to_have_count(0)
    if not page.get_by_role('dialog').count():
        page.get_by_role('button', name='TERMINAL · JOURNAL', exact=True).click()
    expect(page.locator('[data-reconnaissance-objective]')).to_be_visible()


def begin_walk_proof(button):
    button.evaluate("""button => {
      const read = () => { const s = window.__sceneQA.state();
        return {t:s.t,x:s.player.x,y:s.player.y,speed:s.player.speed}; };
      const proof = {samples:[]}; window.__reconnaissanceMotion = proof;
      let frame = 0, active = false;
      const capture = event => {if(event.composedPath().includes(button))proof.clickBefore=read();};
      const observe = () => {if(!active)return;proof.samples.push(read());frame=requestAnimationFrame(observe);};
      const bubble = event => {if(event.composedPath().includes(button)){
        proof.clickAfter=read();active=true;frame=requestAnimationFrame(observe);
      }};
      document.addEventListener('click',capture,true);window.addEventListener('click',bubble);
      window.__stopReconnaissanceMotion = () => {
        active=false;cancelAnimationFrame(frame);proof.samples.push(read());
        document.removeEventListener('click',capture,true);window.removeEventListener('click',bubble);
        return proof;
      };
    }""")


def remount_city_checkpoint(page, saved_progress, out, name):
    """Observe both passive checkpoint publication and the restored scene.

    Removing the scene DOM does not mean that React has finished its passive
    cleanup or committed the parent's savedLocation state. Compare against the
    player before unmount, then await each real callback/render boundary instead
    of reading an older checkpoint or the new component's initial ref.
    """
    proof = {'beforeUnmount': page.evaluate("""() => ({
      snapshot:window.__sceneQA.snapshot(), saved:window.__sceneQA.saved,
      saveCount:window.__sceneQA.saves.length, clock:performance.now()
    })""")}
    try:
        page.locator('#qa-unmount').click()
        expect(page.locator('.mosaic-rpg-panel')).to_have_count(0)
        page.wait_for_function('count => window.__sceneQA.saves.length > count',
                               arg=proof['beforeUnmount']['saveCount'], polling=50)
        checkpoint = page.evaluate('window.__sceneQA.saves.at(-1)')
        proof['publishedCheckpoint'] = checkpoint
        page.wait_for_function('checkpoint => JSON.stringify(window.__sceneQA.saved) === JSON.stringify(checkpoint)',
                               arg=checkpoint, polling=50)
        proof['afterUnmount'] = page.evaluate("""() => ({
          saved:window.__sceneQA.saved, saveCount:window.__sceneQA.saves.length,
          clock:performance.now()
        })""")
        before = proof['beforeUnmount']['snapshot']['player']
        check(checkpoint['districtId'] == DISTRICT, 'unmount checkpoint changed district')
        check(abs(checkpoint['player']['x'] - before['x']) < .02 and
              abs(checkpoint['player']['y'] - before['y']) < .02 and
              checkpoint['player']['facing'] == before['facing'],
              'unmount checkpoint does not match the player before leaving')
        page.evaluate('window.__sceneQA.remount()')
        # NPC initialization is a passive effect after location restoration.
        # The player ref already exists during render, before either effect.
        page.wait_for_function('window.__sceneQA.state()?.npcs?.length', polling=50)
        proof['afterRemount'] = page.evaluate("""() => ({
          snapshot:window.__sceneQA.snapshot(), saved:window.__sceneQA.saved,
          saveCount:window.__sceneQA.saves.length, clock:performance.now()
        })""")
        check(reconnaissance(page) == saved_progress, 'remount lost the completed resident objective')
        restored = proof['afterRemount']['snapshot']['player']
        check(abs(restored['x'] - checkpoint['player']['x']) < .02 and
              abs(restored['y'] - checkpoint['player']['y']) < .02 and
              restored['facing'] == checkpoint['player']['facing'], 'remount lost the checkpoint position')
        check(proof['beforeUnmount']['clock'] == proof['afterUnmount']['clock'] == proof['afterRemount']['clock'],
              'virtual clock advanced while observing the checkpoint restoration')
        proof['passed'] = True
        return proof
    finally:
        (out / f'{name}-remount-checkpoint.json').write_text(json.dumps(proof, indent=2, ensure_ascii=False))


def city_reconnaissance(page, lang, out, name):
    later = page.get_by_role('button', name='Plus tard' if lang == 'fr' else 'Later', exact=True)
    if later.is_visible():
        later.click()
    # Prepare the district only before accepting a mission, just as the existing
    # service fixture prepares its initial entry point. No later position writes.
    page.locator('#qa-unmount').click()
    expect(page.locator('.mosaic-rpg-panel')).to_have_count(0)
    page.evaluate('location => window.__sceneQA.setLocation(location)', {
        'districtId': DISTRICT, 'zoneId': DISTRICT,
        'player': {'x': 820, 'y': 760, 'facing': 1}
    })
    page.wait_for_function('id => window.__sceneQA.saved?.districtId === id', arg=DISTRICT)
    page.evaluate('window.__sceneQA.remount()')
    page.wait_for_function('window.__sceneQA.state()?.npcs?.length')
    open_city_terminal(page)
    page.locator('[data-reconnaissance="start"]').click()
    page.wait_for_function('id => window.__sceneQA.reconnaissance?.activeDistrictId === id', arg=DISTRICT)
    expect(page.locator('[data-reconnaissance="approach"]')).to_be_visible()
    page.screenshot(path=str(out / f'{name}-accepted.png'))
    walks = []
    restoration = None
    for field in ['residentId', 'exhibitId', 'completed']:
        open_city_terminal(page)
        before = reconnaissance(page)
        check(not before['dossiers'][DISTRICT][field], f'{field} completed before its interaction')
        button = page.locator('[data-reconnaissance="approach"]')
        begin_walk_proof(button)
        button.click()
        try:
            for _ in range(180):
                page.clock.run_for(100)
                if reconnaissance(page)['dossiers'][DISTRICT][field]:
                    break
            check(reconnaissance(page)['dossiers'][DISTRICT][field], f'{field} was not reached through ordinary movement')
        finally:
            proof = page.evaluate('window.__stopReconnaissanceMotion()')
            (out / f'{name}-{field}-motion.json').write_text(json.dumps(proof, indent=2))
        walks.append({'step': field, **validate_mosaic_motion(proof)})
        open_city_terminal(page)
        page.screenshot(path=str(out / f'{name}-{field}.png'))
        if field == 'residentId':
            # Recreate the real component after the first completed objective.
            saved_progress = reconnaissance(page)
            page.keyboard.press('Escape')
            restoration = remount_city_checkpoint(page, saved_progress, out, name)
    complete = reconnaissance(page)
    check(complete['activeDistrictId'] is None, 'completed dossier remained active')
    check(complete['dossiers'][DISTRICT]['completed'] is True, 'report not archived')
    expect(page.locator('[data-reconnaissance="start"], [data-reconnaissance="approach"]')).to_have_count(0)
    saves = page.evaluate('window.__sceneQA.reconnaissanceSaves')
    check(len(saves) == 4, f'expected acceptance and three unique progress commits, got {len(saves)}')
    page.keyboard.press('Escape')
    page.locator('.mosaic-rpg-canvas').focus()
    page.keyboard.press('e')
    check(page.evaluate('window.__sceneQA.reconnaissanceSaves.length') == len(saves), 'repeated report produced another commit')
    check(not page.evaluate('window.__sceneQA.reports.length'), 'City reconnaissance produced a combat reward report')
    check(not page.evaluate('window.__sceneQA.services.length'), 'reconnaissance unexpectedly opened a service')
    return {'districtId': DISTRICT, 'dossier': complete['dossiers'][DISTRICT], 'walks': walks,
            'progressCommits': len(saves), 'restoredAfterResident': True, 'repeatedReportIgnored': True,
            'restorationProof': restoration,
            'preparedOwnership': True, 'preparedInitialDistrict': True, 'combatRewardReports': 0}


def operation_state(page):
    current = state(page)
    extra = page.evaluate("""() => {const s=window.__sceneQA.state();return {
      relay:s.relayOperation ? {activeBeaconId:s.relayOperation.activeBeaconId,beacons:s.relayOperation.beacons} : null,
      relayOwnerMatches:!s.relayOperation || s.relayOperation.runId===s.runId,
      relaySummary:s.relaySummary || null
    };}""")
    return {**current, **extra}


def check_relay_hud_geometry(page, label, expected_text_scale='1.4'):
    result = page.evaluate("""label => {
      const state=window.__sceneQA.state();
      if(state?.phase!=='running')return {label,skipped:true,phase:state?.phase};
      const canvas=document.querySelector('.fps-royale-canvas');
      const strip=document.querySelector('.extinction-objective-strip');
      const dock=document.querySelector('.extinction-hud-dock');
      const relay=document.querySelector('[data-relay-status]');
      const layout=window.__sceneQA.hudLayout();
      if(!canvas||!strip||!dock||!relay||!layout?.fpsRadar)return {label,missing:true};
      const rect=node=>{const r=node.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};
      const c=rect(canvas),s=rect(strip),d=rect(dock),r=rect(relay);
      const halfX=12*c.width/canvas.width+2,halfY=12*c.height/canvas.height+2;
      const reticle={x:c.x+c.width/2-halfX,y:c.y+c.height/2-halfY,
        right:c.x+c.width/2+halfX,bottom:c.y+c.height/2+halfY,width:halfX*2,height:halfY*2};
      // Read the actual useSceneViewport layout used by the Canvas renderer,
      // including its 1.8px radar stroke, rather than restating its layout math.
      const radar=layout.fpsRadar,radarRadius=radar.radius+.9;
      const radarBounds={x:c.x+(radar.x-radarRadius)*c.width/canvas.width,
        y:c.y+(radar.y-radarRadius)*c.height/canvas.height,
        right:c.x+(radar.x+radarRadius)*c.width/canvas.width,
        bottom:c.y+(radar.y+radarRadius)*c.height/canvas.height};
      const intersects=(a,b)=>Math.min(a.right,b.right)-Math.max(a.x,b.x)>1
        && Math.min(a.bottom,b.bottom)-Math.max(a.y,b.y)>1;
      const within=(a,b)=>a.x>=b.x-1&&a.y>=b.y-1&&a.right<=b.right+1&&a.bottom<=b.bottom+1;
      const viewport={x:0,y:0,right:innerWidth,bottom:innerHeight};
      const visible=node=>{
        const box=rect(node);
        if(!box.width||!box.height)return false;
        for(let ancestor=node;ancestor;ancestor=ancestor.parentElement){
          const css=getComputedStyle(ancestor);
          if(css.display==='none'||css.visibility==='hidden'||css.visibility==='collapse'
            ||Number(css.opacity)===0)return false;
        }
        return true;
      };
      const buttonTextProof=__BUTTON_TEXT_PROOF__;
      // The dock and its layout groups are transparent. Test the painted
      // buttons and stat cards individually, so empty grid space remains free.
      // Hit-testing does not click a control or consume a simulation tick.
      const dockControls=Array.from(dock.querySelectorAll('button')).map((button,index)=>{
        const box=rect(button),shown=visible(button);
        const enabled=!button.disabled&&!button.closest('[inert]')&&button.getAttribute('aria-disabled')!=='true';
        const hit=document.elementFromPoint(box.x+box.width/2,box.y+box.height/2);
        const centerHit=!!hit&&button.contains(hit);
        return {index,label:(button.getAttribute('aria-label')||button.textContent).trim(),...box,
          visible:shown,enabled,centerHit,clickable:shown&&enabled&&centerHit,
          insideViewport:within(box,viewport),minimumTouchTarget:box.width>=44&&box.height>=44,
          reticleClear:!intersects(box,reticle),radarClear:!intersects(box,radarBounds),
          text:buttonTextProof(button)};
      });
      const dockStatCards=Array.from(dock.querySelectorAll('.nexus-play-stats > span')).map((card,index)=>{
        const box=rect(card);
        return {index,label:card.textContent.trim(),...box,visible:visible(card),
          insideViewport:within(box,viewport),reticleClear:!intersects(box,reticle),radarClear:!intersects(box,radarBounds)};
      });
      const dockReticleOverlaps=[
        ...dockControls.filter(control=>control.visible&&!control.reticleClear).map(control=>({kind:'button',...control})),
        ...dockStatCards.filter(card=>card.visible&&!card.reticleClear).map(card=>({kind:'stat',...card}))
      ];
      const dockRadarOverlaps=[
        ...dockControls.filter(control=>control.visible&&!control.radarClear).map(control=>({kind:'button',...control})),
        ...dockStatCards.filter(card=>card.visible&&!card.radarClear).map(card=>({kind:'stat',...card}))
      ];
      const textRects=[];const walker=document.createTreeWalker(strip,NodeFilter.SHOW_TEXT);
      let node;
      while((node=walker.nextNode())){
        if(!node.textContent.trim())continue;
        const range=document.createRange();range.selectNodeContents(node);
        for(const box of range.getClientRects())if(box.width&&box.height){
          textRects.push({text:node.textContent.trim(),x:box.x,y:box.y,right:box.right,bottom:box.bottom});
        }
      }
      const style=getComputedStyle(document.documentElement);
      return {label,phase:state.phase,relayStatus:relay.dataset.relayStatus,canvas:c,strip:s,dock:d,reticle,
        dockControls,dockStatCards,dockReticleOverlaps,dockRadarOverlaps,
        // Anchor has four primary, three protocol and six movement controls.
        dockControlsComplete:dockControls.length===13,
        dockControlsVisible:dockControls.every(control=>control.visible),
        dockControlsInsideViewport:dockControls.every(control=>control.insideViewport),
        dockControlsMinimumTouchTarget:dockControls.every(control=>control.minimumTouchTarget),
        dockControlsHitTest:dockControls.every(control=>!control.enabled||control.clickable),
        dockControlsTextVisible:dockControls.every(control=>control.text.fullyVisible),
        dockStatsVisible:dockStatCards.length===8&&dockStatCards.every(card=>card.visible&&card.insideViewport),
        dockReticleClear:dockReticleOverlaps.length===0,
        dockRadarClear:dockRadarOverlaps.length===0,
        radar:radarBounds,radarLayout:radar,
        viewport:{width:innerWidth,height:innerHeight},hudScale:style.getPropertyValue('--game-hud-scale').trim(),
        textScale:style.getPropertyValue('--game-text-scale').trim(),safeArea:style.getPropertyValue('--game-safe-area').trim(),
        visible:s.width>0&&s.height>0&&r.width>0&&r.height>0,
        stripInsideViewport:within(s,viewport),relayInsideStrip:within(r,s),
        reticleClear:!intersects(s,reticle),dockClear:!intersects(s,d),radarClear:!intersects(s,radarBounds),
        clippedText:textRects.filter(box=>!within(box,s)||!within(box,viewport)),textRects};
    }""".replace('__BUTTON_TEXT_PROOF__', BUTTON_TEXT_PROOF_JS), label)
    check(not result.get('skipped') and not result.get('missing'), f'active relay HUD unavailable: {result}')
    check(result['hudScale'] == '1.4' and result['textScale'] == expected_text_scale and result['safeArea'] == '32px',
          f'relay HUD accessibility scale was not applied: {result}')
    for field in ['visible', 'stripInsideViewport', 'relayInsideStrip', 'reticleClear', 'dockClear', 'radarClear']:
        check(result[field], f'relay HUD geometry failed ({field}): {result}')
    check(not result['clippedText'], f'relay HUD text extends outside its strip or viewport: {result}')
    for field in ['dockControlsComplete', 'dockControlsVisible', 'dockControlsInsideViewport',
                  'dockControlsMinimumTouchTarget', 'dockControlsHitTest', 'dockControlsTextVisible',
                  'dockStatsVisible', 'dockReticleClear', 'dockRadarClear']:
        check(result[field], f'FPS dock geometry failed ({field}): {result}')
    return result


def relay_full_run(page, lang, out, name, record, hooks=None):
    # Optional real-Hub integration hooks; historical isolated-scene calls keep
    # their preparation, controls, report assertions and trace shape unchanged.
    hooks = hooks or {}
    # Prepare actual display preferences while the scene is still ready, before
    # the fixed replay clock and seed. No gameplay tick is consumed here.
    if hooks.get('prepare'):
        record['clockPrepared'] = hooks['prepare'](page)
    else:
        page.evaluate("""async () => {
      const root=document.documentElement;
      root.style.setProperty('--game-hud-scale','1.4');root.style.setProperty('--game-text-scale','1.4');
      root.style.setProperty('--game-safe-area','32px');
      window.dispatchEvent(new Event('multiverse:display-preferences'));
      await document.fonts.ready;
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
        }""")
        record['clockPrepared'] = prepare_fps_clock(page)
        page.locator('input[data-relay-operation]').check()
    page.clock.run_for(32)
    seed = hooks.get('seed', relay_seed())
    page.evaluate('seed => window.__sceneQA.prepareReplay(seed)', seed)
    trace = []
    digest = hashlib.sha256()

    def observe(action):
        current = operation_state(page)
        if hooks.get('state'):
            current.update(hooks['state'](page, current))
        check(current['relayOwnerMatches'], 'relay progress belongs to another run')
        entry = {'action': action, 'state': current, 'random': page.evaluate('window.__sceneQA.replayRandom()')}
        trace.append(entry)
        digest.update((json.dumps(entry, sort_keys=True, separators=(',', ':'), ensure_ascii=False) + '\n').encode('utf-8'))
        return current

    probed = False
    secured_proof = {}
    record['hudGeometry'] = []
    try:
        page.get_by_role('button', name='DEMARRER RUN' if lang == 'fr' else 'START RUN', exact=True).click()
        page.wait_for_function('window.__sceneQA.state().phase === "running"')
        page.locator('.fps-royale-canvas').focus()
        current = observe({'kind': 'start'})
        check(current['t'] == 0 and current['relay'] is not None, 'relay operation did not start at tick zero')
        page.clock.run_for(350)
        current = observe({'kind': 'advance', 'milliseconds': 350})
        record['hudGeometry'].append(check_relay_hud_geometry(page, 'active', hooks.get('expectedTextScale', '1.4')))
        actions = 0
        while current['phase'] == 'running' and actions < 650:
            actions += 1
            skill = current['skillCooldown'] == 0
            if skill:
                page.keyboard.press('Shift')
            enemies = [entry for entry in current['enemies'] if entry['hp'] > 0]
            loot = [entry for entry in current['loot'] if not entry.get('used')]
            pickup = next((entry for entry in loot if entry['type'] == 'beacon'), None) if not enemies else None
            if current['reserveAmmo'] < 10 and current['ammo'] < 8:
                pickup = next((entry for entry in loot if entry.get('effect') == 'ammo'), pickup)
            if current['hp'] < 50:
                pickup = next((entry for entry in loot if entry.get('effect') == 'heal'), pickup)
            extra_action = hooks['advance'](page, current) if hooks.get('advance') else None
            if extra_action is not None:
                action = extra_action
            elif pickup:
                distance = math.hypot(pickup['wx'] - current['px'], pickup['wy'] - current['py'])
                relay = (current.get('relay') or {}).get('beacons', {}).get(pickup['id'])
                if distance < 1.15 and relay and relay['status'] == 'synchronizing':
                    if not probed:
                        record['hudGeometry'].append(check_relay_hud_geometry(page, 'synchronizing', hooks.get('expectedTextScale', '1.4')))
                        before_pause = operation_state(page)
                        if hooks.get('pause'):
                            hooks['pause'](page, True)
                        else:
                            page.locator('#qa-pause').click()
                        if hooks.get('rerender'):
                            hooks['rerender'](page)
                        else:
                            page.locator('#qa-render').click()
                        page.clock.run_for(1000)
                        paused = operation_state(page)
                        check(paused['t'] == before_pause['t'] and paused['relay'] == before_pause['relay'],
                              'pause or parent render advanced synchronization')
                        record['hudGeometry'].append(check_relay_hud_geometry(page, 'paused-synchronization', hooks.get('expectedTextScale', '1.4')))
                        page.screenshot(path=str(out / f'{name}-relay-paused.png'))
                        if hooks.get('pause'):
                            hooks['pause'](page, False)
                        else:
                            page.locator('#qa-pause').click()
                        page.locator('.fps-royale-canvas').focus()
                        page.clock.run_for(32)
                        current = observe({'kind': 'relay-pause-resume', 'pausedMilliseconds': 1000, 'resumeMilliseconds': 32})
                        # Walk away by native aim/movement. No position assignment.
                        aim(page, current, pickup['wx'] + 4, pickup['wy'])
                        page.keyboard.down('w'); page.clock.run_for(200); page.keyboard.up('w')
                        page.clock.run_for(100)
                        outside = operation_state(page)
                        check(math.hypot(outside['px'] - pickup['wx'], outside['py'] - pickup['wy']) > 1.25,
                              'perimeter probe did not physically leave the beacon')
                        ticks = outside['relay']['beacons'][pickup['id']]['ticks']
                        page.clock.run_for(350)
                        suspended = operation_state(page)
                        check(suspended['t'] > outside['t'], 'outside-perimeter probe accidentally paused the simulation')
                        check(suspended['relay']['beacons'][pickup['id']]['ticks'] == ticks,
                              'synchronization advanced outside the perimeter')
                        check(suspended['relay']['beacons'][pickup['id']]['inRange'] is False,
                              'relay projection did not expose the suspended perimeter')
                        expect(page.locator('[data-relay-status]')).to_contain_text(
                            'Reviens dans le périmètre' if lang == 'fr' else 'Return to the perimeter')
                        record['hudGeometry'].append(check_relay_hud_geometry(page, 'outside-perimeter', hooks.get('expectedTextScale', '1.4')))
                        record['perimeterProof'] = {'beaconId': pickup['id'], 'pausedMilliseconds': 1000,
                            'outsideTicksBefore': ticks, 'outsideTicksAfter': suspended['relay']['beacons'][pickup['id']]['ticks'],
                            'outsideSimulationTicks': suspended['t'] - outside['t'], 'visibleSuspensionFeedback': True}
                        probed = True
                        action = {'kind': 'leave-relay-perimeter', 'target': pickup['id'], 'milliseconds': 650, 'skill': skill}
                    else:
                        page.clock.run_for(100)
                        action = {'kind': 'synchronize-relay', 'target': pickup['id'], 'milliseconds': 100, 'skill': skill}
                elif distance < 1.15:
                    before_count = current['beacons']
                    page.keyboard.press('e')
                    immediate = operation_state(page)
                    if pickup['type'] == 'beacon' and (not relay or relay['status'] != 'ready'):
                        check(immediate['beacons'] == before_count, 'relay collected before synchronization completed')
                    page.clock.run_for(30)
                    action = {'kind': 'interact-loot', 'target': pickup['id'], 'milliseconds': 30, 'skill': skill}
                else:
                    aim(page, current, pickup['wx'], pickup['wy'])
                    duration = min(250, max(17, int((distance - .8) / .25) * 17))
                    page.keyboard.down('w'); page.clock.run_for(duration); page.keyboard.up('w')
                    page.clock.run_for(70)
                    action = {'kind': 'approach-loot', 'target': pickup['id'], 'milliseconds': duration + 70, 'skill': skill}
            elif enemies and current['ammo'] > 0 and current['reloadPulse'] == 0:
                drones = [enemy for enemy in enemies if enemy['kind'] == 'Drone Protecteur']
                target = min(drones or enemies, key=lambda enemy: math.hypot(enemy['wx'] - current['px'], enemy['wy'] - current['py']))
                aim(page, current, target['wx'], target['wy'])
                protocol = current.get('protocols') or {}
                kit, cooldowns = protocol.get('actions') or {}, protocol.get('cooldowns') or {}
                distance = math.hypot(target['wx'] - current['px'], target['wy'] - current['py'])
                commands = []
                for slot, key, allowed in [
                    ('defense', 'c', distance < 5),
                    ('secondary', 'f', distance <= kit.get('secondary', {}).get('range', 0)),
                    ('special', 'x', protocol.get('charge', 0) >= 100 and distance <= kit.get('special', {}).get('range', 0))
                ]:
                    if kit.get(slot) and cooldowns.get(slot, 0) <= 0 and allowed:
                        page.keyboard.press(key); commands.append(slot)
                primary = kit.get('simple') or {}
                melee = current.get('weaponType') == 'pistol' and primary.get('kind') == 'melee'
                if melee and distance > primary['range'] * .9:
                    duration = min(180, max(17, int((distance - primary['range'] * .85) / .25) * 17))
                    page.keyboard.down('w'); page.clock.run_for(duration); page.keyboard.up('w')
                    action = {'kind': 'approach-melee', 'target': target['id'], 'milliseconds': duration, 'skill': skill, 'protocolCommands': commands}
                else:
                    duration = max(350, math.ceil(primary.get('cooldown', 20) * 1000 / 60) + 17) if melee else 350
                    page.keyboard.press('Space'); page.clock.run_for(duration)
                    action = {'kind': 'fire', 'target': target['id'], 'milliseconds': duration, 'skill': skill, 'protocolCommands': commands}
            elif current['ammo'] < 1 and current['reserveAmmo'] > 0:
                page.keyboard.press('r'); page.clock.run_for(620)
                action = {'kind': 'reload', 'milliseconds': 620, 'skill': skill}
            else:
                page.clock.run_for(350)
                action = {'kind': 'wait', 'milliseconds': 350, 'skill': skill}
            current = observe(action)
            if current['relay']:
                secured = {key: entry for key, entry in current['relay']['beacons'].items() if entry['status'] == 'secured'}
                check(len(secured) == current['beacons'], 'collected beacon count differs from completed synchronization')
                check(all(entry['ticks'] == 180 for entry in secured.values()), 'a secured beacon did not receive 180 active ticks')
                secured_proof.update(secured)
            if actions % 50 == 0:
                print(f'PROGRESS {name}: action {actions}, tick {current["t"]}, HP {current["hp"]}, beacons {current["beacons"]}', flush=True)
        check(probed, 'the run never exercised pause and leaving the relay perimeter')
        check(current['phase'] == 'ended' and current['result'] == 'victory',
              f'optional relay run did not win: phase={current["phase"]}, result={current["result"]}, t={current["t"]}, HP={current["hp"]}')
        check(current['beacons'] == 3 and len(secured_proof) == 3, 'victory without three synchronized beacons')
        check(current['relay'] is None and current['relaySummary'] == {'secured': 3}, 'result did not clean run state and retain the relay summary')
        if hooks.get('result'):
            reports = [hooks['result'](page, current)]
        else:
            reports = page.evaluate('window.__sceneQA.reports')
            check(len(reports) == 1 and reports[0]['reason'] == 'completed' and reports[0]['result'] == 'victory', 'completion report missing or duplicated')
        page.screenshot(path=str(out / f'{name}-victory.png'))
        page.get_by_role('button', name='CONTINUER' if lang == 'fr' else 'CONTINUE', exact=True).click()
        page.clock.run_for(1000)
        if hooks.get('rerender'):
            hooks['rerender'](page)
        else:
            page.locator('#qa-render').click()
        if hooks.get('acknowledged'):
            hooks['acknowledged'](page, reports[0])
        else:
            reports_after = page.evaluate('window.__sceneQA.reports')
            check(len(reports_after) == 2 and reports_after[-1]['reason'] == 'acknowledged', 'result acknowledgement did not exit exactly once')
            check(sum(entry['reason'] == 'completed' for entry in reports_after) == 1, 'acknowledgement produced another reward report')
        check(page.evaluate('window.__sceneQA.state().relayOperation') is None, 'exit retained operation progress')
        record.update(result=current['result'], frames=current['t'], hp=current['hp'], kills=current['kills'],
                      beacons=current['beacons'], inputActions=actions, relayProof=secured_proof,
                      completionReports=1, **({'acknowledgementVerifiedInHub': True} if hooks.get('acknowledged') else {'acknowledgementReports': 1}), rewards=reports[0]['rewards'],
                      injectedEnding=False, preparedOwnership=True, virtualClock=True)
    finally:
        filename = f'{name}-replay.json'
        seed_policy = hooks.get('seedPolicy', f'fnv1a32:{SEED_NAME}')
        (out / filename).write_text(json.dumps({'seed': seed, 'seedPolicy': seed_policy,
            'clockEpoch': CLOCK_START.isoformat(), 'traceDigest': digest.hexdigest(), 'decisionTrace': trace}, indent=2, ensure_ascii=False))
        record.update(seed=seed, seedPolicy=seed_policy, traceDigest=digest.hexdigest(), traceFile=filename)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--url', default='http://127.0.0.1:4173')
    parser.add_argument('--evidence', default='/tmp/city-fps-operations')
    parser.add_argument('--executable')
    parser.add_argument('--offline-dir')
    parser.add_argument('--require-art', action='store_true')
    parser.add_argument('--case', default='')
    parser.add_argument('--replays', type=int, default=2, choices=range(1, 6))
    args = parser.parse_args()
    out = Path(args.evidence); out.mkdir(parents=True, exist_ok=True)
    results = []
    # French portrait has a longer secondary-action label than English. Keep
    # the existing runs and exercise that wrapping with its own fresh replay pair.
    cases = [('city', 1280, 900, 'fr'), ('city', 390, 844, 'en'),
             ('fps', 1280, 900, 'fr'), ('fps', 390, 844, 'en'), ('fps', 844, 390, 'fr'),
             ('fps', 390, 844, 'fr')]
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, args=['--no-sandbox'],
            **({'executable_path': args.executable} if args.executable else {}))
        for kind, width, height, lang in cases:
            scenario = f'{kind}-{width}x{height}-{lang}'
            if args.case and args.case not in scenario:
                continue
            reference = None
            for replay in range(1, (args.replays if kind == 'fps' else 1) + 1):
                name = f'{scenario}-replay-{replay}' if kind == 'fps' else scenario
                print('START ' + name, flush=True)
                context = browser.new_context(viewport={'width': width, 'height': height}, is_mobile=width < 900, has_touch=True)
                page = context.new_page(); page.set_default_timeout(10000)
                errors = []; page.on('pageerror', lambda error: errors.append(str(error)))
                record = {'name': name, 'scenario': scenario, 'passed': False, 'pageErrors': errors}
                try:
                    if kind == 'city':
                        page.clock.install(time=CLOCK_EPOCH); page.clock.pause_at(CLOCK_START)
                    load_scene(page, kind, lang, args)
                    if kind == 'city':
                        record.update(city_reconnaissance(page, lang, out, name))
                    else:
                        record['replay'] = replay
                        relay_full_run(page, lang, out, name, record)
                        if reference is not None:
                            record['matchesFirstReplay'] = record['traceDigest'] == reference['traceDigest']
                            check(record['matchesFirstReplay'], f'same-seed relay replay diverged: {reference["traceFile"]} / {record["traceFile"]}')
                        else:
                            reference = record
                    check(not errors, str(errors))
                    record['passed'] = True
                except Exception as error:
                    record['error'] = str(error)
                    try:
                        page.screenshot(path=str(out / f'{name}-FAILED.png'), timeout=4000)
                    except Exception:
                        pass
                finally:
                    results.append(record)
                    print(json.dumps(record, ensure_ascii=False), flush=True)
                    context.close()
        browser.close()
    report = {'scope': 'Real City interactions and optional FPS relay runs in an isolated fixture. Prepared ownership and initial City entry only. No real account, cloud save, forced completion, or physical-device claim. Completed reports are counted; wallet persistence is covered separately by the Hub callback tests.',
              'fpsReplays': args.replays, 'passed': sum(entry['passed'] for entry in results), 'total': len(results), 'cases': results}
    (out / 'results.json').write_text(json.dumps(report, indent=2, ensure_ascii=False))
    raise SystemExit(0 if results and report['passed'] == report['total'] else 1)


if __name__ == '__main__':
    main()
