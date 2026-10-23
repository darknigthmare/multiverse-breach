"""Verify the final corrected-reference audit; writes evidence only after five real successes."""
from pathlib import Path
import hashlib,json
base=Path('docs/combat-fidelity-wave11-2026-10-23/rift-refresh');archive=base.parent/'rift-refresh-before-lilith-correction'
def read(p):return json.loads(Path(p).read_text())
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
r=read(base/'result.json');s=read(base/'summary.json');auth=read(base/'authorization.json');gate=read(base/'allow-final-writes.json');prior=read(archive/'result.json')
assert r['success']and s['success']and s['passed'];assert [e['exitCode']for e in r['steps']]==[0]*5
assert r['sourceSha256Before']==r['sourceSha256After']==prior['sourceSha256Before']
assert gate['authorized']is True and gate['rootFinalSignalReceived']is True and gate['allBrowserWindowsClosed']is True
assert s['qualityBindsCurrentReferenceHashes']is True
quality=read('docs/rift-dossiers/character-reference-quality.json');metrics={e['path']:e for e in quality['referenceFiles']};oldById={e['id']:e for e in read(archive/'authorization.json')['references']};changed=[]
for ref in auth['references']:
 assert ref['sheet']==oldById[ref['id']]['sheet'];actual=sha('public'+ref['sheet']);assert actual==ref['sha256']==metrics[ref['sheet']]['metrics']['fileSha256'];assert metrics[ref['sheet']]['classification']=='approved'
 if ref['sha256']!=oldById[ref['id']]['sha256']:changed.append(ref['id'])
assert len(auth['references'])==40 and changed==['lilith_borderlands']
for name in ['catalog-before.json','quality-before.json','registry-before.json','auditCharacterReferenceQuality-before.py']:assert sha(base/name)==sha(archive/name)
files={**r['sourceSha256After'],**r['generatedSha256After']}
for step in r['steps']:files[str(base/step['log'])]=step['logSha256']
for ref in auth['references']:files['public'+ref['sheet']]=ref['sha256']
for name in ['authorization.json','allow-final-writes.json','result.json','summary.json','registry-availability-delta.json','catalog-before.json','quality-before.json','registry-before.json','auditCharacterReferenceQuality-before.py','run-sequential-refresh.py','summarize-refresh.py','refresh-authorization-for-lilith.mjs','verify-refresh-integrity.py','second-run-preparation.json','before-second-run-integrity.json']:
 p=base/name;files[str(p)]=sha(p)
checks=[]
for p,h in files.items():assert sha(p)==h,p;checks.append({'path':p,'sha256':h})
proof={'passed':True,'success':True,'fiveCommandExitCodes':[e['exitCode']for e in r['steps']],'historicalScriptsAndPackageUnchanged':r['sourceFilesUnchanged'],'historicalScriptsAlsoMatchFirstSuccessfulRun':True,'originalBeforeSnapshotsRetained':True,'previousSuccessfulRunArchive':str(archive),'correctedReferenceHashChanges':changed,'correctedLilithBaseSha256':auth['changedReferenceHash']['sha256'],'qualityBindsCurrentReferenceHashes':True,'referencesChecked':40,'changedReferences':s['changedReferenceCount'],'retainedHistoricalReferences':s['unchangedHistoricalReferenceCount'],'allChangedReferencesApproved':s['allChangedReferencesApproved'],'qualityThresholdsAndKnownExpectationsUnchanged':s['qualityThresholdsUnchanged']and s['knownCaseExpectationsUnchanged'],'qualityReferenceCounts':s['qualityAfter'],'registryStatuses':s['registryStatuses'],'revisedCharacterPromptsMeasured':s['revisedCharacterPromptCount'],'availabilityStatusChanges':len(s['registryAvailabilityDelta']['changes']),'hashChecks':len(checks),'files':checks,'barrierReleasedByRoot':True,'browserWindowsClosedBeforeFinalWrites':True,'source1to1Verified':False};(base/'final-integrity.json').write_text(json.dumps(proof,indent=2,ensure_ascii=False)+'\n');print(json.dumps({'passed':True,'hashChecks':len(checks),'changedReferences':s['changedReferenceCount'],'historicalReferences':s['unchangedHistoricalReferenceCount'],'qualityBindsCurrentReferenceHashes':True,'correctedLilithBaseSha256':auth['changedReferenceHash']['sha256']}))
