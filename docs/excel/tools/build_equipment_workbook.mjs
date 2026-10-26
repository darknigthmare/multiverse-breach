import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { Workbook, SpreadsheetFile } from '@oai/artifact-tool';

const [dataPath, canonicalPath, comparisonPath, outputPath, previewDir] = process.argv.slice(2);
if (!previewDir) throw new Error('Usage: build_equipment_workbook.mjs DATA.json CANON.json COMPARISON.json OUTPUT.xlsx PREVIEW_DIR');
const data = JSON.parse(await fs.readFile(dataPath, 'utf8'));
const canon = JSON.parse(await fs.readFile(canonicalPath, 'utf8'));
const comparison = JSON.parse(await fs.readFile(comparisonPath, 'utf8'));
const sourceCommit = data.metadata.sourceCommit;
assert.match(sourceCommit, /^[a-f0-9]{40}$/);
for (const field of ['actors', 'items', 'associations', 'gaps']) assert(Array.isArray(data[field]), field);
assert(Array.isArray(canon.rows));
assert(Array.isArray(canon.sources));
const text = value => value == null ? '' : typeof value === 'string' ? value
  : Array.isArray(value) ? value.map(text).filter(Boolean).join('\n')
    : typeof value === 'object' ? Object.entries(value).map(([k, v]) => k + ': ' + text(v)).join('\n') : String(value);
const literal = value => {
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  const str = text(value);
  assert(str.length <= 32760, 'Excel cell limit exceeded');
  return /^[\s\uFEFF]*[=+@-]/u.test(str) ? "'" + str : str;
};
const unique = (rows, key) => {
  assert(rows.every(row => typeof row[key] === 'string' && row[key]), 'Missing key ' + key);
  assert.equal(new Set(rows.map(row => row[key])).size, rows.length, 'Duplicate key ' + key);
};
unique(data.actors, 'actorKey');
unique(data.items, 'itemKey');
unique(data.associations, 'associationKey');
unique(data.gaps, 'gapKey');
const actorKeys = new Set(data.actors.map(row => row.actorKey));
const itemKeys = new Set(data.items.map(row => row.itemKey));
const sourceById = new Map(canon.sources.map(row => [row.sourceId, row]));
for (const row of data.associations) {
  assert(actorKeys.has(row.actorKey), 'Unknown actor in association');
  if (row.itemKey) assert(itemKeys.has(row.itemKey), 'Unknown item in association');
}
for (const row of canon.rows) {
  assert(actorKeys.has(row.actorKey), 'Unknown actor in canonical references: ' + row.actorName);
  assert(sourceById.has(row.sourceId), 'Unknown canonical source: ' + row.sourceId);
  assert.notEqual(row.canonicalFidelityApproved, true);
}

