# Des aventures vécues dans la Cité

Cette passe reprend la PR #27 après `6f26ea5fcdf07f65b7088f2a7b08c72e7ee204ce`.
La demande est de remplacer les missions administratives et interchangeables
par des problèmes qui appartiennent aux habitants, à leurs mondes et au Nexus.

## Ce que le joueur doit pouvoir constater

Un habitant explique personnellement ce qui lui arrive. Le joueur peut lui
répondre « Je m’en charge », rejoindre l’équipement concerné, intervenir à
portée et voir cet équipement changer d’état. Le carnet rappelle la demande,
le lieu et la prochaine action ; il conserve les paroles et constats déjà
vécus. Une ancienne visite garde ses mots et ses décisions.

La réécriture porte sur **28 aventures jouables** : deux épisodes pour les
douze personnages du Nexus, deux aventures de Master Chief et deux d’Ellen
Ripley. Les **24 prolongements proposés** pour les personnages Nexus dans
l’Excel restent des travaux à réaliser, distincts de ces aventures jouables.

## Des problèmes propres à chaque personnage

La [relecture narrative](CITY_DIEGETIC_STORIES_2026-11-08.md) relie les douze
arcs Nexus aux sources antérieures : Première Brèche, Trames blessées,
mémoire, identité, outils et choix des personnages. Le Voile garde sa place
de membrane entre les Trames ; il ne devient pas une faction ennemie.

Mirelle tente de séparer deux appels de détresse. Bastion doit dégager un
retour de service et empêcher une ancienne flèche de conduire à la dixième
route condamnée. Nova éprouve les pulsations d’un passage instable. Loom
cherche qui imite une voix gardée dans son drone. Ces situations ont des
gestes matériels, un interlocuteur et des conséquences locales.

| Personnage invité | Aventure | Problème joué |
| --- | --- | --- |
| Master Chief | Le canal des survivants | Rétablir une liaison UNSC et préparer un retour couvert. |
| Master Chief | Le dernier relais | Installer un module radio, rétablir le retour et tenir une veille pour ceux qui suivent. |
| Ellen Ripley | L’accès au Narcissus | Isoler un circuit qui chauffe et ouvrir l’accès à la navette. |
| Ellen Ripley | Fermez ce conduit | Remplacer un relais, verrouiller le conduit et maintenir son alarme depuis le poste extérieur. |

Les incidents H-2/A-3 et leurs répliques sont des créations de la Cité.
Les histoires invitées restent dans `DLC/Halo` et `DLC/Alien`, avec leurs
références et les textes des visites antérieures. Ripley reste liée à son
incarnation de 1979 ; aucun équipement ultérieur n’est ajouté à ces quêtes.

## De l’interaction à l’état du monde

Le chemin de progression est unique : une interaction résolue avec le PNJ,
la vitrine, l’ancre ou le marqueur de l’étape courante. Le moteur contrôle
l’identité, le quartier, l’univers, la portée et l’ordre. Consulter le carnet
ou choisir une réponse ne fabrique pas une intervention matérielle.

Six familles d’équipement ont une présentation Canvas et des états distincts :
réparer un raccord, lire un signal, récupérer une pièce, fermer un verrou,
activer une balise et baliser une route. Les accessoires suivent la direction
visuelle existante. Les vitrines et ancres conservent leur dessin ; leurs
commandes reçoivent un témoin de fonctionnement.

Une intervention acceptée enregistre mission, étape, cible, type d’opération,
position réelle et ordre d’exécution. Les suites enregistrent aussi leur
choix d’origine, la révision de ce choix et, lorsqu’elle existe, la branche
jouée. Un marqueur déplacé ou un reçu d’une autre branche ne peut pas afficher
un équipement réparé. Une vitrine garde son identité lorsque sa recherche ou
sa pagination change son emplacement d’affichage.

