# R13 — composants officiels, porteurs exacts et manquants individuels

## Base et publication

Code R13 : `4aa64f4540e245bf8306ffdb7beaeedaa72873ba`, arbre `c4c4f96a10f85fd21d60a7fc7e21b7dcbd5ad1d4`.
Parent exact : `e09265fa5a6b75caa8b66b6784629ea69cd0da8a`. Les ajouts R12 et les corrections de combat plus récentes de cette tête sont préservés. Quatorze fichiers source/tests sont modifiés ou ajoutés. Aucun acteur, stage, sprite ou déploiement de production n'est ajouté.

**Le catalogue, les consignes de fabrication, les rattachements aux boosters et les contrôles sont livrés. Aucune nouvelle planche de costume ni approbation artistique 1:1.** Les droits acquis restent non équipables tant que leurs graphismes ne sont pas produits et intégrés.

## 33 composants nommés, 186 associations — pas 186 dessins

### PAYDAY 2 : 29 composants communs à six braqueurs présents

Porteurs exacts : Dallas, Wolf, Hoxton, Chains, Houston et Clover, dans l'univers `Payday`. Bain et les adversaires ne reçoivent pas ces cosmétiques de joueur.

| Pack / catégorie | Éléments nommés |
|---|---|
| Lawless — quatre tenues | Wild Bunch, Train Robber, Jailbreaker, Bushwacker |
| Lawless — quatre masques | Butch, Sam, Billy, Jesse |
| Lawless — quatre paires de gants | Gambler, Cowpuncher, Call Spades, Easy Rider |
| Mega City — huit variantes de tenue | Cyberhoodie Black / Red / Yellow / Green ; Cybertrench Monochrome / Red Pinstripe / Yellow / Green |
| Mega City — quatre masques | Cyber Monkey, Robo Mantis, Electro Tiger, Viper Cyberjack |
| Mega City — quatre paires de gants | Padded Monkey, Padded Mantis, Padded Tiger, Padded Viper |
| Mise à jour gratuite distincte | Dragon Bomber Red |

Les 16 composants payants de Mega City sont distingués du Dragon Bomber Red gratuit dans l'œuvre source. Cette indication décrit l'acquisition du jeu d'origine ; elle ne crée pas un achat monétaire supplémentaire dans Multiverse.

Les sources nomment les éléments partagés, mais **ne montrent pas toutes les combinaisons sur les six porteurs**. Chaque association porte donc `PER_WEARER_VISUAL_REFERENCE_REQUIRED`. La coupe, les occultations, les poses et les raccords de mains restent à vérifier sur chaque braqueur. Un masque ne remplace pas l'identité, une paire de gants n'accorde ni arme ni tenue de corps.

### Magicka : quatre éléments pour trois avatars jouables

Zombie Robe, Tentacle Robe, Epic Robe et Wizard's Hat sont associés aux trois avatars bleu, rouge et jaune présents. Les deux premières entrées sont des variantes de modèle/robe ; le chapeau est un accessoire, pas une tenue complète.

Les résistances, ralentissements, armes et sorts des packs source ne sont pas transférés par un droit cosmétique. La robe Zombie ne remplace pas le personnage par Freeman ; le cosplay Tentacle ne remplace pas le sorcier par Purple Tentacle. L'adaptation des volumes et animations à l'avatar exact reste ouverte.

### Pistes volontairement non liées

Coldarr, Flamos et Electrobe sont décrits comme des identités distinctes dans Mega Villain Robes : ils restent des recherches séparées, pas des tenues automatiquement distribuées aux avatars de couleur. Le Naruto 7th Hokage nommé par Shikamaru's Tale reste également hors récompenses tant qu'une incarnation adulte exacte n'est pas liée. Les Naruto jeunes ou d'une autre époque ne sont pas vieillis silencieusement.

## Correction du contrôle des listes de source

