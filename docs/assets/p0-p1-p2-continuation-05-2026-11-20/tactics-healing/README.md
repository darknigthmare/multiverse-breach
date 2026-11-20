# Tactics — plafond des soins sous irradiation

Sur un plateau à étages, les soins ordinaires suivent la règle partagée du jeu. Une unité irradiée récupère des PV jusqu’à la moitié de son maximum. Une unité déjà au-dessus de ce plafond conserve ses PV. L’indication au-dessus du destinataire montre le gain réel arrondi. [Application dans le moteur](../../../../src/game/tacticsVerticalRuntime.js) · [Règle commune des soins](../../../../src/game/combatHealing.js).

La reproduction utilise le kit existant d’Aerith et le pont du Nexus, avec un destinataire irradié sur le tablier et un autre en dessous à la même coordonnée. Avant le correctif, le moteur pouvait dépasser le montant annoncé par l’aperçu. Le correctif réutilise le calcul de récupération partagé pour l’application. Il conserve le ratio de soin de l’action et la sélection des surfaces. [Régression moteur](../../../../scripts/tacticsVerticalEffects.test.mjs).

Dans Chromium, une alliée à 70/176 PV reçoit 18 PV selon l’aperçu. L’ancien moteur la portait à 102 PV et le moteur corrigé la soigne jusqu’à 88 PV. Les deux essais utilisent le vrai bouton **Healing Wind** puis Entrée. Le scénario prépare les positions et l’irradiation à l’avance. La cible sous le tablier reste à 75 PV, la sélection refusée ne dépense pas le soin et l’irradiation de la cible soignée persiste. Aucun incident JavaScript n’a été relevé. [Reçus Chromium](verification.json).

Les 38 tests des suites de soutien vertical et de soins de Val passent. Le test ajouté vérifie aussi qu’une unité au-dessus du plafond garde ses PV, que le refus ne prend aucun temps de recharge et que le gain affiché apparaît sur le bon étage.
