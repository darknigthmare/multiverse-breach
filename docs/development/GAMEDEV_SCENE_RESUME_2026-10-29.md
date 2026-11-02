# Reprise des déplacements et de la simulation — 29 octobre 2026

## Critères joueur

- En Ville et en Extinction, une pause, un menu ou une perte de focus efface les
  déplacements. Revenir à la scène exige un nouvel appui ; une répétition de la
  touche restée enfoncée ne relance pas le personnage.
- Relâcher une touche physique libère sa commande même si son caractère ou le
  focus a changé. Les autres touches et contacts actifs restent indépendants.
- Sur un bouton de déplacement, Entrée et Entrée du pavé numérique sont deux
  appuis distincts. Le mouvement dure jusqu'au dernier relâchement.
- La première image après la pause du shell ou du terminal Intel ne fait pas
  avancer Extinction, même sans image intermédiaire pendant la pause. Les
  déplacements, dégâts, zone et recharges reprennent ensuite au pas fixe habituel.

Cette continuation applique le guide `input-systems` épinglé dans
[GAMEDEV_GUIDE.md](GAMEDEV_GUIDE.md), ainsi que le contrat local de simulation et
de cycle des menus. Les fichiers amont restent inchangés.

## Défauts reproduits avant correction

Les reproductions partent du code de la PR au commit
`44c81460793162668d4e9bde699d6c4d95fe2dec`.

| Parcours réel testé | Résultat avant correction |
| --- | --- |
| Appui Z, effacement des commandes en Ville, répétition du même appui | La commande `z` réapparaissait et le personnage recommençait à se déplacer. |
| Même parcours en Extinction | La commande `forward` réapparaissait après la reprise. |
| Appui Q, relâchement de la même touche physique avec un caractère différent | Extinction conservait `strafeLeft`, car le relâchement dépendait du caractère courant. |
| Entrée principale et Entrée du pavé numérique sur le vrai `SceneHoldButton` | Les deux événements natifs partageaient une source ; relâcher l'un arrêtait le déplacement. |
| Pause shell ou Intel de 500 ms, sans image exécutée pendant la pause | La première image exécutait six pas de simulation : temps de 1 à 7, recharge de 179 à 173. |

Le rattrapage de l'horloge était borné à 100 ms : les six pas observés ne
représentent pas les 500 ms entières. Dans le scénario de régression avec une zone
dangereuse imminente, ces pas provoquaient aussi des dégâts à la reprise. Les
tests comparent donc l'état complet de la simulation, pas seulement son compteur.

Les nouveaux tests de commandes exécutaient sept cas en échec et sept réussites
sur le code précédent. Les nouveaux tests de pause donnaient cinq échecs et une
réussite. La reproduction Entrée/pavé numérique utilisait le vrai composant
compilé et des événements clavier natifs dans Chromium, sans erreur de page.

## Application au code

`HubScreen.jsx` ignore les répétitions de déplacement après nettoyage et libère
les sources physiques d'Extinction avant toute interprétation du caractère de
relâchement. Le filtrage des champs d'édition et des commandes d'interface reste
couvert. Les routes de tir, rechargement, collecte et capacité conservent leur
comportement de répétition existant ; cette correction concerne le déplacement.

`SceneHoldButton.jsx` adapte désormais `HeldControlButton` au contrat
`onInput(source, action, active)` des scènes. Le registre de la scène conserve la
référence des appuis actifs. Les sources physiques, les annulations et le
nettoyage proviennent du composant partagé, déjà utilisé en duel et en mêlée.
Un appui au pointeur continue de donner le focus au bouton ; un changement
d'action remonte le contrôle et libère les anciennes sources.

Extinction conserve la référence de son horloge et la réinitialise à chaque
transition de pause du shell et du terminal Intel. Le nettoyage de l'effet de
rendu ne détache que sa propre horloge. La gestion existante de visibilité et le
pas fixe de 60 Hz restent employés.

## Validation

