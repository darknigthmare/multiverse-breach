# Kits fidèles aux sources : résolution des attaques Smash

La revue finale a identifié un écart entre les six kits corrigés et leurs actions
réelles : Smash transformait toutes les attaques secondaires en rayon, tous les
spéciaux en explosion globale, et même le DL-44 de Han en attaque de proximité.

Les profils de `src/game/smashAbilityProfiles.js` corrigent les attaques simples,
secondaires et spéciales de Han, Luke, Vader, Bob, Kevin et Stuart. Le moteur
applique aussi ces profils aux impacts différés des commandes Mêlée clavier,
manette et tactiles, ainsi qu'aux adversaires héros contrôlés par le joueur 2.

- Le DL-44 de Han atteint un adversaire devant lui à distance. Sa salve sélectionne
  au maximum trois adversaires proches à portée ; son trait de blaster reste rouge.
- Les attaques au sabre de Luke et Vader restent au contact. La télékinésie utilise
  un effet ciblé sans rayon électrique ; l'étranglement de Vader atteint un seul
  adversaire, sans explosion globale ni projection horizontale explosive.
- Les bousculades de Bob et Kevin restent au contact et ciblent un adversaire.
  Leurs lancers utilisent la présentation commune de banane.
- La guitare de Stuart emploie des notes musicales ; son spécial de zone reste
  limité à son voisinage, au lieu de toucher tout le terrain.

Les portées de 70 pixels au contact, 300 à distance et 160 pour le spécial musical,
les dégâts, délais, jauges et effets comiques sont des adaptations de jeu. Ces
chiffres ne sont pas présentés comme des mesures ou techniques officielles des
films. Les sprites et chorégraphies existants restent à revoir : ce correctif ne
certifie pas leur fidélité visuelle 1:1. Les références des six incarnations restent
dans `canon-star-wars-minions-2026-10-01.md`.

Les autres héros gardent leurs règles historiques jusqu'à une déclaration explicite
de profil Smash (`action.smashProfile` ou `actor.smashAttacks`). Les impacts passent
toujours par le calcul réel des dégâts, boucliers, buffs et états du moteur. Les
actions Mêlée conservent leurs coûts de jauge et multiplicateurs existants.

Validation : **13 nouveaux tests moteur réussis** dans
`scripts/smashCanonAbilityProfiles.test.mjs`, puis **97/97 tests** dans la vérification
élargie des profils, buffs/états, commandes Mêlée, combats personnalisés et objectifs
Smash. Le lint ciblé et `git diff --check` passent. Les tests contrôlent les PV des
cibles effectives, la portée/direction, les limites de cibles, les effets produits,
le coût du spécial Mêlée, le joueur 2, les cooldowns et l'application des buffs.
Un test diagonal vérifie le rayon musical réel ; un autre empêche les indications
génériques RPG/Tactics d'écraser les distances et formes déclarées pour Smash.