Les équipements terminés restent dans le quartier après changement de mission
et chargement de sauvegarde. Lorsque deux interventions partagent un même
emplacement, la dernière jouée détermine son état ; l’objectif courant reste
prioritaire. Les accessoires conservent une empreinte de collision, sans
redevenir des interactions répétables. Le rendu ne modifie aucune progression
et respecte la préférence de réduction des animations.

Les effets sont locaux : commandes, balises, signaux et pièces de quête.
Cette passe ne simule pas une foule évacuée, un nouveau combat ou un trajet de
navette. Elle n’accorde aucune récompense d’inventaire supplémentaire.

## Demandes, carnet et sauvegardes

Parler à un habitant disponible ouvre sa demande. « Je m’en charge » vérifie
de nouveau le PNJ et la distance au moment du clic, démarre l’aventure et
valide uniquement la rencontre réellement effectuée. Les récits d’origine
restent accessibles dans une section repliée. Les personnages sans ces
archives, dont Mirelle et les deux invités, peuvent donner leur demande.

Le carnet présente la voix du personnage, le lieu, le prochain geste, le
dernier événement vécu et le résultat. Recherche, filtres, pagination,
navigation clavier et retour du focus restent disponibles sur les formats
existants. Les étapes futures et résultats non joués ne deviennent pas des
souvenirs.

Les anciennes étapes restent lisibles avec leurs textes historiques. Le
joueur peut demander explicitement de rejouer la nouvelle aventure ; le
record antérieur, y compris ses champs inconnus, reste dans `previousStory`
et se lit dans « Ta première visite ». Aucune ouverture de menu ni aucun
chargement ne lance cette reprise.

Une suite déjà jouée continue de se référer à son premier chapitre réellement
accompli pendant et après la reprise de celui-ci. La distinction de révision
préserve aussi ses mots lorsque le joueur refait le même choix. Une reprise
explicite de la suite utilise le parent accompli le plus récent.

## Excel, DLC et FPS

Le [classeur de la PR](../excel/Multiverse_Breach_Missions_Cite_Par_Personnage_2026-11-08.xlsx)
conserve les six onglets, le suivi manuel et les formules. Les contrats
jouables exposent demande, lieu, actions, effets et sources. Les 24 propositions
Nexus sont des prolongements concrets ; les canevas génériques encore à
réécrire portent une indication explicite. La présence d’une ligne de backlog
ne vaut pas intégration dans le jeu.

Les profils de distribution restent base, Halo, Alien et Halo + Alien pour
ces contrats. Les sauvegardes des packs absents restent conservées.

Les améliorations FPS précédentes sont conservées. Deux recettes natives
supplémentaires exercent le plasma et la roquette ramassés pendant une partie
normale, avec la même graine Extraction : vol, contact, charge, pause et retour
au kit. Elles complètent les 17 cas existants. Leur présence dans le script
ne constitue pas un résultat d’exécution ; le résultat du nouveau head est
publié dans la [PR #27](https://github.com/darknigthmare/multiverse-breach/pull/27).

## Vérifications avant publication

- Moteur des missions et opérations : **98/98** tests, dont les parcours de
  toutes les branches existantes et les migrations historiques.
- Gate UI et gameplay : **480/480** tests après raccordement des nouvelles
  dépendances de la fixture du terminal Codex. Planification : **20/20**.
- Gate DLC : **112/112** tests, puis **180/180** contrôles de profils ; dossiers
  exclus réellement absents, archives invitées et imports React inclus.
- Registre : **505 packs, 504 univers, 506 points d’entrée** vérifiés.
- Les **44 commandes prebuild** sont strictement conservées, dans leur ordre.
- Les contrôles complémentaires du carnet, du classeur et des recettes natives
  sont consignés dans les preuves de la PR pour le head publié.

Le checkout local ne contient pas tous les médias DLC. Chromium local échoue
avant l’ouverture de la page avec `socket(): Operation not permitted`.
La compilation de production complète et les parcours natifs utilisent donc
les workflows existants. Les résultats verts du head précédent ne sont pas
réutilisés comme preuve de cette réécriture.