Un périmètre déclaré peut désormais exiger, en plus du nom et de la clé, la nature, le composant, l'œuvre/édition et le mode source exacts. Un masque enregistré par erreur comme tenue complète, ou une entrée d'une mauvaise édition portant le même nom, ne permet plus de clôturer ce périmètre.

Les anciens périmètres R12 fondés sur le nom restent compatibles. Les 24 nouveaux rattachements de périmètre (18 PAYDAY et 6 Magicka) s'ajoutent à celui de Frank West. **Compléter une liste de pack ne signifie jamais que toute la garde-robe du personnage est recensée**, ni que les pixels sont fidèles.

Les neuf nouveaux dossiers de recherche liés aux porteurs demandent explicitement leurs vues de référence et leurs adaptations. Ils ne deviennent pas de fausses récompenses. Les identifiants de sauvegarde `wardrobe-v1` sont conservés.

## Boosters et données non visuelles préservés

Les 174 associations PAYDAY vont au booster `universe:Payday` et au multivers ; les 12 associations Magicka à `universe:Magicka` et au multivers. Aucun transfert vers Half-Life, Day of the Tentacle ou un univers portant un mot voisin.

Les **19 953 anciens identifiants** sont conservés exactement ; SHA-256 de leur liste triée : `3b4fdc6ce85e908b3760b6aa0d3e45f62eb53b8c16e161b7f26c8905271d956c`.

Les cinq cartes, les prix, les garanties et le bonus gratuit sans doublon de R8 ne changent pas. Un pool auparavant terminé retrouve exactement ses nouveaux droits. Le droit n'accorde aucun personnage, arme, pouvoir, statistique ou monnaie. Les copies d'équipement et identifiants futurs sont préservés par la normalisation de sauvegarde.

## Totaux recalculés sur la tête actuelle

| Mesure | Total |
|---|---:|
| Acteurs actifs / héros-alliés | 4 936 / 1 912 |
| Univers / stages conservés | 525 / 3 206 |
| Définitions officielles, toutes natures | 176 |
| Associations officielles / identités concernées | 335 / 54 |
| Droits de costumes / routes de boosters | 20 139 / 530 |
| Concepts individualisés / collections communes | 60 / 4 |
| Associations originales | 19 804 |
| Recherches liées / pistes sans porteur exact | 27 / 22 |
| Actions individuelles ouvertes | 30 721 |
| Nouveaux PNG / approbations artistiques | 0 / 0 |

Les 19 804 associations originales sont 19 744 rattachements aux quatre briefs communs et 60 concepts personnalisés. Ce ne sont pas autant de dessins uniques. Les pools multivers et ciblés se recouvrent et ne doivent pas être additionnés.

Les 30 721 tâches comprennent **17 328 P1 et 13 393 P2 de travail**, séparés des 22 P0 artistiques historiques. Ces tâches sont issues des champs, contrats et chemins contrôlés, pas d'une inspection manuelle de tous les pixels.

Le registre distingue 312 identités originales, à revoir sur leur design interne, de 4 624 identités externes ou non résolues. Parmi ces dernières, **4 570 restent sans variante officielle documentée**. Les 4 882 fiches globalement sans variante incluent les créations originales ; cela ne signifie jamais qu'aucune tenue officielle n'existe.

Les 1 477 acteurs avec un raster résolu absent, les neuf planches de jeu statiques et les 22 P0 visuels restent ouverts. Les métadonnées de costume ne les réparent pas. Les champs manquants ou noms de techniques génériques n'établissent pas à eux seuls un défaut de fonctionnement.

## Validation R13 effectivement exécutée

