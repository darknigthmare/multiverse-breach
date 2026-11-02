import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fingerprint, resourceSnapshot } from './collect-sir-daniel-evidence.mjs';

export async function beginBrowserReceipt(harnessUrl) {
  const startedAt = new Date().toISOString();
  const harness = await fingerprint(path.relative(process.cwd(), fileURLToPath(harnessUrl)));
  return { startedAt, harness, resourcesBefore: await resourceSnapshot() };
}

// A success report is written only after Playwright actually resolves close().
// The runner subsequently observes the real child-process close event too.
export async function closeBrowserWithReceipt(browser, receipt, observedReport, reportPath, preliminary = false) {
  const contextsBeforeClose = browser.contexts().length;
  const pagesBeforeClose = browser.contexts().reduce((count, context) => count + context.pages().length, 0);
  await browser.close();
  const browserClosedAt = new Date().toISOString();
  assert.equal(browser.isConnected(), false);
  assert.equal(browser.contexts().length, 0);
  const resourcesAfter = await resourceSnapshot();
  assert.deepEqual(resourcesAfter, receipt.resourcesBefore, 'Production inputs changed during this browser flow');
  const closure = {
    schemaVersion: 1, startedAt: receipt.startedAt, browserClosedAt, finishedAt: new Date().toISOString(),
    harness: receipt.harness.path, harnessSha256: receipt.harness.sha256,
    preliminary, phase: preliminary ? 'preliminary' : 'final',
    allBrowserWindowsClosed: true, contextsBeforeClose, pagesBeforeClose,
    browserConnectedAfterClose: browser.isConnected(),
    resourcesBefore: receipt.resourcesBefore, resourcesAfter,
    productionInputsStableDuringRun: true,
    receiptOrigin: 'await-browser-close-and-post-close-input-hash',
  };
  const closurePath = reportPath.replace(/-result\.json$/, '-closure.json');
  assert.notEqual(closurePath, reportPath);
  await fs.writeFile(closurePath, JSON.stringify({ passed: Boolean(observedReport?.passed), ...closure }, null, 2) + '\n');
  if (observedReport) {
    assert.equal(observedReport.passed, true);
    assert.deepEqual(observedReport.pageErrors, []);
    const result = { ...observedReport, ...closure, source1to1Verified: false };
    await fs.writeFile(reportPath, JSON.stringify(result, null, 2) + '\n');
    console.log(JSON.stringify({ passed: true, report: reportPath, browserClosedAt, finishedAt: closure.finishedAt }));
  }
  return closure;
}
