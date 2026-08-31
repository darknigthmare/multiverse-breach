# Conversation Multiverse Breach : intégration et reste à traiter

Source demandée : https://chatgpt.com/share/6a952ae2-d0fc-83eb-979d-fdd9d4683b45

Conversation retrouvée : « Améliorations du jeu Multiverse Breach », identifiant `6a94d4bd-c8b8-83eb-813b-f08ef93efaf3`.

Ce document est un suivi d'implémentation, pas une transcription. Le connecteur a fourni deux échanges et tronquait la première réponse à 20 000 caractères. La page publique du partage a ensuite été récupérée (HTTP 200) : son contenu textuel JSON contient la première réponse complète de 34 148 caractères et la demande de 3 226 caractères. La fin a été lue, y compris la campagne, l'accueil narratif, le tutoriel détaillé et le plan de la Cité-Mosaïque. Le deuxième échange de la tâche d'origine a aussi été lu intégralement. Aucun export supplémentaire n'est requis.

## Lot en cours de validation

| Demande | Implémentation |
| --- | --- |
| Orientation des ennemis | Orientation tactique 8 directions distincte du miroir du sprite ; dos/flanc corrigés ; engagements Fighter/Smash et direction réelle des projectiles. |
| RPG : choisir et confirmer | Sélection unique, multiple bornée, groupe, zone, ligne et cône ; prévisualisation commune à l'impact ; confirmation/annulation ; P1/P2 ; attente optionnelle. |
| RPG : soins et coûts | Alliés/ennemis correctement séparés ; résurrection selon capacité ; pas de dépense sur cible invalide ; pas de changement de cible invisible ; DEF appliquée. |
| Statistiques préparées | Synergies d'archétype appliquées une seule fois aux membres concernés dans RPG/Tactics/Mêlée ; bonus de collection affichés dans le même ordre que le combat. Lame Critique conserve +20 % ATQ et ignore explicitement 20 % de DEF, sans ignorer garde, couverture ni bouclier ; aperçu RPG identique. |
| Objets de combat | 42 règles d'identité explicites ; plus d'effet déterminé par l'index ; métadonnées prioritaires, heuristiques signalées, cas neutres exclus des pools consommables. Les boucliers protègent les PV au lieu de les soigner ; pas de soin/dégât/charge implicite. |
| RPG : placement et effets | Enveloppes de sprites et barres dans l'arène ; tirs orientés vers la cible ; mêlée déplacée seulement si appropriée. |
| Escortes | Identité de mission puis rôle d'univers ; sprite existant, représentation provisoire explicitement signalée ; briefing commun ; chemin évitant obstacles ; extraction obligatoire. Les illustrations de PNJ spécifiques restent à produire. |
| Boosters | Tiroirs OC/Nexus et franchises ; recherche complète ; dossier interne, probabilités et totalité des cartes paginées ; consultation séparée de l'achat ; historique fermé. |
| Rotation payante | Confirmation 500 Or ; rotation personnelle temporaire ; permanents, échéance quotidienne, possessions et Compas conservés ; sauvegarde avant débit affiché ; requête idempotente. |
| Personnalisation | Déplacée vers Dossier d'Ancre : HUD, bannière, titre et effets ; soutien de combat distingué des effets cosmétiques ; sauvegardes existantes conservées. |
| Grandes listes | Recherche avant pagination, 24 par défaut, choix 12/24/48 ; roster, réserve, héros d'armurerie, inventaire et boutique. |
| Équipement et équipes | Propositions avant/après à confirmer ; réserve protégée ; équipes aléatoire/par univers/optimisation ; calcul de préparation A.R.C.A. partagé avec l'affichage. |
| Codex | Dossier univers interne commun à Collection et Codex ; compteurs calculés sur les données ; navigation et données absentes protégées. |
| Campagne OC | Sections Actes/Verrous/Dossier exclusives ; Chronique et Codex alignés sur les mêmes opérations canoniques et la conclusion choisie ; reprise de l'opération exacte ; récompense de chapitre correctement nommée. Textes de lore conservés ; trois fonds de prologue remplacés par des visuels Nexus existants. |
| Mosaïque | Bandeau d'entrée, accueil narratif bref rejouable, trois repères validés par des actions réelles ; progression persistante, pause/reprise/ignorer/rejouer. Interactions de proximité ; catalogue complet des destinations autorisées avec recherche et pagination, indépendant de la limite de PNJ rendus. |
| Cadence et sauvegarde | Horloge fixe 60 Hz pour les combats et la course, mouvement de la cité basé sur le temps écoulé ; pause hors onglet, remise à zéro au retour ; garde contre écrasement depuis un onglet périmé, y compris lors d'une restauration cloud automatique ; export proposé si persistance indisponible. |

Les tests et la compilation ne remplacent pas une recette visuelle en jeu. Le navigateur intégré échoue actuellement sur l'erreur d'environnement `apply deny-read ACLs` ; aucune recette navigateur de ce lot n'est revendiquée. Un contrôle ciblé de six bitmaps d'objets par un agent confirme seulement leur identité, pas leur cadrage dans toutes les interfaces.

## Chantiers non clos par ce lot

