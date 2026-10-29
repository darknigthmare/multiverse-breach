# Première application des guides — 29 octobre 2026

## Objectif et changements

Cette passe intègre les guides dans le dépôt et applique `game-ui-ux` aux
préférences d'affichage existantes. Le jeu conserve React/Vite et ses moteurs
Canvas 2D. La cartographie et les critères de travail sont dans
[GAMEDEV_GUIDE.md](GAMEDEV_GUIDE.md).

### Marges de la minimap de la cité et du radar FPS

Le curseur d'affichage propose 0–32 px. Auparavant, `parseFloat(...) || 12`
remplaçait zéro par 12, puis le calcul Canvas imposait un minimum de 12 px.
Les choix de 0 à 10 px étaient donc ignorés par ces deux éléments.

`readSceneHudPreferences` réutilise maintenant la normalisation des réglages et
le calcul de disposition accepte la même plage 0–32 px. Les réserves pour la
barre d'outils et les commandes tactiles restent appliquées. Les HUD DOM qui
possèdent leur propre marge minimale ne sont pas concernés par cette correction.

### Animations de présentation Canvas

La cinématique de signature consultait uniquement la préférence système, et
les atlas cosmétiques continuaient leur animation quand le réglage du jeu était
sur « Réduire les animations d'interface ».

Le lecteur `createReducedMotionReader` combine le réglage appliqué au document
avec la préférence système. Le même objet `MediaQueryList` est relu pendant
la présentation. Les changements restent pris en compte en direct, y compris
pour un réglage de session dont l'enregistrement est indisponible.

Les atlas affichent une image représentative fixe en mode réduit. Leur durée
de vie reste fondée sur le temps réel ; les dégâts, les commandes et l'horloge
de simulation n'utilisent pas ce réglage.

## Validation exécutée

Environnement local : Node 24.22.1, Vite 8.1.0, Chromium 153.0.8010.0.
Le dépôt cible Node 22.x ; cette validation locale ne remplace pas son passage CI.

| Vérification | Résultat et portée |
| --- | --- |
| `npm run test:ui-immersion` | 9 fichiers de tests réussis, dont les nouvelles régressions de marges et de mouvement réduit. |
| `node scripts/sceneHudPreferences.test.mjs` | 4 tests réussis ; 153 combinaisons de dimensions, d'échelle et de marge traversent les fonctions réelles réglage → CSS → disposition Canvas. |
| `node scripts/reducedMotion.test.mjs` | 6 tests réussis : priorité locale/système, changements en direct, contexte sans média-query et indépendance des documents. Une seule création de média-query sur 600 lectures est vérifiée. |
| `node scripts/fixedStepClock.test.mjs` | 10 tests réussis, dont les cadences 30/60/120/144 Hz et les transitions de pause/onglet masqué. |
| `node scripts/combatViewport.test.mjs` | 10 tests réussis de coordonnées et de résolution de combat ; cette suite fait aussi partie de `test:ui-immersion`. |
| Oxlint sur les fichiers JavaScript/JSX modifiés | Réussi. |
| `node scripts/checkGamedevGuidance.mjs` | 23 fichiers amont conformes à leurs empreintes, révision et liens locaux contrôlés. |
| Compilation Vite de l'application | Réussie : 312 modules compilés. Le compilateur signale des blocs volumineux ; cette passe ne mesure pas leur coût de chargement. |
| Test Chromium de la fixture d'affichage | Réussi en 1366×768, 360×800 et 844×390, sans erreur JavaScript de page. |

Le test navigateur monte les vrais `GameDisplaySettings`,
`GameDisplayPreferencesSync` et `useSceneViewport`, puis dessine les emplacements
de minimap/radar calculés. Il manipule les curseurs au clavier, vérifie les
marges 0/6/32 px avec l'échelle du HUD à 140 %, change les préférences locale et
système de mouvement et restaure la marge par défaut à 12 px.

Il valide les réglages et leur liaison au Canvas. Il ne constitue pas une
partie complète ni une revue visuelle de tous les costumes ou des cinématiques.
La compilation Vite a utilisé un checkout de sources et le registre d'assets
importé ; les audits `prebuild` nécessitant l'ensemble des médias n'ont pas été
exécutés localement. Aucun gain de FPS n'est revendiqué.

## Rejouer les vérifications

```bash
npm run test:gamedev
npm run test:ui-immersion
node scripts/fixedStepClock.test.mjs
```

Pour le navigateur, disposer de Playwright et de Chromium, démarrer le serveur
Vite habituel puis lancer `npm run test:gamedev:browser`. Un autre serveur peut
être indiqué en argument : `npm run test:gamedev:browser -- http://127.0.0.1:5188`.
Les variables facultatives `PLAYWRIGHT_MODULE_PATH`,
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` et `PLAYWRIGHT_CHROMIUM_ARGS` permettent
d'utiliser une installation de test existante, sans modifier les dépendances
du jeu. `PLAYWRIGHT_CHROMIUM_ARGS` est un tableau JSON.

Si les sockets d'écoute locaux sont indisponibles, compiler la fixture :

```bash
node --input-type=module - <<'JS'
import { build } from 'vite';
import react from '@vitejs/plugin-react';
await build({
  configFile: false,
  plugins: [react()],
  publicDir: false,
  build: {
    outDir: '.tmp/gamedev-display',
    emptyOutDir: true,
    rollupOptions: { input: 'scripts/fixtures/gamedev-display.html' }
  }
});
JS
PLAYWRIGHT_FIXTURE_DIR=.tmp/gamedev-display npm run test:gamedev:browser
```

Ce mode fournit les fichiers compilés directement au navigateur par les routes
Playwright ; aucune connexion au domaine fictif `multiverse.test` n'est envoyée.
