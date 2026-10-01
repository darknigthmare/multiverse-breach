# Rencontres et accès aux missions — 1 octobre 2026

Le lot précédent corrigeait les incarnations, lieux, rosters et kits. Ce lot rend trois règles caractéristiques jouables et rétablit leur accès depuis le menu des missions. Les sauvegardes, IDs et récompenses restent compatibles.

- **RAAM, Gears of War (2006)** : les Kryll bloquent les dégâts ordinaires. Les grenades frag les dispersent ; lorsque l’essaim part attaquer, RAAM devient vulnérable. Le couvert éclairé protège de l’essaim et atténue les tirs de la Troika. Quatre grenades partagées et une ouverture de douze secondes adaptent la rencontre au système ATB. Les commandes manuelles et automatiques sont disponibles. [Sources et limites](raam-encounter-mechanics-2026-10-01.md).
- **Scarab, Halo 2 / Metropolis** : rejoindre la passerelle d’abordage puis neutraliser le Grunt et l’Élite de l’équipage. La coque Protos reste invulnérable ; le sniper d’approche ne conditionne pas la victoire. La grille, le véhicule immobile et deux occupants condensent le trajet original. [Sources et limites](scarab-encounter-mechanics-2026-10-01.md).
- **Nihilanth, Half-Life (1998)** : trois cristaux réellement destructibles, réserve de vingt sphères de soin, recharge et ouverture de tête. Le cerveau est une cible distincte nécessaire au coup fatal ; le corps conserve au moins un PV. L’ouverture suit l’affaiblissement du boss ou de sa réserve, sans exiger zéro sphère. Les projectiles violets sont simulés. Les téléportations et invocations restent à réaliser. [Source primaire Valve et limites](nihilanth-encounter-mechanics-2026-10-01.md).

Les dégâts d’objets, de supers et d’anomalies passent par les mêmes protections de rencontre. Les boucliers d’objets ne sont absorbés qu’une fois, après vérification de la protection canonique ; les anomalies non létales conservent au moins un PV.

**Missions → Missions des univers** ouvre désormais le répertoire des confrontations indépendantes, avec recherche et filtres de mode. Ces stages étaient présents dans les données mais exclus de toutes les catégories visibles. Les trois briefings expliquent dès leur ouverture la protection de RAAM, l’abordage/équipage du Scarab et les cristaux/cerveau du Nihilanth, avec leurs adaptations. Les règles existantes de visibilité, équipe et déverrouillage s’appliquent toujours ; les missions verrouillées proposent leur briefing sans permettre le départ. Campagne OC, actes annexes, arcs, fusions et épreuves gardent leurs catégories.

## Limites visuelles et prochaines corrections

Aucun bitmap n’est installé ni certifié 1:1 par ce lot. La génération du sprite Batman TDK a été refusée. Une candidate de décor du train Gears a été comparée aux captures Xbox 360 : ses motifs sont pertinents, mais sa caméra et sa géométrie sont adaptées, et son PNG natif ne respecte pas le contrat WebP. Elle reste locale.

Les **25 corrections visuelles P0** et **6 601 chemins d’assets absents** restent ouverts. Restent aussi le sauvetage et la fuite de Newt/Queen, les téléportations et invocations de Nihilanth, la caméra et la couverture originales de RAAM, le parcours urbain complet et les animations du Scarab, ainsi que la résolution de la malédiction dans la scène Pirates. Les incarnations précises et adaptations doivent continuer à être distinguées dans les données et dans les briefs.

## Vérification

Le prébuild complet a réussi : **1 021 tests Node, 15 commandes de tests**, audits d’assets et catalogues, puis build Vite. Les 111 cas du lot final ont ensuite passé une vérification ciblée, dont douze cas supplémentaires : catégorie de missions, consignes initiales des briefs FR/EN et IA Scarab aux statistiques originales. Le total unique validé atteint **1 033 tests**. Le lint et la recompilation Vite finale réussissent. La revue indépendante n’a trouvé aucun défaut P0/P1 dans les trois rencontres ; elle a confirmé une victoire Scarab avec Master Chief et ses statistiques originales. Le moteur RAAM termine les deux vagues avec le duo Marcus–Dom original, et le duel final solo sans grenades ; l’attrition de la mission complète solo demeure une limite explicite.

Le parcours navigateur sur le bundle final et la vérification HTTP du nouvel aperçu sont conservés dans la livraison locale avec leurs résultats et leurs limites. La branche de corrections et la PR nº 1 restent en brouillon ; l’aperçu n’est pas une promotion en production.
