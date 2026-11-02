# Appuis simultanés et reprise des commandes — 29 octobre 2026

Cette continuation applique les guides `input-systems` et `game-ui-ux` liés
dans [le guide du projet](GAMEDEV_GUIDE.md), à la révision amont épinglée.
Elle prolonge les corrections de clavier et de stockage de la PR #15.

## Critères joueur

- Deux doigts sur la même commande ne doivent pas s'annuler au premier
  relâchement : déplacement, garde et charge restent actifs jusqu'au dernier.
- Espace, Entrée et Entrée du pavé numérique sur un bouton sont des sources
  distinctes. L'activation répétée par le système ne crée pas un nouvel appui.
- Déplacer le focus libère l'activation clavier du bouton, tout en conservant
  les doigts encore posés. Une annulation ou perte de capture ne libère que
  le pointeur concerné.
- Le relâchement hors du bouton doit arriver au jeu. Un clic droit ne doit
  pas démarrer une commande de combat.
- Pause, perte de focus de la fenêtre, onglet masqué et démontage nettoient
  les appuis. Après un tag ou un changement de combat, les anciens appuis
  ne doivent pas se réactiver ni supprimer une nouvelle commande.

## Défauts reproduits avant modification

Dans `MeleeControlsPanel`, les événements étaient transmis sans leur source.
`GameCanvas` conservait seulement un ensemble de noms d'actions. Deux appuis
sur Garde ajoutaient donc le même nom, puis n'importe quel relâchement le
supprimait. Cela interrompait aussi un déplacement et libérait une attaque
chargée avant le dernier relâchement.

Les scénarios clavier et de garde tactile ont été reproduits dans Chromium
153.0.8010.0 avec le vrai panneau, les fonctions d'entrée extraites de
`GameCanvas` et des événements natifs. La libération prématurée de la charge
a également été reproduite avec les callbacks réels et `EngineSmash` :

| Scénario | Avant | Après correction |
| --- | --- | --- |
| Espace et Entrée sur Garde, puis Entrée relâchée | Garde désactivée malgré Espace maintenu | Garde maintenue |
| Deux contacts tactiles sur Garde, puis retrait d'un doigt | Garde désactivée malgré l'autre doigt | Garde maintenue |
| Deux contacts sur Charge, puis retrait d'un doigt | Fin de charge prématurée | Charge maintenue |

Les trois premières reproductions et leurs corrections sont également
vérifiées par les callbacks réels et `EngineSmash`. La vérification du focus
après correction est une interaction navigateur ; elle n'est pas présentée
comme une reproduction native avant correction.

Le duel utilisait une source tactile unique par action dans
`createFighterHeldInputs`. Le même double appui suivait donc le même chemin
de libération prématurée. Ses tests exécutent les véritables callbacks de
`FighterMode` et `EngineFighter`, pour les deux camps.

## Changements et raisons

`HeldControlButton` et `createHeldControlInput` identifient chaque pointeur
et chaque touche d'activation. Ils gèrent capture, relâchement, annulation,
focus du bouton, désactivation, visibilité et nettoyage des abonnements.
Les boutons de déplacement et de garde du duel et les boutons du panneau de
mêlée utilisent ce composant. Les boutons d'attaques ponctuelles du duel
conservent leur fonctionnement existant.

Chaque événement transmet sa source au registre de la scène. **Le bouton
n'agrège pas lui-même les appuis en un booléen unique.** Un tag ou un
remplacement de moteur peut effacer ce registre sans démonter le bouton ;
une agrégation locale masquerait alors un nouvel appui ou reconstruirait
des sources périmées. Le registre de la scène reste la référence.

`GameCanvas` réutilise `createSceneInputs` pour agréger les sources par
action. La conversion vers les entrées de mêlée et les règles d'attaque
restent celles du jeu. Les anciens appels sans source sont conservés sous
une source de compatibilité distincte. Le nettoyage de l'effet de combat
vide maintenant aussi les commandes avant de détruire le moteur, afin
qu'elles ne passent pas au combat suivant.

La synchronisation de combattant du duel continue de nettoyer uniquement
le camp remplacé. Une ancienne capture ou touche relâchée après le tag
ne peut plus retirer la commande d'un nouvel appui.

## Vérifications

- `heldControlInput.test.mjs` : 8 cas sur les sources, la capture, le focus,
  les annulations et la reprise après effacement de la scène.
- `fighterKeyboardInput.test.mjs` : 30 cas avec les callbacks et le moteur
  réels ; 3 cas ajoutés pour les sources des boutons et leur reprise après tag.
- `meleeTouchInput.test.mjs` : 12 cas avec les callbacks, la lecture des
  entrées, le nettoyage et `EngineSmash`. Sur le code précédent, 9 de ces
  cas échouaient ; les 12 réussissent après correction.
- Le remappage et le stockage existants restent couverts par leurs suites.
- La fixture Chromium monte le vrai panneau de mêlée et le composant de
  commande. Elle réutilise les fonctions d'entrée de `GameCanvas` extraites
  au build et ne monte pas toute l'application.

### Résultats locaux de la continuation

| Vérification | Résultat |
| --- | --- |
| Intégrité des guides | 23 fichiers amont vérifiés, sans modification de la copie épinglée |
| `test:gamedev` | 8 fichiers de tests réussis |
| `test:ui-immersion` | 12 fichiers de tests réussis |
| Régressions existantes ciblées | 9 fichiers de tests de duel, d'horloge et de mapping/stockage de mêlée réussis |
| Commandes dans Chromium 153.0.8010.0 | 15 scénarios réussis à 900 × 700, sans erreur de page |
| Affichage et stockage dans Chromium | Les deux fixtures précédentes passent toujours, y compris le refus natif de stockage |
| Compilation Vite | Application : 314 modules ; fixtures : 41 modules ; compilations réussies |
| Oxlint | 12 fichiers JavaScript/JSX modifiés vérifiés sans erreur |

Les touches, la souris, les contacts tactiles et les annulations de pointeur
sont natifs. La vérification de capture observe les événements de confiance
`gotpointercapture` et `lostpointercapture`. Les événements de perte de focus
de la fenêtre et de visibilité sont injectés dans la fixture ; ils ne sont
pas présentés comme un changement d'application au niveau du système.
Les commandes de la fixture pilotent aussi les états désactivé/démonté et
l'effacement du registre. Le cas Échap utilise le vrai `CombatDrawer` : il
annule d'abord le remappage, puis ferme le dialogue au second appui et rend
le focus au bouton d'ouverture.

Les vérifications locales utilisent Node 24.22.1. Les workflows ciblent
Node 22 ; le build complet avec médias et audits `prebuild` est exécuté
sur GitHub. La compilation Vite locale seule ne remplace pas ce contrôle.

```bash
npm run test:gamedev
npm run test:ui-immersion
node scripts/meleeInputMap.test.mjs
node scripts/meleeStorageFallback.test.mjs
npm run build:gamedev:fixture
PLAYWRIGHT_FIXTURE_DIR=.tmp/gamedev-display npm run test:gamedev:input-browser
```

Le workflow `Gamedev display browser` conserve le journal du nouveau scénario
en plus des vérifications d'affichage et de stockage. Playwright/Chromium
doivent être disponibles pour le rejouer ; les variables d'environnement
sont celles décrites dans les précédents comptes rendus.

Les tests de moteur sont exécutés sous Node ; les interactions navigateur
ciblent les composants de commande et leurs entrées. Ils ne constituent pas
une partie complète ni une validation sur appareil iOS/Android physique.
