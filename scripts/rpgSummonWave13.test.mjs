// The full build executes real RPG flows without rewriting frozen evidence.
import { installHistoricalRpgSummonCohort } from './helpers/historicalRpgSummonCohort.mjs';
process.env.W13_RPG_WRITE_REPORT = '0';
await installHistoricalRpgSummonCohort({ wave: 13 });
await import('../docs/combat-fidelity-wave13-2026-10-24/summon-runtime-validation.mjs');
