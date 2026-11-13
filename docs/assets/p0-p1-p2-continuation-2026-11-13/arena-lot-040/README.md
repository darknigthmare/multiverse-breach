# Lot arènes : 40 acteurs, Unreal et Quake

La sélection est figée dans `reservation-040.json` avant modification : dix acteurs par univers pour Unreal, Unreal Tournament, Unreal Tournament 2004 et Quake. Les identités, statistiques, récompenses et chemins de sprites restent conservés.

## Correctifs

- **39 déclarations individuelles** précisent l’édition, le modèle ou avatar et, lorsque l’acteur dépend d’une rencontre, sa scène. Les trois adversaires Final Challenge d’UT99 choisissent le portage PlayStation 2 de 2000 et leurs cartes exactes ; ils ne sont pas présentés comme des adversaires du ladder PC. Les avatars Gina, Dante et Kurgan restent trois apparences du même Prisoner 849, sans pouvoirs propres inventés.
- **UT2004, catalogue** : Gorge, Sapphire et Frostbite exposent les douze actions déjà résolues par leurs kits authored W15, dont leurs tirs Flak, orbes Shock et roquettes. Les noms, types, multiplicateurs et paramètres copiés correspondent aux actions réellement utilisées. Ces kits existaient avant ce lot ; leur projection sur les fiches ne constitue pas douze nouvelles techniques. Le Skaarj, le Gen MoKai, Damarus, ClanLord, Xan et Malcolm déclarent aussi des armes communes plutôt que des attaques raciales ou surcharges personnelles.
- **RPG, ciblage des ennemis** : cinq noms littéraux d’armes (Link Gun, Shock Rifle, Flak Cannon, Rocket Launcher, Lightning Gun) étaient classés comme mêlée par le repli de ciblage, qui ne reconnaissait que des jetons minuscules. Ils conservent désormais une portée et une livraison à distance. Les sept adversaires UT2004 sont contrôlés ; une vraie morsure reste de contact et une action de soutien reste destinée à un allié. Cette correction ne simule pas un système complet de ramassage, de munitions ou de combos UT2004.
- **Sapphire** appartient aux Mercenaries ; son contrat ne la décrit plus comme une Juggernaut ou comme l’incarnation Ice Burst d’Unreal Championship 2. Le contrat de Malcolm demande le visage du personnage de jeu, sans substituer un visage original.
- **Gladiator** : l’acteur et sa signature préparée choisissent tous deux **Quake II (1997)**. La mention fusionnée « Quake II and Quake 4 » est retirée ; les incarnations et mécaniques des autres acteurs Quake restent séparées.
- **Adaptateur des packs** : une liste fermée conserve `incarnation` et `referenceUrl` déjà déclarés sur un acteur. Elle ne propage pas les champs arbitraires, les identités de remplacement ou un drapeau d’approbation artistique. Les déclarations d’UT2004 atteignent ainsi effectivement le catalogue final.

## Dossier laissé ouvert

Le slot historique **Necris Combatant** ne reçoit pas d’incarnation approuvée. La page du jeu distingue le roster initial de deux ajouts Necris du bonus ECE ; les pages supplémentaires tentées n’ont pas permis de fixer le modèle individuel. Le slot et ses données historiques sont conservés et ses constats restent ouverts. Il n’est ni renommé vers une autre espèce ni déclaré validé pour fermer le compteur.

## Sources et portée

`source-access.json` conserve les URL, statuts HTTP, tailles, SHA-256 et extraits effectivement retrouvés. Les sources comprennent le manuel Unreal, les listes de joueurs et équipes des archives Liandri, la séquence console Final Challenge et le code officiel id Software du Gladiator/Makron de Quake II. Les pages inaccessibles restent indiquées comme telles. Les extraits établissent leurs énoncés précis ; un mot absent de la source n’est pas traité comme confirmé.

Les contrats existants de chaque pack fournissent aussi leurs références et leur direction visuelle. Préciser une déclaration d’édition dans les données ne prouve pas les pixels, les poses ou les tenues déjà dessinés. Les rasters non livrés, les revues d’animation, costumes et références non terminées restent ouverts. Aucun dessin n’est produit par ce lot et aucune fidélité artistique globale 1:1 n’est déclarée.

## Vérification

Les preuves comparables au code final sont [`audit/arena-tests-before-final.tap`](../audit/arena-tests-before-final.tap) et [`audit/arena-tests-after-final.tap`](../audit/arena-tests-after-final.tap), exécutées dans les snapshots sources isolés. `tests-before.tap` conserve la première version des quatre régressions ; elle précède le réalignement des libellés du catalogue sur les kits existants. Une première sonde à fixture incomplète reste séparée dans `tests-probe-incomplete-fixture.tap` et ne sert pas de preuve du défaut produit.

Le passage final de **80/80 tests** réussit avec Node 22, heap de 2 Gio et concurrence 1 : contrat des 40 acteurs, provenance de l’adaptateur, cohérence catalogue/résolveurs, portée des armes ennemies UT2004, Gladiator, catalogue et expansions, identités et gardes du backlog. Le résultat est dans `targeted-suites.tap`. La revue visuelle de tous les personnages et une distribution complète construite ne sont pas déduites de ces tests.

```sh
node --max-old-space-size=2048 --test --test-concurrency=1 \
  scripts/arenaSourceContracts20261113.test.mjs \
  scripts/canonRosterWave.test.mjs scripts/canonRosterWaveExpansion.test.mjs \
  scripts/canonRosterNewBatch.test.mjs scripts/actorFidelityR9.test.mjs
```
