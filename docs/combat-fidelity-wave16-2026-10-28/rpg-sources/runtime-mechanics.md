# États source réellement jouables dans le RPG

Les commandes de ciblage, l’aperçu et la confirmation emploient le même profil typé. Choisir une cible ou annuler ne consomme rien. La confirmation dépense une seule fois l’ATB et la charge nécessaires ; une interruption ne rembourse pas ce coût et ne relance pas l’effet.

| Mécanique | Résolution réelle |
| --- | --- |
| Mugman, Super Art II | Invulnérabilité personnelle pendant 4,85 secondes après l’activation. Les vrais dégâts entrants sont bloqués ; ils reprennent à l’expiration. Le renfort vers Cuphead est un relais distinct, explicitement adapté et limité à l’appelant. |
| Chalice, Shield Pal | Une protection persistante contre le prochain coup qui infligerait des dégâts. Aucun minuteur de garde générique. Le coup suivant blesse normalement. |
| Hakumen, Yukikaze | Armer le contre ne blesse personne. Un contact adverse recevable déclenche une avancée physique bornée ; la riposte doit encore atteindre l’attaquant vivant, présent et à portée. Les prises ne déclenchent pas le contre. |
| Akane, Paralyzer | L’autorisation typée de l’épisode 21 et une éligibilité explicite sont nécessaires. Immobilisation de 1,5 seconde, sans dégât, guérison, changement de camp ou élévation. La scène de validation choisit le vrai Kōgami. |
| Abe, possession | Chant de 1,1 seconde sur le vrai Slig historique. Une blessure, une immobilisation, une mort, un retrait ou la perte de portée interrompt l’état. Après le chant, une interface distincte pilote le fusil et permet de libérer le Slig. |

Le Slig conserve son PNG historique, son corps, ses coordonnées, son camp et sa propre ATB. Abe demeure immobile et chante. La commande « Tir du fusil du Slig possédé » sélectionne des adversaires depuis ce corps et dépense son ATB prête ; elle ne rebaptise pas une attaque d’Abe. Le tir part du canon mesuré sur la vraie pose historique 2, avec un seul impact résolu par le moteur. Libérer le Slig invalide toute action encore en préparation. Les valeurs bornées du RPG et le relais vers un autre personnage sont des adaptations déclarées.

Les séquences de Kirito, d’Aya et de BT conservent les identités des cibles confirmées. Chaque contact revalide sa portée réelle, 190 pour la mêlée ou 640 pour le tir de BT, après l’éventuelle approche RPG. Une cible qui s’échappe n’est pas frappée à l’autre bout de l’arène. Une blessure ou un contrôle invalide les événements restants. Les seize contacts de Starburst Stream et les sept de Liberate correspondent aux séquences retenues ; les quatorze événements de Burst Core sont un échantillonnage déclaré du feu continu, pas un nombre officiel de balles. Le RPG actuel est un espace ouvert sans géométrie d’occlusion ; aucune preuve de ligne de vue à travers un décor n’est revendiquée.

Pause, sélection avec attente et cinématique d’invocation figent les mêmes horloges de simulation. Le rendu ne modifie ni HP, ni position, ni ressources. Les preuves préliminaires restent distinctes des trois rapports finaux après gel : `summon-runtime-result.json`, `summon-wave16-result.json` et `source-mechanics-gamecanvas-final-result.json`. Les captures finales sont ensuite inspectées réellement et liées à leurs SHA dans les deux rapports de revue visuelle.

La scène contrôlée du navigateur prépare les vrais corps et leurs positions à portée. Pour montrer le fusil pendant une possession courte sans donner de charge gratuite, son Slig commence à 99,99 ATB sous la récupération adverse ordinaire ; son propre tick après le chant atteint 100. Ce réglage de validation est déclaré et ne change pas les règles du moteur.
