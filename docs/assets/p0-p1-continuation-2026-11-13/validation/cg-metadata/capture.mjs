import { writeFileSync } from 'node:fs';
import { buildCgRosterProductionMetadataPlan, serializeCgRosterProductionPlan, buildCgRosterProductionReport } from '/workspace/multiverse-breach/scripts/buildCgRosterProductionPlan.mjs';
const result = await buildCgRosterProductionMetadataPlan();
const { plan, ...scope } = result;
writeFileSync('/tmp/p0-p1-cg-snapshot-20261113/rebuilt.json', serializeCgRosterProductionPlan(plan));
writeFileSync('/tmp/p0-p1-cg-snapshot-20261113/rebuilt-report.md', buildCgRosterProductionReport(plan));
writeFileSync('/tmp/p0-p1-cg-snapshot-20261113/metadata-scope.json', JSON.stringify(scope, null, 2) + '\n');
process.stdout.write(JSON.stringify({ captured: true, ...scope, summary: plan.summary }) + '\n');
