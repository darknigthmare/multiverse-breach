# Cité et Extinction — continuation du 27 octobre 2026

Base master vérifiée : `1460d0ebbb67f1809ac2f8b4bf76d5f8126f4aa6`, après fusion de la PR nº 9. Cette suite ne modifie pas les PR équipement nº 10 et Fighter nº 7. Aucune fusion ni promotion de production.

## Changements

- Répertoire de tous les habitants possédés et visibles : recherche nom/univers/ID, pagination de neuf résultats et groupes de dix-sept habitants, plus Mirelle dans l’Atrium. L’Ancre n’est pas dupliquée en PNJ. Les identités pacifiques restent des habitants, pas des combattants FPS.
- Rejoindre un habitant ferme le terminal, change le groupe si nécessaire et fait marcher l’Ancre. Les corps des PNJ restent solides. Les trajets évitent les autres habitants et suivent l’identité de la cible lorsqu’elle marche ; les commandes manuelles et le terminal annulent la poursuite. Les positions restent stables lors des réaffichages du parent.
- Les mains FPS et l’effet de tir conservent les proportions de leurs sources. Le rognage est borné à la cellule déclarée. Mirelle garde sa recharge ligne 6 avec marges 40/6. Aucune nouvelle ligne de recharge n’est attribuée à Arthur ou Serj.
- Le contrôle de progression n’exige plus l’ancien texte de découpage dans HubScreen : il exécute un contrat du résolveur, des cellules et des replis d’identité, avec tests négatifs.

## Validation des fichiers publiés

Exécution [40508601682](https://github.com/darknigthmare/multiverse-breach/actions/runs/40508601682) : **121/121 tests ciblés**, **68/68 tests UI**, **10/10 nouveaux scénarios Chromium**, **6/6 scénarios de sélection/identité existants**, analyse de huit modules sans erreur ni avertissement et compilation Vite du snapshot réussie. Les suites se recoupent ; ne pas additionner leurs nombres comme des tests uniques.

Cité : trois identités rejointes dans quatre formats (390×844 EN, 1280×900 FR, 844×390 FR, 2560×1080 EN), soit douze approches. Les deux premiers habitants testés sont non combattants. La simulation marche normalement : pas de téléportation, de récompense ajoutée ou de déblocage utilisateur.

FPS : Mirelle sur ces quatre formats, Arthur en 1280×900 EN et Serj en 1280×900 FR. Les entrées natives consomment une munition, attendent la fin du tir, puis rechargent réellement. Les appels drawImage vérifient les cellules et le rapport d’aspect.

Les tests préparent la possession et utilisent une horloge virtuelle. Le bouton QA de réaffichage est déclenché par le banc de test hors du dialogue volontairement inerte ; il ne modifie pas la simulation. Aucun compte ou appareil physique n’est utilisé. Le checkout CI ne contient que les médias requis : les décors secondaires Arthur/Serj et le portrait du personnage de fin de liste ne sont pas certifiés chargés. Les mains personnelles attendues sont bien décodées.

## Échecs conservés et correction effective

L’exécution initiale interrompue lisait le journal fermé et tirait pendant le délai initial. Le contrôle suivant confondait texte source et affichage en majuscules. Une fois ces défauts du banc corrigés, un vrai défaut a été reproduit : l’approche de Bastion s’arrêtait contre un autre habitant. La navigation contourne maintenant ces corps sans supprimer leurs collisions ; six nouveaux tests couvrent détours, cible mouvante, obstacles, annulation et cible supprimée. Les exécutions 40470559492, 40506229605 et 40507136894 restent des échecs historiques, non des succès masqués.

## Ce qui reste ouvert

La liste globale conserve 525 univers, 1 912 personnages, 1 518 entrées ennemies et 1 507 occurrences de boss. Une ligne d’Excel n’est pas un nouvel asset.

Les trois raccordements FPS restent partiels : l’effet Mirelle est une superposition visuelle, pas un projectile physique autonome. Les planches demandent encore une revue artistique (séparation des mains/armes/effets, cadrage de chaque pose, incarnation, tenues et animations), et les milliers d’autres vues restent à produire. Les six archétypes ennemis génériques ne deviennent pas le bestiaire complet.

Restent aussi : individualiser les 7 244 actions cataloguées, produire les quartiers/props spécifiques, monter et parcourir toutes les destinations de services, tester les 40 écrans, les autres combinaisons et le matériel physique, le vrai cloud et les performances. Le bot Infestation intermittent signalé dans la PR équipement reste à diagnostiquer ; cette passe ne change ni sa difficulté ni ses conditions de victoire.

Les résultats de la compilation complète et des workflows du commit final sont distincts du snapshot vérifié. Voir les Checks de la nouvelle PR.
