# R9 — Manquants individuels et 24 variantes officielles supplémentaires

Base de travail : `48e9cbdd084ef123f2e51b7559b51decaf15ae08`, PR nº6. Arbre des onze fichiers de code/tests vérifiés : `0ff78e356e20f6d056437519412e85cd7ff6a3e8`.

## Ce qui est livré, et ce qui ne l'est pas

Cette passe ajoute **24 variantes officielles nommées au catalogue actif et aux boosters concordants**, ainsi qu'un registre de reprises pour **chacun des 4 936 acteurs actifs**. Le registre contient 30 674 actions ouvertes, avec identité exacte, raison, preuve source, priorité et action proposée.

**Ce n'est pas la réparation artistique de 4 936 personnages, ni un recensement complet de tous les personnages et costumes absents des œuvres.** Aucun PNG de costume, nouvelle animation, nouvelle capacité ou approbation 1:1 n'est produit. Les variantes restent non équipables tant que leurs graphismes et leur revue ne sont pas livrés. Les trois scènes R4 et l'acquisition R8 restent conservées ; aucun merge ni déploiement de production.

## Variantes ajoutées et périmètre des preuves

| Identité exacte | Nombre | Contenu |
|---|---:|---|
| Final Fantasy XIII / lightning_ff13 | 14 | Composant vêtement des schémas nommés pour Lightning Returns PC : Divine Wear, Moogle Lover, Ultimate Saviour, FFX-2 Yuna, FFVII Cloud, FFX Yuna, Tomb Raider, Shining Prince, Dark Samurai, Sohei Savior, Utsusemi, Art of War, Flower of Battle, Shogun. |
| Sonic / sonic_hedgehog | 4 | Hunter's Rathalos Outfit, Felyne's Rathalos Outfit, Holiday Cheer Suit, Sonic Adventure 2 Shoes. La dernière entrée est uniquement une paire de chaussures. |
| Horizon Zero Dawn / horizon_zero_dawn_aloy | 2 | Carja Storm Ranger Outfit, Banuk Trailblazer Outfit de Complete Edition. Arcs et ressources du pack exclus. |
| Borderlands 2 / borderlands_2_salvador_gunzerking | 4 | Major Malfunction et El Diablo sont des têtes ; In the Trenches et Mess With The Bull sont des skins de corps. Pas quatre vêtements complets. |

Les fiches comprennent source, œuvre/édition, composant, consignes bilingues de fabrication et critères à relever. Ces consignes **ne sont pas des observations de sprites terminés**. La fiche éditeur confirme l'existence et le nom, pas la reproduction graphique du projet.

Lightning reste Lightning lorsqu'elle porte une tenue inspirée de Cloud, Yuna ou Lara : aucun transfert d'identité, arme, bouclier, capacité ou bonus du schéma. Sonic reste le modèle moderne de Frontiers, pas un corps humain ou un Felyne. Aloy cible Zero Dawn Complete Edition, pas automatiquement Forbidden West ou le remaster. Les têtes et skins de Salvador restent deux composants distincts.

### Sources éditeur consultées le 24 octobre 2026

- Square Enix, schémas Lightning Returns : https://store.steampowered.com/app/345350/
- SEGA, les deux tenues Rathalos : https://store.steampowered.com/app/2089730/
- SEGA, Holiday Cheer : https://store.steampowered.com/dlc/1237320/
- SEGA, chaussures SA2 : https://store.steampowered.com/app/2089840/
- PlayStation PC, description Complete Edition : https://store.steampowered.com/api/appdetails?appids=1151640
- 2K, packs Gunzerker Domination et Madness : https://store.steampowered.com/dlc/49520/
- Square Enix, piste Half-Life / Final Fantasy XV : https://store.steampowered.com/api/appdetails?appids=637650

La condition promotionnelle historique des chaussures n'est pas annoncée comme encore disponible aujourd'hui. Les images multi-vues des nouvelles tenues n'ont pas été inspectées dans cette passe.

