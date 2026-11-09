# Réglages résistants aux erreurs et commandes de duel — 29 octobre 2026

## Critères joueur

Cette continuation applique les guides `save-systems` et `input-systems`,
consultés à la révision amont épinglée dans [le guide du projet](GAMEDEV_GUIDE.md).

- Un refus du stockage local ne doit pas interrompre l'import du moteur audio
  ni le chargement des commandes de mêlée.
- Les réglages audio et les nouvelles affectations doivent pouvoir être
  appliqués malgré l'impossibilité d'enregistrer. Une écriture échouée ne doit
  pas toucher la progression ou les affectations précédemment enregistrées.
- Avec un stockage disponible, les réglages valides doivent rester identiques
  après un rechargement.
- En duel, relâcher un alias ne doit pas interrompre un déplacement ou une
  garde encore maintenus par une autre touche. Un changement de combattant doit
  supprimer ses anciennes commandes sans neutraliser l'autre joueur.

## Défauts reproduits et corrections

### Stockage local refusé

`audioPreferences`, le constructeur de `SoundEngine` et `meleeInputMap`
acquéraient `globalThis.localStorage` dans leurs paramètres par défaut, avant
leurs blocs de protection. Un getter refusé par le navigateur lançait donc
`SecurityError` dès l'appel. L'import du singleton audio échouait ; le remappage
des commandes pouvait également échouer lors d'une écriture refusée ou d'un
quota plein.

Ces chemins réutilisent maintenant `getBrowserStorage`, `readStorageValue` et
`writeStorageValue` du projet. Les valeurs par défaut restent disponibles quand
la lecture échoue. L'application des réglages en mémoire et le retour des
affectations normalisées ne dépendent plus d'une écriture réussie. Les schémas,
les clés de stockage et les valeurs valides restent ceux du jeu.

Cette protection ne rend pas l'enregistrement disponible : les préférences
audio restent dans le moteur de la session, et les affectations retournées
restent utilisables par le combat courant. Un rechargement sans stockage peut
revenir aux valeurs par défaut.

### Sources de commandes en duel

Les gestionnaires réels de `FighterMode` reproduisaient deux cas : relâcher Q
avec Flèche gauche encore tenue ramenait la direction à zéro ; relâcher
ShiftRight avec ShiftLeft encore tenu annulait la garde. Les booléens d'action
ne distinguaient pas les touches qui les maintenaient.

`createFighterHeldInputs` conserve maintenant chaque source physique, avec un
registre distinct pour chacun des deux camps et pour les commandes tactiles.
Le relâchement utilise le code physique même si la casse, le caractère ou le
focus a changé. Le mapping du jeu et les actions ponctuelles restent en place.

Le nettoyage est raccordé aux transitions existantes. La synchronisation des
propriétaires de combattants efface aussi les sources lors d'un tag ou d'un
remplacement après K.O., avant et après les étapes de simulation concernées.

## Vérification navigateur du stockage

La fixture importe le vrai singleton `soundEngine`, le bouton `AudioControl`
et `MeleeControlsPanel`. Elle utilise les véritables fonctions de chargement,
d'enregistrement, de remappage et de lecture clavier. Les callbacks React
nécessaires sont fournis par la fixture ; elle ne monte pas toute l'application.

Deux contextes Chromium sont vérifiés : stockage normal, puis iframe munie
uniquement de `sandbox="allow-scripts"`. Dans ce second cas, le navigateur
lui-même refuse `window.localStorage` avec `SecurityError` ; le test ne remplace
pas le getter. Les modules se chargent, le volume et le mute changent, une
nouvelle touche gauche s'applique et la réinitialisation fonctionne, sans
erreur JavaScript de page. Le contexte audio reste fermé avant interaction de
déverrouillage. Avec stockage normal, les valeurs persistent après rechargement.

La vérification a réussi localement sous Chromium 153.0.8010.0. Le workflow
[Gamedev display browser](../../.github/workflows/gamedev-display.yml) exécute
désormais aussi ce scénario et conserve son journal.

## Résultats locaux

| Vérification | Résultat |
| --- | --- |
| Nouvelles régressions de stockage | 3 cas audio et 3 cas de commandes de mêlée réussis ; les défauts ont été reproduits avant correction |
| Nouvelles régressions de duel | 27 cas réussis avec les gestionnaires réels et `EngineFighter`, dont les alias, les deux joueurs, le tactile et les changements de combattant |
| `test:gamedev` | 6 fichiers de tests réussis et intégrité des 23 fichiers amont vérifiée |
| `test:ui-immersion` | 11 fichiers de tests réussis |
| Suites existantes concernées | 7 scripts de duel/horloge, 4 cas audio et 7 cas de mapping de mêlée réussis |
| Navigateur : stockage | Réglages, remappage et réinitialisation réussis avec stockage disponible ou refusé ; persistance après rechargement vérifiée avec stockage disponible ; aucune erreur de page |
| Navigateur : affichage | Trois dimensions d'écran, marges 0/6/32 px, échelles 90/100/140 % et préférences de mouvement réduit toujours validées |
| Compilation Vite | Application : 312 modules ; fixtures isolées : 32 modules ; compilations réussies |
| Oxlint | 13 fichiers JavaScript/JSX modifiés vérifiés sans erreur |

## Rejouer les vérifications

```bash
npm run test:gamedev
npm run test:ui-immersion
node scripts/audioPreferences.test.mjs
node scripts/soundEngineGesture.test.mjs
node scripts/meleeInputMap.test.mjs
npm run build:gamedev:fixture
PLAYWRIGHT_FIXTURE_DIR=.tmp/gamedev-display npm run test:gamedev:browser
PLAYWRIGHT_FIXTURE_DIR=.tmp/gamedev-display npm run test:gamedev:storage-browser
```

Playwright et Chromium doivent être disponibles pour les deux dernières
commandes. Les variables de sélection d'une installation existante sont
décrites dans [le premier compte rendu](GAMEDEV_APPLICATION_2026-10-29.md).
Le test stockage utilise plusieurs contextes isolés ; ne pas lui imposer
`--single-process`. Les versions locales sont Node 24.22.1 et Vite 8.1.0 ;
les workflows ciblent Node 22.

Les vérifications de duel exécutent les gestionnaires et le moteur sous Node.
La fixture navigateur du stockage ne prouve ni un parcours complet de combat,
ni l'équilibre sonore à l'écoute. Le build complet avec les médias et les audits
`prebuild` reste le rôle du workflow de production.
