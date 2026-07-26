# Dragon Ball Z - quatre objets OpenAI

Date : 2026-07-24

## Selection canonique

Le pack reste dans le perimetre de `Dragon Ball Z` et retient quatre objets
reconnaissables, transportables et utiles en jeu :

| Slot | Objet | Usage |
|---|---|---|
| Attaque / interaction | Dragon Radar | Localiser une cible ou un objectif lie aux Dragon Balls. |
| Defense / survie | Scouter | Lire une menace et anticiper sa puissance. |
| Tempo / soin | Senzu Bean | Restaurer rapidement un combattant. |
| Evenement | Hoi-Poi Capsule | Deployer un objet ou un moyen logistique au moment du besoin. |

References consultees :

- [Dragon Ball Official - premieres apparitions du Dragon Radar et des Hoi-Poi Capsules](https://en.dragon-ball-official.com/news/01_672.html)
- [Dragon Ball Official - technologie Hoi-Poi Capsule](https://en.dragon-ball-official.com/news/01_2010.html)
- [Dragon Ball Official - dossier Senzu](https://en.dragon-ball-official.com/news/01_578.html)
- [Dragon Ball Official - collection Scouter et Senzu](https://en.dragon-ball-official.com/news/01_1995.html)

La capsule reste volontairement vierge : aucun numero, texte ou logo Capsule
Corp n'est reproduit. Le Scouter est montre seul, sans tete ni oeil.

## Production et integration

Chaque icone provient d'un appel ImageGen OpenAI distinct, sur fond chroma
uniforme. Les quatre sorties ont ete traitees avec `remove_chroma_key.py`
(`--auto-key border --soft-matte --transparent-threshold 12
--opaque-threshold 220 --despill --edge-contract 1 --force`), puis normalisees
en PNG RGBA `512x512`. Le RGB cache sous alpha nul a ete force a `0/0/0`.

Fichiers integres dans
`public/sprites/generated/items/dragon-ball-z/` :

- `dragon-radar.png`
- `scouter.png`
- `senzu-bean.png`
- `hoi-poi-capsule.png`

Le pack est declare dans `loreItemOverrides.js`. Les anciens champs inline
`gear/event` de la vague demandee sont retires a la frontiere
`expandedUniverses.js`, uniquement pour les quatre univers de cette livraison.

## Controle final

| Fichier | Format | Garde alpha G/H/D/B | Chroma visible | RGB cache | Composantes utiles |
|---|---|---:|---:|---:|---:|
| `dragon-radar.png` | `512x512 RGBA` | `79/72/76/75` | 0 | 0 | 1 |
| `scouter.png` | `512x512 RGBA` | `46/101/46/143` | 0 | 0 | 1 |
| `senzu-bean.png` | `512x512 RGBA` | `87/122/75/117` | 0 | 0 | 1 |
| `hoi-poi-capsule.png` | `512x512 RGBA` | `88/132/91/156` | 0 | 0 | 1 |

Inspection visuelle : objets entiers, centres, lisibles en pixel art, sans
personnage, main, doublon, decor, texte, logo ni watermark. Verdict :
**PASS 4/4**.

`npm run items:audit` valide un registre de 488 objets, 228 PNG disponibles et
57 univers complets ; `Dragon Ball Z` figure parmi les univers complets.
