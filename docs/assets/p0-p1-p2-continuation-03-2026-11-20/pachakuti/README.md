# Pachakuti du Soleil Noir

Pachakuti se lit en combat comme un phénomène de l’environnement de Tawantinsuyu. Le soleil occulté domine quatre terrasses détachées. Les lignes de route et les cordes rompues convergent vers la fissure, qui s’élargit pendant l’attaque. Les terrasses dérivent lors du déplacement et la couronne de lumière se brise lors d’un impact. Le dessin suit les couleurs et le récit originaux du projet, qui décrivent un renversement du monde et du temps. [Manifeste](../../../../src/game/originalUniversesManifest.json) · [Revue culturelle](../../../original-universes/CULTURAL_REVIEW_KEMET_TAWANTINSUYU.md).

Le [PNG RGBA](../../../../public/sprites/generated/bosses/tawantinsuyu-the-split-sun/pachakuti-du-soleil-noir.png) de 1 024 × 1 024 px contient seize poses dans quatre rangées de 256 px. Le point d’appui reste à 232 px dans chaque cellule. Les formes et les traits sont dessinés par le [générateur](build_atlas.py) avec Pillow 12.3.0. L’Écho de la Montagne a servi de repère de palette et d’échelle. Le portrait v2 est identifié dans la provenance Git LFS et ses pixels restent à vérifier sur un checkout hydraté. Le visuel relève de la fiction originale du jeu. La représentation historique et culturelle reste à faire relire par un spécialiste humain. [Provenance](manifest.json).

Le moteur charge le PNG à l’adresse déjà résolue pour cet identifiant de boss. Si le chargement échoue, un dessin Canvas affiche l’éclipse et les terrasses. La projection dans un autre univers doit emporter le chemin exact et l’univers source produits par la conservation d’identité ennemie. Le [contrôle ciblé](coverage.json) retire un constat P1 `RASTER_MISSING` pour cet acteur. Ses constats de contrat visuel et de revue restent ouverts.

Le vrai GameCanvas a chargé le Puits solaire d’Uku Pacha depuis le catalogue. Le pilote a demandé la troisième vague pour vérifier le boss, échantillonné les seize poses et infligé un impact avec le moteur RPG. Le PNG est chargé sur ordinateur et sur mobile. Un troisième contexte simule un code HTTP 404 sur le seul PNG du boss et confirme le dessin de secours. Les trois cas passent, y compris le démontage. Le gabarit de 1 550 PV donne 1 829 PV dans cette scène Très difficile. Cinq icônes LFS de la scène restent indisponibles dans le checkout utilisé. [Résultats navigateur](browser-results.json) · [Capture ordinateur](desktop-attack.png) · [Capture mobile](mobile-attack.png).

Les [trois tests ciblés](unit.tap) vérifient l’identité, l’alpha et l’appui de chaque pose ainsi que la portée du rendu de secours. La [compilation de la fixture](manifest.json) valide son code avec Vite. Le contrôle couvre la présentation, sans exécuter les deux premières vagues ni les phases d’un combat complet.

```sh
python docs/assets/p0-p1-p2-continuation-03-2026-11-20/pachakuti/build_atlas.py /tmp/pachakuti.png
node --loader ./scripts/sourceSceneTestLoader.mjs --test scripts/pachakutiWorldBossArt.test.mjs
node --max-old-space-size=2048 docs/assets/p0-p1-p2-continuation-03-2026-11-20/pachakuti/build_fixture.mjs
python docs/assets/p0-p1-p2-continuation-03-2026-11-20/pachakuti/browser_review.py
```
