# Réunir les lots DLC sur un volume de destination

Appliquer chaque lot transféré au même répertoire. La commande vérifie le SHA-256 du reçu communiqué à l’export et reprend les chemins canoniques sous `public/` et `DLC/<pack>/assets/`. Le volume doit accepter les liens physiques entre deux fichiers du même système de fichiers. La commande utilise un lien interne temporaire pour installer un fichier vérifié sans remplacer de fichier existant. Les médias assemblés restent indépendants des répertoires de transfert.

```sh
node scripts/applyDlcAssetBatch.mjs \
  --batch /volume/transfert/doom-batch-00022 \
  --receipt-sha256 cfcfe8c3954b960ce5ec642d2fffb4a867ee315111c1bd6ae9a98e46b58c8745 \
  --out /volume/medias-doom

node scripts/applyDlcAssetBatch.mjs \
  --batch /volume/transfert/doom-batch-00245 \
  --receipt-sha256 e43c6783d1893ba7a9abc0c034838ea5c8c651d1db058aa34502620e21569f1e \
  --out /volume/medias-doom

node scripts/applyDlcAssetBatch.mjs --check /volume/medias-doom \
  --expected-plan-sha256 03442fc32a3f538a95ed9f63f11aefea741ad4b114f0c348f9ab0c5677607e16
```

Le journal `.dlc-batches/` lie l’arbre au commit, au plan et au profil du premier lot. La commande inscrit le reçu avant de copier les fichiers. Elle enregistre la fin après vérification. Un nouvel appel avec le même lot contrôle les octets présents et copie ceux qui manquent. L’inscription exclusive départage deux ajouts concurrents. Un ajout qui perd cette inscription relit le journal pour traiter les collisions de chemin ou d’URL publique avant d’écrire ses médias.

Le contrôle relit les reçus locaux et les fichiers de l’arbre. Il expose les lots incomplets et les fichiers présents. Lancer le contrôle après les ajouts en cours pour obtenir un état stable. Une interruption brutale peut laisser un répertoire de travail dans le journal. La reprise s’appuie sur les reçus et les fichiers installés. La distribution complète d’une édition et sa compilation restent des étapes distinctes.

## Vérification réelle

L’assemblage a réutilisé les lots Doom `00022` et `00245`, soit **60 médias et 64 677 228 octets**, dans un répertoire temporaire hors du dépôt. Un fichier de test ajouté au dernier chemin de `00245` a bloqué l’intégration sans être écrasé. Après retrait de ce seul fichier, le contrôle a trouvé 59 médias en place et signalé `00245` incomplet. La reprise a copié un fichier et réutilisé les 35 autres. Le rejeu de `00022` a réutilisé ses 24 fichiers.

Le contrôle final et la relecture indépendante SHA-256 confirment les 60 médias. Les deux reçus d’origine sont conservés au même SHA-256. L’assemblage a utilisé exclusivement les sorties des deux lots. [Reçu de vérification](assembly-verification.json)
