# Vague 6 — 500 identités de dossiers, production contrôlée

Cette vague sélectionne **500 identités**, pas 500 images terminées ni 500 prompts dont la fidélité aurait été validée. Son constructeur ne génère aucune image, n'appelle aucune API et ne modifie ni la baseline historique ni les manifestes Wave 5.

## Périmètre initial

- Snapshot contrôlé : 3 199 dossiers, 994 disponibles, 2 205 en attente.
- Sélection dans l'ordre du catalogue canonique : 309 `expanded`, puis 191 `arc-personnage`.
- Première identité : 34421, Dynamic Weather Extraction. Dernière : 9469.
- 486 sorties absentes et 14 remplacements explicites de fichiers dont l'ancien prompt ne correspond plus au prompt canonique.
- Remplacements : 9210, 9211, 9212, 9214, 9216, 9217, 9220, 9222, 9223, 9225, 9226, 9229, 9230, 9231.

Les preuves historiques de ces 14 fichiers sont conservées telles quelles : image SHA-256, prompt SHA-256, identifiant réel de génération. Certains anciens enregistrements ne contiennent pas le texte du prompt ; son absence n'autorise pas à le reconstituer ou à réétiqueter l'ancienne génération avec le prompt actuel.

## Construction et reprise

Depuis la racine du dépôt, après accord sur les prompts initiaux corrigés :

```powershell
node scripts/buildRiftDossierBatch500Wave6.mjs --write
node scripts/buildRiftDossierBatch500Wave6.mjs --check
node scripts/buildRiftDossierBatch500Wave6.mjs --status
node --test scripts/riftDossierBatch500Wave6.test.mjs
```

Le premier `--write` produit le manifeste dédié et ses 500 fichiers de prompt verbatim, sans BOM ni saut de ligne ajouté. Les appels suivants réutilisent les mêmes fichiers, sans les supprimer ni les écraser. Une divergence provoque un échec explicite.

Après une installation partielle, **ne pas appeler `createBatch()` pour reconstruire une sélection**. Le nombre de dossiers disponibles a changé : cette reconstruction est volontairement refusée. Les commandes CLI relisent le manifeste figé et inspectent ses mêmes 500 identités. Un fichier sans preuve, une preuve sans fichier ou une provenance ambiguë est bloquant, pas une installation réussie.

## Installation technique et revue visuelle : deux états distincts

`--status` présente la production technique (`pending`, `replacement-required`, `installed`, `blocked`), la revue visuelle et un compteur `complete`. Un prompt, un PNG isolé ou même une installation techniquement cohérente ne suffit pas à incrémenter `complete`.

Avant génération, chaque sujet et chaque scène doivent être explicitement revus à partir de références identifiées. La politique `project-runtime-lore` signale des ancrages issus du jeu : elle **ne prouve pas une vérification indépendante du canon**. Ne pas lancer une génération massive à partir de ces seuls noms. Distinguer clairement canon de franchise et adaptation propre au projet.

Après génération, vérifier réellement le PNG : sujet et lieu, proportions, silhouette, caméra RPG, voie de combat, lisibilité miniature, absence de texte/interface et composition compatible avec le recadrage final. Une génération rejetée ne compte jamais comme terminée. Le journal humain détaillé est `docs/audits/wave6-visual-review-2026-08-31.md`.

Les décisions structurées sont enregistrées séparément dans `asset-batch-500-wave-6-visual-reviews.json`, dans ce dossier :

```json
{
  "schemaVersion": 1,
  "batchId": "assets-rift-dossier-pending-500-wave-6-2026-08-31",
  "records": []
}
```

Chaque décision contient `id`, `promptSha256`, `stage`, `status`, `reviewer`, l'heure réelle `reviewedAt` au format ISO et des observations concrètes `notes`. Les valeurs possibles de `stage` sont `subject-scene` et `raster` ; celles de `status` sont `approved` et `rejected`.

- `subject-scene` exige aussi `sources: [{ kind, reference, notes }]`. `kind` vaut `official-url` pour une URL HTTPS officielle de franchise ou `project-canon` pour une référence exacte du canon/adaptation du projet. Les notes précisent ce que cette source confirme.
- `raster` exige l'identifiant réel `generationId` de l'outil intégré (`exec-…`) et le SHA-256 `sourceSha256` du PNG effectivement inspecté.
- Une décision porte uniquement sur son identité et son prompt exact. Une modification de prompt invalide l'approbation précédente. La dernière décision pertinente du journal prévaut ; une revue de raster antérieure à la revue sujet/scène courante ne suffit pas.

