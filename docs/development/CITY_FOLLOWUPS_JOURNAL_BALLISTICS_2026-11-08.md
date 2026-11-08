# Suites de Cité, journal et balistique FPS

Continuation de la PR #27 à partir de `07fa2e757f501e4ae74f7c5a20b0a14f86dccfaa`.
Le résultat visé est un journal lisible avec des dossiers qui se prolongent selon
les décisions conservées, et trois équipements FPS ramassés dont le comportement
correspond à leur type.

## Critères joueur

- Une suite de contrat indique son dossier préalable et se débloque après sa
  transmission effective à l’ancre. Un simple drapeau de complétion ne suffit pas.
- Le choix précédent détermine un relevé et un emplacement. Le nouveau choix
  demande lui aussi une vérification physique avant la transmission du rapport.
- La recherche, les filtres et la lecture des preuves ne changent ni le contrat
  suivi ni sa progression. Les menus suspendent le déplacement et restituent le focus.
- Le fusil à pompe projette une gerbe, le plasma parcourt une trajectoire et la
  roquette explose au contact. Les protections du Champion s’appliquent aux dégâts.

## Douze suites originales du Nexus

| Personnage | Nouveau contrat | Question de terrain |
| --- | --- | --- |
| Ancre | La signature au retour | Raccorder une référence d’origine ou garder une lecture seule. |
| Mirelle | Après la suture | Tester un canal surveillé ou isoler le circuit en gardant sa sauvegarde. |
| Bastion | Une place pour le témoin | Joindre une preuve à la dixième route sans inventer les noms manquants. |
| Nova | Le retour mesurable | Publier un intervalle de mesure ou préparer une observation complémentaire. |
| Sable | Le détour signé | Relever un changement d’accès et vérifier la signalétique du détour. |
| Loom | L’autre bout du fil | Limiter un trajet aux relevés techniques tant que l’accueil des voix reste inconnu. |
| Marrow | Deux réponses propres | Conserver deux demandes attribuées sans juger une identité sur son apparence. |
| Tessera | La notice choisie | Corriger une notice d’accueil en gardant les deux provenances. |
| Quillon | La remise vérifiée | Confirmer la remise de Q-17 ou garder un compte provisoire sans créer un second objet. |
| Nadir | Le seuil suivant | Distinguer le trajet déjà documenté d’un seuil sans retour vérifié. |
| Elyra | Une nouvelle demande | Contrôler un nouvel accord explicite sans réactiver les permissions retirées. |
| Oryn | La tournée des voix | Vérifier qu’une copie publique respecte aussi un retrait de contribution. |

Ces intrigues prolongent les dossiers originaux du dépôt. Les seize contrats
précédents conservent leurs identifiants, leur ordre et leur texte. Le catalogue
complet contient **28 contrats** : 24 Nexus, 2 Halo et 2 Alien. Chaque suite Nexus
possède deux routes héritées et deux conclusions, soit **quatre combinaisons**.
Le choix contradictoire reste refusé avec une explication et sans progression.

La progression enregistre `originChoiceId` seulement pour les nouveaux dossiers.
Une divergence avec le choix préalable rend la suite indisponible en conservant
les données. La normalisation conserve les champs inconnus et les dossiers des
packs absents. Les résultats restent des dossiers narratifs, sans nouvelles
récompenses monétaires ou d’inventaire.

La relecture croisée a corrigé six détails de continuité avant livraison :
le compte provisoire de Quillon, la fermeture maintenue par Nadir, la mesure
encore à effectuer chez Nova, le délai de Marrow, l’accord explicite d’Elyra et
l’isolement de Mirelle après une réparation. La suite ne transforme pas une
demande ou une vérification en événement déjà accompli.

## Journal des contrats

Le journal sépare une liste de dossiers et leur lecture sur grand écran. La liste
est repliable sur petit écran. La recherche porte sur tout le catalogue avant
pagination à douze entrées et les filtres distinguent les dossiers à commencer,
en cours, transmis, verrouillés et ceux dont la sauvegarde doit être vérifiée.
Le dossier consulté reste ouvert lorsque la recherche ne le contient plus.

La lecture met l’objectif courant en premier, montre la décision héritée et offre
un accès au dossier préalable. Les étapes et constats sont repliables. L’accès
direct, les anciens attributs de recette, les commandes d’approche et les choix
sont conservés. L’acceptation, la reprise et les choix restituent le focus sur
l’objectif sans rappel différé après la fermeture du terminal.

Voir [le détail du journal](CITY_CONTRACT_JOURNAL_2026-11-08.md).

## Équipements FPS ramassés

Les trois types de loot existants utilisent maintenant leurs comportements
distincts dans le moteur commun :

- **Fusil à pompe** : sept trajectoires déterministes, portée de neuf unités,
  collision avec la première menace de chaque trajectoire.
- **Plasma** : projectile rapide, portée de vingt-quatre unités, dégâts au contact.
- **Roquette** : projectile suivi d’une explosion de rayon 2,2 unités, avec
  atténuation des dégâts sur les cibles voisines.

