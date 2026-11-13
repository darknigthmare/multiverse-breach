# Lot 001 — 40 identités P1 contrôlées

Deux chemins de sprites pointaient vers des PNG absents alors que leurs planches Alien (1979) avaient déjà été livrées sous `alien-1979`. Le catalogue utilise maintenant les seize poses existantes du Chestburster Larva et les seize poses de Synthetic Ash Protocol. Aucun PNG n’a été créé ou modifié dans ce lot.

Les deux acteurs déclarent désormais leur incarnation `Alien (1979)`. Le raccord exige le nom exact, l’univers `Alien`, cette incarnation et l’arme existante (`inner_jaw` ou `corporate_override`). Les statistiques, actions et identités de sauvegarde restent identiques. Un autre film, une arme différente ou une désignation voisine ne reçoit pas cette planche.

L’[audit initial de 40 acteurs](baseline-audit.json) est conservé octet pour octet sur l’arbre projeté `72bea3d324e144c00b5f61677ee9f66b431ba43c`. Les autres 38 cas restent ouverts : 36 sans raster d’identité exacte retrouvé dans cet arbre ; deux possédant une planche de 1979 incompatible avec leur scène actuelle d’Aliens (1986). L’absence dans cet arbre ne prouve pas qu’aucun brouillon non indexé n’existe.

Les SHA, dimensions et provenance des deux images réutilisées sont épinglés dans [la preuve Chestburster](chestburster-larva-existing-asset-proof.json) et [la preuve Ash](synthetic-ash-protocol-existing-asset-proof.json). Leurs grilles complètes ont été inspectées avec `view_image` ; les images historiques et leur audit du 19 juillet sont inchangés.

Les [cinq tests ciblés](validation/targeted-tests.log) passent sous Node22, avec le catalogue actif et les vrais résolveurs. Ils contrôlent aussi les SHA des PNG, les grilles 4×4, les projections d’identité et les refus de transfert vers une autre édition. Il s’agit de tests de modules ; aucun parcours navigateur n’a été effectué pour ce lot.

Seule l’absence de raccord raster des deux identités est corrigée. La fidélité visuelle 1:1 reste **non certifiée**, les autres tâches de source et d’animation restent ouvertes. La [livraison structurée](delivery.json) distingue les corrections de liaison des travaux de génération.
