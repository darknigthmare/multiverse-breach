# DLC : éditions, sauvegardes et ressources par lots — 13 novembre 2026

Cette reprise continue `632d8bb9f`, déjà intégré avec GitHub `2333c2c0`. Le travail couvre la chaîne DLC et son interface, puis la vérification des vrais médias par lots de 40. Il conserve les identifiants, les sauvegardes et les ressources canoniques. La présence d’une image ou le succès d’un décodage ne certifie pas sa fidélité artistique 1:1.

## Résultat joueur

Le panneau **Système → Packs DLC** distingue l’édition complète, la base et une sélection de packs. Il expose l’inclusion réelle, les contenus déclarés et les dossiers d’univers sans simuler un téléchargement en jeu. Recherche sans accents, filtres, pages de 12, état vide expliqué et retour à la recherche sont accessibles au clavier. L’édition à 390 px avec texte à 150 % garde la recherche et les options lisibles.

Les missions inconnues d’un pack déjà connu sont maintenant conservées lors d’un aller-retour de sauvegarde avec un catalogue plus ancien. Exemple : un catalogue `[10, 11]` ne supprime plus le `99` d’un payload enregistré `[10, 99]`. Cet identifiant reste opaque ; il ne débloque pas une mission et ne s’ajoute pas à `completedStages`. Les possessions, préférences de réserve et sous-champs futurs sont conservés.

[Preuves d’interface](ui/AFTER/VALIDATION.md) · [Correction de sauvegarde](installation/README.md)

## Distribution effective

- Le contrat d’absence Pirates exporte aussi la constante du médaillon. L’ajout précédent compilait avec Pirates mais échouait en édition base/Halo ; une vraie compilation du composant reproduit puis vérifie ce cas.
- Les médias locaux référencés par `index.html`, dont le favicon, entrent dans le contrôle des dépendances communes. Les URL gardent leurs paramètres ; l’inventaire compare leur chemin canonique.
- Le builder refuse une sortie `dist` ou des parents qui seraient des liens symboliques avant que Vite puisse vider ce répertoire. Les fichiers construits sont comparés aux octets attestés.
- Le mode explicite `--documentation runtime` conserve les imports de production transitifs et évite de copier le corpus JSON de recherche. Le comportement historique `all` reste le défaut. L’inspection des cinq profils réels omet environ **3,745 Go** de JSON ; aucun fichier canonique de recherche n’est supprimé.
- Les compilations de l’application entière vérifient la fermeture des modules sélectionnés. Le nouveau workflow source ne nécessite pas l’hydratation des images pour détecter les exports manquants ; il ne remplace pas le workflow avec médias.

[Rapport de distribution](distribution/README.md) · [Inspection des sources réelles](distribution/canonical-source-inspection.json)

## Traitement des médias par lots

L’inventaire v2 contient **19 582 ressources**, représentant **15 276 034 454 octets**. Une copie simultanée des sources, de l’export et de `dist` dépasse l’espace disponible. À la demande de l’utilisateur, les octets sont donc lus et contrôlés par lots : au plus **40 fichiers et 128 Mio de payloads par lot**, avec un plafond de 256 Mio pour un fichier isolé et de 512 Mio de temporaires par traitement.

Quatre traitements utilisent au plus 2 Gio de temporaires configurés. Ils lisent les blobs Git du commit figé, le cache LFS canonique vérifié, trois images LFS retrouvées exactement dans l’historique Git, puis les payloads LFS distants nécessaires. Le cache de téléchargement appartient exclusivement au traitement temporaire. Après SHA-256, longueur, identité Git et décodage des rasters, les copies temporaires sont retirées ; les images canoniques et le cache LFS d’origine restent conservés.

Chaque lot possède un reçu atomique lié à son inventaire, son profil, ses limites et aux empreintes du vérificateur. Une reprise n’accepte pas un plan ou un code modifié. Les indisponibilités restent explicites. Ces empreintes ne sont pas une signature d’authenticité ; les formats non raster gardent une portée d’intégrité d’octets sans promesse de lecture audio/vidéo.

La [synthèse finale v2](batches/verified-v2/final-summary.json) compte **490/490 lots et 19 582/19 582 ressources validés**, soit **15 276 034 454 octets**, sans lot en attente ni ressource indisponible. Parmi elles, **17 087 rasters sont décodés** ; **2 495 autres fichiers** sont contrôlés pour l’intégrité de leurs octets. Les sources sont 17 631 blobs Git natifs, 1 746 payloads LFS téléchargés temporairement, 202 payloads du cache LFS et trois payloads retrouvés exactement dans l’historique Git.

La [première traversée v2](batches/verified-v2/run-summary.json) conserve son unique erreur réseau. Le reçu du lot 00090 est [archivé avant reprise](batches/verified-v2/first-pass-failures/batch-00090.json). La [reprise ciblée](batches/retry-unavailable-v2.mjs) récupère le seul fichier indisponible, conserve strictement les 39 résultats déjà acquis et réussit. Une seconde lecture des reçus n’a aucun lot à retenter.

Le cache LFS canonique garde **202 fichiers et 520 398 836 octets**, avec la même empreinte de chemins/tailles/dates avant et après ; aucun répertoire temporaire de lot ne reste. Les plafonds configurés et les échantillons de disque/RSS figurent dans le premier résumé. Les échantillons ne sont pas une mesure continue du maximum ; le RSS exclut les sous-processus.

