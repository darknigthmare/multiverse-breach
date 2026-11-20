# Exporter une distribution depuis les lots assemblés

L’export peut lire le code et les inventaires dans le checkout source, puis prendre les médias dans un arbre assemblé situé sur un autre volume. Fournir le plan original et son SHA-256. L’export contrôle la couverture du plan, les octets assemblés et la concordance entre le profil choisi et les inventaires du checkout. Les médias peuvent rester absents du checkout. [Contrôle de couverture](../dlc-coverage/README.md)

```sh
npm run dlc:export:runtime -- \
  --profile /volume/config/profil.json \
  --out /volume/distribution \
  --media-assembly /volume/medias-assembles \
  --media-plan /volume/plan.json \
  --media-plan-sha256 EMPREINTE_DU_PLAN
```

Les entrées source figées par le plan doivent correspondre au checkout. Les chemins des médias, leur attribution au pack et leurs URL publiques restent ceux de l’inventaire de distribution. L’export retient les contrôles de copie et produit le reçu ordinaire. La destination doit accueillir la distribution indépendante et, si le build est lancé, son répertoire `dist`.

La commande réelle a refusé l’assemblage Doom à **2 lots sur 317** avant de créer la sortie. Trois lots supplémentaires ont ensuite été exportés et assemblés depuis les blobs Git locaux. Le nouvel assemblage couvre **5 lots sur 317** et **168 médias sur 7 693**. Les 108 nouveaux médias incluent 20 ressources privées de Doom. Le contrôle strict de la distribution refuse encore la sortie, avec 312 lots absents. Les répertoires assemblés restent sur le volume temporaire. [Premier contrôle](doom-incomplete-export.json) · [Reçu des trois nouveaux lots](coverage-three-batches.json)

Une édition synthétique de petite taille a exercé l’autre branche avec deux PNG réels du dépôt. Le script a assemblé le favicon et le sprite Noble Six, puis a retiré leurs deux copies du checkout de test. L’export depuis l’assemblage a produit un reçu identique à celui de l’export ordinaire. Le build Vite a publié les deux PNG aux mêmes octets et inclus le module du pack sélectionné. Les deux fichiers étaient toujours absents du checkout après le build. La livraison de l’édition Doom complète reste ouverte. [Résultats et empreintes](verification.json)
