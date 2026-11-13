#!/usr/bin/env python3
"""Independent, read-only XLSX coverage and native-feature inspection."""
import argparse
from collections import Counter
from functools import lru_cache
import hashlib
import json
from pathlib import Path
import re
import xml.etree.ElementTree as ET
from zipfile import ZipFile

NS = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
DESIGN_LABELS = {'individual_proposal': 'Proposition individualisée',
                 'research_scaffold': 'Canevas à documenter — réécriture diégétique requise',
                 'source_objective_adaptation': 'Adaptation d’objectif source — réécriture diégétique requise',
                 'source_family_adaptation': 'Adaptation de famille — réécriture diégétique requise'}
CITY_PRESENTATION_SOURCES = {'src/components/HubScreen.jsx', 'src/game/mosaicMissionOperations.js',
                             'src/game/mosaicMissionCargo.js', 'src/game/renderer.js', 'src/game/spriteAssets.js',
                             'src/game/immersiveHubState.js', 'src/components/useSceneViewport.js'}
FPS_PRESENTATION_SOURCES = {'src/components/HubScreen.jsx', 'src/game/extinctionAimReadout.js',
                            'src/game/extinctionSignatures.js', 'src/game/extinctionFieldDirectives.js',
                            'src/components/ExtinctionPrimaryAction.jsx', 'src/components/ExtinctionAimReadout.css'}
CITY_ROUTE_PRESENTATION_SOURCES = {'src/game/mosaicMissionWalks.js', 'src/components/MosaicPocketTerminal.jsx',
                                    'src/components/MosaicPocketTerminal.css', 'src/components/MosaicCharacterMissions.jsx',
                                    'src/components/ImmersiveDrawer.jsx'}


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def verify_provenance(workbook, data, receipt_path, repo):
    """Verify the external source receipt; never rewrite the XLSX or source files."""
    raw = receipt_path.read_bytes()
    receipt = json.loads(raw)
    require(receipt.get('schema', 0) >= 6, 'Presentation provenance requires workbook receipt schema 6 or later')
    require(receipt.get('workbook') == workbook.name, 'Provenance receipt names another workbook')
    require(receipt.get('sha256') == hashlib.sha256(workbook.read_bytes()).hexdigest()
            and receipt.get('bytes') == workbook.stat().st_size, 'Workbook bytes differ from their provenance receipt')
    require(receipt.get('planningDataSha256') == data.get('dataSha256'), 'Planning data differ from the workbook provenance')
    manifest_bytes = json.dumps(data['sourceManifest'], ensure_ascii=False, separators=(',', ':')).encode('utf-8')
    require(receipt.get('planningSourceManifestSha256') == hashlib.sha256(manifest_bytes).hexdigest(),
            'Planning source manifest differs from the workbook provenance')
    groups = {}
    group_names = ['runtimeSources', 'fieldEquipmentSources', 'cityPresentationSources']
    if receipt['schema'] >= 7:
        group_names.append('fpsPresentationSources')
    for group in group_names:
        records = receipt.get(group)
        require(isinstance(records, list) and records, f'Missing source provenance group: {group}')
        names = []
        for record in records:
            require(isinstance(record, dict) and isinstance(record.get('source'), str), f'Invalid source record in {group}')
            source = record['source']
            relative = Path(source)
            require(not relative.is_absolute() and '..' not in relative.parts, f'Unsafe provenance path: {source}')
            actual = (repo / relative).resolve()
            require(actual.is_relative_to(repo) and actual.is_file(), f'Missing provenance source: {source}')
            expected = record.get('sha256')
            require(isinstance(expected, str) and re.fullmatch(r'[0-9a-f]{64}', expected), f'Invalid source hash: {source}')
            require(hashlib.sha256(actual.read_bytes()).hexdigest() == expected, f'{group} source hash differs: {source}')
            names.append(source)
        require(len(names) == len(set(names)), f'Duplicate sources in {group}')
        if group == 'cityPresentationSources':
            require(CITY_PRESENTATION_SOURCES <= set(names), 'Incomplete City presentation geometry provenance')
            if receipt['schema'] >= 7:
                require(CITY_ROUTE_PRESENTATION_SOURCES <= set(names), 'Incomplete walked-route and pocket-terminal presentation provenance')
        if group == 'fpsPresentationSources':
            require(FPS_PRESENTATION_SOURCES <= set(names), 'Incomplete FPS aim presentation provenance')
        groups[group] = len(names)
    return {'receiptSha256': hashlib.sha256(raw).hexdigest(), 'groups': groups,
            'workbookHashVerified': True, 'planningProvenanceVerified': True, 'sourceHashesVerified': True}