- Produire des sprites d'escorte propres aux rôles et univers ; les réemplois actuels restent provisoires et indiqués comme tels.
- Examiner visuellement le cadrage de chaque illustration/atlas et chaque variante de scène. Ne pas confondre présence d'un fichier avec qualité ou provenance vérifiée.
- Auditer l'ensemble des statistiques, talents, résistances, interruptions, invocations et effets temporaires, au-delà des corrections RPG et des pickups identifiés.
- Approfondir les identités de combat de Nova, Marrow, Sable et les autres héros ; nouveaux comportements de boss et compositions ennemies ; objectifs de mission évolutifs.
- Étendre les choix de progression, spécialisations de commandement, rattrapage des recrues et parcours d'acquisition ; protéger les paliers de collection lors de l'extension des catalogues.
- Ajouter les dialogues contextuels, les distinctions sonores et équivalents visuels, les points de reprise de mission et la couverture complète manette/tactile.
- Développer les défis d'après-campagne sans progression obligatoire de puissance.
- Compléter le tutoriel détaillé de la cité : restauration visible d'une balise, équipement réel à l'Atelier, simulateur RPG sans sanction ni acquisition fictive, parcours des Archives et départ ; le guide actuel ne doit pas être présenté comme cette séquence complète.
- Produire et vérifier la direction artistique des quatre quartiers, leurs changements narratifs persistants et les images de PNJ/obstacles nécessaires ; aucun bitmap nouveau n'est généré dans ce lot.
- Aligner et vérifier les collisions/occlusions des décors de cité, au-delà des bornes de déplacement et des PNJ déjà traités.
- Revoir chaque cadrage de booster/carte/sprite individuellement et terminer les relations de navigation contextuelles du Codex (fiches de personnages, lieux, objets et historique interne).
- Réconcilier le manifeste sprites périmé avec les fichiers et preuves actuels, sans requalifier artificiellement la provenance.

Ces pistes viennent de la fin complète du partage et du deuxième échange de la tâche d'origine : elles ne doivent pas être déclarées terminées sur la seule base des correctifs de ce lot.

## Inventaire vérifié avant la prochaine vague

État disque et catalogues vérifiés le 31 août 2026, avant toute nouvelle génération :

| Famille | Présents/validés | Manquants/à traiter |
| --- | ---: | ---: |
| Héros, feuilles de sprites | 1 912 / 1 912 présents | 0 fichier absent ; manifeste périmé pour 670 |
| Ennemis | 608 / 1 518 présents | 910 |
| Boss | 712 / 1 507 présents | 795 |
| Décors de gameplay | 304 / 1 192 présents | 888 |
| Objets du registre d'assets | 1 597 / 1 597 présents | 0 dans ce registre |
| Pickups authored restaurés, contrôle ciblé des chemins utilisés | 30 / 63 présents | 33 chemins sans image |
| Épreuves | 334 / 334 présents | 0 |
| Finales | 55 / 55 présents | 0 |
| Dossiers de failles | 994 / 3 199 validés | 2 205 |

Les contrôles de complétion des vagues 4 (334/334) et 5 (500/500) réussissent. Les 14 dossiers existants suivants ont un prompt désormais différent du catalogue : `9210, 9211, 9212, 9214, 9216, 9217, 9220, 9222, 9223, 9225, 9226, 9229, 9230, 9231`. Leur présence ne permet pas de les marquer validés : régénération ou migration avec preuve requise.

Les 33 chemins de pickups manquants concernent trois objets par univers : Breaking Bad, Buckethead, Buffy, Charmed, Dino Crisis, Half-Life, Kaamelott, Portal, Stargate, System of a Down et The Matrix. Ce contrôle utilise l'identité authored restaurée, et non l'ancien objet de relique associé arbitrairement par index. Les deux lignes d'objets du tableau ont donc des périmètres différents et ne constituent pas un total global de fichiers uniques.

Prochaine vague identifiée, pas encore générée : **500 dossiers = 309 expanded + 191 arcs personnage**, du stage `34421` au stage `9469` dans l'ordre du catalogue courant. Créer un constructeur Wave6 séparé ; ne pas réexécuter la création Wave5 dont la base de sélection est figée. Les 14 reprises doivent être explicitement marquées comme remplacements.

## Validation et publication

- **553 tests Node réussis dans 14 suites**, dont 215 tests ciblés du lot ; les tests standalone et audits supplémentaires du prébuild ont également été exécutés.
- `npm run lint` : réussi.
- Audits boosters, cosmétiques, sprites/provenance, portails, dossiers, musique, campagne/DLC et univers originaux : réussis.
- `npm run check:progression` : réussi après mise à jour de trois contrats de source devenus obsolètes (rendu PNJ, helper d'orientation et identité des objets). Les vérifications ont été renforcées, sans suppression des exigences.
- Compilation `npm exec -- vite build` : réussie en 21,85 s. Avertissement conservé : les chunks Hub (5,73 Mo minifiés) et données (2,41 Mo) restent volumineux ; leur découpage est un chantier distinct.
- Contrôle préalable du paquet : 13 031 fichiers, dont 589 décors ; aucun `.codex`, fichier local de secrets ni fichier temporaire inclus.
- Pas de recette navigateur : l'environnement de contrôle reste indisponible. La présence des assets et les tests automatiques ne certifient pas tous les cadrages.

Le lot est prêt pour commit/push et vérification d'un candidat Vercel avant promotion. Le statut de publication effectif est communiqué avec le résultat de la livraison ; cette ligne ne constitue pas à elle seule une preuve de mise en production.
