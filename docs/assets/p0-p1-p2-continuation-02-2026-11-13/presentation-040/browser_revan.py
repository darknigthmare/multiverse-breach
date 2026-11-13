"""Prepared duel outcomes, real Fighter/Smash simulation and real bitmap draws.

Before uses three exact Git9899 presentation modules with the same QA harness
and current unchanged Revan media. It is not an archived whole-app build.
"""
import hashlib
import json
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
SHEET = '/sprites/generated/combat-character-corrections-wave13-part-b/darth_revan.png'
EXPECTED_SHA = 'c9f46d3fc0e0144afab53632c1be6d07508975645b2b2bfff30478e5e5fb1fbf'

SUMMARY = '''() => {
  const a=window.__revanPresentation,e=a.engine,side=new URLSearchParams(location.search).get('side')==='cpu'?'cpu':'player';
  if(a.mode==='Fighter'){
    const s=e.getSnapshot(),entry=s.presentation?.entries.find(x=>x.side===side);
    return {phase:s.phase,remaining:s.presentation?.remaining,actorPhase:entry?.actorPhase,
      script:entry?.script?{id:entry.script.id,sample:entry.script.sample}:null,
      entries:s.presentation?.entries.map(x=>({side:x.side,actorPhase:x.actorPhase,pose:x.script?{progress:x.script.sample.progress,row:x.script.sample.asset.row,col:x.script.sample.asset.col}:null})),
      hp:['player','cpu'].map(c=>e.getActive(c).currentHp),meter:['player','cpu'].map(c=>e.getActive(c).meter),
      completed:a.completed.length,disposed:e.disposed};
  }
  const s=a.snapshot();return {phase:s.phase,stateElapsed:s.stateElapsed,actor:s.actor,view:s.view,
    script:s.script,completed:s.completed,disposed:s.disposed};
}'''


