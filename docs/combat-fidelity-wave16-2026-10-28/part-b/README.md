# Groupe B — livraison W16 du 28 octobre 2026

Le groupe livre **40 personnages, 80 PNG et 1 920 poses** : 32 poses de présentation et 16 poses de base distinctes par personnage. Les kits et définitions de source conservent aussi la révision de John Wick, soit 41 identités relues, mais aucune image de John n’est livrée. Tank le remplace dans la sélection artistique après un amendement écrit avant sa génération.

| Élément | Quantité vérifiée |
|---|---:|
| Atlas natifs, 1 024 × 2 048, huit phases × quatre poses | 40 / 1 280 poses |
| Atlas de base, 1 024 × 1 024, quatre états × quatre poses | 40 / 640 poses |
| Images source réellement générées et conservées | 62 |
| Dessins complets observés dans ces sources | 2 223 |
| Dessins complets exclus de la livraison | 303 |
| Candidats incomplets exclus, deux arcs sans Rambo | 2 |
| Dessins distincts retenus | 1 920 |
| Ancres de projectiles et faisceau, 14 personnages × huit poses | 112 |
| Ancres supplémentaires du pistolet humain d’Aya, fatality seulement | 4 |
| Nouveaux emplacements de capacité générique remplis | 0 |

Les 40 kits existaient déjà avant cette vague. Cette livraison précise leur version, leurs quatre actions et leur représentation ; elle ne transforme pas des révisions en nouveaux remplissages. Le [tableau des révisions](revision-table.md) et son [relevé avant/après](revision-table.json) détaillent les 40 identités effectives et le cas John Wick.

## Versions et adaptations explicites

Le [plan initial](source-plan.json) a été figé avant la première demande d’image et garde le SHA `6d0fe59c593479d64b12bd1310c136a46d7c0d0d932003767b81161ebdb3cfdd`. La [sélection originale commune](../batch-plan-before.json), l’[amendement de sélection](../batch-amendments-before-generation.json) et le [complément Tank](source-plan-tank-addendum.json) restent séparés. Les précisions ultérieures sur les accessoires de Dead Rising et les chaussures de Rocky sont conservées dans des fichiers additionnels, sans réécrire le plan initial.

- BT-7274 est le Vanguard Expedition de Titanfall 2 (2016), portant son XO16A2 avec ses deux bras. La stature moteur cible 570 contre 190 pour Cooper. Le guide consulté décrit environ sept secondes de Burst Core ; les 14 tirs et les 7,4 secondes totales sont un échantillonnage moteur déclaré. La pose d’anticipation reste sans flash entre les vraies émissions.
- Aya utilise la version Parasite Eve (1998). Liberate transforme réellement son corps, produit sept contacts, puis revient à Aya humaine avec étourdissement moteur adapté. Les quatre dessins de cette séquence ne sont pas présentés comme sept frames officielles. Les autres poses conservent Aya humaine et son pistolet ; Heal et Barrier gardent leur rôle de soutien.
- Senua conserve la version du début de Hellblade (2017), l’épée initiale à pommeau annulaire, son miroir La Tène et son sac fermé. La concentration du miroir reste un soutien personnel sans dégâts. Son manifeste Mêlée de 180 poses est un livrable distinct, produit par l’agent chargé de ce manifeste ; aucune des 48 poses de ce groupe n’y est réutilisée.
- Tenenbaum, Jenny, Powell, Maeda, Sarah, Tank et les autres rôles de soutien gardent des gestes et instruments de leur rôle. Aucun plasmide offensif n’est donné à Tenenbaum et aucune arme n’est créée pour les civils. Chumbucket travaille sur un moteur ou une roue et ne soigne pas des blessures humaines.
- Sev et Rico utilisent les tenues Killzone 2 sélectionnées ; Echo reste dans Shadow Fall. Les versions 2014 de Wolfenstein, DR1/DR2/DR3, Rocky II/1976, SAC, PAYDAY 2 et Dino Crisis 2 sont identifiées individuellement dans le tableau.

