# Reprise P0/P1 — 13 novembre 2026

Cette reprise intègre GitHub `2333c2c0` au travail W17 local `66f8691`. Elle conserve les façades et ressources DLC, les anciennes livraisons et les quarantaines d’édition. **Les P0/P1 ne sont pas tous terminés ; aucune fidélité 1:1 globale n’est certifiée.**

## Livraisons réelles

| Ressource | Consommateur et portée |
| --- | --- |
| [Jungle 1987](../../../DLC/Predator/assets/backgrounds/source-scenes/predator-1987-riverbank-tactics-20261113.png) | Fond Tactics 50104, rivière/rochers/végétation nocturne ; piège et géographie exacte non achevés. |
| [Vaisseau Predator 2](../../../DLC/Predator/assets/backgrounds/source-scenes/predator2-1990-ship-chamber-tactics-20261113.png) | Fond Tactics 50105, matériaux et lumière du vaisseau de 1990 ; mur de trophées encore ouvert. |
| [Forêt Prey](../../../DLC/Prey/assets/backgrounds/source-scenes/prey-2022-forest-duel-tactics-20261113.png) | Fond Tactics 50106 ; marais et distances demeurent une adaptation de grille. |
| [Sarii](../../../DLC/Prey/assets/sprites/source-scenes/prey-2022/sarii-portrait-20261113.png) | Portrait du compagnon, badge 32 px suivant sa vraie case ; aucun corps animé inventé. |
| [Naru](../../../DLC/Prey/assets/sprites/source-scenes/prey-2022/naru-portrait-20261113.png) | Portrait de l’initiative de Naru, carré 24 px dans la vignette 28×24 ; sa planche de corps n’est pas remplacée. |
| [Masque osseux](../../../DLC/Prey/assets/sprites/source-scenes/prey-2022/feral-bone-mask-front-20261113.png) | Face extérieure en badge porté 24 px ou monté 32 px, deux rôles exclusifs. Avant le vol, Feral porte son masque et seul un repère d’objectif neutre apparaît. |

Ces **six PNG ont été réellement générés**, normalisés et inspectés. Les trois fonds font 960×540 et les trois portraits/icônes 256×256. Les sources, prompts exacts, originaux, empreintes, opérations déterministes et limites se trouvent dans [scenes](scenes/README.md), [Sarii](sarii/README.md), [Naru](naru/README.md) et [bone-mask](bone-mask/README.md). Deux essais du masque écartés visuellement sont conservés. Une petite icône extérieure ne termine pas l’équipement complet ou ses animations.

Les images appartiennent physiquement aux DLC Predator/Prey ; la publication fournit leurs URL de jeu. Les fonds sont réservés à leurs scènes tactiques exactes, jamais recyclés comme cartes RPG/Mêlée/Combat. Les sélecteurs refusent les autres éditions et arènes personnalisées.

## Correctifs jouables

- Le Feral masqué de la scène 50106 réutilise les seize poses V2 de novembre 9. Ce masque n’est plus montré après `take_mask` ; la représentation démasquée reste à produire. Le préchargement ne demande plus un chemin de boss inexistant.
- Le kit effectif du Feral courant utilise les lames du poignet droit et la garde du bouclier gauche dans les quatre moteurs. Il exclut combistick, lanceur et plasma de ce matériel précis. Les données raw GitHub et la version historique Lot3 restent intactes ; dégâts, durées et portées sont des réglages du jeu.
- Les actions physiques du Feral utilisent un son de lame en Tactics plat/vertical. Les tireurs ordinaires gardent leur son de tir.
- Le fond extérieur de GameCanvas suit celui de la scène. Les six scènes source exactes excluent le scheduler d’anomalies crossover avant toute annonce, création de cache, soin ou dégât ; leurs propres commandes et minuteries restent actives.
- Deux atlas 1979 existants sont raccordés à Chestburster Larva et Synthetic Ash Protocol avec gardes d’identité, univers, incarnation et arme. **32 poses existantes sont réutilisées, aucun PNG supplémentaire n’est généré.** Les deux candidats 1979 incompatibles avec Aliens 1986 sont refusés. Voir [le lot initial de 40](raster-lot-001/README.md).

## Priorités restantes mesurées

L’[audit courant](backlog/audit.json) utilise le snapshot source immuable `daca0f002eaa94cf16b06d5ad366b0423ea294d2`, lié à `66f8691` et `2333c2c0`. Ce snapshot d’audit n’est pas le commit de livraison. Les 1 779 fichiers du graphe et du loader sont identiques avant/après et aux blobs de ce snapshot.

| Mesure de fiches et chemins déclarés | Résultat courant |
| --- | ---: |
| Acteurs, Ancre comprise | 4 937 dans 525 univers |
| Constats P1 / P2 | 17 318 / 13 406 |
| Acteurs conservant un P1 | 4 935 |
| Acteurs avec raster absent de l’arbre Git projeté | 1 474 |
| Planches gameplay déclarées 1×1 à revoir | 11 |
| Périmètres raster non résolus par quarantaine | 3 |
| Lots de la file | 123×40 acteurs + 15, soit 124 lots |