def main():
    out = HERE / 'validation/browser'
    out.mkdir(parents=True, exist_ok=True)
    cases = []
    combos = [('before', 'Fighter', 'player', 1280), ('after', 'Fighter', 'player', 1280),
              ('after', 'Fighter', 'cpu', 1280), ('after', 'Fighter', 'player', 390),
              ('before', 'Smash', 'player', 1280), ('after', 'Smash', 'player', 1280),
              ('after', 'Smash', 'cpu', 1280), ('after', 'Smash', 'player', 390),
              ('before-invalid', 'Fighter', 'player', 1280), ('after-invalid', 'Fighter', 'player', 1280)]
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        for revision, mode, side, width in combos:
            invalid = revision.endswith('-invalid')
            actual_revision = revision.split('-')[0]
            label = f'{revision}-{mode.lower()}-{side}-{width}'
            errors, http_errors, media = [], [], []
            context = browser.new_context(viewport={'width': width, 'height': 900}, reduced_motion='reduce')
            context.add_init_script('''
              window.__revanDraws=[];
              const original=CanvasRenderingContext2D.prototype.drawImage;
              CanvasRenderingContext2D.prototype.drawImage=function(image,...args){
                const src=image.currentSrc||image.src||'';
                if(src.includes('/darth_revan.png')){
                  const t=this.getTransform();window.__revanDraws.push({src,args,transform:{a:t.a,d:t.d,e:t.e,f:t.f}});
                  if(window.__revanDraws.length>2000)window.__revanDraws.splice(0,1000);
                }
                return original.call(this,image,...args);
              };
            ''')
            context.route('**/*', lambda route: route.continue_() if urlparse(route.request.url).hostname in ('127.0.0.1', 'localhost', '::1') else route.abort())
            page = context.new_page()
            page.set_default_timeout(30000)
            page.on('pageerror', lambda error: errors.append(str(error)))

            def on_response(response):
                path = urlparse(response.url).path
                if path == SHEET:
                    media.append({'path': path, 'status': response.status,
                                  'sha256': hashlib.sha256(response.body()).hexdigest() if response.status == 200 else None})
                if response.status >= 400:
                    http_errors.append({'path': path, 'status': response.status})

            page.on('response', on_response)
            port = 4204 if actual_revision == 'before' else 4205
            page.goto(f'http://127.0.0.1:{port}/scripts/fixtures/reviewed-revan-presentation.html?mode={mode}&side={side}' + ('&variant=invalid-composite' if invalid else ''))
            page.wait_for_function('window.__revanPresentation?.engine')
            if invalid:
                page.wait_for_load_state('networkidle')
                page.evaluate('window.__revanDraws=[];window.__revanPresentation.draw()')
                state=page.evaluate(SUMMARY)
                draws=page.evaluate('window.__revanDraws')
                if actual_revision=='before':
                    assert state['script'] and draws and media, state
                    assert all(urlparse(d['src']).path==SHEET for d in draws)
                else:
                    assert state['script'] is None and not draws and not media, (state,draws,media)
                page.screenshot(path=str(out/f'{label}-intro.png'),full_page=True)
                page.locator('#qa-dispose').click()
                assert page.evaluate('window.__revanPresentation.engine.disposed')
                assert not errors and not http_errors,(errors,http_errors)
                cases.append({'label':label,'passed':True,'invalidComposite':True,'state':state,'draws':draws,'media':media,'pageErrors':errors,'httpErrors':http_errors})
                context.close()
                continue
            page.wait_for_function('window.__revanDraws.length>0')

            def sample(name):
                page.evaluate('window.__revanDraws=[];window.__revanPresentation.draw()')
                state = page.evaluate(SUMMARY)
                state['draws'] = page.evaluate('window.__revanDraws')
                assert state['draws'], (label, name, state)
                assert all(urlparse(d['src']).path == SHEET for d in state['draws']), state
                if width == 1280 or name in ('intro', 'victory'):
                    page.screenshot(path=str(out / f'{label}-{name}.png'), full_page=True)
                return state

            intro = sample('intro')
            page.evaluate('window.__revanPresentation.advance(30)')
            intro_later = sample('intro-later')
            page.locator('#qa-pause').click()
            paused = page.evaluate(SUMMARY)
            page.evaluate('window.__revanPresentation.advance(60)')
            assert page.evaluate(SUMMARY) == paused
            page.locator('#qa-pause').click()
            assert not page.evaluate('window.__revanPresentation.engine.paused')
            if revision == 'after':
                assert intro['script']['sample']['asset']['sheet'] == SHEET, intro
                assert intro['script']['sample']['asset']['row'] == 1
                assert intro['draws'][-1]['args'][1] == 256

            page.locator('#qa-result').click()
            if mode == 'Fighter':
                page.evaluate('''() => {const a=window.__revanPresentation;for(let i=0;i<600&&a.engine.getSnapshot().phase!=='victory';i++)a.advance(1);}''')
                page.evaluate('window.__revanPresentation.advance(60)')
                victory = sample('victory')
                if revision == 'before':
                    assert victory['script']['sample']['asset']['rows'] == 8
                    assert victory['script']['sample']['asset']['row'] == 5
                    assert victory['draws'][-1]['args'][1] == 768, victory
                else:
                    assert victory['script']['sample']['asset']['sheet'] == SHEET
                    assert victory['script']['sample']['asset']['row'] == 0
                    assert victory['draws'][-1]['args'][1] == 0, victory
                page.evaluate('''() => {const a=window.__revanPresentation;for(let i=0;i<600&&a.engine.getSnapshot().phase!=='outro';i++)a.advance(1);}''')
                page.evaluate('window.__revanPresentation.advance(54)')
                outro = sample('outro')
                loser = 'cpu' if side == 'player' else 'player'
                loser_phase = next(e['actorPhase'] for e in outro['entries'] if e['side'] == loser)
                assert loser_phase == ('outro' if revision == 'before' else 'defeat')
                if revision == 'after':
                    ko_pose=next(e['pose'] for e in outro['entries'] if e['side']==loser)
                    assert ko_pose and ko_pose['progress']==1, outro
                    page.evaluate('window.__revanPresentation.advance(20)')
                    later=page.evaluate(SUMMARY)
                    assert next(e['pose'] for e in later['entries'] if e['side']==loser)==ko_pose
                    assert outro['script']['sample']['asset']['sheet'] == SHEET
                    assert outro['script']['sample']['asset']['row'] == 1
                    assert outro['draws'][-1]['args'][1] == 256
                page.evaluate('window.__revanPresentation.advance(360)')
                assert page.evaluate('window.__revanPresentation.completed.length') == 1
                page.evaluate('window.__revanPresentation.advance(240)')
                assert page.evaluate('window.__revanPresentation.completed.length') == 1
            else:
                page.evaluate('window.__revanPresentation.advance(45)')
                victory = sample('victory')
                outro = None
                if revision == 'after':
                    assert victory['view']['presentationPhase'] == 'victory'
                    assert victory['view']['presentationFrame']['row'] == 0
                    assert victory['script']['sample']['asset']['sheet'] == SHEET
                    assert victory['draws'][-1]['args'][1] == 0
            page.locator('#qa-dispose').click()
            disposed = page.evaluate(SUMMARY)
            assert disposed['disposed']
            completion = disposed['completed']
            page.evaluate('window.__revanPresentation.advance(360)')
            assert page.evaluate('window.__revanPresentation.completed.length') == completion
            assert media and all(m['status'] == 200 and m['sha256'] == EXPECTED_SHA for m in media), media
            assert not errors, errors
            assert not http_errors, http_errors
            cases.append({'label': label, 'passed': True, 'intro': intro, 'introLater': intro_later,
                          'victory': victory, 'outro': outro, 'disposed': disposed,
                          'media': media, 'pageErrors': errors, 'httpErrors': http_errors,
                          'canvas': page.locator('#qa-canvas').evaluate('(el)=>({width:el.width,height:el.height,css:el.getBoundingClientRect().toJSON()})')})
            context.close()
        browser.close()
    (out / 'results.json').write_text(json.dumps({'scope': __doc__, 'cases': cases, 'passed': len(cases)}, indent=2) + '\n')
    print(json.dumps({'passed': len(cases), 'captures': len(list(out.glob('*.png'))), 'output': str(out)}))


if __name__ == '__main__':
    main()
