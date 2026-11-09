# Multiverse Breach — corrections de fiabilite, 16 octobre 2026

Base : `67ef3ead15a078d74403f56e34bf6a105cd3ad06` (`master`).
Cette livraison corrige le code et ses tests. Elle ne fusionne pas la branche principale, ne modifie aucun compte ou aucune sauvegarde de production et ne certifie pas les assets manquants.

## Corrections par rapport a l'audit

| Point | Travail livre | Limite |
| --- | --- | --- |
| MB-01 | Expiration absolue ou `expires_in`, renouvellement anticipe, une requete partagee, adoption des jetons renouveles, Web Locks entre fenetres compatibles, une seule reprise apres un refus HTTP 401. | Tests avec transport simule ; pas de compte de production utilise. Sans Web Locks, l'exclusion est limitee a la fenetre. |
| MB-02/03 | Calendrier UTC unique pour accueil, hub, resultats RPG/Tactics et Fighter ; semaines ISO commencant lundi ; migration preservant les reclamations courantes. Remise a zero complete des compteurs et reclamations avant le premier resultat du nouveau jour. | UTC est un choix explicite commun aux appareils, pas minuit local francais. |
| MB-04 | Acces au stockage proteges, session en memoire si refus, deconnexion locale non bloquee par une erreur d'ecriture, nouvelle trace/purge avec protection de la copie precedente. | Un stockage inaccessible ne peut pas conserver une partie apres fermeture. Une copie impossible d'une trace encore lisible bloque son remplacement plutot que detruire l'original. |
| MB-05 | Lecture unique des reponses JSON/texte/HTML/vides, statut HTTP conserve, delai maximal de transport et annulation. | Aucune reprise automatique d'une ecriture dont le serveur pourrait deja avoir accepte le contenu. |
| MB-06 | Epoques d'operation : les anciennes reponses ne restaurent plus une autre trace apres import, nouvelle partie, connexion/deconnexion ou conflit entre onglets. Sauvegardes automatiques serialisees et verifiees contre la garde locale. | Invalider une reponse ne retire pas retroactivement une ecriture deja acceptee par le serveur. Le controle de version `updated_at` reste en place. |
| MB-07 | Noyau des sauvegardes normalise : monnaies et niveaux finis, equipe valide et sans doublon, inventaire type, compteurs, historique ; sauvegarde brute de secours avant migration/remplacement ; quarantaine des racines corrompues. | Les IDs possedes inconnus sont conserves pour compatibilite ; les migrations specialisees des cartes et des carrieres restent responsables de leurs schemas. Pas de certification de tout catalogue futur. |
| MB-09 | Temporisations tactiques en ticks de simulation a 60 Hz, pause et x2 coherents, callbacks annules a la fin/dispose, attente respectant paralysie et mort. Tests REX et pause mis a jour pour verifier la nouvelle horloge reelle du moteur. | Les temporisations des autres moteurs non concernees ne sont pas reecrites. |
| MB-10 | Hub : modes Course/Fighter/CustomBattle charges a la demande. Projection compacte de disponibilite des sprites au lieu d'embarquer le manifeste de provenance complet. Roster du GameCanvas memorise entre mises a jour du HUD. | Le paquet `game-data` reste volumineux. Pas de mesure FPS, memoire GPU ou chargement sur telephone physique. |
| MB-23 partiel | Soins des pickups, assists, effets de terrain et vol de vie tactique alignes sur le plafond d'irradiation. Statistiques/vol de vie bases sur la perte reelle, pas le surkill. | La matrice exhaustive de tous les talents, invocations et modes reste ouverte. |
| Finition de compte | Libelles usuels FR/EN de connexion/chargement/sauvegarde et export de la copie de secours. | Le parcours mot de passe oublie (MB-08) reste a implementer et verifier avec les redirections et emails. |

Deux autres erreurs concretes sont corrigees : les barils tactiques touchent les huit cases voisines et peuvent se transmettre l'explosion sur une ligne/colonne ; le briefing d'escorte du GameCanvas lit `escortUnit`, le champ reel du moteur.

