# Suivi Multiverse Breach — R4, 24 octobre 2026

## État actuel : trois stages intégrés en PR

La PR ne se limite plus à un audit. Le commit [`4c8f4b7f`](https://github.com/darknigthmare/multiverse-breach/commit/4c8f4b7f220a7808e7b849357deaf5771057344f) intègre **Sulaco, Narcissus et Blast Pit** dans le hub et le moteur Tactics, avec objectifs contextuels, commandes FR/EN, parcours manuel et automatique, décors procéduraux distincts et 83 tests.

- [Rapport R4 : contenu livré, tests et limites](STAGES_JOUABLES_R4_2026-10-24.md)
- [Suivi CSV des trois nouvelles scènes](exports/stages-jouables-R4-2026-10-24.csv)
- [Preuves et empreintes R4](evidence/source-scenes-R4.json)

**Aucun merge ni déploiement de production effectué.** Le master pris comme base est `5f44cf344d1a9fbb0dbd7c899510b7dd16cf25d6`. Les derniers contrôles Vercel conservés portent sur cette version, pas sur une partie hébergée des nouveaux stages.

## Attention aux versions des fichiers Excel

Les deux XLSX stockés ci-dessous restent les **binaires R1**, conservés pour ne pas perdre leur contenu. Ils **ne contiennent pas les ajouts R2, R3 et R4**. Les fichiers R4 complets sont livrés séparément dans la conversation ; leur empreinte figure dans le rapport R4. Le suivi texte/CSV de cette PR est plus récent que ces deux binaires.

- [Audit fidélité — binaire R1 historique](Multiverse_Breach_Audit_Fidelite_1a1_Priorites.xlsx)
- [Suivi combats RECONSTITUÉ — binaire R1 historique](Multiverse_Breach_Suivi_Combats_RECONSTITUE.xlsx)
- [Archive du tout premier audit, obsolète](archives/Audit_Fidelite_ancien_6fd4fd24_OBSOLETE.xlsx)
- [Export P0/P1 historique R1](exports/priorites-P0-P1-2026-10-24.csv)
- [Recontrôle R2](RECONTROLE_R2_2026-10-24.md)
- [Reprise et corrections de l'audit R3](REPRISE_MANQUANTS_R3_2026-10-24.md)

Le catalogue original `multiverse_breach_catalog_lore_UPDATED.xlsx` n'a pas été retrouvé. Le suivi des combats demeure explicitement **RECONSTITUÉ**, et non présenté comme sa restauration.

## Compteurs à ne pas confondre

La source initialement auditée contient 4 936 acteurs et 3 203 ID de stages. La branche R4 ajoute seulement trois scènes aux ID 50101, 50102 et 50103 : **3 206 stages dans la branche PR**, sans nouvel acteur de catalogue. Les familles PNJ, invocations, objets et variantes se recoupent ; ce ne sont pas des sprites uniques.

Dans l'Excel R4, acteurs + stages : **22 P0 / 3 564 P1 / 4 072 P2 / 484 P3**, soit 8 142 lignes. Les trois nouvelles scènes sont P1 de revue artistique. Les deux créations originales reclassées en R3 restent en revue interne. Aucun des 1 477 rasters adverses manquants signalés en R3 n'est déclaré réparé.

Le suivi technique des 4 936 acteurs reste : 4 650 signatures spécifiques non couvertes, 185 contrats partiels, 101 non-combattants et 148 supers mêlée renseignés. Les commandes des nouvelles scènes sont contextuelles : elles n'ajoutent pas 21 capacités globales au roster.

## Preuves historiques préservées

- [Versions R1](evidence/versions-2026-10-24.json)
- [25 PNG comparés à la production lors de la collecte initiale](evidence/sprite-production-checks.json)
- [Accueil Vercel ordinateur/mobile initial](evidence/browser-production-results.json)
- [Résumé R3](evidence/summary-R3.json)

Ces preuves ne sont pas présentées comme rejouées en R4. **Présence de fichier, test réussi et scénario jouable ne constituent pas une certification artistique 1:1.**
