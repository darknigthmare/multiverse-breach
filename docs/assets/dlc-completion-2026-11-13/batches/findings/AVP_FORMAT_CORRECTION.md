# Deux textures Alien vs Predator : format corrigé, pixels conservés

Les deux échecs du lot `00001` provenaient de fichiers nommés `.webp` contenant des PNG. Le motif du décodeur était `extension-format-mismatch`. Leurs CRC PNG, flux zlib, métadonnées et décodage intégral étaient valides ; aucune corruption du flux pixel n’a été observée.

Les originaux sont conservés dans le commit immuable `3fb49277809f28d11d4886c847558fca6ee91f21`. La correction autorisée remplace seulement les deux conteneurs aux mêmes chemins source et URL publiques. Les références, manifestes, attributions et fichiers du vérificateur n’ont pas été modifiés par cette opération.

| Texture | PNG d’origine, octets | WebP corrigé, octets | Pixels RGBA8 différents |
| --- | ---: | ---: | ---: |
| `melee-platforms.webp` | 1 364 361 | 942 016 | 0 |
| `tactics-tiles.webp` | 1 706 428 | 1 157 754 | 0 |

Les deux sorties sont de véritables conteneurs RIFF/WEBP avec flux lossless VP8L. Largeur et hauteur restent 1024 × 1024, avec quatre canaux de 8 bits et transparence. Les SHA-256 RGBA avant/après sont strictement égaux :

- Melee : `71f060b3d7c7b596efaf15280d572930f851153791e73371dbf6847f65f227d2`.
- Tactics : `44beb133be7df97560f5104d3f6727fdb265cd86277714d82cd52483bd093204`.

Les 803 942 et 626 150 pixels transparents contenant du RGB non nul sont également conservés. Un simple WebP lossless sans `exact: true` aurait changé leurs valeurs cachées : les sondes rejetées enregistrent respectivement 803 942 et 626 150 pixels différents. L’option `exact` de Sharp 0.35.3 préserve ces valeurs ; aucune comparaison PSNR n’a été substituée à l’égalité des octets RGBA.

Les sources ne contiennent que les chunks IHDR/IDAT/IEND : aucun ICC, EXIF, XMP, gAMA, cHRM, sRGB ou pHYs. Le premier essai avec `keepMetadata()` injectait un EXIF de 186 octets et une orientation 1. Il a été rejeté avant toute écriture canonique et reste archivé dans `avp-lossless-webp-attempt-01.json`. La politique finale conserve uniquement les métadonnées réellement présentes ; ici aucune API de rétention n’est nécessaire. ICC, EXIF et orientation restent absents, sans transformation des couleurs.

Commande d’encodage finale :

```js
sharp(frozenPayload, {
  failOn: 'error', limitInputPixels: 33554432,
  animated: true, sequentialRead: true
}).webp({
  lossless: true, quality: 100, alphaQuality: 100, effort: 6,
  exact: true
}).toFile(ownedTemporaryWebp);
```

Les deux candidats ont passé tous les contrôles avant remplacement des chemins canoniques. Le décodeur strict inchangé passe ensuite sur les deux fichiers écrits. Le reçu `avp-lossless-webp-correction.json` contient les tailles et SHA des conteneurs, métadonnées, comparaisons intégrales, compteurs d’alpha et empreintes des huit fichiers de vérification et de l’index Git. Ces neuf empreintes restent identiques pendant la conversion. Les temporaires ont été nettoyés ; la borne calculée sur les fichiers temporaires enregistrés est 7 583 754 octets, inférieure à 128 MiB.

La revue indépendante `avp-lossless-webp-independent-review.json` confirme les deux fichiers avec Pillow/libwebp : format VP8L, dimensions, alpha et RGBA intégral identiques, ICC/EXIF/orientation toujours absents. Elle vérifie également que le plan gelé reste inchangé.

Les anciens reçus associés au commit `3fb492…` restent des preuves historiques de l’incompatibilité d’origine. Un plan sur une nouvelle révision doit vérifier les conteneurs corrigés ; les anciens reçus ne sont pas réécrits pour les faire passer. Ces contrôles techniques ne certifient pas la fidélité artistique ou canonique 1:1 et ne constituent pas un parcours de jeu. Aucun en-tête HTTP de déploiement n’a été interrogé.
