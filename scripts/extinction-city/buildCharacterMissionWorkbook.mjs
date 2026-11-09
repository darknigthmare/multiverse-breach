/** Production-planning workbook. Run a copy from an OS-temporary directory
 * whose node_modules points to CODEX_PRIMARY_RUNTIME_NODE_MODULES, using
 * CODEX_PRIMARY_RUNTIME_NODE. No repository dependency is installed or changed. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { FileBlob, Workbook, SpreadsheetFile } from '@oai/artifact-tool';

const args = process.argv.slice(2);
const option = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const repo = path.resolve(option('--repo', process.cwd()));
const planningPath = path.resolve(option('--planning', '/tmp/mission-planning-2026-11-08.json'));
const fpsPath = path.resolve(option('--fps', '/tmp/multiverse-fps-roster-2026-11-08.json'));
const outputDir = path.resolve(option('--out', path.join(repo, 'outputs/character-missions-20261108')));
const outputName = 'Multiverse_Breach_Missions_Cite_Par_Personnage_2026-11-08.xlsx';
const existingPath = option('--existing', '');
const designLabels = { individual_proposal: 'Proposition individualisée',
  research_scaffold: 'Canevas à documenter — réécriture diégétique requise',
  source_objective_adaptation: 'Adaptation d’objectif source — réécriture diégétique requise',
  source_family_adaptation: 'Adaptation de famille — réécriture diégétique requise' };
const fieldEquipmentCommands = [
  'V : ranger l’arme de terrain et reprendre le kit personnel ; B : reprendre l’arme rangée, avec son chargeur, sa réserve et sa recharge restants.',
  'Un nouveau ramassage remplace l’unique arme de terrain portée. Le temps de recharge suit la simulation active et reste gelé en pause.',
  'Shotgun, plasma ou lance-roquettes partagés du Nexus ; emplacement limité à la partie, vidé à sa fin ou à l’abandon.'
].join('\n');
const fieldEquipmentSourceFiles = ['src/game/extinctionFieldEquipment.js', 'src/game/extinctionFighterProfiles.js', 'src/components/HubScreen.jsx'];
// Presentation provenance stays in the receipt, without changing planning cells.
const cityPresentationSourceFiles = ['src/components/HubScreen.jsx', 'src/game/mosaicMissionOperations.js',
  'src/game/mosaicMissionCargo.js', 'src/game/renderer.js', 'src/game/spriteAssets.js',
  'src/game/immersiveHubState.js', 'src/components/useSceneViewport.js', 'src/game/mosaicMissionWalks.js',
  'src/components/MosaicPocketTerminal.jsx', 'src/components/MosaicPocketTerminal.css',
  'src/components/MosaicCharacterMissions.jsx', 'src/components/ImmersiveDrawer.jsx'];
const fpsPresentationSourceFiles = ['src/components/HubScreen.jsx', 'src/game/extinctionAimReadout.js',
  'src/game/extinctionSignatures.js', 'src/game/extinctionFieldDirectives.js',
  'src/components/ExtinctionPrimaryAction.jsx', 'src/components/ExtinctionAimReadout.css'];
if (existingPath) {
  await refreshRuntimeContracts(path.resolve(existingPath));
  process.exit(0);
}
const data = JSON.parse(await fs.readFile(planningPath, 'utf8'));
const fpsData = JSON.parse(await fs.readFile(fpsPath, 'utf8'));
const { MOSAIC_CHARACTER_MISSIONS } = await import(pathToFileURL(path.join(repo, 'src/game/mosaicCharacterMissions.js')));
const fighters = new Map((fpsData.characters || fpsData.profiles).map(profile => [profile.heroId || profile.id, profile]));
assert.equal(data.characters.length, 1912);
assert.equal(data.missions.length, data.characters.length * 2);
assert.equal(new Set(data.characters.map(character => character.id)).size, data.characters.length);
assert.equal(new Set(data.missions.map(mission => mission.id)).size, data.missions.length);
assert.equal(fighters.size, data.characters.length, 'FPS inventory must include excluded residents explicitly');
const byCharacter = new Map(data.characters.map(character => [character.id, character]));
for (const character of data.characters) {
  assert.equal(data.missions.filter(mission => mission.characterId === character.id && mission.strand === 'universe').length, 1);
  assert.equal(data.missions.filter(mission => mission.characterId === character.id && mission.strand === 'multiverse').length, 1);
}
await fs.mkdir(outputDir, { recursive: true });
const workbook = Workbook.create();
const sheets = Object.fromEntries(['Synthèse', 'Missions à créer', 'Contrats jouables', 'Personnages', 'Profils FPS', 'Modes FPS'].map(name => [name, workbook.worksheets.add(name)]));
const colors = { dark: '#22344E', line: '#A8B4C4', input: '#FFF0C2', text: '#1D2939', muted: '#566578', red: '#FCE4E4', green: '#E2EFE7' };
const col = number => { let label = ''; for (let value = number; value > 0; value = Math.floor((value - 1) / 26)) label = String.fromCharCode(65 + (value - 1) % 26) + label; return label; };
const str = value => typeof value === 'string' ? value : value?.fr || value?.en || '';
const list = value => (Array.isArray(value) ? value : []).map(item => typeof item === 'object' ? str(item.name) || item.id || JSON.stringify(item) : item).filter(Boolean).join('\n');
const numbered = (items, property) => items.map((item, index) => `${index + 1}. ${str(item[property])}`).join('\n');
const gapNames = {
  individual_equipment_not_documented: 'Équipement individuel à documenter',
  generic_ability_names: 'Capacités génériques à préciser',
  individual_narrative_not_documented: 'Dossier individuel à écrire',
  continuity_not_locked: 'Continuité à verrouiller',
  external_reference_missing: 'Référence externe à fournir'
};
const gaps = values => (values || []).map(value => gapNames[value] || value).join('\n');
const base = (sheet, endRow, endCol) => {
  sheet.showGridLines = false;
  const range = sheet.getRange(`A1:${col(endCol)}${endRow}`);
  range.format.font = { name: 'Arial', size: 10, color: colors.text };
  range.format.verticalAlignment = 'center';
  range.format.rowHeight = 20;
};
function heading(sheet, title, context, endCol) {
  sheet.getRange('A2').values = [[title]];
  sheet.getRange('A2').format.font = { name: 'Arial', size: 15, bold: true, color: colors.dark };
  sheet.getRange('A2').format.rowHeight = 28;
  sheet.getRange(`A3:${col(endCol)}3`).format.borders = { bottom: { style: 'thin', color: colors.line } };
  sheet.getRange('A4').values = [[context]];
  sheet.getRange('A4').format.font = { italic: true, color: colors.muted };
  sheet.getRange('A4').format.wrapText = false;
}
function table(sheet, name, title, context, headers, rows, widths, inputColumns = []) {
  const lastRow = 6 + rows.length, lastColumn = headers.length;
  base(sheet, lastRow, lastColumn);
  heading(sheet, title, context, lastColumn);
  sheet.getRange(`A6:${col(lastColumn)}6`).values = [headers];
  if (rows.length) sheet.getRange(`A7:${col(lastColumn)}${lastRow}`).values = rows;
  sheet.getRange(`A6:${col(lastColumn)}${lastRow}`).format.wrapText = true;
  sheet.getRange(`A7:${col(lastColumn)}${lastRow}`).format.verticalAlignment = 'top';
  const range = sheet.getRange(`A6:${col(lastColumn)}6`);
  range.format.fill = colors.dark;
  range.format.font = { name: 'Arial', size: 10, color: '#FFFFFF', bold: true };
  range.format.horizontalAlignment = 'center';
  range.format.rowHeight = 34;
  range.format.borders = { insideVertical: { style: 'thin', color: '#FFFFFF' } };
  const nativeTable = sheet.tables.add(`A6:${col(lastColumn)}${lastRow}`, true, name);
  nativeTable.showFilterButton = true;
  widths.forEach((width, index) => { sheet.getRange(`${col(index + 1)}6:${col(index + 1)}${lastRow}`).format.columnWidth = width; });
  // Fit the complete authored content, including manual line breaks. Heights
  // are based on all columns, not just the opening viewport or sampled rows.
  rows.forEach((row, index) => {
    const lines = Math.max(...row.map((value, column) => String(value ?? '').split('\n').reduce((sum, part) => sum + Math.max(1, Math.ceil(part.length / Math.max(8, widths[column] - 3))), 0)));
    sheet.getRange(`A${index + 7}:${col(lastColumn)}${index + 7}`).format.rowHeight = Math.min(409, Math.max(30, lines * 13 + 8));
  });
  sheet.freezePanes.freezeRows(6);
  sheet.freezePanes.freezeColumns(Math.min(3, lastColumn));
  for (const column of inputColumns) sheet.getRange(`${column}7:${column}${lastRow}`).format.fill = colors.input;
  return { lastRow, lastColumn };
}

const missionHeaders = ['ID mission', 'ID personnage', 'Personnage', 'Univers', 'Volet', 'Titre proposé', 'Incident', 'Parcours',
  'Actions à accomplir', 'Obstacles', 'Critères de réussite', 'Famille', 'Priorité', 'Validation du lore', 'Écriture', 'Intégration', 'Recette', 'Prochaine étape', 'Responsable', 'Jalon', 'Notes de suivi', 'Source du personnage', 'Niveau de conception'];
const missionRows = data.missions.map(mission => {
  const character = byCharacter.get(mission.characterId);
  return [mission.id, mission.characterId, mission.characterName, mission.universe, mission.strand === 'universe' ? 'Univers' : 'Multiverse',
    mission.title, mission.premise, mission.location, numbered(mission.objectives, 'action'), numbered(mission.objectives, 'obstacle'),
    numbered(mission.objectives, 'success'), mission.familyLabel, mission.priority || 'P2', 'À valider', 'À écrire', 'À faire', 'À faire', null,
    mission.owner || '', mission.targetMilestone || '', [mission.reviewNotes, list(character.planningNotes), gaps(character.sourceGaps)].filter(Boolean).join('\n'),
    [character.sourceUrl, list(mission.sourceBindings)].filter(Boolean).join('\n'), designLabels[mission.designKind] || mission.designKind];
});
const missions = table(sheets['Missions à créer'], 'MissionsCite', 'Missions de la Cité à créer',
  `Deux propositions par personnage. Cellules jaunes : suivi à renseigner. Les ${MOSAIC_CHARACTER_MISSIONS.length} contrats jouables sont suivis séparément.`,
  missionHeaders, missionRows, [39, 27, 25, 26, 15, 36, 62, 42, 76, 66, 66, 26, 12, 20, 18, 18, 18, 25, 24, 24, 50, 55, 34],
  ['M', 'N', 'O', 'P', 'Q', 'S', 'T', 'U']);
const ms = sheets['Missions à créer'];
ms.getRange(`M7:M${missions.lastRow}`).dataValidation = { rule: { type: 'list', values: ['P1', 'P2', 'P3'] } };
ms.getRange(`N7:N${missions.lastRow}`).dataValidation = { rule: { type: 'list', values: ['À valider', 'À documenter', 'Validé'] } };
ms.getRange(`O7:O${missions.lastRow}`).dataValidation = { rule: { type: 'list', values: ['À écrire', 'En cours', 'Terminée'] } };
ms.getRange(`P7:P${missions.lastRow}`).dataValidation = { rule: { type: 'list', values: ['À faire', 'En cours', 'Intégrée'] } };
ms.getRange(`Q7:Q${missions.lastRow}`).dataValidation = { rule: { type: 'list', values: ['À faire', 'En cours', 'Validée'] } };
ms.getRange('R7').formulas = [['=IF(N7<>"Validé","Valider le lore",IF(O7<>"Terminée","Terminer l’écriture",IF(P7<>"Intégrée","Intégrer la mission",IF(Q7<>"Validée","Exécuter la recette","Terminée"))))']];
ms.getRange(`R7:R${missions.lastRow}`).fillDown();
ms.getRange(`R7:R${missions.lastRow}`).conditionalFormats.add('containsText', { text: 'Terminée', format: { fill: colors.green } });

const liveRows = runtimeContractRows(MOSAIC_CHARACTER_MISSIONS, byCharacter);
table(sheets['Contrats jouables'], 'ContratsJouables', `${liveRows.length} contrats originaux jouables`,
  'Missions distinctes des propositions à créer. Progression sur place, choix puis transmission à l’ancre locale.',
  ['ID contrat', 'Personnage', 'Titre', 'Incident', 'Étapes dans la Cité', 'Conclusions possibles', 'Accès', 'État vérifié', 'Résultat', 'Sources du projet'],
  liveRows, [39, 25, 38, 60, 74, 74, 42, 54, 46, 60]);

const characterRows = data.characters.map(character => [character.id, character.name, character.universe,
  character.nonCombat ? 'Non combattant' : 'Combattant', character.sourceRole || 'À documenter', character.continuity || 'À verrouiller',
  character.sourceDoctrine || character.sourceObjective || 'À documenter',
  ...['simple', 'secondary', 'defense', 'special'].map(slot => {
    const action = character.actions.find(item => item.slot === slot);
    return action ? `${action.name} (${action.type})${action.generic ? ' — générique à préciser' : ''}` : 'Non renseigné';
  }), list(character.equipment) || character.rawWeaponType || 'À documenter', gaps(character.sourceGaps) || 'Aucune lacune signalée par cet inventaire',
  character.nonCombat ? 'Missions civiles ; aucun équipement de combat ajouté.' : 'Techniques et incarnation à vérifier avant production spécifique.',
  [list(character.identityConstraints), list(character.planningNotes)].filter(Boolean).join('\n'), character.sourceUrl]);
table(sheets.Personnages, 'PersonnagesSource', 'Personnages et contraintes de source',
  `Catalogue du dépôt au ${data.date || '2026-11-08'}. Les références externes ne sont pas déclarées vérifiées.`,
  ['ID personnage', 'Personnage', 'Univers', 'Participation', 'Rôle documenté', 'Continuité', 'Doctrine ou activité', 'Action principale', 'Secondaire', 'Défense', 'Spécial', 'Équipement déclaré', 'Points à documenter', 'Règle de conception', 'Contraintes d’identité', 'Source'],
  characterRows, [29, 26, 28, 20, 43, 43, 68, 44, 44, 44, 44, 46, 50, 50, 50, 65]);

// The profile exporter owns these descriptions; this workbook reports its
// source/runtime distinction and never labels schematic hands as faithful art.
const profileRows = data.characters.map(character => {
  const profile = fighters.get(character.id);
  const actions = profile.actions || profile.signature?.actions || [];
  const action = slot => {
    const item = Array.isArray(actions) ? actions.find(value => value.slot === slot) : actions[slot];
    if (!item) return character.nonCombat ? 'Sans objet' : 'Voir le profil exporté';
    const distance = String(item.reach?.value ?? item.range ?? 0).replace('.', ',');
    const reach = item.reach?.kind === 'movement' || ['dash', 'teleport'].includes(item.kind) ? `Déplacement : ${distance} unités.`
      : item.reach?.kind === 'self' || ['heal', 'guard', 'buff', 'support'].includes(item.kind) ? 'Effet sur soi.'
        : item.reach?.kind === 'support-radius' ? `Rayon de soutien : ${distance} unités.`
          : item.reach?.kind === 'placement' ? `Déploiement : ${distance} unités. Rayon d’effet : ${String(item.reach.effectRadius).replace('.', ',')} unités.`
            : item.reach?.kind === 'anchor' ? 'Point de retour posé à ta position.'
              : item.reach?.kind === 'radius' ? `Rayon d’effet : ${distance} unités.`
                : `Portée : ${distance} unités.`;
    return [str(item.name || item.label), `Source : ${item.sourceType || 'à préciser'} ; en jeu : ${item.kind || 'à préciser'}.`,
      `Récupération : ${item.cooldown ?? 0} ticks. ${reach}`,
      slot === 'special' ? str(profile.ultimateCharge?.rule) : ''].filter(Boolean).join('\n');
  };
  const reviewLabels = { AUTHORED_KIT_ART_PENDING: 'Kit spécifique existant', GENERIC_SOURCE_REVIEW_REQUIRED: 'Adaptation de source générique',
    NON_COMBAT_PRESERVED: 'Non combattant préservé', SOURCE_TYPE_ADAPTED_ART_PENDING: 'Adaptation des techniques source' };
  const viewLabels = { EXACT_OWNER_PARTIAL_ART_REVIEW_REQUIRED: 'Planche du propriétaire exact ; fidélité partielle à revoir',
    SCHEMATIC_ART_PENDING: 'Vue schématique ; art individuel à produire', OUTSIDE_FPS: 'Sans objet : non combattant' };
  const resourceLabels = { ammo: 'Munitions du profil', cooldown: 'Récupération de technique', none: 'Sans ressource FPS' };
  return [character.id, character.name, character.universe, character.nonCombat ? 'Exclu du combat' : 'Jouable',
    reviewLabels[profile.reviewStatus] || profile.reviewStatus,
    profile.view.src || (profile.eligible ? `Schéma ${profile.view.schematicKind}` : 'Sans objet'),
    viewLabels[profile.view.artStatus] || profile.view.artStatus,
    resourceLabels[profile.resource.kind] || profile.resource.kind,
    profile.eligible ? profile.equipment.map(item => `${item.label} (${item.provenance})${item.reviewRequired ? ' — à vérifier' : ''}`).join('\n') : 'Aucun équipement de combat attribué',
    action('simple'), action('secondary'), action('defense'), action('special'),
    character.nonCombat ? 'Activités de Cité conservées.' : [profile.reviewStatus === 'GENERIC_SOURCE_REVIEW_REQUIRED' ? 'Préciser les techniques génériques du dossier.' : '',
      'Valider la morphologie, les mains, les animations et les effets propres à l’incarnation.', 'Tester l’équilibrage dans les quatre modes.'].filter(Boolean).join('\n'),
    str(profile.sourceUrl) || character.sourceUrl];
});
table(sheets['Profils FPS'], 'ProfilsFps', 'FPS par personnage',
  'Profils de jeu, vue et actions déclarées. Une adaptation de mécanique ne valide pas la fidélité des mains ou des effets.',
  ['ID personnage', 'Personnage', 'Univers', 'Accès FPS', 'Type de profil', 'Vue', 'État visuel', 'Ressource', 'Équipement', 'Action principale', 'Secondaire', 'Défense', 'Spécial', 'Travail restant', 'Source'],
  profileRows, [29, 26, 27, 22, 30, 43, 48, 32, 46, 48, 48, 48, 48, 65, 65]);
const modeDescriptions = {
  extraction: ['Solo Extraction', 'Activer trois balises puis vaincre le Champion et ses soutiens.', 'Trois balises synchronisées, puis condition finale du mode.'],
  last_signal: ['Dernier Signal', 'Survivre aux vagues et vaincre le Champion.', 'Quatre décryptages confirmés avant le Champion.'],
  infestation: ['Infestation', 'Survivre au seuil d’extraction.', 'Soixante secondes actives et trois évents scellés.'],
  hunt: ['Chasse au Champion', 'Éliminer les soutiens puis vaincre le Champion.', 'Champion marqué à portée et dans la visée ; fenêtre de vulnérabilité de quatre secondes.']
};
const modeRows = fpsData.modes.map(mode => [mode.mode, modeDescriptions[mode.mode][0], modeDescriptions[mode.mode][1],
  str(mode.label), str(mode.rule), [mode.mode === 'hunt' ? 'Viser, puis T / MARQUER.' : 'E / INTERAGIR, maintien dans le périmètre, puis E.', fieldEquipmentCommands].join('\n'),
  modeDescriptions[mode.mode][2], mode.status === 'EXISTING_RUNTIME' ? 'Variante existante conservée' : 'Variante intégrée ; recette suivie dans la PR',
  [mode.sourcePath, ...fieldEquipmentSourceFiles].join('\n')]);
assert.equal(modeRows.length, 4);
table(sheets['Modes FPS'], 'ModesFps', 'Quatre modes FPS',
  'Les directives sont facultatives. Les conditions de fin et les reçus de récompense du mode restent contrôlés.',
  ['ID mode', 'Mode', 'Objectif de base', 'Directive facultative', 'Objectif de directive', 'Commandes', 'Condition de réussite', 'État', 'Source'],
  modeRows, [22, 29, 58, 35, 76, 50, 62, 50, 65]);

const summary = sheets.Synthèse;
base(summary, 32, 10);
summary.tabColor = colors.dark;
heading(summary, 'Cité et FPS — suivi de production', 'Multiverse Breach · 8 novembre 2026', 7);
summary.getRange('A6:B6').values = [['Périmètre', 'Nombre']];
summary.getRange('A7:A13').values = [['Personnages recensés'], ['Personnages non combattants'], ['Propositions liées à un univers'], ['Propositions Multiverse'], ['Propositions terminées'], ['Contrats originaux jouables'], ['Modes FPS']];
summary.getRange('B7:B13').formulas = [
  [`=COUNTA(Personnages!A7:A${data.characters.length + 6})`],
  [`=COUNTIF(Personnages!D7:D${data.characters.length + 6},"Non combattant")`],
  [`=COUNTIF('Missions à créer'!E7:E${missions.lastRow},"Univers")`],
  [`=COUNTIF('Missions à créer'!E7:E${missions.lastRow},"Multiverse")`],
  [`=COUNTIF('Missions à créer'!R7:R${missions.lastRow},"Terminée")`],
  [`=COUNTA('Contrats jouables'!A7:A${liveRows.length + 6})`], ['=COUNTA(\'Modes FPS\'!A7:A10)']
];
summary.getRange('D6:E6').values = [['Prochaine étape', 'Missions']];
summary.getRange('D7:D11').values = [['Valider le lore'], ['Terminer l’écriture'], ['Intégrer la mission'], ['Exécuter la recette'], ['Terminée']];
summary.getRange('E7').formulas = [[`=COUNTIF('Missions à créer'!$R$7:$R$${missions.lastRow},D7)`]];
summary.getRange('E7:E11').fillDown();
summary.getRange('D14:E14').values = [['Niveau de conception', 'Missions']];
summary.getRange('D15:D18').values = Object.values(designLabels).map(value => [value]);
summary.getRange('E15').formulas = [[`=COUNTIF('Missions à créer'!$W$7:$W$${missions.lastRow},D15)`]];
summary.getRange('E15:E18').fillDown();
summary.getRange('A16:B19').values = [
  ['Utiliser le suivi', 'Filtrer « Missions à créer » par personnage, univers ou priorité. Les colonnes jaunes sont modifiables.'],
  ['Fin d’une mission', 'Lore validé, écriture terminée, intégration effectuée et recette validée sont tous requis.'],
  ['Contrats jouables', `${liveRows.length} contrats intégrés ont leurs propres IDs et parcours. Ils ne terminent pas les 3 824 propositions.`],
  ['Profils FPS', 'Les techniques exécutables, schémas de vue et planches spécifiques sont distingués. Les PNJ restent exclus du combat.']
];
summary.getRange('A22:B24').values = [
  ['Couverture', 'Une proposition univers et une proposition Multiverse pour chaque identité du catalogue.'],
  ['Validation du lore', 'Les dossiers du projet servent de base. Les lacunes et incohérences sont signalées dans « Personnages ».'],
  ['Révision de source', data.sourceRevision]
];
summary.getRange('A6:B6').format = { fill: colors.dark, font: { name: 'Arial', size: 10, bold: true, color: '#FFFFFF' } };
summary.getRange('D6:E6').format = { fill: colors.dark, font: { name: 'Arial', size: 10, bold: true, color: '#FFFFFF' } };
summary.getRange('D14:E14').format = { fill: colors.dark, font: { name: 'Arial', size: 10, bold: true, color: '#FFFFFF' } };
for (const address of ['A6:B13', 'D6:E11']) summary.getRange(address).format.rowHeight = 27;
summary.getRange('B7:B13').setNumberFormat('#,##0'); summary.getRange('E7:E11').setNumberFormat('#,##0');
summary.getRange('E15:E18').setNumberFormat('#,##0');
summary.getRange('B7:B13').format.horizontalAlignment = 'right'; summary.getRange('E7:E11').format.horizontalAlignment = 'right';
summary.getRange('A6:A24').format.columnWidth = 36;
summary.getRange('B6:B24').format.columnWidth = 58;
summary.getRange('C6:C24').format.columnWidth = 4;
summary.getRange('D6:D24').format.columnWidth = 38;
summary.getRange('E6:E24').format.columnWidth = 13;
summary.getRange('A16:B24').format.wrapText = true;
summary.getRange('D14:E18').format.wrapText = true;
summary.getRange('D14:E18').format.rowHeight = 42;
for (const row of [16, 17, 18, 19, 22, 23, 24]) summary.getRange(`A${row}:B${row}`).format.rowHeight = row === 24 ? 34 : 58;

// Exercise the completion gates, including a blank prerequisite. Restore every
// authoring-only change before final recalculation, renders and export.
const original = ms.getRange('N7:Q7').values;
const gateProof = [];
for (const [values, expected] of [
  [['Validé', 'Terminée', 'Intégrée', 'À faire'], 'Exécuter la recette'],
  [['Validé', 'Terminée', 'Intégrée', 'Validée'], 'Terminée'],
  [['', 'Terminée', 'Intégrée', 'Validée'], 'Valider le lore']
]) {
  ms.getRange('N7:Q7').values = [values];
  assert.equal(ms.getRange('R7').values[0][0], expected);
  const total = summary.getRange('B11').values[0][0];
  assert.equal(total, expected === 'Terminée' ? 1 : 0);
  gateProof.push({ values, next: expected, completed: total });
}
ms.getRange('N7:Q7').values = original;
workbook.recalculate();
assert.deepEqual(summary.getRange('B7:B13').values.flat(), [1912, 101, 1912, 1912, 0, liveRows.length, 4]);
for (const row of [7, 1918, missions.lastRow]) assert.ok(ms.getRange(`R${row}`).formulas[0][0].includes(`N${row}`));
const errors = await workbook.inspect({ kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!', options: { useRegex: true, maxResults: 100 }, summary: 'Formula error scan', maxChars: 5000 });
const summaryInspection = await workbook.inspect({ kind: 'table', range: 'Synthèse!A6:E13', include: 'values,formulas', tableMaxRows: 8, tableMaxCols: 5, maxChars: 8000 });
await fs.writeFile(path.join(outputDir, 'workbook-inspection.json'), JSON.stringify({ formulaScan: errors.ndjson, summary: summaryInspection.ndjson, gateProof }, null, 2));
const previews = [
  ['Synthèse', 'A1:E24', 'synthese'], ['Missions à créer', 'A1:F9', 'missions-identites'],
  ['Missions à créer', 'F5:K9', 'missions-objectifs'], ['Missions à créer', 'M5:U10', 'missions-suivi'],
  ['Contrats jouables', 'A1:F9', 'contrats-jouables'], ['Personnages', 'A1:G9', 'personnages'],
  ['Profils FPS', 'A1:I9', 'profils-fps'], ['Modes FPS', 'A1:G10', 'modes-fps']
];
const evasionRow = data.characters.findIndex(character => fighters.get(character.id)?.ultimateCharge?.kind === 'evasion') + 7;
if (evasionRow >= 7) previews.push(['Profils FPS', `J${evasionRow}:M${evasionRow + 2}`, 'profils-mobilite']);
for (const [sheetName, range, name] of previews) {
  const image = await workbook.render({ sheetName, range, scale: 1, format: 'png' });
  await fs.writeFile(path.join(outputDir, `${name}.png`), new Uint8Array(await image.arrayBuffer()));
}
const output = await SpreadsheetFile.exportXlsx(workbook);
const outputPath = path.join(outputDir, outputName);
await output.save(outputPath);
const bytes = await fs.readFile(outputPath);
const receipt = { schema: 1, sourceRevision: data.sourceRevision, workbook: outputName, sha256: createHash('sha256').update(bytes).digest('hex'),
  bytes: bytes.length, characters: data.characters.length, nonCombatCharacters: 101, proposedMissions: data.missions.length,
  individuallyDesignedMissions: data.counts.individuallyDesignedMissions,
  integratedCityContracts: liveRows.length, fpsProfiles: fighters.size, fpsModes: modeRows.length,
  sheets: Object.keys(sheets), previews: previews.map(([, , name]) => `${name}.png`), gateProof,
  formulaScan: errors.ndjson, nativeApplicationCheck: 'Not executed; Artifact Tool recalculation, XLSX readback and rendered review are separate checks.' };
await fs.writeFile(path.join(outputDir, 'workbook-receipt.json'), JSON.stringify(receipt, null, 2));
console.log(JSON.stringify({ outputPath, ...receipt }));

function runtimeContractRows(missions, names) {
  const txt = value => typeof value === 'string' ? value : value?.fr || value?.en || '';
  const byId = new Map(missions.map(mission => [mission.id, mission]));
  const point = route => Number.isFinite(route.x) && Number.isFinite(route.y) ? ` (x=${route.x}, y=${route.y})` : '';
  const intervention = (step, prefix, compact = false) => {
    const operation = step.operation;
    const compactAction = operation
      ? `${prefix}Geste [${operation.kind}] — ${txt(operation.propName)} : ${txt(step.text)}${point(step)}${txt(operation.label) === txt(step.text) ? '' : ` ; ${txt(operation.label)}`}`
      : `${prefix}${txt(step.text)}${point(step)}`;
    return [
      compact ? compactAction : `${prefix}${txt(step.text)}${point(step)}`,
      operation && !compact ? `Geste [${operation.kind}] — ${txt(operation.propName)} : ${txt(operation.label)}` : '',
      operation ? `Après le geste : ${txt(operation.completedText)}` : '',
      step.finding && txt(step.finding) !== txt(operation?.completedText) ? `Constat : ${txt(step.finding)}` : '',
      step.cargo ? `Transport [${step.cargo.action}] — ${txt(step.cargo.label)} [${step.cargo.id}] (${step.cargo.appearance}).` : '',
      step.walk ? `Parcours à pied, dans cet ordre : ${step.walk.points.map((point, index) =>
        `${index + 1}. ${txt(point.label)} [${point.id}] (x=${point.x}, y=${point.y})`).join(' ; ')}. Interaction requise au dernier point après le trajet.` : '',
      compact && step.dialogue ? `Réponse : « ${txt(step.dialogue)} »` : ''
    ].filter(Boolean).join(compact ? ' · ' : '\n');
  };
  return missions.map(mission => {
    const hasCargo = mission.steps.some(step => step.cargo);
    const hasWalk = mission.steps.some(step => step.walk || ['byOriginChoice', 'byChoice'].some(field =>
      Object.values(step[field] || {}).some(branch => branch.walk)));
    const compact = hasCargo || hasWalk;
    const previous = mission.requiresMissionId ? byId.get(mission.requiresMissionId) : null;
    assert.ok(!mission.requiresMissionId || previous, `Missing prerequisite: ${mission.id}`);
    const inheritedChoices = new Map((previous?.steps.find(step => step.type === 'decision')?.choices || [])
      .filter(item => item.valid).map(item => [item.id, item]));
    const steps = mission.steps.map((step, index) => {
      if (step.byOriginChoice) return [
        `${index + 1}. Trajet selon le choix du chapitre ${previous.chapter || 1} :`,
        ...Object.entries(step.byOriginChoice).map(([id, route]) => {
          assert.ok(inheritedChoices.has(id), `Unknown inherited choice: ${mission.id}/${id}`);
          return `${txt(inheritedChoices.get(id).label)} [${id}]\n${intervention(route, '', compact)}`;
        })
      ].join('\n');
      if (step.byChoice) return `${index + 1}. Accomplir l’intervention choisie sur place ; les deux gestes et leurs effets sont détaillés en « Conclusions possibles ».`;
      return intervention(step, `${index + 1}. `, compact);
    }).join('\n');
    const conclusions = mission.steps.find(step => step.type === 'decision').choices.filter(item => item.valid)
      .map(item => [
        `Choix : ${txt(item.label)} [${item.id}]`, `Décision : ${txt(item.result)}`,
        ...mission.steps.flatMap((step, index) => {
          if (!step.byChoice) return [];
          const route = step.byChoice[item.id];
          assert.ok(route, `Missing decision route: ${mission.id}/${item.id}`);
          return [intervention(route, `${index + 1}. À accomplir : `, compact)];
        })
      ].join('\n')).join('\n\n');
    const characterId = mission.heroId || mission.characterId;
    const systemSources = mission.systemSourceFiles || ['src/game/mosaicCharacterMissions.js', 'src/game/mosaicMissionOperations.js',
      ...(mission.requiresMissionId ? ['src/game/mosaicCharacterFollowups.js'] : []),
      ...(hasCargo ? ['src/game/mosaicMissionCargo.js'] : [])];
    const closingStep = mission.steps.at(-1);
    return [mission.id, names.get(characterId)?.name || characterId,
      txt(mission.title), [`« ${txt(mission.request)} »`, `Lieu : ${txt(mission.location)}`, txt(mission.premise), txt(mission.continuity)].filter(Boolean).join('\n'), steps, conclusions,
      [`Chapitre ${mission.chapter || 1}.`,
        `Personnage disponible et présent dans le quartier ${mission.universe}. Vitrines requises disponibles.`,
        mission.universe === 'Nexus de Convergence' ? '' : `DLC ${mission.universe} installé.`,
        previous ? `Prérequis : « ${txt(previous.title)} » [${previous.id}], terminé avec une conclusion valide. Le choix hérité fixe le premier trajet.` : 'Aucun contrat préalable.'
      ].filter(Boolean).join('\n'),
      'Définition runtime intégrée. Les tests automatisés et la recette navigateur sont suivis séparément dans la PR ; ce classeur ne certifie pas leur résultat.',
      [`Progression, choix${previous ? ' et choix hérité' : ''} sauvegardés. L’accessoire change d’état après le geste physique ; le choix seul ne répare rien. L’historique déjà joué est conservé. Aucune monnaie ni arme attribuée.`,
        hasCargo ? 'Un seul objet de quête porté ; prise et dépôt exigent le bon lieu et le bon objet. Le transport persiste dans la progression entre quartiers et reprises, sans entrer dans l’inventaire de combat.' : '',
        hasWalk ? 'Parcours attesté par le déplacement réel dans l’ordre des points de la branche. Sa progression est sauvegardée entre quartiers et reprises ; un menu, un clic à distance ou une téléportation ne l’accomplit pas. Le dernier point exige encore une interaction sur place.' : '',
        closingStep.type === 'npc' ? `Clôture auprès de ${names.get(closingStep.targetId)?.name || closingStep.targetId} [${closingStep.targetId}], par interaction avec le personnage.` : ''
      ].filter(Boolean).join('\n'),
      [...new Set([mission.contentFile || mission.sourceFile || 'src/game/mosaicCharacterMissions.js',
        ...systemSources, ...(mission.sourceRefs || []), mission.source,
        ...(mission.references || mission.referenceUrls || [])].filter(Boolean))].join('\n')];
  });
}

/** Edit the imported workbook. Preserve tracking and unrelated source/FPS tabs;
 * update authored stories, their future Nexus extensions and generic review flags. */
