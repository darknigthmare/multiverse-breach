# Armes et équipements — manquants au 26 octobre 2026

[Ouvrir le classeur](Multiverse_Breach_Armes_Equipements_Par_Personnage.xlsx)

**Relevé initial conservé :** les comptes documentaires de ce rapport décrivent le lot du 26 octobre. Le classeur courant intègre les [compléments du 28 octobre](ARMES_EQUIPEMENTS_COMPLEMENTS_2026-10-28.md) : 169 références sur 79 acteurs, 10 346 dossiers et 28 473 points. Les constats du code restent au commit source indiqué ci-dessous. La procédure de régénération et les protections du suivi continuent de s’appliquer.

## Résultat du nouveau contrôle

Le relevé est recalculé sur **master `1460d0ebbb67f1809ac2f8b4bf76d5f8126f4aa6`**, après la fusion de la PR #6. L’ancienne version `8ce15c779db1e911f0db8723c681a6b0b740bd78` a également été réexécutée dans un répertoire isolé, avec le même extracteur et les arbres Git complets.

**Les listes d’équipements et les cinq catalogues restent identiques entre ces deux versions**, après neutralisation des URL de commit. Six signatures de combat ont été ajoutées : Quick Shot d’Irvine, Desperado de Laguna, No Mercy de Seifer, My Final Heaven de Zell, Beta de Midgar Zolom et W Machine Gun de Sweeper Machine. Elles restent des techniques dérivées, sans nouvel objet porté déduit.

Le classeur spécialisé préparé lors de la session précédente n’avait pas été publié avant l’interruption. Cette livraison le reconstruit sur les données actuelles et complète les classeurs déjà présents, notamment l’onglet historique `08_Objets`. Les autres XLSX sont conservés. Les fichiers d’extraction et de comparaison conservés ont permis de reprendre le travail après le nettoyage automatique de l’espace temporaire. La reconstruction documentaire ne prétend pas restaurer à l’octet près les fichiers perdus.

## Ce qui reste à compléter

| Travail | Périmètre constaté | Critère de réalisation |
|---|---:|---|
| Listes individuelles d’équipement | **4 882 acteurs sans liste `equipment[]`** | Lister la dotation de l’incarnation exacte, ou justifier explicitement l’absence d’objet porté. Les pouvoirs et l’anatomie restent distincts. |
| Incarnations | **3 440 fiches sans incarnation unique déterminée** | Fixer œuvre, opus, période et forme. Pour les créations originales, fixer la version du design interne. |
| Références des personnages | **3 218 fiches sans URL de référence déclarée** | Rattacher les objets et leur porteur à une source pertinente. Un lien général de franchise ne suffit pas à valider un modèle. |
| Correspondances entre rendu et modèle | **3 941 points de vérification** | Relier les familles techniques au modèle exact. La présence de `gun`, `slash` ou d’un autre alias ne prouve pas un comportement erroné en combat. |
| Références des objets | **2 200 occurrences sans URL de référence déclarée** | Documenter l’objet, l’édition, son usage et ses restrictions. |
| Fichiers d’icônes | **1 184 chemins uniques absents**, utilisés par **1 816 occurrences** | Produire ou raccorder le fichier attendu, puis contrôler l’affichage et l’identité de l’objet. |
| Vérification des dotations existantes | **1 288 fiches à revoir** | Vérifier les libellés, la possession, les variantes de scène, le port, les dimensions, les matériaux et les animations. |
| Revue des représentations | **5 241 occurrences à examiner**, avec des projections partagées | Contrôler le rendu selon sa nature. Une icône présente, une description ou un tag `canon-reference` ne constitue pas une certification. |
| Nature physique des déclarations | **2 274 points de classement à vérifier** | Distinguer les objets physiques, tenues, accessoires, anatomies, informations, pouvoirs, événements et techniques. |
| Porteurs déclarés en texte | **3 occurrences sans lien individuel explicite** | Vérifier la possession puis ajouter une relation par identifiant si elle est justifiée. Un nom textuel ne suffit pas. |
| Exclusion de dotation existante | **1 exclusion à conserver** | Préserver la restriction d’incarnation documentée lors d’une future modification. |

