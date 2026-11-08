#!/usr/bin/env python3
"""Independent, read-only XLSX coverage and native-feature inspection."""
import argparse
from collections import Counter
import hashlib
import json
from pathlib import Path
import xml.etree.ElementTree as ET
from zipfile import ZipFile

NS = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
DESIGN_LABELS = {'individual_proposal': 'Proposition individualisée',
                 'research_scaffold': 'Canevas à documenter',
                 'source_objective_adaptation': 'Adaptation d’objectif source',
                 'source_family_adaptation': 'Adaptation de famille'}


def require(condition, message):
    if not condition:
        raise AssertionError(message)


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


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('workbook')
    parser.add_argument('--planning', required=True)
    parser.add_argument('--receipt')
    parser.add_argument('--baseline', help='Read-only comparison of unchanged sheets in the previous workbook')
    args = parser.parse_args()
    path = Path(args.workbook)
    data = json.loads(Path(args.planning).read_text())
    with ZipFile(path) as archive:
        strings_root = ET.fromstring(archive.read('xl/sharedStrings.xml'))
        strings = [''.join(part.text or '' for part in item.findall('.//m:t', NS)) for item in strings_root]
        workbook = ET.fromstring(archive.read('xl/workbook.xml'))
        names = [sheet.get('name') for sheet in workbook.findall('m:sheets/m:sheet', NS)]
        require(names == ['Synthèse', 'Missions à créer', 'Contrats jouables', 'Personnages', 'Profils FPS', 'Modes FPS'], 'Unexpected workbook tabs')
        sheets = [read_sheet(archive, f'xl/worksheets/sheet{index}.xml', strings) for index in range(1, 7)]
        summary = sheets[0][1]
        contract_count = len(data['runtimeMissions'])
        require([int(float(summary[f'B{row}'])) for row in range(7, 14)] == [1912, 101, 1912, 1912, 0, contract_count, 4], 'Summary counts do not reconcile')
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
        for row in range(7, 3831):
            require(missions[f'W{row}'] == DESIGN_LABELS[data['missions'][row - 7]['designKind']], 'Mission design maturity differs from source')
            require(missions[f'N{row}'] == 'À valider' and missions[f'O{row}'] == 'À écrire', 'A proposed mission claims an unverified prerequisite')
            require(missions[f'P{row}'] == 'À faire' and missions[f'Q{row}'] == 'À faire', 'A proposal is falsely marked implemented/tested')
            require(f'N{row}' in sheets[1][2][f'R{row}'], 'Copied status formula points to another record')
        for index, character in enumerate(data['characters'], 7):
            require(sheets[3][1][f'A{index}'] == character['id'], 'Character sheet misses a source identity')
            require(sheets[4][1][f'A{index}'] == character['id'], 'FPS sheet misses a source identity')
            require(sheets[4][1][f'D{index}'] == ('Exclu du combat' if character['nonCombat'] else 'Jouable'), 'FPS eligibility mismatch')
        contract_ids = [sheets[2][1][f'A{row}'] for row in range(7, contract_count + 7)]
        require(contract_ids == [mission['id'] for mission in data['runtimeMissions']], 'Integrated contract identity/order differs')
        require(len([ref for ref in sheets[2][1] if ref.startswith('A') and ref[1:].isdigit() and int(ref[1:]) >= 7]) == contract_count, 'Integrated contract count differs')
        for row, mission in enumerate(data['runtimeMissions'], 7):
            require(mission['universe'] in sheets[2][1][f'G{row}'], 'Contract access lost its district')
            if mission['universe'] != 'Nexus de Convergence':
                require(f'DLC {mission["universe"]} installé' in sheets[2][1][f'G{row}'], 'Contract access lost its DLC requirement')
        for index, (root, _, _) in enumerate(sheets[1:], 2):
            pane = root.find('m:sheetViews/m:sheetView/m:pane', NS)
            require(pane is not None and pane.get('state') == 'frozen' and pane.get('xSplit') == '3' and pane.get('ySplit') == '6', f'Headers/identity columns not frozen in sheet {index}')
        validation = sheets[1][0].findall('m:dataValidations/m:dataValidation', NS)
        require(len(validation) == 5, 'Expected priority plus four prerequisite dropdowns')
        table_files = [name for name in archive.namelist() if name.startswith('xl/tables/table') and name.endswith('.xml')]
        require(len(table_files) == 5, 'Expected five native filtered data tables')
        for name in table_files:
            require(ET.fromstring(archive.read(name)).find('m:autoFilter', NS) is not None, f'Filter missing: {name}')
        formula_count = sum(len(formulas) for _, _, formulas in sheets)
        preserved_sheets = []
        if args.baseline:
            with ZipFile(args.baseline) as baseline:
                original_strings = [''.join(part.text or '' for part in item.findall('.//m:t', NS))
                                    for item in ET.fromstring(baseline.read('xl/sharedStrings.xml'))]
                for index in [2, 4, 5, 6]:
                    original = read_sheet(baseline, f'xl/worksheets/sheet{index}.xml', original_strings)
                    require(sheets[index - 1][1] == original[1], f'Unrelated values changed in {names[index - 1]}')
                    require(sheets[index - 1][2] == original[2], f'Unrelated formulas changed in {names[index - 1]}')
                    for tag in ['dataValidations', 'conditionalFormatting', 'sheetViews']:
                        before = [ET.tostring(item) for item in original[0].findall(f'm:{tag}', NS)]
                        after = [ET.tostring(item) for item in sheets[index - 1][0].findall(f'm:{tag}', NS)]
                        require(before == after, f'Unrelated {tag} changed in {names[index - 1]}')
                    preserved_sheets.append(names[index - 1])
    receipt = {'schema': 1, 'workbook': path.name, 'sha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'bytes': path.stat().st_size,
               'sheets': names, 'sourceCharacters': 1912, 'nonCombatCharacters': 101, 'plannedMissions': 3824,
               'individuallyDesignedMissions': design_counts['individual_proposal'],
               'designCounts': dict(design_counts),
               'integratedCityContracts': contract_count, 'fpsModes': 4, 'nativeTables': 5, 'dropdownRanges': 5,
               'preservedSheets': preserved_sheets,
               'formulasInspected': formula_count, 'coverage': 'exact one universe and one Multiverse proposal per source identity',
               'status': 'passed', 'scope': 'Read-only OpenXML identities, cached totals, formulas, filters, panes and validation; not a native Excel execution.'}
    if args.receipt:
        Path(args.receipt).write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(receipt, ensure_ascii=False))


if __name__ == '__main__':
    main()
