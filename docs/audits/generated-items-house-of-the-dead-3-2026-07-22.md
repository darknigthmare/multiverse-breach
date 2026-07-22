# House of the Dead III (2002) - quatre items OpenAI

Date : 2026-07-22

## Perimetre

Quatre icones ont ete generees par quatre appels ImageGen distincts, en pixel
art 32-bit et en vue trois-quarts legerement plongeante. La reference principale
est le [manuel operateur SEGA de The House of the Dead III](https://www.gamesdatabase.org/Media/SYSTEM/Arcade//Manual/formated/The_House_of_the_Dead_III_-_2002_-_Sega.pdf),
complete par l'imagerie officielle du jeu deja etablie pour le projet.

- `modified-short-spas-12.png` : SPAS-12 tres court, sans crosse, avec pompe,
  garde-main ventile et lampe integree.
- `medical-kit.png` : mallette de survie EFI blanche et rouge, sans texte,
  symbole, logo ni contenu detache.
- `12-gauge-shotgun-shell.png` : une seule cartouche rouge de calibre 12,
  sertissage ferme et culot en laiton.
- `crystal-coin.png` : un seul jeton-medaille de cristal bleu facette, sans
  texte, symbole, chaine ni particule.

Chaque source a ete produite sur un fond chroma uniforme, traitee avec
`remove_chroma_key.py` (`auto-key border`, matte progressif et despill), puis
normalisee sur un canevas transparent `512x512` avec au moins 32 px de garde.

## Prompts finaux

Le socle commun impose : un seul objet entier, interpretation pixel art arcade
32-bit originale, vue trois-quarts legerement plongeante, fond `#00FF00`
uniforme, aucune ombre portee, aucun personnage, decor, UI, texte, logo,
signature, watermark ou second objet.

- SPAS-12 : receiver noir, garde-main SPAS-12 ventile, pompe nervuree, canon
  raccourci, aucune crosse et lampe tactique sous le canon.
- Medical Kit : mallette rigide compacte blanche, renforts et bande rouges,
  poignee sombre, deux fermoirs metalliques et usure industrielle discrete.
- Cartouche : coque rouge cylindrique, fermeture en etoile, culot laiton et
  amorce centrale, sans boite ni munitions supplementaires.
- Crystal Coin : medaillon rond epais, cristal cyan/cobalt facette rendu par
  pixels opaques, bord biseaute et motifs radiaux abstraits non symboliques.

## Controle final

| Fichier | Format | Garde alpha G/H/D/B | Chroma visible | RGB sous alpha 0 | Coins transparents |
|---|---|---:|---:|---:|---:|
| `modified-short-spas-12.png` | `512x512 RGBA` | `32/79/32/80` | 0 | 0 | 4/4 |
| `medical-kit.png` | `512x512 RGBA` | `32/93/32/94` | 0 | 0 | 4/4 |
| `12-gauge-shotgun-shell.png` | `512x512 RGBA` | `82/32/82/32` | 0 | 0 | 4/4 |
| `crystal-coin.png` | `512x512 RGBA` | `32/63/32/64` | 0 | 0 | 4/4 |

Inspection visuelle : les quatre objets sont complets, lisibles et distincts,
sans coupe, doublon, chroma residuel, texte parasite, logo ni watermark.
Verdict : **PASS 4/4**.
