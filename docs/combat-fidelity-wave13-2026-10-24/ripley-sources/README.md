# Ellen Ripley — 45 états Mêlée

Ces ressources ajoutent **45 états et 180 dessins natifs distincts** à la Mêlée pour `ripley`, univers `Alien`, dans la version **Aliens (1986), avant le combat en Power Loader**. Les six atlas ont chacun quatre colonnes et huit rangées de cellules 256 × 256 ; le dernier utilise seulement cinq rangées. Les trois rangées restantes sont transparentes.

La référence [Ripley W13](ripley-identity-reference-original.png) est la copie exacte de la première nouvelle source de la partie A, envoyée à l’outil pour son apparence. Aucun de ses pixels n’est réemployé comme dessin Mêlée parmi les 180. Son propre découpage de présentation est suivi séparément. Les générations restent des adaptations originales : **la fidélité officielle 1:1 n’est pas certifiée**.

## Version, gestes et équipement

Cheveux bruns courts et bouclés, combinaison de travail gris-bleu à manches roulées, harnais sombre, baskets claires et M41A olive : aucune tenue d’un autre film, armure, casque ou Power Loader n’est ajouté. Le fusil est porté à deux mains pour les tirs déclarés et sanglé au dos ou à la hanche pour libérer les mains aux rebords. Les paumes sont nues.

Les coups proches utilisent des gestes physiques de crosse, d’avant-bras ou de pied. La garde est une posture corporelle, la charge une préparation ; les états aériens adaptent des mouvements humains ordinaires aux règles de plateforme. Les petits éclats conventionnels restent au canon du M41A, dans la pose de tir prévue. Les récupérations n’ont aucun éclat. Aucun bouclier d’énergie, faisceau, pouvoir magique, partenaire ou adversaire n’est peint dans ces planches.

## Dessins obtenus et sélection

Neuf appels `image_gen` ont réellement produit les sources. Les six premières demandes visaient huit rangées, mais chaque sortie en possédait sept : ce manque est conservé dans les reçus et la sélection. Trois sources correctives à quatre rangées apportent les neuf états manquants ou rejetés. Les sources originales et leurs erreurs restent archivées.

| Source | Corps candidats segmentés | Corps complets observés | Poses retenues |
| --- | ---: | ---: | ---: |
| `ripley-motion-a` | 28 | 28 | 28 |
| `ripley-motion-b` | 28 | 28 | 28 |
| `ripley-defense` | 28 | 28 | 28 |
| `ripley-combat-a` | 28 | 24 | 24 |
| `ripley-combat-b` | 28 | 28 | 24 |
| `ripley-ledge` | 28 | 19 | 12 |
| `ripley-corrective-movement` | 16 | 16 | 12 |
| `ripley-corrective-combat` | 16 | 16 | 16 |
| `ripley-corrective-ledge` | 16 | 16 | 8 |
| **Total** | **216** | **203** | **180** |

Les 36 corps candidats non retenus comprennent 13 dessins incomplets et 23 dessins complets réservés ou rejetés. Les quatre récupérations initiales de `combat-a` touchent le bas du canevas ; la première montée comporte une silhouette incomplète ; les deux études de bas de page n’ont pas de jambes complètes. Le dernier groupe initial de `combat-b` montre une visée basse, incompatible avec l’attaque physique de rebord retenue. Ces dessins ne sont jamais réparés, agrandis ou comptés comme états livrés.

[Sélection et revue des 45 états](source-row-review.json) · [Plan de packing](packing-plan.json) · [Appels réels](actual-tool-calls.json).

## Normalisation et contacts

Le pipeline isole les corps par alpha, garde les pixels natifs appartenant à chaque silhouette, applique **une seule échelle corporelle par source**, puis place les vrais dessins dans leurs cellules. Neuf calibrations debout mesurent la couronne des cheveux jusqu’aux semelles, sans compter les mains levées ou le fusil. La taille corporelle effective de référence est 190 pixels. Les silhouettes accroupies, suspendues et couchées gardent leur hauteur projetée ; aucune rangée n’est étirée pour remplir la cellule.

