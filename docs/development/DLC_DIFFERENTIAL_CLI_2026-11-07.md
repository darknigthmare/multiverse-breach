# Chaîne CLI des éditions différentielles — 7 novembre 2026

Ce lot prolonge les [paquets différentiels](DLC_DIFFERENTIAL_FIELD_VARIANTS_2026-11-07.md)
et les [dépendances partagées explicites](DLC_SHARED_ASSET_DEPENDENCIES_2026-11-07.md).
Il ferme un manque du parcours de distribution : l'API d'export acceptait déjà
une révision source, mais sa commande ne permettait pas de la transmettre.
Les exports produits uniquement par CLI ne pouvaient donc pas servir de base
à `delta create`, qui exige cette révision.

## Critères

- Produire les éditions de base et Halo, inspecter leur différence, reconstruire
  Halo puis revenir exactement à la base avec les commandes publiques.
- Conserver l'export simple sans révision pour une construction autonome.
- Refuser une révision mal formée avant toute création de sortie.
- Inspecter sans écrire de fichier ni créer de dossier temporaire.
- Partager les vérifications d'entrées entre inspection et application.
- Distinguer les octets transférés des fichiers reconstruits, et annoncer les
  contrôles encore nécessaires après inspection.
- Conserver les dossiers d'entrée et les destinations existantes en cas d'échec.

## Export explicite

`scripts/exportDlcDistribution.mjs` accepte désormais
`--source-revision FULL_GIT_SHA`. La valeur doit contenir les quarante caractères
hexadécimaux minuscules du commit de sources distribué. Elle est transmise au
reçu existant, dont le schéma reste inchangé. La commande affiche également
`sourceRevision` dans son résumé ; `null` signifie que cette valeur n'a pas été
déclarée.

Le défaut historique conserve un reçu sans ce champ. Cet export reste auditable
et constructible. Un changement d'édition différentiel utilise deux nouveaux
exports de la même révision explicitement déclarée. Le SHA ne certifie pas à lui
seul qu'un checkout était propre et ne remplace pas une signature d'éditeur ;
les empreintes des reçus continuent de lier les fichiers réellement exportés.

Les aides `--help` des deux CLI et le [mode d'emploi canonique](../../DLC/README.md)
décrivent les commandes complètes, notamment l'inspection et le retrait de Halo.

## Inspection et application

La nouvelle commande est :

```sh
node scripts/dlcDistributionDelta.mjs inspect \
  --base EDITION_SOURCE --delta PAQUET --sha256 SHA256_FIABLE
```

Elle exige la même empreinte de manifeste que `apply`. La préparation commune
aux deux opérations effectue :

1. L'audit strict de l'édition source, avec ses médias, sources et imports.
2. La validation de la révision commune, de l'empreinte du manifeste, de ses
   chemins et des fichiers dont les octets sont réutilisés depuis la base.
3. La fermeture du paquet : aucun fichier absent ou supplémentaire, aucun lien
   symbolique. Chaque blob unique est lu et son contenu vérifié.
4. La validation du reçu cible par le validateur existant de distribution :
   profil, identités sélectionnées, chemins, provenance et empreintes déclarées.
5. La concordance exacte entre le reçu cible et les fichiers annoncés dans le
   delta, puis entre le reçu et le profil réellement transporté.
6. Une nouvelle vérification de la base et du manifeste avant de rendre la main.

Une inspection réussie porte le statut **`inputs-verified`**. Elle ne possède
pas de champ `passed` susceptible d'être confondu avec une installation complète.
Le champ `pendingChecks` conserve explicitement :

- `reconstructed-target-distribution-audit` ;
- `standalone-build` ;
- `browser-playthrough-and-saves`.

Le graphe de sources cible n'est pas reconstruit virtuellement pendant
l'inspection. L'audit strict de ce futur arbre est exécuté par `apply` après sa
reconstruction et avant publication du nouveau dossier. La compilation et les
parcours navigateur restent des étapes ultérieures. Chaque application refait
les vérifications d'entrées ; un ancien rapport d'inspection ne les dispense pas.

## Sélection, transfert et retour

Le rapport donne les profils de départ et d'arrivée, les IDs ajoutés, retirés
et conservés. Un retour vers l'édition de base emploie le même mécanisme dans
le sens inverse et restitue son reçu exact. L'édition Halo d'origine reste
disponible.

`transfer.payloadBytes` compte une seule fois chaque blob unique, sans
compression. `transfer.packageBytes` y ajoute le manifeste. Les copies source
et publique d'une même ressource peuvent partager un blob de transfert.

`reconstruction.fileContentBytes` compte tous les fichiers du nouveau dossier
source, y compris ces copies distinctes et le reçu. Ce n'est pas une mesure de
blocs disque : les métadonnées du système de fichiers, `node_modules/` et le futur
`dist/` en sont exclus. Les octets réutilisés sont recopiés ; le dossier de base
reste présent.

## Vérification locale

`node --test scripts/dlcDistributionDelta.test.mjs scripts/dlcDistributionExport.test.mjs`
passe **54 tests** sous **Node 22.23.4**, dont **14 nouveaux**.
La suite `npm run test:dlc:profiles` passe **173 tests**, y compris les profils
réduits, les dépendances partagées et le chargement réel des catalogues et de
l'application par Vite. Les 54 tests ciblés sont inclus dans ces 173.

Les tests lancent réellement les CLI d'export, de création, d'inspection et
d'application dans des processus Node. Ils vérifient l'aller-retour
base → Halo → base par comparaison des arbres et des reçus, avec conservation
des éditions précédentes.

L'inspection est également exécutée avec les primitives d'écriture interdites
par le test. Les fichiers des entrées restent identiques. Les refus communs
couvrent les blobs modifiés, les fichiers supplémentaires, une liste cible
incomplète, une sélection de reçu invalide, une révision cible différente et
des octets de profil incompatibles. Les tests historiques conservent les
contrôles d'intégrité, de chemins, de liens et de destinations existantes.

Ces tests emploient des sources et médias synthétiques de taille réduite avec
les vrais exporteurs et auditeurs. Ils ne constituent pas de nouveaux parcours
du jeu complet. Aucun média, identifiant de contenu, code de sauvegarde ou
comportement d'installation en cours de partie n'est modifié par ce lot.
