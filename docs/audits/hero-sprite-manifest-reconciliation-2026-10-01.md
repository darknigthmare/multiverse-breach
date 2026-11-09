# Réconciliation de disponibilité des sprites de héros — 1 octobre 2026

Le manifeste du 25 août signalait **670 sprites de héros absents alors que leurs fichiers avaient été installés depuis**. Le Hub filtre les entrées du manifeste sur `available` avant de déclarer un sprite prêt : cette divergence avait donc un effet dans l'application.

La réconciliation a vérifié les 1 101 derniers enregistrements de provenance de héros. Chaque preuve doit correspondre à l'identité et au chemin du catalogue existant, au SHA256 du prompt catalogue, au SHA256 du prompt effectivement envoyé pour les enregistrements v2, au fournisseur et à l'identifiant de génération enregistrés, et au SHA256 et aux dimensions RGBA du PNG installé. Un dernier enregistrement invalide ne peut pas être remplacé par une ancienne preuve valide. Le fichier image, le catalogue de prompts et le ledger historique restent inchangés.

| Indicateur du manifeste | Avant | Après |
| --- | ---: | ---: |
| Héros déclarés disponibles | 1 242 | 1 912 |
| Héros déclarés absents | 670 | 0 |
| Héros avec provenance vérifiée | 267 | 1 101 |
| Ensemble des entrées déclarées disponibles | 4 852 | 5 522 |
| Ensemble des entrées déclarées absentes | 3 263 | 2 593 |

670 faux absents sont rétablis et 164 autres provenances déjà présentes sont rafraîchies. Les 811 héros présents sans enregistrement de génération restent `legacy-openai-declared`. Les entrées des autres familles sont conservées ; leurs compteurs d'absence ne sont pas une nouvelle inspection de leurs fichiers.

**Une preuve de génération ne valide pas la fidélité 1:1.** Les 834 entrées modifiées portent explicitement `visualReviewStatus: "pending"`. Plusieurs prompts réellement envoyés décrivent des personnages originaux de remplacement, dont les P0 déjà identifiés : la présence d'un PNG et sa provenance ne les rendent pas fidèles. La liste P0 et la revue de l'incarnation, du costume, de la silhouette et des références visuelles restent nécessaires. Cette opération ne certifie aucun personnage et ne remplace aucun visuel.

Le script contrôle les preuves contre le catalogue de prompts archivé ; il ne réécrit pas les prompts pour correspondre aux modifications récentes des kits de héros. Le rapport [JSON détaillé](hero-sprite-manifest-reconciliation-2026-10-01.json) conserve les SHA256 des entrées initiales et des sources, ainsi que chaque changement de provenance.

Commandes :

```sh
node scripts/reconcileHeroSpriteManifest.mjs --check
node scripts/reconcileHeroSpriteManifest.mjs --write
node --test scripts/reconcileHeroSpriteManifest.test.mjs
```

`--check` est strictement en lecture et échoue si le manifeste diverge ou si une preuve est invalide. `--write` refuse toute écriture lorsqu'une preuve échoue. Une seconde réconciliation conserve le même manifeste et la même date d'audit. Les 14 tests couvrent les faux absents, les preuves récentes, les fichiers manquants ou modifiés, les prompts altérés, les erreurs d'identité et de géométrie, ainsi que l'absence de certification 1:1.
