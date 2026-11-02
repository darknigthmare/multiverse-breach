# Reprise PR 4 : contrôles Fighter et validations interrompues

Base exacte : `8eef2fe0c7fadc15ec6449f432ebb03c4c7d10d8`.
Le snapshot de sources a été récupéré sur cette révision ; 878 blobs comparés
à leur SHA Git, sans écart. Le checkout local n'inclut pas tous les bitmaps.

## Échecs trouvés dans les artefacts de la base

- Build complet, run 39215274264 : 940/941 tests de `test:conversation`.
  Le test `FighterMode visibility transitions discard hidden time even when no
  RAF runs` exécutait le corps du callback extrait sans son `engine` capturé.
  Le callback de production était valide ; le contexte de sa recette ne l'était
  plus. Le test conserve le contrôle des horloges et vérifie maintenant aussi
  pause / retour visible / maintien d'une pause explicite du shell.
- Fiabilité, run 39215274324 : 2/6 recettes Fighter (les deux erreurs volontaires)
  réussies, quatre expirations de délai sans erreur de rendu. La recette demandait
  le remplacement après la manifestation de l'ÜberCharge mais avant la fin de
  récupération de son action. Elle attend désormais le vrai `canAct`, sans
  réinitialiser une action ni autoriser une permutation pendant le super.
- `fixedStepClock.test.mjs` rejoint le groupe rapide `test:reaudit`, en plus du
  prébuild historique : ce désaccord est maintenant vu avant le build complet.

## Défauts de commandes reproduits et corrigés

1. `clearInputs` vidait les touches mais laissait la garde / position accroupie
   affichée jusqu'au prochain pas. Une pause ou perte de focus les libère
   immédiatement. L'attaque en attente, la réaction au coup et les vitesses
   physiques ne sont pas effacées par ce nettoyage.
2. Un remplacement conservait les touches du combattant précédent. Le moteur
   libère le seul camp concerné ; l'autre joueur reste indépendant. La garde et
   l'accroupissement du remplaçant ne survivent pas à un ancien passage.
3. Le composant conservait également une seconde copie des touches et pouvait
   les réinjecter au pas suivant. `fighterControlOwnership` suit l'identité
   réelle du personnage actif, avant les entrées et après chaque update, pour
   couvrir clavier, tactile, remplacements manuels et remplacements après KO.
   Une nouvelle pression après remplacement reste utilisable.
4. `canTag` est partagé par la commande et son affichage. La liste ne promet
   plus READY pendant la récupération d'une action ou une pause d'impact. Les
   boutons de remplacement, d'assist et de super de terrain reflètent maintenant
   les conditions de disponibilité. Aucun délai ni coût n'a été réduit.
5. Une permutation forcée appelée pendant le gel d'impact est refusée ; la
   permutation automatique légitime après KO continue après ce gel. Un réserviste
   marqué mort n'est pas admissible même si ses PV ont été modifiés isolément.

Six reproductions sur le moteur de base échouent (garde/accroupissement P1/P2
pendant pause ; touches transmises au tag P1/P2), puis réussissent après correction.
Les tests ajoutés couvrent aussi les refus sans dépense, les entrées de l'autre
camp, l'identité d'un moteur remplacé et les métadonnées de disponibilité.

## Recettes et preuve

Les quatre recettes de cycle de vie Fighter utilisent toujours le vrai composant
et le vrai moteur, en 1280/390 px et FR/EN, P1/P2. Elles maintiennent désormais
une touche de garde pendant le remplacement pour contrôler qu'elle ne passe pas
au personnage entrant. La pause désactive les boutons de la liste. Les deux
recettes d'erreur volontaire du renderer, le redémarrage et l'abandon sans gain
restent conservés. Les résultats enregistrent l'étape en échec et un état de
combat synthétique, pas des données de compte.

Validation locale finale : `npm run test:reaudit` réussit (158 tests, aucun ignoré).
Cette reprise ajoute 30 tests de commandes et 16 tests de routes de remplacement ;
les dix tests existants de l’horloge rejoignent également le groupe rapide.
Le navigateur local ne peut pas naviguer vers localhost (`ERR_BLOCKED_BY_ADMINISTRATOR`)
; les résultats Chromium de GitHub font foi. Aucun succès navigateur local,
prébuild intégral local ou publication de production n'est revendiqué.
Les validations finales doivent porter sur le commit effectivement poussé.

## Limites

Pas de nouveau moveset, asset, univers, signature ou certification artistique.
Le remplacement ne devient ni une annulation de super ni une immunité gratuite.
Les grandes suites d'assets, campagne, tutoriel, autres moteurs et comptes réels
restent des chantiers distincts. Aucun merge ni changement administratif.

## Dernier contrôle périmé du prébuild

Après les six recettes Fighter réussies, le build intégral de `1e7cf3bd` a atteint
`check:progression`, puis échoué sur un second contrôle textuel : il exigeait
l'ancien alias `triggerPlayerAction('tag')`. La commande utilise désormais le
répartiteur partagé des deux camps. Le contrôle est remplacé par 16 tests qui
exécutent les vrais callbacks clavier et bouton extraits de FighterMode avec
le vrai moteur : les trois emplacements, P1/P2, pause, onglet masqué et gel
d'impact. Aucune commande du jeu n'a été rendue plus permissive. Les autres
contrôles de progression et d'assets restent conservés.

Ces tests sont présents dans le groupe rapide (158 tests au total) et sont aussi
appelés par le prébuild. Le résultat final doit être relu sur la nouvelle tête.
