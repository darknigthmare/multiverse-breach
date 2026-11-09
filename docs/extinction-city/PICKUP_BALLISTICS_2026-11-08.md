# Balistique des armes ramassées — 8 novembre 2026

## Critères de jeu

Les trois armes de terrain existantes doivent modifier la façon de viser, sans
remplacer les quatre actions personnelles du combattant. Une pression consomme
une seule munition. Les tirs ne traversent pas leur première cible ; les dégâts
du plasma et de la roquette arrivent au contact après un trajet réel. Un bouclier
ou un marquage expiré refuse les dégâts sans produire de fausse confirmation ni
de charge d’ultime. La pause immobilise les tirs. Reprendre le kit personnel avec
**V** conserve son stock et ne transforme pas un projectile déjà lancé.

Ces règles passent par le même callback de tir pour le clavier, la souris et le
tactile. Elles s’appliquent dans Solo Extraction, Dernier Signal, Infestation et
Chasse au Champion, avec ou sans la variante de terrain correspondante.

## Comportement livré

| Arme existante | Livraison des dégâts | Conséquence pour le joueur |
| --- | --- | --- |
| `shotgun` | Sept trajectoires instantanées réparties dans la gerbe existante, portée de neuf unités ; chaque trajectoire s’arrête sur la première menace touchée. | Se rapprocher concentre les plombs. Une menace proche peut intercepter une partie de la gerbe destinée à une menace derrière elle. |
| `plasma` | Projectile à 0,6 unité par tick actif, portée de vingt-quatre unités, collision balayée et dégâts sur la première menace. | Anticiper le déplacement adverse ; une cible qui quitte réellement la trajectoire peut éviter le tir. |
| `rocket` | Projectile à 0,3 unité par tick actif, portée de vingt-quatre unités ; explosion au premier contact, rayon de 2,2 unités. | Viser un groupe ; la cible directe reçoit les dégâts complets, les autres menaces reçoivent des dégâts décroissants avec la distance au point d’impact. |

La simulation avance à soixante ticks actifs par seconde. Les vitesses, portées
et rayons sont des réglages A.R.C.A., sans prétention de mesure canonique.
La roquette expirée sans collision disparaît sans explosion distante. Les
projectiles ne rebondissent pas et ne déclenchent pas d’explosions en chaîne.
Les collisions utilisent les corps des menaces présents dans l’arène existante ;
ce lot n’ajoute pas de murs intérieurs solides ou de système d’occlusion de carte.

Les identifiants, stocks, chargeurs, cadences, couleurs et multiplicateurs de
dégâts des trois ramassages restent ceux de `triggerEnemyDrop`. La base reste
`34 × multiplicateur du rôle × multiplicateur de l’arme`. Les sept plombs se
partagent ce total, avec l’arrondi par cible. Le bonus de proximité du rôle Slayer
(×1,45 à moins de 2,2 unités) reste applicable aux trois armes. Pour les tirs en
vol, la distance entre le joueur et chaque victime est évaluée au contact : se
rapprocher ou s’éloigner pendant le trajet modifie ce bonus. Une victime éloignée
dans l’explosion ne reçoit pas le bonus de la cible directe. L’explosion décroît
linéairement jusqu’à 35 % des dégâts de base au bord
de son rayon. Une décharge réussie crédite au maximum huit points d’ultime,
indépendamment du nombre de plombs ou de cibles.

Les dégâts utilisent `damageExtinctionEnemy`, qui conserve le comptage unique
des éliminations, les ramassages associés, les soins du rôle Horror et les règles
du Champion. Une même décharge traite les noyaux protégés avant leurs drones :
tuer les drones avec cette explosion ne permet pas de blesser rétroactivement
le noyau. Un tir suivant peut le toucher. Le marquage de Chasse est vérifié au
moment du contact, même s’il était encore actif au départ de la roquette.

## Vue et cycle de vie