Les nouveaux cas sont intégrés à `test:gamedev` et `test:ui-immersion`. La fixture
de commandes existante inclut maintenant le vrai `SceneHoldButton` et son
registre de scène. Aucun outil de test supplémentaire ni dépendance du jeu
n'est ajouté.

Vérification locale avec Node 24.22.1 et Chromium 153.0.8010.0 ; GitHub Actions
utilise la version Node 22 prévue par le projet.

| Contrôle exécuté | Résultat |
| --- | --- |
| `scripts/sceneKeyboardInput.test.mjs` | 14 cas réussis, dont mouvement réel, nettoyage, changement de caractère et conservation des routes de tir. |
| `scripts/extinctionPauseTiming.test.mjs` | 6 cas réussis : montage initial, shell, Intel, deux ordres de pauses superposées et remplacement du rendu. |
| Régressions existantes de temps | `extinctionTiming.test.mjs` : 4/4 ; `fixedStepClock.test.mjs` : 10/10. |
| `npm run test:gamedev` | Les 10 fichiers de tests passent ; intégrité des 23 fichiers amont vérifiée. |
| `npm run test:ui-immersion` | Les 14 fichiers de tests passent. |
| Oxlint ciblé | Les sept fichiers JavaScript/JSX modifiés passent. |
| Compilation Vite de l'application | Réussie ; les audits `prebuild` complets restent distincts. |
| Compilation des trois fixtures existantes | Réussie, 42 modules. |
| Navigateur, fixture de commandes | 18 scénarios réussis à 900 × 700, dont les trois nouveaux cas Ville/Extinction ; aucune erreur de page. |

Les flèches répétées restent consommées par le jeu actif sans réacquérir la
commande effacée. Cette propriété est vérifiée dans les deux tests de nettoyage
et a été relue avec des événements clavier natifs sur une page défilable.

Pour rejouer les nouveaux cas directement :

```sh
node scripts/sceneKeyboardInput.test.mjs
node scripts/extinctionPauseTiming.test.mjs
npm run build:gamedev:fixture
PLAYWRIGHT_FIXTURE_DIR=.tmp/gamedev-display npm run test:gamedev:input-browser
```

Une relecture indépendante du candidat final n'a pas relevé de bloqueur. Le
premier passage GitHub a ensuite détecté une assertion ancienne de
`mosaicCityRuntime.test.mjs` qui cherchait les gestionnaires directement dans
`SceneHoldButton`. Ce contrôle suit désormais la délégation vers
`HeldControlButton` et son gestionnaire d'appuis, tout en conservant les
vérifications d'annulation et de propagation clavier. Les scénarios natifs
d'annulation déjà exécutés restent applicables au même code du jeu.

Le test de raccordement corrigé passe seul et sa relecture indépendante conserve
tous les contrats voisins. Dans la suite City complète locale, 33 cas passent ;
le seul autre cas exige le bitmap réel du Nexus et son manifeste, absents du
checkout partiel. Ce contrôle d'asset reste intact et est exécuté dans le workflow
City/Extinction avec les fichiers réels du dépôt.

Les preuves locales ci-dessus précèdent la publication ; le statut des workflows
sur le commit publié reste indiqué séparément dans la PR.

## Portée des preuves

Les tests Node exécutent les véritables callbacks, effets de pause et blocs de
simulation extraits du composant courant. Leurs délimiteurs explicites font
échouer le test si le code change de structure. Les services sans lien avec le
scénario, le rendu Canvas et le montage React complet sont remplacés dans ces
tests ciblés.

La fixture navigateur monte les vrais boutons et composants de réglage, avec
les registres et mappings indiqués par chaque scénario. Elle utilise les vrais
événements clavier et pointeur. Les changements de focus de fenêtre, de
visibilité et certains contrôles de fixture sont injectés et identifiés dans
le journal. Ces preuves ne constituent pas une partie complète sur téléphone
physique ni une validation du rendu de toutes les cartes.

Le build Vite local et les contrôles de navigateur sont distincts du build
complet de production, qui exécute également les audits d'assets dans GitHub
Actions. L'état des workflows du commit publié et leurs liens figurent dans la PR.
