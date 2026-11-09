# Dépendances des décors partagés — 7 novembre 2026

Suite de la PR #27 et de [ses paquets différentiels](DLC_DIFFERENTIAL_FIELD_VARIANTS_2026-11-07.md).
Cette étape ferme l’enquête sur les quatorze décors signalés par le précédent
rapport de couverture. Chaque décor est utilisé par plusieurs univers : sa
source reste commune, et son inclusion suit désormais une dépendance explicite.

## Critères et résultat

- Une édition qui ne contient aucun consommateur peut omettre le décor concerné.
- Un seul consommateur installé suffit à conserver exactement le même fichier,
  à la même URL. Le pack nommé dans le fichier n’est pas imposé aux autres.
- L’introduction et la création du profil gardent leurs décors Halo et Stargate.
- Les profils existants et leurs reçus conservent `preserve-all`. La nouvelle
  politique `reviewed-dependencies` est un choix explicite du producteur.
- Une référence commune, un registre généré, une nouvelle construction d’URL ou
  une dépendance sélectionnée non couverte empêche l’export.

Les profils `config/dlc-profiles/base-reviewed.json` et
`config/dlc-profiles/halo-reviewed.json` omettent **14 fichiers**, représentant
**38 474 464 octets** de médias canoniques, soit environ 36,69 Mio par édition.
Ils gardent **5 963** médias partagés, représentant **7 128 846 455 octets**.
Halo ajoute ses **201** médias propres, pour **6 164** médias publiés au total.
Les profils historiques gardent leurs 5 977 médias partagés.

Le [rapport de preuve](dlc-shared-dependency-proof-2026-11-07.json) liste chaque
image, son empreinte SHA-256, ses consommateurs, les résolveurs vérifiés et les
volumes observés. Il ne transforme pas les 5 963 autres médias en candidats à
supprimer. La majorité du fonds commun est encore préservée.

## Contrat de dépendance

`DLC/shared-asset-dependencies.json` associe chaque URL à sa famille de résolution
et à tous ses IDs de packs consommateurs. Les sources restent sous `public/`,
car elles sont réellement partagées entre deux à six univers. Les manifestes
propres aux univers conservent leurs `sharedDependencies` existantes.

Le producteur vérifie la famille `openai-backdrop` avant tout retrait :

1. Lecture syntaxique du registre réel `OPENAI_BACKDROPS`, des imports et des
   fonctions DLC qui renvoient ces URL. Le pack déclaré doit être celui du
   consommateur et sa fonction doit renvoyer une chaîne statique.
2. Comparaison exacte des consommateurs présents avec les IDs déclarés. Les
   identités complètes demeurent disponibles même dans une édition réduite.
3. Vérification des empreintes des règles de repli, de l’extension du registre,
   du chargeur de décors générés et du constructeur de chemins `lore-stages`.
4. Contrôle des références dans les sources, styles, registres JSON et données
   publiques. Les URL encodées et les concaténations constantes sont reconnues.
   Une construction dynamique supplémentaire sous `/backgrounds/` exige une
   nouvelle revue ; une simple absence de référence littérale ne suffit pas.

La preuve porte sur ces producteurs de chemins du jeu courant. Elle n’est pas
un analyseur général de tout programme JavaScript ni une sandbox pour du code
source hostile. Les changements des résolveurs refusent l’optimisation jusqu’à
revue. La politique historique reste disponible indépendamment de cette revue.

Les reçus attestent également le manifeste de dépendances. L’audit relit les
sources transformées de l’édition, reconstruit les dépendances et refuse les
images requises manquantes comme les images exclues réintroduites. Les paquets
différentiels peuvent passer entre les deux politiques ; leur application
reconstruit toujours un nouveau dossier vérifié et préserve l’installation
précédente.

## Commandes

```sh
node scripts/dlcSharedAssetDependencyReport.mjs \
  --out docs/development/dlc-shared-dependency-proof-2026-11-07.json

npm run dlc:export -- \
  --profile config/dlc-profiles/base-reviewed.json \
  --out /chemin/neuf/multiverse-base

npm run dlc:export -- \
  --profile config/dlc-profiles/halo-reviewed.json \
  --out /chemin/neuf/multiverse-halo
```

Pour créer ensuite un delta, utiliser des exports possédant le même
`sourceRevision` complet, comme décrit dans le guide de la PR #27. Les reçus des
exports sans révision explicite ne sont pas acceptés comme bases de delta.

## Vérifications exécutées et périmètre

`dlcDistributionSharedDependencies.test.mjs` couvre 27 cas : profils, export et
audit stricts, références communes/encodées/dynamiques refusées, consommateurs
manquants, médias requis ou supplémentaires, et bascules différentielles entre
base historique, base réduite, Alien, Aliens, Halo et catalogue complet. Le
passage Alien → Aliens vérifie la réutilisation du même décor partagé.

`dlcProfileSharedBackdrops.test.mjs` charge le **vrai renderer transformé par
Vite**. Il vérifie le catalogue complet, la base, Halo et les 38 consommateurs
des quatorze décors. Les choix d’images des univers installés sont identiques au
catalogue complet dans les six modes/alias examinés : RPG, Tactics, Smash,
Combat, Fighter et Melee. Il contrôle respectivement 3 162, 132, 138 et 360
couples univers-mode. Les 32 tests de ces deux suites sont passés localement,
ainsi que les 95 régressions antérieures de distribution/export/delta/installation.
Ces chiffres se recoupent avec la suite globale des profils et ne s’additionnent
pas à son total.

Les 47 tests de préparation des assets passent également sous Node 22.23.4,
y compris la publication depuis un checkout minimal avant `npm ci`. Le
vérificateur syntaxique est chargé à la demande : la préparation historique
`preserve-all` ne dépend pas de l’installation préalable du parser Vite.

Une recette navigateur complémentaire compile le vrai renderer et sert les
médias réels uniquement depuis le plan de l’édition sélectionnée :

```sh
DLC_BACKDROP_PROFILE=base node scripts/buildDlcSharedBackdropsFixture.mjs
DLC_BACKDROP_PROFILE=base node scripts/browserDlcSharedBackdrops.mjs
# Rejouer avec halo, puis consumers.
```

La recette vérifie le décodage, les appels effectifs à `drawImage`, la présence
du décor requis et l’absence de ressource manquante. Les trois bundles ont été
compilés localement. La tentative Chromium locale a été bloquée avant
l’ouverture de la page par `socket() failed: Operation not permitted` ; aucun
succès navigateur local n’est déduit de cette compilation. Les workflows de la
PR produisent les preuves navigateur sur leur propre commit. Le test des
distributions complètes Base/Halo reste distinct de cette fixture de rendu.

## Étendre le mécanisme

Pour un autre décor utilisant le même contrat, ajouter une entrée triée au
manifeste avec tous les IDs consommateurs, puis exécuter la preuve et les
profils. Une nouvelle famille de ressources doit apporter son propre
vérificateur de producteurs et de résolveurs avant d’être reconnue par le
manifeste. Les ressources sans preuve restent conservées ; aucune heuristique
fondée sur leur seul nom ne décide de leur retrait.

Cette étape ne charge aucun code DLC à chaud, ne modifie aucun octet d’image,
aucune sauvegarde ni aucun identifiant de contenu. Elle ne valide pas la
fidélité artistique de tous les décors ni les périphériques physiques.
