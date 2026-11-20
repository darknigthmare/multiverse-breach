# Lord Pneuma et Vaelgor en combat

Dans la Fonderie de la Couronne, le tourbillon cyan de Lord Pneuma se courbe au-dessus de sa main. Sa partie haute reprend les pixels du PNG, y compris les petites pièces visibles dans le flux. Le raccord à la main reste sur la même ligne. Le vortex s’incline davantage pendant l’attaque et revient vers le corps lors du choc. [PNG original](../../../../public/sprites/generated/bosses/the-aether-crown/lord-pneuma.png) · [Capture de la Fonderie](pneuma.jpg)

Au Trône aux Sept Fragments, trois cristaux de Vaelgor flottent indépendamment, s’écartent à l’attaque et se resserrent au choc. Les trois masques recouvrent entièrement les cristaux visibles au seuil alpha 8 sur 255 sans prélever de pixel du corps à ce seuil. Les ancrages de la silhouette et les PNG 1×1 sont conservés. [PNG original](../../../../public/sprites/generated/bosses/valedor-the-shattered-crown/vaelgor-premier-wyrm.png) · [Mesures des régions](regions.json) · [Capture du Trône](vaelgor.jpg)

La sélection vérifie l’identité et le chemin de la planche. Les commandes, PV, dommages et coordonnées de jeu passent par les moteurs existants. Les réglages de mouvement réduit du jeu ou du système et l’état de défaite affichent la pose originale entière. Les limites examinées restent celles des deux planches fixes. Les P1 de planche 1×1 restent ouverts, ainsi que les 22 P0 historiques de la revue précédente. [Rendu](../../../../src/game/originalStaticBossMotion.js) · [Revue P0](../../p0-p1-p2-continuation-04-2026-11-20/p0-media-review/README.md)

Chromium a chargé chaque scène au format 1280 × 800 avec animation et 390 × 844 avec mouvement réduit. Les quatre parcours ont vérifié l’empreinte du PNG servi, les rectangles et transformations du vrai Canvas, et une frappe reçue qui retire des PV. En Tactics, la case de Pneuma reste la même après le choc. Vaelgor lance également sa spéciale J2 et touche le héros. Les deux parcours animés vérifient le réglage du jeu en cours de session. Les quatre sessions se démontent sans erreur JavaScript. Cinq icônes d’objet par scène sont indisponibles dans ce checkout. Les 11 tests Node passent. [Traces navigateur](browser-results.json) · [Reçu Node](unit.tap)

```sh
node --loader ./scripts/sourceSceneTestLoader.mjs --test --test-concurrency=1 \
  scripts/originalStaticBossMotion.test.mjs scripts/twelveBellJudgesMotion.test.mjs \
  scripts/originalMaritimeBossSprites.test.mjs
node docs/assets/p0-p1-p2-continuation-07-2026-11-20/media/build_fixture.mjs
python docs/assets/p0-p1-p2-continuation-07-2026-11-20/media/browser_review.py
```
