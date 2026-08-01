# Jill Valentine — corrections de style `goofy` et `alignmentSwap` OpenAI v1

Date de correction : 2026-08-01
Générateur : built-in OpenAI ImageGen via le skill `imagegen`, sans CLI ni API externe
Format final : PNG portrait exact 1086 × 1448 (3:4), sRGB 24 bits, trois canaux

## Objet de la passe

Cette passe corrige uniquement le medium de deux scènes Jill déjà approuvées sur le fond :

- `public/cg/resident-evil/jill/goofy-openai-v1.png`
- `public/cg/resident-evil/jill/alignment-swap-openai-v1.png`

Les deux versions présentes avant correction avaient les bons concepts, compositions, tenues, accessoires et contraintes de sécurité, mais un rendu lisse semi-réaliste incompatible avec la famille CG pixel-art.

Deux appels d’édition ImageGen distincts ont été effectués, un par asset. Pour chacun :

- Image 1 = cible d’édition rejetée, à préserver pour tout le contenu ;
- Image 2 = CG01 Jill local, référence obligatoire de medium pixel-art uniquement.

Les trois fichiers locaux ont été inspectés avec `view_image` en résolution originale avant les appels. Chaque sortie a ensuite été inspectée en résolution originale avant acceptation et remplacement.

## Référence locale de style

- Fichier : `public/cg/resident-evil/jill/character-solo-openai-v1.png`
- Dimensions/mode : 1086 × 1448, PNG, sRGB, RGB trois canaux
- Octets : 1 754 066
- SHA-256 : `DDF2CF89A7824076D566B80EDDCD9129501DC9CCEBE1481DF1410597F75A87B4`
- Rôle : densité de pixels, clusters carrés, contours en paliers, ombrage hard-edge, tramage et niveau de détail. Sa pose, son couloir, sa composition et son arme ne devaient pas être importés.

Le CG01 et les deux cibles sont des assets fan-made locaux. Aucun bitmap officiel, screenshot, key art, scan d’actrice ou photographie n’a été fourni à ImageGen. Aucune référence web n’était nécessaire : la modification demandée portait exclusivement sur le medium.

## États rejetés constatés avant remplacement

| Asset | Octets | Dimensions/mode | SHA-256 avant correction | Motif précis |
|---|---:|---|---|---|
| Jill `goofy` | 2 099 427 | 1086 × 1448, PNG sRGB RGB | `47620ADD7034EA0E109FFF2299EFE92C16544BE9F3A4E73D5F987307FDAFABDC` | Scène des herbes, tenue bleue, réserve et cadrage corrects, mais surfaces lisses, contours anti-aliasés et finition semi-réaliste/painterly. |
| Jill `alignmentSwap` | 1 860 449 | 1086 × 1448, PNG sRGB RGB | `B7177A2E20D75288B6BD490AE9949A99B80EBA1A7DEEB8FC8DA7D157408E8AE9` | Jill rouge/noire, laboratoire, arme et sécurité corrects, mais rendu lisse semi-réaliste sans clusters/paliers visibles. |

Ces états ont été remplacés uniquement après acceptation visuelle et technique des deux nouvelles sources. Leurs hashes sont conservés ici comme preuve de provenance.

## Prompts exacts réellement envoyés

### Jill `goofy`

