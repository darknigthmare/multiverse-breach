# Portal 2 — chambre et puits de maintenance jouables

Le secteur `portal2_maintenance_shaft_tactics` est raccordé au catalogue, au sélecteur Combat custom et au vrai moteur Tactics. Sa galerie à Z 3, son niveau de service à Z −1,5 et ses escaliers utilisent une grille propre à ce mode. Deux repères A.R.C.A. occupent le même emplacement horizontal sur deux supports indépendants. Le tablier opaque ne permet ni passage vertical ni tir à travers son plancher.

Trois nouvelles matières distinguent panneaux clairs, ossature sombre et caillebotis. Elles sont projetées sur les faces du terrain ; le décor et les supports physiques sont dessinés par le renderer dédié. Aucune image d’arène RPG, Mêlée ou Fighter n’est réutilisée. Les [références Valve inspectées](references/source-review.json) gardent les pages, captures et empreintes.

Le plan est une adaptation tactique originale de l’architecture de Portal 2 (2011), sans numéro de chambre officiel revendiqué. Les passerelles sont métalliques ; elles ne simulent ni ponts de lumière ni tunnels d’excursion. Portails, gels et machines mobiles ne sont pas implémentés ici. Les objectifs A.R.C.A. appartiennent au crossover. Le choix automatique refuse ce secteur pour une archive explicitement marquée Portal (2007) ou Portal 1. Le choix explicite affiche son œuvre avant lancement. Aucune copie exacte de carte ou de texture officielle n’est certifiée.

## Vérification dans le moteur

Les cinq tests `tacticsAperture20261113.test.mjs` contrôlent les trajets vers chaque départ, ressource et objectif, les grandes empreintes, les étages, la hauteur libre, la ligne de vue et le choix de carte selon le mode. Le vrai EngineTactics vérifie coût AP, mouvement, pause/reprise et collecte unique des deux repères jusqu’à la victoire. Le [premier passage ciblé](root-targeted-tests.tap) comprend aussi les gardes de sprites ; la suite finale est consignée dans les [vérifications du tour](../validation/).

Le [parcours navigateur](browser/result.json) monte le vrai GameCanvas à 1280 et 390 px : flèche du clavier, confirmation par le vrai bouton, dépense AP, pause/reprise et démontage. L’ascension complète prépare des débuts de tours contrôlés à deux AP pour isoler le trajet de l’IA ; elle ne représente pas une campagne avec sa file de tours ordinaire. Les captures montrent le corps sur le tablier supérieur. Un troisième cas vérifie le vrai renderer corps/HUD de Batman en attente, sans chargement du PNG rejeté.

La fixture emploie Cloud et un Pinky passif aux stats de test ; leur présence ne décrit pas une scène canonique de Portal. Cinq icônes Portal préexistantes restent absentes : `portal-pickup-1`, `portal-pickup-2`, `portal-pickup-3`, `portal-summon` et `evt-portal-cube`. Le rapport garde les 404 ; le terrain procédural ne dépend pas de ces fichiers. Aucune erreur de page n’est constatée, sans déduire un chargement complet des médias.

## Panneau de terrain et petits écrans

La revue reproduit d’abord un panneau fermé recouvrant les HP mobiles. Le panneau est maintenant ancré au-dessus du bloc réel d’escouade et de commandes, avec 10 px d’intervalle. Une seconde mesure en 390 × 640 montre que le panneau ouvert couvrait la barre haute : sa hauteur maximale est désormais bornée par l’espace mesuré entre l’en-tête et le dock, avec défilement interne. Les mesures se recalculent au redimensionnement ; la boucle de simulation ne lit pas le DOM. Observateurs et abonnements sont retirés au démontage.

Les [captures avant](before-dock-correction/) et la [revue indépendante](independent-review/) conservent les chevauchements. Le [contrôle final de disposition](browser/layout-result.json) passe quatre cas : portrait 390 × 640 et paysage 844 × 390, facteur HUD 100/150 %. Il vérifie limites du panneau ouvert et accès aux commandes après focus/défilement horizontal de leur barre. Le test initial de centre ignorait le rognage de cette barre ; le pilote final distingue les commandes initialement visibles et celles révélées par défilement.

Deux autres erreurs de fixture sont conservées : sélection directe du modèle sans rafraîchir le curseur React, puis tableau `activeTeam` recréé à chaque pause. Le pilote emploie maintenant le vrai clavier et une référence d’équipe stable ; aucun défaut de pause du moteur n’est déduit de ces erreurs de test.

Les contrôles W15/W16/W17 gardent leurs plans et empreintes. Le [contrat Aperture fermé](../../../../scripts/fixtures/tactics-aperture-historical-amendment-2026-11-13.json) vérifie l’intégralité du secteur, des trois matières et du profil de biome avant leur retrait des comparaisons historiques. Les identifiants inconnus et modifications restent refusés.

## Reproduction

```sh
node --max-old-space-size=2048 --loader ./scripts/sourceSceneTestLoader.mjs --test scripts/tacticsAperture20261113.test.mjs
node docs/assets/p0-p1-p2-continuation-02-2026-11-13/tactics-aperture/build-fixture.mjs
python scripts/serveSourceSceneArtFixture.py --port 4199 --build-dir /tmp/multiverse-aperture-continuation02
node docs/assets/p0-p1-p2-continuation-02-2026-11-13/tactics-aperture/browser.mjs
node docs/assets/p0-p1-p2-continuation-02-2026-11-13/tactics-aperture/browser-layout.mjs
```

Node 22 est utilisé. La compilation de fixture désactive copie de `public/` et prébuild ; le serveur QA utilise les octets du checkout/index. Ce dispositif n’est pas un export assemblé ni une approbation artistique 1:1.
