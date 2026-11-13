import sys,json,hashlib,datetime,collections
from pathlib import Path
root=Path(__file__).resolve().parents[4]
old=root/'docs/assets/p0-p1-continuation-2026-11-13/backlog'
new=Path(sys.argv[1]); out=Path(sys.argv[2]); out.mkdir(parents=True,exist_ok=True)
fixture=json.loads((root/'scripts/fixtures/actorLockedContinuity20261113.json').read_text())
expected={r['actorKey']:r for r in fixture['selected']+fixture['additionalActiveContracts']+fixture['ambiguous']}
ambiguous={r['actorKey'] for r in fixture['ambiguous']}
paths=[old/'actors.json',old/'summary.json',old/'audit.json']
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
old_hashes={str(p.relative_to(root)):sha(p) for p in paths}
before=json.loads((old/'actors.json').read_text()); after=json.loads((new/'actors.json').read_text())
old_summary=json.loads((old/'summary.json').read_text()); new_summary=json.loads((new/'summary.json').read_text())
old_by={r['actorKey']:r for r in before}; new_by={r['actorKey']:r for r in after}
assert len(old_by)==len(before) and len(new_by)==len(after),'Duplicate actor identities'
def metrics(rows):
 tasks=[t for r in rows for t in r['tasks']]
 return {'actors':len(rows),'taskRows':len(tasks),'tasksByPriority':dict(collections.Counter(t['priority'] for t in tasks)),
   'actorsWithP1':sum(any(t['priority']=='P1' for t in r['tasks']) for r in rows),
   'actorsWithMissingRaster':sum(bool(r['missingRasterPaths']) for r in rows),
   'actorsWithStaticGameplay':sum(bool(r['staticGameplayPaths']) for r in rows),
   'tasksByCode':dict(sorted(collections.Counter(t['code'] for t in tasks).items()))}
removed=[];added=[];retained_changes=[];other_field_changes=[];raster_changes=[];matched=[]
for key in sorted(old_by.keys()&new_by.keys()):
 a=old_by[key]; b=new_by[key]
 at={t['code']:t for t in a['tasks']}; bt={t['code']:t for t in b['tasks']}
 for code in sorted(at.keys()-bt.keys()):removed.append({'actorKey':key,'actorId':a['actorId'],'name':a['actorName'],'universe':a['universe'],'kind':a['kind'],**at[code]})
 for code in sorted(bt.keys()-at.keys()):added.append({'actorKey':key,'actorId':b['actorId'],'name':b['actorName'],'universe':b['universe'],'kind':b['kind'],**bt[code]})
 for code in sorted(at.keys()&bt.keys()):
  if at[code]!=bt[code]:retained_changes.append({'actorKey':key,'code':code,'before':at[code],'after':bt[code]})
 if key in expected:
  r=expected[key]; wanted='AMBIGUOUS_ACTOR_CONTINUITY' if key in ambiguous else 'ACTOR_LOCKED_CONTINUITY'
  assert a['incarnationEvidence']=='UNSPECIFIED' and not a['incarnation'],key
  assert b['incarnationEvidence']==wanted,key
  assert b['incarnation']==('' if key in ambiguous else r['continuity']['label']),key
  assert b['declaredContinuity']['sourceId']==r['continuity']['id'] and b['declaredContinuity']['source']==r['continuity']['source'],key
  assert b['declaredContinuity']['source1to1Verified'] is False and b['declaredContinuity']['artApproved'] is False,key
  matched.append(key)
 ignored={'sourceCommit','tasks','declaredContinuity'}|({'incarnation','incarnationEvidence'} if key in expected else set())
 changed={field:{'before':a.get(field),'after':b.get(field)} for field in a.keys()|b.keys() if field not in ignored and a.get(field)!=b.get(field)}
 if changed:other_field_changes.append({'actorKey':key,'fields':changed})
 for field in ['rasterProbes','rasterPaths','missingRasterPaths','staticGameplayPaths']:
  if a[field]!=b[field]:raster_changes.append({'actorKey':key,'field':field,'before':a[field],'after':b[field]})
 if key not in expected:assert b.get('declaredContinuity') is None,key
 assert b['artApproved'] is False and b['completeness']=='OPEN_NOT_EXHAUSTIVE',key
 assert all(t['artApproved'] is False and t['status']=='OPEN' for t in b['tasks']),key
expected_removed={(key,'INCARNATION_UNSPECIFIED') for key in expected}
expected_added={(key,'ACTOR_CONTINUITY_AMBIGUOUS' if key in ambiguous else 'ACTOR_CONTINUITY_PRECISION') for key in expected}
actual_removed={(r['actorKey'],r['code']) for r in removed}; actual_added={(r['actorKey'],r['code']) for r in added}
old_after={str(p.relative_to(root)):sha(p) for p in paths}
result={'schemaVersion':1,'date':datetime.datetime.now(datetime.timezone.utc).isoformat(),'baselineDirectory':str(old.relative_to(root)),
 'baselineSourceCommit':old_summary['sourceBaseCommit'],'currentSourceCommit':new_summary['sourceBaseCommit'],
 'before':metrics(before),'after':metrics(after),
 'selectedBatchSize':40,'sourceContractsMatched':len(matched),'structuredContinuitiesRecovered':new_summary.get('structuredContinuitiesRecovered'),
 'actorContinuityAmbiguities':new_summary.get('actorContinuityAmbiguities'),'packContinuitiesRecoveredBefore':old_summary['continuitiesRecovered'],'packContinuitiesRecoveredAfter':new_summary['continuitiesRecovered'],
 'removedSourceFindings':removed,'addedSourceFindings':added,'retainedTaskDetailsChanged':retained_changes,
 'actorAdded':sorted(new_by.keys()-old_by.keys()),'actorRemoved':sorted(old_by.keys()-new_by.keys()),
 'unexpectedRemovedSourceFindings':sorted(actual_removed-expected_removed),'expectedRemovalsMissing':sorted(expected_removed-actual_removed),
 'unexpectedAddedSourceFindings':sorted(actual_added-expected_added),'expectedAdditionsMissing':sorted(expected_added-actual_added),
 'otherActorFieldChanges':other_field_changes,'rasterChanges':raster_changes,
 'checks':{'all62ContractsRecoveredOrKeptAmbiguous':set(matched)==set(expected),'sameActorIdentities':old_by.keys()==new_by.keys(),
 'exactExpectedTaskChanges':actual_removed==expected_removed and actual_added==expected_added,'noRetainedTaskChanged':not retained_changes,
 'noOtherActorFieldsChanged':not other_field_changes,'noRasterChanges':not raster_changes,
 'packCounterPreserved':old_summary['continuitiesRecovered']==new_summary['continuitiesRecovered'],
 'baselineBytesUnchanged':old_hashes==old_after},
 'historicalBaselineBeforeSha256':old_hashes,'historicalBaselineAfterSha256':old_after,
 'newExportHashes':{name:sha(new/name) for name in ['actors.json','summary.json','actors.csv','tasks.csv']},
 'fullActorClosuresClaimed':0,'p0ClosuresClaimed':0,'newImageGenerationsClaimed':0,'artApprovalClaims':0,'source1to1Verified':False,
 'scope':'Exact source and declared asset-path observations only. Unbound new PNGs do not remove RASTER_MISSING. No individual visual approval.'}
(out/'global-source-findings-delta.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'before':result['before']['tasksByPriority'],'after':result['after']['tasksByPriority'],'actors':result['after']['actors'],'checks':result['checks'],'output':str(out/'global-source-findings-delta.json')}))
assert all(result['checks'].values()),'Unexpected differences require review; delta report preserved'
