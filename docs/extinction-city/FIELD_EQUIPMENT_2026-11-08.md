# Kit personnel et arme de terrain portée — 8 novembre 2026

## Objectif joueur

Reprendre les capacités propres à son personnage ne doit plus faire disparaître
l’arme ramassée. Le combattant porte son kit personnel et **une** arme de terrain.
Le changement conserve les ressources réellement restantes des deux équipements.

| Commande | Effet dans la partie |
| --- | --- |
| **E** sur une arme | Équiper le ramassage. Si une arme de terrain était déjà portée, active ou rangée, elle est remplacée et son nom est annoncé. |
| **V** ou bouton Kit personnel | Ranger l’arme de terrain tenue et reprendre le kit personnel. |
| **B** ou bouton Arme rangée | Reprendre l’arme de terrain portée avec son chargeur, sa réserve et sa recharge restants. |
| **R** | Recharger l’équipement actif selon sa règle existante. Un kit personnel sans chargeur balistique conserve ses ressources propres. |

Le HUD identifie l’arme rangée et son stock. Les boutons V et B occupent le même
emplacement : seul le retour actuellement possible est proposé. La pause et le
panneau de commandes gardent les commandes de combat suspendues. Répéter V quand
le kit est déjà tenu, ou B quand l’arme est déjà tenue, ne modifie rien.

## Périmètre et identité

La fonctionnalité s’applique aux quatre modes FPS et à leurs variantes : Solo
Extraction, Dernier Signal, Infestation et Chasse au Champion. Les armes restent
les trois ramassages existants : `shotgun`, `plasma`, `rocket`. Leurs dégâts,
cadences, trajectoires, chargeurs et réserves initiales restent définis par les
sources existantes ; aucun nouveau tirage aléatoire ou objet déposé n’est ajouté.

Il s’agit d’équipement partagé de terrain dans les simulations du Nexus. Ce
portage n’ajoute pas une arme à l’équipement canonique d’un invité. Les douze kits
Nexus écrits pour le jeu, les actions sourcées des invités et leur statut de
validation artistique restent distincts. Une arme de terrain ne réutilise pas
une planche personnelle qui ne lui correspond pas. Ce lot n’ajoute aucune image
ou incarnation et ne lève aucun besoin de revue des profils génériques.

Un ramassage supplémentaire remplace l’unique arme de terrain portée, y compris
si elle était rangée pendant l’utilisation du kit. Le kit personnel n’est jamais
remplacé par cette opération. L’ancienne arme ne crée pas de nouveau butin au sol.
Les stocks ne fusionnent pas entre deux ramassages, même de type identique.

## Ressources et temps de simulation

Chaque équipement conserve son propre chargeur, sa réserve et une échéance de
recharge exprimée en ticks actifs. Au rangement :

```text
reloadReadyAtTick = tickCourant + rechargeRestante
```

À la reprise :

```text
rechargeRestante = max(0, reloadReadyAtTick - tickCourant)
```

Cette règle est la même que celle du kit personnel déjà retenu pendant un
ramassage. Une recharge continue donc à s’écouler lorsque l’équipement est rangé
et que la simulation avance. La pause n’avance pas son échéance ; le temps réel
passé dans un menu n’accorde aucun rattrapage. Reprendre l’arme pendant ses 26
ticks restants ne donne pas le droit de tirer avant leur fin.

La recharge existante transfère les munitions de la réserve au chargeur à son
déclenchement, puis impose son délai. Ranger l’arme conserve ce transfert déjà
effectué ; la reprendre ne répète pas le transfert. Le ramassage neuf conserve
également la règle de recharge active antérieure. Les délais de capacités,
`lastFireTime`, la charge d’ultime et les projectiles en vol sont indépendants des
échanges V/B. Un aller-retour immédiat ne permet ni tir supplémentaire, ni
recharge gratuite, ni duplication du projectile lancé.

## Contrats de code et cycle de vie

`src/game/extinctionFieldEquipment.js` expose :