const labels = {
  hero: 'Héros', enemy: 'Adversaire', boss: 'Boss', worldBoss: 'Boss de monde',
  actor: 'Personnage', item: 'Objet', canonical: 'Référence ciblée',
  ORIGINAL: 'Création originale', EXTERNAL: 'Œuvre externe',
  ALIAS_ARME_NON_MODELE: 'Correspondance du modèle à vérifier',
  DOTATION_ET_RENDU_A_VERIFIER: 'Dotation et rendu à vérifier',
  EXCLUSION_DOTATION_A_CONSERVER: 'Exclusion de dotation à conserver',
  ICONE_RESOLUE_ABSENTE: 'Icône absente de Git',
  INCARNATION_NON_FIXEE: 'Incarnation à fixer',
  INVENTAIRE_INDIVIDUEL_ABSENT: 'Liste individuelle absente',
  NATURE_PHYSIQUE_A_VERIFIER: 'Nature physique à vérifier',
  PORTEUR_TEXTE_NON_LIE: 'Porteur textuel sans lien explicite',
  REVUE_VISUELLE_1A1_OUVERTE: 'Revue visuelle 1:1 à réaliser',
  SOURCE_INDIVIDUELLE_ABSENTE: 'Source individuelle absente',
  SOURCE_OBJET_ABSENTE: 'Source d’objet absente',
  KIT_DECLARE: 'Entrée de la liste equipment',
  CHAMP_ARME_DECLARE: 'Champ d’arme descriptif',
  OBJET_DE_SCENE_DECLARE: 'Accessoire de scène',
  TECHNIQUE_SIGNEE_NON_EQUIPEMENT: 'Technique ou signature',
  ARME_OU_OUTIL_NOMME: 'Arme ou outil nommé',
  OBJET_OU_CONSOMMABLE_NOMME: 'Objet ou consommable nommé',
  PROTECTION_OU_EQUIPEMENT: 'Protection ou équipement',
  TENUE_OU_ACCESSOIRE: 'Tenue ou accessoire',
  POUVOIR_OU_INFORMATION: 'Pouvoir ou information',
  NATURE_A_DETERMINER: 'Nature à déterminer',
  EVENEMENT_OU_ATTAQUE: 'Événement ou attaque',
  INVOCATION_OU_RENFORT: 'Invocation ou renfort',
  ABSTRACTION_OU_RELIQUE_A_REVOIR: 'Relique ou abstraction à revoir',
  DESIGN_ORIGINAL_A_PRECISER: 'Création originale à préciser',
  PRESENT_DANS_GIT: 'Présent dans Git', ABSENT_DANS_GIT: 'Absent de Git',
  TECHNIQUE_DE_COMBAT: 'Technique de combat',
  ORIGINAL_DESIGN: 'Création originale',
  EXTERNAL_OR_UNRESOLVED: 'Œuvre externe ou origine à résoudre',
  ORIGINAL_DESIGN_OR_ADAPTATION: 'Création originale ou adaptation',
  LISTE_DECLAREE_NON_CERTIFIEE: 'Liste déclarée, revue ouverte',
  INVENTAIRE_INDIVIDUEL_A_COMPLETER: 'Liste individuelle à compléter',
  AUCUNE_CERTIFICATION_1A1: 'Fidélité 1:1 non certifiée',
  DECLARATION_DU_CODE_A_VERIFIER: 'Déclaration du code à vérifier',
  OUVERT: 'Ouvert',
  'edition-exclusive': 'Propre à cette édition',
  'incarnation-variant': 'Variante d’incarnation',
  'licensed-representation': 'Représentation sous licence',
  'obtainable-in-source': 'Accessible dans l’œuvre',
  'personal-model': 'Modèle personnel', scene: 'Accessoire de scène', signature: 'Objet emblématique'
};
const label = value => labels[value] || text(value);
const union = (...arrays) => [...new Set(arrays.flat().filter(Boolean))];
const columns = n => { let s = ''; for (let i = n + 1; i; i = Math.floor((i - 1) / 26)) s = String.fromCharCode(65 + (i - 1) % 26) + s; return s; };
const colors = { ink: '#172B3D', navy: '#203E59', pale: '#EEF3F7', muted: '#5D7182', input: '#FFF6DA', red: '#FCE4E0' };
const wb = Workbook.create();
const sheetNames = ['Synthèse', 'Évolutions', 'Personnages', 'Armes et objets', 'Affectations', 'Références 1a1', 'Actions'];
const sheets = Object.fromEntries(sheetNames.map(name => [name, wb.worksheets.add(name)]));
const last = {};
const previewJobs = [];
function makeTable(name, title, subtitle, headers, rows, widths, tableName, freezeColumns = 3) {
  const sheet = sheets[name], right = columns(headers.length - 1), end = rows.length + 6;
  assert(rows.length > 0);
  assert(rows.every(row => row.length === headers.length));
  last[name] = end;
  sheet.showGridLines = false;
  sheet.getRange('A1:' + right + end).format.font = { name: 'Arial', size: 10, color: colors.ink };
  sheet.getRange('A1:' + right + end).format.verticalAlignment = 'center';
  widths.forEach((width, i) => { sheet.getRange(columns(i) + '1:' + columns(i) + end).format.columnWidth = width; });
  sheet.getRange('A2').values = [[title]];
  sheet.getRange('A2').format.font = { name: 'Arial', size: 15, bold: true, color: colors.navy };
  sheet.getRange('A2:' + right + '2').format.rowHeight = 27;
  sheet.getRange('A3').values = [[subtitle]];
  sheet.getRange('A3').format.font = { name: 'Arial', size: 10, italic: true, color: colors.muted };
  sheet.getRange('A4:' + right + '4').format.borders = { bottom: { style: 'thin', color: '#C5D3DF' } };
  sheet.getRange('A6:' + right + '6').values = [headers];
  for (let at = 0; at < rows.length; at += 600) {
    const part = rows.slice(at, at + 600).map(row => row.map(literal));
    sheet.getRange('A' + (at + 7) + ':' + right + (at + part.length + 6)).values = part;
  }
  const table = sheet.tables.add('A6:' + right + end, true, tableName);
  table.style = 'TableStyleMedium2';
  table.showFilterButton = true;
  sheet.getRange('A6:' + right + '6').format = {
    fill: colors.navy, font: { name: 'Arial', size: 10, bold: true, color: '#FFFFFF' },
    wrapText: true, horizontalAlignment: 'center', verticalAlignment: 'center', rowHeight: 35,
    borders: { insideVertical: { style: 'thin', color: '#FFFFFF' } }
  };
  sheet.getRange('A7:' + right + end).format.wrapText = true;
  sheet.getRange('A7:' + right + end).format.verticalAlignment = 'top';
  sheet.getRange('A7:' + right + end).format.rowHeight = 39;
  // Fit wrapped evidence and identifiers without reducing text size.
  let from = 0, height = 0;
  const heights = rows.map(row => Math.min(409, Math.max(39, Math.ceil(Math.max(...row.map((value, i) =>
    text(value).split('\n').reduce((sum, line) => sum + Math.max(1, Math.ceil(line.length / Math.max(8, widths[i] * 0.91))), 0))) * 12.5 + 9))));
  for (let i = 0; i <= heights.length; i++) {
    if (i && (i === heights.length || heights[i] !== height)) {
      if (height !== 39) sheet.getRange('A' + (from + 7) + ':' + right + (i + 6)).format.rowHeight = height;
      from = i;
    }
    height = heights[i];
  }
  sheet.freezePanes.freezeRows(6);
  if (freezeColumns) sheet.freezePanes.freezeColumns(freezeColumns);
  previewJobs.push({ sheetName: name, range: 'A1:' + columns(Math.min(headers.length, 6) - 1) + Math.min(10, end) });
  console.log('Prepared ' + name + ': ' + rows.length + ' rows');
  return sheet;
}

