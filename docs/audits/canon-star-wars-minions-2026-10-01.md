# Corrections de six personnages prioritaires — 1 octobre 2026

Les données finales jouées et les plaques de Han, Luke, Vader, Bob, Kevin et Stuart ont été corrigées. Les IDs, catégories, statistiques et chemins des sprites restent compatibles avec les sauvegardes. Les six sprites existants restent à revoir : ces corrections de données ne prouvent aucune fidélité visuelle 1:1.

| Personnage | Incarnation choisie | Écart corrigé |
| --- | --- | --- |
| Han Solo | Un nouvel espoir, 1977, Mos Eisley / évasion de l'Étoile de la Mort | Le DL-44 remplace le pouvoir explosif « Kessel Run Fire » ; une esquive remplace « Carbonite Luck Guard ». La carbonite est une captivité du film suivant, pas une protection. La salve RPG sélectionne jusqu'à trois ennemis. |
| Luke Skywalker | Le Retour du Jedi, 1983, duel de l'Étoile de la Mort II | `greatsword` devient `lightsaber`. Le sabre reste vert ; le « Jedi Mind Strike » à rayon devient un duel au sabre dirigé sur un seul adversaire. La tenue et la main mécanique sont précisées. |
| Darth Vader | L'Empire contre-attaque, 1980, Bespin | La lame noire devient rouge. « Imperial March Execution » était un pouvoir de zone inventé à partir du thème musical : le kit utilise désormais le duel, les débris télékinétiques de Bespin et un étranglement de Force ciblé. |
| Bob | Minions, 2015, aventure londonienne | Sa classe `hacker` lui attribuait un laser générique et une attaque d'énergie. Il utilise désormais des gestes comiques au contact et une diversion ; son petit corps chauve et ses yeux vert/brun sont explicités. |
| Kevin | Minions, 2015, aventure londonienne | Sa classe `tactical` lui attribuait un fusil générique. Il retrouve le contact comique et son rôle de meneur protecteur, avec deux yeux et une touffe centrale. |
| Stuart | Minions, 2015, finale rock londonienne | Son arme générique `slash` devient la guitare électrique rouge visible dans la référence officielle. Le seul œil brun, la lunette unique et les cheveux séparés au milieu sont précisés. |

Les dégâts, délais, parades abstraites, lancers de banane, bousculades et riffs offensifs sont des règles de Multiverse Breach. Ils sont déclarés comme adaptations de jeu et ne sont pas présentés comme des techniques nommées officielles des films. Les Minions conservent des classes de jeu pour compatibilité ; elles ne définissent plus leur arme canonique.

## Sources consultées

- [Han Solo — Star Wars Databank](https://www.starwars.com/databank/han-solo) : pilote, contrebandier, capture et carbonite à Cloud City.
- [DL-44 — Star Wars Databank](https://www.starwars.com/databank/dl-44-blaster-pistol) : le DL-44 modifié est l'arme personnelle de Han.
- [Luke — Star Wars Databank](https://www.starwars.com/databank/luke-skywalker) et [son sabre vert](https://www.starwars.com/databank/luke-skywalkers-lightsaber) : remplacement du sabre perdu à Cloud City, sauvetage de Han, apparition dans Le Retour du Jedi.
- [Vader — Star Wars Databank](https://www.starwars.com/databank/darth-vader), [son sabre](https://www.starwars.com/databank/darth-vaders-lightsaber) et [Piett](https://www.starwars.com/databank/admiral-piett) : armure de survie, lame rouge, débris projetés sur Luke et étranglement d'Ozzel.
- [Minions — Illumination](https://www.illumination.com/movie/minions/) : film 2015, Kevin protecteur et meneur, Stuart aspirant rockeur, Bob doux, naïf et petit. Les portraits officiels de [Kevin](https://www.illumination.com/wp-content/uploads/2019/11/Minions_Kevin2.png), [Stuart](https://www.illumination.com/wp-content/uploads/2019/11/SHM_PRINTS_P1880.png) et [Bob](https://www.illumination.com/wp-content/uploads/2019/11/Minions_KingBob.png) ont été inspectés. Le portrait royal de Bob sert à identifier le visage et les yeux ; sa couronne et sa cape ne deviennent pas l'habit permanent du héros.

Les empreintes des réponses et images reçues sont conservées dans `canon-star-wars-minions-2026-10-01.json`. Les références ne sont pas des images de remplacement installées et ne certifient pas les sprites historiques.

## Vérification et suites

Les sept nouveaux tests contrôlent les comportements de ciblage réels du RPG, les armes finales après toutes les surcharges historiques, la compatibilité des identités et les plaques effectivement accessibles. Leur première vérification passe avec les sept tests canoniques du lot précédent : 14/14. Après correction de l'équipement ci-dessous, la vérification élargie passe 34/34 tests, incluant les missions canoniques et le catalogue d'objets débloquables. Le lint ciblé et le contrôle du diff passent également.

Les futurs dossiers des arcs 9325 (Luke), 9530 (Vader), 9531 (Han), 10483 (Kevin), 10484 (Stuart) et 10485 (Bob) doivent être régénérés à partir des nouvelles données. Les anciens prompts, images et journaux de génération restent des preuves historiques ; ils ne doivent pas être réécrits comme si ces images avaient été produites avec les nouvelles références.

## Équipement Minions corrigé

Le nom hybride « Freeze Ray Fart Gun » / « Pistolet à pet gelant » de `minions_fart_gun` a aussi été corrigé. Le slot désigne désormais le **Freeze Ray de jeune Gru dans la finale londonienne de Minions (2015)**, où il gèle Scarlet et Herb. Le Fart Gun de la franchise Moi, moche et méchant est un autre accessoire ; leurs noms et fonctions ne sont plus fusionnés.

L'ID sauvegardé `minions_fart_gun`, le chemin `/sprites/generated/items/minions/minions-fart-gun.png`, le prix 100 et les bonus `{ atk: 8, spd: 1 }` restent inchangés. Le nom canonique indépendant `gru_freeze_ray_minions_2015` et l'explication de l'alias sont explicites. Cet équipement reste un bonus passif : aucune mécanique de gel n'est annoncée ni ajoutée. La source de la scène est [le résumé du film sur Wikipédia](https://en.wikipedia.org/wiki/Minions_(film)), une source secondaire, complétée par les pages officielles Illumination pour le film et [les freeze rays de Gru](https://www.illumination.com/movie/despicable-me/).

La forme physique exacte du modèle 2015 reste à vérifier sur cette scène avant sa génération 1:1 ; aucune forme cachée n'est inventée dans l'ancrage visuel. Son image est manquante au moment de cet audit. Les anciens prompts et registres gardent leur texte historique. Trois tests contrôlent la projection finale de l'identité, l'absence de faux effet de gel, l'alias sauvegardé et les deux autres équipements Minions.

Le comportement exact de l'étranglement dans chaque moteur et la fidélité de chaque animation restent à auditer ; le seul ciblage RPG vérifié ne prouve pas toute la chorégraphie de Vader.
