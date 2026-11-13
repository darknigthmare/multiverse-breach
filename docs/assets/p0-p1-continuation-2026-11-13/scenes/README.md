# Décors de scènes source — continuation du 13 novembre 2026

Trois fonds ont été réellement générés avec `image_gen`, normalisés en PNG
opaques 960×540 et raccordés aux scènes tactiques natives. Ils remplacent la
couche d’ambiance, avec une sélection stricte par ID, scène, univers, moteur
et incarnation. Ils ne peignent ni cases, ni collisions, ni objectifs : ceux-ci
restent dans le moteur tactique. Les autres moteurs ne réutilisent pas ces cartes.

| Scène tactique | Source physique canonique | Portée vérifiée | Travail encore ouvert |
| --- | --- | --- | --- |
| 50104 — *Predator* (1987), duel de Dutch | `DLC/Predator/assets/backgrounds/source-scenes/predator-1987-riverbank-tactics-20261113.png` | Rochers humides, eau, végétation tropicale, lianes et lumière nocturne bleue du photogramme officiel | Géographie exacte, bûche suspendue, contrepoids, pieux et feu séparés |
| 50105 — *Predator 2* (1990), vaisseau du clan | `DLC/Predator/assets/backgrounds/source-scenes/predator2-1990-ship-chamber-tactics-20261113.png` | Reliefs des parois bronze/cuivre, retraits sombres, lumière ambrée et brume basse du vrai photogramme du film | Mur de trophées P0, crânes, sas, moteurs et décollage |
| 50106 — *Prey* (2022), forêt nocturne de 1719 | `DLC/Prey/assets/backgrounds/source-scenes/prey-2022-forest-duel-tactics-20261113.png` | Troncs, mousse, sol forestier, brume et lumière nocturne des deux images officielles du duel | Forme exacte du marais, profondeur, traces et couche de premier plan |

Les URL publiques restent sous `/backgrounds/source-scenes/`. La copie locale
publiée est reliée au fichier DLC, dont les octets sont l’autorité. Chaque
manifeste conserve le prompt, l’original généré, les références utilisées,
les dimensions, les empreintes et les limites de comparaison :

- [Forêt de Prey](prey-forest-manifest.json)
- [Rivière de Predator 1987](predator-jungle-manifest.json)
- [Parois du vaisseau de Predator 2](predator2-ship-manifest.json)
- [Acquisition et qualification des références](reference-acquisition-summary.json)

Le fond extérieur de l’interface emploie maintenant la même ambiance que le
Canvas de la scène. Le portrait de Sarii est branché sur sa vraie case de
compagnon : il suit Naru après le retour de la hache, sans devenir une unité
de combat. Ce portrait tête/poitrail ne constitue pas une animation de corps
entier. Le raccord du Feral masqué utilise la planche de novembre 9, puis cesse
d’afficher cette apparence quand le masque est retiré. L’apparence démasquée
reste signalée comme art à produire.

La [validation des trois fonds, RUN3](../browser/validation-manifest.json) contient six cas
réels dans Chromium : trois scènes en 1280×900 et en 390×900, huit captures
effectivement inspectées, aucun échec HTTP et aucune exception de page. Les
commandes de Prey et les déplacements passent par les boutons et le Canvas
de production ; six objectifs et huit tours conduisent au contrôle du suivi
de Sarii et du retrait du masque. Les 3 834 entrées de code/données relevées
avant et après cette validation sont identiques. Les deux premiers essais
sont conservés avec leurs échecs et leurs limites.

Le [suivi Prey final, RUN5](../browser/followup-validation-manifest.json) ajoute
le portrait de Naru dans sa vraie vignette d’initiative 24×24 et l’icône du
masque extérieur : badge porté de 24 px après le vol, puis prop monté de
32 px. Avant le vol, Feral conserve son masque ; seule une indication
d’objectif neutre apparaît, sans second masque physique au sol. Ces deux
rôles de l’icône sont exclusifs et n’ajoutent aucun tir, laser, bonus ou geste
de prise en main.

Ce suivi passe dans les deux résolutions, avec douze captures effectivement
inspectées et aucun échec HTTP ni exception de page. Après la route, chaque
cas observe 26 secondes réelles : 1 561 mises à jour natives sur desktop et
1 562 sur mobile, sans anomalie crossover, avec PV 120→120, tours 8→8 et
objectifs 6→6. Les 3 838 fichiers code/données et les huit PNG épinglés sont
inchangés pendant ce contrôle. Le [RUN4 précédent](../browser/run4-review.json)
conserve la vraie bannière crossover qui a conduit à bloquer ce scheduler
avant annonce ou effet dans les scènes source ; il n’est pas réécrit comme
un succès rétroactif.

Cette vérification couvre le chargement et le rendu dans le jeu. Elle ne
certifie pas une fidélité visuelle 1:1, une géographie cinématographique exacte
ou la clôture des tâches complètes `predator-source-04`,
`predator-source-12` et `prey-2022-08`. En 390 px, le plateau tient dans
l’écran mais reste fortement réduit ; aucune validation sur téléphone
physique ni de lisibilité native de tous ses petits textes n’est déduite.

Pour rejouer la fixture avec Node 22 et Chromium disponibles :

```sh
node --max-old-space-size=4096 scripts/buildSourceSceneArtFixture.mjs
python scripts/serveSourceSceneArtFixture.py --port 4177
python scripts/browserSourceSceneArt.py --base-url http://127.0.0.1:4177 --evidence /tmp/source-art-replay
```

Pour le suivi ciblé du masque, du portrait et de l’absence d’anomalies :
`python scripts/browserSourceSceneArt.py --stage 50106 --observe-idle-ms 26000 --evidence /tmp/prey-art-followup`.

Le serveur reste sur loopback. Dans un checkout partiel, il lit les médias
ordinaires exacts de l’index Git ; il refuse explicitement de servir un
pointeur LFS comme image. Cette compilation de fixture utilise les vrais
modules du jeu mais ne lance pas le `prebuild` de production et ne copie pas
l’ensemble des médias publics. Les quatre tests ciblés du routage, de la
projection DLC, du chargement et du repli se rejouent avec
`node --test scripts/sourceSceneArtAssets.test.mjs`.
