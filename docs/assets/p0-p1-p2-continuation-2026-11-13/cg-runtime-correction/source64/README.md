# Amendement de source CG : 64 acteurs

Le nouveau contrat sépare les déclarations runtime des sources historiques CG pour 28 héros Final Fantasy, 24 héros science-fiction et 12 héros d’arène. Il couvre exactement 64 sujets, 88 entrées et 88 fonds ; seuls les champs d’identité/source déjà déclarés peuvent être projetés vers leurs valeurs historiques.

Les sources sont figées au commit `b9e616b331e4d93efcd63b607736ae6b6c59415b` : empreinte de chacun des 64 héros complets, 46 fichiers source explicites et deux fiches de pilotes CG. Le fixture contient les valeurs antérieures et actuelles, avec une empreinte fixe ; il n’accepte aucun chemin de champ ni patch JSON arbitraire.

Pour Master Chief et Arbiter, l’équipement et l’incarnation du pilote CG gardent leur autorité propre. Leur déclaration runtime figure séparément dans `identity.currentRuntimeSource`, avec `authority:false` et `visualFidelityApproved:false`. Elle ne renseigne pas implicitement les armes d’une CG Halo Infinite à partir d’un modèle Halo 3. Le manque d’équipement structuré du pilote reste ouvert.

L’appel doit intervenir après les anciennes projections 604/211 et la projection Revan, avant la comparaison complète au document historique `ce0e0a87…`. Il restaure les tableaux entiers et l’ordre publié des clés connues, conserve les valeurs inconnues et refuse les changements non autorisés dans les objets concernés. Les autres acteurs, états, images, générations, récompenses et approbations restent sous le contrôle historique complet.

Huit tests passent : champs autorisés altérés refusés, changements de livraison/état/assets/récompenses/approbation refusés, provenance des deux pilotes bornée, 64 clones runtime et deux fiches CG altérés refusés, modifications hors cohorte conservées puis rejetées par la comparaison historique, ordre des clés, fixture/fichier source altérés et immutabilité.

Une lecture du vrai snapshot après projections historiques a aussi réussi sur les objets de ces 64 acteurs. Elle conserve les anciens écarts de disponibilité hors de cette cohorte pour leur amendement distinct. Cette validation locale ne constitue pas à elle seule une validation de l’ensemble du pipeline ou des images.

- [Validation et empreintes](validation.json)
- [Résultat sur le vrai snapshot](actual-projection-evidence.json)
- [Inventaire des champs](field-inventory.json)
- [Tests TAP](unit-tests.tap)
- [Helper](../../../../../scripts/cgSource64Amendment.mjs)
- [Fixture fermé](../../../../../scripts/fixtures/cg-source64-amendment-2026-11-13.json)

```sh
node --max-old-space-size=2048 --test --test-concurrency=1 scripts/cgSource64Amendment.test.mjs
```

Aucune génération ni validation artistique n’a été effectuée dans ce lot. Les anciens documents et leurs empreintes restent inchangés.
