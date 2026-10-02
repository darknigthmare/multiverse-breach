# Sprites PNG — 2 octobre 2026

Neuf planches PNG transparentes sont générées à partir des portraits originaux du projet et installées aux chemins effectivement demandés par le moteur. Elles contiennent 144 poses : quatre images pour chacun des états repos, course, attaque et impact. Les fichiers finaux font 1 024 × 1 024 px, avec seize cellules de 256 × 256 px.

Le lot comprend Helix Warden, Debt Repossession Drone, Springblade Automaton, Brass Constable, Myrmidon d’ombre, Serpent des dunes, Sangsue de rêve, Isotope Mite et Archimage Zéro. Les identités, palettes et équipements ont été comparés à leurs portraits ; la revue retient une proximité avec ces références. **Le 1:1 exact n’est pas certifié.** Aucun sprite CSS ne fait partie de la livraison.

Les silhouettes et équipements complets sont séparés avec une marge transparente. Le reconditionnement utilise la même échelle pour les seize poses d’un personnage ; il conserve les pixels visibles avant redimensionnement et leurs couleurs RGBA, et enlève seulement le bruit presque transparent éloigné des silhouettes. Les pieds varient au plus d’un pixel dans la planche finale. Les PNG bruts, références, prompts exacts et preuves de génération restent conservés dans le dossier de travail privé ; le manifeste public contient leurs empreintes utiles.

Le navigateur a vérifié les vrais appels du renderer : neuf PNG décodés, 144 cellules distinctes et 288 dessins dans les deux orientations, en desktop et mobile, sans canvas vide ni erreur JavaScript. Les 17 tests du pipeline, le lint et l’audit des neuf PNG passent. Le build complet passe : 1 364 tests dans 16 groupes, sans échec ni annulation, tous les audits requis et la compilation Vite. L’aperçu Vercel est vérifié séparément après publication du commit ; sa preuve est conservée avec les livrables.

L’inventaire initial comptait 1 705 fichiers de personnages absents : 910 ennemis et 795 boss. Après ce lot, **1 696 restent absents** : 902 ennemis et 794 boss. Aucun fichier de héros ne manque physiquement ; cette présence ne valide pas leur fidélité visuelle. Les 171 absences OC restantes disposent de portraits locaux ; les treize candidats de héros au même nom restent à examiner et ne sont pas aliasés automatiquement.

- [Inventaire complet et baseline](missing-character-images-2026-10-02.json)
- [Manifeste des neuf PNG et de leurs références](referenced-character-png-wave-2026-10-02.json)
- [Rapport de livraison](character-png-delivery-2026-10-02.json)

Vérifier le lot installé :

```bash
npm run test:character-png
npm run sprites:characters:audit
node scripts/missingCharacterImageInventory.mjs --summary
```

Installer un nouveau lot de PNG déjà créés avec `image_gen` :

```bash
bash scripts/install-missing-character-images.sh \
  --manifest /chemin/prive/nouveau-lot.json \
  --public-manifest docs/audits/nouveau-lot-png.json \
  --inventory-dir /chemin/prive/resultats
```

Cette commande effectue l’inventaire, la validation, l’installation du lot entier et l’audit. Elle refuse les fichiers déjà présents, les cellules vides ou tronquées et les références dont les empreintes ont changé. La génération des illustrations se fait avec l’outil image ; Bash assure leur installation et leur suivi.
