# P1 raster — lot 002, 40 acteurs

Ce lot couvre les 40 entrées `RASTER_MISSING` suivant les 40 clés du lot 001,
dans l'ordre `priority / universe.casefold / actorId.casefold / actorKey`.
La sélection est vérifiée contre le backlog versionné et ne correspond pas au
deuxième lot du fichier général `actor-batches-40.json`.

| Univers | Acteurs examinés |
| --- | ---: |
| Alien: Romulus | 6 |
| Aliens | 6 |
| Aliens vs Predator: Requiem | 6 |
| Altered Beast | 6 |
| American Dad | 6 |
| Ash vs Evil Dead | 6 |
| Assassin's Creed | 4 |

## Production réelle

Une génération de **Neff sous sa forme de sorcier, Altered Beast arcade 1988**
est conservée avec son prompt exact, sa provenance et sa normalisation
reproductible. L'atlas final se trouve dans
`DLC/AlteredBeast/assets/sprites/generated/forms/altered-beast-1988/neff-wizard.png` :
1024 × 1024 RGBA, 16 cellules de 256 × 256, orientation gauche, échelle commune,
contact au sol aligné et transparence réelle. Le PNG brut de l'outil est conservé
dans `generation/`; aucun sprite extrait du jeu n'est copié directement dans
l'atlas final.

La référence arcade montre la robe prune drapée, les mains nues, la peau grise
pâle et la silhouette du sorcier. Le personnage conserve ces éléments sur la
planche inspectée. Les rangées représentent repos, mouvement de robe/posture,
geste de commandement, puis recul/effondrement. La deuxième rangée **ne constitue
pas un cycle de marche certifié**. Les timings du jeu source ne sont pas reproduits
image par image.

Ce sous-asset reste candidat : la forme rhinocéros, sa palette, la transformation,
les effets séparés et la revue en jeu sont encore nécessaires. Il ne remplace pas
l'ensemble du boss `Neff Demon God`, n'est pas raccordé au runtime et ne clôture
aucun signalement P1. `source1to1Verified` reste `false`.

## Réutilisations examinées

L'arbre Git complet des ressources et leur projection DLC/public sont utilisés.
Une absence physique dans ce checkout partiel n'est jamais comptée comme un
nouveau manque de production.

Cinq acteurs disposent de candidats anciens par nom ou variante : Queen,
Predalien, Zombie, Elk Grove Deadite et Ruby. Aucun raccord sûr n'est établi :
homonymes d'autres franchises, incarnation différente, anatomie insuffisamment
établie, décor au lieu d'un corps ou costume/saison non sourcés. Le détail des
chemins et empreintes Git figure dans `baseline-audit.json`.

La recherche découvre aussi des ambiguïtés qui précèdent la génération : castes
Acid Spitter/Praetorian sans édition précise, acteurs composites nommés comme des
rencontres, créatures d'American Dad portant encore des noms de slots moteur, et
des descriptions locales Altered Beast dont la palette ou l'identité reste à
rapprocher des sprites arcade. Ces points demeurent ouverts. Le refus antérieur
de Roger est conservé, y compris pour sa persona Tearjerker ; aucune nouvelle
génération ou reformulation n'a été tentée pour ces identités.

## Contrôles et reproduction

`validation/neff-wizard-contact.png` permet d'inspecter les 16 poses sur un fond
opaque. `validation/neff-wizard-motion.gif` est une prévisualisation de ces poses,
pas une capture du moteur. Le rapport technique relève les rectangles source,
les pivots, l'échelle commune et les limites visibles de chaque cellule.

Depuis la racine du dépôt :

```sh
python docs/assets/p0-p1-continuation-2026-11-13/raster-lot-002/normalize_neff_wizard.py
```

Le contrôle Python passe pour les 16 cellules non vides et non coupées. La
planche normalisée a été inspectée visuellement. Une seconde revue indépendante
des références puis des 16 poses à 256 et 96 pixels retient le candidat sorcier :
identité, robe et famille de palette cohérentes, sans certification des pixels,
des contours ou des timings arcade. Le contact au sol varie de 240 à 241 pixels ;
la petite variation de hauteur du corps devra être vérifiée en mouvement. Le
détail est conservé dans `validation/neff-wizard-independent-review.json`.
Aucun processus Node lourd,
build global, commit ou modification de registre partagé n'a été effectué par
ce lot. Les pages, URLs, empreintes et limites des références sont décrites dans
`references.json` ; les conditions commerciales des franchises ne sont pas
présumées acquises.

**Bilan : 40 dossiers examinés, 1 sous-forme réellement générée, 0 raccord ancien
approuvé, 0 acteur déclaré entièrement terminé.**
