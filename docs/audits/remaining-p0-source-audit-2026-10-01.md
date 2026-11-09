# Fidélité des 19 autres héros Wave4 — audit de données du 1 octobre 2026

Cet audit repère des erreurs encore présentes dans les données jouables des héros P0. Il ne modifie aucun kit, sprite, manifeste ni preuve de génération. Les six verrous Star Wars/Minions déjà corrigés sont exclus de ce lot ; **les 25 P0 visuels restent ouverts**. Le fichier JSON associé conserve les attaques réellement chargées, les emplacements, les actions proposées et les réponses HTTP/SHA des références.

La correction doit viser une incarnation précise : œuvre, année/arc, équipement, costume, pouvoirs et règles de la scène. Un nom fidèle ne suffit pas si `Starbolt Volley` ou `Stupefy` exécute encore une attaque de mêlée. Une mécanique transposée au combat Multiverse doit être décrite comme adaptation ; l’existence du PNG et ses preuves de génération ne certifient pas sa ressemblance.

## Corrections prioritaires avant de régénérer les images

| Héros | Donnée observée | Prochaine correction |
| --- | --- | --- |
| Saturnin the Duck | Fusil et balles générés à partir de la classe tactical, incompatibles avec le caneton réel. L’arc personnel possède maintenant une escorte originale, mais le kit sélectionnable reste armé. | Retirer le fusil et les balles de son kit ; utiliser locomotion/ruse/appel des compagnons et annoncer les actions jouables comme adaptation. Garder l’escorte cohérente et vérifier les noms des animaux à partir des épisodes INA. |
| Lilo Pelekai | weaponType laser, simple energy et Origin Burst générique : Lilo reçoit des pouvoirs extraterrestres qui ne sont pas les siens. | Verrouiller le film animé 2002 ; appareil photo/photographie, danse et soutien/ruse plutôt que laser. Ne pas convertir Lilo en guerrière surnaturelle ; les effets numériques de soutien restent une adaptation annoncée. |
| Stitch | Identité Experiment 626 implicite seulement ; slash et Origin Burst génériques sans force, griffes, morsure ni anatomie documentées. | Choisir et documenter une forme/scène 2002 ; kit force/griffes/morsure/agilité fidèle. Pas de rayon inné inventé ni de vêtements humanoïdes ajoutés sous l’étiquette canonique. |
| Jack Sparrow | Classe hacker transformée en laser et attaque energy ; absence de sabre, pistolet à silex et boussole dans son propre kit. | Sourcer costume et accessoires dans le film ; sabre/pistolet à silex et esquive/ruse. Si le stage reste celui de Davy Jones, choisir explicitement Dead Man’s Chest/At World’s End pour l’ensemble personnage/stage au lieu d’une référence 2003 silencieuse. |
| Roger Rabbit | Classe hacker -> laser et energy ; attaques génériques incompatibles avec un toon comique du film de 1988. | Kit physique toon et gags de mise en scène explicitement adapté ; préserver la vulnérabilité au Dip. Ne pas utiliser la Trempette comme médicament ou arme protectrice de Roger ; ne pas lui attribuer une arme laser. |
| Batman | weaponType gun + simple bullet + secondary projectile hérités tactical ; aucun gadget spécifique, pas d’incarnation 2008 verrouillée. | Remplacer le tir de balle générique par combat martial/batarangs. Distinguer un grapnel gun ou sticky-bomb launcher d’une arme à balles ; consulter directement le film/des références officielles 2008 pour les gadgets et le Batsuit. |
| Batman New 52 | Gun et balles hérités tactical ; le pack New 52 ne désigne pas d’issue/scène précise. | Choisir Endgame #35–40 ou un autre arc explicitement ; combat martial/batarangs et gadgets documentés. Ne pas transférer l’arsenal létal du Grim Knight ; si Justice Buster est utilisé, le traiter comme forme/équipement distinct et sourcé. |
| Hermione Granger | Stupefy Precision est melee malgré la baguette. Time-Turner Study Loop produit nexus_aoe offensif et Protego Maxima mélange les scènes/époques sans incarnation. | Corriger Stupefy comme sort à distance et préciser son effet d’étourdissement. Choisir Prisoner of Azkaban pour un kit Time-Turner (support/mission, pas explosion), ou Deathly Hallows pour un kit tardif sans Time-Turner mélangé. |
| Starfire | Starbolt Volley porte type melee ; les starbolts sont traités comme coups au contact. Nova Starburst utilise nexus_aoe, sans règle source explicite. | Donner aux starbolts une trajectoire/portée d’énergie fidèle et conserver le coup de pied en secondaire mêlée. Verrouiller l’incarnation et la couleur des pouvoirs à partir d’une référence de cette version. |
| Raven | Laser/energy et Origin Burst hérités hacker ; absence de distinction magie/émotions/soul-self, comme si Raven possédait un fusil laser. | Remplacer l’arme laser générique par magie/telekinésie et protection correspondant à l’incarnation. L’incantation et le soul-self doivent être sourcés dans cette version avant validation. |
| Cybernetic Spider - Flamethrower Loadout | Loadout nommé Flamethrower mais weapon slash et simple melee ; attaque spécifique non représentée. | Kit lance-flammes de patte documenté par manuel/gameplay, avec portée et apparence correspondantes. Le nom de variante ne doit pas être traité comme une autre personne. |
| Cybernetic Spider - Electro-Beam Loadout | Loadout nommé Electro-Beam mais gun/bullet hérités tactical. | Distinguer rayon électrique et balle ; préserver la silhouette araignée, les pattes et les contraintes du jeu source. Le wiki consulté vérifie Kelly/pattes interchangeables, pas à lui seul le détail des dix armes. |
| Cybernetic Spider (Dr. Michael Kelly) | Dr Michael Kelly correctement nommé mais kit hacker laser/energy générique ; incarnation et attachment actifs absents. | Choisir le loadout de base et les attachments canoniques ; escalade plafond/murs et descente par soie restent à vérifier dans le moteur. Sourcer les caractéristiques dans manuel/gameplay avant certification. |
| Harry Potter | Noms Expelliarmus/Stupefy/Protego/Expecto Patronum canoniques, mais pas d’incarnation ni équipement sourcé ; Expelliarmus zap inflige des dégâts et Patronus magic_aoe sert d’explosion générique. | Séparer fidélité des noms de fidélité des effets : désarmement, étourdissement, bouclier, Patronus défensif face aux Détraqueurs. Les dégâts contre tout ennemi doivent être explicitement adaptation du jeu. |
| Joker New 52 | Signature Strike/Breach Technique/Origin Burst génériques ; le stage Endgame et le gear Stapled Face Mask mélangent au moins des arcs New 52 distincts sans source verrouillée. | Verrouiller l’arc puis armes/gags toxiques conformes ; vérifier le masque de visage au lieu de transporter ce design vers Endgame. La fiche DC générale confirme le Joker/toxine mais pas l’incarnation New 52. |
| Harley Quinn New 52 | Slash et kit entièrement générique ; aucun run/numéro ne distingue Suicide Squad 2011, série Harley Quinn 2013 et autres costumes New 52. | Sourcer costume, maillet/batte et armes de la version retenue ; employer le bon accessoire au lieu du slash anonyme. Les pages officielles ciblées Harley/Suicide Squad ont été bloquées ici : pas de validation inventée. |
| The Grim Knight | Gun cohérent avec cette variante armée de Batman, mais tout le kit restant est générique et aucune incarnation/arme spécifique n’est verrouillée. | Préserver sa différence avec les Batman non létaux ; préciser arsenal/armure/techniques réellement montrés dans l’issue. Ne pas remplacer ses armes par les batarangs du Batman principal et ne pas présenter Origin Burst comme pouvoir canonique. |
| King of Pop Avatar | Le roster se nomme King of Pop Avatar, pas Michael Jackson ; slash/Origin Burst génériques. Il s’agit actuellement d’un hommage original, dont aucune fidélité 1:1 à une personne ou un jeu n’est validée. | Étiqueter l’avatar actuel comme original inspiré tant qu’il reste une création distincte ; si l’on ajoute un personnage source, utiliser un slot/documentation séparés, une incarnation précise et une revue réelle. Ne pas convertir simplement le nom et conserver le sprite original sous une fausse approbation. |
| Rhythm Guard | Rhythm Guard est un personnage inventé avec gun/bullet génériques ; aucune personne canonique identifiée dans l’univers musical. | Déclarer le statut original et rédiger son propre lore/équipement ; ne pas lui attribuer une fidélité 1:1 à Michael Jackson. Un accompagnant canonique exigerait une identité distincte et des références nouvelles. |