const actorRows = data.actors.map(a => [
  a.actorName, a.universe, label(a.kind), a.incarnation || 'À préciser',
  a.weaponField, a.declaredEquipment, a.sourceProps, a.signatureName,
  a.weaponTypeAlias, a.visualAnchor, a.referenceUrls, label(a.equipmentStatus),
  a.associationCount, a.gapCount, label(a.sourceScope), a.sourcePath, a.sourceUrl, a.actorId, a.actorKey,
  a.nonCombat ? 'Non-combattant déclaré' : 'Pas d’exclusion déclarée'
]);
makeTable('Personnages', 'Équipements déclarés par personnage',
  'Tous les acteurs actifs. Les familles techniques, pouvoirs et objets de scène gardent leur nature.',
  ['Personnage', 'Univers', 'Type', 'Incarnation', 'Arme décrite', 'Liste equipment', 'Accessoire de scène', 'Signature résolue', 'Famille technique', 'Contraintes visuelles', 'Références', 'État de la liste', 'Associations', 'Points à compléter', 'Origine', 'Fichier source', 'Source GitHub', 'ID du jeu', 'Clé personnage', 'Exclusion du combat'],
  actorRows, [31, 28, 18, 48, 43, 58, 42, 35, 25, 80, 65, 36, 14, 17, 28, 48, 75, 32, 58, 31], 'EquipmentActors');

const itemRows = data.items.map(a => [
  a.itemName, a.universe, label(a.nature), a.catalog, a.itemId, a.slot || a.role,
  a.sourceOwner, a.incarnation || 'À préciser', a.canonicalName, a.description,
  a.visualAnchor, a.referenceUrls, a.iconPath, label(a.iconStatus), a.natureBasis,
  a.sourceItemId, union(a.linkedItemKeys || [], a.catalogPeerKeys || []), a.boost,
  a.gameplayPolicy, a.defaultKitPolicy, label(a.fidelityStatus), a.sourcePath, a.sourceUrl, a.itemKey
]);
makeTable('Armes et objets', 'Armes, équipements et objets du dépôt',
  'Chaque ligne représente une occurrence de catalogue. Les projections et invocations ne sont pas des armes distinctes.',
  ['Nom dans le jeu', 'Univers', 'Nature', 'Registre', 'ID objet', 'Emplacement / rôle', 'Porteur déclaré', 'Incarnation', 'Nom de référence', 'Description', 'Contraintes visuelles', 'Références', 'Icône résolue', 'État du fichier', 'Raison du classement', 'ID source', 'Autres entrées liées', 'Bonus', 'Règle de gameplay', 'Règle de dotation', 'État fidélité', 'Fichier source', 'Source GitHub', 'Clé catalogue'],
  itemRows, [37, 28, 29, 19, 35, 24, 30, 48, 38, 90, 90, 65, 70, 23, 65, 34, 75, 28, 65, 65, 45, 48, 75, 65], 'EquipmentItems');