Le plasma est un orbe avec halo ; la roquette est une forme procédurale avec
traînée, suivie d’un anneau d’explosion. Leurs repères mondiaux utilisent la même
projection horizontale que les menaces et les objets de la scène. Ils ne prennent
aucune image personnelle au personnage contrôlé. Le panneau « Directive et
commandes » affiche une explication FR/EN de l’arme actuellement tenue.

Les tirs utilisent la file locale existante, bornée à vingt-quatre projectiles.
Chaque projectile garde son type, son propriétaire et son run ID pendant tout
son trajet. Le retour au kit personnel conserve les tirs déjà partis ; la pause
suspend leur déplacement et leur durée. Les nettoyages existants de fin, abandon,
sortie et récupération suppriment cette file. Aucun champ de sauvegarde, droit de
possession, calcul de récompense ou chemin de réception de résultat n’est ajouté.

Les quatre actions et ressources propres au combattant restent prioritaires
quand son kit personnel est tenu. Ce lot ne produit aucune nouvelle planche,
animation personnelle ou validation canonique du catalogue.

## Vérification et limites de preuve

Les tests moteur exécutent **48 combinaisons moteur (4 modes × 4 profils ×
3 armes)** à travers le véritable callback `ExtinctionRoyale.fire` et sa boucle
de simulation extraite du composant courant. Les profils représentatifs sont
Master Chief, Mirelle, Predator et Lilo : source balistique, projectile personnel,
mêlée et contrôle. Ce nombre ne désigne pas des parcours navigateur.

Les autres régressions ciblent les collisions de première cible, les plombs
répartis entre plusieurs menaces, les trajets rapides, les cibles mobiles, la
portée maximale, le contact à distance nulle, les métadonnées étrangères, deux
roquettes simultanément en vol sans élimination comptée deux fois, le bonus Slayer
avec entrée/sortie de proximité pendant le vol, les dégâts de zone et leur charge
unique, les deux ordres du
tableau Champion/drones, l’expiration du marquage en vol, la pause, les refus de
tir, la reprise du stock personnel, les nettoyages et la propriété des images.

Commande locale avec Node 22.23.4 :

```sh
node --test scripts/extinctionFighterProfiles.test.mjs \
  scripts/extinctionSignatures.test.mjs \
  scripts/extinctionCampaignKits.test.mjs \
  scripts/extinctionSchematicView.test.mjs
```

Résultat local : **80 tests réussis sur 80**. Oxlint ciblé ne signale aucun
avertissement ; `browserExtinctionRosterDirectives.py` compile en Python.

La recette native existante de ce script garde ses deux parcours déterministes
par variante des quatre modes. Son cas de ramassage court effectue désormais un
tir réel avec l’arme obtenue naturellement : consommation, dégâts ou projectile
en vol, absence de cast personnel emprunté, gel en pause, instructions visibles,
puis reprise du kit. Aucune position, vie, cible ou progression n’est injectée.
La graine sémantique de ce cas reste inchangée ; le type réellement obtenu est
enregistré dans la preuve, sans prétendre couvrir les trois armes en navigateur.

Cette recette doit encore être constatée sur la révision publiée en CI. Le
Chromium local refuse son démarrage (`socket(): Operation not permitted`) : les
tests moteur ne constituent donc pas une preuve visuelle ou un parcours
navigateur réussi. Les captures et résultats CI restent nécessaires pour clore
cette preuve. L’équilibrage approfondi par personnage, les appareils physiques
et l’art individuel restent ouverts dans le suivi FPS général.

## Fichiers concernés

- `src/game/extinctionSignatures.js` : balistique, dégâts groupés, durée et vue.
- `src/components/HubScreen.jsx` : entrée native partagée et instructions.
- `scripts/extinctionFighterProfiles.test.mjs` : moteur et callback réels.
- `scripts/browserExtinctionRosterDirectives.py` : recette native de ramassage.
