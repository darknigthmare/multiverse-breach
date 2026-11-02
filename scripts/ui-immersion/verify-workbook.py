"""Read-only validation of the artifact-tool XLSX export; never authors cells."""
import argparse
import json
from pathlib import Path
import xml.etree.ElementTree as ET
import zipfile


parser = argparse.ArgumentParser()
parser.add_argument("workbook", type=Path)
parser.add_argument("--report", type=Path)
args = parser.parse_args()
ns = {"s": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
errors = []
sheets = []
tables = []
with zipfile.ZipFile(args.workbook) as archive:
    for name in sorted(archive.namelist()):
        if name.startswith("xl/worksheets/sheet") and name.endswith(".xml"):
            root = ET.fromstring(archive.read(name))
            for cell in root.findall('.//s:c[@t="e"]', ns):
                errors.append({"sheet": name, "cell": cell.attrib["r"], "value": cell.findtext("s:v", namespaces=ns)})
            sheets.append({
                "xml": name,
                "formulas": len(root.findall(".//s:f", ns)),
                "panes": [pane.attrib for pane in root.findall(".//s:pane", ns)],
                "validations": len(root.findall(".//s:dataValidation", ns)),
            })
        if name.startswith("xl/tables/") and name.endswith(".xml"):
            root = ET.fromstring(archive.read(name))
            tables.append({"name": root.attrib["name"], "range": root.attrib["ref"], "filter": root.find("s:autoFilter", ns) is not None})

assert len(sheets) == 5, f"Expected five sheets, got {len(sheets)}"
assert not errors, f"Cached Excel error cells: {errors[:5]}"
assert len(tables) == 4 and all(table["filter"] for table in tables), "Four filtered tables required"
assert not sheets[0]["panes"], "The compact summary should remain unfrozen"
assert all(sheet["panes"] and sheet["panes"][0].get("xSplit") == "2" and sheet["panes"][0].get("ySplit") == "6" for sheet in sheets[1:]), "Detail sheets need frozen headers and identifiers"
assert sheets[2]["validations"] == 3, "Action status input lists missing"
report = {"file": args.workbook.name, "bytes": args.workbook.stat().st_size, "cachedErrors": errors, "sheets": sheets, "tables": tables}
if args.report:
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print(json.dumps(report, ensure_ascii=False))
