# R11 — variantes Sonic et Doom, contexte des récompenses et régressions

Base de travail : `d02a153bc51473fa9ba5ed20bfdbc38a5f278dc4`, arbre `8bb42dab9c3891781bdb1a165d6779ecffe74794`. La PR nº6 conserve les travaux R4–R10. Aucun merge ni déploiement de production.

## Ajouts effectivement intégrés au catalogue

| Porteur exact | Œuvre | Ajouts |
|---|---|---|
| `Sonic / sonic_hedgehog` | Sonic Superstars | Sonic Rabbit Skin, Shadow Costume for Sonic, Sonic Holiday Costume, LEGO Sonic Skin |
| `Sonic / miles_tails_prower` | Sonic Superstars | LEGO Tails Skin |
| `Sonic / knuckles_echidna` | Sonic Superstars | LEGO Knuckles Skin |
| `Sonic / sonic_hedgehog` | Sonic X Shadow Generations | Sonic Adventure Legacy Skin (Modern Sonic), Sonic Jam Legacy Skin (Classic Sonic) |
| `Doom / doomslayer` | DOOM Eternal | DOOMicorn, Purple Pony et Night-mare |

Ce sont onze variantes documentées, pas onze tenues graphiquement terminées. Les modèles LEGO et Legacy sont distingués des vêtements et accessoires. Le costume Shadow de Superstars reste porté par Sonic ; il ne crée pas Shadow et n'accorde pas ses capacités. La tenue Holiday de Superstars ne remplace pas le Holiday Cheer Suit de Frontiers déjà recensé.

Purple Pony et Night-mare sont des variantes nommées du set DOOMicorn. Elles gardent un lien vers ce design, mais aucune différence de géométrie ou de couleur n'est déclarée vérifiée. Leurs droits sont indépendants : obtenir une variante n'accorde pas la tenue parente, les podiums ou les animations du pack.

**Aucun nouveau PNG de jeu, animation de costume ni approbation artistique.** Les tenues restent non équipables. Les descriptions FR/EN sont des consignes de fabrication ; elles ne prétendent pas décrire des sprites terminés et comparés en jeu.

## Sources et niveaux de preuve

- SEGA, catalogue Superstars : https://store.steampowered.com/dlc/2022670/ — noms des variantes, porteurs des modèles LEGO et attribution du déguisement Shadow à Sonic.
- SEGA, catalogue Generations : https://store.steampowered.com/dlc/2513280/ — séparation explicite Modern Adventure / Classic Jam et contenus Shadow.
- SEGA, modèle Adventure : https://store.steampowered.com/app/2909780/ — description du modèle destiné à Modern Sonic.
- Bethesda / id Software, DOOMicorn : https://store.steampowered.com/app/1460021/Pakiet_drobiazgw_kolekcji_mistrza_DOOMoroec/?curator_clanid=11909469&l=dutch — **extrait indexé de la description éditeur en néerlandais**, avec les trois noms anglais. L'ouverture directe renvoie à la vérification d'âge. La page détaillée et ses images ne sont pas présentées comme inspectées. Le niveau `PUBLISHER_INDEXED_DESCRIPTION` reste visible dans le code et le suivi.
- Square Enix, FFXV : https://store.steampowered.com/api/appdetails?appids=637650 — Royal Raiment est nommé comme vêtement ; sa référence de porteur et ses vues restent une recherche, pas une récompense nouvelle.

Ces sources documentent l'existence et la portée déclarée, pas la reproduction 1:1 dans ce jeu. Aucun prix ou accès commercial actuel n'est certifié.

## Recherches conservées hors récompenses

Cinq nouvelles pistes sans porteur actif lié sont isolées : Modern Amy Costume, Retro Diner Style Amy Costume, LEGO Amy Skin, Terios Skin et le skin Shadow du Movie Pack. Le lien précis porteur/modèle de Terios reste à documenter, même si le pack le nomme. Aucun de ces contenus n'est attribué à un personnage approchant.

Deux pistes liées sont ajoutées : Mech Sonic, dont la portée Battle Mode doit être définie avant de créer un droit, et Royal Raiment pour compléter la preuve du porteur exact de l'édition FFXV. Aucune de ces pistes ne devient un droit de costume.

## Boosters et conservation des sauvegardes

