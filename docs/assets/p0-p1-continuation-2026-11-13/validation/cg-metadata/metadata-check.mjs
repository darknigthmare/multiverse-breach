import { readFileSync, writeFileSync } from 'node:fs';
import { HEROES_DB } from '/workspace/multiverse-breach/src/game/heroes.js';
import { CG_CATALOG } from '/workspace/multiverse-breach/src/game/cg/cgCatalog.js';
import { validateCgRosterProductionSnapshot } from '/workspace/multiverse-breach/scripts/cgRosterPlanSnapshot.mjs';
import { serializeCgRosterProductionPlan, buildCgRosterProductionReport } from '/workspace/multiverse-breach/scripts/buildCgRosterProductionPlan.mjs';
const plan = JSON.parse(readFileSync('/tmp/p0-p1-cg-snapshot-20261113/rebuilt.json'));
const proof = validateCgRosterProductionSnapshot({root:'/workspace/multiverse-breach',rebuilt:plan,heroes:HEROES_DB,catalog:CG_CATALOG,
serialize:serializeCgRosterProductionPlan,buildReport:buildCgRosterProductionReport});
const result = { validationScope:'metadata-only',physicalMediaChecked:false,proof };
writeFileSync('/tmp/p0-p1-cg-snapshot-20261113/metadata-check-result.json',JSON.stringify(result,null,2)+'\n');
process.stdout.write(JSON.stringify(result)+'\n');