## Donnees et compatibilite

Aucun ID de mission, recompense, heros, objet ou asset historique n'est remplace. Les copies d'inventaire sont conservees ; seuls les doublons d'equipe sont retires. Les sauvegardes gardent le schema v9 et ajoutent `activityProgress.calendarVersion = 1`. Une copie brute limitee a la derniere sauvegarde remplacee est conservee sous `<cle>_backup_v1`, y compris pour la carriere kart historique. L'export de secours reste disponible dans les outils de compte. Aucune fusion cloud aveugle n'est ajoutee.

Le fichier `public/sprites/generated/sprite-availability.json` n'est qu'un index UI derive. Il ne remplace ni le manifeste complet, ni les preuves de generation, ni une revue de fidelite. Apres une modification du manifeste :

```sh
npm run sprites:availability
npm run sprites:availability:check
npm run test:audit-reliability
```

Le prebuild garde tous ses anciens audits et tests et ajoute le controle de cet index ainsi que la nouvelle suite de fiabilite.

## Verification locale executee

- Nouvelle commande `npm run test:audit-reliability` : **88 tests passes, zero echec, zero annulation, zero skip**. Elle comprend 14 tests de reconciliation, dont les 8 contrats deja presents et 6 nouveaux scenarios de reponse tardive/copie de secours.
- Campagne elargie : **102 fichiers de tests, 1 274 cas**, **1 261 passes et 13 echecs lies a des images absentes de la copie locale de sources**. La meme selection sur la base intacte donne **1 268 cas, 1 255 passes et les memes 13 echecs**. Aucun nouvel echec dans cette comparaison. Ne pas presenter cette execution comme une suite integrale verte.
- Les 13 cas concernent Newt, les boosters, le prologue et les illustrations OC, le ledger d'icones, la banniere Nexus et les reemplois de sprites d'escorte. Les tests ne sont ni supprimes ni marques ignores.
- Compilation `vite build` : reussie. La copie locale contient les sources et manifestes, pas tous les bitmaps/audio : cela ne remplace pas le prebuild et le conditionnement complet des assets dans l'environnement de publication.
- Lint des fichiers touches : zero erreur/avertissement avec la configuration du depot.
- Tentative Chromium/Playwright locale : navigation bloquee par `ERR_BLOCKED_BY_ADMINISTRATOR`. Aucun parcours navigateur ni nouvelle capture de gameplay ne sont revendiques. Les tests de rendu du titre et du panneau de compte sont des tests SSR, pas une recette interactive.

## Taille des bundles — meme environnement de compilation

| Bloc | Base minifiee | Corrige minifie | Base gzip (Vite) | Corrige gzip (Vite) |
| --- | ---: | ---: | ---: | ---: |
| HubScreen | 5 899,48 ko | 1 440,99 ko | 925,26 ko | 323,18 ko |
| GameCanvas | 373,90 ko | 363,99 ko | 112,90 ko | 109,39 ko |
| game-data | 2 517,56 ko | 2 517,56 ko | 842,07 ko | 842,07 ko |

Le gros gain du hub provient de la suppression du manifeste complet de son JavaScript, sans suppression de la source historique. La projection UI conserve exactement 5 520 chemins uniques et leur source. Le bundle d'entree augmente legerement avec les protections de sauvegarde ; cette passe n'annonce pas que tous les paquets sont devenus petits. L'avertissement de taille pour HubScreen/game-data reste visible.

## Recette restant a effectuer avant validation de livraison

Parcourir une nouvelle partie et une sauvegarde existante sur le deploiement de la PR ; tester deux comptes reellement distincts, expiration de session, deux onglets, passage UTC a minuit et lundi, stockage refuse/quota, import et reprise de la copie de secours. Verifier visuellement les menus lazy, l'escorte et les explosions tactiques, puis effectuer la campagne de bout en bout sur clavier, manette et tactile. Les actifs visuels, boss/campagnes incomplets et autres chantiers MB-08, MB-11 a MB-22 et la matrice complete MB-23 ne sont pas declares termines par ce lot.
