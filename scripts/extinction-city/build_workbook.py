"""Export an evidence-aware Extinction/City production workbook with artifact_tool.

Usage: python build_workbook.py catalog.json output.xlsx
Inventory is generated separately from the resolved JS catalogs. No art is
declared approved by an existing file name or an automated test.
"""
import json, math, re, sys
from pathlib import Path
from artifact_tool import Workbook, SpreadsheetFile

NAVY = "#142838"
TEAL = "#087F8C"
PALE = "#EDF6F7"
INK = "#203847"
AMBER = "#FFF0CE"

def col(n):
    result = ""
    while n:
        n, r = divmod(n - 1, 26)
        result = chr(65 + r) + result
    return result

def literal(v):
    if isinstance(v, str) and v.startswith(("=", "+", "-", "@")):
        return "'" + v
    return v

def column_width(header, index):
    if any(k in header for k in ["source et FPS", "Effet primaire", "Effet secondaire", "Effet ultime", "Place et rencontres", "Codex local", "Balise mission", "Ancre de stabilité", "Extraction", "Dernier Signal", "Infestation", "Chasse au Champion"]): return 58
    if "Source dépôt" in header or "Référence" in header: return 36
    if "Univers" == header: return 25
    if any(k in header for k in ["Statut", "Présence", "Compatibilité", "Priorité"]): return 23
    if index == 0: return 29
    if any(k in header for k in ["Anatomie", "proposé", "Description", "Limite", "Manquant", "Paramètres", "calques", "Animations", "Critère", "Thème"]): return 40
    if any(k in header for k in ["Nom", "Personnage", "Quartier", "Rôle"]): return 29
    return 34

def add_table(book, name, spec):
    sheet = book.worksheets.get_or_add(name)
    n, m = len(spec["rows"]), len(spec["headers"])
    end = col(m)
    # Keep the body on the workbook default font; avoid materializing 400k redundant font overrides.
    sheet.merge_cells(f"A1:{end}1")
    sheet.get_range("A1").values = [[name.replace("_", " ").upper()]]
    sheet.get_range(f"A1:{end}1").format = {"fill":NAVY, "font":{"color":"#FFFFFF", "bold":True, "size":19}, "row_height":34}
    sheet.merge_cells(f"A2:{end}2")
    sheet.get_range("A2").values = [[spec["note"]]]
    sheet.get_range(f"A2:{end}2").format = {"fill":PALE, "wrap_text":True, "row_height":40, "vertical_alignment":"center"}
    sheet.merge_cells(f"A3:{end}3")
    sheet.get_range("A3").values = [[f"{n:,} lignes | Filtrer par univers / identité / statut. Sources projet et adaptations proposées sont distinctes."]]
    sheet.get_range(f"A3:{end}3").format = {"font":{"color":TEAL, "size":10}, "row_height":23}
    sheet.get_range(f"A5:{end}5").values = [spec["headers"]]
    if n:
        # Bulk range writes keep the export fast even for thousands of records.
        for first in range(0, n, 1500):
            block = spec["rows"][first:first+1500]
            sheet.get_range(f"A{first+6}:{end}{first+5+len(block)}").values = [[literal(x) for x in row] for row in block]
        body = sheet.get_range(f"A6:{end}{n+5}")
        body.format = {"wrap_text":True, "vertical_alignment":"top", "row_height":180}
        table = sheet.tables.add(f"A5:{end}{n+5}", True, "EC_" + name)
        # Compact factual tables do not require the same height as art briefs.
        if name in {"Cite_noyau", "Runtime_Extinction", "Assets_FPS", "Sources", "Contrats_animation", "Recette_et_ouverts"}:
            body.format.row_height = 126 if name == "Assets_FPS" else 100
        if name in {"Heros_Extinction","Armes_mains_FPS","Cite_personnages"}:
            body.format.row_height = 192
        if name in {"Actions_FPS","Projectiles_FPS","Cite_zones","Modes_par_univers"}:
            body.format.row_height = 330
        for j, header in enumerate(spec["headers"]):
            rng = sheet.get_range(f"{col(j+1)}6:{col(j+1)}{n+5}")
            if header in {"Statut","État"}:
                rng.data_validation = {"rule":{"type":"list","values":["À produire","À adapter","Partiel","Hors combat","À réaliser","Tests unitaires ajoutés","Validé"]}}
                rng.conditional_formats.add_custom(f'={col(j+1)}6="À produire"', {"fill":AMBER, "font":{"color":"#874B13","bold":True}})
                rng.conditional_formats.add_custom(f'={col(j+1)}6="Partiel"', {"fill":"#D8EEF0","font":{"color":TEAL,"bold":True}})
                rng.conditional_formats.add_custom(f'={col(j+1)}6="Hors combat"', {"fill":"#EBE6F4","font":{"color":"#65507A"}})
            if header == "Priorité":
                rng.data_validation = {"rule":{"type":"list","values":["P0","P1","P2","P3"]}}
    sheet.get_range(f"A5:{end}5").format = {"fill":TEAL,"font":{"bold":True,"color":"#FFFFFF","size":10},"wrap_text":True,"row_height":36,"vertical_alignment":"center"}
    for j, header in enumerate(spec["headers"]):
        sheet.get_range(f"{col(j+1)}1").format.column_width = column_width(header,j)
    sheet.freeze_panes.freeze_rows(5)
    sheet.freeze_panes.freeze_columns(min(3,m))
    return sheet

