# Final Fantasy : lot de 40 acteurs

Ce lot fixe les déclarations de source de 28 héros et 12 ennemis/bosses de Final Fantasy VII, VIII, XIII et XV. La sélection est figée dans [plan.json](plan.json), avant modification du code, sur le commit `5952da01c54a0dc8235ab4d0cea9463ba531443c`.

Les constats P1 de ces 40 acteurs passent de 192 à 51 : 40 incarnations explicites, 40 contrats visuels, 40 références et 21 libellés de techniques du catalogue brut sont renseignés. Les 112 profils de combat résolus existaient déjà et gardent leurs effets, portées, cibles et multiplicateurs. Le lot ajoute 40 tâches P2 `REFERENCE_SCENE_REVIEW`, soit 83→123 constats P2 : les références déclarées doivent encore être confrontées aux scènes et images effectivement utilisées. Aucun dossier acteur n’est clos.

Les éditions restent séparées : FFVII original 1997, FFVIII original 1999, FFXIII de 2009 et FFXV base 2016. Les variantes de remake, films, suites, tenues de collaboration et modèles postérieurs ne sont pas fusionnées avec ces déclarations. Les libellés historiques `Shinra Guard` et `PSICOM Soldier` ciblent explicitement les variantes MP original et PSICOM Warden ; cette sélection ne valide pas leurs images existantes.

Les armes incohérentes sont corrigées dans les vraies données : Aerith et Lunafreya utilisent un bâton, Quistis un fouet, Selphie un nunchaku. Le Zolom cesse d’être classé tireur par le résolveur tactique ; le MT Trooper reçoit le fusil de sa variante ciblée. La fiche G-Soldier décrit épée et magie : l’hypothèse initiale d’un fusil a été rejetée avant validation.

Les 21 kits de signature déjà actifs sont préservés. Dix-huit héros déclarent un marqueur exact qui permet leurs nouveaux libellés de catalogue tout en conservant le super existant et son partenaire. Zell conserve son objet spécial antérieur ; Zolom et Sweeper gardent leur absence de spécial brut pour laisser leur préparation existante fonctionner. L’ancienne API reste acceptée ; univers, incarnation, identité, marqueur incomplet/altéré et profils personnalisés sont testés en rejet.

Les dix tests comprennent les 112 profils avant et après préparation, les 21 kits, 18 comparaisons avant/après dans le vrai moteur mêlée, une invocation RPG Knights of the Round à 13 contacts/260 dégâts et consommation unique, les rôles tactiques et la transformation réelle des adaptateurs pour l’édition sans ces DLC. Les quatre modules privés sont déclarés dans les manifestes des packs ; ils n’ajoutent aucun chemin d’image ni chargement automatique. La régénération partagée de `DLC/index.js` est coordonnée par l’agent principal.

Les huit rasters manquants, travaux de tenues officielles/personnelles, recherches de collaborations et revues d’animation restent ouverts. Aucun sprite n’a été généré dans ce lot. `artApproved` et `source1to1Verified` restent faux ; chiffres, timings, géométrie et animation demeurent des adaptations du moteur.

## Preuves et reproduction

- [runtime-before.json](runtime-before.json) : capture immuable des40 données et profils avant édition.
- [baseline-actor-backlog.json](baseline-actor-backlog.json) : extrait immuable de l’ancienne file globale.
- [runtime-after.json](runtime-after.json) et [delta.json](delta.json) : capture courante, constats par acteur et empreintes des sources. Le `sourceCommit` des lignes identifie seulement la base initiale ; les SHA256 du delta identifient les fichiers après modification.
- [source-declarations.json](source-declarations.json) : les 40 déclarations et 18 correspondances de signatures.
- [references.json](references.json) : 32 URL acquises HTTP200, empreintes et extraits, avec limites des preuves. Une URL valide ne vaut pas approbation artistique.
- [test-receipt.json](test-receipt.json) et [tests.tap](tests.tap) : commande, périmètre et 10 tests réussis. La comparaison des moteurs fixe la source aléatoire pour comparer aussi les dégâts réellement appliqués.
- [Revue indépendante finale](../audit/ff-final-independent-review.json) : 141 retraits P1, 40 ajouts P2, 112 profils après préparation et 21 kits identiques, aucune perte de signature. Les rapports de diagnostic intermédiaires restent conservés séparément.
- [Compatibilité des tests historiques W14/W15](historical-catalog-editions-receipt.json) : 9/11 avant, 11/11 après. Quinze acteurs et leurs 60 actions ont des attentes historiques et courantes explicites ; les plans et les sources métier gelées restent inchangés.

Depuis la racine, avec Node 22 :

```sh
node --max-old-space-size=1024 --loader ./scripts/sourceSceneTestLoader.mjs --test scripts/ffActorSourceContracts20261113.test.mjs
node --max-old-space-size=1024 --loader ./scripts/sourceSceneTestLoader.mjs scripts/ffActorSourceDelta20261113.mjs
```

Le second script réécrit uniquement les deux rapports après/delta de ce lot ; il conserve la sélection et les captures avant. L’audit global indépendant et les autres lots sont gérés séparément.