Les **180 empreintes de corps natifs et les 180 cellules RGBA livrées sont distinctes**. Les dessins retenus ne touchent aucun bord de leur source ; les dessins exclus qui touchent le canevas restent signalés dans la provenance. La marge des cellules publiques est au moins de dix pixels, avec ligne de base 244.

Les points de [paume et poignet natifs](native-hand-points.json) ont été repérés visuellement, puis transformés exactement par le packing dans [hand-measurements.json](hand-measurements.json). Douze paumes et douze poignets disposent chacun d’au moins 60 pixels visibles dans leur voisinage de 9 × 9, dans la source et l’atlas. La première pose d’approche n’a pas encore de contact ; les onze autres contacts de prise, maintien et montée sont déclarés. La [planche de ROIs](native-hand-roi-review.png) est une annotation de vérification, exclue des dessins du jeu.

La montée corrective change réellement la position du torse par rapport à la paume : suspendue sous la main, poitrine remontée, torse au-dessus de la main, puis appui bas en position accroupie. Le rendu utilise ces vrais points pour attacher les deux orientations au rebord, sans déplacer la physique de l’acteur. Le camp opposé applique un miroir horizontal, qui inverse aussi les asymétries de la tenue ; il ne constitue pas un nouveau dessin natif.

## Reproduire les contrôles

Depuis la racine du dépôt :

```sh
node docs/combat-fidelity-wave13-2026-10-24/ripley-sources/normalize-ripley-atlases.mjs --check
node docs/combat-fidelity-wave13-2026-10-24/ripley-sources/measure-ripley-native-hands.mjs --check
node docs/combat-fidelity-wave13-2026-10-24/ripley-sources/verify-ripley-atlases.mjs --check
```

Sans `--check`, le premier reconstruit les six PNG et deux registres depuis les seules sources archivées ; le second reconstruit les mesures. Le vérificateur contrôle les 45 états, les 180 poses et cellules réelles, les quatre colonnes du sampler, les neuf calibrations, les contacts et la conservation exacte des **13 manifestes précédents et de leurs 78 planches**. Son résultat observé est dans [verify-all-result.json](verify-all-result.json).

Les scripts `prepare-*` sont les archives de préparation des demandes et des choix avant revue ; ils ne sont pas nécessaires à la reconstruction des ressources validées.

## Vérification du jeu

Le moteur conserve désormais les poses de `ledgeDrop` et `ledgeJump` pendant leur durée déclarée (quatre poses à 8 images par seconde, soit 0,5 seconde pour Ripley). La gravité et les déplacements continuent pendant cette séquence ; atterrissage, coup reçu, reprise légale du rebord et nouvelle commande explicite restent prioritaires. Le test [meleeLedgeStateTiming.test.mjs](../../../scripts/meleeLedgeStateTiming.test.mjs) vérifie les deux camps et les deux côtés, le contrôle aérien, les collisions et le compagnon inactif. Le groupe `npm run test:melee` est passé à 43 essais réussis.

Les essais de renderer, clavier et rebords physiques dans Chromium seront exécutés sur les ressources intégrées après le gel du lot W13. Un contrôle de fichiers ou de sampler ne remplace pas un parcours GameCanvas ; aucun résultat de navigateur final n’est anticipé ici.

Le [runner Chromium](browser/run-ripley-browser-checks.mjs) lance exactement quatre processus et attend leurs événements réels de fermeture. Chaque harnais attend aussi `browser.close()`, vérifie la déconnexion de Chromium et la disparition des contextes, puis mesure à nouveau les 63 entrées. Les rapports, captures, traces, journaux et reçus de fermeture sont liés par SHA dans `browser/ripley-evidence.json`. Le [collecteur](browser/collect-ripley-evidence.mjs) refuse un résultat préliminaire, un fichier absent du gel, une commande différente ou une chronologie incompatible ; son option `--check` refait ces contrôles sans relancer le jeu.