Ces images sont de nouvelles illustrations adaptées au moteur. Les références anciennes archivées servent à la comparaison ; elles ne constituent pas une certification canonique. Les paramètres de jeu, les timings et les proportions de rendu restent des adaptations déclarées. `canonicalVerified`, `networkVerified` et `source1to1Verified` restent faux ; aucune fidélité officielle 1:1 des frames n’est annoncée.

## Corrections réellement effectuées

Les [revues des sources](source-reviews.json), [exclusions](source-exclusions.json), [échecs de demande](request-failures.json) et [relevés de génération](generation-records.json) conservent les observations et demandes exactes. Chaque PNG source possède son prompt, son reçu réel, son chemin original et ses empreintes.

Les poses inadéquates ont été remplacées par de nouveaux dessins : Rambo (12 actions), Hiro (12 actions), Panam/BJ/Superfly/David (repos avec équipement), Trautman (huit poses absentes et quatre repos), Jackie (quatre super sans trou noir prématuré), Tenenbaum (16 poses de soutien et défaite) et Chumbucket (huit poses réellement absentes). Chuck et Nick ont chacun trois feuilles de 16 pour conserver leurs longs accessoires ; Chuck possède en plus quatre dessins de défaite de manche. Leurs deux anciennes feuilles inadéquates de 48 restent exclues en entier.

Le Tachikoma conserve son canon ventral. Les quatre anciens super dont deux figures se touchaient ont été écartés et quatre nouveaux dessins ont été produits. Le moteur compact de Chumbucket, dessiné à côté de la première pose, est classé comme accessoire séparé par un seuil de composant mesuré ; ses pixels RGBA restent rattachés à cette pose sans peinture ni effacement. Une étape intermédiaire de Liberate, sur les 49 dessins observés dans sa source, reste exclue.

Le refus réel de correction de John Wick est conservé dans [son reçu](sources/john_wick-p30l-corrected-error.json), demande `c231d38b-de58-46e1-8b9b-0d7f47af212e`, code `moderation_blocked`. Aucune nouvelle tentative n’a suivi ce refus. L’image initiale au mauvais accessoire reste exclue ; elle n’est pas livrée sous une autre identité. Tank constitue une nouvelle source indépendante autorisée par l’amendement préalable.

## Rendu et mesures

Le pipeline ne peint aucun personnage : il segmente les pixels alpha existants, conserve chaque pixel RGBA non transparent, recadre et assemble en nearest-neighbor. Aucun membre n’est créé, reflété ou réparé par code. Chaque source reçoit une échelle uniforme ; les dimensions, les boîtes réellement observées, les poses retenues et les facteurs de rendu sont inscrits dans les registres. Les cellules font 256 × 256, avec marges transparentes et baseline de packing 244.

Les points d’émission ont été choisis sur les atlas finaux, puis mesurés sur des pixels visibles : [64 mesures initiales](anchor-measurements-initial.json) par l’agent A, [52 mesures supplémentaires](anchor-measurements-additional.json) dans ce groupe. Les cellules, contacts, coordonnées locales, RGBA et SHA sont conservés. Le Tachikoma est mesuré au canon ventral, BT au XO16A2 et Rambo sur le riser de l’arc. Aya n’a aucune ancre de projectile pour Liberate. Les grilles et marqueurs de contrôle sont des vues de diagnostic et ne comptent jamais comme dessins livrés.

## Vérification locale

Les deux builders ont terminé avec `--check` et code de sortie 0 :

```sh
node scripts/buildCombatCharacterAnimationsWave16PartB.mjs --check
node scripts/buildCombatCharacterSpriteCorrectionsWave16PartB.mjs --check
```

Ils vérifient les prompts/reçus/SHA, la segmentation et ses comptes observés, l’unicité des sélections, les quatre dessins distincts de chaque phase, les pixels visibles conservés, la transparence des marges et la reproduction exacte des 80 sorties. Les registres et les 116 ancres sont relevés dans [le manifeste de livraison](delivery-manifest.json). Les tests et captures des moteurs relèvent de la validation centrale de W16 ; ce dossier ne leur attribue pas un résultat qu’il n’a pas lui-même exécuté.
