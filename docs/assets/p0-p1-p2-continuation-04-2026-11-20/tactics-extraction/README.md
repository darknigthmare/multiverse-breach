# Tactics — extraction sur les passerelles du Nexus

Une unité valide l’extraction lorsqu’elle arrive au sol sur la surface demandée. Le moteur réserve déjà sa destination dès la confirmation du déplacement. L’IA continue à traiter cette place comme occupée, mais l’objectif attend la fin du trajet. Le K.O. en chemin laisse l’extraction à zéro, même si un allié survit.

Le contrôle porte sur les objectifs qui testent l’occupation d’une surface verticale. Cela couvre l’extraction, l’arrivée d’une escorte verticale et la tenue d’une zone. Cette dernière marque toujours les points à la fin des tours. Les combats sur terrain plat suivent leur règle d’occupation existante. [Règle d’occupation des objectifs](../../../../src/game/tacticsVerticalRuntime.js).

Sur les passerelles du réseau, deux contre-épreuves moteur ont reproduit la panne avant le correctif. Le premier pas vers `catwalk:8:4` déclenchait la victoire au premier tick alors que la marche était encore active. Avec une escouade de deux unités, le même pas comptait une extraction même après un K.O. avant l’arrivée. Les 22 tests d’intégration passent après le correctif. Ils vérifient aussi la pause et le refus de la surface réservée dans le calcul de trajet du CPU. [Tests moteur](../../../../scripts/tacticsVerticalIntegration.test.mjs).

Dans Chromium, le même combat custom a été joué avant et après, avec six déplacements P2 pour libérer la passerelle puis onze déplacements P1. Auparavant la victoire affichait encore l’unité sur `catwalk:8:3`. Après correction, le compteur reste à zéro durant les dix ticks du dernier mouvement et la victoire se déclenche une fois sur `catwalk:8:4`. Les deux parcours se terminent sans erreur de page. [Reçu avant et après](verification.json).