## Points de continuité à contrôler

- Jack Sparrow : choisir le film de référence du personnage en cohérence avec le stage ; une page de The Curse of the Black Pearl (2003) ne valide pas les événements de Davy Jones des suites.
- New 52 : Endgame est explicitement rattaché à Batman #35–40 par DC. Le masque au visage agrafé et Harley générique nécessitent des références d’arc précises, sans mélanger films, série animée et comics.
- Teen Titans : les pages générales DC confirment Raven/Koriand’r, mais ne verrouillent pas une silhouette animée 2003, Go! ou live-action. Les trois versions ne sont pas interchangeables.
- Harry/Hermione : les effets de désarmement, étourdissement, protection et Patronus doivent être distingués des dégâts génériques. Le Time-Turner de troisième année ne justifie pas une explosion Nexus ni un mélange silencieux avec les scènes de Deathly Hallows.
- Spider (1997) : les trois entrées sont des loadouts du même Kelly/araignée. Le wiki consulté vérifie l’identité, les attachments et le slasher de base ; manuel et gameplay restent nécessaires pour les détails du lance-flammes/Electro-Beam.
- Michael Jackson : King of Pop Avatar et Rhythm Guard sont actuellement des créations originales. Les renommer ne les transforme pas en représentation canonique ni ne valide leurs visuels. Il faut choisir une source précise avant d’ajouter un slot source fidèle.

