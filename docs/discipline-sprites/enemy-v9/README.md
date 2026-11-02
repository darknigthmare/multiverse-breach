# Garde cagoulé — liserés rouges

Ennemi refait d’après les deux captures fournies le **28 octobre 2026**, pour la même **PR #12** de Discipline. Identifiant : `hooded-guard-red-trim:black-suit-reference-v9`.

## Sprite et références

- [PNG natif](../../../public/sprites/generated/heroes/discipline-the-record-of-a-crusade/costumes/hooded-guard-red-trim--black-suit-reference-v9.png) : **1254 × 1254**, RGBA transparent, **397 634 octets**.
- [Capture en pied](references/hooded-guard-full-body.png) : silhouette, pose, tenue, gants et chaussures.
- [Gros plan de la cagoule](references/hooded-guard-mask-detail.png) : bande centrale rouge, contours des yeux et de la bouche, nez et traits visibles.
- [Prompt exact](prompt.txt), [revue visuelle](visual-review.json), [validation](validation.json) et [contrôle de galerie](browser-qa.json).

Les deux captures et le sprite existant du garde roux ont été transmis au générateur d’images intégré OpenAI. Le garde roux sert uniquement de référence de rendu pixel art ; son visage, ses proportions, sa tenue et son armement ne constituent pas la référence de ce nouveau personnage.

Sortie native : `exec-38aa5ffd-fe15-4a49-a871-e384b6da4660.png`, copiée sans retouche, recadrage, redimensionnement ni modification de l’alpha. SHA-256 : `eef140ea6da7b404b80a9937ea2a55913b6298c690dbd76d9adf27c0b34a98a5`.

## Apparence reproduite

Homme adulte debout, tenue noire et anthracite à manches longues, cagoule enveloppante, gants noirs et poings abaissés, chaussures noires simples. La cagoule conserve une bande rouge centrale et les liserés autour des ouvertures. Les yeux, le nez et la bouche restent visibles. Aucun accessoire, insigne, ceinture ou armement n’a été ajouté. La tête, les deux mains et les deux chaussures sont entièrement dans le cadre.

## Écarts et limites

Le sprite est légèrement plus large et athlétique que la silhouette longiligne de la vue en pied. Le regard et la bouche sont plus neutres que dans le gros plan. Les liserés rouges sont plus vifs et réguliers ; les plis et leur épaisseur sont interprétés. Les chaussures sont plus arrondies et leurs semelles plus définies que dans la capture. La vue entière fournit bien une référence des pieds, contrairement à la capture partielle de la soldate v8.

Le nom est descriptif. Aucun nom propre, faction, épisode ou attribution à une œuvre précise n’est confirmé. `sourceMedium: user_reference` conserve cette distinction. La traduction en pixel art n’est pas certifiée comme une reproduction complète **1:1**.

## Intégration

Ouvrir `/reviews/discipline/index.html`, puis choisir **Ennemi cagoulé · v9** dans **Version**, ou rechercher **cagoulé**. La source **Image fournie** regroupe ce garde et la soldate v8. La carte du garde porte le badge **Ennemi · référence fournie** ; celle de la soldate conserve son badge féminin et son filtre v8.

Le catalogue, son miroir de galerie et le manifeste passent à **369 sprites pour 38 identités**, dont **78 références et 291 adaptations**. Les **368 entrées et PNG précédents** sont conservés, y compris la soldate ajoutée au commit `382fa8c`.

Cette livraison ajoute une image statique **1 colonne × 1 ligne** au catalogue graphique. Elle n’ajoute ni personnage jouable, ni statistiques, ni animation, ni apparition en combat. Les rapports et l’audit v6/v7/v8 restent des états historiques.
