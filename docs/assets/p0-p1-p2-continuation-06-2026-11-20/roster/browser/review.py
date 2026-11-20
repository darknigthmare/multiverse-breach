from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from urllib.parse import unquote, urlsplit
import json
import re
import sys
from playwright.sync_api import sync_playwright, expect

fixture = Path(sys.argv[1]).resolve()
public = Path(__file__).resolve().parents[5] / 'public'

class Handler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass
    def translate_path(self, path):
        routed = unquote(urlsplit(path).path).lstrip('/')
        if not routed:
            routed = 'index.html'
        root = fixture if (fixture / routed).exists() else public
        local = (root / routed).resolve()
        return str(local if local.is_relative_to(root) else root / 'missing')

with ThreadingHTTPServer(('127.0.0.1',0), partial(Handler,directory=fixture)) as server:
  Thread(target=server.serve_forever, daemon=True).start()
  base=f'http://127.0.0.1:{server.server_port}'
  scenarios = [
      ('storm','Sable d’Isfet','tempete-rouge-avatar-d-isfet.png', 'Zone autour du lanceur', (1280,840)),
      ('orbital','Frappe orbitale du Silo','moonbase-warden.png', 'Zone autour de la cible', (390,844)),
      ('guard','Écrans obliques','cuirasse-nul-oblique.png','Tout le groupe valide', (1280,840)),
  ]
  checks=[]
  with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    for scenario, name, sprite, area_label, (width,height) in scenarios:
      page=browser.new_page(viewport={'width':width,'height':height}, has_touch=scenario=='orbital')
      page.set_default_timeout(16000)
      errors=[]; missing=[]
      page.on('pageerror',lambda error:errors.append(str(error)))
      page.on('response',lambda r:missing.append([r.status,urlsplit(r.url).path]) if r.status>=400 else None)
      row={'case':scenario,'viewport':[width,height],'missing':missing,'pageErrors':errors}
      try:
        page.goto(f'{base}/index.html?case={scenario}',wait_until='domcontentloaded')
        page.wait_for_function('window.rpgRosterAudit?.engine?.heroes?.length===3')
        page.wait_for_function('(sprite)=>rpgRosterAudit.draws.some(path=>path.endsWith(sprite))',arg=sprite)
        initial=page.evaluate('''scenario => {
          const e=rpgRosterAudit.engine, [source,nearAlly,farAlly]=e.enemies, [first,second,distant]=e.heroes;
          e.enemies.forEach(actor=>{actor.atb=0;actor.state='idle'});
          e.heroes.forEach(actor=>{actor.atb=0;actor.state='idle'});
          e.selectEnemy(source.battleId);
          source.atb=source.specialCharge=100;
          const coords=scenario==='storm'?[[source,700,320],[first,545,320],[second,625,405],[distant,230,320]]
            :scenario==='orbital'?[[source,850,280],[first,440,300],[second,470,365],[distant,225,300]]
            :[[source,760,300],[nearAlly,840,360],[farAlly,510,300]];
          for(const [a,x,y] of coords) Object.assign(a,{x,y,homeX:x,homeY:y});
          return {hp:e.heroes.map(a=>a.currentHp),names:e.heroes.map(a=>a.name),ids:e.heroes.map(a=>a.battleId), foes:e.enemies.map(a=>a.battleId)};
        }''',scenario)
        if scenario=='orbital':
          page.get_by_role('button',name=re.compile(name.upper())).tap()
        else:
          page.keyboard.press('KeyI')
        panel=page.get_by_role('region',name='Ciblage RPG')
        expect(panel.get_by_role('status')).to_contain_text(name)
        expect(panel.get_by_role('status')).to_contain_text(area_label,timeout=1200)
        if scenario=='orbital':
          panel.get_by_role('button',name=re.compile(initial['names'][2])).tap()
          assert page.evaluate('rpgRosterAudit.engine.getTargetingState().previewTargetIds')==initial['ids'][2:]
          panel.get_by_role('button',name=re.compile(initial['names'][1])).tap()
        targeting=page.evaluate('''() => {
          const e=rpgRosterAudit.engine,t=e.getTargetingState();
          return {ids:t.previewTargetIds,shape:t.shape,areaRadius:t.profile.areaRadius,maxDistance:t.profile.range,delivery:t.delivery,effect:t.effect};
        }''')
        expected=(initial['foes'] if scenario=='guard' else initial['ids'])[:2]
        assert targeting['ids']==expected,(targeting,expected)
        if scenario=='orbital':
          page.screenshot(path=fixture/'orbital-preview.jpg',type='jpeg',quality=80)
        confirm = panel.get_by_role('button',name='Confirmer les cibles')
        confirm.tap() if scenario=='orbital' else confirm.click()
        function='rpgRosterAudit.engine.enemies[1]?.rpgGuardTicks > 0' if scenario=='guard' else f'rpgRosterAudit.engine.heroes[1].currentHp < {initial["hp"][1]}'
        page.wait_for_function(function,timeout=3500)
        applied=page.evaluate('''() => {const e=rpgRosterAudit.engine;return {
          heroes:e.heroes.map(a=>a.currentHp), timers:e.enemies.map(a=>a.rpgGuardTicks||0),
          charge:e.enemies[0].specialCharge,
          sourceSheet:rpgRosterAudit.draws
        }}''')
        assert applied['charge']<1
        if scenario=='guard':
          assert applied['heroes']==initial['hp']
          assert min(applied['timers'][:2])>0 and applied['timers'][2]==0
        else:
          assert all(applied['heroes'][i]<initial['hp'][i] for i in range(2)) and applied['heroes'][2]==initial['hp'][2]
        page.evaluate('rpgRosterAudit.unmount()')
        page.wait_for_function('rpgRosterAudit.engine.disposed')
        assert not errors,errors
        row.update(dict(passed=True,initial=initial,targeting=targeting,impact=applied))
      except Exception as error:
        row.update(passed=False,error=str(error))
      finally:
        checks.append(row)
        print(json.dumps(row,ensure_ascii=False),flush=True)
        page.close()
    browser.close()
  server.shutdown()
(fixture/'browser-results.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2)+'\n')
assert all(row['passed'] for row in checks)