### Trois pistes gardées hors des récompenses

La variante FFVII Aerith est explicitement exclue de l'édition PC de Lightning Returns : il faut documenter l'édition console. Le Half-Life Costume principal de FFXV doit être distingué du HEV et des lunettes de COMRADES et son porteur/modèle confirmé. Nora Keeper Pack est nommé comme pack, pas comme tenue dans cette source. Aucun de ces trois cas ne devient automatiquement un costume déblocable.

Sheva/Fairy Tale, Moira/Urban Ninja et Natalia/Lottie restent également des recherches sans acteur lié, conservées depuis R7.

## Registre individuel des reprises

Le nouvel export exécute les catalogues après leurs corrections et attribue une clé univers + ID exact à chaque héros, allié, ennemi, boss et world boss actif. Chaque dossier conserve l'incarnation déclarée, la référence, le contrat visuel, les techniques, les chemins de sprites résolus, les costumes documentés, les concepts propres au personnage et ses boosters.

| Constat dans les champs/packs contrôlés | Acteurs concernés |
|---|---:|
| Continuité retrouvée par rattachement exact à un pack | 1 439 |
| Incarnation encore non précisée dans ces données | 3 440 |
| Champ visualAnchor individuel absent | 3 220 |
| Champ visualAnchor présent mais utilisant la phrase générique détectée | 213 |
| Au moins un nom de technique générique détecté | 1 363 |
| Au moins un raster résolu absent de l'arbre Git | 1 477 |
| Planche de jeu déclarée 1×1 à examiner | 9 |

Ces groupes se recoupent et ne s'additionnent pas. **Une absence de champ n'affirme pas qu'aucun autre document n'existe ; un nom générique ne prouve pas l'absence de logique de combat.** Une URL déclarée n'est pas une comparaison de scène, un fichier présent n'est pas un sprite fidèle et un chemin absent peut encore avoir un rendu de secours.

Les 1 439 continuités retrouvées ne sont plus déclarées entièrement absentes. Elles restent à préciser au niveau du modèle, de la tenue et de la scène. Le rattachement est exact, sans rapprochement approximatif de noms ; les conflits restent ouverts. Les métadonnées des acteurs du jeu ne sont pas modifiées par cet export.

**312 identités sont explicitement originales.** Elles reçoivent une revue du design interne, pas une recherche de costumes officiels externes imaginaires. Parmi les 4 624 identités externes ou non résolues, 28 disposent maintenant de variantes documentées et 4 596 restent sans variante documentée. Le compteur global sans variante vaut 4 908 car il inclut aussi les 312 créations originales.

Les 22 P0 visuels historiques sont conservés séparément, sans reclassification ni nouvelle inspection des images. Les priorités P1/P2 du nouvel export ordonnent les tâches de cette passe et ne les remplacent pas.

## Catalogue et boosters

Le total actif atteint **88 designs officiels, 91 associations sur 28 identités**, 60 concepts personnalisés et quatre collections communes inchangées. Il y a **19 895 droits de costumes** sur 530 routes de boosters. Ce ne sont pas autant de dessins uniques.

Les 24 ajouts rejoignent automatiquement le booster de leur porteur et le multivers. La règle R8 reste inchangée : cinq cartes et leur économie intactes, plus un droit manquant gratuit dans le pool correspondant. Une tenue ne débloque pas son acteur. Les recherches non confirmées restent hors du tirage. Aucune modification de sauvegarde réelle.

## Contrôles réellement exécutés

