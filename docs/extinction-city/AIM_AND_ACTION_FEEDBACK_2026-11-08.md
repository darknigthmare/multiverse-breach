# Visée et action principale selon le kit — 8 novembre 2026

## Critères joueur

Le joueur doit pouvoir reconnaître l’action réellement tenue, comprendre pourquoi
un coup de contact manque une menace trop éloignée et distinguer une protection
du Champion d’une recharge. Un déplacement principal doit annoncer un déplacement.
Après E, V ou B, la commande et le réticule doivent suivre l’équipement en main.

Cette passe prolonge le portage de l’arme de terrain. Elle s’applique aux quatre
modes existants : Solo Extraction, Dernier Signal, Infestation et Chasse au
Champion. Elle ne modifie ni leurs objectifs ni leurs conditions de victoire.

## Réticule et commande

| Action tenue | Réticule | Commande FR | Information utile |
| --- | --- | --- | --- |
| Contact, balayage, contre | Deux crochets | FRAPPER | À portée ou APPROCHE si une menace visible dans cet angle reste trop loin. |
| Projectile du kit | Anneau | LANCER | ANTICIPE lorsqu’une menace croise sa trajectoire actuelle. |
| Contrôle | Quatre coins | ACTION | Portée et angle du vrai contrôle ; aucune promesse de dégâts. |
| Déplacement, téléportation | Flèches | BOUGER | Direction du regard et limite de l’arène. |
| Tir direct, rayon | Croix ouverte | TIRER | Menace visible dans l’angle et la portée de l’action. |
| Gerbe, volée, cône | Repères écartés | TIRER ou LANCER | Zone réellement couverte par cette action. |
| Technique ciblée | Losange | ACTION | Menace visible dans l’angle et la portée de la technique. |
| Fusil à pompe ramassé | Repères écartés | TIRER | Première collision de chacun des sept plombs réels. |
| Plasma ou lance-roquettes ramassé | Anneau | TIRER | Trajectoire actuelle ; l’impact dépend encore du déplacement de la cible. |

Le libellé bref occupe la seconde ligne du bouton principal existant. Le nom de
l’action et l’explication complète restent dans son nom accessible, son info-bulle
et le panneau **Directive et commandes**. Aucun nouveau bandeau ne couvre la vue.
Les textes sont disponibles en français et en anglais.

Les formes distinguent les familles même sans percevoir les couleurs. Un trait
central et une indication textuelle accompagnent un obstacle : **MARQUER T**,
**DRONES**, **LIMITE** ou **APPROCHE**. L’anneau de récupération lit le délai réel.
Le marqueur d’impact rouge existant reste déclenché exclusivement par les dégâts
effectivement reçus par une menace.

## Une lecture du combat existant

`src/game/extinctionAimReadout.js` ne modifie aucun état de partie. Le module ne
verrouille pas la visée, ne lance pas d’action, ne consomme pas de ressource et ne
fait aucun tirage aléatoire. Les entrées clavier, souris et tactiles continuent
d’atteindre les mêmes callbacks. Un coup volontaire dans le vide reste possible.

Les attaques et leur présentation partagent désormais deux sélections pures dans
`extinctionSignatures.js` :

- `getExtinctionAimCandidates` et `getExtinctionActionAimCone` conservent les
  angles et l’ordre des candidats des frappes, tirs directs et contrôles.
- `getExtinctionPickupSpreadHits` fournit les premières collisions des sept
  trajectoires déterministes du fusil à pompe. Une menace entre deux plombs n’est
  pas annoncée comme touchée par une approximation en cône.

Pour un projectile, le relevé représente uniquement sa trajectoire face aux
positions actuelles. La collision pendant le vol demeure calculée à chaque tick.
Une cible peut quitter cette ligne : **ANTICIPE** ne vaut pas impact confirmé.

La visibilité est vérifiée contre les dimensions réelles du Canvas, la limite
proche et le rectangle du corps dessiné par le rendu courant. Une cible derrière
le personnage ou entièrement hors du champ ne reçoit aucun identifiant de visée.
Un angle de contact peut rester plus large que le champ visible ; cette règle de
combat historique est conservée sans prétendre que sa cible est à l’écran.

En Chasse, le relevé distingue le marquage du noyau et le bouclier alimenté par
les drones. Un contrôle sans dégâts demeure valide sur un Champion protégé,
conformément à sa vraie mécanique. Consulter ce bouclier ne peut pas l’enlever.

