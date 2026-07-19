# Production visuelle objets OpenAI - Tanya the Evil

Date : 2026-07-19

## Perimetre

- Univers : `Tanya the Evil / Youjo Senki`.
- Production : quatre icones pixel-art originales generees separement.
- Outil : OpenAI ImageGen integre.
- Sortie : PNG `512 x 512`, mode `RGBA`, fond transparent.
- Hors perimetre : aucun code, manifeste, registre de prompts, package ou
  etat Git modifie.

## References officielles ou licencees

- [Site anime officiel - catalogue des produits](https://youjo-senki.jp/tv/goods/goods.html)
  pour le pendentif Elenium Type 95, le fusil magique semi-automatique
  Mondragon M1908 et le langage materiel de l armee imperiale.
- [Site anime officiel - episode 3](https://youjo-senki.jp/tv/story/?ep=3)
  pour le statut experimental et dangereux du Type 95.
- [KADOKAWA - replique 1/1 de la Silver Wings Assault Badge](https://prtimes.jp/main/html/rd/p/000003812.000007006.html)
  pour la silhouette, les reliefs en alliage, la croix emaillee bleu fonce et
  l aigle central.
- [COSPA - Silver Wings Assault Badge sous licence](https://www.cospa.com/cospa/detail/id/00000077397)
  pour les proportions de la version portee.
- [Good Smile Company - Nendoroid Tanya Degurechaff](https://www.goodsmile.com/en/product/4254/Nendoroid%2BTanya%2BDegurechaff)
  pour la presence canonique du fusil et de l orbe d operation.
- [HobbySearch - Metal Art Dog Tag Visha sous licence](https://www.1999.co.jp/eng/10451923)
  pour le principe d une plaque metallique de collection. L icone finale
  n en reprend ni le portrait ni les inscriptions.

## Sorties et verrous visuels

### `type-95-computation-orb.png`

- Orbe experimental a quatre coeurs rouges clairement separes.
- Assemblage cruciforme symetrique en laiton vieilli, mecanismes analogiques
  et petite attache en forme de croix.
- La construction a quatre coeurs distingue explicitement ce pickup du Type
  97 a deux coeurs.
- Aucun personnage, chaine, texte ou effet magique hors silhouette.

### `mage-rifle.png`

- Fusil magique imperial base sur le Mondragon M1908 montre par la licence.
- Longue monture en noyer, acier noirci, chargeur droit et dispositif de
  calcul compact pres du boitier.
- Silhouette d arme de service de la Premiere Guerre mondiale conservee :
  aucun design moderne, aucune lunette et aucune lame fixee.

### `silver-wings-assault-badge.png`

- Rosace argent vieilli, croix en email bleu et grand aigle plongeant central.
- Relief et superposition alignes sur la replique KADOKAWA.
- Les micro-marques decoratives sont abstraites et ne forment aucun texte
  lisible.

### `imperial-dog-tags.png`

- Paire de plaques d identification en acier brosse avec chaine courte.
- Champs d identification volontairement vierges et petit relief aile
  abstrait.
- Aucun nom, matricule, symbole politique, portrait ou texte invente.

## Pipeline de production

1. Generation individuelle sur fond uniforme `#00ff00`.
2. Suppression du chroma avec
   `C:\Users\chuck\.codex\skills\.system\imagegen\scripts\remove_chroma_key.py`.
3. Options : auto-detection par les bords, matte douce, despill et contraction
   de bord d un pixel.
4. Redimensionnement en `512 x 512` avec filtrage Lanczos.
5. Suppression des pixels residuels dont l alpha est inferieur ou egal a 5.
6. Mise a zero de tous les canaux RGB lorsque l alpha vaut zero.

## Validation visuelle

- Les quatre objets ont ete inspectes individuellement en taille native.
- Un controle collectif a ete effectue sur damier clair et sombre.
- Chaque image contient un seul pickup complet, centre et non recadre.
- Aucun personnage, main, texte lisible, logo, cadre, ombre ou decor.
- Les silhouettes restent distinctes et lisibles en usage HUD.
- Aucun halo ou pixel vert visible apres la passe finale.

## Validation technique

Le test de frange signale tout pixel non transparent avec une forte dominance
verte (`G > 96`, `G > 1.55R` et `G > 1.55B`).

| Fichier | Dimensions | Mode | Boite alpha | Alpha partiel | RGB cache | Frange verte |
| --- | --- | --- | --- | ---: | ---: | ---: |
| `type-95-computation-orb.png` | 512 x 512 | RGBA | 88,32 - 423,448 | 3215 | 0 | 0 |
| `mage-rifle.png` | 512 x 512 | RGBA | 7,17 - 499,479 | 4409 | 0 | 0 |
| `silver-wings-assault-badge.png` | 512 x 512 | RGBA | 39,64 - 471,437 | 4481 | 0 | 0 |
| `imperial-dog-tags.png` | 512 x 512 | RGBA | 49,63 - 463,441 | 4476 | 0 | 0 |

Pour chaque fichier :

- plage alpha effective `0..255` ;
- alpha nul dans les quatre coins ;
- zero couleur cachee sous alpha nul ;
- zero candidat de frange chroma apres nettoyage.

Empreintes SHA-256 :

```text
1c563e6b30f9520db870c90428f9b4e005b34425eebe76a2e8138b962760ac87  type-95-computation-orb.png
54b3d63bf294c363e86195466d29b617cc24dea5787c6cc9d027c6615726a075  mage-rifle.png
e9add489f2fb26c4497ec13b3b629fd2d1329371299c13a3846f485108a311da  silver-wings-assault-badge.png
39d6cf7642e3d9c367f711175a622ef5d188a85942ed3099c5c8a855bf8f3cde  imperial-dog-tags.png
```

## Fichiers produits

- `public/sprites/generated/items/tanya-the-evil/type-95-computation-orb.png`
- `public/sprites/generated/items/tanya-the-evil/mage-rifle.png`
- `public/sprites/generated/items/tanya-the-evil/silver-wings-assault-badge.png`
- `public/sprites/generated/items/tanya-the-evil/imperial-dog-tags.png`