Le constructeur ne fabrique aucune décision. `canGenerate` n'est vrai qu'après approbation du sujet et de la scène. Le contrat d'import refuse un PNG qui n'a pas ses deux approbations correspondantes. `complete` exige en plus l'installation vérifiée et une preuve liant ce même PNG source à la génération installée.

## Contrat d'intégration d'une image acceptée

Conserver le PNG brut de l'outil intégré, son identifiant réel et son prompt exact. Les fichiers rejetés ne doivent pas être importés. Après gel du manifeste et consignation des deux revues, appeler les exports du constructeur :

```js
const { artifact } = await validateBatchArtifact();
const install = await createInstallManifest(artifact, [
  { id: '34421', source: absoluteAcceptedPngPath, generationId: actualGenerationId }
]);
```

`createInstallManifest` est asynchrone et ne génère ni n'installe rien. Il lit le PNG pour contrôler le hash de la revue et renvoie le JSON attendu par `scripts/installRiftDossierThumbnailBatch.mjs`. Enregistrer ce résultat dans un fichier JSON d'import Wave 6 dédié, puis :

```powershell
node scripts/installRiftDossierThumbnailBatch.mjs --batch <chemin-du-plan-import-wave-6.json>
```

Le JSON contient `schemaVersion: 1`, `batchId`, `sourceBatchId`, `promptCatalogSha256` et les jobs : `sequence`, `sourceSequence`, `kind: "stage"`, `id`, `output`, `source`, `generationId`, `generationPromptFile`, `generationPromptSha256`, `catalogPromptSha256`, `replace` et le lien de revue. Le hash de contrat est calculé **sur les jobs de cet import**, pas réutilisé depuis l'ensemble des 500. La séquence d'un import partiel recommence à 1 ; `sourceSequence` conserve sa position dans la vague.

L'installateur existant doit produire un WebP RGB 640 × 360, recadré en `cover`, qualité 86, avec une preuve OpenAI cohérente. Vérifier le résultat final et ses canaux : le suivi Wave 6 refuse un WebP avec alpha. Conserver le PNG source même après installation, car la reprise de l'installateur vérifie encore son existence. Ne pas confondre l'heure d'installation avec celle de génération : préserver aussi la trace effective de l'outil.

Un seul opérateur écrit le ledger runtime à la fois. Les transactions sont atomiques par image et preuve, pas pour le lot entier. Un échec conserve la progression des jobs précédents ; relancer le même plan reprend ces identités et ne remplit pas la vague avec de nouveaux dossiers.

## Précautions supplémentaires pour les 14 remplacements

Avant import, archiver durablement l'ancien fichier et une copie du ledger d'origine, hors de leurs chemins runtime. Les sauvegardes transactionnelles internes à l'installateur sont supprimées après succès : elles ne constituent **pas** une archive durable.

Fournir au contrat :

```js
{
  id: '9210',
  source: absoluteAcceptedPngPath,
  generationId: actualNewGenerationId,
  replacementArchive: { image: absoluteOldImageBackupPath, ledger: absoluteOldLedgerBackupPath }
}
```

Les archives doivent correspondre aux hashes et à la preuve historique du manifeste et ne pas désigner les fichiers runtime par un autre chemin. Le constructeur exige un nouvel identifiant de génération ; le suivi exige aussi de nouveaux octets d'image. Une ancienne image avec un nouveau libellé de prompt reste bloquée.

## Correction ultérieure d'un prompt : révision explicite, jamais nouvelle sélection

Les 500 **identités et sorties** restent fixes. Leur premier jeu de prompts ne signifie pas que les 496 autres sujets ont passé une revue de fidélité. Une correction ultérieure du catalogue pour un job non installé est donc légitime, mais le contrôle courant échoue explicitement avec `Current catalog prompt drift <id>` ; il ne remplit pas silencieusement le manifeste et ne prétend pas que l'ancienne approbation est encore valable.

Cette situation demande une révision de production explicite et versionnée, sous tâche dédiée : conserver l'artefact et le prompt précédents comme trace, garder les mêmes 500 identités/sorties/baseline, modifier seulement le prompt du job non installé, enregistrer la justification et les nouveaux hashes, puis refaire sa revue sujet/scène et sa génération. L'ancien PNG et les anciens identifiants restent associés à leur vrai prompt. Un job déjà installé exige une décision de remplacement distincte avec archivage ; il ne peut pas être réétiqueté. Le constructeur courant n'offre délibérément aucun `--force` ni révision automatique.

Les tests couvrent notamment cette dérive bloquante, les doublons, les 14 remplacements, la conservation des 500 identités après installation partielle, les écritures idempotentes et l'impossibilité de conclure à une complétion à partir du prompt/PNG seuls.
