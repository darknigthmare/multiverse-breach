# The Crownless Sea — Cimetière du Calme Mort

La mission **Cimetière du Calme Mort** charge un nouveau plateau de **13 × 9 cases et 126 surfaces**. Il est accessible depuis la campagne et depuis **Combat custom → Arène → Terrain tactique**. Le navire-lanterne, les épaves et l’absence de courant viennent du manifeste de *The Crownless Sea*. La carte, ses matières et le dessin du navire sont des créations pour le moteur Tactics. [Manifeste original](../../../../src/game/originalUniversesManifest.json)

- **Escorter le navire.** Il parcourt dix cases sur le chenal à Z −1. En fin de tour, il avance si un allié se tient sur un appui adjacent à sa hauteur. L’escouade marche sur les berges. La victoire intervient à l’arrivée visible du navire sur la case de sortie.
- **Traverser les épaves.** Le pont en chêne atteint Z 2 avec trois appuis situés à la verticale du chenal. Les escaliers mènent au pont et les rampes rejoignent les berges. Le récif s’élève à Z 1,25. Les coques brisées sont des obstacles de couverture. Le pont coupe la ligne de vue vers le chenal.
- **Choisir le chemin au sol.** L’eau calme, la vase, les galets, les planches de halage, le bois des épaves et le récif ont chacun leur matière. Dans la partie basse, la vase coûte deux points d’action et les planches un. Les 110 surfaces terrestres accessibles sont reliées aux points de départ de l’escouade.

Le briefing nomme le navire-lanterne dans la campagne et en combat. Le rendu emploie sa coque et sa lanterne à la position réelle du navire. Il se déplace sous le pont en conservant sa surface de navigation. [Plateau, routes et matériaux](../../../../src/game/tacticsOriginalBattlefields.js) · [Dessin du navire](../../../../src/game/tacticsCrownlessSea.js)

Les 42 tests ciblés passent, dont six nouveaux. Ils couvrent le choix explicite et automatique du terrain, la superposition du chenal et du pont, les itinéraires du navire et de l’escouade, le déplacement en cours, la pause et l’arrivée. Le replay moteur guide le navire jusqu’à une seule victoire. L’IA alliée reprend l’escorte lorsque le dernier adversaire est hors jeu. Les 17 tests d’escorte et d’interface adjacents passent également. [Tests](../../../../scripts/tacticsDeadCalm.test.mjs) · [Reçu de validation](verification.json)

### Reproduire les contrôles

```sh
node --max-old-space-size=2048 --test --test-concurrency=1 scripts/tacticsDeadCalm.test.mjs scripts/tacticsOriginalSectors.test.mjs scripts/tacticsIronAshline.test.mjs scripts/tacticsTerrainRenderer.test.mjs
node --max-old-space-size=2048 docs/assets/p0-p1-p2-continuation-12-2026-11-20/tactics/browser.mjs
```

Le parcours Chromium lance le terrain explicitement depuis le menu et le joue dans `GameCanvas` à 1 280 × 900. Il ouvre le briefing du navire, puis dépense onze points d’action en neuf déplacements d’Ysara. Le navire atteint la sortie et la victoire est déclenchée. La fermeture libère le moteur et ses minuteries. `PLAYWRIGHT_MODULE_PATH` et `PLAYWRIGHT_CHROMIUM_EXECUTABLE` permettent de choisir le module Playwright et l’exécutable Chromium. [Parcours et résultats](browser.json) · [Capture du chenal](dead-calm-1280.jpg)
