import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const directory = import.meta.dirname;
const receiptFile = path.join(directory, 'receipt.json');
const receiptBytes = fs.readFileSync(receiptFile);
const receipt = JSON.parse(receiptBytes);
assert.equal(receipt.completedGroups,17,'Wait until all17real child close events are recorded');
assert.equal(receipt.results.length,17);
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const originalReceiptFile=path.join(directory,'receipt-original-close-events.json');
assert.ok(!fs.existsSync(originalReceiptFile),'Do not overwrite preserved raw event receipt');
fs.writeFileSync(originalReceiptFile,receiptBytes,{flag:'wx'});
for(const result of receipt.results){
  const bytes=fs.readFileSync(path.join(directory,result.logFile));
  assert.equal(sha(bytes),result.logSha256,result.logFile+': original log changed');
  const output=bytes.toString();
  result.summary=Object.fromEntries(['tests','suites','pass','fail','cancelled','skipped','todo'].map(key=>{
    const matches=[...output.matchAll(new RegExp('^(?:#|ℹ)\\s+'+key+' (\\d+)\\s*$','gm'))];
    assert.ok(matches.length,result.script+': missing observed summary '+key);
    return[key,Number(matches.at(-1)[1])];
  }));
  result.failedSubtests=[...new Set(output.split('\n').filter(line=>/^not ok\b|^✖ (?!failing tests:)/.test(line))
    .map(line=>line.replace(/ \([\d.]+ms\)\s*$/,'')))];
  result.failureLocations=[...new Set(output.split('\n').filter(line=>/^test at scripts\//.test(line)))];
  result.summarySource='Exact numeric footer emitted by the observed Node reporter (TAP# or specℹ); no guessed or synthetic pass count.';
}
receipt.countParsing={performedAt:new Date().toISOString(),originalChildEventReceipt:'receipt-original-close-events.json',originalChildEventReceiptSha256:sha(receiptBytes),originalRunnerSha256:sha(fs.readFileSync(path.join(directory,'run-preflight.mjs'))),reason:'This environment selected the Node spec reporter. The original parser recognized only TAP# footers and therefore returned null counts. Logs, exit codes, signals, durations and child close events are unchanged; exact spec/TAP numeric footers are now parsed from the preserved logs.'};
receipt.failedGroups=receipt.results.filter(result=>result.observedExitCode!==0||result.spawnError||result.summary.fail>0).map(result=>result.script);
receipt.observedTotals=Object.fromEntries(['tests','pass','fail','cancelled','skipped','todo'].map(key=>[key,receipt.results.reduce((sum,result)=>sum+result.summary[key],0)]));
receipt.passed=receipt.completedGroups===17&&!receipt.failedGroups.length&&receipt.historicalReportsUnchanged;
fs.writeFileSync(receiptFile,JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({completed:17,failedGroups:receipt.failedGroups,totals:receipt.observedTotals,historicalReportsUnchanged:receipt.historicalReportsUnchanged,originalReceiptSha256:sha(receiptBytes)}));
