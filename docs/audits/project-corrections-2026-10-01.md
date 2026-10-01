# Multiverse Breach : reprise des priorités, 1 octobre 2026

## Sources et version

- GitHub `master` : `6fd4fd24d690e84f6dfbfc022cd844d0def116ec`, dernier commit du 31 août 2026.
- Vercel : production READY du 1 septembre 2026, même SHA ; https://multiverse-breach.vercel.app répond HTTP 200 et sert `index-CTJ4fEuP.js` avant cette correction.
- [Audit de fidélité partagé](https://chatgpt.com/share/6abdc1d1-1a7c-83eb-9a7a-d979173f3754), récupéré intégralement en HTTP 200 : annonce 3 853 entrées, 131 P0 et 1 666 P1. Le classeur lié reste une pièce jointe `sandbox:` inaccessible depuis le partage ; ces totaux ne sont pas une lecture indépendante du classeur.
- [Listing du jeu partagé](https://chatgpt.com/share/6abdc211-077c-83ed-9234-b17050a117e9), récupéré intégralement : le partage s'arrête pendant les appels outils masqués, sans listing final.
- [Suivi historique](conversation-implementation-2026-08-31.md) et [dernier lot Wave6](wave6-noncombat-production-2026-08-31.md). Wave6 reste à 15/500 dossiers terminés ; cette correction ne génère aucun nouveau dossier.

## Corrections réalisées

| Problème confirmé | Résultat |
| --- | --- |
| Ripley Alien 1979 utilise le fusil et le power loader d'Aliens | Kits distincts Nostromo/Narcissus et LV-426/Sulaco, plaques et références explicites ; IDs sauvegardés conservés. |
| Predator mélange Jungle Hunter et les armes de Predator 2 | Jungle Hunter 1987 utilise lames de poignet, plasma et camouflage ; Combistick et Smart Disc retirés de ce kit. |
| Freeman mélange Gravity Gun HL2 et Gluon Gun HL1 | Incarnation HL2 / HEV Mark V, kit Gravity Gun, override final et plaque alignés. |
| Shadow Moses affiche RAY et peut charger d'autres menaces | Stage 12 sélectionne réellement REX et les Genome Soldiers ; terrain dédié, victoire exigeant la défaite de REX. |
| New Vegas est associé à Liberty Prime | Stage 22 devient le camp du Légat / bataille de Hoover Dam, sélectionne réellement Lanius et exclut Liberty Prime. |
| Tactics gagne dès disparition des ennemis sans finir les objectifs | Extraction, portails, artefacts, contrôle et autres objectifs restent obligatoires ; IA, files de tours et rappels poursuivent ou terminent correctement la mission. |
| Un soin peut retirer des PV à un héros irradié | Plafond de soin respecté sans baisse de PV ni résurrection implicite dans RPG/Tactics/Smash. |
| Le dégât d'un piège annule sa paralysie de cinq secondes | Durée conservée et commandes/IA bloquées pendant la paralysie RPG/Tactics/Smash ; actions de mêlée interrompues, garde cassée préservée et un seul compteur par tick. |
| Quad Damage et Magia Erebea n'appliquent pas leurs bonus annoncés | Bonus réels et temporaires dans RPG/Tactics/Smash ; aperçu RPG aligné, durées indépendantes, réapplication sans dérive des statistiques. |
| Décors de cité traversables ou sans occlusion | Empreintes des bâtiments et bornes, déplacements au clic avec détours, PNJ protégés et ordre commun de profondeur. |
| Le Codex vivant des Archives n'est pas interactif | Approche et interaction ouvrent réellement les Archives. |
| Un paquet peut contenir des pointeurs LFS en guise d'images | Audit local et prébuild refusent pointeurs, fichiers absents et jonctions ; contrôle du manifeste d'envoi renforcé. |

Les modifications des données ne certifient pas les anciens sprites ou décors. Les incarnations et scènes corrigées gardent `visualReviewStatus: pending`. Les identifiants et chemins historiques sont préservés. Le catalogue conserve ses 3 199 dossiers et 39 stages statiques ; six prompts sont alignés avec les incarnations corrigées. Cinq anciens visuels disponibles repassent en attente, le sixième étant déjà en attente. Le registre compte désormais 1 026 disponibles et 2 173 en attente, contre 1 031 et 2 168 avant correction. Les images et journaux historiques ne sont pas réétiquetés : [preuves de remédiation](../rift-dossiers/canon-remediation-2026-10-01.json).

## Priorités encore ouvertes

1. **P0 visuels connus** : les 25 substitutions Wave4 sont confirmées par les prompts archivés et consignées dans [le registre dédié](fidelity-p0-wave4-2026-10-01.json). Elles restent à régénérer et revoir. Les réussites techniques de Wave4 ne constituent pas une validation de fidélité.
2. Revoir les visuels des incarnations et scènes corrigées ; corriger ensuite les autres mélanges de canon et les rosters hérités hors des deux missions traitées.
3. Compléter le tutoriel détaillé : restauration visible d'une balise, équipement réel à l'Atelier, simulateur RPG sans sanction et départ en mission. Étendre ensuite les collisions aux autres décors, les liens contextuels du Codex et la couverture manette/tactile.
4. Poursuivre les assets manquants, sprites d'escorte, identités et comportements spécifiques, progression, dialogues et contenu après campagne déjà listés dans le suivi historique. Les chiffres d'assets du suivi historique datent d'août ; ils ne constituent pas un nouvel inventaire de toutes les familles.
5. Découper les bundles pour réduire le chargement initial : le build conserve un Hub de 5,74 Mo et des données de 2,41 Mo minifiés. Cet avertissement de taille reste visible.

Les adaptations explicitement nommées « Safe » gardent leur statut d'adaptation. Aucune protection de tenue, d'âge ou de contenu n'est retirée pour leur attribuer artificiellement une conformité 1:1.

## Visuels et publication

Les deux tentatives de Vader et la tentative de Bob ont été refusées par `image_gen` avant fourniture d'une image exploitable. Prompts, références, empreintes et refus sont conservés dans [le rapport Vader](../openai-generation-prompts-2026-10-01/vader-correction-attempts.json) et [le rapport Bob](../openai-generation-prompts-2026-10-01/bob-minions-correction-attempts.json). Leurs sprites et leurs provenances antérieures restent inchangés ; aucune correction visuelle n'est annoncée.

Le quota LFS bloquait le déploiement Git automatique d'août. Aujourd'hui, `git lfs pull` réussit ; les 500 SHA-256 et les 9 177 fichiers publics suivis ont été vérifiés. Aucun changement de facturation, aucun asset supprimé. Voir [la procédure de publication](../VERCEL_PUBLICATION.md).

## Vérification finale

- `npm run build` réussit, y compris toute la chaîne de prébuild : **730 tests Node dans 15 suites**, sans échec ; contrôles standalone et audits boosters, sprites/provenance, portails, cosmétiques, dossiers, musique, campagne, DLC, univers originaux et progression réussis.
- `npm run lint` et `git diff --check` réussissent.
- Les 9 177 fichiers publics suivis sont présents dans le build, avec les mêmes tailles que leurs sources.
- Chromium charge la version compilée depuis `vite preview` : nouvelle trace locale, prologue, Nexus, entrée dans la cité, marche jusqu'au portail Archives, approche du Codex vivant et interaction de proximité ouvrant « Archives et lore des univers ». Aucun état de mission ni position n'a été téléporté pour ce parcours. Aucune erreur JavaScript observée dans ce parcours.
- La cité a également été vérifiée en viewport 390 × 844 sur le serveur de développement : largeur du document de 390 px et commandes tactiles présentes. Cette vérification ne couvre pas tous les combats, cadrages et contrôles manette.
- Les contre-revues ont corrigé le segment d'un PNJ pouvant couper une borne et la durée de garde cassée lors de dégâts supplémentaires en Smash. Les régressions associées passent.

## Livraison

Le correctif est préparé dans la branche locale `codex/multiverse-corrections-2026-10-01`. L'écriture GitHub est bloquée par une erreur 403 « Resource not accessible by integration ». Le contrôle automatique a refusé l'appel de déploiement Vercel parce que sa cible et sa portée n'étaient pas précisées, notamment pour la production. Aucune publication externe de ce lot n'a réussi.

Un patch et un bundle exportables sont préparés avec le bilan et les preuves de vérification. L'accès GitHub en écriture et une autorisation explicite du déploiement ciblé restent nécessaires pour la publication.
