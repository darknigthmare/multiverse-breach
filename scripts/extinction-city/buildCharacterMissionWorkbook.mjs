/** Production-planning workbook. Run a copy from an OS-temporary directory
 * whose node_modules points to CODEX_PRIMARY_RUNTIME_NODE_MODULES, using
 * CODEX_PRIMARY_RUNTIME_NODE. No repository dependency is installed or changed. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { Workbook, SpreadsheetFile } from '@oai/artifact-tool';

const args = process.argv.slice(2);
const option = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const repo = path.resolve(option('--repo', process.cwd()));
const planningPath = path.resolve(option('--planning', '/tmp/mission-planning-2026-11-08.json'));
const fpsPath = path.resolve(option('--fps', '/tmp/multiverse-fps-roster-2026-11-08.json'));
const outputDir = path.resolve(option('--out', path.join(repo, 'outputs/character-missions-20261108')));
const outputName = 'Multiverse_Breach_Missions_Cite_Par_Personnage_2026-11-08.xlsx';
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
const designLabels = { individual_proposal: 'Proposition individualisée', research_scaffold: 'Canevas à documenter',
  source_objective_adaptation: 'Adaptation d’objectif source', source_family_adaptation: 'Adaptation de famille' };
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
  'Deux propositions par personnage. Cellules jaunes : suivi à renseigner. Les sept contrats jouables sont suivis séparément.',
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

const liveRows = MOSAIC_CHARACTER_MISSIONS.map(mission => [mission.id, byCharacter.get(mission.heroId)?.name || mission.heroId,
  mission.title.fr, mission.premise.fr, mission.steps.map((step, index) => `${index + 1}. ${step.text.fr}`).join('\n'),
  mission.steps.find(step => step.type === 'decision').choices.filter(item => item.valid).map(item => `${item.label.fr}\n${item.result.fr}`).join('\n\n'),
  'Personnage possédé, quartier du Nexus et vitrines requises disponibles.',
  'Intégré ; 19 tests de source et déplacements exécutés. Recette navigateur suivie dans la PR.',
  'Dossier et choix sauvegardés ; pas de monnaie ni d’équipement attribué.', mission.source]);
table(sheets['Contrats jouables'], 'ContratsJouables', 'Sept contrats originaux jouables',
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
  str(mode.label), str(mode.rule), mode.mode === 'hunt' ? 'Viser, puis T / MARQUER.' : 'E / INTERAGIR, maintien dans le périmètre, puis E.',
  modeDescriptions[mode.mode][2], mode.status === 'EXISTING_RUNTIME' ? 'Variante existante conservée' : 'Variante intégrée ; recette suivie dans la PR', mode.sourcePath]);
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
  ['Contrats jouables', 'Les sept contrats intégrés ont leurs propres IDs et parcours. Ils ne terminent pas les 3 824 propositions.'],
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
assert.deepEqual(summary.getRange('B7:B13').values.flat(), [1912, 101, 1912, 1912, 0, 7, 4]);
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
