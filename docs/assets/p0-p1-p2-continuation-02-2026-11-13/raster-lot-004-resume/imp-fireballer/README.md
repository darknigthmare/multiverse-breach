# Imp Fireballer — Doom classique, atlas16 utilisable

Le lot reprend quarante acteurs : Pinky avait déjà son raster ; trente-neuf
restaient sans atlas. Cette livraison ajoute uniquement **Imp Fireballer**, au
chemin déjà résolu `/sprites/generated/bosses/doom/imp-fireballer.png`. Les
trente-huit autres absences restaient ouvertes à cette étape. Le
[Mancubus livré ensuite](../mancubus-flame-tank/README.md) en retire une autre :
trente-sept restent ouvertes dans le lot final. Aucun personnage entier ni P0
historique n’est déclaré terminé.

## Source et dessin

L’édition est **Doom (1993), Imp classique TROO**. La [planche originale](references/imp-classic-source.png),
publiée sur [Spriters Resource](https://www.spriters-resource.com/ms_dos/doomdoomii/asset/27875/),
crédite id Software/Bethesda et Dolphman pour l’extraction. Les sprites source
montrent peau brune, yeux rouges, griffes et petites pointes claires ; aucune
armure, longue queue ni grande corne frontale des refontes ultérieures.
Le code officiel `A_TroopAttack` distingue griffes au contact et projectile
`MT_TROOPSHOT` à distance. Le [plan préalable](source-plan.json) conserve les
URL, empreintes, limites et critères joueur.

Image Gen a produit une seule candidate avec les références inspectées.
L’ancien Imp Fireball Thrower sert de guide de style, sans devenir une nouvelle
source d’identité. Le [prompt](generation/imp-classic.prompt.txt), le
[reçu](generation/generation.json) et les octets bruts sont conservés. Aucun
refus exact d’Imp n’a été trouvé dans les rapports CG/combat parcourus ; aucune
identité refusée n’a été remplacée par un alias.

Le PNG final RGBA **1536×1024**, 657 237 octets, contient seize poses distinctes
dans quatre rangées `idle/run/attack/hit`, cellules **384×256**. Le
[packing](normalize_imp.py) applique une échelle commune 0,95 et une baseline
231–232, sans repeindre de pose, fabriquer de dessin ou modifier l’anatomie.
Les valeurs alpha ≤8 sont nettoyées et celles ≥248 deviennent opaques ; les
autres sont conservées. [Contrôle technique](validation/imp-technical-qa.json)
et [contact à 96 px](validation/imp-contact-96px.png).

## Raccord et vérifications

Le nom, les statistiques 75/11/6, l’arme `fireball` et la signature
`Doom::Imp Fireballer` restent stables. La fiche reçoit seulement son espèce,
son édition, ses références et ses traits visuels ; aucun `canonicalName`
susceptible de casser la résolution n’est ajouté. Le renderer existant lit le
nouveau fichier, sans nouvelle règle globale ni nouvel adaptateur d’animation.

- **4/4 tests nouveaux**, puis **8/8 avec les quatre tests voisins Pinky** :
  identité, kit, chemin, décodage, alpha, seize cellules et appuis. [Commande](validation/unit-tests.json).
- **Compilation Vite de la fixture existante**, sans copie des médias ni
  prébuild global. [Reçu](validation/fixture-build.json).
- **3/3 cas GameCanvas** : absence reproduite par un 404 du seul nouvel atlas,
  puis rendu exact sur ordinateur 1280 px et mobile 390 px. Les seize cellules
  sont observées dans les vrais appels `drawImage`. [Rapport](validation/browser/results.json).
- Le bouton de signature adverse déclenche **Imp Fireball**, style `fire`,
  portée adaptée 330 : un contact à 180 px, baisse des HP de Cloud et jauge
  100→0. Un appel séparé au vrai `applyDamage`, dans l’état synthétique du test,
  blesse l’Imp et rend sa rangée `hit`. Le démontage confirme `disposed`.
- Le PNG servi répond 200 avec son SHA exact. Aucune erreur de page ; les deux
  icônes Doom absentes avant ajout restent 404 et sont consignées.

Un premier pilote interrompait lui-même la signature en appelant `setPaused`
au milieu de la séquence ; un second essayait d’infliger des dégâts en pause,
que le moteur refuse. Ces échecs de pilote sont archivés dans `validation/`.
La version finale capture la signature sans pause et applique les dégâts avant
de figer l’état de choc ; aucune règle du moteur n’a été modifiée.

La revue du parent reconnaît l’identité générale classique, avec une adaptation
plus massive et simplifiée. Ce sont quatre états ordinaires et une présentation
de signature existante ; les timings officiels, les quarante-cinq états Mêlée,
les costumes et une fidélité artistique 1:1 restent non certifiés. Le test avant
reproduit l’absence du média sur le code courant, sans prétendre être un ancien
build complet. Ni campagne complète ni distribution de production assemblée
n’est déduite de ces vérifications.