makeTable('Affectations', 'Affectations explicites relevées dans le code',
  'La compatibilité dans le crossover et la possession dans l’œuvre source sont deux informations différentes.',
  ['Personnage', 'Univers', 'Arme, objet ou déclaration', 'Nature', 'Relation', 'Champ de preuve', 'Preuve du code', 'Références', 'État fidélité', 'Fichier source', 'Source GitHub', 'Clé personnage', 'Clé catalogue liée', 'ID association'],
  data.associations.map(a => [a.actorName, a.universe, a.label, label(a.nature), label(a.relationship), a.evidenceField, a.evidence, a.referenceUrls, label(a.fidelityStatus), a.sourcePath, a.sourceUrl, a.actorKey, a.itemKey, a.associationKey]),
  [31, 28, 46, 30, 34, 37, 90, 65, 45, 48, 75, 58, 65, 85], 'EquipmentAssociations');

makeTable('Références 1a1', 'Références d’armes et équipements par incarnation',
  'Recherche ciblée recontrôlée le 26 octobre. Les attributions conditionnelles restent à confirmer avant intégration.',
  ['Personnage', 'Univers', 'Arme ou équipement', 'Catégorie', 'Œuvre et édition', 'Incarnation dans le jeu', 'Relation dans la source', 'Détails confirmés', 'Traits visuels', 'Compatibilité / exclusions', 'Application au jeu', 'À compléter', 'État fidélité', 'Source', 'Type de source', 'URL', 'Accès et vérification', 'Limites de la source', 'ID référence', 'Clé personnage'],
  canon.rows.map(a => { const s = sourceById.get(a.sourceId); return [a.actorName, a.universe, a.canonicalItemName, a.category, a.sourceEdition, a.incarnation || 'À sélectionner', label(a.relationship), a.sourceEvidence, a.visualTraits, a.continuityConstraint, a.applicationStatus, a.implementationGap, a.fidelityStatus, s.title, a.sourceType || s.type, a.sourceUrl || s.url, s.retrieval, s.limitations, a.id, a.actorKey]; }),
  [31, 28, 43, 25, 63, 60, 65, 90, 85, 90, 52, 90, 50, 63, 35, 78, 66, 90, 22, 58], 'EquipmentCanonical');

const actionRecords = [
  ...data.gaps.map(a => ({ id: a.gapKey, name: a.actorName || a.itemName, universe: a.universe, type: label(a.entityType), issue: label(a.kind), priority: a.priority, action: a.action, evidence: a.evidence, observed: label(a.status), key: a.entityKey, source: a.sourceUrl })),
  ...canon.rows.map(a => ({ id: 'canonical:' + a.id, name: a.actorName + ' — ' + a.canonicalItemName, universe: a.universe, type: 'Référence ciblée', issue: 'Référence à confronter à la dotation', priority: 'P1', action: a.implementationGap, evidence: a.sourceEvidence, observed: a.applicationStatus, key: a.actorKey, source: a.sourceUrl }))
];
unique(actionRecords, 'id');
const actions = makeTable('Actions', 'Manquants et suivi de réalisation',
  'Le constat reste conservé. Compléter les colonnes jaunes ; une tâche terminée sans preuve reste à vérifier.',
  ['Priorité', 'Personnage ou objet', 'Univers', 'Type de dossier', 'Manque / vérification', 'Travail à réaliser', 'Constat et preuve source', 'État au relevé', 'Clé concernée', 'Source', 'Avancement', 'Preuve de réalisation', 'Responsable', 'Résultat du suivi', 'ID tâche'],
  actionRecords.map(a => [a.priority, a.name, a.universe, a.type, a.issue, a.action, a.evidence, a.observed, a.key, a.source, 'À faire', '', '', '', a.id]),
  [13, 40, 28, 23, 42, 95, 90, 43, 65, 80, 23, 80, 26, 28, 85], 'EquipmentActions');