def read_sheet(archive, name, strings):
    root = ET.fromstring(archive.read(name))
    cells = {}
    formulas = {}
    for cell in root.findall('.//m:sheetData/m:row/m:c', NS):
        kind, ref = cell.get('t'), cell.get('r')
        require(kind != 'e', f'Excel error cell: {name}!{ref}')
        value = cell.find('m:v', NS)
        if kind == 's':
            content = strings[int(value.text)] if value is not None else ''
        elif kind == 'inlineStr':
            content = ''.join(item.text or '' for item in cell.findall('.//m:t', NS))
        else:
            content = value.text if value is not None else ''
        cells[ref] = content
        formula = cell.find('m:f', NS)
        if formula is not None:
            formulas[ref] = formula.text or ''
    return root, cells, formulas


@lru_cache(maxsize=None)
def style_signature(styles, index):
    """Compare effective cell style records even if export renumbers them."""
    xf = styles.find('m:cellXfs', NS)[int(index or 0)]
    attributes = dict(xf.attrib)
    components = []
    for attr, collection in [('fontId', 'fonts'), ('fillId', 'fills'), ('borderId', 'borders')]:
        component = styles.find(f'm:{collection}', NS)[int(attributes.pop(attr, 0))]
        components.append(ET.tostring(component))
    number_format = attributes.pop('numFmtId', '0')
    custom_formats = {item.get('numFmtId'): item.get('formatCode') for item in styles.findall('m:numFmts/m:numFmt', NS)}
    components.append(custom_formats.get(number_format, f'builtin:{number_format}'))
    return attributes, components, [ET.tostring(child) for child in xf]


