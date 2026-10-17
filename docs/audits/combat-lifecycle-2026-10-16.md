# Audit combat — cycle des actions et artefacts (16 octobre 2026)

Base de cette passe : `c51993e1a69d7ecdd2428d28f2396497346811a1`, PR #2.
La production et les sauvegardes réelles ne sont pas modifiées.

## Défauts traités

- Une attaque RPG différée appartenait à une fonction de rappel, pas à la vie
  de son lanceur. Un KO suivi d'une résurrection pouvait donc réactiver l'ancienne
  attaque. Les actions sont maintenant associées à leur lanceur, annulées au KO,
  à la sortie du roster et à la fin du combat. Une annulation marque aussi les
  actions déjà extraites de la file pendant le tick courant. Le verrou ennemi est
  libéré seulement par son propriétaire. Les actions de scénario indépendantes
  (par exemple la finale scriptée de Barbossa) conservent leur rôle.
- Une purification sélective supprimait l'ensemble des statuts. La liste des
  statuts réellement purifiés est désormais partagée par la sélection, l'aperçu
  et l'impact : infection, glitch et radiations selon la compétence. Un effet
  positif ou un statut non demandé reste intact. Un soin avec purification peut
  sélectionner un allié déjà au plafond de soins s'il reste un statut traitable.
  L'ordre historique reste **soin puis purification**.
- La résurrection d'une unité à 1 PV maximum affichait 0 PV alors que l'impact
  rendait 1 PV. Le calcul est commun et borné. La résurrection ne redonne pas une
  ancienne action en attente. Les PV et sélections invalides sont refusés avant
  consommation de l'ATB, de la recharge ou de la charge spéciale.
- Un contexte de ciblage périmé pouvait être réutilisé. Les cibles admissibles
  sont recalculées avant engagement; les identités confirmées restent figées pour
  l'impact. Une compétence retirée pendant le ciblage ferme celui-ci sans crash.
- Un dégât négatif pouvait provoquer étourdissement et effets secondaires : il
  est maintenant rejeté. Réappliquer un statut ne raccourcit plus sa durée.
- Les moteurs RPG et Tactics ne renvoyaient pas `true` après activation d'un
  artefact, contrairement au contrat du bouton. L'interface le laissait donc
  utilisable. Les trois moteurs renvoient un succès explicite, refusent la pause,
  la fin et les valeurs invalides. Le bouton possède un verrou synchrone contre
  le double clic et ne dépense rien après un refus.
- L'artefact exécuté était recherché par l'univers du héros, pas par son ID
  équipé. Un héros Nexus portant la mallette Resident Evil utilisait ainsi le
  mauvais artefact. L'affichage et l'activation résolvent désormais le même ID,
  avec respect des univers masqués, objets désactivés, porteur KO et mode sans
  objets. Aucun item d'inventaire n'est supprimé par ce correctif.
- Une ouverture contenant un nouveau héros puis des doublons mettait tout le
  compteur de garantie à zéro. Le compteur suit maintenant l'ordre des cartes,
  ignore les cosmétiques et conserve les doublons après le dernier nouveau héros.

## Contrôles reproductibles

```sh
npm run test:audit-combat
npm run test:audit-reliability
npm run test:audit-followup
npm run test:polish
```

`test:audit-combat` : **48 tests** (25 cycle RPG/soutiens/boosters, 23 artefacts).
La suite utilise les vrais moteurs via Vite SSR. Les tests de bouton exécutent le
véritable corps du gestionnaire de GameCanvas, avec état isolé. Les 48 passent
localement, sans test ignoré ou annulé. Les suites antérieures 88/88, 61/61 et
39/39 passent également. Le groupe de contrats élargi de la CI passe localement
**346/346**. Ces groupes se recouvrent : ne pas les additionner en total unique.

L'analyse des 14 fichiers JavaScript modifiés signale 0 erreur/0 avertissement.
La compilation Vite des sources réussit. HubScreen reste à 1 441,26 ko minifiés /
323,33 ko gzip; GameCanvas passe à 367,44 ko / 110,36 ko avec ces protections.
Le manifeste et tous les contrôles de prébuild précédents sont conservés.

## Recette navigateur et limites

La CI inclut `scripts/browserRpgLifecycle.py`, à exécuter contre le serveur Vite
local de la CI. Six scénarios : quatre parcours RPG desktop/mobile en FR/EN
(sélection automatique, choix manuel, annulation, purification, résurrection,
pause pendant un impact différé et démontage), puis deux parcours d'artefact
cross-univers avec double clic. Le script utilise GameCanvas, les contrôles et le
rendu réels; les états de départ et les compétences de purification/résurrection
sont synthétiques et préparés dans une page **de test** sous `scripts/fixtures`.
Cette page n'est pas une entrée de production et n'ajoute aucun accès debug au jeu.
Les requêtes sortant du serveur local sont bloquées. Les résultats et captures
sont archivés par la CI, y compris en cas d'échec. Les 11 parcours Auth précédents
restent dans la même CI.

Le navigateur de l'environnement local a refusé la navigation vers Vite
(`ERR_BLOCKED_BY_ADMINISTRATOR`); aucun succès navigateur local n'est revendiqué.
Consulter les résultats JSON du run GitHub pour le résultat effectif des scénarios.
Les assets absents de la copie de sources utilisent les fallbacks du moteur et
sont consignés : cette recette ne certifie pas la direction artistique, ne joue
pas toute la campagne et ne remplace pas le prébuild intégral des assets.
Aucun compte, email, transport cloud réel, abonnement ou base de production n'est
utilisé. Le chantier complet des talents, des rencontres et des animations reste
ouvert.
