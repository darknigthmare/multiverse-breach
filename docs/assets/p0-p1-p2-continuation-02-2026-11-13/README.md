# Reprise 02 — personnages, animations, tactique et menus

Cette passe reprend `98991b161` et suit [quatre lots disjoints de 40](reservations.json), soit 160 identités réservées. Deux lots traitent les contrats Gears/Dead Space et Portal/Left 4 Dead ; les deux autres reprennent les rasters manquants et les présentations. Réserver une identité ne signifie pas terminer son dessin, ses costumes et ses animations.

## Changements réellement livrés

- **Gears/Dead Space, 40 acteurs** : versions, équipement et références individuels ; les noms bruts rejoignent les actions déjà résolues. Les 60 profils préparés, les actions RPG et les 15 supers mêlée sont comparés avant/après. Hammond utilise bien le SWS Motorized Pulse Rifle ; le 211-V est un Plasma Cutter. Les anciens plans d’illustration restent inchangés. Les variantes de rencontre non établies restent ouvertes. [Rapport](gears-deadspace-040/README.md).
- **Portal/Left 4 Dead, 40 acteurs** : corps, machines, hazards et enregistrements sont distingués. PotatOS et l’écho de Cave Johnson ne lancent plus de dégâts inventés. Quatre renforts Nexus gardent Chell comme porteur, avec une garde à zéro dégât plutôt qu’une tourelle forcée ; consommation et nettoyage sont exécutés dans le vrai RPG, sur les deux camps. Bill et trois entités sans équivalent établi restent explicitement ouverts. [Rapport](portal-l4d-040/REPORT.md).
- **Imp et Mancubus classiques** : deux vrais PNG issus d’Image Gen, **32 poses ordinaires nouvelles** au total, raccordés aux acteurs existants de Doom (1993) et Doom II (1994). Transparence, baseline, cellules et échelle sont vérifiées ; GameCanvas exerce la boule de feu, la salve de six contacts, la jauge et la réception des dégâts. Ces bases de quatre états ne sont pas des manifestes Mêlée45. [Imp](raster-lot-004-resume/imp-fireballer/README.md) · [Mancubus](raster-lot-004-resume/mancubus-flame-tank/README.md).
- **Revan et fins de combat** : trois clips utilisent seulement le correctif autorisé de 16 poses. La victoire ne prend plus une ligne de l’ancien atlas W13 de 32 cellules, qui se rabattait sur la réaction d’impact. Les combattants K.O. gardent leur dernière pose de défaite pendant la sortie. Les alias contradictoires ne réactivent aucun bitmap. [Présentations](presentation-040/README.md).
- **Batman 2008** : la revue confirme que son ancien PNG représente un civil à lunettes, sans cagoule, cape ou Batsuit. Le corps et le portrait sont bloqués pour cette identité précise et indiquent `ART PENDING` ; le fichier reste archivé. Aucun nouveau dessin ni P0 terminé n’est déduit de cette protection. [Inspection](presentation-040/batman-quarantine/inspection.json).
- **Extinction** : les consumers reconnaissent les gardes et soutiens déclarés, avec **107 actions auparavant ignorées** rétablies, dont 45 pertes nouvelles et 62 antérieures. Seize liaisons d’armes exactes conservent ou corrigent le hitscan et les munitions ; énergie, roquettes et soutiens restent distincts. Les différences de réduction/durée de garde sont documentées comme valeurs de l’adaptation. [Rapport](validation/EXTINCTION-CONSUMER-REVIEW.md).
- **Portal 2 en Tactics** : vrai secteur dédié avec galerie, puits de maintenance, escaliers et deux objectifs superposés. Trois matières sont dessinées par face ; le panneau de terrain ne recouvre plus les HP ni la barre haute compacte. L’inventaire atteint **24 terrains verticaux et 55 matières**. [Secteur et contrôles](tactics-aperture/README.md).
- **Répertoire des missions** : recherche bilingue sans accents, filtres, pagination des routes longues, raisons de blocage visibles, commandes clavier et lecture jusqu’à 200 % dans le périmètre testé. IDs, accès, ressources et callbacks de lancement sont conservés. [Parcours](menu-next/README.md).
- **Métadonnées CG** : 31 cibles de héros, 45 entrées et 45 propositions de fond sont raccordées aux contrats courants ; Batman distingue le bitmap rejeté de la cible. Un amendement fermé préserve le plan historique complet, ses anciens pins et les 1 436 déclarations de livraison. La Bible est régénérée séparément ; aucune CG nouvelle n’est produite. [Contrats CG](cg-metadata/README.md).

