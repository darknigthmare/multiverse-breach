# House of the Dead (1997) - quatre items OpenAI

Date : 2026-07-22

## Perimetre

Quatre icones ont ete generees separement avec ImageGen, en pixel art 32-bit et
en vue trois-quarts legerement plongeante. La reference de lore principale est
la [fiche historique SEGA du jeu d'arcade de 1997](https://www.sega.jp/history/arcade/product/9038/),
completee par les references visuelles deja etablies du jeu original.

- `ams-eater-custom.png` : pistolet compact noir et gris, sans marquage lisible.
- `medical-kit.png` : trousse arcade blanche et rouge, sans texte.
- `golden-frog.png` : grenouille bonus entierement doree.
- `gold-coin.png` : piece bonus epaisse, sans lettre, chiffre ou symbole monetaire.

Chaque source a ete produite sur un fond chroma uniforme, traitee avec
`remove_chroma_key.py`, puis normalisee sur un canevas transparent `512x512`.

## Controle final

| Fichier | Format | Garde alpha G/H/D/B | Chroma visible | RGB sous alpha 0 | Composantes utiles |
|---|---|---:|---:|---:|---:|
| `ams-eater-custom.png` | `512x512 RGBA` | `48/32/48/32` | 0 | 0 | 1 |
| `medical-kit.png` | `512x512 RGBA` | `32/75/32/75` | 0 | 0 | 1 |
| `golden-frog.png` | `512x512 RGBA` | `32/40/32/40` | 0 | 0 | 1 |
| `gold-coin.png` | `512x512 RGBA` | `49/32/49/32` | 0 | 0 | 1 |

Inspection visuelle : quatre sujets corrects et complets, sans coupe, doublon,
personnage, decor, texte parasite, logo ni watermark. Verdict : **PASS 4/4**.
