"""Bind the five observed refresh commands to frozen references and unchanged audits."""
from pathlib import Path
import hashlib
import json

base = Path('docs/combat-fidelity-wave12-2026-10-23/rift-refresh')

def read(path):
    return json.loads(Path(path).read_text())

def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

result = read(base / 'result.json')
summary = read(base / 'summary.json')
authorization = read(base / 'authorization.json')
gate = read(base / 'allow-final-writes.json')
assert result['success'] and summary['passed'] and summary['success']
assert len(result['steps']) == 5 and [step['exitCode'] for step in result['steps']] == [0] * 5
assert result['sourceSha256Before'] == result['sourceSha256After']
assert result['finalWriteGate'] == gate
for name in ['authorized', 'productionFrozen', 'allBrowserWindowsClosed', 'rootFinalSignalReceived']:
    assert gate[name] is True, name
assert summary['qualityBindsCurrentReferenceHashes'] is True
assert summary['qualityThresholdsUnchanged'] is True
assert summary['knownCaseExpectationsUnchanged'] is True
assert summary['manualReferencePinsUnchanged'] is True
assert len(authorization['references']) == 40
quality = read('docs/rift-dossiers/character-reference-quality.json')
metrics = {entry['path']: entry for entry in quality['referenceFiles']}
for reference in authorization['references']:
    assert sha('public' + reference['sheet']) == reference['sha256']
    assert metrics[reference['sheet']]['metrics']['fileSha256'] == reference['sha256']
    assert metrics[reference['sheet']]['classification'] == 'approved'
files = {**result['sourceSha256After'], **result['generatedSha256After']}
for step in result['steps']:
    files[str(base / step['log'])] = step['logSha256']
for reference in authorization['references']:
    files['public' + reference['sheet']] = reference['sha256']
for name in ['authorization.json', 'allow-final-writes.json', 'result.json', 'summary.json',
             'registry-availability-delta.json', 'catalog-before.json', 'quality-before.json',
             'registry-before.json', 'auditCharacterReferenceQuality-before.py',
             'run-sequential-refresh.py', 'summarize-refresh.py', 'verify-refresh-integrity.py']:
    files[str(base / name)] = sha(base / name)
checks = []
for path, digest in files.items():
    assert sha(path) == digest, path
    checks.append({'path': path, 'sha256': digest})
proof = {
    'passed': True, 'success': True, 'fiveCommandExitCodes': [step['exitCode'] for step in result['steps']],
    'historicalScriptsAndPackageUnchanged': result['sourceFilesUnchanged'],
    'qualityBindsCurrentReferenceHashes': True, 'referencesChecked': 40,
    'changedReferences': summary['changedReferenceCount'],
    'retainedHistoricalReferences': summary['unchangedHistoricalReferenceCount'],
    'allChangedReferencesApproved': summary['allChangedReferencesApproved'],
    'qualityThresholdsAndKnownExpectationsUnchanged': True,
    'qualityReferenceCounts': summary['qualityAfter'], 'registryStatuses': summary['registryStatuses'],
    'revisedCharacterPromptsMeasured': summary['revisedCharacterPromptCount'],
    'availabilityStatusChanges': len(summary['registryAvailabilityDelta']['changes']),
    'hashChecks': len(checks), 'files': checks, 'barrierReleasedByRoot': True,
    'browserWindowsClosedBeforeFinalWrites': True, 'source1to1Verified': False,
    'limitations': ['Morty retains his existing reference after the recorded generation refusal.']
}
(base / 'final-integrity.json').write_text(json.dumps(proof, indent=2, ensure_ascii=False) + '\n')
print(json.dumps({'passed': True, 'hashChecks': len(checks),
                  'changedReferences': summary['changedReferenceCount'],
                  'historicalReferences': summary['unchangedHistoricalReferenceCount']}))
