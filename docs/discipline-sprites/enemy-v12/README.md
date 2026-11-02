# Agente ennemie — combinaison noire

Agente créée d’après la capture fournie le **29 octobre 2026**, pour la **PR #12** de Discipline. Identifiant : `black-suit-agent-bob:black-catsuit-reference-v12`.

## Sprite et référence

- [PNG final natif](../../../public/sprites/generated/heroes/discipline-the-record-of-a-crusade/costumes/black-suit-agent-bob--black-catsuit-reference-v12.png) : **1254 × 1254**, RGBA transparent, **484 999 octets**.
- [Capture fournie](references/black-suit-agents-user-reference.png) : la **femme de droite** constitue la référence choisie pour le visage, la coiffure et les éléments visibles du costume.
- [Historique exact des deux générations](generation.json), [prompt initial](prompts/initial.txt), [prompt de correction](prompts/close-flank.txt), [revue visuelle](visual-review.json), [validation](validation.json) et [contrôle de galerie](browser-qa.json).

La génération initiale a reçu la capture et le sprite de l’officière au carré châtain/prune comme guide de technique pixel art et de cadrage uniquement. La correction a reçu **le premier rendu et la capture utilisateur** ; le sprite de style est un ancêtre de cette correction, pas une entrée directe du second appel.

Sortie finale native : `exec-7aa73e8a-5095-432a-8b82-d9053457bd45.png`, copiée sans modification de pixels après la correction par le générateur. SHA-256 : `204c827265600288e0a38784167037efe4a3a9c65389336ae1d59a5cd8963794`.

## Apparence reproduite

Une seule femme adulte, carré noir à frange droite, yeux brun-rouge, teint pêche, combinaison noire opaque à col montant, manches longues, reflets bleu nuit et **mains nues**. Le personnage est entier, légèrement tourné vers la droite, les bras abaissés. Aucun insigne, ceinture, accessoire ou armement ajouté.

## Correction et limites

Le [premier rendu](previous-renders/black-suit-agent-open-flank.png) avait une petite ouverture couleur peau au flanc gauche de l’image, non attestée sur la femme de droite choisie comme modèle. Ce rendu est **supersédé et exclu du catalogue**. Une seconde passe du générateur a fermé ce triangle avec le tissu noir/bleu nuit. La revue finale confirme l’absence de peau opaque dans la zone corrigée et ne relève aucun nouveau défaut bloquant.

La capture utilise une contre-plongée et s’arrête avant les chevilles et les pieds. Les raccords de bas de jambes, les bottines noires simples et leurs semelles sont donc **reconstitués**. La pose neutre, les proportions en pied, les détails du visage et la répartition des reflets sont transposés en pixel art. Aucune fidélité intégrale **1:1** n’est certifiée.

Le nom est descriptif ; aucun nom individuel ni faction n’est confirmé. `sourceMedium: user_reference` conserve la nature de la preuve. La zone visible à alpha > 8 occupe `(435, 26)–(842, 1236)`, avec **26 pixels au-dessus et 18 sous les pieds**. L’alpha natif est conservé.

## Intégration

Ouvrir `/reviews/discipline/index.html`, puis choisir **Agente en combinaison · v12** dans **Version**, ou rechercher **Agente ennemie**. La carte affiche **Ennemie · référence fournie** et donne accès à la capture.

Le catalogue, son miroir de galerie et le manifeste passent à **374 sprites / 42 identités**, dont **82 rendus fondés sur références et 292 adaptations**. Les **373 entrées, objets de manifeste et PNG précédents** sont conservés, y compris le garde rouge v11 publié au commit `02d726f` après la reprise de son envoi.

La couverture des costumes concerne **40 identités**, avec **214 / 240 combinaisons personnage / famille**. Les deux identités mécaniques restent exclues de cette couverture. Les autres familles de costumes ne font pas partie de cette demande.

Il s’agit d’une image statique **1 colonne × 1 ligne** du catalogue graphique. Cette livraison n’ajoute ni animation, ni statistiques, ni apparition en combat. Les rapports antérieurs restent des états historiques.
