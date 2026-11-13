# Lot raster 004 — quarante acteurs, un Pinky classique raccordé

Le lot fige les **40 acteurs avec raster absent** des univers Crash Bandicoot
(6), Croc (4), Dino Crisis (18) et Doom (12), après exclusion exacte des trois
lots précédents. Les noms, identifiants et constats d’origine sont conservés dans
`baseline-audit.json`. Cette sélection ne signifie pas quarante dessins livrés
ou quarante dossiers clos.

## Ajout réellement utilisable

Le **Demon/Pinky de Doom (1993)** reçoit un atlas RGBA de **16 poses**, aux quatre
rangées ordinaires `idle`, `run`, `attack`, `hit`. Il est livré au chemin déjà
résolu pour `Leaping Pinky Demon` :

`DLC/Doom/assets/sprites/generated/bosses/doom/leaping-pinky-demon.png`

La source active `signatureSourceWave3` verrouillait déjà la morsure classique
`A_SargAttack`. Le nom historique « Leaping » reste stable, sans donner de saut
offensif. Le champ `weapon` passe de `charge` à `bite` ; HP 110, ATK 12, SPD 6,
nom et clé restent conservés. La fiche précise maintenant l’incarnation, la
référence et les traits visuels. `sourceSpeciesName` décrit l’espèce ; il ne
remplace pas le nom utilisé par la résolution des signatures.

Le renderer existant prend le bitmap au chemin canonique : aucun nouveau
mapping global, moteur, costume, scène ou clone de personnage n’est ajouté.
Le PNG de 1536 × 1024 comporte des cellules de **384 × 256**, sans poser
d’hypothèse de cellules carrées. Cette largeur conserve la mâchoire avancée
entière à l’échelle commune. Les appuis partagent la baseline 232, soit le
défaut réel `sourceH - 24` du renderer.

## Références et corrections conservées

La planche originale **MS-DOS / DOOM–DOOM II / Demon**, attribuée à id Software
et Bethesda et extraite par Dolphman, est une référence visuelle. Elle ne
devient pas un dessin nouveau ni une nouvelle autorisation de droits. Les
crops frontaux et latéraux utilisent des rectangles déclarés et un zoom
nearest-neighbor, sans repeindre les pixels d’origine. Le code publié par
id Software confirme la morsure, conditionnée à la portée de mêlée.

La première génération omettait à tort les **petites cornes grises temporales**
et avait des yeux bleutés. La revue des pixels source a montré les cornes et
les **yeux jaune/or**. Cette première candidate est rejetée et archivée ; une
édition Image Gen référencée corrige les deux traits sur les seize poses.
Ce correctif suit une génération réussie, sans contournement de refus.

Un premier ajout de `canonicalName: Demon (Pinky)` aurait aussi empêché la
résolution du kit, qui utilisait alors ce nom à la place du label historique.
La régression a été détectée par les contrôles runtime et corrigée en utilisant
`sourceSpeciesName`. Les preuves de cet échec restent archivées dans
`validation/attempt-before-identity-fix/`. Le test final impose le vrai kit actif.

La génération adapte la palette, l’ombrage et les poses ; elle n’est pas une
copie pixel pour pixel ni une certification de chorégraphie 1:1. Les petites
cornes source sont conservées, sans armure frontale ni longue queue de
Doom 2016/Eternal. Les effets, sauts offensifs et projectiles inventés sont exclus.

## Vérification effectuée

- **4/4 tests purs** : données, identité et résolution du kit, vrai décodage du
  PNG, transparence, seize cellules distinctes, absence de corps coupé, baseline
  et correspondance des quatre rangées du renderer.
- **3/3 cas navigateur** : reproduction explicitement limitée à l’absence du
  média avant ajout en 1280 px, puis vrais `GameCanvas` et `EngineSmash` après
  ajout en 1280 et 390 px. Le cas avant emploie le code courant et un 404 du
  seul nouvel atlas, correspondant à son absence dans l’arbre Git de départ ;
  ce n’est pas un ancien build de l’application complète.
- Les seize cellules sont observées dans les vrais appels `drawImage` du moteur
  suspendu. Le vrai bouton de super adverse déclenche ensuite **Pinky — Bite** :
  un contact, Cloud 105 → 88 HP, charge 100 → 0, puis démontage et `disposed`.
  Les réponses HTTP du PNG portent exactement son SHA-256 final.
- Les captures natives et les contacts à 68/96 px ont été inspectés. La revue
  indépendante du parent confirme l’identité générale et les traits corrigés,
  avec les limites d’adaptation ci-dessus.

La suite historique `signatureWave3.test.mjs` n’est pas globalement verte :
**27 succès et 35 échecs sur 62**, avec exactement les mêmes labels/statuts sur
le snapshot Git `5952da01c` et le code courant. Les quatre cas Pinky passent
(RPG et Smash, deux camps). Le snapshot avant possède son propre cwd et ses
sources Git exactes ; le test historique n’a pas été modifié. Comparaison :
`validation/baseline-vs-current.json`.

Deux icônes déjà absentes de la fixture avant restent 404 après :
`/sprites/generated/items/doom/praetor-helm.png` et
`/sprites/generated/items/doom/doom-summon.png`. Elles sont consignées ; ces
captures ne sont pas déclarées sans erreur HTTP. Aucun substitut n’est créé.

## Portée des clôtures

La disponibilité du raster manquant et les trois champs de source maintenant
déclarés sont vérifiables pour **cette identité**. Le delta de l’audit global
doit les compter séparément. Les 39 autres absences raster de ce lot, les
costumes/recherches ouverts et la revue globale d’animations restent ouverts.
Les quatre rangées ne livrent pas les 45 états Mêlée, huit directions, une
présentation complète ou une nouvelle variante officielle. Aucun P0 global,
dossier complet ou fidélité artistique 1:1 n’est déclaré clos par ce lot.

Les sprites Imp existants ne sont pas transférés à `Imp Fireballer` sur la seule
ressemblance du nom : son kit générique référence une autre portée de source,
sans contrat individuel d’édition suffisant. Les rencontres `Dr. Kirk Security
Override` ne deviennent pas un corps humain par réutilisation du héros Dr Kirk.

## Reproduire

```sh
python docs/assets/p0-p1-p2-continuation-2026-11-13/raster-lot-004/normalize_pinky.py
node --test scripts/pinkyClassicAssets.test.mjs
node docs/assets/p0-p1-p2-continuation-2026-11-13/raster-lot-004/build_fixture.mjs
python scripts/serveSourceSceneArtFixture.py --port 4193 --build-dir /tmp/multiverse-pinky-art-20261113
python docs/assets/p0-p1-p2-continuation-2026-11-13/raster-lot-004/browser_pinky.py
```

Node 22 est requis. Le serveur QA sert les sources physiques/index Git exactes
et refuse les pointeurs LFS non matérialisés ; il ne publie pas une distribution.
