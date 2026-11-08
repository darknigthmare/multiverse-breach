# Cité : quatre prolongements, objets portés et conversations

## Périmètre de cette continuation

Cette passe prolonge la révision publiée `d87f038ea5537d06f9448db1e699fe6a122181b9` de la PR #27. Elle ajoute quatre aventures originales du Nexus aux 28 contrats déjà présents. Le catalogue comprend donc **32 contrats : 28 Nexus, deux Halo et deux Alien**.

Le problème traité est concret : l’habitant doit avoir une raison personnelle de demander de l’aide, le joueur doit intervenir dans le quartier, et le résultat doit rester perceptible après son retour. La rencontre ne doit pas ouvrir d’emblée les tableaux du terminal.

## Les quatre aventures ajoutées

| Personnage | Aventure et prérequis | Travail réalisé par le joueur | Résultat conservé |
| --- | --- | --- | --- |
| Mirelle | **La garde de nuit**, après **Une réponse dans les parasites** | Reprendre le circuit réellement ouvert ou gardé fermé, apporter la lampe de réserve, isoler le raccord chaud, préparer un second point d’écoute puis essayer une coupure | Lampe allumée au poste, second circuit testé ; réponse finale de Mirelle |
| Quillon | **La pompe après la lampe**, après **Le courant doit arriver ici** | Isoler la pompe, porter l’unique rotor de réserve, l’installer, choisir l’amorçage ou la purge, remplir le récipient puis rapporter le rotor usé | Pompe avec débit et récipient visibles ; pièce usée à l’établi ; coût encore assumé par Quillon |
| Nadir | **La sonde sous les décombres**, après **La porte qui ne rend rien** | Maintenir ou rétablir la fermeture correspondant au premier essai, soulager le câble, récupérer N-4 depuis le côté sûr et la porter à sa table | Sonde matériellement revenue, passage fermé en attendant un essai complet |
| Tessera | **La fenêtre que j’ai choisie**, après **Une chambre pour Tessera** | Isoler le rappel des projecteurs en conservant la projection éteinte si elle l’était déjà, déplacer le réflecteur, installer une poignée ou un cordon indépendant puis vérifier le réglage | Réflecteur éclairant la place choisie ; les deux souvenirs restent conservés |

Chaque histoire a deux variantes héritées du choix précédent et deux interventions choisies. Les chapitres sont respectivement 3, 3, 2 et 2. Les quatre fins passent par une nouvelle rencontre avec le véritable PNJ concerné. La décision seule ne termine pas l’intervention.

Les lieux sont des points de travail de la scène Nexus existante. L’alcôve de Tessera n’introduit pas un nouvel intérieur navigable. Les répliques ne constituent pas une animation d’escorte ou un comportement autonome de PNJ. Ces limites restent explicites dans le lien entre la proposition de design et son adaptation jouable dans l’Excel.

### Cohérence narrative

Les histoires utilisent les dossiers originaux, la Trame blessée et les conséquences des aventures précédentes. Quillon ne transforme pas une seconde preuve en seconde pièce. Nadir distingue une sonde rapportée à la main d’un retour vérifié par le seuil. Tessera conserve ses deux mémoires et son choix actuel. Mirelle ne sacrifie pas sa boucle protégée pour rétablir l’éclairage.

Aucune nouvelle mission invitée, incarnation ou arme canonique n’est ajoutée. Les récits Halo et Alien déjà présents restent dans leurs packs, avec leurs limites d’époque et leurs sauvegardes historiques.

Sources : `src/game/mosaicCityDeliveries.js`, les quatre entrées parentes dans `src/game/mosaicCharacterStories.js`, `src/game/characterPlaques.js`, `src/game/heroes.js`, `src/game/lore.js` et `src/game/ocCampaign.js`.

## Transport dans la scène et sauvegarde

La prise et la remise sont des opérations physiques sur un marqueur. Le joueur doit atteindre la bonne cible à portée ; l’identité de la mission, de l’étape, du quartier et la géométrie du marqueur sont recontrôlées. Le reçu ajoute seulement l’identité de l’objet et l’action de prise ou de remise.

**Un seul objet de quête peut être porté.** Le symbole suit l’avatar dans les coordonnées du monde, avec son nom au-dessus du nom du joueur. Un bandeau lisible rappelle ce qui est en main. Changer de mission ou de quartier conserve le transport. Une autre prise est refusée jusqu’à la remise, en nommant l’objet déjà porté.

L’objet porté est déduit des étapes accomplies et des reçus valides. Il ne dépend ni d’un état React temporaire, ni de l’ouverture du carnet, ni d’une animation. Une sauvegarde/reprise au milieu du trajet retrouve le même objet. Une remise sans sa prise correspondante n’avance pas l’étape. Une opération historique ou un dossier d’un pack absent ne fabrique pas une possession.

La pompe utilise deux transports successifs : rotor de réserve vers la pompe, puis rotor usé vers Quillon. Une pièce montée reste dans la pompe pendant que l’autre revient à l’établi. Il n’y a pas de création d’or, de monnaie, d’objet d’inventaire ou de récompense de campagne.

### Résultats matériels

Les nouveaux accessoires utilisent le rendu Canvas existant : lampe, pompe, rotor, sonde et réflecteur. La pompe amorcée et remise sous tension montre le débit et le récipient rempli ; la lampe et le réflecteur montrent leur lumière. Les résultats principaux des quatre histoires occupent des positions distinctes et restent présents ensemble après rechargement.