def add_front(book, data):
    s=book.worksheets.get_or_add("Synthese")
    s.get_range("A1:L47").format = {"font":{"name":"Aptos","size":11,"color":INK},"column_width":11,"row_height":24}
    s.merge_cells("A1:L2");s.get_range("A1").values=[["MULTIVERSE BREACH  /  EXTINCTION + CITÉ"]]
    s.get_range("A1:L2").format={"fill":NAVY,"font":{"size":20,"bold":True,"color":"#FFFFFF"},"vertical_alignment":"center"}
    s.merge_cells("A3:L4");s.get_range("A3").values=[["Inventaire de production • Source figée du 26 octobre 2026 • Second classeur indépendant du suivi des 40 écrans"]]
    s.get_range("A3:L4").format={"fill":PALE,"wrap_text":True,"vertical_alignment":"center","font":{"color":TEAL,"size":12}}
    cards = [
        ("A6:C6","A7:C8","UNIVERS","=COUNTA(Univers!A6:A530)"),
        ("D6:F6","D7:F8","PERSONNAGES, ANCRE INCLUSE","=COUNTA(Heros_Extinction!A6:A1917)"),
        ("G6:I6","G7:I8","ENNEMIS CATALOGUÉS","=COUNTA(Ennemis_FPS!A6:A1523)"),
        ("J6:L6","J7:L8","BOSS / OCCURRENCES","=COUNTA(Boss_FPS!A6:A1512)"),
        ("A10:C10","A11:C12","COMBATTANTS ÉLIGIBLES","=COUNTA(Armes_mains_FPS!A6:A1816)"),
        ("D10:F10","D11:F12","NON-COMBATTANTS PRÉSERVÉS",'=COUNTIF(Heros_Extinction!M6:M1917,"Hors combat")'),
        ("G10:I10","G11:I12","MAINS PERSONNELLES LIÉES",'=COUNTIF(Heros_Extinction!M6:M1917,"Partiel")'),
        ("J10:L10","J11:L12","POLITIQUES DE FINALE","=COUNTA(Finales_et_politiques!A6:A134)"),
    ]
    for label_range,value_range,label,formula in cards:
        s.merge_cells(label_range);s.get_range(label_range.split(":")[0]).values=[[label]]
        s.get_range(label_range).format={"fill":TEAL,"font":{"color":"#FFFFFF","bold":True,"size":9},"wrap_text":True,"row_height":30,"horizontal_alignment":"center"}
        s.merge_cells(value_range);s.get_range(value_range.split(":")[0]).formulas=[[formula]]
        s.get_range(value_range).format={"fill":PALE,"font":{"size":26,"bold":True,"color":INK},"number_format":"#,##0","horizontal_alignment":"center","vertical_alignment":"center"}
    s.merge_cells("A14:L16");s.get_range("A14").values=[["INVENTORIER N’EST PAS LIVRER L’ART\n3 personnages possèdent un raccordement partiel à une planche FPS personnelle. Les autres vues, actions individualisées, ennemis FPS, quartiers spécifiques et props sont explicitement suivis comme travaux à produire ou à adapter."]]
    s.get_range("A14:L16").format={"fill":AMBER,"wrap_text":True,"font":{"color":"#714C17","bold":True},"vertical_alignment":"center"}
    sections=[
        ("A18:F18","EXTINCTION  /  VUE SUBJECTIVE"),
        ("G18:L18","CITÉ  /  EXPLORATION"),
    ]
    for r,t in sections:s.merge_cells(r);s.get_range(r.split(":")[0]).values=[[t]];s.get_range(r).format={"fill":NAVY,"font":{"color":"#FFFFFF","bold":True}}
    s.merge_cells("A19:F23");s.get_range("A19").values=[["Mains, manches et armes par personnage ; quatre actions sources ; projectiles, rayons, impacts et invocations séparés ; ennemis et boss en profondeur ; quatre variantes de mode par univers.\n\nLes identités pacifiques restent dans les épreuves et la Cité."]]
    s.merge_cells("G19:L23");s.get_range("G19").values=[["Habitants, sprites, animations d’exploration, dialogues à produire ; quatre zones de quartier par univers ; accessoires issus des reliques ; kits de sols, bâtiments, seuils, lumière et ambiance.\n\nLe quartier sûr ne devient pas une arène hostile par défaut."]]
    s.get_range("A19:L23").format={"wrap_text":True,"fill":PALE,"vertical_alignment":"top"}
    s.get_range("A25:F25").values=[["LIVRABLE / SPÉCIFICATION","", "", "", "ÉLÉMENTS",""]]
    entries=[
        ("Actions par combattant","Actions_FPS"),("Projectiles et effets proposés","Projectiles_FPS"),
        ("Zones par univers","Cite_zones"),("Accessoires et reliques","Cite_props"),
        ("Variantes de mode par univers","Modes_par_univers"),("Contrats communs d’animation","Contrats_animation")]
    for row,(label,name) in enumerate(entries,26):
        s.merge_cells(f"A{row}:D{row}");s.get_range(f"A{row}").values=[[label]]
        s.merge_cells(f"E{row}:F{row}");s.get_range(f"E{row}").formulas=[[f"=COUNTA('{name}'!A6:A{len(data['tables'][name]['rows'])+5})"]]
        if name in {"Actions_FPS","Cite_zones","Modes_par_univers"}:
            slot_headers="D5:G5" if name=="Actions_FPS" else "B5:E5"
            s.get_range(f"E{row}").formulas=[[f"=COUNTA('{name}'!A6:A{len(data['tables'][name]['rows'])+5})*COUNTA('{name}'!{slot_headers})"]]
        if name=="Projectiles_FPS":
            s.get_range(f"E{row}").formulas=[[f"=COUNTA('{name}'!D6:F{len(data['tables'][name]['rows'])+5})"]]
        s.get_range(f"E{row}:F{row}").set_number_format("#,##0")
    s.merge_cells("G25:L25");s.get_range("G25").values=[["LIMITES DE LA PREUVE"]]
    s.merge_cells("G26:L31");s.get_range("G26").values=[["Les noms, techniques et références sont ceux du catalogue du projet, pas une validation externe du canon.\n\nLa présence d’un fichier ne prouve ni sa fidélité, ni son découpage, ni son intégration. Les 525 univers ne prétendent pas couvrir toute l’histoire de chaque franchise."]]
    s.get_range("G26:L31").format={"wrap_text":True,"fill":PALE,"vertical_alignment":"top"}
    s.merge_cells("A33:L34");s.get_range("A33").values=[["Lecture : commencer par Mode_emploi, filtrer Univers, puis ouvrir les tables du mode concerné. Les colonnes « source » et « proposé » ne sont pas interchangeables."]]
    s.get_range("A33:L34").format={"wrap_text":True,"fill":PALE,"vertical_alignment":"center"}
    s.merge_cells("A36:L36");s.get_range("A36").values=[["SOURCE DU CATALOGUE ET TRAÇABILITÉ"]]
    s.get_range("A36:L36").format={"fill":NAVY,"font":{"color":"#FFFFFF","bold":True}}
    s.merge_cells("A37:L38");s.get_range("A37").values=[[f"Révision source : {data['sourceCommit']}\nEmpreinte des tables : {data['dataSha256']}"]]
    s.get_range("A37:L38").format={"wrap_text":True,"font":{"size":9},"vertical_alignment":"center"}
    s.merge_cells("A40:L41");s.get_range("A40").values=[["PR #9 : https://github.com/darknigthmare/multiverse-breach/pull/9\nLe classeur UI original est conservé : docs/excel/Multiverse_Breach_UI_Immersion.xlsx"]]
    s.get_range("A40:L41").format={"wrap_text":True,"font":{"color":TEAL,"size":10}}
    s.freeze_panes.freeze_rows(4)
    rules=[
        ["Périmètre","Catalogue résolu de la branche de PR, Ancre incluse. Toutes les entrées sont conservées ; univers masqués et possession sont des filtres de jeu, pas des suppressions de l’inventaire."],
        ["Données source","Noms, catégories, techniques, paramètres et identifiants issus du dépôt. Les valeurs sont conservées même lorsque la formulation actuelle reste générique."],
        ["Proposition de production","Descriptions de cadrage, couches, animations, collisions et tests. Ce sont des besoins à produire, pas des capacités canoniques ni du contenu déjà livré."],
        ["Statut Partiel","Un élément existe ou un raccordement est présent. Il reste une validation visuelle/fonctionnelle. Aucun statut Partiel ne vaut fidélité 1:1."],
        ["Statut À produire","Le mode n’a pas la vue, l’animation ou le décor individuel demandé. Une image 2D de personnage entier n’est pas une paire de mains FPS."],
        ["Statut À adapter","Le catalogue source existe, mais sa conversion au mode FPS ou à l’exploration n’est pas raccordée individuellement."],
        ["Statut Hors combat","Identité pacifique, épreuve ou finale particulière. Ne pas ajouter une arme, un comportement hostile ou une récompense d’élimination."],
        ["FPS / mains","Mains et appendices, gants, poignets et manches doivent correspondre à l’incarnation documentée. Cadrage stable, viseur dégagé et retour de recul cohérent."],
        ["FPS / armes","Garder les noms exacts du catalogue. Isoler arme, parties mobiles, support, émission et impact. Aucune recharge, munition, calibre ou anatomie absente ne doit être inventée."],
        ["FPS / effets","Projectiles, rayons, traces instantanées, zones, ondes et invocations sont différents. Direction, profondeur, échelle, hitbox et durée nécessitent une validation propre."],
        ["FPS / ennemis et boss","Prévoir face, dos et orientations adaptées ; déplacement, anticipation, attaque, hit et fin. Points faibles et phases doivent venir des références, pas d’un modèle générique imposé."],
        ["Cité / zones","Les quatre zones par univers sont le gabarit actuel. Construire les lieux spécifiques sans fermer les chemins, ni déplacer les actions de service hors de portée."],
        ["Cité / habitants","Sprites, marche, repos, conversation et interaction ; tri en profondeur et occlusion. Les non-combattants restent présents. L’échantillon actuel de PNJ n’est pas toute la population."],
        ["Cité / props","Séparer mobilier, signalétique, lumières, portails et objets interactifs. Un sprite d’inventaire de relique n’est pas un prop déjà placé et animé."],
        ["Apparences","Une planche de costume de base ne certifie pas un autre costume. La continuation utilise un schéma explicite lorsqu’aucune liaison de costume FPS n’existe."],
        ["Fichier ancien","Bucket Guitar Echo (Buckhead) demeure une ressource historique sans propriétaire du roster actuel. Ne pas la réaffecter automatiquement à buckethead_avatar."],
        ["Validation","Conserver tests unitaires, tests navigateur, captures et revue humaine distincts. Appareils physiques, compte cloud et 40 écrans ne sont pas certifiés par ces seules tables."],
        ["Références","URLs externes héritées du projet, non consultées lors de cet export. Les sources GitHub sont figées par SHA. Les nouveaux modules sont cités par chemin de continuation."],
        ["Mise à jour","Regénérer le JSON avec scripts/extinction-city/catalog.mjs, puis ce classeur avec artifact_tool. Ne pas écraser l’historique de validation du premier Excel."],
    ]
    add_table(book,"Mode_emploi",{"headers":["Sujet","Règle"],"rows":rules,"note":"Guide de lecture : faits du dépôt, propositions et état de production."})
    guide=book.worksheets.get_item("Mode_emploi")
    guide.get_range("A1:A24").format.column_width=29
    guide.get_range("B1:B24").format.column_width=100
    guide.get_range("A6:B24").format.row_height=62
    guide.get_range("A2:B2").format.row_height=40
    return s

def build(data):
    book=Workbook.create()
    book.worksheets.add("Synthese")
    book.worksheets.add("Mode_emploi")
    for name in data["tables"]: book.worksheets.add(name)
    add_front(book,data)
    for name,spec in data["tables"].items():
        add_table(book,name,spec)
    return book

if __name__=="__main__":
    payload=json.loads(Path(sys.argv[1]).read_text())
    workbook=build(payload)
    print("Built", flush=True)
    SpreadsheetFile.export_xlsx(workbook).save(sys.argv[2])
    print("Exported", flush=True)
