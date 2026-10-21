# PR 5 — actions RPG différées et vies des cibles

Base de cette continuation : `16f9bd4f7893ecd34772bc59670bd1c5dfa4501c`.
Les intégrations tactiques d'Aerith de la PR 5 sont conservées. Cette passe
corrige les commandes RPG natives ; elle n'ajoute pas de signature ou d'asset.

## Défauts reproduits

Une première série de 30 scénarios sur la base donne 28 échecs et deux contrôles
positifs réussis, sur les deux camps :

- Un soin différé atteint encore le patient après son KO et sa résurrection
  immédiate, parce que la référence JavaScript désigne toujours le même objet.
- Une cible transférée dans l'autre camp, une identité source remplacée ou une
  capacité modifiée peut encore recevoir/appliquer l'ancien soin.
- Modifier la liste de purification sur place modifie l'effet déjà engagé.
- Une jauge spéciale `NaN`, `Infinity` ou `'100'`, et une recharge `NaN`,
  `-Infinity` ou `'0'`, passent les anciennes comparaisons de disponibilité.

Ces cas sont des états synthétiques des vrais moteurs, pas une exploitation
constatée sur la sauvegarde de l'utilisateur. Les soins ordinaires de contrôle
fonctionnent sur la base et restent fonctionnels après correction.

## Correction

`rpgActionCommitment.js` conserve les identités, camps, générations de vie et
paramètres de la capacité confirmée. Le moteur utilise une WeakMap de générations
qui est invalidée synchroniquement lors de l'annulation/KO ou de la résurrection.
Les chemins de dégâts directs des rencontres signalent aussi cette transition.
Les règles d'immortalité et la finale indépendante de Barbossa ne sont pas retirées.

À la résolution, le soin, dégât, buff, garde ou résurrection natif ne peut pas
suivre une autre vie, un nouveau camp ou une capacité remplacée. Un bénéficiaire
invalide d'un groupe est ignoré sans transférer son effet ni bloquer les autres
bénéficiaires valides. Une résurrection appartient à la mort confirmée, pas à un
second KO intervenu après une autre résurrection.

Les PV, buffs de statistiques, défenses et positions ne sont pas figés. Un soin
valide rend toujours les seuls PV récupérables à l'impact et respecte les
radiations. Une traduction du nom affiché ne change pas une identité canonique
stable. L'absence d'identifiant de catalogue ne supprime pas la vérification du
nom canonique de l'ennemi.

La ressource nécessaire doit être numérique et finie ; les durées de recharge
invalides et multiplicateurs infinis sont refusés avant engagement. Une recharge
finie légèrement négative, déjà expirée, reste admissible. Les coûts valides ne
changent pas. Une action valablement engagée puis invalidée ne rembourse pas
son ATB ou sa limite et libère son verrou d'action/IA à la résolution.

L'ordonnanceur refuse aussi de faire avancer directement ses callbacks pendant
une pause, un ciblage en attente, une fermeture ou une fin de combat. Les
événements scénarisés indépendants ne sont pas supprimés arbitrairement.

## Validation

- Les 30 scénarios initiaux passent après correction.
- Extension finale : **69 tests** de régression et contrôles positifs, comprenant
  les deux camps, tirs, soins de groupe, résurrections natives, remplacement
  d'objet, identité, pause, fermeture et données numériques invalides.
- Les tests utilisent le moteur réel avec et sans directeur de signatures,
  et les vrais impacts/ordonnanceurs. Aucun compte ni sauvegarde réelle utilisé.
- `test:reaudit` inclut automatiquement le nouveau fichier ; le workflow de
  fiabilité inclut le nouveau module dans son lint. Le prébuild complet reste
  inchangé et exécute ce groupe.
- Les régressions existantes de ciblage, RAAM, Pirates et dégâts externes sont
  conservées. Les résultats finaux de GitHub doivent être vérifiés sur le commit
  publié, et non déduits des succès de la base.

Le snapshot local ne contient pas toutes les images. Une compilation Vite locale
ne certifie pas le prébuild complet ; le workflow `Full production build` est
la preuve de livraison. Cette passe n'ajoute pas de nouvelle recette navigateur :
les recettes existantes, dont les quatre soins tactiques de la PR 5, sont conservées.

## Limites

Il ne s'agit pas d'une extension du suivi de vie à tous les événements externes
ou de toutes les invocations cinématiques : le périmètre ajouté est la commande
RPG native différée. Les écritures arbitraires directes dans les PV, sans passage
par les transitions du moteur, ne sont pas détectées rétroactivement.

Pas de nouveau moveset, contenu canonique 1:1, campagne complète, asset, classeur
original récupéré ou test sur appareil physique. Aucun merge ou changement
administratif/production effectué par cette passe. Les transports temporaires
restent exclus de l'arbre et de l'ascendance de la PR.
