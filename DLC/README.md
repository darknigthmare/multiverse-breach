# Univers et futurs DLC

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
| `DLC/Halo/assets.json` | Inventaire des fichiers graphiques et autres ressources rattachés à cet univers, avec leur source et leur URL existantes. |
| `DLC/Halo/index.js` | Point d'entrée généré, exposant le manifeste et les modules du dossier. |
| `DLC/index.js` | Registre généré des métadonnées de tous les dossiers. |
| `DLC/shared-assets.json` | Ressources de base, de campagne, communes à plusieurs univers ou sans attribution suffisamment établie. |

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

Cette étape déplace les définitions et le code spécifique. Les fichiers binaires
restent physiquement dans `public/` avec leurs URL actuelles. Leur déplacement
exigera de faire évoluer ensemble les audits de provenance, les générateurs,
les manifestes de sprites et le déploiement.

Chaque `assets.json` indique `sourcePath`, `publicPath` et la justification du
rattachement. Une affiliation par nom de dossier ne démontre pas un usage
exclusif. Les ressources identifiées dans plusieurs univers restent dans
`shared-assets.json` et figurent dans les dépendances des dossiers concernés.
Les alias historiques ambigus restent sans attribution forcée.

Dans un dépôt, l'inventaire lit les chemins de l'index Git et les références
statiques du code. Il fonctionne donc dans une copie partielle sans télécharger
les images. Dans un export sans métadonnées Git utilisables, il parcourt les
fichiers réellement présents dans `public/` et vérifie qu'ils correspondent aux
inventaires enregistrés. Un fichier omis ou ajouté rend le contrôle obsolète et
provoque un échec. Un dépôt parent ne fournit jamais l'index d'un projet exporté.
Le diagnostic `inputSource` distingue `git-index` et `public-tree`.

Ces contrôles ne valident ni les octets, ni l'hydratation LFS, ni la qualité ou
la provenance d'une image : les audits de ressources existants continuent de
remplir ces rôles.

## Modifier ou ajouter un univers

1. Modifier les définitions dans `DLC/NomDeLUnivers/data/` ou `runtime/`.
2. Pour un nouveau module, l'ajouter à `manifest.json` avec son chemin relatif
   et son `runtimeAdapter` dans `src/game/`. Raccorder ce module au catalogue
   commun correspondant ; le registre de métadonnées n'instancie pas de contenu.
3. Pour un nouvel univers, choisir un dossier unique sans collision de casse,
   une identité et une clé d'univers uniques, puis un `catalogOrder` disponible.
   Ajouter les données de lore et les raccordements nécessaires au gameplay.
4. Ajouter les nouveaux fichiers publics à l'index Git avant de régénérer leur
   inventaire (`git add public/...`). Les fichiers non suivis ne sont pas inclus.
5. Régénérer puis vérifier :

```sh
npm run dlc:registry:write
npm run dlc:assets:write
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

## Étape suivante : distribution séparée

Cette organisation prépare des packs indépendants. Le jeu importe encore tous
les catalogues à la compilation : supprimer un dossier DLC à ce stade ferait
échouer ses imports. Une distribution optionnelle demandera un chargeur de packs,
une politique de dépendances communes et un assemblage de ressources adapté.
Le manifeste et les inventaires fournissent les points de départ de ce travail,
sans modifier le fonctionnement des sauvegardes actuelles.
