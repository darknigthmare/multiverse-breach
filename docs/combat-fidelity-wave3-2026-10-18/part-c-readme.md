# Final Fantasy XV — illustrations natives, vague 3, partie C

Cinq atlas de 1 024 × 2 048 pixels livrent 160 poses natives distinctes, sur huit rangées de quatre cellules transparentes de 256 pixels. Ordre : intro, outro, victoire de manche, défaite de manche, finale adaptée, victoire, défaite, super.

| Personnage | Version et équipement retenus | Super adapté |
| --- | --- | --- |
| Noctis | Jeune Noctis avant le saut de dix ans, tenue Crownsguard noire, Engine Blade et armes royales spectrales | Armiger |
| Gladiolus | Chemise noire ouverte, tatouages et grande épée physique à deux mains | Dawnhammer, frappe descendante d’épée |
| Ignis | Avant Altissia, voyant, lunettes claires, costume et deux dagues | Overwhelm, geste de commandement et sa portion de l’assaut coordonné |
| Prompto | Jeune homme blond, gilet noir sans manches, tissu rouge à la hanche et pistolet | Trigger Happy, rafale balistique condensée |
| Lunafreya | Chignon blond et longue robe blanche de la référence locale, mains vides | Oracle’s Blessing, soutien et soin des alliés |

Les cinq références ont été vues avant génération. Les sept sources natives et les cinq planches normalisées ont été inspectées. La finale de Lunafreya reste une bénédiction non violente, sans arme, projectile offensif ou exécution. Le nom Oracle’s Blessing décrit ici le soin de groupe du projet ; son caractère source officiel n’est pas certifié.

Deux corrections natives remplacent trois rangées : Armiger de Noctis en finale et super, puis la défaite de manche de Gladiolus. Leurs autres rangées proviennent des premières sources. Les fichiers d’origine restent archivés. Les cartes `normalization.rows` relient chaque rangée finale à son fichier et à sa rangée source exacts.

Sharp extrait les vrais dessins par séparations transparentes, applique une échelle commune par phase, ajoute les marges et assemble le PNG. Il ne synthétise aucune pose. Le contrôle reconstruit les cinq atlas à partir des sources déclarées et exige leur empreinte finale exacte, en plus des hashes RGBA distincts, de l’alpha et des marges de 10 pixels.

```sh
node scripts/buildCombatCharacterAnimationsWave3PartC.mjs --check
```

Le registre est dans `src/game/combat/characterAnimationsWave3PartC.generated.json`. Les prompts, références, sources et coordonnées de découpe sont documentés dans [part-c-provenance.json](part-c-provenance.json), les choix de version et limites dans [ff15-part-c-source-facts.json](ff15-part-c-source-facts.json).

Les lectures externes ont échoué avec HTTP 402/403 ; aucune citation bloquée n’est présentée comme lue. Les noms de modèle et identifiants de génération/job restent `null`. Les dessins, les armes représentées, les timings et les effets sont des adaptations locales, sans validation visuelle 1:1. Deux pixels d’effet semi-transparents sur la rangée de finale originale de Gladiolus intersectent une séparation adaptative ; aucun pixel opaque de silhouette n’est coupé dans les rangées utilisées.
