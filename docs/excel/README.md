# Suivi Multiverse Breach — R8, 24 octobre 2026

## Nouveau : les costumes se débloquent dans les boosters correspondants

Le commit [`9db09276`](https://github.com/darknigthmare/multiverse-breach/commit/9db0927673ebc792435dbfa996d96cc54d279bb7) raccorde les 19 871 droits du catalogue de costumes au véritable écran de boosters, à l'inventaire et au vestiaire.

Une ouverture réussie garde ses cinq cartes et son prix, puis ajoute gratuitement un droit encore manquant du pool correspondant. Pas de doublon de droit ; pool terminé, pas de compensation supplémentaire. Les crédits gratuits fonctionnent également. Univers exact du porteur, distribution exacte des chapitres OC, filtres administrateur et route multivers sont respectés.

**Débloqué ne signifie pas graphiquement produit ou équipable.** Aucun nouveau sprite ni aucune approbation 1:1 n'est ajouté. Les anciennes palettes et trois effets au sol sont conservés séparément. Un droit ne débloque pas son personnage et ne change pas ses statistiques ou capacités.

- [Rapport R8 complet](BOOSTERS_COSTUMES_R8_2026-10-24.md)
- [Preuves et empreintes R8](evidence/wardrobe-boosters-R8.json)
- [Correspondances des pools officiels et des chapitres](exports/booster-costume-routes-R8.csv)
- [Exporteur complet des acteurs, droits et 530 routes](../../scripts/exportWardrobeBoosters.mjs)

[Validation dédiée 40122568710](https://github.com/darknigthmare/multiverse-breach/actions/runs/40122568710) réussie : 871 tests Node, lint ciblé, compilation Vite des sources et cinq parcours Chromium de l'écran réel dans une fixture isolée. Les images sont de secours, le prébuild intégral n'est pas exécuté et aucune partie Vercel complète n'est revendiquée. Les onze fichiers publiés correspondent aux blobs testés.

## Versions des classeurs

**Les XLSX historiques du dépôt restent R1.** Les classeurs R4–R7 ont été livrés dans la conversation. Le complément R8 y est également livré, avec sept onglets : synthèse, boosters, acteurs, variantes officielles, règles, vérifications et sources. Les 19 871 identifiants exhaustifs sont fournis en JSON/CSV dans le pack ; le XLSX reste compact et ne prétend pas lire la sauvegarde du joueur.

Le code, les rapports, les preuves et les exports texte de R8 sont publiés ici. Le nouveau binaire Excel n'est pas déclaré poussé et le pack R8 n'est pas une archive du jeu complet.

- [Audit fidélité — R1 historique](Multiverse_Breach_Audit_Fidelite_1a1_Priorites.xlsx)
- [Suivi combats RECONSTITUÉ — R1 historique](Multiverse_Breach_Suivi_Combats_RECONSTITUE.xlsx)
- [Archive du tout premier audit](archives/Audit_Fidelite_ancien_6fd4fd24_OBSOLETE.xlsx)

Le catalogue original `multiverse_breach_catalog_lore_UPDATED.xlsx` demeure non retrouvé. Le suivi des combats reste RECONSTITUÉ, pas présenté comme sa restauration.

## Travaux précédents conservés

- [R7 : 14 variantes et revue avec preuves](COSTUMES_R7_2026-10-24.md) — 64 designs officiels, 67 associations sur 24 identités ; recherche non liée séparée et aucun costume sans graphismes activé.
- [R6 : extension du vestiaire](COSTUMES_R6_2026-10-24.md) — collection Commando, recherche FR/EN, concepts sur mesure et contrats de production.
- [R5 : vestiaire initial](COSTUMES_R5_2026-10-24.md) — fiches héros/archives adverses, concepts communs, trois effets de sol et palettes historiques. Le run historique R5 restait en échec après publication ; ne pas le confondre avec le nouveau run R8 réussi.
- [R4 : Sulaco, Narcissus, Blast Pit jouables](STAGES_JOUABLES_R4_2026-10-24.md) — progression contextuelle, dangers et verrouillage d'incarnation ; graphismes et architecture partiels.
- [R3 : corrections de l'audit](REPRISE_MANQUANTS_R3_2026-10-24.md), [R2 : recontrôle](RECONTROLE_R2_2026-10-24.md), [preuves R1](evidence/versions-2026-10-24.json).

## Compteurs et limites

4 936 acteurs, 525 univers, 3 206 stages ; R8 n'ajoute aucun acteur ni stage. Les 19 871 droits comprennent 67 associations officielles et 19 804 associations originales : quatre briefs communs × 4 936 acteurs, plus 60 concepts sur mesure. **Ce ne sont pas des milliers de nouveaux dessins.** Les routes du multivers et des boosters ciblés se recouvrent.

Les 22 P0 visuels, 1 477 rasters adverses absents et la couverture incomplète des signatures de combat restent ouverts. Les droits d'acquisition ne les réparent pas. La recherche officielle pour les autres identités reste à poursuivre.

Aucun merge ni déploiement de production effectué. Les anciennes preuves Vercel ne sont pas présentées comme rejouées. La présence d'un fichier, d'un droit débloqué ou d'une source officielle ne constitue pas une certification artistique 1:1.
