# La Forêt défensive de la Reine des Ronces

Dans le RPG de Valedor, les trois couronnes d’épines de la Reine des Ronces s’ouvrent pendant la préparation de **Forêt défensive**. La garde acceptée au 18ᵉ tick donne son amplitude à l’ouverture. Les couronnes oscillent pendant la protection et se replient durant les 36 derniers ticks. Chaque découpe de la planche originale 1×1 s’étend depuis l’attache de sa couronne. [Contrat de Valedor](../../../../src/game/originalTideActorDesigns.js) · [Découpes et rendu](../../../../src/game/originalStaticBossMotion.js)

La garde protège la Reine et ses alliés vivants pendant trois secondes à 40 % de réduction. Le moteur associe le déploiement à la garde effectivement appliquée par la Reine sur elle-même. Une garde reçue d’un autre allié maintient sa propre durée et son propre taux. Le réglage de mouvement réduit du jeu ou du système maintient la planche fixe.

### Vérifications

Les 16 tests de rendu et de moteur passent. Ils couvrent aussi la garde d’un allié, l’interruption et le déclenchement par le CPU. Les six tests des préférences de mouvement passent. [Reçu Node et provenance du PNG](verification.json)

Dans Chromium à 1 280 × 800, **7** sélectionne la Reine en J2. **I** ouvre l’aperçu de Forêt défensive et **Confirmer les cibles** déclenche l’action. Les mesures suivent la pose jusqu’à l’expiration. Les réglages de mouvement réduit du jeu et du système s’appliquent pendant la garde. Le parcours s’achève avec zéro erreur HTTP ou JavaScript. [Reçu navigateur](browser.json) · [Capture de l’impact](foret-defensive.jpg)

```sh
node --max-old-space-size=2048 --loader ./scripts/sourceSceneTestLoader.mjs --test --test-concurrency=1 scripts/originalStaticBossMotion.test.mjs scripts/originalTideActors.test.mjs
node --test scripts/reducedMotion.test.mjs
node docs/assets/p0-p1-p2-continuation-12-2026-11-20/motion/browser.mjs
```

Le lanceur monte `GameCanvas` avec les données du Trône aux Sept Fragments et l’équipe adverse du catalogue. Il prépare la charge de départ et un allié hors combat, puis avance le moteur tick par tick. `PLAYWRIGHT_MODULE_PATH` et `PLAYWRIGHT_CHROMIUM_EXECUTABLE` permettent de choisir Playwright et Chromium.
