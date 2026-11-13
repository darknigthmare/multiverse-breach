# Lot 004 — acteurs `actors-001`

Les 40 identités sont réservées dans `reserved-actors.json`. **Un défaut concret de liaison visuelle est corrigé pour Darth Revan, KOTOR I** ; les 39 autres dossiers restent ouverts. Aucun nouvel appel de génération ni aucune approbation globale P0/P1/P2 n’a été réalisé.

L’ancienne image de Revan porte simultanément un sabre rouge et un violet. La spécification 501st distingue KOTOR I, un sabre rouge, de KOTOR II, rouge et violet. Le projet avait déjà livré un correctif à sabre rouge unique, mais sa quarantaine par identité empêchait aussi ce correctif de s’afficher : le corps et le HUD montraient `ART PENDING`.

Le raccord permet uniquement le PNG existant `/sprites/generated/combat-character-corrections-wave13-part-b/darth_revan.png`, SHA-256 `c9f46d3fc0e0144afab53632c1be6d07508975645b2b2bfff30478e5e5fb1fbf`, pour l’ID stable Revan et son incarnation KOTOR I exacte. Il contrôle aussi la provenance native, le travail source, la grille de 16 poses, la baseline et l’échelle. Les alias contradictoires, autres éditions et autres acteurs ne reçoivent pas cette exception. L’ancien atlas reste en quarantaine et les 48 poses non revues ne sont pas activées.

Le corps utilise le renderer existant, avec ses poses idle/run/attack/hit. Le HUD recadre seulement ce correctif sur la capuche, le masque et le torse, dans le rectangle source `[100,116,58,72]`. Aucun PNG, manifeste d’assets, chiffre de combat, sauvegarde ou source historique n’est remplacé. Les checksums fixent les fichiers de dépôt/build ; aucune authentification cryptographique des images par le navigateur n’est annoncée.

Les captures `before-engine-scale.png` et `after-engine-scale.png` utilisent réellement `drawPixelSprite` et `drawCombatantBust`, aux tailles nominales de 72/108 et 64 pixels. Le premier rendu n’appelle aucun bitmap ; le second comporte 13 dessins issus exclusivement du correctif. `engine-pose-cycle.gif` et sa trace parcourent les 16 cellules. Le GIF sert à inspecter les poses ; il ne certifie pas une cadence ou une chorégraphie source.

**26 tests passent**, couvrant le raccord, le rejet des mauvais chemins/hashes/éditions, la quarantaine conservée, les identités voisines et les métadonnées CG actuelles. La revue indépendante de `/root` et celle de l’agent d’audit confirment la correction bornée. Le corps, la lame rouge et le HUD sont lisibles ; les détails fins du masque/costume, le mesh et la fidélité complète restent non vérifiés.

Les preuves sont regroupées dans `binding-manifest.json`, `source-reference.json`, `technical-qa.json`, `source-checkpoint.json`, `independent-review.json` et `validation/runtime-tests.*`. Les producteurs CG sont traités séparément par l’agent qui les possède : l’ancien bitmap demeure `OLD`, le correctif actuel est distingué sans transformer `visualFidelityApproved` en approbation globale.

Les refus historiques sont conservés. L’audit Spider (1997) manque encore de vues lisibles de jambes et de montages ; les refus retrouvés pour les autres identités n’ont déclenché aucune nouvelle tentative ou substitution.
