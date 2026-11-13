# Mancubus Flame Tank — Doom II (1994), atlas16

Ce deuxième dessin du lot reprend le **Mancubus classique FATT de Doom II
(1994)**. Le fichier est ajouté au chemin déjà résolu
`/sprites/generated/bosses/doom/mancubus-flame-tank.png`. Avec l’Imp et le Pinky
livré précédemment, le lot de quarante conserve **trente-sept rasters absents**.
Pinky n’est pas compté comme une nouvelle livraison de ce tour.

La [planche source](references/mancubus-classic-source.png) crédite id
Software/Bethesda et Dolphman pour l’extraction. Le [plan préalable](source-plan.json)
conserve la page, l’URL du PNG, ses octets et son SHA. Les vrais sprites montrent
un corps ventru plissé, de petites jambes, deux canons d’avant-bras et leurs
tuyaux sombres, de petits yeux verts ; aucune armure thoracique ni jetpack des
refontes ultérieures. Le code officiel `A_FatAttack1/2/3` décrit trois volées de
deux projectiles. Cette source ne certifie pas les timings ni l’équilibrage du
moteur Nexus.

Une seule génération Image Gen réussie produit les seize poses ; aucun refus
n’est réessayé. [Prompt](generation/mancubus-classic.prompt.txt),
[reçu](generation/generation.json) et PNG brut sont conservés. Le
[packing déterministe](normalize_mancubus.py) produit un RGBA **1536×1024**,
cellules **384×256**, quatre rangées `idle/run/attack/hit`, sans repeindre ni
fabriquer une pose. Une seule échelle 0,95 et un centre horizontal commun
préservent la largeur du modèle et ses deux canons. [QA](validation/mancubus-technical-qa.json)
et [contact à 96 px](validation/mancubus-contact-96px.png).

Le nom, les statistiques **150/17/3**, l’arme `flame_cannons` et la signature
**Mancubus Fireball Salvo**, six contacts, restent inchangés. Les ajouts dans la
fiche ne concernent que l’espèce, l’édition, les références et les traits
visuels. Aucun `canonicalName`, renderer global ou kit de signature n’est
modifié.

- **12/12 tests ciblés** : quatre nouveaux contrôles Mancubus, quatre Imp et
  quatre voisins Pinky. [Reçu](validation/unit-tests.json) et
  [TAP](validation/three-classic-doom-tests.tap).
- **Compilation de la vraie fixture GameCanvas**, sans copie des médias ni
  prébuild de production. [Reçu](validation/fixture-build.json).
- **3/3 cas navigateur** : absence du seul nouveau PNG reproduite avant ajout,
  puis ordinateur 1280 px et mobile 390 px. Les seize cellules sont observées
  dans les vrais appels du renderer. [Résultats](validation/browser/results.json).
- Le bouton de signature adverse produit **six contacts** à 180 px, Cloud
  **105→81 HP**, charge **100→0**. Un appel séparé au vrai `applyDamage`, dans
  l’état synthétique de test, blesse le Mancubus et sélectionne sa rangée `hit`.
  Le démontage vérifie `disposed`.
- Le PNG HTTP 200 possède exactement son SHA livré. Zéro erreur de page ; les
  deux icônes Doom déjà absentes restent 404 et ne sont pas remplacées.

Le premier test copié conservait par erreur l’édition de l’Imp ; son échec est
archivé, et l’attendu nouveau impose désormais Doom II (1994), FATT. Un premier
pilote navigateur utilisait aussi le serveur statique précédent et a été
arrêté ; le dernier passage utilise le bundle et l’index des deux nouveaux
acteurs. Aucun attendu historique ni règle du moteur n’a été assoupli.

Les dessins adaptent l’éclairage, les volumes et les poses. Le gros plan de la
signature utilise la présentation existante ; il n’ajoute pas une simulation
native de six projectiles Doom. Une fidélité pixel pour pixel, les timings de
source, les quarante-cinq états Mêlée, les costumes et un dossier acteur complet
restent non certifiés. Ces cas synthétiques ne remplacent ni une campagne
complète ni une distribution de production assemblée.
