# Métadonnées CG courantes et conservation de l’historique — 13 novembre 2026

Ce chantier corrige la description courante des sources et des images sélectionnées. Il ne génère aucune CG, ne remplace pas une image historique et ne valide aucun personnage en fidélité 1:1. Les déclarations de 1 436 livraisons, leurs révisions, fichiers, prompts et statuts restent strictement inchangés.

## Revan : distinguer le correctif courant de l’ancien visuel

Le moteur sélectionne désormais le correctif KOTOR I précisément enregistré dans `getReviewedQuarantinedHeroSprite`. La Bible et les candidats du plan reconnaissent ce chemin et son SHA exacts ; l’ancien PNG reste `OLD`, `archivalOnly:true` et `selectedInRuntime:false`. Le correctif porte `selectedInRuntime:true`, mais conserve `visualFidelityApproved:false`, `canonicalFidelityApproved:false` et `fullSource1to1Verified:false`.

L’amendement Revan vérifie intégralement trois objets : le sujet, son CG01 non produit et sa proposition de fond. Il refuse un autre hash, une autre édition, une approbation, un champ ajouté et toute transformation du CG01 en livraison. La proposition de lieu utilise la Forge Stellaire de KOTOR I ; elle n’hérite plus de Yavin/Épisode IV. Le résumé public Wikipédia gelé est une source textuelle de lieu, pas une preuve visuelle d’architecture ou de texture. Ces détails restent inconnus et à contrôler. La tentative GameBanshee refusée (403) est conservée dans `world-reference-access.json` ; aucune page refusée n’est revendiquée comme consultée.

## Deux amendements supplémentaires, fermés

Le plan publié `docs/cg/roster-production-2026-10-18.json` reste un instantané historique de 36 982 763 octets, SHA-256 `ce0e0a87c4308f39207b550721b94a1c6cd117775be853ba93f2336863b6132e`. Ses trois anciens amendements gardent leurs pins. Il n’a pas été réécrit depuis les nouvelles fiches de personnages.

Le diagnostic avec le producteur et les sources du commit `5952da0`, mais les documents du checkout courant, reproduit déjà 554 différences de disponibilité sur 58 sujets. Son premier inventaire de 49 chemins manquants était incomplet : l’examen des receipts du ledger retrouve aussi les portraits absents de Numa, Doros, Eira, Yrsa, Killa, Sumaq, Wei Long, Azael et Oona. Le contrat final vérifie donc 58 portraits distincts, totalisant historiquement 143 332 172 octets. Les rapports `baseline-5952-diagnostic.json`, `baseline-missing-reference-assets.json`, `baseline-vs-current-delta.json` et [availability/REPORT.md](./availability/REPORT.md) conservent le diagnostic initial et sa correction. Aucun lot de ces images n’a été hydraté pour dissimuler cette limite.

L’amendement de disponibilité contrôle les receipts, les fichiers de repli et chaque SHA, taille, format et dimension historiques. Une image réelle entièrement décodable permet la qualification historique exacte ; une absence, un pointeur LFS ou des octets non attestés ne permet que le repli négatif exact. Une future hydratation exacte reste donc autorisée. Une simple signature PNG/JPEG ou une page HTML ne vaut pas une image disponible. Les cinq CG01 non livrés concernés restent non produits. AURA-7 comprend en plus une correction restrictive distincte : un support Sonic de costume/CG13 ne peut plus servir d’autorité de visage, silhouette ou identité lorsque son propre portrait manque. L’ancien receipt et son usage de support sont conservés.

L’amendement `source64` ne permet que les champs constatés des 64 acteurs FF, Halo, Half-Life, Mass Effect, Quake et Unreal audités. Il vérifie 46 fichiers source figés au commit `b9e616b`, les 64 déclarations complètes de héros et les deux pilotes concernés. Il borne les textes d’identité, équipement, références, manques, thèmes courants et contextes de fond. Les métadonnées de 88 entrées et 88 propositions de fond ne prouvent pas que les images historiques ont été générées depuis ces nouvelles cibles. Les approbations restent pendantes. Une modification d’asset, de livraison, de récompense, de statut artistique, d’un champ hors liste ou d’un fichier source épinglé est refusée.

Pour Master Chief et l’Arbiter, l’autorité CG historique conserve sa continuité et ses verrous. Son équipement structuré est inconnu lorsqu’il manque dans cette autorité ; il n’est plus rempli depuis le héros runtime d’une autre version. Leurs références CG restent celles du pilote. Leurs incarnations, équipements et références runtime sont conservés séparément dans `currentRuntimeSource`, avec `authority:false`. La Bible ne déduit pas non plus le décor de cette autre version. Une arme mentionnée dans un prompt historique reste historique ; cela ne constitue pas une nouvelle revue de géométrie ou un équipement isolable approuvé.

Les projections sont composées après les anciens amendements, puis l’intégralité du JSON et du rapport Markdown doit reproduire exactement les anciens octets. Les projections ne gomment pas une mutation étrangère à leur périmètre. Les détails et inventaires des helpers parallèles figurent dans [source64/README.md](./source64/README.md) et [availability/REPORT.md](./availability/REPORT.md).

## Lecteur de références

`isCgReferenceImageAttested` vérifie les octets réellement lus, leur SHA et leur taille, puis envoie ce même buffer à un enfant Node exécutant Sharp sans shell ni chemin de charge utile. Le décodage complet utilise `failOn:error`, toutes les pages sélectionnées et des limites de 64 Mio / 33 554 432 pixels cumulés. Le cache suit le SHA réel et la longueur, jamais le seul chemin. Les dimensions et le format déclarés doivent correspondre au résultat. Cette attestation technique ne juge pas la ressemblance du personnage.

