# Refonte immersive — PR #9

Suite du 7 novembre : [menus, guide Cité et cadrage FPS](../development/DLC_UI_CITY_FPS_COMPLETION_2026-11-07.md).
Cette suite raccorde Régulation et Portal Lab à l’isolation modale commune,
ajoute un guide repliable et corrige les découpes de mains Arthur/Serj. Elle
complète les recettes historiques ci-dessous sans réécrire leurs observations.

La première inspection des captures de cette suite a montré deux limites
concrètes à corriger : le corps du guide trop court à 844 × 390 et le bandeau
relais chevauchant le quai FPS à HUD 140 %. En hauteur inférieure ou égale à
560 pixels, la carte guide ouvre désormais directement le texte complet dans
le terminal. Pause/Reprendre y reste accessible ; la fermeture rend le focus
au bouton Terminal, même si la pause a retiré la carte. Le bandeau relais en
paysage utilise deux rangées et réserve la largeur réelle du radar, en gardant
toutes ses instructions et l’échelle choisie.

Les deux fenêtres héritées respectent désormais la taille du texte et la marge
de sécurité des réglages. Le dossier de portail et les planches de Régulation
sont accessibles au clavier dans une zone de défilement propre ; les noms longs
de Trame et l’explication du laboratoire restent lisibles sur mobile. La fixture
`browserMenuAccessibility.mjs` compare les polices réelles à 100 % puis 150 %, les
limites d’une marge de 32 pixels, la fermeture et le focus imbriqués, et une
galerie de neuf planches à parcourir au clavier. Elle prévoit 12 parcours
FR/EN, menus/guide, en 390 × 844, 844 × 390 et 1 365 × 900. Les images de contrôle
et le nom long sont synthétiques ; le portail utilise le vrai fallback Nexus.
Le résultat navigateur de la branche doit être lu dans le workflow
`gamedev-display.yml`, séparément de la compilation et des tests unitaires.
Les critères du guide contrôlent les rectangles de chaque ligne d’instruction
et l’absence d’occultation, la pause/reprise explicite et le transfert de focus
lors d’une rotation portrait vers paysage. Les preuves FPS vérifient en plus
le dégagement du radar, du réticule et du quai sur toutes les phases du relais.

### Portée du suivi des 40 écrans

Les quatre ledgers historiques contiennent 39 lots : 11 pour le shell, 12 pour
le Hub, 8 pour le combat et 8 pour App. Leurs entrées décrivent déjà des
implémentations, avec un lot de suivi global encore en vérification. Elles ne
désignent donc pas 40 écrans dont le code resterait à construire. Leur recette
consolidée conserve des parcours à revoir : catalogues denses, zoom/comparaison
et plein écran de galerie, transitions briefing/combat, étapes du combat
personnalisé et lecteurs d’écran. Les appareils physiques et le cloud réel
restent distincts de ces tests locaux ou CI.

Certaines limites concernent toujours le produit : les textes et jauges Canvas
historiques ne se redimensionnent pas tous comme les menus DOM, les autres
quartiers gardent des décors procéduraux et les libellés des catalogues ne sont
pas tous localisés. Les travaux ci-dessus ferment des défauts précis des menus ;
ils ne constituent ni une certification visuelle de tout le jeu ni la livraison
des illustrations encore prévues.

Cette refonte applique l’audit des **40 écrans** à l’interface de Multiverse Breach. Les scènes de jeu occupent le viewport ; les informations permanentes suivent l’action ; les détails, collections et réglages restent accessibles dans des panneaux dédiés. Les moteurs, contenus, choix narratifs et fonctions existantes sont conservés.

