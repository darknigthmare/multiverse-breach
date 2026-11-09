# Export différentiel, Album et retour d’intervention Nexus

Cette continuation reprend le commit
`b016361ae12d96afbf157e7f43bf784832813c0b` de la
[PR #27](https://github.com/darknigthmare/multiverse-breach/pull/27).
Le lot précédent avait laissé trois parcours concrets à terminer : produire
un delta entièrement par les commandes documentées, parcourir l’Album avec
un texte agrandi sans perdre sa position, et relier un rapport de la Cité à
une intervention FPS jouable jusqu’au retour.

## Référence de départ vérifiée

Les douze workflows de `b016361a` sont terminés avec succès, y compris la
construction de production avec les médias LFS et les 44 commandes du
`prebuild`. Les quatre éditions `base`, `halo`, `base-reviewed` et
`halo-reviewed` ont chacune passé leurs quatre parcours navigateur et
sauvegarde. Les 52 recettes ciblées du workflow DLC/terrain sont également
réussies. La suite de fiabilité a passé 1 978 tests et ses dix suites navigateur.

Le [reçu de référence](dlc-hud-city-fps-baseline-2026-11-07.json) conserve les
SHA, les exécutions et les empreintes des artefacts. Ces résultats portent
sur le commit de départ ; ils ne valident pas à eux seuls les changements
décrits ci-dessous. Les suites se recoupent et leurs nombres ne doivent pas
être additionnés comme des tests indépendants.

## 1. Chaîne DLC utilisable depuis le terminal

L’exporteur accepte maintenant `--source-revision FULL_GIT_SHA`. L’API savait
déjà inscrire cette révision dans le reçu ; le CLI ne l’exposait pas, ce qui
empêchait un export produit par les seules commandes publiques de devenir
la source d’un delta. Une révision mal formée est refusée avant création de
sortie. L’export autonome sans révision conserve son comportement.

La commande `inspect` vérifie un paquet sans écrire sur le disque. Elle
partage avec `apply` l’audit de la base, la vérification du manifeste et de
chaque blob unique, la fermeture du paquet et la cohérence du reçu cible.
Elle indique les packs ajoutés, retirés et conservés, les octets transférés
et les octets reconstruits. Son statut `inputs-verified` reste distinct de
la validation d’une édition installée : l’audit de l’arbre cible, la
compilation et les parcours du jeu sont explicitement annoncés comme étapes
ultérieures. `apply` exécute l’audit cible avant publication de son dossier.

L’aller-retour base → Halo → base est testé avec les vrais processus CLI,
par comparaison des arbres et reçus, en conservant les éditions précédentes.
Le test d’inspection interdit les primitives d’écriture pour vérifier ce
contrat. Les détails et commandes reproductibles sont dans le
[mode d’emploi DLC](../../DLC/README.md) et la
[note de chaîne différentielle](DLC_DIFFERENTIAL_CLI_2026-11-07.md).

## 2. Album : bibliothèque, classeur, fiche et historique

L’Album possède une seule zone principale de défilement sous son en-tête.
Les filtres et statistiques restent accessibles sans réserver une hauteur
fixe qui écrase les cartes. Les grilles suivent la taille du texte ; les
titres, compteurs, paliers et lignes d’historique peuvent prendre plusieurs
lignes. Les commandes atteignent 44 pixels et la marge de sécurité des
réglages s’applique aussi aux fiches superposées.

Les trois onglets ont une navigation clavier complète et des panneaux
associés. Le classeur reste monté lorsqu’on consulte la bibliothèque ou
l’historique : revenir à celui-ci conserve sa page. Changer d’univers ou de
filtre réinitialise toujours la pagination. Des commandes de pagination
sont disponibles avant et après les cartes.

Fermer une fiche rend le focus à sa carte. Si le retrait d’un favori a fait
disparaître cette carte des résultats, le titre du classeur devient le
point de reprise. Revenir à la bibliothèque retrouve la tuile d’origine.
Après la réclamation d’un palier, le focus rejoint le titre des paliers
au lieu de rester sur le bouton désactivé. Les règles de récompense, copies,
maîtrise, finitions, provenance et cent derniers tirages sont conservées.

La recette navigateur utilise les vrais composants, les vrais réglages et
le vrai garde de réclamation, avec un catalogue de contrôle de 132 cartes
dans 25 univers. Elle compare le texte à 100 % et 150 %, avec HUD à 140 %
et marge de 32 pixels, dans six configurations FR/EN : 390 × 844, 844 × 390
et 1 365 × 900. Elle vérifie la page conservée, les filtres, le focus, les
panneaux masqués, les titres longs et l’état complet de la collection.
Les illustrations et la collection parente sont synthétiques ; cette
recette ne certifie ni les médias de production ni la livraison de monnaie.

## 3. Cité → FPS : Retour des témoins

Le terminal de la Cité et la préparation FPS proposent l’intervention
**Retour des témoins** lorsqu’un rapport de reconnaissance du Nexus est
terminé et qu’un combattant possédé est disponible. Le briefing présente
le témoin et les preuves du rapport conservé. Le dossier peut provenir de
la reconnaissance standard ou de l’enquête à deux reliques.

L’intervention utilise l’Extraction et exige les trois relais synchronisés.
La défaite du Champion ouvre ensuite un objectif de retour : rejoindre le
sas vert et interagir à portée avec **E / LOOT**. Un losange vert dans le
radar indique sa direction, même hors champ ou au-delà du rayon, et l’objectif
affiche sa distance. La Marge reste active.
Le relevé n’est transmis qu’après cette interaction ; tuer le Champion ne
déclenche pas à lui seul le bilan. Les objets ordinaires à proximité restent
prioritaires sur le sas dans le choix de cible de ramassage.

Chaque progression appartient à sa partie et à son combattant. Une pause,
un abandon ou une erreur ne fournit pas de complétion. Le rapport de la Cité
reste disponible pour recommencer. Une première intervention achevée est
archivée dans la carrière, en conservant les données antérieures et les
identifiants inconnus. Les récompenses restent celles de l’Extraction et
passent par le reçu de fin de partie existant, protégé contre les doublons.
La demande de lancement provenant de la Cité est effacée au démarrage ou
en quittant la préparation, pour ne pas réactiver l’option lors d’une
navigation FPS ordinaire. Les transitions, les données conservées et la
provenance des états de test sont détaillées dans la
[note Retour des témoins](../extinction-city/NEXUS_WITNESS_RETURN_2026-11-08.md).

## Vérifications du lot

Les contrôles locaux d’intégration ont passé **211 tests UI et cycle de
partie**, dont les 14 nouveaux contrats d’intervention Nexus, et **173 tests
de profils DLC**, dont les 54 contrats export/delta. Oxlint passe sans
avertissement sur les fichiers modifiés. Les 19 tests ciblés de collection
et de shell passent également ; une partie recoupe la suite UI. La fixture
Album et la compilation source de l’application passent avec Vite. Les
44 commandes du `prebuild` restent
identiques et dans le même ordre.

Le contrat des sorties de Cité exécute également le callback réel pour les
missions, le Codex et l’intervention. Il contrôle la libération des commandes,
la sauvegarde du point de départ et la fermeture du terminal avant navigation,
ainsi que le transfert intact des options. Les 23 tests de présentation et
d’état du Hub passent avec ce contrôle ; la comparaison littérale de l’ancienne
signature, signalée par le premier passage CI, est ainsi remplacée par une
vérification du comportement.

Le workflow `dlc-field-continuation.yml` conserve toutes ses recettes
précédentes et ajoute l’Album ainsi que le parcours complet Cité/FPS. Ce
dernier obtient le rapport par la marche et les interactions, recharge un
point de contrôle après la première relique, puis joue les relais, le combat
et le retour au sas. Les fins, dégâts, synchronisations et récompenses ne
sont pas injectés. Deux contextes frais utilisent la même graine pour
comparer la trace de la partie. Les résultats, captures, traces et SHA de
l’arbre testé sont joints au workflow du commit correspondant dans les
[vérifications de la PR](https://github.com/darknigthmare/multiverse-breach/pull/27/checks).

Chromium ne peut pas démarrer localement à cause de la politique de sockets
de cet environnement. Les recettes navigateur sont donc exécutées en CI ;
une compilation locale n’est pas présentée comme une preuve de parcours.
Le build de production complet reste une vérification distincte.

## Portée et suites du projet

Les classeurs Excel et leurs preuves historiques ne sont pas réécrits. Ce
lot ferme les parcours décrits ici et complète leurs notes de suivi. Il ne
constitue pas une certification des quarante écrans, de tous les médias
artistiques, des périphériques physiques ou d’un compte cloud réel.

La gestion différentielle publie une nouvelle édition dans un dossier
distinct. L’installation ou le retrait d’un DLC pendant une partie active
reste un autre chantier. Le retour d’intervention est une mission du Nexus,
pas une conversion de tous les quartiers et contenus du catalogue.
