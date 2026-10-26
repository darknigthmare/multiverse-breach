"""Read-only XML verification of the artifact_tool-exported workbook."""
import hashlib, json, sys, zipfile
from pathlib import Path
from xml.etree import ElementTree as E
NS={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}

def column(index):
    out=''
    while index:
        index,r=divmod(index-1,26);out=chr(65+r)+out
    return out

def value(cell):
    if cell is None:return ''
    if cell.get('t')=='inlineStr':return ''.join(n.text or '' for n in cell.findall('.//m:t',NS))
    v=cell.find('m:v',NS)
    return v.text or '' if v is not None else ''

def verify(catalog_path,workbook_path):
    data=json.loads(Path(catalog_path).read_text());checks=0;rows=0
    with zipfile.ZipFile(workbook_path) as z:
        assert z.testzip() is None
        assert not any('externalLinks/' in n or n.endswith('.bin') for n in z.namelist())
        book=E.fromstring(z.read('xl/workbook.xml'))
        sheets=[n.get('name') for n in book.find('m:sheets',NS)]
        assert sheets==['Synthese','Mode_emploi',*data['tables']]
        assert len([n for n in z.namelist() if n.startswith('xl/tables/table') and n.endswith('.xml')])==len(data['tables'])+1
        for number,(name,table) in enumerate(data['tables'].items(),3):
            root=E.fromstring(z.read(f'xl/worksheets/sheet{number}.xml'))
            cells={c.get('r'):c for c in root.findall('.//m:c',NS)}
            assert not root.findall('.//m:c[@t="e"]',NS),name
            assert root.find('.//m:pane',NS).get('state')=='frozen',name
            for row,values in [(5,table['headers']),*enumerate(table['rows'],6)]:
                for j,expected in enumerate(values,1):
                    expected='' if expected is None else str(expected)
                    if expected.startswith(('=','+','-','@')):expected="'"+expected
                    actual=value(cells.get(f'{column(j)}{row}'))
                    assert actual==expected,(name,row,j,actual[:80],expected[:80])
                    checks+=1
            rows+=len(table['rows'])
        front=E.fromstring(z.read('xl/worksheets/sheet1.xml'))
        cells={c.get('r'):c for c in front.findall('.//m:c',NS)}
        expected={'A7':525,'D7':1912,'G7':1518,'J7':1507,'A11':1811,'D11':101,'G11':3,'J11':129,'E26':7244,'E27':4494,'E28':2100,'E29':3162,'E30':2100,'E31':21}
        for ref,v in expected.items():
            assert cells[ref].find('m:f',NS)is not None
            assert float(value(cells[ref]))==v,(ref,value(cells[ref]),v)
        assert data['dataSha256'] in value(cells['A37'])
    return {'sheets':len(sheets),'tables':len(data['tables'])+1,'catalogRows':rows,'verifiedCells':checks,'formulas':len(expected),'cachedFormulaErrors':0,'sha256':hashlib.sha256(Path(workbook_path).read_bytes()).hexdigest(),'catalogSha256':data['dataSha256']}

if __name__=='__main__':print(json.dumps(verify(*sys.argv[1:3]),indent=2))