Le filtre d’usage exclut les marqueurs explicites costume-only / support-only / CG13 sans autorité d’identité ; il ne rejette pas arbitrairement les rôles inconnus. Les véritables références de Jack Sparrow et MEIKO conservant un usage d’identité ou de visage continuent de qualifier leur cible. Le receipt d’un support ne devient jamais une seconde référence indépendante par simple copie.

## Vérification et limites

Les scripts de test et les fichiers TAP voisins constituent les preuves exécutables. Les premières erreurs sont archivées : le refus global initial a conduit au diagnostic de disponibilité et aux contrats explicites, pas à une suppression des pins. `source-evidence-checkout-limitations.tap` conserve aussi trois échecs de médias réels non hydratés (Elara, groupe OC dont Jax, Seyra) : 18 des 21 tests y passent, dont les cas synthétiques d’usage, copie exacte, SHA et symlinks. Ces trois assertions de pixels n’ont pas été affaiblies.

Le CLI `--check` garde le producteur strict de médias réels. Le nouveau `--check-metadata` utilise explicitement l’API `metadata-only`, conserve `physicalMediaChecked:false`, contrôle les 1 436 déclarations de livraison et exige le hash historique intégral après amendements. Il ne prétend pas reconstruire ou vérifier tous les pixels absents. Les modes `--check`, `--check-metadata` et `--write` sont exclusifs ; un mélange ou un argument inconnu est refusé avant tout build ou écriture.

| Vérification exécutée | Résultat et périmètre |
|---|---|
| `current-metadata-check.json` | CLI réel `--check-metadata` vert sur le fixture final `source64` ; hash historique intégral intact et 1 436 déclarations préservées ; 58 pins de portraits absents, aucune image déclarée attestée. |
| [validation/cg-metadata-final.tap](../validation/cg-metadata-final.tap) | Runner intégré final piloté par root : 81/81 verts, dix fichiers, aucune modification des contrats après ce passage. |
| `integrated-cg-tests.tap` | 50/50 verts : producteur metadata réel, anciens pins, Revan, tamper et modes. Ce premier passage précède la dernière séparation des deux tableaux de références CG ; le CLI courant et les huit tests finaux source64 contrôlent cette dernière modification. |
| `source64/unit-tests.tap` | 8/8 verts sur le fixture final `89383d48…`, dont refus de fusionner les références runtime avec celles des deux pilotes. |
| `availability/final-standard.tap` | 8/8 verts : repli négatif, hydratation exacte future, corruption, mauvaises dimensions, AURA et mutations hors périmètre. |
| `reference-attestation-and-identity-tests.tap` | 9/9 verts : vrai décodage, hash/taille/dimensions/format, mutation du même chemin, distinction identité/support et rôles mixtes valides. |
| `reference-decoder-tests.tap` | 6/6 verts sur le décodeur final : PNG/JPEG valides, signatures seules, pixels tronqués, GIF animé et limites. |
| `final-pilot-and-cli-unit-tests.tap` | 7/7 verts sur la séparation finale des références et de l’équipement des pilotes, les modes et leurs conflits. |
| `cli-route-refusals.json` | Quatre véritables invocations CLI contradictoires ou inconnues sont refusées sans sortie de build. Les anciens fichiers sont ensuite remesurés. |
| `full-media-check.stderr.log` | Refus strict attendu, exit1 : asset CG réel absent `/cg/nexus-de-convergence/player-anchor/character-solo-openai-v1.png`. Le contrôle média ne se rabat pas sur le contrôle metadata. |
| `bible-check.stdout.log` | Bible seule régénérée puis `--check` intégral vert : 1 912 sujets / 28 680 emplacements. JSON courant : 42 625 605 octets, SHA `8e8578e0353c067154292c47664f78436350d6b46dc430c4df1033165e2c6edb`. |
| `final-pilot-bible-tests.tap` | 2/2 verts : lecture de la vraie Bible courante, avec édition/équipement/références CG séparés du runtime et aucune qualification de l’autre version. |
| `bible-current-three-subjects.json`, `bible-regeneration-after.json` | Extraits bornés Revan/Chief/Arbiter, contrôle de toutes les approbations artistiques toujours fausses et remesure du Plan et des trois anciens pins inchangés. |

Le décodeur Sharp a également passé ses six tests dédiés (PNG/JPEG valides, signatures seules, données tronquées, GIF animé de deux pages et dépassements de limites). Sa lecture ne certifie pas la ressemblance. Les suites et le CLI metadata ne sont pas un export DLC complet de médias.

La première exécution de la Bible a refusé avant toute écriture : une ancienne assertion interne exigeait encore MA40 comme équipement structuré du pilote Chief. Son reçu est conservé dans `bible-regeneration-before-pilot-assertion-fix.stderr.log`. L’assertion exige désormais exactement le contrat corrigé des deux pilotes (équipement inconnu, édition CG préservée, déclaration runtime distincte sans autorité), également vérifié par le nouveau test dédié de la Bible réelle. Aucun autre garde n’a été retiré.

Ce chantier ne clôture aucun P0 artistique global et n’ajoute aucune approbation 1:1. Les sources manquantes, l’équipement CG inconnu et les revues de ressemblance restent des tâches ouvertes.
