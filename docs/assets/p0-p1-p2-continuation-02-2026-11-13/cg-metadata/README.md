# Cibles CG courantes : 31 héros et quarantaine Batman

L’amendement ajoute un contrat fermé aux projections historiques existantes. Il ne régénère pas le plan de production de 37 Mo, ne modifie aucune des 1 436 déclarations de livraison et ne crée aucune CG. Les métadonnées de cible courante ne prouvent pas qu’une image historique a été produite depuis la nouvelle source.

Le contrat couvre exactement les quinze héros Gears of War / Dead Space et seize héros Portal / Left 4 Dead des lots voisins. Il épingle les déclarations complètes de ces 31 héros et de Batman, ainsi que **17 fichiers source** du checkpoint `5baaae27bf23b845a5056eeab3c95fbe7b0d234e`. Les octets de ces fichiers ont été mesurés avant et après le vrai producteur, puis comparés aux blobs Git du checkpoint : aucun changement pendant la capture. Les futurs commits de documentation ne doivent pas avoir le même HEAD ; les contenus épinglés restent, eux, stricts.

Le raw de l’API metadata-only est conservé dans `/tmp`, sans nouvelle copie canonique. Son [inventaire de différences](./delta-summary.json) et le [diff sémantique compressé](./semantic-delta.json.gz) constatent 340 feuilles modifiées par rapport au dernier raw positif : exactement ces 31 héros et Batman, sans autre acteur ni modification du résumé. Les [pins de capture](./capture-inputs.json) conservent les SHA et la limite `physicalMediaChecked:false`.

## Périmètre autorisé

Pour les 31 héros, seuls six champs d’identité sont admissibles : incarnation, verrou descriptif, équipement, références, manques et note d’adaptation. Le contrat borne aussi la source de thème CG01, les trois champs d’entrée `themeSource`, `themeContinuity`, `missing`, et le seul `characterContext` des propositions de fond. Il vérifie 45 entrées et 45 fonds ; ce sont des objets contrôlés, pas 45 nouvelles images. Toute valeur autorisée différente du fixture fermé est refusée. Après restauration de ces champs, chaque objet entier doit être identique au publié : un statut, asset, prompt livré, récompense, génération, révision, approbation ou champ supplémentaire ne peut être effacé ou accepté par cette projection.

Batman reste un cas négatif séparé. L’amendement vérifie son incarnation runtime exacte et le véritable gate `getQuarantinedCanonSprite`, exige une sélection de sprite vide (`''`, contrat réel du getter), et atteste les octets/dimensions/décodage du PNG rejeté conservé comme archive. Le sujet et le seul message manquant de son CG01 non produit changent ; son fond CG01 reste intégralement inchangé et constitue le troisième objet contrôlé. Ses CG02/CG03 déjà livrées restent hors de cette projection et sous les gardes historiques complets. Aucun masque, costume ou correctif d’image nouveau n’est prétendu livré.

L’unique hook intervient **après** les projections historiques 604 candidats / 211 descripteurs, source64 et disponibilité58, puis la sérialisation complète et le rapport doivent encore reproduire le plan historique `ce0e0a87c4308f39207b550721b94a1c6cd117775be853ba93f2336863b6132e`. Le contrôle des 1 436 livraisons précède toujours ces projections. Les six anciens fixtures et leurs empreintes restent inchangés ; le correctif Revan reste contrôlé par son propre amendement.

## Vérifications

- [77/77 tests](./unit-tests.tap), zéro skip : vrai producteur et validateur historique complets, projection sans mutation et sérialisation exacte, champs autorisés altérés, statuts/assets/approbations/récompenses refusés, protections de Batman et du CG01, mutation hors cohorte conservée puis rejetée, 32 déclarations runtime altérées et chacun des 17 fichiers source modifié.
- Lint des trois scripts : zéro erreur et zéro avertissement.
- Revue indépendante de code par l’agent `p1_metadata_lot` : aucun blocage trouvé sur le bornage ou les protections d’historique. Cette revue ne prétend pas inspecter les pixels ni certifier le pipeline média complet.
- [CLI réel `--check-metadata`](./current-metadata-check.json) : sortie 0, portée explicitement metadata-only, `physicalMediaChecked:false`, 1 436 livraisons et hash historique intégral conservés après tous les amendements.
- Bible seule régénérée, puis [son `--check` intégral](./bible-check.stdout.log) et [les deux tests des pilotes](./bible-pilot-tests.tap) verts. Le JSON courant mesure 42 680 470 octets, SHA `8acbf883127f01df3932364bf94de0ad592a4c58b67f1e29482909442b295e3d`.
- [Probes bornées de la vraie Bible](./bible-bounded-probes.json) : Batman reste OLD/non sélectionné ; son CG02 déjà généré reste historique et sans approbation artistique. Les deux IDs Hammond conservent le SWS et le RIG 2008 ; PotatOS conserve sa batterie, son optique et ses câbles. Leurs CG02 restent `needs-theme/reference`, sans image nouvellement livrée. Les 1 912 états `readiness.visualFidelityApproved` restent faux.
- [Mesures après régénération](./bible-after.json) : plan publié, rapport et six anciens fixtures strictement inchangés ; aucun autre manifeste canonique réécrit.
- Validation intégrée finale : [`npm run test:cg:metadata`](../validation/cg-metadata-full-final.json) **158/158**, puis [quarantaine et Bible](../validation/cg-quarantine-bible-full-final.json) **7/7**, sans échec ni skip. Les 113 fichiers contrôlés conservent leurs SHA avant/après chaque passage ; les TAP complets sont conservés à côté des deux reçus.

Le premier passage est conservé dans `unit-before-empty-selection-contract.tap` : 73/77. Quatre assertions atteignaient la même erreur dans le nouvel amendement, qui attendait `null` alors que le getter de sprite retourne exactement `''` en l’absence de source. L’assertion a été corrigée vers ce contrat exact ; aucune URL n’est acceptée et aucun guard runtime ou ancien pin n’a été assoupli.

Les références physiques manquantes restent manquantes. Les restrictions d’usage de costume, l’attestation Sharp et les replis négatifs du tour précédent restent inchangés. Ce chantier n’ajoute aucune approbation artistique ou source 1:1 et ne clôture aucun P0 visuel global.

```sh
node --max-old-space-size=2048 --test --test-concurrency=1 scripts/cgContinuation02MetadataAmendment.test.mjs
node --max-old-space-size=2048 --loader ./scripts/sourceSceneTestLoader.mjs scripts/buildCgRosterProductionPlan.mjs --check-metadata
```

Les exécutions documentées utilisent Node 22 et CPU 0–1. `--check` conserve son exigence de médias réels ; le mode `--check-metadata` est explicite et ne remplace pas ce contrôle physique.