~~~text
Use case: style-transfer
Asset type: targeted production style correction for Jill goofy collectible CG.
Input images: Image 1 is the exact rejected goofy scene edit target; its content is already approved and it was rejected only because the medium is smooth semi-realistic digital painting. Image 2 is the accepted local Jill CG01 and is the mandatory pixel-art rendering-style reference only. Do not import Image 2's pose, room, pistol-in-hands or alternate composition.
Primary request: change only the visual medium of Image 1 into unmistakable crisp highly detailed 32-bit-inspired raster pixel art matching Image 2. Preserve the exact approved scene concept and composition: exactly one original fictional adult Jill interpretation, full body, same centered stance and gentle head angle, blue beret, short brown bob, blue tactical shirt and shoulder pads, black fingerless gloves, blue cargo trousers, utility belt, thigh holster and black combat boots; she is carefully holding the same oversized unruly bundle of green, red and blue medicinal herbs in the same black pouch in the dim wooden storeroom. Preserve the same shelves, bottles, wooden cases, foreground worktable, herb boxes, warm lantern, scattered leaves, camera angle, spatial arrangement, lighting direction, proportions, safe framing and both complete boots.
Mandatory medium correction: reconstruct every visible edge and surface using deliberately clustered square pixels, clearly stepped contours, hard-edged limited-value shading ramps, selective one-pixel highlights and controlled pixel dithering. Use detailed low-resolution sprite-art logic cleanly scaled across the final 3:4 portrait. At native size, intentional pixel clusters and stair-stepped edges must be clearly visible on the face, hair, beret, clothing seams, gloves, herb leaves, pouch, shelves, crates, lantern and floor. Preserve the rich detail and depth; do not reduce it to a tiny sprite or blocky caricature.
Absolute invariants: change only the rendering medium. Keep Image 1's subject count, fictional identity, anatomy, pose, expression, outfit, herb bundle, objects, room, camera, perspective, composition, palette, shadows and family-safe tone. Do not add, remove, move, redesign, crop or duplicate any person, limb, garment, plant bundle, holster, prop or environment feature. No actress, celebrity, model or real-person likeness.
Constraints: exact vertical 3:4 portrait; exactly one adult woman; full body and all props safely inside frame; original unofficial fan art; no romance, sexuality, fetish framing, cleavage emphasis, gore, blood, injury, corpse, monster or victim; no text, pseudo-text, letters, numbers, logo, emblem, brand, signature, watermark, border, card frame or UI.
Avoid: smooth gradients, smooth anti-aliased contours, painterly brushwork, semi-realism, photorealism, 3D render, ray-traced materials, glossy concept-art finish, soft focus, blur, excessive bloom, chibi style, malformed hands, extra fingers, cropped boots or extra characters.
~~~

### Jill `alignmentSwap`

~~~text
Use case: style-transfer
Asset type: targeted production style correction for Jill alignment-swap collectible CG.
Input images: Image 1 is the exact rejected alignment-swap scene edit target; its content is already approved and it was rejected only because the medium is smooth semi-realistic digital painting. Image 2 is the accepted local Jill CG01 and is the mandatory pixel-art rendering-style reference only. Do not import Image 2's blue outfit, mansion corridor, pose or lighting.
Primary request: change only the visual medium of Image 1 into unmistakable crisp highly detailed 32-bit-inspired raster pixel art matching Image 2. Preserve the exact approved alternate-universe scene concept and composition: exactly one original fictional adult Jill interpretation, full body, same alert three-quarter stance and stern sideways gaze, short brown bob, red-and-black tactical shirt and trousers, black shoulder armor, fingerless gloves, utility belt, thigh holster and black boots with restrained red laces. Preserve exactly one complete intact handgun held low and safely in both hands. Keep the same dark industrial bioweapon laboratory, red-lit cylindrical containment tanks with indistinct non-graphic organic specimens behind glass on the left, black railings and machinery, cold white overhead light, distant sealed door, glassware table on the right, floor reflections, faint steam, camera angle, spatial arrangement, palette and both complete boots.
Mandatory medium correction: reconstruct every visible edge and surface using deliberately clustered square pixels, clearly stepped contours, hard-edged limited-value shading ramps, selective one-pixel highlights and controlled pixel dithering. Use detailed low-resolution sprite-art logic cleanly scaled across the final 3:4 portrait. At native size, intentional pixel clusters and stair-stepped edges must be clearly visible on the face, hair, red-black fabric, armor, gloves, handgun, boots, tank rims, glass highlights, specimens, railings, door, steam and reflective floor. Preserve the cinematic depth while keeping all gradients pixel-clustered rather than smooth.
Absolute invariants: change only the rendering medium. Keep Image 1's subject count, original fictional identity, anatomy, pose, expression, red-black outfit, complete handgun, laboratory, camera, perspective, composition, object placement, lighting design, shadows and family-safe non-graphic presentation. Do not add, remove, move, redesign, crop or duplicate any person, limb, garment, weapon, tank, specimen or prop. No actress, celebrity, model or real-person likeness. The containment specimens remain indistinct scenery behind sealed glass, never victims or foreground gore.
Constraints: exact vertical 3:4 portrait; exactly one living adult human character and one complete handgun; full body, both hands, weapon and boots safely inside frame; explicitly unofficial noncanonical fan art; no romance, sexuality, fetish framing, gore, blood, exposed organs, injury, corpse, torture or active victim; no text, pseudo-text, letters, numbers, logo, faction emblem, brand, signature, watermark, border, card frame or UI.
Avoid: smooth gradients, smooth anti-aliased contours, painterly brushwork, semi-realism, photorealism, 3D render, ray-traced materials, glossy concept-art finish, soft focus, blur, excessive bloom, actor likeness, chibi style, extra weapon, malformed hands, extra fingers, cropped boots or extra characters.
~~~

