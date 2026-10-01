# Verrous source des 19 autres héros P0 — 1 octobre 2026

Le nouveau module `src/game/canonP0SourceKits.js` corrige les identités, équipements, textes et types d'actions des 19 héros restants du registre Wave4. La racine a branché ses helpers dans les héros et les plaques après publication du lot précédent ; cinq tests d'intégration valident maintenant la propagation aux dossiers. Le rapport de données préalable reste un instantané historique des problèmes observés avant ce module.

Les IDs sauvegardés, noms, univers, classes, statistiques, dégâts, délais de récupération, durées et réductions existantes sont conservés. Les profils décrivent maintenant les actions de contact ou à distance et ciblent un adversaire : portée Tactics 1/4, portée Smash 70/300, sans explosion Nexus générique. L'opt-in `canonCombatPresentation: true` et `action.canonPresentation` permettent à l'extension d'effets du lot de rendre les bons accessoires.

| Identités | Source choisie | Correction de données |
| --- | --- | --- |
| Saturnin | Série ORTF, 1965–1970, caneton réel | Corps et déplacements comiques ; suppression du fusil dérivé de classe. Combat clairement original, sans prétendre reproduire un épisode armé. |
| Lilo et Stitch | Film animé 2002 | Lilo humaine avec appareil photo/Scrump, aucune arme laser. Stitch en forme terrestre à deux bras, griffes/force/agilité ; pas de guerrier humanoïde inventé. |
| Jack Sparrow | The Curse of the Black Pearl, 2003 | Épée, silex, boussole ; aucun laser ni pouvoir de Davy Jones. La scène #269 est maintenant Isla de Muerta / Barbossa Duel, avec boss et roster du même film. |
| Roger Rabbit | Who Framed Roger Rabbit, 1988 | Physique toon comique, pas de laser ; vulnérabilité à la Trempette conservée dans le texte. Les gestes convertis en dégâts sont une adaptation du jeu. |
| Batman TDK | The Dark Knight, 2008 | Batsuit segmenté, combat martial, batarangs et grapnel ; aucune balle de pistolet générique. |
| Batman/Joker New 52 | Endgame, Batman #35–40, 2014–2015 | Batman martial/batarangs ; Joker couteau/toxine. La relique du visage rattaché est désormais étiquetée Death of the Family et n'équipe pas ce Joker par défaut. Infection et antidotes de l'arc ne sont pas simulés. |
| Harley New 52 | Suicide Squad volume 4 #1, 2011 | Redesign bleu/rouge, maillet et agilité. Sa présence au roster est déclarée crossover du projet et ne prouve pas une participation à la finale Endgame. |
| Grim Knight | One-shot The Grim Knight #1, 2019 | Arsenal de cette variante armée conservé, contrairement aux Batman ordinaires ; modèles exacts à revoir sur les pages originales. |
| Raven/Starfire | Série animée Teen Titans, 2003–2006 | Raven mystique/télékinétique ; Starfire starbolts verts à distance et coup de pied séparé en mêlée. Go! et Titans live-action exclus de l'incarnation. |
| Harry/Hermione | Order of the Phoenix, film 2007, cinquième année | Baguettes respectivement houx/plume de phénix et vigne/cœur de dragon ; sorts à distance/Protego. Retourneur de Temps offensif et Protego Maxima d'autres films retirés. Le Patronus cerf reste une capacité source documentée, sans explosion offensive. |
| Kelly/Flamethrower/Electro-Beam | Spider: The Video Game, PlayStation 1997 | Trois loadouts adaptés du même Kelly/araignée, pas trois personnages officiels. Slasher, flamme et rayon de patte remplacent laser/slash/balles génériques. Modèles et contraintes d'attachments encore à revoir sur manuel/gameplay. |
| King of Pop Avatar/Rhythm Guard | Créations originales Multiverse Breach | Statut original explicite, danse/microphone à la place du slash anonyme/fusil. Aucune certification comme Michael Jackson historique, Thriller ou Moonwalker. |

`applyCanonP0SourceKit(hero)` retourne exactement le même objet pour tout autre ID ; pour un ID concerné, il retourne une copie et conserve les valeurs numériques du kit. `getCanonP0SourcePlaque(hero)` fournit l'origine précise, le lore bilingue et une doctrine qui distingue adaptation et revue visuelle. L'intégration applique ces helpers aux héros jouables et à leurs plaques.

Quatorze tests ciblés vérifient les identités sauvegardées, valeurs numériques, chemins de sprites, différences entre incarnations, retrait d'armes incohérentes, vraie portée RPG, choix d'un seul adversaire, adaptations originales et absence de modification du héros appelant. Cinq tests supplémentaires vérifient les héros, plaques, dossiers, références candidates en attente et hashes publics sans réécriture du journal historique. Le lint ciblé passe ; le lot séparé des effets compte 69 tests réussis. Le build complet a réussi avec 922 tests Node dans 15 commandes, tous les audits de prébuild et le lint.

Les références réellement récupérées, leur type officiel/wiki, leurs réponses HTTP et SHA-256 sont conservés dans `canon-p0-source-kits-2026-10-01.json`. Les URL bloquées ou absentes restent des tentatives et ne sont pas promues en preuves. Une biographie générale ne vérifie pas à elle seule tous les costumes ou accessoires d'un arc précis : la revue des scènes/panels reste ouverte lorsque la preuve primaire manque.

**Les 25 P0 visuels restent ouverts.** Aucun PNG, manifeste ou registre de génération n'est modifié. Ces métadonnées ne valident pas les anciens personnages originaux de substitution ; les preuves de dossiers décrivant les anciens kits doivent être réconciliées séparément et rester pending jusqu'à revue.

Après le renommage de la scène Pirates, le registre compte 1 021 images disponibles et 2 178 pending. L'ancienne image de scène est conservée et le nouveau chemin attend une preuve adaptée. Les 19 dossiers de personnages restent pending.

Le lot adjacent a corrigé la scène Pirates #269, étiqueté `joker_face_mask` Death of the Family (Batman #13–17, 2012–2013) et précisé `blue_saber` ANH/ESB. Cette relique bleue conserve son ID et son image, n'altère pas l'arme du héros et ne remplace pas le sabre vert ROTJ. La [rupture de la malédiction de Pirates](pirates-curse-mechanics-2026-10-01.md) est désormais une condition de victoire. À poursuivre : désarmement/étourdissement réels, protection du Patronus contre les Détraqueurs, toxine Endgame, contraintes des attachments Spider et revue des sources primaires.
