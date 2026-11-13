# Parcours navigateur — scènes source

Les fixtures montent le vrai GameCanvas et EngineTactics dans Chromium. Les clics de plateau et commandes de mission viennent du navigateur ; le broker loopback lit les médias du dépôt sans modifier la progression.

| Parcours conservé | Résultat et limite |
| --- | --- |
| RUN1 | Quatre cas passent ; deux routes Prey échouent dans le script QA qui cliquait derrière un drawer modal. Les anciens 404 du préchargement Feral sont conservés. |
| RUN2 | Six cas passent après correction du script ; l’ancien 404 de préchargement existe encore. Ce run n’est pas un gel de production final. |
| [RUN3](validation-manifest.json) | Six cas, trois ambiances distinctes, zéro erreur HTTP/page ; correction du préchargement et du fond extérieur incluses. |
| RUN4 | Deux cas de portraits/masque passent ; la [revue additive](run4-review.json) conserve la découverte réelle de l’annonce crossover après attente. |
| [RUN5 final](followup-validation-manifest.json) | Deux cas Prey, douze captures inspectées, zéro erreur HTTP/page ; portrait Naru à 24 px, Sarii à 32 px, masque porté à 24 px puis monté à 32 px, aucun masque détaché avant le vol. |

Pendant l’attente native de 26 secondes de RUN5, le moteur reçoit 1 561 mises à jour supplémentaires sur desktop et 1 562 sur mobile. Aucun texte d’anomalie crossover n’apparaît ; PV 120 → 120, tours 8 → 8 et objectifs 6 → 6. Les 3 838 fichiers source/données et huit PNG épinglés sont identiques avant/après ce parcours.

Le viewport mobile est 390 px sous Chromium, sans appareil physique. Le plateau reste réduit par la disposition existante ; ce contrôle prouve le chargement et les interactions vérifiées, pas une ergonomie mobile complète ni une ressemblance 1:1 avec le film.

Les anciens résultats et captures ne sont jamais réécrits pour effacer les défauts ensuite corrigés. Les [sources d’art et leurs limites](../scenes/README.md) restent distinctes des preuves de fonctionnement.
