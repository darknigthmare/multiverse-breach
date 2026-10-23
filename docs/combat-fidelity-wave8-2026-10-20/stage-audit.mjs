// Regenerate local coverage and the source/function ledger, not Web access or
// the immutable pre-edit preservation baseline. Run from the repository root.
import fs from 'node:fs';
import { HEROES_DB } from '../../src/game/heroes.js';
import { STAGE_ANIMATION_PROFILES, getStageAnimationProfile } from '../../src/game/melee/stageAnimationCatalog.js';
import { STAGE_ANIMATION_WAVE_8 } from '../../src/game/melee/stageAnimationCatalogWave8.js';
import { getStageAtmosphereProfile } from '../../src/game/melee/stageAtmosphere.js';
const directory = new URL('./', import.meta.url);
const before = JSON.parse(fs.readFileSync(new URL('../combat-fidelity-wave7-2026-10-20/stage-coverage.json', directory))).after;
const baseline = JSON.parse(fs.readFileSync(new URL('stage-baseline.json', directory)));
const access = JSON.parse(fs.readFileSync(new URL('stage-source-access.json', directory)));
const modes = ['Combat', 'Melee', 'RPG', 'Tactics'];
const rows = [...new Set(HEROES_DB.map(h => h.universe))].map(universe => {
  const atmosphere = getStageAtmosphereProfile({ universe });
  const mechanisms = Object.fromEntries(modes.map(mode => [mode, getStageAnimationProfile({ universe, mode })?.id || null]));
  return { universe, baseAtmosphereEnabled: atmosphere.enabled, baseAtmosphereStatus: atmosphere.status, baseAtmosphereEffect: atmosphere.effect, mechanisms, anyModeMechanism: Object.values(mechanisms).some(Boolean), everyModeMechanism: Object.values(mechanisms).every(Boolean), source1to1Validated: false };
});
const after = { universes: rows.length, withAnyModeMechanism: rows.filter(r => r.anyModeMechanism).length, withEveryModeMechanism: rows.filter(r => r.everyModeMechanism).length, baseAtmosphereOnly: rows.filter(r => !r.anyModeMechanism).length,
  byMode: Object.fromEntries(modes.map(mode => [mode, { mechanisms: rows.filter(r => r.mechanisms[mode]).length, baseAtmosphereOnly: rows.filter(r => !r.mechanisms[mode]).length }])) };
const checks = STAGE_ANIMATION_WAVE_8.map(p => ({ profileIds: [p.id], sourceUrl: p.sourceReference, readStatus: p.sourceAccess,
  accessAttempts: access.access.filter(a => a.url === p.sourceReference).map(a => ({ status: a.status, totalLines: a.totalLines })),
  sourceWork: p.sourceWork, locator: p.sourceScene, evidenceAndAdaptationLimits: p.sceneEvidence,
  locationOrFunctionSupportedByOpenedText: !p.sourceAccess.startsWith('indexed'), exactPropGeometryVerified: false, exactSourceLoopVerified: false, visual1to1Verified: false }));
const sourceChecks = { date: '2026-10-20', method: 'Explicit full-URL opens and focused passage searches; selected relevant text, indexed excerpts, failed opens and regional redirects are distinguished in stage-source-access.json. No claim of reading entire pages or watching a video. This generator does not repeat Web access.',
  scope: 'Locations, original versions and prop functions only. No source images, official animation frames or quotations imported. Outlines, cutaways, colors, scale, drive internals, no-load maintenance cycles and timing are authored.',
  globalCanon1to1Verified: false, globalVisual1to1Verified: false, officialAnimationFramesImported: 0,
  sourceReadCounts: { uniqueUrls: new Set(checks.map(c => c.sourceUrl)).size, profilesWithOpenedText: checks.filter(c => c.locationOrFunctionSupportedByOpenedText).length, profilesWithOnlyIndexedExcerpts: checks.filter(c => !c.locationOrFunctionSupportedByOpenedText).length,
    uniqueOpenedUrls: new Set(checks.filter(c => c.locationOrFunctionSupportedByOpenedText).map(c => c.sourceUrl)).size, uniqueIndexedOnlyUrls: new Set(checks.filter(c => !c.locationOrFunctionSupportedByOpenedText).map(c => c.sourceUrl)).size }, checks };
