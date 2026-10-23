import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HEROES_DB } from '../src/game/heroes.js';
import { resolveMeleeSuper, resolveUniverseSummon } from '../src/game/combatIdentity.js';
import { getStageAtmosphereProfile } from '../src/game/melee/stageAtmosphere.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const baseline = JSON.parse(fs.readFileSync(path.join(root, 'docs/combat-completion-2026-10-18/baseline.json'), 'utf8'));
const additional = JSON.parse(fs.readFileSync(path.join(root, 'docs/combat-completion-2026-10-18/decisive-baseline.json'), 'utf8'));
const rows = new Map();
const basis = {};
const details = HEROES_DB.map(hero => {
  const superProfile = resolveMeleeSuper(hero);
  const summon = resolveUniverseSummon(hero);
  const asset = summon?.entityRender?.asset;
  const assetExists = Boolean(asset?.sheet && fs.existsSync(path.join(root, 'public', asset.sheet)));
  const row = rows.get(hero.universe) || { universe: hero.universe, heroes: 0, supers: 0, authored: 0, generic: 0, summons: 0, reinforcements: 0, entityAssets: 0, missingEntityAssets: 0 };
  row.heroes++;
  row.supers += Number(Boolean(superProfile));
  row.authored += Number(superProfile?.provenance.identityAuthored === true);
  row.generic += Number(superProfile?.provenance.genericCatalogIdentity === true);
  row.summons += Number(summon?.kind === 'summon');
  row.reinforcements += Number(summon?.kind === 'reinforcement');
  row.entityAssets += Number(assetExists);
  row.missingEntityAssets += Number(summon?.provenance.entityAssetMissing === true || Boolean(asset && !assetExists));
  rows.set(hero.universe, row);
  basis[superProfile?.provenance.identityBasis || 'unresolved'] = (basis[superProfile?.provenance.identityBasis || 'unresolved'] || 0) + 1;
  return { id: hero.id, universe: hero.universe, super: superProfile?.name, effect: superProfile?.effect, identityBasis: superProfile?.provenance.identityBasis, generic: superProfile?.provenance.genericCatalogIdentity, entity: summon?.entityName, entityAsset: assetExists ? asset.id : null };
});
const universes = [...rows.values()].sort((a, b) => a.universe.localeCompare(b.universe, 'en'));
const unconfigured = universes.filter(row => getStageAtmosphereProfile({ universe: row.universe }).fidelity === 'unconfigured').map(row => row.universe);
const report = {
  schemaVersion: 1, date: '2026-10-18',
  baseline: { genericCapabilities: baseline.genericCapabilities.length, additionalGenericCapabilities: additional.length, missingEntityProfiles: baseline.missingEntityProfiles, uniqueMissingEntities: baseline.entities.length, unconfiguredAtmospheres: baseline.unconfiguredAtmospheres.length },
  current: {
    heroes: HEROES_DB.length, universes: universes.length,
    supers: universes.reduce((sum, row) => sum + row.supers, 0),
    authored: universes.reduce((sum, row) => sum + row.authored, 0),
    genericCapabilities: details.filter(entry => entry.generic).length,
    profilesWithEntityAssets: details.filter(entry => entry.entityAsset).length,
    uniqueEntityAssets: new Set(details.map(entry => entry.entityAsset).filter(Boolean)).size,
    missingEntityProfiles: universes.reduce((sum, row) => sum + row.missingEntityAssets, 0),
    unconfiguredAtmospheres: unconfigured.length,
    identityBasis: basis
  },
  fidelity: { sourceNetworkVerified: false, canonicalVisualFidelityCertified: false, assets: 'OpenAI-generated pixel-art adaptations, four poses per entity', sequences: 'existing character sprites and adapted runtime poses' },
  unconfiguredAtmospheres: unconfigured, universes, characters: details
};
const table = universes.map(row => `| ${row.universe.replaceAll('|', '\\|')} | ${row.heroes} | ${row.supers} | ${row.authored} | ${row.generic} | ${row.summons} | ${row.reinforcements} | ${row.entityAssets} | ${row.missingEntityAssets} |`).join('\n');
const markdown = `# Couverture des identités de combat\n\nAudit reproductible du 18 octobre 2026 : \`node scripts/combatCompletionAudit.mjs --check\`.\n\n${report.current.heroes} héros, ${report.current.universes} univers, ${report.current.supers} supers résolus. ${report.current.authored} identités ont une définition explicite par ID ; les autres conservent leur capacité nommée du catalogue.\n\nLes **1 089 capacités génériques initiales** et **191 autres « decisive action »** sont couvertes par des tables explicites. Génériques restants : **${report.current.genericCapabilities}**. Les baselines antérieures aux corrections sont conservées séparément dans \`docs/combat-completion-2026-10-18/\`. Le catalogue source reste intact ; le moteur résout les capacités effectives partagées.\n\nLes **82 profils** autrefois sans artwork d’entité utilisent **${report.current.uniqueEntityAssets} planches PNG distinctes**, chacune avec quatre poses natives générées puis extraites et normalisées. Profils sans asset d’entité : **${report.current.missingEntityProfiles}**. Les entités FFVII ne sont pas représentées par un membre de l’équipe ; tourelles et drones montrent leur équipement propre. Les autres renforts emploient un vrai personnage du même univers.\n\nLes **255 ambiances manquantes** sont rédigées par univers : **${report.current.universes - unconfigured.length}/${report.current.universes}** univers configurés sans nom de scène. Un lieu concret garde priorité. Voir le rapport détaillé \`stage-atmosphere-coverage-2026-10-18.md\`.\n\nCes contrôles certifient la couverture et les contrats du moteur, pas la fidélité 1:1 aux œuvres. Les capacités distinguent technique nommée, adaptation du rôle et canon original du projet. Les références ne sont pas vérifiées sur le réseau. Les PNG sont des adaptations générées ; les intros, sorties et finales restent des séquences adaptées. Les coûts, portées, dégâts, soins et timings sont équilibrés pour ce moteur. La provenance conserve ces limites.\n\nLes lignes comptent les personnages appelants, pas les entités uniques.\n\n| Univers | Héros | Supers | Identités écrites | Génériques | Invocations | Renforts | Profils avec PNG d’entité | Assets absents |\n| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |\n${table}\n`;
const outputs = new Map([
  ['docs/combat-completion-2026-10-18/coverage.json', JSON.stringify(report, null, 2) + '\n'],
  ['docs/audits/combat-identity-coverage.md', markdown]
]);
for (const [relative, content] of outputs) {
  const target = path.join(root, relative);
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== content) throw new Error(`Stale combat completion audit: ${relative}`);
  } else fs.writeFileSync(target, content);
}
console.log(JSON.stringify(report.current, null, 2));
if (report.current.genericCapabilities || report.current.missingEntityProfiles || unconfigured.length) process.exitCode = 1;
