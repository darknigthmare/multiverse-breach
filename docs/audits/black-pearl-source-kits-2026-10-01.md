# Kits jouables — La Malédiction du Black Pearl (2003)

Les trois identifiants historiques sont conservés. Will Turner et Elizabeth Swann perdent leurs capacités générées par classe ; Jack Sparrow conserve son épée et son pistolet, avec une réserve source d’un seul tir. Leur équipement et leur récit sont verrouillés sur le premier film, sans importer les transformations du Hollandais volant ni le rôle de roi des pirates des suites.

| Identifiant | Équipement et actions | Limite de fidélité |
| --- | --- | --- |
| `jack_sparrow_potc` | Épée, feintes, pistolet à silex avec une balle réservée ; boussole sans attaque ni repérage automatique. | La remise à disposition d’une balle dans une nouvelle bataille est une adaptation du jeu. Dans Isla de Muerta, le tir final appartient à la transaction de la scène source. |
| `will_turner_potc` | Épée forgée, riposte et parade physiques du jeune forgeron de Port Royal. | Les dégâts, la durée de parade et les enchaînements sont des adaptations ; cette incarnation n’est pas le capitaine surnaturel des suites. |
| `elizabeth_swann_potc` | Couteau de table emprunté, esquives et évasion, robe de la scène captive à bord du Black Pearl. | Le kit répète des gestes défensifs dans un système de combat ; il ne certifie pas une chorégraphie experte. Le médaillon est un accessoire narratif antérieur, confisqué par Barbossa, jamais une arme. |

Les attaques au contact ciblent un seul adversaire, à une case en Tactics et à courte portée en Smash. Seul le tir de Jack utilise une livraison à distance. Le retour visuel est un impact physique ou une balle avec fumée, sans laser, flash de zone Nexus ni `Origin Burst`.

Les PV, attaque, défense, vitesse, multiplicateurs de dégâts, délais et identifiants restent ceux des fiches existantes : Jack `100/12/6/6`, Will `105/14/5/6`, Elizabeth `120/11/7/4`. Les chemins d’images historiques restent identiques. Aucun bitmap n’a reçu de validation graphique 1:1 ; les trois revues visuelles restent en attente.

Les données de Jack sont partagées avec le kit P0 existant, afin qu’une nouvelle projection P0 ne rétablisse pas son ancien récit incomplet. Les plaques FR/EN présentent les offrandes de Will et de Jack et distinguent l’équipement source des chiffres de combat.

## Références consultées

- [Disney — film de 2003](https://movies.disney.com/pirates-of-the-caribbean-the-curse-of-the-black-pearl) et [D23 — notice du film](https://d23.com/a-to-z/pirates-of-the-caribbean-the-curse-of-the-black-pearl-film/) : film, personnages, capture d’Elizabeth et malédiction de l’équipage.
- [Résumé du film](https://en.wikipedia.org/wiki/Pirates_of_the_Caribbean:_The_Curse_of_the_Black_Pearl) : Jack prend une pièce ; la restitution des dernières pièces et le tir concluent le duel.
- [Will Turner](https://en.wikipedia.org/wiki/Will_Turner) : apprentissage de forgeron, fabrication d’épées et entraînement à l’escrime.
- [Elizabeth Swann](https://en.wikipedia.org/wiki/Elizabeth_Swann) : médaillon pris à Will enfant, négociation avec Barbossa, rôle de 2003 distinct des costumes et armes des suites. L’article rapporte aussi que cette Elizabeth ne porte pas le kit à épée des films suivants.
- [Jack Sparrow](https://en.wikipedia.org/wiki/Jack_Sparrow) et [dialogues du film](https://en.wikiquote.org/wiki/Pirates_of_the_Caribbean:_The_Curse_of_the_Black_Pearl) : pistolet avec un seul tir, absence de poudre et de munitions supplémentaires ; boussole qui ne pointe pas le nord.
- [Scénario IMSDB](https://imsdb.com/scripts/Pirates-of-the-Caribbean.html) : le couteau de table de la scène du dîner est un accessoire de fuite improvisée. Ce document est un brouillon : il ne sert pas à certifier l’ordre des actions du duel final. La chorégraphie exacte et le costume du couteau restent à comparer au film avant approbation 1:1.

## Vérification

`scripts/canonBlackPearlSourceKits.test.mjs` vérifie 33 cas : données historiques, immutabilité, identités exactes, plaques FR/EN et 27 exécutions réelles dans les moteurs RPG, Tactics et Smash. Chaque attaque affecte la victime valide attendue, sans dégât de zone ni laser. Les contrôles de réserve unique et de transaction de la scène sont également testés dans leurs suites moteur dédiées ; ce rapport décrit les profils et la politique partagée.
