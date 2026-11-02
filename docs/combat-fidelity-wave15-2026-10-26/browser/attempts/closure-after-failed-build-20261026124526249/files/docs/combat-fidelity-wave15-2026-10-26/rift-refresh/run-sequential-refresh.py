#!/usr/bin/env python3
"""Two explicit W15 phases; this runner never edits the historical audit sources."""
import argparse
from datetime import datetime, timezone
from hashlib import sha256
import json
from pathlib import Path
import subprocess
import threading
import time

ROOT = Path(__file__).resolve().parents[3]
LOG = Path(__file__).resolve().parent
COMMANDS = [
    ('01-catalog-refresh', ['node', 'scripts/buildRiftDossierCatalog.mjs', '--refresh-character-reference-audit']),
    ('02-character-reference-audit', ['python', 'scripts/auditCharacterReferenceQuality.py']),
    ('03-catalog-build', ['node', 'scripts/buildRiftDossierCatalog.mjs']),
    ('04-asset-registry-build', ['node', 'scripts/buildRiftDossierAssetRegistry.mjs']),
    ('05-rift-audit', ['npm', 'run', 'rift:audit']),
]
SOURCES = ['scripts/buildRiftDossierCatalog.mjs', 'scripts/auditCharacterReferenceQuality.py',
           'scripts/buildRiftDossierAssetRegistry.mjs', 'package.json']
OUTPUTS = ['docs/rift-dossiers/catalog.json', 'docs/rift-dossiers/character-reference-quality.json',
           'src/game/riftDossierAssets.json']


def now():
    return datetime.now(timezone.utc).isoformat()


def read(path):
    return json.loads((ROOT / path).read_text())


def digest(path):
    return sha256((ROOT / path).read_bytes()).hexdigest()


def hashes(paths):
    return {path: digest(path) for path in paths}


def stamp(value):
    return datetime.fromisoformat(value.replace('Z', '+00:00'))


def verify_preparation():
    preparation = json.loads((LOG / 'preparation-only.json').read_text())
    baseline = read('docs/combat-fidelity-wave15-2026-10-26/baseline-current-wave14.json')
    previous_path = 'docs/combat-fidelity-wave14-2026-10-25/rift-refresh/result.json'
    assert digest(previous_path) == baseline['inputHashes'][previous_path]
    previous = read(previous_path)
    assert previous['success'] is True
    for source in SOURCES[:-1]:
        assert digest(source) == previous['sourceSha256After'][source], 'Historical source drift: ' + source
    assert digest('scripts/auditCharacterReferenceQuality.py') == preparation['historicalPythonSha256']
    for snapshot in preparation['snapshots']:
        assert digest(snapshot['snapshot']) == snapshot['sha256'], 'Immutable snapshot changed'
    for name, expected in preparation['helpers'].items():
        assert sha256((LOG / name).read_bytes()).hexdigest() == expected, 'Prepared helper changed: ' + name
    return preparation


