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
| Assets | `src/game/renderer.js`, `spriteAssets.js`, `cosmeticVisualAssets.js` | Réutiliser les registres, règles d'atlas, variantes et chargements ; examiner le rendu au format réel. |
| Sauvegarde | `src/game/saveValidation.js`, `saveRecovery.js`, `safeStorage.js`, `cloudSaveConflictPolicy.js` | Préserver les schémas, migrations et stratégies de conflit existants. |
| Audio et préférences locales | `src/game/soundEngine.js`, `audioPreferences.js`, `safeStorage.js`, `melee/meleeInputMap.js` | Respecter le démarrage après interaction et les préférences ; l'accès refusé au stockage ne doit pas interrompre l'initialisation audio ni l'application des commandes. |

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