## Finales acceptées et provenance

| Asset | Source ImageGen acceptée | Destination remplacée | Octets | SHA-256 source = destination |
|---|---|---|---:|---|
| Jill `goofy` | `C:/Users/chuck/.codex/generated_images/019fbcaa-571b-7071-a290-577322f40a7e/exec-0787c7b6-e33b-4938-bcac-793e99d466e9.png` | `public/cg/resident-evil/jill/goofy-openai-v1.png` | 2 259 102 | `AD7775B2394073C1A1977D99A95920E9A84697E89F3EE2BD5411ADE9313D285A` |
| Jill `alignmentSwap` | `C:/Users/chuck/.codex/generated_images/019fbcaa-571b-7071-a290-577322f40a7e/exec-c855f50d-0d62-4965-bb16-ff29a3266526.png` | `public/cg/resident-evil/jill/alignment-swap-openai-v1.png` | 2 205 826 | `6BA64B9C74670C7330BEDFE42AC43345D5C09D0FD52BD8D161727E9C2E18EB62` |

## QA visuelle en résolution originale

### Jill `goofy`

- exactement une femme adulte fictive, corps entier et deux bottes entièrement dans le cadre ;
- tenue bleue, béret, gants, holster et proportions conservés ;
- même énorme bouquet désordonné d’herbes vertes, rouges et bleues, même pochette noire et même interaction des mains ;
- réserve en bois, rayonnages, caisses, table, bacs d’herbes, lanterne et feuilles dispersées conservés ;
- clusters carrés et contours en paliers clairement visibles sur le visage, les cheveux, les feuilles, les tissus, le métal et le bois ;
- aucune likeness réelle, sexualisation, blessure, créature, seconde personne, pseudo-texte, logo ou watermark.

### Jill `alignmentSwap`

- exactement une femme adulte fictive, corps entier, mains, bottes et unique pistolet complet ;
- tenue tactique rouge/noire, regard latéral, posture et cadrage conservés, sans retour à la tenue bleue de CG01 ;
- laboratoire, cuves rouges, bioformes indistinctes non graphiques derrière verre, porte, table de verrerie, vapeur et reflets conservés ;
- clusters et paliers visibles sur le visage, les vêtements, l’arme, le verre, les cuves, l’architecture et le sol ;
- aucune likeness réelle, victime active, gore, organe exposé, seconde arme/personne, texte, logo ou watermark.

## Vérification technique finale

- 2/2 finales : 1086 × 1448, PNG, `srgb`, RGB trois canaux.
- Aucune normalisation locale : les sorties ImageGen avaient déjà les dimensions et le mode exacts.
- 2/2 SHA-256 source ImageGen = destination.
- Les deux hashes finaux sont distincts entre eux.
- 15 PNG présents dans la famille Jill ; aucune autre image Jill ne partage l’un des deux hashes finaux.
- Les sources ImageGen restent dans leur dossier généré conformément à la politique du skill.
- Le script d’audit temporaire a été supprimé.
- Aucun code, test, catalogue, manifeste, thumbnail, master ou document appartenant à un autre agent n’a été modifié.