Les huit nouveaux droits Sonic et les trois droits Doom sont dans leurs pools exacts et dans le multivers. Les cinq cartes, prix, garanties et règles de bonus R8 ne changent pas. Les univers masqués et acteurs désactivés restent exclus. Un droit ne débloque aucun acteur, équipement, pouvoir ou statistique.

Les récompenses et exports conservent désormais `component`, `sourceMode`, `targetIncarnation` et `relatedDesignKey`. Cela évite de perdre les distinctions de modèle et d'édition entre catalogue, dossier de fabrication et suivi du booster. Ces métadonnées ne constituent pas un nouveau sélecteur de formes ou une compatibilité graphique déjà validée.

Un test termine un ancien pool Sonic puis vérifie qu'il ne reste que les huit nouveaux droits, obtenus une fois chacun. L'empreinte de la liste triée des **19 913 IDs précédents** reste `717d1b9f9c02c99a372097d17f206cb80c3d11d0947b32dab562272eb7bf3588`. Les identifiants persistants `wardrobe-v1` restent inchangés.

## Totaux recalculés

- 4 936 acteurs, dont 1 912 héros/alliés, et 525 univers ; aucun nouveau personnage.
- **117 designs officiels / 120 associations / 35 identités couvertes**. Les doubles fiches de Leia expliquent trois associations supplémentaires.
- **19 924 droits et 530 routes de boosters**. Les 19 804 associations originales restent quatre collections communes et 60 concepts personnalisés, pas des dessins uniques.
- 312 identités originales : revue interne. Parmi les 4 624 identités externes ou non résolues, 4 589 restent sans variante officielle documentée. Même les listes déjà amorcées ne sont pas déclarées exhaustives.
- **30 683 tâches individuelles ouvertes**, générées à partir des données et des chemins résolus. Le registre n'est pas une inspection manuelle de tous les sprites.
- Les **22 P0 historiques**, les **1 477 acteurs avec raster attendu absent** et les neuf planches 1×1 de jeu à examiner restent ouverts. Aucun stage ajouté ; les 3 206 stages de la branche restent conservés.

## Vérifications réalisées pendant R11

La baseline R10 a été relancée : 985 tests réussis. La suite R11 donne **1 032 tests réussis, zéro échec, ignoré ou annulé**, soit 985 régressions et 47 contrôles supplémentaires ; ne pas additionner les exécutions. Les anciennes scènes, le décodage PNG, les sauvegardes et les boosters font partie de ces régressions.

Les treize fichiers JS/MJS source/tests modifiés ou ajoutés passent `node --check`. Les onze fichiers existants concordent avec les blobs du parent. L'arbre reconstruit depuis les treize blobs locaux est exactement `3e209721c906716a9a99a617a3239c2e07d7694a`, identique à l'arbre de code préparé sur GitHub.

**Aucun nouveau lint, build complet, test navigateur, test de production Vercel ou succès CI GitHub n'est annoncé.** Les contrôles de raster réemploient l'arbre Git historique complet de master ; aucune nouvelle image du jeu n'a été inspectée ou téléchargée dans cette passe. Les résultats historiques gardent leur date et leur périmètre.

## Livraisons

Code, rapport, résumé de preuves et CSV des onze ajouts dans la PR. L'export complet JSON/CSV est reproductible par les scripts de la branche.

Le classeur `Multiverse_Costumes_Fidelite_R11_2026-10-25.xlsx` comporte dix onglets : synthèse, acteurs, catalogue officiel, ajouts R11, boosters, concepts, recherches, grille vierge, sources et méthode. Le CSV individuel comporte 30 683 lignes de tâches. Le ZIP est un complément de cette passe avec treize sources/tests, patch, exports et preuves, pas le jeu complet.

Classeur : 632 169 octets ; SHA-256 `04d3ac2440b61169e62671b2824efffb567fec8cc4ab05c5248cc8a872980afa`. Dix onglets, 17 formules, zéro cellule d'erreur ; intégrité ZIP/XML vérifiée et aperçu de synthèse inspecté. Les scores de fidélité restent vides.

**Le XLSX est livré dans la conversation, pas publié comme binaire dans cette PR. Les anciens classeurs du dépôt sont conservés.** Le catalogue historique perdu n'est pas prétendu restauré. Aucun compte, sauvegarde réelle, workflow de transfert, paramètre administratif, fusion ou déploiement n'a été modifié.
