# Reprise et livraison des boosters de costumes R8 — 24 octobre 2026

## État retrouvé et conservé

Le travail interrompu avait déjà publié le code R8 au commit `9db0927673ebc792435dbfa996d96cc54d279bb7`, puis le rapport au commit `176a9b68cdcb20ae69ae2005b424168180439848`. La description de la PR affichait encore R7. Cette reprise finalise le contrôle des exports, la livraison téléchargeable et le suivi de la PR, sans réécrire le gameplay déjà intégré.

[Rapport fonctionnel R8](BOOSTERS_COSTUMES_R8_2026-10-24.md) · [Code des récompenses](../../src/game/wardrobeBoosterRewards.js) · [Run R8](https://github.com/darknigthmare/multiverse-breach/actions/runs/40122568710).

## Règle publiée

Chaque ouverture réussie conserve ses cinq cartes, son prix, ses taux et ses garanties de héros. Elle accorde en supplément, sans surcoût, au maximum un droit de costume encore non possédé dans le pool correspondant. Même règle pour un crédit gratuit. Le tirage est uniforme parmi les droits manquants ; les doublons sont exclus. Quand le pool est complet, seuls les cinq tirages habituels continuent, sans compensation monétaire supplémentaire.

Les boosters ciblés respectent l'univers exact du porteur ; les chapitres originaux leur distribution exacte. Le multivers est la route explicite commune. Alien, Aliens et AVP ne sont pas confondus ; un concept Commando de Leon reste dans Resident Evil et non dans le film Commando. Les contenus masqués ou désactivés sont filtrés.

Le droit est conservé dans l'inventaire et affiché dans le vestiaire. Il ne débloque aucun acteur, arme, capacité ou avantage. Il ne devient pas une sixième carte de l'album. **Les tenues sans graphismes restent non équipables : un déblocage n'est pas une planche produite ni une certification 1:1.**

## Recontrôle indépendant des données téléchargées

Artefact GitHub `12571547779`, SHA-256 vérifié : `93624441036b72dbf5731662a44e22bc422f193fa53b61c79ce9b04f73e56164`.

| Contrôle de cohérence | Résultat |
|---|---:|
| IDs de droits uniques | 19 871 |
| Identités d'acteurs uniques | 4 936 |
| Univers | 525 |
| Routes connues | 530 |
| Associations officielles | 67 |
| Associations aux concepts originaux | 19 804 |
| Droits sans route connue | 0 |
| Écarts de totaux par acteur ou booster | 0 |
| Approbations artistiques / tenues équipables | 0 / 0 |

Les 19 804 associations originales sont quatre briefs communs par acteur et 60 concepts sur mesure, pas autant de dessins uniques. Les 67 associations officielles correspondent à 64 designs. Tous les droits ont une route multivers ; les routes ciblées se recouvrent donc avec celle-ci et leurs totaux ne doivent pas être additionnés pour compter des droits uniques.

Exemples de pools complets avant filtres administrateur : Resident Evil 143, Metal Gear 100, Metal Gear Rising 53, Star Wars 139, Dead Space 94, Final Fantasy VII 78, Tomb Raider 40, NieR 47, Devil May Cry 43 et HITMAN WOA 42. Ils incluent les concepts originaux encore à produire.

## Tests : distinguer la passe R8 de cette reprise

Le statut du run `40122568710` a été relu et confirmé **success**. Son artefact contient 871 tests Node réussis sans échec ni test ignoré, le lint ciblé sans avertissement, la compilation Vite des sources et cinq parcours Chromium réussis : achat mobile FR, achat ordinateur EN, crédit gratuit, pool terminé et fonds insuffisants.

Les parcours utilisent le vrai PortalScreen et le vestiaire dans une fixture isolée avec bitmaps de secours. Ils ne valident pas l'application complète, les sprites, un compte cloud réel ni une partie Vercel. Le prébuild intégral des bitmaps n'est pas inclus.

**La présente reprise a vérifié ces preuves et les correspondances exportées ; elle n'a pas rejoué les 871 tests ni le navigateur.** Aucun nouveau résultat moteur n'est ajouté artificiellement au compteur.

## Classeur et exports récupérés

Le classeur `Multiverse_Costumes_Boosters_R8_REPRISE_2026-10-24.xlsx` a été reconstruit à partir de l'artefact CI vérifié. Sept onglets : synthèse, 530 boosters, 4 936 acteurs, 67 associations officielles, règles, vérifications et sources. Les totaux sont calculés par formules.

- Taille : 397 359 octets.
- SHA-256 : `d04e28c572935d847ea75c570f81eb12c81386bd0b9d328648018a000357daa6`.
- 5 471 formules ; aucune cellule d'erreur détectée ; intégrité ZIP/XML et aperçu de synthèse contrôlés.
- Le pack de reprise inclut les exports JSON/CSV complets, dont un CSV des 19 871 droits avec leurs boosters, les journaux CI et les captures. Ce n'est pas une archive du jeu complet ni une archive des onze fichiers source.

**Le classeur et le pack sont fournis dans la conversation. Le nouveau XLSX n'est pas poussé comme binaire dans cette PR ; les XLSX historiques du dépôt ne sont pas remplacés.** Le code, le rapport fonctionnel, les CSV publiés lors de R8 et le présent suivi sont dans la PR.

Les 22 P0 visuels et 1 477 rasters adverses manquants des audits antérieurs restent ouverts. Aucun nouveau costume officiel, acteur, stage ou PNG n'est annoncé dans cette reprise. Aucune modification de sauvegarde réelle, fusion ou publication de production n'a été effectuée.
