# Quarante autres secondaires RPG de campagne

Ce lot couvre 40 adversaires ordinaires de huit univers originaux, à raison de cinq par univers. Ils utilisaient tous le tir secondaire générique `Strong attack`. Les deux lots de commandes couvrent désormais **80 adversaires distincts**. Le nouveau registre associe chaque commande à son arme, son identité et sa signature de campagne. La comparaison retrouve les mêmes 160 profils d’attaques simples, de gardes, de spéciales et d’invocations. [Profils par acteur](actors-reviewed.json) · [Source des signatures](../../../../src/game/originalUniversesManifest.json) · [Registre des commandes](../../../../src/game/originalCampaignEnemyActions.js)

| Type de secondaire | Acteurs | Effets vérifiés |
| --- | ---: | --- |
| Dégâts | 30 | La ligne de givre du Jötunn sélectionne les acteurs alignés. La Gorgone affecte les deux héros dans sa zone avec des dégâts et du Glitch. |
| Protection | 6 | Le Myrmidon couvre son groupe à portée. Le Colosse-idole monte sa propre garde. |
| Renfort | 4 | L’Oni gagne 22 % d’attaque pendant trois secondes. Le Chasqui et le Fiélon renforcent leurs alliés proches. |

Les tests du moteur jouent les 80 commandes en J2 et vérifient l’identité des cibles, le coût et les impacts. En campagne, le CPU joue la fureur de l’Oni, qui se termine au terme du compteur. Le parcours Chromium au clavier confirme le bonus de l’Oni et l’absence de dégâts aux héros. Au tactile, la Gorgone affecte les deux cibles annoncées, puis le jeu se démonte sans erreur JavaScript. Certains médias auxiliaires restent indisponibles dans le checkout de test. [Mesures et résultats](verification.json)

Les actions sont des adaptations du RPG. La pétrification des cases, les contrats différés, la copie d’objets et les animations complètes des autres modes restent au suivi. [Régressions moteur](../../../../scripts/originalCampaignEnemyActions.test.mjs)
