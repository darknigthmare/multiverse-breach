# Quarante personnages originaux en Mêlée et en RPG

Les **20 héros restants** du manifeste ont maintenant un super défini pour la Mêlée. La couverture atteint **60 héros**. Les nouveaux profils reprennent le nom, l’arme et la couleur de chaque fiche. Ils définissent la portée, la géométrie, le moment d’impact et l’effet de chaque super. Le lot contient quatorze attaques, trois soins, deux renforcements et une garde. [Fiches et mesures](actors-reviewed.json)

Mara Veylan transmet son *Ordre Zéro Radio* à ses alliés proches. Aura-7 rend des PV aux membres blessés de son groupe. La surcharge de Merek Flint frappe autour de la chaudière et les rayons de Céleste Ray frappent dans l’axe de son émetteur. Les profils de Mêlée des 40 héros précédents ont été comparés à la révision de départ. [Registre Mêlée](../../../../src/game/originalMeleeSupers.js)

Les **20 boss désignés par les missions RPG originales** gagnent une attaque secondaire. Le Collecteur d’Orcus et les 19 boss mondiaux sont accessibles par la campagne et en Combat custom. Helio‑1 inflige des dégâts et irradie les cibles prises dans sa fuite de fusion. La Porte de Yomi applique le Glitch dans une zone sans retirer de PV. Les batteries de Moloch suivent une ligne. Les 120 secondaires des ennemis ordinaires gardent leur propre registre. [Registre RPG](../../../../src/game/originalCampaignEnemyActions.js)

Les essais Mêlée déclenchent les 60 supers en J1 et J2. Pour chacun des 20 boss, les essais RPG passent par la progression de vague et la décision CPU de la campagne, puis par la prévisualisation, la confirmation et l’impact en J2 dans Combat custom. La confirmation consomme l’ATB une fois et lance trois secondes de recharge. Les tests vérifient aussi l’exclusion des cibles éloignées et la priorité des commandes explicites. [Compte rendu des essais](verification.json)

Cette livraison couvre les règles de ces commandes avec les sprites et effets intégrés au jeu. Les nouvelles planches raster et les mécanismes complets de phase des boss restent des chantiers ouverts.

### Rejouer les tests

```sh
node --max-old-space-size=2048 --loader ./scripts/sourceSceneTestLoader.mjs --test --test-concurrency=1 \
  scripts/originalMeleeSupers.test.mjs \
  scripts/originalCampaignBossSecondaries.test.mjs \
  scripts/originalCampaignEnemyActions.test.mjs
```
