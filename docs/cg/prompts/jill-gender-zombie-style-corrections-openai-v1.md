# Corrections OpenAI ImageGen — Jill CG13 Gender Swap et CG14 Zombie

Date : 2026-08-01

Outil : ImageGen OpenAI intégré à Codex. Deux appels distincts, un par fichier. Aucun CLI, script API, traitement génératif local ou fallback n'a été utilisé.

## Références et rôles

- `public/cg/resident-evil/jill/character-solo-openai-v1.png` : référence stricte de vrai pixel art 32-bit, identité, construction de tenue, palette et densité de grappes de pixels.
- Ancien `public/cg/resident-evil/jill/gender-swap-openai-v1.png` : brouillon cible d'édition pour préserver la variante masculine adulte, la tenue bleue, le béret, la pose et la composition.
- Ancien `public/cg/resident-evil/jill/zombie-version-openai-v1.png` : brouillon cible d'édition pour préserver Jill, la contamination virale superficielle, la tenue bleue, le béret, la pose et la composition.

Les trois fichiers ont été inspectés à la résolution originale avant les appels.

## Brouillons rejetés

| Brouillon remplacé | Octets | SHA-256 avant remplacement | Rejet |
| --- | ---: | --- | --- |
| `public/cg/resident-evil/jill/gender-swap-openai-v1.png` | 2001620 | `ffa451f09a019fbc0e8b7046c78be6acf8b8fb954e69a005e995cb4304806af0` | Concept valide, mais peau, muscles, vêtements et décor lissés/picturaux, sans grappes de pixels nettement visibles comme CG01. |
| `public/cg/resident-evil/jill/zombie-version-openai-v1.png` | 2030636 | `61bce5db55048fdb99984c4af479ad395bd2d18365709edda2b26d8166e0e3d8` | Concept et contamination valides, mais rendu pictural/photoréaliste lissé, incompatible avec le pixel art natif de CG01. |

Ces versions ne sont plus présentes dans les chemins de production.

## Jill CG13 — Gender Swap, correction de style

Entrées ImageGen :

- Image 1 : ancien brouillon Gender Swap, cible d'édition et autorité pour le sujet masculin/composition.
- Image 2 : Jill CG01, référence de style pixel art uniquement ; son identité féminine ne devait pas remplacer la variante masculine.

Prompt exact envoyé :

~~~text
Use case: style-transfer
Asset type: targeted native-style correction of Jill CG13 genderSwap What If for the fan-made browser game Multiverse Breach
Input images: Image 1 is the rejected smooth/painterly gender-swap draft and the edit target; preserve its adult masculine alternate-Jill subject, full-body composition, pose, practical blue tactical uniform, blue beret and police-hall setting. Image 2 is ONLY the strict approved handcrafted 32-bit pixel-art rendering reference from Jill CG01; do not copy Image 2's female identity, pose, weapon placement or exact composition.
Primary request: Change only the visual rendering language of Image 1 into unmistakable crisp handcrafted high-detail 32-bit pixel art matching Image 2 at native size. Preserve the concept as exactly one adult masculine alternate identity of Jill in the same practical blue tactical uniform and beret, family-safe and non-sexualized.
Style correction imperative: build the entire figure and environment from clearly visible deliberate pixel clusters and hard-edged color blocks; crisp stepped staircase contours; chunky 2-to-6-pixel highlight and shadow clusters readable at native resolution; limited controlled navy, slate, charcoal, warm lamp and cold window palette; facial features simplified into precise pixel planes; fabric folds, muscles, leather and architecture described through discrete clustered pixels and flat shadow masses. No continuous gradients, no smooth skin pores, no painted brush blending, no photorealistic anatomy rendering, no smooth 3D surfaces, no anti-aliased vector edges.
Preserve from Image 1: exact 3:4 portrait framing, original corridor camera, exactly one adult masculine character, masculine facial presentation and ordinary athletic proportions, short dark-brown hair beneath the navy beret, blue short-sleeved tactical shirt, broad but practical blue shoulder guards, fingerless gloves, duty belt and pouches, loose blue cargo trousers, thigh holster, black combat boots, complete head-to-boots silhouette and low-ready compact handgun pose.
Composition/framing: exact 3:4 portrait canvas; exactly one complete centered masculine figure with beret, both hands, complete handgun, trousers and both boots fully inside the frame with generous padding.
Constraints: this remains only a respectful adult gender swap, not an outfit swap, alignment swap or fan-service image; family-safe and non-sexualized; no readable text, letters, numbers, logo, S.T.A.R.S. insignia, police insignia, watermark, signature, poster, actor likeness, scan-model likeness, official bitmap, blood or gore.
Avoid: changing the subject back into female Jill, feminine face or body, painterly concept art, oil-paint texture, photorealistic skin, pores, individually rendered hairs, smooth cinematic photo, 3D render, ray-traced reflections, soft airbrush shading, anti-aliased edges, pin-up proportions, exposed chest, extra person, duplicate weapon, cropped boots, pseudo-text.
~~~

Source retenue : `C:\Users\chuck\.codex\generated_images\019fbcaa-3023-7343-9b69-8486f2f0478c\exec-35b718fb-af16-45b3-b117-c600940102c9.png`.