actions.getRange('K7:M' + last.Actions).format.fill = colors.input;
actions.getRange('K7:K' + last.Actions).dataValidation = { rule: { type: 'list', values: ['À faire', 'En cours', 'À vérifier', 'Terminé'] } };
actions.getRange('N7').formulas = [['=IF(K7="Terminé",IF(L7="","Preuve manquante","Terminée avec preuve"),K7)']];
actions.getRange('N7:N' + last.Actions).fillDown();
actions.getRange('N7:N' + last.Actions).conditionalFormats.add('containsText', { text: 'Preuve manquante', format: { fill: colors.red, font: { color: '#8C2820', bold: true } } });
actions.getRange('A7:A' + last.Actions).conditionalFormats.add('containsText', { text: 'P1', format: { fill: colors.input, font: { color: '#775118', bold: true } } });

const changes = makeTable('Évolutions', 'Évolution depuis le relevé du 24 octobre',
  comparison.methodLabel,
  ['Indicateur', '24 octobre', '26 octobre', 'Écart', 'Interprétation', 'Source initiale', 'Source actuelle'],
  comparison.metrics.map(a => [a.label, a.before, a.after, '', a.interpretation, comparison.previousUrl, comparison.currentUrl]),
  [43, 16, 16, 13, 86, 78, 78], 'EquipmentChanges', 1);
changes.getRange('D7').formulas = [['=C7-B7']];
changes.getRange('D7:D' + last['Évolutions']).fillDown();
changes.getRange('B7:D' + last['Évolutions']).setNumberFormat('#,##0');
const statusStart = last['Évolutions'] + 4;
changes.getRange('A' + statusStart + ':G' + (statusStart + comparison.githubStatus.length)).format.font = { name: 'Arial', size: 10, color: colors.ink };
changes.getRange('A' + statusStart + ':G' + (statusStart + comparison.githubStatus.length)).format.verticalAlignment = 'top';
changes.getRange('A' + statusStart + ':E' + statusStart).values = [['Travaux GitHub', 'État', 'Date du contrôle', '', 'Conséquence pour cet inventaire']];
changes.getRange('A' + statusStart + ':E' + statusStart).format = { fill: colors.navy, font: { name: 'Arial', size: 10, bold: true, color: '#FFFFFF' }, wrapText: true, rowHeight: 32 };
comparison.githubStatus.forEach((a, i) => {
  const r = statusStart + 1 + i;
  changes.getRange('A' + r + ':E' + r).values = [[a.subject, a.state, new Date('2026-10-26T00:00:00Z'), '', a.consequence]];
  changes.getRange('A' + r + ':E' + r).format.wrapText = true;
  changes.getRange('A' + r + ':E' + r).format.rowHeight = 56;
  changes.getRange('C' + r).setNumberFormat('dd/mm/yyyy');
  changes.getRange('F' + r).values = [[a.url]];
  changes.getRange('F' + r).format.wrapText = true;
});

