#!/usr/bin/env python3
"""Rebuild the review-only art overview and README from the recorded local files.

No input artwork is cropped, recolored, mirrored or modified. Pixel-art previews
use nearest-neighbor; public photo references are linked, never composited here.
"""

from pathlib import Path
import argparse
import hashlib
import json
import math
import os
import textwrap

from PIL import Image, ImageDraw, ImageFont


OUT = Path(__file__).resolve().parent
ROOT = OUT.parents[3]
REVIEW = OUT / "visual-review.json"
VALIDATION = OUT / "integration-validation.json"
FONT_ROOT = Path("/usr/share/fonts/truetype/dejavu")


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def font(size, bold=False):
    return ImageFont.truetype(str(FONT_ROOT / ("DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf")), size)


def wrap(draw, text, typeface, width):
    words = text.split()
    lines = []
    line = ""
    for word in words:
        candidate = (line + " " + word).strip()
        if line and draw.textlength(candidate, font=typeface) > width:
            lines.append(line)
            line = word
        else:
            line = candidate
    if line:
        lines.append(line)
    return lines


def relative(path):
    return os.path.relpath(path, OUT).replace(os.sep, "/")


def resolve_asset(path):
    if path.startswith("/"):
        matches = sorted(ROOT.glob("DLC/*/assets/" + path.lstrip("/")))
        if len(matches) != 1:
            raise ValueError(f"Expected one canonical DLC source for {path}: {matches}")
        return matches[0]
    return ROOT / path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--write-readme", action="store_true", help="Explicitly replace README.md; otherwise preserve the root editor's changes")
    args = parser.parse_args()
    data = json.loads(REVIEW.read_text())
    validation = json.loads(VALIDATION.read_text())
    entries = data["entries"]
    full = [e for e in entries if e["integratedAsCg01"]]
    studies = [e for e in entries if not e["integratedAsCg01"]]
    assert len(full) == validation["newCG01"] == 6
    assert len(studies) == validation["portraitStudies"] == 7
    source_records = []
    paths = {}
    for entry in entries:
        path = resolve_asset(entry["assets"]["source"]["path"])
        sha = digest(path)
        assert sha == entry["assets"]["source"]["sha256"], str(path)
        with Image.open(path) as image:
            assert image.size == (1086, 1448) and image.mode == "RGB", str(path)
        evidence_path = ROOT / entry["sourceEvidence"]
        evidence = json.loads(evidence_path.read_text())
        for ref in evidence.get("references", []):
            ref_path = ROOT / ref["path"]
            assert ref_path.is_file(), str(ref_path)
            if ref.get("sha256"):
                assert digest(ref_path) == ref["sha256"], str(ref_path)
        assert (ROOT / entry["promptFile"]).is_file()
        paths[entry["characterId"]] = path
        source_records.append({"characterId": entry["characterId"], "integratedAsCg01": entry["integratedAsCg01"], "path": str(path.relative_to(ROOT)), "sha256": sha, "size": [1086, 1448], "evidencePath": entry["sourceEvidence"], "evidenceSha256": digest(evidence_path)})

    pike = next(e for e in entries if e["characterId"] == "pike_riff_signal")
    normalization = pike["sourceNormalization"]
    pike_native = ROOT / normalization["nativePath"]
    assert digest(pike_native) == normalization["nativeSha256"]
    with Image.open(pike_native) as native, Image.open(paths["pike_riff_signal"]) as gallery:
        assert native.size == (1087, 1447)
        expected = Image.new("RGB", (1086, 1448))
        expected.paste(native.crop((0, 0, 1086, 1447)), (0, 0))
        expected.paste(native.crop((0, 1446, 1086, 1447)), (0, 1447))
        assert expected.tobytes() == gallery.tobytes(), "Pike normalization pixels differ"

    variants = []
    for path in sorted((OUT / "variants").glob("*.png")):
        variants.append({"path": relative(path), "sha256": digest(path), "bytes": path.stat().st_size})
    assert len(variants) == validation["priorNativesArchived"] == 5

    width, margin, gap, columns = 1280, 28, 16, 4
    card_w = (width - margin * 2 - gap * (columns - 1)) // columns
    art_w = card_w - 16
    art_h = art_w * 4 // 3
    card_h = art_h + 136
    header_h, section_h, footer_h = 150, 88, 76
    rows = math.ceil(len(full) / columns) + math.ceil(len(studies) / columns)
    height = header_h + section_h * 2 + (card_h + gap) * rows + footer_h
    sheet = Image.new("RGB", (width, height), "#11151e")
    draw = ImageDraw.Draw(sheet)
    draw.text((margin, 24), "Music · CG01 et études de portrait", font=font(35, True), fill="#f2f4f8")
    draw.text((margin, 76), "20 novembre 2026 · 6 CG01 en pied · 7 études limitées aux sources", font=font(22), fill="#bec7d6")
    draw.text((margin, 111), "154 personnages Music · 148 CG01 restent ouvertes, dont les 7 études", font=font(20), fill="#bec7d6")
    top = header_h
    placements = []
    for group, heading, subtitle, color in [
        (full, "CG01 EN PIED · 6 intégrées", "Personnages entiers, décors et poses nouveaux", "#8be0bd"),
        (studies, "ÉTUDES DE PORTRAIT · 7 hors registre CG01", "Cadrages partiels · référence en pied à compléter", "#f4c77b"),
    ]:
        draw.text((margin, top + 8), heading, font=font(27, True), fill=color)
        draw.text((margin, top + 47), subtitle, font=font(20), fill="#bec7d6")
        top += section_h
        for index, entry in enumerate(group):
            col, row = index % columns, index // columns
            x = margin + col * (card_w + gap)
            y = top + row * (card_h + gap)
            draw.rounded_rectangle((x, y, x + card_w, y + card_h), radius=9, fill="#202734")
            image_x, image_y = x + 8, y + 8
            with Image.open(paths[entry["characterId"]]) as source:
                preview = source.resize((art_w, art_h), Image.Resampling.NEAREST)
                sheet.paste(preview, (image_x, image_y))
            label_y = image_y + art_h + 12
            for line in wrap(draw, entry["characterName"], font(21, True), card_w - 18):
                draw.text((x + 9, label_y), line, font=font(21, True), fill="#f2f4f8")
                label_y += 27
            title = entry["title"]["fr"]
            prefix = entry["characterName"] + " — "
            if title.startswith(prefix):
                title = title[len(prefix):]
            for line in wrap(draw, title, font(18), card_w - 18):
                draw.text((x + 9, label_y), line, font=font(18), fill="#d2dae5")
                label_y += 24
            assert label_y < y + card_h - 17, (entry["characterId"], label_y, y + card_h)
            draw.text((x + 9, y + card_h - 25), "CG01 · en pied" if entry["integratedAsCg01"] else "ÉTUDE · cadrage partiel", font=font(16), fill=color)
            placements.append({"characterId": entry["characterId"], "previewRect": [image_x, image_y, art_w, art_h], "label": entry["characterName"], "titleFr": entry["title"]["fr"], "crop": False, "filter": "nearest"})
        top += math.ceil(len(group) / columns) * (card_h + gap)
    draw.text((margin, top + 10), "Fidélité revue sur les éléments visibles des références", font=font(21), fill="#f4c77b")
    draw.text((margin, top + 43), "Crédits, licences, variantes et limites détaillées dans README.md", font=font(18), fill="#bec7d6")
    output = OUT / "apercu.webp"
    sheet.save(output, format="WEBP", quality=93, method=6)

    lines = [
        "# Music — CG01 et études du 20 novembre 2026", "",
        "6 CG01 en pied sont intégrées à la galerie. 7 études de portrait restent hors du registre CG01 : leurs références ne documentent pas le bas du corps et les chaussures. Sur 154 personnages Music, 148 CG01 restent donc à compléter, études comprises.", "",
        "[Aperçu des 13 images](./apercu.webp) · [Revue détaillée](./visual-review.json) · [Validation d’intégration](./integration-validation.json) · [Reçu des 6 CG01](../../music-portraits-delivery-2026-11-20.json) · [Études séparées](./portrait-studies.json) · [Classeur de fidélité](../../Multiverse_Breach_Fidelite_CG.xlsx)", "",
        "## CG01 en pied intégrées", "",
        "| Personnage | Artwork |", "| --- | --- |",
    ]
    for entry in full:
        lines.append(f"| {entry['characterName']} | [{entry['title']['fr']}]({relative(paths[entry['characterId']])}) |")
    lines.extend(["", "## Études de portrait — CG01 en pied toujours ouvertes", "", "| Personnage du jeu | Étude | Référence publique retenue |", "| --- | --- | --- |"])
    for entry in studies:
        evidence = json.loads((ROOT / entry["sourceEvidence"]).read_text())
        refs = [r for r in evidence.get("references", []) if r.get("url") and r.get("usedForIdentity")]
        descriptions = []
        for ref in refs:
            label = f"{ref.get('photoDate', 'date non précisée')} · {ref.get('photographer', 'crédit dans la preuve')}"
            descriptions.append(f"[{label}]({ref['url']})")
        lines.append(f"| {entry['characterName']} | [{entry['title']['fr']}]({relative(paths[entry['characterId']])}) | {' ; '.join(descriptions)} |")
    lines.extend([
        "", "## Portée, conservation et contrôle", "",
        "Les cinq avatars fictifs King of Pop Avatar, Rhythm Guard, Death Cube K Echo, Pike Riff Signal et Ado Avatar suivent leurs sprites et leurs dossiers internes. Ces dessins ne qualifient pas le visage civil des artistes associés. Till suit des photos de scène datées du 24 février 2012. Les études Linkin Park gardent les noms du jeu Chester Echo et Mike Signal, avec les apparences publiques de 2007 et 2006 ; les quatre SOAD utilisent chacun une photo différente de 2012–2013.", "",
        "Les poses et décors sont des compositions originales du projet. Les limites détaillées restent dans la revue : cadrage partiel d’Oliver, mains coupées de Mike, yeux ombragés et microdétails non certifiés, source monochrome et visage partiellement masqué de John. Aucune fidélité absolue 1:1 n’est certifiée.", "",
        "Les quatre premières tentatives corrigées (Oliver, Till, Chester, Mike) restent dans [variants](./variants/). Le [natif de Pike](./variants/pike-riff-signal-native.png), 1087 × 1447, est intact ; le PNG galerie 1086 × 1448 retire sa colonne droite et duplique sa dernière ligne. Le replay pixel de cette opération figure dans [overview-proof.json](./overview-proof.json). Les autres douze PNG présentés sont des copies natives octet pour octet selon la revue.", "",
        f"La [validation d’intégration](./integration-validation.json) rapporte {validation['legacyRosterEntriesUnchanged']} anciennes entrées CG, {validation['historicalRevisionsUnchanged']} révisions historiques et les {validation['existingMusicCG03Unchanged']} anciens CG03 Music conservés. Les [39 décors CG03](../music-domains-2026-11-20/README.md) et leurs archives restent distincts de cette vague de portraits.", "",
        "L’aperçu utilise les PNG canoniques des DLC pour les six images intégrées et les PNG du dossier studies pour les sept études. Réduction nearest des illustrations, cadre entier conservé ; les légendes sont ajoutées autour des images. Les photographies publiques ne sont pas incluses dans cette planche. Les empreintes et placements des treize entrées sont dans [overview-proof.json](./overview-proof.json). Cette planche vérifie la présentation, sans ajouter de validation du gameplay ou des atlas.", "",
        "## Crédits et licences", "",
        "Les preuves par personnage conservent les URLs, dates, photographes, licences et rôles exacts. Les licences des photos sources ne sont pas une licence générale pour toutes les illustrations de la planche. Les adaptations qui possèdent un champ artLicense gardent explicitement cette licence :", "",
        "| Adaptation | Photographe et source | Licence de l’adaptation |", "| --- | --- | --- |",
    ])
    for entry in entries:
        license_data = entry.get("artLicense")
        if license_data:
            lines.append(f"| {entry['characterName']} | {license_data['sourceAttribution']} | [{license_data['license']}]({license_data['url']}) |")
    lines.extend(["", "Modifications déclarées pour ces adaptations : nouvelle pose et composition, décor du jeu, lumière et cadrage. Les crédits des autres photos sont conservés ci-dessous ; aucun artiste ni photographe n’est présenté comme approuvant le projet.", ""])
    for entry in entries:
        if entry.get("artLicense"):
            continue
        evidence = json.loads((ROOT / entry["sourceEvidence"]).read_text())
        seen = set()
        for ref in evidence.get("references", []):
            if ref.get("url") and ref.get("attribution") and ref["url"] not in seen:
                seen.add(ref["url"])
                lines.append(f"- {entry['characterName']} : {ref['attribution']} · [licence]({ref['licenseUrl']}) · [preuve locale]({relative(ROOT / entry['sourceEvidence'])}).")
    lines.append("")
    readme = OUT / "README.md"
    if args.write_readme:
        readme.write_text("\n".join(lines), encoding="utf-8")
    proof = {"schemaVersion": 1, "date": "2026-11-20", "purpose": "review-only labelled contact sheet", "reviewPath": relative(REVIEW), "reviewSha256": digest(REVIEW), "integrationValidationPath": relative(VALIDATION), "integrationValidationSha256AtBuild": digest(VALIDATION), "sourceCount": len(entries), "fullCg01Count": len(full), "portraitStudyCount": len(studies), "sourcePngs": source_records, "pikeNormalizationReplay": {"status": "pass", "nativePath": relative(pike_native), "nativeSha256": digest(pike_native), "nativeSize": [1087, 1447], "gallerySize": [1086, 1448], "operation": "remove rightmost column; duplicate last row", "rgbPixelsExact": True}, "preservedVariantPngs": variants, "layout": {"columns": columns, "canvasSize": [width, height], "sourceFramesUncropped": True, "pixelArtFilter": "nearest", "photoReferencesComposited": False, "entries": placements}, "outputs": [{"path": relative(output), "sha256": digest(output), "bytes": output.stat().st_size}], "readmeOwnership": {"path": "README.md", "mutableByRoot": True, "immutablePinOmitted": True}, "previewLabels": {"studiesSubtitle": "Cadrages partiels · référence en pied à compléter", "footer": "Fidélité revue sur les éléments visibles des références"}, "independentArtFidelityCertification": False, "gitChangedByHelper": False}
    (OUT / "overview-proof.json").write_text(json.dumps(proof, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"preview": str(output.relative_to(ROOT)), "size": [width, height], "full": len(full), "studies": len(studies), "previewBytes": output.stat().st_size, "readmeBytes": readme.stat().st_size}, ensure_ascii=False))


if __name__ == "__main__":
    main()
