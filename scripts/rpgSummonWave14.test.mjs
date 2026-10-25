// Real RPG flows; test runner never rewrites frozen evidence.
process.env.W14_RPG_WRITE_REPORT = '0';
await import('../docs/combat-fidelity-wave14-2026-10-25/summon-runtime-validation.mjs');
