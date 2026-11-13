# Profils d’installation et de distribution DLC — 7 novembre 2026

> La [reprise DLC, UI et Ville/FPS](DLC_UI_CITY_FPS_COMPLETION_2026-11-07.md)
> complète cette étape par la vérification des références UI statiques et de la
> création d’un profil neuf dans les distributions base et Halo. Elle conserve
> l’URL et les octets du décor Stargate utilisé par la création du profil, dont
> la source devient commune. Les volumes ci-dessous sont ceux de cette étape.

## Objectif

Cette étape poursuit la réorganisation de la PR #22, commit
`cc53a794238348aebeb0ad697048c3e66dab9a10`.
Le profil `all` conserve le jeu complet. Les profils `base` et `selected`
produisent une arborescence autonome dont les modules et les médias propres
aux packs absents sont réellement omis.

L’installation est une propriété de la distribution. Le masquage reste une
préférence sauvegardée du joueur. Il n’y a pas de téléchargement ni d’achat
depuis le menu dans cette étape.

## Critères observables et architecture

1. La base démarre avec ses vingt univers originaux et le Nexus, sans module DLC.
2. Une sélection suit les IDs des manifestes, refuse les inconnus et conserve
   l’ordre historique. Les 505 identités restent décrites, y compris Cloud
   Meadow au statut artwork-only.
3. Les identifiants des héros, stages étendus, variantes et arcs survivent à
   l’absence d’un pack. Les index historiques sont dans
   `DLC/content-identities.json`, généré uniquement depuis le catalogue complet.
4. L’équipe sauvegardée et l’équipe jouable sont distinctes. Les possessions,
   progressions OC, anciennes migrations et préférences des packs absents
   sont conservées. Une nouvelle composition explicite remplace la sélection.
5. Les arcs multivers exigent toutes leurs sources installées. Le lancement
   direct passe le même contrôle.
6. L’export refuse un dossier de sortie existant. Il vérifie un staging neuf
   puis le renomme. Un export existant ne peut pas servir de source canonique
   à un nouvel export présenté comme complet.
7. Le reçu lie les médias aux empreintes des sources canoniques. Il couvre
   aussi les sources transformées, les manifestes et les fichiers de build.
   Les fichiers manquants, supplémentaires, modifiés, les liens et les
   pointeurs LFS sont refusés. Les imports et le graphe du bundle sont contrôlés.
8. Les audits complets du dépôt canonique restent dans `prebuild`. Le cycle
   explicite `build:distribution` vérifie une distribution exportée.

## Extractions révélées par les profils

La comparaison syntaxique ne suffisait pas : les premiers essais runtime ont
révélé des contributions encore intégrées au catalogue commun.

- Treize packs complets de `canonRosterWavePartE.js` ont rejoint leurs modules
  DLC existants. Le JSON avant/après est identique.
- Cent cinquante-deux définitions de `EXPANDED_UNIVERSES` ont été déplacées.
  Cela ajoute 147 modules et complète leurs manifestes ; cinq dossiers
  possédaient déjà ce module. Les 491 univers, 1 175 stages et 1 911 héros du
  catalogue complet restent strictement identiques.
- Le préfixe générique des briefs de sprites a rejoint un module commun.
  L’ancienne API Doom Sweeper reste compatible ; les 737 caractères sont
  conservés exactement.

Le registre compte désormais 505 packs, 2 026 modules et 506 points d’entrée
générés. Les sources médias et les URL de la phase précédente restent inchangées.

## Assemblage

`scripts/dlcProfileTransform.mjs` analyse la syntaxe des adaptateurs runtime.
Il retire les imports exclus avec leurs éléments de tableau, propriétés de
dictionnaire et constantes privées associées. Il conserve l’ordre sans créer
de trous et refuse les usages non reconnus ou les dépendances ambiguës.

Les treize adaptateurs facultatifs et les trois exports R13 possèdent des
contrats d’indisponibilité explicites dans `dlcProfileAdapters.mjs`.
Les replis de combat utilisent Halo lorsqu’il existe, puis les données communes
réelles du Nexus. Les validations de cardinalité vérifient le sous-ensemble
attendu d’après les manifestes complets, avec leurs contrôles d’unicité conservés.

Les scripts d’outillage et de tests sont copiés et empreintés, sans être soumis
au retrait syntaxique des contributions runtime : leurs fixtures contiennent
volontairement des exemples de packs absents.

## Commandes

```sh
npm run dlc:registry:write
npm run dlc:identities:write
npm run test:dlc
npm run dlc:verify:migration

npm run dlc:export -- --profile config/dlc-profiles/base.json --out /tmp/multiverse-base
npm ci --prefix /tmp/multiverse-base --no-audit --no-fund
npm run build:distribution --prefix /tmp/multiverse-base
```

`config/dlc-profiles/halo.json` illustre une sélection. Les profils
`all` et `base` ont une liste `packIds` vide ; `selected` exige au moins
un ID connu, sans doublon. Le champ `sharedPolicy` reste `preserve-all`.

## Vérification

Les tests runtime instancient les vrais catalogues et importent App.jsx
via React/Vite, avec quatre profils :

| Profil | Héros | Univers ennemis | Stages étendus | Packs installés |
| --- | ---: | ---: | ---: | ---: |
| Complet | 1 911 | 525 | 1 175 | 505 |
| Base | 71 | 21 | 60 | 0 |
| Halo | 81 | 22 | 60 | 1 |
| Halo + Steins;Gate + Trololo | 87 | 24 | 74 | 3 |

Ces valeurs décrivent les catalogues observés ; elles ne mesurent pas les
performances d’affichage. Le profil base ne charge aucun module DLC. Les
profils base et Halo incluent aussi le rendu réel des onglets missions, équipe
et registre du Hub, afin de détecter les références à des stages absents. Les stages historiques exposés par
d’autres catalogues ne sont pas inclus dans la colonne des stages étendus.

`dlcPlayerState.test.mjs` extrait les véritables fonctions
`normalizeSavePayload` et `getCurrentSave` d’App pour vérifier les versions
de sauvegarde 6, 8 et 9 lors d’un retrait, d’une sauvegarde et d’un retour des
packs. Il complète les contrôles de stockage et de réconciliation cloud.

Le workflow `DLC distribution profiles` exporte base et Halo depuis un
checkout complet avec LFS, installe leurs dépendances, compile avec les
contrôles de reçus, puis exerce les vrais fichiers dist dans Chromium.
`browserDlcDistribution.mjs` vérifie les menus, le stockage local, le clavier,
un écran de 390 px et le lancement d’une mission sans simuler sa victoire.
Les reçus, journaux et captures sont archivés par le workflow. Les résultats
finaux du commit publié sont consignés dans sa PR et ses checks GitHub.

## Ressources communes et limites

Les 5 976 ressources communes ou sans attribution certaine représentent
7 164 740 880 octets dans cette référence. Elles sont conservées dans tous
les profils : la sélection n’effectue pas encore un tri exhaustif de ce fonds.

Des métadonnées globales, références éditoriales et règles de croisement
peuvent nommer des univers absents. Le contrôle garantit l’absence de leurs
dossiers, modules runtime et médias propres dans la distribution sélectionnée,
ainsi que leur indisponibilité dans le catalogue jouable. Il ne prétend pas
retirer chaque mention textuelle d’un univers.

Les reçus vérifient les octets et la composition du livrable. Ils ne remplacent
pas une inspection artistique des images ni les audits du dépôt complet.