Les collisions sont examinées entre la position précédente et la nouvelle pour
ne pas traverser une cible entre deux ticks. Une explosion évalue les noyaux
protégés avant leurs drones, afin que l’ordre du tableau d’ennemis ne contourne
pas un bouclier. Les règles de marquage restent appliquées. Un tir ne crédite pas
l’ultime plusieurs fois parce qu’il comporte plusieurs plombs ou victimes.

Les projectiles gardent leur propriétaire, leur partie et leur type après le
retour au kit personnel. La pause et la fin de partie arrêtent leur simulation.
Les effets utilisent des formes distinctes et la même projection horizontale
que les menaces. Ce travail ne produit pas de nouvelles planches de mains par
personnage et ne constitue pas une validation artistique de toutes les vues.

## DLC et contrôles du HUD

Les suites Nexus sont dans le contenu commun. Les contrats Halo et Alien restent
dans leurs dossiers DLC. Le profil base contient donc 24 contrats, Halo seul ou
Alien seul 26, et leur combinaison 28. Les tests de profils importent les sources
avec les dossiers exclus physiquement absents et conservent leurs sauvegardes.

Les deux workflows en échec sur le point de reprise avaient la même cause : le
contrôle de texte comptait un libellé compact en `display:none` comme un texte
coupé. La sonde relève maintenant séparément les fragments non peints. Les vrais
textes coupés, ellipses, opacité nulle, `visibility:hidden` et boutons sans texte
continuent d’échouer. Une recette dédiée couvre seize cas avec le CSS du produit.

Voir [le diagnostic DLC](DLC_REVIEW_STATUS_2026-11-08.md). Les profils de distribution,
les exports différentiels et les politiques de ressources communes conservent
leur contrat. L’installation de code pendant une partie reste hors de ce lot.

## Excel et preuves

Le classeur conserve ses six onglets et les **3 824 propositions pour 1 912
identités**. La table des contrats jouables est enrichie avec les 28 contrats,
leurs prérequis et les objectifs alternatifs. Les propositions, profils et
champs de suivi existants restent distincts des contrats intégrés.

Les tests moteur couvrent les 32 conclusions des contrats précédents et les
48 combinaisons des suites par déplacement réel, avec sauvegarde à chaque étape,
refus des mauvaises cibles et de la répétition des récompenses. Le catalogue
d’export conserve les positions, constats et branches pour le classeur.

Les recettes navigateur de la PR vérifient le journal FR/EN en trois formats,
les parcours Cité et leurs checkpoints, les commandes FPS et les modes rejoués.
Leur réussite doit être rattachée au commit testé dans la description de PR.
Les contrôles de données, le moteur, les fixtures et le navigateur sont des
preuves différentes ; aucun test ne certifie l’ensemble des 3 824 propositions.

Le premier run de ce lot (`42482032203`, head `8314d94`) a terminé 70 des 88
exécutions de contrats. Les deux parcours Nexus de bureau se sont arrêtés au
même contrôle de marche, au relevé hérité de Nova. La trace française place déjà
le joueur à `(1305.14, 813.92)`, à environ 42,2 unités de la borne `(1280, 780)`
dont la portée est 72. L’action avait réussi sans déplacer le joueur. La preuve
de proximité, jusque-là réservée aux rapports à l’ancre, est donc étendue aux
bornes de contrat sans changer une règle du jeu ou un seuil de mouvement.

Le lecteur de fixture observe la zone réelle par son identifiant. Il choisit le
fiber React associé au tableau d’obstacles vivant par identité, puis vérifie
l’empreinte physique exacte de la borne. Cela évite de confondre une ancienne
zone, une autre étape, un autre univers ou une position périmée avec la cible
courante. Le validateur conserve tous les contrôles de clic, temps, vitesse et
déplacement par frame. Les cinq tests d’observation couvrent aussi le cas où une
ancienne zone a la même géométrie mais une action ou un univers différent.
Les six tests Python de preuve de mouvement passent ; le lot ciblé observation,
focus, journal et modales passe 40/40. Les règles Cité et le classeur restent
inchangés par ce correctif de recette. Le journal reçoit séparément la correction
produit du parcours Tab depuis ses titres, décrite dans son compte rendu.

Ce premier arbre a validé les 17 cas FPS, les 180 mesures de vues schématiques,
les six variantes d’archive et les quatre distributions DLC. Il ne constitue pas
la validation des corrections suivantes : leur résultat navigateur doit rester
rattaché à leur propre commit dans la PR.

Le build complet du même arbre a révélé un garde de progression encore attaché
à l’ancien emplacement de `state.muzzle = 36` dans Hub. Cette affectation est
désormais dans le helper de tir. Le garde suit maintenant la liaison réelle vers
ce helper et vérifie séparément consommation, cadence, flash, recharge et les
deux chemins d’affichage des projectiles. Ses régressions exécutent les assertions
réelles avec douze défauts injectés ; la suite passe 39/39. Les commandes prebuild
restent inchangées. Le lancement local de l’audit complet reste arrêté plus tôt
par un atlas absent, sans supprimer ce contrôle de ressource.

La compilation complète locale s’arrête sur le checkout partiel des médias
(8 178 sources DLC non matérialisées). Chromium local refuse son socket avant
l’ouverture d’une page. Les workflows GitHub exécutent le build de production
et les recettes natives avec les ressources du dépôt. Le rapport final donne
leurs résultats effectifs, sans remplacer cette validation par les tests locaux.
