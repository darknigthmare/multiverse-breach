# Guides de développement appliqués à Multiverse

## Périmètre et activation

Cette intégration est propre au dépôt. Les agents lisent [AGENTS.md](../../AGENTS.md)
puis sélectionnent le guide du chantier en cours. Elle n'ajoute aucune dépendance
au jeu et ne suppose pas une installation personnelle ou globale de skills.

La sélection provient de
[awesome-gamedev-agent-skills](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/tree/19d93f97c9c1ea0f8b306e77aa81e0d3e352d3e9),
révision `19d93f97c9c1ea0f8b306e77aa81e0d3e352d3e9`.
Le [manifeste](../../vendor/gamedev-skills/UPSTREAM.json) fixe cette révision et
les empreintes des fichiers. Les [conditions Apache-2.0](../../vendor/gamedev-skills/LICENSE)
et la [notice d'attribution](../../vendor/gamedev-skills/NOTICE) sont conservées.

Trois guides et toutes leurs ressources locales sont embarqués. Le routeur est
également conservé avec ses références. Son catalogue décrit d'autres moteurs et
skills qui ne font pas partie de cette copie : utiliser les liens épinglés
ci-dessous lorsqu'un autre chantier les nécessite.

## Contrat technique du jeu

Cartographie établie sur `fed79e8fdbcc811616bd0ec6f3a73b9656b5d8b9`.
Relire ces points d'entrée dans la branche courante avant toute modification.

| Contrat | Code à examiner | Règle d'intégration |
| --- | --- | --- |
| Application et outillage | `package.json`, `package-lock.json`, `src/App.jsx`, `vite.config.js` | React/Vite et modules JavaScript existants ; conserver les versions verrouillées. |
| Simulation et temps | `src/components/GameCanvas.jsx`, `src/game/fixedStepClock.js` | La simulation de combat possède déjà un pas fixe ; distinguer les mises à jour de simulation et les images affichées. |
| Combat et objectifs | `src/game/engineSmash.js`, `engineRpg.js`, `engineTactics.js`, `src/game/battleCompletionGate.js` | Réutiliser les moteurs et la résolution de combat ; vérifier récompenses, fin unique et retour au hub. |
| Présentation et contrôle | `src/components/GameCanvas.jsx`, `src/game/combatViewport.js`, `combatDialogLifecycle.js`, `dialogFocus.js` | Garder les coordonnées écran/monde cohérentes ; un menu doit avoir un propriétaire d'entrée explicite. |
| Commandes de course | `src/components/RaceMode.jsx`, `src/game/raceSessionControls.js`, `sceneInputs.js` | Conserver la source de chaque touche/pointeur ; relâcher un alias ne doit pas neutraliser un autre appui. Effacer les commandes manuelles à la pause et à la perte de focus. |
| Commandes de duel | `src/components/FighterMode.jsx`, `src/game/fighterControlOwnership.js` | Conserver les sources par camp et par combattant actif ; un tag ou K.O. efface les commandes du combattant remplacé. |
| Déplacement en Ville et Extinction | `src/components/HubScreen.jsx`, `src/components/SceneHoldButton.jsx`, `src/game/sceneInputs.js` | Relâcher par source physique, même si le caractère ou le focus change. Après une pause, un menu ou une perte de focus, un déplacement exige un nouvel appui ; la répétition clavier ne recrée pas la commande effacée. |
| Pause de la simulation Extinction | `src/components/HubScreen.jsx`, `src/game/fixedStepClock.js` | Réinitialiser l'horloge à l'ouverture et à la fermeture de chaque pause, même sans image affichée pendant celle-ci. La première image de reprise ne rattrape aucun temps passé en pause. |
| Boutons tactiles et activation clavier | `src/components/HeldControlButton.jsx`, `src/game/heldControlInput.js`, `src/components/MeleeControlsPanel.jsx` | Chaque doigt et touche d'activation possède sa source ; seul le dernier relâchement termine l'action. Le registre de la scène reste la référence après un tag, une pause ou un remplacement de combat. |
| Réaffectation des commandes | `src/components/MeleeControlsPanel.jsx`, `src/game/melee/meleeInputMap.js` | Attendre une nouvelle pression, sans capturer la répétition d'une touche déjà maintenue. Refuser une touche de la direction opposée sur le même axe et le même joueur ; conserver les alias contextuels et les affectations de l'autre joueur. |
| Accès facultatif et déconnexion des manettes | `src/components/GameCanvas.jsx`, `src/game/browserGamepads.js`, `src/game/melee/meleeGamepadInput.js` | Une API absente ou refusée ne doit pas interrompre les commandes clavier et tactiles. Préserver les indices des manettes et réessayer aux lectures suivantes. Une déconnexion annule la charge détenue seulement par cette source ; son retour exige un état neutre propre à la manette, sans bloquer les autres sources. |
| Annulation et reprise des commandes de mêlée | `src/components/GameCanvas.jsx`, `src/game/sceneInputs.js`, `src/game/melee/meleeCombatRuntime.js` | Distinguer relâchement volontaire et annulation d'un propriétaire réel. Une charge annulée ne lance pas de coup ; un autre propriétaire maintenu la conserve. Ignorer les répétitions des touches effacées à la pause ou à la perte de focus, puis accepter un nouvel appui dès la première image de reprise. |
| Replays de vérification Extinction | `scripts/browserSceneServices.py`, `scripts/fixtures/cityExtinctionHarness.jsx` | Fixer une graine documentée et l'horloge avant START, puis comparer les états observés, décisions et tirages de deux contextes frais. Conserver les assertions de victoire et les traces d'échec ; ne pas choisir une nouvelle graine pour faire passer un scénario. |
| Assets | `src/game/renderer.js`, `spriteAssets.js`, `cosmeticVisualAssets.js` | Réutiliser les registres, règles d'atlas, variantes et chargements ; examiner le rendu au format réel. |
| Sauvegarde | `src/App.jsx`, `src/game/localSaveGuard.js`, `saveValidation.js`, `saveRecovery.js`, `safeStorage.js`, `cloudSaveConflictPolicy.js` | Le garde doit partir des octets exacts lus avec la progression, y compris un emplacement vide. Une erreur de lecture initiale bloque les écritures automatiques jusqu'à récupération explicite. Préserver schémas, migrations et stratégies de conflit ; ce contrôle optimiste ne rend pas deux écritures simultanées atomiques. |
| Audio et préférences locales | `src/game/soundEngine.js`, `audioPreferences.js`, `safeStorage.js`, `melee/meleeInputMap.js` | Un arrêt explicite annule la demande musicale ; un effet sonore ne la relance pas. La sourdine conserve la dernière scène demandée pour la reprise. Respecter le démarrage après interaction et les préférences ; l'accès refusé au stockage ne doit pas interrompre l'initialisation audio ni l'application des commandes. |

Les noms de fichiers abrégés dans une ligne partagent le dossier `src/game/`.
Les exemples Godot ou Unity des guides sont des illustrations de concepts ;
l'API de référence reste celle du projet. Lire au besoin
[la méthode pour moteur personnalisé](../../vendor/gamedev-skills/router/references/custom-engines.md).

## Guides embarqués et critères de validation

| Chantier | Guide local | Application à Multiverse | Vérification attendue |
| --- | --- | --- | --- |
| HUD et menus | [game-ui-ux](../../vendor/gamedev-skills/skills/disciplines/game-ui-ux/SKILL.md) | Mises à jour du HUD sur changements utiles, navigation, focus, empilement des menus, adaptation du combat à l'écran. | Vérifier ouverture/fermeture/reprise, retour du focus et absence d'action de jeu sous un menu ; tester les résolutions réellement ciblées. |
| Sprites et variantes | [create-game-assets](../../vendor/gamedev-skills/skills/disciplines/create-game-assets/SKILL.md) | Références par personnage/tenue, dimensions, transparence, point d'appui, états et identité visuelle cohérente. | Contrôles techniques et inspection dans chaque mode concerné ; une génération ou un chemin valide ne vaut pas validation artistique. |
| Performances | [performance-optimization](../../vendor/gamedev-skills/skills/disciplines/performance-optimization/SKILL.md) | Reproduire un combat représentatif et mesurer simulation, rendu, mises à jour React, allocations ou chargements selon le symptôme. | Comparer avant/après sur le même scénario ; préciser navigateur, matériel et mode de build pour toute affirmation de FPS. |

Le [routeur](../../vendor/gamedev-skills/router/SKILL.md) permet de reclasser une
demande lorsqu'elle change de domaine. Charger uniquement les ressources utiles
au chantier ; le présent contrat constitue l'adaptation au moteur maison.

## Guides à charger selon le chantier

Ces guides sont référencés à la même révision, mais **ne sont pas embarqués**.

| Besoin | Guide épinglé | Point d'application |
| --- | --- | --- |
| Clavier, manette, affectations | [input-systems](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/blob/19d93f97c9c1ea0f8b306e77aa81e0d3e352d3e9/skills/disciplines/input-systems/SKILL.md) | Entrées de scène et mappings de mêlée ; vérifier perte de focus et reprise. |
| Impacts et sensations | [game-feel](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/blob/19d93f97c9c1ea0f8b306e77aa81e0d3e352d3e9/skills/disciplines/game-feel/SKILL.md) | Timings d'attaque, réactions, SFX/VFX et lisibilité de l'action. |
| Caméra | [camera-systems](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/blob/19d93f97c9c1ea0f8b306e77aa81e0d3e352d3e9/skills/disciplines/camera-systems/SKILL.md) | Cadrage et limites propres au mode de jeu ; cohérence des coordonnées. |
| IA | [game-ai](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/blob/19d93f97c9c1ea0f8b306e77aa81e0d3e352d3e9/skills/disciplines/game-ai/SKILL.md) | Priorités, cibles, déplacements et objectifs des moteurs existants. |
| Niveaux | [level-design](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/blob/19d93f97c9c1ea0f8b306e77aa81e0d3e352d3e9/skills/disciplines/level-design/SKILL.md) | Arènes, champs tactiques, accès, obstacles et rythme des rencontres. |
| Progression | [rpg](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/blob/19d93f97c9c1ea0f8b306e77aa81e0d3e352d3e9/skills/genres/rpg/SKILL.md) | Inventaire, équipement, progression, quêtes et récompenses. |
| Persistance | [save-systems](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/blob/19d93f97c9c1ea0f8b306e77aa81e0d3e352d3e9/skills/disciplines/save-systems/SKILL.md) | Import, migrations, récupération et synchronisation de progression. |
| Son | [audio-design](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/blob/19d93f97c9c1ea0f8b306e77aa81e0d3e352d3e9/skills/disciplines/audio-design/SKILL.md) | Mixage, transitions musicales et nettoyage des sons. |

Si un guide distant est indisponible, travailler avec les interfaces vérifiées du
projet et signaler cette limite ; ne pas prétendre avoir chargé le guide.

## Commandes existantes à réutiliser

L'[application et ses résultats](GAMEDEV_APPLICATION_2026-10-29.md)
décrit les corrections de préférences Canvas, de commandes de course et leur
validation.

La [continuation sur les réglages et le duel](GAMEDEV_RESILIENCE_2026-10-29.md)
documente le stockage indisponible et les alias de déplacement/garde.

La [continuation sur les appuis simultanés](GAMEDEV_HELD_CONTROLS_2026-10-29.md)
documente les sources tactiles/clavier, les charges et le nettoyage entre combats.

La [continuation sur la reprise en Ville et Extinction](GAMEDEV_SCENE_RESUME_2026-10-29.md)
documente le relâchement physique, les répétitions clavier après nettoyage,
les deux touches Entrée et les transitions de pause sans image intermédiaire.

La [continuation sur l'audio et le démarrage des sauvegardes](GAMEDEV_SESSION_RELIABILITY_2026-10-29.md)
documente l'annulation d'une musique, la reprise après sourdine et la protection
de la progression entre chargement et initialisation de son garde.

La [continuation sur les affectations, manettes et replays](GAMEDEV_INPUT_AND_REPLAY_2026-10-29.md)
documente la capture d'une nouvelle touche, les conflits de direction, le refus
natif de l'API manette et la comparaison des parcours Extinction.
Le [rapport d'annulation et de reprise des commandes](GAMEDEV_INPUT_CANCELLATION_2026-10-29.md)
documente les déconnexions de manette, les annulations tactiles et la reprise
immédiate au clavier ou au tactile après nettoyage des commandes.

Choisir les suites liées au comportement modifié. Les commandes ci-dessous sont
des points d'entrée existants, pas un compte rendu de tests déjà exécutés.

| Domaine | Commandes |
| --- | --- |
| Interface et cycle des fenêtres | `npm run test:ui-immersion` |
| Temps, régressions et orientation | `npm run test:reaudit` |
| Mêlée | `npm run test:melee` |
| Combat RPG | `npm run test:audit-combat` |
| Combat tactique | `npm run test:audit-tactics` |
| Sauvegardes et fiabilité | `npm run test:audit-reliability` |
| Audio, présentation et progression | `npm run test:polish` |
| Assets et registres | `npm run sprites:availability:check`, `npm run sprites:manifest:check`, `npm run sprites:provenance:audit` |
| Code et production | `npm run lint`, `npm run build` |
| Intégrité des guides | `node scripts/checkGamedevGuidance.mjs` |
| Régressions issues des guides | `npm run test:gamedev` ; fixture navigateur : `npm run build:gamedev:fixture`, puis `PLAYWRIGHT_FIXTURE_DIR=.tmp/gamedev-display npm run test:gamedev:browser` |

`npm run build` exécute aussi `prebuild`, qui lance les contrôles du dépôt.
Distinguer la compilation Vite seule d'une validation complète. Les audits
d'assets nécessitent leurs fichiers réels ; un checkout partiel ne permet pas
de conclure à leur absence dans la version publiée.

Le workflow [Gamedev display browser](../../.github/workflows/gamedev-display.yml)
exécute la fixture d'affichage dans Chromium pour les changements concernés.
Playwright est installé pour ce contrôle uniquement. Les fixtures montent les
vrais réglages et le hook de disposition Canvas, puis le singleton audio et le
panneau de commandes avec stockage normal ou refusé par le navigateur. Elles ne
montent pas un combat complet ni les cinématiques de `GameCanvas`. Rejouer le
second scénario avec `PLAYWRIGHT_FIXTURE_DIR=.tmp/gamedev-display npm run test:gamedev:storage-browser`.
La troisième fixture monte les vrais boutons de commande et le panneau de mêlée,
avec les fonctions d'entrée de `GameCanvas` extraites lors de la compilation.
Elle vérifie notamment deux contacts tactiles natifs, les touches Espace/Entrée,
la capture du pointeur et la reprise après nettoyage. Elle monte aussi le vrai
bouton de déplacement Ville/Extinction pour distinguer Entrée du pavé numérique,
rejeter une répétition clavier après nettoyage et conserver le focus au pointeur.
Le panneau de mêlée vérifie aussi les répétitions lors d'une réaffectation,
les conflits entre directions opposées et l'annulation par Échap ou perte de focus.
La rejouer avec
`PLAYWRIGHT_FIXTURE_DIR=.tmp/gamedev-display npm run test:gamedev:input-browser`.

La quatrième fixture utilise le vrai `SoundEngine`, ses nœuds Web Audio natifs
et `AudioControl`. Elle vérifie sept transitions d'arrêt, de déverrouillage et
de sourdine, sans mesurer la qualité audible du mixage. La rejouer avec
`PLAYWRIGHT_FIXTURE_DIR=.tmp/gamedev-display npm run test:gamedev:audio-browser`.

La cinquième fixture extrait à la compilation les fonctions de chargement,
d'initialisation, de persistance et d'import d'`App`. Deux pages de même origine
partagent le vrai `localStorage` ; le test sépare volontairement le chargement
de la création du garde pour reproduire une écriture concurrente. Une seconde
régression injecte une seule erreur de lecture, puis rétablit la méthode native.
Les migrations du catalogue, la navigation et le suivi React interne aux fonctions
extraites sont remplacés ; il ne s'agit pas d'un test de l'App complète ou du cloud.
La rejouer avec
`PLAYWRIGHT_FIXTURE_DIR=.tmp/gamedev-display npm run test:gamedev:save-browser`.

La sixième fixture extrait le vrai lecteur de commandes de `GameCanvas` et
importe ses helpers. Un contexte HTTPS reçoit une vraie politique
`Permissions-Policy: gamepad=()` ; les deux joueurs doivent conserver leurs
commandes clavier et tactiles malgré le `SecurityError` natif. Les touches
proviennent du navigateur ; les appuis tactiles sont préparés dans le registre
de scène. L'absence de l'API est simulée séparément. La reprise après navigation
concerne un nouveau document ; un test unitaire couvre l'échec puis la réussite
dans la même instance. Aucun périphérique physique ni combat complet n'est testé.
Cette fixture exécute aussi le dispatcher, le callback tactile et les méthodes
de charge et de garde extraits du code courant, avec deux acteurs du runtime
réel. Elle vérifie 17 scénarios, dont les déconnexions, le retour au neutre propre
à la manette, les propriétaires concurrents et les annulations du vrai bouton
tactile. Les états de manette et le signal de déconnexion sont simulés ; les
événements de pointeur proviennent du navigateur. La progression du runtime va
jusqu'au callback de résolution du coup, sans calcul des dégâts d'un combat complet.
Le gestionnaire clavier complet est couvert séparément par
`scripts/meleeKeyboardLifecycle.test.mjs` ; le clavier de cette fixture utilise
un pont vers le registre d'entrée.
La rejouer avec
`PLAYWRIGHT_FIXTURE_DIR=.tmp/gamedev-display npm run test:gamedev:gamepad-browser`.

Le workflow [City and Extinction immersive UI](../../.github/workflows/city-extinction-ui.yml)
exécute les services de Ville et deux parcours par mode FPS avec les assets du
dépôt. `scripts/browserSceneServices.py --replays 2` conserve une empreinte des
états observés et des décisions ainsi que les traces détaillées. La graine et
l'horloge sont contrôlées dans la fixture seulement. Une égalité de replays
établit la répétabilité de ce scénario dans cet environnement ; elle ne mesure
ni les performances ni la fidélité artistique et ne couvre pas toutes les
graines ou tous les champs internes de la simulation.

## Utiliser les outils d'assets fournis

Les deux scripts Python du guide d'assets sont conservés pour les chantiers
qui en ont besoin ; ils ne sont exécutés ni au démarrage du jeu ni au build.

- Rapport technique : `vendor/gamedev-skills/skills/disciplines/create-game-assets/scripts/asset_report.py`.
- Planche de contrôle : `vendor/gamedev-skills/skills/disciplines/create-game-assets/scripts/build_preview_sheet.py`.

Lire leur code et leur aide avant utilisation. Les dépendances sont décrites
dans le fichier `scripts/requirements.txt` adjacent. Exécuter les contrôles sur
des fichiers de travail ; garder les exports de production sous les conventions
du projet.

## Mettre à jour la sélection

1. Choisir une révision complète du dépôt amont et examiner son diff.
2. Copier les dossiers sélectionnés avec leurs ressources et conserver
   `LICENSE` et `NOTICE`. Garder le contenu amont inchangé.
3. Actualiser `UPSTREAM.json` avec la révision, les chemins, tailles,
   empreintes SHA-256 et identifiants de blobs Git vérifiés à la source.
4. Actualiser les liens épinglés de cette page, vérifier les liens locaux et
   lancer `node scripts/checkGamedevGuidance.mjs`.
5. Documenter les changements de recommandations dans la PR.

L'intégrité du snapshot ne certifie pas le comportement du jeu. Les critères
joueur, les tests ciblés et les observations de la modification restent
nécessaires.
