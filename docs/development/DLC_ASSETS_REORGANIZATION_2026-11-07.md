# Déplacement des ressources dans les dossiers DLC

## Point de reprise et résultat

Cette deuxième phase poursuit la réorganisation de la PR #22 depuis le commit
`a1d11e19bdf8e7b9c75788450b8c3d9defdcb747`, sur la branche
`refactor/dlc-universe-folders-2026-11-06`. La première phase avait isolé les
définitions et les comportements. Celle-ci déplace les fichiers sources propres
aux univers et adapte leur publication, leurs audits et leurs installateurs.

| Élément | Résultat |
| --- | ---: |
| Dossiers DLC avec manifeste | 505 |
| Univers enregistrés dans le catalogue jouable | 504 |
| Dossier supplémentaire de ressources (`CloudMeadow`) | 1 |
| Sources déplacées de `public/` vers `DLC/*/assets/` | 8 187 |
| Blobs Git distincts conservés | 8 140 |
| Fichiers dont l'attribution LFS est conservée | 438 |
| Sources de base, de campagne, communes ou sans attribution certaine dans `public/` | 5 976 |
| URL publiques inventoriées au total | 14 163 |

Le déplacement contient 6 069 PNG, 2 111 WebP, six JSON et un HTML. Les copies
historiques identiques restent des chemins distincts : aucune déduplication de
contenu ou suppression d'illustration n'est introduite. Aucun identifiant de
jeu, chemin public, ordre de catalogue ou champ de provenance ne change.

## Source, URL et publication

`assets.json` distingue désormais la source physique, par exemple
`DLC/Halo/assets/boosters/halo.webp`, et l'URL historique `/boosters/halo.webp`.
Les ressources réellement communes restent dans `DLC/shared-assets.json` et
dans `public/`. Les références à plusieurs univers ne sont pas réattribuées
arbitrairement.

`scripts/prepareDlcAssets.mjs` prépare des copies ordinaires dans `public/` avant
le serveur de développement et le build. Il contrôle l'unicité des destinations,
les chemins, les liens symboliques, l'absence de pointeurs LFS et les empreintes
des copies. Un fichier local différent n'est pas écrasé. Les mises à jour et le
retrait d'anciennes copies ne touchent que les fichiers gérés dont les octets
correspondent toujours à l'état enregistré.

La revue de reprise a corrigé un transfert d'attribution : lorsqu'une ancienne
copie devient une source canonique commune dans `public/`, la préparation lui
abandonne la gestion et la conserve, même si ses octets ont changé. Elle lit les
déclarations publiques dans les inventaires des packs et dans
`DLC/shared-assets.json`. Les conflits de déclaration restent refusés avant toute
mutation ; les autres copies modifiées restent protégées. Sept régressions
couvrent ce transfert et ses cas de conflit.

Les destinations générées sont exclues de Git et des sources envoyées à Vercel
par deux blocs produits avec les inventaires. Les vraies sources DLC restent
incluses dans l'envoi. L'audit des sources de déploiement exige ces fichiers
canoniques ; une copie publique ne compense pas une source absente. Le build
strict reconstitue ensuite les mêmes URL publiques pour les audits existants
et pour Vite.

Les installateurs et générateurs adaptés résolvent une URL vers son fichier
source avec `scripts/assetSourceResolver.mjs`. Une URL connue conserve son
attribution exacte, y compris lorsqu'elle est partagée. Une nouvelle ressource
avec une clé d'univers enregistrée est dirigée vers son dossier DLC. Les
journaux de provenance conservent les URL publiques. Les sources et destinations
physiques ne deviennent pas des URL destinées au jeu.

Les exports de fidélité des acteurs et d'équipement projettent les fichiers
de l'arbre Git demandé vers leurs URL historiques. Ils lisent aussi les anciens
arbres contenant uniquement `public/`, refusent les collisions et ne consultent
pas le disque pour décider de la présence d'une image. La lecture d'arbre ne
demande pas les tailles des blobs et ne télécharge donc pas les médias absents.
L'export équipement vérifie désormais les modules et manifestes DLC contre le
commit annoncé ; une définition modifiée ou omise provoque un échec.

## Copies partielles et workflows

Les workflows de tests ciblés récupèrent les modules, les manifestes et les
quelques ressources nécessaires à leurs fixtures. Ils évitent de télécharger
toutes les images du seul fait que le dossier `DLC/` est inclus. Leur préparation
`--available` annonce explicitement les sources absentes. Ces workflows démarrent
Vite directement pour leurs fixtures ; `npm run dev` garde sa préparation stricte
pour l'usage normal.

Les inventaires de présence utilisés par l'outillage Extinction incluent les
chemins physiques suivis et les alias publics correspondants. La comparaison
sur les 19 tables de la copie de travail conserve les 17 741 lignes et les
3 526 mentions de présence de ressources. Les inventaires historiques épinglés
à un ancien commit conservent leur comportement d'origine.

