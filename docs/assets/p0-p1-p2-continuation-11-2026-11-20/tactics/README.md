# Iron Tempest — Crête des trois radios

La mission de campagne **Tranchées de la Ligne-Cendre** utilise maintenant son propre secteur Tactics, identifié par `Iron Tempest` et `iron_ashline_trenches`. Combat custom permet de choisir le plateau ou de le retrouver en sélectionnant **Auto** avec l’archive de la mission. Le décor et le rôle des radios viennent du manifeste original. La géométrie a été créée pour le Tactics. [Manifeste original](../../../../src/game/originalUniversesManifest.json)

Le plateau compte 148 surfaces sur une grille de 14 × 10. Les trois radios occupent la boue à Z −1, le ravitaillement à Z 0 et la crête à Z 2. Chaque radio tenue sans adversaire rapporte une transmission en fin de tour. Il en faut six pour gagner.

Deux montées indépendantes rejoignent la crête. Le franchissement en planches, à Z 1, coûte **13 PA contre 19** pour le contournement entre ses deux approches. Sous le pont, la hauteur libre de 1,75 permet à une unité de hauteur 1,6 de passer. Une unité de hauteur 3 doit contourner le pont. La boue coûte deux PA et le gravier un. Cinq matières procédurales distinguent herbe, boue, gravier, schiste et planches.

Les **40 tests ciblés passent**, dont six nouveaux. Ils vérifient les routes, les volumes des unités et boss, les trois radios, les ramassages accessibles, les coûts, la ligne de vue et les matières. Un combat moteur avec Mara Veylan et Marshal Volgra du catalogue atteint la radio par les commandes de déplacement, reste immobile pendant une pause en trajet et reçoit une seule victoire à six transmissions. Les quatre secteurs originaux antérieurs sont identiques en données à la révision de départ. [Tests](../../../../scripts/tacticsIronAshline.test.mjs) · [Reçu](verification.json)

**Un parcours Chromium est validé** sur ordinateur à 1280 × 900. Le menu affiche **Auto** au départ. Le test sélectionne et lance le plateau depuis `CustomBattleMode`, puis joue dans `GameCanvas`. Le parcours effectue cinq déplacements par clic puis flèches et Entrée, consomme neuf PA, descend à Z −1 et marque une transmission. La pause de session et le nettoyage à la fermeture passent, sans erreur de page ni média manquant. Les tests Node couvrent la résolution Auto et la victoire complète. [Capture du boyau](ashline-1280.jpg) · [Détails du parcours](browser.json)

### Reproduire les contrôles

```sh
node --test --test-concurrency=1 scripts/tacticsIronAshline.test.mjs scripts/tacticsOriginalSectors.test.mjs scripts/tacticsNexusHighgrass.test.mjs scripts/tacticsTerrainRenderer.test.mjs
node docs/assets/p0-p1-p2-continuation-11-2026-11-20/tactics/browser.mjs --desktop-only
```

Le test utilise les dépendances Vite et React du dépôt et un seul contexte Chromium à la fois. `PLAYWRIGHT_MODULE_PATH` permet d’indiquer le module Playwright, dont le chemin par défaut est `/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright`. `PLAYWRIGHT_CHROMIUM_EXECUTABLE` permet de choisir l’exécutable Chromium, par défaut `/usr/bin/chromium`. Le bouton QA du test pilote la pause de session. Les diagnostics s’écrivent dans `/tmp/mvb-pass11-tactics-attempts`.

La géométrie et le rendu suivent les conventions du projet et de son guide `level-design`. [Guide du projet](../../../development/GAMEDEV_GUIDE.md)
