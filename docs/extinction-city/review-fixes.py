from pathlib import Path
p=Path('scripts/browserResidentViewmodels.py')
s=p.read_text()
def replace(old,new):
 global s
 assert s.count(old)==1,(old[:90],s.count(old))
 s=s.replace(old,new)
replace("        target.scroll_into_view_if_needed()", "        target.scroll_into_view_if_needed()\n        resident_name=target.locator('strong').inner_text()")
replace("        log=page.locator('.mosaic-rpg-log span').inner_text()\n        check('synchroniz' in log or 'synchronise' in log,'resident not reached through normal movement')\n        page.get_by_role('button',name='TERMINAL · JOURNAL',exact=True).click()", "        page.get_by_role('button',name='TERMINAL · JOURNAL',exact=True).click()\n        log=page.locator('.mosaic-rpg-log span').inner_text()\n        expected=resident_name+(' synchronise sa Trame' if fr else ' synchronizes their Thread')\n        check(log.startswith(expected),f'resident not reached through normal movement: {identity}: {log}')")
replace("        page.locator('.mosaic-resident-directory summary').click()", "        directory=page.locator('.mosaic-resident-directory')\n        if not directory.evaluate('e=>e.open'):directory.locator('summary').click()")
replace("    page.clock.run_for(50)\n    page.locator('.fps-royale-canvas').focus();page.keyboard.press('Space');page.clock.run_for(100)", "    # Respect the existing initial fire cooldown; never force ammunition or timers.\n    page.clock.run_for(450)\n    before_ammo=page.evaluate('window.__sceneQA.state().weapon.ammo')\n    page.locator('.fps-royale-canvas').focus();page.keyboard.press('Space');page.clock.run_for(100)\n    check(page.evaluate('window.__sceneQA.state().weapon.ammo')==before_ammo-1,'native fire did not consume one round')")
replace("    page.clock.run_for(650);page.keyboard.press('r');page.clock.run_for(80)", "    page.clock.run_for(650)\n    check(page.evaluate('window.__sceneQA.state().muzzle')==0,'fire phase still active before reload')\n    page.locator('.fps-royale-canvas').focus();page.keyboard.press('r');page.clock.run_for(80)\n    check(page.evaluate('window.__sceneQA.state().reloadPulse')>0,'native reload phase was not entered')\n    check(page.evaluate('window.__sceneQA.state().weapon.ammo')==before_ammo,'reload did not restore the spent round')")
replace("        cell_h=1536/10\n        check(any('fps-hands' in d['src'] and abs(d['args'][1]-(6*cell_h+40))<.001 and abs(d['args'][3]-(cell_h-46))<.001 for d in reload)", "        check(any('fps-hands' in d['src'] and abs(d['args'][1]-(6*d['height']/10+40))<.001 and abs(d['args'][3]-(d['height']/10-46))<.001 for d in reload)")
replace("('arca_mirelle',390,844,'en')", "('arca_mirelle',1280,900,'fr'),('arca_mirelle',390,844,'en')")
p.write_text(s)
