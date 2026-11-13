# P1 raster — lot 003, 40 acteurs

Les 40 clés de ce lot sont sélectionnées dans le nouveau backlog, après exclusion
exacte des 80 clés des lots 001 et 002. L'ordre est
`universe.casefold / actorName.casefold / actorId.casefold / actorKey`.
Les chemins sont contrôlés dans l'arbre Git complet et sa projection DLC/public ;
une omission physique du checkout partiel ne crée pas un nouveau manque.

| Univers | Acteurs examinés |
| --- | ---: |
| Assassin's Creed | 2 |
| Asterix & Obelix | 6 |
| Attack on Titan | 6 |
| Baby Cart | 5 |
| Banlieue 13 | 6 |
| Battle Royale | 6 |
| Ben 10 | 6 |
| Big Mouth | 3 |

## Atlas effectivement produit

`DLC/AsterixObelix/assets/sprites/generated/bosses/asterix-1992/roman-legionary.png`
représente **Legionary 01 du jeu Astérix arcade Konami, 1992** : casque bas à
protège-joues, tunique verte, cuirasse grise, bouclier bleu à bord argenté et
détails dorés, sandales et lance à hampe brune. L'atlas RGBA contient 16 poses
sur quatre rangées : repos, marche, estocade à la lance, recul/récupération.

Le canvas de 1536 × 1024 utilise des cellules de 384 × 256. Cette largeur laisse
la lance entière à une échelle de corps commune ; le renderer existant calcule
séparément largeur/colonnes et hauteur/rangées. La baseline est 232, conformément
à son défaut `sourceH - 24`. Aucun nouveau layout partagé n'est ajouté.

La première génération a été rejetée : une interprétation trop rapide de la
référence avait produit un glaive et un faux pic de casque. Les gros plans ont
établi la hampe de lance et le casque bas. Le brut et le prompt rejetés restent
conservés ; la deuxième génération corrige ces deux erreurs. Il s'agit d'une
correction de fidélité après une génération réussie, pas d'un contournement de
refus du fournisseur.

La revue indépendante a ensuite repéré une marche centrée sur le seul pied
planté. L'ancrage inclut désormais les deux pieds : le balayage horizontal des
bounds visibles passe de 59,5 à 7,5 pixels de cellule, soit environ 15,8 à
2 pixels à hauteur de rendu 68. La version avant correction, son script, sa QA,
son aperçu et son GIF sont archivés dans `validation/attempt-before-body-pivot/`.
L'échelle et les pixels du personnage n'ont pas été repeints pour cette correction.

## Publication : candidat non raccordé

**Statut : `UNBOUND_CANDIDATE_ONLY`.** Le slot actif `Roman Legionary` conserve
son nom, sa clé, ses statistiques, son arme et ses données d'origine. Aucun
binding global n'est ajouté.

L'atmosphère Astérix active est sourcée aux albums de Goscinny et Uderzo.
L'existence d'un atlas arcade ne permet pas d'imposer son incarnation à ces
scènes. Aucune nouvelle scène générique n'est créée pour contourner cette
limite. Le bitmap et sa provenance peuvent être versionnés comme candidat ;
cela ne l'active pas dans le roster existant. La décision est tracée dans
`runtime-publication-decision.json`.

La plateforme a été vérifiée sur la fiche de la sheet **Arcade / Asterix** et
sur la fiche du jeu **Konami / Arcade / 1992**. Une page Wikipédia homonyme
concernait en réalité Sega/Master System ; elle est explicitement exclue des
preuves et n'a fourni aucune image à la génération. Aucun modèle SNES n'est
utilisé. Les URLs, empreintes, métadonnées et rectangles de référence
reproductibles sont conservés dans `references.json` et `source-page-extracts.json`.

## Les 40 dossiers

L'ancien atlas héro de Kazuo Kiriyama ne possède ni référence de costume/édition
ni actions avec armes à feu. Son nom identique ne suffit donc pas à l'attribuer
au boss du film. Le pistolet de Taha est une ressource d'objet, sans corps animé.
Les correspondances de sous-chaîne K2/FAKK2/Turok2 sont d'autres identités.
Aucune réutilisation sûre n'est approuvée.

Le rapport individuel relève les incarnations manquantes, les catégories qui
doivent devenir des individus précis, et les rencontres qui nécessitent des
corps, objets, décors et effets séparés. Les noms de slots moteur ne sont pas
transformés en prétendues créatures canoniques. Les 40 signalements raster
restent ouverts ; aucune fidélité 1:1 n'est certifiée par la présence d'un fichier
ou par ses seules métadonnées.

## Vérification

Les contacts à 68 et 96 pixels par cellule en hauteur sont des aperçus hors
moteur, sans prétention de capture en jeu. La planche complète et les GIF des
quatre rangées sont dans `validation/`. La normalisation est reproductible :

```sh
python docs/assets/p0-p1-menu-continuation-2026-11-13/raster-lot-003/normalize_roman_legionary.py
```

Les contrôles Pillow vérifient les 16 cellules non vides, leurs marges, les
dimensions, l'alpha, les pivots et l'empreinte finale. La revue de source et de
lisibilité ne certifie pas les pixels, les durées et les transitions arcade
image par image. Aucun processus Node lourd, build global ou test runtime n'est
lancé pour ce candidat non raccordé.

**Bilan : 40 acteurs examinés, 1 atlas corrigé et conservé, 0 raccord runtime,
0 signalement P1 clôturé.**
