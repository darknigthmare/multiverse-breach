# PR 5 — engagements offensifs tactiques et cohérence P2

Base de continuation : `964b355b99c8ddbab07e9a276061c4010eb9e144`.
Les 897 fichiers extraits du snapshot ont été vérifiés contre leurs blobs Git.
Les corrections Healing Wind Tactics et des actions RPG de cette PR sont conservées.

## Défauts reproduits

Une première série de 22 scénarios avec les vrais moteurs donne 18 échecs sur
la base et quatre contrôles réussis. Les attaques IA après déplacement peuvent
encore toucher une cible morte puis ressuscitée sur le même objet, suivre une
identité remplacée, ou utiliser une autre compétence/puissance pendant leur délai.
Les ressources non finies ou de type chaîne passent aussi certaines conditions
finales d'exécution de l'IA héroïque.

Une extension trouve quatre incohérences supplémentaires de normalisation P2 :
réouvrir les commandes transforme NaN en zéro et des chaînes numériques en
ressources utilisables. Les valeurs invalides ne sont plus réinterprétées par
l'ouverture des commandes. Les valeurs absentes à l'initialisation gardent leur
défaut de zéro.

Le délai de recharge offensif explicitement défini à zéro était remplacé par
le défaut de trois secondes au clic. Il reste maintenant zéro. Une recharge
absente utilise toujours le défaut existant ; négatifs, chaînes et infinis sont
refusés avant engagement plutôt que produits comme recharges de combat.

## Contrat réellement exécuté

`tacticsAttackCommitment.js` fige le lanceur, son camp, identité source,
incarnation, vie, l'objet de compétence, ses paramètres de dégâts/recharge et
le profil géométrique normalisé. Les mêmes contrôles de validité numérique
protègent la sélection humaine, la confirmation et le choix/résolution IA.

Les bénéficiaires offensifs confirmés ont leurs propres tickets d'identité/vie.
Un remplaçant, une nouvelle vie ou un changement de camp ne récupère pas un ancien
impact. Les dégâts de zone ne recrutent pas de nouveaux bénéficiaires pendant
la préparation. Un bénéficiaire secondaire devenu invalide est ignoré sans
supprimer les autres impacts valides. La cible principale reste requise comme
auparavant ; sa disparition ne déclenche pas un autre tir, soin ou frappe de
secours sur un obstacle non confirmé.

Les positions, PV, défenses, couvertures et buffs restent dynamiques. La portée
et la ligne de vue sont revalidées par le moteur au moment de l'effet. Les murs
nouveaux bloquent le tir. Un soin/attaque valide n'est pas annulé pour une simple
traduction d'un nom lorsque l'identité source reste stable.

Les obstacles détruits signalent aussi leur changement de vie : réparer leurs
PV ou remplacer l'objet ne permet pas d'hériter d'un impact prévu avant destruction.
Les objectifs et rencontres conservent leurs protections natives.

Les coûts de l'IA offensive restent engagés lors de la résolution valide, pas au
moment du choix. Un échec ne donne ni nouvelle action ni remboursement du déplacement
et le tour se termine une seule fois. Les attaques humaines restent immédiates à
la confirmation. Les explosions environnementales et attaques spécifiques de REX
ne sont pas converties arbitrairement en commandes ciblées ordinaires.

## Validation

- 64 nouveaux tests dans `reauditTacticsAttackCommitment.test.mjs` : deux camps,
  KO/résurrection, identité, compétence, puissance, profils, zones, murs, pause,
  fermeture, données numériques, coût natif et recharge nulle.
- Les 22 scénarios initiaux réussissent après correction ; les assertions
  reproduisant les défauts n'ont pas été assouplies.
- Les tests tactiques existants et les signatures sont conservés.
- Quatre recettes navigateur ajoutées : vrai GameCanvas et contrôleurs IA,
  FR/EN, 390/1280 px, quatre situations par recette (tir normal, cible ressuscitée,
  compétence changée, mur ajouté). Pause/reprise et démontage sont vérifiés.
- Les mises en situation utilisent des états synthétiques et les méthodes natives
  du moteur ; aucun compte ou sauvegarde réelle n'est utilisé.

Les résultats finaux doivent être lus sur le commit publié. Le checkout local
ne contient pas tous les bitmaps et le navigateur Chromium n'est pas installé
localement : aucune recette navigateur locale réussie ni prébuild intégral local
n'est revendiqué. Le workflow complet de livraison reste inchangé.

## Limites

Il s'agit de corrections du chemin IA offensif ordinaire, pas d'un port complet
à tous les événements, scripts, invocations ou transformations. Les écritures
externes directes dans les PV, sans transition du moteur, ne peuvent pas être
reconstituées rétroactivement. Pas de nouvelle signature, de bitmap, de fidélité
1:1, de campagne complète ni de classeur original récupéré. Les travaux de
contenu, onboarding, performances et comptes réels restent ouverts.
Aucun merge, publication volontaire en production ou changement administratif.