def verify_authorization():
    authorization = json.loads((LOG / 'authorization.json').read_text())
    assert authorization['authorized'] is True and authorization['referenceInputsFrozen'] is True
    assert digest('package.json') == authorization['packageSha256'], 'Frozen package changed'
    references = authorization['references']
    selected = {hero['hero']['id'] for hero in read('docs/combat-fidelity-wave15-2026-10-26/batch-plan-before.json')['heroes']}
    assert len(references) == len(selected) == 120
    assert {reference['id'] for reference in references} == selected
    for reference in references:
        assert reference['sheet'].startswith('/sprites/') and '..' not in reference['sheet']
        assert digest('public' + reference['sheet']) == reference['sha256'], reference['id']
    return authorization


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    phase = parser.add_mutually_exclusive_group()
    phase.add_argument('--references-only', action='store_true')
    phase.add_argument('--final-writes', action='store_true')
    parser.add_argument('--check-only', action='store_true')
    args = parser.parse_args()
    preparation = verify_preparation()
    if args.check_only:
        authorized = (LOG / 'authorization.json').exists()
        if authorized:
            verify_authorization()
        print(json.dumps({'checkOnly': True, 'commandsExecuted': [], 'historicalSourcesUnchanged': True,
                          'snapshotsVerified': len(preparation['snapshots']), 'authorizationPresent': authorized}))
        return
    if not args.references_only and not args.final_writes:
        parser.error('Select --references-only after root reference freeze, or --final-writes after the browser gate.')
    authorization = verify_authorization()
    target = LOG / 'result.json'
    if args.references_only:
        assert not target.exists(), 'Preserve an existing execution; never silently rerun completed commands'
        for snapshot in preparation['snapshots']:
            assert digest(snapshot['source']) == snapshot['sha256'], 'Production changed before authorized initial phase'
        result = {'schemaVersion': 2, 'wave': 15, 'startedAt': now(), 'authorization': authorization,
                  'sourceSha256Before': hashes(SOURCES), 'generatedSha256Before': hashes(OUTPUTS),
                  'steps': [], 'success': None, 'phase': 'reference-audit'}
        commands = COMMANDS[:2]
    else:
        original = target.read_bytes()
        result = json.loads(original)
        assert result['success'] is None and result['phase'] == 'awaiting-final-write-gate'
        assert result['authorization'] == authorization and len(result['steps']) == 2
        assert hashes(SOURCES) == result['sourceSha256Before']
        assert hashes(OUTPUTS) == result['referencePhaseOutputSha256'], 'Reference-phase outputs changed'
        for index, step in enumerate(result['steps']):
            label, argv = COMMANDS[index]
            assert step['id'] == label and step['argv'] == argv and step['exitCode'] == 0
            assert digest(str((LOG / step['log']).relative_to(ROOT))) == step['logSha256']
            assert stamp(step['startedAt']) <= stamp(step['finishedAt'])
        gate = json.loads((LOG / 'allow-final-writes.json').read_text())
        for name in ['authorized', 'productionFrozen', 'allBrowserWindowsClosed', 'rootFinalSignalReceived']:
            assert gate[name] is True, name
        assert stamp(result['steps'][1]['finishedAt']) <= stamp(gate['createdAt'])
        freeze = gate['productionFreeze']
        assert digest(freeze['path']) == freeze['sha256']
        frozen = read(freeze['path']); assert frozen['productionFrozen'] is True
        for path, value in frozen['files'].items():
            assert digest(path) == value, 'Frozen production changed: ' + path
        for report in gate['finalReports']:
            assert digest(report['path']) == report['sha256']
        receipt = LOG / 'reference-phase-receipt.json'
        assert not receipt.exists(), 'Do not overwrite the retained first-phase receipt'
        receipt.write_bytes(original)
        result['continuation'] = {'mode': 'planned-final-write-phase', 'startedAt': now(),
                                  'referencePhaseReceipt': {'path': str(receipt.relative_to(ROOT)), 'sha256': sha256(original).hexdigest()}}
        result['finalWriteGate'] = gate
        result['phase'] = 'final-writes'
        commands = COMMANDS[2:]

    def save():
        target.write_text(json.dumps(result, indent=2, ensure_ascii=False) + '\n')

    save()
    for label, argv in commands:
        verify_authorization()
        started = time.monotonic()
        step = {'id': label, 'argv': argv, 'startedAt': now(), 'log': label + '.log', 'exitCode': None}
        result['steps'].append(step); save()
        print(json.dumps({'event': 'start', 'step': label, 'argv': argv}), flush=True)
        lines = []
        with (LOG / step['log']).open('w', encoding='utf-8') as log:
            process = subprocess.Popen(argv, cwd=ROOT, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1)
            def read_output():
                for line in process.stdout:
                    log.write(line); log.flush(); lines.append(line.rstrip())
            reader = threading.Thread(target=read_output, daemon=True); reader.start()
            while True:
                try:
                    code = process.wait(timeout=30); break
                except subprocess.TimeoutExpired:
                    print(json.dumps({'event': 'running', 'step': label, 'elapsedSeconds': round(time.monotonic() - started, 1), 'latestOutput': lines[-2:]}), flush=True)
            reader.join()
        step.update({'finishedAt': now(), 'elapsedSeconds': round(time.monotonic() - started, 3), 'exitCode': code,
                     'logSha256': sha256((LOG / step['log']).read_bytes()).hexdigest(), 'receiptOrigin': 'observed-python-subprocess-wait-and-output-join'})
        save()
        if code:
            result.update({'finishedAt': now(), 'success': False, 'sourceSha256After': hashes(SOURCES)})
            save(); raise SystemExit(code)
    verify_authorization()
    assert hashes(SOURCES) == result['sourceSha256Before'], 'Historical sources or package changed'
    if args.references_only:
        assert digest(OUTPUTS[2]) == result['generatedSha256Before'][OUTPUTS[2]], 'Registry changed before final gate'
        result.update({'referencePhaseFinishedAt': now(), 'referencePhaseOutputSha256': hashes(OUTPUTS),
                       'phase': 'awaiting-final-write-gate'})
    else:
        result.update({'finishedAt': now(), 'success': True, 'phase': 'complete',
                       'sourceSha256After': hashes(SOURCES), 'generatedSha256After': hashes(OUTPUTS), 'sourceFilesUnchanged': True})
    save()
    print(json.dumps({'phase': result['phase'], 'commandsCompleted': len(result['steps']), 'success': result['success']}), flush=True)


if __name__ == '__main__':
    main()