## Références consultées et limites

Les références suivantes ont réellement répondu HTTP 200 et leur contenu a été lu. Les preuves de récupération sont dans le JSON ; les biographies générales ne sont pas des validations de toutes les attaques et costumes.

- source officielle : https://d23.com/a-to-z/lilo-stitch-film/
- source officielle : https://d23.com/a-to-z/who-framed-roger-rabbit-film/
- source officielle : https://d23.com/a-to-z/pirates-of-the-caribbean-the-curse-of-the-black-pearl-film/
- source officielle : https://www.dc.com/characters/batman
- source officielle : https://www.dc.com/characters/raven
- source officielle : https://www.dc.com/characters/starfire
- source officielle : https://www.dc.com/characters/the-joker
- source officielle : https://www.harrypotter.com/fact-file/characters-and-pets/hermione-granger
- source officielle : https://www.harrypotter.com/fact-file/characters-and-pets/harry-potter
- wiki secondaire : https://fr.wikipedia.org/wiki/Les_Aventures_de_Saturnin
- wiki secondaire : https://en.wikipedia.org/wiki/Spider:_The_Video_Game
- source officielle : https://www.dc.com/graphic-novels/batman-2011/batman-vol-7-endgame

Les pages Harley/DC ciblées, Grim Knight/DC et Death of the Family/DC ont répondu 403 ; la page Warner Bros The Dark Knight a été refusée par la connexion ; les URL essayées Thriller et Patronus ont répondu 404. Elles figurent comme tentatives bloquées dans le JSON et ne sont pas présentées comme sources consultées. Aucune référence primaire vidéo/numéro complet n’a été revue pendant cet audit.

## Fichiers à corriger dans un lot distinct

- `src/game/heroes.js` : appliquer les verrous après les anciens kits dérivés de classe, avec `incarnation`, `referenceUrls`, équipement, ancrages et statut de revue visuelle toujours pending.
- `src/game/loreAccuratePacks.js:20` et `:29` : les helpers considèrent seulement gun/laser et basculent tous les autres types en mêlée ; ajouter des exceptions explicites et testées pour les personnages concernés plutôt que réinterpréter tous les 1 912 kits dans un même changement.
- `src/game/expandedUniverses.js`, `src/game/requestedUniverseWave.js` : choisir l’arc/scène et supprimer les faux équipements ou la continuité composite.
- `src/game/characterPlaques.js`, `scripts/buildRiftDossierCatalog.mjs` puis catalogue/registre : propager les nouvelles sources ; les images déjà générées qui décrivent l’ancien kit doivent rester pending jusqu’à revue/régénération.
- Les scripts de test doivent vérifier le kit exécuté et la portée/effet dans le moteur, pas seulement le libellé de l’attaque.

Aucun de ces constats n’a été « résolu » par cet audit ; ce sont les prochains lots concrets après publication du lot validé.
