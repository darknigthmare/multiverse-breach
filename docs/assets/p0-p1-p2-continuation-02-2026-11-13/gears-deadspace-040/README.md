# Gears of War / Dead Space — lot de 40 acteurs

Le lot conserve exactement les 22 acteurs Gears et 18 acteurs Dead Space réservés sur `98991b161d0116dd9fa8d52d42f2337a243f2091`. Les contrats individuels précisent leurs éditions, modèles et équipements. Les 14 héros disposant déjà d’actions effectives projettent ces mêmes objets dans le catalogue brut ; les dégâts, soutiens, cibles, timings, ressources et sauvegardes restent ceux du moteur existant.

Les constats P1 passent de **177 à 55** : 38 incarnations, 38 contrats visuels, 38 références et huit libellés génériques du catalogue sont renseignés. Ces huit libellés avaient déjà leurs techniques résolues avant ce lot. Les 38 nouvelles références ajoutent une revue de scène P2, soit **82 à 120** constats P2. Aucun dossier acteur n’est clos, aucun raster n’est généré et aucune approbation artistique n’est accordée. Les onze rasters manquants restent ouverts.

Les personnages gardent leurs versions propres : Gears 2 pour Marcus/Dom/Cole/Baird/Hoffman, Gears 3 pour Anya et Clayton Carmine, Gears 5 pour Kait ; Dead Space 2008 pour Isaac, Nicole vivante, Hammond et Kendra, Dead Space 2 pour Ellie et Dead Space 3 pour Carver. Les modèles de remake, hallucinations et variantes de Berserker/Matriarch, Corpser ou Brumak ne sont pas fusionnés. Les scènes, anatomies et images restent à confronter aux références détaillées avant validation visuelle.

Les corrections de données portent aussi sur les incohérences explicites : l’Exploder a un sac explosif, le boss Infector Pod perd sa mention de T-Virus provenant d’une autre franchise, Karn est documenté avec Shibboleth et le Brumak cible une forme armée antérieure à sa mutation Lambent. Le Pod conserve ses trois manques de source : son organisme canonique, sa forme et son incarnation ne sont pas inventés. Le doublon historique `hammond_ds` garde son ID et ses anciennes mécaniques, avec une revue d’actions encore ouverte. Les comportements complets de montage, conversion des corps ou séparation des membres ne sont pas implémentés par une déclaration descriptive.

Le Pulse Rifle de Zach Hammond est correctement nommé **SWS Motorized Pulse Rifle**. Les deux libellés `weapon` et `pose` de sa source W15 sont corrigés ; l’ancien texte erroné « 211-V » reste intact dans les plans historiques. Des fixtures exactes avant/après permettent la comparaison historique de la seule provenance dérivée, sans modifier actions, nombres, plans, prompts ni images. Cette correction ne revalide aucun ancien pixel.

**20 tests passent** : neuf tests dédiés et les onze tests historiques W14/W15. Les vrais moteurs comparent les 60 actions RPG et les 15 supers mêlée avant/après, y compris les ressources consommées une fois et le nettoyage. Les 60 profils de héros et leurs préparations restent identiques ; les emplacements de combat non définis des ennemis restent non définis. Les IDs, stats, bindings de sprites et d’animations sont conservés. Le combat RAAM conserve son incarnation de 2006 et la protection Kryll native.

La compatibilité du consumer Extinction avec les types canoniques `projectile` et `guard` est suivie séparément par `menus_logistics`. La projection brute ne prétend pas remplacer ses règles de chargeur ou de défense.

- [Réservation](reserved-actors.json) et [plan](plan.json)
- [Contrats individuels](source-contracts.json) et [références / limites](references.json)
- [Delta exact et empreintes](delta.json)
- [Reçu de validation](test-receipt.json) et [TAP final](tests.tap)
- Captures compactes : [avant](baseline-runtime.json.gz) et [après](runtime-after.json.gz), environ 23 et 31 Ko.

Depuis la racine, avec Node 22 :

```sh
node --max-old-space-size=2048 --loader ./scripts/sourceSceneTestLoader.mjs --test --test-concurrency=1 scripts/gearsDeadSpaceSourceContracts20261113.test.mjs scripts/combatFidelityWave14.test.mjs scripts/combatFidelityWave15.test.mjs
node --max-old-space-size=2048 --loader ./scripts/sourceSceneTestLoader.mjs scripts/gearsDeadSpaceSourceDelta20261113.mjs
```

Le second script conserve la réservation et la capture avant ; il réécrit uniquement les rapports après/delta de ce lot. Les deux nouveaux modules privés sont inscrits dans leurs manifestes DLC. La régénération de l’index global et les contrôles de publication restent gérés par l’agent principal.
