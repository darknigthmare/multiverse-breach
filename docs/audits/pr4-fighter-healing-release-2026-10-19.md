# PR 4 — livraison Fighter et Healing Wind

Base vérifiée : `630d32765d7379c4875c3e1f1e2ca5772563b722`.
883 fichiers du snapshot ont été comparés à leurs blobs Git sans écart.
Les données de comptes et sauvegardes réelles ne sont pas utilisées.

## Blocage de la livraison confirmé

Le build complet GitHub 39235717575 échoue après les contrôles d'assets et les
16 recettes de commandes : `Fighter engine must support manual and forced K.O.
replacements.` La ligne 749 exige encore littéralement `next.index`, alors que
le correctif antérieur utilise à juste titre le véritable emplacement du roster.
Le remplacement manuel/automatique ne doit pas redevenir incorrect pour répondre
à ce contrôle périmé.

Les quatre assertions textuelles de mécaniques Fighter sont remplacées par un
sous-processus de tests réels : cellule limitée à trois, joueur actif unique,
remplacement choisi et délai, KO et réserve admissible, combo à trois coups,
mitigation/rupture de garde, coût de 100, impact unique du super, projectile qui
vole et esquive accroupie. Les 22 tests KO précédents restent exécutés, ainsi que
les 16 tests de routes clavier/bouton. Le reste du prébuild est conservé.

## Healing Wind réellement soignant dans Fighter

Quatre nouveaux scénarios échouent sur la base : Aerith inflige un super offensif
sur chacun des deux camps, et peut dépenser sa limite avec une équipe intacte.
L'adaptateur utilise maintenant son contrat source existant `aerith_ff7` : soin
jusqu'à 50 % des PV maximum, plafonné par les PV récupérables. La cellule vivante,
y compris les réservistes confirmés, reçoit le soin. Cela n'ajoute ni nouvelle
limite, ni résurrection, ni purification, ni score de dégâts ou charge gratuite.
Le plafond d'irradiation est conservé.

La limite coûte 100 à l'engagement, respecte sa préparation et ne se produit
qu'une fois. L'équipe doit avoir au moins un bénéficiaire soignable pour lancer.
Si les blessures disparaissent ensuite ou la préparation est interrompue, le coût
déjà engagé n'est pas remboursé : pas d'annulation gratuite de l'action.

Le contrat fige les identités et générations de vie des alliés vivants, pas leurs
PV : les blessures/reprises de soin valides pendant la préparation restent prises
en compte. Un nouveau personnage, un ancien cadavre ressuscité ou une nouvelle
incarnation ne récupère pas le soin prévu. La mort du lanceur et des bénéficiaires
est notifiée immédiatement. Un changement de capacité, de camp ou de paramètres
annule l'ancien effet. Les plans sont gardés hors des objets d'acteurs dans une
WeakMap afin que les états de diagnostic restent sérialisables sans cycle.

Une identité différente ou un profil Fighter personnalisé n'est pas remplacé.
Le Medic conserve son propre adaptateur. Il ne s'agit pas d'un port général des
118 signatures vers Fighter ni d'une certification canonique/visuelle 1:1.

## Commandes et affichage

La disponibilité du super est commune au moteur et au snapshot d'interface.
Les boutons R/O affichent la capacité active et sont désactivés pendant la pause,
les verrouillages, une action, une charge insuffisante, une protection Medic déjà
active ou une tentative de soin sans PV récupérables. Le clavier garde les mêmes
validations natives. Le codex FR/EN précise l'adaptation Fighter de Healing Wind.

## Tests

- 4 échecs reproduits sur la base, puis 4 succès après la correction.
- 49 nouveaux tests : 37 Healing Wind / 12 contrats de livraison Fighter.
- `npm run test:reaudit` : 267/267, sans ignoré ni annulé.
- `scripts/signature*.test.mjs` : 940/940, sans ignoré ni annulé.
- Lint ciblé : zéro erreur/avertissement. Compilation Vite des sources réussie,
  avec l'avertissement préexistant de gros blocs ; aucune optimisation revendiquée.
- Quatre recettes Chromium ajoutées à la CI permanente : 1280/390 pixels, FR/EN,
  P1/P2, commandes natives clavier/bouton, refus à équipe intacte, pause, soin,
  stockage intact et fermeture sans récompense de campagne.

Ces groupes se recouvrent. Le navigateur local refuse la navigation loopback
(`ERR_BLOCKED_BY_ADMINISTRATOR`) ; aucun succès de navigation locale n'est
revendiqué. La CI du commit publié est la preuve pour les recettes navigateur et
le prébuild intégral avec bitmaps. Le snapshot local ne contient pas ces bitmaps.

La livraison doit conserver le base-tree complet. Les fichiers de transport et
leurs workflows temporaires ne doivent figurer ni dans l'arbre ni dans
l'ascendance du commit de la PR. Aucun merge, changement administratif ou
publication volontaire en production.

## Contrôle complémentaire des commandes de soin

L'IA réutilise maintenant `canUseSuper` avant de choisir sa limite : elle peut
attaquer normalement au lieu de sélectionner un soin inutilisable à équipe
intacte. Un jeton détaché après interruption ne peut plus appliquer un ancien
soin, même appelé directement : il doit appartenir à l'action encore active.
Quatre tests supplémentaires, dont trois échouaient avant ce correctif et un
contrôle positif préservé, couvrent ces conditions. Le total local est 267/267.

Inspection des captures : le texte de soin pouvait afficher une longue suite
de décimales issue de la régénération passive. Le feedback est arrondi à l'unité
comme les autres nombres de combat, sans modifier les PV réellement rendus.
Deux tests supplémentaires couvrent cette séparation sur les deux camps.
