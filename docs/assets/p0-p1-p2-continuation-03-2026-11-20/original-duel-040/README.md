# Présentations de duel des univers originaux

Le lot réunit 40 identités de Thalassa Mnémique, Méridien Creux, Viridienne Ultime et Neon Requiem. La sélection reprend les dix premières identités originales de chaque univers dans l’inventaire de la reprise 02. Les 160 réservations de cette reprise sont disjointes de ce lot. La réservation garde les tâches d’art ouvertes. [Liste du lot](reserved-actors.json).

Quatre protagonistes disposent chacun de sept séquences dans le mode Combat. L’entrée, les deux résultats de manche, la finale, les deux résultats du match et la sortie réutilisent leur propre atlas de seize poses. Le mode Duel annonce le même nom de séquence sur Canvas et pour le lecteur d’écran. Après un K.O., le perdant tient sa pose de défaite pendant que le vainqueur quitte l’arène. La préférence système de mouvement réduit désactive les quatre nouveaux effets d’ambiance du duel. Les mouvements du corps conservent le rythme des séquences.

| Combattant | Finale adaptée | Effet visuel |
| --- | --- | --- |
| Neris Vale | Nom véritable | Arc de sonar et repères d’une carte abyssale |
| Kael Venn | Remboursement total | Graduations et aiguille de cadran ambrées |
| Eira Solenne | Lumière partagée | Corolle de cinq feuilles et jeune photosphère |
| Nyra Vale | Accès Racine Nadir | Lignes et nœuds du réseau Ghostline |

Les 28 séquences utilisent les visuels d’origine du projet. Une recette s’applique si l’identité, le monde, l’équipement et l’atlas concordent. Les clones techniques, les alias contradictoires et les corps incompatibles gardent leurs séquences habituelles. Chaque finale se joue après le résultat du match et conserve le compte des dégâts et des récompenses. Les intitulés de Neris, Kael et Eira viennent de leurs fiches de conception, tandis que leurs capacités jouables conservent leurs contrats actuels. Les dessins dédiés à chaque phase et les 36 autres dossiers du lot restent ouverts. [Inspection des quatre atlas](atlas-review.json).

Le contrôle des PNG vérifie 16 cellules RGBA de 256 × 256 px par acteur, la séparation des silhouettes et les points d’appui aux pixels 244 ou 240. Les 25 tests ciblés et les six scénarios Chromium passent. Chaque motif est dessiné par le vrai moteur de duel. Les vérifications couvrent les deux camps, les deux résultats de manche, les quatre finales, la sortie K.O. et un seul rappel de résultat par match. La fixture prépare le dernier point de vie et passe par la vraie résolution de dégâts. Les lancements de l’interface sont testés par son bouton normal, sur ordinateur et sur mobile avec mouvement réduit. Sur mobile, les textes internes au Canvas restent petits. [Vérification](verification.json) · [Résultats Chromium](browser.json) · [Finale Neris](duel-finale-neris-vale.jpg) · [Finale Kael](duel-finale-kael-venn.jpg) · [Finale Eira](duel-finale-eira-solenne.jpg) · [Finale Nyra](duel-finale-nyra-vale.jpg) · [Entrée mobile](duel-ui-mobile.jpg).

Depuis la racine du dépôt, sous Node 22, lancer les régressions ciblées avec le chargeur de test du projet.

```sh
NODE_OPTIONS=--max-old-space-size=2048 node --loader ./scripts/sourceSceneTestLoader.mjs --test --test-concurrency=1 \
  scripts/originalFighterPresentations.test.mjs scripts/fighterPresentationRuntime.test.mjs \
  scripts/reviewedRevanPresentation20261113.test.mjs scripts/reviewedRevanPresentationRuntime20261113.test.mjs
```

Pour rejouer le contrôle Chromium, compiler la petite entrée Vite, servir le résultat sur la boucle locale et lancer la fixture Playwright. Le serveur lit les quatre PNG du dépôt et la compilation laisse les médias à leur emplacement.

```sh
node --input-type module <<'JS'
import { build } from 'vite';
import { resolve } from 'node:path';
await build({ configFile: 'scripts/viteCodeOnly.config.js', publicDir: false, build: {
  outDir: '/tmp/animation-next/fixture-build', emptyOutDir: true,
  rollupOptions: { input: resolve('docs/assets/p0-p1-p2-continuation-03-2026-11-20/original-duel-040/fixture.html') }
} });
JS
python scripts/serveSourceSceneArtFixture.py --port 4293 --build-dir /tmp/animation-next/fixture-build
```

```sh
python docs/assets/p0-p1-p2-continuation-03-2026-11-20/original-duel-040/browser.py
```
