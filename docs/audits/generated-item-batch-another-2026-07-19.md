# Production visuelle objets OpenAI - Another

Date : 2026-07-19

## Perimetre

- Univers : `Another` (anime TV de 2012).
- Production : quatre icones pixel-art originales.
- Outil : OpenAI ImageGen integre, une generation distincte par objet.
- Sortie : PNG `512 x 512`, mode `RGBA`, fond transparent.
- Hors perimetre : aucun code, manifeste, package, registre ou fichier Git
  modifie.

## References

### References officielles ou editeur

- [KADOKAWA - dixieme anniversaire de l anime Another](https://www.kadokawa.co.jp/topics/8882/)
  pour l iconographie officielle de Mei et des poupees.
- [GEE!STORE - poupee officielle sous licence de Mei Misaki](https://www.geestore.com/detail/id/00000047267)
  pour le cache-oeil blanc, l oeil de poupee et les materiaux de poupee
  articulee.
- [BS11 - page officielle de diffusion de Another](https://www.bs11.jp/anime/another/)
  pour Yomiyama Nord, la classe 3-3 et le contexte des episodes.
- [Crunchyroll LATAM - extrait officiel de la scene du parapluie](https://x.com/crunchyroll_la/status/1339646546367791105)
  pour la silhouette blanche du parapluie dans l escalier.
- [Movie Walker Press - visuel promotionnel de Mei Misaki](https://press.moviewalker.jp/news/article/24255/image101578/)
  pour la forme et le port du cache-oeil medical.

### References documentaires secondaires

- [Episode 2 - Blueprint](https://another.fandom.com/wiki/Episode_2_-_Blueprint)
  pour Studio M et la poupee qui evoque Mei.
- [Classe 3-3](https://another.fandom.com/wiki/Class_3-3)
  pour la structure de la classe maudite et ses registres.
- [Galerie de Yukari Sakuragi](https://another.fandom.com/wiki/Yukari_Sakuragi/Image_Gallery)
  pour la forme du parapluie et son role dans l episode 3.

## Sorties et verrous visuels

### `mei-s-eyepatch.png`

- Un seul cache-oeil medical blanc.
- Coussin de gaze simple, coutures legeres et fines attaches completes.
- Aucun visage, oeil, personnage ou symbole.

### `blue-doll.png`

- Une seule poupee de collection articulee.
- Yeux de verre bleus, peau porcelaine, articulations visibles.
- Robe gothique bleu nuit et bonnet assorti, dans l esprit de Studio M.
- Ce rendu est une creation originale : il ne reproduit pas une illustration
  officielle pixel par pixel.

### `class-3-roster.png`

- Un seul registre scolaire ferme, couverture textile grise usee.
- Dos renforce, pages jaunies, onglets discrets et ruban marque-page.
- Aucun titre, numero, faux texte ou logo.
- Le registre est une abstraction de pickup fondee sur la classe 3-3, pas la
  copie d un accessoire precis d un photogramme.

### `umbrella.png`

- Un seul parapluie scolaire plie.
- Toile vinyle blanche translucide, tige metallique, poignee pale courbe et
  pointe metallique complete.
- Aucune trace de sang : l icone represente l objet avant l accident.
- Aucun escalier, personnage ou decor.

## Pipeline de production

1. Generation de chaque objet sur un fond uniforme `#00ff00`.
2. Suppression du chroma avec
   `C:\Users\chuck\.codex\skills\.system\imagegen\scripts\remove_chroma_key.py`.
3. Options : auto-detection de bord, matte douce, despill et contraction de
   bord d un pixel.
4. Redimensionnement en `512 x 512` avec filtrage Lanczos.
5. Suppression des pixels residuels avec alpha inferieur ou egal a 8.
6. Neutralisation du vert residuel sur les pixels de bord semi-transparents.
7. Mise a zero de tous les canaux RGB caches lorsque alpha vaut zero.

## Validation visuelle

- Quatre objets sur quatre complets, centres et non recadres.
- Un seul objet par image.
- Aucun personnage, main, texte, logo, cadre, ombre portee ou decor.
- Silhouettes lisibles comme pickup et comme icone de collection.
- Controle individuel sur fond transparent effectue.
- Controle collectif sur damier sombre et clair effectue.
- Aucun halo chroma visible apres la passe finale.

## Validation technique

| Fichier | Dimensions | Mode | Plage alpha | RGB cache | Frange verte |
| --- | --- | --- | --- | ---: | ---: |
| `mei-s-eyepatch.png` | 512 x 512 | RGBA | 0..255 | 0 | 0 |
| `blue-doll.png` | 512 x 512 | RGBA | 0..255 | 0 | 0 |
| `class-3-roster.png` | 512 x 512 | RGBA | 0..255 | 0 | 0 |
| `umbrella.png` | 512 x 512 | RGBA | 0..255 | 0 | 0 |

Empreintes SHA-256 :

```text
bd81f256b0375952b0b7e33fdb207eee8fa2433bddaefc7b914d96efe18ebbdd  mei-s-eyepatch.png
01bbbdaf2c08b4be23d7960be09d51c71a832031a37d4a906dac73ead566d79c  blue-doll.png
934228580d77205948f8cff168a36e8f98a2fde77f488a9307fe197917263cf9  class-3-roster.png
e584fad906908e0e85e85da06a04f1d758e31a886d7f5a4a3c85f41867c04ba0  umbrella.png
```

## Fichiers produits

- `public/sprites/generated/items/another/mei-s-eyepatch.png`
- `public/sprites/generated/items/another/blue-doll.png`
- `public/sprites/generated/items/another/class-3-roster.png`
- `public/sprites/generated/items/another/umbrella.png`