Le [plan](batches/verified-v2/all-plan.json), les reçus et les recettes d’exécution permettent la reprise. L’[audit indépendant](batches/receipt-audit/final-audit.json) réussit : les **16 983 blobs Git natifs uniques**, soit **8 502 875 611 octets**, sont relus sans persister les médias et comparés aux 17 631 résultats natifs. Les **1 951 payloads LFS** sont liés aux SHA-256 et tailles des pointeurs Git canoniques. L’audit utilise Python sans exécuter les huit modules du vérificateur ; il ne redécode pas les images une seconde fois. Son [index compressé](batches/receipt-audit/native-git-sha256-index.json.gz) conserve les empreintes calculées. Aucun assemblage monolithique de tous les médias en une seule distribution n’est déduit de ces reçus.

### Défauts révélés et corrigés

La [première passe](batches/run-summary.json) reste archivée : 1 238 ressources validées, deux échecs de format et un arrêt de surveillance du cache. Elle n’est pas réétiquetée en succès.

1. Un renommage atomique normal du cache Git LFS pouvait produire un `ENOENT` entre la liste et la mesure des fichiers. Le monitor le prenait à tort pour une intrusion. La tolérance est maintenant limitée à cette mesure transitoire dans son propre cache ; les contrôles finaux, liens symboliques et fichiers étrangers restent stricts. Le monitor engagé est attendu avant la fermeture.
2. Deux textures AvP portaient des noms `.webp` mais contenaient des PNG. Elles sont maintenant de vrais WebP lossless, aux mêmes chemins, avec **zéro pixel RGBA différent**, y compris le RGB sous alpha zéro. Dimensions, transparence et absence de métadonnées sont préservées. Le contrôle indépendant utilise Pillow/libwebp contre les blobs Git d’origine.

[Correction du monitor](source-provider/README.md) · [Preuves des textures](batches/findings/AVP_FORMAT_CORRECTION.md)

## Reproduire

Node 22 et les dépendances verrouillées du dépôt sont requis. Utiliser la révision v2 de [ce checkpoint](batch-code-checkpoint-v2.json) pour reproduire le même plan ; un autre commit produit un nouveau plan et de nouveaux reçus.

```sh
npm run test:dlc
npm run test:dlc:batches
npm run dlc:bundle:check -- --profile config/dlc-profiles/base.json
npm run dlc:materialization:check -- --profile config/dlc-profiles/all.json

npm run dlc:assets:batches -- plan \
  --revision 9e690725dd06588e6b389e3df75d0e5e3ffeb6fa \
  --profile all --out /tmp/dlc-assets-plan.json \
  --max-assets 40 --max-batch-mib 128 --max-asset-mib 256
npm run dlc:assets:batches -- validate \
  --plan /tmp/dlc-assets-plan.json --receipts /tmp/dlc-batch-receipts \
  --batch all --max-batches 5 --allow-lfs \
  --historical-lfs-map docs/assets/dlc-completion-2026-11-13/historical-lfs/verified-historical-lfs-map.json
```

Le préflight de matérialisation reste strict : un blob Git ou un cache récupérable ne fait pas exister un fichier dans le checkout. Les commandes de validation par lots ne présentent pas un checkout partiel comme une distribution construite.

Sur un volume qui peut accueillir une édition entière :

```sh
npm run dlc:export:runtime -- --profile config/dlc-profiles/halo.json --out /volume/multiverse-halo
npm run dlc:distribution:check -- --root /volume/multiverse-halo
npm ci --prefix /volume/multiverse-halo --no-audit --no-fund
npm run build:distribution --prefix /volume/multiverse-halo
```

## Vérifications et limites

- `npm run test:dlc` : sortie 0 ; groupes TAP **113/113** puis **234/234**. Leurs domaines peuvent se recouper ; ce n’est pas un total de tests uniques.
- Lots v2 : **31/31** tests du provider, du moteur de reprise et du décodeur, dont la course de renommage réellement reproduite.
- Cinq profils de l’application entière compilent : complète, base, Halo, Halo + Steins;Gate + Trololo et Pirates. Ce sont des compilations de code sans copie des médias ni prébuild global.
- Interface : **8/8** cas dans quatre éditions, 48 captures finales, contrôle à 150 %, clavier et sentinelles de stockage. Aucun compte réel ni parcours complet de campagne/cloud n’est simulé comme réussi.
- Deux textures : décodage strict et revue indépendante **2/2** avec comparaison intégrale des pixels.
- Corpus de médias : **19 582/19 582** ressources dans 490 lots, 17 087 décodages raster et 2 495 contrôles d’intégrité sans décodage de format. Sources, observations disque/RSS et cache inchangé sont enregistrés ; le premier échec réseau reste archivé.

[Lot de 40 personnages poursuivi](../p0-p1-menu-continuation-2026-11-13/raster-lot-003/README.md) : un atlas de 16 poses Roman Legionary arcade Konami 1992 est réellement produit et revu. Il reste candidat **non raccordé** parce que les scènes Astérix actives sont sourcées BD. Aucun modèle arcade n’est imposé à ces scènes. Les **17 258 constats P1**, les 1 474 acteurs avec raster absent et les 22 P0 visuels historiques restent suivis séparément : ce contrôle DLC ne constitue pas une clôture artistique globale.
