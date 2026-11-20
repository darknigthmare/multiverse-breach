# Quarante secondaires RPG pour les ennemis originaux

Quarante ennemis ordinaires gagnent une commande RPG propre au rôle et à l’arme de leur fiche. Le lot couvre les 20 derniers ennemis ordinaires des 20 univers du manifeste original, neuf menaces de Thalassa Mnémique, du Méridien Creux et de Viridienne Ultime, et onze menaces du Nexus. La Matrice de Substitution conserve sa clé par nom. Le registre atteint **120 commandes**, avec 80 commandes précédentes identiques et 160 profils d’attaque simple, de garde, de spéciale et d’invocation comparés à la version de départ. [Fiches et comparatif](actors-reviewed.json) · [Registre](../../../../src/game/originalCampaignEnemyActions.js)

| Effet | Nombre | Exemple |
| --- | ---: | --- |
| Dégâts | 23 | Le Pollen du Vide répand des graines dans une zone et applique le Glitch aux cibles touchées. |
| Glitch seul | 7 | La Rature du Seuil Blanc ralentit la recharge ATB de sa cible à demi-vitesse pendant cinq secondes, à 0 PV perdus. |
| Protection | 7 | Le Drone Nul paléen couvre ses alliés à portée. |
| Renforcement | 2 | La Matrice de Substitution renforce ses alliés proches pendant trois secondes. |
| Soin | 1 | La Brute troll des ponts régénère 16 % de ses PV maximum dans la limite des soins autorisés. |

Les tests exercent les 120 commandes J2 jusqu’à l’impact. Ils vérifient les cibles prévisualisées, une seule dépense d’ATB et trois secondes de recharge. Le Troll utilise son soin blessé en campagne et attaque normalement si ses PV sont pleins. Dans Chromium, le clavier confirme le soin du Troll, le tactile choisit la cible de la Rature avec le ralentissement annoncé et le Pollen atteint deux héros sur trois. Un PNG du Pollen, deux éléments de Viridienne et cinq objets de Valedor ont répondu 404 pendant ces essais. [Tests moteur](../../../../scripts/originalCampaignEnemyActions.test.mjs) · [Vérification par scénario](verification.json)

Les commandes adaptent les fiches des ennemis à la simulation RPG actuelle. La copie exacte de la dernière attaque, le changement de ligne temporelle, les interactions avec le territoire des ponts, les animations et la validation des médias restent au suivi. [Manifeste des univers originaux](../../../../src/game/originalUniversesManifest.json) · [Ennemis du Nexus](../../../../src/game/enemies.js) · [Catalogue des DLC](../../../../src/game/ocDlcPacks.js)
