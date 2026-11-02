# Lot 16 — trois groupes de 40 personnages

**Livraison validée le 1 novembre 2026.** Le vrai build complet est terminé avec le code 0 : 2 076 tests passent dans 18 groupes. Les preuves navigateur, le décodage et les réponses HTTP sont liés aux empreintes des fichiers réellement livrés.

Le [plan initial](batch-plan-before.json) reste immuable. Deux annexes préalables aux générations correspondantes ([1](batch-amendments-before-generation.json), [2](batch-amendments-2-before-generation.json)) conservent **124 identités revues et 120 identités effectives pour les dessins**. Ces personnages possédaient déjà leurs trois actions de base : les révisions ne gonflent donc pas les compteurs cumulatifs de kits rédigés. Les sources et exclusions sont séparées dans les dossiers [A](part-a/README.md), [B](part-b/README.md) et [C](part-c/README.md).

| Livraison de ce lot | Mesure réelle |
| --- | --- |
| Présentations32 | 120 personnages, huit phases par personnage |
| Bases16 | 120 personnages, quatre états par personnage |
| Mêlée complète45 | Senua,180 poses réellement utilisées dans six PNG |
| RPG16 | Six renforts de personnage et le Fox Devil,112 poses |
| Action16 | Starburst Stream de Kirito,16 dessins supplémentaires |
| Familier autonome16 | Shield Pal de Chalice, arrivée/protection/absorption/départ |
| Total nouveau | **6 084 poses distinctes dans 255 PNG** |
| Préservation W1–W15 | 982 PNG,127 registres et rapports historiques inchangés |

Les miroirs, captures, cellules de remplissage, sources rejetées et réemplois ne sont pas de nouvelles poses. La [mesure de livraison](deliverables.json) décode les PNG et compare leurs cellules RGBA. Les quatre poses de super natives32 de Kirito servent toujours à sa préparation et sa récupération ; le nouvel atlas suit les seize contacts temporisés. [Couverture du lot](coverage.csv) et [couverture cumulative des 1 911 personnages](coverage-all.csv) distinguent les manquants réels.

## Actions et règles du combat

Les supers effectifs comprennent 59 actions offensives, 2 contrôles, 28 améliorations, 29 gardes et 1 soins. Les versions retenues précisent les gestes, les équipements et les partenaires ; les soutiens n'acquièrent pas une arme ou un pouvoir offensif inventé.

Abe canalise avant de contrôler un vrai Slig admissible ; le Slig conserve son corps, son camp déclaré et son fusil. Les commandes utilisent sa propre ressource, puis la libération restaure les entrées ordinaires. Akane utilise une autorisation explicite de Paralyzer sur Kogami : immobilisation sans dégâts ni élévation. Mugman possède l'invulnérabilité de Super Art II pendant 4,85s simulées. Le Shield Pal de Chalice possède son propre atlas autonome16, absorbe un seul coup positif et persiste jusque-là ; les poses du corps de Chalice ne sont pas figées pour simuler un familier absent. Yukikaze de Hakumen intercepte les attaques admissibles, y compris les projectiles, sans arrêter à distance leur propriétaire ; la riposte exige son propre contact physique.

Kirito, Aya et BT utilisent respectivement16, 7 et 14 événements temporisés, avec cible acceptée, pause, interruption et jauge dépensée une seule fois. Les budgets de dégâts restent bornés indépendamment de l'arrondi de chaque impact. Le Fox Devil est dessiné comme une entité séparée du geste d'Aki ; son contact suit sa bouche mesurée. Les tests de moteur et les parcours GameCanvas restent des preuves distinctes.

## Terrains et scènes

Quatre secteurs Tactics supplémentaires — Inkwell Isle One, la chaîne de fabrication IMC, Central City et le royaume Sadida — portent le total à **19 terrains verticaux,16 secteurs d'univers et 42 matériaux**. Ils possèdent des environnements propres à Tactics. Le [guide jouable](../tactics-universes-2026-10-28/README.md) décrit les surfaces, hauteurs, passages superposés, volumes physiques et matières par face ; ces secteurs ne recopient pas les cartes des autres moteurs.

Dix mécanismes de scène portent la couverture à 435 mécanismes dans 216 univers. Les études Canvas représentent des adaptations architecturales et atmosphériques ; elles ne constituent pas des fonds officiels complets.

## Refus et limites conservés

John Wick reste sans nouveaux dessins après une source exclue et un correctif réellement refusé. Robin native32/base16 n'a pas été demandé après son refus RPG. Raven et Starfire native48 ont été réellement refusés, sans nouvelle tentative. Les quatre identités distinctes ajoutées sont Tank, MEIKO, KAITO et l'Oracle. Le Starfire RPG16 a été produit avant son refus native48 séparé et conserve sa provenance propre ; il n'est pas transformé en native32/base16.

**Reproduction officielle 1:1 certifiée : false.** Les dessins sont des adaptations pixel art documentées. Les sources non accessibles, détails stylisés, miroirs anatomiques et timings adaptés restent indiqués ; les tests ne les convertissent pas en fidélité officielle.

[Validation](validation.json) · [Build réel](build-exit.json) · [Preuves navigateur](browser-checks.json) · [Tous les PNG servis](browser/production-assets-http.json) · [Protocole](CLOSURE.md).