- [Pull request #9](https://github.com/darknigthmare/multiverse-breach/pull/9)
- [Classeur Excel](../excel/Multiverse_Breach_UI_Immersion.xlsx)
- [Preuves et état des vérifications](validation.json)

## Reprise du 26 octobre 2026

Le duel conserve désormais son moteur lors des rendus du parent, pauses et réglages. Une revanche explicite recrée la rencontre avec la dernière configuration. Les panneaux changent réellement entre dialogue non modal et modal natif, puis rendent le focus au bon contrôle.

Preuves : **68 tests UI, 40 tests Fighter, 8 nouveaux parcours Chromium et 6 parcours Fighter existants réussis** ; lint sans erreur ni avertissement ; compilation source réussie. Les huit nouveaux parcours couvrent quatre formats de 390 à 2560 pixels et le français/anglais. Les états et combattants sont synthétiques : ce n’est pas la validation artistique de tous les écrans ni un essai de périphérique réel.

[Compte rendu et empreintes des fichiers testés](continuation-2026-10-26.json) · [Exécution de preuve](https://github.com/darknigthmare/multiverse-breach/actions/runs/40268408942) · [Vérifications du commit actuel](https://github.com/darknigthmare/multiverse-breach/pull/9/checks). Les résultats historiques du 25 octobre restent archivés dans [validation-2026-10-25.json](validation-2026-10-25.json).

Le classeur existant conserve ses cinq feuilles et ses 39 lots ; les lignes de preuve de reprise complètent son journal. Le fichier livré a été actualisé avec le runtime Python artifact_tool. Les descriptions de reprise et empreintes ci-dessus complètent les anciennes données du générateur ; une régénération depuis les seuls ledgers initiaux ne reproduit pas exactement ces annotations supplémentaires.

## Lire le classeur

| Feuille | Contenu |
| --- | --- |
| Synthèse | Couverture du code, résultats automatiques et observations navigateur comptés séparément. |
| 40 écrans | Problème initial, priorité, destination des informations, changements, conservation et critères d’acceptation de chaque écran. |
| Actions | 39 lots reliés aux écrans, fichiers, contrôles et limites. |
| Conservation | Destination de chaque fonction après réorganisation. |
| Vérifications | Journal des tests, preuves, résultats historiques et contrôles encore à effectuer. |

L’audit initial est une référence historique. Il ne constitue pas une observation de la nouvelle branche. Un écran dont le code a changé n’est pas automatiquement déclaré vérifié en navigateur. Les scénarios CI avec données ou médias de remplacement sont identifiés comme synthétiques.

## Organisation des écrans

### Scènes de jeu

RPG, tactique, mêlée, Fighter, Cité, Extinction et Course occupent la surface disponible. Les moteurs qui dépendent d’un espace logique conservent leur ratio et leurs coordonnées : les acteurs, cases et zones interactives ne sont pas recadrés pour remplir artificiellement l’écran.

Les commandes rapides restent près des bords. L’Arsenal garde les invocations, signatures, reliques et options de combat accessibles pendant l’action. Les panneaux de briefing et de commandes suspendent la simulation. Les scènes dédiées du Hub disposent de leur propre barre de retour/pause.

Les bilans restent dans la scène jusqu’à validation explicite. Un résultat ne déclenche ses récompenses qu’une fois ; un ancien callback ne peut pas récompenser une nouvelle session. La pause conserve le moteur monté et son état. Une reprise demande une action du joueur, y compris après un changement d’onglet.

### Hub et progression

Le Hub utilise une navigation latérale et des espaces internes. La console Directive regroupe les informations de progression auparavant réparties dans plusieurs blocs. Le retour d’une mission retrouve la catégorie, la sélection et les filtres de préparation.

La Cité garde son déplacement et ses services ; journal, destinations et guide passent dans le terminal. Extinction garde ses quatre variantes, ses gains, son radar et sa jauge PV courant/maximum. Course conserve garage, carrière, commandes et bilan. La bataille personnalisée expose ses réglages en quatre étapes sans réduire les options.

### Collection, portail et système

Le portail met le booster sélectionné en scène. Catalogue, probabilités, garanties et laboratoire restent accessibles avant les achats. L’Album garde ses filtres, classeurs, historique et fiches détaillées. La galerie CG garde son image principale, sa pellicule, ses filtres, zoom et comparaison. Les dossiers d’univers conservent leurs sources.

Le menu Système regroupe son, réseau, compte et affichage. Les préférences de taille du texte, HUD, marge, contraste et mouvement sont stockées séparément de la progression. Le plein écran système se déclenche sur une action explicite ; le jeu utilise sinon toute la surface disponible.

Les décisions de sauvegarde utilisent des dialogues intégrés, avec file d’attente, isolation des couches, gestion d’Échap et retour du focus. Après une attente, l’import ou la réconciliation vérifie à nouveau le compte courant, la sauvegarde et la session. Les protections contre une écriture cloud involontaire et les copies de secours sont conservées.

## Contrôles de la PR

`test:ui-immersion` est ajouté au prebuild et au workflow de fiabilité. Les contrôles de production existants restent en place. Les parcours navigateur ouvrent les nouveaux menus par leurs boutons visibles ; les assertions de simulation et de conservation des fonctions sont maintenues.

Les résultats détaillés et leurs limites se trouvent dans [validation.json](validation.json) et dans le classeur. Les premières exécutions ont notamment détecté la jauge PV Extinction perdue lors du déplacement du HUD, puis des parcours CI qui cherchaient encore Compte/Invocation à leur ancien emplacement. Les corrections et les nouvelles exécutions sont consignées séparément de ces résultats historiques.

Le checkout de travail est partiel ; les builds distants utilisent le dépôt complet et ses médias. Les tests synthétiques de géométrie couvrent plusieurs ratios et échelles de HUD. Ils ne constituent pas des essais de manette physique ou de multitouch sur appareil réel. La synchronisation avec un vrai compte et la progression exhaustive restent hors de cette recette.

## Régénération du classeur

Les quatre ledgers `*-implementation.json`, l’audit initial, la traduction `workbook-content.fr.json` et le manifeste `validation.json` alimentent le fichier Excel. Le générateur recalcule les formules, vérifie les références et rend les cinq feuilles pour contrôle visuel.

```sh
bash scripts/ui-immersion/build-workbook.sh --qa-dir /tmp/multiverse-workbook-qa
```

Le runtime d’artefacts requis et le format des preuves sont décrits dans [le guide du générateur](../../scripts/ui-immersion/README.md). Aucun outil de génération de classeur n’est ajouté aux dépendances du jeu.

## Suite Cité et Extinction — 26 octobre 2026

La Cité conserve ses habitants lors des réaffichages équivalents, annule le trajet automatique à l’ouverture du terminal et restaure la position après remontage. Les contrôles maintenus ont désormais chacun leur source ; le relâchement d’une touche ou d’un doigt ne libère plus un autre contrôle. La récupération graphique n’efface ni la position ni la progression.

Extinction dispose d’un panneau **Directive · Commandes** suspendant la simulation, d’une visée distinguant le glissement lent du clic, de contrôles capturés et d’un bilan modal avec focus. Les quatre variantes et leur économie existante restent intactes. Une panne de rendu ne donne pas une victoire ; elle permet de revenir à la préparation.

[Reçu complet, images décodées et empreintes](city-extinction-continuation-2026-10-26.json) · [Exécution réussie](https://github.com/darknigthmare/multiverse-breach/actions/runs/40279377677). **64 tests ciblés, 68 tests UI et 10 parcours Chromium réussis**, zéro erreur/avertissement de lint et compilation source réussie. Les suites unitaires se recoupent. Les quatre formats et FR/EN utilisent les médias réellement présents dans le dépôt ; fins et pannes sont injectées, le profil est préparé et le serveur est isolé.

Le classeur garde **5 feuilles, 40 écrans, 39 lots** et comporte désormais **132 entrées de vérification**. Les écrans Cité/Extinction sont marqués **Partiel**, pas intégralement validés. L’aperçu du journal de la Cité reste tronqué à HUD 1,4 (texte complet dans le terminal), des silhouettes ennemies FPS restent génériques et les libellés de catalogue ne sont pas tous localisés. Quartiers/services complets, vrais périphériques, compte cloud, progression naturelle et recette consolidée des 40 écrans restent ouverts.

Le workflow permanent `city-extinction-ui.yml` exige le décodage des fonds avant de valider les parcours. Le reçu précédent prouve les fichiers exacts ; il ne préjuge pas de l’état des vérifications du commit final, consultables dans [Checks](https://github.com/darknigthmare/multiverse-breach/pull/9/checks).

## Suite : services et parties Extinction

Voir [le compte rendu](scene-completion-2026-10-26.md) et [les preuves locales et empreintes](scene-completion-2026-10-26.json). Le classeur courant contient 144 vérifications ; les observations initiales et reçus précédents restent conservés.
