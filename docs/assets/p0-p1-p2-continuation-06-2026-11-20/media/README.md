# Atlas du Phare qui Regarde et du Kraken Sans Couronne

Le Phare utilise ses tentacules comme appuis et ouvre son faisceau violet sur la rangée d’attaque. Le Kraken replie puis déploie ses tentacules au combat et garde le cœur rouge entouré de sa carapace sombre. Les deux boss jouent chacun quatre poses de repos, de déplacement, d’attaque et de choc. Les planches sont produites avec Image Gen à partir des PNG originaux du projet. Les caractéristiques, les dégâts et les commandes viennent des fiches existantes. [Atlas du Phare](../../../../public/sprites/generated/bosses/the-drowned-testament/le-phare-qui-regarde-animated.png) · [Atlas du Kraken](../../../../public/sprites/generated/bosses/the-crownless-sea/kraken-sans-couronne-animated.png)

Les 32 cellules ont été découpées et inspectées à 126 et 68 px avant intégration. Un facteur commun par boss préserve les proportions dans chaque série. Les cellules transparentes de 192 × 192 px partagent un ancrage, avec un intervalle sous le Kraken pour conserver sa silhouette flottante. Les deux PNG indexés pèsent **493 006 octets**. Le test vérifie les identités exactes, les contours et l’amplitude du faisceau. Le chargement du PNG statique initial reste possible quand l’atlas échoue. [Provenance et découpes](manifest.json) · [Script de découpe](pack_atlas.py) · [Test de sélection](../../../../scripts/originalMaritimeBossSprites.test.mjs)

Quatre parcours Chromium ont chargé les vrais combats RPG custom de la Basilique sous la Marée et du Maelström. Les deux cas avec l’atlas vérifient les seize cellules de chaque boss. Dans chacun des quatre parcours, la spéciale J2 fait perdre des PV au héros et une frappe reçue déclenche l’état de choc. Une réponse 404 contrôlée pour chaque atlas a exercé le secours et comparé les octets du PNG historique. Le navigateur démonte chaque session sans erreur JavaScript. Cinq icônes d’objet par scène sont indisponibles dans ce checkout. Sur mobile, la projection de l’aire de jeu réduit la lisibilité des détails fins du Kraken. [Phare sur ordinateur](phare-1280.jpg) · [Kraken sur mobile](kraken-390.jpg) · [Traces Chromium](browser-results.json)

Deux constats P1 `STATIC_GAMEPLAY_REVIEW` sont résolus par les nouveaux atlas. Les variations de détail entre les poses, les cinématiques dédiées et la fidélité visuelle exhaustive restent à vérifier. Aucune nouvelle planche établie pour l’incarnation exacte d’un des 22 P0 historiques n’a été retenue dans les ressources examinées. [Revue P0 précédente](../../p0-p1-p2-continuation-04-2026-11-20/p0-media-review/README.md)

Les 12 tests ciblés et voisins passent sur Node 22. La compilation Vite porte sur le vrai GameCanvas de la fixture, avec les médias servis localement. [Reçu des tests](unit.tap)

```sh
node --loader ./scripts/sourceSceneTestLoader.mjs --test --test-concurrency=1 \
  scripts/originalMaritimeBossSprites.test.mjs scripts/aetherMiteSprite.test.mjs \
  scripts/twelveBellJudgesMotion.test.mjs scripts/pachakutiWorldBossArt.test.mjs
node docs/assets/p0-p1-p2-continuation-06-2026-11-20/media/build_fixture.mjs
python docs/assets/p0-p1-p2-continuation-06-2026-11-20/media/browser_review.py
```
