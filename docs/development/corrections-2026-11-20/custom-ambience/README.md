# Ambiances des combats personnalisés

Le combat personnalisé retrouve l’animation de référence de son décor. Le titre `Simulation Custom - <univers>` décrit la session. Il bloquait le choix de l’animation en passant pour un lieu précis. Les deux résolveurs de décor ignorent maintenant ce titre pour un combat personnalisé. Un vrai nom, une description ou une localisation garde sa priorité.

En RPG et en Mêlée, chaque fond continue d’être choisi par univers et par mode. Le correctif retrouve donc l’animation du fond utilisé. Les lieux nommés et leurs références restent déclarés séparément. Les quatre exemples concernés par les tests sont le réacteur Mako dans les deux modes, Aperture en Mêlée, Namek en Mêlée et la Chambre du temps en RPG. [Test de régression](../../../../scripts/stageAnimationCatalog.test.mjs)

Dans Chromium, les boutons de lancement du vrai menu ouvrent GameCanvas et les moteurs RPG ou Mêlée. Avant le correctif, les fonds FFVII se chargent avec zéro bulle Mako. Après, les bulles suivent la simulation dans les deux modes. En mouvement réduit elles restent fixes. Les trois cas avant/après affichent le fond prévu et ferment leur moteur sans erreur de page ou réponse HTTP en échec. [Mesures et empreintes](verification.json)

Sous Node 22.23.5, les deux suites ciblées passent 19 tests de comportement et de catalogue. Le contrôle de décodage sur disque exige quatre WebP hors du checkout sparse. Leurs blobs Git locaux ont été contrôlés en mémoire et leurs 16 cellules ont une géométrie conforme, une transparence effective et des pixels distincts. [Reçu des atlas](verification.json)

```sh
node --test --test-concurrency=1 --test-skip-pattern='^four-phase local effect atlases' \
  scripts/stageAnimationCatalog.test.mjs scripts/stageAtmosphere.test.mjs
```
