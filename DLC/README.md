# Univers et profils DLC

Chaque univers optionnel possède maintenant son dossier `DLC/NomDeLUnivers/`.
Les définitions éditoriales sont dans ces dossiers : personnages, adversaires,
équipements, descriptions, missions, profils de scène, musique, costumes et règles
spécifiques disponibles pour l'univers. Les catalogues dans `src/game/` assemblent
ces définitions avec les règles communes et conservent leurs API publiques.

Le registre comprend les 504 univers déjà considérés comme DLC par le jeu.
`CloudMeadow` contient les ressources de personnages déjà présentes dans le projet
avec le statut `artwork-only` ; ce rangement ne lui ajoute ni portail ni campagne.
Le Nexus de Convergence et les vingt univers de la campagne originale restent
dans le jeu de base. Les règles de croisement entre plusieurs univers, le moteur,
les sauvegardes et les services communs restent dans `src/`.

## Structure d'un univers

| Chemin | Rôle |
| --- | --- |
| `DLC/Halo/manifest.json` | Identité stable, ordre du catalogue, statut d'enregistrement et liste des modules. |
| `DLC/Halo/data/` | Définitions de cet univers, regroupées selon leur catalogue d'origine. |
| `DLC/Halo/runtime/` | Comportements propres à cet univers, lorsqu'il en possède ; par exemple la rencontre avec le Scarab. |
| `DLC/Halo/assets/` | Fichiers sources propres à cet univers : images, sprites, CG, boosters et ressources associées. |
| `DLC/Halo/assets.json` | Inventaire des fichiers graphiques et autres ressources rattachés à cet univers, avec leur source et leur URL existantes. |
| `DLC/Halo/index.js` | Point d'entrée généré, exposant le manifeste et les modules du dossier. |
| `DLC/index.js` | Registre complet généré, indépendant de la présence des dossiers dans un export. |
| `DLC/distribution.json` | Profil installé : tous les packs, base seule ou sélection exacte. |
| `DLC/content-identities.json` | Identifiants historiques des héros, missions et arcs ; conservés dans tous les profils. |
| `DLC/shared-assets.json` | Ressources de base, de campagne, communes à plusieurs univers ou sans attribution suffisamment établie. |
| `DLC/shared-asset-dependencies.json` | Dépendances explicites des ressources partagées dont l'inclusion conditionnelle a été vérifiée. |

Les noms des dossiers utilisent des lettres et chiffres sans espace ni accent,
par exemple `DLC/GearsOfWar/` et `DLC/HalfLife/`. La propriété `universe` du
manifeste conserve la clé exacte utilisée par le jeu (`Gears of War`, `Half-Life`).
Renommer un dossier ne doit jamais renommer un identifiant de personnage, de
mission, d'univers ou une clé de sauvegarde.

## Fonctionnement et compatibilité

Les anciens imports restent valides. Par exemple `src/game/heroes.js` importe les
définitions de `DLC/Halo/data/heroes.js`, leur applique les mêmes constructeurs
communs et expose toujours `HEROES_DB`. Les constructeurs des dossiers DLC
reçoivent explicitement leurs fonctions et constantes communes en paramètres.
Ils n'importent pas le catalogue qui les agrège, ce qui évite les dépendances
circulaires et garde les mêmes règles de normalisation.

Les rencontres entièrement spécifiques, comme le Scarab ou le Nihilanth, vivent
dans `runtime/`. Leur ancien fichier dans `src/game/` réexporte le module déplacé.
Les identifiants, l'ordre des entrées, les valeurs de gameplay, les traductions,
les chemins publics et les conditions de déverrouillage restent identiques.

`getDlcUniverseKeys()` utilise désormais le registre des manifestes. Le champ
`catalogOrder` conserve l'ordre historique. `registration: "runtime"` inscrit
l'univers dans ce catalogue ; `registration: "artwork-only"` conserve un dossier
de ressources hors du catalogue jouable. Aucun de ces statuts n'active un achat,
un téléchargement ou un déverrouillage dans une sauvegarde.

## Ressources graphiques

Les 8 186 ressources attribuées à un seul dossier vivent physiquement sous
`DLC/NomDeLUnivers/assets/`. Leur chemin après `assets/` conserve celui de leur
ancienne URL publique. Par exemple, une image servie à `/boosters/halo.webp`
a pour source `DLC/Halo/assets/boosters/halo.webp`. Les 5 977 ressources de base,
de campagne, communes ou sans attribution certaine restent dans `public/`.

Chaque `assets.json` indique `sourcePath`, `publicPath` et la justification du
rattachement. Une affiliation par nom de dossier ne démontre pas un usage
exclusif. Les ressources identifiées dans plusieurs univers restent dans
`shared-assets.json` et figurent dans les dépendances des dossiers concernés.
Les alias historiques ambigus restent sans attribution forcée.

