# Revue indépendante du secteur Aperture

Le secteur possède une géométrie tactique propre : 192 supports de sol, six supports de passerelle, un puits à −1,5, une galerie et une passerelle à +3. Les six escaliers raccordent leurs bords bas/haut ; les deux objectifs en (8,8) portent des `surfaceId` distincts. Le tablier solide a une sous-face à 2,72 : il ne devient pas un passage vertical ou une ligne de tir transparente. Les raccords battlefield/environnement/terrain utilisent les mêmes matériaux déclarés.

Les captures Valve/Steam conservées dans `../references/` ont été inspectées avec les captures du jeu. Panneaux clairs segmentés, ossatures sombres et caillebotis correspondent à la direction architecturale de Portal 2. Cette disposition originale, ses escaliers et ses objectifs A.R.C.A. restent une adaptation ; ni disposition officielle 1:1, ni portails, gels, ponts de lumière ou machines mobiles ne sont certifiés.

L'ancrage du détail terrain dans le vrai dock libère la carte de PV visible sur les captures mobile et bureau. La revue a néanmoins reproduit un défaut supplémentaire : à 390×640, le panneau ouvert recouvrait AUTO, ×1, MISSION, ARSENAL et COMMANDES. Les mesures originales et la capture restent dans `layout-measurements.json` et `aperture-390x640-open.png`.

Le correctif du parent borne ensuite le panneau à l'espace entre l'en-tête et le dock, avec défilement interne. Les quatre cas finaux de `../browser/layout-result.json` passent : portrait 390×640 et paysage 844×390, HUD 100/150 %, contrôles et focus accessibles, aucun recouvrement mesuré. La capture `../browser/aperture-390x640-open-1.5.png` et `../browser/aperture-1280-upper.png` ont été ouvertes après correction. Aucun autre défaut concret bloquant n'a été observé dans ce périmètre.

Limites : fixture isolée avec adversaires synthétiques, parcours d'ascension à tours contrôlés, pas de campagne complète ni certification d'accessibilité générale. Des médias d'objets absents de la fixture partielle ne constituent pas une preuve d'absence en distribution complète. Aucune modification de production n'a été effectuée par cette revue.
