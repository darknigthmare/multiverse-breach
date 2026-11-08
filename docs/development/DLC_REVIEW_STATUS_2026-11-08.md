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
