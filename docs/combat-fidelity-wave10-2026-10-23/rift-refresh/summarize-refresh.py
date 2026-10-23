"""Summarize actual W10 audit output, reference deltas and the explicit retired-case fix."""
from pathlib import Path
from collections import Counter
import ast, hashlib, json
root=Path('/workspace/multiverse-breach');base=root/'docs/combat-fidelity-wave10-2026-10-23/rift-refresh'
def read(p):return json.loads(p.read_text())
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def constants(p):
 result={}
 for node in ast.parse(p.read_text()).body:
  if isinstance(node,ast.Assign):
   for target in node.targets:
    if isinstance(target,ast.Name):
     try:result[target.id]=ast.literal_eval(node.value)
     except (ValueError,TypeError):pass
 return result
result=read(base/'result.json');assert result['success'] is True
assert [s['exitCode'] for s in result['steps']]==[0]*5
before=read(base/'catalog-before.json');after=read(root/'docs/rift-dossiers/catalog.json');qualityBefore=read(base/'quality-before.json');quality=read(root/'docs/rift-dossiers/character-reference-quality.json');authorization=read(base/'authorization.json')
old={e['id']:e for e in before['entrees'] if e['famille']=='arc-personnage'};current={e['id']:e for e in after['entrees'] if e['famille']=='arc-personnage'}
def paths(e):return e.get('candidatsReferencesLocalesAudit',e.get('referencesLocalesOpenAI',[]))
changed=[{'stageId':i,'character':e['personnage'],'previous':paths(old[i]),'current':paths(e)} for i,e in current.items() if paths(old[i])!=paths(e)]
expected={r['sheet'] for r in authorization['references']};changedCurrent={p for e in changed for p in e['current']};classifications={e['path']:e['classification'] for e in quality['referenceFiles']}
all40=len(changed)==40 and len(expected)==40 and changedCurrent==expected and all(classifications.get(p)=='approved' for p in expected)
assert all40,'Real catalog delta must contain precisely the40 authorized new references and all must pass the unchanged quality rules.'
oldPy=base/'first-attempt-known-retired-reference/auditCharacterReferenceQuality.before.py';newPy=root/'scripts/auditCharacterReferenceQuality.py';oldConst=constants(oldPy);newConst=constants(newPy)
constantNames=['EXPECTED_CHARACTER_ARC_ENTRY_COUNT','EXPECTED_UNIQUE_REFERENCE_PATH_COUNT','ALPHA_OCCUPIED_THRESHOLD','STRONG_NEIGHBOR_DIFFERENCE','THRESHOLDS','KNOWN_EXPECTATIONS','MANUAL_APPROVED_REFERENCE_SHA256'];unchanged={name:oldConst[name]==newConst[name] for name in constantNames};assert all(unchanged.values())
beforeSha=result['sourceSha256Before'];afterSha=result['sourceSha256After'];js=['scripts/buildRiftDossierCatalog.mjs','scripts/buildRiftDossierAssetRegistry.mjs'];scripts=js+['scripts/auditCharacterReferenceQuality.py']
summary={'passed':True,'date':'2026-10-23','commands':[{'argv':s['argv'],'exitCode':s['exitCode'],'elapsedSeconds':s['elapsedSeconds'],'log':s['log'],'logSha256':s['logSha256']} for s in result['steps']],'firstFailedAudit':{'exitCode':1,'elapsedSeconds':450.121,'archive':'first-attempt-known-retired-reference','cause':'Old Freeman known-case reference retired from current catalog; expectation retained and evaluated separately on actual old pixels.'},'historicalAuditScriptsUnchanged':all(beforeSha[p]==afterSha[p] for p in scripts),'historicalCatalogBuildersUnchanged':all(beforeSha[p]==afterSha[p] for p in js),'packageUnchanged':beforeSha['package.json']==afterSha['package.json'],'qualityThresholdsUnchanged':unchanged['THRESHOLDS'] and unchanged['ALPHA_OCCUPIED_THRESHOLD'] and unchanged['STRONG_NEIGHBOR_DIFFERENCE'],'knownCaseExpectationsUnchanged':unchanged['KNOWN_EXPECTATIONS'],'manualReferencePinsUnchanged':unchanged['MANUAL_APPROVED_REFERENCE_SHA256'],'qualityAuditChangedForRetiredReferences':beforeSha['scripts/auditCharacterReferenceQuality.py']!=afterSha['scripts/auditCharacterReferenceQuality.py'],'qualityConstantsUnchanged':unchanged,'historicalKnownCaseReferences':quality.get('historicalKnownCaseReferences',[]),'all40NewReferencesApproved':all40,'changedReferenceCount':len(changed),'newBase16References':sum(r['kind']=='dedicated-base16' for r in authorization['references']),'partial24FallbackReferences':sum(r['kind']!='dedicated-base16' for r in authorization['references']),'references':changed,'catalogTotalBefore':before['total'],'catalogTotalAfter':after['total'],'qualityBefore':qualityBefore['summary'],'qualityAfter':quality['summary'],'registryStatuses':dict(Counter(e['status'] for e in read(root/'src/game/riftDossierAssets.json')['entries'])),'sourceSha256Before':beforeSha,'sourceSha256After':afterSha,'finalOutputSha256':result['generatedSha256After']}
assert summary['historicalAuditScriptsUnchanged'] is False;assert summary['historicalCatalogBuildersUnchanged'] is True;assert summary['packageUnchanged'] is True
summary['success']=result['success']
summary['changedReferencePaths']=len(changed)
summary['exitCodes']={step['id']:step['exitCode'] for step in result['steps']}
availability=read(base/'registry-availability-delta.json')
summary['registryAvailabilityDelta']=availability
summary['limitations']=['Carter dossier9218 remains pending after its prompt changed from the prior firearm identity to the corrected W10equipment; old bitmap and exact ledger remain untouched. A genuinely regenerated matching dossier image would be needed to restore available status.']
(base/'summary.json').write_text(json.dumps(summary,indent=2,ensure_ascii=False)+'\n');print(json.dumps({k:v for k,v in summary.items() if k not in ['references','sourceSha256Before','sourceSha256After','qualityBefore','historicalKnownCaseReferences','commands']},ensure_ascii=False))