`npm run assets:prepare` copie les sources DLC vers les destinations publiques
historiques, avec contrôle des octets. `npm run dev` et `npm run build` lancent
automatiquement cette préparation. Les copies sont des fichiers ordinaires ;
elles sont exclues de Git et des sources téléversées vers Vercel. Les sources
canoniques dans `DLC/` restent incluses. Les blocs d'exclusion sont générés en
même temps que les inventaires, et le contrôle refuse des blocs périmés.

La préparation complète refuse une source absente, un pointeur LFS non hydraté,
un lien symbolique et une collision avec un fichier local différent. Elle ne
remplace ou ne retire une ancienne copie gérée que si celle-ci n'a pas été
modifiée. Son état de publication est conservé dans `.tmp/`. Après modification
d'une source, relancer la préparation ou redémarrer `npm run dev` pour actualiser
sa copie publique.

Si une ressource devient commune, déplacer sa source dans `public/` et
actualiser les inventaires : la préparation conserve cette source et cesse de
la gérer comme une copie générée. Elle refuse les déclarations concurrentes
d'un fichier public et d'une source DLC pour la même URL.

`npm run assets:prepare:available` sert uniquement aux copies partielles de
développement et aux workflows qui testent du code avec des fixtures. Cette
commande annonce explicitement les ressources absentes et ne constitue pas
une validation de build complet. Le prébuild de production utilise toujours
la préparation stricte.

Dans un dépôt, l'inventaire lit les chemins de l'index Git et les références
statiques du code. Il fonctionne donc dans une copie partielle sans télécharger
les images. Dans un export sans métadonnées Git utilisables, il parcourt les
fichiers réellement présents dans `public/` et `DLC/*/assets/`, en dédupliquant
les copies publiques générées au profit de leurs sources DLC. Il vérifie qu'ils
correspondent aux inventaires enregistrés. Un fichier source omis ou ajouté
rend le contrôle obsolète et provoque un échec. Un dépôt parent ne fournit jamais
l'index d'un projet exporté.
Le diagnostic `inputSource` distingue `git-index` et `public-tree`.

L'inventaire seul ne valide ni les octets, ni l'hydratation LFS, ni la qualité ou
la provenance d'une image. La préparation vérifie les fichiers à publier et les
audits de ressources existants continuent de remplir leurs rôles. Les audits de
sources à téléverser exigent les fichiers canoniques sous `DLC/`, même lorsqu'une
copie publique existe déjà.

## Modifier ou ajouter un univers

1. Modifier les définitions dans `DLC/NomDeLUnivers/data/` ou `runtime/`.
2. Pour un nouveau module, l'ajouter à `manifest.json` avec son chemin relatif
   et son `runtimeAdapter` dans `src/game/`. Raccorder ce module au catalogue
   commun correspondant ; le registre de métadonnées n'instancie pas de contenu.
3. Pour un nouvel univers, choisir un dossier unique sans collision de casse,
   une identité et une clé d'univers uniques, puis un `catalogOrder` disponible.
   Ajouter les données de lore et les raccordements nécessaires au gameplay.
4. Placer une ressource propre à l'univers sous `DLC/NomDeLUnivers/assets/` avec
   le chemin relatif de son URL publique. Les installateurs utilisent
   `scripts/assetSourceResolver.mjs` pour retrouver la source d'une URL connue
   ou le dossier d'un univers exact. Une ressource partagée reste dans `public/`.
   Ajouter les sources à l'index Git avant de régénérer leur inventaire ; les
   fichiers non suivis ne sont pas inclus. Ne pas modifier les copies générées
   dans `public/`.
5. Régénérer puis vérifier :

```sh
npm run dlc:registry:write
npm run dlc:identities:write
npm run dlc:assets:write
npm run assets:prepare
npm run test:dlc
```

Les contrôles refusent les doublons, les chemins qui sortent d'un dossier, les
modules manquants ou non déclarés et les points d'entrée périmés. La couverture
du registre doit correspondre aux univers de lore hors jeu de base, dans le même
ordre. `prebuild` exécute aussi ces vérifications ; les autres contrôles du
projet restent en place.

## Vérifier la migration initiale

`npm run dlc:verify:migration` compare les exports des catalogues avec les
empreintes capturées avant réorganisation, au commit
`3036cd021edfe544534a09df5c401eb024808b39`. Le reçu est conservé dans
`docs/development/dlc-migration-baseline-2026-11-06.json`.

Cette comparaison préserve l'ordre des données sérialisées et contrôle également
les niveaux dérivés, l'ordre des DLC et la liste des univers masqués par défaut.
Elle ne remplace pas les tests d'exécution des fonctions. Elle reste volontaire :
un ajout de contenu ultérieur doit pouvoir changer les données sans être bloqué
par une empreinte historique. Pour les développements suivants, utiliser
`test:dlc` et les suites de gameplay habituelles.