## Comptage indépendant

L’[audit](audit/README.md) exporte réellement le checkpoint `82a1f0035af46b85aac479a8a530963a28cfb219`, avec les 4 937 identités et l’arbre Git complet des médias. La [continuité vers 3b892a7](audit/checkpoint-82a1f003/final-continuity-3b892a7.json) vérifie 3 872 sources identiques et une exception FPS explicite. Ce consumer n’appartient pas à la fermeture des 1 974 modules du classement d’acteurs ; les données du ledger et les profils concernés sont conservés sans second export global.

| Mesure | Avant 98991b161 | Après cette passe |
| --- | ---: | ---: |
| Constats P1 ouverts | 16981 | **16734** |
| Constats P2 ouverts | 13506 | **13582** |
| Acteurs avec raster absent dans Git | 1473 | **1471** |
| Fiches avec noms bruts génériques | 1326 | **1309** |
| P0 visuels historiques | 22 | **22**, non reclassés |

Le [delta exact](audit/checkpoint-82a1f003/actor-task-delta.json) retire **248 P1 sur 77 acteurs** : 122 Gears/Dead Space, 118 Portal/Left 4 Dead et huit constats liés aux deux nouveaux rasters. La protection Batman ajoute un P1 de portée raster non résolue. Le solde est donc −247 P1. Aucun P2 source n’est retiré ; **76 revues de scène P2** sont ajoutées après déclaration des références. Ces revues restent à mener et ne sont pas masquées pour diminuer le compteur.

Le [ledger compressé](audit/checkpoint-82a1f003/actor-tasks.json.gz) et le [suivi des 160 réservations](audit/checkpoint-82a1f003/work-batches-40.json) gardent les codes encore ouverts. L’ancienne file de 124 lots, les 22 P0 et les six contrôles de refus sont inchangés. Aucun acteur complet ni art 1:1 n’est approuvé. Les champs conservateurs `newSpriteFiles:0` de l’exporteur décrivent ce qu’il produit lui-même ; les deux PNG réellement ajoutés ont leurs preuves séparées.

## Vérification et limites

Les [reçus et commandes](validation/README.md) distinguent tests de données, vrais moteurs, compilations et observations navigateur. Les plans historiques ne sont pas réécrits : les nouvelles éditions de catalogue et les deux corrections de texte Hammond passent des gardes fermées, avec refus des mutations hors périmètre. Les premières erreurs et les pilotes corrigés restent archivés.

La [continuité des médias](validation/asset-byte-lineage.json) vérifie les 19 583 anciens objets Git inchangés ; seuls les deux PNG Doom s’ajoutent. L’inventaire total est 19 585 ressources. Les compilations désactivent la copie globale des médias et le prébuild ; elles ne constituent pas un export de production assemblé. Le test historique C-Rex utilise un seul miroir temporaire issu du blob Git exact, puis nettoyé ; aucune génération ni hydratation massive n’a été faite pour le faire passer.

Les anciennes images en quarantaine, les 1 471 absences raster, les costumes, les phases d’animation non livrées et les scènes encore à comparer restent suivis. Les sources d’accès refusé ne sont pas présentées comme inspectées. Les adaptations tactiques, les gestes de présentation et les paramètres de combat ne sont pas des copies officielles à l’identique. La fidélité globale 1:1, la qualité AAA et l’achèvement de tous les P0/P1/P2 ne sont pas certifiés.
