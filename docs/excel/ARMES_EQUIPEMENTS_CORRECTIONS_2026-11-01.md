# Dotations verrouillées par incarnation — 1er novembre 2026

Audit basé sur le master `698975774df66c32a730cf00156c0ccbf5a28af5`. Les corrections ci-dessous modifient le **jeu et les données source**, mais ne certifient **ni les pixels des sprites, ni les animations, ni l’Excel exhaustif historique**.

## Correctifs appliqués

- **Ahsoka Padawan** : sabre vert, sans accessoires non vérifiés dans le kit physique.
- **Ahsoka Siège de Mandalore** : deux sabres bleus rendus par Anakin ; la fréquence Fulcrum est une information, pas un objet, et sa tenue relève de la présentation.
- **Ahsoka adulte (Rebels)** : paire blanche, sans archive ou balise de navette non attestée dans le kit.
- **Maul, Shadow Collective/Mandalore** : demi-sabre rouge à lame unique après la coupure sur Naboo ; Darksaber décrit comme accessoire contextuel et emblème de pouvoir, non comme kit permanent. Les jambes cybernétiques restent une prothèse, non une arme. Le « Command Seal » sans preuve quitte la dotation.

Les changements ciblent les objets **certifiés par une référence pour la période**, pas une dotation totale et définitive. Le retrait de lignes non étayées ne démontre pas leur absence de toute œuvre de la franchise.

## Sources principales

- https://www.starwars.com/databank/ahsokas-lightsabers
- https://www.starwars.com/news/clone-wars-declassified-5-highlights-from-old-friends-not-forgotten
- https://www.starwars.com/databank/ahsoka-tano
- https://www.starwars.com/databank/darth-mauls-lightsaber
- https://www.starwars.com/databank/darksaber
- https://www.starwars.com/databank/maul

[Éléments corrigés et exclusions, importables dans Excel](equipment-continuity-locks-2026-11-01.csv).

## Validation et suite des manquants

Le fichier `scripts/canonicalEquipmentIncarnations.test.mjs` protège les 4 fiches et leurs contraintes. Il est ajouté à `test:conversation`, exécuté dans `prebuild`. Vérifier les CI sur le commit réel avant fusion.

Le classeur complet déjà intégré sur master reste un **instantané de l’audit précédent** : il doit être régénéré contre le nouveau commit après fusion, puis le suivi doit être rapproché par ID stable. Le CSV est livré dès cette PR pour consultation. Ne pas marquer les dossiers « terminés » tant que les sprites, silhouettes, animations, modèles et usages n'ont pas été vérifiés en jeu.

Prochaine priorité : les **4 882 acteurs sans liste** ne doivent pas être remplis par simple association d’univers ; verrouiller leur incarnation, distinguer armes, protections, outils, pouvoirs, véhicules, équipements de scène et objets non-combattants, puis rapprocher chaque entrée de l'asset et du gameplay. Les chiffres de l'audit antérieur ne deviennent pas des nouveaux compteurs sans réextraction.