| API | Résultat et responsabilité |
| --- | --- |
| `equipExtinctionFieldPickup(state, weaponData)` | `{ equipped, weaponName, replacedWeaponName }` ; vérifier `equipped` avant de consommer l’objet. La présentation utilise le nom de l’arme remplacée. |
| `holsterExtinctionFieldWeapon(state)` | Booléen ; conserve l’arme puis restaure le kit personnel. |
| `restoreExtinctionFieldWeapon(state)` | Booléen ; conserve le kit actualisé puis restaure l’arme rangée. |
| `getExtinctionFieldWeaponReadout(state)` | Lecture détachée `{ type, name, ammo, maxAmmo, reserveAmmo, reloadTicks, canRestore }`, ou `null` ; aucune mutation du run. |
| `clearExtinctionFieldEquipment(state)` | Vide uniquement `state.fieldWeapon`, de façon répétable. Le nettoyage personnel existant reste explicite. |

Le champ `fieldWeapon` reste local à la partie. Quand l’arme est active, son état
est dans `state.weapon` et `fieldWeapon` est nul ; quand le kit est actif, le
champ retient l’arme. La restauration exige le même héros, le même run ID et le
profil correspondant, ainsi que des stocks et échéances valides. Une partie
terminée, un personnage mort, une pause, un propriétaire étranger ou une échéance
incohérente refuse l’échange sans modifier l’équipement actif.

Le nouveau départ initialise le champ vide. Fin de partie, abandon et récupération
le vident. Aucune migration de sauvegarde, possession persistante, formule de
récompense ou réception supplémentaire de résultat n’est ajoutée. Il n’est pas
nécessaire d’ajouter une mise à jour de l’arme rangée dans la boucle de simulation :
son échéance utilise le tick actif déjà maintenu par cette boucle.

## Vérification ciblée

Commande moteur et intégration :

```sh
node --test scripts/extinctionFieldEquipment.test.mjs \
  scripts/extinctionFighterProfiles.test.mjs \
  scripts/extinctionSignatures.test.mjs \
  scripts/extinctionCampaignKits.test.mjs \
  scripts/extinctionFieldDirectives.test.mjs \
  scripts/extinctionPauseTiming.test.mjs
```

Le nouveau test autonome couvre l’aller-retour avec un projectile réel, la
cadence, les deux échéances de recharge, le remplacement actif ou rangé, les refus
d’identité et de cycle de vie, les stocks vides, la lecture HUD et le nettoyage.
Les régressions d’intégration exécutent les callbacks courants du composant :
ramassage, tir, recharge, V, B et fin. La matrice comprend **48 combinaisons
moteur** : quatre modes × quatre profils représentatifs (Master Chief, Mirelle,
Predator, Lilo) × trois armes. Elle vérifie un nouveau tir effectif après reprise,
ainsi que le refus avant l’échéance. Huit fins couvrent victoire/défaite dans les
quatre modes avec une seule réception et les récompenses inchangées.

La recette navigateur `scripts/browserExtinctionRosterDirectives.py` étend les
trois cas de ramassage naturels déjà présents. Après le tir mesuré et V, elle
effectue B par bouton, une recharge R réelle, V, une pause avec tentatives B/V,
dix ticks actifs, B au clavier, un tir refusé pendant les 25–26 ticks de recharge
restants, puis V et abandon. Elle conserve une preuve séparée
`*-field-equipment.json` et une capture `*-stored-field-weapon.png`.
Le cas court de Chasse mesure aussi B et Marquage ensemble à 844×380, texte et HUD
agrandis, avec les mêmes seuils de taille et d’absence de recouvrement que les
quatre variantes de présentation du kit déjà présentes.

Les huit parcours de victoire conservent leurs graines, observations, entrées
et seuils. Le nouveau contrôle de nettoyage en fin est une simple lecture. La
recette complète reste composée de **19 cas** : huit profils, trois ramassages et
huit relectures des modes. Les changements de portage ne prétendent pas établir
un équilibrage exhaustif des 1 811 combattants ni une nouvelle mesure de FPS
d’affichage.

### État des preuves

La commande moteur et intégration ci-dessus passe localement : **101 tests sur
101**, avec Node 22.23.4, dont les sept nouveaux tests autonomes du helper et les
trois nouvelles régressions des callbacks raccordés. La recette Python compile,
ses deux régressions de visée passent et Oxlint ciblé ne signale aucun avertissement.

Le démarrage du Chromium système a été tenté sur ce lot et échoue avant la
création d’une page : `socket() failed: Operation not permitted`, dans
`process_singleton_posix.cc`. Les nouveaux échanges B natifs ne sont donc pas
déclarés validés localement ; leur preuve doit être lue dans l’artefact CI de la
révision publiée. Les tests moteur et une compilation ne remplacent pas cette
preuve de présentation et d’entrées natives.
