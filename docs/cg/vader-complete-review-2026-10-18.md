# Darth Vader — revue de livraison partielle

Deux CG sont livrées : CG02, sabre rouge complet à poignée MPP, et CG03, puits industriel de Cloud City. Le reçu `vader-complete-2026-10-18.json` contient les entrées au schéma courant, dimensions, hashes, poses, décors et limites de revue. Les deux entrées sont validées par `createCgDefinition`.

Les sources publiques PNG sont opaques RGB, 1086 × 1448 ; les masters WebP mesurent 1536 × 2048 et les vignettes 384 × 512. Seuls le conditionnement de format et les dérivés ont été réalisés par Sharp. Le premier essai CG02 avait une lame coupée par le cadre ; il a été rejeté. Le second, corrigé par ImageGen, présente la lame et ses deux extrémités dans l’image.

## Sources inspectées

Deux images officielles ESB provenant de StarWars.com ont été téléchargées et vues : le portrait de la page du film, montrant casque, épaulière et boîtier de vie, et le photogramme de la plateforme de Bespin, montrant l’armure entière. La photo officielle du sabre, publiée dans le Databank, a aussi été inspectée. Les URL exactes, hashes et statuts `viewed` sont dans `vader-reference-evidence-2026-10-18.json`.

L’article officiel sur l’évolution des costumes confirme les différences ESB, notamment l’évent de menton en V plus large, les lentilles ambrées et la robe intérieure sous l’armure de col. La provenance du prop MPP employé dans ESB est documentée par Propstore. La photo Databank n’est pas légendée comme un prop exclusivement ESB : les petits composants et la géométrie précise ne sont donc pas certifiés au pixel près. La CG03 conserve le langage architectural du photogramme source avec un cadrage original.

## Série de quinze

Le plan public `vader-complete-plan-2026-10-18.json` décrit les quinze thèmes et poses, leurs décors distincts, les contraintes d’armure fermée et les variantes explicitement non canoniques. Les CG de personnage ne sont pas livrées : CG01, CG04 et CG09 ont toutes été refusées par le fournisseur à la sortie dans la catégorie `other`, sans fichier final fourni. Les identifiants des trois refus sont consignés dans le reçu. Les autres dix slots n’ont pas été générés après ces refus.

Aucun prompt n’a été atténué pour contourner les refus et aucun substitut original de Vader n’a été créé. Le registre global et les anciens assets sont inchangés par ce lot.