Destination finale : `public/cg/resident-evil/jill/gender-swap-openai-v1.png`.

QA : accepté. Variante masculine adulte conservée, tenue tactique bleue et béret cohérents, silhouette complète et familiale. À taille native, les contours sont en escalier, les volumes sont construits en amas de pixels et aplats, sans peau photoréaliste, rendu peinture ou 3D.

Métadonnées : PNG RGB 24 bits, 1086 × 1448, 1957411 octets. SHA-256 source = destination : `d761a21ae3fb020907fc378f26d0a596e224149ed9ab90d6fa787501aaa446d9`.

## Jill CG14 — Zombie Version, correction de style

Entrées ImageGen :

- Image 1 : ancien brouillon Zombie, cible d'édition et autorité pour le concept/composition.
- Image 2 : Jill CG01, référence stricte d'identité, tenue et pixel art.

Prompt exact envoyé :

~~~text
Use case: style-transfer
Asset type: targeted native-style correction of Jill CG14 zombieVersion What If for the fan-made browser game Multiverse Breach
Input images: Image 1 is the rejected smooth/painterly infected-Jill draft and the edit target; preserve its single recognizable Jill subject, superficial viral contamination, full-body composition, practical blue tactical uniform, beret and police-hall setting. Image 2 is the strict approved Jill CG01 identity, outfit construction and handcrafted 32-bit pixel-art rendering reference; do not copy Image 2's exact pose or composition.
Primary request: Change only the visual rendering language of Image 1 into unmistakable crisp handcrafted high-detail 32-bit pixel art matching Image 2 at native size. Preserve exactly one adult Jill with readable but superficial, intact and non-graphic early viral contamination.
Style correction imperative: build the entire figure and environment from clearly visible deliberate pixel clusters and hard-edged color blocks; crisp stepped staircase contours; chunky 2-to-6-pixel highlight and shadow clusters readable at native resolution; limited controlled navy, slate, charcoal, cold blue and warm lamp palette; facial features simplified into precise pixel planes; fabric, leather, hair, pale skin and architecture described through discrete clustered pixels and flat shadow masses. No continuous gradients, no smooth skin pores, no painted brush blending, no photorealistic anatomy, no smooth 3D surfaces, no anti-aliased vector edges.
Preserve from Images 1 and 2: exactly one recognizable adult Jill, short brown bob beneath a navy beret, practical blue short-sleeved tactical shirt, blue shoulder guards, fingerless gloves, duty belt and pouches, loose blue cargo trousers, thigh holster, black combat boots, complete head-to-boots silhouette and compact handgun held safely low. Keep only restrained infection cues: desaturated pale gray skin, dark tired eyes, a few fine gray-green vein pixels at one temple and neck, slightly rigid posture and light uniform wear. Body and clothing remain fully intact.
Composition/framing: exact 3:4 portrait canvas; original eye-level police-hall view; exactly one complete centered Jill with beret, both hands, complete handgun, gear and both boots fully inside the frame with generous padding.
Constraints: clearly unofficial non-canonical What If; readable superficial infection with zero blood, gore, open wounds, missing skin, exposed organs, severing, decay, body horror, corpse or humiliation; no readable text, letters, numbers, logo, S.T.A.R.S. insignia, police insignia, watermark, signature, poster, actor likeness, scan-model likeness or official bitmap.
Avoid: painterly concept art, oil-paint texture, photorealistic skin or pores, smooth cinematic photo, 3D render, ray-traced reflections, soft airbrush shading, anti-aliased edges, skull face, torn jaw, exposed teeth through cheek, missing eye, pus, parasites, tentacles, mutation limb, giant muscles, crawling pose, extra person, body on floor, duplicate gun, cropped boots, pseudo-text.
~~~

Source retenue : `C:\Users\chuck\.codex\generated_images\019fbcaa-3023-7343-9b69-8486f2f0478c\exec-fe9bb80a-4f59-49da-9277-5600b01ad0bf.png`.

Destination finale : `public/cg/resident-evil/jill/zombie-version-openai-v1.png`.

QA : accepté. Jill reste reconnaissable et entière. La contamination superficielle est lisible par la peau gris pâle désaturée, les yeux assombris et quelques veinules/pixels sombres au visage, sans blessure ouverte, corps, sang ou gore. Le rendu natif emploie les mêmes grappes de pixels, aplats et contours en escalier que CG01.

Métadonnées : PNG RGB 24 bits, 1086 × 1448, 1952766 octets. SHA-256 source = destination : `c5c464be5ee5b83eb2d0dc26b2b967415a5a595537163280a7189aaf809d12e9`.

## Vérification finale

- Deux appels ImageGen built-in distincts, exactement un par fichier.
- Deux sorties inspectées en résolution originale avant remplacement.
- Deux PNG finaux 1086 × 1448, RGB 24 bits, ratio exact 3:4.
- Hash source = destination pour les deux fichiers.
- Deux hashes finaux distincts et aucune collision avec les autres PNG Jill.
- Aucun brouillon rejeté n'est présent sous les deux chemins production.
- Aucun code, manifeste, catalogue ou test n'a été modifié.
