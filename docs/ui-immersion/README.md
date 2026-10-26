# Refonte immersive — PR #9

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