Trois workflows navigateur précédents avaient été annulés autour de leur limite
de 10 ou 12 minutes ; leur limite passe à 20 minutes. Le test Eyedol lit désormais
la définition déplacée via le lecteur de sources DLC, avec les mêmes assertions.
Il ne cherche plus le contenu dans le petit adaptateur historique.

## Conservation et vérifications

Le reçu [`dlc-assets-migration-2026-11-07.json`](dlc-assets-migration-2026-11-07.json)
enregistre chaque ancien chemin, destination, mode, blob Git et attribution LFS.
`npm run dlc:verify:assets` compare ce reçu à l'index courant et refuse une ancienne
source encore suivie, un changement d'octets ou de mode et une attribution LFS
différente. Ce contrôle historique reste volontaire, pour ne pas empêcher une
future mise à jour légitime des illustrations.

La copie locale de cette reprise ne matérialise que huit des 8 187 sources
déplacées. Leurs octets correspondent au blob d'origine ; les autres fichiers
sont déplacés par identifiant Git, sans inventer ni réencoder leur contenu.
La préparation partielle copie ces huit fichiers et annonce les 8 179 absents.
La conservation d'un blob LFS démontre celle du pointeur, pas à elle seule
l'hydratation de son contenu.

Les contrôles de reprise comprennent les tests de registre, d'inventaire,
de chemins, de publication, d'export sans Git et de déploiement. Les 77 catalogues
comparés au reçu initial restent identiques, dans le même ordre. Les tests de
publication couvrent les mises à jour, l'idempotence, les suppressions gérées,
les collisions, les modifications locales, les chemins non sûrs, les sources
absentes et les pointeurs LFS. Les installateurs conservent leurs contrôles de
provenance et leurs tests spécifiques.

| Contrôle local de cette phase | Résultat |
| --- | --- |
| `npm run test:dlc` | 100 tests réussis ; registre et inventaires à jour, dont sept régressions de transfert vers les sources communes et onze régressions d'export. |
| `npm run test:deployment-inputs` | 23 tests réussis. |
| Export équipement courant et sa suite historique | 17 tests réussis ; les définitions DLC sont incluses dans les sources vérifiées. |
| Resolver et trois installateurs de PNG | 61 tests réussis, dont dix également présents dans `test:dlc`. |
| `npm run dlc:verify:migration` | 77 catalogues, aucune différence. |
| `npm run dlc:verify:assets` et comparaison indépendante à la référence | 8 187 blobs et modes, 438 chemins LFS conservés. |
| Résolution exhaustive des URL | 8 187 sources DLC et 5 976 sources partagées conformes ; les 83 entrées CG et 172 sorties booster restent enregistrées. |
| Publication partielle rejouée | Huit copies inchangées, aucune réécriture ; 8 179 sources absentes annoncées. |
| Préparation stricte dans cette copie partielle | Échec attendu avant publication : les 8 179 sources absentes sont requises. |
| `npm run lint` | Réussite ; cinq avertissements préexistants. |
| `npx --no-install vite build` | Compilation réussie ; avertissement de taille de bundles. |

La [comparaison des exports](dlc-export-layout-validation-2026-11-07.json)
exécute les deux exportateurs sur deux arbres de test construits depuis l'index
courant, dont seuls les 8 187 chemins d'assets diffèrent. Ce ne sont pas deux
commits de production. Les sorties sont identiques : inventaire de 4 936 acteurs,
5 241 objets et 1 500 associations ; les quatre fichiers du backlog d'acteurs
gardent les mêmes empreintes SHA-256. Les absences et écarts déjà recensés par
ces audits restent explicitement signalés. La comparaison ne prétend pas valider
les pixels ni compléter ces contenus.

Les fixtures de routage Cloud Meadow et Rift passent. Le parcours de dérivation
d'un compagnon vérifie une écriture canonique puis son audit, avec une ancienne
copie publique volontairement périmée. PowerShell n'est pas installé localement :
son nouveau test portable est présent mais ignoré ici. La suite Cloud Meadow
complète dépend encore de son véritable PNG de référence absent de cette copie.

Le contrôle `Full production build` doit confirmer l'ensemble des gates avec
les vrais fichiers et LFS récupérés. Une compilation Vite isolée ou une
préparation `--available` ne vaut pas cette validation. Aucun nouveau contrôle
visuel exhaustif des milliers d'illustrations n'est revendiqué ici.

## Limite restante : installation facultative des packs

Les sources propres à chaque univers sont rangées avec ses données et ses
comportements. Le jeu assemble encore tous ses catalogues à la compilation.
Cette étape ne rend donc pas les dossiers désinstallables : supprimer un pack
romprait encore des imports. Un chargement conditionnel, la sélection des packs
et le traitement des dépendances partagées restent à concevoir ensemble.

Le mode d'emploi courant est [`DLC/README.md`](../../DLC/README.md).