- **919 tests Node locaux réussis**, zéro échec, ignoré ou annulé : 871 régressions et 48 nouveaux contrôles R9. Les 83 tests R4 sont déjà inclus, ne pas les additionner.
- Contrôles d'identité, de route booster, de conservation des anciens IDs, de non-équipement des tenues sans art et de non-mutation du roster.
- Un dossier distinct pour chacun des 4 936 acteurs, continuities exactes, conflits, liens invalides, chemins traversants, absence de fichier et image HUD statique traités séparément.
- `node --check` réussit sur les onze fichiers JS/MJS. **Pas de nouveau lint, build complet, test navigateur, contrôle Vercel ou succès CI revendiqué.**
- Les onze fichiers préparés ont été vérifiés par leurs blobs : reconstruction du même arbre Git depuis les empreintes locales. Les sept fichiers modifiés ont été comparés aux blobs du parent avant modification.
- Les présences de rasters utilisent l'arbre complet du master `5f44cf344d1a9fbb0dbd7c899510b7dd16cf25d6`. Aucun fichier public n'a été modifié par la PR contrôlée ; ce n'est pas un nouveau téléchargement/visionnage des PNG.

## Livraisons

Le classeur **Multiverse_Manquants_Par_Personnage_R9_2026-10-24.xlsx** rassemble dix onglets : synthèse, acteurs, catalogue officiel, nouveaux ajouts, boosters, historique visuel P0/P1, recherches, 60 concepts personnalisés, sources et méthode. Les **30 674 actions détaillées** sont dans le CSV compagnon `exports/backlog/tasks.csv`, pas 30 674 observations artistiques manuelles.

Classeur : 681 199 octets ; SHA-256 `c73dfa4ebcd29115eca20ad6a4f6ab4cb7471f9f1fc6c3bce06973e1e14c8356`. Dix onglets, six formules, aucune cellule d'erreur ; ZIP/XML et aperçu de synthèse contrôlés. Les notes artistiques non évaluées ne sont pas inventées.

**Code, exporteurs, rapport, résumé de preuves et CSV des 24 ajouts sont dans la PR. Le nouveau XLSX et le CSV complet des tâches sont livrés dans la conversation ; les anciens XLSX binaires du dépôt ne sont pas remplacés.** L'archive de cette passe est un complément, pas le jeu complet.

### Reproduction depuis la branche R9

```sh
node --no-warnings --experimental-loader ./scripts/sourceSceneTestLoader.mjs --test scripts/actorFidelityR9.test.mjs scripts/wardrobeBoosters.test.mjs scripts/wardrobe.test.mjs scripts/wardrobeRoster.test.mjs scripts/reauditWardrobeCatalog.test.mjs scripts/reauditWardrobeCoverage.test.mjs scripts/reauditWardrobeFidelityR7.test.mjs scripts/reauditSourceScenes.test.mjs
node --no-warnings --experimental-loader ./scripts/sourceSceneTestLoader.mjs scripts/exportActorFidelityBacklog.mjs /tmp/actor-backlog 48e9cbdd084ef123f2e51b7559b51decaf15ae08
node --no-warnings --experimental-loader ./scripts/sourceSceneTestLoader.mjs scripts/exportWardrobe.mjs /tmp/wardrobe 48e9cbdd084ef123f2e51b7559b51decaf15ae08
node --no-warnings --experimental-loader ./scripts/sourceSceneTestLoader.mjs scripts/exportWardrobeBoosters.mjs /tmp/boosters 48e9cbdd084ef123f2e51b7559b51decaf15ae08
```

Les commandes importent les sources locales de confiance et ne contactent aucun service. Pour une copie sans `.git`, le registre accepte un fichier d'arbre complet et son commit en arguments supplémentaires. Le commit fourni identifie la base de l'analyse, pas une prétendue certification graphique.

## Limite de complétude

La couverture individuelle des **acteurs présents** est complète dans ce registre. La recherche de **tout ce qui manque dans chaque franchise** demeure ouverte : personnages absents du roster, contacts PNJ uniquement narratifs, toutes les incarnations et tous les costumes non découverts ne sont pas déclarés recensés. Aucun personnage n'est marqué « fini 1:1 » sur la seule base de cet inventaire.