const summary = sheets['Synthèse'];
summary.showGridLines = false;
summary.tabColor = colors.navy;
summary.getRange('A1:D54').format.font = { name: 'Arial', size: 10, color: colors.ink };
summary.getRange('A1:D54').format.verticalAlignment = 'center';
summary.getRange('A1:A54').format.columnWidth = 47;
summary.getRange('B1:B54').format.columnWidth = 15;
summary.getRange('C1:C54').format.columnWidth = 4;
summary.getRange('D1:D54').format.columnWidth = 102;
summary.getRange('A2').values = [['Multiverse Breach — armes et équipements']];
summary.getRange('A2').format.font = { name: 'Arial', size: 16, bold: true, color: colors.navy };
summary.getRange('A2:D2').format.rowHeight = 29;
summary.getRange('A3').values = [['Dernière version master contrôlée le 26 octobre 2026']];
summary.getRange('A3').format.font = { name: 'Arial', size: 10, italic: true, color: colors.muted };
summary.getRange('A4:D4').format.borders = { bottom: { style: 'thin', color: '#C5D3DF' } };
summary.getRange('A6:B6').values = [['Indicateur', 'Total']];
summary.getRange('A6:B6').format = { fill: colors.navy, font: { name: 'Arial', size: 10, bold: true, color: '#FFFFFF' }, horizontalAlignment: 'center', rowHeight: 29 };
summary.getRange('D6').values = [['Périmètre']];
summary.getRange('D6').format.font.bold = true;
const summaryMetrics = [
  ['Personnages et adversaires', "=COUNTA('Personnages'!A7:A" + last.Personnages + ')', 'Tous les acteurs actifs, Ancre du joueur comprise.'],
  ['Héros, Ancre comprise', "=COUNTIFS('Personnages'!C7:C" + last.Personnages + ',"Héros")', 'Les adversaires, boss et boss de monde ont aussi leurs fiches.'],
  ['Listes individuelles equipment renseignées', data.actors.filter(a => a.declaredEquipment?.length).length, 'Une liste peut contenir objets, vêtements, pouvoirs ou anatomie.'],
  ['Occurrences de catalogue', "=COUNTA('Armes et objets'!A7:A" + last['Armes et objets'] + ')', 'Équipements, événements, combat, boutique et récompenses.'],
  ['Affectations explicites', "=COUNTA('Affectations'!A7:A" + last.Affectations + ')', 'Déclarations d’armes, listes, accessoires et signatures conservés séparément.'],
  ['Références documentaires ciblées', "=COUNTA('Références 1a1'!A7:A" + last['Références 1a1'] + ')', 'Chaque référence précise le personnage, l’œuvre et les conditions d’application.'],
  ['Sources de la recherche ciblée', canon.sources.length, 'Le type de source et les limites sont indiqués dans chaque fiche.'],
  ['Actions ouvertes', "=COUNTA('Actions'!O7:O" + last.Actions + ")-COUNTIFS('Actions'!N7:N" + last.Actions + ',"Terminée avec preuve")', 'Travaux d’inventaire, de recherche et de revue, pas autant de bugs démontrés.'],
  ['Actions terminées avec preuve', "=COUNTIFS('Actions'!N7:N" + last.Actions + ',"Terminée avec preuve")', 'La preuve doit être pertinente ; sa présence ne certifie pas la qualité du résultat.'],
  ['Nouvelles validations visuelles 1:1', 0, 'Aucune validation de sprite, animation ou comportement n’est déclarée par cet audit.']
];
summaryMetrics.forEach((a, i) => {
  const r = i + 7;
  summary.getRange('A' + r).values = [[a[0]]];
  if (typeof a[1] === 'string' && a[1].startsWith('=')) summary.getRange('B' + r).formulas = [[a[1]]];
  else summary.getRange('B' + r).values = [[a[1]]];
  summary.getRange('D' + r).values = [[a[2]]];
});
summary.getRange('A7:A16').format.wrapText = true;
summary.getRange('A7:D16').format.rowHeight = 38;
summary.getRange('B7:B16').setNumberFormat('#,##0');
summary.getRange('B7:B16').format.font = { name: 'Arial', size: 12, bold: true, color: colors.navy };
summary.getRange('B7:B16').format.horizontalAlignment = 'right';
summary.getRange('A19:B19').values = [['À compléter en priorité', 'Lignes']];
summary.getRange('A19:B19').format = { fill: colors.navy, font: { name: 'Arial', size: 10, bold: true, color: '#FFFFFF' }, horizontalAlignment: 'center', rowHeight: 29 };
summary.getRange('D19').values = [['Critère de réalisation']];
summary.getRange('D19').format.font.bold = true;
const focus = [
  ['INVENTAIRE_INDIVIDUEL_ABSENT', 'Renseigner la dotation, ou justifier explicitement l’absence d’équipement.'],
  ['INCARNATION_NON_FIXEE', 'Fixer l’œuvre, l’édition et la période avant de choisir les objets.'],
  ['ALIAS_ARME_NON_MODELE', 'Relier la famille technique au modèle exact ; elle ne prouve pas un bug de combat.'],
  ['SOURCE_OBJET_ABSENTE', 'Ajouter une source précise de l’objet et de son usage.'],
  ['ICONE_RESOLUE_ABSENTE', 'Produire ou relier le fichier, puis contrôler son affichage et son identité.'],
  ['REVUE_VISUELLE_1A1_OUVERTE', 'Comparer proportions, couleurs, détails, port et animations à l’œuvre source.']
];
focus.forEach(([kind, criterion], i) => {
  const r = i + 20;
  summary.getRange('A' + r).values = [[label(kind)]];
  summary.getRange('B' + r).formulas = [["=COUNTIFS('Actions'!E7:E" + last.Actions + ',A' + r + ')']];
  summary.getRange('D' + r).values = [[criterion]];
});
summary.getRange('A20:D25').format.rowHeight = 33;
summary.getRange('B20:B25').setNumberFormat('#,##0');
summary.getRange('A28').values = [['Version source']];
summary.getRange('D28').values = [[sourceCommit]];
summary.getRange('A29').values = [['Dépôt']];
summary.getRange('D29').values = [['https://github.com/darknigthmare/multiverse-breach/tree/' + sourceCommit]];
summary.getRange('A31').values = [['Lecture des comptes']];
summary.getRange('D31').values = [['Les occurrences et leurs projections ne sont pas des objets physiques uniques. Les tâches peuvent se recouper.']];
summary.getRange('A32').values = [['Compatibilité des incarnations']];
summary.getRange('D32').values = [['Conserver les variantes séparées : Ripley 1979/1986, Luke ANH–ESB/ROTJ, armures de Chief et éditions des jeux.']];
summary.getRange('A33').values = [['Mettre le suivi à jour']];
summary.getRange('D33').values = [['Filtrer Actions par personnage ou univers ; remplir Avancement, Preuve de réalisation et Responsable.']];
summary.getRange('A34').values = [['Portée de la recherche']];
summary.getRange('D34').values = [['Le relevé du dépôt est exhaustif ; le recensement de tous les équipements des œuvres sources reste à poursuivre.']];
summary.getRange('A28:D34').format.rowHeight = 34;
summary.getRange('D28:D34').format.wrapText = true;

