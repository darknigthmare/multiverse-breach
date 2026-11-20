# Commandes de Jack, Lilo et Roger en Duel

Les commandes légères et secondaires de Jack Sparrow 2003, Lilo Pelekai 2002 et Roger Rabbit 1988 utilisent les actions du catalogue de leur incarnation. Le moteur conserve leur identité, leurs accessoires, leur portée et le délai avant l’impact. [Adaptation Duel](../../../../src/game/combat/historicalIconicP0FighterActions.js)

- **Jack** tire sa balle réservée avec une attaque lourde ou spéciale. Le départ du projectile consomme la balle et déclenche la fumée. Une interruption pendant la préparation conserve la balle. Une balle tirée peut manquer. Les changements de combattant et de manche conservent la réserve. Un nouveau duel la recharge. Le HUD de chaque camp indique la balle restante.
- **Lilo** déclenche son flash à la fin de la préparation. Le moteur vérifie la portée et la direction au même moment. Le flash se voit près de l’appareil et sur l’adversaire atteint.
- **Roger** déclenche sa feinte et son impact au contact. Une action hors de portée laisse les PV adverses intacts.

Six scénarios de régression échouent avec l’ancien moteur. Les sept tests du lot passent avec la correction, y compris les états de pause, de changement d’acteur, de changement de manche et de nouveau duel. Quatre sessions Chromium ont actionné les commandes réelles du Duel au clavier à 1 280 × 900 et au tactile à 390 × 844. La balle de Jack a été dessinée en vol et le compteur est passé de 1/1 à 0/1 dans les deux camps. [Reçu](verification.json) · [Compteur après le tir](silex.jpg)

Les trois planches conservent leur statut de revue artistique ouverte.