[Run dédié 40165144880](https://github.com/darknigthmare/multiverse-breach/actions/runs/40165144880) : réussi, publication incluse.

- **1 204 tests vestiaire/boosters/fidélité/scènes réussis**, zéro échec/ignoré/annulé. Baseline actuelle : 1 116 ; ajouts R13 : 88. Les mêmes tests ont passé localement ; ne pas compter deux fois les exécutions.
- **1 027 contrôles de signatures de combat réussis dans une suite séparée**, zéro échec/ignoré/annulé. Ils vérifient la conservation des travaux de combat présents dans le parent, sans annoncer de nouvelle capacité R13.
- Lint ciblé des trois nouveaux/renforcés modules : zéro erreur et zéro avertissement.
- Compilation `vite build` des sources et manifestes réussie. Les gros blocs JavaScript demeurent ; le prébuild intégral et la bibliothèque de bitmaps ne sont pas inclus.
- 670 fichiers de la collecte initiale ont été vérifiés contre leurs blobs. Les quatorze sources/tests publiés correspondent aux empreintes locales ; leur arbre reconstruit est exactement `c4c4f96a10f85fd21d60a7fc7e21b7dcbd5ad1d4`.
- Artefact `12588380534` téléchargé, SHA-256 `c463d2965d6e7f6c52e4284770cf6be64e2d0c6ee44fe4f805306c87ef30837a` vérifié.

Deux essais de validation ont été arrêtés avant publication (contrôle d'empreinte, puis manifeste public omis de la collecte). Le dernier essai a conservé les contrôles stricts et ajouté les seuls manifestes JSON/JSONL requis, sans récupérer toute la bibliothèque graphique.

**Pas de nouveau parcours navigateur, téléphone physique, compte cloud, sauvegarde réelle ou contrôle Vercel dans R13.** La compilation et les tests ne constituent pas une revue artistique 1:1. Les workflows de préparation ne font partie ni du diff source livré ni de son ascendance.

## Sources de cette passe

- Starbreeze / OVERKILL, Lawless : https://store.steampowered.com/app/2352300/
- Starbreeze / OVERKILL, Mega City : https://store.steampowered.com/app/1778791/
- Paradox / Arrowhead, Gamer Bundle : https://store.steampowered.com/app/73057/
- Paradox / Arrowhead, Wizard's Survival Kit : https://store.steampowered.com/app/73030/
- Paradox / Pieces Interactive, Mega Villain Robes (recherche) : https://store.steampowered.com/app/73095/
- Bandai Namco, Shikamaru's Tale (recherche) : https://store.steampowered.com/app/416420/

Les pages éditeur ont été consultées le 25 octobre 2026. Elles documentent les noms et leur catégorie, pas les planches du projet ni chaque combinaison de porteur. Les consignes bilingues sont des tâches de fabrication, pas des observations de sprites terminés.

## Fichiers et limite de complétude

Le code, ce rapport et les preuves sont publiés dans la PR. Le classeur R13 consolidé et le CSV des 30 721 tâches sont fournis dans la conversation, avec les sources, le patch depuis le parent exact et les exports. Le pack est un complément de cette passe, pas une archive du jeu complet.

**Le nouveau XLSX n'est pas poussé comme binaire ; les anciens classeurs du dépôt restent préservés.** Les données permettant de refaire les exports sont dans le code.

Le suivi couvre chaque acteur actif du catalogue, mais ne prétend pas lister tous les personnages absents des franchises, tous les PNJ sans acteur, toutes les incarnations ni tous les costumes encore inconnus. Le recensement exhaustif et la production graphique restent à poursuivre. Aucun merge ni déploiement de production effectué.

### Classeur livré et contrôle

`Multiverse_Manquants_Costumes_Boosters_R13_2026-10-25.xlsx` : **11 onglets**, 4 936 fiches d'acteurs et synthèse des familles de tâches ; le CSV joint contient les **30 721 lignes détaillées**. Les 335 associations officielles, 186 ajouts R13, 530 routes, recherches, concepts, périmètres de source et grille de revue sont séparés.

Taille : 689717 octets ; SHA-256 `6f58645141c7ce0f8db36a026381aa65a6b4db732fbac49a5572ed6eb189b253`. Les 12 formules et les valeurs de synthèse ont été contrôlées ; zéro cellule d'erreur dans l'export, intégrité ZIP/XML vérifiée et aperçu inspecté. Le score de revue est vide par défaut ; aucun costume n'est approuvé par une formule.
