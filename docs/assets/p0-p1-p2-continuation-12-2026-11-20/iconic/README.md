# Présentations de Duel et commandes de Stitch

Lilo Pelekai (2002), Jack Sparrow (2003) et Roger Rabbit (1988) ont chacun sept séquences de Duel. L’entrée, la sortie, la finale, la victoire et la défaite de match ainsi que les deux résultats de manche utilisent les cellules examinées en passes 09 et 10. Les titres sont disponibles en français et en anglais. [Planches et décisions antérieures](../../p0-p1-p2-continuation-09-2026-11-20/iconic/README.md) · [Revue Lilo et Stitch](../../p0-p1-p2-continuation-09-2026-11-20/lilo-stitch/README.md)

Lilo se pose après quelques pas, puis prend une photo souvenir en finale. Un éclat local réutilise le dessin Canvas de son flash. Jack s’avance, retrouve son aplomb et finit sur un retrait sans dépense de balle. Roger arrive par bonds courts et sa finale revient à une cabriole. Les séquences utilisent leurs propres costumes et des échelles adaptées aux trois silhouettes. La position d’appui à 244 pixels est celle des planches. Les rangs de déplacement de Jack et Roger gardent leur recadrage de 20 pixels. [Séquences et source](../../../../src/game/combat/historicalIconicP0DuelPresentations.js)

Le mouvement réduit tient une seule cellule et retire le déplacement interpolé ainsi que l’éclat de la photo. Les sept séquences sont des animations de mise en scène assemblées avec les cellules existantes. La livraison des poses natives et la vérification de la chorégraphie 1:1 restent ouvertes, comme les quatre dossiers d’art P0 de Lilo, Jack, Roger et Stitch.

Stitch retrouve sa griffe légère et son bond lourd dans le Duel. Les deux actions terrestres du kit de 2002 touchent l’adversaire actif jusqu’à 70 pixels à l’horizontale. Les contrôles J1/J2 couvrent l’impact, le raté et la fenêtre de préparation. Son corps de jeu conserve le repère d’illustration en cours de revue. [Contrôles des commandes et des scènes](../../../../scripts/historicalIconicP0DuelPresentation.test.mjs)

Les sept tests Node passent. Le moteur de départ et ses anciennes identités échouent sur les deux commandes Stitch et sur les scènes du match. Les 15 cellules de présentation ont été décodées. Les empreintes des trois planches correspondent à la version de départ et aux fichiers servis localement. [Reçu et recadrages](verification.json)

Chromium a joué deux vrais matchs à deux manches au clavier, avec positions et PV préparés pour atteindre les K.O. Le premier oppose Lilo à Roger et relève 927 découpes du Canvas. Le second oppose Jack à Lilo avec mouvement réduit et relève 911 découpes, une cellule et une position par phase observée. Le test tactile J2 à 390 × 844 déclenche le bond de Stitch et relève un impact au contact. Le Canvas affiche son repère d’art et sa planche archivée reste hors des requêtes. Les trois parcours se terminent sans erreur de page ni de chargement. [Capture de la première manche](duel-manche-un.jpg) · [Mesures navigateur](browser.json)

### Reproduire les contrôles

```sh
node --max-old-space-size=2048 --test --test-concurrency=1 scripts/historicalIconicP0DuelPresentation.test.mjs
node --max-old-space-size=2048 docs/assets/p0-p1-p2-continuation-12-2026-11-20/iconic/browser.mjs
```

Le parcours navigateur utilise Vite et React en local et ouvre les contextes l’un après l’autre. `PLAYWRIGHT_MODULE_PATH` permet d’indiquer le module Playwright et `PLAYWRIGHT_CHROMIUM_EXECUTABLE` permet de choisir Chromium. `ICONIC_SCENARIO=rounds`, `static` ou `stitch` sélectionne un parcours pour le diagnostic.