async function refreshRuntimeContracts(inputPath) {
  const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
  if (args.includes('--inspect-only')) {
    await fs.mkdir(outputDir, { recursive: true });
    for (const [sheetName, range, name] of [
      ['Synthèse', 'A1:E24', 'baseline-synthese'],
      ['Missions à créer', option('--inspection-range', 'F6:K10'), 'baseline-propositions'],
      ['Contrats jouables', 'B6:F8', 'baseline-contrats']
    ]) {
      const preview = await workbook.render({ sheetName, range, scale: 1, format: 'png' });
      await fs.writeFile(path.join(outputDir, `${name}.png`), new Uint8Array(await preview.arrayBuffer()));
    }
    console.log(JSON.stringify({ operation: 'read-only import and rendering', inputPath, outputDir }));
    return;
  }
  const data = JSON.parse(await fs.readFile(planningPath, 'utf8'));
  const runtimeMissions = data.runtimeMissions;
  assert.ok(runtimeMissions.length > 0, 'At least one runtime contract is required.');
  assert.equal(new Set(runtimeMissions.map(mission => mission.id)).size, runtimeMissions.length,
    'Runtime contract identifiers must remain unique.');
  const summary = workbook.worksheets.getItem('Synthèse');
  const live = workbook.worksheets.getItem('Contrats jouables');
  const people = workbook.worksheets.getItem('Personnages');
  const count = Number(summary.getRange('B7').values[0][0]);
  const names = new Map(people.getRange(`A7:B${count + 6}`).values.map(([id, name]) => [id, { name }]));
  const rows = runtimeContractRows(runtimeMissions, names);
  const oldCount = Number(summary.getRange('B12').values[0][0]);
  assert.ok(Number.isInteger(oldCount) && oldCount > 0 && oldCount <= rows.length);
  assert.deepEqual(live.getRange(`A7:A${oldCount + 6}`).values.flat(), rows.slice(0, oldCount).map(row => row[0]),
    'Existing contracts must remain in order; a removal or reordering needs an explicit migration.');
  const originalRuntimeRows = live.getRange(`A7:J${oldCount + 6}`).values;
  const originalRuntimeHeights = Array.from({ length: oldCount }, (_, index) =>
    Number(live.getRange(`A${index + 7}`).format.rowHeight));
  const changedRuntimeRows = rows.flatMap((row, index) =>
    index >= oldCount || row.some((value, column) => value !== originalRuntimeRows[index][column]) ? [index + 7] : []);
  const unchanged = ['Personnages', 'Profils FPS'].map(name => {
    const sheet = workbook.worksheets.getItem(name), range = sheet.getUsedRange();
    return { name, values: range.values, formulas: range.formulas };
  });
  const proposals = workbook.worksheets.getItem('Missions à créer');
  const proposalRange = proposals.getRange(`A1:W${data.missions.length + 6}`);
  const originalProposalValues = structuredClone(proposalRange.values);
  const expectedProposals = structuredClone(originalProposalValues);
  const originalProposalFormulas = structuredClone(proposalRange.formulas);
  const modes = workbook.worksheets.getItem('Modes FPS');
  const modeRange = modes.getRange('A1:I10');
  const originalModeValues = structuredClone(modeRange.values);
  const expectedModeValues = structuredClone(originalModeValues);
  const originalModeFormulas = structuredClone(modeRange.formulas);
  const fieldEquipmentSources = await Promise.all(fieldEquipmentSourceFiles.map(async source => ({ source,
    sha256: createHash('sha256').update(await fs.readFile(path.join(repo, source))).digest('hex') })));
  const cityPresentationSources = await Promise.all(cityPresentationSourceFiles.map(async source => ({ source,
    sha256: createHash('sha256').update(await fs.readFile(path.join(repo, source))).digest('hex') })));
  const fpsPresentationSources = await Promise.all(fpsPresentationSourceFiles.map(async source => ({ source,
    sha256: createHash('sha256').update(await fs.readFile(path.join(repo, source))).digest('hex') })));
  assert.deepEqual(proposals.getRange(`A7:A${data.missions.length + 6}`).values.flat(), data.missions.map(mission => mission.id));
  const setProposal = (row, column, value) => {
    expectedProposals[row - 1][column - 1] = value;
  };
  const sourceCharacters = new Map(data.characters.map(character => [character.id, character]));
  const updatedProposalRows = [];
  const authoredProposalRows = [];
  for (let index = 0; index < data.missions.length; index++) {
    const mission = data.missions[index], row = index + 7;
    if (mission.relatedRuntimeMissionId) {
      authoredProposalRows.push(row);
      const details = [mission.title, mission.premise, mission.location,
        ...['action', 'obstacle', 'success'].map(field => mission.objectives.map((step, number) => `${number + 1}. ${step[field]}`).join('\n'))];
      details.forEach((value, column) => setProposal(row, column + 6, value));
      setProposal(row, 22, [sourceCharacters.get(mission.characterId).sourceUrl, ...mission.sourceBindings,
        mission.runtimeMissionId
          ? `Adaptation jouable intégrée : ${mission.runtimeMissionId}. ${mission.runtimeScope} Le suivi manuel et la validation du lore restent à renseigner.`
          : `Prolongement proposé du récit ${mission.relatedRuntimeMissionId} ; cette nouvelle scène reste à développer.`].join('\n'));
      if ([5, 6, 7, 8, 9, 10, 21].some(column =>
        originalProposalValues[row - 1][column] !== expectedProposals[row - 1][column])) updatedProposalRows.push(row);
    }
    setProposal(row, 23, designLabels[mission.designKind]);
  }
  const linkedProposals = data.missions.filter(mission => mission.runtimeMissionId);
  setProposal(4, 1, `Deux propositions par personnage. Suivi jaune conservé. ${linkedProposals.length} adaptations liées à un contrat jouable ; les ${runtimeMissions.length} contrats et leurs interventions sont détaillés dans « Contrats jouables ».`);
  // Batch each contiguous authored area. Do not trigger a table update per cell.
  const proposalGroups = [];
  for (const row of updatedProposalRows) {
    const group = proposalGroups.at(-1);
    if (group && group[1] === row - 1) group[1] = row;
    else proposalGroups.push([row, row]);
  }
  for (const [start, end] of proposalGroups) {
    proposals.getRange(`F${start}:K${end}`).values = expectedProposals.slice(start - 1, end).map(row => row.slice(5, 11));
    proposals.getRange(`V${start}:V${end}`).values = expectedProposals.slice(start - 1, end).map(row => [row[21]]);
  }
  proposals.getRange(`W7:W${data.missions.length + 6}`).values = expectedProposals.slice(6).map(row => [row[22]]);
  proposals.getRange('A4').values = [[expectedProposals[3][0]]];
  const nativeTable = live.tables.items.find(table => table.name === 'ContratsJouables');
  assert.ok(nativeTable, 'The existing native contract table is required.');
  if (rows.length > oldCount) nativeTable.rows.add(null, rows.slice(oldCount));
  for (let index = oldCount; index < rows.length; index++) {
    live.getRange(`A${index + 7}:J${index + 7}`).copyFrom(live.getRange(`A${oldCount + 6}:J${oldCount + 6}`), 'all');
  }
  live.getRange(`A7:J${rows.length + 6}`).values = rows;
  live.getRange('A2').values = [[`${rows.length} contrats originaux jouables`]];
  live.getRange('A4').values = [['Demandes personnelles, lieux, gestes et effets locaux. Une décision choisit une suite ; son intervention reste à accomplir sur place.']];
  const widths = [39, 25, 40, 82, 112, 112, 52, 54, 58, 90];
  const wrappedLines = (value, width) => String(value ?? '').split('\n').reduce((sum, part) =>
    sum + Math.max(1, Math.ceil(part.length / Math.max(8, width - 6))), 0);
  for (const column of [4, 5]) {
    while (Math.max(...rows.map(row => wrappedLines(row[column], widths[column]))) > 29 && widths[column] < 180) widths[column] += 8;
  }
  widths.forEach((width, column) => { live.getRange(`${String.fromCharCode(65 + column)}6:${String.fromCharCode(65 + column)}${rows.length + 6}`).format.columnWidth = width; });
  const rowHeights = [];
  rows.forEach((row, index) => {
    const range = live.getRange(`A${index + 7}:J${index + 7}`);
    const unchangedRow = index < oldCount && !changedRuntimeRows.includes(index + 7);
    if (!unchangedRow) range.format.autofitRows();
    const height = unchangedRow ? originalRuntimeHeights[index] : Math.max(30, Number(range.format.rowHeight) + 8);
    assert.ok(height <= 409, `Contract ${row[0]} needs ${height} pt: widen the changed column instead of truncating text.`);
    range.format.rowHeight = height;
    rowHeights.push(height);
  });
  for (const row of updatedProposalRows) {
    const values = expectedProposals[row - 1];
    const changedColumns = [[5, 36], [6, 62], [7, 42], [8, 76], [9, 66], [10, 66], [21, 55]];
    const originalHeight = Number(proposals.getRange(`A${row}`).format.rowHeight) || 0;
    const height = Math.max(100, originalHeight, ...changedColumns.map(([column, width]) => wrappedLines(values[column], width) * 13 + 12));
    assert.ok(height <= 409, `Nexus proposal row ${row} needs a readable layout.`);
    proposals.getRange(`A${row}:W${row}`).format.rowHeight = height;
  }
  const changedModeCells = [];
  for (let row = 7; row <= 10; row++) {
    const commands = String(expectedModeValues[row - 1][5] || '');
    if (!commands.endsWith(fieldEquipmentCommands)) expectedModeValues[row - 1][5] = `${commands}\n${fieldEquipmentCommands}`;
    const sources = String(expectedModeValues[row - 1][8] || '').split('\n').filter(Boolean);
    expectedModeValues[row - 1][8] = [...new Set([...sources, ...fieldEquipmentSourceFiles])].join('\n');
    const changed = [['F', 5], ['I', 8]].filter(([, column]) =>
      expectedModeValues[row - 1][column] !== originalModeValues[row - 1][column]);
    for (const [column, index] of changed) {
      modes.getRange(`${column}${row}`).values = [[expectedModeValues[row - 1][index]]];
      changedModeCells.push(`${column}${row}`);
    }
    if (!changed.length) continue;
    const modeRow = modes.getRange(`A${row}:I${row}`);
    modeRow.format.autofitRows();
    const height = Math.max(30, Number(modeRow.format.rowHeight) + 8);
    assert.ok(height <= 409, `FPS mode row ${row} needs a readable layout.`);
    modeRow.format.rowHeight = height;
  }
  if (!changedModeCells.length) unchanged.push({ name: 'Modes FPS', values: originalModeValues, formulas: originalModeFormulas });
  summary.getRange('B12').formulas = [[`=COUNTA('Contrats jouables'!A7:A${rows.length + 6})`]];
  summary.getRange('B18').values = [[`${rows.length} récits jouables. Parmi les ${data.missions.length.toLocaleString('fr-FR')} propositions, ${linkedProposals.length} ont une adaptation jouable liée ; ${authoredProposalRows.length - linkedProposals.length} autres prolongements Nexus restent à développer. Le suivi manuel est conservé.`]];
  summary.getRange('D15:D18').values = Object.values(designLabels).map(value => [value]);
  summary.getRange('A24').values = [['Révision initiale du catalogue']];
  // Prove that the newly extended count still depends on the imported table.
  // Restore the disposable input before any preservation check or export.
  const lastContract = live.getRange(`A${rows.length + 6}`), lastId = lastContract.values;
  lastContract.values = [[null]];
  assert.equal(summary.getRange('B12').values[0][0], rows.length - 1);
  lastContract.values = lastId;
  const trackingInput = proposals.getRange('N7:Q7'), originalTracking = structuredClone(trackingInput.values);
  const gateProof = [];
  for (const [values, expected] of [
    [['Validé', 'Terminée', 'Intégrée', 'À faire'], 'Exécuter la recette'],
    [['Validé', 'Terminée', 'Intégrée', 'Validée'], 'Terminée'],
    [['', 'Terminée', 'Intégrée', 'Validée'], 'Valider le lore']
  ]) {
    trackingInput.values = [values];
    workbook.recalculate();
    assert.equal(proposals.getRange('R7').values[0][0], expected);
    gateProof.push({ inputs: values, result: expected });
  }
  trackingInput.values = originalTracking;
  workbook.recalculate();
  assert.equal(summary.getRange('B12').values[0][0], rows.length);
  assert.deepEqual(proposalRange.values, expectedProposals, 'Unexpected proposal/tracking change');
  assert.deepEqual(proposalRange.formulas, originalProposalFormulas, 'Existing proposal formulas changed');
  assert.deepEqual(modeRange.values, expectedModeValues, 'Unexpected FPS mode change outside commands and sources');
  assert.deepEqual(modeRange.formulas, originalModeFormulas, 'Existing FPS mode formulas changed');
  for (const before of unchanged) {
    const range = workbook.worksheets.getItem(before.name).getUsedRange();
    assert.deepEqual(range.values, before.values, `Unrelated values changed in ${before.name}`);
    assert.deepEqual(range.formulas, before.formulas, `Unrelated formulas changed in ${before.name}`);
  }
  const errors = await workbook.inspect({ kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!',
    options: { useRegex: true, maxResults: 100 }, summary: 'Formula error scan', maxChars: 5000 });
  const inspection = await workbook.inspect({ kind: 'table', range: 'Synthèse!A6:E13', include: 'values,formulas', tableMaxRows: 8, tableMaxCols: 5, maxChars: 8000 });
  await fs.mkdir(outputDir, { recursive: true });
  const dependencyProof = { input: `Contrats jouables!A${rows.length + 6}`, output: 'Synthèse!B12',
    withLastContract: rows.length, withLastContractBlank: rows.length - 1, restored: true };
  await fs.writeFile(path.join(outputDir, 'workbook-inspection.json'), JSON.stringify({ formulaScan: errors.ndjson, summary: inspection.ndjson,
    dependencyProof, gateProof, widths, rowHeights }, null, 2));
  const fullPreviews = [['Synthèse', 'A1:E24', 'synthese'], ['Modes FPS', 'B6:I10', 'modes-fps']];
  // Render every changed/new story and its access/source columns. Unchanged stories
  // already have reviewed previews in the prior workbook receipt.
  for (let index = 0; index < changedRuntimeRows.length; index += 2) {
    const start = changedRuntimeRows[index], end = changedRuntimeRows[Math.min(index + 1, changedRuntimeRows.length - 1)];
    fullPreviews.push(['Contrats jouables', `B${start}:F${end}`, `contrats-recits-${start - 6}-${end - 6}`],
      ['Contrats jouables', `G${start}:J${end}`, `contrats-acces-sources-${start - 6}-${end - 6}`]);
  }
  for (const row of updatedProposalRows) {
    fullPreviews.push(['Missions à créer', `U${row}:W${row}`, `prolongement-lien-${row}`]);
  }
  const previews = args.includes('--sources-only') ? fullPreviews.slice(-1) : fullPreviews;
  for (const [sheetName, range, name] of previews) {
    const image = await workbook.render({ sheetName, range, scale: 1, format: 'png' });
    await fs.writeFile(path.join(outputDir, `${name}.png`), new Uint8Array(await image.arrayBuffer()));
  }
  const outputPath = path.join(outputDir, outputName);
  await (await SpreadsheetFile.exportXlsx(workbook)).save(outputPath);
  const bytes = await fs.readFile(outputPath);
  const sourceFiles = [...new Set(runtimeMissions.flatMap(mission => [mission.contentFile,
    ...mission.systemSourceFiles, ...[...mission.sourceRefs, ...String(mission.source || '').split(';').map(ref => ref.trim())]
      .filter(ref => /^(?:src|DLC)\/.*\.js(?:#|$)/.test(ref)).map(ref => ref.split('#')[0])]))].sort();
  const runtimeSources = await Promise.all(sourceFiles.map(async source => ({ source,
    sha256: createHash('sha256').update(await fs.readFile(path.join(repo, source))).digest('hex') })));
  for (const source of [...fieldEquipmentSources, ...cityPresentationSources, ...fpsPresentationSources]) assert.equal(source.sha256,
    createHash('sha256').update(await fs.readFile(path.join(repo, source.source))).digest('hex'),
    `FPS or presentation source changed before export: ${source.source}`);
  const manifest = new Map(data.sourceManifest.map(source => [source.file, source]));
  for (const source of runtimeSources) assert.equal(source.sha256, manifest.get(source.source)?.sha256, `Planning source changed before export: ${source.source}`);
  const receipt = { schema: 7, sourceRevision: summary.getRange('B24').values[0][0],
    runtimeBaseRevision: option('--runtime-base', data.sourceRevision),
    sourceRevisionMeaning: 'Historical roster and workbook baselines are retained; runtimeSources, fieldEquipmentSources, cityPresentationSources, fpsPresentationSources and planning provenance describe the actual edited files.',
    planningDataSha256: data.dataSha256, planningSourceManifestSha256: createHash('sha256').update(JSON.stringify(data.sourceManifest)).digest('hex'),
    workbook: outputName,
    sha256: createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length,
    operation: `Imported existing workbook; refreshed ${rows.length} runtime contracts and ${updatedProposalRows.length} changed Nexus planning rows, preserved all tracking and unrelated tabs`,
    baselineSha256: createHash('sha256').update(await fs.readFile(inputPath)).digest('hex'), runtimeSources,
    characters: count, nonCombatCharacters: Number(summary.getRange('B8').values[0][0]), proposedMissions: data.missions.length,
    individuallyDesignedMissions: Number(summary.getRange('E15').values[0][0]),
    integratedCityContracts: rows.length, fpsProfiles: count, fpsModes: Number(summary.getRange('B13').values[0][0]),
    addedRuntimeContracts: rows.slice(oldCount).map(row => row[0]),
    changedRuntimeRows, preservedRuntimeContracts: oldCount - changedRuntimeRows.filter(row => row <= oldCount + 6).length,
    chapterTwoContracts: runtimeMissions.filter(mission => mission.chapter === 2).length,
    chapterThreeContracts: runtimeMissions.filter(mission => mission.chapter === 3).length,
    cargoTransfers: runtimeMissions.flatMap(mission => mission.steps.filter(step => step.cargo)
      .map(step => ({ missionId: mission.id, stepId: step.id, ...step.cargo }))),
    walkedRoutes: runtimeMissions.flatMap(mission => mission.steps.flatMap(step => [
      ...(step.walk && !step.byChoice && !step.byOriginChoice ? [{ missionId: mission.id, stepId: step.id, points: step.walk.points }] : []),
      ...['byOriginChoice', 'byChoice'].flatMap(field => Object.entries(step[field] || {}).filter(([, branch]) => branch.walk)
        .map(([choiceId, branch]) => ({ missionId: mission.id, stepId: step.id, branch: field, choiceId, points: branch.walk.points })))
    ])),
    residentClosures: runtimeMissions.filter(mission => mission.steps.at(-1)?.type === 'npc').map(mission => mission.id),
    inheritedRoutes: runtimeMissions.flatMap(mission => mission.steps).reduce((total, step) => total + Object.keys(step.byOriginChoice || {}).length, 0),
    decisionRoutes: runtimeMissions.flatMap(mission => mission.steps).reduce((total, step) => total + Object.keys(step.byChoice || {}).length, 0),
    rewrittenNexusProposals: updatedProposalRows.length,
    authoredNexusProposals: authoredProposalRows.length,
    runtimeLinkedProposals: linkedProposals.map(mission => ({ id: mission.id, runtimeMissionId: mission.runtimeMissionId,
      implementationStatus: mission.implementationStatus, scope: mission.runtimeScope })),
    fieldEquipmentSources, cityPresentationSources, fpsPresentationSources, changedModeCells,
    proposalsRequiringDiegeticRewrite: data.missions.filter(mission => mission.diegeticReviewStatus === 'diegetic_rewrite_required').length,
    preservedTrackingColumns: ['M', 'N', 'O', 'P', 'Q', 'S', 'T', 'U'],
    dependencyProof, gateProof,
    sheets: ['Synthèse', 'Missions à créer', 'Contrats jouables', 'Personnages', 'Profils FPS', 'Modes FPS'],
    previews: previews.map(([, , name]) => `${name}.png`), preservedSheets: unchanged.map(item => item.name),
    formulaScan: errors.ndjson, nativeApplicationCheck: 'Not executed; Artifact Tool recalculation, XLSX readback and rendered review are separate checks.' };
  await fs.writeFile(path.join(outputDir, 'workbook-receipt.json'), JSON.stringify(receipt, null, 2));
  console.log(JSON.stringify({ outputPath, ...receipt }));
}
