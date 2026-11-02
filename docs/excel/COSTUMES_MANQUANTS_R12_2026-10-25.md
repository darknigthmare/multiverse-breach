# R12 — variantes sourcées, périmètres de recherche et registre consolidé

Base exacte de la PR : `73a3088adcd87199aab35065754c3b95576d5ead` (R11), arbre `69757b657fb530e2f5d0f67d32cd4d85b0ec79a6`. Les travaux R4–R11 sont conservés. Aucun merge ni déploiement de production.

## Contenu effectivement ajouté

**26 définitions officielles nouvelles, 29 affectations sur dix identités auparavant sans variante documentée.** Catalogue et descriptions de fabrication FR/EN intégrés ; les boosters existants les prennent en charge par porteur exact. Aucune nouvelle planche de costume, animation graphique ou approbation artistique 1:1. Les costumes restent non équipables tant que leurs graphismes manquent.

### Frank West : vingt noms issus de six packs précis

| Pack Dead Rising Deluxe Remaster (2024) | Costumes de Frank |
|---|---|
| Resident Evil Villains | Chainsaw Villager, Licker, Nemesis |
| Resident Evil Heroes | Ashley Graham, Chris Redfield, Leon S. Kennedy |
| Mega Man | Lan Hikari, Mega Man, Tron Bonne |
| Dead Rising Original | Chuck Greene, Frank West 2006, Willamette Parkview Mall Bee |
| Willamette Parkview Mall | Clown, Creepy Rabbit, Sheriff, War Photographer |
| Capcom Fighters | Blodia, Ken, Rikuo, Sodom |

Ces vingt entrées appartiennent à `Dead Rising / dead_rising_frank_west`. Un costume Nemesis ou Leon porté par Frank ne donne pas Nemesis/Leon, leurs pouvoirs ou leurs armes. Le booster ciblé reste Dead Rising, pas Resident Evil. Les musiques des packs sont exclues. Le nom de source n'est pas une validation du modèle ni de ses proportions.

### Dead by Daylight : accessoires et vêtements partiels

- The Wraith : Metallic Grill ; The Doctor : Zipper Mouthpiece ; The Hillbilly : Engraved Flesh ; The Trapper : Ashen Quake. Quatre **masques**, pas quatre tenues complètes.
- Eddie’s Live Shirt sur Dwight Fairfield, Meg Thomas et Claudette Morel : un design documenté, trois affectations. Coupe et différences d'impression doivent être relevées par porteur ; aucune identité de survivant sous licence n'est ajoutée.

### Killing Floor 2

Scullyphones sur DJ Scully et Mr Foster : un accessoire, deux affectations vérifiées dans l'extrait éditeur. Les variations non nommées ne sont pas transformées en couleurs inventées ou en droits supplémentaires. L'accessoire n'ajoute aucun personnage, voix ou tenue de corps.

## Sources consultées le 25 octobre 2026

1. Capcom, liste des six packs et vingt noms : https://store.steampowered.com/app/2527390/
2. Capcom, descriptions du porteur Frank : https://store.steampowered.com/dlc/2527390/
3. Behaviour, Slipknot Collection (26 mars 2024) : https://deadbydaylight.com/news/slipknot-collection/
4. Behaviour, Iron Maiden Collection (22 février 2024) : https://deadbydaylight.com/news/iron-maiden-collection/
5. Tripwire, extrait du catalogue Digital Deluxe : https://store.steampowered.com/dlc/232090/
6. Recherche Charity Chest : https://store.steampowered.com/dlc/381210/
7. Recherche Dead Rising 2 : https://store.steampowered.com/app/45740/
8. Recherche Off the Record : https://store.steampowered.com/app/45770/

Les sources confirment les noms et destinataires dans le périmètre indiqué, pas des sprites comparés à des références multi-vues. La preuve Scullyphones est conservée comme `PUBLISHER_CATALOGUE_EXCERPT` ; la liste tronquée de destinataires et les variantes sans nom ne sont pas extrapolées.

## Recherche à périmètre explicite

`assessNamedCostumeScope` compare un manifeste de noms à l'acteur, aux clés, aux noms anglais, aux sources et au périmètre exacts. Les doublons, absences et conflits restent visibles. Le manifeste des six packs de Frank est complet **pour ces vingt noms seulement**.

`NAMED_SCOPE_COMPLETE` ne devient jamais « toutes les tenues du personnage recensées ». Les sorties gardent `allCharacterCostumesResearched:false`, `artApproved:false`, `equippable:false`. Les vêtements du jeu de base, les autres épisodes, les modèles et animations restent à rechercher ou fabriquer. Aucun résultat de ce contrôle n'est un jugement des pixels.

Dix pistes liées supplémentaires sont conservées hors récompenses : garde-robe de base de Frank, composants des skill packs de Frank/Chuck, identité Legendary Pharoah Eddie du Doctor, composants Charity Chest pour quatre porteurs, variantes non nommées de Scullyphones pour deux porteurs.

