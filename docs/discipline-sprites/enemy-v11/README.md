# Garde masqué — cagoule rouge

Ennemi créé d’après les deux captures fournies le **28 octobre 2026**, pour la **PR #12** de Discipline. Identifiant : `red-hood-harness-guard:black-harness-reference-v11`.

## Sprite et références

- [PNG natif](../../../public/sprites/generated/heroes/discipline-the-record-of-a-crusade/costumes/red-hood-harness-guard--black-harness-reference-v11.png) : **1254 × 1254**, RGBA transparent, **517 079 octets**.
- [Gros plan du masque](references/red-hood-mask-detail.png) : cagoule rouge couvrant le nez, petits rivets argentés, ouvertures des yeux et de la bouche, anneau et sangles du harnais.
- [Vue du groupe en pied](references/red-hood-group-full-body.png) : proportions, peau visible, ceinture, bas noir, gants et hautes bottes à revers rouges.
- [Prompt exact](prompt.txt), [revue visuelle](visual-review.json), [validation](validation.json) et [contrôle de galerie](browser-qa.json).

Les deux captures et le sprite v9 du garde cagoulé ont été transmis au générateur d’images intégré OpenAI. Le sprite v9 sert uniquement de référence de rendu pixel art et de cadrage ; sa combinaison, son visage et sa cagoule ne servent pas de modèle au nouveau costume.

Sortie native : `exec-9feb350b-776a-41eb-bc0c-b357305b9475.png`, copiée sans retouche, recadrage, redimensionnement ni modification de l’alpha. SHA-256 : `cd54a3eab76d78e91e333a9de905c27622eec0d18fccb35fd6395fad60600776`.

## Apparence reproduite

Homme adulte debout, légèrement tourné vers la droite, les deux poings abaissés. Cagoule entièrement rouge couvrant le nez et le cou, rivets argentés, ouvertures distinctes pour les yeux et la bouche. Le harnais sombre comporte un anneau central haut sur le sternum et deux sangles diagonales. Le torse, les bras et les cuisses restent visibles ; le bas noir opaque, la ceinture et les gants rouges, ainsi que les bottes sombres à revers rouges suivent la vue d’ensemble. Aucun armement ajouté. La tête, les mains et les deux bottes sont entièrement dans le cadre.

## Écarts et limites

La musculature des bras, des pectoraux et des cuisses est plus accentuée que chez certains gardes très minces de la capture. Les rivets sont plus réguliers ; leur nombre et leur placement exact ne sont pas reproduits point par point. L’expression est plus neutre, la bouche plus étroite et les yeux moins écarquillés. Les gants et les poings sont plus volumineux ; les semelles, plis et reflets des bottes sont davantage détaillés. Les rouges sont plus vifs et les contrastes plus nets.

Le nom reste descriptif : aucun nom individuel ni faction n’est confirmé. Les sources sont enregistrées comme `user_reference`. La transposition en pixel art n’est pas certifiée comme une reproduction complète **1:1**.

La zone visible à alpha > 8 occupe `(418, 37)–(891, 1227)`, avec **37 pixels au-dessus de la tête et 27 sous les pieds**. Quelques pixels périphériques ont un alpha de 1/255 ; les franges rouges du rendu brut ont un alpha très faible et deviennent négligeables après composition normale. L’alpha natif reste intact.

## Intégration

Ouvrir `/reviews/discipline/index.html`, puis choisir **Ennemi au masque rouge · v11** dans **Version**, ou rechercher **cagoule rouge**. Les deux captures sont accessibles depuis la carte. Le badge est **Ennemi · référence fournie**.

Le catalogue, son miroir de galerie et le manifeste passent à **373 sprites pour 41 identités**, dont **81 rendus fondés sur références et 292 adaptations**. Les **372 entrées et PNG précédents** sont préservés, y compris les ennemis v8/v9 et les trois machines v10 publiées au commit `a66c839`.

La couverture des costumes concerne **39 identités** et **213 / 234 combinaisons personnage / famille** ; les deux identités mécaniques restent hors couverture. Les autres familles de costumes ne font pas partie de cette demande.

Cette livraison ajoute une image statique **1 colonne × 1 ligne** au catalogue graphique. Elle n’ajoute ni personnage jouable, ni statistiques, ni animation, ni apparition en combat. Les rapports v6 à v10 sont conservés comme états historiques.