def table_targets(archive, root, index):
    """Relationship IDs may be regenerated; the linked native tables may not."""
    rels = ET.fromstring(archive.read(f'xl/worksheets/_rels/sheet{index}.xml.rels'))
    targets = {item.get('Id'): (item.get('Type'), item.get('Target')) for item in rels}
    return [targets[item.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')]
            for item in root.findall('m:tableParts/m:tablePart', NS)]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('workbook')
    parser.add_argument('--planning', required=True)
    parser.add_argument('--receipt')
    parser.add_argument('--baseline', help='Read-only comparison of unchanged sheets in the previous workbook')
    parser.add_argument('--provenance-receipt', help='Verify workbook, planning and runtime/FPS/presentation source hashes')
    parser.add_argument('--repo', default='.', help='Repository root for the external source provenance check')
    args = parser.parse_args()
    path = Path(args.workbook)
    data = json.loads(Path(args.planning).read_text())
    provenance = verify_provenance(path, data, Path(args.provenance_receipt), Path(args.repo).resolve()) \
        if args.provenance_receipt else None
    with ZipFile(path) as archive:
        strings_root = ET.fromstring(archive.read('xl/sharedStrings.xml'))
        strings = [''.join(part.text or '' for part in item.findall('.//m:t', NS)) for item in strings_root]
        workbook = ET.fromstring(archive.read('xl/workbook.xml'))
        names = [sheet.get('name') for sheet in workbook.findall('m:sheets/m:sheet', NS)]
        require(names == ['Synthèse', 'Missions à créer', 'Contrats jouables', 'Personnages', 'Profils FPS', 'Modes FPS'], 'Unexpected workbook tabs')
        sheets = [read_sheet(archive, f'xl/worksheets/sheet{index}.xml', strings) for index in range(1, 7)]
        summary = sheets[0][1]
        contract_count = len(data['runtimeMissions'])
        completed_count = sum(sheets[1][1].get(f'R{row}') == 'Terminée' for row in range(7, 3831))
        require([int(float(summary[f'B{row}'])) for row in range(7, 14)] == [1912, 101, 1912, 1912, completed_count, contract_count, 4], 'Summary counts do not reconcile')
        design_counts = Counter(mission['designKind'] for mission in data['missions'])
        for row, (kind, label) in enumerate(DESIGN_LABELS.items(), 15):
            require(summary[f'D{row}'] == label and int(float(summary[f'E{row}'])) == design_counts[kind],
                    f'Design maturity summary differs for {kind}')
        missions = sheets[1][1]
        ids = [missions[f'A{row}'] for row in range(7, 3831)]
        require(ids == [mission['id'] for mission in data['missions']], 'Mission identity/order differs from source')
        counts = Counter((missions[f'B{row}'], missions[f'E{row}']) for row in range(7, 3831))
        for character in data['characters']:
            for strand in ['Univers', 'Multiverse']:
                require(counts[(character['id'], strand)] == 1, f'Character/strand missing or duplicated: {character["id"]} {strand}')
        nexus_rows = []
        linked_nexus_rows = []
        for row in range(7, 3831):
            plan = data['missions'][row - 7]
            require(missions[f'W{row}'] == DESIGN_LABELS[plan['designKind']], 'Mission design maturity differs from source')
            for column, allowed in {'M': {'', 'P1', 'P2', 'P3'}, 'N': {'', 'À valider', 'À documenter', 'Validé'},
                                    'O': {'', 'À écrire', 'En cours', 'Terminée'}, 'P': {'', 'À faire', 'En cours', 'Intégrée'},
                                    'Q': {'', 'À faire', 'En cours', 'Validée'}}.items():
                require(missions.get(f'{column}{row}', '') in allowed, f'Unsupported tracking value: {column}{row}')
            require(f'N{row}' in sheets[1][2][f'R{row}'], 'Copied status formula points to another record')
            if plan.get('relatedRuntimeMissionId'):
                nexus_rows.append(row)
                expected = [plan['title'], plan['premise'], plan['location']] + [
                    '\n'.join(f'{index + 1}. {step[field]}' for index, step in enumerate(plan['objectives']))
                    for field in ['action', 'obstacle', 'success']]
                for column, value in zip('FGHIJK', expected, strict=True):
                    require(missions[f'{column}{row}'] == value, f'Nexus extension differs: {plan["id"]}/{column}')
                require(plan['relatedRuntimeMissionId'] in missions[f'V{row}'], f'Nexus extension lost its related story: {plan["id"]}')
                for source in plan['sourceBindings']:
                    require(source in missions[f'V{row}'], f'Nexus source missing: {plan["id"]}/{source}')
                if plan.get('runtimeMissionId'):
                    linked_nexus_rows.append(row)
                    require(plan['implementationStatus'] == 'runtime_adaptation', f'Linked proposal has an ambiguous state: {plan["id"]}')
                    require(plan['runtimeMissionId'] in missions[f'V{row}'], f'Playable adaptation link missing: {plan["id"]}')
                    require(plan['runtimeScope'] in missions[f'V{row}'], f'Playable adaptation scope missing: {plan["id"]}')
        require(len(nexus_rows) == sum(bool(plan.get('relatedRuntimeMissionId')) for plan in data['missions']),
                'Nexus extension count differs from planning source')
        require(len(linked_nexus_rows) == data['counts']['runtimeLinkedProposals'], 'Playable adaptation links differ from planning source')
        for index, character in enumerate(data['characters'], 7):
            require(sheets[3][1][f'A{index}'] == character['id'], 'Character sheet misses a source identity')
            require(sheets[4][1][f'A{index}'] == character['id'], 'FPS sheet misses a source identity')
            require(sheets[4][1][f'D{index}'] == ('Exclu du combat' if character['nonCombat'] else 'Jouable'), 'FPS eligibility mismatch')
        contract_ids = [sheets[2][1][f'A{row}'] for row in range(7, contract_count + 7)]
        require(contract_ids == [mission['id'] for mission in data['runtimeMissions']], 'Integrated contract identity/order differs')
        require(len([ref for ref in sheets[2][1] if ref.startswith('A') and ref[1:].isdigit() and int(ref[1:]) >= 7]) == contract_count, 'Integrated contract count differs')
        runtime_by_id = {mission['id']: mission for mission in data['runtimeMissions']}
        for row in linked_nexus_rows:
            plan = data['missions'][row - 7]
            integrated = runtime_by_id.get(plan['runtimeMissionId'])
            require(integrated is not None and integrated['characterId'] == plan['characterId']
                    and integrated['requiresMissionId'] == plan['relatedRuntimeMissionId'],
                    f'Playable adaptation identity/prerequisite differs: {plan["id"]}')
        for row in range(7, 11):
            commands = sheets[5][1][f'F{row}']
            for text in ['V : ranger l’arme de terrain', 'B : reprendre l’arme rangée', 'chargeur', 'réserve', 'recharge', 'gelé en pause', 'limité à la partie']:
                require(text in commands, f'Field equipment command/limit missing in mode row {row}: {text}')
            for source in ['src/game/extinctionFieldEquipment.js', 'src/game/extinctionFighterProfiles.js', 'src/components/HubScreen.jsx']:
                require(source in sheets[5][1][f'I{row}'], f'Field equipment source missing in mode row {row}: {source}')
        inherited_routes = decision_routes = chapter_two = chapter_three = operation_variants = cargo_transfers = npc_returns = 0
        walked_routes = walk_points = 0
        cargo_ids = set()
        for row, mission in enumerate(data['runtimeMissions'], 7):
            cells = sheets[2][1]
            context = mission['id']
            require(cells[f'C{row}'] == mission['title'], f'Contract title differs: {context}')
            require(mission['premise'] in cells[f'D{row}'], f'Contract premise missing: {context}')
            for field in ['request', 'location']:
                require(mission[field] and mission[field] in cells[f'D{row}'], f'Personal {field} missing: {context}')
            require(mission['sourceFile'] in cells[f'J{row}'], f'Contract implementation source missing: {context}')
            require(mission['contentFile'] == mission['sourceFile'], f'Contract content provenance differs: {context}')
            for source in mission['systemSourceFiles'] + mission['sourceRefs'] + [mission['source']]:
                require(source in cells[f'J{row}'], f'Runtime or prior-lore source missing: {context}/{source}')
            require(mission['universe'] in cells[f'G{row}'], 'Contract access lost its district')
            require(f'Chapitre {mission["chapter"]}.' in cells[f'G{row}'], f'Chapter missing: {context}')
            if mission['chapter'] == 2:
                chapter_two += 1
            if mission['chapter'] == 3:
                chapter_three += 1
            previous_id = mission.get('requiresMissionId')
            previous_choices = {}
            if previous_id:
                require(previous_id in runtime_by_id, f'Unknown prerequisite: {context}')
                require(previous_id in cells[f'G{row}'], f'Prerequisite missing: {context}')
                previous_choices = {choice['id']: choice for step in runtime_by_id[previous_id]['steps']
                                    for choice in step.get('choices', []) if choice['valid']}
            own_choices = {choice['id']: choice for step in mission['steps']
                           for choice in step.get('choices', []) if choice['valid']}
            for choice in own_choices.values():
                require(choice['label'] in cells[f'F{row}'] and choice['result'] in cells[f'F{row}'],
                        f'Conclusion missing: {context}/{choice["id"]}')
            require('Décision :' in cells[f'F{row}'], f'Choice is not distinguished from physical action: {context}')
            def check_intervention(step, column):
                nonlocal operation_variants, walked_routes, walk_points
                operation = step.get('operation')
                if not operation:
                    return
                operation_variants += 1
                for field in ['kind', 'label', 'propName', 'completedText']:
                    require(operation[field] in cells[f'{column}{row}'],
                            f'Visible intervention {field} missing: {context}/{step.get("id", "branch")}')
                require('Après le geste :' in cells[f'{column}{row}'], f'Intervention completion condition missing: {context}')
                if step.get('walk'):
                    walked_routes += 1
                    points = step['walk']['points']
                    require(2 <= len(points) <= 6 and len({point['id'] for point in points}) == len(points),
                            f'Invalid ordered walk points: {context}')
                    require(points[-1]['x'] == step['x'] and points[-1]['y'] == step['y'],
                            f'Walk does not end at its interaction: {context}')
                    cursor = -1
                    for index, point in enumerate(points, 1):
                        expected = f'{index}. {point["label"]} [{point["id"]}] (x={point["x"]}, y={point["y"]})'
                        position = cells[f'{column}{row}'].find(expected, cursor + 1)
                        require(position > cursor, f'Walk point absent or out of order: {context}/{point["id"]}')
                        cursor = position
                        walk_points += 1
                    require('Interaction requise au dernier point après le trajet.' in cells[f'{column}{row}'],
                            f'Walk arrival mistaken for final interaction: {context}')
                    for expected in ['déplacement réel', 'ordre des points', 'sauvegardée entre quartiers',
                                     'un menu', 'un clic à distance', 'une téléportation', 'interaction sur place']:
                        require(expected in cells[f'I{row}'], f'Walk scope missing: {context}/{expected}')
                    for source in ['src/game/mosaicMissionWalks.js', 'src/game/mosaicCityRuntime.js']:
                        require(source in mission['systemSourceFiles'] and source in cells[f'J{row}'],
                                f'Walk runtime source missing: {context}/{source}')
            for step in mission['steps']:
                if not step.get('byOriginChoice') and not step.get('byChoice'):
                    require(step['text'] in cells[f'E{row}'], f'Concrete objective missing: {context}/{step["id"]}')
                    check_intervention(step, 'E')
                if step.get('cargo'):
                    cargo_transfers += 1
                    cargo = step['cargo']
                    cargo_ids.add(cargo['id'])
                    for expected in [f'Transport [{cargo["action"]}]', cargo['id'], cargo['label'], cargo['appearance']]:
                        require(expected in cells[f'E{row}'], f'Quest cargo detail missing: {context}/{step["id"]}/{expected}')
                for field, column, choices in [('byOriginChoice', 'E', previous_choices), ('byChoice', 'F', own_choices)]:
                    routes = step.get(field, {})
                    if field == 'byOriginChoice':
                        inherited_routes += len(routes)
                    else:
                        decision_routes += len(routes)
                    for choice_id, route in routes.items():
                        require(choice_id in choices, f'Unknown route choice: {context}/{choice_id}')
                        cell = cells[f'{column}{row}']
                        for expected in [f'[{choice_id}]', choices[choice_id]['label'], route['text'], route['finding'],
                                         f'(x={route["x"]}, y={route["y"]})']:
                            require(expected in cell, f'Route detail missing: {context}/{field}/{choice_id}: {expected}')
                        check_intervention(route, column)
                        if field == 'byChoice':
                            require('À accomplir :' in cell, f'Decision route claims completion before action: {context}/{choice_id}')
            if mission['universe'] != 'Nexus de Convergence':
                require(f'DLC {mission["universe"]} installé' in cells[f'G{row}'], 'Contract access lost its DLC requirement')
            if any(step.get('cargo') for step in mission['steps']):
                closing = mission['steps'][-1]
                recipient = 'arca_mirelle' if mission['characterId'] == 'player_anchor' else mission['characterId']
                require(closing['type'] == 'npc' and closing['targetId'] == recipient, f'Cargo story does not return to its resident: {context}')
                require(closing['dialogue'] in cells[f'E{row}'], f'Resident closing response missing: {context}')
                require('Clôture auprès de' in cells[f'I{row}'] and closing['targetId'] in cells[f'I{row}'],
                        f'Resident closure described incorrectly: {context}')
                require('Un seul objet de quête porté' in cells[f'I{row}'] and 'sans entrer dans l’inventaire de combat' in cells[f'I{row}'],
                        f'Quest cargo scope missing: {context}')
                npc_returns += 1
        for index, (root, _, _) in enumerate(sheets[1:], 2):
            pane = root.find('m:sheetViews/m:sheetView/m:pane', NS)
            require(pane is not None and pane.get('state') == 'frozen' and pane.get('xSplit') == '3' and pane.get('ySplit') == '6', f'Headers/identity columns not frozen in sheet {index}')
        validation = sheets[1][0].findall('m:dataValidations/m:dataValidation', NS)
        require(len(validation) == 5, 'Expected priority plus four prerequisite dropdowns')
        table_files = [name for name in archive.namelist() if name.startswith('xl/tables/table') and name.endswith('.xml')]
        require(len(table_files) == 5, 'Expected five native filtered data tables')
        for name in table_files:
            table = ET.fromstring(archive.read(name))
            require(table.find('m:autoFilter', NS) is not None, f'Filter missing: {name}')
            if table.get('name') == 'ContratsJouables':
                expected_range = f'A6:J{contract_count + 6}'
                require(table.get('ref') == expected_range and table.find('m:autoFilter', NS).get('ref') == expected_range,
                        'Native contract table/filter excludes added contracts')
        formula_count = sum(len(formulas) for _, _, formulas in sheets)
        preserved_sheets = []
        preserved_contracts = None
        changed_mode_cells = None
        if args.baseline:
            with ZipFile(args.baseline) as baseline:
                original_styles = ET.fromstring(baseline.read('xl/styles.xml'))
                current_styles = ET.fromstring(archive.read('xl/styles.xml'))
                original_strings = [''.join(part.text or '' for part in item.findall('.//m:t', NS))
                                    for item in ET.fromstring(baseline.read('xl/sharedStrings.xml'))]
                original_summary = read_sheet(baseline, 'xl/worksheets/sheet1.xml', original_strings)
                original_contract_count = int(float(original_summary[1]['B12']))
                original_contracts = read_sheet(baseline, 'xl/worksheets/sheet3.xml', original_strings)
                for row in range(7, original_contract_count + 7):
                    for column in 'ABCDEFGHIJ':
                        ref = f'{column}{row}'
                        require(sheets[2][1].get(ref, '') == original_contracts[1].get(ref, ''),
                                f'Previously playable contract changed: {ref}')
                        require(sheets[2][2].get(ref, '') == original_contracts[2].get(ref, ''),
                                f'Previously playable contract formula changed: {ref}')
                preserved_contracts = original_contract_count
                changed_mode_cells = []
                changed_summary = {'B12', 'B18'}
                require({key: value for key, value in summary.items() if key not in changed_summary} ==
                        {key: value for key, value in original_summary[1].items() if key not in changed_summary},
                        'Unrelated summary values changed')
                require({key: value for key, value in sheets[0][2].items() if key != 'B12'} ==
                        {key: value for key, value in original_summary[2].items() if key != 'B12'},
                        'Unrelated summary formulas changed')
                for index in [2, 4, 5, 6]:
                    original = read_sheet(baseline, f'xl/worksheets/sheet{index}.xml', original_strings)
                    allowed_cells = {'A4'} if index == 2 else set()
                    if index == 2:
                        allowed_cells.update(f'V{row}' for row in linked_nexus_rows)
                        for row in range(7, 3831):
                            for column in 'MNOPQSTU':
                                ref = f'{column}{row}'
                                require(sheets[1][1].get(ref, '') == original[1].get(ref, ''), f'Existing manual tracking changed: {ref}')
                    if index == 6:
                        allowed_cells.update(f'{column}{row}' for row in range(7, 11) for column in 'FI')
                        changed_mode_cells = sorted(ref for ref in allowed_cells
                                                    if sheets[index - 1][1].get(ref, '') != original[1].get(ref, ''))
                    require({key: value for key, value in sheets[index - 1][1].items() if key not in allowed_cells} ==
                            {key: value for key, value in original[1].items() if key not in allowed_cells},
                            f'Unrelated values changed in {names[index - 1]}')
                    require(sheets[index - 1][2] == original[2], f'Unrelated formulas changed in {names[index - 1]}')
                    for tag in ['dataValidations', 'conditionalFormatting', 'sheetViews', 'cols', 'sheetFormatPr',
                                'sheetPr', 'mergeCells', 'sheetProtection', 'drawing', 'legacyDrawing', 'hyperlinks']:
                        before = [ET.tostring(item) for item in original[0].findall(f'm:{tag}', NS)]
                        after = [ET.tostring(item) for item in sheets[index - 1][0].findall(f'm:{tag}', NS)]
                        require(before == after, f'Unrelated {tag} changed in {names[index - 1]}')
                    require(table_targets(baseline, original[0], index) == table_targets(archive, sheets[index - 1][0], index),
                            f'Unrelated table links changed in {names[index - 1]}')
                    def row_layout(row):
                        attributes = dict(row.attrib)
                        if (index == 2 and int(row.get('r')) in linked_nexus_rows) or (index == 6 and 7 <= int(row.get('r')) <= 10):
                            attributes.pop('ht', None)
                            attributes.pop('customHeight', None)
                            # Autofit writes the explicit default visibility on
                            # edited rows. A hidden row must still fail comparison.
                            if attributes.get('hidden') == '0':
                                attributes.pop('hidden')
                        return attributes
                    original_rows = [row_layout(row) for row in original[0].findall('m:sheetData/m:row', NS)]
                    current_rows = [row_layout(row) for row in sheets[index - 1][0].findall('m:sheetData/m:row', NS)]
                    require(original_rows == current_rows, f'Unrelated row layout changed in {names[index - 1]}')
                    original_cells = original[0].findall('m:sheetData/m:row/m:c', NS)
                    current_cells = sheets[index - 1][0].findall('m:sheetData/m:row/m:c', NS)
                    for before, after in zip(original_cells, current_cells, strict=True):
                        require(before.get('r') == after.get('r'), f'Unrelated cell layout changed in {names[index - 1]}')
                        require(style_signature(original_styles, before.get('s')) == style_signature(current_styles, after.get('s')),
                                f'Unrelated cell style changed in {names[index - 1]}!{before.get("r")}')
                    if index in [4, 5] or (index == 6 and not changed_mode_cells):
                        preserved_sheets.append(names[index - 1])
                original_tables = {ET.fromstring(baseline.read(name)).get('name'): ET.tostring(ET.fromstring(baseline.read(name)))
                                   for name in table_files}
                for name in table_files:
                    table = ET.fromstring(archive.read(name))
                    if table.get('name') != 'ContratsJouables':
                        require(ET.tostring(table) == original_tables[table.get('name')], f'Unrelated native table changed: {table.get("name")}')
    receipt = {'schema': 4, 'workbook': path.name, 'sha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'bytes': path.stat().st_size,
               'sheets': names, 'sourceCharacters': 1912, 'nonCombatCharacters': 101, 'proposedMissions': len(data['missions']),
               'unlinkedProposals': data['counts']['remainingUnlinkedProposals'],
               'individuallyDesignedMissions': design_counts['individual_proposal'],
               'designCounts': dict(design_counts),
               'integratedCityContracts': contract_count, 'fpsModes': 4, 'nativeTables': 5, 'dropdownRanges': 5,
               'chapterTwoContracts': chapter_two, 'inheritedRoutes': inherited_routes, 'decisionRoutes': decision_routes,
               'chapterThreeContracts': chapter_three, 'cargoTransfersChecked': cargo_transfers, 'cargoIds': sorted(cargo_ids), 'residentClosuresChecked': npc_returns,
               'walkedRoutesChecked': walked_routes, 'walkPointsChecked': walk_points,
               'preservedRuntimeContracts': preserved_contracts,
               'operationVariantsChecked': operation_variants, 'authoredNexusProposals': len(nexus_rows),
               'runtimeLinkedProposals': len(linked_nexus_rows), 'preservedUnlinkedNexusProposals': len(nexus_rows) - len(linked_nexus_rows),
               'proposalsRequiringDiegeticRewrite': sum(mission['designKind'] != 'individual_proposal' for mission in data['missions']),
               'preservedTrackingColumns': ['M', 'N', 'O', 'P', 'Q', 'S', 'T', 'U'] if args.baseline else [],
               'preservedSheets': preserved_sheets,
               'formulasInspected': formula_count, 'coverage': 'exact one universe and one Multiverse proposal per source identity',
               'changedModeCells': changed_mode_cells,
               'modeCommandAndSourceCellsChecked': [f'{column}{row}' for row in range(7, 11) for column in 'FI'],
               'status': 'passed', 'scope': 'Read-only OpenXML identities, personal requests, locations, runtime prerequisites, branch interventions and effects, ordered walked routes, explicit Nexus adaptation links, future design intentions, field-equipment commands, generic rewrite flags, cached totals, formulas, filters, panes, validation, manual tracking and unchanged-sheet styles; not a native Excel execution.'}
    if provenance:
        receipt['schema'] = 7 if 'fpsPresentationSources' in provenance['groups'] else 6
        receipt['sourceProvenance'] = provenance
        receipt['scope'] += ' External workbook, planning and runtime/FPS/City-presentation source hashes verified against the checked-out files.'
    if args.receipt:
        Path(args.receipt).write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(receipt, ensure_ascii=False))


if __name__ == '__main__':
    main()