Ces catégories se recoupent. Les **28 304 constats du dépôt** sont des tâches d’inventaire, de recherche ou de revue ; ils ne représentent pas autant de bugs confirmés ni de contrôles manuels déjà effectués. Ils sont regroupés dans **10 177 dossiers** : un par acteur (4 936) et un par occurrence de catalogue (5 241). Les 55 références ciblées conservent chacune leur ligne séparée, soit **10 232 lignes dans Actions couvrant 28 359 points à traiter**.

Le regroupement conserve chaque catégorie, travail demandé, preuve source et identifiant de constat. Un dossier comporte au plus cinq constats du dépôt, numérotés dans le même ordre dans les colonnes correspondantes. Il ne supprime aucun des 28 304 constats ni aucun des 55 travaux documentaires. Le statut porte sur le dossier entier : le terminer exige de traiter tous ses points.

Les **54 acteurs avec une liste `equipment[]`** représentent 141 déclarations, dont des objets, des vêtements, des pouvoirs et de l’anatomie. Les 4 882 autres acteurs peuvent déjà disposer d’un champ descriptif d’arme ou d’une signature. Une liste absente ne signifie pas qu’ils sont tous désarmés.

## Comparaison homogène

| Mesure | 24 octobre, recalculé | 26 octobre | Évolution du jeu |
|---|---:|---:|---:|
| Acteurs actifs | 4 936 | 4 936 | 0 |
| Acteurs avec liste d’équipements | 54 | 54 | 0 |
| Déclarations dans ces listes | 141 | 141 | 0 |
| Occurrences dans les cinq catalogues | 5 241 | 5 241 | 0 |
| Champs d’arme descriptifs | 1 234 | 1 234 | 0 |
| Techniques signées résolues | 118 | 124 | +6 |
| Relations explicites | 1 494 | 1 500 | +6 techniques |
| Points d’équipement ouverts | 28 304 | 28 304 | 0 |
| Chemins d’icônes absents, uniques | 1 184 | 1 184 | 0 |

Le premier compte de la conversation, **28 335**, utilisait un tri lexical moins précis. Les étuis, munitions, pluriels, combinaisons et machines sont mieux distingués. Les faux positifs « Round Glasses » et « Round Table Dossier » sont corrigés. **La différence de −31 est une correction du relevé, pas une amélioration du jeu.** La comparaison des deux versions avec la même méthode aboutit à 28 304 des deux côtés.

[Comparaison détaillée, identités et six signatures](sources/equipment-comparison-2026-10-26.json).

## Couverture de l’inventaire

Les 4 936 acteurs couvrent **525 univers** : 1 912 héros, Ancre comprise, 1 518 adversaires ordinaires, 1 110 boss et 396 boss de monde. Les 1 885 identités sans ID conservent la clé exacte univers + nom. Les 101 acteurs signalés non combattants restent identifiés.

| Registre | Occurrences |
|---|---:|
| Équipements | 1 587 |
| Événements | 525 |
| Objets et présentations de combat | 2 628 |
| Boutique | 498 |
| Récompenses saisonnières | 3 |
| **Total** | **5 241** |

Ces occurrences correspondent à **4 724 clés univers + ID**, sans constituer autant d’objets physiques uniques. Les objets dérivés de combat, projections de boutique, invocations et attaques gardent leur nature et leurs liens explicites. Aucun porteur n’est déduit du seul univers, d’un nom ressemblant ou du champ textuel `sourceOwner`.

Les **1 500 relations** comprennent 141 entrées de liste, 1 accessoire de scène, 1 234 champs descriptifs et 124 techniques. L’inventaire initial du jeu ne devient pas une dotation canonique. Aucune sauvegarde réelle du joueur n’est consultée.

## Fidélité 1:1 et références ciblées

Le corpus comporte **55 associations documentaires sur 22 acteurs, appuyées par 21 sources**. Il complète l’inventaire du dépôt. Chaque association précise le personnage, l’œuvre, l’édition, la nature de la source et les restrictions d’application. Vingt pages ou PDF ont été relus directement. Le site officiel Square Enix de FFVII PC a été vérifié via ses extraits indexés ; ses images et modèles restent à confirmer.

**41 références demandent encore un choix d’incarnation.** Elles restent conditionnelles avant attribution et ne représentent pas des objets nouvellement intégrés dans le jeu. Les sources de première main, reproductions officielles sous licence et accessoires originaux conservés dans un musée sont distingués. La présence d’un pistolet parmi les accessoires d’une figurine de Dallas ne prouve pas son usage à l’écran ni sa possession permanente.