`npm run dlc:verify:assets` vérifie séparément le reçu de déplacement du
7 novembre 2026 : 8 187 chemins, modes et identifiants de blobs Git conservés,
438 attributions LFS maintenues et aucune ancienne source encore suivie dans
`public/`. Le reçu est
`docs/development/dlc-assets-migration-2026-11-07.json`. Ce contrôle historique
est volontaire : une évolution ultérieure des illustrations peut légitimement
changer leurs octets. Il ne prouve pas l'hydratation des objets LFS ni une
nouvelle inspection visuelle des images.

## Profils de distribution

Le dépôt canonique garde le profil `all`. Son `npm run build` conserve tous les
audits de production existants. L'exporteur assemble une nouvelle arborescence
autonome pour le profil demandé, sans modifier ce dépôt.

Cinq exemples sont fournis dans `config/dlc-profiles/` : `all.json`,
`base.json`, `halo.json`, `base-reviewed.json` et `halo-reviewed.json`.
Une sélection utilise les IDs exacts des manifestes :

```json
{
  "schemaVersion": 1,
  "mode": "selected",
  "packIds": ["halo"],
  "sharedPolicy": "preserve-all"
}
```

Les modes `all` et `base` exigent une liste `packIds` vide. Une sélection exige
au moins un ID connu, sans doublon. L'ordre de sortie suit `catalogOrder`.
La politique historique `preserve-all` conserve toutes les ressources communes.
Les profils `*-reviewed` choisissent explicitement `reviewed-dependencies` :
seules les ressources possédant une preuve de dépendances peuvent être omises.

### Créer et construire une distribution

Depuis le dépôt canonique :

```sh
npm run dlc:export -- --profile config/dlc-profiles/base.json --out /tmp/multiverse-base
cd /tmp/multiverse-base
npm ci --no-audit --no-fund
npm run build:distribution
npx vite preview
```

Pour Halo, utiliser `config/dlc-profiles/halo.json` et un nouveau dossier de
sortie. L'export refuse d'écraser un dossier existant. Il n'est publié qu'après
vérification de son contenu dans un dossier temporaire voisin.

L'export contient uniquement les dossiers DLC sélectionnés, leurs sources et
leurs ressources, avec les catalogues communs adaptés. La transformation
syntaxique retire les contributions des packs absents et refuse un usage
qu'elle ne reconnaît pas. Les adaptateurs facultatifs conservent un contrat
explicite d'indisponibilité. Le registre léger et les identités historiques
restent complets pour décrire les contenus absents et préserver les sauvegardes.

`build:distribution` vérifie le reçu `DLC/distribution-receipt.json`, les
empreintes des sources et médias, la fermeture des imports puis le contenu du
bundle. Ce cycle est propre à l'export ; le prébuild du dépôt canonique continue
de valider le jeu complet. La CI exerce séparément les profils base et Halo,
historiques et allégés, avec leurs vrais fichiers et un parcours navigateur.

Les profils historiques conservent les 5 977 ressources communes ou sans
attribution certaine, soit environ 7,17 Go dans la référence actuelle.
Les profils base-reviewed et halo-reviewed omettent quatorze décors, représentant
38 474 464 octets, après vérification de leurs 38 packs consommateurs. Un seul
consommateur sélectionné suffit à conserver le même fichier. Le reste du fonds
commun est préservé et les URL historiques restent identiques. Voir le
[contrat de dépendances](../docs/development/DLC_SHARED_ASSET_DEPENDENCIES_2026-11-07.md).

La [suite du 7 novembre](../docs/development/DLC_UI_CITY_FPS_COMPLETION_2026-11-07.md)
ferme la dépendance de création du profil vers le décor Stargate : ce fichier est
désormais commun, avec ses octets conservés. Les références statiques de l’UI
sont vérifiées avant export. Un rapport reproductible documente les usages des
ressources partagées et les résolutions dynamiques encore à établir.

### Préparer, inspecter et appliquer un changement d'édition

Un export simple, sans révision déclarée, reste valable pour construire une
édition autonome avec les commandes ci-dessus. Pour préparer un paquet
différentiel, produire les deux exports depuis les mêmes sources figées et
passer explicitement leur SHA Git complet. La valeur est enregistrée dans les
reçus ; elle ne déduit pas la révision de fichiers modifiés et ne constitue pas
une signature de l'éditeur.

Depuis le checkout correspondant à la révision à distribuer :

```sh
DLC_SOURCE_REVISION=$(git rev-parse HEAD)
npm run dlc:export -- --profile config/dlc-profiles/base-reviewed.json \
  --out ../edition-base --source-revision "$DLC_SOURCE_REVISION"
npm run dlc:export -- --profile config/dlc-profiles/halo-reviewed.json \
  --out ../edition-halo --source-revision "$DLC_SOURCE_REVISION"

node scripts/dlcDistributionDelta.mjs create \
  --base ../edition-base --target ../edition-halo --out ../delta-halo
```

