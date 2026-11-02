// Real RPG flows; the test runner does not rewrite frozen browser evidence.
import { installHistoricalRpgSummonCohort } from './helpers/historicalRpgSummonCohort.mjs';
process.env.W15_RPG_WRITE_REPORT = '0';
await installHistoricalRpgSummonCohort({ wave: 15 });
await import('../docs/combat-fidelity-wave15-2026-10-26/summon-runtime-validation.mjs');
