# Extinction & Cité — catalogue de production, 26 octobre 2026

Ce **second classeur** complète, sans le remplacer, `docs/excel/Multiverse_Breach_UI_Immersion.xlsx`.

Fichier : `docs/excel/Multiverse_Breach_Extinction_Cite_Production.xlsx`.

## Périmètre exact

Les données sont résolues depuis les modules du dépôt à partir de `80a54ea5bf203b7991c213775bd3c7ec4d8b3fba`, puis enrichies de **propositions explicitement étiquetées** pour la production FPS et Cité. Les sources projet et les références externes héritées restent distinctes. Ces références externes n’ont pas été revalidées lors de cet export.

- **525 univers** ; **1 912 personnages**, dont l’Ancre créée à la volée.
- **1 811 combattants** potentiellement sélectionnables selon la possession ; **101 identités non combattantes** préservées pour les épreuves et la Cité.
- **1 518 entrées ennemies** ; **1 507 occurrences de boss**, boss mondiaux et boss final inclus. Une occurrence n’est pas nécessairement une identité distincte entre plusieurs opus.
- **129 politiques de finale** conservées, notamment les finales pacifiques et les scènes qui ne doivent pas être transformées en monstres.
- **7 244 actions sources**, regroupées en quatre colonnes par personnage ; **4 494 déclinaisons d’effets** (projectiles, rayons, traces, ondes ou invocations), pas 4 494 balles.
- **2 100 zones** du gabarit de Cité ; **2 100 variantes de mode/univers** ; **3 162 lignes de props et reliques à adapter**. Ces chiffres ne sont pas des cartes ou modèles nouvellement réalisés.

Le fichier contient **21 feuilles, 20 tableaux filtrables et 17 720 lignes de catalogue**, plus le tableau de bord et le guide. Les formules synthétisent les tables ; les statuts séparent présence d’un fichier, raccordement partiel, adaptation et production manquante.

## Organisation du classeur

`Synthese` et `Mode_emploi` expliquent la lecture et les limites. `Univers` constitue l’index complet.

**Extinction :** `Heros_Extinction`, `Armes_mains_FPS`, `Actions_FPS`, `Projectiles_FPS`, `Assets_FPS`, `Ennemis_FPS`, `Boss_FPS`, `Finales_et_politiques`, `Modes_par_univers`, `Runtime_Extinction`.

**Cité :** `Cite_personnages`, `Cite_zones`, `Cite_props`, `Kits_environnement`, `Cite_noyau`.

**Transversal :** `Contrats_animation`, `Recette_et_ouverts`, `Sources`.

Pour les mains et armes, le suivi précise incarnation, morphologie/tenue renseignée, outil source, calques, cadrage, repos, mouvement, dégainé, attaques, recharge adaptée, défense, spécial, dégâts et interaction. Pour les effets, il sépare émission, trajet/profondeur, impact, expiration, collision et limites du moteur. Pour la Cité, il conserve les habitants, leurs sprites et les besoins de marche/dialogue/activité, puis les sols, murs, seuils, toits, occlusion, mobilier, éclairage et portails.

## Corrections de jeu incluses dans cette continuation

1. **Fin de la limite arbitraire de 40 héros dans Extinction.** La liste contient tous les combattants possédés, sans déverrouiller d’identité et sans transformer les personnages pacifiques en cibles ou tireurs. Aucun repli vers un personnage non possédé quand la liste est vide.
2. **Identité des vues FPS.** Les planches disponibles de Mirelle, Arthur et Serj sont liées à leur propriétaire exact. Les sprites universels/de corps entier ne sont pas assimilés à des mains. Les tenues non raccordées et les armes ramassées restent sur un schéma neutre clairement indiqué, pas sur les cartes de Mirelle.
3. **Animations déclarées.** Les lignes du manifeste sont utilisées ; la recharge de Mirelle conserve son découpage. Aucune ligne de recharge n’est inventée pour les autres planches. Cela ne certifie pas encore leur fidélité artistique ni leur adéquation à chaque mécanique de rôle.
4. **Ambiances de Cité en anglais.** Les douze profils nommés et leurs familles gardent les mêmes types de quartier mais reçoivent des descriptions anglaises. Aucun changement des collisions, récompenses ou coordonnées.

La planche historique `bucket_guitar_echo` (Buckhead) reste inventoriée mais n’est **pas** réaffectée à `buckethead_avatar` (Buckethead). Les identifiants ne sont pas interchangeables.

## Reproduction et vérifications

```sh
node --no-warnings --loader ./scripts/sourceSceneTestLoader.mjs scripts/extinction-city/catalog.mjs 80a54ea5bf203b7991c213775bd3c7ec4d8b3fba /tmp/ec-catalog.json
node --test scripts/extinctionContent.test.mjs scripts/mosaicUniversePlaces.test.mjs scripts/scenePresentation.test.mjs scripts/sceneInputs.test.mjs scripts/extinctionTiming.test.mjs scripts/mosaicCityRuntime.test.mjs scripts/immersiveHubState.test.mjs
node --no-warnings --loader ./scripts/sourceSceneTestLoader.mjs --test scripts/extinctionCityCatalog.test.mjs
python scripts/extinction-city/build_workbook.py /tmp/ec-catalog.json /tmp/Multiverse_Breach_Extinction_Cite_Production.xlsx
python scripts/extinction-city/verify_workbook.py /tmp/ec-catalog.json docs/excel/Multiverse_Breach_Extinction_Cite_Production.xlsx
```

La création du classeur emploie **artifact_tool**. Le validateur est en lecture seule : il compare les cellules aux tables sources, les formules, les feuilles et les structures ZIP/XML. Les écritures dans les tables ne sont jamais obtenues par une extraction OCR.

Résultats locaux à la préparation : **101/101 tests ciblés**, **6/6 contrats de catalogue**, **68/68 tests UI**, analyse des huit modules/tests sans erreur ni avertissement, compilation Vite source réussie. Ces suites se recoupent ; ne pas les additionner comme tests uniques. Le navigateur local étant bloqué par l’environnement, les parcours interactifs sont exécutés séparément dans GitHub Actions, avec leur résultat dans le reçu de validation. Le workflow permanent est `extinction-content.yml`.

## Reste à produire ou à vérifier

Les milliers de vues mains/armes, effets, ennemis, boss et décors spécifiques ne sont **pas** créés par ce classeur. Le moteur Extinction conserve ses six archétypes génériques et ses capacités de rôle : les quatre actions personnelles du catalogue restent des adaptations à réaliser. Les points faibles, phases, tenues ou anatomies absents des sources doivent être documentés avant dessin.

Restent également la recette consolidée des 40 écrans, le montage réel de toutes les destinations de Cité, l’exploration complète des quartiers, les autres combinaisons d’armes/héros, les parties humaines, les périphériques physiques, le compte cloud réel et l’avertissement de taille de bundle. La PR reste en brouillon ; aucune fusion ni promotion en production.
