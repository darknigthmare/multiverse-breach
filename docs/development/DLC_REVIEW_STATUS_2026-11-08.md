# Séparation DLC : vérification des points ouverts — 8 novembre 2026

## Résultat de cette reprise

La lecture du code d’export et de delta, des guides actuels et de la discussion
de la [PR 27](https://github.com/darknigthmare/multiverse-breach/pull/27) ne fournit
pas de défaut DLC supplémentaire justifiant une nouvelle modification runtime.
Les **54 tests d’export et de delta ont été rejoués avec succès sous Node
22.23.4**. Ce constat est limité aux contrats et éléments consultés ; il ne vaut
pas une nouvelle approbation de toute la distribution ou une revue de sécurité.

Les critères vérifiés restent ceux du
[lot CLI différentiel](DLC_DIFFERENTIAL_CLI_2026-11-07.md) : révision source
explicite, inspection sans écriture, intégrité des blobs et du reçu cible,
reconstruction dans un dossier neuf, retour base → Halo → base, conservation
des éditions existantes et refus des sources modifiées.

```sh
node --test scripts/dlcDistributionDelta.test.mjs \
  scripts/dlcDistributionExport.test.mjs
```

Ces tests utilisent les vrais exporteurs/auditeurs avec de petites sources et
ressources de fixture. Ils ne reconstruisent pas les médias complets de
production et ne constituent pas des parcours navigateur supplémentaires.

## État réel des revues de PR

Les API de commentaires inline et de revues soumises renvoient chacune une
liste vide pour la PR 27 au moment de cette vérification. La discussion contient
des états de bots, pas un correctif DLC détaillé à appliquer :

- [CodeRabbit a ignoré la revue](https://github.com/darknigthmare/multiverse-breach/pull/27#issuecomment-6713238199)
  parce que la branche cible n’est pas la branche par défaut.
- Le [résumé Codex est en échec](https://github.com/darknigthmare/multiverse-breach/pull/27#issuecomment-6715138388)
  pour la révision `4ca3b2b`. Le
  [message associé annonce un quota de revues épuisé](https://github.com/darknigthmare/multiverse-breach/pull/27#issuecomment-6715138790).

L’absence de commentaires inline ne doit donc pas être présentée comme une
revue automatique approuvée. Aucune nouvelle demande de revue ni aucun message
aux bots n’a été envoyé par cette vérification.

## Anciennes limites et périmètre actuel

Les documents des premières étapes conservent leurs constats historiques.
L’installation facultative au niveau de la distribution est traitée par les
[profils](DLC_INSTALLATION_PROFILES_2026-11-07.md), puis le transfert différentiel
par les [paquets](DLC_DIFFERENTIAL_FIELD_VARIANTS_2026-11-07.md) et leur
[CLI](DLC_DIFFERENTIAL_CLI_2026-11-07.md). Le guide canonique reste
[`DLC/README.md`](../../DLC/README.md).

La politique commune `preserve-all` reste le défaut volontaire. La sélection
`reviewed-dependencies` utilise uniquement les dépendances partagées examinées ;
elle ne justifie pas une purge heuristique des ressources sans preuve.

Le [nouvel inventaire des dépendances communes](dlc-shared-dependency-proof-2026-11-08-characters.json)
est régénéré pour les sources de ce lot Cité, personnages et portails. Il
conserve les 14 décors examinés et leurs 38 packs consommateurs. Le reçu du
7 novembre reste intact ; ce rapport de sources ne constitue ni un build
complet ni une nouvelle recette visuelle des médias.

Une nouvelle édition doit toujours être auditée, construite puis vérifiée en
navigateur. Un rapport `inspect` n’accomplit pas ces étapes. Le téléchargement
de code en cours de partie et l’authentification d’une infrastructure de
distribution sont des chantiers distincts, sans prétention de livraison dans
cette reprise. L’économie et les sauvegardes existantes ne sont pas modifiées
par cet audit.

## Reprise après `07fa2e75`

Le [workflow différentiel de cette révision](https://github.com/darknigthmare/multiverse-breach/actions/runs/42474860317)
a terminé en échec, mais ses étapes d’exports, de profils, de menus, de galerie,
d’album et de décors partagés ont réussi. Ses quatre échecs portent sur les
deux replays de relais contestés et les deux retours Cité → FPS → Cité. Le
[workflow des protocoles Nexus](https://github.com/darknigthmare/multiverse-breach/actions/runs/42474860448)
rencontre le même défaut de mesure avant de poursuivre ses huit parcours FPS.

Le lecteur de texte de `browserCityFpsOperations.py` parcourait les deux
libellés responsive de LOOT. Le libellé affiché avait une géométrie valide ;
celui conservé dans un `span` en `display:none` n’avait logiquement aucune
boîte. La sonde interprétait cette alternative volontairement non peinte
comme un texte tronqué. Ce diagnostic ne démontre pas que les parcours
interrompus auraient tous réussi après ce point.

La mesure partagée dans `hudTextProof.py` relève maintenant séparément les
fragments exclus par `display:none`, avec leur raison et leur ancêtre. Les
fragments peints gardent les contrôles de débordement et de clip de tous leurs
ancêtres. Un bouton sans libellé peint échoue toujours, comme un texte masqué
par opacité/visibilité, hors de ses limites ou tronqué par une ellipse. Les
contrôles du nombre de commandes, du hit-test, des cibles de 44 px, du radar,
du viseur et des replays ne sont pas assouplis. Aucun comportement du jeu ou
de distribution n’est modifié par cette correction de sonde.

`browserHudTextVisibility.py` ajoute 16 cas natifs : huit situations sur
ordinateur et en paysage court, avec les vraies règles CSS complet/compact.
Cette recette est exécutée dans le workflow différentiel avant les parcours
réels et conserve un reçu ainsi que deux captures. Elle porte uniquement sur
la fiabilité de la mesure ; les parcours intégrés restent nécessaires.

La suite `npm run test:dlc:profiles` a été rejouée sous **Node 22.23.4** :
**178 tests réussis, aucun échec**. Elle comprend les vrais imports des profils
complet/base/Halo/mixte, la fermeture des décors examinés, les contrats de Cité
avec packs physiquement absents, les sauvegardes dormantes et les exports et
deltas. Les quatre graphes App/Hub relèvent respectivement 1 765, 0, 20 et 22
modules de packs ; ces nombres décrivent le graphe SSR, pas le poids distribué.

La syntaxe Python et le JavaScript de la sonde ont été vérifiés localement.
Le lancement explicite de Chromium est bloqué dans cet environnement par
`socket() failed: Operation not permitted` ; les 16 cas natifs et les replays
corrigés doivent donc être confirmés par la CI du prochain commit. Les
résultats de `07fa2e75` ne constituent pas la preuve de cette correction.