La création fournit `manifestSha256`. Utiliser l'empreinte obtenue du producteur
par un canal fiable pour `SHA256_FIABLE` dans les deux commandes suivantes :

```sh
node scripts/dlcDistributionDelta.mjs inspect \
  --base ../edition-base --delta ../delta-halo --sha256 SHA256_FIABLE
node scripts/dlcDistributionDelta.mjs apply \
  --base ../edition-base --delta ../delta-halo \
  --out ../edition-halo-reconstruite --sha256 SHA256_FIABLE

npm ci --prefix ../edition-halo-reconstruite --no-audit --no-fund
npm run build:distribution --prefix ../edition-halo-reconstruite
```

`inspect` n'écrit aucun fichier. Il audite la base, vérifie l'empreinte et la
composition du paquet, lit chaque blob pour contrôler ses octets, valide le
reçu cible et sa concordance avec la liste de fichiers et le profil. Son statut
`inputs-verified` concerne ces entrées. Le rapport nomme aussi les contrôles
restants : audit strict de l'arbre reconstruit, compilation et parcours
navigateur/sauvegardes. `apply` refait la vérification des entrées, reconstruit
un nouveau dossier et exécute l'audit strict avant de le publier.

Le rapport distingue les tailles suivantes :

| Champ | Signification |
| --- | --- |
| `transfer.payloadBytes` | Octets non compressés des blobs uniques à transférer. Deux fichiers de sortie identiques peuvent réutiliser le même blob. |
| `transfer.packageBytes` | Blobs et manifeste du paquet, sans compression. |
| `reconstruction.fileContentBytes` | Octets de tous les fichiers du nouveau dossier source, y compris ses copies publiques et son reçu. |
| `reconstruction.reusedBytes` | Octets repris depuis la base ; ils sont recopiés dans le nouveau dossier. |

La taille des fichiers reconstruits exclut les blocs et métadonnées du système
de fichiers, ainsi que les futurs `node_modules/` et `dist/`. La base reste
présente : économiser le transfert n'économise pas tout cet espace disque.

Pour retirer Halo, créer un paquet dans le sens inverse vers l'export de base
conservé, puis inspecter et appliquer ce paquet avec sa propre empreinte :

```sh
node scripts/dlcDistributionDelta.mjs create \
  --base ../edition-halo-reconstruite --target ../edition-base --out ../delta-retour-base
node scripts/dlcDistributionDelta.mjs inspect \
  --base ../edition-halo-reconstruite --delta ../delta-retour-base --sha256 SHA256_RETOUR_FIABLE
node scripts/dlcDistributionDelta.mjs apply \
  --base ../edition-halo-reconstruite --delta ../delta-retour-base \
  --out ../edition-base-restauree --sha256 SHA256_RETOUR_FIABLE
```

Les dossiers existants sont conservés, y compris en cas d'échec. Un export
historique sans `sourceRevision` se reproduit depuis ses sources avec l'option
explicite avant de participer à un delta. Après chaque reconstruction, compiler
et vérifier la nouvelle édition avant publication. Les commandes
`node scripts/exportDlcDistribution.mjs --help` et
`node scripts/dlcDistributionDelta.mjs --help` rappellent ce parcours.
Voir la [validation de la chaîne CLI](../docs/development/DLC_DIFFERENTIAL_CLI_2026-11-07.md).

### Sauvegardes et menu

L'installation appartient à la distribution. Le masquage appartient à la
préférence du joueur. Une commande « tout afficher » agit sur les univers
installés ; les préférences des autres packs restent conservées. Les contenus
absents sont indiqués « NON INCLUS ».

L'équipe sauvegardée conserve les héros temporairement indisponibles. Le jeu
en calcule une équipe jouable distincte ; ouvrir le Hub ou sauvegarder ne
remplace pas la sélection conservée. Une modification explicite de composition
remplace cette sélection, comme l'indique le menu. Inventaire, progression OC,
missions terminées et préférences restent disponibles après réinstallation.

Les numéros historiques ne dépendent plus de la position d'un univers dans
une liste réduite. `dlc:identities:write` doit être exécuté depuis le catalogue
complet lors d'un ajout de contenu ; les anciennes identités restent réservées.

Cette étape sélectionne les packs à la construction et à la distribution. Le
téléchargement depuis le menu, les achats et l'installation à chaud ne sont pas
implémentés.

Voir le suivi détaillé :
[`DLC_INSTALLATION_PROFILES_2026-11-07.md`](../docs/development/DLC_INSTALLATION_PROFILES_2026-11-07.md).