La source personnelle exige le même personnage, le même run et le même profil.
L’arme rangée ne remplace pas la lecture de l’équipement actif. Les stocks,
recharges, projectiles, délais, charge d’ultime et récompenses restent conservés
par les mécanismes E/V/B existants.

## Présentation et cycle de vie

`drawExtinctionAimReticle` dessine dans les **36 × 36 unités Canvas** déjà réservées
au centre. Son enveloppe inclut l’épaisseur des traits. Le déplacement de caméra
ne pousse pas ces repères sous un bouton ; le contexte de rendu est restauré.
Les vues personnelles et schématiques conservent leur placement dans les zones
mesurées libres du HUD.

Le réticule lit le combat à chaque dessin. Le bouton utilise les snapshots du HUD
existants : toutes les 18 mises à jour actives, ainsi qu’après les actions déjà
publiées par les callbacks. Cette passe n’ajoute pas de boucle de mises à jour
React. Le texte du bouton peut donc suivre la visée avec le délai de ce snapshot
(jusqu’à environ 0,3 seconde active). La pause et le panneau de consultation
affichent immédiatement **PAUSE** et conservent leurs gardes d’entrée.

Fin, abandon ou récupération ne créent aucun état de visée persistant. Aucune
migration, possession, récompense ni nouvelle donnée du catalogue n’est ajoutée.
Cette présentation n’ajoute pas d’illustration personnelle, d’anatomie ou d’arme
canonique. Les statuts de revue de l’art et des profils restent applicables.

## Vérification locale

Sous Node **22.23.4**, la suite ciblée réussit **118 tests sur 118** :

```sh
node --test --test-concurrency=2 \
  scripts/extinctionFieldEquipment.test.mjs \
  scripts/extinctionFighterProfiles.test.mjs \
  scripts/extinctionSignatures.test.mjs \
  scripts/extinctionCampaignKits.test.mjs \
  scripts/extinctionFieldDirectives.test.mjs \
  scripts/extinctionPauseTiming.test.mjs \
  scripts/extinctionSchematicView.test.mjs
```

La suite de profils comprend **47 tests** et exerce notamment :

- **7 244 lectures** : 1 811 profils combattants dans les quatre modes, sans
  mutation ni tirage aléatoire. Cette matrice porte sur l’API du relevé de visée.
- Les vrais coups et contrôles à la limite exacte de leur portée, les menaces
  derrière, hors champ ou coupées par le plan proche.
- Les sept plombs réels, la priorité de leur première collision et une menace
  placée entre deux trajectoires.
- Le lancement réel de projectiles puis le déplacement de leur cible hors de la
  ligne, avec absence de dégâts et de charge fabriqués par le relevé.
- Le marquage Hunt, les drones, l’expiration du marquage et le contrôle non
  dommageant du noyau protégé.
- Le déplacement réel jusqu’au bord, le remplacement E/V/B, les ressources
  indépendantes, les propriétaires étrangers et la fin de partie.
- Le vrai composant React en FR/EN et sept formes de réticule dans trois
  dimensions, avec restauration du contexte Canvas et état de combat inchangé.

Oxlint ciblé, `git diff --check` et compilation Python de la recette réussissent.
Les deux composants React sont chargés dans une même instance Vite pour leur
lecture SSR ; deux instances successives provoquaient un SIGSEGV local avant la
fin du test. Les assertions de rendu sont conservées.

## Recette navigateur à confirmer sur la révision publiée

`scripts/browserExtinctionRosterDirectives.py` conserve les **huit parties de
victoire/relecture**, leurs graines, leurs entrées et leurs seuils. Un cas de
profil mobilité (`hw_wheelchair_guy`, 844 × 390, FR) complète les huit profils
existants. Avec les trois parcours de ramassage, la recette compte désormais
**20 cas**.

L’observateur relève les traits réellement peints du réticule, vérifie leur
inclusion dans la réserve centrale et compare le type de la commande à
l’équipement actuellement tenu. Les mesures existantes de taille des boutons,
de vue tenue, de radar, de texte agrandi et de non-recouvrement restent actives,
notamment le cas court à 844 × 380. Pause/reprise contrôlent aussi le libellé du
bouton principal. Aucun scénario n’est retiré et aucun seuil n’est diminué.

Le diagnostic commun de cette reprise confirme que Chromium local échoue avant
la création d’une page : `socket() failed: Operation not permitted`, puis SIGABRT.
Les nouvelles observations natives et la comparaison des huit traces avec la
révision `48197dc4` restent donc à lire dans les artefacts CI du nouveau head.
Les tests source et SSR ci-dessus ne remplacent pas cette preuve visuelle.
