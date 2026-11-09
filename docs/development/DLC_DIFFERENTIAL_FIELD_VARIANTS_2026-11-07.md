# Suite DLC, système et terrain — 7 novembre 2026

Base : `6465f3c9b0b253e99805a67177ed3e20033c0bd1` (PR #26).
Cette suite récupère le lot interrompu non publié. Elle conserve React/Vite, les moteurs Canvas, les identités et la chaîne de sauvegarde existants.

## Critères joueur et éditeur

- Changer d’édition sans retransmettre chaque média commun inchangé ; refuser un paquet altéré ou issu d’une autre révision et ne jamais écraser une installation existante.
- Voir quels packs sont réellement inclus, sans confondre installation, visibilité et déblocage.
- Naviguer au clavier dans Système / Packs DLC / Terrain, conserver les formulaires entre onglets, respecter texte agrandi et marges.
- Accepter une enquête demandant deux reliques distinctes, les rejoindre par déplacement normal et conserver les preuves après sauvegarde ou absence du DLC.
- Choisir une opération de relais dont le périmètre doit être débarrassé des ennemis avant progression et confirmation. La pause ne donne aucun crédit.

## Distributions différentielles

`scripts/dlcDistributionDelta.mjs` compare deux **exports source strictement audités** de la même révision Git. Les octets déjà présents dans l’édition de départ sont référencés ; seuls les contenus différents sont copiés dans `blobs/<sha256>`. Les copies publiques et sources identiques partagent un seul blob de transfert.

```bash
node scripts/dlcDistributionDelta.mjs create \
  --base ../edition-base --target ../edition-halo --out ../delta-halo

node scripts/dlcDistributionDelta.mjs apply \
  --base ../edition-base --delta ../delta-halo --out ../edition-halo-installee \
  --sha256 EMPREINTE_DU_MANIFESTE_RECUE_PAR_UN_CANAL_FIABLE
```

Les exports doivent contenir un `sourceRevision` complet identique. Le producteur peut le fournir à `exportDlcDistribution({root,profile,out,sourceRevision})`. Le résultat de `create` fournit l’empreinte du manifeste à transmettre séparément avec la publication. Une empreinte contrôle l’intégrité ; elle n’est pas une signature de l’éditeur.

L’application reconstruit un **nouveau dossier indépendant**, audite tous ses fichiers et imports, puis publie ce dossier par renommage. Elle refuse les chemins traversants, liens symboliques, secrets, entrées dupliquées, fichiers supplémentaires, base modifiée, blobs altérés et destinations existantes. Un échec retire uniquement son dossier temporaire. Le retrait d’un pack utilise le même mécanisme dans le sens inverse.

Limites : le parent des sorties et les entrées doivent être réservés à l’opération, sans écrivain concurrent non fiable. Ce n’est pas une sandbox pour des sources hostiles. Le paquet est destiné aux **distributions source** ; il faut ensuite compiler et publier la nouvelle édition. Il ne télécharge pas du code en pleine partie. La reconstruction recopie les fichiers réutilisés : elle économise le **transfert**, pas l’espace disque de l’édition finale. Les 5 977 ressources communes restent préservées ; aucune exclusivité n’est déduite d’une simple absence de référence littérale.

## Menu Système

Le tiroir réel conserve sa couche d’isolation modale. Trois onglets utilisent un seul point de Tab, les flèches gauche/droite, Début et Fin. Les panneaux cachés restent montés : un brouillon de compte n’est pas perdu à chaque changement d’onglet. Échap ferme le tiroir et restitue le focus au bouton système.

**Packs DLC** : catalogue issu des manifestes, compteur d’installation réel, recherche, filtres inclus/non inclus et pages de douze entrées. Les packs d’illustrations sont signalés. Ce panneau ne débloque ni ne supprime de progression et ne prétend pas installer à chaud.

**Terrain** : règles standard ou variantes pour les prochaines opérations, descriptions FR/EN, retour aux règles standard. Les préférences utilisent leur propre clé locale, jamais la sauvegarde de progression. Une écriture refusée garde le choix en mémoire pour la session et l’indique explicitement.

Le CSS est limité au système : textes relatifs, contrôles de 44 pixels minimum, retour à la ligne et prise en compte de `--game-safe-area` et des encoches. Aucun contenu historique n’a été supprimé.

## Enquête croisée — Cité

Activer **Système → Terrain → Enquête croisée** avant de prendre un nouveau dossier. Le quartier doit proposer un habitant possédé, une ancre et au moins deux reliques accessibles. L’acceptation verrouille la règle : changer les préférences ne modifie pas un dossier déjà accepté ou archivé.

La séquence est : habitant → première relique → seconde relique différente → ancre. Une seconde lecture du même objet n’avance pas. La commande d’approche sélectionne la prochaine relique non examinée et passe par la marche et les interactions à portée existantes. Le texte indique le nombre de preuves. La normalisation protège les prérequis et conserve les dossiers des packs absents. Aucun paiement ou bonus économique ajouté.

## Relais contestés — FPS

Activer **Système → Terrain → Périmètre contesté**, puis **Relais sous pression** dans Solo Extraction. Une signature ennemie vivante à une distance inférieure ou égale à deux unités de la balise bloque la synchronisation et la confirmation finale. Les 180 ticks actifs déjà exigés restent nécessaires ; les ticks gagnés sont conservés quand un ennemi revient. Les ennemis morts ou aux coordonnées invalides ne brouillent pas le relais.

Le HUD existant reçoit le message « Périmètre contesté » et le nombre d’ennemis. Les modes standard ne changent pas. Le module ne modifie pas les ennemis, les dégâts, les munitions, les récompenses ni le générateur aléatoire.

## Vérification

Les outils du guide local game-ui-ux ont été appliqués aux composants existants ; les fichiers vendored n’ont pas été modifiés.

- `node --test scripts/dlcDistributionDelta.test.mjs scripts/fieldOperationVariants.test.mjs scripts/mosaicReconnaissance.test.mjs scripts/extinctionRelayOperation.test.mjs` : 54 tests ciblés, dont 17 pour les paquets différentiels et 16 pour les variantes/préférences.
- `npm run test:dlc:profiles` : inclut automatiquement les nouveaux tests différentiels via son glob existant. Les profils complet, Base, Halo et mixte instancient les véritables catalogues et l’application.
- `npm run test:ui-immersion` : régressions historiques d’interface.
- `SYSTEM_PROFILE=all|base|halo node scripts/buildSystemSectionsFixture.mjs` puis `node scripts/browserSystemSections.mjs` : 21 parcours Chromium, FR/EN, 390×844, 844×390 et 1365×900 ; texte à 150 %, HUD à 140 %, marge 32 pixels. Un cas par édition refuse le stockage et vérifie le choix conservé en session.
- `python scripts/browserFieldVariants.py --require-art` : scènes réelles, deux enquêtes, une observation de brouillage par des ennemis réels et deux parties FPS complètes dont les documents de replay sont comparés. Les déplacements après acceptation, dégâts et victoires ne sont jamais injectés.
- `node node_modules/vite/bin/vite.js build --config scripts/viteCodeOnly.config.js` vérifie seulement le code compilé, **pas** un `npm run build` avec ses médias et 44 précontrôles.

Le workflow `dlc-field-continuation.yml` conserve les journaux, captures, traces de marche, replays et identifiants Git. Les résultats de cette suite ne se substituent pas aux autres workflows de la PR. Les 44 commandes historiques du prébuild et leur ordre restent inchangés.

## Travaux non clos par ce lot

L’installation de code DLC à chaud dans le navigateur, la preuve complète permettant de déplacer les quatorze décors encore communs, la recette consolidée de tous les écrans, les autres illustrations personnelles et les validations sur appareils physiques/services cloud réels ne sont pas déclarées terminées. Les nouveaux parcours utilisent des composants réels avec un profil de test préparé ; ils ne certifient pas toutes les combinaisons de personnages et de contenus.
