# R8 — Déblocage des costumes dans les boosters correspondants

## Code livré

Commit de code : `9db0927673ebc792435dbfa996d96cc54d279bb7`, arbre `598bbce3207993e14c78d33111798b13441b49d2`, parent R7 `f857dcf6bd739aa93a46134d7bf13956981d7239`.

Cette passe raccorde le catalogue de costumes R5–R7 au véritable écran de boosters, à l'inventaire et au vestiaire. Elle ne rajoute pas de costume officiel non documenté, de personnage ou de stage. Aucun merge ni déploiement de production effectué.

**Un costume peut maintenant être débloqué comme droit conservé, mais les tenues sans graphismes restent non équipables.** Ce n'est ni une nouvelle planche ni une certification 1:1. Les effets de sol et les anciennes palettes gardent leur fonctionnement séparé.

## Règle d'acquisition

Chaque ouverture réussie conserve ses cinq cartes, son prix, ses probabilités de cartes et son système de garantie de héros. En supplément, elle accorde gratuitement **un droit de tenue encore non possédé dans le pool correspondant**, tant qu'il en reste. Les ouvertures par crédit gratuit suivent la même règle.

Le tirage du bonus est uniforme parmi les entrées manquantes : chaque entrée a une probabilité conditionnelle de `1 / nombre restant`. Les doublons de droit sont exclus. Une fois le pool terminé, aucun bonus de tenue ni compensation monétaire supplémentaire n'est accordé ; les cinq cartes restent disponibles normalement.

Le bonus ne devient pas une sixième carte de l'album. Il ne dilue pas les taux des héros, ne compte pas dans les cinq tirages, ne modifie pas les garanties, les remboursements ou les paliers de l'album. La suppression d'une carte ou une récompense de monnaie supplémentaire n'a pas été utilisée pour financer ce bonus.

## Correspondances exactes

- Les boosters d'univers ciblent l'univers exact du porteur : Resident Evil, Metal Gear, Metal Gear Rising, Star Wars, NieR, Final Fantasy VII, etc.
- Alien, Aliens et AVP ne fusionnent pas leurs pools ciblés. Le multivers peut les réunir explicitement.
- Les créations Convergence, Expédition, Nocturne et Commando restent dans l'univers de leur porteur. Le concept Commando de Leon ne rejoint pas le film Commando.
- Les boosters `oc-world:*` couvrent leur monde original ; les boosters de chapitre `oc:*` respectent leur distribution exacte de `heroIds`.
- Les acteurs Nexus non rattachés à ces chapitres, dont l'Ancre, conservent une route via le multivers. Une tenue d'un acteur exclusif à la campagne ne débloque jamais cet acteur.
- Les univers masqués et héros/ennemis désactivés par l'administrateur sont exclus du pool actif. Le tableau exporté présente la couverture complète avant ces filtres.
- Les pistes non liées à un acteur exact, dont Sheva/Fairy Tale, Moira/Urban Ninja et Natalia/Lottie Suit, ne deviennent pas de fausses récompenses.

## Couverture du catalogue actuel

| Mesure | Total |
|---|---:|
| Identités d'acteurs | 4 936 |
| Univers | 525 |
| Routes de boosters existantes raccordées | 530 |
| Droits de costume enregistrés | 19 871 |
| Associations officielles | 67, issues de 64 designs documentés |
| Associations originales | 19 804 |
| Nouvelles planches / approbations artistiques | 0 / 0 |

Les 19 804 associations originales correspondent à quatre briefs communs × 4 936 acteurs et 60 concepts sur mesure. **Ce ne sont pas 19 804 dessins uniques.** Les routes du booster multivers recouvrent les routes ciblées : leurs totaux ne s'additionnent pas pour compter des droits uniques.

Quelques pools : Resident Evil 143 droits, Metal Gear 100, Metal Gear Rising 53, Star Wars 139, Dead Space 94, Final Fantasy VII 78, Tomb Raider 40, NieR 47, Devil May Cry 43 et HITMAN WOA 42. Ces totaux comprennent les fiches de concepts originaux et ne représentent pas des quantités de skins graphiques terminés.

## Interface et sauvegarde

L'écran des boosters montre le nombre de droits possédés et restants, la règle du bonus et sa probabilité conditionnelle. La liste consultable propose une recherche par porteur/tenue/œuvre, un filtre officiel/original, l'inclusion des droits déjà possédés et une pagination de 24 entrées. Ces filtres de consultation ne changent pas le tirage.

Après révélation des cinq cartes, un reçu séparé indique le droit obtenu, le personnage, l'univers, l'origine officielle/originale et l'attente de graphismes. Le vestiaire des héros et les archives adverses affichent la propriété ainsi que les routes compatibles.

