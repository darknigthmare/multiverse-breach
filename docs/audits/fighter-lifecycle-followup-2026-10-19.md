# PR 4 — Fighter : dégâts, commandes et cycle de vie

Base fonctionnelle : `383348e9ce2b5313b58c0dc60017340cffe2e413`.
Les 879 fichiers du snapshot de continuation ont été vérifiés par leur empreinte
Git. Le workflow de snapshot est supprimé du lot final. Les images non rapatriées
ne sont pas considérées comme validées localement.

## Défauts reproduits et corrections

- Le dernier PV retiré pouvait alimenter les statistiques et jauges avec la
  totalité des dégâts théoriques. Le scénario de référence mesurait 109,2 dégâts
  et 89,544 points de jauge pour 1 PV. Il donne maintenant 1 dégât et 0,82 point.
  Les gains de super de terrain et d'assist suivent aussi les PV réellement ôtés.
- Un nom de commande hérité d'Object.prototype (`constructor`, `toString`...) était
  accepté et créait une action sans durée. Seules les propriétés propres de la
  table de commandes sont désormais admissibles. Les camps inconnus, indices de
  remplacement invalides et jauges non numériques sont refusés sans dépense.
- Fighter ne possédait ni `dispose` ni `setPaused`. Ces opérations sont maintenant
  raccordées à l'écran : pause explicite, onglet masqué, abandon, revanche et
  démontage. Les entrées sont copiées et vidées pour éviter les déplacements
  maintenus. Une action préparée reste gelée pendant la pause, pas annulée.
- Une deuxième demande de fin pouvait remplacer une victoire par une défaite et
  réinitialiser son délai. La première conclusion est désormais définitive et
  n'est livrée qu'une fois. Un abandon pendant son délai ne livre aucun résultat.
- Les projectiles d'un personnage KO disparaissent immédiatement, avant une
  éventuelle résurrection dans le même pas. Un projectile déjà lancé par un
  personnage vivant reste valide après son remplacement volontaire : ce contrat
  de projectile physique n'est pas transformé en cible verrouillée de RPG.
- Les projectiles vérifient le segment parcouru dans leur durée restante, leurs
  valeurs numériques, leur propriétaire et son camp. Les modifications de la
  liste provoquées par un KO ne retirent plus un autre projectile par erreur
  d'indice. Le stock est borné à 64 projectiles actifs pour le duel.
- Un effet de terrain explicitement à zéro dégât ne reçoit plus la frappe de
  secours de 36 ; un ratio de soin négatif ne peut plus blesser les alliés.
  Les dégâts, soins et statistiques n'acquièrent aucune règle canonique nouvelle.
- Une erreur de la boucle de rendu arrête le moteur, libère ses effets et affiche
  un message avec reprise/retour. Elle ne fabrique pas un résultat de victoire.
  Une erreur de rappel après un résultat déjà livré ne génère pas un second résultat.

## Périmètre préservé

Les contrats de support Medic déjà ajoutés, la garde orientée, le recul,
l'invulnérabilité d'entrée des remplaçants et les coûts des coups existants restent
applicables. Aucun nouvel asset, personnage, invocateur ou moveset source ajouté.
Les signatures d'autres modes ne sont pas renommées ni modifiées par cette passe.
Les statistiques de Fighter reflètent des dégâts effectifs ; ce changement peut
réduire un score auparavant artificiellement augmenté par les dégâts excédentaires.

## Vérification

- Nouveau fichier `scripts/reauditFighterLifecycle.test.mjs` : 49 tests locaux
  réussis, avec les vrais moteurs et données. Un chargeur local résout uniquement
  les imports JS sans extension. En CI le chargeur Vite existant est conservé.
- Les nouveaux tests sont inclus automatiquement dans `test:reaudit`, déjà lancé
  par le prébuild complet et la CI de fiabilité ; aucun test antérieur supprimé.
- Six nouvelles recettes Chromium : interface Fighter réelle, états initiaux
  préparés, français/anglais, fenêtres desktop/mobile, deux côtés du duel.
  Elles vérifient le Medic, la pause, le remplacement, le dernier PV, l'abandon
  avant résultat et le démontage. Deux recettes injectent volontairement une
  exception de rendu pour tester l'erreur visible et la reprise.
- Les empreintes, les résultats avant/après et les logs de la CI sont livrés avec
  le lot. La réussite de Chromium et du prébuild complet est à vérifier sur la
  tête publiée, distinctement des tests Node locaux.

## Limites

Pas de parcours de campagne complet ni de téléphone physique, de compte réel ou
de réception d'email. Les paramètres de dégâts synthétiques invalides testent des
invariants ; ils ne démontrent pas qu'un effet du catalogue avait déjà un ratio
négatif en production. Le test de trajectoire à grand pas protège le répartiteur,
alors que la boucle normale conserve son pas fixe. Les visuels de test ne sont
pas des planches d'animation ni une certification de fidélité 1:1.

Le tutoriel complet, les rencontres/finales, les capacités restantes et les assets
listés dans l'audit du 18 octobre restent des chantiers distincts.