Quatre recherches sans porteur actif sont séparées : Deathslinger/Dominant Eye, Clown/Grim Circus, Blight/Molded Visage et Legion (Frank)/Subliminal Menace. Legion Frank n'est pas Frank West. Aucun nouveau personnage ou rattachement approximatif n'est créé.

## Totaux et limites de complétude

- 4 936 acteurs actifs, dont 1 912 héros/alliés ; 525 univers et 3 206 stages conservés.
- **143 définitions officielles / 149 affectations / 45 identités documentées**.
- **19 953 droits / 530 routes**. Les 19 924 IDs précédents sont intacts ; empreinte triée SHA-256 `6b300ad5b03f8b8770478359b1e9926266b54bd39177883f528b47642e8b40dd`.
- Les collections originales restent quatre briefs communs par acteur plus 60 concepts sur mesure, pas autant de dessins uniques.
- **30 703 actions ouvertes** : toutes les tâches connues regroupées par acteur, pas autant d'inspections manuelles. Dix nouveaux acteurs documentés entraînent des tâches de fabrication et dix nouvelles pistes de recherche ; l'augmentation n'est pas un nombre de régressions du jeu.
- Les 312 identités originales restent distinguées. Sur les 4 624 externes/non résolues, **4 579 restent sans variante officielle documentée**. Même les listes amorcées ne sont pas déclarées exhaustives.
- Les **22 P0 historiques, 1 477 acteurs avec raster résolu absent et neuf planches de jeu 1×1 à examiner restent ouverts**. L'arbre de présence est historique ; aucune nouvelle collecte de pixels n'est annoncée.

Les cinq cartes, prix et garanties des boosters sont inchangés. Un droit ne débloque ni personnage ni équipement ni statistiques. Un ancien pool terminé ne rouvre que les nouveaux droits de son univers : vingt Dead Rising, sept Dead by Daylight et deux Killing Floor 2. Les exclusions administrateur et l'absence de répétition restent appliquées.

## Vérifications réalisées

Baseline R11 : 1 032 tests locaux réussis. **R12 : 1 116 tests locaux réussis, zéro échec, ignoré ou annulé**, soit 84 contrôles supplémentaires. Ne pas additionner les exécutions. Les anciennes scènes, preuves PNG, identités, sauvegardes et boosters sont inclus.

Treize fichiers JS/MJS passent le contrôle de syntaxe. Les dix fichiers existants modifiés et trois dépendances R11 ont été rapprochés des blobs Git ; la reconstruction de l'arbre parent est identique. Les treize fichiers source/tests de sortie correspondent aux blobs locaux ; arbre de code vérifié `db7ac9ab201029c6db0ab0f633a11e01bca1152d`.

**Pas de nouveau lint, build complet, test navigateur, contrôle Vercel ni succès CI global revendiqué.** Les contrôles historiques gardent leur date et leur portée. Aucun fichier de jeu PNG ou nouvelle animation produit dans cette passe.

## Registre Excel consolidé et livraison

`Multiverse_Registre_Acteurs_Costumes_R12_2026-10-25.xlsx` : **14 onglets**, incluant les 4 936 dossiers actifs, les 30 703 actions regroupées dans 4 936 lignes par acteur, les 149 affectations, les 143 définitions, les 29 ajouts, 530 boosters, recherches liées/non liées, 60 concepts, grille vierge, sources, périmètres et 22 P0 historiques.

Le CSV `Manquants_4936_Acteurs_R12.csv` garde une ligne par tâche pour filtrer individuellement les **30 703 actions**. Les notes artistiques sont vides tant qu'une revue documentée n'existe pas. Ce registre couvre les acteurs présents, pas tous les personnages absents des franchises ni tous les PNJ narratifs sans acteur.

Classeur : 1 174 570 octets ; SHA-256 `f8534448344969a532840db579318589f8db18a4f52ea8a86dffac0587eb7457`. Intégrité ZIP/XML vérifiée, 9 936 formules, zéro cellule d'erreur détectée ; synthèse rendue et inspectée. Les grandes tâches sont regroupées par acteur pour garder un classeur exploitable ; le CSV conserve le détail individuel.

**Code, rapport, preuves et CSV des ajouts sont publiés dans la PR. Le XLSX et le CSV complet des tâches sont fournis dans la conversation ; les anciens XLSX du dépôt ne sont pas remplacés.** Le ZIP fourni est un complément source/patch/exports/preuves, pas le jeu complet. Aucun catalogue perdu n'est prétendu restauré.

Reproduction depuis la branche et des sources de confiance : lancer la suite précédente avec `scripts/wardrobeR12.test.mjs`, puis `scripts/exportWardrobe.mjs`, `scripts/exportWardrobeBoosters.mjs` et `scripts/exportActorFidelityBacklog.mjs` avec le SHA de base et l'arbre d'assets explicites.

Aucun compte, sauvegarde réelle, réglage administratif ou workflow de transfert modifié. Aucun merge ni déploiement de production.
