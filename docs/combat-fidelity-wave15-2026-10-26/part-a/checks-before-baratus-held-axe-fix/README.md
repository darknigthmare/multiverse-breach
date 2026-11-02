# W15 — Lot A de 40 personnages

Les quarante identités du [plan global figé](../batch-plan-before.json) sont livrées dans ce lot autonome : **40 présentations de 32 poses et 40 bases de 16 poses, soit 1 920 dessins retenus dans 80 nouveaux PNG**. La sélection couvre quatorze univers. Les 24 nouveaux kits et 16 révisions comportent 160 emplacements nommés ; la composition centrale les distingue sans modifier les fiches historiques.

Le [plan de source](source-plan.json), fixé avant les générations et les modules de production, précise pour chaque personnage l’œuvre, la période, la tenue, l’équipement, le geste et la stature choisie. Son SHA-256 est `f6cc9213b714927b2f4c234cdbecffb502801893e20b68106c29b6185e0d615d`. Les références historiques sont archivées sous `references/`, avec leurs empreintes initiales ; elles servent à la comparaison et ne certifient pas le costume retenu.

## Versions et actions

Ranger utilise sa hache de départ de *Quake* (1996), sans Dire Orb ni costume de *Champions*. Bitterman conserve son blaster de *Quake II* (1997), Kane son équipement de *Quake 4* (2005). Les compétiteurs d’*Unreal Tournament* utilisent l’Enforcer partagé de 1999, qui ne devient pas un pouvoir personnel. Gina, Dante et Kurgan sont trois apparences sélectionnables du même Prisoner 849 : leur relais est explicitement une fiction de gameplay multijoueur, pas une alliance canonique entre trois protagonistes distincts.

Les trois profils Crysis conservent le Nanosuit de première génération ; Psycho correspond à *Warhead* (2008), sans son costume ultérieur de *Crysis 3*. Fisher, Grim et Briggs sont ceux de *Blacklist* (2013). L’officier de *Marathon* reprend un choix de palette de joueur de 1994 ; Blake et le défenseur S’pht’Kr restent ceux de *Marathon 2* (1995), sans équipement moderne de Runner. Les équipements partagés et les apparences de joueur choisies sont déclarés comme tels.

Les supers comprennent **32 projectiles, deux coupes au contact et six soutiens sans dégâts**. Hawkins, Gladstone, Jin, Grim, Diana et Hackett utilisent leurs instruments ou communications, sans arme offensive inventée. Les partenaires RPG sont du même univers et d’un autre identifiant ; ces relais restent des adaptations de gameplay, sans certification d’alliance narrative ou d’invocation officielle. Les renforts RPG natifs supplémentaires sont suivis séparément par l’intégration centrale.

## Dessins et corrections

Les [52 appels image_gen](generation-inventory.json) conservent leurs arguments effectifs, prompts, reçus et PNG originaux. Sur **2 168 figures observées, 1 920 sont sélectionnées et 248 explicitement exclues**. Aucun refus ni personnage manquant n’est déclaré dans ce lot. Les sélections et les frontières d’import figurent dans les [enregistrements](generation-records.json) ; les [exclusions](source-exclusions.json) ne comptent jamais comme dessins livrés.

Gina, Malcom et Daedolon avaient chacun une séquence à trois dessins au lieu de quatre. Des générations correctives ont complété ces séquences ; celles de Gina ont aussi conservé l’énergie bleue du Dispersion Pistol. Un essai de correction de Gina comportait des silhouettes coupées : il est entièrement exclu. Huit poses de base de Grim ont été remplacées pour conserver les pieds et le corps entiers. Huit poses de Max placent le relâchement de ses pistolets sur la troisième position, avec une préparation sans flash. La revue indépendante a ensuite détecté des jets bleus avant ou après le relâchement de Dante et Kurgan ; douze nouvelles poses d’action de chacun remplacent ces dessins, sans jet en préparation ou récupération.

Neuf séquences ont une permutation documentée de deux dessins source intacts pour synchroniser leur relâchement avec la troisième cellule native. La revue indépendante a détecté une permutation inutile de Grey qui avançait son flash : elle a été retirée et l’ancienne grille reste archivée dans `anchor-review/before-grey-timing-fix/`. Aucune permutation, capture, image miroir ou image de contrôle ne crée une pose supplémentaire.

L’aperçu de Bitterman paraissait présenter un fond brun. La mesure RGBA a ensuite montré de l’alpha nul dans les gouttières malgré un RGB caché brun. Une requête corrective d’alpha avait déjà été lancée ; les deux sources restent conservées et une seule sélection de 48 figures compte dans la livraison. Aucun fond ni canal alpha n’a été repeint par code.

## Import et vérification

Les frontières traversent uniquement les espaces transparents mesurés ; elles préservent les valeurs RGBA retenues avant un unique redimensionnement au plus proche voisin. Chaque source garde une échelle uniforme, une ancre de pied ou de corps natif et des marges transparentes de dix pixels. Les poses accroupies restent naturellement plus courtes. Le `rowRenderScale` restaure la stature en jeu lorsque la portée d’une arme impose une réduction du dessin dans sa cellule.

La [vérification technique](verification.json) contrôle les 1 920 cellules RGBA distinctes, les 48 sélections source uniques de chaque personnage, les marges, les originaux et reçus, ainsi que la préservation exacte des **730 PNG et 118 registres antérieurs**. Les [vingt contacts finaux](final-contact-review.json) ont réellement été inspectés ; ils présentent les 40 personnages et leurs 48 positions respectives.

Les [précisions de QA](source-qa-notes.json) conservent aussi la couleur jaune-verte réellement retenue pour l’émetteur S’pht’Kr et la correction de la première description bleu-blanc, sans certification de couleur officielle.

Les [256 points d’émission](native-muzzle-review.json) concernent les 32 personnages à projectile, pour quatre cellules de super et quatre de présentation finale. Chaque point est relié au PNG et au pixel RGBA effectif ; les grilles marquées sont des contrôles de mesure, jamais des sprites publiés. La revue indépendante et les parcours réels des moteurs sont suivis dans leurs preuves dédiées.

```bash
node scripts/buildCombatCharacterAnimationsWave15PartA.mjs --check
node scripts/buildCombatCharacterSpriteCorrectionsWave15PartA.mjs --check
node docs/combat-fidelity-wave15-2026-10-26/part-a/verify-artwork.mjs --check
```

Les versions sont documentées mais les dessins générés, les gestes, les nombres de gameplay et leurs timings restent des adaptations. Les URL déclarées ne constituent pas une vérification réseau ni une certification officielle 1:1. Les états Mêlée complets45 et les timings de toutes les actions de base restent des suivis distincts de la présente couverture32/base16 ; ce lot ne les déclare pas tous terminés.
