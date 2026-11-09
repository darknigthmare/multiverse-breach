# Soldate masquée — visière rouge

Ajout demandé le **28 octobre 2026** pour la **PR #12** de Discipline, à partir de la capture fournie. Identifiant : `masked-soldier-red-visor:urban-camouflage-reference-v8`.

## Fichier livré

- [Sprite PNG natif](../../../public/sprites/generated/heroes/discipline-the-record-of-a-crusade/costumes/masked-soldier-red-visor--urban-camouflage-reference-v8.png) : **1254 × 1254**, RGBA, **527 258 octets**, fond transparent.
- [Capture utilisateur conservée](references/masked-soldier-user-reference.png) : 1729 × 1329, copiée sans retouche.
- [Prompt exact](prompt.txt), transmis au générateur d’images intégré OpenAI avec la capture et le sprite de l’officière au carré comme référence de style uniquement.
- [Revue visuelle](visual-review.json) et [validation technique](validation.json).

La sortie native `exec-eb1d3e74-486d-49bf-873c-7738c043c481.png` a été copiée sans recadrage, redimensionnement, changement d’alpha ou retouche de pixels. SHA-256 : `d5c3a3968ea4962ffc119fa5b1fc4f0c8c844af2b28c77ac0946926410f0606b`.

## Apparence et fidélité

Le sprite reprend les cheveux noirs, la visière rouge, le détail frontal doré, le masque blanc à ligne centrale, le haut argenté à bretelles sombres, les longs gants noirs à manchettes claires, la ceinture noire, le pantalon camouflage gris/blanc/noir et les bottes noires. La pose est debout, neutre, légèrement tournée vers la droite ; les mains et les deux chaussures sont entièrement visibles.

La traduction en pixel art reste interprétative : la taille est plus marquée, les volumes du buste et des hanches plus modelés, les pointes de cheveux plus écartées et les motifs du camouflage recréés. La coupe exacte des pieds et des semelles n’est pas établie par la capture. Les formes sombres verticales près des bras dans la source restent ambiguës ; le sprite est livré mains vides et ne certifie pas une reproduction complète de l’équipement.

L’intitulé est descriptif. Aucun nom propre, faction, épisode ou attribution à une œuvre précise n’est affirmé. `sourceMedium: user_reference` distingue la preuve fournie d’une source officielle identifiée. `provenance: reference` signifie que le dessin s’appuie sur cette image ; **aucune fidélité intégrale 1:1 n’est certifiée**.

## Où la retrouver

Dans `/reviews/discipline/index.html`, choisir **Ennemie masquée · v8** dans **Version**, ou **Image fournie** dans **Source**. La recherche **Soldate** et la catégorie **Bataille / militaire** fonctionnent également. La carte comporte un lien vers la capture et les limites de fidélité.

## Périmètre de l’intégration

Une entrée est ajoutée au catalogue JavaScript, à son miroir de galerie et au manifeste. Le registre la reconnaît comme une image statique **1 × 1**. `assetRole: enemy` documente son rôle visuel. Aucun personnage jouable, statistique, animation ou apparition en combat n’est ajouté par cette livraison.

Le total passe de **367 à 368 sprites**, de **36 à 37 identités**, de **76 à 77 références**, avec **291 adaptations**. Les 367 objets de catalogue et de manifeste existants et les anciens fichiers PNG sont préservés. L’audit v7 et les rapports v6 restent des états historiques, antérieurs à cette nouvelle entrée.