Le droit utilise l'identifiant `wardrobe-v1` déjà stable et se conserve dans `inventory`. Les exemplaires d'équipement existants, identifiants futurs et sélections sont préservés. L'attribution est idempotente ; la double activation du bouton n'accorde pas deux bonus. L'historique ajoute une entrée `costume` à prix zéro, sans augmenter les cinq tirages par booster.

Aucun porteur, capacité, arme, statistique, monnaie ou avantage n'est accordé par le droit. La possession ne permet pas de contourner le refus des tenues sans planche dédiée. Les archives adverses restent consultables ; aucun nouveau sélecteur de costume ennemi n'est ajouté.

## Validation réellement exécutée

[Run GitHub 40122568710](https://github.com/darknigthmare/multiverse-breach/actions/runs/40122568710) : **réussi**.

- **871 tests Node réussis**, zéro échec/ignoré/annulé : 575 contrôles nouveaux R8, principalement la matrice systématique de routage, et 296 régressions. La même suite a passé localement ; ne pas compter deux fois les mêmes tests. Les régressions des trois scènes R4 sont incluses.
- **Lint ciblé : zéro avertissement et zéro erreur** sur les quatre fichiers vérifiés.
- **Compilation Vite des sources réussie**. Le prébuild intégral des bitmaps n'a pas été exécuté dans cette collecte. Les gros blocs JavaScript existants restent signalés.
- **Cinq parcours Chromium réussis** avec le véritable `PortalScreen` et le vestiaire dans une fixture React isolée : achat mobile FR, achat ordinateur EN, crédit gratuit mobile EN, pool terminé ordinateur FR et fonds insuffisants mobile FR. Double clic, reçu, cinq cartes, deux ouvertures sans répétition et conservation après remontage du composant sont contrôlés. Zéro erreur JavaScript observée et aucune modification de localStorage dans ces parcours.
- Sauvegarde : normalisation et copie JSON testées. Le remontage du composant conserve l'état parent ; ce n'est pas une validation d'un compte cloud réel ou d'une restauration complète de l'application.
- **668 sources initiales vérifiées** contre leurs blobs Git. Les onze fichiers source/tests publiés correspondent aux SHA-256 locaux. L'arbre reconstruit à partir de ces onze blobs est exactement `598bbce3207993e14c78d33111798b13441b49d2`.

Les images du navigateur sont remplacées par des bitmaps de secours. Ces parcours ne certifient ni les sprites, ni l'application complète, ni une partie sur Vercel, ni un téléphone physique. Le workflow de préparation est hors du diff et de l'ascendance du commit livré ; seuls les onze fichiers source/tests revus ont été publiés.

Artefact 12571547779 téléchargé et vérifié, SHA-256 : `93624441036b72dbf5731662a44e22bc422f193fa53b61c79ce9b04f73e56164`.

## Fichiers de suivi

Le classeur `Multiverse_Costumes_Boosters_R8_2026-10-24.xlsx` est livré dans la conversation : sept onglets (synthèse, 530 routes, 4 936 acteurs, 67 associations officielles, règles, vérifications et sources). Il est compact ; les 19 871 identifiants détaillés restent dans les exports JSON/CSV du pack et sont reproductibles par le script ci-dessous.

Classeur : 349 418 octets ; SHA-256 `2fedb03215ecba3c3f392cd7d004901a1d0d83f2756618a05ba9a339ecf3bffe`. Intégrité ZIP/XML vérifiée, 5 471 formules, zéro cellule d'erreur ; synthèse rendue et inspectée.

**Le nouveau XLSX n'est pas publié comme binaire dans cette PR. Les XLSX historiques du dépôt restent R1.** Les sources, le rapport, le résumé de preuves et un CSV des pools officiels/chapitres sont publiés. Le pack de cette passe est un complément, pas une archive du jeu complet.

```sh
node --no-warnings --experimental-loader ./scripts/sourceSceneTestLoader.mjs --test scripts/wardrobeBoosters.test.mjs scripts/wardrobe.test.mjs scripts/wardrobeRoster.test.mjs scripts/reauditWardrobeCatalog.test.mjs scripts/reauditWardrobeCoverage.test.mjs scripts/reauditWardrobeFidelityR7.test.mjs scripts/reauditSourceScenes.test.mjs
node --no-warnings --experimental-loader ./scripts/sourceSceneTestLoader.mjs scripts/exportWardrobeBoosters.mjs /tmp/wardrobe-r8 9db0927673ebc792435dbfa996d96cc54d279bb7
```

Le paramètre du second script identifie la version source déclarée de l'export. Il ne télécharge rien et ne modifie aucune sauvegarde.

## Manquants toujours ouverts

La recherche officielle pour les autres identités, les sprites dédiés, animations et validations 1:1 restent à faire. Les 22 P0 visuels, les 1 477 rasters adverses absents et la couverture des signatures de combat ne sont pas réparés par ce raccordement. Les trois stages R4 et les travaux R1–R7 sont conservés. Aucun nouveau design officiel, acteur, stage ou PNG n'a été ajouté dans R8.
