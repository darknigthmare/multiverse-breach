# Tactics — objets ramassés à l’arrivée

Dans les combats sur plusieurs étages, le personnage ramasse l’objet lorsque son déplacement est terminé et qu’il se trouve sur la surface de l’objet. Un K.O. pendant le trajet laisse l’objet sur le plateau. Si le combat est en pause, le ramassage attend la reprise et la fin du déplacement.

Sur le pont du Nexus, `ground:4:3` et `bridge:4:3` portent deux objets à la même coordonnée horizontale. Le moteur transmet au jeu l’identifiant de la surface atteinte et le camp du joueur. Le garde des ramassages vérifie le combattant actif, le camp, la surface et la fin du mouvement avant d’appliquer l’effet. [Raccord du moteur](../../../../src/game/tacticsVerticalRuntime.js) · [Garde de ramassage](../../../../src/game/engineTactics.js).

Chromium a lancé le pont depuis **Combat custom** en P2 local avec les objets activés. Avant correction, les deux camps consommaient leur objet pendant l’animation, alors que le rendu plaçait encore le pied sur la case précédente. L’injection d’un K.O. juste après la confirmation faisait aussi consommer l’objet. Après correction, les deux ramassages ont lieu sur leur étage à la fin du trajet et le cas K.O. reste à zéro objet consommé. Le test utilise l’API d’inspection pour choisir la case et de vrais événements clavier pour confirmer le déplacement. Un quatrième passage après la correction confirme aussi le ramassage avec le bouton du panneau de terrain. [Reçus navigateur](browser.json).

Les 28 tests des deux suites moteur passent. Ils vérifient aussi la pause en plein déplacement et le refus d’un objet associé au mauvais étage ou au mauvais camp. [Tests d’intégration](../../../../scripts/tacticsVerticalIntegration.test.mjs).
