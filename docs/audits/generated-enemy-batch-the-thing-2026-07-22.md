# Lot ennemis The Thing (1982) genere par OpenAI ImageGen - 2026-07-22

## Perimetre livre

Ce lot contient trois planches originales fan-made, produites avec un appel
OpenAI ImageGen distinct par incarnation. Les images de reference ont servi a
verrouiller les silhouettes et les effets pratiques du film de 1982 ; aucun
photogramme, asset officiel ou element de decor n'est copie dans les PNG.

| Role | Sujet | Fichier final | Taille |
|---|---|---|---:|
| Ennemi | Dog-Thing | `public/sprites/generated/bosses/the-thing/dog-thing.png` | 687942 octets |
| Ennemi | Bennings-Thing | `public/sprites/generated/bosses/the-thing/bennings-thing.png` | 581528 octets |
| Ennemi | Palmer-Thing | `public/sprites/generated/bosses/the-thing/palmer-thing.png` | 669611 octets |

Chaque fichier final est un PNG `RGBA` de `1024x1024`, decoupe en grille
stricte `4x4` de cellules `256x256` :

| Ligne | Animation | Frames |
|---|---|---:|
| 1 | idle | 4 |
| 2 | course ou deplacement | 4 |
| 3 | attaque canonique | 4 |
| 4 | reaction aux degats et chute | 4 |

## References inspectees avant generation

- [Universal Pictures At Home - The Thing (1982)](https://www.universalpicturesathome.com/movies/the-thing-1982) : film, annee, distribution et cadre canonique de la station antarctique ;
- [Monster Legacy - The Thing From Another World, part 2](https://monsterlegacy.net/2017/06/25/the-thing-rob-bottin-john-carpenter-pg2/) : formes successives du Dog-Thing, tete canine fendue, masse basse, tentacules, pattes articulees et gueule florale composee de langues et de dents canines ;
- [Bennings-Thing - The Thing Wiki](https://thething.fandom.com/wiki/Bennings-Thing) : assimilation interrompue, morphologie presque humaine, mains inachevees allongees et hurlement dans la neige ;
- [ComingSoon - Ranked: All the Things in The Thing](https://www.comingsoon.net/horror/features/776005-ranked-all-the-things-in-the-thing) : transformation de Palmer pendant le test sanguin et tete agrandie devenue une grande machoire avant l'attaque de Windows.

Les references secondaires ont ete recoupees avec les descriptions deja
curatees dans `src/game/loreEnemyOverrides.js`.

## Verrous visuels appliques

### Dog-Thing

- meme incarnation dans les seize cellules : malamute gris et blanc, masse
  assimilatrice basse, chair ouverte, tete canine deformee, membres articules
  et tentacules fins ;
- attaque en gueule florale faite de petales organiques dentes ;
- aucune silhouette de loup generique, de xenomorphe, de Norris-Thing, de
  Blair-Thing ou de creature du film de 2011.

### Bennings-Thing

- meme homme de la station dans les seize cellules, silhouette humaine,
  cheveux courts sombres, sous-vetement thermique use et pantalon de travail ;
- transformation limitee aux deux mains, devenues des prolongements irreguliers
  de chair et d'os ;
- ligne d'attaque fondee sur le hurlement et la prise, sans tete fendue,
  couronne de tentacules, armure ou membres arachneens.

### Palmer-Thing

- meme tenue de travail anthracite et pantalon brun dans les seize cellules ;
- tete fendue verticalement en une seule machoire dentee, corps humain encore
  lisible et quelques membres arachneens de soutien ;
- aucune masse de Blair, tete detachee de Norris, victime, corde, canape ou
  second personnage.

## Generation et post-traitement

1. OpenAI ImageGen a produit trois sources RGB independantes de `1254x1254`
   sur un chroma vert uniforme.
2. Le fond a ete retire avec le helper OpenAI ImageGen
   `remove_chroma_key.py --auto-key border --soft-matte
   --transparent-threshold 12 --opaque-threshold 220 --despill
   --edge-contract 1`.
3. Les sources ont ete redimensionnees au pixel le plus proche vers
   `1024x1024`.
4. Les quatre bandes d'animation et les quatre sujets de chaque bande ont ete
   detectes sur l'alpha, extraits, redimensionnes avec une echelle uniforme par
   planche, puis recentres dans leurs cellules avec une marge minimale de
   `12 px`.
5. Tout RGB cache sous un alpha nul a ete remis a zero. Aucun fichier source,
   apercu ou intermediaire n'est conserve dans le depot.

## QA technique finale

| Fichier | Cellules | Uniques | Marge min. | Bord visible | Alpha `0 / partiel / 255` | Chroma visible | RGB cache | SHA-256 |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| `dog-thing.png` | 16 | 16 | 12 px | 0 | 844312 / 31143 / 173121 | 0 | 0 | `10f9df79910253919bbfc2b1852c817ad2a699a6338134fe16c4441486f2d3df` |
| `bennings-thing.png` | 16 | 16 | 12 px | 0 | 866899 / 18419 / 163258 | 0 | 0 | `b5a382097e4e4449ae475fa3a239c21e23b676cc1abe7a7cb69c30bc836a684d` |
| `palmer-thing.png` | 16 | 16 | 12 px | 0 | 839189 / 23240 / 186147 | 0 | 0 | `bcb39af6f87b0b104b2f198a42bf172ebfdb75567beabd9447423bd5f7c6df7d` |

Les trois planches passent les controles suivants :

- dimensions exactes `1024x1024`, mode `RGBA` et coins transparents ;
- seize cellules non vides et seize contenus de cellule distincts ;
- aucune silhouette ne traverse une limite de cellule ;
- marge transparente minimale de `12 px` dans chaque cellule ;
- aucun pixel visible sur le bord externe ;
- aucun residu chroma vert visible et aucun RGB cache sous `alpha=0`.

## Controle visuel final

Les trois PNG ont ete inspectes a leur resolution originale sur fond sombre.
Le sujet, la tenue, la morphologie et l'echelle restent coherents au sein de
chaque planche. Les quatre lignes sont lisibles comme idle, mouvement, attaque
et degats. Aucun texte, logo, watermark, decor, sol, grille, projectile, second
personnage ou frame parasite n'apparait.

## Hors perimetre confirme

Aucun code, manifeste, registre de sprites, fichier musical, configuration,
dependance ou metadonnee Git n'a ete modifie pour ce lot. Aucun commit, push ou
deploiement n'a ete execute.
