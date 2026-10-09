# Scarab de Metropolis — mécanique d’abordage

Le stage historique **2** utilise désormais un véritable objectif d’abordage et de neutralisation de l’équipage. La coque du **Scarab Protos de Halo 2 (2004)** reste intacte : retirer ses 1 300 HP ne constitue plus la condition de victoire.

## Références consultées le 1er octobre 2026

- [Halopedia — Metropolis](https://www.halopedia.org/Metropolis) : accès depuis les passerelles des bâtiments, abordage puis élimination des Covenant qui pilotent le véhicule. Le tir du Scorpion contre la coque n’a aucun effet dans la séquence originale.
- [Halopedia — Protos-pattern Scarab](https://www.halopedia.org/Protos-pattern_Scarab), section Gameplay : coque immunisée aux dégâts, déplacement scripté, destruction montrée en cinématique. Le mécanisme de cœur arrière des autres jeux ne s’applique pas au combat de Metropolis.

## Comportement livré

- La case **BOARD** relie la passerelle au pont du véhicule. Une action normale de déplacement du joueur suffit à enregistrer l’abordage. Cette étape ne se répète pas lorsque le personnage quitte la case.
- Les acteurs déjà présents **Covenant Grunt** et **Elite Minor** composent l’équipage de cette adaptation. Le **Jackal Sniper** défend l’approche urbaine et reste distinct de l’équipage ; son élimination n’est pas requise après l’abordage.
- La victoire demande l’abordage **et** la neutralisation de tous les membres de cet équipage. Tirer sur l’équipage depuis l’extérieur est possible, mais ne dispense pas de rejoindre le véhicule.
- Le Scarab conserve son rôle de menace et ses statistiques originales. Sa coque résiste aux attaques, événements, dégâts d’objets transmis au moteur, dégâts périodiques et dangers de terrain. Elle reste immobile et ne subit pas le recul d’un personnage.
- Le moteur affiche **COQUE IMMUNE** à la place de sa barre de vie, puis **CREW** sur les membres encore vivants. La consigne et le bilan de combat indiquent l’abordage et l’équipage neutralisé.
- L’autobattle rejoint la passerelle puis attaque l’équipage. Le stage **12 / Metal Gear REX**, les autres objectifs et les combats personnalisés conservent leur fonctionnement.

## Limites de fidélité

La condition de victoire correspond maintenant à la séquence de *Halo 2*. La grille, l’effectif de deux acteurs, l’accès à une seule case et la géométrie du pont restent des adaptations de Multiverse. Le déplacement scripté du Scarab dans New Mombasa, la cabine complète, les tourelles détachables et la cinématique finale ne sont pas reproduits. Aucun cœur arrière destructible de *Halo 3* n’a été ajouté. Le bitmap historique du Scarab n’a pas été remplacé ni certifié 1:1 par ce changement.

Les IDs de stage, personnages et adversaires, les récompenses, statistiques de base et routes de sprites restent stables. Les marqueurs d’équipage et l’état d’abordage vivent uniquement dans l’instance de combat.

## Vérification

**17 tests du véritable moteur Tactics réussissent** : entrée joueur, marqueurs de canvas, ordre d’objectifs, dégâts bloqués, dangers et infection, API pour les objets externes, AI complète, victoire avec coque et sniper vivants, défaite, redémarrage, exclusion des parties personnalisées et maintien du combat REX. Un cas reproductible vérifie aussi l’abordage et la neutralisation de l’équipage par l’AI avec les statistiques originales de Master Chief, sans augmentation de vie ou d’attaque. Les tests de régression des autres objectifs et escortes réussissent également. Le lint ciblé et le contrôle des espaces du diff passent.

L’API `applyEncounterDamage(target, amount, context)` renvoie `true` lorsqu’elle traite la coque protégée et `false` pour les autres cibles. Les appels externes doivent respecter ce résultat avant de modifier directement les HP.