const slugs = ['teen-titans','yakuza','dungeon-meshi','left-4-dead','counter-strike','borderlands-2','cuphead','beyond-good','beyond-good-and-evil','sam-max','sam-and-max','deponia','hitman','hitman-world-of-assassination','red-faction','marathon','unreal-tournament-2004','metal-slug','dead-rising','quake','steins-gate','steins_gate','minecraft','unreal'];
const localPaths = fs.readdirSync(new URL('../../public/', import.meta.url), { recursive: true }).map(String).filter(file => /\.(png|webp|json)$/.test(file) && slugs.some(slug => file.includes('/'+slug+'/') || file.endsWith('/'+slug+'.webp') || file.endsWith('/'+slug+'-smash-openai.png'))).map(file => 'public/'+file).sort();
const coverage = { date: '2026-10-20', scope: 'All 525 HEROES_DB universes, using universe and mode only. A concrete scene name or description overrides the default reference and can select another profile or none.',
  baselineProfiles: baseline.profiles.length, addedProfiles: STAGE_ANIMATION_WAVE_8.length, totalProfiles: STAGE_ANIMATION_PROFILES.length, addedUniverses: [...new Set(STAGE_ANIMATION_WAVE_8.flatMap(p => p.universes))], before, after,
  declaredProfileUniverseStringsIncludingNonRoster: new Set(STAGE_ANIMATION_PROFILES.flatMap(p => p.universes)).size,
  source1to1Validated: 0, fidelityVerified: false, officialSourceFrames: false, newOfficialAnimationFrames: 0, newEffectAtlases: 0, newStaticBackdropRegions: 0,
  mechanismGeometry: '40 individual empty-prop mechanisms in 20 new roster universes; no generated anatomy or character silhouettes.', timeSource: 'simulation-elapsed-seconds', reducedMotion: 'freeze-at-time-zero', gameplayEffect: 'none',
  preservationEvidence: { path: 'stage-baseline.json', definitions: baseline.profiles.length, drawingCommandHashes: baseline.profiles.reduce((n,p) => n+p.samples.length,0), bitmapPixelComparison: false, note: 'SHA256 of Canvas commands at 1040x460, at zero and 23 percent of each period, with no Image in Node. Not pixel hashes or source-frame fidelity verification.' },
  sourceChecks: 'stage-source-checks.json', sourceAccess: 'stage-source-access.json', browserEvidence: 'stage-browser.json',
  localAssetInventory: { count: localPaths.length, paths: localPaths, method: 'Read-only relevant filename inventory. Names do not prove source suitability, specific map geometry or official frames.', importedByNewMechanisms: 0, newImagesGenerated: 0 },
  profiles: STAGE_ANIMATION_WAVE_8.map(p => JSON.parse(JSON.stringify(p, (_,v) => v instanceof RegExp ? v.toString() : v))), rows };