Les anciennes valeurs de 23 acteurs, 20 sources et 40 références sans incarnation ne sont pas reprises. Le corpus perdu a été reconstruit et revérifié, avec un périmètre documentaire ajusté ; il ne s’agit pas d’une restauration à l’identique. Ses conditions et limites sont conservées dans ses métadonnées.

Exemples de dossiers à poursuivre :

- **Solid Snake** : les armes et équipements du manuel MGS1 permettent de constituer une dotation propre à cette incarnation. Fixer la progression et les modèles avant attribution. Cela ne recense pas tout l’inventaire de toute la série Metal Gear.
- **Master Chief** : les variantes d’armure restent séparées par œuvre. Choisir la version active et compléter sa dotation correspondante.
- **FFVII** : la Buster Sword de Cloud est documentée pour *Remake*. Les gants de Tifa, le bâton d’Aerith et le bras-fusil de Barret sont ici des familles d’armes du jeu original et de sa réédition PC. Leurs modèles exacts restent à préciser ; ils ne sont pas certifiés comme modèles de *Remake*. Un alias de rendu ne constitue pas une observation du comportement en combat.
- **Resident Evil** : les Samurai Edge restent liés à leur propriétaire et à leur édition. La variante tardive d’un modèle ne remplace pas le modèle antérieur par défaut.
- **Mass Effect** : les références du manuel Wii U restent liées à cette édition. La pagination imprimée et celle du PDF sont distinguées dans les références.

Les exclusions déjà exprimées dans le jeu sont conservées : Ripley 1979 et 1986 séparées ; Luke ROTJ et son sabre vert distincts de la relique bleue ANH/ESB ; masque de Joker *Death of the Family* exclu du kit *Endgame* ; rayon gelant de Young Gru non attribué automatiquement aux Minions. Les 312 créations originales renvoient à leur design interne.

**Aucune certification artistique 1:1 n’est déclarée par ce relevé.** La présence de tous les acteurs dans l’inventaire ne signifie pas que tous les équipements de leurs œuvres sources ont été recherchés.

[Corpus, URL et limites de chaque source](sources/equipment-canonical-references-2026-10-26.json).

## La PR #7 reste un chantier séparé

À la tête contrôlée `6c0096807ba7d9107686b14657eaefc8b1c8cde2`, la PR #7 est ouverte et non fusionnée. Elle apporte **13 adaptations supplémentaires de techniques Fighter**, dont 12 à distance et une de mêlée. Elle n’ajoute pas d’équipement physique, d’acteur ni de validation artistique.

Ses trois CI contrôlées sont réussies, mais la branche diverge de master et présente des conflits. Le catalogue Rift qu’elle contient est déjà identique à master. Le traitement historique des empreintes Sulaco diffère : le test et la révision ne peuvent pas être repris tels quels sur l’état actuel. Ce point exige une réconciliation avant fusion et n’est pas une lacune du catalogue d’armes.