Le [delta vérifié](backlog/source-findings-delta.json) ferme **quatre constats P1** : deux chemins de raster et deux incarnations. Ces deux dossiers gardent chacun trois autres P1 ; aucun dossier n’est déclaré terminé par le seul raccord. Le [premier lot](backlog/first-batch-progress.json) conserve 38 autres cibles et la [file par 40](backlog/actor-batches-40.json) ne contient aucun doublon. La baseline `72bea3d3` est conservée séparément.

Les trois quarantaines Ahsoka Padawan/S7 et Revan ne sont pas comptées parmi les 1 474 rasters absents. Les chemins sont contrôlés dans l’arbre Git complet avec projection des ressources DLC ; **un fichier local omis par sparse checkout ou un pointeur LFS n’est pas une preuve d’absence en production.**

Le backlog relève les données déclarées, les recherches de costumes, les contrats de dessin et des chemins échantillonnés. L’[audit de combat](../../combat-fidelity-wave17-2026-11-02/completion-current.json) relève les actions effectivement résolues : zéro super générique, zéro profil d’entité sans asset et zéro ambiance d’univers non configurée. Ces mesures ne ferment ni les fiches source ni les animations manquantes.

Les **22 P0 visuels historiques** restent suivis séparément des P1 méthodologiques et des priorités des scènes/CG. La [matrice sourcée](references/priority-source-matrix.json) distingue également 183 plans d’univers prioritaires et 30 arcs ; leurs anciens labels FALLBACK ne prouvent pas que les images livrées depuis sont absentes.

Cinq demandes réelles ont été refusées par image_gen : Stitch 2002, Harley New52, Joker Endgame, Lilo 2002 et Roger 1988. Aucun PNG n’a été inventé, aucune relance ou substitution d’identité n’a contourné ces refus. Les reçus et prompts sont conservés dans [Stitch](stitch/README.md), [DC](dc-portraits/README.md) et [Lilo/Roger](lilo-roger-portraits/README.md). Les références partielles n’autorisent pas une certification des parties cachées.

## Vérifications et limites

- **31/31** tests du kit Feral final : vrais consommateurs RPG, Mêlée, Fighter des deux camps, Tactics plat/vertical, garde sans dégât/soin, tireur ordinaire conservé et initiative Naru.
- **29/29** tests finaux des nouvelles images et liaisons : fichiers/SHA, alpha/dimensions, chargement/erreur, scènes exactes, rôles du masque et refus des autres éditions.
- **234/234** vérifications de l’intégration intermédiaire, dont profils DLC complet/base/Halo/mixte et sauvegardes. Les diagnostics antérieurs et les deux défauts audio ensuite corrigés restent archivés ; leurs échecs ne sont pas réétiquetés en réussites.
- Les audits courants de combat et de complétion sont écrits puis contrôlés avec sortie 0. Les 1 909 références bitmap techniques de personnages sont remesurées ; les trois quarantaines restent explicites. Une classification technique « approved » n’est pas une approbation de ressemblance.
- [Navigateur RUN3](browser/validation-manifest.json) : trois scènes, six cas desktop/mobile, fonds distincts et chargement sans erreur. [Suivi final RUN5](browser/followup-validation-manifest.json) : deux cas Prey, douze captures inspectées, zéro erreur HTTP/page ; après 26 s et plus de 1 560 mises à jour natives par cas, aucune anomalie crossover et PV/tours/objectifs stables. Les 3 838 fichiers et huit PNG épinglés restent identiques pendant RUN5. Ce test Chromium à 390 px n’est pas une certification sur appareil mobile physique.
- **CG : 14/14 tests** d’un contrôle explicitement `metadata-only`. Le nouvel amendement conserve 604 candidats, 211 descripteurs et les **1 436 déclarations de livraison** publiées. Les anciens JSON/Markdown et fixtures restent inchangés. Les bitmaps CG historiques ne sont pas déclarés physiquement revalidés ; l’API/CLI de production continue d’exiger leurs vrais fichiers, SHA et contrôle Sharp.
- L’application complète compile en **6,55 s** avec le profil de code sans recopie de `public/`. Cette invocation directe de Vite **contourne prebuild**. Les 5 171 entrées de code/configuration restent identiques avant/après la chaîne finale.

La commande normale `npm run build -- --config scripts/viteCodeOnly.config.js` a été tentée séparément et **échoue au premier prébuild `assets:prepare`** : 9 007 sources DLC ne sont pas matérialisées dans ce checkout volontairement partiel de 32 Go. Aucun cycle normal complet ou package statique de tous les médias n’est déclaré validé le 13 novembre. Le succès complet du 9 novembre reste une preuve historique de son propre état.

Les [reçus de validation](validation/README.md) distinguent chaque commande, sortie et portée. Les corps/animations Naru/Sarii, l’apparence démasquée de Feral, les accessoires/matériaux de scène encore schématiques, le mur de trophées et les autres P0/P1 restent ouverts. Les PNG livrés sont des adaptations générées confrontées aux références visibles ; aucun gel 1:1 de l’ensemble du jeu n’est revendiqué.