for (const [name,value] of [['stage-source-checks.json',sourceChecks],['stage-coverage.json',coverage]]) fs.writeFileSync(new URL(name,directory),JSON.stringify(value,null,2)+'\n');
const escape = s => String(s).replaceAll('|','\\|');
const table = STAGE_ANIMATION_WAVE_8.map(p => `| ${escape(p.universes[0])} | ${escape(p.sourceScene)} | \`${p.mechanism}\` | ${p.sourceAccess.startsWith('indexed') ? 'Extrait indexé seulement' : 'Passage ciblé ouvert et lu'} |`).join('\n');
const roster = rows.map(r => `| ${escape(r.universe)} | ${r.anyModeMechanism ? 'Mécanisme ciblé' : 'Ambiance de base seule'} | ${modes.map(m => r.mechanisms[m] ? '`'+r.mechanisms[m]+'`' : '—').join(' | ')} |`).join('\n');
fs.writeFileSync(new URL('stage-coverage.md',directory),`# Décors — vague 8, 20 octobre 2026

40 mécanismes supplémentaires dans 20 univers réels du roster auparavant sans mécanisme ciblé. Les 525 ambiances de base sont conservées. Aucune fidélité visuelle 1:1 n’est certifiée.

| Mesure | Avant | Après |
| --- | ---: | ---: |
| Définitions de mécanismes | ${coverage.baselineProfiles} | ${coverage.totalProfiles} |
| Univers du roster couverts dans au moins un mode | ${before.withAnyModeMechanism} | ${after.withAnyModeMechanism} |
| Univers couverts dans les quatre modes | ${before.withEveryModeMechanism} | ${after.withEveryModeMechanism} |
| Univers ayant uniquement l’ambiance de base | ${before.baseAtmosphereOnly} | ${after.baseAtmosphereOnly} |

Couverture par mode : Combat ${after.byMode.Combat.mechanisms}, Mêlée ${after.byMode.Melee.mechanisms}, RPG ${after.byMode.RPG.mechanisms}, Tactique ${after.byMode.Tactics.mechanisms}. Les ${coverage.declaredProfileUniverseStringsIncludingNonRoster} chaînes d’univers déclarées comprennent un ancien alias hors roster : le compteur de couverture porte bien sur ${after.withAnyModeMechanism} des 525 univers du roster.

Teen Titans, Yakuza et Dungeon Meshi rejoignent cette couverture. Metal Gear Rising était déjà équipé et ses mécanismes sont préservés. Les références par défaut servent seulement en l’absence de scène précise ; un lieu concret inconnu n’hérite d’aucun mécanisme ciblé.

## Mécanismes livrés

| Univers | Scène et version | Mécanisme dessiné | Accès à la référence |
| --- | --- | --- | --- |
${table}

## Sources et limites

Le [registre des sources](stage-source-checks.json) compte ${sourceChecks.sourceReadCounts.profilesWithOpenedText} profils appuyés par un passage ciblé ouvert et ${sourceChecks.sourceReadCounts.profilesWithOnlyIndexedExcerpts} par un extrait indexé seulement, sur ${sourceChecks.sourceReadCounts.uniqueUrls} URL principales. Le [journal d’accès](stage-source-access.json) conserve les ouvertures réussies, échecs, refus et redirection régionale Tubi. Il ne prétend ni archiver les pages complètes ni vérifier les animations originales. Les passages consultés établissent des lieux et fonctions ; les schémas, proportions, couleurs, organes internes, durées et cycles de maintenance à vide restent créés pour le projet.

La page officielle SEGA établit Pocket Circuit à Kamurocho et les UFO catchers de Hi-Tech Land ; l’emplacement Sotenbori suit aussi l’extrait indexé du [guide original de CyricZ](https://gamefaqs.gamespot.com/ps4/816306-yakuza-0/faqs/74451/arcade-games). Les transcripts Dungeon Meshi 2024 distinguent le piège à huile de l’épisode 2 et le bocal attaché à une corde de l’épisode 5. Les mécanismes restent vides, sans fantôme, golem, mimic ni anatomie dessinée.

cs_assault utilise sa porte intérieure coulissante ; la grille de garage statique n’est pas animée. Le générateur de de_nuke Source est une coupe fonctionnelle appuyée par son nom de modèle indexé, sans prétendre reproduire son mesh. Railroad Wrath utilise le chariot du joueur : la locomotive vivante n’est pas dessinée. Les trois plateaux du wagon Metal Slug sont appuyés par un guide du port PlayStation du jeu original ; aucune équivalence de frames Neo Geo n’est affirmée et aucun numéro de mission incertain n’est ajouté. Le petit moulin Play Park est une fonction décorative adaptée d’un prop documenté ; sa rotation n’est pas présentée comme une boucle originale observée. Les objets Minecraft sont des études de blocs vanilla, sans seed canonique ni animation automatique de meule prétendue.

Les exclusions séparent Teen Titans 2003 de Go!, Yakuza 0 original de ses rééditions, Dungeon Meshi anime des autres versions, Left 4 Dead des ports L4D2, Counter-Strike 1.6 de Source et CS2, Cuphead 2017 de la série animée, BG&E 2003 des rééditions, Hit the Road 1993 des jeux Telltale, Deponia 2012 des suites, HITMAN 2016 des états effondrés ou opératoires occupés, Red Faction 2001 des suites, Marathon 1994 de Redux et du reboot, UT2004 d’UT99/UT3, Metal Slug original des suites et du NGPC, Dead Rising 2006 de Deluxe Remaster, Quake PC des ports, Steins;Gate 2011 de 0/Elite, Minecraft Java des mods et Unreal 1998 de ses bêtas et suites. Aucun nouvel effet sur les PV, collisions, plateformes jouables, quêtes, inventaires, dangers ou déplacements.

L’inventaire relève ${localPaths.length} chemins locaux associés aux univers retenus. Aucun n’est détourné en frame ou machine : 0 nouvelle image générée, 0 atlas, 0 frame officielle et 0 région de fond recomposée dans les 40 ajouts.

## Vérifications

La [baseline](stage-baseline.json), capturée avant modification, conserve exactement 161 définitions et 322 SHA256 de commandes Canvas. Les tests imposent leur conservation ; il ne s’agit pas de comparaisons de pixels des anciens bitmaps. Aucun ancien profil, test, bitmap ou rapport n’est réécrit.

Les 6 tests dédiés vérifient les 40 géométries réellement mobiles, le déterminisme, les 20 univers neufs, 40 scènes rejetées et la résolution des scènes précises dans quatre modes. Les coordonnées consommées par le dessin vérifient la longueur des cordes, suspentes, liens articulés, empattements et bielles à six instants et quatre formats. La pause conserve le temps de simulation ; les deux chemins mouvement réduit figent zéro. Miroirs, drapeaux de désactivation, coordonnées finies, couleurs et restauration du Canvas sont vérifiés.

[Chromium](stage-browser.json) contrôle les pixels de 40 mécanismes, 160 rendus dans quatre modes et 120 formats supplémentaires (360×780, 1920×480, 512×512). Mouvement, pause, mouvement réduit, reflet Canvas, transformation restaurée, état intact et découpage de la zone de combat passent ; aucune erreur JavaScript de page. La [planche](stage-browser.png) montre le rendu réel à faible opacité. Les 56 tests existants de test:stages et les 9 tests d’ambiance passent. Lint ciblé passé. Le paquet global, l’audit combat global et la compilation appartiennent à l’intégration principale et ne sont pas déclarés validés ici.

Commandes depuis la racine du dépôt :

\`\`\`sh
node --test scripts/stageAnimationWave8.test.mjs
node scripts/stageAnimationWave8.browser.mjs
npm run test:stages
node --test scripts/stageAtmosphere.test.mjs
npx oxlint src/game/melee/stageAnimationCatalogWave8.js src/game/melee/stageAnimationCatalog.js scripts/stageAnimationWave8.test.mjs scripts/stageAnimationWave8.browser.mjs
node docs/combat-fidelity-wave8-2026-10-20/stage-audit.mjs
\`\`\`

Le navigateur utilise 5188 par défaut, modifiable avec STAGE_ANIMATION_REVIEW_URL. Le générateur régénère les compteurs et le registre à partir des données consignées, sans relire le Web ni écraser la baseline. [JSON complet](stage-coverage.json).

## Inventaire des 525 univers

Une scène concrète peut changer la résolution mesurée ci-dessous avec l’univers et le mode seuls.

| Univers | Statut | Combat | Mêlée | RPG | Tactique |
| --- | --- | --- | --- | --- | --- |
${roster}
`);
console.log(JSON.stringify({ definitions: coverage.totalProfiles, added: coverage.addedProfiles, newUniverses: coverage.addedUniverses.length, rows: rows.length, after, sourceReads: sourceChecks.sourceReadCounts, localAssetPaths: localPaths.length },null,2));