[Preuve de contrôle PR #7](evidence/equipment-pr7-review-2026-10-26.json) · [Ouvrir la PR #7](https://github.com/darknigthmare/multiverse-breach/pull/7).

## Utilisation du classeur

Sept onglets :

| Onglet | Contenu |
|---|---|
| Synthèse | Périmètre du relevé, observations de priorité figées et compteurs de suivi dynamiques. |
| Évolutions | Comparaison des deux versions exécutées et état des PR. |
| Personnages | Tous les acteurs, incarnations, listes, armes descriptives, sources et exclusions de combat. |
| Armes et objets | Cinq catalogues, nature, restrictions, liens et présence des icônes. |
| Affectations | Relations individuelles accompagnées de leur preuve dans le code. |
| Références 1a1 | Corpus documentaire ciblé et conditions d’application. |
| Actions | 10 232 dossiers filtrables couvrant 28 359 points, avec avancement, preuve et responsable. |

Les feuilles détaillées utilisent des tableaux avec filtres et des volets figés. Dans Actions, les colonnes jaunes **K à M** restent les champs d’avancement, de preuve de réalisation et de responsable. La colonne **N** calcule le résultat du suivi. La colonne **O** contient l’`ID dossier` stable, **P** le nombre de points regroupés et **Q** les identifiants de tous les constats du dossier. Les 28 304 identifiants du dépôt et les 55 identifiants documentaires restent conservés et distincts.

**Marquer un dossier `Terminé` uniquement lorsque tous ses points sont traités**, avec une preuve qui couvre chacun d’eux. Tant qu’un point reste ouvert, conserver un statut intermédiaire. Un dossier marqué `Terminé` sans preuve affiche `Preuve manquante`. La formule vérifie la présence d’une preuve ; elle ne vérifie pas automatiquement le contenu de cette preuve ni la réalisation de chaque point.

Dans Synthèse, **B14** compte les dossiers encore ouverts et **B15** les dossiers terminés avec preuve. À la livraison, ces comptes sont respectivement **10 232** et **0**. **B17** additionne la colonne P et conserve le total de **28 359 points regroupés** ; ce total de périmètre ne doit pas être confondu avec le nombre de dossiers ouverts.

Les six comptes de priorité **B20 à B25** sont des **observations chiffrées figées au commit audité `1460d0ebbb67f1809ac2f8b4bf76d5f8126f4aa6`**, vérifiées sur l’ensemble des constats. Ils décrivent leur fréquence au relevé et ne diminuent pas quand l’avancement d’un dossier change. Leur actualisation demande un nouvel export des données du jeu. Les compteurs de suivi **B14, B15 et B17**, ainsi que les résultats de la colonne **N** d’Actions, restent calculés par formules. Le classeur ne présente donc pas tous ses comptes comme dynamiques.

Dans Personnages, `Arme décrite` reproduit le champ `weapon` du code, y compris lorsqu’il contient seulement `laser`, `gun` ou `slash`. La colonne `Famille technique` et les actions associées permettent de distinguer ces alias d’un modèle d’arme attesté. Ces libellés bruts ne certifient ni une dotation ni le comportement effectif en combat.

### Régénérer en conservant le suivi — 27 octobre 2026

Le générateur accepte désormais l’ancien XLSX en **sixième argument facultatif**. Il retrouve les colonnes d’Actions par leur en-tête et rapproche les lignes par `ID dossier`, même après un tri du tableau. Les valeurs déjà saisies dans **Avancement, Preuve de réalisation et Responsable** sont reprises pour chaque dossier inchangé.

Si un nouveau constat apparaît, ou si le contenu ou la source à examiner change, le dossier revient à **`À vérifier`**. Sa preuve et son responsable restent conservés pour faciliter la revue. Le seul changement de SHA dans une URL GitHub pointant vers le même fichier ne suffit pas à rouvrir le dossier. Un dossier nouveau commence à **`À faire`**. Un dossier absent du nouveau relevé n’est pas déclaré terminé : son ancien suivi est conservé dans le rapport de reprise **`PREVIEW_DIR/progress-carryforward.json`**, avec les motifs de réouverture et le bilan des rapprochements.

Avant de remplacer le XLSX, le générateur conserve le rapport précédent et le nouveau rapport sous `progress-carryforward-<empreinte>.json`. Le nouveau rapport contient l’empreinte et la taille du XLSX généré. Le nom courant `progress-carryforward.json` est ensuite actualisé. Conserver ces archives avec le suivi : elles préservent les dossiers retirés lors des générations antérieures, même si l’actualisation du nom courant échoue.

Si `OUTPUT.xlsx` existe et que le sixième argument est omis, son suivi est repris automatiquement. Un fichier de sortie existant ne peut pas être remplacé en prenant le suivi d’un autre `PREVIOUS.xlsx` : le générateur demande alors un nouveau chemin de sortie. Un relevé neuf, sans ancien classeur ni sortie existante, initialise les dossiers à `À faire`.

Les identifiants dupliqués, en-têtes requis absents et statuts invalides interrompent la reprise avant le remplacement du fichier de sortie. Les champs manuels doivent contenir du texte : les formules et les textes commençant par `=` sont explicitement refusés, en laissant la sortie intacte, car le moteur peut interpréter ce préfixe comme une formule. Les préfixes `+`, `-` et `@` sont conservés exactement.

L’export est d’abord écrit dans un fichier temporaire, puis renommé après réussite. Conserver l’ancien XLSX jusqu’à vérification du nouveau fichier et du rapport de reprise. Cette reprise des saisies ne valide ni le contenu des preuves ni la fidélité artistique des équipements.

## Vérifications et reprise

Les deux extractions vérifient les fichiers de jeu contre les empreintes Git : **194 fichiers pour l’ancien SHA et 213 pour le nouveau**. Les catalogues ne sont pas mutés pendant l’extraction. La présence des icônes est contrôlée dans les arbres complets, sans dépendre du checkout partiel.

L’extracteur conservé et le jeu de données complet ont été retrouvés avec leurs empreintes attendues. La suite de tests a été reconstruite puis réellement réexécutée : **17 tests réussis, sans échec, test ignoré ni annulation**. Les 213 fichiers source concordent avec les empreintes du jeu de données actuel. Le journal et la nouvelle empreinte de la suite sont conservés dans les preuves de livraison. Les tests contrôlent notamment les identités, les descriptions multimots, le tri lexical, les projections de boutique, les exclusions, les références, les liens explicites et les clés étrangères. Le journal historique n’est pas présenté comme l’exécution de la suite reconstruite.

Le classeur est contrôlé avec le moteur de génération : compteurs, formules, cas de suivi avec et sans preuve, export ZIP/XML et aperçus. Aucune ouverture dans Excel Desktop, nouvelle visite du jeu, certification visuelle globale ou validation de toutes les animations n’est revendiquée.

**Reprise du 27 octobre :** la nouvelle extraction reproduit exactement le JSON du relevé initial et les **17 tests d’export** réussissent à nouveau. **18 tests de fusion** vérifient les identifiants, les tris, les ajouts, les modifications, les retraits et la conservation des saisies. Un essai Excel avec lignes et colonnes inversées passe **118 vérifications indépendantes** : deux dossiers rouverts, un nouveau, un retiré conservé, et un dossier terminé avec preuve. Deux régénérations successives sans sixième argument conservent toutes les valeurs et formules de cet essai. Les tests d’échec de lecture ou d’archivage du rapport laissent le fichier de sortie intact. Les preuves détaillées sont dans [le contrôle du 27 octobre](evidence/equipment-progress-2026-10-27.json).

Le classeur complet régénéré conserve les **10 232 dossiers et les 28 359 identifiants de constat**, les saisies initiales et les cinq feuilles de données. Les **10 251 formules** disposent de leurs résultats enregistrés, sans erreur détectée. Les changements visibles portent sur la note de reprise de Synthèse et la formule de suivi d’Actions, qui ne compte plus les espaces, tabulations ou retours de ligne seuls comme une preuve. Aucun dossier du relevé initial n’a été déclaré terminé par cette mise à jour.

### État des CI de la PR

Sur le commit intermédiaire `c1be80ba5e73c2d53f73cc86c7365cb13fa88447`, **cinq CI réussissent** : [Signature combat](https://github.com/darknigthmare/multiverse-breach/actions/runs/40394344272), [City and Extinction immersive UI](https://github.com/darknigthmare/multiverse-breach/actions/runs/40394344309), [Race immersive UI](https://github.com/darknigthmare/multiverse-breach/actions/runs/40394344379), [Extinction identities and City catalog](https://github.com/darknigthmare/multiverse-breach/actions/runs/40394344455) et [Reliability and source build](https://github.com/darknigthmare/multiverse-breach/actions/runs/40394344369).

Le [job Full production build de cette PR](https://github.com/darknigthmare/multiverse-breach/actions/runs/40394344299/job/121823284530) échoue dans `scripts/progressionAudit.mjs:816`. Le [job du master source](https://github.com/darknigthmare/multiverse-breach/actions/runs/40326700136/job/121585778141) présentait déjà exactement la même erreur avant la PR. Le contrôle recherche l’ancien texte `sheet.naturalHeight / 10` dans le rendu FPS de Mirelle ; le code utilise désormais `handFrame.rows`, résolu par le profil du personnage. La grille 4 × 10 et le projectile séparé restent déclarés. Ce défaut du contrôle textuel est préexistant et indépendant des neuf fichiers d’audit publiés à ce commit. Il ne prouve pas, à lui seul, un défaut visuel. Aucune réussite de compilation complète ni correction de ce contrôle n’est revendiquée ici.

**Contrôle du 27 octobre sur le commit livré `99cd93a9dee4f4695be1b6989344fb74d1922418` : quatre CI réussissent et deux échouent.** Les réussites concernent [Signature combat](https://github.com/darknigthmare/multiverse-breach/actions/runs/40402416862), [Race immersive UI](https://github.com/darknigthmare/multiverse-breach/actions/runs/40402416908), [Extinction identities and City catalog](https://github.com/darknigthmare/multiverse-breach/actions/runs/40402416981) et [Reliability and source build](https://github.com/darknigthmare/multiverse-breach/actions/runs/40402416804).

Le [Full production build de `99cd93a`](https://github.com/darknigthmare/multiverse-breach/actions/runs/40402416752/job/121851438727) est terminé en échec sur la même assertion Mirelle préexistante. Le [job City and Extinction immersive UI](https://github.com/darknigthmare/multiverse-breach/actions/runs/40402416723/job/121851438807) réussit 17 scénarios sur 18 ; seul `fps-1280x900-fr-infestation` échoue, avec le bot vaincu après 89 éliminations, à 3 360 frames. Ce scénario avait réussi au commit intermédiaire alors que le code du jeu, du bot, les dépendances et le workflow n’ont pas changé. Sa cause profonde reste à déterminer. Ces résultats sont attachés au commit indiqué et ne constituent pas une validation des modifications ultérieures du générateur.

### Reproduire les données

Depuis la branche de cette livraison, dont les fichiers de jeu conservent les empreintes du SHA source, ou après copie de l’extracteur dans un checkout isolé de ce SHA :

```bash
node --experimental-loader ./docs/excel/tools/json-loader.mjs \
  scripts/exportEquipmentWorkbookData.mjs \
  /tmp/multiverse-equipment-data \
  1460d0ebbb67f1809ac2f8b4bf76d5f8126f4aa6
```

L’argument facultatif suivant accepte un arbre Git complet au format JSON. Un dernier argument permet de fixer la date du relevé. Le format de l’arbre est documenté dans l’extracteur. Dans un clone partiel, ne pas confondre fichiers non téléchargés et fichiers absents de Git.

```bash
EQUIPMENT_INVENTORY_JSON=/tmp/multiverse-equipment-data/equipment-workbook-data.json \
node --experimental-loader ./docs/excel/tools/json-loader.mjs \
  scripts/exportEquipmentWorkbookData.test.mjs
```

Les tests de rapprochement du suivi ne nécessitent ni classeur ni dépendance de génération :

```bash
node docs/excel/tools/equipment_progress.test.mjs
```

Le générateur `docs/excel/tools/build_equipment_workbook.mjs` utilise `@oai/artifact-tool` dans le runtime de génération, sans ajout de dépendance au jeu. Le lanceur `scripts/buildEquipmentWorkbook.mjs` prépare un dossier temporaire privé, y copie le générateur et ses modules de reprise, puis raccorde les dépendances indiquées par `CODEX_PRIMARY_RUNTIME_NODE_MODULES`. Les variables `CODEX_PRIMARY_RUNTIME_NODE` et `CODEX_PRIMARY_RUNTIME_NODE_MODULES` doivent désigner le runtime fourni et ses modules. Le dossier temporaire est supprimé à la fin.

Le lanceur active `--expose-gc` et une limite de tas de **3 072 Mio** (`--max-old-space-size=3072`) pour le générateur. La lecture de l’ancien XLSX utilise un processus séparé limité à **2 048 Mio**, terminé avant la construction du nouveau classeur. Le regroupement d’Actions réduit le nombre de lignes et de formules tout en conservant tous les constats. Les projections temporaires sont libérées après les contrôles et le fichier XLSX est sérialisé avant les aperçus pour séparer leurs besoins mémoire. Les données, formules et formats prévus restent conservés dans le classeur.

```bash
"$CODEX_PRIMARY_RUNTIME_NODE" scripts/buildEquipmentWorkbook.mjs \
  DATA.json CANON.json COMPARISON.json OUTPUT.xlsx PREVIEW_DIR PREVIOUS.xlsx
```

Cette commande part de la racine du dépôt. Remplacer `PREVIOUS.xlsx` par le classeur contenant le suivi à conserver ; un nouveau chemin de sortie permet de garder l’original. Omettre le sixième argument pour reprendre automatiquement `OUTPUT.xlsx` s’il existe, ou créer un relevé neuf s’il n’existe pas. Le rapport `PREVIEW_DIR/progress-carryforward.json` permet d’examiner les dossiers repris, rouverts, nouveaux ou disparus.

Le fichier de comparaison livré contient les deux exports rapprochés et les informations de PR nécessaires au générateur. Les [preuves initiales du 26 octobre](evidence/equipment-inventory-2026-10-26.json) décrivent la première livraison ; les [vérifications de reprise du 27 octobre](evidence/equipment-progress-2026-10-27.json) décrivent la mise à jour du générateur et du classeur.
