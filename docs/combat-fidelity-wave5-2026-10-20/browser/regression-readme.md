# Parcours RPG et Combat — 20 octobre 2026

Harness Chromium exécuté dans les vrais composants React, avec les modules moteur effectivement importés par Vite. Le parcours RPG utilise le bouton Invocation, annule sans coût, puis confirme au clavier U. Les 16 cellules Ifrit sont observées dans de vrais appels canvas, avec la pose de contact à impactTick. La pause conserve le tick ; un seul changement de PV se produit. La seconde invocation est refusée.

Le parcours Combat traverse introduction, première manche et résultat intermédiaire, deuxième manche, finale, victoire et sortie avec un seul résultat final. Les captures et le JSON conservent les données observées. Les PV et charges du scénario sont préparés par le harness pour rendre ces parcours déterministes ; aucune API distante ne participe à la boucle de combat.

- [Résultats détaillés](regression-result.json)
- [Ifrit au contact natif](regression-rpg-ifrit.png)
- [Première manche](regression-fighter-round-one.png)
- [Finale](regression-fighter-finisher.png)

Aucune erreur JavaScript. La fidélité visuelle source 1:1 reste non certifiée.
