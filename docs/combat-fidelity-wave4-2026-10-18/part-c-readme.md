# Piccolo et Kakashi — vague 4, partie C

Deux atlas natifs de 1 024 × 2 048 pixels, huit phases et quatre cellules transparentes de 256 pixels par phase : **64 poses distinctes**. Ordre : intro, outro, victoire de manche, défaite de manche, finale adaptée, victoire, défaite, super.

Piccolo garde sa peau verte, ses antennes, sa tenue violette et son Makankosappo : deux doigts au front pendant la charge, puis ki spiralé émis par ces doigts. Deux rangées natives correctives remplacent les effets trop longs de la première illustration. Elles utilisent un rayon court pour préserver la lisibilité du corps ; la portée de gameplay appartient au moteur.

Kakashi est la version de guerre avant double Mangekyo : masque, cheveux gris, gilet vert et un Sharingan découvert pour Kamui. La distorsion est spatiale, sans Susanoo, second Sharingan ou rayon électrique de Raikiri. La première source avait sept rangées réelles : quatre nouvelles poses de finale ont été dessinées séparément. Le mapping explicite préserve ses 28 autres poses.

Les quatre sources, leurs prompts et références sont archivés dans [part-c-provenance.json](part-c-provenance.json). Les choix de version et limites sont décrits dans [part-c-source-facts.json](part-c-source-facts.json). Les deux contacts normalisés et toutes leurs poses ont été inspectés.

```sh
node scripts/buildCombatCharacterAnimationsWave4PartC.mjs --check
```

Le contrôle vérifie les vrais PNG, l’alpha, les marges de 10 pixels, les 64 hashes RGBA différents et les hashes des sources/références. Il reconstruit aussi chaque rangée native pour retrouver exactement le hash final de chaque atlas. Sharp découpe, normalise et assemble les dessins existants ; aucune pose n’est générée par du code.

Ces illustrations sont des adaptations. Les noms de modèle et identifiants de génération/job restent `null` car l’outil n’en a pas fourni. Aucune vérification réseau ou certification visuelle 1:1 n’est revendiquée.