console.log('Checking workflow and summary');
actions.getRange('K7').values = [['Terminé']];
assert.equal(actions.getRange('N7').values[0][0], 'Preuve manquante');
actions.getRange('L7').values = [['https://example.invalid/temporary-test']];
assert.equal(actions.getRange('N7').values[0][0], 'Terminée avec preuve');
assert.equal(summary.getRange('B15').values[0][0], 1);
actions.getRange('K7:L7').values = [['À faire', '']];
wb.recalculate();
assert.equal(summary.getRange('B15').values[0][0], 0);
for (const [cell, count] of [['B7', data.actors.length], ['B10', data.items.length], ['B11', data.associations.length], ['B12', canon.rows.length], ['B14', actionRecords.length]]) assert.equal(summary.getRange(cell).values[0][0], count, cell);
for (let i = 0; i < focus.length; i++) assert.equal(summary.getRange('B' + (20 + i)).values[0][0], data.gaps.filter(a => a.kind === focus[i][0]).length);
await fs.mkdir(previewDir, { recursive: true });
const inspection = await wb.inspect({ kind: 'table', range: "'Synthèse'!A6:D16", include: 'values,formulas', tableMaxRows: 12, tableMaxCols: 4, maxChars: 7000 });
await fs.writeFile(path.join(previewDir, 'summary-inspection.ndjson'), inspection.ndjson);
const errors = await wb.inspect({ kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!', options: { useRegex: true, maxResults: 50 }, summary: 'Final formula error scan', maxChars: 4000 });
await fs.writeFile(path.join(previewDir, 'formula-scan.ndjson'), errors.ndjson);
console.log('Formula scan: ' + errors.ndjson);
for (const job of [{ sheetName: 'Synthèse', range: 'A1:D16' }, ...previewJobs]) {
  const preview = await wb.render({ ...job, scale: 1, format: 'png' });
  const file = job.sheetName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll(' ', '_') + '.png';
  await fs.writeFile(path.join(previewDir, file), new Uint8Array(await preview.arrayBuffer()));
  console.log('Rendered ' + job.sheetName);
}
await fs.mkdir(path.dirname(outputPath), { recursive: true });
const output = await SpreadsheetFile.exportXlsx(wb);
await output.save(outputPath);
const validation = {
  sourceCommit, worksheets: sheetNames, actors: data.actors.length, catalogRecords: data.items.length,
  associations: data.associations.length, canonicalRows: canon.rows.length, sources: canon.sources.length,
  actions: actionRecords.length, comparisonRows: comparison.metrics.length,
  summaryCountsChecked: true, workflowWithAndWithoutProofChecked: true,
  testedEngine: '@oai/artifact-tool', excelDesktopTested: false, canonicalFidelityApproved: false,
  bytes: (await fs.stat(outputPath)).size
};
await fs.writeFile(path.join(previewDir, 'workbook-validation.json'), JSON.stringify(validation, null, 2) + '\n');
console.log(JSON.stringify(validation, null, 2));
