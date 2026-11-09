# Classeur de suivi de la refonte

Le générateur écrit un seul fichier : `docs/excel/Multiverse_Breach_UI_Immersion.xlsx`.
Il utilise `@oai/artifact-tool` depuis le runtime installé et ne modifie aucune source du jeu.

## Reproduire

```sh
bash scripts/ui-immersion/build-workbook.sh --qa-dir /tmp/multiverse-workbook-qa
```

Les variables `CODEX_PRIMARY_RUNTIME_NODE` et `CODEX_PRIMARY_RUNTIME_NODE_MODULES` doivent désigner le Node et les dépendances du runtime d’artefacts installé. Le script copie le générateur dans un dossier temporaire pour résoudre cette dépendance, puis retire ce dossier. Aucune dépendance du runtime n’est ajoutée au dépôt.

Les entrées sont `docs/ui-immersion/audit-baseline.json`, les quatre fichiers `*-implementation.json` et `workbook-content.fr.json`. Ce dernier contient les destinations fonctionnelles et la traduction française fidèle du ledger combat. Les résultats éventuels de `validation.json` complètent les preuves ; ils ne réécrivent pas les observations de l’audit initial.

## Ajouter des preuves

Le manifeste facultatif peut prendre cette forme :

```json
{
  "metadata": {
    "commit": "SHA de la branche effectivement vérifiée",
    "prUrl": "https://github.com/darknigthmare/multiverse-breach/pull/…",
    "previewUrl": "https://…"
  },
  "checks": [
    {
      "id": "CI-01",
      "type": "automated",
      "status": "passed",
      "command": "commande réellement exécutée",
      "detail": "résultat et nombre de cas",
      "actionIds": ["APP-05"],
      "auditIds": ["26"],
      "evidence": "lien de run ou chemin de trace versionnée",
      "limitations": "portée exacte"
    }
  ]
}
```

Pour une observation de la nouvelle branche, utiliser `type: "browser"`, la liste précise `auditIds`, le statut observé et une preuve dans `evidence` (capture, trace ou URL de compte rendu). Un résultat navigateur sans preuve reste déclaré. Les anciennes captures du build `5f44cf34` ne doivent jamais être renseignées comme preuve de la branche.

Les captures d’un environnement CI utilisant des médias ou données de remplacement doivent porter `synthetic: true` (ou `type: "browser-synthetic"`). Elles sont consignées comme tests UI synthétiques, sans compter comme observation du jeu avec ses médias réels.

`actionIds` affirme que la preuve couvre ce lot. Pour une visite limitée à quelques écrans d’un lot plus large, fournir seulement `auditIds`. Les statuts automatiques sont liés aux lots explicitement documentés ; les résultats globaux sans correspondance demeurent dans Vérifications.

Les arguments `--pr-url`, `--preview-url` et `--commit` peuvent surcharger les métadonnées. Préférer le manifeste versionné pour une reproduction exacte. `--output` choisit le fichier de sortie et `--qa-dir` le dossier des rendus de contrôle.

## Contrôles intégrés

Le générateur garde les 40 fiches, contrôle les associations, exclut le lot transversal APP-08 de la couverture des écrans, recalcule les formules, modifie puis restaure un statut pour vérifier les dépendances, recherche les erreurs de formule et rend chaque onglet. `workbook-qa.json` consigne les résultats et les empreintes SHA-256 des entrées.

Le contrôle Python lit ensuite l’archive XLSX sans la modifier : erreurs de cache, cinq onglets, quatre tableaux filtrés, volets figés et listes de statuts. Les liens utilisent `IFERROR(HYPERLINK(...), libellé)` : Excel conserve ses liens natifs tandis que le moteur de rendu dispose d’un libellé de secours lisible.

La synthèse distingue code, tests et observations navigateur. Une couverture de code complète n’est pas une certification des parcours, des appareils ou des critères d’acceptation. La feuille Vérifications est un journal terminal de preuves : aucune formule de couverture ne dépend de cette feuille.