Les 28 anciennes missions conservent leur ordre, leurs identifiants et leurs visites historiques. Les quatre nouvelles sont ajoutées après elles. Les données inconnues des sauvegardes restent conservées.

### Cas d’import corrigé

Un reçu inconnu pouvait auparavant imposer une séquence entière maximale à une nouvelle intervention. Une prise était alors validée avec une séquence non représentable, ce qui empêchait de retrouver le cargo. L’ordre des nouvelles opérations utilise désormais seulement les reçus valides d’étapes connues. Si aucun entier sûr suivant n’existe pour ces reçus, l’action est refusée avant d’avancer. Deux régressions couvrent la conservation des données inconnues et le refus sans mutation.

## Conversation distincte du carnet

`MosaicResidentConversation` porte le dialogue de rencontre dans une fenêtre dédiée. Le joueur voit le résident, sa demande, le lieu, la réponse et le prochain geste lorsqu’il reste une étape. Une réponse finale ne reçoit pas un faux objectif « Pour continuer ».

Les archives générales sont repliées. **Ouvrir mon carnet** remplace explicitement la conversation par le terminal. L’acceptation recontrôle toujours le PNJ dans la scène ; consulter la demande ou le carnet ne l’accepte pas à distance.

La conversation conserve la pause de scène existante. Le titre reçoit le focus ; une acceptation réussie mène au bouton de reprise. Tab, Échap, fermeture par le fond et restauration du focus utilisent le gestionnaire modal commun. La reprise n’invente aucun appui de déplacement. Les guides et services du terminal restent disponibles par leurs commandes habituelles.

## Équipement FPS de cette même passe

**V** range l’arme de terrain et reprend le kit personnel ; **B** reprend cette arme avec son chargeur, sa réserve et la recharge restante. Le nom et le stock rangés sont visibles dans le groupe de statistiques mesuré par le placement de la vue, et dans le tiroir de commandes. Un nouveau ramassage remplace cet emplacement et l’annonce.

L’emplacement appartient au héros et à la partie courante. La pause gèle les délais ; les ticks actifs écoulent la recharge, y compris pendant le rangement. Les capacités et projectiles déjà lancés sont conservés. Fin, abandon et récupération nettoient l’emplacement. Voir `docs/extinction-city/FIELD_EQUIPMENT_2026-11-08.md` pour les validations et les limites.

## Excel et DLC

Le classeur de la PR conserve 1 912 identités et 3 824 propositions. Les quatre propositions correspondantes reçoivent un lien explicite vers leur adaptation jouable et son périmètre. Elles ne valident pas automatiquement le suivi manuel de design, de lore ou de recette. Les 20 autres prolongements Nexus restent ouverts avec leur texte d’origine.

Les contrats disponibles sont désormais : base 28 Nexus ; Halo 28 Nexus + 2 Halo ; Alien 28 Nexus + 2 Alien ; Halo et Alien 32. Le harnais des profils copie les deux nouvelles dépendances du moteur, avec les dossiers des packs exclus physiquement absents. Aucun nouveau défaut de séparation de production n’a été établi par la revue DLC de cette passe.

## Preuves et limites au moment de la préparation du commit

- Gate UI/gameplay complet : **503/503** tests réussis sur l’intégration.
- Moteur des contrats, opérations et cargo : recettes de déplacement, branches, sauvegardes, refus et coexistence des objets ; journal local `/tmp/multiverse-next-city-validated.log`.
- Cargo : **27/27** tests, incluant les deux régressions d’import et la lampe déjà allumée pendant son essai.
- FPS : **101/101** tests ; 48 combinaisons moteur de modes/profils/armes et huit fins victoire/défaite sans modification des récompenses.
- Planification/catalogue : **21/21** ; profils physiques de contrats : **7/7**, dont quatre configurations d’installation.
- Lint ciblé, syntaxe des recettes, construction de la fixture carnet et compilation Vite directe réussis. La compilation directe ne remplace pas le lifecycle complet de production.
- Les **44 commandes prebuild**, leur contenu et leur ordre sont inchangés ; SHA-256 de la chaîne : `706f07554e39f05f19f00ddd21ba6a821a6989825e7d1b3048e31ee6fb86b97d`.

Chromium local a été essayé et s’arrête avant l’ouverture de la page avec `socket(): Operation not permitted`. Les nouvelles recettes navigateur ne sont donc pas déclarées réussies localement. La PR publie séparément leurs résultats GitHub Actions sur le commit effectivement testé.

La matrice Cité attend 50 contextes et 176 complétions avec les prérequis, dont 32 combinaisons de livraison FR/EN. Elle observe les véritables déplacements, les `fillText` du cargo et leurs transformations, les reçus, les sauvegardes pendant le trajet, les changements de mission et les réponses finales. La recette FPS conserve les 19 cas, les graines et les seuils existants ; les trois ramassages naturels ajoutent le cycle V/B, la recharge, la pause et le nettoyage. Ces nombres sont des **attendus de recette** jusqu’à lecture des artefacts de la nouvelle révision.

Les propositions encore à créer, l’art individuel et l’équilibrage exhaustif restent ouverts. Cette passe ne revendique ni une partie navigateur pour chacun des 1 811 combattants, ni une validation canonique globale. Les bundles volumineux restent un chantier distinct ; aucune amélioration de cadence d’affichage n’est déduite des tests fonctionnels.
