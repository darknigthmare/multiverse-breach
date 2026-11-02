// Real RPG flows; test runner never rewrites frozen evidence.
import { installHistoricalRpgSummonCohort } from './helpers/historicalRpgSummonCohort.mjs';

process.env.W14_RPG_WRITE_REPORT = '0';
// Validate the live union, then scope only the historical asset-count assertion.
await installHistoricalRpgSummonCohort({ wave: 14 });
await import('../docs/combat-fidelity-wave14-2026-10-25/summon-runtime-validation.mjs');
