# Tactics — intégration des corrections du 16 octobre 2026

Cette passe conserve le lot `tactics-reliability` préparé sur la PR, son panneau de soutien, ses règles de soin/purification/résurrection et ses protections de tour. Elle ajoute des corrections révélées par une seconde batterie indépendante, sans remplacer les changements concurrents par une autre architecture.

## Correctifs supplémentaires

- La recette navigateur a détecté une régression du surlignage de déplacement : référence à un acteur hors portée dans `draw`. Le rendu utilise de nouveau sa liste de cases calculée ; deux tests supplémentaires exécutent la méthode complète côté joueur et adversaire pour empêcher ce retour.

- Ramassages tactiques refusés pendant pause, après démontage ou après fin de combat ; pas de consommation de l'usage.
- Impact des ramassages mesuré sur les PV effectivement retirés, pour les trois catégories de dégâts (ressource, soutien invoqué, ultime). Immunités, boucliers et sur-dégâts ne gonflent plus ce compteur.
- `applyDamage` renvoie une quantité finie également pour obstacles, artefact protégé et ennemis de scénario ; les protections REX/Scarab restent prioritaires.
- Déplacement manuel recalculé sur le plateau réel avant validation : une route bloquée après son surlignage ne permet pas de téléportation. La recherche respecte le budget restant.
- IA offensive et de soutien utilisent les déplacements restants et enregistrent les points dépensés. Activer l'IA après un mouvement manuel ne redonne pas un second déplacement complet.
- Une seule attente IA par acteur/tour durant un étourdissement. Aucun empilement de rappels si le bouton auto est réactivé.
- Une compétence retirée pendant la visée n'est pas considérée comme une sélection réussie.
- L'IA des deux camps exploite les compétences de soutien réellement définies : soin utile, purification, résurrection, garde et bonus. Elle évalue les positions atteignables sans modifier le lanceur réel, peut s'approcher, puis attend 500 ms de simulation.
- Les cibles de cette préparation restent identifiées : pas de soin redirigé vers un remplaçant sur la même case, ni après KO/résurrection du lanceur, changement de tour, disparition de la compétence ou fermeture du moteur.
- Les défenses soignantes et les règles de garde du lot concurrent sont conservées.

## Recette reproductible

`npm run test:audit-tactics` exécute 116 cas : 54 du lot conservé et 62 cas croisés de cycle de tour, soutien, IA, ramassages et géométrie. Les adaptations de la seconde batterie portent sur les noms du contrat public (`getSupportState`, `healing`, `getTacticsSupportGuard`) et le délai existant de 500 ms ; les assertions de comportement restent actives.

Les suites antérieures `test:audit-reliability`, `test:audit-followup`, `test:audit-combat` et `test:polish` restent inchangées. Les contrats de combat/sauvegarde et tous les contrôles artistiques de prébuild restent présents.

Le parcours Chromium Tactics utilise GameCanvas, le moteur, le panneau de soutien et les vrais boutons, dans une page séparée avec états synthétiques. La fixture conserve les libellés du profil de mission ; elle active les dangers seulement dans le scénario explicitement létal. Les logs récupèrent les erreurs du rendu interceptées par GameCanvas, et pas seulement les exceptions non traitées. Les composants des fixtures sont exportés pour satisfaire la règle React sans modifier leur comportement.

## Validation locale au moment de préparation

- Tactique : 116/116.
- Fiabilité : 88/88 ; suivi : 61/61 ; RPG/artefacts : 48/48 ; finition : 39/39.
- Objectifs tactiques : 18/18 ; analyse des 48 fichiers listés par la CI : aucune erreur ni avertissement.
- Compilation des sources : réussie. Hub inchangé à 1 441,26 ko minifiés / 323,33 ko gzip ; GameCanvas 383,90 / 114,91 avec ces protections. Pas de mesure FPS revendiquée.
- La première commande élargie a révélé deux fixtures qui limitaient artificiellement les cases surlignées sans limiter les points de déplacement. Les scénarios de ciblage immobile utilisent maintenant un budget réel de 0 ; leurs assertions de portée/splash/axe sont conservées. Le résultat final de la commande entière doit être vérifié dans la CI du commit livré.
- Navigation Chromium locale refusée par l'environnement ; les preuves navigateur valides doivent provenir des exécutions GitHub Actions, pas de captures fabriquées.

Les groupes se recouvrent : ne pas additionner ces nombres comme un total unique. Les artefacts de chaque run font foi pour son commit.

## Limites

Pas de campagne intégrale, de certification graphique, de test sur téléphone physique ou de validation SMTP/cloud réel. Les bitmaps ne sont pas tous présents dans le checkout de sources ; les rendus de secours ne sont pas des images finales. Cette PR ne modifie ni master, ni les données de joueurs, ni les comptes, ni les paramètres de facturation. La publication Vercel reste distincte des vérifications de sources.
